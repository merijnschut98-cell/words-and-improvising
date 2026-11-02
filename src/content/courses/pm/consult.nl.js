// pm.consult (Nederlands): het adviesvak: offertes, prijs, de relatie als vertrouwde adviseur, onafhankelijkheid en ethiek, een klant laten groeien en je eigen praktijk opbouwen.
export default {
  lessons: [
    {
      id: 'pm.consult.proposal',
      title: 'Een offerte die wint',
      pre: [
        {
          q: 'Een klant leest je offerte van acht pagina’s. Welk deel bepaalt het meest of je hem wint?',
          options: ['Je aanpak en modellen', 'Je cv en referenties', 'De eerste pagina: hun probleem, in hun woorden, met hun getallen', 'De prijstabel'],
          answer: 'De eerste pagina: hun probleem, in hun woorden, met hun getallen',
          why: 'Niemand koopt een methode. Ze kopen hun eigen probleem opgelost, en op pagina één beslissen ze of je het begrepen hebt.',
        },
      ],
      teach: [
        'Een offerte wint op de eerste pagina. Begin met het probleem van de klant, in hun woorden en getallen: “14% van de geplande klussen wordt afgezegd; elke afzegging kost een ploegdag; jullie doel is 8% in Q4.” Leest de sponsor dat en denkt hij “ja, precies dat”, dan ben je al een heel eind. Je aanpak komt later.',
        'Dan de uitkomst en hoe je weet dat je er bent: de maatstaf, de nulmeting, het doel en wie er eigenaar van is. Dan de aanpak, in fases. Een goede eerste fase is kort en goedkoop: een diagnose van drie weken, 12 dagen, € 14.400, met aan het eind een go/no-go. Dat verlaagt het risico voor de klant én voor jou, want de rest prijs je pas als je de data gezien hebt.',
        'Schrijf op wat je van hen nodig hebt. De sponsor één uur per twee weken. Een vast aanspreekpunt één dag per week. Toegang tot de planningsdata in week 1. Twee sessies met de teamleiders. Dit zijn geen kleine lettertjes: veel projecten lopen uit omdat de klantkant niet leverde. Benoem je het vooraf, dan is het een gedeelde afspraak in plaats van later een excuus.',
        'Bied twee of drie opties, niet één: alleen de diagnose; diagnose plus een pilot in één regio; het volledige programma. Eén optie vraagt om ja of nee; opties vragen om een keuze tussen ja’s. Houd het op vijf of zes pagina’s. Loop de opzet vóór het versturen telefonisch door met de sponsor, zodat het document een gesprek bevestigt in plaats van er een te beginnen.',
      ],
      example: {
        kind: 'faded',
        text: 'Een operationeel directeur bij een verpakkingsfabrikant belt Vantage. Het omstellen op de twee thermovormlijnen gaat traag, de OEE zit rond de 58%, en ze heeft dit jaar € 60k budget. In de intake zei ze dat de echte zorg een grote klant is die dreigt volume weg te halen als de leverbetrouwbaarheid niet boven de 85% uitkomt. Haar inkoopafdeling wil drie offertes en “een helder plan met een vaste prijs”.',
        ask: 'Hoe zou jij de offerte opbouwen?',
        reveal: 'Begin met haar probleem: leverbetrouwbaarheid op 85%, een belangrijke klant die dreigt te vertrekken, en een OEE van rond de 58% op de twee lijnen als waarschijnlijke oorzaak. Noem de uitkomst: leverbetrouwbaarheid boven de 95% op een concrete datum. Fase 1: een diagnose van drie weken, 12 dagen, € 14.400 vast, die laat zien waar de verloren uren zitten. Fase 2 als twee opties met een prijsbandbreedte, die vast wordt na fase 1. Zet erin wat je nodig hebt: lijndata uit het MES, één dag per week van de productie-engineer, de sponsor elke twee weken. Blijf in totaal binnen de € 60k. Bel haar voor je het verstuurt, en vraag hoe inkoop de drie offertes gaat vergelijken.',
      },
      said: 'Wat je hoort in projecten: “Mooi document. Maar wat kopen we nou precies?”',
      recall: [
        {
          q: 'Je diagnose in fase 1 is 12 dagen à € 1.200 per dag. Wat is het bedrag, in euro’s?',
          number: 14400,
          tolerance: 1,
          unit: '€',
          why: '12 × € 1.200 = € 14.400.',
        },
        {
          q: 'Waarom bied je twee of drie opties in plaats van één?',
          options: ['Dan oogt de offerte steviger', 'Het maakt van ja-of-nee een keuze tussen ja’s', 'Inkoop eist dat altijd', 'Zo verstop je je echte prijs'],
          answer: 'Het maakt van ja-of-nee een keuze tussen ja’s',
          why: 'Met opties vergelijkt de klant manieren om met je te werken, in plaats van te beslissen óf hij met je werkt.',
        },
        {
          q: 'Waarom zet je in de offerte wat je van de klant nodig hebt?',
          options: ['Om je juridisch in te dekken', 'Zodat de prijs lager lijkt', 'Om te laten zien dat je georganiseerd bent', 'De klantkant is een veelvoorkomende reden dat projecten uitlopen, dus het moet een gedeelde afspraak zijn'],
          answer: 'De klantkant is een veelvoorkomende reden dat projecten uitlopen, dus het moet een gedeelde afspraak zijn',
          why: 'Benoemde afspraken worden ingepland; onbenoemde worden in maand twee het excuus.',
        },
        {
          q: 'Hoe ziet een eerste fase er meestal uit?',
          options: ['Kort, goedkoop en met een go/no-go aan het eind', 'De volledige scope met korting', 'Gratis, voor de goodwill', 'Zo lang mogelijk, om omzet vast te leggen'],
          answer: 'Kort, goedkoop en met een go/no-go aan het eind',
          why: 'Het verlaagt het risico voor beide kanten en je prijst de rest op echte data.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder, na een goede intake met een regiomanager. Ze zegt: “Stuur me vóór vrijdag iets. Houd het kort; mijn directeur moet tekenen.”',
        ask: 'Wat staat er op de eerste pagina, en wat doe je vóór vrijdag?',
        model: 'Op pagina één: haar probleem met haar getallen, de uitkomst waar we op mikken en hoe we die meten, en het besluit dat haar directeur moet nemen, met de prijs van fase 1. Vóór vrijdag bel ik haar: “Mag ik in tien minuten de opzet met je doorlopen, zodat er staat wat je directeur moet horen?” En ik vraag waar haar directeur meestal nee op zegt.',
        rubric: [
          'Opent met het probleem en de getallen van de klant, niet met Vantage',
          'Maakt het besluit en de prijs van fase 1 zichtbaar op pagina één',
          'Checkt de opzet met haar voordat hij hem verstuurt',
        ],
      },
      sayIt: 'Leg een nieuwe klant in 60 seconden uit waarom je een korte, betaalde diagnose voorstelt vóór het volledige project.',
      terms: [
        { term: 'Diagnosefase', def: 'Een korte, vaste eerste fase die het probleem toetst en eindigt met een go/no-go.' },
        { term: 'Inzet van de klant', def: 'Wat de klant moet leveren, zoals mensen, data en tijd van de sponsor, vastgelegd in de offerte.' },
        { term: 'Opties', def: 'Twee of drie manieren om het werk in te kopen, zodat de klant kiest hoe en niet óf.' },
      ],
    },
    {
      id: 'pm.consult.pricing',
      title: 'Prijs en scope',
      pre: [
        {
          q: 'Een klant vraagt 10% korting op je dagtarief van € 1.200, en je zegt meteen ja. Wat zegt dat meestal?',
          options: ['Dat er lucht in je prijs zat, dus je volgende prijs wordt ook betwist', 'Dat je flexibel bent en makkelijk samenwerkt', 'Niks; korting is normaal', 'Dat je de relatie belangrijk vindt'],
          answer: 'Dat er lucht in je prijs zat, dus je volgende prijs wordt ook betwist',
          why: 'Korting voor niks leert de klant dat je prijs een openingsbod is.',
        },
      ],
      teach: [
        'Drie manieren om te prijzen. Dagtarief: € 1.200 per gewerkte dag; simpel, het risico op uitloop ligt bij de klant, maar je wordt betaald voor uren, niet voor resultaat. Vaste prijs: € 48k voor een afgesproken scope; de klant weet wat het kost, jij draagt het risico. Waardegebaseerd: een fee gekoppeld aan wat het resultaat waard is, zeg € 80k voor een verandering van € 900k per jaar. Het meeste potentieel, maar alleen als de waarde meetbaar is en jij er genoeg invloed op hebt.',
        'Een vaste prijs is een gok op je schatting. Schat je 40 dagen, vraag je € 48k en kost het er 50, dan zakt je echte tarief naar € 960. Reken dus 15 tot 25% opslag voor wat je nog niet weet, en schrijf de scope strak op: opleveringen, aantal sessies, wat er buiten valt. Elke aanname die je opschrijft, zoals “data beschikbaar in week 1”, is een grond voor meerwerk als hij niet klopt.',
        'Bewaak de scope op het moment zelf, vriendelijk. Vraagt de klant om “nog één analyse”, zeg dan: “Doe ik graag. Het valt buiten wat we hebben afgesproken. Het is zo’n drie dagen; zal ik het als meerwerk toevoegen, of ruilen we het tegen de tweede workshop?” Eén keer gratis zet de prijs van alles daarna op nul.',
        'Korting. Tien procent van € 1.200 af betekent dat je 11% meer dagen moet werken voor hetzelfde geld. Geef je korting, ruil dan: een langere opdracht, een referentiecase met naam, sneller betalen, of minder scope. Nooit kale korting. En ga niet op de eerste fase zakken om het werk binnen te halen; dan leert de klant dat je prijs het begin van de onderhandeling is.',
      ],
      example: {
        kind: 'faded',
        text: 'Een plantdirecteur wil dat Vantage de uitval op een extrusielijn omlaag brengt. De uitval kost zo’n € 400k per jaar. Hij vraagt een vaste prijs. Jij schat 30 dagen als de kwaliteitsdata schoon is en 45 als dat niet zo is, en dat weet je pas in week 2. Je dagtarief is € 1.200. Hij laat vallen dat een concurrent € 30k offreerde.',
        ask: 'Hoe zou jij dit prijzen?',
        reveal: 'Gok niet op het schone scenario. Knip het op: een fase 1 van 8 dagen tegen een vaste prijs, € 9.600, inclusief het checken van de data. Daarna een vaste prijs voor fase 2 op basis van wat je vond: 22 dagen als de data schoon is, 37 als dat niet zo is, plus 15% opslag. Of bied een waardeoptie: een lagere vaste fee plus een bonus als de uitval met een afgesproken hoeveelheid daalt, gemeten door zijn controller. Over die € 30k: “Ik kan hun scope niet beoordelen. Laten we vergelijken wat elke offerte oplevert, en wie het risico draagt als de data slecht is.” Ga niet blind op dat getal zitten.',
      },
      said: 'Wat je hoort in projecten: “Kun je het voor een vaste prijs doen? En misschien iets scherper?”',
      recall: [
        {
          q: 'Je offreerde € 48k vast voor 40 geschatte dagen. Het werk kost 50 dagen. Wat is je effectieve dagtarief, in euro’s?',
          number: 960,
          tolerance: 1,
          unit: '€ per dag',
          why: '€ 48.000 gedeeld door 50 dagen is € 960 per dag, 20% onder je tarief.',
        },
        {
          q: 'Wanneer past een waardegebaseerde prijs goed?',
          options: ['Als de scope onduidelijk is', 'Als je risico wilt vermijden', 'Als de klant klein is', 'Als de waarde meetbaar is en jij genoeg invloed hebt op het resultaat'],
          answer: 'Als de waarde meetbaar is en jij genoeg invloed hebt op het resultaat',
          why: 'Kun je de waarde niet meten of beïnvloeden, dan wordt een waardefee een gok voor beide kanten.',
        },
        {
          q: 'Halverwege vraagt de klant om “nog één analyse” buiten de scope. Wat is de beste reactie?',
          options: ['Gratis doen, voor de goodwill', '“Dat valt buiten wat we afspraken; zo’n drie dagen. Zal ik het als meerwerk toevoegen, of ruilen we het tegen iets anders?”', 'Weigeren: scope is scope', 'Doen en het zonder iets te zeggen op de eindfactuur zetten'],
          answer: '“Dat valt buiten wat we afspraken; zo’n drie dagen. Zal ik het als meerwerk toevoegen, of ruilen we het tegen iets anders?”',
          why: 'Je zegt ja tegen de klant, noemt de kosten en laat hem kiezen.',
        },
        {
          q: 'Als je korting geeft, wat moet je er dan voor terugkrijgen?',
          options: ['Iets van waarde: een langere opdracht, een referentie, sneller betalen of minder scope', 'Niks; het is een gebaar van goodwill', 'Een mondelinge hint naar meer werk later', 'Een bedankje'],
          answer: 'Iets van waarde: een langere opdracht, een referentie, sneller betalen of minder scope',
          why: 'Geruilde korting houdt je prijs geloofwaardig; gratis korting holt hem uit.',
        },
      ],
      situation: {
        scene: 'Je zit bij een fabrikant, in week 4 van een project tegen een vaste prijs. De sponsor vraagt of je de tweede vestiging “even” meeneemt in de analyse.',
        ask: 'Wat zeg je?',
        model: '“Goed idee, en ik snap waarom. Het valt buiten onze vaste scope: de tweede vestiging is zo’n zes dagen extra, dus € 7.200. We kunnen het als meerwerk toevoegen, of het ruilen tegen de derde workshop en de prijs gelijk houden. Wat werkt voor jou het best?” Zijn keuze bevestig ik dezelfde dag per mail.',
        rubric: [
          'Verwelkomt het idee maar zegt duidelijk dat het buiten de scope valt',
          'Plakt er een aantal dagen en euro’s op',
          'Biedt een keuze en legt die schriftelijk vast',
        ],
      },
      sayIt: 'Leg een klant in 60 seconden het verschil uit tussen een dagtarief en een vaste prijs, en wie bij elk het risico draagt.',
      terms: [
        { term: 'Vaste prijs', def: 'Een afgesproken bedrag voor een afgesproken scope; de adviseur draagt het risico op uitloop.' },
        { term: 'Risico-opslag', def: 'Een extra 15 tot 25% op een vaste prijs voor wat je nog niet kunt weten.' },
        { term: 'Meerwerk', def: 'Een schriftelijke afspraak om scope toe te voegen of te ruilen, met de dagen en de prijs erbij.' },
        { term: 'Waardegebaseerde prijs', def: 'Een fee gekoppeld aan de meetbare waarde van het resultaat, niet aan de gewerkte dagen.' },
      ],
    },
    {
      id: 'pm.consult.trust',
      title: 'De vertrouwde adviseur',
      pre: [
        {
          q: 'Wat bouwt in de eerste maanden het snelst vertrouwen op bij een nieuwe klant?',
          options: ['In elk overleg je expertise laten zien', 'Kleine beloftes die je elke keer nakomt', 'Ook ’s avonds en in het weekend bereikbaar zijn', 'Een sterke referentie van een andere klant'],
          answer: 'Kleine beloftes die je elke keer nakomt',
          why: 'In het begin beoordelen klanten zelden je methode; ze beoordelen of ze op je kunnen bouwen.',
        },
      ],
      teach: [
        'Vertrouwen kun je opdelen in vier delen, uit het boek The Trusted Advisor van Maister, Green en Galford: geloofwaardigheid, betrouwbaarheid en intimiteit, gedeeld door zelfgerichtheid. Geloofwaardigheid: weet je waar je het over hebt? Betrouwbaarheid: doe je wat je zegt? Intimiteit: durven ze je te vertellen wat ze echt dwarszit? Zelfgerichtheid: ben je met hen bezig, of met jezelf, je fee en slim overkomen? Dat laatste deelt al het andere.',
        'Betrouwbaarheid bouw je in kleine dingen, en vroeg. Stuur de notulen dezelfde dag. Kom met de getallen die je beloofde. Zei je donderdag, dan is het donderdag, of je belt woensdag. Tien kleine nagekomen beloftes doen meer dan één briljante analyse.',
        'Intimiteit is het moeilijkst en het waardevolst. Je merkt het als de sponsor zegt: “Onder ons, ik weet niet of mijn plantmanager dit kan dragen.” Je verdient het door dingen voor je te houden, door eerlijk te zijn over je eigen twijfels, en door oprecht interesse te tonen in de persoon: “Wanneer is dit voor jou een goed jaar?” Gebruik wat ze je vertellen nooit tegen iemand.',
        'Zelfgerichtheid zie je in kleine dingen: elk gesprek naar je volgende fase sturen, over Vantage praten, gelijk willen hebben, hun zinnen afmaken. De oplossing is makkelijk gezegd en lastig gedaan: langer luisteren, nog één vraag stellen, en soms minder werk adviseren dan je zou kunnen verkopen. “Voor dit stuk heb je ons niet nodig; dat kan je planner.” Die zin verdient zich vele keren terug.',
      ],
      example: {
        kind: 'faded',
        text: 'Zes weken in een project bij een netbeheerder. Je analyse is sterk. Maar de sponsor heeft twee van je tweewekelijkse overleggen afgezegd, en een teamleider vertelt je dat ze je laatste rapport “een hoop slides” noemde. Terugkijkend heb je decks van 25 pagina’s twee dagen te laat gestuurd, en in overleggen vooral gepresenteerd.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Geloofwaardigheid is het probleem niet; betrouwbaarheid en intimiteit wel, en in die decks zit zelfgerichtheid. Verander het ritme: een update van één A4, dezelfde dag, elke keer. Vraag om 30 minuten, niet om te presenteren maar om te luisteren: “Ik heb het gevoel dat onze updates je niet helpen. Wat zou wel nuttig zijn?” Vraag dan wat haar bezighoudt buiten dit project. Houd de volgende drie beloftes klein en op tijd. Vraag het haar over een maand nog eens.',
      },
      said: 'Wat je hoort in projecten: “Slimme vent, maar ik weet nooit helemaal aan wiens kant hij staat.”',
      recall: [
        {
          q: 'Wat doet zelfgerichtheid in de vertrouwensformule?',
          options: ['Het telt op bij je geloofwaardigheid', 'Het deelt de andere drie, dus veel zelfgerichtheid verlaagt het vertrouwen', 'Het telt alleen in verkoopgesprekken', 'Het meet je expertise'],
          answer: 'Het deelt de andere drie, dus veel zelfgerichtheid verlaagt het vertrouwen',
          why: 'Hoe geloofwaardig je ook bent, een klant die voelt dat je voor jezelf werkt, houdt zich in.',
        },
        {
          q: 'De sponsor vertelt je in vertrouwen dat ze twijfelt aan haar plantmanager. Wat bouwt intimiteit op?',
          options: ['Het in de stuurgroep aankaarten zodat het opgelost wordt', 'Het tegen de plantmanager zeggen zodat hij kan verbeteren', 'Het in het projectrapport noteren', 'Het voor je houden en het alleen gebruiken om je eigen aanpak bij te sturen'],
          answer: 'Het voor je houden en het alleen gebruiken om je eigen aanpak bij te sturen',
          why: 'Een vertrouwen dat je bewaart, maakt het volgende vertrouwen mogelijk.',
        },
        {
          q: 'Wat verraadt het duidelijkst veel zelfgerichtheid?',
          options: ['Vragen naar de doelen van de klant voor dit jaar', 'De notulen dezelfde dag sturen', 'Elk overleg naar je volgende fase sturen', 'Toegeven dat je een getal niet weet'],
          answer: 'Elk overleg naar je volgende fase sturen',
          why: 'Het laat de klant zien dat je belangstelling bij je volgende factuur ligt.',
        },
        {
          q: 'Waarom kan minder betaald werk adviseren een klantrelatie laten groeien?',
          options: ['Het laat zien dat je het belang van de klant boven je fee zet, en dat verhoogt het vertrouwen', 'Het verlaagt je dagtarief', 'Klanten willen goedkope adviseurs', 'Zo ontloop je lastig werk'],
          answer: 'Het laat zien dat je het belang van de klant boven je fee zet, en dat verhoogt het vertrouwen',
          why: 'Lage zelfgerichtheid is zichtbaar en zeldzaam, en klanten onthouden het.',
        },
      ],
      situation: {
        scene: 'Je zit bij een fabrikant. Op de gang zegt de operationeel directeur: “Eerlijk gezegd weet ik niet of dit hele programma de reorganisatie overleeft.” Je tweede fase hangt ervan af.',
        ask: 'Wat zeg je?',
        model: '“Fijn dat je het me vertelt. Wat is er nodig om het te laten overleven, en wat heb je daarvoor van mij nodig?” Ik zou eerst luisteren en mijn fase 2 niet gaan verdedigen. Is het eerlijke antwoord dat het programma beter even stil kan liggen, dan help ik hem dat goed te regelen, want dat is wat hij onthoudt.',
        rubric: [
          'Luistert en vraagt door voordat hij zijn eigen werk verdedigt',
          'Gaat zorgvuldig om met wat in vertrouwen is gezegd',
          'Zet het belang van de klant boven de volgende fase',
        ],
      },
      sayIt: 'Leg een junior consultant in 60 seconden uit wat de vertrouwensformule is en welk deel de meeste adviseurs verkeerd doen.',
      terms: [
        { term: 'Vertrouwensformule', def: 'Geloofwaardigheid plus betrouwbaarheid plus intimiteit, gedeeld door zelfgerichtheid.' },
        { term: 'Zelfgerichtheid', def: 'Hoeveel je bezig bent met jezelf, je fee en gelijk krijgen in plaats van met de klant.' },
        { term: 'Intimiteit', def: 'Hoe veilig de klant zich voelt om je te vertellen wat hem echt dwarszit.' },
      ],
    },
    {
      id: 'pm.consult.independence',
      title: 'Onafhankelijkheid en ethiek',
      pre: [
        {
          q: 'Een softwareleverancier biedt Vantage 10% van de licentiewaarde voor elke klant die je doorverwijst. Wat is het probleem?',
          options: ['Geen, als de software goed is', 'Alleen als de klant erachter komt', 'Je advies is niet meer onafhankelijk, ook al geloof je zelf van wel', 'Het is in Nederland altijd verboden'],
          answer: 'Je advies is niet meer onafhankelijk, ook al geloof je zelf van wel',
          why: 'Geld van een derde buigt advies, en de klant kan niet meer zien of dat gebeurd is.',
        },
      ],
      teach: [
        'Je advies is alleen geld waard als het onafhankelijk is. Dat betekent: voor het advies dat je de klant geeft, krijg je van niemand anders geld dan van de klant. Heb je een band met een leverancier, een partner of een oud-werkgever, meld dat dan schriftelijk voordat je adviseert. Vooraf melden kost je niks; later betrapt worden kost je de klant en je naam.',
        'De klant vertellen wat hij niet wil horen. Bereid het voor: eerst de feiten, dan je conclusie, dan je advies. Zeg het eerst alleen tegen de sponsor, vóór welke groep dan ook. Zo zeg je het: “Ik moet je iets vertellen wat je niet leuk gaat vinden. De data laat zien dat de planningstool niet de reden is van de vele afzeggingen; het materiaalproces wel. Ik vertel het je liever nu dan straks waar de directie bij zit.” Stop dan en laat hem reageren.',
        'Belangenverstrengeling komt ook in stillere vormen. Voor twee concurrerende fabrikanten aan hetzelfde onderwerp werken. Ingehuurd worden om een al genomen besluit te “bevestigen”. Adviseren over een vervolgproject dat je zelf zou uitvoeren. De test: zou je het prima vinden als de klant je redenering en je factuur naast elkaar legt? Zo niet, meld het of stap terug.',
        'Vertrouwelijkheid: wat je bij de ene klant leert, blijft daar. Deel lessen anoniem, nooit namen, getallen of documenten. Vraag toestemming voordat je een klant als case gebruikt, en laat ze de tekst zien. Bij netbeheerders gelden ook regels voor netdata en beveiliging; vraag op dag één wat je waar mag opslaan.',
      ],
      example: {
        kind: 'faded',
        text: 'Een plantdirecteur heeft Vantage ingehuurd om een nieuw rooster “uit te rollen” dat hij al heeft aangekondigd. Uit jouw analyse blijkt dat het zo’n 6% output kost op de bottlenecklijn, omdat de overdrachten in het drukste uur vallen. Hij betaalt je factuur, en hij heeft je gevraagd volgende week bij de OR “draagvlak voor het plan” te presenteren.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Presenteer niets waar je zelf niet in gelooft, en overval hem ook niet. Bedenk dat de OR instemmingsrecht heeft op een werktijdenregeling (artikel 27 WOR), dus een gebrekkig plan dat als degelijk wordt verkocht, is ook voor hem een risico. Vraag deze week een uur met hem alleen. Laat de data zien: de timing van de overdracht en de 6% verlies. Bied dan een uitweg: schuif de overdracht 45 minuten op, of laat de diensten op de bottleneck overlappen, en het rooster kan alsnog werken. Zeg het gewoon: “Ik kan het plan presenteren met deze aanpassing. Ik kan het niet presenteren zoals het nu is en de OR vertellen dat het klopt.” De meeste directeuren respecteren dat. Doet hij dat niet, dan kun je beter deze opdracht kwijtraken dan je naam.',
      },
      said: 'Wat je hoort in projecten: “We willen eigenlijk alleen dat je bevestigt wat we al besloten hebben.”',
      recall: [
        {
          q: 'Wanneer meld je een band met een leverancier die je misschien gaat aanraden?',
          options: ['Schriftelijk, voordat je adviseert', 'Alleen als ernaar gevraagd wordt', 'Nadat het advies is overgenomen', 'Nooit, als het advies toch klopt'],
          answer: 'Schriftelijk, voordat je adviseert',
          why: 'Vooraf gemeld is het een feit dat de klant kan meewegen; later ontdekt is het vertrouwensbreuk.',
        },
        {
          q: 'Je hebt slecht nieuws voor de sponsor. Waar zeg je het als eerste?',
          options: ['In de stuurgroep, zodat iedereen het hoort', 'In het eindrapport', 'Tegen de sponsor alleen, vóór welke groep dan ook', 'Per mail, zodat het vastligt'],
          answer: 'Tegen de sponsor alleen, vóór welke groep dan ook',
          why: 'Zo heeft de sponsor ruimte om te reageren en te bepalen hoe hij het verder brengt, zonder gezichtsverlies.',
        },
        {
          q: 'Welke test helpt je belangenverstrengeling te herkennen?',
          options: ['Is het legaal?', 'Doen je concurrenten het ook?', 'Is de sponsor akkoord?', 'Zou de klant het prima vinden om je redenering en je factuur naast elkaar te leggen?'],
          answer: 'Zou de klant het prima vinden om je redenering en je factuur naast elkaar te leggen?',
          why: 'Het legt elke plek bloot waar je inkomen en je advies verschillende kanten op wijzen.',
        },
        {
          q: 'Je wilt het project van een oud-klant als case op je website zetten. Wat doe je?',
          options: ['Gebruiken, maar zonder de getallen', 'Toestemming vragen en ze eerst de tekst laten zien', 'Gebruiken als het project meer dan een jaar oud is', 'Alleen de sector noemen'],
          answer: 'Toestemming vragen en ze eerst de tekst laten zien',
          why: 'Het verhaal is deels van hen; met toestemming blijven de relatie en de vertrouwelijkheid heel.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder. De sponsor vraagt je een zin aan het eindrapport toe te voegen dat de nieuwe aannemer “goed gepresteerd” heeft. Jouw data laat zien dat de aannemer zo’n derde van de afzeggingen veroorzaakte.',
        ask: 'Wat zeg je?',
        model: '“Ik snap dat je die zin graag wilt, en ik wil het met de aannemer ook niet moeilijk maken. Maar de data laat zien dat zij zo’n derde van de afzeggingen veroorzaakten, dus dat kan ik niet opschrijven. Ik kan het feitelijk beschrijven en erbij zetten wat ze al verbeterd hebben. Zullen we samen naar de formulering kijken?”',
        rubric: [
          'Weigert iets op te schrijven wat niet waar is',
          'Laat de data zien en blijft respectvol',
          'Biedt een eerlijke alternatieve formulering',
        ],
      },
      sayIt: 'Leg een klant in 60 seconden uit waarom je hem soms dingen vertelt die hij niet wil horen, en waarom hij je daarvoor betaalt.',
      terms: [
        { term: 'Onafhankelijkheid', def: 'Alleen door de klant betaald worden voor je advies, zonder belang bij een bepaald antwoord.' },
        { term: 'Belangenverstrengeling', def: 'Een situatie waarin je eigen voordeel het advies kan buigen.' },
        { term: 'Melden', def: 'De klant vooraf en schriftelijk vertellen over elke band die je advies kan beïnvloeden.' },
      ],
    },
    {
      id: 'pm.consult.account',
      title: 'Een klant laten groeien',
      pre: [
        {
          q: 'Waar komt het meeste nieuwe werk van een gevestigde zelfstandige adviseur vandaan?',
          options: ['Bestaande klanten en mensen naar wie zij je doorverwijzen', 'Koude acquisitie bij nieuwe bedrijven', 'Openbare aanbestedingen', 'LinkedIn-posts'],
          answer: 'Bestaande klanten en mensen naar wie zij je doorverwijzen',
          why: 'Mensen huren in wie ze hebben zien werken, of wie iemand die ze vertrouwen heeft zien werken.',
        },
      ],
      teach: [
        'Een klant laten groeien is geen verkopen. Het is het werk zo goed en zo zichtbaar doen dat het volgende probleem vanzelf naar je toe komt. Een tweede project bij een klant die je kent, kost een paar uur praten; een nieuwe klant kan maanden aan gesprekken en offertes kosten.',
        'Volg op als het project klaar is: een belletje na 3 maanden en een bezoek na 6. “Hoe houdt het afzegpercentage zich? Glipt er iets weg?” Geen factuur, geen pitch. Het beschermt het resultaat, en het is vaak het moment waarop klanten het volgende probleem noemen: “Nu de planning loopt, is ons magazijn de puinhoop.” Dat is een aangrenzend probleem, en jij hoorde het als eerste.',
        'Aangrenzende problemen zijn de eerlijke route. Je ziet ze tijdens het werk: de onderhoudsachterstand achter de OEE-verliezen, de slechte data achter de planningsproblemen. Noteer ze, en breng ze één keer in, op het goede moment, meestal bij de afsluiting: “Twee dingen die ik zag die buiten onze scope vallen, maar die je moet weten.” Laat de klant dan beslissen of hij hulp wil, en van wie.',
        'Verbreed de relaties. Ken je alleen de sponsor, dan stopt de klant als zij van baan wisselt. Bouw echt contact op met twee of drie anderen: de controller, de lijnmanager die de baten bezit, de IT-lead. Niet met lunches, maar door in het project nuttig voor ze te zijn. En als iemand met wie je werkte naar een ander bedrijf gaat, feliciteer hem; daar komt je volgende klant vaak vandaan.',
      ],
      example: {
        kind: 'faded',
        text: 'Vantage sloot in juni een succesvol project af bij een levensmiddelenproducent: omsteltijden 40% korter. Sindsdien niks. Het is nu oktober. Je sponsor, de operationeel manager, is net gepromoveerd tot plantdirecteur. Tijdens het project zag je dat hun onderhoud vooral reactief is: zo’n 60% van de onderhoudsuren gaat naar storingen.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Feliciteer haar persoonlijk met de promotie en vraag haar voor een kop koffie, niet voor een afspraak. Begin bij het oude resultaat: “Hoe houden de omstellingen zich?” Zijn ze teruggezakt, bied dan een uurtje hulp aan, gratis. Dan, als het moment goed is: “Toen we aan de lijnen werkten, zag ik dat zo’n 60% van de onderhoudsuren naar storingen gaat. Staat dat nu op je lijstje?” Neem geen offerte mee. Heeft ze interesse, stel dan een korte diagnose voor, net als de vorige keer. En leer de nieuwe operationeel manager kennen die haar oude baan heeft overgenomen.',
      },
      said: 'Wat je hoort in projecten: “Grappig dat je belt. We hadden het net over ons magazijn.”',
      recall: [
        {
          q: 'Wat is het beste moment om problemen in te brengen die je buiten je scope zag?',
          options: ['Midden in het project, om het te laten groeien', 'Nooit; het lijkt op verkopen', 'Bij de afsluiting, één keer, en de klant laten beslissen', 'In een apart verkoopgesprek'],
          answer: 'Bij de afsluiting, één keer, en de klant laten beslissen',
          why: 'Eén keer op het goede moment is het advies; steeds opnieuw pushen is verkopen.',
        },
        {
          q: 'Waarom neem je 3 en 6 maanden na een project contact op?',
          options: ['Om een factuur te sturen voor extra ondersteuning', 'Om het resultaat te beschermen, en omdat klanten dan vaak het volgende probleem noemen', 'Omdat het contract het voorschrijft', 'Om om een testimonial te vragen'],
          answer: 'Om het resultaat te beschermen, en omdat klanten dan vaak het volgende probleem noemen',
          why: 'Het contact dient eerst de klant; de volgende vraag volgt daar vaak uit.',
        },
        {
          q: 'Je enige contact bij een klant is de sponsor. Wat is het risico?',
          options: ['Geen; de sponsor beslist', 'Het project wordt duurder', 'De klant raakt op je uitgekeken', 'De klantrelatie stopt als zij vertrekt of van rol wisselt'],
          answer: 'De klantrelatie stopt als zij vertrekt of van rol wisselt',
          why: 'Een relatie die aan één persoon hangt, is maar zo stabiel als die persoon zijn baan.',
        },
        {
          q: 'Wat is een aangrenzend probleem?',
          options: ['Een probleem dicht bij wat je oploste, dat je tijdens het werk zag', 'Een probleem bij een concurrent van de klant', 'Elke nieuwe verkoopkans', 'Een probleem dat de klant al heeft opgelost'],
          answer: 'Een probleem dicht bij wat je oploste, dat je tijdens het werk zag',
          why: 'Je hebt er bewijs voor en context die de klant vertrouwt, dus inbrengen is advies, geen pitch.',
        },
      ],
      situation: {
        scene: 'Je zit bij een netbeheerder en sluit een project af. De regiomanager zegt: “Mooi werk. We laten het weten als we nog iets nodig hebben.”',
        ask: 'Wat zeg je voordat je vertrekt?',
        model: '“Dank je. Ik zou je over drie maanden graag bellen om te kijken hoe de cijfers zich houden, zonder verplichtingen. En twee dingen die ik buiten onze scope zag: de overdrachten met de aannemer en de kwaliteit van de storingsdata. Geen van beide is vandaag urgent, maar ze gaan beperken wat je hieruit haalt. Ik loop ze graag met je door wanneer het jou uitkomt.”',
        rubric: [
          'Spreekt een concreet moment af om op te volgen, zonder verkooppraatje',
          'Noemt de aangrenzende problemen één keer en kort',
          'Laat de keuze bij de klant',
        ],
      },
      sayIt: 'Leg een collega-zzp’er in 60 seconden uit hoe je een klant laat groeien zonder te verkopen.',
      terms: [
        { term: 'Klantrelatie (account)', def: 'Een klantorganisatie waar je langere tijd mee werkt, over meerdere projecten en mensen.' },
        { term: 'Aangrenzend probleem', def: 'Een probleem dicht bij wat je oploste, dat je zag terwijl je het werk deed.' },
        { term: 'Opvolging', def: 'Onbetaald contact na een project om te checken of het resultaat standhoudt, zonder pitch.' },
      ],
    },
    {
      id: 'pm.consult.practice',
      title: 'Je eigen praktijk opbouwen',
      pre: [
        {
          q: 'Een zelfstandig adviseur heeft na vakantie en ziekte zo’n 200 werkdagen per jaar. Hoeveel kan hij er ongeveer factureren?',
          options: ['Zo’n 200', 'Zo’n 180', 'Zo’n 120 tot 140', 'Zo’n 80'],
          answer: 'Zo’n 120 tot 140',
          why: 'Acquisitie, administratie, schrijven en bijleren kosten 30 tot 40% van je tijd, en die dagen betaalt niemand.',
        },
      ],
      teach: [
        'Doe eerst de capaciteitssom. Na vakantie, feestdagen en ziekte blijven er zo’n 200 dagen over. Acquisitie, administratie, schrijven en bijleren kosten 30 tot 40%. Dan houd je 120 tot 140 declarabele dagen over. Bij € 1.200 per dag en 130 dagen is je omzet € 156k, vóór kosten en belasting. Reken de eerste jaren op minder, want je bent meer met acquisitie bezig. Het betekent ook: drie of vier klanten tegelijk, geen acht.',
        'Positionering is kiezen voor wie je er bent: “Ik help netbeheerders en fabrikanten hun prestatiecijfers om te zetten in sturing waar het management op handelt.” Smal voelt riskant, maar een smalle positie is makkelijker te onthouden en door te vertellen. Een plantdirecteur onthoudt geen “adviseur”; hij onthoudt “die man die ons afzegpercentage heeft opgelost”.',
        'Cases zijn je sterkste materiaal. Eén A4 per case: de situatie in getallen, wat je deed, het resultaat in getallen, en een zin van de klant, met toestemming. “Afzeggingen van 14% naar 9% in zes maanden.” Drie stevige cases zijn beter dan een website vol diensten. Verzamel de getallen en de toestemming bij de afsluiting; later is te laat.',
        'Bouw je netwerk bewust op: oud-collega’s, klanten die verder zijn gegaan, twee of drie partners die werk naar jou doorsturen en jij naar hen. Wint één op de drie offertes en heb je zes projecten per jaar nodig, dan heb je zo’n 18 offertes nodig. Houd dat maandelijks bij; zakt het, dan komen de lege maanden ongeveer een kwartaal later.',
        'Zeg nee tegen het verkeerde werk: buiten je positie, een sponsor die bevestiging wil in plaats van verandering, of een prijs die alleen werkt als alles meezit. Zo zeg je het: “Hier ben ik niet het sterkst in; ik raad je iemand aan die dat wel is.” Een verkeerd project kost niet alleen de dagen, maar ook de case die je in die tijd had kunnen bouwen.',
      ],
      example: {
        kind: 'faded',
        text: 'Je eerste jaar als Vantage. Je hebt voor de komende zes maanden 60 declarabele dagen geboekt, bij twee klanten. Een groot ingenieursbureau biedt je 100 dagen onderaanneming aan tegen € 850 per dag, voor algemene projectadministratie bij een IT-migratie. Een netbeheerder waar je heel graag voor wilt werken, heeft het over een diagnose over drie maanden, misschien 15 dagen à € 1.200.',
        ask: 'Wat zou jij afwegen, en wat zou je besluiten?',
        reveal: 'Reken het uit. De onderaanneming is € 85.000 en vult je agenda: vaste inkomsten, maar tegen € 850, buiten je positie, en met bijna geen ruimte meer voor de netbeheerder of voor acquisitie. Met 60 dagen al geboekt maken 100 extra er 160 in een jaar, meer dan je echt kunt declareren, en zonder tijd om cases te bouwen. Opties: onderhandel het omlaag, bijvoorbeeld twee dagen per week gedurende vier maanden, zo’n 35 dagen of € 29.750, dan blijft er ruimte voor de diagnose en je netwerk. Of zeg nee en steek de tijd in het binnenhalen van de netbeheerder. Is het geld krap, dan is de halve deal het eerlijke midden. Hoe dan ook: besluit op je positie, niet alleen op je agenda.',
      },
      said: 'Wat je hoort in projecten: “Dus wat doe je nou precies?”',
      recall: [
        {
          q: 'Je factureert 130 dagen per jaar à € 1.200 per dag. Wat is je jaaromzet, in duizenden euro’s?',
          number: 156,
          tolerance: 1,
          unit: 'k€',
          why: '130 × € 1.200 = € 156.000, vóór kosten en belasting.',
        },
        {
          q: 'Eén op de drie offertes wordt gegund, en je hebt zes projecten per jaar nodig. Hoeveel offertes moet je schrijven?',
          number: 18,
          tolerance: 1,
          unit: 'offertes',
          why: '6 projecten × 3 offertes per gunning = 18.',
        },
        {
          q: 'Wat maakt een case sterk?',
          options: ['Een lijst met alle diensten die je aanbiedt', 'De situatie en het resultaat in getallen, wat je deed, en een quote van de klant met toestemming', 'Een lange beschrijving van je methode', 'Alleen het logo van de klant'],
          answer: 'De situatie en het resultaat in getallen, wat je deed, en een quote van de klant met toestemming',
          why: 'Getallen en de eigen woorden van een klant zijn bewijs; een lijst diensten is een bewering.',
        },
        {
          q: 'Waarom kies je als nieuwe praktijk een smalle positie?',
          options: ['Dan heb je minder klanten, dus minder werk', 'Klanten willen liever generalisten', 'Dan kun je elke prijs vragen', 'Je bent makkelijker te onthouden en door te vertellen'],
          answer: 'Je bent makkelijker te onthouden en door te vertellen',
          why: 'Doorverwijzingen hangen ervan af dat mensen precies weten wanneer ze aan je moeten denken.',
        },
      ],
      situation: {
        scene: 'Je bent op een netwerkbijeenkomst voor de maakindustrie. Een plantmanager vraagt: “En wat doet Vantage?”',
        ask: 'Wat zeg je?',
        model: '“Ik help fabrikanten en netbeheerders hun prestatiecijfers om te zetten in sturing. Bij een netbeheerder kregen we bijvoorbeeld de afgezegde klussen in zes maanden van 14% naar 9%. Waar zijn jullie dit jaar in de fabriek mee bezig?” Dan luister ik, en als het past, vraag ik of ik hem volgende week mag bellen.',
        rubric: [
          'Positioneert Vantage in één zin met een duidelijke doelgroep',
          'Geeft één concreet resultaat met getallen',
          'Schakelt snel naar het probleem van de ander',
        ],
      },
      sayIt: 'Leg een vriend in 60 seconden uit waarom een adviseur met 130 declarabele dagen per jaar toch nee moet zeggen tegen werk.',
      terms: [
        { term: 'Positionering', def: 'Een heldere keuze voor welke klanten en welke problemen je er bent.' },
        { term: 'Declarabele dagen', def: 'De dagen die een klant betaalt, voor een zelfstandige meestal 120 tot 140 per jaar.' },
        { term: 'Case', def: 'Een verhaal van één A4 over een project, met getallen ervoor en erna, gebruikt met toestemming.' },
        { term: 'Pijplijn', def: 'De gesprekken en offertes die de komende maanden je werk worden.' },
      ],
    },
  ],
};

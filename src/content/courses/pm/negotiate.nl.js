// pm.negotiate (Nederlands): onderhandelen en voet bij stuk houden: belangen, alternatieven, het eerste bod, scope met een klant, nee zeggen, en het oneens zijn met iemand die hoger staat.
export default {
  lessons: [
    {
      id: 'pm.negotiate.interests',
      title: 'Standpunten en belangen',
      pre: [
        {
          q: 'Twee teamleiders claimen allebei de enige vrije vergaderruimte op donderdagmiddag. Wat vraag je als eerste?',
          options: ['Wie heeft hem het eerst geboekt?', 'Waar heeft ieder van hen de ruimte voor nodig?', 'Wie van de twee staat hoger?', 'Willen ze een muntje opgooien?'],
          answer: 'Waar heeft ieder van hen de ruimte voor nodig?',
          why: 'Hun behoeften passen misschien gewoon naast elkaar: de een heeft een scherm nodig, de ander alleen rust. Dat weet je pas als je naar het waarom vraagt.',
        },
      ],
      teach: [
        'Een standpunt is wat iemand zegt te willen: “We moeten het rapport vrijdag hebben”, “De prijs moet 10% omlaag”. Een belang is waarom hij dat wil: een directieoverleg op maandag, een bezuiniging die hij moet laten zien.\n\nRoger Fisher en William Ury noemen hun methode principieel onderhandelen, ook wel de Harvard-methode (Getting to Yes, 1981): wie over standpunten onderhandelt, graaft zich in; wie naar belangen kijkt, ziet ruimte voor opties.',
        'Vraag waarom, en waarom niet. “Wat levert dat je op?” “Wat gebeurt er als het geen vrijdag wordt?” “Waar maak je je zorgen over?”\n\nLuister naar behoeften als zekerheid, erkenning, grip, geld en tijd. De meeste belangen kun je op meer dan één manier dienen. Schrijf die van de ander op naast die van jezelf.',
        'Gedeelde en verschillende belangen helpen allebei. Gedeeld: jullie willen allebei dat het project slaagt. Verschillend: de een vindt timing het belangrijkst, de ander de kosten.\n\nDoor verschillen kun je ruilen: geef wat voor jou goedkoop is en voor de ander veel waard. Leg meerdere punten tegelijk op tafel, een pakketdeal, zodat wat je op het ene punt geeft, terugkomt op een ander. Eén punt tegelijk maakt van elke stap winnen of verliezen.',
        'Gebruik een eerlijke maatstaf in plaats van wilskracht: een marktprijs, data uit het verleden, een afgesproken norm. “Wat zou hier redelijk zijn, en hoe kunnen we dat checken?” Dan gaat het gesprek niet meer over wie de sterkste is maar over wat redelijk is, en kunnen beide partijen ja zeggen zonder gezichtsverlies.',
        'Wat je in de praktijk ziet: standpunten die als feit worden gebracht (“Mijn ploegen gaan dat niet doen”), en mensen die al snel het verschil delen omdat dat eerlijk voelt. Dat gaat snel, maar beloont wie het extreemst opende.\n\nDeskundigen verschillen over hoe rationeel dit allemaal is. Chris Voss, oud-gijzelingsonderhandelaar van de FBI (Never Split the Difference, 2016), zegt dat emoties beslissen: luister eerst en benoem het gevoel. Een scherpe vraag: “Als je precies dit krijgt, wat lost dat dan voor je op?”',
      ],
      example: {
        kind: 'faded',
        text: 'Bij een netbeheerder (grid operator), het bedrijf dat het regionale stroomnet beheert, wil je dat elke klus twee dagen voor de start op gereedheid wordt gecheckt: zijn vergunningen, materiaal en het schakelplan rond? Het hoofd uitvoering, de baas van de monteursploegen, zegt: “Jouw gereedheidscheck (readiness check) kost bij elke klus een dag extra. Mijn ploegen gaan dat niet doen.”',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Zijn standpunt is “geen dag extra”. Vraag naar het belang: “Wat zou die dag je kosten?” Stel dat blijkt dat hij bang is dat ploegen stilzitten en dat planners hen dan de schuld geven.\n\nJouw belang is minder ritten voor niks. Een optie die beide dient: de planners doen de check, en ploegen krijgen alleen klussen die erdoor komen. Stel een pilot voor, een proef van vier weken in één regio, en spreek een eerlijke maatstaf af om hem te beoordelen: het aantal ritten voor niks, ervoor en erna.',
      },
      said: 'Wat je hoort in projecten: “Help me even begrijpen wat daarachter zit. Wat levert vrijdag je op?”',
      recall: [
        {
          q: 'Welke van deze is een belang en geen standpunt?',
          options: ['“De prijs moet 10% omlaag”', '“We moeten het rapport vrijdag hebben”', 'Voor de begrotingsronde een besparing aan de directie kunnen laten zien', '“Een tweede fase accepteren we niet”'],
          answer: 'Voor de begrotingsronde een besparing aan de directie kunnen laten zien',
          why: 'Dat is de reden achter een eis. De andere drie zijn eisen, en die kun je alleen accepteren of weigeren.',
        },
        {
          q: 'Welke vraag brengt het meest waarschijnlijk een belang boven?',
          options: ['“Is dat je laatste bod?”', '“Wat levert dat je op?”', '“Kun je nog wat zakken?”', '“Ben je het ermee eens?”'],
          answer: '“Wat levert dat je op?”',
          why: 'Die vraagt naar de reden achter de eis. De andere testen alleen het standpunt.',
        },
        {
          q: 'Waarom zijn verschillen in belangen nuttig bij een onderhandeling?',
          options: ['Ze laten zien wie gelijk heeft', 'Ze maken ruilen mogelijk: geef wat voor jou goedkoop is en voor de ander veel waard', 'Ze geven je een reden om het besluit uit te stellen', 'Ze bewijzen dat de ander onredelijk is'],
          answer: 'Ze maken ruilen mogelijk: geef wat voor jou goedkoop is en voor de ander veel waard',
          why: 'Als beide partijen dezelfde dingen even zwaar wegen, is elke winst het verlies van de ander. Verschillen maken ruimte voor deals.',
        },
        {
          q: 'Jij en een klant zijn het oneens over hoeveel dagen een locatieanalyse mag kosten. Welke eerlijke maatstaf beslecht dat?',
          options: ['Wie hoger in rang staat, beslist', 'Het verschil delen', 'Het werkelijke aantal dagen van drie vergelijkbare analyses vorig jaar', 'Het getal dat de klant als eerste noemde'],
          answer: 'Het werkelijke aantal dagen van drie vergelijkbare analyses vorig jaar',
          why: 'Data uit het verleden is een maatstaf die beide partijen kunnen checken, los van wie het hardst duwt.',
        },
      ],
      situation: {
        scene: 'Bij een onderdelenfabrikant weigert de productiemanager volgende week twee operators vrij te maken voor je verbeterworkshop: “Geen sprake van. We lopen achter op de grote vrachtwagenorder.”',
        ask: 'Hoe reageer je?',
        model: 'Ik zou die order serieus nemen en ernaar vragen: “Hoeveel lopen jullie achter, en waar zit het vast?” Zijn belang is op tijd leveren; het mijne is input van de mensen die de lijn kennen. Opties: de workshop in twee kortere sessies nadat de order de deur uit is, of operators uit de ploeg die niet op die order zit. Ik zou vragen wat voor hem beter werkt.',
        rubric: [
          'Vraagt naar het belang achter zijn weigering',
          'Benoemt beide belangen',
          'Biedt opties die beide dienen, en laat hem kiezen',
        ],
        pushback: {
          lines: [
            'Ik heb geen opties nodig. Ik heb iedereen aan de lijn nodig tot deze order de deur uit is. Punt.',
            'Elke consultant vindt zijn workshop belangrijk. Waarom zou die van jou voor een klant gaan?',
          ],
          model: 'Terecht, de klant gaat voor, en ik wil die order niet in gevaar brengen. Ik heb wel twee mensen nodig die de lijn kennen, anders krijg je adviezen die niet passen. Wanneer verwacht je dat de order de deur uit is? Dan plan ik de workshop in de eerste twee dagen daarna, en houd ik hem op twee uur.',
          rubric: [
            'Erkent dat de order voorgaat',
            'Herhaalt waarom operators nodig zijn voor een bruikbaar resultaat',
            'Stelt een concreet moment na de order voor, kort gehouden',
          ],
        },
      },
      sayIt: 'Leg een collega in 60 seconden het verschil uit tussen een standpunt en een belang, met een voorbeeld van een klant.',
      terms: [
        { term: 'Standpunt', def: 'Wat iemand zegt te willen; een eis die je alleen kunt accepteren of weigeren.' },
        { term: 'Belang', def: 'Waarom iemand het wil: de behoefte achter het standpunt.' },
        { term: 'Eerlijke maatstaf', def: 'Een meetlat die beide partijen kunnen checken, zoals marktprijzen of data uit het verleden.' },
        { term: 'Principieel onderhandelen', def: 'De methode van Fisher en Ury (Harvard-methode): mens en probleem scheiden, naar belangen kijken, opties bedenken, eerlijke maatstaven gebruiken.' },
        { term: 'Pakketdeal', def: 'Meerdere punten samen onderhandelen, zodat je wat je op het ene punt geeft kunt ruilen tegen winst op een ander.' },
      ],
    },
    {
      id: 'pm.negotiate.batna',
      title: 'Jouw alternatief en dat van hen',
      pre: [
        {
          q: 'Wat is je BATNA bij een onderhandeling?',
          options: ['Je openingsbod', 'Wat je echt gaat doen als deze onderhandeling zonder akkoord eindigt', 'De laagste prijs die je accepteert', 'Het budget van de andere partij'],
          answer: 'Wat je echt gaat doen als deze onderhandeling zonder akkoord eindigt',
          why: 'Best Alternative To a Negotiated Agreement. Het bepaalt hoe sterk je staat, want het bepaalt wanneer weglopen beter is.',
        },
      ],
      teach: [
        'BATNA staat voor Best Alternative To a Negotiated Agreement, het beste alternatief zonder akkoord (Fisher en Ury, Getting to Yes, 1981). Het is wat je echt gaat doen als je wegloopt. Je BATNA, niet je wensen, bepaalt hoe sterk je staat.\n\nMet een goed alternatief kun je rustig nee zeggen. Met een slecht alternatief maak je dat eerst beter, voordat je gaat onderhandelen.',
        'Je ondergrens (walk-away point, of reservation point) is de slechtste deal die je nog accepteert, en die volgt uit je BATNA.\n\nStel dat een klant €950 per dag biedt, en je hebt voor dezelfde dagen een vast aanbod elders van €1.000 per dag. Als verder alles gelijk is, sta je er met minder dan €1.000 slechter voor. Bepaal dit vóór het gesprek, niet tijdens.',
        'Schat ook die van hen in. Wat gebeurt er met hen zonder deal: een andere leverancier, het zelf doen, wachten?\n\nDe ruimte tussen jouw ondergrens en die van hen is de ZOPA, de zone waarin een akkoord mogelijk is. Is die er niet, dan maakt geen enkele slimme formulering een deal; verander dan wat er op tafel ligt.',
        'Bluf niet met een alternatief dat je niet hebt. Noem een echt alternatief rustig, als informatie, niet als dreigement: “Als we hier niet uitkomen, doen we het volgend jaar.” En werk op de achtergrond aan je BATNA: een tweede echte optie is het sterkste middel dat je hebt.',
        'Overstapkosten zijn wat het een partij kost om van partner te wisselen: tijd, inwerken, en bij onderdelen vaak kwalificatie, het testen en goedkeuren van onderdelen van een nieuwe leverancier voordat ze gebruikt mogen worden. Hoge overstapkosten maken een alternatief zwakker, hoe stoer er ook gepraat wordt.\n\nVeelgemaakte fout: je eigen BATNA overschatten, of vergeten wat het kost om er te komen. Moet je hem noemen? Gangbaar advies: een sterke rustig laten zien, een zwakke voor je houden. Scherpe vraag: “Wat doen we maandag echt als ze nee zeggen?”',
      ],
      example: {
        kind: 'faded',
        text: 'Een onderdelenfabrikant koopt gecoate beugels bij één leverancier, en die kondigt een prijsverhoging van 12% aan. Een tweede leverancier heeft een prijs geoffreerd van 4% boven de huidige, maar heeft 10 weken nodig om de onderdelen te kwalificeren. Zelf coaten kan niet.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Je BATNA is overstappen naar de tweede leverancier na 10 weken kwalificatie. Die van hen is jouw volume kwijtraken.\n\nStart de kwalificatie nu al: dat verbetert je alternatief, hoe het ook loopt. Onderhandel dan: vraag wat achter de 12% zit (energie, grondstof?) en stel bijvoorbeeld 4% nu voor, met een indexclausule (index clause): een regel in het contract die een deel van de prijs laat meebewegen met een gepubliceerde energieprijsindex. Je ondergrens ligt rond de 4% van de tweede leverancier plus de kosten van het kwalificeren.',
      },
      said: 'Wat je hoort in projecten: “Voordat we naar binnen gaan: wat doen we als ze nee zeggen?”',
      recall: [
        {
          q: 'Wat is de ZOPA?',
          options: ['Je openingsbod min je ondergrens', 'De ruimte waarin een akkoord mogelijk is: tussen jouw ondergrens en die van hen', 'Het gemiddelde van beide openingsbiedingen', 'De tijd die nog over is tot de deadline'],
          answer: 'De ruimte waarin een akkoord mogelijk is: tussen jouw ondergrens en die van hen',
          why: 'Elke deal daarbinnen is voor beide partijen beter dan weglopen. Daarbuiten is één partij beter af zonder deal.',
        },
        {
          q: 'Je bent zelfstandig consultant. Het laagste dagtarief dat je accepteert is €900. Het hoogste dagtarief dat de klant wil betalen, wat jij niet weet, is €1.050. Hoe breed is de zone waarin een akkoord mogelijk is, in euro per dag?',
          number: 150,
          tolerance: 0.5,
          unit: '€ per dag',
          why: 'Elk tarief tussen €900 en €1.050 werkt voor allebei: €1.050 − €900 = €150 per dag.',
        },
        {
          q: 'Je hebt een vast aanbod om dezelfde dagen voor een andere klant te werken voor €1.000 per dag. Klant A biedt €950 per dag. Ga ervan uit dat de twee klussen verder in alles gelijk zijn: reistijd, hoe leuk het werk is, de relatie. Wat doe je?',
          options: ['Accepteren: een deal is beter dan geen deal', 'Afslaan of omhoog onderhandelen: het ligt onder je alternatief', 'Accepteren en later om meer vragen', 'Het verschil delen op €975'],
          answer: 'Afslaan of omhoog onderhandelen: het ligt onder je alternatief',
          why: 'Met verder alles gelijk sta je er met €950 slechter voor dan met je alternatief van €1.000. Je BATNA bepaalt je ondergrens.',
        },
        {
          q: 'Je alternatief is zwak. Wat doe je het best vóór de onderhandeling?',
          options: ['Het verbergen en zelfverzekerd doen', 'Bluffen over een beter aanbod', 'Het verbeteren, bijvoorbeeld door een tweede echte optie te regelen', 'Het eerste bod accepteren om geen risico te lopen'],
          answer: 'Het verbeteren, bijvoorbeeld door een tweede echte optie te regelen',
          why: 'Je kracht komt uit wat je echt kunt doen zonder deal. Een bluf kan doorzien worden; een echte optie niet.',
        },
      ],
      situation: {
        scene: 'Je engagement manager, de manager bij jouw bureau die verantwoordelijk is voor deze klant, vertelt dat de klant 15% korting wil op het tarief voor de volgende fase, “anders gaan ze ergens anders heen”. Het gesprek met de klant is donderdag. Jij weet dat het team van de klant afhankelijk is van jullie datamodel, en dat een ander bureau zo’n drie maanden nodig heeft om het opnieuw te bouwen.',
        ask: 'Wat adviseer je je engagement manager?',
        model: 'Ik zou zeggen dat hun alternatief zwakker is dan het klinkt: overstappen kost ze ongeveer drie maanden. Dus we hoeven de 15% niet meteen te accepteren. Ik zou vragen wat erachter zit, misschien een budgetplafond, en een ruil aanbieden: een lager tarief voor een kleinere scope, of hetzelfde tarief met een overdracht van het model, zodat ze minder van ons afhangen. En we moeten vóór het gesprek onze eigen ondergrens afspreken.',
        rubric: [
          'Schat het alternatief van de klant realistisch in',
          'Vraagt naar het belang achter de eis',
          'Stelt een ruil voor en een vooraf bepaalde ondergrens',
        ],
        pushback: {
          lines: [
            'Je bent junior, je ziet niet hoe snel klanten weglopen. Ik geef liever wat toe dan dat ik de klant kwijtraak.',
            'En over hun overstapkosten beginnen klinkt alsof we ze gijzelen.',
          ],
          model: 'Jij kent deze klant veel beter dan ik, en ik wil de klant ook niet kwijt. Ik zeg niet dat we weigeren; ik zeg dat 15% voor hetzelfde werk niet onze enige zet is. Over overstapkosten beginnen we ook niet tegen hen. We vragen wat het budget is en bieden een kleinere scope. Zullen we vóór het gesprek van donderdag ons laagste getal afspreken?',
          rubric: [
            'Erkent het risico de klant te verliezen en zijn ervaring',
            'Herhaalt dat korting zonder meer niet de enige optie is',
            'Stelt voor de ondergrens vóór het gesprek af te spreken',
          ],
        },
      },
      sayIt: 'Leg een collega in 60 seconden uit wat een BATNA is, en waarom je de jouwe moet kennen voordat een onderhandeling begint.',
      terms: [
        { term: 'BATNA', def: 'Best Alternative To a Negotiated Agreement: wat je echt gaat doen zonder deal.' },
        { term: 'Ondergrens', def: 'De slechtste deal die je nog accepteert; die volgt uit je BATNA.' },
        { term: 'ZOPA', def: 'Zone of possible agreement: de ruimte tussen de ondergrenzen van beide partijen.' },
        { term: 'Overstapkosten', def: 'Wat het kost om van leverancier of partner te wisselen: tijd, inwerken, kwalificatie, gemiste productie.' },
        { term: 'Kwalificatie', def: 'Het testen en goedkeuren van de onderdelen of het proces van een nieuwe leverancier voordat ze in productie gebruikt mogen worden.' },
      ],
    },
    {
      id: 'pm.negotiate.anchor',
      title: 'Het eerste bod en framing',
      pre: [
        {
          q: 'Welke partij komt volgens onderzoek naar onderhandelen meestal beter uit een onderhandeling?',
          options: ['De partij die wacht tot de ander een getal noemt', 'De partij die een goed onderbouwd eerste bod doet', 'De partij die het meest praat', 'Geen van beide: een eerste bod maakt niet uit'],
          answer: 'De partij die een goed onderbouwd eerste bod doet',
          why: 'Een eerste bod werkt als anker en voorspelt sterk waar de deal uitkomt, zoals Galinsky en Mussweiler in 2001 lieten zien.',
        },
      ],
      teach: [
        'Verankering (Tversky en Kahneman, 1974): het eerste getal in de kamer trekt ieders schatting naar zich toe, zelfs als iedereen weet dat het willekeurig is. Bij onderhandelen voorspelt het eerste bod sterk waar de deal uitkomt (Galinsky en Mussweiler, 2001). Ken je de markt goed, dan loont het meestal om zelf het eerste getal op tafel te leggen.',
        'Een goed anker is ambitieus en verdedigbaar: je kunt uitleggen waar het vandaan komt. Een extreem getal dat je niet kunt onderbouwen, kost je geloofwaardigheid en kan het gesprek beëindigen. Geef de reden mee met het getal: “Vergelijkbare diagnoses kostten 18 tot 22 dagen, dus we stellen er 20 voor.”',
        'Ankert de ander eerst, ga dan niet over zijn getal in discussie: dan blijft het in het midden staan. Vraag hoe hij erop kwam, leg jouw basis uit en leg je eigen getal op tafel. Doe geen tegenbod, je antwoord met een eigen getal, vlak bij een getal dat je onredelijk vindt; daarmee accepteer je zijn anker.',
        'Framing: hetzelfde feit komt anders binnen. “95% van de klussen op tijd” of “1 op de 20 klussen te laat”. “€31.200” of “€600 per week, een jaar lang”.\n\nMensen wegen verlies zwaarder dan een even grote winst, verliesaversie (Kahneman en Tversky, 1979), dus “zonder dit blijf je 300 ploeguren per maand verliezen” komt vaak harder aan dan “dit bespaart 300 uur”. Frame eerlijk, in termen waar de ander om geeft.',
        'Plan je concessies, de stappen waarin je toegeeft: maak elke stap kleiner (20 dagen, dan 19, dan 18,5) en vraag er telkens iets voor terug. Grote of snelle concessies verraden dat er nog veel ruimte is.\n\nWie gaat eerst? Kent de ander de markt beter dan jij, dan beschermt het je om hem te laten openen. Onderzoek van Ames en Mason (2015) suggereert dat een bandbreedte met je doel onderaan, “20 tot 22 dagen”, minstens zo goed werkt als één getal. Scherpe vraag: “Waar is dat getal op gebaseerd?”',
      ],
      example: {
        kind: 'faded',
        text: 'Een klant vraagt hoeveel dagen je nodig hebt voor een planningsdiagnose, een kort onderzoek naar hoe het werk gepland wordt en waar het misgaat, bij drie regiokantoren. Je laatste drie vergelijkbare diagnoses kostten 18, 22 en 20 dagen. Aan de telefoon liet iemand van inkoop “een dag of 10” vallen.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Leg je eigen getal op tafel, met de basis erbij: “Onze laatste drie diagnoses van dit type kostten 18 tot 22 dagen, dus we stellen er 20 voor.” Begin niet bij hun 10, en ga niet zonder reden in het midden zitten op 15.\n\nDuwen ze terug, ruil dan scope in plaats van dagen: “Met 12 dagen doen we één regio grondig in plaats van drie.” Dan kiest de klant wat hij voor zijn geld krijgt.',
      },
      said: 'Wat je hoort in projecten: “Waar komt dat getal vandaan? Het onze is gebaseerd op de laatste drie klussen.”',
      recall: [
        {
          q: 'Wat is verankering?',
          options: ['Niet bewegen vanaf je eerste bod', 'Het eerste genoemde getal trekt latere schattingen naar zich toe', 'Een vaste prijs afspreken in het contract', 'Een prijs koppelen aan een index'],
          answer: 'Het eerste genoemde getal trekt latere schattingen naar zich toe',
          why: 'Zelfs een willekeurig eerste getal verschuift wat mensen redelijk vinden.',
        },
        {
          q: 'Wat maakt een goed eerste bod?',
          options: ['Zo extreem mogelijk', 'Ambitieus en onderbouwd met een reden die je kunt uitleggen', 'Precies waar je verwacht uit te komen', 'Net onder het budget van de ander'],
          answer: 'Ambitieus en onderbouwd met een reden die je kunt uitleggen',
          why: 'De ambitie geeft je ruimte; de reden houdt je geloofwaardig. Een extreem bod zonder basis kan het gesprek beëindigen.',
        },
        {
          q: 'De andere partij opent met een getal dat jij onredelijk vindt. Wat doe je?',
          options: ['Een tegenbod net boven het hunne', 'Punt voor punt uitleggen waarom hun getal niet klopt', 'Vragen hoe ze erop kwamen, jouw basis uitleggen en je eigen getal op tafel leggen', 'Meteen het verschil delen'],
          answer: 'Vragen hoe ze erop kwamen, jouw basis uitleggen en je eigen getal op tafel leggen',
          why: 'Een tegenbod vlak bij hun getal of erover in discussie gaan houdt hun anker in het midden.',
        },
        {
          q: 'Een ondersteuningscontract van 52 weken kost in totaal €31.200. Je wilt het per week framen. Hoeveel is dat, in euro per week?',
          number: 600,
          tolerance: 0.5,
          unit: '€ per week',
          why: '€31.200 / 52 weken = €600 per week.',
        },
      ],
      situation: {
        scene: 'Bij een netbeheerder stel je een pilot van 6 weken voor met een gereedheidscheck: een check of elke klus vergunningen, materiaal en een schakelplan heeft voordat een ploeg op pad gaat. De sponsor, de manager bij de klant die eigenaar is van het project, vindt het goed, maar zegt: “Inkoop keurt nooit 30 adviesdagen goed. Kun je het in 10?” Jij schat dat er voor drie regio’s 30 dagen nodig zijn.',
        ask: 'Hoe reageer je?',
        model: 'Ik zou niet over de 10 in discussie gaan en ook niet zonder reden op 20 gaan zitten. Ik leg de 30 uit: “Dat is drie regio’s, 10 dagen per regio, gebaseerd op wat één regio kostte bij onze analyse in het noorden vorig jaar.” Dan bied ik een ruil: “Met 10 dagen kunnen we één regio goed doen. Werkt het, dan volgen de andere twee met de resultaten in de hand.” Zo kiest de klant scope, niet een goedkopere versie van alles.',
        rubric: [
          'Onderhandelt niet binnen het getal van de sponsor',
          'Legt de basis van de schatting uit',
          'Biedt een ruil in scope in plaats van korting',
        ],
        pushback: {
          lines: [
            'Eén regio overtuigt de directie niet. Ik heb ze alle drie nodig, en het moet goedkoop.',
            'Andere bureaus doen dit voor 10 dagen. Waarom zijn jullie zo duur?',
          ],
          model: 'Ik snap dat je alle drie nodig hebt voor de directie. Drie regio’s in 10 dagen is bochten afsnijden, en daar krijgen we spijt van, want de check werkt alleen als de ploegen meedenken. Wat ik kan doen: één regio in 10 dagen, met resultaten die de directie kan zien, en de andere twee als vast vervolg. Belooft een ander bureau alle drie in 10 dagen, vraag dan hoe.',
          rubric: [
            'Erkent wat de directie nodig heeft en de druk op het budget',
            'Herhaalt waarom de scope niet kleiner kan zonder kwaliteitsverlies',
            'Stelt een gefaseerde optie voor met een vast vervolg',
          ],
        },
      },
      sayIt: 'Leg een collega in 60 seconden uit wat verankering is, en wat je doet als de klant als eerste een getal noemt.',
      terms: [
        { term: 'Anker', def: 'Het eerste getal in een onderhandeling, dat de uitkomst naar zich toe trekt.' },
        { term: 'Framing', def: 'Hetzelfde feit zo brengen dat het past bij waar de ander om geeft.' },
        { term: 'Verliesaversie', def: 'Mensen wegen een verlies zwaarder dan een even grote winst.' },
        { term: 'Tegenbod', def: 'Je antwoord op hun getal met een eigen getal, liefst met een eigen onderbouwing.' },
        { term: 'Concessie', def: 'Een stap waarin je toegeeft; plan ze steeds kleiner en ruil elke stap tegen iets.' },
      ],
    },
    {
      id: 'pm.negotiate.scope',
      title: 'Scope en tijd onderhandelen met een klant',
      pre: [
        {
          q: 'Halverwege een project tegen vaste prijs vraagt de klant om “nog één extra analyse”. Wat is de beste eerste reactie?',
          options: ['Ja, om hem tevreden te houden', 'Nee, het staat niet in het contract', 'Vragen voor welk besluit de analyse is, en dan laten zien wat het kost aan tijd of wat ervoor moet wijken', 'Het stilletjes in het weekend doen'],
          answer: 'Vragen voor welk besluit de analyse is, en dan laten zien wat het kost aan tijd of wat ervoor moet wijken',
          why: 'Vaak beantwoordt een lichtere versie de echte vraag. En als je de ruil zichtbaar maakt, kan de klant kiezen.',
        },
      ],
      teach: [
        'Scope (wat er geleverd wordt), tijd en kosten hangen aan elkaar; projectmanagers noemen dat de duivelsdriehoek (iron triangle). Beweegt er één, dan moet er iets anders mee.\n\nEen klant die meer vraagt, in dezelfde tijd, voor hetzelfde budget, vraagt je eigenlijk om op kwaliteit in te leveren zonder het te zeggen. Jouw taak is niet weigeren, maar de ruil zichtbaar maken.',
        'Kleine ja’s tellen op. Vijf “snelle” extraatjes van een dag zijn samen een hele week op een project van 20 dagen.\n\nHoud een simpel wijzigingslog bij: wat werd gevraagd, wanneer, hoeveel werk, wat werd besloten. Dan gaat het gesprek over feiten in plaats van over wie er moeilijk doet.',
        'Bied opties, geen muur: “We kunnen het toevoegen en het eindrapport twee weken opschuiven, of toevoegen en de tweede regio laten vallen, of het als vervolg doen voor vier extra dagen.” Laat de klant kiezen: het is zijn prioriteit. En vraag altijd voor welk besluit het verzoek is; vaak volstaat een lichtere versie.',
        'Leg het kort vast: een mail na het gesprek met wat er verandert, of bij grotere dingen een wijzigingsverzoek, een kort document met het extra werk, de dagen en de prijs, dat de klant tekent. En check bij je eigen manager voordat je extra dagen toezegt. Misschien mag jij ze niet weggeven, en je bureau draait op voor de kosten.',
        'Bij een vaste prijs ligt het risico van extra werk bij jou; bij een dagtarief betaalt de klant per gewerkte dag en draagt hij dat risico. Scope creep, werk dat beetje bij beetje groeit buiten de afspraak, doet het meeste pijn bij een vaste prijs.\n\nDeskundigen verschillen over gratis extraatjes. Sommigen geven er bewust één, benoemd en gelogd (“deze is van ons”); anderen zeggen dat elk gratis extraatje de klant leert om weer te vragen. Scherpe vraag: “Wat zou je laten vallen om hier ruimte voor te maken?”',
      ],
      example: {
        kind: 'faded',
        text: 'Een project tegen vaste prijs bij een netbeheerder: 20 dagen, drie regio’s. In week 3 vraagt de sponsor, de manager bij de klant die eigenaar is van het project, om er een vierde regio bij te doen, “je zit toch al in de data”. Jij schat dat op 4 extra dagen.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Vraag eerst waar de vierde regio voor is: zit er een vraag van de directie achter? Zet dan de opties neer: de regio erbij voor 4 extra dagen tegen het afgesproken dagtarief; hem ruilen tegen regio 3; of een lichte versie, één kerncijfer voor regio 4, in 1 dag.\n\nCheck bij je engagement manager, die bij jouw bureau verantwoordelijk is voor deze klant, voordat je een prijs noemt voor de extra dagen. Bevestig de keuze na het gesprek per mail en zet hem in het wijzigingslog.',
      },
      said: 'Wat je hoort in projecten: “Doe ik graag. Wat wil je laten schuiven: de datum, de scope of het budget?”',
      recall: [
        {
          q: 'Een project tegen vaste prijs was gepland op 20 dagen werk. De klant voegde 5 extra verzoeken van elk 1 dag toe, en jij deed ze zonder de prijs of de planning aan te passen. Met hoeveel procent groeide het werk ten opzichte van de planning?',
          number: 25,
          tolerance: 0.5,
          unit: '%',
          why: '5 extra dagen op 20 geplande dagen: 5 / 20 = 25% meer werk voor dezelfde prijs.',
        },
        {
          q: 'Waarom houd je tijdens een project een wijzigingslog bij?',
          options: ['Om de klant alles in rekening te brengen', 'Zodat het gesprek over feiten gaat: wat werd gevraagd, hoeveel werk, wat werd besloten', 'Omdat auditors het eisen', 'Om te bewijzen dat de klant lastig is'],
          answer: 'Zodat het gesprek over feiten gaat: wat werd gevraagd, hoeveel werk, wat werd besloten',
          why: 'Een log laat zien hoe kleine verzoeken optellen, zonder dat het persoonlijk wordt.',
        },
        {
          q: 'Een klant vraagt extra werk binnen dezelfde tijd en hetzelfde budget. Wat is de beste reactie?',
          options: ['Weigeren: het staat niet in het contract', 'Ja zeggen en ’s avonds doorwerken', 'Opties bieden: meer tijd, minder van iets anders, of een betaald vervolg, en de klant laten kiezen', 'Je manager vragen om voor jou nee te zeggen'],
          answer: 'Opties bieden: meer tijd, minder van iets anders, of een betaald vervolg, en de klant laten kiezen',
          why: 'Zo blijft de relatie goed en wordt de ruil zichtbaar. De prioriteit is aan de klant.',
        },
        {
          q: 'Wat doe je voordat je extra dagen toezegt aan een klant?',
          options: ['Checken bij je eigen manager', 'De klant vragen het eerst op papier te zetten', 'Niks: een verzoek van de klant is altijd goed', 'Alvast beginnen om goede wil te tonen'],
          answer: 'Checken bij je eigen manager',
          why: 'Extra dagen kosten je bureau geld of tijd, en het besluit om ze te geven is misschien niet aan jou.',
        },
      ],
      situation: {
        scene: 'Twee weken voor het einde van een project tegen vaste prijs bij een onderdelenfabrikant vraagt de plantmanager of je “even dezelfde analyse voor de spuiterij” (paint shop) wilt doen. Jij schat dat op 6 dagen. Je planning heeft geen ruimte meer.',
        ask: 'Wat zeg je tegen hem?',
        model: 'Ik zou zeggen dat ik blij ben dat hij er waarde in ziet, en vragen wat hij voor de spuiterij wil besluiten. Dan: “Dat is ongeveer zes dagen. We kunnen het toevoegen en het eindrapport zo’n twee weken opschuiven, of het als kort vervolg doen na dit project. Binnen de huidige planning gaat het ten koste van de kwaliteit van wat je al gevraagd hebt.” Ik check de vervolgprijs bij mijn manager en bevestig per mail.',
        rubric: [
          'Vraagt voor welk besluit de extra analyse is',
          'Maakt de ruil in tijd of scope zichtbaar',
          'Biedt opties en legt het schriftelijk vast',
        ],
        pushback: {
          lines: [
            'Kom op, je weet al hoe het moet. Het is gewoon dezelfde analyse op andere data.',
            'Als je niet een beetje flexibel kunt zijn, onthoud ik dat als we het over het volgende project hebben.',
          ],
          model: 'Je hebt gelijk dat de methode hetzelfde is, en dat scheelt tijd. Het opschonen van de data en de gesprekken met het team van de spuiterij kosten nog steeds zo’n zes dagen. Ik wil juist flexibel zijn, daarom bied ik opties in plaats van een nee. Zal ik je morgen een voorstel van één pagina sturen voor een kort vervolg, zodat je deze week kunt beslissen?',
          rubric: [
            'Erkent dat de methode herbruikbaar is',
            'Herhaalt wat het extra werk echt kost',
            'Stelt een concreet vervolg voor waar hij deze week over kan beslissen',
          ],
        },
      },
      sayIt: 'Leg in 60 seconden uit hoe je omgaat met een klant die bij een project tegen vaste prijs steeds om “nog één ding” vraagt.',
      terms: [
        { term: 'Scope creep', def: 'Werk dat beetje bij beetje groeit buiten wat is afgesproken, zonder dat tijd of budget meegaan.' },
        { term: 'Wijzigingslog', def: 'Een lijst van gevraagde wijzigingen met het werk dat ze kosten en het besluit dat is genomen.' },
        { term: 'Vaste prijs', def: 'Een afgesproken prijs voor een afgebakende scope; extra werk vraagt een nieuwe afspraak.' },
        { term: 'Duivelsdriehoek', def: 'Scope, tijd en kosten hangen samen: verander je er één, dan moet minstens één andere mee.' },
        { term: 'Wijzigingsverzoek', def: 'Een kort schriftelijk voorstel voor extra of ander werk, met dagen en prijs, dat de klant goedkeurt.' },
        { term: 'Dagtarief', def: 'Een prijs per gewerkte dag; de klant betaalt de echte dagen en draagt het risico van extra werk.' },
      ],
    },
    {
      id: 'pm.negotiate.no',
      title: 'Nee zeggen en een ruil aanbieden',
      pre: [
        {
          q: 'Welk antwoord is het duidelijkste “nee” dat de relatie toch goed houdt?',
          options: ['“Ik ga kijken wat ik kan doen.”', '“Nee, dat is onmogelijk.”', '“Deze week lukt het niet, want vrijdag moet de stuurgroeprapportage af. Ik kan het maandag doen, of nu als de rapportage naar dinsdag schuift.”', '“Misschien, ik kijk even.”'],
          answer: '“Deze week lukt het niet, want vrijdag moet de stuurgroeprapportage af. Ik kan het maandag doen, of nu als de rapportage naar dinsdag schuift.”',
          why: 'Het is duidelijk, geeft één echte reden en biedt opties. De vage antwoorden worden als ja gehoord; het botte nee biedt niks.',
        },
      ],
      teach: [
        'Als je overal ja op zegt, is je ja minder waard en is je werk te laat. William Ury’s “positieve nee” (2007) heeft drie delen: ja, nee, ja.\n\nEerst het ja tegen wat je beschermt, zoals een belofte aan een klant of de kwaliteit van het werk. Dan een duidelijk nee. Dan een ja tegen iets anders: een optie, een ruil, een later moment.',
        'Wees duidelijk, kort en rustig. Een nee verstopt in “ik ga het proberen” wordt als ja gehoord, en dan stel je later teleur.\n\nGeef één echte reden, geen vijf smoesjes: meer redenen geven meer om over te discussiëren. En houd dan je mond.',
        'Je kunt ook een ruil aanbieden. “Als ik dit doe, wat kan er dan vervallen?” “Ik kan het doen als Jan de data-uitdraai overneemt.”\n\nEen ruil laat zien dat je het verzoek serieus neemt, en legt de keuze bij degene die de prioriteiten bepaalt.',
        'Sommige dingen ruil je niet: veiligheid, integriteit, regels waar je aan gebonden bent. Dat zijn je rode lijnen. Integriteit betekent hier eerlijke cijfers en eerlijk advies: je past geen data aan en verstopt geen bevinding om iemand te plezieren.\n\nZeg dat gewoon: “Dat kan ik niet doen. Dit kan ik wel doen.” En bereid je nee voor als je een gespannen overleg ingaat; hij is veel makkelijker te zeggen als je hem al een keer in je hoofd hebt gezegd.',
        'Wat je ziet: junioren zeggen “ik ga het proberen” en werken ’s nachts door, en de kosten blijven onzichtbaar tot de kwaliteit zakt. Andere valkuilen: drie keer sorry zeggen, te veel uitleggen, of per mail nee zeggen om het gesprek te ontlopen.\n\nDeskundigen verschillen over de toon bij klanten. Sommigen leren je “zeg nooit nee, zeg ja, en dit is wat ervoor nodig is”; Ury stelt dat een duidelijk nee de relatie beter beschermt dan een vaag ja. Scherpe vraag aan jezelf: “Wat bescherm ik met dit nee?”',
      ],
      example: {
        kind: 'faded',
        text: 'Donderdag, 16.00 uur. Je engagement manager, je baas op deze klant, vraagt je om vanavond de presentatie voor de stuurgroep om te bouwen, voor morgen 8.00 uur. De stuurgroep (steering committee) is het groepje directeuren van de klant dat toezicht houdt op het project.\n\nJe hebt de planningsleider van de klant een analyse beloofd voor vrijdag 12.00 uur, die hij nodig heeft voor een capaciteitsbesluit. Allebei goed doen lukt vanavond niet.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Ja tegen het gedeelde doel: “Ik wil ook dat de stuurgroeppresentatie sterk is.” Een duidelijk nee: “Allebei goed doen lukt me vanavond niet.”\n\nDan een ja met opties: “Ik kan vanavond de drie belangrijkste slides verbeteren en de planningsanalyse op tijd leveren. Of, als de presentatie voorgaat, laat ik de planningsleider vandaag nog weten dat zijn analyse naar maandag schuift. Wat heeft jouw voorkeur?” Degene die de prioriteiten bepaalt, maakt de keuze, met de kosten in beeld.',
      },
      said: 'Wat je hoort in projecten: “Dat kan ik doen, maar dan moet er iets anders schuiven. Wat wordt het?”',
      recall: [
        {
          q: 'Wat is de volgorde van William Ury’s positieve nee?',
          options: ['Nee, ja, nee', 'Ja, nee, ja', 'Nee, dan een excuus', 'Ja, en later nee'],
          answer: 'Ja, nee, ja',
          why: 'Een ja tegen wat je beschermt, een duidelijk nee, dan een ja tegen een alternatief.',
        },
        {
          q: 'Waarom geef je bij een nee één echte reden in plaats van meerdere?',
          options: ['Meerdere redenen duren te lang', 'Meer redenen geven de ander meer om over te discussiëren', 'Eén reden klinkt senior', 'Het maakt niet uit hoeveel'],
          answer: 'Meer redenen geven de ander meer om over te discussiëren',
          why: 'Elke extra reden is een nieuw punt om aan te vechten, en zwakke redenen ondermijnen de sterke.',
        },
        {
          q: 'Wat bereik je met een ruil, zoals “Als ik dit doe, wat kan er dan vervallen?”',
          options: ['Je laat zien dat je het verzoek serieus neemt en legt de keuze bij degene die de prioriteiten bepaalt', 'Je komt onder het werk uit', 'Je laat zien dat je het te druk hebt', 'Je stelt het besluit uit'],
          answer: 'Je laat zien dat je het verzoek serieus neemt en legt de keuze bij degene die de prioriteiten bepaalt',
          why: 'De kosten van het verzoek worden zichtbaar, en de juiste persoon beslist.',
        },
        {
          q: 'Welke van deze hoort nooit in een ruil?',
          options: ['Een deadline', 'De volgorde van taken', 'Veiligheid en integriteit', 'Hoe gedetailleerd een rapport is'],
          answer: 'Veiligheid en integriteit',
          why: 'Deadlines, volgorde en detail kunnen schuiven. Over veiligheid en integriteit valt niet te onderhandelen.',
        },
      ],
      situation: {
        scene: 'Een manager bij een netbeheerder vraagt je twee cijfers in je analyse aan te passen voordat die naar de directie gaat: “Laat de werkvoorraad wat kleiner lijken. Anders slaat de directie in paniek.” De werkvoorraad (backlog) is de stapel netklussen die nog gedaan moet worden.',
        ask: 'Wat zeg je?',
        model: 'Ik zou zeggen dat ik snap dat hij geen paniek wil, en dat ik dat ook niet wil. Maar de cijfers aanpassen kan ik niet; ze moeten kloppen met de data. Wat ik wel kan doen, is helpen ze goed te brengen: de trend erbij, de acties die al lopen, en misschien een slide over wat de werkvoorraad voor klanten betekent. Zullen we morgen samen aan die presentatie werken?',
        rubric: [
          'Zegt ja tegen zijn onderliggende zorg',
          'Geeft een duidelijk nee op het aanpassen van de cijfers',
          'Biedt een concreet alternatief om ze te presenteren',
        ],
        pushback: {
          lines: [
            'Het is geen liegen. Het is gewoon een beetje gunstig afronden. Dat doet iedereen.',
            'Jij bent de consultant. Je bent er om mij te helpen, niet om het me moeilijker te maken.',
          ],
          model: 'Ik wil je juist helpen, en daarom doe ik het niet: als de directie er later achter komt, raakt het jou veel harder dan een vervelend cijfer nu. De cijfers blijven zoals ze zijn. Ik help je wel het verhaal te vertellen: de trend, de acties, en wat je van de directie nodig hebt. Zullen we morgen een uur gaan zitten en die slides samen maken?',
          rubric: [
            'Erkent zijn zorg en zijn wens om geholpen te worden',
            'Herhaalt duidelijk dat de cijfers blijven zoals ze zijn',
            'Stelt een concrete sessie voor om de presentatie samen te maken',
          ],
        },
      },
      sayIt: 'Leg in 60 seconden uit hoe je nee zegt tegen iemand die hoger staat, zonder de relatie te beschadigen.',
      terms: [
        { term: 'Positieve nee', def: 'Ja tegen wat je beschermt, een duidelijk nee, dan ja tegen een alternatief (Ury).' },
        { term: 'Ruil aanbieden', def: 'Aanbieden iets te doen in ruil voor iets anders dat schuift of vervalt, zodat degene die de prioriteiten bepaalt kiest.' },
        { term: 'Rode lijn', def: 'Iets wat je niet ruilt, wat er ook geboden wordt: veiligheid, integriteit (eerlijke cijfers en eerlijk advies), bindende regels.' },
      ],
    },
    {
      id: 'pm.negotiate.senior',
      title: 'Het oneens zijn met iemand die hoger staat',
      pre: [
        {
          q: 'In een overleg noemt de directeur van de klant een oorzaak voor een probleem die jouw data duidelijk tegenspreekt. Wat is meestal het best?',
          options: ['Je mond houden en achteraf een mail sturen', 'Hem stevig tegenspreken zodat iedereen het hoort', 'Een vraag stellen die de data erbij haalt: “Mag ik er één ding uit de data aan toevoegen?”', 'Nu instemmen en de analyse later aanpassen'],
          answer: 'Een vraag stellen die de data erbij haalt: “Mag ik er één ding uit de data aan toevoegen?”',
          why: 'Zo komen de feiten op tafel zonder publiek gevecht. Zwijgen laat een verkeerd besluit doorgaan; hard tegenspreken zet hem in de verdediging.',
        },
      ],
      teach: [
        'Het oneens zijn met wie boven je staat, hoort bij waar klanten je voor betalen. Ze huren geen consultant in om hun eigen mening terug te horen.\n\nHet onderzoek van Amy Edmondson naar psychologische veiligheid (1999), het gedeelde gevoel dat je veilig je mond kunt opendoen, vragen kunt stellen en het oneens kunt zijn, laat zien dat teams met meer daarvan meer leren. Jij helpt dat op gang door het zelf goed te doen.',
        'Gebruik feit-visie-verzoek: bereid drie dingen voor en houd ze uit elkaar, het feit, je visie en je verzoek.\n\n“De data van de laatste 12 weken laat X zien” is het feit. “Ik denk dat dat Y betekent” is je visie. “Ik wil voorstellen Z te checken voordat we besluiten” is je verzoek.\n\nEen helder verzoek maakt van onenigheid een volgende stap.',
        'Kies de setting. Bij een groot verschil van mening ga je eerst één-op-één: overval nooit iemand die hoger staat waar zijn team bij is. In een overleg stel je liever een vraag dan dat je een oordeel geeft: “Mag ik er één ding uit de data aan toevoegen?”\n\nHoud je stem laag en je tempo rustig. Kalmte komt over als zelfvertrouwen.',
        'Weet wanneer je stopt. Zeg het één keer duidelijk, en een tweede keer alleen met nieuwe informatie.\n\nBesluit hij anders en gaat het niet over veiligheid of integriteit, dan geldt disagree and commit: accepteer het, voer het besluit volledig uit en noteer wat je hebt geadviseerd. Gaat het wel over veiligheid of integriteit, dan neem je het escalatiepad (escalation path): je legt het open bij het niveau erboven, en je zegt dat eerst tegen de persoon zelf.',
        'Wat je ziet: de hoogste in rang praat eerst en de rest van de kamer gaat erachter staan. Valkuilen: zo zacht hinten dat niemand het merkt; de discussie in het openbaar winnen en de persoon kwijtraken; achter iemands rug naar zijn baas stappen.\n\n“Disagree and commit” komt van Intel en werd bekend door Jeff Bezos van Amazon. Critici zeggen dat het mensen monddood kan maken; het werkt alleen als het bezwaar eerst echt gehoord is. Scherpe vraag: “Wat zou je moeten zien om van gedachten te veranderen?”',
      ],
      example: {
        kind: 'faded',
        text: 'Stuurgroep bij een onderdelenfabrikant. De COO, de operationeel directeur, zegt: “De leveringen zijn te laat omdat operators zich niet aan de planning houden. We maken er een bonuscriterium van.”\n\nJouw data: van de 120 te late orders in de laatste 12 weken startten er 84 te laat omdat het materiaal te laat binnenkwam. Je bent de jongste in de kamer.',
        ask: 'Wat zou jij nu doen?',
        reveal: 'Vraag rustig om ruimte: “Mag ik er één ding uit de data aan toevoegen?” Het feit: “84 van de 120 te late orders in de laatste 12 weken, dat is 70%, startten te laat omdat het materiaal te laat binnenkwam.”\n\nJe visie: “Dus een bonus voor operators gaat het misschien niet veel veranderen.” Je verzoek: “Kunnen we eerst naar het materiaal kijken, en volgende maand over de bonus besluiten?”\n\nBlijft hij erbij, ga dan niet een tweede keer in de kamer in discussie. Vraag om een kwartier na afloop.',
      },
      said: 'Wat je hoort in projecten: “Mag ik er één ding uit de data aan toevoegen voordat we besluiten?”',
      recall: [
        {
          q: 'Welke drie dingen bereid je voor en houd je uit elkaar als je het oneens bent met iemand die hoger staat?',
          options: ['Feit, visie, verzoek', 'Probleem, schuld, oplossing', 'Mening, emotie, eis', 'Achtergrond, geschiedenis, conclusie'],
          answer: 'Feit, visie, verzoek',
          why: 'Als je ze uit elkaar houdt, kan de ander het feit accepteren ook al twijfelt hij aan je visie, en het verzoek geeft een volgende stap.',
        },
        {
          q: 'Een senior manager besluit tegen je advies in. Het gaat niet over veiligheid of integriteit. Wat doe je?',
          options: ['Het in elk overleg opnieuw aankaarten', 'Naar zijn baas stappen', 'Het besluit accepteren, ervoor gaan, en noteren wat je hebt geadviseerd', 'Het stilletjes op jouw manier doen'],
          answer: 'Het besluit accepteren, ervoor gaan, en noteren wat je hebt geadviseerd',
          why: 'Hij mag besluiten. Ervoor gaan houdt het vertrouwen; je advies opschrijven houdt je eerlijk.',
        },
        {
          q: 'Wanneer escaleer je in plaats van het besluit van iemand die hoger staat te accepteren?',
          options: ['Als je zeker weet dat je gelijk hebt', 'Als het besluit over veiligheid of integriteit gaat', 'Als je manager het er ook niet mee eens zou zijn', 'Als het besluit geld kost'],
          answer: 'Als het besluit over veiligheid of integriteit gaat',
          why: 'Dat zijn geen smaakkwesties. Al het andere is zijn beslissing, als jij je punt hebt gemaakt.',
        },
        {
          q: 'Van 120 te late orders in de laatste 12 weken startten er 84 te laat omdat het materiaal te laat binnenkwam. Welk deel van de te late orders is dat, in %?',
          number: 70,
          tolerance: 0.5,
          unit: '%',
          why: '84 / 120 = 0,70, dus 70% van de te late orders.',
        },
      ],
      situation: {
        scene: 'Een netbeheerder. In een één-op-één zegt het regiohoofd dat je de enquête onder de ploegen uit je rapport moet halen: “Die klagen altijd. Het geeft alleen maar onrust.” Uit de enquête blijkt dat 60% van de ploegleiders zegt klussen te krijgen die niet klaar zijn.',
        ask: 'Hoe reageer je?',
        model: 'Ik zou zeggen dat ik snap dat hij geen onrust wil. Dan het feit: “60% van de ploegleiders zegt klussen te krijgen die niet klaar zijn, en dat klopt met de data over afgezegde klussen.” Mijn visie: als we het weglaten, mist de directie de belangrijkste oorzaak. Mijn verzoek: “Kunnen we het erin laten, met jouw reactie en de acties ernaast? Dan zie je dat je er al mee bezig bent.”',
        rubric: [
          'Erkent zijn zorg',
          'Houdt feit, visie en verzoek uit elkaar',
          'Stelt een manier voor om de bevinding te houden die voor hem werkt',
        ],
        pushback: {
          lines: [
            'Ik leid deze regio al vijftien jaar. Ik ken mijn ploegen beter dan een enquête.',
            'Ik ben hier de klant. Als ik zeg dat het eruit gaat, gaat het eruit.',
          ],
          model: 'Jij kent je ploegen veel beter dan ik, en dat waardeer ik. De enquête vervangt dat niet; die ondersteunt de data over afgezegde klussen. Het is jouw rapport, en jij beslist. Mijn advies is om het erin te laten, met jouw acties ernaast. Wil je het er toch uit, dan noteer ik mijn advies in het projectdossier. Zal ik de versie met jouw reactie opzetten?',
          rubric: [
            'Erkent zijn ervaring en zijn recht om te beslissen',
            'Herhaalt het advies en de reden één keer, rustig',
            'Stelt voor de versie met zijn reactie op te zetten',
          ],
        },
      },
      sayIt: 'Leg in 60 seconden uit hoe je rustig tegen een senior klant ingaat en wanneer je het loslaat.',
      terms: [
        { term: 'Psychologische veiligheid', def: 'Het gedeelde gevoel dat het veilig is om je uit te spreken, vragen te stellen en het oneens te zijn (Edmondson).' },
        { term: 'Disagree and commit', def: 'Je punt maken, en als het besluit genomen is, er volledig voor gaan.' },
        { term: 'Feit-visie-verzoek', def: 'Drie dingen die je uit elkaar houdt als je het oneens bent: het feit dat iedereen kan checken, jouw visie op wat het betekent, en de concrete volgende stap die je vraagt.' },
        { term: 'Escalatiepad', def: 'Een kwestie open bij het niveau erboven leggen, nadat je het de persoon eerst hebt gezegd; bij veiligheid of integriteit, niet bij een verschil van smaak.' },
      ],
    },
  ],
};

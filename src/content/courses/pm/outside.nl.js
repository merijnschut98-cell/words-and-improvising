// pm.outside (Nederlands): projecten leiden buiten je vakgebied: instelling, vragen stellen, werken met experts, sturen en besluiten. Vier onderwerpen, elk vier niveaus.
export default {
  lessons: [
    // Onderwerp 1: instelling
    {
      id: 'pm.outside.director',
      title: 'Regisseur, geen expert',
      pre: [
        {
          q: 'Je leidt de invoering van een nieuw MES, de software die orders en machines op de werkvloer volgt. De IT-architect vraagt welke database-opzet jij wilt. Wat is hier jouw taak?',
          options: ['Kiezen wat de architect lijkt te willen, zodat het project doorloopt', 'Het helemaal aan IT overlaten; over databases gaat een projectleider gewoon niet', 'Zorgen dat de juiste persoon kiest, passend bij het doel, en het vastleggen', 'De leverancier laten kiezen, want die moet het later ondersteunen'],
          answer: 'Zorgen dat de juiste persoon kiest, passend bij het doel, en het vastleggen',
          why: 'Jij hoeft het antwoord niet te weten. Jij zorgt dat er een goed antwoord komt, van iemand die het kan beoordelen, en dat het past bij het doel.',
        },
      ],
      teach: [
        'Vroeg of laat leid je een project waarvan je de inhoud zelf niet kunt beoordelen: een IT-systeem, een elektrische installatie, een robotcel. Dat is normaal. De meeste projectleiders werken hun hele loopbaan buiten het vak waarvoor ze zijn opgeleid.\n\nDe omslag: zie jezelf als regisseur, niet als expert. Een filmregisseur bedient de camera niet en schrijft de muziek niet, maar bepaalt waar de film over gaat en zorgt dat iedereen daaraan werkt.',
        'De vakexpert (subject matter expert) is degene die de inhoud kent: de PLC-programmeur, de engineer van de netbeheerder, de databasespecialist. Hij is eigenaar van hoe iets werkt.\n\nJij bent de proceseigenaar: degene die verantwoordelijk is voor hoe het werk gebeurt. Wie beslist wat, in welke volgorde, met welke informatie, en hoe je weet dat je op koers ligt. Jij bent eigenaar van de route; zij van de motor.',
        'In de praktijk: je beantwoordt geen technische vragen; je zorgt dat ze beantwoord worden, door de juiste persoon, op een datum. Je controleert de code niet; je controleert dat iemand die het kan, hem heeft gecontroleerd, en dat hij doet wat het doel vraagt.\n\nHoud scherp onderscheid tussen scope, wat het project wel en niet oplevert, en oplossing, hoe het gebouwd wordt. De scope is van jou en de sponsor, de manager die eigenaar is van het project. De oplossing is van hen.',
        'Elke oplevering (deliverable), een concreet ding dat het project overdraagt, zoals een geteste koppeling of een in bedrijf genomen schakelkast, krijgt een eigenaar van de expertkant en een controle die je kunt zien. Zo heb je grip zonder de details te kennen.\n\nEen klassieke fout: in drie weken een halve expert willen worden, technische discussies aangaan die je verliest, en ondertussen de planning en de mensen laten liggen. Een andere: je verschuilen achter “ik ben niet technisch” en de experts het project laten trekken.',
        'Waar ervaren projectleiders over twisten: sommigen zeggen dat je minstens genoeg inhoud moet kennen om onzin te ruiken; anderen zeggen dat een sterk proces wint van oppervlakkige kennis. Allebei deels waar, en de lessen hierna geven je de vragen en controles die veel van die kennis vervangen.\n\nEen scherpe vraag aan jezelf aan het begin van elk overleg: “Wat moet hier besloten worden, en wie is de juiste persoon om dat te doen?”',
      ],
      example: {
        kind: 'worked',
        text: 'Je stapt in een project van een automatiseringsleverancier bij een voedingsmiddelenfabrikant: een robotcel die dozen op pallets stapelt. Jij kent Lean, geen robots.\n\nStap 1: schrijf met de klant het doel in één regel: “Lijn 3 palletiseert vanaf juni 12 dozen per minuut zonder operator.”\nStap 2: zet de opleveringen op een rij: de cel, de veiligheidshekken, het PLC-programma (de software in de industriële computer die de cel aanstuurt), de test, de training.\nStap 3: geef elke oplevering een eigenaar van de expertkant en een zichtbare controle: “veiligheidshekken: eigenaar de veiligheidskundige; controle: getekende risicobeoordeling.”\nStap 4: een wekelijks overleg van 30 minuten waarin elke eigenaar de controle laat zien, niet alleen vertelt.\n\nResultaat: je stuurt de hele cel zonder één regel code te beoordelen.',
      },
      said: 'Wat je hoort in projecten: “Jij bent toch geen engineer? Hoe ga jij dit dan leiden?”',
      recall: [
        {
          q: 'Waar is de projectleider eigenaar van als de inhoud buiten zijn vak ligt?',
          options: ['Het proces: wie wat beslist, wanneer, en hoe voortgang zichtbaar wordt', 'De technische oplossing, want hij staat uiteindelijk voor het resultaat in', 'Alleen de planning; de experts leiden de inhoud', 'De codereview, zodat de kwaliteit onafhankelijk getoetst wordt'],
          answer: 'Het proces: wie wat beslist, wanneer, en hoe voortgang zichtbaar wordt',
          why: 'De expert is eigenaar van hoe het werkt; jij van hoe het werk gebeurt en of het het doel dient.',
        },
        {
          q: 'Welke verdeling klopt?',
          options: ['De scope is van de experts, de oplossing van jou en de sponsor', 'Scope en oplossing zijn allebei van de leverancier', 'Scope en oplossing zijn allebei van de sponsor', 'De scope van jou en de sponsor, de oplossing van de experts'],
          answer: 'De scope van jou en de sponsor, de oplossing van de experts',
          why: 'Wat het project oplevert is een zakelijke keuze; hoe het gebouwd wordt een technische.',
        },
        {
          q: 'Wat heeft elke oplevering nodig, zodat je grip hebt zonder de inhoud te kennen?',
          options: ['Een uitgebreide technische specificatie die je zelf schrijft', 'Een technische eigenaar en een controle die je kunt zien', 'Een wekelijkse statusmail', 'Jouw persoonlijke goedkeuring van het ontwerp'],
          answer: 'Een technische eigenaar en een controle die je kunt zien',
          why: 'Een eigenaar die het kan beoordelen, plus zichtbaar bewijs dat het af is, vervangt je eigen oordeel over de inhoud.',
        },
        {
          q: 'Wat is een klassieke fout van een projectleider buiten zijn vak?',
          options: ['De experts te veel basisvragen stellen', 'Het doel opschrijven voordat de planning en het budget klaar zijn', 'Elke week overleggen met alle eigenaren', 'Een halve expert willen worden en de discussies verliezen'],
          answer: 'Een halve expert willen worden en de discussies verliezen',
          why: 'Je verspeelt geloofwaardigheid op terrein dat je niet kunt houden, en laat ondertussen de planning en de mensen liggen.',
        },
      ],
      situation: {
        scene: 'Kick-off van een elektrisch project met de netbeheerder: een nieuwe middenspanningsaansluiting (medium-voltage connection), de kabel van 10.000 volt en de schakelinstallatie die een fabriek voeden, voor een fabrikant die uitbreidt. De senior engineer van de netbeheerder kijkt je aan: “Wat gaat een Lean-consultant hier nou precies toevoegen?”',
        ask: 'Hoe antwoord je, in een paar zinnen?',
        model: '“Terechte vraag. Ik ga de kabel en de schakelinstallatie niet beoordelen; dat doen jij en de installateur. Wat ik meebreng is dat dit project één doel, één planning en één lijst besluiten heeft, en dat er niks tussen jouw team, de installateur en de fabriek in valt. Als jij me zegt wat je van de fabriek nodig hebt en wanneer, zorg ik dat het er is.”',
        rubric: [
          'Is eerlijk dat hij de technische inhoud niet beoordeelt',
          'Benoemt zijn eigen rol concreet: doel, planning, besluiten, raakvlakken',
          'Biedt de expert iets nuttigs aan',
        ],
        pushback: {
          lines: [
            '“Raakvlakken en planningen. Zulke projectleiders hebben we vaker gehad. Die maakten vooral extra overleggen.”',
            '“En als er technisch iets misgaat, merk jij het niet eens.”',
          ],
          model: '“Houd me daar dan aan: als mijn overleggen je geen tijd besparen, zeg het en ik schrap ze. Technisch heb je gelijk, dat zie ik zelf niet. Daarom vraag ik je elke week om één ding dat je kunt laten zien, een testrapport of een getekende tekening, en stel ik de vraag die je liever niet hoort: waardoor zou dit mislukken?”',
          rubric: [
            'Wordt niet defensief; nodigt hem uit hem erop aan te spreken',
            'Geeft de grens eerlijk toe',
            'Laat zien hoe hij toch grip houdt: zichtbaar bewijs en lastige vragen',
          ],
        },
      },
      sayIt: 'Leg een vriend in 60 seconden uit waarom een projectleider niet de expert hoeft te zijn, en waar hij wel eigenaar van is.',
      terms: [
        { term: 'Regisseur', def: 'De projectleider als degene die bepaalt waar het werk voor is en het proces stuurt, zonder het technische werk zelf te doen of te beoordelen.' },
        { term: 'Vakexpert', def: 'Degene die de inhoud kent en eigenaar is van hoe iets werkt: een programmeur, een netengineer, een procesengineer.' },
        { term: 'Proceseigenaar', def: 'Degene die verantwoordelijk is voor hoe het werk gebeurt: wie beslist wat, wanneer, met welke informatie, en hoe voortgang wordt aangetoond.' },
        { term: 'Scope', def: 'Wat het project wel en niet oplevert; bepaald door de projectleider met de sponsor.' },
        { term: 'Oplevering', def: 'Een concreet ding dat het project overdraagt, zoals een geteste koppeling of een in bedrijf genomen schakelkast.' },
      ],
    },
    {
      id: 'pm.outside.humility',
      title: 'Nieuwsgierig en bescheiden',
      pre: [
        {
          q: 'In een overleg gebruiken de engineers een woord dat je niet kent: “selectiviteit”. Wat is meestal de beste zet?',
          options: ['Meeknikken en het na het overleg opzoeken, zodat je ze niet ophoudt', 'Ze vragen de term na het overleg schriftelijk toe te lichten', 'Vragen: “Wat betekent selectiviteit hier, en waarom is dat belangrijk voor ons?”', 'Een algemene vraag over de planning stellen, zodat niet opvalt dat je het kwijt bent'],
          answer: 'Vragen: “Wat betekent selectiviteit hier, en waarom is dat belangrijk voor ons?”',
          why: 'Een korte, echte vraag kost tien seconden; meeknikken betekent dat je mist waar de volgende twintig minuten over gaan. (Selectiviteit: bij een storing schakelt alleen de beveiliging het dichtst bij de storing af, zodat de rest van de fabriek stroom houdt.)',
        },
      ],
      teach: [
        'Nieuwsgierigheid is de wens om te begrijpen hoe iets echt werkt, en buiten je vak is het je belangrijkste gereedschap. Experts merken snel of je het wilt begrijpen of alleen een status wilt.\n\nIntellectuele bescheidenheid is weten, en zeggen, dat je beeld fout of onvolledig kan zijn. Psychologen zoals Mark Leary (2017) beschrijven het als de grenzen van je eigen kennis erkennen. In zijn onderzoek ging het samen met zorgvuldiger bewijs wegen.',
        'De valkuil is het Dunning-Krugereffect: in experimenten van David Dunning en Justin Kruger (1999) overschatten mensen met de minste vaardigheid in een taak hun score het meest. Latere onderzoekers twisten over hoe groot het effect is, maar de waarschuwing blijft staan: na drie weken in een nieuw vak heb je het gevoel dat je het snapt, en juist dan ga je zelfverzekerde fouten maken.',
        'Neem een beginnersgeest aan: de houding van iemand die fris naar een vak kijkt, zonder aan te nemen dat hij het al weet. In de praktijk: stel naïeve vragen hardop. Een naïeve vraag is een basisvraag die een insider niet zou stellen, zoals “Waarom moet die kabel zo dik?” of “Wat gebeurt er als deze server uitvalt?”\n\nNaïeve vragen vinden vaak wat experts niet meer zien, omdat het voor hen vanzelfsprekend is.',
        'Hoe vraag je zonder dom over te komen: zeg waarom je het vraagt. “Ik vraag het om het risico te snappen, niet om jou te controleren.” Vraag naar gevolgen, niet naar mechanismen: “Wat betekent dat voor de datum?” Schrijf het antwoord op en gebruik het de volgende keer; dan zien ze dat je luisterde.\n\nDe fout aan de andere kant is valse bescheidenheid: vragen blijven stellen zonder ooit kennis op te bouwen, zodat experts elke week hetzelfde moeten uitleggen.',
        'Een grove vuistregel die veel projectleiders gebruiken: heb je een woord drie keer gehoord en weet je het nog steeds niet, vraag het dan nu. Daarna wordt het ongemakkelijk.\n\nEen scherpe vraag om te blijven stellen: “Wat zie jij dat ik niet zie?” Die behandelt de expert als expert en brengt vaak het risico boven dat niemand had benoemd.',
      ],
      example: {
        kind: 'worked',
        text: 'Week 2 van een MES-project bij een maker van metalen onderdelen. De IT-lead zegt: “De koppeling met het ERP, het hoofdsysteem van het bedrijf voor orders, voorraad en financiën, doen we via middleware, zodat de orderdata consistent blijft.”\n\nStap 1, geef het toe: “Middleware ken ik niet. Kun je het in één zin uitleggen?” Antwoord: “Software ertussen die berichten doorgeeft tussen de twee systemen.”\nStap 2, vraag naar het gevolg: “Wat gebeurt er met de productie als de middleware stopt?” Antwoord: “Na ongeveer een uur krijgt het MES geen nieuwe orders meer.”\nStap 3, schrijf het risico en de eigenaar op.\nStap 4, gebruik het woord volgende week zelf goed.\n\nEén minuut, een woord geleerd en een risico gevonden.',
      },
      said: 'Wat je hoort in projecten: “Sorry, misschien een domme vraag, maar wat gebeurt er als dat systeem uitvalt?” Vaak de beste vraag in de kamer.',
      recall: [
        {
          q: 'Wat is intellectuele bescheidenheid?',
          options: ['Weten en zeggen dat je beeld fout of onvolledig kan zijn', 'Je mening voor je houden tot de experts gesproken hebben', 'Meegaan met de experts, omdat zij het vak beter kennen', 'In overleggen geen vragen stellen, om de experts tijd te besparen'],
          answer: 'Weten en zeggen dat je beeld fout of onvolledig kan zijn',
          why: 'Het gaat om de grenzen van je kennis, niet om geen mening hebben.',
        },
        {
          q: 'Wat vonden Dunning en Kruger, kort gezegd?',
          options: ['Experts onderschatten meestal hoe lang hun eigen taken duren', 'Mensen met de minste vaardigheid overschatten hun score het meest', 'Beginners schatten zichzelf goed in zodra ze wat feedback krijgen', 'De meest vaardige mensen overschatten hun score meer dan beginners'],
          answer: 'Mensen met de minste vaardigheid overschatten hun score het meest',
          why: 'Weinig kennis betekent ook weinig besef van wat je mist.',
        },
        {
          q: 'Hoe stel je een naïeve vraag zonder dom over te komen?',
          options: ['Stel hem als grap, zodat niemand hem te serieus neemt', 'Stel hem achteraf per mail, zodat niemand in de kamer ziet dat je het niet weet', 'Zeg waarom je het vraagt, en vraag naar gevolgen, niet naar mechanismen', 'Laat de jongste in de kamer hem voor je stellen'],
          answer: 'Zeg waarom je het vraagt, en vraag naar gevolgen, niet naar mechanismen',
          why: '“Ik vraag het om het risico te snappen” en “wat betekent dat voor de datum?” houden de vraag bij jouw rol.',
        },
        {
          q: 'Wat is valse bescheidenheid?',
          options: ['Vragen blijven stellen zonder te leren, zodat experts zich herhalen', 'Zo weinig vragen stellen dat de experts denken dat je alles allang weet', 'Een fout pas toegeven als iemand anders hem heeft aangewezen', '“Ik weet het niet” zeggen om geen standpunt in te nemen'],
          answer: 'Vragen blijven stellen zonder te leren, zodat experts zich herhalen',
          why: 'Echte bescheidenheid leert; steeds hetzelfde vragen kost hun tijd en jou geloofwaardigheid.',
        },
      ],
      situation: {
        scene: 'Voortgangsoverleg met een automatiseringsleverancier. Hun PLC-programmeur legt een vertraging uit en gebruikt drie woorden die je niet kent: “safety-PLC”, “SIL” en “validatie”. De productiemanager van de klant zit erbij en kijkt even naar jou.',
        ask: 'Wat zeg je?',
        model: '“Even checken of ik het volg, want dit is belangrijk voor de datum. Een safety-PLC is de aparte besturing die de cel veilig stopt, toch? En SIL, waar staat dat voor, en verandert het niveau hoeveel we moeten testen?” Dan: “Dus in gewone woorden: het veiligheidsdeel moet apart bewezen worden, en dat zijn de twee weken. Wat zou jou helpen het sneller te doen?” (Voor jou: SIL, safety integrity level, zegt hoe betrouwbaar een veiligheidsfunctie moet zijn; een hoger niveau betekent meer bewijs en meer testen.)',
        rubric: [
          'Vraagt open in plaats van mee te knikken',
          'Koppelt de vragen aan het gevolg voor het project',
          'Vat samen in gewone woorden en gaat naar wat helpt',
        ],
        pushback: {
          lines: [
            '“Ik kan de hele veiligheidsnorm uitleggen, maar eerlijk gezegd hebben we nu geen tijd voor een cursus.”',
            '“Als je niet weet wat SIL is, moet je je misschien inlezen voor het overleg.”',
          ],
          model: '“Terecht, ik lees me in, en ik heb de cursus niet nodig. Ik heb één ding nodig: verandert het veiligheidsniveau de testtijd, ja of nee, en hoeveel? Dan weet de productiemanager waar hij op moet plannen. De rest zoek ik vanavond op en check ik morgen in vijf minuten bij je.”',
          rubric: [
            'Accepteert het punt zonder uitgebreid excuus',
            'Versmalt zijn vraag tot wat het project nodig heeft',
            'Belooft de rest zelf te leren, met een moment',
          ],
        },
      },
      sayIt: 'Leg in 60 seconden het verschil uit tussen echte en valse bescheidenheid, met van elk een voorbeeld uit een project.',
      terms: [
        { term: 'Nieuwsgierigheid', def: 'De wens om te begrijpen hoe iets echt werkt, te zien aan echte vragen en doorvragen.' },
        { term: 'Intellectuele bescheidenheid', def: 'Weten en zeggen dat je beeld fout of onvolledig kan zijn (beschreven door psychologen zoals Leary).' },
        { term: 'Dunning-Krugereffect', def: 'De bevinding (Dunning en Kruger, 1999) dat mensen met de minste vaardigheid in een taak hun prestatie het meest overschatten; de grootte ervan staat ter discussie.' },
        { term: 'Beginnersgeest', def: 'Fris naar een vak kijken, zonder aan te nemen dat je het al weet, zodat je ziet wat insiders vanzelfsprekend vinden.' },
        { term: 'Naïeve vraag', def: 'Een basisvraag die een insider niet zou stellen, zoals “wat gebeurt er als dit uitvalt?”, die vaak verborgen aannames blootlegt.' },
      ],
    },
    {
      id: 'pm.outside.credibility',
      title: 'Geloofwaardig zonder vakkennis',
      pre: [
        {
          q: 'Waarom vertrouwen experts sommige projectleiders die weinig van hun vak weten?',
          options: ['Omdat ze senior zijn en al grotere projecten hebben geleid', 'Omdat ze snel het jargon oppikken en het in overleggen gebruiken', 'Omdat ze de experts steunen waar de sponsor bij is', 'Omdat ze nakomen wat ze beloven en het project voorop zetten'],
          answer: 'Omdat ze nakomen wat ze beloven en het project voorop zetten',
          why: 'Geloofwaardigheid buiten je vak komt uit hoe je de dingen aanpakt, niet uit wat je van de inhoud weet.',
        },
      ],
      teach: [
        'Geloofwaardigheid is de mate waarin mensen geloven wat je zegt en verwachten dat je levert. Buiten je vak verdien je die niet met inhoud, dus verdien je hem met het proces.\n\nDavid Maister, Charles Green en Robert Galford (The Trusted Advisor, 2000) geven een vertrouwensformule (trust equation): vertrouwen is geloofwaardigheid plus betrouwbaarheid plus nabijheid (intimacy), gedeeld door eigenbelang. Het is een model, geen meting, maar het laat zien waar je kunt winnen.',
        'Betrouwbaarheid: doen wat je zei, wanneer je het zei. Het verslag gaat dezelfde dag rond, de actielijst klopt, het overleg begint op tijd. Klein, saai, en het is wat experts het eerst opvalt.\n\nNabijheid in de formule betekent dat mensen zich veilig voelen om je dingen te vertellen, ook slecht nieuws. Die bouw je door de boodschapper niet te straffen.',
        'Eigenbelang (self-orientation) is hoe sterk je op jezelf gericht lijkt: je imago, je rapportage, gelijk krijgen. Het staat onder de streep, dus het deelt al het andere. Experts voelen snel een projectleider die liever een groene status voor zijn manager heeft dan een werkend systeem.\n\nGeloofwaardigheid zelf betekent buiten je vak: de planning, de risico’s en de besluiten beter kennen dan wie ook, en eerlijk zijn over wat je niet weet.',
        'Opvolging is het zichtbare bewijs: wat je zei na te jagen, jaag je na, en je koppelt terug. “Vorige week vroeg je me om de belastinggegevens (load data) van de fabriek. Hier zijn ze, en de open vraag over de piekbelasting ligt tot vrijdag bij de fabrieksengineer.”\n\nEen klassieke fout is geleend gezag: “De sponsor wil dit.” Het werkt één keer en kost je elke keer daarna.',
        'Waar mensen het oneens zijn: sommige coaches zeggen “fake it till you make it”, doe zelfverzekerd in een vak dat je niet kent. Experts prikken er meestal binnen één overleg doorheen, en als je eenmaal betrapt bent op bluffen, wordt elke volgende uitspraak betwijfeld.\n\nEen scherpe vraag aan jezelf na een overleg: “Heb ik alles gedaan wat ik vorige keer beloofde, en heeft iemand me vandaag slecht nieuws verteld?” Zo niet, dan klopt er iets niet in de formule.',
      ],
      example: {
        kind: 'faded',
        text: 'Je leidt de klantkant van een kabelproject met de netbeheerder. In maand 1 beloofde je de engineer van de netbeheerder de geplande belasting van de fabriek (hoeveel vermogen de nieuwe machines gaan trekken) “volgende week”. Het duurde drie weken. Sindsdien beantwoordt ze je mails traag en zet ze haar manager in de cc.\n\nIn het volgende overleg zegt ze wat scherp: “We zien wel of de fabriek deze keer levert.”',
        ask: 'Welk deel van de vertrouwensformule is beschadigd, en wat zou jij doen?',
        reveal: 'Betrouwbaarheid, en een beetje nabijheid. Leg niet uitgebreid uit. Benoem het: “Je hebt gelijk, ik beloofde de belastinggegevens in één week en het werden er drie. Dat maakte jouw planning lastiger.”\n\nHerstel dan met kleine, nagekomen beloftes: “Voor de volgende punten geef ik je een datum waar ik zeker van ben, en ik zeg het een dag van tevoren als het schuift.” Kom de volgende drie beloftes precies na. Vertrouwen komt terug in daden, meestal trager dan het ging.',
      },
      said: 'Wat je hoort in projecten: “Hij kent het verschil tussen een transformator en een broodrooster niet, maar als hij zegt dat het geregeld is, is het geregeld.”',
      recall: [
        {
          q: 'Wat staat in de vertrouwensformule van Maister, Green en Galford onder de streep, en deelt al het andere?',
          options: ['Geloofwaardigheid', 'Eigenbelang', 'Betrouwbaarheid', 'Nabijheid'],
          answer: 'Eigenbelang',
          why: 'Hoe meer je op jezelf gericht lijkt, hoe meer het geloofwaardigheid, betrouwbaarheid en nabijheid tenietdoet.',
        },
        {
          q: 'Wat betekent geloofwaardigheid voor een projectleider buiten zijn vak?',
          options: ['Nooit een gat toegeven, zodat de experts hun vertrouwen in hem blijven houden', 'De technische inhoud bijna net zo goed kennen als de experts', 'De hoogste functie in de kamer hebben', 'Planning, risico’s en besluiten het best kennen, en eerlijk over gaten'],
          answer: 'Planning, risico’s en besluiten het best kennen, en eerlijk over gaten',
          why: 'Op inhoud kun je niet concurreren, dus je leidt op het proces en op eerlijkheid.',
        },
        {
          q: 'Wat is het probleem met geleend gezag (“de sponsor wil dit”)?',
          options: ['Het is in strijd met de projectafspraken', 'Het vertraagt besluiten, want de sponsor moet het bevestigen', 'Het werkt één keer en verzwakt je elke keer daarna', 'Experts weten niet wie de sponsor is'],
          answer: 'Het werkt één keer en verzwakt je elke keer daarna',
          why: 'Mensen leren dat je geen eigen redenen hebt, alleen het gewicht van een ander.',
        },
        {
          q: 'Je bent een belofte aan een expert niet nagekomen. Wat herstelt het vertrouwen het snelst?',
          options: ['Het kort benoemen, en daarna de volgende beloftes precies nakomen', 'Een kleine wederdienst aanbieden om het goed te maken', 'De sponsor vragen het met haar glad te strijken', 'Uitgebreid uitleggen waarom het gebeurde, zodat ze jouw kant begrijpt'],
          answer: 'Het kort benoemen, en daarna de volgende beloftes precies nakomen',
          why: 'Vertrouwen komt terug via nagekomen beloftes, niet via uitleg.',
        },
      ],
      situation: {
        scene: 'MES-project bij een maker van metalen onderdelen, maand 3. De lead developer van de leverancier zegt je op de gang: “Je laatste twee statusrapporten waren groener dan de werkelijkheid. Mijn team heeft het gemerkt.”',
        ask: 'Wat zeg je tegen hem?',
        model: '“Dank dat je het zo direct zegt. Je hebt gelijk, ik heb naar boven afgerond, deels omdat ik de sponsor goed nieuws wilde geven. Daar hebben jij en het project niks aan. Vanaf deze week schrijf ik de status op basis van het bewijs van jouw team, en laat ik je het rapport zien voordat het verstuurd wordt. Is er iets in het vorige dat je nu gecorrigeerd wilt hebben?”',
        rubric: [
          'Bedankt hem en geeft het toe zonder excuses',
          'Benoemt het eigenbelang eerlijk',
          'Verandert het proces zodat het niet terugkomt, en nodigt uit tot correctie',
        ],
        pushback: {
          lines: [
            '“Mij het rapport laten zien is aardig, maar je zwakt het toch weer af als de sponsor duwt.”',
            '“Eerlijk, waarom zou mijn team jou slecht nieuws vertellen als het toch gekleurd naar boven gaat?”',
          ],
          model: '“Dat is de echte test, en die zie je in de volgende stuurgroep. Als de data oranje zegt, zeg ik oranje, en zeg ik wat we nodig hebben om groen te worden. Als ik het afzwak, spreek me erop aan waar de sponsor bij is. Slecht nieuws van jouw team gaat naar boven met jullie naam bij het bewijs, niet bij de schuld.”',
          rubric: [
            'Accepteert dat vertrouwen getoond moet worden, niet beloofd',
            'Geeft een concrete, controleerbare toezegging',
            'Maakt het veilig om slecht nieuws te brengen',
          ],
        },
      },
      sayIt: 'Leg in 60 seconden de vertrouwensformule uit en zeg welk deel jij in een project het lastigst volhoudt.',
      terms: [
        { term: 'Geloofwaardigheid', def: 'Hoeveel mensen geloven wat je zegt en verwachten dat je levert.' },
        { term: 'Vertrouwensformule', def: 'Een model van Maister, Green en Galford (2000): vertrouwen = (geloofwaardigheid + betrouwbaarheid + nabijheid) ÷ eigenbelang.' },
        { term: 'Betrouwbaarheid', def: 'Doen wat je zei, wanneer je het zei, ook de kleine dingen.' },
        { term: 'Eigenbelang', def: 'Hoe sterk je op jezelf, je imago of gelijk krijgen gericht lijkt; in de vertrouwensformule deelt het al het andere.' },
        { term: 'Opvolging', def: 'Zichtbaar najagen wat je zei na te jagen, en terugkoppelen.' },
      ],
    },
    {
      id: 'pm.outside.keep',
      title: 'Wat je nooit uit handen geeft',
      pre: [
        {
          q: 'De automatiseringsleverancier stelt voor de tweede veiligheidstest te schrappen “omdat de eerste goed ging”. Wie hoort dat te beslissen?',
          options: ['De leverancier, want die kent de cel het best', 'Wie voor de projectrisico’s instaat, met advies van de experts', 'De PLC-programmeur, want hij schreef de veiligheidscode', 'Alleen de veiligheidskundige, want het is puur een veiligheidsvraag'],
          answer: 'Wie voor de projectrisico’s instaat, met advies van de experts',
          why: 'Experts adviseren over het risico; het besluit om het te aanvaarden blijft bij wie eindverantwoordelijk is voor het project.',
        },
      ],
      teach: [
        'Veel van de inhoud kun je uit handen geven, maar drie dingen blijven bij jou: het doel, de risico’s en de besluiten. Geef je die weg, dan leid je het project niet meer; dan rapporteer je erover.\n\nHet projectdoel is het resultaat in één regel waarvoor het project bestaat, met een getal en een datum. Experts optimaliseren hun deel; alleen jij blijft vragen of de delen samen nog het doel opleveren.',
        'Eindverantwoordelijk (accountable) betekent dat jij voor het resultaat instaat, wie het werk ook doet. In een RACI, een tabel van wie Responsible is (het doet), Accountable (ervoor instaat), Consulted (vooraf gevraagd) en Informed (achteraf geïnformeerd), heeft elke taak precies één A.\n\nDe experts zijn vaak de R. De A voor het totale resultaat, de planning en het risicobeeld blijft bij jou en de sponsor. Je delegeert taken, geen eindverantwoordelijkheid.',
        'Risico’s: houd een risicoregister bij, een lijst van wat er mis kan gaan, hoe waarschijnlijk, hoe erg, wat je eraan doet en wie eigenaar is. Experts zijn eigenaar van de technische risico’s erin; jij van het register zelf en van het gesprek over wat aanvaardbaar is.\n\nDe fout: “De leverancier regelt de risico’s.” Dan worden de risico’s beheerst tegen de doelen van de leverancier, zoals binnen budget blijven, niet tegen de jouwe.',
        'Besluiten: houd een besluitenlog (decision log) bij, een simpele lijst van wat er besloten is, door wie, op welke datum en waarom. Die voorkomt dat dezelfde discussie terugkomt en beschermt je als mensen het zich anders herinneren.\n\nDe expert adviseert; de juiste persoon beslist; jij zorgt dat het besluit genomen, vastgelegd en gecommuniceerd wordt. Een besluit dat niemand vastlegt, is in de praktijk nooit genomen.',
        'Waar het lastig wordt: experts brengen een besluit soms als puur technisch terwijl het eigenlijk een zakelijke afweging (trade-off) is. “We slaan die test over” is eigenlijk “we accepteren meer risico om een week te winnen”. Jouw taak is het terug te vertalen naar doel, risico en kosten, en het voor te leggen aan wie eindverantwoordelijk is.\n\nEen scherpe vraag: “Is dit een technische keuze, of kiezen we tussen tijd, kosten en risico?”',
      ],
      example: {
        kind: 'faded',
        text: 'Project met de netbeheerder, maand 5. De projectleider van de installateur mailt je: “Om de datum te halen zetten we de nieuwe schakelinstallatie onder spanning zonder de volledige test van de beveiligingsinstellingen; die doen we in de eerste week van bedrijf. Technisch is het prima.” Beveiligingsinstellingen (protection settings) bepalen wanneer de installatie bij een storing de stroom afschakelt. De productiemanager van de fabriek staat in de cc en antwoordt: “Top, houd de datum!”',
        ask: 'Wat doe je met deze mail?',
        reveal: 'Dit wordt als technisch gebracht maar het is een risicobesluit. Keur het niet goed in de mailwisseling en laat het enthousiasme van de productiemanager het niet beslissen.\n\nVraag de installateur en de engineer van de netbeheerder schriftelijk wat het risico is, hoe waarschijnlijk en hoe erg: een onterechte afschakeling legt de fabriek stil; een gemiste afschakeling kan apparatuur beschadigen. Zet het op één A4 met de opties (de datum halen met dat risico, of een week later volledig getest) en laat de sponsor beslissen. Leg het vast in de besluitenlog.',
      },
      said: 'Wat je hoort in projecten: “Maak je daar niet druk om, dat is een technisch detail.” Soms klopt dat. Soms is het je grootste risico.',
      recall: [
        {
          q: 'Welke drie dingen geeft de projectleider nooit uit handen?',
          options: ['Het budget, de tools en de overleggen', 'Het ontwerp, de code en de testen', 'Het doel, de risico’s en de besluiten', 'Het team, de leverancier en de klant'],
          answer: 'Het doel, de risico’s en de besluiten',
          why: 'Geef je die weg, dan rapporteer je over het project in plaats van het te leiden.',
        },
        {
          q: 'Hoeveel mensen zijn in een RACI Accountable voor een taak?',
          options: ['Precies één', 'Minstens twee, voor de zekerheid', 'Zoveel als nodig', 'Niemand; verantwoordelijkheid is gedeeld'],
          answer: 'Precies één',
          why: 'Eén A betekent dat duidelijk is wie voor het resultaat instaat.',
        },
        {
          q: 'Waarom is “de leverancier regelt de risico’s” gevaarlijk?',
          options: ['Leveranciers weten zelden genoeg van de risico’s van de klant', 'Het is meestal in strijd met het contract', 'Risico’s in IT-projecten zijn meestal te klein om mee te tellen', 'Dan worden de risico’s beheerst tegen de doelen van de leverancier'],
          answer: 'Dan worden de risico’s beheerst tegen de doelen van de leverancier',
          why: 'Het doel van de leverancier, zoals binnen budget blijven, is niet altijd het doel van de klant.',
        },
        {
          q: 'Een expert zegt: “Die test slaan we over, dat is technisch.” Wat is de betere lezing?',
          options: ['Een puur technische keuze, dus laat het aan hem', 'Een afweging tussen tijd, kosten en risico voor de eindverantwoordelijke', 'Een teken dat de leverancier probeert te beknibbelen', 'Een routinestap, want testen worden in de laatste weken voor livegang vaak ingekort'],
          answer: 'Een afweging tussen tijd, kosten en risico voor de eindverantwoordelijke',
          why: 'Een test overslaan betekent meestal meer risico aanvaarden om tijd te winnen: een zakelijk besluit.',
        },
      ],
      situation: {
        scene: 'Robotcelproject, twee weken voor livegang. De projectleider van de leverancier wil de afgesproken acceptatietest, de test die bewijst dat de cel aan het contract voldoet, inkorten van 8 uur productie naar 2 uur, “want de cel is duidelijk stabiel”. Jij denkt dat die 8 uur er niet voor niks staan, maar je kunt de cel zelf niet beoordelen.',
        ask: 'Hoe pak je het aan?',
        model: '“Ik kan de stabiliteit zelf niet beoordelen, dus ik beslis het niet op gevoel. De 8 uur staan in het contract om storingen te zien die pas na een tijdje optreden, zoals warmte of slijtage. Als je wilt inkorten, stuur me waar je ‘stabiel’ op baseert, en het risico als we ernaast zitten. Ik leg het voor aan de sponsor van de klant met de mening van de productiemanager, en donderdag besluiten we.”',
        rubric: [
          'Beslist niet op onderbuikgevoel en laat het niet aan de leverancier',
          'Vraagt het bewijs en het risico schriftelijk',
          'Legt het besluit bij de eindverantwoordelijke, met een datum',
        ],
        pushback: {
          lines: [
            '“Je maakt dit politiek. Elke dag wachten kost ons ook geld.”',
            '“Als je onze engineers niet vertrouwt, zeg dat dan.”',
          ],
          model: '“Ik vertrouw je engineers wel, en ik weet dat de vertraging je geld kost. Juist daarom wil ik het snel en goed besluiten, niet op mijn gevoel of het jouwe. Stuur me vandaag de data, donderdag beslist de sponsor, en wat ze ook besluit gaat in de log, zodat niemand jouw team achteraf iets kan verwijten.”',
          rubric: [
            'Erkent de kosten en bevestigt het vertrouwen in de mensen',
            'Houdt vast aan wie beslist',
            'Laat zien dat het proces ook de leverancier beschermt',
          ],
        },
      },
      sayIt: 'Leg een nieuwe projectleider in 60 seconden uit wat je nooit uit handen geeft aan de experts, en waarom.',
      terms: [
        { term: 'Projectdoel', def: 'Het resultaat in één regel waarvoor het project bestaat, met een getal en een datum.' },
        { term: 'Eindverantwoordelijk', def: 'Instaan voor het resultaat, wie het werk ook doet; in een RACI precies één per taak.' },
        { term: 'RACI', def: 'Een tabel van wie per taak Responsible, Accountable, Consulted en Informed is.' },
        { term: 'Risicoregister', def: 'Een lijst van wat er mis kan gaan, hoe waarschijnlijk en hoe erg, wat je eraan doet en wie eigenaar is.' },
        { term: 'Besluitenlog', def: 'Een simpele lijst van wat er besloten is, door wie, wanneer en waarom.' },
      ],
    },
    // Onderwerp 2: vragen stellen
    {
      id: 'pm.outside.phasequestions',
      film: 'pm.outside.questions',
      title: 'Vragen per fase',
      pre: [
        {
          q: 'De installateur zegt dat de nieuwe kabel over 6 weken klaar is. Welke vraag levert het meeste op?',
          options: ['“Weet je zeker dat je die zes weken haalt?”', '“Is dat zes weken in werkdagen of kalenderweken?”', '“Kan je team het in vijf als we duwen?”', '“Wat moet er kloppen om die zes weken te halen?”'],
          answer: '“Wat moet er kloppen om die zes weken te halen?”',
          why: 'Die brengt de aannames achter de schatting boven, zoals vergunningen, materiaal en ploegen, en daar zit het risico.',
        },
      ],
      teach: [
        'Als je de antwoorden niet kunt beoordelen, is de kwaliteit van je vragen je vakkennis. Een vragenset is een korte, vaste lijst vragen die je in een bepaalde fase stelt, welk vak het ook is. Hij werkt voor een database, een kabel of een robot.\n\nVijf gebieden dekken het meeste: scope, aannames, risico’s, schattingen en afhankelijkheden. Stel ze in die volgorde; elk bouwt voort op de vorige.',
        'Scope: “Wat hebben we precies aan het eind? Wat zit er uitdrukkelijk niet in?” De tweede helft is het belangrijkst: daar zitten de misverstanden.\n\nEen aanname is iets wat je voorlopig als waar behandelt, zonder bewijs. “Wat nemen we aan dat, als het niet klopt, de planning verandert?” Voorbeeld: “We nemen aan dat het netwerk van de fabriek de nieuwe data aankan.” Schrijf aannames op; elke aanname is een risico tot hij gecheckt is.',
        'Een risico is iets wat kan gebeuren en het doel zou schaden. “Waar maak je je het meest zorgen over? Wat ging er mis bij vergelijkbare klussen?” Vraag elke expert apart; in een groep zet de meest senior stem de toon.\n\nEen schatting is een voorspelling van tijd of kosten, geen belofte. “Hoe zeker ben je, en waar is het op gebaseerd?” Vraag om een bandbreedte (range) in plaats van één getal.',
        'Een afhankelijkheid is iets wat jouw werk van iemand anders nodig heeft voordat het verder kan. “Wat heb je van anderen nodig, en wanneer?” Voorbeelden: de netbeheerder heeft de belastinggegevens van de fabriek nodig voordat hij de kabel kan dimensioneren; de MES-leverancier heeft een koppeling (interface) van het ERP-team nodig.\n\nDe meeste vertragingen in projecten buiten je vak zijn niet technisch. Het zijn afhankelijkheden waar niemand eigenaar van was.',
        'Wanneer gebruik je de sets: bij de start, bij elke wijziging en voor elk go/no-go-moment. Stel elke keer dezelfde vragen; experts raken eraan gewend en gaan de antwoorden voorbereiden.\n\nEen klassieke fout is ze één keer stellen, bij de kick-off, en de antwoorden archiveren. Een scherpe vraag om elke planningssessie mee af te sluiten: “Wat hebben we vandaag aangenomen dat niemand gecheckt heeft?”',
      ],
      example: {
        kind: 'worked',
        text: 'Kick-off voor een MES bij een maker van metalen onderdelen. Je loopt met de leverancier en de IT-lead de vijf gebieden door.\n\nScope: “Welke lijnen draaien bij livegang op het MES?” “Lijn 1 en 2. Lijn 3 zit er niet in.”\nAanname: “Wat nemen we aan?” “Dat de machinedata binnenkomt via het bestaande netwerk.” Jij schrijft: niet gecheckt.\nRisico: “Wat ging er elders mis?” “De stamgegevens (master data), de basisgegevens over producten en routings (de volgorde van bewerkingen per product), waren vervuild.”\nSchatting: “Data opschonen?” “Vier tot acht weken, afhankelijk van de staat.”\nAfhankelijkheid: “Wat heb je nodig?” “Een ERP-koppeling van de IT van de klant voor 1 maart.”\n\nVijf vragen, drie nieuwe risico’s, elk een eigenaar.',
      },
      said: 'Wat je hoort in projecten: “Dat zit niet in de scope.” Fijn om vroeg te horen; vreselijk om bij livegang te horen.',
      recall: [
        {
          q: 'Wat zijn de vijf gebieden van de vragenset, op volgorde?',
          options: ['Budget, middelen, mijlpalen, kwaliteit, communicatie', 'Doelen, stakeholders, randvoorwaarden, methodes, evaluaties', 'Scope, aannames, risico’s, schattingen, afhankelijkheden', 'Eisen, ontwerp, bouw, test, overdracht'],
          answer: 'Scope, aannames, risico’s, schattingen, afhankelijkheden',
          why: 'Elk bouwt voort op de vorige: je kunt niet schatten zonder de scope en de aannames te kennen.',
        },
        {
          q: 'Welke helft van de scopevraag is het belangrijkst?',
          options: ['Wat er uitdrukkelijk niet in zit', 'Wat de hele scope gaat kosten', 'Wat we aan het eind opleveren', 'Wie de scope aftekent'],
          answer: 'Wat er uitdrukkelijk niet in zit',
          why: 'Misverstanden zitten in wat de ene partij erbij denkt en de andere niet.',
        },
        {
          q: 'Waarom vraag je experts één voor één naar risico’s in plaats van in een groep?',
          options: ['Het gaat sneller dan een groepssessie', 'In een groep zet de meest senior stem de toon', 'Experts praten liever niet in groepen over risico’s', 'Zo blijft het risicoregister vertrouwelijk'],
          answer: 'In een groep zet de meest senior stem de toon',
          why: 'Eén op één noemen mensen zorgen die ze bij een senior collega voor zich houden.',
        },
        {
          q: 'Wat veroorzaakt volgens de les de meeste vertragingen in projecten buiten je vak?',
          options: ['Techniek die niet blijkt te werken', 'Experts die hun werk onderschatten', 'Afhankelijkheden waar niemand eigenaar van was', 'Te veel overleggen en statusrapporten die tijd kosten'],
          answer: 'Afhankelijkheden waar niemand eigenaar van was',
          why: 'Het werk wacht vaak op iets van een andere partij dat niemand najoeg.',
        },
      ],
      situation: {
        scene: 'Eerste overleg met de automatiseringsleverancier over een robotcel. Hun sales engineer zegt: “Standaardcel, we hebben er twintig gebouwd. Twaalf weken na order, geen probleem.” De productiemanager van de klant is blij.',
        ask: 'Welke vragen stel je voordat iemand het gaat vieren?',
        model: 'Ik zou de vijf gebieden doorlopen. “Wat zit er precies in die twaalf weken: levering, installatie, de acceptatietest, training? Wat niet?” “Wat nemen jullie aan over onze kant: vloerruimte klaar, stroom, de doosmaten?” “Wat ging er bij die twintig cellen het vaakst mis?” “Is twaalf weken een gemiddeld geval of een veilig geval?” “Wat hebben jullie van ons nodig, en wanneer?”',
        rubric: [
          'Dekt de scope af, inclusief wat er niet in zit',
          'Brengt aannames over de kant van de klant boven',
          'Vraagt naar risicogeschiedenis, de basis van de schatting en afhankelijkheden',
        ],
        pushback: {
          lines: [
            '“We hebben dit twintig keer gedaan. Je hoeft ons niet zo uit te horen.”',
            '“Als je dat allemaal op papier wilt, beginnen de twaalf weken pas als we het geschreven hebben.”',
          ],
          model: '“Juist door die twintig cellen vraag ik het: jullie weten wat er misgaat, ik niet. Vijf antwoorden is genoeg, en daar is geen document voor nodig; een mail van vijf regels is prima. Het meeste gaat over wat jullie van ons nodig hebben, zodat wij niet jullie vertraging worden.”',
          rubric: [
            'Maakt van hun ervaring een reden om te antwoorden',
            'Houdt de vraag klein en praktisch',
            'Brengt de vragen als bescherming van de leverancier',
          ],
        },
      },
      sayIt: 'Leg in 60 seconden de vijf gebieden van de vragenset uit, met bij elk één vraag.',
      terms: [
        { term: 'Vragenset', def: 'Een korte, vaste lijst vragen die je in een bepaalde fase stelt, welk vak het ook is.' },
        { term: 'Aanname', def: 'Iets wat je voorlopig als waar behandelt, zonder bewijs; een risico tot hij gecheckt is.' },
        { term: 'Risico', def: 'Iets wat kan gebeuren en het doel zou schaden.' },
        { term: 'Schatting', def: 'Een voorspelling van tijd of kosten, geen belofte; het best als bandbreedte met de basis erbij.' },
        { term: 'Afhankelijkheid', def: 'Iets wat jouw werk van iemand anders nodig heeft voordat het verder kan.' },
      ],
    },
    {
      id: 'pm.outside.fail',
      title: '“Waardoor zou dit mislukken?”',
      pre: [
        {
          q: 'Het team zegt dat het livegangplan staat. Welke vraag brengt meestal de meeste risico’s boven?',
          options: ['“Stel, het is zes maanden later en de livegang mislukte. Wat gebeurde er?”', '“Hoe zeker is iedereen hier eigenlijk van dit plan, op een schaal van één tot tien?”', '“Ziet iemand nog risico’s die niet op de lijst staan?”', '“Wat kunnen we doen om een paar weken eerder live te gaan?”'],
          answer: '“Stel, het is zes maanden later en de livegang mislukte. Wat gebeurde er?”',
          why: 'Doen alsof de mislukking al gebeurd is, maakt het makkelijker oorzaken te noemen dan “nog risico’s?”, waar je een snel nee op krijgt.',
        },
      ],
      teach: [
        'Twee vragen doen meer werk dan alle andere als je de inhoud niet kunt beoordelen: “Waardoor zou dit mislukken?” en “Hoe weet je dat?”\n\nDe eerste vindt risico’s. De tweede toetst de beweringen. Samen laten ze je een plan testen zonder elk detail ervan te snappen.',
        'Een premortem is een gestructureerde versie van de eerste vraag. Gary Klein beschreef hem in Harvard Business Review (2007): het team stelt zich voor dat het project al mislukt is en iedereen schrijft op waarom, voordat iemand iets zegt.\n\nKlein haalt een onderzoek aan (Mitchell, Russo en Pennington, 1989) waarin mensen die zich voorstelden dat een gebeurtenis al had plaatsgevonden, ongeveer 30% meer redenen ervoor bedachten. Het telde redenen, niet hun kwaliteit, maar meer kandidaten is wat je hier wilt. Eerst schrijven voorkomt dat de senior stem de toon zet.',
        'Let op een single point of failure: één onderdeel, persoon of leverancier die, als hij uitvalt, alles stillegt. Eén server zonder back-up, één programmeur die de code kent, één kabel die de hele fabriek voedt.\n\nVraag bij elk serieus risico naar de beheersmaatregel (mitigation): wat we nu doen om het minder waarschijnlijk of minder erg te maken, en wie eigenaar is. Een risico zonder beheersmaatregel en eigenaar is alleen een zorg.',
        '“Hoe weet je dat?” vraagt om bewijs: iets wat jij of een ander kan zien, testen of controleren, geen mening. De ladder loopt van zwak naar sterk: “ik denk het”, “het werkte eerder”, “we hebben het hier getest”, “hier is het testrapport”.\n\nVraag het rustig en over de bewering, niet over de persoon: “Hoe weten we dat het netwerk de data aankan?” in plaats van “Weet je het zeker?”',
        'De klassieke fout is de vragen stellen en het eerste antwoord accepteren. Het eerste antwoord is meestal het comfortabele; het bruikbare komt na een pauze of een tweede vraag. Dat zijn Silence (stilte) en Inquiry (doorvragen) uit MORE PIES, een luisterchecklist die je later helemaal tegenkomt: zwijg even, en vraag dan één laag dieper: “En als dat gebeurde, wat zouden we het eerst zien?”\n\nEen grove vuistregel die veel projectleiders gebruiken: levert een premortem geen enkel risico op dat je verrast, dan zijn mensen nog niet eerlijk geweest.',
      ],
      example: {
        kind: 'worked',
        text: 'Twee maanden voor een MES-livegang houd je een premortem van 30 minuten met acht mensen.\n\nStap 1: “Het is september. De livegang is mislukt. Schrijf alleen, 5 minuten, op waarom.”\nStap 2: lees ze een voor een voor. Antwoorden zijn onder meer: “De barcodescanners op lijn 2 maakten geen verbinding”, “Operators op de nachtdienst waren niet getraind”, “Alleen Ahmed kent de koppeling”.\nStap 3: groepeer ze en kies de drie ernstigste.\nStap 4: vraag bij elk “Hoe weten we dat het niet gebeurt?” Voor de scanners: “We hebben ze op kantoor getest, niet aan de lijn.” Dat is zwak bewijs.\nStap 5: een beheersmaatregel en eigenaar: volgende week een scannertest op lijn 2, eigenaar de IT-lead.\n\nDe single point of failure, Ahmed, krijgt een tweede persoon die wordt ingewerkt.',
      },
      said: 'Wat je hoort in projecten: “Het werkte in de testomgeving.” De volgende vraag: “En hoe weten we dat het aan de lijn werkt?”',
      recall: [
        {
          q: 'Wat gebeurt er in een premortem?',
          options: ['Het team bespreekt na afloop wat er misging', 'De leverancier loopt zijn testresultaten met het team door', 'De sponsor somt de risico’s op die het team de komende tijd moet beheersen', 'Het team stelt zich voor dat het project mislukt is en schrijft op waarom'],
          answer: 'Het team stelt zich voor dat het project mislukt is en schrijft op waarom',
          why: 'Ingebeelde terugblik maakt het makkelijker oorzaken te noemen; eerst alleen schrijven houdt het eerlijk.',
        },
        {
          q: 'Hoeveel meer redenen bedachten mensen ongeveer in het onderzoek uit 1989 dat Klein aanhaalt, als ze zich voorstelden dat de gebeurtenis al had plaatsgevonden?',
          options: ['Ongeveer 80% meer', 'Ongeveer 30% meer', 'Helemaal niet meer', 'Ongeveer 5% meer'],
          answer: 'Ongeveer 30% meer',
          why: 'Mitchell, Russo en Pennington (1989), aangehaald door Klein (2007). Klein noemt het een 30% beter vermogen om redenen te vinden; het onderzoek telde hoeveel redenen mensen gaven, niet hoe goed ze waren.',
        },
        {
          q: 'Wat is het sterkste bewijs dat een scanner aan de lijn werkt?',
          options: ['“Ik weet vrij zeker dat hij werkt; het is een standaardscanner”', '“Bij een andere klant werkte hij vorig jaar prima”', '“We hebben hem op kantoor getest en hij maakte verbinding”', '“Hier is het rapport van de test op lijn 2”'],
          answer: '“Hier is het rapport van de test op lijn 2”',
          why: 'Hier getest, onder echte omstandigheden, en vastgelegd: de top van de ladder.',
        },
        {
          q: 'Wat is een single point of failure?',
          options: ['Het risico met de hoogste score op het risicoregister van het project', 'Een risico zonder eigenaar of beheersmaatregel', 'Eén onderdeel, persoon of leverancier waarvan uitval alles stillegt', 'Een test die faalt en de volgende mijlpaal blokkeert'],
          answer: 'Eén onderdeel, persoon of leverancier waarvan uitval alles stillegt',
          why: 'Eén server, één expert, één kabel: geen back-up betekent dat één storing het geheel stillegt.',
        },
      ],
      situation: {
        scene: 'Project met de netbeheerder. De engineer van de netbeheerder zegt dat de nieuwe aansluiting van de fabriek op 1 oktober onder spanning kan “als alles goed gaat”. De fabriek heeft de start van een nieuwe productielijn op 2 oktober gepland.',
        ask: 'Wat vraag je, en wat vertel je de fabriek?',
        model: 'Aan de engineer: “Waardoor zou 1 oktober niet lukken? Wat moet er tussen nu en dan goed gaan?” Dan: “Hoe weten we dat de schakelinstallatie op tijd geleverd wordt; is er een bevestigde datum van de fabrikant?” Aan de fabriek: “1 oktober is de datum als alles goed gaat. De lijn een dag later starten laat geen marge. Ik zou de start half oktober plannen, of een tijdelijke voeding regelen.”',
        rubric: [
          'Vraagt waardoor het zou mislukken en naar bewijs achter de cruciale stap',
          'Ziet dat er geen marge zit tussen de twee data',
          'Geeft de fabriek een concrete optie',
        ],
        pushback: {
          lines: [
            '“We zeggen altijd ‘als alles goed gaat’. Dat betekent niks.”',
            '“De fabriek gaat het niet leuk vinden dat jij onze datum wankel maakt.”',
          ],
          model: '“Dat helpt, dank je. Dan vraag ik het anders: hoe vaak houdt zo’n datum stand, in jouw ervaring? Als het negen van de tien keer is, kan de fabriek daarmee beslissen. Ik maak jouw datum niet wankel; ik zorg dat de fabriek geen lijnstart plant op de ene dag dat hij niet mag schuiven.”',
          rubric: [
            'Herformuleert om een bruikbaar antwoord te krijgen',
            'Vraagt naar kansen uit ervaring in plaats van een belofte',
            'Laat zien dat hij beide kanten beschermt',
          ],
        },
      },
      sayIt: 'Leg in 60 seconden stap voor stap uit hoe je een premortem houdt.',
      terms: [
        { term: 'Premortem', def: 'Een sessie waarin het team zich voorstelt dat het project mislukt is en opschrijft waarom, voordat het begint (Klein, 2007).' },
        { term: 'Single point of failure', def: 'Eén onderdeel, persoon of leverancier die alles stillegt als hij uitvalt.' },
        { term: 'Beheersmaatregel', def: 'Wat je nu doet om een risico minder waarschijnlijk of minder erg te maken, met een eigenaar.' },
        { term: 'MORE PIES', def: 'Een checklist voor actief luisteren: Mood (sfeer), Open vragen, Reflecteren, Empathie, Parafraseren, Inquiry (doorvragen), Experience (ervaring), Silence (stilte).' },
        { term: 'Bewijs', def: 'Iets wat je kunt zien, testen of controleren, geen mening; van “ik denk het” tot een testrapport.' },
      ],
    },
    {
      id: 'pm.outside.estimates',
      film: 'pm.outside.questions',
      title: 'Schattingen toetsen zonder vakkennis',
      pre: [
        {
          q: 'Een programmeur schat de koppeling op “drie weken”. Jij kunt de code niet beoordelen. Wat is de nuttigste volgende stap?',
          options: ['Vragen om een bandbreedte en naar eerdere vergelijkbare koppelingen', 'Inkorten naar twee weken, zodat er een uitdagend doel ligt', 'Accepteren zoals het is, want hij kent de code', 'Er standaard 50% buffer bij doen, de gebruikelijke marge voor software'],
          answer: 'Vragen om een bandbreedte en naar eerdere vergelijkbare koppelingen',
          why: 'Een bandbreedte laat de onzekerheid zien, en eerdere klussen zijn de beste toets die je hebt zonder de code te kennen.',
        },
      ],
      teach: [
        'Je kunt een schatting niet toetsen door het werk te beoordelen, maar wel door te kijken hoe hij gemaakt is. Drie gereedschappen: bandbreedtes, referentieklassen en een tweede schatting.\n\nWaarom je ze nodig hebt: Daniel Kahneman en Amos Tversky (1979) benoemden de planningsdrogreden (planning fallacy), de neiging om te onderschatten hoe lang je eigen taak duurt, zelfs als je weet dat vergelijkbare taken uitliepen. Experts hebben er ook last van.',
        'Een bandbreedte is een lage en een hoge schatting in plaats van één getal: “tussen 3 en 6 weken”. Hij laat zien hoe onzeker iemand is. Een driepuntsschatting voegt een meest waarschijnlijke waarde toe; een gangbare formule (uit PERT, in 1958 ontwikkeld voor het Polaris-raketprogramma van de Amerikaanse marine) weegt die: (optimistisch + 4 × meest waarschijnlijk + pessimistisch) ÷ 6.\n\nHet is een afspraak, geen wet, maar het trekt de schatting naar de lange staart.',
        'Een referentieklasse is een groep vergelijkbare eerdere projecten die je als maatstaf gebruikt. Kahneman en Bent Flyvbjerg raden het aan: in plaats van redeneren vanuit het plan vraag je “hoe lang duurden de laatste vijf koppelingen zoals deze?”\n\nFlyvbjerg en Gardner (How Big Things Get Done, 2023) melden uit een database van ongeveer 16.000 projecten, vooral grote, dat maar 8,5% zowel budget als planning haalde, en maar 0,5% ook de beloofde baten opleverde. Zo’n basiscijfer (base rate) wint van een zelfverzekerd plan.',
        'Een tweede schatting: vraag een andere expert, zonder het eerste getal te laten zien, en vergelijk. Liggen ze dicht bij elkaar, mooi. Liggen ze ver uit elkaar, dan is het verschil het gesprek: “Wat zie jij waardoor het langer duurt?”\n\nLet ook op de taal. “Drie weken als er niks misgaat” is het beste geval, niet de schatting. En een schatting die maandenlang niet verandert, wordt vaak niet bijgewerkt.',
        'Experts twisten over hoe je schattingen gebruikt. Sommige agile teams vermijden tijdschattingen en voorspellen alleen vanuit hun eigen trackrecord. Anderen willen een vast getal voor het contract. Voor jou is de vraag simpeler: is de schatting een voorspelling met haar onzekerheid, of een hoop?\n\nEen scherpe vraag: “Waardoor zou het twee keer zo lang duren?” Komt het antwoord meteen, zet dat dan in de bandbreedte.',
      ],
      example: {
        kind: 'faded',
        text: 'De automatiseringsleverancier schat het PLC-programmeerwerk voor een robotcel. Hun programmeur geeft je drie getallen: optimistisch 6 weken, meest waarschijnlijk 8 weken, pessimistisch 16 weken. Je weet van hun laatste drie cellen dat het programmeren 9, 11 en 10 weken duurde.',
        ask: 'Wat is de driepuntsschatting, en wat zegt de referentieklasse?',
        reveal: 'Driepunts: (6 + 4 × 8 + 16) ÷ 6 = 54 ÷ 6 = 9 weken.\n\nDe referentieklasse, 9 tot 11 weken bij hun eigen laatste drie cellen, zegt dat 9 aan de optimistische kant ligt van wat ze echt deden. Plan dus rond 10 tot 11 weken, en vraag: “De laatste drie duurden 9 tot 11. Waardoor gaat deze sneller?” Is er een echte reden, zoals code hergebruiken, prima. Zo niet, zet het langere getal in de planning.',
      },
      said: 'Wat je hoort in projecten: “Drie weken, als er niks misgaat.” Er gaat altijd iets mis.',
      recall: [
        {
          q: 'Wat is de planningsdrogreden?',
          options: ['Een plan maken voordat het budget is goedgekeurd', 'Je eigen taak onderschatten, ook als je weet dat vergelijkbare uitliepen', 'Zo ver vooruit plannen dat het plan al achterhaald is voordat je goed en wel begint', 'Risico’s overschatten, zodat plannen te veel buffer krijgen'],
          answer: 'Je eigen taak onderschatten, ook als je weet dat vergelijkbare uitliepen',
          why: 'Benoemd door Kahneman en Tversky (1979); experts zijn er niet immuun voor.',
        },
        {
          q: 'Een optimistische schatting van 4 weken, meest waarschijnlijk 6, pessimistisch 14. Wat is de driepuntsschatting in weken, met de formule (O + 4M + P) ÷ 6?',
          number: 7,
          tolerance: 0.1,
          unit: 'weken',
          why: '(4 + 4 × 6 + 14) ÷ 6 = 42 ÷ 6 = 7 weken.',
        },
        {
          q: 'Wat is een referentieklasse?',
          options: ['Een training waarin experts leren schatten', 'De schatting van de meest senior expert, als maatstaf', 'Een groep vergelijkbare eerdere projecten als maatstaf', 'De contractprijs, als bovengrens'],
          answer: 'Een groep vergelijkbare eerdere projecten als maatstaf',
          why: 'Eerdere uitkomsten van vergelijkbaar werk zijn een betere toets dan alleen redeneren vanuit het plan.',
        },
        {
          q: 'Twee experts geven onafhankelijke schattingen: 4 weken en 10 weken. Wat doe je?',
          options: ['Vragen wat de een ziet dat de ander niet ziet', 'De kortste nemen, om de druk op het team te houden', 'De langste nemen, voor de zekerheid', 'Het gemiddelde nemen: 7 weken'],
          answer: 'Vragen wat de een ziet dat de ander niet ziet',
          why: 'Het verschil laat andere aannames zien; dat gesprek is meer waard dan elk van beide getallen.',
        },
      ],
      situation: {
        scene: 'MES-project. De leverancier zegt dat de datamigratie, het overzetten van product- en routinggegevens van het oude systeem naar het nieuwe, “vier weken” duurt. De IT-lead van de klant fluistert je daarna toe: “De vorige keer dat we data migreerden, duurde het vier maanden.”',
        ask: 'Wat doe je met deze twee getallen?',
        model: 'Ik kies er geen. Ik vraag de leverancier om een bandbreedte en de basis: hoeveel producten, hoe schoon de data, wat “klaar” betekent. Ik vraag de IT-lead wat er de vorige keer vier maanden duurde. Dan zet ik ze in één overleg: “Jullie vier weken gaan uit van schone data; de vorige keer kostte opschonen de meeste tijd. Wat zou het met onze data worden?” De planning krijgt een bandbreedte, met datakwaliteit als benoemd risico.',
        rubric: [
          'Kiest niet zomaar een getal',
          'Vraagt naar de basis van elke schatting',
          'Gebruikt het vorige project als referentie en plant met een bandbreedte',
        ],
        pushback: {
          lines: [
            '“Vier weken is onze standaard. We hebben vijftig migraties gedaan.”',
            '“Als je een bandbreedte in de planning zet, houdt de klant ons aan het slechtste geval.”',
          ],
          model: '“Vijftig migraties is mooi, dan weten jullie hoe de tijd verdeeld is tussen overzetten en opschonen. Als onze data net zo rommelig is als de vorige keer, houdt vier weken dan nog stand? Ik zet de bandbreedte erin met de reden, datakwaliteit, en we maken hem kleiner nadat jullie over twee weken een steekproef van de data hebben genomen. Dat beschermt jullie meer dan een getal dat breekt.”',
          rubric: [
            'Respecteert hun ervaring en vraagt naar de verdeling',
            'Koppelt de bandbreedte aan een benoemde oorzaak',
            'Biedt een moment om de bandbreedte te verkleinen',
          ],
        },
      },
      sayIt: 'Leg in 60 seconden drie manieren uit om een schatting te toetsen als je het werk niet kunt beoordelen.',
      terms: [
        { term: 'Planningsdrogreden', def: 'De neiging om te onderschatten hoe lang je eigen taak duurt, zelfs als vergelijkbare taken uitliepen (Kahneman en Tversky, 1979).' },
        { term: 'Bandbreedte', def: 'Een lage en een hoge schatting in plaats van één getal, die de onzekerheid laat zien.' },
        { term: 'Driepuntsschatting', def: 'Een schatting uit een optimistische, meest waarschijnlijke en pessimistische waarde, vaak gewogen als (O + 4M + P) ÷ 6 (PERT).' },
        { term: 'Referentieklasse', def: 'Een groep vergelijkbare eerdere projecten die je als maatstaf gebruikt voor een nieuwe schatting.' },
        { term: 'Tweede schatting', def: 'Een onafhankelijke schatting van een andere expert, gemaakt zonder de eerste te zien, om te vergelijken.' },
      ],
    },
    {
      id: 'pm.outside.jargon',
      title: 'Jargon terugvertalen',
      pre: [
        {
          q: 'De netengineer zegt: “Het kortsluitvermogen op het aansluitpunt is te hoog voor die schakelinstallatie.” Wat is het beste antwoord voor een projectleider?',
          options: ['“Oké, genoteerd. Laten we doorgaan en het volgend overleg weer oppakken.”', '“Laten we dat buiten dit overleg houden; kunnen jij en de installateur het deze week samen oplossen?”', '“Kun je me de berekening sturen, dan loop ik die in het weekend door?”', '“Dus die schakelinstallatie kan een storing daar niet aan? Wat betekent dat voor kosten en datum?”'],
          answer: '“Dus die schakelinstallatie kan een storing daar niet aan? Wat betekent dat voor kosten en datum?”',
          why: 'Parafraseren in gewone woorden checkt of je het begreep, en de vervolgvraag maakt van jargon een gevolg voor het project. (Kortsluitvermogen: hoeveel stroom er bij een kortsluiting gaat lopen; de schakelinstallatie moet die veilig kunnen afschakelen.)',
        },
      ],
      teach: [
        'Jargon is de vaktaal van een vakgebied: woorden die voor insiders precies zijn en voor iedereen anders ondoorzichtig. Op zich is dat geen probleem. Het probleem is als er in die taal besluiten vallen en niemand buiten het vak snapt wat er besloten is.\n\nJouw taak is terugvertalen: van jargon naar doel, kosten, tijd en risico, zodat de sponsor en de mensen op de vloer het kunnen volgen.',
        'Het luisterkader hierachter is MORE PIES, een checklist voor actief luisteren, luisteren om te begrijpen in plaats van om te antwoorden: Mood (sfeer), Open vragen, Reflecteren, Empathie, Parafraseren, Inquiry, Experience (ervaring), Silence (stilte).\n\nTwee letters doen hier het meest. Parafraseren: de inhoud in je eigen woorden herhalen om te checken of je het begreep. Inquiry, doorvragen: één laag dieper vragen, tot je bij het gevolg bent.',
        'De parafrase: “Dus wat je zegt is…” gevolgd door gewone woorden, en dan een check: “Klopt dat?” Experts verbeteren je meestal, en in die verbetering zit wat je leert.\n\nDan doorvragen, met drie vragen die altijd werken: “Wat betekent dat voor de datum?”, “Wat betekent het voor de kosten?”, “Wat betekent het voor het risico?” Stilte helpt ook: wacht na de parafrase op de verbetering.',
        'Terugvertellen (teach-back) komt uit de zorg: de arts vraagt de patiënt de instructies in eigen woorden terug te vertellen. Jij kunt het andersom gebruiken: vertel het punt van de expert aan hem terug zoals je het aan de sponsor zou vertellen, en laat hem het verbeteren.\n\nHet resultaat is een zin die je mee kunt nemen naar de stuurgroep zonder iemand verkeerd te citeren.',
        'Klassieke fouten: zo los vertalen dat de betekenis verandert (“dus eigenlijk is het prima?”), of de expert in jargon direct aan het bestuur laten presenteren. Een andere: doen alsof je het volgt, en dan het jargon onvertaald doorgeven.\n\nEen scherpe zet als een expert aan managers gaat presenteren: vraag hem naar de ene zin die de sponsor moet onthouden, in gewone woorden, en spreek die eerst met hem af.',
      ],
      example: {
        kind: 'faded',
        text: 'MES-project, ontwerpoverleg. De integratiespecialist zegt: “De ERP-koppeling is batch, niet real-time, dus we krijgen orderwijzigingen met tot 15 minuten latency, en we kunnen geen idempotentie garanderen bij retries.”\n\nJe parafraseert het eerste deel: “Dus orderwijzigingen van kantoor komen tot 15 minuten te laat op de vloer aan.” Hij knikt.',
        ask: 'Hoe pak je het tweede deel aan, en wat neem je mee naar de sponsor?',
        reveal: 'Vraag het eerlijk: “Idempotentie bij retries, wat betekent dat in gewone woorden, en wat is het gevolg?” Antwoord: “Als een bericht twee keer wordt verstuurd, kan een order dubbel verschijnen.”\n\nDoorvragen: “Wat zou dat ons op de vloer kosten, en hoe vaak?” Dan terugvertellen: “Dus ik zou de sponsor zeggen: orders kunnen tot 15 minuten te laat binnenkomen, en als de verbinding hapert kan een order dubbel komen, dus we hebben een check op dubbele orders nodig. Klopt dat?” Hij past één woord aan. Die zin gaat naar de stuurgroep.',
      },
      said: 'Wat je hoort in projecten: “Dus wat je zegt is…” De vijf nuttigste woorden die een projectleider heeft.',
      recall: [
        {
          q: 'Waar staan de letters van MORE PIES voor?',
          options: ['Mood, Open vragen, Reflecteren, Empathie, Positiviteit, Interesse, Evaluatie, Samenvatten', 'Mood, Open vragen, Reflecteren, Empathie, Parafraseren, Inquiry, Experience, Silence', 'Motivatie, Open vragen, Reflecteren, Empathie, Parafraseren, Inquiry, Evaluatie, Silence', 'Mood, Observeren, Reflecteren, Erkennen, Parafraseren, Interesse, Experience, Samenvatten'],
          answer: 'Mood, Open vragen, Reflecteren, Empathie, Parafraseren, Inquiry, Experience, Silence',
          why: 'Een checklist voor actief luisteren; parafraseren en doorvragen (Inquiry) doen het meeste vertaalwerk.',
        },
        {
          q: 'Welke drie vragen maken van jargon een gevolg voor het project?',
          options: ['Wie is eigenaar, wat is er nodig, waar zit het vast?', 'Waarom, waarom en nog eens waarom, tot de grondoorzaak?', 'Zit het in de scope, is het getest, is het afgetekend?', 'Wat betekent het voor de datum, de kosten en het risico?'],
          answer: 'Wat betekent het voor de datum, de kosten en het risico?',
          why: 'Dat zijn de termen waarin de sponsor beslist.',
        },
        {
          q: 'Wat is terugvertellen, gebruikt door een projectleider?',
          options: ['Het verslag van het overleg ter controle en goedkeuring naar de expert sturen', 'De expert de basis van projectmanagement uitleggen', 'Zijn punt vertellen zoals aan de sponsor, zodat hij het kan verbeteren', 'De expert de wijziging aan de operators laten uitleggen'],
          answer: 'Zijn punt vertellen zoals aan de sponsor, zodat hij het kan verbeteren',
          why: 'Zo krijg je een gewone zin waar de expert achter staat, zodat je hem hogerop niet verkeerd citeert.',
        },
        {
          q: 'Wat is een klassieke fout bij het vertalen van jargon?',
          options: ['Zo los vertalen dat de betekenis verschuift: “dus eigenlijk is het prima?”', 'De expert je parafrase laten verbeteren waar de sponsor bij is', 'Na de parafrase stil blijven tot de expert het gat invult', 'De expert vragen om de ene zin die de sponsor echt moet onthouden van het verhaal'],
          answer: 'Zo los vertalen dat de betekenis verschuift: “dus eigenlijk is het prima?”',
          why: 'Een losse vertaling lokt een beleefd ja uit en het risico verdwijnt.',
        },
      ],
      situation: {
        scene: 'Project met de netbeheerder. In de stuurgroep legt de engineer van de netbeheerder uit: “Door congestie kunnen we tot de bouw van het nieuwe onderstation alleen een niet-vaste aansluiting bieden, met curtailment in de piekuren.” De fabrieksdirecteur fronst en kijkt naar jou.',
        ask: 'Hoe vertaal je dit, live, in het overleg?',
        model: '“Even checken of ik het goed heb, en verbeter me. Het net in deze regio zit vol (netcongestie), dus tot het nieuwe onderstation klaar is, krijgt de fabriek een aansluiting waarbij de netbeheerder ons vermogen op drukke momenten mag beperken. Klopt dat?” Hij bevestigt. “Dan de vragen voor ons: hoe vaak, hoe lang, en wanneer is het onderstation klaar? Dan weten we of de nieuwe lijn volle diensten kan draaien.”',
        rubric: [
          'Parafraseert in gewone woorden en vraagt om verbetering',
          'Legt congestie en beperking uit zonder jargon',
          'Maakt er de vragen van waarop de directeur beslist',
        ],
        pushback: {
          lines: [
            '“Dat is een versimpeling. Curtailment is genuanceerder dan ‘ons vermogen beperken’.”',
            '“Ik heb liever dat de directeur onze technische notitie leest dan jouw versie.”',
          ],
          model: '“Je hebt gelijk, het is versimpeld, dus zeg me wat ik weglaat dat telt voor het besluit. De notitie moet ook naar de directeur. Wat ik nu van je nodig heb is één zin waarop hij kan beslissen: hoeveel uur per jaar we mogelijk beperkt worden, en hoeveel. Als je vandaag een bandbreedte kunt geven, kunnen de details in de notitie volgen.”',
          rubric: [
            'Accepteert de verbetering en vraagt wat telt voor het besluit',
            'Houdt de notitie maar vraagt om een zin om op te beslissen',
            'Vraagt om een bandbreedte in plaats van zekerheid',
          ],
        },
      },
      sayIt: 'Vertaal in 60 seconden één stuk jargon uit je eigen werk: parafraseer het, en zeg wat het betekent voor datum, kosten en risico.',
      terms: [
        { term: 'Jargon', def: 'De vaktaal van een vakgebied: precies voor insiders, ondoorzichtig voor anderen.' },
        { term: 'Actief luisteren', def: 'Luisteren om te begrijpen in plaats van om te antwoorden, en dat laten merken.' },
        { term: 'Parafraseren', def: 'De inhoud in je eigen woorden herhalen om te checken of je het begreep.' },
        { term: 'Doorvragen', def: 'Eén laag dieper vragen, tot je bij het gevolg bent (de Inquiry uit MORE PIES).' },
        { term: 'Terugvertellen', def: 'Een punt in je eigen woorden terugvertellen zodat de ander het kan verbeteren; komt uit de zorg.' },
      ],
    },
    // Onderwerp 3: werken met experts
    {
      id: 'pm.outside.trust',
      title: 'Vertrouwen en controleren',
      pre: [
        {
          q: 'De PLC-programmeur zegt dat alle noodstoppen werken. Jij kunt de code niet lezen. Wat is een verstandige controle?',
          options: ['Hem schriftelijk laten bevestigen dat elke stop afzonderlijk is gecontroleerd en werkt', 'Bij de test kijken waarin elke stop wordt geactiveerd, en hem laten aftekenen', 'Het veiligheidsdeel van de code zelf lezen, met zijn hulp', 'Hem vertrouwen, want om bewijs vragen ondermijnt hem'],
          answer: 'Bij de test kijken waarin elke stop wordt geactiveerd, en hem laten aftekenen',
          why: 'Je controleert het resultaat, niet de code, en je controleert het meest waar het risico het grootst is.',
        },
      ],
      teach: [
        'Vertrouwen maar controleren (trust but verify), een oud Russisch spreekwoord dat Ronald Reagan in de jaren tachtig beroemd maakte bij wapenonderhandelingen, is de werkregel met experts. Je vertrouwt hun vakmanschap en bedoelingen; je controleert de resultaten die echt tellen.\n\nControleren is geen wantrouwen. Experts controleren elkaar voortdurend: codereviews, testrapporten, een tweede engineer die een tekening tekent. Jij vraagt hetzelfde.',
        'Controleer resultaten, geen methodes. Je kunt niet beoordelen hoe een kabel is berekend, maar je kunt vragen: “Wie heeft de berekening gecontroleerd, en waar is die getekend?” Je kunt geen code lezen, maar je kunt bij de test kijken.\n\nHet vier-ogenprincipe betekent dat elk belangrijk stuk werk door een tweede bevoegde persoon wordt gecontroleerd. Jouw taak is zorgen dat dat tweede paar ogen er is, niet het zelf zijn.',
        'Risicogestuurd controleren: controleer harder waar een fout het meest pijn doet. Veiligheid, geld en alles wat je niet terug kunt draaien krijgen een volledige controle. Routinezaken krijgen een steekproef (spot check): een controle van een klein willekeurig deel in plaats van alles, zoals drie van de veertig tekeningen.\n\nZo vermijd je twee fouten: niks controleren, en alles controleren zodat experts zich bekeken voelen en trager gaan werken.',
        'Hoe vraag je het zonder te beledigen: maak het over het proces, niet over de persoon, en zeg het vooraf. “In elk project vraag ik om de testresultaten van de veiligheidspunten. Het gaat niet om jou.” Vooraf afgesproken is het routine. Na een probleem ingevoerd voelt het als verdenking.\n\nEen klassieke fout: pas controleren als je iemand al wantrouwt. Dan komt de controle te laat.',
        'Experts duwen soms terug: “Daar hebben we geen tijd voor, al dat papierwerk.” Vaak hebben ze gelijk dat sommige controles alleen ritueel zijn. Vraag welke controles volgens hen echt problemen vangen, en houd die.\n\nEen scherpe vraag: “Als dit fout was, hoe zouden we daarachter komen, en hoe snel?” Is het antwoord “bij livegang”, dan heb je daarvoor een controle nodig.',
      ],
      example: {
        kind: 'worked',
        text: 'Robotcelproject. Veertig punten op de checklist van de leverancier. Geen ervan kun je zelf beoordelen.\n\nStap 1: sorteer op risico met de veiligheidskundige van de klant. Vijf punten zijn veiligheid (noodstoppen; het lichtscherm, een lichtstraal die de robot stopt als iemand erin grijpt; hekvergrendelingen die hem stoppen als een deur opengaat), drie zijn contractprestaties (snelheid, beschikbaarheid), tweeëndertig zijn routine.\nStap 2: veiligheid en prestaties krijgen een volledige controle: jij kijkt bij de test, en de veiligheidskundige tekent.\nStap 3: routine krijgt een steekproef: je kiest er willekeurig drie en vraagt ze te zien.\nStap 4: je spreekt dit bij de start af met de leverancier: “Zo controleer ik, in elk project.”\n\nResultaat: volledige grip op de acht punten die echt tellen, een lichte hand op de rest.',
      },
      said: 'Wat je hoort in projecten: “Vertrouw ons nou maar, we hebben dit vaker gedaan.” En het antwoord: “Doe ik. Laat me de test toch zien.”',
      recall: [
        {
          q: 'Wat controleer je als je de methode niet kunt beoordelen?',
          options: ['Het cv van de expert en de referenties van zijn vorige drie projecten', 'Niets meer; bij een goede expert is vertrouwen genoeg', 'De resultaten, en dat een tweede bevoegde persoon ze controleerde', 'Elke stap van het werk, voor zover je die kunt volgen'],
          answer: 'De resultaten, en dat een tweede bevoegde persoon ze controleerde',
          why: 'Je controleert uitkomsten en zorgt dat de vier-ogencontrole er is, zonder zelf het tweede paar ogen te zijn.',
        },
        {
          q: 'Wat is het vier-ogenprincipe?',
          options: ['Belangrijk werk wordt gecontroleerd door een tweede bevoegde persoon', 'Elk kritisch onderdeel wordt bij twee leveranciers gekocht', 'Elk project heeft twee leiders die de rol delen', 'Elke expert werkt samen met een junior die over zijn schouder meekijkt'],
          answer: 'Belangrijk werk wordt gecontroleerd door een tweede bevoegde persoon',
          why: 'Een tweede bevoegde controle vangt wat de eerste persoon in zijn eigen werk niet ziet.',
        },
        {
          q: 'Welke punten krijgen bij risicogestuurd controleren een volledige controle?',
          options: ['Alle punten even zwaar, zodat niemand zich aangewezen voelt', 'De nieuwste punten, omdat die nog niet getest zijn', 'Wat de expert het belangrijkst vindt', 'Veiligheid, geld en alles wat je niet terug kunt draaien'],
          answer: 'Veiligheid, geld en alles wat je niet terug kunt draaien',
          why: 'Controleer het hardst waar een fout het meest pijn doet; neem een steekproef van de routine.',
        },
        {
          q: 'Wanneer spreek je de controles met experts af?',
          options: ['Na het eerste probleem', 'Bij de start, als routine', 'Nooit, gewoon doen', 'Bij livegang'],
          answer: 'Bij de start, als routine',
          why: 'Vooraf afgesproken is het normaal; na problemen ingevoerd voelt het als verdenking.',
        },
      ],
      situation: {
        scene: 'MES-project. De leverancier zegt dat alle 300 productrecords zijn gemigreerd en gecontroleerd. De livegang is over twee weken. Jij kunt de data zelf niet beoordelen.',
        ask: 'Hoe controleer je dit zonder data-expert te worden?',
        model: 'Ik vraag wie het gecontroleerd heeft en hoe, en het resultaat op papier. Dan een steekproef met de mensen die de producten kennen: de planner kiest 10 willekeurige records en vergelijkt ze met het oude systeem. Kloppen ze alle 10, mooi. Zijn er 2 fout, dan klopt “alles gecontroleerd” niet en hebben we voor livegang een uitgebreidere controle nodig.',
        rubric: [
          'Vraagt hoe het gecontroleerd is en door wie',
          'Gebruikt een steekproef door iemand die de inhoud kent',
          'Zegt vooraf welke uitkomst tot meer controle leidt',
        ],
        pushback: {
          lines: [
            '“We hebben ze al gecontroleerd. Nog een controle is zonde van de tijd van de planner.”',
            '“Als je één kleine fout vindt, blaas je het op tot een crisis.”',
          ],
          model: '“Het is één uur van de planner tegenover een livegang waar foute data de lijn stillegt. Kloppen de tien, dan is dat goed nieuws voor jullie team en zeg ik dat in de stuurgroep. Zit er een fout in, dan kijken we eerst samen waarom voordat iemand het een crisis noemt.”',
          rubric: [
            'Weegt de kleine moeite af tegen het risico bij livegang',
            'Maakt van een goede uitkomst een winst voor de leverancier',
            'Belooft een rustige, gezamenlijke reactie op een bevinding',
          ],
        },
      },
      sayIt: 'Leg in 60 seconden uit hoe je het werk van een expert controleert als je het zelf niet kunt beoordelen.',
      terms: [
        { term: 'Vertrouwen maar controleren', def: 'Het vakmanschap en de bedoelingen van mensen vertrouwen, en toch de resultaten controleren die echt tellen; een oud Russisch spreekwoord dat Reagan beroemd maakte.' },
        { term: 'Vier-ogenprincipe', def: 'Elk belangrijk stuk werk wordt door een tweede bevoegde persoon gecontroleerd.' },
        { term: 'Risicogestuurd controleren', def: 'Harder controleren waar een fout het meest pijn doet, lichter bij routinezaken.' },
        { term: 'Steekproef', def: 'Een controle van een klein willekeurig deel in plaats van alles.' },
      ],
    },
    {
      id: 'pm.outside.disagree',
      title: 'Als experts het oneens zijn',
      pre: [
        {
          q: 'Twee engineers zijn het oneens of een oude transformator gereviseerd of vervangen moet worden. Jij kunt niet beoordelen wie gelijk heeft. Wat is de beste eerste stap?',
          options: ['Meegaan met de meest senior engineer, want ervaring telt hier het zwaarst', 'Ze vragen het onderling uit te zoeken en dan terug te komen', 'Een derde engineer de doorslag laten geven', 'Eerst de besliscriteria afspreken: kosten, risico, stilstand, levensduur'],
          answer: 'Eerst de besliscriteria afspreken: kosten, risico, stilstand, levensduur',
          why: 'Met afgesproken criteria wordt de ruzie een vergelijking die je kunt volgen, geen strijd om gezag.',
        },
      ],
      teach: [
        'Als twee experts het oneens zijn, kun je de inhoud niet beoordelen, maar wel het besluit structureren. De meeste meningsverschillen tussen experts gaan niet over feiten; ze gaan over andere aannames of andere prioriteiten.\n\nStap één: zet de besliscriteria op tafel vóór de opties. Besliscriteria zijn de dingen waarop de keuze beoordeeld wordt: kosten, risico, tijd, kwaliteit, hoe makkelijk het te onderhouden is.',
        'Scheid dan feit en oordeel. Een feit kun je controleren: “de transformator is 42 jaar oud”. Een oordeel is de inschatting van een expert: “hij gaat waarschijnlijk nog tien jaar mee”. Meningsverschillen zitten meestal in de oordelen.\n\nVraag elke expert: “Wat zou jou van mening doen veranderen?” Dat laat zien waar het meningsverschil echt op rust.',
        'Een gewogen score helpt als er meerdere criteria zijn: geef elk criterium een gewicht, scoor elke optie, vermenigvuldig en tel op. Het is geen toverij, en de gewichten zijn een zakelijke keuze, geen technische, dus stel ze vast met de sponsor.\n\nDe echte waarde: het laat zien waar de opties verschillen, en of de uitkomst verandert als een gewicht een beetje verschuift.',
        'Een second opinion is een onafhankelijke kijk van een expert buiten de discussie. Gebruik hem voor grote keuzes die moeilijk terug te draaien zijn, en geef de tweede expert de vraag en de criteria mee, niet wie wat zei.\n\nNog een nuttige zet: vraag elke expert het standpunt van de ander zo goed te verwoorden dat die ander het ermee eens is. Dat koelt af en laat vaak zien dat ze dichter bij elkaar zitten dan het klonk.',
        'Klassieke fouten: beslissen op senioriteit, op wie het hardst praat, of het verschil delen in een oplossing waar geen van beide experts in gelooft. Een andere: het laten slepen, terwijl het project wacht.\n\nEen scherpe vraag: “Als we de optie van je collega kozen, wat zou er dan precies misgaan, en hoe waarschijnlijk is dat?” Zo worden meningen risico’s die je kunt vergelijken.',
      ],
      example: {
        kind: 'worked',
        text: 'Netproject bij een fabriek. De eigen elektrotechnisch engineer van de fabriek wil de oude transformator houden en reviseren; de installateur wil hem vervangen.\n\nStap 1, criteria met de sponsor: kosten over 10 jaar, risico op ongeplande uitval, stilstand tijdens het werk.\nStap 2, feit versus oordeel: feit, de olietest laat stijgend vocht zien. Oordeel: “hij gaat nog 10 jaar mee” tegenover “hij kan binnen 5 jaar uitvallen”.\nStap 3, wat zou je van mening doen veranderen? De fabrieksengineer: “Een slechtere olietest volgend jaar.” De installateur: “Een schone test.”\nStap 4, een second opinion van een onafhankelijk testbureau op de olieresultaten.\n\nDe second opinion steunt vervangen binnen 3 jaar; de sponsor plant het in de zomerstop van volgend jaar.',
      },
      said: 'Wat je hoort in projecten: “Met alle respect voor mijn collega, maar dat is gewoon fout.” Tijd om naar de criteria te vragen.',
      recall: [
        {
          q: 'Wat zet je als eerste op tafel als experts het oneens zijn?',
          options: ['De opties, zodat iedereen ziet wat er ligt', 'Het budget, want dat begrenst elke optie', 'De besliscriteria', 'Het trackrecord van elke expert'],
          answer: 'De besliscriteria',
          why: 'Afgesproken criteria maken van de ruzie een vergelijking die je kunt volgen.',
        },
        {
          q: 'Waar zitten de meeste meningsverschillen tussen experts?',
          options: ['In oordelen en aannames', 'In feiten die je kunt controleren', 'In wat er in eerdere overleggen gezegd is', 'In de tekst van het contract'],
          answer: 'In oordelen en aannames',
          why: 'Feiten kun je controleren; experts verschillen in wat ze betekenen en wat er gaat gebeuren.',
        },
        {
          q: 'Wie hoort de gewichten in een gewogen score vast te stellen?',
          options: ['De meest senior expert, die weet wat technisch telt', 'De sponsor, want de gewichten zijn een zakelijke keuze', 'De leverancier, die dit soort scores vaker heeft gedaan', 'Wie de spreadsheet bouwt, voor de consistentie'],
          answer: 'De sponsor, want de gewichten zijn een zakelijke keuze',
          why: 'Hoe zwaar kosten tegen risico wegen is een zakelijke prioriteit, geen technisch feit.',
        },
        {
          q: 'Hoe geef je een expert voor een second opinion zijn opdracht?',
          options: ['Zeg naar welke kant jij neigt, dat scheelt tijd', 'Geef alleen de goedkoopste optie, dan blijft het gericht', 'Met de vraag en de criteria, niet wie wat zei', 'Stuur de hele mailwisseling door, zodat hij alle standpunten ziet'],
          answer: 'Met de vraag en de criteria, niet wie wat zei',
          why: 'Een onafhankelijke kijk helpt alleen als hij niet gestuurd is.',
        },
      ],
      situation: {
        scene: 'MES-project. De architect van de leverancier wil een cloudoplossing; de IT-lead van de klant wil de servers op locatie in de fabriek. Het overleg wordt verhit en de sponsor wil over twee weken een besluit.',
        ask: 'Hoe leid je dit naar een besluit?',
        model: 'Ik stop de discussie over opties en vraag de sponsor om de criteria: kosten over vijf jaar, wat er met de productie gebeurt als de internetverbinding uitvalt, beveiliging, en wie het onderhoudt. Dan scoort elke expert beide opties op die criteria en zegt wat hem van mening zou doen veranderen. Blijft het internetrisico het struikelblok, dan haal ik daar een korte second opinion over. De sponsor beslist met één A4.',
        rubric: [
          'Gaat van opties naar criteria, vastgesteld met de sponsor',
          'Laat elke expert redeneren vanuit de criteria',
          'Gebruikt een second opinion op het echte struikelblok en houdt de deadline',
        ],
        pushback: {
          lines: [
            '“Een scoreformulier is gewoon een manier om een politieke keuze aan te kleden.”',
            '“Jij snapt de techniek niet, dus hoe kun jij de scores beoordelen?”',
          ],
          model: '“De scores beoordeel ik niet, dat doen jullie tweeën, en jullie zien elkaars scores. Het formulier beslist niet; het laat zien waar jullie echt verschillen, zodat de sponsor beslist op het echte punt, waarschijnlijk het internetrisico, in plaats van op wie het best argumenteerde. Verandert de uitkomst door de scores, mooi. Zo niet, dan zijn we een uur kwijt.”',
          rubric: [
            'Is duidelijk dat hij de inhoud niet beoordeelt',
            'Laat het doel van het formulier zien: het echte verschil vinden',
            'Houdt het besluit bij de sponsor',
          ],
        },
      },
      sayIt: 'Leg in 60 seconden uit hoe je twee experts die het oneens zijn naar een besluit leidt dat je zelf niet kunt beoordelen.',
      terms: [
        { term: 'Besliscriteria', def: 'De dingen waarop een keuze beoordeeld wordt, zoals kosten, risico, tijd en onderhoudbaarheid.' },
        { term: 'Oordeel', def: 'De inschatting van een expert die je niet zomaar kunt controleren, zoals hoe lang een installatie meegaat.' },
        { term: 'Gewogen score', def: 'Opties scoren op gewogen criteria en optellen; de gewichten zijn een zakelijke keuze.' },
        { term: 'Second opinion', def: 'Een onafhankelijke kijk van een expert buiten de discussie.' },
      ],
    },
    {
      id: 'pm.outside.time',
      title: 'Hun tijd en motivatie',
      pre: [
        {
          q: 'De enige PLC-programmeur op je project werkt ook aan drie andere projecten. Wat is het waarschijnlijke effect?',
          options: ['Veel tijd gaat op aan wisselen, dus elk project krijgt minder dan gepland', 'Weinig effect, want ervaren programmeurs zijn gewend meerdere klussen te combineren', 'Hij werkt sneller, want de druk houdt hem scherp', 'Jouw project krijgt voorrang, omdat het het nieuwste is'],
          answer: 'Veel tijd gaat op aan wisselen, dus elk project krijgt minder dan gepland',
          why: 'Wisselen tussen taken kost tijd om er weer in te komen; verdeeld over vier projecten verdwijnen er veel uren.',
        },
      ],
      teach: [
        'Experts zijn meestal het schaarste middel in een project: weinig mensen kunnen het werk en veel projecten willen ze. Je planning is maar zo echt als hun beschikbaarheid.\n\nContextwisseling (context switching) is wisselen tussen taken of projecten, en tijd verliezen om er weer in te komen. Gerald Weinberg (1992) gaf een vuistregel: op twee projecten verliest iemand ongeveer een vijfde van zijn tijd aan wisselen; op vijf kan het verlies naar driekwart gaan. Een grove richtlijn, geen meting.',
        'Praktische gevolgen: vraag om blokken, niet om percentages. “Dinsdag en donderdag” is beter dan “40%”. Bereid voor zodat hun uren tellen: vragen opgeschreven, data klaar, besluiten op een rij. Haal ze niet naar overleggen waar ze niet nodig zijn; stuur in plaats daarvan een samenvatting van twee regels.\n\nEen timebox, een vast tijdslot voor een taak dat stopt als de tijd om is, helpt: “Twee uur op donderdag om het koppelingsontwerp te besluiten.”',
        'Motivatie. Daniel Pink (Drive, 2009), voortbouwend op de zelfdeterminatietheorie van de psychologen Edward Deci en Richard Ryan, noemt drie drijfveren voor kenniswerk: autonomie, meesterschap en zingeving (purpose).\n\nAutonomie is zeggenschap over hoe je het werk doet. Meesterschap is beter worden in iets wat je belangrijk vindt. Zingeving is zien waar het werk voor is.',
        'Voor jou: geef autonomie over het hoe, en wees stevig over het wat en wanneer. Vertel ze over het probleem, niet alleen de taak: “De operators verliezen hier 20 minuten per dienst aan; jouw koppeling lost dat op.” Noem hun werk bij naam waar de sponsor bij is.\n\nWat motivatie sloopt: prioriteiten veranderen zonder uitleg, overleggen zonder doel, en besluiten waarover ze adviseerden die zonder uitleg anders uitvallen.',
        'Een klassieke fout: de manager van de expert als enige hefboom zien. Zijn manager verdeelt de uren; zijn aandacht moet je verdienen.\n\nEen scherpe vraag aan een expert bij de start: “Wat zou dit project jouw tijd waard maken?” De een wil een interessant probleem, de ander een nette overdracht, weer een ander gewoon niet ’s nachts gebeld worden. Onthoud dan het antwoord.',
      ],
      example: {
        kind: 'faded',
        text: 'Robotcelproject. De enige veiligheidsspecialist van de leverancier zit op vier projecten en mist steeds jouw sessies. Je project heeft de komende 8 weken ongeveer 40 uur van hem nodig. Zijn manager zegt: “Hij zit voor 25% op jouw project.”\n\nDe grove tabel van Weinberg geeft iemand op vier projecten maar ongeveer 10% van zijn tijd per project; de rest gaat op aan wisselen. Ga uit van een werkweek van 40 uur.',
        ask: 'Hoe regel je zijn tijd en zijn aandacht?',
        reveal: 'Op papier is 25% van 8 weken × 40 uur 80 uur. Met de grove 10% van Weinberg is het ongeveer 32 uur, minder dan de 40 die je nodig hebt.\n\nVertaal het percentage naar blokken: vraag zijn manager om één vaste dag van 8 uur per twee weken (4 dagen, 32 uur), plus twee halve dagen voor de veiligheidstest (8 uur), nu ingepland. Samen 40 uur aan geconcentreerde tijd.\n\nBereid elke dag voor: vragen, tekeningen en besluiten klaar, zodat er geen uur verloren gaat. Vraag hem wat het project de moeite waard zou maken, misschien minder late telefoontjes van de bouwplaats. Noem zijn werk daarna bij naam in de stuurgroep.',
      },
      said: 'Wat je hoort in projecten: “Ik zit op vier projecten. Ik kom deze week aan de jouwe toe.” Vertaling: misschien.',
      recall: [
        {
          q: 'Wat is contextwisseling?',
          options: ['Halverwege een project van leverancier wisselen', 'De scope veranderen nadat de planning met de sponsor is afgesproken', 'Overstappen van servers op locatie naar de cloud', 'Wisselen tussen taken en tijd verliezen om er weer in te komen'],
          answer: 'Wisselen tussen taken en tijd verliezen om er weer in te komen',
          why: 'Elke wissel kost tijd om weer op snelheid te komen.',
        },
        {
          q: 'Hoe vraag je om de tijd van een expert?',
          options: ['Als percentage van zijn week', 'In blokken: vaste dagen of halve dagen', 'Alleen als er een probleem speelt', 'Elke week opnieuw via de sponsor, zodat het voorrang krijgt'],
          answer: 'In blokken: vaste dagen of halve dagen',
          why: 'Blokken verminderen het wisselen en zijn makkelijker te beschermen dan een percentage.',
        },
        {
          q: 'Welke drie drijfveren noemt Daniel Pink voor kenniswerk?',
          options: ['Geld, status en zekerheid', 'Regels, beloningen en deadlines', 'Feedback, doelen en bonussen', 'Autonomie, meesterschap en zingeving'],
          answer: 'Autonomie, meesterschap en zingeving',
          why: 'Uit Drive (2009), voortbouwend op de zelfdeterminatietheorie van Deci en Ryan.',
        },
        {
          q: 'Waarin geef je een expert autonomie?',
          options: ['In de scope, zodat hij zich eigenaar voelt', 'In de deadline, zodat hij zijn eigen werk helemaal zelf kan plannen', 'In het hoe, terwijl je stevig bent over het wat en wanneer', 'In alles, want hij is de expert'],
          answer: 'In het hoe, terwijl je stevig bent over het wat en wanneer',
          why: 'De methode is hun vak; het doel en de timing zijn van het project.',
        },
      ],
      situation: {
        scene: 'Project met de netbeheerder. De beveiligingsengineer van de netbeheerder, degene die instelt wanneer de schakelinstallatie bij een storing de stroom afschakelt, heeft jouw klus twee keer lager op haar lijst gezet. Haar manager zegt dat ze overbelast is. Je inschakeldatum hangt af van haar instellingen.',
        ask: 'Wat doe je?',
        model: 'Ik vraag haar direct wat ze nodig heeft om onze klus in één keer te doen, en maak het makkelijk: alle tekeningen en gegevens in één pakket, een vaste halve dag ingepland. Ik vraag haar manager om die halve dag, gekoppeld aan de inschakeldatum. En ik vraag haar wat bij zulke klussen meestal haar tijd verspilt, zodat we dat kunnen vermijden.',
        rubric: [
          'Maakt het haar makkelijk: een compleet pakket en een vast slot',
          'Gebruikt haar manager voor de tijd, niet als stok',
          'Vraagt wat haar helpt, en bouwt zo aan haar motivatie',
        ],
        pushback: {
          lines: [
            '“Iedereens klus is urgent. Waarom zou de jouwe voorgaan?”',
            '“Een halve dag is niet genoeg als je tekeningen weer onvolledig zijn.”',
          ],
          model: '“Terecht, ik vraag niet om voor te gaan, ik vraag om een vast slot zodat je het kunt plannen. En over de tekeningen heb je gelijk: stuur me je checklist, dan zorg ik dat het pakket van de installateur er twee dagen vooraf aan voldoet. Lukt dat niet, dan zeg ik het slot zelf af zodat je het niet verspilt.”',
          rubric: [
            'Claimt geen voorrang boven anderen',
            'Accepteert het punt over de tekeningen en lost het op',
            'Beschermt haar tijd, zelfs ten koste van zichzelf',
          ],
        },
      },
      sayIt: 'Leg in 60 seconden uit hoe je tijd en echte aandacht krijgt van een drukke expert.',
      terms: [
        { term: 'Contextwisseling', def: 'Wisselen tussen taken of projecten en tijd verliezen om er weer in te komen.' },
        { term: 'Timebox', def: 'Een vast tijdslot voor een taak dat stopt als de tijd om is.' },
        { term: 'Autonomie', def: 'Zeggenschap over hoe je je werk doet; een van de drie drijfveren van Pink.' },
        { term: 'Meesterschap', def: 'Beter worden in iets wat je belangrijk vindt; een van de drie drijfveren van Pink.' },
        { term: 'Zingeving', def: 'Zien waar het werk voor is; een van de drie drijfveren van Pink.' },
      ],
    },
    {
      id: 'pm.outside.redflags',
      title: 'Rode vlaggen',
      pre: [
        {
          q: 'Zes weken achter elkaar meldt de developer de koppeling als “90% klaar”. Waar is dit waarschijnlijk een teken van?',
          options: ['Er wordt inspanning gemeld, geen werkend resultaat; het lastige komt nog', 'Het is bijna af; de laatste details vragen gewoon wat geduld', 'De developer steekt te weinig uren in de koppeling', 'De planning was een week te krap, dus volgende week is het waarschijnlijk af'],
          answer: 'Er wordt inspanning gemeld, geen werkend resultaat; het lastige komt nog',
          why: 'Wekenlang “bijna klaar” betekent meestal dat het laatste, moeilijkste deel nog niet is aangepakt.',
        },
      ],
      teach: [
        'Een rode vlag (red flag) is een waarschuwingsteken dat er iets mis is voordat het in de planning zichtbaar wordt. Buiten je vak zie je het technische probleem niet, maar je ziet de signalen ervan wel in hoe mensen praten en rapporteren.\n\nDrie rode vlaggen dekken veel: altijd “bijna klaar”, vage antwoorden, en geen demo.',
        'Altijd “bijna klaar”. De negentig-negentigregel, toegeschreven aan Tom Cargill van Bell Labs en in 1985 bekend gemaakt door Jon Bentley, grapt: de eerste 90 procent van de code kost de eerste 90 procent van de ontwikkeltijd; de resterende 10 procent kost de andere 90 procent.\n\nAls het percentage wekenlang nauwelijks beweegt, vraag dan wat er nog over is, punt voor punt, en welk punt het moeilijkst is.',
        'Vage antwoorden. “We zijn ermee bezig.” “Het zou goed moeten komen.” “Wat kleine issues.” Eén vaag antwoord is normaal; een patroon is een signaal. Vraag om details: “Welke issues, en wat is de volgende stap bij elk?” Wie het in de hand heeft, antwoordt in één zin; wie dat niet heeft, wordt vager.\n\nWatermeloenstatus is een status die van buiten groen is en van binnen rood: gemeld als prima, terwijl het team weet dat het niet zo is.',
        'Geen demo. Een demo is het ding live laten werken, geen slides erover. Als een team dat al maanden bouwt niets werkends kan laten zien, is dat de sterkste rode vlag van de drie.\n\nAndere signalen: één persoon die alles weet en niks deelt, een leverancier die steeds van contactpersoon wisselt, testen die steeds worden uitgesteld, en slecht nieuws dat altijd de dag voor een deadline komt.',
        'Let op: één vlag is een reden om te vragen, geen bewijs van problemen. Experts zijn vaak eerlijk optimistisch, en sommige problemen zijn echt bijna opgelost.\n\nReageer met vragen en bewijs, niet met beschuldigingen. En kijk naar jezelf: als slecht nieuws je laat bereikt, voelen mensen zich misschien niet veilig om het te brengen. Een scherpe vraag: “Waar maak je je zorgen over dat je me nog niet verteld hebt?”',
      ],
      example: {
        kind: 'faded',
        text: 'MES-project, maand 4. Drie weken achter elkaar meldt de leverancier de module voor labelprinten als “bijna klaar, wat kleine issues”. De status is groen. De demo van afgelopen vrijdag is verschoven “omdat de testomgeving plat lag”. De developer die het bouwde, is net naar een andere klant van de leverancier gegaan.',
        ask: 'Hoeveel rode vlaggen zie je, en wat zou je deze week doen?',
        reveal: 'Minstens vier: wekenlang bijna klaar, vage “kleine issues”, een uitgestelde demo, en de sleutelpersoon die vertrekt. De groene status is misschien een watermeloen.\n\nDeze week: vraag de open issues als lijst met bij elk een eigenaar en datum. Vraag de demo op een vaste dag, op elke omgeving die werkt, desnoods een laptop. Vraag wie nu eigenaar is van de module en hoe de overdracht ging. Vertel de sponsor dat het oranje is tot de demo, met de redenen.',
      },
      said: 'Wat je hoort in projecten: “Het is eigenlijk klaar, alleen nog wat kleine dingen.” Vraag om de lijst.',
      recall: [
        {
          q: 'Waar waarschuwt de negentig-negentigregel voor?',
          options: ['Dat ongeveer 90% van de grote projecten over budget gaat', 'Dat de laatste 10% net zo lang kan duren als de eerste 90%', 'Dat 90% van de bugs meestal in 10% van de code zit', 'Dat 90% van de waarde uit de eerste 10% van het werk komt'],
          answer: 'Dat de laatste 10% net zo lang kan duren als de eerste 90%',
          why: 'Toegeschreven aan Tom Cargill, bekend gemaakt door Jon Bentley (1985): “bijna klaar” kan lang duren.',
        },
        {
          q: 'Wat is een watermeloenstatus?',
          options: ['Een project dat rood is maar langzaam groen wordt', 'Een statusrapport dat niemand tot het eind leest', 'Groen gemeld, terwijl het team weet dat het rood is', 'Een project waarvan de vraag met het seizoen meebeweegt'],
          answer: 'Groen gemeld, terwijl het team weet dat het rood is',
          why: 'Van buiten groen, van binnen rood.',
        },
        {
          q: 'Welke van de drie rode vlaggen is na maanden bouwen de sterkste?',
          options: ['Geen demo van iets werkends', 'Wekenlang “bijna klaar” melden', 'Ineens veel meer overleggen', 'Vage antwoorden op directe vragen'],
          answer: 'Geen demo van iets werkends',
          why: 'Werkende resultaten kun je in een live demo niet faken; dat ze na maanden ontbreken zegt veel.',
        },
        {
          q: 'Je ziet één rode vlag. Wat is de juiste reactie?',
          options: ['Het meteen naar de sponsor escaleren, voordat het groeit', 'Alvast naar een andere leverancier zoeken', 'Negeren tot je er drie hebt gezien', 'Gerichte vragen stellen en om bewijs vragen'],
          answer: 'Gerichte vragen stellen en om bewijs vragen',
          why: 'Eén vlag is een reden om te vragen, geen bewijs; vragen en bewijs laten zien of er een probleem is.',
        },
      ],
      situation: {
        scene: 'Robotcelproject. Twee weken voor de acceptatietest blijft de projectleider van de leverancier zeggen “we liggen op koers”, maar hij kan niet zeggen wanneer de cel met echte dozen draait. Het bezoek dat je had gepland is twee keer afgezegd.',
        ask: 'Hoe breng je dit bij hem ter sprake?',
        model: '“Ik wil ‘op koers’ graag geloven, en ik moet het zien. Kunnen we deze week een sessie inplannen waarin de cel echte dozen draait, ook als het langzaam gaat en met storingen? En kun je me de lijst sturen van wat nog openstaat, met eigenaar en datum? Als er problemen zijn, hoor ik het liever nu: dan kunnen we aan de kant van de klant nog dingen verschuiven, over twee weken niet meer.”',
        rubric: [
          'Benoemt de behoefte aan bewijs zonder te beschuldigen',
          'Vraagt om een demo op een vaste datum en een concrete lijst open punten',
          'Maakt het veilig en nuttig om nu slecht nieuws te delen',
        ],
        pushback: {
          lines: [
            '“Een demo nu laat een halve cel zien. Dat geeft een verkeerd beeld.”',
            '“Zeg je nou dat we liegen over op koers liggen?”',
          ],
          model: '“Nee, ik zeg dat ik het nog niet kan zien, en ik rapporteer wat ik zie. Een halve cel die langzaam draait geeft het juiste beeld: dat hij draait. Ik vertel de klant vooraf dat het een demo van werk in uitvoering is. Wil je dat liever niet, stuur me dan vandaag de open lijst, en we plannen de demo voor volgende woensdag.”',
          rubric: [
            'Weerspreekt de beschuldiging rustig en blijft bij bewijs',
            'Brengt een ruwe demo als nuttig',
            'Biedt een alternatief met een vaste datum',
          ],
        },
      },
      sayIt: 'Noem in 60 seconden drie rode vlaggen en zeg bij elk welke vraag je zou stellen.',
      terms: [
        { term: 'Rode vlag', def: 'Een waarschuwingsteken dat er iets mis is voordat het in de planning zichtbaar wordt.' },
        { term: 'Negentig-negentigregel', def: 'De grap dat de eerste 90% van het werk 90% van de tijd kost en de laatste 10% de andere 90% (Cargill, bekend gemaakt door Bentley, 1985).' },
        { term: 'Watermeloenstatus', def: 'Een status die van buiten groen wordt gemeld terwijl hij van binnen rood is.' },
        { term: 'Demo', def: 'Het ding live laten werken, geen slides erover.' },
      ],
    },
    // Onderwerp 4: sturen en besluiten
    {
      id: 'pm.outside.progress',
      title: 'Voortgang meten zonder vakkennis',
      pre: [
        {
          q: 'Welke voortgangsmelding geeft je de meeste grip als je het werk niet kunt beoordelen?',
          options: ['“We zitten op 70% gereed, iets voor op wat we gepland hadden.”', '“Vier van de zes mijlpalen zijn af met testrapport; de vijfde staat voor vrijdag.”', '“Het team heeft hard gewerkt en deze maand extra uren gemaakt.”', '“We hebben 70% van het budget uitgegeven, precies volgens de planning voor deze maand.”'],
          answer: '“Vier van de zes mijlpalen zijn af met testrapport; de vijfde staat voor vrijdag.”',
          why: 'Afgeronde mijlpalen met bewijs zijn controleerbaar; percentages en inspanning niet.',
        },
      ],
      teach: [
        'Buiten je vak kun je niet naar het werk kijken en beoordelen hoe ver het is. Meet voortgang dus aan dingen die af zijn of niet af, met bewijs dat je kunt zien.\n\nEen mijlpaal (milestone) is een punt in het project waarop een duidelijk resultaat er moet zijn: “koppeling getest met echte orders”, “schakelinstallatie onder spanning”. Het is ja of nee, geen percentage.',
        'Percentage gereed, het deel van het werk dat af zou zijn, is buiten je vak de zwakste maat: het is een mening, en het blijft vaak rond de 90% hangen. Uitgegeven budget zegt iets over geld, niet over voortgang.\n\nTel in plaats daarvan afgeronde mijlpalen, en tel een mijlpaal pas als het bewijs er is: een getekend testrapport, een demo, een goedgekeurde tekening.',
        'Acceptatiecriteria zijn de voorwaarden waaraan een resultaat moet voldoen om geaccepteerd te worden, opgeschreven voordat het werk begint. “Het label print in minder dan 3 seconden en alle 12 velden kloppen met de order.” Spreek ze af met expert en gebruiker, dan is “klaar” later geen discussiepunt.\n\nDe definition of done is de gedeelde kwaliteitsnorm waaraan werk moet voldoen om als af te tellen, zoals getest, gedocumenteerd, gereviewd. Hij komt uit de Scrum Guide; de meeste teams houden hem bij als korte checklist, en hij werkt in elk project.',
        'In automatiserings- en elektrotechnische projecten zijn twee formele mijlpalen gangbaar. De fabrieksacceptatietest (FAT, factory acceptance test) is de test van een machine bij de leverancier, voor verzending. De locatieacceptatietest (SAT, site acceptance test) is de test na installatie bij de klant.\n\nEen FAT die geslaagd is met een lijst open punten is gewoon; zorg dat die lijst eigenaren en data heeft voordat je verzendt.',
        'Demo’s zijn je beste voortgangsmeter: regelmatig, kort, met echte data. Een demo om de twee weken laat meer zien dan tien statusrapporten.\n\nEen klassieke fout: mijlpalen zo ver uit elkaar dat er maandenlang niks te controleren valt. Een grove vuistregel die veel projectleiders gebruiken: minstens elke twee tot vier weken een controleerbaar resultaat. Een scherpe vraag: “Wat kun je me over twee weken laten zien?”',
      ],
      example: {
        kind: 'worked',
        text: 'MES-project. De leverancier meldt “70% gereed”. Jij bouwt het voortgangsbeeld opnieuw op.\n\nStap 1: zet met de leverancier de mijlpalen op een rij: 1 ontwerp goedgekeurd, 2 testomgeving draait, 3 stamgegevens geladen, 4 koppeling getest met echte orders, 5 operatorschermen geaccepteerd, 6 generale repetitie van de livegang geslaagd.\nStap 2: bij elk het bewijs: getekend ontwerp, een demo, een datacontrole, een testrapport, akkoord van de gebruikers, een verslag van de repetitie.\nStap 3: tel wat bewijs heeft: alleen 1 en 2. Mijlpaal 3 is “bijna klaar” zonder controle.\nStap 4: meld 2 van de 6 met bewijs, de derde over twee weken.\n\nDie “70%” was bestede inspanning. Twee van de zes kun je bewijzen.',
      },
      said: 'Wat je hoort in projecten: “We zitten op 70%.” De betere vraag: “70% van wat, en wat kun je me laten zien?”',
      recall: [
        {
          q: 'Waarom is percentage gereed buiten je vak een zwakke maat?',
          options: ['Het is te precies voor een schatting', 'Sponsors snappen geen percentages', 'Leveranciers rekenen het allemaal anders uit, dus je kunt niet vergelijken', 'Het is een mening en blijft vaak rond de 90% hangen'],
          answer: 'Het is een mening en blijft vaak rond de 90% hangen',
          why: 'Je kunt het niet controleren, en het laatste deel van het werk duurt meestal het langst.',
        },
        {
          q: 'Wanneer telt een mijlpaal als af?',
          options: ['Als de verantwoordelijke expert zegt dat hij af is', 'Als de geplande datum zonder problemen voorbij is', 'Als het bewijs er is, zoals een getekend testrapport', 'Als het budget dat ervoor stond op is'],
          answer: 'Als het bewijs er is, zoals een getekend testrapport',
          why: 'Bewijs maakt voortgang controleerbaar zonder de inhoud te beoordelen.',
        },
        {
          q: 'Wat is het verschil tussen FAT en SAT?',
          options: ['FAT is bij de leverancier voor verzending; SAT na installatie op locatie', 'FAT test de software; SAT test de hardware en bekabeling', 'FAT is de formele contracttest; SAT een informele check door de operators', 'FAT is optioneel bij standaardmachines; SAT is altijd verplicht'],
          answer: 'FAT is bij de leverancier voor verzending; SAT na installatie op locatie',
          why: 'Fabrieksacceptatietest en locatieacceptatietest.',
        },
        {
          q: 'Een project heeft 8 mijlpalen. Er worden er 5 als af gemeld, maar maar 3 hebben bewijs. Hoeveel meld jij als af?',
          number: 3,
          tolerance: 0.5,
          unit: 'mijlpalen',
          why: 'Alleen mijlpalen met bewijs tellen; de andere 2 zijn beweringen tot ze gecontroleerd zijn.',
        },
      ],
      situation: {
        scene: 'Project met de netbeheerder. De fabrieksdirecteur vraagt je: “Waar staan we? Geef me een percentage.” De installateur zegt 80%. Jij weet dat de kabel ligt, maar de schakelinstallatie is niet geleverd en er is niets getest.',
        ask: 'Wat vertel je de directeur?',
        model: '“Ik geef liever geen percentage, want dat verbergt waar we staan. Van de vijf mijlpalen zijn er twee af met bewijs: de tracévergunning en de kabel gelegd en getest. De levering van de schakelinstallatie is de volgende, over drie weken, en die bepaalt de datum. Daarna komen installatie, testen en inschakelen.”',
        rubric: [
          'Legt kort uit waarom een percentage misleidt',
          'Meldt mijlpalen met bewijs',
          'Wijst op de volgende mijlpaal die de datum bepaalt',
        ],
        pushback: {
          lines: [
            '“Ik heb geen tijd voor mijlpalen. Ik wil gewoon weten of we oktober halen.”',
            '“De installateur zegt 80%. Waarom zou ik jouw 40 geloven?”',
          ],
          model: '“Kort antwoord: oktober kan, en het hangt van één ding af, dat de schakelinstallatie over drie weken binnen is. Ik bevestig de leverdatum deze week bij de fabrikant en vrijdag hoor je het. De 80% van de installateur is zijn inspanning; mijn twee van de vijf is wat getest is. Allebei waar, maar alleen het tweede zegt iets over oktober.”',
          rubric: [
            'Geeft een direct antwoord op de echte vraag',
            'Noemt het ene ding dat het bepaalt en een datum om het te bevestigen',
            'Legt de twee getallen uit zonder de installateur aan te vallen',
          ],
        },
      },
      sayIt: 'Leg in 60 seconden uit waarom mijlpalen met bewijs beter zijn dan een percentage, met een voorbeeld.',
      terms: [
        { term: 'Mijlpaal', def: 'Een punt in het project waarop een duidelijk resultaat er moet zijn; ja of nee, geen percentage.' },
        { term: 'Percentage gereed', def: 'Het deel van het werk dat af zou zijn; een mening die vaak rond de 90% blijft hangen.' },
        { term: 'Acceptatiecriteria', def: 'Voorwaarden waaraan een resultaat moet voldoen om geaccepteerd te worden, opgeschreven voordat het werk begint.' },
        { term: 'Definition of done', def: 'Een gedeelde kwaliteitsnorm, meestal als korte checklist, waaraan werk moet voldoen om als af te tellen; uit de Scrum Guide.' },
        { term: 'Fabrieksacceptatietest', def: 'FAT: een machine testen bij de leverancier, voor verzending; de locatieacceptatietest (SAT) volgt bij de klant.' },
      ],
    },
    {
      id: 'pm.outside.decide',
      title: 'Besluiten onder onzekerheid, en escaleren',
      pre: [
        {
          q: 'Het team is het oneens of de datamigratie deze week moet starten of over twee weken, na meer testresultaten. De migratie kan zo nodig opnieuw gedraaid worden. Wat voor besluit is dit?',
          options: ['Een onomkeerbaar besluit; wacht tot alle testresultaten er zijn', 'Een omkeerbaar besluit; beslis vrij snel met wat je hebt', 'Een technisch besluit; laat het aan de migratiespecialist', 'Een strategisch besluit; leg het voor aan de directie'],
          answer: 'Een omkeerbaar besluit; beslis vrij snel met wat je hebt',
          why: 'Als een besluit goedkoop terug te draaien is, kost wachten op zekerheid meestal meer dan er een beetje naast zitten.',
        },
      ],
      teach: [
        'Buiten je vak heb je zelden zekerheid. De kunst is goed beslissen met wat je hebt, en weten wanneer het niet jouw besluit is.\n\nVraag eerst: is het een omkeerbaar besluit, een besluit dat je goedkoop terug kunt draaien, of niet? Jeff Bezos (aandeelhoudersbrief over 2015, verschenen in 2016) noemde onomkeerbare besluiten eenrichtingsdeuren (one-way doors): eenmaal erdoor kun je niet terug. Omkeerbare zijn tweerichtingsdeuren.',
        'Bij tweerichtingsdeuren: beslis vrij snel en leer. In zijn brief over 2016 stelde hij dat de meeste besluiten genomen kunnen worden met ongeveer 70% van de informatie die je zou willen; wacht je op 90%, dan ben je meestal te laat. Een vuistregel, geen wet.\n\nBij eenrichtingsdeuren, zoals een schakelinstallatie met een lange levertijd (de tijd van bestelling tot levering) bestellen of het oude systeem uitzetten, vertraag je: meer bewijs, een second opinion, de sponsor die beslist.',
        'Escalatie is een besluit of probleem voorleggen aan iemand met meer bevoegdheid omdat het buiten de jouwe valt. Het is geen falen; het is het systeem dat werkt. Escaleer als het buiten je mandaat valt, als experts vastzitten, of als het doel, het budget of de datum in gevaar is.\n\nEscaleer vroeg, met opties, niet alleen met een probleem: “Hier zijn twee opties, wat elk kost, en mijn advies.”',
        'Een beslisnotitie maakt dit concreet: één A4 met de vraag, de opties, de criteria, het advies van de experts, jouw aanbeveling en de deadline. Hij dwingt je het technische deel te vertalen naar gevolgen.\n\nBreng het besluit daarna helder en zonder excuus. De 7 Rules of Power van Jeffrey Pfeffer gelden hier: kom krachtig over (show up in powerful fashion), zeg het rustig en stevig, en ondergraaf het niet met “sorry, misschien”.',
        'Klassieke fouten: te laat escaleren, als er geen opties meer zijn; escaleren zonder advies, zodat de sponsor jouw denkwerk moet doen; en besluiten elke week weer openbreken.\n\nEen scherpe vraag bij elk vastgelopen besluit: “Als we dit niet terug kunnen draaien, wie moet het dan beslissen, en wanneer? Als het wel kan, wat kost het om nog een week te wachten?”',
      ],
      example: {
        kind: 'worked',
        text: 'Netproject. De schakelinstallatie heeft een levertijd van 26 weken. De definitieve belastingcijfers van de fabriek zijn pas over 4 weken bekend. Wacht je, dan schuift het inschakelen ongeveer een maand op.\n\nStap 1, soort deur: bestellen is een eenrichtingsdeur; annuleren kost veel.\nStap 2, vraag de expert: “Zouden de definitieve belastingcijfers de schakelinstallatie veranderen?” Netengineer: “Alleen als de belasting meer dan 30% stijgt.”\nStap 3, vraag de fabriek: “Hoe waarschijnlijk is dat?” “Heel onwaarschijnlijk.”\nStap 4, beslisnotitie aan de sponsor: nu bestellen op de huidige dimensionering, risico benoemd; of 4 weken wachten en een maand schuiven. Advies: nu bestellen.\nStap 5, de sponsor beslist; jij legt het vast en kondigt het helder aan.',
      },
      said: 'Wat je hoort in projecten: “Laten we wachten tot we meer weten.” Soms verstandig. Vaak duur.',
      recall: [
        {
          q: 'Wat is een eenrichtingsdeurbesluit?',
          options: ['Een besluit dat maar één persoon mag nemen', 'Een besluit dat in één en hetzelfde overleg genomen moet worden', 'Een onomkeerbaar besluit, moeilijk of duur om terug te draaien', 'Een ja-of-neebesluit zonder tussenweg'],
          answer: 'Een onomkeerbaar besluit, moeilijk of duur om terug te draaien',
          why: 'De term van Bezos: eenmaal erdoor kun je niet terug, dus wees zorgvuldiger.',
        },
        {
          q: 'Hoeveel van de informatie die je zou willen, is volgens Bezos ongeveer genoeg voor de meeste besluiten?',
          options: ['Ongeveer 50%', 'Ongeveer 100%', 'Ongeveer 70%', 'Ongeveer 30%'],
          answer: 'Ongeveer 70%',
          why: 'Uit zijn aandeelhoudersbrief over 2016 (verschenen in 2017): wacht je op 90%, dan ben je meestal te laat. Bij een eenrichtingsdeur vertraag je toch.',
        },
        {
          q: 'Hoe escaleer je?',
          options: ['Laat, als je zeker weet dat er echt een probleem is', 'Alleen met de expert erbij om het uit te leggen', 'Per mail aan alle betrokkenen, zodat niemand verrast is', 'Vroeg, met opties en een advies'],
          answer: 'Vroeg, met opties en een advies',
          why: 'Vroeg houdt opties open; een advies spaart de denktijd van de sponsor.',
        },
        {
          q: 'Welk advies over het brengen van een besluit past bij de 7 Rules of Power van Pfeffer?',
          options: ['Begin met een excuus zodat mensen zich niet overruled voelen', 'Zeg het rustig en stevig, zonder het te ondergraven', 'Houd het vaag zodat je nog kunt bijsturen', 'Laat de expert het aankondigen'],
          answer: 'Zeg het rustig en stevig, zonder het te ondergraven',
          why: 'Krachtig overkomen: voorbehouden en excuses verzwakken een besluit dat goed genomen is.',
        },
      ],
      situation: {
        scene: 'MES-project. Twee weken voor livegang vindt het testteam dat één rapport voor de kwaliteitsafdeling niet werkt. De leverancier zegt dat het in drie weken te repareren is. Live op de geplande datum zonder het rapport, of drie weken uitstellen? Het besluit valt buiten jouw mandaat.',
        ask: 'Hoe breng je dit bij de sponsor, en wat zeg je als ze besloten heeft?',
        model: 'Vandaag een notitie van één A4: het probleem in gewone woorden, de twee opties met kosten, risico en wat de kwaliteitsafdeling mist, de mening van de kwaliteitsmanager, en mijn advies: live gaan, met drie weken een handmatige noodoplossing (workaround). Na haar besluit kondig ik het helder aan bij het team: “We gaan live op de 14e. Het kwaliteitsrapport volgt op de 4e; tot dan gebruikt kwaliteit de handmatige controle. Vragen naar mij.”',
        rubric: [
          'Escaleert snel met opties, gevolgen en een advies',
          'Neemt de mening van de betrokken afdeling mee',
          'Kondigt het besluit helder aan, zonder excuus of voorbehoud',
        ],
        pushback: {
          lines: [
            '“Waarom kom je hiermee bij mij? Kun je het niet gewoon met de leverancier beslissen?”',
            '“De kwaliteitsmanager wordt woedend. Moet je de boodschap niet verzachten?”',
          ],
          model: '“Het raakt de livegangdatum en de kwaliteitsafdeling, dus het valt buiten wat ik mag beslissen; mijn advies ligt er, en het kost je twee minuten. Over de boodschap: ik praat eerst persoonlijk met de kwaliteitsmanager en leg de noodoplossing uit. Dan blijft de aankondiging helder. Verzachten zou mensen alleen laten denken dat het nog kan veranderen.”',
          rubric: [
            'Legt uit waarom het het besluit van de sponsor is en maakt het makkelijk',
            'Gaat eerst persoonlijk naar de betrokkene',
            'Houdt de aankondiging helder en stevig',
          ],
        },
      },
      sayIt: 'Leg in 60 seconden het verschil uit tussen eenrichtings- en tweerichtingsdeuren, en wanneer je escaleert.',
      terms: [
        { term: 'Omkeerbaar besluit', def: 'Een besluit dat je goedkoop terug kunt draaien; beslis vrij snel en leer.' },
        { term: 'Eenrichtingsdeur', def: 'Een onomkeerbaar besluit, moeilijk of duur om terug te draaien (Bezos, aandeelhoudersbrief over 2015); vertraag en verzamel meer bewijs.' },
        { term: 'Escalatie', def: 'Een besluit of probleem voorleggen aan iemand met meer bevoegdheid omdat het buiten de jouwe valt; het best vroeg en met opties.' },
        { term: 'Beslisnotitie', def: 'Eén A4 met de vraag, opties, criteria, het advies van de experts, een aanbeveling en de deadline.' },
        { term: 'Levertijd', def: 'De tijd van bestelling tot levering.' },
      ],
    },
    {
      id: 'pm.outside.stakeholders',
      title: 'Communiceren met stakeholders',
      pre: [
        {
          q: 'Je moet de fabrieksdirecteur vertellen dat het inschakelen vier weken opschuift. Hoe begin je?',
          options: ['Met de technische achtergrond, zodat hij precies snapt waarom het uitloopt', 'Met hoe de vertraging ontstond en wiens deel het veroorzaakte', 'Met een excuus, zodat hij ziet dat je het serieus neemt', 'Met de conclusie: de nieuwe datum, wat het voor hem betekent, je plan'],
          answer: 'Met de conclusie: de nieuwe datum, wat het voor hem betekent, je plan',
          why: 'Senior mensen willen eerst de kern; de achtergrond komt als ze erom vragen.',
        },
      ],
      teach: [
        'Een stakeholder is iedereen die het project beïnvloedt of erdoor geraakt wordt: de sponsor, de fabrieksdirecteur, de operators, de netbeheerder, de leverancier. Buiten je vak ben jij vaak de enige die met allemaal praat, dus jij bent de vertaler.\n\nElke groep heeft dezelfde feiten nodig in zijn eigen taal: de directeur in geld en data, operators in wat er op hun dienst verandert, experts in technische termen.',
        'Het piramideprincipe, van Barbara Minto (The Pyramid Principle, 1987, geschreven vanuit haar werk bij McKinsey), zegt: begin met de conclusie, dan de belangrijkste redenen, dan het detail. Senior mensen lezen de eerste twee regels en beslissen of ze verder lezen.\n\nBij een besluit of slecht nieuws: wat er gebeurd is, wat het voor hen betekent, wat we doen, wat we van hen nodig hebben. Vier zinnen, dan stoppen.',
        'Hoe je het zegt doet net zoveel als wat. De 7 Rules of Power van Jeffrey Pfeffer (2022) stellen dat mensen competentie deels afleiden uit hoe zeker je overkomt. Voor jou betekent dat: kondig een besluit helder aan, sta rechtop, leg niet te veel uit, en bied geen excuses aan voor een besluit dat goed genomen is.\n\nHet betekent niet doen alsof: zekerheid gaat over hoe je spreekt, eerlijkheid over wat je zegt.',
        'Gebruik een voorbehoud (hedge), een formulering die laat zien hoe zeker je bent, bewust. “We verwachten” tegenover “we gaan” is nuttige precisie. Elke zin indekken (“misschien”, “ik denk”, “een beetje”) laat je onzeker klinken, zelfs over wat je wel weet.\n\nRegel: maak een voorbehoud bij de voorspelling, niet bij de feiten. “De kabel ligt en is getest. We verwachten in week 42 in te schakelen.”',
        'Klassieke fouten: de mail van de expert doorsturen met “zie hieronder”; de directeur het hele technische verhaal geven; operators als laatste inlichten. Een andere: goed nieuws aan iedereen, slecht nieuws alleen als erom gevraagd wordt.\n\nEen scherpe check voordat je iets verstuurt: “Als hij alleen de eerste twee regels leest, weet hij dan wat hij moet weten en wat ik van hem nodig heb?”',
      ],
      example: {
        kind: 'faded',
        text: 'Robotcelproject. De FAT bij de leverancier liet zien dat de cel 10 dozen per minuut haalt, niet de 12 uit het contract. De leverancier zegt dat een andere grijper (gripper) het in drie weken oplost, waardoor de verzending uitloopt. Je moet de fabrieksdirecteur, de lijnoperators en de sponsor van de klant inlichten.\n\nEen concept aan de directeur begint: “Vorige week waren we bij de fabrieksacceptatietest, waar onder verschillende omstandigheden diverse metingen zijn gedaan…”',
        ask: 'Hoe zou je de opening voor de directeur herschrijven, en wat vertel je de operators?',
        reveal: 'Directeur, conclusie eerst: “De robotcel wordt drie weken later verzonden, op 12 mei, omdat hij bij de test 10 van de 12 dozen per minuut haalde. De leverancier past de grijper op eigen kosten aan. Lijn 3 stapelt tot dan handmatig door. Ik heb niets van je nodig; op 20 april bevestig ik de nieuwe datum.”\n\nOperators, bij de dienststart, in hun termen: “De robot komt drie weken later. Tot dan verandert er voor jullie niks; de training schuift naar de week van 12 mei.”',
      },
      said: 'Wat je hoort in projecten: “Kun je me gewoon vertellen wat het voor mij betekent?”',
      recall: [
        {
          q: 'Wat zegt het piramideprincipe?',
          options: ['Begin met de achtergrond en bouw op naar de conclusie', 'Vertel senior mensen het pas als laatste, als al het detail rond is', 'Eerst de conclusie, dan de belangrijkste redenen, dan het detail', 'Gebruik hooguit drie slides, één idee per slide'],
          answer: 'Eerst de conclusie, dan de belangrijkste redenen, dan het detail',
          why: 'Barbara Minto: senior lezers beslissen op de eerste regels of ze verder lezen.',
        },
        {
          q: 'Wat suggereren de 7 Rules of Power van Pfeffer over het aankondigen van een besluit?',
          options: ['Kondig het helder en zeker aan, zonder te veel uitleg', 'Bied eerst excuses aan, om mensen mee te houden', 'Laat de expert het aankondigen, dan heeft het meer gezag', 'Wacht met aankondigen tot iedereen het eens is'],
          answer: 'Kondig het helder en zeker aan, zonder te veel uitleg',
          why: 'Mensen leiden competentie deels af uit hoe zeker je overkomt.',
        },
        {
          q: 'Waarbij maak je een voorbehoud?',
          options: ['Bij de feiten, niet bij de voorspelling', 'Bij de voorspelling, niet bij de feiten', 'Bij alles, voor de zekerheid', 'Nergens, nooit'],
          answer: 'Bij de voorspelling, niet bij de feiten',
          why: '“De kabel is getest” is een feit; “we verwachten week 42” is een voorspelling met eerlijke onzekerheid.',
        },
        {
          q: 'Wat is een klassieke communicatiefout buiten je vak?',
          options: ['Elk bericht openen met de conclusie', 'Operators vertellen wat er op hun dienst verandert', 'De mail van de expert doorsturen met “zie hieronder”', 'Afsluiten met wat je van de lezer nodig hebt'],
          answer: 'De mail van de expert doorsturen met “zie hieronder”',
          why: 'Dan leg je het vertaalwerk bij mensen die het niet kunnen doen.',
        },
      ],
      situation: {
        scene: 'MES-project. De sponsor heeft besloten live te gaan zonder één kwaliteitsrapport, met drie weken een handmatige noodoplossing. Je moet het de kwaliteitsmanager vertellen, die ertegen was, en de planners, die vanaf maandag met het systeem werken.',
        ask: 'Wat zeg je tegen elk?',
        model: 'Kwaliteitsmanager, persoonlijk en als eerste: “De sponsor heeft besloten op de 14e live te gaan zonder jouw rapport; dat volgt op de 4e. Ik weet dat je ertegen was, en jouw punt staat in de beslisnotitie. Tot dan dekt de handmatige controle het af. Wat heb je van mij nodig om dat te laten werken?” Planners, kort: “Livegang is maandag zoals gepland. Eén rapport komt later; het raakt jullie schermen niet.”',
        rubric: [
          'Vertelt de meest betrokkene het eerst en persoonlijk',
          'Brengt het besluit helder, erkent haar standpunt, biedt hulp',
          'Geeft elke groep alleen wat voor hen telt',
        ],
        pushback: {
          lines: [
            '“Dus mijn zorgen zijn gewoon genegeerd. Waarom heb ik ze dan nog ingebracht?”',
            '“Als er in die drie weken iets misgaat, ligt het bij jou, niet bij mij.”',
          ],
          model: '“Ze zijn niet genegeerd: ze staan in de notitie, en de sponsor heeft ze gelezen. Ze heeft ze afgewogen tegen de kosten van drie weken uitstel en besloten. Ik snap dat je er niet blij mee bent. Als er iets misgaat, staat het besluit bij de sponsor op papier, niet bij jou. Laten we de handmatige controle zo stevig mogelijk maken.”',
          rubric: [
            'Laat concreet zien dat haar standpunt gehoord is',
            'Blijft stevig bij het besluit zonder het opnieuw te bediscussiëren',
            'Neemt haar angst voor schuld weg en gaat naar actie',
          ],
        },
      },
      sayIt: 'Vertel een directeur in 60 seconden slecht nieuws uit je project, conclusie eerst.',
      terms: [
        { term: 'Stakeholder', def: 'Iedereen die het project beïnvloedt of erdoor geraakt wordt.' },
        { term: 'Piramideprincipe', def: 'Begin met de conclusie, dan de belangrijkste redenen, dan het detail (Barbara Minto).' },
        { term: '7 Rules of Power', def: 'Het boek van Jeffrey Pfeffer (2022) over macht krijgen en gebruiken op het werk, onder meer door krachtig over te komen.' },
        { term: 'Voorbehoud', def: 'Een formulering die laat zien hoe zeker je bent, zoals “we verwachten”; gebruik het bij voorspellingen, niet bij feiten.' },
      ],
    },
    {
      id: 'pm.outside.learnfast',
      title: 'Snel een nieuw vak leren',
      pre: [
        {
          q: 'Volgende maand begin je aan een project in een vak dat je niet kent: netaansluitingen. Wat is de nuttigste eerste stap?',
          options: ['De tien woorden vinden die steeds terugkomen, en leren waarom ze tellen', 'Een studieboek over elektriciteitsnetten van voor tot achter lezen voor je begint', 'Wachten op de kick-off, waar de experts de basis uitleggen', 'Eerst een online cursus elektrotechniek volgen'],
          answer: 'De tien woorden vinden die steeds terugkomen, en leren waarom ze tellen',
          why: 'Met een kleine kernwoordenschat volg je de overleggen snel; diepgang kan later.',
        },
      ],
      teach: [
        'Je hoeft geen expert te worden, maar je moet snel genoeg leren om te volgen, goede vragen te stellen en onzin te herkennen. Michael Watkins (The First 90 Days, 2003) stelt dat nieuwe leiders hun leren bewust moeten plannen in plaats van het toevallig op te pikken.\n\nEen gangbare manier is een 30-60-90-plan: wat je in je eerste 30, 60 en 90 dagen gaat leren en doen.',
        'Eerste 30 dagen: leren. Bouw je vakwoordenschat op, de tien woorden die steeds terugkomen in de overleggen: voor een netproject bijvoorbeeld transportcapaciteit, netcongestie, middenspanning, schakelinstallatie, beveiliging, transformator, kabeltracé, inschakelen, onderbreking, belasting. Bij elk: wat het is, en waarom het belangrijk is voor het project.\n\nHoud een begrippenlijst (glossary) bij: je eigen lijst termen met een betekenis in één regel en een voorbeeld.',
        'Dag 31–60: het systeem snappen. Teken een mentaal model, een simpel beeld in je hoofd en op papier van hoe de delen samenhangen: waar de stroom vandaan komt, waardoor, naar welke machines. Vraag een expert je tekening te verbeteren; foute tekeningen leren snel.\n\nMeelopen (shadowing) is tijd doorbrengen naast een expert terwijl hij werkt: een dag met de installateur, een uur met de planner. Je leert wat voor hen telt, en zij leren jou kennen.',
        'Dag 61–90: bijdragen. Nu moet je het project in gewone woorden aan een buitenstaander kunnen uitleggen, de drie grootste technische risico’s kunnen noemen en waarom, en vragen stellen waar experts iets aan hebben.\n\nTest jezelf: leg het systeem in vijf minuten uit aan iemand buiten het project. Waar je hapert, is wat je hierna leert.',
        'Klassieke fouten: wekenlang theorie lezen zonder met iemand te praten; alles willen leren in plaats van wat het project nodig heeft; of stoppen op dag 30 omdat de woorden nu bekend klinken.\n\nExperts twisten over diepgang: sommigen zeggen dat je de hele tijd 10% van je tijd aan de inhoud besteedt; anderen zeggen dat je het vooraan moet doen. Hoe dan ook, een scherpe vraag aan elke expert in je eerste maand: “Wat doen nieuwe mensen hier altijd fout?”',
      ],
      example: {
        kind: 'faded',
        text: 'Over zes weken leid je de klantkant van een MES-project bij een maker van metalen onderdelen. Je kent Lean en de werkvloer, geen IT.\n\nIn week 1 verzamel je de woorden uit de aanbesteding en het voorstel van de leverancier: MES, ERP, koppeling, stamgegevens, routing, werkorder, integratie, testomgeving, cutover (de overstap van het oude naar het nieuwe systeem), hypercare (extra ondersteuning in de eerste weken na livegang).',
        ask: 'Hoe zou je je eerste 90 dagen plannen?',
        reveal: 'Dag 1–30: een begrippenlijst van die tien woorden met hulp van de IT-lead; vraag bij elk “waarom is dit belangrijk voor ons?” Zit een dag naast een planner om de werkorders te zien.\n\nDag 31–60: teken het systeem: het ERP stuurt werkorders via de koppeling naar het MES, het MES volgt ze op de machines en stuurt terug wat er gemaakt is. Laat de architect het verbeteren.\n\nDag 61–90: leg het project in vijf minuten uit aan de plantmanager; noem de drie grootste risico’s, zoals stamgegevens, de koppeling en het cutoverweekend.',
      },
      said: 'Wat je hoort in projecten: “Dat pik je onderweg wel op.” Sneller als je het plant.',
      recall: [
        {
          q: 'Dag 45 van je 30-60-90-plan voor een netproject. Welke activiteit past het best bij die fase?',
          options: ['Je lijst van de tien kernwoorden opbouwen', 'Het contract en de aanbesteding voor het eerst lezen', 'De drie grootste technische risico’s met onderbouwing aan de directie presenteren', 'Tekenen hoe het systeem samenhangt en het door een expert laten verbeteren'],
          answer: 'Tekenen hoe het systeem samenhangt en het door een expert laten verbeteren',
          why: 'Dag 31–60 is voor het systeem snappen: een mentaal model, verbeterd door een expert. Eerst de woorden (dag 1–30); bijdragen komt als laatste (dag 61–90).',
        },
        {
          q: 'Wat hoort er in een regel van je begrippenlijst?',
          options: ['Alleen de term, zodat de lijst kort blijft', 'De term, een betekenis in één regel en een voorbeeld', 'De volledige definitie uit de technische norm', 'De term en de naam van de expert die hem gebruikt'],
          answer: 'De term, een betekenis in één regel en een voorbeeld',
          why: 'Kort genoeg om bij te houden, concreet genoeg om te onthouden.',
        },
        {
          q: 'Waarom vraag je een expert je tekening van het systeem te verbeteren?',
          options: ['Om de expert te laten zien dat je je huiswerk deed', 'Om de tekening als officieel projectdocument te laten aftekenen', 'Omdat experts graag over hun vak vertellen', 'Omdat zijn verbeteringen laten zien wat je verkeerd begreep'],
          answer: 'Omdat zijn verbeteringen laten zien wat je verkeerd begreep',
          why: 'Een tekening verbeteren is snel voor hen en heel leerzaam voor jou.',
        },
        {
          q: 'Wat is een klassieke fout bij het leren van een nieuw vak?',
          options: ['Experts in de eerste week basisvragen stellen', 'Het systeem tekenen voordat je het helemaal snapt', 'Wekenlang theorie lezen voordat je met iemand praat', 'Een begrippenlijst bijhouden die nog niet af is'],
          answer: 'Wekenlang theorie lezen voordat je met iemand praat',
          why: 'Wat belangrijk is voor het project, leer je van de mensen erin.',
        },
      ],
      situation: {
        scene: 'Je manager vertelt je vrijdag dat je maandag als projectleider aan klantzijde instapt in het project van een automatiseringsleverancier voor een robotcel. Je hebt nooit met robots gewerkt. Het eerste voortgangsoverleg is woensdag.',
        ask: 'Wat doe je tussen vrijdag en woensdag?',
        model: 'In het weekend lees ik het voorstel en het contract en maak ik een lijst van de woorden die ik niet ken, waarschijnlijk PLC, safety-PLC, grijper, cyclustijd, FAT, SAT, risicobeoordeling. Maandag vraag ik de engineer van de klant een uur om die tien woorden uit te leggen en de cel te tekenen. Dinsdag een uur aan de lijn. Woensdag ga ik erin met de vragenset van vijf gebieden en zeg ik dat ik nieuw ben met robots en basisvragen ga stellen.',
        rubric: [
          'Bouwt een korte woordenlijst op uit de projectdocumenten',
          'Gebruikt een expert en de echte lijn om snel te leren',
          'Gaat het eerste overleg in met een vragenset en is eerlijk dat hij nieuw is',
        ],
        pushback: {
          lines: [
            '“De leverancier vreet je op als je zegt dat je nieuw bent met robots.”',
            '“Kun je de eerste overleggen niet beter door de engineer laten leiden?”',
          ],
          model: '“Ze merken het toch binnen tien minuten; als ik het zelf eerst zeg, zet ik de toon en klinken mijn vragen bewust. En de engineer leidt het technische deel, maar het doel, de planning en de besluiten zijn vanaf dag één van mij. Geef ik die nu weg, dan krijg ik ze moeilijk terug.”',
          rubric: [
            'Legt uit waarom openheid sterker is dan het verbergen',
            'Geeft de engineer de technische leiding',
            'Houdt doel, planning en besluiten vanaf de start',
          ],
        },
      },
      sayIt: 'Zet in 60 seconden je 30-60-90-plan uiteen voor een vak dat je nog niet kent.',
      terms: [
        { term: '30-60-90-plan', def: 'Een plan voor wat je in je eerste 30, 60 en 90 dagen gaat leren en doen.' },
        { term: 'Vakwoordenschat', def: 'De kernwoorden van een vak die in het project steeds terugkomen; om te beginnen een stuk of tien.' },
        { term: 'Begrippenlijst', def: 'Je eigen lijst termen, elk met een betekenis in één regel en een voorbeeld.' },
        { term: 'Mentaal model', def: 'Een simpel beeld van hoe de delen van een systeem samenhangen.' },
        { term: 'Meelopen', def: 'Tijd doorbrengen naast een expert terwijl hij werkt, om te leren wat voor hem telt.' },
      ],
    },
  ],
};

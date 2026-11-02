// eng.transformers (NL): Transformatoren en kabels: hoe een transformator werkt en veroudert, MS- en LS-kabels, kabelstoringen, het aansluitproces, standaardisatie.
export default {
  lessons: [
    {
      id: 'eng.transformers.principle',
      title: 'Hoe een transformator werkt',
      pre: [
        {
          q: 'Een distributietransformator van 630 kVA zet 10 kV om naar 400 V. Hoeveel stroom loopt er ongeveer aan de 400 V-kant bij vollast?',
          options: ['Zo’n 63 A', 'Zo’n 36 A', 'Zo’n 1.575 A', 'Zo’n 900 A'],
          answer: 'Zo’n 900 A',
          why: '630.000 / (1,73 × 400) ≈ 909 A. Aan de 10 kV-kant is het maar zo’n 36 A.',
        },
      ],
      teach: [
        'Een transformator heeft twee koperen wikkelingen om een ijzeren kern. Wisselstroom in de eerste wikkeling maakt een wisselend magnetisch veld in de kern, en dat wekt een spanning op in de tweede. De spanningsverhouding is gelijk aan de wikkelverhouding: een 10 kV/400 V-transformator heeft aan de MS-kant 25 keer zoveel windingen. Het vermogen blijft (bijna) gelijk, dus aan de LS-kant gaat de stroom met dezelfde factor omhoog.',
        'Transformatoren hebben een vermogen in kVA (of MVA voor grote). Een netstation heeft meestal 250, 400 of 630 kVA; een transformator in een onderstation van 150 naar 10 of 20 kV vaak tientallen MVA. Stroom = vermogen / (1,73 × spanning) bij driefasig: 630 kVA op 400 V is zo’n 909 A, op 10 kV zo’n 36 A.',
        'De verliezen zijn klein maar constant. Nullastverliezen in de ijzeren kern zijn er zodra de transformator onder spanning staat, dag en nacht. Belastingverliezen in het koper groeien met het kwadraat van de belasting: bij halve last een kwart. Het rendement is meer dan 98%, maar over duizenden netstations tellen de verliezen op. Daarom moeten nieuwe transformatoren aan strenge Europese verlieseisen voldoen.',
        'De meeste distributietransformatoren zijn met olie gevuld en gekoeld volgens ONAN: oil natural, air natural. Warme olie stijgt op, koelt af in de koelribben en zakt weer, zonder pompen of ventilatoren. Een aftakschakelaar past de verhouding in kleine stappen aan, meestal 2,5%. Bij netstationtransformatoren kan dat alleen spanningsloos; transformatoren in onderstations hebben een regelschakelaar die de MS-spanning onder belasting automatisch regelt.',
      ],
      example: {
        kind: 'worked',
        text: 'Een netstation van 400 kVA in een straat vol zonnepanelen. Op zonnige dagen loopt de spanning aan het eind van de LS-kabels op tot 252 V en vallen omvormers uit. De aftakschakelaar van de transformator staat in de middenstand. De netbeheerder zet hem één stap, 2,5%, lager: de LS-spanning daalt zo’n 6 V, naar rond de 246 V aan het eind van de kabels. Daarvoor moet de transformator een paar minuten spanningsloos, dus alle klanten op het station krijgen een geplande korte onderbreking en vooraf een brief.',
      },
      said: 'Wat engineers zeggen: “Zet die trafo één aftakking lager. Met al die panelen zit hij ’s zomers te hoog.”',
      recall: [
        {
          q: 'Een transformator van 400 kVA op 400 V. Wat is de stroom bij vollast aan de LS-kant, in ampère?',
          number: 577,
          tolerance: 10,
          unit: 'A',
          why: '400.000 / (1,73 × 400) ≈ 577 A.',
        },
        {
          q: 'Een transformator zet 20 kV om naar 400 V. Wat is de wikkelverhouding?',
          number: 50,
          tolerance: 0.5,
          unit: '',
          why: '20.000 / 400 = 50: de MS-wikkeling heeft 50 keer zoveel windingen.',
        },
        {
          q: 'Wat betekent ONAN?',
          options: ['Olie gepompt, lucht met ventilatoren', 'Oil natural, air natural: koeling zonder pompen of ventilatoren', 'Alleen nullast, lucht nodig', 'Een type aftakschakelaar'],
          answer: 'Oil natural, air natural: koeling zonder pompen of ventilatoren',
          why: 'Warme olie stijgt vanzelf op en koelt af in de koelribben.',
        },
        {
          q: 'Een transformator draait op halve last. Hoe verhouden zijn belastingverliezen zich tot vollast?',
          options: ['Gelijk', 'De helft', 'Een kwart', 'Het dubbele'],
          answer: 'Een kwart',
          why: 'Belastingverliezen schalen met het kwadraat van de belasting: 0,5² = 0,25.',
        },
      ],
      situation: {
        scene: 'Je bent bij een regionale netbeheerder. Een teamleider klaagt dat het omzetten van de aftakschakelaar van netstationtransformatoren “een heel planningsproces” kost, voor een klus van twee minuten.',
        ask: 'Wat vraag je om te begrijpen waarom?',
        model: 'Moet de transformator spanningsloos om de aftakking om te zetten? Zo ja, dan krijgt elke klant op het station een korte onderbreking. Die moet aangekondigd worden, en misschien moet je een deel van de belasting omschakelen. Dan is de echte vraag hoe we die klussen bundelen, bijvoorbeeld met ander gepland werk op hetzelfde station, en niet of de planning te traag is.',
        rubric: [
          'Vraagt of de transformator spanningsloos moet voor het omzetten',
          'Koppelt het aan onderbrekingen en aankondigingen voor klanten',
          'Stelt voor te bundelen met ander gepland werk',
        ],
      },
      sayIt: 'Leg een nieuw projectlid in 60 seconden uit wat een transformator doet en waarom zijn vermogen in kVA wordt opgegeven.',
      terms: [
        { term: 'Wikkelverhouding', def: 'Verhouding tussen de windingen, gelijk aan de spanningsverhouding.' },
        { term: 'ONAN', def: 'Oil natural, air natural: passieve koeling van een oliegevulde transformator.' },
        { term: 'Aftakschakelaar', def: 'Schakelaar die de wikkelverhouding in kleine stappen aanpast om de spanning te corrigeren.' },
        { term: 'Nullastverliezen', def: 'IJzerverliezen die er zijn zodra de transformator onder spanning staat.' },
      ],
    },
    {
      id: 'eng.transformers.ageing',
      title: 'Belasting, temperatuur en veroudering',
      pre: [
        {
          q: 'Wat bepaalt vooral hoe snel een transformator veroudert?',
          options: ['De temperatuur van de papierisolatie', 'Het aantal schakelhandelingen', 'Alleen de leeftijd in jaren', 'De kleur van de olie'],
          answer: 'De temperatuur van de papierisolatie',
          why: 'Warmte breekt het cellulosepapier rond de wikkelingen af; heter betekent sneller verouderen.',
        },
      ],
      teach: [
        'In een transformator zijn de wikkelingen geïsoleerd met papier dat in olie gedrenkt is. Warmte breekt dat papier langzaam af. De vuistregel: elke 6 °C of zo boven de ontwerptemperatuur van het heetste punt verdubbelt de verouderingssnelheid. Een transformator die jarenlang te warm draait kan tientallen jaren levensduur verliezen; een koel draaiende gaat 40 tot 60 jaar mee.',
        'Korte overbelasting is meestal geen probleem. Een transformator warmt langzaam op, over uren, dus een avondpiek van een uur op 120% doet weinig kwaad, en weken op 120% heel veel. Daarom kijken engineers naar het belastingprofiel, niet alleen naar de piekwaarde. Met warmtepompen, auto’s en zonnepanelen draaien veel netstations nu warmer en langer dan waar ze voor ontworpen zijn.',
        'Bij grote transformatoren in onderstations is de olie een gezondheidscheck. Gas-in-olie-analyse (DGA) meet gassen in een oliemonster. Waterstof wijst op partiële ontladingen, acetyleen op vlambogen, etheen op oververhitting, en koolmonoxide op papier dat afbreekt. De trend in de tijd zegt meer dan één waarde. Grote transformatoren hebben vaak een online DGA-monitor.',
        'Netstationtransformatoren zijn anders: er zijn er tienduizenden, meestal hermetisch gesloten, dus ze worden zelden bemonsterd. Daar gebruiken netbeheerders leeftijd, belastingmetingen en storingsdata om te bepalen wat vervangen moet worden. Slimme meters en netstationmonitoring geven nu veel betere belastingdata dan een paar jaar geleden.',
      ],
      example: {
        kind: 'worked',
        text: 'Een 150/10 kV-transformator van 40 MVA laat in de oliemonsters per kwartaal een stijgend acetyleengehalte zien: van 0 naar 3 naar 9 ppm in een jaar. Acetyleen betekent vlambogen binnenin. De assetmanager laat maandelijks bemonsteren, plaatst een online monitor en laat de regelschakelaar inspecteren, een bekende bron. Het eerstvolgende onderhoudsvenster wordt binnen zes weken gepland. Zonder DGA was het eerste signaal misschien een storing geweest die het hele onderstation platlegt.',
      },
      said: 'Wat engineers zeggen: “De DGA laat acetyleen oplopen. Dat zijn vlambogen; we moeten erin voordat hij het begeeft.”',
      recall: [
        {
          q: 'Een transformator draait 12 °C boven de ontwerptemperatuur van het heetste punt. Hoeveel keer sneller veroudert hij volgens de vuistregel van 6 °C?',
          number: 4,
          tolerance: 0.2,
          unit: '×',
          why: '12 / 6 = 2 verdubbelingen: 2 × 2 = 4 keer zo snel.',
        },
        {
          q: 'Welk gas in de DGA wijst op vlambogen?',
          options: ['Kooldioxide', 'Zuurstof', 'Stikstof', 'Acetyleen'],
          answer: 'Acetyleen',
          why: 'Acetyleen ontstaat bij de zeer hoge temperaturen van een vlamboog.',
        },
        {
          q: 'Waarom is een piek van een uur op 120% meestal minder schadelijk dan weken op 120%?',
          options: ['De olie koelt sneller bij pieken', 'Een transformator warmt langzaam op, over uren', 'Pieken zijn alleen ’s nachts', 'De aftakschakelaar vangt de piek op'],
          answer: 'Een transformator warmt langzaam op, over uren',
          why: 'Door zijn thermische traagheid haalt een korte piek de volle temperatuur niet.',
        },
        {
          q: 'Waarom worden netstationtransformatoren zelden op olie bemonsterd?',
          options: ['Hun olie veroudert nooit', 'Het is verboden', 'Er zijn er tienduizenden, meestal hermetisch gesloten', 'Ze hebben geen olie'],
          answer: 'Er zijn er tienduizenden, meestal hermetisch gesloten',
          why: 'Netbeheerders gebruiken daar leeftijd, belasting en storingsdata.',
        },
      ],
      situation: {
        scene: 'Je zit bij een regionale netbeheerder in een overleg over het vervangen van netstationtransformatoren. Het plan is alles ouder dan 45 jaar te vervangen. Een engineer zegt: “Sommige van 30 jaar zijn er slechter aan toe.”',
        ask: 'Wat vraag je?',
        model: 'Welke data hebben we per transformator naast de leeftijd: belastingmetingen, hoe vaak hij boven zijn vermogen draaide, storingshistorie? Veroudering hangt af van temperatuur, dus een zwaar belaste van 30 jaar kan dichter bij het einde zitten dan een licht belaste van 45. Kunnen we de lijst rangschikken op belasting en conditie, niet alleen op leeftijd?',
        rubric: [
          'Zet vraagtekens bij leeftijd als enige criterium',
          'Koppelt veroudering aan belasting en temperatuur',
          'Stelt voor te rangschikken op belasting- en conditiedata',
        ],
      },
      sayIt: 'Leg een assetmanager uit een andere sector in 60 seconden uit waardoor een transformator veroudert en hoe je dat kunt zien.',
      terms: [
        { term: 'Hotspottemperatuur', def: 'Het heetste punt in de wikkeling, dat de verouderingssnelheid bepaalt.' },
        { term: 'DGA', def: 'Gas-in-olie-analyse: gassen in de olie die interne fouten verraden.' },
        { term: 'Thermische traagheid', def: 'Een transformator warmt langzaam op en koelt langzaam af, over uren.' },
      ],
    },
    {
      id: 'eng.transformers.cables',
      title: 'MS- en LS-kabels',
      pre: [
        {
          q: 'Welk onderdeel veroorzaakt in een MS-kabelnet meestal de meeste interne storingen?',
          options: ['De kabel zelf, midden in een lengte', 'De koperen geleider', 'De moffen die kabellengtes verbinden', 'De kabelmarkeringen in de straat'],
          answer: 'De moffen die kabellengtes verbinden',
          why: 'Moffen worden in het veld met de hand gemaakt; vakmanschap, vocht en grondbeweging maken ze het zwakke punt.',
        },
      ],
      teach: [
        'In Nederland domineren twee families MS-kabels. De oudere is de papiergeïsoleerde, met olie geïmpregneerde kabel met een loodmantel en stalen pantser: GPLK. Veel daarvan ligt al 40 tot 60 jaar in de grond en werkt nog prima. Sinds de jaren tachtig en negentig zijn nieuwe kabels meestal XLPE (in het Nederlands vaak VPE): vernet polyetheen, lichter en makkelijker te verwerken.',
        'LS-kabels zijn vergelijkbaar: oude netten hebben papiergeïsoleerde kabels, nieuwere kunststof isolatie met aluminium geleiders. Kabels komen op haspels van een paar honderd meter, dus een langer tracé heeft moffen nodig om de lengtes te verbinden. Aan elk eind verbindt een eindsluiting de kabel met de installatie of de transformator.',
        'Moffen zijn het zwakke punt. Ze worden met de hand gemaakt, in een sleuf, vaak in de regen. Slordig werk, vocht en verzakking van de grond die aan de kabel trekt veroorzaken allemaal storingen. Overgangsmoffen tussen oude papierkabel en nieuwe XLPE zijn extra gevoelig. Een goede mof is uren zorgvuldig werk van een opgeleide monteur.',
        'Andere oorzaken: graafschade is de meest voorkomende externe oorzaak. Overbelasting maakt een kabel warm en versnelt de veroudering. Vroege XLPE-kabels kunnen last hebben van water treeing: kleine kanaaltjes die in de isolatie groeien waar vocht binnenkomt. Als je het kabeltype en de leeftijd van een tracé kent, weet een engineer al veel over de risico’s.',
      ],
      example: {
        kind: 'worked',
        text: 'Een nieuwe 10 kV-aansluiting vraagt een kabeltracé van 2,4 km. De kabel komt op haspels van 600 m, dus er zijn 4 lengtes en 3 moffen nodig, plus aan elk eind een eindsluiting. Aan de oude kant komt de nieuwe XLPE-kabel op een bestaande GPLK-kabel, dus één van die moffen is een overgangsmof. De werkvoorbereider plant een monteur met een geldig certificaat voor overgangsmoffen en een droge, overdekte sleuf, want een vochtige overgangsmof is een klassieke storing een paar jaar later.',
      },
      said: 'Wat engineers zeggen: “Daar gaat het van GPLK naar XLPE, dus je hebt een overgangsmof nodig. Zorg dat iemand die bevoegd is hem maakt.”',
      recall: [
        {
          q: 'Een kabeltracé is 3 km en de kabel komt op haspels van 500 m. Hoeveel moffen zijn er nodig tussen de lengtes?',
          number: 5,
          tolerance: 0.5,
          unit: 'moffen',
          why: '3.000 / 500 = 6 lengtes, dus 5 moffen ertussen.',
        },
        {
          q: 'Wat is GPLK?',
          options: ['Papiergeïsoleerde MS-kabel met loodmantel', 'Een moderne kunststofkabel', 'Een type mof', 'Een kabelzoekapparaat'],
          answer: 'Papiergeïsoleerde MS-kabel met loodmantel',
          why: 'Het oudere Nederlandse kabeltype: papierisolatie, loodmantel, stalen pantser.',
        },
        {
          q: 'Wat is de meest voorkomende externe oorzaak van kabelschade?',
          options: ['Blikseminslag', 'Vorst', 'Knaagdieren', 'Graafwerk'],
          answer: 'Graafwerk',
          why: 'Graafmachines die kabels raken veroorzaken veel storingen, ondanks de verplichte KLIC-melding.',
        },
        {
          q: 'Waarom zijn overgangsmoffen gevoelig?',
          options: ['Ze voeren meer stroom', 'Ze verbinden twee verschillende kabeltypes, en dat is lastiger goed te doen', 'Ze worden alleen in LS gebruikt', 'Ze worden in een fabriek gemaakt'],
          answer: 'Ze verbinden twee verschillende kabeltypes, en dat is lastiger goed te doen',
          why: 'Papierkabel en XLPE aan elkaar maken vraagt extra vakmanschap en zorg.',
        },
      ],
      situation: {
        scene: 'Je bent bij een regionale netbeheerder. De storingsdata laten zien dat MS-moffen van de afgelopen drie jaar vaker falen dan oudere. Een manager wil van moffenleverancier wisselen.',
        ask: 'Wat vraag je voordat er gewisseld wordt?',
        model: 'Clusteren de storingen per leverancier, of per ploeg, type mof en omstandigheden? Als er in dezelfde periode veel nieuwe monteurs zijn bijgekomen, of als er onder meer tijdsdruk wordt gewerkt, helpt een andere leverancier niks. Kunnen we de gefaalde moffen uitsplitsen naar type, ploeg, weer en leeftijd, en een paar van die moffen zelf bekijken?',
        rubric: [
          'Vraagt of de oorzaak bij het product, het vakmanschap of de omstandigheden ligt',
          'Denkt aan veranderingen in ploegen en tijdsdruk',
          'Stelt voor de storingsdata en de gefaalde moffen te analyseren',
        ],
      },
      sayIt: 'Leg een projectmanager in 60 seconden uit waarom moffen het zwakke punt zijn in een kabelnet.',
      terms: [
        { term: 'GPLK', def: 'Oudere papiergeïsoleerde MS-kabel met loodmantel en stalen pantser.' },
        { term: 'XLPE (VPE)', def: 'Vernet polyetheen, de moderne kunststof kabelisolatie.' },
        { term: 'Mof', def: 'Verbinding tussen twee kabellengtes, met de hand gemaakt in het veld.' },
        { term: 'Eindsluiting', def: 'Afsluiting die een kabel verbindt met een installatie of transformator.' },
      ],
    },
    {
      id: 'eng.transformers.faults',
      title: 'Kabelstoringen en herstel',
      pre: [
        {
          q: 'Een MS-kabel valt uit en 2.000 klanten zitten zonder stroom. Wat brengt de meesten van hen meestal als eerste terug?',
          options: ['De kabel repareren', 'De ring omschakelen zodat ze van de andere kant gevoed worden', 'Een mobiel aggregaat', 'Wachten tot de storing vanzelf verdwijnt'],
          answer: 'De ring omschakelen zodat ze van de andere kant gevoed worden',
          why: 'Omschakelen kost minuten tot een paar uur; de kabel repareren duurt veel langer.',
        },
      ],
      teach: [
        'Als een MS-kabel uitvalt, schakelt de beveiliging in het onderstation het veld af, en iedereen op dat deel van de ring zit zonder stroom. Het bedrijfsvoeringscentrum ziet het meteen. Monteurs rijden naar de netstations, gebruiken kortsluitverklikkers om het defecte stuk te vinden, openen de schakelaars aan beide kanten en sluiten het normaal openpunt. De meeste klanten hebben binnen één à twee uur weer stroom, sneller waar op afstand geschakeld kan worden.',
        'Dan moet de fout gevonden worden. Eerst de voorlokalisatie: een reflectiemeter (echometer) stuurt een puls de kabel in en meet hoe lang de echo van de fout erover doet om terug te komen. Dan het nalokaliseren: een stootgenerator stuurt hoogspanningspulsen die de fout laten doorslaan, en een monteur luistert boven het tracé naar de klap om de precieze plek te vinden.',
        'Herstel: een gat graven, het beschadigde stuk eruit, een nieuw stuk kabel met twee moffen erin, testen en terugschakelen. Dat is vaak een volle werkdag of meer, afhankelijk van de plek, vergunningen en diepte. In de tussentijd draait de ring zonder reserve, dus een tweede storing geeft een langere onderbreking.',
        'LS-storingen zijn anders: vaak slaat een zekering in het netstation door en vervangt een monteur die, of brandt een LS-kabel door. Graafschade is een groot deel van alle storingen. Vóór het graven is een KLIC-melding verplicht om de kaarten van kabels en leidingen te krijgen; toch gebeurt er dagelijks schade.',
      ],
      example: {
        kind: 'worked',
        text: 'Om 14:10 valt een 10 kV-veld uit: 1.800 klanten zonder stroom. Om 14:40 zijn monteurs bij netstation 4 en 5; de kortsluitverklikkers laten zien dat de foutstroom wel langs station 4 ging, maar niet langs station 5. Ze openen de schakelaars tussen 4 en 5 en sluiten het openpunt: om 15:30 heeft iedereen weer stroom. De reflectiemeter zet de fout op 320 m van station 4. De stootgenerator vindt hem onder een net bestrate oprit: graafschade van vorige week. Een ploeg repareert hem de volgende dag met twee moffen; om 17:00 is de ring weer compleet.',
      },
      said: 'Wat engineers zeggen: “De klanten zijn terug, het defecte stuk is vrijgeschakeld. Morgen gaan we stoten en maken we hem.”',
      recall: [
        {
          q: 'Een puls van de reflectiemeter gaat met zo’n 160 m per microseconde. De echo komt na 10 microseconden terug. Hoe ver weg zit de fout, in meter?',
          number: 800,
          tolerance: 20,
          unit: 'm',
          why: 'De puls gaat heen en terug: 160 × 10 / 2 = 800 m.',
        },
        {
          q: 'Wat doet een stootgenerator bij het zoeken naar een kabelfout?',
          options: ['Hij brengt de stroom terug bij klanten', 'Hij meet de lengte van de kabel', 'Hij laat de fout doorslaan zodat je hem boven de grond kunt horen', 'Hij droogt de kabel'],
          answer: 'Hij laat de fout doorslaan zodat je hem boven de grond kunt horen',
          why: 'Hoogspanningspulsen geven een klap op de foutplek die je precies kunt vinden.',
        },
        {
          q: 'Waarom is de periode na het omschakelen maar vóór de reparatie een risico?',
          options: ['De ring draait zonder reserve, dus een tweede storing geeft een langere onderbreking', 'Klanten krijgen een hogere spanning', 'De kabel wordt warm', 'De meters doen het niet'],
          answer: 'De ring draait zonder reserve, dus een tweede storing geeft een langere onderbreking',
          why: 'Met het openpunt gesloten is er voor die ring geen tweede voeding meer.',
        },
        {
          q: 'Wat is in Nederland verplicht vóór het graven?',
          options: ['Een vergunning van TenneT', 'Een belletje naar de energieleverancier', 'De kabels in de buurt uitschakelen', 'Een KLIC-melding om de kaarten van kabels en leidingen te krijgen'],
          answer: 'Een KLIC-melding om de kaarten van kabels en leidingen te krijgen',
          why: 'Via KLIC krijgt de grondroerder de kaarten van ondergrondse kabels en leidingen.',
        },
      ],
      situation: {
        scene: 'Je bent bij een regionale netbeheerder in een project over storingsduur. In de ene regio duurt het gemiddeld 95 minuten om klanten terug te schakelen; in een andere 40 minuten. De manager van de trage regio zegt: “Ons gebied is groter.”',
        ask: 'Wat vraag je?',
        model: 'Laten we die 95 minuten opknippen in stappen: tijd tot de melding, tot het uitsturen, reistijd, het defecte stuk vinden, schakelen. Waar zit het verschil met de andere regio? Als reistijd het grootste deel is, helpen schakelen op afstand of kortsluitverklikkers in belangrijke netstations misschien meer dan extra ploegen. Duurt het vinden van het stuk lang, dan ontbreken er misschien verklikkers.',
        rubric: [
          'Knipt de hersteltijd op in stappen',
          'Vergelijkt de stappen tussen de regio’s',
          'Koppelt de grootste stap aan een concrete oplossing zoals schakelen op afstand of verklikkers',
        ],
      },
      sayIt: 'Leg een manager klantenservice in 60 seconden uit wat er gebeurt tussen een storing in een MS-kabel en de reparatie.',
      terms: [
        { term: 'Reflectiemeter (echometer)', def: 'Meetapparaat dat een puls de kabel in stuurt en de echo van de fout timet.' },
        { term: 'Stootgenerator', def: 'Apparaat dat de fout laat doorslaan zodat je hem precies kunt vinden.' },
        { term: 'KLIC-melding', def: 'Verplichte aanvraag van kabel- en leidingkaarten vóór het graven.' },
      ],
    },
    {
      id: 'eng.transformers.connections',
      title: 'Wat een nieuwe aansluiting vraagt',
      pre: [
        {
          q: 'Welke fase duurt bij een gewone nieuwe zakelijke aansluiting meestal het langst?',
          options: ['Het graven en aansluiten', 'De aanvraag behandelen', 'De werkvoorbereiding: vergunningen, materiaal en planning', 'De meter plaatsen'],
          answer: 'De werkvoorbereiding: vergunningen, materiaal en planning',
          why: 'Het werk in de straat kost vaak dagen; vergunningen, afstemming en materiaal kunnen maanden kosten.',
        },
      ],
      teach: [
        'Een aansluiting gaat door vijf stappen. Aanvraag: de klant vraagt aan, voor kleine aansluitingen meestal online. Capaciteitscheck: is er ruimte in het net, en wacht de aanvraag in congestiegebieden? Ontwerp: het tracé, de kabel, en of er een nieuw netstation of een MS-aansluiting nodig is. Werkvoorbereiding: vergunningen, KLIC, materiaal, ploegplanning. Uitvoering: graven, kabel leggen, moffen, aansluiten, meter, en in bedrijf nemen.',
        'De grootte bepaalt de route. Kleine aansluitingen tot 3 × 80 A komen op de LS-kabel in de straat. Grotere krijgen een zware LS-kabel rechtstreeks uit het netstation. Boven ruwweg een paar honderd kVA krijgt de klant meestal een MS-aansluiting met een eigen station of MS-ruimte, en dat vraagt veel meer ontwerp en afstemming.',
        'De wet geeft een standaardtermijn van 18 weken voor de meeste aansluitingen tot 10 MVA, en die termijn halen netbeheerders nu vaak niet. Het werk zelf is kort, vaak één of twee dagen op locatie. De rest is wachten: op een capaciteitscheck, een graafvergunning van de gemeente, materiaal of een vrije ploeg. Herstelwerk als het ontwerp niet klopt met de straat maakt het langer.',
        'In de werkvoorbereiding zit vaak een groot deel van de doorlooptijd. Eén ontbrekende vergunning of een transformator die niet op voorraad is, en het werk ligt stil. Daarom is het een logisch verbeterdoel: standaardpakketten, vergunningen eerder aanvragen, en de locatie checken voordat de ploeg komt.',
      ],
      example: {
        kind: 'worked',
        text: 'Een supermarkt vraagt een aansluiting van 3 × 250 A aan. Aanvraag behandelen: 2 weken. Capaciteitscheck: 1 week, er is ruimte in het netstation. Ontwerp: 3 weken, een nieuwe LS-kabel van 180 m vanaf het netstation. Werkvoorbereiding: 8 weken, vooral de gemeentelijke vergunning om onder een fietspad door te graven. Uitvoering: ingepland over 4 weken, 2 dagen op locatie. Totaal: 2 + 1 + 3 + 8 + 4 = 18 weken, voor 2 dagen werk in de straat. De vergunning tijdens het ontwerp aanvragen had 3 tot 4 weken gescheeld.',
      },
      said: 'Wat engineers zeggen: “De ploeg staat er twee dagen. Het gaat om de veertien weken daarvoor.”',
      recall: [
        {
          q: 'Aanvraag 2 weken, ontwerp 3 weken, werkvoorbereiding 8 weken, wachten op een ploeg 4 weken. Wat is de totale doorlooptijd, in weken?',
          number: 17,
          tolerance: 0.5,
          unit: 'weken',
          why: '2 + 3 + 8 + 4 = 17 weken.',
        },
        {
          q: 'Hoe wordt een kleine aansluiting tot 3 × 80 A meestal aangesloten?',
          options: ['Rechtstreeks op de MS-ring', 'Op de LS-kabel in de straat', 'Op een eigen transformator', 'Op het TenneT-net'],
          answer: 'Op de LS-kabel in de straat',
          why: 'Kleine aansluitingen hangen aan het lokale LS-net.',
        },
        {
          q: 'Wat krijgt een grote klant van een paar honderd kVA of meer meestal?',
          options: ['Een aansluiting van 3 × 25 A', 'Twee huisaansluitingen', 'Een aansluiting op het 150 kV-net', 'Een MS-aansluiting met een eigen station of MS-ruimte'],
          answer: 'Een MS-aansluiting met een eigen station of MS-ruimte',
          why: 'Boven een paar honderd kVA worden LS-kabels onpraktisch.',
        },
        {
          q: 'Welke maatregel maakt de doorlooptijd van aansluitingen het vaakst korter?',
          options: ['Vergunningen eerder aanvragen, parallel aan het ontwerp', 'Sneller graven', 'Dikkere kabel gebruiken', 'De klant vragen te wachten'],
          answer: 'Vergunningen eerder aanvragen, parallel aan het ontwerp',
          why: 'Wachten op vergunningen is vaak de langste stap; parallel werken scheelt weken.',
        },
      ],
      situation: {
        scene: 'Je bent bij een regionale netbeheerder. Een manager wil de doorlooptijd van aansluitingen verkorten en stelt voor 20 extra monteurs aan te nemen.',
        ask: 'Wat vraag je?',
        model: 'Waar zit de doorlooptijd eigenlijk? Als een aansluiting 20 weken duurt en de ploeg twee dagen op locatie staat, verkorten extra monteurs alleen het wachten op een ploeg. Kunnen we 30 recente klussen nemen en per stap de weken in kaart brengen: aanvraag, capaciteitscheck, ontwerp, werkvoorbereiding, uitvoering? Dan weten we of de bottleneck in het veld zit of op kantoor.',
        rubric: [
          'Zet de tijd op locatie naast de totale doorlooptijd',
          'Stelt voor de weken per stap in kaart te brengen op echte klussen',
          'Checkt of de bottleneck veldcapaciteit of voorbereiding is',
        ],
      },
      sayIt: 'Leg een zakelijke klant in 60 seconden uit waarom zijn aansluiting maanden duurt terwijl het werk twee dagen is.',
      terms: [
        { term: 'Werkvoorbereiding', def: 'Vergunningen, kaarten, materiaal en planning vóór de uitvoering.' },
        { term: 'Aansluittermijn', def: 'De tijd die een netbeheerder heeft om een aansluiting te realiseren; standaard 18 weken tot 10 MVA.' },
        { term: 'Kleinverbruik', def: 'Kleine aansluitingen tot 3 × 80 A.' },
      ],
    },
    {
      id: 'eng.transformers.standard',
      title: 'Standaardisatie',
      pre: [
        {
          q: 'Een netbeheerder stapt over van netstations op maat naar een paar standaardtypes. Wat is meestal de grootste winst?',
          options: ['Sneller ontwerpen, inkopen en bouwen bij grote aantallen', 'Elk station past beter bij zijn locatie', 'Minder klanten hebben een aansluiting nodig', 'Transformatoren gaan langer mee'],
          answer: 'Sneller ontwerpen, inkopen en bouwen bij grote aantallen',
          why: 'Standaardontwerpen schrappen ontwerpuren, maken grote bestellingen mogelijk en maken het werk routine.',
        },
      ],
      teach: [
        'Met meer werk dan mensen gaan netbeheerders standaardiseren. Een standaard netstation is een prefab gebouwtje of kiosk met een vaste MS-installatie, transformatorgroottes zoals 400 of 630 kVA, en een standaard LS-rek. In plaats van elk station te ontwerpen kiest de ontwerper een type uit een catalogus.',
        'Ook aansluitingen zijn gestandaardiseerd: een vaste set groottes voor kleinverbruik (3 × 25 A, 3 × 35 A tot 3 × 80 A), en standaardontwerpen voor MS-klantaansluitingen. Hoe meer klussen een standaard volgen, hoe minder engineering elke klus vraagt en hoe minder verrassingen er op locatie zijn.',
        'De voordelen stapelen zich op in de hele keten: minder ontwerpuren, grotere en voorspelbaardere bestellingen bij leveranciers, voorraad die bij het werk past, kortere opleiding voor monteurs, en minder fouten omdat iedereen de standaard kent. Netbeheerders stemmen ook onderling specificaties af, zodat leveranciers in serie kunnen produceren.',
        'De prijs: een standaard is op een bepaalde plek soms groter of duurder dan een ontwerp op maat. Over honderden klussen is dat meestal de moeite waard. Het lastige is discipline: elke uitzondering (“dit geval is bijzonder”) brengt ontwerpuren en voorraadproblemen terug. Een goede standaard heeft een helder proces voor uitzonderingen.',
      ],
      example: {
        kind: 'worked',
        text: 'Een netbeheerder bouwt 300 nieuwe netstations per jaar. Een ontwerp op maat kost zo’n 40 engineeringuren; met een standaardtype kost kiezen en aanpassen zo’n 8 uur. Besparing: 300 × 32 = 9.600 uur per jaar, zo’n zes fulltime ontwerpers. Standaardtransformatoren die per jaar besteld worden, komen ook sneller binnen. De keerzijde: op sommige plekken komt een standaardstation van 630 kVA waar 400 kVA genoeg was geweest, maar dat laat ook ruimte voor toekomstige warmtepompen en auto’s.',
      },
      said: 'Wat engineers zeggen: “Zet er gewoon een standaard 630 neer. Bouwt sneller, en over vijf jaar heb je hem toch nodig.”',
      recall: [
        {
          q: 'Een netbeheerder ontwerpt 250 stations per jaar. Een standaard bespaart 30 ontwerpuren per station. Hoeveel uur per jaar wordt er bespaard?',
          number: 7500,
          tolerance: 10,
          unit: 'uur',
          why: '250 × 30 = 7.500 uur.',
        },
        {
          q: 'Wat is het grootste nadeel van standaardstations?',
          options: ['Ze kunnen niet op MS aangesloten worden', 'Op sommige plekken zijn ze groter of duurder dan nodig', 'Ze vragen meer ontwerpuren', 'De ACM staat ze niet toe'],
          answer: 'Op sommige plekken zijn ze groter of duurder dan nodig',
          why: 'Een standaard past de meeste gevallen goed, maar niet elk geval perfect.',
        },
        {
          q: 'Waarom stemmen netbeheerders specificaties met elkaar af?',
          options: ['De wet eist één leverancier', 'Het verlaagt de tarieven direct', 'Zodat leveranciers in serie kunnen produceren en sneller leveren', 'Om monteurs te delen'],
          answer: 'Zodat leveranciers in serie kunnen produceren en sneller leveren',
          why: 'Gedeelde specificaties geven leveranciers grotere, voorspelbare volumes.',
        },
        {
          q: 'Wat ondermijnt een standaard het vaakst?',
          options: ['Te weinig types', 'Leveranciers', 'Het weer', 'Te veel uitzonderingen zonder helder proces'],
          answer: 'Te veel uitzonderingen zonder helder proces',
          why: 'Elke uitzondering brengt maatwerk en voorraadproblemen terug.',
        },
      ],
      situation: {
        scene: 'Je bent bij een regionale netbeheerder in een project om MS-klantaansluitingen te standaardiseren. Ontwerpers zeggen: “Elke klant is anders, een standaard werkt niet.”',
        ask: 'Hoe reageer je?',
        model: 'Laten we naar de laatste 50 MS-aansluitingen kijken: hoeveel waren echt anders, en hoeveel waren varianten van drie of vier types? Als 80% in een paar standaarden past, ontwerpen we die één keer en gebruiken we de tijd van de ontwerpers voor de 20% die echt bijzonder is. Kunnen we een eenvoudig uitzonderingsproces opzetten, zodat “deze is anders” een keuze met een reden wordt?',
        rubric: [
          'Toetst de bewering met data van recente klussen',
          'Richt de standaard op het grootste deel van de gevallen',
          'Stelt een helder uitzonderingsproces voor',
        ],
      },
      sayIt: 'Leg een ontwerper in 60 seconden uit waarom standaardiseren tijd bespaart, ook al is niet elke standaard perfect voor elk geval.',
      terms: [
        { term: 'Standaard netstation', def: 'Een prefab type netstation met vaste installatie, transformatorgrootte en LS-rek.' },
        { term: 'Uitzonderingsproces', def: 'Een vaste manier om afwijkingen van de standaard goed te keuren en vast te leggen.' },
        { term: 'Serieproductie', def: 'Hetzelfde product in volume maken, wat de levertijd van leveranciers verkort.' },
      ],
    },
  ],
};

# Pilot: verhalend leren in eng.flow (Capaciteit en flow)

Concept voor Merijn, 2026-11-09. Hoort bij `docs/superpowers/plans/2026-11-09-v15-story-learning.md`.
Er is nog niets in de app veranderd: geen lesbestand, geen test, geen CACHE. Dit document is alleen het verhaal, om te lezen en goed te keuren.

Uitgangspunten, zoals afgesproken:

- Het verhaal is een lijst om de les heen, geen vervanging. Teach-blokken, voorbeelden en vastgepinde recall-vragen blijven zoals ze zijn.
- Elke scène gebruikt alleen getallen en termen die al in die les staan, precies zoals ze er staan. Verhaalgetallen die níét uit de les komen (aantallen mensen, data) staan alleen in de setting en komen in geen enkele vraag terug.
- Wie de scène overslaat, kan elke vraag nog steeds beantwoorden.
- Scènes: tegenwoordige tijd, maximaal ongeveer 60 woorden, eindigen op een probleem of keuze. De Engelse term staat tussen haakjes de eerste keer dat een lesterm in een scène voorkomt.

---

## 1. Setting en personages

### De fabriek: IJsselbak, Zutphen (fictief)

IJsselbak maakt afvalbakken voor gemeenten:

- **kunststof minicontainers** van 140 en 240 liter (de bak die bij je voordeur staat), met deksels in verschillende kleuren;
- **GFT-keukenemmertjes**, die per doos met de containers worden meegeleverd, vaak met de opdruk van de gemeente;
- **stalen ondergrondse containers en inwerpzuilen** voor binnensteden.

Ongeveer 230 mensen, drie afdelingen:

| Afdeling | Wat er staat | Rol in het verhaal |
|---|---|---|
| Spuitgieterij | 8 spuitgietmachines, waaronder lijn 3 (de grote machine voor de 240-literbak), de emmertjesmachine, en een compoundeerlijn die het granulaat kleurt | OEE, omstellen, seriegrootte, productwiel |
| Plaatwerkerij | lasersnijder, kantbank, lasrobot, poedercoatlijn | bottleneck, capaciteit, drum-buffer-rope, throughput |
| Montage & inpak | de containerlijn (wielen, as, deksel, chip, etiket) en de inpaklijn voor de emmertjes | takt, lijnbalans, bemensing |

IJsselbak hoort bij een klein concern met een zusterfabriek in Polen.

**De klantdruk.** Afvalservice Oost (fictief), het afvalbedrijf van vijf gemeenten, voert per 1 september gescheiden inzameling in. IJsselbak heeft de order: minicontainers met een emmertje voor elk huishouden, en ondergrondse containers voor de binnensteden. Er wordt per wijk geleverd, van maart tot augustus, en de order heeft een boeteclausule als een wijk te laat is. Iedereen in de fabriek weet het: als de eerste wijk zonder bakken zit, staat IJsselbak in de krant.

### De vaste personages

| Naam | Rol | Karakter in één regel |
|---|---|---|
| **Sanne Bakker** (36) | Nieuwe teamleider montage & inpak; groeit door tot waarnemend productieleider | Komt uit een distributiecentrum, is snel met cijfers en nieuw op de vloer, en vraagt liever één keer te veel “hoe weet je dat?”. |
| **Ineke Mulder** (54) | Omsteller in de spuitgieterij, 27 jaar in dienst | Kent elke matrijs bij naam, en wantrouwt alles wat op een camera of een spreadsheet lijkt, tot het haar team iets oplevert. |
| **Rachid El Amrani** (29) | Procesengineer | Rekent alles twee keer na, en leert dit jaar dat een balans pas klopt als hij op de vloer is gemeten. |
| **Daan Visser** (45) | Planner | Moet elke dag beloftes waarmaken die verkoop gisteren deed, en zoekt zijn zekerheid in grote series en het ERP-systeem. |
| **Marieke Smit** (51) | Plantdirecteur | Rekent in euro’s en leverbetrouwbaarheid, geeft Sanne ruimte, maar tekent niets zonder cijfers. |

Bijfiguren (geen eigen verhaallijn): **Femke de Boer**, accountmanager voor de gemeenten; **Wouter Kok**, controller van het concern.

Waarom deze verdeling: de ervaren vakvrouw met de meeste weerstand is Ineke, de directeur is een vrouw, de planner is geen boosdoener maar iemand onder druk, en de engineer is jong en precies maar geen nerd-cliché. Niemand heeft altijd gelijk, ook Sanne niet.

---

## 2. De boog over de vier niveaus

De vier onderwerpen lopen naast elkaar: een leerling doet vaak eerst alle Basis-lessen, dan Werkkennis. Daarom loopt de tijd mee met het niveau, niet met het onderwerp.

| Niveau | Tijd in het verhaal | Waar Sanne staat | Wat er op het spel staat |
|---|---|---|---|
| Basis | januari | Eerste weken als teamleider; ze leert de taal van de vloer | Ze moet vertrouwen winnen, en de order is net binnen |
| Werkkennis | februari–maart | Ze zit in het capaciteitsteam voor de order en krijgt de plaatwerkerij erbij | De eerste wijken moeten in maart hun bakken hebben |
| Gevorderd | april–juni | Ze stuurt zelf verbeteringen aan in drie afdelingen | De leveringen per wijk lopen; elke vertraging kost boete |
| Expert | juli–oktober | Waarnemend productieleider; ze verdedigt keuzes bij Marieke en het concern | Investeringen, productmix en de vraag voor volgend jaar |

### Per onderwerp

**Takt en lijnbalans (montage & inpak, Sannes eigen terrein).**
Basis: Sanne rekent haar eerste takt uit op de inpaklijn en ziet hoe weinig marge er is. Werkkennis: haar ploeg wil een zevende operator; zij laat eerst de Yamazumi zien. Gevorderd: een nieuw containermodel met slot komt op de lijn, en Rachids balans op papier blijkt het lopen te vergeten. Expert: er komt 30% meer vraag aan, en Sanne beslist zelf hoeveel mensen er bij moeten.
Wat verandert: van iemand die een getal uitrekent naar iemand die de bemensing voor een heel jaar onderbouwt. Inzet: de boeteclausule, en de vraag of Sanne serieus genomen wordt door haar eigen ploeg.

**Bottleneck en capaciteit (van de containerlijn naar de plaatwerkerij).**
Basis: Sanne voorkomt een aankoop van €80.000 op de verkeerde machine. Werkkennis: in het S&OP-overleg blijkt “15% vrij” op de lasersnijder papier te zijn. Gevorderd: na een extra ploeg op de laser verschuift de bottleneck naar de poedercoatlijn, en Daan geeft nog steeds alles op maandag vrij. Expert: de kantbank is de bottleneck, en Sanne moet de controller overtuigen van een andere productmix.
Wat verandert: de bottleneck verschuift echt, precies zoals de lessen voorspellen (vinden, benutten, onderschikken, verhogen, opnieuw beginnen). Sanne leert die beweging zelf te sturen. Inzet: de ondergrondse containers voor de binnensteden, en het geld dat een uur op de bottleneck waard is.

**OEE en verliezen (spuitgieterij, lijn 3).**
Basis: de OEE van lijn 3 zakt, en “de machine is gewoon oud”. Werkkennis: de stilstandregistratie heeft 60 codes en 30% “overig”; Ineke helpt de codes inkorten. Gevorderd: Zutphen meldt 78% tegen 62% in Polen, en Sanne ontdekt dat haar eigen fabriek zich rijk rekent. Expert: Marieke wil een tweede spuitgietmachine van €350.000, en Sanne zet de OEE-punten ernaast.
Wat verandert: van een getal waar iedereen een mening over heeft naar een eerlijke definitie en een businesscase. Inzet: de 240-literbak, die elke wijk nodig heeft, en Sannes geloofwaardigheid tegenover Marieke als ze de cijfers van haar eigen fabriek minder mooi maakt.

**Omstellen en seriegrootte (spuitgieterij en compoundeerlijn, Inekes terrein).**
Basis: Daan wil grotere series omdat omstellen 2 uur duurt; het magazijn staat vol met de verkeerde emmertjes. Werkkennis: Sannes eerste SMED-workshop, en Ineke wil niet gefilmd worden. Gevorderd: de omsteltijd is gehalveerd, maar het ERP-systeem draait nog steeds series van 5.000 dozen. Expert: op de compoundeerlijn gaat het drie keer per week van zwart naar wit; Ineke tekent zelf de omstelmatrix voor een productwiel.
Wat verandert: Ineke gaat van tegenstander naar eigenaar, en Sanne leert dat je omsteltijd niet wint met een spreadsheet maar met de mensen die omstellen. Inzet: levertijden voor gemeenten met hun eigen opdruk, en een magazijn dat vol staat met wat niemand wil.

---

## 3. De 16 scènes

Per les: de bron in de les (welke situatie, welk voorbeeld of welke `said`-regel de scène aanpast), de openingsscène, de slotregel na de check, en wat er in de les zelf zou moeten veranderen bij de uitrol. Dat laatste is altijd alleen de omgeving (bedrijf, product); getallen en vragen blijven gelijk.

### Onderwerp: Takt en lijnbalans

#### Basis — `eng.flow.takt` (Takt, cyclustijd en doorlooptijd)

*Bron: het uitgewerkte voorbeeld (verpakkingslijn, 2.400 dozen per week) en de `said`-regel (52 seconden op een takt van 55).*

> Januari, Sannes eerste week bij IJsselbak. Op de inpaklijn moeten 2.400 dozen emmertjes per week de deur uit: vijf dagen, één dienst van 8 uur, twee pauzes van 15 minuten en een startoverleg van 10. Het scherm zegt: elke 52 seconden een doos. “Dat halen we ruim,” zegt de voorman. Sanne wil eerst de takt (takt time) uitrekenen.

**Slotregel:** Sanne komt uit op 55 seconden: drie seconden marge. Wat zegt ze morgen in het startoverleg, als er voor de tweede keer een doos vastloopt?

*Bij uitrol:* het voorbeeld mag blijven zoals het is (“een verpakkingslijn” wordt “de inpaklijn van IJsselbak”). De situatie (robotcel bij een automotive toeleverancier, takt 40 s, cyclus 38 s) kan de robotcel worden die de emmertjes uit de spuitgietmachine pakt; de getallen blijven gelijk.

#### Werkkennis — `eng.flow.balance` (Lijnbalancering)

*Bron: de situatie (een assemblagelijn haalt zijn dagtarget niet; de supervisor wil een zevende operator).*

> Februari. De containerlijn haalt al twee weken zijn dagtarget niet, en de eerste wijk krijgt in maart zijn bakken. De middagploeg wil een zevende operator. Marieke legt de aanvraag bij Sanne neer: “Jij kent die lijn nu. Teken ik?” Rachid heeft de cyclustijd (cycle time) per station gemeten, maar nog niet naast de takt gelegd.

**Slotregel:** Rachid tekent de Yamazumi op het whiteboard. Ziet Sanne één balk die boven de taktlijn uitsteekt, of zeven stations die allemaal vol zitten?

*Bij uitrol:* de situatie wordt “de containerlijn” in plaats van “een assemblagelijn voor warmtepompen”. Het uitgewerkte voorbeeld (e-bike motoren, kabels leggen) past niet bij containers; zie de notities.

#### Gevorderd — `eng.flow.precedence` (Balanceren met volgorde en spreiding)

*Bron: de situatie (nieuw model, Excel-balans met nul procent balansverlies, “Klaar, dit werkt”, geplande cyclustijd 48 s), de `said`-regel (station drie loopt elke cyclus naar het rek) en het teach-blok (4 meter lopen naar een rek).*

> April. Afvalservice Oost wil voor de binnenstad een 240-litercontainer met slot. Rachid laat zijn Excel-balans zien: nul procent balansverlies (balance loss), elk station onder de geplande cyclustijd (planned cycle time) van 48 seconden. “Klaar, dit werkt.” Sanne kijkt naar de vloer. Het rek met sloten staat 4 meter achter station drie. Morgen gaat de nieuwe balans live.

**Slotregel:** Sanne vraagt Rachid om een stopwatch en tien cycli op station drie. Wat staat er straks in de balans dat er nu nog niet in staat?

*Bij uitrol:* de situatie wordt “een nieuw containermodel” in plaats van “een nieuw kastmodel bij een fabrikant van schakelkasten”. De kantelaar en momentsleutel uit het modelantwoord kunnen blijven (een container wordt ook gekanteld voor de as).

#### Expert — `eng.flow.staffing` (Bemensing als de vraag verandert)

*Bron: de situatie (verkoop verwacht in het voorjaar 30% meer vraag; de productiemanager wil twee uitzendkrachten “voor de zekerheid”) en de `said`-regel (de vijfmansbalans ligt klaar).*

> Oktober. Femke heeft een tweede regio binnengehaald: verkoop verwacht in het voorjaar 30% meer vraag op de containerlijn. Marieke wil alvast twee uitzendkrachten aannemen, “voor de zekerheid”. Sanne, inmiddels waarnemend productieleider, kent de werkinhoud (work content) per container, maar heeft de nieuwe takt nog niet uitgerekend. HR wil vrijdag weten hoeveel mensen het worden.

**Slotregel:** Sanne rekent de nieuwe takt uit en legt de skillsmatrix (skills matrix) ernaast. Hoeveel mensen vraagt ze vrijdag, en op welke stations zet ze de nieuwe?

*Bij uitrol:* “een fabrikant van koffiemachines” wordt IJsselbak; “de productiemanager” wordt Marieke. De 140- en 240-litercontainer zijn een mooi echt voorbeeld van een mixed-model lijn, maar de getallen in de les (200 en 300 seconden, 70% en 30%) blijven ongenoemd in de scène.

### Onderwerp: Bottleneck en capaciteit

#### Basis — `eng.flow.bottleneck` (De bottleneck bepaalt de output)

*Bron: de situatie (het team wil een snellere etiketteermachine van €80.000, “want daar gaat het altijd mis”).*

> Januari. Sannes ploeg op de containerlijn wil een snellere etiketteermachine van €80.000, “want daar gaat het altijd mis”. De offerte hangt al op het prikbord. Marieke vraagt of Sanne de aanvraag steunt; tekenen kan deze week nog. Sanne wil eerst de lijn aflopen. Waar zoekt ze de bottleneck (bottleneck), en hoe ziet ze of de etiketteerder het is?

**Slotregel:** Bij de etiketteerder staat de operator op containers te wachten. Hoe vertelt Sanne haar ploeg dat de €80.000 er geen container per uur bij oplevert, zonder dat ze zich afgeserveerd voelen?

*Bij uitrol:* “een klant in de voedingsmiddelenindustrie” wordt de containerlijn. Het uitgewerkte voorbeeld (bewerkingscel met CNC) en het figuur (stations van 40, 55 en 45 seconden) blijven los staan; zie de notities.

#### Werkkennis — `eng.flow.capacity` (Capaciteit en bezettingsgraad)

*Bron: de situatie (S&OP-overleg; verkoop wil een grote order aannemen; de planner zegt: “de lasersnijder zit op 85%, dus er is 15% vrij”).*

> Maart, het S&OP-overleg (sales and operations planning). Femke wil de order voor de ondergrondse containers vandaag bevestigen, met een harde leverdatum per binnenstad. Daan knikt: “We hebben capaciteit, de lasersnijder zit op 85%, dus er is 15% vrij.” Marieke kijkt naar Sanne, die sinds deze week ook de plaatwerkerij erbij heeft. Bevestigen ze?

**Slotregel:** Daan zoekt het op: die 85% is gerekend tegen papieren uren. Welke levertijd laat Sanne Femke nu nog beloven, en wat zou een extra ploeg op de laser opleveren?

*Bij uitrol:* “een plaatbewerker” wordt de plaatwerkerij van IJsselbak. Het uitgewerkte voorbeeld (CNC-bottleneck, 1.200 stuks per week) en de `said`-regel (vijfassige freesmachine) passen niet in deze fabriek; zie de notities.

#### Gevorderd — `eng.flow.toc` (De vijf focusstappen en drum-buffer-rope)

*Bron: de situatie (gemba walk; de poedercoatlijn is de bottleneck; de planning geeft op maandag alle orders van de week tegelijk vrij; overal karren met halffabricaten).*

> Mei. Sinds de lasersnijder een extra ploeg draait, is de poedercoatlijn de bottleneck. Sanne loopt maandagochtend een gemba walk (rondgang over de vloer) door de plaatwerkerij. Daan heeft alle orders van de week tegelijk vrijgegeven, “dan staat niemand stil”. Overal staan karren met halffabricaten (WIP). De eerste binnenstad wacht op zijn containers. Wat stelt Sanne voor?

**Slotregel:** Daan wil best minder vrijgeven, als hij maar zeker weet dat de coatlijn nooit droogvalt. Hoe groot maakt Sanne de tijdbuffer (time buffer) vóór de coatlijn, en wie houdt bij hoe vaak hij bijna leeg is?

*Bij uitrol:* “een plaatwerkbedrijf” wordt de plaatwerkerij van IJsselbak; verder niets. Het faded voorbeeld (lasrobot als bottleneck, 30 stuks per uur) kan als terugblik dienen: in het verhaal was de lasrobot de bottleneck vóór de laser en de coatlijn. Dat hoeft niet in de scène.

#### Expert — `eng.flow.throughput` (Wat een uur op de bottleneck waard is)

*Bron: de situatie (controller en plantmanager; de kantbank is de bottleneck en zit maanden vol; de controller wil product A pushen “want dat heeft de beste marge per stuk”) en de getallen uit de pre-vraag (A: €50 en 5 minuten op de bottleneck; B: €30 en 2 minuten).*

> Augustus. De kantbank (press brake) is nu de bottleneck en zit maanden vol. Inwerpzuil A brengt €50 per stuk op en vraagt 5 minuten op de kantbank; stalen kast B brengt €30 op en vraagt 2 minuten. Controller Wouter wil A pushen: “die heeft de beste marge per stuk.” Marieke wil vandaag een keuze. Sanne wil Wouter niet afvallen.

**Slotregel:** Sanne zet het op de flip-over: €10 tegen €15 per kantbankminuut. Hoe brengt ze het zó dat Wouter zijn kostprijs houdt voor de jaarrekening, en Marieke toch voor B kiest?

*Bij uitrol:* “een fabrikant van stalen trappen” wordt IJsselbak. Het faded voorbeeld noemt de lasersnijder als bottleneck; zie de notities.

### Onderwerp: OEE en verliezen

#### Basis — `eng.flow.oee` (OEE en de zes grote verliezen)

*Bron: de situatie (dagstart; de OEE van lijn 3 is gezakt van 68% naar 61%; de ploegleider zegt: “De machine is gewoon oud”).*

> Januari, de dagstart in de spuitgieterij. De OEE (overall equipment effectiveness) van lijn 3, de machine voor de 240-literbak, is deze week gezakt van 68% naar 61%. Ineke haalt haar schouders op: “De machine is gewoon oud.” Iedereen knikt. Sanne is te gast, en weet dat de gemeenten deze bak in maart nodig hebben. Wat vraagt ze?

**Slotregel:** Rachid legt de stilstand van deze week naast die van vorige week. Welke van de drie is gezakt, en wat blijft er dan over van “gewoon oud”?

*Bij uitrol:* “een voedingsmiddelenfabriek” wordt de spuitgieterij van IJsselbak; in de situatie zegt de ploegleider het, in het verhaal Ineke. Getallen gelijk.

#### Werkkennis — `eng.flow.downtime` (Stilstand registreren en de Pareto)

*Bron: de situatie (een Excel met drie maanden stilstand; 60 oorzaakcodes; “overig” is met 30% de grootste; “Zie je wel, het is overal een beetje”).*

> Februari. Rachid mailt Sanne een Excel met drie maanden stilstand (downtime) van lijn 3. Er zijn 60 oorzaakcodes (reason codes), en “overig” is met 30% de grootste. Ineke kijkt mee over haar schouder: “Zie je wel, het is overal een beetje.” Marieke wil vrijdag weten waar de tijd heen gaat. Waar begint Sanne?

**Slotregel:** Ineke en een operator van de nachtploeg brengen de codes terug naar een stuk of vijftien, in hun eigen woorden. Wat staat er over twee weken links in de Pareto?

*Bij uitrol:* “een zuivelfabriek, de afvullijn” wordt lijn 3. Het uitgewerkte voorbeeld (afvullijn, storing etiketteerder) kan blijven als los voorbeeld; zie de notities.

#### Gevorderd — `eng.flow.teep` (OEE eerlijk definiëren, en TEEP)

*Bron: de situatie (benchmark tussen twee fabrieken; Nederland meldt 78% OEE op de verpakkingslijnen, Polen 62%; de directeur wil het Poolse team een week naar Nederland sturen) en de `said`-regel (zij laten omstellen buiten de geplande tijd; met onze definitie zitten ze op 64%).*

> Juni. Het concern vergelijkt de inpaklijnen: Zutphen meldt 78% OEE, de zusterfabriek in Polen 62%. De directeur operations wil het Poolse team een week naar Zutphen halen. Marieke is trots. Sanne niet helemaal: ze weet sinds de Pareto hoe Zutphen omstellen telt. De vlucht wordt vrijdag geboekt. Wat vraagt Sanne eerst?

**Slotregel:** Rachid rekent Zutphen door met de Poolse definitie (OEE definition) en komt op 64%. Wie moet er nu eigenlijk in het vliegtuig, en wie vertelt het Marieke?

*Bij uitrol:* “Nederland” wordt Zutphen, “verpakkingslijnen” worden inpaklijnen. De `said`-regel zegt in de les niet wélke fabriek omstellen buiten laat; in het verhaal is dat Zutphen zelf. Dat buigt geen feit, maar het is een keuze om te bevestigen (zie de open vragen).

#### Expert — `eng.flow.oeecase` (Van OEE-punten naar capaciteit en geld)

*Bron: de situatie (de plantdirecteur van een kunststofverwerker wil een tweede spuitgietmachine van €350.000; de huidige machine is de bottleneck en draait op 58% OEE).*

> Juli. Marieke wil een tweede spuitgietmachine voor de 240-literbak kopen: €350.000. Lijn 3 is de bottleneck en draait op 58% OEE, nu omstellen eerlijk meetelt. Het concern beslist over twee weken. Marieke vraagt Sanne de businesscase te checken. Ineke, langs haar heen: “Geef mij eerst een snellere matrijswissel.” Wat zet Sanne naast die investering?

**Slotregel:** Sanne rekent uit wat één OEE-punt (OEE point) op lijn 3 waard is, en legt de verliesboom (loss tree) ernaast. Wat zegt ze tegen Marieke als het concern belt?

*Bij uitrol:* “een kunststofverwerker” wordt IJsselbak; “als junior consultant” vervalt of wordt “Sanne vraagt jou” (zie de open vragen). Getallen gelijk.

### Onderwerp: Omstellen en seriegrootte

#### Basis — `eng.flow.changeover` (Omstellen en SMED)

*Bron: de situatie (de planning wil grotere series omdat omstellen 2 uur duurt; verkoop klaagt over lange levertijden; het magazijn staat vol).*

> Januari. Daan wil grotere series draaien op de emmertjesmachine, “want omstellen (changeover) duurt 2 uur”. Femke klaagt dat gemeenten weken wachten op emmertjes met hun eigen opdruk. Het magazijn staat intussen tot het plafond vol, met de verkeerde. Ineke zegt: “Twee uur, dat is gewoon zo.” Sanne twijfelt. Moeten de series echt groter?

**Slotregel:** Rachid wil één omstelling filmen; Ineke kijkt bedenkelijk. Wat laat de video straks zien: intern werk (internal work), of vooral extern werk op het verkeerde moment?

*Bij uitrol:* “een verpakkingsbedrijf” wordt de emmertjesmachine van IJsselbak. Het uitgewerkte voorbeeld (spuitgieten, matrijswissel 90 minuten) past al in deze fabriek en kan lijn 3 worden; het verhaal noemt die 90 minuten niet, zodat het niet botst met de 2 uur.

#### Werkkennis — `eng.flow.smed` (Een SMED-workshop op de vloer)

*Bron: de situatie (je begeleidt je eerste SMED-workshop bij een maker van kunststof verpakkingen; de ervaren omsteller wil niet gefilmd worden).*

> Maart. Sanne begeleidt haar eerste SMED-workshop, op de emmertjesmachine. Rachid heeft de camera klaar; de omstelkar (changeover cart) bestaat nog alleen op papier. Dan zegt Ineke, 27 jaar omsteller: “Ik doe het al zo snel als het kan, en ik wil niet gefilmd worden.” Het team kijkt naar Sanne. Over tien minuten begint de matrijswissel.

**Slotregel:** Ineke zet de video zelf stil, de eerste keer dat ze een klem moet zoeken. Wie wordt eigenaar van de omstelstandaard (standard changeover sheet), en wanneer meten ze de volgende vijf omstellingen?

*Bij uitrol:* “een maker van kunststof verpakkingen” wordt IJsselbak; “de ervaren omsteller” wordt Ineke. Het uitgewerkte voorbeeld (kantbank, 48 minuten) hoort bij de plaatwerkerij; zie de notities.

#### Gevorderd — `eng.flow.batch` (De juiste seriegrootte)

*Bron: de situatie (het magazijn staat vol, maar van sommige smaken is niets; series van 5.000 dozen “want zo staat het in het systeem”) en de `said`-regel (die serie van 5.000 staat er al sinds de invoering van het ERP-systeem; de omsteltijd is sindsdien gehalveerd).*

> Juni. Het magazijn staat weer vol emmertjes, en toch heeft Femke voor twee gemeenten niets op voorraad. Daan draait elke variant in series van 5.000 dozen, “want zo staat het in het systeem”. Sinds de SMED-workshop is de omsteltijd gehalveerd. Daan wil best een kleinere seriegrootte (batch size), maar hij wil weten waarom precies.

**Slotregel:** Daan zoekt op met welke omsteltijd en welke voorraadkosten (holding cost) die 5.000 ooit is berekend. Wat wordt de nieuwe serie, en is de emmertjesmachine eigenlijk wel de bottleneck?

*Bij uitrol:* “een koekjesfabriek” en “smaken” worden de emmertjes en hun varianten (opdruk per gemeente). Getallen gelijk.

#### Expert — `eng.flow.wheel` (Productwiel en omstelvolgorde)

*Bron: het faded voorbeeld (compoundeerlijn met wit, geel en zwart; zwart naar wit 60 minuten grondig reinigen; wiel 1 kost 10 + 15 + 60 = 85 minuten per ronde) en de `said`-regel (we plannen op leverdatum, dus gaan we drie keer per week van zwart naar wit).*

> September. De compoundeerlijn (compounding line) kleurt het granulaat voor alle deksels: wit, geel en zwart. Daan plant op leverdatum, dus de lijn gaat drie keer per week van zwart naar wit: elke keer 60 minuten grondig reinigen. Ineke heeft op een stuk karton een omstelmatrix (changeover matrix) getekend. Daan vreest dat een vast wiel zijn spoedorders blokkeert.

**Slotregel:** Wit, geel, zwart kost 85 minuten omstellen per ronde. Welke spoedregel spreekt Sanne met Daan af, zodat het productwiel (product wheel) niet bij de eerste spoedorder breekt?

*Bij uitrol:* het voorbeeld past al; alleen “een compoundeerlijn” wordt “de compoundeerlijn van IJsselbak”. De situatie (verffabriek, menglijn, reinigen kost een kwart van de tijd) kan dezelfde compoundeerlijn worden; het “kwart van de tijd” blijft gelijk.

---

## 4. Drie scènes in het Engels (zo zou en lezen)

**`eng.flow.takt` (Basic)**

> January, Sanne’s first week at IJsselbak. The packing line has to ship 2,400 boxes of caddies a week: five days, one 8-hour shift, two 15-minute breaks and a 10-minute start-up meeting. The screen says one box every 52 seconds. “Plenty of room,” says the line lead. Sanne wants to work out the takt time first.

*Closing line:* Sanne gets 55 seconds: three seconds of margin. What does she say at tomorrow’s start-up meeting, when a box jams for the second time?

**`eng.flow.smed` (Working knowledge)**

> March. Sanne is running her first SMED workshop, on the caddy moulding machine. Rachid has the camera ready; the changeover cart exists only on paper. Then Ineke, a setter for 27 years, says: “I already do it as fast as I can, and I don’t want to be filmed.” The team looks at Sanne. The mould change starts in ten minutes.

*Closing line:* Ineke pauses the video herself, the first time she has to look for a clamp. Who owns the standard changeover sheet, and when do they time the next five changeovers?

**`eng.flow.throughput` (Expert)**

> August. The press brake is now the bottleneck and is full for months. Collection column A brings in €50 a part and needs 5 minutes on the press brake; steel cabinet B brings in €30 and needs 2 minutes. Controller Wouter wants to push A: “it has the best margin per part.” Marieke wants a decision today. Sanne doesn’t want to undercut Wouter.

*Closing line:* Sanne writes it on the flip chart: €10 against €15 per press-brake minute. How does she put it so that Wouter keeps his cost price for the annual accounts, and Marieke still picks B?

Opmerking voor en: “GFT-emmertje” heeft geen vast Engels woord; “kitchen caddy” (kort: caddy) is wat Britse gemeenten gebruiken. Namen blijven Nederlands, ook in en.

---

## 5. Notities

### Lessen die lastig in het verhaal passen, en waarom

1. **`eng.flow.balance`: het uitgewerkte voorbeeld.** E-bike motoren met “12 seconden kabels leggen” van station 2 naar station 3. Bij een minicontainer is er geen kabelwerk. De scène gebruikt daarom alleen de situatie (de zevende operator). Bij uitrol kan het voorbeeld een los voorbeeld blijven (“bij een andere fabriek…”), of het product wordt hernoemd. Dat laatste kan alleen als “kabels leggen” ook een andere taak mag worden, bijvoorbeeld “de chip monteren”, met dezelfde 12 seconden. Dat is een kleine inhoudelijke wijziging van een voorbeeld (geen vastgepinde vraag), dus jouw beslissing.
2. **`eng.flow.throughput`: laser of kantbank.** De situatie noemt de kantbank als bottleneck, het faded voorbeeld de lasersnijder (met dezelfde €50/5 minuten en €30/2 minuten als de pre-vraag). Het verhaal kiest de kantbank, omdat de bottleneck daar via de laser en de coatlijn terechtkomt. Bij uitrol: in het voorbeeld “lasersnijder” en “laserminuut” vervangen door “kantbank” en “kantbankminuut”. De getallen blijven gelijk; ook de `said`-regel (“hij draait op de kantbank, en die heeft ruimte”) moet dan omgedraaid of gelaten worden, want in het verhaal ís de kantbank de bottleneck. Dit is de enige les waar het verhaal botst met een `said`-regel.
3. **`eng.flow.capacity` en `eng.flow.bottleneck`: de CNC.** Beide uitgewerkte voorbeelden, en de `said`-regels over de “vijfassige freesmachine” en “de CNC is de bottleneck”, gaan over verspaning. IJsselbak heeft geen CNC. Oplossing bij uitrol: geef IJsselbak een kleine eigen matrijzenmakerij (heel gewoon bij spuitgieters) met een CNC-freesmachine. Dan passen beide voorbeelden zonder één getal te veranderen. De scènes noemen de CNC nu niet.
4. **`eng.flow.smed`: het voorbeeld is een kantbank.** De workshop in het verhaal is in de spuitgieterij (Inekes terrein), het uitgewerkte voorbeeld is een kantbank van 48 minuten met proefbuigen. “Proefbuigen” kun je niet hernoemen zonder het feit te veranderen. Twee opties: het voorbeeld wordt “de tweede workshop, op de kantbank in de plaatwerkerij” (past mooi, Sanne heeft die afdeling erbij), of het blijft los.
5. **`eng.flow.downtime`: afvullijn met etiketteerder.** Het uitgewerkte voorbeeld is een afvullijn (dranken), de scène gaat over lijn 3 (spuitgieten). Het voorbeeld kan “de containerlijn” worden: die heeft in het verhaal al een etiketteerder, en omstellen, wachten op materiaal en vastlopers komen daar ook voor. Getallen gelijk.
6. **`eng.flow.teep`: wie rekent zich rijk?** De `said`-regel zegt niet welke fabriek omstellen buiten de geplande tijd laat. Het verhaal maakt Zutphen de fabriek die zich rijk rekent, omdat dat spanning geeft voor Sanne en Marieke. Er buigt geen feit, maar het is wel de scherpste wending in het verhaal.
7. **Algemeen: “je” in de situaties.** De situaties spreken de leerling aan als “je”, vaak als junior consultant (`precedence`, `oeecase`). De scènes gaan in de derde persoon over Sanne. Voorstel: de leerling is de adviseur naast Sanne (“Sanne vraagt jou…”). Dan blijven de situaties en rubrics staan, en sluit het verhaal aan bij de Projecten-track (één consultant van intake tot afsluiting).
8. **Verschillende OEE-getallen voor lijn 3.** In januari 68% en 61%, in juli 58%. Het verhaal verklaart dat met de strengere definitie na de TEEP-les (“nu omstellen eerlijk meetelt”). Dat is een verhaalkeuze, geen lesfeit; de les zegt niets over lijn 3.

### Waar een scène later kan aansluiten bij het verhaal van een andere module

- **`pm.intake`**: Mariekes vraag “koop ik een tweede spuitgietmachine?” (`oeecase`) is precies een vraag die nog geen probleem is (`pm.intake.ask`, `pm.intake.problemstatement`). Als de Projecten-track één consultant volgt, kan IJsselbak haar eerste klant zijn, met Marieke als opdrachtgever en Wouter en Daan als stakeholders (`pm.intake.stakeholders`).
- **`eng.quality`**: in `toc` wordt 3% afkeur vóór de bottleneck uitgesorteerd; in `wheel` is een restje zwart in een wit deksel direct afkeur. Een partij grijze vlekken in witte deksels voor één gemeente is een natuurlijke opening voor `eng.quality.nonconform` en `eng.quality.eightd`.
- **`eng.moulding`** (Spuitgieten): lijn 3, de emmertjesmachine en Inekes matrijswissels zijn de vanzelfsprekende omgeving voor deze module.
- **`eng.maintenance`**: de storingen op lijn 3 en “de machine is gewoon oud” leiden naar TPM en autonoom onderhoud (`eng.maintenance.tpm`, `eng.maintenance.cilt`), met Inekes ploeg die zelf gaat schoonmaken en inspecteren.
- **`eng.improve`**: de Pareto van lijn 3 (`downtime`) is het startpunt voor een oorzaakanalyse met 5 keer waarom.
- **`eng.lines`** (Lijnen en automatisering): de 140- en 240-litercontainer op één lijn is de mixed-model lijn waar `staffing` al naar verwijst.
- **`eng.cost`** (Kostprijs en investeringen): Wouter en de kostprijs tegenover throughput (`throughput`), en de €350.000 (`oeecase`) als investeringsvoorstel.
- **`pm.negotiate`**: Sanne tegenover Wouter (`throughput`) en Daan over spoedregels (`wheel`) zijn oefenscènes voor onderhandelen en voet bij stuk houden.

### Open vragen voor Merijn

1. Is IJsselbak (afvalbakken voor gemeenten, met een plaatwerkerij) concreet genoeg, of liever de verpakkingsfabriek uit het plan? Een pure verpakkingsfabriek heeft geen lasersnijder, kantbank, lasrobot of poedercoatlijn, en vier lessen leunen daarop.
2. Is de leerling de adviseur naast Sanne (voorstel), of is de leerling Sanne zelf?
3. Mag Zutphen in `teep` de fabriek zijn die zich rijk rekent?
4. Bij uitrol per les alleen de omgeving van situaties en voorbeelden aanpassen (bedrijf, product), zoals hierboven per les beschreven? Of laten we situaties en voorbeelden helemaal staan en zet het verhaal er alleen een scène en een slotregel omheen?

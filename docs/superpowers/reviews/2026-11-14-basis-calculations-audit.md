# Basis without calculations: audit (Task 21, step 1)

Read-only audit of branch `claude/improvisation-practice-game-voon91` (origin head 5f04f24, cache v279), 14 Nov 2026. Nothing in the repo was changed. Full detail: `findings.json` next to this file (every finding with lesson id, question id, quote, group, target). Scripts that produced it are in the same folder.

**Headline.** Calculations are not an exception at Basis, they are the pattern. 137 of 176 Basis lessons contain at least one calculation (engineering 105 of 112, projects 32 of 64), and 184 of 881 pre and recall questions at Basis are numeric (type-the-number) questions. 51 of 79 Basis films narrate at least one calculation, so step 4 touches roughly half of the films, and several Basis films would lose a third to three quarters of their runtime.

## 1. How levels are encoded and what was scanned

- Level of a lesson = its position in `topics[].levels` of the module entry in `src/content/courses/index.js` (index 0 = level 1 = Basis). `placeOf()` and `tiersOf()` in `validate.js` do the same. The module-level `level` field (1 to 4) is a different thing (module tier).
- 2 subjects have lessons: `eng` (28 topics, 112 Basis lessons) and `pm` (16 topics, 64 Basis lessons). There is no separate speaking subject in `SUBJECTS` or in `src/content/courses/`; the speaking material is `src/content/prompts.*.js` and `tips.js` (not lessons, not scanned). Total 176 Basis lessons.
- Lesson parts scanned (NL file; EN mirrors it, `validate.js` already requires the same numbers in both languages for numeric questions): `teach[]` (3 to 5 paragraphs), `example` (kind `worked` is required at Basis), `said`, `pre[]` (before-teaching questions, ids `<lesson>#p<n>`), `recall[]` (practice/check questions, ids `<lesson>#r<n>`, 0-based), `situation` (ask/reveal, with model answer and rubric), `sayIt`, `terms`. Question ids in findings are 0-based as in `course.js`.
- Films: `films/<id>/build.mjs` (scenes carry `level` and `lesson`), narration in `src/content/courses/films/<id>.nl.vtt` (96 rendered films in `manifest.json`; 13 films have a build but no VTT or manifest entry yet, those are read from the beats in `build.mjs`). Scene boundaries come from `manifest.json` `nl.scenes`. A Basis scene = a scene tagged `level: 1` in the film spec (films mix levels: a film for a Basis lesson often carries Werkkennis to Expert scenes too, those are left alone).
- Good to know for steps 3 and 4: (a) `defineFilm` checks every `{n:...}` number in a film against the text of the lessons the film serves, so a film that serves only the Basis lesson cannot keep a number the Basis lesson no longer contains; (b) the batch film comment says lessons that have a film no longer show their worked example in the lesson screen, so for those lessons the calculation lives in the film and in the (hidden) `example.text`; 94 of 176 Basis lessons have a `film` field (70 of them with a calculation).

## 2. Counts

Definitions: **A** = a calculation (must move). **B** = Merijn rules (numbers as illustration, or a formula as a relationship). **C** = estimate or compare without arithmetic. "With B" counts a lesson that has any stated figure in teach/example/said or a formula-as-relationship sentence, so it is nearly every lesson and is only a size indicator; the useful B list is in section 5. Lessons counted once, however many items they have.

| Subject | Basis lessons | with A | A items (example / text / pre / recall / situation) | with B | with B only (no A) | with C |
|---|---:|---:|---|---:|---:|---:|
| eng | 112 | 105 | 247 (65 / 18 / 12 / 150 / 2) | 112 | 7 | 81 |
| pm | 64 | 32 | 48 (12 / 2 / 0 / 34 / 0) | 64 | 32 | 32 |
| total | 176 | 137 | 295 | 176 | 39 | 113 |

Lessons with no calculation at all (already fine): eng `eng.safety.loto`, `eng.safety.guarding`, `eng.safety.incidents`, `eng.itbasics.tables`, `eng.ot.levels`, `eng.ot.ownership`, `eng.switchgear.safety`; pm 32 lessons (marked "no calculation" in section 3: mostly the people, politics, communication and risk topics).

| Subject | Basis films (have a level-1 scene) | with a narrated calculation (A) | rendered, with A | not rendered, with A | intro and field films (not counted above) |
|---|---:|---:|---:|---:|---:|
| eng | 47 | 38 | 31 | 7 | 0 |
| pm | 32 | 13 | 13 | 0 | 13 module intros and field films (state figures such as "3 weeks", compute nothing) |
| total | 79 | 51 | 44 | 7 | |

Film counts are conservative: the VTT scan finds sentences that compute (gedeeld door, maal, plus ... is, "X naar Y is Z procent", spelled-out sums in the pm films). A film whose Basis scenes only state results is listed under B.

## 3. Group A findings per lesson (calculations at Basis), by subject and topic

Each line: Basis lesson, where the calculations sit (`ex` worked example, `t<i>` teach paragraph i+1 (0-based i), `p<i>` pre question, `r<i>` recall question `#r<i>`, `sit` situation), one quote, and the target Werkkennis lesson of the same topic. "L2 covers" is a text heuristic (does the Werkkennis lesson contain arithmetic and the same words or numbers): `likely` = probably already teaches it, so delete at Basis; `partly`/`no` = must gain it (check in step 3). Numeric answers: a recall question with a typed number is always A unless listed in section 5.

### Engineering (eng)

#### eng.flow

- **`eng.flow.takt`** (takt; 2 A: ex r0) quote: "Beschikbare tijd per dag: 480 − 40 = 440 minuten = 26.400 seconden. Vraag per dag: 2.400 / 5 = 480 dozen. Takt = 26.400 …" -> Werkkennis `eng.flow.balance`; L2 covers: 2 no.
- **`eng.flow.bottleneck`** (bottleneck; 3 A: ex r0 r1) quote: "Output = 3.600 / 90 = 40 stuks per uur, bepaald door de CNC. Wet van Little: 480 / 40 = 12 uur doorlooptijd." -> Werkkennis `eng.flow.capacity`; L2 covers: 2 no, 1 likely.
- **`eng.flow.oee`** (oee; 4 A: ex p0 r0 r1) quote: "Beschikbaarheid = 375 / 450 = 83,3%. Performance = 300 / 375 = 80%. Van de 600 stuks zijn er 570 goed: kwaliteit = 95%. …" -> Werkkennis `eng.flow.downtime`; L2 covers: 3 no, 1 likely.
- **`eng.flow.changeover`** (changeover; 3 A: ex r1 r2) quote: "Nieuwe omsteltijd: 5 + 30 = 35 minuten. Bij 4 omstellingen per dag levert dat 4 × 55 = 220 minuten op, of je draait 8 kl…" -> Werkkennis `eng.flow.smed`; L2 covers: 2 partly, 1 likely.
#### eng.quality

- **`eng.quality.tolerance`** (tolerances; film `eng.quality.tolerance`; 3 A: ex r0 r1) quote: "Gevonden bij de machine: 15 × €4,50 = €67,50 afkeur." -> Werkkennis `eng.quality.gauges`; L2 covers: 2 no, 1 likely.
- **`eng.quality.variation`** (capability; film `eng.quality.tolerance`; 1 A: r0) quote: "Een proces heeft een gemiddelde van 50,00 mm en een σ van 0,02 mm. Waar ligt de bovenkant van de ±3σ-spreiding, in mm? =…" -> Werkkennis `eng.quality.capability`; L2 covers: 1 likely.
- **`eng.quality.datatools`** (spc; 2 A: ex r0) quote: "In het pareto-diagram is braam 62 / 120 = 52%, braam en maat samen 87 / 120 = 73%." -> Werkkennis `eng.quality.spc`; L2 covers: 2 no.
- **`eng.quality.nonconform`** (risk; 2 A: ex r0) quote: "De machine maakt 30 delen per uur, dus 4 uur × 30 = 120 delen zijn verdacht: 85 liggen nog bij de machine, 35 staan al i…" -> Werkkennis `eng.quality.fmea`; L2 covers: 2 no.
#### eng.process

- **`eng.process.types`** (types; film `eng.process.plant`; 2 A: ex r0) quote: "Verblijftijd = 0,1 / 12 uur = 0,00833 uur = 30 seconden. Dan wordt de verblijftijd 0,1 / 18 uur = 20 seconden: precies o…" -> Werkkennis `eng.process.diagrams`; L2 covers: 1 no, 1 partly.
- **`eng.process.variables`** (control; film `eng.process.measure`; 3 A: ex r0 r1) quote: "De druk onderin = dichtheid × g (9,81 m/s², de zwaartekracht) × hoogte = 1.250 × 9,81 × 2,0 = 24.525 Pa. De meter deelt …" -> Werkkennis `eng.process.loops`; L2 covers: 3 no.
- **`eng.process.mass`** (balances; 3 A: ex r0 r1) quote: "Opbrengst aan siroop: 1.440 / 1.500 = 96%." -> Werkkennis `eng.process.energy`; L2 covers: 3 no.
- **`eng.process.batch`** (capacity; film `eng.process.batch`; 4 A: ex r0 r1 r2) quote: "Capaciteit: 3.000 kg / 5 uur = 600 kg per uur. Nieuwe cyclus: 265 minuten, dus 3.000 / 4,417 uur = 679 kg per uur: 13% m…" -> Werkkennis `eng.process.scaleup`; L2 covers: 3 no, 1 likely.
#### eng.mechanics

- **`eng.mechanics.forces`** (load; film `eng.mechanics.load`; 5 A: ex p0 r0 r1 r2) quote: "Gewicht: 50 × 9,81 = 490 N. Het moment bij de muur: 490 N × 0,4 m = 196 Nm, en de bovenste bouten vangen dat op als trek…" -> Werkkennis `eng.mechanics.stress`; L2 covers: 2 no, 1 likely, 2 partly.
- **`eng.mechanics.strength`** (strength; film `eng.mechanics.tensile`; 3 A: ex r0 r1) quote: "Veiligheidsfactor: 235 / 120 = 1,96, prima bij een rustige belasting. Overstappen op S355 geeft 355 / 240 = 1,48: hij ho…" -> Werkkennis `eng.mechanics.testing`; L2 covers: 2 no, 1 partly.
- **`eng.mechanics.fatigue`** (failure; film `eng.mechanics.fatigue`; 1 A: r0) quote: "Een as draait 1.000 toeren per minuut, 16 uur per dag. Elke omwenteling is één lastwisseling. Hoeveel lastwisselingen kr…" -> Werkkennis `eng.mechanics.fracture`; L2 covers: 1 likely.
- **`eng.mechanics.materials`** (choice; 1 A: r0) quote: "Een stalen onderdeel weegt 7,85 kg. Staal heeft een dichtheid van 7.850 kg/m³, aluminium 2.700 kg/m³. Hoeveel weegt hetz…" -> Werkkennis `eng.mechanics.heattreat` (L2 has no arithmetic yet); L2 covers: 1 no.
#### eng.maintenance

- **`eng.maintenance.strategies`** (strategy; film `eng.maintenance.failure`; 1 A: r0) quote: "Vorige maand werkte een onderhoudsteam in totaal 1.200 uur, waarvan 300 uur ongepland storingswerk. Welk percentage van …" -> Werkkennis `eng.maintenance.failure`; L2 covers: 1 no.
- **`eng.maintenance.tpm`** (tpm; film `eng.maintenance.tpm`; 1 A: r0) quote: "De storingen zakken van 9 naar 4 per maand, en elke storing kostte gemiddeld 2,5 uur. Hoeveel uur stilstand bespaar je p…" -> Werkkennis `eng.maintenance.cilt`; L2 covers: 1 no.
- **`eng.maintenance.cmms`** (planning; 4 A: ex p0 r0 r1) quote: "Zes monteurs × 40 uur = 240 uur per week. Backlog 1.150 uur, dus 1.150 / 240 = 4,8 weken." -> Werkkennis `eng.maintenance.planning`; L2 covers: 2 likely, 1 no, 1 partly.
- **`eng.maintenance.metrics`** (measure; 5 A: ex t2 p0 r0 r1) quote: "Een vulmachine, vier weken, twee ploegen van 8 uur, vijf dagen per week: 4 × 5 × 16 = 320 geplande uren. Draaitijd 320 −…" -> Werkkennis `eng.maintenance.workmix`; L2 covers: 4 no, 1 likely.
#### eng.drawings

- **`eng.drawings.views`** (draw; film `eng.drawings.reading`; 1 A: r0) quote: "Een tekening heeft schaal 1:5. Een lijn op papier meet 40 mm. Hoe lang is het echte onderdeel, in mm, als de print op sc…" -> Werkkennis `eng.drawings.assembly`; L2 covers: 1 partly.
- **`eng.drawings.dims`** (tol; 2 A: r0 r1) quote: "Een ongetolereerde maat van 45 mm op een tekening onder ISO 2768-m. Wat is de grootste toegestane maat, in mm? => 45.3 m…" -> Werkkennis `eng.drawings.gdt`; L2 covers: 1 no, 1 likely.
- **`eng.drawings.pid`** (schematics; 1 A: r0) quote: "Een tank van 20 m³ heeft zijn hoog-niveaualarm (LAH) op 80% van zijn volume. Bij welk volume gaat het alarm af, in m³? =…" -> Werkkennis `eng.drawings.plc`; L2 covers: 1 no.
- **`eng.drawings.loop`** (control; 2 A: t0 r0) quote: "De regelaar (controller) vergelijkt die met het setpoint (SP), de streefwaarde, zeg 75 °C, en berekent de regelafwijking…" -> Werkkennis `eng.drawings.pid_control`; L2 covers: 1 no, 1 likely.
#### eng.safety

- **`eng.safety.risk`** (risk; 1 A: r3) quote: "Bij de methode van Fine en Kinney is de risicoscore = waarschijnlijkheid × blootstelling × effect, elk uit een vaste tab…" -> Werkkennis `eng.safety.lmra` (L2 has no arithmetic yet); L2 covers: 1 no.
- `eng.safety.loto` (energy): no calculation.
- `eng.safety.guarding` (machine): no calculation.
- `eng.safety.incidents` (culture): no calculation.
#### eng.fluids

- **`eng.fluids.flow`** (pipes; 5 A: ex r0 r1 r2 sit) quote: "Doorsnede: 3,14 / 4 × 0,05² = 0,00196 m²; debiet 10 / 3.600 = 0,00278 m³ per seconde; snelheid 0,00278 / 0,00196 = 1,4 m…" -> Werkkennis `eng.fluids.friction`; L2 covers: 2 partly, 3 likely.
- **`eng.fluids.pumps`** (pumps; 2 A: ex r2) quote: "Hydraulisch vermogen van de pomp: 1.000 × 9,81 × (60 / 3.600) × 45 = 7,4 kW. Nodig: 1.000 × 9,81 × (60 / 3.600) × 25 = 4…" -> Werkkennis `eng.fluids.speed`; L2 covers: 2 partly.
- **`eng.fluids.transfer`** (heat; 3 A: ex r0 r1) quote: "Met zo’n 530 W per meter en zo’n 0,9 kW per afsluiter met zijn flenzen: 40 × 0,53 = 21,2 kW plus 6 × 0,9 = 5,4 kW, dus 2…" -> Werkkennis `eng.fluids.heat`; L2 covers: 2 no, 1 partly.
- **`eng.fluids.steam`** (utilities; 1 A: r0) quote: "Stoom geeft bij condenseren 2.050 kJ per kg af. Een verwarmer heeft 410 kW nodig uit condenserende stoom. Verwaarloos ve…" -> Werkkennis `eng.fluids.cooling`; L2 covers: 1 no.
#### eng.power

- **`eng.power.basics`** (electric; film `eng.power.motor`; 6 A: ex t1 p0 r0 r1 r2) quote: "Opgenomen vermogen: 11 / (0,70 × 0,92) = 17,1 kW. Energie per jaar: 17,1 × 6.000 = 102.600 kWh. Een pomp met 80% in plaa…" -> Werkkennis `eng.power.energy`; L2 covers: 2 likely, 3 no, 1 partly.
- **`eng.power.motors`** (motors; film `eng.power.motor`; 4 A: ex r0 r1 r2) quote: "Slip = (1.500 − 1.470) / 1.500 = 2%. Nominaal koppel = 30 × 9.550 / 1.470 = 195 Nm. Opgenomen vermogen: 25 / 0,90 = 27,8…" -> Werkkennis `eng.power.sizing`; L2 covers: 4 likely.
- **`eng.power.drives`** (drives; film `eng.power.drives`; 1 A: r0) quote: "Een motor heeft een nominale stroom van 50 A. Bij direct inschakelen trekt hij bij de start 7 keer zijn nominale stroom.…" -> Werkkennis `eng.power.vfd`; L2 covers: 1 likely.
- **`eng.power.air`** (fluid; film `eng.power.air`; 3 A: ex r0 r1) quote: "De lekkage is dus zo’n 40% × 10 = 4 m³ per minuut." -> Werkkennis `eng.power.hydraulics`; L2 covers: 2 likely, 1 no.
#### eng.improve

- **`eng.improve.whys`** (cause; 1 A: r0) quote: "Een lijn valt 4 keer per dienst stil door een doorgeslagen zekering, en elke stop kost 15 minuten inclusief opstarten. D…" -> Werkkennis `eng.improve.fishbone`; L2 covers: 1 partly.
- **`eng.improve.gemba`** (facts; 1 A: r0) quote: "Het rapport zegt dat 2% van de profielen gekrast is. Op de vloer tel je in één dienst 31 gekraste profielen op 900. Welk…" -> Werkkennis `eng.improve.breakdown`; L2 covers: 1 no.
- **`eng.improve.pdca`** (a3; 1 A: r0) quote: "Team A doet elke twee weken één PDCA-proef. Team B doet proeven van één dag, 4 per week. Hoeveel proeven doet team B in …" -> Werkkennis `eng.improve.a3`; L2 covers: 1 partly.
- **`eng.improve.kaizen`** (kaizen; 1 A: r0) quote: "Een kaizen-event eindigt met een 30-dagenactielijst van 16 acties. Na 30 dagen zijn er 10 af. Welk percentage staat nog …" -> Werkkennis `eng.improve.vsm`; L2 covers: 1 no.
#### eng.spc

- **`eng.spc.measerror`** (msa; 4 A: ex t3 p0 r0) quote: "Het capability-rapport toont een gemeten σ van 0,010 mm: 6σ = 0,060 mm, dus Cp = 0,06 / 0,06 = 1,00. De echte processpre…" -> Werkkennis `eng.spc.msa`; L2 covers: 2 partly, 2 likely.
- **`eng.spc.limits`** (charts; 3 A: ex r0 r1) quote: "Het gemiddelde is 598 / 10 = 59,8 HRC. De negen bewegende bereiken: 2, 1, 2, 1, 2, 1, 3, 1, 1, samen 14, dus het gemidde…" -> Werkkennis `eng.spc.charts`; L2 covers: 2 likely, 1 partly.
- **`eng.spc.capread`** (capability; 2 A: ex r0) quote: "Cpk = 0,038 / (3 × 0,010) = 1,27. Ppk = 0,038 / (3 × 0,013) = 0,97. Verwacht totaal boven de grens: 0,038 / 0,013 = 2,9σ…" -> Werkkennis `eng.spc.ppk`; L2 covers: 2 partly.
- **`eng.spc.floor`** (practice; 3 A: ex p0 r0) quote: "Alles sinds de laatste goede controle is verdacht: 4 × 960 = 3.840 stuks om tegen te houden en te sorteren." -> Werkkennis `eng.spc.tampering`; L2 covers: 1 likely, 2 partly.
#### eng.reliability

- **`eng.reliability.mechanisms`** (failure; 3 A: ex r0 r2) quote: "bij deze kogellagers gaat de levensduur met de derde macht van de belasting, dus (1 ÷ 1,25)³ = 0,51, ongeveer de helft v…" -> Werkkennis `eng.reliability.weibull`; L2 covers: 2 likely, 1 no.
- **`eng.reliability.criticality`** (risk; 1 A: r0) quote: "De vuller kost €4.000 marge per uur als hij stilstaat. Hij valt 3 keer per jaar uit en elke reparatie duurt 6 uur. Wat z…" -> Werkkennis `eng.reliability.fmeca`; L2 covers: 1 no.
- **`eng.reliability.functions`** (strategy; 3 A: ex r0 r3) quote: "De verste machine ziet dus 7,5 − 0,6 = 6,9 bar: een marge van 0,4 bar. Het team schrijft de hoofdfunctie: “Minstens 6,5 …" -> Werkkennis `eng.reliability.rcm`; L2 covers: 2 no, 1 likely.
- **`eng.reliability.mtbf`** (decide; 8 A: ex t1 t2 t3 r0 r1 r2 r3) quote: "Unituren: 120 × 2 × 6.000 = 1.440.000. Faalkans: 18 ÷ 1.440.000 = 0,0000125 per uur. MTBF = 1 ÷ 0,0000125 = 80.000 draai…" -> Werkkennis `eng.reliability.availability`; L2 covers: 1 partly, 3 likely, 4 no.
#### eng.machining

- **`eng.machining.processes`** (turning; film `eng.machining.overview`; 1 A: r0) quote: "Een gat van Ø8 mm (8 mm diameter) moet 60 mm diep. Diepte gedeeld door diameter: hoeveel keer de diameter is dat? => 7.5…" -> Werkkennis `eng.machining.cutting`; L2 covers: 1 likely.
- **`eng.machining.mill`** (milling; film `eng.machining.milling`; 1 A: r0) quote: "Een kamer wordt gefreesd met een vingerfrees van Ø10. Wat is de kleinste radius die de binnenhoeken kunnen krijgen, in m…" -> Werkkennis `eng.machining.millfeeds`; L2 covers: 1 likely.
- **`eng.machining.drill`** (drilling; film `eng.machining.drilling`; 3 A: ex t2 r0) quote: "Bij een voeding van 0,15 mm/omw, aangenomen uit de tabel van de boorleverancier, is de voedingssnelheid 0,15 × 995 = 149…" -> Werkkennis `eng.machining.holes`; L2 covers: 3 no.
- **`eng.machining.cnc`** (cnc; film `eng.machining.cnc`; 2 A: ex r0) quote: "Zonder die controle: 200 × €35 = €7.000 afkeur, en als het gat net boven een dunne bodem moet stoppen, misschien een geb…" -> Werkkennis `eng.machining.gcode`; L2 covers: 2 no.
- **`eng.machining.toolbasics`** (tooling; film `eng.machining.tooling`; 2 A: ex r0) quote: "Elke kant doet 70 stuks: €3,50 / 70 = €0,05 aan wisselplaat per stuk." -> Werkkennis `eng.machining.tools`; L2 covers: 2 likely.
- **`eng.machining.fixtures`** (workholding; film `eng.machining.workholding`; 1 A: r1) quote: "De omsteltijd gaat van 90 naar 25 minuten per omstelling, bij 8 omstellingen per week op één machine. Hoeveel uur machin…" -> Werkkennis `eng.machining.quality`; L2 covers: 1 partly.
#### eng.joining

- **`eng.joining.arc`** (arc; film `eng.joining.arc`; 2 A: ex r0) quote: "Booglasenergie = 24 × 220 × 60 / (400 × 1.000) = 0,79 kJ/mm." -> Werkkennis `eng.joining.weldparams`; L2 covers: 2 likely.
- **`eng.joining.spot`** (spot; film `eng.joining.spot`; 3 A: ex r0 r1) quote: "Een tang last twee verzinkte platen van 1,2 mm op 9,5 kA, 300 ms en 3 kN, met een kapvlak van Ø6 mm (6 mm doorsnede): ee…" -> Werkkennis `eng.joining.spotwear`; L2 covers: 2 no, 1 partly.
- **`eng.joining.defects`** (defects; film `eng.joining.defects`; 1 A: r0) quote: "De lasmethode schrijft een lassnelheid van 300 mm per minuut voor; de lasser last op 405 mm per minuut, met dezelfde vol…" -> Werkkennis `eng.joining.inspection`; L2 covers: 1 no.
- **`eng.joining.bolts`** (bolting; film `eng.joining.bolting`; 5 A: ex t1 t2 p0 r0) quote: "8.8: vloeigrens 640 MPa, dus 640 × 84,3 = 53.950 N, zo’n 54 kN. 10.9: vloeigrens 900 MPa, dus 900 × 84,3 = 75.870 N, zo’…" -> Werkkennis `eng.joining.bolting`; L2 covers: 1 no, 4 likely.
- **`eng.joining.bonding`** (bonding; film `eng.joining.bonding`; 1 A: r0) quote: "Een overlappende lijmverbinding (twee strips over elkaar) heeft een overlap van 25 mm × 20 mm. De afschuifsterkte van de…" -> Werkkennis `eng.joining.adhesives`; L2 covers: 1 likely.
- **`eng.joining.weldcell`** (production; film `eng.joining.production`; 3 A: ex r0 r1) quote: "Met één station wacht de robot tijdens het laden: 6 + 4 = 10 minuten per frame, dus 6 frames per uur. Met twee stations …" -> Werkkennis `eng.joining.fixturing`; L2 covers: 1 no, 1 likely, 1 partly.
#### eng.moulding

- **`eng.moulding.machine`** (machine; film `eng.moulding.machine`; 2 A: ex r0) quote: "Een behuizing heeft een geprojecteerd oppervlak van 15 × 20 cm = 300 cm². Het is ABS, een stijve kunststof voor behuizin…" -> Werkkennis `eng.moulding.screw`; L2 covers: 1 likely, 1 no.
- **`eng.moulding.cycle`** (cycle; film `eng.moulding.cycle`; 4 A: ex t2 r0 r1) quote: "Een 2-voudige matrijs voor een flessendop loopt op 20 seconden: 3.600 / 20 × 2 = 360 doppen per uur. Koeltijd schaalt me…" -> Werkkennis `eng.moulding.cooling`; L2 covers: 4 likely.
- **`eng.moulding.materials`** (materials; film `eng.moulding.materials`; 2 A: ex r0) quote: "De droogtijd is 4 uur, dus de droger moet minstens 4 × 12 = 48 kg bevatten om continu droog materiaal te leveren: net ge…" -> Werkkennis `eng.moulding.polymers`; L2 covers: 2 no.
- **`eng.moulding.defects`** (defects; film `eng.moulding.defects`; 1 A: r0) quote: "Een product met een geprojecteerd oppervlak van 400 cm² vraagt 0,5 ton sluitkracht per cm². Het draait op een pers van 1…" -> Werkkennis `eng.moulding.diagnose`; L2 covers: 1 partly.
- **`eng.moulding.setup`** (setting; film `eng.moulding.setting`; 2 A: ex r0) quote: "Op 12 mm schakelt hij over naar druk, dus hij legt 60 − 12 = 48 mm af op snelheid. Bij 80 mm/s duurt dat 48 / 80 = 0,6 s…" -> Werkkennis `eng.moulding.process`; L2 covers: 1 partly, 1 likely.
- **`eng.moulding.tooling`** (moulds; film `eng.moulding.moulds`; 2 A: ex r0) quote: "Een SMED-project brengt ze naar 30 minuten: 40 × 1 uur = 40 uur per week bespaard. Terugverdientijd: €55.000 / €2.400 ≈ …" -> Werkkennis `eng.moulding.mouldparts`; L2 covers: 2 no.
#### eng.lines

- **`eng.lines.linebasics`** (design; film `eng.lines.design`; 5 A: ex t2 p0 r0 r2) quote: "Takt: 7 × 3.600 = 25.200 seconden / 420 = 60 seconden per pomp. De lijn maakt 25.200 / 65 = 387 pompen per dienst, 33 te…" -> Werkkennis `eng.lines.layout`; L2 covers: 1 partly, 4 likely.
- **`eng.lines.robotbasics`** (robots; film `eng.lines.robots`; 2 A: ex r0) quote: "De beweging duurt minstens 1.500 / 250 = 6 seconden, en in de praktijk langer, want de insteller verplaatst in kleine st…" -> Werkkennis `eng.lines.robots`; L2 covers: 1 partly, 1 likely.
- **`eng.lines.errors`** (errorproof; film `eng.lines.errorproof`; 2 A: ex r0) quote: "Ongeveer 1 op de 5.000 kachels krijgt de verkeerde: 1.000.000 / 5.000 = 200 ppm." -> Werkkennis `eng.lines.pokayoke`; L2 covers: 1 no, 1 likely.
- **`eng.lines.variants`** (variants; film `eng.lines.variants`; 3 A: ex r0 r3) quote: "Nu wisselt hij 4 keer per dienst van kleur, en elke keer omstellen duurt 20 minuten: 4 × 20 = 80 minuten zonder output. …" -> Werkkennis `eng.lines.linechange`; L2 covers: 2 partly, 1 likely.
- **`eng.lines.plc`** (control; film `eng.lines.control`; 1 A: r0) quote: "Een PLC heeft een scancyclus van 20 milliseconden. Hoe vaak per seconde leest hij zijn ingangen? => 50 keer (1.000 ms / …" -> Werkkennis `eng.lines.safety` (L2 has no arithmetic yet); L2 covers: 1 no.
- **`eng.lines.autobasics`** (business; 3 A: ex r0 r1) quote: "Arbeid: 2 × € 55.000 = € 110.000 per jaar. Volume: 400 × 2 × 220 = 176.000 dozen per jaar, allemaal gelijk. Ergonomie: 4…" -> Werkkennis `eng.lines.payback`; L2 covers: 1 no, 1 likely, 1 partly.
#### eng.cost

- **`eng.cost.costprice`** (costprice; 5 A: ex t2 p0 r0 r1) quote: "Machinetijd: 3,0 minuut tegen €80 per uur = €4,00. Omstellen: €80 / 50 = €1,60. Met 3% late afkeur: €8,00 / 0,97 = €8,25…" -> Werkkennis `eng.cost.hourrate`; L2 covers: 5 no.
- **`eng.cost.contribution`** (decisions; 4 A: ex r0 r1 r2) quote: "Variabele kosten = 0,045 + 0,015 + 0,010 = €0,070. Dekkingsbijdrage = €0,090 − €0,070 = €0,020 per dop, €4.000 voor de o…" -> Werkkennis `eng.cost.makebuy`; L2 covers: 3 likely, 1 partly.
- **`eng.cost.cashflow`** (invest; 3 A: ex r0 r1) quote: "Na vier jaar is het geld terug (4 × 30.000 = 120.000). Over de hele 10 jaar komen beide op dezelfde €180.000 uit (10 × 3…" -> Werkkennis `eng.cost.capex`; L2 covers: 2 no, 1 partly.
- **`eng.cost.inventory`** (lean; 3 A: ex r0 r1) quote: "De controller telt de vermogenskosten, 8% × €700.000 = €56.000 per jaar, als jaarlijkse besparing." -> Werkkennis `eng.cost.waste`; L2 covers: 1 partly, 2 no.
#### eng.itbasics

- **`eng.itbasics.ipaddress`** (network; 1 A: r0) quote: "Een subnet is 192.168.10.0/24. Hoeveel adressen zijn er bruikbaar voor apparaten? => 254 adressen (Bij /24 varieert alle…" -> Werkkennis `eng.itbasics.vlan` (L2 has no arithmetic yet); L2 covers: 1 no.
- **`eng.itbasics.server`** (cloud; 1 A: r2) quote: "Twaalf VM’s draaien gelijk verdeeld over drie fysieke servers. Eén server valt uit en er is niets ingesteld om VM’s auto…" -> Werkkennis `eng.itbasics.saas`; L2 covers: 1 no.
- `eng.itbasics.tables` (data): no calculation.
- **`eng.itbasics.clientserver`** (software; 1 A: r2) quote: "Een fabriek heeft twee MES-servers. Server A bedient lijn 1 tot en met 3, met 8 terminals per lijn; server B bedient lij…" -> Werkkennis `eng.itbasics.api`; L2 covers: 1 no.
#### eng.ot

- `eng.ot.levels` (levels): no calculation.
- **`eng.ot.systems`** (stack; film `eng.ot.isa95`; 2 A: ex r0) quote: "Stap 1: het ERP maakt de productieorder en rekent het materiaal uit: 2.000 × 25 g = 50 kg granulaat." -> Werkkennis `eng.ot.orderflow`; L2 covers: 2 likely.
- **`eng.ot.historian`** (protocols; 3 A: ex t2 r0) quote: "Stap 1: waarden per dag zonder filter: 400 × 86.400 = 34,56 miljoen." -> Werkkennis `eng.ot.opcua` (L2 has no arithmetic yet); L2 covers: 3 no.
- `eng.ot.ownership` (convergence): no calculation.
#### eng.cyber

- **`eng.cyber.cia`** (basics; 1 A: r1) quote: "Een uur stilstand kost €25.000. Een ransomware-aanval zou de fabriek 3 volle dagen (24 uur per dag) stilleggen. De kans …" -> Werkkennis `eng.cyber.phishing`; L2 covers: 1 no.
- **`eng.cyber.iec62443`** (ot; 1 A: r2) quote: "Een lijn uit 2012 heeft HMI’s op Windows 7. De gratis ondersteuning van Windows 7 stopte in januari 2020. De lijn moet n…" -> Werkkennis `eng.cyber.zones`; L2 covers: 1 no.
- **`eng.cyber.nis2`** (rules; 1 A: r1) quote: "De Europese deadline voor het omzetten van NIS2 was 17 oktober 2024. De Nederlandse wet trad in werking op 15 augustus 2…" -> Werkkennis `eng.cyber.scope`; L2 covers: 1 no.
- **`eng.cyber.ircycle`** (response; 1 A: r2) quote: "Zolang ransomware niet ontdekt wordt, raakt hij gemiddeld 15 extra pc’s per uur. Herstel kost 3 uur werk per pc. Hoeveel…" -> Werkkennis `eng.cyber.prepare`; L2 covers: 1 no.
#### eng.industry40

- **`eng.industry40.dimensions`** (quality; 2 A: ex r0) quote: "Stap 1, volledigheid: 180 stops hebben geen reden, dus 1.020 van 1.200 = 85% is volledig." -> Werkkennis `eng.industry40.machinedata`; L2 covers: 1 likely, 1 no.
- **`eng.industry40.kpi`** (dashboards; 1 A: r0) quote: "Het afkeurpercentage op vijf dagen met gelijke productie was 1,2%, 1,8%, 1,5%, 2,4% en 1,6%. Wat was het afkeurpercentag…" -> Werkkennis `eng.industry40.powerbi`; L2 covers: 1 no.
- **`eng.industry40.stack`** (integration; 1 A: r0) quote: "De PLC telde vorige week 10.400 cycli; in ERP staan 10.000 stuks geboekt. Welk percentage van de PLC-cycli komt niet ter…" -> Werkkennis `eng.industry40.pipeline`; L2 covers: 1 no.
- **`eng.industry40.ml`** (ai; 1 A: r0) quote: "Je hebt 2.400 batchrecords en houdt 20% apart als testset. Op hoeveel records traint het model? => 1920 records (20% van…" -> Werkkennis `eng.industry40.predictive`; L2 covers: 1 no.
#### eng.gridbasics

- **`eng.gridbasics.basics`** (power; film `eng.gridbasics.load`; 7 A: ex t0 t1 t4 p0 r0 r1) quote: "Een gezin in Den Bosch verbruikt 2.700 kWh per jaar: gemiddeld 2.700 / 8.760 ≈ 0,31 kW." -> Werkkennis `eng.gridbasics.load`; L2 covers: 4 no, 1 partly, 2 likely.
- **`eng.gridbasics.levels`** (grid; film `eng.gridbasics.path`; 2 A: ex r0) quote: "Op 10 kV zou dat een stroom vragen van ruwweg 100.000.000 / (1,73 × 10.000) ≈ 5.800 A, veel te veel voor een normale kab…" -> Werkkennis `eng.gridbasics.path`; L2 covers: 2 no.
- **`eng.gridbasics.roles`** (rules; film `eng.gridbasics.congestion`; 2 A: ex r0) quote: "Gemiddeld per klant: 70.000.000 / 2.800.000 = 25 minuten. Eén grote MS-storing waarbij 3.000 klanten 90 minuten zonder s…" -> Werkkennis `eng.gridbasics.law` (L2 has no arithmetic yet); L2 covers: 2 no.
- **`eng.gridbasics.congestion`** (congestion; film `eng.gridbasics.congestion`; 1 A: r0) quote: "Een onderstation is 150 uur per jaar overbelast. Welk percentage van de 8.760 uur in een jaar is dat, afgerond op één de…" -> Werkkennis `eng.gridbasics.scarcity`; L2 covers: 1 partly.
#### eng.transformers

- **`eng.transformers.principle`** (transformer; film `eng.transformers.principle`; 5 A: t3 p0 r0 r1 r3) quote: "Zo is de wikkelverhouding per spoel 10.000 / 230 ≈ 43, niet 25." -> Werkkennis `eng.transformers.station`; L2 covers: 1 no, 2 likely, 2 partly.
- **`eng.transformers.ageing`** (condition; 1 A: r0) quote: "Een transformator draait 12 °C boven de ontwerp-hotspottemperatuur. Hoeveel keer sneller veroudert hij volgens de vuistr…" -> Werkkennis `eng.transformers.loading`; L2 covers: 1 likely.
- **`eng.transformers.cables`** (cables; 1 A: r0) quote: "Een kabeltracé is 3 km en de kabel komt op haspels van 500 m. Hoeveel moffen zijn er nodig tussen de lengtes (de eindslu…" -> Werkkennis `eng.transformers.faults`; L2 covers: 1 no.
- **`eng.transformers.connections`** (supply; 2 A: ex r0) quote: "Totaal: 2 + 1 + 3 + 8 + 4 = 18 weken, voor 2 dagen werk in de straat." -> Werkkennis `eng.transformers.standard`; L2 covers: 2 no.
#### eng.switchgear

- **`eng.switchgear.devices`** (devices; film `eng.switchgear.devices`; 1 A: r0) quote: "Een 10 kV-net heeft een kortsluitvermogen van 300 MVA. Wat is de driefasige kortsluitstroom, in kA? (I = S / (1,73 × U))…" -> Werkkennis `eng.switchgear.ratings`; L2 covers: 1 likely.
- **`eng.switchgear.installations`** (stations; film `eng.switchgear.devices`; 2 A: ex r0) quote: "Lekt er 0,1% per jaar, dan is dat 30 kg, gelijk aan zo’n 30 × 23.500 = 705.000 kg, ruwweg 700 ton CO2-equivalent per jaa…" -> Werkkennis `eng.switchgear.automation`; L2 covers: 2 no.
- **`eng.switchgear.protection`** (protection; film `eng.switchgear.protection`; 2 A: ex r0) quote: "De engineer zet de eerste trap op 450 A, 1,5 keer de maximale belasting, met 0,5 s vertraging: aan de relaiskant is dat …" -> Werkkennis `eng.switchgear.selectivity`; L2 covers: 2 no.
- `eng.switchgear.safety` (switching): no calculation.
#### eng.gridops

- **`eng.gridops.request`** (connect; 2 A: ex r0) quote: "Uiterste termijn: 52 + 16 = 68 weken, ruim een jaar en een kwart." -> Werkkennis `eng.gridops.chain`; L2 covers: 2 partly.
- **`eng.gridops.workload`** (field; 2 A: ex r0) quote: "Capaciteit: 120 × 1.300 = 156.000 uur. Tekort: 210.000 − 156.000 = 54.000 uur, zo’n 26% van de vraag." -> Werkkennis `eng.gridops.switching`; L2 covers: 2 partly.
- **`eng.gridops.outage`** (outage; film `eng.gridops.outage`; 1 A: r0) quote: "Een netbeheerder heeft 100.000 klanten. In een jaar kwamen de onderbrekingen samen op 1.600.000 klantminuten (getroffen …" -> Werkkennis `eng.gridops.control`; L2 covers: 1 partly.
- **`eng.gridops.cmbasics`** (congestion; 2 A: ex r0) quote: "Kosten voor de netbeheerder: 3 MW × 2 uur = 6 MWh, × € 80 = € 480." -> Werkkennis `eng.gridops.cmstudy`; L2 covers: 1 partly, 1 likely.
#### eng.gridplanning

- **`eng.gridplanning.demand`** (load; 4 A: ex r0 r1 sit) quote: "Basisverbruik: 1,5 kVA per woning na gelijktijdigheid, dus 120 × 1,5 = 180 kVA. Elke woning krijgt een warmtepomp van 3 …" -> Werkkennis `eng.gridplanning.loadflow`; L2 covers: 1 no, 2 likely, 1 partly.
- **`eng.gridplanning.criteria`** (design; 3 A: ex r0 r1) quote: "De woningen krijgen warmtepompen, dus de planner rekent 3,5 kVA per woning na gelijktijdigheid: 40 × 3,5 = 140 kVA. Ther…" -> Werkkennis `eng.gridplanning.structures`; L2 covers: 3 no.
- **`eng.gridplanning.plan`** (invest; 2 A: ex r0) quote: "In tien jaar: 9 × 10 = 90 knelpunten opgelost, dus 120 − 90 = 30 niet op tijd: een kwart. Het programma kost zo’n 120 × …" -> Werkkennis `eng.gridplanning.investment`; L2 covers: 1 no, 1 partly.
- **`eng.gridplanning.alternatives`** (flex; 3 A: ex r0 r1) quote: "Los en vast aangesloten: 4 + 10 + 6 = 20 MW, veel te veel. Stap 1, aftoppen: het zonnepark op 70%, dus 0,7 × 10 = 7 MW. …" -> Werkkennis `eng.gridplanning.flex`; L2 covers: 2 likely, 1 partly.
### Projects (pm)

#### pm.intake

- `pm.intake.ask` (problem): no calculation.
- `pm.intake.stakeholders` (people): no calculation.
- **`pm.intake.done`** (scope; film `pm.plan.wbs`; 1 A: r2) quote: "De afkeur is 3,2% van een weekoutput van 75.000 kg. Het doel is 2,0% van diezelfde weekoutput. Hoeveel kg afkeur per wee…" -> Werkkennis `pm.intake.charter`; L2 covers: 1 no.
- **`pm.intake.value`** (case; 3 A: ex r0 r2) quote: "Bij een verpakkingsfabriek kost een omstelproject eenmalig €45.000: consultant €30.000, snelwisselgereedschap (quick-cha…" -> Werkkennis `pm.intake.proposal`; L2 covers: 2 no, 1 partly.
#### pm.plan

- `pm.plan.wbs` (breakdown): no calculation.
- **`pm.plan.schedule`** (schedule; film `pm.plan.schedule`; 2 A: ex r0) quote: "Keten A-B-D-E = 3 + 4 + 2 + 6 = 15 weken. Keten A-C-E = 3 + 6 + 6 = 15 weken." -> Werkkennis `pm.plan.method` (L2 has no arithmetic yet); L2 covers: 2 no.
- **`pm.plan.estimate`** (estimate; film `pm.plan.wbs`; 4 A: ex t0 r0 r1) quote: "Driepunts: (2 + 4 × 3 + 10) / 6 = 4 dagen werk." -> Werkkennis `pm.plan.techniques`; L2 covers: 1 likely, 2 no, 1 partly.
- `pm.plan.risk` (resources): no calculation.
#### pm.run

- `pm.run.status` (steer): no calculation.
- **`pm.run.scope`** (scope; film `pm.run.scope`; 1 A: r0) quote: "Een project heeft 40 dagen budget. Er komen vijf kleine verzoeken van elk 2 dagen bij. Met hoeveel procent van de oorspr…" -> Werkkennis `pm.run.change`; L2 covers: 1 likely.
- `pm.run.rhythm` (team): no calculation.
- **`pm.run.issues`** (issues; 1 A: r2) quote: "Er staan 20 issues open, waarvan 5 over hun datum zijn. Welk percentage van de open issues is over de datum? => 25 % (5 …" -> Werkkennis `pm.run.decisions` (L2 has no arithmetic yet); L2 covers: 1 no.
#### pm.land

- `pm.land.training` (standard): no calculation.
- `pm.land.change` (handover): no calculation.
- **`pm.land.sustain`** (sustain; film `pm.land.handover`; 1 A: r0) quote: "De leverbetrouwbaarheid ging van 72% naar 90% en zakte daarna naar 81%. Welk percentage van de verbetering (de stijging …" -> Werkkennis `pm.land.lsw`; L2 covers: 1 no.
- **`pm.land.benefits`** (benefits; 2 A: ex r0) quote: "Reken de verwachte baat uit als het doel gehaald wordt: 4,0% − 2,5% = 1,5 procentpunt. 1,5% van 6.000.000 = 90.000 verpa…" -> Werkkennis `pm.land.savings`; L2 covers: 2 no.
#### pm.close

- **`pm.close.results`** (proof; film `pm.close.results`; 1 A: r0) quote: "Een lijn is gepland op 5.000 uur per jaar. De stilstand, als deel van die uren, daalt met 4 procentpunt. De lijn is uitv…" -> Werkkennis `pm.close.runchart`; L2 covers: 1 no.
- `pm.close.acceptance` (closure): no calculation.
- `pm.close.retro` (learn): no calculation.
- `pm.close.report` (client): no calculation.
#### pm.stuck

- `pm.stuck.diagnose` (diagnose): no calculation.
- `pm.stuck.buytime` (unknown): no calculation.
- `pm.stuck.blocker` (politics): no calculation.
- **`pm.stuck.sponsor`** (restart; 1 A: r0) quote: "Je plant een sponsorgesprek van 20 minuten, elke twee weken, in een project van 16 weken. Hoeveel minuten sponsortijd vr…" -> Werkkennis `pm.stuck.smallwins`; L2 covers: 1 partly.
#### pm.lead

- `pm.lead.power` (influence): no calculation.
- `pm.lead.feedback` (feedback): no calculation.
- `pm.lead.listen` (coaching): no calculation.
- `pm.lead.self` (teams): no calculation.
#### pm.perform

- **`pm.perform.kpis`** (indicators; film `pm.perform.tree`; 1 A: r3) quote: "Een ploeg bij een netbeheerder plande 240 klussen voor één week, allemaal vastgelegd op de maandag van die week. Op vrij…" -> Werkkennis `pm.perform.tree`; L2 covers: 1 partly.
- **`pm.perform.smart`** (targets; 1 A: r2) quote: "De uitval op een perslijn is 4,0% van de gemaakte stuks. De streefwaarde is 3,0% eind juni. De lijn maakt 50.000 stuks p…" -> Werkkennis `pm.perform.targets`; L2 covers: 1 likely.
- **`pm.perform.dialogue`** (behaviour; film `pm.lead.feedback`; 1 A: r3) quote: "Vorige week stonden er 40 klussen gepland en startten er 30 op de geplande dag. Van de 10 klussen die dat niet deden, we…" -> Werkkennis `pm.perform.gaming`; L2 covers: 1 no.
- **`pm.perform.board`** (rhythm; 2 A: ex r0) quote: "Zonder pauze in het uur van 7:00 tot 8:00 is het plan 60 / 1,5 = 40 eenheden. Van 9:00 tot 10:00 is er een pauze van 15 …" -> Werkkennis `pm.perform.rhythm`; L2 covers: 1 likely, 1 partly.
#### pm.negotiate

- `pm.negotiate.interests` (prepare): no calculation.
- **`pm.negotiate.anchor`** (trade; film `pm.negotiate.batna`; 1 A: r3) quote: "Een ondersteuningscontract van 52 weken kost in totaal €31.200. Je wilt het per week framen. Hoeveel is dat, in euro per…" -> Werkkennis `pm.negotiate.concede`; L2 covers: 1 partly.
- **`pm.negotiate.scope`** (clients; film `pm.run.scope`; 1 A: r0) quote: "Een project tegen vaste prijs was gepland op 20 dagen werk. De klant voegde 5 extra verzoeken van elk 1 dag toe, en jij …" -> Werkkennis `pm.negotiate.price`; L2 covers: 1 no.
- `pm.negotiate.no` (ground): no calculation.
#### pm.outside

- `pm.outside.director` (mindset): no calculation.
- `pm.outside.phasequestions` (questions): no calculation.
- `pm.outside.trust` (experts): no calculation.
- `pm.outside.progress` (steer): no calculation.
#### pm.portfolio

- **`pm.portfolio.programme`** (programmes; film `pm.portfolio.prioritise`; 2 A: t1 r2) quote: "De rekensom is hard: vier onafhankelijke projecten die elk 90% kans hebben om op tijd te leveren, halen het samen maar i…" -> Werkkennis `pm.portfolio.msp`; L2 covers: 1 no, 1 partly.
- **`pm.portfolio.prioritise`** (priorities; film `pm.portfolio.prioritise`; 1 A: r0) quote: "Een project is € 120k per jaar waard en heeft 40 dagen van je schaarse engineers nodig. Wat is de waarde per schaarse da…" -> Werkkennis `pm.portfolio.capacity`; L2 covers: 1 likely.
- `pm.portfolio.governance` (governance): no calculation.
- **`pm.portfolio.benefits`** (benefits; film `pm.portfolio.benefits`; 1 A: r1) quote: "Een project bespaart 1.200 ploegdagen per jaar tegen € 750 per ploegdag. Wat zijn de jaarlijkse baten, in duizenden euro…" -> Werkkennis `pm.portfolio.benefitsmap`; L2 covers: 1 likely.
#### pm.consult

- **`pm.consult.proposal`** (offer; film `pm.consult.proposal`; 1 A: r0) quote: "Je diagnose in fase 1 is 12 adviesdagen tegen een dagtarief van € 1.200. Wat is het bedrag, in euro’s? => 14400 € (12 × …" -> Werkkennis `pm.consult.pricing`; L2 covers: 1 partly.
- `pm.consult.trust` (advisor): no calculation.
- `pm.consult.independence` (ethics): no calculation.
- `pm.consult.account` (grow): no calculation.
#### pm.agile

- **`pm.agile.whyagile`** (mindset; 2 A: ex r0) quote: "In 34 weken passen 34 / 2 = 17 iteraties, dus 17 momenten om bij te sturen in plaats van één." -> Werkkennis `pm.agile.principles` (L2 has no arithmetic yet); L2 covers: 2 no.
- `pm.agile.scrumbasics` (scrum): no calculation.
- `pm.agile.stories` (backlog): no calculation.
- `pm.agile.board` (kanban): no calculation.
#### pm.scaled

- **`pm.scaled.why`** (safe; film `pm.scaled.pi`; 2 A: ex r0) quote: "Aantal teams: 72 / 9 = 8 teams. Met iteraties van 2 weken zijn dat 10 / 2 = 5 iteraties: 4 om te bouwen en 1 IP-iteratie…" -> Werkkennis `pm.scaled.piplanning`; L2 covers: 1 likely, 1 partly.
- **`pm.scaled.lpm`** (portfolio; 1 A: r0) quote: "Een idee wordt in maart ingediend. De jaarronde beslist in oktober, en het team start drie maanden daarna. Hoeveel maand…" -> Werkkennis `pm.scaled.epics`; L2 covers: 1 partly.
- **`pm.scaled.less`** (alternatives; 2 A: ex r0) quote: "Teams in LeSS: 40 / 8 = 5 teams van 8. Overall Retrospective bij sprints van 2 weken: hooguit 2 × 45 = 90 minuten." -> Werkkennis `pm.scaled.nexus`; L2 covers: 1 partly, 1 no.
- **`pm.scaled.stagegate`** (hybrid; film `pm.scaled.hybrid`; 2 A: ex r0) quote: "In CAD, tijdens het ontwerpen: 4 uur engineering à 90 euro = 360 euro. Met sprints van 2 weken zijn dat 26 / 2 = 13 spri…" -> Werkkennis `pm.scaled.longlead`; L2 covers: 2 partly.
#### pm.devops

- **`pm.devops.pipeline`** (pipeline; film `pm.devops.pipeline`; 1 A: r0) quote: "Een pipeline heeft een build van 3 minuten, tests van 8 minuten en installatie op de testomgeving van 4 minuten. Hoeveel…" -> Werkkennis `pm.devops.tests`; L2 covers: 1 likely.
- **`pm.devops.fourkeys`** (dora; film `pm.devops.pipeline`; 2 A: ex r0) quote: "Deployfrequentie: 8 deploys in 4 weken, dus 8 / 4 = 2 per week. 2 / 8 = 25%." -> Werkkennis `pm.devops.measure`; L2 covers: 2 likely.
- `pm.devops.environments` (release): no calculation.
- **`pm.devops.incident`** (itsm; film `pm.devops.incident`; 1 A: r0) quote: "Een printer valt elke week één keer uit, het hele jaar door (52 weken). Hoeveel incidenten zijn dat per jaar? => 52 inci…" -> Werkkennis `pm.devops.sla`; L2 covers: 1 partly.
#### pm.itproject

- **`pm.itproject.requirements`** (scope; film `pm.itproject.mvp`; 1 A: r0) quote: "Een workshop levert 300 wensen op. 75 zijn dubbel. Van de rest hoort 20% bij geen enkele stap in het to-be-proces en gaa…" -> Werkkennis `pm.itproject.mvp`; L2 covers: 1 likely.
- **`pm.itproject.saas`** (vendor; 2 A: ex r0) quote: "Het abonnement: 120 gebruikers × € 95 per gebruiker per maand = € 11.400 per maand, dus € 136.800 per jaar." -> Werkkennis `pm.itproject.selection`; L2 covers: 1 no, 1 partly.
- **`pm.itproject.rollout`** (golive; film `pm.itproject.migration`; 1 A: r0) quote: "Fabrieken A, B en C maken 20%, 35% en 45% van het volume. A gaat als pilot eerst live. Welk percentage van het volume st…" -> Werkkennis `pm.itproject.migration`; L2 covers: 1 no.
- **`pm.itproject.uat`** (adoption; film `pm.itproject.uat`; 2 A: ex r0) quote: "120 × 1,5 = 180 uur voor de eerste ronde. 8 × 18 = 144 uur per week. Tijd: 180 / 144 = 1,25 week." -> Werkkennis `pm.itproject.defects`; L2 covers: 1 likely, 1 partly.

### Where the Werkkennis lesson is the problem

9 Basis lessons with calculations have a Werkkennis lesson with **no arithmetic at all** (no numeric question, no computed example), so the calculation cannot simply be deleted at Basis; Werkkennis must gain a worked example plus questions: `eng.mechanics.materials`, `eng.safety.risk`, `eng.lines.plc`, `eng.itbasics.ipaddress`, `eng.ot.historian`, `eng.gridbasics.roles`, `pm.plan.schedule`, `pm.run.issues`, `pm.agile.whyagile`.

Across all 295 A items: Werkkennis covers it likely 91, partly 66, not 138. Treat "likely" as a hint only: Basis and Werkkennis usually use different numbers, and step 3 has to reread both anyway. Many Werkkennis lessons already teach the same formula (OEE, takt, MTBF, SMED...), but the volume of net-new work is large: 138 A items have no matching content at Werkkennis.

## 4. Films: Basis scenes that narrate a calculation

Time = start of the VTT cue (NL). Scene = position in the film (1-based) and scene id from `build.mjs`. "Basis s." = scenes tagged level 1; "calc s." = Basis scenes containing a calculation; "share" = runtime of calc scenes as % of the Basis runtime. Target = Werkkennis lesson of the same topic and the film field of that lesson (most Werkkennis lessons have no film).

| Film | Lesson(s) at Basis | Basis s. | calc s. | share | calc cues (NL, time) | Werkkennis target (film) |
|---|---|---:|---:|---:|---|---|
| `eng.machining.drilling` | `machining.drill` | 2 | 2 | 100% | 0:31: "In zacht staal loopt een snelstalen boor van 8 millimeter zo’n 25 mete…"<br>0:36: "Dat is 995 toeren."<br>0:55: "20 millimeter diep kost zo’n 8 seconden." | `eng.machining.holes` (eng.machining.drilling) |
| `eng.gridbasics.load` | `gridbasics.basics` | 4 | 3 | 74% | 0:32: "Een waterkoker van 2.000 watt trekt op 230 volt dus zo’n 8,7 ampère."<br>0:48: "dan is dat 2 kilowatt maal 0,05 uur: 0,1 kilowattuur."<br>0:58: "Over de 8.760 uur van een jaar is dat gemiddeld maar 0,31 kilowatt."<br>(+2 more) | `eng.gridbasics.load` (eng.gridbasics.load) |
| `pm.portfolio.prioritise` | `portfolio.programme` `portfolio.prioritise` | 6 | 4 | 70% | 0:41: "op tijd halen het samen maar in 66 procent."<br>2:05: "300 duizend bij 50 procent vertrouwen telt als 150 duizend."<br>2:11: "Tel de schaarse mensen: twee experts met elk 120 dagen geven 240."<br>(+2 more) | `pm.portfolio.msp` `pm.portfolio.capacity` (pm.portfolio.prioritise) |
| `eng.process.measure` | `process.variables` | 7 | 4 | 62% | 0:42: "Wijst de manometer 2 bar aan, dan is de absolute druk dus ongeveer 3 b…"<br>1:27: "Een siroop van 1.250 kilo per kubieke meter geeft 1.250 kilo per uur."<br>3:11: "De druk onderin is de dichtheid maal de zwaartekracht maal de hoogte: …"<br>(+2 more) | `eng.process.loops` (no film) |
| `eng.power.motor` | `power.basics` `power.motors` | 9 | 5 | 60% | 0:30: "8 uur lang 15 kilowatt is 120 kilowattuur."<br>0:55: "In een keten vermenigvuldigen de verliezen zich: 11 gedeeld door 0,70,"<br>1:00: "en nog eens door 0,92, geeft 17,1 kilowatt uit het net."<br>(+6 more) | `eng.power.energy` `eng.power.sizing` (no film) |
| `eng.process.batch` | `process.batch` | 8 | 4 | 55% | 0:27: "Een cyclus van 5 uur met 4 ton geeft 0,8 ton per uur."<br>1:02: "De capaciteit is dus 3.000 kilo gedeeld door 5 uur: 600 kilo per uur."<br>2:55: "3.000 kilo in die tijd is 679 kilo per uur: 13 procent meer uit hetzel…"<br>(+1 more) | `eng.process.scaleup` (no film) |
| `eng.quality.tolerance` | `quality.tolerance` `quality.variation` | 6 | 3 | 54% | 0:18: "Dat geeft twee specgrenzen (spec limits): ondergrens 19,95, bovengrens…"<br>1:40: "Gevonden bij de machine: 15 keer 4 euro 50 is 67 euro 50."<br>2:31: "Bijna alles ligt dus tussen 19,979 en 20,027." | `eng.quality.gauges` `eng.quality.capability` (eng.quality.tolerance) |
| `eng.lines.variants` | `lines.variants` | 2 | 1 | 51% | 0:59: "4 keer omstellen van 20 minuten kost 80 minuten: 340 producten in plaa…"<br>1:14: "Grotere series, 2 keer omstellen, geven 380 producten." | `eng.lines.linechange` (eng.lines.variants) |
| `pm.plan.wbs` | `intake.done` `plan.wbs` `plan.estimate` | 9 | 4 | 44% | 1:42: "Dit doel scheelt 900 kilo per week."<br>3:58: "4, 6 en 14 dagen geeft 7, meer dan 6: er kan meer misgaan dan meezitte…"<br>4:30: "Vraag de echte uren per week: 16 uur bij 4 per week is vier weken."<br>(+1 more) | `pm.intake.charter` `pm.plan.techniques` (no film) |
| `eng.joining.defects` | `joining.defects` | 3 | 1 | 43% | 1:40: "Gelast werd op 405: 35 procent te snel." | `eng.joining.inspection` (eng.joining.defects) |
| `eng.moulding.machine` | `moulding.machine` | 3 | 1 | 42% | 1:31: "Deze behuizing: 15 bij 20 centimeter, 300 vierkante centimeter."<br>1:42: "afhankelijk van de kunststof; hier 0,4, dus 120 ton."<br>1:47: "Met 2 holtes 240 ton, plus 10 tot 20 procent marge: een pers van 280 o…" | `eng.moulding.screw` (eng.moulding.machine) |
| `eng.lines.errorproof` | `lines.errors` | 3 | 1 | 40% | 0:56: "Eén op de 5.000 is 200 ppm." | `eng.lines.pokayoke` (eng.lines.errorproof) |
| `eng.moulding.setting` | `moulding.setup` | 5 | 2 | 40% | 1:25: "Van 60 naar 12 millimeter is 48 millimeter op snelheid:"<br>1:29: "bij 80 millimeter per seconde 0,6 seconde vullen."<br>2:05: "Dan 10 seconden koelen, en zo’n 4 seconden openen," | `eng.moulding.process` (eng.moulding.setting) |
| `eng.lines.design` | `lines.linebasics` | 3 | 1 | 39% | 1:28: "gedeeld door 420 pompen: 60 seconden."<br>1:32: "Het dekselstation zit met 65 seconden boven de takt: 387 pompen per di…" | `eng.lines.layout` (eng.lines.design) |
| `eng.machining.tooling` | `machining.toolbasics` | 4 | 1 | 39% | 1:29: "Bij €14 per plaat is dat 3 euro 50 per kant,"<br>1:33: "en bij 70 stuks per kant 5 cent per stuk." | `eng.machining.tools` (eng.machining.tooling) |
| `eng.moulding.moulds` | `moulding.tooling` | 3 | 1 | 39% | 1:53: "Stel: 40 wissels per week, van 90 naar 30 minuten: 40 uur vrij," | `eng.moulding.mouldparts` (eng.moulding.moulds) |
| `eng.joining.spot` | `joining.spot` | 5 | 2 | 36% | 1:17: "9.500 ampère door 28,3 vierkante millimeter geeft 336."<br>1:29: "10 procent meer stroom geeft zo’n 21 procent meer warmte." | `eng.joining.spotwear` (eng.joining.spot) |
| `eng.mechanics.tensile` | `mechanics.strength` | 6 | 2 | 36% | 2:35: "80 procent van 800 is 640 megapascal."<br>4:07: "235 gedeeld door 120 is 1,96."<br>4:24: "Overstappen op S355 geeft 355 gedeeld door 240, is 1,48." | `eng.mechanics.testing` (no film) |
| `eng.lines.robots` | `lines.robotbasics` | 3 | 1 | 35% | 1:28: "Een punt 1,5 meter verderop kost dus minstens 6 seconden." | `eng.lines.robots` (eng.lines.robots) |
| `eng.moulding.cycle` | `moulding.cycle` | 5 | 2 | 35% | 1:15: "Gedeeld door 20, maal 2 holtes, is dat 360 doppen per uur."<br>1:57: "Hij zakt naar zo’n 7,7 seconden, de cyclus naar 15,7,"<br>2:02: "en de productie stijgt van 360 naar 459 doppen per uur." | `eng.moulding.cooling` (eng.moulding.cycle) |
| `eng.power.air` | `power.air` | 8 | 2 | 35% | 2:26: "Dan lekt er zo’n 40 procent van 10, dus 4 kubieke meter per minuut weg…"<br>2:35: "Neem 75 kilowatt in last, maal 40 procent, maal 8.760 uur: zo’n 263.00…" | `eng.power.hydraulics` (eng.power.hydraulics) |
| `eng.joining.bolting` | `joining.bolts` | 3 | 1 | 34% | 1:19: "een M12 in acht punt acht vloeit bij zo’n 54 kilonewton,"<br>1:26: "Een verwisselde acht punt acht vloeit dus al bij 71 procent van die 76…" | `eng.joining.bolting` (eng.joining.bolting) |
| `eng.joining.bonding` | `joining.bonding` | 3 | 1 | 33% | 0:53: "Een overlap van 25 bij 20 millimeter is 500 vierkante millimeter."<br>0:59: "Bij 20 megapascal draagt die zo’n 10 kilonewton." | `eng.joining.adhesives` (eng.joining.bonding) |
| `eng.process.plant` | `process.types` | 7 | 2 | 33% | 2:35: "Een tank van 6 kubieke meter, met 3 kubieke meter per uur erdoorheen, …"<br>3:43: "Dat geeft 30 seconden, en het voedselveiligheidsplan eist er minstens …" | `eng.process.diagrams` (no film) |
| `pm.run.scope` | `run.scope` `negotiate.scope` | 7 | 2 | 33% | 0:52: "Samen 10 dagen, 25 procent extra, en de planning staat nog op groen."<br>3:26: "Vijf snelle extraatjes van een dag zijn een hele week, op een project …" | `pm.run.change` `pm.negotiate.price` (no film) |
| `eng.lines.control` | `lines.plc` | 3 | 1 | 31% | 0:51: "Bij 10 milliseconden leest de PLC elke ingang 100 keer per seconde." | `eng.lines.safety` (eng.lines.control) |
| `pm.plan.schedule` | `plan.schedule` | 6 | 2 | 30% | 1:36: "Keten A, B, D, E: 3 plus 4 plus 2 plus 6 is 15 weken."<br>1:43: "En keten A, C, E: 3 plus 6 plus 6 is ook 15 weken."<br>2:49: "De einddatum blijft 15 weken, want A, B, D en E is nog steeds 15 weken…"<br>(+1 more) | `pm.plan.method` (pm.plan.method) |
| `eng.joining.arc` | `joining.arc` | 4 | 1 | 29% | 1:33: "Bij 24 volt,"<br>1:35: "220 ampère en 400 millimeter per minuut is dat 0,79 kilojoule per mill…"<br>1:42: "Bij MAG reken je maal 0,8: het deel dat echt in het werkstuk komt."<br>(+1 more) | `eng.joining.weldparams` (eng.joining.arc) |
| `eng.machining.cnc` | `machining.cnc` | 3 | 1 | 28% | 1:21: "200 stuks maal 35 euro is 7.000 euro afkeur." | `eng.machining.gcode` (eng.machining.cnc) |
| `pm.itproject.mvp` | `itproject.requirements` | 4 | 1 | 27% | 1:57: "Stap een: zestig dubbelingen eruit, honderdtachtig over."<br>2:13: "Stap vier: zesendertig regels horen bij geen processtap,"<br>2:20: "Resultaat: honderdvierenveertig requirements, elk met een nummer," | `pm.itproject.mvp` (pm.itproject.mvp) |
| `pm.itproject.uat` | `itproject.uat` | 5 | 1 | 25% | 2:12: "inclusief het klaarzetten van de data: honderdtachtig uur voor ronde é…"<br>2:22: "honderdvierenveertig uur per week."<br>2:25: "Één ronde duurt dus één komma vijfentwintig week." | `pm.itproject.defects` (pm.itproject.uat) |
| `eng.drawings.reading` | `drawings.views` | 4 | 1 | 23% | 1:02: "Bij schaal één op vijf is 40 millimeter op papier in het echt 200," | `eng.drawings.assembly` (no film) |
| `pm.devops.pipeline` | `devops.pipeline` `devops.fourkeys` | 9 | 2 | 23% | 2:46: "Totaal: vijftien minuten van commit tot testomgeving, zonder één handm…"<br>4:58: "De deployfrequentie: acht deploys in vier weken, dus twee per week."<br>5:11: "Het faalpercentage: twee van de acht deploys direct teruggedraaid," | `pm.devops.tests` `pm.devops.measure` (no film) |
| `pm.scaled.pi` | `scaled.why` | 3 | 1 | 23% | 1:31: "Dat zijn acht teams: binnen vijftig tot honderdvijfentwintig, dus één …"<br>1:37: "Een PI van tien weken heeft vijf iteraties van twee: vier om te bouwen…"<br>1:43: "Per jaar vijf komma twee: zo'n vijf keer plannen alle acht teams samen…" | `pm.scaled.piplanning` (pm.scaled.pi) |
| `pm.scaled.hybrid` | `scaled.stagegate` | 5 | 1 | 22% | 2:23: "In de CAD-tekening: vier uur tegen negentig euro per uur, driehonderdz…"<br>2:42: "Ontwikkelen duurt zesentwintig weken: dertien sprints van twee weken," | `pm.scaled.longlead` (pm.scaled.hybrid) |
| `eng.switchgear.devices` | `switchgear.installations` `switchgear.devices` | 8 | 1 | 17% | 3:53: "Een voorbeeld: 20.000 RMU’s met elk 1,5 kilo gas is 30 ton."<br>3:59: "Lekt er 0,1 procent per jaar weg, dan is dat 30 kilo."<br>4:03: "Maal 23.500 is dat ruwweg 700 ton CO2-equivalent, elk jaar." | `eng.switchgear.automation` (eng.switchgear.automation) |
| `eng.gridops.outage` | `gridops.outage` | 7 | 1 | 16% | 3:33: "In dit voorbeeld zaten 1.800 klanten gemiddeld 50 minuten zonder stroo…"<br>3:38: "Dat is samen 90.000 klantminuten." | `eng.gridops.control` (no film) |
| `pm.negotiate.batna` | `negotiate.interests` `negotiate.anchor` `negotiate.no` | 6 | 1 | 16% | 4:18: "Framing: 95 procent op tijd, of één op de 20 te laat." | `pm.negotiate.concede` (no film) |
| `eng.gridbasics.congestion` | `gridbasics.congestion` `gridbasics.roles` | 9 | 1 | 15% | 4:22: "Voorbeeld: 2,8 miljoen klanten en 70 miljoen klantminuten in een jaar,"<br>4:27: "vooral door kapotte kabels in de middenspanning: gemiddeld 25 minuten …"<br>4:33: "Eén storing waarbij 3.000 klanten 90 minuten zonder stroom zitten,"<br>(+1 more) | `eng.gridbasics.law` (no film) |
| `pm.close.results` | `close.results` | 7 | 1 | 14% | 3:05: "Van 14 naar 9 procent is 5 procentpunt minder stilstand: 300 extra dra…"<br>3:21: "Dat is 300 uur maal 450 euro: ongeveer 135.000 euro per jaar." | `pm.close.runchart` (no film) |
| `eng.ot.isa95` | `ot.levels` `ot.systems` | 7 | 1 | 13% | 2:12: "2.000 maal 25 gram is 50 kilo." | `eng.ot.orderflow` (eng.ot.orderflow) |
| `pm.land.handover` | `close.acceptance` `land.sustain` | 6 | 1 | 13% | 5:11: "Na drie maanden 81: de helft van de winst is weg." | `pm.land.lsw` (no film) |
| `pm.portfolio.benefits` | `portfolio.benefits` | 9 | 1 | 10% | 0:43: "Tegen 750 euro per ploegdag is dat 900 duizend euro per jaar." | `pm.portfolio.benefitsmap` (no film) |
| `eng.gridbasics.path` (not rendered) | `gridbasics.levels` | 4 | 1 | n/a | s9: "B('{n:10} keer de spanning geeft voor hetzelfde vermogen {n:10} keer m…"<br>s9: "B('{n:15} keer minder stroom, en zo’n {n:225} keer minder verlies. Daa…" | `eng.gridbasics.path` (eng.gridbasics.path) |
| `eng.joining.production` (not rendered) | `joining.weldcell` | 3 | 1 | n/a | s2: "{ nl: 'Eén station: de robot wacht tijdens het laden. {n:6} + {n:4} = …"<br>s2: "{ nl: 'Twee stations: laden tijdens het lassen. {n:6} + {n:0.3} = {n:6…" | `eng.joining.fixturing` (eng.joining.production) |
| `eng.machining.overview` |  | 0 | 1 | n/a | 3:20: "Al het snijden samen kost 14 minuten. (sum of the cutting times 1 + 6 …" | `eng.machining.cutting` (eng.machining.turning) |
| `eng.machining.workholding` (not rendered) | `machining.fixtures` | 8 | 1 | n/a | s8: "{ nl: 'Van {n:90} naar {n:25} minuten: bij {n:8} omstellingen per week…" | `eng.machining.quality` (eng.machining.measuring) |
| `eng.mechanics.load` (not rendered) | `mechanics.forces` | 4 | 3 | n/a | s1: "{ nl: 'Kracht meet je in {t:Newton|newton}, N. Gewicht = massa × {n:9.…"<br>s2: "{ nl: '{n:490} N op {n:0.4} m van de muur: {n:196} Nm. De bovenste bou…"<br>s2: "{ nl: 'Dubbele arm, halve kracht: {n:200} N aan een sleutel van {n:0.2…"<br>(+1 more) | `eng.mechanics.stress` (eng.mechanics.load) |
| `eng.moulding.materials` (not rendered) | `moulding.materials` | 4 | 1 | n/a | s2: "{ nl: '{n:12} kg per uur × {n:4} uur drogen = {n:48} kg in de trechter…"<br>s2: "{ nl: 'Leeggelopen, dan {n:20} kg nat erin: in {n:1.7} uur op, nooit {…" | `eng.moulding.polymers` (eng.moulding.materials) |
| `eng.switchgear.protection` (not rendered) | `switchgear.protection` | 7 | 1 | n/a | s9: "B('Trap één: {n:450} ampère, {n:1.5} keer de maximale belasting, met {…" | `eng.switchgear.selectivity` (eng.switchgear.protection) |
| `eng.transformers.principle` (not rendered) | `transformers.principle` | 9 | 3 | n/a | s3: "B('Die bepaalt de spanningsverhouding: {n:10} kV naar {n:400} V is {n:…"<br>s4: "B('{n:400} kVA is zo’n {n:577} A op {n:400} V, maar zo’n {n:23} A op {…"<br>s9: "{ nl: 'Per spoel is de wikkelverhouding dus {n:10000} gedeeld door {n:…"<br>(+1 more) | `eng.transformers.station` (no film) |

In 29 of these films the Werkkennis lesson of the same topic is served by the **same film** (its own level-2 scenes), so the calculation can move to the later scenes of the same film instead of a new film; for the others the Werkkennis lesson has another film or none (the table shows the target film).

**Would become very short or hollow without their calculation scenes** (calc scenes are at least half of the Basis runtime, or all Basis scenes): `eng.machining.drilling` (100%), `eng.gridbasics.load` (74%), `pm.portfolio.prioritise` (70%), `eng.process.measure` (62%), `eng.power.motor` (60%), `eng.process.batch` (55%), `eng.quality.tolerance` (54%), `eng.lines.variants` (51%). Of these, `eng.machining.drilling` has only 2 Basis scenes (58 s), both with a calculation cue; `eng.lines.variants` has just 2 Basis scenes, one of them the changeover sum; in `eng.gridbasics.load` three of four Basis scenes have a sum. Those three are rewrites more than trims.

Films whose Basis scenes carry no calculation (no rebuild for step 4): `eng.machining.milling`, `eng.maintenance.failure`, `eng.maintenance.tpm`, `eng.mechanics.fatigue`, `eng.moulding.defects`, `eng.power.drives`, `eng.quality.spc`, `eng.safety.loto`, `eng.switchgear.fiverules`, `pm.agile.backlog`, `pm.agile.kanban`, `pm.agile.scrum`, `pm.consult.proposal`, `pm.intake.firsttalk`, `pm.intake.stakeholders`, `pm.itproject.migration`, `pm.land.adoption`, `pm.land.training`, `pm.lead.feedback`, `pm.outside.experts`, `pm.outside.questions`, `pm.outside.steering`, `pm.perform.tree`, `pm.plan.method`, `pm.plan.risk`, `pm.run.escalation`, `pm.run.rhythm`, `pm.stuck.diagnose`.

Rendered films with a calculation need a re-render (render batch, `sonnet`) after the rebuild; the 7 unrendered ones with a calculation (eng.gridbasics.path, eng.joining.production, eng.machining.workholding, eng.mechanics.load, eng.moulding.materials, eng.switchgear.protection, eng.transformers.principle) need only the build change; their narration is in the `build.mjs` beats and `say` strings, quoted in findings.json with scene id.

Intro and field films (`*.intro`, `pm.field.*`): the four-level opener scenes state figures ("3 weeks") but compute nothing, nothing to do.

## 5. Group B, for Merijn to rule on (patterns, not every instance)

Proposed default (to confirm): **B stays at Basis**, because it explains how things work and nobody computes. Only A moves. The patterns, with the grey zone marked:

1. **Formula as a relationship, no numbers.** "Takttijd is beschikbare tijd gedeeld door de klantvraag", "OEE = beschikbaarheid x performance x kwaliteit", "risico = kans x schade", "wet van Little: doorlooptijd = onderhanden werk / doorzet". About 108 paragraphs in 77 lessons. Suggest: allowed, but never together with numbers on the same line.
2. **Typical values and ranges**, stated: "ontwerp de cyclus op 85 tot 90% van de takt", "doorlooptijd 3 tot 10 dagen", "HSS-boor ongeveer 25 m/min", "1 bar is 14,5 psi", "klasse m is +-0,2 mm", "world class OEE is 85%". Allowed.
3. **A result stated without steps**, e.g. teach: "Een dienst van 7,5 netto uur is 27.000 seconden. Bij een vraag van 450 stuks is de takt 60 seconden." or "10% meer stroom geeft zo’n 21% meer warmte", "een tank van 6 m3 met 3 m3 per uur geeft 2 uur" (films). Grey zone: nobody computes, but the learner sees the arithmetic result. Suggest: allow one stated result per concept, forbid the steps and any question about it.
4. **Notation and specifications with a multiplication sign**: "3 x 80 A" (connection class), "M10 x 1,5 x 40", "100 x 80 x 25 mm", "Fine and Kinney score classes", "Phi12 +0,018/0", scale "1:5". Allowed. These are the false-positive risk for the validator (section 6).
5. **Numeric answers that are facts, not sums** (type-a-number questions): `pm.agile.scrumbasics#r0` (team size, 10), `eng.switchgear.safety#r0` (1.000 V), `eng.machining.fixtures#r0` (6 degrees of freedom), `eng.quality.variation#r1` (99,7%), and two counts: `eng.itbasics.tables#r2` (6 rows) and `pm.outside.progress#r3` (3 milestones). Suggest: turn them into multiple choice, so the rule "no numeric question at Basis" is clean.
6. **Narrated figures in films that illustrate a case** ("1.800 klanten gemiddeld 50 minuten", "140 van de 600 orders wachten langer dan 4 weken", "Lijn 3 is gepland op 6.000 uur per jaar"). Allowed; the computed step after it ("dat is samen 90.000 klantminuten") is A.
7. **Scales, scores and estimates** as a concept ("score kans en impact 1 tot 5"): `pm.plan.risk`. Allowed as long as nobody multiplies.

**Group C** (estimate or compare without arithmetic): 171 multiple-choice questions in 113 lessons carry figures but need no arithmetic, e.g. `eng.flow.takt#p0` "Een stalen beugel krijgt 4 minuten echte bewerking (knippen, zetten, lassen). Hoe lang zit…"; `eng.flow.takt#r1` "De klantvraag daalt met 20%; de beschikbare tijd blijft gelijk. Wat gebeurt er met de takt…"; `eng.flow.takt#r3` "Een station heeft een cyclustijd van 70 seconden per stuk bij een takt van 60 seconden per…". They stay (full list in findings.json, group C). Many of them are the "which factor / which is bigger" type; if Merijn wants no figures at all in questions, that is a separate, stricter rule.

## 6. Existing checks and the suggested validator rule

- `src/content/courses/validate.js` `checkLesson(l, meta, lang, errs, tier)` already receives `tier` (1 to 4 from `tiersOf(meta)`, from the topic position) and uses it for example kind (`worked` required below tier 3, `faded` at 3 to 4), plus shape checks (3 to 5 teach blocks of at most 90 words, 3 to 5 recall questions, a situation with rubric, 2 to 6 terms, EN and NL numbers equal for numeric recall questions). It has no rule about calculations. `tests/coursecontent.test.js` runs `validateModule` over every module; film checks are `checkFilm` in `films/_kit/assert.mjs` (gets `levelOf`), run inside `defineFilm`.
- Basis keeps `example.kind: "worked"` (required by the validator and by design addendum 3: "A worked example"). The worked example stays, but as a worked explanation (a walk through a scene), not a worked sum.

**Suggested rule (in `checkLesson`, only when `tier === 1`):**

```js
// level 1 explains how things work; calculations start at level 2
const EQ = /\d[^=≈\n]{0,70}[=≈]\s*[€$]?\s*\(?[−-]?\d/;   // "<digit> ... = <number>" in one string
if (tier === 1) {
  for (const [where, qn] of [...pre.map((q, i) => [`pre ${i}`, q]), ...recall.map((q, i) => [`recall ${i}`, q])])
    if ('number' in qn) errs.push(`${at} ${where}: level 1 has no numeric (computed) question; use multiple choice`);
  // every string a learner reads: teach, example, said, question text, options, why, situation, sayIt, terms
  for (const s of strings(l)) if (EQ.test(s)) errs.push(`${at}: level 1 shows a calculation ("${s.match(EQ)[0].slice(0, 40)}"); move it to level 2`);
}
```

Why this pattern: a calculation on screen always has the shape "numbers ... = result" (every A item in the audit does: "480 − 40 = 440", "27.000 / 600 = 45", "0,80 × 0,90 × 0,95 = 0,684", "€18 / 6 = €3"), while the Basis false-positive risks never have an equals sign followed by a number: "3 × 80 A", "M10 × 1,5 × 40", "100 × 80 × 25 mm", "1:5", "Ø 12 +0,018/0". A bare operator test (`×`, `/`) would flag 32 strings in 16 lessons that are notation, so do not use one. Tested on the current Basis content (script `rule.mjs`): the numeric-question test flags 184 questions in 141 lessons; the `=` test flags 291 strings in 130 lessons; together 141 of the 176 lessons; every flagged lesson is also in the audit, with exactly these false positives to handle when the rule goes in: the 6 numeric fact or count questions in group B item 5 (turn into multiple choice; they are the 4 lessons flagged by the rule that have no other calculation, plus 2 in lessons that do), and the sentence "R(1 jaar) = 0,95 betekent dat 95 van de 100..." in `eng.reliability.mtbf` teach 0 (rephrase: "R is 0,95: 95 van de 100 units..."). Misses (not flagged but still a computation): a sum written in words with no equals sign (the pm film narration "3 plus 4 plus 2 plus 6 is 15 weken", "gedeeld door"), and a percentage change given as a result only. The rule runs on lesson data only; it cannot see films.

**Films (second check):** add the same idea to `checkFilm` for scenes with `level === 1`, run on each beat's NL text and `say` text before the VTT exists: flag a beat that has at least 2 `{n:...}` numbers and one of `gedeeld door | maal | plus | min | keer | = | × | geeft | is dus`, plus the pm spelled-out form (the pm films write numbers as words in `say`, e.g. "twee plus vier keer drie", so test on the `{n:}` markers and operator words, not on digits). Expect false positives on "van 6 tot 8 keer" (ranges) and "3 weken, 12 dagen, 14.400 euro" (stated list); allow a `calc: false` escape on a beat or accept a short allowlist.
Level of a film scene already exists in the spec (`scene.level`), so no new data is needed. Because `findNumber` ties film numbers to the served lessons, a Basis lesson that loses its calculation will also make `defineFilm` fail on every `{n:..}` that came only from the removed calculation: that is a useful safety net for step 4, but plan the rebuild order lesson first, film second.

## 7. Films that need a rebuild (step 4)

Order by size of the cut (calc-scene share of Basis runtime). Rendered films need rebuild + re-render; unrendered need rebuild only.

| Film | Basis scenes | scenes to cut or rewrite | Basis runtime | rendered |
|---|---:|---:|---:|---|
| `eng.machining.drilling` | 2 | 2 | 58 s | yes |
| `eng.gridbasics.load` | 4 | 3 | 145 s | yes |
| `pm.portfolio.prioritise` | 6 | 4 | 222 s | yes |
| `eng.process.measure` | 7 | 4 | 270 s | yes |
| `eng.power.motor` | 9 | 5 | 318 s | yes |
| `eng.process.batch` | 8 | 4 | 279 s | yes |
| `eng.quality.tolerance` | 6 | 3 | 223 s | yes |
| `eng.lines.variants` | 2 | 1 | 85 s | yes |
| `pm.plan.wbs` | 9 | 4 | 338 s | yes |
| `eng.joining.defects` | 3 | 1 | 115 s | yes |
| `eng.moulding.machine` | 3 | 1 | 125 s | yes |
| `eng.lines.errorproof` | 3 | 1 | 98 s | yes |
| `eng.moulding.setting` | 5 | 2 | 134 s | yes |
| `eng.lines.design` | 3 | 1 | 103 s | yes |
| `eng.machining.tooling` | 4 | 1 | 120 s | yes |
| `eng.moulding.moulds` | 3 | 1 | 124 s | yes |
| `eng.joining.spot` | 5 | 2 | 143 s | yes |
| `eng.mechanics.tensile` | 6 | 2 | 315 s | yes |
| `eng.lines.robots` | 3 | 1 | 100 s | yes |
| `eng.moulding.cycle` | 5 | 2 | 130 s | yes |
| `eng.power.air` | 8 | 2 | 231 s | yes |
| `eng.joining.bolting` | 3 | 1 | 102 s | yes |
| `eng.joining.bonding` | 3 | 1 | 119 s | yes |
| `eng.process.plant` | 7 | 2 | 293 s | yes |
| `pm.run.scope` | 7 | 2 | 308 s | yes |
| `eng.lines.control` | 3 | 1 | 110 s | yes |
| `pm.plan.schedule` | 6 | 2 | 290 s | yes |
| `eng.joining.arc` | 4 | 1 | 126 s | yes |
| `eng.machining.cnc` | 3 | 1 | 90 s | yes |
| `pm.itproject.mvp` | 4 | 1 | 147 s | yes |
| `pm.itproject.uat` | 5 | 1 | 162 s | yes |
| `eng.drawings.reading` | 4 | 1 | 150 s | yes |
| `pm.devops.pipeline` | 9 | 2 | 329 s | yes |
| `pm.scaled.pi` | 3 | 1 | 108 s | yes |
| `pm.scaled.hybrid` | 5 | 1 | 173 s | yes |
| `eng.switchgear.devices` | 8 | 1 | 291 s | yes |
| `eng.gridops.outage` | 7 | 1 | 296 s | yes |
| `pm.negotiate.batna` | 6 | 1 | 242 s | yes |
| `eng.gridbasics.congestion` | 9 | 1 | 339 s | yes |
| `pm.close.results` | 7 | 1 | 246 s | yes |
| `eng.ot.isa95` | 7 | 1 | 216 s | yes |
| `pm.land.handover` | 6 | 1 | 229 s | yes |
| `pm.portfolio.benefits` | 9 | 1 | 255 s | yes |
| `eng.gridbasics.path` | 4 | 1 | n/a | no |
| `eng.joining.production` | 3 | 1 | n/a | no |
| `eng.machining.overview` | 0 | 1 | n/a | yes |
| `eng.machining.workholding` | 8 | 1 | n/a | no |
| `eng.mechanics.load` | 4 | 3 | n/a | no |
| `eng.moulding.materials` | 4 | 1 | n/a | no |
| `eng.switchgear.protection` | 7 | 1 | n/a | no |
| `eng.transformers.principle` | 9 | 3 | n/a | no |

Notes for the integrator:
- Calculation beats are usually part of a scene that also explains the idea (for example `eng.process.batch` scene 2 "Een verfbatch" is the sum, scene 1 explains the cycle). "Scenes to cut or rewrite" counts scenes with at least one A cue, not scenes that vanish: most can be rewritten as explanation (what a bigger batch does) rather than removed.
- Where the Werkkennis lesson has no film (almost all of them), the moved calculation goes into the Werkkennis lesson text (worked example plus questions) first; the film for it is optional and later. Only a few topics have a Werkkennis film already: check `target.lessonFilm` in `findings.json`.
- Spelled-out numbers: the pm films carry numbers as words in the VTT, so searching a rendered pm film for digits finds nothing; use the `say` strings in `build.mjs`.

## 8. Files

- `report.md` (this file), `findings.json` (all findings: `type` lesson or film, `subject`, `module`, `topic`, `lesson`, `where`, `quote`, `group`, `target`; plus `counts` and `filmSummary`), scratch scripts `dump.mjs`, `gen.mjs`, `films2.mjs`, `final.mjs`, `rule.mjs`, `report.mjs`.

# eng.process — Process engineering basics (engineering, track basics, level 1, WORKED examples)
Index title: en 'Process engineering basics' / nl 'Procestechniek: de basis'. Blurb: en 'Batch or continuous, pressure and flow, mass and energy balances, batch capacity and scale-up: how process plants think.' / nl 'Batch of continu, druk en debiet, massa- en energiebalans, batchcapaciteit en opschalen: hoe procesfabrieken denken.'

Why: the platform covered discrete manufacturing and the grid well, but process industry (food, chemicals, pharma, water) only through P&ID reading. Merijn meets process plants at clients; balances, batch cycle time and scale-up are what process engineers reason with.

1. `eng.process.types` — unit operations; batch vs continuous; residence time = volume / flow (holding tube example).
2. `eng.process.variables` — bar(g) vs bar(a); volume vs mass flow and meter types; level by pressure depends on density; °C differences = K; Pt100 and thermocouples.
3. `eng.process.mass` — in = out + accumulation; component balances and the tie component (evaporator 12% to 60% dry matter); yield; closing the balance (stock change, small streams).
4. `eng.process.energy` — Q = m·cp·ΔT; latent heat of water ~2,260 kJ/kg; kW vs kJ; regeneration in a pasteuriser.
5. `eng.process.batch` — batch cycle time and capacity; every minute counts; staged vessels and the bottleneck stage; ISA-88 phases and batch reports.
6. `eng.process.scaleup` — square-cube law (area vs volume), heat removal limits dosing, mixing time, lab → pilot → plant.

Facts and sources
- Unit operations, balances: McCabe, Smith & Harriott, *Unit Operations of Chemical Engineering*, 7th ed.; Himmelblau & Riggs, *Basic Principles and Calculations in Chemical Engineering*, 8th ed.
- Specific heat of water ~4.18 kJ/(kg·K) (rounded to 4.2); latent heat of evaporation at 100 °C ~2,257 kJ/kg: steam tables (IAPWS-IF97; Engineering ToolBox "Water - heat of vaporization").
- Milk cp ~3.9 kJ/(kg·K) and pasteuriser regeneration of ~90%: Tetra Pak, *Dairy Processing Handbook* (chapter on heat treatment / heat exchangers).
- Water–ethanol volume contraction (~1.92 L from 1 L + 1 L): CRC Handbook of Chemistry and Physics, density tables for ethanol–water mixtures.
- Gauge vs absolute pressure (+1.013 bar at sea level), Coriolis direct mass flow, Pt100 range: Endress+Hauser / Emerson flow and temperature handbooks.
- ISA-88 batch control (recipes as procedures, unit procedures, operations, phases): ANSI/ISA-88.00.01.
- Scale-up, surface-to-volume, heat removal limiting dosing rate of exothermic semi-batch reactions: Zlokarnik, *Scale-up in Chemical Engineering*; Stoessel, *Thermal Safety of Chemical Processes*.
- HTST minimum holding time examples are illustrative (the example states a plan value of 20 s, not a legal limit).

Numbers in questions (checked): residence 8/2 = 4 h; 6 bar(g) ≈ 7 bar(a); 12 m³/h × 1,100 = 13,200 kg/h; dryer 400/0.96 = 416.7 kg/h; yield 85%; 500 × 4.2 × 60 / 3,600 = 35 kWh; 3 × 4.0 × 20 = 240 kW; 6 batches × 6,000 = 36,000 kg; 240/210 = +14.3%; 6/2 = 3 h stage; 3³ = 27.

Uncertain / simplified: plant energy figures (737 kW, 76 kW) are rounded; the 10 kW/m² jacket capacity in the scale-up example is an illustrative assumption stated in the text.

## Clarity round (2026-11-04)
Every lesson now has 5 teach blocks (≤ 90 words) and 5 terms, en and nl in the same order; every term appears literally (singular) in its lesson’s teach text. Jargon is explained in the sentence where it first appears (vessel, off-spec, flow, density, calibration, kelvin, thermowell, dry matter, filter cake, load cells, evaporator, membranes, QC release, CIP, jacket, runaway, by-products, pilot plant). The .nl files add the English word in parentheses once for important unlisted words (debiet (flow), dichtheid (density), kalibratie (calibration), droge stof (dry matter), indamper (evaporator), filterkoek (filter cake), weegcellen (load cells), warmtewisselaar (heat exchanger), vermogen (power), warmteoverdracht (heat transfer), bijproducten (by-products), batchrapport (batch report)).

Term changes: types + Steady state (moved from mass, defined once); variables: “bar(g) and bar(a)” split into Gauge pressure / Absolute pressure; mass: + Accumulation, + Component balance (Steady state moved out); energy: “Specific heat (cp)” renamed Specific heat (literal match), + Regeneration section; batch: + Bottleneck (CIP now actually appears in the teach text); scaleup: + Jacket (Surface-to-volume ratio now appears in the teach text). nl “Opbrengst (yield)” → Opbrengst, “Proeffabriek (pilot plant)” → Proeffabriek (the app shows the English term next to it by position).

New facts in the fifth blocks and where they come from
- Residence time distribution (short-circuiting, dead zones in stirred tanks; holding tubes sized on the fastest particle): Levenspiel, *Chemical Reaction Engineering*, 3rd ed., ch. 11; Tetra Pak *Dairy Processing Handbook* (holding tubes).
- Regulators encourage continuous manufacturing in pharma: FDA guidance and ICH Q13 *Continuous Manufacturing of Drug Substances and Drug Products* (2022/2023).
- 50% more flow → residence time × 1/1.5 = 0.667, a third less.
- Magnetic flow meters need a minimum conductivity (≈ 5 µS/cm; demineralised water and oil fail); Coriolis accuracy ≈ ±0.1% of reading: Endress+Hauser *Flow Handbook* / Promag and Promass data sheets. Coriolis meters cost in the thousands of euros (list prices roughly €3,000–15,000).
- Pt100: 100 Ω platinum at 0 °C; class A ±(0.15 + 0.002·|t|) °C (IEC 60751), so a few tenths of a degree; usable to ~600 °C (some to 850 °C). Thermocouple class 2 type K ±2.5 °C or 0.75% (IEC 60584).
- Weekly mass balances closing within 1–2%: typical metering uncertainty (custody-transfer meters ±0.1–0.5%, process meters ±0.5–2%); stated as “often”, a rule of thumb.
- Evaporator steam economy: single effect ≈ 1.0–1.1 kg steam per kg water evaporated; triple effect ≈ 0.35–0.4; MVR ≈ 10–30 kWh electricity per tonne of water: GEA / Tetra Pak evaporator handbooks; Tetra Pak *Dairy Processing Handbook* (evaporation chapter).
- Cleaning campaigns vs clean-after-every-batch: common practice debate in food/pharma hygiene (EHEDG guidelines; validation of campaign length).
- Runaway reactions and relief (safety valve, bursting disc): Stoessel, *Thermal Safety of Chemical Processes*.
- Stirrer scale-up on constant power per volume vs constant tip speed (cannot keep both when geometry is similar): Zlokarnik, *Scale-up in Chemical Engineering*; Paul, Atiemo-Obeng & Kresta, *Handbook of Industrial Mixing*.

Recalculated: 0.1/12 h = 30 s; 0.1/18 h = 20 s; 1,250 × 9.81 × 2.0 = 24,525 Pa → 2.5 m; 1,440/1,500 = 96%; 10,000 × 3.9 × 68 / 3,600 = 736.7 kW; × 7 / 3,600 = 75.8 kW (≈ 90% saving); 3,000 / (265/60) = 679 kg/h (+13.2%); 500 kW / 250 kW / 200 kW at 1, 2, 2.5 h dosing. All recall numbers, ids, answer positions unchanged.

Uncertain: “sleutelcomponent” as the Dutch for tie component is used in Dutch teaching material but not universal (some say “verbindingscomponent” or just “tie component”).

Review (2026-11-04): nl term “Sleutelcomponent” → “Tie component” (in Dutch chemical engineering “sleutelcomponent” already means the key component in distillation, lichte/zware sleutelcomponent; engineers use the English “tie component”). Pt100 claim corrected: class A is a few tenths of a degree at normal process temperatures (±1.35 °C at 600 °C), so “a few tenths up to 600 °C” was removed. Hedged: weekly balance 1–2% is a rule of thumb; MVR “typically 10 to 30 kWh per tonne” and explained as electrically compressing the vapour; “regulators such as the American FDA encourage it” (FDA public support for continuous manufacturing; ICH Q13, Step 4 Nov 2022, FDA guidance 2023). ISA-88 phases described as the small steps a recipe is built from (procedure → unit procedure → operation → phase). Explained in place: pasteurising, chiller, bursting disc, reagent, shear, tip speed (nl tipsnelheid).

## v13 topics (2026-11-08): 4 topics × 4 levels

| Topic (id) | 1 Basis | 2 Werkkennis | 3 Gevorderd | 4 Expert |
|---|---|---|---|---|
| Process types and diagrams (`types`) | `types` (existing) | `diagrams` (new): block flow diagram, PFD and stream table, P&ID, equipment tags, utilities, as-built, dead legs, PFD vs value stream map | `buffers` (new): buffer tank between batch and continuous, average supply vs draw, swing per cycle, usable volume, averaging level control, hold time limit | `continuous` (new): hold-up, product interface at changeovers, start-up loss, campaigns, lot by time window (ICH Q13), business case |
| Process variables and control (`control`) | `variables` (existing) | `loops` (new): control loop, final element, fast vs slow loops, time constant, dead time = pipe volume / flow, manual mode, loop survey | `strategies` (new): cascade, ratio control and wild flow, feedforward, split range, failure modes | `variability` (new): squeeze and shift, setpoint = limit − 3σ, giveaway, base-layer audit, MPC, alarm rate and alarm flood (EEMUA 191) |
| Mass and energy balances (`balances`) | `mass` (existing) | `energy` (existing) | `blending` (new): two-stream blending, dairy standardisation, Pearson square, recycle, purge, first-pass yield | `pinch` (new): specific energy consumption, Sankey diagram, pinch analysis, ΔTmin, pinch rules, heat pumps, batch timing and heat storage |
| Batch capacity and scale-up (`capacity`) | `batch` (existing) | `scaleup` (existing) | `scheduling` (new): sequence-dependent cleaning, allergens, Gantt chart, pre-weighing, working volume, allergen sequencing | `debottleneck` (new): capacity profile, options ladder and cost per added tonne, change control and validation, utilities as bottleneck, demonstrated vs design capacity |

Why this split: the suggested four topics map one-to-one. The six existing lessons sit at levels 1–2 with their worked examples; `energy` becomes level 2 of balances and `scaleup` level 2 of capacity (both already worked examples). Levels 3–4 are new, with faded examples.

Overlap with other modules, kept small on purpose: P&ID symbols, the loop (SP/PV/OP) and PID tuning live in eng.drawings (Drawings and control); `diagrams` and `loops` point there and redefine none of its terms. Pumps, pressure drop, heat exchangers (U·A, approach, fouling) and steam live in eng.fluids (Pumps, flow and heat); `pinch` and `debottleneck` point there. Batch size / EOQ lives in eng.flow; `continuous` points there for campaign versus stock.

Existing lessons: ids, recall order, recall answer positions and numbers unchanged (pinned in `tests/fixtures/v13-eng.process-recall-keys.json`, built from the files before this change, checked by `tests/progresskeep.test.js`). No figure existed on these lessons. Wording changes only:
- Giveaways removed (correct option was the unique longest): types r2, mass r2 and r3, energy r2 and r3, batch r3, scaleup r2 and r3, and the pre questions of types, energy and batch. Distractors lengthened; very long correct options shortened.
- Pre questions (not pinned) re-ordered for balance: types pre answer now at 3, variables pre at 2, energy pre at 3.
- Own hints on energy r0 and r1, batch r0 and r1, scaleup r0 (the generated step gave nearly the whole sum, e.g. “3 × 4.0 × 20 = ?”).
- Index blurb now names process diagrams and control loops.

Answer positions (pre + recall multiple choice, en = nl): whole module 14 / 13 / 12 / 12 over positions 0–3. The new lessons alone are 10 / 1 / 10 / 10, on purpose: the pinned recall keys of the existing lessons put 11 answers at position 1, so the new lessons avoid it to keep the module balanced. No question has the correct option as the unique longest one (script check, en and nl). Every numeric recall question in the new lessons has its own hint (≤ 25 words, never the answer); the five existing ones above too; the other existing generated hints give a formula (e.g. “Residence time = volume / flow = ?”).

Terms: 4–6 per lesson, en and nl in the same order, each literally in its lesson’s teach text, defined once in the module. Utility / Nutsvoorziening is defined in `diagrams` (first use), not in `debottleneck`.

Facts and sources (checked 2026-11-08):
- Block diagram, process flow diagram and P&ID as the three diagram types; the utility flow diagram is a kind of PFD — ISO 10628-1:2014 *Diagrams for the chemical and petrochemical industry — Part 1: Specification of diagrams* (scope and contents via https://standards.iteh.ai/catalog/standards/iso/5fbe7939-e2f1-4a3c-ad1a-bbf2715c2eff/iso-10628-1-2014 and https://en.wikipedia.org/wiki/ISO_10628).
- Loop survey: Desborough & Miller, “Increasing customer value of industrial control performance monitoring — Honeywell’s experience”, CPC6 (2002), https://skoge.folk.ntnu.no/prost/proceedings/cpc6-jan2002/desborough.pdf — about 26,000 PID controllers: 16% excellent, 16% acceptable, 22% fair, 10% poor, 36% “open loop” (in manual or output saturated for more than 30% of the data). Taught as “only about a third performed well; 36% effectively not controlling”.
- Dead time in pipelines (no back-mixing, deadtime-dominant; lower gain when dead time is large compared with the time constant) — ISA tip 78, https://www.automation.com/article/tip-78-decrease-the-pid-gain-and-reset-time-for-pipeline-and-inline-control. No agreed numeric limit exists, and the lesson says so. Time constant = 63% of the final change: the standard first-order definition (Seborg et al., *Process Dynamics and Control*).
- Cascade inner loop “several times faster” is hedged as a common guideline (textbooks quote 3–5×; no number taught).
- Benefits only appear when the setpoint moves — ISA Interchange tip 64, https://blog.isa.org/tip-64-improve-setpoints; operator margin, https://www.controlglobal.com/manage/optimization/article/11294776/how-to-identify-and-address-the-sources-of-variability. “Squeeze and shift” is practitioner language; 3σ distance stated as “often”.
- Alarm rates: EEMUA 191 — about one alarm per 10 minutes per operator in normal operation is “very likely acceptable”; a flood starts at more than 10 alarms in 10 minutes. ISA-18.2 (2009) had 150 a day as very likely acceptable, dropped in 2016 (https://www.chemengonline.com/alarm-management-numbers/, https://library.e.abb.com/public/72f20c70c7b44d889d463db81df5c38d/SCADA%20Alarm%20Management%20White%20Paper.pdf). Only the EEMUA figures are taught.
- MPC benefit figures are vendor case studies, stated as such (e.g. https://www.rockwellautomation.com/en-be/company/news/blogs/reduce-variability-to-improve-capacity-and-quality.html).
- Dairy standardisation: cream usually 35–40% fat, skim 0.04–0.07% fat; example 40% cream + 0.05% skim → 3%: 2.95 kg cream + 37 kg skim = 39.95 kg — Tetra Pak, *Dairy Processing Handbook*, ch. 7.2, https://dairyprocessinghandbook.tetrapak.com/chapter/centrifugal-separators-and-milk-standardization
- Recycle, purge and multi-box balances — Himmelblau & Riggs, *Basic Principles and Calculations in Chemical Engineering*, 8th ed.
- Pinch analysis (Linnhoff and co-workers, from the late 1970s); ΔTmin 10 K as a common starting point and an economic choice; reported savings “often 10 to 35%”, hedged as varying widely — https://saveonenergy.ca/-/media/Files/SaveOnEnergy/training-and-support/ee/Getting-Started-with-Pinch-Analysis-Participant-Workbook.docx, https://www.aidic.it/cet/15/43/216.pdf; Kemp, *Pinch Analysis and Process Integration*, 2nd ed.
- ICH Q13 (Step 4, November 2022): in continuous manufacturing a batch may be defined by quantity or by run time — https://database.ich.org/sites/default/files/ICH_Q13_Step4_Guideline_2022_1116.pdf
- 14 allergens that must be declared in the EU — Regulation (EU) No 1169/2011, Annex II.
- FDA, *Process Validation: General Principles and Practices* (January 2011): process design, process qualification, continued process verification — https://www.fda.gov/regulatory-information/search-fda-guidance-documents/process-validation-general-principles-and-practices. “May need new validation batches” is hedged.
- Rules of thumb stated as such: product interface “often one to two times the hold-up” (plant records give the real figure); vessel working volume from the data sheet (no percentage given); hold time limit set by the site’s food safety plan (no number given).

Recalculations (new lessons):
- diagrams: example 15,000 × 55 / 60 = 13,750, 1,250 kg/h short. r0 12,000 × 54 / 60 = 10,800.
- buffers: pre 6 / 2 = 3. Example 6 / 1.5 = 4; 4 × 0.25 = 1; swing 5; + 4 = 9 m³; 80-minute cycle 6 / 1.333 = 4.5. r0 10 / 2 = 5; r1 (14 − 2) / 3 = 4.
- continuous: example 8 × 3,000 = 24,000; 3 × 3,000 = 9,000; 15,000 × 48 = 720,000. r0 1,200 × 1.5 × 10 = 18,000; r1 2.5 × 800 × 3 = 6,000.
- loops: example 30 × 2 = 60 L, 3.6 m³/h = 1 L/s, 60 s; 2 m × 2 L = 4 L, 4 s; 0.5 L/s, 120 s. r0 15 × 3 / 1.5 = 30; r1 20 × 6 / 2 = 60.
- strategies: example 22 / 5.5 = 4; 19.8 / 5.5 = 3.6; 19.8 / 4 = 4.95; 5.5 / 4.95 = 1.111 (11% more syrup per litre of water). r0 36 / 8 = 4.5; r3 (80 − 50) / 50 = 60%.
- variability: example 4.0 − 0.75 = 3.25%; 2,000 × 0.9675 = 1,935; 4.0 − 0.30 = 3.70%; 1,935 / 0.963 = 2,009.3 (+9.3 kg/h); 9.3 × 6,000 × €3 ≈ €168,000 (price stated as “say”). r0 5.0 − 0.6 = 4.4; r1 15 g × 50,000 = 750 kg.
- blending: Pearson 3 − 0.05 = 2.95, 40 − 3 = 37. Example 420 = 0.4C + 0.035(10,000 − C), C = 70 / 0.365 = 191.8; 9,808.2; check 76.7 + 343.3 = 420. r0 10 / 30 × 100 = 33.3; r1 5,000 / 0.92 = 5,434.8; r3 900 / 1,000 = 90% (overall 98%).
- pinch: example 10,000 × 4.2 × 45 / 3,600 = 525 kW; × 40 = 466.7 kW; × 5 = 58.3 kW; 466.7 / 525 = 88.9%. r0 1,800,000 / 4,500 = 400; r1 70 − 10 = 60.
- scheduling: example 72 + 4 × 3 + 7 × 0.5 = 87.5; 72 + 11 × 0.5 + 3 = 80.5; 7 h freed. r0 3 batches, 20 / 24 = 83.3%; r1 (5 − 1) × 3 = 12.
- debottleneck: pre 8 / 2 = 4 against a dryer stage of 2.25, so 4 h. Example 8,000 / 4.5 × 2 = 3,555.6; 8,000 / 4 × 2 = 4,000; +444.4 t; 150,000 / 444.4 = €337.5 (“about €340”); 2,500,000 / 444.4 = €5,625 (“about €5,600”). r0 max(3, 10 / 2, 4) = 5; r1 400,000 / 800 = 500.

Uncertain: Dutch term choices where the shop floor often uses the English word: Systeeminhoud (hold-up), Mengfase (product interface; common in Dutch dairy), Hoofdstroom (wild flow), Gesplitst bereik (split range), Knijpen en verschuiven (squeeze and shift), Eerste-keer-goed (first-pass yield), Nutsvoorziening (utility; the text adds that people simply say “utilities”). The app shows the English word next to each.

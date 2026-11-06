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

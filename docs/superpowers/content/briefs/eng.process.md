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

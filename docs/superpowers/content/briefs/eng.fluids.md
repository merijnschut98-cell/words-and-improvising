# eng.fluids — Pumps, flow and heat (engineering, track basics, level 2, WORKED examples)
Index title: en 'Pumps, flow and heat' / nl 'Pompen, stroming en warmte'. Blurb: en 'Pressure drop, pump curves, cavitation, speed control, heat exchangers and steam: the utilities behind every process plant.' / nl 'Drukval, pompkarakteristieken, cavitatie, toerenregeling, warmtewisselaars en stoom: de utilities achter elke procesfabriek.'

Why: pumps, heat exchangers and steam are where process plants lose reliability and energy, and where engineers argue in terms (head, BEP, NPSH, approach, traps) a consultant needs to follow. No existing module covers them.

1. `eng.fluids.flow` — head (10 m water ≈ 1 bar), friction drop ∝ velocity² (turbulent), design velocities 1–3 m/s, DN, Reynolds (2,300 / 4,000).
2. `eng.fluids.pumps` — centrifugal vs positive displacement (relief valve), pump curve, system curve, duty point, BEP and preferred operating region (~70–120% of BEP), throttling losses, hydraulic power ρ·g·Q·H.
3. `eng.fluids.cavitation` — vapour pressure, symptoms, NPSHa vs NPSHr, what lowers NPSHa, never throttle suction.
4. `eng.fluids.speed` — affinity laws (Q ∝ n, H ∝ n², P ∝ n³), throttling vs speed control, static head limits savings, load profile, VFD side effects.
5. `eng.fluids.heat` — plate vs shell-and-tube, Q = m·cp·ΔT and Q = U·A·ΔTmean, counterflow vs parallel flow, approach, fouling.
6. `eng.fluids.steam` — latent heat of saturated steam (~2,050 kJ/kg at 7 bar(g), ~170 °C), steam traps (fail open / fail closed, water hammer), trap failure rates, condensate return.

Facts and sources
- Pump curves, system curves, BEP, preferred operating region 70–120% of BEP: ANSI/HI 9.6.3 *Rotodynamic Pumps – Guideline for Operating Regions*; Grundfos, *Pump Handbook*.
- NPSH definitions and margins: ANSI/HI 9.6.1 *NPSH Margin*; Grundfos *Pump Handbook*. Water vapour pressure 2.34 kPa at 20 °C, 47.4 kPa at 80 °C, 84.5 kPa at 95 °C: steam tables (IAPWS-IF97).
- Affinity laws and the limit of savings with static head: US DOE / Hydraulic Institute, *Improving Pumping System Performance: A Sourcebook for Industry*, 2nd ed.; Europump & HI, *Variable Speed Pumping: A Guide to Successful Applications*.
- Turbulent pressure drop ∝ v² (Darcy–Weisbach), Reynolds transition ~2,300 / ~4,000: Perry’s *Chemical Engineers’ Handbook*, 9th ed., section 6; Crane TP-410.
- Heat exchanger basics (U·A·LMTD, counterflow): Incropera et al., *Fundamentals of Heat and Mass Transfer*; Kakaç & Liu, *Heat Exchangers*.
- Saturated steam: 8 bar(a) ≈ 170.4 °C, hfg ≈ 2,048 kJ/kg; 4 bar(a) ≈ 143.6 °C; 7 bar(a) ≈ 165 °C: steam tables (Spirax Sarco steam tables; IAPWS-IF97).
- Steam trap failure 15–30% in systems not maintained for 3–5 years: US DOE, *Steam Tip Sheet #1: Inspect and Repair Steam Traps*; Spirax Sarco, *The Steam and Condensate Loop*.
- VFD efficiency ~97%: typical manufacturer data (ABB, Siemens drive technical guides); bearing currents: ABB *Technical Guide No. 5*.

Numbers in questions (checked): 0.5 × 1.5² = 1.125 bar; 30 m ≈ 3 bar; 1,000 × 9.81 × 0.02 × 25 = 4.9 kW; NPSHa = 10.3 + 2 − 1.5 − 0.4 = 10.4 m; 0.5³ × 40 = 5 kW; 0.75 × 200 = 150 m³/h; 2 × 4.0 × 40 = 320 kW; 320 / 42 = 7.6 kg/s; 410 × 3,600 / 2,050 = 720 kg/h.

Uncertain / simplified: the throttled power at 70% flow (25.5 kW), the 15 kg/h loss per failed trap and €40 per tonne of steam are stated as assumptions in the examples; real values vary by orifice size, pressure and fuel price.

## Clarity round (2026-11-04)
Every lesson now has 5 teach blocks (≤ 90 words) and 5–6 terms, en and nl in the same order; each term appears literally (singular) in its lesson’s teach text. Level 2, so basics are re-explained briefly where they are used (centrifugal pump, density, turbulent, bar absolute, CIP, impeller). Jargon explained in place: erosion, cross-section, viscosity, strainer, impeller, relief valve, mechanical seal, impeller trim, suction line, water hammer, harmonics, bearing currents, differential pressure, baseline, gaskets, parallel flow, wort, chiller, live steam, flash steam, scale. The .nl files add the English word in parentheses once for important unlisted words (afsluiters (valves), dichtheid (density), debiet (flow), vuilfilter (strainer), waaier (impeller), overdrukventiel (relief valve), mechanische afdichting (mechanical seal), zuigfilter (suction strainer), harmonischen (harmonics), nulmeting (baseline), meestroom (parallel flow), koelmachine (chiller), latente warmte (latent heat), ketelsteen (scale)).

Term changes: flow + Laminar, + Turbulent; pumps + Pump curve, + System curve; cavitation + Suction line; speed + Throttling (nl Smoren); heat + Heat duty (nl Warmtelast), + Approach (nl Naderingstemperatuur); nl “Vervuiling (fouling)” → Vervuiling (English shown by position); steam + Flash steam (nl Nastoom).

New facts in the fifth blocks and where they come from
- Fittings counted as equivalent length of straight pipe: Crane TP-410, *Flow of Fluids*. Pipe sizing as a trade-off between capital cost and lifetime pumping energy (“economic pipe diameter”): Perry’s 9th ed., section 6 / 9; Europump & HI, *Pump Life Cycle Costs*.
- Reynolds examples: water 1,000 × 1.4 × 0.05 / 0.001 = 70,000; syrup ≈ 1,300 kg/m³ at ≈ 1 Pa·s: 1,300 × 1.4 × 0.05 / 1 = 91 (below 100).
- Positive displacement pumps need a relief valve; centrifugal pumps at shut-off (zero flow) heat the trapped liquid: Grundfos *Pump Handbook*; HI standards.
- Oversizing from stacked design margins: US DOE / HI, *Improving Pumping System Performance: A Sourcebook for Industry*, 2nd ed.
- NPSHr is published as NPSH3, the NPSH at which head drops 3%, so the pump already cavitates at NPSHa = NPSHr; recommended NPSH margin ratios NPSHa/NPSH3 about 1.1–2.0 by application, the high end for high suction energy (large, fast) pumps and hot water: ANSI/HI 9.6.1 *Rotodynamic Pumps – Guideline for NPSH Margin*. Example margin 3.7 / 3.0 = 1.23.
- 50 Hz = full speed on European grids; 40 Hz = 80%. Cube-law savings are optimistic because motor and pump efficiencies fall at low speed: Europump & HI, *Variable Speed Pumping*. Harmonics, bearing currents: ABB *Technical Guide No. 5* and No. 6.
- Pasteurised side kept at higher pressure than raw side so plate pinholes leak the safe way: Tetra Pak *Dairy Processing Handbook* (pasteuriser layout, booster pump); US PMO requirement.
- Flash steam from 8 bar(a) (hf ≈ 721 kJ/kg) to atmospheric (hf ≈ 419, hfg ≈ 2,257): (721 − 419) / 2,257 = 13.4%. Live steam clear near the outlet vs lazy white flash steam: Spirax Sarco, *The Steam and Condensate Loop* (trap testing).
- Condensate returned at ~90 °C instead of make-up water at ~10 °C: (377 − 42) / (2,769 − 42) ≈ 12% of the heat the boiler puts in, “roughly a tenth”: steam tables; US DOE *Steam Tip Sheet #8: Return Condensate to the Boiler* (states ~10–20% savings depending on conditions).
- Trap testing by ultrasound or temperature: US DOE *Steam Tip Sheet #1*.

Recalculated: DN50 0.00278 / 0.00196 = 1.42 m/s; DN80 at 20 m³/h: 0.00556 / 0.00503 = 1.11 m/s, drop 3.2 × (1.11/2.83)² × (50/80) = 0.31 bar; 1,000 × 9.81 × 0.01667 × 45 = 7.36 kW, × 25 = 4.09 kW, difference 3.27 kW × 8,000 h = 26,200 kWh; 0.16 bar / (962 × 9.81) = 1.70 m; 0.7³ × 30 = 10.29 kW; 30 × 1.03 × 2,000 + 10.29 × 1.03 × 6,000 = 61,800 + 63,600 = 125,400 kWh; 213,000 − 125,400 = 87,600 kWh × €0.15 = €13,140; 5,000 × 3.8 × 40 / 3,600 = 211 kW; 760,000 / 42 = 18,095 kg/h; 15 kg/h × 8,000 h = 120 t × €40 = €4,800 × 30 = €144,000. All recall numbers, ids and answer positions unchanged.

Uncertain: “nastoom” is the Dutch word used in Dutch steam literature for flash steam, but many Dutch engineers simply say “flashstoom”; the nl text gives the English “flash steam” next to it. The 1.1–2.0 NPSH margin range is a summary of the HI 9.6.1 table, which varies by application.

Review (2026-11-04): nl term “Nastoom” → “Flashstoom” (“ook wel nastoom genoemd” in the teach text): flashstoom is what most Dutch plant engineers say (flashvat, flashstoomterugwinning). Flash fraction rechecked with IAPWS-IF97: 8 bar(a) hf 720.9, 1.013 bar(a) hf 419.1, hfg 2,256.5 → 13.4%. NPSH margin text now says “roughly 1.1 to 2 times, depending on the application; more for large, fast pumps” (dropped “and hot water”, not a general HI rule); the example’s 1.2 ratio is flagged as the low end, to confirm with the pump maker; Hydraulic Institute explained as the American pump association. Explained in place: heat exchanger (flow lesson), condensate (heat lesson), live steam, vent. nl adds (approach), (fouling).

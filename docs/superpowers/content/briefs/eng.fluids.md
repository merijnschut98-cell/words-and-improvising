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

## v13 topics (2026-11-08): 4 topics × 4 levels

| Topic (id) | 1 Basis | 2 Werkkennis | 3 Gevorderd | 4 Expert |
|---|---|---|---|---|
| Flow and pressure in pipes (`pipes`) | `flow` (existing, worked) | `friction` (new): Darcy–Weisbach, velocity head, friction factor, laminar f = 64/Re, Moody chart, roughness, minor losses (K) | `valves` (new, faded): control valve, Kv/Cv, valve authority, pressure survey, Joukowsky pressure surge | `sizing` (new, faded): 1/D⁵, economic pipe diameter, life-cycle cost, friction power, shear-thinning food products, parallel line |
| Pumps (`pumps`) | `pumps` (existing, worked) | `speed` (existing, worked) | `cavitation` (existing; example now faded) | `pumpsystem` (new, faded): wire-to-water efficiency, specific pumping energy, system imbalance, impeller trimming, parallel pumps, staging |
| Heat transfer and heat exchangers (`heat`) | `transfer` (new): conduction, convection, U-value, thermal conductivity, insulation and bare-surface losses | `heat` (existing, worked; keeps Approach, the term eng.process’s pinch lesson points to) | `lmtd` (new, faded): LMTD, typical U, fouling resistance and margin (TEMA), rating from plant data, sensor error | `recovery` (new, faded): pasteuriser regeneration efficiency, cleaning-interval economics, thermal storage, economiser, pointer to pinch |
| Steam and utilities (`utilities`) | `steam` (existing, worked) | `cooling` (new): once-through, cooling tower, wet bulb, cycles of concentration, blowdown, chiller COP, Legionella (Bal) | `steamloss` (new, faded): cost per tonne of steam, flue gas loss, blowdown, cycling, trap test intervals, flash vessel, condensate return, steam balance | `audit` (new, faded): weekend base-load walk, energy baseline (fixed + variable), demand-first order, payback, Dutch energy-saving obligation and recognised measures list |

Why this split: the six existing lessons sit where their depth fits: flow, pumps, steam (1), speed and heat (2), cavitation (3, NPSH margins are the hardest of the six; its example became faded with the same story and numbers). Ten new lessons complete each topic. Compressed air stays in eng.power (pointed to from `audit` and `recovery`), motors and drives too (pointer in `speed`); vibration and seals in eng.maintenance (pointer in `pumps`).

Existing lessons: ids, recall order, answer positions and numbers unchanged (pinned in `tests/fixtures/v13-eng.fluids-recall-keys.json`, built from the files before this change). Wording changes only: distractors rewritten where the correct option was the unique longest (all six lessons, en and nl), pre answers moved for balance, own hints on every numeric recall question, a pointer to Maintenance (pumps) and to Motors, drives and fluid power (speed), DOE source named for the 15–30% failed traps (steam).

Shared definitions (checked by script against every eng module):
- Identical to eng.power (rebuilt v124, which copied the first three and the affinity-law sentence from this module): VFD / Frequentieregelaar, Affinity laws / Affiniteitswetten, Throttling / Smoren; also Base load / Basislast, Energy baseline / Energiebaseline, Life-cycle cost / Levensduurkosten, Payback time / Terugverdientijd.
- Identical to eng.cost: Payback time / Terugverdientijd. Identical to eng.reliability: Life-cycle cost / Levensduurkosten. Identical to eng.process: Utility / Utilities, Regeneration section / Regeneratiesectie. Identical to eng.drawings: Control valve / Regelklep.
- Same word, different meaning, left as is: Load profile (here hours per flow; power and transformers: load over time), Rating (here exchanger rating; gridplanning: current rating). eng.lines words Payback time differently from eng.cost; this module follows eng.cost.

Answer positions (pre + recall MC, en = nl): 12 / 12 / 13 / 14. Correct option never the unique longest (script, en and nl). Length rank of the correct option over 51 MC (1 = longest, only ties): en 9 · 12 · 16 · 14; nl 5 · 17 · 10 · 19.

Facts and sources (checked 2026-11-08):
- US DOE / Hydraulic Institute, Improving Pumping System Performance: A Sourcebook for Industry (2nd ed., 2006): pumps 27% of industrial-system electricity in US manufacturing; pump efficiencies 50–60% or lower common; efficiency can degrade 10–25% before replacement; many control valves run under 50% open; flag pumps 30% or more from BEP and system imbalance above 20%; impeller trim 2% → about 2% flow, 4% head, 8% power, rarely below 70% of original diameter; Tip Sheet #9: 6-inch → 8-inch pipe cuts friction pumping cost about 4× ((8/6)⁵ = 4.2).
- Hydraulic Institute NPSH margin guideline (ANSI/HI 9.6.1): NPSHa/NPSHr roughly 1.1–2 (as before).
- Darcy–Weisbach and Moody (1944); laminar f = 64/Re; Moody-chart accuracy about ±15% (F. White, Fluid Mechanics); roughness drawn tubing 0.0015 mm, commercial steel 0.045 mm; K values hedged (elbow 0.2–1.5, open gate 0.2, open globe 5–10).
- Kv (IEC 60534): m³/h of water at 1 bar; Cv ≈ 1.16 Kv. Joukowsky Δp = ρ·a·Δv; a ≈ 1,000–1,400 m/s in water-filled steel pipe.
- US DOE Steam Tip Sheet #2: bare 2-inch line at 150 psig loses 480 MMBtu/yr per 100 ft (= 527 W/m, taught as roughly 500 W/m for about DN50 at about 10 bar(g)); insulation typically cuts losses 90%; insulate surfaces above 120 °F (about 50 °C). Tip Sheet #17: 4-inch valve at 300 °F saves 2,300 Btu/h with a cover (= 0.67 kW, taught as roughly 0.7 kW for DN100 at 150 °C).
- US DOE Steam Tip Sheet #1: 15–30% of traps may have failed in systems not maintained for 3–5 years; test weekly–monthly at high, monthly–quarterly at medium, at least yearly at low pressure.
- US DOE Compressed Air Tip Sheet / eng.power: leaks often 20–30% of output (pointer only).
- Tetra Pak Dairy Processing Handbook (ch. 8.1): regenerative effect 90–94%.
- FEMP cooling tower guidance and EPA WaterSense at Work 6.3: many towers 2–4 cycles, 6+ possible; blowdown = evaporation / (cycles − 1) derived from make-up = evaporation + blowdown. Evaporation rule from the energy balance (4.2/2,400 = 0.175% per °C, taught as roughly 1% per 6 °C).
- Besluit activiteiten leefomgeving §4.46 (art. 4.570–4.572): Legionella risk analysis, management plan, logbook for wet cooling towers (RIVM, IPLO).
- RVO, energiebesparingsplicht: from 50,000 kWh electricity or 25,000 m³ natural gas (equivalent) per year; all measures with payback ≤ 5 years by legal method and prices; report every 4 years (informatieplicht) with the Erkende maatregelenlijst; onderzoeksplicht from 10 million kWh or 170,000 m³.
- Steam tables: 10 bar(g) saturated ≈ 2,780 kJ/kg, water 80 °C ≈ 335 kJ/kg; Dutch natural gas 31.65 MJ/m³ (LHV). Flash from 7 bar(g): (721 − 419)/2,257 = 13.4%.
- Rules of thumb hedged in text, no single source: U ranges (plate 3,000–7,000, shell and tube 800–1,500 W/m²K), fouling margin 10–25%, valve authority 0.3–0.5, chiller COP 3–6 and a few percent per degree, tower approach a few degrees, CIP velocity about 1.5 m/s, economiser and blowdown “a few percent”.

Recalculations (all by script, scratchpad fluids/calc.py):
- friction: Re 160,000; 0.02 × 1,250 × 2,000 = 50,000 Pa; elbows 10,000; globe 16,000; 0.76 bar. r0 0.28125 bar; r1 64/800 = 0.08.
- valves: Kv 20/√3 = 11.5 (29% of 40); 3.0/4.2 = 71%; 2 bar × 20 m³/h = 1.1 kW; r0 25 × 2 = 50; r1 1,000 × 1,200 × 1.5 = 18 bar; teach 12 bar at 1 m/s.
- sizing: DN80 3.32 m/s, 4.12 bar; DN100 2.12 m/s, 1.35 bar (ratio 0.328 = 0.8⁵); 4.62 kW hyd, 7.1 kW el, 42,600 kWh, €6,400, payback 2.8 y; teach 1.39 kW → 17,100 kWh; r0 (50/65)⁵ = 26.9%; r1 14,815 kWh.
- pumpsystem: 0.95 × 0.97 × 0.70 = 64%; delivered 34.3 kW, w2w 43%, need 22.9 kW, imbalance 50%, 32.7 kW, saving 47.3 kW → 378,400 kWh, €56,800; r0 60%; r1 0.2 kWh/m³; r2 1 − 0.95³ = 14.3%.
- transfer: 21.2 + 5.4 = 26.6 kW; 212,800 kWh; /0.85 = 250,400; × 0.045 = €11,300; 90% = €10,100; r0 2.4 kW; r1 90,000 kWh.
- lmtd: 20/ln 3 = 18.2; 780 kW, LMTD 15.96, U 4,071 (18.6% below 5,000), Rf 4.6e-5; r0 21.6; r1 10 m².
- recovery: 63.5/69.1 °C, 233/109 kW, 124 kW each side, €24,900 + €24,900; r0 90%; r1 109.2 kW.
- cooling: E 2,100 kg/h; make-up 3.15 → 2.63 m³/h; 3,150 m³/yr, €6,300; r0 1.4; r1 1.0.
- steamloss: 2,445 MJ/t, 2,778 MJ gas, 87.8 m³, €39.5/t; 6,000 t × 12.0 m³ = 72,200 m³, €32,500 + €18,000; r0 94.8 m³; r1 60.
- audit: paybacks 0.13, 0.24, 2.8, 6.7 y; r0 2 y; r1 570,000 kWh.

Uncertain: Dutch term choices Lokale weerstand (minor loss), Drukprofiel (pressure survey), Klepautoriteit, Systeemrendement (wire-to-water), Bijschakelen (staging), Controleberekening (rating), Indikkingsfactor, Spui, Energiebaseline. The 0.7 kW valve and 500 W/m pipe figures are converted from DOE tables in US units and conditions (75 °F air, no wind).

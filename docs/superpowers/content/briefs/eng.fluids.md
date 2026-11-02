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

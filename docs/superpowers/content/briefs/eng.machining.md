# eng.machining — Machining (engineering, track discrete, level 1)
Index title: en 'Machining' / nl 'Verspanen'. Blurb: en 'Turning, milling, drilling and CNC: how metal parts are cut and what makes them slow or scrap.' / nl 'Draaien, frezen, boren en CNC: hoe metalen onderdelen worden gemaakt en wat ze traag of afkeur maakt.'
1. `eng.machining.processes` — turning, milling, drilling, grinding; which shapes come from which.
2. `eng.machining.cnc` — CNC basics: axes, G-code idea, programs, zero points, why first-off parts are checked.
3. `eng.machining.cutting` — cutting speed, feed, depth of cut; cycle time from them; trade-offs.
4. `eng.machining.tools` — tool wear and tool life, coolant, tool changes, why tool management drives uptime.
5. `eng.machining.fixtures` — fixtures and clamping, setup time, workholding errors as a scrap cause.
6. `eng.machining.quality` — surface finish, measuring (calipers, CMM), typical defects and their causes.

Deepened 2026-11-04: every technical term explained at first use (incl. pre questions, options, examples, said lines), 4–5 teach blocks per lesson, 6 terms per lesson. Recall questions unchanged in what they test and in order.

## Numbers, sources and recalculations

### Tolerances and fits (ISO 286-1/-2)
- IT6 for 30–50 mm = 16 µm → Ø35 k6 = +0.002/+0.018 mm (16 µm band). IT6 for 18–30 mm = 13 µm → Ø30 h6 = 29.987–30.000. IT7 for 30–50 mm = 25 µm → Ø40 H7 band 0.025 mm. Source: ISO 286-2 tables (e.g. engineeringtoolbox.com "ISO tolerances for holes/shafts").
- Turning ±0.02 mm, grinding ±0.005 mm or better: typical achievable IT7–IT8 vs IT5–IT6 at these sizes (Kalpakjian & Schmid, Manufacturing Engineering and Technology, process capability chart).
- Drilled holes come out 0.02–0.1 mm oversize, reamer stock 0.1–0.3 mm on diameter: Sandvik Coromant hole-making guide; Machinery’s Handbook (reaming allowances).
- Deep-hole risk beyond ~5 × D for standard twist drills without through-coolant: Sandvik drilling guide (twist drills 3–5 × D standard). Recall: 60 / 8 = 7.5 × D.

### Cutting data (Sandvik Coromant Training Handbook / turning catalogue)
- Carbide Vc: steel 150–300, stainless 100–200, aluminium 300–1,000+, titanium 40–80 m/min; HSS in steel ~30 m/min.
- n = Vc × 1000 / (π D): Ø50 at 200 → 200,000 / 157.08 = 1,273 rpm. Recall: 150,000 / (π × 40 = 125.66) = 1,194 rpm.
- Constant surface speed (G96) with max-rpm clamp (G50/G92 on Fanuc): lathe speeds up towards the centre.
- Q = Vc × ap × f (cm³/min) — Sandvik formula.
- Taylor V·T^n = C with n ≈ 0.25 for carbide: 1.2^(1/0.25) = 2.07 → +20% speed ≈ half tool life; 1.3^4 = 2.86 → +30% speed leaves 35% of tool life ("more than half" cut).
- Example: n = 220,000 / 188.5 = 1,167 rpm; 0.3 × 1,167 = 350 mm/min; 200/350 = 0.571 min = 34.3 s. f 0.4 → 467 mm/min → 0.428 min = 25.7 s; saving 8.6 s × 3 passes × 5,000 = 129,000 s = 35.8 h ≈ 36 h.
- Recall pass time: 0.2 × 1,000 = 200 mm/min; 100/200 = 0.5 min = 30 s.

### CNC
- Spindle motors 10–40 kW typical for machining centres/lathes (e.g. Haas VF-2 22.4 kW, DMG Mori CMX 50 U 13–25 kW).
- G00/G01/G02/G03/M03/M06/M08/G54: standard ISO 6983 / Fanuc codes.
- Spindle crash cost €5,000–€30,000 plus days–weeks downtime: spindle rebuild quotes typically €5k–€20k, replacement spindles on 5-axis up to €30k+ (spindle service companies, e.g. GTI Spindle, Setco published ranges). Rounded range, stated as "can cost".
- Example: 121.43 − 112.43 = 9 mm; 200 × €35 = €7,000. Recall: 149 × €28 = €4,172.

### Tools and coolant
- Tooling ≈ 3% of part cost: Sandvik Coromant ("cutting tools represent about 3% of manufacturing cost"), widely quoted.
- Emulsion 5–8%, refractometer check; anaerobic bacteria cause rotten-egg (H2S) smell after standstill ("Monday morning smell"): coolant suppliers (Blaser, Fuchs technical notes).
- High-pressure through-tool coolant ~70 bar: Sandvik / machine builders' standard HP option (70 bar / 1,000 psi).
- Example: €12 / 4 = €3; €3/80 = €0.0375; €3/100 = €0.03; diff €0.0075 × 1,000 = €7.50. Break: €45 + 0.5 h × €90 = €90. Recall: €16 / 4 / 50 = €0.08.

### Fixtures
- Cutting share 30–50% in job shops: commonly cited spindle utilisation figures (e.g. MachineMetrics / Memex benchmark reports: average CNC utilisation ~30–40%).
- Zero-point systems repeat within 0.005 mm (Schunk VERO-S, Lang Quick•Point: repeatability < 0.005 mm).
- Example: 90 → 25 min = 65 min × 8 = 520 min = 8.67 h.

### Quality and measuring
- Ra ranges per process: ISO 1302 / Machinery’s Handbook surface roughness chart.
- Caliper reads 0.01, real ±0.02–0.03 mm (DIN 862 max permissible error ±0.02–0.03 for 0–150 mm); micrometer 0.001 mm (DIN 863). Ten-to-one rule (gauge 10× finer than tolerance): common metrology rule of thumb.
- Linear expansion: steel 11.5 × 10⁻⁶ /K, aluminium 23 × 10⁻⁶ /K. 200 mm × 0.0115 × 10 / 1000 = 0.023 mm. Ø30: 30 × 0.0115 × 15 / 1000 = 0.0052 mm → 29.990 − 0.005 = 29.985 (below 29.987). Recall: 0.5 × 0.023 × 10 = 0.115 mm. Reference temperature 20 °C: ISO 1.

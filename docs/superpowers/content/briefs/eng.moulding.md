# eng.moulding — Injection moulding (engineering, track discrete, level 2)
Index title: en 'Injection moulding' / nl 'Spuitgieten'. Blurb: en 'How plastic parts are made, what drives cycle time and why parts warp, sink or flash.' / nl 'Hoe kunststof onderdelen worden gemaakt, wat de cyclustijd bepaalt en waarom delen kromtrekken, inzakken of braam hebben.'
1. `eng.moulding.machine` — the machine: hopper, screw, barrel, mould, clamp force; the cycle steps.
2. `eng.moulding.cycle` — cycle time breakdown; cooling dominates; cavities and output per hour.
3. `eng.moulding.materials` — common plastics (PP, ABS, PA, PC), drying, regrind, colour changes.
4. `eng.moulding.defects` — short shot, flash, sink marks, warpage, burn marks; what causes each.
5. `eng.moulding.process` — process window, the main parameters, scientific moulding idea, why “just tweak it” is risky.
6. `eng.moulding.tooling` — mould maintenance, mould changes (SMED), hot runners, mould cost and lead time.

## Deepening pass (2026-11-04): numbers, sources and recalculations

Same 6 lesson ids, 4 recall questions each in the same order; teach expanded to 5 blocks per lesson, every term explained at first use. Figure `eng.moulding.cycle` unchanged; its asserted numbers (3 mm wall → 12 s cooling, 20 s cycle, 2 cavities, 360/h; 2.4 mm → 7.68 s cooling, 15.7 s, 459/h) are kept verbatim in the cycle example.

Sources used: Rosato & Rosato, *Injection Molding Handbook* (3rd ed.); Bryce, *Plastic Injection Molding: Manufacturing Process Fundamentals* (SME); Kulkarni, *Robust Process Development and Scientific Molding* (Hanser); Malloy, *Plastic Part Design for Injection Molding* (Hanser); resin supplier processing guides (BASF Ultramid, Covestro Makrolon, Borealis PP); SPI/PLASTICS mould classification (Class 101 = 1,000,000+ cycles); AIAG PPAP manual (significant production run, 300 parts).

| Lesson | Number | Check |
|---|---|---|
| machine | 1 bar ≈ 1 kg per cm²; 400 bar on 1 cm² = 0.4 t | 1 bar = 10 N/cm² = 1.02 kgf/cm² |
| machine | 0.3–0.6 t per cm² projected area | = 300–600 bar mean cavity pressure; handbooks give 2–5 tsi ≈ 0.3–0.8 t/cm² |
| machine | 15 × 20 = 300 cm² × 0.4 = 120 t; ×2 = 240 t; +10–20% → 264–288 t → 280/300 t press | recalculated |
| machine r1 | 250 × 0.4 = 100 t | recalculated |
| cycle | 30 s = 2 + 1.5 + 6 + 15 + 2 + 3.5 | sums to 30 |
| cycle | cooling ∝ s² | 1-D conduction solution t = s²/(π²α)·ln(…) |
| cycle | 3,600/24 × 4 = 600/h; 3,600/20 × 2 = 360; 12 × 0.64 = 7.68; 8 + 7.68 = 15.68 s; 3,600/15.68 × 2 = 459.2 (+27.6%) | recalculated; matches figure build asserts |
| cycle situation | 26/22 = 1.18 (+18% time); 22/26 = 0.846 (−15% output) | recalculated |
| materials | shrinkage amorphous ≈ 0.5% (ABS 0.4–0.7, PC 0.5–0.7), semi-crystalline 1–2% (PP 1.0–2.5, PA6 0.7–2.0) | supplier datasheets |
| materials | drying 2–4 h at 80–120 °C (PA 80 °C, PC 120 °C, PBT 120 °C; PET 160–170 °C), dew point −40 °C | supplier guides |
| materials | dryer 4 h × 12 kg/h = 48 kg; top-up 20 kg used in 20/12 = 1.67 h | recalculated (old text said “1.5 h”, corrected to 1.7) |
| materials r1 | 3 × 20 = 60 kg | recalculated |
| materials | regrind 10–25% customer limits | typical OEM specs |
| defects | vent depth 0.01–0.05 mm (PP ≈ 0.015–0.02, ABS/PC ≈ 0.03–0.05) | Rosato; mould-component suppliers |
| defects r1 | 400 × 0.5 = 200; 200 − 160 = 40 t | recalculated |
| process | PP melt ≈ 230 °C (range 200–280), mould 20–80 °C | Borealis PP guide |
| process | switchover at 95–98% full; r1 96% × 100 cm³ = 96 cm³ | Kulkarni (decoupled II) |
| process | gate freeze study: part weight vs hold time until weight plateaus | Kulkarni |
| tooling | mould €20k–€300k; lead time 10–16 weeks; PM every 50k–100k shots; production mould 1M+ shots | industry ranges; SPI Class 101 |
| tooling | 40 × (1.5 − 0.5) = 40 h/week; × €60 = €2,400; × 46 = €110,400; payback 55,000/2,400 = 22.9 weeks | recalculated |
| tooling r1 | 15 × 1.5 = 22.5 h | recalculated |

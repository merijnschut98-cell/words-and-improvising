# eng.quality — Quality basics (engineering, track basics, level 1)
Index title: en 'Quality basics' / nl 'Kwaliteit: de basis'. Blurb: en 'Tolerances, capability, control charts and root cause: how engineers talk about good parts.' / nl 'Toleranties, procesgeschiktheid, regelkaarten en oorzaakanalyse: hoe engineers over goede onderdelen praten.'
1. `eng.quality.tolerance` — nominal, tolerance, spec limits; why every dimension has one; what “out of spec” costs.
2. `eng.quality.variation` — common vs special cause variation; mean and standard deviation in plain words.
3. `eng.quality.capability` — Cp and Cpk: what they mean, 1.33 as a common target, centred vs not centred.
4. `eng.quality.spc` — control charts (X-bar/R), control limits ≠ spec limits, the rules that signal a problem.
5. `eng.quality.fmea` — FMEA: severity, occurrence, detection, RPN/action priority; using it before a launch.
6. `eng.quality.controlplan` — control plan and measurement (gauges, MSA/gauge R&R in one idea), PPAP in one paragraph.

## Clarity round (2026-11-04)

Every lesson now has 5 teach blocks (all ≤ 80 words), every term explained in plain words at first use (also in pre questions, examples and situations: Ø, microns, bore, bushing, lathe, press brake, fixture, spindle play, offset, insert, setting master, poka-yoke, design freeze, 8D, supplier rating), 5–6 terms per lesson in the same order in en and nl. Ids, recall order, answer positions, numbers and the figure (`eng.quality.capability`: spec 9.95–10.05, σ 0.0125 mm, Cp 1.33, target 1.33) unchanged; teach block 1 of the capability lesson still states tolerance 0.10 mm, σ 0.0125 mm, 6σ 0.075, Cp 1.33.

Terms added or reshaped (term names now appear literally in the teach text): tolerance — Spec limits (replaces “USL / LSL”), General tolerance, Nonconforming, Deviation (was “Deviation (concession)”); variation — Standard deviation (was “… (σ)”), Normal distribution, Tampering; capability — Capability / Procesgeschiktheid (Ppk now explained in the teach text); spc — SPC, Control chart / Regelkaart, Subgroup / Steekproef (“Spec limits” moved to the tolerance lesson, defined once); fmea — Severity, Occurrence, Detection (PFMEA / DFMEA explained in text instead); controlplan — Repeatability / Herhaalbaarheid, Reproducibility / Reproduceerbaarheid.

Recalculations and sources:
- Tolerance: Ø12 +0.018/0 = H7 for 10–18 mm (ISO 286). ISO 2768-m: ±0.2 mm for over 6 up to 30 mm. Hair ≈ 70 µm, so ±10 µm ≈ 1/7 hair. Example: 15 / 500 = 3%; 15 × 4.50 = 67.50; 500 × 0.80 = 400; 400 + 250 + 67.50 = 717.50 ≈ 10.6 × 67.50 (“ten times”). 1-10-100 rule as a rule of thumb.
- Variation: 68 / 95 / 99.7% rule. Tampering: Deming’s funnel rule 2 doubles the variance, so σ × √2 ≈ +41% (“about 40%”). Deming: 94% of problems belong to the system (*Out of the Crisis*, 1986) → “over 90%”. Example 20.003 ± 0.024 = 19.979 … 20.027.
- Capability: 0.10 / 0.075 = 1.333; shift 0.025 → 0.025 / 0.0375 = 0.667. Centred Cpk 1.33 = ±4σ → 2 × 31.7 = 63 ppm; 1.67 = ±5σ → 0.57 ppm; 1.0 = ±3σ → 2,700 ppm. Ppk ≥ 1.67 for preliminary studies and 125 readings (25 subgroups × 5) per AIAG PPAP / SPC manuals. Example: 0.040 / 0.024 = 1.67; 0.014 / 0.012 = 1.17; 0.020 / 0.012 = 1.67.
- SPC: Shewhart, Bell Labs, 1924. A2 (n = 5) = 0.577; 0.577 × 0.020 = 0.01154 → 19.9885 … 20.0115; recall UCL 50 + 0.0577 = 50.0577. Run rules: AIAG 7, Western Electric 8, Nelson 9 on one side; Nelson trend rule 6 rising; WE 2 of 3 beyond 2σ.
- FMEA: AIAG-VDA FMEA Handbook, 1st ed. June 2019 (Action Priority replaces RPN). Example 8 × 5 × 7 = 280 → 8 × 5 × 2 = 80; recall 7 × 4 × 5 = 140.
- Control plan: AIAG MSA 4th ed. %GRR under 10 / 10–30 / over 30%. Example 0.04 / 10 = 0.004; 10 × 3 × 3 = 90; 6 × 0.001 = 0.006; 0.006 / 0.04 = 15%. PPAP level 3 = PSW + samples + full supporting data (default).

Facts fixed: the “said” line in the capability lesson read “Cp is 1.7 but Cpk is 1.1” while the example gives 1.67 and 1.17 (1.17 rounds to 1.2, not 1.1); it now says 1.67 and 1.17. The SPC teach text said control limits sit at “±3σ of the process itself”; for an X-bar chart they are ±3σ of the averages (σ/√n), now stated so.

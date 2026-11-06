# eng.spc — Measurement and SPC in depth (engineering, track basics, level 3, FADED examples)
Index title: en 'Measurement and SPC in depth' / nl 'Meten en SPC verdiept'. Blurb: en 'Beyond the basics: gauge studies, visual inspection, choosing charts, Cpk versus Ppk, skewed data and over-adjustment.' / nl 'Voorbij de basis: meetsysteemanalyse, visuele inspectie, de juiste kaart, Cpk tegen Ppk, scheve data en overbijsturen.'

Why: eng.quality (level 1) introduces tolerance, Cpk, X-bar/R and the R&R bands; eng.improve touches measurement. Quality discussions at clients go further: why an R&R "passes" but SPC is useless, why visual inspection misses, why a supplier’s Cpk 2 turns into Ppk 1, how skewed characteristics fool the formula, and why operators adjusting on every part makes things worse. This is the level-3 deepening the learner asked for.

1. `eng.spc.msa` — %tolerance vs %study variation, part selection, ndc ≥ 5, EV vs AV diagnosis, bias/linearity/stability, resolution rule of ten.
2. `eng.spc.attribute` — attribute agreement analysis, kappa (≥ 0.75 good, < 0.4 poor), escapes vs false rejects, ~80% effectiveness of 100% visual inspection, boundary samples.
3. `eng.spc.charts` — I-MR, X-bar/R, X-bar/S, p, np, c, u; p-chart limits; rational subgrouping (multi-cavity trap); freezing limits.
4. `eng.spc.ppk` — Cpk (within sigma, R̄/d2) vs Ppk (overall sigma), stability first, automotive targets (Ppk ≥ 1.67 initial, Cpk ≥ 1.33 ongoing), ppm guide (1.0 ≈ 2,700; 1.33 ≈ 63; 1.67 under 1).
5. `eng.spc.nonnormal` — bounded/skewed characteristics, one-sided Cpu, fitted distributions and ISO 22514 percentile method, non-normality as a symptom (mixtures, clipping, rounding).
6. `eng.spc.tampering` — Deming’s funnel (rule 2 doubles the variance, σ × 1.41), adjust only on signals, planned wear compensation, reaction plans, filtering in automatic feedback.

Facts and sources
- AIAG, *Measurement Systems Analysis (MSA)*, 4th ed.: GRR bands (under 10%, 10–30%, over 30%), ndc ≥ 5, bias/linearity/stability studies, attribute agreement and kappa guidance (≥ 0.75 good, < 0.40 poor).
- AIAG, *Statistical Process Control (SPC)*, 2nd ed.; Montgomery, *Introduction to Statistical Quality Control*, 8th ed.: chart selection, p-chart limits p̄ ± 3√(p̄(1 − p̄)/n), rational subgroups, Cpk vs Ppk definitions.
- AIAG, *PPAP*, 4th ed.: initial process study Ppk ≥ 1.67 (Cpk ≥ 1.33 for ongoing, per customer requirements).
- Normal tail areas: 3σ one side 1,350 ppm (2,700 two-sided), 4σ 31.7 ppm one side (63 two-sided), 5σ 0.29 ppm one side (0.57 two-sided): standard normal tables.
- ISO 22514-2:2017 (process capability for time-dependent models; percentile method with 0.135% and 99.865% quantiles); ISO 22514-4.
- Visual inspection effectiveness around 80%: Juran’s *Quality Handbook* (inspection accuracy chapter); See, J.E., *Visual Inspection: A Review of the Literature*, Sandia Report SAND2012-8590 (reported accuracies commonly 70–90%).
- Funnel experiment: Deming, *Out of the Crisis* (1986) and *The New Economics* (1993), rule 2 doubles the variance.

Numbers in questions (checked): 0.10/10 = 0.01 mm; 0.2 × 2,000 = 400; p-chart UCL 0.05 + 3√(0.0475/100) = 0.1154 → 11.5%; Cpk (10.30 − 10.10)/0.15 = 1.33; Cpu (0.050 − 0.020)/0.015 = 2.0; 0.010 × √2 = 0.0141 mm.

Uncertain / simplified: the "roughly 80%" visual-inspection figure is a literature range, presented as "often found", not a constant; the "roughly 30% drop" after stopping tampering assumes tampering was the only extra source (1 − 1/√2 = 29%).

## Clarity round (2026-11)
All six lessons now have 5 teach blocks in en and nl. Level 3, so basics from eng.quality are re-explained briefly in the sentence (sigma, control chart and limits, SPC, common/special cause, nominal, USL/LSL, ppm, fixture, setting ring, CNC offset, burrs, orange peel, runout, flatness, cavity). Terms are 5–6 per lesson, same order and count in en and nl, each used literally in its lesson’s teach text, none defined twice in the module. Compound terms that could never match the text were split (“Escape and false reject”, “p chart and np chart”, “c chart and u chart”, “Within and overall sigma”; “Repeatability (EV)” → “Repeatability”). Ids, recall order, answer positions and numbers unchanged.

Terms (en = nl): msa: Repeatability = Herhaalbaarheid, Reproducibility = Reproduceerbaarheid, Study variation = Studievariatie, ndc, Bias, Resolution = Resolutie · attribute: Attribute agreement analysis = Overeenstemmingsanalyse, Kappa, Escape = Ontsnapping, False reject = Onterechte afkeur, Containment = Noodmaatregel, Boundary sample = Grensmonster · charts: I-MR chart, p chart, np chart, c chart, u chart (-kaart in nl), Rational subgroup = Rationele subgroep · ppk: Cpk, Ppk, Within sigma = Kortetermijnsigma, Overall sigma = Totale sigma, Stable process = Stabiel proces, Process study = Processtudie · nonnormal: Skewed distribution = Scheve verdeling, One-sided spec = Eenzijdige specificatie, Cpu, Probability plot = Kansplot, Percentile method = Percentielmethode · tampering: Tampering = Overbijsturen, Funnel experiment = Trechterexperiment, Wear compensation = Slijtagecompensatie, Reaction plan = Reactieplan, Suspect parts = Verdachte delen.

Consistency with eng.quality: Cpk = distance from mean to nearest limit / 3σ with short-term (within) sigma; Ppk the same formula with the overall sigma; GRR bands under 10 / 10–30 / over 30% (now stated for both % of tolerance and % of study variation, as AIAG MSA 4th ed. does); % of tolerance uses 6σ of the gauge; capability study sizes as in eng.quality (machine study at least 50 parts; process study about 100 readings in 25 subgroups, AIAG PPAP 4th ed.); ppm guide 2,700 / 63 / under 1.

Facts and numbers added
- d2 = 2.326 for subgroups of 5 (standard SPC constant table, AIAG SPC 2nd ed.).
- p chart at p̄ = 0.01, n = 50: 3√(0.01 × 0.99 / 50) = 0.0422, so LCL = 0 and UCL = 0.0522 (2.6 defectives); 2 defectives (4%) stay inside, 3 (6%) fall outside.
- Cpk 1.33 from 30 parts: approximate 95% interval ±1.96 × √(1/(9n) + Cpk²/(2(n − 1))) = ±1.96 × √(0.0037 + 0.0305) = ±0.36 (Bissell 1990 approximation) → “roughly ±0.35”.
- Kappa: AIAG MSA 4th ed. guidance ≥ 0.75 good, < 0.40 poor; “90% agreement can be a poor kappa when almost every part is good” follows from the chance correction.
- Visual inspection about 80%, range roughly 70–90%: See, J.E., *Visual Inspection: A Review of the Literature*, Sandia SAND2012-8590 (2012); hedged as “often reported”.
- Funnel experiment: Deming, *Out of the Crisis* (1986) and *The New Economics* (1993), experiment devised by Lloyd S. Nelson; rule 2 doubles the variance (σ × √2 = +41%); rule 4 (funnel over the last drop) is a random walk that wanders off. 1 − 1/√2 = 29% drop when tampering stops.
- PPAP targets hedged as typical automotive, customers set their own: Ppk ≥ 1.67 initial (1.33–1.67 may be accepted), Cpk ≥ 1.33 ongoing.
- Funnel/ISO/ppm numbers otherwise as listed above.

Uncertain / simplified: the 70–90% inspection range and the Cpk confidence width are approximations, worded as such; “never draw spec limits on an X-bar chart” is standard SPC teaching (averages spread less than individuals by √n).

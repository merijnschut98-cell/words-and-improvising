# eng.reliability — Reliability and asset strategy (engineering, track basics, level 4, FADED examples)
Index title: en 'Reliability and asset strategy' / nl 'Betrouwbaarheid en assetstrategie'. Blurb: en 'Expert level: failure data, RCM, criticality, spare parts and life-cycle cost decisions.' / nl 'Expertniveau: storingsdata, RCM, kritikaliteit, reservedelen en levensduurkosten.'
1. `eng.reliability.weibull` — failure data and Weibull in words: infant mortality, random, wear-out; what the shape tells you to do.
2. `eng.reliability.rcm` — reliability-centred maintenance: functions, failure modes, consequences, task selection.
3. `eng.reliability.criticality` — criticality analysis: ranking assets by safety, production and cost impact; focusing effort.
4. `eng.reliability.spares` — spare-parts strategy: critical spares, lead times, stock vs risk, the €80k part on the shelf.
5. `eng.reliability.lcc` — life-cycle cost: purchase vs operating vs downtime cost, repair-or-replace decisions with numbers.
6. `eng.reliability.program` — building a reliability programme at a client: data, roles, quick wins, what stalls it.

## Clarity round (2026-11)
All six lessons now have 5 teach blocks in en and nl; every technical word is explained in the sentence where it first appears (seal, commissioning, alignment, gearbox, rebuild, relief valve, trip, buffer, bottleneck, working capital, extruder, airend, VSD, RMU, internal-arc classification, CMMS, planner, root-cause analysis). Terms are 5–6 per lesson, same order and count in en and nl, each used literally in its lesson’s teach text, none defined twice in the module. Ids, recall order, answer positions and numbers unchanged; figure `eng.reliability.weibull` untouched (its asserted model numbers, eta 12 months, betas 0.7/1/3, fixed replacement every 6 months, are not restated in the text beyond the 6-month opening question and the eta-12 example).

Terms (en = nl): weibull: Failure rate = Faalkans, Suspension = Suspensie, Characteristic life = Karakteristieke levensduur, Shape parameter = Vormparameter, Infant mortality = Vroege uitval (teach also gives “kindersterfte”, the label the figure uses), Wear-out = Slijtage · rcm: Functional failure, Failure mode, Hidden failure, Failure-finding task (new), P-F interval · criticality: Criticality, Risk matrix, Redundancy, Buffer (new), Bottleneck (new), Anchor asset (new) · spares: Insurance spare, Holding cost, Lead time, Reorder point (new), Min/max, Dead stock (new) · lcc: Life-cycle cost, Discount rate (new in nl), Present value, Equivalent annual cost, Sunk cost · program: Bad actor, Wrench time, PM compliance, Repeat failure, Leading indicator (new), Lagging indicator (new).

Facts and sources added or checked
- Eta: F(eta) = 1 − e^−1 = 0.632 for every beta (definition of the 2-parameter Weibull).
- Beta 2–4 for wear/fatigue is a practitioners’ rule of thumb (Abernethy, *The New Weibull Handbook*, 5th ed., 2006); rolling-bearing fatigue life is usually modelled with beta around 1.1–1.5 (ISO 281 uses 1.5 in its life-adjustment; Harris & Kotzalas), hence “often nearer 1.5”.
- Nowlan, F.S. & Heap, H.F., *Reliability-Centered Maintenance*, United Airlines / US DoD, 1978: age-related patterns A + B + C = 4 + 2 + 5 = 11% of items.
- “5 to 10 failures per mode” for a usable beta: hedged (Abernethy notes small-sample Weibull works with very few failures but beta is highly uncertain); presented as a range analysts argue about.
- SAE JA1011 (1999), *Evaluation Criteria for RCM Processes*: the seven questions. Moubray, *Reliability-centred Maintenance* (2nd ed., 1997): redesign compulsory when no task reduces a safety risk; failure-finding interval FFI = 2 × MTIVE × tolerated unavailability (approximation for a single random-failing protective device, small unavailability). 2 × 10 × 0.02 = 0.4 y = 4.8 months.
- Half the P-F interval for inspection: common rule of thumb (Moubray), hedged.
- Criticality: 10–20% in class A is a rule of thumb, hedged; max-not-sum consequence scoring is site practice, ISO 55000 prescribes neither. 3 × 6 × €4,000 = €72,000.
- Holding cost 15–25% of value per year: inventory-carrying-cost rule of thumb, hedged. Transformer lead times stretching to a year or more after 2021: widely reported (e.g. US DOE / NREL 2022–2024 supply-chain reports, IEA). Example: 14 × 168 = 2,352 h × €1,500 = €3.53 M; × 5% = €176,400 ≈ 11 × €16,000. 800 × €500 × 2% = €8,000.
- Europump & Hydraulic Institute, *Pump Life Cycle Costs: A Guide to LCC Analysis for Pumping Systems* (2001): purchase often a small share of LCC, energy dominant for long-running pumps. 1/1.08^10 = 0.4632 → €46,300. Cost of capital 6–10%: hedged range. Compressor: 500,000 × 0.20 = €100,000; 25% = €25,000; +€5,000 maintenance; €47,000 / €30,000 = 1.57 y. Leaks 20–30% of compressed-air output: US DOE, *Improving Compressed Air System Performance: A Sourcebook for Industry*.
- Wrench time 25–35% in reactive plants: Palmer, *Maintenance Planning and Scheduling Handbook*; rule of thumb, hedged. 8 × 0.30 = 2.4 h. SKF: about 36% of premature bearing failures attributed to poor lubrication (SKF bearing-failure literature) → “roughly a third”.

Uncertain / simplified: the 5–10 failures threshold and the planned-work benchmark (“reactive sites under half, strong sites most”) are rough practitioner figures, worded as such.

## v13 topics (2026-11-08): 4 topics × 4 levels

| Topic (id) | 1 Basis | 2 Werkkennis | 3 Gevorderd | 4 Expert |
|---|---|---|---|---|
| Failure and its patterns (`failure`) | `mechanisms` (new): failure mode / mechanism / root cause, load vs strength, overload vs degradation, fatigue and spalling (ISO 281 cube law), wear, corrosion, insulation ageing (IEC 60076-7, doubling per 6 °C), cable joints | `weibull` (existing; example now worked, figure eng.reliability.weibull kept) | `rca` (new): RCFA triggers, preserving evidence, reading fracture surfaces and bearings (beach marks, spalling offset, fluting), PROACT physical / human / latent roots, closing the loop | `lifedata` (new): Weibull plot, Bernard median ranks, suspensions (Johnson, MLE vs rank regression), B10 life, confidence intervals, curved plots and dog-legs, repairable systems and Crow-AMSAA |
| FMEA and criticality (`risk`) | `criticality` (existing; example now worked) | `fmeca` (new): equipment FMEA / FMECA per IEC 60812:2018, local and end effects, RPN vs AIAG-VDA Action Priority (pointer to Quality basics), maintainable item | `redundancy` (new): reliability block diagram, series and 1-out-of-2, k-out-of-n, N-1, standby unavailability T/(2·MTBF), common cause and beta factor (IEC 61508-6), staggered maintenance | `riskbased` (new): monetised risk, value framework, health index and CNAIM (Ofgem), decision rule risk removed vs equivalent annual cost, ALARP, false precision, capex pointer to Programmes and governance |
| RCM and asset strategy (`strategy`) | `functions` (new): primary and secondary functions, performance standard vs initial capability, functional failure, operating context | `rcm` (existing; example now worked) | `program` (existing; faded) | `assetmgmt` (new): ISO 55000/55001 (2024 editions), ISO 55002, line of sight, SAMP, decision criteria, dependability (IEC 60300-1), NTA 8120 and ISO 55001 at Dutch grid operators |
| Reliability data and decisions (`decide`) | `mtbf` (new): R(t), failure rate from fleet data, unit-years, MTBF vs MTTF, MTBF is not a life, constant failure rate and e^(−t/MTBF), series rates add | `availability` (new): inherent vs operational availability, active repair time, logistic delay, downtime cost per year, how often × how long (Dutch outage minutes) | `spares` (existing; faded) | `lcc` (existing; faded) |

Why this split: the four suggested topics. The six existing lessons fill the level that fits their depth: criticality (1), weibull and rcm (2, so their examples became worked), program and spares (3), lcc (4). Ten new lessons complete each topic from Basis to Expert. Topic ids: failure, risk, strategy, decide.

Existing lessons: ids, recall order, answer positions and numbers unchanged (pinned in `tests/fixtures/v13-eng.reliability-recall-keys.json`, built from the files before this change; rcm keeps its 5 recall questions). Wording changes only:
- Examples of weibull, rcm and criticality turned from faded into worked (same story, the reveal moved into the text). The rcm example now uses MTBF 15 years and 1% unavailability (0.3 years, about every 3–4 months) so it does not give away recall r3 (4.8 months).
- Giveaways removed (correct option was the unique longest): weibull pre r1 r2 r3, rcm pre r0 r2, criticality pre r1 r2 r3, spares pre r2 r3, lcc r2 r3, program pre r1 r2 r3 (en and nl).
- Own hints on every numeric recall question (old and new); none contains the answer (validator).
- Terms: rcm no longer defines Failure mode / Faalwijze (now in mechanisms) and Functional failure / Functionele storing (now in functions); it gains Tolerated unavailability / Geaccepteerde onbeschikbaarheid and Run to failure / Laten draaien tot storing (nl teach now says "laten draaien tot storing (run to failure)"). Program gets a pointer to Maintenance for TPM, planning and KPIs.

Shared definitions (checked by script against every other module):
- Identical to eng.maintenance: Infant mortality / Vroege uitval, Wear-out / Slijtage, P-F interval, Criticality / Kritikaliteit, PM compliance, Wrench time, MTBF, Availability / Beschikbaarheid. (Maintenance's "Weibull β" vs reliability's "Shape parameter" are different term names; left as is.)
- Identical to eng.cost (and eng.flow for Holding cost): Holding cost / Voorraadkosten, Sunk cost / Verzonken kosten (nl term renamed from "Sunk cost"), Discount rate / Discontovoet, Lead time / Levertijd.
- Identical to eng.flow: Bottleneck, Buffer. Identical to eng.gridplanning: N-1.
- Not copied on purpose: eng.cost's "Annuity factor" is the sum of discount factors (about 19.8 at 4%/40 years); riskbased uses the inverse (5.05%), so it speaks of the equivalent annual cost (term in lcc) instead of naming a factor.
- Fatigue and Beach marks are worded more plainly than eng.mechanics (same meaning).

Answer positions (pre + recall MC, en = nl): 13 / 14 / 14 / 13. Correct option never the unique longest (script, en and nl). Correct-option length rank over 54 MC: en 1(tied) 6 · 2nd 21 · 3rd 21 · 4th 6; nl 3 · 20 · 22 · 9.

Facts and sources (checked 2026-11-08):
- Nowlan & Heap, Reliability-Centered Maintenance (United Airlines / US DoD, 1978): ~11% age-related patterns (as before).
- J. Moubray, RCM II (2nd ed. 1997): seven questions, consequence categories, hidden failures, failure-finding interval FFI = 2 × MTBF × tolerated unavailability (single protective device, random failures), half the P-F interval.
- SAE JA1011 (1999, rev. 2009) evaluation criteria for RCM; SAE JA1012 (2002, rev. 2011) guide.
- IEC 60812:2018 FMEA and FMECA. AIAG-VDA FMEA Handbook (2019): Action Priority replaces RPN (as in eng.quality).
- ISO 281 basic rating life L10 = (C/P)^3 for ball bearings (exponent 10/3 for roller bearings; text says ball bearings).
- IEC 60076-7 (loading guide for oil-immersed transformers): ageing rate doubles per 6 K hot-spot rise above 98 °C.
- R. Latino, PROACT RCA: physical, human, latent roots (Reliability Center Inc.).
- Bernard's median-rank approximation (i − 0.3)/(n + 0.4); R. Abernethy, The New Weibull Handbook (rank regression for small samples, MLE with heavy suspensions; small-sample caution). B10 = η(−ln 0.9)^(1/β). Crow-AMSAA (MIL-HDBK-189) for repairable systems.
- IEC 61508-6 Annex D: beta factor for common-cause failures, roughly 0.5–10% depending on component and measures; taught as "about 1% to 10%".
- Ofgem DNO Common Network Asset Indices Methodology (CNAIM): health index, probability of failure and monetised risk per asset.
- ALARP: UK HSE principle (gross disproportion).
- ISO 55000:2024 and ISO 55001:2024 (2nd editions, published July 2024, replacing 2014): https://committee.iso.org/tc251.html, https://www.assetivity.com.au/articles/asset-management/iso-550012024-vs-iso-550012014-a-comparison/. ISO 55002:2018 still current.
- IEC 60300-1:2014 dependability management.
- NTA 8120 and ISO 55001 certificates at Stedin (DIfAM DMS-2024-020-1) and Enexis (DMS-2023-002-1); NN-CAM certification scheme of Netbeheer Nederland. Wording matches eng.gridops ("Dutch asset-management standard for electricity and gas grids").
- Dutch outage figures 2024: 23.9 minutes per customer, 0.343 interruptions of 69.8 minutes on average (Netbeheer Nederland, Betrouwbaarheid van elektriciteitsnetten in Nederland, resultaten 2024): taught as "about 24 minutes, about 0.34 interruptions of about 70 minutes".
- N-1 mainly at higher voltage levels in the Netherlands: hedged ("mainly"), pointer to Grid planning and the transition.

Recalculations (new lessons):
- mechanisms: example (1/1.25)³ = 0.512; r0 (1/1.5)³ = 0.296 → 29.6%; r2 (110 − 98)/6 = 2 steps → 4×; 1,500 × 60 × 24 = 2,160,000 cycles a day.
- rca: example 3 × 14 × 1,500 = €63,000; r0 5 × 1,800 + 2,500 = €11,500; r3 30/48 = 62.5%.
- lifedata: 0.7/5.4 = 13%; B10 20,000 × 0.10536^0.5 = 6,492 h; example B10 6,900 × 0.10536^(1/2.3) = 2,594 h ≈ 2,600; F(6,000) = 1 − exp(−(6,000/6,900)^2.3) = 0.516 ≈ 52%; r0 1.7/9.4 = 18.1%; r1 10,000 × 0.10536 = 1,054 h.
- fmeca: example scores 3×4 = 12, 4×5 = 20, 5×2 = 10; r0 7×5×2 = 70 (from 210); r3 8/32 = 25%.
- redundancy: 0.95³ = 85.7%; 1 − 0.05² = 99.75% (0.95² = 90.25% both up); 0.5/20 = 2.5%; beta 5%: U ≈ 0.05² + 0.05 × 0.05 = 0.5% → 99.5%; example 1 − 0.02² = 0.9996, × 0.995 = 0.99460 → 99.46%, 0.54/0.04 ≈ 13×; r0 0.97⁴ = 0.8853; r1 1/16 = 6.25%.
- riskbased: pre 0.01 × 2M = 20k, 0.2 × 50k = 10k; capital recovery 4%/40 y = 0.0505; 300k × 0.0505 = 15,157; example X 1.2 × 25k = 30k, removed 27k, 500k × 0.0505 = 25,262; Y 0.2 × 60k = 12k, removed 10.8k, 450k × 0.0505 = 22,736; r0 0.005 × 4M = 20k; r1 15k − 10k = 5k.
- functions: example 7.5 − 0.6 = 6.9, − 0.5 = 6.4; r0 30/120 = 25%; r3 7.4 − 1.0 = 6.4.
- assetmgmt: r2 840/1,200 = 70%; r3 5.0 × 0.9³ = 3.645.
- mtbf: 10/2,000 = 0.5%/yr, MTBF 200 yr; 8,760/1.2M = 0.73%; e^−1 = 36.8%; e^−0.2 = 0.819; example 120 × 2 × 6,000 = 1.44M h, 18/1.44M → MTBF 80,000 h, 120 × 6,000/80,000 = 9, e^−0.075 = 92.8%; situation 40 × 8,760/50,000 = 7.0; r0 4/500 = 0.8%; r1 e^−0.1 = 90.5%.
- availability: 2,000/2,004 = 99.80%, 2,000/2,024 = 98.81%, 4 × 24 = 96 h vs 16 h; 4 × 24 × 1,200 = 115,200, 4 × 8 × 1,200 = 38,400, saving 76,800; 1% × 8,760 = 87.6 h; example 1,000/1,001.5 = 99.85%, 1,000/1,005 = 99.50%, 30 h × 2,000 = 60k, 15 h → 30k; r0 400/408 = 98.04%; r1 5 × 12 × 900 = 54k.

Uncertain: Dutch term choices — Faalmechanisme, Rustlijnen (as in eng.mechanics), Fysieke/Menselijke/Latente oorzaak, Onderhoudbare eenheid (maintainable item), Oorspronkelijk vermogen (initial capability), Gebruikscontext (operating context), Bedrijfszekerheid (dependability), Logistieke wachttijd, Waardenkader, Unitjaren. "Health index", "Line of sight" and "SAMP" kept in English in nl (common in Dutch asset-management practice). Beta-factor range and "a few dozen failure modes per pump" are practice values, hedged in text.

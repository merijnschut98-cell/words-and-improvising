# eng.maintenance — Maintenance (engineering, track basics, level 2)
Index title: en 'Maintenance' / nl 'Onderhoud'. Blurb: en 'From breakdown to predictive: MTBF, MTTR, TPM and what to ask the maintenance lead.' / nl 'Van storing tot voorspellend: MTBF, MTTR, TPM en wat je de onderhoudsleider vraagt.'
1. `eng.maintenance.strategies` — reactive, preventive, condition-based, predictive; when each makes sense.
2. `eng.maintenance.metrics` — MTBF, MTTR, availability from them; computing one from a stop list.
3. `eng.maintenance.failure` — failure patterns (bathtub and the rest), why time-based replacement often doesn’t help.
4. `eng.maintenance.condition` — vibration, thermography, oil analysis, ultrasound; what each finds.
5. `eng.maintenance.tpm` — TPM pillars in engineering terms, autonomous maintenance, operator and technician roles.
6. `eng.maintenance.cmms` — work orders, spare parts, criticality ranking, the backlog; reading a CMMS report.

## Clarity round (2026-11-04)
Every lesson now has 5 teach blocks (≤ 90 words); terms 4–6 per lesson, each literally in the teach text, en/nl in the same order; every jargon word explained in its sentence (bottleneck, overhaul, failure mode, threshold, planned stop, wrench time, micro-stop, coupling misalignment, servo axis, spectrum, OEE, tag, asset register, failure codes). Ids, recall order, answer positions and numbers unchanged; the figure eng.maintenance.pf (P-F 10 wk for vibration, alarm 4.5 mm/s, order ultrasound 12 · vibration 10 · oil 6 · IR 4 · hand 1 wk, catch chance min(1, PF/I) = 83 % at I = 12) is quoted as is.

Terms added: Predictive maintenance (Predictief onderhoud); Reactive maintenance replaces Run-to-failure as the en term so it pairs with Correctief onderhoud; Wrench time (Sleuteltijd); Wear-out (Slijtage); Maintenance-induced failure (Storing door onderhoud); Ultrasound (Ultrasoon); OEE; Asset register (Assetregister); PM compliance (PM-compliance). nl term “Label (tag)” became “Label” (the text gives “label (tag)”), so the app can match it.

Recomputed and sources:
- Planned share: (1,200 − 300) / 1,200 = 75 %. ≥ 85 % planned work: SMRP best-practice benchmark (planned work 85–90 %).
- Unplanned repair 3–5× planned: common industry rule of thumb (quoted 2–5× in SMRP/Wireman); worded as “often quoted”.
- Wrench time 25–35 %: D. Palmer, Maintenance Planning and Scheduling Handbook (typical unplanned crews ~35 %).
- MTBF 600 / 12 = 50 h; availability 50 / 52.5 = 95.2 %; 40 / 42 = 95.2 %; filler example 307.5 / 8 = 38.4 h, 12.5 / 8 = 1.56 h, 38.4 / 39.96 = 96.1 %, 7 / 12.5 = 56 %.
- Nowlan & Heap 1978: patterns A 4 %, B 2 %, C 5 % (age-related 11 %), D 7 %, E 14 %, F 68 %. Weibull β < 1 / ≈ 1 / > 1 = decreasing / constant / increasing hazard. “5–10 failures for a usable fit”: Abernethy, The New Weibull Handbook (small-sample caution).
- 26 / 40 = 65 %. Servo example: 24 × €750 = €18,000.
- Condition: half the P-F interval rule (Moubray, RCM II); 8 / 2 = 4 wk; 10 / 12 = 83 % (figure). ISO 10816-3 group 2 (15–300 kW) rigid base: zone boundaries 1.4 / 2.8 / 4.5 mm/s; 2.8 = B/C (warning), 4.5 = C/D (action). Note: the figure’s build.mjs comment calls 4.5 the “B/C boundary for a medium machine on a rigid base”; for group 2 rigid it is C/D (B/C on a flexible base). Comment only; figure numbers untouched.
- Trend example: (4.5 − 3.4) / 0.8 = 1.4 months ≈ 6 weeks.
- Thermography: NFPA 70B, scan at ≥ 40 % load; NETA MTS ΔT > 15 °C between similar components = major deficiency.
- Ultrasound 20–100 kHz (airborne instruments, typically 40 kHz). 3 mm leak at 7 bar ≈ 11–13 l/s free air ≈ 3.5–4 kW (Atlas Copco/Compressed Air Challenge leak tables, 3.1 kW at 6 bar). 4 kW × 8,760 h = 35,040 kWh × €0.06–0.14 = €2,100–4,900 → “€2,000 to €5,000”.
- TPM: Nakajima, JIPM 1971; eight pillars; AM seven steps (initial cleaning … autonomous management). OEE world class 85 % (Nakajima); typical 50–65 % is a common estimate (Vorne, OEE.com) — uncertain, worded as “many plants”.
- TPM recall: (9 − 4) × 2.5 = 12.5 h.
- Backlog 3,200 / 320 = 10 wk; 960 / 240 = 4 wk; 1,150 / 240 = 4.8 wk; PM compliance 84 / 120 = 70 %; target ≥ 90 % and backlog 2–4 wk: SMRP / Wireman benchmarks.
- Sensors: 140 × €900 = €126,000.

## v13 topics (2026-11-08): 4 topics × 4 levels

| Topic (id) | 1 Basis | 2 Werkkennis | 3 Gevorderd | 4 Expert |
|---|---|---|---|---|
| Maintenance strategies (`strategy`) | `strategies` (existing) | `failure` (existing) | `condition` (existing, example now faded; figure eng.maintenance.pf kept) | `pmreview` (new): PM optimisation, OEM intervals, keep/delete/interval/convert, acceptance criterion, find rate, PMO vs RCM, statutory inspections |
| TPM and autonomous maintenance (`tpm`) | `tpm` (existing) | `cilt` (new): CILT standard, match marks, sight glass, lubrication amounts (weigh a gun stroke), one-point lesson, ~10 min per shift, pencil whipping | `amsteps` (new): JIPM seven AM steps, sources of contamination and hard-to-access areas, step audit, tag closure rate, model machine, wide vs deep | `pillars` (new): eight pillars, 16 losses, loss tree, focused improvement, quality maintenance, early equipment management, master plan / model line, WCM cost deployment |
| Planning, scheduling and spare parts (`planning`) | `cmms` (existing) | `planning` (new): job plan, planner (1 per 20–30, Palmer), forecast hours, weekly schedule loaded to 100%, break-in work, schedule compliance (SMRP 90% vs Palmer ~80%) | `stores` (new): spare parts list (asset BOM), kitting, service level, inventory accuracy, cycle counting, squirrel stores | `shutdown` (new): scope freeze, scope growth (AP-Networks 19% / 7%), emergent vs discovery work, contingency, critical path, punch list, start-up infant mortality |
| Measuring maintenance (`measure`) | `metrics` (existing) | `workmix` (new): EN 13306 preventive/corrective, immediate vs deferred corrective, planned work, reactive share, work order type, work sampling | `kpiset` (new): EN 15341 and SMRP metrics, leading/lagging set, PM compliance grace period (10% vs +20% capped at 28 days), time lag, paired indicators, plant-wide MTBF | `cost` (new): maintenance cost / RAV, cost of unreliability, business case (lost margin only on a sold-out bottleneck), capex vs opex |

Why this split: the four suggested topics; the six existing lessons sit at level 1 (strategies, tpm, cmms, metrics) or in the strategy topic (failure 2, condition 3). Condition monitoring moves to level 3, so its worked example became a faded one (same numbers, the computation moved to the reveal).

Existing lessons: ids, recall order, answer positions and numbers unchanged (pinned in `tests/fixtures/v13-eng.maintenance-recall-keys.json`, built from the files before this change). Wording changes only:
- Giveaways removed (correct option was the unique longest): strategies r2 r3, failure pre r1 r2 r3, metrics pre (distractor 2 h → 500 h; why rewritten), condition r3, tpm r1 r2 r3, cmms r2 r3, and their nl equivalents.
- Own hints on every numeric recall question (old and new); none contains the answer (validator check).
- Shared definitions aligned: OEE = availability × performance × quality (as in eng.flow; teach no longer quotes "50–65%", it points to Capacity and flow); infant mortality, wear-out, P-F interval, criticality, wrench time and PM compliance definitions copied from eng.reliability (en and nl). Availability def notes that OEE availability also counts changeovers.
- Pointers instead of repeats: RCM, Weibull fit, criticality ranking, spares stocking (insurance spares, reorder point, dead stock), life-cycle cost → Reliability and asset strategy; OEE, six big losses, SMED, OEE to money → Capacity and flow; leading/lagging and the KPI definition card → Performance management (pm.perform); lockout → Safety on the floor and in the substation. Critical path def identical to pm.plan; Time lag / Vertraging identical to pm.perform; Capex identical to pm.portfolio. eng.ot patching (patch windows in planned stops) not repeated; nothing in this module contradicts it.
- Index blurb now names planning and spare parts and the numbers.

Answer positions (pre + recall MC, en = nl): module 13 / 13 / 13 / 13. Correct option is never the unique longest (script check en and nl); correct-option length rank across 52 MC: en 1(tied) 4 · 2nd 20 · 3rd 12 · 4th 16; nl 3 · 23 · 7 · 19.

Facts and sources (checked 2026-11-08):
- EN 13306:2017 Maintenance terminology: preventive vs corrective; immediate vs deferred corrective maintenance.
- EN 15341:2019+A1:2022 Maintenance KPIs: 2007 edition grouped economic / technical / organisational; the current edition regroups by function (secondary sources, e.g. maintmaster.com/blog/maintenance-european-standard; reliamag.com KPI reference). Taught hedged ("regroups them"), no KPI count.
- SMRP Best Practices: PM compliance metric 5.4.10 (within 10% of the frequency) vs 5.4.14 (required date + 20% of frequency, max 28 days), and 90% best-in-class schedule/PM compliance — SMRP forum thread https://exchange.smrp.org/discussion/conflict-between-metric-5410-and-5414; https://reliamag.com/topics/guides/pm-compliance-rate-benchmarks.
- Maintenance cost / RAV: SMRP metric; best-in-class "often quoted below about 3%" (https://reliamag.com/topics/guides/maintenance-cost-as-a-percent-of-rav-benchmarks-by-industry; https://fiixsoftware.com/maintenance-metrics/mcrav/). Hedged; 2% world-class figures are vendor framing.
- Planner ratio 1:20–30: D. Palmer, Maintenance Planning and Scheduling Handbook; https://www.plantservices.com/planned-maintenance/planning-and-scheduling/article/55090375/. Schedule to 100% of forecast hours, break-in work, ~80% compliance when fully loaded: Palmer (also cited in reliamag schedule-compliance guide). Hedged as "Palmer argues".
- Turnaround scope growth: AP-Networks database (>1,350 turnarounds) average 19% freeze-to-execution, top quartile 7% — https://reliabilityacademy.com/articles/shutdown-management/why-do-maintenance-shutdowns-overrun; emergent vs discovery work — https://www.ogj.com/articles/print/vol-110/issue-4/processing/analysis-yields-turnaround.html.
- TPM: Nakajima (Introduction to TPM, 1988 English ed.); JIPM eight pillars; AM seven steps (names vary; some add step 0) — https://industryforum.co.uk/wp-content/uploads/2020/12/Autonomous-Maintenance1.pdf, https://reliamag.com/topics/guides/autonomous-maintenance. Nippondenso first PM Prize for TPM 1971 (stated "often named"). JIPM 16 major losses. WCM at Fiat with H. Yamashina (2000s), cost deployment.
- Lubrication (over-greasing heats bearings, incompatible greases): SKF bearing maintenance handbook; "weigh one stroke" as practice advice. Reliability module keeps the SKF one-third statistic.
- Reactive share "under about 10–15% strong": practitioner rule of thumb, hedged; 30% struggling is from the cmms lesson.
- Store service level "mid to high 90s" and CILT "about 10 minutes per shift": rules of thumb, hedged in text.
- Nowlan & Heap, Moubray (half the P-F interval), ISO 10816-3 and the rest: as in the clarity round above.

Recalculations (new lessons):
- pmreview: example 380 + (300 − 100) = 580 h; 580 / 1,600 = 36.25% → "36%". r0 55 / 250 = 22%; r1 (12 − 4) × 30 × 2 = 480 h.
- cilt: example 20 / 15 = 1.33; 7 + 1.33 = 8.3 min; 15 g / 10 = 1.5 g; 6 / 1.5 = 4 strokes. r0 6 + 25/15 = 7.67; r1 8 / 2 = 4.
- amsteps: example 42 / 60 = 70%; (45 − 18) × 15 = 405 min = 6.75 h. r0 68 / 80 = 85%; r1 18 × 15 = 270 min = 4.5 h.
- pillars: example 1,680 / 6,000 = 28%. r0 1,100 / 5,000 = 22%; r1 150 × 800 = €120,000.
- planning: example 240 − 16 − 8 − 12 = 204; 160 / 204 = 78.4%. r0 320 − 24 − 16 − 12 = 268; r1 195 / 250 = 78%.
- stores: example 1,104 / 1,200 = 92%; 20 × 300 = 6,000 min = 100 h. r0 760 / 800 = 95%; r1 184 / 200 = 92%.
- shutdown: example 540 / 2,400 = 22.5%; 10% × 2,400 = 240. r0 270 / 1,800 = 15%; r1 max(12+20+8, 16+18) = 40 h.
- workmix: example planned 480+160+360+40 = 1,040 → 65%; 520 / 1,600 = 32.5%; 640 / 1,600 = 40%. r0 560 / 2,000 = 28%; r1 140 / 400 = 35%.
- kpiset: example 3 days → 150 / 200 = 75%; 6 days → 170 / 200 = 85%. r0 0.1 × 90 = 9; r1 0.2 × 180 = 36 > 28 → 28.
- cost: example 3.2 / 80 = 4%; 0.4 × 220 = 88 h × 1,500 = 132,000 + 60,000 = 192,000 − 250,000 = −58,000. r0 2.4 / 96 = 2.5%; r1 50 × 1,200 − 40,000 = 20,000.
- condition (faded): (3.4 − 1.9) / 2 = 0.75 ≈ 0.8 per month; (4.5 − 3.4) / 0.8 = 1.4 months.

Uncertain: Dutch term choices — Werkplan (job plan), Spoedwerk (break-in work), Planningsnaleving (schedule compliance; many sites just say schedule compliance), Vondstpercentage (find rate), Blind afvinken (pencil whipping), Ontdekkingswerk (discovery work), Restpuntenlijst (punch list), Tolerantievenster (grace period), Werksteekproef (work sampling). "Early equipment management" kept in English in nl (no settled Dutch term). nl "kritiek pad" written without the inflection so the term stays tappable. The EN 15341 current structure comes from secondary sources only.

### v13 review (2026-11-08)

- PM compliance windows now from the SMRP 6th-edition summary in reliamag.com/topics/guides/pm-compliance-rate-benchmarks (not the forum thread): metric 5.4.14 lets a plant choose the due date (or +1 day) or due date + 20% of the interval capped at 28 days; the separate PM-timing metric 5.4.10 recommends the "10% rule". Taught as "SMRP's PM compliance metric lets a plant choose … a related SMRP metric recommends a stricter 10% rule".
- Schedule compliance: Palmer (plantservices.com, "What does schedule compliance measure?") expects 40–90% on a fully loaded schedule and reads above 90% as too little work; the earlier "~80%" had no source and is gone. SMRP best-in-class stays "above 90%", taught as a tension.
- EN 15341:2019+A1:2022: KPIs grouped by maintenance sub-function (maintenance within physical asset management, HSE, maintenance management, personnel, maintenance engineering, organisation and support, administration and supply, ICT), from the published table of contents; taught with three examples.
- AP-Networks 19% / 7%: still a secondary source (reliabilityacademy.com); taught as "summaries of it quote".
- JIPM 16 losses now spelled out as 8 equipment, 5 people, 3 resource losses. Reactive share flagged as this module's definition (SMRP counts schedule break-ins).
- nl terms changed to what Dutch sites say: Werkpakket (job plan), Schedule compliance (planrealisatie), Bevindingspercentage (find rate), Discovery work / Emergent work, Tolerantie (grace period, as in SAP NL), Multimomentopname (work sampling), Schaduwvoorraad (squirrel stores), Scope freeze, Wrench time (as in eng.reliability). Kept: Spoedwerk, Blind afvinken, Restpuntenlijst. nl "Kindersterfte" term became "Vroege uitval" with the eng.reliability definition word for word.
- Length ranks of the correct option (pre + recall MC): en 1(tied) 4 · 2nd 15 · 3rd 17 · 4th 16; nl 3 · 15 · 15 · 19. Positions 13/13/13/13, en = nl.

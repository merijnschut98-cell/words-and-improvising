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

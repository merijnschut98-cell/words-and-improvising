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

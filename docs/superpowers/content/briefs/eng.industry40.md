# eng.industry40 — Data and digital manufacturing (engineering, track it (was discrete until 2026-11-08), level 4, FADED examples)
Index title: en 'Data and digital manufacturing' / nl 'Data en digitale productie'. Blurb: en 'Expert level: MES, sensors, machine data, vision and digital twins, and when they pay off.' / nl 'Expertniveau: MES, sensoren, machinedata, vision en digital twins, en wanneer ze lonen.'
1. `eng.industry40.stack` — the automation stack: sensors, PLC, SCADA, MES, ERP; what lives where and who owns it.
2. `eng.industry40.mes` — MES in practice: orders, traceability, downtime registration, OEE data quality.
3. `eng.industry40.machinedata` — machine data: OPC UA, sampling, cleaning; why automatic downtime capture beats manual.
4. `eng.industry40.vision` — machine vision and AI inspection: what it can and can’t catch, false rejects, training data.
5. `eng.industry40.twin` — digital twins and simulation: when a model helps a decision, when it is a toy.
6. `eng.industry40.case` — the business case and rollout of a digital project: pilot, scale, IT/OT security, adoption on the floor.

## Clarity round (2026-11-06)
Every lesson now has 5 teach blocks and 5–6 terms, en/nl in the same order, each appearing literally in its lesson's teach text. Combined terms renamed so they link: "Total cost of ownership (TCO)" → "Total cost of ownership", "Discrete-event simulation (DES)" → "Discrete-event simulation", nl "Onterechte afkeur (false reject)" → "Onterechte afkeur". Terms that did not appear in the teach text (Reason code, Dispatching, Edge gateway, Contextualisation, Shadow mode, Labelling, Network segmentation) are now used there. Abbreviations spelled out at first use (ISA-95 levels, HMI, OEM, change control, OEE, ERP, OPC UA, stack light, tag, MTBF/MTTR, bottleneck, baseline). Ids, recall order, answer positions and numbers unchanged; the figure `eng.industry40.vision` (0.5% defects, 99% detection, 1% false rejects, about two-thirds of rejects good) is untouched and its numbers stay in teach block 3.

New blocks: stack (no new block; OT ownership debate added), mes (master data and buy versus build), machinedata (edge gateway and retrofit sensors split out), vision (shadow mode split out), twin (replications and reporting a range split out from validation).

Terms per lesson (en / nl):
- stack: PLC, SCADA, Historian, MES, ERP, OT (same in nl).
- mes: Dispatching, Genealogy, Reason code, Ideal cycle time, Master data / Dispatching, Genealogie, Redencode, Ideale cyclustijd, Stamdata.
- machinedata: OPC UA, MQTT, Edge gateway, Sampling rate, Contextualisation / OPC UA, MQTT, Edge gateway, Samplefrequentie, Contextualisering.
- vision: Rule-based vision, Deep learning, False reject, Escape, Labelling, Shadow mode / Regelgebaseerde vision, Deep learning, Onterechte afkeur, Escape, Labelen, Shadow mode.
- twin: Digital twin, Virtual commissioning, Discrete-event simulation, Validation, Replication / Digital twin, Virtuele inbedrijfstelling, Discrete-event-simulatie, Validatie, Replicatie.
- case: Total cost of ownership, Baseline, Pilot purgatory, Network segmentation, DMZ, NIS2 / Total cost of ownership, Nulmeting, Pilot purgatory, Netwerksegmentatie, DMZ, NIS2.

Recalculations: 400 / 10,400 = 3.85% (recall answer 3.8, tolerance 0.1); 10,000 × 2.0 s / 25,200 s = 79.4%; 99% × 2.0/2.4 = 82.5%, 0.90 × 0.825 × 0.92 = 68.3%; 45 × 2.5 = 112.5 min; vision figure: 1,000 parts, 5 bad, 4.95 caught, 995 good × 1% = 9.95 false rejects, 9.95 / 14.9 = 67%; 20,000 × 0.995 × 1% = 199; 0.90 × 0.85 = 76.5%; 400 h × €2,000 = €800,000, × 20% = €160,000; €120 × 25 × 12 = €36,000; €100 × 25 × 12 = €30,000.

Facts and attributions checked:
- ISA-95 (ANSI/ISA-95) = IEC 62264; level 3 is manufacturing operations management, usually implemented as an MES (text no longer calls MES "the manufacturing operations system").
- OPC UA = IEC 62541; Nyquist: sample at more than twice the highest frequency; 2.56× is the usual analyser convention (FFT line count), not a law.
- IEC 62443 zones and conduits; NIS2 = Directive (EU) 2022/2555, medium and large entities in energy and many manufacturing sectors (Dutch implementation: the Cyberbeveiligingswet; not named in the text because its entry-into-force date may still move).
- Rules of thumb hedged as such: 3 pixels per defect, "other" above 10–15%, 2-minute reason threshold, 10–30+ replications, pilots of 8–12 weeks.

Uncertain: none of the numbers; the "OT under the IT director versus under engineering" debate is described as practitioner disagreement, not a finding.

Review (2026-11-06): Profinet is not an "older protocol" (removed; Modbus dated to the 1970s). Payback €250,000 / €1.2 M a year = 2.5 months (was "three months"). NIS2: "several" (not "many") manufacturing sectors; Dutch Cyberbeveiligingswet in force 15 August 2026 (Stb. 2026, 187 and 189). SCADA, CMMS and Euromap now explained at first use; "poll" replaced by "sample"; nl "TD" spelled out.

## Track move (2026-11-08)

Moved from track `discrete` to the new Engineering track `it` ("IT en OT" / "IT and OT"), next to `eng.itbasics`, per section 3 of `docs/superpowers/plans/2026-11-07-v13-listen-ict-outside-layout.md`. Only the `track` field changed; lessons, ids and content are untouched. The rebuild as topics × levels follows later.

## v13 topics (2026-11-08): 4 topics × 4 levels

Per part 3 and part 5 of `docs/superpowers/plans/2026-11-07-v13-listen-ict-outside-layout.md`: “the existing module, moved and rebuilt as topics × levels: data quality, dashboards, integration, AI/ML basics”. Index blurb now: en “Data quality, KPI dashboards and Power BI, how plant data reach a data platform, and AI: machine learning, predictive maintenance, vision and digital twins.” Module level stays 4.

| Topic (id) | 1 Basis | 2 Werkkennis | 3 Gevorderd | 4 Expert |
|---|---|---|---|---|
| Data quality / Datakwaliteit (`quality`) | `dimensions` (new): DAMA UK’s six dimensions (completeness, uniqueness, timeliness, validity, accuracy, consistency), measured as share of records passing a rule | `machinedata` (existing): manual vs automatic capture, retrofit sensors, sampling rate, counter rollover, contextualisation | `mes` (existing): master data, the OEE data trap (ideal cycle time), reason codes, genealogy | `dqrules` (new): data quality rules and scorecard, fix at the source, 1-10-100 rule (hedged), ISO 8000, pass rates multiply, freshness and volume checks |
| Dashboards and visual management / Dashboards en visueel sturen (`dashboards`) | `kpi` (new): Few’s dashboard definition, KPI with target and trend, lagging vs leading, Tufte’s data-ink ratio and chartjunk | `powerbi` (new): Power Query, semantic model, star schema (points to eng.itbasics), DAX measure vs calculated column, ratio of sums, scheduled refresh limits, gateway | `floor` (new): shop-floor screen vs management report, tiered meetings, hour-by-hour board, andon, visual management, colour vision, drill-down | `alerts` (new): alert fatigue, three tests (actionable, owner, rare), threshold on normal variation (points to eng.spc), persistence, grouping, escalation, alert precision; EEMUA 191 via eng.process |
| Integration / Integratie (`integration`) | `stack` (existing, renamed “Where the data come from”): the five systems, time scales, source of truth, OT patching and who to involve; ISA-95 depth pointed to eng.ot | `pipeline` (new): data platform layers, ETL vs ELT, incremental load, warehouse vs lake vs lakehouse, latency, medallion layers, data lineage | `ownership` (new): data owner / steward / custodian, data contracts, data mesh, role-based access, GDPR and works council (WOR art. 27) | `case` (existing): business case from a loss in euros, TCO, pilot and pilot purgatory, OT security (NIS2 pointed to eng.cyber), adoption |
| AI and models / AI en modellen (`ai`) | `ml` (new): AI vs ML vs rules, supervised vs unsupervised, labels, test set, overfitting, EU AI Act (hedged dates) | `predictive` (new): maintenance strategies (P-F curve pointed to eng.maintenance), anomaly detection, remaining useful life, detection rate and precision, warning lead time | `vision` (existing): rule-based vs AI vision, false rejects vs escapes, labelling, shadow mode | `twin` (existing): digital twins, DES, validation, replications, when a model is a toy |

Why this split: the four suggested topics fit the six existing lessons naturally. `machinedata` (capture quality) and `mes` (master data and OEE) are about data quality; `stack` and `case` frame integration (where data come from; rolling out a data project at scale); `vision` and `twin` are model-based tools and sit at the top of the AI topic. Worked examples at levels 1–2 (`stack` and `machinedata` switched from faded to worked), faded at 3–4.

Overlap kept small on purpose: the automation pyramid, OPC UA, MQTT, the historian and UNS live in eng.ot. `stack` now gives one block on the five systems and points to eng.ot; `machinedata` mentions OPC UA in one sentence (needed for pinned recall r1) and points to eng.ot; MQTT and its term were dropped from this module. Databases, SQL, ETL basics, star schema, fan-out and the single source of truth live in eng.itbasics; `powerbi` and `pipeline` point there and go to the analytics side (DAX, refresh, ELT, lake/lakehouse, lineage). `ownership` repeats “data owner” at a deeper level (steward, custodian, contracts); its recall questions differ from eng.itbasics.datamodel. NIS2 detail lives in eng.cyber; alarm-rate numbers in eng.process; control limits in eng.spc; the P-F curve in eng.maintenance.

Existing lessons: ids, recall order, recall answer positions and numbers unchanged (pinned in `tests/fixtures/v13-eng.industry40-recall-keys.json`, built from the files before this change). The figure `eng.industry40.vision` stays on its lesson; vision teach block 3 (0.5% / 99% / 1% / two-thirds) is unchanged. Wording changes only:
- Giveaways removed (correct option was the unique longest): stack r2, r3; mes r1, r2, r3; machinedata r1, r2, r3 (and nl pre); vision r1, r2, r3; twin pre, r1, r2, r3; case pre, r1, r2 (and nl r3). Long answers shortened, distractors lengthened.
- Pre answers (not pinned) moved for balance: stack pre MES now at 0, machinedata pre at 2.
- Own hints on all six existing numeric recall questions (none contains the answer).
- `stack` teach rewritten around “where is the number born” (pyramid detail moved to eng.ot); `machinedata` teach reordered (manual vs automatic first), MQTT replaced by the term Counter rollover / Telleroverloop; `mes` retitled “Master data, MES and the OEE trap”, master data moved to block 2; `case` NIS2 block shortened with a pointer to eng.cyber; `vision` and `twin` each got one bridging sentence to the ML lesson.

Answer positions (pre + recall multiple choice, en = nl per question): whole module 16 / 16 / 16 / 16 over positions 0–3; the new lessons alone 10 / 10 / 10 / 10. No question has the correct option as the unique longest one (script check, en and nl). Every numeric recall question has its own hint (≤ 25 words, never the answer).

Terms (en / nl, same order and count, each literally in its lesson’s teach text, defined once in the module):
- dimensions: Completeness, Uniqueness, Timeliness, Validity, Accuracy, Consistency / Volledigheid, Uniciteit, Tijdigheid, Validiteit, Juistheid, Consistentie.
- machinedata: OPC UA, Edge gateway, Sampling rate, Counter rollover, Contextualisation / OPC UA, Edge gateway, Samplefrequentie, Telleroverloop, Contextualisering.
- mes: Dispatching, Master data, Ideal cycle time, Reason code, Genealogy / Dispatching, Stamdata, Ideale cyclustijd, Redencode, Genealogie.
- dqrules: Data quality rule, Data quality scorecard, 1-10-100 rule, ISO 8000, Freshness check / Datakwaliteitsregel, Scorekaart datakwaliteit, 1-10-100-regel, ISO 8000, Versheidscontrole.
- kpi: Dashboard, KPI, Lagging indicator, Leading indicator, Data-ink ratio, Chartjunk / Dashboard, KPI, Achterlopende indicator, Voorlopende indicator, Data-inktratio, Chartjunk.
- powerbi: Power Query, Semantic model, DAX, DAX measure, Calculated column, Scheduled refresh / Power Query, Semantisch model, DAX, DAX-meting, Berekende kolom, Geplande vernieuwing (Microsoft’s Dutch UI terms).
- floor: Tiered meetings, Hour-by-hour chart, Andon, Visual management, Drill-down / Getrapt overleg, Uur-per-uurbord, Andon, Visueel management, Drill-down.
- alerts: Alert fatigue, Alert threshold, Persistence, Escalation, Alert precision / Alertmoeheid, Alertdrempel, Persistentie, Escalatie, Alertprecisie.
- stack, vision, twin, case: unchanged.
- pipeline: Data platform, ELT, Data warehouse, Data lake, Lakehouse, Data lineage / Dataplatform, ELT, Datawarehouse, Data lake, Lakehouse, Data lineage.
- ownership: Data owner, Data steward, Data custodian, Data contract, Data mesh, Role-based access / Data-eigenaar, Data steward, Technisch databeheerder, Datacontract, Data mesh, Rolgebaseerde toegang.
- ml: Machine learning, Supervised learning, Unsupervised learning, Label, Test set, Overfitting / Machine learning, Gesuperviseerd leren, Ongesuperviseerd leren, Label, Testset, Overfitting.
- predictive: Condition-based maintenance, Predictive maintenance, Anomaly detection, Remaining useful life, Detection rate, Precision / Toestandsafhankelijk onderhoud, Voorspellend onderhoud, Anomaliedetectie, Resterende levensduur, Detectiegraad, Precisie.

Facts and sources (checked 2026-11-08):
- Six data quality dimensions: DAMA UK working group, “The Six Primary Dimensions for Data Quality Assessment” (October 2013); the UK Government Data Quality Framework uses the same six (https://www.gov.uk/government/news/meet-the-data-quality-dimensions). Completeness measured against the use, not by counting nulls (CDMP study guidance).
- ISO 8000: international series on data quality; ISO 8000-8:2015 concepts and measurement; ISO 8000-61:2016 data quality management process reference model; the 100 series on master data (iteh.ai catalogue entries; https://en.wikipedia.org/wiki/ISO_8000). Taught without part titles beyond -61; “few plants certify” hedged.
- 1-10-100 rule: attributed to Labovitz and Chang (1992); taught explicitly as an illustration, not a measurement.
- Dashboard definition: Stephen Few, “Dashboard Confusion” (2004) and *Information Dashboard Design* (2006); single-screen rule and its critics (perceptualedge.com; Tableau reprint). “Five to nine KPIs” hedged as a practitioner rule of thumb.
- Data-ink ratio and chartjunk: Edward Tufte, *The Visual Display of Quantitative Information* (1983).
- Power BI: “dataset” renamed “semantic model” (Microsoft, November 2023); scheduled refresh up to 8 a day with Pro, 48 with PPU / Premium / Fabric capacity (https://learn.microsoft.com/power-bi/connect-data/refresh-scheduled-refresh); on-premises data gateway for on-site sources.
- Red-green colour vision deficiency in about 8% of men (about 1 in 12) of Northern European descent (NHS; Colour Blind Awareness). Taught as “roughly 1 in 12 men”.
- EEMUA 191 alarm rate (about one per 10 minutes per operator in normal operation, “very likely acceptable”), as in eng.process; only referenced.
- ELT vs ETL, data lake / warehouse / lakehouse, Delta Lake and Apache Iceberg as open table formats; “medallion architecture” (bronze/silver/gold) is a Databricks term, taught as “so-called, names vary”. Microsoft Fabric and Databricks named as examples, not advice.
- Data mesh: Zhamak Dehghani, “How to Move Beyond a Monolithic Data Lake to a Distributed Data Mesh” (martinfowler.com, May 2019). Owner / steward / custodian roles: DAMA-DMBOK.
- Works council consent for systems that can monitor attendance, behaviour or performance of staff: Wet op de ondernemingsraden art. 27 lid 1 sub l; GDPR / AVG for personal data.
- EU AI Act: Regulation (EU) 2024/1689, in force 1 August 2024; AI used to evaluate or monitor workers is Annex III high-risk. The Digital Omnibus on AI, Regulation (EU) 2026/1744 (in force 27 July 2026), moved high-risk obligations to 2 December 2027 (Annex III) and 2 August 2028 (Annex I, AI in regulated products such as machinery) (https://artificialintelligenceact.eu/ai-act-explorer/digital-omnibus/; https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/). The lesson says “after a 2026 amendment … check the current text before relying on dates”.
- NIS2 / Cybersecurity Act date as in eng.cyber (15 August 2026); only referenced.

Recalculations (new lessons):
- dimensions: example 1,020 / 1,200 = 85%; 24 / 1,200 = 2%. r0 (2,400 − 312) / 2,400 = 87%.
- dqrules: teach 0.95 × 0.90 × 0.98 = 0.838 (“about 84%”). r0 0.96 × 0.94 × 0.90 = 0.812 → 81.2%.
- kpi: r0 (1.2 + 1.8 + 1.5 + 2.4 + 1.6) / 5 = 1.7%.
- powerbi: pre (0.9 × 10 + 0.6 × 90) / 100 = 63% (card shows 75%); example 70% and 90%, mean 80%, ratio 88 / 120 = 73.3%. r0 (12 + 72) / 100 = 84%.
- floor: r0 3,360 / 7 = 480.
- alerts: r0 3 × 7 = 21 shifts, 1,260 / 21 = 60; r3 12 / 240 = 5%.
- pipeline: example 01:00 to 08:30 = 7.5 h. r0 23:00 to 10:00 = 11 h.
- ownership: r0 (90 − 4) / 90 = 95.56% → 95.6.
- ml: example 97% train vs 71% test; baseline 92% “always good”. r0 2,400 × 0.8 = 1,920.
- predictive: example 10 / 40 = 25%, 10 / 12 = 83.3%. r0 15 / 50 = 30%.

Uncertain: Dutch term choices Getrapt overleg (tiered meetings; many sites just say “tier-overleg”), Technisch databeheerder (data custodian; no settled Dutch term), Telleroverloop, Scorekaart datakwaliteit. The app shows the English word next to each. ISO 8000 part titles beyond -8 and -61 not verified against the ISO catalogue, so not taught.

Review (2026-11-08): verified on eur-lex that Regulation (EU) 2026/1744 (Digital Omnibus on AI, adopted 8 July 2026, OJ 24 July 2026) sets 2 December 2027 (Annex III) and 2 August 2028 (Annex I); now named in `ml`. Power BI refresh limits re-checked on Microsoft Learn (8 Pro, 48 PPU/Premium/Fabric). “Measure” renamed “DAX measure” / “DAX-meting” because the module-wide term linking tied the verb “measure” and Dutch “meting(en)” to the DAX definition; hour-by-hour chart and tiered meetings now use pm.perform’s and pm.land’s names and point there; EEMUA wording matches eng.process (“in normal running”); persistence scoped to fast sensor readings so it does not contradict the XmR rule that one point outside the limits is a signal. Length ranks of correct options spread (en: longest-tied 4, 2nd 16, 3rd 22, shortest 22; nl: 3 / 21 / 23 / 17; never the unique longest).

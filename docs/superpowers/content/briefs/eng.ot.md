# eng.ot — IT/OT on the shop floor (engineering, track it, level 2)

Index entry: `{ id: 'eng.ot', subject: 'eng', track: 'it', level: 2, title: { en: 'IT/OT on the shop floor', nl: 'IT/OT op de fabrieksvloer' }, topics: [...4], lessons: [...16 ids], questions: {...all 4} }`, registered right after `eng.itbasics` in the `it` track.

Spec: section 3 of `docs/superpowers/plans/2026-11-07-v13-listen-ict-outside-layout.md` (Engineering · IT en OT, second module). Writing rules: the v10 content brief and the clarity brief (terms explained at first use, English term in parentheses in NL, no Dutch in EN, worked examples at levels 1–2, faded at 3–4, balanced answer positions, a usable hint on every numeric recall question).

Learner: a Lean consultant at manufacturers. He has to follow conversations between IT, OT engineers, MES/ERP suppliers and integrators, ask the sharp question, and not be sold a buzzword. The module explains the words and the judgement calls. It does not teach configuration.

## Topics and levels

| Topic (id) | 1 Basis | 2 Werkkennis | 3 Gevorderd | 4 Expert |
|---|---|---|---|---|
| ISA-95 and Purdue (`levels`) | `levels`: ISA-95 (IEC 62264), levels 0–4, PLC/SCADA/MES/ERP, timescale per level, “what if it is down an hour” | `purdue`: Purdue model (Williams, early 1990s) as network architecture vs ISA-95 as functional model; levels 4/5, industrial DMZ at 3.5; “level 3” means a task or a network zone | `hierarchy`: equipment hierarchy (enterprise, site, area, work center, work unit), work-center kinds, MOM and its four areas (part 3), naming convention | `beyond`: IIoT, cloud MES, edge layer, site autonomy, local fallback; where a task belongs (response time, effect of losing the link, owner); “the pyramid is dead” debate |
| PLC, SCADA, MES and ERP (`stack`) | `systems`: one order through all systems; HMI, production order, BOM, routing, master data; who keeps what | `orderflow`: ISA-95 schedule down / performance up; work order, recipe, confirmation, goods receipt (SAP 101/261), backflush and its stock error | `handshake`: cumulative counter, 16-bit rollover, reset on restart, handshake, source timestamp, quality flag | `integration`: system of record, granularity, outage behaviour, error queue, reconciliation, interface owner |
| OPC UA, MQTT and the historian (`protocols`) | `historian`: tag (value, time, quality), historian, sample interval, deadband / report by exception, compression (swinging door) | `opcua`: OPC UA (IEC 62541, 2008), client/server, information model, subscription vs polling, certificates, companion specifications (EUROMAP 77, umati, PackML) | `mqtt`: publish/subscribe, broker, topics, wildcards + and #, QoS 0/1/2, retained message, last will, Sparkplug (ISO/IEC 20237) | `uns`: unified namespace as an idea, not a standard; hub vs point-to-point (n(n−1)/2); current state vs history vs transactions; data governance; broker as critical system |
| IT/OT convergence (`convergence`) | `ownership`: IT/OT convergence, parties on the floor (IT, OT, maintenance, OEM, system integrator), grey areas, RACI, shadow IT | `patching`: patch, qualified patch, patch window, compensating control, lifecycle status, phase-out (S7-300), Windows 10 end of support and ESU | `change`: management of change, version control, baseline, online change, emergency change, safety functions revalidated | `governance`: three organisation models, governance, OT steering group, IEC 62443 roles (asset owner, product supplier, service provider), lifecycle budget, progress measures |

5 teach blocks per lesson (all ≤ 90 words), 4–6 terms per lesson. The en and nl `terms` lists are in the same order, and each term appears literally in its lesson's teach text (checked by script). Each term is defined once in the module.

## Building on other modules (pointers, not repeats)

- `eng.itbasics`: IP, VLANs, firewalls, ports (4840 for OPC UA), segmentation, DMZ, IEC 62443 zones and conduits, store-and-forward, error queues, end of support. eng.ot refers to it by name: “IT-fundamenten, les ‘Waarom het OT-netwerk apart staat’” (ownership), “les ‘Koppelingen die breken’” (integration), the ports (opcua) and the DMZ (purdue).
- `eng.lines`: how a PLC works (levels) and machine safety (change: “Machineveiligheid: noodstop, afscherming en de regels” / “Machine safety: emergency stop, guarding and the rules”).
- `eng.industry40` (same track, level 4, to be rebuilt as data topics) also mentions the automation pyramid, OPC UA and MQTT at a summary level. eng.ot now carries the depth on those subjects. A later rebuild of industry40 can point here.
- `eng.cyber` (not built yet): IEC 62443 security levels, NIS2 and the Cyberbeveiligingswet. governance names the roles and points to the Cybersecurity module for the rest.

## Decisions

- **Module level 2.** It assumes eng.itbasics (level 1) and sits below industry40 (level 4).
- **PLC placement.** Some drawings put the PLC at level 1 (basic control), others at level 2. The text says so instead of picking a side.
- **Purdue vs ISA-95.** The two are presented as two maps: function (ISA-95) and network (Purdue as security practitioners use it). Level 3.5 is explicitly “added later by practitioners” and “numbering is a habit, not a law”.
- **UNS is hedged.** The term is “usually credited to” Walker Reynolds and became popular “after 2020”. It is “not a standard, no official definition”, and its limits are spelled out: it does not replace history or transactions, governance is the hard part, and the broker becomes critical. The faded example ends with “fewer interfaces, not zero”.
- **Organisation models (governance)** are described as a real disagreement among practitioners, with no winner.
- **Vendor names** (SAP, Microsoft Dynamics, AVEVA PI, Ignition, Canary, Siemens S7-300) are examples. The text says “examples, not advice” where it lists products.
- **NL term choices:** “Abonnement (subscription)”, “Overloop (rollover)”, “Referentieversie (baseline)”, “Afstemming (reconciliation)”, “Leidend systeem (system of record)”, “Vrijgegeven patch (qualified patch)”, “Asseteigenaar (asset owner)”. These are the words a Dutch plant would use, and the English is given in the definition and in the teach text. “Backflush”, “Deadband”, “Tag”, “Topic”, “Broker”, “Hub” stay English in Dutch too, as they do on the floor.
- **No Dutch in EN.** The Dutch Cyberbeveiligingswet is called “the Dutch Cybersecurity Act” in EN. Example paths in EN use English words (baker/breda/bread, company/tilburg/pressshop).
- **Answer positions:** 68 multiple-choice questions (16 pre + 52 recall), 17 / 17 / 17 / 17 over positions 0–3. The positions are the same in en and nl. In neither language is the correct option the unique longest one (checked by script). 12 recall questions are numeric. Each has its own `hint` (no number that gives the answer away; the validator's `containsAnswer` check passes).

## Facts and sources (checked 2026-11-08)

- ISA-95 = ANSI/ISA-95, published internationally as IEC 62264. Part 1 is from 2000. Levels 0–4, with timeframes for level 4 (months, weeks, days) and level 3 (days, shifts, hours, minutes, seconds), and level 2 in (sub)seconds. Sources: OPC Foundation reference, ISA-95 summary, https://reference.opcfoundation.org/specs/OPC-10030/4.2 and https://reference.opcfoundation.org/specs/OPC-10030/4.2.3; Control Global, https://www.controlglobal.com/articles/2008/ISA95enterpriselevels. Sources overlap on “shifts” between levels 3 and 4; the text follows the OPC spec.
- ISA-95 part 3: MOM with four areas, namely production, quality, maintenance and inventory operations management. The equipment hierarchy runs enterprise, site, area, work center (production line, process cell, production unit, storage zone), work unit. Source: ISA-95 summaries above and the ISA-95 part 1/3 object models as summarised there.
- ISA-95 information flows: production schedule (down) and production performance (up), plus product definition / master data. Source: ISA-95 part 2 object models, as summarised in the OPC spec above and https://www.automationworld.com/home/article/13309289/identified-information-categories-for-momerp-data-flows.
- Purdue model: Theodore J. Williams and the Industry–Purdue University Consortium for CIM, early 1990s (sources give 1991 or 1992, so the text says “early 1990s”). It was originally about information flows in CIM. The iDMZ at level 3.5 was added later by practitioners, and diagrams vary. Sources: https://softwaretoolbox.com/resources/what-is-purdue-model, https://www.sentinelone.com/cybersecurity-101/cybersecurity/what-is-the-purdue-model/, https://www.tripwire.com/state-of-security/revisiting-the-relevance-of-the-industrial-dmz-idmz, https://pera.net/Pera/Wha_PERA_Ref_Model.html.
- OPC UA: IEC 62541. First release 2008. OPC Classic (1996 onward) was based on Microsoft COM/DCOM, so Windows only. The default port is 4840 (IANA, see the eng.itbasics brief). Companion specifications: EUROMAP 77 (injection moulding), umati (machine tools), PackML. Sources: OPC Foundation, https://opcfoundation.org/wp-content/uploads/2019/02/Overview-UA-InformationModels.pdf; KEBA, https://www.keba.com/en/news/industrial-automation/standards-future-automation-scape; Omron, https://www.omron.com/global/en/technology/omrontechnics/vol57/001.html.
- MQTT: created in 1999 by Andy Stanford-Clark (IBM) and Arlen Nipper for oil pipeline monitoring over satellite. OASIS standard (3.1.1 in October 2014, 5.0 in March 2019) and ISO/IEC 20922:2016. Ports 1883 and 8883 (TLS). QoS 0/1/2, wildcards + and #, retained messages and last will are in the spec. Sources: HiveMQ MQTT Essentials, https://www.hivemq.com/blog/mqtt-essentials-part-1-introducing-mqtt; https://en.wikipedia.org/wiki/MQTT.
- Sparkplug 3.0 = ISO/IEC 20237:2023 (PAS transposition via JTC 1). It adds a topic namespace, a payload definition and session state, none of which MQTT itself dictates. Sources: Eclipse Foundation, https://newsroom.eclipse.org/node/39754 and https://blogs.eclipse.org/post/fr%C3%A9d%C3%A9ric-desbiens/sparkplug-specification-standard; ARC, https://www.arcweb.com/blog/sparkplug-now-official-isoiec-standard.
- Unified namespace: there is no formal definition or standard, and usage varies by vendor. It is rooted in the ISA-95 equipment hierarchy. The term is attributed to Walker Reynolds (4.0 Solutions), who reportedly coined it around 2015; it became popular later. Sources: https://netfoundry.io/resources/tag/uns, https://uns-manifesto.github.io/about.html, https://itotinsider.substack.com/p/unified-namespace-uns, and a pitfalls article at https://www.hpcwire.com/bigdatawire/2024/07/02/when-mqtt-falls-down-5-common-pitfalls-in-uns-design/. The text keeps the attribution hedged (“usually credited to”) and says “popular after 2020”, not a coinage date.
- Historian compression: deadband / report by exception, and swinging door trending (E. H. Bristol; US patent 4,669,097; ISA 1990 paper), which became the default in OSIsoft PI. Sources: https://www.influxdata.com/learn/why-do-data-historians-compress-data/, https://www.umh.app/insight/downsampling-in-industrial-iot-from-dead-band-to-swinging-door-trending.
- SAP movement types 101 (goods receipt for a production order) and 261 (goods issue for an order) are standard SAP. They are phrased as “in SAP, for example”.
- Siemens S7-300 / ET 200M: phase-out announcement (PM400) on 1 October 2023 and end of new delivery (PM410) on 1 October 2025; spare parts planned until 1 October 2033. Sources: Siemens Energy migration document, https://assets.siemens-energy.com/dam/5395ce70-9a96-4149-a0a4-b3f5008d4de6/2026--ET200M-MigrationV6-pdf_Original%20file.pdf; https://www.eichler-service.com/en/magazine/article-search/articles/simatic-s7-300-et-200m-type-discontinuation-pm410-effective-october-2025; https://www.pattiengineering.com/blog/siemens-lifecycle-and-upgrade-planning. Siemens' own notice is entry 109809890 at Siemens Industry Support. The text says “planned until 2033”.
- Windows 10: regular support ended on 14 October 2025, and paid Extended Security Updates for organisations run up to three years, to October 2028. Source: Microsoft lifecycle, as checked for the eng.itbasics brief (https://learn.microsoft.com/en-us/lifecycle/products/windows-10-iot-enterprise and the ESU note in that brief).
- IEC 62443 roles: asset owner, product supplier, service provider (integration and maintenance). Source: the IEC 62443-1-1 / 2-4 role model. Not re-fetched for this module; these are the standard role names used throughout the series.
- Management of change is mandatory in process safety regimes, e.g. OSHA 29 CFR 1910.119(l), and the Seveso-based regime in the EU. The text says only “often mandatory in the process industry”.
- NIS2 and the Dutch Cyberbeveiligingswet are named, not explained. The detail belongs to eng.cyber; the commencement date is in the eng.industry40 brief.

Hedged rules of thumb, not presented as norms: PLC life “can be twenty years”; a Windows version is patched for “about ten years”; certificate expiry “is a known cause” of interfaces that stop; the deadband trial “leaves about 10%” (labelled as the supplier's trial in the example); the cloud round trip is “tens of milliseconds” (consistent with the eng.itbasics latency range).

## Recalculations

- hierarchy r0: 3 × 4 = 12 lines; 12 × 5 = 60 work units.
- beyond r0: 6 h × 150 = 900 pieces.
- systems: example 2,000 × 25 g = 50 kg; r0 4,000 × 15 g = 60,000 g = 60 kg.
- orderflow: example 960 × 25 g = 24 kg booked against 1,000 × 25 g = 25 kg used, a gap of 1 kg. r0 100 × 40 g = 4 kg.
- handshake: pre 300 − 65,000 is negative. Example 1,650 − 450 = 1,200; 65,536 − 65,200 = 336; 336 + 450 = 786. r0 65,536 − 65,400 = 136; 136 + 250 = 386.
- integration: example 9,980 + 180 = 10,160; 10,240 − 10,160 = 80; 9,980 − 9,700 = 280. r0 48,500 − 46,100 = 2,400; 2,400 − 1,900 = 500.
- historian: teach and example 400 × 86,400 = 34,560,000 a day, about 10% of which is ≈ 3.5 million. r0 3,600 / 5 = 720; 720 × 250 = 180,000.
- mqtt r0: 86,400 / 10 = 8,640; 8,640 × 40 = 345,600.
- uns: teach 8 × 7 / 2 = 28 against 8; r0 10 × 9 / 2 = 45.
- patching r0: 2033 − 2026 = 7 years.
- change r0: 18 / 60 = 0.30 = 30%.
- governance: teach 120 / 15 = 8 a year; example and r0 90 / 6 = 15 a year.

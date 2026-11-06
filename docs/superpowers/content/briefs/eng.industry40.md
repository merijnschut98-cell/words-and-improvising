# eng.industry40 — Data and digital manufacturing (engineering, track discrete, level 4, FADED examples)
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

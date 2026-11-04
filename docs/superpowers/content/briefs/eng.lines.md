# eng.lines — Assembly lines, automation and robots (engineering, track discrete, level 3, FADED examples)
Index title: en 'Lines and automation' / nl 'Lijnen en automatisering'. Blurb: en 'Designing and improving assembly lines with automation: robots, poka-yoke, changeover and the business case.' / nl 'Assemblagelijnen ontwerpen en verbeteren met automatisering: robots, poka-yoke, omstellen en de businesscase.'
1. `eng.lines.layout` — line types (paced, unpaced, cells), buffers, decoupling, where to put inspection.
2. `eng.lines.robots` — robot types (articulated, SCARA, cobot), reach, payload, cycle, safety zones.
3. `eng.lines.pokayoke` — error-proofing in engineering terms: sensors, fixtures, interlocks, vision.
4. `eng.lines.mixed` — mixed-model lines, variants, sequencing, balancing with variation.
5. `eng.lines.oee_auto` — automated line OEE: micro-stops, starved/blocked, the hidden bottleneck.
6. `eng.lines.business` — automation business case: payback, flexibility, when not to automate.

## Numbers used, sources and recalculations (deepening pass, 2026-11-04)

Every term is now explained at first use, inside the sentence. Lesson ids, recall order and what each recall tests are unchanged.

### eng.lines.layout
- Takt example: 60 products per hour gives 3,600 / 60 = 60 s per product (definition of takt time; Rother & Shook, *Learning to See*).
- Buffer sizing: stop length / cycle time. 3 min at 30 s: 180 / 30 = 6. 4 min at 40 s: 240 / 40 = 6. Recall: 5 min at 30 s: 300 / 30 = 10.
- Hard-linked lines: line availability is roughly the product of station availabilities when stops are independent and there are no buffers (Buzacott & Shanthikumar, *Stochastic Models of Manufacturing Systems*; standard result for serial lines with zero buffers). 0.95^8 = 0.663, about 66 %.
- Inspection placement (after the risky step, before irreversible or expensive steps, before the bottleneck): standard quality-planning practice (Juran’s Quality Handbook; Goldratt, *The Goal*, for protecting the constraint).

### eng.lines.robots
- Articulated robots reach about 0.7–3 m (e.g. FANUC LR Mate 0.7 m to M-2000iA 3.7 m; ABB IRB 120 0.58 m to IRB 8700 4.2 m) and payloads from a few kg to over a tonne (FANUC M-2000iA/2300: 2,300 kg). "Typically 0.7 to 3 m" is the common middle of the range.
- SCARA: 4 axes, horizontal plane; delta: parallel-arm picker over a conveyor (IFR World Robotics definitions).
- Cobots: most 3–20 kg (UR3e 3 kg … UR20 20 kg); a few about 30 kg (UR30, FANUC CRX-30iA).
- Payload includes end-of-arm tooling; allowed load drops with centre-of-gravity distance from the flange (manufacturer payload diagrams, e.g. ABB product specs “load diagram”).
- Gripper actuation 0.2–0.5 s per open/close: typical pneumatic gripper times incl. valve response (Schunk/Festo datasheets give 0.05–0.3 s for the jaws alone; with valve and sensor confirmation 0.2–0.5 s is a practical planning figure).
- Example: 6 kg part + 4 kg gripper = 10 kg = 100 % of a 10 kg robot. Real cycle 7–9 s from 4 s motion: planning estimate, stated as “often”.
- Recall: (7 + 5) / 0.8 = 15 kg.
- Standards: ISO 10218-1:2025 (robots) and ISO 10218-2:2025 (robot applications and cells). The 2025 revision integrates the content of ISO/TS 15066 (collaborative force/pressure limits). CE marking under the Machinery Directive 2006/42/EC (Machinery Regulation (EU) 2023/1230 from January 2027).

### eng.lines.pokayoke
- Visual inspection effectiveness about 80–90 % for trained inspectors (Drury & Fox, *Human Reliability in Quality Control*; See, “Visual Inspection: A Review of the Literature”, Sandia SAND2012-8590: typical 80 % detection, lower for rare defects).
- Inductive proximity sensors: sensing range a few mm (typically 1–15 mm by housing size; IEC 60947-5-2).
- 3 % false rejects: illustrative figure, stated as “a camera that rejects 3 %”.
- Recall: 400 ppm × (1 − 0.85) = 60 ppm. Example: 1 in 2,000 = 500 ppm missing screws, 85 % caught, 75 ppm escape (not asked).

### eng.lines.mixed
- Pre: (50 + 70) / 2 = 60 s average; two Bs in a row: +10 +10 = 20 s behind.
- Example: 0.5 × 100 + 0.3 × 120 + 0.2 × 160 = 50 + 36 + 32 = 118 s. L over takt: 160 − 120 = 40 s; two Ls 80 s; one S gives back 120 − 100 = 20 s; two S give 40 s.
- Teach: 40 s over, 20 s back, two heavy = 80 s behind, four light × 20 = 80 s to recover.
- Recall: 0.7 × 48 + 0.3 × 75 = 33.6 + 22.5 = 56.1 s.
- Sequencing rules (spacing constraints “at most 1 in N”), kitting and sequenced supply: Boysen, Fliedner & Scholl, “Sequencing mixed-model assembly lines: survey” (EJOR 2009).

### eng.lines.oee_auto (has figure eng.lines.auto; numbers asserted by figures/eng.lines.auto/build.mjs, unchanged)
- OEE = availability × performance × quality (Nakajima, *Introduction to TPM*).
- Micro-stops 10–20 % of output on automated lines: industry experience (e.g. Vorne/OEE.com on small stops); the figure checks 20 stops/h × 30 s = 600 s = 16.7 %, within the range.
- 0.9^4 = 0.656 → 66 %; 0.95^5 = 0.774 → 77 %.
- Robot vs person (matches figure): 3,600 / 36 = 100 per hour; performance 1 − 600/3,600 = 0.833; 100 × 0.9 × 0.833 = 75 per hour; person 3,600 / 45 = 80 per hour.
- Bottleneck by state data (most running, least starved/blocked): “active period” / turning-point methods (Roser, Nakano & Tanaka, 2001–2002; Kuo, Lim & Meerkov bottleneck indicators).
- Bottling example: labeller 74 % running, 23 % faulted, 2 % starved, 1 % blocked = 100 %; filler 71 + 22 = 93 % (rest starved/faulted); capper 68 + 25 = 93 %.

### eng.lines.business
- Operator cost NL €50,000–60,000 per year incl. employer charges: CAO metal and electrical (Metalektro / Kleinmetaal) operator wages around €3,000–3,600 a month plus holiday pay, 13th month in some CAOs, and employer charges of roughly 30–40 % (CBS labour cost statistics, 2024).
- Two shifts: 2 × €55,000 = €110,000.
- Robot is a quarter to a third of cell cost: IFR and integrator rules of thumb (e.g. IFR World Robotics notes system cost typically 3–4 × the robot price).
- Ramp-up 3–6 months: integrator experience; stated as “often”.
- Payback 2–3 years expected: common hurdle in manufacturing capex (stated as “many manufacturers”).
- Example: 2 × 55,000 − 10,000 = 100,000; 300,000 / 100,000 = 3 years. Recall: 240,000 / 80,000 = 3 years.

## v10 topics (added 2026-11-04)

Six topics, four levels each: 1 Basis, 2 Werkkennis, 3 Gevorderd, 4 Expert. Example kind follows the level **in the topic**: worked at 1–2, faded (ask + reveal) at 3–4. Integrator rulings: teach 3–5 blocks of ≤ 90 words with `\n\n` paragraphs; terms 2–6 per lesson, en and nl lists in the same order with the same count, each term literally in that lesson’s teach text; each term defined once per module (lowest level that uses it); in .nl text an important technical word not in the terms list gets its English word once in parentheses.

| Topic (id) | 1 Basis | 2 Werkkennis | 3 Gevorderd | 4 Expert |
|---|---|---|---|---|
| Lijnontwerp `design` | `linebasics` | `layout` (existing, now worked) | `buffers` | `simulation` |
| Robots `robots` | `robotbasics` | `robots` (existing, now worked) | `robotcell` | `vision` |
| Foutvrij maken `errorproof` | `errors` | `pokayoke` (existing, now worked) | `sensors` | `detection` |
| Varianten en omstellen `variants` | `variants` | `linechange` | `mixed` (existing, faded) | `sequencing` |
| Besturing en data `control` | `plc` | `safety` | `oee_auto` (existing, faded, figure `eng.lines.auto`) | `stoppages` |
| Businesscase `business` | `autobasics` | `payback` | `business` (existing, faded) | `risk` |

### Scope per level (topics 1–3 written in batch 1)
- `linebasics` — follow one product: station, cycle time (stopwatch, typical value), bottleneck = longest cycle, takt from demand, transport (roller track, conveyor, pallets), manual / semi-automatic / automatic, stack light.
- `layout` — paced vs unpaced lines and cells, buffers sized on stop length, inspection placement, hard-linked availability.
- `buffers` — blocked and starved, decoupling, size = stop length / cycle of the station that keeps working, size on typical stops not breakdowns, refill needs spare capacity (refill time = places / rate difference), protect the bottleneck (full before, nearly empty after), diminishing returns, WIP.
- `simulation` — why averages overstate output, discrete-event simulation (Plant Simulation, FlexSim, Arena), when to simulate, MTBF/MTTR with spread, validate against a real line, Little’s law as a sanity check, ramp-up curve, credible questions.
- `robotbasics` — six axes, controller, gripper types (fingers, vacuum, torch), TCP, teach pendant with enabling switch, manual mode ≤ 250 mm/s vs automatic.
- `robots` — articulated, SCARA, delta, cobot; payload incl. gripper and the payload diagram; real cycle vs datasheet; guarding, risk assessment, CE.
- `robotcell` — cycle build-up and machine idle time, double gripper, part feeding (trays, conveyor stops, vibratory bowl feeder), gripper per part, ISO 13855 safety distance, measured stopping time, safety-rated zones.
- `vision` — 2D vision and conveyor picking, 3D bin picking and its limits, offline programming, the four collaborative modes, power and force limiting (ISO/TS 15066, now in ISO 10218-2:2025), when a cobot fits.
- `errors` — why people make mistakes, mistake vs defect (Shingo), poka-yoke as a warning or a stop, everyday examples, pick-to-light, ppm.
- `pokayoke` — prevention vs detection, sensor types, interlock, inspection effectiveness, false rejects and bypasses.
- `sensors` — start from the physical difference; inductive (metal, correction factors), capacitive, photoelectric (through-beam, diffuse with background suppression), camera, force-displacement monitoring; validation with reference parts per failure mode incl. the borderline case.
- `detection` — PFMEA S/O/D, AIAG-VDA action priority, detection scored backwards, order of preference, escapes in ppm, red rabbit each shift, reaction plan and containment back to the last good check (IATF 16949 10.2.4).

### Term placement (once per module)
- Moved: `Takt`, `Bottleneck` from `layout` to `linebasics`; `Poka-yoke` from `pokayoke` to `errors`; `Starved`, `Blocked` from `oee_auto` to `buffers` (the oee_auto text still uses them; they stay tappable). Added `Photoelectric sensor` / `Foto-elektrische sensor` to `pokayoke`.
- Already defined in topics 1–3, so batch 2 must **not** define them again: Station, Cycle time, Takt, Bottleneck, Conveyor, Stack light, Paced line, Cell, Buffer, Hard-linked, Blocked, Starved, Spare capacity, WIP, Discrete-event simulation, MTBF, MTTR, Little’s law, Axis, Gripper, Tool centre point, Teach pendant, Enabling switch, Payload, Flange, End-of-arm tooling, SCARA robot, Cobot, Area scanner, Double gripper, Vibratory bowl feeder, Light curtain, Safety distance, Stopping time, Vision, Bin picking, Offline programming, Speed and separation monitoring, Power and force limiting, Mistake, Defect, Poka-yoke, Pick-to-light, ppm, Fixture, Inductive sensor, Photoelectric sensor, PLC, Interlock, False reject, Capacitive sensor, Background suppression, Force-displacement monitoring, Reference part, PFMEA, Action priority, Escape, Red rabbit, Reaction plan (nl equivalents in the files). For `plc` and `safety`: PLC, Interlock and Light curtain are already defined; re-explain them in a clause and define only new terms. Ramp-up stays defined in `business` (simulation explains it inline).

### Facts and sources (verified 2026-11-04)
- **ISO 13855 safety distance** S = K × T + C; K = 2,000 mm/s when S ≤ 500 mm, otherwise recalculate with K = 1,600 mm/s with a minimum of 500 mm; C = 8 × (d − 14) mm for resolutions up to 40 mm. Sources: Datalogic safety catalogue (https://www.datalogic.com/upload/Flipbook/General%20Catalogue%20S&S/files/assets/basic-html/page382.html), Siemens SIMATIC FS400 manual (https://www.manualslib.de/manual/167660/Siemens-Simatic-Fs400.html?page=143), Wenglor manual (https://manualedistruzioni.it/wenglor/security-sensor/sg4-i/user-manual/1tdls). Used: recall 2,000 × 0.15 + 8 × (30 − 14) = 300 + 128 = 428 mm; teach: a 30 mm curtain adds 128 mm, a 14 mm curtain 0. T includes curtain response, interface and machine stop (Omron, Siemens), hence “measure it”.
- **Reduced speed ≤ 250 mm/s in manual mode, three-position enabling device**: ISO 10218-1 (2011, kept in 2025). Sources: ABB IRB 4400 manual (https://www.manualslib.com/manual/1255423/Abb-Irb-4400.html?page=8), comparison of the 2011 and 2025 editions (https://arxiv.org/pdf/2602.17822). Used: 1,500 / 250 = 6 s; recall 2,000 / 250 = 8 s.
- **ISO 10218-1/-2:2025** published (Part 2 February 2025) and integrating the ISO/TS 15066 collaborative requirements: ISO (https://www.iso.org/standard/73934.html), A3 (https://www.automate.org/robotics/news/updated-iso-10218-major-advancements-in-industrial-robot-safety-standards-now-available/aph).
- **ISO/TS 15066**: four collaborative modes (safety-rated monitored stop, hand guiding, speed and separation monitoring, power and force limiting); force and pressure limits per body region; high-throughput tasks often need speed and separation monitoring or guarding. Sources: A3 (https://www.automate.org/robotics/tech-papers/iso-ts-15066-explained), ISO news 2016 (https://www.iso.org/news/2016/03/Ref2057.html). The “half speed” in the vision example is a stated assumption, not a norm value.
- **Poka-yoke, mistake vs defect, warning vs control (stop)**: Shingo, *Zero Quality Control: Source Inspection and the Poka-yoke System*, Productivity Press, 1986 (https://www.routledge.com/Zero-Quality-Control-Source-Inspection-and-the-Poka-yoke-System/Shingo/p/book/9780915299072); summary at https://ie.binus.ac.id/2016/10/14/poka-yoke-concept-to-prevent-from-repeated-mistake/. Diesel nozzle wider than a petrol filler neck: EU nozzle sizes (diesel larger than unleaded), common knowledge.
- **Little’s law** L = λW: Little, “A Proof for the Queuing Formula: L = λW”, Operations Research 9(3), 1961, 383–387 (https://econpapers.repec.org/RePEc:inm:oropre:v:9:y:1961:i:3:p:383-387). Used: 60/120 = 0.5 h; 45/90 = 30 min; 120 × 20/60 = 40; 40/112 = 0.36 h ≈ 21 min.
- **Discrete-event simulation, validation against real output, buffer sizing**: Winter Simulation Conference 2015 (https://www.informs-sim.org/wsc15papers/114.pdf); Plant Simulation buffer study (https://www.macnica.co.jp/en/business/ai_iot/columns/149422/). Tool names are product facts.
- **Buffer refill needs spare capacity; the first places give the most**: standard serial-line results (Buzacott & Shanthikumar, *Stochastic Models of Manufacturing Systems*; Hopp & Spearman, *Factory Physics*). Arithmetic: 3,600/25 = 144, 3,600/30 = 120, 12 / 24 = 0.5 h; example 120 − 100 = 20 per hour, 5 / 20 = 0.25 h = 15 min; recall 10 / 30 h = 20 min; 240 / 40 = 6. “80 to 90% of stops” as sizing basis is stated as “a common choice”.
- **Inductive sensor correction factors**: steel 1.0, stainless 0.6–1.0, aluminium 0.30–0.45, brass 0.35–0.50, copper 0.25–0.45 (Balluff, https://www.balluff.com/en-us/blog/inductive-proximity-sensor-targets-material-does-matter; autosen, https://autosen.com/en/Category/ListArticles/323). Teach says “roughly a third to a half”. Recall 8 × 0.4 = 3.2 mm (factor given in the question).
- **Capacitive sensors detect non-metals and liquid through a non-metallic wall**: https://www.processonline.com.au/content/factory-automation/article/the-often-overlooked-proximity-sensor-860374427.
- **Force-displacement monitoring with windows / an envelope from good parts**: Kistler (https://news.thomasnet.com/fullstory/evaluation-unit-monitors-joining-and-press-fit-processes-581874).
- **AIAG-VDA FMEA Handbook (2019)**: action priority (H/M/L) replaces RPN, severity weighted first; detection 1–10 with 10 the weakest. Sources: https://www.pharmaceuticalonline.com/doc/is-it-time-to-say-goodbye-to-fmea-risk-priority-number-rpn-scores-0001, https://reliamag.com/guides/how-to-perform-fmea/. The lessons give no exact D values for a check, only “high” vs “low”.
- **Red rabbit verification at the start of a shift; reaction plan for error-proofing failures (IATF 16949 clause 10.2.4)**: https://ease.io/blog/poka-yoke-verification, https://elsmar.com/elsmarqualityforum/threads/iatf-16949-clause-10-2-4-error-proofing.69146/page-5. Containment back to the last successful verification is common automotive practice (nothing since then was proven checked); stated as practice, not quoted from the standard. Example 8 × 60 = 480; recall 8 × 45 = 360.
- **Escapes**: 1,000 × 0.001 = 1 ppm; 2,000 × 0.005 = 10 ppm; 1,000 × 0.15 = 150 ppm (85% caught by eye, from the visual-inspection source above).
- **Plain arithmetic**: 3,600/45 = 80; 28,800/960 = 30 s; 25,200/420 = 60 s; 25,200/65 = 387; 27,000/900 = 30 s; 3,600/40 = 90; 1,000,000/5,000 = 200 ppm; 1,000,000/2,500 = 400 ppm; cell 40 + 20 = 60 s gives 60 per hour, 40 + 8 = 48 s gives 75 per hour (+25%); 3,600/60 = 60; cobot 12 + 4 = 16 s against a takt of 14; 2 × 5 + 3 = 13 s.

### Validator note
`src/content/courses/validate.js` now takes the example kind from the lesson’s level in its topic when that topic lists 4 levels; otherwise it falls back to `meta.level` (so topics 4–6, which hold one existing level-3 lesson for now, still validate). Task 1’s full topic rules can replace this.

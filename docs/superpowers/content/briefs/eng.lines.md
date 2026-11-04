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

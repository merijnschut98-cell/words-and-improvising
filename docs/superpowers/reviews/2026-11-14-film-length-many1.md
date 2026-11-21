# Review batch many1 (14 films, each serving 3 or 4 lessons)

Conventions. "Current s" is the rendered nl length where the dossier has one, else the planned length (eng.joining.production is not rendered: 266 s planned, 315 s by the word formula). "Proposed s" is the trim-only version (beats cut), computed as 2.5 words per second plus 2 s per scene, so it is not strictly comparable with rendered lengths; "saving %" is the share of narration words cut. Beat-class percentages are my estimates by words. Worked-example Question/Answer content was treated as NEW/NEEDED-DETAIL throughout; no beat that carries a question or answer was counted as an extra. "Dropped points" counts distinct teach sub-points or example steps of the served lessons that are not in the film at all (paraphrases that carry the point count as present); the counts are approximate, +-3.

| film | current s | verdict | proposed s | saving % | one-line reason |
|---|---|---|---|---|---|
| eng.joining.arc | 271 | TIGHT (drops points) | 260 | 3 | Every beat carries a point; but about 30 lesson points are missing, among them most of the weldparams and metallurgy worked examples |
| eng.joining.bolting | 340 | TIGHT | 314 | 3 | Dense, all four lessons mostly carried with numbers; about 19 minor points missing (tools, loosening causes, joint-design trade-offs) |
| eng.joining.bonding | 318 | TIGHT | 304 | 5 | Few decor sentences (postage-stamp image, secondelijm); about 17 points missing (heat curing, ISO 4587, ELV, cost difference) |
| eng.joining.defects | 356 | TIGHT | 328 | 4 | Scene 1 is mostly framing but the rest is dense; about 24 points missing, including the solution of the inspection example |
| eng.joining.production | 266 (planned) | TIGHT | 305 | 3 | Almost every beat is lesson content; 11 points missing; planned length is below what the 748 words take |
| eng.joining.spot | 285 | TIGHT (drops points) | 272 | 2 | Very little extra; about 20 points missing, including aluminium, two of three peel-test points and the stepper rule |
| eng.lines.control | 327 | TIGHT | 299 | 3 | Two frame beats and a hook; about 14 points missing (series availability, robot-vs-human, MES pitfall) |
| eng.lines.design | 304 | TIGHT | 303 | 3 | Dense and worked-example complete; about 16 points missing (where to inspect, ramp-up, 80-90% rule) |
| eng.lines.errorproof | 294 | TIGHT | 294 | 5 | Scene 1 is scene-setting; rest carries points; about 16 missing (sensor validation counts, containment steps) |
| eng.lines.robots | 312 | TIGHT | 308 | 5 | Scene 1 is partly decor/filler; about 18 missing, including the second half of the payload example (real cycle 7 to 9 s) |
| eng.lines.variants | 325 | TIGHT | 313 | 4 | Both examples complete in a tight film; about 11 minor points missing |
| eng.machining.cnc | 244 | TIGHT (too short for its lessons) | 228 | 3 | Nothing to cut, but about 31 points missing: three of four worked-example answers (offsets, cam, gcode) are absent |
| eng.machining.drilling | 233 | TIGHT (too short for its lessons) | 237 | 2 | Nothing to cut; about 22 points missing, including the thermal-drift half of the position example |
| eng.machining.measuring | 308 | TIGHT | 278 | 6 | Roadmap scene 1 and a few echoes are the only frame; about 14 points missing (error causes, clamp distortion, ndc) |

Counts: TIGHT 14, TRIMMABLE 0, PADDED 0.
Lesson points dropped per film (approximate): arc 30, bolting 19, bonding 17, defects 24, production 11, spot 20, control 14, design 16, errorproof 16, robots 18, variants 11, cnc 31, drilling 22, measuring 14.

Overall reading. With 3 or 4 lessons in about 550 to 810 words, none of these films is padded: the narration cannot carry what the lessons teach, so length followed the content here (and more than the ceiling). The real issue is the opposite one: the films compress their lessons, usually by keeping the headline number of each worked example and dropping the reasoning steps, the "why" teach blocks and the manager/engineer questions. If the films are shortened by trimming, only 2 to 6 percent is available; if they are meant to carry every lesson point, they would need roughly 60 to 250 more words each (estimates per film below).

---

## eng.joining.arc (271 s rendered, 624 words, 9 scenes)

Lessons: arc, weldparams, wps, metallurgy.

Content map.
- arc: current, volts, kettle comparison s1 b2; arc and weld pool s1 b3, s2 b2; wire is electrode and filler s2 b1; shielding gas 12 to 18 L/min and why s2 b3 (82/18 and the active CO2 reason not there); TIG tungsten, loose rod, 3 to 5 times slower, uses s3; arc energy 24 V, 220 A, 400 mm/min = 0.79, times 0.8 = 0.63, range 0.5 to 0.9 s4 b1-b2; HAZ and too much/too little heat s4 b3; gas hose example and sensor s6. Not in the film: arc sound and spatter, MIG fast and automatable, tungsten melts at 3,400 degrees, foot pedal, root pass, scarce TIG welder, the arc-energy formula itself, 0.6 for TIG, warping.
- weldparams: wire speed gives current s5 b1; short arc and spray arc s5 b2-b3; deposition rate 5.3 kg/h s5 b4 (result only). Not in the film: the four knobs, voltage and arc length, pulse arc, 0.6 TIG and EN 1011-1, "halve the speed, double the heat", checking the window with a meter or robot log, the deposition-rate formula and density, spatter loss, and the whole example after 5.3 kg/h (a5 cross-section, 196 g/m, 83 g/min, 2.4 min/m, 420 mm/min, 29 V and 300 A giving 1.24 and 1.0 kJ/mm).
- wps: pWPS as test recipe s7 b1; essential variables and range s7 b2; thickness 12 mm covers 3 to 24, 22 is covered s7 b3; heat input 1.2 to 1.5, 1.6 outside s7 b4; ISO 9606-1 and coordinator s7 b5. Not in the film: ISO 15614-1 tests, WPQR to WPS chain, ISO 15612 shortcut, 6-month confirmation, ISO 14732 operators, EXC2, audit question, and the two options of the example answer.
- metallurgy: t8/5 s8 b1; martensite s8 b2; CEV 0.46 on 40 mm s8 b3 (result only); preheat and interpass s9 b1; H-crack wait 16 to 48 h s9 b2; heat tint s9 b3. Not in the film: long t8/5 gives soft HAZ, what lengthens or shortens t8/5, the CEV formula and the calculation steps (0.17 + 0.25 + 0.02 + 0.02), the three conditions for a hydrogen crack, EN 1011-2 inputs, the preheat trade-off in the example answer, austenitic stainless (40% more expansion, 150 degree interpass, argon purge), aluminium (oxide, 6082-T6 loses strength).

Beat classes (words): NEW 55%, NEEDED-DETAIL 20%, ELABORATION-USEFUL 14% (s1 b4-b5 wire reels and gas bottle, s6), FRAME 5% (s1 b1, s2 b1 opening), RESTATE 3%, DECOR/FILLER 3%.

Verdict: TIGHT. Nothing here is padding; the film is a sampler of four lessons.

Short version (trim only): cut s1 b1 first sentence and s2 b1 "Dit is MIG MAG-lassen" (about 20 words). 604 words, about 260 s. Restoring the highest-value dropped points (weldparams example steps about 60 words, CEV calculation about 40, WPS options about 40, TIG/MAG basics about 30) would add about 170 words and about 68 s, giving about 330 s. A 60 to 90 s taster would keep: arc, wire, shield gas, the 0.79 to 0.63 kJ/mm calculation, and the gas-hose failure with its sensor.

Points the film lacks: about 30, listed above.

## eng.joining.bolting (340 s rendered, 766 words, 9 scenes)

Lessons: bolts, bolting, tightening, jointdesign.

Content map.
- bolts: parts s1 b1; M10 x 1.5 and pitch s2 b1 (the x40 length and tapbolt missing); strength class and 8.8/10.9 values s2 b2-b4; nut class s2 b4; stress area M12 84.3 s3 b1; M12 8.8 vs 10.9, 54 vs 76 kN, 71% s3 b2 (the "separate bolts per class, check at first-article" conclusion missing); loosening: preload, thread locker, spring washers do not help s3 b3 (lock nuts, A2-70 and finishes missing).
- bolting: stiff spring and preload s1 b2-b3; torque 200 N on 25 cm is 50 Nm s4 b2; 49 Nm gives 25 kN, yield at 37 s4 b3; 50/40/10 split s5 b1; friction changes, 25 to 30%, oiled bolt on dry torque s5 b2; torque-angle s6 b1; audit breakaway 53 52 31 54 52, causes (twice turned, by feel), position monitoring, paint stripe s6 b2-b3; settling and longer bolt s6 b4. Not in the film: plus or minus 25% spread, click wrenches and pulse tools, calibrated wrench, vibration as a cause, too little preload, flange heads, no paint in the joint, the question "what preload do we need".
- tightening: tightening factor definition, 1.4 to 1.6 and 1.6 to 2.0 s7 b2-b3; torque-angle 1.2 to 1.4 and past yield, not reusable s8 b1; yield-controlled s8 b2; ultrasonic elongation s8 b3; flange example 30 kN, 1.8 gives 54 over 50, 1.4 gives 42 s7 b4; mu matters most s7 b3. Not in the film: plus or minus 17 to 23%, quarter-turn 0.375 mm, why designers need the factor (bigger bolt forced), the plus-minus 17% result, "a friction test saves a bolt size".
- jointdesign: two springs and diagram s9 b1; load factor 0.2, 2 kN extra s9 b2; 8 kN lost, 10.75 residual s9 b3; fatigue in first thread, amplitude 17 vs 50 MPa s9 b4; strength class does not help, slender bolt s9 b5. Not in the film: stiffness definition of Phi, why an external load relaxes the parts, VDI 2230 steps (only named s7 b1), manager trade-offs, 12.9 hydrogen embrittlement, the question "what residual clamp load do we need".

Beat classes: NEW 62%, NEEDED-DETAIL 22%, ELABORATION-USEFUL 9%, FRAME 4% (s1 b1 description, s7 b1), RESTATE 3%.

Verdict: TIGHT (long, but the length is carried by numbers and steps).

Short version: cut the last sentence of s1 b3 (restates "preload holds the joint"), s7 b1 as a stand-alone beat (merge into b2), and the "opengezaagd" description (about 25 words). 741 words, about 314 s. Restoring bolting tools, vibration as a cause, joint-design trade-offs: about 90 words, about 36 s. Taster (60 to 90 s): preload not torque, 8.8 meaning, M12 8.8 vs 10.9 at 71%.

Points the film lacks: about 19.

## eng.joining.bonding (318 s rendered, 755 words, 8 scenes)

Lessons: bonding, adhesives, rivets, choosejoint.

Content map.
- bonding: why not weld Al on steel s1 b1-b2; structural adhesive benefits s1 b3; families s2 b1; shear vs peel s2 b2-b4; SPR s3 b1; clinching s3 b2; glue plus rivets and example 14 m and 96 rivets s1 b3, s3 b3; how to choose s3 b4; blind rivet s6 b1. Not in the film: 180 degree paint-oven cure, fatigue, cleanliness as requirement, "you cannot look into a seam", solid rivets, clinching uses, the list of choice questions, the example's production checks (one box sawn per shift).
- adhesives: surface prep s4 b1; 2K and static mixer s4 b2; open time, purge, cure times s4 b3; bead and weigh and camera s5 b1-b2; 52 g, 44 g, 85%, cold barrel, pressure dosing, fix s5 b1-b2; cohesive vs adhesive failure s5 b3. Not in the film: "who touches the surface and for how long", 1K heat cure, ISO 4587 test geometry, the intermediate volume calculation (40.2 cm3, density 1.3).
- rivets: blind rivet s6 b1; head height and interlock s6 b2; force-displacement curve and window s7 b1; 36 to 44 kN, 0.4 per 1,000, 42.8, 3,000 rivets s7 b2-b3; clinch bottom thickness s7 b4. Not in the film: hole/burr/grip range of a blind rivet, residual thickness and the corrosion link, the curve phases, the SPC-chart analogy, macro section and recording die changes in the example answer.
- choosejoint: galvanic corrosion, series, area ratio, remedies s8 b1-b2; disassembly and flow-drill screw s8 b3; cost 1.44 and 3.6 million s8 b4 (result "meestal nagels"). Not in the film: carbon fibre in the series, ELV 95/85%, cost factors (cycle time, investment, inspection), adhesive needs an oven, the EUR 2.16 million difference, the manager's four questions.

Beat classes: NEW 58%, NEEDED-DETAIL 22%, ELABORATION-USEFUL 12% (s1 b2 melting points, s4 b1 "olie parelt"), DECOR 5% (s2 b3 "duizend kilo op een postzegel", secondelijm/MS clause in s2 b1), FRAME 3%.

Verdict: TIGHT.

Short version: cut the postage-stamp sentence, the secondelijm/MS clause and the first sentence of s1 b3 that repeats s3 b3 (about 35 words). 720 words, about 304 s. Restoring ISO 4587, 1K cure, solid rivets, ELV, and the cost difference: about 80 words, about 32 s. Taster: why not weld, shear vs peel, glue plus rivets, galvanic corrosion.

Points the film lacks: about 17.

## eng.joining.defects (356 s rendered, 810 words, 9 scenes)

Lessons: defects, inspection, ndt, weldrca.

Content map.
- defects: porosity cause s2 b1 (dirty/wet/zinc, spatter clogging, detection missing); lack of fusion s2 b2; hydrogen crack s2 b3 (hot cracks missing); distortion and remedies s2 b4; preheat 100 degrees, dry wire, 16 to 48 h s3 b1; ISO 5817 B/C/D s3 b2; boom example 3 of 40, 405 vs 300, 26%, 3.5 h s3 b3-b4. Not in the film: lack of penetration and root, spatter and undercut cosmetic, jigs and less heat as remedies, the question "who chose the level"; example: vertical-up second shift, weaving left out, robot breakdown cause, "realistic planning not a sermon".
- inspection: VT s4 b1; PT s4 b2-b3; UT and RT s5 b1; peel test with 32 points, 4.4 mm, 5,040 per day s5 b2; WPS/WPQR s5 b3. Not in the film: fillet throat gauge, MT introduced in s7 only, chisel test, macro etch, bend/tensile, sampling per shift, ISO 9606 and EN 1090 obligations, and the solution of the example (200 manual UT points per shift, control chart, peel test back to once a day).
- ndt: who chooses, EXC to level mapping s7 b1; 160 welds, 10%, 16 s7 b2; angle probe 45/60/70 s6 b1; A-scan and reference block s6 b2; MT s7 b3; ISO 9712 levels, test before wait time invalid s7 b4. Not in the film: EN 1090 percentages per spec, UT on thick plate, RT film/digital and night shift, expansion after rejection, the coordinator's cause search.
- weldrca: repair rate 2.6% s8 b1; ISO 6520-1 code 401, welder/position/shift, pareto s8 b2; 41/12/9, 33 vertical-up, technique not person s8 b3; residual stress and relief s9 b1-b2; overwelding 5 vs 4 = 56% s9 b3. Not in the film: robot/time/supplier patterns, parameter log vs WPS, training not first, residual stress up to yield, remedies other than annealing, the manager's questions, 66% share, pulsed arc.

Beat classes: NEW 55%, NEEDED-DETAIL 22%, ELABORATION-USEFUL 12% (s6 b1 beam angle, s5 b2 cost), FRAME 7% (s1 b1 and b3, s4 b1 opening), RESTATE 4%.

Verdict: TIGHT. Scene 1 is mostly framing (about 50 words) but sets up cross-section and HAZ.

Short version: cut s1 b1, shorten s1 b3, remove "Controleren zonder kapot te maken" naming echo (about 35 words). 775 words, about 328 s. Restoring the inspection-example solution, ndt expansion, weldrca patterns and weld types: about 120 words, about 48 s. Taster: four defects, lack of fusion hidden inside, UT vs RT, repair rate and pareto.

Points the film lacks: about 24.

## eng.joining.production (266 s planned, not rendered, 748 words, 8 scenes)

Lessons: weldcell, fixturing, arcon, weldsystem.

Content map.
- weldcell: cell, six-axis, torch, power source, wire feeder, program s1 b1-b4; fixture, positioner, two stations, 6 + 4 = 10, 6 + 0.3, 9.5/h, 59%, caveat s2; torch cleaning, fume, light curtain s3. Not in the film: door switches, the consultant's measuring questions.
- fixturing: blind robot and plus/minus 0.6, 3-2-1 s4 b1; seam finding and tracking s4 b2-b3 (cost cycle time); tack, sequence s5 b1-b2; 2 m beam, 6 welds, 0.5 mm per weld, presetting, plus-minus 1 mm s5 b3-b4; clamping leaves stress s5 b4. Not in the film: back-step welding, presetting found by trial pieces, "is the sequence in program and WPS".
- arcon: arc-on time, operating factor, duty cycle s6 b1-b3; weld data system and improvement not for settling accounts s6 b4; kitting, positioner, drum s6 b4; a5 196 g, 2.4 min, 8.00 vs 5.14, wire 0.52, 40% = 9.00, 45% s7. Not in the film: cost formula parts stated as formula (gas, current), tack in separate fixture, overwelding, the closing question.
- weldsystem: ISO 3834 levels s8 b1; EXC mapping, CE s8 b2; notified body, FPC s8 b3; coordinator, IWE, 28 signatures s8 b4. Not in the film: scope list, ISO 14731 levels, IWT/IWS, EN 1090-2 level by class and steel, the manager's trade-off and quote, the audit questions, new audit, B level and more NDT for the EXC3 bridge.

Beat classes: NEW 60%, NEEDED-DETAIL 25%, ELABORATION-USEFUL 8%, FRAME 4% (s3 b3 pointer to other modules, s1 b1), DECOR 3% (s1 b4 "De punten leer je in met de handbediening").

Verdict: TIGHT.

Short version: cut the teach-pendant sentence in s1 b4 and the pointer in s3 b3 (about 25 words). 723 words, about 305 s by formula (the plan of 266 s is below what the current words need; planned length does not match the text). Restoring ISO 14731 levels, the arc-on cost formula, back-step welding, manager weighing: about 90 words, about 36 s. Taster: cell parts, two stations, operating factor and the robot-vs-hand cost.

Points the film lacks: about 11.

## eng.joining.spot (285 s rendered, 654 words, 8 scenes)

Lessons: spot, spotwear, spotquality, spotlobe.

Content map.
- spot: concept, force 2 to 4 kN, 8 to 12 kA, nugget 4 to 7, water s1; BIW count, thin sheet, hidden quality s2; current density 336 s3 b3; heat is current squared, 10% gives 21% s4 b1; expulsion, stuck weld s4 b2-b3; wear and 36% less after 500 spots s5 b1; dressing and stepper s5 b2-b3; "check the cutter first" s5 b4; 4 times root t in s7 b2 (via the 4.9 example). Not in the film: 200 to 400 ms, clack and sparks, speed and no skilled welder, the 4 root-t rule stated (1 mm gives 4, 2 mm gives 5.7), the zinc 200-spot rhythm, the example conclusion (nugget 5.5 to 3.8 below 4.4, two shifts to re-check).
- spotwear: counter and 100 to 300 s6 b1; 318 A/mm2 and 10.6 kA s6 b2; cap change s6 b3; imprint s6 b4; cooling s6 b5; alignment s6 b6; stepper jumps back s5 b3. Not in the film: the (D new/D old) squared rule, short stepper curve meaning, stepper masks wear, camera, filter, setter's order with force gauge, the second half of the example (250 spots 17% more, dull cutter, 14.1 kA 56% more, new cutter).
- spotquality: peel test and average of two diameters s7 b1-b2; interfacial s7 b3; chisel s7 b4; ultrasonic and sticky weld echo s7 b4; adaptive control s7 b5. Not in the film: water pad probe, trained operator, adaptive does not replace the check, the process engineer's control-plan questions, and points 2 and 3 of the example (4.8 reject, interfacial reject, quarantine, check cap/dresser/force/alignment).
- spotlobe: lobe and margin s8 b1; stack-up s8 b2; zinc 7.6 to 9.0 vs 6.9 to 9.1, 36%, 8.7 kA s8 b3-b4; multi-pulse s8 b5. Not in the film: ISO 14327/AWS D8.9, aluminium (2 to 3 times the current, 22 to 28 kA, cap alloying, rivets or glue instead), AHSS force, the manager's questions, the 1.1 kA margin sentence.

Beat classes: NEW 58%, NEEDED-DETAIL 24%, ELABORATION-USEFUL 12% (s1 b5 water, s3 b1 slow motion), FRAME 4%, RESTATE 2%.

Verdict: TIGHT.

Short version: remove "Nu vertraagd" and join s2 b1 into s1 (about 15 words). 639 words, about 272 s. Restoring aluminium (about 40 words), example points 2 and 3 (about 30), stepper rule and new cutter (about 30), root-t rule (about 20): about 120 words, about 48 s. Taster: nugget, current squared, cap wear and stepper, peel test, weld lobe.

Points the film lacks: about 20.

## eng.lines.control (327 s rendered, 728 words, 9 scenes)

Lessons: plc, safety, oee_auto, stoppages.

Content map.
- plc: eyes, brain, hands s1 b1-b3; I/O and 24 V s1 b4; scan cycle and 10 ms s2 b1-b2; ladder s2 b3-b4; HMI s3 b1; steps and interlock s3 b2; example "stap 3 wacht op klem dicht" and the diagnosis s3 b3-b4. Not in the film: analog inputs, IEC 61131-3 and structured text, "on which input did the PLC wait".
- safety: e-stop category 0/1 s4 b1; safety relay (extra) s4 b2-b3; stays pressed, reset, not instead of guarding s4 b4; PL a to e, three questions, PL d vs e s5 b2-b3; CE and 2027 regulation s5 b4. Not in the film: risk assessment and the order of measures, guard types, safety PLC, the legal "you become the maker" warning, the transitional rule.
- oee_auto: OEE formula, 58%, micro-stop s6 b2-b3; states s7 b1; hidden bottleneck s7 b2-b3; 40 stops per hour and re-check s7 b4. Not in the film: 10 to 20% of output, count stops per hour, serial availability (0.9 to the 4th = 66%), measure at the bottleneck, robot-vs-human 75 vs 80, "how many stops and how long", the example's action list (log reasons, top two, buffer).
- stoppages: alarm log s8 b1; first-out s8 b2-b3; week of alarms s8 b4; pareto twice, 400/150/150 s9 b1-b2; check first-out, door follows, servo to maintenance s9 b3; MES and daily top three s9 b4. Not in the film: fixed stop-reason list, MES pitfall (asking reasons for 20 s stops), auto-classify short stops, the manager's questions, slow-motion video, 120 per shift.

Beat classes: NEW 60%, NEEDED-DETAIL 20%, ELABORATION-USEFUL 10% (s2 b4 ladder rung, s4 b2-b3 safety relay and broken wire), FRAME 8% (s6 b1, s6 b4 hook, s8 b1), RESTATE 2%.

Verdict: TIGHT.

Short version: cut s6 b1 and s8 b1 and merge s6 b4 into s7 (about 25 words). 703 words, about 299 s. Restoring series availability, robot-vs-human, the MES pitfall and guarding: about 90 words, about 36 s. Taster: sensor-PLC-actuator, "the PLC waits", PL d, the hidden bottleneck.

Points the film lacks: about 14.

## eng.lines.design (304 s rendered, 732 words, 9 scenes)

Lessons: linebasics, layout, buffers, simulation.

Content map.
- linebasics: stations s1 b1; transport s1 b2; follow a product s1 b4; cycle time and bottleneck s3 b1-b2; takt and example 60 s, 65, 387, 33 short s3 b3-b4; manual/semi/full s2 b1-b3; guarding and stack light s2 b3-b4. Not in the film: stopwatch over ten products, rollers/pallets list, the 30/40/35 example.
- layout: paced vs free line s4 b1-b2; cell s4 b3; hard-coupled and 66% for 8 x 95% s5 b2-b3; buffer and 240/40 = 6 s5 b4; example four stations 4 min stop s5 b1. Not in the film: buffer costs space and hides problems, where to inspect (all of teach 4), final test is late, production vs improvers, the example's "fix breakdowns, check the bottleneck".
- buffers: blocked/starved s6 b2-b3; sizing s6 b1 (180/36 = 5); refill, overcapacity, 120 vs 100, 15 min, 17 min, every 10 min s7 b1-b2; WIP s7 b3; protect bottleneck s7 b4. Not in the film: "decouples", the 80 to 90% stop duration rule, 144/120 example, a second stop within refill time, bottleneck stop is lost, diminishing returns of buffer places.
- simulation: DES s8 b1; MTBF/MTTR and data origin s8 b2-b3; 112 vs 105, fixed 3 min per 2 h s8 b4; real stops 30 s to 20 min, validate s8 b5; Little s9 b1-b3. Not in the film: why averages overpromise, tool names, when to simulate, ramp-up curve and OEE, the credible questions, the "if below 105 discuss buffers before ordering" end.

Beat classes: NEW 58%, NEEDED-DETAIL 25%, ELABORATION-USEFUL 10%, FRAME 5% (s1 b1, s1 b4), RESTATE 2%.

Verdict: TIGHT.

Short version: shorten s1 b1/b4, cut s7 b3 as a stand-alone definition (about 20 words). 712 words, about 303 s. Restoring inspection location, ramp-up, the 80 to 90% rule, buffer costs: about 100 words, about 40 s. Taster: takt vs cycle, bottleneck, buffer sizing and refill.

Points the film lacks: about 16.

## eng.lines.errorproof (294 s rendered, 725 words, 9 scenes)

Lessons: errors, pokayoke, sensors, detection.

Content map.
- errors: repeated action, small chance, ppm, 200 ppm s1 b3, s2 b4; blame-free question s2 b4; mistake vs defect, Shingo s2 b2-b3; poka-yoke s3 b1; stop vs warning s3 b3; pick-to-light s3 b2. Not in the film: "use a warning only where a stop is impossible", everyday examples (plug, brake, diesel nozzle), sign option of the example.
- pokayoke: prevent (pin) and detect s3 b4, s4 b1; inductive, photoelectric s4; PLC s4 b3; interlock and eight screws s5 b1-b2; eye catches 80 to 90%, 400 ppm to 60 ppm s5 b3; false reject and bypass key s5 b4-b5. Not in the film: preference order stated, camera, "without interlock a sensor is a lamp", signs of bypass (tape, bent holder), screen showing screw order.
- sensors: start from the defect, inductive sees only steel s6 b1; capacitive s6 b2; diffuse with background suppression s6 b3; force-displacement s7 b1-b2; reference parts per failure mode s7 b3. Not in the film: aluminium range, through-beam, camera and lighting, torque-angle as joint check, positions and line-running validation, control plan, 5/5/5 and "all 10 bad parts every time".
- detection: PFMEA scoring, action priority, severity first, detection scale s8 b1-b2; escapes 1 and 150 ppm s8 b3; red rabbit s9 b1-b2; reaction plan and containment s9 b3; 480 parts s9 b4. Not in the film: AIAG-VDA vs RPN statement, safety must prevent, occurrence drops via prevention, order of preference, IATF 16949, questions, quarantine incl. warehouse/shipped and alternative check.

Beat classes: NEW 55%, NEEDED-DETAIL 24%, ELABORATION-USEFUL 10%, FRAME 8% (s1 b1-b2 description of the station), RESTATE 3%.

Verdict: TIGHT.

Short version: shrink s1 b1 and drop b2 (about 35 words). 690 words, about 294 s. Restoring sensor validation counts, containment steps, preference order, everyday examples: about 100 words, about 40 s. Taster: mistake vs defect, stop vs warning, interlock, red rabbit and 480 parts.

Points the film lacks: about 16.

## eng.lines.robots (312 s rendered, 766 words, 9 scenes)

Lessons: robotbasics, robots, robotcell, vision.

Content map.
- robotbasics: base, servo, controller s1 b1, b4; six axes s2 b1; gripper s2 b2; TCP and crash s2 b3-b4; pendant, enabling s3 b1-b2; 250 mm/s, 6 s, hours vs seconds s3 b3-b4. Not in the film: suction cups/torch as tools, ISO 10218-1, "in practice longer".
- robots: articulated reach s5 b1; SCARA s5 b2; cobot s5 b3; guarding s5 b4; payload s4. Not in the film: payload range, palletising, delta, cobot lifting 3 to 20 kg, top speed vs real cycle (0.2 to 0.5 s), standards, CE, the second half of the example (diagram, 20 kg class, real cycle 7 to 9 s vs 12).
- robotcell: machine sets pace, double gripper, 60 to 75 per hour s6 b1-b3; feed band/stopper/vibratory bowl s1 b2, s6 b4; light curtain, S = K x T + C, 428 mm s7. Not in the film: C = 8 x (d - 14) and 40 mm limit, 500 mm rule and K = 1,600 (partly), safe zones, gripper design, camera for loose parts, 25% more, "check the moves fit".
- vision: vision and bin picking s8 b1-b2; offline s8 b3; PFL s9 b1; takt 14, 12 + 4 = 16, scanner 10 s s9 b2-b4. Not in the film: 2D camera, software names, four collaborative modes (only PFL and SSM), ISO/TS 15066, when a cobot fits, the fence option and the credible questions.

Beat classes: NEW 52%, NEEDED-DETAIL 22%, ELABORATION-USEFUL 14%, FRAME/DECOR/FILLER 12% (s1 b3 "Hij zet ze op de laadtafel", s1 b5 "dag in dag uit", s1 b1 setup, s4 b1-b2 vocabulary labelled twice).

Verdict: TIGHT (the extras are a small part).

Short version: cut s1 b3, b5, merge s4 b1-b2, drop "Hier pakt hij" (about 40 words). 726 words, about 308 s. Restoring example half (real cycle), C formula, four collaborative modes, cobot fit: about 130 words, about 52 s. Taster: axes, TCP, pendant and 250 mm/s, payload and double gripper.

Points the film lacks: about 18.

## eng.lines.variants (325 s rendered, 772 words, 8 scenes)

Lessons: variants, linechange, mixed, sequencing.

Content map.
- variants: variant, mixed-model s1; batches and changeover s2 b1; example 420, 4 x 20, 340, 19%, 2 x gives 380 s2 b2, b4; batch size s2 b3; stock cost s2 b4. Not in the film: other variant costs (parts, instructions, balancing), gemba questions.
- linechange: recipe s3 b1-b2; format parts s3 b3-b4; SMED split s4 b2; 50 minutes, 35, 15, 70 s4. Not in the film: under 10 min target, "make internal external", servo axis in this context (it comes in s8 b3).
- mixed: work content s5 b1; weighted average 118 s5 b2; worst variant, 40 behind, 80 s5 b3; operator pushes on s5 b4; order rule s6 b1; floater, pre-assembly, kits/sequenced s6. Not in the film: four light variants to recover, planners vs line conflict, "balanced at which mix", "ask planning why L is released in groups".
- sequencing: heijunka s7 b1; 180/120/60 = 3:2:1 pattern ABACAB s7 b2-b3; heijunka box s7 b3; 30 minutes overtime vs 30 s s7 b4; frozen sequence and rush order s8 b1-b2; flexible automation s8 b3-b4. Not in the film: Toyota, 4:2:1 pattern of 7, software, limits (paint shop), manager questions, 420 s per round and 10 s regained per A.

Beat classes: NEW 62%, NEEDED-DETAIL 22%, ELABORATION-USEFUL 8%, FRAME 8% (s1 b1 line description, s1 b4, s7 b2 "Het voorbeeld uit de les").

Verdict: TIGHT.

Short version: shorten s1 b1, cut s1 b4 and the meta-reference in s7 b2 (about 30 words). 742 words, about 313 s. Restoring other variant costs, SMED target, planner conflict, round arithmetic: about 60 words, about 24 s. Taster: variant, changeover cost 19%, weighted average vs worst case, heijunka pattern.

Points the film lacks: about 11.

## eng.machining.cnc (244 s rendered, 553 words, 7 scenes)

Lessons: cnc, gcode, offsets, cam (about 2,005 words of lesson text in 553 words of narration).

Content map.
- cnc: CNC, spindle s1 b1; probe, G54 s1 b2-b3; tool offset s2 b1-b2; G-code, G00/G01/M03, CAM s2 b3; first-off, 10 to 20 min, 200 x 35 s3 b1-b2; proven s3 b3; example 121.43 vs 112.43, 9 mm deeper s6 b1-b2. Not in the film: spindle power, lathe X/Z and 4th/5th axis, single-block and slower rapid (named only as "regel voor regel" in s7), last-piece check, changes back to CAM, master version and crash cost EUR 5,000 to 30,000, broken drill and damaged fixture in the example.
- gcode: block and N number s4 b1; M-codes s4 b2; G90/G91 s4 b3-b4; modal s4 b5. Not in the film: F/S/T units, rapid never in material, G02/G03 and R, M05/M09/M30, ISO 6983, how an adjuster reads a new program, dangerous rapids near the part (Z2 vs Z-3), distance-to-go, and the example listing explained (N40 rapid to Z25, N60 150 mm/min, N80 quarter circle, 640 = 0.05 x 4 x 3,200) and the improvement worth 5 hours.
- offsets: three offsets (G54, G43 H, G41) s1, s5 b1-b2; 9.98 and 4.99 s5 b2; wear offset 0.005 s5 b3; crash causes, 3/2/1, "program right, table wrong" s6 b3. Not in the film: D number, G49/G40, wrong magazine pocket and incremental as causes, presetter/probe/tool setter, the question "which step would have stopped each crash", and the whole example answer (EUR 12,000 each, EUR 25,000 presetter, 5 of 6 prevented, EUR 60,000, payback 5 months, sixth crash needs a probe).
- cam: toolpath s7 b1; post s7 b2; simulation s7 b3; prove-out s7 b4. Not in the film: per-feature strategy, bad post risk, "simulation is as good as its models", whether the simulated code is post-processed, release after first-off, hours of prove-out tracked, manager levers, questions, and the whole example answer (EUR 24,750 saved, 2,625 extra, 22,125 net vs 20,000, 225 hours, ask for crash costs).

Beat classes: NEW 66%, NEEDED-DETAIL 24%, ELABORATION-USEFUL 6% (s5 b3 wear explanation), FRAME 3% (s1 b1 "Dit is een bewerkingscentrum"), FILLER 1% (s7 b4 "Bij 150 programma's telt elk uur").

Verdict: TIGHT, and the opposite problem: the film is too short for four lessons.

Short version: trim only about 17 words (s7 b4 hook, s1 b1 sentence): 536 words, about 228 s. To carry the lessons it should restore, in this priority: the offsets example answer (about 50 words), the cam example answer (about 50), the gcode improvement and line explanation (about 50), the reading method and dangerous rapids (about 40), F/S/T and M05/M09/M30 and G02/G03 (about 30): about 250 words, about 100 s, bringing it to about 330 s. Taster: zero point, offsets, a typed offset causing a crash, first-off.

Points the film lacks: about 31.

## eng.machining.drilling (233 s rendered, 563 words, 8 scenes)

Lessons: drill, holes, deephole, holequality (about 1,757 words of lesson text).

Content map.
- drill: spiral drill and wander, centre drill s1; point angle 118 s2 b1; blind hole s2 b2; 25 m/min and 995 rpm s1 b3 (formula not stated); 8 s per hole s2 b2. Not in the film: carbide drills, n = Vc x 1000/(pi D), "one speed for all drills", through holes and thread/fit holes on drawings, NC spot drill, feed 0.15 and 149 mm/min, carbide 3,980 rpm and 2 s.
- holes: H7, band 0 to +0.015, 10.000 to 10.015 s3 b2; fit and clearance s3 b3; reaming 9.8 to 10 s3 b1; core hole 6.8 s4 b1; tapping and tap breakage s4 b2; boring head Ø40 s4 b3. Not in the film: ISO 286, interference fit, go/no-go for holes, micron adjustment, four M8 holes, thread gauge, "five tools for six holes".
- deephole: L/D and 3 to 5 s5 b1; peck 54 + 30 = 84 s5 b2; through-spindle 13.5 and 196 h s5 b3; gun drill s6. Not in the film: above 10 x D, G83, 12 to 30 x D with pilot, "problem is chip evacuation" partly in s5 b1, process engineer trade-off (few parts vs series), chip bin inspection, assumed feeds, pressure/filter questions.
- holequality: position tolerance and theoretically exact s7 b1-b2; hole 3 dx 0.024, dy 0.032 gives 0.04 and 0.08 s7 b3; perpendicularity s8 b1; functional gauge s8 b2-b3. Not in the film: ISO 1101 and datums, radius-vs-diameter reporting pitfall, causes of a shifted position, warm-up drift, Cpk, questions, and the second half of the example (80% used, afternoon drift points to heat, warm-up programme, probing).

Beat classes: NEW 62%, NEEDED-DETAIL 26%, ELABORATION-USEFUL 8%, FRAME 3%, RESTATE 1%.

Verdict: TIGHT, and too short for its lessons.

Short version: trim about 10 words (s2 b1 "Die punt centreert de boor"): 553 words, about 237 s. To carry the lessons it should restore: the position example second half (about 40 words), the drill speed formula and carbide example (about 35), fits and gauge (about 35), deephole trade-offs (about 25), causes of position error (about 25): about 160 words, about 64 s, bringing it to about 300 s. Taster: wander and centre drill, H7 and reaming, L/D and chip evacuation.

Points the film lacks: about 22.

## eng.machining.measuring (308 s rendered, 690 words, 9 scenes)

Lessons: quality, metrology, capable (3 lessons, about 1,357 words of lesson text).

Content map.
- quality: Ra and ranges s2 b1; chatter s2 b2; burrs s2 b3; caliper, micrometer, ten times, calibration s3 b1-b2; go/no-go s3 b3; CMM and 20 degrees s4; thermal growth and the Ø30 h6 example s5. Not in the film: grinding Ra, Ra on drawing means extra cost, bore/air gauge, the 200 mm example, causes of drift, bad surface, position errors, out-of-round.
- metrology: uncertainty s6 b1; resolution and 10% s6 b2-b3; "1 micron shown, 5 spread" s6 b4; GRR set-up, repeatability, reproducibility s7 b1-b3; 22.5% and AIAG s7 b4. Not in the film: definition of standard deviation, ndc 5, where to look, 30% eats tolerance, last-GRR question, the example's options and the plus/minus 0.05 case (9%).
- capable: thermal growth s8 b1; Cpk 1.67, 1.0 and 1.33 s8 b2-b4; warm-up s9 b1; probing and Cpk 1.56 s9 b2-b3. Not in the film: the four effects (only thermal), tool wear, clamp distortion, stable hall, machine thermal compensation, cycle time cost of probing, questions, the "if spread were the problem probing would not help" remark.

Beat classes: NEW 62%, NEEDED-DETAIL 22%, ELABORATION-USEFUL 5%, FRAME 9% (s1 roadmap b1-b3, s7 b4 pointer to SPC), RESTATE 2%.

Verdict: TIGHT (about 11% frame and echo; below the 15% threshold).

Short version: compress s1 to one sentence, cut the SPC pointer (about 40 words). 650 words, about 278 s. Restoring error causes, clamp distortion, ndc, the example's options and the manager points: about 90 words, about 36 s. Taster: Ra, micrometer and the ten-times rule, hot-measure error, GRR 22.5%, Cpk drift.

Points the film lacks: about 14.

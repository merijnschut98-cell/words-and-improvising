# Review batch many2: length versus information (14 films, 3 or 4 lessons each)

Method note. Beat classes are shares of narration words, estimated by hand from the dossiers; they are good to about plus or minus 5 points. "Current s" is the rendered video length; where a film is not rendered yet (moulding.materials, switchgear.fiverules) I use the rubric formula (words / 2.5 + 2 s per scene) and mark it "est". Proposed s uses the same formula on the trimmed word count. Nothing was rendered or checked in the repository.

## Summary table

| film | current s | verdict | proposed s | saving % | one-line reason |
|---|---|---|---|---|---|
| eng.machining.milling | 232 | TIGHT | 232 | 0 | 564 words for 1,800 words of lesson; every beat carries a point; 14 lesson points dropped |
| eng.machining.tooling | 289 | TIGHT | 281 | 3 | Nearly all NEW/NEEDED-DETAIL; only the last-scene slogan is a restatement; 14 points dropped |
| eng.machining.turning | 227 | TIGHT | 227 | 0 | Dense and correct, but skips the whole turn-mill cost example and the Ra back-calculation; 15 points dropped |
| eng.maintenance.failure | 301 | TIGHT | 287 | 5 | Lean; small framing in scene 1 and 2; 11 points dropped (thermography, ISO limits, gearbox cost options) |
| eng.moulding.cycle | 250 | TIGHT | 232 | 7 | Scene 1 re-explains the machine (lesson 1 of the series); rest is tight; 12 points dropped incl. cooling step-down example and the cavity payback |
| eng.moulding.defects | 316 | TIGHT | 296 | 6 | Scene 1 intro and one repeated question list are the only slack; 12 points dropped |
| eng.moulding.machine | 338 | TIGHT | 323 | 4 | Dense and complete on the clamp/screw/pick-a-press chain; 8 points dropped |
| eng.moulding.materials | 310 est (planned 250) | TIGHT | 286 est | 8 | Scene 1 and scene 4 are partly frame or restate; PP GF30 answer missing; 9 points dropped |
| eng.moulding.moulds | 312 | TIGHT | 300 | 4 | Almost no slack; SMED payback and annual maintenance totals missing; 9 points dropped |
| eng.moulding.setting | 265 | TIGHT (borderline) | 241 | 9 | Scene 1 is a 34 s machine tour; process-window/tampering lesson mostly missing; 10 points dropped |
| eng.ot.isa95 | 322 | TIGHT | 302 | 6 | Dense; zones/conduits line and some framing; 5 points dropped |
| eng.quality.spc | 303 | TIGHT | 287 | 5 | Mostly NEW; restated tampering rule; 8 points dropped |
| eng.quality.tolerance | 339 | TIGHT | 321 | 5 | Mostly NEW; some filler imagery (the piles of shafts); 8 points dropped |
| eng.switchgear.fiverules | 342 est (planned 298) | TIGHT | 322 est | 6 | Rule list appears twice by design, little else; only 3 minor points dropped |

Counts: TIGHT 14, TRIMMABLE 0, PADDED 0.

Overall finding for this batch: with three or four lessons per film the narration is not padding, it is compression. No film reaches the 15 percent threshold for TRIMMABLE; the real issue is the opposite one (dropped lesson points, 3 to 15 per film). Trims of 3 to 9 percent exist but would not change the verdict.

Lesson points dropped per film: milling 14, tooling 14, turning 15, maintenance.failure 11, moulding.cycle 12, moulding.defects 12, moulding.machine 8, moulding.materials 9, moulding.moulds 9, moulding.setting 10, ot.isa95 5, quality.spc 8, quality.tolerance 8, switchgear.fiverules 3.

---

## eng.machining.milling (232 s, 564 words, 4 lessons, 7 scenes)

Content map (lesson point -> film):
- mill T1 machining centre, magazine, tool changer -> s1b1. Table, vice, spindle -> s1b2.
- mill T2 vertical, XYZ -> s1b2 (short). Horizontal machine and pallets -> NOT IN FILM.
- mill T3 face mill -> s2b1-b2; end mill -> s3b1. Tooth count versus chip room -> NOT IN FILM.
- mill T4 pocket -> s3b2; contour, inner corner radius = cutter radius -> s3b3. EDM / smaller slower cutter alternative -> NOT IN FILM.
- mill example: T1 1 min -> s2b2; T2 pocket 60x40x8 -> s3b2; T3 4 mm radius -> s3b3. T4/T5 drilling 1 min and the total 7+1 = 8 min per piece -> NOT IN FILM.
- feeds T1 n formula, Vc 150, 3,980 -> s4b1 (formula said in words). Catalogue is the real source of Vc -> NOT IN FILM.
- feeds T2 fz, vf = fz x z x n, 597 -> s4b2-b3.
- feeds T3 ap/ae, Q = 17.9 -> s4b4-b5.
- feeds T4 raising rpm without changing F rubs instead of cutting, and the catalogue question -> NOT IN FILM. Example: pocket volume 24 cm3 and 1.3 min -> NOT IN FILM.
- strategy T1 climb versus conventional -> s5 (complete incl. old machine backlash).
- strategy T2 chip thinning, 0.6 x fz, raise fz -> s6b1-b2 (and the worked answer 0.083 and 2,000 mm/min, 67 percent is stated as 1,200 -> 2,000).
- strategy T3 trochoidal 5 to 15 percent -> s6b3. Adaptive/dynamic names, long program and fast acceleration trade-off (T4) and the three strategy questions -> NOT IN FILM.
- fiveaxis T1 trunnion, five sides -> s7b1. T2 3+2, stiff -> s7b2 (the supplier benefits, shorter tools -> NOT IN FILM). T3 simultaneous, impeller -> s7b4 (cost of CAM/programmers/simulation, overkill for angled holes -> NOT IN FILM). T4 payback factors and questions -> NOT IN FILM.
- fiveaxis example: 4 -> 1 set-ups, 3 x 30 = 90 min -> s7b3. The 3 x 3 x 50 = 450 min, 9 h per run, 360 h per year, one fifth of a shift year, scrap on cross-side dimensions, utilisation -> NOT IN FILM.

Beat classes (words): NEW or NEEDED-DETAIL about 85 percent; ELABORATION-USEFUL about 8 (s1b2 vice and dimensions, s5b2 old-machine explanation); RESTATE about 2 (s4b5 repeats "compare two approaches" from the lesson, harmless); FRAME about 5 (s6b3 "Daarop draait", s1 openers); DECOR 0; FILLER 0.

Verdict: TIGHT. Nothing worth cutting; the film is at the density limit for its word budget.

Short version: no real cuts. At most trim s1b2's first sentence ("Bij frezen draait het gereedschap...") and s4b5's last clause: -15 words, about -6 s; I would not do it. 564 words, 232 s stays.
60 to 90 s taster would keep: machining centre with tool changer (s1b1), face mill then end mill with pocket and the inner corner radius, and the speed -> feed -> Q chain with the numbers 3,980 / 597 / 17.9 (s4); drop climb milling, trochoidal and five-axis.

Lesson points the film lacks (14): horizontal centre and pallets; tooth count versus chip room; EDM/smaller cutter for sharp corners; T4/T5 drilling and the 8 min total; catalogue as source of Vc; the "raise rpm, leave F" trap and the catalogue question; pocket volume 24 cm3 and 1.3 min; trochoidal trade-offs (long program, acceleration) and strategy questions; benefits of 3+2 (fewer set-ups, shorter tools); costs of simultaneous 5-axis (CAM, programmers, simulation); payback factors and questions; the 450 min re-clamping; 360 h per year answer; scrap on cross-side dimensions and utilisation question.

---

## eng.machining.tooling (289 s, 661 words, 4 lessons, 9 scenes)

Content map:
- basics T1 hot edge, HSS versus carbide (3 to 4 x faster, brittle) -> s1b3, s2b1-b2. HSS 1/4 speed, 4 x longer cut versus insert cost -> NOT IN FILM.
- basics T2 coating -> s2b3. PVD (1 to 7 um) versus CVD (5 to 20 um) -> NOT IN FILM.
- basics T3 inserts, holder, indexing -> s1b1-b3. Solid carbide tools and regrinding -> NOT IN FILM.
- basics T4 ISO code CNMG 120408 -> s3b1-b3 (complete). T5 grade and P/M/K/N/S/H -> s4 (complete, plus the P-in-stainless warning).
- basics example: 4 edges, EUR 3.50, EUR 0.05 per piece -> s3b4.
- tools T1 flank and crater wear, built-up edge -> s5b1-b2. Chipping (uitbrokkelen) -> NOT IN FILM.
- tools T2 growth, size drift, burrs, spindle load -> s5b3. Sound change, breakage consequence -> NOT IN FILM.
- tools T3 tool life limit, sister tool, EUR 12 / 4 = 3 -> s6b3 (too late versus too early -> NOT IN FILM).
- tools T4 emulsion 5 to 8 percent -> s6b1. Refractometer, too lean/rich, 70 bar -> NOT IN FILM.
- tools T5 presetting -> s6b2 (kitting and the stretch-tool-life debate -> NOT IN FILM).
- tools example: stretch to 100 pieces saves EUR 7.50 per 1,000 but risks EUR 90 -> NOT IN FILM (only 80 pieces at 3.75 cent appears in s6b3).
- toollife T1 Taylor V x T^n = C -> s7b1; n ranges for HSS/carbide -> only n = 0.25 in s7b2. T2 25 percent faster -> 0.41 -> s7b2; 20 percent slower doubles life -> NOT IN FILM. T3 VB 0.3 mm -> s7b4 (0.6 mm worst point, ISO 3685, quality as the real criterion -> NOT IN FILM). T4 counter, sister tool, monitoring -> s6b3, s7b5 (unmanned shifts and the three questions -> NOT IN FILM).
- toollife example 15 min, 30 pieces, 220 m/min -> 10.2 min, 22 pieces -> s7b3 (complete answer).
- toolcost T1 three cost parts -> s8b1. T2 economic life formula, change time + edge cost in minutes -> s8b2-b3. Lesson's own 9-minute example -> NOT IN FILM (film uses the worked example only).
- toolcost T3 levers: faster change allows faster cut, expensive tool wants slower, flat curve -> only via sister tool in s8b5; the other two parts NOT IN FILM.
- toolcost T4 standardisation -> s9b1. Example: C = 394, 14 min, 204 m/min, sister tool 8.9 min, 228 m/min -> s8b3-b5 (C = 394 itself not said).

Beat classes: NEW/NEEDED-DETAIL about 85 percent; ELABORATION-USEFUL 6; RESTATE 4 (s9b2 slogan repeats s9b1; s7b2 caption); FRAME 5 (s1b1, s6b3 opener); DECOR 0.

Verdict: TIGHT.

Short version: cut s9b2 (slogan) and the first sentence of s1b1: about -25 words, -10 s. Result 636 words, about 281 s (3 percent). Not worth distorting a film that must also carry the dropped points.
60 to 90 s taster would keep: insert in holder (s1), carbide versus HSS, the CNMG 120408 reading (s3b1-b3), and Taylor with the 25 percent / 0.41 result (s7b2).

Lesson points dropped (14): PVD versus CVD; solid carbide/regrinding; HSS cost comparison; chipping wear type; audible wear signs and the consequences of breakage; the stretch-life example (EUR 7.50 versus EUR 90); refractometer and lean/rich emulsion effects; 70 bar through-tool coolant; "20 percent slower doubles tool life"; ISO 3685 0.6 mm criterion and quality-based limit; economic-life levers (quick-change, expensive tool) and the flat curve; value C = 394 and the lesson's 9-minute example; kitting; the tool-monitoring/night-shift questions.

---

## eng.machining.turning (227 s, 550 words, 3 lessons, 8 scenes)

Content map:
- cutting T1 Vc and carbide ranges -> s1b2 (steel only; stainless, aluminium, titanium, HSS 30 -> NOT IN FILM).
- cutting T2 n formula, 1,167 rpm, small D more rpm, constant surface speed -> s2b1-b2.
- cutting T3 feed per rev -> s3b1; ap -> s3b2; milling fz and table feed formula -> NOT IN FILM; Q = Vc x ap x f -> NOT IN FILM.
- cutting T4 time per cut -> s3b3; Vc versus tool life, 20 percent halves -> s4b1; feed first -> s4b2; roughing versus finishing split -> partly s4b2.
- cutting T5 chatter sound, chip shapes 6 and 9, catalogue versus habit question -> chips s6b1; chatter/sound/question NOT IN FILM.
- cutting example: n 1,167, 350 mm/min, 34 s -> s3b3; f 0.4 -> 467, 26 s -> s4b2; 8.6 s gain x 3 cuts x 5,000 = 36 h per year -> NOT IN FILM; finishing pass stays 0.15 -> NOT IN FILM.
- finish T1 groove spacing = feed, nose radius -> s5b1-b2; Ra definition in um -> only used.
- finish T2 formula Ra = f2/(32 r) x 1000 and the 1.56 um example -> formula NOT said; square rule -> s5b2; theory versus 2x practice -> s5b3.
- finish T3 chip breaker window, finishing breakers -> s6b1-b2 partly (window and remedies NOT IN FILM).
- finish T4 slenderness, 3 x D tailstock, 6 x D steady rest -> s7 (complete).
- finish example: Ra 2.4 at f 0.25, f 0.14 gives 0.77 -> s5b3. Back-calculation f = sqrt(...), 1.8 x longer finishing, radius 1.2 / f 0.18 alternative and the chatter risk -> NOT IN FILM.
- turncell T1 turn-mill, driven tools, complete machining -> s8b1, s8b3. T2 C-axis, Y-axis -> s8b2; sub-spindle -> NOT IN FILM. T3 bar feeder -> s8b4; the three conditions for unmanned running -> NOT IN FILM. T4 when the cell wins, questions -> NOT IN FILM.
- turncell example: 4 + 3 min versus 6 min -> s8b3 only; EUR 8.67 versus EUR 12.00, break-even rate EUR 86.70 per hour, unmanned hours conclusion -> NOT IN FILM.

Beat classes: NEW/NEEDED-DETAIL about 82 percent; ELABORATION-USEFUL 8; RESTATE 3 (s4b1 caption); FRAME 7 (s1b1 scene setting, s8 "Tot slot"); DECOR 0.

Verdict: TIGHT.

Short version: no justified cuts; if forced, s1b1 first sentence and "Tot slot" (-20 words, -8 s, 0 percent verdict change). 227 s stays.
60 to 90 s taster would keep: Vc to rpm to feed rate to cut time with the 1,167 / 350 / 34 s numbers (s2-s3), and the square rule for Ra (s5b2); drop slender shafts and the turn-mill centre.

Lesson points dropped (15): speeds for stainless/aluminium/titanium/HSS; milling fz formula; Q = Vc x ap x f; chatter by sound; catalogue-versus-habit question; 36 h per year example; finishing pass stays at 0.15; Ra formula itself; back-calculated feed and 1.8 x longer finishing; 1.2 mm radius alternative and chatter caveat; chip-breaker window and remedies; sub-spindle; three conditions for unmanned running; turn-mill cost example (EUR 8.67 vs EUR 12, break-even EUR 86.70); when the cell wins and its questions.

---

## eng.maintenance.failure (301 s, 704 words, 3 lessons, 8 scenes)

Content map:
- strategies T1 corrective, 3 to 5 x cost -> s1b2 (bottleneck/lighting/small motor examples partly via s2b3).
- T2 preventive, fixed interval -> s1b3. Examples (4,000 h gearbox oil, monthly filters) and the risk of opening up -> NOT IN FILM.
- T3 condition-based -> s1b4. Monthly handheld rounds versus wireless sensors -> NOT IN FILM.
- T4 predictive -> s1b5; cost, hype warning -> NOT IN FILM.
- T5 RCM, 85 percent planned -> s2b4 (aviation origin NOT IN FILM).
- strategies example: gearbox EUR 60k, 10 weeks, condition-based -> s2b1-b2 (costs of the three options EUR 25k / EUR 3.4k / EUR 4k NOT IN FILM); conveyor motors -> s2b3.
- failure T1 bathtub, infant mortality -> s3b1-b3. T2 11/68 percent -> s3b4 (wear = abrasive/cutting/carrying -> s3b4). T3 scheduled replacement can raise failures -> s4. T4 Weibull beta -> s5b1-b2. T5 thin-data caveat (5 to 10 failures) and when each failure happened -> NOT IN FILM.
- failure example 24 servo bearings, 6 -> 9, 5 within two weeks, beta 1.0, 3 failures next year -> s4b1-b3, s5b3-b4 (complete).
- condition T1 P-F interval, half rule -> s6b1-b3. T2 five methods and weeks -> s6b4 plus s7 (hand on housing 1 week yes). 83 percent -> s6b4. T3 vibration with spectrum -> s7b2 (ISO 10816 limits 2.8 and 4.5 mm/s: only 4.5 appears in s8b2). T4 thermography load >= 40 percent, 15 deg C rule; oil analysis -> thermography s7b4 only (rules NOT IN FILM). T5 ultrasonic leak cost, who reads alarms -> ultrasound s7b1 (leak cost, question NOT IN FILM).
- condition example: 1.8, 1.9, 2.6, 3.4 mm/s, 0.8 per month, 1.4 months, order bearing -> s8 (complete).

Beat classes: NEW/NEEDED-DETAIL about 80 percent; ELABORATION-USEFUL 9 (the pump set in s1b1, Friday night in s8b4); RESTATE 3; FRAME 8 (s1b1 first lines, s2b4 partial); DECOR 0.

Verdict: TIGHT.

Short version: cut s1b1 sentences 1 and 3 ("Wanneer grijp je in?...vier strategieën"), shorten s2b4 first clause: -35 words, -14 s. 669 words, about 287 s (5 percent). Alternative: use the freed time for the missing ISO limit and 15 deg C rule.
60 to 90 s taster would keep: four strategies in one sentence each (s1), badkuipkromme with the 11/68 percent finding (s3b4), P-F interval with the half-interval rule (s6).

Lesson points dropped (11): preventive-interval examples and the risk of opening up; condition-monitoring on-floor forms (rounds, wireless); predictive hype warning and where it pays; aviation origin of RCM; cost of the three gearbox options; thin-data caveat for Weibull (5 to 10 failures); ISO 10816 limit 2.8 mm/s; thermography at >= 40 percent load and the 15 deg C rule; oil analysis seeing wear earlier on slow gearboxes; compressed-air leak cost (EUR 2,000 to 5,000); who reads the alarms question.

---

## eng.moulding.cycle (250 s, 595 words, 4 lessons, 8 scenes)

Content map:
- cycle T1 cycle phases, cooling 50 to 80 percent -> s2 (six steps, injection 1.5 s, cooling 15 s of 30).
- T2 cooling squares with thickness, boss -> s4b2 (mould temp and channels -> s4b1 channels).
- T3 output formula, cavities -> s3b2; 4-cavity 600 per hour example in the lesson -> only the 2-cavity 360 appears. Costs of more cavities, one dead cavity = 25 percent loss -> NOT IN FILM.
- T4 cycle time is a commercial number (10 percent slower) and the "which cycle" question -> NOT IN FILM.
- T5 safety seconds, hidden times (robot, hot spot) -> NOT IN FILM.
- cycle example 12 s, 3 mm to 2.4 mm, 0.64, 7.7 s, 15.7 s, 459 -> s5 (complete).
- cooling T1 ejection temperature -> s6b4. T2 temperature controller, mould temperature, PA6 80 deg C, too cold = dull -> s6a-b2 (frozen-in stress, flow lines, post-shrink detail NOT IN FILM here). T3 turbulent flow -> s6b3 (scale, delta-T check, hot spots NOT IN FILM). T4 step-down procedure and the example (11 s ok, 10 s not, 11.5 s, 21.5 s cycle, 670 per hour, +12 percent) -> NOT IN FILM.
- cavities T1 trade-off in time/cost -> s7b1 (output only). T2 fill balance, H pattern -> s7b2 (weighing per cavity NOT IN FILM). T3 hot runner and valve gate -> s7b3 (cost/time saving NOT IN FILM). T4 family mould -> s7b4 (one dead cavity of eight = 7/8 NOT IN FILM). Example: 720 vs 1,200 per hour -> s7b1; the cost comparison (EUR 166.7k vs EUR 125k, payback 17 months) -> NOT IN FILM.
- partcost T1-T4: material, machine, mould, 85 percent efficiency, 408, EUR 0.31, machine time is half -> s8 (complete numbers). Small versus large products and the mould-ownership question, scrap counted double -> NOT IN FILM.

Beat classes: NEW/NEEDED-DETAIL about 66 percent; ELABORATION-USEFUL 18 (s1b3-b5 show the mould filling and ejecting, s7b3-b4); ELABORATION-DECOR/FRAME 12 (s1b1-b2 "Hoe werkt spuitgieten?", sluiteenheid/spuiteenheid names that the film never uses again); RESTATE 4 (s2b1 recaps the six steps that s1 just walked through).

Verdict: TIGHT (about 11 percent cuttable, under the 15 percent threshold).

Short version: cut s1b1, s1b2 and merge s1b3-b5 into one beat; cut half of s2b1: about -45 words, -18 s (scene 1 stays at 3 beats). 550 words, about 232 s (7 percent). Better: reuse the saved 18 s for the missing cooling step-down result (11.5 s, 670 per hour), which is the lesson's actual payoff.
60 to 90 s taster would keep: cycle phases with cooling as half (s2), thickness squared with the 3 to 2.4 mm example (s5), and output per hour (s3b2).

Lesson points dropped (12): step-down cooling-time method and its example; safety seconds that nobody removes; hidden times (robot, open stroke, hot spot); cycle time as price basis and the "which cycle" question; one dead cavity = minus 25 percent; costs of more cavities (bigger mould, bigger press); the A/B cavity cost and payback; weighing per cavity for balance; effects of a too cold mould (stress, post-shrink); scale in channels and the delta-T check; large products where material dominates; scrap counts double.

---

## eng.moulding.defects (316 s, 752 words, 4 lessons, 9 scenes)

Content map:
- defects T1 short shot, vents -> s2b1-b2, s1b3. T2 flash -> s3b1 (vents-versus-flash balance NOT IN FILM). T3 sink and voids -> s4b1-b2. T4 warpage, 24 h -> s5. T5 burn marks, weld line -> s2b3, s4b3. Silver streaks (not in lesson) -> s4b4 (ELABORATION-USEFUL).
- defects example: crate flash 180 -> 220 t, worn parting line -> s3b2-b3 (complete).
- diagnose T1 four questions and what each points to -> s6b1 (cavity, shot, "sinds wanneer" and logbook partly NOT IN FILM). T2 fill study 50/70/90/95 -> s6b3. T3 jetting -> s6b4; sink far from gate / burn at end as shape clues -> NOT IN FILM. T4 change one thing, wait 10 shots / 20 to 30 min -> s7b1. T5 boundary sample -> s7b2.
- diagnose example: 1 in 20, cavity 2, 1.25 percent -> s6b2. The diagnosis (hot-runner thermocouple loose, night shift raised pressure 10 percent giving flash in cavity 1, fix) -> NOT IN FILM.
- warpage T1 three sources, 10 deg C, fibres -> s8b1 (complete). T2 corner effect -> s8b3 (fixes: core cooling, open the corner -> NOT IN FILM). T3 processing shrink, post-shrink, conditioning 23 deg C / 50 percent -> s8b4 (post-shrink NOT IN FILM). T4 process lever versus steel change, measuring fixture, steel-safe -> only "corrigeer dan een keer het staal" in s8b4. Example: 0.3/0.7, 201.0 -> 200.4 -> s8b2; width 99.8 and the per-direction steel 200.6 / 100.7 -> NOT IN FILM.
- defectdata T1 three parts of a lasting fix -> s9b1. T2 DOE definition, main effects, interaction -> s9b2-b3 (2 x 2 x 2 = 8 runs NOT IN FILM). T3 cavity-pressure sensor -> s9b4 (machine signals are blind to leaking check ring NOT IN FILM). T4 process monitoring -> s9b5. T5 investment logic and questions -> NOT IN FILM.
- defectdata example: 40/30/24/10 um, -12 and -18, interaction -> s9b2-b3 (complete).

Beat classes: NEW/NEEDED-DETAIL about 77 percent; ELABORATION-USEFUL 9; RESTATE 4 (s5b3 repeats the same three questions that s6b1 opens with); FRAME 8 (s1b4, s1b1); DECOR 2.

Verdict: TIGHT.

Short version: cut s5b3 (duplicate of s6b1), shorten s1b1 and s1b4: -50 words, -20 s. 702 words, about 296 s (6 percent). Better to use the freed time for the diagnose example's resolution (thermocouple, night shift) which is the whole point of the four questions.
60 to 90 s taster would keep: short shot and flash as opposites with the crate example, sink mark skin/core mechanism, and the four diagnostic questions.

Lesson points dropped (12): vent depth versus flash balance (mould maker); diagnose example resolution (loose thermocouple, night-shift pressure +10 percent causing flash); logbook "sinds wanneer"; sink and burn location as clues; core cooling/open corner fixes for the corner effect; post-shrink; per-direction steel dimensions (99.8 mm, 200.6 / 100.7); process lever versus steel change and steel-safe; DOE size 2 x 2 x 2 = 8; interaction meaning; machine signals versus cavity pressure; investment/when it pays and its questions.

---

## eng.moulding.machine (338 s, 760 words, 4 lessons, 8 scenes)

Content map:
- machine T1 injection unit, hopper, screw -> s1b1-b2. T2 clamp unit, tie bars, press noise -> s1b3 (noise NOT IN FILM). T3 six steps -> s2 (complete). T4 clamp force, bar to tonne, 0.3 to 0.6 -> s3 (bar to tonne partial). T5 two lists, one-press-only bottleneck, release question -> NOT IN FILM.
- machine example: 300 cm2, 0.4, 120 t, 2 cavities 240 t, 280/300 t press not 200 t -> s3b2-b4 (complete).
- screw T1 L/D 20, three zones -> s4b1-b3. T2 friction heat -> s4b4; dosing stroke -> s5b1; back pressure -> NOT IN FILM. T3 check ring, cushion, recovery-limited -> check ring s4b3 (cushion variation NOT IN FILM), "dosing longer than cooling" -> s5b1. T4 residence time -> s5b2; degradation signs, purging -> s5b3 (black specks only).
- screw example: 600 / 150 = 4 shots, 120 s; 60 g: 300 s; 4 min limit -> s5b2-b3 (complete).
- clamp T1 four checks, cavity pressure 300 to 600 bar, glass-filled 0.65 -> s6b1 (0.65 NOT IN FILM). T2 shot volume, utilisation 20 to 80 / 40 to 60 -> s6b2-b3 (why: degradation below 20 percent -> partly). T3 mould height, tie-bar spacing, stroke 2 x depth -> s6b4-b5. T4 bigger is not safer; plus 10 to 20 percent -> s6b5 (vent squeeze) and s3b3; energy/hourly rate NOT IN FILM.
- clamp example: 380 cm2, 171 t, 197, 83 versus 40 percent, press B -> s6b1-b3 (the final choice of B is implied, not said).
- electric T1 hydraulic, electric, hybrid -> s7. T2 kWh per kg figures, servo pumps -> s7b4 (the 0.6 / 0.16 study NOT IN FILM, uses 0.6 versus 0.3). T3 2K and overmoulding -> s8. T4 investment weighing, questions -> NOT IN FILM.
- electric example: 54,000 kWh, EUR 10,800, 3.7 years -> s7b4 (complete in one sentence).

Beat classes: NEW/NEEDED-DETAIL about 85 percent; ELABORATION-USEFUL 6; RESTATE 3; FRAME 6 (s1b1, s6 "Kies de pers met vier checks"); DECOR 0.

Verdict: TIGHT.

Short version: shorten s1b1 and s3b4's last clause: -35 words, -15 s. 725 words, about 323 s (4 percent).
60 to 90 s taster would keep: press = injection unit plus clamp, six-step shot (s2), clamp force = area x 0.4 for 300 cm2 (s3).

Lesson points dropped (8): press noise hydraulic versus electric; two-list planning and the one-press-only bottleneck; back pressure; cushion variation as symptom of a worn check ring; purge/stop handling; 0.65 t/cm2 for glass-filled PA; costs and energy of an oversized press; investment weighing and the three questions.

---

## eng.moulding.materials (planned 250 s, not rendered; formula estimate 310 s; 731 words, 4 lessons, 9 scenes)

Content map:
- materials T1 thermoplastics and four resins -> s1b2-b3. T2 amorphous versus semi-crystalline shrink -> s4. T3 hygroscopic, drying 2 to 4 h, dew point -40 -> s2b1-b3; splay -> s3b1. T4 regrind 10 to 25 percent -> s3b2 (mixing-ratio risk NOT IN FILM). T5 masterbatch, flushing, light-to-dark -> s3b3-b4 (supplier-change trial NOT IN FILM).
- materials example: 12 x 4 = 48 kg, 20 kg wet, 1.7 h -> s2b4-b5 (complete).
- polymers T1 glass transition, PC 145 -> s5a-b2 (PMMA NOT IN FILM). T2 melting point, PA6 220, crystallinity -> s5b3-b4. T3 post-shrink, stress cracking -> s6b3-b4. T4 cavity = product x (1 + shrink), ABS in PP mould -> s6b1-b2. Example: 101.5, 101.0 -> s6b1-b2 (the +/-0.2 mm tolerance conclusion NOT IN FILM, "te lang" only).
- drying T1 limits PC 0.02, PET 0.005 -> s7b1. T2 hydrolysis, overdrying PA yellow, 80 deg C -> s7b2-b3. T3 moisture meter, Karl Fischer -> s8b1, b3 (four checks: only desiccant/dew point and "check also" in s8b4). T4 typical drying faults (hopper half empty, filter, rewetting in the line) and stop rule -> only desiccant saturation s8b4. Example: 0.03 percent > 0.02 -> s8b2.
- fillers T1 glass fibre abrasion -> s9b1 (talc/mineral NOT IN FILM). T2 orientation 0.3/0.7, gate position -> s9b2-b3 (fill simulation NOT IN FILM). T3 recyclate, MFI -> s9b4. T4 per piece not per kg -> s9b5 (stiffness, supply security questions NOT IN FILM). Example: PA66 GF30 EUR 0.272 -> s9b5; PP GF30 EUR 0.123 and the pre-switch checks (stiffness/creep at temperature, warp, cavity size, customer release) -> NOT IN FILM (the question of the worked example is left unanswered).

Beat classes: NEW/NEEDED-DETAIL about 80 percent; ELABORATION-USEFUL 8; RESTATE 4 (s4 is a one-line preview of what s5-s6 teach again); FRAME 8 (s1b1, s1b4, s9b5 opener).

Verdict: TIGHT.

Short version: cut s1b1 and s1b4 (frame), merge s4b1-b2 into s6 (shrink figures are restated there): about -60 words, -24 s: 671 words, 286 s est (8 percent). Use the saved time to finish the example in s9b5 (PP GF30 EUR 0.123 and the stiffness/creep check).
60 to 90 s taster would keep: thermoplastic plus the four resins, hygroscopic drying with the 48 kg / 20 kg example (s2), shrink and the 101.5 mm cavity (s6b1-b2).

Lesson points dropped (9): PMMA and POM as amorphous/semi-crystalline examples; the tolerance conclusion for ABS in a PP mould; regrind mixing risk; supplier change needs trial/release; hydrolysis versus PA effects in detail; the four dryer checks and typical drying faults (hopper half empty, filter, rewetting); talc/mineral fillers; fill simulation for fibre orientation; the PP GF30 answer and its pre-switch checks.

---

## eng.moulding.moulds (312 s, 722 words, 4 lessons, 8 scenes)

Content map:
- tooling T1 mould description, EUR 20k and EUR 100k to 300k, lead time 10 to 16 weeks, T1 -> s1b5 (EUR 20k only), s3b1. T2 cold versus hot runner -> s2 (complete). T3 preventive 50 to 100k shots, shot counter -> s3b2-b3 (life of one million shots NOT IN FILM). T4 change 1 to 2 h, SMED 15 to 30 min -> s3b4. T5 ownership, who pays a worn parting line, logbook -> logbook only s6b3; ownership NOT IN FILM.
- tooling example: 40 x 90 -> 30 min, 40 h, EUR 2,400 per week -> s3b5. EUR 110k per year, investment EUR 55k, 23 weeks payback -> NOT IN FILM.
- mouldparts T1 halves, sprue, runners, gate -> s1b1-b3. T2 edge versus tunnel gate; cooling in a tall core; vents -> s4b1-b2, s4b4, s1b4. T3 ejector marks, draft 1 degree -> s5b1-b2 (plate ejection for large thin parts NOT IN FILM). T4 undercut, slide -> s5b3-b4 (cost question "can the designer avoid it" is in "kost geld en slijt").
- mouldparts example: 42 g, 14 percent, regrind 15 percent -> s4b3. Hot-runner question for the 6 g -> NOT IN FILM.
- mouldcare T1 two levels of checks, calendar -> s6b1 (calendar yes; the two levels NOT IN FILM). T2 wear parts, logbook, 30,000 shot pattern -> s6b2-b3. T3 last-shot sample -> s6b4 (storage NOT IN FILM). T4 SMED internal/external -> s7 (complete).
- mouldcare example: 36,000 shots per week, 2.8 weeks -> s6b1. Annual 1.656 million shots, 16 to 17 services, about 130 h -> NOT IN FILM.
- newmould T1 steps, 10 to 16 weeks -> s3b1 (the early-weeks cost rule NOT IN FILM). T2 DFM, ribs 40 to 60 percent, fill simulation -> s8b1-b2. T3 SPI classes -> s8b3 (101 and 103 only). T4 T0/T1, PPAP 300 pieces -> s8b4-b5 (document set NOT IN FILM). T5 managers' questions -> NOT IN FILM.
- newmould example: 103 twice = EUR 90k, six cents versus five cents -> s8b3 (complete in spirit; EUR 15k saving and the second T1/PPAP risk NOT IN FILM).

Beat classes: NEW/NEEDED-DETAIL about 84 percent; ELABORATION-USEFUL 7; RESTATE 3; FRAME 6 (s1b1, s7b3 "Meer in de module"); DECOR 0.

Verdict: TIGHT.

Short version: cut s7b3's last sentence, s1b1's "opengezaagd" intro and the vent depth numbers in s1b4 (the lesson does not need them here): -30 words, -12 s. 692 words, about 300 s (4 percent).
60 to 90 s taster would keep: sprue/runner/gate path (s1), hot versus cold runner (s2), and the SMED saving 40 x 60 min = EUR 2,400 per week (s3b5).

Lesson points dropped (9): price range EUR 100k to 300k and one-million-shot life; who owns and who pays for wear; SMED payback (EUR 55k, 23 weeks, EUR 110k per year); plate ejection for large thin parts; two maintenance levels; storage (blown-out channels, rust); annual maintenance count and hours (about 130 h); hot-runner question for the 6 g; PPAP document set, SPI 102/104/105 and managers' questions.

---

## eng.moulding.setting (265 s, 621 words, 4 lessons, 9 scenes)

Content map:
- setup T1 five settings, setter, setting sheet -> s2b1. T2 melt and mould temperature -> s2b2 (mould 20 to 80, "too hot breaks down" partly). T3 speed, switchover 95 to 98 percent -> s3, s4. T4 hold and cooling -> s5. T5 typical faults per setting (late switchover = flash; short hold = sink; short cooling = warp) -> only flash in s4b2.
- setup example: 60 - 12 = 48 mm, 0.6 s, 18.6 s -> s3b3, s5b3 (complete).
- process T1 back pressure -> s6b1. T2 process window, centre not edge -> s7b1. T3 scientific moulding -> s7b2 caption only. T4 "even bijdraaien" risk, three versions of settings -> NOT IN FILM. T5 change log, "wat is er veranderd?", check ring / cushion -> s6b2-b3 (log NOT IN FILM).
- process example: PC lens 3 percent scrap, 14 changes, restore, cushion 2 to 8 mm, EUR 300 part, 0.4 percent -> s6b3 gives the cushion; the 14 changes, the scrap numbers and the EUR 300 -> NOT IN FILM.
- scientific T1 three studies, reason on paper -> s8 (reason on paper NOT IN FILM). T2 viscosity curve formula (peak x ratio x time) -> NOT IN FILM; the result 31 / 6 percent -> s8b1; ratio about 10 -> s8b2. T3 pressure drop, 80 percent rule -> s8b3-b4 (Kulkarni NOT IN FILM). T4 gate freeze -> s8b5-b6 (stepwise one-second procedure partly).
- scientific example: 1,280 / 880 / 825 bar.s, chosen 100 mm/s -> NOT IN FILM (only the percentages); 75 percent -> s8b3-b4.
- validation T1 validation definition, medical, GHTF -> s9b1 (why/when required NOT IN FILM). T2 IQ OQ PQ -> s9b1 (PQ three runs NOT IN FILM). T3 part weight, control chart, Cpk 1.33 -> s9b2 (Cpk NOT IN FILM). Cavity-pressure monitoring -> NOT IN FILM. T4 revalidation triggers -> s9b3 (one trigger each).
- validation example: limits 4.802 to 4.838 -> s9b2; Cpk 2.2 and OQ margin -> NOT IN FILM.

Beat classes: NEW/NEEDED-DETAIL about 66 percent; ELABORATION-USEFUL 14 (s3b2 flow front and skin, s5b2); ELABORATION-DECOR/FRAME 17 (s1 = 34 s tour of the machine, 90 words: b1, b2, b5 are scenery; s7b2 "Scientific moulding stelt ... in"); RESTATE 3.

Verdict: TIGHT, borderline: about 14 percent of narration (s1b1, b2, b5, s7b2 frame, s3b2) is decor or frame, just under the 15 percent line, and the film still drops 10 lesson points, so shortening the film would make that worse.

Short version: cut s1b1, s1b2, s1b5 (keep b3-b4 as one beat), s7b2: about -75 words, -24 s: 546 words, about 241 s (9 percent). Spend the saved time on the process-window "even bijdraaien" lesson and the 14-changes/EUR 300 check-ring story.
60 to 90 s taster would keep: setting sheet and the five settings, the 60 - 12 = 48 mm, 0.6 s and 18.6 s cycle (s3-s5), and the process window.

Lesson points dropped (10): consequences of late switchover / short hold / short cooling as a table; mould temperature range and too-hot effects; "even bijdraaien" interactions and the log; the PC lens case (14 changes, 3 to 0.4 percent, EUR 300); relative-viscosity formula and the raw numbers 1,280 / 880 / 825; reason-on-paper rule; the one-second gate-freeze procedure; PQ with three runs and the Cpk 2.2 margin; cavity-pressure sensor in monitoring; revalidation triggers and GHTF.

---

## eng.ot.isa95 (322 s, 765 words, 3 lessons, 9 scenes)

Content map:
- levels T1 ISA-95 / IEC 62264, year 2000, one language -> s1. T2 levels 0 to 2, PLC on level 1 or 2, SCADA -> s2 (complete). T3 level 3 MES, level 4 ERP, boundary -> s3. T4 timescale, outage test -> s4b1-b3. T5 what you see on the floor, OEE-from-SAP mistake, question -> s4b4 (floor sightings NOT IN FILM).
- levels example: temperature sensor L1, PLC/SCADA L2, MES L3, ERP L4, quality system L3 -> s2b2, s2b3-b4, s3b1-b3 (the final timescale check step 6 NOT IN FILM, but the timescales are given in s4).
- systems T1 five system types, HMI -> s6b3-b4 and s5/s7 (HMI s6b4). T2 production order, BOM, routing -> s5 (complete). T3 master data, 10 versus 12 s -> s6b1-b2. T4 who stores what -> s7b3 (SCADA/historian store NOT IN FILM, historian mentioned in s7b1). T5 SAP versus machine, question -> s7b4, s6b2.
- systems example: 50 kg, Tuesday early shift, HMI, PLC loads, 1,960 / 40 -> s5b2, s6b3-b4, s7b2 (complete).
- purdue T1 Purdue origin -> s8b1 (Williams NOT IN FILM). T2 functional model, information flow -> s8b2-b3. T3 six layers, DMZ 3.5 -> s8b4, s9b1. T4 "niveau 3" confusion -> s9b2. T5 experts, question -> s9b3, s9b5.
- purdue example: cloud MES, steps 1 to 5 -> s9b3-b5 (steps 4 and 5 complete).

Beat classes: NEW/NEEDED-DETAIL about 83 percent; ELABORATION-USEFUL 6; RESTATE 2 (s7b4 repeats s6b2 idea); FRAME 5 (s1b1 first sentence, s8b3 "Zo'n vaste uitwisseling"); DECOR 4 (s9b5 IEC 62443 zones and conduits, not in the lesson).

Verdict: TIGHT.

Short version: cut s9b5 first sentence (zones/conduits), s1b1 second sentence, s8b3 merged into b2: about -50 words, -20 s. 715 words, about 302 s (6 percent).
60 to 90 s taster would keep: five levels one line each (s2-s3), timescale plus outage test (s4), one order flowing ERP -> MES -> PLC -> back (s5-s7).

Lesson points dropped (5): Williams/Purdue University origin; floor sightings per level; the final timescale check in the six-system example; SCADA/historian as store of time series; the lesson's PLC-on-level-1 variants beyond one sentence (kept) is fine; the floor-level typical-error list for purdue (mixed drawing, one flat network) only partly (s9b5).

---

## eng.quality.spc (303 s, 720 words, 3 lessons, 9 scenes)

Content map:
- spc T1 SPC, control chart, Shewhart -> s1b1, s1b4 (Shewhart NOT IN FILM). T2 X-bar/R, subgroup, limits -> s2 (complete). T3 spec versus control limits; the two cases (in limits but out of spec; out of limits but in spec) -> s2b4 (both cases NOT IN FILM). T4 rules -> s3b3-b4 (complete). T5 reaction plan -> s4b1, b4.
- spc example: 19.9885 to 20.0115, seven rising, tool changed 16:10 -> s2b3, s3, s4b2 (complete).
- tampering T1 definition, zigzag -> s5. T2 funnel +41 percent, variance doubles -> s6b3-b4 (Nelson; "other rules worse" NOT IN FILM). T3 only on signal, wear compensation -> s7b1-b2 (second form "average passes a line" NOT IN FILM). T4 reaction plan contents, suspect parts -> s4b3 (stop? checks, who to call, record NOT IN FILM). T5 CNC feedback filter -> s7b4 (the auditing question NOT IN FILM).
- tampering example: 30 percent expected drop, 29 -> s7b3 (complete).
- charts T1 X-bar/R versus X-bar/S versus I-MR -> NOT IN FILM. T2 p, np, c, u -> s8b1-b3. T3 p-chart limits formula, 1 percent / 50 / 5.2 -> s8b4 (formula NOT IN FILM). T4 rational subgroup -> s9b3 (4 cavities / 2 spindles -> s9). T5 20 to 25 subgroups, freeze limits -> s9b4 (recalculate only after known change, weekly recalculation trap NOT IN FILM).
- charts example: 4-cavity -> s9b1-b3 (complete).

Beat classes: NEW/NEEDED-DETAIL about 82 percent; ELABORATION-USEFUL 8 (s6b2, s8b4 numbers); RESTATE 5 (s7b1 repeats the tampering rule given in s5b2-b3, s4b4 repeats "behang"); FRAME 5 (s1b1, s9b1 "Tot slot").

Verdict: TIGHT.

Short version: cut s7b1 second half, s4b4 first clause, s1b1 sentence 1, s9b1 "Tot slot": about -40 words, -16 s. 680 words, about 287 s (5 percent).
60 to 90 s taster would keep: X-bar/R chart with limits from the process (s2b1-b3), the seven-rising trend rule (s3b3) and the response (s4).

Lesson points dropped (8): Shewhart origin; within-limits-but-out-of-spec and the reverse; X-bar/S and I-MR chart choices; the p-chart limit formula; the reaction plan's items (stop, checks, who, record); funnel "worse rules"; the second compensation form (move when the 5-piece average crosses a line) and the CNC-feedback audit question; the recalculation-only-after-known-change rule.

---

## eng.quality.tolerance (339 s, 689 words, 3 lessons, 9 scenes)

Content map:
- tolerance T1 nominal, LSL/USL -> s1 (LSL/USL names NOT IN FILM, but the limits are). T2 unequal tolerance -> s1b4 (micron, hair comparison NOT IN FILM). T3 general tolerance ISO 2768-m -> s2a-b2. T4 tighter costs more, bearing seat -> s2b3-b4. T5 nonconforming, deviation, 1-10-100, recall -> s3b2-b4 ("tien keer"; 1-10-100 and recall NOT IN FILM).
- tolerance example: 15 of 500, EUR 67.50 versus EUR 400 + EUR 250 + 8D -> s3b1, b4 (supplier rating NOT IN FILM).
- variation T1 mean, sigma -> s4b2-b3. T2 68/95/99.7, 19.979 to 20.027 -> s4b4. T3 common cause, system change, management -> s5b1-b2 (management decision NOT IN FILM). T4 special cause (jump, trend, outlier), Deming 90 percent -> s5b3 (types and Deming NOT IN FILM). T5 tampering +40 percent -> s6. 
- variation example: Thursday 25 pieces, Monday jump, 20-minute warm-up -> s4b2-b4 (Thursday data) and s5b3-b4 (complete).
- capability T1 Cp = tolerance / 6 sigma -> s7b3; own example uses 1.67 (not the lesson's 1.33). T2 Cpk and the shifted example (0.67, never above Cp) -> s8b1; shifted example, "never higher than Cp" NOT IN FILM. T3 goals 1.33 / 63 ppm, 1.67, 1.0 = 2,700 ppm -> s8b4 (1.67 and above/below 1.0 NOT IN FILM). T4 Cp/Cpk versus Ppk -> s9b1-b3. T5 Cp high Cpk low = centre, both low = money; 50/100 parts -> s8b3 (centre), s9b4 (both-low rule NOT IN FILM).
- capability example: 1.67, 1.17, offset -0.006, 1.67 -> s7b2-b3, s8b2-b3 (complete).

Beat classes: NEW/NEEDED-DETAIL about 79 percent; ELABORATION-USEFUL 8; RESTATE 4 (s6b2 repeats the "second noise" idea; s7b1); FRAME 5 (s1b1 definition of Ø, s9b1 setup); DECOR 4 (s4b1 stack of shafts, s6b3 "wider piles" narration).

Verdict: TIGHT.

Short version: cut s4b1 and the "stapels" clause in s6b3, tighten s6b2, s9b1: about -45 words, -18 s: 644 words, about 321 s (5 percent). The film runs 339 s rendered for 689 words (about 38 s above the word formula): the cause is scene duration, not extra beats, so an equal-pace render would also save time without any content cut.
60 to 90 s taster would keep: nominal and spec limits (s1b1-b3), mean and sigma with 3 sigma (s4b2-b4), and Cp versus Cpk with the 1.17 to 1.67 centring win (s7-s8).

Lesson points dropped (8): human hair comparison; 1-10-100 rule and recall; supplier rating consequence; special causes as jump/trend/outlier and Deming's 90 percent; "system change is a management decision"; Cpk 0.67 shifted example and "Cpk never above Cp"; 1.67 target and the below-1.0 consequence; "both low means invest" rule.

---

## eng.switchgear.fiverules (planned 298 s, not rendered; formula estimate 342 s; 809 words, 3 lessons, 9 scenes)

Content map:
- safety T1 five rules in order -> s1b3, s4-s6. T2 each rule covers a real error; earthing only after measuring -> s1b4, s4b2, s5b4, s6b3. T3 NEN 3140 / 3840 limits, BEI, IV, WV -> s2b1-b3. T4 VP, VOP, lay, appointment -> s2b4-b5. T5 floor sightings and typical errors, VOP debate, question -> s7b3-b4 (the discussion of how often appointments are reassessed: "om de paar jaar" yes).
- safety example: cable between station 8 and 9, five rules, spiking -> s1, s4-s7 (complete).
- switching T1 switching plan, load-break switch versus disconnector -> s3b1-b3. T2 five rules, earthing logic -> s6b1-b3. T3 NEN 3140/3840, IV/WV -> s2. T4 approval chain, reporting -> s3b4, s8b1 (complete). T5 bottleneck, solutions, question -> s8b2, b5 (complete).
- switching example: 576 versus 1,400, 2.4 x -> s8b3-b5 (complete).
- nen3140 T1 invisible, Arbobesluit -> s1b2, s2b2. T2 roles -> s2b3-b4. T3 appointment, ask IV/WV -> s2b5, s9b4. T4 consultant is a layperson, arc flash, circuit-breaker rule -> s9 (complete). T5 floor sightings, typical errors, question -> s7b3-b4, s9b4.
- nen3140 example: consultant at the substation -> s9 (complete).

Beat classes: NEW/NEEDED-DETAIL about 80 percent; ELABORATION-USEFUL 8; RESTATE 7 (the five rules are listed in s1b3 and walked in s4-s6; s5b4 re-lists the faults s4b2 mentioned; s9b4 repeats the "wie is IV" question); FRAME 5 (s1b1 narrative opening, s8b1 "Terug gaat..." closing).

Verdict: TIGHT. The repetition of the five rules is the lesson's own structure (it appears in all three lessons), and an overview followed by a step-by-step walk works for a safety subject.

Short version: cut the listing in s1b3 down to "de vijf veiligheidsregels, altijd in deze volgorde" (the walk-through names them anyway), trim s7b4 and s8b1: about -50 words, -20 s. 759 words, about 322 s est (6 percent). Note the film is the longest in the batch by formula; its 3 lessons contain the most repeated material, so it is also the one where a 60 to 90 s version loses least.
60 to 90 s taster would keep: the five rules in order with one line each, IV/WV/VP/VOP/lay in one scene, and the consultant's "touch nothing" rule; drop the capacity example.

Lesson points dropped (3, all minor): the VOP-scope debate beyond one clause; the reverse order on switching back (only "grofweg omgekeerd"); the exact IV/WV duties of the sector rules (BEI split LS/HS).

---

## Where I am least sure of my verdict

1. eng.moulding.setting. Scene 1 (34 s) is machine background; I counted b1, b2 and b5 as decor/frame, which puts the film at about 14 percent, one point under TRIMMABLE. A stricter reading, or counting the viscosity and pressure-drop numbers as partly redundant with the captions, could tip it to TRIMMABLE. But it would then cut a film that already misses 10 lesson points.
2. eng.moulding.cycle. Scene 1 (30 s, five beats) re-teaches the machine cycle that has its own film; I classed it ELABORATION-USEFUL plus FRAME at about 11 to 12 percent. If the learner has the machine film first, the whole scene is RESTATE and the film would be TRIMMABLE (about 18 percent).
3. eng.switchgear.fiverules and eng.moulding.materials (not rendered). Their current lengths are formula estimates, not measured; the verdict rests on beats, but the saving percentages are less certain. For fiverules the double listing of the five rules (s1b3 and s4-s6) is either deliberate teaching structure (TIGHT) or about 7 percent restate; it does not change the verdict.

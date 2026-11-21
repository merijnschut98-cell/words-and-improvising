# Review batch pm1 (11 films): length versus information

Method note. I read each dossier on its own and judged from the voice and caption text only; I could not see the rendered visuals, so a number that appears only in a figure is not counted. "Current s" is the rendered nl video length. "Proposed s" is the rendered length scaled by the formula ratio (2.5 words per second plus 2 s per scene, proposed words against current words); the raw formula figures are given in each film section. Beat-class percentages are by narration words and are estimates (+/- 3 points). Where a beat only restates a fact that the lesson text itself contains (a named origin, a year, a book), I counted it as NEW, because it carries a lesson point; I list those separately as "provenance-only" so you can see the extra trim reserve if the lesson text were edited too.

Overall finding. The length of these films follows the content, not the ceiling, with one important qualification. The three single-lesson films (incident 452 words, postmortem 550, close.results 588) are well under the 760 ceiling and track their lesson text almost one to one. The multi-lesson films (3 or 2 lessons, 897 to 1,561 words of lesson text) sit at 746 to 770 words because the ceiling binds, but they are not padded: they compress 2 to 3 lessons into the ceiling, nearly every beat carries a lesson point or a step of the example, and some points are dropped (listed per film). For these, the problem is not length padding but, if anything, a ceiling that is slightly too low for the lesson volume.

## Summary table

| film | current s | verdict | proposed s | saving % | one-line reason |
|---|---|---|---|---|---|
| pm.agile.backlog | 336 | TIGHT | 326 | 3 | 3 lessons squeezed into 740 words; nearly every beat is a point or an example step |
| pm.agile.forecast | 313 | TIGHT | 303 | 3 | 2 lessons, dense; only one bridging line is fat; example data not on the voice |
| pm.agile.kanban | 343 | TIGHT | 330 | 4 | 3 lessons, all points present; two small restatements |
| pm.agile.scrum | 333 | TIGHT | 325 | 3 | 3 lessons, compact; example loses some numbers instead of having padding |
| pm.close.results | 246 | TIGHT | 239 | 3 | single lesson, film about as long as lesson text; two frame phrases |
| pm.consult.proposal | 335 | TIGHT | 327 | 2 | 2 lessons, 1,276 words of text in 752 words; almost no repetition |
| pm.devops.incident | 192 | TIGHT (borderline) | 184 | 4 | short, tracks lesson; Lean-blik scene partly restates the definitions already given |
| pm.devops.pipeline | 330 | TIGHT | 314 | 5 | 2 lessons; some provenance (names, years) is the only slack |
| pm.devops.postmortem | 230 | TIGHT | 216 | 6 | example is completed beyond the lesson, which is useful; only two provenance beats are fat |
| pm.intake.firsttalk | 337 | TIGHT | 326 | 3 | 3 lessons (1,561 words) in 761 words; drops a number of lesson points rather than padding |
| pm.intake.stakeholders | 334 | TIGHT | 324 | 3 | 3 lessons (1,481 words) in 760 words; drops points, repeats only the map idea |

Counts: TIGHT 11, TRIMMABLE 0, PADDED 0.

Honest caveat on the verdict spread. Eleven out of eleven TIGHT is a strong result and I looked for reasons to downgrade. The nearest to the 15 percent line is pm.devops.incident (about 12 to 17 percent depending on whether its provenance beat and the Lean-blik restatement are counted). The savings above are small by design: I only cut beats that are RESTATE or FRAME, or provenance-only and not needed to use the point. Nothing in this batch would lose 15 percent or more without dropping a lesson point.

---

## pm.agile.backlog (336 s, 740 words, 9 scenes, 3 lessons)

Content map (lesson: point -> where)
- stories: template Connextra "Als/wil/zodat" -> s1 b2; example sentence (operator lijn 3) -> s1 b3; zodat is the key -> s1 b4; three C's (Jeffries 2001; Card, Conversation, Confirmation; belofte geen contract) -> s1 b5-b6; acceptance criteria with the 3 stilstand criteria -> s2 b1-b2; without criteria discussion at delivery -> s2 b3; epic with OEE (OEE not defined on the voice, lesson defines it) -> s2 b4; epics and stories are PBIs, Scrum Guide no form -> s2 b5; typical errors (taak als story, geen zodat, "de gebruiker") -> s2 b6; question wie merkt het -> s2 b7; expert dispute (template schoolmeesterachtig) -> not in the film; worked example (30 pagina's, p.4, 10 min, planner/lasrobot/5 dagen, criteria 90 procent, 15 min, 25 stories, 6 pagina's) -> s3 b1-b5, all there.
- refine: definition and not an event, 1-2 uur -> s4 b1-b2; Developers estimate, PO explains -> s4 b3; INVEST (Wake 2003, all six letters) -> s4 b4-b6; story splitting, horizontal versus vertical, simplest first -> s5 b1-b3; Definition of Ready not in Guide, not a gate -> s5 b4; ordering (value, risk, dependencies) -> s5 b5; work preparation analogy -> s6 b1; errors and question -> s6 b2; example kozijnen (3 sprints, 4 stories, story 1 in a sprint, omsteltijd, learn rules) -> s6 b3-b6. Omsteltijd is not explained on the voice (the lesson defines it).
- points: relative estimation -> s7 b1; story points, 8 is about 4 x 2, per team -> s7 b2-b3; Fibonacci, 8 vs 13 -> s7 b4-b5; ideal days, Jeffries 2019 regret -> s7 b6; planning poker (Grenning 2002, silent, simultaneous, 3 versus 13, second round) -> s8 b1-b3; velocity and Definition of Done -> s8 b4; use spread, 18 to 30 -> s8 b5; not productivity, Goodhart-like effect -> s8 b6; count items alternative and question -> s8 b7; example trekhaken (21,25,18,30,24,22 -> 140, 23,3; 120 points; 5,1 -> 6 sprints) -> s9 b1-b3, extended with fast/slow case, 8 to 14 weeks, 12 likely -> s9 b4-b6 (this goes beyond the lesson text, and is useful: it finishes the example).
- Not in the film: expert dispute about the template; velocity only works with same team and stable estimating; the Fibonacci series numbers themselves are in captions at most; the "ervaring" that nine/eleven ideal days = 3 real days (the ideal-day anecdote is shortened).

Beat classes (by words, approx): NEW or NEEDED-DETAIL 78 percent, ELABORATION-USEFUL 15 percent (example completion s9 b4-b6, work-preparation analogy), RESTATE or FRAME 6 percent (s1 b4 restates the zodat of b2-b3; s4 b6; s1 b1 partly), DECOR 1 percent. Provenance-only: s7 b6 (Jeffries 2019 joke, about 25 words).
Verdict: TIGHT. 740 words carry about 1,365 words of lesson text. The film is long because three lessons are in it.

Short version: cut s1 b4 (9 words, restates "zodat waarom" of b2-b3; keep the caption), cut s4 b6 (14 words, the caption can carry it). Result about 717 words, 9 scenes; formula 305 s versus 314 s (about 3 percent). I would not cut more; the next candidates (s7 b6 Jeffries anecdote, 25 words) would be a trim of the lesson, not of the film.
Taster, 60 to 90 s: s1 b2-b4 (template with zodat), s2 b1-b3 (criteria), s3 (one example, shortened to the p.4 sentence), s5 b2-b3 (vertical slicing), s9 b1-b3 plus "gebruik de spreiding".
Lesson points the film lacks: expert dispute on the template; velocity validity condition; Fibonacci numbers on the voice (check the visual).

## pm.agile.forecast (313 s, 770 words, 9 scenes, 2 lessons)

Content map
- forecast: cone of uncertainty (Boehm 1981, McConnell, 0,25 to 4, judgement, narrows only by removing uncertainty) -> s1 b1-b3; probabilistic forecast, 85 procent, sponsor chooses -> s2 b1-b2; throughput and 60/8 to 60/4 -> s2 b3-b4; Monte Carlo (thousands of draws, 50/85 read-off, Vacanti and Magennis, only when way of working stable) -> s3 b1-b3 (the illustrative draw 5,7,4,6 is not given); NoEstimates and critics -> s4 b1-b2; Goodhart -> s4 b3-b4; bridge to ranges "uit teamdata" -> s4 b5; steering-group questions -> s4 b6 (3 of the 4 questions; the "Wanneer werken we bij" is in the caption); example: 48 items, 10-week throughput (3,6,5,... = 50, 5 per week; the series itself is not stated), 10,000 runs 3 of 4 in 10, 98 percent in 11, nearly all in 12 -> s5 b1-b3, plus a sanity check (48/5 = 9,6; slowest week 16 weeks), advice 11 weeks for 85 percent, caveats -> s5 b4-b7 (beyond the lesson text, useful: it makes the decision).
- flowsteer: SLE and percentile -> s6 b1-b3; work item age, 7 of 8 days, control-chart analogy -> s7 b1-b2; CFD, thicker band, diverging lines, conservation of flow, Little's law condition -> s7 b3-b5; utilisation, x/(1-x) = 4, 9, 19, Reinertsen, 100 percent -> s8 b1-b3; Lean bridge (buffers, heijunka) -> s8 b4; dispute -> s8 b5; example sorteermachines (20 times, mean 8, 17th item = 11 days, SLE, one item at 9 days, tail) -> s9 b1-b4. The 20 cycle times are not read out; a viewer cannot check "het 17e is 11 dagen" unless the visual shows the list (I could not check).
- Not in the film: stuurgroep questions "Wat is onze SLE, hoeveel items boven de helft ervan?" and "Welke band op het diagram groeit?"; the sum 160 for the mean of 8; the throughput series.

Beat classes: NEW/NEEDED 80 percent, ELAB-USEFUL 14 percent (s5 b4-b7, s9 b3-b4), RESTATE/FRAME 5 percent (s4 b5 bridge; s6 b3 partly), DECOR 1 percent. Provenance-only: Vacanti and Magennis, Reinertsen names (about 20 words).
Verdict: TIGHT. Dense, not long for its own sake.
Short version: cut s4 b5 (17 words, a bridge to a topic the learner "already knows"), shorten s3 b3 to the second sentence (about 10 words). Result 745 words; formula 316 s versus 326 s (3 percent).
Taster 60 to 90 s: s2 (probability, not date), s3 b1-b2, s5 b3-b6 (the answer: 11 weeks for 85 percent), s6 b1 (SLE).
Lesson points lacking: see "Not in the film" above.

## pm.agile.kanban (343 s, 759 words, 9 scenes, 3 lessons)

Content map
- board: Toyota card, pull -> s1 b1-b2; knowledge-work Kanban and Anderson -> s1 b3 (2010 book not said); Kanban Guide 2020 definition -> s1 b4; board columns, work item, card moves right -> s2 b1-b2; start where you are, no roles or sprints -> s2 b3 (the "naast Scrum" is not said); Definition of Workflow -> s2 b4; blocked card, red sticker, andon -> s2 b5-b6; difference with Toyota -> s3 b1; typical error and takenlijst -> s3 b2; example machinebouwer (40 post-its, columns, 12/9/6, 4 blocked, begin/klaar definitions) -> s3 b3-b6. Question "Wanneer telt werk hier als begonnen" is covered in the example.
- wip: WIP definition, cost, limit, vol means nothing new -> s4 b1-b2; context switching (Weinberg 20 percent, estimate), longer standing still -> s4 b3-b4; swarming -> s5 b1-b2; start number -> s5 b3; supermarket/buffer and bottleneck -> s5 b4; errors -> s5 b5; dispute and question -> s5 b6; example zuivelfabriek (5 people, 15 items, 6 weeks, limits 4 and 2, week 1, after 6 weeks 6 items and 2,5 weeks) -> s6 b1-b4. The effect "6 items -> 2,5 weeks" is not derived; Little's law comes later (s8-s9).
- flowmetrics: four flow measures -> s7 b1-b3; cycle-time pitfall, lead time -> s7 b4-b5; Little's law with 12/3 -> s8 b1-b2; halving WIP -> s8 b3; stability condition -> s8 b4; Vacanti caveat -> s8 b5; Lean parallel, mean pitfall, question -> s8 b6; example meubelfabriek (12, 3 per week, 4 weeks, measured 4,2, too long) -> s9 b1-b2 and the fix WIP 6 -> 2 weeks, with guards -> s9 b3-b5 (extension beyond the lesson, useful).
- Not in the film: Anderson's 2010 book, Kanban next to Scrum, "Little's law known from the factory" (partly in s8 b6).

Beat classes: NEW/NEEDED 77 percent, ELAB-USEFUL 17 percent (s9 b3-b5, s5 b2, s5 b4), RESTATE/FRAME 6 percent (s1 b4 repeats the idea of s1 b3; s8 b5 repeats "gemiddelden" of b2), DECOR 0.
Verdict: TIGHT.
Short version: cut s1 b4 (16 words) or merge it with b3, cut s8 b5 (12 words). Result about 729 words; formula 310 s versus 322 s (4 percent).
Taster: s1 b1-b2 (pull), s2 b1-b2 and b5 (board, blocked card), s4 b2 (WIP limit), s8 b1-b3 (Little's law and the halving).

## pm.agile.scrum (333 s, 746 words, 9 scenes, 3 lessons)

Content map
- scrumbasics: framework, Guide, 13 pages -> s1 b1-b3; sprints and the risk of long ones -> s1 b4-b6; team size, accountabilities -> s2 b1-b2; PO, SM, Developers -> s2 b3-b5; Lean bridge -> s2 b6; factory use, error (IT manager both) and question -> s3 b1-b3; example (7 people, PO 2 days, SM from Lean team, sprint 5 goal, after 2 weeks all shifts, sprint 6 Monday) -> s3 b4-b7. The composition 3 programmeurs, 1 tester, 1 analyst becomes "vijf Developers".
- events: five events, timeboxes planning 8 h and daily 15 min -> s4 b1-b2 (review 4 h and retro 3 h not said); planning's three questions -> s4 b3-b6; daily (15 min, same time and place, not status, form chosen by team, the three old questions not said) -> s5 b1-b2; review (work session, not a gate) -> s5 b3-b4; retro and kaizen -> s5 b5; refinement not an event -> s5 b6; example (halved timeboxes, planning 4 h, daily 9:00, review and retro, 2,5 h) -> s6 b1-b5. The example numbers for the review (2 h) and the retro (1,5 h) are not given on the voice; the caption does not give them either.
- artefacts: three artefacts and commitments -> s7 b1; PB and Product Goal -> s7 b2-b3; SB and Sprint Goal, scope adjustment -> s7 b4-b6; Increment, DoD -> s8 b1-b3; quality-gate analogy -> s8 b4; cancel sprint -> s8 b5; errors and questions -> s8 b6-b7; example weegschaal (goals, DoD, 5 items, 3 done) -> s9 b1-b6.
- Not in the film: review and retro timeboxes for a month (4 h, 3 h); the example's review and retro durations; the older three daily questions; team composition in example; "Developers hoeven geen programmeurs" is partly there; the "definition of ready... Increment mag eerder in gebruik" fine.

Beat classes: NEW/NEEDED 82 percent, ELAB-USEFUL 11 percent, RESTATE/FRAME 6 percent (s1 b5, s7 b1, s9 b4), DECOR 1 percent.
Verdict: TIGHT. Here the ceiling clearly bites: the film drops the review and retro numbers, which the worked example needs.
Short version: cut s9 b4 (8 words), cut s1 b5 or merge with b4 (about 11 words). Result about 726 words; formula 308 s versus 316 s (3 percent). If time is wanted for the missing example numbers (review 2 h, retro 1,5 h, about 15 words), the net would be about 0.
Taster: s2 b2-b5, s4 b1 and b3, s7 b2-b5 (two backlogs, two goals), s8 b2-b3 (Done).

## pm.close.results (246 s, 588 words, 7 scenes, 1 lesson)

Content map
- Teach 1 baseline and same definition -> s1 b1-b4 (stops over 5 min vs 2, write down, keep raw data: all there); Teach 2 noise 11 to 17 percent, 2 points proves little, 8 to 12 weeks, what else changed, comparison group -> s2 b2-b4, s3 b1-b2; Teach 3 money in client terms, netbeheerder, contribution margin, controller -> s5 b1-b4; Teach 4 expert dispute, run chart, regression to the mean, three-month recheck -> s4 b1-b4; Teach 5 do not over-claim, example sentence, welcome the controller, credit the team, the sharp question -> s7 b1-b4; worked example -> s2 b1, s3 b3-b4, s6 b1-b4 (12 weeks 14, 10 weeks 9, 7 to 11, lijn 4 13, 6.000 h, 300 h, 450 euro, 135.000 euro, with controller).
- All lesson points present. The only addition is a short definition of stilstand (s2 b1), which is needed detail.

Beat classes: NEW/NEEDED 90 percent, ELAB-USEFUL 4 percent, RESTATE/FRAME 6 percent (s1 b1 first sentence, s4 b3, "Dan het geld", "Terug naar de bottelarij", "Dan de mensenkant"), DECOR 0.
Verdict: TIGHT. A 588-word film for a 497-word lesson; the film is longer than the lesson text only because it builds the example in the order of the argument and spells out the arithmetic.
Short version: cut the first sentence of s1 b1 (11 words) and s4 b3 (7 words). Result about 570 words; formula 242 s versus 249 s (3 percent).
Taster 60 to 90 s: baseline with same definition (s1 b1-b3), noise (s2 b2-b3), comparison line (s3 b2-b4), 300 x 450 = 135.000 (s6 b1, b3).
Lesson points lacking: none.

## pm.consult.proposal (335 s, 752 words, 9 scenes, 2 lessons)

Content map
- proposal: start with their problem (14 to 8 percent), sponsor -> s1 b2-b3; outcome (measure, baseline, goal, owner), phases, diagnosis (3 weeks, 12 days, 14.400), go/no-go, price the rest later -> s2 b1-b4; client commitments (sponsor 1 h per 2 weeks, counterpart 1 day, data in week 1, two sessions), not small print -> s3 b1-b3; 2 or 3 options, why -> s3 b4-b5; 5 to 6 pages, call the sponsor -> s3 b6; practice and procurement, range versus one number, six-months question -> s4 b1-b4; example (OEE 58, 60k, 85 percent on-time, inkoop three quotes, 95 percent, phase 1 12 days 14.400, phase 2 two options, needs, call before) -> s5 b1-b8. "Phase 2 price becomes fixed after phase 1" detail missing.
- pricing: day rate, fixed, value-based -> s6 b1-b3; conditions for value-based, Weiss, procurement prefers day rates, trusted client -> s6 b4-b6; fixed price as a bet, 40 vs 50 days, 960, 15 to 25 percent, tight scope, assumptions -> s7 b1-b5; change request and "nog één analyse" script, one free time -> s7 b6-b8; discount (10 percent -> 11 percent more days), trades, no bare discount, no dropping phase 1, question -> s8 b1-b4; example extrusielijn (400k, 30/45 days, 1.200, competitor 30k, phase 1 8 days 9.600, phase 2 22 or 37 days + 15 percent, value option, the 30k answer) -> s9 b1-b7.
- Not in the film: SCQ and fixed-price cross-reference, "prijzen op waarde niveau 3" and scope-in-conversation cross-reference (pointers only); "Phase 2 prijs wordt vast na fase 1" in example.

Beat classes: NEW/NEEDED 88 percent, ELAB-USEFUL 8 percent, RESTATE/FRAME 4 percent (s1 b1 first sentence, s7 b6 partly repeats b5), DECOR 0.
Verdict: TIGHT.
Short version: cut s1 b1 first sentence (about 10 words); merge s7 b5 and b6 (about 8 words saved). Result about 734 words; formula 312 s versus 319 s (2 percent).
Taster 60 to 90 s: s1 b2-b3 (problem on page one), s2 b2-b3 (diagnosis, go/no-go), s3 b4-b5 (options), s6 b1-b3 (three prices), s7 b1-b3 (40 vs 50 days = 960).

## pm.devops.incident (192 s, 452 words, 6 scenes, 1 lesson)

Content map
- ITIL, origin, ITIL 4, PeopleCert, three words -> s1 b1-b3; incident, goal, servicedesk -> s2 b1-b3; problem, goal, printer 52 incidents -> s3 b1-b3; change, recent change question, change enablement -> s4 b1-b3; Lean bridge, servicedesk good at incidents, five-storingen question -> s5 b1-b4; example (Maandag 06:10, restart 06:25, Tuesday 06:05, Wednesday 06:12, pattern, one problem, Thursday back-up 06:00 to 04:00 is a change) -> s6 b1-b6. All points present.

Beat classes: NEW/NEEDED 80 percent, ELAB-USEFUL 8 percent, RESTATE/FRAME 12 percent: s1 b3 (framing about 12 words), s5 b2 second half "weer werken versus nooit meer" (restates s2 b2 and s3 b2, about 15 words), s6 b1 (19 words, frame). Provenance-only: s1 b2 (28 words, ITIL origin and owner).
Verdict: TIGHT, but the closest to the TRIMMABLE line in this batch. If provenance-only s1 b2 and the s4 b3 naming trivia were also judged as not needed, it would reach about 17 to 20 percent. I kept it TIGHT because those are lesson points, the film is far under the ceiling, and it tracks a 435-word lesson.
Short version: cut s6 b1 (19 words), reduce s5 b2 to the Lean parallel (about 15 words). Result about 432 words, 6 scenes; formula 185 s versus 193 s (4 percent). If the lesson text were also trimmed: dropping s1 b2 and the second part of s4 b3 would give about 400 words, 170 s.
Taster 60 to 90 s: the three words (s1 b3, s2 b1-b2, s3 b1-b2, s4 b1), and the 52 printer incidents (s3 b3).
Lesson points lacking: none.

## pm.devops.pipeline (330 s, 759 words, 9 scenes, 2 lessons)

Content map
- pipeline: two camps and the wall, DevOps, 2009 Debois -> s1 b1-b4; pipeline, version control, commit -> s2 b1-b3; four steps and stop on red -> s3 b1-b5; standard work, jidoka, small commits, CI/CD forward pointer, "wij zijn geen softwarebedrijf", the sharp question -> s4 b1-b6; example (09:00 to 09:15, versie 4.7.1, proefetiket, 15 min) -> s5 b1-b5.
- fourkeys: DORA, 2014, Accelerate 2018, Google Cloud 2018, State of DevOps -> s6 b1-b2; deploy frequency and change lead time, what production means -> s6 b3-b5; change fail rate, recovery time (MTTR to 2023) -> s7 b1-b4; four keys together -> s7 b5; Lean bridges, the quarterly deploy myth, the IT-team question -> s8 b1-b3; example snoepfabriek (8 in 4 weeks, 6 days, 2 of 8, 25 percent, 1 h and 3 h, conclusion) -> s9 b1-b5.
- Not in the film: the MES is named but not defined in s4 b5 (the lesson defines it); the film's lesson point "klein commits" fine.

Beat classes: NEW/NEEDED 82 percent, ELAB-USEFUL 8 percent, RESTATE/FRAME 7 percent (s5 b1 frame; s4 b4 forward pointer partly), DECOR 3 percent. Provenance-only: s1 b4 (Debois, 18 words), s6 b2 (about 45 words: names, book, year, Google).
Verdict: TIGHT.
Short version: cut s5 b1 (15 words, merge with b2), shorten s6 b2 to "Accelerate, 2018; DORA hoort nu bij Google Cloud" (saves about 25 words). Result about 719 words; formula 306 s versus 322 s (5 percent).
Taster: s1 b3, s2 b1, s3 b1-b5, s5 b5 (15 minutes without a hand step), s7 b5 (fast and stable together).

## pm.devops.postmortem (230 s, 550 words, 7 scenes, 1 lesson)

Content map
- Teach 1 definition, document, Google SRE book -> s1 b1-b3; Teach 2 blameless, the button, not no-responsibility, mistake is information -> s2 b1-b4; Teach 3 timeline, 5 Whys, Ohno, several causes -> s3 b1-b4; Teach 4 workaround, known error -> s4 b1-b4; Teach 5 how many, threshold, follow-up, question -> s5 b1-b4; example: timeline and Why 1, Why 2 -> s6 b1-b5; the film then asks the learner to continue (s6 b6) and gives Why 3, Why 4, workaround, two actions, and "no culprit" (s7 b1-b5). The lesson text stops at Why 2, so s7 is added by the film; it completes the example and uses every concept (5 Whys, workaround, owner action, blameless).

Beat classes: NEW/NEEDED 62 percent, ELAB-USEFUL 25 percent (s7 b1-b5, s6 b6 the learner's turn), RESTATE/FRAME 6 percent (s1 b1 partly, s6 b1), DECOR 7 percent: provenance-only s1 b3 (25 words) and s3 b3 (10 words).
Verdict: TIGHT. About 40 percent of the film is the example, but it is the example's content.
Short version: cut s1 b3 and s3 b3 (35 words, both provenance-only). Result about 515 words; formula 220 s versus 234 s (6 percent). I would keep s6 b6 "Nu jij": it makes the learner do something, and it needs the time.
Taster: s2 b1-b4 (blameless), s3 b2 (5 Whys), s6 b4-b5 plus s7 b1-b2.
Lesson points lacking: none (the film adds to the lesson).

## pm.intake.firsttalk (337 s, 761 words, 9 scenes, 3 lessons)

Content map (3 lessons, 1,561 words)
- ask: client comes with solution or symptom, three layers -> s1 b1-b2; example (140/600, 90 materiaal, probleem and doel, dashboard klein) -> s1 b3-b4; questions under it, one recent case, cost of inaction -> s2 b1-b2 (the "Wat gebeurt er als er een jaar niks verandert" is in a shortened form); KPI target, OEE definition, wereldklasse, 58 to 75, 42 points -> s2 b3-b4 ("veel fabrieken rond 60 procent" not said); human side, script, resistance -> s3 b1-b2; hypothesis, naive questions, verbatim words -> s3 b3-b4.
- firsttalk: 5/35/10/10 structure and naming it -> s4 b1-b3; MORE PIES -> s5 b1-b4; 70 to 80 percent, correction, the silence -> s6 b1-b4 (example 6 changeovers of 50 min, paraphrase, correction); resistance, previous consultant, notebook, five things, 24 h summary, sharp question -> s7 b1-b5; example's last steps -> s7 b4.
- listen: active listening, rule reflect then ask -> s5 b1, s8 b2; example (senior werkvoorbereider, mood, reflect, 5 seconds, open question, paraphrase, empathy, agreement) -> s8 b1-b5; silence (Rowe, 3 and 5 s) -> s9 b1; opening questions, why versus wat maakte dat je, fake question -> s9 b2-b3; experience as bridge, self-check -> s9 b4.
- Lesson points lacking: KPI "veel fabrieken rond 60 procent"; Rogers and Farson 1957 and Walker 2023 attributions; MORE PIES definitions are fully there; opening questions "Waar maak je je het meeste zorgen over?" and "Wat hebben jullie eerder geprobeerd?"; the pitfall "Bij een vorige klant hadden we precies hetzelfde" is not named (only the bridge version); phone face-up and laptop versus paper notebook dispute (only "notitieboek, geen verhoor"); "Wil je donderdag" fine; "Wat je nog niet weet, als open vraag" is in s7 b3.

Beat classes: NEW/NEEDED 82 percent, ELAB-USEFUL 11 percent, RESTATE/FRAME 6 percent (s4 b3 repeats s4 b1; s7 b4 partly), DECOR 1 percent (s5 b4, a variant of the letters).
Verdict: TIGHT. The film is not padded; it is a compression of three lessons that skips about 8 minor points.
Short version: cut s4 b3 (16 words), cut s5 b4 (11 words). Result about 734 words; formula 312 s versus 322 s (3 percent). The space freed could carry two or three of the skipped points.
Taster: s1 b2-b4 (three layers and example), s5 b2-b3 (MORE PIES in short), s6 b2-b3 (correction is gold), s7 b3 (five things and 24 h).

## pm.intake.stakeholders (334 s, 760 words, 9 scenes, 3 lessons)

Content map (3 lessons, 1,481 words)
- stakeholders: definition and four roles with example -> s1 b1-b4; map with two axes and the three quadrants -> s2 b1-b2; example teamleiders and one-to-ones -> s2 b3; make in a quarter of an hour, update monthly -> s2 b4; ask questions, lachje -> s3 b1-b2; 30 percent data -> s3 b3; OR instemming -> s3 b4; resistance and escalation -> s4 b1-b3; organogram trap, neutral map, question -> s5 b1-b3.
- influence: you trade, valuta -> s6 b1; reciprocity, give first, steering committee defined -> s6 b2; credibility -> s6 b3-b4; stakeholder map (influence versus attitude), 10 to 15 names -> s7 b1; win Ans, the head of execution, sponsor kept in reserve, one-to-one first -> s7 b2-b5. The question "Wat zou dit voor jou de moeite waard maken?" and the example-sentence "Als ik de weekrapportage ... kun je Jan..." are partly there (s7 b3, b5).
- raci: RACI letters -> s8 b1-b3; capacity model example -> s8 b4; one owner -> s8 b5; sponsor role and question -> s9 b1; conflict -> s9 b2; pitfalls and variants and "wiens telefoon" -> s9 b3-b4.
- Lesson points lacking: Mendelow attribution; Cohen and Bradford and Cialdini names; "not manipulation as long as the help is sincere" (a real point of the lesson that prevents misreading); "Met wie moet ik eerst praten?"; the dispute critics versus movable middle; RACI example's first deliverable (planner R, operations manager A, C shift leaders, I plant manager) and "tien namen allemaal C"; "Waar kan ik op je rekenen, en hoe bereik ik je" is not said.
- Film extends the lesson's open example (Ans, hoofd uitvoering, Tuesday readiness check) with a solution; that is ELAB-USEFUL.

Beat classes: NEW/NEEDED 78 percent, ELAB-USEFUL 14 percent (s7 b2-b4), RESTATE/FRAME 7 percent (s7 b1 re-introduces the map; s8 b1 partly), DECOR 1 percent.
Verdict: TIGHT.
Short version: cut the first half of s7 b1 (about 15 words, the second map re-introduced), s8 b1 shortened (about 10 words). Result about 735 words; formula 312 s versus 322 s (3 percent).
Taster: s1 b2-b4, s2 b1-b2, s3 b1-b2, s6 b1-b2 (trade, give first), s8 b2-b3 (RACI).

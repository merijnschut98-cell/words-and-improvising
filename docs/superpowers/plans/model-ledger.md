# Model ledger

One line per finished subagent, added by the integrator. Rules and the table to adjust: `2026-11-14-model-routing.md`. Review after about 30 lines.

Outcome: accepted (merged as delivered), sent back N times, redone.

| Date | Task | Model | Tool uses | Duration | Tokens | Outcome |
|---|---|---|---|---|---|---|
| 14 Nov | Fetch Anthropic subagent docs | haiku | 3 | 26 s | 27,020 | accepted, but its summary said a section was missing; its report quoted the verbatim page, which was right |
| 14 Nov | Fetch model-per-role guide | haiku | 2 | 21 s | 23,461 | accepted |
| 14 Nov | Fetch review-cost data (Mesa, Arize) | haiku | 3 | 18 s | 28,102 | accepted |
| 14 Nov | Projects map: model and drawing (v17 task 3) | sonnet (inherited from the session, no explicit parameter) | 46 | 7 min | 174,853 | accepted as delivered; merged v250 |
| 14 Nov | Review pilot module intro pm.plan.intro | sonnet (inherited) | 101 | 20 min | 235,983 | accepted; found a broken sw.js and a generic room, so an improvement round followed |
| 14 Nov | Pilot module intro pm.plan.intro, second segment after a resume | unknown (resumed with SendMessage, no model parameter) | 58 | 12 min | 324,052 | sent back once by its review (room, kit checks) |
| 14 Nov | Review forecast film, second segment after a resume | unknown (resumed) | 26 | 7 min | 221,563 | accepted; merged v249 |
| 14 Nov | Build module screen (v17 task 6) | sonnet (inherited) | 85 | 39 min | 202,161 | in review (opus); e2e only partly verified by the author |
| 14 Nov | Render PM-9: migration and forecast (resumed) | unknown (resumed) | 52 | 59 min | 128,009 | accepted; merged v252, two narration lines split |
| 14 Nov | Improve pilot intro: room, kit, shared map scene | sonnet (inherited) | 103 | 25 min | 382,415 | sent back once: its review found label widths guessed, silent map failures |
| 14 Nov | Review improved pilot intro and kit | opus | 110 | 24 min | 274,803 | accepted with six kit fixes and a trim; merged v253 |
| 14 Nov | Film length review pm1 (11 films, dossiers lacked example answers) | sonnet | 14 | 4 min | 189,991 | accepted |
| 14 Nov | Film length review one1 (13 films, same dossier gap) | sonnet | 17 | 2 min | 166,590 | accepted |
| 14 Nov | Film length review one2 (12 films, same dossier gap) | sonnet | 12 | 3 min | 165,007 | accepted |
| 14 Nov | Film length review two1 (11 films) | sonnet | 15 | 3 min | 185,212 | accepted; re-checked after the dossier fix, no verdict changed |
| 14 Nov | Film length review two2 (10 films) | sonnet | 15 | 2 min | 174,105 | accepted |
| 14 Nov | Review module screen (v17 task 6) | opus | 75+ (report lost in a container restart, read back from its log) | about 20 min+ | 181,396+ | accepted with three navigation fixes; merged v254 |
| 14 Nov | Film length review many1, many2, many3 (40 films) | sonnet | 19, 19, 17 | 5, 4, 3 min | 254,407, 243,647, 214,224 | accepted |
| 14 Nov | Trim four films (Task 18) | sonnet | 78 | 14 min | 258,725 | accepted with three small fixes by its review |
| 14 Nov | Review four trimmed films | sonnet | 82 | 8 min | 258,354 | accepted; found a TPM over-claim, a confusing fuse drawing, a broken fiverules assert |
| 14 Nov | Render PM-10: pm.plan.intro | sonnet | 70 | 23 min | 129,634 | accepted; no pipeline change needed; merged v255 |
| 14 Nov | Build: back to module screen after a lesson (6b) | sonnet | 18 | 3 min | 120,151 | sent back once: its review added the missing red runs and fixed the subject choice; merged v257 |
| 14 Nov | Build field film 1 pm.field.lifecycle and field kit | opus | 156 | 34 min | 421,376 | accepted with fixes by its review; merged v256 |
| 14 Nov | Review field film 1 and field kit | opus | 110 | 22 min | 268,193 | accepted; fixed a kit rule that would have blocked 6 of 11 module titles |
| 14 Nov | Review: back to module screen (6b) | opus | n/a | n/a | n/a | accepted with one fix, wiring tests and e2e steps through real buttons |
| 14 Nov | Render PM-12: pm.field.lifecycle | sonnet | n/a | n/a | n/a | accepted; one narration line padded with 'itself/zelf' to fix a cue; merged v258 |
| 14 Nov | Render PM-11: four trimmed films | sonnet | n/a | n/a | n/a | accepted; ran two renders at once and one overwrote a manifest entry, which it rebuilt (sizes verified); merged v259 |
| 14 Nov | Build: Projects map on subject home (Task 7) | sonnet | n/a | n/a | n/a | accepted with fixes by two opus review runs; merged v262 |
| 14 Nov | Build: calmer speaking home (Task 12 part 1) | sonnet | 21 | 4 min | 127,489 | accepted with fixes by two opus review runs; merged v260 |
| 14 Nov | Kit: short films (Task 4a) | sonnet | 29 | 4 min | 118,631 | accepted with one fix by its review |
| 14 Nov | Review: short films (4a) | opus | 47 | 11 min | 146,005 | accepted; found the video floor too high for the Dutch voice; ran a 30 s film through the real guard |
| 14 Nov | Add tool names to the two overview films | sonnet | 94 | 14 min | 248,878 | accepted with changes by its review (an Expert term swapped, lists of three cut to two) |
| 14 Nov | Review: Projects map on home (first run) | opus | n/a | 53 min | n/a | stopped by an accidental interruption after committing two fixes; finished by a fresh opus agent |
| 14 Nov | Review: calmer speaking home (first run) | opus | 77 | 48 min | 167,331 | stopped by an accidental interruption after committing fixes; finished by a fresh opus agent |
| 14 Nov | Review: tool names in two films (first run) | sonnet | n/a | 10 min | n/a | stopped by an accidental interruption; restarted fresh on sonnet |
| 14 Nov | Review: tool names in two films (restart) | sonnet | n/a | n/a | n/a | accepted; merged into the render branch |
| 14 Nov | Review: calmer speaking home (finish) | opus | n/a | n/a | n/a | accepted; one test gap closed; found a leftover test server serving an old worktree |
| 14 Nov | Build field film 2 pm.field.people | sonnet | 90 | 14 min | 264,708 | accepted with fixes by its review (three non-tools replaced); merged v261 |
| 14 Nov | Review field film 2 | sonnet | n/a | n/a | n/a | accepted |
| 14 Nov | Review: Projects map on home (finish) | opus | 98 | 45 min | 204,881 | accepted; fixed the field film fallback; found that the two rendered videos need a re-render (dark theme, low label contrast); merged v262 |
| 14 Nov | Build field film 3 pm.field.portfolio | sonnet | 89 | 12 min | 290,551 | accepted with fixes by its review; merged v263 |
| 14 Nov | Build: Andon visible (Task 8) | sonnet | 44 | 6 min | 152,599 | accepted with fixes by its review; merged v266 |
| 14 Nov | Review field film 3 | sonnet | 77 | 12 min | 201,498 | accepted |
| 14 Nov | Build field film 4 pm.field.it | sonnet | 99 | 15 min | 349,413 | accepted with two cosmetic fixes; merged v264 |
| 14 Nov | Review field film 4 | sonnet | n/a | n/a | n/a | accepted |
| 14 Nov | Render PM-13: four overview films | sonnet | 66 | 89 min | 136,625 | accepted; every guard passed first time; merged v265 |
| 14 Nov | Review: Andon visible | opus | 91 | 47 min | 193,328 | accepted; added the start-screen greeting, fixed two guide lines on one screen, fixed two e2e steps for several field films |
| 14 Nov | DevOps pronunciation (Task 20) | sonnet | 38 | 6 min | 111,168 | accepted; no separate review (spoken text only, checked by the render's listen guard); merged v266 |
| 14 Nov | Build module intro pm.run.intro (Task 11) | sonnet | 144 | 23 min | 331,227 | accepted with fixes by its review (two tool picks, a map fade bug) |
| 14 Nov | Build module intro pm.intake.intro (Task 11) | sonnet | 150 | 27 min | 379,094 | in review (opus, kit: optional tileUnits; clashes with the run intro's TILE_UNITS 130) |
| 14 Nov | Review module intro pm.run.intro | opus | 76 | 17 min | 208,568 | accepted with four fixes; TILE_UNITS 130 measured safe; found the same map fade bug in the pilot |
| 14 Nov | Render PM-14: pipeline (DevOps voice) and pm.field.it | sonnet | 38 | 45 min | 118,124 | accepted; one narration line rewritten to remove a colon pause; merged v269 |
| 14 Nov | Review module intro pm.intake.intro | opus | 73 | 18 min | 222,687 | accepted with fixes (kit tileUnits hardened, two story reasons added); advised per-film tileUnits over a raised default |
| 14 Nov | Build module intro pm.close.intro (Task 11) | sonnet | 114 | 17 min | 339,315 | accepted with fixes by its review |
| 14 Nov | Build module intro pm.land.intro (Task 11) | sonnet | 147 | 25 min | 342,531 | accepted with fixes by its review |
| 14 Nov | Review module intro pm.close.intro | sonnet | 73 | 9 min | 220,029 | accepted with six small fixes (goal wording after the move, chip spacing, s7 trimmed to its captions) |
| 14 Nov | Review module intro pm.land.intro | sonnet | n/a (report read back from its log after a container restart) | n/a | n/a | accepted with four fixes (s7 to its captions, three SAY rules made unneeded by rewording) |
| 14 Nov | Render PM-15: intake, run and plan intros | sonnet | n/a (read back from its log) | n/a | n/a | accepted; every guard passed first time; disk ran full mid-batch; merged v271 |
| 14 Nov | Fix: subject map spilled out of its card | sonnet | n/a (read back) | n/a | n/a | accepted; cause a deliberate phone bleed in styles.css; labels smaller (7.6 px at 390), Merijn chose a phone layout next; merged v271 |
| 14 Nov | Render PM-16: land and close intros | sonnet | 38 | 30 min | 123,964 | accepted; every guard passed first time; merged v272 |
| 14 Nov | Build: phone layout for the subject map | sonnet | 68 | 18 min | 151,639 | sent back once by Merijn: two per row made the map 3.5 times taller; asked for three per row |
| 14 Nov | Build module intro pm.agile.intro (Task 11) | sonnet | 154 | 23 min | 387,975 | accepted with fixes by its review |
| 14 Nov | Review module intro pm.agile.intro | sonnet | n/a | n/a | n/a | accepted with two fixes (mindset tools from the Expert lesson replaced by the Agile Manifesto; level grid no longer repeats scene content) |
| 14 Nov | Fix: Pages deploy found no artifact (integrator) | opus (session) | n/a | n/a | n/a | build and deploy split into two jobs; v273 deployed |
| 14 Nov | Build: map phone layout, three per row | sonnet | 29 | 8 min | 121,683 | accepted with three fixes by its review |
| 14 Nov | Review: map phone layout | opus | n/a | n/a | n/a | accepted with three fixes (ResizeObserver loop error, observer leak, tap margin at 320); merged v275 |
| 14 Nov | Build module intro pm.devops.intro (Task 11) | sonnet | 104 | 20 min | 366,441 | accepted with fixes by its review (two non-tools replaced, s7 and length trimmed) |
| 14 Nov | Review module intro pm.devops.intro | sonnet | n/a | n/a | n/a | accepted with seven fixes; merged v276 |
| 14 Nov | Build module intro pm.scaled.intro (Task 11) | sonnet | 91 | 16 min | 336,195 | accepted with fixes by its review |
| 14 Nov | Review module intro pm.scaled.intro | sonnet | n/a | n/a | n/a | accepted with seven fixes (WSJF out of the scene, SAY rules 8 to 4, scales made visible); merged v277 |
| 14 Nov | Build module intro pm.itproject.intro (Task 11) | sonnet | 111 | 16 min | 341,975 | accepted with fixes by its review |
| 14 Nov | Review module intro pm.itproject.intro | sonnet | n/a | n/a | n/a | accepted with fixes (story aligned: bought package, our IT team builds on it; selection beat removed); merged v278 |
| 14 Nov | Render PM-17: agile and devops intros | sonnet | 37 | 33 min | 105,516 | accepted; every guard passed first time; found English IT words the Dutch voice blurs (Agile, Daily Scrum, WIP, feature flag); merged v280 |
| 14 Nov | Build module intro pm.stuck.intro (Task 11) | sonnet | 115 | 19 min | 357,493 | accepted with fixes by its review |
| 14 Nov | Audit: calculations at Basis (Task 21 step 1) | sonnet | 73 | 11 min | 333,217 | accepted; Merijn then withdrew the task (simple examples stay); report kept |
| 14 Nov | Review module intro pm.stuck.intro | sonnet | 63 | 8 min | 188,597 | accepted with fixes (two non-tools out, a reason for the team lead's resistance); merged v282 |
| 14 Nov | Build module intro pm.lead.intro (Task 11) | sonnet | 100 | 16 min | 329,090 | accepted with fixes by its review |
| 14 Nov | Review module intro pm.lead.intro | sonnet | 71 | 10 min | 205,834 | accepted with fixes (Cialdini principles out, stakeholder map in; Werkkennis tools moved to the grid); merged v284 |
| 14 Nov | Build: Andon recognisable (status light, name, bubble, introduction) | sonnet | 52 | 11 min | 162,655 | accepted with fixes by its review |
| 14 Nov | Review: Andon recognisable | opus | n/a | about 45 min | n/a | accepted with three fixes (intro swallowed by the sync redraw, true green from the brand's success colour, layout jump); merged v286 |
| 14 Nov | Research: two new Projects modules (Task 14 step 1) | sonnet | n/a | n/a | n/a | accepted; 12 MC decisions kept for Merijn's round the next day |
| 14 Nov | Task 22: English IT words in the Dutch voice | sonnet | 82 | 49 min | 198,550 | accepted; Agile, Daily Scrum, WIP, rollback, versiebeheer fixed; 13 rendered films need a re-render; merged v288 |
| 14 Nov | Render PM-18: stuck and lead intros | sonnet | 45 | 37 min | 108,839 | accepted; every guard passed first time; Redikal Kander and MORE PIES only roughly heard; merged v289 |
| 14 Nov | Build module intro pm.negotiate.intro (Task 11) | sonnet | 91 | 16 min | 325,762 | accepted with fixes by its review |
| 14 Nov | Review module intro pm.negotiate.intro | sonnet | n/a | n/a | n/a | accepted with fixes (a move and a repeated tool swapped, a reason for skipping the inspection); merged v290 |
| 14 Nov | Build module intro pm.outside.intro (Task 11) | sonnet | 114 | 15 min | 325,295 | accepted with fixes by its review |
| 14 Nov | Review module intro pm.outside.intro | sonnet | n/a | n/a | n/a | accepted with fixes (duplicate decision memo out, FAT given the switchboard as reason, map label workaround); merged v291 |
| 14 Nov | Build: UI round (goal line, map highlight, named step, quests, 320 px bar, breadth-first next step) | sonnet | 129 | 67 min | 259,640 | accepted with fixes by its review |
| 14 Nov | Review: UI round and breadth-first next step | opus | 134 | 42 min | 238,182 | accepted with seven fixes (module order after the road, lesson-end next agrees, no async name swap, goal line wording); merged v292 |
| 15 Nov | Task 17 design: complete films (inventory, split rule, kit check, batches) | opus | n/a | n/a | n/a | accepted; 64 films change (27 splits), about 138 renders; six MC decisions kept for Merijn's round |
| 15 Nov | Build module intro pm.portfolio.intro (Task 11) | sonnet | 120 | 20 min | 363,981 | accepted with fixes by its review |
| 15 Nov | Review module intro pm.portfolio.intro | sonnet | n/a | n/a | n/a | accepted with fixes (Werkkennis tools moved to the grid, Basis tools in scenes, a causal error fixed); merged v295 |
| 15 Nov | Build module intro pm.consult.intro (Task 11) | sonnet | 121 | 15 min | 330,894 | accepted with fixes by its review |
| 15 Nov | Review module intro pm.consult.intro | sonnet | 72 | 9 min | 231,228 | accepted with fixes (client problem aligned with portfolio intro, two non-tools replaced, a SAY rule made unneeded); merged v296 |
| 15 Nov | Task 19 step 1: level opener texts (528) | sonnet | 43 | 14 min | 270,606 | accepted with fixes by its review |
| 15 Nov | Review: level opener texts | sonnet | n/a | n/a | n/a | accepted with fixes (68 content or term fixes, all openings varied); found that node validate.js did nothing from the command line and made it run every check; merged v297 |
| 15 Nov | Render PM-20: negotiate, outside, portfolio, consult intros | sonnet | 63 | 63 min | 128,531 | accepted; every guard passed first time; procesingenieurs still unclear; merged v298 |
| 15 Nov | Render PM-19: Dutch re-render after the voice fix (13 films) and scaled and IT-project intros | sonnet | 110 | 3 h 18 min | 207,686 | accepted; three lines reworded to pass the guard; 'IT en agile' still heard as HL by Whisper; merged v299 |
| 15 Nov | Kit: label fit for long map labels in mapScene | sonnet | 62 | 12 min | 185,448 | accepted with fixes by its review |
| 15 Nov | Review: kit label fit | opus | n/a | n/a | n/a | accepted with four fixes (halo clip on descenders, markup guards, $ in replace, generic for every map); 11 films need a re-render; merged v300 |
| 15 Nov | Task 19 step 2: level openers in the app | sonnet | 106 | 53 min | 219,150 | accepted with fixes by its review |
| 15 Nov | Review: level openers in the app | opus | n/a | n/a | n/a | accepted with fixes (cap 1200, passed levels count as seen, 2.5 s load timeout, button labels, unique accessible names); full e2e 111/111; merged v301 |
| 15 Nov | Task 12 part 2: module titles on one line | sonnet | 37 | 14 min | 140,292 | accepted with fixes by its review |
| 15 Nov | Review: module titles | sonnet | n/a | n/a | n/a | accepted with a fix (no title cut off: smaller title below 480 px, two balanced lines below 375 px); full e2e 111/111; it killed a server on port 8123 that may have belonged to another agent; merged v302 |
| 15 Nov | Task 13 step 1: Engineering subject map (four zones) | sonnet | 108 | 86 min | 257,564 | accepted with fixes by its review |
| 15 Nov | Review: Engineering map | opus | n/a | n/a | n/a | accepted with fixes (label-fit test generic, phone map 840 to 741 px); merged v303 |
| 15 Nov | Render PM-21: 11 films re-rendered for the map-label fit; procesingenieurs fixed | sonnet | 86 | 2 h | 170,737 | accepted; every guard passed first time; merged v304 |
| 15 Nov | Build: Engineering field film eng.field.making | sonnet | 150 | 29 min | 449,586 | accepted with fixes by its review |
| 15 Nov | Review: eng.field.making | opus | n/a | n/a | n/a | accepted with fixes (person-scale drawing, a reason for the cartons, mass balance instead of a shared tool, how the stations connect); merged v305 |
| 15 Nov | e2e: free port per run (in-process server) | sonnet | 35 | 90 min | 104,068 | accepted without a separate review (test infrastructure; two parallel mapfit runs and a full smoke 111/111 passed); merged v306 |
| 15 Nov | Render PM-22: eng.field.making | sonnet | n/a | n/a | n/a | accepted; every guard passed first time; merged v307 |
| 15 Nov | Build: Engineering field film eng.field.digital | sonnet | 180 | 28 min | 465,519 | accepted with fixes by its review |
| 15 Nov | Review: eng.field.digital | sonnet | n/a | n/a | n/a | accepted with fixes (map scene trimmed, verbs that fit the tools, MES story aligned); merged v308 |
| 15 Nov | Render PM-23: eng.field.digital | sonnet | n/a | n/a | n/a | accepted; every guard passed first time; tags and gateway heard poorly; merged v309 |
| 15 Nov | Build: Engineering field film eng.field.energy (with kit station labels) | sonnet | 218 | 45 min | 529,863 | accepted with fixes by its review |
| 15 Nov | Review: eng.field.energy | opus | 144 | 20 min | 311,286 | accepted with fixes (station label must shorten its own title, two non-tools replaced, trimmed to ~3:05); merged v310 |
| 15 Nov | Build: first Engineering module intro eng.machining.intro | sonnet | 149 | 36 min | 446,105 | accepted with fixes by its review |
| 15 Nov | Review: eng.machining.intro | opus | 89 | 15 min | 239,841 | accepted with fixes (the map first, a real tool instead of a material, machinists not office staff, trimmed to ~3:05); wrote the rules for the next 25 intros; merged v311 |
| 15 Nov | PM-24: tags/gateway voice and Dutch re-render of eng.field.digital | sonnet | 69 | 30 min | 147,934 | accepted; tags fixed, gateway close; merged v313 |
| 15 Nov | Render PM-25: eng.field.energy and eng.machining.intro | sonnet | n/a | n/a | n/a | accepted; every guard passed first time; lektest, G-code, werkstuknulpunt heard poorly; merged v314 |
| 15 Nov | Build: Engineering intro eng.joining.intro | sonnet | 119 | 24 min | 403,659 | accepted with fixes by its review |
| 15 Nov | Review: eng.joining.intro | sonnet | n/a | n/a | n/a | accepted with fixes (three groups in module order, a real tool instead of a control and a result, the guard drawn with its reason); merged v315 |
| 15 Nov | Build: Engineering intro eng.moulding.intro | sonnet | 124 | 27 min | 429,398 | accepted with fixes by its review |
| 15 Nov | Review: eng.moulding.intro | sonnet | n/a | n/a | n/a | accepted with small fixes (reasons for lit details, cover at field-film scale, trimmed); merged v316 |
| 15 Nov | Build: Engineering intro eng.mechanics.intro | sonnet | 109 | 20 min | 319,204 | accepted with fixes by its review |
| 15 Nov | Review: eng.mechanics.intro | sonnet | n/a | n/a | n/a | accepted with fixes (sling with a reason, rigger no longer hides lit parts, steel rack in view); merged v317 |
| 15 Nov | Build: Engineering intro eng.process.intro | sonnet | 95 | 17 min | 332,941 | accepted with fixes by its review |
| 15 Nov | Voice fix PM-26: G-code, werkstuknulpunt, centreerboor, lektest; re-render two Dutch tracks | sonnet | n/a | n/a | n/a | accepted; listen guard passed; merged v318 |
| 15 Nov | Review: eng.process.intro | sonnet | 55 | 7.5 min | 193,840 | accepted with fixes (processchema replaces apparaatcode as tool, unit operations named, sacks given a reason); merged v318 |
| 15 Nov | Build: Engineering intro eng.drawings.intro | sonnet | 144 | 25 min | 367,315 | accepted with fixes by its review |
| 15 Nov | Review: eng.drawings.intro | sonnet | 61 | 9.5 min | 209,918 | accepted with fixes (tags shown only when named, PID-regelaar "gebruiken", start line); merged v320 |
| 15 Nov | Build: Engineering intro eng.gridbasics.intro | sonnet | 120 | 17 min | 344,365 | accepted with fixes by its review |
| 15 Nov | Review: eng.gridbasics.intro | sonnet | 75 | 9.6 min | 203,161 | accepted with fixes (inverter and panels dropped for kVA, one tool per topic 2 and 3, hedges, operator up to the meter); merged v321 |
| 15 Nov | Build: Engineering intro eng.transformers.intro | sonnet | 98 | 14 min | 317,868 | accepted with fixes by its review |
| 15 Nov | Review: eng.transformers.intro | sonnet | 73 | 8.8 min | 221,564 | accepted with fixes (scene 5 camera, opening group words, reason for cooling ribs, Expert line to lesson titles); merged v322 |
| 15 Nov | Render PM-27: joining, moulding, mechanics, process intros | sonnet | 69 | 63 min | 150,374 | accepted; two Dutch comma pauses reworded; several words heard poorly (vuleenheid, MIG, spuitgieten, unit operations, hardheidsmeting, FEM-plot); merged v323 |
| 15 Nov | Build: Engineering intro eng.switchgear.intro | sonnet | 91 | 17 min | 286,880 | accepted with fixes by its review |
| 15 Nov | Review: eng.switchgear.intro | sonnet | 72 | 13 min | 221,025 | accepted with fixes (hall B agrees with field film and transformers intro, RMU said of a netstation, installer tests the relay, you touch nothing); merged v323 |
| 15 Nov | Build: Engineering intro eng.power.intro | sonnet | 68 | 12 min | 291,182 | accepted with fixes by its review |
| 15 Nov | Review: eng.power.intro | sonnet | 62 | 9.3 min | 176,121 | accepted with one fix (the drawn 10 % label now said in the narration); merged v324 |
| 15 Nov | Build: Engineering intro eng.fluids.intro | sonnet | 113 | 19 min | 370,127 | accepted with fixes by its review |
| 15 Nov | Review: eng.fluids.intro | sonnet | ~75 | n/a | n/a | accepted with fixes (exchanger moved off the motor and hose so hall B agrees, Moody gives the friction factor, hedges, curves cross at the duty point); merged v326 |
| 15 Nov | Build: Engineering intro eng.gridops.intro | sonnet | 85 | 16 min | 329,591 | accepted with fixes by its review |
| 15 Nov | Review: eng.gridops.intro | sonnet | ~45 | n/a | n/a | accepted with fixes (Gevorderd risk beat cut, planner renamed werkvoorbereider, dark hall hedged, drawn labels named); merged v327 |
| 15 Nov | Build: Engineering intro eng.gridplanning.intro | sonnet | 97 | 17 min | 354,264 | accepted with fixes by its review |
| 15 Nov | Review: eng.gridplanning.intro | sonnet | ~60 | n/a | n/a | accepted with fixes (dashed cable given a reason, design topic one tool, CSC chip with full word, labels named, camera); merged v328 |
| 15 Nov | Build: Engineering intro eng.itbasics.intro | sonnet | 115 | 17 min | 326,712 | accepted with fixes by its review |
| 15 Nov | Review: eng.itbasics.intro | sonnet | 85 | 10.6 min | 204,465 | accepted with fixes (seven tools to four, firewall left to cyber, virtuele machine and query, two SAY rules dropped, you at the field-film spot); merged v329 |
| 15 Nov | Voice fix PM-28: vuleenheid, frame, spuitgieten, spuit/sluitunit, hardheidsmeting; eight Dutch tracks re-rendered | sonnet | 115 | 83 min | 241,358 | accepted; all guards passed; MIG, FEM-plot, positioner, Spuitgieten still misheard by Whisper (left, Merijn 15 Nov); merged v330 |
| 15 Nov | Build: Engineering intro eng.ot.intro | sonnet | 98 | 16 min | 359,992 | accepted with fixes by its review |
| 15 Nov | Review: eng.ot.intro | sonnet | 61 | 8.7 min | 214,442 | accepted with fixes (eight tools to four, patching left to cyber, 203 to 182 s, labels only when named, three SAY rules dropped); merged v331 |
| 15 Nov | Build: Engineering intro eng.cyber.intro | sonnet | 102 | 18 min | 377,465 | accepted with fixes by its review |
| 15 Nov | Review: eng.cyber.intro | sonnet | 72 | 9.5 min | 195,743 | accepted with fixes (ways-in beat and board sentence cut, 191 to 181 s, law card as narrated, usb rule dropped); merged v332 |
| 15 Nov | Proposal: Task 14 two Projects modules (pm.approach, pm.formats) | opus | 46 | 8.3 min | 207,331 | proposal written; seven questions to Merijn |
| 15 Nov | Build: Engineering intro eng.lines.intro | sonnet | 45 | 8 min (after resume) | 304,429 | commit blocked by the permission check; committed by the integrator with Merijn's OK; accepted with fixes by its review |
| 15 Nov | Review: eng.lines.intro | sonnet | ~60 | ~25 min | n/a | accepted with fixes (signaalzuil replaces transportband, 198 to 191 s, labels named); merged v335 |
| 15 Nov | Render PM-29: nine Engineering intros (drawings, seven energy, itbasics) | sonnet | 78+ | 2 h 15 min incl. limit pause | 182,923 | accepted; 18 guards passed; one gridplanning line shortened for a cue split; 9 of 37 tool words heard poorly (not chased); merged v336 |
| 15 Nov | Build: Engineering intro eng.industry40.intro | sonnet | 83 | 13 min | 309,448 | accepted with fixes by its review |
| 15 Nov | Review: eng.industry40.intro | sonnet | ~75 | n/a | n/a | accepted with small fixes (unit lit with its card, wèrhaus spelling, en wording, Expert title); merged v337 |
| 15 Nov | Build: Task 14 module pm.approach | sonnet | 116 | 28 min | 447,090 | accepted with fixes by its review |
| 15 Nov | Review: pm.approach | opus | 112 | 15 min | 314,632 | accepted with fixes (PMBOK, Microsoft and ASQ facts corrected to sources, shared definitions identical, eight giveaway answers rebalanced, Dutch); merged v338 |
| 15 Nov | Voice PM-30: Radical Candor (Rèddikal Kender), MORE PIES (More paiz) in pm.lead.intro; Dutch track re-rendered | sonnet | 54 | 36 min | 160,917 | accepted; guard passed; same MORE PIES fix for pm.intake.firsttalk and pm.outside.jargon left for the next Projects render batch (integrator decision); merged v339 |

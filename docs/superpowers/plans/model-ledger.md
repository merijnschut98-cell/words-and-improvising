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
| 14 Nov | Build: Projects map on subject home (Task 7) | sonnet | n/a | n/a | n/a | delivered; in review (opus); report recovered after a container restart |
| 14 Nov | Build: calmer speaking home (Task 12 part 1) | sonnet | 21 | 4 min | 127,489 | delivered; in review (opus) |
| 14 Nov | Kit: short films (Task 4a) | sonnet | 29 | 4 min | 118,631 | accepted with one fix by its review |
| 14 Nov | Review: short films (4a) | opus | 47 | 11 min | 146,005 | accepted; found the video floor too high for the Dutch voice; ran a 30 s film through the real guard |
| 14 Nov | Add tool names to the two overview films | sonnet | 94 | 14 min | 248,878 | accepted with changes by its review (an Expert term swapped, lists of three cut to two) |
| 14 Nov | Review: Projects map on home (first run) | opus | n/a | 53 min | n/a | stopped by an accidental interruption after committing two fixes; finished by a fresh opus agent |
| 14 Nov | Review: calmer speaking home (first run) | opus | 77 | 48 min | 167,331 | stopped by an accidental interruption after committing fixes; finished by a fresh opus agent |
| 14 Nov | Review: tool names in two films (first run) | sonnet | n/a | 10 min | n/a | stopped by an accidental interruption; restarted fresh on sonnet |
| 14 Nov | Review: tool names in two films (restart) | sonnet | n/a | n/a | n/a | accepted; merged into the render branch |

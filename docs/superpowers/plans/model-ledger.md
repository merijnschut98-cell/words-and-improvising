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

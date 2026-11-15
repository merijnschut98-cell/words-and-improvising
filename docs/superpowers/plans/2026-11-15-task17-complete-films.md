# Task 17: complete the films that drop lesson points (design and plan, 15 Nov 2026)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax. Every Agent call carries a `model` (CLAUDE.md).

**Goal.** Every lesson point of every lesson that is wired to a film is in that film, so the learner, for whom the film replaces the reading step, sees all of it; and a kit check keeps it that way.

**Inputs.** Plan Task 17 and "Merijn's answers, 14 Nov evening" in `2026-11-13-v17-big-picture.md` ("complete films with one short extra scene per lesson point they skip; longer where needed, no more"); the film length review `../reviews/2026-11-14-film-length-review.md` and its eight batch files; film rules and the short-film kit in `2026-11-11-v16-notes.md`; the kit (`films/_kit/assert.mjs`, `build-film.mjs`, `listen-guard.mjs`), `src/core/course.js` (`lessonPhases`), `src/ui/film.js` (`filmStep`), `tests/filmcontent.test.js`, `tests/filmvideo.test.js`. Repo state: `claude/improvisation-practice-game-voon91` at v292 (5dd6dcd).

**Inventory files (next to the review).** `../reviews/2026-11-15-task17-gaps.csv`: one row per lesson point a film does not fully carry (1,009 rows: film, action, lesson, level, point id, status, the sentences not found, the numbers not found). `../reviews/2026-11-15-task17-films.json`: one entry per lesson film (96): measurements, point counts per lesson, the reviewers' count, the estimate, the projected lengths, the action and, for a split, the estimated length of each new film. Scripts (not shipped): `/tmp/claude-0/-home-user-words-and-improvising/de95cd30-5a1c-53de-8618-a52c37ead79e/scratchpad/task17/` (`inventory.mjs`, `calib.mjs`, `plan.mjs`, `split.mjs`, `export.mjs`, `table.mjs`); the algorithm is written out in section 1 so the kit step can port it.

---

## 0. What the repo says (evidence)

- **The film replaces the reading.** `lessonPhases` (`src/core/course.js:439`): a lesson with `film` gets `pre`, `film`, `quiz`; without it `teach` and `example`. "Lees mee" (`readAlong` in `src/ui/film.js`) shows the film's script, not the lesson text. The lesson text only appears when the film fails to load (`asText`). So a point the film does not say or show is not seen.
- **Every lesson of a topic plays the whole film from the start.** Lessons wire `film: '<id>'` without a start scene (only `pm.intake.firsttalk#5` has one), and `filmStep` starts at scene 1. A Basis learner on a four-lesson film sees the Expert scenes too, and the Expert learner rewatches the Basis scenes. One film per lesson (a split) also fixes this.
- **Terms are not the problem.** The kit already requires a `{t:}` cue for every term of every served lesson at or below its level, or a `skip` with a reason (`checkFilm`, coverage). Of 1,201 terms in the 96 lesson films, 1,184 have a cue and the 17 without one are all skipped as the same term of another served lesson (checked: every skip reason is "same term as ... of <other served lesson>, named with its cue in scene n"). The gaps are in the teach blocks and the worked examples, which no check covers.
- **The limits that bind (today).**
  - `MAX_SCENES` 9 (`assert.mjs:12`); 73 of the 96 films have 8 or 9 scenes.
  - `MAX_TOTAL` 300 s, the designed scene lengths (`assert.mjs:14`); 45 films are at 290 to 300 s designed.
  - `NARRATION_MAX` 330 s at 2.5 words a second, so about 825 words (`assert.mjs:19`).
  - The rendered video: at most 360 s per language (`tests/filmvideo.test.js:658`; the v16 notes call it a guard limit, the listen guard itself checks pauses and WER). English is the binding language: the English voice reads the same script slower (median 6 % longer); 33 of the 87 rendered films are at 340 s or more in English, 9 of them at 355 to 359 s.
  - Page size: hard cap 450 KB (`MAX_BYTES`, enforced by the build and the content test); target 300 KB (`TARGET_BYTES`, the build prints a warning). 9 of the films to change are already over the target (eng.machining.overview 345 KB, eng.joining.arc 325 KB, eng.moulding.cycle 324 KB, cnc, spot, production, milling, drilling, tooling 303 to 319 KB).
  - The narration guard (`checkNarration`) and the label check (`checkLabels`) run only on module and field films. Run on today's lesson films, all 96 fail `checkNarration` (4,094 symbol or colon hits, mostly `%`, `=`, `(`, `:` in calculation narration that `spokenOf` turns into words; 686 sentences with more than two commas) and 65 fail `checkLabels` (legacy stages do not use `tr('nl','en')`). So neither can be switched on for a whole lesson film; they can be switched on for the beats and the stage code a builder adds (section 2).
- **Task 18 is done** (v259): devices, air, orderflow and TPM were trimmed and TPM got its people point. Their trim room is now 0 in the projections.

## 1. Inventory: which films drop which points

### 1.1 Definition of a lesson point

A lesson point is one of these, per lesson wired to the film (`lesson.film`, start scene stripped):

| Kind | Id | Unit | Mechanical? |
|---|---|---|---|
| Term | `<lesson>#<index>` (as today) | each `terms[i]` | Yes, existing coverage rule (cue at or below the lesson's level, or skip with a reason). Unchanged. |
| Teach block | `t<i>.<j>` | `teach[i-1]` split on blank lines, chunk `j` | The claim is mechanical (section 3); whether the beat says the chunk's key claim is judgement. |
| Example set-up | `ex.text.<j>` | `example.text` split on blank lines | As above; its numbers are mechanical. |
| Example question | `ex.ask` | `example.ask` | As above. |
| Example answer | `ex.reveal.<j>` | `example.reveal` split on blank lines | As above; every step's numbers are mechanical. |

"Carried" means: a beat of the film says it (voice), or its caption shows it while the beat runs (a beat lasts at least 4 s, the kit's per-beat rule), with the numbers the point depends on spoken or shown. A paraphrase that keeps the claim counts. A chunk is the author's unit: one claim with its support (typically two to four sentences); a chunk whose sentences make two separate claims needs both.

Where judgement is needed: whether a paraphrase keeps the claim; whether a caption-only number is enough (the rubric: a number shown on a card is carried); an aside inside a chunk (a source, a year, an origin) that a reviewer may count as its own point. The kit can check that each point is claimed by a beat, that the claim still matches the lesson text, and that the claiming beat shares the point's numbers and some of its words; a review agent checks the meaning.

### 1.2 How the inventory was made

`inventory.mjs` reads every lesson film page (`readFilmData`), the lessons it serves (`loadModule`, nl), the manifest (rendered lengths) and the stage script (strings, as stand-in for card text). For each point it splits the chunk into sentences and calls a sentence carried when (a) at least half of its distinctive numbers (decimals and integers above 12; Dutch "12.000" and "0,42" normalised) occur in the film's nl voice, captions or stage strings, and (b) at least 50 % of its content words, weighted by rarity across all 6,552 lesson sentences (IDF; words of 5+ letters outside a stoplist, stemmed to 6 letters), occur there. A chunk is `carried` (all sentences), `partial` or `missing` (none).

Calibration against the eight reviewers' hand counts (74 films with a count): Spearman 0.92, Pearson 0.92. The tool counts about 2.6 sentences per reviewer point (least squares: reviewer points = 0.381 × tool sentences): it works per sentence and flags paraphrases and asides that a reviewer lets pass. Every film the reviewers put at 15 or more missing points has at least 25 tool sentences missing; no film at 0 reviewer points has more than 5. The estimate used below is the reviewers' count where there is one, else 0.381 × tool sentences (rounded).

Totals over the 96 lesson films: 2,998 teach and example points, 278 chunks missing, 731 partial, 1,349 of 6,552 sentences not found; 1,201 terms, all covered or skipped as duplicates.

### 1.3 The projection and the action per film

For each film: added words = 10 per missing point (one short sentence; a 4 s beat carries one or two points); projected length per language = today's rendered length + added words × that film's own seconds per word in that language (unrendered films: the corpus average, 2.27 nl and 2.26 en words a second by the same word count). Trim room = the "saving %" of the length review's trim-only version (0 for the four Task 18 films). Target: English at most 350 s (10 s under the 360 s cap, for the stop pauses a new sentence adds and for voice variance on re-render).

- **extend**: the completed film stays at or under 350 s in English and needs at most 12 scenes.
- **extend+room**: it would pass 350 s, but the gap is small (at most 5 points, or at most 8 and the review's listed trims bring it under 350 s): add the points and make room by cutting the restatement, frame and decor beats the length review lists for that film, then by rewording; never by dropping a point.
- **split**: otherwise. One film per lesson (estimated 72 to 214 s in English each; none over 350 s); see 2.4.
- **none**: no point missing by the reviewers' count and at most 5 tool sentences. A sample shows paraphrases and small asides the reviewers judged "none of substance" (eng.gridbasics.congestion: where most outages start, who owns TenneT; eng.mechanics.load: a floor question about the WLL label). Under Merijn's rule an aside is still a point, so step N decides each with the claims: a claim, or the film moves to extend. If nothing turns up, only the claims of section 3 are added; no narration change, no render.

### 1.4 Result

| Action | Films | Lessons served | Est. missing points | Rendered now |
|---|---|---|---|---|
| split | 27 | 101 | 380 | 25 |
| extend | 19 | 38 | 80 | 19 |
| extend+room | 18 | 48 | 48 | 16 |
| none | 32 | 44 | 0 | 27 |
| **total** | **96** | **231** | **508** | **87** |

Per film, worst first (64 films that change; "review / tool": the reviewers' count, then the tool's chunks missing + partial and sentences missing; "completed en s": projected English length with the points added, in brackets after the review's trims; "split" lists the estimated English length of each new one-lesson film in lesson order):

| # | Film | Lessons served (level) | Missing points: review / tool (chunks missing + partial, sentences) | Rendered | Now nl / en s | Scenes | KB | Completed en s (after trims) | Action |
|---|---|---|---|---|---|---|---|---|---|
| 1 | eng.machining.cnc | machining.cnc (1), machining.gcode (2), machining.offsets (3), machining.cam (4) | 31 / 11+31, 64 | yes | 244 / 271 | 7 | 319 | 417 (409) | split: 142 / 88 / 119 / 90 s |
| 2 | eng.joining.arc | joining.arc (1), joining.weldparams (2), joining.wps (3), joining.metallurgy (4) | 30 / 19+19, 72 | yes | 271 / 301 | 9 | 325 | 438 (429) | split: 177 / 105 / 103 / 98 s |
| 3 | eng.joining.defects | joining.defects (1), joining.inspection (2), joining.ndt (3), joining.weldrca (4) | 24 / 12+14, 43 | yes | 356 / 354 | 9 | 279 | 460 (446) | split: 155 / 108 / 113 / 96 s |
| 4 | eng.machining.drilling | machining.drill (1), machining.holes (2), machining.deephole (3), machining.holequality (4) | 22 / 15+22, 55 | yes | 233 / 270 | 8 | 314 | 369 (364) | split: 100 / 107 / 102 / 106 s |
| 5 | eng.joining.spot | joining.spot (1), joining.spotwear (2), joining.spotquality (3), joining.spotlobe (4) | 20 / 9+16, 38 | yes | 285 / 311 | 8 | 319 | 402 (396) | split: 183 / 74 / 93 / 84 s |
| 6 | eng.joining.bolting | joining.bolts (1), joining.bolting (2), joining.tightening (3), joining.jointdesign (4) | 19 / 5+16, 25 | yes | 340 / 356 | 9 | 260 | 444 (433) | split: 114 / 160 / 91 / 88 s |
| 7 | eng.lines.robots | lines.robotbasics (1), lines.robots (2), lines.robotcell (3), lines.vision (4) | 18 / 7+16, 29 | yes | 312 / 340 | 9 | 277 | 415 (398) | split: 129 / 101 / 110 / 92 s |
| 8 | eng.joining.bonding | joining.bonding (1), joining.adhesives (2), joining.rivets (3), joining.choosejoint (4) | 17 / 6+21, 34 | yes | 318 / 342 | 8 | 269 | 416 (399) | split: 152 / 110 / 101 / 92 s |
| 9 | eng.lines.design | lines.linebasics (1), lines.layout (2), lines.buffers (3), lines.simulation (4) | 16 / 11+16, 36 | yes | 304 / 329 | 9 | 292 | 399 (389) | split: 131 / 99 / 99 / 110 s |
| 10 | eng.lines.errorproof | lines.errors (1), lines.pokayoke (2), lines.sensors (3), lines.detection (4) | 16 / 7+17, 30 | yes | 294 / 318 | 9 | 249 | 387 (371) | split: 145 / 100 / 75 / 102 s |
| 11 | eng.machining.turning | machining.cutting (2), machining.turnfinish (3), machining.turncell (4) | 15 / 9+23, 46 | yes | 227 / 259 | 8 | 289 | 327 | extend |
| 12 | eng.lines.control | lines.plc (1), lines.safety (2), lines.oee_auto (3), lines.stoppages (4) | 14 / 10+15, 38 | yes | 327 / 346 | 9 | 289 | 409 (399) | split: 146 / 122 / 89 / 107 s |
| 13 | eng.machining.measuring | machining.quality (2), machining.metrology (3), machining.capable (4) | 14 / 7+12, 27 | yes | 308 / 329 | 9 | 295 | 390 (370) | split: 190 / 116 / 107 s |
| 14 | eng.machining.tooling | machining.toolbasics (1), machining.tools (2), machining.toollife (3), machining.toolcost (4) | 14 / 7+26, 46 | yes | 289 / 312 | 9 | 303 | 376 (366) | split: 163 / 101 / 76 / 103 s |
| 15 | eng.machining.milling | machining.mill (1), machining.millfeeds (2), machining.millstrategy (3), machining.fiveaxis (4) | 14 / 6+22, 39 | yes | 232 / 259 | 7 | 317 | 320 | extend |
| 16 | eng.moulding.defects | moulding.defects (1), moulding.diagnose (2), moulding.warpage (3), moulding.defectdata (4) | 12 / 5+23, 39 | yes | 316 / 341 | 9 | 254 | 393 (373) | split: 148 / 132 / 75 / 102 s |
| 17 | eng.moulding.cycle | moulding.cycle (1), moulding.cooling (2), moulding.cavities (3), moulding.partcost (4) | 12 / 14+19, 49 | yes | 250 / 277 | 8 | 324 | 330 (310) | extend |
| 18 | eng.joining.production | joining.weldcell (1), joining.fixturing (2), joining.arcon (3), joining.weldsystem (4) | 11 / 8+15, 31 | no | (311 / 350 est.) | 8 | 319 | 399 (388) | split: 132 / 114 / 122 / 84 s |
| 19 | eng.lines.variants | lines.variants (1), lines.linechange (2), lines.mixed (3), lines.sequencing (4) | 11 / 4+18, 26 | yes | 325 / 346 | 8 | 276 | 394 (380) | split: 110 / 102 / 116 / 119 s |
| 20 | eng.maintenance.failure | maintenance.strategies (1), maintenance.failure (2), maintenance.condition (3) | 11 / 11+14, 37 | yes | 301 / 326 | 8 | 284 | 373 (357) | split: 141 / 132 / 147 s |
| 21 | eng.moulding.setting | moulding.setup (1), moulding.process (2), moulding.scientific (3), moulding.validation (4) | 10 / 16+19, 51 | yes | 265 / 287 | 9 | 293 | 331 (305) | split: 181 / 85 / 77 / 80 s |
| 22 | eng.moulding.materials | moulding.materials (1), moulding.polymers (2), moulding.drying (3), moulding.fillers (4) | 9 / 8+21, 43 | no | (306 / 340 est.) | 9 | 272 | 380 (353) | split: 169 / 102 / 97 / 96 s |
| 23 | eng.moulding.moulds | moulding.tooling (1), moulding.mouldparts (2), moulding.mouldcare (3), moulding.newmould (4) | 9 / 8+16, 29 | yes | 312 / 331 | 8 | 229 | 369 (356) | split: 104 / 158 / 90 / 72 s |
| 24 | eng.quality.tolerance | quality.tolerance (1), quality.variation (1), quality.capability (2) | 8 / 4+12, 18 | yes | 339 / 359 | 9 | 233 | 398 (380) | split: 158 / 135 / 140 s |
| 25 | eng.moulding.machine | moulding.machine (1), moulding.screw (2), moulding.clamp (3), moulding.electric (4) | 8 / 7+17, 34 | yes | 338 / 359 | 8 | 290 | 394 (379) | split: 165 / 105 / 94 / 105 s |
| 26 | eng.power.motor | power.basics (1), power.motors (1) | 8 / 3+9, 16 | yes | 318 / 350 | 9 | 283 | 389 (354) | split: 214 / 194 s |
| 27 | pm.perform.tree | perform.kpis (1), perform.tree (2), perform.targets (2), perform.gaming (2) | 8 / 3+14, 18 | yes | 348 / 348 | 8 | 249 | 386 | split: 108 / 116 / 102 / 111 s |
| 28 | eng.quality.spc | quality.spc (2), spc.tampering (2), spc.charts (2) | 8 / 6+14, 24 | yes | 303 / 335 | 9 | 279 | 372 (355) | split: 183 / 122 / 113 s |
| 29 | eng.drawings.reading | drawings.views (1), drawings.gdt (2) | 7 / 2+10, 19 | yes | 303 / 320 | 8 | 224 | 350 (331) | extend |
| 30 | pm.negotiate.batna | negotiate.interests (1), negotiate.batna (2), negotiate.anchor (1), negotiate.no (1) | 6 / 4+12, 19 | yes | 345 / 351 | 9 | 272 | 379 | split: 122 / 119 / 103 / 96 s |
| 31 | pm.intake.firsttalk | intake.ask (1), intake.firsttalk (2), lead.listen (1) | – / 3+11, 16 | yes | 337 / 343 | 9 | 266 | 370 (360) | split: 143 / 154 / 114 s |
| 32 | eng.ot.isa95 | ot.levels (1), ot.systems (1), ot.purdue (2) | 5 / 2+13, 16 | yes | 322 / 345 | 9 | 276 | 366 (345) | extend+room |
| 33 | eng.safety.loto | safety.loto (1) | 5 / 2+2, 5 | yes | 299 / 312 | 7 | 286 | 331 (294) | extend |
| 34 | eng.safety.permit | safety.permit (3), safety.lmra (2) | 5 / 7+6, 16 | yes | 284 / 301 | 7 | 269 | 322 (295) | extend |
| 35 | pm.portfolio.prioritise | portfolio.programme (1), portfolio.prioritise (1), portfolio.capacity (2) | 4 / 1+12, 15 | yes | 336 / 344 | 9 | 249 | 362 | extend+room |
| 36 | eng.machining.overview | machining.processes (1) | – / 1+6, 10 | yes | 213 / 238 | 8 | 345 | 256 (239) | extend |
| 37 | eng.switchgear.fiverules | switchgear.safety (1), gridops.switching (2), safety.nen3140 (2) | 3 / 0+10, 10 | no | (349 / 365 est.) | 9 | 238 | 378 (356) | extend+room |
| 38 | pm.scaled.pi | scaled.why (1), scaled.piplanning (2), scaled.roles (3) | 3 / 1+8, 10 | yes | 346 / 358 | 9 | 271 | 372 | extend+room |
| 39 | pm.stuck.diagnose | stuck.diagnose (1), stuck.experiment (3), stuck.reset (3) | 3 / 2+7, 9 | yes | 358 / 357 | 9 | 252 | 372 | extend+room |
| 40 | eng.gridbasics.load | gridbasics.basics (1), gridbasics.load (2) | 3 / 0+5, 6 | yes | 323 / 356 | 9 | 248 | 370 (342) | extend+room |
| 41 | pm.land.adoption | land.change (1), land.resistance (2), land.communication (3) | 3 / 5+5, 10 | yes | 347 / 351 | 9 | 283 | 365 | extend+room |
| 42 | pm.agile.backlog | agile.stories (1), agile.refine (2), agile.points (3) | 3 / 1+5, 7 | yes | 336 / 344 | 9 | 264 | 358 (348) | extend+room |
| 43 | pm.lead.feedback | lead.feedback (1), perform.dialogue (1), negotiate.senior (3) | 3 / 1+4, 7 | yes | 343 / 342 | 9 | 243 | 356 | extend+room |
| 44 | pm.plan.wbs | intake.done (1), plan.wbs (1), plan.estimate (1) | 3 / 0+16, 17 | yes | 338 / 341 | 9 | 241 | 354 | extend+room |
| 45 | pm.intake.stakeholders | intake.stakeholders (1), lead.influence (3), plan.raci (2) | – / 1+6, 7 | yes | 334 / 334 | 9 | 238 | 347 (337) | extend |
| 46 | pm.itproject.migration | itproject.rollout (1), itproject.migration (2) | 3 / 0+2, 2 | yes | 307 / 328 | 9 | 247 | 341 | extend |
| 47 | eng.gridplanning.loadflow | gridplanning.loadflow (2), gridplanning.redundancy (3) | 2 / 1+7, 11 | yes | 346 / 357 | 9 | 271 | 366 (355) | extend+room |
| 48 | pm.run.escalation | run.status (1), run.decisions (2), portfolio.governance (1) | 2 / 1+4, 7 | yes | 359 / 357 | 9 | 239 | 366 | extend+room |
| 49 | eng.mechanics.tensile | mechanics.strength (1) | – / 0+3, 4 | yes | 315 / 353 | 6 | 208 | 362 (316) | extend+room |
| 50 | pm.agile.kanban | agile.board (1), agile.wip (2), agile.flowmetrics (3) | – / 0+4, 4 | yes | 343 / 350 | 9 | 218 | 359 (345) | extend+room |
| 51 | pm.agile.scrum | agile.scrumbasics (1), agile.events (2), agile.artefacts (3) | – / 0+5, 5 | yes | 333 / 349 | 9 | 264 | 358 (347) | extend+room |
| 52 | pm.consult.proposal | consult.proposal (1), consult.pricing (2) | – / 0+6, 6 | yes | 335 / 344 | 9 | 251 | 353 (346) | extend+room |
| 53 | pm.run.rhythm | run.rhythm (1), intake.start (2), perform.rhythm (2) | 2 / 2+7, 9 | yes | 338 / 342 | 9 | 276 | 351 | extend+room |
| 54 | pm.land.handover | land.handover (4), close.acceptance (1), land.sustain (1) | 2 / 0+4, 5 | yes | 336 / 332 | 9 | 248 | 341 | extend |
| 55 | eng.switchgear.devices | switchgear.devices (1), switchgear.installations (1) | 2 / 2+5, 10 | yes | 291 / 310 | 8 | 221 | 319 | extend |
| 56 | eng.gridplanning.flex | gridplanning.flex (2), gridplanning.storage (3) | 1 / 0+7, 7 | no | (317 / 348 est.) | 9 | 282 | 352 (341) | extend+room |
| 57 | pm.outside.steering | outside.progress (1), outside.decide (2) | 1 / 0+0, 0 | yes | 340 / 341 | 9 | 244 | 346 | extend |
| 58 | pm.outside.jargon | outside.fail (2), outside.jargon (4) | 1 / 0+2, 2 | yes | 324 / 338 | 9 | 240 | 342 (329) | extend |
| 59 | pm.itproject.mvp | itproject.requirements (1), itproject.mvp (2) | 1 / 0+3, 3 | yes | 323 / 332 | 9 | 247 | 336 | extend |
| 60 | eng.gridops.outage | gridops.outage (1) | – / 0+2, 2 | yes | 296 / 316 | 7 | 275 | 320 (285) | extend |
| 61 | eng.power.hydraulics | power.hydraulics (2) | – / 0+3, 3 | yes | 284 / 314 | 7 | 215 | 318 (299) | extend |
| 62 | eng.power.drives | power.drives (1) | – / 0+2, 2 | yes | 289 / 309 | 9 | 282 | 313 (273) | extend |
| 63 | eng.mechanics.fatigue | mechanics.fatigue (1) | – / 0+2, 2 | yes | 265 / 298 | 6 | 198 | 302 (266) | extend |
| 64 | eng.maintenance.tpm | maintenance.tpm (1) | 1 / 0+2, 2 | yes | 268 / 291 | 8 | 275 | 295 | extend |

No change except the claims (section 3): eng.gridbasics.congestion, pm.outside.questions, eng.switchgear.protection, pm.agile.forecast, eng.gridbasics.path, eng.transformers.principle, pm.outside.disagree, eng.mechanics.load, pm.scaled.hybrid, eng.machining.workholding, pm.devops.pipeline, pm.outside.experts, pm.itproject.uat, eng.switchgear.automation, eng.mechanics.heattreat, pm.run.scope, eng.process.plant, pm.plan.schedule, eng.process.batch, eng.process.measure, pm.land.training, eng.ot.orderflow, pm.itproject.cutover, pm.portfolio.benefits, pm.lead.difficult, pm.close.results, eng.power.air, pm.plan.risk, pm.run.conflict, pm.devops.postmortem, pm.plan.method, pm.devops.incident (tool sentences flagged: 0 to 5; the claims pass will confirm each, and any real gap moves the film to extend).

Notes on the table:
- eng.maintenance.tpm (1) and eng.switchgear.devices (2) are the reviewers' counts from before Task 18; TPM's missing point was added there. The claims pass decides whether anything is left.
- pm.outside.steering: the review counts one partial point (the milestone list of example 1) that the tool does not see because the milestones are on a card; a review judgement.
- Four films to change are not rendered yet (eng.joining.production, eng.moulding.materials: split; eng.switchgear.fiverules, eng.gridplanning.flex: extend+room). Completing them before their first render costs no extra render.

## 2. The extra scene

### 2.1 Where, how long, what it shows

- **Where.** Directly after the last scene of the lesson whose points it carries, at that lesson's level (`level`), so the film keeps the lesson order and level coverage stays right. One extra scene per lesson that has gaps (decision D1); points that belong mid-argument (a missing step inside a worked example) go as a beat into the scene that has the rest of the example instead, so the example reads in order.
- **How long.** As long as its points need: one beat per point (at least 4 s, the kit's per-beat rule), typically 2 to 5 beats, 15 to 40 s; no opening, no recap, no "en verder" frame. Merijn: "longer where needed, no more".
- **Room and cast.** The film's own `stage.js`: the same room, the same drawn objects and the same people, a new camera position or zoom on the part the point is about, and new `data-cue` groups only for what the point names. A worked-example step goes on a card labelled voorbeeld (or schema for a rule), as the film's existing cards. No new room, no new cast.
- **Narration.** Lesson words, one point per sentence; numbers as the lesson gives them (`{n:}` checked against the lesson text); terms with a `{t:}` cue (first Dutch use glossed once). Nothing new beyond the lesson; the example's question is asked and answered once.

### 2.2 Kit checks that apply to the new scene

| Check | Today | For the new beats and scene |
|---|---|---|
| Term cue, numbers against the lesson, captions ≤ 110 characters, 4 s per beat, Dutch term not in English | whole film | unchanged, whole film |
| Narration guard (`checkNarration`) | module and field films only; all 96 lesson films would fail it | on the added beats only, in a lesson-film variant: no colon, no parentheses or quotes, at most two commas in a sentence, the Dutch misread list; digits, `%` and units stay allowed because `spokenOf` turns them into words (tests/filmvideo.test.js: "units, signs, money and whole decimals as words") |
| Label fit (`checkLabels`) | module and field films only; 65 lesson films would fail it | on the stage function the builder adds for the new scene (its source passed as `stageText`): every new label a `tr('nl','en'[, room])` pair, wrapped with the kit's `wrapUnits` |
| Focus (`strictFocus`) | 41 of 96 films strict | the new beats always carry `focus` (keys of the stage's cue groups); the rest of a legacy film stays as it is |
| Stage text ≥ 22 units | rule for rendered films | every new drawn text |
| Page size | 450 KB hard, 300 KB target (warning) | hard cap unchanged; an extended page grows at most 25 KB; a split page stays under 300 KB (the build's warning becomes a failure for pages whose data says `points`; see section 3) |
| Listen guard at render | pauses ≤ 0.4 s inside a sentence, 0.4 to 0.9 s at a full stop, cues match words, WER ≤ 15 % | unchanged, whole film |
| 360 s per language | `tests/filmvideo.test.js` | unchanged; the builder targets ≤ 350 s English by the film's own words-per-second |

The beat-scoped narration and label checks need a small kit option (`defineFilm({ ..., checkScope: { scenes: ['s4b'], stageFns: ['extraOffsets'] } })`): the build runs the lesson-film narration guard on the beats of those scenes and `checkLabels` on those stage functions. Part of step K (section 6).

### 2.3 Length limits that block extension today

`MAX_TOTAL` 300 s (designed) and `NARRATION_MAX` 330 s (about 825 words) were set for the old "3 to 5 minutes" rule; the cap that matters is the rendered 360 s per language. With them, eng.ot.isa95, the pm films at 300 s designed and eng.safety.loto (834 words after completion) cannot be extended at all. Proposal for step K: `MAX_TOTAL` 360, `NARRATION_MAX` 360 (900 words at 2.5 a second), `MAX_SCENES` 12. The 25 s / 2 scenes / 25 s narration floors stay, and so does every readability check. With 12 scenes 17 extend+room films at 9 scenes can take their extra scene; without it (D1 option C) their points go as beats into existing scenes.

### 2.4 Split rule

Split a film when, with its missing points added and the review's listed trims made, its English video would pass 350 s, or it would need more than 12 scenes; not when the gap is 5 points or fewer (those are absorbed by rewording). A split makes **one film per wired lesson** (D2):

- Id: the lesson id (unique; no lesson id is a film id today except where the film already carries that lesson's name). The lesson whose id the old film has keeps it (17 of 27: e.g. `eng.machining.cnc` stays the cnc lesson's film and its Supabase folder is overwritten on render). The other 10 old ids (eng.machining.drilling, measuring, tooling; eng.lines.design, errorproof, control; eng.joining.production; eng.moulding.setting, moulds; eng.power.motor) are retired: page, VTTs and poster leave the repo and the SHELL, the manifest entry goes, the storage objects are deleted after the new videos are live.
- Room: the split films share the old film's room and cast, imported, not copied (as `films/_pm/world.mjs` and `films/pm.agile.scrum/cast.mjs`): move the drawing helpers into `films/<old id>/room.mjs` and give each split film its own `build.mjs` and `stage.js`.
- Content: the old film's scenes of that lesson, the missing points, and a short opening (about 30 words, already in the estimate) that sets the scene the earlier lessons' scenes used to set. No recap of the lower level's lesson.
- Wiring: `film` on the lesson in nl and en; the start-scene ref of pm.lead.listen (`pm.intake.firsttalk#5`) goes. Tests that name a split film (tests/film.test.js: eng.quality.spc; tests/filmvideo.test.js: pm.perform.tree) are updated in the same build.
- Lengths (estimated, English): 72 to 214 s; 101 films from 27. Pairs (L1+L2, L3+L4) would give 53 films of 107 to 394 s, one over the cap (eng.power.motor 394 s).

## 3. The kit check (test first)

**What it guarantees.** For every lesson film: every teach and example point of every lesson wired to it is claimed by a beat of the film, the claim still matches the lesson text, and the claiming beat plausibly carries it; or the point is on an allowlist with a reason. A lesson edit that changes a point, or a new point, fails the content test until the film is rebuilt, as a renamed term does today.

**Data.**
- `pointsOf(lesson)` in `films/_kit/assert.mjs`: the chunking of 1.1, ids `t<i>.<j>`, `ex.text.<j>`, `ex.ask`, `ex.reveal.<j>`. Exported, so the validator, the build and the tests share it.
- In `build.mjs`, a beat names what it carries: `points: ['offsets#ex.reveal.2']` (short lesson name after the module; a one-lesson film may write `'ex.reveal.2'`). The build expands it to the full key and writes page data `points: [{ key: '<lesson id>#<point id>', fp: '<fingerprint>', beats: ['s5.2'] }]`. Fingerprint: the first 8 hex of a stable hash (FNV-1a) of the chunk's normalised text, as the term check pins `term` by value.
- Allowlist: `reading: [{ key, fp, reason }]` on the film spec, written to page data. Allowed reasons only (D4): a pointer to another lesson or level ("het volgende niveau legt G43 uit"); a point that is word for word the same as a point of another lesson the same film carries (the duplicate-term pattern). An empty reason fails.

**`checkPoints(data, { lessons, wiredBy })`** (called from `checkFilm` for lesson films; so it runs in the build and in `tests/filmcontent.test.js` for every shipped page):
1. Every point of every lesson in `wiredBy` has a claim or a `reading` entry: `points: offsets#t4.2 of eng.machining.offsets is in no beat and not left to reading`.
2. Every claim and entry still matches: its key exists and its `fp` equals the current chunk's fingerprint: `point offsets#t2.2 changed in the lesson; rebuild the film`.
3. A claim's beats exist, and for a lesson wired with a start scene `#n`, they are in scene n or later.
4. Plausibility, so a claim cannot be empty: the claiming beats' nl voice and caption contain at least half of the point's distinctive numbers (decimals and integers above 12), and at least two of its content stems (one for a one-sentence point). Thresholds from the inventory's calibration; the review checks the meaning.
5. A `reading` entry has a reason from the allowed set; the content test prints the total number of allowlist entries, and a test pins it, so growth is a visible diff.

**Rollout ratchet.** On day one no page has `points`. `tests/fixtures/points-pending.json` lists the 96 lesson films; the test requires every lesson film page to have `points` data or be in the list, fails when a listed film's page has `points` (remove it from the list), and fails when a film not in the list loses its claims. The list only shrinks; step N (the 32 unchanged films) and the batches empty it. At the end the file and the gate go.

**Drafting help.** `films/_kit/points-draft.mjs <film id>`: prints, for every point, the beat that best matches it (the inventory's scoring), as a draft `points:` map for the builder to confirm or correct. Not shipped, not trusted: the build's checks and the review decide.

**Tests to write first** (`tests/filmcontent.test.js`, made-up lessons as in `tests/introfilm.test.js`):
- `pointsOf` splits teach blocks on blank lines and the example into text, ask and reveal chunks, with stable ids.
- A film whose beats claim every point passes; one unclaimed point fails with its key; a `reading` entry with a reason passes, without one fails.
- A changed chunk text fails with "rebuild"; a claim of a beat that does not exist fails; a claim before a lesson's start scene fails.
- A claim on a beat without the point's numbers or words fails.
- The ratchet: a lesson film neither claimed nor pending fails; a pending film with claims fails.
- `checkScope`: an added beat with a colon fails, one with `%` passes; an added stage label without `tr()` fails; the rest of a legacy film is not checked.
- The limits: a film of 330 s designed, 12 scenes and 880 words passes; 13 scenes or 361 s fails.
- Every shipped page rebuilds byte-identical (the kit change alone changes no page).

## 4. Batches and order

Agents and models (CLAUDE.md): build `sonnet`; review `sonnet`, `opus` for the first film of each pattern and for the kit; render batch `sonnet`; the kit step `opus` (a kit change others depend on). Up to three agents at once, each in its own worktree. No two parallel agents touch the same kit files: build agents do not edit `films/_kit/*`; a SAY rule a new sentence needs is written into the agent's report and the integrator adds it to `films/_kit/timeline.mjs` before the render batch (one commented group per batch, proving no other film's spoken text changes). Splits rewrite `film` in a module's lesson files, so one lane per module: two films of the same module never run in parallel. Agents do not bump `CACHE`, do not touch `manifest.json`, and add their new pages, VTTs and posters to the SHELL (integrator checks `tests/swshell.test.js` after every merge).

Per film: build (sonnet; brief: section 2, the film's rows of the gaps CSV, the length review's notes for that film, the rules of the v16 notes) → review (sonnet; it checks every point of every wired lesson against the beat that claims it, the room and cast reused, the length target, both languages) → merge, checks (`npm test`, validator, shellcheck) → render with the next render batch → upload, verify, push (one CACHE bump per push).

| Step | Lanes (parallel, each its own worktree) | Films | New or rebuilt pages | Renders (films, nl+en) |
|---|---|---|---|---|
| K | one: kit check, limits, `checkScope`, draft helper (`opus` build, `opus` review) | 0 | 0 (byte-identical) | 0 |
| P (pilots) | A: eng.machining.cnc split · B: eng.moulding.cycle extend · C: pm.scaled.pi extend+room (`opus` reviews) | 3 | 6 | 6 |
| N | one: claims for the 32 "none" films (sonnet build with the draft helper, sonnet review; a real gap found moves that film to extend) | 32 | 32 (data only) | 0 |
| B1 | A: eng.joining (arc, defects, spot, bolting, bonding, production; 6 splits) · B: eng.machining (drilling, measuring, tooling splits; turning, milling, overview extend) · C: eng.lines (robots, design, errorproof, control, variants; 5 splits) | 17 | 58 | 58 (production: first render) |
| B2 | A: eng.moulding (defects, setting, materials, moulds, machine splits) · B: eng.quality (tolerance, spc splits; spc rewires eng.spc too), eng.maintenance (failure split, tpm), eng.power (motor split, hydraulics, drives) · C: pm.perform.tree, pm.negotiate.batna, pm.intake.firsttalk (splits; firsttalk rewires pm.lead.listen), pm.intake.stakeholders | 16 | 46 | 46 (materials: first render) |
| B3 | A: eng small (safety.loto, safety.permit, drawings.reading, ot.isa95, switchgear.fiverules, switchgear.devices, gridbasics.load, gridplanning.loadflow, gridplanning.flex, mechanics.tensile, mechanics.fatigue, gridops.outage) · B: pm agile, land, portfolio, itproject (backlog, kanban, scrum, adoption, handover, prioritise, migration, mvp) · C: pm run, stuck, lead, plan, consult, outside (escalation, rhythm, diagnose, feedback, wbs, proposal, steering, jargon) | 28 | 28 | 28 (fiverules, flex: first render) |
| **Total** | | **64 changed + 32 claims** | **138 film pages (84 new ids, 54 rebuilt), 32 data-only, 10 retired** | **138 film renders, about 20 render batches of 6 to 8 films** |

Within a lane, worst first (the table in 1.4). B1 to B3 lanes follow each other per lane: B2 lane A starts when B1 lane A is merged, so a lane's module files never conflict. A render batch takes the reviewed films of all lanes, one film and one language per command (the render rule), then the manifest and SHELL merge.

Agent count: 1 kit (+1 opus review), 64 builds, 64 reviews (3 opus, 61 sonnet), the claims pass (1 to 2 agents and a review), about 20 render batches.

Order in the big plan: after the Projects intros (Task 11), as planned, unless Merijn moves it (D5). Steps K and N do not render and may run earlier.

## 5. Risks

1. **The 360 s cap and the English voice.** Projections use each film's own seconds per word; the Dutch voice is faster, English binds. Re-rendered beats can come out a few seconds longer. Mitigation: the 350 s target, and the builder estimates with `--audit` before review; a film that lands over 360 s after render goes back for rewording, not to the cap.
2. **The estimate is an estimate.** The tool is a proxy (Spearman 0.92 against reviewers, but 2.6 tool sentences per reviewer point); point counts per film could be off by a few, and a film near a boundary (extend+room versus split) could flip. The kit check, not the inventory, is the gate; the action for each film is re-decided by its builder from the claims if the claims show a much larger or smaller gap.
3. **Scale.** 138 film renders and about 84 new video pairs in storage; per render batch the upload and manifest merge. Old videos of retired ids are deleted afterwards (storage cost, no user impact).
4. **Page size.** Extending pages already over 300 KB (overview 345 KB, cycle 324 KB, milling 317 KB) brings them closer to the 450 KB cap; the 25 KB growth rule keeps them under 370 KB.
5. **Split continuity.** A one-lesson film at Werkkennis or above no longer has the Basis scenes before it; the 30-word opening must set the scene without re-teaching the lower level (the review checks it).
6. **Merge conflicts** in lesson files (splits), `sw.js` SHELL, `manifest.json` and the Dutch SAY list: one lane per module, SAY rules through the integrator, the existing union scripts, and `node --check sw.js` plus `tests/swshell.test.js` after every merge (the v16 notes' integrator rule).
7. **Lesson edits later.** The fingerprints make every later teach or example edit fail the content test for its film until the film is rebuilt (and then re-rendered if the narration changes). That is the point of the check, but it makes content edits to filmed lessons more expensive; the failure message names the point and the film.
8. **Offline caches.** Retired pages leave the SHELL; the CACHE bump per push clears them. A learner with an old cached video of a retired id falls back to the new film on the next online open.

## 6. Steps

- [x] **K. Kit (one agent, `opus`, own worktree; review `opus`).** Tests of section 3 first (red), then `pointsOf`, `checkPoints` in `checkFilm` for lesson films, the `points` and `reading` page data in `defineFilm`, `checkScope` (lesson-film narration guard on added beats, `checkLabels` on added stage functions), the 300 KB target as a failure for pages with `points`, `MAX_SCENES` 12, `MAX_TOTAL` 360, `NARRATION_MAX` 360, `films/_kit/points-draft.mjs`, `tests/fixtures/points-pending.json` with all 96 lesson films. Every shipped page rebuilds byte-identical. Note the new rules in the v16 notes ("Film rules") and in the build brief.
  - Built 15 Nov (branch `task17-kit`; review pending). Rulings: (1) `MAX_TOTAL` stays 300 as a sizing value and the check uses `FILM_TOTAL_MAX` 360: ten pm builds size their scenes with `Math.min(MAX_TOTAL, words / 2.5)`, and raising `MAX_TOTAL` changed seven pages. (2) The 300 KB failure for pages with points allows eng.machining.overview, eng.moulding.cycle and eng.machining.milling (extended, already over) their pre-Task-17 size plus 25 KB (risk 4); split films get no allowance. (3) A `reading` entry is `{ point, reason: 'pointer', note }` or `{ point, reason: 'duplicate', of }`; a duplicate is checked by fingerprint against a claimed point of another lesson. (4) The build checks the points of the served lessons and of the lessons that wire the film, so a split film is checked before its lessons are rewired; the content test uses the wiring. (5) `checkScope` also takes `beats` (an added beat inside an old scene) and requires `focus` on every added beat (table 2.2). (6) The unit tests are in tests/filmpoints.test.js; the gate, the pinned reading count and the size rule on shipped pages in tests/filmcontent.test.js. (7) The pending list has the 96 lesson film pages without points, identical to the 96 films of the inventory JSON. Not mechanised: the 22-unit size of added stage text and the `wrapUnits` wrapping (brief and review). Rules and the build brief: v16 notes, "Film rules" and "Completing lesson films (Task 17)".
  - Reviewed 15 Nov (branch `review-task17-kit`, merged with the integration branch at v341). Changes: (1) one name for the designed-length cap: `MAX_TOTAL` is 360 and `FILM_TOTAL_MAX` is gone; the ten pm builds that sized their scenes against the kit cap keep 300 s as their own `SIZE_TOTAL`, so no page changes. (2) The size allowance follows table 2.2: every extended or claims-only film may grow 25 KB from its size before (`BYTES_BEFORE`, 13 films near or over 300 KB, among them eng.machining.turning at 296 KB), never a split film. (5) The plausibility rule needs a fifth of a point's content words (at least two; one for a one-sentence point), and codes and acronyms count as words: random-beat acceptance 11 % to 5 %, no carried point lost. (7) The label rule exempts labels made only of units and acronyms. (8) checkScope scanned the whole stage once per stage function (about 0.5 s per declared function on a 300 KB legacy page, so about 2 minutes on the content test once the batches declare their functions); now it scans once (about 130 ms for all 242 functions of eng.machining.turning), with a test.
- [ ] **P. Pilots (three lanes; build `sonnet`, review `opus`).** eng.machining.cnc split into four one-lesson films; eng.moulding.cycle extended; pm.scaled.pi extended with room. Render the six films (`sonnet`), upload, verify, push. Checkpoint with Merijn (D6).
- [ ] **N. Claims for the 32 unchanged films (`sonnet`, review `sonnet`).** Data only; no narration change, so no render: verify that the VTT and timing files are unchanged.
- [ ] **B1, B2, B3** as in section 4, worst first per lane; one render batch per 6 to 8 reviewed films.
- [ ] **Close.** `points-pending.json` empty, gate removed; ledger lines per agent in `model-ledger.md`; one line in the v16 notes ("every lesson point of a wired lesson is in its film; the kit checks it").

## 7. Decisions for Merijn (multiple choice)

**D1. "One short extra scene per lesson point."** A film may drop up to 31 points, and a film has at most 9 scenes today.
- A. One extra scene per lesson that has gaps, with one beat per skipped point, right after that lesson's scenes; a missing step of a worked example goes into the example's own scene. Allow up to 12 scenes. **(recommended)**
- B. Literally one scene per skipped point (up to 31 extra scenes in one film; every film with more than 3 gaps would have to split).
- C. No new scenes: add the points as beats to the existing scenes, keep 9 scenes.

**D2. Films that would pass 360 s once complete (27 films, 101 lessons).**
- A. Split into one film per lesson: 101 films of about 1 to 3.5 minutes, each lesson its own film. **(recommended)**
- B. Split into pairs (Basis+Werkkennis, Gevorderd+Expert): 53 films of about 2 to 5 minutes, one still over the cap.
- C. Raise the cap to about 7.5 minutes and extend them all: no splits, fewer renders, but films up to 450 s and every lesson of a topic still plays all four levels.

**D3. Also split the multi-lesson films that fit after extension?** (29 films, 78 lessons; they change and are re-rendered anyway.)
- A. No, split only where the length forces it. **(recommended: 49 fewer films to build and render)**
- B. Yes, every multi-lesson film that changes becomes one film per lesson (each level its own film, about 49 more films).

**D4. Points left to reading.** Merijn's rule is that the film replaces reading.
- A. None, except pointers to another lesson or level and word-for-word duplicates of a point the same film already carries. **(recommended)**
- B. As A, plus origin and history asides (names, years: Goodhart 1975, Shewhart, Purdue), which then appear under the film in "Lees mee" as "Uit de les" (a small app change).
- C. As A, plus any point a review agent judges minor, with a reason.

**D5. Order.**
- A. As planned: after the Projects intros (Task 11), worst first (eng.machining.cnc, the joining, machining and lines films first); the kit and the claims pass may start earlier. **(recommended)**
- B. Start the pilots now, in parallel with Task 11.
- C. PM films first (Merijn's PM priority of 12 Nov): 21 pm films, 1 to 8 points each, then engineering.

**D6. Checkpoint after the pilots.**
- A. Yes: Merijn watches the cnc films (split) and the cycle film (extended) before the batches start. **(recommended)**
- B. No, go straight through.

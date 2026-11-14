# Film length review (14 Nov 2026)

Merijn asked: are the films long because the rule said so, or is the whole film informative? If padded, shorten; if informative, keep.

## Method

- Measured all 97 film pages (narration words, scenes, lessons served, rendered length).
- Built a dossier per film with the lesson text it serves next to its narration, scene by scene.
- Eight reviewers (`sonnet`, read-only) classified every beat as new, needed detail, useful or decorative elaboration, restatement, frame or filler, gave a verdict (TIGHT, TRIMMABLE, PADDED) and a shortest version. Rubric: `2026-11-14-film-length-rubric.md`; per-batch reviews: `2026-11-14-film-length-<batch>.md`.
- Caveat: the first dossiers lacked the worked example's question and answer (fields `ask` and `reveal`) for 9 films in the first three batches. All 9 came out TIGHT, which the missing answers cannot have made looser; only their count of dropped points may be too low. Beat shares are the reviewers' estimates, not exact counts. Visuals were not seen: numbers shown only on a card were not counted.
- The verdict on `pm.plan.intro` (batch many3) is about the old 240 s version and does not count; the improved version was merged after the dossiers were made.

## Measurements

- 97 films; none shorter than 192 s; median 304 s; 54 longer than 300 s.
- Narration is about 700 to 760 words whatever the content: one-lesson films 712 words for about 500 words of lesson text (ratio 1.4); four-lesson films 731 words for about 1,700 (ratio 0.4). 72 of 96 lesson films are at 700 words or more.
- So the old rule (Basis about 3 to 5 minutes, a ceiling of about 760 words) set the length, not the content.

## Verdicts (96 lesson films)

| Group | TIGHT | TRIMMABLE | PADDED |
|---|---|---|---|
| One lesson (25) | 22 | 3 | 0 |
| Two lessons (21) | 20 | 1 | 0 |
| Three or four lessons (50) | 50 | 0 | 0 |
| Total | 92 | 4 | 0 |

TRIMMABLE (12 to 23 percent of the narration is recap, restatement or detail the lesson does not ask for):

| Film | Now | Trimmed | Cut |
|---|---|---|---|
| eng.switchgear.devices | 341 s | about 257 s | closing recap, fuse, arc and five-rules detail beyond the lesson |
| eng.power.air | 284 s | about 234 s | buffer vessel, ISO 8573, the energy-split scene, transitions |
| eng.ot.orderflow | 294 s | about 250 s | opening frame, recipe aside, repeated SAP codes, recap |
| eng.maintenance.tpm | 304 s | about 266 s | CILT, the results sum and the recap repeated; and it misses the people point (Teach 4) |

## The opposite problem: films that drop lesson points

Nearly every film is dense, and the films that serve three or four lessons drop many points to stay under the old ceiling:

- Engineering, three or four lessons: 3 to 31 points missing per film (for example eng.machining.cnc about 31, including three of four worked-example answers; eng.joining.arc about 30; eng.joining.defects about 24; eng.machining.drilling about 22).
- Projects, three or four lessons: 2 to 8 points per film (pm.perform.tree 8, pm.negotiate.batna 6).
- Some one- and two-lesson films too: eng.power.motor about 8, eng.drawings.reading 7, eng.safety.permit 5.

Why it matters: in a lesson with a film, the film replaces the reading (`lessonPhases` in `src/core/course.js`: `film` instead of `teach` and `example`), and "Lees mee" shows the film's script, not the lesson text. A point the film drops is not shown to the learner at all, except when the film fails to load and the text fallback appears.

## Answer to the question

The length came from the rule, but the films are not padded: 92 of 96 are informative throughout, 4 can lose 12 to 23 percent, none is padded. The bigger issue is the other way round: dense films that leave lesson points out, which the learner then never sees.

## Decisions (Merijn, 14 Nov)

- Dropped lesson points: **complete the films** (not the lesson text under the film). Plan Task 17, worst first, after the Projects intros.
- The four trimmable films: **trim** them. Plan Task 18.

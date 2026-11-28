# Review rubric: is this film long because of the length rule, or is all of it informative?

Background. Merijn (the learner) asked on 14 Nov 2026: "Are the films long because the rule said so, or is the whole film really informative? If the first, and information is given purely for the sake of it, they must be shorter. If the second, the film can stay as it is." Videos do not always need to be long: a minute or even half a minute is fine when that carries the content.

The old rule (v14, Nov 2026): Basis films "about 3 to 5 minutes, higher levels 2 to 4 minutes", narration fitted to a ceiling of about 760 words; the kit also required at least 60 s. Measured: of 97 films none is shorter than 192 s, the median is 304 s, and the narration is about 700 to 760 words whether a film serves one lesson (712 words for about 500 words of lesson text) or four lessons (731 words for about 1,700 words of lesson text). So length followed the ceiling, not the content. Your job is to find out, film by film, how much of the length the content needs.

## What to read
Only the dossiers you are given, in /tmp/claude-0/-home-user-words-and-improvising/de95cd30-5a1c-53de-8618-a52c37ead79e/scratchpad/vlen/dossiers/<film id>.md. Each has the lesson text the film serves (teach blocks and the worked example, Dutch) and the film scene by scene (VOICE = what is said, CAPTION = what is on screen). Do not edit anything in the repository. Do not render or run builds.

## What to do for each film
1. **Map the content.** List the lesson's points (each Teach block, the worked example's question, steps and answer, any number or term the lesson depends on). For each, note where in the film it is carried: scene and beat, or "not in the film".
2. **Classify every beat** (by its VOICE, and its CAPTION when the voice leaves it to the screen):
   - NEW: carries a lesson point or a needed step of the example.
   - NEEDED-DETAIL: concrete detail without which a point or the example cannot be followed (a number, a step, a named object).
   - ELABORATION-USEFUL: goes beyond the lesson but makes an abstract point concrete or prevents a likely misunderstanding. Keep.
   - ELABORATION-DECOR: goes beyond the lesson and adds nothing the learner needs (colour, an extra example of the same thing, a second analogy for a point already clear).
   - RESTATE: says again, in other words, what the film or the previous beat already said.
   - FRAME: opening, transition, recap or sign-off ("in this film", "zo", "samengevat", "kortom").
   - FILLER: none of the above.
3. **Verdict**, one of:
   - TIGHT: nearly every beat is NEW, NEEDED-DETAIL or ELABORATION-USEFUL. The film may stay at its length (say so even if it is long).
   - TRIMMABLE: removing RESTATE, FRAME, FILLER and ELABORATION-DECOR beats saves 15 to 35 percent without losing any lesson point.
   - PADDED: more than 35 percent of the film is RESTATE, FRAME, FILLER or ELABORATION-DECOR, or the lesson's points would fit in a film half as long.
4. **The short version.** What is the shortest film that still carries every lesson point and the whole worked example, with the same quality? Give: the beats to cut or merge (scene and beat numbers), the resulting number of narration words, and the length in seconds (2.5 words per second plus about 2 s per scene; a film can have 2 to 9 scenes). Also say, in a line, what a version of 60 to 90 seconds would keep if the film were only a taster.
5. **Be strict and fair.** A point repeated in new words is a restatement. A concrete example that makes a rule clear is useful. A worked example's calculation steps are needed even when long. A card or caption that carries a number the voice does not say is a reason NOT to cut the number from the screen. Do not penalise a film for being dense. If a film is too short to carry its lessons, say that (a film that skips lesson points), it is the opposite problem.
6. **Check the multi-lesson films for the opposite problem:** do they drop lesson points to fit (points of the lesson text that are not in the film at all)? List them.

## Output
Write the review to /tmp/claude-0/-home-user-words-and-improvising/de95cd30-5a1c-53de-8618-a52c37ead79e/scratchpad/vlen/reviews/<batch name>.md with, per film: a header line (id, current s, narration words), the content map, the verdict with the percentages of beat classes, the proposed short version (cuts, words, seconds), and any lesson points the film lacks. Start the file with a summary table: film | current s | verdict | proposed s | saving percent | one-line reason.
Your final message must contain only that summary table, counts of TIGHT, TRIMMABLE and PADDED, and the three films where you are least sure of your verdict and why. Be honest about uncertainty; do not fill in what you could not check.

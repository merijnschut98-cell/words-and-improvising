# P0 pilot pass on `pm.plan`: notes for the next module passes

Written 21 Nov by the P0 content agent. Scope: rewrite `pre` and `recall` of the 16 lessons (nl and en), write the bank and blueprint, lint to zero. Teach text, gists, terms and situations were not touched.

## What was done, in numbers

- 16 lessons x (1 pre + 4 recall) x 2 languages = 160 questions rewritten. Recall counts, kinds (`mc`/`num`) and key positions are unchanged, so `tests/progresskeep.test.js` and the fixture `v13-pm.plan-recall-keys.json` needed no edit. Numeric slots keep their numbers (some stories got a distractor or a second step, the answer is the same).
- 6 recall slots became `best` (same shape and key position as `mc`, plus a genuine runner-up `close`): `wbs#r2`, `wbs#r3`, `scope#r1`, `products#r2`, `method#r3`, `raci#r3`. The other 58 recall slots stay `mc` (41) or `num` (17); every numeric slot keeps its number and tolerance.
- Bank: 43 items per language (b1..b43, no retired ids). Kinds: mc 9, best 3, num 7, all 6, gap 5, order 3, match 10. Per topic 11, 11, 11 and 10 items; per level 3 at level 1, 2 at level 2, 3 at levels 3 and 4 in each topic (resources has 2 at level 1), so a 12-question topic test and a 16-question level test can be drawn without repeating. Every item cites a source sentence (at least 6 words, quoted from the lesson of that level, in that language).
- Blueprint: 16 entries (4 topics x 4 levels), 1 or 2 aims and 4 traps each, nl and en.
- Lint for `pm.plan` (nl + en): 157 findings before (length 24, offtopic 41, absolute 40, shortstem 22, definition 18, echo 4, nobody 8), 0 after, no `lintOk` needed. Baseline lowered by removing the `pm.plan` entry.
- DMAIC: one neutral sentence in the level 2 opener of `pm.plan/breakdown` ("In DMAIC, Plan belongs to the Improve phase; in a delivery project it is the core."). Nothing moved, no new DMAIC sentences in the lessons; those wait for Merijn's answer to Q1.

## Time

About 30 minutes of wall time for the whole pass, most of it writing (about 80 minutes of reading and writing if a human did it). The checks are cheap; the writing is the cost. Plan on roughly one agent session per module of this size (16 lessons), and spend the review on the options, not on the stems.

## What was hard

1. **Pinned slots.** Each recall slot keeps its kind and key position (and, for six lessons, the number). That forces the new question to have its key at a given place; plan the options so the key lands there, do not shuffle afterwards.
2. **The lint is about the options, so write options first.** `absolute` (alle, elke, alleen, only, each, every, all) catches quantifiers in a plain sentence too: "de hele lijst" instead of "alle taken", "once a quarter" instead of "every quarter". `offtopic` wants every wrong option to share at least one content word with the lesson text: write distractors in the lesson's own vocabulary, which also makes them better near misses. `echo` fires when only the key repeats the stem's words: keep stem words out of the key, or put them in a distractor.
3. **The key was the longest option in 63% of the first draft** (random would be 25%). The lint only warns at 1.8x. A small script (key length against the others) found them; after lengthening the distractors it was 48% in nl and 40% in en. Not zero, because many options end up the same length; check this on your module and aim for under 40%.
4. **`all` items are linted with every option as a "wrong" option** (there is no single `answer`), so no absolute word in any option, and every distractor needs lesson vocabulary.
5. **Pre slots take only `mc`, `num` and `best`** (`checkLesson` rejects the other kinds), although the design text says `all`/`gap`/`order`/`match` may be used in `pre`. They live in the bank only.
6. **Bank sizing.** `MIN_LEVEL_POOL` is 10 items up to level 1, so level 1 needs at least 3 items per topic (12 in a 4-topic module); levels 2 to 4 are fine with 2 to 3. Count this before writing.
7. **Source quotes.** The validator wants a sentence of 6 or more words from one block (title, gist, a teach block, example text, ask or reveal, a term or its definition) of the lesson at that level, in that language. Copy it from the file; curly quotes and dashes are normalised, so they are safe. A faded example's `reveal` is a good source for Gevorderd and Expert items.

## Patterns that worked

- **Write nl and en side by side**, one slot at a time, with the key index shared. Then parity (same kind, same key position, same runner-up) is a given instead of a check. The pass used a scratch file per topic and a small generator that rewrites the `pre:` and `recall:` blocks of the lesson files and writes the bank files; an agent that does the same does not need to hand-edit 3,000 lines. The generator is not in the repo; rebuild it in ten minutes if you want it.
- **Level by what the learner does, not by how hard the numbers are.** Basis: classify a case ("which line is a deliverable?"). Werkkennis: a role and a small number or order ("two names under A, what is wrong and what do you do?"). Gevorderd: choose between options that each cost something, with a constraint stated ("the end date is fixed, smoothing fails, which choice?"). Expert: weigh several factors or spot what is missing ("the critical path is now 17 weeks, the parallel chain is 18: what is the problem?").
- **A distractor from the neighbouring concept**: the total/free float swap, the risk/management reserve swap, variance versus standard deviation (take the square root first), the inside view, the planned instead of the actual hours. These are the options a half-informed colleague really picks.
- **A distractor inside the story.** In `compress#r1` a cheaper option that is not on the critical path ("Z, the electrics, 3,000 euro") tempts the picker; the answer is still the number 4000 that was pinned.
- **`best` where a situation honestly has two defensible answers**: name the runner-up and say in the `why` when it would win. It also removes the "two answers are defensible" objection the standard raises.
- **Definition stems at level 3 and 4 become situation stems.** "Wat is P80?" became "Een planning noemt een P80-datum van 21 weken. Welke uitleg klopt?"; "Waar zet je een aanvoerbuffer?" became a case with a side chain of five weeks.
- **Bank order items** work when the lesson itself lists a sequence (change request, network calculation, overload solution); ask for the sequence, do not invent one. **Match items** with situations on the left and the term on the right test more than definition matches. **Num items** with a trap (a cheaper option that does not count, a transferred risk that must not be in the reserve) are the best Expert items.

## Six before and after

1. `pm.plan.risk#r0` (length 3.4x, off-topic option). Before: "Welke is een bruikbare risicoregel?" with `“Datakwaliteit”`, `“Onderhoudsdata van voor 2023 misschien onbruikbaar; eigenaar Pieter; testexport in week 1”` (key), `“IT-risico’s: middel”`, `“Weerstand van de vloer”`. After: four complete risk lines of the same length, each flawed in a different way: a team as owner and "monitoren", a department as owner and "communiceren", a score without an event, and the key with an event, a named owner and an action with a date.
2. `pm.plan.chain#r3` (definition at level 4, "Er is geen verschil", absolutes). Before: "Wat is het verschil tussen een kritieke keten en een kritiek pad?" with "De keten is per definitie altijd korter dan het kritieke pad zelf", "Er is geen verschil, het zijn twee namen". After: two tasks that are unrelated in content but need the only senior work planner; how does the critical chain treat them? The distractors are the critical-path habit (parallel), a feeding buffer and two chains with a buffer each.
3. `pm.plan.raci#r3` (key 2.6x the next, joke option). Before: "Wat is de beste manier om de rol van de sponsor expliciet te maken?" with "Zijn naam op de titelslide zetten", "Het team vragen wat ze verwachten". After: a `best` item; the runner-up is "Het team laten opschrijven wat de sponsor moet doen en dat aan hem voorleggen", and the `why` says it is good but stays a wish without his own commitment.
4. `pm.plan.riskvalue#r3` (definition, "Er is geen verschil, het zijn twee namen voor één pot"). Before: "Wat is het verschil tussen de risicoreserve en de managementreserve?" After: the sponsor asks to use the contingency reserve for unexpected costs; the near miss is the swapped definition ("de risicoreserve is voor onbekende risico’s").
5. `pm.plan.spread#r3` (3-word stem at level 3). Before: "Wat is P80?" with "De datum die 80% van het team haalbaar vindt", "Het punt waarop 80% van het werk klaar is". After: "Een planning noemt voor het project een P80-datum van 21 weken. Welke uitleg klopt?" The wrong options now sound like things people say about a date (team agreement, 80% of the work), and the fourth is the inverse (overrun in 80% of cases).
6. `pm.plan.wbs#p0` (key 2.2x the next option). Before: "Wat is de beste eerste regel in de opdeling?" with "Data analyseren", "Workshops houden", and a key of 75 characters. After: "Welke vraag levert de beste startlijst voor de WBS op?" with four questions of the same length; the key is the one about results (“Als dit klaar is, wat ligt er dan wat er nu niet is?”), the others ask for tasks, hours and experience.

## For the reviewer of P0

- Check that the answer key of each new item is the only defensible answer in the stated situation, in both languages (the `best` items name a runner-up on purpose).
- Check the numbers: `compress#r1`, bank b9 (tolerance, 1), b18 (lag, 11), b20 (crashing combination, 15,000), b27 (parametric with set-up, 23), b29 (standard deviation of a path, 7), b31 (chain plus buffer, 32.5), b41 (reserve, 8,400).
- Key position 2 is over-represented (26 of 75 multiple-choice items in nl) because of the pinned slots; the bank was written to spread, the recall slots cannot be.

## Review of P0

Written 22 Nov by the P0 review agent. Every pre, recall and bank item was read against the lesson text, in both languages. Commits on branch `review-p0`. Corrections to the notes above: the bank was not spread (key positions A/B/C/D were 0/4/7/1 in the 12 multiple-choice bank items), the `raci#r3` title-slide option in before/after 3 was still in the file, and the key-length numbers depend on how you count (see below).

### What was found and fixed (nl and en together, counted once)

- **Options nobody would pick: 17.** Bar colour and "fits on one page" (`network#r3`), "both chains equally, to keep it fair" (`schedule#r2`), title slide (`raci#r3`), minutes (`raci#p0`), "the team reports too often" (`compress#r3`), "start without a plan" and "copy another factory" (`method#p0`), "the steering group removes the reserves" (`chain#p0`), "before task 1, so everything starts later" (`chain#r1`), "the project is ahead" (`chain#r2`), an option that contradicts the stem (`network#r2`), "F gets a week of float because the lead is away" (`network#r1`), "start the electrics later" (`compress#r0`), "add Cs until the As disappear" (`raci#r0`), "an outside firm's quote" (`techniques#p0`), "add up the risks outside the project" (`techniques#r2`), "who asked you for this estimate" (b25). Each now carries a nameable misconception: the inside view in another form, crashing instead of fast-tracking, a feeding buffer hidden in the critical task, topping up from the management reserve, picking the A yourself, and so on.
- **Key not taught by the lesson: 1.** `risk#r3` asked why people write alone first in a pre-mortem; the key ("the loudest doesn't steer") is not in the lesson. Rewritten to ask what the lesson does teach: why imagining failure as a fact works.
- **Key echoes the stem: 1.** `wbs#r1` named the 8–80 rule in the stem and the key ("packages of 8 to 80 hours"). The key now asks for the consequence (at least three packages, 200 / 80 = 2.5).
- **`best` whys without the runner-up's winning case: 7** (`wbs#r2`, `scope#r1`, `products#r2`, `method#r3`, `raci#r3`, b7, b32, b39 partly). The standard asks *when* `close` would win, not only that it is also good. `products#r2` also claimed something the lesson does not say (purpose "already in the project product description").
- **Whys that name options the item does not have: 3** (b4 RACI, b8 hours, b40 Brooks-style option not explained). b40's filler "two people are twice as fast" replaced by the lesson's 20% switching rule.
- **Stem and options out of step: 1** (b42 options about the night shift, stem did not say which risk).
- **Length give-aways: about 25 items** lengthened or shortened (`wbs#p0`, `scope#r0`, `scope#r1`, `method#r1`, `method#r3`, `spread#r2`, `spread#r3`, `chain#r3`, `risk#p0`, `risk#r1`, `riskvalue#r1`, `riskvalue#r3`, b3, b14 (key 1.58x the next), b19 (key 1.22x), b32 and others).
- **Bank key positions:** 0/4/7/1 moved to 4/5/1/2 (b10, b14, b21, b37, b39, b42 reordered), so with the pinned recall positions (15/13/19/16) the module totals 19/18/20/18 of 75.
- **Bank coverage:** b44 (order, the pre-mortem steps) added so every topic has at least three level-1 items. Three blueprint traps that were jokes or impossible ("zero float means the task is done", "the most modern method", "title slide") replaced with real misconceptions.
- Truth and numbers: every numeric key was recomputed (lesson slots and b9, b18, b20, b27, b29, b31, b41); all correct. nl and en say the same throughout.

### Lessons for the next module passes

1. **Read every wrong option aloud and ask "who says this?".** The lint caught none of the 17 nobody-options above, because they share lesson words and carry no absolute. This is the reviewer's main job and the writer's main blind spot; budget for it.
2. **A short neutral-sounding option is not a good distractor.** "Een mijlpaal", "Speling" next to "Een afhankelijkheid" (b14) is a length tell at Basis too.
3. **`best` why = key wins because X; runner-up wins when Y.** Write the Y as a situation ("als er geen tweede specialist te vinden is"), not as "is ook goed".
4. **Check the key against the lesson, not against what is true in the field.** `risk#r3`'s key is true but not taught; a learner cannot get it from the lesson.
5. **Spread bank key positions on purpose**, after the recall positions are known: count the recall positions per module first, then give the bank the complement. Numeric options in ascending order may keep their natural place.
6. **Key length: measure, but do not overshoot.** "Strictly longest" was 35% nl / 32% en before the review (the writer's 48% / 40% counted differently) and is 3% nl / 8% en after, with the key strictly shortest in 13% / 12% and most options within 1.15x of each other. A tight band is the goal; aim for the key strictly longest in roughly 15–25% of items, because "never the longest" is a tell too.
7. **Lint words to avoid in options:** alleen/only (also in "only then"), elke/each/every/all, iedere; and a word the lesson never uses (such as "projectbuffer" in the compress lesson) trips `offtopic`. Run the lint after every batch of option edits, not at the end.
8. **Scripted edits:** a small anchor-and-replace script per question (anchor on the stem, replace inside that question up to its `why`) and a field-setter for bank items by id kept nl and en in step and made every change reviewable in the diff. Neither is in the repo.

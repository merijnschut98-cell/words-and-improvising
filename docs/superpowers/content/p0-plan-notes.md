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

# The question standard (v18)

For everyone who writes or reviews a `pre` or `recall` question, in both languages. Source: design `docs/superpowers/specs/2026-11-21-v18-design.md` section 2. The lint (`node src/content/courses/lintquestions.js`) checks what a machine can check; the reviewer checks the rest. Examples cite real lessons; the "better" versions are illustrations of the pattern, not edits.

Merijn's four complaints, which this standard answers: questions are too easy; the wrong options do not look like a right answer; some options make no sense at any level; some situations leave too much open or are wrong.

## 1. Per level: what a question must test

A level teaches something the lower one does not (design addendum 3), so its questions must test that.

| Level | The question tests | Form |
|---|---|---|
| 1 Basis | Recognise a term and apply it to a plain case | Short stem. A definition stem is fine here. |
| 2 Werkkennis | Apply it with simple numbers or steps | Stem has a role and a small number or an order of steps |
| 3 Gevorderd | Choose between options that each cost something, in a stated situation | Stem names the role, the moment and the constraint. At most one definition question per lesson. |
| 4 Expert | Weigh several factors, or spot what is missing or wrong | Situation stem, usually 20 words or more. At most one definition question per lesson. |

Bad at level 4: `eng.lines.risk#r3` "Wat laat een gevoeligheidsanalyse zien?" is a Basis question. Bad at level 3: `pm.stuck.rootcause#r0` "Wat is het verschil tussen een symptoom en een oorzaak?" is Basis too.
Good: `eng.flow.capacity#r1` (from 80% to 90% utilisation, what happens to the waiting time; the right answer needs the idea, the numbers make it Werkkennis).
Lint rules: `definition` and `shortstem` (stem of 10 words or fewer) at levels 3 and 4.

## 2. The question text

1. **It carries the situation.** From level 2 up, a decision stem names who you are, the moment, the constraint and, where it matters, the numbers. "What is the right reaction?" is not a stem: right for whom, at what stake?
2. **One reading only.** If two options are defensible under some reading, the stem rules one out, or the item becomes a best-answer item (section 4) that says so.
3. **No claim the lesson does not make.** Check the key and the stem against the lesson text and a source.
4. **No echo.** The stem's own distinctive words must not appear only in the key (lint rule `echo`).

Bad: `pm.outside.redflags#r3` "Je ziet één rode vlag. Wat is de juiste reactie?" Which flag, from whom, at what stake? "Meteen naar de sponsor escaleren" is right when the flag is safety or fraud, so two answers are defensible in a single-answer item.
Better: name the flag ("De leverancier mist voor de tweede keer een mijlpaal en wil niet zeggen waarom"), the role and the stake, or make it a `best` item that asks for the best first step.

## 3. The options

Every wrong option must tempt a half-informed colleague. Good sources: a real misconception; a true statement that does not answer this stem; the right answer to a neighbouring concept; the right idea with a wrong number, order or condition.

1. **No absolutes as a give-away.** *altijd, nooit, alle, alleen, precies, elke, zonder verdere* (always, never, all, only, exactly, every). Measured: 1,293 in wrong options against 159 in right ones, so "pick the one without an absolute" scores without knowing the content. An absolute word may appear in a wrong option only if the key or another option also has one, or when the lesson itself states a real absolute (a safety rule). Lint rule `absolute`.
   Bad: `pm.formats.kickoff#r3` "Wanneer houd je een aparte teamkick-off ...?": "Nooit: één kick-off voor iedereen is altijd genoeg", "Alleen als het project langer dan een jaar duurt", "Alleen als de sponsor niet beschikbaar is". Only the key has no absolute.
   Better: three conditions that each sound like a real reason ("als het team uit meerdere afdelingen komt", "als de scope nog niet vaststaat", ...), the key being the one the lesson teaches.
2. **No joke, off-topic or "nobody does this" options.** Slide counts, page counts, "geen verschil", "negeren", "niets doen". Bad: `pm.negotiate.terms#r3` "Het aantal slides in het eindrapport"; `pm.consult.bid#r3` "Hoeveel pagina's de offerte wordt"; `eng.lines.risk#r3` "De goedkoopste integrator". Lint rule `offtopic` (no content word shared with the lesson) catches the worst; the reviewer catches the rest.
   Bad: `pm.stuck.rootcause#r0` "Geen verschil, het zijn twee woorden voor hetzelfde" and `pm.outside.redflags#r3` "Negeren tot je er drie hebt gezien": a professional would never say them.
3. **Same length, same grammar, same register as the key.** No option more than about 1.3x the next longest (the lint warns from 1.8x; aim for the lower figure). Bad: `pm.intake.ask#r0` where the longest option is 2.7x the next, so the long one reads as the careful, right one. Lint rule `length`.
4. **No duplicates.** Two options that say the same thing in other words are one option. Rule `duplicate`. (Orderings and number variants are real distractors and are not flagged.)
5. **Position and count.** Four options (for `mc`), key position spread over the module; never "the key is the longest" or "the key is the only one that restates the stem".

Good models (keep): `eng.flow.capacity#r1` (every option is a plausible intuition about queues), `eng.mechanics.fracture#r1` (every option is a real fracture pattern), `pm.agile.fit#r3` (four reasonable questions, the key is the one that matters most).

## 4. The new kinds (data shape from design 2.3; the engine is F1)

A `kind` is optional; no `kind` means `mc` (four options) or `num` (has `number`).

| Kind | Use it when | Data | Standard |
|---|---|---|---|
| `best` | Two or more options are defensible and one is better | `{ kind:'best', q, options, answer, close, why }`; the stem says "beste" / "best" | The runner-up `close` is genuinely good; `why` says why the key wins and when `close` would win. This is the honest form of a situation that leaves several answers open. |
| `all` | The idea is a set (which belong in a project definition) | `{ kind:'all', q, options (4-6), answers[], why }` | The stem says "alle juiste". Not every item in a module has the same number of keys. Wrong items must each be a real near miss, not filler. |
| `gap` | A term or number must be retrieved, not recognised | `{ kind:'gap', q, text with one ___, accept[], choices?, why }` | The gap is the one word that matters. `accept` lists the spellings and the plural. `choices` (a word bank) at Basis only. |
| `order` | The sequence is the knowledge (DMAIC, escalation steps) | `{ kind:'order', q, items (3-6, in right order), why }` | Every item is a real step. The order must follow from the lesson, not from taste. |
| `match` | Pairs of situation and approach | `{ kind:'match', q, pairs (3-5), why }` | Each right side fits exactly one left side. No pair may fit two. |

`all`, `gap`, `order` and `match` go into the test banks (group 3) and the `pre` slot; recall slots stay `mc`, `num` or `best`. A recall slot rewritten as `best` keeps its answer position (progress-keep).

## 5. The `why`

Names the key, and says why the most attractive wrong option fails here. "Because b." is not a why. A reader who got it wrong must see the difference.

## 6. Checklist for a reviewer (per question)

1. Is the key correct against the lesson text, and unambiguous in the stated situation?
2. Would a half-informed colleague pick each wrong option? (Name the misconception for each.)
3. No absolute give-away, no joke or off-topic option, similar length and grammar?
4. Does the question test what its level teaches (section 1)?
5. Does the stem carry role, moment, constraint and numbers where they matter?
6. Does the `why` explain the near miss?
7. Is the lint clean, or is the finding justified with `lintOk: 'reason'` on the item?

## 7. The lint and the ratchet

`node src/content/courses/lintquestions.js` prints counts per rule and per module (`--list` prints every finding with lesson id, question and rule, `--json` prints the baseline shape). `tests/questionlint.test.js` compares with `tests/fixtures/v18-lint-baseline.json` and fails both when a count rises and when it falls without the baseline being lowered. After a rewrite: regenerate with `node src/content/courses/lintquestions.js --json > tests/fixtures/v18-lint-baseline.json` and commit it with the content. A rewritten module aims for zero; a finding that is right to keep carries `lintOk: 'reason'` on the question. The lint is a signal, not a judge: rules `offtopic` and `echo` have false positives (a distractor can be a plausible idea that the lesson does not name).

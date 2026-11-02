# Course content brief (for content writers)

You write one course module for Spraakwater, a mobile learning app for Merijn: 28, Dutch, junior Lean consultant who leads improvement projects at manufacturing clients and grid operators (like Enexis). He wants to **understand and join** engineering conversations, and to master **project management and consulting/leadership craft**. Not Lean, Kata or A3 (he learns those elsewhere).

## Output

Two files, same lesson ids, same order, same meaning:
- `src/content/courses/<subject>/<slug>.en.js`
- `src/content/courses/<subject>/<slug>.nl.js`

Each file: `export default { lessons: [ ... ] };` Start the file with one comment line saying what the module is.

## Lesson schema

```js
{
  id: '<moduleId>.<slug>',           // exactly the ids in the module brief
  title: 'Short title',
  pre: [ Q ],                          // 1–2 prequestions, asked BEFORE he reads; specific to this lesson's key fact; most people will guess wrong
  teach: ['…', '…', '…'],              // 3–5 blocks, each ≤ 90 words, plain text, one idea per block, concrete
  example: { kind: 'worked', text: '…' },                              // level 1–2: a fully worked example with real numbers or a real scene
  // level 3–4 instead: { kind: 'faded', text: 'setup…', ask: 'What would you do next?', reveal: 'the worked answer…' }
  said: 'What engineers say: “…”',    // (Projecten: 'What you hear in projects: “…”') one line as it sounds in the room
  recall: [ Q, Q, Q, Q ],              // 3–5, testing understanding, not trivia; at least one numeric question in engineering when the topic has numbers
  situation: { scene: '…', ask: '…', model: '…', rubric: ['…', '…', '…'] },  // a scene from HIS work, what he should ask/do, a model answer, 3 checkable rubric points
  sayIt: 'Explain … to … in 60 seconds.',
  terms: [ { term: '…', def: '…' } ],  // 2–4 key terms, one-line definitions
}
```

`Q` is either a choice question `{ q, options: [4 distinct strings], answer: <one of the options, exact string>, why: 'one line' }` or numeric `{ q, number, tolerance (> 0), unit: 'string, may be empty', why }`.

## Rules

- Use ’ (curly) for apostrophes and “ ” for quotes inside strings; never a straight ' inside a single-quoted string. Never use < or >.
- In both languages, the correct answer sits at the **same option position**, and numeric answers are the **same number**.
- Vary the correct option position across questions (not always the first).
- Dutch is natural spoken Dutch as a Dutch engineer or consultant would say it, not translated English. Keep the English terms Dutch engineers actually use (OEE, takt, bottleneck, changeover, CpK, FMEA, P&ID, MS/LS for middenspanning/laagspanning, stakeholder, scope, sponsor).
- Concrete numbers, real equipment, real scenes. Teach the 20% that lets him follow 80% of the conversation, and the question that makes an engineer take him seriously.
- Projecten: a consultant leading improvement projects at clients, not a textbook. Each lesson pairs a method with the people side (what to say, how resistance shows up, what to do when you don't know).
- Situations: "You're at…" in his work; the model answer is what a strong consultant would say or ask, in 2–4 sentences.

## Validate

Add the module to `src/content/courses/index.js` `MODULES` (entry given in the brief, with `questions` = recall count per lesson) and run:

    node --test tests/coursecontent.test.js

until it passes. Also add both files to `SHELL` in `sw.js`, next to `'src/content/courses/validate.js'`. Do not change any other file.

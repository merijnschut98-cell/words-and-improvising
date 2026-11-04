# v10: Maakindustrie overhaul — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merijn wants to talk with the engineers at his manufacturing clients. The four physical modules of the Maakindustrie (`discrete`) track get a full overhaul: Verspanen `eng.machining`, Lassen en verbinden `eng.joining`, Spuitgieten `eng.moulding` and Lijnen en automatisering `eng.lines`. Each module is split into **topics** (for Verspanen: Draaien, Frezen, Boren, CNC-programma, Gereedschap, Opspanning en meten). Every topic has **four levels**: Basis → Werkkennis → Gevorderd → Expert. All levels are open. The app suggests the next one and shows which he has passed and which he owns. Every term is explained at first use, both inline and with tap-to-explain (`linkTerms`, already built). The content goes much deeper: 6 lessons per module become 24. Each topic gets an interactive isometric figure that adapts to the level, plus extra figures where a deeper level needs its own object.

**Architecture:** Same shape as v8/v9. The topic structure is **data on the module meta in `src/content/courses/index.js`**. Every topic and level state is derived from the existing per-lesson progress, so **no new state, no storage change and no sync change**. Pure engine helpers live in `index.js` (where a lesson sits) and `src/core/course.js` (level state, topic rows, the next suggestion). Thin UI changes go in `src/ui/coursehome.js`, `src/ui/lesson.js`, `src/ui/home.js` and `src/ui/figure.js`. Content and figures are produced by parallel agents in worktrees.

**Tech Stack:** Vanilla ES modules, no build step; `node --test` (`npm test`); Playwright e2e (`node e2e/smoke.mjs <dir>`, port 8123); GitHub Pages (`.github/workflows/pages.yml`); Supabase sync (unchanged); anatomy skill for figures (`anthropic-skills:anatomy`, dev-only `figures/<id>/build.mjs`).

**Spec:** `docs/superpowers/specs/2026-11-02-learning-platform-design.md` (binding). This plan adds the **v10 spec section** below, which the integrator copies into the spec as "Topics and levels (added 2026-11-04)" in Task 1. Earlier plans: v9 `docs/superpowers/plans/2026-11-03-v9-updates.md`, ledger `docs/superpowers/plans/2026-11-03-v9-ledger.md`.

## Global Constraints

Copied from the spec, v8 and v9. They still bind.

- Vanilla ES modules, no build step, no backend beyond the existing Supabase row. **Everything works without an API key and without signing in.**
- One localStorage blob `spraakwater:v1`, merged with `defaultState()`. **v10 adds no state keys.** If a task finds it needs one, stop and raise it: it then needs a default, coercion in `load()`, a storage test, a merge rule in `src/core/sync.js` and a sync test.
- **Lesson ids and question ids never change.** Spaced repetition hangs on `lang|<lessonId>#r<n>`, and progress hangs on `courses.eng.lessons[<lessonId>]`. An existing lesson may be rewritten, moved within its file and given a new title, but its id stays, its recall count stays, and recall question *n* keeps its concept, its answer position and its numeric answer (Task 0 pins this).
- New lesson ids follow `<moduleId>.<slug>`. The slug matches `[a-z0-9_]+` (no dots, because `moduleOf` takes the first two segments).
- **Never synced:** `settings`, `ui`, `plan`. The API key never leaves the device.
- `sw.js` stays a classic script. The integrator bumps `CACHE` (now `vantage-point-v34`) once per merge that ships. Every new `src/` file goes in `SHELL`, because `tests/sw.test.js` walks `src/`. Before every push, run the SHELL-tracked check (v8 ruling): no index or SHELL entry may point at an untracked file.
- en/nl in parity (test enforces). Content ids are identical in en and nl. Natural spoken Dutch, not translated English.
- No `null`/`undefined`/`NaN` rendered. No straight apostrophes inside single-quoted strings (use ’). No `<` or `>` in content text. Content renders as text nodes only, never `html:`.
- **Minimal UX (binding):** exactly one filled `.btn-primary` per screen; everything else secondary or behind a disclosure. Level chips are **not** primary buttons. Plain labels; no icon without a text label except close and back. aria-labels from i18n. Focus moves to the screen heading on navigation.
- **Brand:** Vantage tokens only; light beige and dark deep green; no emoji; no gradients; no gold or coral; motion decelerates and is zeroed under reduced motion; sentence case; no exclamation marks.
- **No new reward layers.** A passed level gives the existing lesson XP (20) and counts as a round; nothing else. No topic badges, no "topic complete" screen, no confetti. Chip states are information.
- **Free access:** no chip, topic or level is ever locked or greyed out as unavailable.
- Mobile-first: legible at 390 px; touch targets ≥ 44 px.
- Branch `claude/improvisation-practice-game-voon91` only; never merge PR #1. Commit trailers as in the session instructions.
- Each code task: unit tests first (RED → GREEN), `npm test`, then `node e2e/smoke.mjs <scratchpad>/shots` with the named new step. Look at every named screenshot in light **and** dark. Commit, push.
- The speaking subject and every non-topic module behave exactly as before. Existing e2e steps stay green with no selector changes except the ones a task names.
- v10 screenshots are numbered from `110-` upward (v9 ended at `105-`).

## Review Focus

These are the five most likely ways v10 breaks. Each one has a test that pins it.

1. **Progress loss.** A rewritten existing lesson drops or reorders a recall question, so `nl|eng.machining.cutting#r2` now points at a different question or at nothing. A file reorder or a renamed slug orphans a passed lesson. The index `questions` count changes for an existing lesson. Pinned by Task 0 (`tests/progresskeep.test.js` against a snapshot taken from v9 HEAD `3e0999d`) and by Task 2's v9-state fixture: a v9 blob with passed and owned machining lessons shows the same lessons passed or owned under v10, the same `dueCount`, and `mergeStates` round-trips it unchanged.
2. **Today pick regressions.** The new `nextLesson` for topic modules could loop on one level, suggest a passed level, jump between modules day to day, or change picks for non-topic modules. Pinned in Task 2: a table of states and their expected suggestions; every v9 `courseTodayPick`/`nextLesson`/`recommendedModule` test stays green unchanged; the pick is deterministic for a state and day.
3. **A second primary button.** Chips, the "next level" ghost on the done card and the module "Continue" button could become `.btn-primary`. Pinned: the e2e helper `onePrimary(page)` runs on course home with a topic module open, on the lesson header and on the done card.
4. **Validator gaps.** Gaps would let a topic with 3 levels, a lesson in two topics, a lesson in no topic, a faded example at Basis, a `lessons` order that differs from the topics, or a duplicate term reach users. Pinned by Task 1's validator tests: each rule has one RED fixture. Non-topic modules keep validating exactly as before.
5. **Content accuracy and clarity.** Wrong numbers in worked examples, numeric recall answers that do not follow from the text, untranslated or stiff Dutch, terms used before they are explained, and Expert lessons that are really Werkkennis. Pinned by one review agent per module (Task 9). That agent recomputes every number and checks the sources in the brief. The integrator spot-checks 3 lessons per module against the clarity checklist.

---

## Spec section: topics and levels (copy into the spec in Task 1)

### Data model: `topics` on the module meta (chosen)

```js
{ id: 'eng.machining', subject: 'eng', track: 'discrete', level: 1,
  title: {...}, blurb: {...},
  topics: [
    { id: 'turning', title: { en: 'Turning', nl: 'Draaien' },
      levels: ['eng.machining.processes', 'eng.machining.cutting', 'eng.machining.turnfinish', 'eng.machining.turncell'] },
    ...
  ],
  lessons: [ ...topics.flatMap((t) => t.levels) ],    // written out, same order
  questions: { [lessonId]: n, ... } }
```

- `levels[i]` is the lesson for level `i + 1`: 1 Basis, 2 Werkkennis, 3 Gevorderd, 4 Expert. The existing i18n keys `level_1..4` already say exactly this in nl and en.
- `lessons` stays an explicit flat array, because `moduleMastery`, `prepQuestions`, `courseSummary`, the validator and the content tests all read it. For a topic module it must equal `topics.flatMap((t) => t.levels)`, element for element.
- A topic id is a short slug (`[a-z0-9]+`) that is unique within the module. It is never stored in state.
- Name clash to keep in mind: since v9, `events[].topics` (My real week) holds **module ids**, and `prepQuestions`/`prepPick` read it. Module-meta `topics` is a different thing. Never pass a meta topic id where an event topic is expected. In code, name locals `metaTopics` or `rows` next to `ev.topics`.
- `level` on the module stays. It only orders unstarted modules in `recommendedModule`, so v9 picks stay the same. The module row no longer shows it for topic modules (see UI).
- For readability and union merges, topic modules are written over several lines in `index.js`: one line per topic and one line each for `lessons` and `questions`. Non-topic modules stay one line each.

**Why on the meta, not `topic`/`tier` fields on lessons:**
1. Course home, the start screen and `courseTodayPick` render and decide from `index.js` **without loading lesson bodies** (spec: "the course home renders without loading content"). Chips with state and the suggestion need the structure up front.
2. One place states the structure. The validator checks it once per module instead of cross-checking 48 lesson objects in two languages, which could disagree.
3. It keeps lesson files schema-compatible. A lesson does not know its tier, so moving a lesson to another level later is a one-line index change.
4. The pure engine (`course.js`) already takes `modules = MODULES` as a parameter, so tests can inject topic fixtures.

### How existing lessons map without changing ids

The 6 existing lessons of each module become levels in the topic table (Content section). Their ids, recall counts (4) and question meaning stay. Their position in the module file changes to match the new `lessons` order. Where a lesson's level in its topic differs from its old module level, only its `example.kind` changes (worked at levels 1–2, faded at 3–4). That changes no id. Progress for these lessons shows up at once as passed or owned chips. Sync is unaffected, because nothing new is stored.

One consequence is expected and accepted: a module that was `practise` or `own` drops to `learn` until the 18 new lessons are passed, because mastery means every lesson of the module. The chips show what he already has, so nothing looks lost. The ledger records this ruling.

### Validator rules (only when `meta.topics` is present)

- `topics` is an array of 2–8 topics. Each has an `id` matching `^[a-z0-9]+$` and unique in the module, a non-empty `title.en` and `title.nl`, and `levels` of **exactly 4** distinct lesson ids.
- Every lesson id in `meta.lessons` is in exactly one topic, and every level id is in `meta.lessons`.
- `meta.lessons` equals `topics.flatMap(levels)` in order. Because the file order must already follow the index order, the files follow topic-major order too.
- Example kind follows the **lesson's level in its topic**, not `meta.level`: levels 1–2 `worked`, 3–4 `faded` with `ask` and `reveal`.
- Teach blocks: 3–6 per lesson and ≤ 110 words each (non-topic modules keep 3–5 and ≤ 90). This leaves room for depth while one block still fits one card.
- Terms: 2–6 per lesson (unchanged). No term (case-insensitive, trimmed) is defined twice within one module in one language. The lesson screen already makes every term of the module tappable (`glossary([{...mod}])`), so a term is defined once, in the lowest level that uses it, and is tappable in every level.
- Non-topic modules: every existing rule exactly as today.

### Mastery per topic and level

- `levelState(state, lessonId, questions, lang)` returns:
  - `'todo'`: not passed;
  - `'passed'`: `lessons[id].passed` is set;
  - `'owned'`: passed, and every `lang|id#r<n>` is at box ≥ 4 (the existing `OWNED_BOX`).
  "Read but not passed" shows as `todo`. He asked for three states.
- A topic has no badge. Its row shows a quiet mono count "2/4" (levels passed). Module mastery (`moduleMastery`) is unchanged in meaning.

### Suggesting the next level (free access)

For a topic module, `nextLesson(state, meta)` returns:
1. **Current topic**: the topic that holds the lesson with the latest `max(read, passed)` timestamp in this module, provided it still has an unpassed level. Ties go to index order.
2. If the current topic is complete, or nothing has been touched yet: the first topic in index order that has an unpassed level.
3. Within that topic: the **lowest unpassed level**. Say he jumped to Expert and passed it; the suggestion is then the lowest level he skipped.
4. `null` when every level of every topic is passed.

`recommendedModule` and `courseTodayPick` keep their v9 logic and call this `nextLesson`. A lesson pick gains `topicId` and `level` for labels: `{ reason: 'lesson', moduleId, lessonId, topicId, level }`. For non-topic modules, `nextLesson` and the picks are byte-for-byte the v9 behaviour.

**Decision for Merijn (default chosen, can be flipped in one function):** the suggestion goes depth-first, finishing the current topic from Basis to Expert, as he asked. The alternative is breadth-first: all Basis levels first, then all Werkkennis. Mention this in the note to Merijn.

### UI (minimal)

- **Course home, module row of a topic module:** the `<details>` summary shows the title, the mastery badge and "5/24 levels" (`moduleLevels`) instead of the level pill and the lesson count. When opened, the body shows the blurb and then one **topic row** per topic. Each row has the topic title, a mono "2/4", and a 4-column grid of **level chips**: Basis · Werkkennis · Gevorderd · Expert. Rows render from the index alone, with no module load.
  - Chip states:
    - todo: hairline outline, no icon;
    - passed: `circle-check` icon in success ink;
    - owned: `check-check` icon plus a subtle success-tinted fill.
  - The suggested chip (only one, the module's `nextLesson`) gets an accent ring and a small "Next" (`chipNext`) under the label. It is not filled.
  - Every chip is a `button.level-chip` that opens that lesson, with `aria-label` "Draaien, Gevorderd: passed" (`chipLabel`).
  - The existing ghost "Continue" button stays at the bottom and reads "Continue: Draaien · Gevorderd" (`moduleContinueAt`).
- **Lesson header:** above the step indicator, one muted line `p.lesson-place` reads "Draaien · Gevorderd" (`topicLevel`). The top bar keeps the lesson title. Non-topic lessons show no line.
- **Lesson done card:** for topic lessons, add a ghost `button.next-level` "Next: Draaien · Expert" when `nextLesson` (after this pass) is in the same module. The primary stays what it is today.
- **Course Today card and start card:** "what" stays the lesson title. The "why" line for a topic lesson reads `${courseWhy} · Draaien · Gevorderd` instead of `· Verspanen`.
- **Figures:** `figureSrc(id, theme, lang, level)` appends `&level=N` for topic lessons. Figure pages read it to pick a level-appropriate default state; pages that ignore it keep working.
- **i18n (en + nl):**
  - `topicLevel` (topic, level) => …
  - `moduleLevels` (done, total) => …
  - `chipNext`
  - `chipLabel` (topic, level, state) => …
  - `chipState_todo|passed|owned`
  - `moduleContinueAt` (label) => …
  - `nextLevel` (label) => …
  - `topicCount` (done) => `${done}/4`
- Light and dark: chips use only `--line`, `--success`, `--accent`, `--surface` tokens. Check in both themes.

---

## Lanes and parallelism

| Lane | Tasks | Runs | Shared files to merge by union |
|---|---|---|---|
| 0 — baseline | 0 | integrator, first, after the four deepening agents have merged | `tests/` only |
| A — engine and UI (sequential, TDD) | 1 → 2 → 3 → 4 | one agent at a time on the branch | `src/core/course.js`, `src/ui/*.js`, `src/i18n.js`, `styles.css`, `e2e/smoke.mjs` |
| C — content (parallel) | 5, 6, 7, 8 (one per module) | **4 worktrees in parallel**, started after Task 1 merges; parallel with Tasks 2–4. If rate limits bite, run machining + joining first, then moulding + lines | the module's two content files, its `index.js` entry, its brief |
| R — content review | 9 (one review agent per module) | as soon as that module's lane finishes, in the same worktree | same as C |
| I — integration on real content | 10 | integrator, after Task 4 and at least one module merged; repeated per module | `e2e/smoke.mjs` |
| F — figures | 11 (waves F1–F8), 12 (optional upgrades) | **3 agents in parallel per wave**, only for modules whose review (Task 9) has merged | `sw.js`, the module's content files (`figure` field), `e2e/smoke.mjs` |

**Order:** 0 → 1 → (A: 2 → 3 → 4) ∥ (C: 5–8 → R: 9 per module) → 10 per module → F waves → final review.

**Integration rules (integrator only):**
- Merge content worktrees one at a time. Resolve `index.js` by keeping each module's own entry from its lane, never mixing two lanes' lines. Resolve `sw.js` `SHELL` and `src/i18n.js` keys by union (both en and nl blocks). Resolve `e2e/smoke.mjs` by keeping all steps.
- Bump `CACHE` once per merge that ships.
- Before every push:
  1. `npm test`;
  2. the full e2e `node e2e/smoke.mjs <scratchpad>/shots`;
  3. the SHELL-tracked check `git ls-files --error-unmatch` on every SHELL path and every figure file.
- After every push:
  1. wait for the Pages workflow (`gh run watch` on `pages.yml`);
  2. **live verify**: fetch the live `sw.js` and see the new `CACHE`, then open one topic lesson of the merged module on the live site in Playwright, light and dark;
  3. add one line to the ledger.
- Ledger: `docs/superpowers/plans/2026-11-04-v10-ledger.md`, created by the integrator in Task 0, with one line per task, ruling and deferred minor.

## File structure

**Create**
- `tests/progresskeep.test.js`, `tests/fixtures/v9-recall-keys.json` (Task 0)
- `tests/topics.test.js` (Tasks 1–2)
- `figures/<figureId>/build.mjs` (dev only) and `src/content/courses/figures/<figureId>.html` for about 24 new figures (Task 11)
- `docs/superpowers/plans/2026-11-04-v10-ledger.md` (Task 0)

**Modify**
- `src/content/courses/index.js` (helpers in Task 1; the four entries in Tasks 5–8)
- `src/content/courses/validate.js`, `src/core/course.js`
- `src/ui/coursehome.js`, `src/ui/lesson.js`, `src/ui/home.js`, `src/ui/figure.js`
- `src/i18n.js`, `styles.css`, `sw.js`, `e2e/smoke.mjs`
- `tests/coursecontent.test.js`, `tests/course.test.js`, `tests/lesson.test.js`, `tests/sync.test.js`
- `src/content/courses/eng/{machining,joining,moulding,lines}.{en,nl}.js`
- `docs/superpowers/content/briefs/eng.{machining,joining,moulding,lines}.md` (append a "v10 topics" section)
- the spec (Task 1 adds the v10 section)

**Not modified:** `src/core/sync.js`, `src/core/storage.js`, `src/core/coursereview.js`. If a task wants to touch them, it stops and raises it.

---

### Task 0: Baseline — the deepened lessons are in, and progress keys are pinned

**Value:** guards Review Focus 1 before anyone rewrites or reorders lessons.

**Files:** Create `tests/fixtures/v9-recall-keys.json`, `tests/progresskeep.test.js`, the v10 ledger.

- [ ] **Step 1:** Confirm the four deepening agents have merged into the branch: `git log --oneline -- src/content/courses/eng/{machining,joining,moulding,lines}.*.js` shows their commits after `3e0999d`. If one has not, wait; do not start Task 5–8 content on top of a stale file.
- [ ] **Step 2:** Generate the fixture from **v9 HEAD `3e0999d`** with a one-off script in the scratchpad. It uses `git show 3e0999d:<path>` into a scratch dir and dynamic `import()`. For each of the 24 existing lessons and each language, record:
  - `recall.length`;
  - per question: `kind` (`'mc'` | `'num'`), `answerIndex` (`options.indexOf(answer)`) or `number` plus `tolerance`;
  - `pre.length`;
  - the index `questions[id]`.
  Write the result to `tests/fixtures/v9-recall-keys.json`.
- [ ] **Step 3: Test** `tests/progresskeep.test.js`: "existing lessons keep their recall keys". For every lesson in the fixture, the current content in both languages has:
  - the same `recall.length`;
  - the same kind, answer index and number per position;
  - the same index count;
  - and its id still in `MODULES`.
  Run it now. It must be GREEN on the deepened content. If it is RED, a deepening agent changed a key. Report the diff to the controller and fix the content (restore the order) before going on. **Expected:** `# pass` for the new test, suite green.
- [ ] **Step 4:** Commit `Pin recall keys of the existing machining, joining, moulding and lines lessons`.

### Task 1: Topics in the index, and the validator rules

**Files:**
- Modify: `src/content/courses/index.js` (helpers only; no module gets `topics` yet), `src/content/courses/validate.js`, the spec (append the v10 section above)
- Test: `tests/topics.test.js` (new), `tests/coursecontent.test.js`

**Interfaces:**
- `index.js`:
  - `export const LEVELS = [1, 2, 3, 4]`.
  - `export function placeOf(lessonId, modules = MODULES) -> { moduleId, topicId, topic, level } | null`, where `topic` is the topic object and `level` is 1–4. Returns null for non-topic modules and unknown ids.
  - `export const topicsOf = (meta) => (meta && Array.isArray(meta.topics) ? meta.topics : null)`.
- `validate.js`:
  - `export function checkTopics(meta) -> string[]`, which implements every rule in "Validator rules".
  - `validateModule` calls it when `meta.topics` is present and adds its errors.
  - `checkLesson` takes the lesson's tier: `tier = placeOf(...)?.level ?? meta.level`. Pass a `tierOf` map built from `meta.topics` so the validator stays independent of `MODULES`. The worked/faded rule and the teach-block limits use `tier` and `topical`.
  - A module-level duplicate-term check runs per language for topic modules.

- [ ] **Step 1: Failing tests** in `tests/topics.test.js`. Use a fixture topic module `eng.fx` with 2 topics × 4 lessons, built like `fxMeta` in `coursecontent.test.js`:
  - a valid fixture → `[]`;
  - a topic with 3 levels → error "topic a needs exactly 4 levels";
  - a lesson in two topics → error;
  - a lesson in no topic → error;
  - `lessons` order differs from `topics.flatMap(levels)` → error;
  - a duplicate topic id, a bad topic id `Turning`, and a missing `title.nl` → one error each;
  - a faded example at level 2 of a topic module whose `meta.level` is 3 → error;
  - a worked example at level 3 of a module whose `meta.level` is 1 → error;
  - a teach block of 105 words passes in a topic module and fails in a non-topic module;
  - 6 teach blocks pass in a topic module, and 7 fail;
  - the same term "Snijsnelheid" defined in two lessons of one topic module (nl) → error; the same in a non-topic module → no error (unchanged behaviour);
  - `placeOf('eng.fx.c', [fx])` → `{ moduleId: 'eng.fx', topicId: 'b', level: 1, … }`; `placeOf('eng.flow.takt')` → `null`.
- [ ] **Step 2: Run** `node --test tests/topics.test.js`. **Expected:** FAIL (`placeOf` is not exported; `checkTopics` is not defined).
- [ ] **Step 3: Implement.** Keep the non-topic code path untouched. Pass the tier as a parameter; do not rewrite `checkLesson`'s other checks.
- [ ] **Step 4: Run** `npm test`. **Expected:** PASS, including every existing `coursecontent.test.js` test unchanged ("every shipped module validates" stays green, because no shipped module has topics yet).
- [ ] **Step 5:** Add an index test to `tests/coursecontent.test.js`: "every topic module in the index passes `checkTopics`". It is vacuously green now and becomes real when Tasks 5–8 land.
- [ ] **Step 6:** Append the v10 spec section to the spec. Commit `Topics with four levels in the course index, and validator rules for them`. No CACHE bump (no shipped behaviour changes); push.

### Task 2: Engine — level state, topic rows, the next level, labelled picks

**Files:**
- Modify: `src/core/course.js`
- Test: `tests/topics.test.js`, `tests/course.test.js` (unchanged tests must stay green), `tests/sync.test.js` (one fixture test)

**Interfaces** (all pure, all take `modules = MODULES` where relevant):
- `levelState(state, subject, lessonId, count, lang) -> 'todo' | 'passed' | 'owned'`.
- `topicRows(state, meta, lang) -> Array<{ id, title, passed, levels: Array<{ lessonId, level, state }> }> | null`. Returns null for non-topic modules. `passed` counts the levels that are passed or owned.
- `nextLesson(state, meta)`: unchanged for non-topic modules; for topic modules, the rule in "Suggesting the next level". The recency helper `lastTouched(lessonProgress) = max(read || 0, passed || 0)`.
- `courseTodayPick` and `prepPick`: a `lesson` pick gets `topicId` and `level` from `placeOf` when present. No other change.
- `levelsDone(state, meta) -> { done, total }` for the module row.

- [ ] **Step 1: Failing tests** (`tests/topics.test.js`). Use a fixture module `eng.fx` with topics `a` (`a1..a4`) and `b` (`b1..b4`), injected through `modules`:
  - nothing touched → `a1`;
  - `a1` passed → `a2`;
  - `a3` passed only (he jumped) → `a1`;
  - `a1`, `a2` passed, then `b1` passed later → `b2` (recency);
  - `b1` read but not passed, read later than `a1` was passed → `b1`;
  - all of `a` passed → `b1`;
  - all passed → `null`;
  - equal timestamps → index order;
  - `levelState`: passed with 3 of 4 questions at box 4 → `passed`; all 4 → `owned`; the en review keys do not count for nl;
  - `topicRows` shape and the `passed` count;
  - `courseTodayPick(state, 'eng', 'nl', day, [fx])` → `{ reason: 'lesson', moduleId: 'eng.fx', lessonId: 'a2', topicId: 'a', level: 2 }`; the same call twice → deep-equal (deterministic);
  - **Regression:** every existing `nextLesson`/`recommendedModule`/`courseTodayPick` test in `tests/course.test.js` passes unchanged; a non-topic module pick has no `topicId` key;
  - **v9 fixture (Review Focus 1):** a v9-shaped state has `eng.machining.cutting` and `eng.machining.cnc` passed, with `nl|eng.machining.cutting#r0..3` at box 4. Run it with a v10-shaped machining meta (fixture copy of the topic table below):
    - `levelState(cutting)` → `owned` and `levelState(cnc)` → `passed`;
    - `dueCount` is equal before and after;
    - `mergeStates(s, s)` deep-equals `s`, in `tests/sync.test.js`.
- [ ] **Step 2: Run** `node --test tests/topics.test.js`. **Expected:** FAIL on the new functions and on the topic behaviour of `nextLesson`.
- [ ] **Step 3: Implement.** `nextLesson` branches on `topicsOf(meta)` first; the old body stays as the else branch, unchanged.
- [ ] **Step 4: Run** `npm test`. **Expected:** PASS; the count rises by the new tests only.
- [ ] **Step 5:** Commit `Engine: level state per lesson, topic rows, and the next level in a topic`. Push (no UI change; no CACHE bump needed, but bump it if `course.js` ships, because it is in SHELL. **Rule: any change to a SHELL file bumps CACHE.**)

### Task 3: Module view — topic rows with four level chips

**Files:**
- Modify: `src/ui/coursehome.js` (`moduleRow` branches on `topicsOf(meta)`), `src/i18n.js`, `styles.css`, `sw.js` (CACHE), `e2e/smoke.mjs`
- Test: `tests/topics.test.js` (`chipModel`), `tests/i18n.test.js` (parity, automatic), `tests/ux.test.js` if it checks classes

**Interfaces:**
- Pure: `chipModel(t, row, level, isNext) -> { cls, label, aria, icon }` lives in `coursehome.js` and is exported for tests.
  - `cls` is `level-chip s-todo|s-passed|s-owned` plus ` next` for the suggested chip.
  - `icon` is null for todo, `circle-check` for passed, `check-check` for owned.
  - `aria` comes from `chipLabel`.
  If `check-check` is not in `src/ui/icons.js`, add it from Lucide (ISC), like the other icons.
- `moduleRow` for a topic module:
  - The summary shows the title, the mastery badge and `moduleLevels(done, total)`.
  - The body shows the blurb, then `section.topics` with one `div.topic-row` per topic: `h3.topic-title`, `span.mono.topic-count` and a `div.level-chips` with 4 buttons.
  - Then the ghost Continue, labelled `moduleContinueAt(topicLevel(...))`.
  - The rows render on build (no `openModule` call).
  - A chip tap calls `app.go('lesson', { subject, moduleId, lessonId })`.
- CSS:
  - `.level-chips { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px }`.
  - Chips have `min-height: 44px`, radius 6 px, a hairline border, a small label (0.78rem) that wraps at most to 2 lines, and an icon above the label.
  - `.level-chip.next` gets `outline: 2px solid var(--accent); outline-offset: 1px` and the "Next" mini-label.
  - `.s-owned` gets a success-tinted background from the existing success token at low alpha (check that a token exists; else use `--surface-2` and the success ink).
  - No colour beyond tokens. Reduced motion: no transition.

- [ ] **Step 1: Failing tests:**
  - `chipModel` for each state;
  - the suggested chip has `next`;
  - aria strings in both languages: "Draaien, Gevorderd: behaald" in nl and "Turning, Advanced: passed" in en;
  - `moduleLevels(5, 24)` → "5/24 niveaus" in nl;
  - i18n parity for the new keys.
- [ ] **Step 2: RED** `node --test tests/topics.test.js` → FAIL. **Step 3: Implement.** **Step 4:** `npm test` → PASS.
- [ ] **Step 5: e2e step** `topics: level chips in a module (fixture)`. Until real content lands, use `page.route('**/src/content/courses/index.js', …)` to serve the real file text with the `eng.machining` entry replaced by a fixture entry. The fixture has one topic `turning` with levels `processes, cutting, tools, quality` and `lessons` restricted to those 4 (all ids that exist today). Then:
  1. seed `cutting` as passed with all 4 nl reviews at box 4, and `processes` as passed;
  2. open Engineering → course home → open Verspanen;
  3. see 4 chips: chip 1 passed, chip 2 owned, and chip 3 marked `.next` with "Volgende";
  4. tap chip 4 ("Expert") and the lesson `eng.machining.quality` opens (free access);
  5. go back.
  Run `onePrimary` on course home with the module open. Screenshots `110-topic-chips`, `110-topic-chips-dark`, plus `111-topic-chips-390` at a 390 px viewport. Read all three: no chip label is cut off, and the chip states are distinguishable in both themes without colour alone (the icons).
  Task 10 replaces this fixture route with real content; keep the route helper so it can be reused.
- [ ] **Step 6:** CACHE, commit `Module view: topics with four level chips, the next one marked`, push, live verify.

### Task 4: Where you are — lesson header, next level on the done card, labelled picks, figure level

**Files:**
- Modify: `src/ui/lesson.js` (`p.lesson-place`; ghost `button.next-level` on the done card; `figureFrame(app, lesson.figure, place && place.level)`), `src/ui/figure.js` (`figureSrc` level param), `src/ui/coursehome.js` (`courseWhy` line), `src/ui/home.js` (start card why line), `src/i18n.js`, `styles.css`, `sw.js`, `e2e/smoke.mjs`
- Test: `tests/lesson.test.js` or `tests/topics.test.js`

**Interfaces:**
- `placeLabel(t, lang, lessonId, modules = MODULES) -> string | ''` returns "Draaien · Gevorderd" for topic lessons, else `''`. It lives in `coursehome.js` and is used by the lesson, the Today card and the start card.
- `pickWhy(t, lang, pick, meta)`: for a lesson pick with `topicId`, returns `${courseWhy(t, pick)} · ${placeLabel(...)}`; otherwise the v9 string. Replace the two duplicated ternaries in `coursehome.js` and `home.js` with it.
- `figureSrc(id, theme, lang, level)` appends `&level=${level}` only when `level` is 1–4. The v9 test for `figureSrc` without a level stays green unchanged.
- Done card: `next-level` shows only when `nextLesson(app.state, meta)` after `applyLesson` returns a lesson in the same module that differs from the current one. Label `nextLevel(placeLabel(...))`; it opens that lesson. It is a `btn btn-ghost`.

- [ ] **Step 1: Failing tests:**
  - `placeLabel` for a topic lesson and a non-topic lesson;
  - `pickWhy` with and without `topicId`;
  - `figureSrc('x', 'dark', 'nl', 3)` ends with `&level=3`;
  - `figureSrc('x', 'dark', 'nl')` equals the v9 string;
  - `figureSrc(..., 7)` gets no level.
- [ ] **Step 2–4: RED → implement → GREEN** (`npm test`).
- [ ] **Step 5: e2e step** `topics: where you are` (using the fixture route from Task 3):
  - open chip 3 (`tools`, Gevorderd in the fixture);
  - see `.lesson-place` "Draaien · Gevorderd";
  - play the lesson with `playLesson`;
  - the done card shows `.next-level` "Volgende: Draaien · Expert";
  - `onePrimary` on the done card;
  - back on course home, the Today card's why line contains "Draaien · Expert";
  - the start screen card shows the same.
  - Separately: open `eng.machining.cutting` (it has the lathe figure) and assert the iframe `src` contains `level=2`.
  Screenshots `112-lesson-place`, `113-done-next-level`, `113-done-next-level-dark`, `114-today-topic`.
- [ ] **Step 6:** CACHE, commit `Show the topic and level in a lesson and in today’s pick; figures get the level`, push, live verify.

---

## Content (Tasks 5–8, one lane per module, then Task 9 review)

### What every content agent gets (the brief)

Each lane first appends a "v10 topics" section to `docs/superpowers/content/briefs/eng.<module>.md`: the topic table below, the one-line scope per level, the facts list with sources, and the rules below. The agent prompt includes the brief path, the lesson schema (spec "Content model"), `src/content/courses/validate.js`, the deepened existing lessons of the module as the **style reference**, and the commands `node --test tests/coursecontent.test.js tests/progresskeep.test.js tests/topics.test.js`.

**Rules for every lesson (the clarity rule):**
1. **Every number says what it measures**, with its unit and where it comes from: "a cutting speed (snijsnelheid, the speed of the material past the cutting edge) of 200 m/min, a typical value for steel with a carbide insert". Never a bare "200".
2. **Assumptions are stated** before a calculation: "Assume 2 shifts of 8 hours, 220 working days."
3. **One defensible option.** When engineers disagree, give the common practice and one sentence on when it differs. No lists of five alternatives.
4. **Every term is explained at its first use in the lesson text**, in plain words, even if it is in `terms`. Define each term once per module in `terms` (≤ 6 per lesson), in the lowest level that uses it. Higher levels may assume terms from lower levels of the same topic (they are tappable), but they re-explain a term in a short clause the first time they lean on it.
5. **Paragraphs:** a blank line (`\n\n`) inside a teach block starts a new paragraph. Use 2–3 short paragraphs per block where it helps.
6. **Level-appropriate language:**
   - **Basis** assumes nothing: what the thing is, what it looks like, what it is for, the words people use.
   - **Werkkennis**: what an operator or setter does and why, with simple numbers.
   - **Gevorderd**: what the process engineer decides and calculates, trade-offs, a faded example.
   - **Expert**: what a manufacturing engineer or manager weighs (cost, capability, investment, standards), and the questions Merijn can ask to sound credible.
   Each level teaches something the lower one does not; no repetition with bigger words.
7. **Facts with sources:** every non-obvious number or rule in the lessons comes from the brief's facts list, which names the source. The agent verifies each source (WebSearch/WebFetch) before relying on it and adds the URL in the brief. If a source cannot be confirmed, the fact is dropped or stated as a rule of thumb with "about".
8. **Situations** are scenes from Merijn's work: a gemba walk, a meeting with a production manager, a tooling engineer or a quality engineer at a Dutch manufacturer. **`said`** is how it sounds on the floor.
9. Dutch is natural spoken Dutch as on a Dutch shop floor (verspanen, opspannen, omstellen, standtijd, wisselplaat, aanhaalmoment, nadruk, matrijs, omschakelpunt). Use English loanwords only where Dutch engineers actually use them (CNC, OEE, SMED, cobot, hotrunner).
10. Schema: pre 1–2; teach 3–6 blocks of ≤ 110 words; example worked (levels 1–2) or faded (levels 3–4); `said`; recall **4** (MC with 4 distinct options, or numeric with tolerance and unit); situation (scene, ask, model, 3 rubric lines); `sayIt`; terms 2–6; no `<`/`>`; ’ not `'` in single-quoted strings.
11. **Existing lessons:** keep id, recall count, and recall question order, answer position and numbers (`tests/progresskeep.test.js`). You may sharpen wording, add a teach block (≤ 6) and change `example.kind` to match the new level (the Topic tables flag the lessons where it must change). Move each lesson object to its new position in the file.
12. Cross-reference, do not repeat. `eng.flow` (takt, balance), `eng.quality` (capability, SPC), `eng.cost` (hour rates) and `eng.industry40` (MES, vision) already teach those ideas. A lesson here applies them to its process in one sentence and moves on.

**Lane steps (the same for Tasks 5–8):**
- [ ] **Step 1:** Write the brief section (topic table, scopes, facts and sources, rules). Commit it in the worktree.
- [ ] **Step 2: Batch 1** (one content agent): topics 1–3. Write the new lessons in **nl and en**; move and adjust the existing lessons of these topics. Run the validator for the module through a scratch script (`validateModule(en, nl, meta)` with the v10 meta from the brief) until it returns `[]`. Commit `Content: <module> topics 1–3`.
- [ ] **Step 3: Batch 2** (a fresh content agent, same worktree): topics 4–6, same procedure. Commit `Content: <module> topics 4–6`.
- [ ] **Step 4:** Update the module's `index.js` entry in one commit:
  - `topics`;
  - the full `lessons` in topic order;
  - `questions` with 4 for each new lesson, the existing counts unchanged;
  - title and blurb unchanged unless the brief says otherwise.
  Then run `npm test`. **Expected:** PASS; "every shipped module validates", "every topic module passes checkTopics" and the progresskeep test are all green. Commit `Topics and levels for <module>`.
- [ ] **Step 5:** Hand over to the review (Task 9) in the same worktree.

**Size per lane:** 18 new lessons × 2 languages ≈ 2,400–2,800 lines, plus rework of 6 existing lessons. Two batches keep each agent's output around 1,300 lines.

### Task 5: Verspanen (`eng.machining`) — 6 topics

| Topic (id) | Basis | Werkkennis | Gevorderd | Expert |
|---|---|---|---|---|
| **Draaien** `turning` | `processes` (existing) — what turning is next to milling, drilling and grinding; the lathe, its chuck, tool and workpiece rotation | `cutting` (existing, lathe figure) — cutting speed, feed, depth of cut; rpm from Vc and diameter | `turnfinish` — roughness from feed and nose radius (Ra ≈ f²/(32·r)), chip breaking, slender parts, tailstock and steady rest; faded | `turncell` — turn-mill centres: driven tools, C/Y-axis, bar feeder, unmanned shifts; when one complete machining beats two machines |
| **Frezen** `milling` | `mill` — the machining centre, X/Y/Z, face and end mills, what a pocket and a contour are | `millfeeds` — spindle speed, feed per tooth, table feed vf = fz·z·n, metal removal rate | `millstrategy` — climb vs conventional milling, radial engagement and chip thinning, adaptive/trochoidal paths; faded | `fiveaxis` — 3+2 vs simultaneous 5-axis, fewer setups vs machine cost, when it pays |
| **Boren** `drilling` | `drill` — twist drill, centre drill, why a hole is not a hole; rpm for a drill | `holes` — holes to size: reaming, tapping, boring; H7 and what a fit is | `deephole` — peck drilling, coolant through the spindle, chip evacuation, depth-to-diameter as the deciding number; faded | `holequality` — position and perpendicularity: a position tolerance in plain words, causes of drift, how it is measured |
| **CNC-programma** `cnc` | `cnc` (existing) — what CNC is, the controller, axes, program, zero point | `gcode` — reading G-code: G00, G01, G02/G03, F, S, T, M03/M08/M30; a 10-line program | `offsets` — work offsets (G54), tool length and radius compensation, why crashes happen; faded | `cam` — CAM, simulation, post-processor, prove-out and first-off approval; where programming time goes |
| **Gereedschap** `tooling` | `toolbasics` — inserts, carbide vs HSS, coatings, holders, ISO insert codes in plain words | `tools` (existing) — wear, tool life, coolant | `toollife` — Taylor (V·Tⁿ = C), wear criterion VB, tool management, sister tools; faded | `toolcost` — cost per part: speed vs tool life, the economic cutting speed, standardising tools |
| **Opspanning en meten** `workholding` | `fixtures` (existing) — clamping, vice, chuck, fixture, setup time | `quality` (existing) — roughness, measuring, typical errors | `metrology` — calliper to CMM, measurement uncertainty, the 10 % rule, gauge R&R in plain words; faded | `capable` — a capable machining process: thermal growth, clamping distortion, Cpk on a dimension, in-machine probing |

Existing lessons: all keep their `worked` example (they sit at levels 1–2). New lessons: 18.

**Facts to verify and cite in the brief** (agents confirm the URL):
- Sandvik Coromant machining formulas (n = Vc·1000/(π·D), vf = fz·z·n, Q = ap·ae·vf/1000, Ra from f and rε): Sandvik Coromant "Machining formulas and definitions".
- Taylor tool-life equation: F.W. Taylor 1907, "On the art of cutting metals".
- ISO 6983 (G-code programming format).
- ISO 286 (hole and shaft fits, H7).
- ISO 1101 (geometrical tolerancing, position).
- ISO 21920 / ISO 4287 (surface texture, Ra).
- The 3-2-1 locating principle (any fixture design handbook).
- The 10 % rule for measurement resolution versus tolerance, and gauge R&R acceptance (< 10 % good, 10–30 % conditional): AIAG MSA manual, 4th edition.

### Task 6: Lassen en verbinden (`eng.joining`) — 6 topics

| Topic (id) | Basis | Werkkennis | Gevorderd | Expert |
|---|---|---|---|---|
| **Booglassen** `arc` | `arc` (existing) — MIG/MAG and TIG, arc, filler, shielding gas | `weldparams` — current, voltage, wire feed, travel speed, heat input (EN 1011-1: Q = k·U·I/v) | `wps` — WPS, WPQR and qualified welders (ISO 15609, 15614, 9606), why a weld must be right on paper; faded | `metallurgy` — heat-affected zone, preheating, hydrogen cracking, stainless and aluminium |
| **Puntlassen** `spot` | `spot` (existing) — resistance spot welding: current, time, force | `spotwear` — electrode wear, tip dressing, current stepping, nugget diameter (rule of thumb 4√t, t is the sheet thickness in mm) | `spotquality` — chisel and peel tests, ultrasonic testing of spots, adaptive control; faded | `spotlobe` — the weld lobe, galvanised and high-strength steels, aluminium spot welding |
| **Lasfouten en inspectie** `defects` | `defects` (existing) — porosity, lack of fusion, cracks, distortion | `inspection` (existing) — visual, dye penetrant, ultrasonic, destructive tests | `ndt` — UT, RT and MT in practice; quality levels B, C, D (ISO 5817) and who chooses them; faded | `weldrca` — recurring weld defects: from defect data to root cause; distortion and residual stress control |
| **Boutverbindingen** `bolting` | `bolts` — bolt, nut, thread, property class 8.8/10.9, locking | `bolting` (existing, bolt figure) — torque versus preload | `tightening` — tightening methods: torque, torque-angle, to yield, ultrasonic; preload scatter; faded | `jointdesign` — joint diagram, clamp length, fatigue, VDI 2230 in outline |
| **Lijmen en mechanisch verbinden** `bonding` | `bonding` (existing) — adhesives, rivets, clinching | `adhesives` — bonding in production: surface preparation, open time, curing, dispensing checks | `rivets` — blind rivets, self-piercing rivets, clinching in series; force-displacement monitoring; faded | `choosejoint` — choosing a joining method: multi-material, galvanic corrosion, disassembly and recycling, cost |
| **Lassen in productie** `production` | `weldcell` — the robot welding cell: robot, positioner, fixture, safety | `fixturing` — welding fixtures, tacking and sequence against distortion | `arcon` — arc-on time and cost per metre of weld: deposition rate, cost build-up; faded | `weldsystem` — welding quality as a system: ISO 3834, EN 1090 execution classes, the welding coordinator (IWE) |

Existing lessons: `arc`, `spot`, `defects` and `bonding` sit at level 1, and `inspection` and `bolting` at level 2. All keep `worked`. New lessons: 18.

**Facts to verify:**
- EN 1011-1 heat input and thermal efficiency k (MAG 0.8, TIG 0.6).
- ISO 5817 quality levels B/C/D.
- ISO 15609-1 (WPS), ISO 15614-1 (WPQR), ISO 9606-1 (welder qualification).
- ISO 3834 parts 2–4.
- EN 1090-2 execution classes EXC1–EXC4.
- Spot weld nugget minimum 4√t (AWS D8.1M) and the 5√t variant used by some OEMs: state which.
- ISO 898-1 property classes (8.8: 800 MPa tensile, 80 % yield ratio).
- Torque–preload T = K·F·d with K ≈ 0.2 dry (Shigley's Mechanical Engineering Design).
- Preload scatter of torque tightening about ±25 % (VDI 2230 Part 1 tightening factor αA).
- Lap shear testing ISO 4587.

### Task 7: Spuitgieten (`eng.moulding`) — 6 topics

| Topic (id) | Basis | Werkkennis | Gevorderd | Expert |
|---|---|---|---|---|
| **De machine** `machine` | `machine` (existing) — injection unit, clamping unit, mould, the cycle in one picture | `screw` — screw and plasticising: dosing, check ring, back pressure, residence time | `clamp` — choosing a machine: clamp force from projected area × cavity pressure, shot volume, screw utilisation 20–80 %; faded | `electric` — hydraulic, electric or hybrid; two-component and insert moulding; energy per kg |
| **Cyclus en output** `cycle` | `cycle` (existing, cycle figure) — cycle time and output | `cooling` — cooling time grows with wall thickness squared; mould and ejection temperature | `cavities` — more cavities or a faster cycle, balance, hot runner; faded | `partcost` — the cost of a moulded part: machine hour rate, material, scrap, mould depreciation |
| **Kunststoffen** `materials` | `materials` (existing) — plastics, drying, regrind | `polymers` — amorphous vs semi-crystalline: shrinkage, transparency, temperature | `drying` — drying in detail: dew point, residence time, hydrolysis, moisture measurement; faded | `fillers` — glass fibre, fillers, recyclate: orientation, warpage, material choice and cost |
| **Fouten** `defects` | `defects` (existing) — the common defects and their causes | `diagnose` — finding a defect: short shot, flash, sink, weld line; look first, change one thing | `warpage` — warpage and dimensional drift: differential shrinkage, orientation, cooling; faded | `defectdata` — solving defects for good: DOE, cavity-pressure monitoring, process monitoring |
| **Procesinstelling** `setting` | `setup` — the five settings: temperatures, injection speed, switchover point, hold pressure, cooling time | `process` (existing) — the process window | `scientific` — scientific moulding: viscosity curve, pressure-drop study, gate-freeze study; faded | `validation` — validating and monitoring: IQ/OQ/PQ, cavity-pressure sensors, SPC on part weight |
| **Matrijzen** `moulds` | `tooling` (existing) — moulds, changes, maintenance | `mouldparts` — inside a mould: gate, runners, cooling, venting, ejectors, slides | `mouldcare` — mould maintenance and changes: shot counter, preventive maintenance, SMED; faded | `newmould` — a new mould: DFM, fill simulation, T0/T1 trials, PPAP release, cost and lead time |

Existing lessons: `machine`, `cycle`, `materials`, `defects` and `tooling` sit at level 1, and `process` at level 2. All keep `worked`. New lessons: 18.

**Facts to verify:**
- Clamp force from projected area × cavity pressure, with typical cavity pressures of 300–600 bar for common materials (Kunststof Magazine or a machine maker's guide such as Arburg/Engel).
- Screw utilisation 20–80 % of the barrel's shot capacity (Arburg or Engel processing guide).
- Cooling time ∝ wall thickness² (the standard cooling-time equation; any injection-moulding handbook, e.g. Rosato).
- Drying targets: PA6 < 0.2 %; PC < 0.02 %; PET < 0.005 % (material supplier processing guides: BASF Ultramid, Covestro Makrolon).
- Scientific moulding: Kulkarni, *Robust Process Development and Scientific Molding*, Hanser.
- SPI mould classes 101–105.
- PPAP: AIAG PPAP manual, 4th edition.
- IQ/OQ/PQ: GHTF process validation guidance (medical).

### Task 8: Lijnen en automatisering (`eng.lines`) — 6 topics

| Topic (id) | Basis | Werkkennis | Gevorderd | Expert |
|---|---|---|---|---|
| **Lijnontwerp** `design` | `linebasics` — reading a line: stations, cycle time, transport, manual or automatic | `layout` (existing; **change faded → worked**) — line types, buffers, inspection | `buffers` — sizing buffers: blocking, starving, downtime × cycle time; faded | `simulation` — line simulation and ramp-up: when to simulate, variation, Little’s law |
| **Robots** `robots` | `robotbasics` — a robot: axes, gripper, teach pendant, tool centre point | `robots` (existing; **change faded → worked**) — types, reach, safety | `robotcell` — designing a robot cell: cycle time, gripper, part feeding, safety distance (ISO 13855); faded | `vision` — vision and bin picking, offline programming, when a cobot (ISO/TS 15066) |
| **Foutvrij maken** `errorproof` | `errors` — why people make errors; poka-yoke as a warning or a stop | `pokayoke` (existing; **change faded → worked**) — sensors and jigs | `sensors` — choosing sensors: inductive, capacitive, optical, vision, force-displacement; validating with reference parts; faded | `detection` — error-proofing as a strategy: PFMEA detection, escapes in ppm, master parts and daily checks |
| **Varianten en omstellen** `variants` | `variants` — several products on one line: why, and what it costs | `linechange` — changeover on an automated line: recipes, change parts, SMED | `mixed` (existing, faded) — mixed-model lines | `sequencing` — sequencing and heijunka: levelling workload, sequence rules, flexible automation |
| **Besturing en data** `control` | `plc` — PLC, sensors and actuators: how a machine "thinks" | `safety` — machine safety: emergency stop, light curtain, performance level (ISO 13849-1), CE and the EU Machinery Regulation 2023/1230 | `oee_auto` (existing, faded, line figure) — OEE on automated lines | `stoppages` — micro-stops and fault data: alarm logs, Pareto, MES link |
| **Businesscase** `business` | `autobasics` — automate or not: labour, volume, variation, quality | `payback` — payback time: investment, yearly saving, shifts | `business` (existing, faded) — the business case for automation | `risk` — risk and value: NPV, ramp-up loss, flexibility, why automation projects fail |

Existing lessons: `layout`, `robots` and `pokayoke` move to level 2 and their example becomes `worked`. Remove `ask`, and merge `reveal` into `text` so the worked example reads as one piece. `mixed`, `oee_auto` and `business` stay faded at level 3. New lessons: 18.

**Facts to verify:**
- ISO 13855 safety distance S = K·T + C (K = 2000 mm/s up to 500 mm, then 1600 mm/s).
- ISO 13849-1 performance levels a–e.
- ISO 10218-1/-2:2025 (industrial robots).
- ISO/TS 15066 (collaborative robots, power and force limiting).
- Regulation (EU) 2023/1230 applies from 20 January 2027 and replaces Directive 2006/42/EC.
- IEC 61131-3 PLC languages.
- Poka-yoke (Shingo, *Zero Quality Control*, 1986).
- Little’s law (WIP = throughput × lead time).
- Payback and NPV definitions: any corporate finance text. Cross-reference `eng.cost.capex`.

### Task 9: Content review — one review agent per module

Runs in the lane's worktree as soon as Step 4 of its lane is green. It uses the most capable model.

- [ ] **Step 1:** The review agent reads the brief and both language files in full, and checks every lesson against this list. It **fixes directly** and keeps a list of what it changed:
  1. **Recompute every number:**
     - worked-example arithmetic;
     - numeric recall answers and their tolerance (a correct answer computed with rounded inputs must fall inside the tolerance);
     - units;
     - en and nl numbers equal.
  2. **Facts:** each non-obvious claim matches the brief's facts list, and its source is confirmed. Remove or soften anything unsourced.
  3. **Clarity rule:** every number says what it measures, assumptions are stated, there is one defensible option, and every term is explained at first use (inline), with no jargon before its explanation.
  4. **Level fit:** Basis assumes nothing; Expert is really expert (a decision, trade-off or standard, not a longer Werkkennis). Levels of one topic do not repeat each other.
  5. **Natural Dutch:** read the nl text aloud in your head as a Dutch process engineer would say it. Fix calques ("maak een beslissing" becomes "neem een besluit"), English word order and stiff phrasing. Floor words over textbook words.
  6. **Recall quality:** each question tests the lesson's point, not a trick of wording. Distractors are plausible. The `why` explains.
  7. **Existing lessons:** `tests/progresskeep.test.js` is green, and each recall question still asks the same concept as in v9 (compare with `git show 3e0999d:<file>`).
- [ ] **Step 2:** `npm test` → PASS. Commit `Review: <module> content (numbers, facts, Dutch)`.
- [ ] **Step 3:** The integrator spot-checks 3 lessons per module (one Basis, one Gevorderd, one Expert) against the clarity rule, then merges the worktree (integration rules), bumps CACHE, runs `npm test` and the full e2e, pushes and live-verifies. Add a ledger line with the review's change count.

### Task 10: Integration on real content — e2e and Today checks per module

After Task 4 and the first module merge; repeat the e2e part for each merged module.

- [ ] **Step 1:** Replace the Task 3/4 fixture route with the real `eng.machining` (first merged module). The steps `topics: level chips` and `topics: where you are` now run on real data:
  - seed v9-style progress (`cutting` owned, `processes` passed, `cnc` passed earlier);
  - the Draaien row shows Basis passed and Werkkennis owned;
  - Gevorderd (`turnfinish`) is `.next`, because Draaien is the most recent topic;
  - the CNC row shows Basis passed;
  - play `turnfinish`: the faded example shows `.example-ask`, then Reveal;
  - after the pass, Today suggests Draaien · Expert.
  Screenshots `115-real-topics`, `115-real-topics-dark`, `116-faded-gevorderd`.
- [ ] **Step 2:** For each other merged module, one e2e step opens its course row, taps a Basis chip of a new lesson and reads one teach card with a tappable term (`.teach-card .term`). Screenshot `117-<module>-basis`.
- [ ] **Step 3:** Today regression check. In e2e, a fresh state's Engineering Today pick is the same lesson as before v10: `recommendedModule` orders by `level`; machining is level 1 and its first lesson is still `processes`. Assert this explicitly.
- [ ] **Step 4:** Commit `e2e: topic modules on real content`. CACHE only if a shipped file changed.

---

## Figures (Task 11 waves, Task 12 optional upgrades)

### Mapping (chosen): one figure per topic, reused across its four levels, plus extras

He chose "one per physical lesson". With 96 lessons that would mean 96 figures, many of them showing the same machine. Instead, **each topic gets one figure of its machine or object**, used on all four levels. The page reads `?level=1..4` and opens in a level-appropriate state:
- **level 1** shows the object with its parts named on tap and one simple control;
- **level 2** adds the main working controls and readout;
- **level 3** adds the trade-off control;
- **level 4** adds the cost or capability readout.
Where a deeper level needs a **different object**, an extra figure overrides it for those levels. Every lesson of a topic carries the `figure` field (the same id in en and nl).

**Count: 24 new figures** (machining 7, joining 6, moulding 5, lines 6), plus 4 existing ones that are reused and optionally upgraded to read `level` (Task 12). If `eng.flow.line` already shows buffers, `eng.lines.buffer` reuses it and the count is 23.

| # | Figure id | Topic · levels | Object | Interaction and readout (true small model) |
|---|---|---|---|---|
| — | `eng.machining.lathe` (exists) | Draaien · 1–4 | Lathe, chuck, insert, bar | Vc, f, ap → rpm, cutting time; Task 12: L3 Ra = f²/(32·rε) |
| 1 | `eng.machining.mill` | Frezen · 1–3 | Vertical machining centre with face mill on a block | n, fz, z, ae → vf, Q (cm³/min); L3 climb/conventional toggle with chip-thickness view |
| 2 | `eng.machining.fiveaxis` | Frezen · 4 | Trunnion-table 5-axis machine with a part on 5 faces | 3-axis + re-clamps vs 3+2 vs simultaneous → setups, cumulative position error (± per re-clamp), cycle time |
| 3 | `eng.machining.drill` | Boren · 1–4 | Drill in a block with coolant | D, Vc, f, depth → rpm, time per hole, peck needed at depth/D > about 3; L2 tap/ream swap; L4 drift → position error |
| 4 | `eng.machining.gcode` | CNC-programma · 1–4 | Machine with control panel showing a 10-line program | Step through lines, tool traces path; L3 wrong G54 → crash marker; L4 two toolpaths → time |
| 5 | `eng.machining.insert` | Gereedschap · 1–4 | Insert on holder, close-up with flank wear land | Vc → wear growth, tool life (Taylor); L4 cost per part vs Vc with the economic optimum |
| 6 | `eng.machining.fixture` | Opspanning en meten · 1–2 | Fixture plate, 3-2-1 locators, clamps, part | Remove a locator → part can move (degree of freedom readout); clamp force → distortion µm |
| 7 | `eng.machining.cmm` | Opspanning en meten · 3–4 | CMM probing a bore | Instrument uncertainty vs tolerance → % of tolerance used (10 % rule); L4 GR&R % and a Cpk readout |
| 8 | `eng.joining.mig` | Booglassen · 1–3 | MIG torch over a plate with wire and gas nozzle | U, I, travel speed → heat input kJ/mm (EN 1011-1), bead width; L3 out-of-WPS-range warning |
| 9 | `eng.joining.haz` | Booglassen · 4 | Cross-section of a fillet weld with the HAZ | Preheat, heat input → cooling time t8/5 band, hardness and cracking risk (qualitative bands from EN 1011-2) |
| 10 | `eng.joining.spot` | Puntlassen · 1–4 | Two electrodes squeezing two sheets | I, t, F → nugget diameter vs 4√t, expulsion; L2 weld count → tip growth; L4 weld lobe |
| 11 | `eng.joining.ndt` | Lasfouten en inspectie · 1–4 | Butt-weld coupon with hidden defects, UT probe | Slide the probe → A-scan echo; L1 surface defects named; L4 acceptance level B/C/D → pass/fail |
| — | `eng.joining.bolt` (exists) | Boutverbindingen · 1–4 | Bolted flange, torque wrench | Torque, friction → preload band; Task 12: L3 torque-angle, L4 joint diagram |
| 12 | `eng.joining.rivet` | Lijmen en mechanisch · 1–4 | Lap joint: adhesive / SPR / clinch toggle | Load direction shear vs peel → failure mode and relative strength (qualitative, sourced) |
| 13 | `eng.joining.cell` | Lassen in productie · 1–4 | Robot weld cell with a two-station positioner | Load time, weld time → arc-on %, parts/h; L3 cost per metre |
| 14 | `eng.moulding.screw` | De machine · 1–4 | Cutaway barrel and screw, check ring, clamp | Shot volume → screw utilisation %; projected area × cavity pressure → clamp force vs machine tonnage |
| — | `eng.moulding.cycle` (exists) | Cyclus en output · 1–4 | Machine with mould | Wall thickness → cooling and cycle time, parts/h; Task 12: L3 cavities slider |
| 15 | `eng.moulding.dryer` | Kunststoffen · 1–4 | Dryer hopper on the machine with pellets | Material, dew point, temperature, residence time → moisture vs limit; L4 regrind % |
| 16 | `eng.moulding.part` | Fouten · 1–4 | A moulded box on the take-out | Hold pressure, melt temperature, clamp force, cooling → short shot, flash, sink, warp appear on the part |
| 17 | `eng.moulding.window` | Procesinstelling · 1–4 | Machine control panel plus the part on a scale | Melt temperature × hold pressure → window (short / good / flash), part weight; L3 gate-freeze: weight vs hold time |
| 18 | `eng.moulding.mould` | Matrijzen · 1–4 | Two-plate mould opening, cavities, runners, cooling, ejectors | Cold vs hot runner → runner waste g/shot, cycle; L3 shot counter vs maintenance interval |
| 19 | `eng.lines.buffer` (or reuse `eng.flow.line`) | Lijnontwerp · 1–4 | Four stations on a conveyor with buffers | Buffer size, a station's downtime → blocking/starving, line output |
| 20 | `eng.lines.robotcell` | Robots · 1–4 | 6-axis robot in a fenced cell with a light curtain | Industrial vs cobot, speed → cycle time; safety distance S = K·T + C (ISO 13855) |
| 21 | `eng.lines.pokayoke` | Foutvrij maken · 1–4 | Assembly jig with orientation pin and presence sensor | Warn vs stop, sensor on/off → escapes per million |
| 22 | `eng.lines.mixed` | Varianten en omstellen · 1–4 | Line with three variant carriers | Batch vs sequence → workload peak at the slow station, WIP; L2 changeover time |
| 23 | `eng.lines.plc` | Besturing en data · 1, 2, 4 | Cabinet: sensor → PLC → valve → cylinder, e-stop chain | Step the logic; L2 break the e-stop chain → safe stop; L4 alarm log → Pareto |
| — | `eng.lines.auto` (exists) | Besturing en data · 3 | Four-station line with a robot cell | Availability, micro-stops → OEE (unchanged) |
| 24 | `eng.lines.case` | Businesscase · 1–4 | Operator station next to a robot station | Shifts, wage, investment, volume → payback years; L4 NPV with a ramp-up loss |

**Figure page contract (every new figure):**
- built like `figures/eng.maintenance.pf/build.mjs`, with the anatomy kit inlined and the model stated in the build header with its formula and source;
- `?theme=light|dark`, `?lang=nl|en`, `?level=1..4` (default 2);
- Vantage palette only (no gold `#F2D88C` family);
- legible at 390 px, with the hint line clear of the frame;
- `--audit` and line checks at zero;
- no network.

### Task 11: Figure waves (3 agents in parallel per wave)

A wave starts only when its modules' content review (Task 9) has merged, because the figure must match the final text.

| Wave | Figures |
|---|---|
| F1 | `eng.machining.mill`, `eng.machining.drill`, `eng.machining.gcode` |
| F2 | `eng.machining.insert`, `eng.machining.fixture`, `eng.machining.cmm` |
| F3 | `eng.machining.fiveaxis`, `eng.joining.mig`, `eng.joining.spot` |
| F4 | `eng.joining.ndt`, `eng.joining.rivet`, `eng.joining.cell` |
| F5 | `eng.joining.haz`, `eng.moulding.screw`, `eng.moulding.dryer` |
| F6 | `eng.moulding.part`, `eng.moulding.window`, `eng.moulding.mould` |
| F7 | `eng.lines.buffer` (or the reuse decision), `eng.lines.robotcell`, `eng.lines.pokayoke` |
| F8 | `eng.lines.mixed`, `eng.lines.plc`, `eng.lines.case` |

Per figure agent:
- [ ] **Step 1:** Load `anthropic-skills:anatomy`; Figure size; the table row above; the four lessons of the topic (their teach text and numbers) so the model and words match the lesson. Write `figures/<id>/build.mjs`, run it, run `--audit`.
- [ ] **Step 2:** Add `figure: '<id>'` to the topic's lessons in **both** language files: all four levels, or the levels named in the table. Extra figures override the topic figure for their levels.
- [ ] **Step 3:** Return the wiring list to the integrator; agents do not edit `sw.js`. The integrator adds the HTML to `SHELL`, bumps `CACHE` once per wave, and runs `npm test`. **Expected:** "every shipped figure file exists and is in the shell" is green.
- [ ] **Step 4: e2e step** `figures wave Fn`: for each figure, open one lesson of its topic at level 1 and one at level 3 or 4, go to the last teach card, and assert that `.figure-wrap iframe` is loaded with the right `level=`. Screenshots `120-fig-<id>-l1` light and `120-fig-<id>-l3-dark`. Read every one of them: the parts are named, the readout makes sense, and nothing is clipped at 390 px.
- [ ] **Step 5:** Commit per figure `Add figure: <title>`; the integrator pushes once per wave and live-verifies one figure.

### Task 12 (optional, after F8): level-aware upgrades of the four existing figures

`eng.machining.lathe`, `eng.joining.bolt`, `eng.moulding.cycle` and `eng.lines.auto` learn `?level=`, as in the table (one wave of 3 plus 1). Without this task they still work on all levels in their v9 state.

---

## Final review

- [ ] A fresh whole-branch review subagent (most capable model) reviews the v10 range against the spec's Review Focus and this plan's. It checks in particular:
  - the progresskeep test and the v9-state fixture;
  - every v9 Today test unchanged;
  - no `.btn-primary` added;
  - `checkTopics` covering every rule;
  - no new state key;
  - `sync.js` untouched.
  Then one fix pass with failing tests first; minors go to the v10 ledger.
- [ ] **First-time-user check** (fresh agent, screenshots only, light and dark). The five v8 tasks plus:
  - (6) open Verspanen and find which levels of Draaien are passed;
  - (7) start the suggested next level;
  - (8) open the Expert level of Frezen directly, without being blocked;
  - (9) tell from the lesson screen which topic and level it is.
  Each must take ≤ 2 taps from course home. Any miss is a finding to fix.
- [ ] **Live verify** on GitHub Pages after the last push:
  - the CACHE version;
  - one lesson per module at Basis and Expert;
  - one figure per module at level 1 and 4;
  - offline reload (SW) of one new lesson.
- [ ] Short note to Merijn:
  - what is new;
  - the depth-first suggestion and the breadth-first alternative (his choice);
  - three things to try:
    1. Draaien from Basis to Expert this week;
    2. before a client visit, the Expert level of the process they run;
    3. tap every underlined word you would not dare to say out loud yet.

## Size and realism

- **Engine + UI (Tasks 0–4):** about 5 focused agent tasks, about 600 lines of code and tests in total. One session.
- **Content (Tasks 5–9):** 72 new lessons × 2 languages ≈ 10,000 lines of content, plus rework of 24 lessons, 8 content agents (2 per module) and 4 review agents. Four lanes in parallel take about 2 sessions including reviews and merges. Each module ships on its own once reviewed, so Merijn gets Verspanen first.
- **Figures (Tasks 11–12):** 24 figures of about 800–1,000 dev-only lines each, in 8 waves of 3 (+1 optional). About 2–3 sessions. Figures ship per wave; lessons work without them.
- **Total:** about 5–6 sessions. Ship order: engine + UI → Verspanen → Lassen → Spuitgieten → Lijnen → figures by wave.

## Deferred (do not build now)

- Recency-based `recommendedModule` across modules (today: the first started module in index order). It changes v9 picks, so it waits until he asks.
- Topics and levels for other engineering modules (`eng.flow`, `eng.quality`, grid). The engine supports them; content decides.
- Topic-level maintenance questions or a topic filter for due sessions.
- A "read but not passed" chip state.
- Breadth-first suggestion mode, unless Merijn picks it (a one-function change).

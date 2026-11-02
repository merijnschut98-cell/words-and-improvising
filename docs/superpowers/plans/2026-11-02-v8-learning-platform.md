# v8: Learning platform (engineering and project courses) — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two knowledge courses (Engineering, Projecten) next to the speaking trainer, with lessons, spaced relearning, situations and say-it rounds, in Dutch and English, offline, without touching how speaking works.

**Architecture:** A subject bar on Home switches between the unchanged speaking home and a course home per subject. Course content is data: one module per file per language under `src/content/courses/`, loaded with dynamic `import()`; a small index renders the module map without loading bodies. A pure engine (`src/core/course.js`, `src/core/coursereview.js`) owns quiz flow, relearning, mastery, XP and the course Today pick; thin UI screens render it. Progress lives in two new state keys (`courses`, `courseReviews`) in the same localStorage blob.

**Tech Stack:** Vanilla ES modules, no build step; `node --test`; Playwright e2e (`e2e/smoke.mjs`, port 8123); GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-11-02-learning-platform-design.md`

## Global Constraints

- Vanilla ES modules, no build step, no backend. Everything works without an API key.
- One localStorage blob `spraakwater:v1`, merged with `defaultState()`; new keys get defaults, coercion in `load()` and a storage test.
- `sw.js` stays a classic script; bump `CACHE` on every shipped change; `tests/sw.test.js` walks `src/` so every new file (content included) must be in `SHELL`.
- en/nl strings in parity (test enforces). Content ids identical in en and nl.
- No `null`/`undefined`/`NaN` rendered: filter children with `.filter(Boolean)` or ternaries to `null` (which `h()` drops).
- No straight apostrophes inside single-quoted strings (use ’). No `<` or `>` in content text; free text and content as text nodes only, never `html:`.
- aria-labels from i18n. Focus moves to the screen heading (`h1` or `.round-title`) on navigation.
- No new reward layers: courses add to the existing `xp`, `days` and `streak`, nothing else.
- Mobile-first; existing CSS tokens and card styles; touch targets ≥ 44 px.
- Branch `claude/improvisation-practice-game-voon91` only; never merge PR #1. Commit trailers as in the session instructions.
- Each UI task: unit tests first, `npm test`, `node e2e/smoke.mjs <scratchpad>/shots` with a new step, look at the screenshots, commit, push.
- The speaking subject must behave exactly as before: the existing e2e steps stay green with no selector changes except the ones Task 6 names.

## Review Focus

1. A module file that fails to `import()` (offline before it was cached, or a typo in the index): the course home still renders and the lesson screen shows a retry, never a blank screen. Test pinned in Task 7.
2. Switching language mid-course: lesson progress keyed by id is shared, the relearning queue is per language, and nothing shows the other language's text. Test pinned in Task 3 and Task 6.
3. A numeric recall question with a float answer (e.g. 0.85 ± 0.02) is judged with tolerance, never `===`. Test pinned in Task 4.
4. A lesson passed and a due session on the same day each count once toward `days[today]` and the streak; retaking a passed lesson gives no XP again. Test pinned in Task 4.
5. A due session never mixes subjects, and with fewer than 10 due questions it still runs (down to 1). Test pinned in Task 3.

---

## File structure

**Create**
- `src/content/courses/index.js` — `SUBJECTS`, `TRACKS`, `MODULES` (metadata only) and `loadModule(subject, moduleId, lang)`.
- `src/content/courses/validate.js` — `validateModule(en, nl, meta) -> string[]` (used by tests and by content subagents).
- `src/content/courses/eng/<module>.<lang>.js`, `src/content/courses/pm/<module>.<lang>.js` — lesson bodies.
- `src/core/coursereview.js` — relearning queue (Leitner, owned at box 4, interleaved within a track).
- `src/core/course.js` — quiz state machine, judging, lesson progress, XP/day/streak application, mastery, recommended module, Today pick, glossary.
- `src/core/coursecoach.js` — request builders and parsers for "explain in my situation" and "grade my situation answer".
- `src/ui/subjectbar.js`, `src/ui/coursehome.js`, `src/ui/lesson.js`, `src/ui/quiz.js`, `src/ui/due.js`, `src/ui/situation.js`, `src/ui/glossary.js`.
- `tests/coursecontent.test.js`, `tests/coursereview.test.js`, `tests/course.test.js`, `tests/coursecoach.test.js`.

**Modify**
- `src/core/storage.js` (defaults + coercion), `src/app.js` (screens, `openModule`, `applyCourse`), `src/ui/home.js` (subject bar + course home routing), `src/ui/progress.js` (subject tab), `src/i18n.js`, `styles.css`, `sw.js`, `e2e/smoke.mjs`, `tests/storage.test.js`.

---

### Task 1: Content schema, index and validator

**Files:**
- Create: `src/content/courses/index.js`, `src/content/courses/validate.js`
- Test: `tests/coursecontent.test.js`

**Interfaces:**
- Produces:
  - `SUBJECTS = ['eng', 'pm']`
  - `TRACKS = { eng: ['basics', 'discrete', 'grid'], pm: ['project'] }`
  - `MODULES: Array<{ id, subject, track, level: 1|2|3|4, title: { en, nl }, blurb: { en, nl }, lessons: string[], questions: { [lessonId]: number } }>` — module ids are `'<subject>.<slug>'` (e.g. `'eng.flow'`, `'pm.intake'`); lesson ids are `'<moduleId>.<slug>'` (e.g. `'eng.flow.takt'`). Titles and blurbs live in the index (not i18n) so the map renders without loading bodies; lesson titles live in the content files. `questions` is the recall count per lesson, asserted equal to the file by the content test.
  - `moduleOf(lessonId) -> moduleId`, `trackOf(moduleId) -> track`, `subjectOf(id) -> subject`
  - `loadModule(subject, moduleId, lang) -> Promise<{ lessons: Lesson[] }>` using `import(\`./${subject}/${slug}.${lang}.js\`)`; rejects on failure (callers handle).
  - `validateModule(en, nl, meta) -> string[]` of human-readable problems; `[]` when valid. Checks: same lesson ids in both, ids equal `meta.lessons`, each lesson has `title`, 1–2 `pre`, 3–5 `teach` blocks each ≤ 90 words, `example.kind` in `{worked, faded}` matching level (`faded` only when `meta.level >= 3`), `said`, 3–5 `recall`, each choice question has 4 options and `answer` in `options`, each numeric question has `number`, `tolerance > 0`, `unit`; `situation` with `scene`, `ask`, `model`, `rubric` of exactly 3; `sayIt`; 2–4 `terms` with `term` and `def`; no `<` or `>` anywhere; `why` present on every question.

- [x] **Step 1: Write the failing tests** in `tests/coursecontent.test.js`:

```js
test('index: every module has a known subject and track, ≥ 3 lessons, level 1–4, titles in both languages', ...)
test('validateModule: a valid fixture passes', () => assert.deepEqual(validateModule(fxEn, fxNl, fxMeta), []))
test('validateModule: flags a missing lesson in nl, an answer not in options, a numeric question without tolerance, a faded example at level 1, and a "<" in text', ...)
test('every shipped module validates and its files are listed in sw.js SHELL', async () => { for (const m of MODULES) { const en = await loadModule(...); const nl = ...; assert.deepEqual(validateModule(en, nl, m), [], m.id); } })
```
The fixture is a minimal two-lesson module defined inside the test file.

- [x] **Step 2: Run** `node --test tests/coursecontent.test.js` → FAIL (module not found).
- [x] **Step 3: Implement** `index.js` with `MODULES = []` for now and `validate.js`.
- [x] **Step 4: Run** → PASS (the shipped-modules test passes vacuously).
- [x] **Step 5: Commit** `Add course content index and validator`.

### Task 2: Storage defaults and coercion

**Files:**
- Modify: `src/core/storage.js`
- Test: `tests/storage.test.js`

**Interfaces:**
- Produces: `defaultState().courses = { eng: { lessons: {}, sessions: [] }, pm: { lessons: {}, sessions: [] } }`, `defaultState().courseReviews = {}`, `defaultState().ui.subject` absent by default (treated as `'speak'`). `load()` coerces: `courses` object with both subjects present (missing one is filled from defaults; a non-object `lessons` → `{}`, non-array `sessions` → `[]`), `courseReviews` object, `ui.subject` one of `'speak'|'eng'|'pm'` else deleted.

- [x] **Step 1: Write failing tests**: `courses and courseReviews default and coerce`, asserting the three coercions above and that a valid blob round-trips unchanged.
- [x] **Step 2: Run** → FAIL.
- [x] **Step 3: Implement** in `defaultState()` and the coercion block of `load()`.
- [x] **Step 4: Run** `npm test` → all pass.
- [x] **Step 5: Commit** `Add course state to storage`.

### Task 3: Relearning queue

**Files:**
- Create: `src/core/coursereview.js`
- Test: `tests/coursereview.test.js`

**Interfaces:**
- Consumes: `INTERVALS` and the `addDays` idea from `src/core/spaced.js` (re-export `INTERVALS`; copy `addDays` or export it from spaced.js), `trackOf`, `moduleOf` from the index.
- Produces:
  - `questionKey(lang, questionId) -> 'lang|questionId'`; question ids are `'<lessonId>#r<n>'` for recall and `'<lessonId>#p<n>'` for prequestions (only recall questions enter the queue).
  - `scheduleCourseReview(reviews, { questionId, lessonId, subject, lang }, today, correct) -> reviews` — correct: box + 1, due = today + INTERVALS[box-1]; at box 4 the entry stays with `owned: true` and due = today + 21; miss: box 1, due tomorrow. First sighting after a quiz: correct → box 2? No: the quiz itself is session 1, so a correct first answer creates the entry at **box 2** due in 3 days; a miss creates box 1 due tomorrow.
  - `isOwned(reviews, lang, questionId) -> boolean` (box ≥ 4).
  - `dueCourseQuestions(reviews, today, subject, lang) -> Array<{ questionId, lessonId, box, due }>` sorted by due, oldest first; lapse window 60 days like speaking reviews.
  - `dueSession(reviews, today, subject, lang, rng, max = 10) -> questionIds[]` — groups due questions by track (via `trackOf(moduleOf(lessonId))`), picks the track with the most due, interleaves its modules round-robin, seeded shuffle within module, caps at `max`; returns `[]` when nothing is due. Never includes another subject.
  - `maintenanceQuestion(reviews, today, subject, lang) -> questionId | null` — among owned questions, the one with the oldest `due`, at most one per ISO week per subject (tracked by `lastMaintenance[subject] = isoWeek` inside `reviews._meta`).

- [x] **Step 1: Failing tests**: box progression to owned after three spaced correct answers (quiz, +3 days, +7 days → box 4 `owned`); a miss resets to box 1; `dueSession` with 3 eng tracks picks the busiest track and alternates modules; `dueSession` with 1 due question returns 1; a pm question never appears in an eng session; per-language keys keep en and nl separate (Review Focus 2, 5).
- [x] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run** → PASS.
- [x] **Step 5: Commit** `Add course relearning queue`.

### Task 4: Course engine: quiz, judging, progress, XP

**Files:**
- Create: `src/core/course.js`
- Test: `tests/course.test.js`

**Interfaces:**
- Consumes: Task 3 functions; `updateStreak`, `dayKey` from progress.js.
- Produces:
  - `judge(question, answer) -> boolean` — choice: `answer === question.answer`; numeric: `Math.abs(Number(answer) - question.number) <= question.tolerance` and `Number.isFinite`.
  - `startQuiz(questions) -> { order: number[], i: 0, answers: {}, phase: 'ask' }` where `questions` are `{ id, ...question }`.
  - `answerQuiz(state, questions, value) -> state` — records, advances `i`; when the pass ends, `phase: 'review'` with `misses: number[]`; `continueQuiz(state) -> state` moves from review to a second pass over misses (`phase: 'ask'`, `order = misses`, `pass: 2`), or to `phase: 'done'` when clean. Every question ends correct exactly once; `firstTry: { [id]: boolean }` records the first-pass result (that is what the queue schedules on).
  - `applyLesson(state, { subject, lessonId, firstTry, lang }, today, now) -> { state, xp }` — marks `read` and `passed` (first pass only sets `passed` once), schedules each recall question with `firstTry[id]`, adds 20 XP on the first pass of that lesson, 0 on a retake, logs a session `{ day, kind: 'lesson', correct, total, ts }`, increments `days[today]` once per call, updates the streak.
  - `applyDue(state, { subject, results: { [questionId]: boolean }, lang }, today, now) -> { state, xp }` — schedules each, XP = 10 + correct capped at 20, logs `kind: 'due'`, increments `days[today]`, updates streak.
  - `applySituation(state, { subject, lessonId, pts }, today, now) -> { state, xp }` — stores `{ pts, ts }`, 10 XP the first time only, logs `kind: 'situation'`; does **not** count as a round.
  - `markSayIt(state, subject, lessonId, now) -> state`.
  - `sessions` capped at 200 per subject.

- [ ] **Step 1: Failing tests**: numeric tolerance (0.85 vs 0.86 with tolerance 0.02 passes; 0.9 fails) (Review Focus 3); quiz with one miss goes ask → review → ask(misses) → done and `firstTry` holds the first result; `applyLesson` twice on one day: XP 20 then 0, `days[today]` 2 (two sessions), `passed` timestamp unchanged; `applyDue` XP cap; `applySituation` no day increment; streak updates.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `Add course engine: quiz, judging and progress`.

### Task 5: Mastery, recommendation, Today pick, glossary

**Files:**
- Modify: `src/core/course.js`
- Test: `tests/course.test.js`

**Interfaces:**
- Produces:
  - `moduleMastery(state, meta, lang) -> 'learn'|'practise'|'own'` — all lessons passed → practise; all recall questions of all lessons owned → own. Uses `meta.questions` from the index entry.
  - `recommendedModule(state, subject, lang) -> moduleId` — the lowest-level module in the subject's first track that is not owned, preferring a track with a module in progress; ties by index order.
  - `nextLesson(state, moduleId, meta) -> lessonId | null` — first unpassed lesson.
  - `courseTodayPick(state, subject, lang, today) -> { reason: 'due'|'lesson'|'situation'|'sayIt'|'maintain'|'done', moduleId?, lessonId?, questionIds? }` in the spec's order; `'done'` when nothing applies.
  - `glossary(modules: Array<{ id, lessons }>) -> Array<{ term, def, lessonId }>` sorted by term, case-insensitive, Dutch and English handled by `localeCompare`.

- [ ] **Step 1: Failing tests**: mastery thresholds; recommendation walks levels in order and never returns an owned module unless all are owned; Today order (due ≥ 5 beats lesson; lesson beats situation; `'done'` when all done and nothing due); deterministic for the same state and day; glossary sort.
- [ ] **Step 2–4: RED → implement → GREEN.**
- [ ] **Step 5: Commit** `Add course mastery and today pick`.

### Task 6: Subject bar and course home

**Files:**
- Create: `src/ui/subjectbar.js`, `src/ui/coursehome.js`
- Modify: `src/ui/home.js` (render the bar above everything; when `ui.subject` is a course, render `renderCourseHome` instead of the speaking body), `src/app.js` (`app.subject` getter, `app.setSubject(id)`, `app.openModule(subject, moduleId)` that calls `loadModule` and caches the result in `app.modules[subject][moduleId]`, `app.go('lesson', …)` etc.), `src/i18n.js`, `styles.css`, `sw.js`, `e2e/smoke.mjs`

**Interfaces:**
- Consumes: Task 5 functions, `MODULES`, `TRACKS`.
- Produces: screen names `'lesson'`, `'due'`, `'situation'`, `'glossary'` registered in `SCREENS` (stubs that render a title and a back button until Tasks 7–10 fill them). `app.content` stays the speaking content; course bodies live in `app.modules`.
- UI: subject bar = three `button`s with `aria-pressed`, class `subject-bar`, each with icon and label (`subject_speak`, `subject_eng`, `subject_pm`). Course home = `today-card` reused (same classes) with a course reason line (`courseWhy_<reason>`), a `due-card` ("N vragen · 2 min") when due > 0, then the module map: one `section.card.track` per track with `h2` track title (`track_<track>`), module rows as buttons (`module-row`) showing title, level pill (`level_<n>`), mastery badge (reuse `masteryBadge` classes), and lesson count "3/6". A `glossary` ghost button at the bottom.
- i18n keys (en+nl): `subject_*`, `track_*` (4), `level_1..4`, `courseWhy_*` (6), `dueCard` (n) => …, `glossary`, `moduleLessons` (done, total) => …, `courseDone`.

- [ ] **Step 1: Failing unit test** (in `tests/course.test.js`): `courseTodayPick` on an empty state returns `{ reason: 'lesson', moduleId: <first level-1 module>, lessonId: <its first lesson> }` for both subjects (needs Task 11's first module in the index; until then use the index entries added in Task 11a Step 1 — see ordering note below).
- [ ] **Step 2: Implement** bar, course home, app wiring, stubs, strings, CSS (`.subject-bar` sticky under the header, horizontal, 44 px targets; `.module-row` full-width button with grid of title/pills).
- [ ] **Step 3: e2e step** `subject bar switches to Engineering and back; speaking home unchanged`: click ⚙️, expect `.subject-bar [aria-pressed="true"]` text to contain "Engineering", `.track` count ≥ 1, screenshot `60-course-home`; click 🎙, expect `.btn-hero` visible. Add a step at the very start of the suite that asserts the default subject is speaking so all older steps keep working. Run the whole suite; all older steps green.
- [ ] **Step 4: `npm test`**, bump `CACHE`, add new files to `SHELL`.
- [ ] **Step 5: Commit** `Add subject bar and course home`.

**Ordering note:** Task 6 needs at least one real module per subject in the index to show anything. Run Task 11a (two seed modules) **before** Task 6, after Task 5. The plan lists it later for readability only; the ledger records the order.

### Task 7: Lesson screen

**Files:**
- Create: `src/ui/lesson.js`, `src/ui/quiz.js`
- Modify: `src/app.js`, `src/i18n.js`, `styles.css`, `sw.js`, `e2e/smoke.mjs`

**Interfaces:**
- Consumes: `startQuiz/answerQuiz/continueQuiz/judge/applyLesson` (Task 4), `app.openModule`.
- Produces: `renderQuiz(app, { questions, onDone(firstTry) }, root) -> cleanup` shared by lesson and due screens: one question per card, 4 option buttons (`.opt`) or a numeric input with unit, Next; review phase lists every question with ✓/✗, the right answer and `why`; second pass over misses; calls `onDone` with `firstTry`. `renderLesson(app, { subject, moduleId, lessonId }, root)`: loads the module (shows `.loading` then content; on rejection shows `.load-error` with a Retry button and a Back button; Review Focus 1), then phases `pre` → `teach` (one block per card, Next, progress dots) → `example` (`worked`: text; `faded`: ask + textarea + Reveal) → `quiz` → `done` card with XP, "Situation" and "Say it" buttons (enabled now that it is passed), "Back to course".
- Say-it: `app.go('round', { prompt: { id: \`course:${lessonId}\`, drill: 'explain', body: lesson.sayIt, extra: { course: { subject, lessonId, terms } }, seenIds: [] }, modifier: null })`; `share.js` `isRebuildableId` must return false for `course:` ids (so it never enters the speaking review queue); `round.js` finishing calls `markSayIt` when `prompt.extra.course` exists.
- i18n: `lessonPre`, `lessonTeach`, `lessonExample`, `lessonWhatNext`, `reveal`, `quizNext`, `quizReview`, `quizAgain`, `quizClean`, `lessonPassed` (xp) => …, `openSituation`, `openSayIt`, `backToCourse`, `loadError`, `retry`, `numericPh`.

- [ ] **Step 1: Failing unit tests**: `isRebuildableId('course:eng.flow.takt') === false`; quiz state transitions already covered; add `lessonPhases(lesson) -> ['pre','teach','example','quiz']` with `'pre'` omitted when `lesson.pre` is empty (pure helper in course.js).
- [ ] **Step 2: Implement** screens and wiring.
- [ ] **Step 3: e2e step** `a full lesson: pretest, teach, example, quiz with one miss, review, pass`: open Engineering, tap the Today card, answer the pretest, tap Next through blocks, answer the quiz with one deliberate wrong option, see `.quiz-review` with one ✗, re-answer, see `.lesson-done` with "+20", screenshot `61-lesson-done`; then assert `localStorage` has `courses.eng.lessons[<id>].passed`. Add a step `lesson load failure shows retry` by routing one module path to a 404 with `page.route` before opening it, expect `.load-error`, unroute, tap Retry, expect the lesson.
- [ ] **Step 4: `npm test`, e2e all green, CACHE, SHELL. Step 5: Commit** `Add the lesson screen`.

### Task 8: Due session screen

**Files:**
- Create: `src/ui/due.js`
- Modify: `src/app.js`, `src/i18n.js`, `e2e/smoke.mjs`, `sw.js`

**Interfaces:**
- Consumes: `dueSession` (Task 3), `renderQuiz` (Task 7), `applyDue` (Task 4), `app.openModule` for each lesson's module (load all needed modules, in parallel, before rendering).
- Produces: `renderDue(app, { subject }, root)`: loads, runs `renderQuiz` on the due questions (question text looked up by id from the loaded modules), on done calls `applyDue` with first-try results, shows a done card with XP and "N owned now" (count of questions that reached box 4 this session).
- i18n: `dueTitle`, `dueDone` (xp, owned) => …, `dueNone`.

- [ ] **Step 1: Failing unit test**: `questionById(modules, questionId) -> question | null` (pure, course.js) resolves `'<lessonId>#r2'` to the third recall question and returns `null` for unknown ids.
- [ ] **Step 2: Implement.**
- [ ] **Step 3: e2e step** `due session: seed 4 due questions, answer, XP and boxes move`: seed `courseReviews` with 4 eng entries due yesterday (ids from the passed lesson of the previous step), reload, course home shows `.due-card` "4", open it, answer all correctly, done card shows XP, storage shows box 3 for each. Screenshot `62-due-done`.
- [ ] **Step 4–5:** tests, CACHE, SHELL, commit `Add due sessions`.

### Task 9: Situation screen and coach helpers

**Files:**
- Create: `src/ui/situation.js`, `src/core/coursecoach.js`
- Modify: `src/ui/lesson.js` (buttons), `src/core/coach.js` (brief mentions `prompt.extra.course.terms` when present), `src/app.js`, `src/i18n.js`, `e2e/smoke.mjs`, `sw.js`
- Test: `tests/coursecoach.test.js`, `tests/coach.test.js`

**Interfaces:**
- Produces (coursecoach.js):
  - `buildGradeRequest({ lesson, answer, lang, model }) -> params` with `withFallbacks`, JSON schema `{ points: [int 0..1 ×3], missed: string }`, system prompt in `lang`, user content = scene, ask, rubric lines and the answer (text only).
  - `parseGrade(message) -> { ok, points: number[3], missed } | { ok: false, error }` — clamps to 0/1, `missed` ≤ 240 chars.
  - `runGrade(apiKey, args, loadSdk)`.
  - `buildExplainRequest({ lesson, context, lang, model })` — teach blocks are NOT sent; terms, title and the user's one-line context are; max 300 tokens; `parseExplain(message) -> { ok, text }` ≤ 600 chars; `runExplain`.
- UI: `renderSituation(app, { subject, moduleId, lessonId }, root)`: scene, ask, textarea (or mic button reusing `speech.js` recognizer when supported, appending the transcript to the textarea), Submit → with key: coach grade with the local self-rating as fallback on any error; without key: three rubric checkboxes (0–3) → model answer shown → Done applies `applySituation`. On the lesson's teach phase a ghost button "Explain this for my situation" (only when a key is set) opens an inline input for one line of context, then shows the answer under the blocks.
- i18n: `sitTitle`, `sitAsk`, `sitAnswerPh`, `sitSubmit`, `sitSelfRate`, `sitModel`, `sitPoints` (n) => …, `sitDone`, `explainMine`, `explainCtxPh`, `coachMissed`.

- [ ] **Step 1: Failing tests**: request contains the answer and the three rubric lines and not the teach blocks; `parseGrade` clamps `[2, -1, 1]` to `[1, 0, 1]` and rejects a non-JSON message; explain request has no teach text; coach brief includes the terms when `extra.course` is set.
- [ ] **Step 2: Implement.**
- [ ] **Step 3: e2e steps** `situation without a key: self-rate 2 of 3, 10 XP once` (screenshot `63-situation`) and `say-it round from a lesson runs through the round screen and marks sayIt` (typing mode; the fake SDK branch is not needed).
- [ ] **Step 4–5:** tests, CACHE, SHELL, commit `Add situations and course coach helpers`.

### Task 10: Glossary, Progress tab, backup

**Files:**
- Create: `src/ui/glossary.js`
- Modify: `src/ui/progress.js` (subject tabs: Spreken | Engineering | Projecten; course tab shows per track "owned / total" rows, due count, 14-day strip of `sessions`, last 5 situations with points), `src/app.js`, `src/i18n.js`, `styles.css`, `e2e/smoke.mjs`, `sw.js`
- Test: `tests/course.test.js` (pure helpers), `tests/storage.test.js` (backup round-trip includes `courses` and `courseReviews`)

**Interfaces:**
- Produces: `courseSummary(state, subject, lang, today) -> { tracks: [{ track, owned, total }], due: n, strip: number[14], situations: [{ lessonId, pts, ts }] }` (pure, course.js). `renderGlossary(app, { subject }, root)`: loads all modules of the subject (parallel, skips failures with a note), search input filters by term or definition, grouped by module title.

- [ ] **Step 1: Failing tests**: `courseSummary` counts; strip is 14 long with today last; backup import keeps `courses`.
- [ ] **Step 2: Implement.**
- [ ] **Step 3: e2e step** `progress course tab and glossary search` (screenshots `64-progress-course`, `65-glossary`). Add `'glossary'` to the offline loop in the existing `offline after first load` step.
- [ ] **Step 4–5:** commit `Add glossary and course progress`.

### Task 11a: Seed content (two modules) and the content pipeline

**Files:**
- Create: `src/content/courses/eng/flow.en.js`, `flow.nl.js` (module `eng.flow`, track `basics`, level 1, 6 lessons: takt and cycle time, bottlenecks and WIP, OEE, changeover, line balancing, capacity planning), `src/content/courses/pm/intake.en.js`, `intake.nl.js` (module `pm.intake`, track `project`, level 1, 6 lessons: what the client actually asks, scoping and the first conversation, stakeholders and sponsors, defining done, the first 100 days, saying no to a bad project)
- Modify: `src/content/courses/index.js` (two `MODULES` entries with `questions` counts), `sw.js`
- Docs: `docs/superpowers/content/course-brief.md` — the brief template and schema a content subagent gets (lesson fields, word limits, tone: natural spoken Dutch, terms engineers use, Projecten reflects a consultant leading improvement projects at clients).

**Process:**
- [ ] **Step 1:** Write the brief file and the two module briefs (lesson slug + one line each). Show Merijn the two briefs in the session summary; proceed unless he objects (he approved trusting briefs after the first two per subject).
- [ ] **Step 2:** Dispatch one content subagent per module (both languages in one dispatch so the ids and meaning match), with the brief, the schema, the validator path and the command `node --test tests/coursecontent.test.js`. The subagent writes the two files and runs the validator until `[]`.
- [ ] **Step 3:** Add the index entries, run `npm test` (the shipped-modules test now exercises real files), add to `SHELL`.
- [ ] **Step 4: Commit** `Add the first engineering and project modules`.

### Task 11b: Launch content wave

**Files:** engineering modules `eng.quality` (basics, L1), `eng.maintenance` (basics, L2), `eng.drawings` (basics, L2: drawings, P&IDs, process control), `eng.machining` (discrete, L1), `eng.joining` (discrete, L2: welding and joining), `eng.moulding` (discrete, L2), `eng.lines` (discrete, L3: assembly lines, automation, robots, tooling), `eng.gridbasics` (grid, L1), `eng.transformers` (grid, L2: transformers, cables, connections), `eng.switchgear` (grid, L2: switchgear and protection), `eng.gridops` (grid, L3: outages, switching plans, asset management, energy-transition workload); project modules `pm.plan` (L1), `pm.run` (L2), `pm.land` (L2), `pm.close` (L2), `pm.stuck` (L3).

- [ ] **Step 1:** Briefs for all 16 modules in `docs/superpowers/content/briefs/<moduleId>.md`.
- [ ] **Step 2:** Dispatch content subagents, at most 3 in parallel (budget), each one module both languages; validator must pass.
- [ ] **Step 3:** Index entries, `SHELL`, `npm test`, one e2e step that opens the first lesson of a level-3 module and sees the faded example (`.example-ask` then Reveal). Screenshot `66-faded-example`.
- [ ] **Step 4: Commit per 3–4 modules** `Add <subject> modules: …`.

### Task 13: Interactive figures (anatomy skill)

**Files:**
- Create: `figures/<figureId>/build.mjs` (dev only, not shipped), `src/content/courses/figures/<figureId>.html`
- Modify: `src/content/courses/validate.js` (if `figure` is set: file exists in `src/content/courses/figures/` — checked by the content test with `fs`, not by the browser), `src/ui/lesson.js` (iframe under the teach blocks), `src/i18n.js` (`figureTitle`, `figureHint`), `sw.js`, `e2e/smoke.mjs`

**Interfaces:**
- Consumes: lesson `figure?: string`; theme from `app.state.settings.theme` mapped to `light|dark` the same way `applyTheme` does.
- Produces: `figureFrame(app, figureId, caption) -> HTMLElement` in `src/ui/lesson.js`: `div.figure-wrap` with an `iframe` (`src="src/content/courses/figures/<id>.html?theme=<t>"`, `sandbox="allow-scripts"`, `loading="lazy"`, `title=t('figureTitle')`) and a `p.muted.small` caption; on `error` the wrap removes itself.

- [ ] **Step 1: Failing tests** (`tests/coursecontent.test.js`): a lesson with `figure: 'eng.fx.none'` fails validation with "figure"; every shipped `figure` id has its file and is in `SHELL`.
- [ ] **Step 2:** Build the first figure for `eng.flow` (OEE or bottleneck line) with the anatomy skill at **Figure** size: dark and light, phone width 390 legible, audit and line checks to zero; read the screenshots.
- [ ] **Step 3:** Wire `figureFrame` into the lesson; e2e step opens the lesson and sees `.figure-wrap iframe`; screenshot `67-figure`.
- [ ] **Step 4:** One figure per remaining engineering module on its key concept, dispatched to subagents (one figure each, at most 2 in parallel, each with the skill path and the figure brief); Projecten figures only where the module brief names a physical metaphor.
- [ ] **Step 5:** Commit per figure: `Add figure: <title>`.

### Task 12: Final review and note

- [ ] Fresh whole-branch review subagent (most capable model) over the v8 range with the spec's Review Focus and this plan's; one fix pass with failing tests first; minors to the ledger.
- [ ] Short note to Merijn: what is live, how to start (pick Engineering, tap Today), what to test on his phone.

---

## Deferred to a later plan (do not build now)

Levels 3–4 for every track, images and diagrams in lessons, audio narration, course content via the coach ("write me a lesson on X"), export of the glossary.

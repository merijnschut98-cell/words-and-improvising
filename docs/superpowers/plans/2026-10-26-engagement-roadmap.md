# Engagement Roadmap (v2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (the daily routine runs one or two tasks per day, inline). Steps use checkbox (`- [ ]`) syntax for tracking. Tick them off in this file as you go and commit the plan with the code.

**Goal:** Turn Spraakwater's daily loop into one that people come back to (quests, forgiving streaks, highlights, personal bests, a practice plan) and that teaches more per session (varied conditions, listening drills, calibration).

**Architecture:** Same as v1: pure logic in `src/core/*` with `node --test`, DOM screens in `src/ui/*`, strings in `src/i18n.js` (en/nl keys must stay parallel: a test enforces it), state in the single `spraakwater:v1` blob merged with `defaultState()` on load. Every new file under `src/` goes into `SHELL` in `sw.js` (a test enforces it) and `CACHE` is bumped on every shipped change. The worker stays a classic script.

**Tech Stack:** unchanged (vanilla ES modules, Web Speech, speechSynthesis, Playwright e2e in `e2e/smoke.mjs`).

**Spec:** `docs/superpowers/specs/2026-10-26-engagement-and-learning-roadmap.md`

## Global Constraints

- No key needed for anything except the coach-based half of Task 8.
- `defaultState()` gains: `quests:{day:null,items:[]}`, `freezes:0`, `freezeLog:[]`, `daysPractised:0`, `plan:{cue:'',hour:null}`, `bests:{}`, `milestones:[]`, `theme:'default'`, `sound:true`. Existing users get them via the merge in `load()`; add a test per new key.
- Quest XP 15 each; all three done → `freezes = min(2, freezes+1)`. Modifier bonus +5 XP. Boss round: double XP.
- Streak rule stays: any counted round (≥ 5 words) keeps the day. A Quick round is a normal `minute` round with `answerS = 60`, `prepS = 5`.
- Never render `null` into the DOM: use the existing `add()`/`fill()` filter pattern or `|| ''`.
- Copy is warm and never guilt-based. Dutch and English for every string.
- Run `npm test` and `node e2e/smoke.mjs` before every push; look at the screenshots it writes.

## Review Focus

1. Quest state must roll over at local midnight and never double-award XP when a round qualifies for two quests at once or the app is reopened. → Task 1 tests `rollover`, `no double award`.
2. Freeze consumption: exactly one freeze per missed day, applied on the next open, never on the first ever day, never when the user practised. → Task 2 tests.
3. Personal bests must ignore rounds under 5 words and the fake-short e2e rounds (durationS < 5) so a 1-second test round never becomes a "best". → Task 4 test `ignores tiny rounds`.
4. Clean-run counting must treat multi-word fillers ("you know") as one break and must not count interim text twice. → Task 5 tests.
5. TTS drills: `say()` must resolve even when speechSynthesis has no voices loaded yet (Android often fires `voiceschanged` late) and the round must not start the timer until the line has been spoken. → Task 10: await `say()` before `countdown()`, and a 6 s cap.

---

### Task 1: Daily quests (core + home + toast)

**Files:**
- Create: `src/core/quests.js`, `tests/quests.test.js`
- Modify: `src/core/storage.js` (defaults), `src/core/round.js` (evaluate quests in `applyRound`), `src/ui/home.js` (quest list under the lesson button), `src/ui/feedback.js` (toast when a quest completes), `src/i18n.js`, `styles.css`, `sw.js`

**Interfaces:**
- `QUEST_POOL: [{id, check(round, ctx) -> boolean, needsKey?: boolean}]` where `round = {prompt, metrics, durationS, targetS, rating, mode, lang, prepS, cleanRun, retry:boolean}` and `ctx = {state, today, yesterdayBest: {fillerRate|null}}`.
- `questsForDay(day: 'YYYY-MM-DD', hasKey: boolean, rng = seeded from day) -> [{id, done:false}]` (3 distinct ids; `needsKey` quests only when `hasKey`).
- `applyQuests(state, round, today) -> {state, completed: [id]}` (rolls over `state.quests` if `day !== today`; awards 15 XP per newly completed quest; third completion grants a freeze, cap 2).
- Ids (en label key `quest_<id>`): `pauseClean`, `beatYesterday`, `sayAgain`, `lesson`, `coldStart`, `bridgeAll`, `liveConvo` (needsKey), `otherLang`.

- [ ] Tests: `questsForDay` is deterministic for the same day and differs between days; never includes `liveConvo` without a key; 3 distinct ids. `applyQuests` rolls over on a new day; awards exactly 15 XP once per quest even if two rounds qualify; the third completion adds one freeze and a fourth never exceeds 2; `beatYesterday` compares against the best fillerRate of yesterday's rounds; `lesson` completes when `state.days[today] >= 3`.
- [ ] Implement, wire `applyQuests` into `applyRound` (return `completedQuests` to the UI), show quests on home with ticks, toast "✓ Quest: …" on the feedback screen. Bump CACHE, add to SHELL. Commit: `Add daily quests`.

### Task 2: Streak freezes, minimum session, days-practised

**Files:**
- Modify: `src/core/progress.js` (`updateStreak` gets freeze logic), `src/core/storage.js`, `src/app.js` (apply freezes on boot), `src/ui/home.js` (Quick round button, 🧊 on week strip, "N days total"), `src/ui/round.js` (quick timing override), `src/i18n.js`

**Interfaces:**
- `reconcileStreak(state, today) -> {state, usedFreeze: boolean, broke: boolean}`: called on boot. If `lastDay` is 2 days ago and `freezes > 0` → consume one, push `yesterday` to `freezeLog`, keep the count. If older than that (or no freeze) → leave the count (it resets on the next `updateStreak`) and set `broke` for the copy.
- `app.startQuick()` → `go('round', {prompt: makePrompt('minute'), timing: {prepS:5, answerS:60}})`; `renderRound` accepts an optional `timing` override.
- `daysPractised` increments in `applyRound` when `days[today]` goes 0 → 1.

- [ ] Tests: freeze consumed exactly once for one missed day; not consumed when `lastDay === today` or yesterday; not consumed with 0 freezes; two missed days with one freeze → `broke`. `daysPractised` increments once per day.
- [ ] Implement UI: week strip shows 🧊 on freeze days; header shows `🔥 N · 🧊 k`; broken-streak banner on home once (dismiss stored in `state.ui.seenBreak = today`). Commit: `Add streak freezes, quick round and days practised`.

### Task 3: Practice plan (implementation intention)

**Files:**
- Modify: `src/ui/welcome.js` (4th slide), `src/ui/settings.js`, `src/ui/home.js` (plan line), `src/core/reminder.js` (`reminderMeta` includes `hour`), `sw.js` (skip when `|now.hour - hour| > 3`), `src/i18n.js`, `tests/reminder.test.js`

**Interfaces:** `plan: {cue: string, hour: number|null}`; preset cues `coffee|commute|lunch|dinner|bed` + custom text.

- [ ] Tests: `reminderMeta` carries `hour`; `shouldFireReminder(meta, now)` (new pure fn in `reminder.js`) false when > 3 h from `hour`, true otherwise or when `hour` is null.
- [ ] Implement slide + settings card + home line "Your plan: after my morning coffee ✏️". Commit: `Add practice plan`.

### Task 4: Personal bests + lesson summary highlights

**Files:**
- Create: `src/core/bests.js`, `tests/bests.test.js`
- Modify: `src/core/round.js` (update bests, return `newBests`), `src/ui/done.js` (summary layout), `src/ui/feedback.js` (PB chip), `src/i18n.js`, `styles.css`, `sw.js`

**Interfaces:**
- `updateBests(bests, entry) -> {bests, newBests: [{key, value, drill?}]}` for keys `fillerRate` (lower, only if words ≥ 30), `words` (higher), `cleanRun` (higher), `pauses` (higher), `byDrill[drill].fillerRate` (lower, words ≥ 30). Ignore entries with `durationS < 5` or `words < 5`.
- `app.session` accumulates `highlights: []` (`newBests` + the best `cleanRun` of the lesson); Done screen renders up to two.

- [ ] Tests: first qualifying round sets all bests; a worse round changes nothing; tiny rounds ignored; per-drill best independent of global.
- [ ] Implement; Done screen shows XP, quests ticked today, highlights. Commit: `Add personal bests and lesson highlights`.

### Task 5: In-round clean-run counter

**Files:**
- Modify: `src/core/metrics.js` (`cleanRun(tokens, lang) -> {max, current}` using `findFillers` positions), `tests/metrics.test.js`, `src/ui/round.js` (live counter for every spoken round), `src/core/round.js` (store `cleanRun` in history), `styles.css`

- [ ] Tests: `"a b you know c d e"` → max 3, current 3; `"um a b"` → max 2; multi-word filler counts as one break; empty → 0.
- [ ] Implement small live chip "🧼 clean run: 23 · best 54" that pulses on a new best. Commit: `Add clean-run counter`.

### Task 6: Modifiers (varied conditions)

**Files:**
- Create: `src/core/modifiers.js`, `tests/modifiers.test.js`
- Modify: `src/ui/round.js` (intro "Harder" toggle, modifier chip, cold-start prep override, slow-down live wpm hint), `src/core/progress.js` (`xpForRound` +5 when `modifier`), `src/core/coach.js` (mention modifier), `src/i18n.js`, `sw.js`

**Interfaces:** `MODIFIERS = ['cold','whisper','slow','noI','standing','eyesClosed','endQuestion']`; `pickModifier(rng, level) -> id|null` (null when level < 2; otherwise 25 % chance; the intro toggle forces one). `appliesPrep(id)` → `cold` sets `prepS = 0`.

- [ ] Tests: never at level 1; ~25 % at level ≥ 2 over 1000 seeded draws (between 200 and 300); forced pick is never null.
- [ ] Implement with framing copy "Harder on purpose". Commit: `Add practice modifiers`.

### Task 7: Friday boss round

**Files:**
- Create: `src/core/boss.js`, `tests/boss.test.js`
- Modify: `src/ui/home.js` (card visible Fri–Sun until done this week), `src/ui/round.js` (drill `boss`: topic + twist at 30 s + 3 words + side switch at 60 s, 120 s total), `src/core/progress.js` (`DRILLS` unchanged; `boss` handled as a special drill with its own timing and double XP), `src/core/lesson.js` (`makePrompt('boss')`), `src/core/review.js` (boss highlight), `src/i18n.js`, `sw.js`

- [ ] Tests: `bossAvailable(state, now)` true Fri–Sun when no boss entry this ISO week; `makePrompt('boss')` has topic, 1 twist, 3 words, a question for the switch.
- [ ] Implement. Commit: `Add Friday boss round`.

### Task 8: Calibration insight + skill radar

**Files:**
- Create: `src/core/calibration.js`, `tests/calibration.test.js`
- Modify: `src/ui/progress.js` (two cards), `src/i18n.js`, `sw.js`

**Interfaces:** `calibration(history) -> {n, meanGap, verdict:'harsh'|'fair'|'generous'}|null` over the last 10 entries with both `rating` and `coach.overall` (gap = rating − overall; harsh < −0.5, generous > 0.5). `skillRadar(history) -> {clarity, structure, fluency, vocabulary, source:'coach'|'local'}` (0–5), local proxies per the spec.

- [ ] Tests: null under 3 pairs; verdicts at the thresholds; local radar when no coach data.
- [ ] Implement an inline-SVG radar. Commit: `Add calibration and skill radar`.

### Task 9: Journey milestones + themes

**Files:**
- Create: `src/core/milestones.js`, `tests/milestones.test.js`
- Modify: `src/ui/progress.js` (journey path), `src/ui/done.js` (milestone reached), `src/ui/settings.js` (theme picker among unlocked), `styles.css` (3 themes via `[data-theme]` tokens), `src/app.js` (apply theme), `src/i18n.js`, `sw.js`

**Interfaces:** `MILESTONES = [{id, test(state) -> boolean, unlocks?: themeId}]` (≥ 10, from "First words" (1 round) to "Table-topics ready" (50 rounds + 3 drills at level 3)); `newMilestones(state) -> [id]`.

- [ ] Tests: ordering, idempotence, unlock mapping.
- [ ] Implement. Commit: `Add journey milestones and themes`.

### Task 10: TTS drills: Yes-and, Listen & respond, Expert interview

**Files:**
- Modify: `src/content/prompts.*.js` (`yesAnd` ≥ 30 lines, `listen` ≥ 30 `{statement, question}`, `experts` ≥ 30 topics + `expertQuestions` ≥ 20), `src/core/lesson.js`, `src/core/progress.js` (`DRILLS` + timings: yesAnd 3 × 15 s, listen 1 × 45 s after the audio, expert 5 × 12 s), `src/ui/round.js` (speak the line, then start the timer; show the text too), `src/core/coach.js` (briefs), `src/ui/dom.js` (icons), `src/i18n.js`, `tests/lesson.test.js`

- [ ] Tests: content parallel and sized; prompts carry the lines/questions; timing table.
- [ ] Implement using `say()` from `voice.js` with a 6 s cap before the timer starts; when TTS is unsupported, show the text for 3 s instead. Commit per drill if large.

### Task 11: Share card + challenge link

**Files:**
- Create: `src/core/share.js` (canvas PNG renderer; `challengeLink(prompt, lang) -> url`, `parseChallenge(search) -> {drill, promptId, lang}|null`), `tests/share.test.js` (link parse/format only)
- Modify: `src/app.js` (open a challenge from `?c=`), `src/ui/done.js`, `src/ui/progress.js`, `src/ui/feedback.js` ("Send this prompt"), `src/i18n.js`, `sw.js`

- [ ] Tests: round-trip of the link; unknown ids rejected.
- [ ] Implement with `navigator.share` when available, else download/copy. Commit: `Add share card and challenge links`.

### Task 12: Sounds

**Files:**
- Create: `src/core/sound.js` (WebAudio blips, no assets), Modify: `src/ui/round.js`, `src/ui/feedback.js`, `src/ui/settings.js` (toggle), `sw.js`

- [ ] Implement 4 short synthesized cues (twist, switch, quest, best), muted by `settings.sound === false`. Commit: `Add sound cues`.

## Order of work for the daily routine

Day 1: Task 1. Day 2: Tasks 2 + 3. Day 3: Tasks 4 + 5. Day 4: Task 6 + 7. Day 5: Task 8. Day 6: Task 10. Day 7: Task 9. Then 11 and 12. After each day: tick the boxes here, run the independent review pass if more than ~300 lines changed, push, and write Merijn a short note.

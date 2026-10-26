# v3 roadmap: from practice to real life — implementation plan

Planned 2026-10-26 after v2 shipped (all 12 tasks). Executed by the daily "Evolve Spraakwater" check-in, one task per day, with superpowers:executing-plans (TDD for core logic, ledger in `.superpowers/sdd/2026-10-27-v3-transfer-roadmap/progress.md`).

## Why these (research pass, 2026-10-26; citations recalled from the literature, not live-verified)

The app now has plenty of motivation mechanics. v3 adds **learning** mechanics and **transfer to his real situations**, and deliberately no new reward layers.

| Item | Evidence | Size |
|---|---|---|
| Spaced re-attempts | Spaced retrieval beats massed practice (Cepeda et al. 2006, doi:10.1037/0033-2909.132.3.354; Roediger & Karpicke 2006, doi:10.1111/j.1467-9280.2006.00012.x) | S–M |
| Adaptive lesson | Deliberate practice targets weaknesses at the edge of ability (Ericsson et al. 1993, doi:10.1037/0033-295X.100.3.363) | M |
| Structure frames | Frames cut cognitive load when speaking on the spot (Toastmasters impromptu material; Minto, Pyramid Principle) | S–M |
| Follow-up listening | Follow-up questions increase liking (Huang et al. 2017, doi:10.1037/pspi0000097) | S–M |
| Captain & work scenarios | SBI feedback model (Center for Creative Leadership); rehearsal of real events (Gollwitzer & Sheeran 2006) | S |
| My real week | Implementation intentions + rehearsal close the practice-to-reality gap | M |
| Pace over time | Specific, concrete feedback works best (Hattie & Timperley 2007, doi:10.3102/003465430298487) | M |

Avoid: more XP types/badges/leaderboards; live coaching mid-speech (splits attention); coach scores without rubric anchors.

## Global constraints (unchanged from v2)

- Vanilla ES modules, no build step, no backend. Everything works without an API key; the key makes things richer.
- One localStorage blob `spraakwater:v1`, merged with `defaultState()` on load; new keys need defaults and a storage test.
- `sw.js` stays a classic script; bump `CACHE` and add every new `src/` file to `SHELL` (a test enforces it).
- en/nl strings parallel (test enforces). No `null` rendered: use `fill()`/`add()` filters. No straight apostrophes inside single-quoted strings.
- Each task: unit tests first (watch them fail), `npm test`, `node e2e/smoke.mjs <shots dir>` with a new step, look at the screenshots, commit, push, tick the boxes here.
- Branch `claude/improvisation-practice-game-voon91` only. Never merge PR #1.

## Review Focus

1. Spaced reviews must never schedule a prompt id that no longer exists in content, and must survive language switches (ids are per language pool, same ids in en/nl).
2. Adaptive lesson must still produce 3 distinct drills and fall back to random when history is empty or tiny.
3. Real-week events contain his free text: render as text nodes only, never `html:`; never send to the coach without a key.
4. Pace-over-time must not divide by zero on rounds under 10 s.

---

### Task 1 (Tue 27 Oct): Spaced re-attempts

**Files:** Create `src/core/spaced.js`, `tests/spaced.test.js`. Modify `src/core/round.js` (record box), `src/core/storage.js` (`reviews: {}`), `src/ui/home.js` (card "Again, but better: N due"), `src/ui/feedback.js` (compare with the earlier attempt via `compare.js`), `src/i18n.js`, `sw.js`.

**Interfaces:** `reviews: { [promptId]: { box: 1..4, due: 'YYYY-MM-DD', drill, lang } }`. Boxes = 1, 3, 7, 21 days. `scheduleReview(reviews, entry, today, improved)` → promotes on improvement (fewer fillers/min or higher rating than the last attempt), else back to box 1. `dueReviews(reviews, today, content)` → prompts rebuilt with `challengePrompt()` (from `share.js`), unknown ids dropped.

- [x] Tests: box intervals; promotion and demotion; unknown ids dropped; nothing due on day one.
- [x] Implement. Commit: `Add spaced re-attempts`.

### Task 2 (Wed 28 Oct): Adaptive daily lesson

**Files:** Modify `src/core/lesson.js` (`buildLesson(content, rng, seen, state)`), `src/app.js`, `tests/lesson.test.js`.

**Interfaces:** Lesson = one drill from the weakest area (lowest recent self/coach rating, or highest fillers/min; needs ≥ 2 rounds in that drill), one due review (Task 1) if any, else a drill not done for longest, plus one random. Always 3 distinct drills. Home lesson subtitle names why ("Focus: Debate").

- [x] Tests: empty history = 3 random distinct; weakest drill chosen; due review included; distinctness.
- [x] Implement. Commit: `Make the daily lesson adaptive`.

### Task 3 (Thu 29 Oct): Structure frames drill

**Files:** Modify content (`frames` pool: ≥ 30 prompts per language, each tagged with the frame that fits best), `src/core/lesson.js`, `src/core/progress.js` (`DRILLS` + `frame`), `src/ui/round.js` (frame chips as scaffold), `src/core/coach.js` (brief: judge whether the frame was followed), `src/ui/dom.js` (icon 🧭), `src/i18n.js`, tests.

**Frames:** PREP, STAR (Situation-Task-Action-Result), What / So what / Now what, Problem-Solution-Benefit (A3 style), Past-Present-Future (team talk), Answer first (pyramid). Intro shows the frame's steps; at level ≥ 3 he picks the frame himself from three options before prep starts.

- [x] Tests: each prompt has a known frame; parallel ids; level ≥ 3 offers 3 distinct frames including the right one.
- [x] Implement. Commit: `Add structure frames drill`.

### Task 4 (Fri 30 Oct, key day): Coach rubric anchors + key-day check

**Files:** Modify `src/core/coach.js` (rubric anchors per score 1/3/5 for clarity, structure, fluency, vocabulary; pass the frame for Task 3), `tests/coach.test.js`.

- [ ] Tests: system prompt contains the anchors; frame passed through.
- [ ] Implement. Commit: `Anchor coach scores to a rubric`.
- [ ] Key day: if Merijn reports a coach, key or model problem, that comes first. The live key is only on his phone; never ask him to paste it anywhere.

### Task 5 (Sat 31 Oct): Captain & work scenarios

**Files:** Content pools `captain` (≥ 20: feedback to a teammate with SBI, pre-match talk, after a loss, benching a player, welcoming a new player) and `work` (≥ 20: present an A3 in 60 s, explain a Lean idea to an operator, answer a client objection, gemba-walk question, stand-up update). New drill `real` (🎯) that draws from both. Captain prompts show the SBI or "one sentence, then stop" constraint. Coach brief: judge assertiveness without aggression, clarity of the ask.

- [ ] Tests: pools parallel and sized; prompt carries its constraint.
- [ ] Implement. Commit: `Add captain and work scenarios`.

### Task 6 (Sun 1 Nov): Follow-up listening drill

**Files:** Content `followUps` (≥ 30 per language: a small-talk line with one specific detail). Drill `followUp` (🔍) using the spoken-cue flow (`CUED_DRILLS`): the app speaks the line; he answers with one follow-up question that uses the detail. Local check: a question word (`wat/hoe/waarom/wanneer/wie/welke` · `what/how/why/when/who/which`) and a content word from the line's `detail` field. Feedback shows ✓/✗ for "asked a question" and "used the detail".

- [ ] Tests: detail and question detection in both languages; pools parallel.
- [ ] Implement. Commit: `Add follow-up question drill`.

### Task 7 (Mon 2 – Tue 3 Nov): My real week

**Files:** Create `src/core/realweek.js`, `src/ui/realweek.js`, tests. Home card "Coming up" and a screen to add an event (type: client meeting · presentation · team talk · networking · other; date; one line of text). For each event the app offers three rehearsal rounds: the 60-second version (`minute`), the hard question (`prep`, local templates per type; with a key the coach writes the question), and the opening line (`rapid`-style 15 s). After the date passes: a two-tap reflection ("how did it go?" 1–5 + "next time I…"), saved and shown on Progress. Free text is rendered as text only.

- [ ] Tests: rehearsal prompts per type; past events move to reflection; text never interpreted as HTML (UI e2e).
- [ ] Implement. Commit: `Add my real week rehearsal`.

### Task 8 (Wed 4 Nov): Pace over time + one-fix loop

**Files:** Modify `src/ui/round.js` (keep word-growth timestamps per 10 s), `src/core/metrics.js` (`paceSeries(growth, words) -> wpm per 10 s`, guards for short rounds), `src/ui/feedback.js` (sparkline + "you sped up in the last third" note), `src/ui/feedback.js` + `src/ui/round.js` ("one fix for next time": a chosen note becomes the next round's goal on the intro screen).

- [ ] Tests: series lengths, zero-division guard, speed-up detection.
- [ ] Implement. Commit: `Show pace over time and carry one fix forward`.

### Task 9 (Thu 5 – Fri 6 Nov): Final review + fixes

- [ ] Whole-branch review by a fresh subagent (most capable model) over the v3 range, with this plan's Review Focus. One fix pass for Critical/Important findings, each with a failing test first. Ledger minors.
- [ ] Short note to Merijn: what's new, and one suggestion for how to use it in his real week.

Slack (Sat 7 – Sun 8 Nov): content top-up (topics, opinions, small talk to ≥ 60 each), accessibility pass (labels, focus order, contrast in the Night theme). Then the daily check-in disables itself.

### Deferred minors from the v2 final review (slack days, or alongside a task touching the same file)

- `sound.js`: `ctx.resume()` can reject unhandled; add `.catch(() => {})`.
- `styles.css`: `.quest:first-of-type` never matches; use `.quest + .quest` for the divider.
- `modifiers.js`: `applyModifierTiming` is unused (round.js has `prepFor`); use it or drop it.
- Quests can be impossible on a day (`beatYesterday` with no rounds yesterday, `otherLang` with no history); filter by feasibility before picking 3.
- A new install opened via a challenge link skips the welcome flow.
- The too-short retry re-rolls the modifier; pass it through like "say it again".
- `app.challengeId` persists for the page session, so later rounds of that prompt show "Reply".
- With recording on, spoken-cue drills record the app's own voice.

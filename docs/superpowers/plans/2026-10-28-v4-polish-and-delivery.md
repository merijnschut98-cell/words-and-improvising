# v4: polish, depth and delivery — implementation plan

Planned 2026-10-26, after v3 (spaced re-attempts, adaptive lesson, frames, captain/work scenarios, follow-up drill, my real week, pace + one fix) shipped and passed a fresh review. Executed by the daily "Evolve Spraakwater" check-in with superpowers:executing-plans (ledger `.superpowers/sdd/2026-10-28-v4-polish-and-delivery/progress.md`), one task per day, TDD for core logic, e2e step + screenshots for UI.

Still binding from v3: the global constraints in `docs/superpowers/plans/2026-10-27-v3-transfer-roadmap.md` (no build step, no backend, works without a key, `sw.js` classic with CACHE bump and full SHELL, en/nl parity, no `null` rendering, no straight apostrophes in single-quoted strings, branch only, never merge PR #1). No new reward layers (no extra XP types, badges or leaderboards).

## Review Focus

1. Anything that sends text to the API sends only what the person chose to send; event text needs an explicit opt-in per event.
2. Audio analysis (Task 6) must never block or slow the speech recogniser on Android, and must stop its stream when the round ends or the screen is left.
3. Import must validate the file and never replace state with something `load()` would reject; keep a backup of the current state first.
4. Accessibility changes must not change behaviour (e2e must stay green unchanged except for selectors that got better labels).

---

### Task 1 (Tue 27 Oct): Deferred minors

Work through both "Deferred minors" lists at the end of the v3 plan (v2 list and v3 list): each with a failing test first where the behaviour is testable, otherwise an e2e assertion. One commit per logical group. Commit: `Fix deferred minors from v2 and v3 reviews`.

- [x] v2 minors (sound resume catch, quest divider CSS, applyModifierTiming, impossible quests, challenge skips welcome, too-short retry keeps modifier, challengeId scope, recording during cued drills).
- [x] v3 minors (fix chip vs too-short, wasImproved with coach rating, delete past events, pace card only when speaking).

### Task 2 (Wed 28 Oct): Content top-up (use a content subagent in parallel)

Bring `topics`, `opinions`, `scenarios`, `concepts` to ≥ 60 per language and `captain`/`work` to ≥ 36, same ids in en/nl, natural spoken Dutch. Dispatch one content subagent with the exact JSON shape and a validation script (parity, counts, no duplicates), merge its output, extend the size tests.

- [x] Tests: raised minimum sizes; no duplicate texts within a pool.
- [x] Merge content. Commit: `Top up practice content`.

### Task 3 (Thu 29 Oct): Accessibility pass

Every icon-only button gets an `aria-label` from i18n (Close → `t('close')`), focus is moved to the screen heading on navigation, `prefers-reduced-motion` turns off pop/confetti animations, the Night theme passes WCAG AA contrast for muted text (check with a small contrast function in a test), touch targets ≥ 44 px for rate buttons and chips that are buttons.

- [x] Tests: contrast of theme tokens (AA 4.5:1 for `--muted` on `--card` in all themes); i18n key for every aria-label.
- [x] Implement; update e2e selectors that used `'Close'`. Commit: `Accessibility pass`.

### Task 4 (Fri 30 Oct, key day): Key-day support + coach-written hard question

First: if Merijn reports any key, coach or model problem, fix that. Also tick the v3 Task 4 key-day box.
Then: in My real week, a per-event toggle "Let the coach see this line" (off by default). When on and a key exists, the hard-question rehearsal asks the coach (Haiku-class model setting respected) for one realistic hard question for that event type and line; fallback to the local template on any error.

- [x] Tests: request contains the event text only when the toggle is on; parse/fallback.
- [x] Implement. Commit: `Let the coach write the hard question (opt-in)`.

### Task 5 (Sat 31 Oct): Weekly reset with a chosen focus

On the first open of a new ISO week (or from Progress), a short weekly screen: last week in three lines (rounds, fillers/min trend, best moment from reflections or bests), then he picks next week's focus from three suggestions (weakest drill, a frame, a real-week event type) or keeps the adaptive default. The chosen focus steers `buildLesson`'s weak slot for that week (autonomy, SDT).

- [x] Tests: week rollover detection; chosen focus overrides weakestDrill for that week only.
- [x] Implement. Commit: `Add weekly reset with a chosen focus`.

### Task 6 (Sun 1 – Mon 2 Nov): Delivery: volume and monotone

Optional (Settings toggle, default off until tested on his phone): during spoken rounds, a WebAudio `AnalyserNode` on a separate `getUserMedia` stream samples loudness every 100 ms. Feedback shows a "voice variety" line (low variance = monotone) and "trailing off" (last third clearly quieter). If opening a second mic stream breaks recognition on a device, the toggle explains that and turns itself off.

- [x] Tests (pure): `loudnessStats(samples) -> {variety, trailingOff}` thresholds and short-round guards.
- [x] Implement with cleanup on finish/dispose. Commit: `Add voice variety feedback (optional)`.

### Task 7 (Tue 3 Nov): Backup and restore

Settings: "Export" already downloads JSON; add "Import" (file input). Validate via `load()` on a fake backend, show a summary (rounds, days, XP) and ask to confirm; keep the current state as `spraakwater:v1:backup` before replacing.

- [x] Tests: import rejects non-JSON, wrong shape, and keeps a backup.
- [x] Implement. Commit: `Add backup import`.

### Task 8 (Wed 4 Nov): Speed and offline audit

Measure first load on the live site (Playwright, throttled "Fast 3G"): total bytes, number of requests, time to interactive. Lazy-load screens that are not needed for Home (`realweek`, `progress`, `conversation`) with dynamic `import()` if that saves > 20 % of first-load bytes; verify offline still works for every screen (e2e goes offline and visits each).

- [x] Measure before/after in the ledger.
- [x] Implement only if the gain is real. Commit: `Load secondary screens on demand`.

### Task 9 (Thu 5 – Fri 6 Nov): Final review + fixes + note

- [ ] Fresh whole-branch review subagent (most capable model) over the v4 range with this Review Focus; one fix pass for Critical/Important (re-grade by effect), each with a failing test first; ledger minors.
- [ ] Short note to Merijn: what is new since last week and one suggestion for using it in his real week.

Slack (Sat 7 – Sun 8 Nov): v4 deferred minors; then the daily check-in disables itself.

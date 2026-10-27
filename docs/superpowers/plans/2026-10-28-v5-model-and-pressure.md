# v5: learn from a model, speak under pressure — implementation plan

Planned 2026-10-27 after v4 (accessibility, coach-written hard question, weekly focus, voice variety, backup import) shipped. Executed by the "Evolve Spraakwater" check-ins with superpowers:executing-plans (ledger `.superpowers/sdd/2026-10-28-v5-model-and-pressure/progress.md`), as many tasks per run as fit, TDD for core logic, e2e step + screenshots for UI.

Binding: the global constraints in `docs/superpowers/plans/2026-10-27-v3-transfer-roadmap.md` (no build step, no backend, works without a key, classic `sw.js` with CACHE bump and full SHELL, en/nl parity, no `null` rendering, no straight apostrophes in single-quoted strings, aria-labels from i18n, branch only, never merge PR #1). No new reward layers.

## Why these (research pass 2026-10-27; deliberate-practice page verified live, the rest recalled)

| Item | Why | Size |
|---|---|---|
| Shadow, then say it your way | Modelling + immediate repetition (Bandura; deliberate practice needs a model of good performance and feedback) | S–M |
| Word budget | A cap forces "answer first, then stop", the consultant's classic over-explaining | S |
| Self-explanation before the model | Self-explanation is a moderate-utility technique (Dunlosky et al. 2013, PubMed 26173288); predicting the fix before seeing it deepens processing | S |
| Small-talk story frame | Hook, detail, question back: a short anecdote that invites the other person in | S |
| Interruptions & hostile questions | The real-world gap for a new captain and a consultant: stay calm, acknowledge, answer in one sentence, check back | M |
| Friend rating | Real listeners are the best transfer signal and calibrate the coach and the self-rating | M |

Not doing: a separate difficulty auto-tuner (drill levels already move with ratings), audio upload or any server, pronunciation scoring.

## Review Focus

1. Shadowing must never count the model text as his own words (metrics come only from what he said).
2. The friend link carries no recording, no transcript, only the prompt id and ratings; a crafted link cannot inject HTML or crash the app.
3. Interruptions must not overlap the recogniser with the app's own voice (reuse the cued-drill pattern: stop listening, speak, restart).
4. Word budget counts the same words the metrics count (tokenize), and never ends a round early by itself.

---

### Task 1: Shadow, then say it your way

On feedback, when the coach returned a stronger version: a button "Shadow it" starts a short round where the stronger version is shown (and spoken with TTS if available), then he says it from memory; then a second round "now in your own words" with the original prompt. Feedback for the shadow round compares words used from the model (overlap %) and fillers; the own-words round compares with the first attempt (existing compare card).

- [ ] Tests (pure): `modelOverlap(model, transcript) -> 0..1` on content words; ignores fillers; empty → 0.
- [ ] Implement (reuse round flow with `prompt.extra.model`; no XP double-counting: shadow rounds give normal XP but do not update spaced reviews or bests). Commit: `Add shadow-then-repeat`.

### Task 2: Word budget

A new modifier `budget` (30/45/60 words by drill level) with a live counter "23 / 45 words" that turns amber near the cap and red over it. Never stops the round. Coach brief mentions the budget. `modifierCheck('budget')` met when words ≤ budget and ≥ 60 % of it.

- [x] Tests: budget by level; check met/missed; counter uses `tokenize`.
- [x] Implement. Commit: `Add word budget modifier`.

### Task 3: Self-explanation before the model

On feedback with a coach result, the stronger version is collapsed behind one optional line: "What would you change, and why?" (typed, ≤ 140 chars). After he answers or skips, the stronger version opens; his line is shown above it for comparison and stored on the history entry (`selfFix`).

- [ ] Tests: history entry stores `selfFix` trimmed and capped; absent when skipped.
- [ ] Implement. Commit: `Ask what he would change before showing the stronger version`.

### Task 4: Small-talk story frame

Add frame `story3` (Hook, Detail, Question back) to the frames drill: frame steps in i18n, `FRAME_IDS`, coach `FRAME_EN`, and ≥ 6 new prompts per language tagged `story3` (content subagent).

- [ ] Tests: frame valid everywhere; parity; options still 3 distinct.
- [ ] Implement. Commit: `Add small-talk story frame`.

### Task 5: Interruptions & hostile questions

New drill `pressure` (🔥): he starts answering an opening question; after 12–18 s the app interrupts (stops listening, speaks a hostile or vague follow-up from a bank of ≥ 30 per language, e.g. "Sorry, but what is your actual point?"), then he answers that in ≤ 20 s. The intro teaches the four moves: acknowledge, bridge, one-sentence answer, check back. Feedback shows the interruption and a checklist (did the answer start within the first sentence? did he check back with a question?).

- [ ] Tests: interruption timing window; pools parallel and sized; checklist detection (question at the end, short first sentence).
- [ ] Implement using the cued-drill helpers. Commit: `Add interruptions and hostile questions drill`.

### Task 6: Friend rating

From feedback: "Ask a friend to rate this" makes a link `?r=<drill>.<promptId>.<lang>.<nonce>`. The friend's page shows the prompt and three 1–5 sliders (clear, structured, confident) plus one short line; submitting produces a short code or link back (`?rr=<nonce>.<c>.<s>.<f>.<base64url line>`) that he opens or pastes. Stored as `friendRatings[nonce]`; calibration card gains a "Friend" row.

- [ ] Tests: link round-trip; malformed links rejected; line capped and rendered as text; calibration includes friend averages.
- [ ] Implement. Commit: `Add friend rating links`.

### Task 7: Final review + note

- [ ] Fresh whole-branch review subagent (most capable model) over the v5 range with this Review Focus; one fix pass (re-grade by effect, failing test first); ledger minors.
- [ ] Short note to Merijn: what is new and one way to use it this week.

### Deferred minors from the v4 final review (take alongside a task touching the same file, or on a slack run)

- Weekly reset asks every existing player once right after deploy, whatever the weekday.
- `ui.pendingWelcome` is never cleared after the welcome.
- Import reports success even if saving fails; the streak is not reconciled after import.
- The review card gradient hard-codes teal instead of following the theme (`color-mix` with `--accent-dark`).
- "0 rounds … <1 minutes" wording when the last 7 days are empty.
- Duplicate e2e screenshot numbers (45-rw-share, 45-voice).
- The voice meter may trigger a mic permission prompt mid-answer on some devices; say so in the help text.

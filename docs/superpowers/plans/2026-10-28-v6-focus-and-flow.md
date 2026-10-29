# v6: focus and flow — implementation plan

Planned 2026-10-27 after v5 (shadowing, word budget, self-explanation, story frame, interruptions drill, friend rating). The app now has 18 drills and many options; the risk has shifted from "too little to practise" to "too much to choose from". v6 makes daily use simple and makes progress visible, without adding drills.

Executed by the "Evolve Spraakwater" check-ins with superpowers:executing-plans (ledger `.superpowers/sdd/2026-10-28-v6-focus-and-flow/progress.md`), as many tasks per run as fit, TDD for core logic, e2e step + screenshots for UI. Binding: the global constraints in `docs/superpowers/plans/2026-10-27-v3-transfer-roadmap.md`. No new reward layers, no new drills.

## Why (research pass 2026-10-27; sources recalled, not verified live)

- Too many choices raise the cost of starting; one recommended next action plus a fixed cue helps habits (choice overload, Iyengar & Lepper; habit formation, Lally et al.).
- Mastery learning: move on from what is owned, keep effort on weak spots (Bloom; spacing, Cepeda et al.).
- Worked examples help before practice (Sweller): a 30-second tip with a before/after example.
- Specific, quantified feedback on one behaviour at a time (self-monitoring): per-filler and vague-word trends.
- Transfer is the goal: log real-life use, not just practice (implementation intentions, Gollwitzer).

## Review Focus

1. The Today recommendation is deterministic for a given state and day, never recommends something impossible (a cued drill without speech output is fine; a key-only feature without a key is not), and never blocks free choice.
2. Mastery never takes anything away: owned drills stay playable; only the adaptive picker deprioritises them.
3. Vocabulary analytics must not mislabel words in the other language and must say that speech-to-text drops some fillers.
4. Programme progress survives the weekly reset and language switches.

---

### Task 1: Today card ("one next thing")

Home leads with one card: the single recommended round for now, with a reason ("due again", "your focus this week", "rehearse Thursday's A3 review", "weakest lately") and two lengths ("2 min" quick, "5 min" lesson). The full drill grid moves below a "Choose myself" disclosure (open state remembered in `ui`). Pure `todayPick(state, today, content, lang) -> {prompt, reason}` priority: upcoming real-week event within 2 days → due spaced review → weekly focus → weakest drill → least recently played.

- [x] Tests: priority order; deterministic per day; empty state gives a sensible first round.
- [x] Implement. Commit: `Lead home with one next thing`.

### Task 2: Mastery per drill (Learn → Practise → Own)

`masteryOf(history, drill) -> 'learn'|'practise'|'own'`: own = 3 rounds rated ≥ 4 (self or coach) on 3 different days within the last 14 days; practise = ≥ 3 rounds; else learn. Shown on drill cards and Progress. Owned drills are skipped by the adaptive weak slot and the Today pick (unless nothing else qualifies), and appear at most once a week as maintenance.

- [x] Tests: thresholds, different-days rule, window; picker skips owned drills.
- [x] Implement. Commit: `Show mastery per drill`.

### Task 3: Situation finder + 30-second micro-lessons

A "What's coming up?" sheet (client pushback, stand-up update, presenting an A3, small talk at the club, a hard message to a teammate, networking, explaining a Lean tool) maps each situation to 2–3 drills. Every drill gets a short tip with a before/after example (≤ 50 words), shown on the intro the first time (then collapsed under "Tip"). Content via a content subagent, both languages.

- [x] Tests: every drill has a tip in both languages; every situation maps to existing drills; parity.
- [x] Implement. Commit: `Add situation finder and micro-lessons`.

### Task 4: Words: per-filler trend and vague words

From transcripts: fillers per 100 words per filler word (last 14 days vs the 14 before), vague words per language (en: thing, stuff, things, kind of, sort of, basically, really, very; nl: ding, dingen, eigenlijk, gewoon, soort van, best wel, heel, echt), repeated-word top 3 per round. Progress card "Your words" with the three biggest movers and one swap suggestion; feedback shows vague words highlighted like fillers (different colour). Note in the UI that speech-to-text may drop fillers.

- [x] Tests: per-filler rates and trend; vague words per language only; repeated words ignore stop words.
- [x] Implement. Commit: `Track fillers per word and vague words`.

### Task 5: Did it in real life

After a real-week event's reflection, one extra tap: which skill did you use (frames, follow-up questions, staying calm under pressure, pausing instead of fillers, other). Weekly reset shows "practised vs used in real life" counts; the Today pick nudges the skill he used least.

- [x] Tests: skill stored; weekly counts; nudge.
- [x] Implement. Commit: `Log skills used in real life`.

### Task 6: A 4-week programme (optional path)

Opt-in from Progress: four weekly themes (1 clarity and structure, 2 small talk and rapport, 3 captain voice and assertiveness, 4 pressure and transfer). Starting it sets each week's focus automatically (overridable in the weekly reset), shows "Week 2 of 4" on the Today card, and ends with a re-take of the week-1 baseline prompt with a before/after comparison.

- [x] Tests: week index from start date; focus per week; baseline prompt stored and re-offered in week 4.
- [x] Implement. Commit: `Add an optional 4-week programme`.

### Task 7: Final review + note

- [ ] Fresh whole-branch review subagent (most capable model) over the v6 range with this Review Focus; one fix pass (re-grade by effect, failing test first); ledger minors.
- [ ] Short note to Merijn.

### Deferred minors from the v5 final review (ride along with tasks touching the same files)

- Pressure rounds: target/total is 40 s while the real round is 32–38 s; use the sum of `itemS`.
- Typing-mode reply slice assumes he only appends after the interruption.
- Word budget "near" colour is green; the plan said amber.
- Cancelled friend asks leave `friendAsks` entries forever; prune by age.
- Shadow history entries store the whole original prompt; strip `original`/`firstMetrics` before saving.
- Shadow feedback still offers Challenge / Ask a friend.
- Self-fix input: Enter does nothing; handle it like the button.
- From the v4 review: weekly reset asks once right after deploy; `ui.pendingWelcome` never cleared; import reports success if saving fails; review card gradient ignores the theme; "0 rounds … <1 minutes" wording; duplicate e2e screenshot numbers; mic permission note in the voice help text.

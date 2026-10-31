# v7: finish and steady — implementation plan

Planned 2026-10-30 after v6 (Today card, mastery, situation finder, words, real-life skills, 4-week programme) shipped and passed a fresh review. The scheduled check-in now runs once each morning, and the weekly budget is tight. v7 closes the open loose ends and adds no new surface. The check-in disables itself after 2026-11-08.

Executed by the "Evolve Spraakwater" check-ins with superpowers:executing-plans (ledger `.superpowers/sdd/2026-10-30-v7-finish-and-steady/progress.md`). Do as many tasks per run as fit the budget. TDD for core logic; an e2e step only where the UI changes. Binding: the global constraints in `docs/superpowers/plans/2026-10-27-v3-transfer-roadmap.md`. No new reward layers, no new drills.

## Why

- **Defects first.** Small defects erode trust in a practice tool faster than missing features do. Three reviews (v4, v5 and v6) left minors that each touch something he sees.
- **Two v6 promises are still open.** Owned drills should come back once a week as maintenance, since spacing keeps skills alive (Cepeda et al.). The Today card should nudge toward the real-life skill he uses least, because transfer is the point (Gollwitzer).
- **The key arrives today.** Coach problems after Friday come first, before any task.

## Review Focus

1. Each minor fix changes only the behaviour it names. The e2e suite stays green without selector changes.
2. The maintenance slot never displaces a due review or an upcoming real-week event in the Today pick.
3. The skill nudge never recommends a drill that does not exist, and never shows when he has logged no real-life events.

---

### Task 1: v6 review minors

Seven items (ledger of v6, "Final: minor (deferred)"):
- An event pick starts a rehearsal; label it "Rehearse it (3 short rounds)".
- After a language switch, the programme card says why the re-take is missing.
- Guard the baseline prompt against a null, falling back to `makePrompt('minute', …)`.
- Add a storage test and coercion for `programme`.
- Fix the modifier index wrap.
- `baselineDue` should check the entry's language.
- The weekly screen should highlight the programme drill.

- [x] Tests: `baselineDue` language; `programme` coerced to null when not an object; modifier pick is uniform over the pool (seeded counts).
- [x] Implement. Commit: `Fix v6 review minors`.

### Task 2: v5 review minors

Seven items (end of the v6 plan):
- Use the sum of the pressure items' `itemS` for the target.
- The typing-mode reply slice.
- The budget "near" colour should be amber.
- Prune `friendAsks` older than 30 days.
- Strip `original`/`firstMetrics` from shadow history entries.
- Shadow feedback should not offer Challenge or Ask a friend.
- Enter on the self-fix input should act like the button.

- [x] Tests: pressure target equals the sum of items; `friendAsks` pruning by age; shadow entry stripped.
- [x] Implement. Commit: `Fix v5 review minors`.

### Task 3: v4 review minors

Seven items:
- No weekly reset on the first week after deploy (only ask when a previous `weekly` exists, or when history spans 2+ weeks).
- Clear `ui.pendingWelcome`.
- Import should report failure when saving fails.
- Theme the review-card gradient.
- Fix the "0 rounds … <1 minutes" wording.
- Fix the duplicate screenshot numbers.
- Add a mic-permission note to the voice help text.

- [ ] Tests: weekly reset rule; import save failure surfaces; weekly summary wording for an empty week.
- [ ] Implement. Commit: `Fix v4 review minors`.

### Task 4: Owned drills as weekly maintenance

`maintenanceDrill(state, today)` returns the owned drill not played for the longest time, but at most once per ISO week: none if any owned drill was played this week. The Today pick uses it after the weekly focus and before the weakest drill, with the reason "keep it sharp". The lesson's random slot skips owned drills except this one.

- [ ] Tests: once per week; longest-unplayed owned drill; never above a due review or an event.
- [ ] Implement. Commit: `Bring owned drills back once a week`.

### Task 5: Nudge toward the least-used real-life skill

From `skillUse` (v6 Task 5): when at least two reflected events exist this week or last, and one skill has 0 uses, the Today card's reason line adds "you haven’t used X in real life yet". A skill maps to a drill: frames → frame, follow-up → followUp, calm → pressure, pause → pause. The nudge changes the reason text only, never the pick.

- [ ] Tests: no nudge without events; the skill-to-drill map uses existing drills; the least-used skill is chosen deterministically.
- [ ] Implement. Commit: `Nudge toward the skill used least in real life`.

### Task 6: Final review + wrap-up

- [ ] Fresh whole-branch review subagent (most capable model) over the v7 range, with this Review Focus. One fix pass with failing tests first; minors go to the ledger.
- [ ] Short note to Merijn. After 2026-11-08 the check-in disables itself.

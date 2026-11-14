# Vantage Point: rules for every session

## Subagents: always pass a model

Every `Agent` call carries an explicit `model` (`haiku`, `sonnet`, `opus` or `fable`). Without it the subagent inherits the session model, which silently makes every task as expensive as the session. Evidence and sources: `docs/superpowers/plans/2026-11-14-model-routing.md`.

| Role | Model |
|---|---|
| Fetch, search, read, summarise, triage (read-only) | `haiku` |
| Mechanical single-file change with full text in the brief and a check that must pass | `haiku` |
| Build a film, build an app feature, content with a brief | `sonnet` |
| Render batch (render, guard, manifest and SHELL merges) | `sonnet` |
| Review of a film, a content piece or a feature | `sonnet` |
| Review that touches the film kit, shared code, sync or storage; the first film of a new pattern; security or data loss | `opus` |
| Design, architecture, plans, builder check, kit changes others depend on | `opus` |
| Final review of a whole branch | `opus` |
| A stuck round (third time the same item is sent back) | one tier above the model that got stuck |

- Pick by what happens when the agent is wrong, then by size and risk. Haiku never writes without a check that must pass.
- Fable is not used for subagents unless Merijn asks.
- Resuming with SendMessage has no model parameter; if the model matters, start a fresh agent with `model`.
- Up to three agents in parallel, each in its own worktree, only for independent tasks; two tasks that change the same kit files run one after the other.
- Safety net: `.claude/settings.json` sets `CLAUDE_CODE_SUBAGENT_MODEL=sonnet`, so a forgotten model falls back to Sonnet. It does not replace passing `model`.
- When an agent finishes, add one line to `docs/superpowers/plans/model-ledger.md` (date, task, model, tool uses, duration, tokens, outcome).

## Standing rules for this repo

- Work on branch `claude/improvisation-practice-game-voon91`; draft PR #1 is never merged.
- Test first. Every film or content piece gets a review agent before merge; render a film right after its review.
- Bump `CACHE` in `sw.js` once per push; every new page, VTT and poster is in the `SHELL` list (`tests/swshell.test.js`).
- Before every push: `npm test`, `node src/content/courses/validate.js`, `bash scripts/shellcheck.sh` (it checks HEAD, so commit first).
- No model names in commit message bodies.
- Never ask for or show secrets.
- Content: every topic has four levels (Basis, Werkkennis, Gevorderd, Expert) and each level teaches something the lower one does not. A new module's proposal lists what each level teaches per topic before anything is written. Definitions: design addendum 3 in `docs/superpowers/specs/2026-11-13-v17-big-picture-design.md`.
- Film length (Merijn, 14 Nov): a video is as long as its content needs. A minute, or even half a minute, is enough when that says it; do not pad a film to reach a length. Every film brief gives the length as "what the content needs", not a target to fill.
- Film rules and the integrator notes: `docs/superpowers/plans/2026-11-11-v16-notes.md`. Current plan: `docs/superpowers/plans/2026-11-13-v17-big-picture.md`.

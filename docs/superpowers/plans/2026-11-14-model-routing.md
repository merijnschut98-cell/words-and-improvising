# Model routing for subagents (13 to 14 Nov 2026)

Merijn asked (14 Nov): give every dispatch a model, research what developers say about which model suits which task, and add it to the skill and the project. This file holds the rules for this project, the evidence behind them and how good that evidence is. The short version for every session is in `CLAUDE.md`.

## 1. What the check of 14 Nov found

From the transcript of this session (482 Agent dispatches):

- 21 dispatches had an explicit model, all between 26 Oct and 4 Nov (Fable 7, Opus 10, Sonnet 4).
- Since 4 Nov: 374 dispatches, none with a model. They inherited the session model, which was Opus for nearly all of them.
- No custom agents exist (`.claude/agents/` is absent), so no `model:` field is ever set.
- Haiku was never used. Parallel work (up to three agents, in worktrees) deviates from the skill's "one implementer at a time" and is kept on purpose (section 4).
- Not verifiable: what the built-in agent types default to (`/agents` is interactive), and which model a resumed agent (SendMessage) runs on: 110 logs show more than one model.

## 2. How a model is chosen (Anthropic's subagent documentation)

Source: <https://code.claude.com/docs/en/sub-agents> (redirect from docs.claude.com), read 14 Nov.

- The Agent tool takes a `model` parameter with an alias: `haiku`, `sonnet`, `opus` or `fable`. Not a full model id and not `inherit` on the tool call.
- Order, first one that is set wins: the per-call `model` parameter, then the `model` field of the agent definition, then the environment variable `CLAUDE_CODE_SUBAGENT_MODEL`, then the main conversation's model.
- So a call without `model` inherits the session model unless one of the other two is set. This is how 374 dispatches ran on Opus.
- `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1` (Claude Code 2.1.257 or later) forces one model on every subagent and makes the per-call parameter useless. Do not set it.
- Explore and Plan are read-only (Write and Edit are denied); general-purpose has every tool. Explore keeps its own `model` field if you define an agent named `Explore`.
- The page itself only says: route tasks to lower-cost models like Haiku to control costs. It gives no per-role table.

## 3. What developers report (secondary sources)

| Source | Says | How far to trust it |
|---|---|---|
| startdebugging.net, 28 Oct 2026 (<https://startdebugging.net/2026/10/claude-haiku-5-5-vs-sonnet-5-5-vs-opus-5-5-for-coding-agent-subagents/>) | Orchestrator and planner on Opus. Implementer on Sonnet (medium effort, high for long or vague tasks). Reviewer on Sonnet at high effort, Opus for security or concurrency. Explorer and log or test triage on Haiku. Fable "not for subagents in almost every case" (a Fable advisor on Opus gave +1.7 points, within noise, at about 2.1 times the cost). Governing rule: pick the model by what happens when the subagent is wrong, not by how hard the task looks. Warns that Haiku at low effort in long prompts may skip a search, stop early or skip a check. | The author's own practice. Its cost figures come from one hypothetical run. Written with an AI agent. Weak evidence, but the same split appears in the other sources. |
| Mesa, 19 Jan 2026 (<https://mesa.dev/blog/reducing-review-costs>) | In production code review, Opus 4.5 cost about half of Sonnet 4.5 per review (about 0.50 against 2.00 dollars) and ran about twice as fast, although it costs about twice as much per token. Step count drove cost; the stronger model needed fewer steps. | Real production data, but older models, one product, and no sample sizes or variance on the page. It says a stronger model can be cheaper for review. It does not say anything about implementation. |
| Arize, Sep 2026 (<https://arize.com/blog/how-i-cut-coding-agent-costs-with-model-harness-routing/>) | Cheaper models do exploration and routine edits, a frontier model does planning, ambiguous decisions, escalation and final review. One workflow fell from about 100 to 15 to 20 dollars a run. | An intern's experiments. The author says there were no repeated matched trials, quality was not measured against the frontier-only version, and a cheaper model "can still create a more expensive run". Directional only. |
| Search summaries (morphllm, mindstudio, eesel, developersdigest and others) | Same split: Opus for planning, Sonnet for implementation and review, Haiku for search and triage. Savings claims of 30 to 50 percent and 5 to 10 times. | Marketing-style claims, not verified. Used only to confirm that the split is common. |

What the sources agree on: Haiku for read-only lookups and triage whose output someone checks, Sonnet as the working default, the strongest model for planning, hard judgment and the last review. What they disagree on: whether reviews should go to Sonnet (the role tables) or to the stronger model (Mesa's data).

What nobody shows: results for a project like this one (films, content and a small PWA, built in a worktree per task with an integrator who merges).

## 4. Rules for this project

1. **Every Agent call carries `model`.** One of `haiku`, `sonnet`, `opus`, `fable`. No exceptions, also for fetch and read-only agents. A call without it is a mistake.
2. **Pick by what happens when the agent is wrong** (startdebugging), then by size and risk.

| Role in this project | Model | Why |
|---|---|---|
| Fetch, search, read and summarise pages or files; triage of long logs or test output. Read-only agents (the `web-fetch` type, `Explore`) | `haiku` | Output is read and judged by the integrator. Never for anything that writes. |
| Mechanical single-file change with the full text in the brief and a test or check that must pass afterwards | `haiku` | Transcription plus a checker. If there is no checker, use `sonnet`. |
| Build a film (kit, drawing, narration checks, TDD), build an app feature (several files, tests, e2e), content with a brief | `sonnet` | The default working model. |
| Render batches (render, listen guard, narration fixes, manifest and SHELL merges) | `sonnet` | Many steps and judgment when a guard fails; Haiku's failure mode is skipping checks. |
| Review of a film, a content piece or a feature | `sonnet` | The floor. |
| Review that touches the film kit, shared code, sync or storage; the first film of a new pattern (pilots); security or data loss | `opus` | Mesa's data and the role tables: a stronger reviewer can need fewer steps and miss less. |
| Design, architecture, plans, builder checks, kit changes that other films depend on | `opus` | Plan quality caps everything after it. |
| Final review of a whole branch | `opus` | Never the session default by accident. `fable` only when Merijn asks. |
| A stuck round (the same item failed or was sent back for the third time) | one tier above the model that got stuck | Haiku to Sonnet, Sonnet to Opus. |

3. **Fable is not used for subagents** unless Merijn asks. It costs about 2.5 times Opus, and the one source that tested an advisor saw no gain beyond noise.
4. **Resuming an agent (SendMessage) has no model parameter.** Which model a resumed agent runs on is not verified. When the model matters, start a fresh agent with `model` and a brief that points at the saved worktree state.
5. **Parallel agents are an exception to the skill's "one implementer at a time".** Up to three at once, each in its own worktree, only for independent tasks; the integrator merges and tests. Reason: the films and screens do not share files, the usage limit is the real constraint, and the merge routine is proven. Two tasks that change the same kit files run one after the other.
6. **Measure.** The sources say the metric is cost per accepted task, not price per token, and that it must be measured on your own work. When an agent finishes, the integrator adds one line to `docs/superpowers/plans/model-ledger.md`: date, task, model, tool uses, duration, tokens, outcome (accepted, sent back N times, redone). Review this after about 30 lines, and change the table above where the data disagrees.
7. **Session model.** The integrating session runs on Opus for design, review of agent reports and hard merges. Routine merging and pushing can run on Sonnet. Merijn switches the session model; the session model does not decide the subagent models any more.

## 5. Safety net and what is still offered

- **Done (Merijn said yes, 14 Nov):** `CLAUDE_CODE_SUBAGENT_MODEL=sonnet` in `.claude/settings.json` (the plain variable, not the FORCE one). A call that forgets `model` now falls back to Sonnet instead of the session model; the per-call parameter still wins. Environment settings may only apply from the next session start; until then the safety net is not verified. Check the first dispatch after a restart: the subagent log shows the model it ran on.
- **Offered, not done:** project agents in `.claude/agents/` (reader on Haiku, builder and renderer on Sonnet, reviewer on Sonnet, architect on Opus) so the model sits in the definition and not in my memory. A bigger change: the long briefs would move into agent definitions.

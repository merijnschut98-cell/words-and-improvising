# pm.run — Run (projecten, track project, level 2)
Index title: en 'Run' / nl 'Uitvoeren'. Blurb: en 'Keep a project moving: rhythm, status, decisions, scope creep and the team.' / nl 'Een project in beweging houden: ritme, status, besluiten, scope creep en het team.'
1. `pm.run.rhythm` — meeting rhythm: stand-ups, weekly, steering group; agendas that end in decisions.
2. `pm.run.status` — honest status: green/amber/red that means something, reporting bad news early.
3. `pm.run.scope` — scope creep: recognising it, change requests, saying “yes, and here is the cost”.
4. `pm.run.decisions` — getting decisions made: options with a recommendation, decision logs, escalation that works.
5. `pm.run.team` — leading without authority: motivation, commitment, handling people who don’t deliver.
6. `pm.run.conflict` — conflict in the team or with the client: interests vs positions, the difficult conversation.

## Clarity round (2026-11-04)

Every lesson now has 5 teach blocks (≤ 90 words) and 5–6 terms, each literally in the lesson’s teach text, in the same order in en and nl. PM jargon is explained at first use in teach, examples, questions and situations: stand-up and Scrum, steering group, sponsor, decision note, minutes, agile, RAG status, milestone, escalation, forecast, ERP, scope, goal sentence, change request, change control board, trade-off, gold plating, recommendation, decision criteria, escalation path, default, line manager, capacity, one-on-one, objective criteria, BATNA, downtime, grid operator, readiness check, execution (field crews), consultant days, materials reservations, savings target. In .nl the English is added once for unlisted key words (grid operator, downtime, change control board, readiness check, red/amber/green).

Terms added: rhythm — Sponsor, Minutes / Notulen; status — Milestone / Mijlpaal, Forecast / Prognose; scope — Scope, Trade-off / Afweging, Gold plating; decisions — Recommendation / Advies, Decision criteria / Besluitcriteria; team — Capacity / Capaciteit, One-on-one / Één-op-ééngesprek; conflict — Objective criteria / Objectieve criteria, BATNA. Existing terms that did not appear literally in the teach text (RAG status, Escalation, Escalation path, Leading without authority, Commitment, Line manager) now do.

New fifth blocks: how often to meet (daily stand-up vs two a week for part-time client teams); forecasts over progress and the “what would turn this red?” question; gold plating and the debate on a goodwill reserve; one-way vs two-way doors and “disagree and commit”; making capacity explicit and the consultant doing the client’s work; BATNA and why splitting the difference fails.

Facts fixed:
- pm.run.status pushback: the client said “Why go amber now?” while the model answer reports red; now “Why go red now?” in both languages.
- pm.run.status pushback model said “With eight weeks left” but the scene only said the project had been green for eight weeks; the scene now says the project runs another five months and the model says “With five months left”.
- pm.run.decisions: the pushback talks about “the director” while the model answer escalates to the sponsor; the scene now states the sponsor is the operations director.

Facts and sources:
- Stand-up/daily scrum of 15 minutes: Scrum Guide (Schwaber & Sutherland, 2020).
- Mum effect: Rosen & Tesser (1970), “On reluctance to communicate undesirable information: the MUM effect”, Sociometry 33(3).
- Gold plating and change control board: PMI PMBOK Guide terminology.
- One-way/two-way doors: Jeff Bezos, Amazon shareholder letter 2015 (Type 1/Type 2 decisions); “disagree and commit”: Bezos letter 2016, phrase originating at Intel.
- Commitment and consistency: R. Cialdini, Influence (1984).
- Positions vs interests, objective criteria, BATNA: Fisher & Ury, Getting to Yes (1981).
- Recomputed: 5 × 2 = 10 days, 10 / 40 = 25%; access promised week 5, now week 11 = 6 weeks late; pilot week 8 → 12 = 4 weeks; meeting agenda 10 + 15 + 15 + 5 = 45 min; 20% of a five-day week = 1 day. All ids, recall order, answer positions and numbers unchanged.

Uncertain: the “10% goodwill reserve” is practitioner judgement, not a standard; the four-step difficult conversation is a common practitioner format, not taken from one source.

Review pass (2026-11-04): stand-up now said to come from agile methods such as Scrum (Scrum’s own event is the Daily Scrum); MUM effect explained (“keep mum”); goal-sentence example made precise (cancelled in the week before they are due); 10% goodwill reserve labelled a rule of thumb; Bezos one-way/two-way doors dated to the 2015 shareholder letter and “disagree and commit” attributed to Intel, made known by Bezos at Amazon; BATNA tied to Getting to Yes and spelled out in nl; difficult-conversation term definition now says what it is; nl “boodschapper neergeschoten” → “het moet ontgelden”.

## v13 topics (2026-11-08): 4 topics × 4 levels

| Topic (id) | 1 Basis | 2 Werkkennis | 3 Gevorderd | 4 Expert |
|---|---|---|---|---|
| Steering and reporting / Sturen en rapporteren (`steer`) | `status` (existing) | `steerco` (new): steering pack, A3 status report, nemawashi, no-surprises rule, decisions first on the agenda | `earned` (new): PV, EV, AC, SPI, CPI, 0/100 and 50/50 rules, why SPI drifts to 1 at the end | `exception` (new): management by exception, tolerances (PRINCE2 7: seven aspects), exception report on the forecast, EAC = BAC / CPI and its assumption |
| Scope and change control / Scope en wijzigingen (`scope`) | `scope` (existing) | `change` (new): change control in five steps, change log, impact analysis, delegated authority, weekly triage, adding up small changes | `replan` (new): baseline plan (not the performance baseline of pm.plan), contingency vs management reserve, reserve burn, crashing vs fast-tracking, when to re-baseline | `rescope` (new): continued business justification, sunk costs, escalation of commitment, kill criteria, business case on future cash only, options besides continue/stop |
| Team and meetings / Team en overleg (`team`) | `rhythm` (existing) | `team` (existing) | `conflict` (existing; example now faded) | `workstreams` (new): workstreams and leads, Brooks’s communication channels n(n−1)/2, Brooks’s law, dependency board, leads meeting, meeting cost |
| Issues and escalation / Issues en escalatie (`issues`) | `issues` (new): issue vs risk vs change, issue log fields, one named owner, priority (consequence × urgency), issue age, % past due | `decisions` (existing) | `tiers` (new): tiered meetings in a project, escalation rule (hours/days per tier), visual management, obeya, feedback down, escalation-to-solution time | `multiparty` (new): client/contractor, joint issue log, mirrored escalation matrix, penalty clause arithmetic, notice of default as a legal step |

Why this split: the user asked for steering and status, scope and change, team and meetings, issues and escalation. `decisions` sits under issues at level 2 because its core is the escalation route and the default option for stuck decisions; `rhythm` opens the team topic because meetings are its subject. `conflict` was the hardest of the existing team lessons, so it becomes level 3 with a faded example.

Pointers instead of duplicates: estimating, the critical path, the risk register, roles and the performance baseline stay in pm.plan (`replan`, `issues`, `steerco` point to “Plannen / Plan”); milestones with evidence and the one-way/two-way door decision stay in pm.outside (`earned` points there); restarting a stuck project stays in pm.stuck (`rescope` points there); backlog and product owner in pm.agile (`change`); the programme board in pm.scaled (`workstreams`). Commercial scope negotiation stays in pm.negotiate.

Existing lessons: ids, recall order, answer positions and numbers unchanged (pinned in `tests/fixtures/v13-pm.run-recall-keys.json`, built from the files before this change). Wording changes only: distractors lengthened or the correct option shortened where the correct option was clearly the longest (giveaway) in status, scope, rhythm, team, conflict and decisions; `conflict` example switched from worked to faded (ask/reveal). Topic order in the file: steer, scope, team, issues.

Situations: every new lesson is written from Merijn’s seat as a junior Lean consultant (grid operator, dairy, soft drinks, packaging, metalworking, food, automation supplier, building-materials wholesaler, cable manufacturer).

Answer positions (multiple choice, pre + recall): new lessons 9 / 10 / 9 / 9 over positions 0–3; whole module 16 / 17 / 17 / 16. No question has the correct option as the clearly longest one (more than 1.3 × the next). Every numeric recall question carries its own `hint` (≤ 25 words, no answer).

Facts and sources (checked 2026-11-08):
- Earned value: SPI = EV / PV, CPI = EV / AC, EAC = BAC / CPI (typical; assumes current efficiency continues), alternative EAC = AC + (BAC − EV) for a one-off overrun — PMI, *Practice Standard for Earned Value Management*; https://www.pmi.org/learning/library/earned-value-analysis-forecast-outcomes-7898, https://www.projectengineer.net/guide-to-earned-value-formulas/. “SPI goes to 1 at the end” is the known limitation of cost-based SPI. 0/100 and 50/50 are standard EV crediting rules. The remark that EVM is less common in improvement projects is practitioner judgement, hedged in the text.
- PRINCE2 manage by exception; PRINCE2 7 (2023) tolerances on seven aspects (time, cost, quality, scope, risk, benefits, sustainability); exception report raised when a tolerance is forecast to be exceeded — https://rebelsguidetopm.com/?p=1603, https://knowledgetrain.co.uk/project-management/exception-management, https://prince2.wiki/theme/progress. Continued business justification and the three issue types (request for change, off-specification, problem/concern) — https://prince2.wiki/theme/change.
- Contingency reserve (known risks, inside the cost baseline) vs management reserve (unknown risks, outside, sponsor/management decides) — PMBOK; https://www.pmi.org/learning/library/model-risk-contingency-reserve-9310, https://projectengineer.net/contingencies-vs-management-reserves. Sources differ on where contingency sits (PMBOK 7 figure vs EVM practice), so the text says “sources differ; agree at the start”.
- Crashing (add resources, costs money) vs fast-tracking (overlap, costs risk/rework), both only on the critical path — https://uwaterloo.ca/ist-project-management-office/methodology/project-management/planning/project-schedule/schedule-compression.
- Brooks, *The Mythical Man-Month* (1975): channels n(n − 1)/2, Brooks’s law — https://en.wikipedia.org/wiki/The_Mythical_Man-Month. Stated as a rule of thumb outside software.
- Staw (1976), “Knee-deep in the big muddy”, *Organizational Behavior and Human Performance* 16, 27–44; Arkes & Blumer (1985), “The psychology of sunk cost”, *OBHDP* 35 — https://www.gwern.net/doc/psychology/cognitive-bias/sunk-cost/1976-staw.pdf, https://en.wikipedia.org/wiki/Escalation_of_commitment.
- A3 used at Toyota for problem solving, proposals and status; John Shook, *Managing to Learn* (LEI, 2008) — https://email.lean.org/hubfs/ebook%20files/How-to-use-A3-PDF-final.pdf, https://www.lean.org/?p=3342.
- Nemawashi (“turning/loosening the roots”, consulting stakeholders before a formal decision) — https://en.wikipedia.org/wiki/Nemawashi, lean.org lexicon. Obeya (“big room”), credited to Prius chief engineer Takeshi Uchiyamada — https://www.lean.org/lexicon-terms/obeya/.
- Tiered daily management (tier 1 team, tier 2 area, tier 3 plant leadership; escalation is the product; tier 2 only handles what tier 1 could not; measure escalation-to-resolution time) — https://www.fabrico.io/blog/tier-meetings/, https://kaizen.com/insights/daily-management-manufacturing-plant/. Meeting lengths (10–20 min) and the 1-day/2-day escalation rule are given as examples (“sources differ”).
- Penalty clause (boetebeding) and notice of default (ingebrekestelling) are Dutch civil-law concepts (BW 6:91 and 6:82); the text tells the learner to involve purchasing or lawyers and says details differ per contract. The 0.5% per week / 10% cap is an example, not a norm.
- Practitioner rules of thumb, labelled as such: re-baseline at most at a stage boundary or after a big decision; three to five workstreams; nemawashi 10–20 minutes per member; steering pack two working days ahead.

Recalculations (new lessons):
- steerco r3: 90 min = 1.5 h; 1.5 × 6 = 9 person-hours. Example: 4 talks × 15 min.
- earned r0: 60,000 / 80,000 = 0.75; r1: 60,000 / 75,000 = 0.8. Example: PV 6 × 10,000 = 60,000; EV 4.5 × 10,000 = 45,000; AC 54,000; SPI 0.75; CPI 0.833; EV / BAC = 45 / 120 = 37.5%.
- exception r0: 200 / 0.8 = 250; r2: 120 × 1.1 = 132, 135 − 132 = 3. Teach: 200,000 / 0.8 = 250,000 vs limit 220,000. Example: 80,000 / 0.9 = 88,889 vs 88,000.
- change r0: 3 + 4 + 5 = 12; 12 / 60 = 20%. Example: 5 + 3 = 8; 8 + 4 = 12 over the sponsor’s 10.
- replan r0: 18 / 30 = 60%; example the same at 50% of the work.
- rescope r0 and example: 70 × 2 = 140; 140 − 90 = 50 (the 150 sunk is ignored). Pre: 90 future cost vs 60 return.
- workstreams r0: 8 × 7 / 2 = 28 (4 → 6, 15 → 105; 28 / 6 ≈ 4.7, “almost five times”); r1: 10 × 1.5 × 30 = 450; situation: 16 × 2 = 32 person-hours a week.
- issues r2: 5 / 20 = 25%.
- tiers r0: 1 + 2 = 3 working days.
- multiparty r0 and example: 6 × 0.5% = 3%; 3% × 400 = 12 (cap 10% = 40).

Uncertain: whether contingency sits inside or outside the cost baseline (taught as “agree it”); exact tier meeting durations; the legal strength of a penalty when the client caused part of the delay (taught as “probably weaker”, with “involve purchasing or lawyers”).

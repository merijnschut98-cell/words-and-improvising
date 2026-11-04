# pm.plan — Plan (projecten, track project, level 1)
Index title: en 'Plan' / nl 'Plannen'. Blurb: en 'Turn a goal into a plan people believe: scope, steps, estimates, risks and a rhythm.' / nl 'Van een doel naar een plan waar mensen in geloven: scope, stappen, schattingen, risico’s en ritme.'
1. `pm.plan.wbs` — breaking work down: deliverables first, then work packages; the 8–80 hour idea.
2. `pm.plan.estimate` — estimating honestly: ranges, three-point estimates, why people underestimate, buffers.
3. `pm.plan.schedule` — dependencies, critical path, milestones; a plan on one page.
4. `pm.plan.risk` — risk register that is used: likelihood, impact, owner, action; pre-mortem.
5. `pm.plan.raci` — roles: RACI, one owner per deliverable, making the sponsor’s role explicit.
6. `pm.plan.method` — choosing a way of working: waterfall vs agile vs hybrid; when sprints help in improvement projects.

## Clarity round (2026-11-04)

Every lesson now has 5 teach blocks (≤ 90 words) and 5–6 terms in the same order in en and nl. PM jargon is explained at first use in teach, questions, options, examples and situations (grid operator, baseline, pilot, works council/OR, MS jobs/MS station, control room, downtime, capper, PMI, steering group, migration, line terminal, work preparation, capacity model, cell, readiness check, retrospective). In .nl, unlisted key words carry the English once (baseline, works council, unplanned downtime, range, effort, duration, milestone, steering group, critical path, slack, risk register, mitigation, red flag, waterfall, retrospective).

Terms added: wbs — WBS, Definition of done; estimate — Range / Bandbreedte, Effort / Inspanning, Duration / Doorlooptijd, Buffer (replacing the combined “Effort vs duration”); schedule — Dependency / Afhankelijkheid, Go/no-go, Gantt chart / Gantt-chart; risk — Risk owner / Risico-eigenaar, Mitigation / Beheersmaatregel; raci — Responsible, Consulted, Informed; method — Agile, Scrum, Pilot.

New fifth blocks: the WBS and the 100% rule; planning fallacy with the 1994 thesis study and reference-class advice; buffers with Parkinson’s law and student syndrome; failure mode of missing outside steps and the wall-plan vs software debate; risk scoring 1–25 and mitigation vs “monitor”; RACI failure modes and RASCI/DACI variants; Scrum explained and the debate on how much pilots prove.

Facts fixed: in pm.plan.estimate the pushback model said “between May and September” and “by next Tuesday” while the model answer said June–September with IT on Tuesday and the update on Wednesday; both languages now say June–September and next Wednesday.

Facts and sources:
- PERT (O + 4M + P) / 6: US Navy Special Projects Office, Polaris programme, 1958 (Malcolm et al., Operations Research 7(5), 1959).
- Planning fallacy: Kahneman & Tversky (1979), “Intuitive prediction: biases and corrective procedures”. Thesis study: Buehler, Griffin & Ross (1994), J. Pers. Soc. Psychol. 67(3): predicted 33.9 days, actual 55.5 days (rounded to 34 and 56).
- Parkinson’s law: C. N. Parkinson, The Economist, 1955. Student syndrome: E. Goldratt, Critical Chain, 1997.
- Critical path method: Kelley (Remington Rand) & Walker (DuPont), 1957. Gantt chart: Henry Gantt, c. 1910–1915.
- WBS 100% rule: PMI Practice Standard for Work Breakdown Structures. 8/80 rule: common practitioner heuristic, not a standard.
- Pre-mortem: G. Klein, “Performing a Project Premortem”, HBR, Sept 2007. Prospective hindsight: Mitchell, Russo & Pennington (1989), J. Behavioral Decision Making 2(1); Klein reports it “increases the ability to correctly identify reasons for future outcomes by 30%”.
- Scrum: Scrum Guide (Schwaber & Sutherland, 2020): sprints of one month or less; review and retrospective. Agile Manifesto: 17 signatories, Snowbird, February 2001.
- RASCI and DACI are common RACI variants (DACI: Driver, Approver, Contributors, Informed).
- Recomputed: (4 + 24 + 14) / 6 = 7; 24 / 4 = 6; A-C-D = 3 + 6 + 2 = 11 vs A-B-D = 9; example chains 3 + 4 + 2 + 6 = 15 and 3 + 6 + 6 = 15; with C parallel to A, C ends week 6 while E waits for D at week 9, so 3 weeks slack; (2 + 12 + 10) / 6 = 4 days effort at 1 day a week ≈ 4 weeks. All recall numbers, answer positions and ids unchanged.

Uncertain: the 1–5 × 1–5 scoring is one common convention among several; “experts doubt how much pilots prove” reflects the Hawthorne-style attention effect, practitioner judgement rather than a single study.

Review fixes: the estimate example’s plan range now follows from its numbers (2–10 days of effort at 1 day a week = 2 to 10 weeks, most likely about 4; was “3 to 6 weeks”). Risk scoring example now compares different scores (12 vs 10; “4 × 3 vs 3 × 4” were equal). Prospective hindsight attributed to Mitchell, Russo & Pennington (1989) as cited by Klein. CPM credited to DuPont and Remington Rand; Gantt charts “in the 1910s”.

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

## v13 topics (topic module, 4 × 4)

Spec: v13 plan, section 5. The six existing lessons keep their ids, recall order, answer positions and numbers; their text is unchanged (all sit at levels 1–2, so all keep their worked example). Pinned in `tests/fixtures/v13-pm.plan-recall-keys.json` (built from the files before this change) and checked by the generic v13 loader in `tests/progresskeep.test.js`. Classic and hybrid planning only: agile planning stays in pm.agile; scope creep and the change conversation stay in pm.run (pm.plan.control cross-references “Uitvoeren / Run”).

| Topic | 1 Basis (worked) | 2 Werkkennis (worked) | 3 Gevorderd (faded) | 4 Expert (faded) |
|---|---|---|---|---|
| breakdown · Opdeling en scope | wbs (existing): deliverables, WBS, work packages, 8–80, DoD | scope (new): scope statement, out of scope, acceptance criteria, assumptions vs constraints | products (new): PRINCE2 product-based planning: project product description, PBS, product descriptions, product flow diagram, external products, tailoring | control (new): scope baseline, tolerances and exceptions, impact of a change on the end date (buffer, float), rolling wave planning, planning packages |
| schedule · Planning en kritiek pad | schedule (existing): dependencies, critical path, milestones, Gantt on one page | method (existing): waterfall, agile, hybrid milestone plan with rounds | network (new): network diagram, forward and backward pass, total and free float, checking the logic | compress (new): crashing, fast-tracking, Brooks’s law, schedule baseline, milestone trend analysis, cutting scope |
| estimate · Schatten en buffers | estimate (existing): ranges, three-point, planning fallacy, effort vs duration, one visible buffer | techniques (new): analogous, parametric, bottom-up, inside/outside view, reference class | spread (new): PERT σ = (P − O)/6, adding variances, confidence level, P80, Monte Carlo | chain (new): critical chain, project and feeding buffers, fever chart, management reserve |
| resources · Risico’s en mensen | risk (existing): register, owner, mitigation, pre-mortem | raci (existing): RACI, one accountable, the sponsor | capacity (new): resource histogram, overallocation, availability, leveling vs smoothing, scarce specialists, switching cost | riskvalue (new): EMV, PMBOK threat and opportunity responses incl. escalate, contingency vs management reserve |

Situations come from Merijn’s work as a junior Lean consultant: a CNC lead-time project at a metalworking company (scope A4, cell layout network, PLC programmer capacity), work preparation at a grid operator (PRINCE2 products, critical chain), SMED at a dairy plant (impact analysis, risk reserve), a 5S roll-out and planning method at a plastics processor (estimating methods, P80), and a line move in a food plant’s summer shutdown (crashing/fast-tracking). Every lesson has `said`, a situation and a pushback.

### Facts and sources (v13)
- PRINCE2 product-based planning, four steps (project product description, product breakdown structure, product descriptions, product flow diagram), external products shown as ellipses, tailoring, tolerances and exceptions: PRINCE2 (AXELOS/PeopleCert; 7th ed. 2023). Checked against https://en.wikipedia.org/wiki/Product-based_planning, https://en.wikipedia.org/wiki/Product_flow_diagram and https://prince2.wiki/Plans.
- Rolling wave planning as progressive elaboration; planning package = WBS component with scope and budget but no activities: PMBOK Guide; checked via https://www.projectmanagement.com/wikis/295452/progressive-elaboration and https://project-management-prepcast.com/free/pmp-exam/tips/341-know-the-difference-between-a-planning-package-and-a-work-package. “Six to eight weeks” of detail is stated as a common horizon, not a rule.
- Forward/backward pass, total and free float: standard CPM (Kelley & Walker 1957, already cited above).
- Crashing (adds resources, mainly cost) vs fast-tracking (overlaps, mainly risk/rework); resource leveling (may move the end date) vs smoothing (within float only): PMBOK Guide, Develop Schedule; checked via https://uwaterloo.ca/ist-project-management-office/methodology/project-management/planning/project-schedule/schedule-compression.
- Brooks’s law, “adding manpower to a late software project makes it later”: F. Brooks, The Mythical Man-Month (1975); https://en.wikipedia.org/wiki/The_Mythical_Man-Month. Stated as about software, “holds for much knowledge work” hedged.
- Milestone trend analysis (planned milestone dates plotted per reporting date; rising line = slip): https://www.microtool.de/en/knowledge-base/milestone-trend-analysis/.
- Inside vs outside view: Kahneman & Lovallo, “Timid choices and bold forecasts”, Management Science 39(1), 1993. Reference class forecasting: B. Flyvbjerg, “From Nobel Prize to project management: getting risks right”, Project Management Journal 37(3), 2006; https://arxiv.org/abs/1302.3642.
- PERT activity σ = (P − O)/6 and adding variances along a path: Malcolm, Roseboom, Clark & Fazar, Operations Research 7(5), 1959 (stated as a convention based on an assumed beta distribution). Normal approximation: mean ≈ 50%, mean + 1σ ≈ 84%; P80 ≈ mean + 0.84σ.
- Critical chain: E. Goldratt, Critical Chain (1997). Project buffer “half of the removed safety” stated as one rule of thumb among several (a third, or calculated); feeding buffers where side chains join; fever chart = % buffer used vs % chain complete. Checked via https://en.wikipedia.org/wiki/Critical_chain and https://www.mosaicprojects.com.au/WhitePapers/WP1050_Critical_Chain.pdf. Criticism (little evidence for buffer sizes) stated as expert disagreement.
- EMV = probability × impact; PMBOK 6th ed. (2017) threat responses escalate, avoid, transfer, mitigate, accept; opportunity responses escalate, exploit, share, enhance, accept; contingency reserve for known accepted risks vs management reserve for unknowns under the sponsor. Checked via https://www.4pmti.com/?p=1005819. Lesson names the five threat responses and four opportunity responses (escalate mentioned for threats).
- Weinberg (1992) switching rule of thumb, two projects ≈ 20% lost: already sourced in pm.outside; hedged as a rule of thumb.
- Recomputed: (15 − 8)/15 = 46.7%; pilot max(3 + 4, 9) + 6 = 15; 5 − 3 = 2; float 2 in 3 leaves 1; network C float 7 − 4 = 3 (A 4, B 5, C 2, D 3); cell example A-B-D = 6, C float 1; crashing €10,000/2 = €5,000 vs €4,000; line move 20 − 3 = 17, electrics 20 − 2 = 18; 6 × 3 = 18; 20/8 × 12 = 30; 15 × 2 = 30 vs 25/10 × 15 = 37.5; σ (24 − 6)/6 = 3; √(9 + 16) = 5; path 6 + 7 + 5 = 18, √(4 + 1 + 4) = 3, 21 at ≈84%; 16 weeks ≈ mean − 0.67σ ≈ 25%; chain 6 + 5 + 4 + 7 = 22, 36 − 22 = 14, buffer 7, total 29; 5/7 ≈ 71%; 12/2 = 6; 15 − 6 = 9; 0.8 × 40 = 32; 20 − 8 = 12 hours over, 12 h over weeks 5–6 = 6 h; 0.25 × 40,000 = 10,000; 0.4 × 15,000 = 6,000; 6,000 + 4,000 + 2,500 = 12,500; 6,000 + 4,000 + 4,000 = 14,000.

Uncertain: “six to eight weeks” for the rolling wave horizon, the 4–8 project hours a week for a shift leader, and buffer-size rules are practitioner rules of thumb, stated with “often”, “about” or as one option among several.

### v13 review fixes (2026-11-08)
- Cross-references where topics are shared: scope → Intake (goal sentence, first in/out list) and Run (scope creep); techniques → “Leading projects outside your field” (reference class to check an expert’s estimate); spread → “Agile and Scrum” (Monte Carlo on throughput). control already pointed to Run.
- techniques situation contradicted the example (sister plant “with as many clusters, 37 days” vs 25 days for 10 clusters): now 25 days for 10 clusters, scaled to about 37 for 15.
- compress example: made clear that the 20-week critical path is the preparation that must be ready when the shutdown starts in 17 weeks; the pushback model also gains the one week on the electrics that otherwise becomes critical (18 weeks). The pre-question no longer repeats schedule recall 3; it now asks for the price of fast-tracking (answer position unchanged).
- riskvalue: opportunity responses per PMBOK 6 are five (escalate, exploit, share, enhance, accept), not four. The situation used “five risks, about €14,000”, which clashed with the three-risk example: now the three accepted risks, €14,000, about €10,000 after mitigating the night shift.
- Harder level-3/4 recall numbers: chain 32 − 20 = 12, 12 / 2 = 6, 20 + 6 = 26 weeks (was 12 / 2 = 6); capacity 40 − 30 − 4 = 6 available, 15 − 6 = 9 hours (same answer); riskvalue 0.3 × 20,000 + 0.1 × 25,000 + 0.5 × 5,000 = 6,000 + 2,500 + 2,500 = 11,000 (was 6,000 + 4,000 + 2,500 = 12,500). Own hints on new number questions whose generated hint was the whole sum.
- Hedges: Brooks’s law in other knowledge work (“many see the same effect”); “red on a typical fever chart”; without a buffer, a chain of 50% estimates is “at best” a fifty-fifty bet (sums of right-skewed medians fall below the median of the sum); Flyvbjerg’s method “described in a 2006 article” (first applied in the early 2000s).

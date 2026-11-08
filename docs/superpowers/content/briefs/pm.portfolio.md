# pm.portfolio — Programmes, portfolios and governance (projecten, track project, level 4, FADED examples)
Index title: en 'Programmes and governance' / nl 'Programma’s en governance'. Blurb: en 'Expert level: running several projects as one, steering at board level, benefits and hard priorities.' / nl 'Expertniveau: meerdere projecten als één sturen, sturen op directieniveau, baten en harde prioriteiten.'
1. `pm.portfolio.programme` — programme vs project: shared goals, dependencies, the programme board.
2. `pm.portfolio.prioritise` — portfolio prioritisation: value, effort, risk, capacity; saying no at portfolio level.
3. `pm.portfolio.governance` — governance that works: decision rights, steering groups that decide, escalation lines.
4. `pm.portfolio.benefits` — benefits management: from outputs to outcomes, owners, tracking after the project ends.
5. `pm.portfolio.capacity` — capacity and resource conflicts across projects: the same experts everywhere, making trade-offs visible.
6. `pm.portfolio.boardroom` — presenting to a board or MT: one page, the decision you need, handling the tough question.

## Clarity round (2026-11-06)
All six lessons deepened from 4 to 5 teach blocks (≤ 90 words) with what you see/hear, failure modes, what experts argue about and a sharp question; 5–6 terms per lesson, en and nl in the same order, each occurring as a whole word in its lesson's teach text; no term defined twice in the module. Ids, recall order, answer positions and numbers unchanged (checked against `git show HEAD`). Abbreviations explained at first use per lesson (COO, OEE, MES, KPI, MT, CFO, ERP, go-live, go/no-go, controller, scope, critical path, business case).

Terms added: programme: Portfolio, Watermelon reporting/Watermeloeneffect; prioritise: Bottleneck, Work in progress/Onderhanden werk; governance: Governance, Escalation/Escalatie, Mandate/Mandaat; benefits: Output, Benefit/Baten, Attribution/Toerekening; capacity: Resource conflict/Capaciteitsconflict, Lead time/Doorlooptijd; boardroom: Pyramid principle/Piramideprincipe, Board paper/Directiestuk. Existing terms that were missing from the teach text (Risk-adjusted value, Capacity line, Hidden objection, Contextswitch and others) are now written into it.

Recomputed numbers:
- 0.9⁴ = 0.6561 → 66% (assumes independent projects; now stated).
- Value per scarce day: A 300/120 = 2.5; B 150/30 = 5; example B 180/40 = 4.5, D 90/30 = 3, A 200/80 = 2.5, C 400 × 0.5 / 200 = 1; B + D + A = 150 days, + 60-day phase = 210, buffer 30 of 240.
- Little's law (lead time = WIP ÷ throughput): 12 / 3 per quarter = 4 quarters; 6 / 3 = 2 quarters.
- Governance: €50k / €400k = 12.5%.
- Benefits: 1,200 × €750 = €900k.
- Availability: 260 weekdays − ~50 (≈25 holiday, ≈7 public holidays, ≈11 sickness at ~4–5%, ≈5 training) − ~20 general meetings/admin ≈ 190; 30% × 190 = 57 days ≈ 4.75/month.
- Four projects × one day a week = 4 days a week ≈ 16–17 days a month (was "about 16"; 4 × 4.33 = 17.3).
- Boardroom: €300k / €360k per year × 12 = 10 months payback.

Sources:
- PRINCE2 (AXELOS): tolerances and the principle "manage by exception".
- RACI: common responsibility-assignment chart; no single author claimed.
- Little, "A proof for the queuing formula L = λW" (1961); lead time explained at first use in the prioritise lesson.
- Weinberg, *Quality Software Management, Vol. 1* (1992): context-switching rule of thumb (2 projects 20% lost, 3 → 40%, 5 → 75%), presented as an estimate.
- Flyvbjerg's studies of large projects (e.g. 2003 *Megaprojects and Risk*; 2005 *JAPA* on demand forecasts): benefit shortfalls common, linked to optimism bias and strategic misrepresentation; wording hedged.
- Minto, *The Pyramid Principle* (developed at McKinsey).
- "Watermelon reporting" (nl "watermeloeneffect", the usual Dutch phrase): common practitioner term, no author.
- Rules of thumb hedged: 5–7 steering-group members, 80% planned load, "two or three red rows".

## v13 topics (topic module, 4 × 4)

Spec: v13 plan, section 5. The six existing lessons keep their ids, recall order, answer positions and numbers (pinned in `tests/fixtures/v13-pm.portfolio-recall-keys.json`, built from the files before this change and checked by the generic v13 loader in `tests/progresskeep.test.js`). Five of them now sit at levels 1–2, so their faded examples became worked examples (situation, then “What you do”/the working); boardroom sits at level 3 and keeps its faded example. Distractors were lengthened where the right answer was clearly the longest option, and every numeric recall question got its own hint (none contains the answer). Benefits teach block 5 no longer repeats Flyvbjerg (now in realism) and points to pm.land; capacity block 4 points to pm.plan for single-project resource planning. No figures exist for this module. Module stays level 4 (the module label is renamed in the layout part).

Scope boundaries: SAFe’s relative WSJF scores, Portfolio Kanban, Lean budgets and stage-gate plus agile in product development are taught in pm.scaled (costofdelay, balance and gates point there and work in real euros for a capex/improvement portfolio instead). Benefits for one project, hard/soft savings and handover live in pm.land; proving and normalising results in pm.close; tolerances and steering one project in pm.run; reference classes for time/cost estimates in pm.plan. pm.portfolio takes the programme and portfolio view.

| Topic | 1 Basis (worked) | 2 Werkkennis (worked) | 3 Gevorderd (faded) | 4 Expert (faded) |
|---|---|---|---|---|
| programmes · Programma’s | programme (existing) | msp (new): MSP, vision statement, target operating model (blueprint), tranche, SRO, business change manager | dependencies (new): dependency register, external dependency, interface, merge bias, integrated plan | tranches (new): change saturation, capability, transition, end-of-tranche review, programme closure |
| priorities · Prioriteren en capaciteit | prioritise (existing) | capacity (existing) | costofdelay (new): cost of delay, urgency profile, fixed date, CD3, hidden queue | balance (new): portfolio management, mandatory project, strategic buckets, portfolio review, zombie project |
| governance · Governance en sturen | governance (existing) | gates (new): stage gate, gatekeeper, gate criteria, capex, approval authority, salami slicing | boardroom (existing) | assurance (new): assurance, Three Lines Model, Gateway review, health check, PMO |
| benefits · Baten | benefits (existing) | benefitsmap (new): benefits map, enabler, business change, dis-benefit, benefits profile | tracking (new): benefits register, double counting, ramp-up, leading/lagging indicator | realism (new): iron law, optimism bias, strategic misrepresentation, reference class forecasting, post-investment review |

Situations come from manufacturing and Merijn’s Lean consulting work: an ERP programme over three metal plants (tranches, SRO choice, interface between ERP and MES suppliers, go-live readiness and data migration), a capex programme for a printing press (merge point with grid connection), a dairy capex committee (cost of delay with a fixed-date customer line), a plastics processor (robot cell vs dryer, mould investment gate, benefits register double counting), a packaging plant (palletising robot gate, ramp-up reporting), a metal group capex committee (reference class correction), food producers (stalled automation project, MES benefits map, PMO asked to assure its own work, lean business case at board). Every lesson has `said`, a situation and a pushback. Answer positions: pre 4/4/4/4, recall MC 13/12/12/12 (en and nl identical).

### Facts and sources (v13)
- MSP 5th edition (AXELOS/PeopleCert, 2020): blueprint retitled target operating model; tranches separated by governance reviews; SRO, programme manager, business change manager roles kept. AXELOS blog “MSP 5th edition – what has changed?” (axelos.com/resource-hub/blog/msp-5th-edition-what-has-changed); study guides used only for wording, hedged.
- Merge bias / path convergence: standard schedule-risk term (Hulett, Practical Schedule Risk Analysis); stated as “schedule-risk analysts call this”. 0.8³ = 0.512; 0.9³ × 0.7 = 0.510. Correlation claim deliberately avoided (positive correlation raises the joint on-time chance); taught instead that shared people make paths one queue.
- Change saturation: term popularised by Prosci; heatmap scores and the limit of 5 are illustrative, stated as agreed by the site.
- Cost of delay: Reinertsen, The Principles of Product Development Flow (2009), “if you only quantify one thing”. Urgency profiles (standard, fixed date, expedite, intangible) and CD3 = cost of delay ÷ duration, “for scheduling, not for deciding whether to do it”, power-law distribution: Joshua Arnold, Black Swan Farming (blackswanfarming.com/cost-of-delay, /comparing-cost-of-delay-approaches).
- Portfolio definition: PMI, The Standard for Portfolio Management (4th ed., 2017). Strategic buckets: Cooper, Edgett & Kleinschmidt, Portfolio Management for New Products; split percentages illustrative.
- Stage-Gate: Robert Cooper (1980s/1990 “Stage-Gate systems”, Business Horizons); go/kill/hold/recycle, gatekeepers, must-meet and should-meet criteria (PDMA/Cooper 2026 post and course material). “Gates that never kill” stated as a common failure, not a measured rate.
- Three Lines Model: IIA, “The IIA’s Three Lines Model: an update of the Three Lines of Defense” (July 2020), theiia.org. PMO as second line stated as “usually”.
- Gateway review: OGC Gateway Process (UK, 2001), now run by the Infrastructure and Projects Authority; Gate 0 strategic assessment to Gate 5 benefits realisation; delivery confidence rating green to red (finance-ni.gov.uk, NZ Treasury Gateway factsheet).
- PMO types supportive/controlling/directive: PMBOK Guide 6th ed. (PMI 2017).
- Benefits dependency network: Ward & Daniel, Benefits Management (Cranfield; Wiley 2006/2012); Bradley, Benefit Realisation Management (Gower). Benefits profile: MSP.
- Flyvbjerg & Gardner, How Big Things Get Done (2023): ~16,000 projects, ~8.5% on budget and time, ~0.5% on budget, time and benefits; “iron law” of megaprojects (Flyvbjerg 2014, Project Management Journal). Data mostly large projects; plant-level transfer hedged as “often, in milder form”. Critique: Love & Ahiaga-Dagbui (2018), Transportation Research Part A, and the Flyvbjerg et al. rejoinders; stated as a dispute. Planning fallacy: Kahneman & Tversky (1979). UK HM Treasury Green Book supplementary guidance on optimism bias (stated without numbers).
- Weinberg (1992), Little (1961), Minto, PRINCE2 tolerances: unchanged from the clarity round.

### Recomputed (v13)
- msp: (24 − 9) = 15 months × €300k/12 = €25k → €375k.
- dependencies: 0.8³ = 0.512 ≈ 50%; 0.9³ × 0.7 = 0.729 × 0.7 = 0.5103 → 51%; example power connection week 26 ± 4 → late case week 30, start-up week 34.
- tranches: 3 + 2 + 2 + 1 = 8, limit 5 → 3 over; example without 5S: 3 + 2 + 1 = 6.
- costofdelay: pre B waits 3 × 10 = 30 vs A waits 3 × 40 = 120; 30/2 = 15; A(2) then B: 2 × 20 = 40 vs 4 × 20 = 80; dairy D 15/2 = 7.5, C 25/4 = 6.25; D,E,C: C waits 5 × 25 = 125; C,E,D: E done month 7 → 1 × 60 + D waits 7 × 15 = 105 → 165; E,D,C: D 3 × 15 = 45 + C 5 × 25 = 125 → 170; situation dryer waits 5 × 20 = 100 vs robot 2 × 8 = 16 → 84.
- balance: (3.0 − 0.6) × 0.3 = 0.72 → €720k; example 250 + 250 = 500 mandatory, 2.5M × 50/30/20 = 1.25M / 750k / 500k.
- gates: 320/110 = 2.91 years; 360/120 = 3.
- assurance: 2% × 15,000 = 300; 2,700 − 300 = 2,400 (18% failing in the example is 2,700 of 15,000).
- benefitsmap: 6.0 − 4.8 = 1.2M × 15% = €180k/year.
- tracking: 240/4 = 60 per quarter; 15 + 30 + 60 + 60 = 165; register 180 + 220 + 100 = 500 vs 260 in the P&L.
- realism: 0.7 × 500 = 350; 0.65 × 400 = 260; 1.1/0.26 = 4.23 years; 1.1/0.4 = 2.75.

Uncertain: “many practitioners say benefits tracking is the most neglected step” and “some practitioners keep the integrated plan to a few dozen lines” are practitioner views, stated as such; the change-impact scores and capex splits are illustrative.

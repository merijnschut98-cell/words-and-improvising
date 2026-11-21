# pm.intake — Intake: from a client’s question to a real project (projecten, track project, level 1)

Index entry: `{ id: 'pm.intake', subject: 'pm', track: 'project', level: 1, title: { en: 'Intake', nl: 'Intake' }, blurb: { en: 'From the client’s question to a project worth doing.', nl: 'Van de vraag van de klant naar een project dat het waard is.' }, lessons: [...6 ids], questions: {...} }`

Lessons (ids and one line each):
1. `pm.intake.ask` — what the client asks vs what they need: symptom, problem, goal; questions that get underneath.
2. `pm.intake.firsttalk` — the first conversation: structure, listening (MORE PIES as a listening tool), what to leave with.
3. `pm.intake.stakeholders` — sponsor, owner, users, blockers; a quick stakeholder map; who decides, who can stop it.
4. `pm.intake.done` — defining done: measurable outcome, scope in/out, acceptance criteria, the one-sentence goal.
5. `pm.intake.start` — the first weeks: quick wins vs foundations, building trust, setting the rhythm.
6. `pm.intake.no` — saying no or reshaping a bad project: red flags, how to push back without losing the client.

## Clarity round (2026-11-04)

Every lesson now has 5 teach blocks (≤ 90 words) and 4–6 terms in the same order in en and nl. PM/consulting jargon is explained at first use (KPI, OEE, changeover, scrap, MS station, works council/OR, MT, steering group, pilot, kick-off, deliverable, MES, ERP, Q2, lead time, product family, business case, benchmark, reorganisation). In .nl, unlisted key words carry the English once (cost of inaction, works council, steering group, lead time, changeover, scrap, baseline).

Terms added: ask — Cost of inaction / Kosten van niksdoen, OEE; firsttalk — Open questions / Open vragen, Reflecting / Reflecteren; stakeholders — Stakeholder, Escalation / Escalatie; done — Out of scope / Buiten scope, Scope creep; start — Kick-off, Steering group / Stuurgroep; no — Hidden agenda / Verborgen agenda. “Herscopen” and “Intakesamenvatting”, “Proceseigenaar”, “Stakeholdermap” now appear literally in the nl teach text.

New fifth blocks: expert disagreement on accepting the client’s solution (hypothesis as middle ground); why paraphrasing works and the 70–80% talk ratio; org-chart blind spot and whether to show the stakeholder map; scope creep with “what do we drop?”; going to the floor with counts not impressions; hidden agenda signs.

Facts and sources:
- OEE = availability × performance × quality; 85% “world class” is Nakajima’s (TPM, 1988) commonly quoted benchmark; ~60% typical for discrete manufacturing (widely cited industry surveys). Phrased as “often quoted” / “many plants measure around 60%”.
- Stakeholder power–interest grid: Mendelow, A. L. (1981), “Environmental Scanning: The Impact of the Stakeholder Concept”, Proceedings of the 2nd International Conference on Information Systems (ICIS 1981, Cambridge MA); widely mis-cited as 1991. Phrased “usually credited to Mendelow (1981, often cited as 1991)” (review fix).
- Dutch works council consent right on working-time and shift schedules: Wet op de ondernemingsraden art. 27 lid 1 sub b (arbeids- en rusttijdenregeling). A decision taken without consent is voidable if the OR invokes it (art. 27 lid 5), hence “can stop a project for months”.
- MS stations: Dutch medium-voltage distribution is mostly 10 kV or 20 kV, stepped down to 400/230 V.
- Recomputed: 3.2% × 75,000 = 2,400 kg; 2.0% × 75,000 = 1,500 kg; difference 900 kg (unchanged). 20 min × 5 × 46 = 4,600 min = 76.67 h (unchanged). 140/600 and 90 of 140 in the example are illustrative, unchanged. 6 changeovers × 50 min = 300 min = 5 h (unchanged).
- Recall ids, order, answer positions and numbers unchanged; only clarifying words added to options (en and nl alike).

Uncertain: the 85%/60% OEE figures are conventions, not measured norms; the “one or two quick wins a week in the first four weeks” balance is practitioner judgement.

## v13 topics (2026-11-08)

Rebuilt as 4 topics × 4 levels (1 Basis, 2 Werkkennis, 3 Gevorderd, 4 Expert); `levels[i]` in the index is level i + 1. Worked examples at levels 1–2, faded at 3–4. Situations are framed from Merijn’s work as a junior Lean consultant (grid operator, packaging, dairy, metal, pumps, plastics, machine builder).

| Topic (id) | Basis | Werkkennis | Gevorderd | Expert |
|---|---|---|---|---|
| Van vraag naar probleem `problem` | `ask` (existing) | `firsttalk` (existing) | `problemstatement` (new) | `issuetree` (new) |
| Stakeholders en vertrouwen `people` | `stakeholders` (existing) | `start` (existing) | `contracting` (new) | `coalition` (new) |
| Scope en projectopdracht `scope` | `done` (existing) | `charter` (new) | `sipoc` (new) | `phasing` (new) |
| Businesscase en voorstel `case` | `value` (new) | `proposal` (new) | `no` (existing) | `sensitivity` (new) |

Existing lessons: ids, recall count, recall order, answer positions and numbers unchanged, pinned in `tests/fixtures/v13-pm.intake-recall-keys.json` (built from the files before this change). Only change to an existing lesson: `no` (now level 3) gets a faded example (same facts, split into text / ask / reveal).

Scope per new lesson:
- `problemstatement` — problem statement without cause, solution or culprit; gemba; 5 Whys; is/is-not analysis.
- `issuetree` — hypothesis-driven diagnosis; issue tree; MECE; Pareto; data requests; guarding against confirmation bias.
- `contracting` — Block’s contracting: wants and offers, fifty-fifty responsibility, recontracting.
- `coalition` — Kotter’s guiding coalition, the informal network, works council advice and consent rights.
- `charter` — one-page project charter: sections, deliverables, milestones, assumptions; A3 versus charter.
- `sipoc` — SIPOC to agree process boundaries, customer requirements (CTQ), handovers.
- `phasing` — diagnosis / pilot / roll-out, go/no-go decisions, tolerance, change requests.
- `value` — business case basics: one-off costs, benefits (real versus paper), payback period.
- `proposal` — proposal structure, SCQ opening, options, fixed price versus time and materials.
- `sensitivity` — sensitivity analysis, optimism bias, NPV and discount rate, ranges.

Facts and sources (hedged in the text where they are conventions):
- Problem statement at the top of the A3: John Shook, Managing to Learn (Lean Enterprise Institute, 2008). A3 format from Toyota practice.
- 5 Whys: popularised by Taiichi Ohno, Toyota Production System (1978; English 1988). “Five is a rule of thumb.” Criticism that it yields single causal chains is common in the RCA literature; phrased as “critics say”.
- Is/is-not: Kepner, C. H. & Tregoe, B. B., The Rational Manager (1965).
- Hypothesis-driven problem solving: Ethan Rasiel, The McKinsey Way (1999). MECE: Barbara Minto, The Pyramid Principle (developed at McKinsey; book 1985, Pearson mass-market edition 1987; review fix, was “1987”). Pareto 80/20 described as a rule of thumb, not a law.
- Contracting, wants and offers, the contracting meeting, 50/50 responsibility: Peter Block, Flawless Consulting (1st ed. 1981; later editions 2000, 2011, 2023). Checked against designedlearning.com (Block’s training firm) summaries of “wants and offers”.
- Guiding coalition: John Kotter, Leading Change (1996); criticism of the step model as too linear phrased as “also criticised”.
- WOR art. 25 lid 1 sub e: advice right on a proposed decision on an important change to the organisation; art. 25 lid 2: advice must be asked when it can still have substantial influence (“wezenlijke invloed”) on the decision (checked: wetten.overheid.nl BWBR0002747 art. 25; AWVN summary). Art. 27 lid 1 sub b: consent right on working and rest time arrangements; art. 27 lid 3: no consent needed insofar as the collective agreement (cao) already settles the matter (now stated in pre, teach and example). Art. 2: works council required from 50 people. Art. 26: the OR can appeal to the Ondernemingskamer (Amsterdam court of appeal) against a decision not in line with its advice; the text now names the Enterprise Chamber / Ondernemingskamer.
- Project charter “authorises the project and gives the project manager the mandate”: PMI, PMBOK Guide (definition of Develop Project Charter). Management by stages and tolerances: PRINCE2 principles (AXELOS). The 10% budget tolerance is an example, not a PRINCE2 default.
- SIPOC: quality / Six Sigma tool (TQM origins, 1980s); 4–7 main steps is common practice. CTQ: Six Sigma term.
- Planning fallacy: Kahneman & Tversky (1979, “Intuitive prediction: biases and corrective procedures”). Optimism bias and overruns in large projects: Bent Flyvbjerg (e.g. Flyvbjerg & Gardner, How Big Things Get Done, 2023); phrased without specific percentages. Reference class remedy: Flyvbjerg.
- Discount rates “8 to 10% common, ask the controller”: hedged practitioner range (company WACC / hurdle rate varies).
- Payback rule of thumb “under two years” given as an example that differs by company.

Recomputed numbers:
- problemstatement: pre/teach 8 / 20 = 40%; recall (review): 27 / 180 = 15% − 5% = 10 percentage points. Example: 33 / 220 = 15%; 6 / 110 = 5.5% (“5%”), 27 / 110 = 24.5% (“25%”).
- issuetree: example 18 + 12 = 30; 30 / 42 = 71.4%. Recall (review): 14 + 10 + 9 + 5 = 38; two biggest 14 + 10 = 24; 24 / 38 = 63.2%.
- contracting: example 2 × 4 × 8 = 64 h. Recall (review): 3 × 3 × 10 = 90 + 4 × 2 = 98 h.
- charter: example 6 × 2 = 12 days × €1,100 = €13,200. Recall (review): 10 × 1.5 = 15 days × €1,050 = €15,750.
- phasing: example €40,000 × 1.10 = €44,000; 34 + 8 = 42 (within); 42 + 5 = 47 (above). Recall (review): €50,000 × 1.10 = €55,000 − €52,000 = €3,000.
- value: €30,000 / €2,500 = 12 months; 6 × €400 = €2,400 × 46 = €110,400; €45,000 / €110,400 = 0.41 yr ≈ 5 months; 100 h × €50 = €5,000. Recall (review): (€2,300 − €300) = €2,000 net/month; €36,000 / €2,000 = 18 months; 4 × €350 × 46 = €64,400. Payback now defined on net benefits.
- proposal: example 20 × €1,000 = €20,000 × 1.15 = €23,000. Recall (review): 24 × €950 = €22,800 × 1.10 = €25,080.
- sensitivity: €20,000 × 0.75 = €15,000; €60,000 / €15,000 = 4 years. NPV: 50,000/1.08 = 46,296; /1.1664 = 42,867; /1.259712 = 39,692; sum 128,855 − 100,000 = 28,855. Recall (review): €32,000 × 0.8 = €25,600; €80,000 / €25,600 = 3.125 yr (answer 3.1 ± 0.1).

Every recall number question gets a generated hint (first step plus unit) that does not contain the answer (tests/hint.test.js). MC answer positions over the 16 lessons (recall, en = nl): 14 / 12 / 14 / 13; pre: 3 / 6 / 4 / 3 after the review.

Uncertain: the “2 to 6 weeks” diagnostic phase and “3 to 5 pages” proposal are practitioner ranges; illustrative numbers in examples (costs, rates, percentages) are invented for teaching.

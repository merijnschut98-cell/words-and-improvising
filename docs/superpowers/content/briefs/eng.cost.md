# eng.cost — Cost engineering (engineering, track discrete, level 3, FADED examples)
Index title: en 'Cost engineering' / nl 'Kostprijs en investeringen'. Blurb: en 'What a part really costs: hour rates, contribution, make or buy, investment cases and should-cost.' / nl 'Wat een onderdeel echt kost: uurtarieven, dekkingsbijdrage, zelf maken of kopen, investeringscases en should-cost.'

Why: as a performance consultant, Merijn sits where engineering meets finance: quotes, capex requests, outsourcing proposals, savings targets. Engineers argue in cost prices and hour rates; finance in contribution and NPV. eng.lines.business covers the automation payback rule of thumb and eng.reliability.lcc covers life-cycle cost of assets; nothing covers how a cost price is built or how to judge make-or-buy and supplier quotes. Placed in the discrete track because the worked numbers are parts, machines and batches.

Overlap check: pm.close.results covers proving project results to a controller (freed hours only count if the books change). eng.cost.capex repeats that point once from the investment side; it does not repeat the baseline/controller material. A planned "proving savings" lesson was dropped for that reason and replaced by should-cost.

1. `eng.cost.costprice` — bottom-up cost price; setup per part; scrap factor 1/(1 − s); overhead keys and activity-based costing.
2. `eng.cost.hourrate` — machine hour rate (depreciation, interest on half the capital, space, energy, maintenance) over productive hours; the hours trap; what a rate includes.
3. `eng.cost.contribution` — fixed vs variable, contribution margin, extra order with spare capacity, contribution per bottleneck minute, break-even.
4. `eng.cost.makebuy` — relevant costs only, total cost of ownership on the buy side, opportunity cost when capacity is full, strategic core.
5. `eng.cost.capex` — payback, NPV and IRR, cash vs accounting savings, sensitivity on the biggest assumptions.
6. `eng.cost.shouldcost` — should-cost model, cost breakdown, tooling separate, material index clauses, learning curve (80–90% typical).

Facts and sources
- Cost accounting (contribution margin, relevant costs, make-or-buy, opportunity cost, activity-based costing, break-even): Horngren, Datar & Rajan, *Cost Accounting: A Managerial Emphasis*, 16th ed.; Drury, *Management and Cost Accounting*.
- Machine hour rate structure (depreciation, imputed interest on half the replacement or purchase value, space, energy, maintenance): VDI 3258 *Kostenrechnung mit Maschinenstundensätzen*; common practice in Dutch/German metalworking calculation (e.g. Koninklijke Metaalunie calculation guidance).
- Contribution per bottleneck minute (throughput per constraint unit): Goldratt, *The Goal*; Horngren ch. on constraints.
- NPV, IRR, payback limitations: Brealey, Myers & Allen, *Principles of Corporate Finance*, 13th ed. Annuity factor 8 years at 8% = (1 − 1.08^−8)/0.08 = 5.747.
- Learning curve (unit-time model, each doubling to a fixed percentage; 80–90% typical in labour-intensive assembly): Wright (1936), *Factors Affecting the Cost of Airplanes*; NASA Cost Estimating Handbook (learning curve chapter).
- Should-cost and cost breakdowns in purchasing: Monczka et al., *Purchasing and Supply Chain Management*, 7th ed. (cost analysis chapter); index-linked material pricing as common practice for steel/aluminium/polymer contracts.

Numbers in questions and examples (checked): 2 × 90 / 20 = €9; 3 × 70 / 150 = €1.40; 12 / 0.96 = €12.50; bracket 2.40 + 4.00 + 1.60 = 8.00 → /0.97 = 8.247 → ×1.15 = 9.48 (batch 200: 8.06); hour rate example 70,000 + 18,000 + 32,000 = 120,000 → €33.33 at 3,600 h, €50 at 2,400 h; €90,000/3,000 = €30; 400,000/10 = 40,000; 5% × 200,000 = 10,000; caps 0.045 + 0.015 + 0.010 = 0.070, ×200,000 contribution €4,000; 25 − 17 = 8; 240,000 / 8 = 30,000; 30/12 = 2.50 vs 18/4 = 4.50; make 18 + 8 = 26 vs buy 34 + 2.5 + 1 + 0.5 = 38; 12 + 8 = 20; 150,000/50,000 = 3; 10,000/1.21 = 8,264; capex 90,000 × 5.747 − 240,000 ≈ 277,000; learning 0.85 × 20 = 17, 0.85 × 40 = 34, 40 × 0.85² = 28.9; should-cost 11.45 × 1.15 × 1.08 = 14.22.

Uncertain / simplified: in the hour-rate example energy and maintenance are treated as fixed for simplicity (stated in the text). The €55,000 cost per person is an illustrative Dutch fully loaded operator cost, consistent with eng.lines.business (€50,000–€60,000).

## Clarity round (2026-11-06)
- All six lessons now have 5 teach blocks (≤ 90 words) in en and nl; each new block covers what you see in practice, failure modes, what experts argue about and a sharp question.
- Terms per lesson, 6 each (en = nl, same order, each a whole word in its lesson's teach text, none twice in the module): costprice +Scrap/Uitval, Material yield/Materiaalrendement; hourrate +Imputed interest/Calculatorische rente, Ramp-up/Aanloop; contribution +Full cost price/Integrale kostprijs, Bottleneck; makebuy +Safety stock/Veiligheidsvoorraad, Lead time/Levertijd; capex +Discount rate/Discontovoet (same pair as eng.reliability), Sensitivity analysis/Gevoeligheidsanalyse; shouldcost +Routing/Bewerkingsvolgorde, Value engineering.
- Terms that did not appear literally in their teach text before and now do: Overhead surcharge/Overheadopslag, Relevant cost/Relevante kosten, Core competence/Kerncompetentie, Material index clause/Materiaalindexclausule. nl term ‘NCW (NPV)’ renamed ‘NCW’ (the app pairs it with the English NPV by position; the parenthesised form never matched the text).
- Inline explanations added: offcuts, setup/changeover, batch size, scrap, material yield, nesting, sprues and runners, overhead, routing, press brake, call-off, residual value, straight-line depreciation, imputed interest, ERP, ramp-up, 5-axis machining centre, full cost price, bottleneck, injection moulding, relevant costs, safety stock, lead time, death spiral, impeller housing, discount rate, sensitivity analysis, capex, annuity factor, CFO, cumulative volume, value engineering, open-book costing. In nl the English word is given once for omstelling (setup/changeover), seriegrootte (batch size), kantbank (press brake), afroep (call-off), aanloop (ramp-up), integrale kostprijs (full cost price), spuitgieterij (injection-moulding plant), doodsspiraal (death spiral), capex request, leercurve (learning curve), bewerkingsvolgorde (routing), open-book costing.
- Facts and attributions: activity-based costing attributed to Kaplan and Cooper (late 1980s); core competence to Prahalad and Hamel (1990, HBR “The Core Competence of the Corporation”); throughput per bottleneck minute to Goldratt. Learning curve: Wright (1936) described the cumulative-average model; the per-unit model used in this lesson’s numbers (unit 2n = p × unit n) is Crawford’s (Boeing, 1940s) — now stated, since attributing the unit model to Wright alone was imprecise. Payback hurdle “2 to 3 years” hedged as “roughly”, consistent with eng.lines.payback. Typical full CNC hour rates in Dutch job shops “roughly €60 to €120 per hour” (operator and overhead included) — hedged as a rough range; consistent with eng.machining, which uses assumed rates of €70 (lathe), €80 (mill), €90 (machine time) and €120 (manned turn-mill). The €33/h machine-only rate in the hour-rate example is explicitly “without an operator”, so it does not contradict these. Cash vs freed capacity stays consistent with pm.portfolio.benefits (“freed capacity is only money when someone turns it into money”) and pm.close.results.
- Numbers unchanged and rechecked (see list above). Annuity factor 8 years at 8% = Σ 1/1.08^n (n = 1…8) = 5.747, now explained in the example.
- Unchanged: lesson ids, 4 recall questions per lesson in order, answer positions, numeric answers and tolerances; no figure in this module.

## Clarity review (2026-11-06)
- costprice teach block 5 (nl): “normtijden uit de routing (…)” → “normtijden uit de bewerkingsvolgorde (routing), …”, so the module term Bewerkingsvolgorde links where it is first used, as Routing does in en.
- Terms kept: all are specific domain terms; every term link in teach, example and reveal was checked and points at the right concept in both languages.
- Learning curve note: the unit model is credited to Crawford (1940s); sources differ on the company, so the lesson names no company.
- Rechecked all numbers (bracket 9.48 / 8.06, hour rate 33.33 / 50, caps €4,000, housing 26 vs 38, payback 1.2 / 2.7 years, annuity factor (1 − 1.08^−8) / 0.08 = 5.747, NPV ≈ €277,000, 8,264, learning 17 / 34 / 28.9, should-cost 14.22 ≈ “about €14.20”), payback “roughly 2 to 3 years” (same as eng.lines.payback) and CNC full rates “roughly €60 to €120 per hour” (eng.machining assumes €70–€120). Attributions: Kaplan and Cooper (late 1980s), Prahalad and Hamel 1990, Goldratt, Wright 1936 (cumulative average).

## v13 topics (2026-11-08): 4 topics × 4 levels

| Topic (id) | 1 Basis | 2 Werkkennis | 3 Gevorderd | 4 Expert |
|---|---|---|---|---|
| Cost price and hour rates (`costprice`) | `costprice` (existing) | `hourrate` (existing) | `abc` (new): cost pools and drivers, classic ABC, time-driven ABC, capacity cost rate, practical capacity, unused capacity | `shouldcost` (existing) |
| Relevant costs and pricing (`decisions`) | `contribution` (existing) | `makebuy` (existing) | `pricing` (new): cost-plus vs market vs value, mark-up vs profit margin, price floor per situation, target costing and allowable cost | `profitability` (new): whale curve, cost-to-serve, avoidable and direct fixed costs, MOQ and rush surcharges before dropping customers |
| Investment appraisal (`invest`) | `cashflow` (new): P&L vs cash flow, capex vs opex, balance sheet, depreciation is not cash, sunk cost and book value | `capex` (existing) | `appraisal` (new): annuity factor, uneven cash flows, IRR vs hurdle rate and WACC, mutually exclusive projects, tax shield, no interest in the cash flows | `capexboard` (new): scenario analysis, break-even saving, optimism bias and reference class forecasting, post-investment review, real options, pointer to cost of delay |
| Lean accounting and savings (`lean`) | `inventory` (new): work in progress, working capital, holding cost, obsolescence, cost of capital, days of inventory, one-off cash vs yearly saving | `waste` (new): cost of poor quality (PAF), scrap at variable cost, bottleneck throughput, rework and overtime premium, cash vs capacity wastes | `vsc` (new): standard cost, overhead absorption and the profit dip when stock falls, volume variance (bezettingsresultaat), value stream costing, box score | `savings` (new): savings bridge, the controller's rates, price and volume separated, price variance, savings register, budget take-down, double counting |

Why this split: cost price, hour rate and should-cost are one ladder (build a cost bottom-up, then do it for a supplier), with ABC as the missing step between. Contribution and make-or-buy are the relevant-cost basics; pricing and customer profitability apply them. Capex (payback, NPV) is level 2 of investment appraisal, with cash versus profit below it and NPV/IRR technique and the board above it. The Lean topic takes the junior Lean consultant from stock and waste to a figure a controller signs.

Overlap, kept small on purpose (pointers, no repeated definitions):
- pm.land `savings` (Hard and soft savings): hard/soft, cost avoidance, freed capacity, run rate, one-off stock cash vs recurring. `inventory`, `waste` and `savings` point there and redefine none of its terms.
- pm.close `results`/`claim`: baseline, annualising, net benefit, payback at close. `savings` points to the Close module.
- pm.portfolio `gates`/`costofdelay`: capex gates, approval limits, cost of delay. `cashflow` and `capexboard` point to the Programmes and governance module; Capex is defined with pm.portfolio's definition.
- eng.flow `throughput` and `batch`: throughput per constraint minute, holding cost 20–30% "ask the controller", Little's law. `contribution`, `waste`, `profitability` and `inventory` point there; Holding cost / Voorraadkosten uses eng.flow's definition word for word, Work in progress the same definition as eng.flow's WIP.
- pm.consult `pricing` is about consulting fees; `pricing` here is about product quotes, so no overlap.
Shared figures identical: annuity factor 8 years at 8% = 5.747; payback "roughly 2 to 3 years"; holding cost 20–30%; 8% as the example cost of capital and discount rate.

Existing lessons: ids, recall order, recall answer positions and numbers unchanged (pinned in `tests/fixtures/v13-eng.cost-recall-keys.json`, built from the files before this change). No figures in this module. Changes:
- Example kind follows the level: costprice, hourrate, contribution, makebuy and capex are now level 1–2 and use worked examples (text and reveal merged); shouldcost stays faded at level 4.
- Giveaways removed (correct option was the unique longest): costprice r2/r3, hourrate r3, contribution pre/r2/r3, makebuy pre/r1/r2/r3, capex r2/r3, shouldcost r2/r3. Distractors lengthened, very long correct options shortened, meaning unchanged.
- Pre questions (not pinned) re-ordered for balance: costprice pre answer now at 3, contribution 3, makebuy 2, capex 3, shouldcost 2.
- Own hints on all 12 existing numeric recall questions (the generated step gave the whole sum, e.g. "€90,000 / 3,000 hours = ?").
- Pointers added: costprice → level 3 (ABC); contribution → the Capacity and flow module; capex → Cash, profit and capex.

Answer positions (pre + recall multiple choice, en = nl): whole module 12 / 12 / 12 / 12. No question has the correct option as the unique longest one (script check, en and nl). Rank of the correct option by length (0 = longest, ties count as longest): en 7 / 11 / 16 / 14, nl 5 / 15 / 17 / 11, so it is not systematically second-longest. All 28 numeric recall questions have their own hint (≤ 25 words, never the answer).

Terms: 4–6 per lesson, en and nl in the same order, each tappable in its own teach text, defined once in the module. New Dutch terms include kostenpool, kostendrijver, capaciteitskostentarief, praktische/onbenutte capaciteit, winstopslag, winstmarge, prijsondergrens, toegestane kostprijs, walviscurve, vermijdbare kosten, directe vaste kosten, winst-en-verliesrekening, kasstroom, balans, verzonken kosten, annuïteitsfactor, drempelrendement, belastingschild, scenarioanalyse, break-evenbesparing, nacalculatie, reële optie, onderhanden werk, werkkapitaal, voorraadkosten, incourantheid, vermogenskosten, voorraaddagen, (interne/externe) faalkosten, herbewerking, overwerktoeslag, standaardkostprijs, overheadabsorptie, bezettingsresultaat, besparingsbrug, prijsverschil, besparingsregister, budgetverlaging, dubbeltelling. English kept where Dutch practice uses it: Time-driven ABC, Target costing, Cost-to-serve, WACC, Capex, Opex, Reference class forecasting, Value stream costing, Box score.

Facts and sources (URLs checked 2026-11-08; the rest are standard texts):
- Single-key overhead distorts cost prices: Cooper & Kaplan, "Measure costs right: make the right decisions", HBR 1988; Kaplan & Cooper, *Cost & Effect* (1998).
- Time-driven ABC, capacity cost rate, practical capacity "80 to 85%" of theoretical as a rule of thumb: Kaplan & Anderson, "Time-Driven Activity-Based Costing", HBR Nov 2004 (https://hbswk.hbs.edu/item/rethinking-activity-based-costing, https://maaw.info/ArticleSummaries/ArtSumKaplanAnderson2004.htm).
- Whale curve, top ~20% of customers earning 150–300% of profit: Kaplan & Narayanan, "Measuring and managing customer profitability", Journal of Cost Management 2001; widely repeated (https://en.wikipedia.org/wiki/Customer_profitability_analysis, https://www.pragmaticinstitute.com/resources/articles/product/maximizing-profitability-with-a-whale-curve/). Taught as "his case figures, not a law".
- Target costing, allowable cost: Cooper & Slagmulder, *Target Costing and Value Engineering* (1997); counted as Lean accounting by Maskell & Baggaley.
- Lean accounting, value stream costing, box score, critique of standard costing and absorption: Maskell & Baggaley, *Practical Lean Accounting* (2004; 2nd ed. 2011).
- Fixed production overhead in inventory on normal capacity: IAS 2 *Inventories* (para. 12–13); Dutch rules (RJ 220) the same. Bezettingsresultaat: classic Dutch cost accounting (integrale kostprijs at normal volume).
- Throughput per constraint minute: Goldratt, *The Goal* (1984); pointer to eng.flow.
- NPV, IRR, annuity factor, mutually exclusive projects, multiple IRRs, nominal vs real: Brealey, Myers & Allen, *Principles of Corporate Finance*, 13th ed. CFO survey: Graham & Harvey, JFE 2001 (about 75% always or almost always use NPV and IRR, about 57% payback).
- Hurdle rates "10 to 15%" above a lower WACC: hedged as "common", "ask finance".
- Optimism bias: Kahneman & Lovallo, Management Science 1993; reference class forecasting: Flyvbjerg (PMJ 2006). Real options: Dixit & Pindyck (1994), no numbers taught.
- Cost of poor quality, PAF split: Feigenbaum, Juran. "As high as 15–20% of sales revenue" in some organisations: ASQ, https://asq.org/quality-resources/cost-of-quality; hedged "many plants are far lower".
- Holding cost 20–30%: same claim and caveat as eng.flow `batch`. Overtime premium set in the CAO; 50% appears only as given data in a question.

Recalculations (new lessons):
- abc: 1 / 0.75 = 1.333 (pre); 240,000 / 1,200 = 200; 200 / 10 = 20; 200 / 500 = 0.40; 360,000 / 300,000 = 1.20; 50,000 × 1.20 = 60,000; example 6 and 9 now, 6 − 0.40 = 5.60 over, 20 − 9 = 11 under; r0 150,000 / 2,500 = 60; r1 420,000 / 300,000 = 1.40 × 45 = 63.
- pricing: pre 25 / 125 = 20%; 48 × 0.85 = 40.80, gap 4.20; example 38 + 30 + 9 = 77 × 1.12 = 86.24 × 1.2 = 103.49 (1.089 × 95), 95 × 0.9 = 85.50, gap 0.74, floor 38 + 6 + 9 = 53; r0 60 / 0.75 = 80; r1 60 × 0.88 = 52.80; r2 4 × 15 + 30 = 90.
- profitability: 150,000; 46,800 + 6,000 + 12,000 = 64,800; 85,200; 130 × 180 = 23,400; r0 90,000 − 54,000 = 36,000; r1 120,000 − 70,000 = 50,000.
- cashflow: 500,000 / 10 = 50,000; compressor 12,000 depreciation, +18,000 profit, 4 × 30,000 = 120,000, 10 × 30,000 − 120,000 = 180,000 = 10 × 18,000; r0 20,000 − 8,000 = 12,000; r1 200,000 − 80,000 = 120,000.
- appraisal: annuity 5 y 8% = 3.993, 8 y = 5.747; A 30,000 × 3.993 − 60,000 = 59,790; B 110,000 × 5.747 − 400,000 = 232,170 (≈ 3.9 × A); IRR A ≈ 41% (factor 2.0 over 5 y; 2.001 at 41%); IRR B ≈ 21.8% (3.636 over 8 y; 3.726 at 21%, 3.619 at 22%); r0 199,650 − 150,000 = 49,650; r1 36,363.6 + 49,586.8 = 85,950.
- capexboard: 400,000 / 5.747 = 69,602 (63.3% of 110,000); 77,000 × 5.747 − 400,000 = 42,519; 110,000 / 12 = 9,167 a month; r0 300,000 / 5.747 = 52,201; r1 0.7 × 80,000 × 5.747 − 250,000 = 71,832.
- inventory: 2.0 M / 40,000 = 50 days; example 18.25 M / 365 = 50,000, 60 → 46 days, 700,000 × 25% = 175,000, × 8% = 56,000; situation 1.5 M × 8% = 120,000 (25% = 375,000); r0 300,000; r1 7.3 M / 365 = 20,000 → 50 days.
- waste: 4% × 250,000 = 10,000; 4.00 + 1.50 + 1.00 = 6.50; 120,000 vs 65,000; r0 2,000 × 8.50 = 17,000; r1 38 × 1.5 = 57 × 6 = 342 × 46 = 15,732.
- vsc: 2.4 M / 120,000 = 20; 15,000 × 20 = 300,000; (105,000 − 120,000) × 20 = −300,000 (2.4 M in cost of sales + 0.3 M under-absorbed = 2.7 M charged vs 2.4 M spent); r0 1.5 M / 50,000 = 30 × 4,000 = 120,000; r1 180,000 / 4,500 = 40, / 5,000 = 36.
- savings: 11,200 − 7,000 = 4,200 × 6.10 = 25,620; old total 65,000, new 7,000 × 6.10 = 42,700, drop 22,300; r0 0.15 × 400,000 × 0.20 = 12,000; r1 65,000 − 15,000 = 50,000.

Uncertain / simplified: the whale-curve range is attributed to Kaplan (with Narayanan, 2001) via secondary sources; the original was not read. "Nacalculatie" stands for post-investment review; some plants say "evaluatie na ingebruikname". In `vsc` the volume variance and the overhead released from stock are presented as one €300,000 effect (two views of the same gap between overhead charged and spent in this example). The hurdle-rate range is a hedged practitioner range, not a sourced statistic.

### Review of the v13 topics (2026-11-08)

- `inventory` pre: the old answer said a stock cut "hardly" touches this year's profit, which contradicts `vsc` (absorption dip). The question now asks whether the cut is a P&L saving (no: one-off cash), with a pointer to `vsc`; teach and sayIt say the same.
- `vsc` example: reveal now reconciles the €300,000: cost of sales carries €2.4 M overhead (€0.3 M of it released from stock), this year's €2.4 M is absorbed into 105,000 valves (€2.1 M), the €0.3 M left is the unfavourable bezettingsresultaat; €2.7 M charged vs €2.4 M spent. The two €300,000 figures match only because sales equal normal volume.
- IAS 2 / RJ 220: "Dutch rules work the same way" softened to "IFRS requires it; most Dutch plants under RJ 220 do the same" (BW2 art. 2:388 says indirect costs *may* be included).
- `waste`: cost of quality (PAF total) vs cost of poor quality (failure part only), per ASQ; nl kwaliteitskosten vs faalkosten, as pm.perform uses faalkosten.
- nl "Nacalculatie" replaced by "Investeringsevaluatie (post-investment review)": pm.intake already defines Nacalculatie as a fee form (time and materials), and Dutch controllers use nacalculatie for job costing.
- Shared definitions made identical: Capex (pm.portfolio), Opex (eng.maintenance), Optimism bias / Optimisme-bias (pm.intake), Onderhanden werk (eng.flow WIP). Pointers added: capexboard → Intake (optimism bias) and Close (benefits review); waste and inventory name the Capacity and flow module.
- Tax shield given a number (€50,000 × 25.8% Vpb top rate = €12,900); whale curve attributed to Kaplan and Narayanan (2001); book-value loss notes the tax effect.
- nl: English term in parentheses at first use for the new Dutch terms.

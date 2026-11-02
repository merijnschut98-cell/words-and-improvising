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

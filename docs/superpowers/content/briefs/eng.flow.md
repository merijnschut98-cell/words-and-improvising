# eng.flow — Capacity and flow (engineering, track basics, level 1)

Index entry: `{ id: 'eng.flow', subject: 'eng', track: 'basics', level: 1, title: { en: 'Capacity and flow', nl: 'Capaciteit en flow' }, blurb: { en: 'Takt, bottlenecks, OEE: how much a line can make and why it doesn’t.', nl: 'Takt, bottlenecks, OEE: hoeveel een lijn kan maken en waarom dat niet lukt.' }, lessons: [...6 ids], questions: {...} }`

Lessons (ids and one line each):
1. `eng.flow.takt` — takt time vs cycle time vs lead time; computing takt from demand and available time.
2. `eng.flow.bottleneck` — the bottleneck sets output; WIP piles up before it; Little’s law in one line.
3. `eng.flow.oee` — availability × performance × quality; the six big losses; what a “good” OEE is and why 100% is a lie.
4. `eng.flow.changeover` — setup/changeover, internal vs external, SMED in engineering terms, batch size trade-off.
5. `eng.flow.balance` — line balancing: stations, cycle times vs takt, balance loss, why one slow station hurts.
6. `eng.flow.capacity` — capacity planning: shifts, utilisation, why 100% utilisation makes queues explode.

## Clarity round (2026-11-04)

Every lesson now has 5 teach blocks (all ≤ 80 words), every term explained in plain words at first use (also in pre questions, examples and situations), 5–6 terms per lesson in the same order in en and nl. Ids, recall order, answer positions, numbers and the figure (`eng.flow.line` on `eng.flow.bottleneck`: stations 40/55/45 s, takt 50 s) unchanged; the teach line “40, 55 and 45 seconds … one part every 55 seconds, about 65 per hour” is kept.

Terms added: takt — Available time / Beschikbare tijd, Buffer; bottleneck — Throughput, Starved and Blocked split into two terms; oee — Availability / Beschikbaarheid, Performance; changeover — Internal work and External work split, Die / Matrijs, Batch size / Seriegrootte; balance — Precedence / Montagevolgorde; capacity — Nameplate capacity / Papieren capaciteit (the old “Shift model” and “Load” kept).

Recalculations (all checked):
- Takt: 7.5 h = 27,000 s; 27,000 / 450 = 60 s. Design at 85–90% of takt: 0.85 × 60 = 51 s, 0.90 × 60 = 54 s. Example: 480 − 40 = 440 min = 26,400 s; 2,400 / 5 = 480; 26,400 / 480 = 55 s; margin 3 / 55 = 5.5% (“about 5%”). 4 min of 3 days = 4 / 4,320 = 0.09% (“under 1%”).
- Bottleneck: 3,600 / 55 = 65.5/h; Little 300 / 60 = 5 h, 120 / 60 = 2 h; example 3,600 / 90 = 40/h, 480 / 40 = 12 h, two CNCs → 45 s step, 3,600 / 45 = 80/h. Goldratt, *The Goal*, 1984.
- OEE: 0.9³ = 0.729; world class 0.90 × 0.95 × 0.999 = 0.854 (Nakajima, TPM). 30 small stops × 40 s = 1,200 s = 20 min = 4.2% of 480 min. Example: 375 / 450 = 83.3%, 300 / 375 = 80%, 570 / 600 = 95%, product 63.3% = 570 × 0.5 / 450; losses 75 + 75 + 15 = 165 = 450 − 285.
- Changeover: SMED by Shigeo Shingo (Mazda 1950, Toyota 1969). Example 90 = 25 + 15 + 20 + 30 → 5 + 30 = 35; 4 × 55 = 220 min freed; 8 × 35 = 280 vs 4 × 90 = 360. Cycle stock ≈ batch / 2.
- Balance: 4 × 50 − 165 = 35, 35 / 200 = 17.5%; example 265 total, 3,600 / 80 = 45/h vs 3,600 / 72 = 50/h; 65 + 68 + 62 + 70 = 265; (280 − 265) / 280 = 5.36%.
- Capacity: 27,000 / 60 = 450, × 0.75 = 337.5 (“about 340”); u / (1 − u) = 1, 4, 9, 19 at 50/80/90/95% (Kingman’s G/G/1 approximation: waiting ∝ u / (1 − u) × variability × process time). Example 1,200 × 4 min = 4,800 min = 80 h; 75 × 0.7 = 52.5 → 152%; 112.5 × 0.7 = 78.75 → 101.6%; 112.5 × 0.8 = 90 → 88.9%.

Facts fixed: none wrong; sharpened units and assumptions (takt in seconds per unit, “assuming no stops”, “average lead time”, “ideal cycle time” in the load question). The “night premium” is kept generic (no percentage), since Dutch CAO shift premiums vary per sector.

Review fixes (2026-11-04): numbers all rechecked, none changed. Glossed setting sheet / instelkaart and “offline” (now “away from the machine”); “five-axis” now “five-axis mill”; recall option “in spec” → “good” (spec is not taught in this module). nl: starved/blocked now “valt droog (starved)” and “staat vast (blocked)”; die gloss reworded; “de killer” → “de grootste tijdvreter”. “Omstelling” kept: it is the normal Dutch shop-floor word (omstellen, omsteltijd).

## v13 topics (2026-11-08): 4 topics × 4 levels

| Topic (id) | 1 Basis | 2 Werkkennis | 3 Gevorderd | 4 Expert |
|---|---|---|---|---|
| Takt and line balance (`takt`) | `takt` (existing) | `balance` (existing) | `precedence` (new): precedence diagram, RPW heuristic, planned cycle time, zone constraints | `staffing` (new): operators = work content / takt per demand level, standard work, skills matrix, mixed-model weighted work content, heijunka |
| Bottleneck and capacity (`bottleneck`) | `bottleneck` (existing, figure `eng.flow.line` kept) | `capacity` (existing) | `toc` (new): five focusing steps, exploit/subordinate, drum-buffer-rope, policy constraints | `throughput` (new): throughput accounting, € per bottleneck hour, T per constraint minute, cost price vs TA |
| OEE and losses (`oee`) | `oee` (existing) | `downtime` (new): downtime log, reason codes, Pareto by minutes, micro-stops from the counter, hourly board | `teep` (new): OEE definition choices, ideal cycle time, TEEP and calendar utilisation, line OEE | `oeecase` (new): value of an OEE point, hidden capacity vs a new machine, loss tree, baseline, gaming |
| Changeover and batch size (`changeover`) | `changeover` (existing) | `smed` (new): running a SMED workshop, changeover analysis, spaghetti diagram, cart, parallel working, standard sheet | `batch` (new): setup vs holding cost, EOQ, cycle stock, changeover time budget | `wheel` (new): EPEI, product wheel, changeover matrix, sequence-dependent changeovers |

Why this split and not "balancing + changeover" together: balancing belongs with takt (it is the same arithmetic, work content / takt), and capacity belongs with the bottleneck (load and queues are about the constraint). Changeover then gets its own ladder up to batch size and the product wheel.

Existing lessons: ids, recall order, answer positions and numbers unchanged (pinned in `tests/fixtures/v13-eng.flow-recall-keys.json`, checked by `tests/progresskeep.test.js`). All six stay at level 1–2 with worked examples. Wording changes only: distractors lengthened or the correct option shortened where the correct option was the longest (giveaway), short glosses where a term is now first met before the lesson that defines it (WIP in `balance`, OEE in `capacity`, bottleneck in `changeover`), and own hints on `bottleneck#r0`, `oee#r0` (the generated step showed 0.684) and `oeecase#r1`.

New-lesson answer positions (pre + recall, multiple choice): 8 / 7 / 8 / 7 over positions 0–3; whole module 13 / 12 / 13 / 11. No question has the correct option as the unique longest one.

Facts and sources (checked 2026-11-08):
- Five focusing steps (identify, exploit, subordinate, elevate, repeat) — Goldratt, *The Goal* (1984); drum-buffer-rope — Goldratt & Fox, *The Race* (1986). Summaries: https://www.dbrmfg.co.nz/Bottom%20Line%20Process%20of%20Change.htm, https://www.learnsignal.com/blog/theory-of-constraints-five-focusing-steps-explained/
- Throughput = sales − totally variable costs; operating expense; investment; NP = T − OE — https://en.wikipedia.org/wiki/Throughput_accounting, https://pressbooks.pub/supplychainmanagement3005/chapter/12-4-throughput-accounting. TA vs cost price for the annual accounts is stated as a hedge ("controllers and TOC people differ").
- TEEP = OEE × utilisation, utilisation = planned production time / all time; example 80 / 168 = 47.6%, at 65% OEE TEEP ≈ 31% — https://oee.com/teep. Whether planned maintenance and changeovers sit inside planned time differs by source (MetricGate vs MachineMetrics; Fabrico: choose once and keep it) — taught as a definition choice.
- SMED: single-digit minutes, separate internal/external, convert internal to external — https://www.lean.org/lexicon-terms/single-minute-exchange-of-die/ (Shingo 1985). "30 to 50% in a first round, no investment" is kept as "a commonly reported result" (same claim as the existing `changeover` pre question).
- EOQ = √(2DS/H), Ford W. Harris 1913, later popularised by Wilson — https://www.zoho.com/inventory/academy/inventory-management/economic-order-quantity.html, https://www.mbaskool.com/business-concepts/operations-logistics-supply-chain-terms/6729-harris-wilson-eoq-ebq-model.html
- Holding cost "often quoted 20 to 30% of stock value per year", hedged with "ask the controller" — https://www.fishbowlinventory.com/blog/what-is-carrying-cost (Cleverence gives 15–35%).
- EPEx/EPEI: how often every part is made; long changeovers and many part numbers make it long — https://www.lean.org/lexicon-terms/every-product-every-interval/. Product wheel, slow movers every 2nd/4th turn — Peter King, *The Product Wheel Handbook* (CRC Press, 2013), https://www.fabrico.io/blog/product-wheel-scheduling/
- RPW method, Helgeson & Birnie 1961 (General Electric), weight = own time + all following tasks; heuristic — https://dergipark.org.tr/tr/download/article-file/2108492 and other line-balancing papers found in search.
- Pareto / 80-20 is stated as a rule of thumb; "more than about 10% on other means the codes don't work" and "10–20 codes per machine" are stated as rules of thumb (practitioner guidance, not a standard).
- 85% world class OEE (Nakajima, TPM) — already in the clarity round; in `oeecase` called "a reference point from the TPM literature, not a norm".
- Overtime premiums vary by CAO: no percentage given.

Recalculations (new lessons):
- precedence: weights A 135, B 80, C 60, D 55, E 45, F 25; stations A+B, C+D, E+F = 45 s each; 135 / 50 = 2.7 → 3. r0 15 + 20 + 25 = 60; r2 270 / 48 = 5.625 → 6.
- staffing: 300 / 55 = 5.45 → 6; 300 / 75 = 4. Example 27,000 / 450 = 60 → 4; / 540 = 50 → 4.8 → 5, loss 10 / 250 = 4%; / 675 = 40 → 6. r0 planned cycle 0.9 × 60 = 54, 330 / 54 = 6.1 → 7; r1 0.7 × 200 + 0.3 × 300 = 230; pre 300 / 50 = 6.
- toc: 40 parts/h × 1 h = 40. Example: breaks 2 × 30 min → 30 parts; waiting 2 × 20 = 40 min → 20 parts; (900 − 40) / 60 × 30 = 430, 16 × 30 = 480, +11.6%. r1 0.75 × 24 = 18; r3 40 − 38.8 = 1.2.
- throughput: 20 × €45 = €900/h; €60 / 6 = €10, €40 / 2 = €20. Example A €50 / 5 = €10, B €30 / 2 = €15, 60 × 15 = €900, 60 × 10 = €600. r0 (150 − 90) / 4 = 15; r1 30 × 40 × 2 = 2,400.
- downtime: 400 + 310 + 220 + 180 + 90 = 1,200; 33.3 / 25.8 / 18.3 / 15 / 7.5%; top 2 = 59.2%, top 3 = 77.5% (text now says 77.5%, was “77%”); 270 × 40 s = 180 min. Teach 400 × 3 = 1,200, 180 × 20 s = 60 min. r0 140 / 800 = 17.5%; r2 1,020 × 20 / 60 = 340, 400 − 340 = 60.
- teep: 75 / 168 = 44.6%, × 0.6 = 26.8%, 0.6 × 75 = 45 h. r0 120 / 168 × 0.7 = 0.500; r2 1,650 × 12 / 60 = 330, / 300 = 110%.
- oeecase: 75 × 60 = 4,500, 1% = 45, × €20 = €900; 70 / 60 = 1.167. Example 120 × 50 = 6,000; 0.55 × 6,000 = 3,300; 10 × 60 = 600, 600 / 3,300 = 18.2%, × €12 = €7,200/week, × 46 = €331,200. Situation 68 / 58 = 1.17. Pre 100 × 30 × 1% = 30; r0 80 × 40 × 1% = 32; r1 60 / 50 = 1.2.
- smed: example 48 = 12 + 4 + 16 + 16 → 16 + 12 = 28, −20 min = 41.7%, × 3 = 60 min/day. r0 30 / 2 + 4 = 19; r1 20 × 3 × 5 = 300 min = 5 h.
- batch: √(2 × 12,000 × 150 / 2) = √1,800,000 = 1,341.6; budget 80 − 68 = 12 h, 720 / 45 = 16, / 8 = 2. Example 720 / 40 = 18, / 6 = 3, 1,200 / 3 = 400, cycle stock 200; at 20 min 36 → 6×, 200, 100; 18 × 20 = 6 h freed. r0 √400,000 = 632.5; r1 540 / 45 = 12; pre √0.5 = 0.707; r2 setup cost to a quarter, √0.25 = 0.5 (EOQ halves).
- wheel: wheel 1 10 + 15 + 60 = 85, wheel 2 20 + 50 + 40 = 110, diff 25 × 10 = 250 min. r0 900 / 30 = 30, / 10 = 3, 5 / 3 = 1.67 days; r1 4 × 250 = 1,000.

Review fixes (2026-11-08, flow v13 review): staffing r0 now uses a planned cycle time of 90% of takt (330 / 54 = 6.1 → 7) so level 4 builds on level 3; batch r2 no longer repeats the pre question (setup cost to a quarter → EOQ halves); own hints on staffing r1, batch r1, wheel r1 (the generated step gave the whole sum); whys of oeecase r0, smed r1, batch r0/r1, wheel r0 now state the result; downtime top three 77.5% (was “77%”), “10 to 20 codes” hedged as a common guideline, term Micro-stop / Microstop added; oeecase situation 68 / 58 = 1.172 is “about 17%” (was “almost”); batch notes the economic production quantity variant. nl: paktijd (was pakttijd), vastzitten, “die de machine ombouwt”, hardlopers (high runners) / langzaamlopers (slow movers), smoother phrasing in teep, oeecase and batch.

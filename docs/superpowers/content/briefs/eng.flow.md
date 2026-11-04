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

# eng.gridbasics — The electricity grid (engineering, track grid, level 1)
Index title: en 'The electricity grid' / nl 'Het elektriciteitsnet'. Blurb: en 'From power station to socket: voltage levels, who does what in the Netherlands, and why the grid is full.' / nl 'Van centrale tot stopcontact: spanningsniveaus, wie wat doet in Nederland, en waarom het net vol zit.'
1. `eng.gridbasics.basics` — voltage, current, power, energy (V, A, W/kW, kWh); AC; three-phase in plain words.
2. `eng.gridbasics.levels` — HS, MS, LS (TenneT vs regional operators like Enexis); typical voltages (380/150 kV, 10–20 kV, 400/230 V).
3. `eng.gridbasics.path` — the path: substation (onderstation), MS ring, distribution substation (MS-ruimte/wijktrafo), LS cables to homes.
4. `eng.gridbasics.load` — capacity and load: kVA, peak load, simultaneity, why solar and heat pumps change the pattern.
5. `eng.gridbasics.congestion` — net congestion (netcongestie): what it means, waiting lists, flexible contracts, congestion management.
6. `eng.gridbasics.roles` — DSO tasks: connections, maintenance, outages, planning; regulation (ACM) in one paragraph.

## Clarity round (2026-11-06)
Every lesson now has 5 teach blocks and 5–6 terms, en/nl in the same order; every term appears literally in its lesson's teach text (combined terms such as "MS (middenspanning)" and "Netstation (wijktrafo)" split). Dutch words removed from the .en file (onderstation, netstation, MS/LS, gelijktijdigheid, grootverbruik, meterkast): the English text uses substation, distribution substation, MV/LV/HV; the .nl text keeps the Dutch practice terms with the English word where useful. Ids, recall order, answer positions and numbers unchanged; the figure (`eng.gridbasics.levels`: 10/50/150/380 kV, MS 10 kV, HS 150 kV, LS 400 V, 100 MW) untouched and consistent with the text.

Terms per lesson (en / nl):
- basics: Voltage, Current, kW, kWh, Alternating current, Three-phase / Spanning, Stroom, kW, kWh, Wisselstroom, Driefasig.
- levels: TenneT, High voltage, Medium voltage, Low voltage, DSO / TenneT, Hoogspanning, Middenspanning, Laagspanning, Regionale netbeheerder.
- path: Substation, Normally open point, Distribution substation, MV room, Main fuse / Onderstation, Normaal openpunt, Netstation, MS-ruimte, Hoofdzekering.
- load: kVA, Power factor, Simultaneity, Peak load, Inverter / kVA, Arbeidsfactor, Gelijktijdigheid, Piekbelasting, Omvormer.
- congestion: Grid congestion, Large consumer, Capacity map, Congestion management, GOPACS, Flexible contract / Netcongestie, Grootverbruiker, Capaciteitskaart, Congestiemanagement, GOPACS, Flexibel contract.
- roles: Energy supplier, Outage minutes, Regulated monopoly, ACM, Investment plan / Energieleverancier, Jaarlijkse uitvalduur, Gereguleerd monopolie, ACM, Investeringsplan.

Recalculations: 2,000 W / 230 V = 8.7 A; 2 kW × 0.05 h = 0.1 kWh; 230 × √3 = 398 ≈ 400 V; 3 × 230 × 25 = 17,250 VA; 100 MW / (√3 × 10 kV) = 5,774 A, at 150 kV 385 A, loss ratio (5,774/385)² ≈ 225; 400/2 = 200 homes; load example 225 + 120 + 132 = 477 kVA = 119% of 400 kVA (old text said the annual energy "rose by about half": with typical heat-pump and EV consumption it is closer to +70%, so the text now only says it grows far less than the peak, which more than doubles); 3 × 80 A × 230 V = 55 kVA; 150/8,760 = 1.7%; 180/8,760 = 2.1%; 3,000 × 90 = 270,000 customer minutes; 70 M / 2.8 M = 25 min.

Facts checked / added:
- TenneT runs 110 kV and up (since the 2008 transfer of the 110/150 kV grids) and is owned by the Dutch state. Who owns the HV/MV transformer in a substation differs per station: stated as such, not as a rule.
- DSO areas: Enexis (Groningen, Drenthe, Overijssel, Noord-Brabant, Limburg), Liander (Gelderland, Noord-Holland, Flevoland, Friesland), Stedin (Zuid-Holland, Utrecht, Zeeland after the Enduris merger); smaller Westland Infra, Coteq, Rendo.
- Distribution transformers: 400 and 630 kVA typical, 250 kVA in older stations, 1,000 kVA in some new ones (was "250 to 630").
- 253 V = 230 V + 10%, the upper limit of EN 50160 (10-minute values); Dutch inverters trip on it (EN 50549 settings). Attributed to EN 50160.
- Large consumer (grootverbruik): above 3 × 80 A (≈ 55 kVA).
- GOPACS: joint congestion-management platform of the Dutch TSO and DSOs.
- ACM prioritisation framework (2024): grid operators may put congestion relievers, safety and basic needs (schools, healthcare, housing) ahead of first come, first served.
- Households: usually still connected, but TenneT and the DSOs have warned of waiting lists for small consumers in parts of the country (Gelderland, Utrecht, Flevoland, 2024–2025); hedged as "in some regions even that is under pressure".
- Energiewet in force since 1 January 2026, replacing the Elektriciteitswet 1998 and Gaswet.
- Ownership: provinces and municipalities; the state has started to put in capital (Stedin share issue, convertible loans to Enexis and Alliander). Hedged as "for example in Stedin".
- Outage: Dutch average roughly 20–30 minutes per customer per year (Netbeheer Nederland betrouwbaarheidsrapportages); kept as a range.
- Shortage of technicians: "thousands" (sector estimates vary); kept vague.

Uncertain: exact current numbers on waiting lists and the Stedin state stake are moving targets; the text avoids exact figures.

Review (2026-11-06): nl term "Stroom" renamed "Stroomsterkte" (plain "stroom" linked in the sense of "electricity/supply" in other lessons). Congestion text updated: the ACM framework of April 2024 (mandatory from 1 October 2024) was annulled by the CBb in March 2025 for lack of justification; a revised framework (December 2025) keeps social priority and, since 1 July 2026, ends the separate capacity reserve for small connections (one integrated queue). Text now says small connections follow the same priority rules since July 2026 and can have to wait in some regions. Verified: Energiewet in force 1 January 2026 (Elektriciteitswet 1998 and Gaswet withdrawn); state became Stedin shareholder in December 2023 with €500 million (about 11.9%).

## v13 topics (2026-11-08): 4 topics × 4 levels

| Topic (id) | 1 Basis | 2 Werkkennis | 3 Gevorderd | 4 Expert |
|---|---|---|---|---|
| Power, load and voltage (`power`) | `basics` (existing) | `load` (existing) | `voltage` (new): resistance, voltage drop = I × R per phase, voltage band 207–253 V (EN 50160, ten-minute averages), voltage rise from feed-in, levers (cable, off-load tap, regulating distribution transformer, reactive power from inverters, customer limits) | `profile` (new): quarter-hour values (35,040 a year), load duration curve, exceedance duration and energy above the limit, temperature correction, false peaks from switching after faults, measured vs promised capacity |
| The grid from high to low (`grid`) | `levels` (existing, figure kept) | `path` (existing) | `balance` (new): 50 Hz as sign of balance, TenneT as system operator, FCR and aFRR, BRP and imbalance price, 3,000 MW reference incident, load shedding around 49 Hz, inertia, grid losses, balance (national) vs congestion (local) | `backbone` (new): 380/220 kV ring, N-1 pointer, 6–10 years for HV extensions, offshore grid (700 MW / 220 kV AC; 2 GW / 525 kV HVDC), why DC for long subsea cables (charging current), interconnectors NorNed/BritNed/COBRAcable, how TenneT scarcity sets regional queues |
| Roles, rules and money (`rules`) | `roles` (existing) | `law` (new): Energiewet since 1 Jan 2026 (Elektriciteitswet 1998 and Gaswet withdrawn), Energiebesluit, ACM codes 2026 (Netcode elektriciteit → Systeemcode elektriciteit 2026, Tarievencode, Begrippencode), duty to connect vs duty to transport, unbundling, code-change route via Netbeheer Nederland | `contract` (new): connection capacity vs contracted transport capacity (GTV/CTC), ATO, small-consumption capacity tariff vs large-consumption kW contract + kWmax, GOTORK (use it or lose it), application conversation about the profile; build process pointed to Transformers and cables / Grid operations | `regulation` (new): allowed revenue, method decision and five-year regulatory period (2027–2031), yardstick competition, investment volumes and tariff rise, 2026 agreement, what a saving means in a regulated setting |
| Congestion and the energy transition (`congestion`) | `congestion` (existing) | `scarcity` (new): congestion vs transport scarcity (Netbeheer Nederland), future peak = current peak + promised + natural growth, capacity map (red = scarcity, separate offtake/feed-in), congestion management study before a queue, queue + social prioritisation (pointer to Grid operations), queue size, one integrated queue since 1 July 2026, municipalities applying ahead | `options` (new): what a large consumer can do: profile, peak shaving behind the meter, own battery, hybrid installation, energy hub with group transport agreement (GTO), cable pooling; contract types pointed to Grid planning | `transition` (new): flat annual use but higher peaks (EVs, heat pumps, 1.5 → 5 kW per home), solar 29 GW and 54% renewable in 2024, reverse flows, LAN, II3050 scenarios, anticipatory investment dilemma, long winter peaks weaken flex |

Why this split: the four suggested themes, arranged so every existing lesson stays at level 1 or 2 and keeps its worked example. basics → load start the power topic; levels → path start the grid topic; roles starts the rules topic; congestion starts the congestion topic. The eight new lessons at levels 3–4 use faded examples; the two new level-2 lessons (`law`, `scarcity`) use worked examples.

No overlap with the other grid modules (not yet rebuilt): transformers (tap changers, cables, the connection build process), switchgear (protection, five safety rules), gridops (outage handling, switching plans, workload and prioritisation detail, request-to-commissioning chain) and gridplanning (load flow, N-1 detail, flex contract types, batteries, investment planning) are pointers, not taught again. eng.power keeps the motor/plant side; this module keeps the grid side of kW/kWh/three-phase.

Existing lessons: ids, recall order, answer positions and numbers unchanged (pinned in `tests/fixtures/v13-eng.gridbasics-recall-keys.json`, built from the files before this change; numbers 24, 17.3, 0.25, 200, 300, 1.7, 25). Wording changes only:
- Options rewritten where the correct option was the unique longest (basics r3, levels r1/r3, path r1, load r1–r3, congestion r1–r3, roles r1–r3; path and congestion pre).
- Own hint on every numeric recall question, old and new (17 in total); the validator confirms none contains the answer.
- roles teach 2: outage figure aligned with eng.reliability: 2024 unplanned 23.9 minutes per customer, planned work about 23.3 minutes on top (Netbeheer Nederland, Betrouwbaarheid van elektriciteitsnetten in Nederland, resultaten 2024). The old "20 to 30 minutes" range is gone.
- roles teach 3 now points to the new `law` lesson.

Answer positions (pre + recall MC, en = nl): 15 / 16 / 16 / 16 over 63 MC. Correct option never the unique longest (script check en and nl). Length rank of the correct option (longest incl. ties · 2nd · 3rd · 4th): en 8 · 18 · 19 · 18; nl 11 · 22 · 18 · 12.

Shared definitions copied word for word: Spanningsband / Voltage band, Invoeding / Feed-in, Peak shaving, Anticiperend investeren / Anticipatory investment (eng.gridplanning); Wachtrij / Queue, Maatschappelijk prioriteren / Social prioritisation (eng.gridops); Kleinverbruik / Small consumption (eng.transformers). Not aligned yet, for the later rebuilds to settle: this module's older definitions of Netcongestie, Congestiemanagement, GOPACS, Gelijktijdigheid and Investeringsplan are worded differently from eng.gridops / eng.gridplanning (same meaning). N-1 is used but not defined here (definition stays in eng.reliability / eng.gridplanning).

Facts and sources (checked 2026-11-08):
- Energiewet in force 1 January 2026; Elektriciteitswet 1998 and Gaswet withdrawn the same day; Energiebesluit largely in force (Stb. 2025, 40 and 348; viajuridica.nl, njb.nl).
- ACM codes 2026: 13 new codes; Netcode elektriciteit replaced by Systeemcode elektriciteit 2026; Begrippencode and Tarievencode replaced by 2026 versions (ACM codebesluit 5 Feb 2026, acm.nl/nl/node/28866).
- Prioritisation framework: 2024 decision annulled by the CBb in March 2025; revised framework set 12 December 2025; from 1 July 2026 no separate reserve for small consumption, one integrated queue (ACM; VNG; Solar Magazine).
- GOTORK / UIOLI: ACM code decision 2024, now in the System Code; only in (expected) congestion areas, MV/HV connections using under 50% of contracted capacity over twelve months or leaving at least 1 MW unused; notice and two-month discussion; exemptions for vital processes, hospitals, public transport; applied by DSOs and TenneT from Q3 2026 (Stibbe "UIOLI enforcement"; Dirkzwager; ACM proposal page). Taught in simple form.
- Group transport agreement: ACM codebesluit groepstransportovereenkomst, 19 December 2025; first pilots with energy hubs in 2025 (ACM case page; Solar Magazine).
- Congestion vs transport scarcity and the future-peak sum; red on the capacity map = scarcity and waiting list; HV extensions six to ten years; ~1.3 million plug-in cars early 2024; 620,000+ extra heat pumps since 2015; solar ×28 since 2015 to almost 29 GW; 54% renewable electricity in 2024; average peak power per home ~1.5 → ~5 kW; flat annual use since 2015 (Netbeheer Nederland, "Wat is netcongestie?", 2026).
- Queue: 14,044 applications from large consumers at the regional operators, a little over 9 GW (cabinet package February 2026, via Solar Magazine); taught as "over 14,000, about 9 GW". Municipalities applying up to ten years ahead: taught as "recently".
- Regulation: method decision DSO electricity 2027–2031; agreement of operators, grid users and ACM (ACM news 5 Feb 2026): no litigation, closer review of investment plans; ACM expects households to pay on average €89 a year more for electricity transport in 2027 (ACM, Sept 2026). Under the Energiewet the statutory x/q-factor formulas no longer apply (Oxera note on REG2027).
- Investment: over €8 billion in 2024 to about €15 billion a year towards 2040; totals to 2040 €195 bn (38 GW offshore), €212 bn (30 GW), €235 bn (2026–2040) in successive Netbeheer Nederland reports — taught as a range.
- Offshore grid: 700 MW platforms with 220 kV AC (Borssele, Hollandse Kust); 2 GW standard with 525 kV bipolar HVDC (IJmuiden Ver, Nederwiek), converted to 380 kV AC on land, e.g. Maasvlakte (TenneT 2GW Program; RVO). Interconnectors NorNed 700 MW, BritNed 1,000 MW, COBRAcable 700 MW.
- AC subsea cable practical limit roughly 80–100 km (charging current): general engineering knowledge, hedged.
- Balancing: 50 Hz synchronous area; FCR sized on the 3,000 MW reference incident; automatic under-frequency load shedding from 49.0 Hz (ENTSO-E, NC Emergency and Restoration), taught as "around 49 Hz".
- Unbundling splits: Enexis–Essent and Alliander–Nuon 2009, Stedin–Eneco 2017.
- Tariffs: small consumers pay a capacity tariff by connection size; large consumers per kW contracted and monthly kWmax (Tarievencode structure).
- Aluminium 150 mm² LV cable ≈ 0.206 Ω/km at 20 °C, taught as "roughly 0.2".

Recalculations (new lessons):
- voltage: 150 × 0.2 × 0.4 = 12 V → 218 V; example 120 × 0.2 × 0.6 = 14.4 V, 236 + 14 = 250 V (upper bound); r0 100 × 0.2 × 0.5 = 10 V.
- profile: 4 × 8,760 = 35,040; 100 h × 2 MW = 200 MWh; example 400/4 = 100 h, 280/4 = 70 h, 70 × 1.5 = 105 MWh; r0 240/4 = 60 h; r1 50 × 3 = 150 MWh.
- balance: r2 20,000 × 0.035 = 700 GWh.
- backbone: 200 MW / (1.73 × 150 kV) = 770 A, at 380 kV 304 A; r1 700 MW / (1.73 × 220 kV) = 1,839 A.
- contract: 20 × 50 = 1,000 kW; example 30 × 22 = 660, 560 + 660 = 1,220 vs 1,200; 560/1,200 = 47%; r0 12 × 22 = 264, 520 + 264 = 784, 900 − 784 = 116 kW.
- regulation: 5% × €600 m = €30 m, 1.04 × 0.95 = 0.988; r0 2,400/40 = €60 m.
- scarcity: 48 + 9 + 2 × 2 = 61 vs 60, 60 − 48 = 12; r0 40 − 39 = 1 MW.
- options: 1.2 + 1.0 + 0.8 = 3.0 vs 2 MW; r0 1,000 − 750 = 250 kW.
- transition: 600 × 1.5 = 900 kVA (56%), 600 × 5 = 3,000, /400 = 7.5 → 8, /630 = 4.8 → 5; r0 630/5 = 126.

Uncertain: Dutch term choices Overschrijdingsduur, Temperatuurcorrectie, Traagheid, Laadstroom, Splitsing, Hybride installatie; English names of the 2026 codes are our translations. Queue figure and €89 are moving numbers; start dates of municipal ten-years-ahead applications and GOTORK enforcement hedged.

After merging main (eng.power rebuilt): kW, kWh, Arbeidsfactor / Power factor and Blindvermogen / Reactive power now use the eng.power definitions word for word.

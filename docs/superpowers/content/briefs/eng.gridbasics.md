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

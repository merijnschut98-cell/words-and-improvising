# eng.joining — Welding and joining (engineering, track discrete, level 2)
Index title: en 'Welding and joining' / nl 'Lassen en verbinden'. Blurb: en 'MIG, TIG, spot welding, bolting and bonding: how parts are joined and how joints fail.' / nl 'MIG, TIG, puntlassen, bouten en lijmen: hoe onderdelen worden verbonden en hoe verbindingen falen.'
1. `eng.joining.arc` — MIG/MAG and TIG: how they work, where each is used, shielding gas.
2. `eng.joining.spot` — resistance spot welding in car bodies; current, time, force; electrode wear.
3. `eng.joining.defects` — porosity, lack of fusion, cracks, distortion; causes and how they are found.
4. `eng.joining.inspection` — visual, dye penetrant, ultrasonic, destructive tests (chisel, peel); WPS/WPQR idea.
5. `eng.joining.bolting` — bolted joints: torque vs preload, torque tools and audits, why bolts loosen.
6. `eng.joining.bonding` — adhesives, rivets, clinching; when engineers choose them over welding.

## Deepening pass (2026-11-04): numbers, sources and recalculations

Every lesson now has 5 teach blocks; every technical term is explained in the sentence where it first appears, and each lesson lists 5–6 terms. Lesson ids and the 4 recall questions per lesson (order and what they test) are unchanged. The bolting lesson keeps the numbers the figure `eng.joining.bolt` asserts (25 kN at about 49–50 Nm, nut factor K = 0.20 dry / 0.16 oiled, ±25 % scatter, 18.75 kN lowest, M10 8.8 yield 37.1 kN).

### eng.joining.arc
- Arc 20–35 V, 100–400 A for MAG/TIG on plate: typical ranges in Lincoln Electric GMAW guide and ESAB process handbooks. Kettle ≈ 2.3 kW / 230 V ≈ 10 A.
- MAG gas Ar + 8–20 % CO₂ (EN ISO 14175 groups M20/M21); 82/18 widely sold (e.g. Linde Corgon 18). MIG aluminium: pure Ar (group I1).
- Gas flow 12–18 l/min: ESAB/Lincoln recommendations for 1.0–1.2 mm wire.
- Wire 0.8–1.2 mm: standard MAG wire diameters (EN ISO 14341).
- TIG 3–5× slower than MAG: deposition ~0.5–1 kg/h vs 2–5 kg/h (TWI Job Knowledge, process comparison). Stated as "often".
- Arc energy E = U·I·60/(v·1000) kJ/mm, heat input Q = k·E, k = 0.8 MAG, 0.6 TIG: EN 1011-1 / ISO/TR 17671-1.
- Example: 24 × 220 × 60 / 400,000 = 0.792 kJ/mm; × 0.8 = 0.634 kJ/mm. Recall 1: 25 × 200 × 60 / 300,000 = 1.0 kJ/mm.

### eng.joining.spot
- 8–12 kA, 200–400 ms, 2–4 kN electrode force for 0.7–2 mm steel: RWMA Resistance Welding Manual; AWS D8.9 test method tables.
- 4,000–5,000 spot welds per body-in-white: commonly cited range 3,000–6,000 (e.g. WorldAutoSteel, OEM press material).
- Nugget 4–7 mm; minimum 4√t: common OEM / AWS D8.1 acceptance rule (some use 5√t). 4√1 = 4; 4√2 = 5.66; 4√2.25 = 6.0; 4√1.2 = 4.38.
- Heat = I²Rt (Joule): 1.1² = 1.21 → +21 %.
- Tip dressing around every 200 welds on galvanised steel: typical OEM practice 100–300 welds (Lincoln/ARO and RWMA guidance; zinc–copper alloying, "brass" formation).
- Example: Ø6 → π·3² = 28.27 mm²; 9,500/28.27 = 336 A/mm². Ø7.5 → π·3.75² = 44.18 mm²; 9,500/44.18 = 215 A/mm²; 215/336 = 0.64 → −36 %. Nugget sizes 5.5 → 3.8 mm are illustrative.

### eng.joining.defects
- Porosity, lack of fusion, hot/cold cracks, distortion, spatter, undercut: ISO 6520-1 classification; TWI Job Knowledge defect series.
- Hydrogen cracking delay: inspection hold times 16–48 h are specified in EN ISO 17637 / EN 1090-2 practice for high-strength steels (EN 1090-2 gives minimum hold times of about 16 h, longer for higher grades; table number not re-checked).
- Preheat "for example 100 °C": typical EN 1011-2 preheat for S355 thicker sections (range 50–150 °C).
- ISO 5817 quality levels B (stringent), C (intermediate), D (moderate): correct per standard. Uses named as examples.
- Example: 300/405 = 0.741 → arc energy −26 % at equal V and A; 405/300 = 1.35 → 35 % too fast. Repair 3.5 h is illustrative.

### eng.joining.inspection
- VT, PT, MT, UT, RT: ISO 17637, ISO 3452, ISO 17638, ISO 17640, ISO 17636. PT works on any non-porous material; MT only on ferromagnetic material; 304 austenitic stainless is non-magnetic.
- WPQR under ISO 15614, WPS under ISO 15609, welder qualification ISO 9606; EN 1090-2 requires qualified procedures, welders and a welding coordinator (ISO 14731) for EXC2 and up.
- Example/recall: 12 × 3 × €140 = €5,040 per day. 4√1.2 = 4.4 mm.

### eng.joining.bolting (figure numbers unchanged)
- 8.8: Rm 800 MPa, Re 640 MPa (ISO 898-1). M10 stress area 58.0 mm² (ISO 898-1); 58.0 × 640 = 37.1 kN yield.
- T = K·F·d: 0.20 × 25,000 N × 0.010 m = 50 Nm (lesson: "about 49 Nm"); VDI 2230 table for M10 8.8 at µ = 0.10–0.12 gives 44–51 Nm and 25.9–26.9 kN assembly preload, consistent.
- Torque split ~50 % head / ~40 % thread / ~10 % preload: Bickford, Introduction to the Design and Behavior of Bolted Joints.
- Friction change → 25–30 % preload change; ±25 % scatter for torque control: VDI 2230 tightening factor αA 1.4–1.6 for torque wrenches (±17–23 %), up to ±25 % and more with poorer control; Bickford.
- 50 Nm = 200 N × 0.25 m; 200 N ≈ 20 kg. 25 kN ≈ 2.5 t weight.
- Loosening by transverse slip (Junker test, DIN 65151); split spring washers ineffective (Junker; DIN 127 withdrawn 2003); thread-locker effective.
- Recall: 25 × 0.75 = 18.75 kN.

### eng.joining.bonding
- Al melts 660 °C, steel ~1,425–1,540 °C (rounded 1,500 °C); Fe–Al intermetallics brittle (TWI).
- E-coat (paint) oven ~160–200 °C, epoxy body-shop adhesives cure there (Henkel/Sika/DuPont Betamate data sheets, typically 20–30 min at 170–180 °C).
- SPR: no pre-hole, standard for aluminium bodies (Jaguar XJ, Audi A8 since 1990s; Böllhoff/Henrob).
- Recall: 25 × 20 = 500 mm²; × 20 N/mm² = 10,000 N = 10 kN.
- Example: 96 rivets at 30 mm pitch, 14 m bead: illustrative design.

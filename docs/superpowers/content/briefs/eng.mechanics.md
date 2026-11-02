# eng.mechanics — Materials and strength (engineering, track basics, level 1, WORKED examples)
Index title: en 'Materials and strength' / nl 'Materialen en sterkte'. Blurb: en 'Forces and torque, stress and stiffness, why parts bend, crack or wear, and which material and heat treatment fit.' / nl 'Krachten en momenten, spanning en stijfheid, waarom onderdelen buigen, scheuren of slijten, en welk materiaal en welke warmtebehandeling passen.'

Why (general engineering basics): almost every breakdown, design review or supplier discussion touches loads, stiffness, fatigue, material grades or heat treatment. The existing modules use these words (yield, HRC, S355, 8.8 bolts, fatigue) without teaching them. This gives Merijn the vocabulary to follow a failure analysis or a design discussion.

1. `eng.mechanics.forces` — N vs kg (1 kN per 100 kg), torque = force × arm, static equilibrium (load in the middle splits equally), static vs dynamic vs impact loads, WLL.
2. `eng.mechanics.stress` — σ = F/A (N/mm² = MPa), strain, E (steel 210 GPa, aluminium 70 GPa, plastics 2–3 GPa), stiffness ≠ strength, bending stiffness ∝ height³.
3. `eng.mechanics.strength` — tensile test, yield and UTS, S235/S355 naming, bolt grades (8.8 → 800/640 MPa; 10.9 → 1,000/900), ductile vs brittle, impact test (27 J at −20 °C), safety factors.
4. `eng.mechanics.fatigue` — fatigue below yield, beach marks, S-N curve, endurance limit (~0.5 UTS for polished steel; none for aluminium), stress concentrations (hole in wide plate Kt ≈ 3), surface and size effects.
5. `eng.mechanics.materials` — carbon steel, stainless 304/316 (≥ 10.5% Cr; Mo for chlorides), aluminium (density 2,700, a third as stiff, attacked by caustic cleaners), cast iron, engineering plastics and creep, galvanic corrosion.
6. `eng.mechanics.heattreat` — hardness scales (HB, HV, HRC), hardening and tempering, annealing and stress relieving, case hardening (carburising, nitriding, induction), drawing notes.

Facts and sources
- Callister & Rethwisch, *Materials Science and Engineering: An Introduction*, 10th ed. (tensile test, ductile/brittle, hardness, heat treatment, fatigue and S-N curves, galvanic series).
- Budynas & Nisbett, *Shigley’s Mechanical Engineering Design*, 11th ed. (stress concentration, Kt ≈ 3 for a hole in a wide plate; endurance limit ≈ 0.5 Sut for steels up to ~1,400 MPa; surface and size factors).
- Ashby, *Materials Selection in Mechanical Design* (densities and moduli: steel ~7,850 kg/m³ and ~210 GPa; aluminium ~2,700 kg/m³ and ~70 GPa).
- EN 10025-2 (S235/S355 minimum yield by thickness; J2 = 27 J at −20 °C); EN ISO 898-1 (property classes of bolts: 8.8 nominal Rm 800 MPa, Re 640 MPa; 10.9 Rm 1,000, Re 900).
- EN 10088-1 (stainless steels: ≥ 10.5% Cr; 1.4301 = 304, 1.4401 = 316 with Mo).
- Lifting gear factors (chain slings 4:1, wire rope 5:1): EN 818 / EN 13414 series and the EU Machinery Directive 2006/42/EC Annex I 4.1.2.5.
- Hardening ~800–900 °C and tempering ~150–650 °C ranges for medium-carbon and low-alloy steels: ASM Handbook Vol. 4, *Heat Treating*.

Numbers in questions (checked): 250 × 9.81 = 2,452.5 N; 150 × 0.4 = 60 Nm; 6 / 2 = 3 kN; 20,000 / 400 = 50 MPa; 210/210,000 × 3,000 = 3 mm; 2³ = 8; 355 / 142 = 2.5; 10.9 → 900 MPa; 1,000 × 60 × 16 = 960,000; 7.85 / 7,850 × 2,700 = 2.7 kg.

Uncertain / simplified: safety factor ranges are typical engineering practice, not a code value; the 316 vs 304 price gap is deliberately not quantified (it moves with Ni and Mo surcharges).

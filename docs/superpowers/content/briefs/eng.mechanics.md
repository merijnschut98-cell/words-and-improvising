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

## Clarity round (2026-11-06)
Every lesson now has 5 teach blocks (≤ 90 words) and 6 terms, en and nl in the same order; each term appears literally (or as a simple plural/inflection) in its lesson’s teach text and is defined once in the module. Level 1, so everything is explained from zero: force/mass/weight, kilonewton, lever arm, equilibrium, cross-section, elastic range, mild steel, necking, property class, impact test, working stress, load cycle, keyway, weld toe, shot peening, dye penetrant, density, galvanised, chlorides, pitting, crevices, caustic soda, quench cracks, toughness, warp. Examples and situations explain tension, span, tie rod, yield strength (used before its own lesson), fatigue (in the strength example), agitator, impeller, gusset. The .nl files add the English word once for important unlisted words: belastingen (loads), lager (bearing), tandwielkast (gearbox), stootbelasting (impact load), stroppen (slings), elastische gebied (elastic range), constructiestaal (mild steel), meetklok (dial gauge), sterkteklasse (property class), kerfslagproef (impact test), spiebanen (keyways), kogelstralen (shot peening), penetrant (dye penetrant), dichtheid (density), putcorrosie (pitting), natronloog (caustic soda), vervorming (distortion), taaiheid (toughness), roerwerk (agitator), knieplaat (gusset).

Term changes (old combined terms split, so each links): forces “Newton (N)” → Newton, + Equilibrium/Evenwicht, + Static load/Statische belasting, nl “Moment (koppel)” → Moment; stress “Stiffness and strength” → Stiffness + Strength (nl Stijfheid + Sterkte), + Cross-section/Doorsnede, “Young’s modulus (E)” → Young’s modulus (nl Elasticiteitsmodulus); strength “Ductile and brittle” → Ductile + Brittle (nl Taai + Bros), + Tensile test/Trekproef, “Tensile strength (UTS)” → Tensile strength; fatigue + Load cycle/Lastwisseling, + Beach marks/Rustlijnen; materials + Carbon steel/Koolstofstaal, + Aluminium, + Cast iron/Gietijzer; heattreat “Hardness (HB, HV, HRC)” → Hardness, “Quench and temper” → Quenching + Tempering (nl Afschrikken + Ontlaten), “Annealing and stress relieving” → Annealing + Stress relieving (nl Gloeien + Spanningsarmgloeien).

New facts and sources
- Two-leg sling with 120° between the legs: each leg carries W / (2 × cos 60°) = W, the full load (LEEA *Code of Practice for the Safe Use of Lifting Equipment*; EN 13414-1 / EN 818-6 mode factors). Breaking load 4–5 × WLL: EN 818 / EN 13414, Machinery Directive 2006/42/EC Annex I 4.1.2.5.
- Dynamic factor “often between 1.1 and 2”: a hedged summary; crane design uses φ2 ≈ 1.05–1.6 depending on hoisting class (EN 13001-2), machine design handbooks use up to 2 for shock (Shigley). Stated as a range, not a code value.
- S235/S355 minimum yield valid for thickness ≤ 16 mm, lower for thicker plate: EN 10025-2 Table 7. J2 grades 27 J at −20 °C (Charpy V, EN ISO 148-1).
- Bolt classes per ISO 898-1, nominal Rm 800 / Rp0.2 640 MPa for 8.8, consistent with eng.joining (same rule, same 640 and 900 MPa). ISO 898-1 minimum values are slightly higher (10.9: Rm,min 1,040, Rp0.2,min 940), so the text says “nominal values, used in calculations”.
- Inspection certificate type 3.1 with measured values: EN 10204:2004.
- Fatigue as the leading cause of mechanical failure “by many estimates”: often quoted 50–90 % (e.g. ASM Handbook Vol. 11, *Failure Analysis and Prevention*). Beach marks and final fracture zone size: ASM Vol. 12, *Fractography*. Gigacycle fatigue (failures beyond 10⁷ cycles): Bathias & Paris, *Gigacycle Fatigue in Mechanical Practice* (2005); Murakami. Dye penetrant testing: EN ISO 3452-1.
- Kt ≈ 3 for a hole in a wide plate under tension (Kirsch; Peterson’s *Stress Concentration Factors*).
- Through-hardening steels roughly ≥ 0.3 % C; quench cracks and distortion; untempered martensite can crack hours to days later (delayed cracking): ASM Handbook Vol. 4, *Heat Treating*. Stress relieving of carbon steel typically 550–650 °C (ASM Vol. 4; EN 1090-2 / AWS D1.1 PWHT ranges around 595–650 °C). Carburising ~900–950 °C, gas nitriding ~500–550 °C: ASM Vol. 4.
- Galvanic series (aluminium and zinc anodic to passive stainless in seawater): ASTM G82 / Callister.

Recalculated: 100 × 9.81 = 981 N; 200 × 0.25 = 50 Nm; 10,000 / 100 = 100 MPa; 0.5 / 1,000 = 0.0005; 210,000 / 70,000 = 3; 2³ = 8; 0.8 × 800 = 640 MPa; 1,500 × 60 × 24 = 2,160,000 cycles/day; 7,850 / 2,700 ≈ 2.9. All recall numbers, ids and answer positions unchanged.

Uncertain: the 1.1–2 dynamic factor range and the 550–650 °C stress-relieving range are typical values, not universal. Dutch “sluitingen” for shackles is the shop word in NL hijstechniek (harpsluiting, D-sluiting).

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
- Two-leg sling with 120° between the legs: each leg carries W / (2 × cos 60°) = W, the full load (LEEA *Code of Practice for the Safe Use of Lifting Equipment*; EN 13414-1 / EN 818-6 mode factors). Breaking load 4–7 × WLL (chain 4, wire rope 5, textile 7; review fix): EN 818 / EN 13414, Machinery Directive 2006/42/EC Annex I 4.1.2.5.
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

## v13 topics (2026-11-08): 4 topics × 4 levels

| Topic (id) | 1 Basis | 2 Werkkennis | 3 Gevorderd | 4 Expert |
|---|---|---|---|---|
| Forces, moments and stress (`load`) | `forces` (existing) | `stress` (existing) | `bending` (new): bending moment, cantilever, section modulus W = b·h²/6 and ≈ 0.1·d³, torsion Wp ≈ 0.2·d³, deflection F·L³/(3EI), moment of inertia; bar turned flat | `calccheck` (new): reading FEA, mesh, von Mises σv = √(σ² + 3τ²), boundary conditions and load cases, singularities, hand check |
| Material strength and testing (`strength`) | `strength` (existing) | `testing` (new): EN ISO 6892-1 specimen, proportional gauge length 5.65√S0, ReH / Rp0.2 / Rm / A / Z; hardness ISO 6506 (HBW), 6507 (HV), 6508 (HRC), when to use which, decarburised skin; ISO 18265 conversions approximate | `toughness` (new): Charpy V (EN ISO 148-1), JR/J0/J2/K2, average + 70% single-value rule, ductile-to-brittle transition, fracture toughness KIc, hydrogen embrittlement of 10.9/12.9 | `traceability` (new): EN 10204 2.1/2.2/3.1/3.2, heat number and traceability through cutting, reading a certificate, mix-ups, PMI with XRF (no carbon) vs OES |
| Fatigue and failure (`failure`) | `fatigue` (existing) | `fracture` (new): reading a broken part: ductile/brittle overload, cup and cone, chevron marks, beach and ratchet marks, final zone size, first aid for evidence, sister part, lab analysis | `snlife` (new): stress range, amplitude, mean stress (Goodman), S-N slope m, Miner’s rule with scatter, Marin factors | `weldfatigue` (new): weld toe, residual stress, detail category FAT at 2 million cycles, life = 2·10⁶ × (FAT/Δσ)³, grade-independence of as-welded details, hot-spot stress, post-weld treatment (grinding, TIG dressing, HFMI), inspection plan |
| Heat treatment and material choice (`choice`) | `materials` (existing) | `heattreat` (existing) | `designation` (new): EN 10027-1 names (S/E/P + yield, quality grade, +N/+AR/+QT; C45, 42CrMo4 with factor 4, X5CrNi18-10), EN 10027-2 material numbers, AISI equivalents, EN AW-6082-T6, thickness-dependent yield | `selection` (new): function → process → supply → cost per part (Ashby), specific stiffness, machinability (free-cutting steels, 303), weldability, substitution as design change, PPAP |

Why this split: the four topics suggested in the plan. The six existing lessons all sit at level 1 or 2 (forces 1 and stress 2 in `load`; strength 1; fatigue 1; materials 1 and heattreat 2 in `choice`), so every existing example stays worked. The v14 P1 films keep their lessons: `eng.mechanics.load` serves forces + stress, `tensile` serves strength, `fatigue` and `heattreat` their own lessons, `materials` (P2) its own. No figures were wired to this module. Index blurb now names the four topics.

Existing lessons: ids, recall order, answer positions and numbers unchanged (pinned in `tests/fixtures/v13-eng.mechanics-recall-keys.json`, built from the files before this change). Wording changes only:
- Pre questions moved to positions 3 (forces, strength, heattreat), 0 (stress, fatigue) and 2 (materials); the module had 19 of 21 MC answers at position 1.
- Giveaways removed (correct option was the unique longest): forces pre; stress pre, r3; strength pre, r3; fatigue pre, r1, r3; materials r1, r3; heattreat r1, r2, r3 (en and nl). Some correct options were shortened (stress pre, fatigue r3, materials r1, r3), distractors lengthened elsewhere.
- Own hints on every numeric recall question (old and new); none contains the answer (validator check).
- Pointers instead of repeats: bolt grades, preload and tightening → Welding and joining (strength situation); welding heat, HAZ, carbon equivalent, NDT → Welding and joining (heattreat, designation, selection, weldfatigue); polymers → Injection moulding (materials example); failure patterns, random vs wear-out → Reliability and asset strategy (fatigue example, fracture). Keyway and tolerance stay explained inline as in Machining and Drawings; no definition conflicts with those modules.

Answer positions (pre + MC recall, en = nl): 14 / 13 / 13 / 13 over 53 MC. Correct option never the unique longest (script check en and nl). Correct-option length rank: en tied-longest 3 · 2nd 15 · 3rd 17 · 4th 18; nl 2 · 13 · 18 · 20.

Facts and sources (checked 2026-11-08):
- EN ISO 6892-1:2019 tensile test: ReH, Rp0.2, Rm, A, Z; proportional gauge length L0 = 5.65√S0. Standard mechanics texts: Callister & Rethwisch (10th ed.); Budynas & Nisbett, *Shigley’s Mechanical Engineering Design* (11th ed.).
- Hardness: ISO 6506-1 (Brinell, HBW, 10 mm carbide ball, 3,000 kgf), ISO 6507-1 (Vickers, HV10), ISO 6508-1 (Rockwell; minimum thickness about 10× the indentation depth for the diamond cone). ISO 18265:2013 conversions are approximate and least reliable for tensile strength (https://maconomyportal.sis.se/en/produkter/metallurgy/testing-of-metals/general/sseniso182652013; https://ws-stahl.eu/service/steel-hardness-comparison-table/). “Rm ≈ 3.3 × HB” is a rule of thumb: my own ratio from the ISO 18265 steel table as reproduced at https://optimas.com/technical-resources/hardness-conversion-table/ (190 HB ↔ 640 MPa); taught as “very roughly”.
- S355 per EN 10025-2: ReH 355 MPa ≤ 16 mm, 345 MPa for 16–40 mm; Rm 470–630 MPa (3–100 mm); A ≥ 22% (longitudinal, ≤ 40 mm). Quality grades JR/J0/J2 = 27 J at +20/0/−20 °C, K2 = 40 J at −20 °C. EN 10025-1: average of three, one value may be lower but not below 70% of the specified minimum. Charpy V specimen 10 × 10 × 55 mm, 2 mm notch: EN ISO 148-1.
- Ductile-to-brittle transition (bcc steels; austenitic stainless and aluminium none), Liberty ships: Callister ch. 8.
- Hydrogen embrittlement of fasteners above about 1,000 MPa / 320 HV: ISO 4042 (baking after electroplating); hot-dip galvanised fasteners covered up to class 10.9: ISO 10684.
- EN 10204:2004 document types 2.1, 2.2, 3.1, 3.2. PMI: handheld XRF cannot measure carbon; OES can (common PMI practice, e.g. API RP 578).
- 42CrMo4 +QT (EN 10083-3): 40–100 mm Rp0.2 ≥ 650 MPa, Rm 900–1,100 MPa (supplier reproductions of the standard table, e.g. https://www.kippwerk.de/en/1.7225-QT%20steel and https://swisssteel-group.com/content-media/documents/Data-Sheets/Engineering-Steel/42CrMoS4-XTP_en.pdf). Material numbers 1.0577 (S355J2), 1.7225 (42CrMo4), 1.4301 (X5CrNi18-10, 304), 1.4404 (X2CrNiMo17-12-2, 316L): EN 10027-2 / EN 10088-1. Naming rules and factors 4/10/100/1000: EN 10027-1. 34CrNiMo6 Cr 1.3–1.7%. Aluminium EN 573-3 (EN AW-6082) and EN 515 tempers (O, T6).
- Bending, torsion and deflection formulas: Shigley; Roark’s *Formulas for Stress and Strain*. Von Mises for combined bending and torsion: Shigley ch. 5. FEA singularities at sharp re-entrant corners: standard FEA practice (NAFEMS guidance).
- Fractography (cup and cone, chevron marks, beach and ratchet marks, final zone size): ASM Handbook Vol. 11 and 12. Lab failure analysis “low thousands of euros” is a hedged order of magnitude.
- Goodman mean-stress correction, Marin factors (machined ka ≈ 0.83, as-forged ≈ 0.47 at Sut 600 MPa), Palmgren-Miner rule: Shigley ch. 6. Miner scatter “about D = 0.3 to 3”: Schijve, *Fatigue of Structures and Materials*; hedged.
- Welded fatigue: EN 1993-1-9 detail categories as stress range at 2 million cycles, slope m = 3 (then 5, cut-off): https://www.SteelConstruction.info/images/7/73/GN_2-12.pdf (category 80 attachment); IIW recommendations (Hobbacher) for as-welded fatigue strength independent of steel strength, hot-spot stress, and improvement by grinding, TIG dressing and HFMI. FAT values in the teach text (ground butt ≥ 100, attachments 71–80, poor detail 36) are typical table values, stated with “might be”.
- Specific stiffness E/ρ ≈ 26 GPa per 1,000 kg/m³ for steel (26.8), aluminium (25.9), titanium (24.4): Ashby, *Materials Selection in Mechanical Design*. Free-cutting 11SMnPb30 (EN 10087), 303 vs 304 (EN 10088-3). PPAP: AIAG PPAP manual (4th ed.).

Recalculations (all by script):
- bending: example 2,000 × 500 = 1,000,000 Nmm; W = 20 × 60² / 6 = 12,000 mm³ → 83 MPa, 235 / 83 = 2.8; flat W = 4,000 → 250 MPa; I ratio 9. r0 1,500 × 0.8 = 1,200 Nm; r1 W = 8,000, 600,000 / 8,000 = 75 MPa; r2 (40/50)³ = 0.51; r3 2³ = 8; situation (700/400)³ = 5.4.
- calccheck: √(80² + 3·40²) = 105.8 → 106 MPa, 650 / 106 = 6.1. r0 √6,300 = 79.4; r1 10,000 × 300 / 25,000 = 120 MPa.
- testing: S0 = 78.5 mm², L0 = 50.07 mm, 29,000 / 78.5 = 369 MPa, 41,600 / 78.5 = 530 MPa, (61 − 50) / 50 = 22%. r0 26,000 / 50 = 520; r1 13 / 50 = 26%.
- toughness: (31 + 24 + 35) / 3 = 30 J; 0.7 × 27 = 18.9 J. r0 102 / 3 = 34; r1 18.9.
- traceability: 3 / 40 = 7.5%. r0 8 / 120 = 6.67%.
- fracture: 1,450 / 25 = 58 rpm; 58 × 60 × 24 = 83,520 per day; × 425 = 35.5 million. r0 120 × 60 × 20 × 300 = 43.2 million.
- snlife: N(120) = 592,593; D = 0.3375 + 0.5 = 0.84; life 1.19 years; start-stops 40% of damage. r0 1.25³ = 1.95; r1 0.3 + 0.4 = 0.7; situation 1.26³ = 2.0.
- weldfatigue: (71/60)³ × 2·10⁶ = 3.31 million → 1.1 years; (90/45)³ × 2·10⁶ = 16 million → 5.3 years. r0 0.8³ × 2 = 1.024 million; r3 50 × 2.5^(1/3) = 67.9.
- designation: r0 6 / 4 = 1.5%; r1 345 / 230 = 1.5 (355 / 230 = 1.54).
- selection: 2.4 × 2,700 / 7,850 = 0.83 kg; steel 3.60 + 16.00 = 19.60; aluminium 4.15 + 8.00 = 12.15; difference 7.45. r0 4.50 + 12.00 = 16.50; r1 4 × 3^(1/3) = 5.77 mm, mass ratio 0.50; situation 0.80 × 200,000 = €160,000.

Uncertain: the 3.3 × HB ratio (no primary source states it; derived from the conversion table); Miner scatter range and Marin percentages are hedged textbook values; FAT examples are typical, not quoted per table row. Dutch terms: Uitkragende ligger (cantilever), Weerstandsmoment (section modulus), Ratchetlijnen (ratchet marks; Dutch failure reports often keep the English), Hot-spotspanning, Zusterdeel (sister part), Nabehandeling van de las (post-weld treatment). nl uses FEM for FEA (the common Dutch abbreviation), with FEA given once in parentheses.

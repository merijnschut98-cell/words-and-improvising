# eng.moulding — Injection moulding (engineering, track discrete, level 2)
Index title: en 'Injection moulding' / nl 'Spuitgieten'. Blurb: en 'How plastic parts are made, what drives cycle time and why parts warp, sink or flash.' / nl 'Hoe kunststof onderdelen worden gemaakt, wat de cyclustijd bepaalt en waarom delen kromtrekken, inzakken of braam hebben.'
1. `eng.moulding.machine` — the machine: hopper, screw, barrel, mould, clamp force; the cycle steps.
2. `eng.moulding.cycle` — cycle time breakdown; cooling dominates; cavities and output per hour.
3. `eng.moulding.materials` — common plastics (PP, ABS, PA, PC), drying, regrind, colour changes.
4. `eng.moulding.defects` — short shot, flash, sink marks, warpage, burn marks; what causes each.
5. `eng.moulding.process` — process window, the main parameters, scientific moulding idea, why “just tweak it” is risky.
6. `eng.moulding.tooling` — mould maintenance, mould changes (SMED), hot runners, mould cost and lead time.

## Deepening pass (2026-11-04): numbers, sources and recalculations

Same 6 lesson ids, 4 recall questions each in the same order; teach expanded to 5 blocks per lesson, every term explained at first use. Figure `eng.moulding.cycle` unchanged; its asserted numbers (3 mm wall → 12 s cooling, 20 s cycle, 2 cavities, 360/h; 2.4 mm → 7.68 s cooling, 15.7 s, 459/h) are kept verbatim in the cycle example.

Sources used: Rosato & Rosato, *Injection Molding Handbook* (3rd ed.); Bryce, *Plastic Injection Molding: Manufacturing Process Fundamentals* (SME); Kulkarni, *Robust Process Development and Scientific Molding* (Hanser); Malloy, *Plastic Part Design for Injection Molding* (Hanser); resin supplier processing guides (BASF Ultramid, Covestro Makrolon, Borealis PP); SPI/PLASTICS mould classification (Class 101 = 1,000,000+ cycles); AIAG PPAP manual (significant production run, 300 parts).

| Lesson | Number | Check |
|---|---|---|
| machine | 1 bar ≈ 1 kg per cm²; 400 bar on 1 cm² = 0.4 t | 1 bar = 10 N/cm² = 1.02 kgf/cm² |
| machine | 0.3–0.6 t per cm² projected area | = 300–600 bar mean cavity pressure; handbooks give 2–5 tsi ≈ 0.3–0.8 t/cm² |
| machine | 15 × 20 = 300 cm² × 0.4 = 120 t; ×2 = 240 t; +10–20% → 264–288 t → 280/300 t press | recalculated |
| machine r1 | 250 × 0.4 = 100 t | recalculated |
| cycle | 30 s = 2 + 1.5 + 6 + 15 + 2 + 3.5 | sums to 30 |
| cycle | cooling ∝ s² | 1-D conduction solution t = s²/(π²α)·ln(…) |
| cycle | 3,600/24 × 4 = 600/h; 3,600/20 × 2 = 360; 12 × 0.64 = 7.68; 8 + 7.68 = 15.68 s; 3,600/15.68 × 2 = 459.2 (+27.6%) | recalculated; matches figure build asserts |
| cycle situation | 26/22 = 1.18 (+18% time); 22/26 = 0.846 (−15% output) | recalculated |
| materials | shrinkage amorphous ≈ 0.5% (ABS 0.4–0.7, PC 0.5–0.7), semi-crystalline 1–2% (PP 1.0–2.5, PA6 0.7–2.0) | supplier datasheets |
| materials | drying 2–4 h at 80–120 °C (PA 80 °C, PC 120 °C, PBT 120 °C; PET 160–170 °C), dew point −40 °C | supplier guides |
| materials | dryer 4 h × 12 kg/h = 48 kg; top-up 20 kg used in 20/12 = 1.67 h | recalculated (old text said “1.5 h”, corrected to 1.7) |
| materials r1 | 3 × 20 = 60 kg | recalculated |
| materials | regrind 10–25% customer limits | typical OEM specs |
| defects | vent depth 0.01–0.05 mm (PP ≈ 0.015–0.02, ABS/PC ≈ 0.03–0.05) | Rosato; mould-component suppliers |
| defects r1 | 400 × 0.5 = 200; 200 − 160 = 40 t | recalculated |
| process | PP melt ≈ 230 °C (range 200–280), mould 20–80 °C | Borealis PP guide |
| process | switchover at 95–98% full; r1 96% × 100 cm³ = 96 cm³ | Kulkarni (decoupled II) |
| process | gate freeze study: part weight vs hold time until weight plateaus | Kulkarni |
| tooling | mould €20k–€300k; lead time 10–16 weeks; PM every 50k–100k shots; production mould 1M+ shots | industry ranges; SPI Class 101 |
| tooling | 40 × (1.5 − 0.5) = 40 h/week; × €60 = €2,400; × 46 = €110,400; payback 55,000/2,400 = 22.9 weeks | recalculated |
| tooling r1 | 15 × 1.5 = 22.5 h | recalculated |

## v10 topics (added 2026-11-04)

Six topics, four levels each (1 Basis, 2 Werkkennis, 3 Gevorderd, 4 Expert). Examples are `worked` at levels 1–2 and `faded` at levels 3–4, by the lesson's level in its topic. Integrator rulings for this lane: teach 3–5 blocks of ≤ 90 words with `\n\n` paragraphs; terms 2–6 per lesson, en and nl `terms` in the same order with the same count, each term literally in its lesson's teach text; each term defined once per module (lowest level); in .nl text an important technical word that is not in that lesson's terms gets the English word in parentheses once.

| Topic (id) | Basis | Werkkennis | Gevorderd | Expert |
|---|---|---|---|---|
| De machine `machine` | `machine` (existing) | `screw` | `clamp` | `electric` |
| Cyclus en output `cycle` | `cycle` (existing, figure) | `cooling` | `cavities` | `partcost` |
| Kunststoffen `materials` | `materials` (existing) | `polymers` | `drying` | `fillers` |
| Fouten `defects` | `defects` (existing) | `diagnose` | `warpage` | `defectdata` |
| Procesinstelling `setting` | `setup` | `process` (existing) | `scientific` | `validation` |
| Matrijzen `moulds` | `tooling` (existing) | `mouldparts` | `mouldcare` | `newmould` |

### Scope per level

- **machine**: 1 `machine` the press, injection and clamp unit, mould, the cycle, tonnage by rule of thumb. 2 `screw` the screw's three zones, dosing during cooling, back pressure, check ring, residence time and when dosing limits the cycle. 3 `clamp` choosing a press: projected area (incl. runner) × mean cavity pressure, safety margin, shot volume as 20–80 % of barrel capacity (40–60 % ideal), mould height, tie-bar spacing, opening stroke. 4 `electric` hydraulic vs all-electric vs hybrid, energy per kg, two-component and insert moulding, what to ask before an investment.
- **cycle**: 1 `cycle` cycle breakdown, cooling ∝ s², output per hour (figure numbers kept verbatim). 2 `cooling` what the setter does: mould temperature, ejection temperature, temperature control unit, water flow and scale, cutting cooling time in steps while measuring. 3 `cavities` more cavities vs a faster cycle, fill balance, hot runner and valve gates, family moulds; faded break-even. 4 `partcost` cost build-up of a moulded part: material with scrap, machine hour rate over good parts per hour, mould amortisation; which line dominates.
- **materials**: 1 `materials` thermoplastics, two families, drying basics, regrind, colour. 2 `polymers` amorphous vs semi-crystalline in practice: glass transition vs melting point, crystallinity and mould temperature, post-shrinkage, cavity size from shrinkage. 3 `drying` residual-moisture limits, hydrolysis vs plasticising, measuring moisture (weight-loss analyser, Karl Fischer), over-drying, dryer checks; faded moisture calculation. 4 `fillers` glass fibre and talc, fibre orientation and anisotropic shrinkage, abrasion, recyclate and melt flow index, comparing material cost per part instead of per kg; faded.

### Facts and sources (verified 2026-11-04)

| Fact used | Lesson | Source |
|---|---|---|
| Clamp force ≈ projected area (parts + runner) × average cavity pressure; ballpark, not exact | machine, clamp | RJG, “Clamp force: why it’s vital…” https://rjginc.com/?p=223794 ; Autodesk Moldflow help https://help.autodesk.com/cloudhelp/2018/ENU/MoldflowInsight/files/GUID-5C97629F-C5C5-4A6D-BD2A-55FE6A4A5EE2.htm |
| Empirical factors about 0.3 t/cm² (PP, PE, PS) to 0.65–0.7 t/cm² (PA, POM, glass-filled) | clamp | calculation reference https://service.polymech.info/api/vfs/get/machines/projects/hydraulic-power-pack/reference/applications/calculations.md (rule of thumb, stated with “about”) |
| Shot size 20–80 % of barrel capacity, ideally 40–60 %; low = long residence time, high = recovery-limited / unmelt | screw, clamp | RJG, “Right mold, right machine” https://rjginc.com/right-mold-right-machine/ ; Plastics Technology https://www.ptonline.com/articles/are-you-using-more-than-65-of-your-barrel-capacity (some say max 65 %) |
| Residence time ≈ (barrel shot capacity / shot size) × cycle time | screw | Plastics Technology https://ptonline.com/articles/important-factors-and-approaches-to-estimating-residence-time-in-injection-molding ; Rosti https://rosti.com/resources/blogs/plastic-residence-time-calculation-and-process/ |
| Specific energy: hydraulic 0.278 vs all-electric 0.073 kWh/lb (≈ 0.61 vs 0.16 kWh/kg) in one study; MIT: 19.0 / 13.2 / 12.6 MJ/kg hydraulic / hybrid / electric incl. auxiliaries | electric | ACEEE 2005 https://www.aceee.org/files/proceedings/2005/data/papers/SS05_Panel01_Paper15.pdf ; MIT https://dspace.mit.edu/handle/1721.1/35646 . Lesson uses conservative assumed values (0.6 vs 0.3 kWh/kg) and says so |
| Cooling time ∝ wall thickness² (1-D conduction solution) | cycle, cooling | RJG https://rjginc.com/injection-molding-cooling-time-a-breakdown/ ; Fictiv https://www.fictiv.com/articles/injection-molding-cycle-time |
| PC: ≤ 0.02 % residual moisture for injection moulding, dried at 120 °C, 2–4 h in modern dryers | drying | Covestro Makrolon processing https://info.formerra.com/hubfs/Covestro-Makrolon.pdf |
| PET: ≤ 0.005 % (50 ppm), dew point −40 °C or lower | drying | US 10343323 https://patents.justia.com/patent/10343323 ; Bry-Air https://www.bryair.com/?p=4995 |
| PA: grade-specific limit, e.g. ≤ 0.15 % for an Ultramid PA66-GF33 grade, 0.03–0.06 % for some PA6 grades, dryer 80 °C, dew point ≤ −20 °C | drying | BASF Ultramid A 218G V33 processing sheet https://download.basf.com/p1/8a80812f8b13e689018b3cdc23726d1d/en/Ultramid%25C2%25AE_A_218G_V33_BLACK_41N |
| PC glass transition about 145 °C | polymers | Covestro Makrolon OD2015 https://solutions.covestro.com/en/products/makrolon/makrolon-od2015_56979909-00001927 |
| PA6 melting point 220 °C, recommended mould temperature 80 °C | polymers | BASF Ultramid B via Material Data Center https://materialdatacenter.com/ms/en/Ultramid B/BASF+SE/Ultramid%C2%AE+B3G4/990f1a33/4337 |
| Glass-fibre PA shrinks 2–3× more across the flow than along it (e.g. PA6 GF: 0.27 % parallel, 0.72 % normal) | fillers | Ultramid B glass-filled datasheet (Material Data Center, as above); zetarmold guide https://zetarmold.com/?p=53961 |
| Machine hour rates are shop-specific; lessons state an assumed €60/h (as in `tooling`) and point to `eng.cost` | partcost, cavities | Plastics Technology hourly rate survey https://www.ptonline.com/blog/post/custom-molders-how-do-your-hourly-press-rates-compare (no European figure found, so an assumption) |

| Densities PA66 GF30 ≈ 1.36 g/cm³, PP GF30 ≈ 1.12 g/cm³ | fillers | typical resin datasheet values, stated with “about” (not separately sourced) |
| Most melting heat comes from screw shear, not the heater bands; screw length about 20 × diameter | screw | handbook rule of thumb (Rosato, *Injection Molding Handbook*); stated without a percentage |

Material prices, mould prices and energy prices in the examples are stated as assumptions, not facts.

### Recalculations (topics 1–3, new lessons)

| Lesson | Number | Check |
|---|---|---|
| screw | 600/150 = 4 × 30 = 120 s; 600/60 = 10 × 30 = 300 s; r1 450/90 = 5 × 24 = 120 s | recalculated |
| clamp | 2 × 180 + 20 = 380 cm² × 0.45 = 171 t × 1.15 = 196.7 t; 100/120 = 83 %; 100/250 = 40 %; r1 600 × 0.35 = 210 t; r2 90/300 = 30 % | recalculated |
| electric | 30 × 6,000 = 180,000 kg × 0.3 = 54,000 kWh × €0.20 = €10,800; 40,000/10,800 = 3.7 y; r1 25,000 kWh; r2 4 y | recalculated |
| cooling | 3,600/24 × 4 = 600; 24 − 2.5 = 21.5 s; 3,600/21.5 × 4 = 669.8 (+11.6 %); r1 (2/2.5)² × 10 = 6.4 s; r2 360 − 288 = 72 | recalculated |
| cavities | 720/h → 2,777.8 h × €60 = €166,667; 1,200/h → 1,666.7 h × €75 = €125,000; Δ €41,667; 60,000/41,667 = 1.44 y; at 500k parts: Δ €10,417 → 5.8 y; r1 120 × 5 = 600; r2 50,000/20,000 = 2.5 | recalculated |
| partcost | 0.040 × 2.00 × 1.03 = €0.0824; 3,600/30 × 4 × 0.85 = 408/h; 60/408 = €0.147; mould €0.080; total €0.31; 1 s cycle ≈ €0.005, 1 g ≈ €0.002; r1 50/300 = 0.167; r2 60,000/400,000 = 0.15 | recalculated |
| polymers | 100.0 × 1.015 = 101.5 mm; 101.5 × 0.995 = 100.99 ≈ 101.0 mm; r1 50 × 1.02 = 51.0 mm | recalculated |
| drying | 0.006/20 = 0.03 %; r1 0.010/10 = 0.1 %; r2 100,000 g × 0.00005 = 5 g | recalculated |
| fillers | 50 × 1.36 = 68 g × €4.00/kg = €0.272; 50 × 1.12 = 56 g × €2.20/kg = €0.123; r1 0.6 % × 200 = 1.2 mm; r2 40 × 1.25 = 50 g × €3/kg = €0.15 | recalculated |

### Note on faded examples (done in the Task 9 review)

Switched: the twelve level-3/4 lessons now ship `kind: 'faded'` with `ask` and `reveal`, and the reveal is no longer repeated at the end of `text`. The validator takes the example kind from the lesson's level in its topic. The note below is kept for history.


The current validator still checks the example kind against the module's `level` (2), so a `faded` example fails until Task 1 lands. The six level-3/4 lessons of topics 1–3 therefore ship with `kind: 'worked'` for now and already carry `ask` and `reveal`; their `text` ends with the reveal verbatim. To switch after Task 1: set `kind: 'faded'` and cut the trailing reveal (and the `\n\n` before it) from `text`.

### Scope per level (topics 4–6)

- **defects**: 1 `defects` (existing, unchanged) the common defects and one cause each. 2 `diagnose` four questions (which cavity, where, every shot or intermittent, since when), fill study, jetting, change one thing and wait (about 10 shots; 20–30 min after a temperature change), boundary samples. 3 `warpage` differential shrinkage from thickness, temperature (bows towards the hotter half) and orientation; corner effect; mould shrinkage vs post-shrinkage, conditioning; process vs steel, steel-safe; faded anisotropic steel sizing. 4 `defectdata` a defect solved for good (cause, window, monitoring), 2^k DOE with main effect and interaction, cavity pressure sensors, process monitoring and its limits, what a manager weighs; faded DOE main effects.
- **setting**: 1 `setup` (new) the five settings: temperatures, injection speed, switchover point, holding pressure and time, cooling time; the setting sheet; worked fill-time and cycle sum. 2 `process` (existing) the process window. 3 `scientific` viscosity curve (relative viscosity = pressure × intensification ratio × fill time), pressure drop study (≤ about 80 % of available), gate freeze study; faded viscosity calculation. 4 `validation` IQ/OQ/PQ, part weight on a control chart, cavity pressure, revalidation triggers; faded control limits and Cpk.
- **moulds**: 1 `tooling` (existing) moulds, changes, maintenance. 2 `mouldparts` halves, sprue, runners, edge and tunnel gates, cooling, vents, ejector pins, draft angle, undercuts and slides; worked runner share of the shot. 3 `mouldcare` PM calendar from the shot counter, in-press vs toolroom PM, wear parts, mould logbook patterns, last-shot sample, internal vs external setup; faded PM interval and services per year. 4 `newmould` project steps, DFM (ribs 40–60 % of wall, draft), fill simulation, SPI classes 101–105, T0/T1, PPAP (300 consecutive parts, default level), quote comparison on cost per part over life; faded.

Term move (existing lesson): `Switchover point` / `Omschakelpunt` moved from `process` (level 2) to `setup` (level 1 of the same topic), so it is defined at the lowest level that uses it. `process` keeps 5 terms in the same en/nl order; its recall is untouched. Terms defined in topics 4–6: diagnose (Flow front, Fill study, Jetting, Boundary sample), warpage (Differential shrinkage, Corner effect, Mould shrinkage, Conditioning), defectdata (DOE, Main effect, Interaction, Cavity pressure sensor, Process monitoring), setup (Setting sheet, Melt temperature, Injection speed, Switchover point, Holding time), scientific (Viscosity curve, Intensification ratio, Pressure drop study, Pressure-limited, Gate freeze study), validation (Validation, IQ/OQ/PQ, Part weight, Revalidation), mouldparts (Sprue, Tunnel gate, Ejector pin, Draft angle, Undercut, Slide), mouldcare (Wear parts, Mould logbook, Last-shot sample, Internal setup, External setup), newmould (DFM, Fill simulation, SPI class, T0, PPAP).

### Facts and sources, topics 4–6 (verified 2026-11-04)

| Fact used | Lesson | Source |
|---|---|---|
| Part bows towards the hotter mould half; a larger temperature difference between plates gives more warpage; about 5–10 °C difference can already cause bowing (rule of thumb, stated with “about”) | warpage | Estudos Tecnológicos (UNISINOS) https://revistas.unisinos.br/index.php/estudos_tecnologicos/article/view/5499 ; ZetarMold https://zetarmold.com/?p=36277 (vendor rule of thumb) |
| Glass-fibre PA shrinks 2–3× more across the flow (0.3 / 0.7 % used as “about”, from the 0.27 / 0.72 % datasheet values) | warpage | as in topics 1–3 (Ultramid B GF datasheet, Material Data Center) |
| Change one thing; wait about 10 shots after speed/pressure, 20–30 min after temperature | diagnose | shop rule of thumb, stated with “about”/“often” (no single source) |
| Relative viscosity = peak hydraulic pressure × intensification ratio × fill time; 10–12 speeds; pick the flat part; study without hold, about 95 % full | scientific | Plastics Technology https://www.ptonline.com/columns/understanding-polymer-flow-interpreting-the-viscosity-curve ; PlasticsToday https://www.plasticstoday.com/plastics-processing/robust-repeatable-recommendations-fill-time ; Kulkarni, *Robust Process Development and Scientific Molding* (Hanser) |
| Intensification ratio “often about 10” | scientific | typical machine value (rule of thumb, “often about”); the lesson says the machine maker gives it |
| Required injection pressure ≤ 80 % of available (pressure drop study) | scientific | Kulkarni (FIMMTECH) on UL Prospector https://ulprospector.ul.com/1207/pe-plastic-pressure-drop/ ; Autodesk Moldflow (80 % flag) https://help.autodesk.com/cloudhelp/2014/ENU/MoldflowComm/files/GUID-1D69A13A-6BAA-4FDC-8A6C-0512AB5AF8F9.htm |
| Gate freeze: weight plateau; set hold a little beyond (half a second to a second) | scientific, process | Kulkarni (as above); margin stated as common practice |
| IQ/OQ/PQ definitions; OQ sets limits at the window edges, PQ shows consistency under production conditions | validation | GHTF/SG3/N99-10:2004 https://www.imdrf.org/sites/default/files/docs/ghtf/final/sg3/technical-docs/ghtf-sg3-n99-10-2004-qms-process-guidance-04010.doc |
| Cavity pressure sensors sort good from bad parts automatically | defectdata, validation | Kistler https://www.kistler.com/AT/en/cavity-pressure/C00000099 ; Plastics Machinery & Manufacturing (RJG CoPilot) https://www.plasticsmachinerymanufacturing.com/injection-molding/product/55316362/copilot-go-speeds-mold-trials-troubleshooting |
| SPI classes: 101 ≥ 1M cycles; 102 ≤ 1M; 103 < 500k; 104 < 100k; 105 prototype ≈ 500 | newmould | Plastikon SPI summary https://www.plastikon.com/wp-content/uploads/spi-class-summary.pdf ; Fictiv https://www.fictiv.com/articles/what-to-know-about-injection-molding-tooling-life (sources differ at the edges; the common values are used) |
| PPAP significant production run: at least 300 consecutive parts unless the customer specifies otherwise, production tooling and rate; level 3 is the default | newmould | AIAG PPAP 4th ed., as quoted in Prestolite Supplier PPAP Handbook https://www.prestolite.com/wp-content/uploads/2024/01/Prestolite-Supplier-PPAP-Handbook-Rev-D.pdf |
| Rib thickness about 40–60 % of the nominal wall; draft at least 0.5°, about 1° per side typical, more with texture | mouldparts, newmould | Fathom design guidelines https://fathommfg.com/app/uploads/2025/12/Design-Guidelines-for-Injection-Molding.pdf ; Protolabs draft guide https://protolabs.com/resources/design-tips/improving-part-moldability-with-draft/ |

Mould prices, sensor costs, complaint costs and weights in the examples are stated as assumptions.

### Recalculations (topics 4–6, new lessons)

| Lesson | Number | Check |
|---|---|---|
| diagnose | 1/20 = 5 % of shots / 4 = 1.25 % of parts; r1 10 % / 8 = 1.25 % | recalculated |
| warpage | 200 × 1.005 = 201.0; 100 × 1.005 = 100.5; 201.0 × 0.997 = 200.40; 100.5 × 0.993 = 99.80; 200 × 1.003 = 200.6; 100 × 1.007 = 100.7; r1 150 × 0.004 = 0.6 mm | recalculated |
| defectdata | P: (30+10)/2 = 20 − (40+24)/2 = 32 → −12; t: 17 − 35 = −18; P at short t −10, at long t −14; r1 2^4 = 16; r2 12,000/3,000 = 4 | recalculated |
| setup | 60 − 12 = 48 mm / 80 = 0.6 s; 0.6 + 4 + 10 + 4 = 18.6 s; r1 (50 − 10)/40 = 1.0 s | recalculated |
| scientific | 80×10×1.60 = 1,280; 110×10×0.80 = 880; 150×10×0.55 = 825; 400/1,280 = 31 %; 55/880 = 6 %; 1,500/2,000 = 75 %; r1 120×10×0.9 = 1,080; r2 1,800/2,000 = 90 % | recalculated |
| validation | 4.820 ± 3 × 0.006 = 4.802–4.838; Cpk 0.040/0.018 = 2.2; r1 12.50 + 0.06 = 12.56; r2 0.10/0.06 = 1.67 | recalculated |
| mouldparts | 2 × 18 + 6 = 42 g; 6/42 = 14.3 %; r1 8/56 = 14.3 % | recalculated |
| mouldcare | 120 × 3,600/12 = 36,000/week; 100,000/36,000 = 2.8 weeks; 46 × 36,000 = 1,656,000 → 16.6 services × 8 h ≈ 130 h; pre 80,000/2,000 = 40; r1 16×3,600/20 = 2,880/day; 50,000/2,880 = 17.4 | recalculated |
| newmould | 1.5M/2 = 750,000 shots; A 2 × 45,000 = 90,000 / 1.5M = 0.060; B 75,000/1.5M = 0.050; Δ 15,000; r1 90,000/1.2M = 0.075; situation 5 × 400,000 = 2M parts = 1M shots | recalculated |

Faded examples in `warpage`, `defectdata`, `scientific`, `validation`, `mouldcare` and `newmould` ship as `worked` with `ask` and `reveal` and the reveal verbatim at the end of `text`, as in topics 1–3; switch them as described in the note above.

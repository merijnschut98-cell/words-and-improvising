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

## v10 topics (2026-11-04)

Six topics, four levels each (1 Basis, 2 Werkkennis, 3 Gevorderd, 4 Expert). Worked example at levels 1–2, faded at 3–4 (by the lesson's level in its topic). Schema limits as today: 3–5 teach blocks of ≤ 90 words, `\n\n` paragraphs, 2–6 terms with the en and nl lists in the same order and count, each term literally in its lesson's teach text, every term defined once per module (lowest level that uses it). In the nl text, an important word that is not in the lesson's terms gets its English word in parentheses once. The `eng.joining.bolting` lesson stays byte-identical (the figure `eng.joining.bolt` asserts its numbers).

| Topic (id) | Basis | Werkkennis | Gevorderd | Expert |
|---|---|---|---|---|
| **Booglassen** `arc` | `arc` (existing): MIG/MAG and TIG, arc, filler, shielding gas, arc energy | `weldparams`: wire feed sets current, voltage sets arc length, travel speed, stick-out; short/spray/pulsed arc; heat input with k (EN 1011-1); deposition rate from wire | `wps`: pWPS → WPQR (ISO 15614-1) → WPS (ISO 15609-1); essential variables and range of qualification; welder qualification ISO 9606-1 and its 6-month confirmation; welding coordinator (ISO 14731); faded | `metallurgy`: HAZ and t8/5, martensite, CEV (IIW), the hydrogen-cracking triangle, EN 1011-2 preheat trade-offs; austenitic stainless (distortion, interpass, heat tint); aluminium (oxide, HAZ softening per Eurocode 9); faded |
| **Puntlassen** `spot` | `spot` (existing): current, time, force; nugget 4√t; wear, stepper and dressing introduced | `spotwear`: weld counter, dressing cycle, cap change, stepper rule I₂ = I₁·(d₂/d₁)², tip imprint, cooling water, alignment; what to check before touching the current | `spotquality`: peel and chisel tests, button measurement (average of two diameters at right angles), interfacial fracture, ultrasonic spot testing, adaptive control, reaction plan; faded | `spotlobe`: weld lobe (ISO 14327 / AWS D8.9), galvanised steel, AHSS and multi-pulse schedules, aluminium spot welding; what a manager weighs on a material or supplier change; faded |
| **Lasfouten en inspectie** `defects` | `defects` (existing): porosity, lack of fusion, cracks, distortion, ISO 5817 | `inspection` (existing): VT, PT, MT, UT, RT, destructive tests, WPS/WPQR idea | `ndt`: who chooses B/C/D; EXC1–EXC4 → D/C/B (EN 1090-2); UT with angle probe and A-scan; RT and MT in practice; ISO 9712 levels; hold time; faded | `weldrca`: repair rate, defect coding (ISO 6520-1), Pareto patterns (welder / position / robot / batch); residual stress, stress relieving, overwelding (weld metal ∝ throat²); faded |
| **Boutverbindingen** `bolting` | `bolts` (batch 2) | `bolting` (existing, bolt figure) | `tightening` (batch 2) | `jointdesign` (batch 2) |
| **Lijmen en mechanisch verbinden** `bonding` | `bonding` (existing) | `adhesives` (batch 2) | `rivets` (batch 2) | `choosejoint` (batch 2) |
| **Lassen in productie** `production` | `weldcell` (batch 2) | `fixturing` (batch 2) | `arcon` (batch 2) | `weldsystem` (batch 2) |

Existing lessons in topics 1–3 (`arc`, `spot`, `defects` at level 1, `inspection` at level 2) keep `worked` and are unchanged byte for byte: ids, recall order, answer positions and numbers were checked with a script against `git show HEAD:`. The new lessons were inserted around them in topic order.

Validator note: the current `validate.js` checked the example kind against `meta.level` (2 for this module), which rejects faded examples at levels 3–4. Batch 1 changed that check to use the lesson's level in its topic when `meta.topics` is present (non-topic modules unchanged). Task 1 should keep or replace this.

### Terms already defined (later batches must not define these again)
Per language, in lesson order, nl / en.
- `arc`: MIG/MAG, TIG, Smeltbad / Weld pool, Beschermgas / Shielding gas, Booglasenergie / Arc energy, WBZ / HAZ.
- `weldparams`: Draadsnelheid / Wire feed speed, Kortsluitboog / Short arc, Sproeiboog / Spray arc, Warmte-inbreng / Heat input, Neersmeltsnelheid / Deposition rate.
- `wps`: pLMB / pWPS, Essentiële variabele / Essential variable, Geldigheidsgebied / Range of qualification, ISO 9606-1, Lascoördinator / Welding coordinator. (`weldsystem` re-explains the coordinator in a clause; it may define IWE, ISO 3834 and EN 1090-2 as terms.)
- `metallurgy`: t8/5, Martensiet / Martensite, Koolstofequivalent / Carbon equivalent, Tussenlaagtemperatuur / Interpass temperature, Aanloopkleuren / Heat tint.
- `spot`: Laslens / Nugget, Body-in-white, Uitspatten / Expulsion, Stroomdichtheid / Current density, Kappenfrezen / Tip dressing, Stepper.
- `spotwear`: Puntenteller / Weld counter, Kappenwissel / Cap change, Kapafdruk / Tip imprint, Koelwater / Cooling water, Uitlijning / Alignment.
- `spotquality`: Peeltest / Peel test, Beiteltest / Chisel test, Knoop / Button, Grensvlakbreuk / Interfacial fracture, Adaptieve regeling / Adaptive control.
- `spotlobe`: Lasvenster / Weld lobe, Plaatcombinatie / Stack-up, AHSS, Meerpulsprogramma / Multi-pulse schedule.
- `defects`: Porositeit / Porosity, Bindingsfout / Lack of fusion, Waterstofscheur / Hydrogen crack, Voorwarmen / Preheating, Vervorming / Distortion, ISO 5817.
- `inspection`: NDO / NDT, Penetrantonderzoek / Dye penetrant, Ultrasoon onderzoek / Ultrasonic testing, LMB / WPS, LMK / WPQR.
- `ndt`: Uitvoeringsklasse / Execution class (so `weldsystem` must not define it again), Hoekkop / Angle probe, A-scan, Magnetisch onderzoek / Magnetic particle testing, ISO 9712.
- `weldrca`: Reparatiepercentage / Repair rate, ISO 6520-1, Restspanning / Residual stress, Spanningsarmgloeien / Stress relieving, Overlassen / Overwelding.
- `bolting`, `bonding`: as in the deepening pass (Voorspanning / Preload, Aanhaalmoment / Torque, Schroefspindel / Nutrunner, Moment-hoek / Torque-angle, Losbreekmoment / Breakaway torque, Zetting / Settling; Constructielijm / Structural adhesive, Afschuiving / Shear, Afpellen / Peel, Zelfponsende klinknagels / Self-piercing rivets, Clinchen / Clinching).

### Facts and sources (topics 1–3; checked 2026-11-04 by web search)
- **Heat input** Q = k · U · I · 60 / (v · 1000) kJ/mm, k = 0.8 MAG (135), 0.6 TIG (141), 1.0 SAW: EN 1011-1 / ISO/TR 17671-1. Confirmed by SSAB "Welding heat input" (https://websitecdn.ssab.com/en/support/processing/how-to-weld/welding-heat-input), a k-factor table (https://vibromera.eu/?p=100308), and Kemppi on measuring arc energy close to the arc, ISO/TR 18491 (https://kemppi.com/da/blogs/calculation-of-heat-input-in-mig-mag-welding). One secondary source lists TIG at 0.8; the lessons use 0.6, the EN 1011-1 value most sources give.
- **Deposition rate from wire**: arithmetic (π/4·d² × wire speed × 7.85 g/cm³). Stick-out "about 10 to 20 mm", short arc, spray arc and pulsed arc: general GMAW practice (Lincoln Electric GMAW guide), stated qualitatively, with no thresholds.
- **ISO 15614-1:2017 ranges**: a butt test plate with t > 3 mm covers 3 mm to 2t (the lower bound changed from 0.5t in 2004); heat input +25 % with impact requirements, −25 % with hardness requirements: TWI "What's new in ISO 15614-1:2017" (https://twi-global.com/technical-knowledge/faqs/faq-whats-new-in-iso-15614-1-2017), weldnote (https://weldnote.com/en/2017/08/22/iso-15614-1-2017-out-changes-updates.html). ISO 15612 = qualification by adopting a standard welding procedure (ISO catalogue title).
- **ISO 9606-1 validity**: confirmed every 6 months, and it lapses after a break of more than 6 months within the range; revalidated every 2 or 3 years depending on the route. Sources: European Accreditation (https://european-accreditation.org/?p=43283), Kiwa (https://www.kiwa.com/en-nl/services/certification/certification-of-welders-welding-operators-and-brazers/), materialwelding.com (https://materialwelding.com/welder-certificate-validity-as-per-asme-section-ix-aws-d1-1-and-iso-9606/). National schemes vary, so the lesson says "two or three years, depending on the route chosen".
- **ISO 14731** welding coordination, **ISO 14732** welding operators, EN 1090-2 requires coordination from EXC2: as in the deepening pass (inspection lesson).
- **CEV (IIW)** = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15, method A of EN 1011-2 / ISO/TR 17671-2: https://welding.org.au/tools/carbon-equivalent-calculator/, https://www.thefabricator.com/thewelder/article/consumables/consumables-corner-choosing-the-correct-carbon-equivalency-formula. Preheat thresholds and the S355 CEV limits by thickness could not be confirmed from a primary source, so the lessons give no threshold. The example only says 0.46 is "high for S355" and that EN 1011-2 decides from CEV, thickness, hydrogen and heat input.
- **Hydrogen cracking** needs hydrogen + a hard microstructure + stress, and comes late; hold times of 16–48 h (EN 1011-2 Annex A table as reproduced by TWI): https://twi-global.com/technical-knowledge/faqs/faq-which-standards-stipulate-delay-time-before-inspecting-welds. EN 1090-2 Table 23 holds the minimum hold times (GN 6-04, https://steelconstruction.info/images/6/64/GN-6-04.pdf).
- **t8/5** (cooling time 800 → 500 °C), and thick plate cooling faster: EN 1011-2 / SSAB heat input guidance (link above).
- **Austenitic stainless**: expansion about 17 vs 12 µm/m·K (about 40 % more), an interpass maximum around 150 °C is common practice, heat tint removed by pickling. Stated with "about" / "common": rule-of-thumb level.
- **Aluminium**: oxide melts at about 2,050 °C, the metal at 660 °C (handbook values). 6082-T6 HAZ softening factor about 0.5 in Eurocode 9, with 30–50 % loss measured: https://link.springer.com/article/10.1007/s00170-025-15395-0, NTNU thesis https://ntnuopen.ntnu.no/ntnu-xmlui/handle/11250/2565283.
- **Spot nugget 4√t**: AWS D8.1M Table 2 "Minimum acceptable weld size" (the standard is paywalled; secondary: https://ifactoryapp.com/ai-vision-camera/aws-d8-1-weld-quality-compliance-ai-vision-inspection). 5√t is an OEM variant named in the existing spot lesson. It is not confirmed from a primary source, so it stays "some OEMs". 4√0.8 = 3.58; 4√1.5 = 4.90.
- **Peel and chisel testing**: ISO 10447:2022 (scope 0.5–3.0 mm sheet; weld size and failure mode; non-destructive chisel test): https://online.standard.no/en/iso-10447-2022. Averaging two diameters at right angles is common practice in ISO 10447 / AWS D8.1 (clause text not seen; stated as practice).
- **Tip dressing interval** 100–300 welds on galvanised steel: deepening-pass source (RWMA, OEM practice). The stepper rule (constant current density) is arithmetic.
- **Weld lobe**: the definition (the range of current and time that gives an adequate nugget, bounded by expulsion) and galvanised steel giving a narrower lobe: Gedeon & Eagar, Metall. Trans. B 1986 (https://link.springer.com/article/10.1007/BF02657151), MIT papers (https://eagar.mit.edu/publications/Eagar051.pdf). ISO 14327 = procedures for determining the weldability lobe; AWS D8.9 is the test method. No "minimum 1 kA" rule is used because no source was found. The lobe numbers in the spotlobe example are illustrative.
- **Aluminium spot welding**: 2–3× the current of steel at ¼–⅓ of the time (review and TU Delft thesis, https://repository.tudelft.nl/file/File_0299827a-9811-46ab-8c56-735113616a53). TWI: 22–28 kA and 40–100 ms for 1.2 mm, with very rapid electrode wear (https://www.twi-global.com/technical-knowledge/faqs/faq-how-do-i-resistance-spot-weld-aluminium-alloys).
- **EXC → quality level**: EN 1090-2 clause 7.6: EXC1 D, EXC2 C (D for some imperfections), EXC3 B, EXC4 B+. Sources: https://webbut.unitbv.ro/index.php/Series_I/article/download/4255/3306, https://media.sbi.se/2019/11/4_Sveisekontroll_Liv-Eltvik.pdf. The supplementary NDT percentages (EN 1090-2 Table 24) were not confirmed, so the lessons say "the project specification asks 10 % / 20 %" and never attribute a percentage to the standard.
- **UT, RT and MT standards**: ISO 17640 (UT techniques), ISO 11666 (UT acceptance), ISO 10675-1 (RT acceptance), ISO 17635 (general rules; its Annex A links acceptance levels to ISO 5817 levels): https://standards.iteh.ai/catalog/standards/iso/e9d64155-d398-4c09-9f83-eed4a83fa71e/iso-17635-2016. Angle probes at 45/60/70° are standard UT practice. ISO 9712 levels 1–3: level 2 performs and assesses, level 3 writes procedures.
- **ISO 6520-1** defect classification; 401 = lack of fusion.
- **Residual stress up to yield** in restrained welds, and TWI distortion guidance (minimum fillet size, balanced welding): https://twi-global.com/technical-knowledge/faqs/faq-which-welding-techniques-can-be-used-to-minimise-distortion. **Overwelding**: weld metal grows with throat² (arithmetic); AISC "Control costs by avoiding overwelding" (https://www.aisc.org/globalassets/modern-steel/archives/2011/07/2011v07_control_costs.pdf) gives the size of the penalty.

### Numbers recomputed (new lessons)
- weldparams: 1.2 mm wire at 10 m/min → 1.131 mm² × 10,000 = 11.31 cm³ × 7.85 = 88.8 g/min = 5.33 kg/h; an a5 fillet is about 25 mm² → 196 g/m; 196/83 = 2.36 min/m → about 420 mm/min; 29 × 300 × 60 / 420,000 = 1.24 kJ/mm × 0.8 = 0.99 ≈ 1.0. Recall: 0.785 × 8,000 × 7.85 × 60 / 10⁶ = 2.96 kg/h; 28 × 250 × 60 / 350,000 × 0.8 = 0.96. Situation: 1/1.3 = 0.77, √0.77 × 5 = 4.4 mm.
- wps: 2 × 12 = 24; 1.2 × 1.25 = 1.5. Recall: 2 × 15 = 30; 1.4 × 1.25 = 1.75.
- metallurgy: 0.17 + 0.25 + 0.02 + 0.02 = 0.46. Recall: 0.20 + 0.20 + 0.03 + 0.01 = 0.44.
- spotwear: π·3² = 28.27, π·3.25² = 33.18, π·3.75² = 44.18; 9.0 × 1.174 = 10.56 kA (+17 %); 9.0 × 1.563 = 14.07 kA (+56 %). Recall: 8 × 1.44 = 11.52; 20 × 200 = 4,000.
- spotquality: 4√1.5 = 4.90; (5.6+5.2)/2 = 5.4; (5.1+4.5)/2 = 4.8. Recall: 4√0.8 = 3.58; (6.2+5.4)/2 = 5.8.
- spotlobe: 9.0 − 7.6 = 1.4; 9.1 − 6.9 = 2.2; 0.8/2.2 = 36 %; at 8.7 kA → 0.3 below, 1.1 above. Recall: 9.9 − 8.2 = 1.7; 0.5/2.0 = 25 %.
- ndt: 10 % × 160 = 16. Recall: 20 % × 240 = 48.
- weldrca: 62/2,400 = 2.58 % ≈ 2.6 %; 41/62 = 66 %; (5/4)² = 1.5625. Recall: 45/1,800 = 2.5 %; (6/5)² = 1.44.

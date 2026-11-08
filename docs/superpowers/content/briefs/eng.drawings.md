# eng.drawings — Drawings, P&IDs and process control (engineering, track basics, level 2)
Index title: en 'Drawings and control' / nl 'Tekeningen en regeling'. Blurb: en 'Read a technical drawing and a P&ID, and understand how a control loop keeps a process steady.' / nl 'Een technische tekening en een P&ID lezen, en snappen hoe een regelkring een proces stabiel houdt.'
1. `eng.drawings.views` — views, sections, scale, title block, revision; how to find what matters on a drawing.
2. `eng.drawings.gdt` — dimensions and tolerances on drawings, datums, the basic GD&T symbols in plain words.
3. `eng.drawings.pid` — P&ID symbols: lines, valves, pumps, instruments, tag numbers (FT, PT, TIC).
4. `eng.drawings.loop` — a control loop: sensor, controller, actuator, setpoint, process value; open vs closed loop.
5. `eng.drawings.pid_control` — PID control intuition: P, I, D and what an unstable or sluggish loop looks like.
6. `eng.drawings.plc` — PLC, HMI, SCADA, interlocks and safety functions; what to ask before changing a sequence.

## Clarity round (2026-11-04)
Every lesson now has 5 teach blocks (≤ 90 words) and 6 terms, each literally in the teach text, en/nl in the same order; jargon explained in its sentence (orthographic, hatching, isometric, PDM, press brake, S235, CMM, MMC, DN, pneumatic, actuator, normally closed, PSV, as-built, walkdown, legend sheet, faceplate, saturated, cascade, dead time, lag, oscillate, packing, positioner, SCADA, SIL, light curtain, palletiser). Ids, recall order, answer positions and numbers unchanged. Figure eng.drawings.loop untouched; teach block 5 of the loop lesson points at it (Hand / P / PI, disturbance on the outlet), as its build.mjs models.

Terms added: Scale (Schaal), General tolerance (Algemene tolerantie); Maximum material condition (MMC) (Maximum-materiaalvoorwaarde), CMM (3D-meetmachine); PSV (Veiligheidsklep), DCS; Error (Regelafwijking), Open loop (Open sturing); Gain (Versterking), Integral windup (Integrator-windup); Interlock, Bypass (Overbrugging). nl “Referentie (datum)” became “Referentie” (teach says “referentie (datum)”) so the app matches it.

Recomputed and sources:
- 40 × 5 = 200 mm. ISO 2768-1 class m: over 30 up to 120 mm ±0.3 → 50 mm = 49.7–50.3.
- First angle (ISO 128 / ISO 5456-2): top view below front view; third angle (ASME Y14.3) above.
- GD&T: round zone around ±0.1 square: diagonal 0.283 → Ø0.28; area π·0.1414² = 0.0628 vs 0.04 → +57 %. Example √(0.12² + 0.09²) = 0.15 → Ø0.30; MMC bonus 10.25 − 10.20 = 0.05 → 0.35. Recall √(0.06² + 0.08²) = 0.10 → Ø0.20. Datums 3-2-1 points (ASME Y14.5 / ISO 5459). Rule #1 envelope (ASME Y14.5-2018 §5.8) vs independency principle (ISO 8015:2011).
- P&ID: ISA 5.1-2009 letters; DN nominal size (ISO 6708); 4–20 mA standard signal (IEC 60381-1). LAH 0.8 × 20 = 16 m³.
- Loop: 75 − 72.4 = 2.6; 80 − 76.5 = 3.5; 72.5 − 71.2 = 1.3. HTST pasteurisation 72 °C / 15 s (EU Reg. 853/2004). “About a third of loops in manual or performing badly”: Ender 1993 (≈30 % in manual), Desborough & Miller 2002 (Honeywell survey of 26,000 loops) — worded as “around a third … manual or performing badly”.
- PID: 2 × 5 = 10 %; most industrial loops PI (Åström & Hägglund, > 90 % PI); Ziegler-Nichols aims at quarter-amplitude decay (aggressive); lambda tuning (IMC) common in process industry.
- PLC: 28,800 / 25 = 1,152; 28,800 / 28 = 1,028.6 → 123.4 extra. ISO 13849-1 PL a–e; IEC 62061 (machinery SIL), IEC 61511 (process SIL). HVBG report “Manipulation von Schutzeinrichtungen an Maschinen” (2006): protective devices manipulated in about 37 % of cases — worded as “about a third”; uncertain how the share was defined (survey), flagged for review.

## v13 topics (2026-11-08): 4 topics × 4 levels

| Topic (id) | 1 Basis | 2 Werkkennis | 3 Gevorderd | 4 Expert |
|---|---|---|---|---|
| Reading a technical drawing (`draw`) | `views` (existing) | `assembly` (new): ISO 128 line types (hidden, centre, phantom), part vs assembly drawing, balloons and item numbers, parts list vs ERP BOM, general notes | `callouts` (new): thread callouts (M10 coarse 1.5, 6H/6g, tap drill ≈ nominal − pitch), counterbore/countersink, surface texture symbol (ISO 21920-1), ISO 2553 weld symbols, a vs z | `change` (new): ECR/ECN, release states, effectivity, interchangeability (revision vs new part number), MBD/PMI (ASME Y14.41, ISO 16792), FAI (AS9102, PPAP), delta FAI |
| Tolerances and GD&T (`tol`) | `dims` (new): dimension symbols, reference dimensions, four tolerance notations, ISO 2768-1 classes, chain vs baseline dimensioning, fit codes | `gdt` (existing) | `gdtsymbols` (new): ISO 1101 families, ASME 2018 dropping concentricity/symmetry, zone shapes, circular vs total runout and FIM, profile of a surface (UZ/U), modifiers Ⓛ Ⓔ Ⓟ Ⓕ | `gps` (new): ISO 8015 vs ASME Y14.5, independency vs envelope (Rule #1), ISO 2768-2 withdrawn → ISO 22081, functional gauge and virtual condition, ISO 14253-1 decision rule, settling disputes |
| P&IDs, schematics and the control system (`schematics`) | `pid` (existing) | `plc` (existing, worked example kept) | `electrical` (new): circuit vs wiring diagram, IEC 60617 symbols, IEC 81346 reference designations (= + −), NO/NC contact numbers (13-14, 11-12, A1-A2, 95-96), cross-references, start–stop self-holding, 85–110% coil voltage | `sis` (new): protection layers, SIS/SIF (IEC 61511), SIL bands as risk reduction factor, C&E matrix, fail positions FC/FO/FL (ISA-5.1), de-energise-to-trip, 2oo3 voting, proof test, bypassed trips |
| Control loops and PID (`control`) | `loop` (existing, figure eng.drawings.loop kept) | `pid_control` (existing) | `tuning` (new): bump test (process gain, dead time, time constant), lambda tuning for PI, Ziegler–Nichols ultimate gain with caveats, proportional band and integral units, autotuners | `loopaudit` (new): loop audit metrics, rank by value, diagnosis by pattern (manual test, plant-wide oscillation, valve sizing), structure vs tuning (Smith predictor, feedforward, cascade, MPC), sustaining with a loop health KPI and owner |

Why this split: the brief's suggested topics, with the six existing lessons at levels 1–2 (views, pid, loop at 1; gdt, plc, pid_control at 2), so every existing worked example stays valid. PLC sits in the schematics topic: after the P&ID comes the control system, then its wiring (electrical schematics) and its safety logic (SIS, C&E). The v14 film `eng.drawings.reading` (views, gdt) keeps both lesson ids and their example numbers.

Existing lessons: ids, recall order, answer positions and numbers unchanged (pinned in `tests/fixtures/v13-eng.drawings-recall-keys.json`, built from the files before this change). Wording changes only:
- Giveaways removed (correct option was the unique longest): views r1 r2 r3, gdt r1 r2 (answer text shortened), pid pre r1, loop r1 r2, pid_control pre r2 r3 (nl), plc pre r1 r2 r3 (answer texts shortened), and nl equivalents.
- Own hints on every numeric recall question; none contains the answer (validator check).
- Shared definitions aligned word for word: General tolerance, Datum (nl Referentievlak), Feature control frame, Position tolerance, MMC (from Quality basics); CMM (from Machining); PLC, HMI, Interlock (eng.lines.plc), Safety function (eng.lines.safety), SCADA (eng.ot); Dead time, Time constant (eng.process.loops); Thread pitch / Spoed (eng.joining.bolts). The gdt terms “Maximum material condition (MMC)” → “MMC” and nl “Referentie” → “Referentievlak”, “3D-meetmachine” → “CMM” to match. Tagnummer kept as eng.process uses it.
- Pointers instead of repeats: tolerance, spec limits and stack-up → Quality basics; H7 and Ra by process → Machining; weld size and cost → Welding and joining; PLC scan cycle and machine guarding → Lines and automation; contactor → Motors, drives and fluid power; NEN 3140 → Safety; guard band → Measurement and SPC in depth; PFD/block diagrams, time constant, dead time, manual-mode survey, squeeze and shift, cascade/ratio/feedforward, averaging level control → Process engineering basics; PPAP → Quality basics.
- nl parts list is “Onderdelenlijst”, because eng.ot already defines “Stuklijst” as the ERP bill of materials; the teach uses both.
- Index blurb names the four topics.

Answer positions (pre + recall MC, en = nl): 14 / 14 / 14 / 14. Correct option never the unique longest (script check en and nl). Length rank of the correct option across 56 MC: en 1(tied) 3 · 2nd 19 · 3rd 25 · 4th 9; nl 1 · 22 · 20 · 13.

Facts and sources (checked 2026-11-08):
- ISO 2768-2:1989 withdrawn 2021, replaced by ISO 22081:2021 (SIS listing; genorma.com/en/standards/iso-22081-2021; wevolver.com “ISO 2768 general tolerances … current status”). ISO 2768-1 still current. Class m/f values from ISO 2768-1 tables.
- ISO 21920-1:2021 cancels and replaces ISO 1302:2002 for indicating surface texture; the drawing now fixes the measuring conditions (BSI knowledge page for BS EN ISO 21920-1:2022; qualitymag.com “Evolving roughness standards”).
- ASME Y14.5-2018 removed concentricity and symmetry (Mitutoyo/Salsbury Y14.5-2018 deck; gdtseminars.com “The new ASME Y14.5-2018 standard”); ISO 1101 keeps them. Rule #1 (ASME Y14.5-2018) vs independency principle (ISO 8015:2011), as in the clarity round.
- ISO 5456-2 first/third angle; ISO 128 line types; ISO 2553 weld symbols (dashed identification line, a = throat, z = leg, z ≈ a·√2); AWS A2.4 (below the line = arrow side). Standard textbook content, not separately fetched.
- MBD: ASME Y14.41, ISO 16792; FAI: AS9102. Effectivity and interchangeability rule (form-fit-function → revision, else new part number): common industry practice, taught hedged (“the common rule … companies write this down”).
- IEC 60617 symbols, IEC 81346 aspects (= function, + location, − product) and letter codes (Q contactor/switching, M motor, K relay); terminal numbering 13-14 NO, 11-12 NC, A1-A2, 95-96 (EN 50005 / IEC 60947-1 practice). Letter codes taught hedged (“common letters … older drawings use other codes”); the search found only a secondary source for Q vs K.
- Contactor closing between 85% and 110% of rated control voltage: IEC 60947-1 §7.2.1.2 as applied by IEC 60947-4-1 (US patent text quoting it; ENEC type-test instruction for IEC/EN 60947-4-1 Ed 3.1; ABB catalogue). Taught as “IEC 60947 expects”.
- IEC 61511 SIL bands (low demand: SIL 1 RRF 10–100, SIL 2 100–1,000, SIL 3 1,000–10,000); ISA-5.1 fail positions FC/FO/FL; C&E matrix and 2oo3 voting: standard process-safety practice.
- Lambda/IMC tuning for PI: Kc = τ / (Kp(λ + θ)), Ti = τ (Skogestad, NTNU SIMC/IMC course slides; Control Engineering “Fundamentals of lambda tuning”: λ ≥ dead time, setpoint change completes in about 4λ without overshoot). λ “often one to three time constants” is practitioner guidance, hedged with “often”.
- Ziegler–Nichols ultimate gain PI: Kc = 0.45 Ku, Ti = Pu/1.2 (controlguru.com; Haugen & Lie, MIC 2013); quarter-amplitude decay aim; “poor choice for production processes” (controlguru.com article of that name).
- ISO 14253-1 decision rule (conformity proven only inside the spec reduced by U): taught with a pointer to the guard band in eng.spc.
- Loop audit metrics and value ranking: practitioner content; the Desborough & Miller survey is cited in Process engineering basics, not repeated.

Recalculations (new lessons, script-checked):
- assembly: example 60 × 4 = 240 screws; r0 6 × 45 = 270.
- callouts: M8 tap 8 − 1.25 = 6.75 → Ø6.8; example z6 → a = 6 / 1.414 = 4.24; (6 / 4.24)² = 2.0. r0 12 − 1.75 = 10.25; r1 8 / 1.414 = 5.66 ≈ 5.7.
- change: example (1,800 + 600) / 400 = 6 weeks. r0 (1,500 + 300) / 360 = 5; r1 1,500 × 1.40 = 2,100.
- dims: example 160 under m (120–400) ±0.5; chain 3 × 0.1 = ±0.3. r0 45 + 0.3 = 45.3; r1 4 × 0.05 = 0.2.
- gdtsymbols: example 0.021 − (−0.012) = 0.033 > 0.03. r0 0.014 + 0.008 = 0.022; r1 0.6 / 2 = 0.3.
- gps: example virtual condition 10.2 − 0.3 = 9.9; 10.20 − 0.32 = 9.88 (no fit); 10.28 − 0.36 = 9.92, allowed 0.30 + 0.08 = 0.38. r0 12.0 − 0.2 = 11.8; r1 50.05 − 0.01 = 50.04.
- electrical: r0 19.2 / 24 = 80%.
- sis: example 6 × 3 × 12 = 216 t. r0 1 / 0.004 = 250; r1 4 × 5 × 8 = 160 t.
- tuning: example Kp = (7.5/150 = 5%) / 5% = 1.0, θ 20 s, τ 80 − 20 = 60 s, Kc = 60 / (1 × 80) = 0.75, Ti 60 s, PB 133%, 4λ = 240 s. r0 6 / 4 = 1.5; r1 90 / (2 × 100) = 0.45.
- loopaudit: example 58 / 240 = 24.2%; 4.0 − 2 × 0.3 = 3.4%; 0.6% × 10 t/h = 60 kg/h. r0 75 / 300 = 25%; r1 5.0 − 2 × 0.25 = 4.5%.

Uncertain: Dutch term choices — Onderdelenlijst (parts list), Kamerboring (counterbore), A-maat (throat), Ingangsmoment (effectivity; many Dutch sites just say effectivity), Eerste-artikelinspectie (FAI), Parallelle maatvoering (baseline dimensioning, the ISO 129 Dutch name), Totale wijzeruitslag (FIM), Stroomloopschema (circuit diagram), Instrumenteel beveiligingssysteem / Instrumentele beveiligingsfunctie (SIS/SIF; Dutch sites often keep SIS/SIF), Periodieke functietest (proof test), Staptest (bump test), Regelkwaliteitsbewaking (control performance monitoring). The 85% coil threshold comes via secondary sources quoting IEC 60947-1. eng.lines’ Interlock definition (“a rule in the PLC”) is narrower than the process interlocks taught in `plc` and `sis`; adopted word for word for consistency, flagged for review.

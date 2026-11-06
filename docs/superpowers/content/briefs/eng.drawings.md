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

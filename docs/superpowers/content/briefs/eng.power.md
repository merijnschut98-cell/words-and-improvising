# eng.power — Motors, drives and fluid power (engineering, track basics, level 2, WORKED examples)
Index title: en 'Motors, drives and fluid power' / nl 'Motoren, aandrijvingen en perslucht'. Blurb: en 'kW and kWh, induction motors, starters and drives, compressed air, hydraulics and the plant’s energy profile.' / nl 'kW en kWh, asynchrone motoren, aanloop en regelaars, perslucht, hydrauliek en het energieprofiel van de fabriek.'

Why (general engineering basics): motors, compressed air and hydraulics move almost everything in a plant, and energy (kW vs kWh, base load, contracted grid capacity) is now a board topic in the Netherlands because of grid congestion. It links the manufacturing modules to the grid track (eng.gridbasics congestion). Affinity laws for pumps live in eng.fluids.speed; this module covers the electrical and fluid-power side.

1. `eng.power.basics` — kW vs kWh, efficiency chains, three-phase power P = √3·U·I·cos φ (400 V, 50 Hz), power factor, nameplate = shaft output.
2. `eng.power.motors` — induction motor, synchronous speed 120f/p, slip 1–5%, P (kW) = T·n/9,550, IE classes and EU minimums, 10 °C rule for insulation.
3. `eng.power.drives` — DOL (6–8 × inrush), soft starter and star-delta (reduced torque), VFD (speed, full torque at low speed, harmonics, bearing currents), servo (position feedback).
4. `eng.power.air` — ~10% useful work, leaks 20–30%, ~7% energy per bar, weekend leak test, FRL, inappropriate use.
5. `eng.power.hydraulics` — F = p·A (1 bar = 0.1 N/mm²), pump makes flow and load makes pressure, valves, speed = Q/A, ISO 4406 cleanliness, heat, accumulators and injection injuries.
6. `eng.power.energy` — load profile (15-minute data), base load, kWh vs contracted transport capacity (kW) in NL, kWh per tonne, order of attack, electrification vs congestion.

Facts and sources
- Three-phase power, power factor, nameplate conventions: IEC 60034-1 (rating = mechanical output); Hughes & Drury, *Electric Motors and Drives*, 5th ed.
- Synchronous speed, slip, torque–power relation (9,550 constant for kW, Nm, rpm): Hughes & Drury; ABB *Low voltage motors – Motor guide*.
- Efficiency classes IE1–IE5: IEC 60034-30-1 / IEC TS 60034-30-2; EU Ecodesign Regulation (EU) 2019/1781: IE3 for 0.75–1,000 kW from 1 July 2021; IE4 for 75–200 kW from 1 July 2023.
- Insulation life roughly halves per 10 °C (Arrhenius rule of thumb): IEEE Std 1/IEC 60085 thermal class background; EASA / AEMT *Effect of Repair/Rewinding on Motor Efficiency*.
- DOL inrush 6–8 × rated current; soft starters ~3–4 ×; reduced starting torque: ABB *Technical guide: Soft starter handbook*; Siemens *SIRIUS* soft starter manual.
- VFD side effects (harmonics, bearing currents): ABB *Technical Guide No. 5: Bearing currents in modern AC drive systems*; ABB *Technical Guide No. 6: Guide to harmonics*.
- Compressed air: only about 10–15% of input energy delivered as useful work; leaks 20–30% in unmanaged systems; +2 psi ≈ +1% energy (≈ 7% per bar): US DOE / Compressed Air Challenge, *Improving Compressed Air System Performance: A Sourcebook for Industry*, 3rd ed.
- Hydraulics: Parker *Industrial Hydraulic Technology*; Bosch Rexroth *Hydraulics Trainer* Vol. 1; ISO 4406:2021 cleanliness code; contamination as the leading cause of hydraulic failure (commonly cited 70–80%); fluid-injection injuries: HSE guidance on hydraulic hose safety.
- Dutch grid tariffs for large connections (contracted transport capacity in kW and monthly kW max): Tarievencode Elektriciteit (ACM) and grid operator tariff sheets (Liander, Stedin, Enexis); congestion background as in eng.gridbasics.

Numbers in questions and examples (checked): 15 × 8 = 120 kWh; 22 × 4,000 = 88,000 kWh; 1.732 × 400 × 50 × 0.8 = 27.7 kW; 0.95 × 0.90 = 85.5%; 120 × 50 / 6 = 1,000 rpm; (1,500 − 1,440)/1,500 = 4%; 11 × 9,550 / 1,450 = 72.4 Nm; 7 × 50 = 350 A; 25% × 12 = 3 m³/min; 2 × 7% = 14%; 15 N/mm² × 2,000 = 30 kN; 0.0005 / 0.01 = 50 mm/s; 300 × 100 = 30,000 kWh; 45,000 / 300 = 150 kWh/t; pre: 20 N/mm² × 7,854 = 157 kN.

Uncertain / simplified: "about 10%" useful work for compressed air is a widely cited rule of thumb (DOE gives 10–15%); the leak example ignores the compressor’s unloaded power (stated in the text); IE1/IE3 efficiencies in the motor example are typical values for a 30 kW 4-pole motor.

## Clarity round (2026-11-06)
Every lesson now has 5 teach blocks (≤ 90 words) and 6 terms, en and nl in the same order; each term appears literally (or as a simple plural/inflection) in its lesson’s teach text and is defined once in the module. Level 2, so basics are re-explained briefly where used: kilowatt, kilowatt-hour, phase and neutral, 50 Hz, stator, rotor, poles, rated current, inrush current, star and delta, harmonics, bearing currents, encoder, loaded running, condensate, bore, flow, breathers, grid operator, quarter-hour peak. Examples and situations explain hydraulic power, crusher, trip, unloaded running, chillers. The .nl files add the English word once for important unlisted words: vermogen (power), blindvermogen (reactive power), nominaal vermogen (rated power), stroomtang (clamp meter), koppel (torque), herwikkelen (rewinding), inschakelstroom (inrush current), affiniteitswetten (affinity laws), harmonischen (harmonics), perslucht (compressed air), debiet (flow), ontluchters (breathers), breker (crusher), koelmachines (chillers).

Term changes (old combined terms split, so each links): basics “kW and kWh” → kW + kWh, “Power factor (cos φ)” → Power factor (nl Arbeidsfactor), + Nameplate/Typeplaatje; motors + Rotor, + Insulation class/Isolatieklasse; drives “DOL” → Direct on line (DOL), + Contactor/Magneetschakelaar, + Star-delta starter/Ster-driehoekschakeling; air + Heat recovery/Warmteterugwinning, + Network pressure/Netdruk, + Dryer/Droger; hydraulics + Directional valve/Stuurventiel, + Injection injury/Injectieletsel; energy + Monthly peak/Maandpiek, + Grid congestion/Netcongestie.

New facts and sources
- Three-phase 400/230 V, 50 Hz: IEC 60038. Typical full-load power factor 0.8–0.9 for induction motors; capacitor banks for correction: ABB *Technical Guide No. 8* / Schneider *Electrical Installation Guide*, ch. L. Many motors run well below rating (half or less): US DOE *Premium Efficiency Motor Selection and Application Guide* (2014) and the DOE motor-system market assessment.
- Insulation class F = 155 °C (IEC 60085); halving of insulation life per ~10 °C (Montsinger’s rule, an Arrhenius approximation; IEEE Std 117/IEC 60216 ageing tests). Stated as a rule of thumb.
- EU Regulation 2019/1781 (amended by 2021/341): IE3 for 0.75–1,000 kW from 1 July 2021; IE4 for 75–200 kW (2-, 4-, 6-pole) from 1 July 2023. 1% × 75 kW × 6,000 h = 4,500 kWh.
- DOL starting current 6–8 × rated; star-delta gives one third of the DOL line current and torque: ABB *Softstarter Handbook*; Siemens motor starting guides.
- VFD: affinity laws stated consistently with eng.fluids (power ∝ speed³; 0.8³ = 0.512, “about half”; real savings smaller). VFD losses of a few percent (typically 2–3 %): ABB *Technical Guide No. 4*. Harmonics: ABB *Technical Guide No. 6*; bearing currents: ABB *Technical Guide No. 5*.
- Compressed air: overall efficiency around 10 % and leaks 20–30 % in unmanaged plants: US DOE / Compressed Air Challenge, *Improving Compressed Air System Performance: A Sourcebook for Industry*. Roughly 7 % energy per bar (range 6–8 % quoted): Carbon Trust CTV050 *Compressed air*; Atlas Copco *Compressed Air Manual*. Unloaded compressors still draw power (often 25–35 % of full load): same sources.
- ISO 4406:2021: three codes for particles ≥ 4, ≥ 6 and ≥ 14 µm(c) per millilitre, each code step about a factor 2. Oil life roughly halving per 10 °C above ~60 °C: common Arrhenius rule of thumb (Noria; Parker *Hydraulic Fluid Power*), stated as a rule of thumb. Injection injuries possible at modest pressure (often cited from ~7 bar): HSE / Parker safety guidance.
- Dutch tariffs: large-consumer connections pay a kW-contract charge and a kW-max charge on the highest quarter-hour of the month (ACM *Tarievencode Elektriciteit*). Flexible / time-bound transport rights introduced by ACM code decisions in 2024 (“tijdsduurgebonden transportrecht”); text says “some customers”.

Recalculated: 15 × 8 = 120 kWh; 0.93 × 0.95 × 0.70 = 0.618; 1.732 × 400 × 30 × 0.85 = 17,666 W; 120 × 50 / 4 = 1,500 rpm; 15 × 9,550 / 1,460 = 98.1 Nm; 20 N/mm² × 7,854 mm² = 157,080 N. All recall numbers, ids and answer positions unchanged; nothing changed in figures (the module has none).

Uncertain: “most common” class F is a market observation, not a standard; the 7 % per bar and 10 % useful-work figures are rules of thumb; the 60 °C oil threshold depends on the oil grade.

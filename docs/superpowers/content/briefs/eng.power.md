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

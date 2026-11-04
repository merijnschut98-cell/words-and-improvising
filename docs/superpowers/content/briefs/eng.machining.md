# eng.machining — Machining (engineering, track discrete, level 1)
Index title: en 'Machining' / nl 'Verspanen'. Blurb: en 'Turning, milling, drilling and CNC: how metal parts are cut and what makes them slow or scrap.' / nl 'Draaien, frezen, boren en CNC: hoe metalen onderdelen worden gemaakt en wat ze traag of afkeur maakt.'
1. `eng.machining.processes` — turning, milling, drilling, grinding; which shapes come from which.
2. `eng.machining.cnc` — CNC basics: axes, G-code idea, programs, zero points, why first-off parts are checked.
3. `eng.machining.cutting` — cutting speed, feed, depth of cut; cycle time from them; trade-offs.
4. `eng.machining.tools` — tool wear and tool life, coolant, tool changes, why tool management drives uptime.
5. `eng.machining.fixtures` — fixtures and clamping, setup time, workholding errors as a scrap cause.
6. `eng.machining.quality` — surface finish, measuring (calipers, CMM), typical defects and their causes.

Deepened 2026-11-04: every technical term explained at first use (incl. pre questions, options, examples, said lines), 4–5 teach blocks per lesson, 6 terms per lesson. Recall questions unchanged in what they test and in order.

## Numbers, sources and recalculations

### Tolerances and fits (ISO 286-1/-2)
- IT6 for 30–50 mm = 16 µm → Ø35 k6 = +0.002/+0.018 mm (16 µm band). IT6 for 18–30 mm = 13 µm → Ø30 h6 = 29.987–30.000. IT7 for 30–50 mm = 25 µm → Ø40 H7 band 0.025 mm. Source: ISO 286-2 tables (e.g. engineeringtoolbox.com "ISO tolerances for holes/shafts").
- Turning ±0.02 mm, grinding ±0.005 mm or better: typical achievable IT7–IT8 vs IT5–IT6 at these sizes (Kalpakjian & Schmid, Manufacturing Engineering and Technology, process capability chart).
- Drilled holes come out 0.02–0.1 mm oversize, reamer stock 0.1–0.3 mm on diameter: Sandvik Coromant hole-making guide; Machinery’s Handbook (reaming allowances).
- Deep-hole risk beyond ~5 × D for standard twist drills without through-coolant: Sandvik drilling guide (twist drills 3–5 × D standard). Recall: 60 / 8 = 7.5 × D.

### Cutting data (Sandvik Coromant Training Handbook / turning catalogue)
- Carbide Vc: steel 150–300, stainless 100–200, aluminium 300–1,000+, titanium 40–80 m/min; HSS in steel ~30 m/min.
- n = Vc × 1000 / (π D): Ø50 at 200 → 200,000 / 157.08 = 1,273 rpm. Recall: 150,000 / (π × 40 = 125.66) = 1,194 rpm.
- Constant surface speed (G96) with max-rpm clamp (G50/G92 on Fanuc): lathe speeds up towards the centre.
- Q = Vc × ap × f (cm³/min) — Sandvik formula.
- Taylor V·T^n = C with n ≈ 0.25 for carbide: 1.2^(1/0.25) = 2.07 → +20% speed ≈ half tool life; 1.3^4 = 2.86 → +30% speed leaves 35% of tool life ("more than half" cut).
- Example: n = 220,000 / 188.5 = 1,167 rpm; 0.3 × 1,167 = 350 mm/min; 200/350 = 0.571 min = 34.3 s. f 0.4 → 467 mm/min → 0.428 min = 25.7 s; saving 8.6 s × 3 passes × 5,000 = 129,000 s = 35.8 h ≈ 36 h.
- Recall pass time: 0.2 × 1,000 = 200 mm/min; 100/200 = 0.5 min = 30 s.

### CNC
- Spindle motors 10–40 kW typical for machining centres/lathes (e.g. Haas VF-2 22.4 kW, DMG Mori CMX 50 U 13–25 kW).
- G00/G01/G02/G03/M03/M06/M08/G54: standard ISO 6983 / Fanuc codes.
- Spindle crash cost €5,000–€30,000 plus days–weeks downtime: spindle rebuild quotes typically €5k–€20k, replacement spindles on 5-axis up to €30k+ (spindle service companies, e.g. GTI Spindle, Setco published ranges). Rounded range, stated as "can cost".
- Example: 121.43 − 112.43 = 9 mm; 200 × €35 = €7,000. Recall: 149 × €28 = €4,172.

### Tools and coolant
- Tooling ≈ 3% of part cost: Sandvik Coromant ("cutting tools represent about 3% of manufacturing cost"), widely quoted.
- Emulsion 5–8%, refractometer check; anaerobic bacteria cause rotten-egg (H2S) smell after standstill ("Monday morning smell"): coolant suppliers (Blaser, Fuchs technical notes).
- High-pressure through-tool coolant ~70 bar: Sandvik / machine builders' standard HP option (70 bar / 1,000 psi).
- Example: €12 / 4 = €3; €3/80 = €0.0375; €3/100 = €0.03; diff €0.0075 × 1,000 = €7.50. Break: €45 + 0.5 h × €90 = €90. Recall: €16 / 4 / 50 = €0.08.

### Fixtures
- Cutting share 30–50% in job shops: commonly cited spindle utilisation figures (e.g. MachineMetrics / Memex benchmark reports: average CNC utilisation ~30–40%).
- Zero-point systems repeat within 0.005 mm (Schunk VERO-S, Lang Quick•Point: repeatability < 0.005 mm).
- Example: 90 → 25 min = 65 min × 8 = 520 min = 8.67 h.

### Quality and measuring
- Ra ranges per process: ISO 1302 / Machinery’s Handbook surface roughness chart.
- Caliper reads 0.01, real ±0.02–0.03 mm (DIN 862 max permissible error ±0.02–0.03 for 0–150 mm); micrometer 0.001 mm (DIN 863). Ten-to-one rule (gauge 10× finer than tolerance): common metrology rule of thumb.
- Linear expansion: steel 11.5 × 10⁻⁶ /K, aluminium 23 × 10⁻⁶ /K. 200 mm × 0.0115 × 10 / 1000 = 0.023 mm. Ø30: 30 × 0.0115 × 15 / 1000 = 0.0052 mm → 29.990 − 0.005 = 29.985 (below 29.987). Recall: 0.5 × 0.023 × 10 = 0.115 mm. Reference temperature 20 °C: ISO 1.

## v10 topics (added 2026-11-04)

Six topics, four levels each (1 Basis, 2 Werkkennis, 3 Gevorderd, 4 Expert). `levels[i]` in the index is level i + 1. Examples are `worked` at levels 1–2 and `faded` at levels 3–4, by the lesson's level in its topic (the validator reads the level from `meta.topics`). Integrator rulings for this lane: teach 3–5 blocks of ≤ 90 words with `\n\n` paragraphs; `terms` 2–6, en and nl in the same order and count, each term whole-word in its own lesson's teach text; a term is defined once per module, at the lowest level that uses it; in the nl text an important technical word that is not in that lesson's terms gets its English word in parentheses once; no Dutch in the en files.

| Topic (id) | Basis | Werkkennis | Gevorderd | Expert |
|---|---|---|---|---|
| Draaien `turning` | `processes` (existing) | `cutting` (existing, lathe figure) | `turnfinish` (new) | `turncell` (new) |
| Frezen `milling` | `mill` (new) | `millfeeds` (new) | `millstrategy` (new) | `fiveaxis` (new) |
| Boren `drilling` | `drill` (new) | `holes` (new) | `deephole` (new) | `holequality` (new) |
| CNC-programma `cnc` | `cnc` (existing) | `gcode` (batch 2) | `offsets` (batch 2) | `cam` (batch 2) |
| Gereedschap `tooling` | `toolbasics` (batch 2) | `tools` (existing) | `toollife` (batch 2) | `toolcost` (batch 2) |
| Opspanning en meten `workholding` | `fixtures` (existing) | `quality` (existing) | `metrology` (batch 2) | `capable` (batch 2) |

Until batch 2 lands, the index lists only existing lessons in topics 4–6 (`cnc: [cnc]`, `tooling: [tools]`, `workholding: [fixtures, quality]`). Note for batch 2: `tools` must end up at index 1 of `tooling`.

### Scope per level (topics 1–3)
- `processes`: what turning, milling, drilling, grinding are; which shapes come from which (unchanged content).
- `cutting`: Vc, f, ap; rpm from Vc and D; time per pass; trade-offs (unchanged content).
- `turnfinish`: Ra ≈ f²/(32·r) × 1000; feed squared; chip breakers and the feed/depth window; slenderness L/D, tailstock and steady rest. Faded: work back the feed for a target Ra, and the nose-radius alternative.
- `turncell`: turn-mill centre, driven tools, C-axis, Y-axis, sub-spindle, bar feeder, complete machining, unmanned running; break-even hour rate against two machines. Faded.
- `mill`: machining centre, magazine and tool changer, vertical vs horizontal, X/Y/Z, face mill vs end mill, pocket, contour, inside corner radius = cutter radius. Worked: a pump cover program.
- `millfeeds`: n from Vc and D, fz, vf = fz·z·n, ap and ae, Q = ap·ae·vf/1000; raising S without F lowers fz. Worked: roughing a pocket.
- `millstrategy`: climb vs conventional; chip thinning hex = 2·fz·√(D·ae − ae²)/D; trochoidal/adaptive milling. Faded: correct fz for chip thinning.
- `fiveaxis`: trunnion table, 3+2 vs simultaneous, when it pays (setups, position between sides, CAM, programmers). Faded: hours saved per year.
- `drill`: twist drill, flute, 118° point angle, drill wander, centre/spot drill, rpm for HSS and carbide drills, through vs blind hole. Worked: four bolt holes, HSS vs carbide time.
- `holes`: ISO 286 H7, fits H7/g6 and H7/p6, reaming (drill 9.8, ream 10), boring head, tap drill = D − pitch, tapping. Worked: dowel and threaded holes.
- `deephole`: L/D as the deciding number, peck drilling (G83), through-spindle coolant, pilot hole, gun drill, chip evacuation. Faded: pecking HSS vs through-coolant carbide, hours a year.
- `holequality`: position tolerance (ISO 1101), theoretically exact dimension, position = 2·√(dx² + dy²), radius vs diameter trap, perpendicularity, causes of drift (wander, overhang, fixture, offset, thermal growth), functional gauge, Cpk cross-reference to `eng.quality`. Faded: one hole's position and the afternoon drift.

### Facts and sources (topics 1–3), verified 2026-11-04
- Ra ≈ f²/(32·r) (theoretical; Rt = f²/(8·r) ≈ 4 × Ra); real finish up to about 2 × worse through wear and chatter; f 0.2, r 0.8 → 1.56 µm. Sources: US patent 6,733,365 "Method and apparatus for hard machining" (https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/6733365); Vibromera turning surface finish calculator (https://vibromera.eu/calculators/turning-surface-finish). Recalcs: 0.0625/25.6 = 2.44 µm; √(0.8 × 32 × 0.8/1000) = 0.143; 0.14²/25.6 = 0.77 µm; 0.18²/38.4 = 0.84 µm.
- Long, snarling chips come from low feed and shallow depth of cut; fixes: more depth or feed, a chip-breaking geometry, a smaller nose radius: Sandvik Coromant troubleshooting turning (https://www.sandvik.coromant.com/en-us/knowledge/general-turning/troubleshooting-turning).
- Slender parts: support from L/D about 2.5–3; chuck and tailstock to about 6:1; steady rest beyond: Canadian Metalworking, "Finding the right support in long part turning" (https://cimindustry.com/canadianmetalworking/article/metalworking/finding-the-right-support-in-long-part-turning) and anebonmetal L/D guidance. Sources differ, so the lesson says "about" (rule of thumb).
- n = Vc·1000/(π·D), vf = fz·z·n, Q = ap·ae·vf/1000 (cm³/min): Sandvik Coromant milling formulas (https://www.sandvik.coromant.com/en-us/knowledge/machining-formulas-definitions/milling-formulas-definitions; the formulas are images on that page), Machining Doctor table feed (https://www.machiningdoctor.com/glossary/table-feed/). Recalcs: 150,000/37.70 = 3,979 rpm; 0.05 × 3 × 3,979 = 597 mm/min; 10 × 3 × 597/1000 = 17.9 cm³/min; 24/17.9 = 1.3 min.
- Chip thinning hex = 2·fz·√(D·ae − ae²)/D; matters below ae ≈ D/2: Machining Doctor chip thinning calculator (https://www.machiningdoctor.com/calculators/chip-thinning-calculator/); ISCAR titanium machining guide p. 25 (https://iscar.co.za/Catalogs/flipview/reference-user-guides/machining_titanium_05_2019/files/basic-html/page25.html). Recalcs: D10, ae1 → 2 × 3/10 = 0.6; 0.05/0.6 = 0.083; 0.0833 × 4 × 6,000 = 2,000 mm/min; D20, ae2 → 2 × 6/20 = 0.6.
- Climb milling: chip thick to thin, less heat and better finish; conventional on machines with lead-screw backlash: MSC Direct "Down milling vs. up milling" (https://www.mscdirect.com/knowledge-center/articles/down-milling-vs-milling); Washington University engineering machine shop (https://engmachineshop.wustl.edu/?p=2394).
- Trochoidal/dynamic milling: radial engagement about 5–20 % of D (sources vary; lesson says about 5–15 %), large axial depth, higher feed, longer tool life: CTE "Have you tried trochoidal milling?" (https://ctemag.com/?p=98322); MSC Direct trochoidal milling (https://mscdirect.com/betterMRO/msc-generate-pdf/2546).
- HSS twist drill point angle 118°: MMC Carbide "Point angle" course (https://mmc-carbide.com/permanent/courses/68/point-angle---cutting-edge.html); threadingtoolsguide.com twist drills. A 140° carbide point was NOT confirmed and is not used.
- Drill cutting speeds in mild steel: HSS 20–30 m/min, solid carbide 80–120 m/min: AIMS Industrial cutting speeds reference (https://aimsindustrial.com.au/blogs/product-guides/cutting-speeds-feeds-reference); ISCAR solid carbide drill data (https://www.iscar.com/eCatalog/Ecat/datafileENM/INFO/4714.pdf). Recalcs: 25,000/(π × 8) = 995; 25,000/(π × 10) = 796; 0.15 × 995 = 149 mm/min, 20/149 = 8 s; 100 m/min → 3,979 rpm, 597 mm/min, 2 s. The feed 0.15 mm/rev is stated as an assumption.
- ISO 286 IT7: 6–10 mm 15 µm, 10–18 mm 18 µm, 18–30 mm 21 µm, 30–50 mm 25 µm; H7 has lower deviation 0: Wikipedia "IT Grade" table (https://en.wikipedia.org/wiki/IT_Grade); Wevolver "H7 tolerance explained" (https://www.wevolver.com/article/h7-tolerance-explained-iso-286-hole-tolerance-charts). Ø10 H7 = 10.000–10.015; Ø40 H7 band 0.025. H7/g6 clearance, H7/p6 interference: ISO 286 preferred fits (same sources).
- Reaming allowance 0.1–0.3 mm on diameter: already in this brief (Sandvik hole-making guide; Machinery’s Handbook).
- Tap drill = major diameter − pitch: M8 × 1.25 → 6.75, drill 6.8; M10 × 1.5 → 8.5: AIMS tapping drill diameters (https://aimsindustrial.com.au/blog/tapping-drill-diameters); Fractory "Drill sizes for metric taps" (https://fractory.com/?p=21632).
- Deep holes: normal drilling rarely beyond 5 × D; beyond 10 × D is a deep hole needing special technique; gun drills need high coolant pressure; solid carbide through-coolant drills such as CoroDrill 861 reach 12–30 × D without pecking, pilot hole recommended beyond 15 × D for CoroDrill Dura 462: Sandvik Coromant catalogue (https://docs.steinerelectric.com/Sandvik_5761459_Catalog.pdf) and Sandvik press releases (https://www.inddist.com/home/press-release/13761151/sandvik-coromant-introduces-next-generation-in-deep-hole-drills). G83 peck cycle: Fanuc / ISO 6983 canned cycles. Example feed rates (100 and 400 mm/min) and 2 s per peck are stated as assumptions. Recalcs: 90/100 = 54 s + 15 × 2 = 84 s; 90/400 = 13.5 s; 70.5 × 10,000 = 705,000 s = 196 h; 80/5 = 16 × 1.5 = 24 s.
- Position tolerance: cylindrical zone of the stated diameter around the theoretically exact position (ISO 1101); position = 2·√(dx² + dy²); CMM reports in radius vs diameter as a common error: Wevolver "True position in GD&T" (https://www.wevolver.com/article/true-position-in-gdt-formula-tolerance-zones-and-mmc); Firgelli true position calculator (https://www.firgelliauto.com/blogs/engineering-calculators/true-position-calculator-from-x-y-data). Recalcs: 2 × √(0.03² + 0.04²) = 0.10; √0.0016 = 0.04 → 0.08 (80 % of Ø0.1).
- Turn-mill economics (hour rates €70, €80, €120), five-axis setup times and batch numbers are worked-example assumptions, stated as such in the lessons; no market prices are claimed.

### Cross-references
`holequality` points to Cpk in the quality module (`eng.quality`) in one sentence; `turncell` and `fiveaxis` compare cost per part, not hour rate (`eng.cost`).

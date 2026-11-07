# v14: uitlegfilms (explainer films)

Asked by Merijn on 2026-11-07. Scope widened the same day: a film is no longer only for things a figure can't show. **A figure is something you play with; a film is a guided, narrated look that shows and names things in order.** Every topic with physical objects, actions or sequences gets a film. Non-physical topics (projects, speaking, ICT project work) get one where people, roles, boards and documents show the process.

Status: plan only. Nothing is built. Read with the v13 plan (`2026-11-07-v13-listen-ict-outside-layout.md`); films for v13 modules are marked **after v13**.

Standing rules (as in v13):
- **Content:** a content agent writes each film and a second agent reviews it (facts, Dutch, terms) before merge.
- **Language:** Dutch by default. In Dutch a term carries its English word in parentheses on first use; English never shows Dutch.
- **Numbers:** numbers come from the lesson and are asserted by the build.
- **No video files.**

## 0. Summary

| | P1 | P2 | P3 | Total |
|---|---|---|---|---|
| Maakindustrie (machining, joining, moulding, lines) | 25 | 1 | 0 | 26 |
| Engineering basics (flow … industry40) | 25 | 19 | 3 | 47 |
| Elektriciteitsnet (grid track) | 14 | 2 | 1 | 17 |
| Projecten (pm, current) | 2 | 15 | 3 | 20 |
| Spreken | 1 | 1 | 2 | 4 |
| After v13: ICT, IT/OT, cyber, pm.outside | 5 | 13 | 2 | 20 |
| **Total** | **72** | **51** | **11** | **134** |

114 films are for content that exists today and 20 are for v13 content.

**Top 10 P1** (biggest gain first):
1. `eng.moulding.setting`
2. `eng.joining.arc`
3. `eng.machining.turning`
4. `eng.safety.loto`
5. `eng.switchgear.fiverules`
6. `eng.transformers.principle`
7. `eng.fluids.cavitation`
8. `eng.mechanics.fatigue`
9. `eng.quality.spc`
10. `pm.run.escalation`

## 1. When a film, and how big

### 1.1 Selection rules

A film is made for a topic (or a lesson) when at least one of these holds:
1. **Physical objects with names.** There is a machine, tool, part or installation whose parts carry the lesson's terms. The film shows each part and names it at that moment (term-first, 1.3). This alone qualifies: all of Maakindustrie, grid, fluids, power, mechanics, maintenance, safety and drawings.
2. **A process in time:** a cycle, a sequence of handling steps, a fixed order (safety), cause and effect over milliseconds to years, or something hidden inside a machine or material.
3. **People and roles interacting:** a meeting, an escalation, a session, a negotiation, a handover, a sprint. The film shows who says what to whom, and what changes on the board or document.
4. **A structure you build up step by step**, such as a WBS, a KPI tree, a critical path or a 60-second answer, where watching it grow beats reading the finished picture.

No film when the lesson is about a judgement, an ethic or a reflection with nothing to show (for example `pm.consult.independence`, `pm.close.yourself`, `pm.lead.self`). Those lessons are listed per module as "no film" with the reason.

**Figure and film side by side.** Existing figures stay. When both exist, the lesson shows the film button above the figure: watch first, then play. The film's last scene may say "Probeer het zelf in de figuur hieronder" ("Try it yourself in the figure below") when a figure is wired.

### 1.2 Granularity and cuts

- **How many:** about one film per topic in the topic modules. A topic that covers very different things gets one per lesson, for example `eng.machining.processes` versus turning, or workholding versus measuring.
- **Older modules (six lessons, no topics yet):** one film per lesson group that shares an object or a process.
- **Length:** 60–150 s. Scenes follow the order a person sees or does it on the floor.
- **Scenes:** 4–9 per film, each tagged with the lowest level it belongs to (L1–L4).
- **Cuts by level:**
  - **Basiscut:** the scenes tagged L1–L2, about 60–80 s. A lesson at level 1–2 opens this cut.
  - **Volledige cut:** all scenes, about 110–150 s. A lesson at level 3–4 opens this cut.
  - The player has a "Hele film / Korte versie" toggle.
  - A film for an older module has one cut only, unless stated otherwise.

### 1.3 Term-first design

- Every new term in the lessons a film serves gets a picture at the moment it is named. The object or action is shown, highlighted (a petrol outline or a pulse on the part, plus the term in the caption in petrol), and named in the caption.
- In Dutch the English word follows on first use, taken from the English lesson by term position, as the app does.
- **Coverage rule (checked by the build and a test):** every term of each lesson the film serves appears in at least one caption of a scene at or below that lesson's level, with a visual cue (`cue: "<part id or overlay id>"`). A term that is not covered is listed in the film's `skip` list with a reason, for example "law, nothing to show". The reviewer checks the reasons.
- Terms are listed per scene in the storyboards below. Terms not mentioned in a storyboard are covered in the scene the storyboard groups them with, or are skipped as noted.

## 2. Format spec

### 2.1 What the viewer sees

The film is an **explainer player** page: one standalone HTML file per film.
- **Stage:** an isometric SVG scene drawn with the anatomy kit (the same palette, four-tone shading and painter's order as the figures). People scenes use simple flat-iso figures, tables, boards and documents in the same kit. Petrol is the single accent, used for highlights and the active term.
- **Captions:** a band under the stage, at most 3 lines at 390 px and at least 16 px. The caption is synced to the scene: one or two short sentences, with the term in petrol and the English word in parentheses in the Dutch version. Captions live in an `aria-live="polite"` region.
- **Controls:**
  - play/pause, a scrubber with scene ticks, the time, "Scènes" (a sheet listing the scene titles, tap to jump), replay at the end, and "Korte versie / Hele film";
  - narration on/off (mute) with speed 1× and 1.25×;
  - keyboard: Space plays and pauses, ←/→ go to the previous or next scene, M mutes.
- **Start:** a poster with the still of scene 1, the title and a large play button. No autoplay: audio policies need a tap, and it saves battery.
- **Motion:** calm eased motion (ease-in-out, 0.6–1.2 s per move), a slow camera pan or zoom of at most one per scene, and no flashing.
- **Pacing:**
  - a scene lasts at least (caption words / 2.5) + 2 s;
  - with narration on, a scene holds at its end until the utterance has finished (plus 0.4 s);
  - scrubbing cancels speech, and the new scene speaks from its start.
- **Reduced motion** (`prefers-reduced-motion: reduce` or `?motion=reduce`):
  - no tweening;
  - each scene shows its designed still (`still: u` in 0..1) with its caption, and "Vorige / Volgende" replace the scrubber;
  - narration still works.
- **Page parameters:**
  - `?theme=light|dark` (default prefers-color-scheme) and `?lang=nl|en` (default nl);
  - `?level=1..4` picks the cut;
  - `?scene=n` opens at scene n, so a lesson can point at a part of a longer film;
  - `?motion=reduce`.
- **Legible at 390 px:** at least 16 px captions, at least 44 px tap targets, labels on the stage at least 12 px (or moved into the caption), and no horizontal scroll.
- **Offline and self-contained:** one file with the kit and the script inlined, like the figures. Reason: a sandboxed frame without `allow-same-origin` has an opaque origin, so its subresources do not go through the app's service worker.

### 2.2 Narration (Web Speech API)

- **In the app, through the parent page (primary).** The film posts `{type: 'vp-film', op: 'say' | 'cancel', id, text, lang}` to `parent`. The app's `src/ui/film.js` checks `event.source === frame.contentWindow`, speaks with `src/core/voice.js` (it already picks the voice and cancels speech on navigation) and answers `{type: 'vp-film', op: 'said', id}` when the utterance ends.
  - Reason: `speechSynthesis` inside a sandboxed opaque-origin frame is not reliable across browsers, and the app already owns voice choice.
- **Standalone** (the page opened directly): the page uses its own `speechSynthesis`.
- **Default:** muted. The first unmute is remembered per viewer (in `localStorage` in the app, wrapped in try/catch).
- **Narration text:** the caption text itself. In Dutch, the English words in parentheses are not spoken (the build makes a `speak` variant of each caption), so a Dutch voice does not mangle English.

### 2.3 File layout

```
films/
  _kit/
    player.mjs        timeline, captions, controls, narration bridge, reduced motion (inlined into each page)
    stage.mjs         scene helpers: tween/ease, camera, highlight(cue), people, boards, documents
    build-film.mjs    defineFilm(): resolves terms and numbers, writes the page, size check
    assert.mjs        lesson loaders and asserts (numbers, terms, coverage)
  <id>/build.mjs      one per film: model, scenes, captions, drawing; node films/<id>/build.mjs [--audit]
src/content/courses/films/<id>.html   the built page (shipped)
src/ui/film.js                         the "Bekijk de film" button, the frame and the narration bridge
```

### 2.4 Film data contract

Each page embeds `<script type="application/json" id="film-data">`. The validator test reads it without a browser:

```js
{
  id: 'eng.machining.turning',
  title: { nl: 'Draaien', en: 'Turning' },
  lessons: ['eng.machining.processes', 'eng.machining.cutting', ...],   // lessons it serves
  scenes: [{
    id: 's1', level: 1, dur: 16, still: 0.7,
    caption: { nl: '…', en: '…' },          // resolved text, terms marked
    terms: [{ lesson: 'eng.machining.cutting', index: 0, nl: 'Snijsnelheid', en: 'Cutting speed', cue: 'edge' }]
  }],
  skip: [{ lesson: '…', term: '…', reason: '…' }],
  numbers: [{ lesson: '…', value: '1.167', where: 'example' }]
}
```

### 2.5 Build and asserts

- **Source captions:**
  - Captions are written in the build file with markers: `{t:Snijsnelheid}` for a term, `{n:1167}` for a number.
  - The build looks up the term in the served lessons. It takes the English word from the English lesson's terms at the same position, and fails if the term is not found.
  - For a number, it formats per language (1.167 versus 1,167) and checks that the number appears in the Dutch lesson text (teach, example or recall) and that the film's model computes it.
- **Model asserts:** as in the figure builds, the model is plain JS at the top of the build file, with `throw` asserts against the worked example. For example, n = 220,000 / (π × 60) = 1,167 rpm, and 34 s per cut at f 0.3.
- **Coverage assert:** every term of every served lesson is either in a scene at or below that lesson's level with a `cue`, or in `skip` with a reason. The build fails otherwise.
- **Language assert:** an English caption contains none of the Dutch-only term strings, and a Dutch caption names each term's English word on its first occurrence only.
- **`--audit`:**
  - renders each scene's still to SVG and runs the kit's geometry audit (painter's order, no NaN in `d`);
  - prints scene durations, the total per cut, caption word counts and the reading pace.
- **Sync:** the content test re-runs the term and number checks on the shipped JSON against the current lessons. A lesson edit that removes a number or renames a term makes `npm test` fail, so the film gets rebuilt in the same change.

### 2.6 Lesson wiring

- **New optional lesson field** `film: 'eng.machining.turning'`, optionally with a start scene: `'eng.machining.turning#3'`. The validator pattern is `^[a-z]+(\.[a-z0-9]+)+(#[1-9])?$`. One film may be wired from many lessons.
- **In the lesson screen** (`src/ui/lesson.js`):
  - a secondary button "Bekijk de film" ("Watch the film") with a play icon goes under the first teach block, so the film comes before the reading gets heavy;
  - tapping it opens the frame inline, in the same `figure-wrap` style and `sandbox="allow-scripts"`, at 16:10 plus the caption band, with `src = films/<id>.html?theme&lang&level[&scene]`;
  - the button never becomes the primary.
- **Availability** is checked with HEAD, as `figureAvailable` does; without the page there is no button.
- **Speaking films:** the round's exercise intro (the tip card in `src/ui/round.js`) gets the same button, wired through an optional `film` key per drill in `src/content/tips.js`.
- **Service worker:**
  - film pages are cached on first open (runtime cache, the same cache-first route as figures);
  - Settings gets a row "Films offline bewaren" ("Keep films offline") per subject, which fetches that subject's films into the cache;
  - P1 films of the current module are prefetched when the module opens and the device is on Wi-Fi.
  - Reason: all 134 films are too big for the shell precache (see 2.8).

### 2.7 Validator, tests and e2e

- **`validate.js`:** the `film` id format.
- **Unit tests (`tests/coursecontent.test.js`):**
  - every wired film file exists;
  - the film JSON parses;
  - every scene term exists in the lesson it names, and its English word matches the English lesson by position;
  - coverage holds for each lesson that wires the film (terms covered at or below its level, or skipped with a reason);
  - every `numbers` value still appears in its lesson;
  - each cut is within 45–150 s (Basis 45–90, Volledig at most 150);
  - each page is at most the size cap.
- **Unit tests (`tests/film.test.js`, pure parts of the player kit):**
  - scene timing and cuts per level;
  - `?scene` clamping;
  - the speak variant without the parenthesised English;
  - reading-pace durations;
  - the bridge accepts only messages from its own frame.
- **e2e, new step "films: every film loads without console errors":**
  - each page in a 390 × 700 sandboxed iframe at `[1, light, nl]`, `[2, dark, en]`, `[4, light, nl]` and `[motion=reduce, dark, nl]`;
  - play, scrub to the last scene, replay;
  - no console errors;
  - the caption region is never empty after play;
  - in `lang=en` no caption contains a Dutch term string from the film JSON.
- **e2e lesson step:** a Maakindustrie lesson shows "Bekijk de film"; tapping it opens the frame with `level=` set; the narration bridge answers `said` with a stubbed `speechSynthesis`.

### 2.8 Size and performance targets

- **Page size:** the figures are 100–435 KB raw (moulding.cycle is 280 KB raw, 63 KB gzipped). Films have several scenes, but each scene reuses one drawing with overlays.
  - Target: at most 300 KB raw (about 80 KB gzipped) per film.
  - Hard cap: 450 KB.
  - People and board films target 150 KB.
- **Total:** about 134 × 250 KB ≈ 33 MB raw (about 9 MB on the wire). That is why films use runtime caching plus the opt-in offline row, not the shell precache.
- **Speed:**
  - first frame within 300 ms on a mid phone;
  - at least 50 fps during moves at 390 px (SVG transforms on groups, no per-frame path rebuild for big solids);
  - the clock pauses when the tab is hidden.

## 3. The film list

**Legend:**
- **Serves:** lesson slugs within the module, with the level in a topic module.
- **Cut:** B = Basiscut seconds / V = Volledige cut seconds; one number means a single cut.
- **Adds:** what the film gives beyond the existing figure.
- **Storyboard lines:** `n · level · what is shown — "caption (nl)" — terms`.
- Captions are drafts for the content agent. Terms get their English word from the lesson automatically, and numbers are asserted against the named lesson.

### 3.1 Maakindustrie: eng.machining (Verspanen), 8 films, all P1

| id | Title nl / en | Serves | Cut | Existing figure; the film adds | P |
|---|---|---|---|---|---|
| `eng.machining.overview` | Van staaf tot as: de vier bewerkingen / From bar to shaft: the four processes | processes (L1 of turning) | 75 | none; the whole routing of one part across four machines | P1 |
| `eng.machining.turning` | Draaien / Turning | cutting L2, turnfinish L3, turncell L4 | B 70 / V 140 | `lathe` (knobs for Vc, f, tool life); the cut seen up close, chips, feed marks, slender parts, the mill-turn | P1 |
| `eng.machining.milling` | Frezen / Milling | mill L1, millfeeds L2, millstrategy L3, fiveaxis L4 | B 75 / V 145 | `mill`; a whole programme in order, climb versus conventional chip shape, trochoidal paths, 3+2 versus simultaneous | P1 |
| `eng.machining.drilling` | Boren / Drilling | drill, holes, deephole, holequality | B 70 / V 140 | `drill` (no animation); spot, drill, ream, tap, peck, through-coolant, CMM | P1 |
| `eng.machining.cnc` | Een CNC-programma loopt / A CNC program runs | cnc, gcode, offsets, cam | B 70 / V 140 | `gcode`; from setting up to the first good part, and how a crash happens | P1 |
| `eng.machining.tooling` | De wisselplaat en zijn slijtage / The insert and its wear | toolbasics, tools, toollife, toolcost | B 70 / V 140 | `insert`; reading the ISO code on the box, wear forms growing, the tool-life trade-off | P1 |
| `eng.machining.workholding` | Opspannen: 3-2-1 en nulpuntsystemen / Workholding | fixtures (L1 of workholding) | 75 | none; the six degrees of freedom being taken away one by one | P1 |
| `eng.machining.measuring` | Meten en een capabel proces / Measuring and a capable process | quality L2, metrology L3, capable L4 | 110 | none; warm part versus cold part, gauge R&R, the drift of the mean over a day | P1 |

**`eng.machining.overview`** · numbers from processes: Ø55 bar sawn (1 min); turned to Ø50 with collars, +0,2 mm left on the Ø35 bearing seat for grinding (6 min).
1 · L1 · a steel bar on a saw, then the routing card — "Een as begint als staaf. De routing zegt welke machines hij langs gaat." — Draaien (intro)
2 · L1 · CNC lathe: the bar spins, the tool stands still — "Bij draaien draait het werkstuk en beweegt de beitel erlangs." — Draaien, Tolerantie
3 · L1 · machining centre: the cutter spins, the part is clamped, a keyway is milled — "Bij frezen draait de frees; zo maak je een spiebaan." — Frezen, Spiebaan
4 · L1 · drilling and reaming a cross hole — "Een ruimer maakt een geboord gat precies op maat." — Ruimer
5 · L1 · grinder takes the last 0,2 mm off the bearing seat — "Slijpen haalt de laatste tiendes weg voor de nauwste maat." — Slijpen
6 · L1 · the finished shaft, each feature lit in the colour of its process — "Elke vorm heeft zijn eigen machine."

**`eng.machining.turning`** · numbers from cutting: n = 200.000 / (π × 50) = 1.273; Ø60 at 220 m/min → 1.167 omw/min, f 0,3 → 350 mm/min, 34 s per cut, f 0,4 → 26 s; turnfinish: Ra = f²/(32 r): 0,25 / r 0,8 → 2,4 µm, f 0,14 → 0,77 µm; slenderness 3 × D and 6 × D; turncell: €8,67 on two machines versus 6,0 min complete.
1 · L2 · the cutting edge enters the turning shaft (zoom) — "De snijsnelheid is hoe snel het materiaal langs de snijkant gaat, in meter per minuut." — Snijsnelheid, Wisselplaat
2 · L2 · diameter shrinks, the spindle speeds up (rev counter) — "Bij Ø60 en 220 m/min draait de spil 1.167 toeren; dunner betekent sneller." — Toerental
3 · L2 · the tool moves 0,3 mm per revolution; the depth of cut shown as a band — "De voeding is hoe ver de beitel per omwenteling opschuift, de snedediepte hoe diep hij erin gaat." — Voeding, Snedediepte
4 · L2 · the edge wears over minutes (time-lapse); a sister edge takes over — "Sneller snijden geeft kortere cycli maar een kortere standtijd." — Standtijd
5 · L3 · micro view: feed marks as grooves, the corner radius rounding them — "Een grotere hoekradius maakt de groefjes ondieper: halveer de voeding en Ra wordt een kwart." — Hoekradius
6 · L3 · a chip breaker curls the chip into a "6"; a too-light cut gives long strings — "De spaanbreker breekt de spaan; onder zijn venster krijg je slierten." — Spaanbreker
7 · L3 · a long shaft bends away; the tailstock, then a steady rest, support it — "Boven 3 × D steunt de losse kop het eind, boven 6 × D komt er een bril bij." — Slankheid, Uitsteeklengte, Losse kop, Bril
8 · L4 · a mill-turn centre: bar feed, live tool on the C and Y axes, the part falls off complete — "Een draaifreescentrum maakt het deel in één opspanning af." — Draaifreescentrum, Aangedreven gereedschap, C-as, Y-as, Staafaanvoer, Compleetbewerking

**`eng.machining.milling`** · numbers: mill: aluminium block 100 × 80 × 25, T1 face mill 1 min, T2 Ø10 end mill pocket 60 × 40 × 8; millfeeds: Ø12, 3 teeth, Vc 150, fz 0,05 → 3.980 omw/min, 597 mm/min; millstrategy: ae 1 of Ø10 → hex = 0,6 × fz, fz 0,05 → 0,083, 1.200 → 2.000 mm/min; fiveaxis: 4 set-ups versus 1, 3 × 30 = 90 min per batch.
1 · L1 · the machining centre: spindle, table, tool magazine, the block in a vice — "Een bewerkingscentrum wisselt zelf gereedschap en freest het blok van boven." — Bewerkingscentrum
2 · L1 · T1 face mill skims the top — "Eerst de vlakfrees: de bovenkant vlak." — Vlakfrees
3 · L1 · T2 end mill cuts the contour and a pocket — "Dan de vingerfrees voor de contour en een kamer." — Vingerfrees, Contour, Kamer
4 · L2 · one tooth takes a bite per turn; the table moves — "Voeding per tand maal tanden maal toeren is de tafelvoeding: 597 mm per minuut." — Voeding per tand, Tafelvoeding, Snedebreedte, Verspaningsvolume
5 · L3 · split screen: a tooth entering thick (climb) versus thin (conventional) — "Meelopend gaat de tand dik erin en dun eruit; tegenlopend schuurt hij eerst." — Meelopend frezen, Tegenlopend frezen
6 · L3 · a narrow cut: the chip thinner than fz; then trochoidal loops along the full flute — "Bij 1 mm snedebreedte is de spaan 0,6 keer fz, dus verhoog je de voeding." — Spaanverdunning, Trochoïdaal frezen
7 · L4 · a trunnion table tilts: first 3+2 (tilt, lock, cut), then simultaneous five-axis — "Kantelen in één opspanning scheelt drie keer ombouwen." — Draai-kanteltafel, 3+2-bewerking, Simultaan vijfassig

**`eng.machining.drilling`** · numbers: drill: 4 holes Ø8 × 20 mm, HSS at 25 m/min → 995 omw/min, f 0,15; holes: Ø10 H7 = 10,000–10,015, drill Ø9,8, ream 0,2 off, M8 tap; deephole: Ø6 × 90 = 15 × D, peck 54 + 30 = 84 s versus 13,5 s, 196 h per year; holequality: position Ø0,1, dx 0,024 and dy 0,032.
1 · L1 · spot drill, then the twist drill: flutes carry chips up — "Eerst aanboren, zodat de spiraalboor niet wegloopt." — Centreerboor, Spiraalboor, Spaangroef, Weglopen
2 · L1 · the point angle; a blind hole versus a through hole — "De tophoek centreert de boor; een blind gat heeft een bodem." — Tophoek, Blind gat
3 · L2 · drill Ø9,8, then the reamer to Ø10 H7; a pin slides in — "Ruimen geeft de passing: tussen 10,000 en 10,015." — Passing, H7
4 · L2 · core hole, then the tap cuts the thread; then boring a larger hole — "Voor M8 boor je een kerngat en tap je de draad." — Kerngat, Tappen, Kotteren
5 · L3 · a deep hole: the drill pecks out and in; then coolant through the spindle flushes chips — "Pikken kost 84 seconden per gat; koeling door de spil 13,5." — Pikboren, Koeling door de spil, Spaanafvoer
6 · L3 · the gun drill: one edge, a hollow shank — "Nog dieper: een kanonboor." — Kanonboor
7 · L4 · CMM probes hole 3; the tolerance zone as a circle — "De positietolerantie is een cirkel van Ø0,1 rond de theoretisch exacte maat." — Positietolerantie, Theoretisch exacte maat, Haaksheid, Functioneel kaliber

**`eng.machining.cnc`** · numbers: cnc: G54 by probing the vice jaw, tool 5 length 112,43 typed instead of 121,43 (9 mm); gcode: the N10–N100 slot program (T3 Ø10, S3200, G43 H3, Z-3 F150, Y40 F640, G02 R20); offsets: 6 crashes (3 length, 2 H number, 1 work offset), €12.000 each; cam: 150 programs per year, 4 h CAM, 2,5 h prove-out.
1 · L1 · the setter probes the vice jaw; the zero point appears — "Het werkstuknulpunt G54 zegt de machine waar het werkstuk ligt." — Werkstuknulpunt, Spil
2 · L1 · tool lengths measured; the offset table fills — "Elke gereedschapscorrectie zegt hoe lang en dik het gereedschap is." — Gereedschapscorrectie, G-code
3 · L1 · first part out, measured; the program marked as proven — "Eerste-stukcontrole, dan pas de serie." — Eerste-stukcontrole, Beproefd
4 · L2 · the program runs line by line, the tool traces the slot — "Elke programmaregel is één stap; G01 blijft gelden tot een andere G komt." — Programmaregel, Modaal, Absoluut programmeren, Incrementeel programmeren, M-functie
5 · L3 · a length typed 9 mm too short: the drill goes 9 mm too deep (slow motion, stop before impact) — "Eén tikfout in de lengtecorrectie en de boor gaat 9 mm te diep." — Lengtecorrectie, Radiuscorrectie, Slijtagecorrectie, Crash
6 · L4 · CAM screen: toolpath, post-processor, simulation catches a collision, then prove-out — "Simuleren vangt de botsing voordat de machine hem maakt." — CAM, Gereedschapsbaan, Postprocessor, Simulatie, Proefdraaien

**`eng.machining.tooling`** · numbers: toolbasics: CNMG 120408 P → 80° rhombus, double-sided, 12,7 mm, 4,76 mm thick, r 0,8, 4 edges; tools: €12 per insert / 4 edges = €3, 80 parts → €0,0375 per part; toollife: 200 m/min → 15 min → 30 parts, n 0,25; toolcost: C = 394, change 2 min, €4 per edge, €1,50 per min.
1 · L1 · the box with CNMG 120408; each letter lights the matching feature — "De ISO-code beschrijft de plaat: vorm, maat, dikte, hoekradius." — ISO-code, Materiaalgroep
2 · L1 · HSS tool, carbide insert, coating layer (cutaway) — "Hardmetaal met een coating snijdt veel sneller dan HSS." — HSS, Hardmetaal, Coating, Gereedschapshouder
3 · L2 · flank wear grows; a built-up edge sticks on aluminium; the spindle-load trace rises — "Vrijloopslijtage groeit; de spilbelasting verraadt het." — Vrijloopslijtage, Opbouwsnede, Spilbelasting
4 · L2 · coolant on; tool preset outside; a sister tool takes over at its limit — "Bij de grens neemt het zustergereedschap het over." — Emulsie, Voorinstellen, Zustergereedschap
5 · L3 · the Taylor curve drawn: faster means shorter life — "20% sneller halveert ruwweg de standtijd: dat is de Taylorvergelijking." — Taylorvergelijking, Taylor-exponent, Slijtagecriterium, Gereedschapsbewaking
6 · L4 · cost per part: insert cost falls, change time rises; the minimum — "De economische snijsnelheid ligt waar plaat en wisseltijd samen het laagst zijn." — Economische snijsnelheid, Economische standtijd, Wisseltijd, Gereedschapsstandaardisatie

**`eng.machining.workholding`** · numbers from fixtures: an aluminium housing with 2 mm walls, Ø40 H7 (0,025); clamped hard → 0,04 out of round after release; clamped on the flange with a torque wrench → within 0,008.
1 · L1 · a part floating with six arrows (three moves, three turns) — "Een los deel heeft zes vrijheidsgraden." — Vrijheidsgraden
2 · L1 · three points under, two along, one at the end — "3-2-1: drie, twee, één steunpunt nemen ze één voor één weg." — 3-2-1-principe, Referentievlakken
3 · L1 · the fixture closes; a zero-point pallet clicks into the table — "Een mal legt het deel vast; een nulpuntspansysteem wisselt in seconden." — Mal, Nulpuntspansysteem, Omsteltijd
4 · L1 · hard clamping squeezes the thin wall; after release the bore springs out of round (exaggerated) — "Te hard spannen vervormt de wand: 0,04 onrond na het lossen."
5 · L1 · clamping on the thick flange with a torque wrench: round within 0,008 — "Span waar het deel stijf is."

**`eng.machining.measuring`** · numbers: quality: Ø30 h6 = 29,987–30,000; 29,990 at 35 °C becomes 29,985 at 20 °C; metrology: Ø20 ±0,02, GRR σ 0,0015 → 6σ = 0,009 mm; capable: Ø25 ±0,015, σ 0,003 → Cpk 1,67 in the morning, mean 25,006 at noon → 1,0.
1 · L2 · Ra probe on a turned face; chatter marks; burrs on an edge — "Ra is de gemiddelde ruwheid; chatter laat golven achter." — Ra, Chatter, Bramen
2 · L2 · micrometer, go/no-go gauge, CMM — "Micrometer voor een maat, gaat/gaat-niet voor snel, CMM voor vorm en positie." — Micrometer, Gaat/gaat-niet, CMM
3 · L2 · warm shaft 29,990 at 35 °C, cooling to 29,985 at 20 °C — "Warm gemeten is goed, koud is hij te klein."
4 · L3 · three operators measure ten parts three times; the spread splits into two bars — "Gauge R&R: hoeveel van de tolerantie gaat op aan het meten zelf?" — Meetonzekerheid, Resolutie, Gauge R&R, Herhaalbaarheid, Reproduceerbaarheid
5 · L4 · the spindle warms over the morning; the bore's mean drifts toward the limit — "Thermische groei schuift het gemiddelde: Cpk zakt van 1,67 naar 1,0." — Thermische groei, Cpk
6 · L4 · warm-up program and in-machine probing correct it — "Een opwarmprogramma en meten in de machine houden het capabel." — Opwarmprogramma, Meten in de machine

### 3.2 Maakindustrie: eng.joining (Lassen en verbinden), 6 films, all P1

| id | Title nl / en | Serves | Cut | Existing figure; the film adds | P |
|---|---|---|---|---|---|
| `eng.joining.arc` | Van boog tot scheur / From arc to crack | arc, weldparams, wps, metallurgy | B 75 / V 145 | `mig`; the thermal cycle in time: pool, freezing, HAZ, t8/5, a hydrogen crack hours later, the WPS paper trail | P1 |
| `eng.joining.spot` | Een puntlas in 300 ms / A spot weld in 300 ms | spot, spotwear, spotquality, spotlobe | B 70 / V 135 | `spot`; squeeze, weld, hold slowed down; the nugget growing; tip wear over 500 welds; peel and chisel test | P1 |
| `eng.joining.defects` | Lasfouten vinden / Finding weld defects | defects, inspection, ndt, weldrca | B 75 / V 140 | `ndt`; how each defect forms, then PT and UT in order, and a repair loop | P1 |
| `eng.joining.bolting` | Een bout aandraaien / Tightening a bolt | bolts, bolting, tightening, jointdesign | B 70 / V 140 | `bolt`; reading the head, the bolt stretching as a spring, scatter in preload, the joint diagram | P1 |
| `eng.joining.bonding` | Lijmen, klinken, clinchen / Bonding, riveting, clinching | bonding, adhesives, rivets, choosejoint | B 75 / V 145 | none; the bead being laid and cured, the rivet piercing and flaring (cutaway), the force–stroke curve | P1 |
| `eng.joining.production` | De lasrobotcel / The welding robot cell | weldcell, fixturing, arcon, weldsystem | B 75 / V 140 | none; a two-station cell running, tacking, the weld sequence against distortion, arc-on time | P1 |

**`eng.joining.arc`** · numbers: arc: 24 V, 220 A, 400 mm/min → 0,79 kJ/mm × 0,8 = 0,63 kJ/mm (window 0,5–0,9); gas 15 → 5 L/min gives pores, sensor at 10; weldparams: a5, wire 1,2 at 10 m/min → 5,3 kg/h; wps: test plate 12 mm S355 at 1,2 kJ/mm, new order 22 mm at 1,6; metallurgy: CEV 0,46 on 40 mm S355, wait 16–48 h.
1 · L1 · MAG torch over a joint; the arc strikes; wire feeds; gas cone — "De boog smelt draad en plaat samen tot een smeltbad; beschermgas houdt de lucht weg." — MIG/MAG, Smeltbad, Beschermgas
2 · L1 · TIG beside it: tungsten electrode, filler rod by hand — "TIG: een wolfraamelektrode en een losse staaf, langzamer maar precies." — TIG
3 · L1 · meters show 24 V, 220 A, travel 400 mm/min; the heat number appears — "Booglasenergie: 0,79 kJ per mm, maal 0,8 is de warmte-inbreng." — Booglasenergie, WBZ (named), Warmte-inbreng
4 · L2 · wire speed dial; short arc versus spray arc (droplets slowed down); deposition counter — "Draadsnelheid bepaalt de stroom; boven een grens gaat de kortsluitboog over in sproeiboog." — Draadsnelheid, Kortsluitboog, Sproeiboog, Neersmeltsnelheid
5 · L2 · the gas hose kinks: 15 → 5 L/min, pores appear in the bead — "Te weinig gas: poriën."
6 · L3 · the WPS sheet with its validity ranges; a welder's certificate — "De pLMB wordt een LMB na een proefstuk; buiten het geldigheidsgebied mag je niet." — pLMB, Essentiële variabele, Geldigheidsgebied, ISO 9606-1, Lascoördinator
7 · L4 · a cross-section: temperature colours spread into the HAZ; the cooling curve 800 → 500 °C with t8/5 — "Koelt de WBZ te snel af, dan vormt zich martensiet: hard en bros." — t8/5, Martensiet, Koolstofequivalent
8 · L4 · preheat torch; interpass thermometer; a clock runs 16 h; a crack opens in the HAZ — "Een waterstofscheur kan uren later komen: daarom wacht de controle." — Tussenlaagtemperatuur, Aanloopkleuren (shown on a stainless pipe)

**`eng.joining.spot`** · numbers: spot: 9,5 kA, 300 ms, 3 kN, tip face Ø6 = 28,3 mm² → 336 A/mm²; after 500 welds Ø7,5 → 215 A/mm² (−36%); spotwear: 9,0 kA at Ø6 = 318 A/mm², after 250 welds Ø6,5 needs 10,6 kA; spotquality: 4√1,5 = 4,9 mm; spotlobe: DP600 7,6–9,0 kA versus uncoated 6,9–9,1.
1 · L1 · a body-in-white; a gun closes on two sheets — "Een carrosserie in de rohbouw heeft duizenden laspunten." — Body-in-white
2 · L1 · squeeze, current, hold (time slowed down 100×); the nugget grows between the sheets — "Stroom door het kleine kapvlak smelt een laslens." — Laslens, Stroomdichtheid
3 · L1 · too much current: molten metal sprays out — "Te veel stroom: uitspatten." — Uitspatten
4 · L2 · the tip face mushrooms over 500 welds; current density drops 36% — "Een groeiend kapvlak verdunt de stroom." — Puntenteller, Kapafdruk
5 · L2 · tip dresser cuts a fresh face; the stepper raises the current, then resets; the cooling water flows — "Kappenfrezen en de stepper houden de stroomdichtheid op peil." — Kappenfrezen, Stepper, Kappenwissel, Koelwater, Uitlijning
6 · L3 · peel test: the button tears out, measured with callipers; one breaks in the interface — "Een goede knoop scheurt uit; grensvlakbreuk is fout." — Peeltest, Beiteltest, Knoop, Grensvlakbreuk, Adaptieve regeling
7 · L4 · weld lobe chart: zinc-coated DP600 narrows the window; a multi-pulse program — "Een zinklaag en AHSS maken het venster smaller." — Lasvenster, Plaatcombinatie, AHSS, Meerpulsprogramma

**`eng.joining.defects`** · numbers: defects: 3 of 40 welds with lack of fusion, 300 → 405 mm/min (35% too fast), −26% heat input, 3,5 h per repair; inspection: 32-weld peel test, ≥ 4,4 mm, €5.040 per day; ndt: EXC2, 160 butt welds, 10% UT at level C, ISO 9712 level 2, after the wait; weldrca: 2.400 m tested, 62 m repaired (41 lack of fusion, 12 undercut, 9 porosity), 33 m vertical-up.
1 · L1 · cutaways: pores, lack of fusion, a cold crack, distortion of a plate — "Elke fout heeft zijn eigen oorzaak." — Porositeit, Bindingsfout, Waterstofscheur, Vervorming
2 · L1 · preheating; the ISO 5817 level B, C, D cards — "Voorwarmen voorkomt scheuren; ISO 5817 zegt hoe groot een fout mag zijn." — Voorwarmen, ISO 5817
3 · L2 · penetrant: red dye, wipe, white developer, the crack shows — "Penetrantonderzoek laat scheuren aan het oppervlak zien." — NDO, Penetrantonderzoek
4 · L2 · ultrasonic probe on the weld — "Ultrasoon onderzoek kijkt in de las." — Ultrasoon onderzoek, LMB, LMK
5 · L3 · angle probe moves; the A-scan peak jumps at the flaw; MT on a fillet — "De hoekkop stuurt geluid schuin de las in; de A-scan toont de echo." — Hoekkop, A-scan, Magnetisch onderzoek, Uitvoeringsklasse, ISO 9712
6 · L4 · repair loop: gouge, re-weld, re-test; a Pareto of repaired metres — "Het reparatiepercentage wijst naar de oorzaak: hier verticaal opgaand lassen." — Reparatiepercentage, ISO 6520-1, Restspanning, Spanningsarmgloeien, Overlassen

**`eng.joining.bolting`** · numbers: bolts: M12 A_s 84,3 mm²; 8.8 yields at 640 MPa → 54 kN, 10.9 at 900 MPa → 76 kN (71%); bolting: 50 Nm ±10%, breakaway 53, 52, 31, 54, 52; tightening: 30 kN minimum, 50 kN maximum, tightening factor 1,8; jointdesign: M10 8.8, 18,75 kN, load 0–10 kN, Φ 0,2, 58 mm², 50 MPa allowed.
1 · L1 · the head stamped 8.8, then 10.9; the thread pitch — "8.8: 800 MPa treksterkte, vloeigrens 80% daarvan." — Sterkteklasse, Vloeigrens, Spoed, Spanningsdoorsnede
2 · L1 · threadlocker applied — "Schroefdraadborging tegen loslopen." — Schroefdraadborging
3 · L2 · a nutrunner tightens; the bolt stretches like a spring and clamps the plates — "Het moment rekt de bout: dat is de voorspanning." — Voorspanning, Aanhaalmoment, Schroefspindel
4 · L2 · audit: breakaway torque 31 on one car; settling of a rough joint — "Een losbreekmoment ver onder 50 Nm verraadt een fout." — Losbreekmoment, Zetting, Moment-hoek
5 · L3 · most torque goes into friction: a pie of thread, head and stretch; scatter band 30–50 kN — "Wrijving bepaalt de spreiding: aanhaalfactor 1,8." — VDI 2230, Aanhaalfactor, Wrijvingscoëfficiënt, Vloeigrensgestuurd aandraaien, Boutrek
6 · L4 · the joint diagram: bolt and plates as two springs; an external load adds only Φ × F to the bolt — "Met een krachtfactor van 0,2 krijgt de bout maar 2 van de 10 kN." — Verspanningsdriehoek, Krachtfactor, Restklemkracht, Spanningsamplitude, Klemlengte

**`eng.joining.bonding`** · numbers: bonding: battery tray, 96 self-piercing rivets every 30 mm plus 14 m of epoxy; adhesives: Ø4 bead, 3,2 m → 52 g, test bead 44 g (85%); rivets: window 36–44 kN, +0,4 kN per 1.000, 42,8 now → 3.000 rivets = one shift; choosejoint: 400 points, 60.000 floors, SPR €0,06, flow-drill screw €0,15.
1 · L1 · a lap joint pulled: shear holds, peel tears — "Lijm is sterk op afschuiving, zwak op afpellen." — Constructielijm, Afschuiving, Afpellen
2 · L1 · cutaway: the self-piercing rivet pierces the top sheet and flares in the bottom; clinching forms a button — "Een zelfponsende klinknagel spreidt in de onderste plaat; clinchen vervormt alleen." — Zelfponsende klinknagels, Clinchen
3 · L2 · pre-treatment, a static mixer, the robot lays a bead, the open time runs; a coupon breaks cohesively — "Binnen de open tijd samenvoegen; een cohesieve breuk betekent: de lijm hield." — Voorbehandeling, Statische menger, Open tijd, Rups, Cohesieve breuk
4 · L3 · blind rivet pulled from one side; the force–stroke curve of each rivet; a drifting mean — "Elke nagel tekent een kracht-wegcurve: het gemiddelde kruipt naar 44 kN." — Blindklinknagel, Kophoogte, Insluiting, Kracht-wegcurve, Bodemdikte
5 · L4 · aluminium on steel: galvanic cell with water; flow-drill screw, disassembly — "Twee metalen en water vormen een batterij: isoleren of kiezen." — Multimateriaalontwerp, Galvanische corrosie, Spanningsreeks, Demontage, Vloeiboorschroef

**`eng.joining.production`** · numbers: weldcell: 6 min weld, 4 min load, 0,3 min index; 1 station = 10 min → 6 per hour; 2 stations → 6,3 min per frame (build asserts the lesson figure); fixturing: seam within half the wire diameter (±0,6 mm at 1,2 mm); 2 m beam, 6 welds, 3 mm short → 0,5 mm per weld, then ±1 mm; arcon: 196 g/m, 5 kg/h → 2,4 min of arc per metre, manual 30% at €60 versus robot 70% at €90; weldsystem: 14 welders, EXC2 → EXC3, ISO 9606-1 confirmation every 6 months.
1 · L1 · the cell: robot, positioner with two stations, light curtain, torch cleaning, fume extraction — "Terwijl de robot aan de ene kant last, laadt de operator de andere." — Lasmal, Positioner, Toortsreiniging, Afzuiging, Lichtscherm
2 · L2 · the wire touches the part to find the seam; weaving tracks it — "Naadzoeken vóór, naadvolgen tijdens het lassen." — Naadzoeken, Naadvolgen
3 · L2 · tacks hold the beam; welds go from the middle out; preset parts spring straight — "Hechten, lasvolgorde en voorzetten tegen vervorming: 3 mm krimp, nu ±1 mm." — Hechten, Lasvolgorde, Voorzetten
4 · L3 · a day timeline: arc-on segments light up — "Boogbrandtijd: hoeveel van de dag de boog echt brandt." — Boogbrandtijd, Bedrijfsfactor, Inschakelduur, Neersmeltrendement, Lasdatasysteem
5 · L4 · the paper chain: ISO 3834, EN 1090, CE mark, notified body, the IWE signs — "Laskwaliteit is een systeem: wie mag wat, en wie controleert." — ISO 3834, CE-markering, Aangewezen instantie, Fabrieksproductiecontrole, IWE

### 3.3 Maakindustrie: eng.moulding (Spuitgieten), 6 films, all P1

| id | Title nl / en | Serves | Cut | Existing figure; the film adds | P |
|---|---|---|---|---|---|
| `eng.moulding.machine` | De spuitgietmachine / The moulding machine | machine, screw, clamp, electric | B 75 / V 140 | `screw`; a guided tour from hopper to mould, the pellet's path through the screw zones, choosing a press | P1 |
| `eng.moulding.cycle` | Eén cyclus van 30 seconden / One 30-second cycle | cycle, cooling, cavities, partcost | B 70 / V 130 | `cycle` (wall thickness), `mould` L1 (play the cycle); every phase named in order, cooling through the wall, more cavities, what a part costs | P1 |
| `eng.moulding.setting` | Binnen in de matrijs / Inside the mould | setup, process, scientific, validation | B 80 / V 150 | `window` (the settings console); the melt inside the cavity: flow front, switchover, hold, the gate freezing; the three studies | P1 |
| `eng.moulding.materials` | Van korrel tot smelt / From pellet to melt | materials, polymers, drying, fillers | B 70 / V 135 | none; moisture in pellets, the dryer, amorphous versus semi-crystalline cooling, fibres lining up | P1 |
| `eng.moulding.defects` | Hoe een fout ontstaat / How a defect forms | defects, diagnose, warpage, defectdata | B 75 / V 140 | `part` (pick a defect); each defect forming in the cavity, then the diagnosis path | P1 |
| `eng.moulding.moulds` | Binnen in een matrijs / Inside a mould | tooling, mouldparts, mouldcare, newmould | B 75 / V 140 | `mould`; the melt's route through sprue, runner and gate, slide and ejectors moving, a mould change, the road from T0 to PPAP | P1 |

**`eng.moulding.machine`** · numbers: machine: 300 cm² × 0,4 t/cm² = 120 t, 2 cavities → 240 t; screw: 600 g barrel, 150 g shot, 30 s → 4 shots, 120 s residence; 60 g → 10 shots, 300 s; clamp: 380 cm² × 0,45 = 171 t, shot 100 cm³; electric: 180.000 kg per year, 0,6 versus 0,3 kWh/kg at €0,20 → €10.800 per year against €40.000.
1 · L1 · the whole press: hopper, barrel, clamp, tie bars, mould with a parting line and gate — "Links de sluiteenheid, rechts de spuiteenheid, daartussen de matrijs." — Geleidekolommen, Deellijn, Aanspuitpunt
2 · L1 · the projected area lights up; the clamp force arrow — "Sluitkracht = geprojecteerd oppervlak × druk: 300 cm² vraagt 120 ton." — Sluitkracht, Geprojecteerd oppervlak, Nadruk
3 · L2 · cutaway screw: pellets drop in, are compressed, melt and are metered — "Intrekzone, compressiezone, doseerzone." — Intrekzone, Compressiezone, Doseerzone
4 · L2 · the screw turns back and builds the shot; a pellet's clock counts 120 s — "De doseerslag bepaalt het shot; de verblijftijd hoe lang de kunststof heet zit." — Doseerslag, Verblijftijd
5 · L3 · choosing a press: cavity pressure, shot volume against barrel, mould height and opening stroke — "Past de matrijs, en past het shot in de cilinder?" — Holtedruk, Shotvolume, Cilinderbenutting, Inbouwhoogte, Openingsslag
6 · L4 · hydraulic, all-electric servo, hybrid; then a 2K rotating platen and overmoulding — "Volelektrisch halveert hier de kWh per kg." — Volelektrische pers, Servomotor, Hybride machine, Specifiek energieverbruik, Tweecomponenten-spuitgieten, Omspuiten

**`eng.moulding.cycle`** · numbers: cycle: 30 s = close 2, inject 1,5, hold 6, cool 15, open 2, eject 3,5; cap 2-cavity 20 s → 360 per hour; wall 3 → 2,4 mm → cooling 12 → 7,7 s → 459 per hour; cooling: 4-cavity 24 s with 14 s cooling → 600 per hour, 11 s good, 10 s out; cavities: 2 million caps, A 4-cavity 20 s = 720 per hour, B 8-cavity 24 s = 1.200 per hour; partcost: 40 g PP at €2/kg + 3% → €0,082.
1 · L1 · the phase bar fills as the press moves: close, inject, hold, cool, open, eject — "Een cyclus van 30 seconden, en de helft is koelen." — Cyclustijd, Koeltijd
2 · L1 · cross-section: heat leaves the wall into water in the cooling channels; a thick boss stays hot — "Twee keer zo dik is vier keer zo lang koelen; een dikke bus bepaalt de cyclus." — Koelkanalen, Bus, Holte
3 · L2 · the mould temperature controller, turbulent flow in the channel; eject temperature reached — "De matrijstemperatuur en turbulent water halen de warmte weg." — Matrijstemperatuur, Temperatuurregelaar, Turbulente stroming, Uitwerptemperatuur
4 · L3 · 4 versus 8 cavities; flow balance; valve gates; a family mould — "Meer holtes, meer stuks, maar elke holte moet even snel vol." — Vulbalans, Naaldsluiting, Familiematrijs
5 · L4 · a part's price builds up: material, machine-hour rate, mould depreciation, scrap — "Wat een dop kost: materiaal, machine-uren, matrijs en afkeur." — Machine-uurtarief, Matrijsafschrijving, Afkeurpercentage

**`eng.moulding.setting`** · numbers: setup: PP lid, melt 230 °C, mould 40 °C, 80 mm/s, switchover at 12 mm from a 60 mm stroke → 48 mm in 0,6 s, hold 400 bar for 4 s, cooling 10 s, cycle 18,6 s; process: PC lens, 3% scrap, 14 changes in 6 weeks, cushion 2–8 mm (check ring leaking); scientific: 1.280 / 880 / 825 bar·s at 40/80/120 mm/s, 1.500 of 2.000 bar = 75% (under 80%); validation: 125 shots, 4,820 g, σ 0,006, OQ window 4,780–4,860.
1 · L1 · the set-up sheet next to the machine; five groups light up — "Vijf instellingen bepalen het product; de instelkaart legt ze vast." — Instelkaart, Smelttemperatuur
2 · L1 · cavity cutaway: the flow front advances from the gate at 80 mm/s; a skin freezes against the steel — "Inspuiten: het vloeifront vult de holte in 0,6 seconde." — Inspuitsnelheid
3 · L1 · at 12 mm the screw switches from speed to pressure; the cavity is 95–98% full — "Op het omschakelpunt gaat de machine van snelheid naar druk." — Omschakelpunt
4 · L1 · hold pressure pushes in more melt while it shrinks; the gate freezes shut (it turns solid) — "Nadruk tot het aanspuitpunt bevriest: daarna kan er niets meer bij." — Nadruktijd
5 · L2 · the window chart; back pressure; the check ring leaks and the cushion wanders 2–8 mm — "Een lekkende terugslagring laat het restkussen schommelen." — Procesvenster, Stuwdruk, Terugslagring, Restkussen, Scientific moulding
6 · L3 · three studies in a row: the viscosity curve flattens, the pressure drop by section, part weight levelling off with hold time — "Kies de snelheid op het vlakke deel, blijf onder 80% druk, zet de nadruktijd voorbij de vlakke lijn." — Viscositeitscurve, Drukverhouding, Drukvalstudie, Drukbegrensd, Gate-freeze-studie
7 · L4 · IQ, OQ, PQ cards; every shot weighed; control limits 4,802–4,838 — "Valideren bewijst het venster; het productgewicht bewaakt het daarna." — Validatie, IQ/OQ/PQ, Productgewicht, Hervalidatie

**`eng.moulding.materials`** · numbers: materials: PA6 GF30, dryer 50 kg, use 12 kg/h, 4 h drying → 48 kg needed; polymers: PP shrinks 1,5% → cavity 101,5 mm, ABS 0,5% → 101,0 mm; drying: PC lens, limit 0,02%, 20,000 g → 19,994 g = 0,03% (too wet); fillers: PA66 GF30, 50 cm³ × 1,36 = 68 g → €0,272.
1 · L1 · pellets absorb water from the air; the dryer with desiccant and dew point — "Een hygroscopische kunststof trekt vocht; de droger haalt het eruit." — Hygroscopisch, Dauwpunt
2 · L1 · wet material gives silver streaks; regrind and masterbatch go into the hopper — "Nat materiaal geeft splay; maalgoed en masterbatch gaan erbij." — Splay, Maalgoed, Masterbatch, Semi-kristallijn
3 · L2 · molecules on cooling: a tangle (amorphous) versus ordered regions (semi-crystalline); the part shrinks after moulding — "Semi-kristallijn krimpt meer, ook nog na het spuiten." — Amorf, Glasovergangstemperatuur, Kristalliniteit, Nakrimp, Spanningsscheuren
4 · L3 · moisture analyser weighs a sample; hydrolysis cuts the chains; over-drying yellows — "0,03% restvocht is te nat voor PC: hydrolyse maakt het bros." — Restvocht, Hydrolyse, Overdrogen, Vochtmeter, Karl Fischer-titratie, Droogmiddel
5 · L4 · glass fibres align with the flow; the part shrinks less along than across; the screw wears — "Vezels liggen in de vloeirichting: krimp is anisotroop." — Abrasie, Vezeloriëntatie, Anisotrope krimp, Recyclaat, Smeltindex

**`eng.moulding.defects`** · numbers: defects: crate flashes at 80.000 shots, clamp force 180 → 220 t hides worn parting line; diagnose: 1 in 20 shots short in cavity 2 → 1,25% of parts; warpage: PA6 GF30 200 × 100, 0,3% along / 0,7% across versus 0,5% average → 201,0 mm steel; defectdata: DOE 40/30/24/10 µm.
1 · L1 · short shot: the flow front stops before the end; air trapped at a clogged vent — "Short shot: het vloeifront haalt het eind niet; vaak dichte ontluchting." — Short shot, Ontluchting
2 · L1 · flash at the parting line; a sink above a thick rib; two fronts meet behind a hole — "Braam, inzakplek, bindnaad: elk een eigen oorzaak." — Braam, Inzakplek, Bindnaad, Kromtrekken
3 · L2 · fill study: short shots at 25, 50, 75%; jetting from a small gate; the limit sample — "Een vulstudie laat zien hoe de holte vult." — Vloeifront, Vulstudie, Jetting, Grensmonster
4 · L3 · the part cools on the bench and bends over hours; corner effect — "Ongelijke krimp: hij trekt pas uren later krom." — Ongelijke krimp, Hoekeffect, Verwerkingskrimp, Conditioneren
5 · L4 · 2 × 2 DOE grid fills; a cavity pressure sensor trace per shot — "Hoofdeffect en interactie; een holtedruksensor bewaakt elk shot." — DOE, Hoofdeffect, Interactie, Holtedruksensor, Procesbewaking

**`eng.moulding.moulds`** · numbers: tooling: 40 changes per week at 90 min → 30 min = 40 h per week, €2.400 per week; mouldparts: 2 × 18 g + 6 g runner = 42 g; mouldcare: 8-cavity at 12 s, 120 h → 36.000 shots per week, PM every 100.000 shots; newmould: 1,5 million parts, 750.000 shots, class 103 at €45.000 lasts under 500.000 → 2 moulds = €0,060 per part.
1 · L1 · cold runner versus hot runner — "Een heetkanaal houdt de smelt warm tot in de holte." — Koudkanaal, Heetkanaal, T1
2 · L1 · a mould change: shot counter, preventive maintenance, SMED — "Na zoveel shots gaat hij eruit voor onderhoud." — Preventief onderhoud, Shotteller, SMED
3 · L2 · melt route: sprue, runner, tunnel gate; the mould opens, a slide pulls back from an undercut, ejector pins push; draft angle — "De schuif trekt eerst terug, dan duwen de uitwerppennen." — Aanspuitkegel, Tunnelaanspuiting, Uitwerppen, Lossingshoek, Ondersnijding, Schuif
4 · L3 · the mould log; the last shot kept; internal versus external change work — "Bewaar het laatste shot: het vertelt wat er gerepareerd moet." — Slijtdelen, Matrijslogboek, Laatste shot, Intern omstellen, Extern omstellen
5 · L4 · DFM review, fill simulation, SPI class, T0 shots, PPAP file — "Van ontwerp tot vrijgave: simulatie, T0, PPAP." — DFM, Vulsimulatie, SPI-klasse, T0, PPAP

### 3.4 Maakindustrie: eng.lines (Lijnen en automatisering), 6 films (5 P1, 1 P2)

| id | Title nl / en | Serves | Cut | Existing figure; the film adds | P |
|---|---|---|---|---|---|
| `eng.lines.design` | Een lijn lezen / Reading a line | linebasics, layout, buffers, simulation | B 70 / V 135 | `buffer`; a walk along the line, the bottleneck becoming visible, blocked and starved spreading | P1 |
| `eng.lines.robots` | Een robot leren kennen / Getting to know a robot | robotbasics, robots, robotcell, vision | B 75 / V 145 | `robotcell`; axes and TCP shown one by one, teaching a point, the cell cycle, the light curtain stop | P1 |
| `eng.lines.errorproof` | Foutvrij maken / Error-proofing | errors, pokayoke, sensors, detection | B 70 / V 135 | `pokayoke`; a slip happening, the poka-yoke stopping it, the red rabbit at the start of a shift | P1 |
| `eng.lines.variants` | Omstellen en varianten / Changeovers and variants | variants, linechange, mixed, sequencing | B 70 / V 140 | `mixed`; the changeover filmed and split, then a mixed sequence through station 5 | P1 |
| `eng.lines.control` | Hoe een machine denkt / How a machine thinks | plc, safety, oee_auto, stoppages | B 75 / V 145 | `plc`, `auto`; one PLC step in slow motion, e-stop and guard chain, from alarm log to Pareto | P1 |
| `eng.lines.business` | De businesscase van een cel / The business case of a cell | autobasics, payback, business, risk | 110 | `case`; years playing out, ramp-up and discounting | P2: a money calculation the case figure already lets you play |

**`eng.lines.design`** · numbers: linebasics: takt 25.200 / 420 = 60 s, stations 50, 55, …; layout: 4 × 40 s, the press jams 4 min, 1-place buffers; buffers: B 30 s with stops under 3 min every 20 min, C 36 s is the bottleneck, 180 s buffer (build asserts the place count); simulation: 112 per hour versus 105, 40 parts in the line → Little: 21 min.
1 · L1 · walk past stations, conveyor, signal tower; a stopwatch per station — "Klok elk station; het traagste bepaalt de lijn." — Station, Cyclustijd, Takt, Bottleneck, Transportband, Signaalzuil
2 · L2 · indexed line versus cell; rigid coupling — "Star gekoppeld: één stop legt alles stil." — Getakte lijn, Cel, Buffer, Star gekoppeld
3 · L3 · a jam at B: C runs on from the buffer; the buffer empties; upstream fills and blocks — "Na de stop is de buffer leeg en staat C starved." — Blocked, Starved, Overcapaciteit, Onderhanden werk
4 · L4 · the simulation screen with random stops; Little's law on the WIP counter — "40 stuks bij 112 per uur is 21 minuten in de lijn." — Discrete-eventsimulatie, MTBF, MTTR, Wet van Little

**`eng.lines.robots`** · numbers: robotbasics: 250 mm/s in manual, 1,5 m → at least 6 s; robots: 6 kg casting + 4 kg gripper on a 10 kg robot; robotcell: single gripper 60 s → 60 per hour, double gripper 48 s → 75 per hour; S = K × T + C with K 2.000 mm/s; vision: takt 14 s, move 6 s + 4 s.
1 · L1 · six axes light up in turn; the gripper; the TCP dot — "Zes assen; het TCP is het punt waar de robot naartoe rekent." — As, Grijper, TCP
2 · L1 · the setter with the teach pendant holds the enabling switch; 250 mm/s — "Inleren in handbediening, met de vrijgaveknop ingedrukt." — Teach pendant, Vrijgaveknop
3 · L2 · payload chart; flange and end-of-arm tooling; SCARA; cobot; laser scanner — "Grijper plus deel moet binnen de payload blijven." — Payload, Flens, End-of-arm tooling, SCARA-robot, Cobot, Laserscanner
4 · L3 · cell cycle with single versus double gripper; a vibratory feeder; the light curtain and safety distance — "Een dubbele grijper wisselt in één bezoek: 75 in plaats van 60 per uur." — Dubbele grijper, Trilpot, Lichtscherm, Veiligheidsafstand, Stoptijd
5 · L4 · bin picking with vision; offline programming; speed and separation monitoring, force limiting — "Een cobot zonder hek mag alleen langzaam als hij iemand raakt." — Vision, Bin picking, Offline programmeren, Snelheids- en afstandsbewaking, Kracht- en vermogensbegrenzing

**`eng.lines.errorproof`** · numbers: errors: 1 in 5.000 = 200 ppm; pokayoke: 8 screws, 1 in 2.000 missing, final check catches 85%; sensors: the inductive sensor sees the steel bracket, not the plastic clip; detection: red rabbit OK at 06:00, passed at 14:00, 60 per hour → 480 suspect parts.
1 · L1 · two look-alike brackets in neighbouring bins; the wrong one picked — "Een vergissing is menselijk; een defect is wat de klant krijgt." — Vergissing, Defect, ppm
2 · L1 · pick-to-light points to the right bin; a jig that only fits one way — "Poka-yoke maakt de fout onmogelijk of meteen zichtbaar." — Poka-yoke, Pick-to-light, Mal
3 · L2 · inductive and photoelectric sensors; the PLC counts 8 screws; an interlock holds the part — "Pas na 8 schroeven gaat het deel door." — Inductieve sensor, Foto-elektrische sensor, PLC, Interlock, Valse afkeur
4 · L3 · capacitive sensor with background suppression sees the clip; force–stroke window; reference part test — "Valideer met een referentiedeel: ziet hij het echt?" — Capacitieve sensor, Achtergrondonderdrukking, Kracht-wegbewaking, Referentiedeel
5 · L4 · the red rabbit at shift start passes when it should fail; everything since 06:00 is quarantined; the PFMEA row updated — "Faalt de check, dan zijn alle delen sinds de vorige goede check verdacht." — PFMEA, Actieprioriteit, Escape, Red rabbit, Reactieplan

**`eng.lines.variants`** · numbers: variants: 420 min, 60 s, 4 changeovers × 20 min = 80 min; linechange: 50 min = 15 searching, 20 swapping 6 format parts, 15 adjusting → 35 min after step 1; mixed: takt 120, S 100 / M 120 / L 160, mix 50/30/20 → average 118; sequencing: 180/120/60 → takt 70, A 60 / B 70 / C 100.
1 · L1 · four colours, batch versus small series; the cost of a changeover — "Elke omstelling kost 20 minuten zonder output." — Variant, Mixed-model lijn, Omstellen, Seriegrootte
2 · L2 · the changeover filmed: searching (external), swapping format parts (internal), recipe loaded — "Zoeken is extern werk: zet de delen vóór de stop klaar." — Recept, Formaatdeel, SMED, Intern werk, Extern werk
3 · L3 · station 5 with S, M, L passing; two L in a row overload it; pre-assembly and a floater help — "Twee L achter elkaar en station 5 loopt achter." — Werkinhoud, Voormontage, Vliegende kracht, Volgorderegel, Aanvoer in volgorde
4 · L4 · heijunka box fills with A A B A B C; a frozen sequence window — "Heijunka spreidt C over de dag in plaats van alles aan het eind." — Heijunka, Heijunka box, Bevroren volgorde, Flexibele automatisering

**`eng.lines.control`** · numbers: plc: step 3 waits for "klem dicht"; scan 10 ms → inputs read 100× per second; safety: a door opened 10× per hour → the required PL; oee_auto: six machines each above 90%, line OEE 58%; stoppages: part missing 1.200 × 20 s = 400 min, servo 6 × 25 = 150 min, door 300 × 30 s = 150 min.
1 · L1 · a sensor (input) lights; the PLC scans: read inputs, run the ladder, set outputs; a valve (actuator) moves — "De PLC leest elke 10 ms de ingangen, rekent en zet de uitgangen." — Sensor, Actuator, I/O, Scancyclus, Ladderdiagram, HMI
2 · L1 · the clamp does not close: the HMI shows "Stap 3: wacht op klem dicht" — "De HMI zegt op welke stap hij wacht."
3 · L2 · e-stop pressed; the safety relay drops the contactors; a cut wire also stops it — "Een veiligheidsfunctie stopt ook als de draad breekt." — Noodstop, Veiligheidsfunctie, Performance level, CE-markering, Machineverordening
4 · L3 · a bottling line: the filler starved by a hidden bottleneck; machine states colour — "Elke machine boven 90%, de lijn op 58%: zoek de verborgen bottleneck." — OEE, Microstop, Machinestatussen, Verborgen bottleneck
5 · L4 · alarm log scrolls; first-out alarm marked; Pareto by count, then by minutes — "Op aantal wint 'onderdeel niet aanwezig'; op minuten ook, met 400." — Alarmlog, First-out alarm, Paretodiagram, MES

**`eng.lines.business`** · numbers: autobasics: 2 shifts, €55.000, 400 boxes per shift, 220 days → 176.000 boxes per year; payback: €280.000, 2 shifts → €98.000 per year → 2,9 years; 3 shifts → 1,8 years; business: €300.000; risk: €50.000 in year 1, factors 0,926 / 0,857 / 0,794 / 0,735.
1 · palletiser cell replaces stacking by hand — "Automatiseren loont bij veel volume, weinig variatie en dure arbeid." — Automatisering, Loonkosten, Jaarvolume, Integrator
2 · coins flow in per year; the payback line — "€280.000 terug in 2,9 jaar bij twee ploegen." — Terugverdientijd, Capex, Netto besparing, Lopende kosten
3 · ramp-up eats year 1; scrap during start-up — "De opstartfase halveert het eerste jaar." — Opstartfase, Afkeur
4 · future euros shrink with the discount factor; the NPV bar; sensitivity sliders — "Een euro over vier jaar is vandaag 0,735 waard." — NPV, Disconteringsvoet, Opstartverlies, Restwaarde, Gevoeligheidsanalyse

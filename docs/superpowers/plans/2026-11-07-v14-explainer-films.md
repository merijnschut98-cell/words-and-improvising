# v14: uitlegfilms (explainer films)

> **Merijn's decisions (2026-11-07):**
> - **Order:** P1 films come before v13. Older modules wait for their rebuild into topics × levels (v13 part 5).
>   - Effective order: wave 0 (the player, the turning pilot), then all Maakindustrie P1 films, then v13 including the rebuild, then the P1 films of the rebuilt modules, then P2 and P3.
>   - The five remaining v10 figures finish alongside wave 0.
> - **Narration:** ON by default, with a mute toggle.
> - **Length:** always the full film (no short cut by level); 60–150 s.
> - **Older modules:** their films wait until the module is rebuilt as topics × levels.
> - **Film tab (Merijn, 2026-11-07):** a lesson with a film gets its own step "Film", between Raden and Lezen (Raden · Film · Lezen · Voorbeeld · Check). It replaces the button under the first teach block, can be skipped, and you can go back to it like any step.
> - **Every level has a film (Merijn, 2026-11-07):** Basis matters most, so every topic level must be served by a film. A test enforces this for topics whose films are built. eng.machining.overview is now in progress for Turning L1.
> - **Still open (defaults until he says otherwise):**
>   - the film button sits under the first teach block;
>   - films are cached on first view plus an offline switch per subject;
>   - speaking films go on the exercise intro card;
>   - no film for the pm retrospective lesson.


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
  - a beat may carry its own `still`, used for that beat's caption, when one still cannot show every part the scene's captions name;
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

### 3.5 Engineering basics (older modules)

These modules still have six lessons and no topics. v13 part 5 rebuilds them as topics × levels, keeping lesson ids. Each film maps to lessons now, and its scenes get level tags when the module is rebuilt (see open question 4). One cut each unless stated otherwise.

#### eng.flow (Capaciteit en flow), 5 films

| id | Title nl / en | Serves | Dur | Adds | P |
|---|---|---|---|---|---|
| `eng.flow.takt` | Takt, cyclustijd, doorlooptijd / Takt, cycle and lead time | takt, capacity | 100 | none; a box travelling for days while it is worked on for minutes; a weekly capacity check | P1 |
| `eng.flow.bottleneck` | De bottleneck / The bottleneck | bottleneck, balance | 110 | `line` (knobs); WIP piling up in front of the CNC, then the Yamazumi bars rebalanced | P1 |
| `eng.flow.smed` | Een omstelling van 90 naar 35 minuten / A changeover from 90 to 35 minutes | changeover; also moulding mouldcare, machining fixtures | 110 | none; the filmed changeover split into internal and external work, then the batch-size trade-off | P1 |
| `eng.flow.oee` | Waar een dienst blijft / Where a shift goes | oee; also lines oee_auto, maintenance tpm | 90 | none; a 480-minute shift drained into the six big losses | P2 |
| `eng.flow.capacity` | Is er genoeg capaciteit? / Is there enough capacity? | capacity | 70 | none; demand hours against shift hours × OEE | P2 |

- **`eng.flow.takt`** · numbers: takt example: 2.400 boxes per week, 5 days, 480 − 40 = 440 min = 26.400 s, 480 per day → takt 55 s, line 52 s, lead time 3 days; teach: 27.000 s / 450 = 60 s, plan at 85–90% → 51–54 s.
  1. The customer orders per day; the shift clock minus breaks — "Takt = beschikbare tijd / klantvraag: 26.400 s / 480 = 55 seconden." — Takttijd, Beschikbare tijd
  2. A stopwatch on the line: a box every 52 s — "Cyclustijd is wat de lijn echt doet." — Cyclustijd
  3. A box's journey sped up: minutes at stations, days in buffers and the store — "Doorlooptijd is kalendertijd; bewerken is vaak minder dan 1%." — Doorlooptijd, Buffer
  4. Two stops in an hour: the line falls behind its takt — "3 seconden marge is snel op."
- **`eng.flow.bottleneck`** · numbers: bottleneck: saw 30, CNC 90, deburr 45, wash 40 → 40 per hour, 480 pieces in the cell (Little: 12 h); balance: takt 72, stations 65/80/50/70 = 265 → line 80 s, 45 per hour against 50; at least 4 stations.
  1. Four stations; parts flow; the CNC is slowest — "De bottleneck bepaalt de throughput: 3.600 / 90 = 40 per uur." — Bottleneck, Throughput
  2. WIP piles in front of the CNC; downstream starves — "Voor de bottleneck groeit WIP; erachter staat alles starved, ervoor blocked." — WIP, Starved, Blocked
  3. Little's law on a counter: 480 pieces at 40 per hour = 12 h — "Wet van Little: doorlooptijd = WIP / throughput." — Wet van Little
  4. Yamazumi bars per station against the takt line; station 2 at 80 s sticks out — "Lijnbalancering: werkinhoud zo verdelen dat niemand boven de takt komt." — Lijnbalancering, Werkinhoud, Yamazumi
  5. Tasks move between bars within the assembly order; the balance loss shrinks — "Balansverlies is de lege ruimte onder de taktlijn." — Balansverlies, Montagevolgorde
- **`eng.flow.smed`** · numbers: changeover example: 90 min = 25 fetching + 15 water + 20 heating + 30 trial shots; −25 (prepare), −20 (preheat station), water 15 → 5 → 35 min; 4 per day × 55 = 220 min, or 8 series per day for 280 min instead of 360.
  1. The last good part A, the clock starts; the first good part B, it stops — "Omsteltijd loopt van laatste goede A tot eerste goede B." — Omstelling, Matrijs
  2. The video timeline: people walking for a crane, the water hoses, heating, trial shots — "Film het en schrijf elke stap op." — SMED
  3. Blocks coloured internal (machine stopped) or external (while running) — "Extern werk hoort niet in de stop." — Intern werk, Extern werk
  4. External work moves before the stop; preheat at a separate station; quick couplings — "Klaarzetten −25, voorverwarmen −20, snelkoppelingen −10: 35 minuten."
  5. Fixed stops and locating pins make the first shot good — "Afstellen weg: de instelling ligt vast."
  6. Batch size halves; stock halves at the same time lost — "Halve omsteltijd, halve serie, halve voorraad." — Seriegrootte
- **`eng.flow.oee`** · numbers: oee example: 480 − 30 = 450 planned; 30 breakdowns + 45 changeover → 375 run (83,3%); ideal 30 s × 600 = 300 min (80%); 570 good (95%); OEE 63,3%; losses 75 / 75 / 15 min; microstops 30 × 40 s = 20 min = 4%.
  1. The shift bar of 450 planned minutes — "OEE: welk deel van de geplande tijd werd goede stuks op volle snelheid?" — OEE
  2. Breakdowns and a changeover cut it to 375 — "Beschikbaarheid 83,3%." — Beschikbaarheid
  3. Microstops and slow running cut 75 more — "Performance 80% tegen de ideale cyclustijd." — Performance, Ideale cyclustijd, Microstops
  4. 30 bad parts take 15 minutes; the six losses stacked — "Zes grote verliezen; twee grote hefbomen, niet één." — Zes grote verliezen
- **`eng.flow.capacity`** · numbers: capacity example: 1.200 per week × 4 min = 80 h demand; 2 shifts × 5 × 7,5 = 75 h, × 70% OEE = 52,5 h → 152% load; three shifts (assert the lesson's figure).
  1. Paper capacity: hours on the shift roster — "Papieren capaciteit telt uren, geen goede stuks." — Capaciteit, Papieren capaciteit, Ploegenrooster
  2. Times OEE: effective hours; the demand bar overflows to 152% — "Belasting 152%: dit gaat niet." — Belasting, Bezettingsgraad
  3. A third shift added; the bar fits — "Een derde ploeg, of minder vraag op de bottleneck."

#### eng.quality (Kwaliteit: de basis), 4 films

| id | Title | Serves | Dur | Adds | P |
|---|---|---|---|---|---|
| `eng.quality.tolerance` | Van maat tot spreiding / From dimension to spread | tolerance, variation, capability | 110 | `capability` (gates and knob); parts coming off a lathe and stacking into a bell curve | P1 |
| `eng.quality.spc` | Een regelkaart slaat alarm / A control chart raises the alarm | spc; also spc.tampering, spc.charts | 120 | none; the chart filling hour by hour, the trend, the reaction plan; then the funnel | P1 |
| `eng.quality.fmea` | Een FMEA-sessie / An FMEA session | fmea; also lines.detection, improve.verify | 100 | none; the team around the table filling one row and acting on it | P2 |
| `eng.quality.controlplan` | Control plan, meten en PPAP / Control plan, gauges and PPAP | controlplan | 90 | none; choosing a gauge with the rule of ten, a gauge R&R study, the PPAP binder | P2 |

- **`eng.quality.tolerance`** · numbers: tolerance: Ø12 +0,018/0 = 12,000–12,018, 15 of 500 at 12,021 = 3%, €67,50 at the machine; variation: Ø20 ±0,05, mean 20,003, σ 0,008 → 19,979–20,027; capability: Ø30 +0,04/0, mean 30,026, σ 0,004 → Cp 1,67, Cpk 1,17.
  1. The drawing: nominal size, tolerance, spec limits; the general tolerance in the title block — "Nominaal 12, tolerantie +0,018: alles tussen 12,000 en 12,018 is goed." — Nominale maat, Tolerantie, Specgrenzen, Algemene tolerantie
  2. A part at 12,021: tagged nonconforming; a deviation form — "Buiten spec is afwijkend; een deviatie is een tijdelijke uitzondering." — Afwijkend, Deviatie
  3. Parts drop into a histogram; the mean and σ marked; the normal curve — "Gewone oorzaken geven deze spreiding." — Gemiddelde, Standaardafwijking, Normale verdeling, Gewone oorzaak
  4. A worn insert shifts the pile; an operator adjusts after every part — "Een speciale oorzaak verschuift het proces; bijsturen op ruis is tampering." — Speciale oorzaak, Tampering
  5. The curve against the gates: Cp, Cpk, ppm outside — "Cp kijkt naar de breedte, Cpk ook naar het midden: 1,67 tegen 1,17." — Procesgeschiktheid, Cp, Cpk, Ppk, ppm
- **`eng.quality.spc`** · numbers: spc example: Ø20 ±0,05, n = 5, grand mean 20,000, R̄ 0,020, A2 0,577 → 19,9885–20,0115; means 20,002, 20,004, 20,005, 20,006, 20,008, 20,009, 20,011 from 10:00 to 16:00; insert changed at 16:10. tampering: funnel +41% σ, variance ×2; drop ≈ 29%.
  1. Five shafts measured each hour; one point plotted — "Elk uur een steekproef van 5: het gemiddelde gaat op de X-bar-kaart, de range op de R-kaart." — SPC, Regelkaart, Steekproef, X-bar/R-kaart
  2. Centre line and control limits drawn; the spec limits far outside — "Regelgrenzen zijn wat het proces doet, geen specgrenzen." — Regelgrenzen
  3. Seven points climbing; the rule lights up — "Zeven keer op rij omhoog: een trend, nog ver binnen spec."
  4. The operator follows the reaction plan: stop, check the insert, change it at 16:10, isolate suspect parts — "Een kaart zonder reactieplan is behang." — Reactieplan
  5. The funnel: moving it after every drop widens the pattern by 41% — "Alleen bijstellen op een signaal."
- **`eng.quality.fmea`** · numbers: fmea example: pressing a bearing; S 8, O 5, D 7 → RPN 280; force–displacement monitoring → D 2 → RPN 80; S stays 8.
  1. Design, process, quality, maintenance and an operator around a table; the process step on the screen — "Een FMEA vindt risico's op papier in plaats van bij de klant." — Faalwijze
  2. The row fills: effect, cause, current control; scores 8, 5, 7 — "Ernst, kans op optreden, detectie: 8 × 5 × 7 = 280." — Ernst, Kans op optreden, Detectie, RPN
  3. The AP table looks at severity first: high — "Action Priority kijkt eerst naar ernst." — Action Priority (AP)
  4. Proposal "train operators" crossed out; force–displacement monitoring added; D becomes 2 — "Detectie 2, RPN 80; de ernst blijft 8."
- **`eng.quality.controlplan`** · numbers: controlplan example: Ø20 ±0,02 (0,04 band), calliper 0,01 fails the rule of ten (needs 0,004), micrometer 0,001.
  1. The control plan row: characteristic, gauge, frequency, reaction — "Het control plan zegt wat, hoe en hoe vaak je meet." — Control plan
  2. Calliper versus micrometer against the tolerance band (rule of ten) — "Een tiende van de tolerantie: de schuifmaat valt af."
  3. Gauge R&R: three people, ten parts, three repeats — "Herhaalbaarheid is het instrument, reproduceerbaarheid de mensen." — Gauge R&R, Herhaalbaarheid, Reproduceerbaarheid
  4. The PPAP binder closes with the PSW signature — "PPAP bewijst het proces; de PSW tekent het af." — PPAP, PSW

#### eng.process (Procestechniek), 4 films

| id | Title | Serves | Dur | Adds | P |
|---|---|---|---|---|---|
| `eng.process.plant` | Een proceslijn lezen / Reading a process line | types, variables | 100 | a juice pasteuriser with its instruments, batch versus continuous | P1 |
| `eng.process.balance` | Massa- en energiebalans / Mass and energy balance | mass, energy | 100 | streams in and out made visible, and heat recovery in the regeneration section | P2 |
| `eng.process.batch` | Een batch van 300 minuten / A 300-minute batch | batch | 90 | the phases of a paint batch in time, and where the waiting sits | P1 |
| `eng.process.scaleup` | Van kolf naar reactor / From flask to reactor | scaleup | 100 | volume growing faster than surface, and a runaway loop | P2 |

- **`eng.process.plant`** · numbers: types: holding tube 0,1 m³ at 12 m³/h → 30 s; variables: syrup 1.250 kg/m³, 2,0 m → 24.525 Pa, a meter set for water reads 2,5 m.
  1. Unit operations in a row: mix, heat, hold, cool, fill — "Een fabriek is een rij unit operations." — Unit operation
  2. Batch vat versus continuous pipe at steady state — "Batch in cycli, continu in een stationaire toestand." — Batchproces, Continu proces, Stationaire toestand
  3. The holding tube: a drop of juice takes 30 s through it — "Verblijftijd = volume / debiet." — Verblijftijd
  4. Gauge pressure versus absolute; a Coriolis meter on the line; a Pt100 in a pocket — "Overdruk, massadebiet, temperatuur." — Overdruk, Absolute druk, Massadebiet, Coriolismeter, Pt100
  5. Syrup in a tank calibrated for water reads 2,5 m — "De meter rekent met water: 25% te hoog."
- **`eng.process.balance`** · numbers: mass: 1.000 + 500 = 1.500 kg in, 1.440 + 30 = 1.470 out, 30 kg missing (2%), yield 96%; energy: 10.000 kg/h × 3,9 × 68 = 737 kW without recovery (the regeneration share asserted from the lesson).
  1. Arrows in and out of the vessel; a gap appears — "In = uit + ophoping: er mist 30 kg." — Massabalans, Ophoping
  2. Sugar tracked on its own; a tie component — "Een componentbalans volgt één stof." — Componentbalans, Tie component, Opbrengst
  3. Milk heated from 4 to 72 °C: the sensible-heat bar — "Voelbare warmte = massa × soortelijke warmte × ΔT: 737 kW." — Voelbare warmte, Soortelijke warmte
  4. Hot milk leaving warms cold milk coming in — "De regeneratiesectie wint de meeste warmte terug." — Warmteterugwinning, Regeneratiesectie
  5. Evaporation: water leaves as steam and carries latent heat — "Latente warmte zit in de faseovergang." — Latente warmte
- **`eng.process.batch`** · numbers: batch: 4 t per 5 h = 0,8 t/h; the paint example: 40 + 90 + 50 + 20 + 60 + 40 = 300 min, 3.000 kg → 600 kg/h; QC wait 50 → 15 → 265 min → 679 kg/h (+13%); reactor 6 h feeding a filter 3 h.
  1. The vessel's phases in a clock ring: fill, disperse, QC, adjust, drain, clean — "Batchcyclustijd: alles tussen twee starts." — Batchcyclustijd, Fase
  2. The vessel sits waiting for the lab — "50 minuten wachten op QC-vrijgave." — QC-vrijgave
  3. CIP sprays the tank — "CIP reinigt zonder uit elkaar halen." — CIP
  4. An inline viscometer: wait 15 min, cycle 265 — "Zelfde vat, 13% meer."
  5. Reactor 6 h into a filter 3 h; a second reactor; the bottleneck moves — "De bottleneck is de langste tijd per batch per parallel vat." — Bottleneck
- **`eng.process.scaleup`** · numbers: scaleup: 10 L → 10 m³, dimensions ×10, surface ×100; 0,5 kW → 500 kW; jacket 25 m² × 10 kW/m² = 250 kW; dosing in 2 h = 250 kW (no margin), 2,5 h ≈ 200 kW.
  1. Flask, pilot plant, reactor side by side — "Opschalen gaat via een proeffabriek." — Opschalen, Proeffabriek
  2. A cube grows ×10: volume ×1.000, surface ×100 — "De oppervlak-volumeverhouding wordt tien keer kleiner." — Oppervlak-volumeverhouding
  3. Heat production 500 kW against the jacket's 250 kW — "De mantel kan maar 250 kW kwijt." — Mantel
  4. Runaway loop: warmer, faster, more heat — "Een exotherme reactie kan op hol slaan." — Exotherm
  5. Dosing in 2,5 h: about 200 kW, with margin — "Langzamer doseren: een opschaalkost in de planning."

#### eng.mechanics (Materialen en sterkte), 5 films

| id | Title | Serves | Dur | Adds | P |
|---|---|---|---|---|---|
| `eng.mechanics.load` | Kracht, moment en spanning / Force, moment and stress | forces, stress | 100 | a motor on a bracket, the moment growing with distance, a bar stretching | P1 |
| `eng.mechanics.tensile` | De trekproef / The tensile test | strength | 90 | the bar necking while the curve draws | P1 |
| `eng.mechanics.fatigue` | Hoe een as breekt / How a shaft breaks | fatigue | 110 | a crack growing over months, with beach marks | P1 |
| `eng.mechanics.heattreat` | Harden, ontlaten, inzetharden / Hardening, tempering, case hardening | heattreat | 100 | the temperature–time path and what happens inside the steel | P1 |
| `eng.mechanics.materials` | Welk materiaal waar / Which material where | materials | 80 | corrosion and creep in time | P2 |

- **`eng.mechanics.load`** · numbers: forces: 50 kg → 490 N, 0,4 m → 196 Nm, 0,8 m → 392 Nm; stress: Ø20 → 314 mm², 31,4 kN → 100 MPa, strain 0,000476, 2.000 mm → 0,95 mm.
  1. A motor hangs; the weight arrow in newtons — "50 kg weegt 490 newton." — Newton
  2. The lever arm grows from 0,4 to 0,8 m; the moment doubles; the top bolts in tension — "Moment = kracht × arm." — Moment, Evenwicht
  3. Static load versus a vibrating, dynamic one; the WLL plate on a hoist — "Een dynamische belasting telt zwaarder; de WLL staat op het hijsmiddel." — Statische belasting, Dynamische belasting, Werklast (WLL)
  4. A rod's cross-section lights up; the stress number — "Spanning = kracht / doorsnede: 100 MPa." — Spanning, Doorsnede
  5. The rod stretches 0,95 mm; E as the steepness — "Rek is relatief uitrekken; de elasticiteitsmodulus maakt het stijf." — Rek, Elasticiteitsmodulus, Stijfheid, Sterkte
- **`eng.mechanics.tensile`** · numbers: strength: S235 / S355 (≤ 16 mm), bolt 8.8 = 800 and 640 MPa, impact test ≥ 27 J at −20 °C, safety factors 1,5 / 3 / 4–7; console 235 / 120 = 1,96, 240 MPa > yield, S355 → 1,48.
  1. A test bar in the machine; the curve starts straight; release and it springs back — "Bij een trekproef loopt de lijn eerst recht: elastisch." — Trekproef
  2. The curve bends at the yield point; permanent set — "Bij de vloeigrens vervormt hij blijvend." — Vloeigrens
  3. The peak, then necking and fracture — "Hoogste punt: treksterkte. Daarna insnoeren en breken." — Treksterkte
  4. Ductile steel versus brittle cast iron; a pendulum impact test — "Taai rekt en waarschuwt; bros breekt zomaar." — Taai, Bros
  5. A console at 120 MPa, load doubles to 240 — "Veiligheidsfactor tegen wat? 235 / 120 = 1,96." — Veiligheidsfactor
- **`eng.mechanics.fatigue`** · numbers: fatigue: 1.500 rpm → more than 2 million cycles per day; endurance limit about half the tensile strength at 10 million; a round hole triples the stress; agitator shaft broke twice in 18 months at the keyway end.
  1. A rotating bent shaft; each turn one load cycle; a counter — "1.500 toeren is ruim 2 miljoen lastwisselingen per dag." — Vermoeiing, Lastwisseling
  2. The sharp keyway corner glows: stress concentration — "Kerfwerking: de spanning piekt in de hoek." — Kerfwerking
  3. A crack starts and grows a little per run; each stop leaves a ring — "Rustlijnen: elke stop laat een ring achter." — Rustlijnen
  4. The remaining section snaps: rough final fracture — "Klein restvlak: lage spanning, lang gegroeid."
  5. The S–N curve; steel's limit, aluminium without one — "De Wöhlerkromme en de vermoeiingsgrens." — Wöhlerkromme, Vermoeiingsgrens
  6. The fix: rounded keyway, a balanced agitator — "Sterker staal hielp niet; een afronding wel."
- **`eng.mechanics.heattreat`** · numbers: heattreat: 120 HB versus 60 HRC; 800–900 °C, temper 150–650 °C, stress relief 550–650 °C, carburise about 900 °C, nitride about 500 °C; gears 58–62 HRC, case 0,8–1,2 mm, measured 48 HRC.
  1. Three indenters: ball, diamond, cone — "Hardheid: hoe diep de indruk gaat." — Hardheid
  2. Heat to 850 °C, plunge into oil: hard and brittle; a quench crack at a corner — "Afschrikken maakt hard en bros." — Afschrikken
  3. Reheat: trade hardness for toughness — "Ontlaten maakt het taai." — Ontlaten
  4. Annealing (slow cool, soft); stress relief after welding — "Gloeien maakt zacht; spanningsarmgloeien haalt spanning weg." — Gloeien, Spanningsarmgloeien
  5. Gear tooth: carbon enters the skin; the case depth cut and measured — "Harde huid, taaie kern; 48 HRC gemeten tegen 58–62 geëist." — Oppervlakteharden
- **`eng.mechanics.materials`** · numbers: none fixed (the selection story in the example: wet cleaning with chlorinated foam and caustic).
  1. Carbon steel, stainless, aluminium, cast iron on a rack — "Elk materiaal heeft zijn sterke en zwakke kant." — Koolstofstaal, Roestvast staal (rvs), Aluminium, Gietijzer
  2. Steel bolt in aluminium with water: galvanic cell — "Galvanische corrosie: het onedele metaal lost op." — Galvanische corrosie
  3. A hot part slowly stretches under constant load — "Kruip: vervormen onder blijvende last, vooral warm." — Kruip
  4. The food machine: paint flakes out, stainless in — "In de productzone: rvs."

#### eng.maintenance (Onderhoud), 3 films

| id | Title | Serves | Dur | Adds | P |
|---|---|---|---|---|---|
| `eng.maintenance.failure` | Hoe machines falen / How machines fail | strategies, failure, condition | 120 | `pf` (pick the interval); a bearing's life from new to failure, and which strategy catches it | P1 |
| `eng.maintenance.tpm` | TPM: de eerste schoonmaak / TPM: the first clean | tpm | 80 | operators cleaning, finding and tagging | P1 |
| `eng.maintenance.workorder` | Een werkorder en de backlog / A work order and the backlog | metrics, cmms | 100 | a work order's path through the CMMS, and MTBF and MTTR from a stop list | P2 |

- **`eng.maintenance.failure`** · numbers: strategies: gearbox €60.000, 10 weeks lead time; failure: 24 servo bearings, €18.000 per year, 6 → 9 failures after yearly replacement; condition: 1,8 → 1,9 → 2,6 → 3,4 mm/s, +0,8 per month.
  1. Run to failure, preventive, condition-based, predictive on one pump — "Vier strategieën; kies per machine." — Correctief onderhoud, Preventief onderhoud, Toestandsafhankelijk onderhoud, Predictief onderhoud, RCM
  2. The bathtub curve: infant mortality, random, wear-out — "De meeste storingen komen niet met de leeftijd." — Badkuipkromme, Kindersterfte, Willekeurig falen, Slijtage, Weibull β
  3. New bearings fail soon after a replacement — "Storing door onderhoud: 9 storingen in plaats van 6." — Storing door onderhoud
  4. A bearing defect starts (P) and grows; vibration, heat and oil show it before failure (F) — "Het P-F-interval: tijd om in te grijpen." — P-F-interval, Trillingsanalyse, Thermografie, Olieanalyse, Ultrasoon
  5. The trend 1,8 → 3,4 mm/s; the planned repair — "Over zo'n zes weken door de grens: plan het nu."
- **`eng.maintenance.tpm`** · numbers: tpm: 37 tags = 12 oil leaks, 9 loose bolts, 6 missing guards, 10 other.
  1. An operator team with cloths on a moulding machine — "Bij TPM zorgen operators mee voor hun machine." — TPM, Autonoom onderhoud
  2. Each find gets a tag: 37 in one shift — "Elk lek, elke losse bout krijgt een label." — Label
  3. The CILT card: clean, inspect, lubricate, tighten — "CILT: schoonmaken, inspecteren, smeren, aandraaien." — CILT
  4. The OEE board improves — "Minder kleine storingen, hogere OEE." — OEE
- **`eng.maintenance.workorder`** · numbers: metrics: 320 planned h, 8 failures, 12,5 h → MTBF 38,4 h, MTTR 1,56 h, availability 96%; cmms: 6 × 40 = 240 h per week, backlog 1.150 h = 4,8 weeks, PM compliance 68%, breakdown work 42%, one conveyor 31%.
  1. The asset tree: plant, line, machine, part — "Het CMMS kent elke machine." — CMMS, Assetregister
  2. A notification becomes a work order through its states; criticality A/B/C — "Melding, goedgekeurd, gepland, uitgevoerd, gesloten." — Werkorder, Kritikaliteit
  3. The stop list; wrench time; MTBF and MTTR — "MTBF 38 uur, MTTR anderhalf uur." — MTBF, MTTR, Beschikbaarheid, Storingslijst, Sleuteltijd
  4. The backlog pile in weeks; PM compliance gauge at 68% — "4,8 weken backlog en preventief schuift." — Backlog, PM-compliance

#### eng.drawings (Tekeningen en regeling), 3 films

| id | Title | Serves | Dur | Adds | P |
|---|---|---|---|---|---|
| `eng.drawings.reading` | Een tekening lezen / Reading a drawing | views, gdt | 110 | a 3D part unfolding into views, a section, and the tolerance frame checked on a CMM | P1 |
| `eng.drawings.loop` | Van P&ID tot regelkring / From P&ID to control loop | pid, loop, pid_control | 130 | `loop` (play with SP and gain); the P&ID symbols coming to life as real equipment, then P, I and D in a trend | P1 |
| `eng.drawings.plc` | PLC, HMI, SCADA en interlocks / PLC, HMI, SCADA and interlocks | plc | 80 | layers lighting up; an interlock blocking a step; a bypass | P2 |

- **`eng.drawings.reading`** · numbers: views: drawing 4711-203, S235, 1:1, ISO 2768-m, rev C (B: Ø8,5 → Ø9; C: R2 → R3); gdt: 4 holes Ø10,2 +0,1/0, position Ø0,3 Ⓜ to A B C, 25 from B and 40 from C, measured 0,12 off.
  1. The bracket in 3D unfolds into front, top and side (European projection) — "Europese projectie: het bovenaanzicht staat eronder." — Europese projectie, Schaal
  2. A cut through the part; the title block; the revision table — "De doorsnede toont binnenin; het stempel zegt materiaal en revisie." — Doorsnede, Stempel, Revisie, Algemene tolerantie
  3. Datums A, B, C as surfaces touching a fixture — "Referenties zijn de vlakken waarop je meet." — Referentie
  4. The tolerance frame read cell by cell; boxed basic dimensions — "Positie Ø0,3 rond de theoretisch exacte maat." — Tolerantiekader, Positietolerantie, Theoretisch exacte maat
  5. The CMM measures 0,12 off; MMC bonus as the hole grows — "Met maximum-materiaalvoorwaarde groeit de zone mee." — Maximum-materiaalvoorwaarde, 3D-meetmachine
- **`eng.drawings.loop`** · numbers: pid: T-101 20 m³, LT 101, LIC 101, LV 101; loop: 72 °C for 15 s, TT 401 71,2, SP 72,5, error 1,3, output 45 → 58%; pid_control: level 60%, swings 52–68% every 4 min, stiction 2–3%.
  1. The P&ID symbols; each turns into the real thing — "Een P&ID toont leidingen, tags en signalen." — P&ID, Tagnummer, Transmitter, Regelklep, Veiligheidsklep, DCS
  2. A pasteuriser: TT measures, TIC compares, TV opens — "SP, PV en OP: meten, vergelijken, bijsturen." — Setpoint (SP), Proceswaarde (PV), Uitgang (OP), Regelafwijking, Gesloten regelkring
  3. Manual mode, open loop — "Open sturing: niemand kijkt of het klopt." — Open sturing
  4. A trend: P leaves an offset, I removes it, too much gain overshoots — "P, I en D elk op hun manier." — P, I, D, Versterking, Offset, Doorschot
  5. The valve at its limit: integrator wind-up — "Windup: na de grens schiet hij door." — Integrator-windup
  6. A level loop swings; in manual it stops; the valve sticks — "Stiction: de klep, niet de inregeling." — Stiction
- **`eng.drawings.plc`** · numbers: plc: 28 s cycle; starting the pusher before B12 saves 3 s; step 40 interlock.
  1. PLC, HMI, SCADA as three layers — "De PLC stuurt, de HMI toont, SCADA overziet." — PLC, HMI, SCADA
  2. Step 40 waits for B12 "doos op positie" — "Een interlock voorkomt vastlopers." — Interlock
  3. A guard switch and a safety relay — "Een veiligheidsfunctie beschermt mensen." — Veiligheidsfunctie
  4. Someone tapes a sensor: a bypass — "Een overbrugging zet de beveiliging stil weg." — Overbrugging

#### eng.safety (Veilig werken), 4 films (electrical work is in `eng.switchgear.fiverules`)

| id | Title | Serves | Dur | Adds | P |
|---|---|---|---|---|---|
| `eng.safety.loto` | Vergrendelen en labelen / Lockout-tagout | loto; also power.hydraulics | 120 | the strict order on a hydraulic press, with every energy source | P1 |
| `eng.safety.permit` | Een vergunning en een LMRA op het dak / A permit and a last-minute risk check on the roof | permit, lmra | 120 | two jobs on one roof: the permit roles and the LMRA that catches the clash | P1 |
| `eng.safety.risk` | Van gevaar tot maatregel / From hazard to measure | risk | 80 | the hierarchy of controls worked through on a tank | P2 |
| `eng.safety.incidents` | Leren van een bijna-ongeval / Learning from a near miss | incidents | 80 | the walk to the blind corner instead of a blame report | P2 |

- **`eng.safety.loto`** · numbers: loto example: hydraulic press die change; ram parked at the top; main switch and air valve locked; safety block; accumulator bled to 0 bar; start attempt; NEN-EN-ISO 14118.
  1. A press with its energy sources lit: electric, air, hydraulic, the raised ram — "Stoppen is niet scheiden: een noodstop kan worden teruggezet." — Noodstop, Opgeslagen energie
  2. The fitter tells the operators and stops the press normally — "Eerst melden, dan normaal stoppen." — Vergrendelen en labelen
  3. Main switch off, air valve closed; his own lock and tag on each isolation point — "Elk scheidingspunt een eigen slot met naam." — Scheidingspunt
  4. Many workers: the keys into a group lock box, each puts a personal lock on it — "Met meer mensen: de groepsslotkast." — Groepsslotkast
  5. A safety block under the ram, then the accumulator bled to 0 bar — "Eerst blokkeren, dan de druk eraf." (the order is shown with a number badge)
  6. He presses start: nothing happens; the switch back to off — "Proberen te starten bewijst: energieloos." — Energieloos
  7. Restart: tools out, guards closed, everyone clear, only he removes his locks — "Alleen wie het slot hing, haalt het eraf."
- **`eng.safety.permit`** · numbers: permit example: hot work 08:00–16:00, finished 14:30, fire watch stays; Piper Alpha 1988, 167 deaths; lmra example: two mechanics, wet roof, unexpected welding.
  1. The permit board in the control room; a hot-work permit — "Heet werk vraagt een werkvergunning." — Werkvergunning, Heet werk, Besloten ruimte
  2. Issuer and holder walk the area; cover the hydraulic unit; extinguisher; both sign — "De afgever bevestigt dat het gebied klaar is; de houder neemt hem aan." — Afgever, Houder
  3. The welding; a fire watch stays after 14:30 — "Een brandwacht blijft ook na de klus." — Brandwacht
  4. Two mechanics at the ladder with their work order; the VCA card — "De LMRA: vlak voor de start, door wie het werk doet." — LMRA, VCA, Werkorder, Aannemer
  5. Wet roof, a welder they did not expect: they stop and call — "Klopt het niet, dan begin je niet." — Werkonderbreking
  6. They agree who works where; work starts an hour later — "Twee vergunningen die elk kloppen, kunnen samen gevaarlijk zijn."
- **`eng.safety.risk`** · numbers: none fixed (the example works through the hierarchy for solvent cleaning).
  1. A solvent tank, an operator with a headache — "Gevaar is de bron, risico is kans × gevolg." — Gevaar, Risico
  2. The RI&E list — "De RI&E zet alle risico's op een rij." — RI&E
  3. The hierarchy as steps: eliminate, substitute, engineer, organise, PPE — "Eerst de bron, PBM als laatste." — Arbeidshygiënische strategie, Technische maatregel, PBM
- **`eng.safety.incidents`** · numbers: none fixed (the forklift near miss at a blind corner).
  1. A forklift nearly hits a planner; she reports it — "Een bijna-ongeval is gratis les." — Bijna-ongeval, Meldplicht
  2. Heinrich's pyramid, then the SIF view — "Tel niet alleen; zoek wat ernstig had kunnen worden." — Piramide van Heinrich, SIF, Verzuimongeval
  3. The safety officer walks with her and the driver to the corner — "Just culture: wat maakte het moeilijk, niet wie." — Just culture
  4. A mirror and a marked crossing — "De maatregel zit in de plek."

#### eng.fluids (Pompen, stroming en warmte), 4 films, all P1

| id | Title | Serves | Dur | Adds |
|---|---|---|---|---|
| `eng.fluids.pumping` | Pomp, leiding en werkpunt / Pump, pipe and duty point | flow, pumps, speed | 130 | water flowing, the two curves crossing, throttling versus a VFD |
| `eng.fluids.cavitation` | Cavitatie / Cavitation | cavitation | 100 | the pressure dip at the impeller eye, bubbles imploding |
| `eng.fluids.heat` | De warmtewisselaar / The heat exchanger | heat | 90 | counterflow plates, the temperature profiles, fouling building up |
| `eng.fluids.steam` | Stoom, condenspot en waterslag / Steam, trap and water hammer | steam | 110 | steam condensing, a trap cycling, failed open and failed shut |

- **`eng.fluids.pumping`** · numbers: flow: DN50, 10 m³/h → 1,4 m/s, 0,8 bar; pumps: BEP 100 m³/h, need 60, the pump makes 45 m where 25 m is needed; speed: 30 kW, 2.000 h full, 6.000 h at 70% (the saving is asserted from the lesson).
  1. Water in a DN50 pipe; head as a column height; the pressure-drop gauge — "Opvoerhoogte in meters; drukval door wrijving." — Opvoerhoogte, Drukval, DN
  2. Dye threads: laminar, then turbulent; Re counter — "Boven een getal van Reynolds van zo'n 4.000 wordt het turbulent." — Laminair, Turbulent, Getal van Reynolds
  3. Centrifugal versus positive displacement pump (cutaways) — "Een centrifugaalpomp slingert, een verdringerpomp duwt." — Centrifugaalpomp, Verdringerpomp
  4. Pump curve and system curve cross at the duty point; the BEP dot — "Het werkpunt ligt waar de curves kruisen." — Pompkarakteristiek, Leidingkarakteristiek, Werkpunt, BEP
  5. A valve throttles the flow away; a VFD slows the pump instead — "Smoren verspilt; toerental omlaag scheelt met de derde macht." — Frequentieregelaar, Affiniteitswetten, Smoren, Statische opvoerhoogte, Belastingprofiel
- **`eng.fluids.cavitation`** · numbers: cavitation: water boils at 0,023 bar(a) at 20 °C and 0,47 at 80 °C; 95 °C: 1,01 − 0,85 = 0,16 bar ≈ 1,7 m; NPSHa = 1,7 + 1,5 − 0,5 = 2,7 m < NPSHr 3,0; the tank 1 m higher → 3,7 m.
  1. A pan boiling at low pressure, not by heat — "Koken hangt af van druk: onder de dampspanning kookt water ook koud." — Dampspanning
  2. Tank, suction line, pump: the pressure line dips at the impeller eye — "De laagste druk zit bij de pompinlaat." — Zuigleiding
  3. Bubbles form at the eye and implode on the vanes (slowed down); gravel noise; a pitted impeller — "Dat is cavitatie: imploderende dampbellen vreten de waaier aan." — Cavitatie
  4. NPSHa as a stack of bars: surface pressure, height, minus friction, minus vapour — "NPSHa 2,7 m tegen NPSHr 3,0: hij caviteert." — NPSHa, NPSHr
  5. The tank goes up 1 m: NPSHa 3,7 m, the noise stops — "De oplossing zit in de installatie, niet in het pompmerk."
- **`eng.fluids.heat`** · numbers: heat: 5.000 kg/h, cp 3,8, 70 → 30 °C → 211 kW; water 15 → 25 °C (flow asserted from the lesson).
  1. Plate heat exchanger opens up: plates, gaskets, two streams — "Twee stromen, gescheiden door dunne platen." — Platenwarmtewisselaar
  2. Shell and tube beside it — "De pijpenbundel kan hogere druk en vuil aan." — Pijpenbundelwarmtewisselaar
  3. The heat duty: 211 kW — "Warmtelast = massa × cp × ΔT." — Warmtelast
  4. Counterflow temperature lines; the approach temperature at the end — "Tegenstroom haalt de meeste warmte over." — Tegenstroom, Naderingstemperatuur
  5. Fouling layers grow over months; the outlet temperature drifts — "Vervuiling isoleert: de prestatie zakt langzaam." — Vervuiling
- **`eng.fluids.steam`** · numbers: steam: 7 bar(g) ≈ 170 °C, 2.050 kJ/kg; flash steam about 13%; 30 of 200 traps open, 15 kg/h, 8.000 h → 120 t, €40/t → €4.800 per trap, €144.000.
  1. Steam enters a heater and condenses on the wall — "Verzadigde stoom geeft zijn warmte af als hij condenseert." — Verzadigde stoom, Condensaat
  2. A trap opens for water and closes for steam (cutaway) — "De condenspot laat water door en houdt stoom tegen." — Condenspot
  3. A trap stuck open blows steam; one stuck shut floods; a slug of water hammers the pipe — "Dicht zittend: waterslag." — Waterslag
  4. Condensate to a vent: a lazy white plume — "Flashstoom is geen lek." — Flashstoom
  5. 30 open traps: the euro counter — "€144.000 per jaar voor potten van een paar honderd euro."

#### eng.power (Motoren, aandrijvingen en perslucht), 5 films

| id | Title | Serves | Dur | Adds | P |
|---|---|---|---|---|---|
| `eng.power.motor` | Het draaiveld / The rotating field | basics, motors | 120 | three phases making a field that turns; the rotor slipping behind | P1 |
| `eng.power.drives` | Een motor aanlopen / Starting a motor | drives | 100 | the current and torque traces of DOL, star-delta, soft starter and VFD | P1 |
| `eng.power.air` | Perslucht: de dure utility / Compressed air | air | 90 | from compressor to tool, leaks hissing all weekend | P1 |
| `eng.power.hydraulics` | Hydrauliek / Hydraulics | hydraulics | 110 | oil flow through pump, valve and cylinder; lost flow turning into heat | P1 |
| `eng.power.energy` | Een week stroom in de fabriek / A week of power in the factory | energy | 80 | the load profile over a week, base load and the monthly peak | P2 |

- **`eng.power.motor`** · numbers: basics: 11 kW / (0,70 × 0,92) = 17,1 kW, 6.000 h; motors: 120 × 50 / 4 = 1.500; 30 kW, 1.470 rpm → slip 2%, 195 Nm; IE1 90% → IE3 93,6%, 1,1 kW × 6.000 h ≈ 6.400 kWh, €960.
  1. kW versus kWh: a power meter and an energy counter — "Vermogen is nu, energie is opgeteld." — kW, kWh, Rendement
  2. Three phases as three sine waves; the field in the stator turns — "Draaistroom maakt een draaiend veld." — Draaistroom, Arbeidsfactor
  3. Cutaway: stator windings, the squirrel-cage rotor dragged along — "De rotor loopt het veld net achterna." — Asynchrone motor, Rotor
  4. The field at 1.500, the rotor at 1.470: slip 2% — "Synchroon toerental min slip." — Synchroon toerental, Slip
  5. The nameplate read line by line; IE class; insulation class F 155 °C — "Het typeplaatje vertelt alles." — Typeplaatje, IE-klasse, Isolatieklasse
- **`eng.power.drives`** · numbers: drives: inrush 6–8 × nominal; star-delta ≈ ⅓; crusher 90 kW, 160 A → 1.000–1.300 A at start; soft starter 3–4 ×; at 80% speed about half the power.
  1. A contactor slams a motor on: the current spike, the jerk — "Direct inschakelen: 6 tot 8 keer de stroom." — Direct inschakelen (DOL), Magneetschakelaar
  2. Star, then delta — "Ster-driehoek start met een derde van stroom en koppel." — Ster-driehoekschakeling
  3. A soft starter ramps the voltage; a loaded crusher stalls — "Een softstarter beperkt de piek, maar ook het koppel." — Softstarter
  4. A VFD: full torque from standstill at nominal current — "De frequentieregelaar: traploos en rustig." — Frequentieregelaar
  5. A servo with encoder positions to a tenth of a millimetre — "Een servoregelaar gaat over precisie, niet over energie." — Servoregelaar
- **`eng.power.air`** · numbers: air: 75 kW compressor, 10 m³/min, 40% loaded at the weekend → 4 m³/min leakage (the euros asserted from the lesson).
  1. Compressor room: heat recovery on the cooler — "Het meeste van de compressorenergie wordt warmte." — Warmteterugwinning
  2. Dryer, network, the regulator unit at the machine — "Droger, netdruk, verzorgingseenheid." — Droger, Netdruk, Verzorgingseenheid
  3. The weekend test: nothing runs, the compressor still loads 40% — "Lektest: 4 m³ per minuut lekt weg." — Lektest
  4. Someone blows chips off with air — "Oneigenlijk gebruik is ook verlies." — Oneigenlijk gebruik
- **`eng.power.hydraulics`** · numbers: hydraulics: 200 bar × 7.854 mm² ≈ 157 kN; Ø125 bore = 12.272 mm², 60 L/min → 81 mm/s, measured 60 mm/s at 70 °C; ISO 4406 18/16/13.
  1. Pressure on a piston: the force arrow, 157 kN — "Kracht = druk × oppervlak." — (intro)
  2. Pump makes flow; the directional valve routes it; the cylinder moves — "Het stuurventiel kiest de richting." — Stuurventiel, Cilindersnelheid
  3. The relief valve opens to tank above its setting — "Het drukbegrenzingsventiel begrenst de druk." — Drukbegrenzingsventiel
  4. The accumulator holds pressure with the pump off — "De accumulator blijft onder druk: drukloos maken vóór onderhoud." — Accumulator
  5. 81 mm/s expected, 60 measured, hot oil: internal leakage turns into heat — "Verloren debiet wordt warmte." 
  6. Particles counted (18/16/13); a pinhole jet and the cardboard test — "Vuil is vijand één; een injectieletsel is een spoedgeval." — ISO 4406, Injectieletsel
- **`eng.power.energy`** · numbers: energy: 1.200 kW × 80 h = 96.000 kWh; 400 kW × 88 h = 35.200 kWh → 27% without production.
  1. A week's load profile — "Het belastingprofiel van een week." — Belastingprofiel
  2. The floor of 400 kW at night and weekends — "Basislast: 27% van de kWh terwijl er niets gemaakt wordt." — Basislast
  3. The monthly peak against the contracted transport capacity; congestion — "Eén piek bepaalt het hele maandtarief." — Gecontracteerd transportvermogen, Maandpiek, Netcongestie
  4. kWh per product — "Energie-intensiteit: kWh per goed product." — Energie-intensiteit

#### eng.improve, eng.spc, eng.reliability, eng.cost, eng.industry40 (13 films)

| id | Title | Serves | Dur | Adds | P |
|---|---|---|---|---|---|
| `eng.improve.8d` | Een 8D van klacht tot afsluiting / An 8D from complaint to closure | 8d, verify, facilitate | 120 | the disciplines on a timeline of days and weeks, with the team in the room | P2 |
| `eng.improve.evidence` | Bewijs zoeken: is/is-niet, data, DOE / Finding evidence | isisnot, data, doe | 110 | `doe`; a leak problem narrowed down machine by machine | P2 |
| `eng.spc.msa` | Kun je dit meten? / Can you measure this? | msa, attribute | 90 | the GRR study and an attribute study, people and parts | P2 |
| `eng.spc.ppk` | Eerst stabiel, dan capabel / First stable, then capable | charts, ppk, nonnormal | 90 | one morning against five weeks | P3 |
| `eng.reliability.rcm` | De verborgen storing / The hidden failure | rcm, criticality, program | 100 | the standby pump that never starts until it must | P2 |
| `eng.reliability.spares` | Reservedelen en levensduurkosten / Spares and life-cycle cost | spares, lcc | 90 | stock and risk over time; repair or replace | P3 |
| `eng.cost.costprice` | Een kostprijs opbouwen / Building a cost price | costprice, hourrate, contribution, makebuy, shouldcost | 110 | a bracket going through the shop, euros stacking per step | P2 |
| `eng.cost.capex` | Een investeringscase / An investment case | capex | 80 | cash over years, discounting | P3 |
| `eng.industry40.datapath` | Van signaallamp tot dashboard / From stack light to dashboard | stack, mes, machinedata, twin, case | 120 | a signal travelling up the stack, cleaned and given context | P2 |
| `eng.industry40.vision` | AI-inspectie in de praktijk / AI inspection in practice | vision | 90 | `vision` (threshold); labelling, training, shadow mode in time | P2 |

(The module tables above hold 37 films: flow 5, quality 4, process 4, mechanics 5, maintenance 3, drawings 3, safety 4, fluids 4, power 5. With these 10, section 3.5 has 47.)

- **`eng.improve.8d`** · numbers: 8d: 9.000 sorted, 140 rejected; D3 within 24 h; D4/D5 within about ten working days; visual sorting misses 10–20%; facilitate: 6 bearing failures in 4 months.
  1. A customer complaint arrives; D0–D8 cards on the wall — "8D: acht stappen van klacht tot afsluiting." — 8D
  2. D3: quarantine, 100% sorting of 9.000 — "Indammen beschermt de klant, maar lost niets op." — Indammen
  3. D4 with two legs: why it was made, why it escaped — "Een grondoorzaak heeft twee poten." — Grondoorzaak, Ontstaansoorzaak, Ontsnappingsoorzaak
  4. The facilitator writes the problem statement; facts and theories in two columns; the boss's anchor — "Feiten links, theorieën rechts." — Gespreksleider, Probleemstelling, Feit, Theorie, Ankereffect
  5. On/off verification; escape point; read-across to similar machines; the PFMEA and control plan updated — "Aan, uit, weer aan: dan pas bewezen." — Blijvende maatregel, Aan/uit-verificatie, Escape point, Read-across, PFMEA, Control plan
- **`eng.improve.evidence`** · numbers: isisnot: 3% leak failures from week 14, all from machining centre 2; data: 1,8% versus "normal 4%"; doe: 8 / 9 / 7 / 2%.
  1. Is and is-not columns fill: centre 2 yes, centre 1 no — "Het onderscheid wijst naar de oorzaak." — Is/is-niet, Onderscheid
  2. Split by cavity and by batch — "Stratificatie: splits de data." — Stratificatie, Caviteit, Charge
  3. A run chart: one good day within normal variation — "Eén goede dag is nog geen effect." — Normale variatie, Run chart, Regel van drie, Betrouwbaarheid, Gauge R&R
  4. The 2 × 2 grid; the interaction — "Twee factoren samen: 2%." — Factor, Niveau, Respons, Hoofdeffect, Interactie, OFAT
- **`eng.spc.msa`** · numbers: msa: Ø12 ±0,02, R&R 28% of the tolerance, mostly repeatability; attribute: 40 panels, 3 inspectors, 2 rounds, about 90% self-agreement.
  1. Ten parts, three operators, three repeats — "Studievariatie verdeeld over herhaalbaarheid en reproduceerbaarheid." — Herhaalbaarheid, Reproduceerbaarheid, Studievariatie
  2. ndc, bias against a master, resolution — "Kan het systeem de delen uit elkaar houden?" — ndc, Bias, Resolutie
  3. Inspectors judge orange peel; kappa — "Kappa: eens, en niet door toeval." — Overeenstemmingsanalyse, Kappa
  4. Escapes and false rejects; a limit sample; a stopgap — "Een grensmonster maakt de grens zichtbaar." — Ontsnapping, Onterechte afkeur, Noodmaatregel, Grensmonster
- **`eng.spc.ppk`** · numbers: charts: 4-cavity subgroups; ppk: Cpk 2,1 from 30 parts in one morning versus Ppk 1,05 over 5 weeks; nonnormal: Cpu 1,56 on skewed data.
  1. The right chart per data type — "I-MR, p, np, c, u: kies op je data." — I-MR-kaart, p-kaart, np-kaart, c-kaart, u-kaart, Rationele subgroep
  2. A morning study versus five weeks — "Kortetermijnsigma tegen totale sigma." — Cpk, Ppk, Kortetermijnsigma, Totale sigma, Stabiel proces, Processtudie
  3. A skewed distribution and its probability plot — "Scheve data: rekenen met percentielen." — Scheve verdeling, Eenzijdige specificatie, Cpu, Kansplot, Percentielmethode
- **`eng.reliability.rcm`** · numbers: rcm: standby pump B with a monthly visual check; criticality: 210 of 350 assets in class A; program: 2.000 work orders, 70% breakdown, 60% coded "overig".
  1. Pump A runs; B waits; the function — "RCM begint bij de functie." — Functionele storing, Faalwijze
  2. B has been broken for months; nobody knows — "Een verborgen storing zie je pas als je hem nodig hebt." — Verborgen storing
  3. The monthly "looks fine" becomes a start test — "Een failure-finding-taak test of hij echt start." — Failure-finding-taak, P-F-interval
  4. Criticality matrix: 210 of 350 in A is too many — "Kritikaliteit: waar richt je je op?" — Kritikaliteit, Risicomatrix, Redundantie, Buffer, Bottleneck, Ankerasset
  5. Bad-actor list and leading indicators — "Een programma kijkt vooruit." — Bad actor, Wrench time, PM-compliance, Herhaalstoring, Voorlopende indicator, Achterlopende indicator
- **`eng.reliability.spares`** · numbers: spares: €80.000 reducer, €1.500 per hour, 14 weeks lead time; lcc: compressor 90 kW, overhaul €18.000, 500.000 kWh at €0,20.
  1. An insurance spare on the shelf against 14 weeks of standstill — "Een verzekeringsdeel koop je voor het risico." — Verzekeringsdeel, Levertijd, Voorraadkosten
  2. Stock falls to the reorder point; min/max; dead stock gathers dust — "Bestelpunt, min/max, dode voorraad." — Bestelpunt, Min/max, Dode voorraad
  3. Overhaul or a new VSD compressor: present value of each path — "Levensduurkosten: energie weegt het zwaarst." — Levensduurkosten, Discontovoet, Contante waarde, Equivalente jaarkosten, Sunk cost
- **`eng.cost.costprice`** · numbers: costprice: €2,40 steel, laser 1,2 min and bending 1,8 min at €80/h, set-up 1 h per series of 50, 3% scrap; hourrate: €600.000, 8 years, €40.000 residual, 6% interest; contribution: 200.000 caps at €0,090; makebuy: €46 = 18 + 20 (12 fixed) + …; shouldcost: €17,50 offered against €4,05 + €7,00 + €0,40 + ….
  1. The bracket moves laser → press brake; euros stack per step — "Kostprijs = materiaal + machinetijd + omstellen + uitval + opslag." — Kostprijs, Omstelkosten per stuk, Overheadopslag, Activity-based costing, Uitval, Materiaalrendement
  2. The machine-hour rate built from depreciation, interest and productive hours — "Het uurtarief hangt aan de productieve uren." — Machine-uurtarief, Afschrijving, Productieve uren, Restwaarde, Calculatorische rente, Aanloop
  3. Fixed and variable split; a night order — "Dekkingsbijdrage: wat er boven de variabele kosten overblijft." — Vaste kosten, Variabele kosten, Dekkingsbijdrage, Break-evenvolume, Integrale kostprijs, Bottleneck
  4. Make or buy: only the relevant costs remain — "Vaste kosten blijven ook als je koopt." — Relevante kosten, Total cost of ownership, Opportuniteitskosten, Kerncompetentie, Veiligheidsvoorraad, Levertijd
  5. A quote next to your should-cost — "Should-cost: wat het zou moeten kosten." — Should-cost, Kostenopbouw, Materiaalindexclausule, Leercurve, Bewerkingsvolgorde, Value engineering
- **`eng.cost.capex`** · numbers: capex: €240.000; 4 × €55.000 = €220.000 − €20.000 = €200.000 per year → 1,2 years (as claimed in the lesson).
  1. Payback line; the claim — "Terugverdientijd is de simpelste maat." — Terugverdientijd, Kasbesparing
  2. Discounted bars shrink per year — "NCW telt de tijd mee." — NCW, Discontovoet, IRR
  3. Sliders: what if only 2 people go? — "Gevoeligheidsanalyse: welke aanname draagt de case?" — Gevoeligheidsanalyse
- **`eng.industry40.datapath`** · numbers: stack: SAP nightly versus a live OEE dashboard; mes: 82% OEE with the ideal cycle 2,4 s from the cost norm; machinedata: 61% versus 84%, yellow means waiting; twin: €2 million cell, 1.200 versus 1.000 per shift; case: 25 machines, €250.000, 10% benchmark → €1,2 million.
  1. The pyramid builds up: PLC, SCADA, historian, MES, ERP; OT versus IT — "Elke laag heeft zijn eigen tempo." — PLC, SCADA, Historian, MES, ERP, OT
  2. A stack-light sensor and an edge gateway; OPC UA and MQTT to a broker — "De gateway leest, buffert en stuurt door." — OPC UA, MQTT, Edge gateway, Samplefrequentie, Contextualisering
  3. The MES dispatches orders, keeps genealogy, asks a reason code — "Het MES weet welke order, welk product, welke reden." — Dispatching, Genealogie, Redencode, Ideale cyclustijd, Stamdata
  4. Yellow counted as stopped: 61% against 84% — "Valideer het signaal op de vloer."
  5. A digital twin with no breakdowns promises 1.200 — "Een twin zonder storingen is te mooi." — Digital twin, Virtuele inbedrijfstelling, Discrete-event-simulatie, Validatie, Replicatie
  6. The case: baseline, pilot purgatory, a DMZ between networks — "Nulmeting eerst; segmenteer het netwerk." — Total cost of ownership, Nulmeting, Pilot purgatory, Netwerksegmentatie, DMZ, NIS2
- **`eng.industry40.vision`** · numbers: vision: 99,5% "accuracy" at a 1% defect rate, 400 demo images.
  1. Rule-based vision measures an edge; deep learning learns from examples — "Regels of een getraind model." — Regelgebaseerde vision, Deep learning
  2. People label images — "Labelen bepaalt wat het model leert." — Labelen
  3. 99,5% at 1% defects: it could miss every one — "Kijk naar escapes en onterechte afkeur, niet naar nauwkeurigheid." — Onterechte afkeur, Escape
  4. Shadow mode: the camera judges next to the inspector for weeks — "Eerst meekijken, dan pas beslissen." — Shadow mode

### 3.6 Elektriciteitsnet (grid track), 17 films

| id | Title nl / en | Serves | Dur | Existing figure; the film adds | P |
|---|---|---|---|---|---|
| `eng.gridbasics.path` | Van onderstation tot stopcontact / From substation to socket | levels, path | 110 | `levels` (voltage slider); the journey through every station with what you see there | P1 |
| `eng.gridbasics.load` | Een avondpiek in de straat / An evening peak in the street | basics, load | 100 | none; a household's kW over a day, then 150 homes with heat pumps and EVs | P1 |
| `eng.gridbasics.congestion` | Een vol net / A full grid | congestion, roles | 100 | none; the queue, the few peak hours, the flex deal | P1 |
| `eng.transformers.principle` | Hoe een transformator werkt / How a transformer works | principle | 110 | `load` (that figure shows heating, not the principle); the magnetising flux, the turns ratio, losses, the tap changer | P1 |
| `eng.transformers.ageing` | Warmte en veroudering / Heat and ageing | ageing | 90 | `load`; the evening peak through a day, hotspot and paper ageing; a DGA sample | P1 |
| `eng.transformers.cables` | Een MS-kabel en een mof / An MV cable and a joint | cables | 100 | none; the cable's layers, making a joint, water treeing | P1 |
| `eng.transformers.faults` | Een kabelfout vinden / Finding a cable fault | faults | 120 | `gridops.switching` covers isolating and restoring; the film adds the reflectometer echo, the thumper and the repair | P1 |
| `eng.switchgear.devices` | Wat kan deze schakelaar? / What can this switch do? | devices, installations | 120 | none; breaker, load-break switch, fuse, disconnector and earthing switch; the arc quenched in vacuum; an RMU | P1 |
| `eng.switchgear.protection` | Van kortsluiting tot uitschakeling / From short circuit to trip | protection, selectivity | 110 | `selectivity`; the milliseconds inside CT, relay and breaker | P1 |
| `eng.switchgear.fiverules` | De vijf veiligheidsregels / The five safety rules | switchgear.safety, gridops.switching, safety.nen3140 | 140 | none; a planned cable job with the IV, the WV and the switching plan in strict order | P1 |
| `eng.switchgear.automation` | Een ring die zichzelf herstelt / A self-healing ring | automation | 90 | `gridops.switching` (remote mode); a self-healing sequence and its customer minutes | P1 |
| `eng.gridops.outage` | Een storing in de meldkamer / An outage in the control room | outage | 110 | `gridops.switching` (you switch); the control room's view: SCADA, calls, crews, SAIDI | P1 |
| `eng.gridops.chain` | Van aanvraag tot inbedrijfname / From request to energising | chain, workload, transformers.connections, transformers.standard, gridplanning.execution | 110 | none; the queue of jobs, steps in series versus in parallel | P2 |
| `eng.gridops.assets` | Assetmanagement en data / Asset management and data | assets, data | 90 | none; the risk matrix and the GIS out of date | P2 |
| `eng.gridplanning.loadflow` | Loadflow en N-1 / Load flow and N-1 | loadflow, redundancy | 110 | `n1` (trip a transformer); current flowing along a feeder, the voltage band, then N-1 | P1 |
| `eng.gridplanning.flex` | Flex en batterijen op een winteravond / Flex and batteries on a winter evening | flex, storage | 110 | none; the day profile with a cold store shifting and a battery charging and discharging | P1 |
| `eng.gridplanning.investment` | Investeren onder onzekerheid / Investing under uncertainty | investment | 80 | none; scenarios as fan lines, no-regret first | P3 |

- **`eng.gridbasics.path`** · numbers: levels: 100 MW at 10 kV ≈ 5.800 A, at 150 kV ≈ 385 A (15× less current, 225× less loss); path: Tilburg, 150 kV, two 150/10 kV transformers, 10 kV busbar, a ring of 12 netstations, station 7 with 400 kVA and six LV cables, 35 homes, main fuse 3 × 25 A.
  1. Pylons at 150 kV into a substation fence — "TenneT brengt de hoogspanning; de regionale netbeheerder neemt het over." — TenneT, Hoogspanning, Regionale netbeheerder
  2. The 150/10 kV transformers and the MV busbar — "Waarom hoog? 100 MW op 150 kV is 15 keer minder stroom." — Middenspanning, Onderstation
  3. A cable ring past 12 stations; the normally open point glows — "De ring wordt op één punt open bedreven." — Normaal openpunt
  4. Inside netstation 7: MV switchgear, transformer, the LV rack with fuses — "Het netstation zet 10 kV om naar 400 V." — Netstation, MS-ruimte, Laagspanning
  5. The street cable to a house; the main fuse and meter — "Tot en met de meter is het van de netbeheerder." — Hoofdzekering
- **`eng.gridbasics.load`** · numbers: basics: 2.700 kWh per year ≈ 0,31 kW on average, 7 kW at 18:00, +11 kW EV; load: 400 kVA, 150 homes, 1,5 kVA each → 225 kVA (56%); +50 heat pumps × 3 × 0,8 = 120 kVA; EVs (asserted from the lesson).
  1. Volts as pressure, amps as flow, watts as power — "Spanning × stroom = vermogen." — Spanning, Stroomsterkte, kW
  2. A day's kW line for one home; the kWh area — "Gemiddeld 0,31 kW, om 18:00 uur 7." — kWh, Wisselstroom, Driefasig
  3. 150 homes don't peak together — "Gelijktijdigheid: niet iedereen tegelijk." — Gelijktijdigheid, Piekbelasting
  4. Heat pumps and EVs stack up on a winter evening; kVA versus kW; an inverter at noon — "De piek groeit van 225 naar ver boven 400 kVA." — kVA, Arbeidsfactor, Omvormer
- **`eng.gridbasics.congestion`** · numbers: congestion: connections above 3 × 80 A (≈ 55 kVA), substation 30 MVA, peak 29 MVA, 6 MVA requested, new substation in about 7 years, only 180 h per year above 24 MVA (2%), a cold store shifts 4 MVA; roles: 2,8 million customers, 70 million customer minutes → 25 minutes.
  1. A business park; requests pile up in a queue; the capacity map turns red — "Netcongestie: op piekmomenten te weinig transportcapaciteit." — Netcongestie, Grootverbruiker, Capaciteitskaart
  2. The year's load curve: only 180 hours above 24 MVA — "Het net zit maar een paar honderd uur per jaar vol."
  3. GOPACS; a cold store shifts 4 MVA; a flexible contract — "Congestiemanagement: betaald schuiven." — Congestiemanagement, GOPACS, Flexibel contract
  4. Supplier versus grid operator; the regulator; outage minutes; the investment plan — "De netbeheerder is een gereguleerd monopolie." — Energieleverancier, Jaarlijkse uitvalduur, Gereguleerd monopolie, ACM, Investeringsplan
- **`eng.transformers.principle`** · numbers: principle: 10 kV / 400 V → ×25; 400 kVA = 577 A at 400 V and 23 A at 10 kV; 630 kVA: about 0,5 kW no-load and 5 kW full-load losses, about 99% efficiency; Dyn5 → 10.000 / 230 ≈ 43 per coil; tap step 2,5%, 252 V → about 246 V.
  1. Two windings on an iron core; alternating current in the first — "Wisselstroom maakt een wisselend veld in de kern." — (intro)
  2. The flux pulses around the core and induces a voltage in the second winding — "Het veld wekt spanning op in de tweede wikkeling." — Wikkelverhouding
  3. Voltage ÷ 25, current × 25; 577 A versus 23 A — "Het vermogen blijft bijna gelijk."
  4. The core warms a little all night; the windings warm with the load squared — "Nullastverliezen altijd, belastingverliezen met het kwadraat." — Nullastverliezen, Belastingverliezen
  5. Oil rises, cools in the fins, sinks; the 100 Hz hum — "ONAN: olie en lucht stromen vanzelf." — ONAN
  6. The tap changer one step down: 252 V becomes about 246 V; a substation unit doing it on load — "Een aftakschakelaar spanningsloos, een regelschakelaar onder last." — Aftakschakelaar, Regelschakelaar
- **`eng.transformers.ageing`** · numbers: ageing: 40–60 years when cool, thermal time constant about 3 hours; DGA acetylene 0 → 3 → 9 ppm in a year on a 40 MVA unit.
  1. Paper insulation in oil around copper — "Warmte breekt het papier langzaam af." — Hotspottemperatuur
  2. An evening peak; the oil lags about 3 hours behind — "Thermische traagheid vangt een korte piek op." — Thermische traagheid, Belastingprofiel
  3. An oil sample to the lab; gases per fault type — "DGA: de gassen in de olie vertellen wat er binnen gebeurt." — DGA, Partiële ontlading
  4. Acetylene rising: monthly samples, inspect the tap changer — "Acetyleen betekent vlambogen: plan binnen zes weken."
- **`eng.transformers.cables`** · numbers: cables: 2,4 km route, 600 m drums → 4 lengths, 3 joints, 2 terminations, one transition joint to the old paper cable.
  1. Peeling an XLPE cable layer by layer; an old paper-insulated cable next to it — "XLPE nieuw, GPLK oud." — XLPE, GPLK
  2. Drums of 600 m: lengths and joints along a route — "Elke lengte vraagt een mof." — Mof
  3. The joint being built; a transition joint between the two types; a termination at the switchgear — "Een overgangsmof verbindt oud en nieuw." — Overgangsmof, Eindsluiting
  4. Water trees grow in old XLPE over years — "Water treeing: vocht kruipt in de isolatie." — Water treeing
- **`eng.transformers.faults`** · numbers: faults: 10–20 stations per feeder; pulse speed 160 m/µs, the echo halved; example: 14:10 trip, 1.800 customers; 14:40 crews at stations 4 and 5; 15:30 everyone back; fault 320 m from station 4; repaired next day by 17:00.
  1. 14:10: the breaker trips; 1.800 customers off — "Een streng valt uit; het bedrijfsvoeringscentrum ziet het meteen." — Streng, Normaal openpunt
  2. 14:40: indicators at station 4 lit, at 5 not — "De fout zit tussen de laatste die het zag en de eerste die niets zag." — Kortsluitverklikker
  3. 15:30: switches open around the section, the open point closes, everyone back — "Herstel door schakelen; de ring draait nu zonder reserve."
  4. The reflectometer pulse runs out and echoes back: 320 m — "Echotijd heen en terug, gedeeld door twee." — Reflectiemeter
  5. The thumper cracks; a crew walks with a ground microphone to the driveway — "De stootgenerator laat de fout doorslaan." — Stootgenerator
  6. Digging, two joints, testing; the KLIC map shown — "Graafschade: daarom eerst een KLIC-melding." — KLIC-melding
- **`eng.switchgear.devices`** · numbers: devices: MV breakers rated 16–25 kA; fault level 15–20 kA near a substation; the example: a 20 kA breaker, 8 kA fault, opening in about 0,3 s; installations: 20.000 RMUs × 1,5 kg SF6 = 30 t, 0,1% leak = 30 kg ≈ 700 t CO₂-eq.
  1. A breaker opens on a fault: the arc between the contacts dies in a vacuum bottle (slowed down) — "Een vermogensschakelaar kan een kortsluiting onderbreken." — Vermogensschakelaar, Vacuümschakelbuis
  2. The fault level as a big arrow at the substation — "Hij moet zwaarder zijn dan het kortsluitvermogen op zijn plek." — Kortsluitvermogen
  3. In a netstation: a load-break switch for the ring, a fuse for the transformer — "Een lastscheider schakelt last, een zekering smelt één keer." — Lastscheider, Zekering
  4. A disconnector opens only dead; the earthing switch closes; an interlock blocks the wrong order — "Eerst scheiden, dan aarden; de vergrendeling bewaakt de volgorde." — Scheider, Aardingsschakelaar
  5. Panels in a row: AIS versus GIS, an RMU, SF6 versus vacuum — "Een RMU: compact, vaak nog met SF6." — Veld, AIS, GIS, RMU, SF6
- **`eng.switchgear.protection`** · numbers: protection: CT 400/1 A, VT 10 kV → 100 V; example: max load 300 A, smallest fault 2.000 A, stage 1 at 450 A (1,125 A secondary) with 0,5 s, stage 2 at 4.000 A instant, fault near the substation 12.000 A; selectivity: 250 A fuses, one swapped for 400 A.
  1. A fault: the current jumps; the CT turns 400 A into 1 A; the VT gives 100 V — "Meettransformatoren schalen terug naar veilige waarden." — Stroomtransformator, Spanningstransformator
  2. The relay compares with its settings; trip — "Het relais besluit; de vermogensschakelaar gaat open." — Beveiligingsrelais
  3. Two stages on a time–current chart: 0,5 s at 450 A, instant at 4.000 A — "Ver weg vertraagd, dichtbij direct." — Overstroombeveiliging, Tijd-stroomkarakteristiek
  4. Earth fault: the sum of three currents is not zero; the star point earthing — "Aardfoutbeveiliging ziet stroom die weglekt." — Aardfoutbeveiliging, Sterpunt
  5. Selectivity: only the device nearest the fault trips; a time grade; backup — "Selectiviteit: de dichtstbijzijnde schakelt, de rest wacht." — Selectiviteit, Tijdselectiviteit, Tijdtrap, Reservebeveiliging
  6. The 400 A fuse that should have been 250: the MV fuse goes instead — "Eén verkeerde zekering en een heel station gaat uit."
- **`eng.switchgear.fiverules`** · numbers: safety: LV up to 1.000 V AC / 1.500 V DC (NEN 3140), above that NEN 3840, both on NEN-EN 50110; the example: an MV cable between netstations 8 and 9; switching: 6 switching technicians × 2 per day × 4 days × 12 weeks = 576 moments against 1.400 needed (2,4×).
  1. The control room and the IV write the switching plan; a second person checks it — "Een schakelplan: welke schakelaar, waar, door wie, in welke volgorde." — Schakelplan, Installatieverantwoordelijke, IV
  2. Roles as badges: IV, WV, VP, VOP, layperson; the written appointment — "Kunde is niet genoeg: de aanwijzing telt." — Werkverantwoordelijke, WV, VP, VOP, Leek, Aanwijzing
  3. Rule 1: switch off on both sides — "Regel 1: vrijschakelen, aan alle kanten." — Vijf veiligheidsregels, Terugvoeding
  4. Rule 2: lock and tag — "Regel 2: beveiligen tegen herinschakelen."
  5. Rule 3: test the tester on a live source, then measure three cores in both stations — "Regel 3: spanningsloos meten, met een geteste zoeker."
  6. Rule 4: earthing switches closed on both sides — "Regel 4: aarden en kortsluiten, pas na het meten." — Aarden
  7. Rule 5: shield live parts nearby; the WV releases the cable; spiking in the trench — "Regel 5: afschermen. Dan pas geeft de WV vrij." — NEN 3140
  8. Each step reported to the control room; back in reverse order — "Elke stap melden; terug in omgekeerde volgorde." — Schakelmoment
  9. The consultant outside the barrier, touching nothing — "Als leek kom je nergens aan."
- **`eng.switchgear.automation`** · numbers: automation: 1.200 customers × 90 min = 108.000 customer minutes; remote switches at 2 key stations: 1.000 × 3 + 200 × 90 = 21.000 (about 80% less); NL about 20 minutes per customer per year (19 in 2023, 23 in 2024).
  1. Without automation: a van drives station to station — "Zonder automatisering: één à twee uur." 
  2. A motorised switch and a modem in a key station — "Een afstandsbediende schakelaar zet de ring in stukken." — Distributieautomatisering, Afstandsbediende schakelaar
  3. Indicators report in; the logic opens around the fault and closes the open point in under a minute — "Een zelfherstellende ring doet het zelf." — Kortsluitverklikker, Zelfherstellende ring
  4. The customer-minutes counter: 108.000 versus 21.000 — "Klantminuten: 80% minder met twee stations." — Klantminuten
- **`eng.gridops.outage`** · numbers: outage example: 07:40 trip, 12 stations, 1.800 customers, indicators 1–5 lit, 6 not, technician on site 08:15, open point in station 12; 1.800 × 50 min = 90.000 customer minutes; SAIDI = SAIFI × CAIDI, about 20–25 min per year.
  1. 07:40: the control room screen; a feeder breaker trips in SCADA — "Het bedrijfsvoeringscentrum ziet het binnen seconden." — Bedrijfsvoeringscentrum
  2. The LV side: calls to the outage number, smart meters going quiet — "Op laagspanning hoor je het vaak van klanten."
  3. Indicators 1–5 lit; isolate 5–6; re-energise 1–5; check the neighbour ring, close the open point — "Eerst iedereen terug, dan repareren." — Normaal open punt, Kortsluitverklikker
  4. The yearly numbers build: SAIFI, CAIDI, SAIDI — "SAIDI = SAIFI × CAIDI." — SAIFI, CAIDI, SAIDI
- **`eng.gridops.chain`** · numbers: chain: 34 weeks = 8 waiting + 3 preparation + 9 permit + 13 material + 1 field work → 25 weeks in parallel; connections: a supermarket 3 × 250 A (step times asserted); standard: 300 stations per year × 32 h saved = 9.600 h; execution: 1.200 jobs, 10 work preparers × 2 per week × 44 weeks = 880, 30% sent back; workload: 120 fitters × 1.300 h = 156.000 h against 210.000.
  1. A request enters a queue; steps as stations — "De keten van aanvraag tot inbedrijfname." — Werkvoorbereiding, Doorlooptijd, Aansluittermijn, Kleinverbruik, Capaciteitscheck, MS-ruimte
  2. Permit and material in series, then in parallel — "Zelfde werk, 25 in plaats van 34 weken." — KLIC-melding
  3. The readiness check before release — "Pas vrijgeven als alles klaar is." — Gereedheidscheck
  4. Standard station designs roll out; a framework contract — "Standaardiseren scheelt 9.600 engineeringuren." — Standaard netstation, Raamovereenkomst, Serieproductie, Overdimensionering, Uitzonderingsproces, Standaardiseren, Raamcontract, Aannemer
  5. Work pile against people; bundling; social priority — "Meer werk dan mensen: kiezen en bundelen." — Verzwaring, Netcongestie, Wachtrij, Maatschappelijk prioriteren, Bundelen, Standaardontwerp, Herstelwerk, First time right
  6. Testing, switching back, as-built drawings into GIS — "Inbedrijfname sluit de lus." — Inbedrijfname
- **`eng.gridops.assets`** · numbers: assets: switchgear type with 1 in 50 per year failure chance, 2.000 customers × 3 h (the comparison asserted); data: 1.000 jobs, 25% hit a data error → an extra survey.
  1. The risk matrix: probability × consequence for two candidates — "Risico = kans × gevolg." — Risico, Risicomatrix, ISO 55000, Typeprobleem, Tussenmaatregel
  2. GIS against the street: a cable not where the map says — "Revisieachterstand: de kaart loopt achter." — GIS, Conditiedata, Revisie, Revisieachterstand, Digital twin, Topologie
- **`eng.gridplanning.loadflow`** · numbers: loadflow: feeder 300 A, peak 210 A, station 80 MVA with a 45 MVA peak, +2,5 MVA (the check asserted); redundancy: 2 × 40 MVA, peak 46 MVA, +2 MVA per year, new station in 6 years, requests of 3 and 4 MVA.
  1. Current flows along a feeder; each cable's load as a bar against its rating — "Loadflow rekent stroom en spanning in elk stuk." — Loadflow, Belastbaarheid, Belasting, Streng
  2. The voltage drops along the feeder, and rises with solar infeed; the band — "Spanningsband: binnen ±10%." — Spanningsband, Invoeding
  3. One transformer trips: the other carries all; 46 MVA on 40 — "N-1: één uitval mag geen klanten kosten." — N-1, Rail
  4. Firm capacity versus non-firm; the emergency lane — "Non-firm gebruikt de vluchtstrook." — Vaste capaciteit, Non-firm, Vluchtstrook
- **`eng.gridplanning.flex`** · numbers: flex: feeder 6 MW, peak 5,8 MW 17:00–20:00, otherwise ≤ 4,2; cold store 1,5 MW → 7,3 firm, ≤ 5,7 with a time-based contract; solar capped at 70%; storage: 10 MW / 20 MWh = 2 h; village 400 kVA, peak 460 kVA, battery 150 kW / 300 kWh, 60 kW × 3 h = 180 kWh; growth 20 kVA per year → about 2 years; ATR85 = 85% of the hours, about 1.300 h curtailable.
  1. A winter weekday profile hits 5,8 MW in the evening — "De piek duurt drie uur." — Congestiemanagement
  2. The cold store pre-cools in the afternoon and stops 17–20 — "Tijdsafhankelijk contract: buiten de piek past hij." — Tijdsafhankelijk contract, Capaciteitsbeperkingscontract, Terugregelen, GOPACS, Redispatch
  3. A battery: MW as the tap, MWh as the tank — "10 MW / 20 MWh levert twee uur." — MW, MWh
  4. The village battery charges at night, discharges 17–20; a market price curve tempts it the wrong way — "Wie stuurt in het piekuur: het net of de markt?" — Peak shaving, Achter de meter, Day-aheadmarkt, Tijdsduurgebonden transportrecht
  5. Years roll on: the peak outgrows the battery after 2 years — "Flex koopt tijd; verzwaren komt alsnog."
- **`eng.gridplanning.investment`** · numbers: investment: station A over its limit in 2029 in every scenario, with 15 MW waiting; B only in the high scenario.
  1. Scenario fan lines — "Scenario's in plaats van één prognose." — Scenario, Gelijktijdigheid, Knelpunt
  2. A over in every scenario, B only in high — "No-regret eerst: A." — Investeringsplan, Anticiperend investeren, No-regretmaatregel

### 3.7 Projecten (pm, current modules), 20 films

People films use the kit's flat-iso people (a few recurring characters: "jij" the consultant in petrol, a sponsor, a team lead, a planner and the floor), a meeting table, a wall board, documents that fill in, and a calendar strip. They are ranked by gain in understanding. P2 is the default for pm; P1 is reserved for the two films where watching the chain of cause and effect clearly beats reading it.

| id | Title nl / en | Serves | Dur | Why a film | P |
|---|---|---|---|---|---|
| `pm.plan.schedule` | Het kritieke pad schuift / The critical path moves | plan.schedule | 100 | a delay propagating through the network, and slack appearing when a task moves | P1 |
| `pm.run.escalation` | Van oranje naar rood: een escalatie die werkt / From amber to red: an escalation that works | run.status, run.decisions, portfolio.governance | 130 | the chain from a slipped date to a sponsor's call the same afternoon, with who is told first | P1 |
| `pm.intake.firsttalk` | Het eerste gesprek / The first conversation | intake.ask, intake.firsttalk, lead.listen | 120 | the hour on a clock, talk time, the correction that reveals the real problem (MORE PIES) | P2 |
| `pm.intake.stakeholders` | De stakeholderkaart komt tot leven / The stakeholder map comes alive | intake.stakeholders, lead.influence, plan.raci | 110 | people placed on the map, moving as the project goes, the RACI per result | P2 |
| `pm.plan.wbs` | Het werk opdelen en schatten / Breaking down and estimating the work | intake.done, plan.wbs, plan.estimate | 110 | the goal splitting into deliverables and packages, then a range instead of one number | P2 |
| `pm.plan.risk` | Een pre-mortem / A pre-mortem | plan.risk | 80 | "it failed: why?" turning into a used risk list | P2 |
| `pm.plan.method` | Waterval of rondes / Waterfall or rounds | plan.method | 90 | the same project played both ways; hybrid milestones with two-week rounds | P2 |
| `pm.run.scope` | Vijf kleine verzoeken / Five small requests | run.scope, negotiate.scope | 90 | requests piling up unseen while the status stays green, then the trade-off on one sheet | P2 |
| `pm.run.rhythm` | Een overlegritme dat werkt / A meeting rhythm that works | intake.start, run.rhythm, perform.rhythm | 90 | a week calendar coming alive: stand-up, weekly, steering group, decision note | P2 |
| `pm.land.adoption` | Van livegang tot gewoonte / From go-live to habit | land.change, land.resistance, land.communication | 120 | operators moving through ADKAR, resistance shown and worked with, the cascade | P2 |
| `pm.land.training` | Instructie op de werkplek / On-the-job instruction | land.training | 90 | TWI in four steps at the workstation | P2 |
| `pm.land.handover` | Overdragen en vasthouden / Handing over and holding on | land.handover, land.sustain, close.acceptance | 110 | watch, do with support, alone; the three-month dip and the audit that catches it | P2 |
| `pm.close.results` | Is het echt beter? / Is it really better? | close.results | 90 | weekly values with their noise band, and the comparison line | P2 |
| `pm.lead.feedback` | Feedback, ook naar boven / Feedback, upward too | lead.feedback, perform.dialogue, negotiate.senior | 110 | SBI built sentence by sentence, then a performance conversation and disagreeing with a senior | P2 |
| `pm.perform.tree` | Van strategie tot teamcijfer / From strategy to team number | perform.kpis, perform.tree, perform.targets, perform.gaming, portfolio.benefits | 120 | a KPI tree growing, a target, gaming bending a number, output → outcome → benefits | P2 |
| `pm.negotiate.batna` | BATNA, ZOPA en het eerste bod / BATNA, ZOPA and the first offer | negotiate.interests, negotiate.batna, negotiate.anchor, negotiate.no, run.conflict | 120 | the bars of both sides sliding until a zone appears; the anchor | P2 |
| `pm.portfolio.prioritise` | Wat past onder de streep? / What fits under the line? | portfolio.programme, portfolio.prioritise, portfolio.capacity | 100 | projects sorted by value per scarce day and cut at the capacity line; Fatima's week | P2 |
| `pm.stuck.diagnose` | Vastgelopen: welk soort probleem? / Stuck: which kind of problem? | stuck.diagnose, stuck.experiment, stuck.reset | 90 | four problem types sorted; a reversible experiment; a restart | P3 |
| `pm.lead.difficult` | Drie gesprekken in één / Three conversations in one | lead.difficult | 80 | what happened, feelings, identity, shown as three layers | P3 |
| `pm.consult.proposal` | Van telefoontje tot offerte / From phone call to proposal | consult.proposal, consult.pricing | 90 | a diagnosis phase with a go/no-go, and pricing options | P3 |

- **`pm.plan.schedule`** · numbers: schedule example: A 3, B 4, D 2, C 6, E 6 weeks; A-B-D-E = 15 weeks, A-C-E = 15 weeks; C starting in week 1 gives 3 weeks of slack.
  1. Tasks as cards; arrows for dependencies — "Wat heb je van een ander nodig voordat je kunt beginnen?" — Afhankelijkheid
  2. The longest chain lights up — "Het kritieke pad bepaalt de einddatum." — Kritiek pad
  3. A second chain is just as long: both critical — "Twee ketens van 15 weken: allebei kritiek."
  4. IT access starts in week 1: that chain gets 3 weeks of slack — "Speling: uitlopen zonder dat het eind schuift." — Speling
  5. The Gantt chart on one A4 with milestones and a go/no-go diamond — "Mijlpalen zijn momenten, het liefst besluiten." — Mijlpaal, Go/no-go, Gantt-chart
- **`pm.run.escalation`** · numbers: status example: IT access promised for week 5, now week 11; pilot week 8 → 12; governance: the project lead decides within 10% budget and 2 weeks, the steering group beyond that, the board above 20%; escalate when a tolerance is crossed or will be within 2 weeks.
  1. Week 6: the access ticket still open; the team lead wants amber — "Groen, oranje, rood: alleen bruikbaar als de definities vastliggen." — RAG-status, Mijlpaal
  2. A watermelon: green outside, red inside — "Slecht nieuws vroeg is goedkoop." — Watermeloenproject
  3. The tolerance table: two weeks blown → red; the forecast slides — "Dit is rood: het team kan IT niet zelf oplossen." — Tolerantie, Beslisbevoegdheden, Prognose, Governance, Mandaat
  4. You tell the team lead and the IT contact first — "Eerst de eigenaar, dan de sponsor."
  5. The steering group: four parts on one slide, options with an advice, a default option and date — "Wat er gebeurd is, wat het betekent, wat ik voorstel, wat ik nodig heb." — Escalatie, Advies, Besluitcriteria, Standaardoptie, Escalatieroute
  6. The sponsor calls the same afternoon; the decision log gets a line — "Escaleer het besluit, niet de persoon." — Besluitenlijst
- **`pm.intake.firsttalk`** · numbers: firsttalk: 5 / 35 / 10 / 10 minutes, 70–80% client talk time; 6 changeovers × 50 min; "reinigen is het grotere probleem"; summary within 24 h; ask: the dashboard request leading back to permits.
  1. A request for "a better dashboard"; questions peel it back to the real problem — "Achter het symptoom zit een probleem en een doel." — Symptoom, Probleem, Doel, Kosten van niksdoen, OEE
  2. The hour as a clock: open, explore, check, close — "Een uur met vier delen." — Open vragen
  3. Speech bubbles: the client talks most; MORE PIES letters appear as you use them — "Reflecteren, parafraseren, stilte." — MORE PIES, Reflecteren, Parafraseren, Actief luisteren, Open vraag
  4. Your paraphrase is corrected: "No, cleaning is the bigger problem" — "In de correctie zit het echte punt."
  5. The summary sent the same evening — "Een intakesamenvatting binnen 24 uur." — Intakesamenvatting
- **`pm.intake.stakeholders`** · numbers: stakeholders example: project to shorten connection lead times; sponsor = director of customer connections; process owner = head of work preparation; raci: the weekly planning meeting R planner, A operations manager, C team leads and sales, I plant manager.
  1. Faces placed on a power–interest map — "Wie beslist, wie kan het stoppen?" — Stakeholder, Sponsor, Proceseigenaar, Stakeholdermap, Blokkeerder, Stakeholderkaart
  2. A blocker moves after a one-to-one; currencies exchanged — "Invloed zonder macht: wat kun je ruilen?" — Valuta, Wederkerigheid, Stuurgroep
  3. The RACI grid fills per result — "Eén A per resultaat." — RACI, Responsible, Accountable, Consulted, Informed
  4. A blocked decision goes up the line — "Escalatie via de sponsor." — Escalatie
- **`pm.plan.wbs`** · numbers: done: scrap 3,2% ≈ 2.400 kg of 75.000 kg per week; wbs: cancellations 18% → under 8% in six months, four results on the wall; estimate: "3 days", best 2, worst 10 (the three-point figure asserted).
  1. The baseline measured; the goal sentence; in and out of scope — "Eerst meten: 3,2% afkeur." — Nulmeting, Scope, Buiten scope, Acceptatiecriteria, Scope creep
  2. The goal splits into four deliverables, then work packages — "Een WBS deelt resultaten op, geen activiteiten." — Deliverable, WBS, Werkpakket, 8–80-regel, Definition of done
  3. "Three days" becomes a range of 2 to 10 — "Schat in bandbreedtes; de planning fallacy duwt je naar optimistisch." — Bandbreedte, Driepuntsschatting, Planning fallacy
  4. Effort versus lead time; a buffer at the end — "Inspanning is uren, doorlooptijd is kalender." — Inspanning, Doorlooptijd, Buffer
- **`pm.plan.risk`** · numbers: risk example: a 20-minute pre-mortem with six people.
  1. "It's a year later and it failed. Why?" — post-its fill the wall — "Een pre-mortem haalt de echte zorgen boven." — Pre-mortem
  2. Clusters become rows with an owner and a measure — "Elk risico een eigenaar en een maatregel." — Risicolijst, Risico-eigenaar, Beheersmaatregel
  3. A risk happens and becomes an issue — "Een issue is een risico dat al gebeurd is." — Issue
- **`pm.plan.method`** · numbers: method example: baseline week 4, pilot live week 8, go/no-go week 16; two-week rounds; 60 real jobs tested by week 8.
  1. Waterfall phases in sequence, each signed off — "Waterval: voorspelbaar werk, vaste scope." — Waterval
  2. Rounds of two weeks; users react each time — "Agile: kort, iets echts, feedback." — Agile, Scrum, Sprint
  3. Steering-group milestones above, team rounds below — "Hybride: mijlpalen voor de stuurgroep, rondes voor het team." — Hybride
  4. A small pilot with an end date and a way back — "Een pilot is een afgebakende proef." — Pilot
- **`pm.run.scope`** · numbers: scope example: 40 consultant days; 5 requests × 2 days = 10 days (25%); A: end date +2 weeks, B: drop two.
  1. The goal sentence on the wall — "Toets elk verzoek aan de doelzin." — Scope, Doelzin
  2. Five small requests stack up while the status stays green — "Scope creep: klein, redelijk, ongemerkt." — Scope creep, Gold plating
  3. One sheet: 10 days, option A or B — "Ja, en dit kost het." — Wijzigingsverzoek, Afweging
  4. With a fixed-price client: the change log and the devil's triangle — "Tijd, geld, scope: kies er twee." — Wijzigingslog, Vaste prijs, Duivelsdriehoek, Dagtarief
- **`pm.run.rhythm`** · numbers: rhythm example: stand-up Monday and Thursday 08:30, 15 min, five people; weekly Tuesday 13:00, 45 min (the steering group cadence asserted).
  1. The kick-off; first quick wins and foundations — "De eerste weken: kick-off, quick wins, fundament." — Kick-off, Quick win, Fundament, Overlegritme
  2. A week strip: stand-ups, weekly, the steering group monthly — "Elk overleg een doel en een vaste agenda." — Stand-up, Stuurgroep, Sponsor, Vaste agenda, Overlegstructuur
  3. A decision note and the minutes as a decision list — "Notulen zijn besluiten met eigenaren." — Besluitnotitie, Notulen, Actielijst
  4. Handing the rhythm over to the line; escalating by the agenda — "Een ritme dat blijft als jij weg bent." — Escaleren, Overdracht
- **`pm.land.adoption`** · numbers: change example: stops longer than 2 min registered; after 6 weeks only 40%; 8 operators asked; resistance: Henk and the 40-minute warm-up rule.
  1. Go-live; registrations at 40% — "Livegang is geen adoptie." — Livegang, Adoptie, Verandermanagement
  2. Eight operators on the ADKAR steps; most stall at ability — "ADKAR laat zien waar het blijft hangen." — ADKAR, Kotter
  3. Open, passive and hidden resistance as three figures — "Weerstand vertelt iets echts." — Open weerstand, Passieve weerstand, Verborgen weerstand, Verlies, Verandercurve
  4. Coffee with Henk; his rule goes into the board — "Haal de criticus bij het ontwerp."
  5. A cascade via the middle managers; key messages; a town hall — "Middenmanagers vertellen het verder." — Stakeholder, Communicatieplan, Cascade, Kernboodschappen, Middenmanager, Town hall
- **`pm.land.training`** · numbers: training example: a one-page instruction, six steps with screen photos (the follow-up figures asserted from the lesson).
  1. A one-page instruction with key points — "Een werkinstructie met kernpunten." — Werkinstructie, Kernpunt
  2. TWI: prepare, show, let them do it, follow up — "Voordoen, nadoen, nalopen." — TWI, Training op de werkplek
  3. Kirkpatrick levels from reaction to result — "Gebruiken ze het echt?" — Kirkpatrick-niveaus
- **`pm.land.handover`** · numbers: handover example: 92% on-time delivery is normal; weeks 1–3 / 4–6 / 7–9; a breakdown in week 8; hypercare 2–6 weeks; sustain: 72% → 90% → 81% after three months.
  1. The checklist for the process owner — "Eén proceseigenaar per proces." — Lijnorganisatie, Proceseigenaar, KPI, Overdrachtschecklist
  2. Three steps on a calendar: watch, do with you beside, alone — "Overdragen in stappen." — Hypercare
  3. Formal acceptance: criteria signed, open points listed — "Acceptatie op de criteria van de opdracht." — Acceptatiecriteria, Projectopdracht, Ondertekening, Openpuntenlijst, Batenreview
  4. Three months later the line dips to 81% — "De dip na drie maanden." — Dip na drie maanden
  5. A layered process audit and a trigger in the KPI review — "Een gelaagde audit vangt het op tijd." — Gelaagde procesaudit, KPI-review, Follow-up, Trigger
- **`pm.close.results`** · numbers: results example: line 3 14% (11–17%) over 12 weeks → 9% (7–11%) over 10 weeks; line 4 stays at 13%.
  1. Weekly values with their noise band — "Eén goede week is ruis." — Nulmeting, Ruis
  2. After: the band moves; the comparison line stays — "Een vergelijkingsgroep maakt het hard." — Vergelijkingsgroep
  3. An extreme week followed by a normal one — "Regressie naar het gemiddelde." — Regressie naar het gemiddelde
  4. The controller turns hours into contribution — "De controller rekent het in euro's." — Controller, Dekkingsbijdrage
- **`pm.lead.feedback`** · numbers: feedback example: the sponsor answered the first four questions; Peter and Sandra went quiet.
  1. S, B, I build up as three blocks, then a question — "Situatie, gedrag, impact, en dan vragen." — SBI, Waarneembaar gedrag
  2. "You're dominant" crossed out for "you answered the first four questions" — "Gedrag, geen etiket." — Feedbacksandwich
  3. Asking permission upward; feedforward — "Mag ik iets delen?" — Feedback naar boven, Feedforward
  4. A performance conversation: one-off or pattern, then an agreement — "Eenmalig of een patroon?" — Prestatiegesprek, Open vraag, Eenmalige oorzaak, Patroon, Afspraak
  5. Disagreeing with a senior: fact, view, request; then disagree and commit — "Feit, visie, verzoek." — Psychologische veiligheid, Disagree and commit, Feit-visie-verzoek, Escalatiepad
- **`pm.perform.tree`** · numbers: tree example: 26 weeks from request to connection, steps in series (intake 3 weeks …, asserted).
  1. A few lagging and leading indicators on a scorecard — "Een paar indicatoren die sturen." — KPI, Achterlopende indicator, Voorlopende indicator, Gekoppelde indicatoren, Balanced scorecard
  2. The tree grows from 26 weeks down to the steps' drivers — "Een KPI-boom vertaalt strategie naar teams." — KPI-boom, Driver, Rekenboom, Logische boom, Doorvertalen
  3. A target set with the team, a band and an action limit — "Een doel waar ze in geloven." — Doelzettingstheorie, Doelacceptatie, Nulmeting, Bandbreedte, Actiegrens
  4. A number bends: easy jobs first — "Wet van Goodhart: een doel wordt een spel." — Wet van Goodhart, Gaming, Krenten uit de pap halen, Verkeerde prikkel, Grenswaarde
  5. Output → outcome → benefits with a benefit owner — "Opgeleverd is nog geen baat." — Output, Uitkomst, Baten, Batenhouder, Toerekening
- **`pm.negotiate.batna`** · numbers: batna: €950 offered against €1.000 elsewhere; the coated brackets +12%, a second supplier +4% with 10 weeks of qualification; anchor: earlier diagnoses took 18, 22 and 20 days.
  1. Positions on the table, interests underneath — "Standpunt is wat ze vragen, belang is waarom." — Standpunt, Belang, Eerlijke maatstaf, Principieel onderhandelen, Pakketdeal, Objectieve criteria, Lastig gesprek
  2. Your walk-away from your BATNA; theirs estimated; the ZOPA appears — "De ZOPA: waar een akkoord kan." — BATNA, Ondergrens, ZOPA, Overstapkosten, Kwalificatie
  3. Starting qualification now strengthens your alternative — "Verbeter je alternatief, en dan pas praten."
  4. The first number anchors; framing; the counter offer — "Het eerste getal trekt alles naar zich toe." — Anker, Framing, Verliesaversie, Tegenbod, Concessie
  5. A positive no with a trade offer; the red line — "Nee, en wat wel kan." — Positieve nee, Ruil aanbieden, Rode lijn
- **`pm.portfolio.prioritise`** · numbers: prioritise: 240 project days; A €200k / 80 days, B €180k / 40 days (C onwards asserted); capacity: Fatima on four projects, each assuming a day a week, with 4 project days a month available.
  1. Programme versus project; a dependency between two projects — "Een programma stuurt samenhang." — Programma, Portfolio, Afhankelijkheid, Programmaraad, Watermeloeneffect
  2. Projects sorted by value per scarce day; the capacity line — "Waarde per schaarse dag: B eerst." — Bottleneck, Waarde per schaarse dag, Risicogecorrigeerde waarde, Capaciteitsstreep, Onderhanden werk
  3. Fatima's month: four projects, four days — "Echte beschikbaarheid, geen aanname." — Capaciteitsmatrix, Capaciteitsconflict, Echte beschikbaarheid, Contextswitch, Doorlooptijd
- **`pm.stuck.diagnose`** · numbers: diagnose example: week 7, the third design session.
  1. Four boxes: unclear goal, unclear path, people, capacity — "Welk soort probleem is het?" — Onduidelijk doel, Onduidelijke weg, Mensenprobleem, Capaciteitsprobleem, Afweging
  2. A reversible two-week experiment with a stop criterion — "Omkeerbaar: probeer het." — Omkeerbaar besluit, Onomkeerbaar besluit, Experiment, Hypothese, Stopcriterium
  3. A restart: sunk cost set aside, re-contracting — "Herstarten is opnieuw beginnen." — Herstart, Verzonken kosten, RAG-status, Opnieuw contracteren, IJkmoment
- **`pm.lead.difficult`** · numbers: none fixed (Henk's remark in week 3).
  1. Three layers: what happened, feelings, identity — "Drie gesprekken tegelijk." — Drie gesprekken, Identiteitsgesprek
  2. Contribution instead of blame; intention versus impact — "Wat was mijn bijdrage?" — Bijdrage, Bedoeling tegenover impact
  3. Starting from the third story — "Begin bij het derde verhaal." — Derde verhaal
- **`pm.consult.proposal`** · numbers: proposal: OEE of the thermoforming lines (asserted); pricing: scrap costs €400k per year; 30 days estimated when the data is clean.
  1. The call; a diagnosis phase with a go/no-go — "Eerst een diagnose, dan een besluit." — Nulmeting, Diagnosefase, Go/no-go-besluit, Inzet van de klant, Opties
  2. Day rate, fixed price, value-based on one slider; a risk mark-up — "Prijs naar risico." — Dagtarief, Vaste prijs, Waardegebaseerde prijs, Risico-opslag, Scope, Meerwerk

**No film (pm), with reason:** these lessons are about judgement or reflection, with no sequence to show.
- intake.no;
- run.team;
- close.retro (a P3 candidate later, see 6);
- close.followup;
- close.yourself;
- stuck.buytime and stuck.askhelp (the lines themselves matter more than a picture);
- lead.teams;
- lead.self;
- consult.trust (a static formula);
- consult.independence;
- consult.account;
- consult.practice.

`close.report` and `portfolio.boardroom` wire `talk.answer#4` (the answer-first scene).

### 3.8 Spreken, 4 films

| id | Title nl / en | Serves | Dur | Why a film | P |
|---|---|---|---|---|---|
| `talk.answer` | Een sterk antwoord van 60 seconden / A strong 60-second answer | drills prep and frame; pm close.report and portfolio.boardroom (scene 4) | 120 | the answer built block by block on a timeline while it is spoken; before versus after | P1 |
| `talk.pressure` | Onderbroken en toch helder / Interrupted and still clear | drill pressure; pm stuck.pressure, negotiate.no | 90 | the interruption at 15 s and the four moves in 20 s | P2 |
| `talk.pause` | Pauze in plaats van eh / A pause instead of um | drill pause | 60 | the waveform with fillers replaced by silences | P3 |
| `talk.listenback` | Leren van je eigen opname / Learning from your own recording | the v13 listen-back lesson (after v13) | 80 | play, the checklist, rate, compare | P3 |

- **`talk.answer`** · source: `src/content/tips.js` (prep tip, before and after) and the frame steps in `src/i18n.js` (PREP: Punt, Reden, Voorbeeld, Punt; STAR: Situatie, Taak, Actie, Resultaat; Antwoord eerst). No lesson numbers. For the pm lessons, the terms Antwoord eerst and Piramideprincipe are covered in scene 4; the other terms of those lessons are skipped as document parts.
  1. A question appears, a 60 s timer, and a vague answer as a grey blob — "Zonder structuur dwaalt een antwoord."
  2. PREP blocks drop in while the "dinsdag trainen" answer is spoken — "Punt, reden, voorbeeld, en hetzelfde punt."
  3. STAR for "vertel over een keer dat…": four blocks on a timeline, Actie the widest — "Bij een verhaal: STAR, met de meeste tijd voor wat jij deed."
  4. Answer first: the conclusion on top of a pyramid of reasons — "Voor een directie: antwoord eerst, onderbouwing eronder." — Antwoord eerst, Piramideprincipe
  5. Choosing the frame by question type — "Mening? PREP. Verhaal? STAR. Advies? Antwoord eerst."
- **`talk.pressure`** · source: `how_pressure` in `src/i18n.js` (cut off at about 15 s, then 20 s, four moves) and the pressure tip in tips.js.
  1. You speak; at 15 s someone cuts in sharply — "Onderbroken. Nu heb je 20 seconden."
  2. Acknowledge, bridge, one sentence, check back appear in turn — "Erken, brug, antwoord in één zin, check terug."
  3. Bad versus good replay — "Erkennen voordat je verdedigt."
- **`talk.pause`**:
  1. A waveform with "eh" bumps — "Stopwoorden vullen de stilte."
  2. The bumps become flat pauses; the timer shows 3 pauses and 0 fillers — "Een pauze klinkt zekerder dan eh."

### 3.9 After v13: ICT, IT/OT, cyber, pm.outside (20 films)

These are planned against the v13 topic list. Terms and numbers are filled in when the lessons exist; the build asserts them like the others. Each storyboard is provisional.

| id | Title nl / en | Serves (v13 topic) | Dur | Why a film | P |
|---|---|---|---|---|---|
| `pm.agile.scrum` | Een sprint van twee weken / A two-week sprint | Scrum roles, events, artefacts | 130 | people and events in time: planning, dailies, review, retro | P1 |
| `pm.agile.backlog` | Van idee tot sprintklaar / From idea to sprint-ready | backlog, user stories, refinement, estimating | 100 | a story being split, refined and estimated by the team | P2 |
| `pm.agile.kanban` | Flow op een kanbanbord / Flow on a kanban board | Kanban and flow | 90 | cards moving, a WIP limit stopping a pile-up, cycle time and Little's law (the v13 board figure lets you play; this shows why) | P2 |
| `pm.scaled.pi` | Een PI-planning in twee dagen / A two-day PI planning | SAFe basics: ART, PI planning, RTE, PO/PM | 140 | many teams, one room, the programme board filling, the confidence vote | P1 |
| `pm.scaled.hybrid` | Stage-gate met sprints / Stage-gate with sprints | hybrid in manufacturing | 90 | gates above, sprints below, hardware lead times | P2 |
| `pm.devops.pipeline` | Een commit door de pipeline / A commit through the pipeline | CI/CD and test automation, DORA metrics | 120 | a change from commit to production in minutes; a red test, a rollback; the four DORA meters | P1 |
| `pm.devops.release` | Omgevingen en een release / Environments and a release | release and environment management | 90 | dev, test, acceptance, prod; a feature flag | P2 |
| `pm.devops.incident` | Een storing volgens ITIL / An incident the ITIL way | ITSM and incidents | 100 | incident → major incident → problem → change, with the roles | P2 |
| `pm.itproject.mvp` | MoSCoW en een MVP / MoSCoW and an MVP | requirements and scope | 90 | requirements sorted into four bins, the MVP cut line | P2 |
| `pm.itproject.cutover` | Het cutover-weekend / The cutover weekend | ERP/MES implementation: data migration, cutover, go-live, hypercare | 140 | an hour-by-hour weekend with a go/no-go and a rollback point, then hypercare | P1 |
| `pm.itproject.uat` | Testen tot adoptie / From testing to adoption | testing and adoption: UAT, training, change | 90 | users testing real scenarios; defects triaged | P2 |
| `eng.itbasics.network` | Een datapakket op reis / A data packet's journey | networks: IP, LAN, VLAN, firewall | 110 | a packet travelling through switch, VLAN, router and firewall | P2 |
| `eng.itbasics.cloud` | Server, cloud en SaaS / Server, cloud and SaaS | servers and cloud | 80 | who manages which layer in IaaS, PaaS and SaaS | P3 |
| `eng.ot.isa95` | Van sensor tot ERP / From sensor to ERP | ISA-95 levels, PLC/SCADA/MES/ERP talking | 120 | a factory as layers; one order going down and its data coming up (reuses `eng.industry40.datapath` drawings) | P1 |
| `eng.ot.protocols` | OPC UA en MQTT / OPC UA and MQTT | OPC UA and MQTT, IT/OT convergence | 90 | client–server reads versus publish–subscribe through a broker | P2 |
| `eng.cyber.zones` | Zones en conduits in de fabriek / Zones and conduits in the plant | basics (CIA), OT security under IEC 62443 | 110 | an attack path through a flat network, then segmented | P2 |
| `eng.cyber.incident` | Een OT-cyberincident / An OT cyber incident | incident response | 110 | from a phishing mail to recovery, the phases with roles | P2 |
| `pm.outside.questions` | Vragen stellen buiten je vak / Asking questions outside your field | Vragen stellen | 90 | the question sets per phase; checking an estimate with a range and a reference class | P3 |
| `pm.outside.experts` | Werken met experts / Working with experts | Werken met experts | 90 | trust and verify; red flags such as "almost done" with no demo | P2 |
| `pm.outside.steering` | Voortgang zien zonder vakkennis / Seeing progress without the expertise | Sturen en besluiten | 100 | milestones with evidence, a demo, the definition of done; an escalation | P2 |

Provisional storyboards (4–5 scenes each):
- **`pm.agile.scrum`:** the roles introduced (product owner, scrum master, developers) → sprint planning pulls items from the backlog → the daily at the board, cards moving → the review with users who react → the retro picks one improvement → the next sprint starts.
- **`pm.scaled.pi`:** the ART as teams of teams; the RTE opens → the business context and vision → team breakouts writing objectives → the programme board fills with dependencies as red strings → risks ROAMed → the fist-of-five confidence vote.
- **`pm.devops.pipeline`:** commit → build → unit tests → integration tests → deploy to staging → deploy to production → a failing test stops a bad change → a rollback; the four DORA meters move.
- **`pm.itproject.cutover`:** freeze → data migration with reconciliation counts → the go/no-go at the checkpoint → go-live → the rollback point passes → hypercare tickets fall over 2–6 weeks (2–6 weeks taken from pm.land.handover).
- **`eng.ot.isa95`:** levels 0–4 as floors of the plant → an order from ERP to MES to the PLC → machine data back up → where the IT/OT boundary and the DMZ sit.
- **Others:** the same pattern: the setting → the actors → the sequence → what goes wrong → the fix.

## 4. Build order and waves

**Wave 0, the player kit:** `films/_kit`, `src/ui/film.js`, the `film` field, the validator, the unit tests and the e2e step, plus the pilot film `eng.machining.turning`.
- Spike first: narration through the parent bridge on Chrome Android, Safari iOS and desktop Firefox, and the frame height at 390 px.
- Merijn watches the pilot before wave 1 (see open question 1).

**After that, two films per wave:**
- P1 first, grouped by module, in this order: Maakindustrie, then safety and grid, then the rest of engineering basics, then the two pm P1 films and `talk.answer`.
- Each film is written by a content agent and checked by a second agent before merge, against the content check below.

| Wave | Films |
|---|---|
| 1 | eng.machining.milling, eng.machining.drilling |
| 2 | eng.machining.cnc, eng.machining.tooling |
| 3 | eng.machining.overview, eng.machining.workholding |
| 4 | eng.machining.measuring, eng.joining.arc |
| 5 | eng.joining.spot, eng.joining.defects |
| 6 | eng.joining.bolting, eng.joining.bonding |
| 7 | eng.joining.production, eng.moulding.setting |
| 8 | eng.moulding.machine, eng.moulding.cycle |
| 9 | eng.moulding.materials, eng.moulding.defects |
| 10 | eng.moulding.moulds, eng.lines.design |
| 11 | eng.lines.robots, eng.lines.errorproof |
| 12 | eng.lines.variants, eng.lines.control |
| 13 | eng.safety.loto, eng.switchgear.fiverules |
| 14 | eng.safety.permit, eng.transformers.principle |
| 15 | eng.switchgear.devices, eng.switchgear.protection |
| 16 | eng.transformers.faults, eng.gridops.outage |
| 17 | eng.switchgear.automation, eng.transformers.cables |
| 18 | eng.transformers.ageing, eng.gridbasics.path |
| 19 | eng.gridbasics.load, eng.gridbasics.congestion |
| 20 | eng.gridplanning.loadflow, eng.gridplanning.flex |
| 21 | eng.fluids.cavitation, eng.fluids.pumping |
| 22 | eng.fluids.heat, eng.fluids.steam |
| 23 | eng.power.motor, eng.power.drives |
| 24 | eng.power.air, eng.power.hydraulics |
| 25 | eng.mechanics.fatigue, eng.mechanics.tensile |
| 26 | eng.mechanics.load, eng.mechanics.heattreat |
| 27 | eng.quality.spc, eng.quality.tolerance |
| 28 | eng.flow.smed, eng.flow.bottleneck |
| 29 | eng.flow.takt, eng.process.plant |
| 30 | eng.process.batch, eng.maintenance.failure |
| 31 | eng.maintenance.tpm, eng.drawings.reading |
| 32 | eng.drawings.loop, pm.run.escalation |
| 33 | pm.plan.schedule, talk.answer |
| 34+ | P2 by module in the same order (Maakindustrie P2, engineering basics, grid, pm, speaking), then P3 |
| after v13 | ICT P1 (pm.agile.scrum, pm.scaled.pi, pm.devops.pipeline, pm.itproject.cutover, eng.ot.isa95), then ICT P2/P3; each only once its lessons have passed their own review |

Wave 0 plus 33 waves cover the 67 P1 films for current content (`eng.machining.turning` is the pilot). The other 5 P1 films are ICT, after v13.

**Coordination with v13 part 5 (topics × levels for the older modules):** films for older modules are built after that module's rebuild where possible, so scene levels and terms match the topic lessons (see open question 4). The Maakindustrie and pm P1 films do not depend on it.

**Content check by the second agent (per film):**
- **Facts:** every caption against the lesson and, where the lesson hedges, the same hedge. Numbers are taken from the build's assert list.
- **Dutch:** short sentences, no anglicisms beyond the terms, and the term's English word on first use only.
- **English:** no Dutch at all.
- **Terms:** the coverage report from `--audit`, a visual cue for each term, and the skip reasons.
- **Order:** scenes follow the real order on the floor, and safety steps are never shown out of order, even in a scrub preview.
- **Watch:** at 390 px in light, dark and reduced motion, with narration on in nl and en.
- Merge only with `npm test`, `node src/content/courses/validate.js` and `bash scripts/shellcheck.sh` passing. The film e2e step runs when no agent is building (the standing rule).

## 5. Effort and risks

**Effort (rough):**
- **Wave 0 (kit, wiring, tests, pilot):** about 3–4 agent sessions. It is the biggest single piece.
- **A machine film that reuses a figure's drawing:** about half a session, plus a review. A machine film drawn from scratch: about one session.
- **A people or board film:** about half a session once the people-and-board helpers exist.
- **Totals:** 72 P1 films at two per wave is about 33 waves; all 134 films is about 65 waves.
- **Reuse:**
  - the figure builds' world geometry is imported, so the moulding press, lathe, mill, spot gun, MAG torch, robot cell and MV ring are not redrawn;
  - the people, table, board, document and calendar helpers are written once in wave 0 and refined in the first pm wave.

**Risks:**

| Risk | Effect | Mitigation |
|---|---|---|
| Narration voice quality differs by browser (Dutch voices are robotic or missing on some Android builds; iOS has good nl-NL voices; desktop Firefox on Linux may have none) | narration sounds poor or silent | captions carry the content on their own; narration is off by default; voice picked through `voice.js` (prefers nl-NL and en-GB); a "no voice available" hint; the English words in Dutch captions are not spoken |
| `speechSynthesis` is blocked or flaky in a sandboxed frame | silent films in the app | the parent-page bridge (2.2); spiked in wave 0 |
| 150 s is long on a phone; attention drops | films are left halfway | Basiscut at 60–80 s for levels 1–2; the scene list to jump; each scene stands on its own; the end card offers the figure |
| Captions overflow at 390 px | unreadable | build check: at most 3 lines at 390 px and 16 px (measured with the kit's text metrics), otherwise the build fails; a caption is at most about 25 words |
| Lesson text changes and the film goes stale | wrong numbers or terms in a film | the build asserts numbers and terms; the content test re-checks the shipped film JSON against the lessons, so `npm test` fails until the film is rebuilt |
| v13 part 5 renames or moves terms in older modules | coverage breaks | build those films after the rebuild; until then the tests show exactly which term moved |
| Page size grows with many scenes | slow loading, cache bloat | the 300 KB target and 450 KB cap checked in the test; one drawing per film with overlays, no per-scene redraws; runtime caching plus the opt-in offline row |
| Motion sickness or distraction | discomfort | calm eases, at most one camera move per scene, no flashing; reduced motion gives stills |
| A safety film seen out of order while scrubbing | wrong lesson learned | in safety films the scrubber snaps to scene starts; each step carries a number badge; the reviewer checks order |
| Simplified drawings read as real procedures (switching, LOTO) | false confidence | the end card in safety films says the site's own procedure and appointment rule apply, as the lessons say; the consultant-as-layperson rule shown in `eng.switchgear.fiverules` |
| Scope (134 films) outruns the review capacity | backlog of unreviewed films | P1 first; P3 films only when Merijn asks for one; the build kit makes people films cheap |

## 6. Open questions for Merijn

1. **Narration:** off by default with captions as the main channel, or on by default? Should Dutch narration skip the English words (as planned)? Please judge the browser voice in the wave 0 pilot before we build more.
2. **Cuts:** is a Basiscut (60–80 s) for levels 1–2 and a full cut (up to 150 s) for levels 3–4 right, or one full film everywhere?
3. **Where the button sits:** under the first reading block (planned), or at the top of the lesson before the pre-question?
4. **Older modules:** build their films after their topics × levels rebuild (v13 part 5), so the levels and terms are final, or now, accepting rework?
5. **Order after Maakindustrie:** grid next (your work with the grid operator) or the rest of engineering basics next? The plan puts safety and grid next.
6. **Offline:** is "cache on first view, plus a 'Films offline bewaren' switch per subject" fine, or must every film be available offline from install (about 9 MB on the wire)?
7. **Speaking films:** is a button on the exercise intro card the right place, and do you want `talk.pressure` and `talk.pause` at all?
8. **pm lessons without a film** (the list under 3.7): agree, or do you want a film for `close.retro` too?

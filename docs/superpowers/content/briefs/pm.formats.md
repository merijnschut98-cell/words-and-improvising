# pm.formats: Werkvormen en overleggen / Formats and meetings

Build brief and record, written 15 Nov 2026 with the second build of Task 14. Plan: `docs/superpowers/plans/2026-11-15-task14-proposal.md` (module B, with "Merijn's answers to the proposal") and Merijn's Task 14 answers in `2026-11-15-questions-for-merijn.md`. Pattern: `docs/superpowers/content/briefs/pm.approach.md` and its review fixes. Films and figures are a later step.

## Fixed by Merijn

- Subject `pm`, track `project`, level 2, a station on the road between Plan and Run (`draw: 'whiteboard'`), fifth place of the field "Een project van begin tot eind".
- Four topics x four levels (Basis, Werkkennis, Gevorderd, Expert); each level teaches something the lower one does not (design addendum 3). Brown paper is a lesson inside the workshop topic; the fourth topic is "Werkvormen op de vloer"; the Miro-style whiteboard run is the Werkkennis lesson of "Ideeën en besluiten" (Q3 of the plan, Task 14 answers).
- Q4: station on the road. Q5: no figures. Q6: Engineering lessons named in the text, never hard-linked (a test refuses lesson ids in the text). Q7: the B4 Werkkennis run is the interview round; the gemba walk is at Basis (as one of four) and at Expert (the senior walk).
- Tool names only as examples ("geen aanbeveling"); no prices, licences, versions or click paths; no company names (the examples are anonymous).

## Lessons

| Topic | Basis | Werkkennis | Gevorderd | Expert |
|---|---|---|---|---|
| meetings: Welk overleg wanneer | `catalogue` De overleggen van een project | `kickoff` Een kick-off voorbereiden en leiden | `system` Het overlegsysteem van één project | `governance` Het overleg als governance |
| workshop: Een werksessie ontwerpen en leiden | `workshop` Wat een werksessie is | `brownpaper` Een brown-papersessie houden | `design` Ontwerpkeuzes voor een sessie | `facilitation` Faciliteren als vak |
| ideas: Ideeën en besluiten in de groep | `diverge` Eerst veel ideeën, dan kiezen | `session` Een ideeënsessie op een digitaal bord | `decide` Wie beslist, en hoe | `legitimacy` Legitimiteit en schijninspraak |
| floor: Werkvormen op de vloer | `floor` Vier werkvormen buiten de vergaderzaal | `interviews` Een interviewronde houden | `demo` Een demo op de vloer en de juiste werkvorm kiezen | `kaizenevent` Een kaizen-event laten doen |

All ids are `pm.formats.<slug>`. Worked examples at levels 1 and 2, faded at 3 and 4. Each lesson has 3 to 6 terms, 4 recall questions (a numeric one in 12 lessons) and the pm-required pushback. English term in parentheses on first use in the Dutch text, left out where nl and en are the same word; "je" form.

### What each level adds (the hinge per topic)

- meetings: Basis gives the catalogue (purpose, who, how long, output; meeting versus working session; six-month calendar); Werkkennis designs one kick-off (stakeholder and team kick-off, 60-minute agenda, pre-read, five things agreed, 10 x 90 minutes versus 10 x 60); Gevorderd designs and prunes the set (three jobs, cadence, written and asynchronous replacements, one hybrid rule, the exceptions; nine meetings to six plus an update); Expert weighs power, pre-wiring, meeting load, audit questions and the hand-over of the chair.
- workshop: Basis defines a workshop (four design questions, the arc, three roles; a two-hour workshop block by block); Werkkennis runs a brown paper session (3 to 5 m, 6 to 12 people, colours, swim lanes, handovers and waits, validate, 180-minute agenda; 23 steps, 7 handovers, 4 signatures); Gevorderd chooses the design (size, length, pre-work, remote and hybrid, sponsor in or out, two-role problem, when brown paper is wrong, two versions of one process; 18 people at three sites); Expert contracts the outcome, guards neutrality and safety, decides ownership and outside facilitators, names the IAF areas as a checklist.
- ideas: Basis separates diverge and converge (Osborn's two principles, production blocking, silent writing, clustering; when one person decides); Werkkennis runs a 30-minute session on an online whiteboard (frame, private mode, timer, dots, owners; 8 people, 46 notes, 9 clusters, 24 dots) and names 1-2-4-All as the room alternative; Gevorderd chooses the decision format (advice process, consent, majority, consensus; four decisions of different weight); Expert weighs consultation theatre, mandate, closing the loop and the credible question.
- floor: Basis names the four floor formats (gemba walk, interview round, demo, kaizen event) and when each fits (ten weeks at a manufacturer); Werkkennis runs an interview round (sample across levels, five open questions, notes in the person's words, anonymity, theming, playback; 9 interviews, 11 hours, 7 of 9); Gevorderd designs a demo outside software (feedback, not approval; shift work, safety rules, works council, remote sites) and chooses between the four formats; Expert weighs the cost of a kaizen event (persons x days x hours), who frees people, the sponsor at the close-out, the follow-up list, when not to run one and the director's gemba walk as inspection tour.

## Overlaps handled (named, not repeated)

| New lesson | Existing lesson it points to (named in the text) | How |
|---|---|---|
| catalogue | `pm.run.rhythm` (Een overlegritme dat werkt), `pm.run.steerco` (De stuurgroep voorbereiden), `pm.land.tiered` (Getrapt overleg en escaleren), `pm.close.retro` (Een terugblik waar mensen van leren), `pm.agile.events` (De vijf events van Scrum) | one row each and a pointer; labels and minutes are not re-taught |
| kickoff | `pm.intake.start` (De eerste weken) | builds on it, adds the full design; no quick-win paragraph |
| system | `pm.run.workstreams` (Meerdere werkstromen sturen) | pointer for several teams; different numbers, one project |
| governance | `pm.portfolio.boardroom` (Voor de directie) | pointer for the pre-wiring technique |
| workshop, brownpaper | `pm.close.formats` (Een terugblik ontwerpen), `pm.intake.sipoc` (Grenzen trekken met SIPOC), Engineering `eng.improve.vsm` (Waardestroomanalyse (VSM), module Technisch probleemoplossen) | the five phases are not repeated; SIPOC gives start and end; VSM named as the next step when data is needed, no VSM symbols or timeline sum |
| design | `eng.improve.facilitate` (Een grondoorzaaksessie begeleiden) | named for root-cause sessions; no three-column board |
| facilitation | `pm.lead.safety` (Psychologische veiligheid opbouwen) | pointer; the definition is copied from `pm.lead.teams` (review) |
| diverge | `pm.close.formats` (stippenstemmen), `eng.improve.facilitate` | one line and a pointer |
| decide | `pm.run.decisions` (Besluiten voor elkaar krijgen) | decisions outside the room are pointed to; no log, doors or escalation |
| legitimacy | `pm.portfolio.boardroom` | pointer for pre-wiring; `pm.lead.influence` not repeated |
| floor | `eng.improve.gemba` (Ga kijken: de gemba), `pm.land.lsw` (Leiderstandaardwerk en de gembawalk), `eng.improve.kaizen` (Kaizen: elke dag en in events) | how to observe is never taught; the Expert lesson adds only the senior walk's risk |
| interviews | `pm.stuck.healthcheck` (Een projectreview leiden) | review interviews are pointed to; this lesson is discovery at the start |
| demo | `pm.agile.events`, `pm.scaled.stagegate` (Stage-gate en agile in de maakindustrie) | pointers; adds the demo for non-IT work |
| kaizenevent | `eng.improve.kaizen`, `eng.improve.facilitate` | the event's days are not described; the commissioning decision and its cost only |

Engineering lessons are named by their Dutch (nl) or English (en) title and module; there is no hard term link.

## Facts, sources and hedging

Evidence: fetched = opened and read in this project; search = seen in a search result or taught as common practice. Sources S1 to S31 are in `docs/superpowers/reviews/2026-11-14-pm-modules-sources.md`.

| Claim in the lessons | Source | Level | Wording |
|---|---|---|---|
| Gemba walk: observation and inquiry before taking action | Lean Enterprise Institute lexicon, "gemba walk" | fetched 15 Nov | "het Lean Enterprise Institute omschrijft het als"; the lesson paraphrases, no quote |
| The Sprint Review is a working session and never a gate to releasing value | Scrum Guide 2020 | fetched 15 Nov | "de Scrum Guide (2020) zegt"; used as a starting point for non-IT reviews, not as a rule |
| 1-2-4-All: alone, pairs, foursomes, whole group, about 15 minutes | Liberating Structures (S12) | fetched 15 Nov, again in the review (page: "~15 min.", steps add up to 16) | "uit Liberating Structures", "ongeveer 15 minuten"; no step count |
| Production blocking explained most of the productivity loss in their experiments; evaluation apprehension and free riding a smaller part | Diehl and Stroebe (1987), J. of Personality and Social Psychology 53, 497 to 509 | abstract checked 15 Nov (review) | "in hun experimenten", "vaak"; the builder's "later analyses dispute the size" was cut (not supported by the sources found) |
| Osborn: defer judgment and aim for quantity | Osborn (1953), Applied Imagination (secondary sources) | search | only the two principles; the lesson says the wording of the rules varies |
| Consent as "no reasoned objection", from sociocracy | sociocracy.info and other secondary sources | search | "de term komt uit de sociocratie"; no founder claims |
| IAF: six competency areas | IAF, iaf-world.org/the-iaf-core-competencies | fetched 15 Nov (review) | en: the six category names as on the page; nl: a close translation |
| Kaizen event: a few days, often three to five | `eng.improve.kaizen`, S7 | search | the same wording as the Engineering lesson; the ASQ attribution is not used |
| Miro, Mural as examples of online whiteboards with timer, private mode and voting | S15 | search | "veel tools ... (geen aanbeveling)"; feature names differ per tool |

Brown paper steps, the interview round and the kick-off agenda are common consulting practice with no single standard; the lessons say so ("gangbare werkwijze"). Practice claims taught as rules of thumb, not standards: 60-minute kick-off agenda and five things agreed; three jobs of a meeting system; the one hybrid rule; 6 to 12 people at one wall; 8 to 10 interviews of 45 minutes; the decision format by weight; the persons x days x hours cost of a kaizen event. All numbers in examples are example figures.

## Evidence rules and the content guard

`tests/formats.test.js` fails the build on: currency signs, price phrases, the word licence, version numbers and product years, click paths, any company name, a lesson id shown in the text, a position or length spread outside the limits, and a numeric question without a usable hint.

## Questions: spread

64 recall and 16 pre questions: 68 choice questions plus 12 numeric ones (pre 16, recall 64). Answer position in both languages 17, 18, 16, 17 and identical per question. Length of the right answer among the four options, ranked longest to shortest, after the review: nl 14, 20, 15, 19 (unique longest 5 of 68); en 12, 19, 16, 21 (unique longest 10); no right answer is more than 5 characters longer than the next option. The test allows at most 30% unique longest and 15% to 35% per rank. Every numeric question has a hint that does not contain the answer (validator).

## Terms (nl / en), defined once per module

meetings: overlegvorm, kick-off, sponsorgesprek, werksessie, opbrengst van een overleg / meeting format, kick-off, sponsor check-in, workshop, meeting output; werkafspraken, voorleesstuk, teamkick-off, stakeholderkick-off; cadans, schriftelijke update, asynchroon overleg, hybride overleg; voorzitterschap, voorsorteren, overleglast, overlegaudit. workshop: facilitator, eigenaar van de uitkomst, scribent, divergeren, convergeren; brown paper, huidige situatie, gewenste situatie, overdracht, zwembaan, wachttijd; tweerollenprobleem, voorwerk, online sessie, sessieformat; uitkomst contracteren, neutraliteit, IAF-competenties, psychologische veiligheid. ideas: brainstorm, stil schrijven, clusteren, oordeel uitstellen, productieblokkade; digitaal whiteboard, verborgen modus, timer, stemronde, 1-2-4-All; consent, consensus, adviesbesluit, meerderheid, besluitvorm; schijninspraak, terugkoppeling, mandaat van de sessie, besluiteigenaar. floor: gembawalk, interviewronde, demo, kaizen-event; interviewleidraad, steekproef over lagen, thematiseren, terugkoppelsessie; review, werkend resultaat, feedback versus goedkeuring, pilotcel; kaizen-event laten doen, afsluitpresentatie, opvolglijst, inspectieronde.

Shared terms copied word for word from the lesson they come from: kick-off (`pm.intake.start`), sponsorgesprek / sponsor check-in (`pm.stuck.sponsor`), voorsorteren (`pm.portfolio.boardroom`), overdracht / handover (`pm.intake.sipoc`), facilitator (`pm.close.retro`, nl term Begeleider), psychologische veiligheid (`pm.lead.teams`, the lesson before Psychologische veiligheid opbouwen in the same topic; review), gembawalk (`pm.land.lsw`), kaizen-event (`eng.improve.kaizen`). The Dutch term for facilitator is "facilitator" with the definition of `pm.close.retro` ("begeleider"); the English terms follow the existing lessons (the app uses "handover" and "sponsor check-in", so the proposal's "hand-off" and "sponsor one-to-one" became those). Terms that other modules define with another meaning (cadans in SAFe, overdracht in switchgear, demo in `pm.outside.redflags`) keep their own definition here.

## Wiring done in this build

`src/content/courses/index.js` (module entry, level 2, topics, field list with `pm.formats` after `pm.plan`, field blurb), `maps/pm.js` (a seventh lifecycle place on the wide and the phone map, see below), `openers.pm.js` (4 topics x levels 2 to 4, nl and en), `sw.js` SHELL (both lesson files; `CACHE` not bumped), `tests/formats.test.js`, `e2e/mapfit.mjs` (expected place count 16 to 18, it was stale), `tests/filmcontent.test.js` (`PENDING_RERENDER` now holds `pm.approach` and `pm.formats` for `pm.field.lifecycle`), and the pinned tests that count the road or the map (`breadth`, `engmap`, `fields`, `mapphone`, `mapscene`, `maplabels`, `subjectmap`).

### Map geometry

- Wide map: the lifecycle row holds seven places with widths 101, 76, 76, 96, 78, 76, 78 (gap 6 from x = 10), height 112 (was 102); the zones below move down 10 units; the view is 640 x 553 (was 543). One row of equal tiles of 86 does not pass the film kit's label fit (`films/_kit/mapscene.mjs`: a label may be set at 85% of 15 units at the smallest): "Aanpak en gereedschap" needs a tile of at least 101 units and "Werkvormen en overleggen" 96 units and 107 high (three lines in Dutch; the app's own, unfitted label of three lines needs 112 or it leaves its tile, which `e2e/mapfit.mjs` checks), so those two tiles are wider and the others, which need 74 or less, give way (checkMap minimum 72.2).
- Phone map: the lifecycle zone is now three rows, 3 + 2 + 2 (Approach, Intake, Plan; Formats, Run; Land, Close), the road legs end at each row; the phone height is 550 units (was about 493), so the height test allows 600 px at 390 and 475 px at 320.
- Film pages: the 18 Projects film pages that embed the map (pm.agile, close, consult, devops, intake, itproject, land, lead, negotiate, outside, plan, portfolio, run, scaled and stuck intros, and the field films pm.field.it, pm.field.people and pm.field.portfolio) were built on the old drawing. No test needs a rebuild; they are stale until the next render batch. `pm.field.lifecycle` waits for its re-render with both new stations.

## Open for later steps

- `intro: 'pm.formats.intro'` is not set in the index because the module intro film does not exist yet (`tests/intro.test.js`). Set it with the film.
- The field film `pm.field.lifecycle` does not know the seventh station; `PENDING_RERENDER` holds it. Remove both entries when it is re-rendered; its build is expected to fail its own field assertion until then.
- Lesson films (brownpaper, session) and the module intro film are not built.
- (done in the review) The six IAF competency area names were checked against the IAF page.

## Review (15 Nov)

- Facts: the IAF areas now follow the IAF page; the Diehl and Stroebe line says what their experiments found (most of the loss from blocking, fear of judgment and free riding smaller) instead of "later analyses dispute the size"; the shift-work decision no longer calls the works council's role an advice procedure (working hours usually need its consent; the lesson says "een formele rol" and "vraag na wat wettelijk geldt"); the management team spends 22 hours each, not together. LEI gemba walk, the Scrum Guide's Sprint Review lines, 1-2-4-All and Osborn's two principles were checked and stand.
- Shared definitions: psychologische veiligheid copied from `pm.lead.teams` (owner topic of Mensen leiden; `eng.safety.culture` uses the same); the floor lesson's teach now matches the gembawalk definition from `pm.land.lsw` (the leader's fixed round, which the project lead joins); consensus defined as in the teach text.
- Questions: 13 choice questions whose answer stood out by length (in one or both languages), and four with implausible distractors (camera crew, team photo, annual report, too little paper), got distractors of similar length and plausibility; positions unchanged.
- Dutch: brown-papersessie throughout, een lang vel, één per rol, je to operators and participants (u stays for sponsors and directors, as in pm.approach), clearer pushback and contracting lines; Engineering module named at the kaizen pointer.
- Map: kept the single lifecycle row of seven uneven tiles (the tiles have no visible border, so the unevenness does not show; one straight road keeps the film kit's mapscene unchanged) and the phone 3+2+2 layout (594 px at 390, below Engineering's 741 that Merijn called fine).

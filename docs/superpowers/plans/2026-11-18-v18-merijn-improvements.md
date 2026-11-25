# v18: Merijn's improvement points (18 Nov 2026), PRIORITY

Status: **recorded only, not started.** Merijn: "Zet ze alleen in het plan. Ga er nog niet mee aan de slag. Deze punten hebben wel prioriteit." These points come before the remaining Task 17 batches and the remaining kernzin batches once Merijn says to start. Each item gets a design pass (and, where it decides something for Merijn, a multiple-choice question) before any build.

## The points, as Merijn wrote them

- [ ] Projecten met DMAIC ipv huidige structuur. Iets meer Lean-gericht. In ieder geval naar DMAIC en andere structuren refereren.
- [ ] Grotere oefentoetsen om kennis te testen, zowel per (groter) onderwerp, als per totale module.
- [ ] Oefentoetsen echt moeilijker maken.
- [ ] Extra oefentoetsen zijn door AI te genereren. Basis van tevoren vastleggen.
- [ ] Oefentoetsen zijn de basis om te blijven leren wanneer (een groot deel van) de modules zijn afgerond. Blijven trainen in alle onderwerpen. Ze komen beschikbaar per niveau wanneer het hele onderdeel is afgerond, zoals nu op de map te zien is.
- [ ] Mogelijkheid geven om terugkomende oefeningen te skippen wanneer het te veel worden.
- [ ] Methode familie tekst klopt niet. Interpunctie mist, en er staan maar drie methoden.
- [ ] DMAIC in de methode families is niet alleen voor Six Sigma! Het houdt juist zo mooi de projectstructuur vast.
- [ ] Vragen mogen een stuk lastiger. Zowel de vragen als meerdere antwoorden die lijken op een goed antwoord. Nu is vaak het antwoord duidelijk als je gewoon logisch leest. Vooral opties die nergens op slaan wil ik er veel gewoon uit hebben. Zeker in de moeilijkere modules, maar ook in de makkelijke moeten er geen opties zijn die nergens op slaan.
- [ ] Vragen mogen ook meerdere goede antwoorden hebben, dat je alle goede moet aanvinken.
- [ ] Er mogen ook meerdere passende antwoorden staan, en dat je de BEST passende moet kiezen. Zo maken we het moeilijk.
- [ ] Er mogen ook andere vragen zijn dan alleen meerkeuze. Invulvragen waar een woord ontbreekt bijvoorbeeld, of een puzzelvorm. Daar leer je meer van.
- [ ] Vragen (vraagstellingen) en antwoorden moeten een extra review krijgen. Sommige vragen laten veel open voor eigen interpretatie, of kloppen überhaupt niet. De situatie moet soms echt duidelijker beschreven worden.
- [ ] We hebben besproken dat filmpjes niet nodig zijn als het visueel niks toevoegt, maar er blijven toch nog vrij veel filmpjes. Daarom toevoegen: als afbeeldingen volstaan mag dat ook in plaats van filmpjes. Belangrijk daarbij is wel dat er tekst is ter ondersteuning. Engineering-onderwerpen houden eigenlijk altijd filmpjes.

## Grouping for the design pass (integrator note, not a decision)

1. **Projects structure and method families:** DMAIC as the project spine (Lean-oriented, referring to DMAIC and other structures); fix the method-families text (punctuation, more than three methods, DMAIC not only for Six Sigma). Touches `pm.approach` and the Projects map/modules.
2. **Question quality:** harder questions; no nonsense distractors at any level; plausible near-miss options; "choose the best answer"; multiple correct answers (select all); other formats (fill in the missing word, puzzle forms); an extra review of every question and answer for ambiguity and correctness, with clearer situations. Touches the question schema (`checkQuestion` in `src/content/courses/validate.js`), the quiz UI (`src/ui/quiz.js`) and every lesson's `pre`/`recall`.
3. **Practice tests:** larger tests per topic and per module; really harder; extra tests AI-generated from a fixed base; the tests are how one keeps training after the modules are done; unlocked per level when the whole part is done, as the map shows now.
4. **Review load:** an option to skip recurring review exercises when there are too many.
5. **Films vs pictures:** where pictures suffice, pictures with supporting text instead of a film (extends the text-first rule of 17 Nov, `src/content/courses/films/textfirst.js`); Engineering keeps films.

## State when this was recorded (18 Nov)

Three agents stopped on the 5-hour usage limit on 17 Nov (reset 21:50 UTC); their work is saved in their worktrees and NOT resumed (standing rule: Merijn decides when work starts):
- render of the four cnc pilot films (`eng.machining.cnc`, `gcode`, `offsets`, `cam`), partly rendered;
- kernzin batch 4 (`eng.cost`, `cyber`, `drawings`, `fluids`, `gridbasics`, `gridops`), partly written;
- review of kernzin batch 3 (`pm.itproject` … `pm.stuck`, commit 36fabb2), in progress.
Live: v374 (kernzin for eng.flow and all Projects modules except batch 3, which waits on its review).

## Priorities (Merijn, 25 Nov)

- **Higher:** the SAFe module (`pm.scaled`): Merijn looked at it recently and finds the explanation very unclear. It needs a content pass before the other module passes. The practice exams also have more priority; Merijn has not yet played the pm.plan pilot (checkpoint P0) and will do so later.
- **Lower:** the DMAIC film re-renders (Q5 B in the DMAIC proposal): plan them only where they are already relevant.
- **State:** kernzin is on every lesson (batches 7 and 8 merged 25 Nov). T3 (AI extra tests) was rebuilt and merged after its opus review (v389). DMAIC proposal approved 25 Nov. Nothing new is built until Merijn says start.
- **Known e2e failures, also on the baseline:** three Today-card steps ("topics: where you are (fixture)", "module return… Today card", "breadth-first…") and the flair step (waits for `.check-btn`, probably the module-check button T2 replaced).

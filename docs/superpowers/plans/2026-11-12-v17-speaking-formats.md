# v17 Speaking formats: implementation plan

Merijn's ask: the speaking lessons should use the structures that well-known speakers and communicators use, such as "What, So What, Now What?", "and there are more, also for different situations".

This plan covers research and design, then a TDD task list. It contains no code. The frames drill already exists, so this plan **extends that drill**. It adds no new drill.

---

## 1. What exists today (do not duplicate)

| Where | What |
|---|---|
| `src/core/lesson.js` `FRAME_IDS` | `['prep', 'star', 'wsn', 'psb', 'ppf', 'answer', 'story3']` |
| `src/core/lesson.js` `makePrompt('frame')` | `pickFresh(content.frames)`, then `extra = { frame, options }`. `options` holds the right frame plus 2 random others, shuffled. **It does not take the drill level into account:** every frame can appear at every level. |
| `src/content/prompts.{nl,en}.js` `frames:` | 44 prompts per language, `f01`–`f44`, 6 per frame (story3 has 8: `f37`–`f44`). The en and nl pools are parallel: same ids, same frame per id. |
| `src/i18n.js` | `frameName_*` and `frameSteps_*` for all 7 frames (en around L278, nl around L797), plus `how_frame`, `framePick`, `frameRight`, `frameWrong(n)` |
| `src/ui/round.js` (around L171, L347, L645) | Level 1–2: shows the frame name and its steps as chips. Level ≥ 3 (and not shadow): a pick step **before** the timer starts (`st.phase = 'pick'`), then `frameRight`/`frameWrong` and the steps. `framePick` is passed on to the coach. |
| `src/core/coach.js` `FRAME_EN` | English description of each frame for the coach prompt. `DRILL_BRIEF.frame` asks the coach to judge whether every step is present, in order and signposted. The Structure score anchors mention the frame steps. `COACH_SCHEMA` is strict (`additionalProperties: false`, all fields required). |
| `src/core/progress.js` | Drill levels 1–5 (`adjustDrillLevel`), with timing per level `PREP_S [15,10,6,3,0]` and `ANSWER_S [30,45,60,75,90]` |
| `src/core/share.js` | `challengePrompt` rebuilds a shared prompt through `makePrompt` (pool `frame → frames`) |
| `tests/lesson.test.js` (L151+) | Own copy of `FRAME_IDS`, the parallel-pool test, the 3-options test, the story3 i18n test |
| `tests/coach.test.js` (L136, L161) | Frame and story3 descriptions reach the coach |
| `e2e/smoke.mjs` (L1428) | "frames drill: pick a frame at level 3, then see its steps" (screenshots 36, 37) |

**Formats that already exist elsewhere:**

- **What / So what / Now what** is already frame `wsn`. Its source (Borton 1970, then Rolfe et al. 2001, popularised for spontaneous speaking by Matt Abrahams) gets a credit line, nothing else.
- **PREP** is frame `prep` and also its own drill, `prep`.
- **STAR**, **Problem-Solution-Benefit** (Abrahams) and **Past-Present-Future** are frames `star`, `psb` and `ppf`.
- **Answer first** (frame `answer`) is in practice **BLUF / the top of Minto's pyramid**. No separate BLUF frame is added; the existing frame gets a credit line instead (see §3).
- **SBI with a request** already exists as a captain constraint in the `real` drill (`con_sbi`: Situatie, Gedrag, Impact, Je verzoek). The new `sbi` frame reuses the same words.
- **Minto's SCQ** is already taught in the PM course (`src/content/courses/pm/intake.*.js`, `portfolio.*`, `close.*`). The `scqa` frame is where he practises it out loud.
- **Interruptions and pressure**: the `pressure` drill trains staying calm after an interruption. `abc` is the structure for one hard question, which is different.
- **Storytelling under twists**: the `story` drill (Story Chain) is improv. `spine` gives a told story its shape, which is different.

---

## 2. Research: the formats, grouped by situation

**How to read the evidence column:** almost none of these frameworks has been tested experimentally for effectiveness. They are practitioners' heuristics. Where the attribution is unclear or the "science" behind a framework is weak, the table says so.

- **folk**: no clear originator, or only secondary sources
- **practitioner**: a named originator, but little or no research
- **research**: some empirical work exists

The level is the frames-drill level at which the format unlocks (§3).

### A. Answering a question on the spot

| id | Name en / nl | Steps (en / nl) | Source | Evidence | When | Example prompt (nl) | Level |
|---|---|---|---|---|---|---|---|
| *(exists)* `wsn`, `prep`, `answer` | | | | | | | 1 |
| `compare` | Compare, Contrast, Conclude / Vergelijk, Contrast, Conclusie | What they share · How they differ · So my choice / Wat ze delen · Waar ze verschillen · Dus mijn keuze | Matt Abrahams (Stanford GSB), *Think Faster, Talk Smarter* (2023). Named this way in a summary of his structures: [jdschramm.substack.com](https://jdschramm.substack.com/p/prepare-to-be-spontaneous-part-1). **Check the wording in the book before shipping.** | practitioner (secondary source only) | Someone asks "A or B?" | "De plantmanager vraagt je bij de koffieautomaat: kanban of MRP-planning voor de spuitgieterij, wat raad je aan?" | 3 |
| `three` | Rule of three / Regel van drie | Announce: three things · First · Second · Third / Kondig aan: drie dingen · Eén · Twee · Drie | Classical tricolon (rhetoric). Max Atkinson, *Our Masters' Voices* (1984), found that three-part lists in political speeches draw applause: [Max Atkinson](https://en.wikipedia.org/wiki/Max_Atkinson) | research on applause, observational. **"Three is the magic number" in general is folk.** | Any list, a quick explanation, a short summary | "Een operator vraagt bij de koffie wat er nou eigenlijk verandert met de nieuwe standaard werkinstructie." | 2 |

### B. Recommendation or update to management

| id | Name en / nl | Steps | Source | Evidence | When | Example (nl) | Level |
|---|---|---|---|---|---|---|---|
| *(exists)* `answer` = BLUF / top of the pyramid | Answer first | (unchanged) | BLUF: US Army correspondence rule AR 25-50 ([BLUF](https://en.wikipedia.org/wiki/BLUF_(communication))). Pyramid: Barbara Minto, McKinsey | practitioner | A direct question from a manager | (existing prompts) | 1 |
| `scqa` | SCQA (Minto) / SCVA: Situatie, Complicatie, Vraag, Antwoord | Situation · Complication · Question · Answer / Situatie · Complicatie · Vraag · Antwoord | Barbara Minto, *The Pyramid Principle* (McKinsey, 1970s; [barbaraminto.com](https://www.barbaraminto.com)). Minto calls the introduction "SCQ" and treats the answer as the top of the pyramid, not a fourth part of the introduction ([overview](https://thinkinsights.net/strategy/scqa-logic)). | practitioner | Steering group, status update, the opening of a proposal or advice | "Je krijgt twee minuten in de stuurgroep: de doorlooptijd is gezakt van 12 naar 9 dagen, maar de nieuwe ERP-koppeling dreigt dat weer teniet te doen." | 3 |

**Not added: Minto pyramid as a separate frame.** The pyramid shape (one answer, then 2–3 grouped reasons) is exactly `answer`. SCQA is the introduction that goes in front of it.

### C. Persuading and proposing

| id | Name en / nl | Steps | Source | Evidence | When | Example (nl) | Level |
|---|---|---|---|---|---|---|---|
| *(exists)* `psb` | Problem, Solution, Benefit | | Abrahams | practitioner | Short proposal | | 1 |
| `pitch` | Elevator pitch / Liftpitch | For whom · Their problem · What we do · Why it beats the alternative · The ask / Voor wie · Hun probleem · Wat we doen · Waarom beter dan het alternatief · De vraag | Adapted from Geoffrey Moore's positioning template ("For [target] who [need], our [product] is … Unlike …"), *Crossing the Chasm* (1991) ([template variants](https://bdow.com/stories/positioning-statement/)). **Moore meant it as positioning, not a pitch.** "The ask" is a common addition (folk). | folk / practitioner | 30 seconds with a decision-maker | "In de lift staat de COO van je klant. Je hebt dertig seconden voor je voorstel: een pilot met een digitaal andonbord op lijn 2." | 3 |
| `nabc` | NABC: Need, Approach, Benefits, Competition / NABC: Behoefte, Aanpak, Baten, Concurrentie | Need · Approach · Benefits per cost · Competition (alternatives) / Behoefte · Aanpak · Baten per kosten · Alternatieven | Curtis Carlson, SRI International. Used for project reviews; in *Innovation: The Five Disciplines* (Carlson & Wilmot, 2006) ([Roland Berger interview](https://www.rolandberger.com/en/Insights/Publications/Curtis-Carlson-on-how-to-seed-serial-innovation.html)) | practitioner | Proposing an improvement or investment to engineers or R&D | "Je stelt de R&D-manager van een machinebouwer voor om bij elke nieuwe machine een DFMA-review in te bouwen." | 4 |
| `monroe` | Monroe's Motivated Sequence / Monroes motiverende volgorde | Attention · Need · Satisfaction · Visualisation · Action / Aandacht · Behoefte · Oplossing · Verbeelding · Actie | Alan H. Monroe, Purdue, mid-1930s ([Motivated sequence](https://en.wikipedia.org/wiki/Monroe%27s_motivated_sequence); [SaskOER chapter](https://www.saskoer.ca/rcm401/chapter/monroes-motivated-sequence/)) | some research, mixed results | Persuasive talk that asks a group to act | "Je overtuigt het MT van een installatiebedrijf om elke maandag een kwartier gemba-tijd in de agenda te blokkeren." | 5 |

**Not added: Problem-Agitate-Solve (PAS).** It is a direct-response copywriting formula, popularised (not demonstrably invented) by Dan Kennedy ([Copyblogger](https://copyblogger.com/problem-agitate-solve/)). As a structure it is `psb` with the pain made bigger. "Agitate" can easily come across as manipulative to a client, so it does not fit a consultant's role. Its useful core, making the cost of doing nothing concrete, goes into the coach note for `nabc` (Need) and `monroe` (Need) instead.

### D. Inspiring and vision

| id | Name en / nl | Steps | Source | Evidence | When | Example (nl) | Level |
|---|---|---|---|---|---|---|---|
| `why` | Golden Circle: Why, How, What / Gouden cirkel: Waarom, Hoe, Wat | Why · How · What / Waarom · Hoe · Wat | Simon Sinek, TEDxPugetSound 2009, "How Great Leaders Inspire Action" ([TED](https://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action)); *Start with Why* (2009). | practitioner. **The brain claim (limbic system = why) is not supported by neuroscience** ([critique](https://substack.jurgenappelo.com/p/end-with-why)). Use it only as a rhetorical order. | Kicking off a change, motivating a team | "Je opent de eerste verbeterweek bij een waterbedrijf voor twintig monteurs die 'weer een project' verwachten." | 4 |
| `sparkline` | What is / What could be (Duarte) / Wat is / Wat kan zijn | What is now · What could be · Back to the hard truth · The new bliss and the first step / Hoe het nu is · Hoe het kan zijn · Terug naar de harde werkelijkheid · Het nieuwe normaal en de eerste stap | Nancy Duarte, *Resonate* (2010), the sparkline ([Duarte: the secret structure of great talks](https://www.duarte.com/resources/secret-structure-great-talks/)) | practitioner (analysis of famous talks) | Vision talk, kick-off, an annual meeting | "Op de jaarlijkse kick-off schets je de afdeling engineering hoe het eruitziet als tekeningen in één keer goed worden vrijgegeven." | 5 |

Duarte's real sparkline moves back and forth between the two states several times. Four steps is the shortest form that still shows the contrast twice. **Open question Q4.**

### E. Storytelling

| id | Name en / nl | Steps | Source | Evidence | When | Example (nl) | Level |
|---|---|---|---|---|---|---|---|
| *(exists)* `star`, `story3` | | | | | | | 1 |
| `choice` | Challenge, Choice, Outcome / Uitdaging, Keuze, Uitkomst | The challenge · The choice I made · The outcome and the lesson / De uitdaging · De keuze die ik maakte · De uitkomst en wat ik leerde | Marshall Ganz (Harvard Kennedy School), Public Narrative: the "choice points" in the Story of Self ([Ganz, *Public Narrative, Collective Action, and Power*](https://dash.harvard.edu/bitstream/1/29314925/1/Public_Narrative_Collective_Action_and_Power.pdf)) | practitioner (organising practice) | "Why do you do this work?", introducing yourself, the personal story behind a request | "Bij je eerste klantdiner vraagt de directeur waarom je van werktuigbouwkunde naar Lean-consultancy bent overgestapt." | 4 |
| `spine` | Story spine / Verhaalruggengraat | Once upon a time · Every day · Until one day · Because of that · Because of that · Until finally · Ever since then / Er was eens · Elke dag · Tot op een dag · Daardoor · Daardoor · Tot uiteindelijk · Sindsdien | Kenn Adams (improv, late 1980s/1991). Brought to Pixar by Rebecca Stockley; made famous by Emma Coats' "22 rules" (2011) ([NPR, 2026](https://www.npr.org/transcripts/nx-s1-5750619)). **It is not a Pixar invention.** | practitioner | A told case story, a success story at the end-of-project drinks | "Vertel op de afsluitborrel het verhaal van de ombouw van lijn 4: van 90 minuten omstellen naar 25." | 5 |

How `choice` differs from `star`: STAR reports what happened, for a job interview. Challenge-Choice-Outcome puts the dilemma and the lesson at the centre. That makes it more personal and more persuasive.

### F. Feedback

| id | Name en / nl | Steps | Source | Evidence | When | Example (nl) | Level |
|---|---|---|---|---|---|---|---|
| `sbi` | Feedback: SBI + request / Feedback: SGI + verzoek | Situation · Behaviour · Impact · Your request / Situatie · Gedrag · Impact · Je verzoek (same words as `con_sbi`) | Center for Creative Leadership, Situation-Behavior-Impact™ ([MindTools on CCL's SBI](https://www.mindtools.com/ay86376/the-situation-behavior-impact-feedback-tool)). **The 4th step (Next/Request, "SBIN") is a common extension, not CCL's core.** CCL's own extension is Intent (SBII). | practitioner | Feedback to a colleague, a team lead or a client employee | "Een teamleider bij je klant heeft in de stand-up twee keer een operator afgekapt die een probleem meldde. Geef hem na afloop feedback." | 2 |

### G. Hard questions and the media

| id | Name en / nl | Steps | Source | Evidence | When | Example (nl) | Level |
|---|---|---|---|---|---|---|---|
| `abc` | Acknowledge, Bridge, Communicate / Erkennen, Bruggetje, Boodschap | Acknowledge the question · Bridge · Your message / Erken de vraag · Bruggetje · Jouw boodschap | Media-training practice. **The origin is not documented.** Variants: Bridge-Convert, -Contribute, -Continue ([NZ Herald](https://nzherald.co.nz/business/ithe-pitchi-getting-your-message-across-is-as-easy-as-abc/FXI3K7TQ523KK3OS4YENRE3ISM)). Criticism: misused, it becomes evasion ([Throughline](https://www.throughlinegroup.com/2015/11/01/media-interview-bridging-is-bridging-an-outdated-practice/)). | folk | A hostile or loaded question, in a town hall, with the works council, with a journalist | "Een vakbondsman roept in de kantinesessie: 'Lean is toch gewoon een nette manier om banen te schrappen?'" | 3 |

The coach must check that he **does answer** a fair question and does not dodge it (§6).

### H. Bad news

| id | Name en / nl | Steps | Source | Evidence | When | Example (nl) | Level |
|---|---|---|---|---|---|---|---|
| `badnews` | Bad news: heads-up, headline, pause, plan / Slecht nieuws: aankondigen, kern, stilte, plan | Heads-up: bad news · The news in one sentence · Pause and acknowledge · What happens now / Aankondigen: slecht nieuws · Het nieuws in één zin · Stilte en erkennen · Wat we nu doen | **Adapted** from SPIKES (Baile, Buckman et al., *The Oncologist* 2000; [doi:10.1634/theoncologist.5-4-302](https://doi.org/10.1634/theoncologist.5-4-302)): K = warning shot and small chunks, E = empathy, S = strategy. Setting, Perception and Invitation are left out because they don't fit a 1-minute spoken drill. | research for SPIKES (mainly trainees' self-reported confidence). **This four-step adaptation is our own** and must be labelled as such. | A slipped deadline, budget overrun, a failed pilot | "Je moet de projectsponsor vertellen dat de go-live van het nieuwe planbord twee weken opschuift, omdat de data uit het MES niet klopt." | 4 |

### I. Elevator pitch

This is `pitch` (see C). It is listed under persuading because there it competes with `psb`/`nabc` in the pick step.

### J. Opening and closing a meeting

| id | Name en / nl | Steps | Source | Evidence | When | Example (nl) | Level |
|---|---|---|---|---|---|---|---|
| `open` | Meeting opening: purpose, outcome, process / Opening: doel, uitkomst, aanpak | Why we are here · What we leave with · How and how long / Waarom we hier zitten · Waarmee we weggaan · Hoe en hoe lang | Facilitation practice, often called "POP" (Purpose, Outcomes, Process). **There is no single originator (folk).** | folk | Opening any meeting, workshop or kaizen event | "Je opent de wekelijkse KPI-review bij een prefabbetonfabriek. De vorige twee liepen uit en eindigden zonder besluit." | 2 |
| `close` | Meeting close: decided, who does what, next / Afsluiting: besloten, wie doet wat, vervolg | What we decided · Who does what by when · What stays open and when we meet / Wat we besloten · Wie doet wat voor wanneer · Wat open blijft en wanneer we verder gaan | Folk. Close to the Lean action list (who/what/when) | folk | The last two minutes of a meeting | "Sluit de kick-off van het 5S-project af: er zijn drie acties en één punt waar niemand een besluit over durfde te nemen." | 2 |

### K. Lists

This is `three` (see A).

### Considered but not added

| Format | Why not |
|---|---|
| WSN, PREP, STAR, PSB, PPF | Already exist |
| BLUF, Minto pyramid | = `answer` (credit line added) |
| PAS (Problem-Agitate-Solve) | = `psb` + pressure; manipulative in a consulting role; its core goes into the coach notes |
| SPIKES in full | Medical, 6 steps, too long; adapted into `badnews` |
| Moore positioning statement in full | Strategy document, not a spoken form; adapted into `pitch` |
| Ganz Self-Us-Now in full | Three stories in one, too long for 90 seconds; `choice` is its building block |
| Nonviolent Communication (Rosenberg: Observation, Feeling, Need, Request) | Alternative to SBI; one feedback frame is enough for now (**Q3**) |

**Total: 15 new frames.** The frames drill goes from 7 to 22.

---

## 3. Design: how the formats enter the app

### 3.1 Data

- `src/core/lesson.js`:
  - `FRAME_IDS` grows to 22 ids. The order is the unlock order, so the list is readable.
  - New `FRAME_LEVEL` (id → minimum level):
    - level 1: `prep star wsn psb ppf answer story3`. **This is exactly what level 1 is today: no new frame at level 1.**
    - level 2: `open close sbi three`
    - level 3: `scqa abc compare pitch`
    - level 4: `nabc badnews why choice`
    - level 5: `monroe sparkline spine`

    Rationale: level 2 holds short, everyday forms that are easy to recognise. The pick step starts at level 3, together with the first forms that are only useful when you choose them yourself (SCQA vs answer, ABC vs psb). Levels 4 and 5 hold the long, emotional forms (5–7 steps), which only get 75–90 s answer time there. **So no timing change is needed.** The one exception is `pitch` (see 3.4).
  - New `FRAME_GROUP` (id → situation), used for plausible distractors in the pick step:
    - `spot`: prep, answer, wsn, compare, three
    - `manage`: scqa, ppf
    - `persuade`: psb, pitch, nabc, monroe
    - `inspire`: why, sparkline
    - `story`: star, story3, choice, spine
    - `people`: sbi, abc, badnews
    - `meeting`: open, close
  - Helper `framesAt(level)` → the unlocked ids.
- `makePrompt(drill, content, rng, seen, opts = {})` gets an optional 5th argument `{ frameLevel }`. The default is 1: a call that passes no level only shows the current 7 frames (safe by default, nothing floods). For the `frame` case:
  - candidates = `content.frames` where `FRAME_LEVEL[f.frame] <= frameLevel`, then `pickFresh`
  - options = the right frame + **one distractor from the same `FRAME_GROUP`** (if one is unlocked; otherwise random) + one random unlocked frame from another group, shuffled. Always 3 options, all distinct.
- Callers pass `frameLevel: state.drillLevels.frame || 1`:
  - `app.js` (L235)
  - `today.js` (`todayPick`)
  - `lesson.js` `buildLesson` (via `opts.levels` or `opts.frameLevel`)
  - `share.js` `challengePrompt` passes **5**, so a shared prompt always reproduces, whatever the friend's level.
- If his level drops (`adjustDrillLevel`), higher frames disappear from new rounds again. Due reviews that have already been saved keep their frame. This is correct, because a review is the same prompt.
- `src/content/prompts.{nl,en}.js`: 15 × 6 = 90 new prompts per language, ids `f45`–`f134`, grouped per frame in the `FRAME_LEVEL` order. They must be parallel: same id, same frame.
  - **Mix, as in the existing pool:** at least 4 of the 6 from Lean consultancy / engineering / project work, plus at most 2 from captain/sport or private life (but `badnews`, `scqa` and `nabc` are all work).
  - Every prompt names a concrete situation with a number or a person (see the examples in §2), not a generic topic.

### 3.2 Pick step (level ≥ 3)

- The behaviour stays the same: the pick happens off the clock, then `frameRight` or `frameWrong`, then the steps. The buttons still only show the **name**. No descriptions on the buttons, so the pick stays a real choice and the card stays small.
- The distractor from the same group makes the choice meaningful. Examples: `scqa` vs `ppf` for an update, `abc` vs `badnews` for a hard moment.
- **New after the pick (and at levels 1–2 under the frame name):** one line `frameWhen_<id>` ("Gebruik dit als …") and a small credit line `frameFrom_<id>` ("Barbara Minto, McKinsey"). This is what makes the formats feel like "what good speakers use", which is what Merijn asked for. The credit is muted text, with no links in the app (offline-first). The links stay in this plan and in the tips.
- At `frameWrong`, the `frameWhen` line of the right frame explains **why** that one fits better.

### 3.3 Unlock moment

- When `drillLevels.frame` goes up to 2, 3, 4 or 5 (in `applyRound`, where the level is already adjusted), the result screen shows one line: `frameUnlocked(names)`, for example "Nieuw in Spreekstructuren: SCQA, ABC, Vergelijk-Contrast-Conclusie, Liftpitch". It shows only once per level, so `state.frameUnlockSeen` stores the highest level announced.
- Pure helper `newFramesAt(prevLevel, nextLevel)` → ids.

### 3.4 Timing

`drillTiming` stays as it is. One optional exception: `pitch` caps the answer time at 30 s (`FRAME_ANSWER_S = { pitch: 30 }`). round.js already uses `prompt.timing || drillTiming(...)`, so makePrompt can set `prompt.timing` for `pitch`. **Q5:** does Merijn want this?

### 3.5 Feedback and coach: was the structure used?

1. **Coach prompt** (`coach.js`): extend `FRAME_EN` with all 15 new frames, steps written out. Add a short judging note to each frame where one is needed (`FRAME_NOTE_EN`):
   - `abc`: "acknowledge briefly without repeating the loaded framing; if the question is fair he must actually answer it; a bridge that dodges a fair question costs structure and clarity"
   - `badnews`: "the bad news must come in one plain sentence within the first two sentences; no burying it; a real pause; then a concrete next step"
   - `scqa`: "the situation must be uncontroversial and short; the complication is what changed; the answer is stated, not hinted"
   - `nabc`/`monroe`: "make the cost of doing nothing concrete in the Need step (numbers), without exaggerating"
   - `pitch`: "under ~30 seconds; ends with a concrete ask"
   - `why`: "the why is a purpose for the listeners, not a company slogan"
   - `spine`: "the 'because of that' steps must be causal, not 'and then'"
   - `sbi`: "behaviour is observable, not a judgement of character; impact is concrete"
2. **Step check in the response:** for `drill === 'frame'`, use a separate `FRAME_COACH_SCHEMA` = `COACH_SCHEMA` + a required field `frame_steps`: an array of booleans, one per step of the asked frame, in order (the step names are listed in the prompt). `COACH_SCHEMA` itself stays unchanged for all other drills (it is strict and fully `required`). `parseCoachResponse` accepts `frame_steps` only if it is an array of booleans; otherwise it drops the field, and the parse still succeeds.
3. **Display:** on the result screen of a frame round, the step chips appear again. A hit step is `chip good`; a missed step is muted, with `frameStepMissed` as its aria label. This uses the same chip style as the scaffold, with no new components.
4. **Without a coach** (no API key or offline): under the chips, `frameSelfCheck` ("Welke stappen heb je geraakt?"). The chips become toggles, tap = hit. This is only visual feedback and is not stored (**Q6**). No local signpost heuristic: a keyword check on noisy speech-to-text is too unreliable to show as a judgement.
5. The `frame` tip in `tips.js` ("name the steps out loud") stays generic. No tip per frame.

### 3.6 i18n keys (en + nl, parity is already tested in `tests/i18n.test.js`)

- Per new id (15×): `frameName_<id>`, `frameSteps_<id>` (array)
- Per id (22×, existing ids included): `frameWhen_<id>` (string, one line), `frameFrom_<id>` (string, short credit). For `story3`, `frameFrom` is "Vantage Point". For `ppf` and `prep` it is "Veelgebruikte vuistregel" / "Common rule of thumb".
- `frameUnlocked: (names) => …`, `frameSelfCheck`, `frameStepMissed`, `frameStepHit`
- Update `how_frame`: "… Nieuwe structuren komen erbij op niveau 2 tot en met 5; vanaf niveau 3 kies je de structuur eerst zelf."
- nl names in plain Dutch, with the English acronym where the term is known (SCQA, ABC, NABC, SBI/SGI: **Q2**).

---

## 4. TDD task list

**Method:** as in v16. For each task, write the named tests, run `npm test` and watch them fail, write the smallest code that makes them pass, run `npm test` until everything is green, then commit. One commit per task. Core first, then content, coach, UI, e2e and the service worker.

### Phase A: core

**Task 1: frame catalogue.**
- Files: `src/core/lesson.js`, `tests/lesson.test.js`.
- Tests:
  - `FRAME_IDS has 22 unique ids and every id has a FRAME_LEVEL 1-5 and a FRAME_GROUP`
  - `level 1 unlocks exactly the seven original frames`
  - `framesAt is monotonic: every level contains the previous level`
  - `every group has at least two frames by level 5`
- In `tests/lesson.test.js`, replace the local copy of `FRAME_IDS` with an import.

**Task 2: level-aware frame prompt.**
- Files: `src/core/lesson.js`, `tests/lesson.test.js`.
- Tests:
  - `makePrompt frame without a level only picks level-1 frames` (seeds 1–50)
  - `makePrompt frame at level 3 never picks a level-4 or level-5 frame`
  - `frame options are 3 distinct unlocked frames including the right one` (adapts the existing test, all levels)
  - `frame options include a same-group distractor when one is unlocked`
  - `frame options fall back to random when the group has no other unlocked frame`
  - `a level-5 frame is picked at level 5 when it is the only unseen prompt`

**Task 3: thread the level through the callers.**
- Files: `src/core/today.js`, `src/core/lesson.js` (`buildLesson`), `src/app.js`, `src/core/share.js`; tests in `tests/today.test.js`, `tests/lesson.test.js`, `tests/share.test.js`.
- Tests:
  - `todayPick passes drillLevels.frame to the frame prompt`
  - `buildLesson with levels.frame 1 never yields a level-2+ frame`
  - `challengePrompt reproduces a level-5 frame prompt regardless of level`
- Check: existing share/today tests stay green.

**Task 4: unlock detection.**
- Files: `src/core/lesson.js` (or `progress.js`), `src/core/round.js` (`applyRound`), `tests/lesson.test.js`, `tests/round.test.js`.
- Tests:
  - `newFramesAt(2, 3) lists scqa, abc, compare, pitch`
  - `newFramesAt for a drop or the same level is empty`
  - `applyRound records frameUnlockSeen once and returns the unlocked ids only the first time`

### Phase B: content and i18n

**Task 5: i18n for the 15 frames.**
- Files: `src/i18n.js`, `tests/lesson.test.js`.
- Tests:
  - `every FRAME_ID has frameName, frameSteps (2-7 strings), frameWhen and frameFrom in en and nl` (replaces the story3-only test)
  - `en and nl frameSteps have the same length per frame`
  - `sbi frame steps equal con_sbi in both languages`
- i18n parity is already covered by `tests/i18n.test.js`.

**Task 6: prompts, wave 1** (level 2 + 3: open, close, sbi, three, scqa, abc, compare, pitch → f45–f92).
- Files: `src/content/prompts.{nl,en}.js`, `tests/lesson.test.js`.
- Tests:
  - `frames pool: parallel ids and frames in en and nl` (existing, size now ≥ 92)
  - `every frame in FRAME_IDS has at least 6 prompts`
  - `frame prompt ids are unique and sequential f01..fNN`

**Task 7: prompts, wave 2** (level 4 + 5: nabc, badnews, why, choice, monroe, sparkline, spine → f93–f134).
- Same tests; size ≥ 134. Wave 1 can ship without wave 2 if `FRAME_LEVEL` is limited temporarily, but the tests from Task 1 require all 22. Keep both waves in one release, unless Merijn chooses otherwise (**Q1**).
- Content check by hand: Lean, engineering and project terms correct in nl. Read each nl text aloud once.

### Phase C: coach

**Task 8: coach knows every frame.**
- Files: `src/core/coach.js`, `tests/coach.test.js`.
- Tests:
  - `every FRAME_ID has an English coach description`
  - `abc coach request tells the coach a fair question must be answered`
  - `badnews coach request asks for the news within the first two sentences`
  - `a wrong pick is still reported for new frames` (scqa picked, answer asked)

**Task 9: step check.**
- Files: `src/core/coach.js`, `tests/coach.test.js`.
- Tests:
  - `frame drill uses FRAME_COACH_SCHEMA with required frame_steps; other drills keep COACH_SCHEMA`
  - `frame request lists the asked steps in order`
  - `parseCoachResponse keeps frame_steps when it is an array of booleans`
  - `parseCoachResponse drops a malformed frame_steps and still parses`
  - `COACH_SCHEMA is unchanged (snapshot of its keys)`

### Phase D: UI

**Task 10: when and credit lines.**
- Files: `src/ui/round.js`, `tests/ux.test.js` (or the existing round UI test, if there is one).
- Tests:
  - `frame card shows frameWhen and frameFrom under the steps at level 1`
  - `pick buttons show names only` (no frameWhen before the pick)

**Task 11: step result.**
- Files: the result screen (where `stats` is rendered; look up with graphify "result screen coach stats frame"), `styles.css` (reuse `chip good`).
- Tests:
  - `result screen marks hit and missed frame steps from frame_steps`
  - `without a coach result the frame steps are tappable self-check chips`
  - a11y: `missed step chips have an aria-label` (in `tests/a11y.test.js`)

**Task 12: unlock line.**
- Files: result screen, `src/i18n.js`.
- Test: `level-up in frames shows the newly unlocked frame names once`.

**Task 13 (optional, Q5): pitch 30 s.**
- Files: `src/core/lesson.js`.
- Test: `pitch frame prompt carries timing with answerS 30`.

### Phase E: e2e and release

**Task 14: e2e.**
- File: `e2e/smoke.mjs`.
- The existing step "frames drill: pick a frame at level 3" must stay green unchanged. It clicks the first option, so it does not depend on which frames appear.
- New step `frames drill: level 4 shows an unlocked format with its credit`:
  - set `drillLevels.frame = 4`
  - mark every `frame:fNN` as `seen` except one `abc` prompt (the same trick as `share.js`), so the prompt is deterministic
  - pick a frame, then assert `.frame-name` contains "ABC" and three chips appear, and that the credit line is visible
  - screenshot at the next free number (currently after 85)
- New step `frames drill: level 1 shows no level-2+ format`: mark everything as seen except one `open` prompt and one `prep` prompt, then assert that the `prep` prompt is shown.
- When a coach mock exists in the e2e (look up `coach` in `smoke.mjs`): add a `frame_steps` mock and assert one missed chip on the result screen. Without a mock: assert the self-check chips.

**Task 15: release.**
- Bump the `CACHE` in `sw.js` (`vantage-point-v191` → the next number at merge time; other agents bump it too, so rebase).
- Update `tests/sw.test.js` only if it pins the version.
- Run `npm test` and the e2e smoke, then do one manual round in nl on a phone width.

---

## 5. Impact and risks

- **Pool size:** frame prompts go from 44 to 134 per language. `pickFresh` scales fine. `seen` grows by 90 keys, which is negligible.
- **Shared links** from older versions still reproduce: f01–f44 are unchanged, and `challengePrompt` uses level 5.
- **Due reviews and history** contain only old frame ids, so no migration is needed.
- **Storage:** one new field, `frameUnlockSeen` (number, default 0). If v16 sync uses a whitelist, add the field to it. Check `sync.js` for field merging (max wins).
- **Main risk is content quality:** 180 new texts. Write each frame's 6 prompts in one go per language, and have them reviewed (a review agent or Merijn) before merging.
- **Honesty in the app:** `frameFrom` names only the originator. Where it is folk, say so ("Uit mediatraining", "Veelgebruikte vuistregel", "Naar SPIKES (Baile & Buckman)"). Never write "proven by science".

---

## 6. Open questions for Merijn

1. **Q1 Scope:** all 15 new frames in one release, or first wave 1 (level 2–3: open, close, sbi, three, scqa, abc, compare, pitch) and the rest later?
2. **Q2 Names in nl:** use English acronyms (SCQA, NABC, SBI, ABC), or Dutch ones (SCVA, SGI, EBB)? Proposal: the English acronym as the name, with the Dutch words as the steps.
3. **Q3 Feedback:** is SBI + request enough, or should Nonviolent Communication (Observation, Feeling, Need, Request) also be included as a softer alternative for the captain context?
4. **Q4 Duarte:** keep the four-step version of the sparkline, or leave Duarte out and keep only Sinek for vision talks?
5. **Q5 Pitch timer:** should the elevator pitch get a strict 30 s, regardless of level?
6. **Q6 Self-check without a coach:** store the step hits, so the app later shows which structure he keeps missing, or keep them purely visual?
7. **Q7 Unlock order:** does the order fit his practice? For example, should `badnews` move up to level 3 because it comes up often with clients, and `compare` move down to level 4?
8. **Q8 Other situations:** are any situations missing from his work, such as a sales or intake conversation, a negotiation opening, or an apology to a client?
9. **Q9 Course lessons:** should these formats also become a short theory lesson in a course ("Spreekstructuren van bekende sprekers"), or stay in the frames drill only?

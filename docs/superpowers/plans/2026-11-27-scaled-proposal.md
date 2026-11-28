# pm.scaled: why the SAFe module is unclear, and how to fix it

Read-only design, 27 Nov. Merijn (18 Nov priorities, `2026-11-18-v18-merijn-improvements.md`): the SAFe module is "heel erg onduidelijk" and gets a content pass before the other module passes. This document says why it is unclear, proposes a new structure with one running example, and cuts the build into tasks. Nothing is built until Merijn answers section 4.

Read for this: `src/content/courses/pm/scaled.{nl,en}.js` (16 lessons), its index entry, the three films (`films/pm.scaled.{intro,pi,hybrid}`, beats and nl VTTs), `textfirst.js` (none of the three is text-first), the neighbours `pm.agile` and `pm.devops`, design addendum 3 (the four levels), the question standard, and the v18 design (P-n, banks, rule 5.2).

---

## 1. Diagnosis

### 1.1 The three causes behind everything

**A. The app teaches level by level across the topics, and the module was written topic by topic.** `nextLesson` and `moduleBreadth` in `src/core/course.js` offer every Basis lesson of the module first, then every Werkkennis lesson, and so on (a learner can still open a topic's next level by hand). So what Merijn reads when he follows the app is:

| Round | Lesson 1 | Lesson 2 | Lesson 3 | Lesson 4 |
|---|---|---|---|---|
| Basis | why (train, PI) | **lpm** (portfolio governance, two kinds of value streams, OKRs) | less (an alternative to SAFe) | stagegate |
| Werkkennis | piplanning | epics | nexus | longlead |
| Gevorderd | **roles** | wsjf | spotify | integration |
| Expert | configs | budgets | critique | hybridgov |

The brief planned each topic as a column, so it never saw the rows. In the order Merijn meets them:
- After one SAFe lesson he gets portfolio governance (lpm), then an *alternative* to SAFe (LeSS) before he knows what SAFe does above the teams.
- PI Planning (round 2) names the Business Owners, and its questions name the Release Train Engineer. Who these people are only comes in **roles, six lessons later** in round 3. You cannot follow a two-day planning if you do not know who is in the room.
- The System Demo, the heartbeat of a train, first shows up in the hardware topic (`integration`, round 3). Inspect and Adapt, which closes every PI, is taught at Expert (`configs`, round 4).

**B. One film replaces the reading of three lessons, and plays three times.** `why`, `piplanning` and `roles` all have `film: 'pm.scaled.pi'`. A lesson with a main film skips both the reading and the worked example (`lessonPhases`: Raden · Film · Check). So the first SAFe lesson Merijn opens has **no reading at all**: it is a 5 min 42 s film that narrates the teach text and examples of levels 1, 2 and 3 in one go (88 subtitle cues, about 35 named terms). In round 2 and round 3 he gets the same film again. The Basis level shows Werkkennis and Gevorderd content before he is there, and the higher levels show nothing new.

**C. No running example, and no picture of how the parts relate.** The 16 lessons use more than twenty different companies (packaging machines, agricultural machines, weighing systems, cooling plants, medical devices, conveyor belts, ovens, presses, charging points, cooling cabinets, inspection machines, sorting machines, palletising robots, building materials, lifts, pumps, e-bikes, beds…), and the intro film adds another (an MES rollout). Every lesson resets the numbers. Merijn never sees *one* train go through *one* PI with *one* backlog and *one* budget. And there is not one picture in the module of team → train → solution train → portfolio, of the PI as a timeline, or of the planning board, although the text describes all three in words ("een groot bord met de teams in rijen en de iteraties in kolommen").

### 1.2 Per lesson, ranked by how much it hurts understanding

1. **`why` + film `pm.scaled.pi` (Basis, first contact): worst.** Cause B: no reading, a 5:42 film covering three levels. The narration is the teach text in telegram style, trivia before the idea: "De bekendste aanpak: SAFe, uit tweeduizend elf; versie zes is van begin tweeduizend drieëntwintig. Een jaarlijkse enquête noemt SAFe al jaren het meest gebruikt. Let wel: geen steekproef." In the text, teach block 2 spends its 90 words on Leffingwell, 2011, version 6.0 and a caveat about the State of Agile survey, before the learner knows what SAFe does. Block 4 brings four time words at once (cadans, Planning Interval, iteratie, IP-iteratie) with no timeline. "Een team van agile teams" is a word-for-word copy of SAFe's "team of Agile teams" and does not say anything to a Dutch reader.
2. **`roles` (Gevorderd): in the wrong place.** Who is who is Basis knowledge (cause A), and it arrives after it was needed. The text is translated framework definitions: "Product Management is de functie die bepaalt welke oplossingen gewenst, haalbaar en levensvatbaar zijn" (desirable, feasible, viable); "Die verdeling heet in SAFe de verdeling van inhoudelijke zeggenschap (content authority)"; "dienend leider (servant leader) … stuurt op flow". It mentions "enablers" before any lesson in the round order has taught them. As a Gevorderd lesson it should be about decisions (who wins when Product Management and a PO disagree, what the RTE does when a team misses its plan), but it is mostly a list of definitions.
3. **`configs` (Expert): a wall of names, and four subjects in one.** About twenty new names in five blocks: Essential SAFe, Large Solution SAFe, Solution Train, Solution Train Engineer, Solution Management, Portfolio SAFe, Full SAFe, Inspect and Adapt, ART predictability measure, ART Planning Board, ART Backlog, Planning Interval, Coach Sync, Team Sync, cyber-fysieke systemen, Enterprise Solution Delivery. Worst block: "Die laag heet de Solution Train: meerdere treinen en leveranciers die samen één groot systeem bouwen, met eigen rollen zoals de Solution Train Engineer (de RTE van treinen) en Solution Management. Portfolio SAFe voegt aan Essential de portfoliolaag toe: strategie, financiering per waardestroom en governance. Full SAFe combineert alles." Four configurations are a ladder that begs for one picture; instead they are three sentences. I&A (every PI) and the predictability measure do not belong at Expert.
4. **`lpm` (Basis, second lesson Merijn reads): Expert content at Basis.** "Volgens SAFe brengt LPM strategie en uitvoering op één lijn door Lean- en systeemdenken toe te passen op drie dingen: strategie en financiering, de dagelijkse portfolio-operatie, en governance." That is the SAFe website translated, not an explanation; "portfolio-operatie" is not Dutch. Then two kinds of value stream, strategic themes and OKRs, all in the second lesson of the module. The Lean link (waiting time before the decision) is good and should stay.
5. **`budgets` (Expert): repeats `lpm`, and the core is a list sentence.** Both lessons open with "financiert waardestromen in plaats van projecten" and end with nearly the same question (lpm: "Hoe lang duurt het van een goed idee tot er mensen aan werken, en waar zit die tijd?"; budgets: "Hoeveel weken zit er tussen 'goed idee' en 'er wordt aan gewerkt', en hoeveel daarvan is wachten op een beslismoment?"). The guardrails come as one sentence of four list items: "een verdeling van investeringen over horizons, van nieuwe kansen verkennen tot oude producten uitfaseren; capaciteitsallocatie (capacity allocation); goedkeuring van significante initiatieven; en continue betrokkenheid van de Business Owners." "Horizons" is never explained; "significante initiatieven" is an anglicism (Dutch: grote initiatieven).
6. **`less` (Basis): an alternative before the original.** In round 1 Merijn has read one SAFe lesson, and now gets eight LeSS names (Sprint Planning One and Two, Overall Retrospective, feature team, component team, LeSS Huge, requirement area, Area Product Owner). The only comparison of Nexus, LeSS and SAFe sits in block 5 of `nexus`, one level higher. The comparison is what a beginner needs first.
7. **`piplanning` (Werkkennis): good, but leans on what is missing.** Concrete, a clear capacity example, a good situation. But it uses features before any lesson in the round order defines a feature (`roles`, round 3), its recall names the RTE before he is taught, and the board is described in words instead of shown.
8. **`spotify` (Gevorderd) and `nexus` (Werkkennis): the levels do not build.** The alternatives topic is four separate subjects stacked as levels: LeSS, Nexus, Spotify, critique. Nexus is not harder than LeSS, and Spotify is description (Basis work) at Gevorderd. Addendum 3 says such a topic is "too thin or two topics in one".
9. **`critique` (Expert): good content, Basis questions.** The weighing is fair and well sourced. Its questions are definitions ("Wat zegt de wet van Conway?", "Wat bedoelde Martin Fowler in 2018 met het Agile Industrial Complex?") at Expert.
10. **`epics` (Werkkennis) and `wsjf` (Gevorderd): clear, small issues.** WSJF is the clearest lesson in the module. Working it out is Werkkennis-type work (simple numbers), and running the scoring session and the criticism are Gevorderd. The Portfolio Kanban states are an English list ("Funnel, Reviewing, Analyzing, Ready, Implementing en Done") without a picture.
11. **The hybrid topic (`stagegate`, `longlead`, `integration`, `hybridgov`): the best part.** Concrete, numbers that mean something, the right Lean links, and the levels build. Two issues: `stagegate` repeats `pm.agile.fit`, which already teaches stage-gate and the hybrid idea, and `integration` is where the System Demo is first explained, which should happen in the SAFe topic.

### 1.3 Module-wide

- **Questions.** The lint baseline for pm.scaled holds 168 findings: absolute 68, offtopic 40, shortstem 28, definition 18, nobody 6, echo 5, length 3. Joke options and give-aways: "Alleen de kantine en de koffieautomaat" (less), "De huisstijl en vaste opbouw van presentaties" (lpm), "Er is geen verschil: het zijn twee namen voor dezelfde stroom" (lpm), "Omdat SAFe het verplicht stelt voor elke audit" (epics), "Precies twee teams" (nexus). Several numeric questions test arithmetic, not understanding: "Een ontwikkelfase duurt 30 weken … sprints van 2 weken. Hoeveel sprints?" (stagegate), "3 × 45 minuten" (less), "7 × 8 + 4 mensen in een tribe" (spotify). Expert questions that are definitions: "Welke configuratie noemt SAFe het eenvoudigste startpunt?" (configs).
- **The openers** (`openers.pm.js`, `pm.scaled/*`) promise arithmetic as the skill of a level: "Je telt mensen in tribes en squads" (Gevorderd), "hoeveel sprints je aan werk laat liggen" (Werkkennis), and "wat hardware in de loop met zich meebrengt" (a mistranslation of hardware-in-the-loop).
- **Dutch that reads as translated English.** "Volgens SAFe" appears 12 times; it reads like a paraphrased manual. Plus "team van agile teams", "dienend leider", "stuurt op flow", "inhoudelijke zeggenschap", "portfolio-operatie", "significante initiatieven", "continue betrokkenheid". The rule that SAFe names stay English is right (Dutch practitioners say "PI Planning", "Business Owner"), but the sentences around them should be plain Dutch.
- **The intro film** follows an MES rollout that no lesson uses, and its level sentence lists unrelated subjects per level ("Op niveau Basis gaat het over waarom opschalen, waardestromen, LeSS en stage-gate"), which shows cause A out loud.

### 1.4 Facts (checked against SAFe 6.0 as I know it)

No wrong statements found in the SAFe text; the numbers are right (ART 50 to 125 people, PI 8 to 12 weeks, Business Owner value 1 to 10, predictability 80 to 100%, the four configurations, the four guardrails, the 6.0 renames including Coach Sync and Team Sync, Scrum Master/Team Coach, Enterprise Solution Delivery). LeSS, Nexus, Spotify, Schwaber, Fowler, Cooper and Water-Scrum-Fall are correct and sourced in the brief. Points to check or add:
- **Is 6.0 still current?** The brief checked on 8 Nov and found nothing newer. I cannot rule out a later release or "6.x" update. The build agent checks framework.scaledagile.com first and adjusts names if needed.
- **Portfolio Kanban:** in 6.0, Implementing is split into MVP and Persevere. Adding that fits the persevere/pivot idea the lesson already teaches.
- **State of Agile survey:** its yearly cadence after the 17th edition (2023) is uncertain. Drop the survey from Basis, or say "een enquête van een leverancier" without "jaarlijks".
- **Missing, worth adding:** the System Demo every iteration and I&A every PI as part of the basic PI cycle; and the Dutch context (several large Dutch grid operators and manufacturers that scale use SAFe, as far as I know; to be checked and stated without naming companies if a source is missing).

---

## 2. Proposed structure

### 2.1 Principles

1. **Write for the order Merijn reads.** Round by round: a lesson may use only what pm.agile teaches, and lessons at its own level in earlier topics or at lower levels. A dependency table is in 2.4.
2. **One company the whole way through.** Every lesson's example and situation, the pictures and the films use the same programme. Other companies appear only as a contrast at Expert, in one sentence.
3. **First the picture, then the words.** Every structure (who is in the train, the PI as a timeline, the board, the backlog ladder, the configurations) is a G1 picture with the text explaining each label.
4. **One idea per block, Dutch first.** Block 1 of each lesson says what the thing is for, in plain words, before the SAFe name. History and sources go to the last block or to the terms.
5. **Keep the topic ids** (`safe`, `portfolio`, `hybrid`, `alternatives`) so the openers keys stay; new titles, and the hybrid topic moves before alternatives (it matters more to Merijn, and in round 3 `integration` uses the System Demo that `roles` has just taught).

### 2.2 The running example (invented)

**Hoogveld Verpakkingsmachines**, a machine builder in Brabant (about 450 people; the name is invented), builds its new machine generation, the **TS9 traysealer with service op afstand**. Machine data goes to a platform, the operator reports a fault with one tap, the factory MES receives production data, and Hoogveld's service team diagnoses faults remotely.

- **The software train (one ART):** 8 teams of 9: Besturing A and Besturing B (PLC), Bediening (operator screen, HMI), Camerakeuring, Connectiviteit (machine data to the platform), Serviceportaal, MES/ERP-koppeling, and a Systeemteam (test rig, hardware-in-the-loop). Plus an RTE (the former programme manager), 2 people in Product Management and a System Architect: 76 people.
- **Business Owners:** the director of operations, the commercial director and the head of service.
- **Rhythm:** PI of 10 weeks = 4 build iterations of 2 weeks + the IP iteration; about 5 PIs a year.
- **The hardware track (stage-gate):** mechanical engineering designs the frame and an injection-moulded guard cover (mould: 14 weeks) and orders servo drives (long lead). The launch customer, a dairy plant, wants the first machine in week 40 (SOP).
- **Portfolio:** the epic "Service op afstand" with an MVP on 3 machines at the dairy plant for 3 months; features such as "storing melden met één tik", "rapport per ploeg", "koppeling met het MES", and a hard date: the new EU Machinery Regulation (2023/1230), which applies from 20 January 2027 (check the date when writing), as the time-critical feature in the WSJF lesson.
- **Contrasts at Expert only:** a grid operator with three trains on one network-control system (where a Solution Train makes sense), and Hoogveld's parent group's IT department that renames its departments "tribes".

Merijn's world is in it: Lean links (takt, obeya, waiting time, batch size), OT and IT together, a supplier lead time, a launch customer, a director who asks "what do I notice in the factory?".

### 2.3 Topics and levels

Each line says what the level teaches that the level below does not.

**Topic 1 `safe`: "De trein: veel teams, één ritme" / "The train: many teams, one rhythm"**

| Level | Lesson | Teaches |
|---|---|---|
| Basis | `why`: "Van acht teams één trein" | Why eight good Scrum teams still get stuck (dependencies). The ART: who is in it, by name and in one sentence each (the teams, RTE, Product Management, PO per team, System Architect, Business Owners). The rhythm: the PI as a timeline of four iterations and the IP iteration. No history, no configurations. Pictures: Hoogveld's train (tree) and one PI (timeline). |
| Werkkennis | `piplanning`: "PI Planning: twee dagen samen plannen" | Running the two days at Hoogveld: agenda, a team's capacity with 20% kept free, committed and uncommitted objectives, Business Owner value 1 to 10, the board with dependencies, ROAM, the confidence vote. Simple numbers. Picture: the ART Planning Board (grid). Film: rebuilt, see 2.6. |
| Gevorderd | `roles`: "Tijdens de PI: wie beslist, en hoe weet je of het werkt" | The decisions during the PI: Product Management against a PO (who orders what), the RTE removing an obstacle instead of handing out tasks, a team missing an objective. The System Demo every iteration, Inspect and Adapt at the end of the PI, the predictability measure (78%: what does it say, what do you do). Pictures: "wie beslist wat" (table) and the PI cycle (cycle). |
| Expert | `configs`: "Hoeveel SAFe heb je nodig?" | Where the train comes from (the teams that must deliver something working together, not the org chart; Conway), the four configurations as a ladder with the problem each layer solves, the Solution Train for big cyber-physical systems (the grid-operator contrast), old names as a sign of an older set-up, and the questions a senior asks before saying yes to more layers. Picture: the ladder (table: configuration, what it adds, the problem it solves). |

**Topic 2 `portfolio`: "Werk en geld: van idee tot feature" / "Work and money: from idea to feature"**

| Level | Lesson | Teaches |
|---|---|---|
| Basis | `backlog` (new): "Van groot idee tot klein werk" | The ladder epic → feature → story, with who owns each step (portfolio and Epic Owner, Product Management, the PO). The ART Backlog. The idea that the train has a fixed budget and work comes to the train, against a new project team per idea, and the waiting time that saves (the Lean link from today's `lpm`). Pictures: the ladder (tree) and the two routes from idea to work (timeline: 13 months against 2 to 4). |
| Werkkennis | `wsjf`: "Wat eerst? Cost of Delay en WSJF" | Cost of Delay in euros per week, WSJF as Cost of Delay divided by size, scoring one column at a time, sunk costs do not count. Hoogveld's four features worked out, with the Machinery Regulation date as the time-critical one. Picture: the scoring table. |
| Gevorderd | `epics`: "Een groot idee klein toetsen" | The decisions on an epic: MVP, Lean business case and hypothesis, persevere, pivot or stop on a measured result ("Service op afstand" on 3 machines comes in at 25% instead of 30%). The Portfolio Kanban with WIP limits (with the 6.0 split of Implementing). How to run a WSJF session so the scores mean something, and its main weakness (ranks added up as if they were numbers). Picture: the Portfolio Kanban (flow). |
| Expert | `budgets`: "Geld per waardestroom: Lean budgets en spelregels" | What a CFO and a controller weigh: Lean Portfolio Management in plain words, operational against development value stream, participatory budgeting, the guardrails one by one (with horizons explained), capacity allocation, the approval threshold, capitalising costs (CapEx/OpEx), Lean accounting, and the trap of SAFe with an annual project round. Absorbs today's `lpm` without the repeat. Picture: the guardrails (table). |

**Topic 3 `hybrid`: "Hardware en software samen" / "Hardware and software together"** (stays close to today; text moves into Hoogveld where the film allows, see decision Q4)

| Level | Lesson | Teaches |
|---|---|---|
| Basis | `stagegate` | The software train runs inside the stage-gate of the machine: why hardware decides in gates (cost of change), what "done" means after a hardware sprint. Links back to pm.agile.fit instead of repeating its definition. Picture: the TS9 programme as two tracks (table: hardware track with gates, software train with PIs). |
| Werkkennis | `longlead` | Backward planning from SOP week 40 to the design freeze of the guard cover in week 18; long-lead items as milestones on the ART Planning Board; set-based design. Picture: the backward plan (timeline). |
| Gevorderd | `integration` | How often to integrate hardware and software: A/B/C samples, hardware-in-the-loop on the Systeemteam's rig every iteration, the System Demo (known from round 3, lesson 1), tuning the PI to the prototype rounds. Picture: integration points over 12 months (timeline). |
| Expert | `hybridgov` | Gate criteria on evidence instead of documents, conditional go, Water-Scrum-Fall, rolling wave planning, who decides where, and when a hybrid is not needed. Picture: documents against evidence (table). |

**Topic 4 `alternatives`: "Andere wegen, en kritiek" / "Other ways, and criticism"**

| Level | Lesson | Teaches |
|---|---|---|
| Basis | `options` (new): "Drie manieren om op te schalen" | The map: Nexus (Scrum plus an integration team, 3 to 9 teams), LeSS (one PO, one backlog, one sprint, up to 8 teams), SAFe (the train plus layers above), and the "Spotify model" as a description, not a framework. What each adds above Scrum and when each fits, in one table. Hoogveld's Serviceportaal (3 teams) as the case. Picture: the comparison (table). |
| Werkkennis | `less`: "Eén backlog, één sprint: LeSS en Nexus in de praktijk" | Running one sprint the LeSS or Nexus way: Sprint Planning One and Two, the Nexus Integration Team and the Integrated Increment, Cross-Team Refinement. Feature teams against component teams with Hoogveld's numbers (one customer wish passing four component teams). Picture: component teams against feature teams (grid). |
| Gevorderd | `descale` (new): "Eerst minder afhankelijkheden, dan pas coördineren" | The choice: reduce dependencies before adding coordination (descaling), Conway's law, when feature teams cost too much specialism, and the Spotify trap (copying names without the working). The parent group's "tribes" as the faded example. Picture: the order of steps (flow). |
| Expert | `critique` | Today's lesson, kept: Schwaber, Fowler, the fair counter-arguments, the thin evidence, cargo cult, and the questions that judge any framework by what you see. Questions rewritten to Expert level. |

Retired ids: `lpm` (into `backlog` and `budgets`), `nexus` (into `options` and `less`), `spotify` (into `options` and `descale`). New ids: `backlog`, `options`, `descale` (see decision Q5).

### 2.4 Dependency check in the reading order

| Round | Lessons in order | Uses only |
|---|---|---|
| Basis | why → backlog → stagegate → options | pm.agile (Scrum, PO, backlog, story, epic, WIP); each later Basis lesson the train from `why` |
| Werkkennis | piplanning → wsjf → longlead → less | features and the ART Backlog (`backlog`), the cast (`why`); `longlead` puts milestones on the board from `piplanning` |
| Gevorderd | roles → epics → integration → descale | business value (`piplanning`), WSJF (`wsjf`), System Demo (`roles`, same round, earlier), feature teams (`less`) |
| Expert | configs → budgets → hybridgov → critique | everything below; configs names the portfolio layer, budgets then explains it |

The content review checks this table explicitly: no lesson uses a term that is first taught later in this order.

### 2.5 Pictures (G1 kit, `src/content/courses/pictures/pm.scaled.js`)

Rule 5.2: where the reasoning sits in a static structure, a picture with the reading next to it. At most two per lesson; every label occurs in the lesson text.

| Lesson | Picture (kind) |
|---|---|
| why | Hoogveld's train: ART → 8 teams + RTE, Product Management, System Architect, Business Owners (tree); one PI: PI Planning, iterations 1 to 4, IP iteration (timeline) |
| piplanning | The ART Planning Board: teams × iterations, with features and dependency marks (grid) |
| roles | Who decides what (table); the PI cycle: PI Planning → iterations with System Demo → Inspect and Adapt → next PI Planning (cycle) |
| configs | The four configurations: what each adds, the problem it solves, when it fits (table) |
| backlog | Epic → features → stories with the owner of each step (tree); two routes from idea to work (timeline) |
| wsjf | The WSJF scoring of four features (table) |
| epics | The Portfolio Kanban (flow) |
| budgets | The guardrails with an example each (table) |
| stagegate | The TS9 programme as hardware track and software train (table) |
| longlead | Backward planning from SOP (timeline) |
| integration | Integration points over a year (timeline) |
| hybridgov | Gate on documents against gate on evidence (table) |
| options | Nexus, LeSS, SAFe, "Spotify" side by side (table) |
| less | Component teams against feature teams (grid) |
| descale | Reduce dependencies first, then coordinate (flow) |

### 2.6 Films (length: what the content needs, never padded)

| Film | Now | Proposal |
|---|---|---|
| `pm.scaled.intro` (module intro) | 3:26; MES rollout; old topics; level sentence lists unrelated subjects | **Rebuild.** Hoogveld and the TS9, the four new topics, the four levels as columns with one sentence per level that really builds. Probably about 2 to 2.5 minutes; whatever the content needs. |
| `pm.scaled.pi` | 5:42; main film of three lessons, plays three times, replaces their reading | **Rebuild as a PI Planning film for `piplanning` only.** Rule 5.2 point 1 holds there: the board fills over two days, red strings appear, the vote happens. Hoogveld's teams, the capacity example (the film carries it, since a film lesson skips Voorbeeld). Probably 1.5 to 2.5 minutes. `why` and `roles` lose the film and become reading with pictures, so the Basis lesson has a real reading again. |
| `pm.scaled.hybrid` | 5:33; main film of `stagegate` and `longlead`; pump housing and e-bike examples | **Keep for now** (decision Q4). It is clear and the cost-of-change and backward-planning beats are change over time. The two lessons keep the pump and e-bike examples the film carries; Hoogveld enters through the situations and the pictures. Rebuild later with Hoogveld, as a shorter film, when films are re-rendered anyway. |

No new film for the other lessons: they are structures (pictures) or wording (text).

---

## 3. The build cut

One module pass in the v18 sense (P-n scope: questions to the standard, `best` slots, bank and blueprint, openers, lint at zero), done together with the restructure, so each lesson file is opened once. DMAIC references do not apply: pm.scaled is in the IT field, not on the DMAIC road.

| # | Task | Files | Check that must pass | Build / review (CLAUDE.md table) | Size | After |
|---|---|---|---|---|---|---|
| **S0** | Merijn answers section 4 | this doc | | | | |
| **S1a** | Topics `safe` and `portfolio` (8 lessons, nl and en) per 2.3: new text, Hoogveld throughout, pre and recall written to the question standard, `best` slots where two answers are defensible, pictures and `pictures` fields; first check framework.scaledagile.com for anything after 6.0; retire `lpm`, add `backlog`; index entry (topics, order, lessons, question counts stay 4); `openers.pm.js` keys `pm.scaled/safe` and `pm.scaled/portfolio`; remove `film` from `why` and `roles` | `src/content/courses/pm/scaled.{nl,en}.js`, `src/content/courses/pictures/pm.scaled.js` (new), `src/content/courses/index.js` (pm.scaled entry), `src/content/courses/openers.pm.js` (own keys) | `node src/content/courses/validate.js`; `node scripts/lintquestions.js` zero for the 8 lessons; picture label test; dependency table 2.4 checked by hand | **sonnet** build / **opus** review (first module rebuilt around a running example, lesson ids retired, which touches stored progress) | L | S0 |
| **S1b** | Topics `hybrid` and `alternatives` (8 lessons) the same way; retire `nexus` and `spotify`, add `options` and `descale`; topic order hybrid before alternatives; openers for both topics; lint baseline for pm.scaled regenerated at zero | the same two lesson files, the picture file, index entry, `openers.pm.js` (own keys), `tests/fixtures/v18-lint-baseline.json` | as S1a; `npm test` | **sonnet** / **sonnet** | L | S1a (same files) |
| **S2** | Bank and blueprint for pm.scaled: about 40 items in all kinds (`all`, `gap`, `order`, `match`, `best`), each with `lesson` and `source`; blueprint aims and traps per topic and level from 2.3 | `src/content/courses/banks/pm.scaled.{nl,en,blueprint}.js` (new) | bank validator (`checkBank`), lint | **sonnet** / **sonnet** | M | S1b |
| **S3** | Film `pm.scaled.pi` rebuilt as the PI Planning film (2.6), then rendered right after its review | `films/pm.scaled.pi/`, its nl/en VTTs and poster, `tests/film.test.js` (pm.scaled.pi block), `tests/fixtures/points-pending.json` if it lists it | `tests/film.test.js`, `tests/filmcontent.test.js` | **sonnet** build / **sonnet** review; **render** sonnet | M | S1a (it asserts lesson text) |
| **S4** | Film `pm.scaled.intro` rebuilt (2.6), then rendered right after its review | `films/pm.scaled.intro/`, VTTs, poster, `tests/film.test.js` (intro block) | as S3 | **sonnet** / **sonnet**; render sonnet | M | S1b (topic titles final) |
| **S-int** | Integration: merge, full checks, CACHE bump once, SHELL entries for the picture and bank files and any new VTT or poster, ledger lines | `sw.js`, `tests/swshell.test.js` if needed, `docs/superpowers/plans/model-ledger.md` | `npm test`, `node src/content/courses/validate.js`, the lint, `bash scripts/shellcheck.sh` | integrator (**sonnet**) | S | S1a to S4 |

**Lanes.** S1a then S1b (same files). S2, S3 and S4 can run together after S1b (S3 may start after S1a), each in its own worktree; they share no files except `tests/film.test.js` between S3 and S4, which touch different blocks and the integrator merges. If decision Q4 is B, an S5 rebuilds `pm.scaled.hybrid` (sonnet / sonnet, render) after S1b.

**Rough volume.** Two long content sessions, one bank session, two film builds with renders, one integration: about three agent days.

**How it fits the v18 programme.** This is the pass for pm.scaled, ahead of the order in v18 section 5 (Merijn's priority). P0 (`pm.plan`) is the pattern for questions, bank and blueprint; this pass adds the restructure and pictures. Because question counts stay at 4 per lesson, other P-n passes can run alongside on other modules; `openers.pm.js` is shared, so each pass touches only its own keys.

---

## 4. Decisions for Merijn

**Q1. How much do we rewrite?**
- A. All four topics as in section 2, with Hoogveld in every lesson. *Clearest, and the levels build across the whole module; about three agent days.*
- B. Only `safe` and `portfolio` (8 lessons); hybrid and alternatives get the question pass only. *Half the work; the alternatives topic keeps levels that do not build, and the running example stops halfway.*

**Q2. What happens to LeSS, Nexus and Spotify?**
- A. One topic, rebuilt as map → in practice → choosing → critique (2.3). *Keeps the breadth you need to judge a SAFe proposal, now with levels that build.*
- B. Fold them into one Basis lesson and use the freed three levels for "SAFe invoeren in de praktijk" (finding the trains, the rollout, SAFe at a grid operator). *More of what you will meet at clients; less depth on the alternatives.*

**Q3. The running example.**
- A. Hoogveld, a machine builder with a software train and a hardware track (2.2). *Carries every topic, including moulds, SOP and hardware-in-the-loop.*
- B. A grid operator's digital programme. *Closer to your grid clients, but weak for the hardware topic, which then needs its own example.*
- C. Both, alternating per topic. *Covers both worlds, but brings back part of the jumping between companies that makes it unclear now.*

**Q4. Films.**
- A. Rebuild the intro and the PI film (PI Planning only, shorter); keep the hybrid film for now and rebuild it later. *Fixes the film that plays three times and hides the Basis reading; the hybrid lessons keep their pump and e-bike examples for a while.*
- B. Rebuild all three now. *Everything in Hoogveld at once; one more build and render.*
- C. Drop the PI film; PI Planning becomes reading with the board picture. *Cheapest, but loses the one place where a film really helps (the board filling over two days).*

**Q5. Lesson ids and your progress.**
- A. Retire `lpm`, `nexus` and `spotify`, and add `backlog`, `options` and `descale`. *Ids match their content; your progress on those three lessons is dropped (the rest keeps its ids).*
- B. Keep all 16 ids and put the new content under the old ids. *No progress lost; ids such as `pm.scaled.lpm` then hold a lesson about the backlog for good.*

**Answered by Merijn on 28 Nov; building may start.**
- **Q1: A.** All four topics are rewritten.
- **Q2: A.** LeSS, Nexus and Spotify become one topic that builds (map, in practice, choosing and descaling, critique).
- **Q3: B, a grid operator.** The running example is not Hoogveld but an invented Dutch grid operator's digital programme (for example a software train that builds the grid-management / OT data platform and the customer connection portal). For the hybrid topic, where software runs beside a hardware track on stage-gate, the grid operator's own hardware is used: a new type of smart MV substation or connection cabinet with a supplier, type testing and a roll-out plan (Merijn had no preference; integrator's choice, the recommended one). Section 2.2 is to be read with this example in place of Hoogveld.
- **Q4: A.** Rebuild the intro and the PI film (PI Planning only, shorter); keep the hybrid film for now.
- **Q5: A** (no preference; the recommended one). Retire `lpm`, `nexus`, `spotify`; add `backlog`, `options`, `descale`.

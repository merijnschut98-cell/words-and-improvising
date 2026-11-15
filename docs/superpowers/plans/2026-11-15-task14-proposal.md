# Task 14, step 3 preparation: proposal for two new Projects modules

Written 15 Nov 2026. This document is the proposal that CLAUDE.md asks for before any lesson is written: per module and topic, what each of the four levels teaches. No lesson content has been written.

Inputs: research `docs/superpowers/reviews/2026-11-14-pm-modules-research.md` and its `-sources.md` (S1 to S31), Merijn's answers of 15 Nov (morning) in `2026-11-15-questions-for-merijn.md`, design addendum 3 (level definitions) in `docs/superpowers/specs/2026-11-13-v17-big-picture-design.md`, the existing modules in `src/content/courses/index.js`, `pm/*.en.js` and `eng/improve.en.js`.

**Fixed by Merijn (not reopened here):** names, levels, track, topics, field place, tool-naming rule, depth on tools, the three worked runs, Power BI only as a feed, extras as one Expert line each. Brown paper is a lesson inside the workshop topic; the freed topic is "Werkvormen op de vloer".

**Level definitions used (addendum 3).** Basis assumes nothing: what it is, what it is for, the words, a worked example. Werkkennis: what you do with it and why, simple example and simple numbers, worked example. Gevorderd: what the project lead decides, trade-offs and exceptions, faded example. Expert: what a senior weighs (cost, risk, people, governance, organisation) and the credible questions, faded example. For tools and formats: Basis names the options and when each fits, Werkkennis runs one, Gevorderd chooses between them for a given project, Expert adapts to the organisation and to what goes wrong. The validator enforces worked examples at levels 1 and 2 and faded examples at 3 and 4 (`validate.js` checkLesson).

**Learner:** a consultant who leads projects at clients, often without formal power, mostly at manufacturers and grid operators.

---

## Module A: Aanpak en gereedschap / Approach and tools

| Field | Value |
|---|---|
| id | `pm.approach` |
| title | nl **Aanpak en gereedschap**, en **Approach and tools** |
| blurb nl | De route van je project, de methode die erbij past en de tools die je kiest of bij de klant aantreft. |
| blurb en | Your project's route, the method that fits it, and the tools you choose or find at the client. |
| subject, track, level | `pm`, `project`, 1 |
| intro | `pm.approach.intro` (module intro film, Task 11 pattern) |
| field | `pm.field.lifecycle` "Een project van begin tot eind", **first** module, before `pm.intake` |
| map place | the first station on the lifecycle road, left of Intake; `draw: 'road-stop'` or a new `signpost` object (open question Q4) |
| lesson file | `src/content/courses/pm/approach.nl.js`, `approach.en.js` |

Topics: `route`, `method`, `tools`, `enterprise`.

### A1. De route: wat eerst, wat daarna / The route: what first, what next (topic id `route`)

**L1 Basis: `pm.approach.route`, "De hele route in één beeld" / "The whole route in one picture"**
- Teaches: the five stages a project passes (intake, plan, run, land, close) as one road, and the one product each stage must leave behind before the next starts (agreed problem, charter, plan with baseline, working rhythm, handover, closure). Why the order matters: a plan before an agreed problem plans the wrong thing. Where in the app each stage is taught in depth.
- Key terms: route (route), fase (stage), opdracht of mandaat (mandate), opdrachtgever (sponsor), baseline (baseline, already defined in `pm.plan`; link, do not redefine), opleverproduct per fase (stage product).
- Worked example: a new project at a grid operator, "faster work preparation for low-voltage connections", traced through the five stages with the one product per stage on one line each.
- Adds: first lesson in the module; the only place the whole order is shown in one picture.

**L2 Werkkennis: `pm.approach.takeover`, "Een lopend project overnemen" / "Taking over a running project"**
- Teaches: the consultant's common start, a project that is already running. Five questions for the first two days (who decides and has said so, what was promised to whom, what the plan of record is, what is late and why, what the team thinks is really wrong) and which documents to read in which order (charter, plan, last three status reports, decision log, risk log). How to find which stage products are missing and fill them in order instead of starting over.
- Key terms: overdracht van het project (project take-over), plan van vastlegging (plan of record), ontbrekend faseproduct (missing stage product), nulmeting van de status (status check).
- Worked example: day-by-day list for days 1 to 5 of a take-over at a manufacturer; simple numbers: 14 open actions, 9 older than four weeks, what that says.
- Adds over Basis: from knowing the route to applying it to a project that did not start with you; a sequence of actions and a check of what is missing.

**L3 Gevorderd: `pm.approach.tailor`, "Hoeveel route: op maat maken" / "How much route: tailoring"**
- Teaches: deciding how much of the route a project needs. A two-week fix merges intake and plan into one page; a six-month programme needs every stage product and a gate. The minimum governance you never drop (a named decider, a written goal, a rhythm, a closure), and the exceptions: no sponsor, an unclear mandate, a project that "started last month" without a charter.
- Key terms: op maat maken (tailoring), minimale governance (minimum governance), fasen samenvoegen (merging stages), proportionaliteit (proportionality).
- Faded example: three projects of different size and risk; the learner chooses which stages to merge and which products to keep; the reveal shows a reasoned answer.
- Adds over Werkkennis: from running a given route to choosing its size; trade-offs and exceptions.

**L4 Expert: `pm.approach.clientroute`, "De route van de klant: gates, PMO en niet beginnen" / "The client's route: gates, PMO and not starting"**
- Teaches: what a senior weighs when the client already has a route: a PMO gate model, templates and tolerances that override yours. Committing to a route before scope is clear (contract before plan), and stage one's honest answer "do not start". The questions to ask the PMO before you propose your own route. One Expert line on the change side of the route: Prosci's 3-phase process (prepare the approach, manage the change, sustain the outcomes) as the change counterpart of the project stages [S10].
- Key terms: gatemodel van de klant (client gate model), PMO (project management office), tolerantie (tolerance, link to `pm.plan.control`), niet-starten-besluit (no-go decision).
- Faded example: a client PMO requires five gates and twelve templates for a ten-week improvement project; the learner drafts what to ask and what to propose; reveal.
- Adds over Gevorderd: from tailoring your own route to working within, and negotiating with, the organisation's route; governance and credibility.

Overlap and how it is avoided:
- `pm.intake.start` (first weeks: quick wins, kick-off, floor time, rhythm): A1 does not re-teach the first weeks; L1 links to it, L2 is about taking over a running project, which no lesson covers.
- `pm.intake.contracting`, `pm.stuck.reset` (re-contracting): L4 refers to them for the conversation itself; it only adds the client's gate model and the no-go decision as route questions.
- `pm.plan.control`, `pm.plan.products` (PRINCE2 tailoring and tolerances): L3 teaches tailoring across methods and sizes and links to PRINCE2's version instead of repeating it.
- `pm.portfolio.gates` (gate outcomes, approval authority): L4 links for go/kill/hold/recycle and does not redefine them.

Sources: S1, S4 (tailoring in PMBOK Guide and PRINCE2), S10 (Prosci 3-phase, search level; check before use), repo lessons above.

### A2. Een aanpak kiezen: welke methode wanneer / Choosing an approach: which method when (topic id `method`)

**L1 Basis: `pm.approach.families`, "De methodefamilies" / "The method families"**
- Teaches: the four families in one line each: voorspellend (predictive: PRINCE2, waterfall), agile (Scrum, Kanban), Lean-verbeteren (Lean improvement: A3, kaizen event), Six Sigma (DMAIC), plus hybride (hybrid). What the named standards are and are not: the PMBOK Guide and IPMA ICB describe what a project manager should know and do, PRINCE2 is a method, a certificate is not a way of working. Say "PMBOK Guide" without edition numbers.
- Key terms: methodefamilie (method family), kennisraamwerk (body of knowledge), methode (method), certificaat (certificate), DMAIC (Define, Measure, Analyse, Improve, Control).
- Worked example: one problem (late deliveries of work orders) approached in three families, one paragraph each.
- Adds: none below; it widens `pm.plan.method` (waterfall, agile, hybrid) with Lean and Six Sigma and the standards landscape.

**L2 Werkkennis: `pm.approach.dmaic`, "DMAIC op een klein probleem" / "DMAIC on a small problem"**
- Teaches: running the one family the app does not teach yet, on a small case: what each DMAIC phase asks (define the problem and goal, measure a baseline, analyse the root cause, improve and test, control so it holds) and what comes out of each phase. When each improvement road is the right size: an A3 for one owner over weeks, a kaizen event for one area in a week, DMAIC for a recurring, data-rich problem over months.
- Key terms: definiëren, meten, analyseren, verbeteren, borgen (define, measure, analyse, improve, control), fasepoort of tollgate (tollgate review), projectdefinitie (project charter in Six Sigma).
- Worked example: cycle time of a quote process at a supplier, simple numbers (baseline 6 days, target 3, main cause found by counting where quotes wait).
- Adds over Basis: from naming DMAIC to running it, plus a size rule for choosing between the improvement roads.

**L3 Gevorderd: `pm.approach.choose`, "De methode kiezen voor dit project" / "Choosing the method for this project"**
- Teaches: deciding for a given project with five questions: how clear the solution is, how clear the requirements are, whether data exists, whether the team is permanent or borrowed, what the contract fixes. Mixed forms (stage-gate with sprints inside, a DMAIC project with a kaizen event in Improve). The exception: the client has already chosen.
- Key terms: keuzecriteria (selection criteria), hybride vorm (hybrid form), opgelegde methode (imposed method).
- Faded example: three client cases; the learner picks a family and says why; reveal.
- Adds over Werkkennis: from running one road to choosing between all of them for a specific project.

**L4 Expert: `pm.approach.translate`, "Werken in de methode van de klant" / "Working in the client's method"**
- Teaches: translating between your language and the client's without losing the substance; using tailoring openly (both the PMBOK Guide and PRINCE2 ask for it); spotting method theatre (templates filled, no decisions taken); what a PMO's certificate expectations signal about how you will be judged. One line each for the extras: sustainability as an explicit project aspect in PRINCE2's latest edition [S4], and the PMBOK Guide's move to principles and tailoring [S1].
- Key terms: methodetheater (method theatre), vertalen tussen methoden (translating between methods), principes (principles).
- Faded example: a client asks for a "PRINCE2 project" for work that needs short feedback loops; the learner drafts how to meet the client's method and keep the loops; reveal.
- Adds over Gevorderd: from choosing a method to working credibly inside someone else's; organisation, politics, credibility.

Overlap and how it is avoided:
- `pm.plan.method` (waterfall, agile, Scrum, hybrid) and `pm.agile.fit` (when agile fits): L1 links for Scrum and agile; L3 links to `pm.agile.fit` and adds the Lean and Six Sigma roads and the five questions.
- `pm.stuck.cynefin`: L3 may cite it as a lens in one sentence, no repetition.
- `eng.improve.a3`, `eng.improve.pdca`, `eng.improve.kaizen` (how to write an A3, the event's shape): A2 names them and links; it teaches only the choice and DMAIC.
- `pm.scaled.stagegate` (sprints inside stage-gate): L3 links for the hardware case.
- Risk: this is the topic with most overlap (the research's weakest cell). The level-separation hinge is DMAIC at Werkkennis, which is new to the app. If the reviewer finds L1 too close to `pm.plan.method`, L1 shifts weight to the standards landscape (Q2).

Sources: S1, S2, S4, S5 (standards), S6 (IPMA ICB), S7 (DMAIC, kaizen event), S8 (A3). DMAIC phase questions checked 15 Nov against several secondary sources (the ASQ page returns 403 to fetching; the content agent should cite the phase names only, no origin story, since sources disagree on it).

### A3. Gereedschap kiezen: welke tool wanneer / Choosing tools: which tool when (topic id `tools`)

**L1 Basis: `pm.approach.toolfamilies`, "Toolfamilies en wanneer een tool loont" / "Tool families and when a tool pays off"**
- Teaches: when a tool is worth it at all (a spreadsheet is enough until dependencies, many people or an audit trail appear) and the families by job: spreadsheet, planning, team task board, backlog, documentation and knowledge, visual collaboration, reporting. One example tool per family, named as an example (Excel; Microsoft Project, Planner premium plans, Smartsheet; Planner, Trello; Jira, Azure DevOps Boards; SharePoint, Teams, Loop, Confluence; Miro, Mural; Power BI).
- Key terms: toolfamilie (tool family), takenbord (task board), backlog (backlog, link to `pm.agile.stories`), planningstool (scheduling tool), samenwerkingsbord (whiteboard).
- Worked example: the same 20-task project in an Excel list and in a Planner-style board; what changes (owners visible, notifications, one source).
- Adds: first tool lesson in the app.

**L2 Werkkennis: `pm.approach.board`, "Een takenbord inrichten in het eerste uur" / "Setting up a task board in the first hour"** (worked run 1: Planner-style board)
- Teaches: setting up a Planner-style board: buckets that follow the work (not the people), one owner, a date and a done criterion per card, labels for workstream or risk, and a decision log in the documentation tool next to it. Running the weekly from the board (filter on late and blocked, not reading every card). No click paths.
- Key terms: bucket (bucket), kaart (card), eigenaar (owner), klaar-criterium (done criterion), label (label), filter op achterstand (filter on overdue).
- Worked example: 24 tasks, 5 people, three buckets; the first weekly run from the board takes 20 minutes instead of 45.
- Adds over Basis: from knowing the families to running one tool for a real project.

**L3 Gevorderd: `pm.approach.toolchoice`, "De tool kiezen voor dit project" / "Choosing the tool for this project"**
- Teaches: choosing for a given project: size and length, how the team is spread over client and consultancy, the client's rules for guests and data, what the client already uses, one tool per purpose versus one tool for everything. Exceptions: the client forbids external tools; half the team lives in another tool; a dependency-heavy plan that a board cannot carry.
- Key terms: één tool per doel (one tool per purpose), gasttoegang (guest access), klantdata (client data), keuzematrix (selection grid).
- Faded example: three projects (two-week fix, six-month line move with steel lead times, IT roll-out with the client's Jira); the learner chooses; reveal.
- Adds over Werkkennis: from setting up one tool to choosing between families and products, with exceptions.

**L4 Expert: `pm.approach.toolcost`, "Wat een tool echt kost" / "What a tool really costs"**
- Teaches: what a senior weighs: tool sprawl, security and where client data sits, integration and double entry, who owns and pays for the tool after you leave (link to `pm.close.exit`), adoption as a change in its own right. The credible questions: which system is the plan of record, who feeds it, what is the cut-off. One line on AI assistants built into project tools: useful for summaries and drafts, but they summarise what is in the tool, so data quality and confidentiality rules still decide (no product claims).
- Key terms: toolwildgroei (tool sprawl), dataverblijf (data residency), eigenaarschap na vertrek (ownership after you leave), adoptie (adoption, link to `pm.land.change`).
- Faded example: a client asks you to "just bring your own Miro and Trello"; the learner lists what to weigh and what to propose; reveal.
- Adds over Gevorderd: from the project's choice to the organisation's cost, risk and continuity.

Overlap and how it is avoided:
- `pm.plan.network` (MS Project paragraph: software computes, you check the logic): L1 names planning tools and links; no network logic.
- `pm.agile.board`, `pm.agile.wip` (Kanban concept, WIP limits): L2 sets up a task board as a tool and links to Kanban for flow; it does not re-teach WIP or columns as process steps.
- `pm.run.decisions` (decision log): L2 places the log in a tool and links for its content.
- `pm.itproject.saas`, `pm.itproject.selection`, `pm.itproject.tco` (buying software for the client): A3 is about tools to run your project, not systems you implement; L4 links to TCO for the calculation and does not repeat it.

Sources: S21, S22 (Planner basic and premium, Project Online retirement; teach as families, no dates in lessons), S23 (Smartsheet), S25 (Loop, PnP task-management guide), S26 (Azure Boards processes), S27 (Jira, Confluence), S15 (Miro, Mural vendor claims), S29 (Power BI). Facts that age (renames, retirements) stay out of lessons except as one dated example at Expert in A4.

### A4. Gereedschap bij grote organisaties / Tools at large organisations (topic id `enterprise`)

**L1 Basis: `pm.approach.systems`, "De systemen van een grote klant" / "A large client's systems"**
- Teaches: the enterprise families a consultant meets and the job of each: ERP project control (cost and hours on a project number), enterprise planning (large schedules), portfolio and demand (PPM), product lifecycle and requirements (PLM), IT service management (ITSM), reporting. What "system of record" means. Named with evidence only: Enexis uses SAP S/4HANA [S18], ServiceNow [S20] and Mendix, including a project-management app integrated with SAP [S19]; ASML uses Siemens Teamcenter for lifecycle management and NX for design [S16]. Everything else is "common in this sector" (Primavera P6, Clarity, Polarion).
- Key terms: systeem van vastlegging (system of record), ERP (enterprise resource planning), PPM (project and portfolio management), PLM (product lifecycle management), ITSM (IT service management), projectnummer of WBS-code (project or WBS code).
- Worked example: one grid-operator project seen in four systems: its number in ERP, its line in the portfolio tool, its change ticket in ITSM, its team board.
- Adds: none below; first lesson on the client's landscape.

**L2 Werkkennis: `pm.approach.guest`, "Als gast in de systemen van de klant" / "A guest in the client's systems"** (worked run 2: Jira-style backlog board)
- Teaches: what you do as a guest: ask for read access and your project code; join the team's Jira-style backlog board and read it (work item types epic, feature, story, bug; states; a filter on your epic; how a card links to your plan); read booked versus planned hours from the ERP export; raise a change on the client's change calendar. No click paths.
- Key terms: werkitem (work item), epic (epic, link to `pm.scaled.epics`), status van een werkitem (work item state), geboekte uren (booked hours), wijzigingskalender (change calendar).
- Worked example: your epic has 31 items, 12 done, 4 blocked on the same test environment; ERP shows 310 of 400 planned hours booked with 40% of the work done; what both say together.
- Adds over Basis: from knowing the systems to working in two of them and reading what they say.

**L3 Gevorderd: `pm.approach.recordof`, "Wat leeft waar: werktool en systeem van vastlegging" / "What lives where: working tool and system of record"**
- Teaches: deciding what lives where: your working tool versus the client's system of record, update cadence, avoiding double entry, when the PMO tool is mandatory. Power BI as a feed only: how to read a report, and how to trace where each number comes from (source system, refresh moment, definition). The exception: your board says green and the PMO report says red; how to find which is right.
- Key terms: werktool (working tool), verversmoment (refresh time), definitie van een getal (metric definition), dubbele invoer (double entry), afsluitmoment (cut-off).
- Faded example: green board, red PMO report, three possible causes (stale refresh, a different definition of "done", hours booked on the wrong code); the learner traces them; reveal.
- Adds over Werkkennis: from reading systems to deciding their roles and resolving conflicts between them.

**L4 Expert: `pm.approach.landscape`, "Het toollandschap als senior" / "The tool landscape as a senior"**
- Teaches: what a senior weighs: who owns data and definitions, the PMO's power over how you are measured, vendor change risk (one dated example: Microsoft retired Project for the web in 2025 and Project Online in 2026 [S21, S22]), integration cost, assurance and audit. In engineering firms an engineering change in the PLM system moves your plan, so ask how changes reach you. The credible questions to the controller, the PMO and the IT owner.
- Key terms: data-eigenaar (data owner), leveranciersrisico (vendor risk), technische wijziging (engineering change), assurance (assurance, link to `pm.portfolio.assurance`).
- Faded example: a client plans to move its portfolio tool during your project; the learner lists the risks for the project and the questions to ask; reveal.
- Adds over Gevorderd: from the project's systems to the organisation's ownership, change and audit.

Overlap and how it is avoided:
- `pm.portfolio.*` (governance, gates, capacity, assurance): A4 is about the tools that hold those, not the governance itself; links only.
- `pm.devops.incident`, `pm.devops.sla` (ITIL language), `pm.itproject.*` (SAP as a supplier, fit-to-standard): L2 links for change and incident terms.
- `eng.itbasics.reports` (MES and Power BI disagree because of definitions) and `eng.itbasics.datamodel`: L3 links to them for the data side and stays with the project lead's question "where does this number come from".
- Task 15 (Performance subject): no KPI or dashboard design here; the shared line is "a dashboard shows what someone feeds it".

Sources: S16 (ASML, fetched), S18, S19, S20 (Enexis, fetched), S21, S22 (Microsoft, fetched), S24 (P6), S28 (Polarion), S29 (Power BI), S30 (Clarity), S31 (ServiceNow). Job-ad evidence (ASML Jira or Project Online, TenneT P6, Alliander SAP PS) is **not** used for company names.

---

## Module B: Werkvormen en overleggen / Formats and meetings

| Field | Value |
|---|---|
| id | `pm.formats` |
| title | nl **Werkvormen en overleggen**, en **Formats and meetings** |
| blurb nl | Kick-off, werksessie, brown paper, brainstorm en de vloer op: welk format wanneer, en hoe je het voorbereidt en leidt. |
| blurb en | Kick-off, workshop, brown paper, brainstorm and the shop floor: which format when, and how to prepare and lead it. |
| subject, track, level | `pm`, `project`, 2 |
| intro | `pm.formats.intro` |
| field | `pm.field.lifecycle`, placed **after `pm.plan`** (before `pm.run`) |
| map place | a station between Plan and Run; `draw: 'whiteboard'` |
| lesson file | `src/content/courses/pm/formats.nl.js`, `formats.en.js` |

Topics: `meetings`, `workshop`, `ideas`, `floor`.

### B1. Welk overleg wanneer / Which meeting when (topic id `meetings`)

**L1 Basis: `pm.formats.catalogue`, "De overleggen van een project" / "A project's meetings"**
- Teaches: the catalogue in one table: kick-off, stand-up, weekly, steering group, review or demo, retrospective, workshop, sponsor one-to-one. Per format: purpose, who, how long, what it produces. The difference between a meeting (share, decide) and a working session (make something together).
- Key terms: overlegvorm (meeting format), kick-off (kick-off), sponsorgesprek (sponsor one-to-one), werksessie (workshop), opbrengst van een overleg (meeting output).
- Worked example: the meeting calendar of a six-month project, month by month.
- Adds: first lesson; the catalogue the app lacks (stand-up, weekly and steerco get one row and a link).

**L2 Werkkennis: `pm.formats.kickoff`, "Een kick-off voorbereiden en leiden" / "Preparing and running a kick-off"**
- Teaches: the full design of a kick-off: who to invite and who speaks, a 60-minute agenda (why, from the sponsor; goal and scope; roles; how we work; first steps), the pre-read, and the five things agreed at the end (goal sentence, roles, rhythm, working agreements, first three actions). The difference between a stakeholder kick-off and a team kick-off.
- Key terms: werkafspraken (working agreements), voorleesstuk (pre-read), teamkick-off (team kick-off), stakeholderkick-off (stakeholder kick-off).
- Worked example: agenda with minutes per block; simple numbers: 10 people for 90 minutes is 15 hours; cutting to 60 minutes saves 5.
- Adds over Basis: from knowing the formats to running the one that is mentioned 31 times in the app but never designed.

**L3 Gevorderd: `pm.formats.system`, "Het overlegsysteem van één project" / "The meeting system of one project"**
- Teaches: deciding which formats a project needs and at what cadence, which to cut or replace by a written update or an asynchronous round, room versus remote versus hybrid (one rule: if one person is remote, everyone joins on a screen). Exceptions: the sponsor who keeps cancelling, a client culture of long meetings, shift workers who cannot attend.
- Key terms: cadans (cadence), schriftelijke update (written update), asynchroon overleg (asynchronous update), hybride overleg (hybrid meeting).
- Faded example: a project with nine recurring meetings; the learner cuts or merges to a system that covers decisions, coordination and learning; reveal.
- Adds over Werkkennis: from running one meeting to designing and pruning the set.

**L4 Expert: `pm.formats.governance`, "Het overleg als governance" / "The meeting as governance"**
- Teaches: what a senior weighs: who is in the room decides; decisions are pre-wired before the meeting, not made in it; the load you put on busy client people; when to chair yourself and when to let a client owner chair, so the rhythm survives your exit. The questions to audit a client's meeting load.
- Key terms: voorzitterschap (chairing), voorbespreken (pre-wiring, link to `pm.portfolio.boardroom`), overleglast (meeting load).
- Faded example: a client's management team spends 22 hours a week in meetings; the learner drafts the audit questions and a first proposal; reveal.
- Adds over Gevorderd: from the project's meetings to meetings as power and the organisation's capacity.

Overlap and how it is avoided:
- `pm.run.rhythm` (stand-up, weekly, steerco; decide/discuss/inform labels; minutes): L1 gives each one row and links; the labels and minutes are not re-taught.
- `pm.run.steerco`, `pm.land.tiered` (tier meetings), `pm.close.retro`, `pm.agile.events`: one row each in L1, link only.
- `pm.intake.start` (kick-off of about an hour, sponsor says why): L2 builds on it and adds the full design; the brief must not repeat the quick-wins paragraph.
- `pm.run.workstreams` (meeting system for several workstreams, cost sum): L3 is about one project's system and asynchronous replacement; it links to workstreams for the multi-team case and uses a different number example.
- `pm.portfolio.boardroom` (pre-wiring a board paper): L4 links for the technique.

Sources: research section 3 (B1), repo lessons above. No new external claims.

### B2. Een werksessie ontwerpen en leiden / Designing and leading a workshop (topic id `workshop`)

**L1 Basis: `pm.formats.workshop`, "Wat een werksessie is" / "What a workshop is"**
- Teaches: a workshop versus a meeting (one purpose, a visible output, the people who hold the knowledge). The four design questions (purpose, output, participants, agenda), the arc of every session (open, diverge, converge, close) and the roles (facilitator, owner, scribe). Kinds of workshops by output, including the brown paper session for processes.
- Key terms: facilitator (facilitator), eigenaar van de uitkomst (outcome owner), notulist of scribent (scribe), divergeren (diverge), convergeren (converge).
- Worked example: a two-hour workshop on a new planning routine, read block by block.
- Adds: first lesson on facilitation as a craft (the app only had retrospective design).

**L2 Werkkennis: `pm.formats.brownpaper`, "Een brown-papersessie houden" / "Running a brown paper session"** (Merijn: brown paper is a lesson in this topic)
- Teaches: running one workshop end to end, the brown paper session: set the start and end of the process, invite one person per role (about 6 to 12), materials (3 to 5 metres of paper, notes in agreed colours, markers, tape), walk the process left to right, one colour for steps and one for problems and questions, mark hand-offs and waits, validate with the group, redraw and send round the next day. A three-hour agenda.
- Key terms: brown paper (brown paper), huidige situatie (as-is), gewenste situatie (to-be), overdracht (hand-off, link to `pm.intake.sipoc`), zwembaan (swim lane), wachttijd (waiting time).
- Worked example: mapping work preparation at a grid operator; simple numbers: 23 steps, 7 hand-offs, 4 places where work waits for a signature.
- Adds over Basis: from the shape of any workshop to preparing and running a concrete one.

**L3 Gevorderd: `pm.formats.design`, "Ontwerpkeuzes voor een sessie" / "Design choices for a session"**
- Teaches: the trade-offs: group size, length, pre-work, room versus remote or hybrid (a Miro-style board with timer and voting), sponsor in or out of the room, and the two-role problem when you are both facilitator and content expert. Choosing the format: when brown paper is the wrong tool (too many people, remote, tiny process, sensitive data) and what to use instead; what to do when two people describe different processes.
- Key terms: tweerollenprobleem (two-role problem), voorwerk (pre-work), online sessie (remote session), sessieformat (session format).
- Faded example: a cross-site process with 18 people in three locations; the learner chooses size, format and roles; reveal.
- Adds over Werkkennis: from running one session to choosing its design and format for a given situation.

**L4 Expert: `pm.formats.facilitation`, "Faciliteren als vak" / "Facilitation as a craft"**
- Teaches: what a senior weighs: contracting the outcome with the sponsor before the session; psychological safety, since an honest process map exposes teams; who owns the output afterwards; when to bring an outside facilitator; ethics (not steering the room to your answer). The IAF's six competency areas as a checklist for your own practice [S11].
- Key terms: uitkomst contracteren (contracting the outcome), neutraliteit (neutrality), IAF-competenties (IAF core competencies), psychologische veiligheid (psychological safety, link to `pm.lead.safety`).
- Faded example: a sponsor wants a workshop that "confirms the new organisation chart"; the learner decides what to agree before saying yes; reveal.
- Adds over Gevorderd: from session design to the ethics, power and professional standard behind it.

Overlap and how it is avoided:
- `pm.close.retro`, `pm.close.formats` (five phases, check-in, dot voting, ROTI): B2 refers to the retrospective as one worked format and to the five phases; it does not repeat them.
- `eng.improve.facilitate` (facilitating a root-cause session: facts, theories, open questions; anchoring by the expert): L3 links to it for root-cause sessions and does not repeat the three-column board.
- `eng.improve.vsm` (value stream map symbols, stock days, lead time calculation): L2 does not use VSM symbols or the timeline sum; it links to VSM as the next step when data is needed.
- `pm.intake.sipoc` (boundaries, hand-offs): L2 uses SIPOC's start and end as input and links.
- `pm.lead.safety`, `pm.consult.independence`: L4 links.

Sources: S11 (IAF), S12 (Liberating Structures design elements), S13, S14 (brown paper and process-mapping facilitation; search level, no single primary standard: present the steps as common practice), S15 (Miro and Mural, vendor claims).

### B3. Ideeën en besluiten in de groep / Ideas and decisions in a group (topic id `ideas`)

**L1 Basis: `pm.formats.diverge`, "Eerst veel ideeën, dan kiezen" / "First many ideas, then choose"**
- Teaches: the two beats of group creative work, diverge then converge, and why they are kept apart (Osborn's rule: defer judgment, aim for quantity). Why silent writing first often beats an open brainstorm: in an open round people wait their turn and lose ideas, which research calls production blocking (Diehl and Stroebe, 1987). Grouping notes and voting with dots (one line and a link). When a group method helps and when one person should just decide.
- Key terms: brainstorm (brainstorm), stil schrijven (silent writing or brainwriting), clusteren (affinity grouping), oordeel uitstellen (deferring judgment), productieblokkade (production blocking).
- Worked example: ideas to cut waiting at a counter, first in an open round, then with silent writing; what differs.
- Adds: first lesson on group idea generation (zero coverage of "brainstorm" in the app).

**L2 Werkkennis: `pm.formats.session`, "Een ideeënsessie op een digitaal bord" / "An idea session on a whiteboard"** (worked run 3: Miro-style whiteboard)
- Teaches: running a 30-minute session on a Miro-style whiteboard: a prepared frame, silent writing for 5 minutes with notes hidden until the timer ends, clustering, 3 dots each, the top three get an owner and a date, export to the plan. One Liberating Structure as an alternative in a room: 1-2-4-All (alone, pairs, foursomes, whole group; about 15 minutes) [S12].
- Key terms: digitaal whiteboard (online whiteboard), verborgen modus (private mode), timer (timer), stemronde (voting round), 1-2-4-All (1-2-4-All).
- Worked example: 8 people, 46 notes, 9 clusters, 24 dots, top three with owners, minute by minute.
- Adds over Basis: from the principle to running a timed session with a tool.

**L3 Gevorderd: `pm.formats.decide`, "Wie beslist, en hoe" / "Who decides, and how"**
- Teaches: choosing the decision format by who owns the decision: the owner decides after advice, consent (no reasoned objection), majority, consensus. Handling a dominant voice, hierarchy in the room, anonymity. When not to run a session: the decision is already taken, so asking for ideas is fake.
- Key terms: consent (consent: no reasoned objection), consensus (consensus), adviesbesluit (advice process, decision after advice), meerderheid (majority), besluitvorm (decision rule).
- Faded example: four decisions of different weight in one project; the learner picks a decision format for each and says who must be in the room; reveal.
- Adds over Werkkennis: from producing and ranking ideas to deciding how the group's output becomes a decision.

**L4 Expert: `pm.formats.legitimacy`, "Legitimiteit en schijninspraak" / "Legitimacy and consultation theatre"**
- Teaches: what a senior weighs: the cost of consultation theatre (people notice when the outcome was fixed, and stop contributing); pre-wiring the decision owner; making sure the session's output reaches the person who decides and comes back with an answer; the credible question "who decides, and have they said so in this room?"
- Key terms: schijninspraak (consultation theatre), terugkoppeling (closing the loop), mandaat van de sessie (session mandate).
- Faded example: a works council hears that a reorganisation was "co-created" in sessions whose outcome the board had already chosen; the learner decides what the lead should have done; reveal.
- Adds over Gevorderd: from the decision rule to legitimacy and trust in the organisation.

Overlap and how it is avoided:
- `pm.close.formats` (dot voting, three dots): L1 names dot voting in one line with a link; L2 uses it in a run, not as a definition.
- `pm.run.decisions` (decisions outside the room: options with a recommendation, decision log, escalation, one-way and two-way doors): L3 is about the decision rule inside a group and links to it; no repetition of the log or doors.
- `pm.plan.risk` (pre-mortem): stays there; not mentioned as new.
- `pm.lead.influence`, `pm.portfolio.boardroom` (pre-wiring): L4 links.
- `eng.improve.facilitate` (silent ideas before the expert speaks): L1 links as the root-cause case.
- Risk the research named (B3 thin next to B2): the split is B2 = the session's design, B3 = generating and deciding inside it. L1 and L2 carry new material (production blocking, a tool run); if the reviewer still finds overlap, B3 L1 absorbs the brainstorm part of B2 L1.

Sources: S12 (1-2-4-All, fetched 15 Nov: about 15 minutes, five steps), S15 (Miro, Mural). Added and checked 15 Nov: Diehl, M. and Stroebe, W. (1987), Productivity loss in brainstorming groups: toward the solution of a riddle, Journal of Personality and Social Psychology 53, 497–509 (production blocking as the main cause; a later meta-analysis disputes the size, so the lesson says "often"); Osborn, A. F. (1953), Applied Imagination (defer judgment, reach for quantity; secondary sources, wording of the four rules varies, so teach only the two principles); consent as "no paramount or reasoned objection" from sociocracy (secondary sources, e.g. sociocracy.info; name it as "from sociocracy", no founder claims).

### B4. Werkvormen op de vloer / Formats on the floor (topic id `floor`)

**L1 Basis: `pm.formats.floor`, "Vier werkvormen buiten de vergaderzaal" / "Four formats outside the meeting room"**
- Teaches: the four formats a project lead organises where the work happens: gemba walk (see the work and ask, before acting), interview round (one-to-one conversations across levels), demo or review (show the working thing to the people who will use it, on the spot), kaizen event (a team improves one area in a few days). Per format: purpose, who, how long, what it produces, and when it fits in the route.
- Key terms: gembawandeling (gemba walk, link to `pm.land.lsw` and `eng.improve.gemba`), interviewronde (interview round), demo (demo), kaizenevent (kaizen event, link to `eng.improve.kaizen`).
- Worked example: weeks 1 to 10 of a project at a manufacturer using all four in order.
- Adds: none below; the catalogue of floor formats as project instruments.

**L2 Werkkennis: `pm.formats.interviews`, "Een interviewronde houden" / "Running an interview round"**
- Teaches: running an interview round at the start of a project: choose 8 to 10 people across levels and roles, a guide of five open questions, 45 minutes each, notes in the person's words, anonymity agreed up front, then group the notes into themes and play them back to the group in one session.
- Key terms: interviewleidraad (interview guide), steekproef over lagen (sample across levels), thematiseren (theming), terugkoppelsessie (playback session).
- Worked example: 9 interviews at a grid operator's planning department; simple numbers: 9 × 45 minutes plus 9 × 30 minutes of notes is about 11 hours; 5 themes, the top one named by 7 of 9.
- Adds over Basis: from knowing the four formats to running the consultant's most common one.

**L3 Gevorderd: `pm.formats.demo`, "Een demo op de vloer en de juiste werkvorm kiezen" / "A demo on the floor and choosing the right format"**
- Teaches: designing a review outside software: show the working thing where it is used (a pilot cell, a new board, a new form), invite the users and the decider, ask for feedback, not approval; a review is not a gate. Then choosing between the four floor formats for a given question and phase, and exceptions: shift work, safety rules on the floor, a works council that must be informed, remote sites.
- Key terms: review (review, link to `pm.agile.events`), werkend resultaat (working result), feedback versus goedkeuring (feedback versus approval).
- Faded example: three moments in one project; the learner picks the floor format for each and designs the demo; reveal.
- Adds over Werkkennis: from running one format to designing a second and choosing between all four.

**L4 Expert: `pm.formats.kaizenevent`, "Een kaizenevent laten doen" / "Commissioning a kaizen event"**
- Teaches: what a senior weighs before a kaizen event: the cost (6 to 10 people for 3 to 5 days, lost production, overtime), who frees the people, the sponsor's role at the close-out, the follow-up list that makes or breaks it, and when not to run one (no owner afterwards, a problem that needs data over months). Also the senior gemba walk: why a walk with directors easily becomes an inspection tour, and how to prevent that.
- Key terms: kaizenevent laten doen (commissioning an event), afsluitpresentatie (close-out report-out), opvolglijst (follow-up list), inspectieronde (inspection tour).
- Faded example: a plant manager wants "a kaizen week next month" on a line with no owner for the improvements; the learner decides what to agree first; reveal.
- Adds over Gevorderd: from choosing formats to the organisation's cost, ownership and culture behind them.

Overlap and how it is avoided (largest overlap in module B; the brief must name each lesson below):
- `eng.improve.gemba` (how to observe: three actuals, Ohno circle, ten cycles), `pm.land.lsw` (the leader's regular gemba walk), `pm.stuck.facts` (go to the gemba for facts): B4 never re-teaches how to observe; L1 links, L4 adds only the senior walk's risk.
- `pm.stuck.healthcheck` (8 to 12 interviews in an independent review): L2 is about the discovery round at the start of your own project (guide, theming, playback), and links to the health check for review interviews.
- `pm.agile.events` (Sprint Review as a working session, never a gate) and `pm.scaled.stagegate` (what "done" means after a hardware sprint): L3 links to both and teaches the demo for non-IT improvement work.
- `eng.improve.kaizen` (event shape, daily versus event, Farris et al.) and `eng.improve.facilitate`: L4 does not describe the event's days; it teaches the commissioning decision and its cost.
- Cross-subject links (Projects to Engineering) need the term-link test to allow them; check whether existing lessons already link across subjects (Q6).

Sources: S7 (kaizen event, about a week, ASQ; search level), LEI lexicon "gemba walk" (fetched 15 Nov: "a management practice for grasping the current situation through direct observation and inquiry before taking action", https://www.lean.org/lexicon-terms/gemba-walk/), Scrum Guide 2020 (fetched 15 Nov: the Sprint Review is a working session and "should never be considered a gate to releasing value", https://scrumguides.org/scrum-guide.html). Interview-round practice is common consulting practice with no single primary standard; present it as such.

---

## Summary table

| Module | Topic | Basis | Werkkennis | Gevorderd | Expert |
|---|---|---|---|---|---|
| A `pm.approach` | Route | De hele route in één beeld | Een lopend project overnemen | Hoeveel route: op maat maken | De route van de klant: gates, PMO en niet beginnen |
| | Methode | De methodefamilies | DMAIC op een klein probleem | De methode kiezen voor dit project | Werken in de methode van de klant |
| | Tools kiezen | Toolfamilies en wanneer een tool loont | Een takenbord inrichten (Planner-stijl) | De tool kiezen voor dit project | Wat een tool echt kost |
| | Grote organisaties | De systemen van een grote klant | Als gast in de systemen van de klant (Jira-stijl) | Wat leeft waar (Power BI als bron) | Het toollandschap als senior |
| B `pm.formats` | Overleggen | De overleggen van een project | Een kick-off voorbereiden en leiden | Het overlegsysteem van één project | Het overleg als governance |
| | Werksessie | Wat een werksessie is | Een brown-papersessie houden | Ontwerpkeuzes voor een sessie | Faciliteren als vak |
| | Ideeën en besluiten | Eerst veel ideeën, dan kiezen | Een ideeënsessie op een digitaal bord (Miro-stijl) | Wie beslist, en hoe | Legitimiteit en schijninspraak |
| | Op de vloer | Vier werkvormen buiten de vergaderzaal | Een interviewronde houden | Een demo op de vloer en de juiste werkvorm kiezen | Een kaizenevent laten doen |

Extras placed as one Expert line (Merijn MC12): Prosci 3-phase in A1 L4; sustainability and the PMBOK Guide's principles in A2 L4; AI assistants in tools in A3 L4.

---

## Build plan

### Files and data

- Lessons: `src/content/courses/pm/approach.{nl,en}.js` and `pm/formats.{nl,en}.js`, 16 lessons each, same shape as the other pm files (`id`, `film` where a film exists, `title`, `pre` 1–2, `teach` 3–5 blocks, `example` worked at levels 1–2 and faded at 3–4, `said`, `recall` 3–5, `situation`, `sayIt`, `terms`).
- `src/content/courses/index.js`: two `MODULES` entries (topics in the order above, `lessons` in topic order, `questions` counts, `intro`), and both ids in `pm.field.lifecycle.modules` as `['pm.approach', 'pm.intake', 'pm.plan', 'pm.formats', 'pm.run', 'pm.land', 'pm.close']`.
- `src/content/courses/maps/pm.js`: seven places in the lifecycle row instead of five, in both the wide map and `PHONE`. With a 6-unit gap the row fits seven places of 82 units (minimum 72.2 at 390 px), so `checkMap` can stay green; labels like "Werkvormen en overleggen" will need the two-line label check (`tests/maplabels.test.js`). Routes become approach→intake→plan→formats→run→land→close, unless Merijn prefers B off the road (Q4).
- `src/content/courses/openers.pm.js`: 8 topics × levels 2–4 × nl/en (`checkOpeners` fails without them), written from the lessons (Task 19 rules: 2–4 sentences, no colons, at most 320 characters, the level named).
- `sw.js`: the four lesson files, any new films (html, two VTTs, poster) in `SHELL`; bump `CACHE` once per push.
- These index, field, map and opener changes must land in the **same commit** as the first lesson file, because the validator rejects a module without a field, a place or openers.

### Figures and films

- Required: two module intro films `pm.approach.intro` and `pm.formats.intro` (Task 11 pattern: four levels as columns), and the re-render of field film `pm.field.lifecycle` with the two new stations (one re-render, Merijn MC5). Film length is "what the content needs".
- Proposed lesson films (Q3), one per worked run plus the brown paper: `pm.approach.route` (the route picture), `pm.approach.board`, `pm.formats.brownpaper`, `pm.formats.session`. Others later via Task 17.
- No pm lesson has a figure today (figures exist only in Engineering). None is required; a figure for the route (A1 L1) would be the first pm figure, which counts as a new pattern (Q5).

### Tests and fixtures (test first)

- Before content: a failing test that both modules exist with four topics of four distinct lessons, sit in `pm.field.lifecycle` in the order above and have map places (`tests/fields.test.js`, `tests/topics.test.js`, `tests/subjectmap.test.js` patterns), and that openers exist for every new topic and level (`tests/openers.test.js` already loops over subjects).
- Content checks already in place: `node src/content/courses/validate.js` (lesson shape, example kind per level, terms defined once, term links), `tests/coursecontent.test.js`, `tests/i18n.test.js` (nl and en parity), `tests/swshell.test.js`.
- A content guard (cheap, in the module test): no lesson text in the two new files contains a price sign, a version number pattern or the words "click", "klik" next to a menu name; company names only from the allowed list (ASML with Teamcenter or NX; Enexis with SAP S/4HANA, ServiceNow or Mendix). This turns MC7 and MC8 into a check that must pass.
- Fixtures: none new; an old saved state is unaffected because no existing lesson id changes.

### Agents and order (models per CLAUDE.md)

1. **Merijn reads this proposal** and answers the open questions below (one round).
2. **Content brief per module** (integrator, `opus`: plan for others to build on): copies the lesson lines above, the overlap list with exact lesson ids to link and not repeat, the evidence rules and the content guard.
3. **Module A build** (`sonnet`, own worktree): tests first, then index, field, map, openers and both language files in one commit; `npm test`, validator, shellcheck.
4. **Module A review** (`opus`: first module of a new pattern, touches the map and shared index; checks level separation per cell, every overlap named here, every company and tool claim against S16 to S31).
5. Fix round (`sonnet`), merge, push (CACHE bump).
6. **Module B build** (`sonnet`), after A is merged, because both change `index.js`, `maps/pm.js`, `openers.pm.js` and `sw.js` (CLAUDE.md: tasks that change the same files run one after the other).
7. **Module B review** (`sonnet`; checks level separation and the B4 overlaps with `eng.improve` and `pm.land.lsw` explicitly). Fix, merge, push.
8. **Films**: build the two intro films and the lesson films Merijn approves (`sonnet`), review each (`sonnet`; the first intro film after this change uses the existing pattern, so no `opus` unless the kit changes), render right after review in one render batch (`sonnet`), together with the `pm.field.lifecycle` re-render. If the map scene needs a kit change for seven stations, that review is `opus`.
9. One line per finished agent in `docs/superpowers/plans/model-ledger.md`.

---

## Open questions for Merijn (multiple choice, recommendation first)

**Q1. Module ids**
1. `pm.approach` and `pm.formats` (recommended: short, like the other pm ids, and match the English titles)
2. `pm.route` and `pm.meetings`
3. `pm.toolkit` and `pm.sessions`

**Q2. Topic A2 (method choice), the one with most overlap with `pm.plan.method`**
1. Keep as proposed, with DMAIC as the new Werkkennis run and Basis widened to the standards landscape (recommended)
2. Keep, but make Basis only about the standards (PMBOK Guide, PRINCE2, IPMA, certificates) and move the families to `pm.plan.method`'s level
3. Fold A2 into A1 and add "Informatie en documentatie: waar leeft het project" as topic four

**Q3. Lesson films in the first build**
1. Four: route picture, Planner-style board, brown paper session, whiteboard idea session (recommended: one per worked run plus the session you asked about by name)
2. Only the two intro films and the field film re-render; lesson films later in Task 17
3. One film per topic (eight)

**Q4. Module B on the map**
1. A station on the road between Plan and Run, part of the route line (recommended: matches "after Plan" and the field film's road)
2. In the lifecycle zone but off the road line (a side tile), because formats are used in every stage
3. Same as 1, and A also off the road as a "start here" sign before Intake

**Q5. Figures**
1. No figures in the first build; the films carry the pictures (recommended: pm has no figures yet, a first one is a new pattern and needs an `opus` review)
2. One figure: the route with one product per stage (A1 Basis)
3. Three figures: route, task board, brown paper wall

**Q6. Links from Projects lessons to Engineering lessons** (`eng.improve.gemba`, `eng.improve.kaizen`, `eng.improve.vsm`, `eng.improve.facilitate`, `eng.itbasics.reports`)
1. Name the Engineering lesson in the text ("the module Technisch probleemoplossen in Engineering explains how to observe"), no hard term link (recommended: works whether or not the learner has that subject open)
2. Hard links across subjects (needs a check that the term-link test allows it)
3. No mention; repeat a short definition instead

**Q7. Interview round versus gemba walk at B4 Werkkennis**
1. Interview round as the run; gemba walk at Basis and as the senior walk at Expert (recommended: the gemba walk is already taught in three lessons, the interview round as discovery in none)
2. Gemba walk with the sponsor as the run; interview round at Basis only
3. Both in one Werkkennis lesson (risk: too much for one lesson)

## Merijn's answers to the proposal (15 Nov)

Q1 ids pm.approach / pm.formats. Q2 keep topic A2 Methode with DMAIC as the Werkkennis run, Basis widened to the standards. Q3 four lesson films in the first build (route, Planner-style board, brown paper, whiteboard idea session) plus the two intros and the field-film re-render. Q4 module B as a station on the road between Plan and Run. Q5 no figures for now. Q6 name Engineering lessons in the text, no hard links. Q7 B4 Werkkennis run is the interview round; gemba walk at Basis and Expert.

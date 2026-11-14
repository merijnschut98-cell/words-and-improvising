# Task 14, step 1: two new Projects modules (research and proposal)

Written 14 Nov 2026 for Merijn (via the integrator). Sources are in `sources.md` (numbered S1, S2, ...). Nothing in the repo was changed.

**Short version**

- The existing Projects modules teach project control (plan, run, land, close) and people skills very well. They teach almost nothing about **tools** and **facilitation formats**, and they have no single picture of **the route** (what first, what second).
- Two modules, eight topics, four levels each: **A. Aanpak en gereedschap** (route, method choice, tools you pick, tools you meet at big clients) and **B. Werkvormen en overleggen** (meeting catalogue, running workshops, brown paper, ideas and decisions in a group).
- Things you did not list but should have (section 1): where the project lives (information management), choosing between method families including Lean/Six Sigma (DMAIC, kaizen event), "system of record versus working tool", online facilitation, and decision rights in sessions.
- Tool research found hard evidence for a few companies only. For ASML: Siemens Teamcenter and NX (Siemens case study). For Enexis: SAP S/4HANA, ServiceNow, Mendix, Microsoft 365 (company and vendor pages). Everything else is "common in this sector". Microsoft changed a lot in 2025/26 (Project for the web gone, Project Online retired 30 Sep 2026), so lessons must teach families and patterns, not click paths.
- Section 4 lists 12 multiple-choice decisions, recommendation first.

---

## 1. Coverage review and ranked gap list

### What the app already teaches (checked in `index.js` and the lesson files)

| Area | Where | Depth |
|---|---|---|
| Intake, stakeholders, charter, SIPOC, business case | pm.intake (16 lessons) | strong. `pm.intake.start` (first weeks) covers quick wins plus fundament, a short kick-off, and a meeting rhythm |
| WBS, scope, PRINCE2 product-based planning and tailoring, critical path, estimating, risk, RACI, capacity | pm.plan | strong. `pm.plan.method` covers waterfall, agile, hybrid only |
| Status, steerco, earned value, change control, replanning, stop, meeting rhythm (stand-up, weekly, steerco), workstreams, issues, decisions, tier meetings | pm.run | strong |
| Change adoption (Kotter, ADKAR/Prosci), resistance, standard work, benefits, hansei and after-action review | pm.land | strong |
| Closing, retrospective and its design (five phases, 4L, dot voting, ROTI) | pm.close | strong |
| Health check, Cynefin, blockers, restart | pm.stuck | strong |
| Influence, feedback, Kata, team dynamics | pm.lead | strong |
| Programmes, gates, portfolio, benefits | pm.portfolio | strong |
| Agile, SAFe, DevOps, IT projects | pm.agile, pm.scaled, pm.devops, pm.itproject | strong. Kanban board and WIP are taught as concepts, not as tools |
| KPIs, boards, rhythm | pm.perform (moves in Task 15) | strong |

Word search over all nl lessons: "brown paper", "Jira", "Azure DevOps", "Trello", "Miro", "Mural", "Power BI", "ServiceNow", "Primavera", "Smartsheet", "DMAIC", "brainstorm" appear **zero** times. "MS Project" appears in one paragraph of `pm.plan.network` (software does the calculation, you check the logic). "SAP" appears only as the owner of the term fit-to-standard (`pm.itproject`). "Workshop" appears 59 times but only as something people attend, never as a format to design. "Kick-off" appears 31 times, never as a designed meeting. "Facilitator" appears once (neutral facilitator in `pm.close.retro`).

### Coverage against the bodies of knowledge

| Body of knowledge | What it expects of a project lead | App today | Gap |
|---|---|---|---|
| **PMBOK Guide 7th ed.** (12 principles, 8 performance domains: stakeholder, team, development approach and life cycle, planning, project work, delivery, measurement, uncertainty) [S1, S2] | principles-based, tailor the approach, models/methods/artifacts as options | stakeholders, team, planning, delivery, measurement, uncertainty (Cynefin) all present. "Development approach and life cycle" only as waterfall/agile/hybrid. "Project work" (information, resources, communication, procurement, tools) is the thin domain | tailoring as an explicit skill; project work and information |
| **PMBOK Guide 8th ed.** (published Nov 2025; PMI describes six principles and seven performance domains, and new "focus areas" that bring back process-style guidance; AI, PMOs, procurement) [S1, S3] | same foundation, more actionable | not covered; sustainability and AI absent | low priority. Do not name edition-specific structure in lessons; teach shared ideas (principles, tailoring). The PMI page returned 403 to me; counts come from a secondary summary, check before use |
| **PRINCE2 7th ed.** (Sep 2023; more emphasis on people, tailoring, digital and data, sustainability) [S4, S5] | stages, tolerances, business case, tailoring | well covered (`pm.plan.products`, `pm.plan.control`, `pm.run.exception`, the 7 aspects incl. sustainability in `pm.run.status`) | none significant |
| **IPMA ICB4** (29 competence elements in three areas: People 10, Practice 14, Perspective 5) [S6] | People: covered by lead, negotiate, stuck. Practice: design, requirements, scope, time, **organisation and information**, quality, finance, resources, procurement, plan and control, risk, stakeholders, change, select and balance. Perspective: strategy, governance, **compliance and standards**, power and interest, **culture and values** | nearly all present. "Organisation and information" (where the project's information lives, who owns it) is thin; compliance/standards and culture are thin | information management; (low) compliance and culture |
| **Lean and Six Sigma practice** (DMAIC [S7], A3 as a way of thinking on PDCA [S8], kaizen event as a focused one-week improvement [S7]) | choose a roadmap: A3, kaizen event, DMAIC, VSM | A3 is taught widely, VSM and kaizen are named, hansei, SDCA, Kata present. **DMAIC and the kaizen event are not taught as roads you choose** | method family choice |
| **Change management** (Kotter 8 steps, updated as accelerators [S9]; Prosci ADKAR and 3-phase process [S10]) | individual and organisational change | Kotter and ADKAR in `pm.land.change`, `pm.land.resistance`, `pm.land.communication` | Prosci's 3-phase process (prepare approach, manage change, sustain) is not named; low priority |
| **Facilitation** (IAF six competency areas [S11]; Liberating Structures: 33 original structures, 43 in the menu, five design elements [S12]; brown paper mapping [S13, S14]) | design a group process, create a participatory space, guide to outcomes | only retrospective design (`pm.close.formats`) and health-check interviews | **the biggest content gap after tools** |

### Ranked gap list (what a consultant-project-lead needs and the app lacks)

1. **Tools and when to bring them in.** Zero coverage. A consultant works in the client's tool landscape, usually without choice. Needs: when a tool is worth it at all, which family fits which job, and how to behave as a guest in a client's system. *(Merijn's ask.)*
2. **Running workshops (facilitation craft).** A consultant without formal power gets things done by running sessions well. The app has retros only. IAF treats this as a profession with six competency areas [S11]. *(Merijn's ask, wider than brown paper.)*
3. **Brown paper sessions.** A concrete, well-known Lean/process technique [S13, S14] with real preparation (scope, people, paper, notes, validation) that fits a manufacturing-side process manager. *(Merijn's ask.)*
4. **The route as one picture, and tailoring it.** `pm.intake.start` covers the first weeks, but nowhere does the learner see the whole order of work and when to skip or merge steps. PMBOK 7 and PRINCE2 7 both make tailoring central [S1, S4]; the app teaches tailoring only inside PRINCE2.
5. **Choosing between method families including Lean/Six Sigma roads.** `pm.plan.method` knows waterfall, agile, hybrid. A process manager at a manufacturer meets A3, kaizen event, DMAIC as often as Scrum. Without them the learner cannot answer "which method when".
6. **Meeting catalogue and selection.** Stand-up, weekly, steerco, tier meetings, retro exist. Kick-off (31 mentions, never designed), workshop, review/demo, decision meeting, sponsor 1:1, brainstorm and the question "which format for which need" are missing.
7. **Where the project lives: information management.** Single source of truth, who owns the plan, decision log and RAID log in a tool, document control. IPMA calls this "organisation and information"; PMBOK 7 puts it in project work [S2, S6]. Not taught.
8. **System of record versus working tool at large clients.** At big organisations the project is also a cost object in ERP, a line in a PPM tool, a ticket in an ITSM tool. Learners must understand who feeds what and why a green Planner board can still be red in the PMO report.
9. **Group ideas and decisions in the room** (brainstorm, silent writing, dot voting, consent, who decides). `pm.run.decisions` covers decisions outside the room; the room itself is not covered.
10. **Online and hybrid facilitation** (Miro, Mural). Absent. Both tools have timer, voting and templates; Mural markets "private mode" so ideas stay hidden until discussion; Miro markets a large template library (vendor claims) [S15].
11. **Hardware and high-tech project control** (requirements traceability, engineering change, PLM). Only IT requirements and stage-gate are covered. Relevant at ASML-type clients [S16, S17].
12. **Reporting and dashboards for projects** (Power BI). Overlaps with Task 15 (performance management). Treat as a tool-feed topic only.
13. **Low:** sustainability and AI assistants as a tool feature (PMBOK 8, PRINCE2 7 both mention) [S3, S5]; Prosci 3-phase process; compliance and culture (IPMA perspective).

**Things you probably missed, in one list for your own checking** ("ik mis dingen"): items 4, 5, 7, 8, 9 and 10 above, plus the audit of an existing detail: `pm.plan.risk` quotes PMBOK 6th ed. (2017) risk responses, which is accurate as a dated quote but will sit next to a PMBOK 8 now. Not blocking.

---

## 2. Tool landscape, by when each fits

**Evidence rule used.** A company is named only when a source I could open shows it (marked **verified**). Where I only saw a job ad in a search summary and could not open the page, I say so (**unverified**, and the lesson should say "common in this sector"). Full list in `sources.md`.

**What I could and could not establish about your two named companies**

| Company | Tool | Evidence |
|---|---|---|
| ASML | Siemens Teamcenter (lifecycle management), NX (design), Tecnomatix Plant Simulation (industrial engineering) | **verified**, Siemens case study [S16]. Vendor-published, no date |
| ASML | MS Project Online, Jira, Power BI/Spotfire, SAP knowledge in a PMO Analyst ad; PRINCE2, IPMA-D, PMBOK as named certifications in a PMO ad; "ASML's own project management tools" in a project lead ad | **unverified**: search-result summaries only; the ad pages returned 403/410. Ads age (Project Online is retired since 30 Sep 2026), so name no tool for ASML from these |
| ASML | Polarion, Primavera, ServiceNow | **no evidence found** |
| Enexis | SAP S/4HANA (replacing R/3; implemented with a customised SAFe approach; partner Accenture) | **verified**, SAP news 23 Mar 2020 [S18] |
| Enexis | Mendix (100+ apps, including a project management app integrated with SAP); Microsoft 365, SharePoint, Power Apps (simple automation); AWS, Snowflake, Matillion | **verified**, Mendix customer story [S19]. The story names no project or work management tool |
| Enexis | ServiceNow (Employee Workflows platform, owned by a product owner) | **verified**, Enexis careers page [S20] |
| Enexis | Jira (in IT job ads), SAS Visual Analytics (case study), IT department working in SAFe | **unverified**: search summaries; ad pages did not load |
| Enexis | Azure DevOps, Primavera, MS Project, Planview | **no evidence found** |
| Other grid operators | Oracle Primavera P6 (TenneT ads), SAP PS/PPM (Alliander ad) | **unverified**, search summaries of job ads. Use only as "common in grid and infrastructure projects" |

This answers your "ASML and Enexis" ask honestly: what a consultant meets there is, with evidence, **Siemens PLM, SAP, ServiceNow, Mendix, Microsoft 365**. Primavera, Polarion, Planview, Clarity are *typical for the sector*, not proven for them.

### Families, when a consultant meets them, what to do, limits

| Family | Fits when | Examples | What a consultant does with it | Limits |
|---|---|---|---|---|
| **1. Spreadsheet and Office** | small, short, one owner, or the client forbids anything else | Excel (you already know it) | plan, risk log, action list in one file; fine up to roughly one team and a few weeks (my judgment, not a sourced threshold) | versioning, no notifications, one editor at a time in practice |
| **2. Planning and scheduling** | dependencies and dates matter; a baseline is needed | MS Project desktop; Planner premium (timeline/Gantt, dependencies, baselines, portfolios, custom fields) [S21, S22]; Smartsheet (grid, Gantt, critical path, baselines) [S23]; Oracle Primavera P6 (planning of large engineering and construction projects and portfolios) [S24] | check the logic (no dangling tasks, no hard dates overriding logic; already in `pm.plan.network`), keep one plan of record | premium Planner is not a drop-in for Project Online (community sources); P6 is a specialist tool you usually read, seldom own |
| **3. Team task boards** | a team of 3 to 15 doing work that is not a long chain | Planner basic (buckets, assignees, views; included with Microsoft 365) [S22]; To Do; Lists; Loop task lists [S25]; Trello, Asana, monday.com, ClickUp (no sector source found; common in smaller teams) | set up buckets, owners, done criteria; use as a stand-up board | no cross-plan roll-up in basic; Loop task lists have no sub-tasks [S25] |
| **4. Backlog and agile engineering** | software or a product team in sprints or flow | Azure DevOps Boards (four process templates: Basic, Agile, Scrum, CMMI) [S26]; Jira Software (agile boards, release tracking) [S27] | read the board, agree work item types and states, link epics to the plan | the process template is fixed at project creation in Azure DevOps [S26]; tool config mirrors the client's way of working, not yours |
| **5. Requirements and traceability (engineering)** | regulated or hardware/software products, audit trail | Siemens Polarion (requirements, traceability links, baselines, e-signatures) [S28]; Teamcenter as PLM [S16] | ask for the requirement ID and the trace to test; use change impact view | heavy, administrator-owned, you get a view not a licence |
| **6. Documentation and knowledge** | the project needs one place for decisions, minutes, files | SharePoint (document and site management), Teams, Loop (components, pages, workspaces) [S25]; Confluence with Jira [S27]; Notion | agree one folder structure, one decision log, one place for the plan | Loop has no sites or libraries for large structured libraries (community answer) [S25]; Teams chat is not a record |
| **7. Visual collaboration** | workshops, mapping, remote sessions | Miro (visible timer, anonymous voting on paid plans, large template library); Mural (private mode, timer, voting) [S15] | prepare a board before the session, use timer and voting, export to the plan | vendor claims only; both need licences and guest access; a wall of paper beats both for brown paper in a room |
| **8. Reporting and dashboards** | status to many readers, drill-down | Power BI (dashboard = one page of pinned tiles, report = multi-page with filters) [S29]; Planner charts; Jira dashboards | read the dashboard, ask where each number comes from, agree definitions | a dashboard shows what someone feeds it; KPI design belongs to the performance management subject (Task 15) |
| **9. Portfolio and demand (PPM)** | many projects compete for people and money | Broadcom Clarity PPM (capacity vs demand per role, what-if scenarios) [S30]; ServiceNow SPM (formerly ITBM; demand goes draft, screened, qualified, approved, then project) [S31]; Planner portfolios [S22]; Planview (family; **no source fetched**) | find your project's ID, update status on the cadence, link your working plan | PMO owns it; a late update is your problem, a wrong configuration is not |
| **10. IT service and change** | the project touches live IT services | ServiceNow ITSM (incident, change, problem, request on one platform) [S31]; Jira Service Management [S27] | raise changes, follow the change calendar, use CAB timing in your plan | change lead times shape your go-live dates (link to `pm.devops`, `pm.itproject`) |
| **11. ERP project control** | cost and hours must be booked to a project number | SAP (Enexis: S/4HANA, verified [S18]; PS/PPM as specialist roles: unverified) | get the project/WBS code, read booked vs planned | read-only for you; month-end cut-off drives what you can report |
| **12. Low-code and automation** | small custom apps and flows around the core | Mendix at Enexis [S19]; Power Apps, Power Automate | ask what already exists before proposing a build | governance and architecture review decide, not you |

**Facts that age, to keep out of lessons** (they changed in the last three years): Project for the web was retired in Aug 2025 and its premium plans moved into Planner [S22]; Project Online's official retirement date was 30 Sep 2026 (end of sale for new customers 1 Oct 2025) [S21]; the "Tasks by Planner and To Do" Teams app was renamed Planner in April 2024 [S22]; Atlassian is merging Jira Software and Jira Work Management into one "Jira" [S27]; ServiceNow renamed ITBM to Strategic Portfolio Management [S31]. Teach families and decisions; at most one dated example per lesson, phrased as an example. No prices, no licence names, no click paths.

---

## 3. Proposed modules and topics

Level definitions (design addendum 3): **Basis** assumes nothing: what it is, what it is for, the words, a worked example. **Werkkennis**: what you do with it and why, simple example and numbers. **Gevorderd**: what the lead decides, trade-offs and exceptions, faded example. **Expert**: what a senior weighs (cost, risk, people, governance, organisation) and the questions that sound credible, faded example.

### Module A: Aanpak en gereedschap / Approach and tools

Working names (see MC1): nl **Aanpak en gereedschap**, en **Approach and tools**. Blurb idea: "De route van je project, de methode die erbij past en de tools die je tegenkomt of kiest."

**A1. De route: wat eerst, wat daarna / The route: what first, what next**

| Level | Teaches (and the level below does not) |
|---|---|
| Basis | The whole road in one picture: intake, plan, run, land, close, and the one product each stage must leave behind (agreed problem, charter, plan and baseline, working rhythm, handover, closure). The words mandate, sponsor, baseline, stage. Worked example: a new project at a grid operator, week 1 in order |
| Werkkennis | The order of the first 30 days with reasons: find who decides, write the one-page charter, list stakeholders, set the baseline, start the rhythm, then plan. A take-over checklist for a project already running (five questions to ask in the first two days). Simple example with a day-by-day list |
| Gevorderd | How much route to run: merge or skip stages for a two-week fix versus a six-month programme; minimum governance; what to do with no sponsor, an unclear mandate, or a project that "started last month". Faded example |
| Expert | Committing to a route before scope is clear (contracting before planning); what a senior weighs when the client's PMO imposes a gate model; when stage one's answer is "do not start"; questions to ask the PMO about gates, tolerances and templates before you propose your own |

Overlap: `pm.intake.start`, `pm.intake.contracting`, `pm.plan.control`, `pm.portfolio.gates`, `pm.stuck.reset`. How to avoid repeating: A1 is the *map and order* topic. It links to those lessons, and the only new teaching is sequence, the one-product-per-stage view, the take-over checklist and tailoring. The content brief must forbid re-teaching quick wins, charter or baseline.

**A2. Een aanpak kiezen: welke methode wanneer / Choosing an approach: which method when**

| Level | Teaches |
|---|---|
| Basis | The method families and what each looks like in one line: predictive (PMBOK, PRINCE2), agile (Scrum, Kanban), Lean improvement (A3, kaizen event, DMAIC), hybrid. What the named bodies of knowledge are and are not (PMBOK, PRINCE2, IPMA, a certificate is not a method). A worked example of one problem in three families |
| Werkkennis | Run a light version: a one-page A3 plan, a five-day kaizen event outline, DMAIC in five steps on a small cycle-time problem (simple numbers). When each is the right size |
| Gevorderd | Choose for a given project: how clear are the solution and the requirements, who the users are, whether the team is permanent or borrowed, contract type. Mixed forms (stage-gate with agile inside). Exception: the client has imposed a method |
| Expert | Translate between your language and the client's without losing the substance; use tailoring openly (PRINCE2 and PMBOK both ask for it); spot method theatre (templates without decisions); what a PMO's certificate expectations signal; questions that show you can work in their method |

Overlap: `pm.plan.method` (waterfall, agile, hybrid), `pm.agile.fit`, `pm.scaled.stagegate`, `pm.stuck.cynefin`, A3 in several modules. Avoid repetition: A2 starts where `pm.plan.method` stops. It adds the Lean/Six Sigma families, the standards landscape and the decision, and re-teaches nothing about Scrum or A3 writing. **Most overlap of the eight topics; see MC3 for the fallback (fold into A1).**

**A3. Gereedschap kiezen: welke tool wanneer / Choosing tools: which tool when**

| Level | Teaches |
|---|---|
| Basis | When a tool is worth it at all (the spreadsheet is enough until dependencies, many people or an audit trail appear) and the families by job: planning, task board, backlog, documentation, visual collaboration, reporting. Names in each family, one line each. Worked example: the same small project in Excel and in a Planner-type board |
| Werkkennis | Set up one in the first hour: a board with buckets, owner, date and done criterion per task; a Gantt with dependencies; a decision log in the documentation tool. Run a weekly status from the tool. Simple example (24 tasks, 5 people) |
| Gevorderd | Choose for a given project: size, spread over client and consultancy, the client's rules for guests and data, one tool per purpose versus one tool for all. Exceptions: client forbids external tools, half the team lives in another tool |
| Expert | What a senior weighs: tool sprawl and licence cost, security and where client data sits, integration, who owns and pays after you leave (link to `pm.close.exit`), adoption as a change in itself. The credible questions: "Which system is the plan of record? Who feeds it? What is the cut-off?" |

Overlap: `pm.plan.network` (MS Project paragraph), `pm.agile.board` and `pm.agile.wip` (Kanban concepts). Avoid repetition: those teach the concept; A3 teaches the tool decision and setup, and uses a board as the example without re-teaching WIP.

**A4. Gereedschap bij grote organisaties / Tools at large organisations**

| Level | Teaches |
|---|---|
| Basis | The enterprise families a consultant meets: ERP project control, enterprise planning, portfolio and demand, product lifecycle and requirements, IT service management, reporting. One line each, what job it does, what "system of record" means. Worked example: one grid-operator project seen in four systems |
| Werkkennis | What you do as a guest: ask for read access and your project or WBS code, read booked versus planned hours, read a schedule export, raise a change request, update status on the PMO cadence. Simple example with numbers (project code, 400 planned vs 310 booked hours, what that says) |
| Gevorderd | Decide what lives where: working tool versus system of record, update cadence, avoiding double entry, when the PMO tool is mandatory. Exception: your board says green and the PMO report says red; how to find out which is right |
| Expert | What a senior weighs: who owns data and definitions, the PMO's power over how you are measured, vendor change risk (Microsoft retired Project Online and Project for the web within a year [S21, S22]), integration cost, assurance and audit. Credible questions to the controller, PMO and IT owner |

Overlap: `pm.portfolio.*` (governance, gates, benefits), `pm.devops.incident` and `pm.devops.sla` (ITIL language), `pm.itproject` (SAP as supplier). Power BI/dashboards and KPI design overlap with Task 15; here dashboards appear only as a tool feed, never KPI design.

### Module B: Werkvormen en overleggen / Formats and meetings

Working names (see MC2): nl **Werkvormen en overleggen**, en **Formats and meetings**. Blurb idea: "Kick-off, werksessie, brown paper, brainstorm en overleg: welk format wanneer, en hoe je het voorbereidt en leidt."

**B1. Welk overleg wanneer / Which meeting when**

| Level | Teaches |
|---|---|
| Basis | The catalogue: kick-off, stand-up, weekly, steerco, review or demo, retrospective, workshop, sponsor one-to-one. Per format: purpose, who, how long, what it produces. The labels decide / discuss / inform. Worked example: the meetings of a six-month project |
| Werkkennis | Prepare and run a kick-off (a 60-minute agenda, who speaks, what is agreed at the end) and a weekly (agenda, notes, actions). Simple numbers: what ten people times 90 minutes costs |
| Gevorderd | Design the meeting system for one project: which formats, which cadence, which to cut or replace by a written update; remote versus in the room; the sponsor who keeps cancelling; client culture of long meetings. Faded example |
| Expert | What a senior weighs: the meeting as governance (who is in the room decides), pre-wiring decisions, the load you put on busy client people, when to run a meeting yourself and when to let a client owner chair it. The questions to audit a client's meeting load |

Overlap: `pm.run.rhythm`, `pm.run.steerco`, `pm.run.workstreams`, `pm.land.tiered`, `pm.close.retro`, `pm.intake.start`. Avoid repetition: B1 teaches the *catalogue, the selection and the kick-off*; stand-up, weekly and steerco get a one-line row and a link, not a new lesson. The per-format design of the retro stays in `pm.close.formats`.

**B2. Een werksessie ontwerpen en leiden / Designing and leading a workshop**

| Level | Teaches |
|---|---|
| Basis | What a workshop is versus a meeting: one purpose, a visible output, the people who hold the knowledge. The four design questions (purpose, output, participants, agenda). The roles: facilitator, owner, scribe. Worked example |
| Werkkennis | Design a two-hour workshop with timings: open (purpose, rules), diverge, converge, decide, actions, close. The materials, the room, what to send before. Handling a quiet group and one dominant voice with two concrete moves. Simple example |
| Gevorderd | Design trade-offs: group size, length, remote or hybrid, pre-work, sponsor in or out of the room, neutral facilitator or content expert (the two-role problem when you are both). Faded example |
| Expert | What a senior weighs: contracting the outcome with the sponsor, psychological safety, who owns the output afterwards, when to bring an outside facilitator, ethics (not steering the room). The IAF's six competency areas as a checklist for your own practice [S11] |

Overlap: `pm.close.retro` and `pm.close.formats` (facilitator neutrality, five phases, check-in), `pm.lead.teams`. Avoid repetition: B2 is the general craft; the retro lesson stays as the worked case of one format, and B2 refers to it for the five-phase shape instead of repeating it.

**B3. Brown paper en proceskaarten / Brown paper and process maps**

| Level | Teaches |
|---|---|
| Basis | What a brown paper session is: a long roll of paper on the wall and the people who do the work put the steps on sticky notes [S13, S14]. When you use it (process unclear, hand-offs, before improving). The words: as-is, step, hand-off, waiting, swim lane. Worked example: mapping work preparation at a grid operator |
| Werkkennis | Prepare and run it: set start and end of the process, invite one person per role (about 6 to 12), materials (3 to 5 metres of paper, notes in agreed colours, markers, tape), walk left to right, one colour for steps and one for problems and questions, add times and waits, validate with the group at the end, redraw and send round afterwards. A three-hour agenda. Simple numbers: lead time versus touch time of a made-up process |
| Gevorderd | Decide the level and the use: high-level steps versus detail, swim-lane versus value stream, as-is versus to-be, how SIPOC (`pm.intake.sipoc`) hands over to it. When it is the wrong tool: too many people, remote (use a board), tiny process (interview), sensitive data. What to do when two people describe different processes. Faded example |
| Expert | What a senior weighs: an honest map exposes people and teams, so contract with the sponsor beforehand; memory versus system data; who owns the map after the session; how to move from map to improvement ideas without drowning in sticky notes; cross-department maps and who may change what. Questions that show you have done it |

Overlap: `pm.intake.sipoc` (boundaries), value stream map mentions in plan, land and agile, `pm.stuck.rootcause`. Avoid repetition: SIPOC and root cause stay in their lessons; B3 teaches only the session (preparation, running, validating, follow-up). **Process mining as an alternative to a map was not researched; do not teach it without a source.**

**B4. Ideeën en besluiten in de groep / Ideas and decisions in a group**

| Level | Teaches |
|---|---|
| Basis | The two beats of group creative work: diverge (many ideas) then converge (choose). Brainstorm and silent writing, grouping notes, dot voting. When a group method helps and when one person should just decide. Worked example |
| Werkkennis | Run a 30-minute session: silent writing for 5 minutes, cluster, 3 dots each for 8 people, top three get an owner. A short Liberating Structures format as one example (1-2-4-All: reflect alone, pair, quartet, whole group [S12]). Simple numbers |
| Gevorderd | Choose the decision format for who owns the decision: consent, majority, advisory, sponsor decides. Handle dominant voices, hierarchy in the room, anonymity. When not to brainstorm (the decision is already taken, so the session is fake). Online versions. Faded example |
| Expert | What a senior weighs: legitimacy and the cost of consultation theatre; pre-wiring the owner; making sure the output reaches the decision-maker; the credible question "who decides, and have they said so in this room?" |

Overlap: `pm.run.decisions` (decisions outside the room), `pm.plan.risk` (pre-mortem), `pm.lead.influence`. Avoid repetition: pre-mortem stays in `pm.plan.risk`; decision-making outside the room stays in `pm.run.decisions`. **Risk of thinness:** B4 and B2 are close. If Merijn prefers three topics' worth of material, merge B4's Basis and Werkkennis into B2 and replace B4 (see MC4).

### Level-separation check on my own list

Each level line adds something the lower one does not (new objects to know, then actions, then choices, then organisation and credibility). Weakest cells: **A2 Basis/Werkkennis** (partly `pm.plan.method` plus A3 content) and **B4 Basis** (thin). I flagged them rather than padding; the brief should drop A2 into A1 if the writer cannot make the levels differ.

### Field and map place (suggestions; see MC5 and MC6)

Fields: lifecycle (5 modules), people (5, one leaves with `pm.perform` in Task 15), portfolio (2), IT and agile (4).

- **A: first module in "Een project van begin tot eind"**, before Intake. It is the road map and the toolbox for the whole road, so "start here" fits the field's film and the map's order.
- **B: in "Een project van begin tot eind", after Plan** (formats are used from kick-off onward). Alternative: "Mensen en invloed", where facilitation without power is also influence and a slot frees when perform leaves.
- The validator needs every module in exactly one field. Putting both in the lifecycle field means **one** extra re-render (field film 1, as the design addendum assumed). Splitting them over two fields means two re-renders. A new fifth field means a new field film and map work, and is not recommended for two modules.
- Module level and track: A as level 1 (useful early), B as level 2, track `project`.

---

## 4. Decisions for Merijn (multiple choice, recommendation first)

**MC1. Name of module A**
1. Aanpak en gereedschap / Approach and tools (recommended: says both halves)
2. Route en tools / Route and tools
3. Het project aanpakken / Running a project

**MC2. Name of module B**
1. Werkvormen en overleggen / Formats and meetings (recommended: matches your wording)
2. Sessies en overleggen / Sessions and meetings
3. Werksessies en vergaderen / Workshops and meetings

**MC3. Topics of module A**
1. As proposed: route, approach choice, choosing tools, tools at large organisations (recommended)
2. Fold approach choice into the route (A1 + A2), and add a topic "Informatie en documentatie: waar leeft het project" (decision log, RAID log, single source of truth)
3. As proposed, but drop "tools at large organisations" and give tools one topic of four levels (less depth on ASML/Enexis-type systems)

**MC4. Topics of module B**
1. As proposed: meeting catalogue, designing workshops, brown paper, ideas and decisions (recommended)
2. Replace "ideas and decisions" with "Werkvormen op de vloer": gemba walk, interview rounds, demo and review, kaizen event as a format (more manufacturing-side, less overlap with B2)
3. Merge workshop and brainstorm into one topic and add "Online en hybride sessies leiden" (Miro, Mural, remote)

**MC5. Field and map place**
1. Both in "Een project van begin tot eind": A first, B after Plan (recommended: one re-render of field film 1)
2. A in the lifecycle field, B in "Mensen en invloed" (two re-renders)
3. A new field "De praktijk van het project" with both (new field film and map work)

**MC6. Module level and order**
1. A level 1, B level 2, both track `project` (recommended)
2. Both level 1
3. A level 2 and B level 3 (after the lifecycle modules)

**MC7. Naming companies and tools in the lessons**
1. Teach tool *families* and name example tools; name a company only where a source shows it: ASML with Siemens Teamcenter and NX, Enexis with SAP S/4HANA, ServiceNow, Mendix (recommended)
2. Never name companies, only "a large high-tech company", "a grid operator"
3. Also name companies from job ads (not recommended: ads age and could not be opened)

**MC8. Depth on tools**
1. Concepts and patterns plus one worked setup (a Planner-style board) and no click paths, prices, licence names or versions (recommended: tools change, several of these products were renamed, merged or retired in the last three years)
2. Concepts only, no worked setup
3. Include click-by-click steps for the Microsoft tools (will date)

**MC9. Which tools get a worked run at Werkkennis**
1. Planner-style board, a Jira-style backlog board, and a Miro-style whiteboard as the medium for a session (recommended: three different jobs, all common)
2. Microsoft only: Planner, Teams, Lists
3. Planner and Excel only

**MC10. Dashboards and Power BI against Task 15**
1. Power BI only as a feed in A4 (how to read it, where numbers come from); KPI and dashboard design go to the performance management subject (recommended)
2. A full dashboard topic here
3. Leave Power BI out of this module entirely

**MC11. Brown paper placement**
1. Its own topic B3, four levels (recommended: you asked for it by name, and it has real preparation and running steps)
2. A lesson inside the workshop topic

**MC12. Small extras: sustainability, AI assistants in tools, Prosci 3-phase process, PMBOK 8**
1. One line at Expert level in the matching topic each (A2 and A3), no lessons of their own; say "PMBOK Guide" without edition numbers (recommended)
2. Leave them out for now, revisit after the first module
3. Give AI assistants in project tools their own lesson (will date fast)

---

## 5. What the build steps will need from this

- The content brief per module should copy the four-level tables above and the "avoid repetition" lines; the review agent checks each cell for level separation and for the overlaps named here.
- Evidence rules for the content agent: only the verified company statements in section 2; "common in this sector" otherwise; no prices, versions or click paths.
- Term-link test: new terms likely needed: system of record, plan of record, work item, backlog, baseline (exists), brown paper, as-is, to-be, swim lane, hand-off, diverge, converge, dot voting, facilitator, scribe, RACI/DACI (check term list first), kaizen event, DMAIC, PPM, ERP, ITSM, PLM, CAB.
- Task 15 hand-off: dashboards and KPI design stay out; A4 and the performance subject share the line "a dashboard shows what someone feeds it".

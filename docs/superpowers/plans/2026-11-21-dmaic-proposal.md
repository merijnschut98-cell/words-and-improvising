# D1: the DMAIC road for Projects, and the proposal for pm.measure and pm.analyse

Written 21 Nov 2026 (task D1 of the v18 design, `docs/superpowers/specs/2026-11-21-v18-design.md` sections 1.1, 1.2 and the D1 to D4 rows). This is the proposal that CLAUDE.md asks for before any lesson is written: per new topic, what each of the four levels teaches. No app code or content has been changed.

**Fixed by Merijn on 21 Nov, not reopened here.** Q1 A: the Projects road becomes Define, Measure, Analyse, Improve, Control. The current modules are regrouped under the phases, and two new modules are added, Meten (`pm.measure`) and Analyseren (`pm.analyse`), both Lean-oriented. Q2 A: one DMAIC road for all projects, with a light Measure and Analyse for delivery work, and PRINCE2 or stage-gate as the governance layer over it.

**Inputs read.** CLAUDE.md. The v18 design (1.1, 1.2, section 3 D rows, section 4). Addendum 3 of `2026-11-13-v17-big-picture-design.md` (the four levels). `src/content/courses/index.js` (Projects modules, `pm.field.lifecycle`, `eng.improve`, `eng.spc`, `eng.quality`, `eng.flow`). The Dutch lesson files of the seven road modules, `pm.stuck` and `pm.perform`, and of `eng.improve`. The Projects map `src/content/courses/maps/pm.js`, `roadOrder` and `breadthOrder` in `src/core/course.js`, `checkMap` in `validate.js`. The F4 rewrite of `pm.approach.families` and `pm.approach.dmaic` (commit `08099a8`, branch `review-f4`, in review and not yet merged at `73f4df2`). It already defines DMAIC as "a project structure for any improvement" and names PDCA, A3, 8D, DMADV, PRINCE2, stage-gate, PMBOK and the agile methods.

**The four levels (addendum 3), as used below.** Basis assumes nothing: what it is, what it is for, the words, a worked example. Werkkennis: what you do with it and why, with simple numbers. Gevorderd: what the project lead decides, the trade-offs and the exceptions, with a faded example. Expert: what a senior weighs (cost, risk, people, governance, the organisation) and the questions that make you credible, with a faded example.

**The learner.** A junior Lean consultant who leads improvement and delivery projects at manufacturers and grid operators, often without formal power.

---

## 1. The road

### 1.1 Phases and modules

| Band on the map | Phase question | Modules, in road order (ids unchanged) | Phase product (what the tollgate checks) |
|---|---|---|---|
| **Start** (no letter) | Which route, which method, which tools? | `pm.approach` | the route and the method chosen for this project |
| **D · Define** | What is the problem, for whom, and is it worth it? | `pm.intake` | the charter: problem statement, goal from X to Y, scope (SIPOC), stakeholders, business case |
| **M · Measure** | How does the process run now, in numbers? | `pm.measure` (new) | the current-state map and a baseline everyone accepts, with its data plan |
| **A · Analyse** | Where is the loss, and why? | `pm.analyse` (new) | verified root causes and the few points Improve will attack |
| **I · Improve** | Which solution, how do we bring it in? | `pm.plan`, `pm.run` (and `pm.formats`, see Q2) | the solution, piloted and brought in on a plan |
| **C · Control** | How does it stay, and did it work? | `pm.land`, `pm.close` | the control plan, the handover to the line, the proven result, the closure |

The road (`routes`) becomes: approach, intake, measure, analyse, plan, run, land, close, plus `pm.formats` where Q2 puts it.

**`pm.formats` (Werkvormen en overleggen) is not a phase.** Its lessons serve every phase: the kick-off opens Define, the brown paper, gemba walk and interview round belong in Measure, the idea session and the decision formats in Improve, and the kaizen event compresses Analyse and Improve into one week. The recommendation (Q2 A) is to take it off the road as a toolbox place in the lifecycle field, with the pill "Alle fasen" / "All phases". The alternative keeps it in the Improve band.

**`pm.plan` (Plannen) sits under Improve (Q1 A).** In DMAIC you plan twice. A rough plan (milestones per phase, the team, the tollgates) is part of the charter in Define. The detailed plan (work breakdown, critical path, estimates, risks, capacity) is for bringing in the chosen solution, which you only know after Analyse. On a delivery project the detailed plan is the core of Improve. Each topic of `pm.plan` gets the sentence that says so (section 3).

**`pm.approach` stays before Define, in an unlettered "Start" band.** It is about choosing a route and tools, not about the client's problem. That is my call; Merijn can overturn it.

**Off the road (unchanged).** `pm.stuck` (works in any phase), `pm.perform` (the steering system that Control hands over to), the people field, the portfolio field and the IT and agile field keep their places. They get references (section 4), no band.

### 1.2 What the map shows

- **Two rows.** One row cannot hold eight stations: `pm.approach` needs 101 units for the film kit's label fit and every place needs 72.2 units (44 px at 390 px). 101 + 7 × 72.2 + 7 gaps of 6 units = 648 units, more than the 624 the zone has. The lifecycle zone therefore takes two rows that read like text, the way the phone layout already does. **Row 1:** Start (approach), D (intake), M (measure), A (analyse). **Row 2:** I (plan, run), C (land, close), and the `pm.formats` toolbox at the end of row 2 or under the bands if Q2 A. The view grows from 553 to about 640 units high; the people and IT zones move down.
- **Phase bands.** A thin labelled band sits above the stations of each phase: "D · Define", "M · Measure", "A · Analyse", "I · Improve", "C · Control". The labels use the English phase names in both languages, as the F4 text does ("Define, Measure, Analyse, Improve, Control (definiëren, meten, analyseren, verbeteren, borgen)"). The data is a new optional `phases` list in the map: `[{ id: 'define', label: { nl: 'Define', en: 'Define' }, letter: 'D', modules: ['pm.intake'] }, …]`.
- **`checkMap` gains a phase rule.** Every phase module is a road module; the phases follow road order; each road module is in at most one phase. Only `pm.approach` (and `pm.formats` if Q2 A) may have none. Every phase has at least one module.
- **The module screen** shows a small pill with the phase and the module title, "Define · Intake". The module title itself stays (Intake, Plannen, …).
- **Phone layout** (`phoneLayout`): rows of three and two as now. Row 1 approach, intake, measure; row 2 analyse, plan, run; row 3 land, close (and formats). Each row is its own stretch of road with an arrow; on the phone the band is shown as a small letter on each place instead of a band.
- **Draw objects.** The new places need a drawing: a stopwatch for Meten and a magnifier or fishbone for Analyseren. If `mapSvg` does not have them, D2 reuses `dashboard` and `board` for now.
- **For learners.** `breadthOrder` walks the road first, so the Basis lessons of Meten and Analyseren come right after Intake's in the first round. Someone who has passed every Projects Basis lesson then sees "Wat een nulmeting is" as his next step. That is intended (design 1.2). No progress is lost, because no lesson changes id or module.

### 1.3 A delivery project on the same road (Q2 A)

A line move, an ERP roll-out or a new substation is not an improvement of a running process. It walks the same five phases, with Measure and Analyse kept light and pointed at a different question.

| Phase | Improvement project | Delivery project (light M and A) |
|---|---|---|
| Define | problem, goal from X to Y, charter | the order, the end result, acceptance criteria, charter, business case |
| Measure | baseline of the problem metric | **the current state you must not lose**: throughput and quality before a line move, service level, reports and interfaces before an ERP cut-over, capacity before a switch-over; the as-is process the new system must carry |
| Analyse | verified root causes | **risks, dependencies and gaps**: a fit-gap of the new system against the as-is process, the dependency chain, the riskiest assumptions, readiness of the line |
| Improve | pilot and roll out the solution | build, test, train and go live on a plan (critical path, change control) |
| Control | control plan, handover, proven result | hypercare, handover to the line, acceptance, the "as fast as before" baseline proven |

Where this is taught: in the rewritten `pm.approach.route` (Basis), in one exception block of `pm.measure.enough` and of `pm.analyse.depth` (both Gevorderd; or in two whole lessons, Q4), and in `pm.approach.tailor` (how much route). The route lesson says plainly where DMAIC fits less well: when there is no running process to measure, or when the work is designing something new (then DMADV or stage-gate).

### 1.4 Governance: PRINCE2 and stage-gate as the layer over the phases

The phases say *what* the project works out in which order; the governance layer says *who decides when* to go on.

- **A gate at each phase end.** In Lean Six Sigma it is called a tollgate review (already in F4's `pm.approach.dmaic`); in stage-gate a gate; in PRINCE2 a stage boundary with an end stage assessment. In this app it is the steering-committee moment of `pm.run.steerco` and the go/no-go of `pm.intake.phasing`.
- **PRINCE2 over DMAIC.** Starting up and initiating a project match Define (the project initiation documentation is the charter, grown). The management stages follow the phases or group them (often M+A as one stage, I as one or more, C with closing). Management by exception and tolerances (`pm.plan.control`, `pm.run.exception`) work inside each stage; closing a project is the end of Control (`pm.close`).
- **Stage-gate (Cooper) over DMAIC** at clients that run all projects through a gate model (`pm.approach.clientroute`, `pm.portfolio.gates`, `pm.scaled.stagegate`). Their gates sit on the phase ends. For new-product work stage-gate pairs better with DMADV than with DMAIC.
- **Agile inside Improve** when the solution is software or needs fast feedback: sprints within the phase, the tollgate stays (`pm.approach.choose`, `pm.agile.fit`).

---

## 2. The two new modules

Both modules: `subject: 'pm'`, `track: 'project'`, **`level: 2`** (Verdieping, like run, land and close: you meet them after Intake; my call, Merijn can overturn it), intro film `pm.<id>.intro`, four topics × four levels, 16 lessons per language, 4 recall questions each, a level opener per topic for levels 2 to 4. Lesson ids below are proposals and become fixed once written.

**How the new lessons relate to existing ones.** For each overlap the table after each module says what the new lesson does. **Link**: the new lesson names the existing one for the technique and does not teach it. **Summary**: one block recaps the existing lesson in plain words so the lesson stands alone, and then names it. **PM angle**: the new lesson covers the same subject from the project lead's side (what to ask for, decide or check, what good looks like). It never repeats the engineering technique.

**The Engineering modules stay the depth.** `eng.improve` teaches 5 why, Ishikawa, is/is-not, verifying a fix, gemba, breaking down a problem, run charts and the rule of three, DOE, PDCA, the A3, 8D, kaizen, VSM and facilitating a cause session. `eng.spc` teaches measurement error, MSA and %GRR, control charts, Cpk and Ppk. `eng.quality` teaches tolerances, Cp and Cpk, sigma level and DPMO, the check sheet, the pareto and the run chart, the control plan and 8D. `eng.flow` teaches takt, the bottleneck and TOC, OEE and the downtime pareto, SMED and batch size. In Projects, `pm.intake.problemstatement` already shows gemba, 5 why and is/is-not as a short preview. `pm.stuck.rootcause` applies cause-finding to the project itself (iceberg, Deming's 94%). `pm.perform.kpicard` teaches the operational definition, and `pm.close.results`, `.runchart` and `.claim` teach the baseline at the end.

**Gaps that only the new modules fill.** The search over the Dutch content found no lesson that teaches the eight wastes as a list (Lean and "verspilling" appear only in passing), a data collection plan, % complete and accurate, process cycle efficiency, balancing measures, a cause-and-effect matrix, a weighted or second-level pareto, value-added analysis of an office process, or the works council and privacy side of measuring people's work.

### 2.1 `pm.measure`: Meten / Measure

- **Title** nl *Meten*, en *Measure*. **Blurb** nl: "De huidige situatie in beeld en in getallen: het proces zien, een nulmeting die standhoudt, flow en verspilling tellen, en data waarop je kunt bouwen." en: "The current state in a picture and in numbers: seeing the process, a baseline that holds, counting flow and waste, and data you can build on."
- **Topics:** `current`, `baseline`, `flow`, `trust`. They follow the design's seed topics, in this order and a little sharper.
- **Thread case** (suggestion for the writer): the connection requests at a grid operator (office flow), plus one production case per topic so manufacturing stays present.

#### M1. Het huidige proces zien / Seeing the current process (`current`)

| Level | Lesson (id, nl / en) | What it teaches that the level below does not |
|---|---|---|
| Basis | `pm.measure.walk`, *Het proces lopen* / *Walking the process* | What Measure is for: the second phase, which turns the agreed problem into a picture and a number. Follow one item (an order, a work order, a part) from the first to the last SIPOC step, on foot. **The eight wastes** as the lens (transport, inventory, motion, waiting, overproduction, overprocessing, defects, unused talent), each with an office and a shop-floor example. Words: current state, waste (muda), the eight wastes. Worked example: one connection request walked, the wastes seen. |
| Werkkennis | `pm.measure.map`, *Een proceskaart met tijden* / *A process map with times* | From the walk to a swimlane map with data per step: process time, waiting time, hand-offs, and % complete and accurate (the share of work that arrives usable at the next step). Add them up into lead time and process time. Simple numbers: 7 steps, 9 days of lead time, 3.5 hours of work. |
| Gevorderd | `pm.measure.vsm`, *Welke kaart, hoe breed* / *Which map, how wide* | The project lead decides which map (SIPOC, swimlane or a value stream map with material and information flow), which product or request family (the one with the most volume or pain), door to door or end to end, and floor data or ERP data. The office value stream metrics (Martin and Osterling): lead time, process time, rolled % complete and accurate. Exceptions: low-volume, high-mix work; work that crosses companies. Faded example: three candidate scopes, choose one. |
| Expert | `pm.measure.exposes`, *Wat de kaart blootlegt* / *What the map exposes* | A current-state map across departments makes waste and ownership visible, so it is political. A senior weighs who owns the map, who must have seen it before the sponsor does, when mapping becomes a way to avoid deciding, and how to use the map as the Measure tollgate agreement. Questions to ask: "Who works this step and has seen this map?", "Whose number is this waiting time?". |

Overlaps: `eng.improve.gemba` (how to look: the three actuals, the Ohno circle) is **linked** from the walk. `pm.formats.floor` and `pm.formats.brownpaper` (running a gemba walk or a brown paper session) are **linked**; the map lesson is about what goes on the paper. `eng.improve.vsm` (VSM symbols and the manufacturing lead-time calculation) gets a **summary** in `pm.measure.vsm`, which then takes the **PM angle** of choosing scope and map type. `pm.intake.sipoc` is the starting line: **link**.

Sources: Ohno, *Toyota Production System* (1988) for the seven wastes; Liker, *The Toyota Way* (2004) for the eighth (unused talent); Womack and Jones, *Lean Thinking* (1996); Rother and Shook, *Learning to See* (LEI, 1999); Martin and Osterling, *Value Stream Mapping* (McGraw-Hill, 2013) for office streams and % complete and accurate; Rummler and Brache, *Improving Performance* (1990) for swimlanes; ISO 13053-2:2011 (Six Sigma tools, process mapping); Womack, *Gemba Walks* (LEI, 2011).

#### M2. Nulmeting en dataplan / Baseline and data plan (`baseline`)

| Level | Lesson | What it teaches that the level below does not |
|---|---|---|
| Basis | `pm.measure.baseline`, *Wat een nulmeting is* / *What a baseline is* | The project metric (the Y of the charter's goal "from X to Y") and its baseline: the current value, measured the way it will be measured afterwards. Why you measure before you change anything. The operational definition in one line: what counts, how, when, from which source. Words: Y, baseline, operational definition, measuring period. Worked example: a baseline of 40 records over four weeks. |
| Werkkennis | `pm.measure.plan`, *Een dataverzamelplan maken* / *A data collection plan* | The plan as a table: what (the Y and the factors), definition, source, who, how long, how many, how recorded (check sheet or system extract). Record now the factors Analyse will split by (shift, type, region, product), because you cannot add them afterwards. Simple numbers: 20 working days × about 10 requests = 200 records. |
| Gevorderd | `pm.measure.enough`, *Genoeg data, en de goede* / *Enough data, and the right data* | Decisions: existing system data or fresh manual collection (cost against bias); how long and how many (about 20 to 30 points for a run chart, rare events need far more); is the baseline stable before you compare against it; seasons and one-off weeks. **Exception block: the delivery project** (section 1.3), where you measure the current state you must not lose. When the baseline is good enough to pass the Measure tollgate. Faded example. |
| Expert | `pm.measure.people`, *Meten aan het werk van mensen* / *Measuring people's work* | What a senior weighs when the measurement touches people. The works council has a consent right on systems that can monitor attendance, behaviour or performance (WOR art. 27 lid 1 sub l). The GDPR asks for data minimisation. People change their work while they are observed (the observer or Hawthorne effect) and can game the baseline. A baseline that is not signed off is disputed at the end. Agree the baseline in writing at the tollgate. Questions to ask. |

Overlaps: `pm.intake.done` (the goal from X to Y and that a baseline is needed) and `pm.intake.start` (start the baseline in the first weeks) are **linked**; this topic is where the baseline is made. `pm.perform.kpicard` (the full KPI card) gets a **link** and a one-block **summary** of the operational definition. `pm.close.results`, `.runchart` and `.claim` (comparing after against before, the run chart rules, the claim) are **linked**; the Gevorderd lesson uses the run chart only to judge whether the baseline is stable. `eng.improve.data` (normal variation, the rule of three) is **linked**. `pm.perform.gaming` is **linked** from the Expert lesson.

Sources: Deming, *Out of the Crisis* (1986), operational definitions; Provost and Murray, *The Health Care Data Guide* (2011), data collection plans and sampling for improvement; George, Rowlands, Price and Maxey, *The Lean Six Sigma Pocket Toolbook* (2005), data collection plan and check sheet; ISO 13053-1:2011 (the DMAIC methodology, Measure phase deliverables); Wet op de ondernemingsraden art. 27; GDPR art. 5(1)(c); McCambridge, Witton and Elbourne, "Systematic review of the Hawthorne effect", *Journal of Clinical Epidemiology* 67 (2014).

#### M3. Flow en verspilling in getallen / Flow and waste in numbers (`flow`)

| Level | Lesson | What it teaches that the level below does not |
|---|---|---|
| Basis | `pm.measure.flowbasics`, *Doorlooptijd, bewerkingstijd en onderhanden werk* / *Lead time, process time and work in progress* | The few flow measures a project uses: lead time, process (touch) time, work in progress, throughput, first pass yield. Why lead time is often ten times the process time in an office process. Words and a worked example on one request type. |
| Werkkennis | `pm.measure.little`, *Rekenen met flow* / *Calculating flow* | Three calculations with simple numbers. Little's law (lead time = WIP ÷ throughput: 120 open requests at 30 per week is 4 weeks). Process cycle efficiency (process time ÷ lead time). Rolled throughput yield (multiply the first pass yields of the steps). What each number tells the sponsor. |
| Gevorderd | `pm.measure.metrics`, *De hoofdmaat en de tegenmaten* / *The main measure and its balancing measures* | Choose one primary metric tied to the customer requirement (the CTQ from Define). Add balancing measures (outcome, process and balancing measures), so that a faster process does not quietly get worse elsewhere. Average or percentile: a customer feels the slow tail, so report the 85th percentile of lead time next to the average. Exceptions: a metric the client already reports differently. Faded example. |
| Expert | `pm.measure.money`, *Van flow naar geld en klantbelofte* / *From flow to money and the customer promise* | What a senior agrees at the start, not at the end: how a flow gain becomes money (working capital tied up in WIP, capacity, overtime, a customer promise you can keep), agreed with the controller before the baseline is frozen. Measures that clash with a department's own KPI. Questions to ask finance and the sponsor. |

Overlaps: `eng.flow.takt` and `.oee` (takt and OEE for lines) are **linked**; this topic is about flow through a process, often an office one. `pm.portfolio` and `pm.agile` use Little's law for portfolio and Kanban flow: **link**, here applied to a process baseline. `eng.quality.sigma` (rolled throughput yield, DPMO) gets a **summary** in one block, then a link. `pm.land.savings` and `pm.close.claim` (hard and soft savings, the claim at the end) get the **PM angle**: here the money logic is agreed up front. `pm.perform.kpis` (leading and lagging) is **linked**. `pm.stuck.turf` is **linked** from the Expert lesson.

Sources: Little, "A proof for the queuing formula L = λW", *Operations Research* 9 (1961); Hopp and Spearman, *Factory Physics* (3rd ed., 2008); George et al., *Lean Six Sigma Pocket Toolbook* (process cycle efficiency, RTY); Provost and Murray (2011) and Langley et al., *The Improvement Guide* (2nd ed., 2009), outcome, process and balancing measures; Vacanti, *Actionable Agile Metrics for Predictability* (2015), percentiles of lead time; Martin and Osterling (2013).

#### M4. Data waarop je kunt bouwen / Data you can trust (`trust`)

| Level | Lesson | What it teaches that the level below does not |
|---|---|---|
| Basis | `pm.measure.trust`, *Waarom data kunnen liegen* / *Why data can lie* | Where project data go wrong: manual bookings, a status set at the end of the day instead of when the work finished, a definition that changed with a new system, missing records, a reason code chosen because it is first in the list. The basic check: follow ten records back to what really happened. Worked example. |
| Werkkennis | `pm.measure.agree`, *Zeggen twee mensen hetzelfde?* / *Do two people say the same?* | A simple measurement check for categories (defect type, delay reason, downtime code): two or three people classify the same 20 items twice; count the agreement (17 of 20 is 85%); sharpen the definitions where they differ. For measured values the check is a gauge R&R, named here and taught in Engineering. |
| Gevorderd | `pm.measure.capability`, *Geschiktheid als projectmaat* / *Capability as a project measure* | Express the baseline as how often the process meets the customer requirement: % within the requirement, defects per million and the sigma level read as a sentence, Cpk read as a sentence. Stable before capable. The project lead decides which form the sponsor will understand and whether the measurement is good enough to compare against at all. Faded example. |
| Expert | `pm.measure.challenge`, *Cijfers van anderen toetsen* / *Testing other people's numbers* | When an MSA is worth its cost (what a wrong decision would cost); testing a supplier's, a system's or a dashboard's numbers; the measurement system as the real finding (sometimes the project becomes a data quality project, and that is a tollgate decision); an audit trail that lets the final claim survive. Questions to ask. |

Overlaps: `eng.spc.measerror`, `.msa`, `.attribute` and `.uncertainty` (measurement error, %GRR, attribute agreement in depth) get a **summary** of the idea and a **link**; the new lessons ask for and judge such a check, they do not compute one. `eng.quality.capability`, `eng.spc.capread` and `.ppk` (Cp, Cpk, Ppk) get a **summary** and a **link**; the Gevorderd lesson takes the **PM angle** (which form, for whom). `pm.perform.kpicard` (definition drift with a new ERP) is **linked**.

Sources: AIAG, *Measurement Systems Analysis Reference Manual* (4th ed., 2010); Wheeler, *Understanding Variation* (1993) and *EMP III: Evaluating the Measurement Process* (2006); Montgomery, *Introduction to Statistical Quality Control* (8th ed., 2019); Pyzdek and Keller, *The Six Sigma Handbook* (4th ed., 2014); ISO 22514-2 (process capability, as referenced by the Engineering lessons).

### 2.2 `pm.analyse`: Analyseren / Analyse

- **Title** nl *Analyseren*, en *Analyse*. **Blurb** nl: "Van waar het verlies zit naar waarom: oorzaken zoeken en kiezen, pareto en uitsplitsen, oorzaken toetsen met data, en verspilling en de bottleneck." en: "From where the loss is to why: finding and choosing causes, pareto and stratifying, testing causes with data, and waste and the constraint."
- **Topics:** `cause`, `pareto`, `verify`, `flow`. These are the design's seed topics, with "the constraint and the flow" widened to waste and flow, picking up where the Measure map stops.

#### A1. Van symptoom naar oorzaak / From symptom to cause (`cause`)

| Level | Lesson | What it teaches that the level below does not |
|---|---|---|
| Basis | `pm.analyse.funnel`, *De trechter van Analyseren* / *The Analyse funnel* | What Analyse is: from many possible causes (wide) to a few likely ones (narrowed by the data from Measure) to verified root causes. The two basic tools named and recapped in one block each: the fishbone (Ishikawa; 6M for production, the people, policies, procedures and place headings for services) and 5 why. Words: possible, likely and verified cause, root cause, countermeasure. Worked example: the late work orders. |
| Werkkennis | `pm.analyse.choose`, *Welke oorzaken je gaat toetsen* / *Which causes you will test* | From 30 notes on a fishbone to the 3 you will test: a cause-and-effect matrix (score each candidate on how strongly it can move the Y, weighted), and why team votes alone are not evidence. Simple numbers: three candidates scored, one dropped. |
| Gevorderd | `pm.analyse.depth`, *Hoe diep: inperken, snelle fix of grondoorzaak* / *How deep: contain, quick fix or root cause* | The project lead decides the depth: containment first when the customer is hurt (as in 8D), a quick fix when it is cheap and reversible, root cause when the problem returns. Several contributing causes instead of one chain (the limits of 5 why). Time-box Analyse. **Exception block: the delivery project** (section 1.3), where Analyse means risks, dependencies and a fit-gap. Faded example. |
| Expert | `pm.analyse.outside`, *Oorzaken buiten je scope* / *Causes outside your scope* | What a senior weighs when the root cause lies in another department, in a policy, or in a decision of the sponsor: most problems belong to the system, not the person (Deming); "operator error" is not a root cause (just culture); how to bring an uncomfortable cause to the tollgate and keep the sponsor. Questions to ask. |

Overlaps: `eng.improve.whys` and `.fishbone` (the techniques, Card's critique) get a **summary** in the funnel lesson and a **link**. `eng.improve.facilitate` (leading a cause session) is **linked**. `pm.stuck.rootcause` (the iceberg and Deming's 94%, applied to a stuck project) is **linked** from the Expert lesson, which takes the **PM angle** on the client's process, not the project. `eng.improve.8d` and `eng.quality.eightd` (containment, D3) are **linked** from the Gevorderd lesson. `pm.intake.problemstatement` (the preview of 5 why and is/is-not) is **linked** back.

Sources: Ishikawa, *Guide to Quality Control* (1968, English ed. 1982); Ohno (1988) for 5 why; Card, "The problem with '5 whys'", *BMJ Quality & Safety* 26 (2017); George et al., *Lean Six Sigma Pocket Toolbook* (cause-and-effect matrix); Deming, *Out of the Crisis* (1986); Dekker, *Just Culture* (3rd ed., 2016); VDA, *8D – Problem Solving in 8 Disciplines* (2018).

#### A2. Pareto en uitsplitsen / Pareto and stratification (`pareto`)

| Level | Lesson | What it teaches that the level below does not |
|---|---|---|
| Basis | `pm.analyse.pareto`, *Het paretodiagram lezen* / *Reading a pareto chart* | What a pareto chart is (bars from large to small plus a cumulative line), the "vital few" (Juran) and the 80/20 rule of thumb, and how to read where the line bends. Worked example: delay reasons for work orders. |
| Werkkennis | `pm.analyse.split`, *Een pareto maken en uitsplitsen* / *Building a pareto and stratifying* | Count the categories from the records of the data plan, sort, compute the cumulative percentages, choose the vital few. Then stratify by the factors collected in Measure (shift, region, request type). Simple numbers: 200 records, 7 categories. |
| Gevorderd | `pm.analyse.weighted`, *Pareto op wat telt* / *Pareto on what counts* | Decisions and traps. Count, cost or time (a weighted pareto can turn the order around). A second-level pareto inside the top bar. An "other" bar that is too large. Categories that changed halfway. When the pareto is flat, switch to is/is-not or to the process itself. Faded example. |
| Expert | `pm.analyse.rescope`, *Wat de pareto met je scope doet* / *What the pareto does to your scope* | The pareto as the reason to narrow the project at the Analyse tollgate (rescoping with the sponsor). The politics of whose category is on top. A flat pareto points at the system, so the answer is redesign rather than a fix. Questions to ask. |

Overlaps: `eng.quality.datatools` (check sheet, pareto, run chart on the floor) gets a **summary** in the Basis lesson and a **link**. `eng.flow.downtime` (pareto of stops) is **linked** as a shop-floor example. `eng.improve.isisnot` (is/is-not and stratification) is **linked** from the Gevorderd lesson. `pm.run.rescope` and `pm.run.change` are **linked** from the Expert lesson, which takes the **PM angle**.

Sources: Juran, *Juran's Quality Handbook* (7th ed., De Feo, 2016), the Pareto principle and the vital few; Ishikawa (1982); George et al. (2005); ISO 13053-2:2011; Kepner and Tregoe, *The Rational Manager* (1965) for is/is-not.

#### A3. Oorzaken toetsen met data / Testing causes with data (`verify`)

| Level | Lesson | What it teaches that the level below does not |
|---|---|---|
| Basis | `pm.analyse.hypothesis`, *Een oorzaak is een hypothese* / *A cause is a hypothesis* | Until data back it, a cause is a hypothesis. What counts as evidence; the question "what would we see if this were true, and what if it were not?"; keeping facts, theories and open questions apart. Worked example: three theories for late work orders, each with its "we would see". |
| Werkkennis | `pm.analyse.evidence`, *Eenvoudig bewijs* / *Simple evidence* | Three simple ways to test, with simple numbers: a stratified comparison (late share per region), a scatter plot (read the direction and strength, no formulas), and before and after on a run chart. |
| Gevorderd | `pm.analyse.traps`, *Valkuilen in bewijs* / *Traps in evidence* | Correlation is not causation; a hidden third factor (volume, season); too few points; regression to the mean; picking the weeks that suit you. The strongest test is switching the cause on and off, or a small pilot with a prediction. The project lead decides when to call in a statistician or a Black Belt, and which tests that person would run (see Q3). Faded example. |
| Expert | `pm.analyse.tollgate`, *De analyse verdedigen aan de fasepoort* / *Defending the analysis at the tollgate* | What a senior weighs: an evidence standard that matches the cost of the decision (reversible or not); presenting uncertainty honestly; the highest-paid person's opinion; the left half of the A3 as the story of Define to Analyse; what the sponsor must decide at the end of Analyse. Questions to ask. |

Overlaps: `pm.intake.issuetree` (hypothesis-driven work in consulting) is **linked** from the Basis lesson. `eng.improve.data`, `.verify` and `.doe` (variation, on/off verification, DOE) get a **summary** of on/off verification and a **link**. `pm.close.runchart` (the run chart rules) is **linked**. `pm.stuck.experiment` (reversible decisions, small experiments) is **linked** from the Expert lesson. `eng.improve.a3` and `.a3review` are **linked** for the A3.

Sources: Box, Hunter and Hunter, *Statistics for Experimenters* (2nd ed., 2005); Provost and Murray (2011); Langley et al. (2009), testing changes with PDSA; Shook, *Managing to Learn* (LEI, 2008); Sobek and Smalley, *Understanding A3 Thinking* (2008); Rasiel, *The McKinsey Way* (1999) for hypothesis-driven work; ISO 13053-1:2011 (Analyse phase deliverables).

#### A4. Verspilling, flow en de bottleneck / Waste, flow and the constraint (`flow`)

| Level | Lesson | What it teaches that the level below does not |
|---|---|---|
| Basis | `pm.analyse.valueadd`, *Waarde toevoegend of niet* / *Value-adding or not* | Sort each step of the current-state map: value-adding (the customer would pay for it, it changes the item, done right first time), necessary but not value-adding (law, safety), and waste (tied to the eight wastes from Meten). Worked example: a 9-step request, 2 steps value-adding. |
| Werkkennis | `pm.analyse.waiting`, *Waar het werk wacht* / *Where the work waits* | From the map: waiting time per step, the biggest queues, the effect of batching and hand-offs. Simple numbers: of 6 days lead time, 4 are waiting before one approval. |
| Gevorderd | `pm.analyse.constraint`, *De bottleneck in een proces met mensen* / *The constraint in a process run by people* | Find the constraint (the queue in front of it, its utilisation). Why queues explode above about 80 to 85% utilisation, with variation as the cause (Kingman, in words). The decision: lift the constraint (the five focusing steps), remove waste around it, or cut variation. Exception: a constraint that is one expert. Faded example. |
| Expert | `pm.analyse.future`, *Van analyse naar toekomstbeeld* / *From analysis to the future state* | What a senior weighs when choosing what Improve will attack. Local optimisation against the whole stream. A few big moves rather than many small ones. Future-state questions (takt or customer rhythm, flow, pull, where to schedule). Spare capacity costs money and buys lead time. Updating the business case before Improve starts. Questions to ask. |

Overlaps: `eng.flow.bottleneck`, `.toc` and `.batch` (the bottleneck, the five focusing steps, drum-buffer-rope, batch size on lines) get a **summary** of the five steps and a **link**; these lessons take the **PM angle** on processes run by people. `eng.improve.vsm` (the future-state map) is **linked** from the Expert lesson. `pm.intake.sensitivity` (the business case that holds) is **linked**. `pm.measure.walk` (the eight wastes) is assumed: it is a Basis lesson that comes earlier in the road.

Sources: Rother and Shook (1999), the future-state questions; Goldratt, *The Goal* (1984), the five focusing steps; Kingman, "The single server queue in heavy traffic", *Proc. Cambridge Philosophical Society* 57 (1961); Hopp and Spearman (2008); Reinertsen, *The Principles of Product Development Flow* (2009), queues and capacity; Martin and Osterling (2013); Womack and Jones (1996).

### 2.3 Level separation check

| Topic | Basis | Werkkennis | Gevorderd | Expert |
|---|---|---|---|---|
| M1 current | see (walk, 8 wastes) | record (map with times) | choose the map and its scope | the politics of the map |
| M2 baseline | what a baseline is | plan the collection | enough, stable, delivery exception | people, works council, sign-off |
| M3 flow | the measures | the three calculations | main and balancing measures | money and the promise |
| M4 trust | where data lie | agreement check | capability as a measure | when to invest, others' numbers |
| A1 cause | the funnel and 2 tools | choose what to test | how deep, delivery exception | causes outside scope |
| A2 pareto | read | build and split | weighted, second level, flat | scope and politics |
| A3 verify | hypothesis | simple evidence | traps, strongest tests | the tollgate standard |
| A4 flow | value-adding or not | where work waits | the constraint | the future state |

No level repeats the one below. No level N lesson assumes something only N+1 teaches. A4 Basis assumes the eight wastes from M1 Basis, which comes earlier in the road and in `breadthOrder`.

**Pictures (group 5, rule 2) and films.** Picture candidates: the funnel (tree), the pareto (chart), the swimlane map with times (flow), the value-adding strip (timeline), the data collection plan (table), the main and balancing measures (table). Film candidates by rule 1 (something changes over time): the queue that explodes as utilisation rises (`pm.analyse.constraint`) and Little's law as WIP fills (`pm.measure.little`). Neither is in scope for D3; they are listed for Task 17 and beyond.

---

## 3. The existing road modules: the DMAIC sentence and phase moves in the text

Rule (design 1.2): one sentence in the first Basis reading block of each topic, and one line in that topic's level-2 opener where it fits. The sentences go into the module pass (P-n), so each lesson file is opened once. No lesson changes module; no recall question changes kind or position because of DMAIC, except where marked (route). Draft sentences in Dutch; the English follows in the pass.

### `pm.approach` (Start)

| Topic | Sentence or change |
|---|---|
| route | **Rewrite, not a sentence** (task D2b). `pm.approach.route`: the five stages become the DMAIC road: Start, then Define (Intake), Measure (Meten), Analyse (Analyseren), Improve (Plannen, Uitvoeren), Control (Landen, Afsluiten), each phase with its phase product; blocks 1, 2 and 5, the gist and the sayIt change; a block on the governance layer (section 1.4) and on delivery projects (section 1.3). The recall questions survive as they are (Intake's phase product, no plan before an agreed problem, the 80% calculation, the mandate). `pm.approach.takeover`: "which phase product is missing" now names DMAIC phase products. `pm.approach.tailor`: "merge phases" becomes "how much Measure and Analyse": light for delivery, merged for a two-week fix, never dropped. `pm.approach.clientroute`: the client's gates are the governance layer on the phase ends. |
| method | Done in F4 (families, dmaic). `pm.approach.choose`: "DMAIC is de ruggengraat; de keuze in deze les gaat over hoe je binnen Improve werkt: voorspellend, in sprints of hybride." |
| tools | "Gereedschap dient alle fasen: een bord in elke fase, een spreadsheet of Power BI voor de nulmeting in Measure, een statistiekpakket alleen als het project Six Sigma-statistiek nodig heeft." |
| enterprise | "In Measure zijn de systemen van de klant je databron: de nulmeting komt uit het systeem van vastlegging, niet uit je eigen bord." |

### `pm.intake` (D · Define)

| Topic | Sentence | Phase moves in the text |
|---|---|---|
| problem | "In DMAIC is dit de Define-fase: je legt het probleem vast voordat je gaat meten." | `pm.intake.problemstatement` blocks 3 and 4 (gemba, 5 why, is/is-not): keep them as a preview, add "het echte oorzaakwerk doe je in Analyseren" (my call; moving the content out would change the recall of an id-pinned lesson). `pm.intake.issuetree`: "De hypotheses die je nu opschrijft, toets je in Analyseren." |
| people | "Stakeholders breng je in Define in kaart; je houdt de kaart bij tot en met Control." | `pm.intake.start`: "Het fundament van nulmeting" becomes "je zet het dataverzamelplan op; de nulmeting zelf is Measure (module Meten)". |
| scope | "De projectopdracht is het faseproduct van Define; de fasepoort aan het eind van Define keurt haar goed." | `pm.intake.done`: in Define you name the metric and how it is measured; the figure comes in Measure. `pm.intake.sipoc`: "SIPOC trekt in Define de grens; de gedetailleerde kaart met tijden maak je in Measure." `pm.intake.phasing`: the go/no-go per phase are the DMAIC tollgates, the governance layer of section 1.4. |
| case | "De businesscase hoort bij Define en wordt bij de fasepoort van Analyse opnieuw doorgerekend, als de oorzaak bekend is." | `pm.intake.sensitivity`: name that recheck. |

### `pm.plan` (I · Improve; depends on Q1)

| Topic | Sentence (Q1 A) | Phase moves |
|---|---|---|
| breakdown | "In DMAIC plan je twee keer: grof in Define (mijlpalen per fase in de projectopdracht), in detail in Improve, voor de invoering van de gekozen oplossing. Bij een opleverproject is dit plan het hart van Improve." | `pm.plan.products` and `.control` (PRINCE2 products, baseline, tolerances): name the stage boundary as the phase end. |
| schedule | "Het kritieke pad van een verbeterproject loopt vooral door Improve: testen, invoeren, trainen." | `pm.plan.method`: agile inside Improve when the solution is uncertain. |
| estimate | "Measure en Analyse schat je in tijdvakken (time-boxes); Improve schat je per werkpakket." | none |
| resources | "De risicolijst begint in Define en groeit in Analyse; bij een opleverproject is de risicoanalyse de lichte Analyse-fase." | none |

### `pm.formats` (toolbox for all phases, Q2 A; or Improve)

This module needs a phase per lesson, not per topic, because its lessons serve different phases. The sentence names the phase where the format is used.

| Lesson | Phase named in the text |
|---|---|
| `catalogue`, `system`, `governance` | all phases; `governance`: "de fasepoort is een overleg met een besluit" |
| `kickoff` | "De kick-off opent Define." |
| `workshop`, `design`, `facilitation` | all phases |
| `brownpaper` | "In Measure teken je zo de huidige situatie; de tijden per stap komen uit de les Een proceskaart met tijden (Meten)." |
| `diverge`, `session` | "Oorzaken verzamelen in Analyse, oplossingen verzamelen in Improve." |
| `decide`, `legitimacy` | "Kiezen gebeurt aan het eind van Analyse (welke oorzaken) en in Improve (welke oplossing)." |
| `floor` | **Phase move in the text**: block 3 "Gembawalk en interviewronde aan het begin, in Intake en Plannen" becomes "in Define en Measure"; "de demo tijdens Uitvoeren" becomes "in Improve". |
| `interviews` | "Define en Measure." |
| `demo` | "Improve." |
| `kaizenevent` | "Een kaizenevent perst Analyse en Improve in één week, voor één gebied." |

### `pm.run` (I · Improve)

| Topic | Sentence | Phase moves |
|---|---|---|
| steer | "In DMAIC is de stuurgroep ook de fasepoort: aan het eind van elke fase besluit zij of het project doorgaat." | `pm.run.exception`: the stage boundary is a phase end. |
| scope | "Na Analyse mag de scope legitiem veranderen, als de oorzaak elders blijkt; dat besluit valt aan de fasepoort, niet ongemerkt." | `pm.run.rescope`: link to `pm.analyse.rescope`. |
| team | "Het overlegritme loopt door alle fasen; in Improve is het het drukst." | none |
| issues | "Issues en escalatie spelen in elke fase, het meest in Improve, als de oplossing wordt ingevoerd." | none |

### `pm.land` (C · Control)

| Topic | Sentence | Phase moves |
|---|---|---|
| standard | "Standaardwerk is het hart van Control: de nieuwe werkwijze wordt de standaard, en pas dan kun je hem borgen." | `pm.land.training`: "training valt op de grens van Improve en Control, vlak voor de livegang". |
| handover | "Adoptie begint in Improve; de overdracht aan de lijn sluit Control af." | none |
| sustain | "Borgen is wat de C in DMAIC betekent: een controleplan, routines en audits die het resultaat vasthouden." | `pm.land.audits`: name the control plan (link `eng.quality.controlplan`). |
| benefits | "De baten meet je in Control tegen de nulmeting uit Measure, met dezelfde definitie." | none |

### `pm.close` (C · Control)

| Topic | Sentence | Phase moves |
|---|---|---|
| proof | "Je bewijst het resultaat tegen de nulmeting uit Measure (module Meten), met dezelfde operationele definitie." | `pm.close.results`: link to `pm.measure.baseline`. |
| closure | "De laatste fasepoort van Control is het sluitingsbesluit." | `pm.close.registers`: PRINCE2 closing a project. |
| learn | "De terugblik hoort bij het eind van Control, maar een korte terugblik bij elke fasepoort helpt al." | none |
| client | "Het eindrapport vertelt het verhaal van Define tot Control op één A4, zoals een A3." | none |

**Openers.** One line per level-2 opener of the road modules where it reads naturally (the same P-n pass). Example for `pm.intake/problem` level 2: "…In DMAIC is dit nog steeds Define." All openers keep the 320-character limit and the no-colon rule (`tests/openers.test.js`).

---

## 4. Other structures: what each is next to DMAIC, and where it is named

| Structure | Relation to DMAIC (one line) | Named where (lesson ids) | Status |
|---|---|---|---|
| **PDCA / PDSA** | the small loop inside Improve (test a change) and Control (SDCA keeps the standard) | `pm.approach.families` (F4), `pm.land.sdca`, `pm.lead.kata`; `pm.analyse.traps` (pilot with a prediction); depth in `eng.improve.pdca` | exists; new link in D3 |
| **A3** | the left half is Define to Analyse, the right half Improve and Control | `pm.approach.dmaic` (F4, size rule), `pm.intake.charter`, `pm.analyse.tollgate` (left half), `pm.close` client topic sentence; depth in `eng.improve.a3`, `.a3review` | exists; new in D3 and the `pm.close` pass |
| **8D** | DMAIC for one customer complaint, with containment (D3) first | `pm.approach.families` (F4), `pm.analyse.depth` (containment); depth in `eng.improve.8d`, `eng.quality.eightd` | F4; new in D3 |
| **DMADV / DFSS** | when you design something new instead of improving a running process | `pm.approach.families` (F4), `pm.approach.route` (where DMAIC fits less well, D2b) | F4; D2b |
| **PRINCE2** | governance over the phases: stage boundaries on phase ends, management by exception inside | `pm.approach.families`, `.translate`, `.tailor`, `.route` (D2b), `pm.plan.products`, `.control`, `pm.run.exception`, `pm.close.registers` | exists; route in D2b, sentences in P-n |
| **Stage-gate** | the client's gate model on the phase ends; pairs with DMADV for new products | `pm.approach.families`, `.clientroute` (D2b), `pm.scaled.stagegate`, `pm.portfolio.gates`, `pm.intake.phasing` (P-n) | exists; route and phasing sentences |
| **PMBOK Guide / IPMA ICB** | a body of knowledge, not a route; DMAIC is one way to order the work it describes | `pm.approach.families`, `.translate`, `pm.intake.charter` | exists, no change |
| **Agile (Scrum, Kanban, SAFe)** | sprints inside Improve when the solution is software or needs fast feedback | `pm.approach.families`, `.choose` (P-n sentence), `pm.plan.method`, `pm.agile.*`, `pm.scaled.*` | exists; sentences in P-n |
| **Kaizen event** | Analyse and Improve compressed into a week for one area | `pm.formats.kaizenevent` (P-n sentence), `pm.approach.dmaic` (size rule); depth in `eng.improve.kaizen` | exists |
| **Lean Six Sigma tollgate** | the gate at each DMAIC phase end | `pm.approach.dmaic` (F4), `pm.run.steerco` (P-n), `pm.measure.exposes`, `pm.analyse.tollgate` (D3) | F4; D3 |

Standards and anchor sources for the whole road: ISO 13053-1:2011 and 13053-2:2011 (Six Sigma, the DMAIC methodology and its tools; the D3 writer checks whether a later edition has replaced them); *Managing Successful Projects with PRINCE2* (7th ed., 2023); Cooper, *Winning at New Products* (5th ed., 2017); PMI, *PMBOK Guide* (the edition named in `pm.approach.families`); Schwaber and Sutherland, *The Scrum Guide* (2020).

---

## 5. Choices for Merijn

Five questions; the recommended option is first. Points I decided myself, which Merijn can overturn: `pm.approach` sits in an unlettered "Start" band before Define; both new modules are tier Verdieping (level 2); the lifecycle field gets two rows (one row does not fit, section 1.2); the gemba, 5 why and is/is-not preview stays in `pm.intake.problemstatement` with a link forward; the band labels use the English phase names in both languages.

**Q1. Where does Plannen (`pm.plan`) sit on the DMAIC road?**
- A. Under Improve: the detailed plan is for bringing in the chosen solution; the rough plan is in the charter in Define. *Matches DMAIC, where you only plan the solution once you know the cause; for delivery projects the plan is still the heart of Improve.*
- B. Under Define, right after Intake. *Matches how PMBOK and PRINCE2 teach planning up front, but then a full plan comes before Measure and Analyse have shown what to fix.*

**Q2. Werkvormen en overleggen (`pm.formats`) serves every phase. Where does it go on the map?**
- A. Off the road, as a toolbox place in the lifecycle field with the pill "Alle fasen". *Honest about what the module is; one more map change, and its Basis lessons come a little later in the learning order.*
- B. In the Improve band, between Plannen and Uitvoeren. *Least change; but the kick-off (Define) and the brown paper (Measure) then sit under Improve.*

**Q3. How much statistics do Meten and Analyseren teach?**
- A. Lean first: no formal statistical tests. Run charts, pareto, scatter plots and stratifying carry the evidence; tests such as the t-test and chi-square are only named at Gevorderd, with when to call in a Black Belt. *Fits a Lean-oriented module and a junior consultant; Six Sigma depth stays in Engineering.*
- B. Green Belt basics: hypothesis tests, p-values and a Cpk calculation at Gevorderd and Expert. *More complete for Six Sigma clients; heavier, and it overlaps `eng.spc` and `eng.improve.doe`.*

**Q4. Where is the light Measure and Analyse of a delivery project taught?**
- A. In one exception block inside a Gevorderd lesson of each module (`pm.measure.enough`, `pm.analyse.depth`) and in the rewritten route lesson. *Cheap and keeps the topics as proposed; a delivery project gets a few paragraphs, not a lesson.*
- B. As a whole Gevorderd lesson in each module, "Meten bij een opleverproject" and "Analyseren bij een opleverproject", in place of `pm.measure.enough` and `pm.analyse.depth`, whose content moves into the Werkkennis and Expert lessons beside them. *Gives Q2 A real weight; those neighbouring lessons get fuller and the level steps tighter.*

**Q5. 21 Projects films end on the Projects map, which changes (two rows, phase bands, two new places). Which films are re-rendered?**
- A. The field film of the lifecycle and the seven road intro films (approach, intake, plan, formats, run, land, close), plus the two new intro films: ten renders. *Every film about the road shows the new road; the 11 films of the other fields keep the old lifecycle shape in their last shot until their next rebuild.*
- B. All 21 plus the two new ones. *Everything matches; about twice the render time.*
- C. Only the two named in the design (field film and approach intro) plus the two new ones. *Cheapest; five road intro films end on an old map.*


**Answered by Merijn on 25 Nov; the proposal is approved with these answers.**
- **Q1: mostly A, with an addition.** Plannen sits under Improve, because you cannot plan without knowing which way to go. But Define must already hold a short plan for what will be delivered in the Measure phase (Merijn: "wel belangrijk om onder define ook al een korte planning te maken voor de onderdelen die je gaat opleveren in de measure-fase"). That goes into `pm.intake` (charter) and the `pm.plan` DMAIC sentences.
- **Q2: A.** `pm.formats` leaves the road as a toolbox place, "Alle fasen".
- **Q3: A.** Lean first, no formal statistical tests.
- **Q4: B.** A whole Gevorderd lesson in each module: "Meten bij een opleverproject" and "Analyseren bij een opleverproject", in place of `pm.measure.enough` and `pm.analyse.depth`; their content moves to the neighbouring lessons. Section 2 must be updated before D3.
- **Q5: B, at low priority.** In the end all 21 films plus the two new ones are re-rendered, but not now: rebuild films and text only where the change is already relevant, and leave the other modules for later in the plan.
- **The points decided in this proposal** (Start band, both new modules at Verdieping, two rows, gemba preview stays in Intake, English phase names): approved.
- **Building does not start until Merijn says so.**

---

## 6. The task cut for D2 to D4

**Why the order changes a little from the design.** `checkMap` requires every Projects module to have a place and every place to be a module, and the validator requires an index entry's lesson files to exist. So the map places for `pm.measure` and `pm.analyse` cannot land before their lessons. D2 builds the mechanism and the new geometry. Each D3 agent adds its own module's index entry, place, phase and route link together with its lessons. The integrator pushes D2 only together with D3 (no push of a road with a hole in it).

| # | Task | Files | Tests first | Build / review | Size | After |
|---|---|---|---|---|---|---|
| **D2** | Map mechanism and new geometry: optional `phases` in the map data; bands drawn by `mapSvg`; `checkMap` phase rule (section 1.2); phase pill on the module screen; two-row lifecycle zone with the slots for Meten and Analyseren reserved (constants, no places yet); `pm.formats` per Q2; phone layout; `pm.js` phases for Start, D, I, C filled. The field film build is not run (D4 fixes its assert). | `src/content/courses/maps/pm.js`, `maps/layout.js`, `src/content/courses/validate.js` (`checkMap`), `src/ui/subjectmap.js`, `src/ui/modulescreen.js`, `src/i18n.js` (pill, "Alle fasen"), `styles.css`, `tests/map*.test.js` or a new `tests/phases.test.js`, `tests/fields.test.js`, `tests/course.test.js` (`roadOrder` with formats per Q2) | phase rule rejects out-of-order, unknown or double modules; bands drawn with labels in both languages; pill text; `roadOrder` on the new road; every place still 44 px at 390 px | sonnet / **opus** (map shared with the film kit) | M | Merijn's answers to Q1 and Q2; T1 merged (`validate.js`) |
| **D2b** | Road text: `pm.approach.route`, `.takeover`, `.tailor`, `.clientroute` rewritten for the DMAIC road, the governance layer and delivery projects (sections 1.3, 1.4); `openers.pm.js` entries `pm.approach/route`; recall kinds and positions kept | `src/content/courses/pm/approach.{nl,en}.js` (route topic only), `openers.pm.js` (own key), `tests/approach.test.js` (the route names the five phases and the governance layer) | approach test; validator; question lint at zero for the touched lessons | sonnet / sonnet | M | F4 merged; can run alongside D2 |
| **D3a** | `pm.measure`: 16 lessons nl and en per section 2.1, its index entry (topics, lessons, questions), its map place in the reserved slot, phase `measure`, route link, `pm.field.lifecycle` modules, openers (12 entries), bank and blueprint per the T1 pattern, picture data if G1 is merged | `src/content/courses/pm/measure.{nl,en}.js` (new), `banks/pm.measure.*` (new), `src/content/courses/index.js` (own entry and the field list), `maps/pm.js` (own place and phase), `openers.pm.js` (own keys), `tests/fields.test.js`, `tests/formats.test.js` and `tests/approach.test.js` lifecycle lists | validator, bank validator, lint at zero for pm.measure; field and map tests with the new module | sonnet / **opus** (first module of the new road) | L | D1 approved, D2 merged |
| **D3b** | `pm.analyse`: the same, per section 2.2 | `pm/analyse.{nl,en}.js` (new), `banks/pm.analyse.*`, the same shared files (own entries) | as D3a | sonnet / sonnet | L | D2 merged; may start alongside D3a, the integrator merges `index.js`, `maps/pm.js`, `openers.pm.js` and the test lists |
| **D-int** | Integration: merge D2, D2b, D3a and D3b; full checks; CACHE bump once; SHELL entries for the new lesson and bank files; push | `sw.js`, `tests/swshell.test.js` expectations if needed | `npm test`, `node src/content/courses/validate.js`, the question lint, `bash scripts/shellcheck.sh` | integrator (sonnet) | S | D2, D2b, D3a, D3b |
| **D4** | Films: `pm.field.lifecycle` rebuilt for the DMAIC road (eight stations, bands, the asserts at build.mjs line 85 and the `tests/film.test.js` blocks at 609 and 1682); `pm.approach.intro` route beats; new `pm.measure.intro` and `pm.analyse.intro` (four levels as columns, v17 pattern); then the re-renders per Q5. Each film reviewed, then rendered right after its review | `films/pm.field.lifecycle/`, `films/pm.approach.intro/`, `films/pm.measure.intro/` (new), `films/pm.analyse.intro/` (new), the Q5 road intro films (rebuild only, no text change), VTTs, posters, `sw.js` SHELL | `tests/film.test.js`, `tests/filmcontent.test.js` | sonnet / sonnet; **render** (sonnet) after each review | L | D-int (the films end on the map and assert lesson text) |

**Sizes and lanes.** D2 and D2b run together (different files). D3a and D3b run together after D2 (they share `index.js`, `maps/pm.js` and `openers.pm.js`, but only their own entries; the integrator merges). D4 after D-int. Total: about 4 to 5 agent days including renders, as the design estimated, plus D2b (half a day).

**What the module passes (P-n) take from this.** The DMAIC sentences and phase moves of section 3 go into each road module's pass. Two dependencies: the pass for `pm.plan` (P0, the pilot) should write its DMAIC sentence only after Merijn's answer to Q1. The pass for `pm.formats` should wait for Q2. Any road module whose pass is already merged when this proposal is approved gets its sentences in a small follow-up task (S, sonnet, with the validator and the openers test as the check).

**Ledger.** One line per finished D-task in `docs/superpowers/plans/model-ledger.md`, as CLAUDE.md asks.

## 7. Notes for D2b from the pm.approach pass review (28 Nov)

When the route topic moves to the DMAIC road: the `route` lesson (gist, blocks 0, 1 and 4, the example, terms "Stage" and "Stage product", sayIt); `route#r0` and `#p0` distractors become the Measure, Improve and Control phase products (answer positions stay); `tailor` p0 and r1 and its text and the route level-3 opener ("merge stages") become "how much Measure and Analyse"; `takeover` r3 and block 4 "stage product" becomes "phase product"; `clientroute` gates become the governance layer over the phase ends; bank b1, b2, b3's why, b6 and the blueprint route aims and traps. The v13 fixture keeps kinds, positions and numbers. No route picture yet.

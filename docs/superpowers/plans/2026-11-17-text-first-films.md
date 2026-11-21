# Text-first Projects films (17 Nov 2026)

Merijn, 17 Nov: "Bij engineering vind ik de filmpjes eigenlijk altijd heel nuttig. Bij projectmanagement is dat niet altijd zo. Omdat er niet echt iets te visualiseren valt, is meelezen eigenlijk zelfs fijner, en gaat sneller. … Moeilijke onderwerpen of onderwerpen waar visualisatie een goede rol speelt moeten wel altijd filmpjes blijven."

What changed: a film in `src/content/courses/films/textfirst.js` no longer replaces the reading. The lesson runs Lezen · Voorbeeld and offers the film as "Bekijk de film" on the first reading block. Nothing is deleted; the videos stay.

Scope: Projects lesson films only. Module intro films, field films and all Engineering films stay as they are.

Integrator rulings on the triage below:
- `pm.plan.risk` is KEEP, not TEXT: the 5×5 grid filling step by step is the reasoning, and risk scoring is a topic people find hard.
- Decided per film, not per lesson (one list keyed by film id); the per-lesson split option is left out.
- Task 17: text-first films get no extension or split (their points are read in the lesson text). The pilot C film `pm.scaled.pi` stays KEEP.

---

# PM film triage (KEEP / TEXT)

40 lesson films, 87 lessons. Module = the film's home module (its id prefix); lessons may sit in other modules. Calls are from each film's build.mjs (header checklist, scene titles, stage description). Intro and field films untouched.

| film id | module | lessons using it | KEEP/TEXT | reason |
|---|---|---|---|---|
| pm.agile.backlog | agile | pm.agile.stories, refine, points | **KEEP** | Epic cut horizontally (crossed out) then vertically into slices that move up the list; planning-poker rounds converge. The slicing is the lesson and only works as a picture. |
| pm.agile.forecast | agile | pm.agile.forecast, flowsteer | **KEEP** | Cone of uncertainty, histogram of Monte Carlo runs, cumulative flow diagram and waiting-time-vs-utilisation curve are real charts that build; hardest topic in the module. |
| pm.agile.kanban | agile | pm.agile.board, wip, flowmetrics | **KEEP** | Cards move across a board, the WIP limit lights up and stops a pile-up, a teammate swarms to the full column, Little's law on a clock; the whole point is flow in motion. |
| pm.agile.scrum | agile | pm.agile.scrumbasics, events, artefacts | **KEEP** | Cards move to do/doing/done while a ten-day calendar lights each event in order; the sprint as a moving cycle. |
| pm.close.results | close | pm.close.results | **KEEP** | Run chart: 12 baseline weeks with a noise band, 10 weeks after, comparison line 4, drift back by itself. Telling signal from noise needs the chart. |
| pm.consult.proposal | consult | pm.consult.proposal, pricing | **TEXT** | A proposal page filling in, option lists and a price slider; mostly writing and numbers a reader can take in faster. The 48,000/50 days bet is one sum. |
| pm.devops.incident | devops | pm.devops.incident | **KEEP** | Lamps go red/green along MES rack, link and line; incident, problem and change are shown as different loops on the same plant. The outage and the 52 printer-failure ticks make the distinction visible. |
| pm.devops.pipeline | devops | pm.devops.pipeline, fourkeys | **KEEP** | A commit parcel rides a conveyor past five stations, lamps go green or stop red; then deploy-frequency dials. A process that moves. |
| pm.devops.postmortem | devops | pm.devops.postmortem | **TEXT** | A document, buttons, a timeline and a chain of whys, with a long blameless-culture argument; reading the template and the example is faster. The outage-bar threshold is minor. |
| pm.intake.firsttalk | intake | pm.intake.ask, firsttalk, pm.lead.listen (segment #5) | **TEXT** | Speech bubbles, the MORE PIES mnemonic letter by letter, an hour as a 5/35/10/10 clock; a conversation-skills film, reading is faster. The OEE bar is the only chart. |
| pm.intake.stakeholders | intake | pm.intake.stakeholders, pm.plan.raci, pm.lead.influence | **KEEP** | Stakeholders stand as labels on an influence/interest map and move towards 'for'; escalation ladder and org chart vs real power. A map being filled and people moving. |
| pm.itproject.cutover | itproject | pm.itproject.cutover | **KEEP** | Whole weekend hour by hour (Fri 18:00 to Mon 06:00): freeze, count, load, reconcile, go/no-go diamonds, rollback flag, dashed 10-hour restore. A sequence with dependencies; hard. |
| pm.itproject.migration | itproject | pm.itproject.rollout, migration | **KEEP** | Three plants as lanes over months, big bang vs phased pilot, extract-transform-load, mock migrations, reconciliation of 12,480 articles. Timeline plus data flow. |
| pm.itproject.mvp | itproject | pm.itproject.requirements, mvp | **KEEP** | Wish notes sorted into Must/Should/Could/Won't bins, a dashed MVP cut line, notes moving between bins. A sorting picture. |
| pm.itproject.uat | itproject | pm.itproject.uat, defects | **KEEP** | Four test levels and a UAT calendar; 120 scripts pass/fail, defects sorted by severity and retested. Counts and sorting that change. |
| pm.land.adoption | land | pm.land.change, resistance, communication | **TEXT** | Kotter list, ADKAR letters, eight operators on steps, a cascade, mainly talk with Henk and communication plans; the ADKAR/operators step is a mild visual. Reading is faster. |
| pm.land.handover | land | pm.land.handover, sustain, pm.close.acceptance | **TEXT** | Handover checklist ticking off, a 12-week calendar strip, acceptance criteria, open-points list; the 'three-month dip' is the one chart. Mostly lists of advice. |
| pm.land.training | land | pm.land.training | **TEXT** | A one-page work instruction filling step by step, TWI four steps, Kirkpatrick levels, 70-20-10 rule: lists and one document. Photos on the instruction are the only picture-work. |
| pm.lead.difficult | lead | pm.lead.difficult | **TEXT** | Three stacked layers, preparation sheet, opening lines and an agreement; dialogue and question lists, no process that moves. |
| pm.lead.feedback | lead | pm.lead.feedback, pm.perform.dialogue, pm.negotiate.senior | **TEXT** | S-B-I blocks, a crossed-out sandwich, sentences of behaviour, facts-view-request; wording examples and dialogue lines. |
| pm.negotiate.batna | negotiate | pm.negotiate.interests, batna, anchor, no | **KEEP** | Two bars slide together until the ZOPA appears, offers on a line of days, BATNA vs 950/1000 euro a day, switching cost. Overlap of ranges is hard to see in words. |
| pm.outside.disagree | outside | pm.outside.disagree, time | **TEXT** | Weighted-score table, decision criteria, a calendar of timeboxes and fixed days; mostly advice on expert time and motivation. |
| pm.outside.experts | outside | pm.outside.trust, redflags | **TEXT** | Trust-but-verify, a 40-item checklist sorted 5/3/32, red flags and sample questions; lists and phrasing, not a moving process. |
| pm.outside.jargon | outside | pm.outside.fail, jargon | **TEXT** | Premortem reasons, a ladder of evidence, translating jargon, paraphrase and teach-back; sentences and dialogue. |
| pm.outside.questions | outside | pm.outside.phasequestions, estimates | **TEXT** | Five areas of a question set, ranges and a three-point estimate, reference class; question lists. The 3-6 week range bar is minor. |
| pm.outside.steering | outside | pm.outside.progress, decide | **TEXT** | Milestones as diamonds on a 12-week strip, percent vs evidence, FAT/SAT, a decision memo; short list-like teaching, a diamond strip adds little over text. |
| pm.perform.tree | perform | pm.perform.kpis, tree, targets, gaming | **KEEP** | KPI tree and math tree broken down into drivers and owners; 26 weeks as the sum of five steps, small gains that multiply. Decomposition is the lesson. |
| pm.plan.method | plan | pm.plan.method | **KEEP** | Waterfall phases with sign-offs vs short rounds vs hybrid milestones-above-rounds-below on a 16-week strip: the shapes of plans compared. |
| pm.plan.risk | plan | pm.plan.risk | **TEXT** | Pre-mortem question, register lines, a 5x5 grid, a top five. Mostly a register and a sensible habit; a table in text works. The sticky-note clustering is the only motion. |
| pm.plan.schedule | plan | pm.plan.schedule | **KEEP** | Five tasks as cards with arrows, then the week axis with the critical path highlighted, a delay, slack, and a Gantt chart growing. The classic must-see. |
| pm.plan.wbs | plan | pm.intake.done, pm.plan.wbs, estimate | **KEEP** | Goal sentence slots, scope in/out with creeping requests, WBS tree growing, 8-80 rule, range and three-point estimate, buffer at the end. Structure being built. |
| pm.portfolio.benefits | portfolio | pm.portfolio.benefits | **TEXT** | Three stacked blocks (output, outcome, benefit), a sum (1,200 x 750), a timeline with an owner, baseline questions; concept and discipline, readable fast. |
| pm.portfolio.prioritise | portfolio | pm.portfolio.programme, prioritise, capacity | **KEEP** | Dependency chain (4 x 90% = 66%), scored projects ordered under a 240-day capacity line, WIP and Little's law, capacity matrix with red rows and 190 real days. |
| pm.run.conflict | run | pm.run.conflict | **TEXT** | Position/interest iceberg, mediation steps, BATNA, a dairy plant example, opening sentences; conversation skill. The iceberg is a single image. |
| pm.run.escalation | run | pm.run.status, decisions, pm.portfolio.governance | **TEXT** | RAG colours, decision-rights table, bad news in four parts, a one-page decision paper, a steering group shrinking from eleven to six; templates and wording. The pilot diamond shifting week 8 to 12 is minor. |
| pm.run.rhythm | run | pm.intake.start, pm.run.rhythm, pm.perform.rhythm | **TEXT** | Meeting rhythm on a calendar strip, agenda labels, minutes and actions; a schedule and templates, no reasoning in motion. |
| pm.run.scope | run | pm.run.scope, pm.negotiate.scope | **KEEP** | Budget bar of 40 days gets five 2-day blocks while the status dot stays green, balance for trade-offs, iron triangle. Creep is gradual and only visible as growth. |
| pm.scaled.hybrid | scaled | pm.scaled.stagegate, longlead | **KEEP** | Stages with gates above and sprint loops below, cost of change curve, mould lead time planned backward from the start of production to the design freeze. |
| pm.scaled.pi | scaled | pm.scaled.why, piplanning, roles | **KEEP** | ART planning board with team rows, iteration columns, feature cards and red strings between dependent teams, ROAM and confidence vote. A network picture. |
| pm.stuck.diagnose | stuck | pm.stuck.diagnose, experiment, reset | **TEXT** | Four kinds of stuck with question, symptom and fix, a chain of goal-way-people-capacity, a reversible/irreversible door, a drifting plan. A diagnostic list; the decision chain is one diagram. |
## Counts

| module (film's home) | films KEEP | films TEXT | lessons KEEP | lessons TEXT |
|---|---|---|---|---|
| agile | 4 | 0 | 11 | 0 |
| close | 1 | 0 | 1 | 0 |
| consult | 0 | 1 | 0 | 2 |
| devops | 2 | 1 | 3 | 1 |
| intake | 1 | 1 | 3 | 3 |
| itproject | 4 | 0 | 7 | 0 |
| land | 0 | 3 | 0 | 7 |
| lead | 0 | 2 | 0 | 4 |
| negotiate | 1 | 0 | 4 | 0 |
| outside | 0 | 5 | 0 | 10 |
| perform | 1 | 0 | 4 | 0 |
| plan | 3 | 1 | 5 | 1 |
| portfolio | 1 | 1 | 3 | 1 |
| run | 1 | 3 | 2 | 7 |
| scaled | 2 | 0 | 5 | 0 |
| stuck | 0 | 1 | 0 | 3 |
| **total** | 21 | 19 | 48 | 39 |

## Borderline cases
- pm.plan.risk (TEXT): for, the 5x5 grid fills and sticky notes cluster, and a matrix being filled is on your KEEP list. Against, the grid is a 25-cell multiplication table, the register is a table, and the rest is the pre-mortem habit and wording.
- pm.portfolio.benefits (TEXT): for, the output/outcome/benefit stack and the drift-back chart. Against, mostly discipline (name the owner, agree the baseline) and one sum; text carries it.
- pm.run.escalation (TEXT): for, the pilot diamond slips week 8 to 12 and the steering group shrinks 11 to 6. Against, it is wording, a decision-rights table and a one-page paper; the movement is minor.
- pm.stuck.diagnose (TEXT): for, the goal-way-people-capacity chain and the two doors; three lessons share it. Against, a diagnostic list plus symptoms and fixes; reading and scanning beats watching.
- pm.land.handover (TEXT): for, a 12-week strip with handover steps, hypercare and the three-month dip. Against, checklists and the person side; one dip chart does not carry a film.
- pm.land.adoption (TEXT): for, eight operators climbing the ADKAR steps and a four-week cascade. Against, models named and conversation (Henk, the middle manager); text plus a small figure covers it.
- pm.outside.steering (TEXT): for, milestones as diamonds and 70% vs evidence is a fine pairing. Against, short list-like teaching; two lessons that read quickly.
- pm.devops.postmortem (TEXT): for, timeline of the outage, chain of whys, outage bars vs threshold. Against, a blameless-culture talk and a document template.
- pm.consult.proposal (TEXT): for, the price slider (day rate, fixed, value-based) and the 960-a-day bet. Against, proposal writing: page one and option lists; a table of three pricing forms does the job.
- pm.plan.method (KEEP, weak): for, waterfall, rounds and hybrid shapes side by side on a 16-week strip with milestones. Against, it is a comparison of definitions, and a table could carry it. Kept because the shapes are the lesson.
- pm.plan.wbs (KEEP, weak): for, the WBS tree grows and the buffer moves to the end; three level-1 lessons share it. Against, two of the three (done-definition, honest estimating) are mostly advice. If split per lesson, plan.wbs stays film, intake.done and plan.estimate go text.
- pm.devops.incident (KEEP, weak): for, lamps and the link turn red/green, which makes incident vs problem vs change tangible. Against, the film is a lot of ITIL vocabulary.
- pm.run.rhythm (TEXT) and pm.run.conflict (TEXT): rhythm is a calendar of meetings; conflict has the single iceberg image. Clear TEXT, but conflict's iceberg is the best case for an exception.
- pm.intake.stakeholders (KEEP): the map and ladder carry it, but the third lesson (pm.lead.influence, currencies and influence without power) is talk-heavy, so it may suit text if calls are made per lesson.
- Per-lesson caveat: films shared by 3-4 lessons (perform.tree, negotiate.batna, land.handover, pm.stuck.diagnose) are decided per film here; a per-lesson split would send pm.perform.gaming (Goodhart, Wells Fargo) and pm.negotiate.no to text.

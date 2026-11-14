# v17: the big picture first (design)

Planning session with Merijn, 13 Nov 2026. This replaces the running order of
the film work. The speaking-formats plan (2026-11-12) is parked without a date.

## Intent and why

Merijn uses the app mainly to understand a field quickly enough to take part
in conversations at work. His words: "That high-over picture is the thing I
need the most." The app built depth first (single lessons, calculations) and
its subject home is a long text list, so the overview is missing twice: in the
films and in the navigation. v17 puts overview before depth everywhere.

Success: he opens Projects or Engineering, sees one drawn picture of the whole
field, watches a three-minute film that explains how the parts hang together,
and knows where every module sits before he starts a lesson.

## Goals

1. **Field films.** A few short films per subject that place all its modules.
2. **Module intro films.** One per module, shown at the top of the module
   (slot shipped in v246).
3. **A drawn map per subject** as the subject home; every module is a place on
   it. Engineering: one overview with a zone per track, tap a zone to zoom in.
4. **Andon visible.** Larger on the home screen, and presenting the intro at
   the start of each module.
5. **Two small screen fixes.** A calmer speaking home; module titles on one line.

## Non-goals

- No new deep-dive lesson films until the intros are done. Only the two almost
  finished ones are completed: pm.itproject.migration (render) and
  pm.agile.forecast (review, merge, render).
- No speaking formats (parked).
- No change to the lesson flow (Guess, Film, Check) or the done card: the
  walkthrough showed they work.
- No leagues, streak pressure or sound.

## Anti-goals

- An intro that is a deep dive in disguise: calculations, more than a handful
  of numbers, or one lesson's worked example. An intro is the map, not a lesson.
- A map that is decoration: every module must be a tappable place, and the list
  must stay reachable for anyone who prefers it.
- Andon as a talker: still at most one line per screen, no face, no limbs.

## Constraints

- Existing rules stay: TDD, a review agent per film or content piece, render
  right after review, CACHE bump once per push, PR #1 never merged, 16:9 video,
  simple figures are fine, 22-unit stage text, focus highlight.
- Phone first (390 px). The map must be legible and tappable there (44 px targets).
- Offline: maps are inline SVG or precached pages; films follow the existing
  video, HTML film, text fallback chain.
- Usage limits are real: at most three agents at once.

## Approaches considered

**Order of work**

- A. Films and map together, one subject at a time (chosen). Projects first,
  then Engineering. Each subject is complete before the next starts.
- B. All maps first, then films. Navigation improves sooner, the explanation later.
- C. All films first, then maps. Nothing changes in navigation for two weeks.

Merijn chose A: it delivers a whole, usable overview for one subject within a week.

**Level of the overview**

- Field films and module intros (chosen), field films only, or module intros
  only. Merijn chose both levels, field first.

**Subject home**

- A drawn map (chosen), a calmer list, or a fixed learning route. Merijn chose
  the map; the list stays below it.

## Decided by Merijn

- Projects first, then Engineering.
- Four field films for Projects, about three minutes each:
  1. A project from start to finish: intake, plan, run, land, close.
  2. People and influence: stuck, lead, negotiate, outside, perform.
  3. Portfolio and consulting: portfolio, consult.
  4. IT and agile: agile, scaled, devops, itproject.
- Engineering map: one overview, a zone per track (basics, discrete, IT/OT,
  grid), tap to zoom into the modules of that zone.
- Andon: larger on the home screen; at a module start he presents the intro
  (stands beside the intro film with one line; his top light comes on once the
  intro has been watched).
- Small fixes: speaking home shows one clear next round on top with quests and
  practice lists collapsed below; the English module name goes small under the
  Dutch title instead of behind it.
- **A module screen of its own.** Tapping a module on the map opens a new
  screen: Andon with the intro film on top, the topics with their levels below.
  The `<details>` row in the list stops being the module's home.
- **Subject home order on a phone:** the map first, then "Your next step".
- **One drawing.** The map a field film ends on is the same drawing as the
  subject map in the app, so the map artwork is made before the field films and
  shared between the film kit and the app.
- **Checkpoint.** Merijn sees the pilot module intro (pm.plan.intro) and field
  film 1 and approves the pattern before the other 18 Projects films are built.
- Future features he wants worked out first: "explain it back" and "knowledge
  on the map" (see the ideas list).

## Two-week order

**Week 1: Projects overview**

1. Finish the pilot module intro pm.plan.intro (agent stopped mid-build; its
   worktree holds the kit support for module-level films). Review, merge, render.
2. The Projects map artwork: one drawing with the 16 modules as places, grouped
   as the four field films group them. Shared by the app and the film kit.
3. Field film 1 (a project from start to finish), ending on that map. Review,
   merge, render.
4. **Checkpoint: Merijn watches the pilot intro and field film 1.** Nothing
   below starts on films until he approves the pattern.
5. Meanwhile, app work that does not depend on the checkpoint: the subject home
   with the map on top, the module screen, Andon larger on the home screen, and
   finishing the two pending deep-dive films (migration render, forecast review).

**Week 2: Projects complete**

6. Field films 2 to 4.
7. The other 15 Projects module intros, two builds at a time, lowest level first.
8. Andon presents the intro on the module screen.
9. The two small screen fixes.
10. Start Engineering: the overview map with four zones and its first field film.

**After that:** Engineering field films, zone maps and 26 module intros; then
deep-dive films resume.

## Left to the builder

- Where field films live in the data (proposal: a `fields` table in the course
  index, each with an id like `pm.field.lifecycle`, a title, its module ids and
  a film id; validated like `intro`).
- How the map is built (proposal: one isometric SVG per subject made with the
  anatomy skill, places as labelled hit areas, state from CSS classes so both
  themes work; the existing track list renders under it, collapsed). In v17 the
  map shows no progress; that is "knowledge on the map" on the ideas list. It
  may mark the next module, since "Your next step" sits right under it.
- The story of each film, following the pattern set by the pilot: one concrete
  thing travels through the field, few numbers, no calculations, ends on the map.
- The four Engineering zones' drawings and the grouping of Engineering field
  films (proposal: one per track; the 12-module basics track may need two).
- How "intro watched" is stored for Andon's light (proposal: a small set of
  film ids in state, synced like other progress).
- Andon's size and lines on the home screen, within the one-line rule.

## Ideas list (no order, no date)

Wanted by Merijn, to design next:

- **Explain it back.** After an intro film, explain the field aloud in 60
  seconds; the coach says what was right and what was missing. Joins speaking
  and subject knowledge, and tests the overview where it matters: out loud.
- **Knowledge on the map.** The map fills with colour as modules are passed and
  fades where review is due, so one look shows what he knows.

Other candidates:

- Prepare for real work: type "tomorrow a meeting about an MES rollout" and get
  a ten-minute pack (the overview, five terms, three good questions).
- Ask the app: search across lessons and films, with a link to the place on the map.
- One-page summary per module, to keep or share.
- A 60-second recap of an intro, offered a month later.
- Links between fields on the map (for example OEE in flow, maintenance and lines).
- Listen-only mode for intros while travelling.
- Speaking formats (plan of 12 Nov, waiting on nine answers).

## Addendum 14 Nov: two new Projects modules (practice of the project and process)

Merijn's observation: the Projects modules lean on communication and IT; what is missing is the practice of running a project or process. His questions: what do I do first, what second; when do I use a project management tool and which ones work well; when do I do a brown paper session, what do I prepare, how does the session itself run; when do I use other formats such as brainstorming or weekly meetings. And: "I am not yet a project or process manager expert, so I probably miss things."

What the check of 14 Nov found: the process content that exists is substantial (breakdown, critical path, estimating, risk, earned value, steering committee, scope and change, handover, closing, a meeting rhythm lesson, a few kick-off mentions). What is missing: the route as a whole (the order of the first days and weeks), tools (MS Project appears in one file; Jira, Trello, Planner, Asana not at all), formats and facilitation (brown paper, brainstorming and workshops do not appear), and a catalogue of meeting types and when to use which.

Decided by Merijn:

- All four gaps are in scope, plus whatever a coverage review finds that he did not think of.
- **Two new modules**, not extra topics: one about the approach and tools (route, first weeks, tools), one about formats and meetings (brown paper, workshops, brainstorming, kick-off, weekly, stand-up and others). Four topics of four levels each, like the other modules. Names and their field and map place are decided after the review below.
- **A coverage review comes first**: a research pass against the established bodies of knowledge for project and process managers (PMBOK, PRINCE2, IPMA ICB, Lean and Six Sigma practice, change management, facilitation), reading for what a manufacturing-side project or process manager who is new to the field needs and the app does not cover. Sources required. Output: a ranked gap list and a proposed topic list for the two modules, brought to Merijn as multiple-choice decisions.
- **Tools:** recommend a wide range, including ones Merijn does not know. The Microsoft world is in (Excel, Project, Planner, Teams, Azure DevOps and whatever else fits), next to other families (Jira, Smartsheet, Asana, Trello, monday.com, ClickUp, Notion, Confluence, Miro or Mural for workshops, and others the research finds). Organised by when each fits (size, team, kind of work), with sources; no prices or version claims that age.
- **Timing:** after the checkpoint (Merijn has seen the pilot module intro and field film 1), in parallel with the module intros. The map and field film 1 then get places for the two new modules, which costs one extra render of film 1.
- **Models** (see `2026-11-14-model-routing.md`): the coverage review and the tool research on `sonnet` (read-only but with synthesis); writing content on `sonnet`; the review of the first module of the new pattern on `opus`.

## Addendum 14 Nov (2): a performance management module, and a strategic module for later

### Performance management

Merijn asked for a module specifically about performance management: OGSM, OKR, KPIs, dashboarding, decision-driven dashboards ("decisions drive dashboards, not the other way around"), hard and soft skills, and explicitly leading and lagging indicators and "more of what I forgot": look at which proven, best methods exist, not only what he listed.

What exists today: `pm.perform` ("Sturen op prestaties", level 3, 16 lessons) covers KPIs and their definition, SMART goals, strategy maps and the balanced scorecard, hoshin kanri and catchball, Goodhart and gaming, the performance conversation, a performance board and a meeting rhythm. Not covered: OGSM (nowhere), OKR (one passing mention), leading and lagging indicators, dashboard design and visualisation, data quality and the measurement system, decision-first dashboards, accountability and ownership, the review cycle.

Decided by Merijn:

- A separate module for performance management, and everything that exists about it moves into it.
- It is not limited to his list: a research pass finds the proven and best methods and brings them as multiple-choice decisions.
- It comes after the two modules of Task 14.

My call (to be confirmed with the proposal, Task 15 step 2):

- **Keep the module id `pm.perform`.** Progress, medals and review boxes hang on the lesson ids, and `moduleOf` derives the module from the id prefix, so a new id would break them. The module is restructured and expanded under the same id and gets a new name ("Performance management" / "Prestatiemanagement"). Its map place stays where it is.
- Restructuring changes which topic and level a lesson sits at (every topic has exactly four lessons as levels 1 to 4). Lesson ids stay, so nothing is lost, but a learner may find a lesson unlocked or locked differently; the migration check in Task 15 step 3 covers it.
- Lessons about performance that live in other modules (earned value in `pm.run`, benefits in `pm.close` and `pm.portfolio`, the tier meeting) stay where they are unless they duplicate a lesson; the research pass lists them and Merijn decides.

Seeds for the research, not decisions: OGSM, OKR, the balanced scorecard, hoshin kanri, The 4 Disciplines of Execution, management by objectives, KPI trees and input, output and outcome measures, leading and lagging indicators, dashboard design (Few, Tufte, Knaflic, the IBCS notation), decision-first design, data quality and governance, variation and the XmR chart (Wheeler), goal-setting theory, behaviour and incentives (Goodhart, Campbell), the performance conversation, feedback cycles, team and daily management. The research may add or drop.

### Strategic module (later)

Merijn: a strategic module, part of the general project and process management area, about what a senior looks at strategically. Low priority: it goes in the plan for later, with no date and no work before Tasks 14 and 15 are done. Scope, topics and name are decided when it is picked up, from a research pass like the others (seeds, unvetted: strategy formulation and what makes strategy good or bad, portfolio and capital allocation, operating model, make-buy-partner, risk appetite, scenario thinking, leading change at scale, talking to a board). It gets its own map place and intro film then.

# v13: terugluisteren, ICT, projecten buiten je vak, layout

Asked by Merijn on 2026-11-07. Order of work: first the v10 figures still open (ledger "still to build"), then v13 in the order below. Each part ships on its own: tests and the full e2e green (e2e only when no agent is building), then push.

Standing rules:
- **Content:** a content agent writes each module and a second agent reviews it, using the clarity brief and the clarity review brief. Every term is explained and tappable. In Dutch the English term goes in parentheses; English text never gets Dutch. Numbers say what they measure. Facts are checked online and rules of thumb are hedged.
- **Levels:** every new module is built as topics × 4 levels (Basis → Werkkennis → Gevorderd → Expert), each one harder than the last, with worked examples at levels 1–2 and faded examples at 3–4. `checkTopics` enforces this.
- **Figures:** the anatomy skill draws one figure per topic wherever there is a real object or flow to show, plus the sandboxed-iframe console check.

## 1. Layout (first, because the new modules land in it)

What I see now, from the screenshots at 390 px:
- **Spreken home is very long, about 6,000 px.**
  - The next round sits at the top, then fifteen exercise tiles that all say "LEREN".
  - Below those come the Eindbaas, the Echte week, Live gesprek, the daily tasks and the programme.
  - The daily tasks drive a daily habit but sit right at the bottom. The fifteen tiles show no order or grouping.
- **Engineering home is one list of 20 modules in three tracks.**
  - Older modules carry a module level (BASIS / WERKKENNIS / GEVORDERD / EXPERT) and "0/6 lessen".
  - The Maakindustrie modules show "x/24 niveaus" and topic levels with the same four names, but those names mean something else there. That is confusing.
  - Begrippen (the glossary) and Mijn echte week sit at the very bottom.
- **Projecten will grow** from one track to three, so it needs the same structure.

Proposal:
1. **Spreken home** in four bands:
   - **Vandaag:** the next round plus the daily tasks directly under it.
   - **Oefenen:** the 15 exercises in 4 groups that fold open (Basis, Structuur, Gesprek en luisteren, Onder druk). Each group shows its progress.
   - **Uitdagen:** Eindbaas, Programma, Gerichte oefening.
   - **Echt en terugkijken:** Echte week, Live gesprek, Wat komt eraan, Terugluisteren (part 2).
   - Keep one primary button per screen.
2. **Engineering and Projecten:**
   - Track headers with progress. Within each track, modules fold open; the first open track is the one with the next step.
   - One progress unit everywhere, levels, which needs part 5.
   - The module difficulty label becomes "Instap / Verdieping / Specialist" so it no longer clashes with the topic levels.
   - Begrippen and Mijn echte week move to a compact row under the next-step card.
3. **Subject tabs** stay at three: Spreken, Engineering, Projecten. A fourth tab doesn't fit well at 390 px, so ICT goes inside them (part 3).
4. **Checks:**
   - an e2e screenshot of each home at 390 px in light and dark;
   - "one primary" assertions;
   - home height: the Spreken home is at most about 2.5 screens with all groups closed.
   - Code goes TDD for the pure parts (grouping, progress); the UI is checked in the e2e.

## 2. Terugluisteren (speaking)

What exists today:
- A setting, "Audio opnemen om terug te luisteren", off by default because of the Android microphone clash.
- An `<audio>` player on the feedback screen, straight after a round only. Nothing is saved; the recording is gone as soon as you leave.
- The calibration hint already says "Listen back to a recording before you rate", but there is no place to do that.

New:
1. **Keep recordings locally:**
   - the last 20 rounds in IndexedDB (`src/core/recordings.js`, pure helpers plus a storage adapter), with exercise, prompt, date, duration and score;
   - never synced, because of size and privacy;
   - delete per item and delete all in Instellingen;
   - recording stays opt-in, but a ready check-in will ask once.
2. **A Terugluisteren screen** (band 4 on the home):
   - the list grouped by exercise;
   - play with speed control at 1× and 1.25×.
3. **A listen-back exercise**, the actual module:
   - listen once with a short checklist: opening in one sentence, filler words, pace, clear ending, voice variation;
   - rate yourself after listening;
   - show the gap between the rating before and after listening, which feeds the existing calibration;
   - one point to improve becomes the modifier for the next round.
4. **Before and after:**
   - the same prompt, old recording against new, side by side;
   - transcripts with filler words marked (uses the existing filler detection).
5. **A short course lesson "Leren van je eigen opname"** under Spreken: why listening back works (self-observation), what to listen for, and how often.
6. **Tests:**
   - unit tests for retention (20), grouping, and the before/after calculation;
   - e2e with a fake MediaRecorder: a round, then Terugluisteren, play, the checklist, then rate.

## 3. ICT, two parts, with the focus on project work

**Placement:** the project side goes under Projecten as a new track, "Agile en IT-projecten". The technical side becomes a new Engineering track, "IT en OT", and eng.industry40 moves into it.

Projecten · Agile en IT-projecten (4 modules, the focus):
- **pm.agile · Agile en Scrum:**
  - the agile mindset and manifesto;
  - Scrum roles, events and artefacts;
  - backlog, user stories, refinement and estimating (story points, ranges);
  - Kanban and flow (WIP limit, cycle time, throughput).
- **pm.scaled · Opschalen: SAFe en verder:**
  - SAFe basics (ART, PI planning, roles such as RTE and PO/PM);
  - portfolio and Lean budgets;
  - alternatives (LeSS, Nexus, the "Spotify model" and its pitfalls);
  - hybrid: stage-gate plus agile in manufacturing.
- **pm.devops · DevOps en levering:**
  - the CI/CD pipeline and test automation;
  - DORA metrics;
  - release and environment management;
  - IT service management and incidents (ITIL in plain words).
- **pm.itproject · IT-projecten leiden:**
  - requirements and scope (MoSCoW, MVP);
  - vendor and SaaS selection and contracts;
  - ERP/MES implementation (data migration, cutover, go-live, hypercare);
  - testing and adoption (UAT, training, change).

Engineering · IT en OT (4 modules):
- **eng.itbasics · IT-fundamenten:**
  - networks (IP, LAN, VLAN, firewall);
  - servers and cloud (IaaS, PaaS, SaaS);
  - databases and SQL basics;
  - software and APIs.
- **eng.ot · IT/OT op de fabrieksvloer:**
  - the ISA-95 levels;
  - PLC, SCADA, MES and ERP, and how they talk to each other;
  - OPC UA and MQTT;
  - IT/OT convergence.
- **eng.cyber · Cybersecurity:**
  - basics (confidentiality, integrity, availability);
  - OT security under IEC 62443;
  - NIS2 and the Dutch Cyberbeveiligingswet (check the status);
  - incident response.
- **eng.industry40 · Data en digitale productie:** the existing module, moved and rebuilt as topics × levels: data quality, dashboards, integration, AI/ML basics.

**Figures:**
- a server rack and network;
- the ISA-95 pyramid as a factory with layers;
- a CI/CD pipeline as a physical line;
- a Kanban board with flow;
- PI planning (programme board).

## 4. Projecten · Projecten leiden buiten je vakgebied (new module pm.outside)

For projects whose content is too deep for him to judge. Four topics × 4 levels:
1. **Instelling:**
   - director, not expert;
   - curiosity and intellectual humility;
   - credibility without the content knowledge (ownership of the process);
   - what you never hand over: the goal, the risks, the decisions.
2. **Vragen stellen:**
   - question sets per phase: scope, assumptions, risks, estimates, dependencies;
   - "what would make this fail?" and "how do you know?";
   - checking estimates without the content knowledge (ranges, reference classes, a second estimate);
   - translating jargon back ("so what you're saying is…", with MORE PIES named as the listening framework).
3. **Werken met experts:**
   - trust and verify;
   - when experts disagree (decision criteria, a second opinion);
   - their time and motivation;
   - red flags: always "almost done", vague answers, no demo.
4. **Sturen en besluiten:**
   - measuring progress without the content knowledge (milestones with evidence, demos, definition of done);
   - making decisions under uncertainty and escalating;
   - communicating with stakeholders;
   - learning a new field fast (a 30-60-90 plan and the ten words you must know).

Situations come from his own work: an IT project at a manufacturer, an electrical project with the grid operator, an automation supplier. Each lesson has a `said` line and pushback questions, as in the other pm lessons.

## 5. Topics × levels for the remaining modules (v11 step 2)

Rebuild the older modules as topics × 4 levels so the layout has one progress unit. Order: the most-used first (flow, quality, intake, plan, run). Keep ids and progress (`progresskeep` test); existing lessons go into the right level of the topic.

## Verification for each part

- `npm test`, `node src/content/courses/validate.js` (with `checkTopics`) and `bash scripts/shellcheck.sh`.
- The full e2e, with new steps for the layout and for Terugluisteren.
- The figure console sweep.
- After each push, the live `sw.js` serves the new CACHE.

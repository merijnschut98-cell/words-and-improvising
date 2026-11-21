# Questions for Merijn's round (15 Nov)

Collected on 14–15 Nov; Merijn asked for one MC round the next day. Ask as multiple choice, recommendation first.

1. **Task 14, two new Projects modules:** the 12 MC decisions in section 4 of `docs/superpowers/reviews/2026-11-14-pm-modules-research.md` (names, topic sets, field and map place, level, naming companies, tool depth, worked runs, Power BI vs the Performance subject, brown paper placement, extras).
2. **Task 17, complete films:** decisions D1–D6 in `docs/superpowers/plans/2026-11-15-task17-complete-films.md` (scene per lesson vs per point; split films that pass 360 s; split others too; points left to reading; order; checkpoint after the pilots). Scope: 64 films change, 27 split into 101 one-lesson films, about 138 renders.
3. Open from the builds: the voice reads "Radical Candor" and "MORE PIES" only roughly (pm.lead.intro); fix with a pronunciation pass or leave (captions are right)?
- (done in PM-21: procesingenieurs now heard right)
4. **Engineering map (Task 13):** (a) split the zone "Een fabriek die goed draait" (8 modules, field film ~4 min) into "De fabriek draaiend houden" (flow, quality, maintenance, safety) and "De fabriek beter maken" (improve, spc, cost, reliability)? recommended yes; (b) the phone map is 741 px tall at 390 (26 modules; Projects 532 for 16): fine, or smaller labels / hyphenated compounds for a shorter map?; (c) under both maps the old track list ("Basis Engineering, 12 modules" …) still shows groups that differ from the zones: replace by the zones, keep, or hide?
5. **eng.power's long title** in a film station: shorter station label "Motoren en perslucht" (recommended) or a shorter module title?
- (done in PM-24: tags now heard right; edge gateway close)
6. **Process intro tank:** the procesintro draws the tank in the plant, while the energy/making field film puts line 3's tank in hall B (read as: the plant tank feeds line 3 through the wall). Keep as is (recommended) or move the tank to hall B?
7. **Tool choices to confirm (from the intro reviews):** drawings topic 4 "PID-regelaar" (Werkkennis, no Basis tool exists); gridbasics topic 1 "kVA" (a unit, chosen by the review because the load topic has no real device; omvormer dropped) and topic 3 "systeemcode" (looked up). Fine, or another tool?

## Merijn's answers (15 Nov, morning)

Task 14 (two Projects modules):
- MC1 name A: Aanpak en gereedschap / Approach and tools. MC2 name B: Werkvormen en overleggen / Formats and meetings.
- MC3 topics A as proposed (route, approach choice, choosing tools, tools at large organisations).
- MC4 topics B as proposed, but MC11: brown paper becomes a lesson inside the workshop topic (not its own topic); the freed fourth topic is "Werkvormen op de vloer" (gemba walk, interview rounds, demo and review, kaizen event as a format).
- MC5 both in "Een project van begin tot eind" (A first, B after Plan; one re-render of field film 1). MC6 A level 1, B level 2, track project.
- MC7 tool families plus sourced company names (ASML: Siemens Teamcenter/NX; Enexis: SAP S/4HANA, ServiceNow, Mendix). MC8 concepts plus one worked setup, no click paths/prices/licences/versions.
- MC9 worked runs: Planner-style board, Jira-style backlog board, Miro-style whiteboard. MC10 Power BI only as a feed (reading, where numbers come from); dashboard design goes to Performance. MC12 one Expert line each for the extras; "PMBOK Guide" without edition.

Task 17 (complete films):
- D1 one extra scene per lesson with gaps, up to 12 scenes. D2 films over the cap split into one film per lesson.
- D3 split only where forced OR where it makes a lot of sense to split (judgement per film, give the reason).
- D4 only pointers and word-for-word duplicates stay out of the film. D5 as planned (after the Engineering intros, worst first).
- D6 NO checkpoint: go straight through after the pilots.

Engineering map: split the plant zone into "De fabriek draaiend houden" (flow, quality, maintenance, safety) and "De fabriek beter maken" (improve, spc, cost, reliability), each with its own field film. Phone map height fine. Old track list under the maps: replace with the zones.
Other: station label "Motoren en perslucht"; process intro tank stays; fix "Radical Candor" and "MORE PIES" with a voice pass; no-tool rule: most tool-like term; leave the remaining hard words (Spuitgieten, MIG, FEM-plot, positioner) as they are.

## Standing rule for the rest of 15 Nov (Merijn, ~10:50 UTC)

"The rest of the day make decisions yourself unless it really needs me. Then you can ask tomorrow." Merijn is away until tomorrow. Decide and record each decision in the ledger or plan; collect only questions that truly need him, below, for one MC round on 16 Nov. Work stops at 23:59 Amsterdam.

### Questions for 16 Nov
1. **DMAIC in the Dutch voice** (pm.approach.intro): now read as letters "dee em aa ie see". Keep, or "dee-mee-ik" as some Lean people say it?
2. **Zone colour** for "De fabriek beter maken": terracotta (own token, chosen in the map review). Keep, or another colour?
3. **Convergence tool in the IT/OT intro**: "machinebouwer" (a person, the most tool-like Basis term). Keep, or another term?

### State at the stop (15 Nov 23:59 Amsterdam)

Three agents stopped on the usage limit before the stop time; their work is saved on branches, not merged:
- render-pm32 (Projects batch: lifecycle field film with seven stations, four ordinal intros, pm.approach/pm.formats intros, MORE PIES in two lesson films) — partly rendered; resume to finish, then merge (the reviewed lifecycle change d11a910 merges with it).
- render-pm33 (plant zones: eng.field.run, eng.field.better and seven intros) — partly rendered; resume to finish.
- review-pilot-cnc (opus review of Task 17 pilot P1, the cnc split into four films, branch pilot-cnc 858b88d) — review in progress.
Not yet rendered: eng.reliability.intro (reviewed, merged v357).
The hourly check-in is disabled; work resumes only when Merijn says so.

## Merijn, 16 Nov: priority now
Pro subscription (smaller budget): fewer agents at once. Priority: UI/UX so a visitor (Enexis recruiter) can navigate the site at www.vantagepoint-academy.nl and see what it contains. Decisions: a tour page ("Ik kijk rond" in the welcome + an entry on the home), no maker note, desktop layout wider (separate task after the tour page). The stopped render batches and the Task 17 pilot review wait.

## Standing rule (Merijn, 16 Nov)
Never resume or start agents on my own after a usage limit or a pause. When agents stop on a limit, report it and wait; Merijn decides when work starts again. The hourly check-in stays disabled.

## Merijn, 17 Nov: text-first Projects films
"Gewoon de volledige sessie opmaken." Projects lessons where the picture adds little become text-first: the reading is the main path, the film stays as "Bekijk de film". Difficult or visual topics keep the film. Done in v367: 18 of 40 Projects lesson films are text-first (list `src/content/courses/films/textfirst.js`, triage and rulings `2026-11-17-text-first-films.md`). Task 17 skips text-first films (no extension or split); pilot C (`pm.scaled.pi`, KEEP) is held for now, pilots A (cnc render) and B (moulding.cycle) run.

## Merijn, 18 Nov: improvement points with priority
Recorded in `2026-11-18-v18-merijn-improvements.md`; not started until Merijn says so. Three agents stopped on the usage limit on 17 Nov and wait (list in that file).

## Merijn, 21 Nov: Supabase storage over the free limit
Chose "alleen hercoderen en snoeien". Done in v376: all videos re-encoded at CRF 34 / 64k mono (2.1 GB to 1.0 GB, no visible loss), the 36 videos of the 18 text-first films and 4 stale old versions deleted; bucket now 244 objects, 1.06 GB. The render kit encodes at these settings from now on. Next renders (Task 17, joining and moulding splits) add to it again; watch the total.

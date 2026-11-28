# pm.approach: Aanpak en gereedschap / Approach and tools

Build brief and record, written 15 Nov 2026 with the first build. Plan: `docs/superpowers/plans/2026-11-15-task14-proposal.md` (module A) and Merijn's answers in `2026-11-15-questions-for-merijn.md`. Module B (`pm.formats`) and all films and figures are later steps.

## Fixed by Merijn

- Subject `pm`, track `project`, level 1 (Basis module), first place of the field "Een project van begin tot eind", first station of the road (left of Intake).
- Four topics x four levels (Basis, Werkkennis, Gevorderd, Expert), each level teaches something the lower one does not (design addendum 3). Basis: what it is and the words. Werkkennis: do one run with simple numbers. Gevorderd: choose between options for a given project, with exceptions. Expert: what a senior weighs (cost, risk, people, governance, organisation).
- Tool families with example tools; one worked setup per tool lesson: a Planner-style board at Werkkennis in "Tools kiezen", a Jira-style backlog board run in "Grote organisaties". Power BI only as a feed (reading, tracing where numbers come from); dashboard design belongs to the Performance module. Extras are one Expert line each. "PMBOK Guide" without edition. DMAIC is the Werkkennis run in "Methode". Engineering lessons are named in the text, never hard-linked.
- Company names only where a source shows it: ASML with Siemens Teamcenter and NX; Enexis with SAP S/4HANA, ServiceNow and Mendix. No prices, licences, versions or click paths.

## Lessons

| Topic | Basis | Werkkennis | Gevorderd | Expert |
|---|---|---|---|---|
| route: De route: wat eerst, wat daarna | `route` De hele route in één beeld | `takeover` Een lopend project overnemen | `tailor` Hoeveel route: op maat maken | `clientroute` De route van de klant: gates, PMO en niet beginnen |
| method: Een aanpak kiezen | `families` De methodefamilies | `dmaic` DMAIC op een klein probleem | `choose` De methode kiezen voor dit project | `translate` Werken in de methode van de klant |
| tools: Gereedschap kiezen | `toolfamilies` Toolfamilies en wanneer een tool loont | `board` Een takenbord inrichten in het eerste uur (Planner-stijl) | `toolchoice` De tool kiezen voor dit project | `toolcost` Wat een tool echt kost |
| enterprise: Gereedschap bij grote organisaties | `systems` De systemen van een grote klant | `guest` Als gast in de systemen van de klant (Jira-stijl) | `recordof` Wat leeft waar: werktool en systeem van vastlegging | `landscape` Het toollandschap als senior |

All ids are `pm.approach.<slug>`. Examples: worked at levels 1 and 2, faded at 3 and 4. Each lesson has 3 to 6 terms, 4 recall questions (one numeric where a simple calculation fits) and the pm-required pushback. English term in parentheses on first use in the Dutch text; no Dutch in the English file.

### What each level adds (the hinge per topic)

- route: Basis shows the five stages and one stage product each; Werkkennis applies it to a project that did not start with you (five questions, document order, status check, missing stage product); Gevorderd decides how much route a project needs (proportionality, merging stages, minimum governance, exceptions); Expert works inside the client's route (PMO gates, tolerances, contract before plan, the no-go decision; one line on Prosci's three-phase process).
- method: Basis names the families and what the standards are and are not (body of knowledge, method, certificate, DMAIC); Werkkennis runs DMAIC on a quote process and gives a size rule against A3 and kaizen event; Gevorderd chooses with five questions and hybrid forms; Expert translates between methods and spots method theatre (one line each on the PMBOK Guide's principles and PRINCE2's emphasis on tailoring and sustainability).
- tools: Basis says when a tool pays off and names the families; Werkkennis sets up a board (buckets by work, owner, date, done criterion, filter on overdue); Gevorderd chooses for three projects (guest access, client data, one tool per purpose, selection grid); Expert weighs sprawl, data residency, double entry, ownership after leaving, adoption (one line on AI assistants).
- enterprise: Basis names the enterprise families and the system of record; Werkkennis works as a guest (backlog board, booked hours, change calendar); Gevorderd decides what lives where and traces a number from a report (Power BI as a feed only); Expert weighs data owner, PMO power, vendor risk (one dated example), engineering change in PLM, the credible questions.

## Overlaps handled (named, not repeated)

| New lesson | Existing lesson it points to (named in the text) | How |
|---|---|---|
| route | `pm.intake.start` (De eerste weken) | Basis names it; takeover is the case it does not cover |
| tailor | `pm.intake.contracting` (Afspraken met de sponsor), `pm.plan.products` (Productgericht plannen) | pointers only |
| clientroute | `pm.plan.control` (Basislijn, toleranties en rollende planning), `pm.portfolio.gates` (Stage gates voor capex en projecten), `pm.land.change` (Wat adoptie echt drijft) | pointers; adds the client gate model and the no-go decision |
| families | `pm.plan.method` (Een werkwijze kiezen), `pm.agile.events`, `eng.improve` (module Technisch probleemoplossen, A3 and kaizen) | widens with Lean, Six Sigma and the standards; Engineering named in text |
| dmaic | `eng.improve` (module Technisch probleemoplossen) | teaches only the size rule and DMAIC |
| choose | `pm.agile.fit`, `pm.scaled.stagegate`, `pm.stuck.cynefin` | pointers; adds the five questions |
| toolfamilies | `pm.agile.stories`, `pm.plan.network` | pointers; no network logic |
| board | `pm.agile.board`, `pm.agile.wip`, `pm.run.decisions` | board as a tool; flow and decision content only pointed to |
| toolchoice | `pm.plan.network` | pointer for the dependency-heavy exception |
| toolcost | `pm.close.exit`, `pm.land.change` | pointers |
| systems | `pm.devops.incident` | pointer for ITSM words |
| guest | `pm.scaled.epics`, `pm.agile.stories`, `pm.devops.incident` | pointers |
| recordof | `eng.itbasics.reports` (module IT-fundamenten) | named for the data side; Performance owns dashboard design |
| landscape | `pm.portfolio.assurance` (Onafhankelijke toetsing en het PMO) | pointer |

## Facts, sources and hedging

Evidence: fetched = opened and read; search = seen in a search result only. Sources S1 to S31 are in `docs/superpowers/reviews/2026-11-14-pm-modules-sources.md`.

| Claim in the lessons | Source | Level | Wording |
|---|---|---|---|
| PMI's PMBOK Guide builds on principles and performance domains; processes only as non-prescriptive guidance to tailor (the current edition brought processes back in that form, so "instead of fixed processes" was cut in review) | S1, S2 | search | "PMI beschrijft"; no edition number |
| IPMA ICB: competences in people, practice and perspective | S6 | search | named as three areas, no count |
| PRINCE2 is a method; latest edition stresses tailoring, people, sustainability, works with Agile, Lean, ITIL | S4 (PeopleCert) | fetched | "volgens PeopleCert"; no edition number |
| Prosci three-phase process: prepare approach, manage change, sustain outcomes | S10 | fetched 15 Nov (phase names confirmed) | "Prosci beschrijft" |
| DMAIC phases: define, measure, analyse, improve, control; kaizen event a few days, often three to five | S7, `eng.improve.kaizen` | search | phase names only, no origin story; the ASQ attribution was cut in review (page 403, not confirmed), the duration now matches `eng.improve` |
| Tool families and example tools (Excel, Microsoft Project, Smartsheet, Planner, Trello, Jira, Azure DevOps Boards, SharePoint, Teams, Loop, Confluence, Miro, Mural, Power BI) | S15, S21 to S27, S29 | fetched/search | named as examples, "geen aanbeveling"; no plans, prices, licences |
| ASML uses Teamcenter (lifecycle management) and NX (design) | S16 (Siemens case study) | fetched | "volgens een Siemens-casus"; vendor text, read as pointer |
| Enexis: S/4HANA (2020 preparation), ServiceNow for employee workflows, 100+ Mendix apps incl. a project management app linked to SAP | S18 (SAP), S20 (Enexis careers page), S19 (Mendix) | fetched | each attributed to its source |
| Primavera P6, Clarity, Polarion as "common in the sector" | S24, S28, S30 | search | "gebruikelijk", no company claims |
| Microsoft retired Project for the web (Aug 2025, users sent to Planner) and Project Online (30 Sep 2026, past tense since review; Microsoft names Planner and Project Server Subscription Edition as destinations) | S21, S22 | fetched 15 Nov | "volgens Microsoft zelf", one dated example in `landscape` |
| Power BI report versus dashboard | S29 | search | only "read where a number comes from" |

Not used: job-ad evidence for company names (ASML Jira or Project Online, TenneT P6, Alliander SAP PS), Planview (no source), Atlassian product merger.

Practice claims (not from a source, taught as rules of thumb): the A3, kaizen event and DMAIC size rule; the five selection questions; the four-item minimum governance; the three credible questions (system of record, who feeds it, cut-off). They are worded as "als vuistregel" or as advice, never as standards.

## Evidence rules and the content guard

`tests/approach.test.js` fails the build on: currency signs, price phrases, the word licence, version numbers and product years, edition numbers after "PMBOK Guide" or "zevende/seventh edition", click paths, a company outside the allowed list, ASML or Enexis near any tool outside their allowed list, a company named outside `pm.approach.systems`. Dates of facts that age appear once (`landscape`).

## Questions: spread

69 choice questions plus 11 numeric ones (pre 16, recall 64). Answer position in both languages 18, 17, 17, 17 and identical per question. Length of the right answer among the four options, ranked longest to shortest: nl 17, 19, 17, 16 (unique longest 16 of 69); en 17, 18, 18, 16 (unique longest 16). The test allows at most 30% unique longest and 15% to 35% per rank. Every numeric question has a hint that does not contain the answer (validator).

## Terms (nl / en), defined once per module

route: route, fase, faseproduct, mandaat, sponsor / projectovername, vastgesteld plan, statuscheck, ontbrekend faseproduct / op maat maken, proportionaliteit, fasen samenvoegen, minimale governance / gatemodel van de klant, PMO, tolerantie, niet-starten-besluit. method: methodefamilie, kennisraamwerk, methode, certificaat, DMAIC / projectdefinitie, nulmeting, fasepoort, borgen / keuzecriteria, hybride vorm, opgelegde methode / methodetheater, vertalen tussen methoden, principes. tools: toolfamilie, takenbord, planningstool, backlog, samenwerkingsbord / bucket, kaart, eigenaar, klaar-criterium, label, filter op achterstand / één tool per doel, gasttoegang, klantdata, keuzematrix / toolwildgroei, dataverblijf, eigenaarschap na vertrek, adoptie. enterprise: systeem van vastlegging, ERP, PPM, PLM, ITSM, projectnummer / werkitem, epic, status van een werkitem, geboekte uren, wijzigingskalender / werktool, dubbele invoer, afsluitmoment, verversmoment, definitie van een getal / data-eigenaar, leveranciersrisico, technische wijziging, assurance.

## Wiring done in this build

`src/content/courses/index.js` (module entry, field list with `pm.approach` first, field blurb), `maps/pm.js` (a sixth lifecycle place on the wide map and the phone map; the lifecycle row is 23 units taller so a two-line label fits the film kit's label fit, the zones below moved down by 23; the object is the existing `road-stop`), `openers.pm.js` (4 topics x levels 2 to 4, nl and en), `sw.js` SHELL (both lesson files; `CACHE` not bumped).

## Open for later steps

- `intro: 'pm.approach.intro'` is not set in the index because the module intro film does not exist yet (`tests/intro.test.js` requires the page when the index names it). Set it with the film.
- The field film `pm.field.lifecycle` does not know the sixth station; `tests/filmcontent.test.js` holds the shipped film to the field without `pm.approach` through `PENDING_RERENDER`. Remove that entry when the film is re-rendered.
- Lesson films (route, board) and the module intro film are not built.

# eng.safety — Safety on the floor and in the substation (engineering, track basics, level 2, WORKED examples)
Index title: en 'Safety on the floor and in the substation' / nl 'Veilig werken op de vloer en in het station'. Blurb: en 'Risk and controls, lockout-tagout, the LMRA, electrical roles under NEN 3140, permits and learning from incidents.' / nl 'Risico’s en maatregelen, vergrendelen en labelen, de LMRA, elektrotechnische rollen volgens NEN 3140, werkvergunningen en leren van incidenten.'
Dutch/EU practice. The consultant’s role throughout: speak up, never touch, find the cause behind the shortcut. Consistent with `eng.switchgear.safety` (five safety rules, IV/WV/VP/VOP and the aanwijzing), which this module does not repeat in depth.
1. `eng.safety.risk` — hazard vs risk; RI&E (Arbowet art. 5) with plan of action; arbeidshygiënische strategie / hierarchy of controls (Arbowet art. 3); Fine and Kinney as a ranking tool, not proof of safety.
2. `eng.safety.loto` — lockout-tagout (vergrendelen en labelen): e-stop is not isolation; all energy types; steps; personal locks and group lockbox; verify zero energy; only the owner removes a lock.
3. `eng.safety.lmra` — last-minute risk analysis (VCA): who, when, the questions; right to stop work (Arbowet art. 29); the ritual trap.
4. `eng.safety.nen3140` — electrical roles: IV, WV, VP, VOP, leek; written appointment (aanwijzing); NEN 3140 (LV ≤ 1,000 V AC) vs NEN 3840 (HV); why a consultant never touches.
5. `eng.safety.permit` — permit to work: which jobs, contents, issuer and holder, shift handover and hand-back (Piper Alpha), fire watch after hot work, gas test before confined-space entry, coordinating permits.
6. `eng.safety.incidents` — near misses; Heinrich and Bird pyramids and their limits (serious and fatal events have different precursors; Texas City); just culture; reporting duty (Arbowet art. 9).

Sources
- Arbeidsomstandighedenwet (wetten.overheid.nl): art. 3 (arbeidshygiënische strategie: bron, collectief, individueel, PBM), art. 5 (RI&E and plan van aanpak), art. 9 (immediate report of accidents causing death, permanent injury or hospital admission to the Nederlandse Arbeidsinspectie; register of accidents with more than three working days’ absence), art. 14 (toetsing; lid 12: exemption for employers with as a rule at most 25 employees using a recognised branch RI&E, or at most 40 hours of paid work per week in total), art. 29 (werkonderbreking bij ernstig gevaar, no loss of pay, report immediately).
- NEN 3140 (LV operation, current edition with amendments; a revision is in draft and keeps the IV/WV/VP/VOP names — euronorm.net, “Wijzigingen NEN 3140 2026”), NEN 3840 (HV), NEN-EN 50110-1. Role definitions: Techniek Nederland “aanwijsbeleid”; nen.sulerr.com NEN 3140 role guide; Equans NEN 3140 summary for contractors.
- NEN-EN-ISO 14118:2018, Safety of machinery — Prevention of unexpected start-up.
- VCA (Veiligheid, Gezondheid en Milieu Checklist Aannemers), LMRA.
- Fine, W. T. (1971) and Kinney, G. F. and Wiruth, A. D. (1976): risk = probability × exposure × effect.
- Heinrich, H. W. (1931). Industrial Accident Prevention (1 : 29 : 300). Bird, F. E. (1969) (1 : 10 : 30 : 600).
- US Chemical Safety Board (2007) and Baker Panel (2007) on BP Texas City, 23 March 2005: 15 deaths; reliance on personal injury rates.
- Cullen, Lord (1990). The Public Inquiry into the Piper Alpha Disaster: 167 deaths on 6 July 1988; permit-to-work and shift-handover failures.
- Reason, J. (1997). Managing the Risks of Organizational Accidents; Dekker, S. (2007). Just Culture.
- Fire watch after hot work: NFPA 51B requires at least 30 minutes; Dutch insurers’ hot-work rules commonly require longer. The lesson says “the set time” in the site rule, not a number, to avoid stating a rule that varies by site.

Not stated on purpose (varies by site or uncertain): exact clearance radius for hot work, exact oxygen alarm level, Fine and Kinney category thresholds, specific Arbobesluit article numbers for machinery isolation.

## Clarity round (2026-11-04)

Every lesson now has 5 teach blocks (all ≤ 90 words), each with what you see on the floor, the typical failure modes, what experts argue about and a sharp question to ask. Every technical word is explained in the sentence where it first appears (solvent, guard, interlock, extraction, PLC, pneumatic, hydraulic, accumulator, ram, die change, gemba walk, contractor, work order, AC/DC, breaker, distribution board, arc flash, substation, earthing, confined space, issuer/holder, fire watch, SIF, lost-time injury, changeover, sponsor). Ids, pre and recall order, answer positions and numbers unchanged (recall: 270 Fine and Kinney score); the en file no longer contains Dutch words: roles are given as IV/WV/VP/VOP with the EN 50110 English names (person in control of the installation / of the work, skilled person, instructed person, layperson), “aanwijzing” is “written appointment”, the inspectorate is the Netherlands Labour Authority, Arbowet and Arbobesluit are glossed as the Working Conditions Act / Decree.

Terms (en / nl, same order): risk — Hazard / Gevaar, Risk / Risico, RI&E, Hierarchy of controls / Arbeidshygiënische strategie, Engineering control / Technische maatregel, PPE / PBM; loto — LOTO / Vergrendelen en labelen, Emergency stop / Noodstop, Isolation point / Scheidingspunt, Stored energy / Opgeslagen energie, Zero energy / Energieloos, Group lockbox / Groepsslotkast; lmra — LMRA, VCA, Contractor / Aannemer, Work order / Werkorder, Stop-work right / Werkonderbreking; nen3140 — IV, WV, VP, VOP (split from “VP and VOP”), Layperson / Leek, Written appointment / Aanwijzing; permit — Permit to work / Werkvergunning, Hot work / Heet werk, Confined space / Besloten ruimte, Issuer / Afgever, Holder / Houder (split from “Issuer and holder”), Fire watch / Brandwacht; incidents — Near miss / Bijna-ongeval, Heinrich pyramid / Piramide van Heinrich, SIF, Just culture, Reporting duty / Meldplicht, Lost-time injury / Verzuimongeval.

Safety content kept strict: LOTO order stays stop → isolate → lock (personal lock, group lockbox) → release or block stored energy → verify zero energy; only the lock owner removes a lock; abandoned-lock removal only by written procedure; an emergency stop never counts as isolation, also not under a site’s alternative method for minor jobs (that alternative needs a risk assessment showing equal protection — the EN ISO 14118 / OSHA 1910.147 “minor servicing” idea, stated without a rule number). NEN 3140 roles and the written appointment unchanged in substance; NEN 3140 scope now also states 1,500 V DC (NEN 3140 / NEN-EN 50110 low-voltage range).

Recalculations and sources added:
- Fine and Kinney: 3 × 6 × 15 = 270. Classic Kinney & Wiruth (1976) bands as used in Dutch practice: > 400 very high (consider stopping), 200–400 high (immediate correction), 70–200 substantial, 20–70 possible, < 20 small. The “not stated” note above is now partly lifted: only the top band and the band of 270 are named, as “the classic table”; sites may use their own bands.
- RI&E exemption (art. 14 lid 12): ≤ 25 employees with a recognised branch RI&E — unchanged.
- Piper Alpha (Cullen, 1990): 167 deaths on 6 July 1988; condensate pump A restarted while its pressure safety valve was removed and the opening closed by a loosely fitted blind flange (“loose cover plate”); the permit was not communicated at shift change.
- Bird (1969): 1 serious or disabling : 10 minor : 30 property damage : 600 near misses (incidents with no visible injury or damage). Heinrich (1931): 1 : 29 : 300.
- Texas City, 23 March 2005: 15 deaths in an explosion (CSB 2007).
- SIF: serious injuries and fatalities, term used in the SIF-precursor literature (Campbell Institute; Martin & Black, “Preventing serious injuries and fatalities”, Professional Safety 2015).
- Lost-time injury: injury causing absence beyond the day of the injury (common LTI definition); can be lowered by moving injured people to restricted work.
- Drive electronics: frequency-converter DC-bus capacitors keep a dangerous voltage after switch-off; the manufacturer label gives the waiting time (typically several minutes), so the text says “for minutes”.
- LMRA duration “one to three minutes”: common VCA training guidance; stated as typical, not a rule.

Facts fixed: the old LOTO recall “why” put bleeding the pressure before the mechanical block for the ram; it now says block and bleed in the safe order shown in the example (block first). Arbowet art. 29 recall now names the act in English.

Uncertain: exact wording of the Arbowet art. 29 reporting route (the text keeps the existing passive “the stop is reported to the inspectorate as soon as possible”); “many firms reassess appointments every few years” is practice, not a NEN 3140 requirement.

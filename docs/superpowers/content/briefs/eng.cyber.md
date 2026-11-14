# eng.cyber — Cybersecurity (engineering, track it, level 2)

Index entry: `{ id: 'eng.cyber', subject: 'eng', track: 'it', level: 2, title: { en: 'Cybersecurity', nl: 'Cybersecurity' }, topics: [...4], lessons: [...16 ids], questions: {...all 4} }`. It sits after `eng.itbasics` and before `eng.industry40`. If `eng.ot` lands, the order should be itbasics, ot, cyber, industry40.

Spec: section 3 of `docs/superpowers/plans/2026-11-07-v13-listen-ict-outside-layout.md` (Engineering · IT en OT, `eng.cyber`).

Learner: a Lean consultant at manufacturers. He must be able to talk with IT, OT, the board and suppliers about security risks, OT security, the new law and incidents. Every lesson is anchored in a plant: HMIs, machine builders with remote access, MES/ERP outages, a board that must sign off measures. The module does not teach how to configure anything.

## Topics and levels

| Topic (id) | 1 Basis | 2 Werkkennis | 3 Gevorderd | 4 Expert |
|---|---|---|---|---|
| Basics (`basics`) | `cia`: confidentiality, integrity, availability; threat, vulnerability, risk (chance × impact); OT priority | `phishing`: phishing, spear phishing, social engineering, CEO fraud (BEC), report button, report rate vs click rate | `mfa`: credential stuffing, password manager, passphrase (length arithmetic), MFA, MFA fatigue, phishing-resistant MFA (FIDO2/passkeys) | `leastpriv`: least privilege, RBAC, joiner-mover-leaver, privilege creep, access review, admin account, shared HMI accounts |
| OT security with IEC 62443 (`ot`) | `iec62443`: why OT differs (Stuxnet, TRITON), IACS, parts 1–4, asset owner / system integrator / product supplier, defence in depth, security in the URS | `zones`: 62443-3-2 steps, system under consideration, risk assessment, zone and conduit rules, SIS in its own zone, data diode, counting conduits | `seclevels`: SL 1–4, SL-T / SL-C / SL-A, seven foundational requirements as a vector, gap analysis, “our PLC is SL 2” | `otpatch`: remote access good practice, CVE, CVSS, CISA KEV, OT patch process (TR 62443-2-3), maintenance window, compensating controls, patch lead time |
| NIS2 and the law (`rules`) | `nis2`: NIS2 directive, the Dutch Cybersecurity Act (status and dates), duty of care, reporting, registration, NCSC, supervision, board responsibility, supply chain effect | `scope`: Annex I / II, which manufacturing is in scope, size test (medium/large, SME definition, groups), essential vs important, supply chain partner | `dutyofcare`: appropriate measures, the ten Art. 21 topics, business continuity, supply chain security, management accountability, ex post supervision, fines | `reporting`: significant incident, early warning 24 h, notification 72 h, final report 1 month, progress report, CSIRT, GDPR data breach in parallel |
| Incident response (`response`) | `ircycle`: NIST SP 800-61 phases, preparation, detection, containment, recovery, lessons learned; first actions on the floor | `prepare`: Norsk Hydro 2019, incident response plan, crisis team, out-of-band communication, playbook, manual fallback procedure, tabletop exercise | `contain`: NotPetya 2017 (M.E.Doc, EternalBlue, wiper, Maersk rebuild), EDR, SIEM, OT network monitoring, IoC, forensic evidence, eradication, log retention | `recover`: recovery order, clean restore, PLC integrity check, blameless review, root cause, improvement actions, cost and cyber insurance (Mondelez/Zurich), paying the ransom |

Levels 1–2 have worked examples and levels 3–4 faded examples (ask + reveal). Each lesson has 5 teach blocks (all ≤ 90 words) and 5–6 terms, with the en and nl `terms` lists in the same order. Each term is defined once in the module. The NL text gives the English word in parentheses for important words that are not in the lesson's terms list. The English file contains no Dutch: “Cyberbeveiligingswet” is “the Dutch Cybersecurity Act”, Staatsblad is “Bulletin of Acts and Decrees”, AP is “Dutch Data Protection Authority”, and SBI/KvK is “activity code / Chamber of Commerce”. RDI is kept as an acronym after its English name.

## Decisions

- **No duplication with eng.itbasics or eng.ot.** `itbasics.segment` already defines OT, segmentation, DMZ, zone, conduit and jump host. `itbasics.netdesign` already gives NotPetya's spread and Maersk's cost. `itbasics.backup` covers RPO/RTO and 3-2-1. This module refers back to those (“see IT fundamentals”) and goes deeper: the 62443-3-2 method, security levels, remote access rules, patching, and NotPetya as an incident response case. Zone and Conduit are defined again here with a deeper definition, because terms only have to be unique within a module. ISA-95, Purdue, PLC/SCADA/MES and OPC UA are left to `eng.ot`. `zones` names “the module IT/OT on the shop floor” for the layers and says that zones follow risk, not layers.
- **Law status hedged.** The text gives the dates as “according to the Staatsblad” and adds “check the current state with the NCSC”. The reporting channel is phrased as “the CSIRT and the regulator; check the current channel”, because the exact Dutch portal routing could not be confirmed. The size threshold uses “generally” for the exceptions. Group counting uses “often” (the SME definition). The “8,000+ organisations, fewer than half registered” figure is attributed to August 2026 reports.
- **Manufacturing scope** follows NIS2 Annex II exactly: C26, C27, C28, C29, C30 and medical devices, plus chemicals and food as separate sectors. Metal products (C25), plastics (C22) and paper are named as not listed. The text points to the NCSC decision tree and legal advice for doubtful cases.
- **Fines** are given as the NIS2 minimum maxima (Art. 34): €10M/2% essential and €7M/1.4% important, whichever is higher. The Dutch act's own maxima were not checked separately, so the text attributes them to NIS2.
- **Cases.** NotPetya is in `contain` (how it entered, why paying did not help, rebuild arithmetic) and in `recover` (insurance). Norsk Hydro is in `prepare` (manual operations, transparency, no ransom) and in `recover` (cost). Location details that sources disagree on are left out, for example where Maersk's surviving domain controller stood (Ghana vs Lagos).
- **Answer positions:** 64 multiple-choice questions (16 pre + 48 recall), 16/16/16/16 over positions 0–3. The same positions are used in en and nl, set by script. No question has its answer as the unique longest option in either language; distractors were lengthened where needed (checked by script).
- **Hints:** all 16 numeric recall questions (one per lesson) have their own `hint` (≤ 25 words, no answer). `tests/hint.test.js` passes.

## Facts and sources (checked 2026-11-08)

- Verizon 2025 DBIR: human element in ~60% of breaches (12,195 confirmed breaches studied). https://www.verizon.com/about/news/feed/2025-data-breach-investigations-report-emea and summaries, e.g. https://news.clearancejobs.com/2025/04/30/60-of-breaches-still-tied-to-human-mistakes-what-the-2025-dbir-means-for-fsos-and-leaders/
- BEC/CEO fraud “billions per year”: FBI IC3 annual reports. The text hedges it as “according to the FBI, billions of dollars worldwide each year”.
- NIST SP 800-63B: length over composition, no forced periodic change without evidence of compromise. https://pages.nist.gov/800-63-3/sp800-63b.html
- Microsoft: MFA blocks more than 99% of account compromise attacks (Microsoft security blog, 2019 “99.9%”; Microsoft research 2023 “99.22%”). The text says “more than 99%”.
- Uber 2022 breach via MFA push fatigue: widely reported (Uber security update, September 2022).
- CISA: phishing-resistant MFA (FIDO2) is the “gold standard”. CISA fact sheet “Implementing Phishing-Resistant MFA” (2022).
- Stuxnet (discovered 2010) and TRITON/Trisis (2017, safety system at a Saudi petrochemical plant): CISA/ICS-CERT reports and NIST SP 800-82 Rev. 3.
- IEC 62443 structure, roles (asset owner, integrator, product supplier), parts 2-1, 2-4, 3-2, 3-3, 4-1, 4-2; SL 1–4 attacker descriptions; SL-T/SL-C/SL-A; seven foundational requirements (IAC, UC, SI, DC, RDF, TRE, RA). Sources: IEC/ISA summaries https://syc-se.iec.ch/deliveries/cybersecurity-guidelines/security-standards-and-best-practices/iec-62443/ and the ISA-62443-3-3 preview https://www.isa.org/getmedia/d73509e9-b626-4709-a406-be6fc7616b79/ISA-62443-3-3_Preview.pdf; arXiv 1603.03710 for the SL vector. The typical SL-T 2/3 choice in plants is phrased as “in practice many plants”.
- IEC TR 62443-2-3: patch management in the IACS environment.
- CVE-2017-0144 = EternalBlue (MS17-010, patch March 2017). CISA KEV catalogue: https://www.cisa.gov/known-exploited-vulnerabilities-catalog
- Windows 7 end of extended support: 14 January 2020; paid ESU until January 2023 (Microsoft lifecycle).
- NIS2: Directive (EU) 2022/2555, OJ L 333, 27.12.2022; transposition deadline 17 October 2024. Art. 2 + Annexes I/II (scope), Art. 20 (management bodies), Art. 21 (ten measures), Art. 23 (24 h / 72 h / one month; progress report), Art. 32(5) (temporary suspension for essential entities), Art. 34 (fines). Text: https://www.springlex.eu/en/packages/nis2/nis2-directive/article-23/ and https://advisera.com/nis2/reporting-obligations/
- SME definition (Recommendation 2003/361/EC): medium means fewer than 250 staff and turnover ≤ €50M or balance sheet ≤ €43M; small means fewer than 50 staff and turnover or balance sheet ≤ €10M. NIS2 covers medium and up. Linked and partner enterprises count.
- Dutch Cybersecurity Act (Cbw): passed by the Tweede Kamer on 15 April 2026 (https://www.rijksoverheid.nl/actueel/nieuws/2026/04/15/tweede-kamer-stemt-in-met-wetsvoorstellen-cyberbeveiligingswet-en-wet-weerbaarheid-kritieke-entiteiten) and by the Eerste Kamer on 7 July 2026 (https://www.eerstekamer.nl/wetsvoorstel/36764_cyberbeveiligingswet). It is Stb. 2026, 187; the Cyberbeveiligingsbesluit and the commencement order are Stb. 2026, 189 (https://www.njb.nl/wetgeving/staatsbladen/cyberbeveiligingswet/). In force 15 August 2026 (https://rijksoverheid.nl/actueel/nieuws/2026/07/07/cyberbeveiligingswet-en-wet-weerbaarheid-kritieke-entiteiten-vanaf-15-augustus-2026-van-kracht). The ministerial regulation with thresholds for significant incidents is Stcrt. 2026, 28763. The Cbw replaces the Wbni.
- Registration with the NCSC (mijn.ncsc.nl). About 3,200 of the estimated 8,000+ organisations had registered shortly after entry into force: https://www.binnenlandsbestuur.nl/digitaal/meer-dan-helft-organisaties-niet-geregistreerd-voor-cyberwet and https://www.accountant.nl/nieuws/2026/8/cyberbeveiligingswet-van-kracht-maar-duizenden-organisaties-ontbreken-nog-in-register/
- RDI as supervisor for (much of) manufacturing; essential entities get proactive supervision, important entities after a signal. Sources: SRA, https://www.sra.nl/nieuws/004501/2026/08/de-cyberbeveiligingswet-raakt-meer-organisaties-dan-je-denkt, and Dutch IT Channel (August 2026). Hedged as “for much of manufacturing”.
- GDPR Art. 33: personal data breach to the supervisory authority (in NL the Autoriteit Persoonsgegevens) within 72 hours.
- NIST SP 800-61 phases; Rev. 3 (April 2025) maps incident response to CSF 2.0. https://csrc.nist.gov/pubs/sp/800/61/r3/final
- NotPetya, 27 June 2017: entered through a hijacked M.E.Doc update, spread with EternalBlue and harvested credentials, and was a wiper. Maersk reinstalled about 45,000 PCs and 4,000 servers (plus 2,500 applications) in about 10 days (chairman's remarks, https://www.itnews.com.au/news/maersk-had-to-reinstall-all-it-systems-after-notpetya-infection-481815). Maersk's cost was USD 250–300M (see `eng.itbasics` brief). Total damage was over USD 10bn: the US government estimate reported by Wired (Greenberg 2018), hedged as “estimated”. Mondelez v. Zurich (war exclusion) was settled in 2022; Merck won against its insurers in the New Jersey courts (2022/2023 appeal).
- Mandiant M-Trends: global median dwell time about 10 days (M-Trends 2024), 11 days (2025). Hedged as “median just over a week, often much longer”.
- Norsk Hydro, 19 March 2019, LockerGoga: about 22,000 computers at 170 sites (https://communications.sectra.com/resources/the-attack-towards-norsk-hydro-asa/). It switched to manual operations, did not pay, restored from backups and communicated openly (https://news.microsoft.com/source/features/digital-transformation/hackers-hit-norsk-hydro-ransomware-company-responded-transparency/). Hydro's own estimate of the total cost was about NOK 800M (hydro.com); earlier estimates were NOK 400–450M for Q1, 550–650M for H1 and 650–750M for the full year (February 2020). The text says “about NOK 800 million, roughly €80 million; earlier estimates were lower” (at an EUR/NOK rate of about 9.9 in 2019).
- Police and NCSC advise against paying ransom (NCSC guidance on ransomware).

## Recalculations

- cia r1: 3 × 24 = 72 h; 72 × 25,000 = 1,800,000; × 0.08 = 144,000, so 144 (thousand €). Teach: 10% × €2M = €200k/yr.
- phishing r1: 9% × 800 = 72; 72 / 4 = 18.
- mfa: 26⁸ = 208,827,064,576 ≈ 2.1 × 10¹¹; / 10¹⁰ ≈ 20.9 s (“about 21 s”). Example: 7,776⁴ = 3.656 × 10¹⁵; / 10¹⁰ = 3.66 × 10⁵ s = 4.2 days; 7,776⁵ = 2.84 × 10¹⁹, so 2.84 × 10⁹ s ≈ 90 years. r1: 26¹⁰ = 1.412 × 10¹⁴; / 10¹⁰ = 14,117 s; / 3,600 = 3.92 h, so 3.9 ±0.2.
- leastpriv: example 14 + 23 + 6 = 43; 43 / 120 = 35.8%. r1: (40 − 6) / 40 = 85%.
- iec62443 r2: 2032 − 2020 = 12.
- zones: example 7 zones, 6 conduits. r1: 1 + 1 + 5 + 1 = 8.
- seclevels: example gaps at FR1 and FR5. r1: target (2,2,2,1,3,2,2) vs achieved (2,1,2,1,2,1,2) gives gaps at FR2, FR5 and FR6, so 3.
- otpatch: example 36 / 6 = 6 stops × 6 weeks = 36 weeks. r1: 48 / 8 = 6, + 1 test = 7 stops; 7 × 4 = week 28.
- nis2 r1: 17 Oct 2024 to 17 Jul 2026 = 21 months, plus 29 days to 15 Aug ≈ 21.95, so 22 ±1.
- scope r1: (1) yes; (2) yes, turnover 25 and balance 14 are both above 10; (3) no, sector; (4) no, 40 staff and balance 8 ≤ 10 means small. Total 2.
- dutyofcare r1: 1.4% × 600M = 8.4M, which is more than 7M, so 8.4.
- reporting r1: Thu 15:00 to Sat 09:00 = 42 h; 72 − 42 = 30.
- ircycle r2: (10 − 2) × 15 × 3 = 360.
- prepare: example 400 × 0.45 × 160 = 28,800; × 4 = €115,200; no-fallback 400 × 160 × 4 = €256,000. r1: 250 × 0.30 × 320 = 24,000.
- contain: example 25 / 5 = 5, 300 / 40 = 7.5, total 12.5 days; Maersk 45,000 / 10 = 4,500 per day. r1: 23 − 14 = 9.
- recover r1: 5 × 16 × 10,000 = 800,000; + 150,000 + 90,000 = 1,040,000; − 300,000 = 740,000, so 740.

## Review round (2026-11-08)

- **Dutch fines confirmed** in the Cbw text (wetten.overheid.nl, BWBR0052872, version 15-08-2026): Art. 80 essential €10M or 2% of worldwide turnover, Art. 87 important €7M or 1.4% (whichever is higher) for breaches of Art. 21, 21a and 25–30; €1M for other breaches; Art. 93 up to €25,000 for a board member personally; Art. 78 court suspension of board members of essential entities (on request of the authority). The text now states these as the Dutch act's own maxima.
- **Reporting channel confirmed**: Cbw Art. 26–29 (24 h early warning to "haar CSIRT en haar bevoegde autoriteit", 72 h notification, interim report on request, final report one month after the notification, progress report if ongoing). Rijksoverheid (7 July 2026): report through the reporting portal. The "check the current channel" hedge is gone.
- **Supervisors** per the NCSC referral chart (Doorverwijsboom Cbw 2026): C26–C30 manufacturing: CSIRT NCSC, supervisor RDI; medical devices Z-CERT/IGJ; chemicals NCSC/ILT; food NCSC/NVWA. Text names RDI for electronics, electrical equipment, machinery and vehicles only.
- **NIST SP 800-61 Rev. 3** (April 2025) replaces the Rev. 2 (2012) life cycle with the six CSF 2.0 functions; the lesson now says so and frames the four phases as the classic cycle.
- **Mandiant dwell time**: median 10 days (2023), 11 (2024), 14 (2025, M-Trends 2026). "Just over a week" replaced.
- **Norsk Hydro** total cost "around 800 MNOK" confirmed on hydro.com (cyber-attack page).
- **IEC 62443 roles aligned with `eng.ot.governance`**: asset owner, service provider (such as the system integrator; part 2-4), product supplier. NL terms Asseteigenaar / Dienstverlener / Productleverancier as in eng.ot.
- **Patching aligned with `eng.ot.patching`**: otpatch refers back to qualified patch, patch window and compensating control; term "Maintenance window" replaced by "Virtual patching".
- **Answer lengths**: besides "never the unique longest", the correct option was the second-longest in 42 of 64 questions (en). Options in 28 questions were rewritten (mostly shorter correct answers); the answer’s length rank is now spread (en 5/18/22/19, nl 6/11/26/21, longest to shortest). Positions stay 16/16/16/16, identical in en and nl.

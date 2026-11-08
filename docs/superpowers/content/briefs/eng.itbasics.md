# eng.itbasics — IT fundamentals (engineering, track it, level 1)

Index entry: `{ id: 'eng.itbasics', subject: 'eng', track: 'it', level: 1, title: { en: 'IT fundamentals', nl: 'IT-fundamenten' }, topics: [...4], lessons: [...16 ids], questions: {...all 4} }`

Spec: section 3 of `docs/superpowers/plans/2026-11-07-v13-listen-ict-outside-layout.md` (Engineering · IT en OT). This is the first module of the new track `it` ("IT en OT" / "IT and OT"). `eng.industry40` moved into the same track (its `track` field only); `eng.ot` and `eng.cyber` follow later.

Learner: a Lean consultant at manufacturers who has to talk with IT about MES/ERP integration, a historian and the plant network. So every lesson is anchored in a plant: MES terminals, historian, ERP interface, OT network, controller with Power BI. It covers the IT words and the first questions to ask. It does not teach how to configure anything.

## Topics and levels

| Topic (id) | 1 Basis | 2 Werkkennis | 3 Gevorderd | 4 Expert |
|---|---|---|---|---|
| Networks (`network`) | `ipaddress`: IP address, private ranges, LAN, switch, subnet /24, router/default gateway, DNS, static IP vs DHCP | `vlan`: VLAN (802.1Q), firewall, rule (source, destination, port, allow/deny), default deny, ports 443/1433/502/4840, a good rule request | `segment`: IT vs OT priorities, OT lifetimes and patching, Purdue levels, DMZ, IEC 62443 zones and conduits, jump host, 4G-modem back door | `netdesign`: flat network and NotPetya, network diagram, asset inventory, bandwidth for tag data, single point of failure, redundancy and rings, measure traffic before segmenting |
| Servers and cloud (`cloud`) | `server`: server, on-prem, VM, hypervisor, cloud, ~5-year hardware life, “virtual is not redundant” | `saas`: IaaS/PaaS/SaaS (NIST), shared responsibility, latency, edge, SaaS update rhythm | `backup`: backup, restore test, RPO, RTO, 3-2-1, immutable backup, PLC programs in the backup | `availability`: availability % in hours per year, SLA and service credits, high availability, failover, store-and-forward, fallback procedure, chain availability, cost case |
| Databases and SQL (`data`) | `tables`: database, relational, table, row, column, typed columns, primary key, foreign key, normalisation, data model | `sql`: SQL, query, SELECT/FROM/WHERE, GROUP BY with SUM/COUNT/AVG, JOIN (inner drops non-matches), read-only copy | `reports`: why reports disagree: definition, period (UTC vs shift start), refresh time (data warehouse, ETL), filter; single source of truth | `datamodel`: fan-out, NULL, star schema (fact and dimension tables), data owner, clean at the source |
| Software and APIs (`software`) | `clientserver`: client-server, web application vs thick client, presentation/application/database layers, user accounts and shared logins | `api`: API, interface, REST (GET/POST over HTTP), JSON, status codes 200/400/401/404/500, ERP↔MES message pattern, middleware, real-time vs batch | `integration`: synchronous vs asynchronous, queue, retry, idempotent processing, error queue, mapping (units) | `releases`: release, semantic versioning, release notes, DTAP/OTAP, end of support (Windows 10), rollback |

Levels 1–2 have worked examples, levels 3–4 faded examples (ask + reveal). 5 teach blocks per lesson (all ≤ 90 words), 5–6 terms per lesson, en and nl `terms` lists in the same order. Each term is defined once in the module. NL text gives the English word in parentheses for important words that are not in the lesson's terms list, e.g. “de standaardgateway (default gateway)”, “wachtrij (queue)”. The English files contain no Dutch: OTAP is only mentioned in the NL file. In EN the setup is called DTAP.

## Decisions

- **Scope per topic** follows the brief: networks with the reason OT is segmented (level 3 is all about it), cloud with RPO/RTO, SQL with “why reports disagree” (level 3), APIs with versions and releases (level 4). Level 4 in each topic is where a consultant has to judge: a plant network, an availability business case, a dashboard's data model, a release plan.
- **Overlap with other modules is kept light.** Purdue/ISA-95, OPC UA and MQTT get a single mention each (`segment`, `vlan`); they are taught in `eng.ot`. IEC 62443 and NIS2 are taught in `eng.cyber`. Environments, DORA and ITIL are taught in `pm.devops`. The DMZ, segmentation and OPC UA terms also appear in `eng.industry40`'s `case` lesson. Terms only have to be unique within a module.
- **NL term choices:** “Synchrone koppeling” / “Asynchrone koppeling”, because the adjective form is what appears in the text. “Bron van waarheid”, because the text reads “één bron van waarheid” and a term starting “Eén” would not match it. “Koppeling” is used for interface and “Gereedmelding” for completion report. These are the normal Dutch words in plants.
- **Numbers kept practical:** /24 subnets only. No CIDR arithmetic beyond “/24 = 256 addresses, 254 usable”. Data volumes use 20 bytes per value, which is stated as an assumption. Availability uses 8,760 hours per year.
- **Answer positions** (pre + recall multiple choice, 65 questions): 16 / 16 / 16 / 17 over positions 0–3. The positions are the same in en and nl. No question has the correct option as the unique longest one in either language (checked by script). Distractors were lengthened, or answers shortened, where needed.
- **Hints:** each of the 15 numeric recall questions gets a usable hint. Most hints are the generated first step, a formula with `= ?` or a sum without the result. Questions whose explanation has no sum get their own `hint`: `vlan#r2` (port number), `server#r2` (VMs down) and `tables#r2` (rows to change). `tests/hint.test.js` passes.

## Facts and sources (checked 2026-11-08)

- Private IPv4 ranges 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. Source: RFC 1918 (BCP 5, 1996), https://www.rfc-editor.org/rfc/rfc1918. A /24 has 256 addresses, of which 254 are usable: the network and broadcast addresses are excluded.
- VLAN tag IEEE 802.1Q has a 12-bit VLAN ID. 0 and 0xFFF are reserved, which leaves 4,094 usable IDs. Sources: https://learn.saylor.org/mod/page/view.php?id=72262 and vendor manuals (Intel IXM5414E). The text says “in theory 4,094 usable”, because some vendors reserve more.
- Port numbers: 443 HTTPS, 1433 Microsoft SQL Server, 502 Modbus TCP, 4840 OPC UA (opcua-tcp). Source: the IANA service-name and port registry, https://www.iana.org/assignments/service-names-port-numbers. These are well-known defaults, and installations can change them.
- Modbus has no authentication. The text says “without any password check”. This is a generally known protocol property, described in the Modbus specification and in NIST SP 800-82 Rev. 3 (OT security guide).
- OT priority on availability and safety, and lifetimes of 15–25 years against 4–5 for office PCs. The lifetimes are hedged with “vaak” / “often”. Source: NIST SP 800-82 Rev. 3, https://csrc.nist.gov/pubs/sp/800/82/r3/final.
- Purdue model with the iDMZ (level 3.5) between IT and OT. The DMZ was added by practitioners and was not in the original model. Sources: https://softwaretoolbox.com/resources/what-is-purdue-model and https://sentinelone.com/cybersecurity-101/cybersecurity/what-is-the-purdue-model/. IEC 62443 zones and conduits are taken from IEC 62443-3-2 / 3-3 as summarised there; the zone is defined as a group with the same security requirements. The text keeps both on the level of a way of thinking. It does not state normative requirements.
- NotPetya, 2017: Maersk estimated its cost at 250–300 million US dollars, in its Q2 2017 interim report. The figure is widely reported, e.g. Wired, “The Untold Story of NotPetya” (2018). The text says “schatte” / “estimated”.
- NIST cloud definitions: IaaS, PaaS and SaaS are the three service models. Source: NIST SP 800-145 (Mell & Grance, September 2011), https://csrc.nist.gov/pubs/sp/800/145/final.
- Shared responsibility: in every model, identity/access and data stay with the customer. Source: Microsoft Learn, https://learn.microsoft.com/azure/security/fundamentals/shared-responsibility.
- Latency: under 1 ms inside the LAN, and 10–50 ms to a cloud region. This is a practitioner range and is hedged with “vaak … afhankelijk van afstand en verbinding” / “often … depending on distance and connection”. It is not presented as a standard.
- Server hardware replaced after about 5 years. This is marked as a rule of thumb from practice (warranty and parts).
- RPO and RTO definitions: NIST CSRC glossary, from SP 800-34 Rev. 1. RPO: https://csrc.nist.gov/glossary/term/recovery_point_objective. RTO: https://csrc.nist.gov/glossary/term/Recovery_Time_Objective.
- 3-2-1 rule: three copies, two media, one offsite. It is attributed to CISA/NIST guidance in secondary sources, e.g. https://www.nakivo.com/3-2-1-backup and the EPA guidance at https://www.epa.gov/system/files/documents/2024-07/backup-systems-necessary_0.pdf. The text calls it “een veelgebruikte vuistregel” / “a widely used rule of thumb”. Immutable copies as an answer to ransomware: https://www.eon.io/blog/3-2-1-backup (3-2-1-1-0).
- Availability arithmetic on 8,760 h/year: 99% gives 87.6 h, 99.5% gives 43.8 h, 99.9% gives 8.76 h, 99.95% gives 4.38 h, and 99.99% gives 0.876 h, about 53 min. SLA compensation is usually service credits on the monthly fee. That is typical of public cloud SLAs (e.g. Microsoft's and AWS's online SLA pages) and is phrased as “meestal” / “usually”.
- SQL has been an ANSI standard since 1986 and an ISO standard since 1987 (ISO/IEC 9075). A plain (inner) JOIN keeps only rows that match. COUNT(col) and AVG skip NULL; COUNT(*) does not. This is standard SQL behaviour.
- UTC offsets for the Netherlands: CET = UTC+1 in winter, CEST = UTC+2 in summer.
- Star schema with fact and dimension tables is the Kimball dimensional model. Power BI's guidance recommends it: https://learn.microsoft.com/power-bi/guidance/star-schema.
- REST is from Fielding (2000). HTTP status codes 200, 400, 401, 404 and 500 are defined in RFC 9110, and the IANA registry is at https://www.iana.org/assignments/http-status-codes. 401 means not authenticated.
- Middleware examples (SAP Integration Suite, MuleSoft, Boomi) are given as known names, not as recommendations.
- Semantic Versioning 2.0.0: MAJOR = incompatible API changes, MINOR = backwards-compatible features, PATCH = backwards-compatible fixes. Source: https://semver.org/. The text adds that not every supplier follows it strictly.
- Windows 10: regular support ended 14 October 2025. Windows 10 IoT Enterprise LTSC 2021 is supported until January 2032. Source: Microsoft lifecycle, https://learn.microsoft.com/en-us/lifecycle/products/windows-10-iot-enterprise, plus the Microsoft IoT blog table.

## Recalculations

- ipaddress: 2⁸ = 256, minus 2, gives 254. The example uses third octet 5 vs 8, which with /24 means a different subnet.
- vlan: OPC UA uses port 4840.
- netdesign: 2,000 × 20 B = 40,000 B/s, × 8 = 320,000 bit/s = 0.32 Mbit/s (r1). The teach rounds this to “about 0.3”. Example: 5,000 × 20 = 100,000 B/s, which is 0.8 Mbit/s; × 86,400 = 8.64 × 10⁹ B ≈ 8.6 GB/day, × 365 ≈ 3.15 TB, written as “about 3.2 TB”.
- server: 12 VMs / 3 servers = 4 down (r2).
- saas: 30 − 5 = 25 ms (r2).
- backup: pre 02:00 to 15:00 = 13 h. r1: 2.5 + 1.5 = 4 h. Example: 3 + 1 = 4 h against a target of 2 h; the RPO with 6-hourly backups is almost 6 h.
- availability: pre 0.1% × 8,760 = 8.76 h. r0: 0.005 × 8,760 = 43.8 h. Example: 0.0005 × 8,760 = 4.38, so 4.4 h; 43.8 − 4.4 = 39.4 h; 39.4 × €12,000 = €472,800, written as “about €473,000”, against €40,000.
- tables: renaming changes 1 row (r2).
- sql: 12 × 3 + 2 × 45 = 36 + 90 = 126 min (r1), COUNT 14. Teach: 10 × 2 + 60 = 80 min with COUNT 11. Example: 410 / 260 / 180 min with 9 / 31 / 4 stops.
- reports: 05:30 UTC + 2 h = 07:30, which is 7.5 (r1). Example: winter, so 00:00 UTC = 01:00 local. The DW day 01:00–01:00 against the MES day 06:00–06:00 is a 5 h shift that cancels out if both nights ran alike. The gap of 650 = 9,800 − 9,150.
- datamodel: pre 4 × 3 = 12 rows. r0: 2 × 5 = 10 rows. Example: 1,260 / 420 = 3, and 18 stops × 3 = 54 rows.
- clientserver: 24 − 6 = 18 terminals (r2).
- api: 5 × 4 / 2 = 10 interfaces (r3).
- integration: r2: 600 × 12 = 7,200, and 7,200 − 600 = 6,600 pieces. Example: 4% × 150 = 6; 6 × 40 = 240 boxes per day; × 20 days = 4,800.
- releases: 2028 − 2025 = 3 years (r2).

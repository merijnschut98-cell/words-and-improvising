// Dev tool, not shipped. Builds the explainer film "Invoering en datamigratie /
// Rollout and data migration" for the Projects course: pm.itproject.rollout and
// pm.itproject.migration (levels 1 and 2 of the topic ERP/MES invoeren: van
// migratie tot hypercare, in IT-projecten leiden).
//
//   node films/pm.itproject.migration/build.mjs            build the page
//   node films/pm.itproject.migration/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.itproject.migration.html: one offline
// page with the anatomy kit, the stage script and the player inlined. A film
// that will be rendered to video (Merijn, 2026-11-12: render every reviewed pm
// film), so all stage and card text is 22 units (films/_kit/build-film.mjs). A
// lesson with a film no longer shows its worked example (v16 notes), so the
// film carries the whole teach text and the worked example of both lessons: the
// ERP, the MES and the phases (s1), go-live, the legacy system and big bang
// (s2), phased, the pilot, MES per line and ERP per site, and the price (s3),
// timing and Hershey (s4), the dairy group's three plants (s5); then what a
// data migration moves (s6), cleansing, extract-transform-load and the mock
// migration (s7), reconciliation, who signs and what goes wrong (s8) and the
// metal parts maker's second mock migration (s9). Both lessons fit in nine
// scenes and about 760 words a language, as the UAT and MoSCoW films did with
// their two lessons; a few details stand on the cards or the strip only
// (marked "card" below), each on screen at least one beat of 4 s or more.
//
// Consistent with the reviewed films: the cutover film (pm.itproject.cutover)
// shows the last data load and the reconciliation of the go-live weekend, so
// this film stays with the migration lesson's own counts (the mock migrations,
// the 12,480 articles) and says only that the last mock migration's time goes
// into the go-live plan; go-live, key users, MES and ERP as the kit's rules say
// them (goo-laiv, em ee es or M E S, erp); stamdata through eng.ot.isa95's rule
// (stam-data); pilot through the kit's rule (pailot); Engineering as the
// post-mortem film's Entsjinieering.
//
// Checklist (lesson point: scene and beat; "card" = on the card or the strip
// only, not spoken, on screen at least 4 s; every card stays up for the rest of
// its page):
//   rollout teach 1: an ERP is the business system for orders, purchasing,
//     stock and costs, such as SAP (s1 b1); an MES is the system on the floor
//     that runs the orders per line and records what is made, used and scrapped
//     (s1 b2); introducing one runs in phases; SAP's method, SAP Activate, calls
//     the core phases prepare, explore, realize, deploy and run (s1 b3; the
//     names on the strip); get ready, compare the standard with your process,
//     build and test, switch over, keep it running (card, s1 b3 and b4); every
//     vendor uses other names, the order is the same (s1 b4)
//   rollout teach 2: go-live, the day the new system becomes the official one;
//     from then on new work goes only into it (s2 b1; new orders, stock
//     movements and confirmations said as "new work", as the lesson's own term
//     definition says it); the old one, the legacy system, is no longer used
//     for new work (s2 b2); everything points at that day, so the date is chosen
//     carefully (s2 b2)
//   rollout teach 3: two ways; big bang: all sites and departments switch on the
//     same day (s2 b3); the advantage: one switchover and no temporary links;
//     the drawback: everything at risk at once (s2 b4; "between old and new" on
//     the card's "temporary links" and the strip's lanes); a phased rollout goes
//     per site, per line or per module (s3 b1); often it starts with a pilot,
//     one site or line that goes first, so you learn before the rest follows
//     (s3 b2)
//   rollout teach 4: in factories an MES is often rolled out per line or per
//     plant; an ERP covers finance and stock for a whole company or site (card),
//     so it usually switches a whole site at once (s3 b3); phased costs extra:
//     temporary interfaces and a longer project; the price of a smaller risk per
//     step (s3 b4)
//   rollout teach 5: timing matters as much as the approach (s4 b1); in 1999 the
//     American chocolate maker Hershey went live with a new ERP just as the
//     Halloween orders came in (s4 b1), and according to CIO magazine could not
//     deliver about 100 million dollars of orders that season (s4 b2); the
//     lesson: never go live in your peak season; the sharp question: what is our
//     quietest month, and is go-live planned there? (s4 b3)
//   rollout example: a dairy group, a new MES at three plants; A 20% of the
//     volume (said), B 35%, C 45% (caption, card and the board's notes); December
//     the peak (s5 b1; the Christmas desserts on the card); option 1, big bang: all three in one weekend in October; if it goes
//     wrong 100% of production at risk, two months before the peak (s5 b2);
//     option 2, phased: A as the pilot in March, B in June, C in September; a
//     temporary interface (keeps B and C linked to the old system a few months:
//     the strip's months), the partner quotes 40,000 euros; the project six months
//     longer (s5 b3); the group chooses option 2; if the pilot goes wrong 20% at
//     risk instead of 100% (s5 b4); the lessons from A make B and C smoother
//     (card, s5 b4 and b5); C, the biggest, goes live in September, three months
//     to settle before December (s5 b5)
//   migration teach 1: data migration, moving data from the old system into the
//     new one (s6 b1); two kinds (the card's two blocks): master data, the fixed
//     information many orders use: articles, bills of materials (said; routings,
//     customers, suppliers on the card) (s6 b2); open items, what is in progress
//     on go-live day: open orders, stock, unpaid invoices (s6 b3); history, such
//     as orders from past years, usually not migrated; it stays readable in the
//     old system or an archive (s6 b4)
//   migration teach 2: before you move data, you clean it (s7 b1, "first");
//     data cleansing: removing duplicates, articles nobody has used for years,
//     wrong units and empty fields; rubbish in the old system becomes rubbish in
//     the new (s7 b1); cleaning is work for the business, the people who own the
//     data (s7 b2; purchasing for suppliers and engineering for bills of
//     materials on the card); IT can show what is wrong but cannot know which of
//     two near-identical articles is the real one (s7 b2)
//   migration teach 3: three steps: extract, transform, load (s7 b3; the English
//     names on the card and the strip); rehearsed in a mock migration, a trial
//     run into a test environment; each trial cleaner and faster; the last one
//     timed exactly, because that time goes into the go-live weekend plan (s7 b4)
//   migration teach 4: after every load the reconciliation: compare the numbers
//     in old and new and explain every difference; how many went out, came in,
//     were rejected and why? (s8 b1); does the stock value in euros match, and
//     the quantities per warehouse? (card, s8 b2); the business signs off, not
//     IT: a controller for the stock value, a planner for the open orders (s8 b2)
//   migration teach 5: what often goes wrong: the migration starts late, cleaning
//     only at the third trial, a few weeks before go-live; no time left, dirty
//     data goes live "to be fixed later" (s8 b3); the sharp question at every
//     project meeting: how many records failed in the last mock migration, and
//     who owns fixing them? (s8 b4)
//   migration example: a metal parts maker, a new ERP, the second mock migration
//     (s9 b1); the old system 12,480 articles, 2,530 unused for five years go to
//     the archive (card and strip; said "the unused articles"), so 9,950 to move
//     (s9 b1); 9,871 arrive, 9,950 − 9,871 = 79 rejected (s9 b2); 52 with no unit,
//     27 with a drawing number that already exists (s9 b2: the two causes said,
//     the counts on the card and in the caption); stock value old €4,212,000, new
//     €4,198,500 (card and strip), a difference of €13,500 (s9 b3), 0.32% (card
//     and caption), exactly the stock of the 79 rejected articles (s9 b3);
//     engineering fixes the 27 duplicates, purchasing fills in the 52 units, each
//     with a date before the third mock migration; the target: 0 rejected and €0
//     difference, signed off by the controller (s9 b4)
//   Not in the film: the lessons' pre and recall questions, their "said"
//   lines, situations and sayIt (practice, not teach text).
//
// Facts as the lessons credit them, and no more: SAP Activate as SAP's method
// with the five core phases; Hershey's go-live in 1999 as the Halloween orders
// came in, and about 100 million dollars of orders not delivered that season,
// according to CIO magazine. Nothing else is credited to a source; every count
// is the lessons' own and asserted below (20 + 35 + 45 = 100; October and
// September two and three months before December; 12,480 − 2,530 = 9,950;
// 9,950 − 9,871 = 79 = 52 + 27; €4,212,000 − €4,198,500 = €13,500, 0.32%).
//
// The drawing is the shared pm world (films/_pm/world.mjs, read-only here) as a
// project room: on the back wall a whiteboard whose notes are first the three
// plants' volume (A 4, B 7, C 9 notes, white while on the old system, filled
// once live), then records (master data, open items, history in grey, the
// rejected ones in the accent); next to it an archive cabinet; a table with two
// laptops (the legacy system and the new one), a stack of printouts and the
// reconciliation sheet. People: you (the consultant, at the board), the planner
// (signs for the open orders), the partner and the controller (the Scrum film's
// figures, pm.agile.scrum/cast.mjs, imported, not edited) and the team lead
// from the floor (the MES's lines). At the top right a panel with one card per
// scene, labelled "schema" or "voorbeeld". Along the bottom a strip: the
// systems and SAP Activate's phases, the go-live line, the three plants as
// lanes, the months, what moves, extract-transform-load, the mock migrations,
// the reconciliation sum and the 12,480 articles.
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below), and so are the people, the
// props, the board's notes and each part of the strip.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { NARRATION_WPS, MAX_TOTAL } from '../_kit/assert.mjs';
import { beatStarts, minSceneDur, wordsOf, sayable } from '../_kit/timeline.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';
import { scrumPerson } from '../pm.agile.scrum/cast.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// What the film states, asserted against the lessons' current text (the build
// fails if one drifts); the {n:...} numbers are then checked against the Dutch
// lesson text by defineFilm.
const RO = 'pm.itproject.rollout';
const MI = 'pm.itproject.migration';
const lessons = await allLessons();
const FAILS = [];
const assert = (ok, what) => { if (!ok) FAILS.push(what); };
const textOf = (id, lang) => { const l = lessons[lang].get(id); return `${l.teach.join('\n')}\n${l.example.text}\n${l.example.ask || ''}\n${l.example.reveal || ''}`; };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(RO, ['Een ERP is het bedrijfssysteem voor orders, inkoop, voorraad en kosten, zoals SAP',
  'Een MES is het systeem op de vloer dat de orders per lijn aanstuurt en registreert wat er gemaakt, verbruikt en afgekeurd wordt',
  'Invoeren gaat in fases. De methode van SAP, SAP Activate, noemt de kernfases prepare, explore, realize, deploy en run: voorbereiden, de standaard naast je proces leggen, bouwen en testen, omschakelen, en draaiend houden. Elke leverancier gebruikt andere namen; de volgorde is dezelfde',
  'De go-live is de dag dat het nieuwe systeem het officiële wordt: vanaf dan gaan nieuwe orders, voorraadmutaties en terugmeldingen alleen nog in het nieuwe systeem. Het oude, het legacysysteem, wordt niet meer gebruikt voor nieuw werk',
  'Alles in het project wijst naar die dag. Daarom kies je de datum zorgvuldig',
  'Big bang: alle vestigingen en afdelingen schakelen op dezelfde dag om. Het voordeel: één omschakeling, en geen tijdelijke koppelingen tussen oud en nieuw. Het nadeel: alles staat tegelijk op het spel',
  'Een gefaseerde invoering gaat per vestiging, per lijn of per module. Vaak begint die met een pilot: één vestiging of lijn die voorgaat, zodat je leert voordat de rest volgt',
  'In fabrieken wordt een MES vaak per lijn of per fabriek ingevoerd. Een ERP omvat financiën en voorraad voor een heel bedrijf of een hele vestiging, dus dat schakelt meestal een hele vestiging tegelijk om',
  'Gefaseerd kost extra: tijdelijke koppelingen tussen oude en nieuwe systemen, en een langer project. Dat is de prijs van een kleiner risico per stap',
  'De timing telt net zo zwaar als de aanpak. In 1999 ging de Amerikaanse chocolademaker Hershey live met een nieuw ERP precies toen de bestellingen voor Halloween binnenkwamen, en kon volgens het blad CIO dat seizoen voor zo’n 100 miljoen dollar aan orders niet leveren',
  'De les: ga nooit live in je piekseizoen. Een scherpe vraag: “Wat is onze rustigste maand, en staat de go-live daar gepland?”',
  'Een zuivelgroep voert een nieuw MES in bij drie fabrieken. Fabriek A maakt 20% van het volume, B 35% en C 45%. December is de piek, met de kerstdesserts',
  'Optie 1, big bang: alle drie de fabrieken schakelen in één weekend in oktober om. Gaat het mis, dan staat 100% van de productie op het spel, twee maanden voor de piek',
  'Optie 2, gefaseerd: A als pilot in maart, B in juni, C in september. Een tijdelijke koppeling houdt B en C een paar maanden verbonden met het oude systeem; de partner offreert daar € 40.000 voor, en het project duurt zes maanden langer',
  'De groep kiest optie 2. Gaat de pilot mis, dan staat 20% van het volume op het spel in plaats van 100%, en de lessen uit A maken B en C soepeler. C, de grootste, gaat in september live, met drie maanden om te stabiliseren voor december']);
says(MI, ['Datamigratie is het verhuizen van data uit het oude systeem naar het nieuwe. Er zijn twee soorten. Stamdata zijn de vaste gegevens die veel orders gebruiken: artikelen, stuklijsten, routings, klanten, leveranciers. Open posten zijn wat op de dag van de go-live onderweg is: open orders, voorraad, onbetaalde facturen',
  'Historie, zoals orders van vorige jaren, wordt meestal niet gemigreerd. Die blijft leesbaar in het oude systeem of in een archief',
  'Voordat je data verhuist, ruim je op. Data opschonen betekent dubbelingen weghalen, artikelen die al jaren niemand gebruikt, verkeerde eenheden en lege velden. Rommel in het oude systeem wordt rommel in het nieuwe',
  'Opschonen is werk voor de business, de mensen die eigenaar zijn van de data, zoals inkoop voor leveranciers en engineering voor stuklijsten. IT kan laten zien wat er mis is, maar kan niet weten welke van twee bijna gelijke artikelen het echte is',
  'De migratie zelf gaat in drie stappen: de data uit het oude systeem halen (extract), omzetten naar de nieuwe structuur (transform), en in het nieuwe systeem laden (load)',
  'Dat oefen je meerdere keren in een proefmigratie: een proefrun naar een testomgeving. Elke proef is schoner en sneller dan de vorige. De laatste proef wordt precies getimed, want die tijd gaat in het draaiboek van het go-liveweekend',
  'Na elke lading volgt de afstemming (reconciliation): de getallen in het oude en het nieuwe systeem vergelijken en elk verschil verklaren. Hoeveel artikelen gingen eruit, hoeveel kwamen erin, hoeveel zijn geweigerd en waarom? Klopt de voorraadwaarde in euro’s? Kloppen de aantallen per magazijn?',
  'De business tekent voor het resultaat, niet IT. Een controller tekent voor de voorraadwaarde, een planner voor de open orders',
  'Wat vaak misgaat: de migratie begint laat, en het opschonen begint pas bij de derde proef, een paar weken voor de go-live. Dan is er geen tijd meer, en gaat vuile data live “om later op te lossen”',
  '“Hoeveel records zijn er bij de laatste proefmigratie mislukt, en wie is eigenaar van het oplossen?”',
  'Een maker van metalen onderdelen gaat over op een nieuw ERP. Dit is de tweede proefmigratie',
  'Opschonen: het oude systeem heeft 12.480 artikelen. 2.530 zijn vijf jaar niet gebruikt en gaan naar het archief. Er moeten er dus 9.950 mee',
  'Laden: er komen er 9.871 aan. 9.950 − 9.871 = 79 geweigerd. De oorzaak: 52 hebben geen eenheid, 27 hebben een tekeningnummer dat al bestaat',
  'Voorraadwaarde: het oude systeem zegt € 4.212.000, het nieuwe € 4.198.500. Het verschil is € 13.500, 0,32%. Dat blijkt precies de voorraad van de 79 geweigerde artikelen te zijn',
  'Actie: engineering lost de 27 dubbelingen op, inkoop vult de 52 eenheden in, elk met een datum voor de derde proefmigratie. Het doel voor die proef: 0 geweigerd en een voorraadverschil van € 0, getekend door de controller']);
says(RO, ['SAP’s method, SAP Activate, calls the core phases prepare, explore, realize, deploy and run', 'according to CIO magazine could not deliver about 100 million dollars of orders that season',
  'A temporary interface keeps B and C linked to the old system for a few months'], 'en');
says(MI, ['Master data is the fixed information that many orders use', 'Data cleansing means removing duplicates', 'You rehearse that several times in a mock migration: a trial run into a test environment',
  'A finance controller signs for the stock value, a planner for the open orders', 'A metal parts maker is moving to a new ERP. This is the second mock migration'], 'en');
assert(lessons.nl.get(RO).terms.map((t) => t.term).join() === 'Go-live,Legacysysteem,Big bang,Gefaseerde invoering,Pilot', 'the five terms of rollout (nl)');
assert(lessons.en.get(RO).terms.map((t) => t.term).join() === 'Go-live,Legacy system,Big bang,Phased rollout,Pilot', 'the five terms of rollout (en)');
assert(lessons.nl.get(MI).terms.map((t) => t.term).join() === 'Datamigratie,Stamdata,Data opschonen,Proefmigratie,Afstemming', 'the five terms of migration (nl)');
assert(lessons.en.get(MI).terms.map((t) => t.term).join() === 'Data migration,Master data,Data cleansing,Mock migration,Reconciliation', 'the five terms of migration (en)');
for (const lang of ['nl', 'en']) for (const id of [RO, MI]) {
  const f = lessons[lang].get(id).film;
  assert(!f || f === 'pm.itproject.migration', `${id} (${lang}) has film ${f}: never overwrite another film`);
}
// the dairy group: the volume per plant; October and September before the December peak
const VOL = { A: 20, B: 35, C: 45 };
assert(VOL.A + VOL.B + VOL.C === 100, '20 + 35 + 45 = 100');
const MONTH = { mar: 3, jun: 6, sep: 9, oct: 10, dec: 12 };
assert(MONTH.dec - MONTH.oct === 2 && MONTH.dec - MONTH.sep === 3, 'October is two months before December, September three');
// the metal parts maker
const ALL = 12480;
const ARCH = 2530;
const MOVE = ALL - ARCH;
const ARRIVED = 9871;
const REJ = MOVE - ARRIVED;
assert(MOVE === 9950 && REJ === 79 && 52 + 27 === REJ, '12,480 - 2,530 = 9,950; 9,950 - 9,871 = 79 = 52 + 27');
const DIFF = 4212000 - 4198500;
assert(DIFF === 13500 && Math.round((DIFF / 4212000) * 10000) / 100 === 0.32, '4,212,000 - 4,198,500 = 13,500, 0.32%');
if (FAILS.length) throw new Error(`model:\n  ${FAILS.join('\n  ')}`);

// ---------------------------------------------------------------- the world
const W = 640;
const H = 400;
const AZ = 58;
const ROOM = { w: 280, d: 220, h: 220 };
const RW = 326; // the room's window on the stage: x 0..326, y 0..290
const RH = 290;
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, RW, RH, { pad: 6, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;
const r1 = (v) => Math.round(v * 10) / 10;

// the whiteboard: four columns (a header bar each and a divider), the notes
// drawn by stage.js into "notesIn" in the board's face plane (u = x, v = -z);
// nine short rows, so plant C's nine notes fit in one column
const BX0 = 40;
const BX1 = 196;
const BOARD = w.board({ x0: BX0, x1: BX1, z0: 100, z1: 196 });
const NOTES = { u0: BX0 + 9, du: 37, v0: -184, dv: 8.6, w: 20, h: 6.2 };
const heads = [0, 1, 2, 3].map((c) => `<path class="pm-rule" style="stroke-width:1.6" d="M${NOTES.u0 + c * NOTES.du} -189H${NOTES.u0 + c * NOTES.du + NOTES.w}"/>`).join('')
  + [1, 2, 3].map((c) => `<path class="pm-rule" d="M${NOTES.u0 + c * NOTES.du - 8.5} -191V-104"/>`).join('');
assert(NOTES.v0 + 8 * NOTES.dv + NOTES.h <= -104, 'nine rows of notes fit on the board');
const boardSvg = cueG('board', BOARD.svg + `<g transform="${BOARD.face}">${heads}</g>`);
const notesSvg = cueG('notes', `<g transform="${BOARD.face}">${g('notesIn', '')}</g>`);
// the archive cabinet against the back wall, two drawers with a handle each
const CAB = { x: 212, y: 4, w: 40, d: 26, r: 1 };
const cabinet = w.box(CAB, 0, 31, { tone: 'mid' }, { steps: 2, bevel: 0.4 }) + w.box(CAB, 33, 64, { tone: 'mid' }, { steps: 2, bevel: 0.4 })
  + w.box({ x: CAB.x + 14, y: CAB.y + CAB.d, w: 12, d: 2, r: 0.6 }, 20, 23, { tone: 'hi' }, { steps: 2 })
  + w.box({ x: CAB.x + 14, y: CAB.y + CAB.d, w: 12, d: 2, r: 0.6 }, 52, 55, { tone: 'hi' }, { steps: 2 });
const TABLE = { x: 72, y: 112, w: 160, d: 66, h: 74 };
const TZ = TABLE.h;
const SHEET = w.sheet({ x: 168, y: 140, z: TZ, lines: 6 });
const printouts = w.stack({ x: 82, y: 148, z: TZ, n: 6 });
const world = [
  w.room(ROOM),
  boardSvg,
  notesSvg,
  cueG('archive', cabinet),
  w.person({ x: 20, y: 54, role: 'jij', along: 'x', reach: [44, 6, 150] }),
  w.person({ x: 112, y: 84, role: 'planner', along: 'x' }),
  scrumPerson(w, k, G, P, { x: 186, y: 80, key: 'partner', look: 'dev2', along: 'x' }),
  w.table(TABLE),
  cueG('oldsys', w.laptop({ x: 112, y: 132, z: TZ, toward: 1 })),
  cueG('newsys', w.laptop({ x: 150, y: 132, z: TZ, toward: 1 })),
  printouts,
  cueG('sheet', SHEET.svg),
  w.cup(214, 168, TZ),
  scrumPerson(w, k, G, P, { x: 258, y: 148, key: 'controller', look: 'sm', along: 'y' }),
  w.person({ x: 120, y: 214, role: 'teamlead', along: 'x' }),
].join('');
for (const r of ['jij', 'planner', 'teamlead', 'partner', 'controller', 'board', 'notes', 'archive', 'oldsys', 'newsys', 'sheet']) assert(world.includes(`data-cue="${r}"`), `${r} is a cue group`);
if (FAILS.length) throw new Error(`model:\n  ${FAILS.join('\n  ')}`);

// ---------------------------------------------------------------- the panel and the strip (stage space)
// One card per scene, drawn by stage.js into these groups; each block of a card
// sits in its own cue group, so a beat's focus (and a term's cue) can light it.
const PX = 328;
const PW = 304;
const CUES = ['erp', 'mes', 'phases', 'names',
  'golive', 'legacy', 'bang', 'bangpm',
  'phased', 'pilot', 'meserp', 'price',
  'hershey', 'cio', 'peak', 'askt',
  'dairy', 'opt1', 'opt2', 'chosen', 'settle',
  'dm', 'master', 'open', 'hist',
  'clean', 'biz', 'etl', 'biz2', 'mock',
  'recon', 'sign', 'wrong', 'askm',
  'metal', 'load', 'value', 'action'];
// the strip: row A at ya, row B at yb; three lanes (the plants) from lane0, laneH
// apart, the bar from bar0 to bar1; twelve months from m0, mw apart
const STRIP = { y0: 294, y1: 396, ya: 302, yb: 348, lane0: 300, laneH: 31, bar0: 50, bar1: 616, m0: 20, mw: 50 };
const SPARTS = ['sSys', 'sPhase', 'sGo', 'sLanes', 'sPilot', 'sLink', 'sMonths', 'sPeak', 'sOpt1', 'sOpt2',
  'sKinds', 'sOpen', 'sHist', 'sClean', 'sEtl', 'sMock', 'sRecon', 'sSign', 'sLate', 'sCount', 'sLoaded', 'sValue'];
assert(STRIP.lane0 + 3 * STRIP.laneH - 5 <= STRIP.y1 - 4 && STRIP.m0 + 12 * STRIP.mw - 4 <= 628, 'the strip stays inside its panel');
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="10" width="${PW}" height="278" rx="10"/>`
  + g('pHead', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''))
  + g('strip', `<rect class="pm-panel" x="8" y="${STRIP.y0}" width="624" height="${STRIP.y1 - STRIP.y0}" rx="10"/>`
  + SPARTS.map((c) => cueG(c, g(c, ''))).join(''));
// Static paths with relative line-tos (the helper of pm.itproject.cutover):
// the same points, fewer bytes; each rewrite is read back.
function compactPath(d) {
  const tok = d.match(/[MLZ]|-?\d*\.?\d+/g);
  const n = (v) => { const a = Math.abs(v); const t = `${Math.floor(a / 10)}${a % 10 ? `.${a % 10}` : ''}`.replace(/^0\./, '.'); return (v < 0 ? '-' : '') + t; };
  let out = '';
  let cmd = '';
  let cur = [0, 0];
  let start = [0, 0];
  let last = '';
  const put2 = (c, nums) => {
    let s = c === last && c === 'l' ? '' : c;
    nums.forEach((v, i) => { const t = n(v); s += (i === 0 && s === '' && !t.startsWith('-') && out && /[\d.]$/.test(out)) || (i > 0 && !t.startsWith('-')) ? ` ${t}` : t; });
    out += s;
    last = c;
  };
  for (let i = 0; i < tok.length;) {
    if (/[MLZ]/.test(tok[i])) { cmd = tok[i++]; if (cmd === 'Z') { put2('Z', []); cur = start; } continue; }
    const p = [Math.round(Number(tok[i]) * 10), Math.round(Number(tok[i + 1]) * 10)];
    i += 2;
    if (cmd === 'M') { put2('M', p); cur = p; start = p; cmd = 'L'; } else { put2('l', [p[0] - cur[0], p[1] - cur[1]]); cur = p; }
  }
  return out;
}
function pointsOf(d) {
  const tok = d.match(/[MLZlz]|-?\d*\.?\d+/g);
  const out = [];
  let cmd = '';
  let cur = [0, 0];
  let start = [0, 0];
  for (let i = 0; i < tok.length;) {
    if (/[MLZlz]/.test(tok[i])) { cmd = tok[i++]; if (/[Zz]/.test(cmd)) { out.push('Z'); cur = start; } continue; }
    const v = [Math.round(Number(tok[i]) * 10), Math.round(Number(tok[i + 1]) * 10)];
    i += 2;
    cur = cmd === 'l' ? [cur[0] + v[0], cur[1] + v[1]] : v;
    if (cmd === 'M') { start = cur; cmd = 'L'; out.push('M'); }
    out.push(cur.join());
  }
  return out.join(' ');
}
const compact = (html) => html.replace(/ d="([MLZ\d.\s-]+)"/g, (m, d) => {
  if (/\.\d\d/.test(d)) return m;
  const c = compactPath(d);
  if (pointsOf(c) !== pointsOf(d)) throw new Error(`compactPath changed a path: ${d.slice(0, 60)}`);
  return ` d="${c}"`;
});
const svg = compact(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">`
  + `<clipPath id="mi-room"><rect x="0" y="0" width="${RW}" height="${RH}"/></clipPath>`
  + `<g clip-path="url(#mi-room)">${g('world', world)}</g>${g('hud', hud)}</svg>`);

// ---------------------------------------------------------------- cameras (one gentle move per scene)
// [cx, cy, s]: the stage point (cx, cy) stays put while the room scales by s
const AT = (p) => w.at(p).map(r1);
const BOARD_AT = AT([118, 0, 150]);
const TABLE_AT = AT([150, 145, TZ]);
const CTRL_AT = AT([240, 150, 120]);
const MID = [RW / 2, RH / 2, 1];
const CAM = [
  { from: MID, to: [TABLE_AT[0], TABLE_AT[1], 1.08] },
  { from: [TABLE_AT[0], TABLE_AT[1], 1.04], to: [BOARD_AT[0], BOARD_AT[1] + 30, 1.1] },
  { from: [BOARD_AT[0], BOARD_AT[1] + 20, 1.06], to: [BOARD_AT[0], BOARD_AT[1] + 30, 1.14] },
  { from: MID, to: [BOARD_AT[0] - 20, BOARD_AT[1] + 40, 1.08] },
  { from: [BOARD_AT[0], BOARD_AT[1] + 30, 1.04], to: MID },
  { from: MID, to: [TABLE_AT[0], TABLE_AT[1], 1.1] },
  { from: [BOARD_AT[0], BOARD_AT[1] + 30, 1.04], to: [TABLE_AT[0] + 20, TABLE_AT[1], 1.12] },
  { from: [TABLE_AT[0], TABLE_AT[1], 1.04], to: [CTRL_AT[0], CTRL_AT[1], 1.1] },
  { from: [BOARD_AT[0], BOARD_AT[1] + 20, 1.1], to: MID },
];

// ---------------------------------------------------------------- the film
const C = { CUES, SPARTS, STRIP, NOTES, CAM_N: CAM.length };
const sc = (id, lesson, level, title, beats) => ({ id, lesson, level, still: 0.9, title, beats });
const spec = {
  id: 'pm.itproject.migration',
  title: { nl: 'Invoering en datamigratie', en: 'Rollout and data migration' },
  lessons: [RO, MI],
  strictFocus: true,
  scenes: [
    sc('s1', RO, 1, { nl: 'ERP, MES en fases', en: 'ERP, MES and phases' }, [
      { nl: 'Een ERP is het bedrijfssysteem voor orders, inkoop, voorraad en kosten, zoals SAP.', en: 'An ERP is the business system for orders, purchasing, stock and costs, such as SAP.', focus: ['erp', 'sSys', 'newsys'] },
      { nl: 'Een MES stuurt de orders per lijn en registreert wat er gemaakt, verbruikt en afgekeurd wordt.', en: 'An MES runs the orders per line and records what is made, used and scrapped.', focus: ['mes', 'sSys', 'teamlead'] },
      { nl: 'Invoeren gaat in fases. SAP Activate noemt ze prepare, explore, realize, deploy en run.', en: 'It runs in phases. SAP Activate calls them prepare, explore, realize, deploy and run.', focus: ['phases', 'sPhase'] },
      { nl: 'Elke leverancier gebruikt andere namen; de volgorde is dezelfde.', en: 'Every vendor uses other names; the order is the same.', focus: ['names', 'sPhase'] },
    ]),
    sc('s2', RO, 1, { nl: 'Go-live en big bang', en: 'Go-live and big bang' }, [
      { nl: '{t:Go-live|Go-live}: het nieuwe systeem wordt het officiële. Nieuw werk gaat alleen nog daarin.', en: '{t:Go-live|Go-live}: the new system becomes the official one. New work goes only into it.', cue: { 'Go-live': 'golive' }, focus: ['golive', 'sGo', 'newsys'] },
      { nl: 'Het {t:Legacysysteem|legacysysteem} is niet meer voor nieuw werk. Kies de datum zorgvuldig.', en: 'The {t:Legacy system|legacy system} is no longer for new work. Choose the date carefully.', cue: { Legacysysteem: 'legacy' }, focus: ['legacy', 'oldsys'] },
      { nl: '{t:Big bang|Big bang}: alle vestigingen en afdelingen schakelen op dezelfde dag om.', en: '{t:Big bang|Big bang}: all sites and departments switch on the same day.', cue: { 'Big bang': 'bang' }, focus: ['bang', 'sLanes', 'notes'] },
      { nl: 'Voordeel: één omschakeling, geen tijdelijke koppelingen. Nadeel: alles tegelijk op het spel.', en: 'Upside: one switchover, no temporary links. Downside: everything at risk at once.', focus: ['bangpm'] },
    ]),
    sc('s3', RO, 1, { nl: 'Gefaseerd, met een pilot', en: 'Phased, with a pilot' }, [
      { nl: '{t:Gefaseerde invoering|Gefaseerde invoering}: per vestiging, per lijn of per module.', en: '{t:Phased rollout|Phased rollout}: per site, per line or per module.', cue: { 'Gefaseerde invoering': 'phased' }, focus: ['phased', 'sLanes'] },
      { nl: '{t:Pilot|Pilot}: één vestiging of lijn gaat voor, zodat je leert voordat de rest volgt.', en: '{t:Pilot|Pilot}: one site or line goes first, so you learn before the rest follows.', cue: { Pilot: 'pilot' }, focus: ['pilot', 'sPilot', 'notes'] },
      { nl: 'Een MES gaat vaak per lijn of fabriek; een ERP schakelt meestal een hele vestiging tegelijk om.', en: 'An MES often goes per line or plant; an ERP usually switches a whole site at once.', focus: ['meserp', 'teamlead'] },
      { nl: 'Gefaseerd kost extra: tijdelijke koppelingen en een langer project. De prijs van minder risico.', en: 'Phased costs extra: temporary interfaces and a longer project. The price of less risk.', focus: ['price', 'partner'] },
    ]),
    sc('s4', RO, 1, { nl: 'De timing', en: 'The timing' }, [
      { nl: 'In 1999 ging Hershey live met een nieuw ERP, precies toen de Halloweenorders binnenkwamen.', en: 'In 1999 Hershey went live with a new ERP just as the Halloween orders came in.', focus: ['hershey', 'sMonths', 'sPeak'] },
      { nl: 'Volgens het blad CIO kon Hershey dat seizoen voor zo’n {n:100} miljoen dollar aan orders niet leveren.', en: 'According to CIO magazine, Hershey could not deliver about {n:100} million dollars of orders that season.', focus: ['cio'] },
      { nl: 'Ga nooit live in je piekseizoen. Vraag: wat is de rustigste maand, en staat de go-live daar?', en: 'Never go live in your peak season. Ask: what is the quietest month, and is go-live planned there?', focus: ['peak', 'askt', 'jij'] },
    ]),
    sc('s5', RO, 1, { nl: 'Voorbeeld: drie fabrieken', en: 'Example: three plants' }, [
      { nl: 'Een zuivelgroep, nieuw MES in drie fabrieken: A {n:20}%, B {n:35}%, C {n:45}% van het volume. Piek in december.', en: 'A dairy group, a new MES at three plants: A {n:20}%, B {n:35}%, C {n:45}% of the volume. Peak in December.', focus: ['dairy', 'notes', 'sPeak'] },
      { nl: 'Optie {n:1}, big bang in één weekend in oktober: {n:100}% van de productie op het spel.', en: 'Option {n:1}, big bang in one weekend in October: {n:100}% of production at risk.', focus: ['opt1', 'sOpt1', 'notes'] },
      { nl: 'Optie {n:2}, gefaseerd: A maart, B juni, C september. Koppeling € {n:40000}, zes maanden langer.', en: 'Option {n:2}, phased: A March, B June, C September. Interface €{n:40000}, six months longer.', focus: ['opt2', 'sOpt2', 'partner'] },
      { nl: 'Gekozen: optie {n:2}. Gaat de pilot mis, dan staat {n:20}% op het spel in plaats van {n:100}%.', en: 'Chosen: option {n:2}. If the pilot goes wrong, {n:20}% is at risk instead of {n:100}%.', focus: ['chosen', 'notes'] },
      { nl: 'C, de grootste, volgt in september: drie maanden om te stabiliseren voor december.', en: 'C, the biggest, follows in September: three months to settle before December.', focus: ['settle', 'sOpt2'] },
    ]),
    sc('s6', MI, 2, { nl: 'Wat verhuist er', en: 'What moves' }, [
      { nl: '{t:Datamigratie|Datamigratie}: data uit het oude systeem naar het nieuwe verhuizen.', en: '{t:Data migration|Data migration}: moving data from the old system into the new one.', cue: { Datamigratie: 'dm' }, focus: ['dm', 'oldsys', 'newsys', 'sKinds'] },
      { nl: '{t:Stamdata|Stamdata}: vaste gegevens die veel orders gebruiken, zoals artikelen en stuklijsten.', en: '{t:Master data|Master data}: fixed information many orders use, such as articles and bills of materials.', cue: { Stamdata: 'master' }, focus: ['master', 'sKinds', 'notes'] },
      { nl: 'Open posten: wat op de go-live onderweg is, zoals open orders, voorraad en onbetaalde facturen.', en: 'Open items: what is in progress at go-live, such as open orders, stock and unpaid invoices.', focus: ['open', 'sOpen', 'notes'] },
      { nl: 'Historie gaat meestal niet mee: die blijft leesbaar in het oude systeem of in een archief.', en: 'History is usually not migrated: it stays readable in the old system or in an archive.', focus: ['hist', 'sHist', 'archive'] },
    ]),
    sc('s7', MI, 2, { nl: 'Opschonen, laden, oefenen', en: 'Clean, load, rehearse' }, [
      { nl: '{t:Data opschonen|Data opschonen}: dubbelingen, ongebruikte artikelen, foute eenheden en lege velden weg.', en: '{t:Data cleansing|Data cleansing}: removing duplicates, unused articles, wrong units and empty fields.', cue: { 'Data opschonen': 'clean' }, focus: ['clean', 'sClean', 'notes'] },
      { nl: 'Dat is werk voor de business, de eigenaren van de data. IT ziet wat er mis is, niet wat echt is.', en: 'That is work for the business, who own the data. IT shows what is wrong, not which is real.', focus: ['biz', 'biz2', 'planner'] },
      { nl: 'De migratie in drie stappen: uit oud halen, omzetten naar de nieuwe structuur, en laden.', en: 'The migration in three steps: extract from the old, transform to the new structure, and load.', focus: ['etl', 'sEtl'] },
      { nl: '{t:Proefmigratie|Proefmigratie}: een proefrun naar een testomgeving. De laatste wordt getimed.', en: '{t:Mock migration|Mock migration}: a trial run into a test environment. The last one is timed.', cue: { Proefmigratie: 'mock' }, focus: ['mock', 'sMock', 'partner'] },
    ]),
    sc('s8', MI, 2, { nl: 'Afstemming', en: 'Reconciliation' }, [
      { nl: '{t:Afstemming|Afstemming}: de getallen in oud en nieuw vergelijken en elk verschil verklaren.', en: '{t:Reconciliation|Reconciliation}: comparing the numbers in old and new, and explaining every difference.', cue: { Afstemming: 'recon' }, focus: ['recon', 'sRecon', 'sheet'] },
      { nl: 'De business tekent, niet IT: de controller voor de voorraadwaarde, de planner voor open orders.', en: 'The business signs off, not IT: the controller for the stock value, the planner for open orders.', focus: ['sign', 'sSign', 'controller', 'planner'] },
      { nl: 'Vaak mis: de migratie begint laat, het opschonen pas bij de derde proef. Vuile data gaat live.', en: 'Often wrong: the migration starts late, cleaning only at the third trial. Dirty data goes live.', focus: ['wrong', 'sLate'] },
      { nl: 'Vraag: hoeveel records mislukten bij de laatste proefmigratie, en wie lost ze op?', en: 'Ask: how many records failed in the last mock migration, and who owns fixing them?', focus: ['askm', 'jij'] },
    ]),
    sc('s9', MI, 2, { nl: 'Voorbeeld: de tweede proef', en: 'Example: the second trial' }, [
      { nl: 'Nieuw ERP, tweede proef: van {n:12480} artikelen gaan er {n:2530} naar het archief. Mee: {n:9950}.', en: 'New ERP, second trial: of {n:12480} articles, {n:2530} go to the archive. To move: {n:9950}.', focus: ['metal', 'sCount', 'archive'] },
      { nl: 'Aangekomen: {n:9871}, dus {n:79} geweigerd: {n:52} zonder eenheid, {n:27} met een bestaand tekeningnummer.', en: 'Arrived: {n:9871}, so {n:79} rejected: {n:52} with no unit, {n:27} with an existing drawing number.', focus: ['load', 'sLoaded', 'notes'] },
      { nl: 'Voorraadwaarde: € {n:13500} verschil, {n:0.32}%: precies de voorraad van de {n:79} geweigerde artikelen.', en: 'Stock value: €{n:13500} difference, {n:0.32}%: exactly the stock of the {n:79} rejected articles.', focus: ['value', 'sValue', 'controller'] },
      { nl: 'Engineering en inkoop lossen het op voor de derde proef. Doel: {n:0} geweigerd, € {n:0} verschil.', en: 'Engineering and purchasing fix them before the third trial. Target: {n:0} rejected, €{n:0} difference.', focus: ['action', 'controller', 'notes'] },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lessons' teach
// text and worked examples, so every point of the checklist above is said here
// or shown on the card. No symbol the voice would read aloud, no spoken
// parenthesis or quote; few colons and comma lists (Piper pauses long at them).
// Dutch checked with espeak-ng phonemes through Piper's own bridge (nl,
// 2026-11-13). New SAY rules in films/_kit/timeline.mjs (tested; recomputed for
// every film: no other film's spoken text changes): SAP Activate's English
// phase names (pri-peer, ek-sploor, rie-je-laaiz; run as ran), legacysysteem
// (legge-sie-systeem), big bang (big beng), Hershey (Hur-sjie), Halloween
// (Hellowien), Activate (Ektiveet), business as biznis in this film's two
// phrases, Engineering (Entsjinieering, as the post-mortem film), proefrun
// (proef-ran), records (rekkords), getimed (getaimd), timing (taiming) and live
// as laiv in "nooit live" and "data live". go-live, MES, ERP, stamdata, pilot and piekseizoen
// through the kit's existing rules; English needs nothing new (MES as letters
// through the kit's rule). ERP needs no rule: espeak-ng spells it (ee er pee)
// with a word after it, as the other films' voices say it; never before a full
// stop, where it reads the word "erp".
const SAY = [
  [ // s1 ERP and MES; the phases
    { nl: 'Een ERP is het bedrijfssysteem voor orders en inkoop, voorraad en kosten, zoals SAP.',
      en: 'An ERP is the business system for orders and purchasing, stock and costs, such as SAP.' },
    { nl: 'Een MES is het systeem op de vloer. Het stuurt de orders per lijn aan en registreert wat er gemaakt, verbruikt en afgekeurd wordt.',
      en: 'An MES is the system on the floor. It runs orders per line and records what is made, used and scrapped.' },
    { nl: 'Invoeren gaat in fases. De methode van SAP, SAP Activate, noemt de kernfases prepare, explore, realize, deploy en run.',
      en: 'It runs in phases. SAP\'s method, SAP Activate, calls the core phases prepare, explore, realize, deploy and run.' },
    { nl: 'Elke leverancier gebruikt andere namen; de volgorde is dezelfde.',
      en: 'Every vendor uses other names; the order is the same.' },
  ],
  [ // s2 go-live and the legacy system; big bang
    { nl: 'De {t:Go-live|go-live} is de dag dat het nieuwe systeem het officiële wordt. Vanaf dan gaat nieuw werk alleen nog daarin.',
      en: '{t:Go-live|Go-live} is the day the new system becomes the official one. From then on new work goes only into it.' },
    { nl: 'Het oude, het {t:Legacysysteem|legacysysteem}, wordt niet meer gebruikt voor nieuw werk. Alles wijst naar die dag, dus kies je de datum zorgvuldig.',
      en: 'The old one, the {t:Legacy system|legacy system}, is no longer used for new work. Everything points at that day, so choose the date carefully.' },
    { nl: 'Er zijn twee manieren. Bij een {t:Big bang|big bang} schakelen alle vestigingen en afdelingen op dezelfde dag om.',
      en: 'There are two ways. In a {t:Big bang|big bang}, all sites and departments switch on the same day.' },
    { nl: 'Het voordeel is één omschakeling, zonder tijdelijke koppelingen. Het nadeel is dat alles tegelijk op het spel staat.',
      en: 'The advantage is one switchover, with no temporary links. The drawback is that everything is at risk at once.' },
  ],
  [ // s3 phased and the pilot; MES and ERP; the price
    { nl: 'Een {t:Gefaseerde invoering|gefaseerde invoering} gaat per vestiging, per lijn of per module.',
      en: 'A {t:Phased rollout|phased rollout} goes per site, per line or per module.' },
    { nl: 'Vaak begint die met een {t:Pilot|pilot}: één vestiging of lijn die voorgaat, zodat je leert voordat de rest volgt.',
      en: 'It often starts with a {t:Pilot|pilot}: one site or line that goes first, so you learn before the rest follows.' },
    { nl: 'In fabrieken gaat een MES vaak per lijn of per fabriek. Een ERP schakelt meestal een hele vestiging tegelijk om.',
      en: 'In factories an MES often goes per line or per plant. An ERP usually switches a whole site at once.' },
    { nl: 'Gefaseerd kost extra, met tijdelijke koppelingen en een langer project. Dat is de prijs van een kleiner risico per stap.',
      en: 'Phased costs extra, with temporary interfaces and a longer project. That is the price of a smaller risk per step.' },
  ],
  [ // s4 timing: Hershey; the question
    { nl: 'De timing telt net zo zwaar. In negentien negenennegentig ging de Amerikaanse chocolademaker Hershey over op een nieuw ERP, precies toen de bestellingen voor Halloween binnenkwamen.',
      en: 'Timing matters as much. In nineteen ninety-nine the American chocolate maker Hershey went live with a new ERP just as the Halloween orders came in.' },
    { nl: 'Volgens het blad CIO kon Hershey dat seizoen voor zo\'n honderd miljoen dollar aan orders niet leveren.',
      en: 'According to CIO magazine, Hershey could not deliver about a hundred million dollars of orders that season.' },
    { nl: 'Ga dus nooit live in je piekseizoen. Vraag daarom wat de rustigste maand is, en of de go-live daar gepland staat.',
      en: 'So never go live in your peak season. Ask which month is the quietest, and whether go-live is planned there.' },
  ],
  [ // s5 the dairy group
    { nl: 'Een zuivelgroep voert een nieuw MES in bij drie fabrieken. A maakt twintig procent van het volume. December is de piek.',
      en: 'A dairy group brings a new MES into three plants. Plant A makes twenty percent of the volume. December is the peak.' },
    { nl: 'Optie één is een big bang in één weekend in oktober. Gaat het mis, dan staat alle productie op het spel, twee maanden voor de piek.',
      en: 'Option one is a big bang in one weekend in October. If it goes wrong, all production is at risk, two months before the peak.' },
    { nl: 'Optie twee is gefaseerd, A als pilot in maart, B in juni, C in september. Een tijdelijke koppeling kost veertigduizend euro, en het project duurt zes maanden langer.',
      en: 'Option two is phased, A as the pilot in March, B in June, C in September. A temporary interface costs forty thousand euros, and the project runs six months longer.' },
    { nl: 'De groep kiest optie twee. Gaat de pilot mis, dan staat twintig procent op het spel in plaats van honderd.',
      en: 'The group chooses option two. If the pilot goes wrong, twenty percent is at risk instead of a hundred.' },
    { nl: 'C, de grootste, volgt in september, met drie maanden om te stabiliseren voor december.',
      en: 'C, the biggest, follows in September, with three months to settle before December.' },
  ],
  [ // s6 data migration: master data, open items, history
    { nl: '{t:Datamigratie|Datamigratie} is data uit het oude systeem naar het nieuwe verhuizen.',
      en: '{t:Data migration|Data migration} is moving data from the old system into the new one.' },
    { nl: '{t:Stamdata|Stamdata} zijn de vaste gegevens die veel orders gebruiken, zoals artikelen en stuklijsten.',
      en: '{t:Master data|Master data} is the fixed information many orders use, such as articles and bills of materials.' },
    { nl: 'Open posten zijn wat op de dag van de go-live onderweg is, zoals open orders, voorraad en onbetaalde facturen.',
      en: 'Open items are what is in progress on go-live day, such as open orders, stock and unpaid invoices.' },
    { nl: 'Historie, zoals orders van vorige jaren, gaat meestal niet mee. Die blijft leesbaar in het oude systeem of in een archief.',
      en: 'History, such as orders from past years, is usually not migrated. It stays readable in the old system or in an archive.' },
  ],
  [ // s7 cleansing; the business owns it; extract, transform, load; the mock migration
    { nl: 'Eerst {t:Data opschonen|data opschonen}: dubbelingen weghalen, ongebruikte artikelen, verkeerde eenheden en lege velden. Rommel in het oude systeem wordt rommel in het nieuwe.',
      en: 'First comes {t:Data cleansing|data cleansing}, removing duplicates, unused articles, wrong units and empty fields. Rubbish in the old system becomes rubbish in the new.' },
    { nl: 'Dat is werk voor de business, de eigenaren van de data. IT ziet wat er mis is, maar niet welke van twee bijna gelijke artikelen het echte is.',
      en: 'That is work for the business, who own the data. IT shows what is wrong, but not which of two near-identical articles is the real one.' },
    { nl: 'De migratie zelf heeft drie stappen: uit het oude systeem halen, omzetten naar de nieuwe structuur, en laden.',
      en: 'The migration itself has three steps: extract from the old system, transform to the new structure, and load.' },
    { nl: 'Dat oefen je in een {t:Proefmigratie|proefmigratie}, een proefrun naar een testomgeving. Elke proef is schoner en sneller, en de laatste wordt getimed voor het draaiboek van de go-live.',
      en: 'You rehearse that in a {t:Mock migration|mock migration}, a trial run into a test environment. Each trial is cleaner and faster, and the last is timed for the go-live plan.' },
  ],
  [ // s8 reconciliation; who signs; what goes wrong; the question
    { nl: 'Na elke lading volgt de {t:Afstemming|afstemming}: de getallen in oud en nieuw vergelijken en elk verschil verklaren. Hoeveel ging eruit, hoeveel kwam erin, wat is geweigerd en waarom?',
      en: 'After every load comes {t:Reconciliation|reconciliation}: comparing the numbers in old and new and explaining every difference. How many went out, how many came in, what was rejected and why?' },
    { nl: 'Voor het resultaat tekent de business, niet IT. De controller tekent voor de voorraadwaarde, de planner voor de open orders.',
      en: 'The business signs off on the result, not IT. The controller signs for the stock value, the planner for the open orders.' },
    { nl: 'Vaak begint de migratie laat, en het opschonen pas bij de derde proef. Dan is er geen tijd meer, en gaat vuile data live om later op te lossen.',
      en: 'Often the migration starts late, and cleaning only at the third trial. Then there is no time left, and dirty data goes live to be fixed later.' },
    { nl: 'Vraag in elk projectoverleg hoeveel records er bij de laatste proef mislukt zijn, en wie eigenaar is van het oplossen.',
      en: 'Ask at every project meeting how many records failed in the last trial, and who owns fixing them.' },
  ],
  [ // s9 the metal parts maker
    { nl: 'Een maker van metalen onderdelen gaat over op een nieuw ERP, en dit is de tweede proefmigratie. De ongebruikte artikelen gaan naar het archief, dus moeten er negenduizend negenhonderdvijftig mee.',
      en: 'A metal parts maker moves to a new ERP; this is its second mock migration. Unused articles go to the archive, so nine thousand nine hundred and fifty should move.' },
    { nl: 'Er komen er negenduizend achthonderdeenenzeventig aan, dus negenenzeventig zijn geweigerd: geen eenheid, of een tekeningnummer dat al bestaat.',
      en: 'Nine thousand eight hundred and seventy-one arrive, so seventy-nine are rejected: no unit, or a drawing number that already exists.' },
    { nl: 'De voorraadwaarde verschilt dertienduizend vijfhonderd euro. Dat is precies de voorraad van de geweigerde artikelen.',
      en: 'The stock value differs by thirteen thousand five hundred euros. That is exactly the stock of the rejected articles.' },
    { nl: 'Engineering lost de dubbelingen op, inkoop vult de eenheden in, elk met een datum voor de derde proef. Het doel is nul geweigerd en nul euro verschil, getekend door de controller.',
      en: 'Engineering fixes the duplicates, purchasing fills in the units, each with a date before the third trial. The target is zero rejected and zero euros difference, signed off by the controller.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, no
// digits in the voice, and none of the words espeak-ng misreads (see above);
// checked on the text after the SAY rules, so a word a rule rewrites passes
// and a misread one fails the build
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = {
  nl: /\b(prepare|explore|realize|legacysysteem|big bang|Hershey|Halloween|Activate|business|Engineering|proefrun|records|getimed|timing telt|go-live|key users?|Eén)\b|\b(nooit|data) live\b|\bERP\./i,
  en: /\bMES\b/,
};
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const said = sayable(plainSay(line[lang]), lang);
  if (/[/&×÷=+()“”"‘…%€$<>~≈−]|:\S|\d/.test(said)) throw new Error(`narration: a symbol or digit the voice reads aloud in "${said.slice(0, 50)}"`);
  if (MISREAD[lang].test(said)) throw new Error(`narration: "${MISREAD[lang].exec(said)[0]}" is misread by the ${lang} voice in "${said.slice(0, 60)}"`);
}
// each scene's length from its share of the narration (the longer of nl and
// en, at the kit's 2.5 words a second), never shorter than its captions need;
// the whole as long as the narration estimate, within the 300 s cap, no padding
{
  const said = SAY.map((s) => Math.max(...['nl', 'en'].map((lang) => s.reduce((a, l) => a + wordsOf(sayable(plainSay(l[lang]), lang)), 0))));
  const all = said.reduce((a, b) => a + b, 0);
  const TOTAL = Math.min(MAX_TOTAL, Math.round(all / NARRATION_WPS));
  spec.scenes.forEach((s, si) => {
    const cap = Math.max(...['nl', 'en'].map((lang) => minSceneDur(wordsOf(s.beats.map((b) => plainSay(b[lang])).join(' ')) + 4)));
    s.dur = Math.max(Math.ceil(cap), Math.floor((said[si] / all) * TOTAL));
  });
  // the seconds lost to rounding down go to the scenes that lost the most
  const left = TOTAL - spec.scenes.reduce((a, s) => a + s.dur, 0);
  spec.scenes.map((s, si) => [si, (said[si] / all) * TOTAL - s.dur]).sort((x, y) => y[1] - x[1])
    .slice(0, Math.max(0, left)).forEach(([si]) => { spec.scenes[si].dur += 1; });
  const total = spec.scenes.reduce((a, s) => a + s.dur, 0);
  if (total > MAX_TOTAL) throw new Error(`film is ${total} s, over ${MAX_TOTAL} (words per scene ${said.join(' ')}, all ${all})`);
}
// each beat's still (reduced motion) sits late in its own share of the scene;
// and every beat holds at least 4 s in both languages, so a card-only point is
// on screen long enough to read
{
  const resolved = resolveFilm(spec, lessons);
  resolved.scenes.forEach((rs, si) => {
    const st = beatStarts(rs, 'nl');
    spec.scenes[si].beats.forEach((b, bi) => {
      const a0 = st[bi] / rs.dur;
      const a1 = bi + 1 < st.length ? st[bi + 1] / rs.dur : 1;
      b.still = Math.round((a0 + 0.86 * (a1 - a0)) * 1000) / 1000;
    });
    for (const lang of ['nl', 'en']) {
      const s2 = beatStarts(rs, lang);
      s2.forEach((t, bi) => { const len = (bi + 1 < s2.length ? s2[bi + 1] : rs.dur) - t; if (len < 4) FAILS.push(`${rs.id} beat ${bi + 1} (${lang}) holds ${len.toFixed(1)} s, under 4 s`); });
    }
  });
  if (FAILS.length) throw new Error(`pacing:\n  ${FAILS.join('\n  ')}`);
}

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="jij"],[data-cue="planner"],[data-cue="teamlead"],[data-cue="partner"],[data-cue="controller"])';
const css = PM_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-blk{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-pass{fill:color-mix(in srgb,var(--fp-accent) 45%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:.5}
.pm-barpass{fill:color-mix(in srgb,var(--fp-accent) 45%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:1.2}
.pm-over{fill:color-mix(in srgb,var(--fp-accent) 30%,transparent);stroke:var(--fp-accent);stroke-width:1.4;stroke-dasharray:4 3}
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.pm-mark{fill:none;stroke:var(--fp-accent);stroke-width:3;stroke-linecap:round}
.pm-note{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:.5}
.pm-def{fill:color-mix(in srgb,var(--fp-accent) 30%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:.5}
.pm-hotnote{fill:var(--fp-accent);stroke:var(--fp-accent);stroke-width:.5}
.pm-grey{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:.4}
[data-cue][data-on] .pm-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-blk,[data-cue][data-on] .pm-grey{fill:var(--anatomy-face);stroke:var(--fp-focus);stroke-width:2.4}
[data-cue][data-on] .pm-barpass,[data-cue][data-on] .pm-over{fill:var(--anatomy-face);stroke:var(--fp-focus);stroke-width:2.4}
[data-cue][data-on] .pm-line{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-note,[data-cue][data-on] .pm-def,[data-cue][data-on] .pm-pass,[data-cue][data-on] .pm-hotnote{stroke:var(--fp-focus-text);stroke-width:.8}
[data-cue][data-on] .pm-on{fill:var(--fp-focus-text)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.run.conflict) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
`;

const label = {
  nl: 'Een projectruimte voor een ERP- en MES-invoering. Aan de achterwand een whiteboard met kaartjes: eerst het volume van drie fabrieken, wit op het oude systeem en gevuld als ze live zijn, later records: stamdata, open posten, grijze historie en geweigerde records. Ernaast een archiefkast. Op tafel twee laptops, het legacysysteem en het nieuwe, een stapel prints en het vel van de afstemming. Jij, de adviseur in petrol, staat bij het bord; de planner met een tablet, de partner met een laptop, de controller aan het eind van de tafel en de teamleider van de vloer. Rechts een paneel met per scène een kaart, gemarkeerd als schema of voorbeeld. Onderaan een strook: de systemen en de fases van SAP Activate, de go-live, de drie fabrieken als banen, de maanden, wat er verhuist, extract, transform en load, de proefmigraties, de afstemming en de 12.480 artikelen.',
  en: 'A project room for an ERP and MES rollout. On the back wall a whiteboard with notes: first the volume of three plants, white on the old system and filled once live, later records: master data, open items, grey history and rejected records. Next to it an archive cabinet. On the table two laptops, the legacy system and the new one, a stack of printouts and the reconciliation sheet. You, the consultant in petrol, stand at the board; the planner with a tablet, the partner with a laptop, the controller at the end of the table and the team lead from the floor. At the right a panel with one card per scene, marked as diagram or example. Along the bottom a strip: the systems and the phases of SAP Activate, the go-live, the three plants as lanes, the months, what moves, extract, transform and load, the mock migrations, the reconciliation and the 12,480 articles.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  const words = (lang) => data.scenes.reduce((a, s) => a + s.beats.reduce((n, b) => n + b.voice[lang].split(/\s+/).filter(Boolean).length, 0), 0);
  console.log(`narration words: nl ${words('nl')}, en ${words('en')}`);
  // every font size on the stage: drawing and script
  const sizes = new Set([...`${svg}\n${readFileSync(join(HERE, 'stage.js'), 'utf8')}`.matchAll(/font-size="(\d+)"/g)].map((m) => Number(m[1])));
  if ([...sizes].some((s) => s < 22)) throw new Error(`stage text under 22 units: ${[...sizes].join(', ')}`);
  console.log(`stage font sizes: ${[...sizes].join(', ')}`);
}

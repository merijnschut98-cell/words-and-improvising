// Dev tool, not shipped. Builds the explainer film "MoSCoW en een MVP /
// MoSCoW and an MVP" for the Projects course: pm.itproject.requirements and
// pm.itproject.mvp (levels 1 and 2 of the topic Requirements en scope in
// IT-projecten leiden).
//
//   node films/pm.itproject.mvp/build.mjs            build the page
//   node films/pm.itproject.mvp/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.itproject.mvp.html: one offline page
// with the anatomy kit, the stage script and the player inlined. A film that
// will be rendered to video (Merijn, 2026-11-12: render every reviewed pm
// film), so all stage and card text is 22 units (films/_kit/build-film.mjs).
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.9
// (pm.itproject.mvp, P2, 90 s: requirements and scope; "requirements sorted
// into four bins, the MVP cut line"). Storyboard drift: the plan's 90 s are
// about 290 s in nine scenes, because a lesson with a film no longer shows its
// worked example (v16 notes), so the film carries the teach text and the
// example of both lessons: what a requirement is and how to write one (s1 to
// s4) and MoSCoW and the MVP (s5 to s9). The storyboard's beats are there: the
// requirements sorted into four bins (s5 to s7, on the board and the cards)
// and the MVP cut line (s8 b3, s9 b6), drawn on the board between the Must
// bin and the rest, and on the card through the bar of 300 person-days.
// pm.itproject.fitgap (level 3, fit-to-standard) has six terms and a faded
// example of its own; with it the narration would run far past 760 words, so
// it is not served.
//
// Terms follow the backlog film (films/pm.agile.backlog, reviewed): the
// ordered list is a "gesorteerde lijst", a requirement is never called a
// story or a Product Backlog item here (the lessons don't); scope is said as
// pm.plan.wbs and pm.run.scope say it (the scope rule in the kit), and the
// Lean-consultant as pm.negotiate.batna says it.
//
// Checklist (lesson point: scene and beat; "card" = on the card only, not
// spoken, on screen at least 4 s; every card stays up for the rest of its page):
//   requirements teach 1: a requirement, something the new system must do or
//     be, written so you can check it later (s1 b1); the basis for the vendor's
//     quote, the tests and the acceptance (s1 b2); two kinds: functional, what
//     the system does, blocks a batch quality has not released (s1 b3);
//     non-functional, how well, speed, availability, security, the label prints
//     within 3 seconds of the last box being weighed (s1 b4)
//   requirements teach 2: start from the process, not the screens; the to-be
//     process, how the work runs after go-live, step by step (s2 b1); per step,
//     what the system must do (s2 b2); from the old system you get a wish list,
//     everything the old screens did plus every irritation of ten years, the old
//     system in new colours with its detours (s2 b3)
//   requirements teach 3: a good requirement is testable; "user-friendly" is
//     not, nobody can say pass or fail (s2 b4); after one hour of training a new
//     operator records a line stop in under 30 seconds (s2 b5); an ID, a source
//     and later a priority; the ID comes back in the test scripts and the
//     contract, so you can trace a line (s2 b6), the source is who asked and why
//     (card)
//   requirements teach 4: written by the people who know the work, planners,
//     operators, quality staff, with a business analyst who translates between
//     the business and IT and writes it down precisely (s3 b1); solutions
//     disguised as requirements, an Excel export of all orders (s3 b2); the real
//     need, tomorrow's orders per line with their materials, maybe without
//     Excel (s3 b3)
//   requirements teach 5: what goes wrong: two big workshops, nobody checks
//     against the to-be process, the vendor quotes on 300 vague lines (s3 b4);
//     every vague line becomes an argument whether it was in scope, the agreed
//     content of the project (s3 b5); the sharp question, which step or decision
//     gets better; if nobody can say, probably habit, not need (s3 b6)
//   requirements example: a meat products plant replaces its MES, the system
//     that runs the orders on the floor and records production (s4 b1, records
//     production on the card); three workshops with planners, shift leaders and
//     quality, 240 wishes (s4 b1, who on the card); step 1, 60 duplicates, 180
//     left (s4 b2); step 2, the Excel export becomes R-031, tomorrow's orders per
//     line with materials and stock (s4 b3; R-031 and what it says on the card); step 3, fast
//     labels become R-047, non-functional, within 3 seconds in 95 of 100 tests
//     (s4 b4, R-047 on the card); step 4, 36 lines serve no step, parked (s4
//     b5); result 144 requirements with an ID, a source and a test (s4 b6)
//   mvp teach 1: MoSCoW, four bins: Must have, Should have, Could have, Won't
//     have this time (s5 b1); the two o's only to make it pronounceable (s5
//     b2); Dai Clegg, 1994, at Oracle, for development projects with little time
//     (s5 b3); later a fixed part of DSDM, an agile project method now kept by
//     the Agile Business Consortium (s5 b4); the most common way to prioritise
//     in ERP and MES projects (s5 b5)
//   mvp teach 2: a Must have, without which go-live makes no sense, or is unsafe
//     or illegal; DSDM calls the Musts the Minimum Usable SubseT (s6 b1); the
//     test question, do we postpone go-live; "no, we would work around it", then
//     not a Must (s6 b2); a Should have, important, a workaround possible for a
//     while (s6 b3); a Could have, nice to have, goes first when time runs short
//     (s6 b4)
//   mvp teach 3: Won't have this time, agreed not to deliver now (s7 b1); on the
//     list anyway, so everyone sees it was discussed and it does not creep back
//     in through the side door (s7 b2); DSDM's rules of thumb: Musts typically
//     no more than 60 % of the effort, Coulds around 20 % (s7 b3); the Coulds are
//     the reserve (s7 b4); everything a Must: the scope cannot absorb a setback,
//     the date or the budget breaks (s7 b5)
//   mvp teach 4: MVP, minimum viable product, Frank Robinson 2001 (s8 b1); Eric
//     Ries made it famous with The Lean Startup, 2011, the smallest version that
//     lets you learn the most from real users (s8 b2, 2011 on the card); in ERP
//     and MES used more loosely, the smallest scope to go live with on a real
//     line; the MVP cut line, the line in the sorted list above which everything
//     must be ready for go-live (s8 b3)
//   mvp teach 5: the whole process thin but complete, order in, produce, label,
//     ship, invoice (s8 b4); half the screens of every step is no MVP, nobody
//     can work with it (s8 b5); for a Lean consultant familiar, start small and
//     learn on one line; but legal and safety Musts, such as tracing food
//     batches, are never trimmed (s8 b6); the sharp question, the first Monday
//     (s8 b7)
//   mvp example: a plastics injection moulder introduces an MES, 300 person-days
//     of build capacity to go-live (s9 b1); 40 requirements sorted: Musts 210,
//     Shoulds 30, Coulds 60, exactly 300 with no room (s9 b2); step 1, Musts
//     210 / 300 = 70 %, above DSDM's 60 % (s9 b3, the division on the card,
//     up through b4);
//     step 2, the test question; six requirements, 45 days, a workable
//     workaround such as the planner's weekly report by hand; they move to
//     Should (s9 b4); step 3, Musts 165 days (55 %), Shoulds 75 (25 %), Coulds 60
//     (20 %) (s9 b5, the 25 and 20 % on the card); the MVP cut line under the
//     Musts, 165 days, order to shipment on line 1 (s9 b6), the Coulds the reserve (s9 b6,
//     on the card; said in s7 b4)
//   Not in the film: the lessons' pre and recall questions, their "said"
//   lines, situations and sayIt (practice, not teach text). Every card-only
//   point stays up at least one beat of 4 s or more.
//
// Facts as the lessons credit them, and no more: MoSCoW devised by Dai Clegg
// in 1994 at Oracle, later a fixed part of DSDM, kept by the Agile Business
// Consortium; DSDM calls the Musts the Minimum Usable SubseT and gives the
// rules of thumb (Musts typically no more than 60 % of the effort, Coulds
// around 20 %); MVP coined by Frank Robinson in 2001, made famous by Eric Ries
// with The Lean Startup (2011). The model below asserts the lessons still say so.
//
// The drawing is the shared pm world (films/_pm/world.mjs, read-only here) in
// the backlog film's room: on the back wall a whiteboard; in the requirements
// scenes a heap of wish notes, the to-be process as a row of five steps with
// the notes hung under them, duplicates fading and three notes parked at the
// bottom right; from s5 four bins along the bottom of the board (Must, Should,
// Could, Won't), notes stacked in each (one note is 15 person-days in s9), the
// Must notes in the accent colour, and the MVP cut line as a dashed line
// between the Must bin and the rest. The people: the planner and the team lead
// from the pm world, a quality lead and the business analyst (with a laptop)
// in the Scrum film's figures (its cast.mjs, imported, not edited), and "jij",
// the consultant, in front. A panel at the right, in stage space, carries one
// card per scene, labelled "schema" or "voorbeeld"; the bins and the cut line
// are drawn there too, with their names.
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below), and so are the people and the
// board.
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
const RQ = 'pm.itproject.requirements';
const MV = 'pm.itproject.mvp';
const lessons = await allLessons();
const FAILS = [];
const assert = (ok, what) => { if (!ok) FAILS.push(what); };
const textOf = (id, lang) => { const l = lessons[lang].get(id); return `${l.teach.join('\n')}\n${l.example.text}\n${l.example.ask || ''}\n${l.example.reveal || ''}`; };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(RQ, ['iets wat het nieuwe systeem moet doen of moet zijn, zo opgeschreven dat je het later kunt controleren', 'de basis voor de offerte van de leverancier, voor de tests en voor de acceptatie',
  'Een functionele eis zegt wat het systeem doet: “Het systeem blokkeert een batch die kwaliteit niet heeft vrijgegeven.”', 'Een niet-functionele eis zegt hoe goed het dat doet: snelheid, beschikbaarheid, beveiliging',
  '“Het etiket print binnen 3 seconden nadat de laatste doos is gewogen.”', 'Begin bij het proces, niet bij de schermen', 'het to-be-proces: hoe het werk na de go-live loopt, stap voor stap',
  'Vraag dan per stap wat het systeem moet doen om die te ondersteunen', 'alles wat de oude schermen deden plus elke ergernis van de afgelopen tien jaar', 'in nieuwe kleuren, met al zijn omwegen',
  'Een goede requirement is toetsbaar', '“Het systeem moet gebruiksvriendelijk zijn” is dat niet: niemand kan zeggen of het geslaagd of gezakt is',
  '“Na een uur training registreert een nieuwe operator een lijnstop in minder dan 30 seconden”', 'Geef elke requirement een nummer, een bron (wie vroeg erom en waarom) en later een prioriteit',
  'Het nummer komt terug in de testscripts en in het contract', 'de planners, operators en kwaliteitsmensen, samen met een businessanalist: degene die vertaalt tussen de business en IT en het precies opschrijft',
  '“We willen een Excel-export van alle orders” is een oplossing', '“De planner ziet de orders van morgen per lijn, met hun materialen.” Het nieuwe systeem kan dat misschien zonder Excel',
  'in twee grote workshops opgehaald, niemand toetst ze aan het to-be-proces, en de leverancier offreert op 300 vage regels', 'of iets wel “in scope” was, binnen de afgesproken inhoud van het project',
  '“Welke stap of welk besluit wordt hier beter van?” Kan niemand dat zeggen, dan is het waarschijnlijk gewoonte, geen behoefte',
  'Een vleeswarenfabriek vervangt haar MES (manufacturing execution system, het systeem dat de orders op de vloer aanstuurt en de productie registreert)',
  'Drie workshops met planners, ploegleiders en kwaliteit leveren 240 wensen op', '60 regels zeggen hetzelfde in andere woorden, dus er blijven er 180 over',
  '“Excel-export van orders” wordt R-031: “De planner ziet de orders van morgen per lijn, met de materialen en hun voorraad.”',
  '“Snelle etiketten” wordt R-047, een niet-functionele eis: “Het etiket print binnen 3 seconden nadat de laatste doos is gewogen, in 95 van de 100 tests.”',
  '36 regels horen bij geen enkele stap en gaan op een parkeerlijst', 'Resultaat: 144 requirements, elk met een nummer, een bron en een test']);
says(MV, ['MoSCoW is een manier om requirements in vier bakken te sorteren: Must have, Should have, Could have en Won’t have this time', 'De twee o’s staan er alleen in om het uitspreekbaar te maken',
  'Dai Clegg bedacht het in 1994 bij Oracle, voor ontwikkelprojecten met weinig tijd', 'Later werd het een vast onderdeel van DSDM, een agile projectmethode die nu wordt beheerd door het Agile Business Consortium',
  'In ERP- en MES-projecten is het de gangbaarste manier om te prioriteren', 'Een Must have is iets zonder wat de go-live geen zin heeft, of onveilig of onwettig is', 'DSDM noemt de Musts de Minimum Usable SubseT',
  '“Als dit ontbreekt, stellen we de go-live dan uit?” Is het antwoord “nee, we werken eromheen”, dan is het geen Must', 'Een Should have is belangrijk, maar een tijdelijke omweg kan',
  'Een Could have is mooi meegenomen en valt als eerste af als de tijd krap wordt', 'Won’t have this time betekent: afgesproken dat het er nu niet in komt',
  'Het gaat toch op de lijst, zodat iedereen ziet dat het besproken is en het niet via de achterdeur terugkomt', 'de Musts kosten meestal niet meer dan 60% van de inspanning, en de Coulds zo’n 20%',
  'De Coulds zijn je reserve. Is alles een Must, dan kan de scope geen tegenvaller opvangen, en breekt de datum of het budget', 'MVP staat voor minimum viable product. Frank Robinson bedacht de term in 2001',
  'Eric Ries maakte hem beroemd met The Lean Startup (2011), als de kleinste versie waarmee je het meest leert van echte gebruikers', 'de kleinste scope waarmee je op een echte lijn live kunt',
  'De MVP-lijn is de streep in de gesorteerde lijst: alles erboven moet klaar zijn voor de go-live', 'dun maar compleet: order erin, produceren, etiketteren, verzenden, factureren',
  'De helft van de schermen van elke stap is geen MVP; daar kan niemand mee werken', 'klein beginnen en eerst op één lijn leren', 'wettelijke en veiligheids-Musts, zoals het traceren van voedselbatches, schaaf je nooit weg',
  '“Wat doen we op de eerste maandag als dit er niet is?”', 'Een spuitgieterij voert een MES in. Tot de go-live heeft het team 300 mensdagen bouwcapaciteit',
  'De 40 requirements zijn met MoSCoW gesorteerd: Musts 210 dagen, Shoulds 30 dagen, Coulds 60 dagen. Precies 300, maar zonder enige ruimte', 'de Musts zijn 210 / 300 = 70% van de inspanning, boven de 60% van DSDM',
  'Zes requirements, samen 45 dagen, hebben een werkbare omweg, zoals een weekrapport dat de planner een tijdje met de hand kan maken. Ze worden Should',
  'Musts 165 dagen (55%), Shoulds 75 dagen (25%), Coulds 60 dagen (20%)', 'De MVP-lijn ligt nu onder de Musts: 165 dagen, van order tot verzending op lijn 1. De Coulds zijn de reserve']);
says(RQ, ['a requirement is something the new system must do or must be'.replace(/^a/, 'A'), 'in under 30 seconds', 'together with a business analyst'], 'en');
says(MV, ['Dai Clegg devised it in 1994 at Oracle', 'Frank Robinson coined the term in 2001', 'The Lean Startup (2011)', 'DSDM calls the Musts the Minimum Usable SubseT'], 'en');
assert(lessons.nl.get(RQ).terms.map((t) => t.term).join() === 'Requirement,Functionele eis,Niet-functionele eis,To-be-proces,Businessanalist', 'the five terms of requirements');
assert(lessons.nl.get(MV).terms.map((t) => t.term).join() === 'MoSCoW,Must have,Should have,Could have,Won’t have,MVP', 'the six terms of mvp');
for (const id of [RQ, MV]) for (const lang of ['nl', 'en']) assert(!lessons[lang].get(id).film || lessons[lang].get(id).film === 'pm.itproject.mvp', `no other film is wired to ${id}`);
// the requirements example: 240 wishes, 60 duplicates, 36 parked
const WISH = 240;
assert(WISH - 60 === 180 && 180 - 36 === 144, '240 − 60 = 180, 180 − 36 = 144');
// on the board one wish note stands for 12 wishes: 20 notes, 5 duplicates, 3 parked, 12 left
const NOTE = 12;
assert(WISH / NOTE === 20 && 60 / NOTE === 5 && 36 / NOTE === 3 && 144 / NOTE === 12, 'one note is 12 wishes');
// the MVP example: 300 person-days in three bins, then six requirements (45 days) move down
const CAP = 300;
const BEFORE = { m: 210, s: 30, c: 60 };
const AFTER = { m: 165, s: 75, c: 60 };
assert(BEFORE.m + BEFORE.s + BEFORE.c === CAP && AFTER.m + AFTER.s + AFTER.c === CAP, 'both splits are exactly 300 days');
assert(Math.round((BEFORE.m / CAP) * 100) === 70 && 70 > 60, '210 / 300 = 70 %, above 60 %');
assert(BEFORE.m - 45 === AFTER.m && BEFORE.s + 45 === AFTER.s, 'six requirements, 45 days, Must to Should');
assert(Math.round((AFTER.m / CAP) * 100) === 55 && Math.round((AFTER.s / CAP) * 100) === 25 && Math.round((AFTER.c / CAP) * 100) === 20, '55 %, 25 %, 20 %');
// on the board one note is 15 person-days
const DAY = 15;
const STACK = { before: [BEFORE.m / DAY, BEFORE.s / DAY, BEFORE.c / DAY, 2], after: [AFTER.m / DAY, AFTER.s / DAY, AFTER.c / DAY, 2] };
assert(STACK.before.concat(STACK.after).every(Number.isInteger) && 45 / DAY === 3, 'one bin note is 15 days');

if (FAILS.length) throw new Error(`model:\n  ${FAILS.join('\n  ')}`);

// ---------------------------------------------------------------- the world
const W = 640;
const H = 400;
const AZ = 58;
const ROOM = { w: 300, d: 240, h: 230 };
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, 318, H, { pad: 8, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;
const r1 = (v) => Math.round(v * 10) / 10;

// the whiteboard on the back wall; what is on it is drawn by stage.js in its face plane
const BOARD = w.board({ x0: 34, x1: 196, z0: 100, z1: 204 });
const BA = BOARD.area;
const boardFace = `<g transform="${BOARD.face}">` + g('bNotes', '') + '</g>';
const TABLE = { x: 96, y: 116, w: 150, d: 70, h: 74 };
const TZ = TABLE.h;
// the cast: who stands where (world cm), as in the backlog film's room
const SPOT = {
  planner: { x: 70, y: 152, along: 'y' },
  teamlead: { x: 272, y: 152, along: 'y' },
  analyst: { x: 216, y: 84, along: 'x', look: 'dev2' },
  quality: { x: 262, y: 92, along: 'x', look: 'sm' },
  jij: { x: 222, y: 226, along: 'x' },
};
const HEAD = Object.fromEntries(Object.entries(SPOT).map(([r, s]) => [r, w.at([s.x, s.y, 172]).map(r1)]));
const fig = (r) => scrumPerson(w, k, G, P, { ...SPOT[r], key: r });
const world = [
  w.room(ROOM),
  w.clock(246, 180, 11),
  cueG('board', BOARD.svg + boardFace),
  fig('analyst'),
  fig('quality'),
  w.chair({ x: 140, y: 102, back: -1 }),
  w.person({ ...SPOT.planner, role: 'planner' }),
  w.table(TABLE),
  w.laptop({ x: 200, y: 136, z: TZ, toward: -1 }),
  w.laptop({ x: 128, y: 150, z: TZ, toward: 1 }),
  w.stack({ x: 160, y: 158, z: TZ, n: 3 }),
  w.cup(232, 170, TZ),
  w.person({ ...SPOT.teamlead, role: 'teamlead' }),
  w.person({ ...SPOT.jij, role: 'jij' }),
].join('');
for (const r of ['planner', 'teamlead', 'analyst', 'quality', 'jij', 'board']) assert(world.includes(`data-cue="${r}"`), `${r} is a cue group`);
if (FAILS.length) throw new Error(`model:\n  ${FAILS.join('\n  ')}`);

// ---------------------------------------------------------------- the panel (stage space)
// One card per scene, drawn by stage.js into these groups; each block of a card
// sits in its own cue group, so a beat's focus (and a term's cue) can light it.
const PX = 322;
const PW = 308;
const CUES = ['req', 'basis', 'func', 'nonf',
  'tobe', 'step', 'wish', 'testable', 'test30', 'ids',
  'who', 'solution', 'need', 'wrong', 'scope', 'askq',
  'meat', 'dup', 'r031', 'r047', 'park', 'res',
  'moscow', 'oos', 'clegg', 'dsdm', 'common',
  'must', 'mtest', 'should', 'could',
  'wont', 'list', 'rules', 'reserve', 'breaks',
  'mvp', 'ries', 'cutline', 'thin', 'half', 'lean', 'monday',
  'case', 'sort', 'check', 'move', 'split', 'line'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));
// Static paths with relative line-tos (the helper of pm.land.handover and
// pm.agile.backlog): the same points, fewer bytes; each rewrite is read back.
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
const svg = compact(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`);

// ---------------------------------------------------------------- cameras (one gentle move per scene)
// [cx, cy, s]: the stage point (cx, cy) stays put while the room scales by s
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const toward = (p, s) => [p[0], p[1] + 40, s];
const BOARD_AT = w.at([(BA.x0 + BA.x1) / 2, 0, (BA.z0 + BA.z1) / 2]).map(r1);
const BCAM = (s) => [BOARD_AT[0], BOARD_AT[1] + 30, s];
const CAM = [
  { from: [160, 205, 1], to: BCAM(1.1) },
  { from: BCAM(1.06), to: BCAM(1.14) },
  { from: toward(mid(HEAD.analyst, HEAD.planner), 1.02), to: toward(mid(HEAD.analyst, HEAD.quality), 1.08) },
  { from: BCAM(1.04), to: BCAM(1.14) },
  { from: [160, 205, 1], to: BCAM(1.1) },
  { from: BCAM(1.06), to: BCAM(1.14) },
  { from: BCAM(1.1), to: toward(mid(HEAD.planner, HEAD.teamlead), 1.04) },
  { from: toward(HEAD.jij, 1.02), to: BCAM(1.12) },
  { from: BCAM(1.04), to: [160, 205, 1] },
];

// ---------------------------------------------------------------- the film
const C = {
  CUES, STACK,
  BA: { x0: r1(BA.x0), x1: r1(BA.x1), z0: r1(BA.z0), z1: r1(BA.z1) },
  BAR: { cap: CAP, before: BEFORE, after: AFTER },
};
const sc = (id, lesson, level, title, beats) => ({ id, lesson, level, still: 0.9, title, beats });
const spec = {
  id: 'pm.itproject.mvp',
  title: { nl: 'MoSCoW en een MVP', en: 'MoSCoW and an MVP' },
  lessons: [RQ, MV],
  strictFocus: true,
  scenes: [
    sc('s1', RQ, 1, { nl: 'Wat een requirement is', en: 'What a requirement is' }, [
      { nl: '{t:Requirement|Requirement}: wat het systeem moet doen of zijn, controleerbaar.', en: '{t:Requirement|Requirement}: what the system must do or be, checkable.', cue: { Requirement: 'req' }, focus: ['req', 'board'] },
      { nl: 'Basis voor offerte, tests en acceptatie.', en: 'The basis for the quote, the tests and acceptance.', focus: 'basis' },
      { nl: '{t:Functionele eis|Functionele eis}: wat het systeem doet.', en: '{t:Functional requirement|Functional requirement}: what the system does.', cue: { 'Functionele eis': 'func' }, focus: ['func', 'quality'] },
      { nl: '{t:Niet-functionele eis|Niet-functionele eis}: hoe goed. Etiket binnen {n:3} seconden.', en: '{t:Non-functional requirement|Non-functional requirement}: how well. Label within {n:3} seconds.', cue: { 'Niet-functionele eis': 'nonf' }, focus: 'nonf' },
    ]),
    sc('s2', RQ, 1, { nl: 'Vanuit het proces', en: 'From the process' }, [
      { nl: 'Eerst het {t:To-be-proces|to-be-proces}: het werk na de go-live, stap voor stap.', en: 'First the {t:To-be process|to-be process}: the work after go-live, step by step.', cue: { 'To-be-proces': 'tobe' }, focus: ['tobe', 'board'] },
      { nl: 'Per stap: wat moet het systeem doen?', en: 'Per step: what must the system do?', focus: ['step', 'board'] },
      { nl: 'Vanuit het oude systeem: een wensenlijst, met alle omwegen.', en: 'From the old system: a wish list, detours and all.', focus: ['wish', 'planner'] },
      { nl: 'Toetsbaar? “Gebruiksvriendelijk” is dat niet.', en: 'Testable? “User-friendly” is not.', focus: 'testable' },
      { nl: 'Wel: na een uur training een lijnstop in minder dan {n:30} seconden.', en: 'This is: after an hour of training, a line stop in under {n:30} seconds.', focus: ['test30', 'teamlead'] },
      { nl: 'Elke regel een nummer, een bron, later een prioriteit.', en: 'Every line an ID, a source, later a priority.', focus: 'ids' },
    ]),
    sc('s3', RQ, 1, { nl: 'Behoefte, geen oplossing', en: 'A need, not a solution' }, [
      { nl: 'Mensen die het werk kennen, met een {t:Businessanalist|businessanalist}.', en: 'People who know the work, with a {t:Business analyst|business analyst}.', cue: { Businessanalist: 'who' }, focus: ['who', 'analyst', 'planner', 'teamlead', 'quality'] },
      { nl: 'Een Excel-export van alle orders is een oplossing.', en: 'An Excel export of all orders is a solution.', focus: 'solution' },
      { nl: 'De behoefte: de orders van morgen per lijn, met materialen.', en: 'The need: tomorrow’s orders per line, with materials.', focus: ['need', 'planner'] },
      { nl: 'Misgaat: twee workshops, niet getoetst, {n:300} vage regels.', en: 'Goes wrong: two workshops, no check, {n:300} vague lines.', focus: 'wrong' },
      { nl: 'Elke vage regel: was dit in scope?', en: 'Every vague line: was this in scope?', focus: 'scope' },
      { nl: 'Vraag: welke stap of welk besluit wordt hier beter van?', en: 'Ask: which step or decision gets better because of this?', focus: ['askq', 'jij'] },
    ]),
    sc('s4', RQ, 1, { nl: 'Voorbeeld: vleeswaren', en: 'Example: meat products' }, [
      { nl: 'Nieuw MES bij een vleeswarenfabriek: {n:240} wensen.', en: 'A new MES at a meat products plant: {n:240} wishes.', focus: ['meat', 'board'] },
      { nl: 'Stap {n:1}: {n:60} dubbelingen eruit, {n:180} over.', en: 'Step {n:1}: {n:60} duplicates out, {n:180} left.', focus: ['dup', 'board'] },
      { nl: 'Stap {n:2}: de Excel-export wordt een behoefte.', en: 'Step {n:2}: the Excel export becomes a need.', focus: 'r031' },
      { nl: 'Stap {n:3}: toetsbaar, binnen {n:3} seconden, {n:95} van de {n:100} tests.', en: 'Step {n:3}: testable, within {n:3} seconds, {n:95} of {n:100} tests.', focus: 'r047' },
      { nl: 'Stap {n:4}: {n:36} regels zonder processtap geparkeerd.', en: 'Step {n:4}: {n:36} lines with no process step parked.', focus: ['park', 'board'] },
      { nl: 'Resultaat: {n:144} requirements met nummer, bron en test.', en: 'Result: {n:144} requirements with ID, source and test.', focus: ['res', 'board'] },
    ]),
    sc('s5', MV, 2, { nl: 'MoSCoW', en: 'MoSCoW' }, [
      { nl: '{t:MoSCoW|MoSCoW}: vier bakken. Must, Should, Could, Won’t.', en: '{t:MoSCoW|MoSCoW}: four bins. Must, Should, Could, Won’t.', cue: { MoSCoW: 'moscow' }, focus: ['moscow', 'board'] },
      { nl: 'De o’s alleen voor de uitspraak.', en: 'The o’s only to make it pronounceable.', focus: 'oos' },
      { nl: 'Dai Clegg, 1994, bij Oracle.', en: 'Dai Clegg, 1994, at Oracle.', focus: 'clegg' },
      { nl: 'Later vast onderdeel van DSDM.', en: 'Later a fixed part of DSDM.', focus: 'dsdm' },
      { nl: 'Gangbaar in ERP- en MES-projecten.', en: 'Common in ERP and MES projects.', focus: 'common' },
    ]),
    sc('s6', MV, 2, { nl: 'Must, Should, Could', en: 'Must, Should, Could' }, [
      { nl: '{t:Must have|Must have}: zonder geen zinnige, veilige of wettige go-live.', en: '{t:Must have|Must have}: without it, no sensible, safe or legal go-live.', cue: { 'Must have': 'must' }, focus: ['must', 'board'] },
      { nl: 'Toets: stellen we de go-live uit als dit ontbreekt?', en: 'Test: do we postpone go-live if this is missing?', focus: 'mtest' },
      { nl: '{t:Should have|Should have}: belangrijk, een tijdelijke omweg kan.', en: '{t:Should have|Should have}: important, a workaround is possible for a while.', cue: { 'Should have': 'should' }, focus: ['should', 'board'] },
      { nl: '{t:Could have|Could have}: mooi meegenomen, valt als eerste af.', en: '{t:Could have|Could have}: nice to have, goes first.', cue: { 'Could have': 'could' }, focus: ['could', 'board'] },
    ]),
    sc('s7', MV, 2, { nl: 'Won’t have en de reserve', en: 'Won’t have and the reserve' }, [
      { nl: '{t:Won’t have|Won’t have} this time: nu niet.', en: '{t:Won’t have|Won’t have} this time: not now.', cue: { 'Won’t have': 'wont' }, focus: ['wont', 'board'] },
      { nl: 'Toch op de lijst, zodat het niet terugsluipt.', en: 'On the list anyway, so it does not creep back.', focus: 'list' },
      { nl: 'DSDM: Musts hooguit {n:60}%, Coulds zo’n {n:20}%.', en: 'DSDM: Musts at most {n:60}%, Coulds about {n:20}%.', focus: 'rules' },
      { nl: 'De Coulds zijn je reserve.', en: 'The Coulds are your reserve.', focus: ['reserve', 'board'] },
      { nl: 'Alles Must? Dan breekt de datum of het budget.', en: 'All Musts? Then the date or the budget breaks.', focus: 'breaks' },
    ]),
    sc('s8', MV, 2, { nl: 'De MVP', en: 'The MVP' }, [
      { nl: '{t:MVP|MVP}: minimum viable product. Frank Robinson, 2001.', en: '{t:MVP|MVP}: minimum viable product. Frank Robinson, 2001.', cue: { MVP: 'mvp' }, focus: 'mvp' },
      { nl: 'Eric Ries: de kleinste versie die het meest leert.', en: 'Eric Ries: the smallest version that teaches the most.', focus: 'ries' },
      { nl: 'In ERP en MES: kleinste scope om live te gaan. De MVP-lijn.', en: 'In ERP and MES: the smallest scope to go live. The MVP cut line.', focus: ['cutline', 'board'] },
      { nl: 'Het hele proces, dun maar compleet.', en: 'The whole process, thin but complete.', focus: ['thin', 'board'] },
      { nl: 'De helft van elk scherm is geen MVP.', en: 'Half of every screen is not an MVP.', focus: 'half' },
      { nl: 'Klein beginnen; wettelijke en veiligheids-Musts nooit weg.', en: 'Start small; legal and safety Musts never go.', focus: ['lean', 'jij'] },
      { nl: 'Vraag: wat doen we op de eerste maandag zonder dit?', en: 'Ask: what do we do on the first Monday without this?', focus: ['monday', 'teamlead'] },
    ]),
    sc('s9', MV, 2, { nl: 'Voorbeeld: de spuitgieterij', en: 'Example: the moulder' }, [
      { nl: 'Een spuitgieterij: {n:300} mensdagen tot de go-live.', en: 'An injection moulder: {n:300} person-days to go-live.', focus: 'case' },
      { nl: '{n:40} eisen: Musts {n:210}, Shoulds {n:30}, Coulds {n:60}. Geen ruimte.', en: '{n:40} requirements: Musts {n:210}, Shoulds {n:30}, Coulds {n:60}. No room.', focus: ['sort', 'board'] },
      { nl: 'Musts {n:70}%: boven de {n:60}%.', en: 'Musts {n:70}%: above {n:60}%.', focus: 'check' },
      { nl: 'Zes eisen, {n:45} dagen, met een omweg: Should.', en: 'Six requirements, {n:45} days, with a workaround: Should.', focus: ['move', 'board', 'planner'] },
      { nl: 'Nu: Musts {n:165} dagen, {n:55}%. Shoulds {n:75}, Coulds {n:60}.', en: 'Now: Musts {n:165} days, {n:55}%. Shoulds {n:75}, Coulds {n:60}.', focus: 'split' },
      { nl: 'De MVP-lijn onder de Musts: order tot verzending, lijn {n:1}.', en: 'The MVP cut line under the Musts: order to shipment, line {n:1}.', focus: ['line', 'board'] },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lessons'
// teach text and worked examples, so every point of the checklist above is
// said here or shown on the card. No symbol the voice would read aloud, no
// spoken parenthesis or quote; quoted sentences are introduced in words.
// Dutch checked with espeak-ng phonemes through Piper's own bridge
// (nl_NL-alex, 2026-11-13). Read as written: functionele and niet-functionele
// eis, beschikbaarheid, beveiliging, Excel-export, workshops, testscripts,
// parkeerlijst, vleeswarenfabriek, spuitgieterij, mensdagen, Dai Clegg (said
// as the lesson spells it; "Dai" is Welsh "die"), DSDM and ERP (letters, as
// eng.ot.isa95 and pm.itproject.cutover say it), Lean-consultant and scope
// (the kit's existing rules), MES (the kit's letters rule) and Must, Musts. New
// SAY rules in films/_kit/timeline.mjs (tested; recomputed for every film: no
// other film's spoken text changes): requirement as "ri-kwaijurmunt" (it reads
// "ree-kvi-re-MENT"), MoSCoW as Moskou (it spells "mo S ko W"), the bins in
// English sounds, Must hev, Sjoed hev, Koed hev, Woont hev dis taim (it reads
// "haa-ve", "sjout", "kout", "won"), Shoulds and Coulds as Sjoeds, Koeds,
// Oracle as Orrekul (it reads "OO-rak-le"), Business Consortium as Biznis
// (the business case rule's sound), MVP as "em vee pee" (it reads "em-fee-pee"),
// minimum viable product as "vaaiebul prodduct" ("vie-ab-le PROO-dukt"), Frank
// Robinson as Robbinsun (it stresses "-SON"), Eric Ries as Erik ("e-RIK"), The
// Lean Startup as "de Lien Startap" (it reads "lee-an"), the Minimum Usable
// SubseT as "Joezebul Sabset" ("uu-za-ble sub-se tee"), to-be-proces as
// "toe-bie-proces" ("too-bee-ee"), go-live as "goo-laiv" ("go-lie-ve"),
// businessanalist as "biznis-analist" ("buu-zie-nes") and voedselbatches with
// the batch rule's betsj ("bat-chès"); in this film's phrases only, business
// in "tussen business en IT" as Biznis and live in "live te gaan" as "laiv"
// (it reads the Dutch "lie-ve"). Said around: ERP as letters needs lower-case
// words after "ERP en MES" (before a comma it reads the word "erp"), so both
// lines put a verb after MES; "In ERP- en MES-projecten" became "In projecten
// met ERP en MES". In English, MoSCoW as Moscow (en_GB
// spells it), Eric Ries as Reese ("rise") and SubseT as a plain Subset. Years
// in words in Dutch.
const SAY = [
  [ // s1 what a requirement is
    { nl: 'Een {t:Requirement|requirement} is wat het nieuwe systeem moet doen of zijn, zo opgeschreven dat je het later controleert.',
      en: 'A {t:Requirement|requirement} is what the new system must do or be, written so you can check it later.' },
    { nl: 'Het is de basis voor de offerte, de tests en acceptatie.',
      en: 'It is the basis for the quote, the tests and acceptance.' },
    { nl: 'Een {t:Functionele eis|functionele eis} zegt wat het systeem doet: het blokkeert een batch die kwaliteit niet heeft vrijgegeven.',
      en: 'A {t:Functional requirement|functional requirement} says what the system does: it blocks a batch quality has not released.' },
    { nl: 'Een {t:Niet-functionele eis|niet-functionele eis} zegt hoe goed: snelheid, beschikbaarheid, beveiliging. Zoals een etiket binnen drie seconden.',
      en: 'A {t:Non-functional requirement|non-functional requirement} says how well: speed, availability, security, like a label within three seconds.' },
  ],
  [ // s2 from the process
    { nl: 'Begin bij het proces, niet bij de schermen: eerst het {t:To-be-proces|to-be-proces}, hoe het werk na de go-live loopt, stap voor stap.',
      en: 'Start from the process, not the screens: first the {t:To-be process|to-be process}, how the work runs after go-live, step by step.' },
    { nl: 'Vraag dan per stap wat het systeem moet doen.',
      en: 'Then ask, per step, what the system must do.' },
    { nl: 'Begin je bij het oude systeem, dan krijg je een wensenlijst: het oude systeem in nieuwe kleuren, met al zijn omwegen.',
      en: 'Start from the old system and you get a wish list: the old system in new colours, detours and all.' },
    { nl: 'Een goede requirement is toetsbaar. Gebruiksvriendelijk is dat niet: niemand kan zeggen of het geslaagd of gezakt is.',
      en: 'A good requirement is testable. User-friendly is not: nobody can say pass or fail.' },
    { nl: 'Dit wel: na een uur training registreert een nieuwe operator een lijnstop in minder dan dertig seconden.',
      en: 'This is: after an hour\'s training, a new operator logs a line stop in under thirty seconds.' },
    { nl: 'Geef elke regel een nummer, een bron en later een prioriteit. Het nummer komt terug in testscripts en contract.',
      en: 'Give every line an ID, a source and later a priority. The ID returns in test scripts and contract.' },
  ],
  [ // s3 a need, not a solution
    { nl: 'Schrijf ze met de mensen die het werk kennen, en een {t:Businessanalist|businessanalist} die vertaalt tussen business en IT.',
      en: 'Write them with the people who know the work, and a {t:Business analyst|business analyst} who translates between business and IT.' },
    { nl: 'Let op oplossingen vermomd als requirement, zoals een Excel-export van alle orders.',
      en: 'Watch out for solutions disguised as requirements, like an Excel export of all orders.' },
    { nl: 'De echte behoefte is misschien: de planner ziet de orders van morgen per lijn, met materialen.',
      en: 'The real need may be: the planner sees tomorrow\'s orders per line, with materials.' },
    { nl: 'Wat vaak misgaat: twee grote workshops, geen toets aan het to-be-proces, en een offerte op driehonderd vage regels.',
      en: 'What often goes wrong: two big workshops, no check against the to-be process, and a quote on three hundred vague lines.' },
    { nl: 'Elke vage regel wordt later een discussie of iets in scope was.',
      en: 'Every vague line later becomes an argument: was it in scope?' },
    { nl: 'Vraag: welke stap of welk besluit wordt hier beter van? Weet niemand het, dan is het waarschijnlijk gewoonte, geen behoefte.',
      en: 'Ask: which step or decision gets better? If nobody knows, it is probably habit, not need.' },
  ],
  [ // s4 the meat products plant
    { nl: 'Een vleeswarenfabriek vervangt haar MES, het systeem dat orders op de vloer aanstuurt. Drie workshops: tweehonderdveertig wensen.',
      en: 'A meat products plant replaces its MES, the system that runs orders on the floor. Three workshops: two hundred and forty wishes.' },
    { nl: 'Stap een: zestig dubbelingen eruit, honderdtachtig over.',
      en: 'Step one: sixty duplicates out, a hundred and eighty left.' },
    { nl: 'Stap twee: de Excel-export wordt een behoefte.',
      en: 'Step two: the Excel export becomes a need.' },
    { nl: 'Stap drie: snelle etiketten worden toetsbaar: binnen drie seconden, in vijfennegentig van de honderd tests.',
      en: 'Step three: fast labels become testable: within three seconds, in ninety-five of a hundred tests.' },
    { nl: 'Stap vier: zesendertig regels horen bij geen processtap, en gaan op een parkeerlijst.',
      en: 'Step four: thirty-six lines serve no process step, and are parked.' },
    { nl: 'Resultaat: honderdvierenveertig requirements, elk met een nummer, een bron en een test.',
      en: 'Result: a hundred and forty-four requirements, each with an ID, a source and a test.' },
  ],
  [ // s5 MoSCoW
    { nl: '{t:MoSCoW|MoSCoW} sorteert requirements in vier bakken: Must have, Should have, Could have en Won’t have this time.',
      en: '{t:MoSCoW|MoSCoW} sorts requirements into four bins: Must have, Should have, Could have and Won’t have this time.' },
    { nl: 'De o\'s staan er alleen in voor de uitspraak.',
      en: 'The o\'s only make it pronounceable.' },
    { nl: 'Dai Clegg bedacht het in negentienvierennegentig bij Oracle, voor ontwikkelprojecten met weinig tijd.',
      en: 'Dai Clegg devised it in nineteen ninety-four at Oracle, for development projects with little time.' },
    { nl: 'Later werd het vast onderdeel van DSDM, een agile methode, nu beheerd door het Agile Business Consortium.',
      en: 'It later became a fixed part of DSDM, an agile method now kept by the Agile Business Consortium.' },
    { nl: 'In projecten met ERP en MES is het de gangbaarste manier om te prioriteren.',
      en: 'In ERP and MES projects it is the most common way to prioritise.' },
  ],
  [ // s6 Must, Should, Could
    { nl: 'Een {t:Must have|Must have} is iets zonder wat de go-live geen zin heeft, of onveilig of onwettig is. DSDM noemt de Musts de Minimum Usable SubseT.',
      en: 'A {t:Must have|Must have} is something without which go-live makes no sense, or is unsafe or illegal. DSDM calls the Musts the Minimum Usable SubseT.' },
    { nl: 'De toetsvraag: stellen we de go-live zonder dit uit? Werken we eromheen, dan is het geen Must.',
      en: 'The test question: without this, do we postpone go-live? If we\'d work around it, it is not a Must.' },
    { nl: 'Een {t:Should have|Should have} is belangrijk, maar een tijdelijke omweg kan.',
      en: 'A {t:Should have|Should have} is important, but a workaround is possible for a while.' },
    { nl: 'Een {t:Could have|Could have} is mooi meegenomen, en valt als eerste af als de tijd krap wordt.',
      en: 'A {t:Could have|Could have} is nice to have, and goes first when time runs short.' },
  ],
  [ // s7 Won't have and the reserve
    { nl: '{t:Won’t have|Won’t have} this time betekent dat afgesproken is dat het er nu niet in komt.',
      en: '{t:Won’t have|Won’t have} this time means: agreed not to deliver it now.' },
    { nl: 'Het gaat toch op de lijst, zodat het niet via de achterdeur terugkomt.',
      en: 'It still goes on the list, so it can\'t creep back in through the side door.' },
    { nl: 'DSDM geeft vuistregels: de Musts meestal niet meer dan zestig procent van de inspanning, de Coulds zo\'n twintig.',
      en: 'DSDM\'s rules of thumb: Musts typically no more than sixty percent of the effort, Coulds around twenty.' },
    { nl: 'De Coulds zijn je reserve.',
      en: 'The Coulds are your reserve.' },
    { nl: 'Is alles Must, dan vangt de scope geen tegenvaller op, en breekt de datum of het budget.',
      en: 'If everything is a Must, the scope cannot absorb a setback: the date or the budget breaks.' },
  ],
  [ // s8 the MVP
    { nl: '{t:MVP|MVP} staat voor minimum viable product, een term van Frank Robinson uit tweeduizend een.',
      en: '{t:MVP|MVP}: minimum viable product, Frank Robinson\'s term from 2001.' },
    { nl: 'Eric Ries maakte hem beroemd met The Lean Startup: de kleinste versie waarmee je het meest leert van echte gebruikers.',
      en: 'Eric Ries made it famous with The Lean Startup: the smallest version to learn the most from real users.' },
    { nl: 'Bij ERP en MES is het losser: de kleinste scope om op een echte lijn live te gaan. Alles boven de MVP-lijn moet klaar zijn voor de go-live.',
      en: 'In ERP and MES it is looser: the smallest scope to go live on a real line. All above the MVP cut line must be ready for go-live.' },
    { nl: 'Het hele proces, dun maar compleet: order erin, produceren, etiketteren, verzenden, factureren.',
      en: 'The whole process, thin but complete: order in, produce, label, ship, invoice.' },
    { nl: 'De helft van de schermen van elke stap is geen MVP.',
      en: 'Half the screens of every step is not an MVP.' },
    { nl: 'Voor een Lean-consultant herkenbaar: klein beginnen op één lijn. Maar wettelijke en veiligheids-Musts, zoals voedselbatches traceren, schaaf je nooit weg.',
      en: 'Familiar to a Lean consultant: start small, on one line. But legal and safety Musts, such as tracing food batches, are never trimmed.' },
    { nl: 'Vraag: wat doen we op de eerste maandag zonder dit?',
      en: 'Ask: what do we do on the first Monday without this?' },
  ],
  [ // s9 the injection moulder
    { nl: 'Een spuitgieterij voert een MES in: driehonderd mensdagen bouwcapaciteit tot de go-live.',
      en: 'An injection moulder introduces an MES: three hundred person-days of build capacity until go-live.' },
    { nl: 'Veertig requirements: Musts tweehonderdtien dagen, Shoulds dertig, Coulds zestig. Precies driehonderd, zonder ruimte.',
      en: 'Forty requirements: Musts two hundred and ten days, Shoulds thirty, Coulds sixty. Exactly three hundred, no room.' },
    { nl: 'Stap een: de Musts zijn zeventig procent, boven de zestig van DSDM.',
      en: 'Step one: Musts are seventy percent, above DSDM\'s sixty.' },
    { nl: 'Stap twee: de toetsvraag. Zes requirements, vijfenveertig dagen, hebben een werkbare omweg, zoals een weekrapport met de hand. Ze worden Should.',
      en: 'Step two: the test question. Six requirements, forty-five days, have a workaround, such as a weekly report by hand. They move to Should.' },
    { nl: 'Stap drie: Musts honderdvijfenzestig dagen, vijfenvijftig procent. Shoulds vijfenzeventig, Coulds zestig.',
      en: 'Step three: Musts a hundred and sixty-five days, fifty-five percent. Shoulds seventy-five, Coulds sixty.' },
    { nl: 'De MVP-lijn ligt onder de Musts: order tot verzending op lijn een.',
      en: 'The MVP cut line sits under the Musts: order to shipment on line one.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, no
// digits in the Dutch voice, and none of the words espeak-ng misreads (see
// above); checked on the text after the SAY rules, so a word a rule rewrites
// passes and a misread one fails the build
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = {
  nl: /\b(requirements?|Requirements?|MoSCoW|have|Shoulds?|Coulds?|Won|Oracle|Business|MVP|viable|Robinson|Eric|Startup|SubseT|Usable|to-be|go-live|businessanalist|voedselbatches)\b|(^|[.?!;]\s)Eén\b/,
  en: /\b(MoSCoW|Ries|SubseT)\b/,
};
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const said = sayable(plainSay(line[lang]), lang);
  if (/[/&×÷=+()“”"‘…%€<>~≈−]|:\S/.test(said)) throw new Error(`narration: a symbol the voice reads aloud in "${said.slice(0, 50)}"`);
  if (lang === 'nl' && /\d/.test(said)) throw new Error(`narration: a number in digits in "${said.slice(0, 50)}"`);
  if (MISREAD[lang].test(said)) throw new Error(`narration: "${MISREAD[lang].exec(said)[0]}" is misread by the ${lang} voice in "${said.slice(0, 60)}"`);
}
// each scene's length from its share of the narration (the longer of nl and
// en, at the kit's 2.5 words a second), never shorter than its captions need;
// the whole as long as the narration estimate, within the 300 s cap, no padding
{
  const said = SAY.map((s) => Math.max(...['nl', 'en'].map((lang) => s.reduce((a, l) => a + wordsOf(plainSay(l[lang])), 0))));
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
// each beat's still (reduced motion) sits late in its own share of the scene
{
  const resolved = resolveFilm(spec, lessons);
  resolved.scenes.forEach((rs, si) => {
    const st = beatStarts(rs, 'nl');
    spec.scenes[si].beats.forEach((b, bi) => {
      const a0 = st[bi] / rs.dur;
      const a1 = bi + 1 < st.length ? st[bi + 1] / rs.dur : 1;
      b.still = Math.round((a0 + 0.86 * (a1 - a0)) * 1000) / 1000;
    });
  });
}

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="planner"],[data-cue="teamlead"],[data-cue="jij"],[data-cue="analyst"],[data-cue="quality"])';
const css = PM_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:5 4}
.pm-cut{fill:none;stroke:var(--fp-accent);stroke-width:2.4;stroke-dasharray:6 4;stroke-linecap:round}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-ring{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:1.8}
.pm-blk{fill:var(--anatomy-hi);stroke:none}
.pm-blk2{fill:var(--anatomy-mid);stroke:none}
.pm-acc{fill:var(--fp-accent);stroke:none;opacity:.85}
.pm-note{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.5}
.pm-note2{fill:var(--fp-accent);stroke:none;opacity:.85}
.pm-note3{fill:var(--anatomy-mid);stroke:none}
.pm-note4{fill:none;stroke:var(--anatomy-hi);stroke-width:.5;stroke-dasharray:1.5 1}
.pm-bin{fill:none;stroke:var(--anatomy-hi);stroke-width:.7;stroke-linejoin:round}
.pm-cut2{fill:none;stroke:var(--fp-accent);stroke-width:1.4;stroke-dasharray:3 2}
.pm-strike{fill:none;stroke:var(--anatomy-strong);stroke-width:2.4;stroke-linecap:round}
[data-cue][data-on] .pm-card,[data-cue][data-on] .pm-dash{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line,[data-cue][data-on] .pm-ring,[data-cue][data-on] .pm-note,[data-cue][data-on] .pm-bin{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-blk{fill:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.run.conflict) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
`;

const label = {
  nl: 'De teamruimte van de backlogfilm. Aan de achterwand een whiteboard: eerst een stapel wensbriefjes, dan het to-be-proces als een rij van vijf stappen met de briefjes eronder; dubbele briefjes verdwijnen en drie briefjes gaan naar een parkeervak rechtsonder. Vanaf de MoSCoW-scènes staan onderaan het bord vier bakken, Must, Should, Could en Won’t, met briefjes erin gestapeld, de Musts in de accentkleur, en een gestippelde MVP-lijn tussen de Must-bak en de rest; in het voorbeeld schuiven drie briefjes van Must naar Should. Aan het linkereind van de tafel de planner met een tablet, aan het rechtereind de teamleider van de vloer, achter de tafel de businessanalist met een laptop en de kwaliteitsmanager, vooraan jij, de adviseur. Rechts een paneel met per scène een kaart, gemarkeerd als voorbeeld of schema: wat een requirement is, functioneel en niet-functioneel; het to-be-proces en toetsbaar schrijven; behoefte of oplossing; de vleeswarenfabriek; MoSCoW met de vier bakken; Must, Should en Could; Won’t have en de vuistregels van DSDM als balk; de MVP en de MVP-lijn; en de spuitgieterij, met een balk van driehonderd mensdagen voor en na, en de MVP-lijn erdoor.',
  en: 'The backlog film\'s team room. On the back wall a whiteboard: first a heap of wish notes, then the to-be process as a row of five steps with the notes under them; duplicate notes fade and three notes go to a parking area at the bottom right. From the MoSCoW scenes, four bins stand along the bottom of the board, Must, Should, Could and Won\'t, with notes stacked in them, the Musts in the accent colour, and a dashed MVP cut line between the Must bin and the rest; in the example three notes move from Must to Should. At the left end of the table the planner with a tablet, at the right end the team lead from the floor, behind the table the business analyst with a laptop and the quality lead, in front you, the consultant. At the right a panel with one card per scene, marked as example or diagram: what a requirement is, functional and non-functional; the to-be process and writing testable lines; need or solution; the meat products plant; MoSCoW with its four bins; Must, Should and Could; Won\'t have and DSDM\'s rules of thumb as a bar; the MVP and the MVP cut line; and the injection moulder, with a bar of three hundred person-days before and after, and the MVP cut line through it.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  const words = (lang) => data.scenes.reduce((a, s) => a + s.beats.reduce((n, b) => n + b.voice[lang].split(/\s+/).filter(Boolean).length, 0), 0);
  console.log(`narration words: nl ${words('nl')}, en ${words('en')}`);
}

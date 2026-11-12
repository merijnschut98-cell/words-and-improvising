// Dev tool, not shipped. Builds the explainer film "Van telefoontje tot
// offerte / From phone call to proposal" for the Projects course: two lessons
// of Advieswerk, pm.consult.proposal (level 1 of Offerte en prijs, Een offerte
// die wint) and pm.consult.pricing (level 2, Prijs en scope).
//
//   node films/pm.consult.proposal/build.mjs            build the page
//   node films/pm.consult.proposal/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.consult.proposal.html: one offline page
// with the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7
// (pm.consult.proposal, P3, about 90 s): a diagnosis phase with a go/no-go,
// and pricing options; scene notes "the call; a diagnosis phase with a
// go/no-go" and "day rate, fixed price, value-based on one slider; a risk
// mark-up". Storyboard drift: the plan's two scenes are nine and the film
// about four minutes, because a lesson with a film no longer shows its worked
// example (v16 notes, assignment 1), so the film carries both lessons' teach
// text and both worked examples: the proposal (s1-s4), the thermoforming
// example (s5), the three pricing models on one slider (s6), the fixed price,
// risk margin and change request (s7), discounts (s8) and the extrusion
// example (s9).
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only here):
// a meeting room with a whiteboard (a miniature of the panel) and a clock, a
// table with a phone (this film's own extra, cue "phone"), a laptop and the
// proposal's first page, which fills in as the film builds it, and the
// recurring cast: "jij" the consultant in petrol at the board, the sponsor
// (the client's manager; the plant director in s9), in s5 replaced by this
// film's own operations director (a woman in a rust blazer, cue "director"), the
// team lead (the team leads and the production engineer) and the planner (in
// the role of purchasing, who compare the quotes). A panel at the right, in
// stage space, carries one card per scene, labelled "schema" (a general
// picture) or "voorbeeld" (a worked example); s5 and s9 are examples, and s1
// to s4 and s6 to s8 diagrams with the lessons' own sample numbers.
//
// Facts checked (2026-11-12): the sums, asserted below: 12 days at €1.200 is
// €14.400, inside the €60k budget; €48k over 40 days is €1.200 a day and over
// 50 days €960, 20% under the rate; 10% off €1.200 is €1.080, and 1.200 /
// 1.080 is about 1,11, so about 11% more days; the extrusion phases add up, 8
// + 22 = 30 and 8 + 37 = 45 days, and 8 days at €1.200 is €9.600. The three
// pricing models are stated as the lesson states them: the day rate (the
// client carries the risk of overrun, it rewards hours), the fixed price (an
// agreed fee for an agreed scope, you carry the risk) and value-based pricing
// (the fee linked to what the result is worth); the film adds no risk claim
// for value-based pricing, which the lesson does not make. Alan Weiss is
// credited only with what the pricing lesson credits him: an advocate who
// argues value-based pricing is the fairest model for both sides (checked
// 2026-11-12 on alanweiss.com, "The Case for Value Based Fees" and "The
// lunacy of hourly billing": a fee on his contribution to the value gives "an
// excellent ROI for you and equitable compensation for me"; his
// Value-Based Fees is the level-3 lesson's source; this film does not cite
// his ten-to-one rule, which belongs to that lesson). OEE: good parts at full
// speed as a share of planned time, as the lesson defines it. The €80k on a
// €900k change and the competitor's €30k are the lesson's sample numbers;
// the film derives nothing from them.
//
// Checklist (lesson point: scene and beat; said unless marked "card"):
//   proposal teach 1: a proposal wins on its first page (s1 b1); start with
//     the client's problem in their words and numbers: 14% of planned jobs
//     cancelled, target 8% (s1 b2), each cancellation a crew-day and "in Q4"
//     (card, s1 b2 to b4); the
//     sponsor, the manager who pays for and owns the project, thinks "yes,
//     exactly that": most of the way there (s1 b3); method comes later (s1 b4)
//   proposal teach 2: the outcome and how you know: the measure, the baseline,
//     today's level measured before you start, the target, its owner (s2 b1);
//     the approach in phases; a diagnostic phase, short and cheap: three
//     weeks, 12 consultant days, €14.400 (s2 b2); a go/no-go decision:
//     continue, change course or stop (s2 b3); price the rest after the data,
//     lower risk for both sides (s2 b4)
//   proposal teach 3: client commitments, what you need from them: the
//     sponsor an hour every two weeks, a counterpart one day a week (s3 b1);
//     planning data in week 1, two sessions with the team leads (s3 b2); not
//     small print, projects slip because the client side did not deliver
//     (s3 b3); named up front, a shared commitment instead of an excuse
//     (card, s3 b3)
//   proposal teach 4: two or three options, not one: diagnostic only; plus a
//     pilot ("in one region" on the card); the full programme (s3 b4); one
//     option invites yes or no, options a choice between yeses (s3 b5); five
//     or six pages; walk the sponsor through the outline by phone (s3 b6), so
//     the document confirms a conversation (card, s3 b6). Not said: the pointer to Intake (Writing the
//     proposal) for the SCQ opening and fixed price against time and
//     materials (navigation to another lesson, not this lesson's content).
//   proposal teach 5: proposals mostly about the consultancy (s4 b1);
//     purchasing compares on day rate alone; ask early how the choice is made
//     and by whom (s4 b2); consultants disagree on showing later phases'
//     price: a range builds trust, a single number gets fixed (s4 b3); "if
//     this succeeds, what is different in six months, and how will we see
//     it?" (s4 b4)
//   proposal example: an operations director (s5 b1, her own figure) at a
//     packaging manufacturer (card) calls Vantage; changeovers on two thermoforming lines are
//     slow (s5 b1), heated plastic sheet into trays (card); OEE about 58%, good parts at full
//     speed for 58% of planned time; €60k budget (s5 b2); in the intake: a
//     large customer threatens to move volume unless on-time delivery rises
//     above 85% (s5 b3); purchasing wants three quotes and a fixed-price plan
//     (s5 b4); lead with her problem: 85%, a key customer at risk (card), OEE
//     58% as the likely cause; outcome: above 95% by a named date (s5 b5);
//     phase 1, three weeks, 12 days, €14.400 fixed; phase 2 as two options
//     with a price range (s5 b6), it shows where the lost hours go and phase
//     2 is fixed after phase 1 (card); line data from the MES, the production
//     engineer one day a week, the sponsor every two weeks (s5 b7), the MES
//     logs what the lines do (card); the total inside €60k (with the phase-1
//     share drawn as a bar, card); call before sending, ask how purchasing
//     will compare the quotes (s5 b8)
//   pricing teach 1: three ways to price; day rate per day worked, €1.200,
//     simple, the client carries the overrun risk, rewards hours not results
//     (s6 b1); fixed price, one fee, €48k, for an agreed scope; the client
//     knows the bill, you carry the risk (s6 b2), scope as the written list of
//     deliverables (card); value-based pricing, the fee linked to the result's worth,
//     €80k for a change worth €900k a year (s6 b3); the three on one slider
//     (card)
//   pricing teach 2: most upside only when the value is measurable, the
//     baseline agreed with the client, and you control enough of the result
//     (s6 b4); advocates such as Alan Weiss: the fairest model for both sides;
//     many purchasing departments prefer day rates, easy to compare (s6 b5);
//     works best with a client who already trusts you (s6 b6). Not said: the
//     pointer to level 3 (Value pricing and its critics), navigation.
//   pricing teach 3: a fixed price is a bet on your estimate: 40 days, €48k,
//     it takes 50 (s7 b1): your real rate drops to €960 (s7 b2); a risk
//     margin, often 15 to 25% on top, for what you don't yet know (s7 b3);
//     write the scope tightly: deliverables, number of sessions, what is out
//     (s7 b4); every written assumption, "data available in week 1", is the
//     basis for a change request if it fails (s7 b5)
//   pricing teach 4: a change request, work outside the scope, a short
//     written agreement to add or swap work with days and price (s7 b6);
//     protect the scope in the moment (card), kindly: "one more analysis":
//     "happy to; outside what we agreed; about three days; add it as a
//     change, or swap it" (s7 b7), "for the second workshop" (card); free once
//     sets everything after at zero (s7 b8)
//   pricing teach 5: 10% off €1.200 is €1.080, about 11% more days, 1.200 /
//     1.080 about 1,11 (s8 b1, the division on the card); trade a discount: a
//     longer commitment, a named reference case, faster payment, less scope
//     (s8 b2); never a bare discount, don't cut the first phase to win the
//     work, it teaches that your price is where the negotiation starts
//     (s8 b3); "what would you like to leave out?" (s8 b4)
//   pricing example: a plant director, scrap on an extrusion line (pushing
//     hot plastic through a shaped opening into profiles: card); scrap about
//     €400k a year; he asks for a fixed price (s9 b1); 30 days if the quality
//     data is clean, 45 if not, known in week 2 (s9 b2); day rate €1.200
//     (card, s9 b2); a
//     competitor quoted €30k (s9 b3); don't bet on the clean case: split it,
//     phase 1 of 8 days fixed, €9.600, including the data check (s9 b4);
//     phase 2 fixed on what you found, 22 or 37 days, plus a 15% margin
//     (s9 b5); or a value option: a lower fixed fee plus a bonus if scrap
//     falls, measured by his controller (s9 b6), by an agreed amount and the
//     controller as the finance person who checks the numbers (card); on the
//     €30k: compare what each quote delivers and who carries the risk (s9
//     b7), "I can't judge their scope", "if the data is poor" (card) and
//     don't match it blind (caption and card). Not said: the
//     pointer to Negotiating (Negotiating scope and time), navigation.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, minSceneDur, wordsOf, sayable } from '../_kit/timeline.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// What the film states, asserted against the lessons' current text (the build
// fails if one drifts); {n:...} numbers are then checked against the Dutch
// lesson text by defineFilm.
const PRO = 'pm.consult.proposal';
const PRI = 'pm.consult.pricing';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const textOf = (id, lang = 'nl') => { const l = lessons[lang].get(id); return `${l.teach.join('\n')}\n${l.example.text}`; };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(PRO, ['Een offerte wint op de eerste pagina', 'Begin met het probleem van de klant, in hun woorden en getallen',
  '14% van de geplande klussen wordt afgezegd; elke afzegging kost een ploegdag; jullie doel is 8% in Q4',
  'de manager die het project betaalt en er eigenaar van is', '“ja, precies dat”, dan ben je al een heel eind', 'Je aanpak komt later',
  'de maatstaf, de nulmeting (het niveau van vandaag, gemeten voordat je begint), het doel en wie er eigenaar van is', 'Dan de aanpak, in fases',
  'Een goede eerste fase is een diagnosefase: kort en goedkoop, bijvoorbeeld drie weken, 12 adviesdagen, € 14.400', 'go/no-go-besluit: doorgaan, bijsturen of stoppen',
  'De rest prijs je pas als je de data gezien hebt, en dat verlaagt het risico voor beide kanten',
  'Schrijf de inzet van de klant op: wat je van hen nodig hebt', 'De sponsor één uur per twee weken', 'één persoon aan hun kant, één dag per week',
  'Toegang tot de planningsdata in week 1', 'Twee sessies met de teamleiders', 'Dit zijn geen kleine lettertjes', 'veel projecten lopen uit omdat de klantkant niet leverde',
  'een gedeelde afspraak in plaats van later een excuus',
  'Bied twee of drie opties, niet één: alleen de diagnose; diagnose plus een pilot in één regio; het volledige programma', 'Eén optie vraagt om ja of nee; opties vragen om een keuze tussen ja’s',
  'Houd het op vijf of zes pagina’s', 'Loop de opzet vóór het versturen telefonisch door met de sponsor', 'zodat het document een gesprek bevestigt in plaats van er een te beginnen',
  'offertes die vooral over het adviesbureau gaan en nauwelijks over de klant', 'inkoopafdelingen die offertes alleen op dagtarief vergelijken', 'Vraag vroeg hoe de keuze gemaakt wordt, en door wie',
  'Adviseurs verschillen van mening over de prijs van latere fases noemen: een bandbreedte schept vertrouwen, één getal blijft hangen in het hoofd van de klant',
  '“Als dit lukt, wat is er over zes maanden anders, en waar zien we dat aan?”',
  'Een operationeel directeur bij een verpakkingsfabrikant belt Vantage', 'twee thermovormlijnen, die verwarmde kunststof plaat tot bakjes vormen, gaat traag',
  'De OEE (overall equipment effectiveness) zit rond de 58%: de lijnen maken maar 58% van hun geplande tijd goede stuks op volle snelheid', 'Ze heeft dit jaar € 60k budget',
  'een grote klant is die dreigt volume weg te halen als de leverbetrouwbaarheid (on-time delivery) niet boven de 85% uitkomt', 'Haar inkoopafdeling wil drie offertes en “een helder plan met een vaste prijs”',
  'leverbetrouwbaarheid op 85%, een belangrijke klant die dreigt te vertrekken, en een OEE van rond de 58% op de twee lijnen als waarschijnlijke oorzaak', 'leverbetrouwbaarheid boven de 95% op een concrete datum',
  'Fase 1: een diagnose van drie weken, 12 dagen, € 14.400 vast, die laat zien waar de verloren uren zitten', 'Fase 2 als twee opties met een prijsbandbreedte, die vast wordt na fase 1',
  'lijndata uit het MES (het systeem dat bijhoudt wat de lijnen doen), één dag per week van de productie-engineer, de sponsor elke twee weken', 'Blijf in totaal binnen de € 60k',
  'Bel haar voor je het verstuurt, en vraag hoe inkoop de drie offertes gaat vergelijken']);
says(PRI, ['Drie manieren om te prijzen', 'Met een dagtarief reken je per gewerkte dag, zeg € 1.200', 'het risico op uitloop ligt bij de klant, maar je wordt betaald voor uren, niet voor resultaat',
  'Met een vaste prijs spreek je één bedrag af, zeg € 48k, voor een afgesproken scope, de lijst van wat je oplevert', 'de klant weet wat het kost, jij draagt het risico',
  'Bij een waardegebaseerde prijs hangt de fee aan wat het resultaat waard is, zeg € 80k voor een verandering van € 900k per jaar',
  'Een waardegebaseerde prijs heeft het meeste potentieel, maar alleen als de waarde meetbaar is, je de nulmeting (baseline) met de klant afspreekt, en jij genoeg invloed hebt op het resultaat',
  'Voorstanders zoals Alan Weiss vinden het het eerlijkste model voor beide kanten', 'Veel inkoopafdelingen willen toch liever dagtarieven, omdat die makkelijk te vergelijken zijn',
  'In de praktijk werkt een waardefee het best bij een klant die je al vertrouwt',
  'Een vaste prijs is een gok op je schatting. Schat je 40 dagen, vraag je € 48k en kost het er 50, dan zakt je echte tarief naar € 960',
  'Reken dus een risico-opslag, vaak 15 tot 25% erbovenop, voor wat je nog niet weet', 'schrijf de scope strak op: opleveringen, aantal sessies, wat er buiten valt',
  'Elke aanname die je opschrijft, zoals “data beschikbaar in week 1”, is een grond voor meerwerk als hij niet klopt',
  'Meerwerk is werk buiten de scope; leg het vast in een korte schriftelijke afspraak (change request) om werk toe te voegen of te ruilen, met de dagen en de prijs erbij', 'Bewaak de scope op het moment zelf, vriendelijk',
  '“Doe ik graag. Het valt buiten wat we hebben afgesproken. Het is zo’n drie dagen; zal ik het als meerwerk toevoegen, of ruilen we het tegen de tweede workshop?”', 'Eén keer gratis zet de prijs van alles daarna op nul',
  'Tien procent van € 1.200 af is € 1.080, dus je moet zo’n 11% meer dagen werken voor hetzelfde geld (1.200 / 1.080 ≈ 1,11)',
  'een langere opdracht, een referentiecase met naam, sneller betalen, of minder scope', 'Nooit kale korting, en ga niet met de prijs van de eerste fase zakken om het werk binnen te halen',
  'dan leert de klant dat je prijs het begin van de onderhandeling is', '“Wat wil je eruit laten?”',
  'Een plantdirecteur wil dat Vantage de uitval (scrap) op een extrusielijn omlaag brengt, een lijn die hete kunststof door een vormopening perst om profielen te maken',
  'De uitval kost zo’n € 400k per jaar. Hij vraagt een vaste prijs', 'Jij schat 30 dagen als de kwaliteitsdata schoon is en 45 als dat niet zo is, en dat weet je pas in week 2',
  'Je dagtarief is € 1.200', 'een concurrent € 30k offreerde', 'Gok niet op het schone scenario', 'een fase 1 van 8 dagen tegen een vaste prijs, € 9.600, inclusief het checken van de data',
  'Daarna een vaste prijs voor fase 2 op basis van wat je vond: 22 dagen als de data schoon is, 37 als dat niet zo is, plus 15% opslag',
  'een lagere vaste fee plus een bonus als de uitval met een afgesproken hoeveelheid daalt, gemeten door zijn controller, degene bij financiën die de cijfers bewaakt',
  '“Ik kan hun scope niet beoordelen. Laten we vergelijken wat elke offerte oplevert, en wie het risico draagt als de data slecht is.”', 'Ga niet blind naar dat bedrag zakken']);
says(PRO, ['three weeks, 12 consultant days, €14,400', 'OEE (overall equipment effectiveness) is around 58%', 'if on-time delivery doesn’t rise from 85%', 'on-time delivery above 95% by a named date'], 'en');
says(PRI, ['say €1,200', 'say €48k', 'say €80k for a change worth €900k a year', 'often 15–25% on top', 'your real rate drops to €960', 'Ten per cent off €1,200 is €1,080', '22 days if the data is clean, 37 if not, plus a 15% margin', 'a competitor quoted €30k'], 'en');
// the diagnostic: 12 days at the €1.200 rate is €14.400, a quarter of the €60k budget
const DIAG = { days: 12, rate: 1200, fee: 14400, budget: 60000 };
assert(DIAG.days * DIAG.rate === DIAG.fee, '12 × €1.200 = €14.400');
assert(DIAG.fee < DIAG.budget && Math.round((DIAG.fee / DIAG.budget) * 100) === 24, 'phase 1 is 24% of the €60k budget');
// the fixed-price bet: €48k for 40 days is the €1.200 rate; over 50 days it is €960, 20% under it
const BET = { fee: 48000, est: 40, real: 50, rate: 960 };
assert(BET.fee / BET.est === DIAG.rate, '€48k over 40 days is €1.200 a day');
assert(BET.fee / BET.real === BET.rate, '€48k over 50 days is €960 a day');
assert(Math.round((1 - BET.rate / DIAG.rate) * 100) === 20, '€960 is 20% under €1.200');
// the discount: 10% off €1.200 is €1.080; 1.200 / 1.080 is about 1,11, so about 11% more days
const DISC = { pct: 10, net: 1080, more: 11 };
assert(DIAG.rate * (1 - DISC.pct / 100) === DISC.net, '10% off €1.200 = €1.080');
assert(Math.round((DIAG.rate / DISC.net - 1) * 100) === DISC.more, '1.200 / 1.080 ≈ 1,11');
// the extrusion line: phase 1 of 8 days, phase 2 of 22 or 37, together the 30 or 45 of the estimate
const EXT = { p1: 8, clean: 22, dirty: 37, est: [30, 45], margin: 15 };
assert(EXT.p1 + EXT.clean === EXT.est[0] && EXT.p1 + EXT.dirty === EXT.est[1], '8 + 22 = 30 and 8 + 37 = 45');
assert(EXT.p1 * DIAG.rate === 9600, '8 days at €1.200 = €9.600');
// the risk margin range and the value example as the lesson writes them
const VAL = { fee: 80, worth: 900 };
assert(VAL.fee < VAL.worth, 'the value fee is a fraction of the change');

// ---------------------------------------------------------------- the world
const W = 640;
const H = 400;
const AZ = 58;
const ROOM = { w: 300, d: 240, h: 230 };
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, 318, H, { pad: 12, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;

const BOARD = w.board({ x0: 60, x1: 230, z0: 92, z1: 196 });
const TABLE = { x: 96, y: 118, w: 150, d: 72, h: 74 };
const TZ = TABLE.h;
// the proposal's first page on the table, which fills in as the film builds it
const SHEET = w.sheet({ x: 150, y: 140, z: TZ, w: 21, d: 29.7 });
const SHEET_AT = w.at([160, 155, TZ]);
// the phone: a flat slab with a dark screen, by the sponsor's place
const PHONE = { x: 214, y: 132, w: 8, d: 15 };
const PHONE_AT = w.at([PHONE.x + 4, PHONE.y + 7, TZ]);
const phone = w.box({ ...PHONE, r: 1.2 }, TZ, TZ + 1.1, { tone: 'lo' }, { steps: 2 })
  + `<g transform="${w.planeTop(PHONE.x, PHONE.y, TZ + 1.15)}"><path class="pm-screen" d="${w.rectD(0.8, 1.2, PHONE.w - 1.6, PHONE.d - 2.4)}"/></g>`;
// the panel's card area that the board copies, in stage units
const PANEL_AREA = { x: 324, y: 52, w: 304, h: 336 };
const fitInto = (a, x0, y0, x1, y1) => {
  const s = Math.min((x1 - x0) / a.w, (y1 - y0) / a.h);
  const ox = x0 + ((x1 - x0) - a.w * s) / 2;
  const oy = y0 + ((y1 - y0) - a.h * s) / 2;
  return `translate(${ox.toFixed(2)} ${oy.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-a.x} ${-a.y})`;
};
const BA = BOARD.area;
const boardMini = `<g transform="${BOARD.face}"><g class="pm-mini" transform="${fitInto(PANEL_AREA, BA.x0 + 3, -BA.z1 + 3, BA.x1 - 3, -BA.z0 - 3)}">${g('bMini', '')}</g></g>`;
const sheetLines = `<g transform="${SHEET.face}">${g('dLines', '')}</g>`;

// the operations director of the thermoforming example (s5), "she" in the
// lesson: a figure of this film's own (as pm.close.results gave its controller
// one; films/_pm/world.mjs stays read-only), in the sponsor's place, shown only
// in s5, where the sponsor (suit and tie, "he" in s1 to s4 and s9) steps out:
// a rust blazer without a tie, a light blouse front, and hair to the collar.
// Built from the world's parts with the person's proportions (world.mjs
// person(), shoulders along y).
function directorFigure({ x, y }) {
  const S = (paths, style) => k.solidSvg(paths, style);
  const skin = { tone: 'hi', crease: 'none', className: 'od-skin' };
  const jacket = { tone: 'mid', className: 'od-jkt' };
  const out = [w.halo({ x: x - 16, y: y - 12, w: 32, d: 24, r: 10 })];
  for (const s of [-7, 7]) {
    out.push(w.box({ x: x - 5, y: y + s - 5, w: 14, d: 10, r: 2.4 }, 0, 4.5, { tone: 'lo' }, { steps: 2 }));
    out.push(w.post(x, y + s, 6.4, 4, 84, { tone: 'lo' }, 14));
  }
  const torso = { x: x - 10, y: y - 16, w: 20, d: 32, r: 5.5 };
  const arm = (s) => w.box({ x: x - 4, y: y + s - 4, w: 8, d: 8, r: 3 }, 90, 140, jacket, { steps: 2 });
  out.push(arm(-20.5));
  out.push(w.box(torso, 82, 144, jacket, { steps: 4, bevel: 0.6, inner: k.lineSvg(k.sideSeam(torso, 136, P, 4), { tone: 'lo' }) }));
  // the light blouse front between the lapels, no tie
  out.push(w.box({ x: x + 10, y: y - 4, w: 0.8, d: 8, r: 0.4 }, 118, 143, { tone: 'hi', className: 'od-blouse' }, { steps: 1 }));
  out.push(arm(20.5));
  // hair to the collar behind the neck, then the neck and the head
  out.push(w.box({ x: x - 9.5, y: y - 9.5, w: 17, d: 19, r: 6 }, 141, 160, { tone: 'lo', className: 'od-hair' }, { steps: 3 }));
  out.push(w.post(x, y, 4.4, 144, 150, skin, 12));
  out.push(S(G.sphereOf([x - 1.4, y - 1.4, 163], 12.4, P, { steps: 28 }), { tone: 'lo', crease: 'none', className: 'od-hair' }));
  out.push(S(G.sphereOf([x + 0.5, y + 0.5, 160.5], 11.4, P, { steps: 28 }), skin));
  return `<g data-cue="director">${out.join('')}</g>`;
}
const director = directorFigure({ x: 270, y: 152 });
assert(director.includes('data-cue="director"') && !director.includes('data-cue="sponsor"'), 'the director is a cue group of its own');

const world = [
  w.room(ROOM),
  w.clock(266, 186, 11),
  cueG('board', BOARD.svg + boardMini),
  w.person({ x: 44, y: 50, role: 'jij', along: 'x', reach: [72, 6, 150] }),
  w.chair({ x: 136, y: 100, back: -1 }),
  w.person({ x: 76, y: 182, role: 'teamlead', along: 'y' }),
  w.table(TABLE),
  cueG('paper', SHEET.svg + sheetLines),
  cueG('laptop', w.laptop({ x: 118, y: 136, z: TZ, toward: 1 })),
  cueG('phone', phone),
  w.cup(132, 178, TZ),
  g('spWrap', w.person({ x: 270, y: 152, role: 'sponsor', along: 'y' })),
  g('odWrap', director, ' style="display:none"'),
  w.person({ x: 236, y: 218, role: 'planner', along: 'x' }),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every block the panel draws is a static cue group here (the player lights
// the groups it finds at start, so each beat's focus names the block it
// explains); the stage fills their contents per scene: o[key] goes into data-k
// "t_<key>".
const SLOTS = ['page1', 'problem', 'yes', 'method',
  'outcome', 'base', 'diag', 'gonogo', 'later',
  'commit', 'slip', 'opts', 'choice', 'call',
  'about', 'buyer', 'range', 'six',
  'call5', 'oee', 'worry', 'buy5', 'lead', 'goal5', 'ph1', 'need', 'total',
  'slide', 'day', 'fixed', 'value', 'cond', 'weiss', 'trust',
  'bet', 'margin', 'scopel', 'assume', 'change', 'script', 'free',
  'disc', 'trade', 'never', 'leave',
  'ask9', 'est', 'comp', 'split', 'ph2b', 'valopt', 'thirty'];
const slot = (key) => cueG(key, g(`t_${key}`, ''));
const PX = 322;
const PW = 308;
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>` + g('pHead', '') + SLOTS.map(slot).join(''));

// Static paths with relative line-tos (the helper of pm.land.handover): the
// same points, fewer bytes; each rewrite is read back.
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
const PH = PHONE_AT.map((v) => Math.round(v * 10) / 10);
const SH = SHEET_AT.map((v) => Math.round(v * 10) / 10);
const CAM = [
  { from: [PH[0], PH[1], 1.02], to: [SH[0], SH[1], 1.12] },
  { from: [150, 200, 1.04], to: [140, 180, 1.1] },
  { from: [150, 210, 1.02], to: [PH[0], PH[1], 1.1] },
  { from: [140, 190, 1.06], to: [170, 200, 1.1] },
  { from: [PH[0], PH[1], 1.08], to: [SH[0], SH[1], 1.12] },
  { from: [150, 210, 1], to: [130, 190, 1.08] },
  { from: [160, 200, 1.04], to: [180, 200, 1.1] },
  { from: [170, 210, 1.06], to: [150, 210, 1] },
  { from: [180, 200, 1.02], to: [SH[0], SH[1], 1.1] },
];

// ---------------------------------------------------------------- the film
const sc = (id, lesson, title, beats) => ({ id, lesson, level: 1, dur: 30, still: 0.9, title, beats });
const spec = {
  id: 'pm.consult.proposal',
  title: { nl: 'Van telefoontje tot offerte', en: 'From phone call to proposal' },
  lessons: [PRO, PRI],
  strictFocus: true,
  scenes: [
    sc('s1', PRO, { nl: 'Pagina één', en: 'Page one' }, [
      { nl: 'Een klant belt. Een offerte wint op pagina één.', en: 'A client calls. A proposal wins on page one.', focus: ['phone', 'page1'] },
      { nl: 'Hun probleem, in hun getallen: {n:14}% afgezegd, doel {n:8}% in Q4.', en: 'Their problem, in their numbers: {n:14}% cancelled, target {n:8}% by Q4.', focus: ['problem', 'paper'] },
      { nl: 'De sponsor, die betaalt en eigenaar is, denkt: “ja, precies dat.”', en: 'The sponsor, who pays and owns it, thinks: “yes, that’s exactly it.”', focus: ['yes', 'sponsor'] },
      { nl: 'Je aanpak komt later.', en: 'Your method comes later.', focus: 'method' },
    ]),
    sc('s2', PRO, { nl: 'Uitkomst en diagnose', en: 'Outcome and diagnostic' }, [
      { nl: 'Dan de uitkomst: maatstaf, {t:Nulmeting|nulmeting}, doel en eigenaar.', en: 'Then the outcome: measure, {t:Baseline|baseline}, target and owner.', cue: { Nulmeting: 'base' }, focus: ['outcome', 'base'] },
      { nl: 'Eerst een {t:Diagnosefase|diagnosefase}: kort en goedkoop, zoals drie weken, {n:12} adviesdagen, € {n:14400}.', en: 'First a {t:Diagnostic phase|diagnostic phase}: short and cheap, say three weeks, {n:12} consultant days, €{n:14400}.', cue: { Diagnosefase: 'diag' }, focus: 'diag' },
      { nl: 'Die eindigt met een {t:Go/no-go-besluit|go/no-go-besluit}: doorgaan, bijsturen of stoppen.', en: 'It ends in a {t:Go/no-go decision|go/no-go decision}: continue, change course or stop.', cue: { 'Go/no-go-besluit': 'gonogo' }, focus: 'gonogo' },
      { nl: 'De rest prijs je na de data: minder risico voor beide kanten.', en: 'You price the rest after the data: less risk for both sides.', focus: 'later' },
    ]),
    sc('s3', PRO, { nl: 'Inzet en opties', en: 'Commitments and options' }, [
      { nl: '{t:Inzet van de klant|Inzet van de klant}: wat je van hen nodig hebt.', en: '{t:Client commitments|Client commitments}: what you need from them.', cue: { 'Inzet van de klant': 'commit' }, focus: ['commit', 'sponsor'] },
      { nl: 'Planningsdata in week 1, twee sessies met de teamleiders.', en: 'Planning data in week 1, two sessions with the team leads.', focus: ['commit', 'teamlead'] },
      { nl: 'Geen kleine lettertjes: veel uitloop begint aan de klantkant.', en: 'Not small print: many slips start on the client side.', focus: 'slip' },
      { nl: 'Bied twee of drie {t:Opties|opties}: alleen diagnose, plus een pilot, of het hele programma.', en: 'Offer two or three {t:Options|options}: diagnostic only, plus a pilot, or the full programme.', cue: { Opties: 'opts' }, focus: 'opts' },
      { nl: 'Eén optie vraagt ja of nee; opties vragen een keuze tussen ja’s.', en: 'One option invites yes or no; options invite a choice between yeses.', focus: 'choice' },
      { nl: 'Vijf of zes pagina’s. Loop de opzet eerst telefonisch door.', en: 'Five or six pages. Walk through the outline by phone first.', focus: ['call', 'phone'] },
    ]),
    sc('s4', PRO, { nl: 'Wat je in de praktijk ziet', en: 'What you see in practice' }, [
      { nl: 'Vaak: offertes over het adviesbureau, nauwelijks over de klant.', en: 'Often: proposals about the consultancy, hardly about the client.', focus: 'about' },
      { nl: 'Inkoop vergelijkt op dagtarief. Vraag vroeg: hoe valt de keuze, en door wie?', en: 'Purchasing compares day rates. Ask early: how is the choice made, and by whom?', focus: ['buyer', 'planner'] },
      { nl: 'Latere fases: een bandbreedte schept vertrouwen, één getal blijft hangen.', en: 'Later phases: a range builds trust, a single number sticks.', focus: 'range' },
      { nl: '“Als dit lukt, wat is er over zes maanden anders, en waaraan zien we dat?”', en: '“If this succeeds, what will be different in six months, and how will we see it?”', focus: ['six', 'jij'] },
    ]),
    sc('s5', PRO, { nl: 'Twee thermovormlijnen', en: 'Two thermoforming lines' }, [
      { nl: 'Een operationeel directeur belt Vantage: het omstellen op twee thermovormlijnen gaat traag.', en: 'An operations director calls Vantage: changeovers on two thermoforming lines are slow.', focus: ['call5', 'director'] },
      { nl: 'OEE rond {n:58}%: goede stuks op volle snelheid. Budget € {n:60}k.', en: 'OEE around {n:58}%: good parts at full speed. Budget €{n:60}k.', focus: 'oee' },
      { nl: 'De echte zorg: een grote klant dreigt weg, de leverbetrouwbaarheid is {n:85}%.', en: 'The real worry: a large customer may leave; on-time delivery is {n:85}%.', focus: ['worry', 'director'] },
      { nl: 'Inkoop wil drie offertes en een vaste prijs.', en: 'Purchasing wants three quotes and a fixed price.', focus: ['buy5', 'planner'] },
      { nl: 'Pagina één: dat probleem, OEE als waarschijnlijke oorzaak. Uitkomst: boven {n:95}%, op een datum.', en: 'Page one: that problem, OEE as the likely cause. Outcome: above {n:95}%, by a date.', focus: ['lead', 'goal5', 'paper'] },
      { nl: 'Fase 1: diagnose, {n:12} dagen, € {n:14400} vast. Fase 2: twee opties.', en: 'Phase 1: diagnostic, {n:12} days, €{n:14400} fixed. Phase 2: two options.', focus: 'ph1' },
      { nl: 'Nodig: data uit het MES, de productie-engineer, de sponsor.', en: 'Needed: MES data, the production engineer, the sponsor.', focus: ['need', 'laptop'] },
      { nl: 'Binnen € {n:60}k. Bel vooraf: hoe vergelijkt inkoop de offertes?', en: 'Within €{n:60}k. Call first: how will purchasing compare the quotes?', focus: ['total', 'phone'] },
    ]),
    sc('s6', PRI, { nl: 'Drie manieren om te prijzen', en: 'Three ways to price' }, [
      { nl: '{t:Dagtarief|Dagtarief}: € {n:1200} per dag. De klant draagt de uitloop.', en: '{t:Day rate|Day rate}: €{n:1200} a day. The client carries the overrun.', cue: { Dagtarief: 'day' }, focus: 'day' },
      { nl: '{t:Vaste prijs|Vaste prijs}: € {n:48}k voor een afgesproken {t:Scope|scope}. Jij draagt het risico.', en: '{t:Fixed price|Fixed price}: €{n:48}k for an agreed {t:Scope|scope}. You carry the risk.', cue: { 'Vaste prijs': 'fixed', Scope: 'fixed' }, focus: 'fixed' },
      { nl: '{t:Waardegebaseerde prijs|Waardegebaseerde prijs}: € {n:80}k voor € {n:900}k per jaar aan waarde.', en: '{t:Value-based pricing|Value-based pricing}: €{n:80}k for a change worth €{n:900}k a year.', cue: { 'Waardegebaseerde prijs': 'value' }, focus: 'value' },
      { nl: 'Alleen als de waarde meetbaar is, de nulmeting afgesproken en jouw invloed groot genoeg.', en: 'Only if the value is measurable, the baseline agreed and you control enough of the result.', focus: 'cond' },
      { nl: 'Voorstanders zoals Alan Weiss: het eerlijkste model. Inkoop wil vaak dagtarieven.', en: 'Advocates such as Alan Weiss: the fairest model. Purchasing often wants day rates.', focus: 'weiss' },
      { nl: 'Het werkt het best bij een klant die je al vertrouwt.', en: 'It works best with a client who already trusts you.', focus: 'trust' },
    ]),
    sc('s7', PRI, { nl: 'Vaste prijs, strakke scope', en: 'Fixed price, tight scope' }, [
      { nl: 'Een vaste prijs is een gok: {n:40} dagen geschat, € {n:48}k, het worden er {n:50}.', en: 'A fixed price is a bet: {n:40} days estimated, €{n:48}k, it takes {n:50}.', focus: 'bet' },
      { nl: 'Je echte tarief: € {n:960} per dag.', en: 'Your real rate: €{n:960} a day.', focus: 'bet' },
      { nl: 'Reken een {t:Risico-opslag|risico-opslag}, vaak {n:15} tot {n:25}%, voor het onbekende.', en: 'Add a {t:Risk margin|risk margin}, often {n:15} to {n:25}%, for the unknown.', cue: { 'Risico-opslag': 'margin' }, focus: 'margin' },
      { nl: 'Schrijf de scope strak: opleveringen, sessies, wat erbuiten valt.', en: 'Write the scope tightly: deliverables, sessions, what is out.', focus: 'scopel' },
      { nl: 'Klopt een opgeschreven aanname niet, zoals data in week 1? Dan is het {t:Meerwerk|meerwerk}.', en: 'A written assumption that fails, like data in week 1, is the basis for a {t:Change request|change request}.', cue: { Meerwerk: 'assume' }, focus: 'assume' },
      { nl: 'Meerwerk: kort en schriftelijk, toevoegen of ruilen, met dagen en prijs.', en: 'A change request: short and written, add or swap, with days and price.', focus: 'change' },
      { nl: '“Nog één analyse?” “Graag. Zo’n drie dagen erbuiten: meerwerk, of ruilen?”', en: '“One more analysis?” “Happy to. About three days outside: add it, or swap?”', focus: ['script', 'jij'] },
      { nl: 'Eén keer gratis zet de prijs van alles daarna op nul.', en: 'Free once sets the price of everything after at zero.', focus: 'free' },
    ]),
    sc('s8', PRI, { nl: 'Korting', en: 'Discounts' }, [
      { nl: '{n:10}% van € {n:1200} af is € {n:1080}: zo’n {n:11}% meer dagen.', en: '{n:10}% off €{n:1200} is €{n:1080}: about {n:11}% more days.', focus: 'disc' },
      { nl: 'Korting? Ruil: langere opdracht, referentie met naam, sneller betalen, minder scope.', en: 'A discount? Trade it: a longer commitment, a named reference, faster payment, less scope.', focus: 'trade' },
      { nl: 'Nooit kale korting, en niet zakken met fase 1 om het werk te winnen.', en: 'Never a bare discount, and don’t cut phase 1 to win the work.', focus: 'never' },
      { nl: 'Een scherpe vraag: “Wat wil je eruit laten?”', en: 'A sharp question: “What would you like to leave out?”', focus: ['leave', 'jij'] },
    ]),
    sc('s9', PRI, { nl: 'Uitval op een extrusielijn', en: 'Scrap on an extrusion line' }, [
      { nl: 'Een plantdirecteur wil minder uitval op een extrusielijn: € {n:400}k per jaar. Vaste prijs graag.', en: 'A plant director wants less scrap on an extrusion line: €{n:400}k a year. A fixed price, please.', focus: ['ask9', 'sponsor'] },
      { nl: 'Jij schat {n:30} dagen bij schone data, anders {n:45}. Dat weet je pas in week 2.', en: 'You estimate {n:30} days if the data is clean, else {n:45}. You know in week 2.', focus: 'est' },
      { nl: 'Een concurrent offreerde € {n:30}k.', en: 'A competitor quoted €{n:30}k.', focus: ['comp', 'sponsor'] },
      { nl: 'Gok niet op schoon. Fase 1: {n:8} dagen vast, € {n:9600}, met de datacheck.', en: 'Don’t bet on clean. Phase 1: {n:8} days fixed, €{n:9600}, data check included.', focus: ['split', 'paper'] },
      { nl: 'Fase 2 vast op wat je vond: {n:22} of {n:37} dagen, plus {n:15}% opslag.', en: 'Phase 2 fixed on what you found: {n:22} or {n:37} days, plus a {n:15}% margin.', focus: 'ph2b' },
      { nl: 'Of: een lagere vaste fee plus een bonus als de uitval daalt.', en: 'Or: a lower fixed fee plus a bonus if scrap falls.', focus: 'valopt' },
      { nl: 'Over die € {n:30}k: niet blind zakken. Vergelijk wat elke offerte oplevert en wie het risico draagt.', en: 'On the €{n:30}k: don’t match it blind. Compare what each quote delivers and who carries the risk.', focus: ['thirty', 'jij'] },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat; with the captions and the cards it
// carries every point of the checklist above. No symbol the voice would read
// aloud, no spoken parenthesis or quote; percentages and money as words.
// Dutch checked with espeak-ng phonemes through Piper's own bridge
// (nl_NL-alex, 2026-11-12). Read right without a rule: diagnosefase,
// go/no-go-besluit (the plan's go, no-go rule), nulmeting (nul-meting),
// waardegebaseerde prijs, risico-opslag, meerwerk, workshop, sponsor,
// thermovormlijnen, verpakkingsfabrikant, leverbetrouwbaarheid, OEE and MES
// as letters, controller and scope by the earlier pm rules, and the sums
// (veertien duizend vierhonderd, twaalfhonderd, duizend tachtig). New Dutch
// SAY rules in films/_kit/timeline.mjs (tested; recomputed for every film: no
// other film's spoken text changes): offerte as off-erte (espeak-ng stresses
// OF-ferte) and offertes as off-erte's (espeak-ng reads a French offerTES),
// dagtarief as DAG-tarief (espeak-ng
// stresses -RIEF; lower case only, as pm.run.scope says "Dagtarief:"),
// plantdirecteur with its d, extrusielijn as ex-TRU-sie-lijn, the
// productie-engineer as "entsjinier", Alan Weiss as his English name, and
// Vantage as its English name, "Ventitsj" (espeak-ng reads a French
// van-TAA-zje; no other film says Vantage).
// Said another way because espeak-ng misreads them (they stay in the
// captions and on the cards): fee (Dutch "fee", not "fie": said
// "bedrag" or "prijs op waarde"), adviesdagen (stressed -DAA-: said "dagen"),
// planningsdata, lijndata and kwaliteitsdata (stressed -DAA-ta: said "de data
// van de planning", "data van de lijnen", "data over de kwaliteit"),
// referentiecase (a Dutch "kaa-se": said "referentie"), Q4 (said "het vierde
// kwartaal"), and €9.600 (the kit's rule reads "zesennegentighonderd": said
// negenduizend zeshonderd). A sentence never starts with "Eén". The guard
// below runs on the text after the SAY rules, so a word a rule rewrites
// passes and a misread one fails the build.
const SAY = [
  [ // s1 page one
    { nl: 'Een klant belt voor een offerte. Die wint op de eerste pagina.',
      en: 'A client calls for a proposal. It wins on its first page.' },
    { nl: 'Begin met hun probleem, in hun getallen: {n:14} procent van de klussen afgezegd, doel {n:8} procent.',
      en: 'Start with their problem, in their numbers: {n:14} percent of jobs cancelled, target {n:8} percent.' },
    { nl: 'Denkt de sponsor, die betaalt en eigenaar is: ja, precies dat? Dan ben je al ver.',
      en: 'If the sponsor, who pays and owns it, thinks: yes, exactly, you are most of the way.' },
    { nl: 'Je aanpak komt later.',
      en: 'Your method comes later.' },
  ],
  [ // s2 outcome and diagnostic
    { nl: 'Dan de uitkomst: de maatstaf, de {t:Nulmeting|nulmeting} van vandaag, gemeten voor je begint, het doel, en wie er eigenaar van is.',
      en: 'Then the outcome: the measure, the {t:Baseline|baseline}, today\'s level before you start, the target, and who owns it.' },
    { nl: 'Dan de aanpak, in fases, eerst een {t:Diagnosefase|diagnosefase}: kort en goedkoop, zoals drie weken, {n:12} dagen, {n:14400} euro.',
      en: 'Then the approach, in phases, first a {t:Diagnostic phase|diagnostic phase}: short and cheap, say three weeks, {n:12} days, {n:14400} euros.' },
    { nl: 'Die eindigt met een {t:Go/no-go-besluit|go/no-go-besluit}: doorgaan, bijsturen of stoppen.',
      en: 'It ends in a {t:Go/no-go decision|go/no-go decision}: continue, change course, or stop.' },
    { nl: 'De rest prijs je na de data: minder risico voor beide kanten.',
      en: 'You price the rest after seeing the data: less risk for both sides.' },
  ],
  [ // s3 commitments and options
    { nl: 'Schrijf de {t:Inzet van de klant|inzet van de klant} op: de sponsor een uur per twee weken, een aanspreekpunt een dag per week.',
      en: 'Write down the {t:Client commitments|client commitments}: the sponsor an hour every two weeks, a counterpart one day a week.' },
    { nl: 'Data van de planning in week één, en twee sessies met de teamleiders.',
      en: 'Planning data in week one, and two sessions with the team leads.' },
    { nl: 'Geen kleine lettertjes: veel uitloop begint aan de klantkant.',
      en: 'Not small print: many slips start on the client side.' },
    { nl: 'Bied twee of drie {t:Opties|opties}: alleen de diagnose, plus een pilot, of het hele programma.',
      en: 'Offer two or three {t:Options|options}: diagnostic only, plus a pilot, or the full programme.' },
    { nl: 'Met opties kiest de klant tussen ja\'s, niet tussen ja en nee.',
      en: 'With options the client chooses between yeses, not between yes and no.' },
    { nl: 'Vijf of zes pagina\'s, en loop de opzet eerst telefonisch door met de sponsor.',
      en: 'Five or six pages, and walk the sponsor through the outline by phone first.' },
  ],
  [ // s4 what you see in practice
    { nl: 'Vaak gaan offertes vooral over het adviesbureau, en nauwelijks over de klant.',
      en: 'Proposals are often mostly about the consultancy, and hardly about the client.' },
    { nl: 'En inkoop vergelijkt op dagtarief, dus vraag vroeg hoe de keuze valt, en door wie.',
      en: 'Purchasing compares day rates, so ask early how the choice is made, and by whom.' },
    { nl: 'Over latere fases verschillen adviseurs: een bandbreedte schept vertrouwen, een enkel getal blijft hangen.',
      en: 'On later phases, consultants differ: a range builds trust, a single number sticks.' },
    { nl: 'Vraag voor je schrijft: als dit lukt, wat is er over zes maanden anders, en waaraan zien we dat?',
      en: 'Ask before you write: if this succeeds, what changes in six months, and how will we see it?' },
  ],
  [ // s5 two thermoforming lines
    { nl: 'Een voorbeeld: een operationeel directeur belt Vantage. Het omstellen op twee thermovormlijnen gaat traag.',
      en: 'An example: an operations director calls Vantage. Changeovers on two thermoforming lines are slow.' },
    { nl: 'De OEE zit rond de {n:58} procent van de geplande tijd: goede stuks op volle snelheid. Budget: {n:60} duizend.',
      en: 'The OEE is around {n:58} percent of planned time: good parts at full speed. Budget: {n:60} thousand.' },
    { nl: 'De echte zorg: een grote klant dreigt weg als de leverbetrouwbaarheid niet boven de {n:85} procent komt.',
      en: 'The real worry: a large customer may leave if on-time delivery doesn\'t rise from {n:85} percent.' },
    { nl: 'En inkoop wil drie offertes en een vaste prijs.',
      en: 'And purchasing wants three quotes and a fixed price.' },
    { nl: 'Op pagina één dat probleem, met de OEE als waarschijnlijke oorzaak, en de uitkomst: boven de {n:95} procent op een datum.',
      en: 'Page one: that problem, the OEE as likely cause, and the outcome: above {n:95} percent by a named date.' },
    { nl: 'Fase één: drie weken diagnose, {n:12} dagen, {n:14400} euro vast. Fase twee: twee opties met een bandbreedte.',
      en: 'Phase one: a three-week diagnostic, {n:12} days, {n:14400} euros fixed. Phase two: two options with a price range.' },
    { nl: 'Nodig: data uit het MES, de productie-engineer een dag per week, de sponsor om de twee weken.',
      en: 'Needed: data from the MES, the production engineer one day a week, the sponsor every two weeks.' },
    { nl: 'Binnen de {n:60} duizend, en bel vooraf: hoe vergelijkt inkoop de offertes?',
      en: 'Within the {n:60} thousand, and call first: how will purchasing compare the quotes?' },
  ],
  [ // s6 three ways to price
    { nl: 'Drie manieren om te prijzen. Een {t:Dagtarief|dagtarief}, zeg {n:1200} euro: simpel, de klant draagt de uitloop, je verdient aan uren.',
      en: 'Three ways to price. A {t:Day rate|day rate}, say {n:1200} euros: simple, the client carries the overrun, you are paid for hours.' },
    { nl: 'Een {t:Vaste prijs|vaste prijs}, zeg {n:48} duizend, voor een afgesproken {t:Scope|scope}: de klant weet wat het kost, jij draagt het risico.',
      en: 'A {t:Fixed price|fixed price}, say {n:48} thousand, for an agreed {t:Scope|scope}: the client knows the bill, you carry the risk.' },
    { nl: 'Een {t:Waardegebaseerde prijs|waardegebaseerde prijs} volgt de waarde: zeg {n:80} duizend voor een verandering van {n:900} duizend per jaar.',
      en: '{t:Value-based pricing|Value-based pricing} follows the worth: say {n:80} thousand for a change worth {n:900} thousand a year.' },
    { nl: 'Die heeft het meeste potentieel, als de waarde meetbaar is, de nulmeting afgesproken en jouw invloed groot genoeg.',
      en: 'It has the most upside, if the value is measurable, the baseline agreed, and you control enough of the result.' },
    { nl: 'Voorstanders zoals Alan Weiss vinden het het eerlijkst. Inkoop wil vaak dagtarieven: makkelijk vergelijken.',
      en: 'Advocates such as Alan Weiss find it the fairest. Purchasing often wants day rates: easy to compare.' },
    { nl: 'Het werkt het best bij een klant die je al vertrouwt.',
      en: 'It works best with a client who already trusts you.' },
  ],
  [ // s7 fixed price, tight scope
    { nl: 'Een vaste prijs is een gok: je schat {n:40} dagen, vraagt {n:48} duizend, en het worden er {n:50}.',
      en: 'A fixed price is a bet: you estimate {n:40} days, price {n:48} thousand, and it takes {n:50}.' },
    { nl: 'Dan zakt je echte tarief naar {n:960} euro per dag.',
      en: 'Then your real rate drops to {n:960} euros a day.' },
    { nl: 'Reken dus een {t:Risico-opslag|risico-opslag}, vaak {n:15} tot {n:25} procent, voor wat je nog niet weet.',
      en: 'So add a {t:Risk margin|risk margin}, often {n:15} to {n:25} percent, for what you don\'t yet know.' },
    { nl: 'Schrijf de scope strak op: opleveringen, sessies, wat erbuiten valt.',
      en: 'Write the scope tightly: deliverables, sessions, what is out.' },
    { nl: 'Een opgeschreven aanname die niet klopt, zoals data in week één, is een grond voor {t:Meerwerk|meerwerk}.',
      en: 'A written assumption that fails, like data in week one, is the basis for a {t:Change request|change request}.' },
    { nl: 'Leg meerwerk kort op papier, met dagen en prijs.',
      en: 'Put it in a short written agreement, with days and price.' },
    { nl: 'Nog een analyse? Zeg vriendelijk: graag, maar het is zo\'n drie dagen erbuiten. Meerwerk, of ruilen?',
      en: 'One more analysis? Say kindly: happy to, but it\'s about three days outside. Add it, or swap?' },
    { nl: 'Want een keer gratis zet alles daarna op nul.',
      en: 'Free once sets everything after at zero.' },
  ],
  [ // s8 discounts
    { nl: 'Korting: tien procent van {n:1200} af is {n:1080}, zo\'n {n:11} procent meer dagen voor hetzelfde geld.',
      en: 'Discounts: ten percent off {n:1200} is {n:1080}, about {n:11} percent more days for the same money.' },
    { nl: 'Geef je korting, ruil dan: een langere opdracht, een referentie met naam, sneller betalen, of minder scope.',
      en: 'If you give one, trade it: a longer commitment, a named reference case, faster payment, or less scope.' },
    { nl: 'Nooit kale korting, en zak niet met fase één: dan is je prijs een openingsbod.',
      en: 'Never a bare discount, and don\'t cut phase one: it makes your price an opening bid.' },
    { nl: 'Vraagt iemand korting: wat wil je eruit laten?',
      en: 'Asked for a discount: what would you like to leave out?' },
  ],
  [ // s9 scrap on an extrusion line
    { nl: 'Een plantdirecteur wil minder uitval op een extrusielijn, {n:400} duizend euro per jaar, voor een vaste prijs.',
      en: 'A plant director wants less scrap on an extrusion line, {n:400} thousand euros a year, for a fixed price.' },
    { nl: 'Jij schat {n:30} dagen bij schone data over de kwaliteit, anders {n:45}; dat weet je pas in week twee.',
      en: 'You estimate {n:30} days if the quality data is clean, else {n:45}; you know in week two.' },
    { nl: 'Hij noemt een concurrent die {n:30} duizend offreerde.',
      en: 'He mentions a competitor who quoted {n:30} thousand.' },
    { nl: 'Gok niet op schoon: eerst {n:8} dagen vast, negenduizend zeshonderd euro, met de check van de data.',
      en: 'Don\'t bet on clean: first {n:8} days fixed, nine thousand six hundred euros, data check included.' },
    { nl: 'Dan fase twee vast op wat je vond: {n:22} of {n:37} dagen, plus {n:15} procent opslag.',
      en: 'Then phase two fixed on what you found: {n:22} or {n:37} days, plus a {n:15} percent margin.' },
    { nl: 'Of een waardeoptie: lager vast bedrag, plus een bonus als de uitval daalt, gemeten door zijn controller.',
      en: 'Or a value option: lower fixed fee plus a bonus if scrap falls, measured by his controller.' },
    { nl: 'En die {n:30} duizend? Vergelijk wat elke offerte oplevert, en wie het risico draagt.',
      en: 'And the {n:30} thousand? Compare what each quote delivers, and who carries the risk.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, and in
// Dutch none of the words espeak-ng misreads (see above), checked after the
// SAY rules, so a rule that would bring one back fails the build too
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = /\b(offertes?|Vantage|fee|\w*adviesdag\w*|\w+data\b|\w*case\b|Q4|9\.600|dagtarie\w*|Dagtarie\w*|plantdirecteur|extrusielijn|engineer|Alan|Weiss)\b|(^|[.?!;]\s)Eén\b/i;
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const plain = plainSay(line[lang]);
  // the slash of go/no-go is taken out by the kit's go, no-go rule, so the check runs on the spoken text
  if (/[/&×=+()“”"‘…%€]/.test(sayable(plain, lang))) throw new Error(`narration: a symbol the voice reads aloud in "${plain.slice(0, 50)}"`);
  if (lang === 'nl' && MISREAD.test(sayable(plain, 'nl'))) throw new Error(`narration: "${MISREAD.exec(sayable(plain, 'nl'))[0]}" is misread by the Dutch voice in "${plain.slice(0, 50)}"`);
}
// Scene lengths follow the narration (its words / 2.5, the longer language),
// never shorter than the captions (as shown, with their glosses) need to be
// read; the whole within the 300 s cap.
{
  const shown = resolveFilm(spec, lessons);
  spec.scenes.forEach((s, si) => {
    const said = Math.max(...['nl', 'en'].map((lang) => wordsOf(SAY[si].map((l) => plainSay(l[lang])).join(' '))));
    const read = Math.max(...['nl', 'en'].map((lang) => wordsOf(shown.scenes[si].beats.map((b) => b.text[lang]).join(' '))));
    s.dur = Math.max(Math.ceil(minSceneDur(read)), Math.round(said / 2.5));
    if (process.env.DURS) console.log(s.id, 'said', said, 'read', read, 'dur', s.dur);
  });
  const total = spec.scenes.reduce((a, s) => a + s.dur, 0);
  if (process.env.DURS) console.log('scene seconds', spec.scenes.map((s) => s.dur).join(' '), total);
  if (total > 300) throw new Error(`film is ${total} s, over 300`);
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
const C = { SLOTS, DIAG, BET, DISC, EXT, dur: spec.scenes.map((s) => s.dur) };
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"])';
// the operations director (s5): a rust blazer, a light blouse front, dark hair; her skin as the others' in dark
const DIRECTOR_CSS = `
.iso{--od-rust:#C27E5E}
.iso[data-theme="light"]{--od-rust:#9A4F2E}
[data-cue="director"]:not([data-on]) .od-jkt>:is(.iso-fill,.iso-top){fill:color-mix(in srgb,var(--od-rust) 78%,var(--anatomy-top))}
[data-cue="director"]:not([data-on]) .od-jkt>.iso-shade{fill:color-mix(in srgb,var(--od-rust) 88%,var(--anatomy-shade-0))}
[data-cue="director"]:not([data-on]) .od-blouse>:is(.iso-fill,.iso-top,.iso-shade){fill:#F4F1EA}
.iso:not([data-theme="light"]) [data-cue="director"]:not([data-on]) .od-skin>:is(.iso-fill,.iso-top){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="director"]:not([data-on]) .od-skin>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="director"]:not([data-on]) .od-hair>:is(.iso-fill,.iso-top,.iso-shade){fill:#5A4A3E}
`;
const css = PM_CSS + `
.iso{--sc-you:#5FA877;--sc-them:#C99A5B}
.iso[data-theme="light"]{--sc-you:#3B7F52;--sc-them:#A5712E}
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:5 4}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-axis{fill:none;stroke:var(--anatomy-lo);stroke-width:1.4}
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-dot{fill:var(--anatomy-mid)}
.pm-screen{fill:var(--anatomy-shade-3);stroke:var(--anatomy-lo);stroke-width:.3}
.sc-you{fill:color-mix(in srgb,var(--sc-you) 55%,transparent);stroke:var(--sc-you);stroke-width:1.4}
.sc-them{fill:color-mix(in srgb,var(--sc-them) 55%,transparent);stroke:var(--sc-them);stroke-width:1.4}
.pm-chip{fill:var(--anatomy-shade-1);stroke:var(--anatomy-mid);stroke-width:1.2}
[data-cue][data-on] .pm-card,[data-cue][data-on] .pm-dash,[data-cue][data-on] .pm-chip{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line,[data-cue][data-on] .pm-axis{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.run.scope) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
.pm-mini .pm-txt,.pm-mini .pm-mute,.pm-mini .pm-big,.pm-mini .pm-on{display:none}
.pm-mini *{vector-effect:non-scaling-stroke}
.pm-mini .pm-card,.pm-mini .pm-hot,.pm-mini .pm-line,.pm-mini .pm-chip{stroke-width:.7px}
.pm-mini .pm-axis,.pm-mini .pm-dash,.pm-mini .sc-you,.pm-mini .sc-them{stroke-width:.4px}
` + DIRECTOR_CSS;

const label = {
  nl: 'Een vergaderruimte met een whiteboard (een kleine kopie van het paneel) en een klok. Jij, de adviseur in petrol, staat bij het bord; aan tafel de teamleider, de sponsor in pak (de klant; in het voorbeeld van de thermovormlijnen de operationeel directeur, in een roestbruin jasje) en de planner, hier in de rol van inkoop. Op tafel een telefoon, een laptop en de eerste pagina van de offerte, die zich vult. Rechts een paneel met per scène een kaart, gemarkeerd als schema of voorbeeld: pagina één met het probleem van de klant; uitkomst en nulmeting, een diagnosefase van drie weken en 14.400 euro met een go/no-go-besluit; de inzet van de klant en drie opties; wat je in de praktijk ziet; de offerte voor twee thermovormlijnen binnen 60.000 euro; dagtarief, vaste prijs en waardegebaseerde prijs op één schuif; de vaste prijs als gok, 48.000 euro over 50 dagen is 960 per dag, met risico-opslag en meerwerk; korting, 10 procent eraf is 1.080 euro; en de extrusielijn in twee fases van 8 en 22 of 37 dagen.',
  en: 'A meeting room with a whiteboard (a small copy of the panel) and a clock. You, the consultant in petrol, stand at the board; at the table the team lead, the sponsor in a suit (the client; in the thermoforming example the operations director, in a rust jacket) and the planner, here in the role of purchasing. On the table a phone, a laptop and the proposal\'s first page, which fills in. At the right a panel with one card per scene, marked as diagram or example: page one with the client\'s problem; outcome and baseline, a diagnostic phase of three weeks and 14,400 euros ending in a go/no-go decision; client commitments and three options; what you see in practice; the proposal for two thermoforming lines within 60,000 euros; day rate, fixed price and value-based pricing on one slider; the fixed price as a bet, 48,000 euros over 50 days is 960 a day, with a risk margin and change requests; discounts, 10 percent off is 1,080 euros; and the extrusion line in two phases of 8 and 22 or 37 days.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  const words = (lang) => data.scenes.reduce((a, s) => a + s.beats.reduce((n, b) => n + b.voice[lang].split(/\s+/).filter(Boolean).length, 0), 0);
  console.log(`narration words: nl ${words('nl')}, en ${words('en')}`);
  console.log(`scenes: ${data.scenes.map((s) => s.dur).join(' + ')} = ${data.scenes.reduce((a, s) => a + s.dur, 0)} s`);
}

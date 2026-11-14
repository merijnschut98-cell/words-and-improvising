// Dev tool, not shipped. Builds the module intro film "Het adviesvak in een opdracht / The consulting
// craft in one assignment" for Het adviesvak (pm.consult), the thirteenth module intro film (v17) and the
// last Projects intro of the cluster "Portfolio en advies": the high-over picture at the top of the
// module, before its four topics (Merijn, 13 Nov: "that high-over picture is the thing I need the most").
//
//   node films/pm.consult.intro/build.mjs            build the page
//   node films/pm.consult.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.consult.intro.html: one offline page with the anatomy kit, the stage
// script and the player inlined. The index names it (pm.consult's `intro`), coursehome shows it above the
// topics, sw.js precaches it.
//
// The pattern of the approved pilot (films/pm.plan.intro) and of the reviewed intros after it
// (films/pm.run.intro, pm.negotiate.intro, pm.outside.intro): ONE concrete engagement travels through the
// whole module, the map before the detail, no calculations. The world of field film 3
// (films/pm.field.portfolio), whose station for this module this intro agrees with: line 3 stands in hall B,
// the plant manager pays for your advice, it starts with a proposal about his problem, and the station's two
// tools, a diagnostic phase and the trust equation, are named here too. Here you are the consultant of one
// assignment, seen from start to farewell: too many of the plant manager's planned jobs are still cancelled (the
// problem of the lessons' own example and the goal of the programme in pm.portfolio.intro), and he asks you for advice. Hall B as in field film 3 (line 3 on its floor, the switchboard on the wall, the cable
// connected), with its cast: the plant manager, the team lead and the two operators.
//   s1 the assignment: line 3 stands in hall B, too many jobs are still cancelled, the plant manager asks you for
//      advice and pays for it; the four topics
//   s2 Offerte en prijs: a proposal wins on its first page; his problem in his words and numbers, your
//      approach later; the outcome, the price and what he has to deliver; two or three options   → pm.consult.proposal
//   s3 De relatie als vertrouwde adviseur: he has to dare to tell you what worries him; he cannot judge your
//      method yet and watches small things; ten small promises kept do more than one brilliant analysis;
//      sometimes you advise less work than you could sell                                     → pm.consult.trust
//   s4 Ethiek en onafhankelijkheid: only the client pays for your advice; a supplier's referral fee bends it;
//      telling him what he does not want to hear, facts first; his data holds stop times per employee
//                                                                                        → pm.consult.independence, .data
//   s5 Klant en praktijk laten groeien: the advice is done, you hand over the results and name what else you
//      saw; good, visible work brings the next problem; a known client costs hours, a new one months; a result
//      people repeat in one sentence brings referrals                                         → pm.consult.account, .practice
//   s6 one whole: a proposal about his problem, trust you earn, independent advice, a client who comes back;
//      after the diagnostic phase he decides whether it continues
//   s7 the shared Projects map with Het adviesvak lit, then the module's four topics with their levels as
//      columns, where to start, and what each later level adds
// Definitions as the Basis lessons word them (pm.consult.proposal, .trust, .independence, .account). Each topic
// scene names the tools of that topic's lessons in one short sentence, without explaining them (Merijn's
// checkpoint, 14 Nov), each a term of its lesson: a diagnostic phase (pm.consult.proposal, Basis, as field film
// 3 names it) and the baseline (pm.consult.proposal, Basis; a fixed price is one of three pricing options, not a tool);
// the trust equation (pm.consult.trust, Basis,
// as field film 3 names it); data minimisation and pseudonymising (pm.consult.data, Werkkennis; the scene gives
// their reason: his data holds stop times per employee); positioning and billable days (pm.consult.practice,
// Werkkennis; the scene gives their reason: your own practice; a sales pipeline would collide with the DevOps pipeline). The follow-up (pm.consult.account)
// is the close intro's tool (Klantevaluatie en follow-up, pm.close) and is not named here; the NDA is a word wider than a chip
// and stays in its lesson. The Werkkennis tools named in a Basis scene do not come back in s7, and neither does any
// Basis term a scene named; s7 names what each later level adds and nothing a scene explained or named. Terms
// come from the module's lessons and {n:} numbers from the module's text (the kit's intro mode,
// films/_kit/build-film.mjs); the kit holds the film to its map (every topic named in a caption of its own scene,
// explained in two beats and lit), to the narration guard and to the label fit.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only): the sponsor (the plant manager) and the
// team lead from its cast, the operators drawn with pm.agile.scrum's cast (films/pm.agile.scrum/cast.mjs), the
// things of hall B from the pilot (../pm.plan.intro/hall.mjs), imported, not copied. You, the consultant, are not
// drawn. A panel at the right, in stage space, draws each step as a schema, labelled "voorbeeld" (the plant's
// story) or "schema" (the module's map).
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { textUnits, wrapUnits, CHAR_W } from '../_kit/assert.mjs';
import { mapScene, mapStyles, mapCue, levelWords } from '../_kit/mapscene.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';
import { scrumPerson } from '../pm.agile.scrum/cast.mjs';
import { hallWorld, HALL_CSS } from '../pm.plan.intro/hall.mjs';
import { MODULES } from '../../src/content/courses/index.js';
import pmMap from '../../src/content/courses/maps/pm.js';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));



// ---------------------------------------------------------------- the module
// The map this film draws, asserted against the index (the build fails if the
// module's topics or levels move): s7 names what each level adds.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const MOD = MODULES.find((m) => m.id === 'pm.consult');
const LEVELS = {
  offer: ['pm.consult.proposal', 'pm.consult.pricing', 'pm.consult.valuefee', 'pm.consult.bid'],
  advisor: ['pm.consult.trust', 'pm.consult.roles', 'pm.consult.resistance', 'pm.consult.humble'],
  ethics: ['pm.consult.independence', 'pm.consult.data', 'pm.consult.dilemmas', 'pm.consult.walkaway'],
  grow: ['pm.consult.account', 'pm.consult.practice', 'pm.consult.thought', 'pm.consult.scale'],
};
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'pm.consult has the four topics and levels this film draws');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => t.term)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// a tool is a term of its lesson (a method the lesson teaches, in its glossary), in both languages
const isTerm = (id, term, lang) => assert((lessons[lang].get(id).terms || []).some((t) => t.term === term), `${id} (${lang}) has no term "${term}"`);
// s2: a proposal wins on its first page, with the client's problem in their words and numbers, and the method comes
// later; then the outcome and the approach; the client commitments (what you need from them); two or three options, so
// the client chooses how and not whether; the tools: a diagnostic phase (pm.consult.proposal, Basis, as field film 3
// names it) and the baseline, the cancelled-jobs figure measured before the work starts (Basis)
has('pm.consult.proposal', ['Een offerte wint op de eerste pagina', 'Begin met het probleem van de klant, in hun woorden en getallen', 'Je aanpak komt later', 'Dan de uitkomst en hoe je weet dat je er bent', 'Schrijf de inzet van de klant op: wat je van hen nodig hebt', 'Bied twee of drie opties, niet één', 'Een goede eerste fase is een diagnosefase']);
has('pm.consult.proposal', ['A proposal wins on its first page', 'Start with the client’s problem in their words and numbers', 'Your method comes later', 'Then the outcome and how you will know', 'Write down the client commitments: what you need from them', 'Offer two or three options, not one', 'A good first phase is a diagnostic phase'], 'en');
isTerm('pm.consult.proposal', 'Diagnosefase', 'nl'); isTerm('pm.consult.proposal', 'Diagnostic phase', 'en');
isTerm('pm.consult.proposal', 'Nulmeting', 'nl'); isTerm('pm.consult.proposal', 'Baseline', 'en');
// s3: clients judge reliability first, because they cannot yet judge your method (minutes the same day, the numbers you
// promised); ten small promises kept do more than one brilliant analysis; intimacy is whether they dare to tell you what
// really worries them; sometimes you advise less work than you could sell; the tool: the trust equation
// (pm.consult.trust, Basis, as field film 3 names it; its four parts are not explained here)
has('pm.consult.trust', ['durven ze je te vertellen wat ze echt dwarszit', 'Klanten beoordelen dit als eerste, omdat ze je methode nog niet kunnen beoordelen', 'Stuur de notulen dezelfde dag', 'Tien kleine nagekomen beloftes doen meer dan één briljante analyse', 'soms minder werk adviseren dan je zou kunnen verkopen', 'Die zin verdient zich vele keren terug']);
has('pm.consult.trust', ['can they tell you what really worries them', 'Clients judge this first, because they can’t yet judge your method', 'Send the minutes the same day', 'Ten small promises kept do more than one brilliant analysis', 'sometimes advise less work than you could sell', 'That sentence pays back many times'], 'en');
isTerm('pm.consult.trust', 'Vertrouwensformule', 'nl'); isTerm('pm.consult.trust', 'Trust equation', 'en');
// s4: your advice is only worth paying for if it is independent, no money from anyone but the client; a referral fee,
// money from a vendor for each client you send them, breaks that because the client can no longer tell whether it bent
// you; telling the client what they do not want to hear: facts first, then your conclusion, then what you recommend;
// what you learn at one client stays there; personal data is anything about a person you can identify, such as an
// operator's stop times; the tools: data minimisation and pseudonymising (pm.consult.data, Werkkennis), the scene gives
// the reason
has('pm.consult.independence', ['Je advies is alleen geld waard als het onafhankelijk is', 'voor je advies krijg je van niemand anders geld dan van de klant', 'Een aanbrengfee', 'geld van een leverancier voor elke klant die je naar hem stuurt', 'de klant kan niet meer zien of het je advies gebogen heeft', 'De klant vertellen wat hij niet wil horen', 'eerst de feiten, dan je conclusie, dan je advies', 'wat je bij de ene klant leert, blijft daar']);
has('pm.consult.independence', ['Your advice is only worth paying for if it is independent', 'no money from anyone but the client for the advice you give', 'A referral fee', 'money from a vendor for each client you send them', 'the client can no longer tell whether it bent you', 'Telling the client what they don’t want to hear', 'facts first, then your conclusion, then what you recommend', 'what you learn at one client stays there'], 'en');
has('pm.consult.data', ['alles over een persoon die je kunt herkennen, zoals de stoptijden van een operator', 'Dataminimalisatie', 'is pseudonimiseren de route']);
has('pm.consult.data', ['anything about a person you can identify, such as an operator’s stop times', 'Data minimisation', 'pseudonymise'], 'en');
isTerm('pm.consult.data', 'Dataminimalisatie', 'nl'); isTerm('pm.consult.data', 'Pseudonimiseren', 'nl');
isTerm('pm.consult.data', 'Data minimisation', 'en'); isTerm('pm.consult.data', 'Pseudonymise', 'en');
// s5: growing an account is doing the work so well and so visibly that the next problem comes to you; a second project
// at a client you know costs a few hours of conversation, a new client can take months; established consultants get most
// of their work from people who already know them; at close-out you hand over the results and name the adjacent
// problems you saw; referrals come from results people can repeat in one sentence; the tools: positioning and billable days (pm.consult.practice, Werkkennis). The follow-up
// (pm.consult.account) is the close intro's tool and is not named here
has('pm.consult.account', ['het werk zo goed en zo zichtbaar doen dat het volgende probleem vanzelf naar je toe komt', 'Een tweede project bij een klant die je kent, kost een paar uur praten; een nieuwe klant kan maanden aan gesprekken en offertes kosten', 'halen de meeste gevestigde adviseurs het grootste deel van hun werk bij mensen die hen al kennen', 'afsluiting, het laatste overleg waarin je de resultaten overdraagt', 'Aangrenzende problemen', 'resultaten die mensen in één zin kunnen navertellen']);
has('pm.consult.account', ['doing the work so well, and so visibly, that the next problem comes to you', 'A second project at a client you know costs a few hours of conversation; a new client can take months of meetings and proposals', 'most established consultants get most of their work from people who already know them', 'close-out, the final meeting where you hand over the results', 'Adjacent problems', 'results people can repeat in one sentence'], 'en');
has('pm.consult.practice', ['Verzamel de getallen en de toestemming bij de afsluiting', 'je pijplijn (pipeline) in de gaten: de gesprekken en offertes die werk gaan worden']);
has('pm.consult.practice', ['Collect the numbers and the permission at close-out', 'the conversations and proposals that will become work'], 'en');
isTerm('pm.consult.practice', 'Positionering', 'nl'); isTerm('pm.consult.practice', 'Declarabele dagen', 'nl');
isTerm('pm.consult.practice', 'Positioning', 'en'); isTerm('pm.consult.practice', 'Billable days', 'en');
// s7: the later levels, as the lessons are titled or word them (the grid names what each adds, and nothing a scene
// explained or named: no diagnostic phase, baseline, trust equation, data minimisation, pseudonymising, positioning,
// billable days, referral fee, independence, close-out, adjacent problem, proposal, options; day rate, success fee,
// risk allowance, utilisation, the collaborative role, resistance, humble inquiry, the processor agreement, the newspaper test,
// the termination clause, a point of view and leverage are named here and nowhere else)
const ADDS = [
  ['pm.consult.pricing', 'Dagtarief', 'Day rate'], ['pm.consult.valuefee', 'Succesfee', 'Success fee'], ['pm.consult.bid', 'Risicoreservering', 'Risk allowance'],
  ['pm.consult.roles', 'Samenwerkingsrol', 'Collaborative role'], ['pm.consult.resistance', 'Weerstand', 'Resistance'], ['pm.consult.humble', 'Nederig vragen', 'Humble inquiry'],
  ['pm.consult.data', 'Verwerkersovereenkomst', 'Processor agreement'], ['pm.consult.dilemmas', 'Krantentest', 'Newspaper test'], ['pm.consult.walkaway', 'Opzegclausule', 'Termination clause'],
  ['pm.consult.practice', 'Bezettingsgraad', 'Utilisation'], ['pm.consult.thought', 'Standpunt', 'Point of view'], ['pm.consult.scale', 'Hefboom', 'Leverage'],
];
for (const [id, nlW, enW] of ADDS) { isTerm(id, nlW, 'nl'); isTerm(id, enW, 'en'); }
// s7: the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from
// GRID.x; the words stand on one line each, staggered over two rows (columns 1 and 3 high, 2 and 4 low), so a
// word may be wider than its column but not wider than the room to the next word on its row, nor run off the stage.
const LV = { nl: levelWords('nl'), en: levelWords('en') };
const GRID = { x: 238, col: 98, box: 90, tile: 206 };
for (const lang of ['nl', 'en']) {
  const half = LV[lang].map((word) => textUnits(word) / 2);
  const mid = (j) => GRID.x + j * GRID.col + GRID.box / 2;
  for (let j = 0; j < 4; j++) {
    if (j + 2 < 4) assert(half[j] + half[j + 2] + 12 <= 2 * GRID.col, `level words "${LV[lang][j]}" and "${LV[lang][j + 2]}" (${lang}) meet on their row`);
    assert(mid(j) - half[j] >= GRID.tile + 20 && mid(j) + half[j] <= 636, `level word "${LV[lang][j]}" (${lang}) runs out of the grid`);
  }
}
// the topic titles: "Ethiek en onafhankelijkheid" has a word wider than the kit's 128-unit tile, so, as pm.close.intro,
// the film declares tileUnits = the room of its narrowest title box, the closing grid's tile (GRID.tile less its
// padding), and every title box of the stage wraps with D.tileUnits; the route's rows (284 wide) are wider
const TILE_TEXT = GRID.tile - 12;
for (const t of MOD.topics) for (const lang of ['nl', 'en']) {
  const title = t.title[lang];
  assert(Math.max(...title.split(' ').map(textUnits)) <= TILE_TEXT, `"${title}" (${lang}) has a word wider than the tile`);
  assert(wrapUnits(title, TILE_TEXT, CHAR_W).length <= 3, `"${title}" (${lang}) wraps to more than 3 lines in the tile`);
}

// ---------------------------------------------------------------- the world (hall B, as field film 3)
const W = 640;
const H = 400;
const AZ = 58;
const ROOM = { w: 290, d: 170, h: 215 };
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, 318, H, { pad: 6, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const hall = hallWorld(w, k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;

// where things stand (cm), as in the pilot and field film 3: line 3 on its floor at the back wall at the right under
// the switchboard, line 4 next to it, the power cabinet at the back wall at the left
const SLAB = { x: 176, y: 4, w: 110, d: 60 };
const L3 = { x: 186, y: 16, len: 84, dep: 34 };
const L4 = { x: 64, y: 16, len: 90, dep: 34 };
const CAB = { x: 12, w: 40, d: 26, h: 124 };
const SWB = { x: 218, w: 50, z0: 96, z1: 172 };
const CAL = w.calendar({ y0: 10, z0: 96, weeks: 15, cw: 10, ch: 40 });
const STOP_WEEKS = [12, 13, 14].map((i) => CAL.cell(i).map((v) => Math.round(v * 10) / 10));
const calStop = `<g transform="${CAL.face}">${STOP_WEEKS.map(([a, b, c, d]) => `<path class="pm-cal" d="${w.rectD(a, b, c, d)}"/>`).join('')}</g>`;
const CABLE = [[[0, 100], [32, 100], [32, 28]], [[32, 66], [190, 66], [190, 52]]];
const cablePath = () => CABLE.map((pts) => hall.cable(pts, { dashed: false })).join('');

// the people, as field film 3: the plant manager (the sponsor, who pays for the advice) and the team lead are the pm
// cast, the two operators are pm.agile.scrum's figures. Each stands in a cue group; the stage script shows each
// when the story needs it. You, the consultant, are not drawn.
const person = (role, x, y, along) => w.person({ x, y, role, along });

const world = [
  w.room(ROOM),
  cueG('calendar', CAL.svg + calStop),
  cueG('floor', hall.floorMark(SLAB)),
  cueG('power', hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h }) + cablePath()),
  cueG('switch', hall.switchboard(SWB)),
  cueG('line3', hall.conveyor({ ...L3, cartons: 4 })),
  g('pp-crew', scrumPerson(w, k, G, P, { x: 176, y: 66, key: 'crew', look: 'dev', along: 'x' }) + scrumPerson(w, k, G, P, { x: 278, y: 60, key: 'crew', look: 'dev2', along: 'x' })),
  cueG('line4', hall.conveyor({ ...L4, cartons: 3 })),
  g('pp-lead', person('teamlead', 150, 118, 'x')),
  g('pp-sponsor', person('sponsor', 36, 140, 'y')),
].join('');


// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled
// by the stage script each frame (data-k): the topic tiles (the route and the
// map, or one tile as a scene's heading) with their level columns, and each
// scene's parts. Each topic scene has up to two tool chips (tool1, tool2) for the
// names of its sentence. The shared Projects map (the kit's mapScene) sits under
// the panel; its place Het adviesvak is a cue group of its own (map-consult).
const tiles = ['tOffer', 'tAdv', 'tEth', 'tGrow'].map((key, i) => cueG(key, g(`r${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('route', tiles) + cueG('lv1', g('l1', '')) + cueG('lv2', g('l2', '')) + cueG('lv3', g('l3', '')) + cueG('lv4', g('l4', '')) + cueG('start', g('st', ''))
  + cueG('goal', g('goalB', '')) + cueG('need', g('needB', ''))
  + cueG('page1', g('page1B', '')) + cueG('prob', g('probB', '')) + cueG('give', g('giveB', '')) + cueG('opts', g('optsB', ''))
  + cueG('dare', g('dareB', '')) + cueG('small', g('smallB', '')) + cueG('ten', g('tenB', '')) + cueG('less', g('lessB', ''))
  + cueG('indep', g('indepB', '')) + cueG('fee', g('feeB', '')) + cueG('hard', g('hardB', '')) + cueG('data', g('dataB', ''))
  + cueG('hand', g('handB', '')) + cueG('next', g('nextB', '')) + cueG('known', g('knownB', '')) + cueG('refer', g('referB', ''))
  + cueG('tool1', g('tool1B', '')) + cueG('tool2', g('tool2B', ''))
  + cueG('flow', g('flowB', '')) + cueG('decision', g('decisionB', '')));
// the shared map, Het adviesvak lit, in the stage (the film's closing scene; the stage script moves and fades it)
const CON_PLACE = pmMap.places.find((p) => p.module === 'pm.consult');
const MAP = (await mapScene({ subject: 'pm', highlight: ['pm.consult'] })).replace('<svg class="subject-map"', '<svg class="subject-map" width="640" height="520"');
const MAPZ = [CON_PLACE.x + CON_PLACE.w / 2, CON_PLACE.y + CON_PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('pm.consult')}"`), 'the map lights pm.consult as a cue group');

// Static paths with relative line-tos (the helper of pm.plan.schedule): the
// same points, fewer bytes; each rewrite is read back to prove it exact.
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
const svg = compact(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('mapG', MAP)}${hud}</svg>`);

// ---------------------------------------------------------------- cameras (one gentle move per scene)
// [ox, oy, s]: the point (ox, oy) of the hall, in stage units, is brought to the middle of the hall's half of the
// stage while the hall scales by s (see camera() in stage.js). Each scene looks at what its topic is about.
const cam = (x, y, z, s) => [...w.at([x, y, z]).map((v) => Math.round(v * 10) / 10), s];
const CAM = [
  { from: cam(145, 85, 70, 1), to: cam(150, 85, 70, 1.04) }, // s1 the whole hall, line 3 on its floor
  { from: cam(110, 112, 70, 1.05), to: cam(118, 112, 70, 1.1) }, // s2 the plant manager and the team lead
  { from: cam(60, 120, 70, 1.1), to: cam(52, 122, 70, 1.15) }, // s3 the plant manager
  { from: cam(120, 100, 70, 1.05), to: cam(130, 95, 70, 1.1) }, // s4 the plant manager and the operators at line 3
  { from: cam(105, 112, 70, 1.05), to: cam(110, 110, 70, 1.1) }, // s5 the plant manager and the team lead
  { from: cam(150, 90, 70, 1.05), to: cam(145, 85, 70, 1) }, // s6 the whole hall
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s7 (the map)
];

// ---------------------------------------------------------------- the film
// placeholders: each scene's length is set from the narration below
const DURS = Array(7).fill(30);
const spec = {
  id: 'pm.consult.intro',
  title: { nl: 'Het adviesvak in een opdracht', en: 'The consulting craft in one assignment' },
  module: 'pm.consult',
  // "Ethiek en onafhankelijkheid" has a word wider than the kit's 128-unit tile (asserted above): the film declares the room of
  // its narrowest title box, the closing grid's tile, and every title box of the stage wraps with D.tileUnits
  tileUnits: TILE_TEXT,
  // the map: per topic of pm.consult, the scene that explains it and its tile
  topics: {
    offer: { scene: 's2', cue: 'tOffer' },
    advisor: { scene: 's3', cue: 'tAdv' },
    ethics: { scene: 's4', cue: 'tEth' },
    grow: { scene: 's5', cue: 'tGrow' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Eén opdracht, vier onderwerpen', en: 'One assignment, four topics' },
      beats: [
        { nl: 'Lijn 3 staat in hal B, maar er worden nog te veel klussen afgezegd. De plantmanager vraagt jou om advies.', en: 'Line 3 stands in hall B, but too many jobs are still cancelled. The plant manager asks you for advice.', focus: ['goal', 'line3', 'sponsor'] },
        { nl: 'Hij betaalt voor jouw advies. Dat maakt je rol anders dan die van projectleider.', en: 'He pays for your advice. That makes your role different from a project manager’s.', focus: ['need', 'sponsor'] },
        { nl: 'We volgen de opdracht van begin tot afscheid, langs de vier onderwerpen van de module.', en: 'We follow the assignment from start to farewell, through the four topics of the module.', focus: 'route' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Offerte en prijs', en: 'Proposal and price' },
      beats: [
        { nl: 'Eerste onderwerp is Offerte en prijs. Een offerte wint op de eerste pagina.', en: 'First topic is Proposal and price. A proposal wins on its first page.', focus: ['tOffer', 'page1', 'sponsor'] },
        { nl: 'Daar staat zijn probleem, in zijn eigen woorden en getallen. Je aanpak komt later.', en: 'That page holds his problem, in his own words and numbers. Your method comes later.', focus: ['prob', 'sponsor', 'teamlead'] },
        { nl: 'Dan komen de uitkomst, de prijs en wat hij zelf moet leveren.', en: 'Then come the outcome, the price and what he has to deliver himself.', focus: ['give', 'sponsor'] },
        { nl: 'Je legt twee of drie opties voor. Dan kiest hij hoe hij het inkoopt, niet of.', en: 'You put two or three options to him. Then he chooses how to buy it, not whether.', focus: ['opts', 'sponsor'] },
        { nl: 'Bij de offerte gebruiken we een {t:Diagnosefase|diagnosefase} en een {t:Nulmeting|nulmeting}.', en: 'For the proposal we use a {t:Diagnostic phase|diagnostic phase} and a {t:Baseline|baseline}.', cue: { Diagnosefase: 'tool1', Nulmeting: 'tool2', 'Diagnostic phase': 'tool1', Baseline: 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Vertrouwen', en: 'Trust' },
      beats: [
        { nl: 'Tweede onderwerp is De relatie als vertrouwde adviseur. Hij moet durven vertellen wat hem zorgen baart.', en: 'Second topic is The trusted-advisor relationship. He has to dare to say what worries him.', focus: ['tAdv', 'dare', 'sponsor'] },
        { nl: 'Je methode kan hij nog niet beoordelen. Hij let op kleine dingen, zoals notulen op dezelfde dag.', en: 'He cannot judge your method yet. He watches small things, such as minutes sent the same day.', focus: ['small', 'sponsor'] },
        { nl: 'Tien kleine nagekomen beloftes doen meer dan één briljante analyse.', en: 'Ten small promises kept do more than one brilliant analysis.', focus: ['ten', 'sponsor'] },
        { nl: 'Soms adviseer je minder werk dan je kunt verkopen. Dat verdient zich vele keren terug.', en: 'Sometimes you advise less work than you could sell. That pays back many times.', focus: ['less', 'sponsor'] },
        { nl: 'Bij vertrouwen gebruiken we de {t:Vertrouwensformule|vertrouwensformule}.', en: 'For trust we use the {t:Trust equation|trust equation}.', cue: { Vertrouwensformule: 'tool1', 'Trust equation': 'tool1' }, focus: ['tool1'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Ethiek', en: 'Ethics' },
      beats: [
        { nl: 'Derde onderwerp is Ethiek en onafhankelijkheid. Alleen de klant betaalt voor je advies.', en: 'Third topic is Ethics and independence. Only the client pays for your advice.', focus: ['tEth', 'indep', 'sponsor'] },
        { nl: 'Een leverancier biedt geld per klant die je doorstuurt. De klant kan dan niet zien of het je advies buigt.', en: 'A supplier offers money for each client you send. The client can no longer tell if it bent your advice.', focus: ['fee', 'sponsor'] },
        { nl: 'Soms moet je zeggen wat hij niet wil horen. Eerst de feiten, dan je conclusie, dan je advies.', en: 'Sometimes you must tell him what he does not want to hear. Facts first, then conclusion, then advice.', focus: ['hard', 'sponsor'] },
        { nl: 'Je ziet ook zijn cijfers en de stoptijden per medewerker. Wat je bij hem leert, blijft bij hem.', en: 'You also see his figures and the stop times per employee. What you learn at his plant stays there.', focus: ['data', 'crew'] },
        { nl: 'Voor die data gebruiken we {t:Dataminimalisatie|dataminimalisatie} en {t:Pseudonimiseren|pseudonimiseren}.', en: 'For that data we use {t:Data minimisation|data minimisation} and {t:Pseudonymise|pseudonymising}.', cue: { Dataminimalisatie: 'tool1', Pseudonimiseren: 'tool2', 'Data minimisation': 'tool1', Pseudonymise: 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Groeien', en: 'Growing' },
      beats: [
        { nl: 'Vierde onderwerp is Klant en praktijk laten groeien. Je draagt de resultaten over en noemt wat je zag.', en: 'Fourth topic is Growing the client and the practice. You hand over the results and name what else you saw.', focus: ['tGrow', 'hand', 'sponsor', 'teamlead'] },
        { nl: 'Goed en zichtbaar werk brengt het volgende probleem vanzelf naar je toe.', en: 'Work done well and visibly brings the next problem to you.', focus: ['next', 'sponsor'] },
        { nl: 'Een nieuwe klant kan maanden kosten. Gevestigde adviseurs halen het meeste werk bij bekenden.', en: 'A new client can take months. Established advisors get most of their work from people they know.', focus: ['known', 'sponsor'] },
        { nl: 'Een resultaat dat mensen in één zin navertellen levert doorverwijzingen op.', en: 'A result people can repeat in one sentence brings referrals.', focus: ['refer', 'sponsor'] },
        { nl: 'Voor je eigen praktijk gebruiken we {t:Positionering|positionering} en {t:Declarabele dagen|declarabele dagen}.', en: 'For your own practice we use {t:Positioning|positioning} and {t:Billable days|billable days}.', cue: { Positionering: 'tool1', 'Declarabele dagen': 'tool2', Positioning: 'tool1', 'Billable days': 'tool2' }, focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Eén geheel', en: 'One whole' },
      beats: [
        { nl: 'Het hangt samen. Offerte, vertrouwen, onafhankelijk advies en een klant die terugkomt.', en: 'It connects. Proposal, trust, independent advice and a client who comes back.', focus: ['flow', 'sponsor', 'teamlead', 'crew'] },
        { nl: 'Na de diagnosefase beslist hij of het doorgaat.', en: 'After the diagnostic phase he decides whether it goes on.', focus: ['decision', 'sponsor', 'line3'] },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'Op de kaart van Projecten is Het adviesvak het tweede station van Portfolio en advies.', en: 'On the map of Projects, The consulting craft is the second station of Portfolio and consulting.', focus: mapCue('pm.consult') },
        { nl: 'Deze module heeft vier onderwerpen, elk met vier niveaus.', en: 'This module has four topics, each with four levels.', focus: 'route' },
        { nl: 'Begin bij Offerte en prijs, op niveau Basis.', en: 'Start with Proposal and price, at Basics level.', focus: ['tOffer', 'lv1', 'start'] },
        { nl: 'Op Werkkennis komen dagtarief, samenwerkingsrol, verwerkersovereenkomst en bezettingsgraad erbij.', en: 'At Working knowledge you add day rate, collaborative role, processor agreement and utilisation.', focus: 'lv2' },
        { nl: 'Op Gevorderd komen succesfee, weerstand, de krantentest en een standpunt erbij.', en: 'At Advanced you add success fee, resistance, the newspaper test and a point of view.', focus: 'lv3' },
        { nl: 'Op Expert komen risicoreservering, nederig vragen, de opzegclausule en hefboom erbij.', en: 'At Expert you add risk allowance, humble inquiry, the termination clause and leverage.', focus: 'lv4' },
        { nl: 'Elke les en elke film van deze module heeft een plek op deze kaart.', en: 'Every lesson and film in this module has a place on this map.', focus: null },
      ],
    },
  ],
  skip: [],
  strictFocus: true,
};

// ---------------------------------------------------------------- the narration
// What the voice says, per scene and beat: the high-over picture, each thing said
// once. Short sentences, few colons and comma lists, no symbols the voice would
// read aloud and nothing in parentheses: the kit's narration guard
// (films/_kit/assert.mjs, checkNarration) holds every module film to that, and
// the render guard caps a pause inside a sentence at 0.4 s. Each topic scene ends
// on one short sentence naming the tools of that topic's lessons, without
// explaining them. SAY rules of this film (films/_kit/timeline.mjs, the group at
// the end of the Dutch list, only what espeak-ng needs): see there.
const SAY = [
  [ // s1 one assignment, four topics
    { nl: 'Lijn 3 staat in hal B, maar er worden nog te veel klussen afgezegd. De plantmanager vraagt jou om advies.',
      en: 'Line 3 stands in hall B, but too many jobs are still cancelled. The plant manager asks you for advice.' },
    { nl: 'Hij betaalt voor jouw advies. Dat maakt je rol anders dan die van een projectleider.',
      en: 'He pays for your advice. That makes your role different from that of a project manager.' },
    { nl: 'We volgen de opdracht van begin tot afscheid, langs de vier onderwerpen van de module.',
      en: 'We follow the assignment from start to farewell, through the four topics of the module.' },
  ],
  [ // s2 proposal and price
    { nl: 'Het eerste onderwerp is offerte en prijs. Een offerte wint op de eerste pagina.',
      en: 'The first topic is proposal and price. A proposal wins on its first page.' },
    { nl: 'Daar staat zijn probleem, in zijn eigen woorden en getallen. Je aanpak komt later.',
      en: 'That page holds his problem, in his own words and numbers. Your method comes later.' },
    { nl: 'Dan komen de uitkomst, de prijs en wat hij zelf moet leveren.',
      en: 'Then come the outcome, the price and what he has to deliver himself.' },
    { nl: 'Je legt twee of drie opties voor. Dan kiest hij hoe hij het inkoopt, en niet of.',
      en: 'You put two or three options to him. Then he chooses how to buy it, and not whether.' },
    { nl: 'Bij de offerte gebruiken we een {t:Diagnosefase|diagnosefase} en een {t:Nulmeting|nulmeting}.',
      en: 'For the proposal we use a {t:Diagnostic phase|diagnostic phase} and a {t:Baseline|baseline}.' },
  ],
  [ // s3 the trusted-advisor relationship
    { nl: 'Het tweede onderwerp is de relatie als vertrouwde adviseur. Hij moet durven vertellen wat hem echt zorgen baart.',
      en: 'The second topic is the relationship as a trusted advisor. He has to dare to tell you what really worries him.' },
    { nl: 'Je methode kan hij nog niet beoordelen. Hij let op kleine dingen, zoals de notulen op dezelfde dag.',
      en: 'He cannot judge your method yet. He watches small things, such as the minutes on the same day.' },
    { nl: 'Tien kleine nagekomen beloftes doen meer dan één briljante analyse.',
      en: 'Ten small promises kept do more than one brilliant analysis.' },
    { nl: 'Soms adviseer je minder werk dan je kunt verkopen. Dat verdient zich vele keren terug.',
      en: 'Sometimes you advise less work than you could sell. That pays back many times.' },
    { nl: 'Bij vertrouwen gebruiken we de {t:Vertrouwensformule|vertrouwensformule}.',
      en: 'For trust we use the {t:Trust equation|trust equation}.' },
  ],
  [ // s4 ethics and independence
    { nl: 'Het derde onderwerp is ethiek en onafhankelijkheid. Alleen de klant betaalt voor je advies.',
      en: 'The third topic is ethics and independence. Only the client pays for your advice.' },
    { nl: 'Een leverancier biedt je geld voor elke klant die je naar hem stuurt. Dan kan de klant niet meer zien of het je advies buigt.',
      en: 'A supplier offers you money for each client you send him. Then the client can no longer tell whether it bent your advice.' },
    { nl: 'Soms moet je zeggen wat hij niet wil horen. Eerst de feiten, dan je conclusie, dan je advies.',
      en: 'Sometimes you must tell him what he does not want to hear. First the facts, then your conclusion, then your advice.' },
    { nl: 'Je ziet ook zijn cijfers en de stoptijden per medewerker. Wat je bij hem leert, blijft bij hem.',
      en: 'You also see his figures and the stop times per employee. What you learn at his plant stays there.' },
    { nl: 'Voor die data gebruiken we {t:Dataminimalisatie|dataminimalisatie} en {t:Pseudonimiseren|pseudonimiseren}.',
      en: 'For that data we use {t:Data minimisation|data minimisation} and {t:Pseudonymise|pseudonymising}.' },
  ],
  [ // s5 growing the client and the practice
    { nl: 'Het vierde onderwerp is klant en praktijk laten groeien. Je draagt de resultaten over en noemt wat je nog meer zag.',
      en: 'The fourth topic is growing the client and the practice. You hand over the results and name what else you saw.' },
    { nl: 'Doe het werk zo goed en zichtbaar dat het volgende probleem vanzelf naar je toe komt.',
      en: 'Do the work so well and so visibly that the next problem comes to you.' },
    { nl: 'Een nieuwe klant kan maanden aan gesprekken kosten. Gevestigde adviseurs halen daarom het meeste werk bij mensen die hen al kennen.',
      en: 'A new client can take months of meetings. Established advisors therefore get most of their work from people who already know them.' },
    { nl: 'Een resultaat dat mensen in één zin kunnen navertellen levert doorverwijzingen op.',
      en: 'A result that people can repeat in one sentence brings referrals.' },
    { nl: 'Voor je eigen praktijk gebruiken we {t:Positionering|positionering} en {t:Declarabele dagen|declarabele dagen}.',
      en: 'For your own practice we use {t:Positioning|positioning} and {t:Billable days|billable days}.' },
  ],
  [ // s6 one whole
    { nl: 'Het hangt samen. Een offerte over zijn probleem, vertrouwen dat je verdient, onafhankelijk advies en een klant die terugkomt.',
      en: 'It connects. A proposal about his problem, trust you earn, independent advice and a client who comes back.' },
    { nl: 'Na de diagnosefase beslist hij of het doorgaat.',
      en: 'After the diagnostic phase he decides whether it goes on.' },
  ],
  [ // s7 the map
    { nl: 'Dit is de kaart van Projecten. Het adviesvak is het tweede station van Portfolio en advies.',
      en: 'This is the map of Projects. The consulting craft is the second station of Portfolio and consulting.' },
    { nl: 'Deze module heeft vier onderwerpen, elk met vier niveaus.',
      en: 'This module has four topics, each with four levels.' },
    { nl: 'Begin bij offerte en prijs, op niveau Basis.',
      en: 'Start with proposal and price, at Basics level.' },
    { nl: 'Op Werkkennis komen dagtarief, samenwerkingsrol, verwerkersovereenkomst en bezettingsgraad erbij.',
      en: 'At Working knowledge you add day rate, collaborative role, processor agreement and utilisation.' },
    { nl: 'Op Gevorderd komen succesfee, weerstand, de krantentest en een standpunt erbij.',
      en: 'At Advanced you add success fee, resistance, the newspaper test and a point of view.' },
    { nl: 'Op Expert komen risicoreservering, nederig vragen, de opzegclausule en hefboom erbij.',
      en: 'At Expert you add risk allowance, humble inquiry, the termination clause and leverage.' },
    { nl: 'Elke les en elke film van deze module heeft een plek op deze kaart.',
      en: 'Every lesson and every film in this module has a place on this map.' },
  ],
];
// Each scene's length from its share of the Dutch narration, never shorter than
// its captions need (as pm.plan.wbs).
{
  const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
  const said = SAY.map((sc) => sc.reduce((a, l) => a + wordsOf(plainSay(l.nl)), 0));
  const all = said.reduce((a, b) => a + b, 0);
  const TOTAL = Math.min(298, Math.ceil(all / 2.5) + 2 * SAY.length);
  spec.scenes.forEach((s, si) => {
    const cap = Math.max(...['nl', 'en'].map((lang) => minSceneDur(wordsOf(s.beats.map((b) => plainSay(b[lang])).join(' ')) + 4)));
    s.dur = Math.max(Math.ceil(cap), Math.floor((said[si] / all) * TOTAL));
  });
  const total = spec.scenes.reduce((a, s) => a + s.dur, 0);
  if (total > 300) throw new Error(`film is ${total} s, over 300`);
}
// Each beat's still (reduced motion) sits late in its own share of the scene.
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
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});


// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\nconst LV = ${JSON.stringify(LV)};\nconst MAPZ = ${JSON.stringify(MAPZ)};\nconst GRID = ${JSON.stringify(GRID)};\nconst CW = ${JSON.stringify(CHAR_W)};\nconst wrapUnits = ${wrapUnits.toString()};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="sponsor"],[data-cue="crew"],[data-cue="teamlead"])';
const css = PM_CSS + HALL_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-tile{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:1.2}
.pm-badge{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-out{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:5 4}
.pm-pkg{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-bar{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-crit{fill:color-mix(in srgb,var(--fp-accent) 24%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-stop{fill:color-mix(in srgb,var(--fp-accent) 10%,transparent);stroke:var(--anatomy-lo);stroke-width:1;stroke-dasharray:3 3}
.pm-range{fill:color-mix(in srgb,var(--fp-accent) 16%,var(--anatomy-face));stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-buf{fill:var(--anatomy-shade-1);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:4 3}
.pm-lvl{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-link{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-axis{fill:none;stroke:var(--anatomy-lo);stroke-width:1}
.pm-dia{fill:var(--anatomy-hi);stroke:var(--anatomy-card);stroke-width:1.2}
.pm-rag{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:1.2}
.pm-rag-g{fill:#5E9A6B;stroke:#4A7F56;stroke-width:1.2}
.pm-rag-a{fill:#D49A35;stroke:#B07B22;stroke-width:1.2}
.pm-rag-r{fill:#C2553F;stroke:#9E4030;stroke-width:1.2}
.pm-tick{fill:none;stroke:#fff;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.pm-cal{fill:color-mix(in srgb,var(--fp-accent) 45%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:.6}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-pkg,.pm-bar,.pm-range,.pm-buf,.pm-lvl,.pm-out){stroke:var(--fp-accent)}
[data-cue][data-on] .pm-dia{fill:var(--fp-accent)}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
[data-cue][data-on] .pm-cal{fill:var(--fp-focus)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
` + mapStyles();

const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 nu staat, zoals in de film over portfolio en advies. Op de vloer lijn 3 op zijn plek met een gestippelde omtrek; ernaast staat lijn 4. Links de stroomkast met de kabel van buiten, aan de achterwand de schakelkast, en aan de zijwand een kalender waarvan de laatste drie weken de zomerstop zijn. Per onderwerp staan er mensen: de plantmanager, die voor het advies betaalt, de teamleider en twee operators bij lijn 3. Rechts een paneel, gemarkeerd als voorbeeld of schema: de klussen die te vaak worden afgezegd en de plantmanager die om advies vraagt, met de vier onderwerpen van de module als tegels; een offerte met zijn probleem op de eerste pagina, de uitkomst, de prijs en wat hij zelf levert, en twee of drie opties; vertrouwen dat hij durft te vertellen wat hem dwarszit, kleine dingen die je nakomt en minder werk adviseren dan je kunt verkopen; alleen de klant betaalt, een leverancier die geld biedt per klant, de feiten voor je conclusie en je advies, en zijn data met stoptijden per medewerker; resultaten overdragen, het volgende probleem dat vanzelf komt, een bekende klant tegenover een nieuwe en een resultaat in één zin; per onderwerp een of twee namen van hulpmiddelen; en de keten van offerte tot een klant die terugkomt. Aan het eind de kaart van Projecten met Het adviesvak verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the plant, where line 3 now stands, as in the film about portfolio and consulting. On the floor line 3 in its place with a dashed outline; next to it stands line 4. At the left the power cabinet with the cable from outside, on the back wall the switchboard, and on the side wall a calendar whose last three weeks are the summer shutdown. Each topic brings people: the plant manager, who pays for the advice, the team lead and two operators at line 3. At the right a panel, marked as an example or a diagram: the jobs that are cancelled too often and the plant manager who asks for advice, with the module’s four topics as tiles; a proposal with his problem on the first page, the outcome, the price and what he delivers himself, and two or three options; trust that makes him dare to say what worries him, small things you keep to and advising less work than you could sell; only the client pays, a supplier who offers money per client, the facts before your conclusion and your advice, and his data with the stop times per employee; handing over the results, the next problem that comes by itself, a known client against a new one and a result in one sentence; one or two tool names per topic; and the chain from a proposal to a client who comes back. At the end the map of Projects with The consulting craft lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  const words = (lang) => data.scenes.reduce((a, s) => a + s.beats.reduce((n, b) => n + b.voice[lang].split(/\s+/).filter(Boolean).length, 0), 0);
  console.log(`narration words: nl ${words('nl')}, en ${words('en')}`);
  for (const s of data.scenes) console.log(`  ${s.id}: nl ${s.beats.reduce((n, b) => n + b.voice.nl.split(/\s+/).length, 0)} en ${s.beats.reduce((n, b) => n + b.voice.en.split(/\s+/).length, 0)}`);
}


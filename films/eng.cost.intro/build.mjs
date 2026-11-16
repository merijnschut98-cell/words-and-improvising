// Dev tool, not shipped. Builds the module intro film "Wat een te lichte doos kost / What a too-light carton costs" for Cost engineering
// (eng.cost), an Engineering module intro film (v17, Task 13) and the third intro of the zone "De fabriek beter maken"
// (eng.field.better): the high-over picture at the top of the module, before its four topics (Merijn, 13 Nov: "that high-over
// picture is the thing I need the most"). Pattern and rules: films/eng.machining.intro (the approved reference), the approved
// intros films/eng.improve.intro, eng.safety.intro and eng.maintenance.intro (one clear tool per topic, as short as the content
// allows, nothing labelled before it is named, no SAY rule that is not needed) and the notes section "Engineering module intros".
//
//   node films/eng.cost.intro/build.mjs            build the page
//   node films/eng.cost.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.cost.intro.html: one offline page with the anatomy kit, the stage script and the player
// inlined. The index names it (eng.cost's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The story: hall B of the field film films/eng.field.better ("Na de dienst op lijn 3": too-light cartons keep coming out of the
// filling unit on line 3, you and the team lead stay after the shift to fix it for good; its station Kostprijs en investeringen
// says a too-light carton goes in the bin and costs money, a fix costs money too, and you add up the cost of poor quality and work
// out the cash saving: the crate with the bad cartons stands in front of the belt, the table with the laptop and the sheet for the
// case at the front left). This film follows WHAT THE TOO-LIGHT CARTON OF LINE 3 AND ITS FIX REALLY COST, topic by topic, in the
// room of the field film: the belt with its cartons, the filling unit over it, you and the team lead at the front. What the field
// film's station draws comes in at the sentence that gives it its reason: the crate (the first sentence, the carton goes in the
// bin), the table with the laptop (the sentence that names the laptop) and the sheet on it (the sentence that puts the payback on
// the sheet). Without the field film's tank, chalk circle, board, scale, chart and the two boards of the other stations. The cost
// price, the decision, the investment and the savings are schemas in the panel: the field film's room has no place for them.
//   s1 a too-light carton of line 3 goes in the bin and costs money (the field film's own sentence); the module is about what a part
//      really costs and whether a fix is worth it (the module's blurb); you and the team lead work it out after the shift; the map
//      before any detail: four topics in two groups (what a carton costs and what follows, then the fix and the savings)
//   s2 Kostprijs en uurtarieven: you build the cost price of a carton from the bottom up (Basis, .costprice); every line is a quantity
//      times a rate, such as machine time times an hour rate (Basis, .costprice; the topic's Werkkennis lesson, .hourrate, is the
//      machine hour rate: not named, it is a tool of other modules); a carton scrapped late carries all the cost put into it (Basis,
//      .costprice); the tool is the overhead surcharge (Basis, .costprice), which spreads the indirect costs. The topic has no tool at
//      Basis or Werkkennis that no other module names (the machine hour rate is read as a rate, the overhead surcharge is the most
//      tool-like term of the Basis lesson, a key you apply)
//   s3 Relevante kosten en prijzen: in a decision only the costs that differ between the options count (Werkkennis, .makebuy: said as the
//      topic's idea, not named as a tool); fixed costs stay the same in the short term, variable costs move with each unit (Basis,
//      .contribution); the tool is the contribution margin (Basis, .contribution), the price minus the variable cost of a good carton
//   s4 Investeringen beoordelen: the fix costs money too, spent once on something that lasts for years (Basis, .cashflow); what counts is
//      cash, a saving only counts if money really stops going out or comes in (Werkkennis, .capex); the tool is the cash saving
//      (Werkkennis, .capex), the field film's own tool of this station: the laptop; the investment next to the yearly cash saving goes on
//      the sheet of the case (the payback of the lesson, but the word is not said: it is the tool of eng.lines.intro and pm.intake.intro)
//   s5 Lean accounting en besparingen: waste in money (Werkkennis, .waste); a carton in the bin is priced at what is really lost (Werkkennis, .waste); the tool is the cost of poor quality
//      (Werkkennis, .waste), the field film's other tool of this station: the crate. The story ends: you know what line 3 really costs
//      and whether the fix pays for itself ("lean accounting" is the topic's title, said Lien by a SAY rule, as the Lean-consultant rule)
//   s6 the shared Engineering map (the kit's mapScene) with Cost engineering lit, then the module's four topics with their levels as
//      columns, where to start, and what each later level adds, in the app's level words
// Per the review of the lines, industry40, quality and maintenance intros: one clear tool per topic; drop what is not needed; nothing
// labelled before it is named; a Werkkennis tool named in a scene (the cash saving, the cost of poor quality) is not named again in the
// closing grid; no other intro names one of these tools (payback time is the tool of eng.lines.intro and pm.intake.intro: here it is not said at all, only the closing's
// Werkkennis row names it as the lesson is titled).
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { textUnits, wrapUnits, CHAR_W } from '../_kit/assert.mjs';
import { mapScene, mapStyles, mapCue, levelWords } from '../_kit/mapscene.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';
import { hallWorld, HALL_CSS } from '../pm.plan.intro/hall.mjs';
import { MODULES } from '../../src/content/courses/index.js';
import engMap from '../../src/content/courses/maps/eng.js';
import { pathBox } from '../../src/content/courses/validate.js';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the module
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const MOD = MODULES.find((m) => m.id === 'eng.cost');
const LEVELS = {
  costprice: ['eng.cost.costprice', 'eng.cost.hourrate', 'eng.cost.abc', 'eng.cost.shouldcost'],
  decisions: ['eng.cost.contribution', 'eng.cost.makebuy', 'eng.cost.pricing', 'eng.cost.profitability'],
  invest: ['eng.cost.cashflow', 'eng.cost.capex', 'eng.cost.appraisal', 'eng.cost.capexboard'],
  lean: ['eng.cost.inventory', 'eng.cost.waste', 'eng.cost.vsc', 'eng.cost.savings'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.cost has the four topics and levels this film draws');
assert(MOD.intro === 'eng.cost.intro', 'eng.cost names this film as its intro');
const lessons = await allLessons();
const FAILS = [];
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) if (!text.includes(s)) FAILS.push(`${id} (${lang}) no longer says "${s}"`); };
// s1: the module's blurb
assert(MOD.blurb.nl.includes('Wat een onderdeel echt kost') && MOD.blurb.en.includes('What a part really costs'), 'the module blurb says what a part really costs');
// s2: a cost price is built bottom-up; every line is a quantity times a rate; a part scrapped late carries all the cost added before it;
// overhead is spread with a key, an overhead surcharge
has('eng.cost.costprice', ['Een kostprijs per stuk bouw je van onderop op', 'Elke regel is een hoeveelheid × een tarief', 'een stuk dat laat wordt afgekeurd draagt alle kosten die er al in zitten', 'een overheadopslag op arbeids- of machine-uren', 'Overheadopslag Een percentage of uursleutel die indirecte kosten over producten verdeelt']);
has('eng.cost.costprice', ['A cost price per part is built bottom-up', 'Every line is a quantity × a rate', 'a part scrapped late carries all the cost added before it', 'an overhead surcharge on labour or machine hours', 'Overhead surcharge A percentage or hourly key that spreads indirect costs over products'], 'en');
has('eng.cost.hourrate', ['Het machine-uurtarief', 'Machine-uurtarief De jaarkosten van een machine gedeeld door de productieve uren']);
has('eng.cost.hourrate', ['The machine hour rate', 'Machine hour rate A machine’s yearly costs divided by its productive hours'], 'en');
// s3: only the costs that differ between the options count; fixed costs stay the same in the short term, variable costs move with each unit;
// the contribution margin is the price minus the variable cost per unit
has('eng.cost.contribution', ['Vaste kosten blijven op korte termijn gelijk', 'Variabele kosten bewegen mee met elk stuk', 'Dekkingsbijdrage = prijs − variabele kosten per stuk', 'Dekkingsbijdrage Prijs min variabele kosten per stuk']);
has('eng.cost.contribution', ['Fixed costs stay the same in the short term', 'Variable costs move with each unit', 'Contribution margin = price − variable cost per unit', 'Contribution margin Price minus variable cost per unit'], 'en');
has('eng.cost.makebuy', ['vergelijkt de relevante kosten, de kosten die tussen de opties verschillen', 'Relevante kosten Kosten die tussen de opties verschillen']);
has('eng.cost.makebuy', ['compares the relevant costs, the costs that change between the options', 'Relevant cost A cost that differs between the options'], 'en');
has('eng.cost.pricing', ['Van kostprijs naar offerte']);
has('eng.cost.pricing', ['From cost price to quote'], 'en');
// s4: a capex is money spent once on assets used for years; an investment case counts cash; a saving only counts if money really stops
// going out or comes in; the sheet puts the investment next to the yearly cash saving (the lesson's payback formula)
has('eng.cost.cashflow', ['Capex (capital expenditure), investeringsuitgaven, is geld dat je één keer uitgeeft aan bezittingen die jaren meegaan', 'Een investeringscase telt dus kasgeld']);
has('eng.cost.cashflow', ['Capex, capital expenditure, is money spent once on assets used for years'], 'en');
has('eng.cost.capex', ['Een besparing telt alleen als er echt minder geld uitgaat of meer binnenkomt', 'Terugverdientijd = investering / jaarlijkse kasbesparing', 'Kasbesparing Een besparing die echt minder geld laat uitgaan of meer laat binnenkomen']);
has('eng.cost.capex', ['A saving only counts if money actually stops going out or new money comes in', 'Payback time = investment / yearly cash saving', 'Cash saving A saving that actually reduces money going out or brings money in'], 'en');
// s5: scrap is priced at the cost that is really lost; the cost of poor quality is the
// failure part of the cost of quality
has('eng.cost.waste', ['Prijs uitval tegen de kosten die echt verloren zijn', 'Faalkosten Het faaldeel van de kwaliteitskosten']);
has('eng.cost.waste', ['Price scrap at the cost that is really lost', 'Cost of poor quality The failure part of the cost of quality'], 'en');
// s6: the first lesson names where to start; the later levels, as the lessons are titled
for (const [id, word] of [['eng.cost.costprice', 'De kostprijs van een onderdeel opbouwen'], ['eng.cost.hourrate', 'Het machine-uurtarief'], ['eng.cost.abc', 'Overhead naar activiteit'], ['eng.cost.shouldcost', 'Should-cost en een offerte lezen'],
  ['eng.cost.makebuy', 'Zelf maken of kopen'], ['eng.cost.pricing', 'ondergrens'], ['eng.cost.profitability', 'Welke producten en klanten echt verdienen'],
  ['eng.cost.capex', 'Terugverdientijd'], ['eng.cost.appraisal', 'NCW en IRR verdiept'], ['eng.cost.capexboard', 'investeringscommissie'],
  ['eng.cost.waste', 'Verspilling in euro’s'], ['eng.cost.vsc', 'absorptieval'], ['eng.cost.savings', 'Besparingen die de controller tekent']]) has(id, [word]);
for (const [id, word] of [['eng.cost.costprice', 'Building up the cost of a part'], ['eng.cost.hourrate', 'The machine hour rate'], ['eng.cost.abc', 'Overhead by activity'], ['eng.cost.shouldcost', 'Should-cost and reading a supplier quote'],
  ['eng.cost.makebuy', 'Make or buy'], ['eng.cost.pricing', 'floors'], ['eng.cost.profitability', 'Which products and customers really earn'],
  ['eng.cost.capex', 'Payback'], ['eng.cost.appraisal', 'NPV and IRR in depth'], ['eng.cost.capexboard', 'investment board'],
  ['eng.cost.waste', 'Putting a price on waste'], ['eng.cost.vsc', 'absorption trap'], ['eng.cost.savings', 'Savings a controller signs']]) has(id, [word], 'en');
assert(FAILS.length === 0, FAILS.join('\n  '));
// the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from GRID.x; the words
// stand on one line each, staggered over two rows, so a word may be wider than its column but not wider than the room to
// the next word on its row, nor run off the stage. Four rows of GRID.pitch.
const LV = { nl: levelWords('nl'), en: levelWords('en') };
const GRID = { x: 308, col: 82, box: 74, tile: 284, top: 76, pitch: 78, h: 76 };
for (const lang of ['nl', 'en']) {
  const half = LV[lang].map((word) => textUnits(word) / 2);
  const mid = (j) => GRID.x + j * GRID.col + GRID.box / 2;
  for (let j = 0; j < 4; j++) {
    if (j + 2 < 4) assert(half[j] + half[j + 2] + 12 <= 2 * GRID.col, `level words "${LV[lang][j]}" and "${LV[lang][j + 2]}" (${lang}) meet on their row`);
    assert(mid(j) - half[j] >= GRID.tile + 20 && mid(j) + half[j] <= 636, `level word "${LV[lang][j]}" (${lang}) runs out of the grid`);
  }
}
assert(GRID.top + (ORDER.length - 1) * GRID.pitch + GRID.h <= 392, 'the four rows of the grid fit the stage');
for (const lang of ['nl', 'en']) {
  for (const id of ORDER) {
    const title = MOD.topics.find((t) => t.id === id).title[lang];
    assert(wrapUnits(title, GRID.tile - 12, CHAR_W).length <= 3, `the grid tile of "${title}" (${lang}) needs more than three lines`);
  }
}

// ---------------------------------------------------------------- the world (hall B)
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
const at = w.at;
const person = (role, x, y, along) => w.person({ x, y, role, along });

// where things stand (cm), as in the better field film: the filling unit over the start of line 3's belt (two uprights and a
// beam, a plate hung from the beam above the cartons, a plastic cover on top), the crate with the bad cartons in front of the
// belt, the table with the laptop and the sheet of the case at the front left, you and the team lead at the front. Without the
// field film's tank, chalk circle, board, scale, chart and the two boards of the side wall: other stations own them.
const BELT = { x: 130, y: 16, len: 130, dep: 34 };
const UX = 152; // x of the uprights and the beam
const FRAME = { top: 150, beam: 160 };
const PLATE = { z0: 100, z1: 146 }; // the filling head: its foot clears the cartons (60 to 80)
const TABLE = { x: 18, y: 108, w: 76, d: 42, h: 74 }; // the table with the laptop (the investment case)
const CRATE = { x: 166, y: 78, w: 44, d: 32, h: 30 }; // the crate with the bad cartons
const frame = [
  w.box({ x: UX, y: 5, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 52, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 5, w: 9, d: 56, r: 1 }, FRAME.top, FRAME.beam, { tone: 'mid' }, { steps: 2 }),
].join('');
const plate = w.box({ x: UX + 9, y: BELT.y, w: 3.2, d: 36, r: 0.6 }, PLATE.z0, PLATE.z1, { tone: 'mid' }, { steps: 2 });
const cover = w.box({ x: UX - 7, y: 12, w: 23, d: 42, r: 7 }, FRAME.beam, FRAME.beam + 24, { tone: 'hi' }, { steps: 4, bevel: 1.2 });
// the crate with the bad cartons: a low crate with two cartons standing in it
const crate = w.box({ x: CRATE.x, y: CRATE.y, w: CRATE.w, d: CRATE.d, r: 2 }, 0, CRATE.h, { tone: 'lo' }, { steps: 2, bevel: 0.5 })
  + w.box({ x: CRATE.x + 6, y: CRATE.y + 6, w: 20, d: 18, r: 1 }, CRATE.h, CRATE.h + 16, { tone: 'hi' }, { steps: 1 })
  + w.box({ x: CRATE.x + 22, y: CRATE.y + 12, w: 16, d: 15, r: 1 }, CRATE.h, CRATE.h + 10, { tone: 'hi' }, { steps: 1 });
// the table with the laptop, and the sheet of the case on it (a group of its own: it comes in at the sentence that puts the investment next to the saving on it)
const caseSheet = w.sheet({ x: TABLE.x + TABLE.w - 26, y: TABLE.y + 10, z: TABLE.h, w: 14, d: 20, lines: 4 }).svg;
const laptopTable = w.table(TABLE) + w.laptop({ x: TABLE.x + 24, y: TABLE.y + TABLE.d / 2, z: TABLE.h, toward: 1 });

// painted back to front: the belt and the unit, the crate (shown from the first sentence, the carton goes in the bin), the table with
// the laptop (from the sentence that names the laptop) and the sheet (from the sentence that puts the investment next to the saving on it), you and the team
// lead (from the sentence that names you)
const world = [
  w.room(ROOM),
  cueG('line3', hall.conveyor({ ...BELT, cartons: 4 })),
  cueG('unit', frame + plate + cover),
  g('o-crate', cueG('scrap', crate)),
  g('o-lap', cueG('laptop', laptopTable)),
  g('o-sheet', cueG('sheet', caseSheet)),
  g('pp-teamlead', person('teamlead', 128, 132, 'x')),
  g('pp-jij0', person('jij', 188, 132, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame (data-k): the
// four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the schemas of each beat. The
// shared map (the kit's mapScene) sits under the panel; its place Cost engineering is a cue group of its own (map-cost).
const TILE = { costprice: 'tCost', decisions: 'tDec', invest: 'tInv', lean: 'tLean' };
const PANEL = ['unitS', 'modS', 'shiftS', 'grpA', 'grpB', 'buildS', 'rateS', 'carryS', 'ovS', 'topS', 'relS', 'fixS', 'marS', 'onceS', 'cashS', 'saveS', 'payS',
  'wasteS', 'lossS', 'failS', 'endS', 'tool1', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, Cost engineering lit, in the stage (the film's closing scene; the stage script moves and fades it)
const { w: MAP_W, h: MAP_H } = engMap.view; // the Engineering map's sheet (viewBox of the wide drawing), from the map data
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.cost'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.cost');
// the zoom looks at the middle of the zone's band (the zone's name, which the beat says, stays on screen above the lit place)
const ZONEB = engMap.zones.find((z) => z.field === 'eng.field.better');
const ZBAND = [pathBox(ZONEB.path)[1], pathBox(ZONEB.path)[3]];
assert(PLACE.y > ZBAND[0] && PLACE.y + PLACE.h < ZBAND[1] && (ZBAND[1] - ZBAND[0]) * 1.5 <= H - 20, 'the lit place lies in the better zone and the zone fits the zoom');
const MAPZ = [PLACE.x + PLACE.w / 2, (ZBAND[0] + ZBAND[1]) / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.cost')}"`), 'the map lights eng.cost as a cue group');
assert(MAP.includes(`viewBox="0 0 ${MAP_W} ${MAP_H}"`), `the Engineering map is ${MAP_W} by ${MAP_H}`);

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
// [ox, oy, s]: the point (ox, oy) of the room, in stage units, is brought to the middle of the room's half of the
// stage while the room scales by s (see camera() in stage.js). Each scene looks at what its topic is about.
const cam = (x, y, z, s) => [...w.at([x, y, z]).map((v) => Math.round(v * 10) / 10), s];
const CAM = [
  { from: cam(150, 70, 70, 1.0), to: cam(150, 70, 70, 1.07) }, // s1 the whole hall: the unit on line 3, the crate, you and the team lead
  { from: cam(160, 60, 50, 1.1), to: cam(160, 60, 50, 1.2) }, // s2 the belt with its cartons and the crate in front of it
  { from: cam(160, 60, 50, 1.1), to: cam(160, 60, 50, 1.2) }, // s3 the same: a good carton on the belt, the bad ones in the crate
  { from: cam(150, 90, 50, 1.05), to: cam(150, 90, 50, 1.15) }, // s4 the crate and the laptop at the front left
  { from: cam(160, 70, 50, 1.05), to: cam(160, 70, 50, 1.15) }, // s5 the crate, the belt and the unit
  { from: cam(150, 70, 60, 1), to: cam(150, 70, 60, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a) => ({ cue: { [a]: 'tool1' } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.cost.intro',
  title: { nl: 'Wat een te lichte doos kost', en: 'What a too-light carton costs' },
  module: 'eng.cost',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.cost, the scene that explains it and its tile
  topics: {
    costprice: { scene: 's2', cue: 'tCost' },
    decisions: { scene: 's3', cue: 'tDec' },
    invest: { scene: 's4', cue: 'tInv' },
    lean: { scene: 's5', cue: 'tLean' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Wat een te lichte doos kost', en: 'What a too-light carton costs' },
      beats: [
        { nl: 'Een te lichte doos van lijn 3 gaat in de bak. Dat kost geld.', en: 'A too-light carton from line 3 goes in the bin. That costs money.', focus: ['unitS', 'scrap', 'line3'] },
        { nl: 'De module Kostprijs en investeringen gaat over wat iets echt kost en of een fix het waard is.', en: 'The module Cost engineering is about what something really costs and whether a fix is worth it.', focus: ['modS', 'line3', 'scrap'] },
        { nl: 'Jij bent de engineer. Na de dienst reken je met de teamleider uit wat het kost.', en: 'You are the engineer. After the shift you and the team lead work out what it costs.', focus: ['shiftS', 'jij', 'teamlead'] },
        { nl: 'Eerst weet je wat een doos kost en welke besluiten daaruit volgen.', en: 'First you know what a carton costs and which decisions follow.', focus: 'grpA' },
        { nl: 'Dan beoordeel je de verbetering en maak je de besparing geloofwaardig.', en: 'Then you judge the fix and make the saving credible.', focus: 'grpB' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Kostprijs en uurtarieven', en: 'Cost price and hour rates' },
      beats: [
        { nl: 'Het eerste onderwerp is Kostprijs en uurtarieven. Je bouwt de kostprijs van een doos van onderop op.', en: 'The first topic is Cost price and hour rates. You build up a carton’s cost price from the bottom.', focus: ['tCost', 'buildS', 'line3'] },
        { nl: 'Elke regel is een hoeveelheid maal een tarief, zoals machinetijd maal een uurtarief.', en: 'Every line is a quantity times a rate, such as machine time times an hour rate.', focus: ['rateS', 'line3'] },
        { nl: 'Een doos die laat in de bak gaat, draagt alle kosten die er al in zaten.', en: 'A carton that goes in the bin late carries all the cost already put into it.', focus: ['carryS', 'scrap'] },
        { nl: 'De indirecte kosten verdeel je vaak met een {t:Overheadopslag|overheadopslag}.', en: 'You often spread the indirect costs with an {t:Overhead surcharge|overhead surcharge}.', ...TOOL('Overheadopslag'), focus: ['tool1', 'ovS'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Relevante kosten en prijzen', en: 'Relevant costs and pricing' },
      beats: [
        { nl: 'Het tweede onderwerp is Relevante kosten en prijzen. Daarmee neem je besluiten.', en: 'The second topic is Relevant costs and pricing. With it you make decisions.', focus: ['tDec', 'topS', 'line3'] },
        { nl: 'Bij een besluit tellen alleen de kosten die tussen de opties verschillen.', en: 'In a decision only the costs that differ between the options count.', focus: ['relS', 'unit'] },
        { nl: 'Vaste kosten blijven op korte termijn gelijk. Variabele kosten gaan mee met elke doos.', en: 'Fixed costs stay the same in the short term. Variable costs move with every carton.', focus: ['fixS', 'line3'] },
        { nl: 'Je bepaalt de {t:Dekkingsbijdrage|dekkingsbijdrage} van een goede doos.', en: 'You determine the {t:Contribution margin|contribution margin} of a good carton.', ...TOOL('Dekkingsbijdrage'), focus: ['tool1', 'marS', 'line3'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Investeringen beoordelen', en: 'Investment appraisal' },
      beats: [
        { nl: 'Het derde onderwerp is Investeringen beoordelen. Een verbetering geef je één keer uit, voor jaren.', en: 'The third topic is Investment appraisal. You spend on a fix once, for years of use.', focus: ['tInv', 'onceS', 'unit'] },
        { nl: 'Een besparing telt alleen als er echt minder geld uitgaat of meer binnenkomt.', en: 'A saving only counts if money really stops going out or comes in.', focus: ['cashS'] },
        { nl: 'Op de laptop reken je de {t:Kasbesparing|kasbesparing} uit.', en: 'On the laptop you work out the {t:Cash saving|cash saving}.', ...TOOL('Kasbesparing'), focus: ['tool1', 'saveS', 'laptop'] },
        { nl: 'Op het vel zet je de investering naast de kasbesparing per jaar.', en: 'On the sheet you put the investment next to the cash saving per year.', focus: ['payS', 'sheet'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Lean accounting en besparingen', en: 'Lean accounting and savings' },
      beats: [
        { nl: 'Het vierde onderwerp is Lean accounting en besparingen. Je rekent verspilling om in geld.', en: 'The fourth topic is Lean accounting and savings. You turn waste into money.', focus: ['tLean', 'wasteS', 'scrap'] },
        { nl: 'Een doos in de bak is verspilling. Je prijst hem tegen wat echt verloren gaat.', en: 'A carton in the bin is waste. You price it at what is really lost.', focus: ['lossS', 'scrap'] },
        { nl: 'Je telt de {t:Faalkosten|faalkosten} van de bak op.', en: 'You add up the {t:Cost of poor quality|cost of poor quality} of the bin.', ...TOOL('Faalkosten'), focus: ['tool1', 'failS', 'scrap'] },
        { nl: 'Zo weet je wat lijn 3 kost en of de fix loont.', en: 'That is how you know what line 3 costs and whether the fix pays.', focus: ['endS', 'jij', 'teamlead', 'line3'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. Het derde station is Kostprijs en investeringen, in De fabriek beter maken.', en: 'The whole map. The third station is Cost engineering, in Making the plant better.', focus: 'map-cost' },
        { nl: 'Elk onderwerp heeft vier niveaus.', en: 'Each topic has four levels.', focus: 'route' },
        { nl: 'Begin op niveau Basis met de kostprijs van een onderdeel opbouwen. Zo zie je waar kosten vandaan komen.', en: 'Start at Basics level with building up the cost of a part. It shows where costs come from.', focus: ['tCost', 'start'] },
        { nl: 'Op niveau Werkkennis komen het machine-uurtarief, de terugverdientijd, verspilling en zelf maken of kopen.', en: 'At Working knowledge level come the machine hour rate, payback time, waste in euros and make or buy.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd komen kosten per activiteit, de prijsondergrens, netto contante waarde en de absorptieval.', en: 'At Advanced level come costs by activity, the price floor, net present value and the absorption trap.', focus: 'lv3' },
        { nl: 'Op niveau Expert komen een offerte lezen, klantwinst, de investeringscommissie en besparingen laten tekenen.', en: 'At Expert level come reading a quote, customer profit, the investment board and getting savings signed.', focus: 'lv4' },
      ],
    },
  ],
  skip: [],
  strictFocus: true,
};

// ---------------------------------------------------------------- the narration
// What the voice says is what the captions show (as in the other module intros): short sentences, few commas, no colons and no
// symbols the voice would read aloud. Each topic scene ends on one short sentence naming the tool of that topic's lessons, without
// explaining it. Every drawn detail has its reason in the narration: the belt and the unit (line 3, where the too-light cartons
// come out), the crate (the carton goes in the bin), the laptop (the cash saving is worked out on it), the sheet (the investment next to the saving goes on
// it), you and the team lead (the ones who stay after the shift).
spec.scenes.forEach((s) => s.beats.forEach((b) => { b.say = { nl: b.nl, en: b.en }; }));
// Each scene's length from its share of the Dutch narration, never shorter than its captions need.
{
  const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
  const said = spec.scenes.map((sc) => sc.beats.reduce((a, b) => a + wordsOf(plainSay(b.nl)), 0));
  const all = said.reduce((a, b) => a + b, 0);
  const TOTAL = Math.min(298, Math.ceil(all / 2.5) + 2 * spec.scenes.length);
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

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\nconst LV = ${JSON.stringify(LV)};\nconst MAPZ = ${JSON.stringify(MAPZ)};\nconst MAPSZ = [${MAP_W}, ${MAP_H}];\nconst GRID = ${JSON.stringify(GRID)};\nconst KEYS = ${JSON.stringify(PANEL)};\nconst CW = ${JSON.stringify(CHAR_W)};\nconst wrapUnits = ${wrapUnits.toString()};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="jij"],[data-cue="teamlead"])';
const css = PM_CSS + HALL_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-tile{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:1.2}
.pm-badge{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-bar{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-crit{fill:color-mix(in srgb,var(--fp-accent) 24%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-lvl{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1}
.pm-out{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:5 4}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-link{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round;stroke-linecap:round}
.pm-cross{fill:none;stroke:var(--anatomy-muted);stroke-width:2.4;stroke-linecap:round}
.pm-dash{fill:none;stroke:var(--anatomy-hi);stroke-width:1.6;stroke-dasharray:5 4;stroke-linecap:round}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-dash,[data-cue][data-on] .pm-link{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] .pm-cross{stroke:var(--fp-accent)}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-bar,.pm-lvl,.pm-out){stroke:var(--fp-accent)}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
.pm-arm{fill:none;stroke:var(--anatomy-mid);stroke-width:9;stroke-linecap:round;stroke-linejoin:round}
.pm-joint{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:2}
[data-cue][data-on] .pm-arm{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-joint{stroke:var(--fp-accent)}

/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');



const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 draait. Aan de achterwand de band van lijn 3 met dozen; boven het begin van de band staat de vuleenheid, ongeveer zo hoog als een mens: een stalen frame met een plaat boven de dozen en bovenop een lichte kunststof kap. Voor de band staat een bak met afgekeurde dozen. Later komen erbij een tafel links voorin met een laptop en daarna een vel papier voor de berekening. Voor in de hal staan jij, de engineer, en de teamleider. Rechts een paneel, gemarkeerd als voorbeeld of schema: een te lichte doos die in de bak gaat, de route in twee groepen, een kostprijs die van onderop wordt opgebouwd, een hoeveelheid maal een tarief, een doos met alle kosten erin, overhead verdeeld over producten, een besluit en een prijs, kosten die verschillen en kosten die gelijk blijven, vaste en variabele kosten, een prijs met een dekkingsbijdrage, een verbetering die geld kost, een uitgave die jaren meegaat, minder geld uit en meer geld in, een besparing per jaar, de investering naast de besparing per jaar, verspilling in euro’s, wat echt verloren gaat, uitval, herbewerking en claims, en de kosten van lijn 3 tegenover de opbrengst van de verbetering. Aan het eind de hele kaart van Engineering met Kostprijs en investeringen verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the plant, where line 3 runs. Along the back wall the belt of line 3 with cartons; over the start of the belt stands the filling unit, about as tall as a person: a steel frame with a plate above the cartons and a light plastic cover on top. In front of the belt stands a crate with rejected cartons. Later come a table at the front left with a laptop and then a sheet of paper for the calculation. At the front of the hall stand you, the engineer, and the team lead. At the right a panel, marked as an example or a diagram: a too-light carton going in the bin, the route in two groups, a cost price built up from the bottom, a quantity times a rate, a carton with all its cost in it, overhead spread over products, a decision and a price, costs that differ and costs that stay equal, fixed and variable costs, a price with a contribution margin, a fix that costs money, an expense that lasts for years, less money out and more money in, a saving per year, the investment next to the saving per year, waste in euros, what is really lost, scrap, rework and claims, and the cost of line 3 against the return of the fix. At the end the whole map of Engineering with Cost engineering lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

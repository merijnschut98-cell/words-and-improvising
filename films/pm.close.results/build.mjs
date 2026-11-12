// Dev tool, not shipped. Builds the explainer film "Is het echt beter? / Is it
// really better?" for Projecten: pm.close.results (level 1 of the topic
// Resultaat aantonen, "Resultaat aantonen").
//
//   node films/pm.close.results/build.mjs            build the page
//   node films/pm.close.results/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.close.results.html: one offline page with
// the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7
// (pm.close.results, P2: weekly values with their noise band, and the
// comparison line; four scenes, about 90 s). Storyboard drift: seven scenes and
// about three and a half minutes, because a lesson with a film no longer shows
// its worked example, so the film carries all five teach blocks and the worked
// example: the baseline (s1, teach 1), noise with line 3's baseline (s2, teach
// 2 and the example), the comparison line and the after weeks (s3, teach 2 and
// the example), the run chart and regression to the mean (s4, teach 4), money
// in the client's terms (s5, teach 3), the bottling plant's sum (s6, the
// example) and the people side (s7, teach 5).
//
// Checklist (lesson point: scene and beat; "card" where the card carries it):
//   teach 1: a result claim needs a baseline, the performance before the
//     change, measured the same way as after (s1 b1); same definition, data
//     source, period length, similar conditions (s1 b2); baseline stops over 5
//     minutes, after-data over 2: worthless (s1 b3); agree the definition at
//     the start, write it down, keep the raw data so anyone can redo the sum
//     (s1 b4)
//   teach 2: separate your effect from noise, the normal week-to-week swing
//     that has nothing to do with you (s2 b2); baseline 11 to 17%, a drop of 2
//     points after four weeks proves little (s2 b3); as many weeks after as
//     before, rule of thumb 8 to 12 (s2 b4); check what else changed: volume,
//     product mix, season, new staff (s3 b1); a comparison group, a similar
//     line or region without the change, is the strongest evidence (s3 b2)
//   teach 3: freed hours are only money if something changes on the books:
//     overtime cut, a shift dropped, more product sold, an investment avoided
//     (s5 b1); at a grid operator customers connected sooner or fewer customer
//     minutes lost, minutes without power added up over all customers (s5 b2);
//     extra output that can be sold: contribution margin, sales price minus
//     variable costs such as material and energy (s5 b3); the controller, the
//     finance person who owns the numbers, checks the sum (s5 b4)
//   teach 4: some want a formal statistical test; most practitioners settle
//     for a run chart, weekly values over time, plus a comparison group (s4
//     b1); regression to the mean: projects often start after a bad spell and
//     numbers drift back toward normal anyway (s4 b2); part of your gain may be
//     that (s4 b3); a result that fades once you leave is a warning; measure
//     again three months after closing (s4 b4)
//   teach 5: don't overclaim, say what you know and what not (s7 b1); "12 to
//     8%, about one point likely the lower summer volume, the rest the changes"
//     (s7 b2); welcome a critical controller, their approval is worth more than
//     your slide; credit the team that did the work (s7 b3); the sharp
//     question, word for word (s7 b4)
//   example: a bottling plant, line 3, 12 baseline weeks at 14% (s2 b1),
//     weekly 11 to 17% (s2 b2); 10 weeks after at 9%, 7 to 11%, line 4
//     untouched at 13% (s3 b3); the ranges barely overlap and the comparison
//     line didn't move, so very likely real (s3 b4); 6,000 planned hours a
//     year, 5 points less downtime is 300 extra running hours (s6 b1); sold
//     out, so the hours become extra product (s6 b2); the controller values an
//     hour at 450 euro contribution margin, 300 x 450 = about 135,000 euro a
//     year (s6 b3); presented together with the controller, who checked it
//     (s6 b4)
//
// Facts: nothing is credited to a source; the lesson names no author (no
// Shewhart, no Wheeler, no process behaviour chart), so the film does not
// either. Regression to the mean is told as the lesson words it. The worked
// example's sums are asserted below: 6,000 x 5% = 300 hours and 300 x 450 =
// 135,000 euro (the lesson's "ongeveer" kept). The weekly values on the chart
// are drawn, not given by the lesson: they are built so that line 3's 12
// baseline weeks average 14 with a lowest week of 11 and a highest of 17, its 10
// after weeks average 9 between 7 and 11, and line 4 averages 13 in both
// periods; the build asserts that. The ranges 11 to 17 and 7 to 11 touch only
// at 11: "barely overlap". The four early weeks of teach 2 (2 points lower,
// inside the band) average 12, and the bad spell of s4 is a sketch.
//
// The drawing is the shared pm world (films/_pm/world.mjs, read-only here): a
// meeting room with a whiteboard that repeats the panel in miniature, a wall
// clock, a meeting table with the raw-data sheet (its rows fill in s1) and a
// laptop, and the cast: "jij" the consultant in petrol at the board, the
// sponsor, the team lead and the client's controller (the world's planner
// figure with a tablet, given the cue key "controller"; no caption calls him a
// planner). A panel at the right, in stage space, carries the run chart and the
// cards, each labelled "voorbeeld" or "schema".
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (SLOTS below), and so are the people, the
// board and the raw-data sheet.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { NARRATION_WPS } from '../_kit/assert.mjs';
import { beatStarts, minSceneDur, wordsOf } from '../_kit/timeline.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// What the film states, asserted against the lesson's current text (the build
// fails if it drifts); {n:...} numbers are then checked against the Dutch
// lesson text by defineFilm.
const RES = 'pm.close.results';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const textOf = (lang) => { const l = lessons[lang].get(RES); return `${l.teach.join('\n')}\n${l.example.text}`; };
const says = (list, lang = 'nl') => { const t = textOf(lang); for (const s of list) assert(t.includes(s), `${RES} (${lang}) no longer says "${s}"`); };
says(['een nulmeting (baseline) nodig: de prestatie vóór de verandering, gemeten op dezelfde manier als erna', 'Zelfde definitie, zelfde databron, zelfde periodelengte, vergelijkbare omstandigheden',
  'stops boven de 5 minuten en de nameting stops boven de 2', 'waardeloos', 'Spreek de definitie aan het begin af, schrijf hem op en bewaar de ruwe data', 'de som kan nadoen',
  'de normale schommeling van week tot week die niks met jou te maken heeft', 'tussen 11 en 17%', 'een daling van 2 punten na vier weken weinig', 'even veel weken na als voor', '8 tot 12',
  'volume, productmix, seizoen, nieuwe mensen', 'een vergelijkbare lijn of regio zonder de verandering, is het sterkste bewijs',
  'alleen geld als er iets verandert in de boeken: minder overwerk, een ploeg minder, meer product verkocht, een investering die niet nodig is',
  'klanten sneller aangesloten, of minder verloren klantminuten (minuten zonder stroom, opgeteld over alle klanten)', 'verkoopprijs min variabele kosten zoals materiaal en energie',
  'de financiële man of vrouw die de cijfers beheert, de som checken',
  'formele statistische toets', 'run chart, weekwaarden uitgezet in de tijd, plus een vergelijkingsgroep', 'projecten starten vaak na een slechte periode', 'vanzelf terug richting normaal',
  'Een deel van je “winst” kan dat zijn', 'wegzakt zodra jij weg bent, is ook een waarschuwing', 'Meet drie maanden na de afsluiting opnieuw',
  'claim niet te veel', 'Zeg wat je weet en wat niet', 'van 12 naar 8%. Ongeveer één punt komt waarschijnlijk door het lagere zomervolume; de rest schrijven we toe aan de veranderingen',
  'Verwelkom een kritische controller; zijn akkoord is meer waard dan jouw slide', 'Geef de eer aan het team dat het werk deed', '“Als een bestuurslid dit getal aanvalt, wie behalve ik verdedigt het dan?”',
  'bottelarij had lijn 3 over 12 weken nulmeting 14% stilstand (weekwaarden 11 tot 17%)', 'In de 10 weken na de veranderingen was het 9% (7 tot 11%), terwijl lijn 4, waar niets veranderde, op 13% bleef',
  'De spreidingen overlappen nauwelijks en de vergelijkingslijn bewoog niet, dus het effect is vrijwel zeker echt', 'gepland op 6.000 uur per jaar: 5 punten minder stilstand is 300 extra draaiuren',
  'uitverkocht, dus die uren worden extra product', '450 euro dekkingsbijdrage, dus 300 × 450 = ongeveer 135.000 euro per jaar', 'samen met de controller, die het heeft nagerekend']);
says(['A result claim needs a baseline', 'a common rule of thumb is 8 to 12', 'customer minutes lost', 'contribution margin', 'regression to the mean', 'who besides me will defend it?',
  'line 4, untouched, stayed at 13%', '300 × 450 = about 135,000 euro a year'], 'en');
// line 3 and line 4, week by week (drawn; the lesson gives the averages and ranges)
const BASE = 12;
const L3 = [15, 13, 17, 12, 14, 16, 11, 14, 13, 15, 14, 14, 10, 9, 11, 8, 9, 7, 10, 9, 8, 9];
const L4 = [13, 14, 12, 13, 14, 13, 12, 13, 14, 12, 13, 13, 13, 12, 14, 13, 13, 12, 14, 13, 12, 14];
const GHOST = [12, 13, 11, 12];
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const b3 = L3.slice(0, BASE);
const a3 = L3.slice(BASE);
assert(L3.length === 22 && L4.length === 22 && a3.length === 10, '12 baseline weeks and 10 after');
assert(mean(b3) === 14 && Math.min(...b3) === 11 && Math.max(...b3) === 17, 'line 3 baseline: 14%, weeks 11 to 17%');
assert(mean(a3) === 9 && Math.min(...a3) === 7 && Math.max(...a3) === 11, 'line 3 after: 9%, weeks 7 to 11%');
assert(mean(L4.slice(0, BASE)) === 13 && mean(L4.slice(BASE)) === 13, 'line 4 stays at 13%');
assert(Math.max(...a3) === Math.min(...b3), 'the ranges touch only at 11: barely overlap');
assert(mean(GHOST) === mean(b3) - 2 && Math.min(...GHOST) >= 11, 'four early weeks 2 points lower, inside the band');
const HOURS = 6000;
const POINTS = mean(b3) - mean(a3);
const EXTRA = (HOURS * POINTS) / 100;
assert(POINTS === 5 && EXTRA === 300 && EXTRA * 450 === 135000, '6,000 h x 5 points = 300 h; 300 x 450 = 135,000 euro');
// the bad spell of s4: normal weeks around 12, a bad spell, then back to normal
const RTM = [12, 13, 11, 12, 16, 17, 16, 13, 12, 12, 11, 12];
const SPELL = [4, 6];
const NORMAL = 12;

// ---------------------------------------------------------------- the world
const W = 640;
const H = 400;
const AZ = 58;
const ROOM = { w: 290, d: 228, h: 230 };
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, 318, H, { pad: 6, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;

const BOARD = w.board({ x0: 60, x1: 230, z0: 92, z1: 196 });
const TABLE = { x: 96, y: 118, w: 150, d: 72, h: 74 };
const TZ = TABLE.h;
const SHEET = w.sheet({ x: 148, y: 150, z: TZ, w: 21, d: 29.7 });
const SHEET_AT = w.at([158, 165, TZ]).map((v) => Math.round(v * 10) / 10);
// the panel's card area that the board copies, in stage units
const PANEL_AREA = { x: 324, y: 52, w: 304, h: 336 };
const fitInto = (a, x0, y0, x1, y1) => {
  const s = Math.min((x1 - x0) / a.w, (y1 - y0) / a.h);
  const ox = x0 + ((x1 - x0) - a.w * s) / 2;
  const oy = y0 + ((y1 - y0) - a.h * s) / 2;
  return `translate(${ox.toFixed(2)} ${oy.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-a.x} ${-a.y})`;
};
const BA = BOARD.area;
const boardMini = `<g transform="${BOARD.face}"><g class="cr-mini" transform="${fitInto(PANEL_AREA, BA.x0 + 3, -BA.z1 + 3, BA.x1 - 3, -BA.z0 - 3)}">${g('bMini', '')}</g></g>`;
const sheetLines = `<g transform="${SHEET.face}">${g('sLines', '')}</g>`;
// the client's controller: the world's planner figure (tablet in hand) under its own cue key
const controller = w.person({ x: 232, y: 208, role: 'planner', along: 'x' }).replace('data-cue="planner"', 'data-cue="controller"');
assert(controller.includes('data-cue="controller"'), 'the controller is a cue group');

const world = [
  w.room(ROOM),
  w.clock(262, 214, 10),
  cueG('board', BOARD.svg + boardMini),
  w.person({ x: 44, y: 50, role: 'jij', along: 'x', reach: [72, 6, 150] }),
  w.chair({ x: 136, y: 100, back: -1 }),
  w.chair({ x: 206, y: 100, back: -1 }),
  w.person({ x: 76, y: 182, role: 'teamlead', along: 'y' }),
  w.table(TABLE),
  w.stack({ x: 104, y: 126, z: TZ, n: 3 }),
  cueG('sheet', SHEET.svg + sheetLines),
  w.laptop({ x: 214, y: 140, z: TZ, toward: 1 }),
  w.cup(132, 178, TZ),
  w.cup(236, 126, TZ),
  w.person({ x: 262, y: 152, role: 'sponsor', along: 'y' }),
  controller,
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every block the panel draws is a static cue group here (the player lights
// the groups it finds at start, so each beat's focus names the block it
// explains); stage.js fills them per scene: o[key] goes into data-k "p_<key>".
const PX = 322;
const PW = 308;
const SLOTS = ['axes', 'base', 'same', 'stops', 'raw', 'band', 'base3', 'four', 'weeks', 'other', 'line4', 'after3', 'verdict',
  'test', 'rtm', 'fade', 'books', 'grid', 'margin', 'check', 'sum', 'sold', 'value', 'together', 'claim', 'credit', 'ask'];
const hud = g('panel', `<rect class="cr-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + SLOTS.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`;

// ---------------------------------------------------------------- cameras (one gentle move per scene)
// [cx, cy, s]: the stage point (cx, cy) stays put while the room scales by s
const BOARD_AT = w.at([145, 0, 150]).map((v) => Math.round(v * 10) / 10);
const CTRL_AT = w.at([232, 208, 150]).map((v) => Math.round(v * 10) / 10);
const CAM = [
  { from: [150, 210, 1], to: [SHEET_AT[0], SHEET_AT[1], 1.1] },
  { from: [150, 200, 1.02], to: [BOARD_AT[0], BOARD_AT[1] + 60, 1.1] },
  { from: [BOARD_AT[0], BOARD_AT[1] + 60, 1.1], to: [BOARD_AT[0], BOARD_AT[1] + 50, 1.16] },
  { from: [BOARD_AT[0], BOARD_AT[1] + 60, 1.12], to: [150, 200, 1.04] },
  { from: [150, 200, 1.02], to: [CTRL_AT[0], CTRL_AT[1] + 40, 1.1] },
  { from: [CTRL_AT[0], CTRL_AT[1] + 40, 1.08], to: [SHEET_AT[0], SHEET_AT[1], 1.12] },
  { from: [150, 200, 1.06], to: [150, 210, 1] },
];

// ---------------------------------------------------------------- the film
const C = { SLOTS, BASE, L3, L4, GHOST, RTM, SPELL, NORMAL, MEAN: mean(b3), LO: 11, HI: 17, LO2: 7, HI2: 11 };
const sc = (id, title, beats) => ({ id, lesson: RES, level: 1, still: 0.9, title, beats });
const spec = {
  id: RES,
  title: { nl: 'Is het echt beter?', en: 'Is it really better?' },
  lessons: [RES],
  strictFocus: true,
  scenes: [
    sc('s1', { nl: 'Eerst de nulmeting', en: 'First the baseline' }, [
      { nl: 'Wie een resultaat claimt, heeft een {t:Nulmeting|nulmeting} nodig: de prestatie vóór de verandering.', en: 'A result claim needs a {t:Baseline|baseline}: the performance before the change.', cue: { Nulmeting: 'base' }, focus: ['base', 'jij'] },
      { nl: 'Zelfde definitie, zelfde databron, zelfde periodelengte, vergelijkbare omstandigheden.', en: 'Same definition, same data source, same period length, similar conditions.', focus: 'same' },
      { nl: 'Nulmeting: stops boven {n:5} minuten. Erna: boven {n:2}. Die vergelijking is waardeloos.', en: 'Baseline: stops over {n:5} minutes. After: over {n:2}. That comparison is worthless.', focus: 'stops' },
      { nl: 'Spreek de definitie vooraf af, schrijf hem op en bewaar de ruwe data.', en: 'Agree the definition up front, write it down, keep the raw data.', focus: ['raw', 'sheet'] },
    ]),
    sc('s2', { nl: 'Ruis', en: 'Noise' }, [
      { nl: 'Een bottelarij, lijn {n:3}: {n:12} weken nulmeting, gemiddeld {n:14}% stilstand.', en: 'A bottling plant, line {n:3}: {n:12} baseline weeks, {n:14}% downtime on average.', focus: ['base3', 'teamlead'] },
      { nl: 'De weekwaarden schommelen tussen {n:11} en {n:17}%: dat is {t:Ruis|ruis}.', en: 'Weekly values swing between {n:11} and {n:17}%: that is {t:Noise|noise}.', cue: { Ruis: 'band' }, focus: 'band' },
      { nl: '{n:2} punten lager na vier weken? Dat bewijst weinig.', en: '{n:2} points lower after four weeks? That proves little.', focus: ['four', 'band'] },
      { nl: 'Meet ongeveer even veel weken na als voor: vaak {n:8} tot {n:12}.', en: 'Measure about as many weeks after as before: often {n:8} to {n:12}.', focus: 'weeks' },
    ]),
    sc('s3', { nl: 'Een vergelijkingslijn', en: 'A comparison line' }, [
      { nl: 'Check wat er nog meer veranderde: volume, productmix, seizoen, nieuwe mensen.', en: 'Check what else changed: volume, product mix, season, new staff.', focus: 'other' },
      { nl: 'Een {t:Vergelijkingsgroep|vergelijkingsgroep}: een vergelijkbare lijn zonder de verandering. Hier lijn {n:4}.', en: 'A {t:Comparison group|comparison group}: a similar line without the change. Here line {n:4}.', cue: { Vergelijkingsgroep: 'line4' }, focus: 'line4' },
      { nl: 'Erna: lijn {n:3} {n:10} weken op {n:9}% ({n:7} tot {n:11}). Lijn {n:4} blijft op {n:13}%.', en: 'After: line {n:3}, {n:10} weeks at {n:9}% ({n:7} to {n:11}). Line {n:4} stays at {n:13}%.', focus: ['after3', 'line4'] },
      { nl: 'De banden overlappen nauwelijks, de vergelijkingslijn bewoog niet: vrijwel zeker echt.', en: 'The bands barely overlap, the comparison line did not move: very likely real.', focus: ['band', 'after3', 'verdict'] },
    ]),
    sc('s4', { nl: 'Vanzelf terug', en: 'Back by itself' }, [
      { nl: 'Sommigen willen een statistische toets; de meesten een run chart plus een vergelijkingsgroep.', en: 'Some want a statistical test; most take a run chart plus a comparison group.', focus: ['test', 'board'] },
      { nl: '{t:Regressie naar het gemiddelde|Regressie naar het gemiddelde}: na een slechte periode zakken cijfers vanzelf terug.', en: '{t:Regression to the mean|Regression to the mean}: after a bad spell, numbers drift back anyway.', cue: { 'Regressie naar het gemiddelde': 'rtm' }, focus: 'rtm' },
      { nl: 'Een deel van je winst kan dat zijn.', en: 'Part of your gain may be just that.', focus: 'rtm' },
      { nl: 'Zakt het weg zodra jij weg bent? Een waarschuwing. Meet na drie maanden opnieuw.', en: 'Does it fade once you leave? A warning. Measure again after three months.', focus: ['fade', 'jij'] },
    ]),
    sc('s5', { nl: 'Geld in hun termen', en: 'Money in their terms' }, [
      { nl: 'Vrijgekomen uren zijn alleen geld als er iets verandert in de boeken.', en: 'Freed hours are only money if something changes on the books.', focus: ['books', 'sponsor'] },
      { nl: 'Bij een netbeheerder: klanten sneller aangesloten, minder verloren klantminuten.', en: 'At a grid operator: customers connected sooner, fewer customer minutes lost.', focus: 'grid' },
      { nl: 'Extra output verkopen? Reken met de {t:Dekkingsbijdrage|dekkingsbijdrage}: prijs min variabele kosten.', en: 'Extra output to sell? Use the {t:Contribution margin|contribution margin}: price minus variable costs.', cue: { Dekkingsbijdrage: 'margin' }, focus: 'margin' },
      { nl: 'Laat de {t:Controller|controller}, die de cijfers beheert, de som checken.', en: 'Let the {t:Controller|controller}, who owns the numbers, check the sum.', cue: { Controller: 'controller' }, focus: ['controller', 'check'] },
    ]),
    sc('s6', { nl: 'De som', en: 'The sum' }, [
      { nl: 'Lijn {n:3}: {n:6000} uur per jaar gepland. {n:5} punten minder stilstand is {n:300} extra draaiuren.', en: 'Line {n:3}: {n:6000} hours a year planned. {n:5} points less downtime is {n:300} extra running hours.', focus: 'sum' },
      { nl: 'De fabriek is uitverkocht: die uren worden extra product.', en: 'The plant is sold out: those hours become extra product.', focus: 'sold' },
      { nl: '{n:450} euro dekkingsbijdrage per uur: {n:300} × {n:450} = ongeveer {n:135000} euro per jaar.', en: '{n:450} euro contribution margin an hour: {n:300} × {n:450} = about {n:135000} euro a year.', focus: ['value', 'controller'] },
      { nl: 'Je presenteert het samen met de controller, die het heeft nagerekend.', en: 'You present it together with the controller, who checked it.', focus: ['together', 'controller', 'jij'] },
    ]),
    sc('s7', { nl: 'De mensenkant', en: 'The people side' }, [
      { nl: 'Claim niet te veel: zeg wat je weet en wat niet.', en: 'Don’t overclaim: say what you know and what you don’t.', focus: 'claim' },
      { nl: '“Van {n:12} naar {n:8}%. Ongeveer één punt is het lagere zomervolume, de rest de veranderingen.”', en: '“From {n:12} to {n:8}%. About one point is the lower summer volume, the rest the changes.”', focus: 'claim' },
      { nl: 'Verwelkom een kritische controller. Geef de eer aan het team dat het werk deed.', en: 'Welcome a sceptical controller. Give the credit to the team that did the work.', focus: ['credit', 'controller', 'teamlead'] },
      { nl: '“Als een bestuurslid dit getal aanvalt, wie behalve ik verdedigt het dan?”', en: '“If a board member challenges this number, who besides me will defend it?”', focus: ['ask', 'jij'] },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson's
// teach text and worked example, so every point of the checklist above is
// said here. No symbol the voice would read aloud, no spoken parenthesis or
// quote. Words checked with espeak-ng phonemes through Piper's own bridge
// (nl_NL-alex, 2026-11-12). Three Dutch SAY rules in films/_kit/timeline.mjs,
// which no other film says: controller as "kon-troller" (espeak-ng stresses
// KON-), dekkingsbijdrage split at the head (it stresses -bij-DRAA-zje, with a
// French zj) and run chart with the tsj Dutch speakers use (it reads a French
// sj). Reworded where it misreads a word that is not a lesson term: nameting
// (said "de meting erna"), periodelengte ("even lange periodes"), databron
// ("dezelfde bron"), productmix ("het soort product"), vuistregel and
// richtlijn ("gangbaar is"), verkoopprijs ("de prijs"), nagerekend
// ("nagekeken"), akkoord and slide ("zijn ja", "jouw mooie dia").
const SAY = [
  [ // s1 the baseline
    { nl: 'Je project is klaar, en de sponsor wil weten: is het echt beter? Wie een resultaat claimt, heeft een {t:Nulmeting|nulmeting} nodig: de prestatie vóór de verandering, gemeten op dezelfde manier als erna.',
      en: 'Your project is done, and the sponsor wants to know: is it really better? Anyone who claims a result needs a {t:Baseline|baseline}: the performance before the change, measured the same way as after.' },
    { nl: 'Dus dezelfde definitie, dezelfde bron van de data, even lange periodes, en vergelijkbare omstandigheden.',
      en: 'So the same definition, the same data source, the same period length, and similar conditions.' },
    { nl: 'Telde de nulmeting stops boven de {n:5} minuten, en de meting erna stops boven de {n:2}, dan is de vergelijking waardeloos.',
      en: 'If the baseline counted stops over {n:5} minutes, and the after-data counts stops over {n:2}, the comparison is worthless.' },
    { nl: 'Spreek de definitie aan het begin af, schrijf hem op, en bewaar de ruwe data. Dan kan iedereen de som nadoen.',
      en: 'Agree the definition at the start, write it down, and keep the raw data. Then anyone can redo the sum.' },
  ],
  [ // s2 noise
    { nl: 'Een voorbeeld. Bij een bottelarij meet je op lijn {n:3} {n:12} weken lang de stilstand: het deel van de geplande uren dat de lijn stilstaat. Gemiddeld is dat {n:14} procent.',
      en: 'An example. At a bottling plant you measure downtime on line {n:3} for {n:12} weeks: the share of planned hours the line stands still. On average it is {n:14} percent.' },
    { nl: 'Maar elke week is anders: tussen {n:11} en {n:17} procent. Dat is {t:Ruis|ruis}: de normale schommeling van week tot week, die niks met jou te maken heeft.',
      en: 'But every week is different: between {n:11} and {n:17} percent. That is {t:Noise|noise}: the normal week-to-week swing that has nothing to do with you.' },
    { nl: 'Zakt de stilstand na vier weken {n:2} punten, dan valt dat nog binnen die band. Het bewijst weinig.',
      en: 'If downtime drops {n:2} points after four weeks, that still falls inside the band. It proves little.' },
    { nl: 'Meet daarom ongeveer even veel weken na als voor. Gangbaar is {n:8} tot {n:12} weken.',
      en: 'So measure roughly as many weeks after as before. A common rule of thumb is {n:8} to {n:12} weeks.' },
  ],
  [ // s3 a comparison line
    { nl: 'Check ook wat er nog meer veranderde: het volume, het soort product, het seizoen, nieuwe mensen.',
      en: 'Also check what else changed: volume, product mix, season, new staff.' },
    { nl: 'Het sterkste bewijs is een {t:Vergelijkingsgroep|vergelijkingsgroep}: een vergelijkbare lijn of regio die de verandering niet kreeg. Hier is dat lijn {n:4}.',
      en: 'The strongest evidence is a {t:Comparison group|comparison group}: a similar line or region that did not get the change. Here that is line {n:4}.' },
    { nl: 'Na de veranderingen meet je {n:10} weken. Lijn {n:3} zit nu op {n:9} procent, met weken tussen {n:7} en {n:11}. Lijn {n:4}, waar niets veranderde, blijft op {n:13} procent.',
      en: 'After the changes you measure for {n:10} weeks. Line {n:3} is now at {n:9} percent, with weeks between {n:7} and {n:11}. Line {n:4}, where nothing changed, stays at {n:13} percent.' },
    { nl: 'De twee banden overlappen nauwelijks, en de vergelijkingslijn bewoog niet. Het effect is dus vrijwel zeker echt.',
      en: 'The two bands barely overlap, and the comparison line did not move. So the effect is very likely real.' },
  ],
  [ // s4 a run chart, regression to the mean
    { nl: 'Experts discussiëren hierover. Sommigen willen een formele statistische toets. De meeste praktijkmensen nemen genoegen met een run chart, de weekwaarden uitgezet in de tijd, plus een vergelijkingsgroep.',
      en: 'Experts argue about this. Some want a formal statistical test. Most practitioners settle for a run chart, weekly values plotted over time, plus a comparison group.' },
    { nl: 'Let op {t:Regressie naar het gemiddelde|regressie naar het gemiddelde}. Projecten starten vaak na een slechte periode, en daarna zakken de cijfers vanzelf terug richting normaal.',
      en: 'Watch for {t:Regression to the mean|regression to the mean}. Projects often start after a bad spell, and then the numbers drift back toward normal anyway.' },
    { nl: 'Een deel van je winst kan dat zijn.',
      en: 'Part of your gain may be just that.' },
    { nl: 'En een resultaat dat wegzakt zodra jij weg bent, is ook een waarschuwing. Meet drie maanden na de afsluiting opnieuw.',
      en: 'And a result that fades once you leave is another warning sign. Measure again three months after closing.' },
  ],
  [ // s5 money in the client's terms
    { nl: 'Dan het geld, in de termen van de klant. Vrijgekomen uren zijn alleen geld als er iets verandert in de boeken: minder overwerk, een ploeg minder, meer product verkocht, of een investering die niet nodig is.',
      en: 'Then the money, in the client\'s terms. Freed hours are only money if something changes on the books: overtime cut, a shift dropped, more product sold, or an investment avoided.' },
    { nl: 'Bij een netbeheerder kan het zijn: klanten sneller aangesloten, of minder verloren klantminuten. Dat zijn de minuten zonder stroom, opgeteld over alle klanten.',
      en: 'At a grid operator it may be customers connected sooner, or fewer customer minutes lost: minutes without power, added up over all customers.' },
    { nl: 'Kun je extra output verkopen, reken dan met de {t:Dekkingsbijdrage|dekkingsbijdrage}: de prijs min de variabele kosten, zoals materiaal en energie.',
      en: 'If extra output can be sold, value it at {t:Contribution margin|contribution margin}: the sales price minus variable costs, such as material and energy.' },
    { nl: 'En laat de {t:Controller|controller} de som checken: de financiële man of vrouw die bij de klant de cijfers beheert.',
      en: 'And let the {t:Controller|controller} check the sum: the finance person who owns the client\'s numbers.' },
  ],
  [ // s6 the sum
    { nl: 'Terug naar de bottelarij. Lijn {n:3} is gepland op {n:6000} uur per jaar. Van {n:14} naar {n:9} procent is {n:5} punten minder stilstand: {n:300} extra draaiuren.',
      en: 'Back to the bottling plant. Line {n:3} is planned for {n:6000} hours a year. From {n:14} to {n:9} percent is {n:5} points less downtime: {n:300} extra running hours.' },
    { nl: 'De fabriek is uitverkocht, dus die uren worden extra product.',
      en: 'The plant is sold out, so those hours become extra product.' },
    { nl: 'De controller waardeert een uur op {n:450} euro dekkingsbijdrage. Dat is {n:300} uur maal {n:450} euro: ongeveer {n:135000} euro per jaar.',
      en: 'The controller values an hour at {n:450} euro of contribution margin. That is {n:300} hours times {n:450} euro: about {n:135000} euro a year.' },
    { nl: 'Je presenteert het samen met de controller, die de som heeft nagekeken.',
      en: 'You present it together with the controller, who checked it.' },
  ],
  [ // s7 the people side
    { nl: 'Dan de mensenkant: claim niet te veel. Zeg wat je weet, en wat je niet weet.',
      en: 'Then the people side: don\'t overclaim. Say what you know, and what you don\'t.' },
    { nl: 'Bijvoorbeeld: de stilstand ging van {n:12} naar {n:8} procent. Ongeveer één punt komt waarschijnlijk door het lagere zomervolume. De rest schrijven we toe aan de veranderingen.',
      en: 'For example: downtime went from {n:12} to {n:8} percent. About one point is likely the lower summer volume. The rest we attribute to the changes.' },
    { nl: 'Verwelkom een kritische controller: zijn ja is meer waard dan jouw mooie dia. En geef de eer aan het team dat het werk deed.',
      en: 'Welcome a sceptical controller: their approval is worth more than your slide. And give the credit to the team that did the work.' },
    { nl: 'Stel jezelf één scherpe vraag: als een bestuurslid dit getal aanvalt, wie behalve ik verdedigt het dan?',
      en: 'Ask yourself one sharp question: if a board member challenges this number, who besides me will defend it?' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, and in
// Dutch none of the words espeak-ng misreads (see above)
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = /\b(nameting|periodelengte|databron|productmix|vuistregel|richtlijn|verkoopprijs|nagerekend|akkoord|slide|\w*manager\w*)\b/i;
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const plain = plainSay(line[lang]);
  if (/[/&×=+()“”"‘…%€]|:\S/.test(plain)) throw new Error(`narration: a symbol the voice reads aloud in "${plain.slice(0, 50)}"`);
  if (lang === 'nl' && MISREAD.test(plain)) throw new Error(`narration: "${MISREAD.exec(plain)[0]}" is misread by the Dutch voice in "${plain.slice(0, 50)}"`);
}
// each scene's length from its share of the narration (the longer of nl and
// en, at the kit's 2.5 words a second), never shorter than its captions need;
// the whole as long as the narration estimate, within the 300 s cap, no padding
{
  const said = SAY.map((s) => Math.max(...['nl', 'en'].map((lang) => s.reduce((a, l) => a + wordsOf(plainSay(l[lang])), 0))));
  const all = said.reduce((a, b) => a + b, 0);
  const TOTAL = Math.min(300, Math.round(all / NARRATION_WPS));
  spec.scenes.forEach((s, si) => {
    const cap = Math.max(...['nl', 'en'].map((lang) => minSceneDur(wordsOf(s.beats.map((b) => plainSay(b[lang])).join(' ')) + 4)));
    s.dur = Math.max(Math.ceil(cap), Math.floor((said[si] / all) * TOTAL));
  });
  // the seconds lost to rounding down go to the scenes that lost the most
  const left = TOTAL - spec.scenes.reduce((a, s) => a + s.dur, 0);
  spec.scenes.map((s, si) => [si, (said[si] / all) * TOTAL - s.dur]).sort((x, y) => y[1] - x[1])
    .slice(0, Math.max(0, left)).forEach(([si]) => { spec.scenes[si].dur += 1; });
  const total = spec.scenes.reduce((a, s) => a + s.dur, 0);
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
C.dur = spec.scenes.map((s) => s.dur);

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = PM_CSS + `
.cr-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.cr-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.cr-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.cr-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.cr-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.cr-big,.cr-lab{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.cr-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.cr-axis{fill:none;stroke:var(--anatomy-lo);stroke-width:1.2}
.cr-grid{fill:none;stroke:var(--anatomy-shade-3);stroke-width:1}
.cr-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:4 4}
.cr-mean{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:8 4}
.cr-line{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.cr-dash4{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:5 4;stroke-linejoin:round}
.cr-dot{fill:var(--anatomy-hi);stroke:var(--anatomy-card);stroke-width:1}
.cr-dot4{fill:var(--anatomy-mid);stroke:var(--anatomy-card);stroke-width:1}
.cr-ghost{fill:var(--anatomy-card);stroke:var(--anatomy-mid);stroke-width:1.4}
.cr-hotdot{fill:var(--fp-accent);stroke:var(--anatomy-card);stroke-width:1}
.cr-band{fill:color-mix(in srgb,var(--anatomy-mid) 22%,transparent);stroke:var(--anatomy-mid);stroke-width:1}
.cr-band2{fill:color-mix(in srgb,var(--fp-accent) 18%,transparent);stroke:var(--fp-accent);stroke-width:1}
.cr-strike{fill:none;stroke:var(--anatomy-strong);stroke-width:2;stroke-linecap:round}
.cr-row{fill:none;stroke:var(--anatomy-lo);stroke-width:.7;stroke-linecap:round}
.cr-tick{fill:none;stroke:var(--fp-accent);stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round}
[data-cue][data-on] .cr-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .cr-line,[data-cue][data-on] .cr-dash4,[data-cue][data-on] .cr-band{stroke:var(--fp-accent)}
[data-cue][data-on] .cr-dot,[data-cue][data-on] .cr-dot4{fill:var(--fp-accent)}
[data-cue][data-on] .cr-txt,[data-cue][data-on] .cr-big,[data-cue][data-on] .cr-lab,[data-cue][data-on] .cr-mute{fill:var(--fp-focus-text)}
[data-cue][data-on] .cr-row{stroke:var(--fp-accent)}
.cr-mini .cr-txt,.cr-mini .cr-mute,.cr-mini .cr-big,.cr-mini .cr-lab,.cr-mini .cr-on{display:none}
.cr-mini *{vector-effect:non-scaling-stroke}
.cr-mini .cr-card,.cr-mini .cr-hot,.cr-mini .cr-line,.cr-mini .cr-band,.cr-mini .cr-band2{stroke-width:.7px}
.cr-mini .cr-axis,.cr-mini .cr-grid,.cr-mini .cr-dash,.cr-mini .cr-dash4,.cr-mini .cr-mean,.cr-mini .cr-strike,.cr-mini circle{stroke-width:.4px}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (world.mjs gives heads only a light outline) */
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="controller"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="controller"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard dat het paneel in het klein herhaalt, en een klok. Jij, de adviseur in petrol, staat bij het bord. De teamleider staat aan het linkereind van de tafel, de sponsor in pak aan het rechtereind, de controller van de klant met een tablet aan de voorkant. Op tafel een vel met de ruwe data, een laptop en twee kopjes. Rechts een paneel met kaarten, gemarkeerd als voorbeeld of schema: de nulmeting en wat gelijk moet blijven; een run chart van lijn 3 met twaalf weken nulmeting rond 14 procent en een band van 11 tot 17 procent, tien weken erna rond 9 procent, en lijn 4 als vergelijkingslijn rond 13 procent; een slechte periode die vanzelf terugzakt; wanneer uren geld zijn en de dekkingsbijdrage; de som van 300 uur maal 450 euro; en de mensenkant met de scherpe vraag.',
  en: 'A meeting room. On the back wall a whiteboard that repeats the panel in miniature, and a clock. You, the consultant in petrol, stand at the board. The team lead stands at the left end of the table, the sponsor in a suit at the right end, the client\'s controller with a tablet at the front. On the table a sheet with the raw data, a laptop and two cups. At the right a panel with cards, marked as example or diagram: the baseline and what must stay the same; a run chart of line 3 with twelve baseline weeks around 14 percent and a band from 11 to 17 percent, ten weeks after around 9 percent, and line 4 as the comparison line around 13 percent; a bad spell that drifts back by itself; when hours are money and the contribution margin; the sum of 300 hours times 450 euro; and the people side with the sharp question.',
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

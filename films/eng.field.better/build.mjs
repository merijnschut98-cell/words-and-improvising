// Dev tool, not shipped. Builds the field film "De fabriek beter maken / Making the plant better"
// (eng.field.better), the fifth Engineering field film (v17, Task 13): the level above the module intros.
// It places the four modules of the zone (FIELDS in src/content/courses/index.js: improve, spc, cost,
// reliability) on one road and says, per station, what it is for, what the part of the story needs from it,
// which two tools of the module you use there (named, not explained: the checkpoint rule of 14 Nov) and what
// goes wrong without it. The map, not a lesson: no calculations, no numbers.
//
//   node films/eng.field.better/build.mjs            build the page
//   node films/eng.field.better/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.field.better.html: one offline page with the anatomy kit, the stage
// script and the player inlined. The index names it (the field's `film`), sw.js precaches it.
//
// The story continues eng.field.run in the same plant: the filling unit stands on line 3 in hall B (a steel
// frame, a plate over the belt, a plastic cover, the tank behind it). The shift is over, but too-light cartons
// keep coming out of the unit, so you and the team lead stay to make the line better. This zone is about
// improving, not about keeping the line running: one recurring problem, followed through four stations.
//   s1 the opening: after the shift, too-light cartons keep coming from the unit; you and the team lead stay
//      to fix it for good; that takes four things; the road with four stations
//   s2 Technisch probleemoplossen (eng.improve): find the root cause, not only treat the symptom; you go and see
//      for yourself where it happens and look for the cause; an Ohno circle and a why tree
//      (eng.improve.gemba, eng.improve.fishbone); without it you treat the symptom and the problem can come back
//   s3 Meten en SPC verdiept (eng.spc): follow the fill weight with data, not by feel; cartons are weighed at the
//      end of the belt (one first after a changeover, then equal batches) and the too-light ones are counted per batch; a first-off check and an np chart
//      (eng.spc.floor, eng.spc.charts); without it you react to routine noise or miss a real change
//   s4 Kostprijs en investeringen (eng.cost): know what the problem costs and what the fix may cost; a too-light
//      carton goes in the bin and costs money, a fix costs money too; the cost of poor quality and a cash saving
//      (eng.cost.waste, eng.cost.capex); without it nobody knows whether the fix is worth the effort
//   s5 Betrouwbaarheid en assetstrategie (eng.reliability): make the line more reliable where it counts; not
//      every part counts the same, you look at what happens when it fails; a risk matrix and an FMECA
//      (eng.reliability.criticality, eng.reliability.fmeca); without it you do not know which part to tackle first
//   s6 the shared Engineering map (the kit's mapScene, as the app draws it) with the four stations lit: the
//      whole map, the zone, then place by place at 1.5 (first and last topic of each), then back to the
//      zone for two beats on how they connect, and where to start
// How the stations connect: the order of the road is the order of the zone (level, then map position): first the
// cause, then the measurements that show whether the process really changes, then what it is worth and where to
// do it first; the closing says it in two beats.
// The tools come from the modules' own lessons (checked below), each a term of the lesson's glossary at Basis
// or Working knowledge level that no field film, module intro or other Engineering module names as a term of its
// own, and none of them the title of a topic: an Ohno circle and a why tree (improve), a first-off check and an
// np chart (spc), the cost of poor quality and a cash saving (cost), a risk matrix and an FMECA (reliability;
// the risk matrix is also a term of the grid operations module, a different zone). Terms come from the field's
// lessons (the kit's field mode, films/_kit/build-film.mjs); the kit holds the film to its road (every module
// named in a caption of its own scene, in the order of the road, explained in two beats and lit, ending on the
// map with the field's places lit), to the narration guard and to the label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): the people of the cast (you and the team
// lead), the table and the laptop, the room, and the conveyor of hall B from the pilot
// (films/pm.plan.intro/hall.mjs), imported. A panel at the right draws each station as four small schemas
// (what it is for, how it works, then one for each tool as it is named), two chips with the tools and a
// dashed card with what goes wrong without it.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { mapScene, mapStyles, mapCue } from '../_kit/mapscene.mjs';
import { wrapUnits, CHAR_W, STATION_UNITS } from '../_kit/assert.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';
import { hallWorld, HALL_CSS } from '../pm.plan.intro/hall.mjs';
import { FIELDS, MODULES } from '../../src/content/courses/index.js';
import engMap from '../../src/content/courses/maps/eng.js';
import { pathBox } from '../../src/content/courses/validate.js';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));



// ---------------------------------------------------------------- the field
// The road this film draws, asserted against the index (the build fails if the field's modules move), and the
// lessons' words the narration leans on: the lessons the tool names come from (the names are terms of those
// lessons) and the lessons for what each station is for and what goes wrong without it.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const FIELD = FIELDS.find((f) => f.id === 'eng.field.better');
const ROAD = ['eng.improve', 'eng.spc', 'eng.cost', 'eng.reliability'];
assert(JSON.stringify(FIELD.modules) === JSON.stringify(ROAD), 'the better field is the road improve, spc, cost, reliability');
// A station is named by its module's own title in this film (no label): "Technisch probleemoplossen", "Meten en SPC
// verdiept", "Kostprijs en investeringen", "Betrouwbaarheid en assetstrategie" and their English titles
const nameOf = (id, lang) => MODULES.find((m) => m.id === id).title[lang];
// the panel heading draws the station's name in at most two lines of the panel's width (the kit does not measure it)
for (const id of ROAD) for (const lang of ['nl', 'en']) {
  const t = nameOf(id, lang);
  const lines = wrapUnits(t, 284, CHAR_W);
  assert(lines.length <= 2 && lines.every((ln) => ln.split(' ').every((wd) => wrapUnits(wd, 284, CHAR_W).length === 1)), `the heading "${t}" (${lang}) does not fit two lines of 284 units`);
}
const lessons = await allLessons();
const misses = [];
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def}`)].join('\n'); for (const s of list) if (!text.includes(s)) misses.push(`${id} (${lang}) no longer says "${s}"`); };
// every check below collects what the lessons no longer say, and the build fails with the list
// s2 improve: a root cause is the cause that stops the problem coming back; a symptom is what you see; go and see for yourself
// (the gemba); the Ohno circle is standing still at one spot to watch the work; a why tree is a 5 whys with branches
has('eng.improve.whys', ['Een grondoorzaak is de oorzaak die het probleem stopt als je hem weghaalt', 'Symptoom Wat je van een probleem ziet']);
has('eng.improve.whys', ['A root cause is the cause that, once removed, stops the problem coming back', 'Symptom What you see of a problem'], 'en');
has('eng.improve.gemba', ['Gemba is Japans voor “de echte plek”', 'je begrijpt een probleem door het te zien, niet uit een rapport of van een scherm', 'de Ohno-cirkel (Ohno circle), tot ze de verspilling zagen', 'Ohno-cirkel Op één plek op de vloer blijven staan en het werk bekijken tot je de verspilling ziet']);
has('eng.improve.gemba', ['Gemba is Japanese for “the actual place”', 'you understand a problem by seeing it, not from a report or a screen', 'the Ohno circle, until they saw the waste', 'Ohno circle Standing still at one spot on the floor to watch the work until you see the waste'], 'en');
has('eng.improve.fishbone', ['één nette keten, en een maand later is het probleem terug', 'splits de keten dan in een waaromboom (why tree), een 5 keer waarom met takken', 'Waaromboom Een 5 keer waarom met takken, voor als één antwoord meer dan één oorzaak heeft']);
has('eng.improve.fishbone', ['one tidy chain, and the problem back a month later', 'split the chain into a why tree, a 5 whys with branches', 'Why tree A 5 whys with branches, for when one answer has more than one cause'], 'en');
// s3 spc: the limits are the voice of the process, what it does by itself; the two mistakes are reacting to routine noise and
// missing a real change; a first-off check measures the first part after a setup before the run continues; an np chart plots
// the number defective at a fixed sample size
has('eng.spc.limits', ['De grenzen zijn de stem van het proces (voice of the process): wat dit proces uit zichzelf doet', 'Fout 1: reageren op gewone ruis alsof er iets veranderd is. Fout 2: een echte verandering missen']);
has('eng.spc.limits', ['The limits are the voice of the process: what this process does by itself', 'Mistake 1: reacting to routine noise as if something changed. Mistake 2: missing a real change'], 'en');
has('eng.spc.floor', ['Een eerstestukcontrole (first-off check), het eerste stuk na een omstelling meten voordat de serie doorloopt, vangt instelfouten', 'Eerstestukcontrole Het eerste stuk na een omstelling meten voordat de serie doorloopt']);
has('eng.spc.floor', ['A first-off check, measuring the first part after a setup before the run continues, catches setup errors', 'First-off check Measuring the first part after a setup before the run continues'], 'en');
has('eng.spc.charts', ['Een np-kaart zet het aantal afgekeurde stuks uit bij een vaste steekproefgrootte', 'np-kaart Kaart voor het aantal afgekeurde stuks in een steekproef van vaste grootte']);
has('eng.spc.charts', ['An np chart plots the number defective with a fixed sample size', 'np chart Chart for the number of defective parts in a sample of fixed size'], 'en');
// s4 cost: the cost of poor quality is the failure part of the cost of quality (scrap, rework, claims); scrap is priced at the cost
// that is really lost; a cash saving only counts if money really stops going out or comes in; payback is investment over the yearly cash saving
has('eng.cost.waste', ['Faalkosten Het faaldeel van de kwaliteitskosten', 'Prijs uitval tegen de kosten die echt verloren zijn']);
has('eng.cost.waste', ['Cost of poor quality The failure part of the cost of quality', 'Price scrap at the cost that is really lost'], 'en');
has('eng.cost.capex', ['Kasbesparing Een besparing die echt minder geld laat uitgaan of meer laat binnenkomen', 'Een besparing telt alleen als er echt minder geld uitgaat of meer binnenkomt', 'Terugverdientijd = investering / jaarlijkse kasbesparing']);
has('eng.cost.capex', ['Cash saving A saving that actually reduces money going out or brings money in', 'A saving only counts if money actually stops going out or new money comes in', 'Payback time = investment / yearly cash saving'], 'en');
// s5 reliability: a criticality analysis ranks assets by what happens when they fail; the risk matrix is a grid of consequence against likelihood; an FMECA is an FMEA with a criticality rating per failure mode
has('eng.reliability.criticality', ['Een kritikaliteitsanalyse rangschikt assets naar wat er gebeurt als ze uitvallen', 'De meeste sites gebruiken een risicomatrix: een raster met het gevolg op de ene as en de kans op de andere', 'Risicomatrix Raster dat gevolg tegen kans zet']);
has('eng.reliability.criticality', ['A criticality analysis ranks assets by what happens when they fail', 'Most sites use a risk matrix: a grid with consequence on one axis and likelihood on the other', 'Risk matrix Grid that scores consequence against likelihood'], 'en');
has('eng.reliability.fmeca', ['Een machine-FMEA (equipment FMEA, failure mode and effects analysis) deelt een asset op in onderdelen of functies', 'FMECA Een FMEA met een kritikaliteitsscore per faalwijze']);
has('eng.reliability.fmeca', ['An equipment FMEA (failure mode and effects analysis) breaks an asset into its parts or functions', 'FMECA An FMEA with a criticality rating per failure mode'], 'en');

assert(misses.length === 0, `the lessons changed:\n  ${misses.join('\n  ')}`);

// ---------------------------------------------------------------- the world (hall B: the filling unit on line 3 and what makes it better)
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

// where things stand (cm): the filling unit of the other field films over the start of line 3's belt (two uprights and a
// beam, a plate hung from the beam above the cartons, a plastic cover on top, the tank at the back wall at the left
// with its pipe into the plate), as tall as a person. New here, each from the scene of its station: a chalk circle on
// the floor in front of the belt, where you stand and watch, and a board on two posts with the why tree (second scene);
// the check table at the end of the belt with a scale and a carton on it, and the control chart on the back wall at the
// right (third); a crate with the bad cartons at the end of the belt and the table with the laptop and the sheet of the
// case at the front left (fourth); the risk matrix and the FMECA sheet on the side wall (fifth). You and the team lead
// stand in front in the opening (at the same spots as in eng.field.run: pp-jij0 beside the team lead); in the second scene you stand in the
// circle (pp-jij, the same cue). The weighing is a pass/fail count: after a changeover one carton is weighed first (the first-off check), then
// batches of equal size, and the too-light ones are counted per batch, which is what an np chart plots (the lesson: the number defective at a
// fixed sample size); the chart on the wall and the panel schema show those counts, not the weights.
const BELT = { x: 130, y: 16, len: 130, dep: 34 };
const UX = 152; // x of the uprights and the beam
const FRAME = { top: 150, beam: 160 };
const PLATE = { z0: 100, z1: 146 }; // the filling head: its foot clears the cartons (60 to 80)
const TANK = { x: 62, y: 34, r: 20, h: 130 };
const PIPE = { y: 28, z: 118 };
const TABLE = { x: 18, y: 108, w: 76, d: 42, h: 74 }; // the table with the laptop (the investment case)
const CHART = { x0: 196, x1: 262, z0: 112, z1: 168 }; // the control chart on the back wall
const QT = { x: 262, y: 58, w: 26, d: 44, h: 70 }; // the table with the scale at the end of the belt
const CRATE = { x: 166, y: 78, w: 44, d: 32, h: 30 }; // the crate with the bad cartons
const RING = { x: 232, y: 124, r: 22 }; // the chalk circle on the floor, where you stand
const TREE = { x: 96, y: 80, w: 38, d: 3, z0: 78, z1: 138 }; // the board with the why tree, on two posts
const RISK = { y0: 56, y1: 114, z0: 104, z1: 176 }; // the risk matrix on the side wall
const FMEC = { y0: 122, y1: 168, z0: 104, z1: 176 }; // the FMECA sheet on the side wall
const frame = [
  w.box({ x: UX, y: 5, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 52, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 5, w: 9, d: 56, r: 1 }, FRAME.top, FRAME.beam, { tone: 'mid' }, { steps: 2 }),
].join('');
const plate = w.box({ x: UX + 9, y: BELT.y, w: 3.2, d: 36, r: 0.6 }, PLATE.z0, PLATE.z1, { tone: 'mid' }, { steps: 2 });
const cover = w.box({ x: UX - 7, y: 12, w: 23, d: 42, r: 7 }, FRAME.beam, FRAME.beam + 24, { tone: 'hi' }, { steps: 4, bevel: 1.2 });
const tank = w.post(TANK.x, TANK.y, TANK.r, 0, TANK.h, { tone: 'mid' }, 28)
  + w.post(TANK.x, TANK.y, TANK.r - 4, TANK.h, TANK.h + 5, { tone: 'lo' }, 24)
  + w.box({ x: TANK.x + TANK.r - 2, y: PIPE.y, w: UX + 9 - TANK.x - TANK.r + 2, d: 6, r: 2 }, PIPE.z, PIPE.z + 8, { tone: 'lo' }, { steps: 2 });
const f1 = (v) => (Math.round(v * 10) / 10).toString();
const at = w.at;
const line = (pts, tone = 'lo', extra = {}) => k.lineSvg(k.pathOf(pts.map((p) => at(p))), { tone, ...extra });
// a few short strokes on a face: [x0, x1, z] on the plane y
const strokes = (y, rows, tone = 'lo', extra = {}) => k.lineSvg(rows.map(([x0, x1, z]) => k.pathOf([at([x0, y, z]), at([x1, y, z])])).join(''), { tone, ...extra });
// the chalk circle: a ring on the floor
const circle = line([...k.circleRing(RING.x, RING.y, RING.r, 48), [RING.x + RING.r, RING.y]].map(([px, py]) => [px, py, 0.3]), 'hi');
// the why tree: a board on two posts with a tree of strokes on its face, from the problem at the left to the causes at the right
const TY = TREE.y + TREE.d + 0.3; // the board's front face
const treeSegs = (x0, z0) => [
  [[x0 + 5, z0 + 30], [x0 + 12, z0 + 30]], [[x0 + 12, z0 + 14], [x0 + 12, z0 + 46]], [[x0 + 12, z0 + 46], [x0 + 22, z0 + 46]], [[x0 + 12, z0 + 14], [x0 + 22, z0 + 14]],
  [[x0 + 22, z0 + 6], [x0 + 22, z0 + 22]], [[x0 + 22, z0 + 22], [x0 + 31, z0 + 22]], [[x0 + 22, z0 + 6], [x0 + 31, z0 + 6]],
];
const treeBoard = w.post(TREE.x + 4, TREE.y + 1.5, 1.8, 0, TREE.z0, { tone: 'lo' }, 10) + w.post(TREE.x + TREE.w - 4, TREE.y + 1.5, 1.8, 0, TREE.z0, { tone: 'lo' }, 10)
  + w.box({ x: TREE.x, y: TREE.y, w: TREE.w, d: TREE.d, r: 0.8 }, TREE.z0, TREE.z1, { tone: 'mid' }, { steps: 2, bevel: 0.4 })
  + `<g transform="${w.planeY(TY)}"><path class="pm-board" d="${w.rectD(TREE.x + 2.4, -(TREE.z1 - 2.4), TREE.x + TREE.w - 2.4, -(TREE.z0 + 2.4))}"/></g>`
  + k.lineSvg(treeSegs(TREE.x, TREE.z0 + 14).map(([a, b]) => k.pathOf([at([a[0], TY + 0.3, a[1]]), at([b[0], TY + 0.3, b[1]])])).join(''), { tone: 'lo' })
  + k.dotsSvg([[TREE.x + 5, TREE.z0 + 44], [TREE.x + 22, TREE.z0 + 60], [TREE.x + 31, TREE.z0 + 36], [TREE.x + 31, TREE.z0 + 20]].map(([px, pz]) => at([px, TY + 0.3, pz])), { size: 1.3, tone: 'hi' });
// the check table at the end of the belt with a scale on it: a slab, a plate, a display behind, and a carton on the plate
const SY = QT.y + 12;
const scale = w.table(QT)
  + w.box({ x: QT.x + 7, y: QT.y + 4, w: 12, d: 4, r: 0.8 }, QT.h, QT.h + 14, { tone: 'lo' }, { steps: 1 })
  + w.box({ x: QT.x + 3, y: SY, w: 20, d: 26, r: 2 }, QT.h, QT.h + 4, { tone: 'lo' }, { steps: 2 })
  + w.box({ x: QT.x + 4, y: SY + 1, w: 18, d: 24, r: 1.6 }, QT.h + 4, QT.h + 6, { tone: 'mid' }, { steps: 2 })
  + w.box({ x: QT.x + 6, y: SY + 4, w: 14, d: 18, r: 1 }, QT.h + 6, QT.h + 22, { tone: 'hi' }, { steps: 1 });
// the control chart: a board on the back wall with a centre line, two dashed limits and the points of seven samples, the last one over the limit
const CZ = [138, 144, 135, 146, 140, 148, 163]; // the heights of the points (cm)
const chartPts = CZ.map((z, i) => [CHART.x0 + 9 + i * ((CHART.x1 - CHART.x0 - 18) / 6), 3.9, z]);
const chartBoard = w.box({ x: CHART.x0, y: 0, w: CHART.x1 - CHART.x0, d: 3.4, r: 1 }, CHART.z0, CHART.z1, { tone: 'mid' }, { steps: 2, bevel: 0.4 })
  + `<g transform="${w.planeY(3.6)}"><path class="pm-board" d="${w.rectD(CHART.x0 + 3, -(CHART.z1 - 3), CHART.x1 - 3, -(CHART.z0 + 3))}"/></g>`
  + strokes(3.9, [[CHART.x0 + 6, CHART.x1 - 6, 141]], 'lo')
  + strokes(3.9, [[CHART.x0 + 6, CHART.x1 - 6, 157], [CHART.x0 + 6, CHART.x1 - 6, 124]], 'mid', { dashed: true })
  + k.lineSvg(k.pathOf(chartPts.map((p) => at(p))), { tone: 'mid' })
  + k.dotsSvg(chartPts.map((p) => at(p)), { size: 1.5, tone: 'hi' });
// the crate with the bad cartons: a low crate with two cartons standing in it
const crate = w.box({ x: CRATE.x, y: CRATE.y, w: CRATE.w, d: CRATE.d, r: 2 }, 0, CRATE.h, { tone: 'lo' }, { steps: 2, bevel: 0.5 })
  + w.box({ x: CRATE.x + 6, y: CRATE.y + 6, w: 20, d: 18, r: 1 }, CRATE.h, CRATE.h + 16, { tone: 'hi' }, { steps: 1 })
  + w.box({ x: CRATE.x + 22, y: CRATE.y + 12, w: 16, d: 15, r: 1 }, CRATE.h, CRATE.h + 10, { tone: 'hi' }, { steps: 1 });
// the table with the laptop and the sheet of the case
const caseSheet = w.sheet({ x: TABLE.x + TABLE.w - 26, y: TABLE.y + 10, z: TABLE.h, w: 14, d: 20, lines: 4 }).svg;
const laptopTable = w.table(TABLE) + w.laptop({ x: TABLE.x + 24, y: TABLE.y + TABLE.d / 2, z: TABLE.h, toward: 1 }) + caseSheet;
// the two boards on the side wall (x = 0): local (u, v) on the face is (-y, -z). The risk matrix is a grid of three by three
// with the top right cell marked, the FMECA sheet a header and three rows.
const SX = 2.7;
const sideBoard = (b) => w.box({ x: 0, y: b.y0, w: 2.6, d: b.y1 - b.y0, r: 0.6 }, b.z0, b.z1, { tone: 'mid' }, { steps: 2, bevel: 0.4 })
  + `<g transform="${w.planeX(SX)}"><path class="pm-board" d="${w.rectD(-(b.y1 - 2.4), -(b.z1 - 2.4), -(b.y0 + 2.4), -(b.z0 + 2.4))}"/></g>`;
const cellsOf = (b) => {
  const m = 6;
  const cw = (b.y1 - b.y0 - 2 * m - 4) / 3;
  const ch = (b.z1 - b.z0 - 2 * m - 4) / 3;
  const out = [];
  for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) {
    const u0 = -(b.y1 - m) + i * (cw + 2);
    const v0 = -(b.z1 - m) + j * (ch + 2);
    out.push(`<path class="${i === 2 && j === 0 ? 'pm-hot' : 'pm-cell'}" d="${w.rectD(u0, v0, u0 + cw, v0 + ch)}"/>`);
  }
  return `<g transform="${w.planeX(SX + 0.1)}">${out.join('')}</g>`;
};
const fmecRows = (b) => {
  const m = 6;
  const u0 = -(b.y1 - m);
  const u1 = -(b.y0 + m);
  const z = (t) => -(b.z1 - m) + t * (b.z1 - b.z0 - 2 * m);
  const cols = [u0 + 0.38 * (u1 - u0)];
  const rules = [0.25, 0.5, 0.75].map((t) => `M${f1(u0)} ${f1(z(t))}H${f1(u1)}`).join('') + `M${f1(cols[0])} ${f1(z(0))}V${f1(z(1))}`;
  return `<g transform="${w.planeX(SX + 0.1)}"><path class="pm-hatch" d="${w.rectD(u0, z(0), u1, z(0.25))}"/><path class="pm-rule" d="${rules}"/></g>`;
};
const riskBoard = sideBoard(RISK) + cellsOf(RISK);
const fmecBoard = sideBoard(FMEC) + fmecRows(FMEC);
const person = (role, x, y, along) => w.person({ x, y, role, along });

const world = [
  w.room(ROOM),
  // each thing appears in the scene of its station (the stage script shows the groups o-*), so every drawn detail
  // meets its reason in the narration: the circle and the why tree at the second scene, the scale and the chart at the
  // third, the crate and the laptop with the case at the fourth, the risk matrix and the FMECA at the fifth
  g('o-wall', cueG('matrix', riskBoard) + cueG('fmeca', fmecBoard)),
  g('o-ring', cueG('circle', circle)),
  cueG('line3', hall.conveyor({ ...BELT, cartons: 4 })),
  cueG('tank', tank),
  cueG('unit', frame + plate + cover),
  g('o-chart', cueG('chart', chartBoard)),
  g('o-scale', cueG('scale', scale)),
  g('o-crate', cueG('scrap', crate)),
  g('o-tree', cueG('tree', treeBoard)),
  g('o-lap', cueG('laptop', laptopTable)),
  g('pp-teamlead', person('teamlead', 128, 132, 'x')),
  g('pp-jij0', person('jij', 188, 132, 'x')),
  g('pp-jij', person('jij', RING.x, RING.y, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group (data-cue), filled by the stage script each frame
// (data-k). The road holds the four stations, one cue group each (st-<slug>): in s1 a row with its number and
// title, in s2 to s5 a numbered square of the strip under the heading. The shared Engineering map (mapScene,
// the four stations lit) replaces the room and the panel in the last scene; its places are cue groups of their
// own (map-<slug>).
const STATION_CUE = Object.fromEntries(ROAD.map((id) => [id, `st-${id.split('.')[1]}`]));
const stations = ROAD.map((id, i) => cueG(STATION_CUE[id], g(`rd${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('road', g('roadB', '') + stations)
  + cueG('flow', g('flowB', '')) + cueG('shift', g('shiftB', '')) + cueG('route', g('routeB', '')) + cueG('for', g('forB', ''))
  + cueG('t1', g('t1B', '')) + cueG('t2', g('t2B', ''))
  + cueG('without', g('withoutB', '')));
const { w: MAP_W, h: MAP_H } = engMap.view; // the Engineering map's sheet (viewBox of the wide drawing), from the map data
const MAP = (await mapScene({ subject: 'eng', highlight: ROAD })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
for (const id of ROAD) assert(MAP.includes(`data-cue="${mapCue(id)}"`), `the map lights ${id} as a cue group`);
assert(MAP.includes(`viewBox="0 0 ${MAP_W} ${MAP_H}"`), `the Engineering map is ${MAP_W} by ${MAP_H}`);
// the centre of each station's place on the map, for the zoom of the closing scene, and the zone's band
const MAPZ = ROAD.map((id) => { const p = engMap.places.find((x) => x.module === id); return [p.x + p.w / 2, p.y + p.h / 2]; });
const ZONEB = engMap.zones.find((z) => z.field === FIELD.id);
const ZBAND = [pathBox(ZONEB.path)[1], pathBox(ZONEB.path)[3]]; // top and bottom of the zone's band
assert(ZBAND[1] > ZBAND[0] && MAPZ.every(([, y]) => y > ZBAND[0] && y < ZBAND[1]), 'the four places lie inside the better zone');

// Static paths with relative line-tos (the helper of pm.plan.schedule and the pilot): the
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
// stage while the hall scales by s (camera() in stage.js). Each scene looks at what its station is about.
const cam = (x, y, z, s) => [...w.at([x, y, z]).map((v) => Math.round(v * 10) / 10), s];
const CAM = [
  { from: cam(150, 70, 70, 1), to: cam(150, 70, 70, 1.08) }, // s1 the hall: the unit on line 3, the tank, you and the team lead
  { from: cam(150, 90, 60, 1.2), to: cam(150, 90, 60, 1.32) }, // s2 the circle in front of the belt and the board with the why tree
  { from: cam(235, 60, 90, 1.25), to: cam(235, 60, 90, 1.38) }, // s3 the end of the belt: the scale and the chart on the wall
  { from: cam(150, 90, 50, 1.05), to: cam(150, 90, 50, 1.15) }, // s4 the crate at the end of the belt and the laptop at the front left
  { from: cam(70, 90, 100, 1.05), to: cam(70, 90, 100, 1.18) }, // s5 the risk matrix and the FMECA sheet on the side wall, the unit beside them
  { from: cam(150, 85, 60, 1), to: cam(150, 85, 60, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
const MAPS = ROAD.map(mapCue);
// the two tools of a station: the chips of the panel, plus the parts of the room they belong to
const TOOLCUE = (a, b, room = []) => ({ cue: { [a]: 't1', [b]: 't2' }, focus: ['t1', 't2', ...room] });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.field.better',
  title: { nl: 'De fabriek beter maken', en: 'Making the plant better' },
  field: 'eng.field.better',
  // the road: per module of the field, the scene that explains it and its station on the road
  stations: Object.fromEntries(ROAD.map((id, i) => [id, { scene: `s${i + 2}`, cue: STATION_CUE[id] }])),
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Na de dienst op lijn 3', en: 'After the shift on line 3' },
      beats: [
        { nl: 'Op lijn 3 komen telkens te lichte dozen uit de vuleenheid.', en: 'On line 3 too-light cartons keep coming out of the filling unit.', focus: ['flow', 'unit', 'tank', 'line3'] },
        { nl: 'Jij bent de engineer. Na de dienst blijf je met de teamleider om het echt op te lossen.', en: 'You are the engineer. After the shift you stay with the team lead to fix it for good.', focus: ['shift', 'jij', 'teamlead', 'unit'] },
        { nl: 'Dat vraagt vier dingen. De oorzaak vinden, het proces lezen, de kosten kennen en de lijn betrouwbaarder maken.', en: 'That takes four things. Find the cause, read the process, know the cost and make the line more reliable.', focus: 'route' },
        { nl: 'Dat zijn vier stations, van probleemoplossen tot betrouwbaarheid.', en: 'That makes four stations, from problem solving to reliability.', focus: 'road' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Technisch probleemoplossen', en: 'Engineering problem solving' },
      beats: [
        { nl: 'Het eerste station is Technisch probleemoplossen. Je zoekt de grondoorzaak van de te lichte dozen.', en: 'The first station is Engineering problem solving. You look for the root cause of the too-light cartons.', focus: ['st-improve', 'for', 'line3'] },
        { nl: 'Eerst ga je zelf kijken waar het gebeurt. Dan pas zoek je naar een oorzaak.', en: 'First you go and look where it happens. Only then do you look for a cause.', focus: ['for', 'jij', 'circle'] },
        { nl: 'Je staat in een {t:Ohno-cirkel|Ohno-cirkel} en tekent een {t:Waaromboom|waaromboom}.', en: 'You stand in an {t:Ohno circle|Ohno circle} and draw a {t:Why tree|why tree}.', ...TOOLCUE('Ohno-cirkel', 'Waaromboom', ['circle', 'jij', 'tree']) },
        { nl: 'Zonder dit pak je het symptoom aan, en kan het probleem terugkomen.', en: 'Without this you treat the symptom, and the problem can come back.', focus: 'without' },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Meten en SPC verdiept', en: 'Measurement and SPC in depth' },
      beats: [
        { nl: 'Het tweede station is Meten en SPC verdiept. Je volgt het vulgewicht met data en niet op gevoel.', en: 'The second station is Measurement and SPC in depth. You follow the fill weight with data, not by feel.', focus: ['st-spc', 'for', 'line3'] },
        { nl: 'Na een omstelling weeg je eerst één doos. Daarna weeg je steeds evenveel dozen en tel je de te lichte.', en: 'After a changeover you weigh one carton first. Then you weigh equal batches and count the too-light ones.', focus: ['for', 'scale', 'chart'] },
        { nl: 'Je doet een {t:Eerstestukcontrole|eerstestukcontrole} en zet dat aantal uit op een {t:np-kaart|np-kaart}.', en: 'You do a {t:First-off check|first-off check} and plot that count on an {t:np chart|np chart}.', ...TOOLCUE('Eerstestukcontrole', 'np-kaart', ['scale', 'chart']) },
        { nl: 'Zonder dit kun je reageren op gewone ruis of een echte verandering missen.', en: 'Without this you can react to routine noise or miss a real change.', focus: 'without' },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Kostprijs en investeringen', en: 'Cost engineering' },
      beats: [
        { nl: 'Het derde station is Kostprijs en investeringen. Je wilt weten wat het probleem kost.', en: 'The third station is Cost engineering. You want to know what the problem costs.', focus: ['st-cost', 'for', 'line3'] },
        { nl: 'Een te lichte doos gaat in de bak en kost geld. Ook een verbetering kost geld, dus je rekent het na.', en: 'A too-light carton goes in the bin and costs money. An improvement costs money too, so you work it out.', focus: ['for', 'scrap', 'laptop'] },
        { nl: 'Je telt de {t:Faalkosten|faalkosten} op en rekent de {t:Kasbesparing|kasbesparing} uit.', en: 'You add up the {t:Cost of poor quality|cost of poor quality} and work out the {t:Cash saving|cash saving}.', ...TOOLCUE('Faalkosten', 'Kasbesparing', ['scrap', 'laptop']) },
        { nl: 'Zonder dit weet niemand of de verbetering de moeite waard is.', en: 'Without this nobody knows whether the fix is worth the effort.', focus: 'without' },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Betrouwbaarheid en assetstrategie', en: 'Reliability and asset strategy' },
      beats: [
        { nl: 'Het vierde station is Betrouwbaarheid en assetstrategie. Je maakt de lijn betrouwbaarder, waar het telt.', en: 'The fourth station is Reliability and asset strategy. You make the line more reliable, where it counts.', focus: ['st-reliability', 'for', 'unit'] },
        { nl: 'Niet elk onderdeel telt even zwaar. Je kijkt wat er gebeurt als het uitvalt.', en: 'Not every part counts the same. You look at what happens when it fails.', focus: ['for', 'unit', 'matrix'] },
        { nl: 'Je zet de onderdelen in een {t:Risicomatrix|risicomatrix} en maakt een {t:FMECA|FMECA}.', en: 'You put the parts in a {t:Risk matrix|risk matrix} and make an {t:FMECA|FMECA}.', ...TOOLCUE('Risicomatrix', 'FMECA', ['matrix', 'fmeca']) },
        { nl: 'Zonder dit weet je niet welk onderdeel je eerst aanpakt.', en: 'Without this you do not know which part to tackle first.', focus: 'without' },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart: de vier stations van De fabriek beter maken liggen in één gebied.', en: 'The whole map: the four stations of Making the plant better lie in one zone.', focus: MAPS },
        { nl: 'Eerst Technisch probleemoplossen: van de grondoorzaak vinden tot kaizen en de waardestroom.', en: 'First Engineering problem solving: from finding the root cause to kaizen and the value stream.', focus: MAPS[0] },
        { nl: 'Dan Meten en SPC verdiept: van meetsystemen tot SPC op de werkvloer.', en: 'Then Measurement and SPC in depth: from measurement systems to SPC on the shop floor.', focus: MAPS[1] },
        { nl: 'Dan Kostprijs en investeringen: van kostprijs en uurtarieven tot besparingen.', en: 'Then Cost engineering: from cost price and hour rates to savings.', focus: MAPS[2] },
        { nl: 'Tot slot Betrouwbaarheid en assetstrategie: van falen tot besluiten op basis van data.', en: 'Finally Reliability and asset strategy: from failure to decisions based on data.', focus: MAPS[3] },
        { nl: 'Zo hangen ze samen. Eerst vind je de oorzaak, en metingen laten zien of het proces echt verandert.', en: 'That is how they connect. First you find the cause, and measurements show whether the process really changes.', focus: [MAPS[0], MAPS[1]] },
        { nl: 'Kosten laten zien wat het waard is. Betrouwbaarheid zegt waar je het eerst doet.', en: 'Cost shows what it is worth. Reliability says where to do it first.', focus: [MAPS[2], MAPS[3]] },
        { nl: 'Elk station is een module met vier niveaus per onderwerp. Begin bij wat jouw lijn nu nodig heeft.', en: 'Each station is a module with four levels per topic. Start with what your line needs now.', focus: MAPS },
      ],
    },
  ],
  skip: [],
  strictFocus: true,
};

// ---------------------------------------------------------------- the narration
// What the voice says, per scene and beat: the high-over picture, each thing said once. Short sentences, few
// colons and comma lists, no symbols the voice would read aloud and nothing in parentheses (the kit's narration
// guard, checkNarration, holds every field film to that; the render guard caps a pause inside a sentence at
// 0.4 s). Words checked with espeak-ng phonemes through Piper's own bridge (nl_NL-alex): see the SAY group of
// this film (the last of the Dutch list in films/_kit/timeline.mjs). The captions' colons are not spoken; FMECA is
// said as letters in the one phrase that names it, in both languages; the rest (Ohno-cirkel, waaromboom,
// eerstestukcontrole, np-kaart, faalkosten, kasbesparing, risicomatrix, kaizen, SPC) is read right.
const SAY = [
  [ // s1 the opening
    { nl: 'Op lijn 3 in hal B komen telkens te lichte dozen uit de vuleenheid.',
      en: 'On line 3 in hall B too-light cartons keep coming out of the filling unit.' },
    { nl: 'Jij bent de engineer. Na de dienst blijf je met de teamleider om het echt op te lossen.',
      en: 'You are the engineer. After the shift you stay with the team lead to fix it for good.' },
    { nl: 'Dat vraagt vier dingen. De oorzaak vinden, het proces lezen, de kosten kennen en de lijn betrouwbaarder maken.',
      en: 'That takes four things. Find the cause, read the process, know the cost and make the line more reliable.' },
    { nl: 'Dat zijn vier stations, van probleemoplossen tot betrouwbaarheid.',
      en: 'That makes four stations, from problem solving to reliability.' },
  ],
  [ // s2 improve
    { nl: 'Het eerste station is Technisch probleemoplossen. Je zoekt de grondoorzaak van de te lichte dozen.',
      en: 'The first station is Engineering problem solving. You look for the root cause of the too-light cartons.' },
    { nl: 'Eerst ga je zelf kijken waar het gebeurt. Dan pas zoek je naar een oorzaak.',
      en: 'First you go and look where it happens. Only then do you look for a cause.' },
    { nl: 'Je staat in een {t:Ohno-cirkel|Ohno-cirkel} en tekent een {t:Waaromboom|waaromboom}.',
      en: 'You stand in an {t:Ohno circle|Ohno circle} and draw a {t:Why tree|why tree}.' },
    { nl: 'Zonder dit pak je het symptoom aan, en kan het probleem terugkomen.',
      en: 'Without this you treat the symptom, and the problem can come back.' },
  ],
  [ // s3 spc
    { nl: 'Het tweede station is Meten en SPC verdiept. Je volgt het vulgewicht met data en niet op gevoel.',
      en: 'The second station is Measurement and SPC in depth. You follow the fill weight with data, not by feel.' },
    { nl: 'Na een omstelling weeg je eerst één doos. Daarna weeg je steeds evenveel dozen en tel je de te lichte.',
      en: 'After a changeover you weigh one carton first. Then you weigh equal batches and count the too-light ones.' },
    { nl: 'Je doet een {t:Eerstestukcontrole|eerstestukcontrole} en zet dat aantal uit op een {t:np-kaart|np-kaart}.',
      en: 'You do a {t:First-off check|first-off check} and plot that count on an {t:np chart|np chart}.' },
    { nl: 'Zonder dit kun je reageren op gewone ruis of een echte verandering missen.',
      en: 'Without this you can react to routine noise or miss a real change.' },
  ],
  [ // s4 cost
    { nl: 'Het derde station is Kostprijs en investeringen. Je wilt weten wat het probleem kost.',
      en: 'The third station is Cost engineering. You want to know what the problem costs.' },
    { nl: 'Een te lichte doos gaat in de bak en kost geld. Ook een verbetering kost geld, dus je rekent het na.',
      en: 'A too-light carton goes in the bin and costs money. An improvement costs money too, so you work it out.' },
    { nl: 'Je telt de {t:Faalkosten|faalkosten} op en rekent de {t:Kasbesparing|kasbesparing} uit.',
      en: 'You add up the {t:Cost of poor quality|cost of poor quality} and work out the {t:Cash saving|cash saving}.' },
    { nl: 'Zonder dit weet niemand of de verbetering de moeite waard is.',
      en: 'Without this nobody knows whether the fix is worth the effort.' },
  ],
  [ // s5 reliability
    { nl: 'Het vierde station is Betrouwbaarheid en assetstrategie. Je maakt de lijn betrouwbaarder, waar het telt.',
      en: 'The fourth station is Reliability and asset strategy. You make the line more reliable, where it counts.' },
    { nl: 'Niet elk onderdeel telt even zwaar. Je kijkt wat er gebeurt als het uitvalt.',
      en: 'Not every part counts the same. You look at what happens when it fails.' },
    { nl: 'Je zet de onderdelen in een {t:Risicomatrix|risicomatrix} en maakt een {t:FMECA|FMECA}.',
      en: 'You put the parts in a {t:Risk matrix|risk matrix} and make an {t:FMECA|FMECA}.' },
    { nl: 'Zonder dit weet je niet welk onderdeel je eerst aanpakt.',
      en: 'Without this you do not know which part to tackle first.' },
  ],
  [ // s6 the map
    { nl: 'Dit is de hele kaart. De vier stations van De fabriek beter maken liggen in één gebied.',
      en: 'This is the whole map. The four stations of Making the plant better lie in one zone.' },
    { nl: 'Eerst Technisch probleemoplossen, van de grondoorzaak vinden tot kaizen en de waardestroom.',
      en: 'First Engineering problem solving, from finding the root cause to kaizen and the value stream.' },
    { nl: 'Dan Meten en SPC verdiept, van meetsystemen tot SPC op de werkvloer.',
      en: 'Then Measurement and SPC in depth, from measurement systems to SPC on the shop floor.' },
    { nl: 'Dan Kostprijs en investeringen, van kostprijs en uurtarieven tot besparingen.',
      en: 'Then Cost engineering, from cost price and hour rates to savings.' },
    { nl: 'Tot slot Betrouwbaarheid en assetstrategie, van falen tot besluiten op basis van data.',
      en: 'Finally Reliability and asset strategy, from failure to decisions based on data.' },
    { nl: 'Zo hangen ze samen. Eerst vind je de oorzaak, en metingen laten zien of het proces echt verandert.',
      en: 'That is how they connect. First you find the cause, and measurements show whether the process really changes.' },
    { nl: 'Kosten laten zien wat het waard is. Betrouwbaarheid zegt waar je het eerst doet.',
      en: 'Cost shows what it is worth. Reliability says where to do it first.' },
    { nl: 'Elk station is een module met vier niveaus per onderwerp. Begin bij wat jouw lijn nu nodig heeft.',
      en: 'Each station is a module with four levels per topic. Start with what your line needs now.' },
  ],
];
// Each scene's length from its share of the Dutch narration, never shorter than its captions need (as the pilot).
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
const preamble = `const CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\nconst MAPZ = ${JSON.stringify(MAPZ)};\nconst ZBAND = ${JSON.stringify(ZBAND)};\nconst MAPSZ = [${MAP_W}, ${MAP_H}];\nconst ROW = ${STATION_UNITS};\nconst HEAD = 284;\nconst CW = ${JSON.stringify(CHAR_W)};\nconst wrapUnits = ${wrapUnits.toString()};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = PM_CSS + HALL_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-tile{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:1.2}
.pm-badge{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-out{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:5 4}
.pm-crit{fill:color-mix(in srgb,var(--fp-accent) 24%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-link{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round;stroke-linecap:round}
.pm-road{fill:none;stroke:var(--anatomy-lo);stroke-width:3;stroke-dasharray:6 6;stroke-linecap:round}
.pm-dot{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.6}
.pm-cross{fill:none;stroke:var(--anatomy-muted);stroke-width:2.4;stroke-linecap:round}
.pm-solid{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 55%,var(--anatomy-face));stroke:var(--anatomy-lo);stroke-width:.35}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link,[data-cue][data-on] .pm-road{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-out,.pm-dot,.pm-solid){stroke:var(--fp-accent)}
[data-cue][data-on] .pm-cross{stroke:var(--fp-accent)}
/* the strokes of the why tree and the chart, the chalk circle and the lines of the FMECA sheet read at phone width: a little heavier than the kit's hairline */
:is([data-cue="tree"],[data-cue="chart"]) .iso-line{stroke-width:1.8}
[data-cue="circle"] .iso-line{stroke-width:2.4}
[data-cue="fmeca"] .pm-rule{stroke-width:.9}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as the pilot) */
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="teamlead"]:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="teamlead"]:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');


const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 draait. Aan de achterwand de band van lijn 3 met dozen; boven het begin van de band staat de vuleenheid, ongeveer zo hoog als een mens: een stalen frame met een plaat boven de dozen en bovenop een lichte kunststof kap. Links achter staat een tank met een leiding naar de plaat. In het begin staan jij en de teamleider voor in de hal. Daarna komen er dingen bij: een krijtcirkel op de vloer voor de band, waar jij staat, en een bord op twee poten met een boom van streepjes; aan het eind van de band een tafel met een weegschaal en een doos erop, en op de achterwand een kaart met een middellijn, twee gestippelde grenzen en zeven punten; een kist met foute dozen voor het eind van de band, en voor links een tafel met een laptop en een blad; op de zijwand een raster van drie bij drie en een blad met rijen. Bij het sluiten verschijnt de hele kaart van Engineering met de vier stations van deze zone.',
  en: 'Hall B of the plant, where line 3 runs. Along the back wall the belt of line 3 with cartons; over the start of the belt stands the filling unit, about as tall as a person: a steel frame with a plate above the cartons and a light plastic cover on top. At the back left a tank with a pipe to the plate. In the opening you and the team lead stand at the front of the hall. Then things are added: a chalk circle on the floor in front of the belt, where you stand, and a board on two legs with a tree of strokes; at the end of the belt a table with a scale and a carton on it, and on the back wall a chart with a centre line, two dashed limits and seven points; a crate with bad cartons in front of the end of the belt, and at the front left a table with a laptop and a sheet; on the side wall a grid of three by three and a sheet with rows. At the close the whole Engineering map appears with the four stations of this zone.',
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

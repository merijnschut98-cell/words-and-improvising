// Dev tool, not shipped. Builds the module intro film "Het vulgewicht gelezen / Reading the fill weight" for Measurement and SPC
// in depth (eng.spc), an Engineering module intro film (v17, Task 13) and the second intro of the zone "De fabriek beter maken"
// (eng.field.better): the high-over picture at the top of the module, before its four topics (Merijn, 13 Nov: "that high-over
// picture is the thing I need the most"). Pattern and rules: films/eng.machining.intro (the approved reference), the approved
// intros films/eng.safety.intro, eng.maintenance.intro and eng.quality.intro (labels only when named, the same room coordinates as
// the field film, one clear tool per topic, as short as the content allows, no SAY rule that is not needed) and the notes section
// "Engineering module intros".
//
//   node films/eng.spc.intro/build.mjs            build the page
//   node films/eng.spc.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.spc.intro.html: one offline page with the anatomy kit, the stage script and the
// player inlined. The index names it (eng.spc's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The story: hall B of the field film films/eng.field.better ("Na de dienst op lijn 3": too-light cartons keep coming out of the
// filling unit, you and the team lead stay after the shift; its station Meten en SPC verdiept says that at the check table at the
// end of the belt you weigh one carton first after a changeover (the first-off check), then weigh a fixed number of cartons and
// count the too-light ones on an np chart, the control chart hanging on the back wall). This film follows HOW YOU READ THE FILL
// WEIGHT OF LINE 3 WITH STATISTICS, topic by topic, in the room of the field film (the same coordinates): the belt with its cartons,
// the filling unit over it, the check table with the scale at the end of the belt (at the sentence that has the cartons weighed
// there), the control chart on the back wall (at the sentence that names the control chart), you and the team lead at the front.
// The measurement error, the spread, the report and the routine are schemas in the panel; the field film's room has no gauge
// study, no report and no timeline, so none is drawn there.
//   s1 too-light cartons keep coming from the unit; the module goes beyond the basics (the module's blurb) and reads the fill weight
//      with statistics; you and the team lead stay after the shift to follow it (the field film's opening); the map before any
//      detail: four topics in two groups (the measuring itself and what the process does, with measurement systems and control
//      charts; what the process can do and how you hold it, with capability and SPC on the shop floor)
//   s2 Meetsystemen: every reading is the true value plus a measurement error (Basis, .measerror); a noisy scale makes the spread
//      look larger than it is (.measerror: width errors); the tool is the gauge R&R (Basis, .measerror, a study of repeatability and
//      reproducibility: one person, the same part, again; the difference between people), the tool of the topic's first lesson. The
//      topic has no instrument as a term at Basis or Werkkennis (the gauge itself is the scale), so the most tool-like term is the
//      gauge R&R study (reported); the master part of the lesson is not drawn, only to have a tool
//   s3 Regelkaarten: a control chart plots a result over time, with a centre line and two limits (Basis, .limits); the limits are
//      the voice of the process, what this process does by itself, computed from its own data (.limits); a point outside a limit is
//      a signal (.limits); the tool is the np chart (Werkkennis, .charts: the number defective with a fixed sample size), the field
//      film's own chart: the too-light cartons per fixed batch
//   s4 Procesgeschiktheid: capability compares the process spread with the tolerance (Basis, .capread); it only means something for a
//      stable process, first stable, then measure capability (Werkkennis, .ppk); the tool is the capability report (Basis, .capread:
//      the software output with a histogram, the spec limits and the indices), a document read, no device drawn
//   s5 SPC op de werkvloer: on the floor SPC is a routine (Basis, .floor); sample more often where things change, such as after a
//      changeover (.floor); the tool is the first-off check (Basis, .floor), the field film's own check: one carton first on the
//      scale. The story ends here: you and the team lead follow the fill weight with data, not by feel (the field film's words)
//   s6 the shared Engineering map (the kit's mapScene) with Measurement and SPC in depth lit, then the module's four topics with
//      their levels as columns, where to start, and what each later level adds, in the app's level words
// The tools of no other intro are repeated (eng.quality.intro names the caliper, the Cpk, the X-bar/R chart and the nonconformance
// report: this module goes deeper and uses none of them). A Werkkennis tool named in a scene (the np chart) is not named again in the
// closing grid, which says "de juiste regelkaart"; the closing grid does not name the other tools either (it says the lessons'
// titles in words: meetsysteemanalyse, overbijsturen).
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

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));


// ---------------------------------------------------------------- the module
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const MOD = MODULES.find((m) => m.id === 'eng.spc');
const LEVELS = {
  msa: ['eng.spc.measerror', 'eng.spc.msa', 'eng.spc.attribute', 'eng.spc.uncertainty'],
  charts: ['eng.spc.limits', 'eng.spc.charts', 'eng.spc.smallshift', 'eng.spc.shortrun'],
  capability: ['eng.spc.capread', 'eng.spc.ppk', 'eng.spc.nonnormal', 'eng.spc.capspec'],
  practice: ['eng.spc.floor', 'eng.spc.tampering', 'eng.spc.patterns', 'eng.spc.programme'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.spc has the four topics and levels this film draws');
assert(MOD.intro === 'eng.spc.intro', 'eng.spc names this film as its intro');
const lessons = await allLessons();
const FAILS = [];
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) if (!text.includes(s)) FAILS.push(`${id} (${lang}) no longer says "${s}"`); };
// s1: the module's blurb goes beyond the basics
assert(MOD.blurb.nl.includes('Voorbij de basis'), 'the module blurb (nl) goes beyond the basics');
assert(MOD.blurb.en.includes('Beyond the basics'), 'the module blurb (en) goes beyond the basics');
// s2: every reading is the true value plus a measurement error; a noisy gauge makes the spread look larger; the gauge R&R
has('eng.spc.measerror', ['Elke meting is de echte waarde plus een meetfout', 'het deel van de uitlezing dat van het meetmiddel, de persoon en de methode komt', 'Breedtefouten laten het proces breder lijken dan het is', 'Samen heet dat gauge R&R', 'Gauge R&R Herhaalbaarheid en reproduceerbaarheid samen']);
has('eng.spc.measerror', ['Every reading is the true value plus a measurement error', 'the part of the reading that comes from the gauge, the person and the method', 'Width errors make the process look wider than it is', 'Together they are the gauge R&R', 'Gauge R&R Repeatability and reproducibility together'], 'en');
// s3: a control chart; the limits are the voice of the process; a point outside a limit is a signal; the np chart
has('eng.spc.limits', ['Een regelkaart zet een uitkomst in de tijd uit met een middellijn en twee regelgrenzen', 'De grenzen zijn de stem van het proces (voice of the process): wat dit proces uit zichzelf doet', 'Fout 1: reageren op gewone ruis alsof er iets veranderd is', 'een punt buiten een grens']);
has('eng.spc.limits', ['A control chart plots a result over time with a centre line and two control limits', 'The limits are the voice of the process: what this process does by itself', 'Mistake 1: reacting to routine noise as if something changed', 'a point outside a limit'], 'en');
has('eng.spc.charts', ['Een np-kaart zet het aantal afgekeurde stuks uit bij een vaste steekproefgrootte', 'np-kaart Kaart voor het aantal afgekeurde stuks in een steekproef van vaste grootte']);
has('eng.spc.charts', ['An np chart plots the number defective with a fixed sample size', 'np chart Chart for the number of defective parts in a sample of fixed size'], 'en');
// s4: capability compares the spread with the tolerance; only for a stable process; the capability report
has('eng.spc.capread', ['Procesgeschiktheid vergelijkt de processpreiding met de tolerantie', 'Een capability-rapport uit SPC-software toont een histogram', 'Capability-rapport Uitvoer van software met histogram']);
has('eng.spc.capread', ['Capability compares the process spread with the tolerance', 'A capability report from SPC software shows a histogram', 'Capability report Software output with histogram'], 'en');
has('eng.spc.ppk', ['Procesgeschiktheid zegt alleen iets bij een stabiel proces', 'De volgorde: eerst stabiel maken, dan de geschiktheid meten']);
has('eng.spc.ppk', ['Capability only means something for a stable process', 'The order: make it stable, then measure capability'], 'en');
// s5: SPC on the floor is a routine; sample more often where things change; the first-off check
has('eng.spc.floor', ['Op de vloer is SPC een routine', 'Meet vaker waar dingen veranderen', 'het eerste stuk na een omstelling meten voordat de serie doorloopt', 'Eerstestukcontrole Het eerste stuk na een omstelling meten voordat de serie doorloopt']);
has('eng.spc.floor', ['On the floor SPC is a routine', 'Sample more often where changes happen', 'measuring the first part after a setup before the run continues', 'First-off check Measuring the first part after a setup before the run continues'], 'en');
// s6: the first lesson, and what each later level adds, as the lessons are titled
for (const [id, word] of [['eng.spc.measerror', 'Meetfout'], ['eng.spc.msa', 'Meetsysteemanalyse'], ['eng.spc.charts', 'De juiste regelkaart'], ['eng.spc.ppk', 'Cpk tegen Ppk'], ['eng.spc.tampering', 'Overbijsturen'],
  ['eng.spc.attribute', 'Visuele inspectie'], ['eng.spc.smallshift', 'Kleine verschuivingen'], ['eng.spc.nonnormal', 'Niet-normale data'], ['eng.spc.patterns', 'Patronen lezen'],
  ['eng.spc.uncertainty', 'destructief meten'], ['eng.spc.shortrun', 'Kleine series'], ['eng.spc.capspec', 'Capability-eisen'], ['eng.spc.programme', 'SPC-programma']]) has(id, [word]);
for (const [id, word] of [['eng.spc.measerror', 'Measurement error'], ['eng.spc.msa', 'Gauge studies'], ['eng.spc.charts', 'the right control chart'], ['eng.spc.ppk', 'Cpk versus Ppk'], ['eng.spc.tampering', 'Over-adjustment'],
  ['eng.spc.attribute', 'Visual inspection'], ['eng.spc.smallshift', 'Small shifts'], ['eng.spc.nonnormal', 'Non-normal data'], ['eng.spc.patterns', 'Reading patterns'],
  ['eng.spc.uncertainty', 'destructive tests'], ['eng.spc.shortrun', 'Short runs'], ['eng.spc.capspec', 'Capability requirements'], ['eng.spc.programme', 'SPC programme']]) has(id, [word], 'en');
assert(FAILS.length === 0, FAILS.join('\n  '));

// the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from GRID.x; the words
// stand on one line each, staggered over two rows, so a word may be wider than its column but not wider than the room to
// the next word on its row, nor run off the stage. Four rows of GRID.pitch.
const LV = { nl: levelWords('nl'), en: levelWords('en') };
const GRID = { x: 276, col: 90, box: 82, tile: 252, top: 76, pitch: 74, h: 62 };
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
    assert(wrapUnits(title, GRID.tile - 12, CHAR_W).length <= 2, `the grid tile of "${title}" (${lang}) needs more than two lines`);
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
const person = (role, x, y, along) => w.person({ x, y, role, along });


// where things stand (cm), as in the field film films/eng.field.better (the same coordinates): the filling unit over the start of
// line 3's belt (two uprights and a beam, a plate hung from the beam above the cartons, a plastic cover on top), the check table
// with the scale at the end of the belt (at the sentence that has the cartons weighed there), the control chart on the back wall
// above the end of the belt (at the sentence that names the control chart), you and the team lead at the front. Without the
// field film's tank, chalk circle, why tree, crate, laptop and the two boards of the side wall: other stations own them.
const f1 = (v) => (Math.round(v * 10) / 10).toString();
const at = w.at;
const BELT = { x: 130, y: 16, len: 130, dep: 34 };
const UX = 152; // x of the uprights and the beam
const FRAME = { top: 150, beam: 160 };
const PLATE = { z0: 100, z1: 146 }; // the filling head: its foot clears the cartons (60 to 80)
const CHART = { x0: 196, x1: 262, z0: 112, z1: 168 }; // the control chart on the back wall
const QT = { x: 262, y: 58, w: 26, d: 44, h: 70 }; // the table with the scale at the end of the belt
const frame = [
  w.box({ x: UX, y: 5, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 52, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 5, w: 9, d: 56, r: 1 }, FRAME.top, FRAME.beam, { tone: 'mid' }, { steps: 2 }),
].join('');
const plate = w.box({ x: UX + 9, y: BELT.y, w: 3.2, d: 36, r: 0.6 }, PLATE.z0, PLATE.z1, { tone: 'mid' }, { steps: 2 });
const cover = w.box({ x: UX - 7, y: 12, w: 23, d: 42, r: 7 }, FRAME.beam, FRAME.beam + 24, { tone: 'hi' }, { steps: 4, bevel: 1.2 });
// a few short strokes on a face: [x0, x1, z] on the plane y
const strokes = (y, rows, tone = 'lo', extra = {}) => k.lineSvg(rows.map(([x0, x1, z]) => k.pathOf([at([x0, y, z]), at([x1, y, z])])).join(''), { tone, ...extra });
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

// painted back to front: the chart on the back wall, the belt and the unit, the check table, you and the team lead
const world = [
  w.room(ROOM),
  g('o-chart', cueG('chart', chartBoard)),
  cueG('line3', hall.conveyor({ ...BELT, cartons: 4 })),
  cueG('unit', frame + plate + cover),
  g('o-scale', cueG('scale', scale)),
  g('pp-teamlead', person('teamlead', 128, 132, 'x')),
  g('pp-jij', person('jij', 188, 132, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame (data-k): the
// four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the schemas of each beat. The
// shared map (the kit's mapScene) sits under the panel; its place Meten en SPC verdiept is a cue group of its own (map-spc).
const TILE = { msa: 'tMsa', charts: 'tChr', capability: 'tCap', practice: 'tPrac' };
const PANEL = ['lightS', 'askS', 'shiftS', 'grpA', 'grpB', 'errS', 'wideS', 'rrS', 'chS', 'limS', 'sigS', 'npS', 'spreadS', 'stabS', 'repS', 'floorS', 'whenS', 'fofS', 'endS',
  'tool1', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
const { w: MAP_W, h: MAP_H } = engMap.view; // the Engineering map's sheet (viewBox of the wide drawing), from the map data
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.spc'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.spc');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.spc')}"`), 'the map lights eng.spc as a cue group');
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
// ---------------------------------------------------------------- cameras (one gentle move per scene)
// [ox, oy, s]: the point (ox, oy) of the room, in stage units, is brought to the middle of the room's half of the
// stage while the room scales by s (see camera() in stage.js). Each scene looks at what its topic is about.
const CAM = [
  { from: cam(150, 70, 70, 1.0), to: cam(150, 70, 70, 1.07) }, // s1 the whole hall: the unit on line 3, you and the team lead
  { from: cam(215, 60, 60, 1.15), to: cam(215, 60, 60, 1.28) }, // s2 the end of the belt: the scale
  { from: cam(235, 60, 90, 1.25), to: cam(235, 60, 90, 1.38) }, // s3 the end of the belt: the scale and the chart on the wall
  { from: cam(235, 60, 90, 1.15), to: cam(235, 60, 90, 1.28) }, // s4 the end of the belt: the chart (stable first) and the scale
  { from: cam(190, 80, 60, 1.0), to: cam(190, 80, 60, 1.06) }, // s5 the end of the belt and the front: the scale, you and the team lead
  { from: cam(150, 70, 60, 1), to: cam(150, 70, 60, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a) => ({ cue: { [a]: 'tool1' } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.spc.intro',
  title: { nl: 'Het vulgewicht gelezen', en: 'Reading the fill weight' },
  module: 'eng.spc',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.spc, the scene that explains it and its tile
  topics: {
    msa: { scene: 's2', cue: 'tMsa' },
    charts: { scene: 's3', cue: 'tChr' },
    capability: { scene: 's4', cue: 'tCap' },
    practice: { scene: 's5', cue: 'tPrac' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Het vulgewicht gelezen', en: 'Reading the fill weight' },
      beats: [
        { nl: 'Op lijn 3 komen telkens te lichte dozen uit de vuleenheid.', en: 'On line 3 too-light cartons keep coming out of the filling unit.', focus: ['lightS', 'line3', 'unit'] },
        { nl: 'De module Meten en SPC verdiept gaat voorbij de basis. Je leest het vulgewicht met statistiek.', en: 'The module Measurement and SPC in depth goes beyond the basics. You read the fill weight with statistics.', focus: ['askS', 'line3'] },
        { nl: 'Jij bent de engineer. Na de dienst blijf je met de teamleider om het vulgewicht te volgen.', en: 'You are the engineer. After the shift you stay with the team lead to follow the fill weight.', focus: ['shiftS', 'jij', 'teamlead'] },
        { nl: 'Eerst het meten zelf en wat het proces doet, met meetsystemen en met regelkaarten.', en: 'First the measuring itself and what the process does, with measurement systems and with control charts.', focus: 'grpA' },
        { nl: 'Dan wat het proces aankan en hoe je het vasthoudt, met procesgeschiktheid en SPC op de werkvloer.', en: 'Then what the process can do and how you hold it, with capability and SPC on the shop floor.', focus: 'grpB' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Meetsystemen', en: 'Measurement systems' },
      beats: [
        { nl: 'Het eerste onderwerp is Meetsystemen. Elke meting is de echte waarde plus een meetfout.', en: 'The first topic is Measurement systems. Every reading is the true value plus a measurement error.', focus: ['tMsa', 'errS', 'line3'] },
        { nl: 'Je weegt de dozen aan het eind van de band. Een ruizige weegschaal laat de spreiding groter lijken dan ze is.', en: 'You weigh the cartons at the end of the belt. A noisy scale makes the spread look larger than it is.', focus: ['wideS', 'scale'] },
        { nl: 'Je onderzoekt het wegen met een {t:Gauge R&R|gauge R&R}. Twee mensen wegen dezelfde doos een paar keer.', en: 'You study the weighing with a {t:Gauge R&R|gauge R&R}. Two people weigh the same carton a few times.', ...TOOL('Gauge R&R'), focus: ['tool1', 'rrS', 'scale'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Regelkaarten', en: 'Control charts' },
      beats: [
        { nl: 'Het tweede onderwerp is Regelkaarten. Een regelkaart zet een uitkomst in de tijd uit.', en: 'The second topic is Control charts. A control chart plots a result over time.', focus: ['tChr', 'chS', 'chart'] },
        { nl: 'De middellijn en twee grenzen laten zien wat lijn 3 uit zichzelf doet.', en: 'The centre line and two limits show what line 3 does by itself.', focus: ['limS', 'chart'] },
        { nl: 'Een punt buiten een grens is een signaal dat er iets veranderd is.', en: 'A point outside a limit is a signal that something has changed.', focus: ['sigS', 'chart'] },
        { nl: 'Je weegt steeds evenveel dozen en telt de te lichte. Dat aantal zet je uit op een {t:np-kaart|np-kaart}.', en: 'You weigh equal batches and count the too-light cartons. You plot that count on an {t:np chart|np chart}.', ...TOOL('np-kaart'), focus: ['tool1', 'npS', 'chart', 'scale'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Procesgeschiktheid', en: 'Capability' },
      beats: [
        { nl: 'Het derde onderwerp is Procesgeschiktheid. Die vergelijkt de spreiding van het proces met de tolerantie.', en: 'The third topic is Capability. It compares the spread of the process with the tolerance.', focus: ['tCap', 'spreadS', 'line3'] },
        { nl: 'Eerst maak je het proces stabiel, dan meet je de geschiktheid.', en: 'First you make the process stable, then you measure capability.', focus: ['stabS', 'chart'] },
        { nl: 'Je leest dat in een {t:Capability-rapport|capability-rapport} uit de software.', en: 'You read that in a {t:Capability report|capability report} from the software.', ...TOOL('Capability-rapport'), focus: ['tool1', 'repS'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'SPC op de werkvloer', en: 'SPC on the shop floor' },
      beats: [
        { nl: 'Het vierde onderwerp is SPC op de werkvloer. Daar is SPC een routine.', en: 'The fourth topic is SPC on the shop floor. There SPC is a routine.', focus: ['tPrac', 'floorS', 'line3'] },
        { nl: 'Meet vaker waar dingen veranderen, zoals na een omstelling van lijn 3.', en: 'Measure more often where things change, such as after a changeover of line 3.', focus: ['whenS', 'line3', 'unit'] },
        { nl: 'Je doet een {t:Eerstestukcontrole|eerstestukcontrole} en weegt eerst één doos.', en: 'You do a {t:First-off check|first-off check} and weigh one carton first.', ...TOOL('Eerstestukcontrole'), focus: ['tool1', 'fofS', 'scale'] },
        { nl: 'Zo volg jij met de teamleider het vulgewicht met data en niet op gevoel.', en: 'That is how you and the team lead follow the fill weight with data, not by feel.', focus: ['endS', 'jij', 'teamlead'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. Het tweede station is Meten en SPC verdiept, in De fabriek beter maken.', en: 'The whole map. The second station is Measurement and SPC in depth, in Making the plant better.', focus: 'map-spc' },
        { nl: 'Elk van de vier onderwerpen heeft vier niveaus.', en: 'Each of the four topics has four levels.', focus: 'route' },
        { nl: 'Begin op niveau Basis met meetfout. Elk getal dat je later gebruikt, komt uit een meting.', en: 'Start at Basics level with measurement error. Every number you use later comes from a reading.', focus: ['tMsa', 'start'] },
        { nl: 'Op niveau Werkkennis komen meetsysteemanalyse, de juiste regelkaart, Cpk tegen Ppk en overbijsturen.', en: 'At Working knowledge level come gauge studies, the right control chart, Cpk versus Ppk and over-adjustment.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd komen visuele inspectie, kleine verschuivingen, niet-normale data en patronen lezen.', en: 'At Advanced level come visual inspection, small shifts, non-normal data and reading patterns.', focus: 'lv3' },
        { nl: 'Op niveau Expert komen destructief meten, kleine series, eisen aan procesgeschiktheid en een SPC-programma.', en: 'At Expert level come destructive tests, short runs, capability requirements and an SPC programme.', focus: 'lv4' },
        { nl: 'Elke les en elke film van deze module heeft een plek op deze kaart.', en: 'Every lesson and every film in this module has a place on this map.', focus: null },
      ],
    },
  ],
  skip: [],
  strictFocus: true,
};

// ---------------------------------------------------------------- the narration
// What the voice says is what the captions show (as in the other module intros): short sentences, few commas, no colons
// and no symbols the voice would read aloud. Each topic scene names the tool of that topic's lessons in one short sentence,
// without explaining it. Every drawn detail has its reason in the narration: the belt and the unit (line 3), the scale at the
// end of the belt (the cartons weighed there), the chart on the wall (the control chart), you and the team lead (the ones who
// follow the fill weight after the shift).
spec.scenes.forEach((s) => s.beats.forEach((b) => { b.say = { nl: b.nl, en: b.en }; }));
// the voice says the study as "gauge R en R" and "gauge R and R" (no ampersand read aloud), as the lesson films do
{
  const b = spec.scenes[1].beats[2];
  b.say = { nl: b.nl.replace('{t:Gauge R&R|gauge R&R}', '{t:Gauge R&R|gauge R en R}'), en: b.en.replace('{t:Gauge R&R|gauge R&R}', '{t:Gauge R&R|gauge R and R}') };
}
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
  nl: 'Hal B van de fabriek, waar lijn 3 draait. Aan de achterwand de band van lijn 3 met dozen; boven het begin van de band staat de vuleenheid, ongeveer zo hoog als een mens: een stalen frame met een plaat boven de dozen en bovenop een lichte kunststof kap. Aan het eind van de band een tafel met een weegschaal met een doos erop, en op de achterwand erboven een regelkaart met een middellijn, twee grenzen en een rij punten waarvan de laatste boven de grens ligt. Voor in de hal staan jij, de engineer, en de teamleider. Rechts een paneel, gemarkeerd als voorbeeld of schema: een doos die te licht is, het vulgewicht en statistiek, een dienst van lijn 3, de route in twee groepen, een echte waarde plus een meetfout, een smalle en een brede spreiding, twee rijen metingen van dezelfde doos, punten in de tijd, een regelkaart met een middellijn en twee grenzen, een punt buiten de grens, het aantal te lichte dozen per groepje op een np-kaart, een spreiding binnen de tolerantie, eerst stabiel en dan geschikt, een capability-rapport met een histogram, de routine van meten en uitzetten, extra metingen na een omstelling, een eerste doos weegt en dan de serie, en een vulgewicht met data. Aan het eind de hele kaart van Engineering met Meten en SPC verdiept verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the plant, where line 3 runs. Along the back wall the belt of line 3 with cartons; over the start of the belt stands the filling unit, about as tall as a person: a steel frame with a plate above the cartons and a light plastic cover on top. At the end of the belt a table with a scale with a carton on it, and on the back wall above it a control chart with a centre line, two limits and a row of points, the last of which lies above the limit. At the front of the hall stand you, the engineer, and the team lead. At the right a panel, marked as an example or a diagram: a carton that is too light, the fill weight and statistics, a shift of line 3, the route in two groups, a true value plus a measurement error, a narrow and a wide spread, two rows of readings of the same carton, points in time, a control chart with a centre line and two limits, a point outside the limit, the number of too-light cartons per group on an np chart, a spread within the tolerance, first stable and then capable, a capability report with a histogram, the routine of measuring and plotting, extra readings after a changeover, a first carton weighed and then the run, and a fill weight with data. At the end the whole map of Engineering with Measurement and SPC in depth lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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


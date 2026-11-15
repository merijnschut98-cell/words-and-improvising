// Dev tool, not shipped. Builds the field film "Dingen maken / Making things"
// (eng.field.making), the first Engineering field film (v17, Task 13): the level above
// the module intros. It places the six modules of the zone (FIELDS in
// src/content/courses/index.js: mechanics, machining, process, drawings, joining,
// moulding) on one road and says, per station, what it is for, what the part of the
// story needs from it, which two tools of the module you use there (named, not
// explained: the checkpoint rule of 14 Nov) and what goes wrong without it. The map,
// not a lesson: no calculations, no numbers.
//
//   node films/eng.field.making/build.mjs            build the page
//   node films/eng.field.making/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.field.making.html: one offline page with the
// anatomy kit, the stage script and the player inlined. The index names it (the field's
// `film`), sw.js precaches it.
//
// The story: line 3 in hall B gets a new filling unit and you, the engineer, follow it
// from material to line. The unit stands over the start of the belt: a steel frame (two
// uprights and a beam, welded at the corners), a mounting plate with four holes hung
// from the beam, a plastic cover on top, and a tank behind it that holds the product.
// On a table at the front stands the drawing. Each station is one thing of the unit:
//   s1 the opening: line 3 and the new unit, which fills the cartons on the belt with
//      product from the tank (the reason the cartons are there); its four parts (frame,
//      plate, tank, cover); you follow it from material to line; the road with six stations
//   s2 Materialen en sterkte (eng.mechanics): the frame must carry the unit and keep
//      carrying it; a tensile test and a hardness test (eng.mechanics.strength,
//      .heattreat); without it the frame can break after months (fatigue, .fatigue)
//   s3 Verspanen (eng.machining): the plate is cut from a block of steel until the shape
//      and the holes are right; an end mill and a twist drill (eng.machining.mill,
//      .drill); without it the holes sit in the wrong place (drill wander)
//   s4 Procestechniek: de basis (eng.process): what is in the tank comes from a process
//      plant, in batches or continuously; a process flow diagram and a mass balance
//      (eng.process.diagrams, .mass; not the control loop, which the drawings module
//      teaches at Basis and the map names there); without it nobody knows what flows or
//      where product is lost
//   s5 Tekeningen en regeling (eng.drawings): frame, plate and tank come together on one
//      drawing for the makers; you read its title block and a feature control frame
//      (eng.drawings.views, .gdt); without it maker and customer measure in their own way
//   s6 Lassen en verbinden (eng.joining): the frame is made of parts that are joined;
//      MIG/MAG and a welding fixture (eng.joining.arc, .weldcell); without it the frame
//      warps (distortion)
//   s7 Spuitgieten (eng.moulding): the cover is plastic, injected into a mould; a hot
//      runner and a setting sheet (eng.moulding.tooling, .setup); without it the cover
//      gets flash or sink marks
//   s8 the shared Engineering map (the kit's mapScene, as the app draws it) with the six
//      stations lit: the whole map, the zone, then place by place at 1.5, then back to the
//      zone for one line on how they connect, and where to start
// How the stations connect: the order of the road is the order of the zone (level, then
// map position), the unit shows how the parts meet (the frame carries the plate, the
// tank feeds the unit, the drawing names all of them, the welds hold the frame, the cover
// closes it), and the closing says it once: strength picks the material, the drawing
// fixes the sizes, machining, welding and moulding make the parts, the process plant
// makes what goes in.
// The tools come from the modules' own lessons (checked below), each a thing the lesson
// names and a term of its glossary, at Basis or Working knowledge level (the heat
// treatment, cutting, diagrams, loops and tolerance-frame lessons are the second level of
// their topics). Terms come from the field's lessons (the kit's field mode,
// films/_kit/build-film.mjs); the kit holds the film to its road (every module named in a
// caption of its own scene, in the order of the road, explained in two beats and lit,
// ending on the map with the field's places lit), to the narration guard and to the
// label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): the person of the
// cast, the table, the sheet and the room, and the conveyor of hall B from the pilot
// (films/pm.plan.intro/hall.mjs), imported. A panel at the right draws each station as
// four small schemas (what it is for, how it works, then one for each tool as it is
// named), two chips with the tools and a dashed card with what goes wrong without it.
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
// The road this film draws, asserted against the index (the build fails if the
// field's modules move), and the lessons' words the narration leans on: the lessons
// the tool names come from (the names are terms of those lessons) and the lessons for
// what each station is for and what goes wrong without it.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const FIELD = FIELDS.find((f) => f.id === 'eng.field.making');
const ROAD = ['eng.mechanics', 'eng.machining', 'eng.process', 'eng.drawings', 'eng.joining', 'eng.moulding'];
assert(JSON.stringify(FIELD.modules) === JSON.stringify(ROAD), 'the making field is the road mechanics, machining, process, drawings, joining, moulding');
// the panel heading draws the module's title in at most two lines of the panel's width (the kit does not measure it)
for (const id of ROAD) for (const lang of ['nl', 'en']) {
  const t = MODULES.find((m) => m.id === id).title[lang];
  const lines = wrapUnits(t, 284, CHAR_W);
  assert(lines.length <= 2 && lines.every((ln) => ln.split(' ').every((wd) => wrapUnits(wd, 284, CHAR_W).length === 1)), `the heading "${t}" (${lang}) does not fit two lines of 284 units`);
}
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s2 mechanics: a part must hold; the tensile test and hardness; fatigue breaks parts that were strong enough once
has('eng.mechanics.strength', ['Bij een trekproef trek je een proefstaaf tot hij breekt', 'Ontwerpers houden de spanning onder de vloeigrens', 'Trekproef Een proefstaaf uittrekken tot hij breekt']);
has('eng.mechanics.strength', ['A tensile test pulls a sample bar until it breaks', 'Tensile test Pulling a sample bar until it breaks'], 'en');
has('eng.mechanics.heattreat', ['Hardheid is de weerstand van een materiaal tegen indrukken', 'Hardheid Weerstand tegen indrukken']);
has('eng.mechanics.heattreat', ['Hardness is a material’s resistance to being dented', 'Hardness Resistance to being dented'], 'en');
has('eng.mechanics.fatigue', ['een belasting die miljoenen keren terugkomt, laat een kleine scheur groeien tot het onderdeel knapt']);
has('eng.mechanics.fatigue', ['a load that repeats millions of times grows a small crack until the part snaps'], 'en');
// s3 machining: cutting away until the shape is left; the end mill and the twist drill; a drill wanders
has('eng.machining.processes', ['Verspanen betekent een onderdeel maken door materiaal weg te snijden']);
has('eng.machining.processes', ['Machining means making a part by cutting away material'], 'en');
has('eng.machining.mill', ['Een vingerfrees is een smalle staaf met snijkanten op de zijkant en de punt', 'Vingerfrees Een smalle frees die met zijkant en punt snijdt']);
has('eng.machining.mill', ['An end mill is a narrow bar with cutting edges on its side and tip', 'End mill A narrow cutter that cuts with its side and tip'], 'en');
has('eng.machining.drill', ['Het standaardgereedschap is de spiraalboor', 'waardoor het gat op de verkeerde plek of scheef komt']);
has('eng.machining.drill', ['The standard tool is the twist drill', 'so the hole ends up in the wrong place or crooked'], 'en');
// s4 process: batch or continuous; the flow diagram; the mass balance, and product that goes missing
has('eng.process.types', ['In een batchproces gaat een vaste hoeveelheid een vat in', 'In een continu proces stroomt het product non-stop in en uit']);
has('eng.process.types', ['In a batch process a fixed amount goes into a vessel', 'In a continuous process material flows in and out non-stop'], 'en');
has('eng.process.diagrams', ['Procesfabrieken worden beschreven in drie soorten schema’s', 'Een processchema (process flow diagram, PFD) toont de hoofdapparatuur als symbolen']);
has('eng.process.diagrams', ['Process plants are described in three kinds of diagram', 'A process flow diagram (PFD) shows the main equipment as symbols'], 'en');
has('eng.process.mass', ['Een massabalans is het eerste gereedschap van een procesengineer', 'Massabalans In = uit + ophoping', 'Mist er 2% van de massa, zoek dan een lek']);
has('eng.process.mass', ['A mass balance is the first tool of a process engineer', 'Mass balance In = out + accumulation', 'If 2% of the mass is missing, look for a leak'], 'en');
// s5 drawings: the title block is where you start; the tolerance frame; maker and customer measure from different datums
has('eng.drawings.views', ['De stempel (title block) rechtsonder is waar je begint', 'Stempel Vak rechtsonder']);
has('eng.drawings.views', ['The title block, bottom right, is where you start', 'Title block Box bottom right'], 'en');
has('eng.drawings.gdt', ['in een tolerantiekader: een vakje met een symbool, een tolerantie en de referenties', 'leverancier en klant meten vanaf verschillende referenties']);
has('eng.drawings.gdt', ['in a feature control frame: a small box with a symbol, a tolerance and the datums it refers to', 'supplier and customer measure from different datums'], 'en');
// s6 joining: arc welding melts the edges together; MIG/MAG; the welding fixture; distortion
has('eng.joining.arc', ['Booglassen verbindt twee metalen delen door de randen samen te smelten', 'MIG/MAG: een draad van 0,8 tot 1,2 mm dik']);
has('eng.joining.arc', ['Arc welding joins two metal parts by melting their edges together', 'MIG/MAG: a reel of wire, 0.8 to 1.2 mm thick'], 'en');
has('eng.joining.weldcell', ['Het werkstuk zit in een lasmal: een opspanmal met aanslagen en klemmen die alle delen op de juiste plek houdt']);
has('eng.joining.weldcell', ['The workpiece sits in a welding fixture: a jig with stops and clamps that holds every part in the right place'], 'en');
has('eng.joining.defects', ['Vervorming: warmte zet het metaal uit en afkoelen laat het krimpen, dus delen trekken krom', 'lasmallen (vasthoudframes) en klemmen']);
has('eng.joining.defects', ['Distortion: heat expands the metal and cooling shrinks it, so parts bend', 'jigs (holding frames) and clamps'], 'en');
// s7 moulding: plastic injected into a steel mould; the hot runner; the setting sheet; flash and sink marks
has('eng.moulding.machine', ['gesmolten kunststof in een stalen matrijs (de mal) te spuiten en te laten stollen']);
has('eng.moulding.machine', ['makes plastic parts by squirting molten plastic into a steel mould and letting it set'], 'en');
has('eng.moulding.tooling', ['Een heetkanaal houdt de kunststof vloeibaar in de matrijs', 'Heetkanaal Verwarmd verdeelblok']);
has('eng.moulding.tooling', ['A hot runner keeps the plastic molten inside the mould', 'Hot runner Heated manifold'], 'en');
has('eng.moulding.setup', ['de instelkaart: de goedgekeurde lijst instellingen voor één matrijs op één pers', 'Instelkaart De goedgekeurde lijst instellingen']);
has('eng.moulding.setup', ['the setting sheet: the approved list of settings for one mould on one press', 'Setting sheet The approved list of settings'], 'en');
has('eng.moulding.defects', ['Braam is het omgekeerde: kunststof komt waar hij niet hoort', 'Een inzakplek, ook wel invalplek, is een deukje boven een dik deel']);
has('eng.moulding.defects', ['Flash is the opposite: plastic gets where it should not', 'A sink mark is a dent above a thick section'], 'en');

// ---------------------------------------------------------------- the world (hall B, the filling unit over the start of line 3)
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

// where things stand (cm). Line 3's belt runs along x at the back wall; the filling unit straddles its start: two
// uprights (one behind, one in front of the belt) and a beam across at the top, welded at the corners, tall enough
// for a person to stand next to it and for the cartons to pass under it. The plate (the filling head) hangs from the
// beam on its +x face above the cartons, with four holes; the cover sits on the beam. The tank stands at the back
// wall at the left and its pipe runs over the belt into the plate, so the unit fills the cartons with the tank's
// product. The table with the drawing stands at the front left; you stand at the front right, clear of the tank.
const BELT = { x: 130, y: 16, len: 140, dep: 34 };
const UX = 152; // x of the uprights and the beam
const FRAME = { top: 150, beam: 160 };
const PLATE = { z0: 100, z1: 146 }; // the filling head: its foot clears the cartons (60 to 80)
const HOLES = [[24, 112], [44, 112], [24, 134], [44, 134]].map(([y, z]) => [UX + 12.6, y, z]); // on the plate's +x face
const TANK = { x: 62, y: 34, r: 20, h: 130 };
const PIPE = { y: 28, z: 118 }; // from the tank's side over the belt into the back of the plate
const TABLE = { x: 18, y: 108, w: 76, d: 42, h: 74 };
const SHEET = { x: 34, y: 112, z: TABLE.h };
const frame = [
  w.box({ x: UX, y: 5, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 52, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 5, w: 9, d: 56, r: 1 }, FRAME.top, FRAME.beam, { tone: 'mid' }, { steps: 2 }),
].join('');
const welds = [
  w.box({ x: UX - 2, y: 3, w: 13, d: 13, r: 2.5 }, FRAME.top - 5, FRAME.beam + 2, { tone: 'hi' }, { steps: 2 }),
  w.box({ x: UX - 2, y: 50, w: 13, d: 13, r: 2.5 }, FRAME.top - 5, FRAME.beam + 2, { tone: 'hi' }, { steps: 2 }),
].join('');
const plate = w.box({ x: UX + 9, y: BELT.y, w: 3.2, d: 36, r: 0.6 }, PLATE.z0, PLATE.z1, { tone: 'mid' }, { steps: 2 })
  + k.dotsSvg(HOLES.map(([x, y, z]) => k.iso([x, y, z], P)), { size: 2.1, tone: 'lo' });
const cover = w.box({ x: UX - 7, y: 12, w: 23, d: 42, r: 7 }, FRAME.beam, FRAME.beam + 24, { tone: 'hi' }, { steps: 4, bevel: 1.2 });
const tank = w.post(TANK.x, TANK.y, TANK.r, 0, TANK.h, { tone: 'mid' }, 28)
  + w.post(TANK.x, TANK.y, TANK.r - 4, TANK.h, TANK.h + 5, { tone: 'lo' }, 24)
  + w.box({ x: TANK.x + TANK.r - 2, y: PIPE.y, w: UX + 9 - TANK.x - TANK.r + 2, d: 6, r: 2 }, PIPE.z, PIPE.z + 8, { tone: 'lo' }, { steps: 2 });
// the drawing on the table: a sheet with the plate drawn on it (outline and four holes) and two rule lines
const sheet = w.sheet({ x: SHEET.x, y: SHEET.y, z: SHEET.z, lines: 0 });
const f1 = (v) => (Math.round(v * 10) / 10).toString();
const drawn = `<g transform="${sheet.face}"><path class="pm-rule" d="M3 4H18V15H3Z"/>`
  + [[6, 7], [15, 7], [6, 12], [15, 12]].map(([x, y]) => `<circle class="pm-rule" cx="${x}" cy="${y}" r="1.1"/>`).join('')
  + '<path class="pm-rule" d="M3 19H18M3 21.6H14M3 24.2H17"/></g>';
const person = (role, x, y, along) => w.person({ x, y, role, along });

const world = [
  w.room(ROOM),
  cueG('line3', hall.conveyor({ ...BELT, cartons: 4 })),
  cueG('tank', tank),
  cueG('frame', frame),
  cueG('plate', plate),
  cueG('cover', cover),
  cueG('welds', welds),
  cueG('table', w.table(TABLE)),
  cueG('sheet', sheet.svg + drawn),
  g('pp-jij', person('jij', 262, 128, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group (data-cue), filled by the stage script each frame
// (data-k). The road holds the six stations, one cue group each (st-<slug>): in s1 a row with its number and
// title, in s2 to s7 a numbered square of the strip under the heading. The shared Engineering map (mapScene,
// the six stations lit) replaces the room and the panel in the last scene; its places are cue groups of their
// own (map-<slug>).
const STATION_CUE = Object.fromEntries(ROAD.map((id) => [id, `st-${id.split('.')[1]}`]));
const stations = ROAD.map((id, i) => cueG(STATION_CUE[id], g(`rd${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('road', g('roadB', '') + stations)
  + cueG('flow', g('flowB', '')) + cueG('goal', g('goalB', '')) + cueG('route', g('routeB', '')) + cueG('for', g('forB', ''))
  + cueG('t1', g('t1B', '')) + cueG('t2', g('t2B', ''))
  + cueG('without', g('withoutB', '')));
const MAP_W = 640;
const MAP_H = 1128; // the Engineering map's sheet (viewBox of the wide drawing)
const MAP = (await mapScene({ subject: 'eng', highlight: ROAD })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
for (const id of ROAD) assert(MAP.includes(`data-cue="${mapCue(id)}"`), `the map lights ${id} as a cue group`);
assert(MAP.includes(`viewBox="0 0 ${MAP_W} ${MAP_H}"`), 'the Engineering map is 640 by 1128');
// the centre of each station's place on the map, for the zoom of the closing scene, and the zone's band
const MAPZ = ROAD.map((id) => { const p = engMap.places.find((x) => x.module === id); return [p.x + p.w / 2, p.y + p.h / 2]; });
const ZONE = engMap.zones.find((z) => z.field === FIELD.id);
const ZBAND = [pathBox(ZONE.path)[1], pathBox(ZONE.path)[3]]; // top and bottom of the zone's band
assert(ZBAND[1] > ZBAND[0] && MAPZ.every(([, y]) => y > ZBAND[0] && y < ZBAND[1]), 'the six places lie inside the making zone');
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
  { from: cam(150, 80, 70, 1.05), to: cam(155, 80, 70, 1.15) }, // s1 the hall, the unit over the belt, the tank and the table
  { from: cam(158, 34, 85, 1.35), to: cam(158, 34, 85, 1.5) }, // s2 the frame
  { from: cam(162, 34, 122, 1.7), to: cam(162, 34, 122, 1.9) }, // s3 the plate with its holes
  { from: cam(110, 34, 85, 1.4), to: cam(105, 34, 85, 1.55) }, // s4 the tank and its pipe into the unit
  { from: cam(56, 128, 70, 1.7), to: cam(56, 128, 70, 1.9) }, // s5 the table with the drawing
  { from: cam(158, 34, 150, 1.7), to: cam(158, 34, 150, 1.9) }, // s6 the welds at the corners of the frame
  { from: cam(158, 34, 165, 1.7), to: cam(158, 34, 165, 1.9) }, // s7 the cover
  { from: cam(150, 85, 60, 1), to: cam(150, 85, 60, 1) }, // s8 (the map)
];

// ---------------------------------------------------------------- the film
const MAPS = ROAD.map(mapCue);
const TOOLCUE = (a, b) => ({ cue: { [a]: 't1', [b]: 't2' }, focus: ['t1', 't2'] });
const DURS = Array(8).fill(30);
const spec = {
  id: 'eng.field.making',
  title: { nl: 'Dingen maken', en: 'Making things' },
  field: 'eng.field.making',
  // the road: per module of the field, the scene that explains it and its station on the road
  stations: Object.fromEntries(ROAD.map((id, i) => [id, { scene: `s${i + 2}`, cue: STATION_CUE[id] }])),
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'De vuleenheid', en: 'The filling unit' },
      beats: [
        { nl: 'Lijn 3 in hal B krijgt een nieuwe vuleenheid. Die vult de dozen op de band met product uit de tank.', en: 'Line 3 in hall B gets a new filling unit. It fills the cartons on the belt with product from the tank.', focus: ['flow', 'line3', 'tank'] },
        { nl: 'De eenheid heeft een frame, een plaat, een tank en een kap.', en: 'The unit has a frame, a plate, a tank and a cover.', focus: ['goal', 'frame', 'plate', 'tank', 'cover'] },
        { nl: 'Jij bent de engineer en volgt de eenheid van materiaal tot lijn.', en: 'You are the engineer and follow the unit from material to line.', focus: ['route', 'jij', 'line3'] },
        { nl: 'Zes stations: sterkte, verspanen, procestechniek, tekeningen, lassen en spuitgieten.', en: 'Six stations: strength, machining, process engineering, drawings, welding and moulding.', focus: 'road' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Materialen en sterkte', en: 'Materials and strength' },
      beats: [
        { nl: 'Het eerste station is Materialen en sterkte. Het frame moet de hele eenheid dragen.', en: 'The first station is Materials and strength. The frame has to carry the whole unit.', focus: ['st-mechanics', 'for', 'frame'] },
        { nl: 'Je kiest een staal dat meer aankan dan de belasting.', en: 'You choose a steel that can take more than the load.', focus: ['for', 'frame'] },
        { nl: 'Je test het staal met een {t:Trekproef|trekproef} en een {t:Hardheid|hardheidsmeting}.', en: 'You check the steel with a {t:Tensile test|tensile test} and a {t:Hardness|hardness test}.', ...TOOLCUE('Trekproef', 'Hardheid') },
        { nl: 'Zonder dit kan het frame na maanden breken.', en: 'Without this the frame can break after months.', focus: 'without' },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Verspanen', en: 'Machining' },
      beats: [
        { nl: 'Het tweede station is Verspanen. De plaat wordt uit een blok staal gesneden.', en: 'The second station is Machining. The plate is cut from a block of steel.', focus: ['st-machining', 'for', 'plate'] },
        { nl: 'Een machine snijdt metaal weg, tot de vorm en de gaten kloppen.', en: 'A machine cuts metal away until the shape and the holes are right.', focus: ['for', 'plate'] },
        { nl: 'Je gebruikt een {t:Vingerfrees|vingerfrees} en een {t:Spiraalboor|spiraalboor}.', en: 'You use an {t:End mill|end mill} and a {t:Twist drill|twist drill}.', ...TOOLCUE('Vingerfrees', 'Spiraalboor') },
        { nl: 'Zonder dit zitten de gaten niet waar ze moeten zitten.', en: 'Without this the holes are not where they should be.', focus: 'without' },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Procestechniek: de basis', en: 'Process engineering basics' },
      beats: [
        { nl: 'Het derde station is Procestechniek: de basis. Wat in de tank zit, komt uit een procesfabriek.', en: 'The third station is Process engineering basics. What is in the tank comes from a process plant.', focus: ['st-process', 'for', 'tank'] },
        { nl: 'Daar gaat het product van apparaat naar apparaat, in batches of continu.', en: 'There the product goes from unit to unit, in batches or continuously.', focus: ['for', 'tank'] },
        { nl: 'Je gebruikt een {t:Processchema|processchema} en een {t:Massabalans|massabalans}.', en: 'You use a {t:Process flow diagram|process flow diagram} and a {t:Mass balance|mass balance}.', ...TOOLCUE('Processchema', 'Massabalans') },
        { nl: 'Zonder dit weet niemand wat er stroomt, of waar product verdwijnt.', en: 'Without this nobody knows what flows, or where product is lost.', focus: 'without' },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Tekeningen en regeling', en: 'Drawings and control' },
      beats: [
        { nl: 'Het vierde station is Tekeningen en regeling. Frame, plaat en tank komen samen op één tekening.', en: 'The fourth station is Drawings and control. Frame, plate and tank come together on one drawing.', focus: ['st-drawings', 'for', 'sheet', 'table'] },
        { nl: 'Wie hem leest, ziet de vorm, de maten en hoe nauw het moet.', en: 'Whoever reads it sees the shape, the sizes and how exact it must be.', focus: ['for', 'sheet'] },
        { nl: 'Je leest de {t:Stempel|stempel} en het {t:Tolerantiekader|tolerantiekader}.', en: 'You read the {t:Title block|title block} and the {t:Feature control frame|feature control frame}.', ...TOOLCUE('Stempel', 'Tolerantiekader') },
        { nl: 'Zonder dit meten maker en klant elk op hun eigen manier.', en: 'Without this maker and customer each measure in their own way.', focus: 'without' },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Lassen en verbinden', en: 'Welding and joining' },
      beats: [
        { nl: 'Het vijfde station is Lassen en verbinden. Het frame bestaat uit delen die aan elkaar moeten.', en: 'The fifth station is Welding and joining. The frame is made of parts that must be joined.', focus: ['st-joining', 'for', 'frame', 'welds'] },
        { nl: 'De naad smelt en stolt weer, en de delen zijn één stuk.', en: 'The seam melts and sets again, and the parts are one piece.', focus: ['for', 'welds'] },
        { nl: 'Je last met {t:MIG/MAG|MIG/MAG} en gebruikt een {t:Lasmal|lasmal}.', en: 'You weld with {t:MIG/MAG|MIG/MAG} and use a {t:Welding fixture|welding fixture}.', ...TOOLCUE('MIG/MAG', 'Lasmal') },
        { nl: 'Zonder dit trekt het frame krom.', en: 'Without this the frame warps.', focus: 'without' },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'Spuitgieten', en: 'Injection moulding' },
      beats: [
        { nl: 'Het zesde station is Spuitgieten. De kap van de eenheid is van kunststof.', en: 'The sixth station is Injection moulding. The cover of the unit is made of plastic.', focus: ['st-moulding', 'for', 'cover'] },
        { nl: 'Gesmolten kunststof gaat in een matrijs en koelt af tot een kap.', en: 'Molten plastic goes into a mould and cools into a cover.', focus: ['for', 'cover'] },
        { nl: 'Je gebruikt een {t:Heetkanaal|heetkanaal} en een {t:Instelkaart|instelkaart}.', en: 'You use a {t:Hot runner|hot runner} and a {t:Setting sheet|setting sheet}.', ...TOOLCUE('Heetkanaal', 'Instelkaart') },
        { nl: 'Zonder dit krijgt de kap bramen of inzakplekken.', en: 'Without this the cover gets flash or sink marks.', focus: 'without' },
      ],
    },
    {
      id: 's8', level: 1, dur: DURS[7], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart: de zes stations van Dingen maken liggen in één gebied.', en: 'The whole map: the six stations of Making things lie in one zone.', focus: MAPS },
        { nl: 'Eerst Materialen en sterkte: krachten, materiaalsterkte, vermoeiing en warmtebehandeling.', en: 'First Materials and strength: forces, material strength, fatigue and heat treatment.', focus: MAPS[0] },
        { nl: 'Dan Verspanen: draaien, frezen, boren, CNC, gereedschap en opspanning.', en: 'Then Machining: turning, milling, drilling, CNC, tooling and workholding.', focus: MAPS[1] },
        { nl: 'Dan Procestechniek: de basis. Daar gaat het om procestypen, regelen, balansen en batchcapaciteit.', en: 'Then Process engineering basics. It covers process types, control, balances and batch capacity.', focus: MAPS[2] },
        { nl: 'Dan Tekeningen en regeling: tekeningen lezen, toleranties, schema’s en regelkringen.', en: 'Then Drawings and control: reading drawings, tolerances, diagrams and control loops.', focus: MAPS[3] },
        { nl: 'Dan Lassen en verbinden: booglassen, puntlassen, lasfouten, bouten, lijmen en productie.', en: 'Then Welding and joining: arc and spot welding, defects, bolts, adhesives and production.', focus: MAPS[4] },
        { nl: 'Tot slot Spuitgieten: de machine, de cyclus, kunststoffen, fouten, instellen en matrijzen.', en: 'Finally Injection moulding: the machine, the cycle, plastics, defects, setting and moulds.', focus: MAPS[5] },
        { nl: 'Zo hangen ze samen: bij sterkte kies je het materiaal, de tekening legt de maten vast.', en: 'How they connect: at strength you pick the material, the drawing fixes the sizes.', focus: [MAPS[0], MAPS[3]] },
        { nl: 'Verspanen, lassen en spuitgieten maken de delen. De procesfabriek maakt wat erin gaat.', en: 'Machining, welding and moulding make the parts. The process plant makes what goes in.', focus: [MAPS[1], MAPS[4], MAPS[5], MAPS[2]] },
        { nl: 'Elk station is een module met vier niveaus per onderwerp. Begin bij het onderdeel dat jij moet maken.', en: 'Each station is a module with four levels per topic. Start with the part you have to make.', focus: MAPS },
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
// this film (the last of the Dutch list in films/_kit/timeline.mjs), if it needed one.
const SAY = [
  [ // s1 the opening
    { nl: 'Lijn 3 in hal B krijgt een nieuwe vuleenheid. Die vult de dozen op de band met product uit de tank.',
      en: 'Line 3 in hall B gets a new filling unit. It fills the cartons on the belt with product from the tank.' },
    { nl: 'De eenheid heeft een frame, een plaat, een tank en een kap.',
      en: 'The unit has a frame, a plate, a tank and a cover.' },
    { nl: 'Jij bent de engineer. Je volgt de eenheid van materiaal tot lijn.',
      en: 'You are the engineer. You follow the unit from material to line.' },
    { nl: 'Dat zijn zes stations. Van sterkte en verspanen tot lassen en spuitgieten.',
      en: 'That makes six stations. From strength and machining to welding and moulding.' },
  ],
  [ // s2 mechanics
    { nl: 'Het eerste station is Materialen en sterkte. Het frame moet de hele eenheid dragen.',
      en: 'The first station is Materials and strength. The frame has to carry the whole unit.' },
    { nl: 'Je kiest een staal dat meer aankan dan de belasting.',
      en: 'You choose a steel that can take more than the load.' },
    { nl: 'Je test het staal met een {t:Trekproef|trekproef} en een {t:Hardheid|hardheidsmeting}.',
      en: 'You check the steel with a {t:Tensile test|tensile test} and a {t:Hardness|hardness test}.' },
    { nl: 'Zonder dit kan het frame na maanden breken.',
      en: 'Without this the frame can break after months.' },
  ],
  [ // s3 machining
    { nl: 'Het tweede station is Verspanen. De plaat wordt uit een blok staal gesneden.',
      en: 'The second station is Machining. The plate is cut from a block of steel.' },
    { nl: 'Een machine snijdt metaal weg, tot de vorm en de gaten kloppen.',
      en: 'A machine cuts metal away until the shape and the holes are right.' },
    { nl: 'Je gebruikt een {t:Vingerfrees|vingerfrees} en een {t:Spiraalboor|spiraalboor}.',
      en: 'You use an {t:End mill|end mill} and a {t:Twist drill|twist drill}.' },
    { nl: 'Zonder dit zitten de gaten niet waar ze moeten zitten.',
      en: 'Without this the holes are not where they should be.' },
  ],
  [ // s4 process
    { nl: 'Het derde station is Procestechniek, de basis. Wat in de tank zit, komt uit een procesfabriek.',
      en: 'The third station is Process engineering basics. What is in the tank comes from a process plant.' },
    { nl: 'Daar gaat het product van apparaat naar apparaat, in batches of continu.',
      en: 'There the product goes from unit to unit, in batches or continuously.' },
    { nl: 'Je gebruikt een {t:Processchema|processchema} en een {t:Massabalans|massabalans}.',
      en: 'You use a {t:Process flow diagram|process flow diagram} and a {t:Mass balance|mass balance}.' },
    { nl: 'Zonder dit weet niemand wat er stroomt, of waar product verdwijnt.',
      en: 'Without this nobody knows what flows, or where product is lost.' },
  ],
  [ // s5 drawings
    { nl: 'Het vierde station is Tekeningen en regeling. Frame, plaat en tank komen samen op één tekening.',
      en: 'The fourth station is Drawings and control. Frame, plate and tank come together on one drawing.' },
    { nl: 'Wie hem leest, ziet de vorm, de maten en hoe nauw het moet.',
      en: 'Whoever reads it sees the shape, the sizes and how exact it must be.' },
    { nl: 'Je leest de {t:Stempel|stempel} en het {t:Tolerantiekader|tolerantiekader}.',
      en: 'You read the {t:Title block|title block} and the {t:Feature control frame|feature control frame}.' },
    { nl: 'Zonder dit meten maker en klant elk op hun eigen manier.',
      en: 'Without this maker and customer each measure in their own way.' },
  ],
  [ // s6 joining
    { nl: 'Het vijfde station is Lassen en verbinden. Het frame bestaat uit delen die aan elkaar moeten.',
      en: 'The fifth station is Welding and joining. The frame is made of parts that must be joined.' },
    { nl: 'De naad smelt en stolt weer. Dan zijn de delen één stuk.',
      en: 'The seam melts and sets again. Then the parts are one piece.' },
    { nl: 'Je last met MIG of MAG, en gebruikt een {t:Lasmal|lasmal}.',
      en: 'You weld with MIG or MAG, and use a {t:Welding fixture|welding fixture}.' },
    { nl: 'Zonder dit trekt het frame krom.',
      en: 'Without this the frame warps.' },
  ],
  [ // s7 moulding
    { nl: 'Het zesde station is Spuitgieten. De kap van de eenheid is van kunststof.',
      en: 'The sixth station is Injection moulding. The cover of the unit is made of plastic.' },
    { nl: 'Gesmolten kunststof gaat in een matrijs en koelt af tot een kap.',
      en: 'Molten plastic goes into a mould and cools into a cover.' },
    { nl: 'Je gebruikt een {t:Heetkanaal|heetkanaal} en een {t:Instelkaart|instelkaart}.',
      en: 'You use a {t:Hot runner|hot runner} and a {t:Setting sheet|setting sheet}.' },
    { nl: 'Zonder dit krijgt de kap bramen of inzakplekken.',
      en: 'Without this the cover gets flash or sink marks.' },
  ],
  [ // s8 the map
    { nl: 'Dit is de hele kaart. De zes stations van Dingen maken liggen in één gebied.',
      en: 'This is the whole map. The six stations of Making things lie in one zone.' },
    { nl: 'Eerst Materialen en sterkte. Daar gaat het om krachten, materiaalsterkte, vermoeiing en warmtebehandeling.',
      en: 'First Materials and strength. It covers forces, material strength, fatigue and heat treatment.' },
    { nl: 'Dan Verspanen. Daar gaat het om draaien, frezen en boren. Ook om CNC, gereedschap en opspanning.',
      en: 'Then Machining. It covers turning, milling and drilling. Also CNC, tooling and workholding.' },
    { nl: 'Dan Procestechniek, de basis. Daar gaat het om procestypen, regelen, balansen en batchcapaciteit.',
      en: 'Then Process engineering basics. It covers process types, control, balances and batch capacity.' },
    { nl: 'Dan Tekeningen en regeling. Daar gaat het om tekeningen lezen, toleranties, schema’s en regelkringen.',
      en: 'Then Drawings and control. It covers reading drawings, tolerances, diagrams and control loops.' },
    { nl: 'Dan Lassen en verbinden. Daar gaat het om booglassen, puntlassen en lasfouten. Ook om bouten, lijmen en lassen in productie.',
      en: 'Then Welding and joining. It covers arc welding, spot welding and weld defects. Also bolts, adhesives and welding in production.' },
    { nl: 'Tot slot Spuitgieten. Daar gaat het om de machine, de cyclus en kunststoffen. Ook om fouten, instellen en matrijzen.',
      en: 'Finally Injection moulding. It covers the machine, the cycle and plastics. Also defects, setting and moulds.' },
    { nl: 'Zo hangen ze samen. Bij sterkte kies je het materiaal, en de tekening legt de maten vast.',
      en: 'That is how they connect. At strength you pick the material, and the drawing fixes the sizes.' },
    { nl: 'Verspanen, lassen en spuitgieten maken de delen. De procesfabriek maakt wat erin gaat.',
      en: 'Machining, welding and moulding make the parts. The process plant makes what goes in.' },
    { nl: 'Elk station is een module met vier niveaus per onderwerp. Begin bij het onderdeel dat jij moet maken.',
      en: 'Each station is a module with four levels per topic. Start with the part you have to make.' },
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
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link,[data-cue][data-on] .pm-road{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-out,.pm-dot,.pm-solid){stroke:var(--fp-accent)}
[data-cue][data-on] .pm-cross{stroke:var(--fp-accent)}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as the pilot) */
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');

const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 draait. Aan de achterwand de band van lijn 3 met dozen; boven het begin van de band staat een nieuwe vuleenheid, ongeveer zo hoog als een mens: een stalen frame van twee stijlen en een balk, met aan de balk een plaat met vier gaten boven de dozen en bovenop een lichte kunststof kap. Links achter staat een tank met een leiding over de band naar de plaat: de eenheid vult de dozen met product uit de tank. Voor links een tafel met een tekening: de plaat met zijn gaten. Jij, de engineer, staat rechts naast de eenheid. Rechts een paneel, gemarkeerd als voorbeeld of schema. Eerst de vuleenheid die de dozen vult, dan zijn vier delen, dan de route van materiaal tot lijn en de weg met zes stations. Dan per station een schema, twee namen van hulpmiddelen en, gestippeld, wat er misgaat zonder: bij Materialen en sterkte een balk onder last en een trekproef en een hardheidsmeting; bij Verspanen een blok dat een plaat met gaten wordt, met een vingerfrees en een spiraalboor; bij Procestechniek een tank in een stroom, in batches of continu, met een processchema en een massabalans; bij Tekeningen en regeling een tekening met vorm, maten en tolerantie, met een stempel en een tolerantiekader; bij Lassen en verbinden twee delen en een naad, met een lastoorts en een lasmal; bij Spuitgieten korrels, een matrijs en een kap, met een heetkanaal en een instelkaart. Aan het eind de kaart van Engineering: eerst het hele net van vier gebieden, dan het gebied Dingen maken met de zes stations verlicht, dan plek voor plek van dichtbij, en weer het gebied.',
  en: 'Hall B of the plant, where line 3 runs. Along the back wall the belt of line 3 with cartons; over the start of the belt stands a new filling unit, about as tall as a person: a steel frame of two uprights and a beam, with a plate with four holes hanging from the beam above the cartons and a light plastic cover on top. At the back left a tank with a pipe over the belt to the plate: the unit fills the cartons with product from the tank. At the front left a table with a drawing: the plate with its holes. You, the engineer, stand to the right of the unit. At the right a panel, marked as an example or a diagram. First the filling unit that fills the cartons, then its four parts, then the route from material to line and the road with six stations. Then per station a schema, two names of tools and, dashed, what goes wrong without it: at Materials and strength a beam under load and a tensile test and a hardness test; at Machining a block that becomes a plate with holes, with an end mill and a twist drill; at Process engineering basics a tank in a stream, in batches or continuous, with a process flow diagram and a mass balance; at Drawings and control a drawing with shape, sizes and tolerance, with a title block and a feature control frame; at Welding and joining two parts and a seam, with a welding torch and a welding fixture; at Injection moulding granules, a mould and a cover, with a hot runner and a setting sheet. At the end the map of Engineering: first the whole map of four zones, then the zone Making things with the six stations lit, then place by place up close, and the zone again.',
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

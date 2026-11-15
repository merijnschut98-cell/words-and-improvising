// Dev tool, not shipped. Builds the module intro film "De leiding naar lijn 3 / The pipe to line 3" for
// Pompen, stroming en warmte (eng.fluids), an Engineering module intro film (v17, Task 13) and the fifth intro of the energy
// zone: the high-over picture at the top of the module, before its four topics (Merijn, 13 Nov: "that high-over picture is the
// thing I need the most"). Pattern and rules: films/eng.machining.intro (the approved reference), eng.gridbasics.intro (the first
// energy intro), eng.switchgear.intro (the latest), and the notes section "Engineering module intros".
//
//   node films/eng.fluids.intro/build.mjs            build the page
//   node films/eng.fluids.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.fluids.intro.html: one offline page with the anatomy kit, the stage script and the player
// inlined. The index names it (eng.fluids' `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The story: hall B of the field film films/eng.field.energy ("Energie en het net": line 3 moves and needs more power; its fifth
// station, Pompen, stroming en warmte, says a pump feeds the product from the tank to the filling unit, that pump and pipe fix
// the flow, that a heat exchanger passes on heat without mixing, that the installer, no, you read a pump curve and pick a plate
// heat exchanger, and that without this the pump runs at the wrong point and energy is lost). This film follows that pipe: from
// the tank on the back wall by the pump and a plate heat exchanger to the filling unit over the start of line 3's belt, with
// the steam that heats the exchanger coming through the back wall. Every topic of the module has its place on that one pipe:
//   s1 the pump moves the product from the tank to the filling unit; the pump makes the pressure and pipe, valve and exchanger
//      use it up (the first lesson's words); steam and cooling water are utilities (the cooling lesson's words); the map before
//      any detail: four topics, two about moving the product (pipes, pumps), two about the heat (exchangers, steam)
//                                                                                    → eng.fluids.flow
//   s2 Stroming en druk in leidingen: bends, valves and filters on the way to line 3 cost pressure, the pressure drop; the pump
//      has to deliver it again; you read the friction of a pipe in the Moody chart (Werkkennis, .friction)
//   s3 Pompen: the more pressure the pipe gives back, the less flow the pump delivers; where pump and pipe curves cross is the
//      duty point; a pump far from its best point wastes energy; you read the pump curve (Basis, .pumps; the field film's tool)
//   s4 Warmteoverdracht en warmtewisselaars: heat goes from a hot stream to a cold one through a wall without mixing; suppose the
//      product has to be warm before the filling unit; you pick a plate heat exchanger (Werkkennis, .heat; the field film's tool)
//   s5 Stoom en utilities: steam brings the heat and turns back into water, the condensate, which has to leave the exchanger or
//      the heating drops; you check the steam trap (Basis, .steam); a trap stuck open blows live steam away; the story ends where
//      the field film picks it up, in the loss of energy
//   s6 the shared Engineering map (the kit's mapScene) with Pompen, stroming en warmte lit, then the module's four topics with
//      their levels as columns, where to start, and what each later level adds, in the app's level words
// Per the review of eng.machining.intro: how the topics hang together is said once, in s1, before any detail; a topic scene is
// short (what it is, its place in the story with a reason, then the tool sentence); the tools are real things of the topic taught
// as terms at Basis or Working knowledge level, one short sentence each, not explained: the Moody chart (pipes, Working knowledge),
// the pump curve (pumps, Basis), the plate heat exchanger (heat, Working knowledge), the steam trap (steam, Basis). Three topics have
// one real tool because the rest of their Basis and Working knowledge terms are concepts, units or numbers: pipes (the Basis lesson
// has only head, pressure drop, DN, laminar, turbulent, Reynolds number), heat (Basis: conduction, convection, insulation) and
// steam (Working knowledge: cooling tower and chiller are plant, not something a person uses). The two Working knowledge tools (Moody
// chart, plate heat exchanger) are not named again in the closing grid, which says what each later level adds as the lessons are
// titled. The pump's speed control is Working knowledge matter of the pump topic (eng.fluids.speed); it is named in the closing
// grid only as that, "toerenregeling van de pomp", and nothing about the drive itself (that is eng.power's ground). The pump curve
// and the plate heat exchanger agree with the field film's station. Not used, because other stations own them: frequency
// converter and compressed air (eng.power), the cabinet, the transformer and the switchboard (eng.switchgear, eng.transformers).
// Definitions as the Basis lessons word them (eng.fluids.flow, .pumps, .transfer, .steam). Terms come from the module's lessons and
// {n:} numbers from the module's text (the kit's intro mode, films/_kit/build-film.mjs); the kit holds the film to its map (every
// topic named in a caption of its own scene, explained in two beats and lit), its narration guard and its label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): hall B as in the energy field film (the shared hall of
// films/pm.plan.intro/hall.mjs: line 3, the filling unit, the tank, the pipe and the pump of the field film, copied here because
// that film keeps them inside its own build), with the exchanger, a valve and the steam pipe added where the story needs them. A
// panel at the right, in stage space, draws each step as a schema, labelled "voorbeeld" (line 3's way) or "schema" (the module's map).
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
// The map this film draws, asserted against the index (the build fails if the module's topics or levels move):
// s6 names what each later level adds.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const MOD = MODULES.find((m) => m.id === 'eng.fluids');
const LEVELS = {
  pipes: ['eng.fluids.flow', 'eng.fluids.friction', 'eng.fluids.valves', 'eng.fluids.sizing'],
  pumps: ['eng.fluids.pumps', 'eng.fluids.speed', 'eng.fluids.cavitation', 'eng.fluids.pumpsystem'],
  heat: ['eng.fluids.transfer', 'eng.fluids.heat', 'eng.fluids.lmtd', 'eng.fluids.recovery'],
  utilities: ['eng.fluids.steam', 'eng.fluids.cooling', 'eng.fluids.steamloss', 'eng.fluids.audit'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.fluids has the four topics and levels this film draws');
assert(MOD.intro === 'eng.fluids.intro', 'eng.fluids names this film as its intro');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s1: the pump makes the pressure, the rest uses it up; steam and cooling water are utilities
has('eng.fluids.flow', ['Een pomp maakt de druk', 'verbruiken die door wrijving']);
has('eng.fluids.flow', ['A pump makes the pressure', 'use it up through friction'], 'en');
has('eng.fluids.cooling', ['Het zijn allemaal utilities: hulpsystemen die het proces nodig heeft maar niet verkoopt']);
has('eng.fluids.cooling', ['Each is a utility: a service the process needs but does not sell'], 'en');
// s2: bends, valves and filters cost pressure; the drop is lost to friction; the Moody chart
has('eng.fluids.flow', ['De drukval is de druk die tussen twee punten verloren gaat aan wrijving', 'In de praktijk geeft elke bocht, afsluiter en filter zijn eigen drukval']);
has('eng.fluids.flow', ['The pressure drop is the pressure lost to friction between two points', 'every bend, valve and filter'], 'en');
has('eng.fluids.friction', ['Moody-diagram', 'Grafiek van de wrijvingsfactor tegen het getal van Reynolds']);
has('eng.fluids.friction', ['Moody chart', 'Graph of the friction factor against the Reynolds number'], 'en');
// s3: the flow falls as the pressure against it rises; the curves cross at the duty point; far from the best point it wastes
has('eng.fluids.pumps', ['Zijn debiet zakt als de tegendruk stijgt', 'Waar de twee lijnen elkaar snijden ligt het werkpunt', 'Pompkarakteristiek', 'het zuinigst']);
has('eng.fluids.pumps', ['Its flow drops as the pressure against it rises', 'Where the two curves cross is the duty point', 'Pump curve', 'most efficiently'], 'en');
// s4: heat through a wall without mixing; the plate heat exchanger
has('eng.fluids.heat', ['brengt warmte van een warme stroom naar een koude via een wand, zonder dat ze mengen', 'Platenwarmtewisselaar']);
has('eng.fluids.heat', ['moves heat from a hot stream to a cold one through a wall, without mixing them', 'Plate heat exchanger'], 'en');
// s5: steam gives its heat and is water again, the condensate has to leave, the steam trap; a trap stuck open blows steam
has('eng.fluids.steam', ['de warmte die vrijkomt als hij weer water wordt', 'moet het water, het condensaat, de warmtewisselaar uit', 'zakt de verwarming', 'Condenspot', 'Een condenspot die openstaat blaast verse stoom']);
has('eng.fluids.steam', ['the heat released when it turns back into water', 'must leave the heat exchanger', 'heating drops', 'Steam trap', 'A trap stuck open blows live steam'], 'en');
// s6: where to start, and the later levels as the lessons are titled
for (const [id, word] of [['eng.fluids.friction', 'Leidingwrijving'], ['eng.fluids.speed', 'Toerenregeling'], ['eng.fluids.heat', 'Warmtewisselaars'], ['eng.fluids.cooling', 'Koelwater'],
  ['eng.fluids.valves', 'Regelkleppen'], ['eng.fluids.cavitation', 'Cavitatie'], ['eng.fluids.lmtd', 'tekortschieten'], ['eng.fluids.steamloss', 'Verliezen in het stoomsysteem'],
  ['eng.fluids.sizing', 'Leidingmaat en levensduurkosten'], ['eng.fluids.pumpsystem', 'Pompsystemen'], ['eng.fluids.recovery', 'Warmteterugwinning'], ['eng.fluids.audit', 'energiecase'],
  ['eng.fluids.flow', 'Druk, debiet en drukval']]) has(id, [word]);
for (const [id, word] of [['eng.fluids.friction', 'Pipe friction'], ['eng.fluids.speed', 'Speed control'], ['eng.fluids.heat', 'Heat exchangers'], ['eng.fluids.cooling', 'Cooling water'],
  ['eng.fluids.valves', 'Control valves'], ['eng.fluids.cavitation', 'Cavitation'], ['eng.fluids.lmtd', 'fall short'], ['eng.fluids.steamloss', 'Steam system losses'],
  ['eng.fluids.sizing', 'life-cycle cost'], ['eng.fluids.pumpsystem', 'Pump systems'], ['eng.fluids.recovery', 'Heat recovery'], ['eng.fluids.audit', 'energy case'],
  ['eng.fluids.flow', 'Pressure, flow and pressure drop']]) has(id, [word], 'en');
// s6: the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from
// GRID.x; the words stand on one line each, staggered over two rows (columns 1 and 3 high, 2 and 4 low), so a
// word may be wider than its column but not wider than the room to the next word on its row, nor run off the stage.
const LV = { nl: levelWords('nl'), en: levelWords('en') };
const GRID = { x: 276, col: 90, box: 82, tile: 252, top: 64, pitch: 80, h: 64 };
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

// where things stand (cm), as in the energy field film: the tank at the back wall (x 142) with its pipe along the floor past the
// pump (x 162), the pipe rising behind the end of line 3's bench (x 180) and running over to the plate of the filling unit
// (x 196 to 208) over the start of the belt. New here, each with its reason in the story: the plate heat exchanger on the
// rising pipe (the field film's heat exchanger), a valve in the pipe over to the unit (topic 1: valves use pressure up), the steam
// pipe that comes through the back wall to the exchanger and the steam trap on the condensate pipe back through it (topics 3 and 4)
const L3 = { x: 186, y: 16, len: 84, dep: 34 };
const UX = 196;
const FRAME = { top: 150, beam: 160 };
const PLATE = { z0: 100, z1: 146 };
const TANK = { x: 142, y: 34, r: 17, h: 112 };
const PIPE = { y: 29, z: 118, rise: 180 };
const PUMP = { x: 162, y: 32 };
// the exchanger stands in front of the rise of the pipe, left of the unit's front leg (x 196) and well away from where the energy
// films put the motor (x 238 to 264) and the compressor's hose (x 228), so hall B stays the same hall in every intro
const XC = { x0: 174, x1: 194, y0: 58, y1: 74, z0: 22, z1: 64 };
const PX = PIPE.rise; // the product pipe up through the exchanger and back along the line to the plate: x 180 to 186, y 62 to 68
const frame = [
  w.box({ x: UX, y: 5, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 52, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 5, w: 9, d: 56, r: 1 }, FRAME.top, FRAME.beam, { tone: 'mid' }, { steps: 2 }),
].join('');
const plate = w.box({ x: UX + 9, y: L3.y, w: 3.2, d: 36, r: 0.6 }, PLATE.z0, PLATE.z1, { tone: 'mid' }, { steps: 2 });
const cover = w.box({ x: UX - 7, y: 12, w: 23, d: 42, r: 7 }, FRAME.beam, FRAME.beam + 24, { tone: 'hi' }, { steps: 2 });
const tank = w.post(TANK.x, TANK.y, TANK.r, 0, TANK.h, { tone: 'mid' }, 22)
  + w.post(TANK.x, TANK.y, TANK.r - 4, TANK.h, TANK.h + 5, { tone: 'lo' }, 18);
// the product pipe: along the floor from the tank past the pump, forward and along the front of the line to the exchanger standing at
// its right (so that it can be seen and reached and does not hide the pump), up through it, up to the height of the unit's plate,
// back over the line and along to the plate of the unit
const pipeA = w.box({ x: TANK.x + TANK.r - 2, y: PIPE.y, w: PIPE.rise + 6 - (TANK.x + TANK.r - 2), d: 6, r: 2 }, 10, 20, { tone: 'lo' }, { steps: 1 })
  + w.box({ x: PIPE.rise, y: PIPE.y, w: 6, d: 69 - PIPE.y, r: 2 }, 10, 20, { tone: 'lo' }, { steps: 1 });
// (the rest of the pipe is in front of the line and over it, so it is painted after the line)
const pipeB = w.box({ x: PX, y: 62, w: 6, d: 6, r: 2 }, 10, XC.z0, { tone: 'lo' }, { steps: 1 })
  + w.box({ x: PX, y: 62, w: 6, d: 6, r: 2 }, XC.z1, PIPE.z + 8, { tone: 'lo' }, { steps: 1 })
  + w.box({ x: PX, y: PIPE.y, w: 6, d: 69 - PIPE.y, r: 2 }, PIPE.z, PIPE.z + 8, { tone: 'lo' }, { steps: 1 })
  + w.box({ x: PX, y: PIPE.y, w: UX + 9 - PX, d: 6, r: 2 }, PIPE.z, PIPE.z + 8, { tone: 'lo' }, { steps: 1 });
// the pump on the floor pipe: a volute (a horizontal drum) with its terminal box
const pump = k.solidSvg(G.disc(0, 16, 12, G.frameOf([PUMP.x, PUMP.y, 18], [1, 0, 0], [0, 1, 0], [0, 0, 1]), P, { steps: 18 }), { tone: 'hi', crease: 'none' })
  + w.post(PUMP.x + 8, PUMP.y, 8, 28, 62, { tone: 'mid' }, 14)
  + w.post(PUMP.x + 8, PUMP.y, 5, 62, 68, { tone: 'lo' }, 10);
// the valve in the pipe over to the unit: a body with a hand wheel on a stem
const VX = 189;
const valve = w.box({ x: VX, y: PIPE.y - 2, w: 10, d: 10, r: 2 }, PIPE.z - 2, PIPE.z + 10, { tone: 'mid' }, { steps: 2 })
  + w.box({ x: VX + 4, y: PIPE.y + 1, w: 2, d: 2, r: 0.4 }, PIPE.z + 10, PIPE.z + 17, { tone: 'lo' }, { steps: 1 })
  + w.box({ x: VX - 1, y: PIPE.y - 2, w: 12, d: 10, r: 4 }, PIPE.z + 17, PIPE.z + 20, { tone: 'hi' }, { steps: 1 });
// the plate heat exchanger standing in front of the line: two thick end plates with a pack of thin plates between them, a carrying bar on top
const packY = [XC.y0 + 3.6, XC.y0 + 5.6, XC.y0 + 7.6, XC.y0 + 9.6, XC.y0 + 11.6];
const xchg = w.box({ x: XC.x0, y: XC.y0, w: XC.x1 - XC.x0, d: 2.6, r: 0.8 }, XC.z0 - 4, XC.z1 + 3, { tone: 'mid' }, { steps: 1 })
  + packY.map((y, i) => w.box({ x: XC.x0 + 1.5, y, w: XC.x1 - XC.x0 - 3, d: 1.4, r: 0.2 }, XC.z0, XC.z1, { tone: i % 2 ? 'mid' : 'hi' }, { steps: 0 })).join('')
  + w.box({ x: XC.x0, y: XC.y1 - 2.6, w: XC.x1 - XC.x0, d: 2.6, r: 0.8 }, XC.z0 - 4, XC.z1 + 3, { tone: 'mid' }, { steps: 1 })
  + w.box({ x: XC.x0 - 2, y: XC.y0 + 5, w: XC.x1 - XC.x0 + 4, d: 6, r: 1 }, XC.z1 + 3, XC.z1 + 6, { tone: 'lo' }, { steps: 1 });
// the steam: a pipe from the back wall (y 0) over the pump to the exchanger at its top; the condensate leaves at the front of the
// exchanger through the steam trap (a small drum with a cap) into a drain pipe down into the floor
const SX = 187;
const steam = w.box({ x: SX, y: 0, w: 5, d: XC.y0 + 6, r: 1.2 }, 78, 84, { tone: 'hi' }, { steps: 1 })
  + w.box({ x: SX, y: XC.y0 + 1, w: 5, d: 5, r: 1.2 }, XC.z1 + 3, 84, { tone: 'hi' }, { steps: 1 });
const cond = w.box({ x: SX, y: XC.y1 - 2, w: 5, d: 12, r: 1.2 }, XC.z0 + 4, XC.z0 + 9, { tone: 'lo' }, { steps: 1 });
const trap = w.post(SX + 2.5, XC.y1 + 12, 5.5, XC.z0 - 4, XC.z0 + 14, { tone: 'mid' }, 14) + w.post(SX + 2.5, XC.y1 + 12, 3, XC.z0 + 14, XC.z0 + 19, { tone: 'lo' }, 10)
  + w.box({ x: SX + 1, y: XC.y1 + 10.5, w: 3, d: 3, r: 0.6 }, 0, XC.z0 - 4, { tone: 'lo' }, { steps: 0 });
const JIJ = { x: 126, y: 104 };

// painted back to front (large x and small y are far): the tank, the steam, the pipe and the pump, the exchanger, the unit, the line,
// you
const world = [
  w.room(ROOM),
  cueG('tank', tank),
  cueG('pipe', pipeA),
  cueG('pump', pump),
  cueG('unit', frame + plate + cover),
  cueG('line3', hall.conveyor({ ...L3, cartons: 4 })),
  cueG('pipe', pipeB),
  cueG('valve', valve),
  cueG('steam', steam),
  cueG('xchg', xchg),
  cueG('trap', trap + cond),
  g('pp-jij', person('jij', JIJ.x, JIJ.y, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame
// (data-k): the four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the
// schemas of each beat. The shared Engineering map (the kit's mapScene) sits under the panel; its place Pompen, stroming en warmte
// is a cue group of its own (map-fluids).
const TILE = { pipes: 'tPip', pumps: 'tPum', heat: 'tHea', utilities: 'tUti' };
const PANEL = ['flowS', 'defS', 'utilS', 'grpA', 'grpB', 'dropS', 'whyS', 'curveS', 'dutyS', 'passS', 'giveS', 'steamS', 'condS', 'lossS',
  'tool1', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, Pompen, stroming en warmte lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP_W = 640;
const MAP_H = 1128;
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.fluids'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.fluids');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.fluids')}"`), 'the map lights eng.fluids as a cue group');
assert(MAP.includes(`viewBox="0 0 ${MAP_W} ${MAP_H}"`), 'the Engineering map is 640 by 1128');

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
  { from: cam(190, 45, 55, 1.3), to: cam(195, 45, 55, 1.4) }, // s1 the tank, the pump, the line and the exchanger
  { from: cam(188, 40, 105, 1.7), to: cam(194, 40, 105, 1.8) }, // s2 the pipe over to the unit with its valve
  { from: cam(155, 35, 40, 1.9), to: cam(160, 35, 42, 2.0) }, // s3 the tank and the pump
  { from: cam(184, 66, 48, 1.75), to: cam(184, 67, 48, 1.85) }, // s4 the exchanger
  { from: cam(184, 66, 45, 1.65), to: cam(184, 70, 42, 1.75) }, // s5 the steam pipe and the trap
  { from: cam(170, 45, 70, 1), to: cam(170, 45, 70, 1) }, // s6 (the map)
];
// You are moved, in stage units, to where each scene needs you; the base place is JIJ above.
const shiftOf = (from, to) => w.at([...to, 0]).map((v, i) => Math.round((v - w.at([...from, 0])[i]) * 10) / 10);
const JIJSHIFT = { 1: shiftOf([JIJ.x, JIJ.y], [140, 102]), 3: shiftOf([JIJ.x, JIJ.y], [246, 66]), 4: shiftOf([JIJ.x, JIJ.y], [262, 72]) };

// ---------------------------------------------------------------- the film
const TOOL = (a) => ({ cue: { [a]: 'tool1' } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.fluids.intro',
  title: { nl: 'De leiding naar lijn 3: pompen, stroming en warmte', en: 'The pipe to line 3: pumps, flow and heat' },
  module: 'eng.fluids',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.fluids, the scene that explains it and its tile
  topics: {
    pipes: { scene: 's2', cue: 'tPip' },
    pumps: { scene: 's3', cue: 'tPum' },
    heat: { scene: 's4', cue: 'tHea' },
    utilities: { scene: 's5', cue: 'tUti' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'De leiding naar lijn 3', en: 'The pipe to line 3' },
      beats: [
        { nl: 'In hal B pompt een pomp het product uit een tank, door een warmtewisselaar, naar de vuleenheid van lijn 3.', en: 'In hall B a pump moves the product from a tank, through a heat exchanger, to the filling unit of line 3.', focus: ['flowS', 'tank', 'pump', 'pipe', 'xchg', 'unit', 'line3'] },
        { nl: 'De pomp maakt de druk. Leidingen, afsluiters en warmtewisselaars verbruiken hem door wrijving.', en: 'The pump makes the pressure. Pipes, valves and heat exchangers use it up through friction.', focus: ['defS', 'pump', 'pipe', 'valve', 'xchg'] },
        { nl: 'Stoom en koelwater zijn utilities. Het proces heeft ze nodig, maar verkoopt ze niet.', en: 'Steam and cooling water are utilities. The process needs them but does not sell them.', focus: ['utilS', 'steam', 'xchg'] },
        { nl: 'Vier onderwerpen volgen de leiding. Eerst hoe het product stroomt, in leidingen en met een pomp.', en: 'Four topics follow the pipe. First how the product flows, in pipes and with a pump.', focus: ['grpA', 'pipe', 'pump'] },
        { nl: 'Daarna de warmte, in warmtewisselaars en met stoom en koelwater.', en: 'Then the heat, in heat exchangers and with steam and cooling water.', focus: ['grpB', 'xchg', 'steam'] },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Leidingen', en: 'Pipes' },
      beats: [
        { nl: 'Eerste onderwerp: Stroming en druk in leidingen. Bochten, afsluiters en filters kosten druk.', en: 'First topic: Flow and pressure in pipes. Bends, valves and filters cost pressure.', focus: ['tPip', 'dropS', 'pipe', 'valve'] },
        { nl: 'Dat is de drukval. De pomp moet hem steeds weer leveren, dus elke extra bocht kost pompenergie.', en: 'That is the pressure drop. The pump has to deliver it again and again, so every extra bend costs pump energy.', focus: ['whyS', 'pump', 'pipe'] },
        { nl: 'Bij turbulente stroming lees je de wrijvingsfactor af in het {t:Moody-diagram|Moody-diagram}.', en: 'For turbulent flow you read the friction factor from the {t:Moody chart|Moody chart}.', ...TOOL('Moody-diagram'), focus: ['tool1', 'pipe', 'jij'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Pompen', en: 'Pumps' },
      beats: [
        { nl: 'Tweede onderwerp: Pompen. Hoe meer tegendruk de leiding geeft, hoe minder debiet de pomp levert.', en: 'Second topic: Pumps. The more pressure the pipe pushes back, the less flow the pump delivers.', focus: ['tPum', 'curveS', 'pump', 'pipe'] },
        { nl: 'De lijnen van pomp en leiding snijden in het werkpunt. Ver van het zuinigste punt gaat energie verloren.', en: 'The curves of pump and pipe cross at the duty point. Far from the best point, energy is lost.', focus: ['dutyS', 'pump', 'pipe'] },
        { nl: 'Je leest de {t:Pompkarakteristiek|pompkarakteristiek} van de fabrikant.', en: 'You read the maker’s {t:Pump curve|pump curve}.', ...TOOL('Pompkarakteristiek'), focus: ['tool1', 'pump', 'jij'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Warmte', en: 'Heat' },
      beats: [
        { nl: 'Derde onderwerp: Warmteoverdracht en warmtewisselaars. Warmte gaat door een wand, zonder te mengen.', en: 'Third topic: Heat transfer and heat exchangers. Heat goes through a wall, without mixing.', focus: ['tHea', 'passS', 'xchg'] },
        { nl: 'Stel dat het product warm moet zijn voor de vuleenheid. Dan neemt het in de wisselaar warmte op.', en: 'Suppose the product has to be warm before the filling unit. Then it takes up heat in the exchanger.', focus: ['giveS', 'xchg', 'pipe'] },
        { nl: 'Je kiest vaak een {t:Platenwarmtewisselaar|platenwarmtewisselaar}.', en: 'You often pick a {t:Plate heat exchanger|plate heat exchanger}.', ...TOOL('Platenwarmtewisselaar'), focus: ['tool1', 'xchg', 'jij'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Stoom', en: 'Steam' },
      beats: [
        { nl: 'Vierde onderwerp: Stoom en utilities. Stoom brengt de warmte en wordt in de wisselaar weer water.', en: 'Fourth topic: Steam and utilities. Steam brings the heat and turns back into water in the exchanger.', focus: ['tUti', 'steamS', 'steam', 'xchg'] },
        { nl: 'Dat water, het condensaat, moet de wisselaar uit. Anders zakt de verwarming.', en: 'That water, the condensate, has to leave the exchanger. Otherwise the heating drops.', focus: ['condS', 'xchg', 'steam'] },
        { nl: 'Bij de afvoer controleer je de {t:Condenspot|condenspot}.', en: 'At the drain you check the {t:Steam trap|steam trap}.', ...TOOL('Condenspot'), focus: ['tool1', 'trap', 'jij'] },
        { nl: 'Een condenspot die openstaat blaast verse stoom weg. Daar verdwijnt energie.', en: 'A trap stuck open blows live steam away. That is where energy disappears.', focus: ['lossS', 'trap', 'steam'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. Pompen, stroming en warmte is het vijfde station van Energie en het net.', en: 'The whole map. Pumps, flow and heat is the fifth station of Energy and the grid.', focus: 'map-fluids' },
        { nl: 'Elk onderwerp heeft vier niveaus.', en: 'Every topic has four levels.', focus: 'route' },
        { nl: 'Begin bij de les over druk, debiet en drukval op niveau Basis. Die laat zien waar de druk blijft.', en: 'Start with the lesson on pressure, flow and pressure drop at Basics level. It shows where pressure goes.', focus: ['tPip', 'start'] },
        { nl: 'Op niveau Werkkennis komen leidingwrijving, toerenregeling van de pomp, warmtewisselaars en koelwater.', en: 'At Working knowledge level come pipe friction, pump speed control, heat exchangers and cooling water.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd komen regelkleppen, cavitatie, tekortschietende wisselaars en stoomverliezen.', en: 'At Advanced level come control valves, cavitation, exchangers that fall short and steam losses.', focus: 'lv3' },
        { nl: 'Op niveau Expert komen leidingmaat en levensduurkosten, pompsystemen, warmteterugwinning en de energiecase.', en: 'At Expert level come pipe size and life-cycle cost, pump systems, heat recovery and the energy case.', focus: 'lv4' },
        { nl: 'Elke les en elke film van deze module heeft een plek op deze kaart.', en: 'Every lesson and every film in this module has a place on this map.', focus: null },
      ],
    },
  ],
  skip: [],
  strictFocus: true,
};

// ---------------------------------------------------------------- the narration
// What the voice says, per scene and beat: the high-over picture, each thing said once. Short sentences, few
// colons and comma lists, no symbols the voice would read aloud and nothing in parentheses: the kit's narration
// guard (films/_kit/assert.mjs, checkNarration) holds every module film to that, and the render guard caps a pause
// inside a sentence at 0.4 s. Each topic scene ends on one short sentence naming the tool of that topic's lessons,
// without explaining it (the steam scene adds a beat after it, on the loss). Every drawn detail has its reason in the
// narration: the tank, the pump and the unit of line 3 (the field film's product line), the heat exchanger on it (the
// product has to be warm), the valve (it uses pressure up), the steam pipe and the steam trap (the heat and the drain of
// the exchanger), you (a consultant who reads the charts and checks the trap).
const SAY = [
  [ // s1 the product line; the pump makes the pressure and the rest uses it; utilities; the map in two groups
    { nl: 'In hal B pompt een pomp het product uit een tank, door een warmtewisselaar, naar de vuleenheid van lijn 3.',
      en: 'In hall B a pump moves the product from a tank, through a heat exchanger, to the filling unit of line 3.' },
    { nl: 'De pomp maakt de druk. Leidingen, afsluiters en warmtewisselaars verbruiken hem door wrijving.',
      en: 'The pump makes the pressure. Pipes, valves and heat exchangers use it up through friction.' },
    { nl: 'Stoom en koelwater zijn utilities. Het proces heeft ze nodig, maar verkoopt ze niet.',
      en: 'Steam and cooling water are utilities. The process needs them but does not sell them.' },
    { nl: 'Vier onderwerpen volgen de leiding. Eerst hoe het product stroomt, in leidingen en met een pomp.',
      en: 'Four topics follow the pipe. First how the product flows, in pipes and with a pump.' },
    { nl: 'Daarna de warmte, in warmtewisselaars en met stoom en koelwater.',
      en: 'Then the heat, in heat exchangers and with steam and cooling water.' },
  ],
  [ // s2 flow and pressure in pipes: bends, valves and filters cost pressure; the pump delivers it again; the Moody chart
    { nl: 'Het eerste onderwerp is Stroming en druk in leidingen. Elke bocht, afsluiter en filter op de weg naar lijn 3 kost druk.',
      en: 'The first topic is Flow and pressure in pipes. Every bend, valve and filter on the way to line 3 costs pressure.' },
    { nl: 'Dat verlies heet de drukval. De pomp moet die druk steeds opnieuw leveren, dus elke extra bocht kost pompenergie.',
      en: 'That loss is called the pressure drop. The pump has to deliver that pressure again and again, so every extra bend costs pump energy.' },
    { nl: 'Bij turbulente stroming lees je de wrijvingsfactor af in het {t:Moody-diagram|Moody-diagram}.',
      en: 'For turbulent flow you read the friction factor from the {t:Moody chart|Moody chart}.' },
  ],
  [ // s3 pumps: less flow against more pressure; the duty point; the pump curve
    { nl: 'Het tweede onderwerp is Pompen. Hoe meer tegendruk de leiding geeft, hoe minder debiet de pomp levert.',
      en: 'The second topic is Pumps. The more pressure the pipe pushes back, the less flow the pump delivers.' },
    { nl: 'De lijnen van pomp en leiding snijden in het werkpunt. Draait de pomp daar ver van zijn zuinigste punt, dan gaat energie verloren.',
      en: 'The curves of pump and pipe cross at the duty point. If the pump runs far from its best point there, energy is lost.' },
    { nl: 'Je leest de {t:Pompkarakteristiek|pompkarakteristiek} van de fabrikant.',
      en: 'You read the maker’s {t:Pump curve|pump curve}.' },
  ],
  [ // s4 heat transfer and heat exchangers: through a wall, no mixing; warm product; the plate heat exchanger
    { nl: 'Het derde onderwerp is Warmteoverdracht en warmtewisselaars. Een wisselaar brengt warmte door een wand, zonder te mengen.',
      en: 'The third topic is Heat transfer and heat exchangers. An exchanger moves heat through a wall, without mixing.' },
    { nl: 'Stel dat het product warm moet zijn voor de vuleenheid. Dan neemt het in de wisselaar warmte op.',
      en: 'Suppose the product has to be warm before the filling unit. Then it takes up heat in the exchanger.' },
    { nl: 'Je kiest vaak een {t:Platenwarmtewisselaar|platenwarmtewisselaar}.',
      en: 'You often pick a {t:Plate heat exchanger|plate heat exchanger}.' },
  ],
  [ // s5 steam and utilities: steam brings the heat and is water again; the condensate has to leave; the steam trap; a loss
    { nl: 'Het vierde onderwerp is Stoom en utilities. Stoom brengt de warmte naar de wisselaar en wordt daar weer water.',
      en: 'The fourth topic is Steam and utilities. Steam brings the heat to the exchanger and turns back into water there.' },
    { nl: 'Dat water heet condensaat en moet de wisselaar uit. Anders zakt de verwarming.',
      en: 'That water is called condensate and has to leave the exchanger. Otherwise the heating drops.' },
    { nl: 'Bij de afvoer controleer je de {t:Condenspot|condenspot}.',
      en: 'At the drain you check the {t:Steam trap|steam trap}.' },
    { nl: 'Een condenspot die openstaat blaast verse stoom weg. Daar verdwijnt energie.',
      en: 'A trap stuck open blows live steam away. That is where energy disappears.' },
  ],
  [ // s6 the map: the level words of the app, as the captions show them
    { nl: 'De hele kaart. Pompen, stroming en warmte is het vijfde station van Energie en het net.',
      en: 'The whole map. Pumps, flow and heat is the fifth station of Energy and the grid.' },
    { nl: 'Elk onderwerp heeft vier niveaus.',
      en: 'Every topic has four levels.' },
    { nl: 'Begin bij de les over druk, debiet en drukval op niveau Basis. Die laat zien waar de druk blijft.',
      en: 'Start with the lesson on pressure, flow and pressure drop at Basics level. It shows where pressure goes.' },
    { nl: 'Op niveau Werkkennis komen leidingwrijving, toerenregeling van de pomp, warmtewisselaars en koelwater.',
      en: 'At Working knowledge level come pipe friction, pump speed control, heat exchangers and cooling water.' },
    { nl: 'Op niveau Gevorderd komen regelkleppen, cavitatie, tekortschietende wisselaars en stoomverliezen.',
      en: 'At Advanced level come control valves, cavitation, exchangers that fall short and steam losses.' },
    { nl: 'Op niveau Expert komen leidingmaat en levensduurkosten, pompsystemen, warmteterugwinning en de energiecase.',
      en: 'At Expert level come pipe size and life-cycle cost, pump systems, heat recovery and the energy case.' },
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
const preamble = `const CAM = ${JSON.stringify(CAM)};\nconst JIJSHIFT = ${JSON.stringify(JIJSHIFT)};\nconst W = ${W}, H = ${H};\nconst LV = ${JSON.stringify(LV)};\nconst MAPZ = ${JSON.stringify(MAPZ)};\nconst MAPSZ = [${MAP_W}, ${MAP_H}];\nconst GRID = ${JSON.stringify(GRID)};\nconst KEYS = ${JSON.stringify(PANEL)};\nconst CW = ${JSON.stringify(CHAR_W)};\nconst wrapUnits = ${wrapUnits.toString()};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="jij"])';
const css = PM_CSS + HALL_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-tile{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:1.2}
.pm-badge{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-out{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:5 4}
.pm-bar{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-crit{fill:color-mix(in srgb,var(--fp-accent) 24%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-full{fill:color-mix(in srgb,#C2553F 55%,var(--anatomy-face));stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-lvl{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-link{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-dash{fill:none;stroke:var(--anatomy-hi);stroke-width:1.6;stroke-dasharray:5 4;stroke-linecap:round}
.pm-gap{fill:none;stroke:#C2553F;stroke-width:2;stroke-dasharray:5 4;stroke-linecap:round}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link,[data-cue][data-on] .pm-dash{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-bar,.pm-lvl,.pm-out,.pm-full){stroke:var(--fp-accent)}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');


const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 op zijn nieuwe plek draait. Langs de achterwand een tank, met een leiding langs de vloer en een pomp, die bij de band van lijn 3 omhoog gaat door een platenwarmtewisselaar en over een afsluiter naar de vuleenheid boven het begin van de band. Door de achterwand komt een stoomleiding bij de wisselaar en gaat de condensaatleiding met een condenspot terug. Jij, de engineer, staat voor de leiding. Rechts een paneel, gemarkeerd als voorbeeld of schema: de weg van tank naar vuleenheid, de pomp die druk maakt en leidingen die hem verbruiken, stoom en koelwater als utilities, de drukval over bochten en afsluiters, de lijnen van pomp en leiding met het werkpunt, warmte die door een wand van warm naar koud gaat, stoom die water wordt en het condensaat dat weg moet, met per onderwerp de naam van een hulpmiddel. Aan het eind de hele kaart van Engineering met Pompen, stroming en warmte verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the factory, where line 3 runs at its new place. Along the back wall a tank, with a pipe along the floor and a pump, that rises beside the belt of line 3 through a plate heat exchanger and over a valve to the filling unit above the start of the belt. Through the back wall a steam pipe comes to the exchanger and the condensate pipe with a steam trap goes back. You, the engineer, stand in front of the pipe. At the right a panel, marked as an example or a diagram: the way from tank to filling unit, the pump that makes pressure and pipes that use it up, steam and cooling water as utilities, the pressure drop over bends and valves, the pump and pipe curves with the duty point, heat that goes through a wall from hot to cold, steam that turns to water and the condensate that has to leave, with the name of one tool per topic. At the end the whole map of Engineering with Pumps, flow and heat lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

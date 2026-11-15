// Dev tool, not shipped. Builds the field film "Energie en het net / Energy and the grid"
// (eng.field.energy), the second Engineering field film (v17, Task 13): the level above the
// module intros. It places the seven modules of the zone (FIELDS in src/content/courses/index.js:
// gridbasics, switchgear, transformers, power, fluids, gridops, gridplanning) on one road and
// says, per station, what it is for, how it works, which two tools of the module you use there
// (named, not explained: the checkpoint rule of 14 Nov) and what goes wrong without it. The map,
// not a lesson: no calculations, no numbers.
//
//   node films/eng.field.energy/build.mjs            build the page
//   node films/eng.field.energy/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.field.energy.html: one offline page with the anatomy kit,
// the stage script and the player inlined. The index names it (the field's `film`), sw.js
// precaches it.
//
// The story: line 3 in hall B moves (the Projects films) and needs more power at its new place.
// You, the engineer, follow the power from the public grid into the plant and out to the line,
// and then look at it from the grid operator's side. Hall B shows the shared world: the power
// cabinet at the back wall at the left, the switchboard on the wall above line 3, line 3 itself
// with the filling unit of eng.field.making over the start of its belt and its tank, and the
// installer of the Projects films. Added for this film, each with its reason in the narration:
// the cable that comes through the left wall (the connection to the grid), a transformer between
// cabinet and switchboard (it steps the voltage down for the machines; its ribs cool it), a
// cable route from the transformer up the wall to the switchboard, a motor in front of the belt
// (it drives the belt), a compressor with a hose to the line (compressed air), and a pump on the
// pipe from the tank to the filling unit. Each station is one part of the chain:
//   s1 the opening: line 3 moves and needs more power; the chain grid, cabinet, transformer,
//      switchboard, motor; you follow the power from the grid to the line; the road with seven
//      stations
//   s2 Het elektriciteitsnet (eng.gridbasics): the cable from the grid comes into the hall;
//      high voltage loses little, the voltage steps down close to the plant; the capacity map
//      and a flexible contract (eng.gridbasics.congestion); without it you queue for power
//   s3 Schakelinstallaties en beveiliging (eng.switchgear): the cabinet switches and guards the
//      power; only the breaker nearest to a fault trips (selectivity); the installer sets a
//      protection relay and works with an earthing set (eng.switchgear.protection, .earthing);
//      without it one fault shuts down the hall or the work is unsafe
//   s4 Transformatoren en kabels (eng.transformers): the transformer steps the voltage down;
//      heat ages it, so the ribs cool it; a cable carries the power on; a DGA oil test and a
//      reflectometer (eng.transformers.ageing, .faults); without it it overheats or a cable fails
//   s5 Motoren, aandrijvingen en perslucht (eng.power), station label "Motoren en perslucht"
//      (the Dutch title wraps to three lines of a station; the module title is unchanged): the
//      motor drives the belt; the compressor and its hose, leaks cost power; a clamp meter and a
//      leak test (eng.power.sizing, .air); without it the air leaks and a motor is oversized
//   s6 Pompen, stroming en warmte (eng.fluids): the pump feeds the product from the tank to the
//      filling unit; pump and pipe fix the flow, a heat exchanger passes on heat; a pump curve
//      and a plate heat exchanger (eng.fluids.pumps, .heat); without it the pump runs off its
//      duty point
//   s7 Netbedrijf en assetmanagement (eng.gridops): the grid operator delivers the connection,
//      watches the grid, fixes outages and steers a full grid; an offer and a switching plan
//      (eng.gridops.request, .switching); without it the connection takes longer and a job
//      drops the power unexpectedly
//   s8 Netplanning en de energietransitie (eng.gridplanning): the planner looks at how much
//      power is needed later and where the grid gets full; a load flow and clipping
//      (eng.gridplanning.loadflow, .alternatives); without it the upgrade comes too late
//   s9 the shared Engineering map (the kit's mapScene) with the seven stations lit: the whole
//      map, the zone, place by place at 1.5, then back to the zone for two beats on how the
//      stations connect, and where to start
// The tools come from the modules' own lessons (checked below), each a term of its glossary, at
// Basis or Working knowledge level, and each in ONE module of the zone only (the capacity map is
// the one the grid planning lesson on load flow mentions in passing). Terms come from the
// field's lessons (the kit's field mode, films/_kit/build-film.mjs); the kit holds the film to
// its road (every module named in a caption of its own scene, in the order of the road,
// explained in two beats and lit, ending on the map with the field's places lit), to the
// narration guard and to the label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): the person of the cast, the
// room, the conveyor, cabinet, switchboard, cable and hard hat of hall B (films/pm.plan.intro/
// hall.mjs) and the installer (films/pm.agile.scrum/cast.mjs), imported. A panel at the right
// draws each station as four small schemas (what it is for, how it works, then one for each
// tool as it is named), two chips with the tools and a dashed card with what goes wrong without.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it lives somewhere
// else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { mapScene, mapStyles, mapCue } from '../_kit/mapscene.mjs';
import { wrapUnits, CHAR_W, STATION_UNITS } from '../_kit/assert.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';
import { scrumPerson } from '../pm.agile.scrum/cast.mjs';
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
const FIELD = FIELDS.find((f) => f.id === 'eng.field.energy');
const ROAD = ['eng.gridbasics', 'eng.switchgear', 'eng.transformers', 'eng.power', 'eng.fluids', 'eng.gridops', 'eng.gridplanning'];
assert(JSON.stringify(FIELD.modules) === JSON.stringify(ROAD), 'the energy field is the road gridbasics, switchgear, transformers, power, fluids, gridops, gridplanning');
// A station label: the Dutch title of eng.power wraps to three lines of a station of the road, so the film names and
// draws "Motoren en perslucht" / "Motors and fluid power" (the module title is unchanged; the kit's `label`)
const LABELS = { 'eng.power': { nl: 'Motoren en perslucht', en: 'Motors and fluid power' } };
const nameOf = (id, lang) => (LABELS[id] ? LABELS[id][lang] : MODULES.find((m) => m.id === id).title[lang]);
// the panel heading draws the station's name in at most two lines of the panel's width (the kit does not measure it)
for (const id of ROAD) for (const lang of ['nl', 'en']) {
  const t = nameOf(id, lang);
  const lines = wrapUnits(t, 284, CHAR_W);
  assert(lines.length <= 2 && lines.every((ln) => ln.split(' ').every((wd) => wrapUnits(wd, 284, CHAR_W).length === 1)), `the heading "${t}" (${lang}) does not fit two lines of 284 units`);
}
const lessons = await allLessons();
const misses = [];
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def}`)].join('\n'); for (const s of list) if (!text.includes(s)) misses.push(`${id} (${lang}) no longer says "${s}"`); };

// s2 the grid: high voltage loses little, the grid steps down close to the user; the capacity map; a flexible contract; the queue
has('eng.gridbasics.levels', ['dus de verliezen 100 keer zo klein', 'zetten transformatoren het pas dicht bij de gebruiker omlaag']);
has('eng.gridbasics.levels', ['so the losses drop 100 times', 'stepped down by transformers close to the user'], 'en');
has('eng.gridbasics.congestion', ['op een wachtrij (waiting list)', 'Capaciteitskaart Openbare kaart van de netbeheerders', 'Flexibel contract Een aansluitcontract met capaciteit']);
has('eng.gridbasics.congestion', ['Capacity map Public map', 'Flexible contract A connection contract with capacity'], 'en');
// s3 switchgear: the cabinet switches and guards; only the protection nearest the fault trips; the relay and the earthing set
has('eng.switchgear.devices', ['Een schakelinstallatie (switchgear) is de apparatuur die delen van het net schakelt, beveiligt en scheidt']);
has('eng.switchgear.devices', ['Switchgear is the equipment that switches, protects and isolates parts of the grid'], 'en');
has('eng.switchgear.selectivity', ['alleen de beveiliging die het dichtst bij de fout zit afschakelt', 'Alles daarboven, dichter bij de bron, blijft aan']);
has('eng.switchgear.selectivity', ['only the protection closest to the fault trips', 'Everything upstream, closer to the source, stays on'], 'en');
has('eng.switchgear.protection', ['Beveiligingsrelais Apparaat dat gemeten stroom en spanning vergelijkt met zijn instellingen', 'Een beveiligingsrelais vergelijkt die waarden met zijn instellingen']);
has('eng.switchgear.protection', ['Protection relay Device that compares', 'A protection relay compares these values with its settings'], 'en');
has('eng.switchgear.earthing', ['Aardgarnituur Draagbare klemmen en kabels die alle fasen']);
has('eng.switchgear.safety', ['Het meeste werk aan het net gebeurt spanningsloos']);
has('eng.switchgear.earthing', ['Earthing set Portable clamps and cables'], 'en');
has('eng.switchgear.safety', ['Most work on the grid is done dead'], 'en');
// s4 transformers: the transformer changes the voltage; heat ages it; the DGA oil test; the reflectometer for cable faults
has('eng.transformers.principle', ['Een transformator zet de ene wisselspanning om in een andere']);
has('eng.transformers.principle', ['A transformer changes one AC voltage into another'], 'en');
has('eng.transformers.ageing', ['Warmte breekt het langzaam af', 'DGA Gas-in-olie-analyse']);
has('eng.transformers.ageing', ['Heat slowly breaks it down', 'Dissolved gas analysis (DGA)'], 'en');
has('eng.transformers.principle', ['ONAN Oil natural, air natural: passieve koeling']);
has('eng.transformers.principle', ['ONAN Oil natural, air natural: passive cooling'], 'en');
has('eng.transformers.faults', ['Reflectiemeter Meetapparaat (ook echometer) dat een puls de kabel in stuurt']);
has('eng.transformers.faults', ['Reflectometer'], 'en');
// s5 power: the motor drives the belt (conveyors); compressed air is the costliest energy and leaks; the clamp meter and the leak test; an oversized motor
has('eng.power.motors', ['drijft de meeste pompen, ventilatoren, transportbanden en compressoren aan']);
has('eng.power.motors', ['drives most pumps, fans, conveyors and compressors'], 'en');
has('eng.power.air', ['de duurste manier om energie in een fabriek rond te brengen', 'Lektest De compressorbelasting meten terwijl de productie stilligt']);
has('eng.power.air', ['the most expensive way to deliver energy in a plant', 'Leak test'], 'en');
has('eng.power.sizing', ['Stroomtang Een tangvormige meter', 'Veel motoren draaien op halve belasting of minder']);
has('eng.power.sizing', ['Clamp meter', 'Many motors run at half load or less'], 'en');
// s6 fluids: pump and pipe fix the duty point; a heat exchanger passes heat on without mixing; the pump curve and the plate heat exchanger
has('eng.fluids.pumps', ['Werkpunt Snijpunt van pomp- en leidingkarakteristiek', 'Pompkarakteristiek De grafiek van de fabrikant']);
has('eng.fluids.pumps', ['Pump curve', 'Duty point'], 'en');
has('eng.fluids.heat', ['brengt warmte van een warme stroom naar een koude via een wand, zonder dat ze mengen', 'Platenwarmtewisselaar Compacte wisselaar']);
has('eng.fluids.heat', ['through a wall, without mixing them', 'Plate heat exchanger'], 'en');
// s7 grid operations: a connection starts with a request and an offer; the switching plan; the wrong order drops customers; the operator watches, repairs and steers
has('eng.gridops.request', ['Een aansluiting begint met een aanvraag', 'Offerte Het aanbod van de netbeheerder na een complete aanvraag']);
has('eng.gridops.request', ['A connection starts with a request to the regional grid operator', 'Offer'], 'en');
has('eng.gridops.switching', ['Schakelplan Stap-voor-stap-script', 'de verkeerde volgorde kan klanten laten uitvallen']);
has('eng.gridops.switching', ['Switching plan Step-by-step script', 'the wrong order can drop customers'], 'en');
has('eng.gridops.chain', ['Doorlooptijd is de kalendertijd van aanvraag tot werkende aansluiting']);
has('eng.gridops.chain', ['Lead time is the calendar time from request to working connection'], 'en');
has('eng.gridops.outage', ['Het bedrijfsvoeringscentrum, dat het net dag en nacht bewaakt en schakelt']);
has('eng.gridops.outage', ['The control room, the team that watches and switches the grid around the clock'], 'en');
has('eng.gridops.cmbasics', ['Congestiemanagement betekent afname of invoeding op piekmomenten sturen']);
has('eng.gridops.cmbasics', ['Congestion management means steering offtake or feed-in at peak moments'], 'en');
// s8 grid planning: how much power flows at once, later; the load flow; clipping instead of building
has('eng.gridplanning.demand', ['Elke netplanning begint met de vraag hoeveel vermogen er straks tegelijk loopt']);
has('eng.gridplanning.demand', ['All grid planning starts with how much power will flow at the same moment'], 'en');
has('eng.gridplanning.loadflow', ['Loadflow Berekening van stromen en spanningen in elk deel van het net', 'Nederlandse netplanners rekenen dat in tools als Vision of PowerFactory']);
has('eng.gridplanning.loadflow', ['Load flow A calculation of the currents and voltages in every part of the grid', 'grid planners run it in tools such as Vision or PowerFactory'], 'en');
has('eng.gridplanning.alternatives', ['Aftoppen Een zonnepark aansluiten op een deel van zijn piekvermogen', 'kan het zonder bouwen, of later?']);
has('eng.gridplanning.alternatives', ['Clipping Connecting a solar farm', 'can it be done without building, or later?'], 'en');
has('eng.gridplanning.investment', ['Draai loadflows per scenario per jaar en je ziet waar en wanneer elke asset over zijn grens gaat']);
has('eng.gridplanning.investment', ['Run load flows per scenario per year and you see where and when each asset goes over its limit'], 'en');

assert(!misses.length, `lesson text moved:\n  ${misses.join('\n  ')}`);

// ---------------------------------------------------------------- the world (hall B, line 3 at its new place)
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
const f1 = (v) => (Math.round(v * 10) / 10).toString();

// where things stand (cm). The back wall is y = 0, the side wall x = 0; the power cabinet, the transformer, the tank and
// the switchboard stand along the back wall from left to right, line 3 at the right under the switchboard, as in the
// Projects films (cabinet at x 12, switchboard at x 218, line 3 at x 186). The grid cable comes in through the left wall.
const CAB = { x: 12, w: 40, d: 26, h: 124 };
const SWB = { x: 218, w: 50, z0: 96, z1: 172 };
const L3 = { x: 186, y: 16, len: 84, dep: 34 };
const TRAFO = { x: 68, y: 4, w: 54, d: 32, h: 60 };
const UX = 196; // the filling unit of eng.field.making over the start of the belt: uprights and beam at x UX
const FRAME = { top: 150, beam: 160 };
const PLATE = { z0: 100, z1: 146 };
const TANK = { x: 142, y: 34, r: 17, h: 112 };
const PIPE = { y: 29, z: 118, rise: 180 };
const PUMP = { x: 162, y: 32 };
const MOTOR = { x0: 222, x1: 252, y: 60, z: 24, r: 9 };
const COMP = { x: 236, y: 98 };

// the cables: from the left wall to the cabinet (as in the Projects films), cabinet to transformer, and the run from the
// transformer along the back wall at the height of the switchboard (a cable tray) to the switchboard
const cabA = hall.cable([[0, 100], [32, 100], [32, 28]]);
const cabB = hall.cable([[52, 13], [TRAFO.x, 13]]);
const wallEntry = w.box({ x: 0, y: 86, w: 10, d: 28, r: 1.5 }, 0, 40, { tone: 'lo' }, { steps: 2 })
  + w.box({ x: 10, y: 96, w: 3, d: 8, r: 1 }, 0, 10, { tone: 'mid' }, { steps: 1 });
const tray = w.box({ x: TRAFO.x + TRAFO.w - 10, y: 0, w: SWB.x - (TRAFO.x + TRAFO.w - 10) + 20, d: 4, r: 0.6 }, 98, 104, { tone: 'lo' }, { steps: 2 })
  + w.box({ x: TRAFO.x + TRAFO.w - 10, y: 0, w: 5, d: 4, r: 0.6 }, TRAFO.h, 104, { tone: 'lo' } , { steps: 2 });

// the transformer: a tank on a base, three bushings on top where the cable connects, and cooling ribs on its front
const bushings = [0, 1, 2].map((i) => w.post(TRAFO.x + 12 + i * 15, TRAFO.y + 16, 3.4, TRAFO.h, TRAFO.h + 14, { tone: 'hi' }, 14)).join('');
const ribs = [0, 1, 2, 3, 4].map((i) => w.box({ x: TRAFO.x + 6 + i * 10, y: TRAFO.y + TRAFO.d, w: 5, d: 9, r: 0.8 }, 12, TRAFO.h - 6, { tone: 'lo' }, { steps: 1 })).join('');
const trafo = w.box({ x: TRAFO.x, y: TRAFO.y, w: TRAFO.w, d: TRAFO.d, r: 2 }, 6, TRAFO.h, { tone: 'mid' }, { steps: 3, bevel: 0.5 })
  + w.box({ x: TRAFO.x - 3, y: TRAFO.y - 2, w: TRAFO.w + 6, d: TRAFO.d + 4, r: 1 }, 0, 6, { tone: 'lo' }, { steps: 1 }) + ribs + bushings;

// the filling unit of eng.field.making (frame, plate), the tank with its pipe and the pump on the pipe
const frame = [
  w.box({ x: UX, y: 5, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 52, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 5, w: 9, d: 56, r: 1 }, FRAME.top, FRAME.beam, { tone: 'mid' }, { steps: 2 }),
].join('');
const plate = w.box({ x: UX + 9, y: L3.y, w: 3.2, d: 36, r: 0.6 }, PLATE.z0, PLATE.z1, { tone: 'mid' }, { steps: 2 });
// the tank's pipe leaves at the foot of the tank along the floor, passes the pump, rises behind the belt's end of the
// bench (at x 180, clear of it) and runs over to the plate of the filling unit
const tank = w.post(TANK.x, TANK.y, TANK.r, 0, TANK.h, { tone: 'mid' }, 28)
  + w.post(TANK.x, TANK.y, TANK.r - 4, TANK.h, TANK.h + 5, { tone: 'lo' }, 24)
  + w.box({ x: TANK.x + TANK.r - 2, y: PIPE.y, w: PIPE.rise + 6 - (TANK.x + TANK.r - 2), d: 6, r: 2 }, 10, 20, { tone: 'lo' }, { steps: 2 })
  + w.box({ x: PIPE.rise, y: PIPE.y, w: 6, d: 6, r: 2 }, 10, PIPE.z + 8, { tone: 'lo' }, { steps: 2 })
  + w.box({ x: PIPE.rise, y: PIPE.y, w: UX + 9 - PIPE.rise, d: 6, r: 2 }, PIPE.z, PIPE.z + 8, { tone: 'lo' }, { steps: 2 });
// the pump on the floor pipe: a volute (a horizontal drum) with its terminal box
const pump = k.solidSvg(G.disc(0, 16, 12, G.frameOf([PUMP.x, PUMP.y, 18], [1, 0, 0], [0, 1, 0], [0, 0, 1]), P, { steps: 24 }), { tone: 'hi', crease: 'none' })
  + w.post(PUMP.x + 8, PUMP.y, 8, 28, 62, { tone: 'mid' }, 18)
  + w.post(PUMP.x + 8, PUMP.y, 5, 62, 68, { tone: 'lo' }, 14);

// the motor in front of the belt: a horizontal drum with a terminal box on top, a foot, and a drive up to the belt
const motor = w.box({ x: MOTOR.x0 + 4, y: MOTOR.y - 8, w: MOTOR.x1 - MOTOR.x0 - 8, d: 16, r: 1 }, 0, 6, { tone: 'lo' }, { steps: 1 })
  + k.solidSvg(G.disc(0, MOTOR.x1 - MOTOR.x0, MOTOR.r, G.frameOf([MOTOR.x0, MOTOR.y, MOTOR.z], [1, 0, 0], [0, 1, 0], [0, 0, 1]), P, { steps: 28 }), { tone: 'mid', crease: 'none' })
  + w.box({ x: MOTOR.x0 + 10, y: MOTOR.y - 5, w: 12, d: 10, r: 1.4 }, MOTOR.z + MOTOR.r - 1, MOTOR.z + MOTOR.r + 7, { tone: 'hi' }, { steps: 1 })
  + w.box({ x: MOTOR.x0 + 12, y: L3.y + L3.dep, w: 5, d: MOTOR.y - L3.y - L3.dep - 2, r: 0.8 }, MOTOR.z, 56, { tone: 'lo' }, { steps: 1 });

// the compressor at the front right: a horizontal air tank on two legs with the motor and pump block on top, and a hose
// along the floor to the line
const comp = w.box({ x: COMP.x + 6, y: COMP.y + 4, w: 6, d: 20, r: 1 }, 0, 12, { tone: 'lo' }, { steps: 1 })
  + w.box({ x: COMP.x + 34, y: COMP.y + 4, w: 6, d: 20, r: 1 }, 0, 12, { tone: 'lo' }, { steps: 1 })
  + k.solidSvg(G.disc(0, 44, 14, G.frameOf([COMP.x, COMP.y + 14, 26], [1, 0, 0], [0, 1, 0], [0, 0, 1]), P, { steps: 28 }), { tone: 'mid', crease: 'none' })
  + w.box({ x: COMP.x + 10, y: COMP.y + 6, w: 24, d: 16, r: 2 }, 38, 54, { tone: 'hi' }, { steps: 2 });
const hose = hall.cable([[COMP.x + 22, COMP.y + 4], [COMP.x + 22, 66], [266, 66], [266, L3.y + L3.dep + 2]], { dashed: false })
  + w.box({ x: 262, y: L3.y + L3.dep, w: 8, d: 6, r: 1 }, 36, 52, { tone: 'hi' }, { steps: 1 });

const INST = { x: 16, y: 70 };
const installer = scrumPerson(w, k, G, P, { x: INST.x, y: INST.y, key: 'installer', look: 'sm', along: 'y' });
const person = (role, x, y, along) => w.person({ x, y, role, along });

const world = [
  w.room(ROOM),
  cueG('net', wallEntry + cabA),
  cueG('cab', hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h }) + cabB),
  cueG('trafo', trafo),
  cueG('swb', tray + hall.switchboard(SWB)),
  cueG('tank', tank),
  cueG('pump', pump),
  cueG('line3', hall.conveyor({ ...L3, cartons: 4 })),
  cueG('unit', frame + plate),
  cueG('motor', motor),
  cueG('air', comp + hose),
  g('pp-installer', installer + hall.hat(INST.x, INST.y)),
  g('pp-jij', person('jij', 44, 140, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group (data-cue), filled by the stage script each frame (data-k). The
// road holds the seven stations, one cue group each (st-<slug>): in s1 a row with its number and name, in s2 to s8 a
// numbered square of the strip under the heading. The shared Engineering map (mapScene, the seven stations lit)
// replaces the room and the panel in the last scene; its places are cue groups of their own (map-<slug>).
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
assert(ZBAND[1] > ZBAND[0] && MAPZ.every(([, y]) => y > ZBAND[0] && y < ZBAND[1]), 'the seven places lie inside the energy zone');
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
  { from: cam(140, 80, 100, 0.98), to: cam(140, 80, 100, 1.04) }, // s1 the whole hall, from the left wall to line 3
  { from: cam(25, 75, 55, 1.3), to: cam(25, 75, 55, 1.45) }, // s2 the cable through the left wall
  { from: cam(45, 40, 70, 1.4), to: cam(45, 40, 70, 1.5) }, // s3 the cabinet and the installer
  { from: cam(90, 25, 45, 1.7), to: cam(120, 20, 70, 1.35) }, // s4 the transformer with its ribs, then the run toward the switchboard
  { from: cam(215, 60, 65, 1.2), to: cam(215, 60, 65, 1.3) }, // s5 the motor, the belt and the compressor
  { from: cam(165, 36, 85, 1.35), to: cam(165, 36, 85, 1.5) }, // s6 the tank and the pump
  { from: cam(25, 75, 55, 1.3), to: cam(45, 45, 70, 1.2) }, // s7 the connection, back toward the cabinet
  { from: cam(140, 80, 100, 1.0), to: cam(140, 80, 100, 1.0) }, // s8 the whole hall again
  { from: cam(150, 85, 60, 1), to: cam(150, 85, 60, 1) }, // s9 (the map)
];

// ---------------------------------------------------------------- the film
const MAPS = ROAD.map(mapCue);
const TOOLCUE = (a, b, more = []) => ({ cue: { [a]: 't1', [b]: 't2' }, focus: ['t1', 't2', ...more] });
const DURS = Array(9).fill(30);
const spec = {
  id: 'eng.field.energy',
  title: { nl: 'Energie en het net', en: 'Energy and the grid' },
  field: 'eng.field.energy',
  // the road: per module of the field, the scene that explains it and its station on the road
  stations: Object.fromEntries(ROAD.map((id, i) => [id, { scene: `s${i + 2}`, cue: STATION_CUE[id], ...(LABELS[id] ? { label: LABELS[id] } : {}) }])),
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'De stroom van lijn 3', en: 'The power of line 3' },
      beats: [
        { nl: 'Lijn 3 in hal B verhuist. Op de nieuwe plek heeft hij meer stroom nodig.', en: 'Line 3 in hall B is moving. At its new place it needs more power.', focus: ['flow', 'line3'] },
        { nl: 'Het net levert de stroom. Via kast, transformator en schakelbord gaat hij naar de machines.', en: 'The grid supplies the power. Through cabinet, transformer and switchboard it reaches the machines.', focus: ['goal', 'net', 'cab', 'trafo', 'swb', 'motor'] },
        { nl: 'Jij bent de engineer en volgt de stroom van het net tot de lijn.', en: 'You are the engineer and follow the power from the grid to the line.', focus: ['route', 'jij', 'line3'] },
        { nl: 'Zeven stations, van het net en schakelen tot bedrijfsvoering en planning.', en: 'Seven stations, from the grid and switching to operations and planning.', focus: 'road' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Het elektriciteitsnet', en: 'The electricity grid' },
      beats: [
        { nl: 'Het eerste station is het elektriciteitsnet. Het brengt de stroom van hoogspanning tot in de hal.', en: 'The first station is the electricity grid. It brings the power from high voltage into the hall.', focus: ['st-gridbasics', 'for', 'net'] },
        { nl: 'Op hoogspanning gaat weinig verloren. Dicht bij de fabriek gaat de spanning stap voor stap omlaag.', en: 'At high voltage little is lost. Close to the plant the voltage steps down.', focus: ['for', 'net'] },
        { nl: 'Je kijkt op de {t:Capaciteitskaart|capaciteitskaart} en sluit zo nodig een {t:Flexibel contract|flexibel contract}.', en: 'You check the {t:Capacity map|capacity map} and sign a {t:Flexible contract|flexible contract} if needed.', ...TOOLCUE('Capaciteitskaart', 'Flexibel contract') },
        { nl: 'Zonder dit sta je in een vol gebied in de wachtrij voor stroom.', en: 'Without this you wait in a queue for power in a full area.', focus: 'without' },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Schakelinstallaties en beveiliging', en: 'Switchgear and protection' },
      beats: [
        { nl: 'Het tweede station is schakelinstallaties en beveiliging. De kast schakelt en bewaakt de stroom.', en: 'The second station is switchgear and protection. The cabinet switches and guards the power.', focus: ['st-switchgear', 'for', 'cab'] },
        { nl: 'Bij een kortsluiting schakelt alleen de schakelaar die er het dichtst bij zit uit.', en: 'In a short circuit only the breaker closest to the fault trips.', focus: ['for', 'cab'] },
        { nl: 'De installateur gebruikt een {t:Beveiligingsrelais|beveiligingsrelais} en een {t:Aardgarnituur|aardgarnituur}.', en: 'The installer uses a {t:Protection relay|protection relay} and an {t:Earthing set|earthing set}.', ...TOOLCUE('Beveiligingsrelais', 'Aardgarnituur', ['installer']) },
        { nl: 'Zonder dit legt één fout de hele hal stil, of is werken aan de kast niet veilig.', en: 'Without this one fault shuts down the whole hall, or work on the cabinet is not safe.', focus: 'without' },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Transformatoren en kabels', en: 'Transformers and cables' },
      beats: [
        { nl: 'Het derde station is transformatoren en kabels. De transformator zet de spanning om voor de machines.', en: 'The third station is transformers and cables. The transformer converts the voltage for the machines.', focus: ['st-transformers', 'for', 'trafo'] },
        { nl: 'Warmte laat hem sneller verouderen, dus koelen ribben hem. Een kabel voert naar het schakelbord.', en: 'Heat ages it faster, so ribs cool it. A cable leads on to the switchboard.', focus: ['for', 'trafo', 'swb'] },
        { nl: 'Je test de olie met een {t:DGA|DGA} en zoekt kabelfouten met een {t:Reflectiemeter|reflectiemeter}.', en: 'You test the oil with a {t:DGA|DGA} and find cable faults with a {t:Reflectometer|reflectometer}.', ...TOOLCUE('DGA', 'Reflectiemeter', ['trafo']) },
        { nl: 'Zonder dit raakt de transformator oververhit, of valt een kabel zonder waarschuwing uit.', en: 'Without this the transformer overheats, or a cable fails without warning.', focus: 'without' },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Motoren en perslucht', en: 'Motors and fluid power' },
      beats: [
        { nl: 'Het vierde station is motoren en perslucht. De motor drijft de band van lijn 3 aan.', en: 'The fourth station is motors and fluid power. The motor drives the belt of line 3.', focus: ['st-power', 'for', 'motor', 'line3'] },
        { nl: 'De compressor perst lucht voor de lijn. Dat is dure energie, en lekken kosten stroom.', en: 'The compressor squeezes air for the line. It is costly energy, and leaks waste power.', focus: ['for', 'air'] },
        { nl: 'Je meet de motorstroom met een {t:Stroomtang|stroomtang} en doet een {t:Lektest|lektest} op de perslucht.', en: 'You measure the motor current with a {t:Clamp meter|clamp meter} and run a {t:Leak test|leak test} on the air.', ...TOOLCUE('Stroomtang', 'Lektest', ['motor', 'air']) },
        { nl: 'Zonder dit lekt de perslucht weg en draait een te grote motor op halve kracht.', en: 'Without this the air leaks away and an oversized motor runs at half load.', focus: 'without' },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Pompen, stroming en warmte', en: 'Pumps, flow and heat' },
      beats: [
        { nl: 'Het vijfde station is pompen, stroming en warmte. Een pomp voert het product uit de tank naar de vuleenheid.', en: 'The fifth station is pumps, flow and heat. A pump feeds the product from the tank to the filling unit.', focus: ['st-fluids', 'for', 'tank', 'pump', 'unit'] },
        { nl: 'Pomp en leiding samen leggen het debiet vast. Een warmtewisselaar geeft warmte door zonder te mengen.', en: 'Pump and pipe together fix the flow. A heat exchanger passes on heat without mixing.', focus: ['for', 'tank', 'pump'] },
        { nl: 'Je leest de {t:Pompkarakteristiek|pompkarakteristiek} en kiest een {t:Platenwarmtewisselaar|platenwarmtewisselaar}.', en: 'You read the {t:Pump curve|pump curve} and pick a {t:Plate heat exchanger|plate heat exchanger}.', ...TOOLCUE('Pompkarakteristiek', 'Platenwarmtewisselaar', ['pump']) },
        { nl: 'Zonder dit draait de pomp op het verkeerde punt en gaat energie verloren.', en: 'Without this the pump runs at the wrong point and energy is lost.', focus: 'without' },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'Netbedrijf en assetmanagement', en: 'Grid operations and assets' },
      beats: [
        { nl: 'Het zesde station is netbedrijf en assetmanagement. De netbeheerder levert de aansluiting van lijn 3.', en: 'The sixth station is grid operations and assets. The grid operator delivers the connection for line 3.', focus: ['st-gridops', 'for', 'net'] },
        { nl: 'Daarna bewaakt hij het net, herstelt storingen en stuurt bij als het vol zit.', en: 'After that he watches the grid, fixes outages and steers when it is full.', focus: ['for', 'net'] },
        { nl: 'Je krijgt een {t:Offerte|offerte} en het netbedrijf werkt met een {t:Schakelplan|schakelplan}.', en: 'You get an {t:Offer|offer} and the grid operator works with a {t:Switching plan|switching plan}.', ...TOOLCUE('Offerte', 'Schakelplan', ['net']) },
        { nl: 'Zonder dit duurt de aansluiting langer en valt de stroom bij werk onverwacht uit.', en: 'Without this the connection takes longer and the power drops unexpectedly during work.', focus: 'without' },
      ],
    },
    {
      id: 's8', level: 1, dur: DURS[7], still: 0.9, title: { nl: 'Netplanning en de energietransitie', en: 'Grid planning and the transition' },
      beats: [
        { nl: 'Het zevende station is netplanning en de energietransitie. De planner kijkt hoeveel stroom er later nodig is.', en: 'The seventh station is grid planning and the transition. The planner looks at how much power is needed later.', focus: ['st-gridplanning', 'for', 'net', 'line3'] },
        { nl: 'Er komt steeds meer vraag bij, dus hij rekent uit waar en wanneer het net te vol raakt.', en: 'Demand keeps growing, so he works out where and when the grid gets too full.', focus: ['for', 'net'] },
        { nl: 'Hij draait een {t:Loadflow|loadflow} en weegt {t:Aftoppen|aftoppen} af tegen bouwen.', en: 'He runs a {t:Load flow|load flow} and weighs {t:Clipping|clipping} against building.', ...TOOLCUE('Loadflow', 'Aftoppen', ['net']) },
        { nl: 'Zonder dit komt de verzwaring te laat en wacht de volgende lijn op stroom.', en: 'Without this the upgrade comes too late and the next line waits for power.', focus: 'without' },
      ],
    },
    {
      id: 's9', level: 1, dur: DURS[8], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart: de zeven stations van Energie en het net liggen in één gebied.', en: 'The whole map: the seven stations of Energy and the grid lie in one zone.', focus: MAPS },
        { nl: 'Eerst het elektriciteitsnet: vermogen, het net van hoog naar laag, regels en netcongestie.', en: 'First the electricity grid: power, the grid from high to low, rules and congestion.', focus: MAPS[0] },
        { nl: 'Dan schakelinstallaties en beveiliging: schakelapparaten, stations, beveiliging en veilig schakelen.', en: 'Then switchgear and protection: switching devices, stations, protection and safe switching.', focus: MAPS[1] },
        { nl: 'Dan transformatoren en kabels: de transformator, conditie, kabelstoringen en aansluitingen.', en: 'Then transformers and cables: the transformer, condition, cable faults and connections.', focus: MAPS[2] },
        { nl: 'Dan motoren en perslucht: energie in de fabriek, motoren, aandrijvingen en perslucht.', en: 'Then motors and fluid power: plant energy, motors, drives and compressed air.', focus: MAPS[3] },
        { nl: 'Dan pompen, stroming en warmte: leidingen, pompen, warmtewisselaars en stoom.', en: 'Then pumps, flow and heat: pipes, pumps, heat exchangers and steam.', focus: MAPS[4] },
        { nl: 'Dan netbedrijf en assetmanagement: aansluiten, werk in het veld, storingen en congestiemanagement.', en: 'Then grid operations and assets: connecting, field work, outages and congestion management.', focus: MAPS[5] },
        { nl: 'Tot slot netplanning en de energietransitie: belasting, netontwerp, investeren en flexibiliteit.', en: 'Finally grid planning and the transition: load, grid design, investing and flexibility.', focus: MAPS[6] },
        { nl: 'Zo hangen ze samen: het net levert, de schakelinstallatie beveiligt en de transformator zet om.', en: 'How they connect: the grid supplies, the switchgear protects and the transformer converts.', focus: [MAPS[0], MAPS[1], MAPS[2]] },
        { nl: 'Motoren en pompen gebruiken de stroom. Netbedrijf en planning zorgen dat het net blijft leveren.', en: 'Motors and pumps use the power. Operations and planning keep the grid able to supply it.', focus: [MAPS[3], MAPS[4], MAPS[5], MAPS[6]] },
        { nl: 'Elk station is een module met vier niveaus per onderwerp. Begin bij wat jouw lijn het meest raakt.', en: 'Each station is a module with four levels per topic. Start with what touches your line most.', focus: MAPS },
      ],
    },
  ],
  skip: [],
  strictFocus: true,
};

// ---------------------------------------------------------------- the narration
// What the voice says, per scene and beat: the high-over picture, each thing said once. Short sentences, few colons and
// comma lists, no symbols the voice would read aloud and nothing in parentheses (the kit's narration guard,
// checkNarration, holds every field film to that; the render guard caps a pause inside a sentence at 0.4 s). Words
// checked with espeak-ng phonemes through Piper's own bridge (nl_NL-alex): see the SAY group of this film (the last of
// the Dutch list in films/_kit/timeline.mjs), if it needed one.
const SAY = [
  [ // s1 the opening
    { nl: 'Lijn 3 in hal B verhuist. Op de nieuwe plek heeft hij meer stroom nodig.',
      en: 'Line 3 in hall B is moving. At its new place it needs more power.' },
    { nl: 'Het net levert de stroom. Via kast, transformator en schakelbord gaat hij naar de machines.',
      en: 'The grid supplies the power. Through cabinet, transformer and switchboard it reaches the machines.' },
    { nl: 'Jij bent de engineer. Je volgt de stroom van het net tot de lijn.',
      en: 'You are the engineer. You follow the power from the grid to the line.' },
    { nl: 'Dat zijn zeven stations. Van het net en het schakelen tot de bedrijfsvoering en de planning.',
      en: 'That makes seven stations. From the grid and switching to operations and planning.' },
  ],
  [ // s2 gridbasics
    { nl: 'Het eerste station is het elektriciteitsnet. Het brengt de stroom van hoogspanning tot in de hal.',
      en: 'The first station is the electricity grid. It brings the power from high voltage into the hall.' },
    { nl: 'Op hoogspanning gaat weinig verloren. Dicht bij de fabriek gaat de spanning stap voor stap omlaag.',
      en: 'At high voltage little is lost. Close to the plant the voltage steps down.' },
    { nl: 'Je kijkt op de {t:Capaciteitskaart|capaciteitskaart} en sluit zo nodig een {t:Flexibel contract|flexibel contract}.',
      en: 'You check the {t:Capacity map|capacity map} and sign a {t:Flexible contract|flexible contract} if needed.' },
    { nl: 'Zonder dit sta je in een vol gebied in de wachtrij voor stroom.',
      en: 'Without this you wait in a queue for power in a full area.' },
  ],
  [ // s3 switchgear
    { nl: 'Het tweede station is schakelinstallaties en beveiliging. De kast schakelt en bewaakt de stroom.',
      en: 'The second station is switchgear and protection. The cabinet switches and guards the power.' },
    { nl: 'Bij een kortsluiting schakelt alleen de schakelaar die er het dichtst bij zit uit.',
      en: 'In a short circuit only the breaker closest to the fault trips.' },
    { nl: 'De installateur stelt een {t:Beveiligingsrelais|beveiligingsrelais} in. En hij werkt met een {t:Aardgarnituur|aardgarnituur}.',
      en: 'The installer sets a {t:Protection relay|protection relay}. And he works with an {t:Earthing set|earthing set}.' },
    { nl: 'Zonder dit legt één fout de hele hal stil. Of is werken aan de kast niet veilig.',
      en: 'Without this one fault shuts down the whole hall. Or work on the cabinet is not safe.' },
  ],
  [ // s4 transformers
    { nl: 'Het derde station is transformatoren en kabels. De transformator zet de spanning om voor de machines.',
      en: 'The third station is transformers and cables. The transformer converts the voltage for the machines.' },
    { nl: 'Warmte laat hem sneller verouderen. Daarom koelen ribben hem. Een kabel voert naar het schakelbord.',
      en: 'Heat ages it faster. So ribs cool it. A cable leads on to the switchboard.' },
    { nl: 'Je test de olie met een {t:DGA|DGA}. Kabelfouten zoek je met een {t:Reflectiemeter|reflectiemeter}.',
      en: 'You test the oil with a {t:DGA|DGA}. You find cable faults with a {t:Reflectometer|reflectometer}.' },
    { nl: 'Zonder dit raakt de transformator oververhit. Of valt een kabel zonder waarschuwing uit.',
      en: 'Without this the transformer overheats. Or a cable fails without warning.' },
  ],
  [ // s5 power
    { nl: 'Het vierde station is motoren en perslucht. De motor drijft de band van lijn 3 aan.',
      en: 'The fourth station is motors and fluid power. The motor drives the belt of line 3.' },
    { nl: 'De compressor perst lucht voor de lijn. Dat is dure energie. En lekken kosten stroom.',
      en: 'The compressor squeezes air for the line. It is costly energy. And leaks waste power.' },
    { nl: 'Je meet de motorstroom met een {t:Stroomtang|stroomtang}. En je doet een {t:Lektest|lektest} op de perslucht.',
      en: 'You measure the motor current with a {t:Clamp meter|clamp meter}. And you run a {t:Leak test|leak test} on the air.' },
    { nl: 'Zonder dit lekt de perslucht weg. En draait een te grote motor op halve kracht.',
      en: 'Without this the air leaks away. And an oversized motor runs at half load.' },
  ],
  [ // s6 fluids
    { nl: 'Het vijfde station is pompen, stroming en warmte. Een pomp voert het product uit de tank naar de vuleenheid.',
      en: 'The fifth station is pumps, flow and heat. A pump feeds the product from the tank to the filling unit.' },
    { nl: 'Pomp en leiding samen leggen het debiet vast. Een warmtewisselaar geeft warmte door zonder te mengen.',
      en: 'Pump and pipe together fix the flow. A heat exchanger passes on heat without mixing.' },
    { nl: 'Je leest de {t:Pompkarakteristiek|pompkarakteristiek}. En je kiest een {t:Platenwarmtewisselaar|platenwarmtewisselaar}.',
      en: 'You read the {t:Pump curve|pump curve}. And you pick a {t:Plate heat exchanger|plate heat exchanger}.' },
    { nl: 'Zonder dit draait de pomp op het verkeerde punt. En gaat energie verloren.',
      en: 'Without this the pump runs at the wrong point. And energy is lost.' },
  ],
  [ // s7 gridops
    { nl: 'Het zesde station is netbedrijf en assetmanagement. De netbeheerder levert de aansluiting van lijn 3.',
      en: 'The sixth station is grid operations and assets. The grid operator delivers the connection for line 3.' },
    { nl: 'Daarna bewaakt hij het net, herstelt storingen en stuurt bij als het vol zit.',
      en: 'After that he watches the grid, fixes outages and steers when it is full.' },
    { nl: 'Je krijgt een {t:Offerte|offerte}. En het netbedrijf werkt met een {t:Schakelplan|schakelplan}.',
      en: 'You get an {t:Offer|offer}. And the grid operator works with a {t:Switching plan|switching plan}.' },
    { nl: 'Zonder dit duurt de aansluiting langer. En valt de stroom bij werk onverwacht uit.',
      en: 'Without this the connection takes longer. And the power drops unexpectedly during work.' },
  ],
  [ // s8 gridplanning
    { nl: 'Het zevende station is netplanning en de energietransitie. De planner kijkt hoeveel stroom er later nodig is.',
      en: 'The seventh station is grid planning and the transition. The planner looks at how much power is needed later.' },
    { nl: 'Er komt steeds meer vraag bij. Dus rekent hij uit waar en wanneer het net te vol raakt.',
      en: 'Demand keeps growing. So he works out where and when the grid gets too full.' },
    { nl: 'Hij draait een {t:Loadflow|loadflow}. En hij weegt {t:Aftoppen|aftoppen} af tegen bouwen.',
      en: 'He runs a {t:Load flow|load flow}. And he weighs {t:Clipping|clipping} against building.' },
    { nl: 'Zonder dit komt de verzwaring te laat. En wacht de volgende lijn op stroom.',
      en: 'Without this the upgrade comes too late. And the next line waits for power.' },
  ],
  [ // s9 the map
    { nl: 'Dit is de hele kaart. De zeven stations van Energie en het net liggen in één gebied.',
      en: 'This is the whole map. The seven stations of Energy and the grid lie in one zone.' },
    { nl: 'Eerst het elektriciteitsnet. Daar gaat het om vermogen, het net van hoog naar laag, regels en netcongestie.',
      en: 'First the electricity grid. It covers power, the grid from high to low, rules and congestion.' },
    { nl: 'Dan schakelinstallaties en beveiliging. Daar gaat het om schakelapparaten, stations, beveiliging en veilig schakelen.',
      en: 'Then switchgear and protection. It covers switching devices, stations, protection and safe switching.' },
    { nl: 'Dan transformatoren en kabels. Daar gaat het om de transformator, conditie, kabelstoringen en aansluitingen.',
      en: 'Then transformers and cables. It covers the transformer, condition, cable faults and connections.' },
    { nl: 'Dan motoren en perslucht. Daar gaat het om energie in de fabriek, motoren, aandrijvingen en perslucht.',
      en: 'Then motors and fluid power. It covers plant energy, motors, drives and compressed air.' },
    { nl: 'Dan pompen, stroming en warmte. Daar gaat het om leidingen, pompen, warmtewisselaars en stoom.',
      en: 'Then pumps, flow and heat. It covers pipes, pumps, heat exchangers and steam.' },
    { nl: 'Dan netbedrijf en assetmanagement. Daar gaat het om aansluiten, werk in het veld, storingen en congestiemanagement.',
      en: 'Then grid operations and assets. It covers connecting, field work, outages and congestion management.' },
    { nl: 'Tot slot netplanning en de energietransitie. Daar gaat het om belasting, netontwerp, investeren en flexibiliteit.',
      en: 'Finally grid planning and the transition. It covers load, grid design, investing and flexibility.' },
    { nl: 'Zo hangen ze samen. Het net levert, de schakelinstallatie beveiligt en de transformator zet de spanning om.',
      en: 'That is how they connect. The grid supplies, the switchgear protects and the transformer converts the voltage.' },
    { nl: 'Motoren en pompen gebruiken de stroom. Netbedrijf en planning zorgen dat het net blijft leveren.',
      en: 'Motors and pumps use the power. Operations and planning keep the grid able to supply it.' },
    { nl: 'Elk station is een module met vier niveaus per onderwerp. Begin bij wat jouw lijn het meest raakt.',
      en: 'Each station is a module with four levels per topic. Start with what touches your line most.' },
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
.pm-acc{fill:none;stroke:var(--fp-accent);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link,[data-cue][data-on] .pm-road{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-out,.pm-dot,.pm-solid){stroke:var(--fp-accent)}
[data-cue][data-on] .pm-cross{stroke:var(--fp-accent)}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as the pilot) */
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="installer"]:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="installer"]:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');

const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 op zijn nieuwe plek draait. Langs de achterwand van links naar rechts de stroomkast, een transformator met koelribben, een tank met een leiding en pomp naar een vuleenheid boven het begin van de band van lijn 3, en rechts boven de lijn het schakelbord. Door de linkerwand komt de kabel van het net binnen; een kabel loopt van de kast naar de transformator en vanaf de transformator langs de muur naar het schakelbord. Voor de band staat een motor die de band aandrijft, rechtsvoor een compressor met een slang naar de lijn. Een installateur staat bij de kast en jij, de engineer, staat in het midden. Rechts een paneel, gemarkeerd als voorbeeld of schema. Eerst de verhuizing van lijn 3 en de stroom die erbij moet, dan de keten van net tot machine, de route en de weg met zeven stations. Dan per station een schema, twee namen van hulpmiddelen en, gestippeld, wat er misgaat zonder: bij het elektriciteitsnet de spanningsniveaus en een capaciteitskaart en een flexibel contract; bij schakelinstallaties en beveiliging een schakelaar, een beveiligingsrelais en een aardgarnituur; bij transformatoren en kabels een transformator, gas-in-olie-analyse en een reflectiemeter; bij motoren en perslucht een motor, een compressor, een stroomtang en een lektest; bij pompen, stroming en warmte een pomp met pompkarakteristiek en een platenwarmtewisselaar; bij netbedrijf en assetmanagement een aanvraag, een offerte en een schakelplan; bij netplanning een loadflow en aftoppen. Aan het eind de kaart van Engineering: eerst het hele net van vier gebieden, dan het gebied Energie en het net met de zeven stations verlicht, dan plek voor plek van dichtbij, en weer het gebied.',
  en: 'Hall B of the plant, where line 3 runs at its new place. Along the back wall from left to right the power cabinet, a transformer with cooling ribs, a tank with a pipe and a pump to a filling unit over the start of the belt of line 3, and at the right above the line the switchboard. The cable from the grid comes in through the left wall; a cable runs from the cabinet to the transformer and from the transformer along the wall to the switchboard. In front of the belt stands a motor that drives it, at the front right a compressor with a hose to the line. An installer stands by the cabinet and you, the engineer, stand in the middle. At the right a panel, marked as an example or a diagram. First the move of line 3 and the power it needs, then the chain from grid to machine, the route and the road with seven stations. Then per station a schema, two names of tools and, dashed, what goes wrong without it: at the electricity grid the voltage levels and a capacity map and a flexible contract; at switchgear and protection a switch, a protection relay and an earthing set; at transformers and cables a transformer, dissolved gas analysis and a reflectometer; at motors and fluid power a motor, a compressor, a clamp meter and a leak test; at pumps, flow and heat a pump with its pump curve and a plate heat exchanger; at grid operations and assets a request, an offer and a switching plan; at grid planning a load flow and clipping. At the end the map of Engineering: first the whole map of four zones, then the zone Energy and the grid with the seven stations lit, then place by place up close, and the zone again.',
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

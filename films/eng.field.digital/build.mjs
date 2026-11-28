// Dev tool, not shipped. Builds the field film "Automatisering en IT / Automation and IT"
// (eng.field.digital), the third Engineering field film (v17, Task 13): the level above the
// module intros. It places the five modules of the zone (FIELDS in
// src/content/courses/index.js: itbasics, ot, cyber, lines, industry40) on one road and says,
// per station, what it is for, what the part of the story needs from it, which two tools of
// the module you use there (named, not explained: the checkpoint rule of 14 Nov) and what goes
// wrong without it. The map, not a lesson: no calculations, no numbers.
//
//   node films/eng.field.digital/build.mjs            build the page
//   node films/eng.field.digital/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.field.digital.html: one offline page with the anatomy
// kit, the stage script and the player inlined. The index names it (the field's `film`),
// sw.js precaches it.
//
// The story continues eng.field.making and pm.field.it: the new filling unit stands ready on
// line 3 in hall B (a steel frame, a plate over the belt, a plastic cover, the tank behind it)
// and the plant's MES (the laptop on the table at the front, pm.field.it's new system for the
// orders on the floor) has to send it orders and get the counts back. You, the engineer,
// connect the unit step by step. Each station is one step of that connection:
//   s1 the opening: the unit is ready; the MES sends orders and gets counts back; you connect
//      it in five steps; the road with five stations
//   s2 IT-fundamenten (eng.itbasics): the unit joins the plant network through the network
//      cabinet (an address, like a house number, and a cable to the switch); a switch and a
//      VLAN (eng.itbasics.ipaddress, .vlan); without it the order does not find the unit, or
//      the line sits on the office network
//   s3 IT/OT op de fabrieksvloer (eng.ot): the PLC in the cabinet at the unit controls it;
//      orders go down to the PLC, confirmations up to the MES; an OPC server and tags
//      (eng.ot.opcua, .historian); without it the MES does not know what the line makes
//   s4 Cybersecurity (eng.cyber): an attack on the office must not stop line 3; the line gets
//      its own zone (the marked floor) with one guarded link (the gate on the cable); zones
//      and conduits (eng.cyber.zones); without it an infection from the office stops the line
//   s5 Lijnen en automatisering (eng.lines): the line itself, where cartons arrive and get
//      filled; the unit only fills when a carton stands under the plate (the sensor pair
//      across the belt); poka-yoke and an interlock (eng.lines.errors, .pokayoke); without it
//      product runs onto the belt
//   s6 Data en digitale productie (eng.industry40): the unit's numbers go to the MES and to a
//      screen by the line; an edge gateway and a dashboard (eng.industry40.machinedata, .kpi);
//      without it the numbers come too late or are wrong (timeliness, accuracy)
//   s7 the shared Engineering map (the kit's mapScene, as the app draws it) with the five
//      stations lit: the whole map, the zone, then place by place at 1.5, then back to the
//      zone for two beats on how they connect, and where to start
// How the stations connect: the order of the road is the order of the zone (level, then map
// position), the connection runs network (itbasics), systems on it (ot), the guard around the
// line (cyber), the line itself (lines) and what its numbers become (industry40); the closing
// says it in two beats.
// The tools come from the modules' own lessons (checked below), each a term of the lesson's
// glossary that no other module of the zone has as a term of its own, at Basis or Working
// knowledge level, and none that pm.field.it names (pipeline, feature flag, kanban board,
// planning poker, PI Planning, WSJF, MoSCoW, cutover plan). OPC UA and the historian sit in
// two modules (eng.ot and eng.industry40), the PLC in three: so the OT station names the
// OPC server and tags, the lines station poka-yoke and the interlock (the sensor is drawn and
// said, not named as a tool), and the PLC is the thing on the wall, never a tool. Terms come
// from the field's lessons (the kit's field mode, films/_kit/build-film.mjs); the kit holds
// the film to its road (every module named in a caption of its own scene, in the order of the
// road, explained in two beats and lit, ending on the map with the field's places lit), to the
// narration guard and to the label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): the person of the cast, the
// table and the laptop of the MES, the room, and the conveyor, cabinet, cable and marked floor
// of hall B from the pilot (films/pm.plan.intro/hall.mjs), imported. A panel at the right draws
// each station as four small schemas (what it is for, how it works, then one for each tool as
// it is named), two chips with the tools and a dashed card with what goes wrong without it.
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
const FIELD = FIELDS.find((f) => f.id === 'eng.field.digital');
const ROAD = ['eng.itbasics', 'eng.ot', 'eng.cyber', 'eng.lines', 'eng.industry40'];
assert(JSON.stringify(FIELD.modules) === JSON.stringify(ROAD), 'the digital field is the road itbasics, ot, cyber, lines, industry40');
// the panel heading draws the module's title in at most two lines of the panel's width (the kit does not measure it)
for (const id of ROAD) for (const lang of ['nl', 'en']) {
  const t = MODULES.find((m) => m.id === id).title[lang];
  const lines = wrapUnits(t, 284, CHAR_W);
  assert(lines.length <= 2 && lines.every((ln) => ln.split(' ').every((wd) => wrapUnits(wd, 284, CHAR_W).length === 1)), `the heading "${t}" (${lang}) does not fit two lines of 284 units`);
}
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s2 itbasics: every device has an IP address like a house number; the network cabinet with its switches; the switch connects devices in one LAN; a VLAN splits one network into separate ones
has('eng.itbasics.ipaddress', ['Elk apparaat op een netwerk heeft een IP-adres', 'Het werkt als een huisnummer', 'een netwerkkast met knipperende switches', 'Switch Netwerkkastje met veel poorten dat apparaten binnen hetzelfde LAN verbindt']);
has('eng.itbasics.ipaddress', ['Every device on a network has an IP address', 'It works like a house number', 'a network cabinet with blinking switches', 'Switch Network box with many ports that connects devices within the same LAN'], 'en');
has('eng.itbasics.vlan', ['Een VLAN (virtual LAN) knipt één fysiek netwerk op in meerdere gescheiden netwerken', 'het kantoor-VLAN', 'het productie-VLAN', 'VLAN Virtual LAN']);
has('eng.itbasics.vlan', ['A VLAN (virtual LAN) splits one physical network into several separate networks', 'the office VLAN', 'the production VLAN', 'VLAN Virtual LAN'], 'en');
// s3 ot: the PLC sits at level 2 and the MES at level 3; orders down, confirmations up; the OPC server runs in the PLC; a tag is one named value
has('eng.ot.levels', ['Hier hoort de PLC (programmable logic controller)', 'Niveau 3 stuurt de productie', 'de PLC in de besturingskast']);
has('eng.ot.levels', ['This is where the PLC (programmable logic controller) belongs', 'Level 3 runs production', 'the PLC in the control cabinet'], 'en');
has('eng.ot.orderflow', ['Kort: orders omlaag, terugmeldingen omhoog', 'Omhoog: de PLC telt, het MES verzamelt tellingen, afkeur en stilstand']);
has('eng.ot.orderflow', ['In short: orders down, confirmations up', 'Up: the PLC counts, the MES collects counts, scrap and downtime'], 'en');
has('eng.ot.opcua', ['De OPC-server draait in de PLC, de machine of een gateway en biedt de data aan', 'OPC-server Software in de PLC']);
has('eng.ot.opcua', ['The OPC server runs in the PLC, the machine or a gateway and offers the data', 'OPC server Software in the PLC'], 'en');
has('eng.ot.historian', ['Een tag is één benoemde meetwaarde of status uit de besturing', 'de teller van pers 2', 'Tag Eén benoemde meetwaarde']);
has('eng.ot.historian', ['A tag is one named measurement or status from the control system', 'the counter of press 2', 'Tag One named measurement'], 'en');
// s4 cyber: availability comes first in a plant and ransomware hits it; keep office and control apart; a zone is a group of devices, one line; a conduit is the connection between two zones, the fewer the better
has('eng.cyber.cia', ['In de fabriek gaan beschikbaarheid en veiligheid voor', 'Ransomware (software die bestanden versleutelt voor losgeld) raakt de beschikbaarheid', 'Daarom staat het OT-netwerk apart']);
has('eng.cyber.cia', ['In the plant, availability and safety come first', 'Ransomware (software that encrypts files for a ransom) hits availability', 'That is why the OT network is kept separate'], 'en');
has('eng.cyber.zones', ['Houd kantoor (IT) en besturing (OT) gescheiden', 'Een conduit is de verbinding tussen twee zones', 'Hoe minder conduits, hoe minder er te beheren valt', 'Zone Groep apparaten met dezelfde beveiligingseisen, zoals één productielijn', 'Conduit Gecontroleerde verbinding tussen twee zones']);
has('eng.cyber.zones', ['Keep the office (IT) and control (OT) apart', 'A conduit is the connection between two zones', 'The fewer conduits, the less there is to manage', 'Zone Group of devices with the same security requirements, such as one production line', 'Conduit Controlled connection between two zones'], 'en');
// s5 lines: a mistake becomes a defect unless it is caught; poka-yoke makes it impossible or stops it; a sensor notices a missing part and blocks the next step; the interlock is a rule in the PLC that allows the next step only when the checks are OK
has('eng.lines.errors', ['Een stop zet het proces stil', 'Poka-yoke Foutvrij maken: een vergissing onmogelijk maken, of hem meteen vangen en stoppen']);
has('eng.lines.errors', ['A stop halts the process', 'Poka-yoke Error-proofing: making a mistake impossible, or catching it at once and stopping'], 'en');
has('eng.lines.pokayoke', ['een sensor ziet dat de clip ontbreekt en blokkeert de volgende stap', 'een foto-elektrische sensor stuurt een lichtstraal en merkt het als iets die onderbreekt', 'De interlock maakt het af: een regel in de PLC die de volgende stap pas toelaat als alle checks OK zijn', 'Interlock Een regel in de PLC die de volgende stap blokkeert']);
has('eng.lines.pokayoke', ['a sensor sees the clip is missing and blocks the next step', 'a photoelectric sensor sends a light beam and notices when something breaks it', 'The interlock makes it work: a rule in the PLC that only allows the next step when all checks are OK', 'Interlock A rule in the PLC that blocks the next step'], 'en');
// s6 industry40: the edge gateway reads the machine's data, buffers it and forwards it; a dashboard is a screen of the most important information, followed at a glance; timeliness and accuracy are dimensions of data quality
has('eng.industry40.machinedata', ['Een edge gateway, een kleine industriële computer bij de machines, leest de data uit, buffert ze als het netwerk wegvalt, en stuurt ze door', 'Edge gateway Kleine computer bij de machines die hun data uitleest, buffert en doorstuurt']);
has('eng.industry40.machinedata', ['An edge gateway, a small industrial computer near the machines, reads the data, buffers it when the network drops, and forwards it', 'Edge gateway Small computer near the machines that reads, buffers and forwards their data'], 'en');
has('eng.industry40.kpi', ['een visuele weergave van de belangrijkste informatie die nodig is om een of meer doelen te halen, op één scherm', 'Dashboard Een visuele weergave van de belangrijkste informatie']);
has('eng.industry40.kpi', ['a visual display of the most important information needed to reach one or more objectives, arranged on a single screen', 'Dashboard A visual display of the most important information'], 'en');
has('eng.industry40.dimensions', ['Tijdigheid Of de data beschikbaar zijn op het moment dat de beslissing valt', 'Juistheid Of een waarde klopt met wat er in werkelijkheid gebeurde']);
has('eng.industry40.dimensions', ['Timeliness Whether data are available when the decision that needs them is made', 'Accuracy Whether a value matches what really happened'], 'en');
// the pm.field.it MES: the system on the floor that runs orders per line and records what is made, used and scrapped
has('pm.itproject.rollout', ['Een MES is het systeem op de vloer dat de orders per lijn aanstuurt en registreert wat er gemaakt, verbruikt en afgekeurd wordt']);

// ---------------------------------------------------------------- the world (hall B: the filling unit on line 3, its cabinets, the zone and the MES)
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

// where things stand (cm): the filling unit of eng.field.making over the start of line 3's belt (two uprights and a
// beam, a plate hung from the beam above the cartons, a plastic cover on top, the tank at the back wall at the left
// with its pipe into the plate), as tall as a person. New here: the PLC cabinet at the back wall between tank and belt
// (it controls the unit), the network cabinet in the back left corner (the switch), a cable from it to the PLC cabinet
// and on to the MES, a guard at the point where that cable enters the line's own zone (the marked floor), a pair of
// photo-eyes across the belt at the carton under the plate, an edge box on top of the PLC cabinet and a screen on the
// back wall at the right. The table with the MES laptop stands at the front left, you at the front right.
const BELT = { x: 130, y: 16, len: 130, dep: 34 };
const UX = 152; // x of the uprights and the beam
const FRAME = { top: 150, beam: 160 };
const PLATE = { z0: 100, z1: 146 }; // the filling head: its foot clears the cartons (60 to 80)
const TANK = { x: 62, y: 34, r: 20, h: 130 };
const PIPE = { y: 28, z: 118 };
const TABLE = { x: 18, y: 108, w: 76, d: 42, h: 74 };
const ZONE = { x: 26, y: 2, w: 264, d: 70 }; // the line's own zone: a slab of floor with a dashed outline
const PLC = { x: 96, w: 30, d: 20, h: 112 };
const NET = { x: 4, w: 20, d: 18, h: 124 };
const GATE = { x: 29, y: 55, w: 10, d: 10 }; // where the cable enters the zone (the outline's west edge is at x 34)
const EYE = { x: 181, y0: 10, y1: 56, z: 76 }; // the pair of photo-eyes at the carton under the plate
const CABLE = [[[14, 19], [14, 60], [111, 60], [111, 21]], [[14, 60], [14, 126], [18, 126]]];
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
// the network cabinet: a tall cabinet with a panel of ports (the switch) on its door
const netcab = hall.cabinet({ x: NET.x, w: NET.w, d: NET.d, h: NET.h })
  + w.box({ x: NET.x + 3, y: NET.d, w: 14, d: 1.2, r: 0.4 }, 86, 100, { tone: 'lo' }, { steps: 1 })
  + k.dotsSvg([0, 1, 2, 3, 4, 5].map((i) => at([NET.x + 5 + (i % 3) * 5, NET.d + 1.5, 90 + Math.floor(i / 3) * 6])), { size: 1.1, tone: 'hi' });
// the pair of photo-eyes: a post with an eye on each side of the belt and a dashed beam between them at the carton
const eyes = w.post(EYE.x, EYE.y0, 3, 0, EYE.z, { tone: 'lo' }, 12) + w.box({ x: EYE.x - 4, y: EYE.y0 - 4, w: 8, d: 8, r: 1.5 }, EYE.z, EYE.z + 10, { tone: 'hi' }, { steps: 2 })
  + w.post(EYE.x, EYE.y1, 3, 0, EYE.z, { tone: 'lo' }, 12) + w.box({ x: EYE.x - 4, y: EYE.y1 - 4, w: 8, d: 8, r: 1.5 }, EYE.z, EYE.z + 10, { tone: 'hi' }, { steps: 2 })
  + k.lineSvg(k.pathOf([at([EYE.x, EYE.y0 + 4, EYE.z + 5]), at([EYE.x, EYE.y1 - 4, EYE.z + 5])]), { tone: 'hi', dashed: true });
// the edge box on top of the PLC cabinet and the screen on the back wall: bars of what is made and a target line
const edge = w.box({ x: PLC.x + 4, y: 0, w: 22, d: 9, r: 1 }, PLC.h + 6, PLC.h + 24, { tone: 'hi' }, { steps: 2 })
  + k.dotsSvg([0, 1, 2].map((i) => at([PLC.x + 9 + i * 6, 9.4, PLC.h + 15])), { size: 1.2, tone: 'mid' });
const SCR = { x0: 196, x1: 262, z0: 112, z1: 168 };
const bars = [12, 22, 17, 30].map((h, i) => `<path class="pm-cell" d="${w.rectD(SCR.x0 + 8 + i * 13, -(SCR.z0 + 6 + h), SCR.x0 + 17 + i * 13, -(SCR.z0 + 6))}"/>`).join('');
const screen = w.box({ x: SCR.x0, y: 0, w: SCR.x1 - SCR.x0, d: 3.4, r: 1 }, SCR.z0, SCR.z1, { tone: 'mid' }, { steps: 2, bevel: 0.4 })
  + `<g transform="${w.planeY(3.6)}"><path class="pm-board" d="${w.rectD(SCR.x0 + 3, -(SCR.z1 - 3), SCR.x1 - 3, -(SCR.z0 + 3))}"/>${bars}`
  + `<path class="pm-rule" style="stroke-width:1" d="M${SCR.x0 + 6} ${-(SCR.z0 + 24)}H${SCR.x1 - 6}"/></g>`;
const gate = w.box({ x: GATE.x, y: GATE.y, w: GATE.w, d: GATE.d, r: 1.5 }, 0, 22, { tone: 'hi' }, { steps: 2, bevel: 0.5 })
  + k.dotsSvg([at([GATE.x + 5, GATE.y + GATE.d + 0.3, 14])], { size: 1.6, tone: 'mid' });
const cablePath = (dashed) => CABLE.map((pts) => hall.cable(pts, { dashed })).join('');
const person = (role, x, y, along) => w.person({ x, y, role, along });

const world = [
  w.room(ROOM),
  // each thing appears in the scene of its station (the stage script shows the groups o-*), so every drawn detail
  // meets its reason in the narration: the network cabinet, its cable and the control cabinet at the second scene,
  // the zone and its guard at the fourth, the photo-eyes at the fifth, the edge box and the screen at the sixth
  g('o-zone', cueG('zone', hall.floorMark(ZONE))),
  cueG('line3', hall.conveyor({ ...BELT, cartons: 4 })),
  cueG('tank', tank),
  cueG('unit', frame + plate + cover),
  g('o-net', cueG('netcab', netcab) + cueG('plc', hall.cabinet({ x: PLC.x, w: PLC.w, d: PLC.d, h: PLC.h })) + cueG('cable', cablePath(false))),
  g('o-gate', cueG('conduit', gate)),
  g('o-eye', cueG('sensor', eyes)),
  g('o-data', cueG('edge', edge) + cueG('screen', screen)),
  cueG('mes', w.table(TABLE) + w.laptop({ x: TABLE.x + TABLE.w / 2, y: TABLE.y + TABLE.d / 2, z: TABLE.h, toward: 1 })),
  g('pp-jij', person('jij', 262, 128, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group (data-cue), filled by the stage script each frame
// (data-k). The road holds the five stations, one cue group each (st-<slug>): in s1 a row with its number and
// title, in s2 to s6 a numbered square of the strip under the heading. The shared Engineering map (mapScene,
// the five stations lit) replaces the room and the panel in the last scene; its places are cue groups of their
// own (map-<slug>).
const STATION_CUE = Object.fromEntries(ROAD.map((id) => [id, `st-${id.split('.')[1]}`]));
const stations = ROAD.map((id, i) => cueG(STATION_CUE[id], g(`rd${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('road', g('roadB', '') + stations)
  + cueG('flow', g('flowB', '')) + cueG('orders', g('ordersB', '')) + cueG('route', g('routeB', '')) + cueG('for', g('forB', ''))
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
assert(ZBAND[1] > ZBAND[0] && MAPZ.every(([, y]) => y > ZBAND[0] && y < ZBAND[1]), 'the five places lie inside the digital zone');
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
  { from: cam(150, 70, 70, 1), to: cam(150, 70, 70, 1.08) }, // s1 the hall: the unit on line 3, the tank, the MES table
  { from: cam(70, 60, 60, 1.25), to: cam(70, 60, 60, 1.38) }, // s2 the network cabinet, the cable to the PLC cabinet and on to the MES
  { from: cam(100, 70, 70, 1.2), to: cam(100, 70, 70, 1.3) }, // s3 the PLC cabinet at the unit, the MES at the front
  { from: cam(150, 55, 40, 1.05), to: cam(150, 55, 40, 1.15) }, // s4 the zone: the marked floor and the guard on the cable
  { from: cam(168, 35, 80, 1.7), to: cam(168, 35, 80, 1.9) }, // s5 the belt, the carton under the plate, the photo-eyes
  { from: cam(150, 70, 80, 1.05), to: cam(150, 70, 80, 1.12) }, // s6 the edge box, the screen and the MES
  { from: cam(150, 85, 60, 1), to: cam(150, 85, 60, 1) }, // s7 (the map)
];

// ---------------------------------------------------------------- the film
const MAPS = ROAD.map(mapCue);
// the two tools of a station: the chips of the panel, plus the parts of the room they belong to
const TOOLCUE = (a, b, room = []) => ({ cue: { [a]: 't1', [b]: 't2' }, focus: ['t1', 't2', ...room] });
const DURS = Array(7).fill(30);
const spec = {
  id: 'eng.field.digital',
  title: { nl: 'Automatisering en IT', en: 'Automation and IT' },
  field: 'eng.field.digital',
  // the road: per module of the field, the scene that explains it and its station on the road
  stations: Object.fromEntries(ROAD.map((id, i) => [id, { scene: `s${i + 2}`, cue: STATION_CUE[id] }])),
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'De vuleenheid aansluiten', en: 'Connecting the filling unit' },
      beats: [
        { nl: 'De nieuwe vuleenheid van lijn 3 staat klaar. Hij vult de dozen met product uit de tank.', en: 'The new filling unit of line 3 is ready. It fills the cartons with product from the tank.', focus: ['flow', 'unit', 'tank', 'line3'] },
        { nl: 'Het nieuwe MES van het IT-team stuurt hem orders en krijgt tellingen terug.', en: 'The new MES from the IT team sends it orders and gets counts back.', focus: ['orders', 'mes', 'unit'] },
        { nl: 'Jij bent de engineer en sluit de eenheid stap voor stap aan.', en: 'You are the engineer and connect the unit step by step.', focus: ['route', 'jij', 'unit'] },
        { nl: 'Vijf stations: netwerk, OT, beveiliging, de lijn zelf en data.', en: 'Five stations: network, OT, security, the line itself and data.', focus: 'road' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'IT-fundamenten', en: 'IT fundamentals' },
      beats: [
        { nl: 'Het eerste station is IT-fundamenten. De besturingskast moet via de netwerkkast op het netwerk.', en: 'The first station is IT fundamentals. The control cabinet must join the network via the network cabinet.', focus: ['st-itbasics', 'for', 'netcab', 'plc'] },
        { nl: 'Elk apparaat heeft een adres, als een huisnummer. Berichten gaan naar dat adres.', en: 'Every device has an address, like a house number. Messages go to that address.', focus: ['for', 'cable', 'plc'] },
        { nl: 'Je gebruikt een {t:Switch|switch} en een {t:VLAN|VLAN}.', en: 'You use a {t:Switch|switch} and a {t:VLAN|VLAN}.', ...TOOLCUE('Switch', 'VLAN', ['netcab']) },
        { nl: 'Zonder dit vindt een order de eenheid niet, of zit de lijn op het kantoornetwerk.', en: 'Without this an order does not find the unit, or the line sits on the office network.', focus: 'without' },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'IT/OT op de fabrieksvloer', en: 'IT/OT on the shop floor' },
      beats: [
        { nl: 'Het tweede station is IT/OT op de fabrieksvloer. De PLC in de besturingskast stuurt de eenheid aan.', en: 'The second station is IT/OT on the shop floor. The PLC in the control cabinet controls the unit.', focus: ['st-ot', 'for', 'plc', 'unit'] },
        { nl: 'Orders gaan omlaag naar de PLC. Terugmeldingen gaan omhoog naar het MES.', en: 'Orders go down to the PLC. Confirmations go up to the MES.', focus: ['for', 'plc', 'mes'] },
        { nl: 'Je richt een {t:OPC-server|OPC-server} en {t:Tag|tags} in.', en: 'You set up an {t:OPC server|OPC server} and {t:Tag|tags}.', ...TOOLCUE('OPC-server', 'Tag', ['plc']) },
        { nl: 'Zonder dit weet het MES niet wat de lijn maakt.', en: 'Without this the MES does not know what the line makes.', focus: 'without' },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Cybersecurity', en: 'Cybersecurity' },
      beats: [
        { nl: 'Het derde station is Cybersecurity. Een aanval op kantoor mag lijn 3 niet stilzetten.', en: 'The third station is Cybersecurity. An attack on the office must not stop line 3.', focus: ['st-cyber', 'for', 'line3'] },
        { nl: 'Lijn 3 krijgt een eigen zone, met één bewaakte verbinding naar de rest.', en: 'Line 3 gets its own zone, with one guarded link to the rest.', focus: ['for', 'zone', 'conduit'] },
        { nl: 'Je legt {t:Zone|zones} en {t:Conduit|conduits} vast.', en: 'You define {t:Zone|zones} and {t:Conduit|conduits}.', ...TOOLCUE('Zone', 'Conduit', ['zone', 'conduit']) },
        { nl: 'Zonder dit kan een besmetting van kantoor de lijn stilleggen.', en: 'Without this an infection from the office can stop the line.', focus: 'without' },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Lijnen en automatisering', en: 'Lines and automation' },
      beats: [
        { nl: 'Het vierde station is Lijnen en automatisering. Dat is de lijn zelf, waar dozen aankomen en worden gevuld.', en: 'The fourth station is Lines and automation. That is the line itself, where cartons arrive and get filled.', focus: ['st-lines', 'for', 'line3', 'unit'] },
        { nl: 'De eenheid mag alleen vullen als een sensor een doos onder de plaat ziet.', en: 'The unit may only fill when a sensor sees a carton under the plate.', focus: ['for', 'sensor', 'unit'] },
        { nl: 'Je gebruikt {t:Poka-yoke|poka-yoke} en een {t:Interlock|interlock}.', en: 'You use {t:Poka-yoke|poka-yoke} and an {t:Interlock|interlock}.', ...TOOLCUE('Poka-yoke', 'Interlock', ['sensor']) },
        { nl: 'Zonder dit loopt product de band op als er geen doos staat.', en: 'Without this product runs onto the belt when no carton is there.', focus: 'without' },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Data en digitale productie', en: 'Data and digital manufacturing' },
      beats: [
        { nl: 'Het vijfde station is Data en digitale productie. Wat lijn 3 maakt, moet iedereen op de vloer kunnen zien.', en: 'The fifth station is Data and digital manufacturing. What line 3 makes has to be visible on the floor.', focus: ['st-industry40', 'for', 'line3', 'screen'] },
        { nl: 'De cijfers van de eenheid gaan naar het MES en naar een scherm bij de lijn.', en: 'The unit’s numbers go to the MES and to a screen by the line.', focus: ['for', 'mes', 'screen'] },
        { nl: 'Je gebruikt een {t:Edge gateway|edge gateway} en een {t:Dashboard|dashboard}.', en: 'You use an {t:Edge gateway|edge gateway} and a {t:Dashboard|dashboard}.', ...TOOLCUE('Edge gateway', 'Dashboard', ['edge', 'screen']) },
        { nl: 'Zonder dit komen de cijfers te laat, of ze kloppen niet.', en: 'Without this the numbers come too late, or they are wrong.', focus: 'without' },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart: de vijf stations van Automatisering en IT liggen in één gebied.', en: 'The whole map: the five stations of Automation and IT lie in one zone.', focus: MAPS },
        { nl: 'Eerst IT-fundamenten: netwerken, cloud, databases en software.', en: 'First IT fundamentals: networks, cloud, databases and software.', focus: MAPS[0] },
        { nl: 'Dan IT/OT op de fabrieksvloer: ISA-95, de systemen en wie wat beheert.', en: 'Then IT/OT on the shop floor: ISA-95, the systems and who owns what.', focus: MAPS[1] },
        { nl: 'Dan Cybersecurity: van de basis tot de wet en incidentrespons.', en: 'Then Cybersecurity: from the basics to the law and incident response.', focus: MAPS[2] },
        { nl: 'Dan Lijnen en automatisering: robots, foutvrij maken en de businesscase.', en: 'Then Lines and automation: robots, error-proofing and the business case.', focus: MAPS[3] },
        { nl: 'Tot slot Data en digitale productie: van datakwaliteit tot AI.', en: 'Finally Data and digital manufacturing: from data quality to AI.', focus: MAPS[4] },
        { nl: 'Zo hangen ze samen: het netwerk verbindt de systemen en de lijn praat daarover met het MES.', en: 'How they connect: the network joins the systems and the line talks over it with the MES.', focus: [MAPS[0], MAPS[1]] },
        { nl: 'Cybersecurity bewaakt die verbinding. De lijn maakt de producten en data laat zien hoe dat gaat.', en: 'Cybersecurity guards that link. The line makes the products and data shows how it goes.', focus: [MAPS[2], MAPS[3], MAPS[4]] },
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
// this film (the last of the Dutch list in films/_kit/timeline.mjs). IT and OT are said as letters, the OPC
// server, PLC, ISA, ERP and the zones and conduits as the rules above or espeak-ng say them.
const SAY = [
  [ // s1 the opening
    { nl: 'De nieuwe vuleenheid op lijn 3 in hal B staat klaar. Hij vult dozen met product uit de tank.',
      en: 'The new filling unit on line 3 in hall B is ready. It fills cartons with product from the tank.' },
    { nl: 'Het nieuwe MES van het IT-team stuurt hem orders en krijgt tellingen terug.',
      en: 'The new MES from the IT team sends it orders and gets counts back.' },
    { nl: 'Jij bent de engineer. Je sluit de eenheid stap voor stap aan.',
      en: 'You are the engineer. You connect the unit step by step.' },
    { nl: 'Dat zijn vijf stations. Van netwerk en OT tot beveiliging, de lijn zelf en data.',
      en: 'That makes five stations. From network and OT to security, the line itself and data.' },
  ],
  [ // s2 itbasics
    { nl: 'Het eerste station is IT-fundamenten. De besturingskast van de eenheid moet via de netwerkkast op het fabrieksnetwerk.',
      en: 'The first station is IT fundamentals. The unit’s control cabinet has to join the plant network via the network cabinet.' },
    { nl: 'Elk apparaat heeft een adres, als een huisnummer. Berichten gaan naar dat adres.',
      en: 'Every device has an address, like a house number. Messages go to that address.' },
    { nl: 'Je gebruikt een {t:Switch|switch} en een {t:VLAN|VLAN}.',
      en: 'You use a {t:Switch|switch} and a {t:VLAN|VLAN}.' },
    { nl: 'Zonder dit vindt een order de eenheid niet, of zit de lijn op het kantoornetwerk.',
      en: 'Without this an order does not find the unit, or the line sits on the office network.' },
  ],
  [ // s3 ot
    { nl: 'Het tweede station is IT en OT op de fabrieksvloer. De PLC in de besturingskast stuurt de eenheid aan.',
      en: 'The second station is IT and OT on the shop floor. The PLC in the control cabinet controls the unit.' },
    { nl: 'Orders gaan omlaag naar de PLC. Terugmeldingen gaan omhoog naar het MES.',
      en: 'Orders go down to the PLC. Confirmations go up to the MES.' },
    { nl: 'Je richt een {t:OPC-server|OPC-server} en {t:Tag|tags} in.',
      en: 'You set up an {t:OPC server|OPC server} and {t:Tag|tags}.' },
    { nl: 'Zonder dit weet het MES niet wat de lijn maakt.',
      en: 'Without this the MES does not know what the line makes.' },
  ],
  [ // s4 cyber
    { nl: 'Het derde station is Cybersecurity. Een aanval op kantoor mag lijn 3 niet stilzetten.',
      en: 'The third station is Cybersecurity. An attack on the office must not stop line 3.' },
    { nl: 'Lijn 3 krijgt een eigen zone, met één bewaakte verbinding naar de rest.',
      en: 'Line 3 gets its own zone, with one guarded link to the rest.' },
    { nl: 'Je legt {t:Zone|zones} en {t:Conduit|conduits} vast.',
      en: 'You define {t:Zone|zones} and {t:Conduit|conduits}.' },
    { nl: 'Zonder dit kan een besmetting van kantoor de lijn stilleggen.',
      en: 'Without this an infection from the office can stop the line.' },
  ],
  [ // s5 lines
    { nl: 'Het vierde station is Lijnen en automatisering. Dat is de lijn zelf, waar dozen aankomen en worden gevuld.',
      en: 'The fourth station is Lines and automation. That is the line itself, where cartons arrive and get filled.' },
    { nl: 'De eenheid mag alleen vullen als een sensor een doos onder de plaat ziet.',
      en: 'The unit may only fill when a sensor sees a carton under the plate.' },
    { nl: 'Je gebruikt {t:Poka-yoke|poka-yoke} en een {t:Interlock|interlock}.',
      en: 'You use {t:Poka-yoke|poka-yoke} and an {t:Interlock|interlock}.' },
    { nl: 'Zonder dit loopt product de band op als er geen doos staat.',
      en: 'Without this product runs onto the belt when no carton is there.' },
  ],
  [ // s6 industry40
    { nl: 'Het vijfde station is Data en digitale productie. Wat lijn 3 maakt, moet iedereen op de vloer kunnen zien.',
      en: 'The fifth station is Data and digital manufacturing. What line 3 makes has to be visible on the floor.' },
    { nl: 'De cijfers van de eenheid gaan naar het MES en naar een scherm bij de lijn.',
      en: 'The unit’s numbers go to the MES and to a screen by the line.' },
    { nl: 'Je gebruikt een {t:Edge gateway|edge gateway} en een {t:Dashboard|dashboard}.',
      en: 'You use an {t:Edge gateway|edge gateway} and a {t:Dashboard|dashboard}.' },
    { nl: 'Zonder dit komen de cijfers te laat, of ze kloppen niet.',
      en: 'Without this the numbers come too late, or they are wrong.' },
  ],
  [ // s7 the map
    { nl: 'Dit is de hele kaart. De vijf stations van Automatisering en IT liggen in één gebied.',
      en: 'This is the whole map. The five stations of Automation and IT lie in one zone.' },
    { nl: 'Eerst IT-fundamenten, van netwerken en cloud tot databases en software.',
      en: 'First IT fundamentals, from networks and cloud to databases and software.' },
    { nl: 'Dan IT en OT op de fabrieksvloer, van ISA-95 tot wie wat beheert.',
      en: 'Then IT and OT on the shop floor, from ISA-95 to who owns what.' },
    { nl: 'Dan Cybersecurity, van de basis tot de wet en incidentrespons.',
      en: 'Then Cybersecurity, from the basics to the law and incident response.' },
    { nl: 'Dan Lijnen en automatisering, met robots, foutvrij maken en de businesscase.',
      en: 'Then Lines and automation, with robots, error-proofing and the business case.' },
    { nl: 'Tot slot Data en digitale productie, van datakwaliteit tot AI.',
      en: 'Finally Data and digital manufacturing, from data quality to AI.' },
    { nl: 'Zo hangen ze samen. Het netwerk verbindt de systemen, en de lijn praat daarover met het MES.',
      en: 'That is how they connect. The network joins the systems, and the line talks over it with the MES.' },
    { nl: 'Cybersecurity bewaakt die verbinding. De lijn maakt de producten, en data laat zien hoe dat gaat.',
      en: 'Cybersecurity guards that link. The line makes the products, and data shows how it goes.' },
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
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link,[data-cue][data-on] .pm-road{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-out,.pm-dot,.pm-solid){stroke:var(--fp-accent)}
[data-cue][data-on] .pm-cross{stroke:var(--fp-accent)}
/* the cable on the floor and the photo-eyes' beam read at phone width: a little heavier than the kit's hairline */
[data-cue="cable"] .iso-line{stroke-width:2.2}
[data-cue="sensor"] .iso-line{stroke-width:1.8}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as the pilot) */
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');


const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 draait. Aan de achterwand de band van lijn 3 met dozen; boven het begin van de band staat de nieuwe vuleenheid, ongeveer zo hoog als een mens: een stalen frame met een plaat boven de dozen en bovenop een lichte kunststof kap. Links achter staat een tank met een leiding naar de plaat. Tegen de achterwand tussen tank en band een grijze PLC-kast, met erop een klein kastje, en in de linkerhoek een netwerkkast met poorten; een kabel loopt van de netwerkkast naar de PLC-kast en naar de tafel voorin met de laptop van het MES. Op de vloer een donkerder vlak met een gestippelde rand rond de lijn: de eigen zone van lijn 3, met een bewaker op de kabel waar die binnenkomt. Over de band staan twee ogen met een gestippelde straal bij de doos onder de plaat. Op de achterwand rechts een scherm met staven en een doellijn. Jij, de engineer, staat rechts voor. Rechts een paneel, gemarkeerd als voorbeeld of schema. Eerst de eenheid die orders krijgt en tellingen teruggeeft, dan de route in vijf stappen en de weg met vijf stations. Dan per station een schema, twee namen van hulpmiddelen en, gestippeld, wat er misgaat zonder: bij IT-fundamenten een order naar een eenheid, een switch en een VLAN; bij IT/OT op de fabrieksvloer orders omlaag en terugmeldingen omhoog, een OPC-server en tags; bij Cybersecurity kantoor en lijn met een geblokkeerde aanval, zones en een conduit; bij Lijnen en automatisering een band met dozen en een lege plek, poka-yoke en een interlock; bij Data en digitale productie de eenheid, het MES en een scherm, een edge gateway en een dashboard. Aan het eind de kaart van Engineering: eerst het hele net van vijf gebieden, dan het gebied Automatisering en IT met de vijf stations verlicht, dan plek voor plek van dichtbij, en weer het gebied.',
  en: 'Hall B of the plant, where line 3 runs. Along the back wall the belt of line 3 with cartons; over the start of the belt stands the new filling unit, about as tall as a person: a steel frame with a plate above the cartons and a light plastic cover on top. At the back left a tank with a pipe to the plate. Against the back wall between tank and belt a grey PLC cabinet with a small box on top, and in the left corner a network cabinet with ports; a cable runs from the network cabinet to the PLC cabinet and to the table at the front with the laptop of the MES. On the floor a darker patch with a dashed edge around the line: the own zone of line 3, with a guard on the cable where it comes in. Across the belt two eyes with a dashed beam at the carton under the plate. On the back wall at the right a screen with bars and a target line. You, the engineer, stand at the front right. At the right a panel, marked as an example or a diagram. First the unit that gets orders and gives counts back, then the route in five steps and the road with five stations. Then per station a schema, two names of tools and, dashed, what goes wrong without it: at IT fundamentals an order to a unit, a switch and a VLAN; at IT/OT on the shop floor orders down and confirmations up, an OPC server and tags; at Cybersecurity the office and the line with a blocked attack, zones and a conduit; at Lines and automation a belt with cartons and an empty spot, poka-yoke and an interlock; at Data and digital manufacturing the unit, the MES and a screen, an edge gateway and a dashboard. At the end the map of Engineering: first the whole map of five zones, then the zone Automation and IT with the five stations lit, then place by place up close, and the zone again.',
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

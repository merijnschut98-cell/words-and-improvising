// Dev tool, not shipped. Builds the module intro film "Van MES-order tot draaiende eenheid / From MES order to a running
// unit" for IT/OT op de fabrieksvloer (eng.ot), an Engineering module intro film (v17, Task 13) and the second intro of
// the digital zone: the high-over picture at the top of the module, before its four topics (Merijn, 13 Nov: "that
// high-over picture is the thing I need the most"). Pattern and rules: films/eng.gridplanning.intro and
// films/eng.machining.intro (the approved references), and the notes section "Engineering module intros".
//
//   node films/eng.ot.intro/build.mjs            build the page
//   node films/eng.ot.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.ot.intro.html: one offline page with the anatomy kit, the stage script and the
// player inlined. The index names it (eng.ot's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The story: hall B of the field film films/eng.field.digital ("Automatisering en IT": the new filling unit stands
// ready on line 3 and the plant's MES has to send it orders and get counts back; its second station, IT/OT op de
// fabrieksvloer, says the PLC in the cabinet at the unit controls it, that orders go down to the PLC and confirmations
// up to the MES, that you set up an OPC server and tags, and that without this the MES does not know what the line
// makes). This film asks the question that station leaves open: what happens between the order on the MES and the
// moving machine? You, the engineer, follow it. The room is the shared hall B as in the field film (the filling unit
// over the start of line 3's belt with the tank behind it, the PLC cabinet at the unit, the network cabinet in the back
// corner, the cable from the MES laptop on the front table through the network cabinet to the PLC cabinet, the pair of
// photo-eyes across the belt); each thing appears in the beat that names it. Every topic of the module has its place on
// that one road:
//   s1 the order on the MES and the machine that fills; what lies between; ISA-95 describes how a plant's systems fit
//      together, from the machine to the business system (as the first lesson words it); the map before any detail:
//      four topics, two about the layers and the systems that hand each other orders, two about how they talk, where
//      data is kept and who looks after it                                                  → eng.ot.levels
//   s2 ISA-95 en het Purdue-model: five levels, the photo eye is level 1 and the PLC in the cabinet level 2, the MES
//      level 3, the ERP at the office level 4; the information flow between MES and ERP (Werkkennis, .purdue)
//   s3 PLC, SCADA, MES en ERP: one order through the systems; the order goes down by the cable and the network
//      cabinet to the PLC, the count goes up to the MES; the production order (Basis, .systems)
//   s4 OPC UA, MQTT en de historian: systems talk in agreed languages; the historian keeps values with their time for
//      years; you set up an OPC server (Werkkennis, .opcua) and tags (Basis, .historian), as the field film's station
//   s5 IT/OT-convergentie: office IT and the floor grow together, so who looks after what (IT the network and servers,
//      automation the PLC); the machine builder supplies the unit with its controls (Basis, .ownership); the order
//      reaches the unit and the count goes back to the MES. Patching is eng.cyber's (eng.cyber.otpatch): not named
//   s6 the shared Engineering map (the kit's mapScene) with IT/OT op de fabrieksvloer lit, then the module's four
//      topics with their levels as columns, where to start, and what each later level adds, in the app's level words
// Per the review of eng.machining.intro and the gridbasics intro: how the topics hang together is said once, in s1,
// before any detail; a topic scene is short (what it is, its place in the story with a reason, then the tool sentence);
// the tools are real things of the topic at Basis or Working knowledge level, one short sentence each, not explained.
// Tools, one per topic (the review of this film cut eight to four, as the review of eng.itbasics.intro did): information flow
// (levels: the topic has no device; ISA-95 and the Purdue model repeat the topic's title and add nothing, the information flow is
// what the engineer draws between two systems, Werkkennis, .purdue; tijdschaal is a measure), production order (stack: the document
// the engineer follows down; the confirmation is the same loop, work order, recipe and HMI are other modules' terms), OPC server and
// tag (protocols: the field film's own pair, one idea; the historian is also a term of eng.industry40 and stays in the sentence
// about where data is kept), machine builder (convergence: the topic has no real tool, the patch tools are eng.cyber's, RACI is
// the planning intro's; the machine builder is the Basis party that supplied the unit in this story). The Werkkennis tools named
// in a scene (information flow, OPC server) do not come back in the
// closing grid, which says what each level adds in the lessons' own words. The story ends where the field film picks it
// up: the order reaches the unit and the counts go back to the MES. The firewall, zones and the DMZ are eng.cyber's and
// the switch and VLAN eng.itbasics': not drawn, not named. Definitions as the Basis lessons word them (eng.ot.levels,
// .systems, .historian, .ownership, .patching). Terms come from the module's lessons and {n:} numbers from the module's
// text (the kit's intro mode, films/_kit/build-film.mjs); the kit holds the film to its map (every topic named in a
// caption of its own scene, explained in two beats and lit), its narration guard and its label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): hall B as in the digital field film (the shared hall of
// films/pm.plan.intro/hall.mjs), you as the figure of the pm world. A panel at the right, in stage space, draws each step
// as a schema, labelled "voorbeeld" (the unit's way) or "schema" (the module's map).
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
const MOD = MODULES.find((m) => m.id === 'eng.ot');
const LEVELS = {
  levels: ['eng.ot.levels', 'eng.ot.purdue', 'eng.ot.hierarchy', 'eng.ot.beyond'],
  stack: ['eng.ot.systems', 'eng.ot.orderflow', 'eng.ot.handshake', 'eng.ot.integration'],
  protocols: ['eng.ot.historian', 'eng.ot.opcua', 'eng.ot.mqtt', 'eng.ot.uns'],
  convergence: ['eng.ot.ownership', 'eng.ot.patching', 'eng.ot.change', 'eng.ot.governance'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.ot has the four topics and levels this film draws');
assert(MOD.intro === 'eng.ot.intro', 'eng.ot names this film as its intro');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s1: ISA-95 describes how the systems of a plant fit together, from the machine to the business system
has('eng.ot.levels', ['ISA-95 is een internationale norm', 'die beschrijft hoe de systemen van een fabriek samenhangen, van de machine tot het bedrijfssysteem']);
has('eng.ot.levels', ['ISA-95 is an international standard', 'that describes how a plant’s systems fit together, from the machine up to the business system'], 'en');
// s2: five levels; level 1 measures and moves (a photo eye), level 2 monitors and controls (the PLC), level 3 runs production (the MES), level 4 is business planning (the ERP)
has('eng.ot.levels', ['Er zijn er vijf, van 0 tot 4', 'Niveau 1 meet en beweegt: sensoren zoals een fotocel', 'Niveau 2 bewaakt en bestuurt. Hier hoort de PLC', 'Niveau 3 stuurt de productie', 'Niveau 4 is de bedrijfsplanning', 'Niveau 0 is het fysieke proces zelf', 'het ERP op de laptop van de planner']);
has('eng.ot.levels', ['There are five, from 0 to 4', 'Level 1 measures and moves: sensors such as a photo eye', 'Level 2 monitors and controls. This is where the PLC', 'Level 3 runs production', 'Level 4 is business planning', 'Level 0 is the physical process', 'the ERP on the planner’s laptop'], 'en');
has('eng.ot.purdue', ['Purdue-model Referentiemodel', 'Informatiestroom Een vaste uitwisseling van gegevens tussen twee taken, zoals de productieplanning van ERP naar MES']);
has('eng.ot.purdue', ['Purdue model Reference model', 'Information flow'], 'en');
// s3: one order through five kinds of systems; the ERP knows what the customer wants, the MES shares out the work, SCADA monitors, the PLC runs the machine; orders down, confirmations up
has('eng.ot.systems', ['Bij één order werken vijf soorten systemen samen', 'Het ERP weet wat de klant wil en wanneer', 'Het MES verdeelt het werk over lijnen en diensten', 'SCADA bewaakt de installatie', 'De PLC stuurt de machine', 'Productieorder Opdracht in het ERP']);
has('eng.ot.systems', ['Five kinds of systems work together on one order', 'The ERP knows what the customer wants and when', 'The MES spreads the work over lines and shifts', 'SCADA monitors the installation', 'The PLC runs the machine', 'Production order An instruction in the ERP'], 'en');
has('eng.ot.orderflow', ['Kort: orders omlaag, terugmeldingen omhoog', 'Omhoog: de PLC telt, het MES verzamelt tellingen, afkeur en stilstand']);
has('eng.ot.orderflow', ['In short: orders down, confirmations up', 'Up: the PLC counts, the MES collects counts, scrap and downtime'], 'en');
// s4: OPC UA reads and writes machine data, MQTT is a lightweight messaging protocol, the historian stores tag values with timestamps for years and returns them as a trend; the OPC server runs in the PLC; a tag is one named value
has('eng.ot.opcua', ['OPC UA (Open Platform Communications Unified Architecture) is een open standaard om data uit machines te lezen en te schrijven', 'De OPC-server draait in de PLC, de machine of een gateway en biedt de data aan']);
has('eng.ot.opcua', ['is an open standard for reading and writing machine data', 'The OPC server runs in the PLC, the machine or a gateway and offers the data'], 'en');
has('eng.ot.mqtt', ['MQTT is een licht berichtenprotocol']);
has('eng.ot.mqtt', ['MQTT is a lightweight messaging protocol'], 'en');
has('eng.ot.historian', ['Een historian is een database die gebouwd is om tagwaarden met tijdstempel op te slaan, jarenlang, en snel terug te geven als trend', 'Een tag is één benoemde meetwaarde of status uit de besturing']);
has('eng.ot.historian', ['A historian is a database built to store tag values with timestamps for years and return them quickly as a trend', 'A tag is one named measurement or status from the control system'], 'en');
// s5: convergence is office IT and the floor growing together, with the question who is responsible for what; IT runs network, servers and office systems, automation or OT the PLCs, the machine builder supplies the machine with its control (patching is eng.cyber's: not named)
has('eng.ot.ownership', ['Machinebouwer OEM', 'IT/OT-convergentie is het samengroeien van kantoor-IT en de techniek op de vloer', 'ook de vraag wie waarvoor verantwoordelijk is', 'IT beheert netwerk, servers en kantoorsystemen', 'De afdeling automatisering of OT beheert PLC’s, SCADA en lijn-pc’s', 'die de machine met besturing levert']);
has('eng.ot.ownership', ['Machine builder OEM', 'IT/OT convergence is the growing together of office IT and the technology on the floor', 'the question of who is responsible for what', 'IT runs the network, servers and office systems', 'The automation or OT department runs PLCs, SCADA and line PCs', 'who supplies the machine with its controls'], 'en');
// s6: where to start, and the later levels, as the lessons are titled (the grid names what each adds)
for (const [id, word] of [['eng.ot.levels', 'De vijf niveaus van ISA-95'], ['eng.ot.purdue', 'twee kaarten van dezelfde fabriek'], ['eng.ot.orderflow', 'Orders omlaag'], ['eng.ot.opcua', 'machinedata met betekenis'], ['eng.ot.patching', 'Patchen en levenscycli'],
  ['eng.ot.hierarchy', 'vier werkgebieden'], ['eng.ot.handshake', 'tussen machine en MES'], ['eng.ot.mqtt', 'MQTT'], ['eng.ot.change', 'Wijzigingsbeheer'],
  ['eng.ot.beyond', 'cloud'], ['eng.ot.integration', 'MES-ERP-koppeling beoordelen'], ['eng.ot.uns', 'Unified namespace'], ['eng.ot.governance', 'organiseren']]) has(id, [word]);
for (const [id, word] of [['eng.ot.levels', 'The five levels of ISA-95'], ['eng.ot.purdue', 'two maps of the same plant'], ['eng.ot.orderflow', 'Orders down'], ['eng.ot.opcua', 'machine data with meaning'], ['eng.ot.patching', 'Patching and lifecycles'],
  ['eng.ot.hierarchy', 'four operations areas'], ['eng.ot.handshake', 'between machine and MES'], ['eng.ot.mqtt', 'MQTT'], ['eng.ot.change', 'Change control'],
  ['eng.ot.beyond', 'cloud'], ['eng.ot.integration', 'Judging an MES'], ['eng.ot.uns', 'Unified namespace'], ['eng.ot.governance', 'Organising']]) has(id, [word], 'en');
// s6: the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from
// GRID.x; the words stand on one line each, staggered over two rows (columns 1 and 3 high, 2 and 4 low), so a
// word may be wider than its column but not wider than the room to the next word on its row, nor run off the stage.
const LV = { nl: levelWords('nl'), en: levelWords('en') };
const GRID = { x: 276, col: 90, box: 82, tile: 252, top: 64, pitch: 80, h: 76 };
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
const person = (role, x, y, along) => w.person({ x, y, role, along });

// where things stand (cm), as in the digital field film: the filling unit over the start of line 3's belt (two uprights
// and a beam, a plate hung from the beam above the cartons, a plastic cover on top, the tank at the back wall at the left
// with its pipe into the plate), as tall as a person; the PLC cabinet at the back wall between tank and belt, the network
// cabinet in the back left corner, the cable from the MES laptop on the table at the front left through the network
// cabinet to the PLC cabinet, the pair of photo-eyes across the belt at the carton under the plate. You stand at the
// front right, as in the field film (not in front of the photo-eyes).
const BELT = { x: 130, y: 16, len: 130, dep: 34 };
const UX = 152; // x of the uprights and the beam
const FRAME = { top: 150, beam: 160 };
const PLATE = { z0: 100, z1: 146 }; // the filling head: its foot clears the cartons (60 to 80)
const TANK = { x: 62, y: 34, r: 20, h: 130 };
const PIPE = { y: 28, z: 118 };
const TABLE = { x: 18, y: 108, w: 76, d: 42, h: 74 };
const PLC = { x: 96, w: 30, d: 20, h: 112 };
const NET = { x: 4, w: 20, d: 18, h: 124 };
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
const at = w.at;
// the network cabinet: a tall cabinet with a panel of ports on its door
const netcab = hall.cabinet({ x: NET.x, w: NET.w, d: NET.d, h: NET.h })
  + w.box({ x: NET.x + 3, y: NET.d, w: 14, d: 1.2, r: 0.4 }, 86, 100, { tone: 'lo' }, { steps: 1 })
  + k.dotsSvg([0, 1, 2, 3, 4, 5].map((i) => at([NET.x + 5 + (i % 3) * 5, NET.d + 1.5, 90 + Math.floor(i / 3) * 6])), { size: 1.1, tone: 'hi' });
// the pair of photo-eyes: a post with an eye on each side of the belt and a dashed beam between them at the carton
const eyes = w.post(EYE.x, EYE.y0, 3, 0, EYE.z, { tone: 'lo' }, 12) + w.box({ x: EYE.x - 4, y: EYE.y0 - 4, w: 8, d: 8, r: 1.5 }, EYE.z, EYE.z + 10, { tone: 'hi' }, { steps: 2 })
  + w.post(EYE.x, EYE.y1, 3, 0, EYE.z, { tone: 'lo' }, 12) + w.box({ x: EYE.x - 4, y: EYE.y1 - 4, w: 8, d: 8, r: 1.5 }, EYE.z, EYE.z + 10, { tone: 'hi' }, { steps: 2 })
  + k.lineSvg(k.pathOf([at([EYE.x, EYE.y0 + 4, EYE.z + 5]), at([EYE.x, EYE.y1 - 4, EYE.z + 5])]), { tone: 'hi', dashed: true });
const cablePath = CABLE.map((pts) => hall.cable(pts, {})).join('');

// painted back to front (large x and small y are far). Each thing appears in the beat of its name (the stage script
// shows the groups o-*), so every drawn detail meets its reason in the narration: the PLC cabinet and the photo-eyes at
// the levels (s2), the network cabinet and the cable at the order's way down (s3)
const world = [
  w.room(ROOM),
  cueG('line3', hall.conveyor({ ...BELT, cartons: 4 })),
  cueG('tank', tank),
  cueG('unit', frame + plate + cover),
  g('o-net', cueG('netcab', netcab) + cueG('cable', cablePath)),
  g('o-plc', cueG('plc', hall.cabinet({ x: PLC.x, w: PLC.w, d: PLC.d, h: PLC.h }))),
  g('o-eye', cueG('sensor', eyes)),
  cueG('mes', w.table(TABLE) + w.laptop({ x: TABLE.x + TABLE.w / 2, y: TABLE.y + TABLE.d / 2, z: TABLE.h, toward: 1 })),
  g('pp-jij', person('jij', 262, 128, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame
// (data-k): the four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the
// schemas of each beat. The shared Engineering map (the kit's mapScene) sits under the panel; its place IT/OT op de
// fabrieksvloer is a cue group of its own (map-ot).
const TILE = { levels: 'tLevels', stack: 'tStack', protocols: 'tProtocols', convergence: 'tConvergence' };
const PANEL = ['frameS', 'grpA', 'grpB', 'lvLow', 'lvHigh', 'sysS', 'downS', 'upS', 'talkS', 'protoS', 'histS', 'joinS', 'ownS', 'runS',
  'tool1', 'tool2', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, IT/OT op de fabrieksvloer lit, in the stage (the film's closing scene; the stage script moves and fades it)
const { w: MAP_W, h: MAP_H } = engMap.view; // the Engineering map's sheet (viewBox of the wide drawing), from the map data
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.ot'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.ot');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.ot')}"`), 'the map lights eng.ot as a cue group');
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
  { from: cam(120, 70, 70, 1.0), to: cam(120, 70, 70, 1.08) }, // s1 the whole hall: the MES at the front, the unit over the belt
  { from: cam(120, 60, 70, 1.12), to: cam(120, 60, 70, 1.2) }, // s2 the photo-eyes, the PLC cabinet, the MES
  { from: cam(70, 70, 60, 1.25), to: cam(70, 70, 60, 1.35) }, // s3 the MES, the cable, the network cabinet, the PLC cabinet
  { from: cam(90, 70, 70, 1.2), to: cam(90, 70, 70, 1.3) }, // s4 the cable and the PLC cabinet
  { from: cam(100, 70, 60, 1.15), to: cam(110, 70, 60, 1.05) }, // s5 the PLC cabinet, the MES, the unit
  { from: cam(150, 70, 60, 1), to: cam(150, 70, 60, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a, b) => ({ cue: { [a]: 'tool1', ...(b ? { [b]: 'tool2' } : {}) } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.ot.intro',
  title: { nl: 'Van MES-order tot draaiende eenheid', en: 'From MES order to a running unit' },
  module: 'eng.ot',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.ot, the scene that explains it and its tile
  topics: {
    levels: { scene: 's2', cue: 'tLevels' },
    stack: { scene: 's3', cue: 'tStack' },
    protocols: { scene: 's4', cue: 'tProtocols' },
    convergence: { scene: 's5', cue: 'tConvergence' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'De order', en: 'The order' },
      beats: [
        { nl: 'Op het MES in hal B staat een order. De vuleenheid van lijn 3 vult dozen uit de tank.', en: 'On the MES in hall B there is an order. The filling unit of line 3 fills cartons from the tank.', focus: ['frameS', 'mes', 'unit', 'tank', 'line3'] },
        { nl: 'Wat gebeurt er tussen die order en de machine? Jij bent de engineer en zoekt het uit.', en: 'What happens between that order and the machine? You are the engineer and find out.', focus: ['frameS', 'jij'] },
        { nl: 'ISA-95 beschrijft hoe de systemen van een fabriek samenhangen, van de machine tot het bedrijfssysteem.', en: 'ISA-95 describes how a plant’s systems fit together, from the machine up to the business system.', focus: ['frameS', 'unit', 'mes'] },
        { nl: 'Vier onderwerpen volgen die keten. Eerst de niveaus en de systemen.', en: 'Four topics follow that chain. First the levels and the systems.', focus: 'grpA' },
        { nl: 'Daarna hoe ze praten, waar data blijft en wie ze beheert.', en: 'Then how they talk, where data is kept and who looks after them.', focus: 'grpB' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Niveaus', en: 'Levels' },
      beats: [
        { nl: 'Het eerste onderwerp is ISA-95 en het Purdue-model. Elk systeem hoort op een van vijf niveaus.', en: 'The first topic is ISA-95 and the Purdue model. Every system belongs on one of five levels.', focus: ['tLevels', 'lvLow', 'lvHigh'] },
        { nl: 'De fotocel bij de band is niveau 1 en de PLC in de kast niveau 2.', en: 'The photo eye at the belt is level 1 and the PLC in the cabinet level 2.', focus: ['lvLow', 'sensor', 'plc'] },
        { nl: 'Het MES is niveau 3 en het ERP niveau 4.', en: 'The MES is level 3 and the ERP level 4.', focus: ['lvHigh', 'mes'] },
        { nl: 'Je tekent de {t:Informatiestroom|informatiestroom} tussen het MES en het ERP.', en: 'You draw the {t:Information flow|information flow} between the MES and the ERP.', ...TOOL('Informatiestroom'), focus: ['tool1', 'mes'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Systemen', en: 'Systems' },
      beats: [
        { nl: 'Het tweede onderwerp is PLC, SCADA, MES en ERP. Eén order loopt door alle vier.', en: 'The second topic is PLC, SCADA, MES and ERP. One order runs through all four.', focus: ['tStack', 'sysS'] },
        { nl: 'Het ERP weet wat de klant wil. Het MES verdeelt het werk, SCADA bewaakt en de PLC stuurt de machine.', en: 'The ERP knows what the customer wants. The MES spreads the work, SCADA monitors and the PLC runs the machine.', focus: ['sysS', 'plc', 'mes'] },
        { nl: 'Een order gaat via de kabel en de netwerkkast omlaag naar de PLC. De telling gaat omhoog naar het MES.', en: 'An order goes down to the PLC through the cable and the network cabinet. The count goes up to the MES.', focus: ['downS', 'upS', 'cable', 'netcab', 'plc', 'mes'] },
        { nl: 'Je volgt de {t:Productieorder|productieorder} van het ERP tot de PLC.', en: 'You follow the {t:Production order|production order} from the ERP to the PLC.', ...TOOL('Productieorder'), focus: ['tool1', 'cable', 'mes'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Protocollen', en: 'Protocols' },
      beats: [
        { nl: 'Het derde onderwerp is OPC UA, MQTT en de historian. Systemen praten in afgesproken talen.', en: 'The third topic is OPC UA, MQTT and the historian. Systems talk in agreed languages.', focus: ['tProtocols', 'talkS', 'plc', 'mes'] },
        { nl: 'OPC UA is een standaard voor machinedata. MQTT is een licht berichtenprotocol.', en: 'OPC UA is a standard for machine data. MQTT is a lightweight messaging protocol.', focus: ['protoS', 'cable'] },
        { nl: 'De historian bewaart meetwaarden jarenlang en toont ze als trend.', en: 'The historian keeps measurements for years and shows them as a trend.', focus: 'histS' },
        { nl: 'Je richt een {t:OPC-server|OPC-server} en {t:Tag|tags} in.', en: 'You set up an {t:OPC server|OPC server} and {t:Tag|tags}.', ...TOOL('OPC-server', 'Tag'), focus: ['tool1', 'tool2', 'plc'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Beheer', en: 'Ownership' },
      beats: [
        { nl: 'Het vierde onderwerp is IT/OT-convergentie. Kantoor-IT en de techniek op de vloer groeien samen.', en: 'The fourth topic is IT/OT convergence. Office IT and the technology on the floor grow together.', focus: ['tConvergence', 'joinS', 'mes', 'plc'] },
        { nl: 'Wie beheert wat? IT beheert netwerk en servers, automatisering de PLC.', en: 'Who looks after what? IT runs network and servers, automation the PLC.', focus: ['ownS', 'plc', 'mes'] },
        { nl: 'Je schakelt de {t:Machinebouwer|machinebouwer} in, want die levert de besturing mee.', en: 'You call in the {t:Machine builder|machine builder}, as it supplies the controls.', ...TOOL('Machinebouwer'), focus: ['tool1', 'unit', 'plc'] },
        { nl: 'Dan komt de order bij de eenheid aan en gaat de telling terug naar het MES.', en: 'Then the order reaches the unit and the count goes back to the MES.', focus: ['runS', 'unit', 'mes'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. Dit is het tweede station van Automatisering en IT.', en: 'The whole map. This is the second station of Automation and IT.', focus: 'map-ot' },
        { nl: 'Elk onderwerp heeft vier niveaus.', en: 'Every topic has four levels.', focus: 'route' },
        { nl: 'Begin bij De vijf niveaus van ISA-95 op niveau Basis. Die laat zien hoe alles samenhangt.', en: 'Start with The five levels of ISA-95 at Basics level. It shows how everything fits together.', focus: ['tLevels', 'start'] },
        { nl: 'Op niveau Werkkennis komen twee kaarten van de fabriek, orders omlaag, machinedata en patchen met levenscycli.', en: 'At Working knowledge level come two maps of the plant, orders down, machine data and patching with lifecycles.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd komen de vier werkgebieden, de koppeling met het MES, MQTT en wijzigingsbeheer.', en: 'At Advanced level come the four operations areas, the link with the MES, MQTT and change control.', focus: 'lv3' },
        { nl: 'Op niveau Expert komen de cloud, een koppeling beoordelen, de unified namespace en governance.', en: 'At Expert level come the cloud, judging an interface, the unified namespace and governance.', focus: 'lv4' },
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
// inside a sentence at 0.4 s. Each topic scene ends on one short sentence naming the tools of that topic's lessons,
// without explaining them. IT/OT is said "IT-OT" (the guard refuses the slash); the caption keeps the title. Every
// drawn detail has its reason in the narration: the MES laptop (the order), the unit and the tank (what fills the
// cartons), line 3 (the belt), the photo-eyes (level 1), the PLC cabinet (level 2, controls the machine), the cable and
// the network cabinet (the way the order goes down), you (the engineer who finds out).
const SAY = [
  [ // s1 the order on the MES and the machine that fills: what lies between, ISA-95, the map in two groups
    { nl: 'Op het MES in hal B staat een order. De vuleenheid van lijn 3 vult dozen uit de tank.',
      en: 'On the MES in hall B there is an order. The filling unit of line 3 fills cartons from the tank.' },
    { nl: 'Wat gebeurt er tussen die order en de machine? Jij bent de engineer en zoekt het uit.',
      en: 'What happens between that order and the machine? You are the engineer and find out.' },
    { nl: 'ISA-95 beschrijft hoe de systemen van een fabriek samenhangen, van de machine tot het bedrijfssysteem.',
      en: 'ISA-95 describes how a plant’s systems fit together, from the machine up to the business system.' },
    { nl: 'Vier onderwerpen volgen die keten. Eerst de niveaus en de systemen.',
      en: 'Four topics follow that chain. First the levels and the systems.' },
    { nl: 'Daarna hoe ze praten, waar data blijft en wie ze beheert.',
      en: 'Then how they talk, where data is kept and who looks after them.' },
  ],
  [ // s2 levels: five levels, the photo eye, the PLC, the MES, the ERP; ISA-95 and the Purdue model
    { nl: 'Het eerste onderwerp is ISA-95 en het Purdue-model. Elk systeem hoort op een van vijf niveaus.',
      en: 'The first topic is ISA-95 and the Purdue model. Every system belongs on one of five levels.' },
    { nl: 'De fotocel bij de band is niveau 1 en de PLC in de kast niveau 2.',
      en: 'The photo eye at the belt is level 1 and the PLC in the cabinet level 2.' },
    { nl: 'Het MES is niveau 3 en het ERP niveau 4.',
      en: 'The MES is level 3 and the ERP level 4.' },
    { nl: 'Je tekent de {t:Informatiestroom|informatiestroom} tussen het MES en het ERP.',
      en: 'You draw the {t:Information flow|information flow} between the MES and the ERP.' },
  ],
  [ // s3 systems: one order through them, down by the cable and the network cabinet, up to the MES; the production order
    { nl: 'Het tweede onderwerp is PLC, SCADA, MES en ERP. Eén order loopt door alle vier.',
      en: 'The second topic is PLC, SCADA, MES and ERP. One order runs through all four.' },
    { nl: 'Het ERP weet wat de klant wil. Het MES verdeelt het werk, SCADA bewaakt en de PLC stuurt de machine.',
      en: 'The ERP knows what the customer wants. The MES spreads the work, SCADA monitors and the PLC runs the machine.' },
    { nl: 'Een order gaat via de kabel en de netwerkkast omlaag naar de PLC. De telling gaat omhoog naar het MES.',
      en: 'An order goes down to the PLC through the cable and the network cabinet. The count goes up to the MES.' },
    { nl: 'Je volgt de {t:Productieorder|productieorder} van het ERP tot de PLC.',
      en: 'You follow the {t:Production order|production order} from the ERP to the PLC.' },
  ],
  [ // s4 protocols: agreed languages, OPC UA and MQTT, the historian keeps values with their time, the OPC server and tags
    { nl: 'Het derde onderwerp is OPC UA, MQTT en de historian. Systemen praten in afgesproken talen.',
      en: 'The third topic is OPC UA, MQTT and the historian. Systems talk in agreed languages.' },
    { nl: 'OPC UA is een standaard voor machinedata. MQTT is een licht berichtenprotocol.',
      en: 'OPC UA is a standard for machine data. MQTT is a lightweight messaging protocol.' },
    { nl: 'De historian bewaart meetwaarden jarenlang en toont ze als trend.',
      en: 'The historian keeps measurements for years and shows them as a trend.' },
    { nl: 'Je richt een {t:OPC-server|OPC-server} en {t:Tag|tags} in.',
      en: 'You set up an {t:OPC server|OPC server} and {t:Tag|tags}.' },
  ],
  [ // s5 convergence: who looks after what, the machine builder, the story ends
    { nl: 'Het vierde onderwerp is IT-OT-convergentie. Kantoor-IT en de techniek op de vloer groeien samen.',
      en: 'The fourth topic is IT-OT convergence. Office IT and the technology on the floor grow together.' },
    { nl: 'Wie beheert wat? IT beheert netwerk en servers, automatisering de PLC.',
      en: 'Who looks after what? IT runs network and servers, automation the PLC.' },
    { nl: 'Je schakelt de {t:Machinebouwer|machinebouwer} in, want die levert de besturing mee.',
      en: 'You call in the {t:Machine builder|machine builder}, as it supplies the controls.' },
    { nl: 'Dan komt de order bij de eenheid aan en gaat de telling terug naar het MES.',
      en: 'Then the order reaches the unit and the count goes back to the MES.' },
  ],
  [ // s6 the map: the level words of the app, as the captions show them
    { nl: 'De hele kaart. Dit is het tweede station van Automatisering en IT.',
      en: 'The whole map. This is the second station of Automation and IT.' },
    { nl: 'Elk onderwerp heeft vier niveaus.',
      en: 'Every topic has four levels.' },
    { nl: 'Begin bij De vijf niveaus van ISA-95 op niveau Basis. Die laat zien hoe alles samenhangt.',
      en: 'Start with The five levels of ISA-95 at Basics level. It shows how everything fits together.' },
    { nl: 'Op niveau Werkkennis komen twee kaarten van de fabriek, orders omlaag, machinedata en patchen met levenscycli.',
      en: 'At Working knowledge level come two maps of the plant, orders down, machine data and patching with lifecycles.' },
    { nl: 'Op niveau Gevorderd komen de vier werkgebieden, de koppeling met het MES, MQTT en wijzigingsbeheer.',
      en: 'At Advanced level come the four operations areas, the link with the MES, MQTT and change control.' },
    { nl: 'Op niveau Expert komen de cloud, een koppeling beoordelen, de unified namespace en governance.',
      en: 'At Expert level come the cloud, judging an interface, the unified namespace and governance.' },
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
const preamble = `const CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\nconst LV = ${JSON.stringify(LV)};\nconst MAPZ = ${JSON.stringify(MAPZ)};\nconst MAPSZ = [${MAP_W}, ${MAP_H}];\nconst GRID = ${JSON.stringify(GRID)};\nconst KEYS = ${JSON.stringify(PANEL)};\nconst CW = ${JSON.stringify(CHAR_W)};\nconst wrapUnits = ${wrapUnits.toString()};\n`;
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
.pm-lvl{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-link{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-dash{fill:none;stroke:var(--anatomy-hi);stroke-width:1.6;stroke-dasharray:5 4;stroke-linecap:round}
.pm-gap{fill:none;stroke:#C2553F;stroke-width:2.4;stroke-linecap:round}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link,[data-cue][data-on] .pm-dash{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-bar,.pm-lvl,.pm-out){stroke:var(--fp-accent)}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');

const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 draait. Boven het begin van de band staat de nieuwe vuleenheid, ongeveer zo hoog als een mens: een stalen frame met een plaat boven de dozen en een plastic kap, met links achter de tank en een leiding naar de plaat. Voor links een tafel met de laptop van het MES, en jij, de engineer, rechts naast het einde van de band. Later verschijnen een fotocel aan weerszijden van de band, de besturingskast van de eenheid langs de achterwand, en de netwerkkast in de hoek met de kabel van het MES naar de besturingskast. Rechts een paneel, gemarkeerd als voorbeeld of schema: de order, het MES en de machine met een vraag ertussen, vijf niveaus van het proces tot het ERP, de systemen van ERP tot PLC met een pijl voor orders omlaag en een pijl voor tellingen omhoog, twee talen voor machinedata, een historian met een trend, wie wat beheert, met per onderwerp de naam van een of twee hulpmiddelen. Aan het eind de hele kaart van Engineering met IT/OT op de fabrieksvloer verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the plant, where line 3 runs. Over the start of the belt stands the new filling unit, about as tall as a person: a steel frame with a plate above the cartons and a plastic cover, with the tank behind it at the left and a pipe to the plate. At the front left a table with the MES laptop, and you, the engineer, at the right beside the end of the belt. Later a photo eye on each side of the belt appears, the unit’s control cabinet along the back wall, and the network cabinet in the corner with the cable from the MES to the control cabinet. At the right a panel, marked as an example or a diagram: the order, the MES and the machine with a question between them, five levels from the process to the ERP, the systems from ERP to PLC with an arrow for orders down and an arrow for counts up, two languages for machine data, a historian with a trend, who looks after what, with the names of one or two tools per topic. At the end the whole map of Engineering with IT/OT on the shop floor lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

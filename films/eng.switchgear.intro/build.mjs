// Dev tool, not shipped. Builds the module intro film "De kast in hal B / The cabinet in hall B" for
// Schakelinstallaties en beveiliging (eng.switchgear), an Engineering module intro film (v17, Task 13) and the second
// intro of the energy zone: the high-over picture at the top of the module, before its four topics (Merijn, 13 Nov: "that
// high-over picture is the thing I need the most"). Pattern and rules: films/eng.machining.intro (the approved
// reference), eng.gridbasics.intro (the first energy intro), eng.process.intro and eng.drawings.intro, and the notes
// section "Engineering module intros".
//
//   node films/eng.switchgear.intro/build.mjs            build the page
//   node films/eng.switchgear.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.switchgear.intro.html: one offline page with the anatomy kit, the stage
// script and the player inlined. The index names it (eng.switchgear's `intro`), coursehome shows it above the
// topics, sw.js precaches it.
//
// The story: hall B of the field film films/eng.field.energy ("Energie en het net": line 3 moves and needs more
// power; its second station, Schakelinstallaties en beveiliging, says the cabinet switches and guards the power, that
// in a short circuit only the breaker closest to the fault trips, that the installer sets a protection relay and works
// with an earthing set, and that without this one fault shuts down the whole hall or work on the cabinet is not safe).
// This film stands at that cabinet: the cable from the grid comes in through the left wall, the cabinet is a row of
// two panels (a field each) along the back wall, line 3 stands at the right, and you and the installer of the field
// film come and go. Every topic of the module has its place on that one cabinet:
//   s1 the power comes in through the wall into a cabinet and goes on to line 3; the cabinet belongs to a switchgear
//      installation, the equipment that switches, protects and isolates parts of the grid (the first lesson's words);
//      the map before any detail: four topics, two about the equipment (devices; installations and stations), two
//      about the fault and the people (protection; switching safely)                    → eng.switchgear.devices
//   s2 Schakelapparaten: for every device you ask what it can switch on and what it can break; a fault hits much
//      harder than normal current; you choose a circuit breaker or a load-break switch (Basis, .devices)
//   s3 MS-installaties en stations: an installation is a row of steel cabinets, each a panel; air between the parts
//      makes it big, gas in a sealed tank compact; in a secondary substation (netstation) the MV part is usually an RMU (Basis, .installations; the lesson ties it to netstations, so the scene says so)
//   s4 Beveiliging en kortsluiting: suppose a short circuit at line 3; a protection measures the current, compares it
//      with a setting and the breaker opens; a wrong setting opens too often or never; the installer sets the protection
//      relay, as in the field film (Basis, .protection)
//   s5 Veilig schakelen: most work is done dead; the five safety rules in their order; only an appointed installer works on the cabinet
//      and you, a consultant, touch nothing; you prove it dead with a voltage detector and place an earthing set, the
//      field film's tool (Werkkennis, .earthing); then the installer works safely on the cabinet, where the field film
//      picks the story up
//   s6 the shared Engineering map (the kit's mapScene) with Schakelinstallaties en beveiliging lit, then the module's
//      four topics with their levels as columns, where to start, and what each later level adds, in the app's level words
// Per the review of eng.machining.intro: how the topics hang together is said once, in s1, before any detail; a topic
// scene is short (what it is, its place in the story with a reason, then the tool sentence); the tools are real things
// of the topic taught as terms at Basis or Working knowledge level (circuit breaker and load-break switch; RMU; protection
// relay; voltage detector and earthing set), one short sentence each, not explained. Topic 2 has one real tool (the RMU),
// because the panel, the air and gas insulated types and the SF6 gas are concepts, not tools. The two Working knowledge
// tools (voltage detector, earthing set) are not named again in the closing grid, which says what each later level adds as
// the lessons are titled (nameplate, distribution automation, selectivity and proving dead at Working knowledge). The
// protection relay and the earthing set agree with the field film's station. Not used, because the energy zone's other
// stations own them: transformer, cable, netstation, the main fuse of eng.gridbasics, the switching plan of
// eng.gridops. The circuit breaker is the field film's "breaker closest to the fault"; selectivity itself is Working
// knowledge and stays in the closing grid.
// Definitions as the Basis lessons word them (eng.switchgear.devices, .installations, .protection, .safety). Terms come
// from the module's lessons and {n:} numbers from the module's text (the kit's intro mode, films/_kit/build-film.mjs); the
// kit holds the film to its map (every topic named in a caption of its own scene, explained in two beats and lit), its
// narration guard and its label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): hall B as in the energy field film (the shared hall
// of films/pm.plan.intro/hall.mjs: the power cabinet, the cable through the left wall, a packing line), with
// pm.agile.scrum's figures for the installer. A panel at the right, in stage space, draws each step as a schema,
// labelled "voorbeeld" (line 3's way) or "schema" (the module's map).
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
import { scrumPerson } from '../pm.agile.scrum/cast.mjs';
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
const MOD = MODULES.find((m) => m.id === 'eng.switchgear');
const LEVELS = {
  devices: ['eng.switchgear.devices', 'eng.switchgear.ratings', 'eng.switchgear.interruption', 'eng.switchgear.faultlevel'],
  stations: ['eng.switchgear.installations', 'eng.switchgear.automation', 'eng.switchgear.substation', 'eng.switchgear.sf6'],
  protection: ['eng.switchgear.protection', 'eng.switchgear.selectivity', 'eng.switchgear.shortcircuit', 'eng.switchgear.studies'],
  switching: ['eng.switchgear.safety', 'eng.switchgear.earthing', 'eng.switchgear.bei', 'eng.switchgear.customer'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.switchgear has the four topics and levels this film draws');
assert(MOD.intro === 'eng.switchgear.intro', 'eng.switchgear names this film as its intro');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s1 and s2: switchgear as the first lesson words it; two questions for every device; normal current against a fault
has('eng.switchgear.devices', ['Een schakelinstallatie (switchgear) is de apparatuur die delen van het net schakelt, beveiligt en scheidt', 'wat kan hij inschakelen, en wat kan hij onderbreken', 'hoe hard een fout daar aankomt', 'Een vermogensschakelaar kan normale belasting schakelen en ook een kortsluitstroom onderbreken', 'Een lastscheider kan normale belastingstroom in- en uitschakelen', 'maar kan geen kortsluiting onderbreken']);
has('eng.switchgear.devices', ['Switchgear is the equipment that switches, protects and isolates parts of the grid', 'what can it make (switch on), and what can it break (switch off)', 'how hard a fault hits there', 'A circuit breaker can switch normal load and also interrupt a short-circuit current', 'A load-break switch can switch normal load current on and off', 'but it cannot interrupt a short circuit'], 'en');
has('eng.switchgear.devices', ['Vermogensschakelaar', 'Lastscheider']);
has('eng.switchgear.devices', ['Circuit breaker', 'Load-break switch'], 'en');
// s3: a row of steel cabinets, each a panel; air against gas; the RMU
has('eng.switchgear.installations', ['de MS-installatie een rij stalen kasten', 'Elke kast is een veld', 'de lucht tussen de spanningvoerende delen isoleert, dus die hebben afstand nodig', 'in een gesloten tank met SF6, een isolerend gas, en zijn daardoor veel compacter', 'RMU, een ring main unit: één compact blok']);
has('eng.switchgear.installations', ['the MV switchgear is a row of steel cabinets', 'Each cabinet is a panel', 'air between the live parts insulates them, so they need distance', 'a sealed tank filled with SF6, an insulating gas, which makes it much more compact', 'an RMU, a ring main unit: one compact block'], 'en');
// s4: a protection measures, compares with its settings, trips; a wrong setting trips too often or not at all
has('eng.switchgear.protection', ['Meettransformatoren schalen de echte waarden terug', 'Een beveiligingsrelais vergelijkt die waarden met zijn instellingen', 'geeft het een uitschakelsignaal (trip), en de vermogensschakelaar gaat open', 'Een verkeerde instelling geeft ongewenste uitschakelingen of, erger, helemaal geen uitschakeling']);
has('eng.switchgear.protection', ['Measuring transformers scale the real values down', 'A protection relay compares these values with its settings', 'it sends a trip signal, and the circuit breaker opens', 'A wrong setting causes either unwanted trips or, worse, no trip at all'], 'en');
// s5: most work dead; the five rules in order; measuring comes before earthing; appointed people; a consultant touches nothing
has('eng.switchgear.safety', ['Het meeste werk aan het net gebeurt spanningsloos', 'de vijf veiligheidsregels, altijd in deze volgorde', 'Vrijschakelen', 'Beveiligen tegen herinschakelen', 'Spanningsloosheid vaststellen', 'Aarden en kortsluiten', 'Afschermen', 'Aarden komt pas na spanningsloos meten', 'Elke regel dekt een echte fout', 'de aanwijzing telt', 'Als consultant ben je leek', 'je raakt niks aan']);
has('eng.switchgear.safety', ['Most work on the grid is done dead', 'five safety rules, always in this order', 'Disconnect completely', 'Secure against reconnection', 'Verify that it is dead', 'Earth and short-circuit', 'Protect against adjacent live parts', 'Earthing only comes after verifying dead', 'Each rule covers a real failure', 'the written appointment does', 'As a consultant you are a layperson', 'touch nothing'], 'en');
has('eng.switchgear.earthing', ['Spanningzoeker', 'Aardgarnituur', 'een spanningzoeker (voltage detector)', 'een aardgarnituur (earthing set): draagbare klemmen en kabels']);
has('eng.switchgear.earthing', ['Voltage detector', 'Earthing set', 'an earthing set: portable clamps and cables'], 'en');
// s6: where to start, and the later levels as the lessons are titled
for (const [id, word] of [['eng.switchgear.ratings', 'typeplaat'], ['eng.switchgear.automation', 'Distributieautomatisering'], ['eng.switchgear.selectivity', 'Selectiviteit'], ['eng.switchgear.earthing', 'Spanningsloos aantonen'],
  ['eng.switchgear.interruption', 'onderbreekt'], ['eng.switchgear.substation', 'rails'], ['eng.switchgear.shortcircuit', 'Kortsluitstroom berekenen'], ['eng.switchgear.bei', 'Wie mag schakelen'],
  ['eng.switchgear.faultlevel', 'kortsluitvermogen'], ['eng.switchgear.sf6', 'SF6 uitfaseren'], ['eng.switchgear.studies', 'zonneparken'], ['eng.switchgear.customer', 'MS-installatie van de klant']]) has(id, [word]);
for (const [id, word] of [['eng.switchgear.ratings', 'nameplate'], ['eng.switchgear.automation', 'Distribution automation'], ['eng.switchgear.selectivity', 'Selectivity'], ['eng.switchgear.earthing', 'Proving dead'],
  ['eng.switchgear.interruption', 'breaks'], ['eng.switchgear.substation', 'busbars'], ['eng.switchgear.shortcircuit', 'Calculating short-circuit current'], ['eng.switchgear.bei', 'Who may switch'],
  ['eng.switchgear.faultlevel', 'fault level'], ['eng.switchgear.sf6', 'Phasing out SF6'], ['eng.switchgear.studies', 'solar parks'], ['eng.switchgear.customer', 'MV installation']]) has(id, [word], 'en');
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

// where things stand (cm), as in the energy field film: the power cabinet at the back wall at the left (x 12), the cable
// from the grid through the left wall (y 86 to 114) to the cabinet, line 3 at the right (x 186). New here: the cabinet's
// footprint (x 12 to 52) is split into two panels (a row of fields), so it reads as a switchgear installation; the
// transformer (x 68) and the switchboard (x 218) stand as in the field film and the transformers intro.
const CAB = { x: 12, w: 19, d: 26, h: 124 };
const CAB2 = { x: 33, w: 19, d: 26, h: 124 };
const SWB = { x: 218, w: 50, z0: 96, z1: 172 };
const TRAFO = { x: 68, y: 4, w: 54, d: 32, h: 60 };
const L3 = { x: 186, y: 16, len: 84, dep: 34 };
const cabA = hall.cable([[0, 100], [22, 100], [22, 28]]);
const cabB = hall.cable([[52, 13], [TRAFO.x, 13]]);
const tray = w.box({ x: TRAFO.x + TRAFO.w - 10, y: 0, w: SWB.x - (TRAFO.x + TRAFO.w - 10) + 20, d: 4, r: 0.6 }, 98, 104, { tone: 'lo' }, { steps: 1 })
  + w.box({ x: TRAFO.x + TRAFO.w - 10, y: 0, w: 5, d: 4, r: 0.6 }, TRAFO.h, 104, { tone: 'lo' }, { steps: 1 });
const bushings = [0, 1, 2].map((i) => w.post(TRAFO.x + 12 + i * 15, TRAFO.y + 16, 3.4, TRAFO.h, TRAFO.h + 14, { tone: 'hi' }, 10)).join('');
const ribs = [0, 1, 2, 3, 4].map((i) => w.box({ x: TRAFO.x + 6 + i * 10, y: TRAFO.y + TRAFO.d, w: 5, d: 9, r: 0 }, 12, TRAFO.h - 6, { tone: 'lo' }, { steps: 0 })).join('');
const trafo = w.box({ x: TRAFO.x, y: TRAFO.y, w: TRAFO.w, d: TRAFO.d, r: 2 }, 6, TRAFO.h, { tone: 'mid' }, { steps: 2 })
  + w.box({ x: TRAFO.x - 3, y: TRAFO.y - 2, w: TRAFO.w + 6, d: TRAFO.d + 4, r: 1 }, 0, 6, { tone: 'lo' }, { steps: 1 }) + ribs + bushings;
const wallEntry = w.box({ x: 0, y: 86, w: 10, d: 28, r: 1.5 }, 0, 40, { tone: 'lo' }, { steps: 2 })
  + w.box({ x: 10, y: 96, w: 3, d: 8, r: 1 }, 0, 10, { tone: 'mid' }, { steps: 1 });
const INST = { x: 24, y: 118 };
const JIJ = { x: 200, y: 108 };
const installer = scrumPerson(w, k, G, P, { x: INST.x, y: INST.y, key: 'installer', look: 'sm', along: 'y' });

// painted back to front (large x and small y are far): the cable and the cabinet (two panels), the line, the people
// (the installer, you)
const world = [
  w.room(ROOM),
  cueG('net', wallEntry + cabA),
  cueG('cab', hall.cabinet({ x: CAB2.x, w: CAB2.w, d: CAB2.d, h: CAB2.h }) + hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h })),
  cueG('cabB', cabB),
  cueG('trafo', trafo),
  cueG('swb', tray + hall.switchboard(SWB)),
  cueG('line3', hall.conveyor({ ...L3, cartons: 3 })),
  g('pp-installer', installer + hall.hat(INST.x, INST.y)),
  g('pp-jij', person('jij', JIJ.x, JIJ.y, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame
// (data-k): the four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the
// schemas of each beat. The shared Engineering map (the kit's mapScene) sits under the panel; its place Schakelinstallaties
// en beveiliging is a cue group of its own (map-switchgear).
const TILE = { devices: 'tDev', stations: 'tSta', protection: 'tPro', switching: 'tSwi' };
const PANEL = ['flowS', 'defS', 'grpA', 'grpB', 'askS', 'curS', 'rowS', 'mediumS', 'faultS', 'stepsS', 'setS', 'liveS', 'rulesS', 'whoS',
  'tool1', 'tool2', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, Schakelinstallaties en beveiliging lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP_W = 640;
const MAP_H = 1128;
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.switchgear'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.switchgear');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.switchgear')}"`), 'the map lights eng.switchgear as a cue group');
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
  { from: cam(140, 70, 50, 1.0), to: cam(140, 75, 50, 1.05) }, // s1 the whole hall: the cable, the cabinet, line 3
  { from: cam(50, 70, 55, 1.4), to: cam(50, 55, 65, 1.55) }, // s2 the cabinet
  { from: cam(55, 60, 60, 1.5), to: cam(55, 50, 70, 1.65) }, // s3 the row of panels
  { from: cam(140, 60, 50, 1.15), to: cam(70, 62, 58, 1.45), at: 2 }, // s4 the cabinet and line 3, then (b2) the installer at the cabinet
  { from: cam(70, 70, 55, 1.4), to: cam(60, 65, 60, 1.5) }, // s5 the cabinet, the installer and you
  { from: cam(150, 70, 60, 1), to: cam(150, 70, 60, 1) }, // s6 (the map)
];
// People are moved, in stage units, to where each scene needs them; the base places are INST and JIJ above.
const shiftOf = (from, to) => w.at([...to, 0]).map((v, i) => Math.round((v - w.at([...from, 0])[i]) * 10) / 10);
const INSTSHIFT = {};
const JIJSHIFT = {};

// ---------------------------------------------------------------- the film
const TOOL = (a, b) => ({ cue: { [a]: 'tool1', ...(b ? { [b]: 'tool2' } : {}) } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.switchgear.intro',
  title: { nl: 'De kast in hal B: schakelinstallaties en beveiliging', en: 'The cabinet in hall B: switchgear and protection' },
  module: 'eng.switchgear',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.switchgear, the scene that explains it and its tile
  topics: {
    devices: { scene: 's2', cue: 'tDev' },
    stations: { scene: 's3', cue: 'tSta' },
    protection: { scene: 's4', cue: 'tPro' },
    switching: { scene: 's5', cue: 'tSwi' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'De kast in hal B', en: 'The cabinet in hall B' },
      beats: [
        { nl: 'In hal B komt de stroom door de wand in een kast. Via transformator en schakelbord gaat hij naar lijn 3.', en: 'In hall B the power comes through the wall into a cabinet. Then transformer and switchboard feed line 3.', focus: ['flowS', 'net', 'cab', 'cabB', 'trafo', 'swb', 'line3', 'jij'] },
        { nl: 'De kast hoort bij een schakelinstallatie. Die schakelt, beveiligt en scheidt delen van het net.', en: 'The cabinet is part of switchgear. It switches, protects and isolates parts of the grid.', focus: ['defS', 'cab'] },
        { nl: 'Vier onderwerpen volgen de kast. Eerst de apparaten en de installatie die ze samen vormen.', en: 'Four topics follow the cabinet. First the devices and the installation they form together.', focus: 'grpA' },
        { nl: 'Daarna wat beveiligt bij een fout en hoe je veilig schakelt.', en: 'Then what protects when a fault happens and how you switch safely.', focus: 'grpB' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Apparaten', en: 'Devices' },
      beats: [
        { nl: 'Eerste onderwerp: Schakelapparaten. Bij elk apparaat vraag je wat het kan inschakelen en onderbreken.', en: 'First topic: Switching devices. For every device you ask what it can switch on and what it can break.', focus: ['tDev', 'askS', 'cab'] },
        { nl: 'Een fout komt veel harder aan dan normale stroom. Onderbreken is dus een zwaardere klus.', en: 'A fault hits much harder than normal current. So breaking it is a heavier job.', focus: ['curS', 'line3'] },
        { nl: 'Je let op het verschil tussen {t:Vermogensschakelaar|vermogensschakelaar} en {t:Lastscheider|lastscheider}.', en: 'You look at the difference between a {t:Circuit breaker|circuit breaker} and a {t:Load-break switch|load-break switch}.', ...TOOL('Vermogensschakelaar', 'Lastscheider'), focus: ['tool1', 'tool2', 'cab'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Installaties', en: 'Installations' },
      beats: [
        { nl: 'Tweede onderwerp: MS-installaties en stations. Een installatie is een rij kasten, elk een veld.', en: 'Second topic: MV installations and stations. An installation is a row of cabinets, each a panel.', focus: ['tSta', 'rowS', 'cab'] },
        { nl: 'Met lucht tussen de delen is een installatie groot. Met gas in een gesloten tank is hij compact.', en: 'With air between the parts an installation is big. With gas in a sealed tank it is compact.', focus: ['mediumS', 'cab'] },
        { nl: 'In een netstation is het MS-deel meestal een {t:RMU|RMU}.', en: 'In a secondary substation the MV part is usually an {t:RMU|RMU}.', ...TOOL('RMU'), focus: ['tool1'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Beveiliging', en: 'Protection' },
      beats: [
        { nl: 'Derde onderwerp: Beveiliging en kortsluiting. Stel dat er bij lijn 3 een kortsluiting komt.', en: 'Third topic: Protection and short circuits. Suppose a short circuit happens at line 3.', focus: ['tPro', 'faultS', 'line3'] },
        { nl: 'Een beveiliging meet de stroom en vergelijkt die met een instelling. Bij een fout opent de schakelaar.', en: 'A protection measures the current and compares it with a setting. At a fault the breaker opens.', focus: ['stepsS', 'cab'] },
        { nl: 'Een verkeerde instelling laat de schakelaar te vaak openen, of nooit.', en: 'A wrong setting makes the breaker open too often, or never.', focus: ['setS'] },
        { nl: 'De installateur test het {t:Beveiligingsrelais|beveiligingsrelais} en legt de instelling vast.', en: 'The installer tests the {t:Protection relay|protection relay} and records the setting.', ...TOOL('Beveiligingsrelais'), focus: ['tool1', 'installer', 'cab'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Veilig schakelen', en: 'Switching safely' },
      beats: [
        { nl: 'Vierde onderwerp: Veilig schakelen. Werk aan de kast gebeurt meestal spanningsloos.', en: 'Fourth topic: Switching safely. Work on the cabinet is mostly done dead.', focus: ['tSwi', 'liveS', 'cab'] },
        { nl: 'Daarvoor gelden de vijf veiligheidsregels, altijd in dezelfde volgorde.', en: 'The five safety rules apply, always in the same order.', focus: ['rulesS', 'cab'] },
        { nl: 'Alleen een aangewezen installateur werkt aan de kast. Jij gaat mee en raakt niets aan.', en: 'Only an appointed installer works on the cabinet. You go along and touch nothing.', focus: ['whoS', 'installer', 'jij'] },
        { nl: 'De installateur meet met een {t:Spanningzoeker|spanningzoeker} en plaatst een {t:Aardgarnituur|aardgarnituur}.', en: 'The installer tests with a {t:Voltage detector|voltage detector} and places an {t:Earthing set|earthing set}.', ...TOOL('Spanningzoeker', 'Aardgarnituur'), focus: ['tool1', 'tool2', 'installer', 'cab'] },
        { nl: 'Dan werkt de installateur veilig aan de kast.', en: 'Then the installer works safely on the cabinet.', focus: ['installer', 'cab'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. Schakelinstallaties en beveiliging is het tweede station van Energie en het net.', en: 'The whole map. Switchgear and protection is the second station of Energy and the grid.', focus: 'map-switchgear' },
        { nl: 'Elk onderwerp heeft vier niveaus.', en: 'Every topic has four levels.', focus: 'route' },
        { nl: 'Begin bij de les over vermogensschakelaars op niveau Basis. Die laat zien wat elk apparaat kan onderbreken.', en: 'Start with the lesson on circuit breakers at Basics level. It shows what each device can break.', focus: ['tDev', 'start'] },
        { nl: 'Op niveau Werkkennis komen de typeplaat, distributieautomatisering, selectiviteit en spanningsloos aantonen.', en: 'At Working knowledge level come the nameplate, distribution automation, selectivity and proving dead.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd komen het doven van de boog, rails, kortsluitstroom berekenen en wie mag schakelen.', en: 'At Advanced level come putting out the arc, busbars, calculating short-circuit current and who may switch.', focus: 'lv3' },
        { nl: 'Op niveau Expert gaat het om te hoog kortsluitvermogen, SF6, zonneparken en de MS-installatie van de klant.', en: 'At Expert level it is about too high a fault level, SF6, solar parks and the customer’s own MV installation.', focus: 'lv4' },
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
// without explaining them. Every drawn detail has its reason in the narration: the cable through the wall (the grid
// brings the power into the hall), the cabinet of two panels (the switchgear installation), line 3 (what the cabinet
// feeds and where the fault is supposed to be), the installer (he sets the relay and works on the cabinet), you (a
// consultant who goes along and touches nothing).
const SAY = [
  [ // s1 the power comes into the cabinet; what switchgear is; the map in two groups
    { nl: 'In hal B komt de stroom door de wand in een kast. Via transformator en schakelbord gaat hij naar lijn 3.',
      en: 'In hall B the power comes through the wall into a cabinet. Then transformer and switchboard feed line 3.' },
    { nl: 'De kast hoort bij een schakelinstallatie. Die schakelt, beveiligt en scheidt delen van het net.',
      en: 'The cabinet is part of switchgear. It switches, protects and isolates parts of the grid.' },
    { nl: 'Vier onderwerpen volgen de kast. Eerst de apparaten en de installatie die ze samen vormen.',
      en: 'Four topics follow the cabinet. First the devices and the installation they form together.' },
    { nl: 'Daarna wat beveiligt bij een fout en hoe je veilig schakelt.',
      en: 'Then what protects when a fault happens and how you switch safely.' },
  ],
  [ // s2 switching devices: what it can switch on and break; a fault hits harder
    { nl: 'Het eerste onderwerp is Schakelapparaten. Bij elk apparaat vraag je wat het kan inschakelen en wat het kan onderbreken.',
      en: 'The first topic is Switching devices. For every device you ask what it can switch on and what it can break.' },
    { nl: 'Een kortsluiting komt veel harder aan dan de normale stroom naar lijn 3. Onderbreken is dus een zwaardere klus dan inschakelen.',
      en: 'A short circuit hits much harder than the normal current to line 3. So breaking it is a heavier job than switching on.' },
    { nl: 'Daarom let je op het verschil tussen een {t:Vermogensschakelaar|vermogensschakelaar} en een {t:Lastscheider|lastscheider}.',
      en: 'So you look at the difference between a {t:Circuit breaker|circuit breaker} and a {t:Load-break switch|load-break switch}.' },
  ],
  [ // s3 MV installations and stations: a row of panels, air and gas, the RMU
    { nl: 'Het tweede onderwerp is MS-installaties en stations. Een installatie is een rij stalen kasten, en elke kast is een veld.',
      en: 'The second topic is MV installations and stations. An installation is a row of steel cabinets, and each cabinet is a panel.' },
    { nl: 'Met lucht tussen de delen is een installatie groot. Met gas in een gesloten tank wordt hij veel compacter.',
      en: 'With air between the parts an installation is big. With gas in a sealed tank it becomes much more compact.' },
    { nl: 'In een netstation is het MS-deel meestal een {t:RMU|RMU}, één compact blok.',
      en: 'In a secondary substation the MV part is usually an {t:RMU|RMU}, one compact block.' },
  ],
  [ // s4 protection and short circuits: measure, compare, trip; a wrong setting; the relay
    { nl: 'Het derde onderwerp is Beveiliging en kortsluiting. Stel dat er bij lijn 3 een kortsluiting komt. Dan moet de stroom snel stoppen.',
      en: 'The third topic is Protection and short circuits. Suppose a short circuit happens at line 3. Then the current must stop fast.' },
    { nl: 'Een beveiliging meet de stroom en vergelijkt die met een instelling. Bij een fout opent de schakelaar.',
      en: 'A protection measures the current and compares it with a setting. At a fault the breaker opens.' },
    { nl: 'Een verkeerde instelling laat de schakelaar te vaak openen, of nooit.',
      en: 'A wrong setting makes the breaker open too often, or never.' },
    { nl: 'Daarom test de installateur het {t:Beveiligingsrelais|beveiligingsrelais} en legt de instelling vast.',
      en: 'So the installer tests the {t:Protection relay|protection relay} and records the setting.' },
  ],
  [ // s5 switching safely: dead, the five rules, appointed people, then the story ends where the field film picks it up
    { nl: 'Het vierde onderwerp is Veilig schakelen. Werk aan de kast gebeurt meestal spanningsloos, dus uitgeschakeld en veilig gemaakt.',
      en: 'The fourth topic is Switching safely. Work on the cabinet is mostly done dead, so switched off and made safe.' },
    { nl: 'Daarvoor gelden de vijf veiligheidsregels, altijd in dezelfde volgorde. Elke regel stopt een echte fout.',
      en: 'The five safety rules apply, always in the same order. Each rule stops a real failure.' },
    { nl: 'Alleen een aangewezen installateur werkt aan de kast. Jij gaat mee en raakt niets aan.',
      en: 'Only an appointed installer works on the cabinet. You go along and touch nothing.' },
    { nl: 'De installateur meet met een {t:Spanningzoeker|spanningzoeker} en plaatst een {t:Aardgarnituur|aardgarnituur}.',
      en: 'The installer tests with a {t:Voltage detector|voltage detector} and places an {t:Earthing set|earthing set}.' },
    { nl: 'Dan werkt de installateur veilig aan de kast.',
      en: 'Then the installer works safely on the cabinet.' },
  ],
  [ // s6 the map: the level words of the app, as the captions show them
    { nl: 'De hele kaart. Schakelinstallaties en beveiliging is het tweede station van Energie en het net.',
      en: 'The whole map. Switchgear and protection is the second station of Energy and the grid.' },
    { nl: 'Elk onderwerp heeft vier niveaus.',
      en: 'Every topic has four levels.' },
    { nl: 'Begin bij de les over vermogensschakelaars op niveau Basis. Die laat zien wat elk apparaat kan onderbreken.',
      en: 'Start with the lesson on circuit breakers at Basics level. It shows what each device can break.' },
    { nl: 'Op niveau Werkkennis komen de typeplaat, distributieautomatisering, selectiviteit en spanningsloos aantonen.',
      en: 'At Working knowledge level come the nameplate, distribution automation, selectivity and proving dead.' },
    { nl: 'Op niveau Gevorderd komen het doven van de boog, rails, kortsluitstroom berekenen en wie mag schakelen.',
      en: 'At Advanced level come putting out the arc, busbars, calculating short-circuit current and who may switch.' },
    { nl: 'Op niveau Expert gaat het om te hoog kortsluitvermogen, SF6, zonneparken en de MS-installatie van de klant.',
      en: 'At Expert level it is about too high a fault level, SF6, solar parks and the customer’s own MV installation.' },
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
const preamble = `const CAM = ${JSON.stringify(CAM)};\nconst INSTSHIFT = ${JSON.stringify(INSTSHIFT)};\nconst JIJSHIFT = ${JSON.stringify(JIJSHIFT)};\nconst W = ${W}, H = ${H};\nconst LV = ${JSON.stringify(LV)};\nconst MAPZ = ${JSON.stringify(MAPZ)};\nconst MAPSZ = [${MAP_W}, ${MAP_H}];\nconst GRID = ${JSON.stringify(GRID)};\nconst KEYS = ${JSON.stringify(PANEL)};\nconst CW = ${JSON.stringify(CHAR_W)};\nconst wrapUnits = ${wrapUnits.toString()};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="jij"],[data-cue="installer"])';
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
  nl: 'Hal B van de fabriek, waar lijn 3 op zijn nieuwe plek draait. Door de linkerwand komt de kabel van het net binnen, naar een rij van twee stroomkasten langs de achterwand, de velden van de schakelinstallatie. Daarnaast een transformator met koelribben, een kabelgoot naar het schakelbord op de wand en rechts de verpakkingslijn met dozen. Een installateur bij de kasten en jij, de engineer. Rechts een paneel, gemarkeerd als voorbeeld of schema: de stroom van het net via kast, transformator en schakelbord naar lijn 3, wat een schakelinstallatie doet, twee vragen bij elk apparaat en een kortsluiting die harder aankomt dan normale stroom, een rij velden met lucht of gas als isolatie, een kortsluiting bij lijn 3 met meten, vergelijken en openen, een verkeerde instelling, het werk spanningsloos, de vijf veiligheidsregels en wie is aangewezen, met per onderwerp de naam van een of twee hulpmiddelen. Aan het eind de hele kaart van Engineering met Schakelinstallaties en beveiliging verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the factory, where line 3 runs at its new place. Through the left wall the cable from the grid comes in, to a row of two power cabinets along the back wall, the panels of the switchgear installation. Next to them a transformer with cooling ribs, a cable tray to the switchboard on the wall, and at the right the packing line with cartons. An installer by the cabinets and you, the engineer. At the right a panel, marked as an example or a diagram: the power from the grid through cabinet, transformer and switchboard to line 3, what switchgear does, two questions for every device and a short circuit that hits harder than normal current, a row of panels with air or gas as insulation, a short circuit at line 3 with measuring, comparing and opening, a wrong setting, work done dead, the five safety rules and who is appointed, with the names of one or two tools per topic. At the end the whole map of Engineering with Switchgear and protection lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

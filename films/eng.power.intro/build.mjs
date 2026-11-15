// Dev tool, not shipped. Builds the module intro film "Van stroom naar beweging / From power to motion" for Motoren,
// aandrijvingen en perslucht (eng.power), an Engineering module intro film (v17, Task 13): the high-over picture at the
// top of the module, before its four topics (Merijn, 13 Nov: "that high-over picture is the thing I need the most").
// Pattern and rules: films/eng.machining.intro (the approved reference), eng.gridbasics.intro and eng.transformers.intro
// (the energy intros) and the notes section "Engineering module intros".
//
//   node films/eng.power.intro/build.mjs            build the page
//   node films/eng.power.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.power.intro.html: one offline page with the anatomy kit, the stage script and
// the player inlined. The index names it (eng.power's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The story: hall B of the field film films/eng.field.energy ("Energie en het net": line 3 moves and needs more power;
// its fourth station, Motoren en perslucht, says the motor drives the belt of line 3, the compressor compresses air for
// the line, that air is costly energy and leaks waste power, you measure the motor current with a clamp meter and run a
// leak test, and without this the air leaks away and an oversized motor runs at half load). This film follows what the
// switchboard of hall B feeds: the motor under the belt of line 3 and the compressor with its hose to the line, at
// person scale, drawn as in the field film. Every topic of the module has its place on that one road:
//   s1 a motor turns the belt and a compressor makes air, both fed from the switchboard; power is how fast you use energy
//      (as the first lesson words it); the map before any detail: two topics about the power and the motor that uses it
//      (electricity and energy in the plant; electric motors), two about driving the motor and carrying the power on
//      (starting and drives; compressed air and hydraulics)                              → the route in the panel
//   s2 Elektriciteit en energie in de fabriek: the bill counts kWh, the grid connection counts kW; efficiency is how much
//      is left as motion, the rest is heat; on the nameplate of the motor you read the rated power (Basis, .basics)
//                                                                                        → .basics (typeplaatje)
//   s3 Elektromotoren: the induction motor drives most conveyors, pumps, fans and compressors; the stator makes a rotating
//      field that drags the rotor along, a little slower; many motors run at half load or less, which you see with a clamp
//      meter round one cable (Basis, .motors; Werkkennis, .sizing)                       → .sizing (stroomtang)
//   s4 Aanlopen en aandrijvingen: switched on directly a motor draws 6 to 8 times its rated current; a soft starter ramps
//      the voltage up; a VFD changes the frequency and so the speed (Basis, .drives)       → .drives (softstarter, VFD)
//   s5 Perslucht en hydrauliek: compressed air is the most expensive way to deliver energy, around 10 percent does useful
//      work; leaks take often 20 to 30 percent, a leak test at the weekend shows it (Basis, .air); hydraulics uses oil
//      under high pressure for large forces in a small space (Werkkennis, .hydraulics)    → .air (lektest)
//   s6 the shared Engineering map (the kit's mapScene) with Motoren, aandrijvingen en perslucht lit, then the module's four
//      topics with their levels as columns, where to start, and what each later level adds, in the app's level words
// Per the review of eng.machining.intro: how the topics hang together is said once, in s1, before any detail; a topic scene
// is short (what it is, its place in the story with a reason, then the tool sentence); the tools are real things of the
// topic at Basis or Working knowledge level, one short sentence each, not explained; a Werkkennis tool named in a scene is
// not named again in the closing grid, nor is any other tool of the film; the closing grid has one beat per later level
// in the app's level words; the story ends where the field film picks it up. Nothing is drawn only to have a tool: the
// nameplate is on the motor, the clamp meter and the leak test are the field film's two tools, and the soft starter and
// the VFD sit between the switchboard and the motor, so the panel shows them and the room does not. Pumps and pump curves
// belong to eng.fluids and are not named here. The switchgear intro owns the breaker, the relay and the earthing set; the
// switchboard appears here only as the place the power comes from.
// Definitions as the Basis lessons word them (eng.power.basics, .motors, .drives, .air). Terms come from the module's
// lessons and {n:} numbers from the module's text (the kit's intro mode, films/_kit/build-film.mjs); the kit holds the film
// to its map (every topic named in a caption of its own scene, explained in two beats and lit), its narration guard and
// its label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): hall B as in the energy field film (the shared hall of
// films/pm.plan.intro/hall.mjs: the switchboard, a packing line), with the field film's motor and compressor with its hose,
// simple solids drawn here. A panel at the right, in stage space, draws each step as a schema, labelled "voorbeeld" (hall
// B's way) or "schema" (the module's map).
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
const MOD = MODULES.find((m) => m.id === 'eng.power');
const LEVELS = {
  electric: ['eng.power.basics', 'eng.power.energy', 'eng.power.reactive', 'eng.power.baseline'],
  motors: ['eng.power.motors', 'eng.power.sizing', 'eng.power.protect', 'eng.power.motorpolicy'],
  drives: ['eng.power.drives', 'eng.power.vfd', 'eng.power.harmonics', 'eng.power.drivesystem'],
  fluid: ['eng.power.air', 'eng.power.hydraulics', 'eng.power.airsystem', 'eng.power.fluidsafety'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.power has the four topics and levels this film draws');
assert(MOD.intro === 'eng.power.intro', 'eng.power names this film as its intro');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s1: power as the first lesson words it
has('eng.power.basics', ['Vermogen (power) is hoe snel je energie verbruikt', 'Energie is vermogen × tijd']);
has('eng.power.basics', ['Power is the rate of using energy', 'Energy is power × time'], 'en');
// s2: the bill counts kWh, the connection counts kW; efficiency, the rest becomes heat; the nameplate
has('eng.power.basics', ['De energierekening rekent in kWh; de netaansluiting en piekkosten gaan over kW', 'Rendement is nuttige output gedeeld door input', 'de rest wordt warmte',
  'Op het typeplaatje, het metalen plaatje op de behuizing, staat het nominaal vermogen', 'Typeplaatje Het plaatje op een motor']);
has('eng.power.basics', ['The energy bill charges kWh; the grid connection and peak charges are about kW', 'Efficiency is useful output divided by input', 'the rest becomes heat',
  'A motor nameplate, the metal plate on the housing, gives the rated power', 'Nameplate The plate on a motor'], 'en');
// s3: the induction motor, the rotating field, the rotor a little slower; the clamp meter and the half load
has('eng.power.motors', ['drijft de meeste pompen, ventilatoren, transportbanden en compressoren aan', 'maakt een draaiend magnetisch veld', 'wordt door dat veld meegesleept', 'De rotor draait altijd iets langzamer']);
has('eng.power.motors', ['drives most pumps, fans, conveyors and compressors', 'makes a rotating magnetic field', 'is dragged along by that field', 'The rotor always runs a little slower'], 'en');
has('eng.power.sizing', ['Veel motoren draaien op halve belasting of minder', 'Stroomtang Een tangvormige meter die je om één kabel sluit']);
has('eng.power.sizing', ['Many motors run at half load or less', 'Clamp meter A tong-shaped meter closed around one cable'], 'en');
// s4: direct on line, the soft starter, the VFD
has('eng.power.drives', ['de aanloopstroom is 6 tot 8 keer de nominale stroom', 'Een softstarter laat de motorspanning in een paar seconden oplopen', 'Een frequentieregelaar (VFD, ook omvormer) verandert de frequentie en daarmee het toerental, traploos',
  'bandsnelheid', 'Softstarter Laat de spanning oplopen', 'Frequentieregelaar Regelt het toerental']);
has('eng.power.drives', ['the starting current is 6 to 8 times the rated current', 'A soft starter ramps up the motor voltage over a few seconds', 'changes the frequency, and so the speed, smoothly',
  'conveyor speed', 'Soft starter Ramps up the voltage', 'VFD Variable frequency drive'], 'en');
// s5: compressed air is the most expensive way, around 10 percent, the leaks, the leak test; hydraulics
has('eng.power.air', ['de duurste manier om energie in een fabriek rond te brengen', 'zo’n 10% doet nuttig werk bij de gebruiker', 'ontsnapt vaak 20 tot 30% van wat de compressor levert via koppelingen, slangen en ventielen',
  'Een lektest laat het zien: kijk in het weekend, met de productie stil', 'Lektest De compressorbelasting meten terwijl de productie stilligt']);
has('eng.power.air', ['the most expensive way to deliver energy in a plant', 'only around 10% does useful work at the point of use', 'often 20 to 30% of the compressor output escapes through couplings, hoses and valves',
  'A leak test shows it: at a weekend, with production stopped', 'Leak test Measuring compressor load with production stopped'], 'en');
has('eng.power.hydraulics', ['Hydrauliek gebruikt olie onder hoge druk', 'om grote krachten te maken in een kleine ruimte']);
has('eng.power.hydraulics', ['Hydraulics uses oil under high pressure', 'to make large forces in a small space'], 'en');
// s6: where to start, then the later levels, as the lessons are titled
has('eng.power.basics', ['Vermogen, energie en draaistroom']);
has('eng.power.basics', ['Power, energy and three-phase'], 'en');
for (const [id, word] of [['eng.power.energy', 'kWh per product'], ['eng.power.sizing', 'Motorbelasting'], ['eng.power.vfd', 'Frequentieregelaars en energie'], ['eng.power.hydraulics', 'Hydrauliek'],
  ['eng.power.reactive', 'Arbeidsfactor'], ['eng.power.protect', 'Motorbeveiliging'], ['eng.power.harmonics', 'Harmonischen'], ['eng.power.airsystem', 'luchtkwaliteit'],
  ['eng.power.baseline', 'Energiebaselines'], ['eng.power.motorpolicy', 'repareren of vervangen'], ['eng.power.drivesystem', 'Een aandrijfsysteem specificeren'], ['eng.power.fluidsafety', 'veilig ontwerpen']]) has(id, [word]);
for (const [id, word] of [['eng.power.energy', 'kWh per product'], ['eng.power.sizing', 'Motor load'], ['eng.power.vfd', 'VFDs and energy'], ['eng.power.hydraulics', 'Hydraulics'],
  ['eng.power.reactive', 'Power factor'], ['eng.power.protect', 'Motor protection'], ['eng.power.harmonics', 'Harmonics'], ['eng.power.airsystem', 'air quality'],
  ['eng.power.baseline', 'Energy baselines'], ['eng.power.motorpolicy', 'repair-or-replace'], ['eng.power.drivesystem', 'Specifying a drive system'], ['eng.power.fluidsafety', 'safe by design']]) has(id, [word], 'en');
// s6: the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from
// GRID.x; the words stand on one line each, staggered over two rows (columns 1 and 3 high, 2 and 4 low), so a
// word may be wider than its column but not wider than the room to the next word on its row, nor run off the stage.
const LV = { nl: levelWords('nl'), en: levelWords('en') };
const GRID = { x: 276, col: 90, box: 82, tile: 252, top: 60, pitch: 82, h: 76 };
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
// s1: the route rows (stage.js, routeGroup) wrap the index titles into 240 units, at most three lines, and the two groups
// fit one under the other (group A from y 70, group B from y 230)
for (const lang of ['nl', 'en']) {
  const rows = (i) => { const n = wrapUnits(MOD.topics[i].title[lang], 240, CHAR_W).length; return (n === 1 ? 34 : n * 22 + 8) + 4; };
  for (const id of ORDER) assert(wrapUnits(MOD.topics.find((t) => t.id === id).title[lang], 240, CHAR_W).length <= 3, `the route row of "${id}" (${lang}) needs more than three lines`);
  assert(70 + 8 + rows(0) + rows(1) <= 226, `the first route group (${lang}) runs into the second`);
  assert(230 + 8 + rows(2) + rows(3) <= 384, `the second route group (${lang}) runs off the panel`);
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

// where things stand (cm), as in the energy field film: the switchboard on the back wall above line 3 at the right, the motor
// on the front of the belt's bench just under the belt, the compressor at the front right of the room with its hose along the
// floor to the line, where it connects left of the motor
const SWB = { x: 218, w: 50, z0: 96, z1: 172 };
const L3 = { x: 186, y: 16, len: 84, dep: 34 };
const MOTOR = { x0: 238, x1: 264, y: 59, z: 40, r: 8 };
const COMP = { x: 242, y: 138 };
// the motor: a horizontal drum on a bracket, with a terminal box on top
const motor = w.box({ x: MOTOR.x0 + 8, y: L3.y + L3.dep, w: 10, d: MOTOR.y - L3.y - L3.dep - MOTOR.r + 1, r: 0.6 }, MOTOR.z - 6, MOTOR.z + 6, { tone: 'lo' }, { steps: 1 })
  + k.solidSvg(G.disc(0, MOTOR.x1 - MOTOR.x0, MOTOR.r, G.frameOf([MOTOR.x0, MOTOR.y, MOTOR.z], [1, 0, 0], [0, 1, 0], [0, 0, 1]), P, { steps: 20 }), { tone: 'mid', crease: 'none' })
  + w.box({ x: MOTOR.x0 + 8, y: MOTOR.y - 5, w: 10, d: 10, r: 1.4 }, MOTOR.z + MOTOR.r - 1, MOTOR.z + MOTOR.r + 6, { tone: 'hi' }, { steps: 1 });
// the compressor: a horizontal air tank on two legs with the motor and pump block on top, and the hose
const comp = w.box({ x: COMP.x + 6, y: COMP.y + 4, w: 6, d: 20, r: 1 }, 0, 12, { tone: 'lo' }, { steps: 1 })
  + w.box({ x: COMP.x + 34, y: COMP.y + 4, w: 6, d: 20, r: 1 }, 0, 12, { tone: 'lo' }, { steps: 1 })
  + k.solidSvg(G.disc(0, 44, 14, G.frameOf([COMP.x, COMP.y + 14, 26], [1, 0, 0], [0, 1, 0], [0, 0, 1]), P, { steps: 20 }), { tone: 'mid', crease: 'none' })
  + w.box({ x: COMP.x + 10, y: COMP.y + 6, w: 24, d: 16, r: 2 }, 38, 54, { tone: 'hi' }, { steps: 2 });
const hose = hall.cable([[COMP.x + 22, COMP.y + 4], [COMP.x + 22, 78], [228, 78], [228, L3.y + L3.dep + 2]], { dashed: false })
  + w.box({ x: 224, y: L3.y + L3.dep, w: 8, d: 6, r: 1 }, 36, 52, { tone: 'hi' }, { steps: 1 });

const JIJ = { x: 118, y: 104 };

// painted back to front (large x and small y are far): the switchboard, the line, the motor, the compressor with its hose,
// you
const world = [
  w.room(ROOM),
  cueG('swb', hall.switchboard(SWB)),
  cueG('line3', hall.conveyor({ ...L3, cartons: 3 })),
  cueG('motor', motor),
  cueG('air', comp + hose),
  g('pp-jij', person('jij', JIJ.x, JIJ.y, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame
// (data-k): the four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the
// schemas of each beat. The shared Engineering map (the kit's mapScene) sits under the panel; its place Motoren,
// aandrijvingen en perslucht is a cue group of its own (map-power).
const TILE = { electric: 'tEl', motors: 'tMot', drives: 'tDrv', fluid: 'tFl' };
const PANEL = ['flowS', 'defS', 'grpA', 'grpB', 'kwS', 'effS', 'motS', 'fieldS', 'loadS', 'peakS', 'softS', 'speedS', 'airS', 'leakS', 'testS', 'hydS',
  'tool1', 'tool2', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, Motoren, aandrijvingen en perslucht lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP_W = 640;
const MAP_H = 1128;
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.power'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.power');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.power')}"`), 'the map lights eng.power as a cue group');
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
  { from: cam(215, 70, 60, 1.2), to: cam(215, 75, 60, 1.3) }, // s1 the switchboard, the line, the motor and the compressor, you at the left
  { from: cam(232, 45, 80, 1.7), to: cam(232, 48, 75, 1.8) }, // s2 the switchboard and the motor
  { from: cam(248, 58, 42, 2.6), to: cam(248, 60, 42, 2.9) }, // s3 the motor under the belt
  { from: cam(228, 50, 50, 2.0), to: cam(234, 52, 50, 2.1) }, // s4 the motor and the belt
  { from: cam(245, 100, 35, 1.7), to: cam(245, 104, 35, 1.8) }, // s5 the compressor and its hose to the line
  { from: cam(150, 70, 60, 1), to: cam(150, 70, 60, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a, key = 'tool1') => ({ cue: { [a]: key } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.power.intro',
  title: { nl: 'Van stroom naar beweging: motoren en perslucht', en: 'From power to motion: motors and fluid power' },
  module: 'eng.power',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.power, the scene that explains it and its tile
  topics: {
    electric: { scene: 's2', cue: 'tEl' },
    motors: { scene: 's3', cue: 'tMot' },
    drives: { scene: 's4', cue: 'tDrv' },
    fluid: { scene: 's5', cue: 'tFl' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Van stroom naar beweging', en: 'From power to motion' },
      beats: [
        { nl: 'In hal B draait een motor de band van lijn 3 en een compressor maakt lucht.', en: 'In hall B a motor turns the belt of line 3 and a compressor makes air.', focus: ['flowS', 'swb', 'motor', 'air', 'line3'] },
        { nl: 'Vermogen is hoe snel je energie verbruikt.', en: 'Power is the rate of using energy.', focus: ['defS', 'motor', 'air'] },
        { nl: 'Vier onderwerpen. Eerst de stroom en de motor die hem gebruikt.', en: 'Four topics. First the power and the motor that uses it.', focus: 'grpA' },
        { nl: 'Dan hoe je de motor start en regelt, en perslucht en hydrauliek.', en: 'Then how you start and control the motor, and compressed air and hydraulics.', focus: 'grpB' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Elektriciteit', en: 'Electricity' },
      beats: [
        { nl: 'Eerste onderwerp: Elektriciteit en energie in de fabriek. De rekening telt kWh, de aansluiting kW.', en: 'First topic: Electricity and energy in the plant. The bill counts kWh, the connection kW.', focus: ['tEl', 'kwS', 'swb'] },
        { nl: 'Rendement is hoeveel stroom als beweging overblijft. De rest wordt warmte.', en: 'Efficiency is how much power is left as motion. The rest becomes heat.', focus: ['effS', 'motor'] },
        { nl: 'Op het {t:Typeplaatje|typeplaatje} van de motor lees je het nominale vermogen.', en: 'On the {t:Nameplate|nameplate} of the motor you read the rated power.', ...TOOL('Typeplaatje'), focus: ['tool1', 'motor'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'De motor', en: 'The motor' },
      beats: [
        { nl: 'Tweede onderwerp: Elektromotoren. Op de band van lijn 3 zit een asynchrone motor.', en: 'Second topic: Electric motors. The belt of line 3 has an induction motor.', focus: ['tMot', 'motS', 'motor', 'line3'] },
        { nl: 'Een draaiend magnetisch veld sleept de rotor mee. De rotor loopt iets langzamer.', en: 'A rotating magnetic field drags the rotor along. The rotor runs a little slower.', focus: ['fieldS', 'motor'] },
        { nl: 'Veel motoren draaien op halve belasting. Een {t:Stroomtang|stroomtang} laat zien wat hij trekt.', en: 'Many motors run at half load. A {t:Clamp meter|clamp meter} shows what one draws.', ...TOOL('Stroomtang'), focus: ['tool1', 'loadS', 'motor'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Aanlopen', en: 'Starting' },
      beats: [
        { nl: 'Derde onderwerp: Aanlopen en aandrijvingen. Direct inschakelen geeft een grote stroompiek.', en: 'Third topic: Starting and drives. Switching on directly gives a big current spike.', focus: ['tDrv', 'peakS', 'motor'] },
        { nl: 'Een {t:Softstarter|softstarter} laat de spanning langzaam oplopen. De piek blijft klein.', en: 'A {t:Soft starter|soft starter} ramps the voltage up slowly. The spike stays small.', ...TOOL('Softstarter'), focus: ['tool1', 'softS', 'motor'] },
        { nl: 'Een {t:Frequentieregelaar|frequentieregelaar} regelt ook het toerental, traploos.', en: 'A {t:VFD|VFD} also controls the speed, smoothly.', ...TOOL('Frequentieregelaar', 'tool2'), focus: ['tool2', 'speedS', 'motor', 'line3'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Perslucht', en: 'Compressed air' },
      beats: [
        { nl: 'Vierde onderwerp: Perslucht en hydrauliek. Perslucht is dure energie. Zo’n {n:10} procent doet werk.', en: 'Fourth topic: Compressed air and hydraulics. Compressed air is costly energy. Around {n:10} percent does work.', focus: ['tFl', 'airS', 'air'] },
        { nl: 'Lekken zijn het grote verlies. Vaak ontsnapt {n:20} tot {n:30} procent.', en: 'Leaks are the big loss. Often {n:20} to {n:30} percent escapes.', focus: ['leakS', 'air'] },
        { nl: 'Met een {t:Lektest|lektest} zie je in het weekend hoeveel lucht weglekt.', en: 'A {t:Leak test|leak test} shows at the weekend how much air leaks away.', ...TOOL('Lektest'), focus: ['tool1', 'testS', 'air'] },
        { nl: 'Hydrauliek gebruikt olie onder hoge druk voor grote krachten.', en: 'Hydraulics uses oil under high pressure for large forces.', focus: ['hydS'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. Motoren, aandrijvingen en perslucht is het vierde station van Energie en het net.', en: 'The whole map. Motors, drives and fluid power is the fourth station of Energy and the grid.', focus: 'map-power' },
        { nl: 'Elk onderwerp heeft vier niveaus.', en: 'Every topic has four levels.', focus: 'route' },
        { nl: 'Begin bij Vermogen, energie en draaistroom op niveau Basis. Die les legt kilowatt en kilowattuur uit.', en: 'Start with Power, energy and three-phase at Basics level. That lesson explains kilowatts and kilowatt-hours.', focus: ['tEl', 'start'] },
        { nl: 'Op niveau Werkkennis gaat het om energie per product, motorbelasting, toerenregeling en hydrauliek.', en: 'At Working knowledge level it is about energy per product, motor load, speed control and hydraulics.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd gaat het om arbeidsfactor, motorbeveiliging, harmonischen en luchtkwaliteit.', en: 'At Advanced level it is about power factor, motor protection, harmonics and air quality.', focus: 'lv3' },
        { nl: 'Op niveau Expert gaat het om energiebaselines, repareren of vervangen, aandrijfsystemen en veilig ontwerpen.', en: 'At Expert level it is about energy baselines, repair or replace, drive systems and safe design.', focus: 'lv4' },
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
// inside a sentence at 0.4 s. Units are said as words (kilowatt, kilowattuur, procent), so no narration rule is needed.
// Each topic scene ends on one short sentence naming the tool of that topic's lessons, without explaining it. Every
// drawn detail has its reason in the narration: the switchboard (the motor and the compressor get their power there),
// the motor under the belt (it drives the belt of line 3; its nameplate and its current are read there), the compressor
// with its hose (the air for the line, where it leaks), you (you measure and test, as in the field film).
const SAY = [
  [ // s1 hall B's motor and compressor: what power is, the map in two groups
    { nl: 'In hal B draait een motor de band van lijn 3 aan. Een compressor maakt lucht. Beide krijgen hun stroom van het schakelbord.',
      en: 'In hall B a motor turns the belt of line 3. A compressor makes air. Both get their power from the switchboard.' },
    { nl: 'Vermogen is hoe snel je energie verbruikt.',
      en: 'Power is the rate of using energy.' },
    { nl: 'Vier onderwerpen volgen dat verhaal. Eerst de stroom en de motor die hem gebruikt.',
      en: 'Four topics follow that story. First the power and the motor that uses it.' },
    { nl: 'Dan hoe je de motor start en regelt, en de perslucht en de hydrauliek.',
      en: 'Then how you start and control the motor, and the compressed air and the hydraulics.' },
  ],
  [ // s2 electricity and energy in the plant: kilowatt against kilowatt hour, efficiency, the nameplate
    { nl: 'Het eerste onderwerp is Elektriciteit en energie in de fabriek. De energierekening telt kilowattuur en de netaansluiting telt kilowatt.',
      en: 'The first topic is Electricity and energy in the plant. The energy bill counts kilowatt-hours and the grid connection counts kilowatts.' },
    { nl: 'Rendement is hoeveel van de stroom als beweging overblijft. De rest wordt warmte.',
      en: 'Efficiency is how much of the power is left as motion. The rest becomes heat.' },
    { nl: 'Op het {t:Typeplaatje|typeplaatje} van de motor lees je het nominale vermogen.',
      en: 'On the {t:Nameplate|nameplate} of the motor you read the rated power.' },
  ],
  [ // s3 electric motors: the induction motor, the rotating field, half load and the clamp meter
    { nl: 'Het tweede onderwerp is Elektromotoren. Op de band van lijn 3 zit een asynchrone motor, zoals op de meeste transportbanden.',
      en: 'The second topic is Electric motors. The belt of line 3 has an induction motor, like most conveyors.' },
    { nl: 'De stator maakt een draaiend magnetisch veld. Dat veld sleept de rotor mee, en de rotor draait altijd iets langzamer.',
      en: 'The stator makes a rotating magnetic field. That field drags the rotor along, and the rotor always runs a little slower.' },
    { nl: 'Veel motoren draaien op halve belasting of minder. Met een {t:Stroomtang|stroomtang} om een kabel zie je wat de motor echt trekt.',
      en: 'Many motors run at half load or less. With a {t:Clamp meter|clamp meter} round one cable you see what the motor really draws.' },
  ],
  [ // s4 starting and drives: the spike of a direct start, the soft starter, the VFD
    { nl: 'Het derde onderwerp is Aanlopen en aandrijvingen. Een motor die direct inschakelt, trekt {n:6} tot {n:8} keer zijn nominale stroom.',
      en: 'The third topic is Starting and drives. A motor switched straight on draws {n:6} to {n:8} times its rated current.' },
    { nl: 'Een {t:Softstarter|softstarter} laat de spanning in een paar seconden oplopen. Dat beperkt de piek en de ruk.',
      en: 'A {t:Soft starter|soft starter} ramps the voltage up over a few seconds. That cuts the spike and the jolt.' },
    { nl: 'Een {t:Frequentieregelaar|frequentieregelaar} verandert de frequentie en daarmee het toerental, traploos. Zo kan de band van lijn 3 sneller of langzamer lopen.',
      en: 'A {t:VFD|VFD} changes the frequency and so the speed, smoothly. That lets the belt of line 3 run faster or slower.' },
  ],
  [ // s5 compressed air and hydraulics: costly energy, the leaks, the leak test, the oil; the story ends where the field film picks it up
    { nl: 'Het vierde onderwerp is Perslucht en hydrauliek. Perslucht is de duurste manier om energie in een fabriek rond te brengen. Zo’n {n:10} procent doet nuttig werk, de rest wordt warmte.',
      en: 'The fourth topic is Compressed air and hydraulics. Compressed air is the most expensive way to deliver energy in a plant. Around {n:10} percent does useful work and the rest becomes heat.' },
    { nl: 'Lekken zijn het grote verlies. Zonder lekprogramma ontsnapt vaak {n:20} tot {n:30} procent van wat de compressor levert.',
      en: 'Leaks are the big loss. Without a leak programme often {n:20} to {n:30} percent of the compressor output escapes.' },
    { nl: 'Met een {t:Lektest|lektest} meet je in het weekend, bij stilstaande productie, hoeveel lucht weglekt.',
      en: 'With a {t:Leak test|leak test} you measure at the weekend, with production stopped, how much air leaks away.' },
    { nl: 'Hydrauliek gebruikt olie onder hoge druk om grote krachten te maken in een kleine ruimte.',
      en: 'Hydraulics uses oil under high pressure to make large forces in a small space.' },
  ],
  [ // s6 the map: the level words of the app, as the captions show them
    { nl: 'De hele kaart. Motoren, aandrijvingen en perslucht is het vierde station van Energie en het net.',
      en: 'The whole map. Motors, drives and fluid power is the fourth station of Energy and the grid.' },
    { nl: 'Elk onderwerp heeft vier niveaus.',
      en: 'Every topic has four levels.' },
    { nl: 'Begin bij Vermogen, energie en draaistroom op niveau Basis. Die les legt kilowatt en kilowattuur uit.',
      en: 'Start with Power, energy and three-phase at Basics level. That lesson explains kilowatts and kilowatt-hours.' },
    { nl: 'Op niveau Werkkennis gaat het om energie per product, motorbelasting, toerenregeling en hydrauliek.',
      en: 'At Working knowledge level it is about energy per product, motor load, speed control and hydraulics.' },
    { nl: 'Op niveau Gevorderd gaat het om arbeidsfactor, motorbeveiliging, harmonischen en luchtkwaliteit.',
      en: 'At Advanced level it is about power factor, motor protection, harmonics and air quality.' },
    { nl: 'Op niveau Expert gaat het om energiebaselines, repareren of vervangen, aandrijfsystemen en veilig ontwerpen.',
      en: 'At Expert level it is about energy baselines, repair or replace, drive systems and safe design.' },
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
  nl: 'Hal B van de fabriek, waar lijn 3 op zijn nieuwe plek draait. Aan de achterwand hangt het schakelbord boven de verpakkingslijn met dozen. Onder de band zit een motor met een klemmenkast, en voor in de hal staat een compressor met een luchttank en een slang naar de lijn. Jij, de engineer, staat in de hal. Rechts een paneel, gemarkeerd als voorbeeld of schema: van schakelbord naar motor, compressor en band, vermogen en energie, kilowatt tegenover kilowattuur, een balk voor rendement waarvan een klein deel warmte is, vier soorten belasting van een motor, een stator met een rotor, een balk met een halve belasting, een stroompiek bij direct inschakelen, een stroomopbouw bij een softstarter, een frequentie die een toerental regelt, een balk waarvan een klein deel nuttig werk is, een slang met lekken, een balk voor de compressorbelasting bij stilstaande productie, een cilinder met olie onder druk, met per onderwerp de naam van een hulpmiddel, en op het eind de kaart van Engineering en de onderwerpen met hun vier niveaus.',
  en: 'Hall B of the factory, where line 3 runs at its new place. On the back wall hangs the switchboard above the packing line with cartons. Under the belt sits a motor with a terminal box, and at the front of the hall stands a compressor with an air tank and a hose to the line. You, the engineer, stand in the hall. At the right a panel, marked as an example or a diagram: from switchboard to motor, compressor and belt, power and energy, kilowatts against kilowatt-hours, a bar for efficiency of which a small part is heat, four kinds of load for a motor, a stator with a rotor, a bar with half load, a current spike at a direct start, a current ramp with a soft starter, a frequency that sets a speed, a bar of which a small part is useful work, a hose with leaks, a bar for the compressor load while production is stopped, a cylinder with oil under pressure, with for each topic the name of a tool, and at the end the Engineering map and the topics with their four levels.',
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

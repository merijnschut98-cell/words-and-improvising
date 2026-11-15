// Dev tool, not shipped. Builds the module intro film "Van het net tot hal B / From the grid to hall B" for
// Het elektriciteitsnet (eng.gridbasics), an Engineering module intro film (v17, Task 13) and the first intro of the
// energy zone: the high-over picture at the top of the module, before its four topics (Merijn, 13 Nov: "that
// high-over picture is the thing I need the most"). Pattern and rules: films/eng.machining.intro (the approved
// reference), eng.joining.intro, eng.moulding.intro, eng.mechanics.intro and eng.process.intro, and the notes
// section "Engineering module intros".
//
//   node films/eng.gridbasics.intro/build.mjs            build the page
//   node films/eng.gridbasics.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.gridbasics.intro.html: one offline page with the anatomy kit, the stage
// script and the player inlined. The index names it (eng.gridbasics's `intro`), coursehome shows it above the
// topics, sw.js precaches it.
//
// The story: hall B of the field film films/eng.field.energy ("Energie en het net": line 3 moves and needs more
// power; its first station, Het elektriciteitsnet, says the cable from the grid comes in through the left wall, that
// at high voltage little is lost and the voltage only steps down close to the plant, that you check the capacity map
// and sign a flexible contract if needed, and that without this you wait in a queue for power in a full area). This
// film starts from the factory's own connection, the cable through the left wall, the power cabinet and the line, and
// goes outward, at person scale: the hall, the cable, the people of the field film (you, the engineer, and the
// installer, plus a technician of the grid operator who comes to the wall where the cable enters). Every topic of
// the module has its place on that one road:
//   s1 line 3 needs more power and it comes from the grid; power is how fast you use energy (as the first lesson
//      words it) and the grid is built for the highest power; the map before any detail: four topics, two about
//      the power and its path (power, load and voltage; the grid from high to low), two about who runs it and why it
//      is full (roles, rules and money; congestion and the energy transition)             → eng.gridbasics.basics
//   s2 Vermogen, belasting en spanning: voltage is the pressure, current the flow, power how fast energy is used;
//      the grid carries the highest power at one moment, the peak, not the yearly total (line 3 starting up is
//      such a peak); the hall's roof has solar panels, an inverter on the wall turns their power into grid power
//      (Werkkennis, .load)                                                              → .basics (.load)
//   s3 Het net van hoog naar laag: little is lost at high voltage, the voltage steps down close to the user; you
//      read the main fuse on the cabinet, where the factory's part begins, and follow the cable to the
//      substation (Werkkennis, .path)                                                   → .levels (.path)
//   s4 Rollen, regels en geld: the grid operator brings the cable into the hall, TenneT runs the highest grid, the
//      supplier sells the energy and you choose it; there is one grid per area, so a regulator sets rules and
//      tariffs; you look up the connection rules in the system code (Werkkennis, .law)  → .roles (.law)
//   s5 Netcongestie en de energietransitie: the grid in this region is full and more and more is asked of it, so a
//      new customer queues and building takes 5 to 10 years; you look at the capacity map and sign a flexible
//      contract if needed (the field film's wording, Basis, .congestion); with it line 3 moves out of the few
//      peak hours and gets its power; the installer connects it                         → .congestion
//   s6 the shared Engineering map (the kit's mapScene) with Het elektriciteitsnet lit, then the module's four
//      topics with their levels as columns, where to start, and what each later level adds, in the app's level
//      words
// Per the review of eng.machining.intro: how the topics hang together is said once, in s1, before any detail; a
// topic scene is short (what it is, its place in the story with a reason, then the tool sentence); the tools are
// real things of the topic at Basis or Working knowledge level (omvormer, hoofdzekering and onderstation,
// systeemcode, capaciteitskaart and flexibel contract, the last two as in the field film), one short sentence each,
// not explained; a Werkkennis tool named in a scene is not named again in the closing grid (it says the route to the
// socket, laws and duties and the queue, not the substation, the codes or the capacity map); the closing grid has
// one beat per later level in the app's level words; the people are plant people; the story ends where the field
// film picks it up (the installer connects line 3), in the last topic scene. The investment plan (Basis, but also a
// term of eng.gridplanning) and the netstation (also eng.transformers) are not used as tools: the energy zone's other
// stations own them.
// Definitions as the Basis lessons word them (eng.gridbasics.basics, .levels, .roles, .congestion). Terms come from
// the module's lessons and {n:} numbers from the module's text (the kit's intro mode, films/_kit/build-film.mjs);
// the kit holds the film to its map (every topic named in a caption of its own scene, explained in two beats and lit),
// its narration guard and its label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): hall B as in the energy field film (the shared hall
// of films/pm.plan.intro/hall.mjs: the power cabinet, the cable through the left wall, a packing line), with
// pm.agile.scrum's figures for the installer and the technician. The film's own things (the wall entry, the main
// fuse, the inverter with its cable to the roof) are simple solids drawn here. A panel at the right, in stage space,
// draws each step as a schema, labelled "voorbeeld" (line 3's way) or "schema" (the module's map).
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
const MOD = MODULES.find((m) => m.id === 'eng.gridbasics');
const LEVELS = {
  power: ['eng.gridbasics.basics', 'eng.gridbasics.load', 'eng.gridbasics.voltage', 'eng.gridbasics.profile'],
  grid: ['eng.gridbasics.levels', 'eng.gridbasics.path', 'eng.gridbasics.balance', 'eng.gridbasics.backbone'],
  rules: ['eng.gridbasics.roles', 'eng.gridbasics.law', 'eng.gridbasics.contract', 'eng.gridbasics.regulation'],
  congestion: ['eng.gridbasics.congestion', 'eng.gridbasics.scarcity', 'eng.gridbasics.options', 'eng.gridbasics.transition'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.gridbasics has the four topics and levels this film draws');
assert(MOD.intro === 'eng.gridbasics.intro', 'eng.gridbasics names this film as its intro');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s1: power as the first lesson words it; the grid is built for kW, not kWh
has('eng.gridbasics.basics', ['Vermogen (W, watt) is hoe snel energie wordt gebruikt', 'maar het net wordt gebouwd voor kW']);
has('eng.gridbasics.basics', ['Power (W, watts) is how fast energy is used', 'but the grid is built for kW'], 'en');
// s2: voltage and current, the peak the cables carry, the inverter on the roof's solar panels
has('eng.gridbasics.basics', ['Spanning (V, volt) is de elektrische druk', 'Stroomsterkte (A, ampère), kortweg stroom, is de doorstroming', 'het hoogste vermogen op één moment dragen']);
has('eng.gridbasics.basics', ['Voltage (V, volts) is the electrical push', 'Current (A, amperes) is the flow', 'carry the highest power at any one moment'], 'en');
has('eng.gridbasics.load', ['piekbelasting, de hoogste belasting van het jaar', 'de omvormer, het kastje dat de gelijkstroom van de panelen omzet naar wisselstroom voor het net', 'levert elk dak tegelijk terug']);
has('eng.gridbasics.load', ['peak load, the highest load of the year', 'the inverter, the box that turns the panels’ DC into grid AC', 'every roof feeds power back at the same time'], 'en');
// s3: high voltage loses little, the voltage steps down near the user; the levels; the main fuse ends the connection
has('eng.gridbasics.levels', ['dus de verliezen 100 keer zo klein', 'zetten transformatoren het pas dicht bij de gebruiker omlaag', 'extra hoogspanning (EHS) van 380 en 220 kV', 'rechtstreeks naar grote klanten zoals fabrieken', 'Laagspanning (LS) is 400/230 V']);
has('eng.gridbasics.levels', ['so the losses drop 100 times', 'stepped down by transformers close to the user', 'extra-high voltage (EHV) of 380 and 220 kV', 'directly to large customers such as factories', 'Low voltage (LV) is 400/230 V'], 'en');
has('eng.gridbasics.path', ['De stroom komt van TenneT binnen in een onderstation', 'die eindigt bij de hoofdzekering, de zekering die de hele aansluiting beveiligt', 'Tot en met de meter is alles van de netbeheerder']);
has('eng.gridbasics.path', ['Power arrives from TenneT at a substation', 'ends at the main fuse, the fuse that protects the whole connection', 'Up to and including the meter, it belongs to the grid operator'], 'en');
// s4: who does what; one regulated monopoly per area; the regulator; the system code (the rules for connecting)
has('eng.gridbasics.roles', ['heeft vijf kerntaken: klanten aansluiten', 'Hij verkoopt geen energie: dat doen energieleveranciers', 'Een netbeheerder is een gereguleerd monopolie', 'bepaalt hoeveel inkomsten ze via de tarieven mogen halen']);
has('eng.gridbasics.roles', ['has five core tasks: connect customers', 'It does not sell energy: energy suppliers', 'A grid operator is a regulated monopoly', 'sets how much income operators may earn through tariffs'], 'en');
has('eng.gridbasics.levels', ['Beide beheert TenneT, de landelijke netbeheerder']);
has('eng.gridbasics.levels', ['Both are run by TenneT, the national transmission system operator'], 'en');
has('eng.gridbasics.law', ['Systeemcode elektriciteit De code van de ACM met de regels voor aansluiten, transport en congestiemanagement']);
has('eng.gridbasics.law', ['Electricity System Code The ACM code with the rules for connection, transport and congestion management'], 'en');
// s5: congestion, the queue, years to build, the capacity map, the flexible contract and the few hundred hours
has('eng.gridbasics.congestion', ['Netcongestie betekent dat op piekmomenten de vraag naar transportcapaciteit groter is', 'op een wachtrij (waiting list)', 'een nieuw onderstation duurt vaak 5 tot 10 jaar', 'De openbare capaciteitskaart laat zien waar nog ruimte is', 'Een flexibel contract geeft een klant capaciteit behalve op de piekuren', 'levert een beetje flexibiliteit veel ruimte op']);
has('eng.gridbasics.congestion', ['Grid congestion means that at peak moments', 'end up on a waiting list', 'a new substation often takes 5 to 10 years', 'The public capacity map shows where there is room', 'A flexible contract gives a customer capacity except at peak hours', 'a little flexibility frees a lot of room'], 'en');
// s6: the first lesson shows why the grid runs on kW (where to start)
has('eng.gridbasics.basics', ['Volt, ampère, watt en kWh']);
// s6: the later levels, as the lessons are titled (the grid names what each adds)
for (const [id, word] of [['eng.gridbasics.load', 'gelijktijdigheid'], ['eng.gridbasics.path', 'stopcontact'], ['eng.gridbasics.law', 'Wetten'], ['eng.gridbasics.scarcity', 'wachtrij'],
  ['eng.gridbasics.voltage', 'Spanning langs de kabel'], ['eng.gridbasics.balance', 'frequentie'], ['eng.gridbasics.contract', 'tarief'], ['eng.gridbasics.options', 'grootverbruiker zelf kan doen'],
  ['eng.gridbasics.profile', 'Meetdata'], ['eng.gridbasics.backbone', 'net op zee'], ['eng.gridbasics.regulation', 'geld verdient'], ['eng.gridbasics.transition', 'energietransitie']]) has(id, [word]);
has('eng.gridbasics.load', ['simultaneity'], 'en');
has('eng.gridbasics.path', ['socket'], 'en');
has('eng.gridbasics.law', ['Laws'], 'en');
has('eng.gridbasics.scarcity', ['queue'], 'en');
has('eng.gridbasics.voltage', ['Voltage along the cable'], 'en');
has('eng.gridbasics.balance', ['frequency'], 'en');
has('eng.gridbasics.contract', ['tariff'], 'en');
has('eng.gridbasics.options', ['What a large consumer can do itself'], 'en');
has('eng.gridbasics.profile', ['Metering data'], 'en');
has('eng.gridbasics.backbone', ['offshore grid'], 'en');
has('eng.gridbasics.regulation', ['earns its money'], 'en');
has('eng.gridbasics.transition', ['energy transition'], 'en');
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
// from the grid through the left wall (y 86 to 114) to the cabinet, line 3 at the right (x 186). New here: the main fuse
// on the cabinet's front, an inverter on the back wall with a cable up to the roof, and the technician by the wall entry.
const CAB = { x: 12, w: 40, d: 26, h: 124 };
const L3 = { x: 186, y: 16, len: 84, dep: 34 };
const cabA = hall.cable([[0, 100], [32, 100], [32, 28]]);
const wallEntry = w.box({ x: 0, y: 86, w: 10, d: 28, r: 1.5 }, 0, 40, { tone: 'lo' }, { steps: 2 })
  + w.box({ x: 10, y: 96, w: 3, d: 8, r: 1 }, 0, 10, { tone: 'mid' }, { steps: 1 });
// the main fuse: a plate with a switch on the cabinet's front, below the door's slot and clear of its handle
const fuse = '<g class="pm-fuse">' + w.box({ x: 22, y: CAB.d, w: 20, d: 2.6, r: 0.6 }, 62, 86, { tone: 'hi' }, { steps: 1 })
  + w.box({ x: 28, y: CAB.d + 2.6, w: 8, d: 2, r: 0.5 }, 66, 82, { tone: 'lo' }, { steps: 1 }) + '</g>';
// the inverter on the back wall, and the cable up the wall to the roof (the solar panels)
const inverter = w.box({ x: 76, y: 0, w: 26, d: 10, r: 1.5 }, 92, 126, { tone: 'mid' }, { steps: 2, bevel: 0.4 })
  + w.box({ x: 82, y: 10, w: 14, d: 1, r: 0.3 }, 108, 118, { tone: 'lo' }, { steps: 1 })
  + w.box({ x: 87, y: 0, w: 3.2, d: 3.2, r: 0.6 }, 126, ROOM.h, { tone: 'lo' }, { steps: 1 });

const INST = { x: 16, y: 70 };
const TECH = { x: 14, y: 140 };
const JIJ = { x: 132, y: 96 };
const installer = scrumPerson(w, k, G, P, { x: INST.x, y: INST.y, key: 'installer', look: 'sm', along: 'y' });
const tech = scrumPerson(w, k, G, P, { x: TECH.x, y: TECH.y, key: 'tech', look: 'dev', along: 'y' });

// painted back to front (large x and small y are far): the cable and the cabinet (with its main fuse), the inverter, the
// line, the people (the installer, the technician, you)
const world = [
  w.room(ROOM),
  cueG('net', wallEntry + cabA),
  cueG('cab', hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h })),
  cueG('fuse', fuse),
  cueG('inv', inverter),
  cueG('line3', hall.conveyor({ ...L3, cartons: 3 })),
  g('pp-installer', installer + hall.hat(INST.x, INST.y)),
  g('pp-tech', tech + hall.hat(TECH.x, TECH.y)),
  g('pp-jij', person('jij', JIJ.x, JIJ.y, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame
// (data-k): the four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the
// schemas of each beat. The shared Engineering map (the kit's mapScene) sits under the panel; its place Het
// elektriciteitsnet is a cue group of its own (map-gridbasics).
const TILE = { power: 'tPow', grid: 'tGrid', rules: 'tRules', congestion: 'tCong' };
const PANEL = ['flowS', 'defS', 'grpA', 'grpB', 'vaS', 'peakS', 'ladS', 'nbS', 'tnS', 'lvS', 'toeS', 'fullS', 'queS', 'flexS',
  'tool1', 'tool2', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, Het elektriciteitsnet lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP_W = 640;
const MAP_H = 1128;
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.gridbasics'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.gridbasics');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.gridbasics')}"`), 'the map lights eng.gridbasics as a cue group');
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
  { from: cam(150, 40, 60, 1.25), to: cam(90, 40, 80, 1.5), at: 2 }, // s2 line 3 and the peak, then (b2) the inverter on the wall
  { from: cam(40, 80, 50, 1.5), to: cam(30, 60, 70, 1.6), at: 2 }, // s3 the cable and the cabinet, then (b2) the main fuse
  { from: cam(40, 90, 50, 1.5), to: cam(35, 85, 50, 1.6), at: 2 }, // s4 the wall entry and the technician
  { from: cam(140, 80, 50, 1.15), to: cam(180, 50, 55, 1.4), at: 3 }, // s5 the hall, then (b3) line 3 and the installer
  { from: cam(150, 70, 60, 1), to: cam(150, 70, 60, 1) }, // s6 (the map)
];
// People are moved, in stage units, to where each scene needs them; the base places are INST, TECH and JIJ above.
const shiftOf = (from, to) => w.at([...to, 0]).map((v, i) => Math.round((v - w.at([...from, 0])[i]) * 10) / 10);
const INSTSHIFT = { 4: shiftOf([INST.x, INST.y], [172, 66]) };
const JIJSHIFT = { 4: shiftOf([JIJ.x, JIJ.y], [150, 110]) };

// ---------------------------------------------------------------- the film
const TOOL = (a, b) => ({ cue: { [a]: 'tool1', ...(b ? { [b]: 'tool2' } : {}) } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.gridbasics.intro',
  title: { nl: 'Van het net tot hal B: het elektriciteitsnet', en: 'From the grid to hall B: the electricity grid' },
  module: 'eng.gridbasics',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.gridbasics, the scene that explains it and its tile
  topics: {
    power: { scene: 's2', cue: 'tPow' },
    grid: { scene: 's3', cue: 'tGrid' },
    rules: { scene: 's4', cue: 'tRules' },
    congestion: { scene: 's5', cue: 'tCong' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Lijn 3 en het net', en: 'Line 3 and the grid' },
      beats: [
        { nl: 'Lijn 3 in hal B heeft meer stroom nodig. Die komt uit het elektriciteitsnet.', en: 'Line 3 in hall B needs more power. It comes from the electricity grid.', focus: ['flowS', 'net', 'line3', 'jij'] },
        { nl: 'Vermogen is hoe snel je energie gebruikt. Het net is gebouwd voor het hoogste vermogen.', en: 'Power is how fast you use energy. The grid is built for the highest power.', focus: ['defS', 'line3'] },
        { nl: 'Vier onderwerpen volgen de stroom. Eerst wat er stroomt en langs welke weg.', en: 'Four topics follow the power. First what flows and along which path.', focus: 'grpA' },
        { nl: 'Daarna wie het regelt en waarom het net vol zit.', en: 'Then who runs it and why the grid is full.', focus: 'grpB' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Vermogen', en: 'Power' },
      beats: [
        { nl: 'Eerste onderwerp: Vermogen, belasting en spanning. Spanning is de druk, stroom de doorstroming.', en: 'First topic: Power, load and voltage. Voltage is the pressure, current the flow.', focus: ['tPow', 'vaS', 'cab'] },
        { nl: 'Het net draagt het hoogste vermogen op één moment, de piek. Het jaartotaal telt niet.', en: 'The grid carries the highest power at one moment, the peak. The yearly total does not count.', focus: ['peakS', 'line3'] },
        { nl: 'Bij vermogen gebruiken we vaak een {t:Omvormer|omvormer}. Die zet de stroom van het dak om.', en: 'For power we often use an {t:Inverter|inverter}. It converts the power from the roof.', ...TOOL('Omvormer'), focus: ['tool1', 'inv'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Het net', en: 'The grid' },
      beats: [
        { nl: 'Tweede onderwerp: Het net van hoog naar laag. Op hoogspanning gaat weinig verloren.', en: 'Second topic: The grid from high to low. At high voltage little is lost.', focus: ['tGrid', 'ladS'] },
        { nl: 'Pas dicht bij de gebruiker zetten transformatoren de spanning omlaag.', en: 'Only close to the user do transformers step the voltage down.', focus: ['ladS', 'net'] },
        { nl: 'Bij het net lees je de {t:Hoofdzekering|hoofdzekering} af en volg je de kabel naar het {t:Onderstation|onderstation}.', en: 'On the grid you read the {t:Main fuse|main fuse} and follow the cable to the {t:Substation|substation}.', ...TOOL('Hoofdzekering', 'Onderstation'), focus: ['tool1', 'tool2', 'fuse', 'net'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Rollen', en: 'Roles' },
      beats: [
        { nl: 'Derde onderwerp: Rollen, regels en geld. De netbeheerder legt de kabel tot in de hal.', en: 'Third topic: Roles, rules and money. The grid operator lays the cable into the hall.', focus: ['tRules', 'nbS', 'net', 'tech'] },
        { nl: 'TenneT beheert het hoogste net. De leverancier verkoopt de energie en die kies je zelf.', en: 'TenneT runs the highest grid. The supplier sells the energy and you choose it yourself.', focus: ['tnS', 'lvS'] },
        { nl: 'Er ligt één net per gebied. Daarom bepaalt een toezichthouder de regels en de tarieven.', en: 'There is one grid per area. So a regulator sets the rules and the tariffs.', focus: ['toeS', 'nbS'] },
        { nl: 'Bij de regels zoek je in de {t:Systeemcode elektriciteit|systeemcode} hoe je aansluit.', en: 'For the rules you look up in the {t:Electricity System Code|electricity system code} how to connect.', ...TOOL('Systeemcode elektriciteit'), focus: ['tool1', 'tech'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Een vol net', en: 'A full grid' },
      beats: [
        { nl: 'Vierde onderwerp: Netcongestie en de energietransitie. Het net in deze regio zit vol.', en: 'Fourth topic: Congestion and the energy transition. The grid in this region is full.', focus: ['tCong', 'fullS'] },
        { nl: 'Wie meer vermogen vraagt, komt in de wachtrij. Bouwen duurt {n:5} tot {n:10} jaar.', en: 'Whoever asks for more power joins the queue. Building takes {n:5} to {n:10} years.', focus: ['queS', 'line3'] },
        { nl: 'Je kijkt op de {t:Capaciteitskaart|capaciteitskaart} en sluit zo nodig een {t:Flexibel contract|flexibel contract}.', en: 'You check the {t:Capacity map|capacity map} and sign a {t:Flexible contract|flexible contract} if needed.', ...TOOL('Capaciteitskaart', 'Flexibel contract'), focus: ['tool1', 'tool2', 'line3'] },
        { nl: 'Zo schuift lijn 3 uit de paar piekuren en krijgt toch stroom. Dan sluit de installateur hem aan.', en: 'So line 3 moves out of the few peak hours and still gets power. Then the installer connects it.', focus: ['flexS', 'line3', 'installer'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. Het elektriciteitsnet is het eerste station van Energie en het net.', en: 'The whole map. The electricity grid is the first station of Energy and the grid.', focus: 'map-gridbasics' },
        { nl: 'Elk onderwerp heeft vier niveaus.', en: 'Every topic has four levels.', focus: 'route' },
        { nl: 'Begin bij Volt, ampère, watt en kWh op niveau Basis. Die les laat zien waarom het net om kilowatt draait.', en: 'Start with Volts, amps, watts and kWh at Basics level. That lesson shows why the grid runs on kilowatts.', focus: ['tPow', 'start'] },
        { nl: 'Op niveau Werkkennis komen gelijktijdigheid, de route naar het stopcontact, wetten en de wachtrij.', en: 'At Working knowledge level come simultaneity, the route to the socket, laws and the queue.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd komen spanning langs de kabel, frequentie, tarieven en wat je zelf kunt doen.', en: 'At Advanced level come voltage along the cable, frequency, tariffs and what you can do yourself.', focus: 'lv3' },
        { nl: 'Op niveau Expert gaat het om meetdata, het net op zee, hoe netbeheerders verdienen en de transitie.', en: 'At Expert level it is about metering data, the offshore grid, how operators earn money and the transition.', focus: 'lv4' },
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
// brings the power into the hall), the cabinet with its main fuse (where the factory's own part begins), the line
// (it starts up and makes a peak), the inverter and its cable to the roof (the roof has solar panels), the technician
// at the wall (the grid operator lays the cable into the hall), the installer (he connects the line once it has power).
const SAY = [
  [ // s1 line 3 needs power from the grid: power and the peak, the map in two groups
    { nl: 'Lijn 3 in hal B heeft meer stroom nodig. Die komt uit het elektriciteitsnet.',
      en: 'Line 3 in hall B needs more power. It comes from the electricity grid.' },
    { nl: 'Vermogen is hoe snel je energie gebruikt. Het net is gebouwd voor het hoogste vermogen.',
      en: 'Power is how fast you use energy. The grid is built for the highest power.' },
    { nl: 'Vier onderwerpen volgen de stroom. Eerst wat er stroomt en langs welke weg.',
      en: 'Four topics follow the power. First what flows and along which path.' },
    { nl: 'Daarna wie het regelt en waarom het net vol zit.',
      en: 'Then who runs it and why the grid is full.' },
  ],
  [ // s2 power, load and voltage: the peak, the inverter
    { nl: 'Het eerste onderwerp is Vermogen, belasting en spanning. Spanning is de druk en stroom is de doorstroming.',
      en: 'The first topic is Power, load and voltage. Voltage is the pressure and current is the flow.' },
    { nl: 'Het net moet het hoogste vermogen op één moment dragen, de piek. Als lijn 3 aanloopt is dat zo’n piek.',
      en: 'The grid must carry the highest power at one moment, the peak. When line 3 starts up that is such a peak.' },
    { nl: 'Het dak van hal B heeft zonnepanelen. Bij vermogen gebruiken we vaak een {t:Omvormer|omvormer}. Die zet hun stroom om voor het net.',
      en: 'The roof of hall B has solar panels. For power we often use an {t:Inverter|inverter}. It converts their power for the grid.' },
  ],
  [ // s3 the grid from high to low
    { nl: 'Het tweede onderwerp is Het net van hoog naar laag. Op hoogspanning gaat weinig verloren.',
      en: 'The second topic is The grid from high to low. At high voltage little is lost.' },
    { nl: 'Pas dicht bij de gebruiker zetten transformatoren de spanning omlaag.',
      en: 'Only close to the user do transformers step the voltage down.' },
    { nl: 'Bij het net lees je de {t:Hoofdzekering|hoofdzekering} af en volg je de kabel naar het {t:Onderstation|onderstation}.',
      en: 'On the grid you read the {t:Main fuse|main fuse} and follow the cable to the {t:Substation|substation}.' },
  ],
  [ // s4 roles, rules and money
    { nl: 'Het derde onderwerp is Rollen, regels en geld. De netbeheerder legt de kabel tot in de hal.',
      en: 'The third topic is Roles, rules and money. The grid operator lays the cable into the hall.' },
    { nl: 'TenneT beheert het hoogste net. De leverancier verkoopt de energie en die kies je zelf.',
      en: 'TenneT runs the highest grid. The supplier sells the energy and you choose it yourself.' },
    { nl: 'Er ligt één net per gebied. Daarom bepaalt een toezichthouder de regels en de tarieven.',
      en: 'There is one grid per area. So a regulator sets the rules and the tariffs.' },
    { nl: 'Bij de regels zoek je in de {t:Systeemcode elektriciteit|systeemcode} hoe je aansluit.',
      en: 'For the rules you look up in the {t:Electricity System Code|electricity system code} how to connect.' },
  ],
  [ // s5 congestion and the energy transition, and the story ends where the field film picks it up
    { nl: 'Het vierde onderwerp is Netcongestie en de energietransitie. In deze regio zit het net vol.',
      en: 'The fourth topic is Congestion and the energy transition. In this region the grid is full.' },
    { nl: 'Wie meer vermogen vraagt, komt in de wachtrij. Een nieuw onderstation bouwen duurt {n:5} tot {n:10} jaar.',
      en: 'Whoever asks for more power joins the queue. Building a new substation takes {n:5} to {n:10} years.' },
    { nl: 'Je kijkt op de {t:Capaciteitskaart|capaciteitskaart} en sluit zo nodig een {t:Flexibel contract|flexibel contract}.',
      en: 'You check the {t:Capacity map|capacity map} and sign a {t:Flexible contract|flexible contract} if needed.' },
    { nl: 'Congestie speelt maar een paar honderd uur per jaar. Zo schuift lijn 3 daaruit en krijgt toch stroom. Dan sluit de installateur hem aan.',
      en: 'Congestion lasts only a few hundred hours a year. So line 3 moves out of them and still gets power. Then the installer connects it.' },
  ],
  [ // s6 the map: the level words of the app, as the captions show them
    { nl: 'De hele kaart. Het elektriciteitsnet is het eerste station van Energie en het net.',
      en: 'The whole map. The electricity grid is the first station of Energy and the grid.' },
    { nl: 'Elk onderwerp heeft vier niveaus.',
      en: 'Every topic has four levels.' },
    { nl: 'Begin bij Volt, ampère, watt en kWh op niveau Basis. Die les laat zien waarom het net om kilowatt draait.',
      en: 'Start with Volts, amps, watts and kWh at Basics level. That lesson shows why the grid runs on kilowatts.' },
    { nl: 'Op niveau Werkkennis komen gelijktijdigheid, de route naar het stopcontact, wetten en de wachtrij.',
      en: 'At Working knowledge level come simultaneity, the route to the socket, laws and the queue.' },
    { nl: 'Op niveau Gevorderd komen spanning langs de kabel, frequentie, tarieven en wat je zelf kunt doen.',
      en: 'At Advanced level come voltage along the cable, frequency, tariffs and what you can do yourself.' },
    { nl: 'Op niveau Expert gaat het om meetdata, het net op zee, hoe netbeheerders verdienen en de transitie.',
      en: 'At Expert level it is about metering data, the offshore grid, how operators earn money and the transition.' },
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

const PEOPLE = ':is([data-cue="jij"],[data-cue="installer"],[data-cue="tech"])';
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
.pm-fuse .iso-fill,.pm-fuse .iso-top{fill:#C2553F}
.pm-fuse .iso-shade{fill:#9E3F2D}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link,[data-cue][data-on] .pm-dash{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-bar,.pm-lvl,.pm-out,.pm-full){stroke:var(--fp-accent)}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');

const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 op zijn nieuwe plek draait. Door de linkerwand komt de kabel van het net binnen, naar de stroomkast langs de achterwand, met een hoofdzekering op de voorkant. Rechts de verpakkingslijn met dozen, en op de achterwand een omvormer met een kabel naar het dak. Een installateur bij de kast, een monteur van de netbeheerder bij de muur waar de kabel binnenkomt, en jij, de engineer. Rechts een paneel, gemarkeerd als voorbeeld of schema: het net, hal B en lijn 3, vermogen en de piek, de spanningsniveaus van hoog naar laag, de rollen van netbeheerder, TenneT, leverancier en toezichthouder, een kaart van een vol net met een wachtrij, en een dagcurve waarin lijn 3 uit de piekuren schuift, met per onderwerp de namen van een of twee hulpmiddelen. Aan het eind de hele kaart van Engineering met Het elektriciteitsnet verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the factory, where line 3 runs at its new place. Through the left wall the cable from the grid comes in, to the power cabinet along the back wall, with a main fuse on its front. At the right the packing line with cartons, and on the back wall an inverter with a cable up to the roof. An installer by the cabinet, a technician of the grid operator by the wall where the cable enters, and you, the engineer. At the right a panel, marked as an example or a diagram: the grid, hall B and line 3, power and the peak, the voltage levels from high to low, the roles of the grid operator, TenneT, the supplier and the regulator, a map of a full grid with a queue, and a day curve in which line 3 moves out of the peak hours, with the names of one or two tools per topic. At the end the whole map of Engineering with The electricity grid lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

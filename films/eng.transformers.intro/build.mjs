// Dev tool, not shipped. Builds the module intro film "Stroom voor hal B / Power for hall B" for Transformatoren en
// kabels (eng.transformers), an Engineering module intro film (v17, Task 13): the high-over picture at the top of the
// module, before its four topics (Merijn, 13 Nov: "that high-over picture is the thing I need the most"). Pattern and
// rules: films/eng.machining.intro (the approved reference), eng.gridbasics.intro (the first energy intro) and the notes
// section "Engineering module intros".
//
//   node films/eng.transformers.intro/build.mjs            build the page
//   node films/eng.transformers.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.transformers.intro.html: one offline page with the anatomy kit, the stage
// script and the player inlined. The index names it (eng.transformers's `intro`), coursehome shows it above the
// topics, sw.js precaches it.
//
// The story: hall B of the field film films/eng.field.energy ("Energie en het net": line 3 moves and needs more
// power; its third station, Transformatoren en kabels, says the transformer converts the voltage for the machines,
// heat ages it so ribs cool it, a cable runs on from it to the switchboard, you test the oil with a DGA and look for
// cable faults with a reflectometer, and without this the transformer fails unexpectedly or you search long for a
// cable fault). This film follows the transformer and the cable that bring the power to hall B: the cable through the
// left wall to the cabinet, the transformer with its ribs, and the run to the switchboard, at person scale. Every
// topic of the module has its place on that one road:
//   s1 hall B gets its power from a cable and a transformer; a transformer changes one AC voltage into another (as
//      the first lesson words it); the map before any detail: two topics about the transformer itself (the
//      transformer and its station; loading, ageing and condition), two about the cable and the connection (cables
//      and cable faults; connections, standards and supply)                          → .principle
//   s2 De transformator en zijn station: it changes medium voltage into low voltage for the machines; two windings
//      round an iron core, the turns ratio sets the voltage; you adjust the ratio in small steps with the tap
//      changer, usually with the power off (Basis, .principle)                         → .principle (aftakschakelaar)
//   s3 Belasting, veroudering en conditie: heat slowly breaks the paper insulation down; a short peak does little
//      harm, weeks too high cost life, so you look at the load profile; for a large transformer the oil is a health
//      check, you test it with a DGA (Basis, .ageing)                                 → .ageing (DGA)
//   s4 Kabels en kabelstoringen: almost all power runs through underground cables; the joints between cable lengths
//      are hand-made and the weak spot; when a cable fails you pre-locate the fault with a reflectometer
//      (Werkkennis, .faults)                                                          → .cables (reflectiemeter)
//   s5 Aansluitingen, standaarden en levering: a new connection goes through five steps, the work itself is short
//      and the rest is waiting; operators choose standards and sign a framework agreement (Werkkennis, .standard);
//      then the installer connects the cables and the power goes to the switchboard, where the field film
//      picks the story up                                                            → .connections (raamovereenkomst)
//   s6 the shared Engineering map (the kit's mapScene) with Transformatoren en kabels lit, then the module's four
//      topics with their levels as columns, where to start, and what each later level adds, in the app's level
//      words
// Per the review of eng.machining.intro: how the topics hang together is said once, in s1, before any detail; a
// topic scene is short (what it is, its place in the story with a reason, then the tool sentence); the tools are
// real things of the topic at Basis or Working knowledge level, one short sentence each, not explained; a Werkkennis
// tool named in a scene is not named again in the closing grid; the closing grid has one beat per later level in the
// app's level words; the people are plant people; the story ends where the field film picks it up, in the last topic
// scene. Cables, Basis: the lesson's terms (joint, termination, PILC, XLPE) are parts of a cable, not tools, so this
// topic has one tool, the reflectometer of the field film, from Working knowledge. Connections, Basis: the capacity
// check is a step, not a tool, and is too near the capacity map of the grid intro, so that topic's tool is the
// framework agreement of Working knowledge. The switchgear intro owns the breaker, the protection relay and the
// earthing set: the switchboard appears here only as the place the cable runs to.
// Definitions as the Basis lessons word them (eng.transformers.principle, .ageing, .cables, .connections). Terms come
// from the module's lessons and {n:} numbers from the module's text (the kit's intro mode,
// films/_kit/build-film.mjs); the kit holds the film to its map (every topic named in a caption of its own scene,
// explained in two beats and lit), its narration guard and its label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): hall B as in the energy field film (the shared hall
// of films/pm.plan.intro/hall.mjs: the power cabinet, the cable through the left wall, a packing line, the
// switchboard), with pm.agile.scrum's figure for the installer. The film's own things (the wall entry, the
// transformer with its ribs, bushings and tap changer, the cable tray) are simple solids drawn here, as in the field
// film. A panel at the right, in stage space, draws each step as a schema, labelled "voorbeeld" (hall B's way) or
// "schema" (the module's map).
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
const MOD = MODULES.find((m) => m.id === 'eng.transformers');
const LEVELS = {
  transformer: ['eng.transformers.principle', 'eng.transformers.station', 'eng.transformers.losses', 'eng.transformers.voltage'],
  condition: ['eng.transformers.ageing', 'eng.transformers.loading', 'eng.transformers.dga', 'eng.transformers.health'],
  cables: ['eng.transformers.cables', 'eng.transformers.faults', 'eng.transformers.diagnostics', 'eng.transformers.rating'],
  supply: ['eng.transformers.connections', 'eng.transformers.standard', 'eng.transformers.procurement', 'eng.transformers.wave'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.transformers has the four topics and levels this film draws');
assert(MOD.intro === 'eng.transformers.intro', 'eng.transformers names this film as its intro');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s1: the transformer as the first lesson words it
has('eng.transformers.principle', ['Een transformator zet de ene wisselspanning om in een andere']);
has('eng.transformers.principle', ['A transformer changes one AC voltage into another'], 'en');
// s2: two windings round an iron core, the turns ratio sets the voltage; the tap changer, on a distribution transformer
// only with the power off; a netstation turns the 10 kV MV net into 400 V LV
has('eng.transformers.principle', ['Hij heeft twee spoelen van draad, de wikkelingen', 'om een ijzeren kern', 'bepaalt de spanningsverhouding', 'het middenspanningsnet (MS, 10 kV) omzet naar 400 V laagspanning',
  'Aftakschakelaar Schakelaar die de wikkelverhouding in kleine stappen', 'bij distributietransformatoren alleen spanningsloos']);
has('eng.transformers.principle', ['It has two coils of wire, the windings', 'round an iron core', 'sets the voltage ratio', 'steps the 10 kV medium-voltage (MV) grid down to 400 V low voltage (LV)',
  'Tap changer Switch that adjusts the turns ratio in small steps', 'on distribution transformers only when switched off'], 'en');
// s3: heat ages the paper; short peaks do little harm, weeks do a lot; the load profile; the oil is a health check of large transformers; the DGA
has('eng.transformers.ageing', ['Warmte breekt het langzaam af', 'Een avondpiek van een uur op 120% doet dus weinig kwaad, weken op 120% heel veel', 'kijken daarom naar het belastingprofiel',
  'Bij grote transformatoren in onderstations is de olie een gezondheidscheck', 'DGA Gas-in-olie-analyse: gassen in de olie die interne fouten verraden']);
has('eng.transformers.ageing', ['Heat slowly breaks it down', 'one-hour evening peak at 120% does little harm, while weeks at 120% do a lot', 'look at the load profile',
  'For large substation transformers, the oil is a health check', 'DGA Dissolved gas analysis: gases in the oil that reveal internal faults'], 'en');
// s4: underground cables, the joints, the reflectometer
has('eng.transformers.cables', ['loopt bijna alle MS- en LS-stroom door ondergrondse kabels', 'Een mof is een met de hand gemaakte verbinding tussen twee kabellengtes', 'Moffen zijn het zwakke punt']);
has('eng.transformers.cables', ['almost all MV and LV power runs through underground cables', 'hand-made connections that link one cable length to the next', 'Joints are the weak spot'], 'en');
has('eng.transformers.faults', ['Eerst de voorlokalisatie: een reflectiemeter, ook echometer genoemd, stuurt een puls de kabel in', 'Reflectiemeter Meetapparaat (ook echometer)']);
has('eng.transformers.faults', ['First pre-location: a reflectometer sends a pulse into the cable', 'Reflectometer Instrument that sends a pulse into a cable'], 'en');
// s5: the five steps, the short work and the waiting, the standard and the framework agreement
has('eng.transformers.connections', ['Een nieuwe aansluiting gaat door vijf stappen', 'Het werk zelf is kort, vaak één of twee dagen op locatie', 'is vooral wachten', 'een transformator die niet op voorraad is', 'Aanvraag', 'Capaciteitscheck', 'Ontwerp', 'Werkvoorbereiding', 'Uitvoering']);
has('eng.transformers.connections', ['A new connection goes through five steps', 'The work itself is short, often one or two days on site', 'is mostly waiting', 'a transformer that is not in stock', 'Request', 'Capacity check', 'Design', 'Work preparation', 'Execution'], 'en');
has('eng.transformers.standard', ['In plaats van elk station te ontwerpen kiest de ontwerper een type uit een catalogus', 'Netbeheerders sluiten een raamovereenkomst', 'Raamovereenkomst Contract voor meerdere jaren met vaste specificaties en prijzen']);
has('eng.transformers.standard', ['the designer picks a type from a catalogue', 'Operators sign framework agreements', 'Framework agreement Multi-year contract with fixed specifications and prices'], 'en');
// s6: where to start, then the later levels, as the lessons are titled
has('eng.transformers.principle', ['Hoe een transformator werkt']);
has('eng.transformers.principle', ['How a transformer works'], 'en');
for (const [id, word] of [['eng.transformers.station', 'netstation'], ['eng.transformers.loading', 'belasten'], ['eng.transformers.faults', 'Kabelstoringen'], ['eng.transformers.standard', 'Standaardisatie'],
  ['eng.transformers.losses', 'Verliezen'], ['eng.transformers.dga', 'De olie lezen'], ['eng.transformers.diagnostics', 'Kabels testen'], ['eng.transformers.procurement', 'Transformatoren inkopen'],
  ['eng.transformers.voltage', 'De spanning binnen de band houden'], ['eng.transformers.health', 'Het hele bestand'], ['eng.transformers.rating', 'Hoeveel stroom een kabel aankan'], ['eng.transformers.wave', 'De vervangingsgolf']]) has(id, [word]);
for (const [id, word] of [['eng.transformers.station', 'substation'], ['eng.transformers.loading', 'load a transformer'], ['eng.transformers.faults', 'Cable faults'], ['eng.transformers.standard', 'Standardisation'],
  ['eng.transformers.losses', 'Losses'], ['eng.transformers.dga', 'Reading the oil'], ['eng.transformers.diagnostics', 'Testing cables'], ['eng.transformers.procurement', 'Buying transformers'],
  ['eng.transformers.voltage', 'Keeping the voltage in the band'], ['eng.transformers.health', 'A fleet view'], ['eng.transformers.rating', 'How much current a cable can carry'], ['eng.transformers.wave', 'The replacement wave']]) has(id, [word], 'en');
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
// s1: the route rows (stage.js, routeGroup) wrap the index titles into 240 units, at most three lines (two rows of the longest fit under their heading)
for (const lang of ['nl', 'en']) {
  for (const id of ORDER) {
    const title = MOD.topics.find((t) => t.id === id).title[lang];
    assert(wrapUnits(title, 240, CHAR_W).length <= 3, `the route row of "${title}" (${lang}) needs more than three lines`);
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

// where things stand (cm), as in the energy field film: the power cabinet, the transformer and the switchboard along the
// back wall from left to right, line 3 at the right under the switchboard; the cable from the grid comes in through the
// left wall (y 86 to 114) to the cabinet, a short cable runs from the cabinet to the transformer and a cable tray from the
// transformer to the switchboard
const CAB = { x: 12, w: 40, d: 26, h: 124 };
const SWB = { x: 218, w: 50, z0: 96, z1: 172 };
const L3 = { x: 186, y: 16, len: 84, dep: 34 };
const TRAFO = { x: 68, y: 4, w: 54, d: 32, h: 60 };
const cabA = hall.cable([[0, 100], [32, 100], [32, 28]]);
const cabB = hall.cable([[52, 13], [TRAFO.x, 13]]);
const wallEntry = w.box({ x: 0, y: 86, w: 10, d: 28, r: 1.5 }, 0, 40, { tone: 'lo' }, { steps: 2 })
  + w.box({ x: 10, y: 96, w: 3, d: 8, r: 1 }, 0, 10, { tone: 'mid' }, { steps: 1 });
const tray = w.box({ x: TRAFO.x + TRAFO.w - 10, y: 0, w: SWB.x - (TRAFO.x + TRAFO.w - 10) + 20, d: 4, r: 0.6 }, 98, 104, { tone: 'lo' }, { steps: 1 })
  + w.box({ x: TRAFO.x + TRAFO.w - 10, y: 0, w: 5, d: 4, r: 0.6 }, TRAFO.h, 104, { tone: 'lo' }, { steps: 1 });
// the transformer: a tank on a base, three bushings on top where the cable connects, and cooling ribs on its front
const bushings = [0, 1, 2].map((i) => w.post(TRAFO.x + 12 + i * 15, TRAFO.y + 16, 3.4, TRAFO.h, TRAFO.h + 14, { tone: 'hi' }, 10)).join('');
const ribs = [0, 1, 2, 3, 4].map((i) => w.box({ x: TRAFO.x + 6 + i * 10, y: TRAFO.y + TRAFO.d, w: 5, d: 9, r: 0 }, 12, TRAFO.h - 6, { tone: 'lo' }, { steps: 0 })).join('');
const trafo = w.box({ x: TRAFO.x, y: TRAFO.y, w: TRAFO.w, d: TRAFO.d, r: 2 }, 6, TRAFO.h, { tone: 'mid' }, { steps: 2 })
  + w.box({ x: TRAFO.x - 3, y: TRAFO.y - 2, w: TRAFO.w + 6, d: TRAFO.d + 4, r: 1 }, 0, 6, { tone: 'lo' }, { steps: 1 }) + ribs + bushings;
// the tap changer: a small plate with a handwheel on the side of the tank that faces the switchboard, where the
// transformer's ratio is set
const tap = w.box({ x: TRAFO.x + TRAFO.w, y: TRAFO.y + 9, w: 4, d: 20, r: 1 }, 22, 50, { tone: 'hi' }, { steps: 1 })
  + k.solidSvg(G.disc(0, 5, 7.5, G.frameOf([TRAFO.x + TRAFO.w + 4, TRAFO.y + 19, 36], [1, 0, 0], [0, 1, 0], [0, 0, 1]), P, { steps: 18 }), { tone: 'lo', crease: 'none' });

const INST = { x: 16, y: 70 };
const JIJ = { x: 205, y: 112 };
const installer = scrumPerson(w, k, G, P, { x: INST.x, y: INST.y, key: 'installer', look: 'sm', along: 'y' });

// painted back to front (large x and small y are far): the cable through the wall and the cabinet, the cable to the
// transformer, the transformer with its tap changer, the tray and the switchboard, the line, the people (the installer,
// you)
const world = [
  w.room(ROOM),
  cueG('net', wallEntry + cabA),
  cueG('cab', hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h })),
  cueG('cabB', cabB),
  cueG('trafo', trafo),
  cueG('tap', tap),
  cueG('swb', tray + hall.switchboard(SWB)),
  cueG('line3', hall.conveyor({ ...L3, cartons: 3 })),
  g('pp-installer', installer + hall.hat(INST.x, INST.y)),
  g('pp-jij', person('jij', JIJ.x, JIJ.y, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame
// (data-k): the four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the
// schemas of each beat. The shared Engineering map (the kit's mapScene) sits under the panel; its place Transformatoren
// en kabels is a cue group of its own (map-transformers).
const TILE = { transformer: 'tTr', condition: 'tCon', cables: 'tCab', supply: 'tSup' };
const PANEL = ['flowS', 'defS', 'grpA', 'grpB', 'convS', 'coilS', 'lifeS', 'profS', 'cabS', 'mofS', 'faultS', 'stepsS', 'waitS', 'stdS', 'endS',
  'tool1', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, Transformatoren en kabels lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP_W = 640;
const MAP_H = 1128;
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.transformers'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.transformers');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.transformers')}"`), 'the map lights eng.transformers as a cue group');
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
  { from: cam(140, 70, 50, 1.0), to: cam(140, 75, 50, 1.05) }, // s1 the whole hall: the cable, the transformer, line 3
  { from: cam(95, 30, 45, 1.6), to: cam(105, 25, 45, 1.8) }, // s2 the transformer, with its tap changer on its side
  { from: cam(95, 30, 45, 1.5), to: cam(100, 25, 45, 1.65) }, // s3 the transformer with its ribs
  { from: cam(30, 80, 40, 1.5), to: cam(75, 40, 40, 1.3) }, // s4 the cable through the wall, then toward the transformer
  { from: cam(95, 40, 50, 1.3), to: cam(150, 40, 80, 1.0), at: 4 }, // s5 the transformer, then (b4) the run to the switchboard
  { from: cam(150, 70, 60, 1), to: cam(150, 70, 60, 1) }, // s6 (the map)
];
// People are moved, in stage units, to where each scene needs them; the base places are INST and JIJ above.
const shiftOf = (from, to) => w.at([...to, 0]).map((v, i) => Math.round((v - w.at([...from, 0])[i]) * 10) / 10);
const INSTSHIFT = { 4: shiftOf([INST.x, INST.y], [60, 56]) };
const JIJSHIFT = {};

// ---------------------------------------------------------------- the film
const TOOL = (a) => ({ cue: { [a]: 'tool1' } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.transformers.intro',
  title: { nl: 'Stroom voor hal B: transformatoren en kabels', en: 'Power for hall B: transformers and cables' },
  module: 'eng.transformers',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.transformers, the scene that explains it and its tile
  topics: {
    transformer: { scene: 's2', cue: 'tTr' },
    condition: { scene: 's3', cue: 'tCon' },
    cables: { scene: 's4', cue: 'tCab' },
    supply: { scene: 's5', cue: 'tSup' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Stroom voor hal B', en: 'Power for hall B' },
      beats: [
        { nl: 'Hal B krijgt zijn stroom van een kabel en een transformator.', en: 'Hall B gets its power from a cable and a transformer.', focus: ['flowS', 'net', 'trafo', 'jij'] },
        { nl: 'Een transformator zet de ene wisselspanning om in een andere.', en: 'A transformer changes one AC voltage into another.', focus: ['defS', 'trafo'] },
        { nl: 'Vier onderwerpen volgen die weg. Eerst de transformator en hoe zwaar je hem belast.', en: 'Four topics follow that path. First the transformer and how heavily you load it.', focus: 'grpA' },
        { nl: 'Dan de kabels en hoe een aansluiting wordt gebouwd en geleverd.', en: 'Then the cables and how a connection is built and supplied.', focus: 'grpB' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'De transformator', en: 'The transformer' },
      beats: [
        { nl: 'Eerste onderwerp: De transformator en zijn station. Hij zet middenspanning om in laagspanning.', en: 'First topic: The transformer and its station. It changes medium voltage into low voltage.', focus: ['tTr', 'convS', 'trafo'] },
        { nl: 'Twee wikkelingen om een ijzeren kern. De wikkelverhouding bepaalt de spanning.', en: 'Two windings round an iron core. The turns ratio sets the voltage.', focus: ['coilS', 'trafo'] },
        { nl: 'Met de {t:Aftakschakelaar|aftakschakelaar} stel je de verhouding bij, meestal spanningsloos.', en: 'With the {t:Tap changer|tap changer} you adjust the ratio, usually with the power off.', ...TOOL('Aftakschakelaar'), focus: ['tool1', 'tap'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Conditie', en: 'Condition' },
      beats: [
        { nl: 'Tweede onderwerp: Belasting, veroudering en conditie. Warmte breekt het papier in de wikkelingen af.', en: 'Second topic: Loading, ageing and condition. Heat breaks down the paper in the windings.', focus: ['tCon', 'lifeS', 'trafo'] },
        { nl: 'Een korte piek doet weinig kwaad. Weken te hoog kosten veel levensduur.', en: 'A short peak does little harm. Weeks too high cost a lot of life.', focus: ['profS', 'trafo'] },
        { nl: 'Bij een grote transformator test je de olie met een {t:DGA|DGA}.', en: 'For a large transformer you test the oil with a {t:DGA|DGA}.', ...TOOL('DGA'), focus: ['tool1', 'trafo'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Kabels', en: 'Cables' },
      beats: [
        { nl: 'Derde onderwerp: Kabels en kabelstoringen. In Nederland liggen bijna alle kabels onder de grond.', en: 'Third topic: Cables and cable faults. In the Netherlands almost all cables lie underground.', focus: ['tCab', 'cabS', 'net', 'cabB'] },
        { nl: 'Kabelstukken zitten aan elkaar met moffen. Die zijn met de hand gemaakt en het zwakke punt.', en: 'Cable lengths are linked with joints. They are made by hand and the weak spot.', focus: ['mofS', 'net'] },
        { nl: 'Valt een kabel uit, dan zoek je de plek eerst met een {t:Reflectiemeter|reflectiemeter}.', en: 'If a cable fails, you first pre-locate the spot with a {t:Reflectometer|reflectometer}.', ...TOOL('Reflectiemeter'), focus: ['tool1', 'faultS', 'net'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Aansluiting', en: 'Connection' },
      beats: [
        { nl: 'Vierde onderwerp: Aansluitingen, standaarden en levering. Een aansluiting heeft vijf stappen.', en: 'Fourth topic: Connections, standards and supply. A connection has five steps.', focus: ['tSup', 'stepsS'] },
        { nl: 'Het werk zelf duurt vaak een of twee dagen. De rest is wachten, bijvoorbeeld op een transformator.', en: 'The work itself often takes one or two days. The rest is waiting, for example for a transformer.', focus: ['waitS', 'trafo'] },
        { nl: 'Netbeheerders kiezen standaarden en sluiten een {t:Raamovereenkomst|raamovereenkomst} af.', en: 'Operators choose standards and sign a {t:Framework agreement|framework agreement}.', ...TOOL('Raamovereenkomst'), focus: ['tool1', 'stdS'] },
        { nl: 'Dan sluit de installateur de kabels aan. De stroom gaat naar het schakelbord.', en: 'Then the installer connects the cables. The power goes to the switchboard.', focus: ['endS', 'trafo', 'swb', 'installer'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. Transformatoren en kabels is het derde station van Energie en het net.', en: 'The whole map. Transformers and cables is the third station of Energy and the grid.', focus: 'map-transformers' },
        { nl: 'Elk onderwerp heeft vier niveaus.', en: 'Every topic has four levels.', focus: 'route' },
        { nl: 'Begin bij Hoe een transformator werkt op niveau Basis. Die les laat zien hoe de spanning omlaag gaat.', en: 'Start with How a transformer works at Basics level. That lesson shows how the voltage goes down.', focus: ['tTr', 'start'] },
        { nl: 'Op niveau Werkkennis gaat het om het netstation, hoe ver je mag belasten, kabelstoringen en standaardisatie.', en: 'At Working knowledge level it is about the substation, how far you may load, cable faults and standardisation.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd gaat het om verliezen, de olie lezen, kabels testen en transformatoren inkopen.', en: 'At Advanced level it is about losses, reading the oil, testing cables and buying transformers.', focus: 'lv3' },
        { nl: 'Op niveau Expert gaat het om de spanning, de staat van het bestand, de kabelbelasting en de vervangingsgolf.', en: 'At Expert level it is about the voltage, the state of the fleet, the cable loading and the replacement wave.', focus: 'lv4' },
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
// without explaining it. Every drawn detail has its reason in the narration: the cable through the wall (the power
// comes in from the grid), the transformer with its ribs (it changes the voltage; heat ages it), the tap changer
// (the ratio is set there), the cable and the tray to the switchboard (the power runs on), the installer (he connects the
// cables once the transformer stands).
const SAY = [
  [ // s1 hall B's cable and transformer: what a transformer is, the map in two groups
    { nl: 'Hal B krijgt zijn stroom van een kabel en een transformator.',
      en: 'Hall B gets its power from a cable and a transformer.' },
    { nl: 'Een transformator zet de ene wisselspanning om in een andere.',
      en: 'A transformer changes one AC voltage into another.' },
    { nl: 'Vier onderwerpen volgen die weg. Eerst de transformator en hoe zwaar je hem belast.',
      en: 'Four topics follow that path. First the transformer and how heavily you load it.' },
    { nl: 'Dan de kabels en hoe een aansluiting wordt gebouwd en geleverd.',
      en: 'Then the cables and how a connection is built and supplied.' },
  ],
  [ // s2 the transformer and its station: the tap changer
    { nl: 'Het eerste onderwerp is De transformator en zijn station. In hal B zet hij middenspanning om in laagspanning voor de machines.',
      en: 'The first topic is The transformer and its station. In hall B it changes medium voltage into low voltage for the machines.' },
    { nl: 'Hij heeft twee wikkelingen om een ijzeren kern. De wikkelverhouding bepaalt hoeveel de spanning omlaag gaat.',
      en: 'It has two windings round an iron core. The turns ratio sets how far the voltage goes down.' },
    { nl: 'Met de {t:Aftakschakelaar|aftakschakelaar} stel je die verhouding in kleine stappen bij, meestal spanningsloos.',
      en: 'With the {t:Tap changer|tap changer} you adjust that ratio in small steps, usually with the power off.' },
  ],
  [ // s3 loading, ageing and condition: heat, the load profile, the oil
    { nl: 'Het tweede onderwerp is Belasting, veroudering en conditie. Warmte breekt het papier in de wikkelingen langzaam af.',
      en: 'The second topic is Loading, ageing and condition. Heat slowly breaks down the paper in the windings.' },
    { nl: 'Een korte piek doet weinig kwaad. Weken te hoog kosten veel levensduur, dus je kijkt naar het hele belastingprofiel.',
      en: 'A short peak does little harm. Weeks too high cost a lot of life, so you look at the whole load profile.' },
    { nl: 'Bij een grote transformator zegt de olie veel over zijn gezondheid. Je test hem met een {t:DGA|DGA}.',
      en: 'For a large transformer the oil says a lot about its health. You test it with a {t:DGA|DGA}.' },
  ],
  [ // s4 cables and cable faults: underground, the joints, the reflectometer
    { nl: 'Het derde onderwerp is Kabels en kabelstoringen. In Nederland loopt bijna alle middenspanning en laagspanning door kabels onder de grond.',
      en: 'The third topic is Cables and cable faults. In the Netherlands almost all medium voltage and low voltage runs through underground cables.' },
    { nl: 'Kabelstukken zitten aan elkaar met moffen. Die zijn met de hand gemaakt en het zwakke punt.',
      en: 'Cable lengths are linked with joints. They are made by hand and are the weak spot.' },
    { nl: 'Valt een kabel uit, dan zoek je de plek eerst met een {t:Reflectiemeter|reflectiemeter}. Zo weet je ongeveer waar je moet graven.',
      en: 'If a cable fails, you first pre-locate the spot with a {t:Reflectometer|reflectometer}. That tells you roughly where to dig.' },
  ],
  [ // s5 connections, standards and supply, and the story ends where the field film picks it up
    { nl: 'Het vierde onderwerp is Aansluitingen, standaarden en levering. Een nieuwe aansluiting gaat door vijf stappen, van aanvraag tot uitvoering.',
      en: 'The fourth topic is Connections, standards and supply. A new connection goes through five steps, from request to execution.' },
    { nl: 'Het werk zelf duurt vaak maar een of twee dagen. De rest is wachten, bijvoorbeeld op een vergunning of een transformator.',
      en: 'The work itself often takes only one or two days. The rest is waiting, for example for a permit or a transformer.' },
    { nl: 'Netbeheerders kiezen standaarden en sluiten een {t:Raamovereenkomst|raamovereenkomst} voor wat ze nodig hebben.',
      en: 'Operators choose standards and sign a {t:Framework agreement|framework agreement} for what they need.' },
    { nl: 'Dan sluit de installateur de kabels aan. De stroom gaat naar het schakelbord.',
      en: 'Then the installer connects the cables. The power goes to the switchboard.' },
  ],
  [ // s6 the map: the level words of the app, as the captions show them
    { nl: 'De hele kaart. Transformatoren en kabels is het derde station van Energie en het net.',
      en: 'The whole map. Transformers and cables is the third station of Energy and the grid.' },
    { nl: 'Elk onderwerp heeft vier niveaus.',
      en: 'Every topic has four levels.' },
    { nl: 'Begin bij Hoe een transformator werkt op niveau Basis. Die les laat zien hoe de spanning omlaag gaat.',
      en: 'Start with How a transformer works at Basics level. That lesson shows how the voltage goes down.' },
    { nl: 'Op niveau Werkkennis gaat het om het netstation, hoe ver je mag belasten, kabelstoringen en standaardisatie.',
      en: 'At Working knowledge level it is about the substation, how far you may load, cable faults and standardisation.' },
    { nl: 'Op niveau Gevorderd gaat het om verliezen, de olie lezen, kabels testen en transformatoren inkopen.',
      en: 'At Advanced level it is about losses, reading the oil, testing cables and buying transformers.' },
    { nl: 'Op niveau Expert gaat het om de spanning, de staat van het bestand, de kabelbelasting en de vervangingsgolf.',
      en: 'At Expert level it is about the voltage, the state of the fleet, the cable loading and the replacement wave.' },
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
  nl: 'Hal B van de fabriek, waar lijn 3 op zijn nieuwe plek draait. Door de linkerwand komt de kabel van het net binnen, naar de stroomkast langs de achterwand. Een korte kabel loopt naar de transformator met koelribben, drie doorvoeren en een aftakschakelaar op de zijkant. Een kabelgoot loopt van de transformator naar het schakelbord aan de wand. Rechts de verpakkingslijn met dozen. Een installateur bij de transformator en jij, de engineer. Rechts een paneel, gemarkeerd als voorbeeld of schema: de kabel, de transformator en hal B, de omzetting van middenspanning naar laagspanning, een transformator met twee wikkelingen om een kern, een staaf voor de levensduur bij koel en heet draaien, een dagcurve met een korte piek boven het vermogen, een ondergrondse kabel met een mof, een puls en een echo bij een kabelfout, de vijf stappen van een aansluiting, het wachten tegenover het korte werk, een standaard uit een catalogus, met per onderwerp de naam van een hulpmiddel, en op het eind de kaart van Engineering en de onderwerpen met hun vier niveaus.',
  en: 'Hall B of the factory, where line 3 runs at its new place. Through the left wall the cable from the grid comes in, to the power cabinet along the back wall. A short cable runs to the transformer with cooling ribs, three bushings and a tap changer on its side. A cable tray runs from the transformer to the switchboard on the wall. At the right the packing line with cartons. An installer by the transformer and you, the engineer. At the right a panel, marked as an example or a diagram: the cable, the transformer and hall B, the change from medium voltage to low voltage, a transformer with two windings round a core, a bar for the life span when running cool and hot, a day curve with a short peak above the rating, an underground cable with a joint, a pulse and an echo at a cable fault, the five steps of a connection, the waiting against the short work, a standard from a catalogue, with for each topic the name of a tool, and at the end the Engineering map and the topics with their four levels.',
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


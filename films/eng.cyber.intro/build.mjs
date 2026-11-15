// Dev tool, not shipped. Builds the module intro film "Een aanval op kantoor / An attack on the office" for
// Cybersecurity (eng.cyber), an Engineering module intro film (v17, Task 13) and the third intro of the digital
// zone: the high-over picture at the top of the module, before its four topics (Merijn, 13 Nov: "that high-over
// picture is the thing I need the most"). Pattern and rules: films/eng.machining.intro (the approved reference),
// films/eng.itbasics.intro (the approved digital reference; its tools router, virtual machine, query and web
// application are not repeated) and films/eng.gridplanning.intro and eng.fluids.intro (the approved structures), and the
// notes section "Engineering module intros".
//
//   node films/eng.cyber.intro/build.mjs            build the page
//   node films/eng.cyber.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.cyber.intro.html: one offline page with the anatomy kit, the stage script
// and the player inlined. The index names it (eng.cyber's `intro`), coursehome shows it above the topics, sw.js
// precaches it.
//
// The story: hall B of the field film films/eng.field.digital ("Automatisering en IT": the new filling unit stands ready
// on line 3, the plant's MES is the laptop on the table at the front, you, the engineer, connect the unit step by step;
// its third station, Cybersecurity, says an attack on the office must not stop line 3, that the line gets its own zone
// (the marked floor) with one guarded link (the gate on the cable), that you use zones and conduits, and that without
// it an infection from the office stops the line). This film follows ONE ATTACK on the office and shows what each topic
// of the module does about it, in the room of the field film: the filling unit over the belt of line 3 with its cartons,
// the network cabinet in the back left corner and the control cabinet (the PLC cabinet) at the back wall with the cable
// between them, the line's own zone as the marked floor with the gate on that cable, the MES laptop on the table at the
// front left and you at the front right. The office, the mail, the law and the crisis team are not in the field film's
// room and are not drawn in it: they are in the panel, as schemas. The network cabinet, the cable, the control cabinet,
// the zone and the gate appear in the OT scene, at the sentence that gives each its reason.
//   s1 an attack on the office must not stop line 3 and you connect the unit; what the module is (the blurb: what a
//      plant must arrange and how to talk about it); the map before any detail: four topics, two about the attack and
//      the line's defence (the basics; OT security), two about the law and the answer (NIS2; incident response)
//                                                                              → eng.cyber.cia
//   s2 De basis: in the office confidentiality often comes first, in the plant availability and safety (the CIA lesson,
//      Basis); a fake mail is the most common way in, phishing (Werkkennis, .phishing); one tool, the report button,
//      the one-click way to send a suspicious mail to IT. No tool at Basis (.cia holds concepts only)
//   s3 OT-beveiliging met IEC 62443: the standard for plant, integrator and supplier (Basis, .iec62443); the way in
//      (a fake mail) was shown in s2, so this scene goes straight to the defence (review: the ways-in beat was lesson detail
//      and cost two speech rules); the line gets its own floor with one guarded link from the network cabinet to the control cabinet,
//      so an infection from the office does not simply get onto the line (defence in depth, .iec62443); the field film's
//      tools, zones and conduits (Werkkennis, .zones), as the gate and the marked floor the room already draws. The
//      firewall is no term of any cyber lesson (it is a layer in the Basis text and a term of IT fundamentals), so it
//      is not a tool here
//   s4 NIS2 en de wet: NIS2 and the Cybersecurity Act; a duty of care, a reporting obligation and a registration
//      obligation (Basis, .nis2; the board is Gevorderd, the duty of care in practice); an attack that stops line 3 may call for a report
//      (a significant incident is one that causes or may cause serious disruption, .reporting); whether the plant is covered
//      depends on sector and size (Werkkennis, .scope); the tools are the two annexes of NIS2, the lists you look your
//      sector up in (the topic has no device or method of its own)
//   s5 Incidentrespons: the fixed way of handling an incident, its five phases (Basis, .ircycle); containment can be
//      closing the link between the office and the plant (the gate again); a manual fallback procedure for when the MES
//      fails, produce on paper (Werkkennis, .prepare); the story ends where the field film picks it up (the line itself),
//      in the last topic scene
//   s6 the shared Engineering map (the kit's mapScene) with Cybersecurity lit, then the module's four topics with their
//      levels as columns, where to start, and what each later level adds, in the app's level words
// Per the review of eng.machining.intro: how the topics hang together is said once, in s1, before any detail; a topic
// scene is short (what it is, its place in the story with a reason, then the tool sentence); the tools are real things
// of the topic at Basis or Working knowledge level; a Werkkennis tool named in a scene is not named again in the closing
// grid (it says phishing, dividing the plant, who is covered and preparing, never the report button, zones and conduits,
// the annexes or the manual fallback procedure); the closing grid has one beat per later level in the app's level words;
// the people are plant people (you); the story ends where the field film picks it up, in the last topic scene.
// Definitions as the Basis lessons word them (eng.cyber.cia, .iec62443, .nis2, .ircycle). Terms come from the module's
// lessons and {n:} numbers from the module's text (the kit's intro mode, films/_kit/build-film.mjs); the kit holds the
// film to its map (every topic named in a caption of its own scene, explained in two beats and lit), its narration
// guard and its label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): hall B as in the digital field film (the shared hall of
// films/pm.plan.intro/hall.mjs: the belt of line 3 with cartons, the cabinets, the cable, the marked floor, the table with
// the laptop), with the person of the world for you. The film's own thing (the filling unit: two uprights, a beam, a
// plate and a cover) is a simple solid drawn here as in the field film, and so is the gate. A panel at the right, in
// stage space, draws each step as a schema, labelled "voorbeeld" (the attack's way) or "schema" (the module's map).
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
const MOD = MODULES.find((m) => m.id === 'eng.cyber');
const LEVELS = {
  basics: ['eng.cyber.cia', 'eng.cyber.phishing', 'eng.cyber.mfa', 'eng.cyber.leastpriv'],
  ot: ['eng.cyber.iec62443', 'eng.cyber.zones', 'eng.cyber.seclevels', 'eng.cyber.otpatch'],
  rules: ['eng.cyber.nis2', 'eng.cyber.scope', 'eng.cyber.dutyofcare', 'eng.cyber.reporting'],
  response: ['eng.cyber.ircycle', 'eng.cyber.prepare', 'eng.cyber.contain', 'eng.cyber.recover'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.cyber has the four topics and levels this film draws');
assert(MOD.intro === 'eng.cyber.intro', 'eng.cyber names this film as its intro');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) if (!text.includes(s)) FAILS.push(`${id} (${lang}) no longer says "${s}"`); };
const FAILS = [];
// s1: the blurb of the module (what it is for)
assert(MOD.blurb.nl.includes('wat een fabriek moet regelen en hoe je erover praat'), 'the module blurb (nl) says what it is for');
assert(MOD.blurb.en.includes('what a plant must arrange and how to talk about it'), 'the module blurb (en) says what it is for');
// s2: office and plant weigh differently; a fake message is the most common way in; the report button
has('eng.cyber.cia', ['Op kantoor staat vertrouwelijkheid vaak voorop', 'In de fabriek gaan beschikbaarheid en veiligheid voor']);
has('eng.cyber.cia', ['In the office, confidentiality often comes first', 'In the plant, availability and safety come first'], 'en');
has('eng.cyber.phishing', ['Phishing is een nepbericht', 'Het is de meest gebruikte manier om binnen te komen', 'Met een meldknop (report button) in Outlook stuur je een verdachte mail met één klik naar IT']);
has('eng.cyber.phishing', ['Phishing is a fake message', 'It is the most common way in', 'With a report button in Outlook you send a suspicious email to IT in one click'], 'en');
// s3: the standard for plant, integrator and supplier; defence in depth; a zone and a conduit
has('eng.cyber.iec62443', ['voor fabriek, integrator en leverancier', 'Valt één laag weg, dan houdt de volgende de aanvaller nog op']);
has('eng.cyber.iec62443', ['for plant, integrator and supplier', 'If one layer fails, the next still holds the attacker up'], 'en');
has('eng.cyber.zones', ['Zone Groep apparaten met dezelfde beveiligingseisen, zoals één productielijn', 'Conduit Gecontroleerde verbinding tussen twee zones', 'Houd kantoor (IT) en besturing (OT) gescheiden']);
has('eng.cyber.zones', ['Zone Group of devices with the same security requirements, such as one production line', 'Conduit Controlled connection between two zones', 'Keep the office (IT) and control (OT) apart'], 'en');
// s4: the law, its duties, the board, the incident that may need a report, sector and size, the annexes
has('eng.cyber.nis2', ['NIS2 is een Europese richtlijn', 'In Nederland heet die wet de Cyberbeveiligingswet', 'De zorgplicht (duty of care)', 'De meldplicht (reporting obligation): ernstige incidenten snel melden', 'De registratieplicht (registration obligation)', 'Daarbovenop is het bestuur zelf verantwoordelijk']);
has('eng.cyber.nis2', ['NIS2 is a European directive', 'In the Netherlands that law is the Dutch Cybersecurity Act', 'The duty of care', 'The reporting obligation', 'The registration obligation', 'the board itself is responsible'], 'en');
has('eng.cyber.reporting', ['Incident dat ernstige verstoring of financieel verlies veroorzaakt of kan veroorzaken']);
has('eng.cyber.reporting', ['Incident that causes or can cause severe disruption or financial loss'], 'en');
has('eng.cyber.scope', ['Of je eronder valt, hangt af van twee toetsen: sector en omvang', 'Bijlage I Lijst in NIS2 van sectoren met hoge kritikaliteit', 'Bijlage II Lijst in NIS2 van andere kritieke sectoren']);
has('eng.cyber.scope', ['Whether you are covered depends on two tests: sector and size', 'Annex I List in NIS2 of sectors of high criticality', 'Annex II List in NIS2 of other critical sectors'], 'en');
// s5: the fixed way of handling an incident, its phases, closing the link between office and plant, the manual fallback procedure
has('eng.cyber.ircycle', ['Incidentrespons (incident response) is de vaste manier om een beveiligingsincident aan te pakken', 'voorbereiding (preparation); detectie en analyse (detection); indamming, uitroeiing en herstel (recovery); en evaluatie na afloop', 'de verbinding tussen kantoor en fabriek dichtzetten']);
has('eng.cyber.ircycle', ['Incident response is the fixed way of handling a security incident', 'preparation; detection and analysis; containment, eradication and recovery; and post-incident activity, or lessons learned', 'closing the connection between office and plant'], 'en');
has('eng.cyber.prepare', ['Een noodprocedure (manual fallback procedure) beschrijft hoe productie doorgaat zonder MES of ERP']);
has('eng.cyber.prepare', ['A manual fallback procedure describes how production carries on without MES or ERP'], 'en');
// s6: the first lesson shows what you protect (where to start)
has('eng.cyber.cia', ['Beveiliging draait om drie dingen']);
has('eng.cyber.cia', ['Security is about three things'], 'en');
// s6: the later levels, as the lessons are titled (the closing names what each adds, without the Werkkennis tools)
for (const [id, word] of [['eng.cyber.phishing', 'Phishing'], ['eng.cyber.zones', 'indelen'], ['eng.cyber.scope', 'Wie valt eronder'], ['eng.cyber.prepare', 'Voorbereiden'],
  ['eng.cyber.mfa', 'Wachtwoorden en MFA'], ['eng.cyber.seclevels', 'hoe streng'], ['eng.cyber.dutyofcare', 'De zorgplicht in de praktijk'], ['eng.cyber.contain', 'Detecteren en indammen'],
  ['eng.cyber.leastpriv', 'Minimale rechten'], ['eng.cyber.otpatch', 'patchen in OT'], ['eng.cyber.reporting', 'Incidenten melden'], ['eng.cyber.recover', 'Herstellen en leren']]) has(id, [word]);
for (const [id, word] of [['eng.cyber.phishing', 'Phishing'], ['eng.cyber.zones', 'Dividing'], ['eng.cyber.scope', 'Who is covered'], ['eng.cyber.prepare', 'Preparing'],
  ['eng.cyber.mfa', 'Passwords and MFA'], ['eng.cyber.seclevels', 'how strict'], ['eng.cyber.dutyofcare', 'The duty of care in practice'], ['eng.cyber.contain', 'Detecting and containing'],
  ['eng.cyber.leastpriv', 'Least privilege'], ['eng.cyber.otpatch', 'patching in OT'], ['eng.cyber.reporting', 'Reporting incidents'], ['eng.cyber.recover', 'Recovering and learning']]) has(id, [word], 'en');
assert(FAILS.length === 0, FAILS.join('\n  '));
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
const at = w.at;
const person = (role, x, y, along) => w.person({ x, y, role, along });

// where things stand (cm), as in the digital field film: the filling unit over the start of line 3's belt (two uprights
// and a beam, a plate hung from the beam above the cartons, a plastic cover on top), the control cabinet (the PLC cabinet)
// at the back wall between the corner and the belt, the network cabinet in the back left corner, the cable from the network
// cabinet to the control cabinet and on to the MES laptop, the line's own zone as a slab of marked floor with the gate
// where the cable enters it, the table with the laptop at the front left, you at the front right. Without the field
// film's tank, photo-eyes, edge box and screen: other stations own them.
const BELT = { x: 130, y: 16, len: 130, dep: 34 };
const UX = 152; // x of the uprights and the beam
const FRAME = { top: 150, beam: 160 };
const PLATE = { z0: 100, z1: 146 }; // the filling head: its foot clears the cartons (60 to 80)
const TABLE = { x: 18, y: 108, w: 76, d: 42, h: 74 };
const ZONE = { x: 26, y: 2, w: 264, d: 70 }; // the line's own zone: a slab of floor with a dashed outline
const PLC = { x: 96, w: 30, d: 20, h: 112 };
const NET = { x: 4, w: 20, d: 18, h: 124 };
const GATE = { x: 29, y: 55, w: 10, d: 10 }; // where the cable enters the zone (the outline's west edge is at x 34)
const CABLE = [[[14, 19], [14, 60], [111, 60], [111, 21]], [[14, 60], [14, 126], [18, 126]]];
const frame = [
  w.box({ x: UX, y: 5, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 52, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 5, w: 9, d: 56, r: 1 }, FRAME.top, FRAME.beam, { tone: 'mid' }, { steps: 2 }),
].join('');
const plate = w.box({ x: UX + 9, y: BELT.y, w: 3.2, d: 36, r: 0.6 }, PLATE.z0, PLATE.z1, { tone: 'mid' }, { steps: 2 });
const cover = w.box({ x: UX - 7, y: 12, w: 23, d: 42, r: 7 }, FRAME.beam, FRAME.beam + 24, { tone: 'hi' }, { steps: 4, bevel: 1.2 });
// the network cabinet: a tall cabinet with a panel of ports on its door (the switch of the field film, not named here)
const netcab = hall.cabinet({ x: NET.x, w: NET.w, d: NET.d, h: NET.h })
  + w.box({ x: NET.x + 3, y: NET.d, w: 14, d: 1.2, r: 0.4 }, 86, 100, { tone: 'lo' }, { steps: 1 })
  + k.dotsSvg([0, 1, 2, 3, 4, 5].map((i) => at([NET.x + 5 + (i % 3) * 5, NET.d + 1.5, 90 + Math.floor(i / 3) * 6])), { size: 1.1, tone: 'hi' });
// the gate: a small guard box on the cable at the edge of the zone, with a light on its front (the field film's guard)
const gate = w.box({ x: GATE.x, y: GATE.y, w: GATE.w, d: GATE.d, r: 1.5 }, 0, 22, { tone: 'hi' }, { steps: 2, bevel: 0.5 })
  + k.dotsSvg([at([GATE.x + 5, GATE.y + GATE.d + 0.3, 14])], { size: 1.6, tone: 'mid' });
const cables = hall.cable(CABLE[0], {});
const cableMes = hall.cable(CABLE[1], {});

// painted back to front (large x and small y are far): the zone's floor, the belt, the unit, the cabinets and the cable
// with the gate (shown from the third beat of the OT scene on), the MES table with its laptop and its cable (shown where
// the MES is named: the table would hide the gate before), you
const world = [
  w.room(ROOM),
  g('o-zone', cueG('zone', hall.floorMark(ZONE))),
  cueG('line3', hall.conveyor({ ...BELT, cartons: 4 })),
  cueG('unit', frame + plate + cover),
  g('o-net', cueG('netcab', netcab) + cueG('plc', hall.cabinet({ x: PLC.x, w: PLC.w, d: PLC.d, h: PLC.h })) + cueG('cable', cables)),
  g('o-gate', cueG('conduit', gate)),
  g('o-mes', cueG('mes', w.table(TABLE) + w.laptop({ x: TABLE.x + TABLE.w / 2, y: TABLE.y + TABLE.d / 2, z: TABLE.h, toward: 1 }) + cableMes)),
  g('pp-jij', person('jij', 262, 128, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame
// (data-k): the four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the
// schemas of each beat. The shared map (the kit's mapScene) sits under the panel; its place Cybersecurity is a cue
// group of its own (map-cyber).
const TILE = { basics: 'tBasics', ot: 'tOT', rules: 'tRules', response: 'tResp' };
const PANEL = ['flowS', 'defS', 'grpA', 'grpB', 'ciaS', 'phishS', 'normS', 'zoneS', 'lawS', 'dutyS', 'stopS', 'scopeS', 'incS', 'cycS',
  'tool1', 'tool2', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, Cybersecurity lit, in the stage (the film's closing scene; the stage script moves and fades it)
const { w: MAP_W, h: MAP_H } = engMap.view; // the Engineering map's sheet (viewBox of the wide drawing), from the map data
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.cyber'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.cyber');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.cyber')}"`), 'the map lights eng.cyber as a cue group');
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
  { from: cam(150, 70, 60, 1.0), to: cam(150, 75, 60, 1.06) }, // s1 the whole hall: the unit on line 3, the MES table, you
  { from: cam(150, 60, 70, 1.05), to: cam(150, 60, 70, 1.12) }, // s2 the line: the belt and the unit that must not stop
  { from: cam(150, 60, 50, 1.0), to: cam(100, 55, 40, 1.2) }, // s3 the whole line and its floor, then closer to the gate and the cabinets
  { from: cam(150, 60, 70, 1.05), to: cam(150, 60, 70, 1.12) }, // s4 the line (the attack that would stop it)
  { from: cam(150, 70, 60, 1.0), to: cam(140, 75, 60, 1.05) }, // s5 the whole hall: the gate, the MES laptop at the table, you
  { from: cam(150, 70, 60, 1), to: cam(150, 70, 60, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a, b) => ({ cue: { [a]: 'tool1', ...(b ? { [b]: 'tool2' } : {}) } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.cyber.intro',
  title: { nl: 'Een aanval op kantoor', en: 'An attack on the office' },
  module: 'eng.cyber',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.cyber, the scene that explains it and its tile
  topics: {
    basics: { scene: 's2', cue: 'tBasics' },
    ot: { scene: 's3', cue: 'tOT' },
    rules: { scene: 's4', cue: 'tRules' },
    response: { scene: 's5', cue: 'tResp' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'De aanval en de lijn', en: 'The attack and the line' },
      beats: [
        { nl: 'Jij sluit de vuleenheid van lijn 3 aan. Een aanval op kantoor mag die lijn niet stilzetten.', en: 'You connect the filling unit of line 3. An attack on the office must not stop that line.', focus: ['flowS', 'unit', 'line3'] },
        { nl: 'Cybersecurity leert je wat een fabriek moet regelen en hoe je erover praat.', en: 'Cybersecurity teaches you what a plant must arrange and how to talk about it.', focus: ['defS', 'line3'] },
        { nl: 'Vier onderwerpen volgen de aanval. Eerst hoe hij binnenkomt en hoe de lijn zich verdedigt.', en: 'Four topics follow the attack. First how it gets in and how the line defends itself.', focus: 'grpA' },
        { nl: 'Daarna wat de wet vraagt en wat je doet als het toch gebeurt.', en: 'Then what the law asks and what you do when it happens anyway.', focus: 'grpB' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'De basis', en: 'Basics' },
      beats: [
        { nl: 'Het eerste onderwerp is De basis. Op kantoor staat vertrouwelijkheid vaak voorop.', en: 'The first topic is Basics. In the office, confidentiality often comes first.', focus: ['tBasics', 'ciaS'] },
        { nl: 'In de fabriek gaan beschikbaarheid en veiligheid voor.', en: 'In the plant, availability and safety come first.', focus: ['ciaS', 'line3', 'unit'] },
        { nl: 'Een nepmail is de meest gebruikte weg naar binnen. Dat heet phishing.', en: 'A fake mail is the most common way in. That is called phishing.', focus: ['phishS'] },
        { nl: 'Met een {t:Meldknop|meldknop} stuur je een verdachte mail met één klik naar IT.', en: 'With a {t:Report button|report button} you send a suspicious mail to IT in one click.', ...TOOL('Meldknop'), focus: ['tool1'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'OT-beveiliging', en: 'OT security' },
      beats: [
        { nl: 'Het tweede onderwerp is OT-beveiliging met IEC 62443. Een norm voor fabriek, integrator en leverancier.', en: 'The second topic is OT security with IEC 62443. A standard for plant, integrator and supplier.', focus: ['tOT', 'normS'] },
        { nl: 'Lijn 3 krijgt een eigen stuk vloer. Eén bewaakte verbinding loopt van de netwerkkast naar de besturingskast.', en: 'Line 3 gets a floor area of its own. One guarded link runs from the network cabinet to the control cabinet.', focus: ['zoneS', 'zone', 'netcab', 'plc', 'conduit'] },
        { nl: 'Zo komt een infectie van kantoor niet zomaar de lijn op.', en: 'So an infection from the office does not simply get onto the line.', focus: ['zoneS', 'conduit', 'zone'] },
        { nl: 'Je deelt de fabriek in met {t:Zone|zones} en {t:Conduit|conduits}.', en: 'You lay out the plant with {t:Zone|zones} and {t:Conduit|conduits}.', ...TOOL('Zone', 'Conduit'), focus: ['tool1', 'tool2', 'zone', 'conduit'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'NIS2 en de wet', en: 'NIS2 and the law' },
      beats: [
        { nl: 'Het derde onderwerp is NIS2 en de wet. In Nederland heet die wet de Cyberbeveiligingswet.', en: 'The third topic is NIS2 and the law. In the Netherlands that law is the Cybersecurity Act.', focus: ['tRules', 'lawS'] },
        { nl: 'De wet kent een zorgplicht, een meldplicht en een registratieplicht.', en: 'The law has a duty of care, a reporting duty and a registration duty.', focus: ['dutyS'] },
        { nl: 'Een aanval die lijn 3 stilzet, kan een melding vragen.', en: 'An attack that stops line 3 may call for a report.', focus: ['stopS', 'line3'] },
        { nl: 'Of de fabriek eronder valt, hangt af van sector en omvang.', en: 'Whether the plant is covered depends on sector and size.', focus: ['scopeS'] },
        { nl: 'Je zoekt je sector op in {t:Bijlage I|bijlage I} en {t:Bijlage II|bijlage II}.', en: 'You look up your sector in {t:Annex I|Annex I} and {t:Annex II|Annex II}.', ...TOOL('Bijlage I', 'Bijlage II'), focus: ['tool1', 'tool2'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Incidentrespons', en: 'Incident response' },
      beats: [
        { nl: 'Het vierde onderwerp is Incidentrespons. Dat is de vaste manier om een incident aan te pakken.', en: 'The fourth topic is Incident response. That is the fixed way of handling an incident.', focus: ['tResp', 'incS'] },
        { nl: 'Eerst voorbereiding en detectie, dan indamming, herstel en evaluatie.', en: 'First preparation and detection, then containment, recovery and lessons learned.', focus: ['cycS'] },
        { nl: 'Bij indamming zet je bijvoorbeeld de verbinding tussen kantoor en fabriek dicht.', en: 'In containment you might close the link between the office and the plant.', focus: ['cycS', 'conduit'] },
        { nl: 'Voor als het MES uitvalt, schrijf je een {t:Noodprocedure|noodprocedure}.', en: 'For when the MES fails, you write a {t:Manual fallback procedure|manual fallback procedure}.', ...TOOL('Noodprocedure'), focus: ['tool1', 'mes'] },
        { nl: 'Zo kan lijn 3 blijven draaien als kantoor wordt aangevallen. Daarna ga jij verder met de lijn zelf.', en: 'So line 3 can keep running when the office is attacked. Then you move on to the line itself.', focus: ['flowS', 'jij'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. Cybersecurity is het derde station van Automatisering en IT.', en: 'The whole map. Cybersecurity is the third station of Automation and IT.', focus: 'map-cyber' },
        { nl: 'Elk onderwerp heeft vier niveaus.', en: 'Every topic has four levels.', focus: 'route' },
        { nl: 'Begin op niveau Basis bij vertrouwelijkheid, integriteit en beschikbaarheid. Dat is wat je beschermt.', en: 'Start at Basics level with confidentiality, integrity and availability. That is what you protect.', focus: ['tBasics', 'start'] },
        { nl: 'Op niveau Werkkennis komen phishing, het indelen van de fabriek, wie eronder valt en voorbereiden.', en: 'At Working knowledge level come phishing, dividing the plant, who is covered and preparing.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd gaat het om MFA, hoe streng je beveiligt, de zorgplicht in de praktijk en indammen.', en: 'At Advanced level it is about MFA, how strict to be, the duty of care in practice and containing an attack.', focus: 'lv3' },
        { nl: 'Op niveau Expert gaat het om minimale rechten, patchen in OT, incidenten melden en herstellen.', en: 'At Expert level it is about least privilege, patching in OT, reporting incidents and recovering.', focus: 'lv4' },
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
// without explaining them. Every drawn detail has its reason in the narration: the filling unit and the line (the attack
// must not stop it), the network cabinet, the control cabinet and the cable with its gate (the one guarded link, from the
// network cabinet to the control cabinet), the zone (the floor of its own), the MES laptop (it fails, so a manual
// fallback procedure), you (you connect the unit and move on to the line itself).
const SAY = [
  [ // s1 the attack, what the module is, the map in two groups
    { nl: 'Jij sluit de vuleenheid van lijn 3 aan. Een aanval op kantoor mag die lijn niet stilzetten.',
      en: 'You connect the filling unit of line 3. An attack on the office must not stop that line.' },
    { nl: 'Cybersecurity leert je wat een fabriek moet regelen en hoe je erover praat.',
      en: 'Cybersecurity teaches you what a plant must arrange and how to talk about it.' },
    { nl: 'Vier onderwerpen volgen de aanval. Eerst hoe hij binnenkomt en hoe de lijn zich verdedigt.',
      en: 'Four topics follow the attack. First how it gets in and how the line defends itself.' },
    { nl: 'Daarna wat de wet vraagt en wat je doet als het toch gebeurt.',
      en: 'Then what the law asks and what you do when it happens anyway.' },
  ],
  [ // s2 the basics: office and plant weigh differently, a fake mail, the report button
    { nl: 'Het eerste onderwerp is De basis. Op kantoor staat vertrouwelijkheid vaak voorop.',
      en: 'The first topic is Basics. In the office, confidentiality often comes first.' },
    { nl: 'In de fabriek gaan beschikbaarheid en veiligheid voor.',
      en: 'In the plant, availability and safety come first.' },
    { nl: 'Een nepmail is de meest gebruikte weg naar binnen. Dat heet phishing.',
      en: 'A fake mail is the most common way in. That is called phishing.' },
    { nl: 'Met een {t:Meldknop|meldknop} stuur je een verdachte mail met één klik naar IT.',
      en: 'With a {t:Report button|report button} you send a suspicious mail to IT in one click.' },
  ],
  [ // s3 OT security: the standard, the floor of its own and the guarded link, zones and conduits
    { nl: 'Het tweede onderwerp is OT-beveiliging met IEC 62443. Een norm voor fabriek, integrator en leverancier.',
      en: 'The second topic is OT security with IEC 62443. A standard for plant, integrator and supplier.' },
    { nl: 'Lijn 3 krijgt een eigen stuk vloer. Eén bewaakte verbinding loopt van de netwerkkast naar de besturingskast.',
      en: 'Line 3 gets a floor area of its own. One guarded link runs from the network cabinet to the control cabinet.' },
    { nl: 'Zo komt een infectie van kantoor niet zomaar de lijn op.',
      en: 'So an infection from the office does not simply get onto the line.' },
    { nl: 'Je deelt de fabriek in met {t:Zone|zones} en {t:Conduit|conduits}.',
      en: 'You lay out the plant with {t:Zone|zones} and {t:Conduit|conduits}.' },
  ],
  [ // s4 NIS2 and the law
    { nl: 'Het derde onderwerp is NIS2 en de wet. In Nederland heet die wet de Cyberbeveiligingswet.',
      en: 'The third topic is NIS2 and the law. In the Netherlands that law is the Cybersecurity Act.' },
    { nl: 'De wet kent een zorgplicht, een meldplicht en een registratieplicht.',
      en: 'The law has a duty of care, a reporting duty and a registration duty.' },
    { nl: 'Een aanval die lijn 3 stilzet, kan een melding vragen.',
      en: 'An attack that stops line 3 may call for a report.' },
    { nl: 'Of de fabriek eronder valt, hangt af van sector en omvang.',
      en: 'Whether the plant is covered depends on sector and size.' },
    { nl: 'Je zoekt je sector op in {t:Bijlage I|bijlage I} en {t:Bijlage II|bijlage II}.',
      en: 'You look up your sector in {t:Annex I|Annex I} and {t:Annex II|Annex II}.' },
  ],
  [ // s5 incident response, and the story ends where the field film picks it up
    { nl: 'Het vierde onderwerp is Incidentrespons. Dat is de vaste manier om een incident aan te pakken.',
      en: 'The fourth topic is Incident response. That is the fixed way of handling an incident.' },
    { nl: 'Eerst voorbereiding en detectie, dan indamming, herstel en evaluatie.',
      en: 'First preparation and detection, then containment, recovery and lessons learned.' },
    { nl: 'Bij indamming zet je bijvoorbeeld de verbinding tussen kantoor en fabriek dicht.',
      en: 'In containment you might close the link between the office and the plant.' },
    { nl: 'Voor als het MES uitvalt, schrijf je een {t:Noodprocedure|noodprocedure}.',
      en: 'For when the MES fails, you write a {t:Manual fallback procedure|manual fallback procedure}.' },
    { nl: 'Zo kan lijn 3 blijven draaien als kantoor wordt aangevallen. Daarna ga jij verder met de lijn zelf.',
      en: 'So line 3 can keep running when the office is attacked. Then you move on to the line itself.' },
  ],
  [ // s6 the map: the level words of the app, as the captions show them
    { nl: 'De hele kaart. Cybersecurity is het derde station van Automatisering en IT.',
      en: 'The whole map. Cybersecurity is the third station of Automation and IT.' },
    { nl: 'Elk onderwerp heeft vier niveaus.',
      en: 'Every topic has four levels.' },
    { nl: 'Begin op niveau Basis bij vertrouwelijkheid, integriteit en beschikbaarheid. Dat is wat je beschermt.',
      en: 'Start at Basics level with confidentiality, integrity and availability. That is what you protect.' },
    { nl: 'Op niveau Werkkennis komen phishing, het indelen van de fabriek, wie eronder valt en voorbereiden.',
      en: 'At Working knowledge level come phishing, dividing the plant, who is covered and preparing.' },
    { nl: 'Op niveau Gevorderd gaat het om MFA, hoe streng je beveiligt, de zorgplicht in de praktijk en indammen.',
      en: 'At Advanced level it is about MFA, how strict to be, the duty of care in practice and containing an attack.' },
    { nl: 'Op niveau Expert gaat het om minimale rechten, patchen in OT, incidenten melden en herstellen.',
      en: 'At Expert level it is about least privilege, patching in OT, reporting incidents and recovering.' },
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
/* the cable on the floor reads at phone width: a little heavier than the kit's hairline */
[data-cue="cable"] .iso-line{stroke-width:2.2}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');

const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 draait. Over het begin van de band staat de nieuwe vuleenheid, met een plaat boven de dozen. In de hoek achter links de netwerkkast met poorten op de deur, een besturingskast tegen de achterwand, een kabel tussen die twee met een bewaakte schakel erop, en een gemarkeerd stuk vloer rond de lijn. Een kabel loopt ook naar de tafel vooraan links met de laptop van het MES. Jij, de engineer, staat vooraan rechts. Rechts een paneel, gemarkeerd als voorbeeld of schema: kantoor en lijn 3 met een aanval, kantoor en fabriek met wat voorop staat, een nepmail die tot een klik leidt, de norm voor fabriek, integrator en leverancier, een eigen zone voor de lijn met één bewaakte verbinding, de wet met zijn plichten, een aanval die de lijn stilzet, sector en omvang, de fasen van incidentrespons, met per onderwerp de naam van een of twee hulpmiddelen. Aan het eind de hele kaart van Engineering met Cybersecurity verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the factory, where line 3 runs. Over the start of the belt stands the new filling unit, with a plate above the cartons. In the back left corner the network cabinet with ports on its door, a control cabinet against the back wall, a cable between the two with a guard on it, and a marked area of floor round the line. A cable also runs to the table at the front left with the MES laptop. You, the engineer, stand at the front right. At the right a panel, marked as an example or a diagram: the office and line 3 with an attack, the office and the plant with what comes first, a fake mail that leads to a click, the standard for plant, integrator and supplier, a zone of its own for the line with one guarded link, the law with its obligations, an attack that stops the line, sector and size, the phases of incident response, with the names of one or two tools per topic. At the end the whole map of Engineering with Cybersecurity lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

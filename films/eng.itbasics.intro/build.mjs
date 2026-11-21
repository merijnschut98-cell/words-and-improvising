// Dev tool, not shipped. Builds the module intro film "De order naar lijn 3 / The order to line 3" for
// IT-fundamenten (eng.itbasics), an Engineering module intro film (v17, Task 13) and the first intro of the digital
// zone: the high-over picture at the top of the module, before its four topics (Merijn, 13 Nov: "that high-over
// picture is the thing I need the most"). Pattern and rules: films/eng.machining.intro (the approved reference) and
// the energy intros films/eng.gridbasics.intro and eng.fluids.intro (the digital zone has no approved reference yet),
// and the notes section "Engineering module intros".
//
//   node films/eng.itbasics.intro/build.mjs            build the page
//   node films/eng.itbasics.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.itbasics.intro.html: one offline page with the anatomy kit, the stage script
// and the player inlined. The index names it (eng.itbasics's `intro`), coursehome shows it above the topics, sw.js
// precaches it.
//
// The story: hall B of the field film films/eng.field.digital ("Automatisering en IT": the new filling unit stands ready
// on line 3 and the plant's MES, the laptop on the table at the front, has to send it orders and get counts back; you,
// the engineer, connect the unit step by step; its first station, IT-fundamenten, says the unit joins the plant network
// through the network cabinet, each device with an address like a house number and a cable to the switch, that you use a
// switch and a VLAN, and that without it an order does not find the unit). This film follows ONE ORDER from the MES to
// the filling unit and shows what each topic of the module does for it, in the room of the field film: the filling unit
// over the belt of line 3 with its cartons, the network cabinet in the back left corner with the cable to the unit and
// on to the MES laptop, the table with the laptop at the front left and you at the front. The order comes from
// the ERP, as the IT lessons say (ERP to MES: production orders). The server, the database and the ERP are not in
// the field film's room and are not drawn in it: they are in the panel, as schemas.
//   s1 the MES sends an order to the filling unit and you connect the unit; what the module is (the blurb: enough to talk
//      with IT about MES, ERP and the plant network); the map before any detail: four topics, two about the road of
//      the order (networks; servers and cloud), two about what keeps the data and how programs talk (databases and SQL;
//      software and APIs)                                                      → eng.itbasics.ipaddress
//   s2 Netwerken: every device has an IP address, like a house number; the unit hangs on the network cabinet by a cable
//      and the MES is in another network; one tool, the router that carries the order across (Basis, .ipaddress). The
//      field film's tools (switch and VLAN) are not named again, and the firewall (Werkkennis, .vlan) is left to the
//      cyber module (guarded link, zones), which gets an intro of its own
//   s3 Servers en cloud: the MES on the laptop runs on a server; a server is a computer that provides services; it is at
//      the company itself or rented in the cloud; the MES often runs in a virtual machine of its own (Basis, .server:
//      "one powerful server might run ten VMs: MES ..."; the hypervisor that arranges them is IT's, not a tool a
//      consultant uses). Werkkennis (.saas: IaaS, PaaS, SaaS, shared responsibility, latency, edge) holds no tool a
//      person uses and edge is the field film's edge gateway of another module, so this topic names one tool
//   s4 Databases en SQL: the MES keeps orders and counts in a database, in tables of rows and columns; with a query you
//      read which orders are in it (Werkkennis, .sql: something you write and run, a better tool than the primary key,
//      which is a column of the Basis lesson and not something a person uses; the Werkkennis grid beat says "gegevens
//      filteren", not the query)
//   s5 Software en API’s: the laptop is the client and asks, the server answers; the ERP sends the order to the MES
//      through an API; you usually open the MES as a web application in the browser (Basis, .clientserver; JSON, the
//      Werkkennis term of .api, is a format and stays in the lesson); the story ends where the field film picks it up
//      (the order finds the unit, then you connect it step by step), in the last topic scene
//   s6 the shared Engineering map (the kit's mapScene) with IT-fundamenten lit, then the module's four topics with their
//      levels as columns, where to start, and what each later level adds, in the app's level words
// Per the review of eng.machining.intro: how the topics hang together is said once, in s1, before any detail; a topic
// scene is short (what it is, its place in the story with a reason, then the tool sentence); the tools are real things
// of the topic at Basis or Working knowledge level, one per topic, not explained; a Werkkennis tool named in a
// scene is not named again in the closing grid (it says poorten, the forms of cloud, filtering data and interfaces, not
// the query); the closing grid has one beat per later level in the app's level words; the people
// are plant people (you); the story ends where the field film picks it up, in the last topic scene.
// Definitions as the Basis lessons word them (eng.itbasics.ipaddress, .server, .tables, .clientserver). Terms come from
// the module's lessons and {n:} numbers from the module's text (the kit's intro mode, films/_kit/build-film.mjs); the
// kit holds the film to its map (every topic named in a caption of its own scene, explained in two beats and lit), its
// narration guard and its label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): hall B as in the digital field film (the shared hall of
// films/pm.plan.intro/hall.mjs: the belt of line 3 with cartons, the network cabinet, the cable, the table with the
// laptop), with the person of the world for you. The film's own thing (the filling unit: two uprights, a beam, a
// plate and a cover) is a simple solid drawn here as in the field film. A panel at the right, in stage space, draws
// each step as a schema, labelled "voorbeeld" (the order's way) or "schema" (the module's map).
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
const MOD = MODULES.find((m) => m.id === 'eng.itbasics');
const LEVELS = {
  network: ['eng.itbasics.ipaddress', 'eng.itbasics.vlan', 'eng.itbasics.segment', 'eng.itbasics.netdesign'],
  cloud: ['eng.itbasics.server', 'eng.itbasics.saas', 'eng.itbasics.backup', 'eng.itbasics.availability'],
  data: ['eng.itbasics.tables', 'eng.itbasics.sql', 'eng.itbasics.reports', 'eng.itbasics.datamodel'],
  software: ['eng.itbasics.clientserver', 'eng.itbasics.api', 'eng.itbasics.integration', 'eng.itbasics.releases'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.itbasics has the four topics and levels this film draws');
assert(MOD.intro === 'eng.itbasics.intro', 'eng.itbasics names this film as its intro');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s1: the blurb of the module (what it is for); the first lesson's address, like a house number
assert(MOD.blurb.nl.includes('genoeg om met IT te praten over MES, ERP en het fabrieksnetwerk'), 'the module blurb (nl) says what it is for');
assert(MOD.blurb.en.includes('enough to talk with IT about MES, ERP and the plant network'), 'the module blurb (en) says what it is for');
// s2: an address like a house number; the network cabinet; a router connects subnets
has('eng.itbasics.ipaddress', ['Elk apparaat op een netwerk heeft een IP-adres', 'Het werkt als een huisnummer', 'een netwerkkast met knipperende switches', 'Een subnet is een blok adressen dat bij elkaar hoort', 'Een router verbindt subnetten met elkaar en met internet', 'Router Apparaat dat verkeer tussen subnetten']);
has('eng.itbasics.ipaddress', ['Every device on a network has an IP address', 'It works like a house number', 'a network cabinet with blinking switches', 'A subnet is a block of addresses that belong together', 'A router connects subnets to each other and to the internet', 'Router Device that forwards traffic between subnets'], 'en');
// s3: a server provides services (a MES among them); on-prem or the cloud, rented; a virtual machine is a computer in software, one server runs the MES among others
has('eng.itbasics.server', ['Een server is een computer die diensten levert aan andere computers: een database, een website, een MES', 'de server staat bij het bedrijf zelf', 'De cloud is rekenkracht en opslag die je huurt in de datacenters van een aanbieder', 'Virtuele machine Een computer in software', 'Zo draait één krachtige server bijvoorbeeld tien VM’s: MES']);
has('eng.itbasics.server', ['A server is a computer that provides services to other computers: a database, a website, an MES', 'the server is at the company itself', 'The cloud is computing power and storage you rent in a provider’s data centres', 'Virtual machine A computer in software', 'So one powerful server might run ten VMs: MES'], 'en');
// s4: the MES has a database; a table's rows and columns; a query is one question, read in SQL
has('eng.itbasics.tables', ['Achter bijna elk MES, ERP en historian zit er een', 'Elke rij is één ding: één order', 'Elke kolom is één eigenschap van dat ding: ordernummer']);
has('eng.itbasics.tables', ['Behind almost every MES, ERP and historian there is one', 'Each row is one thing: one order', 'Each column is one property of that thing: order number'], 'en');
has('eng.itbasics.sql', ['Een query is één vraag aan de database', 'een query kunnen lezen helpt enorm']);
has('eng.itbasics.sql', ['A query is one question to the database', 'being able to read a query helps enormously'], 'en');
// s5: client and server; a web application in the browser; an API is the agreed way programs talk, between ERP and MES
has('eng.itbasics.clientserver', ['De client is het programma of apparaat waar de gebruiker mee werkt', 'De client stuurt een verzoek; de server doet het werk en stuurt een antwoord terug', 'Een webapplicatie is software die je via de browser gebruikt', 'De meeste moderne MES- en kwaliteitssystemen werken zo']);
has('eng.itbasics.clientserver', ['The client is the program or device the user works with', 'The client sends a request; the server does the work and sends an answer back', 'A web application is software you use through the browser', 'Most modern MES and quality systems work like that'], 'en');
has('eng.itbasics.api', ['Een API (application programming interface) is de afgesproken manier waarop een programma met een ander programma praat', 'bijvoorbeeld ERP en MES']);
has('eng.itbasics.api', ['An API (application programming interface) is the agreed way one program talks to another', 'for example ERP and MES'], 'en');
has('eng.itbasics.api', ['ERP naar MES: productieorders']);
has('eng.itbasics.api', ['ERP to MES: production orders'], 'en');
// s6: the first lesson shows how a message finds its device (where to start)
has('eng.itbasics.ipaddress', ['berichten (packets) worden naar dat adres gestuurd']);
has('eng.itbasics.ipaddress', ['messages, called packets, are sent to that address'], 'en');
// s6: the later levels, as the lessons are titled (the closing names what each adds, without the Werkkennis tools)
for (const [id, word] of [['eng.itbasics.vlan', 'poorten'], ['eng.itbasics.saas', 'IaaS, PaaS en SaaS'], ['eng.itbasics.sql', 'WHERE'], ['eng.itbasics.api', 'koppelingen'],
  ['eng.itbasics.segment', 'OT-netwerk'], ['eng.itbasics.backup', 'Back-ups'], ['eng.itbasics.reports', 'rapporten'], ['eng.itbasics.integration', 'Koppelingen die breken'],
  ['eng.itbasics.netdesign', 'netwerk beoordelen'], ['eng.itbasics.availability', 'uitval'], ['eng.itbasics.datamodel', 'Dubbeltellingen'], ['eng.itbasics.releases', 'updates']]) has(id, [word]);
for (const [id, word] of [['eng.itbasics.vlan', 'ports'], ['eng.itbasics.saas', 'IaaS, PaaS and SaaS'], ['eng.itbasics.sql', 'WHERE'], ['eng.itbasics.api', 'interfaces'],
  ['eng.itbasics.segment', 'OT network'], ['eng.itbasics.backup', 'Backups'], ['eng.itbasics.reports', 'reports'], ['eng.itbasics.integration', 'Interfaces that break'],
  ['eng.itbasics.netdesign', 'Judging a plant network'], ['eng.itbasics.availability', 'outage'], ['eng.itbasics.datamodel', 'Double counting'], ['eng.itbasics.releases', 'updates']]) has(id, [word], 'en');
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
// and a beam, a plate hung from the beam above the cartons, a plastic cover on top), the network cabinet in the back
// left corner (the switch's cabinet) with a cable to the unit and a cable on to the MES laptop, the table with the
// laptop at the front left, you at the front, between the table and the unit. Without the field film's tank, PLC cabinet, zone, photo-eyes, edge
// box and screen: other stations own them.
const BELT = { x: 130, y: 16, len: 130, dep: 34 };
const UX = 152; // x of the uprights and the beam
const FRAME = { top: 150, beam: 160 };
const PLATE = { z0: 100, z1: 146 }; // the filling head: its foot clears the cartons (60 to 80)
const TABLE = { x: 18, y: 108, w: 76, d: 42, h: 74 };
const NET = { x: 4, w: 20, d: 18, h: 124 };
const CABLES = [[[14, 19], [14, 60], [150, 60]], [[14, 60], [14, 126], [18, 126]]];
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
const cables = CABLES.map((pts) => hall.cable(pts, {})).join('');

// painted back to front (large x and small y are far): the belt, the unit, the network cabinet and its cable (shown
// from the second scene on), the MES table with its laptop, you
const world = [
  w.room(ROOM),
  cueG('line3', hall.conveyor({ ...BELT, cartons: 4 })),
  cueG('unit', frame + plate + cover),
  g('o-net', cueG('netcab', netcab) + cueG('cable', cables)),
  cueG('mes', w.table(TABLE) + w.laptop({ x: TABLE.x + TABLE.w / 2, y: TABLE.y + TABLE.d / 2, z: TABLE.h, toward: 1 })),
  g('pp-jij', person('jij', 262, 128, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame
// (data-k): the four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the
// schemas of each beat. The shared map (the kit's mapScene) sits under the panel; its place IT-fundamenten is a cue
// group of its own (map-itbasics).
const TILE = { network: 'tNet', cloud: 'tCloud', data: 'tDb', software: 'tSoft' };
const PANEL = ['flowS', 'defS', 'grpA', 'grpB', 'addrS', 'netS', 'svS', 'hostS', 'dbS', 'tabS', 'csS', 'apiS',
  'tool1', 'tool2', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, IT-fundamenten lit, in the stage (the film's closing scene; the stage script moves and fades it)
const { w: MAP_W, h: MAP_H } = engMap.view; // the Engineering map's sheet (viewBox of the wide drawing), from the map data
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.itbasics'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.itbasics');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.itbasics')}"`), 'the map lights eng.itbasics as a cue group');
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
  { from: cam(140, 70, 60, 1.0), to: cam(140, 75, 60, 1.06) }, // s1 the whole hall: the unit on line 3, the MES table, you
  { from: cam(70, 60, 60, 1.2), to: cam(80, 60, 60, 1.35) }, // s2 the network cabinet, its cable to the unit and to the MES
  { from: cam(40, 110, 50, 1.4), to: cam(45, 115, 55, 1.55) }, // s3 the MES laptop at the table
  { from: cam(40, 110, 50, 1.4), to: cam(45, 115, 55, 1.55) }, // s4 the MES laptop (the MES keeps its data)
  { from: cam(60, 90, 55, 1.15), to: cam(120, 60, 70, 1.3), at: 3 }, // s5 the laptop, then (b3) the unit at the end of the cable
  { from: cam(150, 70, 60, 1), to: cam(150, 70, 60, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a, b) => ({ cue: { [a]: 'tool1', ...(b ? { [b]: 'tool2' } : {}) } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.itbasics.intro',
  title: { nl: 'De order naar lijn 3', en: 'The order to line 3' },
  module: 'eng.itbasics',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.itbasics, the scene that explains it and its tile
  topics: {
    network: { scene: 's2', cue: 'tNet' },
    cloud: { scene: 's3', cue: 'tCloud' },
    data: { scene: 's4', cue: 'tDb' },
    software: { scene: 's5', cue: 'tSoft' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'De order en de eenheid', en: 'The order and the unit' },
      beats: [
        { nl: 'Het MES stuurt een order naar de vuleenheid van lijn 3. Jij sluit die eenheid aan.', en: 'The MES sends an order to the filling unit of line 3. You connect that unit.', focus: ['flowS', 'mes', 'unit', 'jij'] },
        { nl: 'IT-fundamenten leert je genoeg om met IT te praten over MES, ERP en het fabrieksnetwerk.', en: 'IT fundamentals teaches you enough to talk with IT about MES, ERP and the plant network.', focus: ['defS', 'mes'] },
        { nl: 'Vier onderwerpen volgen de order. Eerst langs welke weg hij gaat en waar het MES draait.', en: 'Four topics follow the order. First the road it takes and where the MES runs.', focus: 'grpA' },
        { nl: 'Daarna waar orders en tellingen blijven en hoe programma’s met elkaar praten.', en: 'Then where orders and counts are kept and how programs talk to each other.', focus: 'grpB' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Netwerken', en: 'Networks' },
      beats: [
        { nl: 'Het eerste onderwerp is Netwerken. Elk apparaat heeft een IP-adres, als een huisnummer.', en: 'The first topic is Networks. Every device has an IP address, like a house number.', focus: ['tNet', 'addrS', 'unit'] },
        { nl: 'De eenheid hangt met een kabel aan de netwerkkast. Het MES zit in een ander netwerk.', en: 'The unit hangs on the network cabinet by a cable. The MES is in another network.', focus: ['netS', 'netcab', 'cable'] },
        { nl: 'Een {t:Router|router} brengt de order van het ene netwerk naar het andere.', en: 'A {t:Router|router} carries the order from one network to the other.', ...TOOL('Router'), focus: ['tool1', 'tool2', 'cable'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Servers', en: 'Servers' },
      beats: [
        { nl: 'Het tweede onderwerp is Servers en cloud. Het MES op de laptop draait op een server.', en: 'The second topic is Servers and cloud. The MES on the laptop runs on a server.', focus: ['tCloud', 'svS', 'mes'] },
        { nl: 'Een server is een computer die diensten levert. Hij staat bij het bedrijf zelf of je huurt hem in de cloud.', en: 'A server is a computer that provides services. It stands at the company itself or you rent it in the cloud.', focus: ['hostS'] },
        { nl: 'Het MES draait vaak in een eigen {t:Virtuele machine|virtuele machine} op die server.', en: 'The MES often runs in a {t:Virtual machine|virtual machine} of its own on that server.', ...TOOL('Virtuele machine'), focus: ['tool1', 'mes'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Databases', en: 'Databases' },
      beats: [
        { nl: 'Het derde onderwerp is Databases en SQL. Het MES bewaart orders en tellingen in een database.', en: 'The third topic is Databases and SQL. The MES keeps orders and counts in a database.', focus: ['tDb', 'dbS', 'mes'] },
        { nl: 'De gegevens staan in tabellen. Elke rij is één order en elke kolom is één eigenschap.', en: 'The data sits in tables. Each row is one order and each column is one property.', focus: ['tabS'] },
        { nl: 'Met een {t:Query|query} lees je welke orders erin staan.', en: 'With a {t:Query|query} you read which orders are in it.', ...TOOL('Query'), focus: ['tool1', 'tool2', 'mes'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Software', en: 'Software' },
      beats: [
        { nl: 'Het vierde onderwerp is Software en API’s. De laptop is de client en vraagt, de server antwoordt.', en: 'The fourth topic is Software and APIs. The laptop is the client and asks, the server answers.', focus: ['tSoft', 'csS', 'mes'] },
        { nl: 'De order komt uit het ERP. Een API is de afgesproken manier waarop programma’s met elkaar praten.', en: 'The order comes from the ERP. An API is the agreed way programs talk to each other.', focus: ['apiS'] },
        { nl: 'Meestal open je het MES als {t:Webapplicatie|webapplicatie} in de browser.', en: 'You usually open the MES as a {t:Web application|web application} in the browser.', ...TOOL('Webapplicatie'), focus: ['tool1', 'tool2', 'mes'] },
        { nl: 'Zo vindt de order de eenheid. Dan sluit jij hem stap voor stap aan.', en: 'So the order finds the unit. Then you connect it step by step.', focus: ['apiS', 'unit', 'jij'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. IT-fundamenten is het eerste station van Automatisering en IT.', en: 'The whole map. IT fundamentals is the first station of Automation and IT.', focus: 'map-itbasics' },
        { nl: 'Elk onderwerp heeft vier niveaus.', en: 'Every topic has four levels.', focus: 'route' },
        { nl: 'Begin bij IP-adressen, LAN en DNS op niveau Basis. Die les laat zien hoe berichten hun apparaat vinden.', en: 'Start with IP addresses, LAN and DNS at Basics level. That lesson shows how messages find their device.', focus: ['tNet', 'start'] },
        { nl: 'Op niveau Werkkennis komen poorten, de vormen van cloud, gegevens filteren en koppelingen.', en: 'At Working knowledge level come ports, the forms of cloud, filtering data and interfaces.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd komen het OT-netwerk, back-ups, rapporten die verschillen en koppelingen die breken.', en: 'At Advanced level come the OT network, backups, reports that disagree and interfaces that break.', focus: 'lv3' },
        { nl: 'Op niveau Expert gaat het om een netwerk beoordelen, wat uitval kost, dubbeltellingen en updates.', en: 'At Expert level it is about judging a network, what an outage costs, double counting and updates.', focus: 'lv4' },
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
// without explaining them. Every drawn detail has its reason in the narration: the MES laptop (it sends the order and
// runs on a server), the filling unit (the order's goal), the network cabinet with its cable (the unit hangs on it
// and the MES is in another network), you (you connect the unit).
const SAY = [
  [ // s1 the order, what the module is, the map in two groups
    { nl: 'Het MES stuurt een order naar de vuleenheid van lijn 3. Jij sluit die eenheid aan.',
      en: 'The MES sends an order to the filling unit of line 3. You connect that unit.' },
    { nl: 'IT-fundamenten leert je genoeg om met IT te praten over MES, ERP en het fabrieksnetwerk.',
      en: 'IT fundamentals teaches you enough to talk with IT about MES, ERP and the plant network.' },
    { nl: 'Vier onderwerpen volgen de order. Eerst langs welke weg hij gaat en waar het MES draait.',
      en: 'Four topics follow the order. First the road it takes and where the MES runs.' },
    { nl: 'Daarna waar orders en tellingen blijven en hoe programma’s met elkaar praten.',
      en: 'Then where orders and counts are kept and how programs talk to each other.' },
  ],
  [ // s2 networks: the address, the cabinet and the other network, the router
    { nl: 'Het eerste onderwerp is Netwerken. Elk apparaat heeft een IP-adres, als een huisnummer.',
      en: 'The first topic is Networks. Every device has an IP address, like a house number.' },
    { nl: 'De eenheid hangt met een kabel aan de netwerkkast. Het MES zit in een ander netwerk.',
      en: 'The unit hangs on the network cabinet by a cable. The MES is in another network.' },
    { nl: 'Een {t:Router|router} brengt de order van het ene netwerk naar het andere.',
      en: 'A {t:Router|router} carries the order from one network to the other.' },
  ],
  [ // s3 servers and cloud
    { nl: 'Het tweede onderwerp is Servers en cloud. Het MES op de laptop draait op een server.',
      en: 'The second topic is Servers and cloud. The MES on the laptop runs on a server.' },
    { nl: 'Een server is een computer die diensten levert. Hij staat bij het bedrijf zelf of je huurt hem in de cloud.',
      en: 'A server is a computer that provides services. It stands at the company itself or you rent it in the cloud.' },
    { nl: 'Het MES draait vaak in een eigen {t:Virtuele machine|virtuele machine} op die server.',
      en: 'The MES often runs in a {t:Virtual machine|virtual machine} of its own on that server.' },
  ],
  [ // s4 databases and SQL
    { nl: 'Het derde onderwerp is Databases en SQL. Het MES bewaart orders en tellingen in een database.',
      en: 'The third topic is Databases and SQL. The MES keeps orders and counts in a database.' },
    { nl: 'De gegevens staan in tabellen. Elke rij is één order en elke kolom is één eigenschap.',
      en: 'The data sits in tables. Each row is one order and each column is one property.' },
    { nl: 'Met een {t:Query|query} lees je welke orders erin staan.',
      en: 'With a {t:Query|query} you read which orders are in it.' },
  ],
  [ // s5 software and APIs, and the story ends where the field film picks it up
    { nl: 'Het vierde onderwerp is Software en API’s. De laptop is de client en vraagt, de server antwoordt.',
      en: 'The fourth topic is Software and APIs. The laptop is the client and asks, the server answers.' },
    { nl: 'De order komt uit het ERP. Een API is de afgesproken manier waarop programma’s met elkaar praten.',
      en: 'The order comes from the ERP. An API is the agreed way programs talk to each other.' },
    { nl: 'Meestal open je het MES als {t:Webapplicatie|webapplicatie} in de browser.',
      en: 'You usually open the MES as a {t:Web application|web application} in the browser.' },
    { nl: 'Zo vindt de order de eenheid. Dan sluit jij hem stap voor stap aan.',
      en: 'So the order finds the unit. Then you connect it step by step.' },
  ],
  [ // s6 the map: the level words of the app, as the captions show them
    { nl: 'De hele kaart. IT-fundamenten is het eerste station van Automatisering en IT.',
      en: 'The whole map. IT fundamentals is the first station of Automation and IT.' },
    { nl: 'Elk onderwerp heeft vier niveaus.',
      en: 'Every topic has four levels.' },
    { nl: 'Begin bij IP-adressen, LAN en DNS op niveau Basis. Die les laat zien hoe berichten hun apparaat vinden.',
      en: 'Start with IP addresses, LAN and DNS at Basics level. That lesson shows how messages find their device.' },
    { nl: 'Op niveau Werkkennis komen poorten, de vormen van cloud, gegevens filteren en koppelingen.',
      en: 'At Working knowledge level come ports, the forms of cloud, filtering data and interfaces.' },
    { nl: 'Op niveau Gevorderd komen het OT-netwerk, back-ups, rapporten die verschillen en koppelingen die breken.',
      en: 'At Advanced level come the OT network, backups, reports that disagree and interfaces that break.' },
    { nl: 'Op niveau Expert gaat het om een netwerk beoordelen, wat uitval kost, dubbeltellingen en updates.',
      en: 'At Expert level it is about judging a network, what an outage costs, double counting and updates.' },
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
.pm-dash{fill:none;stroke:var(--anatomy-hi);stroke-width:1.6;stroke-dasharray:5 4;stroke-linecap:round}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-dash{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-bar,.pm-lvl,.pm-out){stroke:var(--fp-accent)}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');

const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 draait. Over het begin van de band staat de nieuwe vuleenheid, met een plaat boven de dozen. In de hoek achter links de netwerkkast met poorten op de deur, met een kabel naar de eenheid en een kabel naar de tafel vooraan links met de laptop van het MES. Jij, de engineer, staat vooraan tussen de tafel en de eenheid. Rechts een paneel, gemarkeerd als voorbeeld of schema: het MES, de order en de vuleenheid, het adres van de eenheid en van het MES in twee netwerken, een laptop met een server die bij het bedrijf staat of in de cloud, een database met een tabel van orders, een client en een server, het ERP dat via een API de order naar het MES en de eenheid stuurt, met per onderwerp de naam van een of twee hulpmiddelen. Aan het eind de hele kaart van Engineering met IT-fundamenten verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the factory, where line 3 runs. Over the start of the belt stands the new filling unit, with a plate above the cartons. In the back left corner the network cabinet with ports on its door, with a cable to the unit and a cable to the table at the front left with the MES laptop. You, the engineer, stand at the front between the table and the unit. At the right a panel, marked as an example or a diagram: the MES, the order and the filling unit, the address of the unit and of the MES in two networks, a laptop with a server that stands at the company or in the cloud, a database with a table of orders, a client and a server, the ERP that sends the order through an API to the MES and the unit, with the names of one or two tools per topic. At the end the whole map of Engineering with IT fundamentals lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

// Dev tool, not shipped. Builds the module intro film "Waarom lijn 3 moet wachten / Why line 3 has to wait" for
// Netplanning en de energietransitie (eng.gridplanning), an Engineering module intro film (v17, Task 13) and the last
// intro of the energy zone: the high-over picture at the top of the module, before its four topics (Merijn, 13 Nov:
// "that high-over picture is the thing I need the most"). Pattern and rules: films/eng.gridbasics.intro (the first
// energy intro) and films/eng.machining.intro (the approved reference), and the notes section "Engineering module
// intros".
//
//   node films/eng.gridplanning.intro/build.mjs            build the page
//   node films/eng.gridplanning.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.gridplanning.intro.html: one offline page with the anatomy kit, the stage
// script and the player inlined. The index names it (eng.gridplanning's `intro`), coursehome shows it above the
// topics, sw.js precaches it.
//
// The story: hall B of the field film films/eng.field.energy ("Energie en het net": line 3 moves and needs more
// power; its last station, Netplanning en de energietransitie, says the planner looks at how much power is needed
// later and where the grid gets full, that he runs a load flow for each scenario, and that without this the
// upgrade comes too late and the next line waits for power). This film asks the question that station leaves open:
// why does line 3's heavier connection have to wait? It is seen from the grid planner, the one new person of this
// film: a planner of the grid operator who comes to the wall where the cable enters hall B, with his tablet. The
// room is the shared hall B (the cable through the left wall, the power cabinet, line 3 at the right); the one new
// thing is the heavier connection, drawn as a dashed cable next to the cable that is there (hall.cable with dashed:
// it is planned, not laid), and it stays dashed to the end, because it has to wait. Every topic of the module has
// its place on that one road:
//   s1 line 3 needs a heavier connection and a planner finds out why it has to wait; planning starts with how much
//      power flows at the same moment (as the first lesson words it); the map before any detail: four topics, two
//      about what is coming and whether the grid holds (load and forecasting; network design and redundancy), two
//      about what gets built and how you buy time (investment planning; flexibility)   → eng.gridplanning.demand
//   s2 Belasting en prognose: not everyone peaks at the same moment (simultaneity), then he looks ahead, demand
//      grows and line 3 comes on top; a load flow shows what current runs through the cable to hall B
//      (Werkkennis, .loadflow)                                                          → .demand (.loadflow)
//   s3 Netontwerp en redundantie: every design passes four checks and one asks what happens when something fails;
//      a ring feeds hall B from the other side; the voltage budget (Basis, .criteria), the one tool of the topic
//      (the inter-station link is a thing built, not a tool: dropped in review)          → .criteria
//   s4 Investeringsplanning: more bottlenecks than people and money, so they are ranked on risk, waiting customers
//      and how ready the solution is; line 3's connection may be later in the order; the planner calculates with
//      a scenario (Werkkennis, .investment) and records it in the investment plan (Basis, .plan)  → .plan (.investment)
//   s5 Flexibiliteit en alternatieven voor verzwaren: can it work without building, or later; a limit is hit only a
//      few hundred hours a year, a little less offtake then makes room; a capacity steering contract (Basis,
//      .alternatives); that buys time, line 3 can run while the heavier connection waits       → .alternatives (.flex)
//   s6 the shared Engineering map (the kit's mapScene) with Netplanning en de energietransitie lit, then the module's
//      four topics with their levels as columns, where to start, and what each later level adds, in the app's level
//      words
// Per the review of eng.machining.intro and the gridbasics intro: how the topics hang together is said once, in s1,
// before any detail; a topic scene is short (what it is, its place in the story with a reason, then the tool
// sentence); the tools are real things of the topic at Basis or Working knowledge level, one short sentence each,
// not explained. Tools (the field film's station names loadflow and scenario, which agree with s2 and s4): load and
// forecasting: load flow (Werkkennis; the one tool of the topic, simultaneity is a share and the forecast is
// Gevorderd); design: voltage budget (Basis; the topic has no device, this is its one tool-like term, a method the
// designer uses for the voltage check; the inter-station link is a thing built, so it is not named); investment:
// scenario (Werkkennis) and investment plan (Basis, a document); flexibility: capacity steering contract (Basis, the chip is two lines, the
// full word and the abbreviation), the one real tool of the topic (clipping is a
// measure for solar farms, GOPACS is the gridops intro's, the time-dependent contract is the gridbasics intro's
// flexible contract). The Werkkennis tools named in a scene (load flow, scenario) do not come
// back in the closing grid, which says what each level adds in the lessons' own words. The story ends where the
// field film picks it up: the heavier connection is in the plan and the next line waits, but line 3 can run.
// Definitions as the Basis lessons word them (eng.gridplanning.demand, .criteria, .plan, .alternatives). Terms come
// from the module's lessons and {n:} numbers from the module's text (the kit's intro mode, films/_kit/build-film.mjs);
// the kit holds the film to its map (every topic named in a caption of its own scene, explained in two beats and
// lit), its narration guard and its label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): hall B as in the energy field film (the shared hall
// of films/pm.plan.intro/hall.mjs: the power cabinet, the cable through the left wall, a packing line), with
// pm.agile.scrum's po figure (a jumper and a tablet) for the planner. The film's own things (the wall entry) are
// simple solids drawn here. A panel at the right, in stage space, draws each step as a schema, labelled "voorbeeld"
// (line 3's way) or "schema" (the module's map).
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
const MOD = MODULES.find((m) => m.id === 'eng.gridplanning');
const LEVELS = {
  load: ['eng.gridplanning.demand', 'eng.gridplanning.loadflow', 'eng.gridplanning.forecast', 'eng.gridplanning.timeseries'],
  design: ['eng.gridplanning.criteria', 'eng.gridplanning.structures', 'eng.gridplanning.redundancy', 'eng.gridplanning.riskdesign'],
  invest: ['eng.gridplanning.plan', 'eng.gridplanning.investment', 'eng.gridplanning.prioritise', 'eng.gridplanning.execution'],
  flex: ['eng.gridplanning.alternatives', 'eng.gridplanning.flex', 'eng.gridplanning.storage', 'eng.gridplanning.deferral'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.gridplanning has the four topics and levels this film draws');
assert(MOD.intro === 'eng.gridplanning.intro', 'eng.gridplanning names this film as its intro');
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s1: planning starts with how much power flows at the same moment
has('eng.gridplanning.demand', ['Elke netplanning begint met de vraag hoeveel vermogen er straks tegelijk loopt']);
has('eng.gridplanning.demand', ['All grid planning starts with how much power will flow at the same moment'], 'en');
// s2: simultaneity, the load flow
has('eng.gridplanning.demand', ['Gelijktijdigheid, uitgelegd in Het elektriciteitsnet, is het deel van ieders maximum dat op hetzelfde moment optreedt']);
has('eng.gridplanning.demand', ['Simultaneity, explained in The electricity grid, is the share of everyone’s maximum that occurs at the same time'], 'en');
has('eng.gridplanning.loadflow', ['welke stroom loopt er door elke kabel en trafo', 'Loadflow Berekening van stromen en spanningen in elk deel van het net', 'Nederlandse netplanners rekenen dat in tools als Vision of PowerFactory']);
has('eng.gridplanning.loadflow', ['what current flows through every cable and transformer', 'Load flow A calculation of the currents and voltages in every part of the grid', 'Dutch grid planners run it in tools such as Vision or PowerFactory'], 'en');
// s3: four checks, one is the reserve; the MV ring; the voltage budget; the inter-station link
has('eng.gridplanning.criteria', ['Elk netontwerp moet door vier toetsen', 'Reserve: wat gebeurt er als er iets uitvalt?', 'MS-netten zijn ringen die op één punt openstaan, zodat je na een storing van de andere kant kunt voeden', 'Spanningsbudget Het deel van de spanningsband dat elk deel van het net']);
has('eng.gridplanning.criteria', ['Every grid design has to pass four checks', 'Reserve: what happens if something fails?', 'MV networks are rings that are open at one point, so after a fault you can feed from the other side', 'Voltage budget The share of the voltage band each part of the grid'], 'en');
has('eng.gridplanning.structures', ['verbindt strengen van twee verschillende onderstations', 'Stationskoppeling Een verbinding tussen strengen van twee onderstations']);
has('eng.gridplanning.structures', ['connects feeders from two different primary substations', 'Inter-station link A link between feeders from two primary substations'], 'en');
// s4: more bottlenecks than people and money, ranked; the scenario; the investment plan
has('eng.gridplanning.investment', ['Er is meer nodig dan er mensen en geld zijn, dus knelpunten worden gerangschikt op risico (overbelasting, veiligheid), wachtende klanten en hoe klaar de oplossing is', 'Netbeheerders plannen tegen een scenario', 'Scenario Een samenhangend beeld van toekomstige vraag en opwek']);
has('eng.gridplanning.investment', ['More is needed than there are people and money, so bottlenecks are ranked by risk (overload, safety), waiting customers and how ready the solution is', 'Grid operators plan against a scenario', 'Scenario A consistent picture of future demand and generation'], 'en');
has('eng.gridplanning.plan', ['Elke netbeheerder, regionaal en TenneT, maakt elke twee jaar een investeringsplan', 'Investeringsplan Het openbare plan waarin een netbeheerder elke twee jaar zijn knelpunten en geplande uitbreidingen beschrijft']);
has('eng.gridplanning.plan', ['Every grid operator, regional and TenneT, makes an investment plan every two years', 'Investment plan The public plan in which a grid operator sets out its bottlenecks and planned expansions every two years'], 'en');
// s5: without building or later; a few hundred hours; the capacity steering contract; it buys time
has('eng.gridplanning.alternatives', ['Bij elk knelpunt hoort de vraag: kan het zonder bouwen, of later?', 'Capaciteitssturingscontract CSC: een contract waarin een klant zijn gebruik op afroep of in vaste blokken beperkt of verhoogt tegen een vergoeding']);
has('eng.gridplanning.alternatives', ['Every bottleneck comes with the question: can it be done without building, or later?', 'Capacity steering contract CSC: a contract in which a customer lowers or raises its use on call or in fixed blocks for a fee'], 'en');
has('eng.gridplanning.flex', ['een congestiestreng zit misschien maar een paar honderd van de 8.760 uur per jaar boven de grens', 'Als een paar klanten in die uren minder afnemen of invoeden, passen er meer klanten op hetzelfde net', 'Het koopt tijd; het vervangt zelden verzwaring']);
has('eng.gridplanning.flex', ['a congested feeder may be over its limit for only a few hundred of the 8,760 hours a year', 'If a few customers use or feed in less in those hours, more customers fit on the same grid', 'It buys time; it rarely replaces reinforcement'], 'en');
// s6: where to start, and the later levels, as the lessons are titled (the grid names what each adds)
has('eng.gridplanning.demand', ['Van woning tot station']);
has('eng.gridplanning.demand', ['From home to station'], 'en');
for (const [id, word] of [['eng.gridplanning.loadflow', 'in gewone woorden'], ['eng.gridplanning.structures', 'De MS-ring'], ['eng.gridplanning.investment', 'Investeringsplanning'], ['eng.gridplanning.flex', 'Flexibiliteit en congestiemanagement'],
  ['eng.gridplanning.forecast', 'Prognose per station'], ['eng.gridplanning.redundancy', 'N-1 en redundantie'], ['eng.gridplanning.prioritise', 'Prioriteren'], ['eng.gridplanning.storage', 'Batterijen'],
  ['eng.gridplanning.timeseries', 'Tijdreeksen'], ['eng.gridplanning.riskdesign', 'Risicogestuurd ontwerpen'], ['eng.gridplanning.execution', 'Van plan naar gebouwd net'], ['eng.gridplanning.deferral', 'waarde van uitstel']]) has(id, [word]);
for (const [id, word] of [['eng.gridplanning.loadflow', 'in plain words'], ['eng.gridplanning.structures', 'The MV ring'], ['eng.gridplanning.investment', 'Investment planning'], ['eng.gridplanning.flex', 'Flexibility and congestion management'],
  ['eng.gridplanning.forecast', 'Forecast per station'], ['eng.gridplanning.redundancy', 'N-1 and redundancy'], ['eng.gridplanning.prioritise', 'Prioritising'], ['eng.gridplanning.storage', 'Batteries'],
  ['eng.gridplanning.timeseries', 'Time series'], ['eng.gridplanning.riskdesign', 'Risk-based design'], ['eng.gridplanning.execution', 'From plan to built grid'], ['eng.gridplanning.deferral', 'value of deferral']]) has(id, [word], 'en');
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

// where things stand (cm), as in the energy field film: the power cabinet at the back wall at the left (x 12), the cable
// from the grid through the left wall (y 86 to 114) to the cabinet, line 3 at the right (x 186). New here: the heavier
// connection, a dashed cable beside the one that is there (planned, not laid), and the planner by the wall entry.
const CAB = { x: 12, w: 40, d: 26, h: 124 };
const L3 = { x: 186, y: 16, len: 84, dep: 34 };
const cabA = hall.cable([[0, 100], [32, 100], [32, 28]]);
const cabNew = hall.cable([[0, 90], [20, 90], [20, 28]], { dashed: true });
const wallEntry = w.box({ x: 0, y: 86, w: 10, d: 28, r: 1.5 }, 0, 40, { tone: 'lo' }, { steps: 2 })
  + w.box({ x: 10, y: 96, w: 3, d: 8, r: 1 }, 0, 10, { tone: 'mid' }, { steps: 1 });
const PLN = { x: 100, y: 56 };
const JIJ = { x: 152, y: 66 };
const planner = scrumPerson(w, k, G, P, { x: PLN.x, y: PLN.y, key: 'planner', look: 'po', along: 'y' });

// painted back to front (large x and small y are far): the cables and the cabinet, the line, the people (the
// planner, you)
const world = [
  w.room(ROOM),
  cueG('net', wallEntry + cabA),
  cueG('newc', cabNew),
  cueG('cab', hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h })),
  cueG('line3', hall.conveyor({ ...L3, cartons: 3 })),
  g('pp-planner', planner),
  g('pp-jij', person('jij', JIJ.x, JIJ.y, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame
// (data-k): the four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the
// schemas of each beat. The shared Engineering map (the kit's mapScene) sits under the panel; its place Netplanning en
// de energietransitie is a cue group of its own (map-gridplanning).
const TILE = { load: 'tLoad', design: 'tDesign', invest: 'tInvest', flex: 'tFlex' };
const PANEL = ['waitS', 'nowS', 'grpA', 'grpB', 'gelS', 'growS', 'critS', 'ringS', 'qS', 'rkS', 'rnS', 'altS', 'curveS', 'timeS',
  'tool1', 'tool2', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
// the shared map, Netplanning en de energietransitie lit, in the stage (the film's closing scene; the stage script moves and fades it)
const MAP_W = 640;
const MAP_H = 1128;
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.gridplanning'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.gridplanning');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.gridplanning')}"`), 'the map lights eng.gridplanning as a cue group');
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
  { from: cam(140, 70, 50, 1.0), to: cam(130, 75, 50, 1.06) }, // s1 the whole hall: the cable, the cabinet, line 3
  { from: cam(150, 40, 60, 1.25), to: cam(70, 70, 50, 1.3), at: 2 }, // s2 line 3 and the load, then (b2) the cable to hall B
  { from: cam(70, 70, 50, 1.3), to: cam(60, 70, 55, 1.4), at: 1 }, // s3 the cable, the cabinet, then (b1) the two cables
  { from: cam(140, 75, 50, 1.0), to: cam(140, 80, 50, 1.04) }, // s4 the whole hall: the planner and line 3
  { from: cam(150, 60, 50, 1.3), to: cam(140, 70, 55, 1.0), at: 3 }, // s5 the hall, then (b3) the whole hall: line 3 runs and the dashed cable still waits
  { from: cam(150, 70, 60, 1), to: cam(150, 70, 60, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a, b) => ({ cue: { [a]: 'tool1', ...(b ? { [b]: 'tool2' } : {}) } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.gridplanning.intro',
  title: { nl: 'Waarom lijn 3 moet wachten: netplanning', en: 'Why line 3 has to wait: grid planning' },
  module: 'eng.gridplanning',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.gridplanning, the scene that explains it and its tile
  topics: {
    load: { scene: 's2', cue: 'tLoad' },
    design: { scene: 's3', cue: 'tDesign' },
    invest: { scene: 's4', cue: 'tInvest' },
    flex: { scene: 's5', cue: 'tFlex' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Lijn 3 wacht', en: 'Line 3 waits' },
      beats: [
        { nl: 'Lijn 3 in hal B heeft een zwaardere aansluiting nodig. Die ligt er nog niet.', en: 'Line 3 in hall B needs a heavier connection. It is not there yet.', focus: ['waitS', 'newc', 'line3', 'jij'] },
        { nl: 'Een netplanner zoekt uit waarom die moet wachten.', en: 'A grid planner finds out why it has to wait.', focus: ['waitS', 'planner'] },
        { nl: 'Elke netplanning begint met de vraag hoeveel vermogen er straks tegelijk loopt.', en: 'All grid planning starts with how much power will flow at the same moment.', focus: ['nowS', 'planner', 'line3'] },
        { nl: 'Vier onderwerpen volgen zijn werk. Eerst wat er komt en of het net een storing doorstaat.', en: 'Four topics follow his work. First what is coming and whether the grid survives a failure.', focus: 'grpA' },
        { nl: 'Daarna wat er gebouwd wordt en hoe je tijd koopt.', en: 'Then what gets built and how you buy time.', focus: 'grpB' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Belasting', en: 'Load' },
      beats: [
        { nl: 'Eerste onderwerp: Belasting en prognose. Gelijktijdigheid: het deel van ieders maximum dat tegelijk optreedt.', en: 'First topic: Load and forecasting. Simultaneity is the share of everyone’s maximum that occurs at once.', focus: ['tLoad', 'gelS', 'line3'] },
        { nl: 'Daarna kijkt de planner vooruit. De vraag groeit en lijn 3 komt erbovenop. Zo komt de grens in zicht.', en: 'Then the planner looks ahead. Demand grows and line 3 comes on top. So the limit comes into view.', focus: ['growS', 'line3', 'planner'] },
        { nl: 'Hij draait een {t:Loadflow|loadflow} en ziet welke stroom door de kabel naar hal B loopt.', en: 'He runs a {t:Load flow|load flow} and sees what current runs through the cable to hall B.', ...TOOL('Loadflow'), focus: ['tool1', 'net'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Ontwerp', en: 'Design' },
      beats: [
        { nl: 'Tweede onderwerp: Netontwerp en redundantie. Eén van de vier toetsen vraagt wat er gebeurt als iets uitvalt.', en: 'Second topic: Network design and redundancy. One of four checks asks what happens when something fails.', focus: ['tDesign', 'critS', 'cab'] },
        { nl: 'Een ring geeft reserve. Valt een kabel uit, dan voedt de andere kant hal B.', en: 'A ring gives reserve. If a cable fails, the other side feeds hall B.', focus: ['ringS', 'net', 'newc'] },
        { nl: 'Voor de toets op spanning verdeelt hij het {t:Spanningsbudget|spanningsbudget} over het net.', en: 'For the voltage check he shares out the {t:Voltage budget|voltage budget} across the grid.', ...TOOL('Spanningsbudget'), focus: ['tool1', 'net'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Plan', en: 'Plan' },
      beats: [
        { nl: 'Derde onderwerp: Investeringsplanning. Er zijn meer knelpunten dan mensen en geld.', en: 'Third topic: Investment planning. There are more bottlenecks than people and money.', focus: ['tInvest', 'qS', 'planner'] },
        { nl: 'Dus rangschikt hij ze op risico, wachtende klanten en hoe klaar de oplossing is.', en: 'So he ranks them by risk, waiting customers and how ready the solution is.', focus: ['rkS', 'planner'] },
        { nl: 'Zo kan de aansluiting van lijn 3 later aan de beurt zijn.', en: 'So the connection of line 3 may have to wait its turn.', focus: ['rnS', 'newc', 'line3'] },
        { nl: 'Hij rekent met een {t:Scenario|scenario} en legt het vast in het {t:Investeringsplan|investeringsplan}.', en: 'He calculates with a {t:Scenario|scenario} and records it in the {t:Investment plan|investment plan}.', ...TOOL('Scenario', 'Investeringsplan'), focus: ['tool1', 'tool2', 'planner'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Flexibiliteit', en: 'Flexibility' },
      beats: [
        { nl: 'Vierde onderwerp: Flexibiliteit en alternatieven voor verzwaren. Kan het ook zonder bouwen, of later?', en: 'Fourth topic: Flexibility and alternatives to building. Can it work without building, or later?', focus: ['tFlex', 'altS', 'newc'] },
        { nl: 'Een grens wordt misschien maar een paar honderd uur per jaar geraakt. Even minder afnemen maakt ruimte.', en: 'A limit may be hit only a few hundred hours a year. Taking a little less then makes room.', focus: ['curveS', 'line3'] },
        { nl: 'Daarvoor biedt hij een {t:Capaciteitssturingscontract|capaciteitssturingscontract} aan.', en: 'For that he offers a {t:Capacity steering contract|capacity steering contract}.', ...TOOL('Capaciteitssturingscontract'), focus: ['tool1', 'net'] },
        { nl: 'Dat koopt tijd. Zo kan lijn 3 al draaien terwijl de zwaardere aansluiting wacht.', en: 'That buys time. So line 3 can already run while the heavier connection waits.', focus: ['timeS', 'line3', 'newc'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. Netplanning en de energietransitie is het zevende station van Energie en het net.', en: 'The whole map. Grid planning and the transition is the seventh station of Energy and the grid.', focus: 'map-gridplanning' },
        { nl: 'Elk onderwerp heeft vier niveaus.', en: 'Every topic has four levels.', focus: 'route' },
        { nl: 'Begin bij Van woning tot station op niveau Basis. Daar begint elke netplanning.', en: 'Start with From home to station at Basics level. That is where all grid planning begins.', focus: ['tLoad', 'start'] },
        { nl: 'Op niveau Werkkennis komen stroom en spanning in het net, de ring, de knelpunten en congestiemanagement.', en: 'At Working knowledge level come current and voltage, the ring, bottlenecks and congestion management.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd komen de prognose per station, N-1, prioriteren en batterijen.', en: 'At Advanced level come the forecast per station, N-1, prioritising and batteries.', focus: 'lv3' },
        { nl: 'Op niveau Expert komen tijdreeksen, ontwerpen op risico, van plan naar gebouwd net en de waarde van uitstel.', en: 'At Expert level come time series, risk-based design, from plan to built grid and the value of deferral.', focus: 'lv4' },
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
// brings the power into the hall), the dashed cable beside it (the heavier connection, planned but not laid, so it
// has to wait), line 3 (it needs the power), the planner by the wall (a grid planner finds out why it waits).
const SAY = [
  [ // s1 line 3 waits for a heavier connection: planning starts with the power at one moment, the map in two groups
    { nl: 'Lijn 3 in hal B heeft een zwaardere aansluiting nodig. Die ligt er nog niet.',
      en: 'Line 3 in hall B needs a heavier connection. It is not there yet.' },
    { nl: 'Een netplanner zoekt uit waarom die moet wachten.',
      en: 'A grid planner finds out why it has to wait.' },
    { nl: 'Elke netplanning begint met de vraag hoeveel vermogen er straks tegelijk loopt.',
      en: 'All grid planning starts with how much power will flow at the same moment.' },
    { nl: 'Vier onderwerpen volgen zijn werk. Eerst wat er komt en of het net een storing doorstaat.',
      en: 'Four topics follow his work. First what is coming and whether the grid survives a failure.' },
    { nl: 'Daarna wat er gebouwd wordt en hoe je tijd koopt.',
      en: 'Then what gets built and how you buy time.' },
  ],
  [ // s2 load and forecasting: simultaneity, growth, the load flow
    { nl: 'Het eerste onderwerp is Belasting en prognose. Gelijktijdigheid is het deel van ieders maximum dat tegelijk optreedt.',
      en: 'The first topic is Load and forecasting. Simultaneity is the share of everyone’s maximum that occurs at once.' },
    { nl: 'Daarna kijkt de planner vooruit. De vraag groeit en lijn 3 komt erbovenop. Zo komt de grens in zicht.',
      en: 'Then the planner looks ahead. Demand grows and line 3 comes on top. So the limit comes into view.' },
    { nl: 'Hij draait een {t:Loadflow|loadflow} en ziet welke stroom door de kabel naar hal B loopt.',
      en: 'He runs a {t:Load flow|load flow} and sees what current runs through the cable to hall B.' },
  ],
  [ // s3 network design and redundancy: four checks, the ring, the voltage budget and the link
    { nl: 'Het tweede onderwerp is Netontwerp en redundantie. Elk ontwerp gaat door vier toetsen. Eén vraagt wat er gebeurt als iets uitvalt.',
      en: 'The second topic is Network design and redundancy. Every design passes four checks. One asks what happens when something fails.' },
    { nl: 'Een ring geeft reserve. Valt een kabel uit, dan voedt de andere kant hal B.',
      en: 'A ring gives reserve. If a cable fails, the other side feeds hall B.' },
    { nl: 'Voor de toets op spanning verdeelt hij het {t:Spanningsbudget|spanningsbudget} over het net.',
      en: 'For the voltage check he shares out the {t:Voltage budget|voltage budget} across the grid.' },
  ],
  [ // s4 investment planning: too many bottlenecks, the ranking, line 3 later in the order, the scenario and the plan
    { nl: 'Het derde onderwerp is Investeringsplanning. Er zijn meer knelpunten dan mensen en geld.',
      en: 'The third topic is Investment planning. There are more bottlenecks than people and money.' },
    { nl: 'Dus rangschikt hij ze op risico, wachtende klanten en hoe klaar de oplossing is.',
      en: 'So he ranks them by risk, waiting customers and how ready the solution is.' },
    { nl: 'Zo kan de aansluiting van lijn 3 later aan de beurt zijn.',
      en: 'So the connection of line 3 may have to wait its turn.' },
    { nl: 'Hij rekent met een {t:Scenario|scenario} en legt het vast in het {t:Investeringsplan|investeringsplan}.',
      en: 'He calculates with a {t:Scenario|scenario} and records it in the {t:Investment plan|investment plan}.' },
  ],
  [ // s5 flexibility: without building or later, the few hundred hours, the contract, time bought, and the story ends
    { nl: 'Het vierde onderwerp is Flexibiliteit en alternatieven voor verzwaren. Kan het ook zonder bouwen, of later?',
      en: 'The fourth topic is Flexibility and alternatives to building. Can it work without building, or later?' },
    { nl: 'Een grens wordt misschien maar een paar honderd uur per jaar geraakt. Even minder afnemen maakt ruimte.',
      en: 'A limit may be hit only a few hundred hours a year. Taking a little less then makes room.' },
    { nl: 'Daarvoor biedt hij een {t:Capaciteitssturingscontract|capaciteitssturingscontract} aan.',
      en: 'For that he offers a {t:Capacity steering contract|capacity steering contract}.' },
    { nl: 'Dat koopt tijd. Zo kan lijn 3 al draaien terwijl de zwaardere aansluiting wacht.',
      en: 'That buys time. So line 3 can already run while the heavier connection waits.' },
  ],
  [ // s6 the map: the level words of the app, as the captions show them
    { nl: 'De hele kaart. Netplanning en de energietransitie is het zevende station van Energie en het net.',
      en: 'The whole map. Grid planning and the transition is the seventh station of Energy and the grid.' },
    { nl: 'Elk onderwerp heeft vier niveaus.',
      en: 'Every topic has four levels.' },
    { nl: 'Begin bij Van woning tot station op niveau Basis. Daar begint elke netplanning.',
      en: 'Start with From home to station at Basics level. That is where all grid planning begins.' },
    { nl: 'Op niveau Werkkennis komen stroom en spanning in het net, de ring, de knelpunten en congestiemanagement.',
      en: 'At Working knowledge level come current and voltage, the ring, bottlenecks and congestion management.' },
    { nl: 'Op niveau Gevorderd komen de prognose per station, N-1, prioriteren en batterijen.',
      en: 'At Advanced level come the forecast per station, N-1, prioritising and batteries.' },
    { nl: 'Op niveau Expert komen tijdreeksen, ontwerpen op risico, van plan naar gebouwd net en de waarde van uitstel.',
      en: 'At Expert level come time series, risk-based design, from plan to built grid and the value of deferral.' },
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

const PEOPLE = ':is([data-cue="jij"],[data-cue="planner"])';
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
.pm-gap{fill:none;stroke:#C2553F;stroke-width:2.4;stroke-linecap:round}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link,[data-cue][data-on] .pm-dash{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-bar,.pm-lvl,.pm-out,.pm-full){stroke:var(--fp-accent)}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');

const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 op zijn nieuwe plek staat. Door de linkerwand komt de kabel van het net binnen, naar de stroomkast langs de achterwand, en daarnaast loopt een gestippelde kabel voor de zwaardere aansluiting die nog niet is gelegd. Rechts de verpakkingslijn met dozen. Een netplanner van de netbeheerder met een tablet bij de muur waar de kabel binnenkomt, en jij, de engineer. Rechts een paneel, gemarkeerd als voorbeeld of schema: de huidige en de gevraagde aansluiting, balken van pieken die niet tegelijk vallen, de groei van de vraag boven een grens, de vier toetsen van een ontwerp, een ring waarin de andere kant voedt, een rij knelpunten met een rangorde, een kromme van de uren per jaar boven de grens en een tijdbalk waarop lijn 3 al draait terwijl de zwaardere aansluiting wacht, met per onderwerp de naam van een of twee hulpmiddelen. Aan het eind de hele kaart van Engineering met Netplanning en de energietransitie verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the factory, where line 3 stands at its new place. Through the left wall the cable from the grid comes in, to the power cabinet along the back wall, and beside it runs a dashed cable for the heavier connection that has not been laid yet. At the right the packing line with cartons. A grid planner of the grid operator with a tablet by the wall where the cable enters, and you, the engineer. At the right a panel, marked as an example or a diagram: the present and the requested connection, bars of peaks that do not fall at the same moment, the growth of demand above a limit, the four checks of a design, a ring in which the other side feeds, a row of bottlenecks with a ranking, a curve of the hours a year above the limit and a time bar on which line 3 already runs while the heavier connection waits, with the names of one or two tools per topic. At the end the whole map of Engineering with Grid planning and the transition lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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

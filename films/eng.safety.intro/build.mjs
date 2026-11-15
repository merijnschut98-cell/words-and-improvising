// Dev tool, not shipped. Builds the module intro film "Veilig door de dienst / Safe through the shift" for Safety on the
// floor and in the substation (eng.safety), an Engineering module intro film (v17, Task 13) and the fourth and last intro of
// the zone "De fabriek draaiend houden" (eng.field.run): the high-over picture at the top of the module, before its four
// topics (Merijn, 13 Nov: "that high-over picture is the thing I need the most"). Pattern and rules: films/eng.machining.intro
// (the approved reference), the approved intros films/eng.flow.intro and eng.safety.intro (the zone's first two intros and
// their review fixes: labels only when named, the same room coordinates as the field film), eng.lines.intro (one clear tool
// per topic, two only when they form one idea, nothing labelled before it is named, no SAY rule that is not needed) and the
// notes section "Engineering module intros".
//
//   node films/eng.safety.intro/build.mjs            build the page
//   node films/eng.safety.intro/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.safety.intro.html: one offline page with the anatomy kit, the stage script and the
// player inlined. The index names it (eng.safety's `intro`), coursehome shows it above the topics, sw.js precaches it.
//
// The story: hall B of the field film films/eng.field.run ("Een dienst op lijn 3": the filling unit stands over the belt of
// line 3, you and the team lead keep it going for a whole shift; its station Veilig werken says that when the unit jams
// someone has to get at it, that you look around first, that the energy then goes off at the switch in the grey isolator
// cabinet at the back wall with a lock and a tag, and that the tools are the LMRA and lockout-tagout). This film follows HOW
// YOU AND THE TEAM WORK SAFELY ON LINE 3 THROUGH A SHIFT, topic by topic, in the room of the field film: the belt with its
// cartons and the filling unit over it, the grey cabinet with its switch at the back wall (at the sentence that has the
// energy cut off there), its lock and tag (at the sentence that names the lockout), you and the team lead at the front. The
// hazard, the risk, the RI&E, the check list, the guard and the incident are schemas in the panel; the field film's room has
// no guard, no door switch and no report, so none is drawn there.
//   s1 line 3 must not hurt anyone; the module is about working safely, from the risks to a culture that learns (the module's
//      blurb); you and the team lead keep line 3 safe for a shift; the map before any detail: four topics in two groups (before
//      you start, with risk and controls and with isolation, electrical work and permits; the machine itself and what you
//      learn, with machine safety and with incidents and safety culture)
//   s2 Risico's en maatregelen: a hazard is anything that can do harm (Basis, .risk); risk is how likely harm is, combined with
//      how bad it would be (Basis, .risk); the tools are the RI&E (Basis, .risk: the risk assessment with a plan of action)
//      and the LMRA (Werkkennis, .lmra: a short check just before the start that catches what has changed since the plan), one
//      idea in two moments, and the field film's own LMRA
//   s3 Scheiden, elektrisch werk en vergunningen: stopping is not isolating (Basis, .loto: a stop button, an emergency stop or
//      the PLC can be reset, bridged or fail); the isolation point is the switch where the source is cut off and a lock can
//      hang (Basis, .loto), the switch in the grey cabinet; the tool is lockout-tagout (vergrendelen en labelen, Basis, .loto:
//      cut every source off, fit your own padlock and a tag with your name), the field film's other tool
//   s4 Machineveiligheid: most accidents with machines happen in the danger zone (Basis, .guarding); a guard keeps people out or
//      stops the movement before they are there (Basis, .guarding); the tool is the interlocked guard (beveiligde afscherming,
//      Basis, .guarding: a door or cover with a safety switch), drawn as a schema in the panel
//   s5 Incidenten en veiligheidscultuur: a near miss is an event that could have done harm but did not (Basis, .incidents);
//      reporting them gives free lessons and you learn without blame (Basis, .incidents: a just culture); the topic has no real
//      tool at Basis, the most tool-like term is the incident investigation (incidentonderzoek, Werkkennis, .investigate: a
//      method that asks what happened, why it made sense then and what must change in the system, not who is to blame). The
//      timeline of the same lesson is the tool of the Projects intro pm.close.intro, so it is not named here. The story ends
//      here: you and the team lead keep line 3 safe all shift
//   s6 the shared Engineering map (the kit's mapScene) with Safety lit, then the module's four topics with their levels as
//      columns, where to start, and what each later level adds, in the app's level words
// Per the review of the lines, industry40, gridplanning, flow and quality intros: one clear tool per topic; drop what is not
// needed; nothing labelled before it is named; a Werkkennis tool named in a scene (LMRA, incident investigation) is not named
// again in the closing grid; the tools of no other intro are repeated (the zone's other intros name the yamazumi, shift
// roster, stop log and changeover trolley; caliper, Cpk, X-bar/R chart and nonconformance report; bathtub curve, CILT
// standard, CMMS and multi-moment recording; the switchgear intro the voltage detector and earthing set). The RI&E is said
// "R I E" (the narration may not hold the ampersand) in a variant of the beat, not in a SAY rule.
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
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const MOD = MODULES.find((m) => m.id === 'eng.safety');
const LEVELS = {
  risk: ['eng.safety.risk', 'eng.safety.lmra', 'eng.safety.bowtie', 'eng.safety.change'],
  energy: ['eng.safety.loto', 'eng.safety.nen3140', 'eng.safety.permit', 'eng.safety.arcflash'],
  machine: ['eng.safety.guarding', 'eng.safety.machinerisk', 'eng.safety.safetyfunction', 'eng.safety.modify'],
  culture: ['eng.safety.incidents', 'eng.safety.investigate', 'eng.safety.indicators', 'eng.safety.culture'],
};
const ORDER = Object.keys(LEVELS);
assert(JSON.stringify(MOD.topics.map((t) => [t.id, t.levels])) === JSON.stringify(Object.entries(LEVELS)), 'eng.safety has the four topics and levels this film draws');
assert(MOD.intro === 'eng.safety.intro', 'eng.safety names this film as its intro');
const lessons = await allLessons();
const FAILS = [];
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def || ''}`)].join('\n'); for (const s of list) if (!text.includes(s)) FAILS.push(`${id} (${lang}) no longer says "${s}"`); };
// s1: the module's blurb, from the risks to a culture that learns
assert(MOD.blurb.nl.includes('Risico’s en maatregelen') && MOD.blurb.nl.includes('een veiligheidscultuur die leert'), 'the module blurb (nl) runs from the risks to a safety culture that learns');
assert(MOD.blurb.en.includes('Risk and controls') && MOD.blurb.en.includes('a safety culture that learns'), 'the module blurb (en) runs from the risks to a safety culture that learns');
// s2: a hazard, risk; the RI&E with its plan of action; the LMRA just before the start catches what has changed
has('eng.safety.risk', ['Een gevaar (hazard) is alles wat schade kan doen', 'Risico combineert hoe waarschijnlijk schade is met hoe erg die zou zijn', 'de RI&E (Arbowet, artikel 5)', 'met een plan van aanpak: welke maatregel, wie, wanneer']);
has('eng.safety.risk', ['A hazard is anything that can cause harm', 'Risk combines how likely harm is with how bad it would be', 'the RI&E, under article 5 of the Arbowet', 'comes with a plan of action: which measure, who, by when'], 'en');
has('eng.safety.lmra', ['De LMRA, de laatste minuut risicoanalyse, is een korte check op de werkplek, vlak voor de start, door de mensen die het werk gaan doen', 'De LMRA vangt wat er sindsdien veranderd is']);
has('eng.safety.lmra', ['The LMRA, the last-minute risk analysis, is a short check at the workplace, just before starting, by the people who will do the work', 'The LMRA catches what has changed since'], 'en');
// s3: stopping is not isolating; the isolation point is the switch where you cut a source off and fit a lock; lockout-tagout
has('eng.safety.loto', ['Stoppen is iets anders dan scheiden', 'kan worden teruggezet, overbrugd of falen', 'Elke bron heeft een scheidingspunt (isolation point): de schakelaar of afsluiter waar je hem afsluit en een slot op kunt hangen', 'je sluit elke energiebron af, hangt er je eigen hangslot op en een label met je naam']);
has('eng.safety.loto', ['Stopping a machine is not isolating it', 'can be reset, bypassed or fail', 'Each source has an isolation point: the switch or valve where you cut it off and can fit a lock', 'you cut off every energy source, fit your own padlock and hang a tag with your name'], 'en');
// s4: the danger zone; a guard keeps people out or stops the motion; the interlocked guard where people reach in regularly
has('eng.safety.guarding', ['De meeste ongevallen met machines gebeuren in de gevarenzone', 'Afscherming houdt mensen eruit, of stopt de beweging voordat ze er zijn', 'Waar mensen er regelmatig in moeten, gebruik je een beveiligde afscherming (interlocked guard): een deur of kap met een veiligheidsschakelaar']);
has('eng.safety.guarding', ['Most machine injuries happen in the danger zone', 'Guarding keeps people out of it, or stops the motion before they get there', 'Where people must reach in regularly, an interlocked guard is used: a door or cover with a safety switch'], 'en');
// s5: a near miss; reporting gives free lessons; learning without blame; the incident investigation asks what happened and why, not who is to blame
has('eng.safety.incidents', ['Een bijna-ongeval is een gebeurtenis die schade had kunnen doen maar dat niet deed', 'Bijna-ongevallen melden levert je gratis lessen op', 'Leren zonder schuld']);
has('eng.safety.incidents', ['A near miss is an event that could have caused harm but didn’t', 'Reporting near misses gives you lessons for free', 'Learning without blame'], 'en');
has('eng.safety.investigate', ['Een incidentonderzoek vraagt wat er gebeurde, waarom het voor de betrokkenen op dat moment logisch was, en wat er in het systeem moet veranderen', 'Het vraagt niet wie de schuld krijgt']);
has('eng.safety.investigate', ['An incident investigation asks what happened, why it made sense to the people at the time, and what in the system has to change', 'It does not ask who to blame'], 'en');
// s6: the first lesson names the hazard, the risk and the order of controls (where to start); the later levels, as the lessons are titled
for (const [id, word] of [['eng.safety.risk', 'Gevaar, risico en de arbeidshygiënische strategie'], ['eng.safety.lmra', 'werk stilleggen'], ['eng.safety.nen3140', 'rollen'], ['eng.safety.machinerisk', 'Risicobeoordeling van machines'],
  ['eng.safety.investigate', 'verder dan “menselijke fout”'], ['eng.safety.bowtie', 'gatenkaasmodel'], ['eng.safety.permit', 'De werkvergunning'], ['eng.safety.safetyfunction', 'Veiligheidsfuncties'], ['eng.safety.indicators', 'Veiligheidsindicatoren'],
  ['eng.safety.change', 'wijzigingsbeheer'], ['eng.safety.arcflash', 'Vlambogen'], ['eng.safety.modify', 'Oude machines'], ['eng.safety.culture', 'cultuurladder']]) has(id, [word]);
for (const [id, word] of [['eng.safety.risk', 'Hazard, risk and the hierarchy of controls'], ['eng.safety.lmra', 'stopping work'], ['eng.safety.nen3140', 'roles'], ['eng.safety.machinerisk', 'Risk assessment for machines'],
  ['eng.safety.investigate', 'beyond “human error”'], ['eng.safety.bowtie', 'Swiss cheese model'], ['eng.safety.permit', 'Permit to work'], ['eng.safety.safetyfunction', 'Safety functions'], ['eng.safety.indicators', 'Safety indicators'],
  ['eng.safety.change', 'management of change'], ['eng.safety.arcflash', 'Arc flash'], ['eng.safety.modify', 'Old machines'], ['eng.safety.culture', 'culture ladder']]) has(id, [word], 'en');
assert(FAILS.length === 0, FAILS.join('\n  '));

// the level words are the app's. The grid (stage.js, grid) has four level columns of GRID.col units from GRID.x; the words
// stand on one line each, staggered over two rows, so a word may be wider than its column but not wider than the room to
// the next word on its row, nor run off the stage. Four rows of GRID.pitch. The tile is wider than in the other intros: the
// topic title "Scheiden, elektrisch werk en vergunningen" needs two lines of 262 units (three at 240).
const LV = { nl: levelWords('nl'), en: levelWords('en') };
const GRID = { x: 304, col: 84, box: 76, tile: 274, top: 76, pitch: 74, h: 62 };
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

// where things stand (cm), as in the run field film: the filling unit over the start of line 3's belt (two uprights and a
// beam, a plate hung from the beam above the cartons, a plastic cover on top), the grey cabinet with the isolator at the back
// wall between the tank's place and the belt (a switch with a handle on the door; its lock and tag hang on it), you and the
// team lead at the front. Without the field film's tank, stop log, check table, quarantine place, CILT board and laptop:
// other stations own them.
const BELT = { x: 130, y: 16, len: 130, dep: 34 };
const UX = 152; // x of the uprights and the beam
const FRAME = { top: 150, beam: 160 };
const PLATE = { z0: 100, z1: 146 }; // the filling head: its foot clears the cartons (60 to 80)
const ISO = { x: 96, w: 30, d: 20, h: 112 }; // the grey cabinet with the isolator
const frame = [
  w.box({ x: UX, y: 5, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 52, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 5, w: 9, d: 56, r: 1 }, FRAME.top, FRAME.beam, { tone: 'mid' }, { steps: 2 }),
].join('');
const plate = w.box({ x: UX + 9, y: BELT.y, w: 3.2, d: 36, r: 0.6 }, PLATE.z0, PLATE.z1, { tone: 'mid' }, { steps: 2 });
const cover = w.box({ x: UX - 7, y: 12, w: 23, d: 42, r: 7 }, FRAME.beam, FRAME.beam + 24, { tone: 'hi' }, { steps: 4, bevel: 1.2 });
// the isolator in the grey cabinet: a switch with a handle on the door (shown from the sentence that cuts the energy off
// there), then the lock on the switch with a tag hanging from it (from the sentence that names the lockout), as in the field film
const isolator = hall.cabinet({ x: ISO.x, w: ISO.w, d: ISO.d, h: ISO.h })
  + w.box({ x: ISO.x + 5, y: ISO.d, w: 20, d: 2.2, r: 0.6 }, 62, 90, { tone: 'lo' }, { steps: 1 })
  + w.box({ x: ISO.x + 9, y: ISO.d + 2.2, w: 12, d: 3, r: 0.8 }, 72, 80, { tone: 'hi' }, { steps: 1 });
const lock = w.box({ x: ISO.x + 18, y: ISO.d + 2.2, w: 8, d: 5, r: 1.2 }, 56, 70, { tone: 'hi' }, { steps: 1 })
  + w.box({ x: ISO.x + 18.5, y: ISO.d + 2.2, w: 7, d: 1.4, r: 0.4 }, 30, 56, { tone: 'mid' }, { steps: 1 });

// painted back to front: the cabinet, the belt and the unit, you and the team lead (from the sentence that names you)
const world = [
  w.room(ROOM),
  g('o-iso', cueG('isolator', isolator)),
  g('o-lock', cueG('lock', lock)),
  cueG('line3', hall.conveyor({ ...BELT, cartons: 4 })),
  cueG('unit', frame + plate + cover),
  g('pp-teamlead', person('teamlead', 128, 132, 'x')),
  g('pp-jij', person('jij', 188, 132, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group here (data-cue), filled by the stage script each frame (data-k): the
// four topic tiles (the route, one square of the strip, a row of the grid), the level columns and the schemas of each beat. The
// shared map (the kit's mapScene) sits under the panel; its place Safety is a cue group of its own (map-safety).
const TILE = { risk: 'tRisk', energy: 'tEnergy', machine: 'tMachine', culture: 'tCulture' };
const PANEL = ['safeS', 'askS', 'shiftS', 'grpA', 'grpB', 'hazS', 'riskS', 'rieS', 'lmraS', 'stopS', 'isoS', 'lockS', 'zoneS', 'guardS', 'ilkS', 'nearS', 'learnS', 'invS', 'endS',
  'tool1', 'tool2', 'lv1', 'lv2', 'lv3', 'lv4', 'start'];
const tiles = ORDER.map((id, i) => cueG(TILE[id], g(`r${i}`, ''))).join('');
const hud = g('hud', '<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>' + g('pHead', '')
  + cueG('route', tiles) + PANEL.map((name) => cueG(name, g(`k_${name}`, ''))).join(''));
const { w: MAP_W, h: MAP_H } = engMap.view; // the Engineering map's sheet (viewBox of the wide drawing), from the map data
const MAP = (await mapScene({ subject: 'eng', highlight: ['eng.safety'] })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
const PLACE = engMap.places.find((p) => p.module === 'eng.safety');
const MAPZ = [PLACE.x + PLACE.w / 2, PLACE.y + PLACE.h / 2];
assert(MAP.includes(`data-cue="${mapCue('eng.safety')}"`), 'the map lights eng.safety as a cue group');
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
  { from: cam(150, 70, 70, 1.0), to: cam(150, 70, 70, 1.07) }, // s1 the whole hall: the unit on line 3, you and the team lead
  { from: cam(150, 40, 70, 1.15), to: cam(150, 40, 70, 1.25) }, // s2 the belt and the unit: the hazard and the risk
  { from: cam(120, 40, 70, 1.25), to: cam(120, 40, 70, 1.35) }, // s3 the grey cabinet with its switch and the unit
  { from: cam(150, 40, 70, 1.25), to: cam(150, 40, 70, 1.35) }, // s4 the unit: the danger zone
  { from: cam(150, 70, 70, 1.0), to: cam(150, 70, 70, 1.07) }, // s5 the whole hall again: you and the team lead at the end
  { from: cam(150, 70, 60, 1), to: cam(150, 70, 60, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
const TOOL = (a, key = 'tool1') => ({ cue: { [a]: key } });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.safety.intro',
  title: { nl: 'Veilig door de dienst', en: 'Safe through the shift' },
  module: 'eng.safety',
  // the narrowest box a topic title is drawn in: the closing grid's tile (GRID.tile, 12 units of padding)
  tileUnits: GRID.tile - 12,
  // the map: per topic of eng.safety, the scene that explains it and its tile
  topics: {
    risk: { scene: 's2', cue: 'tRisk' },
    energy: { scene: 's3', cue: 'tEnergy' },
    machine: { scene: 's4', cue: 'tMachine' },
    culture: { scene: 's5', cue: 'tCulture' },
  },
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Veilig door de dienst', en: 'Safe through the shift' },
      beats: [
        { nl: 'Lijn 3 draait, en niemand mag er gewond bij raken.', en: 'Line 3 is running, and nobody may get hurt.', focus: ['safeS', 'line3', 'unit'] },
        { nl: 'Deze module gaat over veilig werken, van risico’s en maatregelen tot een veiligheidscultuur die leert.', en: 'This module is about working safely, from risk and controls to a safety culture that learns.', focus: ['askS', 'line3'] },
        { nl: 'Jij bent de engineer. Met de teamleider houd je lijn 3 een hele dienst veilig.', en: 'You are the engineer. With the team lead you keep line 3 safe for a whole shift.', focus: ['shiftS', 'jij', 'teamlead'] },
        { nl: 'Eerst voor je begint, met risico’s en maatregelen en met scheiden, elektrisch werk en vergunningen.', en: 'First before you start, with risk and controls and with isolation, electrical work and permits.', focus: 'grpA' },
        { nl: 'Dan de machine zelf en wat je leert, met machineveiligheid en met incidenten en veiligheidscultuur.', en: 'Then the machine itself and what you learn, with machine safety and with incidents and safety culture.', focus: 'grpB' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Risico’s en maatregelen', en: 'Risk and controls' },
      beats: [
        { nl: 'Het eerste onderwerp is Risico’s en maatregelen. Een gevaar is alles wat schade kan doen.', en: 'The first topic is Risk and controls. A hazard is anything that can do harm.', focus: ['tRisk', 'hazS', 'line3', 'unit'] },
        { nl: 'Risico is hoe waarschijnlijk die schade is, met hoe erg ze zou zijn.', en: 'Risk is how likely that harm is, combined with how bad it would be.', focus: ['riskS', 'line3', 'unit'] },
        { nl: 'De risico’s van lijn 3 leg je vast in de {t:RI&E|RI&E}, met een plan van aanpak.', en: 'You record the risks of line 3 in the {t:RI&E|RI&E}, with a plan of action.', ...TOOL('RI&E'), focus: ['tool1', 'rieS'] },
        { nl: 'Vlak voor de start check je met een {t:LMRA|LMRA} wat er veranderd is.', en: 'Just before the start you check with an {t:LMRA|LMRA} what has changed.', ...TOOL('LMRA', 'tool2'), focus: ['tool2', 'lmraS', 'unit'] },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Scheiden, elektrisch werk en vergunningen', en: 'Isolation, electrical work and permits' },
      beats: [
        { nl: 'Het tweede onderwerp is Scheiden, elektrisch werk en vergunningen. Stoppen is iets anders dan scheiden.', en: 'The second topic is Isolation, electrical work and permits. Stopping is not the same as isolating.', focus: ['tEnergy', 'stopS', 'unit'] },
        { nl: 'Loopt de eenheid vast, dan scheid je de energie bij de schakelaar in de grijze kast.', en: 'When the unit jams, you isolate the energy at the switch in the grey cabinet.', focus: ['isoS', 'isolator', 'unit'] },
        { nl: 'Je zet de schakelaar vast met {t:Vergrendelen en labelen|vergrendelen en labelen}, met je eigen slot en een label met je naam.', en: 'You secure the switch with {t:LOTO|LOTO}, with your own lock and a tag with your name.', ...TOOL('Vergrendelen en labelen'), focus: ['tool1', 'lockS', 'lock', 'isolator'] },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Machineveiligheid', en: 'Machine safety' },
      beats: [
        { nl: 'Het derde onderwerp is Machineveiligheid. De meeste ongevallen met machines gebeuren in de gevarenzone.', en: 'The third topic is Machine safety. Most accidents with machines happen in the danger zone.', focus: ['tMachine', 'zoneS', 'unit'] },
        { nl: 'Een afscherming houdt mensen daaruit, of stopt de beweging voordat ze er zijn.', en: 'A guard keeps people out of it, or stops the motion before they get there.', focus: ['guardS', 'unit'] },
        { nl: 'Moet je er regelmatig in, dan gebruik je een {t:Beveiligde afscherming|beveiligde afscherming}.', en: 'If you must reach in regularly, you use an {t:Interlocked guard|interlocked guard}.', ...TOOL('Beveiligde afscherming'), focus: ['tool1', 'ilkS', 'unit'] },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Incidenten en veiligheidscultuur', en: 'Incidents and safety culture' },
      beats: [
        { nl: 'Het vierde onderwerp is Incidenten en veiligheidscultuur. Ook een bijna-ongeval leert je iets.', en: 'The fourth topic is Incidents and safety culture. A near miss teaches you something too.', focus: ['tCulture', 'nearS', 'line3', 'unit'] },
        { nl: 'Je meldt het zonder schuldvraag, en dan levert het gratis lessen op.', en: 'You report it without blame, and then it gives you free lessons.', focus: ['learnS', 'line3'] },
        { nl: 'Na een incident doe je een {t:Incidentonderzoek|incidentonderzoek}, dat niet naar schuld zoekt.', en: 'After an incident you do an {t:Incident investigation|incident investigation}, which does not look for blame.', ...TOOL('Incidentonderzoek'), focus: ['tool1', 'invS'] },
        { nl: 'Zo houden jij en de teamleider lijn 3 de hele dienst veilig.', en: 'That is how you and the team lead keep line 3 safe, all shift.', focus: ['endS', 'jij', 'teamlead'] },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart. Het vierde station is Veilig werken, in De fabriek draaiend houden.', en: 'The whole map. The fourth station is Safety on the floor, in Keeping the plant running.', focus: 'map-safety' },
        { nl: 'Elk van de vier onderwerpen heeft vier niveaus.', en: 'Each of the four topics has four levels.', focus: 'route' },
        { nl: 'Begin op niveau Basis met gevaar en risico. De volgorde van maatregelen komt in latere lessen terug.', en: 'Start at Basics level with hazard and risk. The order of controls comes back in later lessons.', focus: ['tRisk', 'start'] },
        { nl: 'Op niveau Werkkennis komen werk stilleggen, elektrische rollen, machines beoordelen en menselijke fout.', en: 'At Working knowledge level come stopping work, electrical roles, machine risk and human error.', focus: 'lv2' },
        { nl: 'Op niveau Gevorderd komen het gatenkaasmodel, de werkvergunning, veiligheidsfuncties en indicatoren.', en: 'At Advanced level come the Swiss cheese model, the permit to work, safety functions and safety indicators.', focus: 'lv3' },
        { nl: 'Op niveau Expert komen wijzigingsbeheer, vlambogen, oude machines en de cultuurladder.', en: 'At Expert level come management of change, arc flash, old machines and the culture ladder.', focus: 'lv4' },
        { nl: 'Elke les en elke film van deze module heeft een plek op deze kaart.', en: 'Every lesson and every film in this module has a place on this map.', focus: null },
      ],
    },
  ],
  skip: [],
  strictFocus: true,
};

// ---------------------------------------------------------------- the narration
// What the voice says is what the captions show (as in the other module intros): short sentences, few commas, no colons
// and no symbols the voice would read aloud. Each topic scene ends on one short sentence naming the tool of that topic's
// lessons, without explaining it. Every drawn detail has its reason in the narration: the unit and the belt (line 3), the
// grey cabinet (the switch where the energy is cut off when the unit jams), its lock and tag (the lockout), you and the team
// lead (the ones who keep line 3 safe for the shift).
spec.scenes.forEach((s) => s.beats.forEach((b) => { b.say = { nl: b.nl, en: b.en }; }));
// the voice says the RI&E as letters, "R I E" (the ampersand is not read aloud and the guard refuses it)
{
  const b = spec.scenes[1].beats[2];
  b.say = { nl: b.nl.replace('{t:RI&E|RI&E}', 'R I E'), en: b.en.replace('{t:RI&E|RI&E}', 'R I E') };
}
// Each scene's length from its share of the Dutch narration, never shorter than its captions need.
{
  const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
  const said = spec.scenes.map((sc) => sc.beats.reduce((a, b) => a + wordsOf(plainSay(b.nl)), 0));
  const all = said.reduce((a, b) => a + b, 0);
  const TOTAL = Math.min(298, Math.ceil(all / 2.5) + 2 * spec.scenes.length);
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

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\nconst LV = ${JSON.stringify(LV)};\nconst MAPZ = ${JSON.stringify(MAPZ)};\nconst MAPSZ = [${MAP_W}, ${MAP_H}];\nconst GRID = ${JSON.stringify(GRID)};\nconst KEYS = ${JSON.stringify(PANEL)};\nconst CW = ${JSON.stringify(CHAR_W)};\nconst wrapUnits = ${wrapUnits.toString()};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="jij"],[data-cue="teamlead"])';
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
.pm-arm{fill:none;stroke:var(--anatomy-mid);stroke-width:9;stroke-linecap:round;stroke-linejoin:round}
.pm-joint{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:2}
[data-cue][data-on] .pm-arm{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-joint{stroke:var(--fp-accent)}

/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.plan.schedule) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');



const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 draait. Aan de achterwand de band van lijn 3 met dozen; boven het begin van de band staat de eenheid, ongeveer zo hoog als een mens: een stalen frame met een plaat boven de dozen en bovenop een lichte kunststof kap. Verderop aan de achterwand een grijze kast met een schakelaar, later met een slot en een label eraan. Voor in de hal staan jij, de engineer, en de teamleider. Rechts een paneel, gemarkeerd als voorbeeld of schema: lijn 3 met mensen die niet gewond raken, van risico’s naar een cultuur die leert, een dienst van lijn 3, de route in twee groepen, een gevaar dat schade kan doen, een risico uit kans en ernst, een RI&E met een plan van aanpak, een korte check vlak voor de start, stoppen naast scheiden, een schakelaar tussen energie en eenheid, een schakelaar met een slot en een label, een gevarenzone met een mens erin, dezelfde zone met een afscherming ervoor, een deur met een veiligheidsschakelaar die de beweging stopt, een doos die valt waar niemand staat, een melding die een gratis les geeft, de vragen van een incidentonderzoek en een veilige dienst voor lijn 3. Aan het eind de hele kaart van Engineering met Veilig werken verlicht, en de vier onderwerpen van de module met elk vier niveaus: Basis, Werkkennis, Gevorderd en Expert.',
  en: 'Hall B of the plant, where line 3 runs. Along the back wall the belt of line 3 with cartons; over the start of the belt stands the unit, about as tall as a person: a steel frame with a plate above the cartons and a light plastic cover on top. Further along the back wall a grey cabinet with a switch, later with a lock and a tag on it. At the front of the hall stand you, the engineer, and the team lead. At the right a panel, marked as an example or a diagram: line 3 with people who are not hurt, from risk to a culture that learns, a shift of line 3, the route in two groups, a hazard that can do harm, a risk made of likelihood and severity, an RI&E with a plan of action, a short check just before the start, stopping next to isolating, a switch between the energy and the unit, a switch with a lock and a tag, a danger zone with a person in it, the same zone with a guard in front of it, a door with a safety switch that stops the motion, a carton that falls where nobody stands, a report that gives a free lesson, the questions of an incident investigation and a safe shift for line 3. At the end the whole map of Engineering with Safety on the floor lit, and the module’s four topics with four levels each: Basics, Working knowledge, Advanced and Expert.',
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


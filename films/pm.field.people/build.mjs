// Dev tool, not shipped. Builds the field film "Mensen en invloed / People and
// influence" (pm.field.people), the second field film (v17): the level above the
// module intros. It places the five modules of the people field (FIELDS in
// src/content/courses/index.js: stuck, lead, negotiate, outside, perform) on one
// road and says, per station, what it is for, which two tools of the module you
// use there (named, not explained: the checkpoint rule of 14 Nov) and what goes
// wrong without it. The map, not a lesson: no calculations, no numbers.
//
//   node films/pm.field.people/build.mjs            build the page
//   node films/pm.field.people/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.field.people.html: one offline page with
// the anatomy kit, the stage script and the player inlined. The index names it
// (the field's `film`), sw.js precaches it; the app shows field films from Task 7.
//
// The story continues the pilot's world and field film 1: line 3 moves to hall B,
// the same hall and the same cast. The materials are right and the plan is right,
// and the project is still stuck: that is the people side.
//   s1 the opening: line 3 to hall B with two green lamps and a red one (people),
//      the five people of the hall, the five stations on the road
//   s2 Als je vastzit (pm.stuck): line 3 stands still and nobody knows why; the
//      four kinds of stuck, as the Basis lesson names them (an unclear goal and a
//      people problem); without it, harder pushing at the wrong problem
//   s3 Mensen leiden (pm.lead): the buyer and the team lead do not report to you;
//      expert power and SBI; without it, borrowed power that wears out
//   s4 Onderhandelen en voet bij stuk houden (pm.negotiate): the installer cannot
//      make the date before the shutdown; a BATNA and the interests behind the
//      positions; without it, weak at the table
//   s5 Projecten leiden buiten je vakgebied (pm.outside): one expert finds the
//      power cabinet big enough, the other does not; a question set and a second
//      opinion; without it, the loudest voice wins
//   s6 Sturen op prestaties (pm.perform): line 3 runs; a KPI tree and a performance
//      board; without it, a wall of numbers nobody reads
//   s7 the shared Projects map (the kit's mapScene, as the app draws it) with the
//      five stations lit, the zoom place by place at 1.5, and back out
// The tools come from the modules' own lessons (checked below): pm.stuck.diagnose,
// pm.lead.power and pm.lead.feedback, pm.negotiate.batna and .interests,
// pm.outside.phasequestions and .disagree, pm.perform.tree and .board. Terms come
// from the field's lessons (the kit's field mode, films/_kit/build-film.mjs); the
// kit holds the film to its road (every module named in a caption of its own scene,
// in the order of the road, explained in two beats and lit, ending on the map with
// the field's places lit), to the narration guard and to the label fit.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only): the
// sponsor and the team lead from its cast, the buyer, the installer (with a hard
// hat) and two operators with pm.agile.scrum's cast (films/pm.agile.scrum/cast.mjs),
// and the things of hall B from the pilot (films/pm.plan.intro/hall.mjs), imported.
// A panel at the right draws each station as a schema, two chips with the tools and
// a dashed card with what goes wrong without it.
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
import { scrumPerson } from '../pm.agile.scrum/cast.mjs';
import { hallWorld, HALL_CSS } from '../pm.plan.intro/hall.mjs';
import { FIELDS, MODULES } from '../../src/content/courses/index.js';
import pmMap from '../../src/content/courses/maps/pm.js';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));


// ---------------------------------------------------------------- the field
// The road this film draws, asserted against the index (the build fails if the
// field's modules move), and the lessons' words the narration leans on: the Basis
// lessons for what each station is for and what goes wrong without it, and the
// lessons the tool names come from (the names are terms of those lessons).
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const FIELD = FIELDS.find((f) => f.id === 'pm.field.people');
const ROAD = ['pm.stuck', 'pm.lead', 'pm.negotiate', 'pm.outside', 'pm.perform'];
assert(JSON.stringify(FIELD.modules) === JSON.stringify(ROAD), 'the people field is the road stuck, lead, negotiate, outside, perform');
// the panel heading draws the module's title in at most two lines of the panel's width (the kit does not measure it)
for (const id of ROAD) for (const lang of ['nl', 'en']) {
  const t = MODULES.find((m) => m.id === id).title[lang];
  const lines = wrapUnits(t, 284, CHAR_W);
  assert(lines.length <= 2 && lines.every((ln) => ln.split(' ').every((wd) => wrapUnits(wd, 284, CHAR_W).length === 1)), `the heading "${t}" (${lang}) does not fit two lines of 284 units`);
}
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s2 stuck: four kinds of stuck (an unclear goal, a people problem), pushing harder at the wrong one
has('pm.stuck.diagnose', ['vier soorten vastzitten', 'Onduidelijk doel: mensen zijn het oneens over wat succes is', 'Mensenprobleem: iemand wiens ja je nodig hebt', 'De klassieke fout is een doelprobleem behandelen als een mensenprobleem en harder duwen']);
has('pm.stuck.diagnose', ['four kinds of stuck', 'Unclear goal: people disagree on what success is', 'People problem: someone whose yes you need', 'treating a goal problem as a people problem and pushing harder'], 'en');
// s3 lead: little position power, so influence from expertise (expert power) and feedback (SBI); borrowed power wears out
has('pm.lead.power', ['bijna geen positiemacht', 'Deskundigheidsmacht is zichtbare kunde', 'die slijt elke keer dat je hem gebruikt']);
has('pm.lead.power', ['almost no position power', 'Expert power', 'borrowing power too often'], 'en');
has('pm.lead.feedback', ['SBI is een opbouw voor feedback']);
has('pm.lead.feedback', ['SBI is a feedback structure'], 'en');
// s4 negotiate: interests behind positions, the BATNA decides how strong you stand
has('pm.negotiate.interests', ['wie over standpunten onderhandelt, graaft zich in; wie naar belangen kijkt', 'Belang Waarom iemand het wil']);
has('pm.negotiate.interests', ['Interest Why someone wants it'], 'en');
has('pm.negotiate.batna', ['Je BATNA, niet je wensen, bepaalt hoe sterk je staat']);
has('pm.negotiate.batna', ['BATNA, not your wishes'], 'en');
// s5 outside: the content is too deep to judge, so a question set; with two experts a second opinion; no deciding by volume
has('pm.outside.phasequestions', ['Een vragenset is een korte, vaste lijst vragen']);
has('pm.outside.phasequestions', ['question set is a short, fixed list'], 'en');
has('pm.outside.disagree', ['kun je de inhoud niet beoordelen, maar wel het besluit structureren', 'beslissen op senioriteit, op wie het hardst praat', 'Second opinion Een onafhankelijke kijk']);
has('pm.outside.disagree', ['can’t judge the content, but you can structure the decision', 'deciding by seniority, by who talks loudest', 'Second opinion An independent'], 'en');
// s6 perform: a few numbers, a KPI tree down to a team's numbers, a performance board; a wall of numbers nobody reads
has('pm.perform.kpis', ['een muur van veertig leest niemand']);
has('pm.perform.kpis', ['a wall of forty gets read by nobody'], 'en');
has('pm.perform.tree', ['Een KPI-boom, ook wel driverboom']);
has('pm.perform.tree', ['A KPI tree, also called a driver tree'], 'en');
has('pm.perform.board', ['het prestatiebord bij de eigen werkplek van het team']);
has('pm.perform.board', ['performance board at the team’s own area'], 'en');

// ---------------------------------------------------------------- the world (hall B, as the pilot)
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

// where things stand (cm), as in the pilot: line 3's marked floor at the back wall at the right under the
// switchboard, line 4 (which stays) next to it, the power cabinet at the back wall at the left
const SLAB = { x: 176, y: 4, w: 110, d: 60 };
const L3 = { x: 186, y: 16, len: 84, dep: 34 };
const L4 = { x: 64, y: 16, len: 90, dep: 34 };
const CAB = { x: 12, w: 40, d: 26, h: 124 };
const SWB = { x: 218, w: 50, z0: 96, z1: 172 };
const CAL = w.calendar({ y0: 10, z0: 96, weeks: 15, cw: 10, ch: 40 });
const STOP_WEEKS = [12, 13, 14].map((i) => CAL.cell(i).map((v) => Math.round(v * 10) / 10));
const calStop = `<g transform="${CAL.face}">${STOP_WEEKS.map(([a, b, c, d]) => `<path class="pm-cal" d="${w.rectD(a, b, c, d)}"/>`).join('')}</g>`;
const CABLE = [[[0, 100], [32, 100], [32, 28]], [[32, 66], [190, 66], [190, 52]]];
const cablePath = (dashed) => CABLE.map((pts) => hall.cable(pts, { dashed })).join('');

// the people: the sponsor and the team lead of the line are the pm cast; the installer, the buyer and the two
// operators are pm.agile.scrum's figures. Each stands in a cue group; the stage script shows each when the story needs it.
const person = (role, x, y, along) => w.person({ x, y, role, along });
const installer = scrumPerson(w, k, G, P, { x: 44, y: 62, key: 'installer', look: 'sm', along: 'y' });

const world = [
  w.room(ROOM),
  cueG('calendar', CAL.svg + calStop),
  cueG('floor', hall.floorMark(SLAB)),
  cueG('power', hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h }) + g('cabOff', cablePath(true)) + g('cabOn', cablePath(false))),
  cueG('switch', g('swG', hall.switchboardGhost(SWB)) + g('swS', hall.switchboard(SWB))),
  cueG('line3', g('line3S', hall.conveyor({ ...L3, cartons: 4 }))),
  g('pp-installer', installer + hall.hat(44, 62)),
  g('pp-buyer', scrumPerson(w, k, G, P, { x: 224, y: 96, key: 'buyer', look: 'po', along: 'x' })),
  g('pp-crew', scrumPerson(w, k, G, P, { x: 176, y: 66, key: 'crew', look: 'dev', along: 'x' }) + scrumPerson(w, k, G, P, { x: 278, y: 60, key: 'crew', look: 'dev2', along: 'x' })),
  cueG('line4', hall.conveyor({ ...L4, cartons: 3 })),
  g('pp-lead', person('teamlead', 150, 118, 'x')),
  g('pp-sponsor', person('sponsor', 36, 140, 'y')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group (data-cue), filled by the stage script each frame
// (data-k). The road holds the five stations, one cue group each (st-<slug>): in s1 a row with its number and
// title, in s2 to s6 a numbered square of the strip under the heading. The shared Projects map (mapScene,
// the five stations lit) sits under the panel; its places are cue groups of their own (map-<slug>).
const STATION_CUE = Object.fromEntries(ROAD.map((id) => [id, `st-${id.split('.')[1]}`]));
const stations = ROAD.map((id, i) => cueG(STATION_CUE[id], g(`rd${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('road', g('roadB', '') + stations)
  + cueG('goal', g('goalB', '')) + cueG('people5', g('peopleB', '')) + cueG('for', g('forB', ''))
  + cueG('t1', g('t1B', '')) + cueG('t2', g('t2B', ''))
  + cueG('without', g('withoutB', '')));
const MAP = (await mapScene({ subject: 'pm', highlight: ROAD })).replace('<svg class="subject-map"', '<svg class="subject-map" width="640" height="520"');
for (const id of ROAD) assert(MAP.includes(`data-cue="${mapCue(id)}"`), `the map lights ${id} as a cue group`);
// the centre of each station's place on the map, for the zoom of the closing scene
const MAPZ = ROAD.map((id) => { const p = pmMap.places.find((x) => x.module === id); return [p.x + p.w / 2, p.y + p.h / 2]; });
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
  { from: cam(145, 85, 70, 1), to: cam(150, 85, 70, 1.04) }, // s1 the whole hall, line 3's floor and the five people
  { from: cam(160, 100, 70, 1.12), to: cam(165, 100, 70, 1.18) }, // s2 the team lead at the empty floor
  { from: cam(190, 105, 70, 1.1), to: cam(195, 105, 70, 1.15) }, // s3 the buyer and the team lead
  { from: cam(70, 60, 60, 1.2), to: cam(110, 65, 60, 1.15) }, // s4 the installer, the cabinet and the calendar
  { from: cam(110, 65, 70, 1.1), to: cam(140, 75, 70, 1.05) }, // s5 the two experts and the cabinet
  { from: cam(200, 85, 60, 1.2), to: cam(195, 90, 60, 1.24) }, // s6 line 3, the operators and the team lead
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s7 (the map)
];

// ---------------------------------------------------------------- the film
const MAPS = ROAD.map(mapCue);
const TOOLCUE = (a, b) => ({ cue: { [a]: 't1', [b]: 't2' }, focus: ['t1', 't2'] });
const DURS = Array(7).fill(30);
const spec = {
  id: 'pm.field.people',
  title: { nl: 'Mensen en invloed', en: 'People and influence' },
  field: 'pm.field.people',
  // the road: per module of the field, the scene that explains it and its station on the road
  stations: Object.fromEntries(ROAD.map((id, i) => [id, { scene: `s${i + 2}`, cue: STATION_CUE[id] }])),
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'De mensenkant', en: 'The people side' },
      beats: [
        { nl: 'Lijn 3 verhuist naar hal B. Materiaal en plan kloppen, maar het project loopt vast.', en: 'Line 3 moves to hall B. Materials and plan are right, but the project gets stuck.', focus: ['goal', 'floor'] },
        { nl: 'Dan gaat het om mensen. Daar zijn vijf stations voor.', en: 'Then it is about people. There are five stations for that.', focus: ['people5', 'sponsor', 'buyer', 'installer', 'crew', 'teamlead'] },
        { nl: 'Per station: waar het voor dient, wat je gebruikt, en wat er misgaat zonder.', en: 'At each station: what it is for, what you use, and what goes wrong without it.', focus: 'road' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Als je vastzit', en: 'When you’re stuck' },
      beats: [
        { nl: 'Het eerste station is Als je vastzit: lijn 3 staat stil en niemand weet waarom.', en: 'The first station is When you’re stuck: line 3 stands still and nobody knows why.', focus: ['st-stuck', 'for', 'teamlead'] },
        { nl: 'Vier soorten vastzitten, zoals een {t:Onduidelijk doel|onduidelijk doel} en een {t:Mensenprobleem|mensenprobleem}.', en: 'Four kinds of stuck, such as an {t:Unclear goal|unclear goal} and a {t:People problem|people problem}.', ...TOOLCUE('Onduidelijk doel', 'Mensenprobleem') },
        { nl: 'Zonder diagnose duw je harder op het verkeerde probleem.', en: 'Without a diagnosis you push harder at the wrong problem.', focus: 'without' },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Mensen leiden', en: 'Leading people' },
      beats: [
        { nl: 'Het tweede station is Mensen leiden: invloed zonder macht, op wie niet aan jou rapporteert.', en: 'The second station is Leading people: influence without authority, over people who do not report to you.', focus: ['st-lead', 'for', 'buyer', 'teamlead'] },
        { nl: 'Je gebruikt vaak {t:Deskundigheidsmacht|deskundigheidsmacht} en {t:SBI|SBI}.', en: 'You often use {t:Expert power|expert power} and {t:SBI|SBI}.', ...TOOLCUE('Deskundigheidsmacht', 'SBI') },
        { nl: 'Zonder dit leen je steeds macht van de sponsor, en die slijt.', en: 'Without this you keep borrowing power from the sponsor, and it wears out.', focus: 'without' },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Onderhandelen en voet bij stuk houden', en: 'Negotiating and holding your ground' },
      beats: [
        { nl: 'Het derde station is Onderhandelen en voet bij stuk houden: de installateur haalt de datum niet.', en: 'The third station is Negotiating and holding your ground: the installer cannot make the date.', focus: ['st-negotiate', 'for', 'installer', 'calendar'] },
        { nl: 'Je bereidt voor met een {t:BATNA|BATNA} en de {t:Belang|belangen} achter de standpunten.', en: 'You prepare with a {t:BATNA|BATNA} and the {t:Interest|interests} behind the positions.', ...TOOLCUE('BATNA', 'Belang') },
        { nl: 'Zonder voorbereiding sta je zwak, en graaf je je in op standpunten.', en: 'Without preparation you stand weak, and you dig in on positions.', focus: 'without' },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Projecten leiden buiten je vakgebied', en: 'Leading projects outside your field' },
      beats: [
        { nl: 'Het vierde station is Projecten leiden buiten je vakgebied: twee experts, twee meningen.', en: 'The fourth station is Leading projects outside your field: two experts, two opinions.', focus: ['st-outside', 'for', 'installer', 'crew', 'power'] },
        { nl: 'Je gebruikt een {t:Vragenset|vragenset} en een {t:Second opinion|second opinion}.', en: 'You use a {t:Question set|question set} and a {t:Second opinion|second opinion}.', ...TOOLCUE('Vragenset', 'Second opinion') },
        { nl: 'Zonder dit wint de hardste stem.', en: 'Without this the loudest voice wins.', focus: 'without' },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'Sturen op prestaties', en: 'Performance management' },
      beats: [
        { nl: 'Het laatste station is Sturen op prestaties: lijn 3 draait, en je stuurt op een paar cijfers.', en: 'The last station is Performance management: line 3 runs, and you steer on a few numbers.', focus: ['st-perform', 'for', 'line3', 'crew', 'teamlead'] },
        { nl: 'Je gebruikt een {t:KPI-boom|KPI-boom} en een {t:Prestatiebord|prestatiebord}.', en: 'You use a {t:KPI tree|KPI tree} and a {t:Performance board|performance board}.', ...TOOLCUE('KPI-boom', 'Prestatiebord') },
        { nl: 'Zonder dit krijg je een muur vol cijfers die niemand leest.', en: 'Without this you get a wall of numbers nobody reads.', focus: 'without' },
      ],
    },
    {
      id: 's7', level: 1, dur: DURS[6], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De kaart van Projecten: de vijf stations van de mensenkant liggen op een rij.', en: 'The map of Projects: the five stations of the people side lie in a row.', focus: MAPS },
        { nl: 'Eerst Als je vastzit: de diagnose.', en: 'First When you’re stuck: the diagnosis.', focus: MAPS[0] },
        { nl: 'Dan Mensen leiden: invloed en feedback.', en: 'Then Leading people: influence and feedback.', focus: MAPS[1] },
        { nl: 'Dan Onderhandelen en voet bij stuk houden: aan tafel.', en: 'Then Negotiating and holding your ground: at the table.', focus: MAPS[2] },
        { nl: 'Dan Projecten leiden buiten je vakgebied: werken met experts.', en: 'Then Leading projects outside your field: working with experts.', focus: MAPS[3] },
        { nl: 'Tot slot Sturen op prestaties: de cijfers die sturen.', en: 'Finally Performance management: the numbers that steer.', focus: MAPS[4] },
        { nl: 'Elk station is een module met vier onderwerpen. Begin waar het nu knelt.', en: 'Each station is a module with four topics. Start where it hurts.', focus: MAPS },
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
// 0.4 s). Words checked with espeak-ng phonemes through Piper's own bridge (nl_NL-alex): this film's SAY group
// (the last of the Dutch list in films/_kit/timeline.mjs) says SBI as letters and the second opinion in the
// English way, in these phrases only; BATNA, KPI-boom, mensenprobleem and the other names need nothing.
const SAY = [
  [ // s1 the opening
    { nl: 'Lijn 3 verhuist naar hal B. De materialen kloppen en het plan ook, maar toch loopt het project vast.',
      en: 'Line 3 is moving to hall B. The materials are right and so is the plan, but the project still gets stuck.' },
    { nl: 'Dan gaat het om mensen. Daar zijn vijf stations voor.',
      en: 'Then it is about people. There are five stations for that.' },
    { nl: 'Bij elk station zie je waar het voor dient, wat je gebruikt, en wat er misgaat zonder.',
      en: 'At each station you see what it is for, what you use, and what goes wrong without it.' },
  ],
  [ // s2 stuck
    { nl: 'Het eerste station is voor als je vastzit. Lijn 3 staat stil, en niemand weet waarom.',
      en: 'The first station is for when you are stuck. Line 3 stands still, and nobody knows why.' },
    { nl: 'Je begint met vier soorten vastzitten, zoals een {t:Onduidelijk doel|onduidelijk doel} en een {t:Mensenprobleem|mensenprobleem}.',
      en: 'You start from four kinds of stuck, such as an {t:Unclear goal|unclear goal} and a {t:People problem|people problem}.' },
    { nl: 'Zonder diagnose duw je harder op het verkeerde probleem.',
      en: 'Without a diagnosis you push harder at the wrong problem.' },
  ],
  [ // s3 lead
    { nl: 'Het tweede station is Mensen leiden. De inkoper en de teamleider rapporteren niet aan jou, maar je hebt hun hulp nodig.',
      en: 'The second station is Leading people. The buyer and the team lead do not report to you, but you need their help.' },
    { nl: 'Daarbij gebruik je vaak {t:Deskundigheidsmacht|deskundigheidsmacht} en {t:SBI|SBI}.',
      en: 'You often use {t:Expert power|expert power} and {t:SBI|SBI}.' },
    { nl: 'Zonder dit leen je steeds macht van de sponsor, en die slijt.',
      en: 'Without this you keep borrowing power from the sponsor, and it wears out.' },
  ],
  [ // s4 negotiate
    { nl: 'Het derde station is Onderhandelen en voet bij stuk houden. De installateur haalt de datum voor de stop niet, en jij hebt de stroom dan nodig.',
      en: 'The third station is Negotiating and holding your ground. The installer cannot make the date before the shutdown, and you need the power by then.' },
    { nl: 'Je bereidt voor met een {t:BATNA|BATNA} en de {t:Belang|belangen} achter de standpunten.',
      en: 'You prepare with a {t:BATNA|BATNA} and the {t:Interest|interests} behind the positions.' },
    { nl: 'Zonder voorbereiding sta je zwak, en graaf je je in op standpunten.',
      en: 'Without preparation you stand weak, and you dig in on positions.' },
  ],
  [ // s5 outside
    { nl: 'Het vierde station is Projecten leiden buiten je vakgebied. De ene expert vindt de stroomkast groot genoeg, de andere niet. Jij kunt de inhoud niet beoordelen, maar wel het besluit.',
      en: 'The fourth station is Leading projects outside your field. One expert thinks the power cabinet is big enough, the other does not. You cannot judge the content, but you can structure the decision.' },
    { nl: 'Je gebruikt een {t:Vragenset|vragenset} en een {t:Second opinion|second opinion}.',
      en: 'You use a {t:Question set|question set} and a {t:Second opinion|second opinion}.' },
    { nl: 'Zonder dit wint de hardste stem.',
      en: 'Without this the loudest voice wins.' },
  ],
  [ // s6 perform
    { nl: 'Het laatste station is Sturen op prestaties. Lijn 3 draait, en je stuurt op een paar cijfers in plaats van op gevoel.',
      en: 'The last station is Performance management. Line 3 is running, and you steer on a few numbers instead of on gut feeling.' },
    { nl: 'Je gebruikt een {t:KPI-boom|KPI-boom} en een {t:Prestatiebord|prestatiebord}.',
      en: 'You use a {t:KPI tree|KPI tree} and a {t:Performance board|performance board}.' },
    { nl: 'Zonder dit krijg je een muur vol cijfers die niemand leest.',
      en: 'Without this you get a wall of numbers nobody reads.' },
  ],
  [ // s7 the map
    { nl: 'Dit is de kaart van Projecten. De vijf stations van de mensenkant liggen op een rij.',
      en: 'This is the map of Projects. The five stations of the people side lie in a row.' },
    { nl: 'Eerst Als je vastzit, voor de diagnose.',
      en: 'First When you are stuck, for the diagnosis.' },
    { nl: 'Dan Mensen leiden, voor invloed en feedback.',
      en: 'Then Leading people, for influence and feedback.' },
    { nl: 'Dan Onderhandelen en voet bij stuk houden, voor aan tafel.',
      en: 'Then Negotiating and holding your ground, for the table.' },
    { nl: 'Dan Projecten leiden buiten je vakgebied, voor het werken met experts.',
      en: 'Then Leading projects outside your field, for working with experts.' },
    { nl: 'Tot slot Sturen op prestaties, voor de cijfers die sturen.',
      en: 'Finally Performance management, for the numbers that steer.' },
    { nl: 'Elk station is een module met vier onderwerpen. Begin waar het nu knelt.',
      en: 'Each station is a module with four topics. Start where it hurts.' },
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
const preamble = `const CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\nconst MAPZ = ${JSON.stringify(MAPZ)};\nconst ROW = ${STATION_UNITS};\nconst HEAD = 284;\nconst CW = ${JSON.stringify(CHAR_W)};\nconst wrapUnits = ${wrapUnits.toString()};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="sponsor"],[data-cue="installer"],[data-cue="buyer"],[data-cue="crew"],[data-cue="teamlead"])';
const css = PM_CSS + HALL_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-tile{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:1.2}
.pm-badge{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-out{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:5 4}
.pm-bar{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-crit{fill:color-mix(in srgb,var(--fp-accent) 24%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-range{fill:color-mix(in srgb,var(--fp-accent) 16%,var(--anatomy-face));stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-buf{fill:var(--anatomy-shade-1);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:4 3}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-link{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round;stroke-linecap:round}
.pm-road{fill:none;stroke:var(--anatomy-lo);stroke-width:3;stroke-dasharray:6 6;stroke-linecap:round}
.pm-dot{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.6}
.pm-cross{fill:none;stroke:var(--anatomy-muted);stroke-width:2.4;stroke-linecap:round}
.pm-cal{fill:color-mix(in srgb,var(--fp-accent) 45%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:.6}
.pm-rag{fill:var(--anatomy-shade-1);stroke:var(--anatomy-lo);stroke-width:1.2}
.pm-rag-g{fill:#5E9A6B;stroke:#4A7F56;stroke-width:1.2}
.pm-rag-a{fill:#D49A35;stroke:#B07B22;stroke-width:1.2}
.pm-rag-r{fill:#C2553F;stroke:#9E4030;stroke-width:1.2}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link,[data-cue][data-on] .pm-road{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-bar,.pm-range,.pm-buf,.pm-out,.pm-dot){stroke:var(--fp-accent)}
[data-cue][data-on] .pm-cross{stroke:var(--fp-accent)}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
[data-cue][data-on] .pm-cal{fill:var(--fp-focus)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as the pilot) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
` + mapStyles();

const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 naartoe moet, zoals in de intro van Plannen. Op de vloer de nieuwe plek van lijn 3 met een gestippelde omtrek; ernaast staat lijn 4, die blijft. Links de stroomkast met de kabel van buiten, aan de achterwand de plek van de schakelkast, en aan de zijwand een kalender waarvan de laatste drie weken de zomerstop zijn. Eerst komen alle vijf de mensen van het verhaal in beeld: de sponsor, de installateur van buiten met een helm, de inkoper, twee operators en de teamleider van de lijn; daarna per station de mensen die erbij horen. Later staat lijn 3 op zijn plek en hangt de schakelkast aan de wand. Rechts een paneel, gemarkeerd als voorbeeld of schema. Eerst lijn 3 met drie lampen, materiaal en plan groen en mensen rood, de vijf mensen en de weg met vijf stations. Dan per station een schema, twee namen van hulpmiddelen en, gestippeld, wat er misgaat zonder: bij Als je vastzit een weg met een slagboom voor het doel, met Onduidelijk doel en Mensenprobleem; bij Mensen leiden jij en drie mensen die niet aan jou rapporteren, met Deskundigheidsmacht en SBI; bij Onderhandelen en voet bij stuk houden de installateur die later komt en jij die de stroom eerst nodig hebt, met BATNA en Belangen; bij Projecten leiden buiten je vakgebied twee experts met twee meningen en jij die de criteria kiest, met Vragenset en Second opinion; bij Sturen op prestaties een kleine KPI-boom met uren, tempo en goed, met KPI-boom en Prestatiebord. Aan het eind de kaart van Projecten met de vijf stations verlicht, eerst helemaal en dan plek voor plek van dichtbij.',
  en: 'Hall B of the plant, where line 3 has to go, as in the intro of Plan. On the floor the new place of line 3 with a dashed outline; next to it stands line 4, which stays. At the left the power cabinet with the cable from outside, on the back wall the place of the switchboard, and on the side wall a calendar whose last three weeks are the summer shutdown. First all five people of the story come into view: the sponsor, the outside installer in a hard hat, the buyer, two operators and the team lead of the line; then, per station, the people who belong to it. Later line 3 stands in place and the switchboard hangs on the wall. At the right a panel, marked as an example or a diagram. First line 3 with three lamps, materials and plan green and people red, the five people and the road with five stations. Then per station a schema, two names of tools and, dashed, what goes wrong without it: at When you are stuck a road with a barrier before the goal, with Unclear goal and People problem; at Leading people you and three people who do not report to you, with Expert power and SBI; at Negotiating and holding your ground the installer who comes later and you who need the power first, with BATNA and Interests; at Leading projects outside your field two experts with two opinions and you who set the criteria, with Question set and Second opinion; at Performance management a small KPI tree with hours, speed and good, with KPI tree and Performance board. At the end the map of Projects with the five stations lit, first whole and then place by place up close.',
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

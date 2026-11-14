// Dev tool, not shipped. Builds the field film "Portfolio en advies / Portfolio and
// consulting" (pm.field.portfolio), the third field film (v17): the level above the
// module intros. It places the two modules of the portfolio field (FIELDS in
// src/content/courses/index.js: portfolio, consult) on one road and says, per
// station, what it is for, when you meet it, which two tools of the module you use
// there (named, not explained: the checkpoint rule of 14 Nov) and what goes wrong
// without it. The map, not a lesson: no calculations, no numbers.
//
//   node films/pm.field.portfolio/build.mjs            build the page
//   node films/pm.field.portfolio/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.field.portfolio.html: one offline page with
// the anatomy kit, the stage script and the player inlined. The index names it
// (the field's `film`), sw.js precaches it; the app shows field films from Task 7.
//
// The first field with only two stations: the road, the strip and the map zoom of
// the stage follow the number of stations (two rows of the road, two squares of the
// strip, a zoom that goes place by place over the two places at the top of the map).
//
// The story continues the pilot's world and field films 1 and 2: line 3 has moved to
// hall B (the project is done: the line stands on its floor, the switchboard hangs,
// the cable is connected) and it is one project among several the plant wants this
// year. You led it; now you advise the plant manager (the sponsor of the world) which
// projects to do next.
//   s1 the opening: line 3 stands in hall B, one of four projects of this year; the
//      plant manager and you; the road with two stations
//   s2 Programma’s en governance (pm.portfolio): more projects than people, so you
//      rank them and draw the capacity line; then who decides what, and the benefits;
//      a capacity line and a decision log (pm.portfolio.prioritise, .governance);
//      without it, everything runs at once and less gets done
//   s3 Het adviesvak (pm.consult): the plant manager pays for your advice, so it
//      starts with a proposal about his problem; then trust, independence and
//      growing the client; a diagnostic phase and the trust equation
//      (pm.consult.proposal, .trust); without it, advice about yourself
//   s4 the shared Projects map (the kit's mapScene, as the app draws it) with the two
//      stations lit, the zoom place by place at 1.5, and back out
// The tools come from the modules' own Basis lessons (checked below), each a method or
// an artefact the lesson teaches and a term of its glossary. Terms come from the
// field's lessons (the kit's field mode, films/_kit/build-film.mjs); the kit holds the
// film to its road (every module named in a caption of its own scene, in the order of
// the road, explained in two beats and lit, ending on the map with the field's places
// lit), to the narration guard and to the label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): the sponsor and the
// team lead from its cast, the buyer, the installer and two operators with
// pm.agile.scrum's cast (films/pm.agile.scrum/cast.mjs), and the things of hall B from
// the pilot (films/pm.plan.intro/hall.mjs), imported. A panel at the right draws each
// station as a schema, two chips with the tools and a dashed card with what goes wrong
// without it.
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
const FIELD = FIELDS.find((f) => f.id === 'pm.field.portfolio');
const ROAD = ['pm.portfolio', 'pm.consult'];
assert(JSON.stringify(FIELD.modules) === JSON.stringify(ROAD), 'the portfolio field is the road portfolio, consult');
// the panel heading draws the module's title in at most two lines of the panel's width (the kit does not measure it)
for (const id of ROAD) for (const lang of ['nl', 'en']) {
  const t = MODULES.find((m) => m.id === id).title[lang];
  const lines = wrapUnits(t, 284, CHAR_W);
  assert(lines.length <= 2 && lines.every((ln) => ln.split(' ').every((wd) => wrapUnits(wd, 284, CHAR_W).length === 1)), `the heading "${t}" (${lang}) does not fit two lines of 284 units`);
}
const lessons = await allLessons();
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def}`)].join('\n'); for (const s of list) assert(text.includes(s), `${id} (${lang}) no longer says "${s}"`); };
// s2 portfolio: a programme and the portfolio (more projects than people), the capacity line, work in progress, decisions in advance, benefits owned by the line
has('pm.portfolio.programme', ['Een programma is een groep projecten die je samen stuurt omdat ze één uitkomst leveren die geen van hen alleen haalt', 'het portfolio, de hele lijst projecten die om hetzelfde geld en dezelfde mensen strijden']);
has('pm.portfolio.programme', ['A programme is a group of projects run together because they deliver one outcome none of them reaches alone', 'the portfolio, the full list of projects competing for the same money and people'], 'en');
has('pm.portfolio.prioritise', ['trek de capaciteitsstreep waar het lopende totaal 240 bereikt. Alles onder de streep wacht', 'projecten op halve snelheid leveren dus minder op dan zes op volle snelheid', 'Capaciteitsstreep Het punt in de gerangschikte lijst']);
has('pm.portfolio.prioritise', ['draw the capacity line where the running total reaches 240. Everything below the line waits', 'projects at half speed deliver less than six at full speed', 'Capacity line The point in the ranked list'], 'en');
has('pm.portfolio.governance', ['Governance is het geheel van afspraken over wie wat beslist', 'De notulen zijn een besluitenlijst', 'niemand beslist', 'Besluitenlijst Een doorlopend overzicht van besluiten']);
has('pm.portfolio.governance', ['Governance is the set of agreements on who decides what', 'The minutes are a decision log', 'nobody decides', 'Decision log A running record of decisions'], 'en');
has('pm.portfolio.benefits', ['Projecten leveren output; de lijn, de managers die de dagelijkse operatie draaien, is eigenaar van uitkomsten en baten', 'Zo zie je baten weglekken']);
has('pm.portfolio.benefits', ['Projects deliver outputs; the line, the managers who run daily operations, owns outcomes and benefits', 'What you see when benefits leak'], 'en');
// s3 consult: a proposal that starts with the client's problem, a diagnostic phase first, trust (the equation), advice about yourself, a client that grows
has('pm.consult.proposal', ['Een offerte wint op de eerste pagina. Begin met het probleem van de klant', 'Een goede eerste fase is een diagnosefase', 'offertes die vooral over het adviesbureau gaan en nauwelijks over de klant', 'Diagnosefase Een korte, vaste eerste fase die het probleem toetst']);
has('pm.consult.proposal', ['A proposal wins on its first page. Start with the client’s problem', 'A good first phase is a diagnostic phase', 'proposals that are mostly about the consultancy and hardly about the client', 'Diagnostic phase A short, fixed first phase that tests the problem'], 'en');
has('pm.consult.trust', ['vertrouwen = (geloofwaardigheid + betrouwbaarheid + intimiteit) / zelfgerichtheid', 'maakt veel ervan de rest teniet', 'Vertrouwensformule Geloofwaardigheid plus']);
has('pm.consult.trust', ['trust = (credibility + reliability + intimacy) / self-orientation', 'high self-orientation cancels out the rest', 'Trust equation Credibility plus'], 'en');
has('pm.consult.independence', ['Je advies is alleen geld waard als het onafhankelijk is']);
has('pm.consult.independence', ['Your advice is only worth paying for if it is independent'], 'en');
has('pm.consult.account', ['het volgende probleem vanzelf naar je toe komt']);
has('pm.consult.account', ['the next problem comes to you'], 'en');

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

// the people: the sponsor (the plant manager) and the team lead of the line are the pm cast, the two operators are
// pm.agile.scrum's figures. Each stands in a cue group; the stage script shows each when the story needs it.
const person = (role, x, y, along) => w.person({ x, y, role, along });

const world = [
  w.room(ROOM),
  cueG('calendar', CAL.svg + calStop),
  cueG('floor', hall.floorMark(SLAB)),
  cueG('power', hall.cabinet({ x: CAB.x, w: CAB.w, d: CAB.d, h: CAB.h }) + g('cabOn', cablePath(false))),
  cueG('switch', g('swS', hall.switchboard(SWB))),
  cueG('line3', g('line3S', hall.conveyor({ ...L3, cartons: 4 }))),
  g('pp-crew', scrumPerson(w, k, G, P, { x: 176, y: 66, key: 'crew', look: 'dev', along: 'x' }) + scrumPerson(w, k, G, P, { x: 278, y: 60, key: 'crew', look: 'dev2', along: 'x' })),
  cueG('line4', hall.conveyor({ ...L4, cartons: 3 })),
  g('pp-lead', person('teamlead', 150, 118, 'x')),
  g('pp-sponsor', person('sponsor', 36, 140, 'y')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group (data-cue), filled by the stage script each frame
// (data-k). The road holds the two stations, one cue group each (st-<slug>): in s1 a row with its number and
// title, in s2 and s3 a numbered square of the strip under the heading. The shared Projects map (mapScene,
// the two stations lit) sits under the panel; its places are cue groups of their own (map-<slug>).
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
  { from: cam(145, 85, 70, 1), to: cam(150, 85, 70, 1.04) }, // s1 the whole hall, line 3 on its floor
  { from: cam(120, 105, 70, 1), to: cam(125, 105, 70, 1.05) }, // s2 the plant manager and the team lead
  { from: cam(110, 110, 70, 1), to: cam(100, 112, 70, 1.06) }, // s3 the plant manager, who pays for the advice
  { from: cam(145, 85, 70, 1), to: cam(145, 85, 70, 1) }, // s4 (the map)
];

// ---------------------------------------------------------------- the film
const MAPS = ROAD.map(mapCue);
const TOOLCUE = (a, b) => ({ cue: { [a]: 't1', [b]: 't2' }, focus: ['t1', 't2'] });
const DURS = Array(4).fill(30);
const spec = {
  id: 'pm.field.portfolio',
  title: { nl: 'Portfolio en advies', en: 'Portfolio and consulting' },
  field: 'pm.field.portfolio',
  // the road: per module of the field, the scene that explains it and its station on the road
  stations: Object.fromEntries(ROAD.map((id, i) => [id, { scene: `s${i + 2}`, cue: STATION_CUE[id] }])),
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'De senior kant', en: 'The senior side' },
      beats: [
        { nl: 'Lijn 3 staat in hal B. De fabriek wil dit jaar nog meer projecten.', en: 'Line 3 stands in hall B. The plant wants more projects this year.', focus: ['goal', 'line3', 'crew', 'teamlead'] },
        { nl: 'Jij leidde het project. Nu adviseer je de fabrieksdirecteur welke er komen.', en: 'You led the project. Now you advise the plant manager which ones come next.', focus: ['people5', 'sponsor'] },
        { nl: 'Twee stations: projecten kiezen en sturen, en adviseren wie ze betaalt.', en: 'Two stations: choosing and steering projects, and advising who pays for them.', focus: 'road' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Programma’s en governance', en: 'Programmes and governance' },
      beats: [
        { nl: 'Het eerste station is Programma’s en governance: er zijn meer projecten dan mensen.', en: 'The first station is Programmes and governance: there are more projects than people.', focus: ['st-portfolio', 'for', 'sponsor', 'teamlead'] },
        { nl: 'Daarna stuur je ze samen: wie beslist wat, en komen de baten echt binnen?', en: 'Then you steer them together: who decides what, and do the benefits really arrive?', focus: ['for', 'sponsor', 'teamlead'] },
        { nl: 'Je gebruikt een {t:Capaciteitsstreep|capaciteitsstreep} en een {t:Besluitenlijst|besluitenlijst}.', en: 'You use a {t:Capacity line|capacity line} and a {t:Decision log|decision log}.', ...TOOLCUE('Capaciteitsstreep', 'Besluitenlijst') },
        { nl: 'Zonder dit loopt alles tegelijk en komt er minder af.', en: 'Without this everything runs at once and less gets done.', focus: 'without' },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Het adviesvak', en: 'The consulting craft' },
      beats: [
        { nl: 'Het tweede station is Het adviesvak: de directeur betaalt, en het begint met een offerte.', en: 'The second station is The consulting craft: the manager pays, and it starts with a proposal.', focus: ['st-consult', 'for', 'sponsor'] },
        { nl: 'Daarna draait het om vertrouwen, om onafhankelijk blijven en om werk dat nieuw werk oplevert.', en: 'Then it is about trust, about staying independent and about work that brings new work.', focus: ['for', 'sponsor'] },
        { nl: 'Je gebruikt een {t:Diagnosefase|diagnosefase} en de {t:Vertrouwensformule|vertrouwensformule}.', en: 'You use a {t:Diagnostic phase|diagnostic phase} and the {t:Trust equation|trust equation}.', ...TOOLCUE('Diagnosefase', 'Vertrouwensformule') },
        { nl: 'Zonder dit gaat je advies over jezelf en niet over de klant.', en: 'Without this your advice is about yourself and not about the client.', focus: 'without' },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De kaart van Projecten: de twee stations van kiezen en adviseren liggen bovenaan.', en: 'The map of Projects: the two stations of choosing and advising lie at the top.', focus: MAPS },
        { nl: 'Eerst Programma’s en governance: programma’s, prioriteren, sturen en baten.', en: 'First Programmes and governance: programmes, priorities, steering and benefits.', focus: MAPS[0] },
        { nl: 'Dan Het adviesvak: offerte, vertrouwen, ethiek en groei.', en: 'Then The consulting craft: proposal, trust, ethics and growth.', focus: MAPS[1] },
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
// 0.4 s). Words checked with espeak-ng phonemes through Piper's own bridge (nl_NL-alex): see this film's
// SAY group (the last of the Dutch list in films/_kit/timeline.mjs) for what needed a rule.
const SAY = [
  [ // s1 the opening
    { nl: 'Lijn 3 staat in hal B. Maar de fabriek wil dit jaar veel meer projecten.',
      en: 'Line 3 stands in hall B. But the plant wants many more projects this year.' },
    { nl: 'Jij leidde dat project. Nu adviseer je de fabrieksdirecteur welke projecten er daarna komen.',
      en: 'You led that project. Now you advise the plant manager on which projects come next.' },
    { nl: 'Daar horen twee stations bij. Eerst kiezen en sturen, dan adviseren.',
      en: 'That takes two stations. First choosing and steering, then advising.' },
  ],
  [ // s2 portfolio
    { nl: 'Het eerste station is Programma’s en governance. Er zijn meer projecten dan mensen, dus je kiest welke je doet en welke wachten.',
      en: 'The first station is Programmes and governance. There are more projects than people, so you choose which to do and which wait.' },
    { nl: 'Daarna stuur je ze samen. Wie beslist wat, en komen de baten echt binnen?',
      en: 'Then you steer them together. Who decides what, and do the benefits really arrive?' },
    { nl: 'Je gebruikt een {t:Capaciteitsstreep|capaciteitsstreep} en een {t:Besluitenlijst|besluitenlijst}.',
      en: 'You use a {t:Capacity line|capacity line} and a {t:Decision log|decision log}.' },
    { nl: 'Zonder dit loopt alles tegelijk, en komt er minder af.',
      en: 'Without this everything runs at once, and less gets done.' },
  ],
  [ // s3 consult
    { nl: 'Het tweede station is Het adviesvak. De directeur betaalt voor jouw advies, en het begint met een offerte over zijn probleem.',
      en: 'The second station is The consulting craft. The manager pays for your advice, and it starts with a proposal about the problem.' },
    { nl: 'Daarna draait het om vertrouwen, om onafhankelijk blijven en om werk dat nieuw werk oplevert.',
      en: 'Then it is about trust, about staying independent and about work that brings new work.' },
    { nl: 'Je gebruikt een {t:Diagnosefase|diagnosefase} en de {t:Vertrouwensformule|vertrouwensformule}.',
      en: 'You use a {t:Diagnostic phase|diagnostic phase} and the {t:Trust equation|trust equation}.' },
    { nl: 'Zonder dit gaat je advies over jezelf en niet over de klant.',
      en: 'Without this your advice is about yourself and not about the client.' },
  ],
  [ // s4 the map
    { nl: 'Dit is de kaart van Projecten. De twee stations van kiezen en adviseren liggen bovenaan.',
      en: 'This is the map of Projects. The two stations of choosing and advising lie at the top.' },
    { nl: 'Eerst Programma’s en governance. Daar gaat het om programma’s, prioriteren, sturen en baten.',
      en: 'First Programmes and governance. It covers programmes, priorities, steering and benefits.' },
    { nl: 'Dan Het adviesvak. Daar gaat het om offerte, vertrouwen, ethiek en groei.',
      en: 'Then The consulting craft. It covers proposals, trust, ethics and growth.' },
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

const PEOPLE = ':is([data-cue="sponsor"],[data-cue="crew"],[data-cue="teamlead"])';
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
  nl: 'Hal B van de fabriek, waar lijn 3 nu staat, zoals in de intro van Plannen. Op de vloer lijn 3 op zijn plek met een gestippelde omtrek; ernaast staat lijn 4. Links de stroomkast met de kabel van buiten, aan de achterwand de schakelkast, en aan de zijwand een kalender waarvan de laatste drie weken de zomerstop zijn. Eerst staan de teamleider en de operators bij lijn 3; later komt de sponsor erbij, de directeur van de fabriek, die voor het advies betaalt. Rechts een paneel, gemarkeerd als voorbeeld of schema. Eerst een kaart met vier projecten van dit jaar, dan jij en de directeur, en de weg met twee stations. Dan per station een schema, twee namen van hulpmiddelen en, gestippeld, wat er misgaat zonder: bij Programma’s en governance een rij projecten met een capaciteitsstreep, en daarna drie niveaus van beslissen, met Capaciteitsstreep en Besluitenlijst; bij Het adviesvak een offerte met eerst het probleem, en daarna vertrouwen, onafhankelijkheid en groei, met Diagnosefase en Vertrouwensformule. Aan het eind de kaart van Projecten met de twee stations verlicht, eerst helemaal en dan plek voor plek van dichtbij.',
  en: 'Hall B of the plant, where line 3 now stands, as in the intro of Plan. On the floor line 3 in its place with a dashed outline; next to it stands line 4. At the left the power cabinet with the cable from outside, on the back wall the switchboard, and on the side wall a calendar whose last three weeks are the summer shutdown. First the team lead and the operators stand at line 3; later the sponsor joins, the plant manager, who pays for the advice. At the right a panel, marked as an example or a diagram. First a card with four projects of this year, then you and the plant manager, and the road with two stations. Then per station a schema, two names of tools and, dashed, what goes wrong without it: at Programmes and governance a row of projects with a capacity line, and then three levels of deciding, with Capacity line and Decision log; at The consulting craft a proposal that starts with the problem, and then trust, independence and growth, with Diagnostic phase and Trust equation. At the end the map of Projects with the two stations lit, first whole and then place by place up close.',
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

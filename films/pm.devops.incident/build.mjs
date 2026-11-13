// Dev tool, not shipped. Builds the explainer film "Incident, probleem,
// wijziging / Incident, problem, change" for the Projects course:
// pm.devops.incident (level 1 of the topic IT-servicemanagement en incidenten,
// in DevOps en levering).
//
//   node films/pm.devops.incident/build.mjs            build the page
//   node films/pm.devops.incident/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.devops.incident.html: one offline page
// with the anatomy kit, the stage script and the player inlined. A film that
// will be rendered to video (Merijn, 2026-11-12: render every reviewed pm
// film), so all stage and card text is 22 units (films/_kit/build-film.mjs).
// The lesson has no storyboard entry in the v14 plan; the film follows the
// lesson's own order: ITIL (s1), the incident and the service desk (s2), the
// problem (s3), the change (s4), the Lean view and the sharp question (s5),
// then the cooked-meats plant's four days (s6). A lesson with a film no longer
// shows its worked example (v16 notes), so the film carries the whole teach
// text and the worked example.
//
// This lesson alone. pm.devops.postmortem (level 3 of the same topic) has its
// own film in the same room (films/pm.devops.postmortem), because together,
// with every teach point and its faded example (question and answer: two more
// whys, a workaround, two actions with owners, no culprit) said, the two
// lessons need about 900 narration words (about 840 even when written tersely,
// with the asides on the cards only), over the 760 a film may say and over the
// kit's 330-second narration cap (films/_kit/assert.mjs: 825 words).
//
// Checklist (lesson point: scene and beat; "card" = on the card only, not
// spoken, on screen at least 4 s; every card stays up for the rest of its page):
//   incident teach 1: ITIL, the best-known collection of good practice for IT
//     service management: organising IT so that users can work reliably (s1
//     b1); it began in the late 1980s at the British government; the current
//     version, ITIL 4, appeared in 2019 and is now owned by the company
//     PeopleCert (s1 b2); you need not know it by heart, but keep three words
//     sharply apart: incident, problem and change (s1 b3)
//   incident teach 2: an incident, an unplanned interruption of a service, or a
//     service working worse than it should; the MES does not respond, the
//     label printer does not print (s2 b1); the goal: working again as fast as
//     possible, even if the cause is not known yet (s2 b2); incidents come in
//     at the service desk, the central point where users report outages and
//     questions, by phone, email or portal (s2 b3)
//   incident teach 3: a problem in ITIL, the cause or potential cause of one or
//     more incidents (s3 b1); with a problem the goal is different: understand
//     why it happens, so it does not come back (s3 b2); the printer failing
//     every week: 52 incidents a year, but maybe only one problem, e.g. a power
//     supply that dips briefly when the press starts up; problem management
//     looks for that cause (s3 b3; "problem management" on the Dutch card, as
//     the lesson glosses it)
//   incident teach 4: a change, the addition, modification or removal of
//     anything that could affect a service: a new MES version, another printer
//     driver, an adjusted firewall rule (s4 b1); many incidents are caused by a
//     change, so the first question at an outage is often "what changed
//     recently?" (s4 b2); ITIL 4 now calls managing changes change enablement
//     (at first: change control): making changes possible, not stopping them
//     (s4 b3)
//   incident teach 5: for a Lean consultant, handling an incident is like
//     quickly fixing a breakdown on the line (s5 b1), problem management like a
//     root-cause analysis so it does not return; the difference is in the goal:
//     working again, versus never again (s5 b2); what you often see: a service
//     desk good at incidents while nobody has time for problems (s5 b3); the
//     sharp question: which five outages came back most often last month, and
//     who is looking for the cause? (s5 b4)
//   incident example: a cooked-meats plant, reports at the service desk and how
//     to sort them (s6 b1); Monday 06:10 "the scale on line 2 sends no weights to
//     the MES": an incident, the service is interrupted (s6 b2); the service
//     desk restarts the link, at 06:25 it works again (s6 b3); Tuesday 06:05 and
//     Wednesday 06:12 the same report, two more incidents (s6 b4); Wednesday
//     afternoon the IT administrator sees the pattern: three incidents, always
//     around six; one problem, "scale link line 2 fails at shift start" (s6 b5);
//     Thursday the cause: a scheduled backup at 06:00 that blocks the link;
//     moving it to 04:00 is a change, first discussed and planned (s6 b6)
//   Not in the film: the lesson's pre and recall questions, its "said" line,
//   situation and sayIt (practice, not teach text).
//
// Facts, credited only as the lesson words them (checked 2026-11-13): ITIL
// began in the late 1980s at a UK government agency (the CCTA); ITIL 4 was
// published in February 2019; its owner AXELOS has been part of PeopleCert
// since 2021, so ITIL is now PeopleCert's. ITIL 4 first named the practice
// "change control" and later renamed it "change enablement".
// The film says only what the lesson says: "eind jaren tachtig bij de Britse
// overheid", "ITIL 4, verscheen in 2019", "nu van het bedrijf PeopleCert". The
// Lean comparison is worded as the lesson's likeness ("lijkt op", "is like"),
// not as identity. The plant, its times and the 52 incidents are the lesson's
// own illustration (1 a week times 52 weeks, asserted below).
//
// The drawing is the shared pm world (films/_pm/world.mjs, read-only here), the
// IT side of a plant, in the style of pm.devops.pipeline (the same projection,
// lamps, panel and card helpers): a room with a whiteboard on the back wall
// that carries shapes only (no text there, so nothing on the stage is under 22
// units): three icons for incident, problem and change, the 52 weekly ticks,
// the Lean pair of loops and the week of the example. At the back a server rack
// for the MES with a backup unit beside it, each with a lamp on top; a cable on
// the floor, the link, runs from the rack to line 2 at the front, a short
// conveyor with a checkweigher (the scale, as pm.itproject.cutover draws it) and
// a label printer, each with a lamp. At the left the service desk: a desk with a
// laptop and a phone. People: you (the consultant, at the board), the service
// desk agent and the IT administrator (the Scrum film's cast,
// pm.agile.scrum/cast.mjs, imported, not edited) and the team lead from the
// floor at the line. The administrator stands by the backup unit and the rack,
// the team lead in front of line 2, so neither hides the other (nor the board's
// week) at 390 px. A lamp turns red at an outage and green when the line works
// again; the link turns red and dashed while it is down. A panel at the right,
// in stage space, carries one card per scene, labelled "schema" or "voorbeeld".
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below), and so are the people, the rack,
// the backup, the link, the line, the scale, the printer, the desk and each
// layer of the board.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { NARRATION_WPS, MAX_TOTAL } from '../_kit/assert.mjs';
import { beatStarts, minSceneDur, wordsOf, sayable } from '../_kit/timeline.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';
import { scrumPerson } from '../pm.agile.scrum/cast.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// What the film states, asserted against the lesson's current text (the build
// fails if it drifts); the {n:...} numbers are then checked against the Dutch
// lesson text by defineFilm.
const IN = 'pm.devops.incident';
const lessons = await allLessons();
const FAILS = [];
const assert = (ok, what) => { if (!ok) FAILS.push(what); };
const textOf = (id, lang) => { const l = lessons[lang].get(id); return `${l.teach.join('\n')}\n${l.example.text}\n${l.example.ask || ''}\n${l.example.reveal || ''}`; };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(IN, ['ITIL is de bekendste verzameling goede praktijken voor IT-servicemanagement', 'het zo organiseren van IT dat gebruikers betrouwbaar kunnen werken',
  'Het begon eind jaren tachtig bij de Britse overheid', 'De huidige versie, ITIL 4, verscheen in 2019 en is nu van het bedrijf PeopleCert',
  'Je hoeft het niet uit je hoofd te kennen', 'drie woorden scherp uit elkaar houden: incident, probleem en wijziging',
  'Een incident is een onverwachte onderbreking van een dienst, of een dienst die slechter werkt dan zou moeten', 'Het MES reageert niet, de etiketprinter print niet',
  'zo snel mogelijk weer werken, ook als je de oorzaak nog niet kent', 'het centrale meldpunt waar gebruikers storingen en vragen melden, per telefoon, mail of portaal',
  'Een probleem is in ITIL de oorzaak, of mogelijke oorzaak, van een of meer incidenten', 'begrijpen waarom het gebeurt, zodat het niet terugkomt',
  'dat zijn 52 incidenten per jaar, maar misschien maar één probleem', 'een stroomvoorziening die bij het opstarten van de pers even inzakt', 'Probleembeheer (problem management) zoekt die oorzaak',
  'Een wijziging (change) is het toevoegen, aanpassen of weghalen van iets dat invloed kan hebben op een dienst', 'Een nieuwe MES-versie, een andere printerdriver, een aangepaste firewall-regel',
  'Veel incidenten worden veroorzaakt door een wijziging', '“Wat is er recent veranderd?”', 'change enablement (eerst: change control), wijzigingen mogelijk maken, niet tegenhouden',
  'incident afhandelen lijkt op een storing op de lijn snel verhelpen, probleembeheer op een oorzaakanalyse doen zodat hij niet terugkomt', 'Het verschil zit in het doel: weer werken, versus nooit meer',
  'een servicedesk die goed is in incidenten, terwijl niemand tijd heeft voor problemen', '“Welke vijf storingen kwamen vorige maand het vaakst terug, en wie zoekt de oorzaak?”',
  'Bij een vleeswarenfabriek komen deze meldingen binnen op de servicedesk', 'Maandag 06:10: “Weegschaal op lijn 2 stuurt geen gewichten naar het MES.” Een incident: de dienst is onderbroken',
  'De servicedesk herstart de koppeling; om 06:25 werkt het weer', 'Dinsdag 06:05 en woensdag 06:12: dezelfde melding. Weer twee incidenten',
  'Woensdag middag: de IT-beheerder ziet het patroon. Drie incidenten, steeds rond zes uur', '“koppeling weegschaal lijn 2 valt uit bij ploegstart”',
  'een geplande back-up om 06:00 die de koppeling blokkeert', 'De back-up naar 04:00 verplaatsen is een wijziging, die eerst wordt besproken en gepland']);
says(IN, ['It began in the late 1980s at the British government', 'is now owned by the company PeopleCert', 'change enablement (at first: change control)',
  'handling an incident is like quickly fixing a breakdown on the line', 'At a cooked-meats plant', 'Moving the backup to 04:00 is a change'], 'en');
assert(lessons.nl.get(IN).terms.map((t) => t.term).join() === 'ITIL,Incident,Probleem,Wijziging,Servicedesk', 'the five terms of incident');
assert(lessons.en.get(IN).terms.map((t) => t.term).join() === 'ITIL,Incident,Problem,Change,Service desk', 'the five English terms of incident');
for (const lang of ['nl', 'en']) assert(lessons[lang].get(IN).film === 'pm.devops.incident', `${IN} (${lang}) wires this film`);
// one printer failure a week, every week of the year
assert(1 * 52 === 52, '52 incidents a year');
// the example's week, in minutes after midnight: three reports around six, the backup at six, moved to four
const T = { mon: 6 * 60 + 10, fixed: 6 * 60 + 25, tue: 6 * 60 + 5, wed: 6 * 60 + 12, backup: 6 * 60, moved: 4 * 60 };
assert([T.mon, T.tue, T.wed].every((t) => Math.abs(t - T.backup) <= 15), 'the three reports come within a quarter of an hour after the 06:00 backup');
assert(T.fixed - T.mon === 15, 'Monday: working again 15 minutes after the report');
if (FAILS.length) throw new Error(`model:\n  ${FAILS.join('\n  ')}`);

// ---------------------------------------------------------------- the world
const W = 640;
const H = 400;
const AZ = 58;
const ROOM = { w: 300, d: 240, h: 230 };
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, 318, H, { pad: 8, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;
const r1 = (v) => Math.round(v * 10) / 10;
const pt = (p) => w.at(p).map(r1).join(' ');

// the whiteboard: each layer its own cue group, drawn by stage.js in the board's
// face plane (u = x, v = -z)
const BOARD = w.board({ x0: 60, x1: 220, z0: 112, z1: 208 });
const BA = BOARD.area;
const LAYERS = ['bInc', 'bProb', 'bChg', 'bTally', 'bLean', 'bWeek'];
const boardLayers = `<g transform="${BOARD.face}">${LAYERS.map((c) => cueG(c, g(c, ''))).join('')}</g>`;
const AREA = { u0: r1(BA.x0 + 6), u1: r1(BA.x1 - 6), v0: r1(-BA.z1 + 6), v1: r1(-BA.z0 - 6) };

// the MES: a server rack against the back wall at the right, rows of lights on
// its front; the backup unit beside it; a lamp on top of each
const RACK = { x: 264, y: 10, w: 28, d: 28, h: 124 };
const rack = w.box({ x: RACK.x, y: RACK.y, w: RACK.w, d: RACK.d, r: 1 }, 0, RACK.h, { tone: 'lo' }, { steps: 3, bevel: 0.4,
  extra: k.dotsSvg([0, 1, 2, 3, 4, 5, 6].flatMap((row) => [0, 1, 2, 3].map((c) => w.at([RACK.x + 6 + c * 5.4, RACK.y + RACK.d + 0.2, 30 + row * 12]))), { size: 0.55, tone: 'hi' }) });
const BAK = { x: 236, y: 14, w: 22, d: 20, h: 46 };
const backup = w.box({ x: BAK.x, y: BAK.y, w: BAK.w, d: BAK.d, r: 1 }, 0, BAK.h, { tone: 'mid' }, { steps: 2, bevel: 0.4 })
  + w.box({ x: BAK.x + 4, y: BAK.y + BAK.d, w: 14, d: 0.6, r: 0.3 }, 28, 34, { tone: 'lo' }, { steps: 1 });

// line 2: a stand with a belt, the checkweigher (pm.itproject.cutover's scale),
// a label printer and two cartons on the belt
const LINE = { x: 112, y: 150, w: 150, d: 28, h: 66 };
const LZ = LINE.h;
const SC = { x: 124, y: 152 };
const scale = w.box({ x: SC.x, y: SC.y, w: 32, d: 24, r: 1 }, LZ + 4, LZ + 11, { tone: 'lo' }, { steps: 2, bevel: 0.4 })
  + w.box({ x: SC.x + 2, y: SC.y + 3, w: 28, d: 18, r: 1 }, LZ + 11, LZ + 13, { tone: 'hi' }, { steps: 2 })
  + w.post(SC.x + 28, SC.y + 3, 1.4, LZ + 13, LZ + 26, { tone: 'mid' }, 10)
  + w.box({ x: SC.x + 21, y: SC.y + 1, w: 14, d: 3, r: 0.6 }, LZ + 25, LZ + 35, { tone: 'hi' }, { steps: 2 });
const PR = { x: 184, y: 152 };
const printer = w.box({ x: PR.x, y: PR.y, w: 26, d: 20, r: 1 }, LZ + 4, LZ + 22, { tone: 'mid' }, { steps: 2, bevel: 0.4 })
  + w.box({ x: PR.x + 4, y: PR.y + 20, w: 18, d: 0.6, r: 0.2 }, LZ + 10, LZ + 13, { tone: 'lo' }, { steps: 1 });
const belt = w.box({ x: LINE.x + 2, y: LINE.y + 5, w: LINE.w - 4, d: 18, r: 1 }, LZ, LZ + 4, { tone: 'lo' }, { steps: 2 })
  + w.box({ x: 222, y: 158, w: 12, d: 12, r: 0.8 }, LZ + 4, LZ + 14, { tone: 'hi' }, { steps: 2 })
  + w.box({ x: 242, y: 158, w: 12, d: 12, r: 0.8 }, LZ + 4, LZ + 14, { tone: 'hi' }, { steps: 2 });
const stand = w.table({ x: LINE.x, y: LINE.y, w: LINE.w, d: LINE.d, h: LZ });

// the lamps: a ring on top of the rack, the backup, the scale's display and the printer
const lampAt = [[RACK.x + RACK.w / 2, RACK.y + RACK.d / 2, RACK.h, 5], [BAK.x + BAK.w / 2, BAK.y + BAK.d / 2, BAK.h, 4],
  [SC.x + 28, SC.y + 2.5, LZ + 35, 3], [PR.x + 13, PR.y + 10, LZ + 22, 4]];
const LAMPS = lampAt.map(([x, y, z, r]) => k.pathOf(k.circleRing(x, y, r, 20).map(([px, py]) => w.at([px, py, z + 0.2]).map(r1)), true));
const LAMPK = ['lampMes', 'lampBak', 'lampScale', 'lampPrn'];

// the link: a cable on the floor from the rack to the stand of line 2
const LINK = [[RACK.x + RACK.w / 2, RACK.y + RACK.d + 2, 0.4], [RACK.x + RACK.w / 2, 112, 0.4], [170, 112, 0.4], [170, LINE.y + 2, 0.4], [170, LINE.y + 2, LZ - 4]];
const linkD = `M${LINK.map(pt).join('L')}`;

// the service desk: a desk with a laptop and a phone
const DESK = { x: 14, y: 178, w: 76, d: 44, h: 74 };
const desk = w.table(DESK) + w.laptop({ x: 42, y: 198, z: DESK.h, toward: -1 })
  + w.box({ x: 66, y: 190, w: 14, d: 10, r: 1 }, DESK.h, DESK.h + 3, { tone: 'lo' }, { steps: 2 })
  + w.box({ x: 66, y: 190, w: 14, d: 3, r: 1 }, DESK.h + 3, DESK.h + 6, { tone: 'mid' }, { steps: 2 });

const world = [
  w.room(ROOM),
  w.clock(247, 186, 11),
  cueG('board', BOARD.svg + boardLayers),
  cueG('link', g('linkp', `<path class="pm-link" d="${linkD}"/>`)),
  cueG('mes', rack + g(LAMPK[0], '')),
  cueG('backup', backup + g(LAMPK[1], '')),
  w.person({ x: 34, y: 48, role: 'jij', along: 'x' }),
  scrumPerson(w, k, G, P, { x: 246, y: 122, key: 'admin', look: 'sm', along: 'x' }),
  scrumPerson(w, k, G, P, { x: 50, y: 156, key: 'agent', look: 'dev', along: 'x' }),
  cueG('desk', desk),
  w.person({ x: 230, y: 200, role: 'teamlead', along: 'x' }),
  cueG('line', stand + belt
    + cueG('scale', scale + g(LAMPK[2], ''))
    + cueG('printer', printer + g(LAMPK[3], ''))),
].join('');
for (const r of ['jij', 'admin', 'agent', 'teamlead', 'board', 'link', 'mes', 'backup', 'desk', 'line', 'scale', 'printer', ...LAYERS]) assert(world.includes(`data-cue="${r}"`), `${r} is a cue group`);
if (FAILS.length) throw new Error(`model:\n  ${FAILS.join('\n  ')}`);

// ---------------------------------------------------------------- the panel (stage space)
// One card per scene, drawn by stage.js into these groups; each block of a card
// sits in its own cue group, so a beat's focus (and a term's cue) can light it.
const PX = 322;
const PW = 308;
const CUES = ['itil', 'origin', 'three',
  'inc', 'goal', 'sdesk',
  'prob', 'pgoal', 'p52',
  'chg', 'recent', 'enable',
  'lean1', 'lean2', 'often', 'ask',
  'meat', 'e1', 'e2', 'e3', 'e4', 'e5'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));
// Static paths with relative line-tos (the helper of pm.devops.pipeline): the
// same points, fewer bytes; each rewrite is read back.
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
const svg = compact(`<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world)}${g('hud', hud)}</svg>`);

// ---------------------------------------------------------------- cameras (one gentle move per scene)
// [cx, cy, s]: the stage point (cx, cy) stays put while the room scales by s
const BOARD_AT = w.at([(BA.x0 + BA.x1) / 2, 0, (BA.z0 + BA.z1) / 2]).map(r1);
const BCAM = (s) => [BOARD_AT[0], BOARD_AT[1] + 30, s];
const LINE_AT = w.at([200, 150, LZ]).map(r1);
const LCAM = (s) => [LINE_AT[0], LINE_AT[1], s];
const DESK_AT = w.at([50, 196, DESK.h]).map(r1);
const DCAM = (s) => [DESK_AT[0], DESK_AT[1], s];
const ALL = [160, 205, 1];
const CAM = [
  { from: ALL, to: BCAM(1.12) },
  { from: LCAM(1.15), to: DCAM(1.25) },
  { from: BCAM(1.1), to: BCAM(1.25) },
  { from: [160, 205, 1.04], to: BCAM(1.18) },
  { from: LCAM(1.2), to: [160, 205, 1.04] },
  { from: [160, 205, 1.02], to: BCAM(1.16) },
];

// ---------------------------------------------------------------- the film
const C = { CUES, AREA, LAMPS, LAMPK, T };
const sc = (id, level, title, beats) => ({ id, lesson: IN, level, still: 0.9, title, beats });
const spec = {
  id: 'pm.devops.incident',
  title: { nl: 'Incident, probleem, wijziging', en: 'Incident, problem, change' },
  lessons: [IN],
  strictFocus: true,
  scenes: [
    sc('s1', 1, { nl: 'ITIL in gewone woorden', en: 'ITIL in plain words' }, [
      { nl: '{t:ITIL|ITIL}: de bekendste goede praktijken om IT zo te regelen dat gebruikers betrouwbaar werken.', en: '{t:ITIL|ITIL}: the best-known good practice for running IT so that users can work reliably.', cue: { ITIL: 'itil' }, focus: ['itil', 'board'] },
      { nl: 'Begonnen eind jaren tachtig bij de Britse overheid. ITIL 4 kwam in 2019 en is nu van PeopleCert.', en: 'Begun in the late 1980s at the British government. ITIL 4 came in 2019 and is now owned by PeopleCert.', focus: 'origin' },
      { nl: 'Niet uit je hoofd leren, wel drie woorden scherp scheiden: incident, probleem en wijziging.', en: 'No need to learn it by heart, but keep three words apart: incident, problem and change.', focus: ['three', 'bInc', 'bProb', 'bChg'] },
    ]),
    sc('s2', 1, { nl: 'Het incident', en: 'The incident' }, [
      { nl: 'Een {t:Incident|incident}: een onverwachte onderbreking, of een dienst die slechter werkt.', en: 'An {t:Incident|incident}: an unplanned interruption, or a service working worse than it should.', cue: { Incident: 'inc' }, focus: ['inc', 'bInc', 'mes', 'printer'] },
      { nl: 'Doel: zo snel mogelijk weer werken, ook als de oorzaak nog onbekend is.', en: 'The goal: working again as fast as possible, even with the cause still unknown.', focus: ['goal', 'line'] },
      { nl: 'Ze komen binnen bij de {t:Servicedesk|servicedesk}: per telefoon, mail of portaal.', en: 'They come in at the {t:Service desk|service desk}: by phone, email or portal.', cue: { Servicedesk: 'sdesk' }, focus: ['sdesk', 'agent', 'desk'] },
    ]),
    sc('s3', 1, { nl: 'Het probleem', en: 'The problem' }, [
      { nl: 'Een {t:Probleem|probleem}: de oorzaak, of mogelijke oorzaak, van een of meer incidenten.', en: 'A {t:Problem|problem}: the cause, or potential cause, of one or more incidents.', cue: { Probleem: 'prob' }, focus: ['prob', 'bProb'] },
      { nl: 'Doel bij een probleem: begrijpen waarom het gebeurt, zodat het niet terugkomt.', en: 'The goal with a problem: understanding why it happens, so it does not come back.', focus: ['pgoal', 'bProb'] },
      { nl: 'Elke week een printerstoring: {n:52} incidenten per jaar, misschien één probleem.', en: 'A printer failing every week: {n:52} incidents a year, maybe one problem.', focus: ['p52', 'bTally', 'printer'] },
    ]),
    sc('s4', 1, { nl: 'De wijziging', en: 'The change' }, [
      { nl: 'Een {t:Wijziging|wijziging}: iets toevoegen, aanpassen of weghalen dat een dienst kan raken.', en: 'A {t:Change|change}: adding, modifying or removing anything that could affect a service.', cue: { Wijziging: 'chg' }, focus: ['chg', 'bChg', 'mes'] },
      { nl: 'Veel incidenten komen door een wijziging. Eerste vraag: wat is er recent veranderd?', en: 'Many incidents come from a change. First question: what changed recently?', focus: ['recent', 'mes', 'agent'] },
      { nl: 'ITIL 4 zegt nu change enablement: wijzigingen mogelijk maken, niet tegenhouden.', en: 'ITIL 4 now says change enablement: making changes possible, not stopping them.', focus: ['enable', 'bChg'] },
    ]),
    sc('s5', 1, { nl: 'De Lean-blik', en: 'The Lean view' }, [
      { nl: 'Een incident afhandelen lijkt op een storing op de lijn snel verhelpen.', en: 'Handling an incident is like quickly fixing a breakdown on the line.', focus: ['lean1', 'line', 'teamlead'] },
      { nl: 'Probleembeheer lijkt op een oorzaakanalyse. Het doel: weer werken, versus nooit meer.', en: 'Problem management is like a root-cause analysis. The goal: working again, versus never again.', focus: ['lean2', 'bLean'] },
      { nl: 'Vaak: de servicedesk is goed in incidenten, maar niemand heeft tijd voor problemen.', en: 'Often: the service desk is good at incidents, but nobody has time for problems.', focus: ['often', 'agent', 'admin'] },
      { nl: 'Vraag: welke vijf storingen kwamen vorige maand het vaakst terug, en wie zoekt de oorzaak?', en: 'Ask: which five outages came back most often last month, and who looks for the cause?', focus: ['ask', 'jij'] },
    ]),
    sc('s6', 1, { nl: 'Voorbeeld: de weegschaal', en: 'Example: the scale' }, [
      { nl: 'Een vleeswarenfabriek: zo deel je de meldingen op de servicedesk in.', en: 'A cooked-meats plant: this is how you sort the reports at the service desk.', focus: ['meat', 'agent', 'desk'] },
      { nl: 'Maandag 06:10: weegschaal lijn 2 stuurt geen gewichten naar het MES. Een incident.', en: 'Monday 06:10: the scale on line 2 sends no weights to the MES. An incident.', focus: ['e1', 'scale', 'link', 'bWeek'] },
      { nl: 'De servicedesk herstart de koppeling: om 06:25 werkt het weer.', en: 'The service desk restarts the link: at 06:25 it works again.', focus: ['e2', 'agent', 'link'] },
      { nl: 'Dinsdag 06:05 en woensdag 06:12: dezelfde melding. Weer twee incidenten.', en: 'Tuesday 06:05 and Wednesday 06:12: the same report. Two more incidents.', focus: ['e3', 'bWeek', 'scale'] },
      { nl: 'Woensdagmiddag ziet de IT-beheerder het patroon: drie incidenten rond zes uur, één probleem.', en: 'Wednesday afternoon the IT administrator sees the pattern: three incidents near six, one problem.', focus: ['e4', 'admin', 'bWeek'] },
      { nl: 'Donderdag: een geplande back-up om 06:00 blokkeert de koppeling. Naar 04:00 is een wijziging.', en: 'Thursday: a scheduled backup at 06:00 blocks the link. Moving it to 04:00 is a change.', focus: ['e5', 'backup', 'bWeek'] },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson's teach
// text and worked example, so every point of the checklist above is said here
// or shown on the card. No symbol the voice would read aloud, no spoken
// parenthesis or quote; quoted sentences are introduced in words. Dutch checked
// with espeak-ng phonemes through Piper's own bridge (nl_NL-alex, 2026-11-13).
// Read as written: ITIL, IT-servicemanagement, servicedesk, etiketprinter,
// probleembeheer, oorzaakanalyse, vleeswarenfabriek, weegschaal, ploegstart,
// back-up, IT-beheerder, the MES (the kit's letters rule) and firewall-regel
// (the kit's IT/OT firewall rule, fajerwol); Lean-consultant goes through
// pm.run.conflict's rule. New SAY rules in films/_kit/timeline.mjs (tested;
// recomputed for every film: no other film's spoken text changes): PeopleCert
// as "Piepul-surt", change enablement and change control with an English
// "change" (tsjeensj), and printerdriver split at its head so the driver rule's
// "draiver" applies. English needs no rule. Years, times and numbers in words.
const SAY = [
  [ // s1 ITIL, its origin, three words
    { nl: '{t:ITIL|ITIL} is de bekendste verzameling goede praktijken voor IT-servicemanagement: IT zo organiseren dat gebruikers betrouwbaar kunnen werken.',
      en: '{t:ITIL|ITIL} is the best-known collection of good practice for IT service management: organising IT so that users can work reliably.' },
    { nl: 'Het begon eind jaren tachtig bij de Britse overheid. De huidige versie, ITIL vier, verscheen in tweeduizend negentien en is nu van het bedrijf PeopleCert.',
      en: 'It began in the late nineteen eighties at the British government. The current version, ITIL four, appeared in twenty nineteen and is now owned by the company PeopleCert.' },
    { nl: 'Je hoeft het niet uit je hoofd te kennen. Wel moet je drie woorden scherp uit elkaar houden: incident, probleem en wijziging.',
      en: 'You do not need to know it by heart. But you must keep three words sharply apart: incident, problem and change.' },
  ],
  [ // s2 the incident, its goal, the service desk
    { nl: 'Een {t:Incident|incident} is een onverwachte onderbreking van een dienst, of een dienst die slechter werkt dan zou moeten. Het MES reageert niet, de etiketprinter print niet.',
      en: 'An {t:Incident|incident} is an unplanned interruption of a service, or a service working worse than it should. The MES does not respond, the label printer does not print.' },
    { nl: 'Het doel bij een incident: zo snel mogelijk weer werken, ook als je de oorzaak nog niet kent.',
      en: 'The goal with an incident: working again as fast as possible, even if you do not know the cause yet.' },
    { nl: 'Incidenten komen binnen bij de {t:Servicedesk|servicedesk}: het centrale meldpunt waar gebruikers storingen en vragen melden, per telefoon, mail of portaal.',
      en: 'Incidents come in at the {t:Service desk|service desk}: the central point where users report outages and questions, by phone, email or portal.' },
  ],
  [ // s3 the problem, its goal, the weekly printer
    { nl: 'Een {t:Probleem|probleem} is in ITIL de oorzaak, of mogelijke oorzaak, van een of meer incidenten.',
      en: 'A {t:Problem|problem} in ITIL is the cause, or potential cause, of one or more incidents.' },
    { nl: 'Bij een probleem is het doel anders: begrijpen waarom het gebeurt, zodat het niet terugkomt.',
      en: 'With a problem the goal is different: understanding why it happens, so it does not come back.' },
    { nl: 'De printer die elke week uitvalt: dat zijn tweeënvijftig incidenten per jaar, maar misschien maar één probleem, zoals een stroomvoorziening die even inzakt als de pers opstart. Probleembeheer zoekt die oorzaak.',
      en: 'The printer that fails every week: that is fifty-two incidents a year, but maybe only one problem, like a power supply that dips briefly when the press starts up. Problem management looks for that cause.' },
  ],
  [ // s4 the change, what changed recently, change enablement
    { nl: 'Een {t:Wijziging|wijziging} is iets toevoegen, aanpassen of weghalen dat invloed kan hebben op een dienst: een nieuwe MES-versie, een andere printerdriver, een aangepaste firewall-regel.',
      en: 'A {t:Change|change} is adding, modifying or removing anything that could affect a service: a new MES version, a different printer driver, an adjusted firewall rule.' },
    { nl: 'Veel incidenten worden veroorzaakt door een wijziging. Daarom is de eerste vraag bij een storing vaak: wat is er recent veranderd?',
      en: 'Many incidents are caused by a change. That is why the first question at an outage is often: what changed recently?' },
    { nl: 'ITIL vier noemt het beheren van wijzigingen nu change enablement, eerst heette het change control: wijzigingen mogelijk maken, niet tegenhouden.',
      en: 'ITIL four now calls managing changes change enablement, at first change control: making changes possible, not stopping them.' },
  ],
  [ // s5 the Lean view, what you often see, the sharp question
    { nl: 'Voor jou als Lean-consultant: een incident afhandelen lijkt op een storing op de lijn snel verhelpen.',
      en: 'For you as a Lean consultant: handling an incident is like quickly fixing a breakdown on the line.' },
    { nl: 'Probleembeheer lijkt op een oorzaakanalyse, zodat de storing niet terugkomt. Het verschil zit in het doel: weer werken, versus nooit meer.',
      en: 'Problem management is like a root-cause analysis, so it does not return. The difference is in the goal: working again, versus never again.' },
    { nl: 'Wat je vaak ziet: een servicedesk die goed is in incidenten, terwijl niemand tijd heeft voor problemen.',
      en: 'What you often see: a service desk that is good at incidents, while nobody has time for problems.' },
    { nl: 'Een scherpe vraag: welke vijf storingen kwamen vorige maand het vaakst terug, en wie zoekt de oorzaak?',
      en: 'A sharp question: which five outages came back most often last month, and who is looking for the cause?' },
  ],
  [ // s6 the cooked-meats plant
    { nl: 'Een voorbeeld: bij een vleeswarenfabriek komen deze meldingen binnen op de servicedesk. Zo deel je ze in.',
      en: 'An example: at a cooked-meats plant these reports come in at the service desk. This is how you sort them.' },
    { nl: 'Maandag tien over zes: de weegschaal op lijn twee stuurt geen gewichten naar het MES. Een incident: de dienst is onderbroken.',
      en: 'Monday, ten past six: the scale on line two sends no weights to the MES. An incident: the service is interrupted.' },
    { nl: 'De servicedesk herstart de koppeling, en om vijfentwintig over zes werkt het weer.',
      en: 'The service desk restarts the link, and at twenty-five past six it works again.' },
    { nl: 'Dinsdag vijf over zes en woensdag twaalf over zes: dezelfde melding. Weer twee incidenten.',
      en: 'Tuesday at five past six and Wednesday at twelve past six: the same report. Two more incidents.' },
    { nl: 'Woensdagmiddag ziet de IT-beheerder het patroon: drie incidenten, steeds rond zes uur. Dat wordt één probleem: koppeling weegschaal lijn twee valt uit bij ploegstart.',
      en: 'Wednesday afternoon the IT administrator sees the pattern: three incidents, always around six. That becomes one problem: scale link line two fails at shift start.' },
    { nl: 'Donderdag blijkt de oorzaak een geplande back-up om zes uur, die de koppeling blokkeert. De back-up naar vier uur verplaatsen is een wijziging, die eerst wordt besproken en gepland.',
      en: 'On Thursday the cause turns out to be a scheduled backup at six that blocks the link. Moving the backup to four is a change, which is first discussed and planned.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, no
// digits in the voice, and none of the words espeak-ng misreads (see above);
// checked on the text after the SAY rules, so a word a rule rewrites passes
// and a misread one fails the build
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = {
  nl: /\b(PeopleCert|change enablement|change control|printerdriver|Lean-blik|etiketsoftware)\b|(^|[.?!;]\s)Eén\b/i,
  en: /\bCI\b/,
};
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const said = sayable(plainSay(line[lang]), lang);
  if (/[/&×÷=+()“”"‘…%€<>~≈−]|:\S/.test(said)) throw new Error(`narration: a symbol the voice reads aloud in "${said.slice(0, 50)}"`);
  if (/\d/.test(said)) throw new Error(`narration: a number in digits in "${said.slice(0, 50)}"`);
  if (MISREAD[lang].test(said)) throw new Error(`narration: "${MISREAD[lang].exec(said)[0]}" is misread by the ${lang} voice in "${said.slice(0, 60)}"`);
}
// each scene's length from its share of the narration (the longer of nl and
// en, at the kit's 2.5 words a second), never shorter than its captions need;
// the whole as long as the narration estimate, within the 300 s cap, no padding
{
  const said = SAY.map((s) => Math.max(...['nl', 'en'].map((lang) => s.reduce((a, l) => a + wordsOf(plainSay(l[lang])), 0))));
  const all = said.reduce((a, b) => a + b, 0);
  const TOTAL = Math.min(MAX_TOTAL, Math.round(all / NARRATION_WPS));
  spec.scenes.forEach((s, si) => {
    const cap = Math.max(...['nl', 'en'].map((lang) => minSceneDur(wordsOf(s.beats.map((b) => plainSay(b[lang])).join(' ')) + 4)));
    s.dur = Math.max(Math.ceil(cap), Math.floor((said[si] / all) * TOTAL));
  });
  // the seconds lost to rounding down go to the scenes that lost the most
  const left = TOTAL - spec.scenes.reduce((a, s) => a + s.dur, 0);
  spec.scenes.map((s, si) => [si, (said[si] / all) * TOTAL - s.dur]).sort((x, y) => y[1] - x[1])
    .slice(0, Math.max(0, left)).forEach(([si]) => { spec.scenes[si].dur += 1; });
  const total = spec.scenes.reduce((a, s) => a + s.dur, 0);
  if (total > MAX_TOTAL) throw new Error(`film is ${total} s, over ${MAX_TOTAL} (words per scene ${said.join(' ')}, all ${all})`);
}
// each beat's still (reduced motion) sits late in its own share of the scene;
// and every beat holds at least 4 s in both languages, so a card-only point is
// on screen long enough to read
{
  const resolved = resolveFilm(spec, lessons);
  resolved.scenes.forEach((rs, si) => {
    const st = beatStarts(rs, 'nl');
    spec.scenes[si].beats.forEach((b, bi) => {
      const a0 = st[bi] / rs.dur;
      const a1 = bi + 1 < st.length ? st[bi + 1] / rs.dur : 1;
      b.still = Math.round((a0 + 0.86 * (a1 - a0)) * 1000) / 1000;
    });
    for (const lang of ['nl', 'en']) {
      const s2 = beatStarts(rs, lang);
      s2.forEach((t, bi) => { const len = (bi + 1 < s2.length ? s2[bi + 1] : rs.dur) - t; if (len < 4) FAILS.push(`${rs.id} beat ${bi + 1} (${lang}) holds ${len.toFixed(1)} s, under 4 s`); });
    }
  });
  if (FAILS.length) throw new Error(`pacing:\n  ${FAILS.join('\n  ')}`);
}

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="jij"],[data-cue="admin"],[data-cue="agent"],[data-cue="teamlead"])';
const css = PM_CSS + `
.iso{--pl-red:#E0605A;--pl-green:#5FB37A}
.iso[data-theme="light"]{--pl-red:#C0392B;--pl-green:#2E8049}
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-badt{fill:var(--pl-red);font-family:var(--fp-sans);font-weight:700}
.pm-ring{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:1}
.pm-blk{fill:var(--anatomy-hi);stroke:none}
.pm-note{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.6}
.pm-note2{fill:var(--fp-accent);stroke:none;opacity:.85}
.pm-red{fill:var(--pl-red);stroke:none}
.pm-loop{fill:none;stroke:var(--anatomy-hi);stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round}
.pm-redp{fill:none;stroke:var(--pl-red);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.pm-bdash{fill:none;stroke:var(--anatomy-mid);stroke-width:1;stroke-dasharray:2.4 1.8}
.pm-lamp{fill:var(--anatomy-mid);stroke:var(--anatomy-lo);stroke-width:.4}
.pm-run{fill:var(--fp-accent);stroke:none}
.pm-ok{fill:var(--pl-green);stroke:none}
.pm-bad{fill:var(--pl-red);stroke:none}
.pm-link{fill:none;stroke:var(--anatomy-mid);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
[data-k="linkp"][data-bad] .pm-link{stroke:var(--pl-red);stroke-dasharray:5 4}
[data-cue][data-on] .pm-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-ring,[data-cue][data-on] .pm-note,[data-cue][data-on] .pm-loop,[data-cue][data-on] .pm-bdash{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-blk{fill:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.run.conflict) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
`;

const label = {
  nl: 'De IT-kant van een fabriek. Achterin een serverkast voor het MES met een back-upkast ernaast, elk met een lampje erop. Een kabel over de vloer, de koppeling, loopt naar lijn 2 vooraan: een korte band met een controleweegschaal en een etiketprinter, elk met een lampje. Een lampje brandt rood bij een storing en groen als het weer werkt; de koppeling kleurt rood en gestreept als hij uitvalt. Links de servicedesk: een bureau met een laptop en een telefoon, en de medewerker erachter. Bij de serverkast de IT-beheerder, bij de lijn de teamleider van de vloer. Aan de achterwand een whiteboard met alleen vormen: drie tekens voor incident, probleem en wijziging, tweeënvijftig streepjes voor een jaar printerstoringen, twee lussen voor de Lean-blik, en de week van het voorbeeld. Jij, de adviseur in petrol, staat bij het bord. Rechts een paneel met per scène een kaart, gemarkeerd als voorbeeld of schema: ITIL, het incident, het probleem, de wijziging, de Lean-blik, en de weegschaal van de vleeswarenfabriek.',
  en: 'The IT side of a plant. At the back a server rack for the MES with a backup unit beside it, each with a small lamp on top. A cable across the floor, the link, runs to line 2 at the front: a short conveyor with a checkweigher and a label printer, each with a lamp. A lamp turns red at an outage and green when things work again; the link turns red and dashed when it fails. At the left the service desk: a desk with a laptop and a phone, and the agent behind it. By the rack the IT administrator, by the line the team lead from the floor. On the back wall a whiteboard with shapes only: three signs for incident, problem and change, fifty-two ticks for a year of printer failures, two loops for the Lean view, and the example\'s week. You, the consultant in petrol, stand at the board. At the right a panel with one card per scene, marked as example or diagram: ITIL, the incident, the problem, the change, the Lean view, and the cooked-meats plant\'s scale.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  const words = (lang) => data.scenes.reduce((a, s) => a + s.beats.reduce((n, b) => n + b.voice[lang].split(/\s+/).filter(Boolean).length, 0), 0);
  console.log(`narration words: nl ${words('nl')}, en ${words('en')}`);
  // every font size on the stage: drawing and script
  const sizes = new Set([...`${svg}\n${readFileSync(join(HERE, 'stage.js'), 'utf8')}`.matchAll(/font-size="(\d+)"/g)].map((m) => Number(m[1])));
  if ([...sizes].some((s) => s < 22)) throw new Error(`stage text under 22 units: ${[...sizes].join(', ')}`);
  console.log(`stage font sizes: ${[...sizes].join(', ')}`);
}

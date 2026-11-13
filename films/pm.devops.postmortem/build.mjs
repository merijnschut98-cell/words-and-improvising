// Dev tool, not shipped. Builds the explainer film "De post-mortem / The
// post-mortem" for the Projects course: pm.devops.postmortem (level 3 of the
// topic IT-servicemanagement en incidenten, in DevOps en levering).
//
//   node films/pm.devops.postmortem/build.mjs            build the page
//   node films/pm.devops.postmortem/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.devops.postmortem.html: one offline page
// with the anatomy kit, the stage script and the player inlined. A film that
// will be rendered to video (Merijn, 2026-11-12: render every reviewed pm
// film), so all stage and card text is 22 units (films/_kit/build-film.mjs).
// The companion of pm.devops.incident (level 1 of the same topic, its own
// film): the same room, the IT side of a plant, with the MES rack at the back,
// the link on the floor to the line, the service desk at the left and the same
// people, so a learner who saw the incident film knows where to look. That film
// is built in parallel and not yet on main, so nothing is imported from it; the
// few pieces this film shares with it (the panel and card helpers, the path
// compaction, the lamps) are copied into this folder.
//
// The film follows the lesson's own order: the post-mortem (s1), blameless
// (s2), the timeline and the 5 whys (s3), workaround and known error (s4), how
// many post-mortems and the follow-up (s5), then the worked example: the
// question (s6) and its answer (s7). A lesson with a film no longer shows its
// worked example (v16 notes), so the film carries the whole teach text and the
// worked example, question and answer.
//
// Checklist (lesson point: scene and beat; "card" = on the card as well):
//   teach 1: a post-mortem, also incident review, a structured discussion
//     after a major outage; the goal: understanding what happened, why, and
//     what changes so it does not come back (s1 b1); the result: a short
//     document with a timeline, causes and actions with an owner (s1 b2);
//     Google made the approach widely known in the book Site Reliability
//     Engineering (2016), with a chapter on postmortem culture (s1 b3)
//   teach 2: the core: the discussion is blameless; look for what in the
//     system made the mistake possible, not who made it (s2 b1); the wrong
//     button pressed because the button was there, the procedure was unclear
//     or it was busy (s2 b2); not the same as no accountability: whoever
//     deliberately breaks rules is held to account (s2 b3); an ordinary slip
//     is information, not guilt (s2 b4)
//   teach 3: the timeline is the backbone: minute by minute what happened,
//     what people saw and what they did (s3 b1); then causes, e.g. with the 5
//     whys: asking why again and again until you reach something you can
//     change (s3 b2); Taiichi Ohno made the method known at Toyota (s3 b3);
//     careful: complex outages often have several contributing causes, not one
//     root (s3 b4)
//   teach 4: two ITIL words; a workaround, a temporary way to keep working
//     while the real cause is not yet solved (s4 b1), e.g. restarting the link
//     by hand every morning (s4 b2); a known error, a problem whose cause is
//     known but that has not been solved yet (s4 b3); recorded with the
//     workaround, so the service desk knows straight away what to do at the
//     next report (s4 b4)
//   teach 5: what experts argue about: how many post-mortems; for every outage
//     too much time, only for the biggest you miss patterns (s5 b1); many teams
//     agree a threshold, e.g. priority 1 or every outage that stops a line for
//     more than an hour (s5 b2); the weakest point is usually the follow-up:
//     actions without an owner and date (s5 b3); the sharp question: which
//     actions from the last post-mortem are done? (s5 b4)
//   example, text: a soft-drinks maker, the MES (the system that tracks
//     orders and production on the floor) down for 3 hours on Saturday
//     morning; you facilitate the post-mortem (s6 b1); timeline: 05:50 a
//     scheduled renewal of the server's certificate, 06:00 the morning shift
//     cannot log in (s6 b2); 06:20 the on-call team is phoned, 07:40 the cause
//     found, 09:00 everything works again (s6 b3); why 1: why could nobody log
//     in? the new certificate was not recognised by the scanners on the line
//     (s6 b4); why 2: why not recognised? the scanners had an old list of
//     trusted certificates (s6 b5)
//   example, ask: continue with why 3 and 4, name a workaround and two actions
//     with an owner (s6 b6, with a pause to think: the scene's last beat)
//   example, reveal: why 3: why was that list old? the scanners fall under OT
//     and were never included in the IT updates (s7 b1); why 4: why not? no
//     overview of which devices depend on which certificates, and IT and OT
//     plan their changes separately (s7 b2); workaround: at a certificate
//     change, first update the list on the scanners (s7 b3); actions: the OT
//     administrator makes an overview of the dependencies within a month; the
//     IT manager brings OT into the change meeting from now on (s7 b4); no
//     culprit: the administrator who did the update at 05:50 followed the
//     procedure (s7 b5)
//   Not in the film: the lesson's pre and recall questions, its "said" line,
//   situation and sayIt (practice, not teach text).
//
// Facts, credited only as the lesson words them (checked 2026-11-13): Google's
// book Site Reliability Engineering appeared in 2016 (O'Reilly) with a chapter
// "Postmortem Culture: Learning from Failure"; the 5 whys are generally
// credited to Toyota, where Taiichi Ohno made the method known (Sakichi Toyoda
// is often named as its origin, which the lesson does not claim, so the film
// does not either). The film says only "Google maakte de aanpak breed bekend
// in het boek Site Reliability Engineering, uit 2016, met een hoofdstuk over
// een postmortemcultuur" and "Taiichi Ohno maakte die methode bekend bij
// Toyota". The film adds no Lean comparison of its own; the 5 whys are named
// as the lesson names them. The plant, its times and its people are the
// lesson's own illustration (06:00 to 09:00 is the 3 hours, asserted below).
// The room is the incident film's cooked-meats plant drawn again; the example
// is the lesson's soft-drinks maker, and the narration says so.
//
// The drawing is the shared pm world (films/_pm/world.mjs, read-only here), in
// the incident film's style (the same projection, lamps, panel and cards): a
// room with a whiteboard on the back wall that carries shapes only (no text,
// so nothing on the stage is under 22 units): the post-mortem document, a row
// of buttons, a timeline, the chain of whys, a detour for the workaround, a
// pinned record for the known error, outage bars with a threshold and the list
// of actions. At the back the MES rack with a lamp on top; a cable on the
// floor, the link, runs from the rack to the line at the front, a short
// conveyor with two scanners over the belt, each with a lamp. At the left the
// service desk: a desk with a laptop and a phone. People: you (the consultant,
// at the board), the IT administrator, the service desk agent and the OT
// administrator (the Scrum film's cast, pm.agile.scrum/cast.mjs, imported, not
// edited) and the team lead of the morning shift at the line. A lamp turns red
// at an outage and green when it works again; the link turns red and dashed
// while it is down. A panel at the right, in stage space, carries one card per
// scene, labelled "schema" or "voorbeeld".
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below), and so are the people, the rack,
// the link, the line, the scanners, the desk and each layer of the board.
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
// fails if it drifts); the {n:...} number is then checked against the Dutch
// lesson text by defineFilm.
const PM = 'pm.devops.postmortem';
const lessons = await allLessons();
const FAILS = [];
const assert = (ok, what) => { if (!ok) FAILS.push(what); };
const textOf = (id, lang) => { const l = lessons[lang].get(id); return `${l.teach.join('\n')}\n${l.example.text}\n${l.example.ask || ''}\n${l.example.reveal || ''}`; };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(PM, ['Een post-mortem (ook incidentreview) is een gestructureerde bespreking na een grote storing', 'begrijpen wat er gebeurde, waarom, en wat er verandert zodat het niet terugkomt',
  'een kort document met een tijdlijn, oorzaken en acties met een eigenaar', 'Google maakte de aanpak breed bekend in het boek Site Reliability Engineering (2016), met een hoofdstuk over een postmortemcultuur',
  'de bespreking schuldvrij (blameless) is: je zoekt naar wat in het systeem de fout mogelijk maakte, niet naar wie hem maakte',
  'Iemand die de verkeerde knop indrukte, deed dat omdat de knop daar zat, de procedure onduidelijk was of het druk was',
  'Dat is niet hetzelfde als geen verantwoordelijkheid. Wie bewust regels overtreedt, wordt daarop aangesproken', 'een gewone vergissing is informatie, geen schuld',
  'Een tijdlijn is de ruggengraat: minuut voor minuut wat er gebeurde, wat mensen zagen en wat ze deden', 'met 5 keer waarom (5 Whys)',
  'steeds opnieuw “waarom?” vragen tot je bij iets komt dat je kunt veranderen', 'Taiichi Ohno maakte die methode bekend bij Toyota',
  'bij complexe storingen zijn er vaak meerdere bijdragende oorzaken, niet één wortel', 'Twee ITIL-woorden helpen',
  'Een workaround: een tijdelijke manier om verder te werken terwijl de echte oorzaak nog niet is opgelost', 'de koppeling elke ochtend handmatig herstarten',
  'Een bekende fout (known error): een probleem waarvan de oorzaak bekend is, maar dat nog niet is opgelost', 'zodat de servicedesk bij de volgende melding meteen weet wat te doen',
  'hoeveel post-mortems doe je? Bij elke storing kost het te veel tijd; alleen bij de grootste mis je patronen', 'Veel teams spreken een drempel af, bijvoorbeeld bij prioriteit 1 of bij elke storing die een lijn langer dan een uur stillegt',
  'Het zwakste punt is meestal de opvolging: acties zonder eigenaar en datum', '“Welke acties uit de vorige post-mortem zijn af?”',
  'Bij een fabrikant van frisdrank lag het MES (MES: het systeem dat orders en productie op de vloer bijhoudt) op zaterdagochtend 3 uur stil', 'Je begeleidt de post-mortem',
  '05:50 een geplande update van het certificaat van de server', '06:00 de ochtendploeg kan niet inloggen', '06:20 de storingsdienst wordt gebeld', '07:40 de oorzaak gevonden', '09:00 alles werkt weer',
  'Waarom 1: waarom kon niemand inloggen? Het nieuwe certificaat werd niet herkend door de scanners op de lijn', 'Waarom 2: waarom werd het niet herkend? De scanners hadden een oude lijst met vertrouwde certificaten',
  'Ga verder met waarom 3 en 4, noem een workaround en twee acties met eigenaar',
  'Waarom 3: waarom was die lijst oud? De scanners vallen onder OT en zijn nooit meegenomen in de IT-updates',
  'Waarom 4: waarom niet? Er is geen overzicht van welke apparaten van welke certificaten afhangen, en IT en OT plannen hun wijzigingen apart',
  'Workaround: bij een certificaatwissel eerst de lijst op de scanners bijwerken', 'OT-beheerder maakt binnen een maand een overzicht van de afhankelijkheden',
  'IT-manager zet OT voortaan in het wijzigingsoverleg', 'Geen schuldige: de beheerder die om 05:50 de update deed, volgde de procedure']);
says(PM, ['A post-mortem (also incident review)', 'in the book Site Reliability Engineering (2016), with a chapter on postmortem culture', 'the discussion is blameless',
  'with the 5 Whys', 'Taiichi Ohno made the method known at Toyota', 'not one root', 'A known error: a problem whose cause is known',
  'for priority 1 or for every outage that stops a line for more than an hour', 'At a soft-drinks manufacturer', 'the IT manager brings OT into the change meeting from now on',
  'No culprit: the administrator who did the update at 05:50 followed the procedure'], 'en');
assert(lessons.nl.get(PM).terms.map((t) => t.term).join() === 'Post-mortem,Schuldvrij,5 keer waarom,Workaround,Bekende fout', 'the five terms of postmortem');
assert(lessons.en.get(PM).terms.map((t) => t.term).join() === 'Post-mortem,Blameless,5 Whys,Workaround,Known error', 'the five English terms of postmortem');
for (const lang of ['nl', 'en']) assert(lessons[lang].get(PM).film === PM, `${PM} (${lang}) wires this film`);
// the example's morning, in minutes after midnight
const T = { cert: 5 * 60 + 50, down: 6 * 60, call: 6 * 60 + 20, found: 7 * 60 + 40, up: 9 * 60 };
assert(T.up - T.down === 3 * 60, 'the MES was down for 3 hours: 06:00 to 09:00');
assert(T.cert < T.down && T.down < T.call && T.call < T.found && T.found < T.up, 'the timeline runs in order');
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
const LAYERS = ['bDoc', 'bKnob', 'bTl', 'bWhy', 'bWa', 'bKe', 'bBars', 'bActs'];
const boardLayers = `<g transform="${BOARD.face}">${LAYERS.map((c) => cueG(c, g(c, ''))).join('')}</g>`;
const AREA = { u0: r1(BA.x0 + 6), u1: r1(BA.x1 - 6), v0: r1(-BA.z1 + 6), v1: r1(-BA.z0 - 6) };

// the MES: a server rack against the back wall at the right, rows of lights on
// its front, a lamp on top
const RACK = { x: 264, y: 10, w: 28, d: 28, h: 124 };
const rack = w.box({ x: RACK.x, y: RACK.y, w: RACK.w, d: RACK.d, r: 1 }, 0, RACK.h, { tone: 'lo' }, { steps: 3, bevel: 0.4,
  extra: k.dotsSvg([0, 1, 2, 3, 4, 5, 6].flatMap((row) => [0, 1, 2, 3].map((c) => w.at([RACK.x + 6 + c * 5.4, RACK.y + RACK.d + 0.2, 30 + row * 12]))), { size: 0.55, tone: 'hi' }) });

// the line: a stand with a belt, two crates on it and two scanners on posts,
// each with a head over the belt
const LINE = { x: 112, y: 150, w: 150, d: 28, h: 66 };
const LZ = LINE.h;
const SCN = [140, 204];
const scanner = (sx) => w.post(sx, LINE.y + 3, 1.4, LZ, LZ + 30, { tone: 'mid' }, 10)
  + w.box({ x: sx - 7, y: LINE.y + 1, w: 14, d: 16, r: 1 }, LZ + 28, LZ + 36, { tone: 'lo' }, { steps: 2, bevel: 0.4 })
  + w.box({ x: sx - 5, y: LINE.y + 15, w: 10, d: 2, r: 0.4 }, LZ + 26, LZ + 28, { tone: 'hi' }, { steps: 1 });
const belt = w.box({ x: LINE.x + 2, y: LINE.y + 5, w: LINE.w - 4, d: 18, r: 1 }, LZ, LZ + 4, { tone: 'lo' }, { steps: 2 })
  + w.box({ x: 160, y: 158, w: 14, d: 12, r: 0.8 }, LZ + 4, LZ + 13, { tone: 'hi' }, { steps: 2 })
  + w.box({ x: 226, y: 158, w: 14, d: 12, r: 0.8 }, LZ + 4, LZ + 13, { tone: 'hi' }, { steps: 2 });
const stand = w.table({ x: LINE.x, y: LINE.y, w: LINE.w, d: LINE.d, h: LZ });

// the lamps: a ring on top of the rack and on each scanner's head
const lampAt = [[RACK.x + RACK.w / 2, RACK.y + RACK.d / 2, RACK.h, 5], [SCN[0], LINE.y + 9, LZ + 36, 3.2], [SCN[1], LINE.y + 9, LZ + 36, 3.2]];
const LAMPS = lampAt.map(([x, y, z, r]) => k.pathOf(k.circleRing(x, y, r, 20).map(([px, py]) => w.at([px, py, z + 0.2]).map(r1)), true));
const LAMPK = ['lampMes', 'lampS1', 'lampS2'];

// the link: a cable on the floor from the rack to the stand of the line
const LINK = [[RACK.x + RACK.w / 2, RACK.y + RACK.d + 2, 0.4], [RACK.x + RACK.w / 2, 112, 0.4], [180, 112, 0.4], [180, LINE.y + 2, 0.4], [180, LINE.y + 2, LZ - 4]];
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
  w.person({ x: 34, y: 48, role: 'jij', along: 'x' }),
  scrumPerson(w, k, G, P, { x: 238, y: 62, key: 'admin', look: 'sm', along: 'x' }),
  scrumPerson(w, k, G, P, { x: 92, y: 118, key: 'ot', look: 'dev2', along: 'x' }),
  scrumPerson(w, k, G, P, { x: 50, y: 156, key: 'agent', look: 'dev', along: 'x' }),
  cueG('desk', desk),
  w.person({ x: 244, y: 126, role: 'teamlead', along: 'x' }),
  cueG('line', stand + belt
    + cueG('scanners', scanner(SCN[0]) + g(LAMPK[1], '') + scanner(SCN[1]) + g(LAMPK[2], ''))),
].join('');
for (const r of ['jij', 'admin', 'ot', 'agent', 'teamlead', 'board', 'link', 'mes', 'desk', 'line', 'scanners', ...LAYERS]) assert(world.includes(`data-cue="${r}"`), `${r} is a cue group`);
if (FAILS.length) throw new Error(`model:\n  ${FAILS.join('\n  ')}`);

// ---------------------------------------------------------------- the panel (stage space)
// One card per scene, drawn by stage.js into these groups; each block of a card
// sits in its own cue group, so a beat's focus (and a term's cue) can light it.
const PX = 322;
const PW = 308;
const CUES = ['pm', 'doc', 'sre',
  'blame', 'button', 'acct', 'slip',
  'tl', 'why', 'ohno', 'many',
  'wa', 'waEx', 'ke', 'keRec',
  'debate', 'thr', 'weak', 'ask',
  'ex', 't1', 't2', 'w1', 'w2', 'q',
  'w3', 'w4', 'wa2', 'act', 'nob'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));
// Static paths with relative line-tos (the helper of pm.devops.pipeline, as the
// incident film copies it): the same points, fewer bytes; each rewrite is read back.
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
const LINE_AT = w.at([190, 150, LZ]).map(r1);
const LCAM = (s) => [LINE_AT[0], LINE_AT[1], s];
const DESK_AT = w.at([50, 196, DESK.h]).map(r1);
const DCAM = (s) => [DESK_AT[0], DESK_AT[1], s];
const ALL = [160, 205, 1];
const CAM = [
  { from: ALL, to: BCAM(1.14) },
  { from: BCAM(1.08), to: [160, 205, 1.06] },
  { from: BCAM(1.1), to: BCAM(1.25) },
  { from: LCAM(1.12), to: DCAM(1.22) },
  { from: BCAM(1.08), to: [160, 205, 1.04] },
  { from: [160, 205, 1.02], to: LCAM(1.16) },
  { from: LCAM(1.12), to: BCAM(1.14) },
];

// ---------------------------------------------------------------- the film
const C = { CUES, AREA, LAMPS, LAMPK, T };
const sc = (id, level, title, beats) => ({ id, lesson: PM, level, still: 0.9, title, beats });
const spec = {
  id: PM,
  title: { nl: 'De post-mortem', en: 'The post-mortem' },
  lessons: [PM],
  strictFocus: true,
  scenes: [
    sc('s1', 3, { nl: 'De post-mortem', en: 'The post-mortem' }, [
      { nl: 'Een {t:Post-mortem|post-mortem}: bespreking na een grote storing. Wat gebeurde er, waarom, wat verandert er?', en: 'A {t:Post-mortem|post-mortem}: a discussion after a major outage. What happened, why, and what changes?', cue: { 'Post-mortem': 'pm' }, focus: ['pm', 'board'] },
      { nl: 'Het resultaat: een kort document met tijdlijn, oorzaken en acties met een eigenaar.', en: 'The result: a short document with a timeline, causes and actions with an owner.', focus: ['doc', 'bDoc'] },
      { nl: 'Google maakte het breed bekend: het boek Site Reliability Engineering, uit 2016.', en: 'Google made it widely known: the book Site Reliability Engineering, from 2016.', focus: 'sre' },
    ]),
    sc('s2', 3, { nl: 'Schuldvrij', en: 'Blameless' }, [
      { nl: 'De kern: {t:Schuldvrij|schuldvrij}. Wat in het systeem maakte de fout mogelijk, niet wie?', en: 'The core: {t:Blameless|blameless}. What in the system made the mistake possible, not who?', cue: { Schuldvrij: 'blame' }, focus: ['blame', 'bKnob'] },
      { nl: 'De verkeerde knop: hij zat daar, de procedure was onduidelijk, of het was druk.', en: 'The wrong button: it was there, the procedure was unclear, or it was busy.', focus: ['button', 'bKnob', 'admin'] },
      { nl: 'Wel verantwoordelijkheid: wie bewust regels overtreedt, wordt daarop aangesproken.', en: 'Still accountability: whoever deliberately breaks rules is held to account.', focus: 'acct' },
      { nl: 'Maar een gewone vergissing is informatie, geen schuld.', en: 'But an ordinary slip is information, not guilt.', focus: ['slip', 'admin'] },
    ]),
    sc('s3', 3, { nl: 'Tijdlijn en oorzaken', en: 'Timeline and causes' }, [
      { nl: 'De tijdlijn is de ruggengraat: minuut voor minuut wat er gebeurde, wat men zag en deed.', en: 'The timeline is the backbone: minute by minute what happened, what people saw and did.', focus: ['tl', 'bTl'] },
      { nl: 'Oorzaken zoeken met {t:5 keer waarom|5 keer waarom}: vraag waarom, tot je iets kunt veranderen.', en: 'Causes with the {t:5 Whys|5 Whys}: ask why, until you reach something you can change.', cue: { '5 keer waarom': 'why' }, focus: ['why', 'bWhy'] },
      { nl: 'Die methode werd bekend door Taiichi Ohno, bij Toyota.', en: 'The method was made known by Taiichi Ohno, at Toyota.', focus: 'ohno' },
      { nl: 'Pas op: bij complexe storingen vaak meerdere bijdragende oorzaken, niet één wortel.', en: 'Careful: complex outages often have several contributing causes, not one root.', focus: ['many', 'bWhy'] },
    ]),
    sc('s4', 3, { nl: 'Workaround en bekende fout', en: 'Workaround and known error' }, [
      { nl: 'Twee ITIL-woorden. Een {t:Workaround|workaround}: tijdelijk verder werken, de oorzaak nog niet opgelost.', en: 'Two ITIL words. A {t:Workaround|workaround}: keep working for now, the cause not yet solved.', cue: { Workaround: 'wa' }, focus: ['wa', 'bWa'] },
      { nl: 'Bijvoorbeeld de koppeling elke ochtend handmatig herstarten.', en: 'For example, restarting the link by hand every morning.', focus: ['waEx', 'link', 'agent'] },
      { nl: 'Een {t:Bekende fout|bekende fout}: een probleem met bekende oorzaak, nog niet opgelost.', en: 'A {t:Known error|known error}: a problem whose cause is known, not yet solved.', cue: { 'Bekende fout': 'ke' }, focus: ['ke', 'bKe'] },
      { nl: 'Vastgelegd met de workaround, zodat de servicedesk bij de volgende melding weet wat te doen.', en: 'Recorded with the workaround, so the service desk knows what to do at the next report.', focus: ['keRec', 'bKe', 'agent', 'desk'] },
    ]),
    sc('s5', 3, { nl: 'Hoe vaak, en de opvolging', en: 'How often, and the follow-up' }, [
      { nl: 'Discussie: na elke storing kost het te veel tijd, alleen na de grootste mis je patronen.', en: 'Debated: after every outage it costs too much time, only after the biggest you miss patterns.', focus: ['debate', 'bBars'] },
      { nl: 'Veel teams spreken een drempel af: prioriteit 1, of een lijn langer dan een uur stil.', en: 'Many teams agree a threshold: priority 1, or a line stopped for more than an hour.', focus: ['thr', 'bBars', 'line'] },
      { nl: 'Het zwakste punt is meestal de opvolging: acties zonder eigenaar en datum.', en: 'The weakest point is usually the follow-up: actions without an owner and date.', focus: ['weak', 'bActs'] },
      { nl: 'Scherpe vraag: welke acties uit de vorige post-mortem zijn af?', en: 'Sharp question: which actions from the last post-mortem are done?', focus: ['ask', 'jij'] },
    ]),
    sc('s6', 3, { nl: 'Voorbeeld: het certificaat', en: 'Example: the certificate' }, [
      { nl: 'Bij een fabrikant van frisdrank lag het MES zaterdagochtend {n:3} uur stil. Jij begeleidt de post-mortem.', en: 'At a soft-drinks maker the MES was down for {n:3} hours on Saturday morning. You facilitate the post-mortem.', focus: ['ex', 'mes', 'jij'] },
      { nl: '05:50 een geplande update van het servercertificaat. 06:00 de ochtendploeg kan niet inloggen.', en: '05:50 a scheduled renewal of the server certificate. 06:00 the morning shift cannot log in.', focus: ['t1', 'bTl', 'mes', 'teamlead'] },
      { nl: '06:20 de storingsdienst wordt gebeld. 07:40 de oorzaak gevonden. 09:00 alles werkt weer.', en: '06:20 the on-call team is phoned. 07:40 the cause found. 09:00 everything works again.', focus: ['t2', 'bTl', 'admin'] },
      { nl: 'Waarom 1: waarom kon niemand inloggen? De scanners herkenden het nieuwe certificaat niet.', en: 'Why 1: why could nobody log in? The scanners did not recognise the new certificate.', focus: ['w1', 'bWhy', 'scanners'] },
      { nl: 'Waarom 2: waarom niet herkend? De scanners hadden een oude lijst met vertrouwde certificaten.', en: 'Why 2: why not recognised? The scanners had an old list of trusted certificates.', focus: ['w2', 'bWhy', 'scanners'] },
      { nl: 'Jouw beurt: waarom 3 en 4, een workaround, en twee acties met een eigenaar.', en: 'Your turn: why 3 and 4, a workaround, and two actions with an owner.', focus: ['q', 'jij'] },
    ]),
    sc('s7', 3, { nl: 'Het antwoord', en: 'The answer' }, [
      { nl: 'Waarom 3: waarom was die lijst oud? De scanners vallen onder OT, nooit in de IT-updates.', en: 'Why 3: why was that list old? The scanners fall under OT, never in the IT updates.', focus: ['w3', 'bWhy', 'scanners', 'ot'] },
      { nl: 'Waarom 4: geen overzicht van welke apparaten van welke certificaten afhangen; IT en OT plannen apart.', en: 'Why 4: no overview of which devices depend on which certificates; IT and OT plan apart.', focus: ['w4', 'bWhy'] },
      { nl: 'Workaround: bij een certificaatwissel eerst de lijst op de scanners bijwerken.', en: 'Workaround: at a certificate change, first update the list on the scanners.', focus: ['wa2', 'bWa', 'scanners'] },
      { nl: 'Acties: de OT-beheerder maakt binnen een maand een overzicht; de IT-manager zet OT in het wijzigingsoverleg.', en: 'Actions: the OT administrator makes an overview within a month; the IT manager brings OT into change meetings.', focus: ['act', 'bActs', 'ot'] },
      { nl: 'Geen schuldige: de beheerder die om 05:50 de update deed, volgde de procedure.', en: 'No culprit: the administrator who did the update at 05:50 followed the procedure.', focus: ['nob', 'admin'] },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson's teach
// text and worked example, so every point of the checklist above is said here.
// No symbol the voice would read aloud, no spoken parenthesis or quote; the
// lesson's asides in brackets are said as part of the sentence ("ook wel
// incidentreview", "schuldvrij, blameless"), and its English glosses that the
// captions already show (5 Whys, known error) are not said in Dutch. Dutch
// checked with espeak-ng phonemes through Piper's own bridge (nl_NL-alex,
// 2026-11-13). Read as written: post-mortem, gestructureerde, schuldvrij,
// ruggengraat, ITIL-woorden, servicedesk, frisdrank, certificaat, scanners,
// storingsdienst, OT, OT-beheerder, wijzigingsoverleg, the MES (the kit's
// letters rule) and IT-manager (as pm.agile.scrum and pm.run.escalation say
// it); Taiichi Ohno and Toyota go through the existing rules (Taitsjie Oono,
// Tojota). New SAY rules in films/_kit/timeline.mjs (tested; recomputed for
// every film: no other film's spoken text changes): incidentreview (rievjoe, as
// Sprint Review), Site Reliability Engineering, postmortemcultuur split at its
// head, blameless, workaround, and update as Dutch IT says it (updeet).
// English needs no rule. Years, times and numbers in words.
const SAY = [
  [ // s1 the post-mortem, its document, Google
    { nl: 'Een {t:Post-mortem|post-mortem}, ook wel incidentreview, is een gestructureerde bespreking na een grote storing. Het doel: begrijpen wat er gebeurde, waarom, en wat er verandert zodat het niet terugkomt.',
      en: 'A {t:Post-mortem|post-mortem}, also called an incident review, is a structured discussion after a major outage. The goal: understanding what happened, why, and what changes so it does not come back.' },
    { nl: 'Het resultaat is een kort document met een tijdlijn, oorzaken en acties met een eigenaar.',
      en: 'The result is a short document with a timeline, causes and actions with an owner.' },
    { nl: 'Google maakte de aanpak breed bekend in het boek Site Reliability Engineering, uit tweeduizend zestien, met een hoofdstuk over een postmortemcultuur.',
      en: 'Google made the approach widely known in the book Site Reliability Engineering, from twenty sixteen, with a chapter on postmortem culture.' },
  ],
  [ // s2 blameless, the button, accountability, a slip
    { nl: 'De kern is dat de bespreking {t:Schuldvrij|schuldvrij} is, blameless: je zoekt naar wat in het systeem de fout mogelijk maakte, niet naar wie hem maakte.',
      en: 'The core is that the discussion is {t:Blameless|blameless}: you look for what in the system made the mistake possible, not for who made it.' },
    { nl: 'Iemand die de verkeerde knop indrukte, deed dat omdat de knop daar zat, de procedure onduidelijk was of het druk was.',
      en: 'Someone who pressed the wrong button did so because the button was there, the procedure was unclear or it was busy.' },
    { nl: 'Dat is niet hetzelfde als geen verantwoordelijkheid. Wie bewust regels overtreedt, wordt daarop aangesproken.',
      en: 'That is not the same as no accountability. Whoever deliberately breaks rules is held to account.' },
    { nl: 'Maar een gewone vergissing is informatie, geen schuld.',
      en: 'But an ordinary slip is information, not guilt.' },
  ],
  [ // s3 the timeline, the 5 whys, Ohno, several causes
    { nl: 'Een tijdlijn is de ruggengraat: minuut voor minuut wat er gebeurde, wat mensen zagen en wat ze deden.',
      en: 'A timeline is the backbone: minute by minute what happened, what people saw and what they did.' },
    { nl: 'Daarna zoek je oorzaken, bijvoorbeeld met {t:5 keer waarom|5 keer waarom}: steeds opnieuw waarom vragen, tot je bij iets komt dat je kunt veranderen.',
      en: 'Then you look for causes, for example with the {t:5 Whys|5 Whys}: asking why again and again, until you reach something you can change.' },
    { nl: 'Taiichi Ohno maakte die methode bekend bij Toyota.',
      en: 'Taiichi Ohno made the method known at Toyota.' },
    { nl: 'Pas op: bij complexe storingen zijn er vaak meerdere bijdragende oorzaken, niet één wortel.',
      en: 'Careful: complex outages often have several contributing causes, not one root.' },
  ],
  [ // s4 workaround, its example, known error, recorded
    { nl: 'Twee ITIL-woorden helpen. Een {t:Workaround|workaround} is een tijdelijke manier om verder te werken, terwijl de echte oorzaak nog niet is opgelost.',
      en: 'Two ITIL words help. A {t:Workaround|workaround} is a temporary way to keep working, while the real cause is not yet solved.' },
    { nl: 'Bijvoorbeeld de koppeling elke ochtend handmatig herstarten.',
      en: 'For example, restarting the link by hand every morning.' },
    { nl: 'Een {t:Bekende fout|bekende fout} is een probleem waarvan de oorzaak bekend is, maar dat nog niet is opgelost.',
      en: 'A {t:Known error|known error} is a problem whose cause is known, but that has not been solved yet.' },
    { nl: 'Die leg je vast met de workaround erbij, zodat de servicedesk bij de volgende melding meteen weet wat te doen.',
      en: 'You record it with the workaround, so the service desk knows straight away what to do at the next report.' },
  ],
  [ // s5 how many, the threshold, the follow-up, the sharp question
    { nl: 'Waar experts over discussiëren: hoeveel post-mortems doe je? Bij elke storing kost het te veel tijd. Alleen bij de grootste mis je patronen.',
      en: 'What experts argue about: how many post-mortems do you do? For every outage it costs too much time. Only for the biggest, you miss patterns.' },
    { nl: 'Veel teams spreken een drempel af, bijvoorbeeld bij prioriteit een, of bij elke storing die een lijn langer dan een uur stillegt.',
      en: 'Many teams agree a threshold, for example for priority one, or for every outage that stops a line for more than an hour.' },
    { nl: 'Het zwakste punt is meestal de opvolging: acties zonder eigenaar en datum.',
      en: 'The weakest point is usually the follow-up: actions without an owner and date.' },
    { nl: 'Een scherpe vraag: welke acties uit de vorige post-mortem zijn af?',
      en: 'A sharp question: which actions from the last post-mortem are done?' },
  ],
  [ // s6 the example: the morning, two whys, the question
    { nl: 'Een voorbeeld. Bij een fabrikant van frisdrank lag het MES, het systeem dat orders en productie op de vloer bijhoudt, op zaterdagochtend drie uur stil. Jij begeleidt de post-mortem.',
      en: 'An example. At a soft-drinks manufacturer the MES, the system that tracks orders and production on the floor, was down for three hours on Saturday morning. You facilitate the post-mortem.' },
    { nl: 'De tijdlijn. Om tien voor zes een geplande update van het certificaat van de server. Om zes uur kan de ochtendploeg niet inloggen.',
      en: 'The timeline. At ten to six, a scheduled renewal of the server’s certificate. At six, the morning shift cannot log in.' },
    { nl: 'Om twintig over zes wordt de storingsdienst gebeld. Om twintig voor acht is de oorzaak gevonden, en om negen uur werkt alles weer.',
      en: 'At twenty past six the on-call team is phoned. At twenty to eight the cause is found, and at nine everything works again.' },
    { nl: 'Waarom één: waarom kon niemand inloggen? Het nieuwe certificaat werd niet herkend door de scanners op de lijn.',
      en: 'Why one: why could nobody log in? The new certificate was not recognised by the scanners on the line.' },
    { nl: 'Waarom twee: waarom werd het niet herkend? De scanners hadden een oude lijst met vertrouwde certificaten.',
      en: 'Why two: why was it not recognised? The scanners had an old list of trusted certificates.' },
    { nl: 'Nu jij. Ga verder met waarom drie en vier, noem een workaround en twee acties met een eigenaar. Denk even na.',
      en: 'Now you. Continue with why three and four, name a workaround and two actions with an owner. Think for a moment.' },
  ],
  [ // s7 the answer
    { nl: 'Waarom drie: waarom was die lijst oud? De scanners vallen onder OT, en zijn nooit meegenomen in de IT-updates.',
      en: 'Why three: why was that list old? The scanners fall under OT, and were never included in the IT updates.' },
    { nl: 'Waarom vier: waarom niet? Er is geen overzicht van welke apparaten van welke certificaten afhangen, en IT en OT plannen hun wijzigingen apart.',
      en: 'Why four: why not? There is no overview of which devices depend on which certificates, and IT and OT plan their changes separately.' },
    { nl: 'De workaround: bij een certificaatwissel eerst de lijst op de scanners bijwerken.',
      en: 'The workaround: at a certificate change, first update the list on the scanners.' },
    { nl: 'Twee acties. De OT-beheerder maakt binnen een maand een overzicht van de afhankelijkheden. De IT-manager zet OT voortaan in het wijzigingsoverleg.',
      en: 'Two actions. The OT administrator makes an overview of the dependencies within a month. The IT manager brings OT into the change meeting from now on.' },
    { nl: 'En geen schuldige: de beheerder die om tien voor zes de update deed, volgde de procedure.',
      en: 'And no culprit: the administrator who did the update at ten to six followed the procedure.' },
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
  nl: /\b(incidentreview|Site Reliability|postmortemcultuur|blameless|workaround|updates?|IT-updates|Taiichi|Toyota)\b|(^|[.?!;]\s)Eén\b/i,
  en: /\bCI\b/,
};
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const said = sayable(plainSay(line[lang]), lang);
  if (/[/&×÷=+()“”"‘…%€<>~≈−]|:\S/.test(said)) throw new Error(`narration: a symbol the voice reads aloud in "${said.slice(0, 50)}"`);
  // the one digit allowed: the term's own 5 (5 keer waarom, 5 Whys; the term must read as the lesson writes
  // it), which espeak-ng reads as vijf and five
  if (/\d/.test(said.replace(/\b5 (keer waarom|Whys)\b/g, ''))) throw new Error(`narration: a number in digits in "${said.slice(0, 50)}"`);
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
// and every beat holds at least 4 s in both languages, so a card is on screen
// long enough to read
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

const PEOPLE = ':is([data-cue="jij"],[data-cue="admin"],[data-cue="ot"],[data-cue="agent"],[data-cue="teamlead"])';
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
.pm-blk{fill:var(--anatomy-hi);stroke:none}
.pm-note{fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.6}
.pm-note2{fill:var(--fp-accent);stroke:none;opacity:.85}
.pm-red{fill:var(--pl-red);stroke:none}
.pm-grn{fill:var(--pl-green);stroke:none}
.pm-loop{fill:none;stroke:var(--anatomy-hi);stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round}
.pm-acc{fill:none;stroke:var(--fp-accent);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.pm-redp{fill:none;stroke:var(--pl-red);stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}
.pm-bdash{fill:none;stroke:var(--anatomy-mid);stroke-width:1;stroke-dasharray:2.4 1.8}
.pm-lamp{fill:var(--anatomy-mid);stroke:var(--anatomy-lo);stroke-width:.4}
.pm-run{fill:var(--fp-accent);stroke:none}
.pm-ok{fill:var(--pl-green);stroke:none}
.pm-bad{fill:var(--pl-red);stroke:none}
.pm-link{fill:none;stroke:var(--anatomy-mid);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
[data-k="linkp"][data-bad] .pm-link{stroke:var(--pl-red);stroke-dasharray:5 4}
[data-cue][data-on] .pm-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-note,[data-cue][data-on] .pm-loop,[data-cue][data-on] .pm-bdash{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-blk{fill:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.run.conflict) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
`;

const label = {
  nl: 'De IT-kant van een fabriek. Achterin een serverkast voor het MES met een lampje erop. Een kabel over de vloer, de koppeling, loopt naar de lijn vooraan: een korte band met twee scanners erboven, elk met een lampje. Een lampje brandt rood bij een storing en groen als het weer werkt; de koppeling kleurt rood en gestreept als hij uitvalt. Links de servicedesk: een bureau met een laptop en een telefoon, en de medewerker erachter. Bij het bord de IT-beheerder, achter de lijn de OT-beheerder en de teamleider van de ochtendploeg. Aan de achterwand een whiteboard met alleen vormen: het document van de post-mortem, een rij knoppen, een tijdlijn, de keten van waarom-vragen, een omweg voor de workaround, een vastgeprikte kaart voor de bekende fout, staven van storingen met een drempel en de lijst met acties. Jij, de adviseur in petrol, staat bij het bord. Rechts een paneel met per scène een kaart, gemarkeerd als voorbeeld of schema: de post-mortem, schuldvrij, tijdlijn en oorzaken, workaround en bekende fout, de opvolging, en het voorbeeld van het certificaat met zijn antwoord.',
  en: 'The IT side of a plant. At the back a server rack for the MES with a small lamp on top. A cable across the floor, the link, runs to the line at the front: a short conveyor with two scanners above it, each with a lamp. A lamp turns red at an outage and green when things work again; the link turns red and dashed when it fails. At the left the service desk: a desk with a laptop and a phone, and the agent behind it. By the board the IT administrator, behind the line the OT administrator and the team lead of the morning shift. On the back wall a whiteboard with shapes only: the post-mortem document, a row of buttons, a timeline, the chain of whys, a detour for the workaround, a pinned card for the known error, outage bars with a threshold and the list of actions. You, the consultant in petrol, stand at the board. At the right a panel with one card per scene, marked as example or diagram: the post-mortem, blameless, timeline and causes, workaround and known error, the follow-up, and the certificate example with its answer.',
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

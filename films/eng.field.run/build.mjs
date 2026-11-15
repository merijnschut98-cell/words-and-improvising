// Dev tool, not shipped. Builds the field film "De fabriek draaiend houden / Keeping the plant running"
// (eng.field.run), the fourth Engineering field film (v17, Task 13): the level above the module intros.
// It places the four modules of the zone (FIELDS in src/content/courses/index.js: flow, quality, maintenance,
// safety) on one road and says, per station, what it is for, what the part of the story needs from it, which
// two tools of the module you use there (named, not explained: the checkpoint rule of 14 Nov) and what goes
// wrong without it. The map, not a lesson: no calculations, no numbers.
//
//   node films/eng.field.run/build.mjs            build the page
//   node films/eng.field.run/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/eng.field.run.html: one offline page with the anatomy kit, the stage
// script and the player inlined. The index names it (the field's `film`), sw.js precaches it.
//
// The story continues eng.field.making, eng.field.energy and eng.field.digital: the filling unit stands on
// line 3 in hall B (a steel frame, a plate over the belt, a plastic cover, the tank behind it) and now has to
// run, shift after shift. You are the engineer on the shift and work with the team lead. Each station is one
// thing the shift needs:
//   s1 the opening: the unit runs and fills cartons from the tank; you and the team lead keep it going for a
//      whole shift; the shift needs four things; the road with four stations
//   s2 Capaciteit en flow (eng.flow): line 3 must make enough cartons for the customer; the customer sets the
//      pace and every minute of stoppage is a minute behind; takt time and a downtime log
//      (eng.flow.takt, eng.flow.downtime); without it nobody knows what pace to keep or where the minutes go
//   s3 Kwaliteit: de basis (eng.quality): every carton that leaves must be good; at the end of the belt a
//      table with a check sheet, a bad carton goes apart into the marked quarantine place; a check sheet and
//      a nonconformance report (eng.quality.datatools, eng.quality.nonconform); without it nobody knows what
//      goes wrong and a bad carton reaches the customer
//   s4 Onderhoud (eng.maintenance): the unit has to stay whole; at the start of the shift you walk a round
//      past it with the standard on its board, a deviation gets a tag, the rest goes in the CMMS on the
//      laptop; a CILT standard and the CMMS (eng.maintenance.cilt, eng.maintenance.cmms); without it wear
//      goes unnoticed until the line stops
//   s5 Veilig werken (eng.safety): when the unit jams someone has to get at it; you look around first, then
//      the energy goes off at the isolator in the cabinet with a lock and a tag; an LMRA and lockout-tagout
//      (eng.safety.lmra, eng.safety.loto); without it the unit can start while your hands are in it
//   s6 the shared Engineering map (the kit's mapScene, as the app draws it) with the four stations lit: the
//      whole map, the zone, then place by place at 1.5 (first and last topic of each), then back to the
//      zone for two beats on how they connect, and where to start
// How the stations connect: the order of the road is the order of the zone (level, then map position): the
// customer sets the pace (flow), quality makes sure every carton is good, maintenance keeps the unit whole
// and safety decides how you work on it; the closing says it in two beats.
// The tools come from the modules' own lessons (checked below), each a term of the lesson's glossary at Basis
// or Working knowledge level that no field film, module intro or other module of the Engineering index names
// as a term of its own: takt time and a downtime log (flow), a check sheet and a nonconformance report
// (quality; not the Pareto chart, which flow and quality both teach), a CILT standard and the CMMS
// (maintenance; not the work order, which maintenance and safety both teach), an LMRA and lockout-tagout
// (safety). Terms come from the field's lessons (the kit's field mode, films/_kit/build-film.mjs); the kit
// holds the film to its road (every module named in a caption of its own scene, in the order of the road,
// explained in two beats and lit, ending on the map with the field's places lit), to the narration guard
// and to the label fit.
//
// A film in the shared pm world (films/_pm/world.mjs, read-only): the people of the cast (you and the team
// lead), the table and the laptop, the room, and the conveyor, cabinet and floor mark of hall B from the
// pilot (films/pm.plan.intro/hall.mjs), imported. A panel at the right draws each station as four small
// schemas (what it is for, how it works, then one for each tool as it is named), two chips with the tools
// and a dashed card with what goes wrong without it.
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
import { hallWorld, HALL_CSS } from '../pm.plan.intro/hall.mjs';
import { FIELDS, MODULES } from '../../src/content/courses/index.js';
import engMap from '../../src/content/courses/maps/eng.js';
import { pathBox } from '../../src/content/courses/validate.js';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));



// ---------------------------------------------------------------- the field
// The road this film draws, asserted against the index (the build fails if the field's modules move), and the
// lessons' words the narration leans on: the lessons the tool names come from (the names are terms of those
// lessons) and the lessons for what each station is for and what goes wrong without it.
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const FIELD = FIELDS.find((f) => f.id === 'eng.field.run');
const ROAD = ['eng.flow', 'eng.quality', 'eng.maintenance', 'eng.safety'];
assert(JSON.stringify(FIELD.modules) === JSON.stringify(ROAD), 'the run field is the road flow, quality, maintenance, safety');
// A station label: the film names and draws "Kwaliteit" / "Quality" (the title "Kwaliteit: de basis" has a colon the
// voice does not say) and "Veilig werken" / "Safety on the floor" (the long title would leave no room in a caption of
// 110 characters); the module titles are unchanged (the kit's `label`, a shortening of the module's own title)
const LABELS = {
  'eng.quality': { nl: 'Kwaliteit', en: 'Quality' },
  'eng.safety': { nl: 'Veilig werken', en: 'Safety on the floor' },
};
const nameOf = (id, lang) => (LABELS[id] ? LABELS[id][lang] : MODULES.find((m) => m.id === id).title[lang]);
// the panel heading draws the station's name in at most two lines of the panel's width (the kit does not measure it)
for (const id of ROAD) for (const lang of ['nl', 'en']) {
  const t = nameOf(id, lang);
  const lines = wrapUnits(t, 284, CHAR_W);
  assert(lines.length <= 2 && lines.every((ln) => ln.split(' ').every((wd) => wrapUnits(wd, 284, CHAR_W).length === 1)), `the heading "${t}" (${lang}) does not fit two lines of 284 units`);
}
const lessons = await allLessons();
const misses = [];
const has = (id, list, lang = 'nl') => { const l = lessons[lang].get(id); const text = [l.title, ...l.teach, ...(l.terms || []).map((t) => `${t.term} ${t.def}`)].join('\n'); for (const s of list) if (!text.includes(s)) misses.push(`${id} (${lang}) no longer says "${s}"`); };
// every check below collects what the lessons no longer say, and the build fails with the list
// s2 flow: takt time is the pace the customer asks for, cycle time above takt means falling behind; a downtime log lists every stop with time, duration, machine and a reason code
has('eng.flow.takt', ['Takttijd (takt time) is het tempo dat de klant vraagt', 'Takt hangt af van de vraag, niet van de machine', 'Ligt de cyclustijd boven de takt, dan loop je bij elk product verder achter', 'Takttijd Netto beschikbare tijd gedeeld door de klantvraag']);
has('eng.flow.takt', ['Takt time is the pace the customer asks for', 'Takt is set by demand, not by the machine', 'If cycle time is above takt, you fall further behind with every part', 'Takt time Net available time divided by customer demand'], 'en');
has('eng.flow.downtime', ['OEE zegt hoeveel tijd je verliest, niet waarom', 'stilstandregistratie (downtime log): bij elke stop de begintijd, de duur, de machine en een oorzaakcode', 'Stilstandregistratie Een lijst van alle stops met tijd, duur, machine en oorzaak']);
has('eng.flow.downtime', ['OEE tells you how much time you lose, not why', 'a downtime log: for every stop the start time, the duration, the machine and a reason code', 'Downtime log A list of all stops with time, duration, machine and cause'], 'en');
// s3 quality: a check sheet next to the machine, a tally mark per defect; quarantine sets a nonconforming part aside and marks it (a cage); the nonconformance report says what, how many and the decision
has('eng.quality.datatools', ['De turflijst (check sheet) is de eenvoudigste: een formulier naast de machine waarop de operator met een streepje noteert welke fout hij ziet', 'Turflijst Check sheet: formulier waarop je met streepjes telt welke fout wanneer voorkomt']);
has('eng.quality.datatools', ['The check sheet is the simplest: a form next to the machine on which the operator makes a tally mark for each defect he sees', 'Check sheet A form on which you tally which defect occurs when'], 'en');
has('eng.quality.nonconform', ['Quarantaine (quarantine) betekent: apart zetten en duidelijk markeren', 'in een afgesloten kooi', 'Alles komt in een afwijkingsrapport (nonconformance report, NCR): wat, hoeveel', 'Afwijkingsrapport Nonconformance report (NCR): vastlegging van wat er afwijkt, hoeveel, en welke beslissing']);
has('eng.quality.nonconform', ['Quarantine means setting it aside and marking it clearly', 'in a locked cage', 'Everything goes into a nonconformance report (NCR): what, how many', 'Nonconformance report NCR: record of what is nonconforming, how many, and which decision'], 'en');
// s4 maintenance: operators clean, inspect, lubricate and tighten (CILT) and tag what they see; the CILT standard is the one-page sheet at the machine; the CMMS holds the work orders, a notification starts one
has('eng.maintenance.tpm', ['Ze maken schoon, inspecteren, smeren en draaien aan (CILT), en ze zien afwijkingen en hangen er een label aan', 'elke afwijking krijgt een label (tag)']);
has('eng.maintenance.tpm', ['They clean, inspect, lubricate and tighten (CILT), and spot and tag abnormalities', 'every abnormality gets a tag'], 'en');
has('eng.maintenance.cilt', ['Een CILT-standaard is het blad van één pagina bij de machine dat “zorg er goed voor” omzet in concrete controles', 'CILT-standaard Eén blad bij de machine met elke controle']);
has('eng.maintenance.cilt', ['A CILT standard is the one-page sheet at the machine that turns “take care of it” into concrete checks', 'CILT standard One sheet at the machine listing each check'], 'en');
has('eng.maintenance.cmms', ['Een CMMS (computerised maintenance management system, een onderhoudsmanagementsysteem) is de onderhoudsdatabase', 'melding (iemand meldt een probleem)', 'CMMS Onderhoudsdatabase met assets, werkorders']);
has('eng.maintenance.cmms', ['A CMMS (computerised maintenance management system) is the maintenance database', 'notification (someone reports a problem)', 'CMMS Maintenance database with assets, work orders'], 'en');
// s5 safety: the LMRA is a short check at the workplace just before starting; LOTO cuts off every energy source and fits your own padlock and a tag with your name; the isolation point is the switch where you cut it off; the machine can start with hands inside
has('eng.safety.lmra', ['De LMRA, de laatste minuut risicoanalyse, is een korte check op de werkplek, vlak voor de start, door de mensen die het werk gaan doen', 'Is een antwoord nee of onduidelijk, dan begin je niet']);
has('eng.safety.lmra', ['The LMRA, the last-minute risk analysis, is a short check at the workplace, just before starting, by the people who will do the work', 'If an answer is no or unclear, you don’t start'], 'en');
has('eng.safety.loto', ['gebeuren doordat een machine onverwacht start, of opgeslagen energie vrijkomt, terwijl iemand er met zijn handen in zit', 'je sluit elke energiebron af, hangt er je eigen hangslot op en een label met je naam', 'Elke bron heeft een scheidingspunt (isolation point): de schakelaar of afsluiter waar je hem afsluit en een slot op kunt hangen']);
has('eng.safety.loto', ['happen when a machine starts unexpectedly, or stored energy is released, while someone has their hands inside', 'you cut off every energy source, fit your own padlock and hang a tag with your name', 'Each source has an isolation point: the switch or valve where you cut it off and can fit a lock'], 'en');

assert(misses.length === 0, `the lessons changed:\n  ${misses.join('\n  ')}`);

// ---------------------------------------------------------------- the world (hall B: the filling unit on line 3 and what keeps it running)
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

// where things stand (cm): the filling unit of eng.field.making over the start of line 3's belt (two uprights and a
// beam, a plate hung from the beam above the cartons, a plastic cover on top, the tank at the back wall at the left
// with its pipe into the plate), as tall as a person, as in eng.field.digital. New here, each from the scene of its
// station: the stop log, a board on the back wall at the right (rows of tally strokes, the place of the screen of the
// digital film); a table with the check sheet at the end of the belt and the marked quarantine place on the floor in
// front of it with two cartons in it; the CILT standard on its board between the table with the laptop and the unit,
// a tag on the front upright and the laptop on the table at the front left; and the isolator in the grey cabinet at
// the back wall between tank and belt (where the PLC cabinet stands in the digital film) with its lock and tag.
// You and the team lead stand in front in the opening only.
const BELT = { x: 130, y: 16, len: 130, dep: 34 };
const UX = 152; // x of the uprights and the beam
const FRAME = { top: 150, beam: 160 };
const PLATE = { z0: 100, z1: 146 }; // the filling head: its foot clears the cartons (60 to 80)
const TANK = { x: 62, y: 34, r: 20, h: 130 };
const PIPE = { y: 28, z: 118 };
const TABLE = { x: 18, y: 108, w: 76, d: 42, h: 74 }; // the table with the laptop (the CMMS)
const LOG = { x0: 196, x1: 262, z0: 112, z1: 168 }; // the stop log on the back wall
const QT = { x: 262, y: 58, w: 26, d: 44, h: 70 }; // the table with the check sheet at the end of the belt
const QZ = { x: 196, y: 84, w: 52, d: 56 }; // the marked quarantine place on the floor, in front of the belt
const CILT = { x: 104, y: 84, w: 26, d: 3, z0: 74, z1: 126 }; // the CILT standard on its board
const ISO = { x: 96, w: 30, d: 20, h: 112 }; // the grey cabinet with the isolator
const frame = [
  w.box({ x: UX, y: 5, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 52, w: 9, d: 9, r: 1 }, 0, FRAME.top, { tone: 'mid' }, { steps: 2 }),
  w.box({ x: UX, y: 5, w: 9, d: 56, r: 1 }, FRAME.top, FRAME.beam, { tone: 'mid' }, { steps: 2 }),
].join('');
const plate = w.box({ x: UX + 9, y: BELT.y, w: 3.2, d: 36, r: 0.6 }, PLATE.z0, PLATE.z1, { tone: 'mid' }, { steps: 2 });
const cover = w.box({ x: UX - 7, y: 12, w: 23, d: 42, r: 7 }, FRAME.beam, FRAME.beam + 24, { tone: 'hi' }, { steps: 4, bevel: 1.2 });
const tank = w.post(TANK.x, TANK.y, TANK.r, 0, TANK.h, { tone: 'mid' }, 28)
  + w.post(TANK.x, TANK.y, TANK.r - 4, TANK.h, TANK.h + 5, { tone: 'lo' }, 24)
  + w.box({ x: TANK.x + TANK.r - 2, y: PIPE.y, w: UX + 9 - TANK.x - TANK.r + 2, d: 6, r: 2 }, PIPE.z, PIPE.z + 8, { tone: 'lo' }, { steps: 2 });
const f1 = (v) => (Math.round(v * 10) / 10).toString();
const at = w.at;
// a few short strokes on a face: [x0, x1, z] on the plane y (the +y face of a board or a cabinet)
const strokes = (y, rows, tone = 'lo') => k.lineSvg(rows.map(([x0, x1, z]) => k.pathOf([at([x0, y, z]), at([x1, y, z])])).join(''), { tone });
// the stop log: a board on the back wall with three rows of tally strokes (a stop, its length, its cause)
const logBoard = w.box({ x: LOG.x0, y: 0, w: LOG.x1 - LOG.x0, d: 3.4, r: 1 }, LOG.z0, LOG.z1, { tone: 'mid' }, { steps: 2, bevel: 0.4 })
  + `<g transform="${w.planeY(3.6)}"><path class="pm-board" d="${w.rectD(LOG.x0 + 3, -(LOG.z1 - 3), LOG.x1 - 3, -(LOG.z0 + 3))}"/></g>`
  + strokes(3.8, [[LOG.x0 + 8, LOG.x1 - 10, LOG.z1 - 14], [LOG.x0 + 8, LOG.x1 - 22, LOG.z1 - 28], [LOG.x0 + 8, LOG.x1 - 34, LOG.z1 - 42]], 'mid')
  + k.dotsSvg([0, 1, 2].map((i) => at([LOG.x1 - 8, 3.8, LOG.z1 - 14 - i * 14])), { size: 1.3, tone: 'hi' });
// the check table at the end of the belt with the check sheet on it (a sheet with rules)
const checkSheet = w.sheet({ x: QT.x + 6, y: QT.y + 6, z: QT.h, w: 14, d: 22, lines: 4 }).svg;
const checkTable = w.table(QT) + checkSheet;
// the quarantine place: the marked floor with two cartons in it, one on the other
const quarantine = hall.floorMark(QZ)
  + w.box({ x: QZ.x + 15, y: QZ.y + 20, w: 20, d: 18, r: 1 }, 0.4, 20.4, { tone: 'hi' }, { steps: 1 })
  + w.box({ x: QZ.x + 16, y: QZ.y + 20, w: 20, d: 18, r: 1 }, 20.4, 40.4, { tone: 'hi' }, { steps: 1 });
// the CILT standard: one sheet on a board on two posts (its checks as rows), and a tag on the front upright of the unit
const ciltBoard = w.post(CILT.x + 4, CILT.y + 1.5, 1.8, 0, CILT.z0, { tone: 'lo' }, 10) + w.post(CILT.x + CILT.w - 4, CILT.y + 1.5, 1.8, 0, CILT.z0, { tone: 'lo' }, 10)
  + w.box({ x: CILT.x, y: CILT.y, w: CILT.w, d: CILT.d, r: 0.8 }, CILT.z0, CILT.z1, { tone: 'mid' }, { steps: 2, bevel: 0.4 })
  + strokes(CILT.y + CILT.d + 0.3, [0, 1, 2, 3].map((i) => [CILT.x + 4, CILT.x + CILT.w - 4 - (i % 2) * 5, CILT.z1 - 9 - i * 10]));
const tag = w.box({ x: UX + 9, y: 53, w: 4, d: 7, r: 0.8 }, 66, 98, { tone: 'hi' }, { steps: 1 });
// the isolator in the grey cabinet: a switch with a handle on the door, a lock on it and a tag hanging from the lock
const isolator = hall.cabinet({ x: ISO.x, w: ISO.w, d: ISO.d, h: ISO.h })
  + w.box({ x: ISO.x + 5, y: ISO.d, w: 20, d: 2.2, r: 0.6 }, 62, 90, { tone: 'lo' }, { steps: 1 })
  + w.box({ x: ISO.x + 9, y: ISO.d + 2.2, w: 12, d: 3, r: 0.8 }, 72, 80, { tone: 'hi' }, { steps: 1 })
  + w.box({ x: ISO.x + 18, y: ISO.d + 2.2, w: 8, d: 5, r: 1.2 }, 56, 70, { tone: 'hi' }, { steps: 1 })
  + w.box({ x: ISO.x + 18.5, y: ISO.d + 2.2, w: 7, d: 1.4, r: 0.4 }, 30, 56, { tone: 'mid' }, { steps: 1 });
const person = (role, x, y, along) => w.person({ x, y, role, along });

const world = [
  w.room(ROOM),
  // each thing appears in the scene of its station (the stage script shows the groups o-*), so every drawn detail
  // meets its reason in the narration: the stop log at the second scene, the check table and the quarantine place at
  // the third, the CILT standard, the tag and the laptop at the fourth, the isolator at the fifth
  cueG('line3', hall.conveyor({ ...BELT, cartons: 4 })),
  cueG('tank', tank),
  g('o-iso', cueG('isolator', isolator)),
  cueG('unit', frame + plate + cover),
  g('o-log', cueG('board', logBoard)),
  g('o-q', cueG('checksheet', checkTable) + cueG('quarantine', quarantine)),
  g('o-cilt', cueG('cilt', ciltBoard) + cueG('tag', tag)),
  g('o-lap', cueG('laptop', w.table(TABLE) + w.laptop({ x: TABLE.x + TABLE.w / 2, y: TABLE.y + TABLE.d / 2, z: TABLE.h, toward: 1 }))),
  g('pp-teamlead', person('teamlead', 128, 132, 'x')),
  g('pp-jij', person('jij', 188, 132, 'x')),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every part a sentence can light is a static cue group (data-cue), filled by the stage script each frame
// (data-k). The road holds the five stations, one cue group each (st-<slug>): in s1 a row with its number and
// title, in s2 to s6 a numbered square of the strip under the heading. The shared Engineering map (mapScene,
// the five stations lit) replaces the room and the panel in the last scene; its places are cue groups of their
// own (map-<slug>).
const STATION_CUE = Object.fromEntries(ROAD.map((id) => [id, `st-${id.split('.')[1]}`]));
const stations = ROAD.map((id, i) => cueG(STATION_CUE[id], g(`rd${i}`, ''))).join('');
const hud = g('hud', `<rect data-k="pbg" class="pm-panel" x="322" y="12" width="308" height="376" rx="10"/>` + g('pHead', '')
  + cueG('road', g('roadB', '') + stations)
  + cueG('flow', g('flowB', '')) + cueG('shift', g('shiftB', '')) + cueG('route', g('routeB', '')) + cueG('for', g('forB', ''))
  + cueG('t1', g('t1B', '')) + cueG('t2', g('t2B', ''))
  + cueG('without', g('withoutB', '')));
const { w: MAP_W, h: MAP_H } = engMap.view; // the Engineering map's sheet (viewBox of the wide drawing), from the map data
const MAP = (await mapScene({ subject: 'eng', highlight: ROAD })).replace('<svg class="subject-map"', `<svg class="subject-map" width="${MAP_W}" height="${MAP_H}"`);
for (const id of ROAD) assert(MAP.includes(`data-cue="${mapCue(id)}"`), `the map lights ${id} as a cue group`);
assert(MAP.includes(`viewBox="0 0 ${MAP_W} ${MAP_H}"`), `the Engineering map is ${MAP_W} by ${MAP_H}`);
// the centre of each station's place on the map, for the zoom of the closing scene, and the zone's band
const MAPZ = ROAD.map((id) => { const p = engMap.places.find((x) => x.module === id); return [p.x + p.w / 2, p.y + p.h / 2]; });
const ZONEB = engMap.zones.find((z) => z.field === FIELD.id);
const ZBAND = [pathBox(ZONEB.path)[1], pathBox(ZONEB.path)[3]]; // top and bottom of the zone's band
assert(ZBAND[1] > ZBAND[0] && MAPZ.every(([, y]) => y > ZBAND[0] && y < ZBAND[1]), 'the four places lie inside the run zone');
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
  { from: cam(150, 70, 70, 1), to: cam(150, 70, 70, 1.08) }, // s1 the hall: the unit on line 3, the tank, you and the team lead
  { from: cam(190, 40, 80, 1.25), to: cam(190, 40, 80, 1.38) }, // s2 the belt with its cartons and the stop log on the wall
  { from: cam(245, 90, 40, 1.25), to: cam(245, 90, 40, 1.38) }, // s3 the end of the belt: the check table and the quarantine place
  { from: cam(100, 85, 60, 1.15), to: cam(100, 85, 60, 1.25) }, // s4 the CILT standard, the unit with its tag, the laptop
  { from: cam(120, 40, 70, 1.25), to: cam(120, 40, 70, 1.35) }, // s5 the isolator in its cabinet and the unit
  { from: cam(150, 85, 60, 1), to: cam(150, 85, 60, 1) }, // s6 (the map)
];

// ---------------------------------------------------------------- the film
const MAPS = ROAD.map(mapCue);
// the two tools of a station: the chips of the panel, plus the parts of the room they belong to
const TOOLCUE = (a, b, room = []) => ({ cue: { [a]: 't1', [b]: 't2' }, focus: ['t1', 't2', ...room] });
const DURS = Array(6).fill(30);
const spec = {
  id: 'eng.field.run',
  title: { nl: 'De fabriek draaiend houden', en: 'Keeping the plant running' },
  field: 'eng.field.run',
  // the road: per module of the field, the scene that explains it and its station on the road
  stations: Object.fromEntries(ROAD.map((id, i) => [id, { scene: `s${i + 2}`, cue: STATION_CUE[id], ...(LABELS[id] ? { label: LABELS[id] } : {}) }])),
  scenes: [
    {
      id: 's1', level: 1, dur: DURS[0], still: 0.9, title: { nl: 'Een dienst op lijn 3', en: 'One shift on line 3' },
      beats: [
        { nl: 'De vuleenheid op lijn 3 draait. Hij vult de dozen met product uit de tank.', en: 'The filling unit on line 3 is running. It fills the cartons with product from the tank.', focus: ['flow', 'unit', 'tank', 'line3'] },
        { nl: 'Jij bent de engineer. Met de teamleider houd je hem een hele dienst aan de gang.', en: 'You are the engineer. With the team lead you keep it going for a whole shift.', focus: ['shift', 'jij', 'teamlead', 'unit'] },
        { nl: 'Die dienst vraagt vier dingen. Tempo, goede dozen, een eenheid die heel blijft en veilig werk.', en: 'That shift needs four things. Pace, good cartons, a unit that stays whole and safe work.', focus: 'route' },
        { nl: 'Dat zijn vier stations. Van capaciteit en kwaliteit tot onderhoud en veiligheid.', en: 'That makes four stations. From capacity and quality to maintenance and safety.', focus: 'road' },
      ],
    },
    {
      id: 's2', level: 1, dur: DURS[1], still: 0.9, title: { nl: 'Capaciteit en flow', en: 'Capacity and flow' },
      beats: [
        { nl: 'Het eerste station is Capaciteit en flow. Lijn 3 moet genoeg dozen maken voor de klant.', en: 'The first station is Capacity and flow. Line 3 must make enough cartons for the customer.', focus: ['st-flow', 'for', 'line3'] },
        { nl: 'De klant bepaalt het tempo. Elke minuut stilstand is een minuut achterstand.', en: 'The customer sets the pace. Every minute of stoppage is a minute behind.', focus: ['for', 'line3'] },
        { nl: 'Je rekent de {t:Takttijd|takttijd} uit en houdt een {t:Stilstandregistratie|stilstandregistratie} bij.', en: 'You work out the {t:Takt time|takt time} and keep a {t:Downtime log|downtime log}.', ...TOOLCUE('Takttijd', 'Stilstandregistratie', ['line3', 'board']) },
        { nl: 'Zonder dit weet niemand welk tempo de lijn moet halen, of waar de minuten blijven.', en: 'Without this nobody knows what pace the line must keep, or where the minutes go.', focus: 'without' },
      ],
    },
    {
      id: 's3', level: 1, dur: DURS[2], still: 0.9, title: { nl: 'Kwaliteit', en: 'Quality' },
      beats: [
        { nl: 'Het tweede station is Kwaliteit. Elke doos die de lijn verlaat, moet goed zijn.', en: 'The second station is Quality. Every carton that leaves the line must be good.', focus: ['st-quality', 'for', 'line3'] },
        { nl: 'Aan het eind van de band let je op fouten. Een foute doos gaat apart.', en: 'At the end of the belt you watch for faults. A bad carton is set apart.', focus: ['for', 'checksheet', 'quarantine'] },
        { nl: 'Je noteert fouten op een {t:Turflijst|turflijst} en schrijft een {t:Afwijkingsrapport|afwijkingsrapport}.', en: 'You note faults on a {t:Check sheet|check sheet} and write a {t:Nonconformance report|nonconformance report}.', ...TOOLCUE('Turflijst', 'Afwijkingsrapport', ['checksheet', 'quarantine']) },
        { nl: 'Zonder dit weet niemand wat er fout gaat, en kan een foute doos bij de klant komen.', en: 'Without this nobody knows what goes wrong, and a bad carton can reach the customer.', focus: 'without' },
      ],
    },
    {
      id: 's4', level: 1, dur: DURS[3], still: 0.9, title: { nl: 'Onderhoud', en: 'Maintenance' },
      beats: [
        { nl: 'Het derde station is Onderhoud. De eenheid moet heel blijven, dienst na dienst.', en: 'The third station is Maintenance. The unit has to stay whole, shift after shift.', focus: ['st-maintenance', 'for', 'unit'] },
        { nl: 'Aan het begin van de dienst loop je een ronde langs de eenheid. Wat afwijkt, krijgt een label.', en: 'At the start of the shift you walk a round past the unit. Anything that is off gets a tag.', focus: ['for', 'cilt', 'tag', 'unit'] },
        { nl: 'Je volgt een {t:CILT-standaard|CILT-standaard} en meldt wat je vindt in het {t:CMMS|CMMS}.', en: 'You follow a {t:CILT standard|CILT standard} and log what you find in the {t:CMMS|CMMS}.', ...TOOLCUE('CILT-standaard', 'CMMS', ['cilt', 'laptop']) },
        { nl: 'Zonder dit kan slijtage onopgemerkt blijven tot de lijn stilstaat.', en: 'Without this wear can go unnoticed until the line stops.', focus: 'without' },
      ],
    },
    {
      id: 's5', level: 1, dur: DURS[4], still: 0.9, title: { nl: 'Veilig werken', en: 'Safety on the floor' },
      beats: [
        { nl: 'Het vierde station is Veilig werken. Loopt de eenheid vast, dan moet iemand erbij.', en: 'The fourth station is Safety on the floor. When the unit jams, someone has to get at it.', focus: ['st-safety', 'for', 'unit'] },
        { nl: 'Voor je begint, kijk je rond. Dan gaat de energie eraf bij de schakelaar, met een slot en een label.', en: 'Before you start you look around. Then the energy goes off at the switch, with a lock and a tag.', focus: ['for', 'isolator', 'unit'] },
        { nl: 'Je doet een {t:LMRA|LMRA} en past {t:Vergrendelen en labelen|vergrendelen en labelen} toe.', en: 'You do an {t:LMRA|LMRA} and apply {t:LOTO|LOTO}.', ...TOOLCUE('LMRA', 'Vergrendelen en labelen', ['isolator', 'unit']) },
        { nl: 'Zonder dit kan de eenheid starten terwijl je handen erin zitten.', en: 'Without this the unit can start while your hands are in it.', focus: 'without' },
      ],
    },
    {
      id: 's6', level: 1, dur: DURS[5], still: 0.9, title: { nl: 'De kaart', en: 'The map' },
      beats: [
        { nl: 'De hele kaart: de vier stations van De fabriek draaiend houden liggen in één gebied.', en: 'The whole map: the four stations of Keeping the plant running lie in one zone.', focus: MAPS },
        { nl: 'Eerst Capaciteit en flow: van takt en lijnbalans tot omstellen en seriegrootte.', en: 'First Capacity and flow: from takt and line balance to changeover and batch size.', focus: MAPS[0] },
        { nl: 'Dan Kwaliteit: van toleranties en meten tot risico en beheersing.', en: 'Then Quality: from tolerances and measuring to risk and control.', focus: MAPS[1] },
        { nl: 'Dan Onderhoud: van onderhoudsstrategieën tot onderhoud meten.', en: 'Then Maintenance: from maintenance strategies to measuring maintenance.', focus: MAPS[2] },
        { nl: 'Tot slot Veilig werken: van risico’s en maatregelen tot incidenten en veiligheidscultuur.', en: 'Finally Safety on the floor: from risk and controls to incidents and safety culture.', focus: MAPS[3] },
        { nl: 'Zo hangen ze samen. De klant bepaalt het tempo, en kwaliteit zorgt dat elke doos goed is.', en: 'That is how they connect. The customer sets the pace, and quality makes sure every carton is good.', focus: [MAPS[0], MAPS[1]] },
        { nl: 'Onderhoud houdt de eenheid heel. Veiligheid bepaalt hoe je erbij werkt.', en: 'Maintenance keeps the unit whole. Safety decides how you work on it.', focus: [MAPS[2], MAPS[3]] },
        { nl: 'Elk station is een module met vier niveaus per onderwerp. Begin bij wat jouw lijn nu nodig heeft.', en: 'Each station is a module with four levels per topic. Start with what your line needs now.', focus: MAPS },
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
// 0.4 s). Words checked with espeak-ng phonemes through Piper's own bridge (nl_NL-alex): see the SAY group of
// this film (the last of the Dutch list in films/_kit/timeline.mjs). The captions' colons are not spoken; flow is
// said "flouw" in the two phrases that name the module, CILT and LMRA as letters by the rules above, CMMS as the
// letters espeak-ng reads.
const SAY = [
  [ // s1 the opening
    { nl: 'De vuleenheid op lijn 3 in hal B draait. Hij vult de dozen met product uit de tank.',
      en: 'The filling unit on line 3 in hall B is running. It fills the cartons with product from the tank.' },
    { nl: 'Jij bent de engineer. Met de teamleider houd je hem een hele dienst aan de gang.',
      en: 'You are the engineer. With the team lead you keep it going for a whole shift.' },
    { nl: 'Die dienst vraagt vier dingen. Tempo, goede dozen, een eenheid die heel blijft en veilig werk.',
      en: 'That shift needs four things. Pace, good cartons, a unit that stays whole and safe work.' },
    { nl: 'Dat zijn vier stations. Van capaciteit en kwaliteit tot onderhoud en veiligheid.',
      en: 'That makes four stations. From capacity and quality to maintenance and safety.' },
  ],
  [ // s2 flow
    { nl: 'Het eerste station is Capaciteit en flow. Lijn 3 moet genoeg dozen maken voor de klant.',
      en: 'The first station is Capacity and flow. Line 3 must make enough cartons for the customer.' },
    { nl: 'De klant bepaalt het tempo. Elke minuut stilstand is een minuut achterstand.',
      en: 'The customer sets the pace. Every minute of stoppage is a minute behind.' },
    { nl: 'Je rekent de {t:Takttijd|takttijd} uit en houdt een {t:Stilstandregistratie|stilstandregistratie} bij.',
      en: 'You work out the {t:Takt time|takt time} and keep a {t:Downtime log|downtime log}.' },
    { nl: 'Zonder dit weet niemand welk tempo de lijn moet halen, of waar de minuten blijven.',
      en: 'Without this nobody knows what pace the line must keep, or where the minutes go.' },
  ],
  [ // s3 quality
    { nl: 'Het tweede station is Kwaliteit. Elke doos die de lijn verlaat, moet goed zijn.',
      en: 'The second station is Quality. Every carton that leaves the line must be good.' },
    { nl: 'Aan het eind van de band let je op fouten. Een foute doos gaat apart.',
      en: 'At the end of the belt you watch for faults. A bad carton is set apart.' },
    { nl: 'Je noteert fouten op een {t:Turflijst|turflijst} en schrijft een {t:Afwijkingsrapport|afwijkingsrapport}.',
      en: 'You note faults on a {t:Check sheet|check sheet} and write a {t:Nonconformance report|nonconformance report}.' },
    { nl: 'Zonder dit weet niemand wat er fout gaat, en kan een foute doos bij de klant komen.',
      en: 'Without this nobody knows what goes wrong, and a bad carton can reach the customer.' },
  ],
  [ // s4 maintenance
    { nl: 'Het derde station is Onderhoud. De eenheid moet heel blijven, dienst na dienst.',
      en: 'The third station is Maintenance. The unit has to stay whole, shift after shift.' },
    { nl: 'Aan het begin van de dienst loop je een ronde langs de eenheid. Wat afwijkt, krijgt een label.',
      en: 'At the start of the shift you walk a round past the unit. Anything that is off gets a tag.' },
    { nl: 'Je volgt een {t:CILT-standaard|CILT-standaard} en meldt wat je vindt in het {t:CMMS|CMMS}.',
      en: 'You follow a {t:CILT standard|CILT standard} and log what you find in the {t:CMMS|CMMS}.' },
    { nl: 'Zonder dit kan slijtage onopgemerkt blijven tot de lijn stilstaat.',
      en: 'Without this wear can go unnoticed until the line stops.' },
  ],
  [ // s5 safety
    { nl: 'Het vierde station is Veilig werken. Loopt de eenheid vast, dan moet iemand erbij.',
      en: 'The fourth station is Safety on the floor. When the unit jams, someone has to get at it.' },
    { nl: 'Voor je begint, kijk je rond. Dan gaat de energie eraf bij de schakelaar, met een slot en een label.',
      en: 'Before you start you look around. Then the energy goes off at the switch, with a lock and a tag.' },
    { nl: 'Je doet een {t:LMRA|LMRA} en past {t:Vergrendelen en labelen|vergrendelen en labelen} toe.',
      en: 'You do an {t:LMRA|LMRA} and apply {t:LOTO|LOTO}.' },
    { nl: 'Zonder dit kan de eenheid starten terwijl je handen erin zitten.',
      en: 'Without this the unit can start while your hands are in it.' },
  ],
  [ // s6 the map
    { nl: 'Dit is de hele kaart. De vier stations van De fabriek draaiend houden liggen in één gebied.',
      en: 'This is the whole map. The four stations of Keeping the plant running lie in one zone.' },
    { nl: 'Eerst Capaciteit en flow, van takt en lijnbalans tot omstellen en seriegrootte.',
      en: 'First Capacity and flow, from takt and line balance to changeover and batch size.' },
    { nl: 'Dan Kwaliteit, van toleranties en meten tot risico en beheersing.',
      en: 'Then Quality, from tolerances and measuring to risk and control.' },
    { nl: 'Dan Onderhoud, van onderhoudsstrategieën tot onderhoud meten.',
      en: 'Then Maintenance, from maintenance strategies to measuring maintenance.' },
    { nl: 'Tot slot Veilig werken, van risico’s en maatregelen tot incidenten en veiligheidscultuur.',
      en: 'Finally Safety on the floor, from risk and controls to incidents and safety culture.' },
    { nl: 'Zo hangen ze samen. De klant bepaalt het tempo, en kwaliteit zorgt dat elke doos goed is.',
      en: 'That is how they connect. The customer sets the pace, and quality makes sure every carton is good.' },
    { nl: 'Onderhoud houdt de eenheid heel. Veiligheid bepaalt hoe je erbij werkt.',
      en: 'Maintenance keeps the unit whole. Safety decides how you work on it.' },
    { nl: 'Elk station is een module met vier niveaus per onderwerp. Begin bij wat jouw lijn nu nodig heeft.',
      en: 'Each station is a module with four levels per topic. Start with what your line needs now.' },
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
const preamble = `const CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\nconst MAPZ = ${JSON.stringify(MAPZ)};\nconst ZBAND = ${JSON.stringify(ZBAND)};\nconst MAPSZ = [${MAP_W}, ${MAP_H}];\nconst ROW = ${STATION_UNITS};\nconst HEAD = 284;\nconst CW = ${JSON.stringify(CHAR_W)};\nconst wrapUnits = ${wrapUnits.toString()};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = PM_CSS + HALL_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-tile{fill:var(--anatomy-face);stroke:var(--anatomy-lo);stroke-width:1.2}
.pm-badge{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.2}
.pm-out{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-dasharray:5 4}
.pm-crit{fill:color-mix(in srgb,var(--fp-accent) 24%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-arrow{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-link{fill:none;stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round;stroke-linecap:round}
.pm-road{fill:none;stroke:var(--anatomy-lo);stroke-width:3;stroke-dasharray:6 6;stroke-linecap:round}
.pm-dot{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.6}
.pm-cross{fill:none;stroke:var(--anatomy-muted);stroke-width:2.4;stroke-linecap:round}
.pm-solid{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
[data-cue][data-on] .pm-arrow,[data-cue][data-on] .pm-link,[data-cue][data-on] .pm-road{stroke:var(--fp-accent);stroke-width:2.2}
[data-cue][data-on] :is(.pm-card,.pm-tile,.pm-badge,.pm-out,.pm-dot,.pm-solid){stroke:var(--fp-accent)}
[data-cue][data-on] .pm-cross{stroke:var(--fp-accent)}
/* the strokes on the stop log, the CILT board and the check sheet read at phone width: a little heavier than the kit's hairline */
:is([data-cue="board"],[data-cue="cilt"]) .iso-line{stroke-width:1.8}
[data-cue][data-on] :is(.pm-txt,.pm-mute,.pm-big){fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as the pilot) */
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="teamlead"]:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="teamlead"]:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
` + mapStyles(undefined, 'eng');


const label = {
  nl: 'Hal B van de fabriek, waar lijn 3 draait. Aan de achterwand de band van lijn 3 met dozen; boven het begin van de band staat de vuleenheid, ongeveer zo hoog als een mens: een stalen frame met een plaat boven de dozen en bovenop een lichte kunststof kap. Links achter staat een tank met een leiding naar de plaat. Tegen de achterwand tussen tank en band een grijze kast met een schakelaar, een slot en een label, en rechts daarvan een bord met streepjes voor de stops. Aan het eind van de band een tafel met een turflijst, en daarvoor op de vloer een gemarkeerde plek met twee dozen. Tussen de unit en de tafel links voor een bord met de CILT-standaard, een label aan de voorste stijl van de unit, en voor links een tafel met een laptop. In het begin staan jij en de teamleider voor in de hal. Bij het sluiten verschijnt de hele kaart van Engineering met de vier stations van deze zone.',
  en: 'Hall B of the plant, where line 3 runs. Along the back wall the belt of line 3 with cartons; over the start of the belt stands the filling unit, about as tall as a person: a steel frame with a plate above the cartons and a light plastic cover on top. At the back left a tank with a pipe to the plate. Against the back wall between tank and belt a grey cabinet with a switch, a lock and a tag, and to the right of it a board with strokes for the stops. At the end of the belt a table with a check sheet, and in front of it on the floor a marked place with two cartons. Between the unit and the table at the front left a board with the CILT standard, a tag on the front upright of the unit, and at the front left a table with a laptop. In the opening you and the team lead stand at the front of the hall. At the close the whole Engineering map appears with the four stations of this zone.',
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

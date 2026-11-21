// Dev tool, not shipped. Builds the explainer film "Instructie op de werkplek /
// On-the-job instruction" for Projecten: pm.land.training (level 1 of the
// topic Standaardwerk en training, "Training en werkinstructies").
//
//   node films/pm.land.training/build.mjs            build the page
//   node films/pm.land.training/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.land.training.html: one offline page with
// the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7
// (pm.land.training: TWI in four steps at the workstation; about 90 s; the
// storyboard list: a one-page instruction with key points, TWI's four steps,
// the Kirkpatrick levels). Storyboard drift: seven scenes and about four
// minutes, because a lesson with a film no longer shows its worked example, so
// the film carries all five teach blocks and the worked example: the work
// instruction (s1, teach 1), the grid operator's instruction and its test
// (s2, teach 1 and the example), TWI and its four steps acted at the bench
// (s3, teach 2), the motto, Toyota and classroom versus the floor (s4, teach
// 2 and 3), who trains and when (s5, teach 3 and 4, the example's training),
// the check a week later (s6, teach 4 and the example's follow-up) and what
// trainers measure (s7, teach 5).
//
// Checklist (lesson point: scene and beat; all said, the card repeats it):
//   teach 1: write the new way down as a short work instruction, one page per
//     task (s1 b1); steps in order, photos of the real equipment (s1 b2); for
//     each step the key point, the detail that makes it go right or wrong,
//     plus why it matters (s1 b3); write it with the people who do the work
//     (s2 b2); test it: someone who wasn't involved follows it while you
//     watch; where they hesitate, the instruction is unclear (s2 b4)
//   teach 2: TWI, Training Within Industry, a US wartime programme started in
//     1940 (s3 b1); over 1.6 million certificates by 1945 (s3 b2); Job
//     Instruction, four steps: prepare the learner (s3 b3), show and explain
//     (s3 b4), let them try while you correct (s3 b5), follow up (s3 b6); the
//     motto, if the worker hasn't learned, the instructor hasn't taught (s4
//     b1); Toyota adopted it in the 1950s (s4 b2)
//   teach 3: a classroom for the why and the big picture, 30 to 60 minutes
//     (s4 b3); skills through on-the-job training: show, do together, let them
//     do it while you watch, check later (s4 b4); shift leads or experienced
//     operators make the best trainers, if you train them first (s5 b1); train
//     just before people need it, a session six weeks before go-live is
//     mostly forgotten (s5 b2)
//   teach 4: short sessions in the week before go-live, support on the floor
//     in the first two weeks after (s5 b3); every shift, including nights and
//     weekends, which projects often forget (s5 b4); a week later watch people
//     do it without help, not to judge them but to see whether the instruction
//     or the training needs fixing (s6 b1); many people making the same
//     mistake: the instruction is wrong, not the people (s6 b2)
//   teach 5: trainers often measure the wrong thing; the Kirkpatrick levels,
//     Donald Kirkpatrick 1959, four checks: liked it, learned it, do it on the
//     job, results improved (s7 b1); most projects stop at the first, a smiley
//     form (s7 b2); experts argue whether a classroom is needed at all; the
//     popular 70-20-10 rule, 70% on the job, 20% from others, 10% in courses,
//     a practitioner model with weak evidence (s7 b3); if you don't know the
//     task well, let the expert train and check the result yourself (s7 b4)
//   example: a grid operator, technicians report as-built data (where the
//     cable and its joints, the connections between cable lengths, actually
//     ended up) with an app (s2 b1); a one-page instruction written with the
//     team leader, six steps, photos of the app screens (s2 b2); the key point
//     "photograph the joint before the trench is filled in again, because you
//     can't afterwards" (s2 b3); a technician who wasn't involved tests it,
//     gets stuck on step 4, which you rewrite (s2 b5); training: 30 minutes in
//     the morning meeting on why, then the team leader goes along on each
//     technician's first job (s5 b5); a week later 20 reports, 15 complete, 5
//     without the joint photo (s6 b3); all 5 from crews who start at 6:00,
//     before the team leader arrives (s6 b4); next week a team leader starts
//     early (s6 b5)
//
// Facts: the lesson's own figures (1940, over 1.6 million certificates by
// 1945, the four steps, the motto, Toyota in the 1950s, Kirkpatrick 1959). The
// TWI Service's final report ("The Training Within Industry Report
// 1940-1945", War Manpower Commission, Bureau of Training, 1945) gives the
// certificate count and the Job Instruction card: prepare the worker, present
// the operation (one important step at a time, stressing each key point), try
// out performance (correct errors, have him explain each key point), follow
// up (put him on his own, say who to go to for help, check frequently); the
// card's last line is "If the worker hasn't learned, the instructor hasn't
// taught". TWI began in 1940 under the National Defense Advisory Commission
// and moved to the War Manpower Commission in 1942, so the film says only "a
// US wartime programme" and names no agency. Toyota's adoption in the 1950s
// is the lesson's wording (TWI Institute and Dinero, "Training Within
// Industry", 2005, report it). What steps 1 and 3 add beyond the lesson's
// words (say which task, have the learner say the key points) is from the JI
// card; nothing is credited to Kirkpatrick but the four levels and the year.
//
// The drawing: a workshop corner rather than the meeting room, built from the
// shared pm world (films/_pm/world.mjs, read only): the room's walls and
// floor, a workbench (the world's table at bench height) with a cable and its
// joint ("de mof") lying on it, the work instruction pinned on the back wall
// (it fills row by row), a wall clock (it shows six o'clock in s6) and a
// calendar strip on the side wall (the weeks around go-live). The cast: "jij"
// the consultant in petrol, the team lead as the instructor, reaching to the
// joint, and the learner, a technician in an orange work jacket with the team
// lead's reflective bands and the planner's tablet (both cut from the world's
// own people, so films/_pm/world.mjs stays untouched; cue "learner"; the
// planner's light jumper read as office wear at the bench). A panel at the right, in stage space,
// carries the cards, each labelled "voorbeeld" or "schema".
//
// Focus (strictFocus): every beat names the block it explains. Each card block
// of the panel is its own cue group (SLOTS below), and so are the three
// people, the instruction on the wall, the bench with the joint, the clock and
// the calendar.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, minSceneDur, wordsOf } from '../_kit/timeline.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// What the film states, asserted against the lesson's current text (the build
// fails if it drifts); {n:...} numbers are then checked against the Dutch
// lesson text by defineFilm.
const TRN = 'pm.land.training';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const has = (lang, field, list) => {
  const l = lessons[lang].get(TRN);
  const t = field === 'teach' ? l.teach.join('\n') : l.example.text;
  for (const s of list) assert(t.includes(s), `${TRN} ${lang} ${field} no longer says "${s}"`);
};
has('nl', 'teach', ['korte werkinstructie: één A4 per taak, stappen op volgorde, foto’s van de echte apparatuur', 'het kernpunt, het detail waardoor het goed of fout gaat, plus waarom dat ertoe doet',
  'Schrijf hem met de mensen die het werk doen', 'laat iemand die er niet bij was hem volgen terwijl jij kijkt', 'Waar hij aarzelt, is de instructie onduidelijk',
  'TWI, Training Within Industry, een Amerikaans oorlogsprogramma uit 1940', 'tot 1945 meer dan 1,6 miljoen certificaten', 'Job Instruction heeft vier stappen',
  'de leerling voorbereiden, voordoen en uitleggen, zelf laten proberen terwijl jij corrigeert, en later nagaan hoe het gaat',
  'heeft de medewerker het niet geleerd, dan heeft de instructeur het niet aangeleerd', 'Toyota nam het in de jaren 50 over',
  'goed voor het waarom en het grote plaatje, in 30 tot 60 minuten', 'voordoen, samen doen, zelf laten doen terwijl jij kijkt, later checken',
  'Ploegleiders of ervaren operators zijn de beste trainers, als je hen eerst traint', 'Train vlak voordat mensen het nodig hebben', 'zes weken voor de livegang is dan grotendeels vergeten',
  'korte sessies in de week voor de livegang en begeleiding op de vloer in de eerste twee weken erna', 'ook nacht en weekend, die projecten vaak vergeten',
  'kijk een week later hoe mensen het zonder hulp doen, niet om ze te beoordelen', 'of de instructie of de training beter moet', 'dan is de instructie fout, niet de mensen',
  'Trainers meten vaak het verkeerde', 'Donald Kirkpatrick, 1959', 'vonden ze het leuk, hebben ze het geleerd, doen ze het op de werkplek, zijn de resultaten beter',
  'een formulier met smileys', 'Experts twisten of een klaslokaal wel nodig is', '70% leer je in het werk, 20% van anderen, 10% in cursussen', 'praktijkmodel met zwak bewijs',
  'laat de expert trainen en check jij het resultaat']);
has('nl', 'example', ['Een netbeheerder voert een nieuwe manier in', 'waar kabel en moffen, de verbindingen tussen kabelstukken, echt liggen', 'met een app doorgeven',
  'met de teamleider een instructie van één A4: zes stappen, foto’s van de schermen', 'fotografeer de mof voordat de sleuf weer dichtgaat, want daarna kan het niet meer',
  'Een monteur die er niet bij was test hem; hij loopt vast bij stap 4, die je herschrijft', '30 minuten in het ochtendoverleg over het waarom',
  'gaat de teamleider mee met de eerste klus van elke monteur', '20 meldingen: 15 compleet, 5 zonder moffoto', 'Alle 5 komen van ploegen die om 6:00 beginnen, voordat de teamleider er is',
  'Volgende week begint er een teamleider vroeger']);
has('en', 'teach', ['over 1.6 million certificates by 1945', 'if the worker hasn’t learned, the instructor hasn’t taught', 'Toyota adopted it in the 1950s', 'Donald Kirkpatrick, 1959']);
has('en', 'example', ['report as-built data', 'six steps, photos of the app screens', 'gets stuck on step 4', 'check 20 reports: 15 complete, 5 without the joint photo', 'crews who start at 6:00']);
const REPORTS = { all: 20, complete: 15, early: 5 };
assert(REPORTS.complete + REPORTS.early === REPORTS.all, '15 complete and 5 without the photo make 20');
const STEPS = 6;
const HARD = 4;
assert(HARD >= 1 && HARD <= STEPS, 'the rewritten step is one of the six');

// ---------------------------------------------------------------- the world
const W = 640;
const H = 400;
const AZ = 58;
const ROOM = { w: 290, d: 228, h: 230 };
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, 318, H, { pad: 6, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const f1 = (v) => Math.round(v * 10) / 10;
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;
const Y = [0, 1, 0];

// the workbench in the room, the joint lying on it; the team lead and the
// learner stand behind it, so the joint stays in view
const BENCH = { x: 104, y: 84, w: 160, d: 52, h: 90 };
const BZ = BENCH.h;
const CABLE = { x0: 120, x1: 252, y: 104, r: 2.4 };
const MOF = { x0: 176, x1: 210, r: 6.2 };
function joint() {
  const along = (x0, len, r, steps) => k.solidSvg(G.disc(0, len, r, G.frameOf([x0, CABLE.y, BZ + MOF.r], [1, 0, 0], Y, [0, 0, 1]), P, { steps }), { tone: 'lo', crease: 'none' });
  return along(CABLE.x0, CABLE.x1 - CABLE.x0, CABLE.r, 14)
    + k.solidSvg(G.disc(0, MOF.x1 - MOF.x0, MOF.r, G.frameOf([MOF.x0, CABLE.y, BZ + MOF.r], [1, 0, 0], Y, [0, 0, 1]), P, { steps: 24 }), { tone: 'mid', crease: 'none' })
    + k.solidSvg(G.disc(0, 3, MOF.r + 0.8, G.frameOf([MOF.x0 - 1.5, CABLE.y, BZ + MOF.r], [1, 0, 0], Y, [0, 0, 1]), P, { steps: 24 }), { tone: 'hi', crease: 'none' })
    + k.solidSvg(G.disc(0, 3, MOF.r + 0.8, G.frameOf([MOF.x1 - 1.5, CABLE.y, BZ + MOF.r], [1, 0, 0], Y, [0, 0, 1]), P, { steps: 24 }), { tone: 'hi', crease: 'none' });
}
// a drawer block under the bench's left end, its front toward the viewer
const drawers = () => w.box({ x: BENCH.x + 8, y: BENCH.y + 6, w: 46, d: 44, r: 1 }, 0, BZ - 10, { tone: 'lo' }, { steps: 2, bevel: 0.4 })
  + k.lineSvg([0.33, 0.66].map((f) => `M${w.at([BENCH.x + 10, BENCH.y + 50, f * (BZ - 10)]).map(f1).join(' ')}L${w.at([BENCH.x + 52, BENCH.y + 50, f * (BZ - 10)]).map(f1).join(' ')}`).join(''), { tone: 'hi' });

// the work instruction pinned on the back wall (local u = x, v = -z): one page
const SHEET = { x0: 58, x1: 100, z0: 112, z1: 171 };
const sheetFace = w.planeY(0.6);
const sheet = `<g transform="${sheetFace}"><path class="pm-paper" d="${w.rectD(SHEET.x0, -SHEET.z1, SHEET.x1, -SHEET.z0)}"/>`
  + `<path class="pm-rule" d="M${SHEET.x0 + 3} ${-SHEET.z1 + 4}H${SHEET.x1 - 12}"/>${g('sRows', '')}</g>`
  + k.dotsSvg([w.at([(SHEET.x0 + SHEET.x1) / 2, 0.8, SHEET.z1 - 2])], { size: 1, tone: 'mid' });

// a wall clock with its hands drawn per frame (six o'clock in s6)
const CLOCK = { x: 232, z: 198, r: 10 };
function clock() {
  const { x, z, r } = CLOCK;
  const F = G.frameOf([x, 0, z], Y, [1, 0, 0], [0, 0, 1]);
  const ticks = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const r0 = i % 3 ? r * 0.72 : r * 0.62;
    ticks.push(`M${f1(x + Math.sin(a) * r0)} ${f1(-(z + Math.cos(a) * r0))}L${f1(x + Math.sin(a) * r * 0.82)} ${f1(-(z + Math.cos(a) * r * 0.82))}`);
  }
  return k.solidSvg(G.disc(0, 2.4, r, F, P, { steps: 40 }), { tone: 'mid' })
    + `<g transform="${w.planeY(2.5)}"><path class="pm-rule" d="${ticks.join('')}"/>${g('cHands', '')}<circle class="pm-pin" cx="${x}" cy="${-z}" r="1"/></g>`;
}

// the calendar strip on the side wall: nine weeks, go-live in week 6 (index 6)
const CAL = w.calendar({ y0: 56, z0: 126, weeks: 9, cw: 13, ch: 22 });
const LIVE = 6;
const calCells = Array.from({ length: 9 }, (_, i) => CAL.cell(i).map(f1));
const calendar = CAL.svg + `<g transform="${CAL.face}">${g('calMarks', '')}</g>`;

// the cast: the team lead instructs at the bench, the learner beside him, you
// a step back; heads at z 172 for the speech bubbles
const SPOT = {
  teamlead: { x: 166, y: 46, along: 'x', reach: [190, 98, BZ + 10] },
  learner: { x: 228, y: 52, along: 'x' },
  jij: { x: 60, y: 168, along: 'y' },
};
const HEAD = Object.fromEntries(Object.entries(SPOT).map(([r, s]) => [r, w.at([s.x, s.y, 172]).map(f1)]));
// the learner: the team lead's body (work vest, reflective bands, no reach)
// with the planner's tablet put in before the neck, so the order of parts is the
// planner's (the dark-theme skin rule below counts from the end); the jacket
// (both arms and the torso, parts 6 to 8) gets the tw-work tint
const partsOf = (html) => {
  const inner = html.replace(/^<g data-cue="[^"]+">/, '').replace(/<\/g>$/, '');
  const parts = inner.match(/<path class="iso-halo"[^>]*\/>|<g class="iso-solid"[^>]*>(?:(?!<g[ >]).)*?<\/g>/gs) || [];
  assert(parts.join('') === inner, 'a person is a halo and solids, no nested groups');
  return parts;
};
function learner() {
  const body = partsOf(w.person({ ...SPOT.learner, role: 'teamlead' }));
  const tab = partsOf(w.person({ ...SPOT.learner, role: 'planner' }));
  assert(body.length === 11 && tab.length === 12, 'person parts: halo, 2 shoes, 2 legs, arm, torso, arm, (tablet), neck, hair, head');
  const work = (part) => part.replace('class="iso-solid"', 'class="iso-solid tw-work"');
  return `<g data-cue="learner">${[...body.slice(0, 5), ...body.slice(5, 8).map(work), tab[8], ...body.slice(8)].join('')}</g>`;
}
const person = (role) => (role === 'learner' ? learner() : w.person({ ...SPOT[role], role }));

const world = [
  w.room(ROOM),
  cueG('clock', clock()),
  cueG('sheet', sheet),
  cueG('cal', calendar),
  person('teamlead'),
  person('learner'),
  cueG('bench', w.table(BENCH) + drawers() + cueG('joint', joint())),
  person('jij'),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// Every block the panel draws is a static cue group here (the player lights
// the groups it finds at start, so each beat's focus names the block it
// explains); the stage fills their contents per scene: o[key] goes into data-k
// "t_<key>".
const SLOTS = ['page', 'steps', 'key', 'app', 'write', 'keyex', 'test', 'twi', 'four', 'motto', 'toyota', 'room', 'ojt',
  'who', 'when', 'shifts', 'morning', 'week', 'same', 'reports', 'kirk', 'smiley', 'rule', 'expert'];
const slot = (key) => cueG(key, g(`t_${key}`, ''));
const PX = 322;
const PW = 308;
const hud = g('panel', `<rect class="tw-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>` + g('pHead', '') + SLOTS.map(slot).join(''));
const svg = `<svg class="iso-svg fp-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="">${g('world', world + g('bubbles', ''))}${g('hud', hud)}</svg>`;

// ---------------------------------------------------------------- cameras (one gentle move per scene)
// [cx, cy, s]: the stage point (cx, cy) stays put while the room scales by s
const pt = (p) => w.at(p).map(f1);
const SHEET_AT = pt([79, 0, 140]);
const BENCH_AT = pt([186, 100, 110]);
const CAL_AT = pt([0, 110, 140]);
const CLOCK_AT = pt([232, 0, 170]);
const CAM = [
  { from: [150, 210, 1], to: [SHEET_AT[0], SHEET_AT[1] + 40, 1.14] },
  { from: [BENCH_AT[0], BENCH_AT[1], 1.06], to: [BENCH_AT[0], BENCH_AT[1] - 10, 1.16] },
  { from: [150, 200, 1.02], to: [BENCH_AT[0], BENCH_AT[1], 1.14] },
  { from: [BENCH_AT[0], BENCH_AT[1], 1.12], to: [150, 200, 1.02] },
  { from: [150, 200, 1.02], to: [CAL_AT[0] + 30, CAL_AT[1] + 30, 1.12] },
  { from: [CLOCK_AT[0], CLOCK_AT[1] + 70, 1.06], to: [CLOCK_AT[0], CLOCK_AT[1] + 60, 1.14] },
  { from: [150, 200, 1.04], to: [150, 210, 1] },
];

// ---------------------------------------------------------------- the film
const C = { PX, PW, SLOTS, HEAD, SHEET, CLOCK, calCells, LIVE, STEPS, HARD, REPORTS };
const spec = {
  id: TRN,
  title: { nl: 'Instructie op de werkplek', en: 'On-the-job instruction' },
  lessons: [TRN],
  strictFocus: true,
  scenes: [
    {
      id: 's1', lesson: TRN, level: 1, still: 0.9, title: { nl: 'Eén A4 per taak', en: 'One page per task' },
      beats: [
        { nl: 'Schrijf de nieuwe manier op als {t:Werkinstructie|werkinstructie}: één A4 per taak.', en: 'Write the new way down as a {t:Work instruction|work instruction}: one page per task.', cue: { Werkinstructie: 'page' }, focus: ['page', 'sheet'] },
        { nl: 'De stappen op volgorde, met foto’s van de echte apparatuur.', en: 'The steps in order, with photos of the real equipment.', focus: ['steps', 'sheet'] },
        { nl: 'Per stap het {t:Kernpunt|kernpunt}: het detail waardoor het goed of fout gaat, plus waarom.', en: 'For each step the {t:Key point|key point}: the detail that makes it go right or wrong, plus why.', cue: { Kernpunt: 'key' }, focus: 'key' },
      ],
    },
    {
      id: 's2', lesson: TRN, level: 1, still: 0.9, title: { nl: 'Een netbeheerder', en: 'A grid operator' },
      beats: [
        { nl: 'Een netbeheerder: monteurs geven revisiegegevens voortaan door met een app.', en: 'A grid operator: technicians now report as-built data with an app.', focus: ['app', 'learner', 'joint'] },
        { nl: 'Schrijf hem met wie het werk doet. Jij en de teamleider: zes stappen, foto’s van de schermen.', en: 'Write it with those who do the work. You and the team lead: six steps, photos of the screens.', focus: ['write', 'jij', 'teamlead'] },
        { nl: 'Kernpunt: “fotografeer de mof voordat de sleuf dichtgaat, want daarna kan het niet meer.”', en: 'Key point: “photograph the joint before the trench is filled in, because you can’t afterwards.”', focus: ['keyex', 'joint'] },
        { nl: 'Test: iemand die er niet bij was volgt hem, jij kijkt. Waar hij aarzelt, is hij onduidelijk.', en: 'Test it: someone who wasn’t involved follows it while you watch. Where they hesitate, it’s unclear.', focus: ['test', 'learner', 'jij'] },
        { nl: 'Een monteur die er niet bij was loopt vast bij stap {n:4}. Die herschrijf je.', en: 'A technician who wasn’t involved gets stuck on step {n:4}. You rewrite it.', focus: ['app', 'learner'] },
      ],
    },
    {
      id: 's3', lesson: TRN, level: 1, still: 0.9, title: { nl: 'Vier stappen', en: 'Four steps' },
      beats: [
        { nl: 'Dit komt uit {t:TWI|TWI}, Training Within Industry: een Amerikaans oorlogsprogramma uit 1940.', en: 'This comes from {t:TWI|TWI}, Training Within Industry: a US wartime programme started in 1940.', cue: { TWI: 'twi' }, focus: 'twi' },
        { nl: 'Tot 1945 reikte het meer dan {n:1.6} miljoen certificaten uit.', en: 'By 1945 it had issued over {n:1.6} million certificates.', focus: 'twi' },
        { nl: 'Job Instruction, stap 1: de leerling voorbereiden.', en: 'Job Instruction, step 1: prepare the learner.', focus: ['four', 'teamlead', 'learner'] },
        { nl: 'Stap 2: voordoen en uitleggen, stap voor stap, met de kernpunten.', en: 'Step 2: show and explain, one step at a time, with the key points.', focus: ['four', 'teamlead', 'joint'] },
        { nl: 'Stap 3: zelf laten proberen, terwijl jij corrigeert.', en: 'Step 3: let them try, while you correct.', focus: ['four', 'learner', 'joint'] },
        { nl: 'Stap 4: later nagaan hoe het gaat.', en: 'Step 4: follow up later.', focus: ['four', 'teamlead'] },
      ],
    },
    {
      id: 's4', lesson: TRN, level: 1, still: 0.9, title: { nl: 'Klaslokaal of werkplek', en: 'Classroom or floor' },
      beats: [
        { nl: '“Heeft de medewerker het niet geleerd, dan heeft de instructeur het niet aangeleerd.”', en: '“If the worker hasn’t learned, the instructor hasn’t taught.”', focus: ['motto', 'teamlead'] },
        { nl: 'Toyota nam de methode in de jaren 50 over.', en: 'Toyota adopted it in the 1950s.', focus: 'toyota' },
        { nl: 'Een klaslokaal is goed voor het waarom en het grote plaatje, in {n:30} tot {n:60} minuten.', en: 'A classroom is good for the why and the big picture, in {n:30} to {n:60} minutes.', focus: 'room' },
        { nl: 'Vaardigheden: {t:Training op de werkplek|training op de werkplek}. Voordoen, samen doen, zelf doen, checken.', en: 'Skills: {t:On-the-job training|on-the-job training}. Show, do together, let them do, check.', cue: { 'Training op de werkplek': 'ojt' }, focus: ['ojt', 'teamlead', 'learner'] },
      ],
    },
    {
      id: 's5', lesson: TRN, level: 1, still: 0.9, title: { nl: 'Wie en wanneer', en: 'Who and when' },
      beats: [
        { nl: 'Ploegleiders of ervaren operators zijn de beste trainers, als je hen eerst traint.', en: 'Shift leads or experienced operators make the best trainers, if you train them first.', focus: ['who', 'teamlead'] },
        { nl: 'Train vlak voordat mensen het nodig hebben: zes weken voor de livegang is het vergeten.', en: 'Train just before people need it: six weeks before go-live, it’s mostly forgotten.', focus: ['when', 'cal'] },
        { nl: 'Korte sessies in de week ervoor, begeleiding op de vloer in de eerste twee weken erna.', en: 'Short sessions in the week before, support on the floor in the first two weeks after.', focus: ['when', 'cal'] },
        { nl: 'Elke ploeg komt aan bod, ook nacht en weekend, die projecten vaak vergeten.', en: 'Cover every shift, nights and weekends too: projects often forget them.', focus: ['shifts', 'clock'] },
        { nl: 'Netbeheerder: {n:30} minuten in het ochtendoverleg, daarna gaat de teamleider mee op de eerste klus.', en: 'Grid operator: {n:30} minutes in the morning meeting, then the team lead joins each first job.', focus: ['morning', 'teamlead', 'learner'] },
      ],
    },
    {
      id: 's6', lesson: TRN, level: 1, still: 0.9, title: { nl: 'Een week later', en: 'A week later' },
      beats: [
        { nl: 'Een week later: kijk hoe mensen het zonder hulp doen. Niet om ze te beoordelen.', en: 'A week later: watch people do it without help. Not to judge them.', focus: ['week', 'jij', 'learner'] },
        { nl: 'Maken veel mensen dezelfde fout, dan is de instructie fout, niet de mensen.', en: 'When many people make the same mistake, the instruction is wrong, not the people.', focus: ['same', 'sheet'] },
        { nl: 'Van {n:20} meldingen zijn er {n:15} compleet en {n:5} zonder moffoto.', en: 'Of {n:20} reports, {n:15} are complete and {n:5} lack the joint photo.', focus: 'reports' },
        { nl: 'Alle {n:5} komen van ploegen die om 6:00 beginnen, voordat de teamleider er is.', en: 'All {n:5} come from crews starting at 6:00, before the team lead arrives.', focus: ['reports', 'clock'] },
        { nl: 'Volgende week begint er dus een teamleider vroeger.', en: 'So next week, a team lead starts early.', focus: ['reports', 'teamlead'] },
      ],
    },
    {
      id: 's7', lesson: TRN, level: 1, still: 0.9, title: { nl: 'Wat je meet', en: 'What you measure' },
      beats: [
        { nl: 'De {t:Kirkpatrick-niveaus|Kirkpatrick-niveaus}: leuk gevonden, geleerd, doen ze het, betere resultaten?', en: 'The {t:Kirkpatrick levels|Kirkpatrick levels}: liked it, learned it, do it on the job, better results?', cue: { 'Kirkpatrick-niveaus': 'kirk' }, focus: 'kirk' },
        { nl: 'De meeste projecten stoppen bij de eerste: een formulier met smileys.', en: 'Most projects stop at the first: a smiley form.', focus: ['smiley', 'kirk'] },
        { nl: 'De 70-20-10-regel is een praktijkmodel met zwak bewijs.', en: 'The 70-20-10 rule is a practitioner model with weak evidence.', focus: 'rule' },
        { nl: 'Ken je de taak niet goed? Laat de expert trainen, en check jij het resultaat.', en: 'Don’t know the task well? Let the expert train, and check the result yourself.', focus: ['expert', 'teamlead', 'jij'] },
      ],
    },
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson's
// teach text and worked example, so every point of the checklist above is
// said here. No symbol the voice would read aloud, no spoken parenthesis or
// quote; years and the 70-20-10 rule as words. Dutch checked with espeak-ng
// phonemes through Piper's own bridge (nl_NL-alex, 2026-11-12); see the guard
// below for the words reworded instead of a new SAY rule: smileys (read
// "smie-le-is") is "lachende gezichtjes", operators ("oo-pee-raa-tors") is "ervaren
// mensen van de vloer", projecten (espeak-ng stresses PROO-) has its own
// lexicon entry next to "project" (films/_kit/lexicon.nl.json), and Toyota gets one new Dutch SAY rule in
// films/_kit/timeline.mjs, "Tojota" (espeak-ng reads "too-ie-oota"; no other
// film says it). TWI is spelled out by both voices as it stands.
const SAY = [
  [ // s1 one page per task
    { nl: 'Een project verandert hoe mensen werken. Schrijf de nieuwe manier daarom op als korte {t:Werkinstructie|werkinstructie}: één A4 per taak.',
      en: 'A project changes how people work. So write the new way down as a short {t:Work instruction|work instruction}: one page per task.' },
    { nl: 'Daarop staan de stappen, op volgorde, met foto\'s van de echte apparatuur.',
      en: 'It lists the steps, in order, with photos of the real equipment.' },
    { nl: 'En per stap het {t:Kernpunt|kernpunt}: het detail waardoor het goed of fout gaat. Schrijf er ook bij waarom dat ertoe doet.',
      en: 'And for each step the {t:Key point|key point}: the detail that makes it go right or wrong. Write down why it matters, too.' },
  ],
  [ // s2 a grid operator
    { nl: 'Een voorbeeld. Een netbeheerder laat monteurs voortaan met een app doorgeven waar de kabel en de moffen echt liggen. Moffen zijn de verbindingen tussen de kabelstukken.',
      en: 'An example. A grid operator has its technicians report as-built data with an app: where the cable and its joints actually ended up. The joints are the connections between cable lengths.' },
    { nl: 'Schrijf zo\'n instructie met de mensen die het werk doen. Jij schrijft hem hier met de teamleider: zes stappen, met foto\'s van de schermen van de app.',
      en: 'Write such an instruction with the people who do the work. Here you write it with the team leader: six steps, with photos of the app screens.' },
    { nl: 'Eén kernpunt: fotografeer de mof voordat de sleuf weer dichtgaat. Waarom? Daarna kan het niet meer.',
      en: 'One key point: photograph the joint before the trench is filled in again. Why? Because you can\'t afterwards.' },
    { nl: 'Dan test je hem. Laat iemand die er niet bij was de instructie volgen, terwijl jij kijkt. Waar hij aarzelt, is de instructie onduidelijk.',
      en: 'Then you test it. Let someone who wasn\'t involved follow the instruction while you watch. Where they hesitate, the instruction is unclear.' },
    { nl: 'Bij de netbeheerder loopt zo\'n monteur vast bij stap {n:4}. Die stap herschrijf je.',
      en: 'At the grid operator, such a technician gets stuck on step {n:4}. You rewrite that step.' },
  ],
  [ // s3 four steps
    { nl: 'Deze manier van instrueren komt uit TWI, Training Within Industry: een Amerikaans oorlogsprogramma dat begon in 1940.',
      en: 'This way of instructing comes from TWI, Training Within Industry: a US wartime programme that started in 1940.' },
    { nl: 'Tot 1945 reikte het meer dan {n:1.6} miljoen certificaten uit.',
      en: 'By 1945 it had issued over {n:1.6} million certificates.' },
    { nl: 'De methode Job Instruction heeft vier stappen. Eén: bereid de leerling voor. Vertel welke taak hij gaat leren.',
      en: 'Its Job Instruction method has four steps. One: prepare the learner. Say which task they will learn.' },
    { nl: 'Twee: doe het voor en leg het uit, stap voor stap, en benoem bij elke stap het kernpunt.',
      en: 'Two: show and explain, one step at a time, and name the key point of each step.' },
    { nl: 'Drie: laat hem het zelf proberen, terwijl jij corrigeert. Laat hem daarbij de kernpunten vertellen.',
      en: 'Three: let them try it themselves while you correct. Have them tell you the key points as they go.' },
    { nl: 'Vier: ga later na hoe het gaat. Hij werkt nu zelf, weet bij wie hij terecht kan, en jij komt geregeld kijken.',
      en: 'Four: follow up. They now work on their own, know whom to ask for help, and you check in regularly.' },
  ],
  [ // s4 classroom or floor
    { nl: 'Het motto van TWI geldt nog steeds: heeft de medewerker het niet geleerd, dan heeft de instructeur het niet aangeleerd.',
      en: 'The TWI motto still holds: if the worker hasn\'t learned, the instructor hasn\'t taught.' },
    { nl: 'Toyota nam de methode in de jaren vijftig over.',
      en: 'Toyota adopted it in the nineteen fifties.' },
    { nl: 'Klaslokaal of werkplek? Een klaslokaal is goed voor het waarom en het grote plaatje, in {n:30} tot {n:60} minuten.',
      en: 'Classroom or floor? A classroom is good for the why and the big picture, in {n:30} to {n:60} minutes.' },
    { nl: 'Vaardigheden leer je met {t:Training op de werkplek|training op de werkplek}: voordoen, samen doen, zelf laten doen terwijl jij kijkt, en later checken.',
      en: 'Skills are learned through {t:On-the-job training|on-the-job training}: show it, do it together, let them do it while you watch, and check later.' },
  ],
  [ // s5 who and when
    { nl: 'Wie geeft de training? Ploegleiders of ervaren mensen van de vloer zijn de beste trainers, als je hen eerst zelf traint.',
      en: 'Who trains? Shift leads or experienced operators make the best trainers, if you train them first.' },
    { nl: 'En train vlak voordat mensen het nodig hebben. Een sessie zes weken voor de livegang is tegen die tijd grotendeels vergeten.',
      en: 'And train just before people need it. A session six weeks before go-live is mostly forgotten by then.' },
    { nl: 'Plan korte sessies in de week voor de livegang, en begeleiding op de vloer in de eerste twee weken erna.',
      en: 'Plan short sessions in the week before go-live, and support on the floor in the first two weeks after.' },
    { nl: 'Zorg dat elke ploeg aan bod komt, ook nacht en weekend, die projecten vaak vergeten.',
      en: 'Cover every shift, including nights and weekends. Projects often forget those.' },
    { nl: 'Bij de netbeheerder krijgen de monteurs {n:30} minuten in het ochtendoverleg, over het waarom. Daarna gaat de teamleider mee met de eerste klus van elke monteur.',
      en: 'At the grid operator, the technicians get {n:30} minutes in the morning meeting, on why. Then the team leader goes along on each technician\'s first job.' },
  ],
  [ // s6 a week later
    { nl: 'Check daarna of het blijft hangen. Kijk een week later hoe mensen het zonder hulp doen. Niet om ze te beoordelen, maar om te zien of de instructie of de training beter moet.',
      en: 'Then check that it stuck. A week later, watch people do it without help. Not to judge them, but to see whether the instruction or the training needs fixing.' },
    { nl: 'Maken veel mensen dezelfde fout, dan is de instructie fout, niet de mensen.',
      en: 'When many people make the same mistake, the instruction is wrong, not the people.' },
    { nl: 'Bij de netbeheerder check je na een week {n:20} meldingen. Er zijn er {n:15} compleet, en {n:5} zonder foto van de mof.',
      en: 'At the grid operator, a week later you check {n:20} reports. {n:15} are complete, and {n:5} have no photo of the joint.' },
    { nl: 'Alle {n:5} komen van ploegen die om zes uur beginnen, voordat de teamleider er is.',
      en: 'All {n:5} come from crews who start at six, before the team leader arrives.' },
    { nl: 'Dus begint er volgende week een teamleider vroeger.',
      en: 'So next week, a team leader starts early.' },
  ],
  [ // s7 what you measure
    { nl: 'Trainers meten vaak het verkeerde. De {t:Kirkpatrick-niveaus|Kirkpatrick-niveaus}, van Donald Kirkpatrick uit 1959, zetten vier checks op een rij. Vonden ze het leuk? Hebben ze het geleerd? Doen ze het op de werkplek? En zijn de resultaten beter?',
      en: 'Trainers often measure the wrong thing. The {t:Kirkpatrick levels|Kirkpatrick levels}, from Donald Kirkpatrick in 1959, rank four checks. Did they like it? Did they learn it? Do they do it on the job? And did results improve?' },
    { nl: 'De meeste projecten stoppen bij de eerste: een formulier met lachende gezichtjes.',
      en: 'Most projects stop at the first: a smiley form.' },
    { nl: 'Experts twisten of een klaslokaal wel nodig is. Vaak hoor je de regel zeventig, twintig, tien: zeventig procent leer je in het werk, twintig van anderen, en tien in cursussen. Dat is een praktijkmodel met zwak bewijs.',
      en: 'Experts argue whether a classroom is needed at all. You often hear the seventy, twenty, ten rule: seventy percent learned on the job, twenty from others, and ten in courses. It is a practitioner model with weak evidence.' },
    { nl: 'En ken je de taak zelf niet goed? Laat de expert trainen, en check jij het resultaat.',
      en: 'And if you don\'t know the task well yourself, let the expert train, and check the result yourself.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, and in
// Dutch none of the words espeak-ng misreads (see above)
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
const MISREAD = /\b(\w*manager\w*|operators?|as-built|revisiegegevens|smileys?|e-?mail|go-live)\b/i;
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const plain = plainSay(line[lang]);
  if (/[/&×=+()“”"‘…%]/.test(plain)) throw new Error(`narration: a symbol the voice reads aloud in "${plain.slice(0, 50)}"`);
  if (lang === 'nl' && MISREAD.test(plain)) throw new Error(`narration: "${MISREAD.exec(plain)[0]}" is misread by the Dutch voice in "${plain.slice(0, 50)}"`);
}
// each scene's length from its share of the Dutch narration, never shorter than
// its captions need; the whole about as long as the narration plus a short
// look per scene, within the 300 s cap
{
  const said = SAY.map((sc) => sc.reduce((a, l) => a + wordsOf(plainSay(l.nl)), 0));
  const all = said.reduce((a, b) => a + b, 0);
  const TOTAL = Math.min(296, Math.ceil(all / 2.5) + 2 * SAY.length);
  spec.scenes.forEach((s, si) => {
    const cap = Math.max(...['nl', 'en'].map((lang) => minSceneDur(wordsOf(s.beats.map((b) => plainSay(b[lang])).join(' ')) + 4)));
    s.dur = Math.max(Math.ceil(cap), Math.floor((said[si] / all) * TOTAL));
  });
  const total = spec.scenes.reduce((a, s) => a + s.dur, 0);
  if (total > 300) throw new Error(`film is ${total} s, over 300`);
}
// each beat's still (reduced motion) sits late in its own share of the scene
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
C.dur = spec.scenes.map((s) => s.dur);

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const PEOPLE = ':is([data-cue="jij"],[data-cue="teamlead"],[data-cue="learner"])';
const css = PM_CSS + `
.tw-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.tw-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.tw-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.tw-c1{fill:var(--anatomy-shade-1);stroke:none}
.tw-c2{fill:var(--anatomy-shade-2);stroke:none}
.tw-c3{fill:var(--anatomy-mid);stroke:none}
.tw-dot{fill:var(--fp-accent);stroke:none}
.tw-hole{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6}
.tw-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.tw-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.tw-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.tw-lab{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.tw-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.tw-strike{fill:none;stroke:var(--anatomy-strong);stroke-width:2;stroke-linecap:round}
.tw-line{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-linecap:round}
.tw-rule2{fill:none;stroke:var(--anatomy-mid);stroke-width:.6;stroke-linecap:round}
.tw-photo{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:.4}
.tw-mark{fill:var(--fp-accent);stroke:none}
.tw-hand{fill:none;stroke:var(--anatomy-strong);stroke-width:1.2;stroke-linecap:round}
.tw-cal{fill:color-mix(in srgb,var(--fp-accent) 40%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:.5}
.tw-calx{fill:none;stroke:var(--anatomy-strong);stroke-width:.8;stroke-linecap:round}
.tw-bub{fill:var(--anatomy-card);stroke:var(--anatomy-mid);stroke-width:1.2;stroke-linejoin:round}
.tw-bubon{fill:var(--anatomy-card);stroke:var(--fp-accent);stroke-width:2;stroke-linejoin:round}
.tw-tick{fill:none;stroke:var(--fp-accent);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
[data-cue][data-on] .tw-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .tw-lab,[data-cue][data-on] .tw-txt,[data-cue][data-on] .tw-big,[data-cue][data-on] .tw-mute{fill:var(--fp-focus-text)}
[data-cue][data-on] .tw-rule2,[data-cue][data-on] .tw-line{stroke:var(--fp-accent)}
[data-cue][data-on] .tw-c3,[data-cue][data-on] .tw-c2,[data-cue][data-on] .tw-photo{fill:color-mix(in srgb,var(--fp-accent) 40%,var(--anatomy-face))}
/* the learner's orange work jacket (a lit learner keeps the focus colours) */
[data-cue="learner"]:not([data-on])>.tw-work>:is(.iso-fill,.iso-top){fill:color-mix(in srgb,#E07B24 52%,var(--anatomy-top))}
[data-cue="learner"]:not([data-on])>.tw-work>.iso-shade{fill:color-mix(in srgb,#C2620F 55%,var(--anatomy-shade-1))}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (world.mjs gives heads only a light outline) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="teamlead"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
`;

const label = {
  nl: 'Een hoek van een werkplaats. Tegen de achterwand een werkbank met een kabel en een mof erop; aan de wand de werkinstructie van één A4, die zich stap voor stap vult, en een klok. Op de zijwand een kalender met de weken rond de livegang. De teamleider staat aan de werkbank en wijst naar de mof; naast hem de monteur in een oranje werkjas, met een tablet; jij, de adviseur in petrol, staat een stap terug. Rechts een paneel met kaarten, gemarkeerd als voorbeeld of schema: een werkinstructie met stappen, foto’s en kernpunten; de instructie van de netbeheerder met zes stappen en stap 4 herschreven; TWI en de vier stappen van Job Instruction; het motto en Toyota; klaslokaal tegenover de werkplek; wie traint en wanneer, met de weken rond de livegang en elke ploeg; twintig meldingen, waarvan vijf zonder foto, van de ploegen van zes uur; en de vier Kirkpatrick-niveaus, de smileys en de regel 70-20-10.',
  en: 'A corner of a workshop. Against the back wall a workbench with a cable and a joint on it; on the wall the one-page work instruction, which fills step by step, and a clock. On the side wall a calendar with the weeks around go-live. The team lead stands at the bench and points at the joint; beside him the technician in an orange work jacket, with a tablet; you, the consultant in petrol, stand a step back. At the right a panel with cards, marked as example or diagram: a work instruction with steps, photos and key points; the grid operator’s instruction with six steps and step 4 rewritten; TWI and the four steps of Job Instruction; the motto and Toyota; classroom versus the floor; who trains and when, with the weeks around go-live and every shift; twenty reports, five without a photo, from the six o’clock crews; and the four Kirkpatrick levels, the smileys and the 70-20-10 rule.',
};

const { data } = await defineFilm(spec, { svg, script: stageScript, css, kitCss: k.ISO_CSS, label });

if (process.argv.includes('--audit')) {
  console.log(auditReport(data));
  const bad = [...svg.matchAll(/ d="([^"]*)"/g)].filter(([, d]) => /NaN|undefined|Infinity|object/.test(d));
  if (bad.length) throw new Error(`${bad.length} static paths with NaN or undefined`);
  console.log(`static drawing: ${(svg.length / 1024).toFixed(1)} KB, no NaN in any path`);
  const words = (lang) => data.scenes.reduce((a, s) => a + s.beats.reduce((n, b) => n + b.voice[lang].split(/\s+/).filter(Boolean).length, 0), 0);
  console.log(`narration words: nl ${words('nl')}, en ${words('en')}`);
}

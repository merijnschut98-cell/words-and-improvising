// Dev tool, not shipped. Builds the explainer film "Van livegang tot gewoonte /
// From go-live to habit" for Projecten: pm.land.change (level 1 of the topic
// Adoptie en overdracht, "Wat adoptie echt drijft"), pm.land.resistance
// (level 2, "Werken met weerstand") and pm.land.communication (level 3,
// "Verandering communiceren").
//
//   node films/pm.land.adoption/build.mjs            build the page
//   node films/pm.land.adoption/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.land.adoption.html: one offline page with
// the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7
// (pm.land.adoption, P2: operators moving through ADKAR, resistance shown and
// worked with, the cascade; about 120 s; outline of five scenes). Storyboard
// drift: nine scenes and about five minutes, because a lesson with a film no
// longer shows its worked example, so the film carries all fifteen teach
// blocks and the three examples: the go-live and what drives adoption (s1),
// Kotter and ADKAR (s2), the eight operators as an ADKAR diagnosis (s3, the
// change example), three forms of resistance (s4), what is behind it (s5),
// coffee with Henk (s6, the resistance example), who hears what when (s7), the
// middle managers and repeating (s8), and a cascade in four weeks (s9, the
// communication example, a faded one: the film gives its reveal). The
// outline's "most stall at ability" follows the lesson instead: three of the
// eight stall at desire and reinforcement, two at ability.
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only here):
// a meeting room with a whiteboard (the board repeats the panel's card in
// miniature) and a wall clock; in this folder, a line terminal (a touchscreen
// on a post) by the back wall, two operators and Henk the setter, drawn with
// w.person and a hard hat; a table with the communication plan (one A4) and two
// cups; and the recurring cast: "jij" the consultant in petrol at the board,
// the sponsor (the plant manager), the team lead (the shift lead, the middle
// manager) and the planner. A panel at the right, in stage space, carries one
// card per scene, labelled "schema" (a general picture) or "voorbeeld" (the
// worked examples; a scene that moves from example to rule switches its label
// at that beat). Each block of a card is its own cue group, so every sentence
// lights what it explains (strictFocus).
//
// Checklist (lesson point: scene and beat; "card" = on the card, not spoken,
// each on screen for at least 4 s):
//   change teach 1: change management, the work of getting people to work the
//     new way (s1 b5); two models (s2 b1); Kotter's eight steps, John Kotter,
//     Leading Change, 1996 (s2 b1; title on the card), for the organisation
//     (s2 b1): urgency, a group that drives it, a clear picture, communicate,
//     remove obstacles, quick wins, keep going, anchor (s2 b2; all eight on the
//     card, the voice names the first two and the last two)
//   change teach 2: ADKAR, from Prosci (Jeff Hiatt), for one person, the five
//     steps with their meaning (s2 b3); a diagnosis (s3 b1), not a slide
//     (card); not
//     aware: hear it from the boss; no desire: what they lose; no knowledge:
//     explain; no ability: practise on the job; no reinforcement: someone asks
//     every week (s3 b1)
//   change teach 3: adoption, really used, also when nobody watches (s1 b4);
//     easier for whoever does the work, the direct boss asks, they helped
//     shape it, the old way is gone, no fallback (s1 b6; "direct" and "no
//     fallback" on the card); takes the operator
//     longer: no campaign saves it (s1 b7)
//   change teach 4: the reason in their terms, not "improve the OEE" (its
//     gloss on the card) but "not called in on Saturday because the line is
//     behind" (s3 b6); don't know why: ask five "what makes this hard to use?",
//     usually one practical thing to fix this week (s3 b7; the last on the
//     card)
//   change teach 5: watch the weeks after go-live, the day the new way
//     officially starts; the old way tempts, problems surface (s1 b2); experts
//     doubt "70% fail", Mark Hughes 2011 found no solid evidence (s2 b4; the
//     name on the card and spoken in both languages); Kotter criticised as too top-down (s2
//     b4); the sharp question "what does the operator lose?" (s3 b7)
//   change example: packaging plant, every stop over 2 minutes on a new
//     terminal, a touchscreen PC next to the line (s1 b1); after six weeks
//     40% (s1 b3); eight operators asked, awareness and knowledge fine (s3 b2);
//     three: nothing is done with it; two: terminal at the end of the line,
//     30 m from the stops (s3 b3); the shift lead opens each shift start with
//     yesterday's top three stops and what happens to them (desire,
//     reinforcement), maintenance moves the terminal to the middle (ability)
//     (s3 b4); four weeks later 85% (s3 b5)
//   resistance teach 1: slowing or blocking, three forms (s4 b1); open:
//     arguments, anger, "this won't work" (s4 b2); passive: yes in the
//     meeting, nothing after, "too busy", missing sessions (s4 b3); hidden:
//     "tried that in 2019", the old spreadsheet kept, data that never comes
//     (s4 b4); open is a gift, it tells you what to work on; the other two
//     must be found first (s4 b5)
//   resistance teach 2: it tells you something real: a loss (status, skill,
//     control, overtime pay), extra work, an earlier failed project they paid
//     for, a flaw in your design they see
//     (s5 b1); ask before judging "what
//     would have to be true for this to work for you?" (s5 b2)
//   resistance teach 3: invite the sharpest critic into the design; a
//     converted critic convinces others better than you (s6 b4; the second
//     half on the card in b5); Coch and
//     French 1948, a pyjama factory in Virginia: co-designers got output back
//     faster and quit less (s6 b6; names spoken in both languages, Virginia on
//     the card)
//   resistance teach 4: be honest about a real loss, "yes, you lose the
//     Saturday overtime" (s5 b3; "here is why we still think it right" on the
//     card); no "resister" label with management, it sticks and closes
//     the door (s5 b3);
//     coffee one-on-one away from the meeting, ask about earlier changes, the
//     real story (s6 b2)
//   resistance teach 5: the change curve, shock, denial, frustration,
//     acceptance, borrowed by management writers from Kübler-Ross's 1969
//     stages for dying patients, not about organisations; a dip is normal,
//     little evidence of fixed stages (s5 b4); with Heifetz: people resist
//     loss, not change; treating all resistance as bad attitude (s5 b5)
//   resistance example: a metal works, Henk the most senior setter, the new
//     planning board "for office people", arms crossed, colleagues follow (s6
//     b1); coffee, what worries him (s6 b2); he used to decide the order on
//     the floor, now a planner from the office; the big press needs 40
//     minutes to warm up after a weekend (s6 b3); Henk sets the board's rules
//     with the planner, the warm-up rule goes in (s6 b4); two weeks later he
//     explains the board to the night shift himself (s6 b5)
//   communication teach 1: a stakeholder, affected or able to influence; who
//     hears what when; directly, indirectly affected, managers (s7 b1); five
//     questions per group, the one-page table is the communication plan (s7 b2)
//   communication teach 2: sequence; managers before their teams so they can
//     answer; the cascade; never first in the corridor or from another site
//     (s7 b3); a rumour: the same day, "what we know, what not yet, and when"
//     (s7 b4)
//   communication teach 3: the middle manager, shift lead or team leader
//     between the top and the floor, the key channel; the plant manager
//     explains why, the shift lead gets "what does this mean for my Monday?"
//     (s8 b1); equip them first: own questions answered, three key messages in
//     their own words, likely questions
//     with answers (s8 b2)
//   communication teach 4: repeat; one message in one meeting is no
//     communication; a town hall for the why, then the board, the shift start,
//     a one-on-one (s8 b3); Kotter 1995, leaders under-communicate by a factor
//     of ten (s8 b4); check it landed, ask what they understood; don't know an
//     answer: say so and when (s9 b4)
//   communication teach 5: Prosci's own surveys of change practitioners: the
//     business reason from senior leaders, what it means for my job from the
//     direct supervisor (s8 b5); the cascade that stops halfway, the sharp
//     question a week later "who of your people have you told, and what did
//     they ask?" (s9 b4)
//   communication example (faded; the film gives the reveal): a grid operator,
//     no job into the week plan without a passed readiness check; three
//     groups: five planning team leaders, their planners, the field team
//     leaders; the head of planning wants one e-mail on Friday (s9 b1); week 1
//     the head tells the five team leaders first, with a one-page FAQ; week 2
//     each tells their planners with three key messages, a short note to the
//     field team leaders (s9 b2); weeks 3 and 4 the check on the board; week 4
//     six planners asked, two think it optional, put right (s9 b3)
//
// Facts checked (2026-11-12): John P. Kotter, Leading Change, Harvard Business
// School Press 1996 (the eight stages); Kotter, "Leading Change: Why
// Transformation Efforts Fail", HBR March-April 1995, error 4,
// "undercommunicating the vision by a factor of ten". ADKAR: Jeff Hiatt,
// founder of Prosci (his book ADKAR, 2006; no year in film or lesson). Mark
// Hughes, "Do 70 per cent of all organizational change initiatives really
// fail?", Journal of Change Management 11 (4), 2011. Lester Coch and John R. P.
// French, "Overcoming resistance to change", Human Relations 1948, at the
// Harwood pyjama factory in Marion, Virginia (participation groups recovered
// output faster; fewer quits). Elisabeth Kübler-Ross, On Death and Dying,
// 1969. Heifetz: "people do not resist change, per se; people resist loss"
// (Heifetz and Linsky, Leadership on the Line, 2002); the film says "with
// Heifetz" as the lesson does. Prosci's best-practices research reports
// employees prefer business messages from senior leaders and personal-impact
// messages from their direct supervisor; credited, as in the lesson, to its
// own surveys of practitioners.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, minSceneDur, wordsOf, sayable } from '../_kit/timeline.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// What the film states, asserted against the lessons' current text (the build
// fails if one drifts); {n:...} numbers are then checked against the Dutch
// lesson text by defineFilm.
const CH = 'pm.land.change';
const RE = 'pm.land.resistance';
const CO = 'pm.land.communication';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const textOf = (id, lang) => { const l = lessons[lang].get(id); return [...l.teach, l.example.text, l.example.ask || '', l.example.reveal || ''].join('\n'); };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); for (const s of list) assert(t.includes(s), `${id} (${lang}) no longer says "${s}"`); };
says(CH, ['het werk om mensen echt op de nieuwe manier te laten werken', 'Leading Change, 1996', 'urgentie creëren, een groep vormen die het trekt, het beeld helder maken, het communiceren, obstakels weghalen, snelle zichtbare successen boeken (quick wins), doorzetten, en het verankeren',
  'van het bureau Prosci (Jeff Hiatt), is voor één persoon', 'Gebruik het als diagnose, niet als slide', 'Niet bewust: ze moeten het van hun baas horen. Geen zin: zoek uit wat ze kwijtraken. Geen kennis: uitleggen. Kunnen het niet: oefenen op de werkplek. Geen bekrachtiging: iemand moet er elke week naar vragen.',
  'ook als niemand kijkt', 'makkelijker dan de oude voor wie het werk doet; hun directe baas vraagt ernaar; ze hebben het mee vormgegeven; en de oude manier is weg', 'dan redt geen enkele campagne het',
  'niet op zaterdag wordt opgeroepen omdat de lijn achterloopt', 'vraag het vijf van hen', 'Wat maakt dit lastig om te gebruiken?', 'deze week kunt oplossen',
  'de dag dat de nieuwe manier officieel start', 'lokt de oude manier', '70% van de veranderprogramma’s mislukt', 'Mark Hughes uit 2011', 'te veel van bovenaf', 'Wat verliest de operator als hij op de nieuwe manier werkt?',
  'elke stop langer dan 2 minuten', 'touchscreen-pc naast de lijn', 'Na zes weken is maar 40%', 'vraagt het acht operators', 'bewustzijn prima', 'kennis prima', 'Er wordt toch nooit iets mee gedaan', 'aan het eind van de lijn staat, 30 meter',
  'top drie stops van gisteren', 'naar het midden van de lijn (kunnen)', 'Vier weken later: 85%']);
says(RE, ['afremmen of blokkeren', 'argumenten, boosheid, “dit gaat niet werken”', 'ja in het overleg, daarna niks; “te druk”; mensen die sessies missen', '“dat hebben we in 2019 ook geprobeerd”, de oude spreadsheet stiekem bijhouden, data die nooit komt', 'Open weerstand is een cadeau', 'die moet je eerst vinden',
  'status, vakmanschap, controle, overwerkgeld', 'extra werk voor ze', 'waarvoor zij de prijs betaalden', 'een fout in jouw ontwerp die zij zien en jij niet', '“Wat zou er moeten kloppen om dit voor jou te laten werken?”',
  'Haal de scherpste criticus bij het ontwerp', 'overtuigt anderen meer dan jij ooit zult doen', 'In 1948 lieten Coch en French in een pyjamafabriek in Virginia', 'sneller hun productie terugkregen, en minder vaak opstapten',
  'je raakt het zaterdagse overwerk kwijt', 'label “dwarsligger”', 'drink dan koffie met die persoon, één op één', 'ervaring met eerdere veranderingen',
  'schok, ontkenning, frustratie, dan acceptatie', 'Elisabeth Kübler-Ross in 1969', 'stervende patiënten', 'weinig bewijs dat mensen vaste fases doorlopen', 'Ronald Heifetz', 'niet tegen verandering verzetten, maar tegen verlies', 'alle weerstand behandelen als onwil',
  'metaalbedrijf', 'Henk', '“voor kantoormensen”', 'armen over elkaar', 'vroeger op de vloer de volgorde bepaalde', '40 minuten moet opwarmen', 'met de planner de regels voor het bord op te stellen', 'De opwarmregel komt erin', 'legt Henk het bord zelf uit aan de nachtploeg']);
says(CO, ['geraakt wordt of er invloed op heeft', 'direct geraakt', 'indirect geraakt', 'vijf vragen: wat verandert er voor mij, wanneer, waarom, wat wordt er van mij verwacht, en waar kan ik terecht met vragen', 'Die tabel op één A4 is je communicatieplan',
  'Leidinggevenden horen het voor hun teams', 'heet een cascade', 'op de gang of van een andere vestiging', 'communiceer dan dezelfde dag', '“Dit weten we, dit nog niet, en dan wel.”',
  'het belangrijkste kanaal', '“wat betekent dit voor mijn maandag?”', 'hun eigen vragen beantwoord, drie kernboodschappen', 'te verwachten vragen en antwoorden',
  'Eén boodschap in één overleg is geen communicatie', 'het bord, de ploegstart, een één-op-ééngesprek', 'Kotter (1995)', 'tien keer te weinig', 'vraag een paar mensen wat ze begrepen hebben', 'zeg wanneer je het wel weet',
  'in zijn eigen enquêtes', 'de zakelijke reden van het topmanagement', 'van hun directe leidinggevende', 'de cascade die halverwege stopt', '“Wie van je mensen heb je het verteld, en wat vroegen ze?”',
  'geen klus in de weekplanning zonder geslaagde gereedheidscheck', 'vijf teamleiders planning', 'teamleiders van de uitvoeringsploegen', 'vrijdag één mail', 'Week 1: het hoofd planning vertelt het eerst de vijf teamleiders, met een FAQ van één A4',
  'Week 2: elke teamleider vertelt het zijn planners', 'met drie kernboodschappen', 'kort bericht aan de teamleiders van uitvoering', 'staat bij elk planningsoverleg op het bord', 'In week 4 vraag je zes planners', 'Twee denken dat de check optioneel is']);
says(CH, ['only 40% of stops are logged', 'Four weeks later: 85% logged', '30 metres', 'longer than 2 minutes', '2011 review by Mark Hughes'], 'en');
says(RE, ['40 minutes to warm up', 'pyjama factory in Virginia', 'Kübler-Ross’s 1969'], 'en');
says(CO, ['factor of ten', 'In week 4 you ask six planners', 'Two think the check is optional'], 'en');
// the example's operators: eight asked, all aware and knowing how; three stall
// at desire and reinforcement, two at ability (one may say both: the lesson
// gives no overlap, so the card shows five separate operators); 40% to 85%
const ASKED = 8;
const NOTHING = 3;
const FAR = 2;
assert(NOTHING + FAR <= ASKED, 'three plus two of the eight operators stall');
const RATE = [40, 85];
assert(RATE[1] > RATE[0], 'logging went up after the two fixes');

// ---------------------------------------------------------------- the world
const W = 640;
const H = 400;
const AZ = 58;
const ROOM = { w: 300, d: 240, h: 230 };
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, 318, H, { pad: 12, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;

const BOARD = w.board({ x0: 60, x1: 230, z0: 92, z1: 196 });
const TABLE = { x: 96, y: 118, w: 150, d: 72, h: 74 };
const TZ = TABLE.h;
const PLAN = w.sheet({ x: 118, y: 132, z: TZ, w: 21, d: 29.7, lines: 7 });
// the panel's card area that the board copies, in stage units
const PANEL_AREA = { x: 324, y: 52, w: 304, h: 336 };
const fitInto = (a, x0, y0, x1, y1) => {
  const s = Math.min((x1 - x0) / a.w, (y1 - y0) / a.h);
  const ox = x0 + ((x1 - x0) - a.w * s) / 2;
  const oy = y0 + ((y1 - y0) - a.h * s) / 2;
  return `translate(${ox.toFixed(2)} ${oy.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-a.x} ${-a.y})`;
};
const BA = BOARD.area;
const boardMini = `<g transform="${BOARD.face}"><g class="pm-mini" transform="${fitInto(PANEL_AREA, BA.x0 + 3, -BA.z1 + 3, BA.x1 - 3, -BA.z0 - 3)}">${g('bMini', '')}</g></g>`;

// a line terminal: a foot, a post and a touchscreen tilted toward the room,
// with a few buttons lit on its face (the change example's terminal)
function terminal(x, y) {
  const out = [w.halo({ x: x - 14, y: y - 12, w: 28, d: 24, r: 6 })];
  out.push(w.box({ x: x - 12, y: y - 10, w: 24, d: 20, r: 3 }, 0, 3, { tone: 'lo' }, { steps: 2 }));
  out.push(w.post(x, y, 2.6, 3, 112, { tone: 'mid' }, 12));
  out.push(w.box({ x: x - 16, y: y - 2, w: 32, d: 4, r: 1 }, 108, 132, { tone: 'lo' }, { steps: 2, bevel: 0.4 }));
  const face = w.planeY(y + 2.1);
  out.push(`<g transform="${face}"><path class="pm-board" d="${w.rectD(x - 13.5, -129.5, x + 13.5, -110.5)}"/>`
    + `<path class="pm-rule" d="M${x - 10} -126H${x + 4}M${x - 10} -122H${x + 8}M${x - 10} -118H${x + 1}"/>`
    + `<circle class="pm-pin" cx="${x + 9}" cy="-114.5" r="1.6"/></g>`);
  return out.join('');
}
// an operator: the team lead's look (a work vest with reflective bands) and a
// hard hat; the person's own cue key gives way to the operator's class, so a
// group of operators is one cue (the dark-theme skin rule below finds it)
const hat = (x, y) => w.post(x + 0.5, y + 0.5, 14.2, 166.5, 168, { tone: 'hi' }, 20) + w.post(x + 0.5, y + 0.5, 11.6, 168, 175.5, { tone: 'hi' }, 20);
const operator = (x, y, along) => w.person({ x, y, role: 'teamlead', along }).replace('data-cue="teamlead"', 'class="pm-op"') + hat(x, y);

const world = [
  w.room(ROOM),
  w.clock(266, 196, 10),
  cueG('board', BOARD.svg + boardMini),
  cueG('ops', operator(208, 44, 'x') + operator(244, 40, 'x')),
  cueG('terminal', terminal(288, 36)),
  w.person({ x: 44, y: 50, role: 'jij', along: 'x', reach: [72, 6, 150] }),
  w.chair({ x: 136, y: 100, back: -1 }),
  w.chair({ x: 206, y: 100, back: -1 }),
  w.person({ x: 76, y: 182, role: 'teamlead', along: 'y' }),
  w.table(TABLE),
  cueG('sheet', PLAN.svg),
  w.laptop({ x: 214, y: 140, z: TZ, toward: 1 }),
  cueG('coffee', w.cup(166, 178, TZ) + w.cup(186, 174, TZ)),
  w.person({ x: 274, y: 156, role: 'sponsor', along: 'y' }),
  cueG('henk', operator(170, 218, 'x')),
  w.person({ x: 238, y: 222, role: 'planner', along: 'x' }),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// One card per scene, drawn by stage.js into these groups; each block of a card
// sits in its own cue group, so the narration can light it.
const PX = 322;
const PW = 308;
const CUES = ['case', 'golive', 'rate', 'adopt', 'cm', 'drivers', 'time',
  'kotter', 'steps', 'adkar', 'letters', 'critique',
  'diag', 'eight', 'stall', 'fixes', 'result', 'terms', 'ask5',
  'def', 'open', 'passive', 'hidden', 'gift',
  'loss', 'judge', 'honest', 'curve', 'heifetz',
  'henkq', 'chat', 'worry', 'rules', 'night', 'coch',
  'stake', 'plan', 'cascade', 'rumour',
  'mid', 'msgs', 'hall', 'ten', 'prosci',
  'grid', 'w12', 'w34', 'halfway'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));

// Static paths with relative line-tos (the helper of eng.mechanics.load, as in
// pm.plan.method): the same points, fewer bytes; each rewrite is read back.
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
const r1 = (v) => Math.round(v * 10) / 10;
const TERM_AT = w.at([288, 36, 110]).map(r1);
const OPS_AT = w.at([232, 42, 120]).map(r1);
const HENK_AT = w.at([176, 200, 110]).map(r1);
const SHEET_AT = w.at([128, 146, TZ]).map(r1);
const CAM = [
  { from: [TERM_AT[0], TERM_AT[1], 1.12], to: [150, 200, 1] },
  { from: [150, 190, 1.02], to: [140, 180, 1.1] },
  { from: [OPS_AT[0], OPS_AT[1], 1.04], to: [TERM_AT[0], TERM_AT[1], 1.1] },
  { from: [150, 200, 1], to: [OPS_AT[0], OPS_AT[1], 1.08] },
  { from: [150, 200, 1.08], to: [150, 210, 1] },
  { from: [HENK_AT[0], HENK_AT[1], 1.04], to: [HENK_AT[0], HENK_AT[1], 1.16] },
  { from: [SHEET_AT[0], SHEET_AT[1], 1.06], to: [150, 200, 1] },
  { from: [150, 210, 1], to: [180, 200, 1.08] },
  { from: [150, 200, 1.06], to: [150, 210, 1] },
];

// ---------------------------------------------------------------- the film
const LV = { [CH]: 1, [RE]: 2, [CO]: 3 };
const sc = (id, lesson, title, beats) => ({ id, lesson, level: LV[lesson], dur: 0, still: 0.9, title, beats });
const spec = {
  id: 'pm.land.adoption',
  title: { nl: 'Van livegang tot gewoonte', en: 'From go-live to habit' },
  lessons: [CH, RE, CO],
  strictFocus: true,
  scenes: [
    sc('s1', CH, { nl: 'Livegang is geen adoptie', en: 'Go-live is not adoption' }, [
      { nl: 'Een verpakkingsbedrijf: elke stop langer dan {n:2} minuten op een nieuwe terminal.', en: 'A packaging plant: every stop longer than {n:2} minutes on a new terminal.', focus: ['case', 'terminal'] },
      { nl: 'De {t:Livegang|livegang}: de dag dat het officieel start. Daarna lokt de oude manier.', en: '{t:Go-live|Go-live}: the day it officially starts. After it, the old way tempts.', cue: { Livegang: 'golive' }, focus: 'golive' },
      { nl: 'Na zes weken staat maar {n:40}% van de stops erin.', en: 'After six weeks, only {n:40}% of stops are logged.', focus: ['rate', 'terminal'] },
      { nl: '{t:Adoptie|Adoptie}: de nieuwe manier echt gebruiken, ook als niemand kijkt.', en: '{t:Adoption|Adoption}: actually using the new way, also when nobody is watching.', cue: { Adoptie: 'adopt' }, focus: 'adopt' },
      { nl: '{t:Verandermanagement|Verandermanagement}: het werk om mensen zover te krijgen.', en: '{t:Change management|Change management}: the work of getting people there.', cue: { Verandermanagement: 'cm' }, focus: 'cm' },
      { nl: 'Wat het drijft: makkelijker, de baas vraagt ernaar, mee vormgegeven, de oude manier weg.', en: 'What drives it: easier, the boss asks, they helped shape it, the old way is gone.', focus: ['drivers', 'teamlead'] },
      { nl: 'Kost het de operator meer tijd? Dan redt geen campagne het.', en: 'Takes the operator longer? Then no campaign will save it.', focus: ['time', 'ops'] },
    ]),
    sc('s2', CH, { nl: 'Twee modellen', en: 'Two models' }, [
      { nl: '{t:Kotter|Kotter}: acht stappen voor de organisatie. Leading Change, 1996.', en: '{t:Kotter|Kotter}: eight steps for the organisation. Leading Change, 1996.', cue: { Kotter: 'kotter' }, focus: 'kotter' },
      { nl: 'Van urgentie en een groep die trekt, tot snelle successen en verankeren.', en: 'From urgency and a group that drives it, to quick wins and anchoring it.', focus: 'steps' },
      { nl: '{t:ADKAR|ADKAR}, van Prosci, Jeff Hiatt: vijf stappen voor één persoon.', en: '{t:ADKAR|ADKAR}, from Prosci, Jeff Hiatt: five steps for one person.', cue: { ADKAR: 'adkar' }, focus: ['adkar', 'letters'] },
      { nl: 'Kritiek: geen stevig bewijs dat {n:70}% mislukt, en Kotter is te veel van bovenaf.', en: 'Critique: no solid evidence that {n:70}% fail, and Kotter is too top-down.', focus: 'critique' },
    ]),
    sc('s3', CH, { nl: 'Acht operators', en: 'Eight operators' }, [
      { nl: 'ADKAR als diagnose: welke stap ontbreekt, en wat helpt daar?', en: 'ADKAR as a diagnosis: which step is missing, and what helps there?', focus: 'diag' },
      { nl: 'Je vraagt acht operators. Iedereen weet ervan, en weet hoe het moet.', en: 'You ask eight operators. All know about it, and know how.', focus: ['eight', 'ops'] },
      { nl: 'Drie: er wordt nooit iets mee gedaan. Twee: de terminal staat {n:30} meter verderop.', en: 'Three: nothing is ever done with it. Two: the terminal is {n:30} metres away.', focus: ['stall', 'terminal'] },
      { nl: 'Ploegstart met de top drie stops van gisteren, en de terminal naar het midden.', en: 'Each shift start: yesterday’s top three stops. And the terminal moves to the middle.', focus: ['fixes', 'teamlead', 'terminal'] },
      { nl: 'Vier weken later: {n:85}%.', en: 'Four weeks later: {n:85}%.', focus: 'result' },
      { nl: 'Zeg de reden in hun termen: niet de OEE, wel geen oproep op zaterdag.', en: 'Give the reason in their terms: not OEE, but no call-in on Saturday.', focus: 'terms' },
      { nl: 'Vraag er vijf wat het lastig maakt. En: wat verliest de operator?', en: 'Ask five what makes it hard. And: what does the operator lose?', focus: ['ask5', 'ops'] },
    ]),
    sc('s4', RE, { nl: 'Drie vormen van weerstand', en: 'Three forms of resistance' }, [
      { nl: 'Weerstand: een verandering afremmen of blokkeren.', en: 'Resistance: slowing a change down or blocking it.', focus: 'def' },
      { nl: '{t:Open weerstand|Open weerstand}: argumenten, boosheid, dit gaat niet werken.', en: '{t:Open resistance|Open resistance}: arguments, anger, this won’t work.', cue: { 'Open weerstand': 'open' }, focus: 'open' },
      { nl: '{t:Passieve weerstand|Passieve weerstand}: ja in het overleg, daarna niks. Te druk.', en: '{t:Passive resistance|Passive resistance}: yes in the meeting, nothing after. Too busy.', cue: { 'Passieve weerstand': 'passive' }, focus: 'passive' },
      { nl: '{t:Verborgen weerstand|Verborgen weerstand}: in 2019 al geprobeerd, de oude lijst, geen data.', en: '{t:Hidden resistance|Hidden resistance}: tried that in 2019, the old spreadsheet, no data.', cue: { 'Verborgen weerstand': 'hidden' }, focus: 'hidden' },
      { nl: 'Open weerstand is een cadeau. De andere twee moet je eerst vinden.', en: 'Open resistance is a gift. The other two you have to find first.', focus: ['gift', 'open'] },
    ]),
    sc('s5', RE, { nl: 'Wat erachter zit', en: 'What is behind it' }, [
      { nl: 'Een {t:Verlies|verlies}, extra werk, een mislukt eerder project, of een fout in jouw ontwerp.', en: 'A {t:Loss|loss}, extra work, an earlier project that failed, or a flaw in your design.', cue: { Verlies: 'loss' }, focus: 'loss' },
      { nl: 'Vraag voor je oordeelt: wat moet er kloppen om dit voor jou te laten werken?', en: 'Ask before you judge: what would have to be true for this to work for you?', focus: 'judge' },
      { nl: 'Is het verlies echt, zeg het eerlijk. En plak geen label dwarsligger.', en: 'If the loss is real, say so honestly. And don’t label anyone a resister.', focus: 'honest' },
      { nl: 'De {t:Verandercurve|verandercurve}, van Kübler-Ross, 1969: een dip is normaal, vaste fases niet bewezen.', en: 'The {t:Change curve|change curve}, from Kübler-Ross, 1969: a dip is normal, fixed stages unproven.', cue: { Verandercurve: 'curve' }, focus: 'curve' },
      { nl: 'Met Heifetz: mensen verzetten zich niet tegen verandering, maar tegen verlies.', en: 'With Heifetz: people don’t resist change, they resist loss.', focus: 'heifetz' },
    ]),
    sc('s6', RE, { nl: 'Koffie met Henk', en: 'Coffee with Henk' }, [
      { nl: 'Een metaalbedrijf. Insteller Henk noemt het nieuwe planbord iets voor kantoormensen.', en: 'A metal works. Henk, the setter, calls the new planning board something for office people.', focus: ['henkq', 'henk'] },
      { nl: 'Koffie, één op één, weg van het overleg. Vraag naar eerdere veranderingen.', en: 'Coffee, one-on-one, away from the meeting. Ask about earlier changes.', focus: ['chat', 'coffee', 'henk'] },
      { nl: 'Vroeger bepaalde hij de volgorde. En de grote pers moet {n:40} minuten opwarmen.', en: 'He used to decide the order. And the big press needs {n:40} minutes to warm up.', focus: ['worry', 'planner'] },
      { nl: 'Haal de criticus bij het ontwerp: Henk stelt met de planner de regels op.', en: 'Invite the critic into the design: Henk writes the rules with the planner.', focus: ['rules', 'board', 'henk'] },
      { nl: 'Twee weken later legt Henk het bord zelf uit aan de nachtploeg.', en: 'Two weeks later, Henk explains the board to the night shift himself.', focus: ['night', 'henk'] },
      { nl: 'Coch en French, 1948: wie meeontwierp, herstelde sneller en stapte minder op.', en: 'Coch and French, 1948: those who helped design recovered faster and quit less.', focus: 'coch' },
    ]),
    sc('s7', CO, { nl: 'Wie hoort wat, wanneer', en: 'Who hears what, when' }, [
      { nl: 'Een {t:Stakeholder|stakeholder}: geraakt of met invloed. Direct, indirect, leidinggevenden.', en: 'A {t:Stakeholder|stakeholder}: affected or influential. Direct, indirect, managers.', cue: { Stakeholder: 'stake' }, focus: 'stake' },
      { nl: 'Per groep vijf vragen. Die tabel op één A4 is je {t:Communicatieplan|communicatieplan}.', en: 'Five questions per group. That one-page table is your {t:Communication plan|communication plan}.', cue: { Communicatieplan: 'plan' }, focus: ['plan', 'sheet'] },
      { nl: 'Leidinggevenden horen het voor hun teams: een {t:Cascade|cascade}. Nooit eerst op de gang.', en: 'Managers hear it before their teams: a {t:Cascade|cascade}. Never in the corridor first.', cue: { Cascade: 'cascade' }, focus: 'cascade' },
      { nl: 'Al een gerucht? Dezelfde dag: dit weten we, dit nog niet, en dan wel.', en: 'A rumour already? The same day: this we know, this not yet, and when.', focus: 'rumour' },
    ]),
    sc('s8', CO, { nl: 'De middenmanager', en: 'The middle manager' }, [
      { nl: 'De {t:Middenmanager|middenmanager} is het kanaal: wat betekent dit voor mijn maandag?', en: 'The {t:Middle manager|middle manager} is the channel: what does this mean for my Monday?', cue: { Middenmanager: 'mid' }, focus: ['mid', 'teamlead', 'sponsor'] },
      { nl: 'Eerst toerusten: eigen vragen beantwoord, drie {t:Kernboodschappen|kernboodschappen}, vragen en antwoorden.', en: 'Equip them first: own questions answered, three {t:Talking points|talking points}, likely questions.', cue: { Kernboodschappen: 'msgs' }, focus: ['msgs', 'teamlead'] },
      { nl: 'Herhaal: een {t:Town hall|town hall} voor het waarom, dan het bord, de ploegstart, één op één.', en: 'Repeat: a {t:Town hall|town hall} for the why, then the board, the shift start, one-on-one.', cue: { 'Town hall': 'hall' }, focus: ['hall', 'sponsor'] },
      { nl: 'Kotter, 1995: leiders communiceren hun visie tien keer te weinig.', en: 'Kotter, 1995: leaders under-communicate their vision by a factor of ten.', focus: 'ten' },
      { nl: 'Prosci: de reden van de top, wat het voor mijn werk betekent van mijn eigen baas.', en: 'Prosci: the reason from the top, what it means for my job from my own boss.', focus: 'prosci' },
    ]),
    sc('s9', CO, { nl: 'Een cascade in vier weken', en: 'A cascade in four weeks' }, [
      { nl: 'Een netbeheerder: geen klus de weekplanning in zonder gereedheidscheck. Eén mail op vrijdag?', en: 'A grid operator: no job into the week plan without a readiness check. One e-mail on Friday?', focus: ['grid', 'planner'] },
      { nl: 'Week {n:1}: de vijf teamleiders, met een FAQ. Week {n:2}: zij vertellen hun planners.', en: 'Week {n:1}: the five team leaders, with an FAQ. Week {n:2}: they tell their planners.', focus: ['w12', 'teamlead'] },
      { nl: 'Week {n:3} en {n:4}: de check op het bord. Zes planners gevraagd: twee denken dat hij optioneel is.', en: 'Weeks {n:3} and {n:4}: the check on the board. Six planners asked: two think it’s optional.', focus: ['w34', 'board', 'planner'] },
      { nl: 'Na een week: wie van je mensen heb je het verteld, en wat vroegen ze?', en: 'A week on: which of your people have you told, and what did they ask?', focus: ['halfway', 'teamlead'] },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat; it carries the spoken points of the
// checklist above. No symbols the voice would read aloud, no quotes or
// parentheses. Words checked with espeak-ng phonemes through Piper's own bridge
// (nl_NL-alex, 2026-11-12). The terms the cards show are said: stakeholder
// (the kit's rule from pm.intake.stakeholders, steekholder) and, with rules
// added for this film in films/_kit/timeline.mjs (review, 2026-11-12; no other
// film's spoken text changes): the five ADKAR words (E-wèrnus, Die-zaaijer,
// Nollitsj, E-billiti, Rie-in-forsmunt), livegang (laif-gang),
// communicatieplan, middenmanager (midden-menetsjer), town hall (taun hol),
// Coch en French and Mark Hughes. Still kept out of the Dutch narration
// because espeak-ng misreads them (they stay in captions and cards):
// touchscreen, Leading Change, slide, spreadsheet (said "de oude lijst"),
// Virginia, FAQ (read "fak": said "een lijst veelgestelde vragen"), claim and
// mail ("mee-il": said "e-mail"). ADKAR (ad-kar), Kotter, Prosci, Jeff Hiatt,
// Heifetz, Kübler-Ross, cascade, kernboodschappen, verandercurve,
// verandermanagement, adoptie, terminal, ploegstart, enquêtes, dwarsligger,
// gereedheidscheck (its rule from pm.plan.schedule) and OEE (its rule: O E E)
// read well. The guard below runs the kit's SAY rules first.
const SAY = [
  [ // s1 go-live is not adoption
    { nl: 'Een verpakkingsbedrijf. Elke stop langer dan {n:2} minuten moet op een nieuwe terminal.',
      en: 'A packaging plant. Every stop over {n:2} minutes goes on a new terminal by the line.' },
    { nl: 'De {t:Livegang|livegang}, de dag dat het officieel start. Daarna lokt de oude manier, en komen problemen boven.',
      en: 'Then {t:Go-live|go-live}, the day it officially starts. After it, the old way tempts, and problems show up.' },
    { nl: 'Na zes weken: maar {n:40} procent geregistreerd.',
      en: 'After six weeks: only {n:40} percent logged.' },
    { nl: 'Livegang is geen {t:Adoptie|adoptie}: echt gebruiken, ook als niemand kijkt.',
      en: 'Go-live is not {t:Adoption|adoption}: actually using it, also when nobody watches.' },
    { nl: 'Mensen zover krijgen heet {t:Verandermanagement|verandermanagement}.',
      en: 'Getting people there is {t:Change management|change management}.' },
    { nl: 'Wat het drijft: makkelijker voor wie het werk doet, de baas vraagt ernaar, ze vormden het mee, de oude manier is weg.',
      en: 'What drives it: easier for whoever does it, the boss asks, they helped shape it, the old way is gone.' },
    { nl: 'Kost het de operator meer tijd, dan redt geen campagne het.',
      en: 'If it takes the operator longer, no campaign saves it.' },
  ],
  [ // s2 two models
    { nl: 'Twee modellen. {t:Kotter|Kotter}, 1996: acht stappen voor de organisatie,',
      en: 'Two models. {t:Kotter|Kotter}, in Leading Change, 1996: eight steps for the organisation,' },
    { nl: 'van urgentie en een groep die trekt, tot snelle successen en verankeren.',
      en: 'from urgency and a group that drives it, to quick wins and anchoring.' },
    { nl: '{t:ADKAR|ADKAR}, van Jeff Hiatt van Prosci, is voor één persoon: Awareness, weten; Desire, willen; Knowledge, weten hoe; Ability, kunnen; Reinforcement, beloond blijven.',
      en: '{t:ADKAR|ADKAR}, by Jeff Hiatt of Prosci, is for one person: Awareness, Desire, Knowledge, Ability, Reinforcement, staying rewarded.' },
    { nl: 'Kritiek: Mark Hughes vond in 2011 geen stevig bewijs dat {n:70} procent mislukt. Kotter heet te veel van bovenaf.',
      en: 'Critique: a 2011 review by Mark Hughes found no solid evidence that {n:70} percent fail. Kotter is called too top-down.' },
  ],
  [ // s3 eight operators
    { nl: 'Gebruik ADKAR als diagnose. Niet bewust: de baas vertelt het. Geen zin: zoek wat ze kwijtraken. Geen kennis: uitleggen. Niet kunnen: oefenen. Geen bekrachtiging: elke week vragen.',
      en: 'Use ADKAR as a diagnosis. Not aware: the boss tells them. No desire: find what they lose. No knowledge: explain. No ability: practise. No reinforcement: someone asks weekly.' },
    { nl: 'Alle acht gevraagde operators weten ervan, en hoe het moet.',
      en: 'All eight operators asked know about it, and how.' },
    { nl: 'Maar drie zeggen: er wordt nooit iets mee gedaan. Voor twee staat de terminal {n:30} meter van de stops.',
      en: 'But three say nothing is ever done with it. For two, the terminal is {n:30} metres from the stops.' },
    { nl: 'De ploegleider opent elke ploegstart met de top drie stops van gisteren, en wat ermee gebeurt; onderhoud zet de terminal in het midden.',
      en: 'The shift lead opens each shift start with yesterday\'s top three stops and what happens to them; maintenance moves the terminal to the middle.' },
    { nl: 'Vier weken later: {n:85} procent.',
      en: 'Four weeks later: {n:85} percent.' },
    { nl: 'Zeg de reden in hun termen: niet de OEE, maar geen oproep op zaterdag.',
      en: 'Give the reason in their terms: not OEE, but no call-in on Saturday.' },
    { nl: 'Vraag vijf mensen wat het lastig maakt. En: wat verliest de operator?',
      en: 'Ask five people what makes it hard. And: what does the operator lose?' },
  ],
  [ // s4 three forms of resistance
    { nl: 'Weerstand: mensen remmen een verandering af, of blokkeren hem.',
      en: 'Resistance: people slow a change down, or block it.' },
    { nl: '{t:Open weerstand|Open weerstand}: argumenten, boosheid, dit gaat niet werken.',
      en: '{t:Open resistance|Open resistance}: arguments, anger, this won\'t work.' },
    { nl: '{t:Passieve weerstand|Passieve weerstand}: ja in het overleg, daarna niks. Te druk. Sessies missen.',
      en: '{t:Passive resistance|Passive resistance}: yes in the meeting, nothing after. Too busy. Missed sessions.' },
    { nl: '{t:Verborgen weerstand|Verborgen weerstand}: in 2019 al geprobeerd, de oude lijst bijhouden, data die nooit komt.',
      en: '{t:Hidden resistance|Hidden resistance}: tried that in 2019, the old spreadsheet kept alive, data that never arrives.' },
    { nl: 'Open weerstand is een cadeau. Het zegt waar je moet werken. De andere twee moet je eerst vinden.',
      en: 'Open resistance is a gift: it shows what to work on. The other two you must find first.' },
  ],
  [ // s5 what is behind it
    { nl: 'Weerstand vertelt iets echts: een {t:Verlies|verlies}, zoals status of overwerk, extra werk, een mislukt project waarvoor zij betaalden, of een fout in jouw ontwerp.',
      en: 'Resistance tells you something real: a {t:Loss|loss}, like status or overtime, extra work, a failed project they paid for, or a flaw in your design.' },
    { nl: 'Vraag voor je oordeelt: wat moet er kloppen om dit voor jou te laten werken?',
      en: 'Ask before you judge: what would have to be true for this to work for you?' },
    { nl: 'Is een verlies echt, zeg het eerlijk. En noem niemand een dwarsligger; dat blijft plakken en sluit de deur.',
      en: 'When a loss is real, say so honestly. And never label anyone a resister; it sticks and closes the door.' },
    { nl: 'De {t:Verandercurve|verandercurve}, van schok tot acceptatie, is geleend van Kübler-Ross, 1969, over stervende patiënten. Een dip is normaal, vaste fases niet bewezen.',
      en: 'The {t:Change curve|change curve}, from shock to acceptance, is borrowed from Kübler-Ross, 1969, on dying patients. A dip is normal; fixed stages, unproven.' },
    { nl: 'Met Heifetz: mensen verzetten zich niet tegen verandering, maar tegen verlies. Weerstand is geen onwil.',
      en: 'With Heifetz: people resist loss, not change. Resistance is not a bad attitude.' },
  ],
  [ // s6 coffee with Henk
    { nl: 'Een metaalbedrijf. Insteller Henk noemt het nieuwe planbord iets voor kantoormensen; armen over elkaar, collega’s volgen.',
      en: 'A metal works. Henk, the senior setter, calls the new board for office people; arms crossed, his colleagues follow.' },
    { nl: 'Je drinkt koffie met hem, één op één, en vraagt naar eerdere veranderingen.',
      en: 'You have coffee with him, one-on-one, and ask about earlier changes.' },
    { nl: 'Vroeger bepaalde hij de volgorde, nu de planner, die niet weet dat de grote pers {n:40} minuten moet opwarmen.',
      en: 'He used to set the order; now the planner does, unaware the big press needs {n:40} minutes to warm up.' },
    { nl: 'Haal de scherpste criticus bij het ontwerp: Henk stelt met de planner de regels op, ook de opwarmregel.',
      en: 'Invite the sharpest critic into the design: Henk sets the rules with the planner, warm-up rule included.' },
    { nl: 'Twee weken later legt hij het bord zelf uit aan de nachtploeg.',
      en: 'Two weeks later he explains the board to the night shift himself.' },
    { nl: 'In 1948 zagen Coch en French in een pyjamafabriek: wie meeontwierp, herstelde sneller en stapte minder op.',
      en: 'In 1948, Coch and French saw it at a pyjama factory: co-designers recovered faster, and quit less.' },
  ],
  [ // s7 who hears what, when
    { nl: 'Breng de {t:Stakeholder|stakeholders} in kaart, geraakt of met invloed: direct, indirect, leidinggevenden.',
      en: 'Map the {t:Stakeholder|stakeholders}, affected or influential: directly, indirectly, and managers.' },
    { nl: 'Per groep vijf vragen: wat verandert, wanneer, waarom, wat wordt verwacht, waar kan ik terecht? Die tabel op één A4: je {t:Communicatieplan|communicatieplan}.',
      en: 'Five questions per group: what changes, when, why, what is expected, where can I ask? That one-page table: your {t:Communication plan|communication plan}.' },
    { nl: 'Leidinggevenden horen het voor hun teams, zodat ze antwoord hebben: een {t:Cascade|cascade}. Nooit eerst op de gang of van een andere vestiging.',
      en: 'Managers hear it before their teams, so they have answers: a {t:Cascade|cascade}. Never first in the corridor or from another site.' },
    { nl: 'Al een gerucht? Dezelfde dag: dit weten we, dit nog niet, en dan wel.',
      en: 'A rumour out? The same day: what we know, what not yet, and when.' },
  ],
  [ // s8 the middle manager
    { nl: 'Het belangrijkste kanaal: de {t:Middenmanager|middenmanager}. De top geeft het waarom; de ploegleider hoort: wat betekent dit voor mijn maandag?',
      en: 'The key channel: the {t:Middle manager|middle manager}. The top gives the why; the shift lead hears: what does this mean for my Monday?' },
    { nl: 'Rust ze eerst toe: hun vragen beantwoord, drie {t:Kernboodschappen|kernboodschappen} in eigen woorden, verwachte vragen met antwoorden.',
      en: 'Equip them first: their questions answered, three {t:Talking points|talking points} in their own words, likely questions with answers.' },
    { nl: 'Herhaal: één keer is geen communicatie. Een {t:Town hall|town hall} geeft het waarom; dan het bord, de ploegstart, één op één.',
      en: 'Repeat: once is not communication. A {t:Town hall|town hall} gives the why; then the board, the shift start, one-on-one.' },
    { nl: 'Kotter schatte in 1995: leiders communiceren hun visie tien keer te weinig.',
      en: 'Kotter estimated in 1995 that leaders under-communicate their vision tenfold.' },
    { nl: 'Enquêtes van Prosci: de reden van de top, wat het voor je werk betekent van je eigen baas.',
      en: 'Prosci\'s surveys: the reason from the top, what it means for your job from your own boss.' },
  ],
  [ // s9 a cascade in four weeks
    { nl: 'Een netbeheerder: geen klus de weekplanning in zonder gereedheidscheck. Het hoofd planning wil vrijdag één e-mail.',
      en: 'A grid operator: no job enters the week plan without a readiness check. The head of planning wants one Friday e-mail.' },
    { nl: 'Beter: week {n:1} horen eerst de vijf teamleiders het, met een lijst veelgestelde vragen. Week {n:2} vertellen zij hun planners.',
      en: 'Better: in week {n:1} the five team leaders hear it first, with an FAQ. In week {n:2} they tell their planners.' },
    { nl: 'Week {n:3} en {n:4}: de check op het bord. Zes planners gevraagd wat ze begrepen; twee denken dat hij optioneel is.',
      en: 'Weeks {n:3} and {n:4}: the check on the board. Six planners asked what they understood; two think it optional.' },
    { nl: 'Een cascade stopt vaak halverwege. Vraag na een week: wie heb je het verteld, en wat vroegen ze? Weet je iets niet, zeg wanneer wel.',
      en: 'A cascade often stops halfway. A week on, ask: who have you told, and what did they ask? Don\'t know? Say when you will.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, and no
// word espeak-ng misreads in the Dutch narration once the kit's SAY rules ran (see above)
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const plain = plainSay(line[lang]);
  if (/[/&×=+()“”"‘%€]/.test(plain)) throw new Error(`narration: a symbol the voice reads aloud in "${line[lang].slice(0, 50)}"`);
  if (lang === 'nl' && /\b(livegang|touchscreen|slide|spreadsheet|stakeholder|manager|middenmanager|town hall|FAQ|Hughes|Leading|Awareness|Desire|Knowledge|Ability|Reinforcement|Coch|French|Virginia|communicatieplan|claim|(?<!e-)mail)\b/i.test(sayable(plain, 'nl'))) throw new Error(`narration: a word espeak-ng misreads in "${line.nl.slice(0, 50)}"`);
}
// Scene lengths follow the narration (its words / 2.5, the longer language), never
// shorter than the captions (as shown, with their glosses) need to be read.
{
  const shown = resolveFilm(spec, lessons);
  spec.scenes.forEach((s, si) => {
    const said = Math.max(...['nl', 'en'].map((lang) => wordsOf(SAY[si].map((l) => plainSay(l[lang])).join(' '))));
    const read = Math.max(...['nl', 'en'].map((lang) => wordsOf(shown.scenes[si].beats.map((b) => b.text[lang]).join(' '))));
    s.dur = Math.max(Math.ceil(minSceneDur(read)), Math.round(said / 2.5));
  });
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
const C = { ASKED, NOTHING, FAR, RATE, dur: spec.scenes.map((s) => s.dur) };
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

// the cast's keys and the operator groups, for the dark-theme skin rule
const PEOPLE = ':is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"])';
const OPS = ':is([data-cue="ops"],[data-cue="henk"])';
const css = PM_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-axis{fill:none;stroke:var(--anatomy-lo);stroke-width:1}
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-dia{fill:var(--anatomy-hi);stroke:var(--anatomy-card);stroke-width:1.2}
.pm-ring{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8}
.pm-dot{fill:var(--anatomy-hi)}
.pm-fill{fill:var(--fp-accent)}
[data-cue][data-on] .pm-card{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line,[data-cue][data-on] .pm-ring{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-dia,[data-cue][data-on] .pm-dot{fill:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (world.mjs gives heads only a light outline) */
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade),
.iso:not([data-theme="light"]) ${OPS}:not([data-on])>.pm-op>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) ${PEOPLE}:not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade,
.iso:not([data-theme="light"]) ${OPS}:not([data-on])>.pm-op>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
.pm-mini .pm-txt,.pm-mini .pm-mute,.pm-mini .pm-big,.pm-mini .pm-on{display:none}
.pm-mini *{vector-effect:non-scaling-stroke}
.pm-mini .pm-card,.pm-mini .pm-hot,.pm-mini .pm-line,.pm-mini .pm-ring{stroke-width:.7px}
.pm-mini .pm-axis,.pm-mini .pm-dia{stroke-width:.4px}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard en een klok, rechts achterin een lijnterminal met aanraakscherm op een paal. Jij, de adviseur in petrol, staat bij het bord. Bij de terminal twee operators met een helm, aan het linkereind van de tafel de ploegleider in werkvest, rechts de sponsor in pak, vooraan Henk de insteller met een helm en de planner met een tablet. Op tafel het communicatieplan op één A4 en twee koppen koffie. Rechts een paneel met per scène een kaart: de terminal en de livegang met 40 procent geregistreerd, wat adoptie drijft, de acht stappen van Kotter en de vijf letters van ADKAR, acht operators op de ADKAR-trap met twee oplossingen en 85 procent, drie vormen van weerstand, wat erachter zit met de verandercurve, de koffie met Henk en de opwarmregel, wie wat wanneer hoort met de cascade, de middenmanager en herhalen, en een cascade in vier weken bij een netbeheerder.',
  en: 'A meeting room. On the back wall a whiteboard and a clock, at the back right a line terminal with a touchscreen on a post. You, the consultant in petrol, stand at the board. By the terminal two operators in hard hats, at the left end of the table the shift lead in a work vest, at the right the sponsor in a suit, at the front Henk the setter in a hard hat and the planner with a tablet. On the table the communication plan on one page and two cups of coffee. At the right a panel with one card per scene: the terminal and go-live with 40 percent logged, what drives adoption, Kotter\'s eight steps and the five letters of ADKAR, eight operators on the ADKAR steps with two fixes and 85 percent, three forms of resistance, what is behind it with the change curve, coffee with Henk and the warm-up rule, who hears what when with the cascade, the middle manager and repeating, and a cascade in four weeks at a grid operator.',
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

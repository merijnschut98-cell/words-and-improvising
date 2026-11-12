// Dev tool, not shipped. Builds the explainer film "Drie gesprekken in één /
// Three conversations in one" for the Projects course: pm.lead.difficult
// (level 3 of Feedback en moeilijke gesprekken, "Moeilijke gesprekken").
//
//   node films/pm.lead.difficult/build.mjs            build the page
//   node films/pm.lead.difficult/build.mjs --audit    build, then report pace, terms and word counts
//
// Writes src/content/courses/films/pm.lead.difficult.html: one offline page with
// the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7
// (pm.lead.difficult, P3): what happened, feelings, identity, shown as three
// layers; about 80 s, three beats (three layers; contribution and intent
// versus impact; the third story). Storyboard drift: seven scenes and about
// four minutes, because a lesson with a film no longer shows its worked
// example, so the film carries all five teach blocks and the worked example
// (Henk, with its reveal): the three conversations (s1, teach 1), preparing on
// paper (s2, teach 2), the opening (s3, teach 3), in the talk (s4, teach 4),
// the agreement (s5, teach 5), Henk's remark and his layers prepared (s6, the
// example and the first half of its reveal) and the talk with Henk (s7, the
// rest of the reveal).
//
// Served: only pm.lead.difficult. pm.run.conflict (no film field) was weighed
// and left out: its core is negotiation (positions and interests and BATNA
// from Getting to Yes, team mediation, objective criteria, splitting the
// difference, the dairy example), which belongs with pm.negotiate.batna; the
// two lessons' teach text and two worked examples do not fit in about 760
// words with full coverage, and only its four-step talk overlaps this film.
//
// Checklist (lesson point: scene and beat; "card" where the card carries it):
//   teach 1: every difficult conversation is three conversations at once
//     (Stone, Patton and Heen, Difficult Conversations, 1999) (s1 b1); the
//     "what happened" conversation: the facts, who is right (s1 b2); the
//     feelings conversation: anger, shame, hurt (s1 b3); the identity
//     conversation: what does this say about me, am I competent, am I taken
//     seriously (s1 b4); under pressure identity runs loudest, especially as
//     the youngest in the room; you notice it as the urge to be right (s1 b5)
//   teach 2: prepare on paper, fifteen minutes is usually enough (s2 b1); what
//     did you see, his likely story, what do you feel (s2 b2); your
//     contribution: what you did or left undone that helped cause it (s2 b3);
//     the book swaps blame for contribution: blame looks back, contribution
//     helps you solve it (s2 b4); what you want at the end, one concrete
//     agreement; write the first two sentences and say them aloud; most talks
//     go wrong at the opening (s2 b5)
//   teach 3: open directly with the third story, how a neutral outsider would
//     describe the difference (s3 b1); the downtime data example, word for
//     word in the voice (s3 b2); no long run-up, people feel it coming and
//     tense up (s3 b3); opinions differ on small talk: one sentence on a Dutch
//     shop floor, skipping it rude in some cultures (s3 b4); never open by
//     e-mail, tone gets lost and positions harden in writing (s3 b5)
//   teach 4: stay with facts and feelings; separate what happened from what you
//     made of it (s4 b1); name emotions when they show, "you sound frustrated"
//     (s4 b2); intent versus impact: you know your impact, only he knows his
//     intent (s4 b3); don't accuse, ask, the example sentence (s4 b4)
//   teach 5: close with an agreement, who does what when and how you check,
//     said aloud (s5 b1); the downtime log on Thursday, the shift comparison,
//     Monday together (s5 b2); confirm it the same day in two sentences (s5
//     b3); the pitfall: a good talk, a warm feeling, no agreement, the same
//     problem next week (s5 b4); the sharp closing question (s5 b5)
//   example: week 3 at a packaging company; Henk, a team leader in his
//     fifties, says in front of you to his shift that this consultant thinks
//     he knows their line after two weeks (s6 b1); the analysis is due Friday,
//     you still need his line data, your face went red and you said nothing
//     (s6 b2); reveal: plan twenty minutes alone today or tomorrow (s6 b3);
//     prepare the facts (what he said, data not received), his likely story
//     (an outsider judging his line, his shift getting the blame), your
//     feelings (shame, irritation) and your identity trap (wanting to prove
//     you can do it) (s6 b4, the four as layers); goal: data by Wednesday at
//     the latest and Henk checking the analysis before Friday (s6 b5); the
//     opening sentence (s7 b1); the impact sentence and "what is behind it?"
//     (s7 b2); listen, close with the agreement (s7 b3)
//   Card-only points: none; every point is in the voice, and each card stays
//   on screen for the rest of its scene (at least 4 s).
//
// Facts: the three conversations (what happened, feelings, identity), the
// third story, contribution instead of blame and intent versus impact are all
// in Stone, Patton and Heen, Difficult Conversations (Viking, 1999); the book
// contrasts blame (judging, looking back) with contribution (understanding,
// looking forward), so "the book swaps blame for contribution" is credited to
// it as the lesson does. Fifteen minutes on paper, the opening as the place
// most talks go wrong, small talk, e-mail, saying the agreement aloud and the
// closing question are the lesson's own advice and are credited to no one.
//
// The drawing is the shared pm world (films/_pm/world.mjs, read-only here): a
// meeting room with a whiteboard that repeats the panel in miniature and a wall
// clock; a table with a sheet that fills with the preparation notes and the
// agreement, a laptop (the e-mail you do not send) and two cups; and two
// people of the cast across the table: "jij" the consultant in petrol and the
// team lead in his work vest (Henk in the example, "him" in the teach scenes).
// A panel at the right, in stage space, carries one card per scene, labelled
// "voorbeeld" or "schema" (it reads "voorbeeld" while an example beat is
// spoken). The three conversations are three stacked layers, slabs seen from a
// little above, dropping in one by one; the identity layer, at the bottom, turns
// hot when it "runs loudest"; Henk's preparation in s6 reuses the layers.
//
// Focus (strictFocus): every beat names the block it explains. Each block of
// the panel is its own cue group (CUES below), and so are the two people, the
// board, the sheet and the laptop.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { NARRATION_WPS } from '../_kit/assert.mjs';
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
const LD = 'pm.lead.difficult';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const textOf = (lang) => { const l = lessons[lang].get(LD); return `${l.teach.join('\n')}\n${l.example.text}\n${l.example.reveal}`; };
const says = (list, lang = 'nl') => { const t = textOf(lang); for (const s of list) assert(t.includes(s), `${LD} (${lang}) no longer says "${s}"`); };
says(['Elk moeilijk gesprek is drie gesprekken tegelijk (Stone, Patton en Heen, Difficult Conversations, 1999)',
  'Het gesprek over wat er gebeurde: de feiten, wie gelijk heeft', 'Het gevoelsgesprek: boosheid, schaamte, gekwetstheid',
  'Het identiteitsgesprek: wat zegt dit over mij? Ben ik competent? Word ik serieus genomen?',
  'Onder druk praat het identiteitsgesprek het hardst, zeker als je de jongste in de kamer bent', 'de drang om gelijk te krijgen',
  'Bereid het op papier voor; een kwartier is meestal genoeg', 'Wat zag je? Wat is waarschijnlijk zijn verhaal? Wat voel je?',
  'Wat was jouw bijdrage: wat deed jij, of liet je liggen, waardoor dit mede ontstond?', 'Het boek ruilt schuld in voor bijdrage, want schuld kijkt terug en bijdrage helpt je het op te lossen',
  'één concrete afspraak', 'Schrijf dan de eerste twee zinnen op en zeg ze hardop; bij de opening gaan de meeste gesprekken mis',
  'Open direct, met het “derde verhaal”: hoe een neutrale buitenstaander het verschil tussen jullie zou beschrijven',
  '“Ik wil het hebben over de stilstanddata. We kijken er verschillend naar, en ik wil snappen hoe jij het ziet.”',
  'Geen lange aanloop; mensen voelen het aankomen en verkrampen', 'Over smalltalk verschillen de meningen: op een Nederlandse werkvloer is één zin genoeg, in sommige culturen is het overslaan onbeleefd',
  'Open nooit per mail; de toon gaat verloren en standpunten verharden op papier',
  'Blijf bij feiten en gevoelens. Scheid wat er gebeurde van wat jij ervan maakte. Benoem emoties als ze zichtbaar zijn: “Je klinkt gefrustreerd.”',
  'jouw impact ken jij, zijn bedoeling kent alleen hij. Beschuldig dus niet, maar vraag',
  '“Ik denk niet dat je het zo bedoelde, maar het maakte het voor mij lastiger om mensen aan het praten te krijgen. Wat bedoelde je ermee?”',
  'Sluit af met een afspraak: wie doet wat wanneer, en hoe je het checkt. Zeg het hardop',
  '“Dus jij stuurt het stilstandlogboek donderdag, en ik haal de vergelijking tussen de ploegen eruit. Kijken we er maandag samen naar?” Bevestig het dezelfde dag in twee zinnen',
  'een goed gesprek, een warm gevoel, geen afspraak, en volgende week hetzelfde probleem', '“Wat doen we vanaf morgen allebei anders?”',
  'Week 3 bij een verpakkingsbedrijf. Henk, teamleider van in de vijftig, zei waar jij bij stond tegen zijn ploeg: “Deze consultant denkt na twee weken onze lijn te kennen.”',
  'Je analyse moet vrijdag af en je hebt zijn lijndata nog steeds nodig. Je voelde je hoofd rood worden en zei niks',
  'Plan vandaag of morgen twintig minuten alleen met hem', 'de feiten (wat hij zei, data niet ontvangen)', 'zijn waarschijnlijke verhaal (een buitenstaander die over zijn lijn oordeelt, zijn ploeg die de schuld krijgt)',
  'je gevoel (schaamte, irritatie)', 'je identiteitsval (willen bewijzen dat je het kunt)', 'Doel: data uiterlijk woensdag en Henk die de analyse vóór vrijdag checkt',
  '“Henk, ik wil het hebben over je opmerking van maandag en over de data, want ik heb je hulp nodig om dit goed te krijgen.”',
  '“Toen je dat zei waar de ploeg bij was, werd het voor mij lastiger om mensen aan het praten te krijgen. Wat zit erachter?”', 'Luister. Sluit af met de afspraak']);
says(['three conversations at once (Stone, Patton and Heen, Difficult Conversations, 1999)', 'The feelings conversation: anger, embarrassment, hurt', 'The book swaps blame for contribution',
  'Opinions differ on small talk', 'You sound frustrated', 'you know your impact, only they know their intent', 'What will each of us do differently from tomorrow?',
  'Henk, a team leader in his fifties', 'your identity trap (wanting to prove you’re competent)', 'Goal: data by Wednesday and Henk checking the analysis before Friday'], 'en');
assert(lessons.nl.get(LD).terms.map((t) => t.term).join() === 'Drie gesprekken,Identiteitsgesprek,Bijdrage,Derde verhaal,Bedoeling tegenover impact', 'the five terms of the lesson');

// ---------------------------------------------------------------- the world
const W = 640;
const H = 400;
const AZ = 58;
const ROOM = { w: 290, d: 228, h: 230 };
const FIT = k.boxCorners({ x: -10, y: -10, w: ROOM.w + 10, d: ROOM.d + 10 }, 0, ROOM.h);
const P = k.fitProjection(FIT, 318, H, { pad: 6, azimuth: AZ, elevation: 24 });
const w = pmWorld(k, G, P);
const g = (key, body, extra = '') => `<g data-k="${key}"${extra}>${body}</g>`;
const cueG = (name, body) => `<g data-cue="${name}">${body}</g>`;

const BOARD = w.board({ x0: 60, x1: 230, z0: 92, z1: 196 });
const TABLE = { x: 96, y: 118, w: 150, d: 72, h: 74 };
const TZ = TABLE.h;
const SHEET = w.sheet({ x: 120, y: 146, z: TZ, w: 21, d: 29.7 });
const SHEET_AT = w.at([130, 161, TZ]).map((v) => Math.round(v * 10) / 10);
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
const sheetLines = `<g transform="${SHEET.face}">${g('sLines', '')}</g>`;

const world = [
  w.room(ROOM),
  w.clock(262, 214, 10),
  cueG('board', BOARD.svg + boardMini),
  w.chair({ x: 136, y: 100, back: -1 }),
  w.chair({ x: 206, y: 100, back: -1 }),
  w.person({ x: 76, y: 160, role: 'jij', along: 'y' }),
  w.table(TABLE),
  cueG('sheet', SHEET.svg + sheetLines),
  cueG('laptop', w.laptop({ x: 200, y: 140, z: TZ, toward: 1 })),
  w.cup(108, 178, TZ),
  w.cup(232, 176, TZ),
  w.person({ x: 266, y: 156, role: 'teamlead', along: 'y' }),
].join('');
assert(world.includes('data-cue="jij"') && world.includes('data-cue="teamlead"'), 'the two people are cue groups');

// ---------------------------------------------------------------- the panel (stage space)
// One card per scene, drawn by stage.js into these groups; each block of a card
// sits in its own cue group, so a beat's focus (and a term's cue) can light it.
const PX = 322;
const PW = 308;
const CUES = ['three', 'what', 'feel', 'ident', 'loud', 'paper', 'q', 'contrib', 'blame', 'goal', 'first',
  'third', 'quote', 'runup', 'small', 'mail', 'sep', 'name', 'intent', 'ask', 'deal', 'dealex', 'confirm', 'trap', 'close',
  'said', 'need', 'plan', 'hwhat', 'hstory', 'hfeel', 'hident', 'hgoal', 'open', 'impact', 'listen', 'deal2'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));
// Static paths with relative line-tos (the helper of pm.land.handover and
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
const BOARD_AT = w.at([145, 0, 150]).map((v) => Math.round(v * 10) / 10);
const JIJ_AT = w.at([76, 160, 150]).map((v) => Math.round(v * 10) / 10);
const HENK_AT = w.at([266, 156, 150]).map((v) => Math.round(v * 10) / 10);
const LAP_AT = w.at([200, 140, TZ]).map((v) => Math.round(v * 10) / 10);
const CAM = [
  { from: [150, 210, 1], to: [JIJ_AT[0], JIJ_AT[1] + 40, 1.1] },
  { from: [150, 210, 1.02], to: [SHEET_AT[0], SHEET_AT[1], 1.12] },
  { from: [SHEET_AT[0], SHEET_AT[1], 1.06], to: [LAP_AT[0], LAP_AT[1], 1.12] },
  { from: [150, 200, 1.04], to: [HENK_AT[0], HENK_AT[1] + 40, 1.1] },
  { from: [HENK_AT[0], HENK_AT[1] + 40, 1.06], to: [SHEET_AT[0], SHEET_AT[1], 1.1] },
  { from: [150, 210, 1], to: [HENK_AT[0], HENK_AT[1] + 40, 1.12] },
  { from: [JIJ_AT[0], JIJ_AT[1] + 40, 1.08], to: [150, 210, 1] },
];

// ---------------------------------------------------------------- the film
const C = { CUES };
const sc = (id, title, beats) => ({ id, lesson: LD, level: 3, still: 0.9, title, beats });
const spec = {
  id: LD,
  title: { nl: 'Drie gesprekken in één', en: 'Three conversations in one' },
  lessons: [LD],
  strictFocus: true,
  scenes: [
    sc('s1', { nl: 'Drie gesprekken', en: 'Three conversations' }, [
      { nl: 'Elk moeilijk gesprek is {t:Drie gesprekken|drie gesprekken} tegelijk: Stone, Patton en Heen, 1999.', en: 'Every difficult conversation is {t:Three conversations|three conversations} at once: Stone, Patton and Heen, 1999.', cue: { 'Drie gesprekken': 'three' }, focus: ['three', 'what', 'feel', 'ident'] },
      { nl: 'Het gesprek over wat er gebeurde: de feiten, wie gelijk heeft.', en: 'The “what happened” conversation: the facts, who’s right.', focus: 'what' },
      { nl: 'Het gevoelsgesprek: boosheid, schaamte, gekwetstheid.', en: 'The feelings conversation: anger, embarrassment, hurt.', focus: 'feel' },
      { nl: 'Het {t:Identiteitsgesprek|identiteitsgesprek}: wat zegt dit over mij? Ben ik competent?', en: 'The {t:Identity conversation|identity conversation}: what does this say about me? Am I competent?', cue: { Identiteitsgesprek: 'ident' }, focus: ['ident', 'jij'] },
      { nl: 'Onder druk praat dat het hardst, zeker als je de jongste bent. Je merkt het als drang om gelijk te krijgen.', en: 'Under pressure it runs loudest, especially if you’re the youngest. You notice it as the urge to be right.', focus: ['loud', 'ident', 'jij'] },
    ]),
    sc('s2', { nl: 'Voorbereiden op papier', en: 'Preparing on paper' }, [
      { nl: 'Bereid het op papier voor; een kwartier is meestal genoeg.', en: 'Prepare on paper; fifteen minutes is usually enough.', focus: ['paper', 'sheet'] },
      { nl: 'Wat zag je? Wat is waarschijnlijk zijn verhaal? Wat voel je?', en: 'What did you see? What is probably their story? What do you feel?', focus: 'q' },
      { nl: 'Wat was jouw {t:Bijdrage|bijdrage}: wat deed jij, of liet je liggen?', en: 'What was your {t:Contribution|contribution}: what did you do, or leave undone?', cue: { Bijdrage: 'contrib' }, focus: 'contrib' },
      { nl: 'Het boek ruilt schuld in voor bijdrage: schuld kijkt terug, bijdrage helpt oplossen.', en: 'The book swaps blame for contribution: blame looks back, contribution helps fix it.', focus: 'blame' },
      { nl: 'Doel: één concrete afspraak. Schrijf de eerste twee zinnen op en zeg ze hardop.', en: 'Goal: one concrete agreement. Write the first two sentences and say them out loud.', focus: ['goal', 'first'] },
    ]),
    sc('s3', { nl: 'De opening', en: 'The opening' }, [
      { nl: 'Open direct, met het {t:Derde verhaal|derde verhaal}: zoals een neutrale buitenstaander het ziet.', en: 'Open straight, with the {t:Third story|third story}: as a neutral observer would see it.', cue: { 'Derde verhaal': 'third' }, focus: 'third' },
      { nl: '“Ik wil het hebben over de stilstanddata. We kijken er verschillend naar.”', en: '“I’d like to talk about the downtime data. We see it differently.”', focus: ['quote', 'jij'] },
      { nl: 'Geen lange aanloop: mensen voelen het aankomen en verkrampen.', en: 'No long warm-up: people feel it coming and tense up.', focus: 'runup' },
      { nl: 'Smalltalk: op een Nederlandse werkvloer is één zin genoeg; elders is overslaan soms onbeleefd.', en: 'Small talk: in a Dutch workplace one sentence is plenty; in some cultures skipping it is rude.', focus: 'small' },
      { nl: 'Open nooit per mail: de toon gaat verloren, standpunten verharden.', en: 'Never open by e-mail: tone gets lost, positions harden.', focus: ['mail', 'laptop'] },
    ]),
    sc('s4', { nl: 'In het gesprek', en: 'In the talk' }, [
      { nl: 'Blijf bij feiten en gevoelens. Scheid wat er gebeurde van wat jij ervan maakte.', en: 'Stay with facts and feelings. Separate what happened from what you made of it.', focus: 'sep' },
      { nl: 'Benoem emoties als ze zichtbaar zijn: “Je klinkt gefrustreerd.”', en: 'Name emotions when they show: “You sound frustrated.”', focus: ['name', 'teamlead'] },
      { nl: '{t:Bedoeling tegenover impact|Bedoeling tegenover impact}: jouw impact ken jij, zijn bedoeling alleen hij.', en: '{t:Intent versus impact|Intent versus impact}: you know your impact, only they know their intent.', cue: { 'Bedoeling tegenover impact': 'intent' }, focus: 'intent' },
      { nl: 'Beschuldig niet, vraag: “Het maakte het lastiger. Wat bedoelde je ermee?”', en: 'Don’t accuse; ask: “It made it harder. What did you mean by it?”', focus: ['ask', 'jij'] },
    ]),
    sc('s5', { nl: 'De afspraak', en: 'The agreement' }, [
      { nl: 'Sluit af met een afspraak: wie doet wat wanneer, en hoe je het checkt. Hardop.', en: 'End with an agreement: who does what by when, and how you check. Out loud.', focus: 'deal' },
      { nl: '“Jij stuurt het stilstandlogboek donderdag, ik vergelijk de ploegen. Maandag samen?”', en: '“You send the downtime log Thursday, I do the shift comparison. Monday together?”', focus: ['dealex', 'sheet'] },
      { nl: 'Bevestig het dezelfde dag in twee zinnen.', en: 'Confirm it in two lines the same day.', focus: 'confirm' },
      { nl: 'Valkuil: goed gesprek, warm gevoel, geen afspraak. Volgende week hetzelfde probleem.', en: 'The trap: a good talk, warm feelings, no agreement. Next week the same problem.', focus: 'trap' },
      { nl: 'Scherpe slotvraag: “Wat doen we vanaf morgen allebei anders?”', en: 'A sharp closing question: “What will each of us do differently from tomorrow?”', focus: 'close' },
    ]),
    sc('s6', { nl: 'Henk', en: 'Henk' }, [
      { nl: 'Week {n:3}. Henk, teamleider, tegen zijn ploeg: “Deze consultant denkt onze lijn te kennen.”', en: 'Week {n:3}. Henk, a team leader, to his shift: “This consultant thinks he knows our line.”', focus: ['said', 'teamlead'] },
      { nl: 'Je analyse moet vrijdag af en je hebt zijn data nodig. Je werd rood en zei niks.', en: 'Your analysis is due Friday and you need his data. You went red and said nothing.', focus: ['need', 'jij'] },
      { nl: 'Plan vandaag of morgen twintig minuten alleen met hem.', en: 'Book twenty minutes alone with him, today or tomorrow.', focus: 'plan' },
      { nl: 'Bereid voor: de feiten, zijn verhaal, je gevoel en je identiteitsval.', en: 'Prepare: the facts, his story, your feelings and your identity trap.', focus: ['hwhat', 'hstory', 'hfeel', 'hident', 'sheet'] },
      { nl: 'Doel: data uiterlijk woensdag, en Henk die de analyse vóór vrijdag checkt.', en: 'Goal: data by Wednesday, and Henk checking the analysis before Friday.', focus: 'hgoal' },
    ]),
    sc('s7', { nl: 'Het gesprek met Henk', en: 'The talk with Henk' }, [
      { nl: '“Henk, ik wil het over je opmerking en de data hebben: ik heb je hulp nodig.”', en: '“Henk, I want to talk about your remark and the data: I need your help.”', focus: ['open', 'jij'] },
      { nl: '“Waar de ploeg bij was, werd praten voor mij lastiger. Wat zit erachter?”', en: '“In front of the shift, it got harder for me to get people talking. What’s behind it?”', focus: ['impact', 'teamlead'] },
      { nl: 'Luister. Sluit af met de afspraak.', en: 'Listen. End with the agreement.', focus: ['listen', 'deal2', 'sheet'] },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat: the film replaces the lesson's
// teach text and worked example, so every point of the checklist above is
// said here. No symbol the voice would read aloud, no spoken parenthesis or
// quote; quoted sentences are introduced in words ("bijvoorbeeld", "je opent").
// The year is said in words in Dutch (negentien negenennegentig).
const SAY = [
  [ // s1 three conversations
    { nl: 'Een moeilijk gesprek. Volgens Stone, Patton en Heen, in hun boek Difficult Conversations uit negentien negenennegentig, is elk moeilijk gesprek eigenlijk {t:Drie gesprekken|drie gesprekken} tegelijk.',
      en: 'A difficult conversation. According to Stone, Patton and Heen, in their book Difficult Conversations from 1999, every difficult conversation is really {t:Three conversations|three conversations} at once.' },
    { nl: 'Het eerste gaat over wat er gebeurde: de feiten, en wie er gelijk heeft.',
      en: 'The first is about what happened: the facts, and who is right.' },
    { nl: 'Het tweede is het gevoelsgesprek: boosheid, schaamte, gekwetstheid.',
      en: 'The second is the feelings conversation: anger, embarrassment, hurt.' },
    { nl: 'Het derde is het {t:Identiteitsgesprek|identiteitsgesprek}: wat zegt dit over mij? Ben ik competent? Word ik serieus genomen?',
      en: 'The third is the {t:Identity conversation|identity conversation}: what does this say about me? Am I competent? Am I taken seriously?' },
    { nl: 'Onder druk praat dat identiteitsgesprek het hardst, zeker als je de jongste in de kamer bent. Je merkt het aan jezelf als de drang om gelijk te krijgen.',
      en: 'Under pressure the identity conversation runs loudest, especially when you are the youngest in the room. You notice it in yourself as the urge to prove you are right.' },
  ],
  [ // s2 preparing on paper
    { nl: 'Bereid het gesprek daarom op papier voor. Een kwartier is meestal genoeg.',
      en: 'So prepare the conversation on paper. Fifteen minutes is usually enough.' },
    { nl: 'Wat zag je? Wat is waarschijnlijk zijn verhaal? En wat voel je zelf?',
      en: 'What did you see? What is probably their story? And what do you feel yourself?' },
    { nl: 'Wat was jouw {t:Bijdrage|bijdrage}? Wat deed jij, of liet je liggen, waardoor dit mede ontstond?',
      en: 'What was your {t:Contribution|contribution}? What did you do, or leave undone, that helped create this?' },
    { nl: 'Het boek ruilt schuld in voor bijdrage. Want schuld kijkt terug, en bijdrage helpt je het op te lossen.',
      en: 'The book swaps blame for contribution. Because blame looks back, and contribution helps you fix it.' },
    { nl: 'Wat wil je aan het eind? Eén concrete afspraak. Schrijf dan de eerste twee zinnen op, en zeg ze hardop. Bij de opening gaan de meeste gesprekken mis.',
      en: 'What do you want at the end? One concrete agreement. Then write the first two sentences, and say them out loud. The opening is where most conversations go wrong.' },
  ],
  [ // s3 the opening
    { nl: 'Open direct, met het {t:Derde verhaal|derde verhaal}: hoe een neutrale buitenstaander het verschil tussen jullie zou beschrijven.',
      en: 'Open straight, with the {t:Third story|third story}: how a neutral observer would describe the difference between you.' },
    { nl: 'Bijvoorbeeld: ik wil het hebben over de stilstanddata. We kijken er verschillend naar, en ik wil snappen hoe jij het ziet.',
      en: 'For example: I would like to talk about the downtime data. We see it differently, and I want to understand how you look at it.' },
    { nl: 'Geen lange aanloop. Mensen voelen het aankomen, en verkrampen.',
      en: 'No long warm-up. People feel it coming, and tense up.' },
    { nl: 'Over smalltalk verschillen de meningen. Op een Nederlandse werkvloer is één zin genoeg. In sommige culturen is het overslaan onbeleefd.',
      en: 'Opinions differ on small talk. In a Dutch workplace one sentence is plenty. In some cultures skipping it feels rude.' },
    { nl: 'En open nooit per mail. De toon gaat verloren, en standpunten verharden op papier.',
      en: 'And never open by e-mail. Tone gets lost, and positions harden in writing.' },
  ],
  [ // s4 in the talk
    { nl: 'In het gesprek blijf je bij feiten en gevoelens. Scheid wat er gebeurde van wat jij ervan maakte.',
      en: 'In the conversation, stay with facts and feelings. Separate what happened from what you made of it.' },
    { nl: 'Benoem emoties als ze zichtbaar zijn. Bijvoorbeeld: je klinkt gefrustreerd.',
      en: 'Name emotions when they show. For example: you sound frustrated.' },
    { nl: 'Dan {t:Bedoeling tegenover impact|bedoeling tegenover impact}. Jouw impact ken jij. Zijn bedoeling kent alleen hij.',
      en: 'Then {t:Intent versus impact|intent versus impact}. You know your impact. Only they know their intent.' },
    { nl: 'Beschuldig dus niet, maar vraag. Ik denk niet dat je het zo bedoelde, maar het maakte het voor mij lastiger om mensen aan het praten te krijgen. Wat bedoelde je ermee?',
      en: 'So don\'t accuse; ask. I don\'t think you meant it this way, but it made it harder for me to get people to talk. What did you mean by it?' },
  ],
  [ // s5 the agreement
    { nl: 'Sluit af met een afspraak: wie doet wat wanneer, en hoe je het checkt. Zeg het hardop.',
      en: 'End with an agreement: who does what by when, and how you check. Say it out loud.' },
    { nl: 'Dus jij stuurt het stilstandlogboek donderdag, en ik haal de vergelijking tussen de ploegen eruit. Kijken we er maandag samen naar?',
      en: 'So you send the downtime log by Thursday, and I take out the shift comparison. Shall we look at it together on Monday?' },
    { nl: 'Bevestig het dezelfde dag, in twee zinnen.',
      en: 'Then confirm it in two lines, the same day.' },
    { nl: 'De typische valkuil: een goed gesprek, een warm gevoel, geen afspraak, en volgende week hetzelfde probleem.',
      en: 'The typical failure: a good talk, warm feelings, no agreement, and next week the same problem.' },
    { nl: 'Een scherpe slotvraag: wat doen we vanaf morgen allebei anders?',
      en: 'A sharp closing question: what will each of us do differently from tomorrow?' },
  ],
  [ // s6 Henk
    { nl: 'Een voorbeeld. Week {n:3} bij een verpakkingsbedrijf. Henk, teamleider van in de vijftig, zegt waar jij bij staat tegen zijn ploeg: deze consultant denkt na twee weken onze lijn te kennen.',
      en: 'An example. Week {n:3} at a packaging plant. Henk, a team leader in his fifties, tells his shift in front of you: this consultant thinks he knows our line after two weeks.' },
    { nl: 'Je analyse moet vrijdag af, en je hebt zijn lijndata nog steeds nodig. Je voelde je hoofd rood worden, en zei niks.',
      en: 'Your analysis is due Friday, and you still need his line data. You felt your face go red, and said nothing.' },
    { nl: 'Plan vandaag of morgen twintig minuten alleen met hem.',
      en: 'Book twenty minutes alone with him, today or tomorrow.' },
    { nl: 'Bereid de lagen voor. De feiten: wat hij zei, en de data die je niet kreeg. Zijn waarschijnlijke verhaal: een buitenstaander die over zijn lijn oordeelt, en zijn ploeg die de schuld krijgt. Je gevoel: schaamte en irritatie. En je identiteitsval: willen bewijzen dat je het kunt.',
      en: 'Prepare the layers. The facts: what he said, and the data you did not get. His likely story: an outsider judging his line, and his team getting the blame. Your feelings: embarrassed and irritated. And your identity trap: wanting to prove you are competent.' },
    { nl: 'Je doel: de data uiterlijk woensdag, en Henk die de analyse vóór vrijdag checkt.',
      en: 'Your goal: the data by Wednesday, and Henk checking the analysis before Friday.' },
  ],
  [ // s7 the talk with Henk
    { nl: 'Je opent zo. Henk, ik wil het hebben over je opmerking van maandag en over de data, want ik heb je hulp nodig om dit goed te krijgen.',
      en: 'You open like this. Henk, I want to talk about Monday\'s remark and about the data, because I need your help to get this right.' },
    { nl: 'Dan: toen je dat zei waar de ploeg bij was, werd het voor mij lastiger om mensen aan het praten te krijgen. Wat zit erachter?',
      en: 'Then: when you said that in front of the shift, it made it harder for me to get people to talk. What is behind it?' },
    { nl: 'Dan luister je. En je sluit af met de afspraak.',
      en: 'Then you listen. And you end with the agreement.' },
  ],
];
spec.scenes.forEach((s, si) => {
  if (!SAY[si] || SAY[si].length !== s.beats.length) throw new Error(`narration: scene ${si + 1} needs ${s.beats.length} lines`);
  s.beats.forEach((b, bi) => { b.say = SAY[si][bi]; });
});
// no symbol the voice would read aloud, no spoken parenthesis or quote, no
// digits in the Dutch voice but the marked week number
const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const plain = plainSay(line[lang]);
  if (/[/&×=+()“”"‘…%€]|:\S/.test(plain)) throw new Error(`narration: a symbol the voice reads aloud in "${plain.slice(0, 50)}"`);
  if (lang === 'nl' && /\d{2,}/.test(plain)) throw new Error(`narration: a year or number in digits in "${plain.slice(0, 50)}"`);
}
// each scene's length from its share of the narration (the longer of nl and
// en, at the kit's 2.5 words a second), never shorter than its captions need;
// the whole as long as the narration estimate, within the 300 s cap, no padding
{
  const said = SAY.map((s) => Math.max(...['nl', 'en'].map((lang) => s.reduce((a, l) => a + wordsOf(plainSay(l[lang])), 0))));
  const all = said.reduce((a, b) => a + b, 0);
  const TOTAL = Math.min(300, Math.round(all / NARRATION_WPS));
  spec.scenes.forEach((s, si) => {
    const cap = Math.max(...['nl', 'en'].map((lang) => minSceneDur(wordsOf(s.beats.map((b) => plainSay(b[lang])).join(' ')) + 4)));
    s.dur = Math.max(Math.ceil(cap), Math.floor((said[si] / all) * TOTAL));
  });
  // the seconds lost to rounding down go to the scenes that lost the most
  const left = TOTAL - spec.scenes.reduce((a, s) => a + s.dur, 0);
  spec.scenes.map((s, si) => [si, (said[si] / all) * TOTAL - s.dur]).sort((x, y) => y[1] - x[1])
    .slice(0, Math.max(0, left)).forEach(([si]) => { spec.scenes[si].dur += 1; });
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

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

const css = PM_CSS + `
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-top{fill:var(--anatomy-shade-2);stroke:var(--anatomy-mid);stroke-width:1;stroke-linejoin:round}
.pm-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:5 4}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-strike{fill:none;stroke:var(--anatomy-hi);stroke-width:2.4;stroke-linecap:round}
[data-cue][data-on] .pm-card,[data-cue][data-on] .pm-dash{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-top{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-line{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.run.scope) */
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="teamlead"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="teamlead"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.pm-mini .pm-txt,.pm-mini .pm-mute,.pm-mini .pm-big,.pm-mini .pm-on{display:none}
.pm-mini *{vector-effect:non-scaling-stroke}
.pm-mini .pm-card,.pm-mini .pm-hot,.pm-mini .pm-top,.pm-mini .pm-line,.pm-mini .pm-strike{stroke-width:.7px}
.pm-mini .pm-dash{stroke-width:.4px}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard dat het paneel in het klein herhaalt, en een klok. Aan het linkereind van de tafel jij, de adviseur in petrol, tegenover de teamleider in zijn werkvest aan het rechtereind. Op tafel een vel waarop de voorbereiding en de afspraak verschijnen, een laptop en twee kopjes. Rechts een paneel met per scène een kaart, gemarkeerd als voorbeeld of schema: drie gestapelde lagen, wat er gebeurde, gevoel en identiteit, waarvan de onderste oplicht; de vragen voor de voorbereiding op papier, bijdrage in plaats van schuld en het doel; de opening met het derde verhaal; feiten en gevoelens, impact naast bedoeling; de afspraak met de slotvraag; en het voorbeeld van Henk, met zijn voorbereiding als vier lagen en het gesprek.',
  en: 'A meeting room. On the back wall a whiteboard that repeats the panel in miniature, and a clock. At the left end of the table you, the consultant in petrol, facing the team lead in his work vest at the right end. On the table a sheet where the preparation and the agreement appear, a laptop and two cups. At the right a panel with one card per scene, marked as example or diagram: three stacked layers, what happened, feelings and identity, the bottom one lighting up; the questions for preparing on paper, contribution instead of blame, and the goal; the opening with the third story; facts and feelings, impact next to intent; the agreement with the closing question; and the example of Henk, with his preparation as four layers and the talk.',
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

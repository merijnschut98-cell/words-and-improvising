// Dev tool, not shipped. Builds the explainer film "Feedback, ook naar boven /
// Feedback, upward too" for the Projects course: pm.lead.feedback (level 1 of
// Feedback en moeilijke gesprekken, Feedback die aankomt), pm.perform.dialogue
// (level 1 of Het prestatiegesprek en gedrag) and pm.negotiate.senior (level 3
// of Voet bij stuk houden, Het oneens zijn met iemand die hoger staat).
//
//   node films/pm.lead.feedback/build.mjs            build the page
//   node films/pm.lead.feedback/build.mjs --audit    build, then report pace, terms and words
//
// Writes src/content/courses/films/pm.lead.feedback.html: one offline page with
// the anatomy kit, the stage script and the player inlined.
// Storyboard: docs/superpowers/plans/2026-11-07-v14-explainer-films.md, 3.7
// (pm.lead.feedback, P2): SBI built sentence by sentence, then a performance
// conversation and disagreeing with a senior. Storyboard drift: the plan's five
// beats and ~110 s are nine scenes of about 295 s (each scene as long as its
// share of the narration), because lessons with a film no longer show their
// worked example, so the film carries every point of all three lessons' teach
// text and all three worked examples (as pm.run.scope and pm.plan.wbs): the
// lead lesson takes four scenes (SBI, behaviour not a label, upward and
// receiving, the sponsor example), the performance conversation two (facts,
// then cause and commitment, each with Mark's numbers) and the senior lesson
// three (fact-view-request, the steering group example, when to stop).
//
// A people film in the shared pm world (films/_pm/world.mjs, read-only here):
// the meeting room of pm.run.scope without its calendar strip: the whiteboard,
// a wall clock, the table with a sheet and a laptop, and the recurring cast:
// "jij" the consultant in petrol at the board, the sponsor (the operations
// director of the lead example, the COO of the senior example), the team lead
// (Peter in the lead example, crew lead Mark in the performance example) and
// the planner (Sandra). A panel at the right, in stage space, carries one card
// per scene, labelled "schema" (a general picture) or "voorbeeld" (a worked
// example; the label follows the beat), each part in its own cue group, so a
// beat's focus lights the part it explains; the board repeats the panel in
// miniature.
//
// Checklist (lesson point: scene.beat; "card" = on the panel only, shown for
// the whole beat, at least 4 s):
//   lead.feedback teach 1: SBI from the Center for Creative Leadership,
//     situation, behaviour, impact (1.1); situation when and where; behaviour
//     observable, what a camera would have recorded, no interpretation (1.2);
//     impact on you, the team or the result; then a question (1.3); yesterday's
//     workshop, on the phone most of the second hour (1.4); two operators
//     stopped talking, thought it was decided; "what was going on?" (1.5)
//   teach 2: behaviour, not character: "you interrupted Ans twice" is
//     feedback, "you're dominant" a label people defend against (2.1); tie the
//     impact to what he cares about, his goal, team, the project he sponsors;
//     one point per conversation, three at once a performance review (2.2);
//     many trainers advise against the feedback sandwich, criticism between
//     two compliments: people brace at every compliment and miss the message
//     (2.3)
//   teach 3: as soon as you can, in private, both calm, within a day or two;
//     not right before he presents (2.4); positive feedback works the same and
//     more often; specific praise builds credit for the harder message (2.5),
//     the outage numbers example (card 2.5); vague praise, "good job", builds
//     nothing, nobody knows what to repeat (2.5)
//   teach 4: upward feedback, to someone above you in rank or power, a senior
//     client; ask permission, "can I share what I noticed this morning?" (3.1);
//     the shared goal, keep it small, "I noticed"; then ask and listen (3.2);
//     pushback: don't argue the facts again, ask what he saw; lands: "Hm.
//     Fair." (card 3.3); doesn't land: he changes the subject, leave it for
//     today (3.3)
//   teach 5: receiving: thanks, ask for an example "so I know what to change",
//     don't defend on the spot, come back later with what you did (3.4);
//     feedforward, Marshall Goldsmith's term, looks ahead, one or two
//     suggestions for next time (3.5, card); "what should I do differently
//     next session?" is easier to answer honestly than "how did I do?" (3.5)
//   lead example: food manufacturer, the operations director, 55 (card) and
//     your sponsor, answered every question you put to his team leads; after
//     the fourth they went quiet (4.1); you need them to own the actions, a
//     slot after lunch; step 1 permission and his goal (4.2); step 2 SBI: the
//     changeover data, the first four questions himself, Peter and Sandra
//     quiet, their commitment needed (4.3); step 3 ask and stop talking, "how
//     did you see it?", he agrees, they answer first and he adds after (4.4)
//   perform.dialogue teach 1: a short, regular talk about the numbers between
//     a manager and whoever owns them, often weekly, 15 to 30 minutes (card),
//     facts, cause, commitment (5.1); most skip the middle, from a red number
//     (below target) to "try harder" (5.2)
//   teach 2: what the number shows, against which target, over which period,
//     a real change or a normal week (5.3, card); the trend, six to eight
//     points, not one; agree on the facts before the why; disputed data: fix
//     the data first (5.3)
//   teach 3: an open question, no yes or no: "where did the jobs get stuck?"
//     (6.1), "what happened in the weeks that went well?", go and look (card
//     6.1); a one-off like a storm apart from a pattern like materials late
//     every Monday (6.2); outside the team's control: accept that part, ask
//     which part was inside (6.3)
//   teach 4: a commitment: one or two actions, each with an owner, a date and
//     a way to see whether it worked; start next time with them (6.4); hard on
//     the numbers, soft on the people; learn what to do, not who to blame
//     (6.5). Not said: the pointer to the lead module's lesson (navigation,
//     and this film is that lesson's film).
//   teach 5: a status round, actions without an owner, the manager answering
//     his own questions; the owner speaks first, the manager last (6.6); a red
//     number on a team board is open, one person's performance private;
//     "what did we agree last time, and did it work?" (6.7)
//   perform example: a grid operator, crew lead Mark; target 85% of jobs on
//     the planned day; 84, 86, 83 and 70% (5.4); 40 planned, 12 not on the
//     day; "it was the weather"; 70% (28 of 40) clearly below the normal 83 to
//     86% (5.5); 5 storm, 7 materials; the storm a one-off, the materials
//     inside the team's control (6.3); Mark checks next week's materials with
//     the warehouse every Thursday, the next review starts with that check (6.4)
//   negotiate.senior teach 1: disagreeing upwards is what clients pay for, not
//     their own opinion back (7.1); Edmondson's research (1999, card) on
//     psychological safety, safe to speak up, ask and disagree; teams with
//     more of it learn more; you help by speaking up well (7.2)
//   teach 2: fact-view-request, three things kept apart: "the data of the last
//     12 weeks shows X" the fact, "I think that means Y" the view, "check Z
//     before deciding" the request (7.3, the X, Y, Z lines on the card); a
//     clear request turns disagreement into a next step (7.3)
//   teach 3: a big disagreement one-on-one first, never surprise a senior in
//     front of his team; in a meeting a question, not a verdict: "can I add
//     one thing from the data?" (7.4); voice low, pace slow, calm reads as
//     confident (7.4). Not said: the pointer to Assertief, niet agressief
//     (navigation).
//   teach 4: say it clearly once, a second time only with new information
//     (9.1); otherwise and not about safety or integrity: disagree and commit,
//     accept, carry it out fully, note what you advised (9.2); safety or
//     integrity: the escalation path, openly to the next level up, telling the
//     person first (9.3)
//   teach 5: the most senior speaks first and the room lines up behind (card
//     9.4); failure modes: hinting so softly nobody notices, winning in public
//     and losing the person, going to the boss behind his back (9.4);
//     disagree and commit came from Intel, made widely known by Jeff Bezos of
//     Amazon; critics: it can silence people, it only works if the
//     disagreement was truly heard first (9.5); "what would you need to see to
//     change your mind?" (9.6)
//   senior example: steering group at a parts manufacturer; the COO: late
//     deliveries because operators don't follow the schedule, a bonus
//     criterion (8.1); 120 late orders in 12 weeks, 84 started late because
//     materials came in late; you are the youngest; calmly "can I add one
//     thing from the data?" (8.2); the fact, 84 of 120, 70%; the view, a bonus
//     may not move it much (8.3); the request, materials first and the bonus
//     next month; if he holds his view, no second argument in the room, ask
//     for 15 minutes afterwards (8.4)
//
// Facts checked: SBI (Situation-Behavior-Impact) is the Center for Creative
// Leadership's feedback model; "feedforward" is Marshall Goldsmith's term;
// Amy Edmondson, "Psychological Safety and Learning Behavior in Work Teams",
// Administrative Science Quarterly 44 (1999): team psychological safety goes
// with team learning behaviour; "disagree and commit" is an Intel principle
// (Andy Grove's era) that Jeff Bezos made widely known (Amazon's 2016 letter to
// shareholders). The film credits nothing else: the advice against the
// feedback sandwich is "many trainers", as the lesson says.
//
// The kit comes from the anatomy skill; point ANATOMY_SKILL at its folder if it
// lives somewhere else on your machine.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineFilm, auditReport, resolveFilm, allLessons } from '../_kit/build-film.mjs';
import { beatStarts, wordsOf, minSceneDur } from '../_kit/timeline.mjs';
import { pmWorld, PM_CSS } from '../_pm/world.mjs';

const SKILL = process.env.ANATOMY_SKILL
  ?? '/root/.claude/skills/synced/59baa0b0-2d6e-4f06-b18f-f0d55a7a3cd1_1e0d6f08-7fe3-4a9a-a188-69ec2a55ed01/anatomy';
const k = await import(pathToFileURL(join(SKILL, 'kit/iso-kit.mjs')).href);
const G = await import(pathToFileURL(join(SKILL, 'kit/lathe.mjs')).href);
const { kitScript } = await import(pathToFileURL(join(SKILL, 'scripts/inline-kit.mjs')).href);
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- the model
// The three lessons' facts, asserted against their current text (the build
// fails if one drifts); the {n:...} numbers are then checked against the Dutch
// lesson text by defineFilm.
const LF = 'pm.lead.feedback';
const PD = 'pm.perform.dialogue';
const NS = 'pm.negotiate.senior';
const lessons = await allLessons();
const assert = (ok, what) => { if (!ok) throw new Error(`model: ${what}`); };
const textOf = (id, lang = 'nl') => { const l = lessons[lang].get(id); return `${l.teach.join('\n')}\n${l.example.text}\n${l.example.reveal || ''}`; };
const says = (id, list, lang = 'nl') => { const t = textOf(id, lang); const miss = list.filter((s) => !t.includes(s)); assert(!miss.length, `${id} (${lang}) no longer says: ${miss.map((s) => `"${s}"`).join(", ")}`); };
says(LF, ['Center for Creative Leadership', 'Situatie: wanneer en waar', 'wat een camera had opgenomen, zonder interpretatie', 'het effect op jou, het team of het resultaat', 'Daarna een vraag',
  'grootste deel van het tweede uur op je telefoon', 'Twee operators zeiden daarna niks meer, omdat ze dachten dat het al besloten was', 'Wat speelde er?',
  'Je onderbrak Ans twee keer', 'je bent dominant', 'zijn doel, zijn team, het project dat hij sponsort', 'punt per gesprek; drie tegelijk', 'beoordelingsgesprek', 'feedbacksandwich af, kritiek tussen twee complimenten', 'zetten zich bij elk compliment schrap',
  'Zo snel als het kan, onder vier ogen, als jullie allebei rustig zijn: binnen een dag of twee', 'Niet vlak voordat hij moet presenteren', 'Positieve feedback werkt op dezelfde manier en mag vaker', 'storingscijfers', 'bouwt het krediet op', '“goed gedaan”', 'niemand weet wat hij moet herhalen',
  'hoger staat in rang of macht', 'Mag ik iets delen wat me vanochtend opviel?', 'gezamenlijke doel, houd het klein, zeg “mij viel op”', 'Vraag dan en luister', 'herhaal de feiten dan niet; vraag wat hij zag', 'Hm. Terecht.', 'begint hij over iets anders: laat het dan voor vandaag rusten',
  'Zeg dank je, vraag om een voorbeeld, verdedig je niet ter plekke', 'Kom later terug met wat je ermee gedaan hebt', 'Feedforward, een term van Marshall Goldsmith', 'één of twee tips voor de volgende keer', 'Wat moet ik de volgende sessie anders doen?', 'Hoe deed ik het?',
  'voedingsmiddelenbedrijf', 'operationeel directeur, 55 en je sponsor', 'Na de vierde keer zeiden de teamleiders niks meer', 'eigenaar worden van de acties', 'na de lunch',
  'omstellingsdata', 'beantwoordde jij de eerste vier vragen zelf', 'Peter en Sandra niks meer', 'commitment op de acties', 'Hoe zag jij het?', 'dat zij eerst antwoorden en jij daarna aanvult']);
says(PD, ['kort, vast gesprek over de cijfers tussen een leidinggevende en het team of de persoon die er eigenaar van is', 'vaak wekelijks, 15 tot 30 minuten', 'feiten, oorzaak, afspraak', 'slaan het midden over', '“beter je best doen”',
  'tegen welk doel, over welke periode', 'zes tot acht punten', 'Word het eerst eens over de feiten', 'los dan eerst de data op',
  'open vraag', 'Waar bleven de klussen hangen?', 'Wat gebeurde er in de weken die goed gingen?', 'Ga kijken als het kan', 'zoals een storm', 'materiaal dat elke maandag te laat is', 'accepteer dat deel en vraag welk deel er wel binnen lag',
  'één of twee acties, elk met een eigenaar, een datum en een manier om te zien of het gewerkt heeft', 'Begin de volgende keer met die acties', 'hard op de cijfers, zacht op de mensen', 'niet uitzoeken wie de schuld heeft',
  'statusrondje', 'acties stapelen zich op zonder eigenaar', 'beantwoordt zijn eigen vragen', 'de eigenaar van het cijfer praat eerst, de leidinggevende als laatste', 'de prestatie van één persoon bespreek je apart', 'Wat spraken we de vorige keer af, en werkte het?',
  'ploegleider Mark', '85% van de klussen start op de geplande dag', '84, 86, 83 en 70%', '40 klussen gepland en 12 daarvan', 'Dat was het weer', '70% (28 van de 40)', 'normale 83 tot 86%', '5 kwamen door de storm, 7 doordat het materiaal niet klaar was', 'elke donderdag met het magazijn', 'begint met hoe die check ging']);
says(NS, ['Ze huren geen consultant in om hun eigen mening terug te horen', 'Amy Edmondson naar psychologische veiligheid (1999)', 'veilig je mond kunt opendoen, vragen kunt stellen en het oneens kunt zijn', 'teams met meer daarvan meer leren', 'door het zelf goed te doen',
  'feit-visie-verzoek', 'De data van de laatste 12 weken laat X zien', 'Ik denk dat dat Y betekent', 'Z te checken voordat we besluiten', 'Een helder verzoek maakt van onenigheid een volgende stap',
  'eerst één-op-één', 'overval nooit iemand die hoger staat waar zijn team bij is', 'liever een vraag dan dat je een oordeel geeft', 'Mag ik er één ding uit de data aan toevoegen?', 'Houd je stem laag en je tempo rustig', 'Kalmte komt over als zelfvertrouwen',
  'Zeg het één keer duidelijk, en een tweede keer alleen met nieuwe informatie', 'niet over veiligheid of integriteit', 'voer het besluit volledig uit en noteer wat je hebt geadviseerd', 'escalatiepad', 'bij het niveau erboven, en je zegt dat eerst tegen de persoon zelf',
  'de hoogste in rang praat eerst', 'zo zacht hinten dat niemand het merkt', 'de discussie in het openbaar winnen en de persoon kwijtraken', 'achter iemands rug naar zijn baas stappen',
  'komt van Intel en werd bekend door Jeff Bezos van Amazon', 'monddood', 'als het bezwaar eerst echt gehoord is', 'Wat zou je moeten zien om van gedachten te veranderen?',
  'onderdelenfabrikant', 'operators zich niet aan de planning houden', 'bonuscriterium', 'van de 120 te late orders in de laatste 12 weken startten er 84 te laat omdat het materiaal te laat binnenkwam', 'de jongste in de kamer',
  'dat is 70%', 'een bonus voor operators gaat het misschien niet veel veranderen', 'eerst naar het materiaal kijken, en volgende maand over de bonus besluiten', 'niet een tweede keer in de kamer in discussie', 'Vraag om een kwartier na afloop']);
says(LF, ['Center for Creative Leadership', 'you answered the first four questions yourself', 'Peter and Sandra'], 'en');
says(PD, ['84, 86, 83 and 70%', '70% (28 of 40)', '5 were due to the storm, 7 to materials'], 'en');
says(NS, ['84 of the 120 late orders', 'that’s 70%', 'Ask for 15 minutes afterwards'], 'en');
// the performance example: 28 of 40 jobs on the day is 70%, below the normal 83–86%; 12 missed = 5 + 7
const JOBS = 40;
const ON = 28;
const WEEKS = [84, 86, 83, 70];
const TARGET = 85;
assert(JOBS - ON === 12 && (ON / JOBS) * 100 === 70 && WEEKS[3] === 70, '28 of 40 on the day: 12 missed, 70%');
assert(5 + 7 === JOBS - ON, 'the 12 missed jobs split 5 storm, 7 materials');
assert(Math.min(...WEEKS.slice(0, 3)) === 83 && Math.max(...WEEKS.slice(0, 3)) === 86 && WEEKS[3] < 83, '70% is below the normal 83 to 86%');
// the senior example: 84 of 120 late orders is 70%
const LATE = 120;
const MAT = 84;
assert((MAT / LATE) * 100 === 70, '84 of 120 is 70%');

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
const SHEET = w.sheet({ x: 196, y: 150, z: TZ, w: 21, d: 29.7 });
const SHEET_AT = w.at([206, 165, TZ]);
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
// the sheet on the table: the notes of the talk fill in (the agreement, the request)
const sheetLines = `<g transform="${SHEET.face}">${g('dLines', '')}</g>`;

const world = [
  w.room(ROOM),
  w.clock(266, 186, 11),
  cueG('board', BOARD.svg + boardMini),
  w.person({ x: 44, y: 50, role: 'jij', along: 'x', reach: [72, 6, 150] }),
  w.chair({ x: 136, y: 100, back: -1 }),
  w.chair({ x: 206, y: 100, back: -1 }),
  w.person({ x: 76, y: 182, role: 'teamlead', along: 'y' }),
  w.table(TABLE),
  cueG('paper', SHEET.svg + sheetLines),
  cueG('laptop', w.laptop({ x: 150, y: 140, z: TZ, toward: 1 })),
  w.cup(122, 176, TZ),
  w.cup(236, 126, TZ),
  w.person({ x: 270, y: 152, role: 'sponsor', along: 'y' }),
  w.person({ x: 236, y: 218, role: 'planner', along: 'x' }),
].join('');

// ---------------------------------------------------------------- the panel (stage space)
// One card per scene, drawn by stage.js into these groups; each part of a card
// sits in its own cue group, so a beat's focus (and a term's cue) can light it.
const PX = 322;
const PW = 308;
const CUES = ['sbi', 'sbiS', 'sbiB', 'sbiI', 'ask', 'fact', 'label', 'care', 'one', 'sandwich', 'timing', 'praise',
  'up', 'goal', 'land', 'receive', 'ff', 'ctx', 'step1', 'step2', 'step3',
  'pg', 'skip', 'facts', 'cause', 'deal', 'chart', 'open', 'oneoff', 'pattern', 'split', 'tone', 'wrong', 'private',
  'why', 'ps', 'fvv', 'view', 'req', 'setting', 'claim', 'data', 'after', 'once', 'dc', 'esc', 'traps', 'origin', 'sharp'];
const hud = g('panel', `<rect class="pm-panel" x="${PX}" y="12" width="${PW}" height="376" rx="10"/>`
  + g('pHead', '') + g('pBody', '')
  + CUES.map((c) => cueG(c, g(`p_${c}`, ''))).join(''));

// Static paths with relative line-tos (the helper of pm.run.scope): the same
// points, fewer bytes; each rewrite is read back.
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
const SP = w.at([270, 152, 150]);
const TL = w.at([76, 182, 150]);
const CAM = [
  { from: [150, 210, 1], to: [120, 190, 1.08] },
  { from: [140, 200, 1.04], to: [150, 190, 1.1] },
  { from: [SP[0], SP[1], 1.04], to: [SP[0], SP[1], 1.12] },
  { from: [150, 200, 1.02], to: [SP[0], SP[1], 1.1] },
  { from: [TL[0], TL[1], 1.04], to: [TL[0], TL[1], 1.12] },
  { from: [SHEET_AT[0], SHEET_AT[1], 1.06], to: [SHEET_AT[0], SHEET_AT[1], 1.16] },
  { from: [150, 210, 1], to: [130, 190, 1.08] },
  { from: [SP[0], SP[1], 1.02], to: [SP[0], SP[1], 1.12] },
  { from: [160, 200, 1.06], to: [150, 210, 1] },
];

// ---------------------------------------------------------------- the film
// placeholders: each scene's length is fitted to its narration below
const DURS = [30, 36, 40, 34, 34, 46, 36, 34, 40];
const C = { PX, PW, CUES, WEEKS, TARGET, JOBS, ON, LATE, MAT, dur: DURS };
const sc = (id, lesson, level, title, beats) => ({ id, lesson, level, dur: DURS[Number(id.slice(1)) - 1], still: 0.9, title, beats });
const spec = {
  id: 'pm.lead.feedback',
  title: { nl: 'Feedback, ook naar boven', en: 'Feedback, upward too' },
  lessons: [LF, PD, NS],
  strictFocus: true,
  scenes: [
    sc('s1', LF, 1, { nl: 'Situatie, gedrag, impact', en: 'Situation, behaviour, impact' }, [
      { nl: '{t:SBI|SBI}, van het Center for Creative Leadership: situatie, gedrag, impact.', en: '{t:SBI|SBI}, from the Center for Creative Leadership: situation, behaviour, impact.', cue: { SBI: 'sbi' }, focus: 'sbi' },
      { nl: 'Situatie: wanneer en waar. Gedrag: {t:Waarneembaar gedrag|waarneembaar gedrag}, wat een camera opneemt.', en: 'Situation: when and where. Behaviour: {t:Observable behaviour|observable behaviour}, what a camera records.', cue: { 'Waarneembaar gedrag': 'sbiB' }, focus: ['sbiS', 'sbiB'] },
      { nl: 'Impact: het effect op jou, het team of het resultaat. Daarna een vraag.', en: 'Impact: the effect on you, the team or the result. Then a question.', focus: ['sbiI', 'ask'] },
      { nl: '“In de workshop van gisteren zat je het tweede uur vooral op je telefoon.”', en: '“In yesterday’s workshop you were on your phone for most of the second hour.”', focus: ['sbiS', 'sbiB'] },
      { nl: '“Twee operators zwegen daarna: ze dachten dat het al besloten was. Wat speelde er?”', en: '“Two operators went quiet: they thought it was already decided. What was going on?”', focus: ['sbiI', 'ask'] },
    ]),
    sc('s2', LF, 1, { nl: 'Gedrag, geen etiket', en: 'Behaviour, not a label' }, [
      { nl: '“Je onderbrak Ans twee keer” is feedback. “Je bent dominant” is een etiket.', en: '“You interrupted Ans twice” is feedback. “You’re dominant” is a label.', focus: ['fact', 'label'] },
      { nl: 'Koppel de impact aan zijn doel, team of project. Eén punt per gesprek.', en: 'Tie the impact to their goal, team or project. One point per conversation.', focus: ['care', 'one'] },
      { nl: 'De {t:Feedbacksandwich|feedbacksandwich}, kritiek tussen twee complimenten: veel trainers raden het af.', en: 'The {t:Feedback sandwich|feedback sandwich}, criticism between two compliments: many trainers advise against it.', cue: { Feedbacksandwich: 'sandwich' }, focus: 'sandwich' },
      { nl: 'Zo snel het kan, onder vier ogen, allebei rustig. Niet vlak voor hij presenteert.', en: 'As soon as you can, in private, both calm. Not right before he presents.', focus: 'timing' },
      { nl: 'Positief werkt net zo, en mag vaker. Concreet bouwt krediet op; “goed gedaan” bouwt niks.', en: 'Positive works the same, and more often. Specific builds credit; “good job” builds nothing.', focus: 'praise' },
    ]),
    sc('s3', LF, 1, { nl: 'Mag ik iets delen?', en: 'Can I share something?' }, [
      { nl: '{t:Feedback naar boven|Feedback naar boven}: aan iemand hoger in rang of macht. Vraag eerst toestemming.', en: '{t:Upward feedback|Upward feedback}: to someone above you in rank or power. Ask permission first.', cue: { 'Feedback naar boven': 'up' }, focus: ['up', 'sponsor'] },
      { nl: 'Over het gezamenlijke doel, klein, en “mij viel op”. Dan vragen en luisteren.', en: 'About the shared goal, small, and “I noticed”. Then ask and listen.', focus: 'goal' },
      { nl: 'Gaat hij ertegenin? Vraag wat hij zag. Begint hij over iets anders? Laat het rusten.', en: 'He pushes back? Ask what he saw. He changes the subject? Leave it for today.', focus: ['land', 'sponsor'] },
      { nl: 'Zelf ontvangen: dank je, vraag om een voorbeeld, verdedig je niet. Kom later terug.', en: 'Receiving it: thanks, ask for an example, don’t defend. Come back later.', focus: ['receive', 'jij'] },
      { nl: '{t:Feedforward|Feedforward}, van Marshall Goldsmith: vraag om tips voor de volgende keer.', en: '{t:Feedforward|Feedforward}, Marshall Goldsmith’s term: ask for suggestions for next time.', cue: { Feedforward: 'ff' }, focus: 'ff' },
    ]),
    sc('s4', LF, 1, { nl: 'Na de lunch', en: 'After lunch' }, [
      { nl: 'Je sponsor, de directeur, beantwoordt elke vraag aan zijn teamleiders. Na de vierde zwijgen ze.', en: 'Your sponsor, the director, answers every question to his team leads. After the fourth they go quiet.', focus: ['ctx', 'sponsor', 'teamlead', 'planner'] },
      { nl: 'Stap 1, na de lunch: “Mag ik iets delen? Het gaat over wat je me vroeg.”', en: 'Step 1, after lunch: “Can I share an observation? It’s about what you asked me for.”', focus: ['step1', 'sponsor'] },
      { nl: 'Stap 2, SBI: “Jij beantwoordde de eerste vier vragen. Daarna zwegen Peter en Sandra.”', en: 'Step 2, SBI: “You answered the first four questions. Then Peter and Sandra went quiet.”', focus: ['step2', 'teamlead', 'planner'] },
      { nl: 'Stap 3: “Hoe zag jij het?” Volgende keer antwoorden zij eerst, en vult hij aan.', en: 'Step 3: “How did you see it?” Next time they answer first, and he adds his after.', focus: ['step3', 'jij'] },
    ]),
    sc('s5', PD, 1, { nl: 'Eerst de feiten', en: 'Facts first' }, [
      { nl: 'Een {t:Prestatiegesprek|prestatiegesprek}: kort, vast, over de cijfers. Feiten, oorzaak, afspraak.', en: 'A {t:Performance conversation|performance conversation}: short, regular, about the numbers. Facts, cause, commitment.', cue: { Prestatiegesprek: 'pg' }, focus: 'pg' },
      { nl: 'De meeste overleggen slaan het midden over: van rood naar “beter je best doen”.', en: 'Most reviews skip the middle: from red to “try harder”.', focus: 'skip' },
      { nl: 'Feiten: welk cijfer, welk doel, welke periode? Kijk naar zes tot acht punten, niet één.', en: 'Facts: which number, which target, which period? Look at six to eight points, not one.', focus: 'facts' },
      { nl: 'Ploegleider Mark, netbeheerder. Doel {n:85}%. Vier weken: {n:84}, {n:86}, {n:83} en {n:70}%.', en: 'Crew lead Mark, grid operator. Target {n:85}%. Four weeks: {n:84}, {n:86}, {n:83} and {n:70}%.', focus: ['chart', 'teamlead'] },
      { nl: '“Dat was het weer.” Maar {n:28} van de {n:40} ligt duidelijk onder het normale.', en: '“It was the weather.” But {n:28} of {n:40} is clearly below normal.', focus: ['chart', 'teamlead'] },
    ]),
    sc('s6', PD, 1, { nl: 'Oorzaak en afspraak', en: 'Cause and commitment' }, [
      { nl: 'Oorzaak: een {t:Open vraag|open vraag}, geen ja of nee. “Waar bleven klussen hangen?”', en: 'Cause: an {t:Open question|open question}, no yes or no. “Where did the jobs get stuck?”', cue: { 'Open vraag': 'open' }, focus: 'open' },
      { nl: 'Een {t:Eenmalige oorzaak|eenmalige oorzaak}: een storm. Een {t:Patroon|patroon}: elke maandag laat materiaal.', en: 'A {t:One-off|one-off}, like a storm, is no {t:Pattern|pattern}, like materials late every Monday.', cue: { 'Eenmalige oorzaak': 'oneoff', Patroon: 'pattern' }, focus: ['oneoff', 'pattern'] },
      { nl: '{n:5} door de storm, {n:7} door het materiaal. Het materiaal ligt binnen de invloed van het team.', en: '{n:5} from the storm, {n:7} from materials. The materials are inside the team’s control.', focus: ['split', 'teamlead'] },
      { nl: 'De {t:Afspraak|afspraak}: Mark checkt elke donderdag het materiaal met het magazijn.', en: 'The {t:Commitment|commitment}: Mark checks the materials with the warehouse every Thursday.', cue: { Afspraak: 'deal' }, focus: ['deal', 'paper'] },
      { nl: 'Hard op de cijfers, zacht op de mensen: leren, geen schuld zoeken.', en: 'Hard on the numbers, soft on the people: learning, not blame.', focus: 'tone' },
      { nl: 'Mis: een statusrondje, acties zonder eigenaar. De eigenaar praat eerst, de leider als laatste.', en: 'Wrong: a status round, actions without an owner. The owner speaks first, the manager last.', focus: 'wrong' },
      { nl: 'Eén persoon bespreek je apart. “Wat spraken we af, en werkte het?”', en: 'One person’s performance is a private talk. “What did we agree, and did it work?”', focus: 'private' },
    ]),
    sc('s7', NS, 3, { nl: 'Feit, visie, verzoek', en: 'Fact, view, request' }, [
      { nl: 'Het oneens zijn met wie boven je staat: daar betalen klanten je voor.', en: 'Disagreeing upwards: that is what clients pay you for.', focus: 'why' },
      { nl: '{t:Psychologische veiligheid|Psychologische veiligheid}: teams waar je veilig je mond opendoet, leren meer.', en: '{t:Psychological safety|Psychological safety}: teams where it is safe to speak up learn more.', cue: { 'Psychologische veiligheid': 'ps' }, focus: 'ps' },
      { nl: '{t:Feit-visie-verzoek|Feit-visie-verzoek}: houd het feit, je visie en je verzoek uit elkaar.', en: '{t:Fact-view-request|Fact-view-request}: keep the fact, your view and your request apart.', cue: { 'Feit-visie-verzoek': 'fvv' }, focus: ['fvv', 'fact', 'view', 'req'] },
      { nl: 'Groot verschil: eerst één-op-één. In een overleg een vraag, geen oordeel. Rustig en laag.', en: 'A big disagreement: one-on-one first. In a meeting a question, not a verdict. Calm and low.', focus: ['setting', 'jij'] },
    ]),
    sc('s8', NS, 3, { nl: 'De stuurgroep', en: 'The steering group' }, [
      { nl: 'De COO: “Operators houden zich niet aan de planning. Dat wordt een bonuscriterium.”', en: 'The COO: “Operators don’t follow the schedule. We’ll make it a bonus criterion.”', focus: ['claim', 'sponsor'] },
      { nl: 'Jij, de jongste in de kamer, vraagt rustig: “Mag ik één ding uit de data toevoegen?”', en: 'You, the youngest in the room, calmly ask: “Can I add one thing from the data?”', focus: ['data', 'jij'] },
      { nl: 'Feit: {n:84} van de {n:120} te late orders, {n:70}%, door laat materiaal. Visie: een bonus helpt weinig.', en: 'Fact: {n:84} of the {n:120} late orders, {n:70}%, from late materials. View: a bonus may not help.', focus: ['fact', 'view', 'data'] },
      { nl: 'Verzoek: eerst het materiaal, volgende maand de bonus. Blijft hij erbij? Een kwartier na afloop.', en: 'Request: materials first, the bonus next month. He holds his view? Fifteen minutes afterwards.', focus: ['req', 'after'] },
    ]),
    sc('s9', NS, 3, { nl: 'Weten wanneer je stopt', en: 'Knowing when to stop' }, [
      { nl: 'Zeg het één keer duidelijk. Een tweede keer alleen met nieuwe informatie.', en: 'Say it clearly once. A second time only with new information.', focus: 'once' },
      { nl: 'Geen veiligheid of integriteit? {t:Disagree and commit|Disagree and commit}: voer het volledig uit.', en: 'Not safety or integrity? {t:Disagree and commit|Disagree and commit}: carry it out fully.', cue: { 'Disagree and commit': 'dc' }, focus: 'dc' },
      { nl: 'Wel veiligheid of integriteit? Het {t:Escalatiepad|escalatiepad}, open, en eerst tegen hem zelf.', en: 'Safety or integrity? The {t:Escalation path|escalation path}, openly, and tell him first.', cue: { Escalatiepad: 'esc' }, focus: 'esc' },
      { nl: 'Valkuilen: te zacht hinten, in het openbaar winnen, achter zijn rug naar zijn baas.', en: 'Failure modes: hinting too softly, winning in public, going behind their back.', focus: 'traps' },
      { nl: 'Van Intel, bekend door Jeff Bezos. Het werkt alleen als het bezwaar echt gehoord is.', en: 'From Intel, made known by Jeff Bezos. It only works if the disagreement was truly heard.', focus: 'origin' },
      { nl: '“Wat zou je moeten zien om van gedachten te veranderen?”', en: '“What would you need to see to change your mind?”', focus: ['sharp', 'jij'] },
    ]),
  ],
  skip: [],
};

// ---------------------------------------------------------------- the narration (v14b)
// What the voice says, per scene and beat; with the captions and the cards it
// carries every point of the checklist above. No symbols the voice would read
// aloud: words for %, no quotes or parentheses. Words checked with espeak-ng
// phonemes through Piper's own bridge (nl_NL-alex, 2026-11-12). The Dutch
// narration says the terms the cards show; the kit's SAY rules added with
// this film voice them (feedback as fiedbek, feedbacksandwich, feedforward,
// SBI as letters, disagree and commit, prestatie-gesprek and escalatie-pad
// split at the head, in-tegriteit, and the names Center for Creative
// Leadership, Marshall Goldsmith, Edmondson and Jeff Bezos as English names).
// Kept out of the Dutch narration because espeak-ng misreads them (they stay
// in the captions and cards): omstellingsdata (stressed on "data": "de
// omstellingen"), commitment (stressed at the end: "hun inzet"), operationeel
// directeur ("de directeur"), "Hm" (read as the letters H M: the voice says
// "terecht" only on the card's line) and Amy (read "Aamie": the voice says
// Edmondson; the card names her). Left as espeak-ng reads them: visie
// (vi-ZIE, understandable) and COO (read as letters, as the lesson means).
const SAY = [
  [ // s1 SBI
    { nl: '{t:SBI|SBI}, van het Center for Creative Leadership, bouwt feedback op: situatie, gedrag, impact.',
      en: '{t:SBI|SBI}, from the Center for Creative Leadership, builds feedback: situation, behaviour, impact.' },
    { nl: 'Situatie: wanneer en waar. Gedrag: {t:Waarneembaar gedrag|waarneembaar gedrag}, wat een camera had opgenomen, zonder interpretatie.',
      en: 'Situation: when and where. Behaviour: {t:Observable behaviour|observable behaviour}, what a camera would have recorded, without interpretation.' },
    { nl: 'Impact: het effect op jou, het team of het resultaat. Daarna een vraag.',
      en: 'Impact: the effect on you, the team or the result. Then a question.' },
    { nl: 'In de workshop van gisteren zat je het grootste deel van het tweede uur op je telefoon.',
      en: 'In yesterday\'s workshop, you were on your phone for most of the second hour.' },
    { nl: 'Twee operators zwegen daarna; ze dachten dat het al besloten was. Wat speelde er?',
      en: 'Two operators went quiet; they thought it was already decided. What was going on?' },
  ],
  [ // s2 behaviour, not a label
    { nl: 'Gedrag, geen karakter. Je onderbrak Ans twee keer: feedback. Je bent dominant: een etiket, en daar verdedigen mensen zich tegen.',
      en: 'Behaviour, not character. You interrupted Ans twice: feedback. You\'re dominant: a label, and people defend against it.' },
    { nl: 'Koppel de impact aan zijn doel, team of project. Per gesprek één punt; drie tegelijk wordt een beoordelingsgesprek.',
      en: 'Tie the impact to their goal, team or project. One point per conversation; three at once becomes a performance review.' },
    { nl: 'Veel trainers raden de {t:Feedbacksandwich|feedbacksandwich} af: mensen zetten zich schrap en missen de boodschap.',
      en: 'Many trainers advise against the {t:Feedback sandwich|feedback sandwich}: people brace and miss the message.' },
    { nl: 'Geef het snel, binnen een dag of twee, onder vier ogen en rustig. Niet vlak voordat hij presenteert.',
      en: 'Give it soon, within a day or two, in private and calm. Not right before he presents.' },
    { nl: 'Positieve feedback werkt net zo, en mag vaker. Concreet bouwt krediet op; goed gedaan bouwt niks.',
      en: 'Positive feedback works the same way, and more often. Specific praise builds credit; good job builds nothing.' },
  ],
  [ // s3 upward, and receiving
    { nl: '{t:Feedback naar boven|Feedback naar boven} gaat naar iemand hoger in rang, zoals een senior klant. Vraag eerst: mag ik iets delen wat me opviel?',
      en: '{t:Upward feedback|Upward feedback} goes to someone above you in rank, like a senior client. Ask first: can I share an observation?' },
    { nl: 'Over het gezamenlijke doel, klein, met: mij viel op. Vraag dan, en luister.',
      en: 'About the shared goal, small, with: I noticed. Then ask, and listen.' },
    { nl: 'Gaat hij ertegenin, vraag wat hij zag, en herhaal de feiten niet. Begint hij over iets anders, laat het rusten.',
      en: 'If he pushes back, ask what he saw; don\'t argue the facts again. If he changes the subject, leave it.' },
    { nl: 'Zelf feedback? Dank je, vraag om een voorbeeld, verdedig je niet, en kom later terug.',
      en: 'Receiving it? Thanks, ask for an example, don\'t defend, and come back later.' },
    { nl: '{t:Feedforward|Feedforward}, van Marshall Goldsmith, kijkt vooruit: wat moet ik de volgende sessie anders doen? Eerlijker te beantwoorden dan: hoe deed ik het?',
      en: '{t:Feedforward|Feedforward}, Marshall Goldsmith\'s term, looks ahead: what should I do differently next session? Easier to answer honestly than: how did I do?' },
  ],
  [ // s4 the sponsor example
    { nl: 'Bij een voedingsmiddelenbedrijf beantwoordt je sponsor, de directeur, elke vraag aan zijn teamleiders. Na de vierde keer zwijgen ze.',
      en: 'At a food manufacturer, your sponsor, the operations director, answers every question to his team leads. After the fourth, they go quiet.' },
    { nl: 'Jij hebt nodig dat zij eigenaar worden. Na de lunch: mag ik iets delen? Het gaat over wat je me vroeg.',
      en: 'You need them to own the actions. After lunch: can I share an observation? It\'s about what you asked me for.' },
    { nl: 'Dan SBI: bij de omstellingen beantwoordde jij de eerste vier vragen. Daarna zwegen Peter en Sandra, en ik heb hun inzet nodig.',
      en: 'Then SBI: on the changeover data, you answered the first four questions. Then Peter and Sandra went quiet, and I need their commitment.' },
    { nl: 'Vraag, en stop met praten: hoe zag jij het? Hij is het eens: volgende keer antwoorden zij eerst.',
      en: 'Ask, and stop talking: how did you see it? He agrees: next time they answer first.' },
  ],
  [ // s5 facts first
    { nl: 'Een {t:Prestatiegesprek|prestatiegesprek} is kort en vast, over de cijfers, met wie er eigenaar van is: feiten, oorzaak, afspraak.',
      en: 'A {t:Performance conversation|performance conversation} is short and regular, about the numbers, with whoever owns them: facts, cause, commitment.' },
    { nl: 'De meeste overleggen springen van een rood cijfer meteen naar beter je best doen.',
      en: 'Most reviews jump from a red number straight to try harder.' },
    { nl: 'Eerst de feiten, over zes tot acht punten. Is de data betwist, los die dan eerst op.',
      en: 'Facts first, over six to eight points. If the data is disputed, fix the data first.' },
    { nl: 'Ploegleider Mark, bij een netbeheerder. Doel: {n:85} procent op de geplande dag. Vier weken: {n:84}, {n:86}, {n:83}, en {n:70}.',
      en: 'Crew lead Mark, at a grid operator. Target: {n:85} percent on the planned day. Four weeks: {n:84}, {n:86}, {n:83}, and {n:70}.' },
    { nl: 'Mark: dat was het weer. Maar {n:28} van de {n:40} ligt duidelijk onder normaal.',
      en: 'Mark: it was the weather. But {n:28} of {n:40} is clearly below normal.' },
  ],
  [ // s6 cause and commitment
    { nl: 'Dan de oorzaak, met een {t:Open vraag|open vraag}: waar bleven de klussen hangen?',
      en: 'Then the cause, with an {t:Open question|open question}: where did the jobs get stuck?' },
    { nl: 'Scheid een {t:Eenmalige oorzaak|eenmalige oorzaak}, zoals een storm, van een {t:Patroon|patroon}, zoals materiaal dat elke maandag te laat is.',
      en: 'Separate a {t:One-off|one-off}, like a storm, from a {t:Pattern|pattern}, like materials late every Monday.' },
    { nl: '{n:5} door de storm, {n:7} door materiaal. Accepteer de storm; praat over het materiaal.',
      en: '{n:5} from the storm, {n:7} from materials. Accept the storm; talk about the materials.' },
    { nl: 'De {t:Afspraak|afspraak}: actie, eigenaar, datum, check. Mark checkt elke donderdag het materiaal met het magazijn.',
      en: 'The {t:Commitment|commitment}: action, owner, date, check. Mark checks materials with the warehouse every Thursday.' },
    { nl: 'Hard op de cijfers, zacht op de mensen: leren, niet de schuld zoeken.',
      en: 'Hard on the numbers, soft on the people: learning, not blame.' },
    { nl: 'Wat misgaat: een statusrondje, acties zonder eigenaar. De eigenaar praat eerst.',
      en: 'What goes wrong: a status round, actions without an owner. The owner speaks first.' },
    { nl: 'Over één persoon praat je apart. En vraag: wat spraken we af, en werkte het?',
      en: 'One person\'s performance is a private talk. And ask: what did we agree, and did it work?' },
  ],
  [ // s7 fact, view, request
    { nl: 'Het oneens zijn met wie boven je staat, hoort erbij: klanten huren je niet in voor hun eigen mening.',
      en: 'Disagreeing upwards is part of the job: clients don\'t hire you for their own opinion.' },
    { nl: 'Edmondson onderzocht {t:Psychologische veiligheid|psychologische veiligheid}: teams waar je veilig je mond opendoet, leren meer.',
      en: 'Edmondson researched {t:Psychological safety|psychological safety}: teams where it is safe to speak up learn more.' },
    { nl: 'Houd {t:Feit-visie-verzoek|feit, visie en verzoek} uit elkaar: wat de data laat zien, wat jij denkt, en de stap die je vraagt.',
      en: 'Keep {t:Fact-view-request|fact, view and request} apart: what the data shows, what you think, and the step you ask for.' },
    { nl: 'Bij een groot verschil eerst één-op-één; overval niemand waar zijn team bij is. In een overleg een vraag, rustig en laag.',
      en: 'For a big disagreement, one-on-one first; never surprise someone in front of their team. In a meeting, a question, calm and low.' },
  ],
  [ // s8 the steering group
    { nl: 'Stuurgroep bij een onderdelenfabrikant. De COO: operators houden zich niet aan de planning; dat wordt een bonuscriterium.',
      en: 'Steering group at a parts manufacturer. The COO: operators don\'t follow the schedule; it becomes a bonus criterion.' },
    { nl: 'Jij bent de jongste. Vraag rustig: mag ik er één ding uit de data aan toevoegen?',
      en: 'You are the youngest. Ask calmly: can I add one thing from the data?' },
    { nl: 'Het feit: {n:84} van de {n:120} te late orders, {n:70} procent, kwamen door materiaal. Je visie: een bonus verandert weinig.',
      en: 'The fact: {n:84} of the {n:120} late orders, {n:70} percent, came from materials. Your view: a bonus may not move it.' },
    { nl: 'Je verzoek: eerst het materiaal, volgende maand de bonus. Blijft hij erbij, vraag om een kwartier na afloop.',
      en: 'Your request: materials first, the bonus next month. If he holds his view, ask for fifteen minutes afterwards.' },
  ],
  [ // s9 knowing when to stop
    { nl: 'Zeg het één keer duidelijk; een tweede keer alleen met nieuwe informatie.',
      en: 'Say it clearly once, and a second time only with new information.' },
    { nl: 'Gaat het niet over veiligheid of integriteit: {t:Disagree and commit|disagree and commit}. Voer het volledig uit, en noteer je advies.',
      en: 'If it isn\'t about safety or integrity: {t:Disagree and commit|disagree and commit}. Carry it out fully, and note your advice.' },
    { nl: 'Gaat het wel daarover, dan het {t:Escalatiepad|escalatiepad}: open naar het niveau erboven, en eerst tegen hem zelf.',
      en: 'If it is, take the {t:Escalation path|escalation path}: openly to the next level up, telling the person first.' },
    { nl: 'Valkuilen: te zacht hinten, in het openbaar winnen en de persoon kwijtraken, of achter zijn rug naar zijn baas.',
      en: 'Failure modes: hinting too softly, winning in public and losing the person, or going behind their back.' },
    { nl: 'Disagree and commit komt van Intel, bekend door Jeff Bezos van Amazon. Het werkt alleen als het bezwaar echt gehoord is.',
      en: 'Disagree and commit came from Intel, made known by Jeff Bezos of Amazon. It only works if the disagreement was truly heard.' },
    { nl: 'Een scherpe vraag: wat zou je moeten zien om van gedachten te veranderen?',
      en: 'A sharp question: what would you need to see to change your mind?' },
  ],
];
// Each scene's length from its share of the Dutch narration, never shorter than
// its captions need; the whole about as long as the narration plus a short look
// per scene, within the 300 s cap (as pm.run.scope and pm.plan.wbs).
{
  const plainSay = (src) => src.replace(/\{t:[^|}]*\|([^}]*)\}/g, '$1').replace(/\{n:([^}]*)\}/g, '$1');
  const said = SAY.map((s) => s.reduce((a, l) => a + wordsOf(plainSay(l.nl)), 0));
  const all = said.reduce((a, b) => a + b, 0);
  const TOTAL = Math.min(298, Math.ceil(all / 2.5) + 2 * SAY.length);
  spec.scenes.forEach((s, si) => {
    const cap = Math.max(...['nl', 'en'].map((lang) => minSceneDur(wordsOf(s.beats.map((b) => plainSay(b[lang])).join(' ')) + 4)));
    s.dur = Math.max(Math.ceil(cap), Math.floor((said[si] / all) * TOTAL));
    DURS[si] = s.dur;
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
// no symbol the voice would read aloud, no spoken parenthesis or quote, and no
// word espeak-ng misreads in the Dutch narration (see above)
for (const scene of SAY) for (const line of scene) for (const lang of ['nl', 'en']) {
  const plain = line[lang].replace(/\{[tn]:[^}]*\}/g, '');
  if (/[/&×=+()“”"‘%€~]/.test(plain)) throw new Error(`narration: a symbol the voice reads aloud in "${line[lang].slice(0, 50)}"`);
  if (lang === 'nl' && /omstellingsdata|commitment|operationeel|\bHm\b|\bAmy\b/i.test(line.nl)) throw new Error(`narration: a word espeak-ng misreads in "${line.nl.slice(0, 50)}"`);
}

// ---------------------------------------------------------------- page script and styles
const lean = (src) => src.replace(/^[ \t]*\/\/.*\n/gm, '').replace(/^[ \t]+/gm, '');
const preamble = `const C = ${JSON.stringify(C)};\nconst CAM = ${JSON.stringify(CAM)};\nconst W = ${W}, H = ${H};\n`;
const stageScript = kitScript() + '\n' + preamble + lean(readFileSync(join(HERE, 'stage.js'), 'utf8'))
  + '\n;\n' + readFileSync(join(HERE, '../_kit/beatwarp.js'), 'utf8');

// a red number and a muted green per theme; the focus glow stays the player's
const css = PM_CSS + `
.iso{--sc-red:#D9826F;--sc-g:#5FA877}
.iso[data-theme="light"]{--sc-red:#B4533F;--sc-g:#3B7F52}
.pm-panel{fill:var(--anatomy-shade-0);stroke:var(--fp-hair);stroke-width:1;opacity:.97}
.pm-card{fill:var(--anatomy-face);stroke:var(--anatomy-mid);stroke-width:1.4;stroke-linejoin:round}
.pm-hot{fill:color-mix(in srgb,var(--fp-accent) 22%,var(--anatomy-face));stroke:var(--fp-accent);stroke-width:2}
.pm-dash{fill:none;stroke:var(--anatomy-mid);stroke-width:1.6;stroke-dasharray:5 4}
.pm-txt{fill:var(--anatomy-text);font-family:var(--fp-sans);font-weight:600}
.pm-mute{fill:var(--anatomy-muted);font-family:var(--fp-sans);font-weight:500}
.pm-big{fill:var(--anatomy-strong);font-family:var(--fp-sans);font-weight:700}
.pm-on{fill:var(--fp-accent-text);font-family:var(--fp-sans);font-weight:700}
.pm-inv{fill:var(--anatomy-card);font-family:var(--fp-sans);font-weight:700}
.pm-axis{fill:none;stroke:var(--anatomy-lo);stroke-width:1}
.pm-line{fill:none;stroke:var(--anatomy-hi);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.pm-strike{fill:none;stroke:var(--anatomy-hi);stroke-width:2.4;stroke-linecap:round}
.pm-bar{fill:var(--anatomy-hi)}
.pm-dot{fill:var(--anatomy-mid)}
.sc-red{fill:var(--sc-red)}
.sc-g{fill:var(--sc-g)}
[data-cue][data-on] .pm-card,[data-cue][data-on] .pm-dash{stroke:var(--fp-accent);stroke-width:2}
[data-cue][data-on] .pm-line{stroke:var(--fp-accent)}
[data-cue][data-on] .pm-txt,[data-cue][data-on] .pm-mute,[data-cue][data-on] .pm-big{fill:var(--fp-focus-text)}
/* dark theme: faces and hands in a light skin tone, not dark silhouettes (as pm.run.scope) */
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) [data-cue="jij"]:not([data-on])>.iso-solid:nth-last-child(4)>:is(.iso-fill,.iso-top,.iso-shade){fill:#C9B8A3}
.iso:not([data-theme="light"]) :is([data-cue="jij"],[data-cue="sponsor"],[data-cue="teamlead"],[data-cue="planner"]):not([data-on])>:is(.iso-solid:last-child,.iso-solid:nth-last-child(3))>.iso-shade{fill:#A8957F}
.iso:not([data-theme="light"]) [data-cue="sponsor"]:not([data-on])>.iso-solid:nth-last-child(2)>:is(.iso-fill,.iso-top,.iso-shade){fill:#8E9A97}
.pm-mini .pm-txt,.pm-mini .pm-mute,.pm-mini .pm-big,.pm-mini .pm-on,.pm-mini .pm-inv{display:none}
.pm-mini *{vector-effect:non-scaling-stroke}
.pm-mini .pm-card,.pm-mini .pm-hot,.pm-mini .pm-line,.pm-mini .pm-strike{stroke-width:.7px}
.pm-mini .pm-axis,.pm-mini .pm-dash{stroke-width:.4px}
`;

const label = {
  nl: 'Een vergaderruimte. Aan de achterwand een whiteboard en een klok. Jij, de adviseur in petrol, staat bij het bord. De teamleider staat aan het linkereind van de tafel, de sponsor in pak met stropdas aan het rechtereind, de planner met een tablet aan de voorkant. Op tafel een laptop en een vel waarop de afspraken verschijnen. Rechts een paneel met per scène een kaart: drie blokken S, B en I en een vraag; een zin over gedrag en een doorgestreept etiket; een doorgestreepte sandwich van twee complimenten om kritiek; timing en concreet compliment; feedback naar boven en zelf ontvangen; de drie stappen met de sponsor; feiten, oorzaak en afspraak met de weekcijfers van Mark, 84, 86, 83 en 70 procent tegen een doel van 85; eenmalig of patroon, 5 door de storm en 7 door materiaal; feit, visie en verzoek; 84 van de 120 te late orders door materiaal; en disagree and commit naast het escalatiepad.',
  en: 'A meeting room. On the back wall a whiteboard and a clock. You, the consultant in petrol, stand at the board. The team lead stands at the left end of the table, the sponsor in a suit and tie at the right end, the planner with a tablet at the front. On the table a laptop and a sheet where the agreements appear. At the right a panel with one card per scene: three blocks S, B and I and a question; a sentence about behaviour and a crossed-out label; a crossed-out sandwich of two compliments around criticism; timing and specific praise; upward feedback and receiving it; the three steps with the sponsor; facts, cause and commitment with Mark\'s weekly numbers, 84, 86, 83 and 70 percent against a target of 85; one-off or pattern, 5 from the storm and 7 from materials; fact, view and request; 84 of the 120 late orders due to materials; and disagree and commit next to the escalation path.',
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

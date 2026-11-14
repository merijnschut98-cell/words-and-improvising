// v17: the kit's module intro film. A lesson film serves lessons and is held to
// their text; an intro film is defined by a module id, and its source text is
// the module's title, blurb, topic titles and all of its lesson texts. Its
// terms and numbers must come from that text, and its coverage rule is the map:
// every topic of the module is named (its title in a caption or on a card, in
// both languages) and shown (a beat of its scene lights the topic's part).
// These tests run the kit on a small made-up module; tests/filmcontent.test.js
// rechecks the shipped intro pages against the real module text.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveFilm } from '../films/_kit/build-film.mjs';
import { checkFilm, checkNarration, checkLabels, moduleTextOf, textUnits, wrapUnits, CHAR_W, TILE_UNITS, STATION_UNITS, STATION_LINES } from '../films/_kit/assert.mjs';
import { MODULES as INDEX_MODULES, FIELDS as INDEX_FIELDS } from '../src/content/courses/index.js';

const lesson = (id, terms, teach) => ({ id, title: 'T', pre: [], recall: [], teach, example: { text: '' }, terms: terms.map((term) => ({ term, def: 'D.' })) });
const LESSONS = {
  nl: new Map([
    ['pm.fx.a', lesson('pm.fx.a', ['Werkpakket', 'Mijlpaal'], ['Een werkpakket duurt 8 tot 80 uur.'])],
    ['pm.fx.b', lesson('pm.fx.b', ['Buffer'], ['Een buffer van 3 weken.'])],
    ['pm.other.c', lesson('pm.other.c', ['Sprint'], ['Een sprint van 14 dagen.'])],
  ]),
  en: new Map([
    ['pm.fx.a', lesson('pm.fx.a', ['Work package', 'Milestone'], ['A work package takes 8 to 80 hours.'])],
    ['pm.fx.b', lesson('pm.fx.b', ['Buffer'], ['A buffer of 3 weeks.'])],
    ['pm.other.c', lesson('pm.other.c', ['Sprint'], ['A sprint of 14 days.'])],
  ]),
};
const MOD = {
  id: 'pm.fx', subject: 'pm', track: 'project', level: 1, intro: 'pm.fx.intro',
  title: { nl: 'Plannen', en: 'Plan' }, blurb: { nl: 'Van doel naar plan in 2 stappen.', en: 'From goal to plan in 2 steps.' },
  topics: [
    { id: 'split', title: { nl: 'Opdelen', en: 'Breaking down' }, levels: ['pm.fx.a'] },
    { id: 'time', title: { nl: 'Tijd en buffers', en: 'Time and buffers' }, levels: ['pm.fx.b'] },
  ],
  lessons: ['pm.fx.a', 'pm.fx.b'],
};
const MODULES = [MOD, { id: 'pm.other', lessons: ['pm.other.c'], topics: [] }];
const beat = (nl, en, focus, extra = {}) => ({ nl, en, focus, ...extra });
const spec = () => ({
  id: 'pm.fx.intro',
  title: { nl: 'Een plan', en: 'A plan' },
  module: 'pm.fx',
  topics: { split: { scene: 's2', cue: 'tSplit' }, time: { scene: 's3', cue: 'tTime' } },
  strictFocus: true,
  scenes: [
    { id: 's1', level: 1, dur: 20, still: 0.9, title: { nl: 'Doel', en: 'Goal' }, beats: [beat('Eén lijn gaat verhuizen.', 'One line is moving.', 'goal')] },
    { id: 's2', level: 1, dur: 20, still: 0.9, title: { nl: 'Opdelen', en: 'Breaking down' }, beats: [
      beat('Onderwerp één, Opdelen.', 'Topic one, Breaking down.', 'tSplit'),
      beat('Elk {t:Werkpakket|werkpakket} krijgt een eigenaar.', 'Each {t:Work package|work package} gets an owner.', 'pkg', { cue: { Werkpakket: 'pkg' } }),
    ] },
    { id: 's3', level: 1, dur: 20, still: 0.9, title: { nl: 'Tijd', en: 'Time' }, beats: [
      beat('Onderwerp twee, Tijd en buffers.', 'Topic two, Time and buffers.', 'tTime'),
      beat('Eén {t:Buffer|buffer} van {n:3} weken.', 'One {t:Buffer|buffer} of {n:3} weeks.', 'buf', { cue: { Buffer: 'buf' } }),
    ] },
    { id: 's4', level: 1, dur: 20, still: 0.9, title: { nl: 'De kaart', en: 'The map' }, beats: [beat('De kaart, in {n:2} stappen.', 'The map, in {n:2} steps.', ['tSplit', 'tTime'])] },
  ],
});
const ctx = (extra = {}) => ({ lessons: LESSONS, levelOf: () => 1, wiredBy: [], module: MOD, stageText: '<svg></svg>', ...extra });
const clone = (x) => JSON.parse(JSON.stringify(x));

test('moduleTextOf: the module title, blurb, topic titles and all lesson texts, per language', () => {
  const nl = moduleTextOf(MOD, LESSONS, 'nl');
  for (const s of ['Plannen', 'Van doel naar plan', 'Opdelen', 'Tijd en buffers', '8 tot 80 uur', 'buffer van 3 weken']) assert.ok(nl.includes(s), s);
  assert.ok(!nl.includes('sprint'), 'no text of another module');
  assert.ok(moduleTextOf(MOD, LESSONS, 'en').includes('Time and buffers'));
});

test('resolveFilm: an intro film is defined by its module and serves all of its lessons', () => {
  const data = resolveFilm(spec(), LESSONS, MODULES);
  assert.equal(data.module, 'pm.fx');
  assert.deepEqual(data.lessons, ['pm.fx.a', 'pm.fx.b']);
  assert.deepEqual(data.topics, [
    { id: 'split', title: { nl: 'Opdelen', en: 'Breaking down' }, scene: 's2', cue: 'tSplit' },
    { id: 'time', title: { nl: 'Tijd en buffers', en: 'Time and buffers' }, scene: 's3', cue: 'tTime' },
  ]);
  assert.deepEqual(data.scenes[1].terms.map((t) => [t.lesson, t.nl, t.en]), [['pm.fx.a', 'Werkpakket', 'Work package']]);
  // a number from a lesson names that lesson; one only in the module's own text names the module
  assert.deepEqual(data.numbers.map((n) => [n.value, n.lesson]), [['3', 'pm.fx.b'], ['2', 'pm.fx']]);
});

test('resolveFilm: a lesson film has no module or topics in its data', () => {
  const s = spec();
  delete s.module;
  delete s.topics;
  s.lessons = ['pm.fx.a', 'pm.fx.b'];
  s.scenes[3].beats[0] = beat('De kaart.', 'The map.', ['tSplit', 'tTime']);
  const data = resolveFilm(s, LESSONS, MODULES);
  assert.ok(!('module' in data) && !('topics' in data));
});

test('resolveFilm: an intro film refuses lessons, unknown modules and topics, and text from outside its module', () => {
  const both = { ...spec(), lessons: ['pm.fx.a'] };
  assert.throws(() => resolveFilm(both, LESSONS, MODULES), /module or lessons, not both/);
  assert.throws(() => resolveFilm({ ...spec(), module: 'pm.nope' }, LESSONS, MODULES), /unknown module pm\.nope/);
  const missing = spec();
  delete missing.topics.time;
  assert.throws(() => resolveFilm(missing, LESSONS, MODULES), /topic time of pm\.fx has no scene/);
  const extra = spec();
  extra.topics.nope = { scene: 's2', cue: 'x' };
  assert.throws(() => resolveFilm(extra, LESSONS, MODULES), /topic nope is no topic of pm\.fx/);
  const badScene = spec();
  badScene.topics.time.scene = 's9';
  assert.throws(() => resolveFilm(badScene, LESSONS, MODULES), /topic time: no scene s9/);
  const outside = spec();
  outside.scenes[0].beats[0] = beat('Een {t:Sprint|sprint}.', 'A {t:Sprint|sprint}.', 'x', { cue: { Sprint: 'x' } });
  assert.throws(() => resolveFilm(outside, LESSONS, MODULES), /term "Sprint" \(nl\) is in none of the served lessons/);
  const num = spec();
  num.scenes[0].beats[0] = beat('Na {n:14} dagen.', 'After {n:14} days.', 'goal');
  assert.throws(() => resolveFilm(num, LESSONS, MODULES), /number 14 is in none of the served Dutch lessons/);
});

test('checkFilm: an intro film passes on the map, not on per-term coverage', () => {
  const data = resolveFilm(spec(), LESSONS, MODULES);
  // Mijlpaal (pm.fx.a) is in no scene: an intro film need not show every term of its lessons
  assert.deepEqual(checkFilm(data, ctx()), []);
});

test('checkFilm: each topic is named in a caption of its OWN scene, in both languages', () => {
  const data = resolveFilm(spec(), LESSONS, MODULES);
  const noName = clone(data);
  for (const lang of ['nl', 'en']) { noName.scenes[2].beats[0].text[lang] = lang === 'nl' ? 'Onderwerp twee.' : 'Topic two.'; noName.scenes[2].beats[0].seg[lang] = [noName.scenes[2].beats[0].text[lang]]; }
  const out = checkFilm(noName, ctx()).join('\n');
  assert.match(out, /topic time: "Tijd en buffers" \(nl\) is in no caption of its scene s3/);
  assert.match(out, /topic time: "Time and buffers" \(en\) is in no caption of its scene s3/);
  // a card on the stage no longer counts: the stage draws titles from page data at runtime
  assert.match(checkFilm(noName, ctx({ stageText: "tr('Tijd en buffers', 'Time and buffers')" })).join('\n'), /"Tijd en buffers" \(nl\) is in no caption of its scene s3/);
  // a caption of ANOTHER scene does not count either (the closing map names every topic)
  const elsewhere = clone(noName);
  elsewhere.scenes[3].beats[0].text.nl = 'De kaart: Tijd en buffers.';
  elsewhere.scenes[3].beats[0].seg.nl = [elsewhere.scenes[3].beats[0].text.nl];
  assert.match(checkFilm(elsewhere, ctx()).join('\n'), /"Tijd en buffers" \(nl\) is in no caption of its scene s3/);
  // one language alone is not enough
  const onlyNl = clone(data);
  onlyNl.scenes[2].beats[0].text.en = 'Topic two.';
  onlyNl.scenes[2].beats[0].seg.en = ['Topic two.'];
  assert.match(checkFilm(onlyNl, ctx()).join('\n'), /"Time and buffers" \(en\)/);
});

test('checkFilm: each topic has at least two beats in its scene', () => {
  const data = resolveFilm(spec(), LESSONS, MODULES);
  const thin = clone(data);
  thin.scenes[2].beats.pop();
  assert.match(checkFilm(thin, ctx()).join('\n'), /topic time: scene s3 has 1 beat, needs at least 2/);
  assert.deepEqual(checkFilm(data, ctx()), []);
});

test('checkFilm: each topic is shown, a beat of its scene lights its part', () => {
  const data = resolveFilm(spec(), LESSONS, MODULES);
  const dark = clone(data);
  dark.scenes[2].beats[0].focus = ['buf'];
  dark.scenes[2].beats[0].cues = ['buf'];
  assert.match(checkFilm(dark, ctx()).join('\n'), /topic time: no beat of scene s3 lights its part tTime/);
});

test('checkFilm: an intro film drifts with its module', () => {
  const data = resolveFilm(spec(), LESSONS, MODULES);
  // a topic renamed in the index
  const renamed = clone(MOD);
  renamed.topics[1].title.en = 'Time and reserves';
  assert.match(checkFilm(data, ctx({ module: renamed })).join('\n'), /topic time: title "Time and buffers" \(en\) is now "Time and reserves"/);
  // a topic added to the module
  const grown = clone(MOD);
  grown.topics.push({ id: 'risk', title: { nl: 'Risico', en: 'Risk' }, levels: [] });
  assert.match(checkFilm(data, ctx({ module: grown })).join('\n'), /topic risk of pm\.fx is not on the film's map/);
  // a lesson taken out of the module
  const shrunk = clone(MOD);
  shrunk.lessons = ['pm.fx.a'];
  assert.match(checkFilm(data, ctx({ module: shrunk })).join('\n'), /served lesson pm\.fx\.b is no longer in module pm\.fx/);
  // a number gone from all of the module's text (the 3 of pm.fx.b)
  const gone = { nl: new Map(LESSONS.nl), en: LESSONS.en };
  gone.nl.set('pm.fx.b', { ...LESSONS.nl.get('pm.fx.b'), teach: ['Een buffer van drie weken.'] });
  assert.match(checkFilm(data, ctx({ lessons: gone })).join('\n'), /number 3 \(scene s3\) no longer in the text of module pm\.fx/);
  // the module's own text counts: the 2 of the blurb
  const blurb = clone(MOD);
  blurb.blurb.nl = 'Van doel naar plan.';
  assert.match(checkFilm(data, ctx({ module: blurb })).join('\n'), /number 2 \(scene s4\) no longer in the text of module pm\.fx/);
  // without its module the check cannot run
  assert.match(checkFilm(data, ctx({ module: undefined })).join('\n'), /intro film of pm\.fx: module pm\.fx not given/);
});

// ---------------------------------------------------------------- the narration guard (kit, every module and field film)
const said = (nl, en) => ({ nl: [nl], en: [en] });
const narrated = (edit = {}) => {
  const data = resolveFilm(spec(), LESSONS, MODULES);
  const out = clone(data);
  out.scenes.forEach((s, si) => s.beats.forEach((b, bi) => {
    const spoken = (seg) => seg.map((p) => (typeof p === 'string' ? p : p.t)).join('');
    const nl = spoken(b.seg.nl);
    const en = spoken(b.seg.en);
    b.say = said(nl, en);
    b.voice = { nl, en };
    if (edit[`${si}.${bi}`]) { b.say = said(...edit[`${si}.${bi}`]); b.voice = { nl: edit[`${si}.${bi}`][0], en: edit[`${si}.${bi}`][1] }; }
  }));
  return out;
};

test('checkNarration: a plain narration passes', () => {
  assert.deepEqual(checkNarration(narrated()), []);
});

test('checkNarration: no symbol the voice reads aloud, no colon, in either language', () => {
  for (const bad of ['Dat kost 5 + 3 uur.', 'Zo: eerst dit.', 'Het (bijna) klaar.', 'Of dit/dat.', 'Honderd%.', 'A & B.']) {
    assert.match(checkNarration(narrated({ '0.0': [bad, 'Fine.'] })).join('\n'), /a symbol the voice reads aloud, or a colon/, bad);
    assert.match(checkNarration(narrated({ '0.0': ['Goed.', bad] })).join('\n'), /a symbol the voice reads aloud, or a colon/, bad);
  }
});

test('checkNarration: at most two commas in a sentence', () => {
  assert.deepEqual(checkNarration(narrated({ '0.0': ['Een, twee, drie. Vier, vijf.', 'One, two, three.'] })), []);
  assert.match(checkNarration(narrated({ '0.0': ['Een, twee, drie, vier.', 'Fine.'] })).join('\n'), /more than two commas in "Een, twee, drie, vier\.?"/);
});

test('checkNarration: the words the Dutch voice misreads', () => {
  for (const w of ['deliverable', 'definition of done', 'PMI', 'Deadline']) {
    assert.match(checkNarration(narrated({ '0.0': [`Het ${w} komt.`, 'Fine.'] })).join('\n'), /a word the Dutch voice misreads/, w);
  }
  // the English narration may say them
  assert.deepEqual(checkNarration(narrated({ '0.0': ['Goed.', 'The deliverable and the deadline.'] })), []);
});

test('checkFilm: an intro film is held to the narration guard', () => {
  assert.match(checkFilm(narrated({ '0.0': ['Zo: dit.', 'Fine.'] }), ctx()).join('\n'), /a symbol the voice reads aloud, or a colon/);
});

// ---------------------------------------------------------------- drawn labels fit (22-unit text)
// Widths are measured per character in the film font (Inter at 22 units, the
// wider of weights 600 and 700, Chromium); a flat 10.5 units a character, the
// first rule, let "Schedule and" (146 units measured) through a 128-unit tile.
test('textUnits and wrapUnits: measured widths, never under the real text', () => {
  // measured in the film page: Schedule and 146.3, and critical 119.4, Werkkennis 127.9, Advanced 109.3, meest waarschijnlijk 220.1
  for (const [s, real] of [['Schedule and', 146.3], ['and critical', 119.4], ['Werkkennis', 127.9], ['Advanced', 109.3], ['meest waarschijnlijk', 220.1]]) {
    const est = textUnits(s);
    assert.ok(est >= real && est <= real * 1.1, `${s}: ${est} against ${real}`);
  }
  assert.deepEqual(wrapUnits('Schedule and critical path', TILE_UNITS, CHAR_W), ['Schedule', 'and critical', 'path']);
  assert.deepEqual(wrapUnits('Opdeling en scope', TILE_UNITS, CHAR_W), ['Opdeling', 'en scope']);
  // wrapUnits is self-contained, so a stage script can carry it as source text
  assert.deepEqual(new Function(`return ${wrapUnits.toString()}`)()('Schedule and critical path', TILE_UNITS, CHAR_W), ['Schedule', 'and critical', 'path']);
});

test('checkLabels: a topic title wraps by width into at most 3 lines inside a tile', () => {
  const data = resolveFilm(spec(), LESSONS, MODULES);
  assert.deepEqual(checkLabels(data, ''), []);
  const wide = clone(data);
  wide.topics[0].title.nl = 'Onderhandelingstechnieken';
  assert.match(checkLabels(wide, '').join('\n'), /topic split: "Onderhandelingstechnieken" \(nl\) has a word of \d+ units, a tile is 128/);
  const tall = clone(data);
  tall.topics[1].title.en = 'One two three four five six seven';
  assert.match(checkLabels(tall, '').join('\n'), /topic time: "One two three four five six seven" \(en\) wraps to 4 lines in a tile of 128 units, a tile holds 3/);
});

test('checkLabels: every tr(nl, en) label of the stage fits its box at 22 units, by measured width', () => {
  const data = resolveFilm(spec(), LESSONS, MODULES);
  assert.deepEqual(checkLabels(data, "tr('Lijn 4: buiten scope', 'Line 4: out of scope')"), []);
  assert.match(checkLabels(data, "tr('Een veel te lange tekst voor het paneel', 'Short')").join('\n'), /label "Een veel te lange tekst voor het paneel" \(nl\) is \d+ units wide, the panel is 284/);
  assert.match(checkLabels(data, "tr('Short', 'Een veel te lange tekst voor het paneel')").join('\n'), /\(en\) is \d+ units wide/);
  // a narrower box names its width as a third argument
  assert.match(checkLabels(data, "tr('Vloer klaar', 'Floor ready', 100)").join('\n'), /label "Vloer klaar" \(nl\) is 1\d\d units wide, its box is 100/);
  assert.deepEqual(checkLabels(data, "tr('Vloer klaar', 'Floor ready', 160)"), []);
});

test('checkFilm: an intro film is held to its drawn labels', () => {
  const data = resolveFilm(spec(), LESSONS, MODULES);
  assert.match(checkFilm(data, ctx({ stageText: "tr('Een veel te lange tekst voor het paneel', 'Short')" })).join('\n'), /units wide, the panel is 284/);
});

// ---------------------------------------------------------------- review of the pilot (14 Nov): gaps a copy would inherit
test('checkNarration: the misread Dutch words in the plural too', () => {
  for (const w of ['deliverables', 'deadlines', 'definitions of done']) {
    assert.match(checkNarration(narrated({ '0.0': [`De ${w} komen.`, 'Fine.'] })).join('\n'), /a word the Dutch voice misreads/, w);
  }
});

test('checkLabels: a tr() label in double quotes or backticks is not measured, so it is an error', () => {
  const data = resolveFilm(spec(), LESSONS, MODULES);
  for (const src of ['tr("Een veel te lange tekst voor het paneel", "Short")', 'tr(`Lang`, `Long`)', "tr('Kort', \"Short\")"]) {
    assert.match(checkLabels(data, src).join('\n'), /write it as tr\('nl', 'en'\)/, src);
  }
  // the stage's own definition and a title from the page data are no literal labels
  assert.deepEqual(checkLabels(data, 'const tr = (nl, en) => (NL ? nl : en); tr(t.title.nl, t.title.en);'), []);
});

test('checkFilm: a field film is held to its drawn labels as well', () => {
  const field = clone(narrated());
  delete field.module;
  delete field.topics;
  field.field = 'pm.field.fx';
  field.lessons = [];
  assert.match(checkFilm(field, ctx({ module: undefined, stageText: "tr('Een veel te lange tekst voor het paneel', 'Short')" })).join('\n'), /units wide, the panel is 284/);
});

// ---------------------------------------------------------------- field films (v17, Task 4)
// A field film is defined by a field of the index (FIELDS): its source text is
// the field's title and blurb plus the title, blurb, topic titles and lessons of
// each of its modules. Its coverage rule is the road: every module of the field
// is a station, named in a caption of its OWN scene in both languages, in the
// order of the road, explained in at least two beats and lit; and the film ends
// on the shared map with exactly the field's places lit.
const FY = {
  id: 'pm.fy', subject: 'pm', track: 'project', level: 2,
  title: { nl: 'Uitvoeren', en: 'Run' }, blurb: { nl: 'Het project in beweging houden.', en: 'Keep the project moving.' },
  topics: [{ id: 'steer', title: { nl: 'Sturen', en: 'Steering' }, levels: ['pm.fy.a'] }],
  lessons: ['pm.fy.a'],
};
const FLESSONS = {
  nl: new Map([...LESSONS.nl, ['pm.fy.a', lesson('pm.fy.a', ['Stuurgroep'], ['Een stuurgroep komt elke 4 weken samen.'])]]),
  en: new Map([...LESSONS.en, ['pm.fy.a', lesson('pm.fy.a', ['Steering committee'], ['A steering committee meets every 4 weeks.'])]]),
};
const FIELD = {
  id: 'pm.field.fx', subject: 'pm', film: 'pm.field.fx',
  title: { nl: 'Van begin tot eind', en: 'Start to finish' }, blurb: { nl: 'Plannen en uitvoeren, de weg in 5 stappen.', en: 'Plan and run, the road in 5 steps.' },
  modules: ['pm.fx', 'pm.fy'],
};
const FMODULES = [MOD, FY, { id: 'pm.other', lessons: ['pm.other.c'], topics: [] }];
const FIELDS_FX = [FIELD];
const LIT = '<g class="map-place is-lit" data-module="pm.fx" data-cue="map-fx"></g><g class="map-place is-lit" data-module="pm.fy" data-cue="map-fy"></g>';
const fspec = () => ({
  id: 'pm.field.fx',
  title: { nl: 'De weg', en: 'The road' },
  field: 'pm.field.fx',
  stations: { 'pm.fx': { scene: 's2', cue: 'stFx' }, 'pm.fy': { scene: 's3', cue: 'stFy' } },
  strictFocus: true,
  scenes: [
    { id: 's1', level: 1, dur: 20, still: 0.9, title: { nl: 'De weg', en: 'The road' }, beats: [beat('Elk project loopt een weg, in {n:5} stappen.', 'Every project walks a road, in {n:5} steps.', 'road')] },
    { id: 's2', level: 1, dur: 20, still: 0.9, title: { nl: 'Plannen', en: 'Plan' }, beats: [
      beat('Het eerste station is Plannen.', 'The first station is Plan.', 'stFx'),
      beat('Elk {t:Werkpakket|werkpakket} krijgt een eigenaar.', 'Each {t:Work package|work package} gets an owner.', 'pkg', { cue: { Werkpakket: 'pkg' } }),
    ] },
    { id: 's3', level: 1, dur: 20, still: 0.9, title: { nl: 'Uitvoeren', en: 'Run' }, beats: [
      beat('Het tweede station is Uitvoeren.', 'The second station is Run.', 'stFy'),
      beat('De {t:Stuurgroep|stuurgroep} komt elke {n:4} weken.', 'The {t:Steering committee|steering committee} meets every {n:4} weeks.', 'steer', { cue: { Stuurgroep: 'steer' } }),
    ] },
    { id: 's4', level: 1, dur: 20, still: 0.9, title: { nl: 'De kaart', en: 'The map' }, beats: [
      beat('De kaart, met beide stations.', 'The map, with both stations.', ['map-fx', 'map-fy']),
      beat('Begin bij het eerste.', 'Start with the first.', 'map-fx'),
    ] },
  ],
});
const fctx = (extra = {}) => ({ lessons: FLESSONS, levelOf: () => 1, wiredBy: [], field: FIELD, modules: FMODULES, stageText: LIT, ...extra });
const fresolve = (s = fspec()) => resolveFilm(s, FLESSONS, FMODULES, FIELDS_FX);
const caption = (data, si, bi, lang, text) => { data.scenes[si].beats[bi].text[lang] = text; data.scenes[si].beats[bi].seg[lang] = [text]; };

test('resolveFilm: a field film is defined by its field and serves all lessons of its modules', () => {
  const data = fresolve();
  assert.equal(data.field, 'pm.field.fx');
  assert.ok(!('module' in data) && !('topics' in data));
  assert.deepEqual(data.lessons, ['pm.fx.a', 'pm.fx.b', 'pm.fy.a']);
  assert.deepEqual(data.stations, [
    { id: 'pm.fx', title: { nl: 'Plannen', en: 'Plan' }, scene: 's2', cue: 'stFx' },
    { id: 'pm.fy', title: { nl: 'Uitvoeren', en: 'Run' }, scene: 's3', cue: 'stFy' },
  ]);
  assert.deepEqual(data.scenes[2].terms.map((t) => [t.lesson, t.nl, t.en]), [['pm.fy.a', 'Stuurgroep', 'Steering committee']]);
  // a number from a lesson names that lesson; one only in the field's own text names the field
  assert.deepEqual(data.numbers.map((n) => [n.value, n.lesson]), [['5', 'pm.field.fx'], ['4', 'pm.fy.a']]);
});

test('resolveFilm: a field film refuses a module or lessons as well, an unknown field, another id, and a road that is not its field', () => {
  assert.throws(() => fresolve({ ...fspec(), module: 'pm.fx' }), /a field, a module or lessons, not more than one/);
  assert.throws(() => fresolve({ ...fspec(), lessons: ['pm.fx.a'] }), /a field, a module or lessons, not more than one/);
  assert.throws(() => fresolve({ ...fspec(), field: 'pm.field.nope', id: 'pm.field.nope' }), /unknown field pm\.field\.nope/);
  assert.throws(() => fresolve({ ...fspec(), id: 'pm.field.other' }), /a field film's id is its field id/);
  const missing = fspec();
  delete missing.stations['pm.fy'];
  assert.throws(() => fresolve(missing), /module pm\.fy of pm\.field\.fx has no scene and cue in the film's stations/);
  const extra = fspec();
  extra.stations['pm.other'] = { scene: 's2', cue: 'x' };
  assert.throws(() => fresolve(extra), /station pm\.other is no module of pm\.field\.fx/);
  const badScene = fspec();
  badScene.stations['pm.fy'].scene = 's9';
  assert.throws(() => fresolve(badScene), /station pm\.fy: no scene s9/);
  const outside = fspec();
  outside.scenes[0].beats[0] = beat('Een {t:Sprint|sprint}.', 'A {t:Sprint|sprint}.', 'x', { cue: { Sprint: 'x' } });
  assert.throws(() => fresolve(outside), /term "Sprint" \(nl\) is in none of the served lessons/);
  const num = fspec();
  num.scenes[0].beats[0] = beat('Na {n:14} dagen.', 'After {n:14} days.', 'road');
  assert.throws(() => fresolve(num), /number 14 is in none of the served Dutch lessons nor in the text of field pm\.field\.fx/);
});

test('checkFilm: a field film passes on its road, not on per-term coverage', () => {
  assert.deepEqual(checkFilm(fresolve(), fctx()), []);
});

test('checkFilm: each module of the field is named in a caption of its OWN scene, in both languages', () => {
  const data = fresolve();
  const mute = clone(data);
  caption(mute, 2, 0, 'nl', 'Het tweede station.');
  caption(mute, 2, 0, 'en', 'The second station.');
  const out = checkFilm(mute, fctx()).join('\n');
  assert.match(out, /station pm\.fy: "Uitvoeren" \(nl\) is in no caption of its scene s3/);
  assert.match(out, /station pm\.fy: "Run" \(en\) is in no caption of its scene s3/);
  // the map scene naming it does not count
  const elsewhere = clone(mute);
  caption(elsewhere, 3, 0, 'en', 'The map, with Run.');
  assert.match(checkFilm(elsewhere, fctx()).join('\n'), /"Run" \(en\) is in no caption of its scene s3/);
  // a whole word: "Running" is not "Run"
  const part = clone(data);
  caption(part, 2, 0, 'en', 'The second station is Running.');
  assert.match(checkFilm(part, fctx()).join('\n'), /"Run" \(en\) is in no caption of its scene s3/);
});

test('checkFilm: each station is explained in two beats and lit', () => {
  const thin = clone(fresolve());
  thin.scenes[2].beats.pop();
  assert.match(checkFilm(thin, fctx()).join('\n'), /station pm\.fy: scene s3 has 1 beat, needs at least 2/);
  const dark = clone(fresolve());
  dark.scenes[2].beats[0].focus = ['steer'];
  dark.scenes[2].beats[0].cues = ['steer'];
  assert.match(checkFilm(dark, fctx()).join('\n'), /station pm\.fy: no beat of scene s3 lights its part stFy/);
});

test('checkFilm: the stations follow the order of the road', () => {
  const s = fspec();
  s.stations['pm.fx'].scene = 's3';
  s.stations['pm.fy'].scene = 's2';
  for (const [i, nl, en] of [[1, 'Het eerste station is Uitvoeren.', 'The first station is Run.'], [2, 'Het tweede station is Plannen.', 'The second station is Plan.']]) { s.scenes[i].beats[0].nl = nl; s.scenes[i].beats[0].en = en; }
  s.scenes[1].beats[0].focus = 'stFy';
  s.scenes[2].beats[0].focus = 'stFx';
  assert.match(checkFilm(fresolve(s), fctx()).join('\n'), /station pm\.fy \(scene s2\) comes before pm\.fx \(scene s3\); the stations follow the road/);
});

test('checkFilm: a field film ends on the map with exactly its places lit', () => {
  const data = fresolve();
  // the last scene lights no place of the map
  const dark = clone(data);
  for (const b of dark.scenes[3].beats) { b.focus = ['road']; b.cues = ['road']; }
  assert.match(checkFilm(dark, fctx()).join('\n'), /the last scene lights no map place map-fy/);
  // the drawing does not light a place
  assert.match(checkFilm(data, fctx({ stageText: LIT.split('</g>')[0] })).join('\n'), /the map does not light pm\.fy/);
  // or lights one that is not of the field
  assert.match(checkFilm(data, fctx({ stageText: `${LIT}<g class="map-place is-lit" data-module="pm.other" data-cue="map-other">` })).join('\n'), /the map lights pm\.other, which is no module of pm\.field\.fx/);
});

test('checkFilm: a field film drifts with its field and modules', () => {
  const data = fresolve();
  // a module renamed in the index
  const renamed = clone(FY);
  renamed.title.en = 'Execute';
  assert.match(checkFilm(data, fctx({ modules: [MOD, renamed] })).join('\n'), /station pm\.fy: title "Run" \(en\) is now "Execute"/);
  // a module moved to another field
  const moved = { ...FIELD, modules: ['pm.fx'] };
  assert.match(checkFilm(data, fctx({ field: moved })).join('\n'), /station pm\.fy is no longer a module of pm\.field\.fx/);
  // a module added to the field
  const grown = { ...FIELD, modules: ['pm.fx', 'pm.fy', 'pm.other'] };
  assert.match(checkFilm(data, fctx({ field: grown })).join('\n'), /module pm\.other of pm\.field\.fx is not on the film's road/);
  // a lesson taken out of its module
  const shrunk = { ...FY, lessons: [] };
  assert.match(checkFilm(data, fctx({ modules: [MOD, shrunk] })).join('\n'), /served lesson pm\.fy\.a is no longer in a module of pm\.field\.fx/);
  // a number gone from all of the field's text
  const gone = { nl: new Map(FLESSONS.nl), en: FLESSONS.en };
  gone.nl.set('pm.fy.a', { ...FLESSONS.nl.get('pm.fy.a'), teach: ['Een stuurgroep komt elke maand samen.'] });
  assert.match(checkFilm(data, fctx({ lessons: gone })).join('\n'), /number 4 \(scene s3\) no longer in the text of field pm\.field\.fx/);
  assert.match(checkFilm(data, fctx({ field: { ...FIELD, blurb: { nl: 'De weg.', en: 'The road.' } } })).join('\n'), /number 5 \(scene s1\) no longer in the text of field pm\.field\.fx/);
  // without its field the check cannot run
  assert.match(checkFilm(data, fctx({ field: undefined })).join('\n'), /field film of pm\.field\.fx: field pm\.field\.fx not given/);
});

test('checkFilm: a field film is held to the narration guard and to its station titles fitting the road', () => {
  const data = fresolve();
  const loud = clone(data);
  for (const s of loud.scenes) for (const b of s.beats) { const nl = b.text.nl; const en = b.text.en; b.say = { nl: [nl], en: [en] }; b.voice = { nl, en }; }
  loud.scenes[0].beats[0].say.nl = ['Zo: dit.'];
  assert.match(checkFilm(loud, fctx()).join('\n'), /a symbol the voice reads aloud, or a colon/);
  // a station title wraps into at most two lines of a row of the road
  const two = clone(data);
  two.stations[1].title.en = 'Negotiating and holding your ground';
  assert.deepEqual(checkLabels(two, '').filter((e) => e.startsWith('station')), []);
  const wide = clone(data);
  wide.stations[1].title.nl = 'Onderhandelen en voet bij stuk houden met alle partijen';
  assert.match(checkLabels(wide, '').join('\n'), new RegExp(`station pm\\.fy: "Onderhandelen en voet bij stuk houden met alle partijen" \\(nl\\) wraps to 3 lines, a station on the road holds ${STATION_LINES} lines of ${STATION_UNITS} units`));
  const long = clone(data);
  long.stations[1].title.en = 'Projectportfoliomanagementsystemsrenewal';
  assert.match(checkLabels(long, '').join('\n'), /station pm\.fy: the word "Projectportfoliomanagementsystemsrenewal" \(en\) is \d+ units wide, a station on the road holds 236/);
});

// The next field films (people, portfolio, IT) take their station titles from the
// index; the kit's road must hold every one of them, or those films cannot be built.
test('checkLabels: every module title of every field fits a station of the road', () => {
  for (const f of INDEX_FIELDS) {
    const stations = f.modules.map((id) => { const m = INDEX_MODULES.find((x) => x.id === id); return { id, title: { nl: m.title.nl, en: m.title.en } }; });
    assert.deepEqual(checkLabels({ scenes: [], stations }, ''), [], f.id);
  }
  // the reference film draws a station title with the kit's own wrap
  for (const f of INDEX_FIELDS) for (const id of f.modules) {
    const m = INDEX_MODULES.find((x) => x.id === id);
    for (const lang of ['nl', 'en']) assert.ok(wrapUnits(m.title[lang], STATION_UNITS, CHAR_W).length <= STATION_LINES, `${id} (${lang})`);
  }
});

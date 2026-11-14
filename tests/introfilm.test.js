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
import { checkFilm, moduleTextOf } from '../films/_kit/assert.mjs';

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

test('checkFilm: each topic is named in a caption or on a card, in both languages', () => {
  const data = resolveFilm(spec(), LESSONS, MODULES);
  const noName = clone(data);
  for (const lang of ['nl', 'en']) { noName.scenes[2].beats[0].text[lang] = lang === 'nl' ? 'Onderwerp twee.' : 'Topic two.'; noName.scenes[2].beats[0].seg[lang] = [noName.scenes[2].beats[0].text[lang]]; }
  assert.match(checkFilm(noName, ctx()).join('\n'), /topic time: "Tijd en buffers" \(nl\) is in no caption and on no card/);
  assert.match(checkFilm(noName, ctx()).join('\n'), /topic time: "Time and buffers" \(en\) is in no caption and on no card/);
  // a card on the stage names it as well (any case)
  assert.deepEqual(checkFilm(noName, ctx({ stageText: "tr('Tijd en buffers', 'Time and buffers')" })), []);
  // one language alone is not enough
  assert.match(checkFilm(noName, ctx({ stageText: "tr('Tijd en buffers', 'Time')" })).join('\n'), /"Time and buffers" \(en\)/);
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

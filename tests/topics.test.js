// v10: modules split into topics with four levels (Basis, Werkkennis,
// Gevorderd, Expert). Structure lives on the module meta in the index.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { placeOf, topicsOf, LEVELS } from '../src/content/courses/index.js';
import { checkTopics, validateModule } from '../src/content/courses/validate.js';

const q = (n) => ({ q: `Question ${n}?`, options: ['a', 'b', 'c', 'd'], answer: 'b', why: 'Because b.' });
const lesson = (id, extra = {}) => ({
  id,
  title: 'A title',
  pre: [q(0)],
  teach: ['Block one.', 'Block two.', 'Block three.'],
  example: { kind: 'worked', text: 'A worked example.' },
  said: 'What engineers say.',
  recall: [q(1), q(2), q(3), q(4)],
  situation: { scene: 'A scene.', ask: 'What do you ask?', model: 'A model answer.', rubric: ['one', 'two', 'three'] },
  sayIt: 'Explain it in 60 seconds.',
  terms: [{ term: `Term ${id}`, def: 'A meaning.' }, { term: `Word ${id}`, def: 'Another meaning.' }],
  ...extra,
});
const faded = { kind: 'faded', text: 'Given this.', ask: 'What next?', reveal: 'This.' };
const ids = ['a1', 'a2', 'a3', 'a4', 'b1', 'b2', 'b3', 'b4'].map((s) => `eng.fx.${s}`);
const fxTopics = () => [
  { id: 'a', title: { en: 'Turning', nl: 'Draaien' }, levels: ids.slice(0, 4) },
  { id: 'b', title: { en: 'Milling', nl: 'Frezen' }, levels: ids.slice(4) },
];
const fxMeta = (over = {}) => ({
  id: 'eng.fx', subject: 'eng', track: 'discrete', level: 1, title: { en: 'Fx', nl: 'Fx' }, blurb: { en: 'x', nl: 'x' },
  topics: fxTopics(), lessons: [...ids], questions: Object.fromEntries(ids.map((id) => [id, 4])), ...over,
});
// Levels 3–4 of each topic use a faded example.
const fxLessons = (patch = {}) => ({ lessons: ids.map((id, i) => lesson(id, { ...(i % 4 >= 2 ? { example: faded } : {}), ...(patch[id] || {}) })) });

test('index helpers: LEVELS, topicsOf and placeOf', () => {
  assert.deepEqual(LEVELS, [1, 2, 3, 4]);
  const fx = fxMeta();
  assert.equal(topicsOf(fx), fx.topics);
  assert.equal(topicsOf({ id: 'eng.flow' }), null);
  assert.equal(topicsOf(null), null);
  const p = placeOf('eng.fx.b1', [fx]);
  assert.equal(p.moduleId, 'eng.fx');
  assert.equal(p.topicId, 'b');
  assert.equal(p.level, 1);
  assert.equal(p.topic, fx.topics[1]);
  assert.equal(placeOf('eng.fx.a4', [fx]).level, 4);
  assert.equal(placeOf('eng.flow.takt'), null);
  assert.equal(placeOf('eng.fx.zz', [fx]), null);
  assert.equal(placeOf(undefined, [fx]), null);
});

test('checkTopics: a valid topic module passes, and the whole module validates', () => {
  assert.deepEqual(checkTopics(fxMeta()), []);
  assert.deepEqual(validateModule(fxLessons(), fxLessons(), fxMeta()), []);
});

test('checkTopics: exactly 4 levels per topic', () => {
  const t = fxTopics();
  t[0].levels = t[0].levels.slice(0, 3);
  const errs = checkTopics(fxMeta({ topics: t, lessons: t.flatMap((x) => x.levels) })).join('\n');
  assert.match(errs, /topic a needs exactly 4 levels/);
});

test('checkTopics: a lesson in two topics, a lesson in no topic, a level not in lessons', () => {
  const two = fxTopics();
  two[1].levels = [ids[0], ...ids.slice(5)];
  assert.match(checkTopics(fxMeta({ topics: two })).join('\n'), /eng\.fx\.a1 is in more than one topic/);
  const none = fxTopics();
  none[1].levels = [...ids.slice(5), 'eng.fx.x9'];
  const errs = checkTopics(fxMeta({ topics: none })).join('\n');
  assert.match(errs, /eng\.fx\.b1.*no topic/);
  assert.match(errs, /eng\.fx\.x9.*not in lessons/);
});

test('checkTopics: lessons must follow topic order', () => {
  const lessons = [...ids.slice(4), ...ids.slice(0, 4)];
  assert.match(checkTopics(fxMeta({ lessons })).join('\n'), /order/);
});

test('checkTopics: topic ids and titles', () => {
  const dup = fxTopics();
  dup[1].id = 'a';
  assert.equal(checkTopics(fxMeta({ topics: dup })).filter((e) => /duplicate topic id/.test(e)).length, 1);
  const bad = fxTopics();
  bad[0].id = 'Turning';
  assert.equal(checkTopics(fxMeta({ topics: bad })).filter((e) => /topic id/.test(e)).length, 1);
  const noNl = fxTopics();
  noNl[0].title = { en: 'Turning' };
  assert.equal(checkTopics(fxMeta({ topics: noNl })).filter((e) => /title/.test(e)).length, 1);
  assert.match(checkTopics(fxMeta({ topics: [fxTopics()[0]], lessons: ids.slice(0, 4) })).join('\n'), /2–8 topics/);
});

test('validateModule: example kind follows the level in the topic, not the module level', () => {
  // Level 2 faded in a module whose meta.level is 3: error.
  const m3 = fxMeta({ level: 3 });
  const f2 = fxLessons({ 'eng.fx.a2': { example: faded } });
  assert.match(validateModule(f2, fxLessons(), m3).join('\n'), /en eng\.fx\.a2: faded example only at level 3–4/);
  assert.deepEqual(validateModule(fxLessons(), fxLessons(), m3), [], 'levels 1–2 worked pass even at meta.level 3');
  // Level 3 worked in a module whose meta.level is 1: error.
  const w3 = fxLessons({ 'eng.fx.b3': { example: { kind: 'worked', text: 'Worked.' } } });
  assert.match(validateModule(w3, fxLessons(), fxMeta()).join('\n'), /en eng\.fx\.b3: level 3–4 uses a faded example/);
});

test('validateModule: teach limits stay 3–5 blocks of at most 90 words in topic modules too', () => {
  const long = 'word '.repeat(91).trim();
  assert.match(validateModule(fxLessons({ 'eng.fx.a1': { teach: ['One.', 'Two.', long] } }), fxLessons(), fxMeta()).join('\n'), /eng\.fx\.a1: teach 2 has 91 words/);
  assert.deepEqual(validateModule(fxLessons({ 'eng.fx.a1': { teach: ['1.', '2.', '3.', '4.', '5.'] } }), fxLessons(), fxMeta()), []);
  assert.match(validateModule(fxLessons({ 'eng.fx.a1': { teach: ['1.', '2.', '3.', '4.', '5.', '6.'] } }), fxLessons(), fxMeta()).join('\n'), /3–5 teach blocks/);
});

test('validateModule: a term is defined once per topic module and language', () => {
  const t = (term) => ({ terms: [{ term, def: 'De snelheid van het materiaal langs de snijkant.' }, { term: `Ander ${term}`, def: 'x' }] });
  const nl = fxLessons({ 'eng.fx.a2': t('Snijsnelheid'), 'eng.fx.b3': { terms: [{ term: ' snijsnelheid ', def: 'y' }, { term: 'Voeding', def: 'z' }] } });
  const errs = validateModule(fxLessons(), nl, fxMeta()).join('\n');
  assert.match(errs, /nl.*snijsnelheid.*eng\.fx\.a2.*eng\.fx\.b3/i);
  assert.doesNotMatch(errs, /^en.*snijsnelheid/im);
  // A non-topic module keeps today's behaviour: no duplicate check.
  const plain = { ...fxMeta(), topics: undefined, level: 1, lessons: ['eng.fx.a1', 'eng.fx.a2'], questions: { 'eng.fx.a1': 4, 'eng.fx.a2': 4 } };
  delete plain.topics;
  const dupPlain = { lessons: [lesson('eng.fx.a1', t('Snijsnelheid')), lesson('eng.fx.a2', t('Snijsnelheid'))] };
  assert.deepEqual(validateModule(dupPlain, dupPlain, plain), []);
});

test('validateModule (every module): en and nl terms lists have the same length', () => {
  const plain = { id: 'eng.fx', subject: 'eng', track: 'basics', level: 1, lessons: ['eng.fx.a1'], questions: { 'eng.fx.a1': 4 } };
  const en = { lessons: [lesson('eng.fx.a1')] };
  const nl = { lessons: [lesson('eng.fx.a1', { terms: [...lesson('eng.fx.a1').terms, { term: 'Extra', def: 'x' }] })] };
  assert.match(validateModule(en, nl, plain).join('\n'), /eng\.fx\.a1: terms counts differ between en and nl/);
  assert.match(validateModule(fxLessons(), fxLessons({ 'eng.fx.b2': { terms: nl.lessons[0].terms } }), fxMeta()).join('\n'), /eng\.fx\.b2: terms counts differ/);
});

test('validateModule: a topic module with a broken topic table reports the checkTopics errors', () => {
  const t = fxTopics();
  t[0].levels = t[0].levels.slice(0, 3);
  assert.match(validateModule(fxLessons(), fxLessons(), fxMeta({ topics: t })).join('\n'), /topic a needs exactly 4 levels/);
});

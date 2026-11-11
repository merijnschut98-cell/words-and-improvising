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
  assert.equal(placeOf('eng.flow.takt', [fx]), null, 'a lesson outside the given topic modules');
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

// ---- Task 2: engine ----
import { levelState, levelVisible, topicRows, nextLesson, courseTodayPick, levelsDone, recommendedModule } from '../src/core/course.js';
import { dueCount } from '../src/core/coursereview.js';
import { defaultState } from '../src/core/storage.js';
import { machiningV10 } from './fixtures/v10-machining.js';

const DAY = '2026-11-04';
const at = (st, id, p) => ({ ...st, courses: { ...st.courses, eng: { ...st.courses.eng, lessons: { ...st.courses.eng.lessons, [id]: { ...(st.courses.eng.lessons[id] || {}), ...p } } } } });
const pass = (st, id, ts) => at(st, id, { read: ts, passed: ts });
const box = (st, lang, lessonId, n, b = 4) => ({ ...st, courseReviews: { ...st.courseReviews, ...Object.fromEntries(Array.from({ length: n }, (_, i) => [`${lang}|${lessonId}#r${i}`, { box: b, due: '2026-12-30', lesson: lessonId, subject: 'eng' }])) } });
const I = (s) => `eng.fx.${s}`;

test('nextLesson in a topic module: current topic first, lowest unpassed level, then the next topic', () => {
  const fx = fxMeta();
  let s = defaultState();
  assert.equal(nextLesson(s, fx), I('a1'), 'nothing touched');
  assert.equal(nextLesson(pass(s, I('a1'), 10), fx), I('a2'));
  assert.equal(nextLesson(pass(s, I('a3'), 10), fx), I('a1'), 'he jumped: the lowest skipped level');
  s = pass(pass(pass(defaultState(), I('a1'), 10), I('a2'), 20), I('b1'), 30);
  assert.equal(nextLesson(s, fx), I('b2'), 'the most recent topic');
  s = at(pass(defaultState(), I('a1'), 10), I('b1'), { read: 20 });
  assert.equal(nextLesson(s, fx), I('b1'), 'read but not passed, read later');
  s = ['a1', 'a2', 'a3', 'a4'].reduce((x, id, i) => pass(x, I(id), 10 + i), defaultState());
  assert.equal(nextLesson(s, fx), I('b1'), 'the current topic is complete');
  s = ids.reduce((x, id, i) => pass(x, id, 10 + i), defaultState());
  assert.equal(nextLesson(s, fx), null);
  s = pass(pass(defaultState(), I('b1'), 10), I('a1'), 10);
  assert.equal(nextLesson(s, fx), I('a2'), 'equal timestamps: index order');
});

test('levels are visible one at a time (v16): the first always, the next once the one before is passed; a passed level stays', () => {
  const fx = fxMeta();
  const vis = (st) => topicRows(st, fx, 'nl')[0].levels.map((l) => l.level);
  let s = defaultState();
  assert.deepEqual(vis(s), [1]);
  assert.deepEqual(vis(at(s, I('a1'), { read: 5 })), [1], 'read is not finished');
  s = pass(s, I('a1'), 5);
  assert.deepEqual(vis(s), [1, 2]);
  s = pass(s, I('a2'), 6);
  assert.deepEqual(vis(s), [1, 2, 3]);
  s = pass(s, I('a3'), 7);
  assert.deepEqual(vis(s), [1, 2, 3, 4]);
  // Older progress where he jumped ahead: what he passed stays visible.
  assert.deepEqual(vis(pass(defaultState(), I('a3'), 5)), [1, 3, 4]);
  assert.equal(levelVisible(['x', 'y'], 0, () => false), true);
  assert.equal(levelVisible(['x', 'y'], 1, () => false), false);
  assert.equal(levelVisible(['x', 'y'], 1, (id) => id === 'x'), true);
});

test('levelState: todo, passed, owned (per language)', () => {
  let s = defaultState();
  assert.equal(levelState(s, 'eng', I('a1'), 4, 'nl'), 'todo');
  assert.equal(levelState(at(s, I('a1'), { read: 5 }), 'eng', I('a1'), 4, 'nl'), 'todo', 'read is not passed');
  s = pass(s, I('a1'), 5);
  assert.equal(levelState(box(s, 'nl', I('a1'), 3), 'eng', I('a1'), 4, 'nl'), 'passed');
  assert.equal(levelState(box(s, 'nl', I('a1'), 4), 'eng', I('a1'), 4, 'nl'), 'owned');
  assert.equal(levelState(box(s, 'en', I('a1'), 4), 'eng', I('a1'), 4, 'nl'), 'passed', 'en keys do not count for nl');
  assert.equal(levelState(box(s, 'nl', I('a1'), 4, 3), 'eng', I('a1'), 4, 'nl'), 'passed', 'box 3 is not owned');
});

test('topicRows and levelsDone', () => {
  const fx = fxMeta();
  const s = box(pass(pass(defaultState(), I('a1'), 1), I('a2'), 2), 'nl', I('a2'), 4);
  const rows = topicRows(s, fx, 'nl');
  assert.equal(rows.length, 2);
  assert.deepEqual(rows[0], {
    id: 'a', title: fx.topics[0].title, passed: 2,
    levels: [
      { lessonId: I('a1'), level: 1, state: 'passed' },
      { lessonId: I('a2'), level: 2, state: 'owned' },
      { lessonId: I('a3'), level: 3, state: 'todo' },
    ],
  });
  assert.equal(rows[1].passed, 0);
  assert.deepEqual(rows[1].levels.map((l) => l.lessonId), [I('b1')], 'only the first level of an untouched topic');
  assert.equal(topicRows(s, { id: 'eng.flow', subject: 'eng', lessons: ['eng.flow.takt'], questions: {} }, 'nl'), null);
  assert.deepEqual(levelsDone(s, fx), { done: 2, total: 8 });
});

test('courseTodayPick: a topic lesson pick carries topicId and level; deterministic; non-topic picks unchanged', () => {
  const fx = fxMeta();
  const s = pass(defaultState(), I('a1'), 5);
  const pick = courseTodayPick(s, 'eng', 'nl', DAY, [fx]);
  assert.deepEqual(pick, { reason: 'lesson', moduleId: 'eng.fx', lessonId: I('a2'), topicId: 'a', level: 2 });
  assert.deepEqual(courseTodayPick(s, 'eng', 'nl', DAY, [fx]), pick);
  const plain = { id: 'eng.flow', subject: 'eng', track: 'basics', level: 1, lessons: ['eng.flow.a'], questions: { 'eng.flow.a': 1 } };
  const p2 = courseTodayPick(defaultState(), 'eng', 'nl', DAY, [plain]);
  assert.deepEqual(p2, { reason: 'lesson', moduleId: 'eng.flow', lessonId: 'eng.flow.a' });
  assert.equal('topicId' in p2, false);
  assert.equal(recommendedModule(s, 'eng', [plain, fx]), 'eng.fx', 'a started topic module first');
});

test('courseTodayPick: a prep lesson for an event carries the place too', () => {
  const fx = fxMeta();
  const s = { ...defaultState(), events: [{ id: 'e1', date: '2026-11-05', text: 'Visit', topics: ['eng.fx'] }] };
  const pick = courseTodayPick(s, 'eng', 'nl', DAY, [fx]);
  assert.equal(pick.reason, 'lesson');
  assert.equal(pick.why, 'prepLesson');
  assert.equal(pick.lessonId, I('a1'));
  assert.equal(pick.topicId, 'a');
  assert.equal(pick.level, 1);
});

test('v9 progress under the v10 machining table: same lessons passed or owned, same due count', () => {
  let s = defaultState();
  s = pass(s, 'eng.machining.cutting', 100);
  s = pass(s, 'eng.machining.cnc', 50);
  s = box(s, 'nl', 'eng.machining.cutting', 4);
  s = { ...s, courseReviews: { ...s.courseReviews, 'nl|eng.machining.cnc#r0': { box: 2, due: '2026-11-01', lesson: 'eng.machining.cnc', subject: 'eng' } } };
  const before = dueCount(s.courseReviews, DAY, 'eng', 'nl');
  const m = machiningV10;
  assert.deepEqual(checkTopics(m), []);
  assert.equal(levelState(s, 'eng', 'eng.machining.cutting', m.questions['eng.machining.cutting'], 'nl'), 'owned');
  assert.equal(levelState(s, 'eng', 'eng.machining.cnc', m.questions['eng.machining.cnc'], 'nl'), 'passed');
  assert.equal(dueCount(s.courseReviews, DAY, 'eng', 'nl'), before);
  assert.equal(before, 1);
  const rows = topicRows(s, m, 'nl');
  assert.deepEqual(rows.find((r) => r.id === 'turning').levels.map((l) => l.state), ['todo', 'owned', 'todo'], 'Expert hidden until Gevorderd is passed');
  assert.deepEqual(rows.find((r) => r.id === 'cnc').levels.map((l) => l.state), ['passed', 'todo']);
  assert.equal(nextLesson(s, m), 'eng.machining.processes', 'Draaien is the most recent topic; its lowest open level');
});

// ---- Task 3: level chips ----
import { chipModel } from '../src/ui/coursehome.js';
import { translator, STRINGS } from '../src/i18n.js';

test('chipModel: class, icon and aria label per state; the suggested chip is marked next', () => {
  const nl = translator('nl');
  const en = translator('en');
  const lv = (level, state) => ({ lessonId: `eng.fx.a${level}`, level, state });
  assert.deepEqual(chipModel(nl, 'Draaien', lv(1, 'todo'), false), { cls: 'level-chip s-todo', label: 'Basis', aria: 'Draaien, Basis: nog te doen', icon: null });
  assert.deepEqual(chipModel(nl, 'Draaien', lv(3, 'passed'), false), { cls: 'level-chip s-passed', label: 'Gevorderd', aria: 'Draaien, Gevorderd: behaald', icon: 'circle-check' });
  assert.deepEqual(chipModel(nl, 'Draaien', lv(2, 'owned'), false), { cls: 'level-chip s-owned', label: 'Werkkennis', aria: 'Draaien, Werkkennis: beheerst', icon: 'check-check' });
  assert.equal(chipModel(en, 'Turning', lv(3, 'passed'), false).aria, 'Turning, Advanced: passed');
  const next = chipModel(nl, 'Draaien', lv(4, 'todo'), true);
  assert.equal(next.cls, 'level-chip s-todo next');
  assert.match(next.aria, /Volgende/);
});

test('i18n: topic and level strings in both languages', () => {
  const nl = translator('nl');
  const en = translator('en');
  assert.equal(nl('moduleLevels', 5, 24), '5/24 niveaus');
  assert.equal(en('moduleLevels', 5, 24), '5/24 levels');
  assert.equal(nl('topicLevel', 'Draaien', 'Gevorderd'), 'Draaien · Gevorderd');
  assert.equal(nl('moduleContinueAt', 'Draaien · Gevorderd'), 'Verder: Draaien · Gevorderd');
  assert.equal(nl('chipNext'), 'Volgende');
  assert.equal(nl('topicCount', 2), '2/4');
  for (const k of ['topicLevel', 'moduleLevels', 'chipNext', 'chipLabel', 'chipState_todo', 'chipState_passed', 'chipState_owned', 'moduleContinueAt', 'topicCount', 'nextLevel']) {
    assert.ok(k in STRINGS.en && k in STRINGS.nl, k);
  }
});

// ---- Task 4: where you are ----
import { placeLabel, pickWhy } from '../src/ui/coursehome.js';
import { figureSrc } from '../src/ui/figure.js';

test('placeLabel: topic and level for a topic lesson, empty otherwise', () => {
  const nl = translator('nl');
  assert.equal(placeLabel(nl, 'nl', 'eng.machining.turnfinish', [machiningV10]), 'Draaien · Gevorderd');
  assert.equal(placeLabel(translator('en'), 'en', 'eng.machining.cam', [machiningV10]), 'CNC programme · Expert');
  assert.equal(placeLabel(nl, 'nl', 'eng.flow.takt', [machiningV10]), '');
  assert.equal(nl('nextLevel', 'Draaien · Expert'), 'Volgende: Draaien · Expert');
});

test('pickWhy: a topic lesson pick names topic and level; others keep the v9 line', () => {
  const nl = translator('nl');
  const pick = { reason: 'lesson', moduleId: 'eng.machining', lessonId: 'eng.machining.turnfinish', topicId: 'turning', level: 3 };
  assert.equal(pickWhy(nl, 'nl', pick, machiningV10, [machiningV10]), 'Je volgende les · Draaien · Gevorderd');
  const flow = { id: 'eng.flow', title: { en: 'Capacity and flow', nl: 'Capaciteit en flow' } };
  assert.equal(pickWhy(nl, 'nl', { reason: 'lesson', moduleId: 'eng.flow', lessonId: 'eng.flow.takt' }, flow), 'Je volgende les · Capaciteit en flow');
  assert.equal(pickWhy(nl, 'nl', { reason: 'due', count: 5 }, null), nl('courseWhy_due'));
});

test('figureSrc: a level 1–4 is passed on; otherwise the v9 address', () => {
  assert.equal(figureSrc('x', 'dark', 'nl'), 'src/content/courses/figures/x.html?theme=dark&lang=nl');
  assert.match(figureSrc('x', 'dark', 'nl', 3), /&level=3$/);
  assert.equal(figureSrc('x', 'dark', 'nl', 7), figureSrc('x', 'dark', 'nl'));
  assert.equal(figureSrc('x', 'dark', 'nl', null), figureSrc('x', 'dark', 'nl'));
});

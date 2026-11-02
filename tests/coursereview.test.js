import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questionKey, scheduleCourseReview, isOwned, dueCourseQuestions, dueSession, maintenanceQuestion } from '../src/core/coursereview.js';
import { seededRng } from '../src/core/lesson.js';

const sched = (r, qid, day, ok, lang = 'nl') => scheduleCourseReview(r, { questionId: qid, lessonId: qid.split('#')[0], subject: qid.split('.')[0], lang }, day, ok);

test('owned after three correct recalls in three spaced sessions', () => {
  let r = sched({}, 'eng.flow.takt#r0', '2026-11-02', true); // the quiz itself
  assert.deepEqual(r[questionKey('nl', 'eng.flow.takt#r0')], { box: 2, due: '2026-11-05', lesson: 'eng.flow.takt', subject: 'eng' });
  assert.equal(isOwned(r, 'nl', 'eng.flow.takt#r0'), false);
  r = sched(r, 'eng.flow.takt#r0', '2026-11-05', true);
  assert.equal(r['nl|eng.flow.takt#r0'].box, 3);
  assert.equal(r['nl|eng.flow.takt#r0'].due, '2026-11-12');
  r = sched(r, 'eng.flow.takt#r0', '2026-11-12', true);
  assert.equal(r['nl|eng.flow.takt#r0'].box, 4);
  assert.equal(r['nl|eng.flow.takt#r0'].due, '2026-12-03');
  assert.equal(isOwned(r, 'nl', 'eng.flow.takt#r0'), true);
});

test('a miss sends it back to box 1, due tomorrow; a first miss starts there', () => {
  let r = sched({}, 'eng.flow.takt#r1', '2026-11-02', false);
  assert.deepEqual([r['nl|eng.flow.takt#r1'].box, r['nl|eng.flow.takt#r1'].due], [1, '2026-11-03']);
  r = sched(sched(r, 'eng.flow.takt#r1', '2026-11-03', true), 'eng.flow.takt#r1', '2026-11-06', false);
  assert.equal(r['nl|eng.flow.takt#r1'].box, 1);
});

test('languages keep separate queues', () => {
  const r = sched(sched({}, 'eng.flow.takt#r0', '2026-11-02', true, 'nl'), 'eng.flow.takt#r0', '2026-11-02', false, 'en');
  assert.equal(r['nl|eng.flow.takt#r0'].box, 2);
  assert.equal(r['en|eng.flow.takt#r0'].box, 1);
  assert.equal(dueCourseQuestions(r, '2026-11-03', 'eng', 'en').length, 1);
  assert.equal(dueCourseQuestions(r, '2026-11-03', 'eng', 'nl').length, 0);
});

const TRACK = { 'eng.flow': 'basics', 'eng.quality': 'basics', 'eng.machining': 'discrete', 'eng.gridbasics': 'grid' };
const trackOf = (m) => TRACK[m] || null;
const seed = (ids, day = '2026-11-01') => ids.reduce((r, id) => sched(r, id, day, false), {});

test('due session: the busiest track, modules alternated, never another subject', () => {
  const r = seed(['eng.flow.a#r0', 'eng.flow.a#r1', 'eng.flow.b#r0', 'eng.quality.a#r0', 'eng.quality.a#r1', 'eng.machining.a#r0', 'pm.intake.ask#r0']);
  const s = dueSession(r, '2026-11-02', 'eng', 'nl', seededRng(1), { trackOf });
  assert.equal(s.length, 5);
  assert.ok(s.every((id) => id.startsWith('eng.flow') || id.startsWith('eng.quality')));
  const mods = s.map((id) => id.split('.').slice(0, 2).join('.'));
  for (let i = 1; i < 4; i++) assert.notEqual(mods[i], mods[i - 1], `alternates: ${mods}`);
  assert.deepEqual(dueSession(r, '2026-11-02', 'pm', 'nl', seededRng(1), { trackOf }), ['pm.intake.ask#r0']);
});

test('due session: one question runs; nothing due gives none; capped at max', () => {
  assert.equal(dueSession(seed(['eng.flow.a#r0']), '2026-11-02', 'eng', 'nl', seededRng(2), { trackOf }).length, 1);
  assert.deepEqual(dueSession({}, '2026-11-02', 'eng', 'nl', seededRng(2), { trackOf }), []);
  const many = seed(Array.from({ length: 14 }, (_, i) => `eng.flow.l${i}#r0`));
  assert.equal(dueSession(many, '2026-11-02', 'eng', 'nl', seededRng(2), { trackOf }).length, 10);
});

test('due session is deterministic for the same day and seed', () => {
  const r = seed(['eng.flow.a#r0', 'eng.flow.a#r1', 'eng.flow.b#r0', 'eng.quality.a#r0']);
  assert.deepEqual(dueSession(r, '2026-11-02', 'eng', 'nl', seededRng(5), { trackOf }), dueSession(r, '2026-11-02', 'eng', 'nl', seededRng(5), { trackOf }));
});

test('questions overdue by more than 60 days drop out of the due list', () => {
  const r = seed(['eng.flow.a#r0'], '2026-08-01');
  assert.equal(dueCourseQuestions(r, '2026-11-02', 'eng', 'nl').length, 0);
});

test('maintenance: oldest owned question, at most once per ISO week', () => {
  let r = {};
  for (const [id, start] of [['eng.flow.a#r0', '2026-10-01'], ['eng.flow.b#r0', '2026-10-05']]) {
    r = sched(sched(sched(r, id, start, true), id, start, true), id, start, true);
  }
  assert.equal(maintenanceQuestion(r, '2026-11-02', 'eng', 'nl', null), 'eng.flow.a#r0');
  assert.equal(maintenanceQuestion(r, '2026-11-04', 'eng', 'nl', '2026-W45'), null);
  assert.equal(maintenanceQuestion({}, '2026-11-02', 'eng', 'nl', null), null);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questionKey, scheduleCourseReview, isOwned, dueCourseQuestions, dueSession, maintenanceQuestion, dueCount, COURSE_INTERVALS, OWNED_BOX } from '../src/core/coursereview.js';
import { seededRng } from '../src/core/lesson.js';

const sched = (r, qid, day, ok, lang = 'nl', sure = true) => scheduleCourseReview(r, { questionId: qid, lessonId: qid.split('#')[0], subject: qid.split('.')[0], lang }, day, ok, sure);

test('owned after three correct recalls in three spaced sessions', () => {
  let r = sched({}, 'eng.flow.takt#r0', '2026-11-02', true); // the quiz itself
  assert.deepEqual(r[questionKey('nl', 'eng.flow.takt#r0')], { box: 2, due: '2026-11-05', lesson: 'eng.flow.takt', subject: 'eng', lastSure: true });
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

test('questions overdue by more than 60 days come back marked lapsed, never dropped', () => {
  const r = seed(['eng.flow.a#r0'], '2026-08-01');
  const due = dueCourseQuestions(r, '2026-11-02', 'eng', 'nl');
  assert.equal(due.length, 1);
  assert.equal(due[0].lapsed, true);
  assert.equal(dueCourseQuestions(seed(['eng.flow.a#r0'], '2026-10-30'), '2026-11-02', 'eng', 'nl')[0].lapsed, false);
});

test('a session takes at most three lapsed questions, after the regular due ones', () => {
  let r = seed(Array.from({ length: 6 }, (_, i) => `eng.flow.old${i}#r0`), '2026-07-01');
  r = { ...r, ...seed(['eng.flow.a#r0', 'eng.quality.a#r0'], '2026-11-01') };
  const s = dueSession(r, '2026-11-02', 'eng', 'nl', seededRng(3), { trackOf });
  assert.equal(s.length, 5);
  assert.deepEqual(s.slice(0, 2).sort(), ['eng.flow.a#r0', 'eng.quality.a#r0']);
  assert.ok(s.slice(2).every((id) => id.includes('.old')));
  assert.equal(dueCount(r, '2026-11-02', 'eng', 'nl'), 5, 'the count a returning user sees');
  // Only lapsed ones: still three, oldest first.
  const only = seed(Array.from({ length: 6 }, (_, i) => `eng.flow.old${i}#r0`), '2026-07-01');
  assert.equal(dueSession(only, '2026-11-02', 'eng', 'nl', seededRng(3), { trackOf }).length, 3);
  // A lapsed miss goes to box 1 as usual.
  assert.equal(sched(only, 'eng.flow.old0#r0', '2026-11-02', false)['nl|eng.flow.old0#r0'].box, 1);
});

test('a correct guess keeps the box (a new one starts at box 1); sure and correct climbs to 6 with gaps 60 and 120', () => {
  const q = 'eng.flow.takt#r0';
  let r = sched({}, q, '2026-11-02', true, 'nl', false);
  assert.deepEqual(r[`nl|${q}`], { box: 1, due: '2026-11-03', lesson: 'eng.flow.takt', subject: 'eng', lastSure: false });
  r = sched(r, q, '2026-11-03', true); // box 2
  r = sched(r, q, '2026-11-06', true, 'nl', false);
  assert.deepEqual([r[`nl|${q}`].box, r[`nl|${q}`].due], [2, '2026-11-09'], 'a guess keeps box 2 and waits its interval');
  r = sched(r, q, '2026-11-09', true); // 3
  r = sched(r, q, '2026-11-16', true); // 4
  assert.equal(isOwned(r, 'nl', q), true, 'box 4 is owned');
  r = sched(r, q, '2026-12-07', true);
  assert.deepEqual([r[`nl|${q}`].box, r[`nl|${q}`].due], [5, '2027-02-05']);
  r = sched(r, q, '2027-02-05', true);
  assert.deepEqual([r[`nl|${q}`].box, r[`nl|${q}`].due], [6, '2027-06-05']);
  r = sched(r, q, '2027-06-05', true);
  assert.equal(r[`nl|${q}`].box, 6, 'capped at 6');
  assert.deepEqual(COURSE_INTERVALS, [1, 3, 7, 21, 60, 120]);
  assert.equal(OWNED_BOX, 4);
  assert.equal(isOwned({ 'nl|x#r0': { box: 3 } }, 'nl', 'x#r0'), false, 'box 3 is not owned');
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

// The hint replaced "I'm guessing": the sure argument is now !hinted.
test('with a hint: correct keeps the box, wrong goes to box 1; without a hint correct climbs', () => {
  const q = 'eng.flow.takt#r0';
  let r = sched({}, q, '2026-11-02', true); // box 2
  r = sched(r, q, '2026-11-03', true, 'nl', !true);
  assert.equal(r[`nl|${q}`].box, 2, 'correct after a hint: stays');
  r = sched(r, q, '2026-11-03', true, 'nl', !false);
  assert.equal(r[`nl|${q}`].box, 3, 'correct without a hint: climbs');
  r = sched(r, q, '2026-11-06', false, 'nl', !true);
  assert.equal(r[`nl|${q}`].box, 1, 'wrong, hint or not: box 1');
});

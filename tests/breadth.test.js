// The next step goes breadth-first by level: every Basis lesson of the subject
// (modules in road order), then every Werkkennis lesson, then Gevorderd, then Expert.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultState } from '../src/core/storage.js';
import { MODULES, topicsOf } from '../src/content/courses/index.js';
import { nextLesson, recommendedModule, courseTodayPick, roadOrder, breadthOrder } from '../src/core/course.js';

const meta = (id) => MODULES.find((m) => m.id === id);
const levelOf = (m, L) => topicsOf(m).map((t) => t.levels[L]);
const stateWith = (subject, ids) => ({
  ...defaultState(),
  courses: { [subject]: { lessons: Object.fromEntries(ids.map((id) => [id, { passed: true, ts: 1 }])) } },
});
const TODAY = '2026-11-02';

test('roadOrder: Projects follows the road (Intake, Plan, Run, Land, Close) then the map order; Engineering the course order', () => {
  const ids = roadOrder('pm').map((m) => m.id);
  assert.deepEqual(ids.slice(0, 7), ['pm.intake', 'pm.plan', 'pm.run', 'pm.land', 'pm.close', 'pm.portfolio', 'pm.consult']);
  assert.equal(ids.length, MODULES.filter((m) => m.subject === 'pm').length);
  assert.deepEqual(roadOrder('eng').map((m) => m.id), MODULES.filter((m) => m.subject === 'eng').map((m) => m.id));
});

test('breadthOrder: all Basis first, then all Werkkennis, in module order', () => {
  const order = breadthOrder('pm');
  const basis = roadOrder('pm').flatMap((m) => levelOf(m, 0));
  assert.deepEqual(order.slice(0, basis.length), basis);
  assert.deepEqual(order.slice(basis.length, basis.length + 4), levelOf(meta('pm.intake'), 1));
  assert.equal(order.length, new Set(order).size);
  assert.equal(order.length, MODULES.filter((m) => m.subject === 'pm').reduce((n, m) => n + m.lessons.length, 0));
});

test('all Basis lessons of Intake done: next is Plan\'s first Basis lesson, not Intake Werkkennis', () => {
  const st = stateWith('pm', levelOf(meta('pm.intake'), 0));
  assert.equal(recommendedModule(st, 'pm'), 'pm.plan');
  assert.equal(nextLesson(st, meta('pm.plan')), levelOf(meta('pm.plan'), 0)[0]);
  const pick = courseTodayPick(st, 'pm', 'nl', TODAY);
  assert.equal(pick.moduleId, 'pm.plan');
  assert.equal(pick.lessonId, levelOf(meta('pm.plan'), 0)[0]);
  // the module screen of Intake agrees: its own next is Werkkennis, but the subject's next step is elsewhere
  assert.equal(nextLesson(st, meta('pm.intake')), levelOf(meta('pm.intake'), 1)[0]);
});

test('all Basis lessons of the subject done: next is Intake\'s first Werkkennis lesson', () => {
  const basis = roadOrder('pm').flatMap((m) => levelOf(m, 0));
  const st = stateWith('pm', basis);
  const pick = courseTodayPick(st, 'pm', 'nl', TODAY);
  assert.equal(pick.moduleId, 'pm.intake');
  assert.equal(pick.lessonId, levelOf(meta('pm.intake'), 1)[0]);
  assert.equal(nextLesson(st, meta('pm.intake')), pick.lessonId);
});

test('inside a module the lowest level across topics comes first; Engineering is breadth-first too', () => {
  const m = meta('eng.flow');
  assert.equal(nextLesson(stateWith('eng', [m.topics[0].levels[0]]), m), m.topics[1].levels[0]);
  const all = roadOrder('eng').flatMap((x) => levelOf(x, 0));
  const pick = courseTodayPick(stateWith('eng', all), 'eng', 'nl', TODAY);
  assert.equal(pick.lessonId, levelOf(roadOrder('eng')[0], 1)[0]);
});

test('everything passed: no module recommended', () => {
  const st = stateWith('pm', breadthOrder('pm'));
  assert.equal(recommendedModule(st, 'pm'), null);
});

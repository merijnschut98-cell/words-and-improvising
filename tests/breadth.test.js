// The next step goes breadth-first by level: every Basis lesson of the subject
// (modules in road order), then every Werkkennis lesson, then Gevorderd, then Expert.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultState } from '../src/core/storage.js';
import { MODULES, topicsOf } from '../src/content/courses/index.js';
import { mapFor } from '../src/content/courses/maps/index.js';
import { nextLesson, recommendedModule, courseTodayPick, roadOrder, breadthOrder, nextCourseLesson, lessonEndNext } from '../src/core/course.js';

const meta = (id) => MODULES.find((m) => m.id === id);
const levelOf = (m, L) => topicsOf(m).map((t) => t.levels[L]);
const stateWith = (subject, ids) => ({
  ...defaultState(),
  courses: { [subject]: { lessons: Object.fromEntries(ids.map((id) => [id, { passed: true, ts: 1 }])) } },
});
const TODAY = '2026-11-02';

test('roadOrder: Projects follows the road (Intake, Plan, Run, Land, Close), then the other places by module level (Instap, Verdieping, Specialist), map order within a level', () => {
  const ids = roadOrder('pm').map((m) => m.id);
  assert.deepEqual(ids, ['pm.intake', 'pm.plan', 'pm.run', 'pm.land', 'pm.close',
    'pm.agile', 'pm.devops',
    'pm.stuck', 'pm.lead', 'pm.negotiate', 'pm.outside', 'pm.perform', 'pm.scaled', 'pm.itproject',
    'pm.portfolio', 'pm.consult']);
  assert.equal(ids.length, MODULES.filter((m) => m.subject === 'pm').length);
});

test('roadOrder: Engineering has a map but no road, so it goes by module level, map order within a level (no L4 module before an L1 one)', () => {
  const eng = MODULES.filter((m) => m.subject === 'eng');
  const at = (id) => mapFor('eng').places.findIndex((p) => p.module === id);
  const ids = roadOrder('eng').map((m) => m.id);
  assert.deepEqual(ids, [...eng].sort((a, b) => a.level - b.level || at(a.id) - at(b.id)).map((m) => m.id));
  assert.deepEqual(ids.slice(0, 7), ['eng.flow', 'eng.quality', 'eng.mechanics', 'eng.machining', 'eng.process', 'eng.gridbasics', 'eng.itbasics']);
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

test('real states: a fresh learner starts at Intake Basis 1; an opened unfinished lesson resumes; Run (a level-2 module on the road) gets its Basis third', () => {
  const fresh = courseTodayPick(stateWith('pm', []), 'pm', 'nl', TODAY);
  assert.deepEqual([fresh.moduleId, fresh.lessonId, fresh.level], ['pm.intake', levelOf(meta('pm.intake'), 0)[0], 1]);
  // opened a Werkkennis lesson of Land and left it: that comes back first
  const land2 = levelOf(meta('pm.land'), 1)[0];
  const opened = stateWith('pm', [levelOf(meta('pm.intake'), 0)[0]]);
  opened.courses.pm.lessons[land2] = { opened: 5 };
  const back = courseTodayPick(opened, 'pm', 'nl', TODAY);
  assert.deepEqual([back.why, back.lessonId], ['resume', land2]);
  // Intake and Plan Basis done: Run's Basis (Run is a Verdieping module; nothing locks it)
  const two = stateWith('pm', [...levelOf(meta('pm.intake'), 0), ...levelOf(meta('pm.plan'), 0)]);
  assert.equal(courseTodayPick(two, 'pm', 'nl', TODAY).lessonId, levelOf(meta('pm.run'), 0)[0]);
  // the road's Basis done: Agile's Basis (Verdieping) before Stuck (Specialist) and Portfolio
  const road = stateWith('pm', ['pm.intake', 'pm.plan', 'pm.run', 'pm.land', 'pm.close'].flatMap((id) => levelOf(meta(id), 0)));
  assert.equal(courseTodayPick(road, 'pm', 'nl', TODAY).moduleId, 'pm.agile');
});

test('a module without topics joins the Basis round with all its lessons in index order', () => {
  const mods = [
    { id: 'xx.a', subject: 'xx', level: 1, topics: [{ id: 't', levels: ['xx.a.1', 'xx.a.2'] }, { id: 'u', levels: ['xx.a.3', 'xx.a.4'] }], lessons: ['xx.a.1', 'xx.a.2', 'xx.a.3', 'xx.a.4'] },
    { id: 'xx.b', subject: 'xx', level: 1, lessons: ['xx.b.1', 'xx.b.2'] },
  ];
  assert.deepEqual(breadthOrder('xx', mods), ['xx.a.1', 'xx.a.3', 'xx.b.1', 'xx.b.2', 'xx.a.2', 'xx.a.4']);
});

test('nextCourseLesson: the subject\'s next lesson breadth-first, null when all are passed', () => {
  assert.deepEqual(nextCourseLesson(stateWith('pm', []), 'pm'), { moduleId: 'pm.intake', lessonId: levelOf(meta('pm.intake'), 0)[0] });
  assert.deepEqual(nextCourseLesson(stateWith('pm', levelOf(meta('pm.intake'), 0)), 'pm'), { moduleId: 'pm.plan', lessonId: levelOf(meta('pm.plan'), 0)[0] });
  assert.equal(nextCourseLesson(stateWith('pm', breadthOrder('pm')), 'pm'), null);
});

test('lesson end "next": opened from a home it follows the subject\'s next step (another module once this one\'s Basis is done); from the module screen it stays in the module', () => {
  const intake = meta('pm.intake');
  const basis = levelOf(intake, 0);
  const st = stateWith('pm', basis);
  const last = basis[basis.length - 1];
  const pick = courseTodayPick(st, 'pm', 'nl', TODAY);
  assert.deepEqual(lessonEndNext(st, intake, last, false), { moduleId: 'pm.plan', lessonId: levelOf(meta('pm.plan'), 0)[0] });
  assert.deepEqual(lessonEndNext(st, intake, last, false), { moduleId: pick.moduleId, lessonId: pick.lessonId }, 'agrees with the start card');
  assert.deepEqual(lessonEndNext(st, intake, last, true), { moduleId: 'pm.intake', lessonId: levelOf(intake, 1)[0] }, 'agrees with the module screen');
  const mid = stateWith('pm', [basis[0]]);
  assert.deepEqual(lessonEndNext(mid, intake, basis[0], false), { moduleId: 'pm.intake', lessonId: basis[1] });
  assert.deepEqual(lessonEndNext(mid, intake, basis[0], true), { moduleId: 'pm.intake', lessonId: basis[1] });
  assert.equal(lessonEndNext(stateWith('pm', breadthOrder('pm')), intake, last, false), null, 'nothing left');
  assert.equal(lessonEndNext(stateWith('pm', []), intake, basis[0], false), null, 'never the lesson itself');
});

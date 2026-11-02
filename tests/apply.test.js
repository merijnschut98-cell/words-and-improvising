import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addPlan, answerPlan, skipPlan, openPlans, planStats, applyRecall, applyQuestionId, courseTodayPick } from '../src/core/course.js';
import { defaultState, load, KEY } from '../src/core/storage.js';
import { mergeStates } from '../src/core/sync.js';

const MON = '2026-11-02';
const THU = '2026-11-05';
const NOW = new Date(2026, 10, 2, 9).getTime();
const MODS = [
  { id: 'eng.flow', subject: 'eng', track: 'basics', level: 1, lessons: ['eng.flow.a', 'eng.flow.b'], questions: { 'eng.flow.a': 2, 'eng.flow.b': 1 } },
];
const plans = (s, subject = 'eng') => s.courses[subject].plans;
const add = (s, lessonId, text, today, id) => addPlan(s, { subject: 'eng', lessonId, text }, today, id);

test('addPlan: due on the next working day at least two days later; text trimmed and capped', () => {
  let s = add(defaultState(), 'eng.flow.a', '  When the  data is late,\nI will name it.  ', THU, 'p1');
  assert.deepEqual(plans(s)[0], { id: 'p1', lessonId: 'eng.flow.a', text: 'When the data is late, I will name it.', day: THU, due: '2026-11-09', asked: 0, outcome: null });
  s = add(defaultState(), 'eng.flow.a', 'x'.repeat(300), MON, 'p2');
  assert.equal(plans(s)[0].due, '2026-11-04', 'Monday → Wednesday');
  assert.equal(plans(s)[0].text.length, 160);
  assert.equal(plans(add(defaultState(), 'eng.flow.a', 'x', '2026-11-06', 'p3'))[0].due, '2026-11-09', 'Friday → Monday');
});

test('addPlan: empty text saves nothing; a new plan for the same lesson replaces the open one', () => {
  const empty = add(defaultState(), 'eng.flow.a', '   ', MON, 'p1');
  assert.deepEqual(plans(empty) || [], []);
  let s = add(defaultState(), 'eng.flow.a', 'first', MON, 'p1');
  s = add(s, 'eng.flow.b', 'other lesson', MON, 'p2');
  s = add(s, 'eng.flow.a', 'second', MON, 'p3');
  assert.deepEqual(plans(s).map((p) => p.id), ['p3', 'p2']);
  // An answered plan stays: it is history, not an open plan.
  s = answerPlan(s, { subject: 'eng', id: 'p3', used: 'yes', note: '' }, NOW);
  s = add(s, 'eng.flow.a', 'third', MON, 'p4');
  assert.deepEqual(plans(s).map((p) => p.id), ['p4', 'p3', 'p2']);
});

test('plans are capped at 50, newest first', () => {
  let s = defaultState();
  for (let i = 0; i < 55; i++) s = add(s, `eng.flow.l${i}`, `plan ${i}`, MON, `p${String(i).padStart(2, '0')}`);
  assert.equal(plans(s).length, 50);
  assert.equal(plans(s)[0].id, 'p54');
});

test('skipPlan asks again two days later, and the second skip expires it', () => {
  let s = add(defaultState(), 'eng.flow.a', 'plan', MON, 'p1');
  s = skipPlan(s, { subject: 'eng', id: 'p1' }, '2026-11-04', NOW);
  assert.deepEqual([plans(s)[0].asked, plans(s)[0].due, plans(s)[0].outcome], [1, '2026-11-06', null]);
  s = skipPlan(s, { subject: 'eng', id: 'p1' }, '2026-11-06', NOW);
  assert.equal(plans(s)[0].asked, 2);
  assert.deepEqual(plans(s)[0].outcome, { used: 'no', note: '', ts: NOW });
  assert.deepEqual(openPlans(s, 'eng', '2026-11-30'), []);
});

test('openPlans: due, unanswered, not expired, oldest due first', () => {
  let s = add(defaultState(), 'eng.flow.a', 'a', MON, 'p1'); // due 11-04
  s = add(s, 'eng.flow.b', 'b', '2026-11-03', 'p2'); // due 11-05
  s = add(s, 'eng.flow.c', 'c', '2026-11-04', 'p3'); // due 11-06
  assert.deepEqual(openPlans(s, 'eng', '2026-11-03'), []);
  assert.deepEqual(openPlans(s, 'eng', '2026-11-05').map((p) => p.id), ['p1', 'p2']);
  s = answerPlan(s, { subject: 'eng', id: 'p1', used: 'partly', note: '  went  ok ' }, NOW);
  assert.deepEqual(plans(s).find((p) => p.id === 'p1').outcome, { used: 'partly', note: 'went ok', ts: NOW });
  assert.deepEqual(openPlans(s, 'eng', '2026-11-06').map((p) => p.id), ['p2', 'p3']);
  // Not followed up within two weeks of its due day: it stops asking.
  assert.deepEqual(openPlans(s, 'eng', '2026-11-30'), []);
});

test('answerPlan ignores unknown ids and invalid answers', () => {
  const s = add(defaultState(), 'eng.flow.a', 'a', MON, 'p1');
  assert.deepEqual(answerPlan(s, { subject: 'eng', id: 'nope', used: 'yes' }, NOW), s);
  assert.deepEqual(answerPlan(s, { subject: 'eng', id: 'p1', used: 'maybe' }, NOW), s);
});

test('today: a due plan follow-up comes first, before five due questions', () => {
  let s = add(defaultState(), 'eng.flow.a', 'a', MON, 'p1');
  s = { ...s, courseReviews: Object.fromEntries([0, 1, 2, 3, 4].map((i) => [`nl|eng.flow.a#r${i}`, { box: 1, due: MON, lesson: 'eng.flow.a', subject: 'eng' }])) };
  assert.equal(courseTodayPick(s, 'eng', 'nl', '2026-11-03', MODS).reason, 'due');
  assert.deepEqual(courseTodayPick(s, 'eng', 'nl', '2026-11-04', MODS), { reason: 'apply', planId: 'p1', lessonId: 'eng.flow.a', moduleId: 'eng.flow' });
  assert.equal(courseTodayPick(s, 'pm', 'nl', '2026-11-04', MODS).reason !== 'apply', true, 'per subject');
});

test('making or answering a plan and its recall question give no XP and no round', () => {
  let s = add(defaultState(), 'eng.flow.a', 'a', MON, 'p1');
  s = answerPlan(s, { subject: 'eng', id: 'p1', used: 'yes', note: '' }, NOW);
  const r = applyRecall(s, { subject: 'eng', results: { 'eng.flow.a#r0': true }, lang: 'nl' }, '2026-11-04');
  assert.equal(r.xp, 0);
  for (const st of [s, r.state]) {
    assert.equal(st.xp, 0);
    assert.deepEqual(st.days, {});
    assert.deepEqual(st.streak, { count: 0, lastDay: null });
    assert.deepEqual(st.courses.eng.sessions, []);
  }
  assert.equal(r.state.courseReviews['nl|eng.flow.a#r0'].box, 2);
});

test('applyRecall: a hit before the question is due does not climb; a miss resets', () => {
  const s = { ...defaultState(), courseReviews: { 'nl|eng.flow.a#r0': { box: 3, due: '2026-11-20', lesson: 'eng.flow.a', subject: 'eng' } } };
  const hit = applyRecall(s, { subject: 'eng', results: { 'eng.flow.a#r0': true }, lang: 'nl' }, MON).state;
  assert.equal(hit.courseReviews['nl|eng.flow.a#r0'].box, 3);
  const miss = applyRecall(s, { subject: 'eng', results: { 'eng.flow.a#r0': false }, lang: 'nl' }, MON).state;
  assert.equal(miss.courseReviews['nl|eng.flow.a#r0'].box, 1);
});

test('applyQuestionId: the weakest recall question of the lesson, first on ties', () => {
  const reviews = { 'nl|eng.flow.a#r0': { box: 3, due: '2026-11-20' }, 'nl|eng.flow.a#r1': { box: 2, due: '2026-11-20' } };
  assert.equal(applyQuestionId(reviews, 'nl', 'eng.flow.a', 3), 'eng.flow.a#r2');
  assert.equal(applyQuestionId(reviews, 'nl', 'eng.flow.a', 2), 'eng.flow.a#r1');
  assert.equal(applyQuestionId(reviews, 'nl', 'eng.flow.a', 0), null);
});

test('planStats: plans made and used (yes or partly) since a day', () => {
  let s = add(defaultState(), 'eng.flow.a', 'a', '2026-10-01', 'p0');
  s = add(s, 'eng.flow.b', 'b', MON, 'p1');
  s = add(s, 'eng.flow.c', 'c', MON, 'p2');
  s = add(s, 'eng.flow.d', 'd', MON, 'p3');
  s = answerPlan(s, { subject: 'eng', id: 'p1', used: 'yes', note: '' }, NOW);
  s = answerPlan(s, { subject: 'eng', id: 'p2', used: 'partly', note: '' }, NOW);
  s = answerPlan(s, { subject: 'eng', id: 'p3', used: 'no', note: '' }, NOW);
  assert.deepEqual(planStats(s, 'eng', '2026-10-15'), { made: 3, used: 2 });
  assert.deepEqual(planStats(defaultState(), 'pm', '2026-10-15'), { made: 0, used: 0 });
});

const backend = (v) => ({ getItem: (k) => (k === KEY ? v : null), setItem() {} });

test('storage: a v8 blob without plans loads with plans []; junk is coerced; bad entries dropped', () => {
  const v8 = load(backend(JSON.stringify({ ...defaultState(), courses: { eng: { lessons: {}, sessions: [] } } })));
  assert.deepEqual(v8.courses.eng.plans, []);
  assert.deepEqual(v8.courses.pm.plans, []);
  const junk = load(backend(JSON.stringify({ courses: { eng: { plans: 'x' } } })));
  assert.deepEqual(junk.courses.eng.plans, []);
  const good = { id: 'p1', lessonId: 'eng.flow.a', text: 't', day: MON, due: '2026-11-04', asked: 0, outcome: null };
  const mixed = load(backend(JSON.stringify({ courses: { eng: { plans: [
    good,
    { ...good, id: 'p2', outcome: { used: 'perhaps', note: '', ts: 1 } },
    { ...good, id: 'p3', outcome: { used: 'yes', note: 'ok', ts: 1 } },
    null, 'x', { id: 'p4' },
  ] } } })));
  assert.deepEqual(mixed.courses.eng.plans.map((p) => p.id), ['p1', 'p3']);
});

test('sync: plans union by id; an answered plan beats an open one; later answer wins; asked takes the max; idempotent', () => {
  const base = { id: 'p1', lessonId: 'eng.flow.a', text: 't', day: MON, due: '2026-11-04', asked: 0, outcome: null };
  const withPlans = (list) => ({ ...defaultState(), courses: { ...defaultState().courses, eng: { lessons: {}, sessions: [], plans: list } } });
  const a = withPlans([{ ...base, asked: 1, due: '2026-11-06' }, { ...base, id: 'p2', day: '2026-11-03' }]);
  const b = withPlans([{ ...base, outcome: { used: 'yes', note: '', ts: 5 } }, { ...base, id: 'p3', day: '2026-11-01' }]);
  const m = mergeStates(a, b);
  assert.deepEqual(plans(m).map((p) => p.id).sort(), ['p1', 'p2', 'p3']);
  const p1 = plans(m).find((p) => p.id === 'p1');
  assert.deepEqual(p1.outcome, { used: 'yes', note: '', ts: 5 });
  assert.equal(p1.asked, 1);
  assert.deepEqual(plans(mergeStates(b, a)).find((p) => p.id === 'p1').outcome, { used: 'yes', note: '', ts: 5 });
  const late = withPlans([{ ...base, outcome: { used: 'no', note: '', ts: 9 } }]);
  assert.equal(plans(mergeStates(b, late)).find((p) => p.id === 'p1').outcome.used, 'no');
  assert.equal(plans(mergeStates(late, b)).find((p) => p.id === 'p1').outcome.used, 'no');
  assert.deepEqual(mergeStates(m, b).courses.eng.plans, m.courses.eng.plans);
  assert.deepEqual(mergeStates(m, m).courses.eng.plans, m.courses.eng.plans);
});

// Polish: the plan field saves a draft while he types; it becomes a plan on leaving (or on the next start).
import { savePlanDraft, commitPlanDraft } from '../src/core/course.js';
import { syncable } from '../src/core/sync.js';

test('plan draft: saved on this device while typing, committed once as one plan, empty clears it', () => {
  let s = savePlanDraft(defaultState(), { subject: 'eng', lessonId: 'eng.flow.a', text: '  When the data is late  ' });
  assert.deepEqual(s.ui.planDraft, { subject: 'eng', lessonId: 'eng.flow.a', text: 'When the data is late' });
  assert.deepEqual(plans(s) || [], [], 'a draft is not a plan yet');
  s = savePlanDraft(s, { subject: 'eng', lessonId: 'eng.flow.a', text: 'When the data is late, I name it' });
  s = commitPlanDraft(s, MON, 'p1');
  assert.equal('planDraft' in s.ui, false);
  assert.deepEqual(plans(s).map((p) => [p.id, p.text]), [['p1', 'When the data is late, I name it']]);
  assert.equal(commitPlanDraft(s, MON, 'p2'), s, 'nothing to commit twice');
  const cleared = savePlanDraft(savePlanDraft(defaultState(), { subject: 'eng', lessonId: 'eng.flow.a', text: 'x' }), { subject: 'eng', lessonId: 'eng.flow.a', text: '   ' });
  assert.equal('planDraft' in cleared.ui, false);
  assert.deepEqual(plans(commitPlanDraft(cleared, MON, 'p3')) || [], []);
});

test('plan draft: device only (never synced); a malformed one is dropped on load', () => {
  const s = savePlanDraft(defaultState(), { subject: 'eng', lessonId: 'eng.flow.a', text: 'x' });
  assert.equal('ui' in syncable(s), false);
  const bad = load(backend(JSON.stringify({ ...defaultState(), ui: { planDraft: { subject: 'eng', lessonId: 5, text: 'x' } } })));
  assert.equal('planDraft' in bad.ui, false);
  const odd = load(backend(JSON.stringify({ ...defaultState(), ui: { planDraft: { subject: 'speak', lessonId: 'x', text: 'x' } } })));
  assert.equal('planDraft' in odd.ui, false);
  const good = load(backend(JSON.stringify({ ...defaultState(), ui: { planDraft: { subject: 'pm', lessonId: 'pm.x.a', text: 'y' } } })));
  assert.deepEqual(good.ui.planDraft, { subject: 'pm', lessonId: 'pm.x.a', text: 'y' });
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { masteryOf, ownedDrills } from '../src/core/mastery.js';
import { buildLesson, seededRng } from '../src/core/lesson.js';
import en from '../src/content/prompts.en.js';

const DAY = 86400000;
const NOW = new Date(2026, 9, 27, 12).getTime();
const r = (drill, daysAgo, rating, coach = null) => ({ ts: NOW - daysAgo * DAY, drill, rating, coach, metrics: { words: 50, fillerRate: 2 } });

test('learn → practise → own', () => {
  assert.equal(masteryOf([r('prep', 1, 2), r('prep', 2, 2)], 'prep', NOW), 'learn');
  assert.equal(masteryOf([r('prep', 1, 2), r('prep', 2, 2), r('prep', 3, 2)], 'prep', NOW), 'practise');
  assert.equal(masteryOf([r('prep', 1, 4), r('prep', 2, 5), r('prep', 3, 4)], 'prep', NOW), 'own');
});

test('own needs three different days within 14 days; the coach score counts when he did not rate', () => {
  assert.equal(masteryOf([r('prep', 1, 4), r('prep', 1, 5), r('prep', 1, 4)], 'prep', NOW), 'practise');
  assert.equal(masteryOf([r('prep', 1, 4), r('prep', 5, 4), r('prep', 20, 4)], 'prep', NOW), 'practise');
  assert.equal(masteryOf([r('prep', 1, null, { overall: 4 }), r('prep', 3, null, { overall: 5 }), r('prep', 6, 4)], 'prep', NOW), 'own');
});

test('the adaptive lesson does not pick an owned drill as the weakest', () => {
  // prep is lowest-rated overall but owned lately; debate is weak and not owned.
  const history = [r('prep', 1, 4), r('prep', 2, 4), r('prep', 3, 4), r('prep', 30, 1), r('prep', 31, 1), r('prep', 32, 1),
    r('debate', 1, 2), r('debate', 2, 3)];
  assert.deepEqual(ownedDrills(history, NOW), ['prep']);
  const ls = buildLesson(en, seededRng(5), {}, { history, due: [], owned: ownedDrills(history, NOW) });
  assert.equal(ls[0].drill, 'debate');
  assert.equal(ls[0].reason, 'weak');
});

test('maintenance: the owned drill unplayed longest, at most once per ISO week', async () => {
  const { maintenanceDrill } = await import('../src/core/mastery.js');
  // NOW is Tue 27 Oct 2026; the ISO week started Mon 26 Oct.
  const owned = [r('prep', 3, 4), r('prep', 5, 4), r('prep', 7, 4), r('debate', 4, 5), r('debate', 6, 4), r('debate', 8, 4)];
  assert.equal(maintenanceDrill(owned, NOW), 'debate');
  assert.equal(maintenanceDrill([r('debate', 1, 3), ...owned], NOW), null, 'an owned drill was played this week');
  assert.equal(maintenanceDrill([r('prep', 2, 2), r('rapid', 3, 2)], NOW), null, 'nothing owned');
});

test('the Today pick keeps it sharp after the weekly focus, never above a due review or an event', async () => {
  const { todayPick } = await import('../src/core/today.js');
  const { defaultState } = await import('../src/core/storage.js');
  const hist = [r('prep', 3, 4), r('prep', 5, 4), r('prep', 7, 4)].map((e, i) => ({ ...e, lang: 'en', promptId: `p${i}` }));
  const s = { ...defaultState(), history: hist };
  const today = '2026-10-27';
  const pick = todayPick(s, today, en, 'en', NOW);
  assert.equal(pick.reason, 'maintain');
  assert.equal(pick.prompt.drill, 'prep');
  const ev = { ...s, events: [{ id: 'e1', type: 'client', date: '2026-10-28', text: 'Kick-off', reflection: null }] };
  assert.equal(todayPick(ev, today, en, 'en', NOW).reason, 'event');
});

test('lesson random slots skip owned drills except the maintenance one', () => {
  for (let seed = 1; seed < 40; seed++) {
    const l = buildLesson(en, seededRng(seed), {}, { history: [], due: [], focus: null, owned: ['prep', 'debate', 'rapid'], maintain: 'debate' });
    assert.ok(!l.some((p) => p.drill === 'prep' || p.drill === 'rapid'), `seed ${seed}: ${l.map((p) => p.drill)}`);
  }
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installFakeDom } from './fixtures/fakedom.js';
import { translator } from '../src/i18n.js';
import { defaultState } from '../src/core/storage.js';
import { MODULES } from '../src/content/courses/index.js';

installFakeDom();
const { medalSeal, titleTag, moduleEndModel, metaSeal } = await import('../src/ui/flairui.js');
const t = translator('nl');
const META = MODULES.find((m) => m.id === 'eng.flow');
const TODAY = '2026-11-02';
const svgOf = (el) => el.querySelector('.seal-wrap').innerHTML;
const engWith = (extra) => ({ ...defaultState(), courses: { ...defaultState().courses, eng: { ...defaultState().courses.eng, ...extra } } });

test('medalSeal: bronze one ring, silver two rings, gold a filled disc with a check; the tier word is always present', () => {
  const b = medalSeal(t, 'bronze');
  assert.equal((svgOf(b).match(/<circle class="seal-ring/g) || []).length, 1);
  assert.doesNotMatch(svgOf(b), /seal-fill/);
  assert.equal(b.querySelector('.medal-word').textContent, 'Brons');
  const s = medalSeal(t, 'silver');
  assert.equal((svgOf(s).match(/<circle class="seal-ring/g) || []).length, 2);
  assert.equal(s.querySelector('.medal-word').textContent, 'Zilver');
  const g = medalSeal(t, 'gold');
  assert.match(svgOf(g), /seal-fill/);
  assert.match(svgOf(g), /seal-check/);
  assert.equal(g.querySelector('.medal-word').textContent, 'Goud');
  const none = medalSeal(t, null);
  assert.equal(none.querySelector('.medal-word').textContent, 'Medaille: nog niet');
  for (const el of [b, s, g, none]) assert.doesNotMatch(svgOf(el), /#[0-9a-f]{3,6}\b/i);
  assert.ok(medalSeal(t, 'gold', 56).classList.contains('medal-56'));
});

test('titleTag: the rank name, nothing at rank 0', () => {
  assert.equal(titleTag(t, 0), null);
  assert.equal(titleTag(t, 2).textContent, 'Gezel');
  assert.equal(titleTag(translator('en'), 3).textContent, 'Craftsperson');
});

test('module end: the medal seal or medalNone, and the check flag once bronze', () => {
  assert.deepEqual(moduleEndModel(defaultState(), META, TODAY), { tier: null, check: null });
  const all = Object.fromEntries(META.lessons.map((id) => [id, { passed: 1 }]));
  assert.deepEqual(moduleEndModel(engWith({ lessons: all, medals: { 'eng.flow': { tier: 'bronze', ts: 1 } } }), META, TODAY), { tier: 'bronze', check: 'open' });
  const tried = engWith({ lessons: all, medals: { 'eng.flow': { tier: 'bronze', ts: 1 } }, checks: { 'eng.flow': { last: TODAY, best: 7, total: 10, perfect: null } } });
  assert.deepEqual(moduleEndModel(tried, META, TODAY), { tier: 'bronze', check: 'tomorrow' });
  const gold = engWith({ lessons: all, medals: { 'eng.flow': { tier: 'gold', ts: 1 } } });
  assert.equal(moduleEndModel(gold, META, TODAY).tier, 'gold');
});

test('module row meta shows the seal only when a medal exists', () => {
  assert.equal(metaSeal(t, defaultState(), META), null);
  const all = Object.fromEntries(META.lessons.map((id) => [id, { passed: 1 }]));
  assert.equal(metaSeal(t, engWith({ lessons: all }), META), null, 'earned by the rules but not stored yet: nothing');
  const el = metaSeal(t, engWith({ lessons: all, medals: { 'eng.flow': { tier: 'silver', ts: 1 } } }), META);
  assert.ok(el.classList.contains('medal-silver'));
  assert.ok(el.classList.contains('medal-24'));
});

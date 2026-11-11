import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installFakeDom } from './fixtures/fakedom.js';
import { translator } from '../src/i18n.js';
import { defaultState } from '../src/core/storage.js';
import { MODULES } from '../src/content/courses/index.js';

installFakeDom();
const { pathModel, topicPath } = await import('../src/ui/pathmap.js');
const META = MODULES.find((m) => m.id === 'eng.flow');
const t = translator('nl');
const withPassed = (ids, reviews = {}) => ({ ...defaultState(), courseReviews: reviews, courses: { ...defaultState().courses, eng: { ...defaultState().courses.eng, lessons: Object.fromEntries(ids.map((id, i) => [id, { passed: 10 + i }])) } } });

test('pathModel: passed and owned stops, one next stop, hidden levels counted for the stub', () => {
  const owned = Object.fromEntries([0, 1, 2, 3].map((i) => [`nl|eng.flow.takt#r${i}`, { box: 4, due: '2027-01-01' }]));
  const m = pathModel(withPassed(['eng.flow.takt', 'eng.flow.balance'], owned), META, 'nl');
  const takt = m.topics[0];
  assert.deepEqual(takt.stops.map((s) => s.state), ['owned', 'passed', 'todo']);
  assert.equal(takt.hidden, 1, 'Expert is not visible yet');
  assert.equal(takt.done, false);
  assert.equal(m.topics.flatMap((x) => x.stops).filter((s) => s.next).length, 1);
  assert.equal(takt.stops[2].next, true, 'the open level of the topic he works in');
  assert.deepEqual(m.topics[1].stops.map((s) => s.state), ['todo']);
  assert.equal(m.topics[1].hidden, 3);
});

test('pathModel: a finished topic has no stub and a done flag', () => {
  const m = pathModel(withPassed(META.topics[0].levels), META, 'nl');
  assert.equal(m.topics[0].done, true);
  assert.equal(m.topics[0].hidden, 0);
  assert.equal(m.topics[0].stops.length, 4);
  assert.ok(m.topics[0].stops.every((s) => !s.next));
});

test('topicPath: stops are buttons with i18n aria-labels; the stub is not focusable and carries pathMore', () => {
  const m = pathModel(withPassed(['eng.flow.takt']), META, 'nl');
  const opened = [];
  const el = topicPath(t, 'Takt en lijnbalans', m.topics[0], (id) => opened.push(id));
  const stops = el.querySelectorAll('button.path-stop');
  assert.equal(stops.length, 2);
  assert.equal(stops[0].getAttribute('aria-label'), 'Takt en lijnbalans, Basis: behaald');
  assert.equal(stops[1].getAttribute('aria-label'), 'Takt en lijnbalans, Werkkennis: nog te doen (Volgende)');
  stops[1].click();
  assert.deepEqual(opened, ['eng.flow.balance']);
  const stub = el.querySelector('.path-stub');
  assert.ok(stub);
  assert.equal(stub.tagName, 'SPAN');
  assert.equal(stub.getAttribute('tabindex'), null);
  assert.equal(stub.getAttribute('aria-label'), t('pathMore', 2));
  assert.equal(stub.textContent, '+2');
  assert.equal(el.querySelector('.path-flag'), null);
});

test('topicPath: the next stop is outlined, never a primary button', () => {
  const m = pathModel(withPassed(['eng.flow.takt']), META, 'nl');
  const el = topicPath(t, 'Takt', m.topics[0], () => {});
  const next = el.querySelector('.path-stop.s-next');
  assert.ok(next);
  assert.ok(!next.classList.contains('btn-primary'));
  assert.equal(el.querySelectorAll('.btn-primary').length, 0);
  assert.equal(el.querySelector('.path-next').textContent, 'Volgende');
  const done = topicPath(t, 'Takt', pathModel(withPassed(META.topics[0].levels), META, 'nl').topics[0], () => {});
  assert.equal(done.querySelector('.path-stub'), null);
  assert.equal(done.querySelector('.path-flag').getAttribute('aria-label'), t('pathTopicDone'));
});

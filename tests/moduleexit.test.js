import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exitTarget, originOf, nextParams } from '../src/core/moduleexit.js';
import { MODULES } from '../src/content/courses/index.js';

const m = MODULES.find((x) => x.id === 'eng.machining');

test('exitTarget: opened from the module screen returns to it', () => {
  assert.deepEqual(exitTarget({ subject: 'eng', moduleId: m.id, lessonId: 'x', from: 'module' }), ['module', { subject: 'eng', moduleId: m.id }]);
});

test('exitTarget: opened from elsewhere goes home as today', () => {
  assert.deepEqual(exitTarget({ subject: 'eng', moduleId: m.id, lessonId: 'x' }), ['home']);
  assert.deepEqual(exitTarget({ subject: 'eng', moduleId: m.id, from: 'today' }), ['home']);
  assert.deepEqual(exitTarget(undefined), ['home']);
});

test('exitTarget: from module with a missing or unknown moduleId falls back to home', () => {
  assert.deepEqual(exitTarget({ subject: 'eng', from: 'module' }), ['home']);
  assert.deepEqual(exitTarget({ subject: 'eng', moduleId: 'nope.nope', from: 'module' }), ['home']);
});

test('exitTarget: a missing subject comes from the module', () => {
  assert.deepEqual(exitTarget({ moduleId: m.id, from: 'module' }), ['module', { subject: m.subject, moduleId: m.id }]);
});

test('the next-level button keeps the origin, and only a module origin', () => {
  const from = { subject: 'eng', moduleId: m.id, lessonId: 'a', from: 'module' };
  const next = nextParams(from, { subject: 'eng', moduleId: m.id, lessonId: 'b' });
  assert.deepEqual(next, { subject: 'eng', moduleId: m.id, lessonId: 'b', from: 'module' });
  assert.deepEqual(exitTarget(next), ['module', { subject: 'eng', moduleId: m.id }]);
  assert.deepEqual(nextParams({ lessonId: 'a' }, { lessonId: 'b' }), { lessonId: 'b' });
  assert.deepEqual(originOf({ from: 'today' }), {});
});

const pm = MODULES.find((x) => x.id === 'pm.plan');

test('exitTarget: a known module of another subject than params.subject returns to it under its own subject', () => {
  assert.deepEqual(exitTarget({ subject: 'eng', moduleId: pm.id, lessonId: 'x', from: 'module' }), ['module', { subject: 'pm', moduleId: pm.id }]);
});

test('exitTarget: from module survives two next-level hops and the situation after them', () => {
  const a = { subject: 'eng', moduleId: m.id, lessonId: m.lessons[0], from: 'module' };
  const b = nextParams(a, { subject: 'eng', moduleId: m.id, lessonId: m.lessons[1] });
  const c = nextParams(b, { subject: 'eng', moduleId: m.id, lessonId: m.lessons[2] });
  assert.equal(c.lessonId, m.lessons[2]);
  assert.deepEqual(exitTarget(c), ['module', { subject: 'eng', moduleId: m.id }]);
  const sit = nextParams(c, { subject: 'eng', moduleId: m.id, lessonId: c.lessonId });
  assert.deepEqual(exitTarget(sit), ['module', { subject: 'eng', moduleId: m.id }]);
});

test('a situation opened from the done card of a Today-card lesson still goes home', () => {
  const today = { subject: 'eng', moduleId: m.id, lessonId: m.lessons[0] };
  const sit = nextParams(today, { subject: 'eng', moduleId: m.id, lessonId: m.lessons[0] });
  assert.equal('from' in sit, false, 'no from key at all');
  assert.deepEqual(exitTarget(sit), ['home']);
});

test('nextParams does not change what it was given', () => {
  const a = Object.freeze({ subject: 'eng', moduleId: m.id, lessonId: 'a', from: 'module' });
  const extra = Object.freeze({ lessonId: 'b' });
  nextParams(a, extra);
  assert.deepEqual(extra, { lessonId: 'b' });
});

test('exitTarget: a from that only looks like module, or null params, goes home', () => {
  assert.deepEqual(exitTarget({ moduleId: m.id, from: 'Module' }), ['home']);
  assert.deepEqual(exitTarget({ moduleId: m.id, from: true }), ['home']);
  assert.deepEqual(exitTarget(null), ['home']);
  assert.deepEqual(nextParams(null, { lessonId: 'b' }), { lessonId: 'b' });
});

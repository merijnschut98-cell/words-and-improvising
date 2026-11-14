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

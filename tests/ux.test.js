import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessonSteps } from '../src/core/course.js';

test('lesson steps: four labelled steps, the current one marked; a lesson without a guess starts at Read', () => {
  assert.deepEqual(lessonSteps(['pre', 'teach', 'example', 'quiz'], 'teach'), [
    { id: 'guess', state: 'done' }, { id: 'read', state: 'current' }, { id: 'example', state: 'todo' }, { id: 'check', state: 'todo' },
  ]);
  assert.deepEqual(lessonSteps(['teach', 'example', 'quiz'], 'quiz').map((s) => s.id), ['read', 'example', 'check']);
  assert.equal(lessonSteps(['teach', 'example', 'quiz'], 'quiz')[2].state, 'current');
  assert.ok(lessonSteps(['pre', 'teach', 'example', 'quiz'], 'done').every((s) => s.state === 'done'));
});

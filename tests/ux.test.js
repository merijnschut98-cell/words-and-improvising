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

test('figure frame follows the app theme and language', async () => {
  const { figureTheme, figureSrc } = await import('../src/ui/figure.js');
  assert.equal(figureTheme('dark', false), 'dark');
  assert.equal(figureTheme('light', true), 'light');
  assert.equal(figureTheme('auto', true), 'dark');
  assert.equal(figureTheme(undefined, false), 'light');
  assert.equal(figureSrc('eng.flow.line', 'dark', 'en'), 'src/content/courses/figures/eng.flow.line.html?theme=dark&lang=en');
  assert.match(figureSrc('eng.flow.line', 'light', 'nl'), /lang=nl$/);
});

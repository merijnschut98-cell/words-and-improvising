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

// Start screen and the speaking home's sections (pure parts).
import { startCards, HOME_SECTIONS, MORE_GROUPS, homeSubject } from '../src/core/today.js';
import { defaultState, load, KEY } from '../src/core/storage.js';
import nl from '../src/content/prompts.nl.js';

const TODAY = '2026-11-02';
const NOW = new Date(2026, 10, 2, 9).getTime();

test('start screen: one card per subject in a fixed order, each with its next step and a reason', () => {
  const cards = startCards(defaultState(), TODAY, nl, 'nl', NOW);
  assert.deepEqual(cards.map((c) => c.subject), ['speak', 'eng', 'pm']);
  assert.equal(cards[0].reason, 'fresh');
  assert.ok(cards[0].drill, 'speaking card names a drill');
  assert.equal(cards[1].reason, 'lesson');
  assert.match(cards[1].moduleId, /^eng\./);
  assert.ok(cards[1].lessonId);
  assert.equal(cards[2].reason, 'lesson');
  assert.match(cards[2].moduleId, /^pm\./);
  assert.ok(cards.every((c) => c.done === false));
});

test('start screen: exactly one card is suggested, the first subject not yet practised today', () => {
  const fresh = startCards(defaultState(), TODAY, nl, 'nl', NOW);
  assert.deepEqual(fresh.map((c) => c.suggested), [true, false, false]);
  const spoke = { ...defaultState(), history: [{ ts: NOW - 3600000, drill: 'minute', rating: 3, lang: 'nl', promptId: 'x:y', metrics: { words: 50, fillerRate: 2 } }] };
  const a = startCards(spoke, TODAY, nl, 'nl', NOW);
  assert.deepEqual(a.map((c) => [c.done, c.suggested]), [[true, false], [false, true], [false, false]]);
  const all = { ...spoke, courses: { eng: { lessons: {}, sessions: [{ day: TODAY, kind: 'lesson', ts: NOW }] }, pm: { lessons: {}, sessions: [{ day: TODAY, kind: 'lesson', ts: NOW }] } } };
  const b = startCards(all, TODAY, nl, 'nl', NOW);
  assert.ok(b.every((c) => c.done));
  assert.equal(b.filter((c) => c.suggested).length, 1, 'still one suggestion when everything is done');
  assert.equal(b[0].suggested, true);
});

test('start screen: an event within two days carries its text as the reason', () => {
  const s = { ...defaultState(), events: [{ id: 'e1', type: 'client', date: '2026-11-03', text: 'Kick-off', reflection: null }] };
  const [speak] = startCards(s, TODAY, nl, 'nl', NOW);
  assert.equal(speak.reason, 'event');
  assert.equal(speak.eventText, 'Kick-off');
});

test('home subject: absent or "start" means the start screen; a stored subject survives a reload', () => {
  assert.equal(homeSubject({}), 'start');
  assert.equal(homeSubject({ subject: 'start' }), 'start');
  assert.equal(homeSubject({ subject: 'eng' }), 'eng');
  assert.equal(homeSubject(undefined), 'start');
  const backend = (v) => ({ getItem: (k) => (k === KEY ? JSON.stringify(v) : null), setItem() {} });
  assert.equal(load(backend({ ...defaultState(), ui: { subject: 'start', moreOpen: true } })).ui.subject, 'start');
  assert.equal(load(backend({ ...defaultState(), ui: { subject: 'start', moreOpen: true } })).ui.moreOpen, true);
  assert.equal('moreOpen' in load(backend({ ...defaultState(), ui: { moreOpen: 'yes' } })).ui, false);
});

test('speaking home: today, one secondary card, then one "More practice" holding everything else, grouped', () => {
  assert.deepEqual(HOME_SECTIONS, ['today', 'secondary', 'more']);
  const items = MORE_GROUPS.flatMap((g) => g.items);
  const expected = ['drills', 'quick', 'reviews', 'boss', 'targeted', 'conversation', 'realweek', 'quests', 'finder', 'programme'];
  assert.deepEqual([...items].sort(), [...expected].sort());
  assert.equal(new Set(items).size, items.length, 'each item in exactly one group');
  assert.ok(MORE_GROUPS.every((g) => g.id && g.items.length));
});

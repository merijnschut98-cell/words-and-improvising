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

test('a figure is shown only when its page answers ok (an iframe gives no error on a 404)', async () => {
  const { figureAvailable } = await import('../src/ui/figure.js');
  const calls = [];
  const fake = (res) => (url, opts) => { calls.push([url, opts && opts.method]); return res; };
  assert.equal(await figureAvailable('a.html?theme=dark', fake(Promise.resolve({ ok: true }))), true);
  assert.deepEqual(calls[0], ['a.html?theme=dark', 'HEAD']);
  assert.equal(await figureAvailable('a.html', fake(Promise.resolve({ ok: false, status: 404 }))), false);
  assert.equal(await figureAvailable('a.html', fake(Promise.reject(new Error('offline')))), false);
  assert.equal(await figureAvailable('a.html', () => { throw new Error('no fetch'); }), false);
});

test('a start button that fails comes back enabled; one that navigates stays disabled', async () => {
  const { enableOnFail } = await import('../src/ui/dom.js');
  const a = { disabled: true };
  await enableOnFail(a, Promise.resolve(false));
  assert.equal(a.disabled, false);
  const b = { disabled: true };
  await enableOnFail(b, Promise.reject(new Error('x')));
  assert.equal(b.disabled, false);
  const c = { disabled: true };
  await enableOnFail(c, Promise.resolve(true));
  assert.equal(c.disabled, true);
  const d = { disabled: true };
  await enableOnFail(d, undefined);
  assert.equal(d.disabled, true);
});

// Start screen and the speaking home's sections (pure parts).
import { startCards, homeSubject } from '../src/core/today.js';
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

test('stored drill groups load cleaned; a non-list is dropped', () => {
  const backend = (v) => ({ getItem: (k) => (k === KEY ? JSON.stringify(v) : null), setItem() {} });
  assert.deepEqual(load(backend({ ...defaultState(), ui: { drillGroups: ['pressure', 'x', 'basics'] } })).ui.drillGroups, ['basics', 'pressure']);
  assert.equal('drillGroups' in load(backend({ ...defaultState(), ui: { drillGroups: 'basics' } })).ui, false);
});

test('a login-link return is recognised, including an expired link', async () => {
  const { authReturn } = await import('../src/core/syncer.js');
  assert.equal(authReturn('#access_token=abc&type=magiclink'), 'token');
  assert.equal(authReturn('#error=access_denied&error_code=otp_expired&error_description=x'), 'error');
  assert.equal(authReturn(''), null);
  assert.equal(authReturn('#something'), null);
});

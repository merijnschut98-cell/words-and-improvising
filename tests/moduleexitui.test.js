// Task 6b, the wiring: every exit of the lesson, check and situation screens
// that the fake DOM can reach goes back to the module screen when the screen was
// opened from it, and home (as before) when it was not.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installFakeDom } from './fixtures/fakedom.js';
import { defaultState } from '../src/core/storage.js';
import { translator } from '../src/i18n.js';

installFakeDom();
const { renderLesson } = await import('../src/ui/lesson.js');
const { renderSituation } = await import('../src/ui/situation.js');
const { renderCheck } = await import('../src/ui/modulecheck.js');
const { renderModule } = await import('../src/ui/modulescreen.js');

const offline = () => Promise.reject(new Error('offline'));
function fakeApp(over = {}) {
  const calls = [];
  const app = {
    t: translator('nl'), lang: 'nl', state: defaultState(), navSeq: 1, today: () => '2026-11-14',
    go: (screen, params) => calls.push([screen, params]),
    setSubject: (id) => calls.push(['setSubject', id]),
    setState(s) { this.state = s; },
    openModule: offline, openModuleTerms: offline,
    ...over,
  };
  return { app, calls };
}
const tick = () => new Promise((r) => setTimeout(r, 0));
const close = (root) => root.querySelector('header .icon-btn');
const ghost = (root) => root.querySelectorAll('.btn-ghost').at(-1);
const fromModule = { subject: 'eng', moduleId: 'eng.flow', lessonId: 'eng.flow.takt', from: 'module' };
const plain = { subject: 'eng', moduleId: 'eng.flow', lessonId: 'eng.flow.takt' };
const MOD = ['module', { subject: 'eng', moduleId: 'eng.flow' }];

test('lesson: close and the load-error back return to the module; retry keeps the origin', async () => {
  const { app, calls } = fakeApp();
  const root = document.createElement('div');
  renderLesson(app, fromModule, root);
  await tick();
  close(root).click();
  assert.deepEqual(calls.at(-1), MOD);
  ghost(root).click();
  assert.deepEqual(calls.at(-1), MOD);
  root.querySelector('.load-error .btn-primary').click();
  assert.deepEqual(calls.at(-1), ['lesson', fromModule]);
});

test('lesson without from (Today card, due, a deep link): close, back and retry as before', async () => {
  const { app, calls } = fakeApp();
  const root = document.createElement('div');
  renderLesson(app, plain, root);
  await tick();
  close(root).click();
  ghost(root).click();
  root.querySelector('.load-error .btn-primary').click();
  assert.deepEqual(calls, [['home', undefined], ['home', undefined], ['lesson', plain]]);
});

test('lesson from module with a removed module id goes home', async () => {
  const { app, calls } = fakeApp();
  const root = document.createElement('div');
  renderLesson(app, { ...fromModule, moduleId: 'eng.gone' }, root);
  await tick();
  close(root).click();
  assert.deepEqual(calls.at(-1), ['home', undefined]);
});

test('situation: close returns to the module; retry keeps the origin; without from it goes home', async () => {
  const a = fakeApp();
  const root = document.createElement('div');
  renderSituation(a.app, fromModule, root);
  await tick();
  close(root).click();
  assert.deepEqual(a.calls.at(-1), MOD);
  root.querySelector('.load-error .btn-primary').click();
  assert.deepEqual(a.calls.at(-1), ['situation', fromModule]);
  const b = fakeApp();
  const root2 = document.createElement('div');
  renderSituation(b.app, plain, root2);
  await tick();
  close(root2).click();
  root2.querySelector('.load-error .btn-primary').click();
  assert.deepEqual(b.calls, [['home', undefined], ['situation', plain]]);
});

test('check (locked): close and back return to the module; without from both go home', () => {
  const a = fakeApp();
  const root = document.createElement('div');
  renderCheck(a.app, { subject: 'eng', moduleId: 'eng.flow', from: 'module' }, root);
  close(root).click();
  ghost(root).click();
  assert.deepEqual(a.calls, [MOD, MOD]);
  const b = fakeApp();
  const root2 = document.createElement('div');
  renderCheck(b.app, { subject: 'eng', moduleId: 'eng.flow' }, root2);
  close(root2).click();
  ghost(root2).click();
  assert.deepEqual(b.calls, [['home', undefined], ['home', undefined]]);
});

test('module screen: continue, every path stop and the check entry pass from: module', () => {
  const meta = { subject: 'pm', id: 'pm.intake' };
  const base = defaultState();
  const { app, calls } = fakeApp({ state: { ...base, courses: { ...base.courses, pm: { ...base.courses.pm, medals: { 'pm.intake': { tier: 'bronze', ts: 1 } } } } } });
  const root = document.createElement('div');
  renderModule(app, { subject: 'pm', moduleId: meta.id }, root);
  root.querySelector('.module-continue').click();
  const opened = [...root.querySelectorAll('.topics button')];
  assert.ok(opened.length > 0, 'at least one path stop');
  for (const b of opened) b.click();
  const check = root.querySelector('.check-btn');
  assert.ok(check, 'the check entry shows with bronze');
  check.click();
  assert.ok(calls.length >= 3);
  for (const [screen, params] of calls) {
    assert.ok(screen === 'lesson' || screen === 'check', screen);
    assert.equal(params.from, 'module');
    assert.equal(params.moduleId, meta.id);
  }
  assert.equal(calls.at(-1)[0], 'check');
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installFakeDom } from './fixtures/fakedom.js';
import { defaultState } from '../src/core/storage.js';
import { MODULES } from '../src/content/courses/index.js';
import { introSeen, markIntroSeen } from '../src/core/course.js';
import { STRINGS } from '../src/i18n.js';

installFakeDom();
const { moduleModel, moduleFor } = await import('../src/ui/modulescreen.js');
const byId = (id) => MODULES.find((m) => m.id === id);
const withIntro = { ...MODULES.find((m) => m.id === 'eng.machining'), intro: 'eng.machining.intro' };
const noIntro = MODULES.find((m) => m.id === 'pm.intake');

test('moduleModel: a module with an intro reports it and whether it was seen', () => {
  const s = defaultState();
  const m = moduleModel(s, withIntro, 'nl');
  assert.equal(m.hasIntro, true);
  assert.equal(m.introSeen, false);
  const after = moduleModel(markIntroSeen(s, withIntro.id), withIntro, 'nl');
  assert.equal(after.introSeen, true);
  assert.equal(after.hasIntro, true);
});

test('moduleModel: a module without an intro has hasIntro false and still lists its topics', () => {
  const m = moduleModel(defaultState(), noIntro, 'nl');
  assert.equal(m.hasIntro, false);
  assert.equal(m.introSeen, false);
  assert.equal(m.topics.length, noIntro.topics.length);
  assert.ok(m.next);
});

test('moduleModel: field for a pm module, null for an eng module; titles in the asked language', () => {
  const pm = moduleModel(defaultState(), byId('pm.plan'), 'nl');
  assert.equal(pm.field.id, 'pm.field.lifecycle');
  assert.equal(moduleModel(defaultState(), byId('eng.machining'), 'nl').field, null);
  assert.equal(pm.title, byId('pm.plan').title.nl);
  assert.equal(pm.titleEn, byId('pm.plan').title.en);
  assert.equal(pm.blurb, byId('pm.plan').blurb.nl);
  const en = moduleModel(defaultState(), byId('pm.plan'), 'en');
  assert.equal(en.titleEn, null);
  assert.equal(en.title, byId('pm.plan').title.en);
  assert.equal(en.blurb, byId('pm.plan').blurb.en);
});

test('moduleModel: no English line when both titles are the same', () => {
  const same = { ...byId('pm.intake'), title: { en: 'Intake', nl: 'Intake' } };
  assert.equal(moduleModel(defaultState(), same, 'nl').titleEn, null);
});

test('moduleFor: a known id gives the module, an unknown id null (the screen then goes home)', () => {
  assert.equal(moduleFor('pm.intake').id, 'pm.intake');
  assert.equal(moduleFor('pm.nope'), null);
  assert.equal(moduleFor(undefined), null);
  assert.equal(moduleFor(null), null);
});

test('markIntroSeen: idempotent, returns a new state, keeps the other course state', () => {
  const base = defaultState();
  const s0 = { ...base, courses: { ...base.courses, pm: { ...base.courses.pm, lessons: { 'pm.intake.ask': { passed: 5 } }, sessions: [{ ts: 1, day: 'd', kind: 'lesson' }], medals: { 'pm.intake': { tier: 1 } } } } };
  const s1 = markIntroSeen(s0, 'pm.intake');
  assert.notEqual(s1, s0);
  assert.equal(introSeen(s0, 'pm.intake'), false, 'the old state is untouched');
  assert.equal(introSeen(s1, 'pm.intake'), true);
  assert.deepEqual(s1.courses.pm.lessons, s0.courses.pm.lessons);
  assert.deepEqual(s1.courses.pm.sessions, s0.courses.pm.sessions);
  assert.deepEqual(s1.courses.pm.medals, s0.courses.pm.medals);
  assert.deepEqual(s1.courses.eng, s0.courses.eng);
  assert.deepEqual(markIntroSeen(s1, 'pm.intake').courses.pm.seenIntros, ['pm.intake']);
  assert.equal(introSeen(s1, 'pm.plan'), false);
});

test('markIntroSeen: caps at 200, newest kept; a state without seenIntros works', () => {
  const s0 = defaultState();
  delete s0.courses.pm.seenIntros;
  assert.equal(introSeen(s0, 'pm.intake'), false);
  let s = s0;
  for (let i = 0; i < 205; i++) s = markIntroSeen(s, `pm.m${i}`);
  assert.equal(s.courses.pm.seenIntros.length, 200);
  assert.equal(introSeen(s, 'pm.m204'), true);
  assert.equal(introSeen(s, 'pm.m0'), false);
});

test('the module screen has words in both languages', () => {
  for (const lang of ['en', 'nl']) for (const k of ['moduleIntro', 'moduleContinue', 'moduleContinueAt', 'backToCourse']) assert.ok(STRINGS[lang][k], `${lang}: ${k}`);
});

// ---- renderModule: navigation (review) ----
const { renderModule } = await import('../src/ui/modulescreen.js');
const { translator } = await import('../src/i18n.js');
function fakeApp(state = defaultState()) {
  const calls = [];
  const app = {
    t: translator('nl'), lang: 'nl', state, today: () => '2026-11-14',
    go: (screen, params) => calls.push(['go', screen, params]),
    setSubject: (id, screen) => calls.push(['setSubject', id, screen]),
    setState(s) { this.state = s; },
  };
  return { app, calls };
}
const fakeRoot = () => document.createElement('div');

test('renderModule: the back control goes to the module\'s own subject, whatever subject the params name', () => {
  const { app, calls } = fakeApp();
  const root = fakeRoot();
  renderModule(app, { subject: 'eng', moduleId: 'pm.intake' }, root);
  root.querySelector('.lesson-back').click();
  assert.deepEqual(calls.at(-1).slice(0, 2), ['setSubject', 'pm']);
});

test('renderModule: an unknown module id opens the course home of the named subject, or home without one', () => {
  const a = fakeApp();
  renderModule(a.app, { subject: 'pm', moduleId: 'pm.gone' }, fakeRoot());
  assert.deepEqual(a.calls.map((c) => c.slice(0, 2)), [['setSubject', 'pm']]);
  const b = fakeApp();
  renderModule(b.app, { moduleId: 'pm.gone' }, fakeRoot());
  assert.deepEqual(b.calls.map((c) => c.slice(0, 2)), [['go', 'home']]);
  const c = fakeApp();
  renderModule(c.app, { subject: 'cooking', moduleId: 'x' }, fakeRoot());
  assert.deepEqual(c.calls.map((x) => x.slice(0, 2)), [['go', 'home']]);
});

test('renderModule: one filled button, and a cleanup that closes the film when he leaves', () => {
  const { app } = fakeApp();
  const root = fakeRoot();
  const cleanup = renderModule(app, { subject: 'pm', moduleId: 'pm.intake' }, root);
  assert.equal(root.querySelectorAll('.btn-primary').length, 1);
  assert.equal(typeof cleanup, 'function', 'like the lesson screen: leaving closes an open film');
  cleanup();
});

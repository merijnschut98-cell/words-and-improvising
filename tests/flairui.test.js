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

// ---- Daily goal ring (task 17) ----
const { goalRing, weekRings, goalPicker, startHead } = await import('../src/ui/flairui.js');
const arcOf = (el) => Number((el.querySelector('.gring-wrap').innerHTML.match(/class="ring-arc[^"]*"[^>]*stroke-dashoffset="([\d.]+)"/) || [])[1]);

test('goalRing: role img with goalRing label; arc share = xp/goal capped at 1; check shown when done', () => {
  const r = goalRing(t, { xp: 18, goal: 30, done: false });
  assert.equal(r.getAttribute('role'), 'img');
  assert.equal(r.getAttribute('aria-label'), 'Dagdoel: 18 van 30 XP');
  assert.equal(r.querySelector('.goal-num').textContent, '18/30');
  assert.equal(arcOf(r), 40, '100 - 60');
  assert.doesNotMatch(r.querySelector('.gring-wrap').innerHTML, /ring-check/);
  const full = goalRing(t, { xp: 30, goal: 30, done: true });
  assert.equal(arcOf(full), 0);
  assert.match(full.querySelector('.gring-wrap').innerHTML, /ring-check/);
  assert.equal(full.querySelector('.goal-num').textContent, '30/30');
  const grow = goalRing(t, { xp: 30, goal: 30, done: true }, { from: 10 });
  assert.match(grow.querySelector('.gring-wrap').innerHTML, /ring-arc grow/);
  assert.match(grow.querySelector('.gring-wrap').innerHTML, /--draw-from:66.67/, 'animates from the old value; the end state is the default');
});

test('start screen shows the ring next to the title and keeps streak and level in start-meta', () => {
  const state = { ...defaultState(), xp: 40, xpDays: { [TODAY]: 18 }, streak: { count: 3, lastDay: TODAY } };
  const app = { t, lang: 'nl', state, today: () => TODAY };
  const head = startHead(app);
  assert.equal(head.querySelector('h1.start-title').textContent, t('startTitle'));
  assert.equal(head.querySelector('.goal-ring').getAttribute('aria-label'), 'Dagdoel: 18 van 30 XP');
  assert.match(head.querySelector('.start-flame').textContent, /3/, 'the streak flame stays, small, beside the ring (Q1)');
  const meta = head.querySelector('.start-meta');
  assert.equal(meta.querySelector('.ico-flame'), null, 'the flame moved beside the ring, once');
  assert.match(meta.textContent, /Level 1 · 40\/100 XP/);
});

test('progress shows seven day rings with one label each', () => {
  const state = { ...defaultState(), xpDays: { [TODAY]: 30, '2026-11-01': 10 }, dailyGoal: { xp: 20, ts: 1 } };
  const row = weekRings(t, state, TODAY, 'nl');
  const rings = row.querySelectorAll('.goal-ring');
  assert.equal(rings.length, 7);
  assert.ok(rings.every((r) => /van 20 XP$/.test(r.getAttribute('aria-label'))));
  assert.match(rings[6].getAttribute('aria-label'), /20 van 20 XP/);
  assert.match(rings[5].getAttribute('aria-label'), /10 van 20 XP/);
  assert.match(rings[0].getAttribute('aria-label'), /0 van 20 XP/);
});

test('settings goal options write dailyGoal with a ts', () => {
  let saved = null;
  const app = { t, state: defaultState(), setState(s) { saved = s; }, go() {} };
  const picker = goalPicker(app, () => 777);
  const opts = picker.querySelectorAll('button');
  assert.deepEqual(opts.map((b) => b.textContent), ['Licht (20 XP)', 'Normaal (30 XP)', 'Stevig (50 XP)']);
  assert.equal(opts[1].getAttribute('aria-pressed'), 'true');
  opts[2].click();
  assert.deepEqual(saved.dailyGoal, { xp: 50, ts: 777 });
});

// ---- Titles in the interface (task 18) ----
const { subjectTitle, titleNextLine, medalsLine } = await import('../src/ui/flairui.js');

test('start card shows the subject title after the name, nothing before the first lesson', () => {
  assert.equal(subjectTitle(t, defaultState(), 'eng'), null);
  const el = subjectTitle(t, { ...defaultState(), titles: { eng: { rank: 2, ts: 1 } } }, 'eng');
  assert.equal(el.textContent, 'Gezel');
  assert.ok(el.classList.contains('title-tag'));
  assert.equal(subjectTitle(t, { ...defaultState(), titles: { eng: { rank: 2, ts: 1 } } }, 'pm'), null);
});

test('progress shows titleNext with the missing levels and medals', () => {
  const NOW = new Date(2026, 10, 2, 9).getTime();
  const one = engWith({ lessons: { 'eng.flow.takt': { passed: 1 } } });
  const line = titleNextLine(t, { ...one, titles: { eng: { rank: 1, ts: 1 } } }, 'eng', NOW);
  assert.match(line, /^Nog \d+ niveaus en 1 bronzen medaille tot Gezel$/);
  assert.equal(titleNextLine(t, { ...defaultState(), titles: { eng: { rank: 4, ts: 1 } } }, 'eng', NOW), t('titleTop'));
  assert.match(titleNextLine(translator('en'), { ...one, titles: { eng: { rank: 1, ts: 1 } } }, 'eng', NOW), /more levels and 1 bronze medal to Journeyman$/);
  assert.equal(titleNextLine(t, defaultState(), 'speak', NOW), t('titleNextSpeak', 'Leerling'));
  const medals = engWith({ medals: { 'eng.flow': { tier: 'gold', ts: 1 }, 'eng.quality': { tier: 'bronze', ts: 1 } } });
  assert.equal(medalsLine(t, medals, 'eng'), '1 brons · 0 zilver · 1 goud');
});

// ---- The celebration (task 19) ----
const { celebration } = await import('../src/ui/flairui.js');
const celebApp = (over = {}) => ({ t, lang: 'nl', today: () => TODAY, state: { ...defaultState(), xpDays: { [TODAY]: 40 }, settings: { ...defaultState().settings, ...(over.settings || {}) } }, ...over.app });
const mark = () => { const m = document.createElement('p'); m.className = 'done-mark'; return m; };
const wrap = (nodes) => { const d = document.createElement('div'); d.append(...nodes.filter(Boolean)); return d; };

test('celebration shows one big moment and lists the others as quiet lines', () => {
  const res = { xp: 20, goalReached: true, medals: [{ subject: 'eng', moduleId: 'eng.flow', tier: 'bronze' }], titles: [{ subject: 'eng', rank: 2 }] };
  const c = celebration(celebApp(), res, { mark: mark(), play: () => {} });
  const el = wrap(c.nodes);
  assert.equal(el.querySelectorAll('.celebrate-big').length, 1);
  assert.ok(el.querySelector('.celebrate-big.celebrate-title'));
  assert.match(el.querySelector('.celebrate-big').textContent, /Nieuwe titel: Gezel/);
  const quiet = el.querySelectorAll('.quiet-line').map((x) => x.textContent);
  assert.deepEqual(quiet, ['Brons voor Capaciteit en flow', 'Dagdoel gehaald']);
  const medal = wrap(celebration(celebApp(), { xp: 0, medals: [{ subject: 'eng', moduleId: 'eng.flow', tier: 'silver' }], titles: [] }, { mark: mark(), play: () => {} }).nodes);
  assert.ok(medal.querySelector('.celebrate-big .medal-silver.medal-56'));
  assert.equal(medal.querySelectorAll('.quiet-line').length, 0);
});

test('the end state is the rendered default (segments lit, ring at the new value) so reduced motion loses nothing', () => {
  const el = wrap(celebration(celebApp(), { xp: 20, goalReached: true, medals: [], titles: [] }, { mark: mark(), play: () => {} }).nodes);
  const g = el.querySelector('.guide').innerHTML;
  for (const seg of ['g-low', 'g-mid', 'g-top']) assert.match(g, new RegExp(`${seg} on`));
  const ring = el.querySelector('.goal-ring');
  assert.equal(ring.getAttribute('aria-label'), 'Dagdoel: 30 van 30 XP');
  assert.match(ring.querySelector('.gring-wrap').innerHTML, /stroke-dashoffset="0"/, 'drawn at the new value');
  assert.match(ring.querySelector('.gring-wrap').innerHTML, /--draw-from:33.33/, 'grows from the old 20 of 30');
  assert.equal(el.querySelectorAll('.done-mark').length, 0, 'the guide replaces the mark');
  const off = wrap(celebration(celebApp({ settings: { guide: false } }), { xp: 20, medals: [], titles: [] }, { mark: mark(), play: () => {} }).nodes);
  assert.equal(off.querySelector('.guide'), null);
  assert.ok(off.querySelector('.done-mark'), 'guide off: the existing mark stays');
});

test('a retake shows no celebration and keeps lessonRetake', () => {
  const plays = [];
  const c = celebration(celebApp(), { xp: 0, medals: [], titles: [], goalReached: false }, { mark: mark(), play: (n) => plays.push(n) });
  const el = wrap(c.nodes);
  assert.equal(c.big, null);
  assert.ok(el.querySelector('.done-mark'));
  assert.equal(el.querySelector('.guide'), null);
  assert.equal(el.querySelector('.goal-ring'), null);
  assert.equal(el.querySelector('[aria-live]'), null);
  assert.deepEqual(plays, []);
  assert.equal(t('lessonRetake'), 'Goede opfrisser. De XP kreeg je de eerste keer.');
});

test('the summary text goes once to the polite live region', () => {
  const c = celebration(celebApp(), { xp: 20, goalReached: true, medals: [], titles: [] }, { mark: mark(), play: () => {} });
  const el = wrap(c.nodes);
  const live = el.querySelectorAll('[aria-live]');
  assert.equal(live.length, 1);
  assert.equal(live[0].getAttribute('aria-live'), 'polite');
  assert.equal(c.summary, 'Les voltooid, +20 XP, Dagdoel gehaald');
});

test('at most one sound cue per screen, and none with sound off', () => {
  const res = { xp: 20, goalReached: true, medals: [{ subject: 'eng', moduleId: 'eng.flow', tier: 'bronze' }], titles: [] };
  const played = [];
  celebration(celebApp({ settings: { cheer: true } }), res, { mark: mark(), play: (n, st) => played.push([n, st.cheer]) });
  assert.deepEqual(played.map((x) => x[0]), ['medal']);
  const quiet = [];
  celebration(celebApp({ settings: { cheer: true, sound: false } }), res, { mark: mark(), play: (n) => quiet.push(n) });
  celebration(celebApp(), res, { mark: mark(), play: (n) => quiet.push(n) });
  assert.deepEqual(quiet, [], 'sound off, or the celebration sound left at its default (off)');
});

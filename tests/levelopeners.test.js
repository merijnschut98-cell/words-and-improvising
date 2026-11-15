// v17 Task 19 step 2: the level opener in the app. State (levelSeen,
// markLevelSeen), sanitising, the sync union and the "show the opener?"
// decision. The openers' texts are checked in openers.test.js.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultState, load } from '../src/core/storage.js';
import { mergeStates } from '../src/core/sync.js';
import { levelSeen, markLevelSeen, openerToShow, openerWithin, SEEN_LEVELS_CAP } from '../src/core/course.js';
import { MODULES, loadOpeners } from '../src/content/courses/index.js';

const KEY = 'spraakwater:v1';
const fakeBackend = (init = {}) => { const m = new Map(Object.entries(init)); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, v); }, removeItem: (k) => { m.delete(k); } }; };
const OP = { 'pm.intake/problem': { 2: { nl: 'Tekst twee.', en: 'Text two.' }, 3: { nl: 'Tekst drie.', en: 'Text three.' }, 4: { nl: 'Tekst vier.', en: 'Text four.' } } };

test('levelSeen / markLevelSeen: per subject, stored as "<moduleId>/<topicId>#<level>", idempotent, pure', () => {
  const s0 = defaultState();
  assert.equal(levelSeen(s0, 'pm', 'pm.intake/problem', 2), false);
  const s1 = markLevelSeen(s0, 'pm', 'pm.intake/problem', 2);
  assert.notEqual(s1, s0);
  assert.equal(levelSeen(s0, 'pm', 'pm.intake/problem', 2), false, 'the old state is untouched');
  assert.equal(levelSeen(s1, 'pm', 'pm.intake/problem', 2), true);
  assert.deepEqual(s1.courses.pm.seenLevels, ['pm.intake/problem#2']);
  assert.equal(markLevelSeen(s1, 'pm', 'pm.intake/problem', 2), s1, 'again: the same state');
  assert.equal(levelSeen(s1, 'pm', 'pm.intake/problem', 3), false, 'another level of the topic');
  assert.equal(levelSeen(s1, 'pm', 'pm.intake/other', 2), false, 'another topic');
  assert.equal(levelSeen(s1, 'eng', 'pm.intake/problem', 2), false, 'another subject');
  assert.deepEqual(s1.courses.eng, s0.courses.eng);
  assert.equal(s1.courses.pm.seenIntros, s0.courses.pm.seenIntros, 'intros untouched');
});

test('levelSeen and markLevelSeen cope with a state without seenLevels and with junk input', () => {
  const s0 = defaultState();
  delete s0.courses.pm.seenLevels;
  assert.equal(levelSeen(s0, 'pm', 'pm.intake/problem', 3), false);
  assert.equal(levelSeen({}, 'pm', 'pm.intake/problem', 3), false);
  assert.deepEqual(markLevelSeen(s0, 'pm', 'pm.intake/problem', 3).courses.pm.seenLevels, ['pm.intake/problem#3']);
  assert.equal(markLevelSeen(s0, 'pm', 'pm.intake/problem', 1), s0, 'level 1 has no opener: nothing stored');
  assert.equal(markLevelSeen(s0, 'pm', 'pm.intake/problem', 5), s0);
});

test('markLevelSeen caps the list, newest kept', () => {
  let s = defaultState();
  for (let i = 0; i < SEEN_LEVELS_CAP + 5; i++) s = markLevelSeen(s, 'eng', `eng.m${i}/t`, 2);
  assert.equal(s.courses.eng.seenLevels.length, SEEN_LEVELS_CAP);
  assert.equal(levelSeen(s, 'eng', `eng.m${SEEN_LEVELS_CAP + 4}/t`, 2), true);
  assert.equal(levelSeen(s, 'eng', 'eng.m0/t', 2), false);
});

// The cap must never bite on real ids: a sorted union trimmed to the cap drops
// ids alphabetically, not the oldest, so a learner's seen openers would come
// back. Twice the real number leaves room for the subjects to grow; this test
// trips long before the cap can be reached.
test('the cap is at least twice every topic and level 2 to 4 of the biggest subject', () => {
  const per = (sub) => MODULES.filter((m) => m.subject === sub).reduce((n, m) => n + (m.topics || []).reduce((k, t) => k + Math.max(0, (t.levels || []).length - 1), 0), 0);
  for (const sub of ['eng', 'pm']) assert.ok(per(sub) * 2 <= SEEN_LEVELS_CAP, `${sub}: ${per(sub)} openers, twice that fits in ${SEEN_LEVELS_CAP}`);
});

test('sync: two devices that each saw every real opener of a subject keep all of them', async () => {
  for (const sub of ['eng', 'pm']) {
    const all = Object.entries(await loadOpeners(sub)).flatMap(([k, v]) => Object.keys(v).map((n) => `${k}#${n}`));
    const half = Math.floor(all.length / 2);
    const withSeen = (list) => ({ ...defaultState(), courses: { ...defaultState().courses, [sub]: { ...defaultState().courses[sub], seenLevels: list } } });
    const merged = mergeStates(withSeen(all.slice(0, half + 10)), withSeen(all.slice(half - 10))).courses[sub].seenLevels;
    assert.equal(merged.length, all.length, `${sub}: nothing trimmed`);
    const loaded = load(fakeBackend({ [KEY]: JSON.stringify(withSeen(merged)) }));
    assert.equal(loaded.courses[sub].seenLevels.length, all.length, `${sub}: storage keeps them all`);
  }
});

test('the cap in storage and sync is the one in course.js', async () => {
  const { readFile } = await import('node:fs/promises');
  const sync = await readFile(new URL('../src/core/sync.js', import.meta.url), 'utf8');
  const storage = await readFile(new URL('../src/core/storage.js', import.meta.url), 'utf8');
  assert.match(sync, new RegExp(`SEEN_LEVELS_CAP = ${SEEN_LEVELS_CAP}\\b`));
  assert.match(storage, new RegExp(`seenLevels: strings\\(c\\.seenLevels\\)\\.slice\\(-${SEEN_LEVELS_CAP}\\)`));
});

test('defaults and sanitising: seenLevels is a list of strings, per subject, capped', () => {
  const d = load(fakeBackend());
  assert.deepEqual(d.courses.eng.seenLevels, []);
  assert.deepEqual(d.courses.pm.seenLevels, []);
  const dirty = { ...defaultState(), courses: { eng: { seenLevels: ['eng.a/b#2', 7, null, {}, 'eng.a/b#3'] }, pm: { seenLevels: 'nope' } } };
  const ok = load(fakeBackend({ [KEY]: JSON.stringify(dirty) }));
  assert.deepEqual(ok.courses.eng.seenLevels, ['eng.a/b#2', 'eng.a/b#3']);
  assert.deepEqual(ok.courses.pm.seenLevels, []);
  const big = { ...defaultState(), courses: { eng: { seenLevels: Array.from({ length: SEEN_LEVELS_CAP + 30 }, (_, i) => `eng.m${i}/t#2`) } } };
  const capped = load(fakeBackend({ [KEY]: JSON.stringify(big) }));
  assert.equal(capped.courses.eng.seenLevels.length, SEEN_LEVELS_CAP);
  assert.equal(capped.courses.eng.seenLevels.at(-1), `eng.m${SEEN_LEVELS_CAP + 29}/t#2`, 'newest kept');
});

test('sync: seenLevels of two devices merge as a union, in either order; old states still merge', () => {
  const base = () => defaultState();
  const withSeen = (list) => ({ ...base(), courses: { ...base().courses, pm: { ...base().courses.pm, seenLevels: list } } });
  const a = withSeen(['pm.intake/problem#2', 'pm.plan/wbs#3']);
  const b = withSeen(['pm.intake/problem#2', 'pm.run/rhythm#4']);
  const want = ['pm.intake/problem#2', 'pm.plan/wbs#3', 'pm.run/rhythm#4'];
  assert.deepEqual([...mergeStates(a, b).courses.pm.seenLevels].sort(), want);
  assert.deepEqual([...mergeStates(b, a).courses.pm.seenLevels].sort(), want);
  assert.deepEqual(mergeStates(mergeStates(a, b), b).courses.pm.seenLevels, mergeStates(a, b).courses.pm.seenLevels, 'idempotent');
  const old = { ...base(), courses: { ...base().courses, pm: { lessons: {}, sessions: [], plans: [], prepped: [] } } };
  assert.deepEqual(mergeStates(old, a).courses.pm.seenLevels, a.courses.pm.seenLevels);
  assert.deepEqual(mergeStates(old, old).courses.pm.seenLevels, []);
  const ids = (x, y) => Array.from({ length: y - x }, (_, i) => `eng.m${String(x + i).padStart(4, '0')}/t#2`);
  const big = (list) => ({ ...base(), courses: { ...base().courses, eng: { ...base().courses.eng, seenLevels: list } } });
  assert.equal(mergeStates(big(ids(0, SEEN_LEVELS_CAP - 100)), big(ids(SEEN_LEVELS_CAP - 300, SEEN_LEVELS_CAP + 100))).courses.eng.seenLevels.length, SEEN_LEVELS_CAP);
});

test('openerToShow: a level 2 to 4 with a text that is not seen yet shows; everything else does not', () => {
  const s0 = defaultState();
  assert.deepEqual(openerToShow(s0, 'pm', 'pm.intake/problem', 2, OP, 'nl'), 'Tekst twee.');
  assert.equal(openerToShow(s0, 'pm', 'pm.intake/problem', 3, OP, 'en'), 'Text three.');
  assert.equal(openerToShow(s0, 'pm', 'pm.intake/problem', 4, OP, 'nl'), 'Tekst vier.');
  assert.equal(openerToShow(s0, 'pm', 'pm.intake/problem', 1, OP, 'nl'), null, 'level 1 has none');
  assert.equal(openerToShow(s0, 'pm', 'pm.intake/nope', 2, OP, 'nl'), null, 'no text for the topic');
  assert.equal(openerToShow(s0, 'pm', 'pm.intake/problem', 2, null, 'nl'), null, 'openers not loaded');
  assert.equal(openerToShow(s0, 'pm', 'pm.intake/problem', 2, { 'pm.intake/problem': { 2: { nl: '', en: '' } } }, 'nl'), null, 'empty text');
  const s1 = markLevelSeen(s0, 'pm', 'pm.intake/problem', 2);
  assert.equal(openerToShow(s1, 'pm', 'pm.intake/problem', 2, OP, 'nl'), null, 'seen: not again');
  assert.equal(openerToShow(s1, 'pm', 'pm.intake/problem', 3, OP, 'nl'), 'Tekst drie.', 'another level still shows');
});

// "The first time he opens a lesson at a level he has not been at before": a
// learner who passed that level before the openers existed has been there.
// Only passing counts: opening the lesson (which happens before the card) does not.
test('openerToShow: not for a level whose lesson he has already passed; opening it does not count', () => {
  const s0 = defaultState();
  const passed = { ...s0, courses: { ...s0.courses, pm: { ...s0.courses.pm, lessons: { 'pm.intake.x': { passed: 5, read: 5 } } } } };
  assert.equal(openerToShow(passed, 'pm', 'pm.intake/problem', 2, OP, 'nl', 'pm.intake.x'), null, 'passed before: no card');
  const opened = { ...s0, courses: { ...s0.courses, pm: { ...s0.courses.pm, lessons: { 'pm.intake.x': { opened: 5 } } } } };
  assert.equal(openerToShow(opened, 'pm', 'pm.intake/problem', 2, OP, 'nl', 'pm.intake.x'), 'Tekst twee.', 'only opened: the card still shows');
  assert.equal(openerToShow(passed, 'pm', 'pm.intake/problem', 2, OP, 'nl', 'pm.intake.other'), 'Tekst twee.', 'another lesson passed: not this one');
});

// A slow load must not hold the lesson: after the wait the lesson starts (null)
// and a late answer changes nothing. One answer only, so one render.
test('openerWithin: the openers when they come in time, null on a timeout or a failure, never twice', async () => {
  assert.deepEqual(await openerWithin(() => Promise.resolve(OP), 50), OP);
  assert.equal(await openerWithin(() => new Promise(() => {}), 20), null, 'never answers: null after the wait');
  assert.equal(await openerWithin(() => Promise.reject(new Error('offline')), 50), null, 'fails: null');
  assert.equal(await openerWithin(() => { throw new Error('sync throw'); }, 50), null, 'throws: null');
  let late;
  const slow = openerWithin(() => new Promise((r) => { late = r; }), 10);
  assert.equal(await slow, null);
  late(OP); // too late: the promise has settled already
  assert.equal(await slow, null);
});

test('loadOpeners: the subject file loads and gives the shipped shape; an unknown subject rejects', async () => {
  const pm = await loadOpeners('pm');
  assert.ok(pm['pm.intake/problem'][2].nl.length > 20);
  const eng = await loadOpeners('eng');
  assert.ok(Object.keys(eng).length > 50);
  await assert.rejects(() => loadOpeners('nope'));
});

// ---- the screens ----
const { installFakeDom } = await import('./fixtures/fakedom.js');
installFakeDom();
const { translator } = await import('../src/i18n.js');
const { openerCard, openerInline } = await import('../src/ui/opener.js');
const { topicPath, pathModel } = await import('../src/ui/pathmap.js');
const appFor = (state, lang = 'nl') => ({ t: translator(lang), lang, state, today: () => '2026-11-02' });
const wrap = (nodes) => { const d = document.createElement('div'); nodes.forEach((n) => d.append(n)); return d; };

test('openerCard: Andon says the text, one filled button; with the guide off the card stays without Andon', () => {
  let began = 0;
  const on = wrap(openerCard(appFor(defaultState()), { subject: 'pm', level: 2, text: 'Tekst twee.', onBegin: () => { began += 1; } }));
  assert.equal(on.querySelectorAll('.guide').length, 1, 'one Andon');
  assert.equal(on.querySelector('.guide-name').textContent.startsWith('Andon'), true);
  assert.equal(on.querySelector('.guide-say').textContent, 'Tekst twee.');
  assert.equal(on.querySelector('.opener-title').textContent, 'Wat verandert op Werkkennis');
  assert.equal(on.querySelectorAll('.btn-primary').length, 1);
  assert.equal(on.querySelector('.btn-primary').textContent, 'Begin', 'nl: Begin');
  on.querySelector('.btn-primary').click();
  assert.equal(began, 1);
  const off = wrap(openerCard(appFor({ ...defaultState(), settings: { ...defaultState().settings, guide: false } }, 'en'), { subject: 'pm', level: 4, text: 'Text four.', onBegin: () => {} }));
  assert.equal(off.querySelector('.guide'), null);
  assert.equal(off.querySelector('.guide-say'), null);
  assert.equal(off.querySelector('.opener-text').textContent, 'Text four.');
  assert.equal(off.querySelector('.opener-title').textContent, 'What changes at Expert');
  assert.equal(off.querySelector('.btn-primary').textContent, 'Start', 'en: Start');
});

test('openerInline has no Andon, a heading and a close button', () => {
  let closed = 0;
  const { el } = openerInline(translator('en'), { level: 3, text: 'Text three.', onClose: () => { closed += 1; } });
  assert.equal(el.querySelector('.guide'), null);
  assert.equal(el.querySelector('.opener-text').textContent, 'Text three.');
  el.querySelector('.opener-close').click();
  assert.equal(closed, 1);
});

test('topicPath: an info button on levels 2 to 4 only, named "What changes at <level>", and it does not open the lesson', () => {
  const meta = MODULES.find((m) => m.id === 'eng.flow');
  const all = { ...defaultState(), courses: { ...defaultState().courses, eng: { ...defaultState().courses.eng, lessons: Object.fromEntries(meta.topics[0].levels.map((id, i) => [id, { passed: 10 + i }])) } } };
  const m = pathModel(all, meta, 'nl');
  const opened = []; const info = [];
  const el = topicPath(translator('nl'), 'Takt', m.topics[0], (id) => opened.push(id), (level) => info.push(level));
  const btns = el.querySelectorAll('button.path-info');
  // The topic is in the name: every topic has the same three buttons.
  assert.deepEqual([...btns].map((b) => b.getAttribute('aria-label')), ['Wat verandert op Werkkennis (Takt)', 'Wat verandert op Gevorderd (Takt)', 'Wat verandert op Expert (Takt)']);
  btns[1].click();
  assert.deepEqual(info, [3]);
  assert.deepEqual(opened, []);
  assert.equal(topicPath(translator('en'), 'Takt', m.topics[0], () => {}, () => {}).querySelectorAll('button.path-info')[0].getAttribute('aria-label'), 'What changes at Working knowledge (Takt)');
  assert.equal(topicPath(translator('nl'), 'Takt', m.topics[0], () => {}).querySelectorAll('button.path-info').length, 0, 'no handler: no buttons');
});

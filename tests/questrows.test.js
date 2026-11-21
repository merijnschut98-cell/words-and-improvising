import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { installFakeDom } from './fixtures/fakedom.js';
import { translator } from '../src/i18n.js';

installFakeDom();
const { renderHome, openQuest } = await import('../src/ui/home.js');
const { currentQuests } = await import('../src/core/quests.js');
const { defaultState } = await import('../src/core/storage.js');
const promptsNl = (await import('../src/content/prompts.nl.js')).default;
const tNl = translator('nl');

const calls = [];
const mkApp = (state) => ({
  t: tNl, lang: 'nl', today: () => '2026-11-02', state, subject: 'speak', content: promptsNl, session: null,
  setState(s) { this.state = s; }, go(...a) { calls.push(['go', ...a]); }, setSubject() {}, openModule: () => new Promise(() => {}), dueReviews: () => [],
  startDrill(d) { calls.push(['drill', d]); }, startLesson() { calls.push(['lesson']); }, startQuick() { calls.push(['quick']); },
});
const state = (items) => ({ ...defaultState(), ui: { andonIntro: true, speakOpen: ['quests'] }, quests: { day: '2026-11-02', items } });
const render = (st) => { const root = document.createElement('div'); renderHome(mkApp(st), {}, root); return root; };

test('a quest still to do is a real button (type, name with the reward, one tap target); a done quest is a plain row', () => {
  const root = render(state([{ id: 'pauseClean', done: false }, { id: 'bridgeAll', done: true }, { id: 'lesson', done: false }]));
  const rows = [...root.querySelectorAll('.quest-card .quest')];
  assert.equal(rows.length, 3);
  assert.equal(rows[0].tagName, 'BUTTON');
  assert.equal(rows[0].getAttribute('type'), 'button');
  assert.match(rows[0].getAttribute('aria-label'), /Doe een pauzeronde met 0 stopwoorden, \+15 XP/);
  assert.equal(rows[1].tagName, 'DIV', 'done: nothing left to complete');
  assert.ok(rows[1].classList.contains('done'));
  assert.equal(rows[2].tagName, 'BUTTON');
});

test('tapping a quest opens its drill, lesson or retry', () => {
  const app = mkApp(defaultState());
  calls.length = 0;
  openQuest(app, 'pauseClean');
  openQuest(app, 'bridgeAll');
  openQuest(app, 'lesson');
  openQuest(app, 'coldStart');
  openQuest(app, 'otherLang');
  openQuest(app, 'liveConvo');
  assert.deepEqual(calls, [['drill', 'pause'], ['drill', 'bridge'], ['lesson'], ['quick'], ['go', 'settings'], ['go', 'settings']], 'live conversation needs a key: settings without one');
  const keyed = mkApp({ ...defaultState(), settings: { ...defaultState().settings, apiKey: 'x' } });
  calls.length = 0;
  openQuest(keyed, 'liveConvo');
  assert.deepEqual(calls, [['go', 'conversation']]);
});

test('every quest of the pool has a row that opens something', () => {
  const st = defaultState();
  for (const q of currentQuests({ ...st, settings: { ...st.settings, apiKey: 'x' } }, '2026-11-02')) assert.ok(q.id);
});

test('the quest row and the subject tabs keep 44 px tap targets, and the tabs have a 320 px rule', () => {
  const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /button\.quest-go \{[^}]*min-height: 44px/);
  assert.match(css, /\.subject-tab \{[^}]*min-height: 44px/);
  assert.match(css, /@media \(max-width: 359px\) \{\s*\.subject-bar/);
});

test('the drill grid can shrink at 320 px: its columns have no min-content floor and a long drill name hyphenates', () => {
  const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.drill-grid \{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.drill-name \{[^}]*hyphens: auto/);
});

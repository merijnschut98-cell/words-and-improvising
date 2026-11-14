import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installFakeDom } from './fixtures/fakedom.js';
import { translator } from '../src/i18n.js';

installFakeDom();
const { guideSvg, guide, guideLine, guideOn } = await import('../src/ui/guide.js');
const segs = (svg, cls) => [...svg.matchAll(/<g class="([^"]*\bg-seg\b[^"]*)"/g)].map((m) => m[1]).find((c) => c.includes(cls));

test('guide renders three segments; state right lights the top, wrong the middle, celebrate all', () => {
  const idle = guideSvg('idle');
  for (const c of ['g-top', 'g-mid', 'g-low']) assert.ok(segs(idle, c), c);
  assert.ok(!/\b(on|warn)\b/.test(['g-top', 'g-mid', 'g-low'].map((c) => segs(idle, c)).join(' ')));
  const right = guideSvg('right');
  assert.match(segs(right, 'g-top'), /\bon\b/);
  assert.doesNotMatch(segs(right, 'g-mid'), /\b(on|warn)\b/);
  const wrong = guideSvg('wrong');
  assert.match(segs(wrong, 'g-mid'), /\bwarn\b/);
  assert.doesNotMatch(segs(wrong, 'g-top'), /\bon\b/);
  const all = guideSvg('celebrate');
  for (const c of ['g-top', 'g-mid', 'g-low']) assert.match(segs(all, c), /\bon\b/, c);
});

test('guide SVG is aria-hidden and uses no hex colours (fills come from CSS classes)', () => {
  for (const st of ['idle', 'right', 'wrong', 'celebrate']) {
    const svg = guideSvg(st);
    assert.match(svg, /aria-hidden="true"/);
    assert.doesNotMatch(svg, /#[0-9a-f]{3,6}\b/i);
    assert.doesNotMatch(svg, /\b(fill|stroke)="(?!none)/, 'no inline paint');
    assert.doesNotMatch(svg, /rgb\(/);
  }
  // Isometric solids: a dozen or so, each with a lit top and two side tones.
  const svg = guideSvg('idle');
  assert.ok((svg.match(/class="t-top/g) || []).length >= 10);
  assert.ok((svg.match(/class="t-left/g) || []).length >= 10);
});

test('guideLine picks from the pool seeded by day and never repeats the last line', () => {
  const t = translator('nl');
  const pool = t('guideWrong');
  const a = guideLine(t, 'guideWrong', '2026-11-02');
  assert.ok(pool.includes(a));
  assert.equal(guideLine(t, 'guideWrong', '2026-11-02'), a, 'same day, same line');
  for (let i = 0; i < 10; i++) {
    const day = `2026-11-${String(i + 1).padStart(2, '0')}`;
    const first = guideLine(t, 'guideWrong', day);
    assert.notEqual(guideLine(t, 'guideWrong', day, first), first);
  }
  const days = new Set(Array.from({ length: 12 }, (_, i) => guideLine(t, 'guideDone', `2026-12-${String(i + 1).padStart(2, '0')}`)));
  assert.ok(days.size > 1, 'rotates across days');
});

test('guide is not rendered when settings.guide is false', () => {
  assert.equal(guideOn({ settings: { guide: false } }), false);
  assert.equal(guideOn({ settings: {} }), true);
  assert.equal(guide({ settings: { guide: false } }, { mood: 'right' }), null);
  const el = guide({ settings: { guide: true } }, { mood: 'wrong', size: 32 });
  assert.equal(el.getAttribute('aria-hidden'), 'true');
  assert.ok(el.classList.contains('guide'));
  assert.ok(el.classList.contains('guide-32'));
  assert.match(el.innerHTML, /g-mid[^"]*warn/);
});

// ---- The guide in the quiz review and on the course home (task 20) ----
const { renderQuiz } = await import('../src/ui/quiz.js');
const { goalLeftText } = await import('../src/ui/flairui.js');
const { defaultState } = await import('../src/core/storage.js');
const tNl = translator('nl');
const qs = [{ id: 'x#r0', q: 'q0', options: ['a', 'b', 'c', 'd'], answer: 'a', why: 'w' }, { id: 'x#r1', q: 'q1', options: ['a', 'b', 'c', 'd'], answer: 'a', why: 'w' }];
const quizApp = (settings = {}) => ({ t: tNl, lang: 'nl', today: () => '2026-11-02', state: { ...defaultState(), settings: { ...defaultState().settings, ...settings } } });

test('quiz review: all right lights the top with no line; misses light the middle with one line, once per quiz', () => {
  const box = document.createElement('div');
  renderQuiz(quizApp(), { questions: qs, onDone() {} }, box);
  box.querySelectorAll('.opt')[0].click();
  box.querySelectorAll('.opt')[0].click();
  const clean = box.querySelector('.quiz-review .guide');
  assert.match(clean.innerHTML, /g-top on/);
  assert.equal(box.querySelector('.quiz-review .guide-say'), null, 'right answers need no praise');

  const b2 = document.createElement('div');
  renderQuiz(quizApp(), { questions: qs, onDone() {} }, b2);
  b2.querySelectorAll('.opt')[1].click();
  b2.querySelectorAll('.opt')[1].click();
  assert.match(b2.querySelector('.quiz-review .guide').innerHTML, /g-mid warn/);
  const say = b2.querySelectorAll('.quiz-review .guide-say');
  assert.equal(say.length, 1);
  assert.ok(tNl('guideWrong').includes(say[0].textContent));
  assert.equal(say[0].getAttribute('aria-live'), null, 'the review already says right and wrong');
  b2.querySelector('.quiz-review .btn-primary').click(); // second pass: the two misses
  b2.querySelectorAll('.opt')[1].click();
  b2.querySelectorAll('.opt')[0].click();
  assert.ok(b2.querySelector('.quiz-review .guide'));
  assert.equal(b2.querySelector('.quiz-review .guide-say'), null, 'the line comes once per quiz');
});

test('goalLeft only after the first lesson of the day and while the goal is open', () => {
  const app = (xpDays) => ({ t: tNl, lang: 'nl', today: () => '2026-11-02', state: { ...defaultState(), xpDays } });
  assert.equal(goalLeftText(app({})), null, 'nothing done today yet');
  assert.equal(goalLeftText(app({ '2026-11-02': 18 })), 'Nog 12 XP tot je dagdoel.');
  assert.equal(goalLeftText(app({ '2026-11-02': 30 })), null, 'goal reached');
});

test('settings guide off: no guide anywhere, the done card keeps its mark', () => {
  const box = document.createElement('div');
  renderQuiz(quizApp({ guide: false }), { questions: qs, onDone() {} }, box);
  box.querySelectorAll('.opt')[1].click();
  box.querySelectorAll('.opt')[1].click();
  assert.equal(box.querySelector('.guide'), null);
  assert.equal(box.querySelector('.guide-say'), null);
});

// ---- Andon visible (v17 Task 8): the greeting on the homes, the presenter on the module screen ----
const { guideGreeting, guideIntro, guideIntroSeen, introGuideModel } = await import('../src/ui/flairui.js');
const { markIntroSeen } = await import('../src/core/course.js');
const { MODULES } = await import('../src/content/courses/index.js');
const tEn = translator('en');
const withIntro = { ...MODULES.find((m) => m.id === 'pm.run'), intro: 'pm.run.intro' };
const noIntro = { ...withIntro, intro: undefined };
const appFor = (state, t = tNl, lang = 'nl') => ({ t, lang, today: () => '2026-11-02', state });
const stOn = () => defaultState();
const stOff = () => ({ ...defaultState(), settings: { ...defaultState().settings, guide: false } });

test('guideGreeting: Andon at 96 px with one line from the day pool; null when the guide is off', () => {
  const el = guideGreeting(appFor(stOn()), { subject: 'speak' });
  assert.ok(el.classList.contains('guide-greeting'));
  const a = el.querySelector('.guide');
  assert.ok(a.classList.contains('guide-96'));
  assert.match(a.innerHTML, /s-idle/);
  const lines = el.querySelectorAll('.guide-say');
  assert.equal(lines.length, 1, 'at most one line');
  assert.ok(tNl('guideHome').includes(lines[0].textContent));
  assert.equal(guideGreeting(appFor(stOff()), { subject: 'speak' }), null);
  assert.equal(guideGreeting(appFor(stOff()), { subject: 'pm' }), null);
});

test('guideGreeting: the pool is calm, in both languages, and rotates with the day', () => {
  for (const t of [tNl, tEn]) {
    const pool = t('guideHome');
    assert.ok(pool.length >= 4);
    for (const line of pool) assert.doesNotMatch(line, /!/, 'no exclamation marks');
  }
  assert.equal(tNl('guideHome')[0], 'Vandaag: één stap. Die hieronder.');
  assert.equal(tEn('guideHome')[0], 'Today: one step. The one below.');
  const seen = new Set(Array.from({ length: 12 }, (_, i) => guideLine(tNl, 'guideHome', `2026-12-${String(i + 1).padStart(2, '0')}`)));
  assert.ok(seen.size > 1);
});

test('introGuideModel: idle with a line until the intro is seen, then the top light and no line; no intro, no Andon', () => {
  assert.deepEqual(introGuideModel(stOn(), withIntro), { mood: 'idle', line: 'guideIntro' });
  assert.deepEqual(introGuideModel(markIntroSeen(stOn(), 'pm.run'), withIntro), { mood: 'right', line: null });
  assert.equal(introGuideModel(stOn(), noIntro), null);
  assert.equal(introGuideModel(stOff(), withIntro), null);
});

test('guideIntro: 72 px, the line while unseen, lit and silent once seen; null without intro or with the guide off', () => {
  const el = guideIntro(appFor(stOn()), withIntro);
  const a = el.querySelector('.guide');
  assert.ok(a.classList.contains('guide-72'));
  assert.match(a.innerHTML, /s-idle/);
  assert.doesNotMatch(a.innerHTML, /g-top on/);
  assert.equal(el.querySelector('.guide-say').textContent, 'Eerst het grote plaatje, dan de details.');
  assert.equal(guideIntro(appFor(stOn(), tEn, 'en'), withIntro).querySelector('.guide-say').textContent, 'The big picture first, then the details.');
  const seen = guideIntro(appFor(markIntroSeen(stOn(), 'pm.run')), withIntro);
  assert.match(seen.querySelector('.guide').innerHTML, /g-top on/);
  assert.equal(seen.querySelector('.guide-say'), null);
  assert.equal(guideIntro(appFor(stOn()), noIntro), null);
  assert.equal(guideIntro(appFor(stOff()), withIntro), null);
});

test('guideIntro: the heading goes beside him; guideIntroSeen lights the top in place and drops the line', () => {
  const heading = document.createElement('h2');
  heading.textContent = 'Begin hier';
  const el = guideIntro(appFor(stOn()), withIntro, heading);
  assert.ok(el.querySelector('h2'), 'the heading is part of the block, no separate gap');
  const guideEl = el.querySelector('.guide');
  guideIntroSeen(el);
  assert.equal(el.querySelector('.guide'), guideEl, 'same element, no re-render');
  assert.match(guideEl.innerHTML, /g-top on/);
  assert.equal(el.querySelector('.guide-say'), null);
  assert.ok(el.querySelector('h2'));
  guideIntroSeen(el); // idempotent
  assert.match(guideEl.innerHTML, /g-top on/);
});

test('Andon is decoration plus one line: never a button or link, aria-hidden', () => {
  for (const el of [guideGreeting(appFor(stOn()), { subject: 'speak' }), guideIntro(appFor(stOn()), withIntro)]) {
    assert.equal(el.querySelectorAll('button, a').length, 0);
    assert.equal(el.querySelector('.guide').getAttribute('aria-hidden'), 'true');
  }
});

test('guide sizes 72 and 96 have styles', async () => {
  const fs = await import('node:fs');
  const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  for (const n of [72, 96]) assert.match(css, new RegExp(`\\.guide-${n}\\b`));
});

// ---- Review (Task 8): the start screen greets too, and no home shows two guide lines ----
const { renderHome } = await import('../src/ui/home.js');
const promptsNl = (await import('../src/content/prompts.nl.js')).default;
const homeApp = (subject, state) => ({
  t: tNl, lang: 'nl', today: () => '2026-11-02', state, subject, content: promptsNl, session: null,
  setState(s) { this.state = s; }, go() {}, setSubject() {}, openModule: () => new Promise(() => {}), dueReviews: () => [],
});
const renderHomeOf = (subject, state) => { const root = document.createElement('div'); renderHome(homeApp(subject, state), {}, root); return root; };
const guideCount = (root) => ({
  andons: root.querySelectorAll('.guide').length,
  lines: root.querySelectorAll('.guide-say').length + root.querySelectorAll('.guide-line').length,
});
const halfDone = () => ({ ...stOn(), xpDays: { '2026-11-02': 18 } });

test('start screen: Andon greets between the head and the one begin button; gone with the guide off', () => {
  const main = renderHomeOf('start', stOn()).querySelector('main');
  const kids = [...main.children];
  const g = kids.findIndex((e) => e.classList.contains('guide-greeting'));
  assert.ok(g >= 0, 'a greeting on the start screen');
  assert.equal(kids[g].getAttribute('data-subject'), 'start');
  assert.ok(kids[g].querySelector('.guide-96'));
  assert.ok(kids.findIndex((e) => e.classList.contains('start-head-wrap')) < g, 'under the head');
  assert.ok(kids.findIndex((e) => e.classList.contains('begin-btn')) > g, 'above the begin button');
  const off = renderHomeOf('start', stOff());
  assert.equal(off.querySelector('.guide-greeting'), null);
  assert.equal(off.querySelector('.guide'), null);
});

test('every home shows at most one Andon and one guide line, also with the daily goal half done', () => {
  for (const subject of ['start', 'speak', 'pm', 'eng']) {
    for (const st of [stOn(), halfDone()]) {
      const c = guideCount(renderHomeOf(subject, st));
      assert.equal(c.andons, 1, `${subject}: ${c.andons} Andons`);
      assert.equal(c.lines, 1, `${subject}: ${c.lines} guide lines`);
    }
    const st = halfDone();
    const off = guideCount(renderHomeOf(subject, { ...st, settings: { ...st.settings, guide: false } }));
    assert.deepEqual(off, { andons: 0, lines: 0 }, `${subject} with the guide off`);
  }
});

test('course home with the goal half done: the greeting says how much XP is left (its one line); the day line otherwise', () => {
  for (const subject of ['pm', 'eng']) {
    assert.equal(renderHomeOf(subject, halfDone()).querySelector('.guide-greeting .guide-say').textContent, 'Nog 12 XP tot je dagdoel.');
    assert.ok(tNl('guideHome').includes(renderHomeOf(subject, stOn()).querySelector('.guide-greeting .guide-say').textContent), 'nothing done yet: the day line');
    const done = { ...stOn(), xpDays: { '2026-11-02': 30 } };
    assert.ok(tNl('guideHome').includes(renderHomeOf(subject, done).querySelector('.guide-greeting .guide-say').textContent), 'goal reached: the day line');
  }
});

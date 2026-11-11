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
const { goalLeftLine } = await import('../src/ui/flairui.js');
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

test('course home shows goalLeft only after the first lesson of the day and while the goal is open', () => {
  const app = (xpDays, settings = {}) => ({ t: tNl, lang: 'nl', today: () => '2026-11-02', state: { ...defaultState(), xpDays, settings: { ...defaultState().settings, ...settings } } });
  assert.equal(goalLeftLine(app({})), null, 'nothing done today yet');
  const el = goalLeftLine(app({ '2026-11-02': 18 }));
  assert.match(el.textContent, /Nog 12 XP tot je dagdoel\./);
  assert.ok(el.querySelector('.guide'));
  assert.equal(goalLeftLine(app({ '2026-11-02': 30 })), null, 'goal reached');
  const off = goalLeftLine(app({ '2026-11-02': 18 }, { guide: false }));
  assert.equal(off, null, 'the line belongs to the guide');
});

test('settings guide off: no guide anywhere, the done card keeps its mark', () => {
  const box = document.createElement('div');
  renderQuiz(quizApp({ guide: false }), { questions: qs, onDone() {} }, box);
  box.querySelectorAll('.opt')[1].click();
  box.querySelectorAll('.opt')[1].click();
  assert.equal(box.querySelector('.guide'), null);
  assert.equal(box.querySelector('.guide-say'), null);
});

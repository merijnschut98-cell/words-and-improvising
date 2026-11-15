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
const { guideGreeting, guideIntro, guideIntroSeen, introGuideModel, stepName } = await import('../src/ui/flairui.js');
const { markIntroSeen } = await import('../src/core/course.js');
const { MODULES } = await import('../src/content/courses/index.js');
const tEn = translator('en');
const withIntro = { ...MODULES.find((m) => m.id === 'pm.run'), intro: 'pm.run.intro' };
const noIntro = { ...withIntro, intro: undefined };
const appFor = (state, t = tNl, lang = 'nl') => ({ t, lang, today: () => '2026-11-02', state });
const stOn = () => ({ ...defaultState(), ui: { andonIntro: true } }); // intro already said
const stNew = () => defaultState();
const stOff = () => ({ ...defaultState(), settings: { ...defaultState().settings, guide: false } });

test('guideGreeting: Andon at 80 px with one line from the day pool; null when the guide is off', () => {
  const el = guideGreeting(appFor(stOn()), { subject: 'speak' });
  assert.ok(el.classList.contains('guide-greeting'));
  const a = el.querySelector('.guide');
  assert.ok(a.classList.contains('guide-80'));
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
    assert.ok(pool.length >= 3);
    for (const line of [...pool, t('guideStep', 'X')]) {
      assert.doesNotMatch(line, /!/, 'no exclamation marks');
      assert.doesNotMatch(line, /hieronder|\bbelow\b|\bthe one\b|die onder/i, 'never points down the page: he names the step');
    }
  }
  assert.equal(tNl('guideStep', 'Wie beslist, wie kan het stoppen'), 'Vandaag: één stap. Begin met Wie beslist, wie kan het stoppen.');
  assert.equal(tEn('guideStep', 'Who decides'), 'Today: one step. Start with Who decides.');
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
  el.getBoundingClientRect = () => ({ height: 118 }); // the bubble makes the block taller than the tower
  guideIntroSeen(el);
  assert.equal(el.style.minHeight, '118px', 'the block keeps its height when the bubble goes: nothing below moves');
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
  for (const n of [72, 80, 96]) assert.match(css, new RegExp(`\\.guide-${n}\\b`));
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
  assert.ok(kids[g].querySelector('.guide-80'));
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
    assert.equal(renderHomeOf(subject, { ...st, settings: { ...st.settings, guide: false } }).querySelector('.goal-line'), null, `${subject}: no goal line with the guide off`);
  }
});

const sayOf = (root) => root.querySelector('.guide-greeting .guide-say').textContent;
const isDayOrStep = (txt) => tNl('guideHome').includes(txt) || /^Vandaag: één stap\. Begin met /.test(txt) || txt === tNl('courseWhy_done');

test('every home with the goal half done: a separate small goal line (XP today / goal) under the bubble; the bubble is never the XP left', () => {
  for (const subject of ['start', 'speak', 'pm', 'eng']) {
    const root = renderHomeOf(subject, halfDone());
    const line = root.querySelector('.guide-greeting .goal-line');
    assert.ok(line, `${subject}: goal line`);
    // The clearer wording: what is left to do, not a second "x van y" beside the ring.
    assert.equal(line.textContent, 'Nog 12 XP tot je dagdoel.');
    assert.equal(line.tagName, 'P');
    assert.notEqual(line, root.querySelector('.guide-greeting .guide-say'), 'not Andon\'s sentence');
    assert.doesNotMatch(sayOf(root), /XP/, `${subject}: the greeting no longer carries the XP left`);
    assert.ok(isDayOrStep(sayOf(root)), `${subject}: ${sayOf(root)}`);
    assert.equal(renderHomeOf(subject, stOn()).querySelector('.goal-line'), null, 'nothing done yet: no goal line');
    assert.equal(renderHomeOf(subject, { ...stOn(), xpDays: { '2026-11-02': 30 } }).querySelector('.goal-line'), null, 'goal reached: no goal line');
  }
});

test('Andon names the step instead of pointing below (Projects and Engineering homes, the start screen)', () => {
  for (const subject of ['pm', 'eng']) {
    const root = renderHomeOf(subject, stOn());
    assert.match(sayOf(root), /^Vandaag: één stap\. Begin met \S/, subject);
    assert.doesNotMatch(sayOf(root), /hieronder/);
    assert.equal(root.querySelector('.guide-greeting').getAttribute('data-line'), 'step');
  }
  assert.doesNotMatch(sayOf(renderHomeOf('start', stOn())), /hieronder|below/);
});

test('stepName: the topic of a lesson step, a due round by its count; nothing when done', () => {
  const lesson = { reason: 'lesson', moduleId: 'pm.plan', lessonId: MODULES.find((m) => m.id === 'pm.plan').lessons[0] };
  assert.ok(stepName(appFor(stOn()), lesson).length > 3);
  assert.equal(stepName(appFor(stOn()), { reason: 'due', count: 7 }), '7 vragen om op te halen');
  assert.equal(stepName(appFor(stOn()), { reason: 'done' }), null);
  assert.equal(stepName(appFor(stOn()), null), null);
});

test('stepName mid-sentence: a kept question starts lower case after "Begin met" / "Start with"', () => {
  const el = guideGreeting(appFor(stOn()), { subject: 'pm', pick: { reason: 'maintain', questionId: 'pm.plan.x#r0' } });
  assert.equal(el.querySelector('.guide-say').textContent, 'Vandaag: één stap. Begin met één vraag om scherp te blijven.');
  const en = guideGreeting(appFor(stOn(), tEn, 'en'), { subject: 'pm', pick: { reason: 'maintain', questionId: 'pm.plan.x#r0' } });
  assert.equal(en.querySelector('.guide-say').textContent, 'Today: one step. Start with one question to keep it sharp.');
});

test('Andon\'s step name is final on first paint: no later swap to the lesson title (no reflow under the bubble)', async () => {
  const plan = MODULES.find((m) => m.id === 'pm.plan');
  const lessonId = plan.topics[0].levels[0];
  let loads = 0;
  const app = { ...appFor(stOn()), openModule: () => { loads += 1; return Promise.resolve({ lessons: [{ id: lessonId, title: 'Een heel andere, veel langere lestitel dan het onderwerp' }] }); } };
  const el = guideGreeting(app, { subject: 'pm', pick: { reason: 'lesson', subject: 'pm', moduleId: 'pm.plan', lessonId } });
  const first = el.querySelector('.guide-say').textContent;
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(el.querySelector('.guide-say').textContent, first);
  assert.equal(first, `Vandaag: één stap. Begin met ${plan.topics[0].title.nl}.`);
  assert.equal(loads, 0, 'the greeting loads no module');
});

test('everything done: Andon says so with the existing done wording, not a pointer', () => {
  const el = guideGreeting(appFor(stOn()), { subject: 'pm', pick: { reason: 'done' } });
  assert.equal(el.querySelector('.guide-say').textContent, tNl('courseWhy_done'));
  assert.equal(el.getAttribute('data-line'), 'done');
});

test('everything done on the Projects home: the done sentence is said once (Andon), not again in the card under him', () => {
  const lessons = Object.fromEntries(MODULES.filter((m) => m.subject === 'pm').flatMap((m) => m.lessons)
    .map((id) => [id, { passed: 1, situation: { ts: 1 }, sayIt: 1 }]));
  const st = { ...stOn(), courses: { pm: { lessons, sessions: [] } } };
  const count = (root) => root.textContent.split(tNl('courseWhy_done')).length - 1;
  const root = renderHomeOf('pm', st);
  assert.equal(root.querySelector('.guide-greeting').getAttribute('data-line'), 'done');
  assert.equal(count(root), 1);
  assert.equal(root.querySelectorAll('.map-place.is-next').length, 0, 'the map marks nothing');
  // with the guide off the card keeps the sentence
  assert.equal(count(renderHomeOf('pm', { ...st, settings: { ...st.settings, guide: false } })), 1);
});

// ---- Andon recognisable (v17): status light, name, speech bubble, one-time introduction ----
const { statusModel, andonIntroSeen, markAndonIntroSeen, leaveAndonIntro } = await import('../src/ui/guide.js');
const dueState = (st = stOn()) => ({ ...st, courseReviews: { 'nl|q1': { subject: 'eng', lesson: 'l', box: 1, due: '2026-11-01' } } });

test('statusModel: nothing due burns the bottom light, due burns the middle (ochre), goal done adds the top; pure', () => {
  assert.deepEqual(statusModel({}), { status: 'ok', on: ['g-low'], warn: [], key: 'g-low' });
  assert.deepEqual(statusModel({ due: 3 }), { status: 'due', on: [], warn: ['g-mid'], key: 'g-mid' });
  assert.deepEqual(statusModel({ due: 0, goalDone: true }).on, ['g-low', 'g-top']);
  assert.deepEqual(statusModel({ due: 2, goalDone: true }).on, ['g-top']);
});

test('guideSvg with a status: one light always on; plain moods unchanged; blink only on the status light', () => {
  const ok = guideSvg('idle', { status: statusModel({}) });
  assert.match(segs(ok, 'g-low'), /\bon\b/);
  assert.doesNotMatch(segs(ok, 'g-mid'), /\b(on|warn)\b/);
  assert.match(ok, /st-ok/);
  const due = guideSvg('idle', { status: statusModel({ due: 1 }) });
  assert.match(segs(due, 'g-mid'), /\bwarn\b/);
  assert.doesNotMatch(segs(due, 'g-low'), /\bon\b/);
  assert.match(due, /st-due/);
  assert.doesNotMatch(due, /blink/);
  const b = guideSvg('idle', { status: statusModel({ due: 1 }), blink: true });
  assert.equal((b.match(/blink/g) || []).length, 1);
  assert.match(segs(b, 'g-mid'), /blink/);
  assert.doesNotMatch(guideSvg('idle'), /\b(on|warn|blink)\b/);
  for (const c of ['g-top', 'g-mid', 'g-low']) assert.match(segs(guideSvg('celebrate', { status: statusModel({ due: 1 }) }), c), /\bon\b/);
});

test('greeting: speech bubble with the name under the tower, status as text for a screen reader, tower aria-hidden', () => {
  const el = guideGreeting(appFor(stOn()), { subject: 'start' });
  assert.equal(el.getAttribute('data-status'), 'ok');
  const fig = el.querySelector('.guide-figure');
  assert.equal(fig.querySelector('.guide').getAttribute('aria-hidden'), 'true');
  assert.equal(fig.querySelector('.guide-name').textContent, 'Andon: alles op koers');
  assert.ok(fig.querySelector('.guide-name .sr'));
  assert.equal(el.querySelectorAll('.guide-name').length, 1);
  assert.equal(el.querySelectorAll('.guide-say').length, 1);
  assert.equal(guideGreeting(appFor(stOn(), tEn, 'en'), { subject: 'start' }).querySelector('.guide-name').textContent, 'Andon: all on track');
  const waiting = guideGreeting(appFor(dueState()), { subject: 'eng' });
  assert.equal(waiting.getAttribute('data-status'), 'due');
  assert.match(waiting.querySelector('.guide').innerHTML, /g-mid[^"]*warn/);
  assert.match(waiting.querySelector('.guide-name').textContent, /er staan vragen klaar/);
  assert.equal(guideGreeting(appFor(dueState()), { subject: 'pm' }).getAttribute('data-status'), 'ok', 'a course home counts its own queue');
  assert.equal(guideGreeting(appFor(dueState()), { subject: 'start' }).getAttribute('data-status'), 'due', 'the start screen counts all');
  assert.match(guideGreeting(appFor({ ...stOn(), xpDays: { '2026-11-02': 30 } }), { subject: 'pm' }).querySelector('.guide').innerHTML, /g-top on/);
});

test('introduction: once per device, a short line, the status light blinks, marked at once (device-only ui flag)', () => {
  const app = appFor(stNew());
  let saved = null;
  app.setState = (s) => { saved = s; app.state = s; };
  const first = guideGreeting(app, { subject: 'start' });
  assert.equal(first.getAttribute('data-line'), 'intro');
  assert.equal(first.querySelector('.guide-say').textContent, 'Ik ben Andon. Ik wijs je de weg.');
  assert.match(first.querySelector('.guide').innerHTML, /g-low[^"]*blink/);
  assert.equal(saved.ui.andonIntro, true);
  // A redraw of a home in the same visit (sync after boot, subject switch)
  // keeps the introduction, without blinking again, and marks nothing more.
  let writes = 0;
  app.setState = (s) => { writes += 1; app.state = s; };
  const again = guideGreeting(app, { subject: 'start', goal: true });
  assert.equal(again.getAttribute('data-line'), 'intro', 'a redraw does not swallow the introduction');
  assert.equal(again.querySelector('.guide-say').textContent, 'Ik ben Andon. Ik wijs je de weg.');
  assert.doesNotMatch(again.querySelector('.guide').innerHTML, /blink/, 'blinks once');
  assert.equal(writes, 0, 'marked only once');
  // Switching subject is a navigation of his own: the next home has its day line.
  assert.notEqual(guideGreeting(app, { subject: 'eng' }).getAttribute('data-line'), 'intro', 'a subject switch ends it');
  assert.notEqual(guideGreeting(app, { subject: 'start' }).getAttribute('data-line'), 'intro', 'and it does not come back');
  // Leaving the homes ends it too.
  const app2 = appFor(stNew());
  app2.setState = (s) => { app2.state = s; };
  guideGreeting(app2, { subject: 'pm' });
  leaveAndonIntro(app2);
  assert.notEqual(guideGreeting(app2, { subject: 'pm' }).getAttribute('data-line'), 'intro', 'after leaving home');
  const second = guideGreeting(app, { subject: 'start' });
  assert.notEqual(second.getAttribute('data-line'), 'intro');
  assert.doesNotMatch(second.querySelector('.guide').innerHTML, /blink/);
  assert.ok(tNl('guideHome').includes(second.querySelector('.guide-say').textContent));
  // A fresh visit (new app session) with the flag stored: no introduction.
  assert.notEqual(guideGreeting(appFor(app.state), { subject: 'start' }).getAttribute('data-line'), 'intro');
  assert.equal(guideGreeting(appFor(stNew(), tEn, 'en'), { subject: 'start' }).querySelector('.guide-say').textContent, "I'm Andon. I'll show you the way.");
  const off = appFor(stOff());
  let touched = false;
  off.setState = () => { touched = true; };
  assert.equal(guideGreeting(off, { subject: 'start' }), null);
  assert.equal(touched, false, 'guide off: nothing is marked');
  assert.equal(andonIntroSeen(stNew()), false);
  const m = markAndonIntroSeen(stNew());
  assert.equal(andonIntroSeen(m), true);
  assert.equal(markAndonIntroSeen(m), m);
});

test('introduction: one Andon and one line on a first start, on every home', () => {
  for (const subject of ['start', 'speak', 'pm', 'eng']) {
    assert.deepEqual(guideCount(renderHomeOf(subject, stNew())), { andons: 1, lines: 1 }, subject);
  }
});

test('storage keeps ui.andonIntro only as true; css has bubble, name and a blink that reduced motion switches off', async () => {
  const fs = await import('node:fs');
  const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  for (const sel of ['.guide-figure', '.guide-name', '.guide-say::before', 'vp-blink']) assert.ok(css.includes(sel), sel);
  assert.match(css, /prefers-reduced-motion: reduce\) \{\s*\* \{ animation: none !important/);
  const { load } = await import('../src/core/storage.js');
  const backend = (v) => ({ getItem: () => JSON.stringify({ ui: { andonIntro: v } }), setItem() {} });
  assert.equal(load(backend(true)).ui.andonIntro, true);
  assert.equal('andonIntro' in load(backend('yes')).ui, false);
  assert.equal('andonIntro' in load({ getItem: () => null, setItem() {} }).ui, false, 'existing learners see it once');
});

test('the introduction ends on the next navigation away from the homes, not on a redraw of home', async () => {
  const fs = await import('node:fs');
  const src = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.match(src, /if \(screen !== 'home'\) leaveAndonIntro\(this\)/);
});

test('status on track burns the brand success green, not petrol (an andon is green when running)', async () => {
  const fs = await import('node:fs');
  const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.guide-svg\.st-ok \.g-seg\.g-low\.on \.t-left \{ fill: var\(--good\); \}/);
});

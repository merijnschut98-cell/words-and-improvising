// The practice test screen and its entry points (v18 T2, design 3.2): the rows of
// level tests on the module screen, the chip of one test, and the screen itself:
// an intro, one pass of questions (no hints, no going back), then the result.
import { exitTarget, FROM_MODULE } from '../core/moduleexit.js';
import { h } from './dom.js';
import { ico } from './icons.js';
import { renderQuiz } from './quiz.js';
import { guide, guideOn } from './guide.js';
import { celebration } from './flairui.js';
import { progressBar } from './home.js';
import { MODULES, topicsOf, loadBank, hasBank } from '../content/courses/index.js';
import {
  specOf, testOpen, testRecord, testStatus, levelTests, testPool, composeTest, applyTest, weakestTopic, topicTitleOf, PASS_PCT, GOLD_PCT,
} from '../core/practicetest.js';

const MIN_ITEMS = 4;

// The name of a test: a level (Expert is the final test) or a topic.
export function testLabel(t, meta, status, lang = 'nl') {
  if (status.type === 'level') return status.level === 4 ? t('testFinalName', t('level_4')) : t(`level_${status.level}`);
  return t('testTopicName', topicTitleOf(meta, status.topicId, lang));
}

// One test as a chip: an open test is a button, a locked one is text. Score and tick once tried.
export function testChip(t, status, onOpen, meta = null, lang = 'nl') {
  const name = meta ? testLabel(t, meta, status, lang) : (status.type === 'level' ? t(`level_${status.level}`) : status.topicId);
  const rec = status.record;
  if (!status.open) {
    return h('span', { class: 'test-chip locked', 'aria-label': t('testChipAria', name, t('testRowLocked')) }, name, ' ', h('span', { class: 'muted' }, `(${t('testRowLocked')})`));
  }
  const state = status.passed ? t('testStatePassed') : rec ? t('testStateTried') : t('testStateNew');
  const score = rec ? `${rec.best}%` : null;
  return h('button', {
    type: 'button',
    class: `test-chip btn btn-ghost small${status.passed ? ' passed' : ''}`,
    'aria-label': t('testChipAria', name, score ? `${state}, ${score}` : state),
    onclick: () => onOpen(status.id),
  }, status.passed ? ico('check') : null, status.passed ? ' ' : null, name, score ? ` ${score}` : null);
}

// The row of the four level tests under a module's topics: "Basis ✓ · Werkkennis 72% · Gevorderd (op slot) · Expert (op slot)".
export function testRows(t, state, meta, onOpen, lang = 'nl') {
  const rows = levelTests(state, meta);
  if (!rows.length) return null;
  return h('section', { class: 'tests', 'aria-labelledby': 'tests-title' },
    h('h3', { class: 'topic-title', id: 'tests-title' }, t('testsTitle')),
    h('ul', { class: 'test-rows' }, rows.map((s) => h('li', {}, testChip(t, s, onOpen, meta, lang)))),
    h('p', { class: 'muted small tests-note' }, t('testsNote')));
}

// The bars of a result: one per topic (a level test) or per level (a topic test).
function bars(t, rows) {
  return h('ul', { class: 'test-bars' }, rows.map(({ label, correct, total }) => h('li', { class: 'test-bar' },
    h('span', { class: 'test-bar-label' }, label),
    progressBar(total ? correct / total : 0),
    h('span', { class: 'mono small test-bar-count' }, t('testBarCount', correct, total)))));
}

export function renderTest(app, params, root) {
  const { subject, moduleId, testId } = params || {};
  const t = app.t;
  const exit = () => app.go(...exitTarget(params));
  const meta = MODULES.find((m) => m.id === moduleId);
  const spec = meta ? specOf(meta, testId) : null;
  if (!meta || !spec) { app.go('home'); return; }
  const main = h('main', { class: 'screen practice-test' });
  root.append(
    h('header', { class: 'top round-top' },
      h('button', { class: 'icon-btn', 'aria-label': t('close'), onclick: exit }, ico('x')),
      h('div', { class: 'round-title' }, ico('notebook-pen'), ' ', t('testTitle')), h('div', {})),
    main);
  const title = spec.type === 'topic' ? topicTitleOf(meta, spec.topicId, app.lang) : `${meta.title[app.lang] || meta.title.en} · ${testLabel(t, meta, spec, app.lang)}`;
  const back = () => h('button', { class: 'btn btn-ghost', onclick: exit }, t('backToCourse'));

  if (!testOpen(app.state, meta, spec)) {
    main.replaceChildren(h('section', { class: 'card test-intro' },
      h('h1', { class: 'card-title' }, title),
      h('p', {}, spec.type === 'topic' ? t('testLockedTopic') : t('testLockedLevel', t(`level_${spec.level}`)))), back());
    return;
  }

  const rec = testRecord(app.state, subject, testId);
  const note = h('div', { 'aria-live': 'polite' });
  const start = h('button', { class: 'btn btn-primary btn-big test-start', onclick: () => begin() }, ico('play'), ' ', t('testStart'));
  const intro = spec.type === 'topic' ? t('testIntroTopic', spec.size)
    : spec.final ? t('testIntroFinal', spec.size) : t('testIntroLevel', spec.size, t(`level_${spec.level}`));
  main.replaceChildren(
    h('section', { class: 'card test-intro' },
      h('h1', { class: 'card-title' }, title),
      guideOn(app.state) ? h('div', { class: 'guide-line' }, guide(app.state, { mood: 'idle', size: 32 }), h('p', { class: 'small' }, t('guideTest'))) : null,
      h('p', {}, intro),
      h('p', { class: 'small muted' }, spec.final ? t('testRulesFinal', PASS_PCT, GOLD_PCT) : t('testRules', PASS_PCT)),
      rec ? h('p', { class: 'small test-best' }, t('testBest', rec.best, rec.attempts)) : null),
    note, start, back());

  // A module with a bank must load it: a failed load shows the error and a retry, never a test without it.
  let bankFails = 0;
  function begin() {
    start.disabled = true;
    note.replaceChildren();
    return Promise.all([
      app.openModule(subject, moduleId),
      hasBank(moduleId) ? loadBank(moduleId, app.lang, bankFails) : null,
    ]).then(([mod, bank]) => {
      const pool = testPool(meta, mod.lessons, bank);
      const questions = composeTest(spec, pool, { attempt: rec ? rec.attempts : 0, lastIds: rec ? rec.items : [] });
      if (questions.length < MIN_ITEMS) throw new Error('no questions');
      const box = h('div', {});
      main.replaceChildren(box);
      // The score is written when the last question is answered (onScore), not at Finish:
      // closing on the review card loses nothing; closing before the last question scores nothing.
      let res = null;
      renderQuiz(app, {
        questions,
        onePass: true,
        onScore: (firstTry) => {
          res = applyTest(app.state, { subject, testId, questions, results: firstTry, lang: app.lang }, app.today(), Date.now());
          app.setState(res.state);
        },
        onDone: () => { if (res) showDone(res); },
      }, box);
    }).catch(() => {
      bankFails += 1;
      note.replaceChildren(h('p', { class: 'note' }, t('testLoadError')));
      start.disabled = false;
    });
  }

  function showDone(res) {
    const c = celebration(app, { ...res, xp: res.xp || 0 }, { mark: h('p', { class: 'done-mark' }, ico('notebook-pen')), subject });
    const topics = topicsOf(meta) || [];
    const rows = spec.type === 'topic'
      ? [1, 2, 3, 4].filter((l) => res.byLevel[l]).map((l) => ({ label: t(`level_${l}`), ...res.byLevel[l] }))
      : topics.filter((tp) => res.byTopic[tp.id]).map((tp) => ({ label: tp.title[app.lang] || tp.title.en, ...res.byTopic[tp.id] }));
    const weakId = spec.type === 'level' ? weakestTopic(res.byTopic) : null;
    const weakSpec = weakId ? specOf(meta, `${meta.id}/topic/${weakId}`) : null;
    const weak = weakSpec ? testStatus(app.state, meta, weakSpec) : null;
    main.replaceChildren(h('section', { class: `card lesson-done test-done${c.big ? ' celebrate' : ''}` },
      c.nodes[0],
      h('h2', { class: 'card-title', tabindex: '-1' }, res.passed ? t('testPassed') : t('testFailed')),
      h('p', { class: 'check-score' }, t('testScore', res.correct, res.total, res.pct)),
      spec.final ? h('p', { class: 'small' }, res.gold ? t('testGoldReached') : t('testGoldNeeds', GOLD_PCT)) : null,
      res.passed ? null : h('p', { class: 'small muted' }, t('testNeed', PASS_PCT)),
      res.xp ? h('p', { class: 'xp-line xp-rise' }, `+${res.xp} XP`) : null,
      ...c.nodes.slice(1),
      h('h3', { class: 'topic-title' }, spec.type === 'topic' ? t('testByLevel') : t('testByTopic')),
      bars(t, rows),
      weakId ? h('p', { class: 'small' }, t('testWeakest', topicTitleOf(meta, weakId, app.lang))) : null),
    ...(weak && weak.open ? [h('button', { class: 'btn btn-primary btn-big', onclick: () => app.go('test', { subject, moduleId, testId: weak.id, from: params.from === FROM_MODULE ? FROM_MODULE : undefined }) }, t('testWeakestBtn'))] : []),
    h('button', { class: `btn ${weak && weak.open ? 'btn-ghost' : 'btn-primary btn-big'}`, onclick: exit }, t('backToCourse')));
    // The result starts at the top (the review card above it was long), and a keyboard or
    // screen reader user lands on its heading instead of the page body.
    const head = main.querySelector('.test-done .card-title');
    if (head && head.focus) head.focus({ preventScroll: true });
    if (typeof window !== 'undefined' && window.scrollTo) window.scrollTo(0, 0);
  }
}

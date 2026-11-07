// Quiz: every question once, then a review with the answers, then the misses
// again until each is right once. Shared by lessons and due sessions. Under
// each question a Hint (secondary, once); a correct answer after a hint does
// not climb a box (sure = !hinted).
import { h } from './dom.js';
import { ico } from './icons.js';
import { startQuiz, answerQuiz, backQuiz, continueQuiz, hintQuiz, judge } from '../core/course.js';
import { questionHint } from '../core/hint.js';

const shown = (q, v) => ('number' in q ? `${v}${q.unit ? ` ${q.unit}` : ''}` : v);
const correct = (q) => ('number' in q ? `${String(q.number)}${q.unit ? ` ${q.unit}` : ''}` : q.answer);

// termsOf(question): the terms of the question's lesson, for the hint.
export function renderQuiz(app, { questions, onDone, onBack = null, termsOf = () => [] }, box) {
  const t = app.t;
  let st = startQuiz(questions);
  let lastPass = [];

  const answer = (value) => {
    const q = questions[st.order[st.i]];
    lastPass.push({ q, value, ok: judge(q, value), hinted: !!(st.hints || {})[q.id] });
    st = answerQuiz(st, questions, value);
    draw();
  };

  // Going back restores the answer he gave; a hint he took stays shown.
  const back = () => {
    st = backQuiz(st, questions);
    lastPass.pop();
    draw();
  };

  // The hint's lines; a struck option is also struck in the list itself.
  const hintLines = (hint) => {
    if (!hint) return [];
    const term = hint.term ? h('p', { class: 'hint-term' }, h('b', {}, hint.term.term), `: ${hint.term.def}`) : null;
    if (hint.kind === 'own') return [h('p', {}, hint.text)];
    if (hint.kind === 'choice') return [h('p', {}, t('hintStrike', hint.strike)), term];
    return [hint.step ? h('p', { class: 'hint-step' }, t('hintStep', hint.step)) : null, hint.unit ? h('p', {}, t('hintUnit', hint.unit)) : null, term];
  };

  // Secondary, never the primary button; once per question, then the hint stays.
  function hintParts(q, opts) {
    const hint = questionHint(q, termsOf(q) || []);
    const panel = h('div', { class: 'quiz-hint', 'aria-live': 'polite' });
    const strike = () => {
      if (!opts || !hint || hint.kind !== 'choice') return;
      for (const b of opts.children) {
        if (b.textContent !== hint.strike) continue;
        b.classList.add('struck');
        b.disabled = true;
        b.setAttribute('aria-disabled', 'true');
      }
    };
    const show = () => {
      panel.replaceChildren(h('p', { class: 'hint-title' }, t('hintTitle')), ...hintLines(hint).filter(Boolean));
      panel.classList.add('on');
      strike();
    };
    if ((st.hints || {})[q.id]) { show(); return { panel, btn: null }; }
    const btn = hint ? h('button', {
      class: 'btn btn-ghost small quiz-hint-btn',
      onclick: () => { st = hintQuiz(st, questions); show(); btn.remove(); },
    }, t('hintBtn')) : null;
    return { panel, btn };
  }

  function askCard() {
    const q = questions[st.order[st.i]];
    // Within a pass: take back the last answer. Before the first: back out of
    // the quiz (in a lesson, to the example).
    const backBtn = st.i > 0
      ? h('button', { class: 'btn btn-ghost small quiz-back', onclick: back }, ico('chevron-left'), ' ', t('quizBack'))
      : (onBack && st.pass === 1 ? h('button', { class: 'btn btn-ghost small lesson-back', onclick: onBack }, ico('chevron-left'), ' ', t('lessonBack')) : null);
    const progress = h('p', { class: 'quiz-progress muted small' }, `${st.pass > 1 ? `${t('quizAgain')} · ` : ''}${st.i + 1}/${st.order.length}`);
    // Back on a question he already answered: show what he picked.
    const prev = st.prev && st.prev.id === q.id && st.prev.value != null ? String(st.prev.value) : null;
    const picked = prev ? h('p', { class: 'quiz-picked muted small', 'aria-live': 'polite' }, t('quizPicked', shown(q, prev))) : null;
    if ('number' in q) {
      const input = h('input', { type: 'text', inputmode: 'decimal', class: 'text-input quiz-num', placeholder: t('numericPh'), 'aria-label': t('numericPh') });
      if (prev) input.value = prev;
      const submit = () => { if (input.value.trim()) answer(input.value.trim()); };
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
      setTimeout(() => input.focus(), 0);
      const hp = hintParts(q, null);
      return h('section', { class: 'card quiz-card' }, progress,
        h('p', { class: 'quiz-q' }, q.q),
        hp.panel,
        h('div', { class: 'quiz-num-row' }, input, q.unit ? h('span', { class: 'quiz-unit' }, q.unit) : null),
        picked,
        h('div', { class: 'quiz-actions' }, h('button', { class: 'btn btn-primary', onclick: submit }, t('quizNext')), hp.btn, backBtn));
    }
    const opts = h('div', { class: 'quiz-opts' }, q.options.map((o) => h('button', {
      class: `opt${o === prev ? ' chosen' : ''}`, 'aria-pressed': o === prev ? 'true' : null, onclick: () => answer(o),
    }, o)));
    const hp = hintParts(q, opts);
    return h('section', { class: 'card quiz-card' }, progress,
      h('p', { class: 'quiz-q' }, q.q),
      hp.panel,
      opts,
      picked,
      hp.btn || backBtn ? h('div', { class: 'quiz-actions' }, hp.btn, backBtn) : null);
  }

  function reviewCard() {
    const misses = lastPass.filter((x) => !x.ok).length;
    return h('section', { class: 'card quiz-review' },
      h('h2', { class: 'card-title' }, misses ? t('quizReview') : t('quizClean')),
      // Where he used a hint: marked, so he sees what is not really his yet.
      lastPass.map(({ q, value, ok, hinted }) => h('div', { class: `review-row${ok ? ' ok' : ' miss'}${hinted ? ' hinted' : ''}` },
        h('p', { class: 'quiz-q' }, h('span', { class: 'mark' }, ico(ok ? 'check' : 'x')), ' ', q.q),
        hinted ? h('p', { class: 'hint-mark small' }, t('hintUsed')) : null,
        ok ? null : h('p', { class: 'small' }, t('quizYours', shown(q, value))),
        h('p', { class: 'small' }, h('b', {}, correct(q))),
        h('p', { class: 'muted small' }, q.why))),
      h('button', {
        class: 'btn btn-primary',
        onclick: () => { st = continueQuiz(st); lastPass = []; draw(); },
      }, misses ? t('quizRetry', misses) : t('quizFinish')));
  }

  function draw() {
    // sure is !hinted: the screens pass it on to the scheduling as before.
    if (st.phase === 'done') { onDone(st.firstTry, st.sure || {}); return; }
    box.replaceChildren(st.phase === 'review' ? reviewCard() : askCard());
    window.scrollTo(0, 0);
  }
  draw();
}

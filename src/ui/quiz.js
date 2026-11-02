// Quiz: every question once, then a review with the answers, then the misses
// again until each is right once. Shared by lessons and due sessions.
import { h } from './dom.js';
import { ico } from './icons.js';
import { startQuiz, answerQuiz, backQuiz, continueQuiz, judge } from '../core/course.js';

const shown = (q, v) => ('number' in q ? `${v}${q.unit ? ` ${q.unit}` : ''}` : v);
const correct = (q) => ('number' in q ? `${String(q.number)}${q.unit ? ` ${q.unit}` : ''}` : q.answer);

export function renderQuiz(app, { questions, onDone, onBack = null }, box) {
  const t = app.t;
  let st = startQuiz(questions);
  let lastPass = [];

  // "I'm guessing": off (sure) on every new question; first pass only.
  let guessing = false;
  const answer = (value) => {
    const q = questions[st.order[st.i]];
    const sure = st.pass === 1 ? !guessing : true;
    lastPass.push({ q, value, ok: judge(q, value), sure: st.pass === 1 ? sure : null });
    st = answerQuiz(st, questions, value, sure);
    guessing = false;
    draw();
  };

  const back = () => { st = backQuiz(st, questions); lastPass.pop(); guessing = false; draw(); };

  const guessToggle = () => {
    if (st.pass !== 1) return null;
    const btn = h('button', {
      class: 'btn btn-ghost small guess-toggle', 'aria-pressed': String(guessing),
      onclick: () => { guessing = !guessing; btn.setAttribute('aria-pressed', String(guessing)); btn.classList.toggle('on', guessing); },
    }, t('guessToggle'));
    btn.classList.toggle('on', guessing);
    return h('div', { class: 'guess-row' }, btn);
  };

  function askCard() {
    const q = questions[st.order[st.i]];
    // Within a pass: take back the last answer. Before the first: back out of
    // the quiz (in a lesson, to the example).
    const backBtn = st.i > 0
      ? h('button', { class: 'btn btn-ghost small quiz-back', onclick: back }, ico('chevron-left'), ' ', t('quizBack'))
      : (onBack && st.pass === 1 ? h('button', { class: 'btn btn-ghost small lesson-back', onclick: onBack }, ico('chevron-left'), ' ', t('lessonBack')) : null);
    const progress = h('p', { class: 'quiz-progress muted small' }, `${st.pass > 1 ? `${t('quizAgain')} · ` : ''}${st.i + 1}/${st.order.length}`);
    if ('number' in q) {
      const input = h('input', { type: 'text', inputmode: 'decimal', class: 'text-input quiz-num', placeholder: t('numericPh'), 'aria-label': t('numericPh') });
      const submit = () => { if (input.value.trim()) answer(input.value.trim()); };
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
      setTimeout(() => input.focus(), 0);
      return h('section', { class: 'card quiz-card' }, progress,
        h('p', { class: 'quiz-q' }, q.q),
        guessToggle(),
        h('div', { class: 'quiz-num-row' }, input, q.unit ? h('span', { class: 'quiz-unit' }, q.unit) : null),
        h('button', { class: 'btn btn-primary', onclick: submit }, t('quizNext')), backBtn);
    }
    return h('section', { class: 'card quiz-card' }, progress,
      h('p', { class: 'quiz-q' }, q.q),
      guessToggle(),
      h('div', { class: 'quiz-opts' }, q.options.map((o) => h('button', { class: 'opt', onclick: () => answer(o) }, o))), backBtn);
  }

  function reviewCard() {
    const misses = lastPass.filter((x) => !x.ok).length;
    return h('section', { class: 'card quiz-review' },
      h('h2', { class: 'card-title' }, misses ? t('quizReview') : t('quizClean')),
      lastPass.map(({ q, value, ok, sure }) => {
        // A miss he was sure about: worth reading twice (errors made with confidence are the ones that get fixed).
        const sureMiss = !ok && sure === true;
        return h('div', { class: `review-row${ok ? ' ok' : ' miss'}${sureMiss ? ' sure-miss' : ''}` },
          h('p', { class: 'quiz-q' }, h('span', { class: 'mark' }, ico(ok ? 'check' : 'x')), ' ', q.q),
          sureMiss ? h('p', { class: 'sure-mark small' }, t('sureMiss')) : null,
          ok ? null : h('p', { class: 'small' }, t('quizYours', shown(q, value))),
          h('p', { class: 'small' }, h('b', {}, correct(q))),
          h('p', { class: sureMiss ? 'small why-strong' : 'muted small' }, q.why));
      }),
      h('button', {
        class: 'btn btn-primary',
        onclick: () => { st = continueQuiz(st); lastPass = []; draw(); },
      }, misses ? t('quizRetry', misses) : t('quizFinish')));
  }

  function draw() {
    if (st.phase === 'done') { onDone(st.firstTry, st.sure || {}); return; }
    box.replaceChildren(st.phase === 'review' ? reviewCard() : askCard());
    window.scrollTo(0, 0);
  }
  draw();
}

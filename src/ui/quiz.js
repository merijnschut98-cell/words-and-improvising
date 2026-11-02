// Quiz: every question once, then a review with the answers, then the misses
// again until each is right once. Shared by lessons and due sessions.
import { h } from './dom.js';
import { ico } from './icons.js';
import { startQuiz, answerQuiz, continueQuiz, judge } from '../core/course.js';

const shown = (q, v) => ('number' in q ? `${v}${q.unit ? ` ${q.unit}` : ''}` : v);
const correct = (q) => ('number' in q ? `${String(q.number)}${q.unit ? ` ${q.unit}` : ''}` : q.answer);

export function renderQuiz(app, { questions, onDone }, box) {
  const t = app.t;
  let st = startQuiz(questions);
  let lastPass = [];

  const answer = (value) => {
    const q = questions[st.order[st.i]];
    lastPass.push({ q, value, ok: judge(q, value) });
    st = answerQuiz(st, questions, value);
    draw();
  };

  function askCard() {
    const q = questions[st.order[st.i]];
    const progress = h('p', { class: 'quiz-progress muted small' }, `${st.pass > 1 ? `${t('quizAgain')} · ` : ''}${st.i + 1}/${st.order.length}`);
    if ('number' in q) {
      const input = h('input', { type: 'text', inputmode: 'decimal', class: 'text-input quiz-num', placeholder: t('numericPh'), 'aria-label': t('numericPh') });
      const submit = () => { if (input.value.trim()) answer(input.value.trim()); };
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
      setTimeout(() => input.focus(), 0);
      return h('section', { class: 'card quiz-card' }, progress,
        h('p', { class: 'quiz-q' }, q.q),
        h('div', { class: 'quiz-num-row' }, input, q.unit ? h('span', { class: 'quiz-unit' }, q.unit) : null),
        h('button', { class: 'btn btn-primary', onclick: submit }, t('quizNext')));
    }
    return h('section', { class: 'card quiz-card' }, progress,
      h('p', { class: 'quiz-q' }, q.q),
      h('div', { class: 'quiz-opts' }, q.options.map((o) => h('button', { class: 'opt', onclick: () => answer(o) }, o))));
  }

  function reviewCard() {
    const misses = lastPass.filter((x) => !x.ok).length;
    return h('section', { class: 'card quiz-review' },
      h('h2', { class: 'card-title' }, misses ? t('quizReview') : t('quizClean')),
      lastPass.map(({ q, value, ok }) => h('div', { class: `review-row${ok ? ' ok' : ' miss'}` },
        h('p', { class: 'quiz-q' }, h('span', { class: 'mark' }, ico(ok ? 'check' : 'x')), ' ', q.q),
        ok ? null : h('p', { class: 'small' }, t('quizYours', shown(q, value))),
        h('p', { class: 'small' }, h('b', {}, correct(q))),
        h('p', { class: 'muted small' }, q.why))),
      h('button', {
        class: 'btn btn-primary',
        onclick: () => { st = continueQuiz(st); lastPass = []; draw(); },
      }, misses ? t('quizRetry', misses) : t('quizFinish')));
  }

  function draw() {
    if (st.phase === 'done') { onDone(st.firstTry); return; }
    box.replaceChildren(st.phase === 'review' ? reviewCard() : askCard());
    window.scrollTo(0, 0);
  }
  draw();
}

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

  // "I know it" / "I'm guessing": sure on every new question; first pass only.
  let guessing = false;
  const answer = (value) => {
    const q = questions[st.order[st.i]];
    const sure = st.pass === 1 ? !guessing : true;
    lastPass.push({ q, value, ok: judge(q, value), sure: st.pass === 1 ? sure : null });
    st = answerQuiz(st, questions, value, sure);
    guessing = false;
    draw();
  };

  // Going back restores what he said the first time: the answer and the guess flag.
  const back = () => {
    st = backQuiz(st, questions);
    lastPass.pop();
    guessing = !!(st.prev && st.prev.sure === false);
    draw();
  };

  // Two plain options, sure selected unless he says otherwise.
  const guessToggle = () => {
    if (st.pass !== 1) return null;
    const opt = (value, cls, label) => h('button', {
      class: `${cls}${guessing === value ? ' on' : ''}`, 'aria-pressed': String(guessing === value),
      onclick: () => {
        guessing = value;
        for (const b of row.querySelectorAll('button')) {
          const on = b === sureBtn ? !guessing : guessing;
          b.classList.toggle('on', on);
          b.setAttribute('aria-pressed', String(on));
        }
      },
    }, label);
    const sureBtn = opt(false, 'guess-sure', t('guessSure'));
    const row = h('div', { class: 'segmented guess-row', role: 'group', 'aria-label': t('guessLabel') }, sureBtn, opt(true, 'guess-toggle', t('guessToggle')));
    return row;
  };

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
      return h('section', { class: 'card quiz-card' }, progress,
        h('p', { class: 'quiz-q' }, q.q),
        guessToggle(),
        h('div', { class: 'quiz-num-row' }, input, q.unit ? h('span', { class: 'quiz-unit' }, q.unit) : null),
        picked,
        h('div', { class: 'quiz-actions' }, h('button', { class: 'btn btn-primary', onclick: submit }, t('quizNext')), backBtn));
    }
    return h('section', { class: 'card quiz-card' }, progress,
      h('p', { class: 'quiz-q' }, q.q),
      guessToggle(),
      h('div', { class: 'quiz-opts' }, q.options.map((o) => h('button', {
        class: `opt${o === prev ? ' chosen' : ''}`, 'aria-pressed': o === prev ? 'true' : null, onclick: () => answer(o),
      }, o))),
      picked,
      backBtn ? h('div', { class: 'quiz-actions' }, backBtn) : null);
  }

  function reviewCard() {
    const misses = lastPass.filter((x) => !x.ok).length;
    return h('section', { class: 'card quiz-review' },
      h('h2', { class: 'card-title' }, misses ? t('quizReview') : t('quizClean')),
      lastPass.map(({ q, value, ok, sure }) => {
        // A miss he did not mark as a guess: worth reading twice (errors made with confidence are the ones that get fixed).
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

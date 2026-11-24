// Quiz: every question once, then a review with the answers, then the misses
// again until each is right once. Shared by lessons and due sessions. Under
// each question a Hint (secondary, once); a correct answer after a hint does
// not climb a box (sure = !hinted).
import { h } from './dom.js';
import { ico } from './icons.js';
import { startQuiz, answerQuiz, backQuiz, continueQuiz, hintQuiz, skipQuiz, judge, guessCompare } from '../core/course.js';
import { questionHint } from '../core/hint.js';
import { kindOf, grade, answerText, valueText } from '../core/questionkinds.js';
import { hasBody, kindBody } from './quizkinds.js';
import { guide, guideLine } from './guide.js';

const shown = (q, v) => valueText(q, v);
const correct = (q) => answerText(q);
const KIND_LABEL = { best: 'kindBest', all: 'kindAll', gap: 'kindGap', order: 'kindOrder', match: 'kindMatch' };

// termsOf(question): the terms of the question's lesson, for the hint.
// onePass (the module check, v16): one pass, no hint, no back, no retry
// passes; the review ends the quiz.
// skippable (due sessions, v18): an "Overslaan" under each first-pass question; it is not an answer.
// onScore (onePass only, v18 T2): called once, with the first-try results, as soon as the
// last question is answered, before the review card, so closing on the review loses nothing.
// flag (onePass, v18 T3, the AI extra tests): { canFlag(q), isFlagged(q), onFlag(q) }. A "Klopt niet" button under the
// questions it applies to; flagged before answering it moves on (unanswered, the caller leaves it out of the score), in the
// review it marks the row. The caller keeps the list.
export function renderQuiz(app, { questions, onDone, onBack = null, termsOf = () => [], onePass = false, skippable = false, onScore = null, flag = null }, box) {
  const t = app.t;
  let st = startQuiz(questions);
  let scored = false;
  let lastPass = [];
  let saidWrong = false; // the guide's line on a miss comes once per quiz (v16)

  const answer = (value) => {
    const q = questions[st.order[st.i]];
    lastPass.push({ q, value, ok: judge(q, value), hinted: !!(st.hints || {})[q.id] });
    st = answerQuiz(st, questions, value);
    if (onePass && onScore && !scored && st.phase !== 'ask') { scored = true; onScore(st.firstTry, st.sure || {}); }
    draw();
  };

  // Going back restores the answer he gave; a hint he took stays shown.
  const back = () => {
    st = backQuiz(st, questions);
    lastPass.pop();
    draw();
  };

  // Ghost button: the question goes to the end; skipped again it stays due, unanswered, unpenalised.
  const skipBtn = () => (skippable && !onePass && st.pass === 1
    ? h('button', { class: 'btn btn-ghost small quiz-skip', onclick: () => { st = skipQuiz(st, questions); draw(); } }, t('quizSkip'))
    : null);

  const flagBtn = (q, inReview = false) => (flag && flag.canFlag(q) && !flag.isFlagged(q)
    ? h('button', { class: 'btn btn-ghost small quiz-flag', onclick: () => { flag.onFlag(q); if (inReview) draw(); else answer(null); } }, t('testFlag'))
    : null);

  // The hint's lines; a struck option is also struck in the list itself.
  const hintLines = (hint) => {
    if (!hint) return [];
    const term = hint.term ? h('p', { class: 'hint-term' }, h('b', {}, hint.term.term), `: ${hint.term.def}`) : null;
    if (hint.kind === 'own') return [h('p', {}, hint.text)];
    if (hint.kind === 'choice') return [h('p', {}, t('hintStrike', hint.strike)), term];
    if (hint.kind === 'count') return [h('p', {}, t('hintCount', hint.count))];
    if (hint.kind === 'letter') return [h('p', {}, t('hintLetter', hint.letter))];
    if (hint.kind === 'first') return [h('p', {}, t('hintFirst', hint.item))];
    if (hint.kind === 'pair') return [h('p', {}, t('hintPair', hint.left, hint.right))];
    return [hint.step ? h('p', { class: 'hint-step' }, t('hintStep', hint.step)) : null, hint.unit ? h('p', {}, t('hintUnit', hint.unit)) : null, term];
  };

  // Secondary, never the primary button; once per question, then the hint stays.
  function hintParts(q, opts, apply = null) {
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
      if (apply) apply(hint);
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
    const backBtn = onePass ? null : st.i > 0
      ? h('button', { class: 'btn btn-ghost small quiz-back', onclick: back }, ico('chevron-left'), ' ', t('quizBack'))
      : (onBack && st.pass === 1 ? h('button', { class: 'btn btn-ghost small lesson-back', onclick: onBack }, ico('chevron-left'), ' ', t('lessonBack')) : null);
    const skip = skipBtn();
    const progress = h('p', { class: 'quiz-progress muted small' }, `${st.pass > 1 ? `${t('quizAgain')} · ` : ''}${st.i + 1}/${st.order.length}`);
    // Back on a question he already answered: show what he picked.
    const prev = st.prev && st.prev.id === q.id && st.prev.value != null && !hasBody(kindOf(q)) ? String(st.prev.value) : null;
    const picked = prev ? h('p', { class: 'quiz-picked muted small', 'aria-live': 'polite' }, t('quizPicked', shown(q, prev))) : null;
    // The guess from the start of the lesson, back as the last question (v16):
    // what he guessed is shown and preselected; he keeps it or changes it.
    const hasGuess = 'guess' in q && q.guess != null && q.guess !== '?';
    const guessLine = 'guess' in q ? h('p', { class: 'quiz-guess muted small' }, ico('repeat'), ' ', hasGuess ? t('quizGuessWas', shown(q, q.guess)) : t('quizGuessBack')) : null;
    if (kindOf(q) === 'num') {
      const input = h('input', { type: 'text', inputmode: 'decimal', class: 'text-input quiz-num', placeholder: t('numericPh'), 'aria-label': t('numericPh') });
      if (prev) input.value = prev;
      else if (hasGuess) input.value = String(q.guess);
      const submit = () => { if (input.value.trim()) answer(input.value.trim()); };
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
      setTimeout(() => input.focus(), 0);
      const hp = onePass ? { panel: null, btn: null } : hintParts(q, null);
      return h('section', { class: 'card quiz-card' }, progress,
        guessLine,
        h('p', { class: 'quiz-q' }, q.q),
        hp.panel,
        h('div', { class: 'quiz-num-row' }, input, q.unit ? h('span', { class: 'quiz-unit' }, q.unit) : null),
        picked,
        h('div', { class: 'quiz-actions' }, h('button', { class: 'btn btn-primary', onclick: submit }, t('quizNext')), hp.btn, backBtn, skip, flagBtn(q)));
    }
    const kind = kindOf(q);
    if (hasBody(kind)) {
      const body = kindBody(kind, q, { t, prev: st.prev && st.prev.id === q.id ? st.prev.value : null, submit: answer });
      const hp = onePass ? { panel: null, btn: null } : hintParts(q, null, body.applyHint);
      return h('section', { class: 'card quiz-card' }, progress,
        h('p', { class: 'quiz-q' }, q.q),
        h('p', { class: 'quiz-kind muted small' }, t(KIND_LABEL[kind])),
        hp.panel,
        body.el,
        hp.btn || backBtn || skip || flagBtn(q) ? h('div', { class: 'quiz-actions' }, hp.btn, backBtn, skip, flagBtn(q)) : null);
    }
    const mark = prev != null ? prev : hasGuess ? String(q.guess) : null;
    const opts = h('div', { class: 'quiz-opts' }, q.options.map((o) => h('button', {
      class: `opt${o === mark ? ' chosen' : ''}`, 'aria-pressed': o === mark ? 'true' : null, onclick: () => answer(o),
    }, o)));
    const hp = onePass ? { panel: null, btn: null } : hintParts(q, opts);
    return h('section', { class: 'card quiz-card' }, progress,
      guessLine,
      h('p', { class: 'quiz-q' }, q.q),
      kind === 'best' ? h('p', { class: 'quiz-kind muted small' }, t('kindBest')) : null,
      hp.panel,
      opts,
      picked,
      hp.btn || backBtn || skip || flagBtn(q) ? h('div', { class: 'quiz-actions' }, hp.btn, backBtn, skip, flagBtn(q)) : null);
  }

  // Guess at the start → answer now → the right answer, each marked, so he
  // sees what the lesson changed.
  function guessSteps(q, value) {
    const c = guessCompare(q, value);
    const step = (label, text, ok) => h('li', { class: `guess-step ${ok ? 'ok' : 'miss'}` },
      h('span', { class: 'muted' }, label), ' ', ico(ok ? 'check' : 'x'), ' ', text);
    return h('ol', { class: 'guess-steps small', 'aria-label': t('quizGuessCompare') },
      step(t('quizGuessStart'), c.guess, c.guessOk),
      step(t('quizGuessNow'), c.now, c.nowOk),
      h('li', { class: 'guess-step answer' }, h('span', { class: 'muted' }, t('quizGuessRight')), ' ', h('b', {}, c.answer)));
  }

  // What the review adds per kind: the runner-up, how many ticks were right,
  // the typo, the wrong places and the wrong pairs.
  function kindDetail(q, value, ok) {
    const g = grade(q, value);
    const note = (text) => h('p', { class: 'small review-detail' }, text);
    if (g.kind === 'best') return note(t('reviewAlso', q.close));
    if (g.kind === 'all' && !g.exact) return note(t('reviewAllScore', g.right, g.total, g.wrong));
    if (g.kind === 'gap' && g.typo) return note(t('reviewTypo', g.spelled));
    if (g.kind === 'order' && !ok) return note(t('reviewOrderWrong', g.wrongAt.length));
    if (g.kind === 'match' && !ok) return note(t('reviewMatchWrong', g.wrongLeft.join(', ')));
    return null;
  }

  // The right answer; an order or a set of pairs reads better as a list.
  function answerNode(q) {
    const kind = kindOf(q);
    if (kind === 'order') return h('ol', { class: 'review-list small' }, q.items.map((x) => h('li', {}, h('b', {}, x))));
    if (kind === 'match') return h('ul', { class: 'review-list small' }, q.pairs.map(([l, r]) => h('li', {}, h('b', {}, `${l} → ${r}`))));
    return h('p', { class: 'small' }, h('b', {}, correct(q)));
  }

  function reviewCard() {
    // a flagged question ("Klopt niet") is not a miss: it is left out of the score
    const misses = lastPass.filter((x) => !x.ok && !(flag && flag.isFlagged(x.q))).length;
    // The guide reacts here, not per tap: all right lights the top (no line),
    // a miss lights the middle ochre with one line, once per quiz.
    const g = guide(app.state, { mood: misses ? 'wrong' : 'right', size: 32 });
    const say = g && misses && !saidWrong ? guideLine(t, 'guideWrong', app.today ? app.today() : '') : null;
    if (say) saidWrong = true;
    return h('section', { class: 'card quiz-review' },
      h('div', { class: 'review-head' }, g, h('h2', { class: 'card-title' }, misses ? t('quizReview') : t('quizClean'))),
      say ? h('p', { class: 'guide-say small muted' }, say) : null,
      // Where he used a hint: marked, so he sees what is not really his yet.
      lastPass.map(({ q, value, ok, hinted }) => (flag && flag.isFlagged(q) ? h('div', { class: 'review-row flagged' },
        h('p', { class: 'quiz-q' }, q.q),
        h('p', { class: 'muted small' }, t('testFlagged'))) : h('div', { class: `review-row${ok ? ' ok' : ' miss'}${hinted ? ' hinted' : ''}${'guess' in q ? ' guess-row-back' : ''}` },
        h('p', { class: 'quiz-q' }, h('span', { class: 'mark' }, ico(ok ? 'check' : 'x')), ' ', q.q),
        hinted ? h('p', { class: 'hint-mark small' }, t('hintUsed')) : null,
        'guess' in q ? guessSteps(q, value) : [
          ok ? null : h('p', { class: 'small' }, t('quizYours', shown(q, value))),
          kindDetail(q, value, ok),
          answerNode(q)],
        h('p', { class: 'muted small' }, q.why),
        flagBtn(q, true)))),
      onePass
        ? h('button', { class: 'btn btn-primary', onclick: () => onDone(st.firstTry, st.sure || {}) }, t('quizFinish'))
        : h('button', {
          class: 'btn btn-primary',
          onclick: () => { st = continueQuiz(st); lastPass = []; draw(); },
        }, misses ? t('quizRetry', misses) : t('quizFinish')));
  }

  function draw() {
    // sure is !hinted: the screens pass it on to the scheduling as before.
    if (st.phase === 'done') { onDone(st.firstTry, st.sure || {}); return; }
    // A keyboard or screen reader user who just answered lands on the next
    // card's heading, not on the page body (an input still takes focus itself).
    const had = typeof box.contains === 'function' && typeof document !== 'undefined' && box.contains(document.activeElement);
    box.replaceChildren(st.phase === 'review' ? reviewCard() : askCard());
    const head = had ? box.querySelector('.card-title, .quiz-q') : null;
    if (head && head.focus) { head.setAttribute('tabindex', '-1'); head.focus({ preventScroll: true }); }
    window.scrollTo(0, 0);
  }
  draw();
}

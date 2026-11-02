// A lesson: guess first (prequestions), read in short blocks, see an example,
// then the quiz. Passing unlocks the situation and the say-it round.
import { h } from './dom.js';
import { ico } from './icons.js';
import { renderQuiz } from './quiz.js';
import { applyLesson, addPlan, lessonPhases, lessonSteps, recallQuestions, guessFeedback, lessonBack } from '../core/course.js';
import { metaOf } from '../content/courses/index.js';
import { runExplain } from '../core/coursecoach.js';
import { figureFrame } from './figure.js';

// Where he is in the lesson: Guess · Read · Example · Check, the current one
// marked. With onJump, a step already done is a button back to it.
export function stepIndicator(t, phases, current, onJump = null) {
  return h('ol', { class: 'steps', 'aria-label': t('stepsLabel') }, lessonSteps(phases, current).map((st, i) => {
    const label = [st.state === 'done' ? ico('check') : null, h('span', {}, t(`step_${st.id}`))];
    const inner = onJump && st.state === 'done'
      ? h('button', { class: 'step-jump', 'aria-label': t('stepGoTo', t(`step_${st.id}`)), onclick: () => onJump(i) }, ...label)
      : label;
    return h('li', { class: `step step-${st.state}`, 'aria-current': st.state === 'current' ? 'step' : null }, ...[].concat(inner));
  }));
}

export function renderLesson(app, { subject, moduleId, lessonId }, root) {
  const t = app.t;
  const seq = app.navSeq;
  const title = h('div', { class: 'round-title' }, t('lessonTitle'));
  const main = h('main', { class: 'screen lesson' }, h('p', { class: 'muted loading' }, '…'));
  let onLeave = null; // the plan from the done card is saved on the way out
  root.append(
    h('header', { class: 'top round-top' },
      h('button', { class: 'icon-btn', 'aria-label': t('close'), onclick: () => app.go('home') }, ico('x')),
      title, h('div', {})),
    main);

  const fail = () => {
    if (seq !== app.navSeq) return;
    main.replaceChildren(h('section', { class: 'card load-error' },
      h('p', {}, t('loadError')),
      h('div', { class: 'row' },
        h('button', { class: 'btn btn-primary', onclick: () => app.go('lesson', { subject, moduleId, lessonId }) }, t('retry')),
        h('button', { class: 'btn btn-ghost', onclick: () => app.go('home') }, t('backToCourse')))));
  };

  app.openModule(subject, moduleId).then((mod) => {
    if (seq !== app.navSeq) return;
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (!lesson) { fail(); return; }
    const meta = metaOf(moduleId);
    title.textContent = lesson.title;
    run(lesson, meta);
  }).catch(fail);
  return () => { if (onLeave) onLeave(); };

  function run(lesson, meta) {
    const phases = lessonPhases(lesson);
    let p = 0;
    let block = 0;
    let pre = 0;
    let finished = false;
    const guesses = []; // his first guesses; going back shows them, never changes them
    let planDraft = '';
    onLeave = () => {
      onLeave = null;
      if (!planDraft.trim()) return;
      const id = `p${Date.now().toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`;
      app.setState(addPlan(app.state, { subject, lessonId: lesson.id, text: planDraft }, app.today(), id));
    };
    const next = () => { p += 1; block = 0; draw(); };
    const jump = (i) => { finished = false; p = i; block = 0; if (phases[i] === 'pre') pre = 0; draw(); };
    const goBack = () => { const b = lessonBack({ p, block, pre }, phases, lesson); if (b) { ({ p, block, pre } = b); draw(); } };
    const backBtn = () => (lessonBack({ p, block, pre }, phases, lesson)
      ? h('button', { class: 'btn btn-ghost lesson-back', onclick: goBack }, ico('chevron-left'), ' ', t('lessonBack'))
      : null);
    const dots = (n, i) => h('div', { class: 'dots', 'aria-hidden': 'true' }, Array.from({ length: n }, (_, k) => h('i', { class: k <= i ? 'on' : '' })));
    // Every step starts with the indicator; the rest of the screen follows it.
    const show = (...nodes) => main.replaceChildren(stepIndicator(t, phases, finished ? 'done' : phases[p], jump), ...nodes.filter(Boolean));

    function draw() {
      const phase = phases[p];
      window.scrollTo(0, 0);
      if (phase === 'pre') {
        const q = lesson.pre[pre];
        const pick = (o) => {
          if (guesses[pre] == null) guesses[pre] = o;
          show(h('section', { class: 'card pre-card' },
            h('p', { class: 'quiz-q' }, q.q),
            h('p', { class: 'muted' }, t('preGuessed', guesses[pre])),
            h('button', {
              class: 'btn btn-primary',
              onclick: () => { if (pre + 1 < lesson.pre.length) { pre += 1; draw(); } else next(); },
            }, t('quizNext'))), backBtn());
        };
        if (guesses[pre] != null) { pick(guesses[pre]); return; }
        show(h('section', { class: 'card pre-card' },
          h('p', { class: 'muted small' }, t('preHint')),
          h('p', { class: 'quiz-q' }, q.q),
          'number' in q
            ? (() => {
              const input = h('input', { type: 'text', inputmode: 'decimal', class: 'text-input quiz-num', placeholder: t('numericPh'), 'aria-label': t('numericPh') });
              return h('div', {}, h('div', { class: 'quiz-num-row' }, input, q.unit ? h('span', { class: 'quiz-unit' }, q.unit) : null),
                h('button', { class: 'btn btn-primary', onclick: () => pick(input.value.trim() || '?') }, t('quizNext')));
            })()
            : h('div', { class: 'quiz-opts' }, q.options.map((o) => h('button', { class: 'opt', onclick: () => pick(o) }, o)))), backBtn());
        return;
      }
      if (phase === 'teach') {
        const last = block === lesson.teach.length - 1;
        show(
          h('section', { class: 'card teach-card' }, dots(lesson.teach.length, block),
            h('p', { class: 'teach-text' }, lesson.teach[block]),
            last ? h('p', { class: 'said' }, lesson.said) : null,
            last && lesson.figure ? figureFrame(app, lesson.figure) : null,
            last && app.state.settings.apiKey ? explainBox(lesson) : null),
          h('button', {
            class: 'btn btn-primary btn-big',
            onclick: () => { if (last) next(); else { block += 1; draw(); } },
          }, t('quizNext')), backBtn());
        return;
      }
      if (phase === 'example') {
        const ex = lesson.example;
        if (ex.kind === 'faded') {
          const input = h('textarea', { class: 'text-input', rows: 3, placeholder: t('lessonWhatNextPh'), 'aria-label': ex.ask });
          const reveal = h('div', {});
          show(h('section', { class: 'card example-card' },
            h('p', { class: 'teach-text' }, ex.text),
            h('p', { class: 'example-ask' }, h('b', {}, ex.ask)),
            input,
            reveal,
            h('button', {
              class: 'btn btn-primary reveal-btn',
              onclick: (e) => {
                e.currentTarget.remove();
                reveal.replaceChildren(h('p', { class: 'teach-text reveal' }, ex.reveal),
                  h('button', { class: 'btn btn-primary', onclick: next }, t('quizNext')));
              },
            }, t('reveal'))), backBtn());
          return;
        }
        show(h('section', { class: 'card example-card' },
          h('p', { class: 'teach-text' }, ex.text)),
        h('button', { class: 'btn btn-primary btn-big', onclick: next }, t('quizNext')), backBtn());
        return;
      }
      if (phase === 'quiz') {
        const box = h('div', {});
        show(box);
        renderQuiz(app, {
          questions: recallQuestions(lesson),
          onBack: goBack,
          onDone: (firstTry) => {
            const res = applyLesson(app.state, { subject, lessonId: lesson.id, firstTry, lang: app.lang }, app.today(), Date.now());
            app.setState(res.state);
            done(res.xp);
          },
        }, box);
      }
    }

    // With a key: one line about his own context, and the coach relates the lesson to it.
    function explainBox(lesson) {
      const out = h('div', { class: 'explain-out' });
      const open = h('button', {
        class: 'btn btn-ghost small',
        onclick: () => {
          const input = h('input', { type: 'text', class: 'text-input', maxlength: 200, placeholder: t('explainCtxPh'), 'aria-label': t('explainCtxPh') });
          const go = h('button', {
            class: 'btn btn-primary small',
            onclick: async () => {
              if (!input.value.trim()) { input.focus(); return; }
              go.disabled = true;
              out.replaceChildren(h('p', { class: 'muted small' }, t('coachThinking')));
              const res = await runExplain(app.state.settings.apiKey, { lesson, context: input.value.trim(), lang: app.lang, model: app.state.settings.model });
              if (!out.isConnected) return;
              go.disabled = false;
              out.replaceChildren(res.ok ? h('p', { class: 'said' }, res.text) : h('p', { class: 'note' }, t('loadError')));
            },
          }, t('explainGo'));
          open.replaceWith(h('div', { class: 'explain-ask' }, input, go));
        },
      }, t('explainMine'));
      return h('div', { class: 'explain' }, open, out);
    }

    // The guesses from the start, now with the answer: the gap is the lesson.
    function guessCard() {
      const fb = guessFeedback(lesson, guesses);
      if (!fb.length) return null;
      return h('section', { class: 'card guess-review' },
        h('h2', { class: 'card-title' }, t('guessTitle')),
        fb.map(({ q, guess, answer, ok, why }) => h('div', { class: `review-row${ok ? ' ok' : ' miss'}` },
          h('p', { class: 'quiz-q' }, h('span', { class: 'mark' }, ico(ok ? 'check' : 'x')), ' ', q),
          ok ? null : h('p', { class: 'small' }, t('guessYours', guess)),
          h('p', { class: 'small' }, h('b', {}, answer)),
          h('p', { class: 'muted small' }, why))));
    }

    // Where he will use it: an if-then plan, optional, no extra button.
    function planCard() {
      return h('section', { class: 'card plan-card' },
        h('label', { class: 'plan-label', for: 'plan-input' }, t('planLabel')),
        h('textarea', {
          id: 'plan-input', class: 'text-input plan-input', rows: 2, maxlength: 160, placeholder: t('planPh'),
          oninput: (e) => { planDraft = e.currentTarget.value; },
        }, planDraft),
        h('p', { class: 'muted small' }, t('planHint')));
    }

    function done(xp) {
      finished = true;
      show(h('section', { class: 'card lesson-done' },
        h('p', { class: 'done-mark' }, ico('graduation-cap')),
        h('h2', { class: 'card-title' }, t('lessonPassed')),
        xp ? h('p', { class: 'xp-line' }, `+${xp} XP`) : h('p', { class: 'muted' }, t('lessonRetake')),
        h('p', { class: 'muted small' }, t('lessonComesBack'))),
      guessCard(),
      planCard(),
      h('button', { class: 'btn btn-primary btn-big', onclick: () => app.go('situation', { subject, moduleId: meta.id, lessonId: lesson.id }) }, ico('drama'), ' ', t('openSituation')),
      h('button', { class: 'btn btn-ghost', onclick: () => app.startSayIt(subject, meta.id, lesson.id) }, ico('mic'), ' ', t('openSayIt')),
      h('button', { class: 'btn btn-ghost', onclick: () => app.go('home') }, t('backToCourse')));
    }

    draw();
  }
}

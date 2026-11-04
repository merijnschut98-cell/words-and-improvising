// A lesson: guess first (prequestions), read in short blocks, see an example,
// then the quiz. Passing unlocks the situation and the say-it round.
import { h } from './dom.js';
import { ico } from './icons.js';
import { renderQuiz } from './quiz.js';
import { applyLesson, nextLesson, savePlanDraft, commitPlanDraft, newPlanId, lessonPhases, lessonSteps, recallQuestions, guessFeedback, lessonBack, paragraphs, linkTerms, glossary } from '../core/course.js';
import { metaOf, placeOf } from '../content/courses/index.js';
import { placeLabel } from './coursehome.js';
import { runExplain, runExplainBack } from '../core/coursecoach.js';
import { figureFrame } from './figure.js';

// Where he is in the lesson: Guess · Read · Example · Check, the current one
// marked. With onJump, a step already done is a button back to it.
// Learning text: one <p> per paragraph (a blank line in the content).
// Learning text: one <p> per paragraph (a blank line in the content). With
// terms, the first use of each glossary term is a button; a tap shows what it
// means right under that paragraph.
export function prose(cls, text, terms = []) {
  return h('div', { class: cls }, paragraphs(text).map((para) => {
    const def = h('p', { class: 'term-def muted small', hidden: true, 'aria-live': 'polite' });
    let open = null;
    const parts = linkTerms(para, terms).map((seg) => {
      if (!seg.term) return seg.text;
      const btn = h('button', { type: 'button', class: 'term', 'aria-expanded': 'false' }, seg.text);
      // The English word right after the Dutch term, highlighted.
      const en = seg.en ? h('span', { class: 'term-en', lang: 'en' }, ` (${seg.en})`) : null;
      btn.onclick = () => {
        const same = open === btn;
        if (open) open.setAttribute('aria-expanded', 'false');
        open = same ? null : btn;
        def.hidden = same;
        if (!same) {
          btn.setAttribute('aria-expanded', 'true');
          def.replaceChildren(h('b', {}, seg.term), seg.en ? h('span', { class: 'term-en', lang: 'en' }, ` · EN: ${seg.en}`) : null, ': ', seg.def);
        }
      };
      return en ? [btn, en] : btn;
    });
    return [h('p', {}, parts), def];
  }));
}

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

  app.openModuleTerms(subject, moduleId).then((mod) => {
    if (seq !== app.navSeq) return;
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (!lesson) { fail(); return; }
    const meta = metaOf(moduleId);
    title.textContent = lesson.title;
    run(lesson, meta, glossary([{ ...mod, id: moduleId }]));
  }).catch(fail);
  return () => { if (onLeave) onLeave(); };

  function run(lesson, meta, terms = []) {
    const phases = lessonPhases(lesson);
    let p = 0;
    let block = 0;
    let pre = 0;
    let finished = false;
    const guesses = []; // his first guesses; going back shows them, never changes them
    let planDraft = '';
    let planTimer = null;
    // While he types the draft is kept on this device; leaving turns it into the plan.
    const keepDraft = () => { clearTimeout(planTimer); planTimer = null; app.setState(savePlanDraft(app.state, { subject, lessonId: lesson.id, text: planDraft })); };
    onLeave = () => {
      onLeave = null;
      if (planTimer) keepDraft();
      app.setState(commitPlanDraft(app.state, app.today(), newPlanId()));
    };
    const next = () => { p += 1; block = 0; draw(); };
    const jump = (i) => { finished = false; p = i; block = 0; if (phases[i] === 'pre') pre = 0; draw(); };
    const goBack = () => { const b = lessonBack({ p, block, pre }, phases, lesson); if (b) { ({ p, block, pre } = b); draw(); } };
    const backBtn = () => (lessonBack({ p, block, pre }, phases, lesson)
      ? h('button', { class: 'btn btn-ghost lesson-back', onclick: goBack }, ico('chevron-left'), ' ', t('lessonBack'))
      : null);
    const dots = (n, i) => h('div', { class: 'dots', 'aria-hidden': 'true' }, Array.from({ length: n }, (_, k) => h('i', { class: k <= i ? 'on' : '' })));
    // Every step starts with the indicator; the rest of the screen follows it.
    // A topic lesson says where it sits ("Draaien · Gevorderd") above the steps.
    const place = placeOf(lesson.id);
    const placeText = place ? placeLabel(t, app.lang, lesson.id) : '';
    const show = (...nodes) => main.replaceChildren(...[
      placeText ? h('p', { class: 'lesson-place muted small' }, placeText) : null,
      stepIndicator(t, phases, finished ? 'done' : phases[p], jump), ...nodes].filter(Boolean));

    function draw() {
      const phase = phases[p];
      window.scrollTo(0, 0);
      if (phase === 'pre') {
        const q = lesson.pre[pre];
        const pick = (o) => {
          if (guesses[pre] == null) guesses[pre] = o;
          show(h('section', { class: 'card pre-card' },
            h('p', { class: 'quiz-q' }, q.q),
            h('p', { class: 'muted' }, t('preGuessed', guesses[pre]))),
          h('button', {
            class: 'btn btn-primary btn-big pre-next',
            onclick: () => { if (pre + 1 < lesson.pre.length) { pre += 1; draw(); } else next(); },
          }, t('quizNext')), backBtn());
        };
        if (guesses[pre] != null) { pick(guesses[pre]); return; }
        if ('number' in q) {
          const input = h('input', { type: 'text', inputmode: 'decimal', class: 'text-input quiz-num', placeholder: t('numericPh'), 'aria-label': t('numericPh') });
          show(h('section', { class: 'card pre-card' },
            h('p', { class: 'muted small' }, t('preHint')),
            h('p', { class: 'quiz-q' }, q.q),
            h('div', { class: 'quiz-num-row' }, input, q.unit ? h('span', { class: 'quiz-unit' }, q.unit) : null)),
          h('button', { class: 'btn btn-primary btn-big pre-next', onclick: () => pick(input.value.trim() || '?') }, t('quizNext')), backBtn());
          return;
        }
        show(h('section', { class: 'card pre-card' },
          h('p', { class: 'muted small' }, t('preHint')),
          h('p', { class: 'quiz-q' }, q.q),
          h('div', { class: 'quiz-opts' }, q.options.map((o) => h('button', { class: 'opt', onclick: () => pick(o) }, o)))), backBtn());
        return;
      }
      if (phase === 'teach') {
        const last = block === lesson.teach.length - 1;
        show(
          h('section', { class: 'card teach-card' }, dots(lesson.teach.length, block),
            prose('teach-text', lesson.teach[block], terms),
            last ? h('p', { class: 'said' }, lesson.said) : null,
            last && lesson.figure ? figureFrame(app, lesson.figure, place && place.level) : null,
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
            prose('teach-text', ex.text, terms),
            h('p', { class: 'example-ask' }, h('b', {}, ex.ask)),
            input,
            reveal,
            h('button', {
              class: 'btn btn-primary reveal-btn',
              onclick: (e) => {
                e.currentTarget.remove();
                reveal.replaceChildren(prose('teach-text reveal', ex.reveal, terms),
                  h('button', { class: 'btn btn-primary', onclick: next }, t('quizNext')));
              },
            }, t('reveal'))), backBtn());
          return;
        }
        show(h('section', { class: 'card example-card' },
          prose('teach-text', ex.text, terms)),
        h('button', { class: 'btn btn-primary btn-big', onclick: next }, t('quizNext')), backBtn());
        return;
      }
      if (phase === 'quiz') {
        const box = h('div', {});
        show(box);
        renderQuiz(app, {
          questions: recallQuestions(lesson),
          onBack: goBack,
          onDone: (firstTry, sure) => {
            const res = applyLesson(app.state, { subject, lessonId: lesson.id, firstTry, sure, lang: app.lang }, app.today(), Date.now());
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
          input.value = String(app.state.settings.context || '').slice(0, 200);
          const go = h('button', {
            class: 'btn btn-ghost small',
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

    // Where he will use it: an if-then plan, optional, no extra button. A quiet
    // "Saved" once he pauses typing.
    function planCard() {
      const status = h('span', { class: 'plan-saved small', 'aria-live': 'polite' });
      return h('section', { class: 'card plan-card' },
        h('label', { class: 'plan-label', for: 'plan-input' }, t('planLabel')),
        h('textarea', {
          id: 'plan-input', class: 'text-input plan-input', rows: 2, maxlength: 160, placeholder: t('planPh'),
          oninput: (e) => {
            planDraft = e.currentTarget.value;
            status.replaceChildren();
            clearTimeout(planTimer);
            planTimer = setTimeout(() => {
              keepDraft();
              if (status.isConnected && planDraft.trim()) status.replaceChildren(ico('check'), ' ', t('planSaved'));
            }, 700);
          },
        }, planDraft),
        h('div', { class: 'plan-foot' }, h('p', { class: 'muted small' }, t('planHint')), status));
    }

    // Explain-back on the done card: he explains first. With a key the coach
    // grades three points and asks about one gap; without one he ticks the
    // terms he used. Practice only: no XP, not a round.
    function explainBack() {
      const ta = h('textarea', { class: 'text-input eb-text', rows: 4, placeholder: t('ebPh'), 'aria-label': t('ebPh') });
      const key = app.state.settings.apiKey;
      let body;
      if (key) {
        const out = h('div', { class: 'eb-out', 'aria-live': 'polite' });
        const go = h('button', {
          class: 'btn btn-ghost small eb-check',
          onclick: async () => {
            if (!ta.value.trim()) { ta.focus(); return; }
            go.disabled = true;
            out.replaceChildren(h('p', { class: 'muted small' }, t('coachThinking')));
            const res = await runExplainBack(key, { lesson, text: ta.value.trim(), lang: app.lang, model: app.state.settings.model });
            if (!out.isConnected) return;
            go.disabled = false;
            out.replaceChildren(res.ok
              ? h('div', {}, h('p', { class: 'xp-line' }, t('ebPoints', res.points.reduce((a, b) => a + b, 0), 3)), res.question ? h('p', { class: 'said' }, res.question) : null)
              : h('p', { class: 'note' }, t('loadError')));
          },
        }, t('ebCheck'));
        body = [ta, go, out];
      } else {
        const terms = lesson.terms || [];
        const count = h('p', { class: 'muted small eb-count', 'aria-live': 'polite' }, t('ebPoints', 0, terms.length));
        const boxes = terms.map((x) => h('label', { class: 'rubric-line' },
          h('input', { type: 'checkbox', onchange: () => { count.textContent = t('ebPoints', boxes.filter((b) => b.querySelector('input').checked).length, terms.length); } }),
          h('span', {}, x.term)));
        body = [ta, h('p', { class: 'quiz-q' }, t('ebSelf')), boxes, count];
      }
      return h('details', { class: 'card explain-back' }, h('summary', {}, t('ebTitle')), body);
    }

    // In a topic module: the suggested next level, quiet (the primary stays the situation).
    function nextLevelBtn() {
      if (!place) return null;
      const id = nextLesson(app.state, meta);
      if (!id || id === lesson.id || !meta.lessons.includes(id)) return null;
      return h('button', { class: 'btn btn-ghost next-level', onclick: () => app.go('lesson', { subject, moduleId: meta.id, lessonId: id }) },
        ico('chevron-right'), ' ', t('nextLevel', placeLabel(t, app.lang, id)));
    }

    function done(xp) {
      finished = true;
      show(h('section', { class: 'card lesson-done' },
        h('p', { class: 'done-mark' }, ico('graduation-cap')),
        h('h2', { class: 'card-title' }, t('lessonPassed')),
        xp ? h('p', { class: 'xp-line' }, `+${xp} XP`) : h('p', { class: 'muted' }, t('lessonRetake')),
        h('p', { class: 'muted small' }, t('lessonComesBack'))),
      planCard(),
      guessCard(),
      explainBack(),
      h('button', { class: 'btn btn-primary btn-big', onclick: () => app.go('situation', { subject, moduleId: meta.id, lessonId: lesson.id }) }, ico('drama'), ' ', t('openSituation')),
      nextLevelBtn(),
      h('button', { class: 'btn btn-ghost', onclick: () => app.startSayIt(subject, meta.id, lesson.id) }, ico('mic'), ' ', t('openSayIt')),
      h('button', { class: 'btn btn-ghost', onclick: () => app.go('home') }, t('backToCourse')));
    }

    draw();
  }
}

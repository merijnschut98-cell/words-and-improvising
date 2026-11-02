// A lesson: guess first (prequestions), read in short blocks, see an example,
// then the quiz. Passing unlocks the situation and the say-it round.
import { h } from './dom.js';
import { renderQuiz } from './quiz.js';
import { applyLesson, lessonPhases, recallQuestions } from '../core/course.js';
import { metaOf } from '../content/courses/index.js';
import { runExplain } from '../core/coursecoach.js';

export function renderLesson(app, { subject, moduleId, lessonId }, root) {
  const t = app.t;
  const seq = app.navSeq;
  const title = h('div', { class: 'round-title' }, t('lessonTitle'));
  const main = h('main', { class: 'screen lesson' }, h('p', { class: 'muted loading' }, '…'));
  root.append(
    h('header', { class: 'top round-top' },
      h('button', { class: 'icon-btn', 'aria-label': t('close'), onclick: () => app.go('home') }, '✕'),
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

  function run(lesson, meta) {
    const phases = lessonPhases(lesson);
    let p = 0;
    let block = 0;
    let pre = 0;
    const next = () => { p += 1; block = 0; draw(); };
    const dots = (n, i) => h('div', { class: 'dots', 'aria-hidden': 'true' }, Array.from({ length: n }, (_, k) => h('i', { class: k <= i ? 'on' : '' })));
    const step = (name) => h('p', { class: 'today-label' }, t(`lessonStep_${name}`));

    function draw() {
      const phase = phases[p];
      window.scrollTo(0, 0);
      if (phase === 'pre') {
        const q = lesson.pre[pre];
        const pick = (o) => {
          main.replaceChildren(h('section', { class: 'card pre-card' }, step('pre'),
            h('p', { class: 'quiz-q' }, q.q),
            h('p', { class: 'muted' }, t('preGuessed', o)),
            h('button', {
              class: 'btn btn-primary',
              onclick: () => { if (pre + 1 < lesson.pre.length) { pre += 1; draw(); } else next(); },
            }, t('quizNext'))));
        };
        main.replaceChildren(h('section', { class: 'card pre-card' }, step('pre'),
          h('p', { class: 'muted small' }, t('preHint')),
          h('p', { class: 'quiz-q' }, q.q),
          'number' in q
            ? (() => {
              const input = h('input', { type: 'text', inputmode: 'decimal', class: 'text-input quiz-num', placeholder: t('numericPh'), 'aria-label': t('numericPh') });
              return h('div', {}, h('div', { class: 'quiz-num-row' }, input, q.unit ? h('span', { class: 'quiz-unit' }, q.unit) : null),
                h('button', { class: 'btn btn-primary', onclick: () => pick(input.value.trim() || '?') }, t('quizNext')));
            })()
            : h('div', { class: 'quiz-opts' }, q.options.map((o) => h('button', { class: 'opt', onclick: () => pick(o) }, o)))));
        return;
      }
      if (phase === 'teach') {
        const last = block === lesson.teach.length - 1;
        main.replaceChildren(
          h('section', { class: 'card teach-card' }, step('teach'), dots(lesson.teach.length, block),
            h('p', { class: 'teach-text' }, lesson.teach[block]),
            last ? h('p', { class: 'said' }, lesson.said) : null,
            last && app.state.settings.apiKey ? explainBox(lesson) : null),
          h('button', {
            class: 'btn btn-primary btn-big',
            onclick: () => { if (last) next(); else { block += 1; draw(); } },
          }, t('quizNext')));
        return;
      }
      if (phase === 'example') {
        const ex = lesson.example;
        if (ex.kind === 'faded') {
          const input = h('textarea', { class: 'text-input', rows: 3, placeholder: t('lessonWhatNextPh'), 'aria-label': ex.ask });
          const reveal = h('div', {});
          main.replaceChildren(h('section', { class: 'card example-card' }, step('example'),
            h('p', { class: 'teach-text' }, ex.text),
            h('p', { class: 'example-ask' }, h('b', {}, ex.ask)),
            input,
            reveal,
            h('button', {
              class: 'btn btn-ghost reveal-btn',
              onclick: (e) => {
                e.currentTarget.remove();
                reveal.replaceChildren(h('p', { class: 'teach-text reveal' }, ex.reveal),
                  h('button', { class: 'btn btn-primary', onclick: next }, t('quizNext')));
              },
            }, t('reveal'))));
          return;
        }
        main.replaceChildren(h('section', { class: 'card example-card' }, step('example'),
          h('p', { class: 'teach-text' }, ex.text)),
        h('button', { class: 'btn btn-primary btn-big', onclick: next }, t('quizNext')));
        return;
      }
      if (phase === 'quiz') {
        const box = h('div', {});
        main.replaceChildren(step('quiz'), box);
        renderQuiz(app, {
          questions: recallQuestions(lesson),
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

    function done(xp) {
      main.replaceChildren(h('section', { class: 'card lesson-done' },
        h('p', { class: 'big-emoji', 'aria-hidden': 'true' }, '🎓'),
        h('h2', { class: 'card-title' }, t('lessonPassed')),
        xp ? h('p', { class: 'xp-line' }, `+${xp} XP`) : h('p', { class: 'muted' }, t('lessonRetake')),
        h('p', { class: 'muted small' }, t('lessonComesBack'))),
      h('button', { class: 'btn btn-primary btn-big', onclick: () => app.go('situation', { subject, moduleId: meta.id, lessonId: lesson.id }) }, `🎭 ${t('openSituation')}`),
      h('button', { class: 'btn btn-ghost', onclick: () => app.startSayIt(subject, meta.id, lesson.id) }, `🎙 ${t('openSayIt')}`),
      h('button', { class: 'btn btn-ghost', onclick: () => app.go('home') }, t('backToCourse')));
    }

    draw();
  }
}

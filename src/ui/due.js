// A due session: up to ten questions from one track, recalled before they fade.
import { h } from './dom.js';
import { ico } from './icons.js';
import { renderQuiz } from './quiz.js';
import { applyDue, questionById } from '../core/course.js';
import { dueSession, isOwned } from '../core/coursereview.js';
import { moduleOf, subjectOf, lessonOf } from '../content/courses/index.js';
import { seededRng } from '../core/lesson.js';

const seedOf = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

export function renderDue(app, { subject, questionIds = null, maintenance = false, prep = null }, root) {
  const t = app.t;
  const seq = app.navSeq;
  const main = h('main', { class: 'screen due' }, h('p', { class: 'muted loading' }, '…'));
  root.append(
    h('header', { class: 'top round-top' },
      h('button', { class: 'icon-btn', 'aria-label': t('close'), onclick: () => app.go('home') }, ico('x')),
      h('div', { class: 'round-title' }, ico('repeat'), ' ', t('dueTitle')), h('div', {})),
    main);

  const ids = (questionIds || dueSession(app.state.courseReviews, app.today(), subject, app.lang, seededRng(seedOf(`${app.today()}|${subject}`))))
    .filter((id) => subjectOf(id) === subject);
  if (!ids.length) {
    main.replaceChildren(h('section', { class: 'card' }, h('p', {}, t('dueNone'))),
      h('button', { class: 'btn btn-primary', onclick: () => app.go('home') }, t('backToCourse')));
    return;
  }
  const mods = [...new Set(ids.map(moduleOf))];
  Promise.all(mods.map((m) => app.openModule(subject, m).then((mod) => ({ id: m, lessons: mod.lessons }), () => null)))
    .then((loaded) => {
      if (seq !== app.navSeq) return;
      const questions = ids.map((id) => questionById(loaded.filter(Boolean), id)).filter(Boolean);
      const lessons = loaded.filter(Boolean).flatMap((m) => m.lessons || []);
      const termsOf = (q) => (lessons.find((l) => l.id === lessonOf(q.id)) || {}).terms || [];
      if (!questions.length) {
        main.replaceChildren(h('section', { class: 'card load-error' }, h('p', {}, t('loadError')),
          h('button', { class: 'btn btn-primary', onclick: () => app.go('due', { subject, questionIds, maintenance, prep }) }, t('retry'))));
        return;
      }
      const box = h('div', {});
      main.replaceChildren(box);
      renderQuiz(app, {
        questions,
        termsOf,
        onDone: (firstTry, sure) => {
          const before = questions.filter((q) => isOwned(app.state.courseReviews, app.lang, q.id)).length;
          const res = applyDue(app.state, { subject, results: firstTry, sure, lang: app.lang, maintenance, prep }, app.today(), Date.now());
          app.setState(res.state);
          const owned = questions.filter((q) => isOwned(app.state.courseReviews, app.lang, q.id)).length - before;
          main.replaceChildren(h('section', { class: 'card lesson-done due-done' },
            h('p', { class: 'done-mark' }, ico('brain')),
            h('h2', { class: 'card-title' }, t('dueDone')),
            h('p', { class: 'xp-line' }, `+${res.xp} XP`),
            owned > 0 ? h('p', { class: 'muted' }, t('dueOwned', owned)) : null),
          h('button', { class: 'btn btn-primary btn-big', onclick: () => app.go('home') }, t('backToCourse')));
        },
      }, box);
    });
}

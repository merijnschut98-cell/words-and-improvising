// The module check screen (Modulecheck, v16 flair): an intro with the guide,
// then ten questions in one pass (no hints, no back), then the result.
import { h } from './dom.js';
import { ico } from './icons.js';
import { renderQuiz } from './quiz.js';
import { guide, guideOn } from './guide.js';
import { medalSeal } from './flairui.js';
import { checkOpen, checkQuestions, applyCheck } from '../core/modulecheck.js';
import { storedMedal } from '../core/flair.js';
import { MODULES } from '../content/courses/index.js';

export function renderCheck(app, { subject, moduleId }, root) {
  const t = app.t;
  const meta = MODULES.find((m) => m.id === moduleId);
  const main = h('main', { class: 'screen check' });
  root.append(
    h('header', { class: 'top round-top' },
      h('button', { class: 'icon-btn', 'aria-label': t('close'), onclick: () => app.go('home') }, ico('x')),
      h('div', { class: 'round-title' }, ico('flag'), ' ', t('checkTitle')), h('div', {})),
    main);
  if (!meta) { app.go('home'); return; }
  const title = meta.title[app.lang] || meta.title.en;
  const back = () => h('button', { class: 'btn btn-ghost', onclick: () => app.go('home') }, t('backToCourse'));

  if (!checkOpen(app.state, meta, app.today())) {
    main.replaceChildren(h('section', { class: 'card check-intro' },
      h('h1', { class: 'card-title' }, title),
      h('p', {}, storedMedal(app.state, subject, moduleId) ? t('checkTomorrow') : t('checkLocked'))), back());
    return;
  }

  const note = h('div', { 'aria-live': 'polite' });
  const start = h('button', { class: 'btn btn-primary btn-big check-start', onclick: () => begin() }, ico('play'), ' ', t('checkStart'));
  main.replaceChildren(
    h('section', { class: 'card check-intro' },
      h('h1', { class: 'card-title' }, title),
      guideOn(app.state) ? h('div', { class: 'guide-line' }, guide(app.state, { mood: 'idle', size: 32 }), h('p', { class: 'small' }, t('guideCheck'))) : null,
      h('p', {}, t('checkIntro')),
      medalSeal(t, storedMedal(app.state, subject, moduleId), 24)),
    note, start, back());

  function begin() {
    start.disabled = true;
    note.replaceChildren();
    return app.openModule(subject, moduleId).then((mod) => {
      const questions = checkQuestions(mod, meta, app.today());
      if (!questions.length) throw new Error('no questions');
      const box = h('div', {});
      main.replaceChildren(box);
      renderQuiz(app, {
        questions,
        onePass: true,
        onDone: (firstTry) => {
          const res = applyCheck(app.state, { subject, moduleId, results: firstTry, lang: app.lang }, app.today(), Date.now());
          app.setState(res.state);
          showDone(res);
        },
      }, box);
    }).catch(() => {
      note.replaceChildren(h('p', { class: 'note' }, t('loadError')));
      start.disabled = false;
    });
  }

  function showDone(res) {
    main.replaceChildren(h('section', { class: 'card lesson-done check-done' },
      h('h2', { class: 'card-title' }, t('checkDone')),
      h('p', { class: 'check-score' }, t('checkScore', res.correct, res.total), res.perfect ? ` · ${t('checkPerfect')}` : ''),
      res.xp ? h('p', { class: 'xp-line' }, `+${res.xp} XP`) : null),
    h('button', { class: 'btn btn-primary btn-big', onclick: () => app.go('home') }, t('backToCourse')));
  }
}

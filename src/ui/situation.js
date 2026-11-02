// A situation from his work: he answers (typed or spoken), then rates himself
// against three rubric points, or the coach grades it when there is a key.
import { h } from './dom.js';
import { applySituation } from '../core/course.js';
import { runGrade } from '../core/coursecoach.js';
import { createRecognizer, speechSupported } from '../core/speech.js';

export function renderSituation(app, { subject, moduleId, lessonId }, root) {
  const t = app.t;
  const seq = app.navSeq;
  const main = h('main', { class: 'screen situation' }, h('p', { class: 'muted loading' }, '…'));
  let rec = null;
  root.append(
    h('header', { class: 'top round-top' },
      h('button', { class: 'icon-btn', 'aria-label': t('close'), onclick: () => app.go('home') }, '✕'),
      h('div', { class: 'round-title' }, `🎭 ${t('sitTitle')}`), h('div', {})),
    main);

  app.openModule(subject, moduleId).then((mod) => {
    if (seq !== app.navSeq) return;
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (!lesson) throw new Error('missing');
    ask(lesson);
  }).catch(() => {
    if (seq !== app.navSeq) return;
    main.replaceChildren(h('section', { class: 'card load-error' }, h('p', {}, t('loadError')),
      h('button', { class: 'btn btn-primary', onclick: () => app.go('situation', { subject, moduleId, lessonId }) }, t('retry'))));
  });

  function ask(lesson) {
    const s = lesson.situation;
    const ta = h('textarea', { class: 'text-input sit-answer', rows: 5, placeholder: t('sitAnswerPh'), 'aria-label': t('sitAnswerPh') });
    let micBtn = null;
    if (speechSupported) {
      const idle = () => { rec = null; if (micBtn.isConnected) micBtn.textContent = `🎙 ${t('sitSpeak')}`; };
      micBtn = h('button', {
        class: 'btn btn-ghost small mic-btn',
        onclick: () => {
          if (rec) { rec.stop(); idle(); return; }
          const base = ta.value;
          rec = createRecognizer({
            lang: app.lang,
            onText: (final, interim) => { const said = `${final}${final && interim ? ' ' : ''}${interim || ''}`; ta.value = `${base}${base && said ? ' ' : ''}${said}`; },
            onError: idle,
          });
          if (rec.start() === false) { idle(); return; }
          micBtn.textContent = `⏹ ${t('sitStop')}`;
        },
      }, `🎙 ${t('sitSpeak')}`);
    }
    main.replaceChildren(
      h('section', { class: 'card sit-card' },
        h('p', { class: 'today-label' }, lesson.title),
        h('p', { class: 'teach-text' }, s.scene),
        h('p', { class: 'quiz-q' }, s.ask),
        ta, micBtn),
      h('button', {
        class: 'btn btn-primary btn-big',
        onclick: () => {
          if (rec) { rec.stop(); rec = null; }
          if (!ta.value.trim()) { ta.focus(); return; }
          assess(lesson, ta.value.trim());
        },
      }, t('sitSubmit')));
  }

  async function assess(lesson, answer) {
    const s = lesson.situation;
    const key = app.state.settings.apiKey;
    if (key) {
      main.replaceChildren(h('section', { class: 'card' }, h('p', { class: 'muted' }, t('coachThinking'))));
      const res = await runGrade(key, { lesson, answer, lang: app.lang, model: app.state.settings.model });
      if (seq !== app.navSeq) return;
      if (res.ok) { result(lesson, answer, res.points, res.missed); return; }
    }
    // Self-rating against the rubric: honest checkboxes, no coach needed.
    const boxes = s.rubric.map((line) => h('label', { class: 'rubric-line' }, h('input', { type: 'checkbox' }), h('span', {}, line)));
    main.replaceChildren(
      h('section', { class: 'card sit-card' },
        h('p', { class: 'muted small' }, t('sitYourAnswer')),
        h('p', { class: 'sit-mine' }, answer),
        h('p', { class: 'quiz-q' }, t('sitSelfRate')),
        boxes),
      h('button', {
        class: 'btn btn-primary btn-big',
        onclick: () => result(lesson, answer, boxes.map((b) => (b.querySelector('input').checked ? 1 : 0)), ''),
      }, t('sitCheck')));
  }

  function result(lesson, answer, points, missed) {
    const pts = points.reduce((a, b) => a + b, 0);
    const res = applySituation(app.state, { subject, lessonId: lesson.id, pts }, app.today(), Date.now());
    app.setState(res.state);
    main.replaceChildren(
      h('section', { class: 'card sit-card sit-result' },
        h('p', { class: 'xp-line' }, `${t('sitPoints', pts)}${res.xp ? ` · +${res.xp} XP` : ''}`),
        lesson.situation.rubric.map((line, i) => h('p', { class: `rubric-result ${points[i] ? 'ok' : 'miss'}` },
          h('span', { 'aria-hidden': 'true' }, points[i] ? '✓ ' : '✗ '), line)),
        missed ? h('p', { class: 'note' }, `${t('coachMissed')}: ${missed}`) : null,
        h('p', { class: 'muted small' }, t('sitModel')),
        h('p', { class: 'said' }, lesson.situation.model)),
      h('button', { class: 'btn btn-ghost', onclick: () => app.startSayIt(subject, moduleId, lesson.id) }, `🎙 ${t('openSayIt')}`),
      h('button', { class: 'btn btn-primary btn-big', onclick: () => app.go('home') }, t('backToCourse')));
  }

  return () => { if (rec) { try { rec.stop(); } catch { /* already stopped */ } } };
}

import { h } from './dom.js';

// Placeholder until the full screen ships.
export function renderLesson(app, _params, root) {
  const t = app.t;
  root.append(
    h('header', { class: 'top round-top' },
      h('button', { class: 'icon-btn', 'aria-label': t('close'), onclick: () => app.go('home') }, '✕'),
      h('div', { class: 'round-title' }, t('lessonTitle')), h('div', {})),
    h('main', { class: 'screen' }, h('p', { class: 'note' }, t('comingSoon'))));
}

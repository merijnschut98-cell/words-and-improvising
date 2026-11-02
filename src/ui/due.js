import { h } from './dom.js';

// Placeholder until the full screen ships.
export function renderDue(app, _params, root) {
  const t = app.t;
  root.append(
    h('header', { class: 'top round-top' },
      h('button', { class: 'icon-btn', 'aria-label': t('close'), onclick: () => app.go('home') }, '✕'),
      h('div', { class: 'round-title' }, t('dueTitle')), h('div', {})),
    h('main', { class: 'screen' }, h('p', { class: 'note' }, t('comingSoon'))));
}

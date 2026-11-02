import { h } from './dom.js';

export const SUBJECT_TABS = [['speak', '🎙'], ['eng', '⚙️'], ['pm', '📋']];

// Three subjects; the choice is remembered in ui.subject. On Progress the bar
// switches the view and stays on that screen.
export function subjectBar(app, screen = 'home') {
  const t = app.t;
  const cur = app.subject;
  return h('nav', { class: 'subject-bar', 'aria-label': t('subjectsLabel') },
    SUBJECT_TABS.map(([id, icon]) => h('button', {
      class: `subject-tab${cur === id ? ' on' : ''}`,
      'aria-pressed': cur === id ? 'true' : 'false',
      onclick: () => { if (app.subject !== id) app.setSubject(id, screen); },
    }, h('span', { 'aria-hidden': 'true' }, icon), h('span', {}, t(`subject_${id}`)))));
}

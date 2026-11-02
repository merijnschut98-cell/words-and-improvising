import { h } from './dom.js';

export const SUBJECT_TABS = [['speak', '🎙'], ['eng', '⚙️'], ['pm', '📋']];

// Three subjects; the choice is remembered in ui.subject.
export function subjectBar(app) {
  const t = app.t;
  const cur = app.subject;
  return h('nav', { class: 'subject-bar', 'aria-label': t('subjectsLabel') },
    SUBJECT_TABS.map(([id, icon]) => h('button', {
      class: `subject-tab${cur === id ? ' on' : ''}`,
      'aria-pressed': cur === id ? 'true' : 'false',
      onclick: () => { if (app.subject !== id) app.setSubject(id); },
    }, h('span', { 'aria-hidden': 'true' }, icon), h('span', {}, t(`subject_${id}`)))));
}

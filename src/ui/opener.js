// The level opener (v17 Task 19): a few sentences that say what changes at a
// level of a topic. Two shapes. Before a lesson at level 2 to 4 that he has not
// seen the opener of, Andon says it with one filled button that starts the
// lesson (with the guide off the same card shows without him). On the module
// screen, an info button on the level path reads it again as a plain inline
// card, without Andon (the screen has his one figure already) and without
// touching what is seen.
import { h } from './dom.js';
import { ico } from './icons.js';
import { guideFigure } from './guide.js';
import { statusModel } from './guide.js';
import { dueFor } from './flairui.js';

const levelName = (t, level) => t(`level_${level}`);

// Before the lesson's first step. `onBegin` marks it seen and starts the lesson.
export function openerCard(app, { subject, level, text, onBegin }) {
  const t = app.t;
  const status = statusModel({ due: dueFor(app, subject) });
  const figure = guideFigure(app.state, { mood: 'idle', size: 72, status, statusText: t(status.status === 'due' ? 'guideStatusDue' : 'guideStatusOk') });
  const title = h('h2', { class: 'opener-title', id: 'opener-title', tabindex: '-1' }, t('openerChanges', levelName(t, level)));
  const begin = h('button', { type: 'button', class: 'btn btn-primary btn-big opener-begin', onclick: onBegin }, t('openerBegin'));
  const body = figure
    // Andon beside the title; his bubble holds the text.
    ? h('div', { class: 'guide-intro opener-guide', 'data-mood': 'idle', 'data-status': status.status },
      figure,
      h('div', { class: 'guide-intro-text' }, title, h('p', { class: 'guide-say opener-text' }, text)))
    : h('div', { class: 'opener-plain' }, title, h('p', { class: 'opener-text' }, text));
  return [h('section', { class: 'card opener-card', 'aria-labelledby': 'opener-title' }, body), begin];
}

// On the module screen: the card under a topic's path. Plain, closable, and the
// focus moves in and back out, so a keyboard or screen-reader user lands on it.
export function openerInline(t, { level, text, onClose }) {
  const close = h('button', { type: 'button', class: 'btn btn-ghost small opener-close', onclick: onClose }, ico('x'), ' ', t('openerClose'));
  const title = h('h4', { class: 'opener-title', tabindex: '-1' }, t('openerChanges', levelName(t, level)));
  return { el: h('section', { class: 'opener-inline', 'data-level': String(level), 'aria-label': t('openerChanges', levelName(t, level)) },
    title, h('p', { class: 'opener-text' }, text), close), title };
}

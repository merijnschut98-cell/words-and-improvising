import { h } from './dom.js';
import { levelFromXp } from '../core/progress.js';

export function renderDone(app, { xp = 0, levelUp = false }, root) {
  const t = app.t;
  const lv = levelFromXp(app.state.xp);
  root.append(h('main', { class: 'screen done' },
    h('div', { class: 'confetti', 'aria-hidden': 'true' }, '🎉'),
    h('h1', {}, t('lessonComplete')),
    h('div', { class: 'xp-big' }, t('xpEarned', xp)),
    levelUp ? h('div', { class: 'level-badge big' }, `${t('levelUp')} ${t('level')} ${lv.level}`) : null,
    h('div', { class: 'streak on big' }, h('span', { 'aria-hidden': 'true' }, '🔥'), h('b', {}, app.state.streak.count), h('span', {}, t('streak', app.state.streak.count))),
    h('button', { class: 'btn btn-primary btn-big', onclick: () => app.go('home') }, t('backHome'))));
}

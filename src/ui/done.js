import { h, bestLabel } from './dom.js';
import { levelFromXp } from '../core/progress.js';
import { currentQuests } from '../core/quests.js';

// Lesson summary: XP, quests, and up to two true, specific wins.
export function renderDone(app, { xp = 0, levelUp = false, highlights = [] }, root) {
  const t = app.t;
  const lv = levelFromXp(app.state.xp);
  const quests = currentQuests(app.state, app.today());
  const qDone = quests.filter((q) => q.done).length;
  // Global records first, then per-drill ones; at most two.
  const wins = [...highlights.filter((b) => !b.drill), ...highlights.filter((b) => b.drill)].slice(0, 2);
  root.append(h('main', { class: 'screen done' },
    h('div', { class: 'confetti', 'aria-hidden': 'true' }, '🎉'),
    h('h1', {}, t('lessonComplete')),
    h('div', { class: 'xp-big' }, t('xpEarned', xp)),
    levelUp ? h('div', { class: 'level-badge big' }, `${t('levelUp')} ${t('level')} ${lv.level}`) : null,
    wins.length ? h('section', { class: 'card highlights' },
      h('h2', { class: 'card-title' }, t('highlights')),
      wins.map((b) => h('p', {}, `🏆 ${bestLabel(t, b)}`))) : null,
    h('div', { class: 'done-row' },
      h('div', { class: 'streak on big' }, h('span', { 'aria-hidden': 'true' }, '🔥'), h('b', {}, app.state.streak.count), h('span', {}, t('streak', app.state.streak.count))),
      h('div', { class: 'muted' }, `${t('questsTitle')}: ${qDone}/${quests.length}`)),
    h('button', { class: 'btn btn-primary btn-big', onclick: () => app.go('home') }, t('backHome'))));
}

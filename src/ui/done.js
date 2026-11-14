import { h, bestLabel } from './dom.js';
import { ico } from './icons.js';
import { celebration } from './flairui.js';
import { levelFromXp } from '../core/progress.js';
import { currentQuests } from '../core/quests.js';
import { drawShareCard, shareFile } from '../core/share.js';

// Lesson summary: XP, quests, and up to two true, specific wins.
export function renderDone(app, { xp = 0, levelUp = false, highlights = [], milestones = [], medals = [], speakMedals = [], titles = [], goalReached = false }, root) {
  const t = app.t;
  const lv = levelFromXp(app.state.xp);
  const quests = currentQuests(app.state, app.today());
  const qDone = quests.filter((q) => q.done).length;
  // Global records first, then per-drill ones; at most two.
  const wins = [...highlights.filter((b) => !b.drill), ...highlights.filter((b) => b.drill)].slice(0, 2);
  // The celebration (v16 flair): the guide and the daily ring, one big moment.
  const c = celebration(app, { xp, medals, speakMedals, titles, goalReached }, { mark: h('div', { class: 'done-mark' }, ico('circle-check')), subject: 'speak' });
  root.append(h('main', { class: `screen done${c.big ? ' celebrate' : ''}` },
    c.nodes[0],
    h('h1', {}, t('lessonComplete')),
    h('div', { class: 'xp-big xp-rise' }, t('xpEarned', xp)),
    ...c.nodes.slice(1),
    levelUp ? h('div', { class: 'level-badge big' }, `${t('levelUp')}: ${t('level')} ${lv.level}`) : null,
    wins.length ? h('section', { class: 'card highlights' },
      h('h2', { class: 'card-title' }, t('highlights')),
      wins.map((b) => h('p', {}, ico('award'), ' ', bestLabel(t, b)))) : null,
    milestones.length ? h('section', { class: 'card highlights' },
      h('h2', { class: 'card-title' }, t('milestonesTitle')),
      milestones.map((id) => h('p', {}, ico('milestone'), ' ', t(`ms_${id}`)))) : null,
    h('div', { class: 'done-row' },
      h('div', { class: 'streak on big' }, ico('flame'), h('b', {}, app.state.streak.count), h('span', {}, t('streak', app.state.streak.count))),
      h('div', { class: 'muted' }, `${t('questsTitle')}: ${qDone}/${quests.length}`)),
    h('button', {
      class: 'btn btn-ghost',
      onclick: async () => {
        const rows = [[t('shareXp'), `+${xp} XP`], [t('streak', app.state.streak.count), app.state.streak.count]];
        if (wins[0]) rows.push([bestLabel(t, wins[0]), wins[0].value]);
        const blob = await drawShareCard({ title: t('shareLessonTitle'), rows, footer: 'Vantage Point' });
        await shareFile(blob, 'vantage-point.png', t('shareLessonTitle'));
      },
    }, ico('share-2'), ' ', t('share')),
    h('button', { class: 'btn btn-primary btn-big', onclick: () => app.go('home') }, t('backHome'))));
}

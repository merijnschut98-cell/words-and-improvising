import { h, DRILL_ICON } from './dom.js';
import { levelFromXp, isStreakAlive, dayKey, DRILLS } from '../core/progress.js';

export function navBar(app, active) {
  const t = app.t;
  const item = (id, icon) => h('button', {
    class: `nav-item${active === id ? ' active' : ''}`,
    onclick: () => app.go(id),
    'aria-current': active === id ? 'page' : null,
  }, h('span', { class: 'nav-icon', 'aria-hidden': 'true' }, icon), h('span', {}, t(`nav_${id}`)));
  return h('nav', { class: 'navbar' }, item('home', '🏠'), item('progress', '📈'), item('settings', '⚙️'));
}

function weekStrip(app) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dayKey(d);
    const done = (app.state.days[key] || 0) > 0;
    const label = d.toLocaleDateString(app.lang === 'nl' ? 'nl-NL' : 'en-GB', { weekday: 'narrow' });
    days.push(h('div', { class: `day${done ? ' done' : ''}${i === 0 ? ' today' : ''}` },
      h('span', { class: 'dot' }, done ? '✓' : ''), h('span', { class: 'lbl' }, label)));
  }
  return h('div', { class: 'week' }, days);
}

export function renderHome(app, _params, root) {
  const t = app.t;
  const s = app.state;
  const today = app.today();
  const alive = isStreakAlive(s.streak, today);
  const streak = alive ? s.streak.count : 0;
  const lv = levelFromXp(s.xp);
  const doneToday = (s.days[today] || 0) >= 3;

  root.append(
    h('header', { class: 'top' },
      h('div', { class: 'brand' }, h('span', { class: 'logo', 'aria-hidden': 'true' }, '💬'), 'Spraakwater'),
      h('div', { class: `streak${streak ? ' on' : ''}`, title: t('streak', streak) },
        h('span', { 'aria-hidden': 'true' }, '🔥'), h('b', {}, streak), h('span', { class: 'sr' }, t('streak', streak)))),
    h('main', { class: 'screen home' },
      h('p', { class: 'tagline' }, t('tagline')),
      h('section', { class: 'card level-card' },
        h('div', { class: 'level-row' },
          h('span', { class: 'level-badge' }, `${t('level')} ${lv.level}`),
          h('span', { class: 'muted' }, `${lv.into} / ${lv.needed} XP`)),
        h('div', { class: 'bar' }, h('div', { class: 'fill', style: { width: `${(100 * lv.into) / lv.needed}%` } })),
        weekStrip(app)),
      h('button', { class: 'btn btn-hero', onclick: () => app.startLesson() },
        h('span', { class: 'hero-title' }, doneToday ? t('lessonDone') : t('todayLesson')),
        h('span', { class: 'hero-sub' }, t('lessonSub'))),
      h('div', { class: 'feature-row' },
      h('button', {
        class: 'drill convo-card target-card',
        onclick: async (e) => {
          const btn = e.currentTarget;
          btn.disabled = true;
          btn.querySelector('.muted').textContent = t('targetLoading');
          await app.startTargeted();
        },
      },
      h('span', { class: 'drill-icon', 'aria-hidden': 'true' }, '🎯'),
      h('span', { class: 'drill-name' }, t('targetTitle')),
      h('span', { class: 'muted small' }, s.settings.apiKey ? t('targetSubAI') : t('targetSub'))),
      h('button', {
        class: 'drill convo-card',
        onclick: () => app.go(s.settings.apiKey ? 'conversation' : 'settings'),
      },
      h('span', { class: 'drill-icon', 'aria-hidden': 'true' }, '🗣'),
      h('span', { class: 'drill-name' }, t('convoTitle')),
      h('span', { class: 'muted small' }, s.settings.apiKey ? t('convoSub') : t('convoNeedsKey')))),
      h('h2', { class: 'section-title' }, t('freePractice')),
      h('div', { class: 'drill-grid' }, DRILLS.map((d) => h('button', {
        class: `drill drill-${d}`, onclick: () => app.startDrill(d),
      },
      h('span', { class: 'drill-icon', 'aria-hidden': 'true' }, DRILL_ICON[d]),
      h('span', { class: 'drill-name' }, t(`drill_${d}`)),
      h('span', { class: 'pips', 'aria-label': `${t('level')} ${s.drillLevels[d]}` },
        [1, 2, 3, 4, 5].map((n) => h('i', { class: n <= s.drillLevels[d] ? 'on' : '' })))))),
      app.installPrompt
        ? h('button', {
          class: 'btn btn-ghost',
          onclick: async () => { app.installPrompt.prompt(); app.installPrompt = null; },
        }, t('installBtn'))
        : null,
      navigator.onLine ? null : h('p', { class: 'note' }, t('offline'))),
    navBar(app, 'home'),
  );
}

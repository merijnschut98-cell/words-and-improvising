import { weakestDrill } from '../core/lesson.js';
import { weekFocus } from '../core/weekly.js';
import { upcoming, needsReflection } from '../core/realweek.js';
import { EVENT_ICON, fmtDay, startRehearsal } from './realweek.js';
import { h, DRILL_ICON } from './dom.js';
import { levelFromXp, isStreakAlive, dayKey, DRILLS, daysPractised } from '../core/progress.js';
import { currentQuests } from '../core/quests.js';
import { planLine } from './plan.js';
import { bossAvailable } from '../core/boss.js';
import { makePrompt } from '../core/lesson.js';

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
    const frozen = !done && (app.state.freezeLog || []).includes(key);
    const label = d.toLocaleDateString(app.lang === 'nl' ? 'nl-NL' : 'en-GB', { weekday: 'narrow' });
    days.push(h('div', { class: `day${done ? ' done' : ''}${frozen ? ' frozen' : ''}${i === 0 ? ' today' : ''}` },
      h('span', { class: 'dot' }, done ? '✓' : frozen ? '🧊' : ''), h('span', { class: 'lbl' }, label)));
  }
  return h('div', { class: 'week' }, days);
}

function questCard(app) {
  const t = app.t;
  const items = currentQuests(app.state, app.today());
  const done = items.filter((q) => q.done).length;
  return h('section', { class: 'card quest-card' },
    h('div', { class: 'level-row' },
      h('h2', { class: 'card-title' }, t('questsTitle')),
      h('span', { class: 'muted small' }, done === items.length ? `🧊 ${t('questsAllDone')}` : `${done}/${items.length} · 🧊 ${t('questsReward')}`)),
    items.map((q) => h('div', { class: `quest${q.done ? ' done' : ''}` },
      h('span', { class: 'quest-check', 'aria-hidden': 'true' }, q.done ? '✓' : ''),
      h('span', {}, t(`quest_${q.id}`)),
      h('span', { class: 'muted small' }, '+15'))));
}

// My real week: the next event to rehearse, a reflection that is due, or an invitation.
function realWeekCard(app) {
  const t = app.t;
  const today = app.today();
  const due = needsReflection(app.state.events, today)[0];
  const next = upcoming(app.state.events, today)[0];
  const open = () => app.go('realweek');
  if (due) {
    return h('button', { class: 'btn rw-card', onclick: open },
      h('span', { class: 'rw-card-title' }, `📝 ${t('rwReflectNow')}`), h('span', { class: 'muted small' }, due.text));
  }
  if (next) {
    return h('div', { class: 'card rw-home' },
      h('div', {}, h('p', { class: 'muted small' }, `📅 ${t('rwComing')} · ${EVENT_ICON[next.type]} ${fmtDay(app, next.date)}`), h('p', { class: 'rw-text' }, next.text)),
      h('div', { class: 'rw-actions' },
        h('button', { class: 'btn btn-primary small', onclick: (ev) => { ev.currentTarget.disabled = true; startRehearsal(app, next); } }, `🎙 ${t('rwRehearse')}`),
        h('button', { class: 'btn btn-ghost small', onclick: open }, t('rwAll'))));
  }
  return h('button', { class: 'btn btn-ghost rw-invite', onclick: open }, `📅 ${t('rwInvite')}`);
}

export function renderHome(app, _params, root) {
  const t = app.t;
  const s = app.state;
  const today = app.today();
  const alive = isStreakAlive(s.streak, today);
  const streak = alive ? s.streak.count : 0;
  const lv = levelFromXp(s.xp);
  const doneToday = (s.days[today] || 0) >= 3;
  // Gentle, once a day: the streak broke, but the total never resets.
  const dueCount = app.dueReviews().length;
  const weak = weekFocus(s, new Date()) || weakestDrill(s.history);
  const showBreak = app.broke && (s.ui || {}).seenBreak !== today && s.streak.count > 0;
  if (showBreak) app.setState({ ...s, ui: { ...(s.ui || {}), seenBreak: today } });

  root.append(
    h('header', { class: 'top' },
      h('div', { class: 'brand' }, h('span', { class: 'logo', 'aria-hidden': 'true' }, '💬'), 'Spraakwater'),
      h('div', { class: `streak${streak ? ' on' : ''}`, title: t('streak', streak) },
        h('span', { 'aria-hidden': 'true' }, '🔥'), h('b', {}, streak), h('span', { class: 'sr' }, t('streak', streak)),
        s.freezes ? h('span', { class: 'freezes', title: t('freezesTitle') }, `🧊 ${s.freezes}`) : null)),
    h('main', { class: 'screen home' },
      showBreak ? h('section', { class: 'card break-card' },
        h('p', {}, t('streakReset', daysPractised(s))),
        h('button', { class: 'icon-btn small', 'aria-label': t('dismiss'), onclick: (e) => e.currentTarget.parentElement.remove() }, '✕')) : null,
      h('p', { class: 'tagline' }, `${t('tagline')} · ${t('daysTotal', daysPractised(s))}`),
      h('section', { class: 'card level-card' },
        h('div', { class: 'level-row' },
          h('span', { class: 'level-badge' }, `${t('level')} ${lv.level}`),
          h('span', { class: 'muted' }, `${lv.into} / ${lv.needed} XP`)),
        h('div', { class: 'bar' }, h('div', { class: 'fill', style: { width: `${(100 * lv.into) / lv.needed}%` } })),
        weekStrip(app)),
      h('button', { class: 'btn btn-hero', onclick: () => app.startLesson() },
        h('span', { class: 'hero-title' }, doneToday ? t('lessonDone') : t('todayLesson')),
        h('span', { class: 'hero-sub' }, weak ? `${t('lessonSub')} · ${t('lessonFocus', t(`drill_${weak}`))}` : t('lessonSub'))),
      planLine(app),
      bossAvailable(s, new Date()) ? h('button', {
        class: 'btn boss-card',
        onclick: () => { app.session = null; app.go('round', { prompt: makePrompt('boss', app.content, Math.random, s.seen) }); },
      }, h('span', { class: 'hero-title' }, `👑 ${t('bossTitle')}`), h('span', { class: 'hero-sub' }, t('bossSub'))) : null,
      dueCount ? h('button', { class: 'btn review-card', onclick: () => app.startReviews() },
        h('span', { class: 'hero-title' }, `🔁 ${t('reviewTitle')}`),
        h('span', { class: 'hero-sub' }, t('reviewSub', Math.min(3, dueCount)))) : null,
      h('button', { class: 'btn btn-ghost quick-btn', onclick: () => app.startQuick() }, `⏱ ${t('quickRound')}`),
      realWeekCard(app),
      questCard(app),
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

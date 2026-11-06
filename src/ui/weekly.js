import { h, DRILL_ICON } from './dom.js';
import { ico } from './icons.js';
import { weeklyReview } from '../core/review.js';
import { weekOptions, chooseFocus, weekFocus } from '../core/weekly.js';
import { skillUse } from '../core/realweek.js';

// Weekly reset: last week in three lines, then he picks next week's focus.
export function renderWeekly(app, _params, root) {
  const t = app.t;
  const s = app.state;
  const now = new Date();
  const r = weeklyReview(s.history, now.getTime());
  const tw = r.thisWeek;
  const lw = r.lastWeek;
  const trend = tw.fillerRate != null && lw.fillerRate != null
    ? (tw.fillerRate <= lw.fillerRate ? t('weekFillersDown', tw.fillerRate, lw.fillerRate) : t('weekFillersUp', tw.fillerRate, lw.fillerRate))
    : tw.fillerRate != null ? t('weekFillers', tw.fillerRate) : null;
  const lastReflection = (s.events || []).filter((e) => e.reflection && e.reflection.next).slice(-1)[0];
  const moment = lastReflection ? t('weekLearned', lastReflection.reflection.next)
    : r.best ? t('weekBest', t(`drill_${r.best.drill}`)) : null;
  const uses = skillUse(s.events, s.history, now.getTime());
  const current = weekFocus(s, now);
  const pick = (drill) => {
    app.setState(chooseFocus(app.state, new Date(), drill));
    app.toast(drill ? t('weekChosen', t(`drill_${drill}`)) : t('weekAdaptive'));
    app.go('home');
  };
  root.append(
    h('header', { class: 'top round-top' },
      h('button', { class: 'icon-btn', 'aria-label': t('close'), onclick: () => pick(current) }, ico('x')),
      h('div', { class: 'round-title' }, ico('calendar'), ' ', t('weekTitle')), h('div', {})),
    h('main', { class: 'screen weekly' },
      h('section', { class: 'card' },
        h('h2', { class: 'card-title' }, t('weekLooking')),
        h('p', {}, t('weekRounds', tw.rounds, tw.minutes)),
        trend ? h('p', {}, trend) : null,
        moment ? h('p', {}, moment) : null),
      uses.length ? h('section', { class: 'card skill-use' },
        h('h2', { class: 'card-title' }, t('weekSkillsTitle')),
        uses.slice(0, 3).map((u) => h('p', { class: 'skill-use-line' }, u.skill === 'other'
          ? t('weekSkillUsed', t(`skill_${u.skill}`), u.used)
          : t('weekSkillLine', t(`skill_${u.skill}`), u.practised, u.used)))) : null,
      h('section', { class: 'card' },
        h('h2', { class: 'card-title' }, t('weekPick')),
        h('p', { class: 'muted small' }, t('weekPickHelp')),
        h('div', { class: 'week-options' }, weekOptions(s, now).map(({ drill: d, why }) => h('button', {
          class: `btn btn-ghost week-option${current === d ? ' on' : ''}`,
          onclick: () => pick(d),
        }, h('span', { class: 'week-icon' }, ico(DRILL_ICON[d])),
        h('span', {}, h('b', {}, t(`drill_${d}`)), h('small', { class: 'muted' }, why === 'weak' ? t('weekWhyWeak') : why === 'prog' ? t('weekWhyProg') : why === 'chosen' ? t('weekWhyChosen') : t(`weekWhy_${d}`)))))),
        h('button', { class: 'btn btn-ghost', onclick: () => pick(null) }, ico('shuffle'), ' ', t('weekKeepAdaptive')))));
}

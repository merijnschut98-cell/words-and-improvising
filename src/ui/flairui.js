// v16 flair, the shared pieces: the medal seal, the title tag, the daily
// goal ring and the celebration. Tiers are told apart by form and always by
// their word, never by colour alone (gold is retired; petrol is the accent).
import { h } from './dom.js';
import { ico } from './icons.js';
import { storedMedal, medalFor, goalProgress, goalOf, GOALS, setGoal, storedTitle, titleNextNeeds, TIERS } from '../core/flair.js';
import { isStreakAlive, levelFromXp, dayKey } from '../core/progress.js';
import { checkOf } from '../core/modulecheck.js';

const CHECK_PATH = '<path class="seal-check" d="M7.5 12.5 10.5 15.5 16.5 9" />';

// The seal's SVG: bronze a hairline ring, silver a double ring, gold a solid
// disc with a check; no medal yet an empty ring in the track colour.
function sealSvg(tier, draw) {
  const d = draw ? ' draw' : '';
  const body = tier === 'gold'
    ? `<circle class="seal-fill${d}" cx="12" cy="12" r="10.5" pathLength="100" />${CHECK_PATH}`
    : tier === 'silver'
      ? `<circle class="seal-ring thin${d}" cx="12" cy="12" r="10.5" pathLength="100" /><circle class="seal-ring thick${d}" cx="12" cy="12" r="7" pathLength="100" />`
      : tier === 'bronze'
        ? `<circle class="seal-ring${d}" cx="12" cy="12" r="10" pathLength="100" />`
        : '<circle class="seal-none" cx="12" cy="12" r="10" />';
  return `<svg class="seal" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
}

export function medalSeal(t, tier, size = 24, { draw = false } = {}) {
  return h('span', { class: `medal medal-${tier || 'none'} medal-${size}` },
    h('span', { class: 'seal-wrap', html: sealSvg(tier, draw) }),
    h('span', { class: 'medal-word' }, tier ? t(`medal_${tier}`) : t('medalNone')));
}

export function titleTag(t, rank) {
  if (!rank) return null;
  return h('span', { class: 'title-tag' }, t(`title_${rank}`));
}

// The end of a module's path: its medal (stored, or what the rules give
// now) and the module check: open, tried today ('tomorrow'), or null before bronze.
export function moduleEndModel(state, meta, today) {
  const stored = storedMedal(state, meta.subject, meta.id);
  const tier = stored || medalFor(state, meta);
  if (!tier) return { tier: null, check: null };
  const c = checkOf(state, meta.subject, meta.id);
  return { tier, check: c && c.last === today ? 'tomorrow' : 'open' };
}

// On a module row's meta line: the stored medal, small; nothing without one.
export function metaSeal(t, state, meta) {
  const tier = storedMedal(state, meta.subject, meta.id);
  return tier ? medalSeal(t, tier, 24) : null;
}

// The way into the module check, quiet (never the primary): a flag button
// once bronze is earned, a plain line after today's attempt.
export function checkEntry(t, end, onOpen) {
  if (!end || !end.check) return null;
  if (end.check === 'tomorrow') return h('p', { class: 'muted small check-tomorrow' }, t('checkTomorrow'));
  return h('button', { class: 'btn btn-ghost small check-btn', onclick: onOpen }, ico('flag'), ' ', t('checkTitle'));
}

// ---- The daily goal ring ----
// A thin ring (3 px, track and petrol arc, butt caps) with the number beside
// it; a check in the middle once the goal is reached. The arc is drawn at its
// new value; with from, CSS grows it from the old value (reduced motion
// shows the end state directly).
const rnd = (n) => Math.round(n * 100) / 100;
function ringSvg(share, done, fromShare) {
  const off = rnd(100 - Math.min(1, share) * 100);
  const grow = fromShare != null && fromShare < share;
  const style = grow ? ` style="--draw-from:${rnd(100 - Math.min(1, fromShare) * 100)}"` : '';
  return `<svg class="ring" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><circle class="ring-track" cx="20" cy="20" r="17" />`
    + `<circle class="ring-arc${grow ? ' grow' : ''}" cx="20" cy="20" r="17" pathLength="100" stroke-dasharray="100" stroke-dashoffset="${off}" transform="rotate(-90 20 20)"${style} />`
    + `${done ? `<path class="ring-check${grow ? ' grow' : ''}" d="M14 20.5 18 24.5 26 16" />` : ''}</svg>`;
}

export function goalRing(t, { xp, goal, done }, { from = null, small = false, label = null } = {}) {
  return h('span', { class: `goal-ring${small ? ' goal-ring-sm' : ''}${done ? ' done' : ''}`, role: 'img', 'aria-label': label || t('goalRing', xp, goal) },
    h('span', { class: 'ring-wrap', html: ringSvg(xp / goal, done, from == null ? null : from / goal) }),
    small ? null : h('span', { class: 'goal-num mono' }, `${xp}/${goal}`));
}

// Progress: the last seven days as small rings, today last, one label each.
export function weekRings(t, state, today, lang) {
  const goal = goalOf(state);
  const [y, m, d] = today.split('-').map(Number);
  const fmt = new Intl.DateTimeFormat(lang === 'nl' ? 'nl-NL' : 'en-GB', { weekday: 'short' });
  const days = Array.from({ length: 7 }, (_, i) => new Date(y, m - 1, d - 6 + i));
  return h('div', { class: 'week-rings' }, days.map((date) => {
    const x = Math.min(goal, ((state.xpDays || {})[dayKey(date)]) || 0);
    const name = fmt.format(date);
    return h('span', { class: 'week-ring' },
      goalRing(t, { xp: x, goal, done: x >= goal }, { small: true, label: t('goalDay', name, x, goal) }),
      h('span', { class: 'week-day', 'aria-hidden': 'true' }, name));
  }));
}

// Settings, Practice: three goals; synced, with the moment he chose.
export function goalPicker(app, now = Date.now) {
  const cur = goalOf(app.state);
  return h('div', { class: 'segmented goal-picker' }, GOALS.map((v) => h('button', {
    class: cur === v ? 'on' : '',
    'aria-pressed': String(cur === v),
    onclick: () => { app.setState(setGoal(app.state, v, now())); app.go('settings'); },
  }, app.t(`goal_${v}`))));
}

// The start screen's head: the title with the daily ring and the streak
// flame beside it (Q1: the flame stays, small), then level and XP quietly.
export function startHead(app) {
  const t = app.t;
  const s = app.state;
  const today = app.today();
  const streak = isStreakAlive(s.streak, today) ? s.streak.count : 0;
  const lv = levelFromXp(s.xp);
  return h('div', { class: 'start-head-wrap' },
    h('div', { class: 'start-head-row' },
      h('h1', { class: 'start-title' }, t('startTitle')),
      h('span', { class: 'start-goal' },
        goalRing(t, goalProgress(s, today)),
        h('span', { class: `start-flame${streak ? ' on' : ''}`, title: typeof t('streak', streak) === 'string' ? `${streak} ${t('streak', streak)}` : '' }, ico('flame'), h('b', {}, streak)))),
    h('p', { class: 'start-meta muted small' },
      `${t('level')} ${lv.level} · ${lv.into}/${lv.needed} XP`,
      s.freezes ? ` · ${t('freezesShort', s.freezes)}` : ''));
}

// ---- Titles ----
// After the subject's name on its start card and in its header; nothing
// before the first lesson or round.
export const subjectTitle = (t, state, subject) => titleTag(t, storedTitle(state, subject));

// One line on Progress: what is still missing for the next rank.
export function titleNextLine(t, state, subject, now) {
  const need = titleNextNeeds(state, subject, now);
  if (!need) return t('titleTop');
  const title = t(`title_${need.rank}`);
  if (subject === 'speak') return t('titleNextSpeak', title);
  const medals = need.medals ? t('titleNextMedals', need.medals, t(`medalAdj_${need.tier}`)) : '';
  if (need.levels && medals) return t('titleNext', need.levels, medals, title);
  if (need.levels) return t('titleNextLevels', need.levels, title);
  if (medals) return t('titleNextOnly', medals, title);
  return t('titleNextSpeak', title);
}

// "3 brons · 1 zilver · 0 goud": the stored medals of a subject.
export function medalsLine(t, state, subject) {
  const all = subject === 'speak' ? (state.speakMedals || {}) : ((((state.courses || {})[subject]) || {}).medals || {});
  const n = (tier) => Object.values(all).filter((m) => m && m.tier === tier).length;
  return t('medalsCount', ...TIERS.map(n));
}

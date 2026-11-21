// v16 flair, the shared pieces: the medal seal, the title tag, the daily
// goal ring and the celebration. Tiers are told apart by form and always by
// their word, never by colour alone (gold is retired; petrol is the accent).
import { h } from './dom.js';
import { ico } from './icons.js';
import { storedMedal, medalFor, goalProgress, goalOf, GOALS, setGoal, storedTitle, titleNextNeeds, TIERS } from '../core/flair.js';
import { isStreakAlive, levelFromXp, dayKey } from '../core/progress.js';
import { checkOf } from '../core/modulecheck.js';
import { celebrationOf } from '../core/flair.js';
import { cheerOn, cueFor, play as playCue } from '../core/sound.js';
import { guide, guideLine, guideSvg, guideOn, guideFigure, statusModel, andonIntroSeen, markAndonIntroSeen } from './guide.js';
import { dueNow } from '../core/course.js';
import { introFilm } from './film.js';
import { introSeen } from '../core/course.js';
import { MODULES, placeOf } from '../content/courses/index.js';

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
  return `<svg class="gring" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><circle class="ring-track" cx="20" cy="20" r="17" />`
    + `<circle class="ring-arc${grow ? ' grow' : ''}" cx="20" cy="20" r="17" pathLength="100" stroke-dasharray="100" stroke-dashoffset="${off}" transform="rotate(-90 20 20)"${style} />`
    + `${done ? `<path class="ring-check${grow ? ' grow' : ''}" d="M14 20.5 18 24.5 26 16" />` : ''}</svg>`;
}

export function goalRing(t, { xp, goal, done }, { from = null, small = false, label = null } = {}) {
  return h('span', { class: `goal-ring${small ? ' goal-ring-sm' : ''}${done ? ' done' : ''}`, role: 'img', 'aria-label': label || t('goalRing', xp, goal) },
    h('span', { class: 'gring-wrap', html: ringSvg(xp / goal, done, from == null ? null : from / goal) }),
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

// ---- The celebration ----
// One composed moment inside the done card: the guide lights its segments
// bottom to top (or the existing mark when the guide is off), the daily ring
// grows from the old to the new value, and only the biggest moment (title >
// medal > goal > lesson) is large; the rest are quiet lines. Everything is
// rendered at its end state; CSS animates from the start, so reduced motion
// shows the end at once. One summary for screen readers, at most one sound.
function itemText(t, lang, item) {
  if (item.kind === 'title') return t('titleNew', t(`title_${item.rank}`));
  if (item.kind === 'goal') return t('goalReached');
  if (item.kind === 'medal') {
    const meta = item.moduleId ? MODULES.find((m) => m.id === item.moduleId) : null;
    const name = meta ? (meta.title[lang] || meta.title.en) : t(`group_${item.groupId}`);
    return t('medalEarned', t(`medal_${item.tier}`), name);
  }
  return `+${item.xp} XP`;
}

function bigNode(t, lang, big, subject) {
  if (big.kind === 'title') {
    return h('div', { class: 'celebrate-big celebrate-title' },
      h('p', { class: 'celebrate-kicker' }, t(`subject_${big.subject || subject}`)),
      h('h3', { class: 'celebrate-name' }, itemText(t, lang, big)));
  }
  if (big.kind === 'medal') {
    return h('div', { class: 'celebrate-big celebrate-medal' },
      medalSeal(t, big.tier, 56, { draw: true }),
      h('p', { class: 'celebrate-name' }, itemText(t, lang, big)));
  }
  if (big.kind === 'goal') return h('p', { class: 'celebrate-big celebrate-goal' }, t('goalReached'));
  return null;
}

export function celebration(app, result, { mark = null, play = playCue, subject = null, gained = null } = {}) {
  const t = app.t;
  const c = celebrationOf(result);
  if (!c.big) return { nodes: [mark], big: null, summary: '' };
  const today = app.today();
  const after = goalProgress(app.state, today);
  const todayXp = ((app.state.xpDays || {})[today]) || 0;
  const ring = goalRing(t, after, { from: Math.max(0, Math.min(after.goal, todayXp - (gained ?? result.xp ?? 0))) });
  const quiet = c.quiet.filter((x) => x.kind !== 'lesson').map((x) => h('p', { class: 'quiet-line small' }, itemText(t, app.lang, x)));
  // One guide line at most: on a plain lesson, a done line from the pool.
  const line = c.big.kind === 'lesson' && guide(app.state) ? h('p', { class: 'guide-say small muted' }, guideLine(t, 'guideDone', today)) : null;
  const parts = [
    ...(result.xp > 0 ? [t('lessonDoneShort'), `+${result.xp} XP`] : []),
    ...[c.big, ...c.quiet].filter((x) => x.kind !== 'lesson').map((x) => itemText(t, app.lang, x)),
  ];
  const summary = t('celebrateSummary', parts);
  const live = h('p', { class: 'sr', 'aria-live': 'polite' });
  setTimeout(() => { live.textContent = summary; }, 60);
  const cue = cueFor(c);
  if (cue && cheerOn(app.state.settings)) play(cue, app.state.settings);
  return {
    big: c.big,
    summary,
    nodes: [
      h('div', { class: 'celebrate-head' }, guide(app.state, { mood: 'celebrate', size: 64 }) || mark, ring),
      bigNode(t, app.lang, c.big, subject),
      ...quiet,
      line,
      live,
    ],
  };
}

// How much XP is left for the daily goal, as a line; only after the first XP
// of the day and while the goal is still open, else null.
export function goalLeftText(app) {
  const g = goalProgress(app.state, app.today());
  return !g.xp || g.done ? null : app.t('goalLeft', g.goal - g.xp);
}

// The daily-goal line under Andon's bubble: "Nog 12 XP tot je dagdoel." It
// says what is left to do; the start screen's ring already shows (and reads
// out) "Dagdoel: 18 van 30 XP". Null before the first XP of the day and once
// the goal is reached.
export function goalLine(app) {
  const left = goalLeftText(app);
  if (!left) return null;
  const g = goalProgress(app.state, app.today());
  return h('p', { class: 'goal-line small muted', 'data-xp': g.xp, 'data-goal': g.goal }, left);
}

// ---- Andon visible (v17 Task 8) ----
// He was there all along but small; now he greets on the home screens and
// presents the intro on a module screen. Decoration plus at most one line,
// never a button, hidden everywhere (no gap) when the guide is off.

// The name of a course step, for Andon to say instead of "the one below":
// from the index alone, so it is final on first paint (no swap that moves the
// cards under the bubble): the lesson's topic, else the module title; a review
// by what it asks (its own mid-sentence wording). Null when there is no step.
export function stepName(app, pick) {
  if (!pick || pick.reason === 'done') return null;
  if (pick.reason === 'due') return app.t('courseWhat_due', pick.count || 0);
  if (pick.reason === 'maintain') return app.t('guideStepMaintain');
  const meta = pick.moduleId ? MODULES.find((m) => m.id === pick.moduleId) : null;
  if (!meta) return null;
  const place = pick.lessonId ? placeOf(pick.lessonId, MODULES) : null;
  return place ? (place.topic.title[app.lang] || place.topic.title.en) : (meta.title[app.lang] || meta.title.en);
}

// On a home screen, above the first card: 80 px, one line. Null when the
// guide is off, so nothing is left where he stood. `pick` is the course step
// the screen shows (the subject's pick, or the one behind the begin button):
// Andon names it, or says all is done; else a line from the day pool.
// With `goal` the daily-goal line (XP left) sits under the bubble as a
// separate small line, not a second Andon sentence: one Andon and one guide
// line per screen. It shows after the first XP of the day, while the goal is open.
export function guideGreeting(app, { subject = null, goal = false, pick = null } = {}) {
  if (!guideOn(app.state)) return null;
  const today = app.today();
  const model = statusModel({ due: dueFor(app, subject), goalDone: goalProgress(app.state, today).done });
  // First time on this device: he introduces himself instead of the day line,
  // one light blinking briefly. Marked at once (device only), so it is said
  // once; redraws of the same home keep the line (no second blink), so an
  // automatic redraw (sync after boot) never swallows it. A subject switch or
  // leaving the homes (app.go) ends it.
  const first = !andonIntroSeen(app.state);
  if (first) {
    app.andonIntroLive = subject || 'home';
    if (typeof app.setState === 'function') app.setState(markAndonIntroSeen(app.state));
  }
  const intro = first || (!!app.andonIntroLive && app.andonIntroLive === (subject || 'home'));
  if (!intro) app.andonIntroLive = false;
  const name = !intro ? stepName(app, pick) : null;
  const allDone = !intro && pick && pick.reason === 'done';
  const kind = intro ? 'intro' : allDone ? 'done' : name ? 'step' : 'day';
  const say = intro ? app.t('guideMeet')
    : allDone ? app.t('courseWhy_done')
      : name ? app.t('guideStep', name) : guideLine(app.t, 'guideHome', today);
  return h('div', { class: 'guide-greeting', 'data-subject': subject || '', 'data-line': kind, 'data-status': model.status },
    guideFigure(app.state, { mood: 'idle', size: 80, status: model, blink: first, statusText: app.t(model.status === 'due' ? 'guideStatusDue' : 'guideStatusOk') }),
    h('p', { class: 'guide-say' }, say),
    goal ? goalLine(app) : null);
}

// How many reviews wait for this screen: a course home counts its own queue,
// the speaking home its prompts, the start screen all of them.
export function dueFor(app, subject) {
  const course = (sub) => dueNow(app.state, sub, app.lang, app.today());
  const speak = () => (typeof app.dueReviews === 'function' ? app.dueReviews().length : 0);
  if (subject === 'eng' || subject === 'pm') return course(subject);
  if (subject === 'speak') return speak();
  return course('eng') + course('pm') + speak();
}

// What Andon shows with a module's intro, from the state alone (pure): idle
// with a line until the intro is seen, then the top light and no line. Null
// for a module without an intro film or with the guide off.
export function introGuideModel(state, meta) {
  if (!guideOn(state) || !introFilm(meta)) return null;
  return introSeen(state, meta.id) ? { mood: 'right', line: null } : { mood: 'idle', line: 'guideIntro' };
}

// Beside the intro heading on the module screen: 72 px, and the heading (when
// given) in the text column with his line under it.
export function guideIntro(app, meta, heading = null) {
  const m = introGuideModel(app.state, meta);
  if (!m) return null;
  const status = statusModel({ due: dueFor(app, meta.subject) });
  return h('div', { class: 'guide-intro', 'data-mood': m.mood, 'data-status': status.status },
    guideFigure(app.state, { mood: m.mood, size: 72, status, statusText: app.t(status.status === 'due' ? 'guideStatusDue' : 'guideStatusOk') }),
    h('div', { class: 'guide-intro-text' },
      heading,
      m.line ? h('p', { class: 'guide-say' }, app.t(m.line)) : null));
}

// The intro was watched while the screen is open: light the top and drop the
// line in place (the video is not re-rendered).
export function guideIntroSeen(el) {
  if (!el) return;
  const a = el.querySelector('.guide');
  if (a) a.innerHTML = guideSvg('right', { status: statusModel({ due: el.getAttribute('data-status') === 'due' ? 1 : 0 }) });
  const say = el.querySelector('.guide-say');
  if (say) {
    // The bubble is taller than the tower: keep the block's height so nothing below moves.
    const r = typeof el.getBoundingClientRect === 'function' ? el.getBoundingClientRect() : null;
    if (r && r.height > 0) el.style.minHeight = `${Math.ceil(r.height)}px`;
    say.remove();
  }
  el.setAttribute('data-mood', 'right');
}

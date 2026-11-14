import { weakestDrill } from '../core/lesson.js';
import { weekFocus } from '../core/weekly.js';
import { masteryOf, ownedDrills } from '../core/mastery.js';
import { todayPick, startCards, homeNotices } from '../core/today.js';
import { speakLayout, toggleSpeak, speakOpen, DRILL_GROUPS, groupProgress, openGroups, toggleGroup } from '../core/layout.js';
import { programmeWeek, PROGRAMME, startProgramme, stopProgramme, baselineDue } from '../core/programme.js';
import { challengePrompt } from '../core/share.js';
import { MODULES } from '../content/courses/index.js';
import TIPS from '../content/tips.js';
import { upcoming, needsReflection, unusedSkill } from '../core/realweek.js';
import { EVENT_ICON, fmtDay, startRehearsal } from './realweek.js';
import { startHead, subjectTitle } from './flairui.js';
import { h, DRILL_ICON, enableOnFail } from './dom.js';
import { ico } from './icons.js';
import { levelFromXp, isStreakAlive, daysPractised } from '../core/progress.js';
import { currentQuests } from '../core/quests.js';
import { bossAvailable } from '../core/boss.js';
import { makePrompt } from '../core/lesson.js';
import { subjectBar, SUBJECT_TABS } from './subjectbar.js';
import { courseHome, COURSE_ICON, openPick, pickWhy } from './coursehome.js';
import { listenEntry } from './listenback.js';

// The Vantage mark (one image per theme, CSS shows the right one) and the wordmark.
export function brandLockup() {
  return h('div', { class: 'brand' },
    h('img', { class: 'brand-mark mark-light', src: 'brand/mark.svg', alt: '', width: 30, height: 30 }),
    h('img', { class: 'brand-mark mark-dark', src: 'brand/mark-on-dark.svg', alt: '', width: 30, height: 30 }),
    h('span', { class: 'wordmark' }, 'Vantage Point'));
}

export function navBar(app, active) {
  const t = app.t;
  // Home is the start screen: the overview of all three subjects.
  const item = (id, icon) => h('button', {
    class: `nav-item${active === id ? ' active' : ''}`,
    onclick: () => (id === 'home' ? app.setSubject('start') : app.go(id)),
    'aria-current': active === id ? 'page' : null,
  }, h('span', { class: 'nav-icon' }, ico(icon)), h('span', {}, t(`nav_${id}`)));
  return h('nav', { class: 'navbar' }, item('home', 'house'), item('progress', 'gauge'), item('settings', 'settings'));
}

// A fold on the speaking home: closed by default, what he opened is kept in ui.speakOpen.
function speakFold(app, key, cls, open, summary, body) {
  return h('details', {
    class: `${cls} speak-fold`, open,
    ontoggle: (e) => {
      const isOpen = e.currentTarget.open;
      if (speakOpen(app.state.ui).includes(key) === isOpen) return;
      app.setState({ ...app.state, ui: toggleSpeak(app.state.ui, key, isOpen) });
    },
  }, h('summary', { class: 'fold-head' }, summary), body);
}

function questCard(app, open) {
  const t = app.t;
  const items = currentQuests(app.state, app.today());
  const done = items.filter((q) => q.done).length;
  return speakFold(app, 'quests', 'card quest-card', open,
    [h('h2', { class: 'card-title' }, t('questsTitle')),
      h('span', { class: 'muted small quest-reward' }, ico('snowflake'), ' ', done === items.length ? t('questsAllDone') : `${done}/${items.length} · ${t('questsReward')}`)],
    h('div', { class: 'fold-body' }, items.map((q) => h('div', { class: `quest${q.done ? ' done' : ''}` },
      h('span', { class: 'quest-check', 'aria-hidden': 'true' }, q.done ? ico('check') : ''),
      h('span', {}, t(`quest_${q.id}`)),
      h('span', { class: 'muted small' }, '+15')))));
}

// Learn → Practise → Own, as a small label on each drill.
export const masteryBadge = (t, m) => h('span', { class: `mastery m-${m}` }, t(`mastery_${m}`));

// My real week: the next event to rehearse, a reflection that is due, or an invitation.
function realWeekCard(app) {
  const t = app.t;
  const today = app.today();
  const due = needsReflection(app.state.events, today)[0];
  const next = upcoming(app.state.events, today)[0];
  const open = () => app.go('realweek');
  if (due) {
    return h('button', { class: 'btn rw-card', onclick: open },
      h('span', { class: 'rw-card-title' }, ico('notebook-pen'), ' ', t('rwReflectNow')), h('span', { class: 'muted small' }, due.text));
  }
  if (next) {
    return h('div', { class: 'card rw-home' },
      h('div', {}, h('p', { class: 'muted small' }, ico('calendar'), ` ${t('rwComing')} · `, ico(EVENT_ICON[next.type]), ` ${fmtDay(app, next.date)}`), h('p', { class: 'rw-text' }, next.text)),
      h('div', { class: 'rw-actions' },
        h('button', { class: 'btn btn-ghost small', onclick: (ev) => { ev.currentTarget.disabled = true; startRehearsal(app, next); } }, ico('mic'), ' ', t('rwRehearse')),
        h('button', { class: 'btn btn-ghost small', onclick: open }, t('rwAll'))));
  }
  return h('button', { class: 'btn btn-ghost rw-invite', onclick: open }, ico('calendar'), ' ', t('rwInvite'));
}

// "One next thing": the single round recommended now, and why.
function todayCard(app) {
  const t = app.t;
  const pick = todayPick(app.state, app.today(), app.content, app.lang);
  const d = pick.prompt.drill;
  const why = pick.reason === 'event' ? t('todayWhy_event', pick.event.text) : t(`todayWhy_${pick.reason}`);
  const go = (ev) => {
    ev.currentTarget.disabled = true;
    if (pick.reason === 'event') { startRehearsal(app, pick.event); return; }
    app.session = null;
    app.go('round', { prompt: pick.prompt });
  };
  const week = programmeWeek(app.state, app.today());
  return h('section', { class: 'card today-card' },
    h('p', { class: 'today-label' }, week ? `${t('todayNext')} · ${t('progWeek', week, t(`progTheme_${PROGRAMME[week - 1].id}`))}` : t('todayNext')),
    h('p', { class: 'today-what' }, ico(DRILL_ICON[d]), ' ', t(`drill_${d}`)),
    h('p', { class: 'muted small' }, why),
    nudgeLine(app),
    h('button', { class: 'btn btn-primary today-go', onclick: go }, ico('play'), ' ', pick.reason === 'event' ? t('todayRehearse') : t('todayGo')));
}

// One line toward the real-life skill he hasn't used lately; the pick itself stays the same.
function nudgeLine(app) {
  const skill = unusedSkill(app.state.events, Date.now());
  return skill ? h('p', { class: 'muted small today-nudge' }, app.t('todayNudge', app.t(`skill_${skill}`))) : null;
}

// "What's coming up?": real situations, each mapped to the drills that train it.
function situationFinder(app) {
  const t = app.t;
  return h('details', { class: 'card finder' },
    h('summary', {}, ico('compass'), ' ', t('finderTitle')),
    TIPS.situations.map((sit) => h('div', { class: 'finder-row' },
      h('p', { class: 'finder-label' }, sit[app.lang] || sit.en),
      h('div', { class: 'finder-drills' }, sit.drills.map((d) => h('button', {
        class: 'btn btn-ghost small', onclick: () => app.startDrill(d),
      }, ico(DRILL_ICON[d]), ' ', t(`drill_${d}`)))))));
}

// The optional 4-week programme: start, status with this week's drills, stop.
function programmeCard(app) {
  const t = app.t;
  const s = app.state;
  const today = app.today();
  const week = programmeWeek(s, today);
  if (!week) {
    const finished = !!(s.programme && s.programme.start);
    return h('section', { class: 'card programme-card' },
      h('h3', { class: 'card-title' }, t('progTitle')),
      h('p', { class: 'prog-intro' }, finished ? t('progDone') : t('progShort')),
      h('button', {
        class: 'btn btn-ghost',
        onclick: () => {
          const next = startProgramme(app.state, today, app.content, app.lang, Math.random);
          app.setState(next);
          const b = next.programme.baseline;
          const prompt = challengePrompt({ drill: b.drill, promptId: b.promptId }, app.content);
          if (!prompt) { app.go('home'); return; }
          app.session = null;
          app.toast(t('progStarted'));
          app.go('round', { prompt, notice: t('progBaseline'), modifier: null });
        },
      }, finished ? t('progRestart') : t('progStart')));
  }
  const theme = PROGRAMME[week - 1];
  return h('section', { class: 'card programme-card' },
    h('h3', { class: 'card-title' }, t('progTitle')),
    h('p', {}, h('b', {}, t('progWeek', week, t(`progTheme_${theme.id}`)))),
    baselineDue(s, today) && s.programme.baseline.lang !== app.lang ? h('p', { class: 'note' }, t('progOtherLang')) : null,
    h('div', { class: 'finder-drills' }, theme.drills.map((d) => h('button', { class: 'btn btn-ghost small', onclick: () => app.startDrill(d) },
      ico(DRILL_ICON[d]), ' ', t(`drill_${d}`)))),
    h('button', { class: 'btn btn-ghost small prog-stop', onclick: () => { app.setState(stopProgramme(app.state)); app.go('home'); } }, t('progStop')));
}

// A drill tile: icon, name, mastery and level pips.
function drillTile(app, d) {
  const t = app.t;
  const s = app.state;
  return h('button', { class: `drill drill-${d}`, onclick: () => app.startDrill(d) },
    h('span', { class: 'drill-icon' }, ico(DRILL_ICON[d])),
    h('span', { class: 'drill-name' }, t(`drill_${d}`)),
    masteryBadge(t, masteryOf(s.history, d)),
    h('span', { class: 'pips', 'aria-label': `${t('level')} ${s.drillLevels[d]}` },
      [1, 2, 3, 4, 5].map((n) => h('i', { class: n <= s.drillLevels[d] ? 'on' : '' }))));
}

// A thin progress bar; the share is 0–1. Decorative: the text next to it says it.
export const progressBar = (share) => h('span', { class: 'pbar', 'aria-hidden': 'true' },
  h('i', { style: `width:${Math.round(Math.max(0, Math.min(1, share)) * 100)}%` }));

// One drill group that folds open; its open state is remembered in ui.drillGroups.
function drillGroup(app, g, open) {
  const t = app.t;
  const p = groupProgress(app.state.history, g);
  return h('details', {
    class: `drill-group group-${g.id}`, open,
    ontoggle: (e) => {
      const isOpen = e.currentTarget.open;
      if (openGroups(app.state.ui).includes(g.id) === isOpen) return;
      app.setState({ ...app.state, ui: toggleGroup(app.state.ui, g.id, isOpen) });
    },
  },
  h('summary', { class: 'group-head' },
    h('span', { class: 'group-name' }, t(`group_${g.id}`)),
    h('span', { class: 'group-meta muted small' }, t('groupProgress', p.owned, p.total)),
    progressBar(p.share)),
  h('div', { class: 'drill-grid' }, g.drills.map((d) => drillTile(app, d))));
}

// The speaking home below the header: four bands (speakLayout), one primary button; quests and practice fold shut.
function speakBands(app) {
  const t = app.t;
  const s = app.state;
  const today = app.today();
  const doneToday = (s.days[today] || 0) >= 3;
  const weak = weekFocus(s, new Date()) || weakestDrill(s.history, ownedDrills(s.history));
  const dueCount = app.dueReviews().length;
  const open = openGroups(s.ui);
  const ITEMS = {
    next: () => todayCard(app),
    quests: (o) => questCard(app, o),
    lesson: () => h('button', { class: 'btn btn-hero', onclick: () => app.startLesson() },
      h('span', { class: 'hero-title' }, ico('layers'), ' ', doneToday ? t('lessonDone') : t('todayLesson')),
      h('span', { class: 'hero-sub' }, weak ? `${t('lessonSub')} · ${t('lessonFocus', t(`drill_${weak}`))}` : t('lessonSub'))),
    reviews: () => (dueCount ? h('button', { class: 'btn review-card', onclick: () => app.startReviews() },
      h('span', { class: 'hero-title' }, ico('repeat'), ' ', t('reviewTitle')),
      h('span', { class: 'hero-sub' }, t('reviewSub', Math.min(3, dueCount)))) : null),
    quick: () => h('button', { class: 'btn btn-ghost quick-btn', onclick: () => app.startQuick() }, ico('timer'), ' ', t('quickRound')),
    groups: (o) => speakFold(app, 'practice', 'card practice-fold', o,
      [h('h2', { class: 'card-title' }, t('speakPractice')),
        h('span', { class: 'muted small' }, t('speakPracticeCount', DRILL_GROUPS.reduce((n, g) => n + g.drills.length, 0)))],
      h('div', { class: 'drill-groups fold-body' }, DRILL_GROUPS.map((g) => drillGroup(app, g, open.includes(g.id))))),
    boss: () => (bossAvailable(s, new Date()) ? h('button', {
      class: 'btn boss-card',
      onclick: () => { app.session = null; app.go('round', { prompt: makePrompt('boss', app.content, Math.random, s.seen) }); },
    }, h('span', { class: 'hero-title' }, ico('crown'), ' ', t('bossTitle')), h('span', { class: 'hero-sub' }, t('bossSub'))) : null),
    programme: () => programmeCard(app),
    targeted: () => h('button', {
      class: 'drill convo-card target-card',
      onclick: async (e) => {
        const btn = e.currentTarget;
        btn.disabled = true;
        btn.querySelector('.muted').textContent = t('targetLoading');
        await app.startTargeted();
      },
    },
    h('span', { class: 'drill-icon' }, ico('crosshair')),
    h('span', { class: 'drill-name' }, t('targetTitle')),
    h('span', { class: 'muted small' }, s.settings.apiKey ? t('targetSubAI') : t('targetSub'))),
    realweek: () => realWeekCard(app),
    conversation: () => h('button', {
      class: 'drill convo-card',
      onclick: () => app.go(s.settings.apiKey ? 'conversation' : 'settings'),
    },
    h('span', { class: 'drill-icon' }, ico('message-circle')),
    h('span', { class: 'drill-name' }, t('convoTitle')),
    h('span', { class: 'muted small' }, s.settings.apiKey ? t('convoSub') : t('convoNeedsKey'))),
    finder: () => situationFinder(app),
    listen: () => listenEntry(app),
  };
  return speakLayout(s).map((b) => {
    const items = b.items.map((i) => ITEMS[i.id](i.open)).filter(Boolean);
    return items.length ? h('section', { class: `band band-${b.id}`, 'aria-labelledby': `band-${b.id}` },
      h('h2', { class: 'band-title', id: `band-${b.id}` }, t(`band_${b.id}`)), items) : null;
  });
}

// One compact card per subject: its next step and why. Tapping opens that subject's home.
function startCard(app, card) {
  const t = app.t;
  const icon = Object.fromEntries(SUBJECT_TABS)[card.subject];
  let what;
  let why;
  if (card.subject === 'speak') {
    what = h('span', { class: 'start-what' }, ico(DRILL_ICON[card.drill]), ' ', t(`drill_${card.drill}`));
    why = card.reason === 'event' ? t('todayWhy_event', card.eventText) : t(`todayWhy_${card.reason}`);
  } else {
    const meta = card.moduleId ? MODULES.find((m) => m.id === card.moduleId) : null;
    const modTitle = meta ? (meta.title[app.lang] || meta.title.en) : '';
    what = h('span', { class: 'start-what' }, ico(COURSE_ICON[card.reason]), ' ', modTitle || t(`courseWhat_${card.reason}`, card.count || 0));
    why = pickWhy(t, app.lang, card, meta);
    // The lesson title lives in the module file: fill it in once it is loaded.
    if (card.lessonId && meta) {
      app.openModule(card.subject, meta.id).then((mod) => {
        const l = mod.lessons.find((x) => x.id === card.lessonId);
        if (l && what.isConnected) what.replaceChildren(ico(COURSE_ICON[card.reason]), ' ', l.title);
      }).catch(() => {});
    }
  }
  return h('button', {
    class: `btn start-card start-${card.subject}${card.suggested ? ' suggested' : ''}`,
    onclick: () => app.setSubject(card.subject),
  },
  h('span', { class: 'start-head' },
    h('span', { class: 'start-subject' }, ico(icon), ' ', t(`subject_${card.subject}`),
      subjectTitle(t, app.state, card.subject) ? [h('span', { class: 'muted' }, ' · '), subjectTitle(t, app.state, card.subject)] : null),
    card.done ? h('span', { class: 'start-done' }, ico('check'), ' ', t('startDone')) : null),
  what,
  h('span', { class: 'start-why' }, why),
  h('span', { class: 'start-open' }, t('startOpen', t(`subject_${card.subject}`)), ' ', ico('chevron-right')));
}

function breakCard(app, show) {
  if (!show) return null;
  return h('section', { class: 'card break-card' },
    h('p', {}, app.t('streakReset', daysPractised(app.state))),
    h('button', { class: 'icon-btn small', 'aria-label': app.t('dismiss'), onclick: (e) => e.currentTarget.parentElement.remove() }, ico('x')));
}

// After the first v16 start: one quiet line about the medals and title his
// earlier work earned (Q7), shown once.
function flairNote(app, note) {
  if (!note) return null;
  const title = note.rank ? app.t(`title_${note.rank}`) : '';
  return h('p', { class: 'muted small flair-note' }, ico('award'), ' ', app.t('titleSoFar', note.medals, title));
}

// The start screen: under the Vantage Point name, one today card per subject,
// and the streak and level in one quiet line.
function renderStart(app, root, showBreak, note) {
  const t = app.t;
  const s = app.state;
  const today = app.today();
  const cards = startCards(s, today, app.content, app.lang);
  root.append(
    h('header', { class: 'top' }, brandLockup()),
    h('main', { class: 'screen home start' },
      breakCard(app, showBreak),
      startHead(app),
      flairNote(app, note),
      beginButton(app, cards.find((c) => c.suggested) || cards[0]),
      h('p', { class: 'start-or muted small' }, t('startOr')),
      h('div', { class: 'start-cards' }, cards.map((c) => startCard(app, c))),
      realWeekEntry(app),
      navigator.onLine ? null : h('p', { class: 'note' }, t('offline'))),
    navBar(app, 'home'));
}

// A quiet way into "My real week" from the start screen and the course homes.
export function realWeekEntry(app, compact = false) {
  const t = app.t;
  return h('button', { class: `btn btn-ghost rw-entry${compact ? ' small' : ''}`, onclick: () => app.go('realweek') },
    h('span', { class: 'rw-entry-title' }, ico('calendar'), ' ', t('rwTitle')),
    compact ? null : h('span', { class: 'muted small' }, t('rwEntry')));
}

// The one primary action of the app: start the recommended next step now.
function beginButton(app, card) {
  const t = app.t;
  const begin = (ev) => {
    const btn = ev.currentTarget;
    btn.disabled = true;
    if (card.subject === 'speak') {
      const pick = todayPick(app.state, app.today(), app.content, app.lang);
      if (pick.reason === 'event') { startRehearsal(app, pick.event); return; }
      app.session = null;
      app.go('round', { prompt: pick.prompt });
      return;
    }
    if (card.reason === 'done') { app.setSubject(card.subject); return; }
    // A say-it whose module fails to load: the button works again.
    enableOnFail(btn, openPick(app, card.subject, card));
  };
  return h('button', { class: 'btn btn-primary btn-big begin-btn', onclick: begin },
    h('span', { class: 'begin-main' }, ico('play'), ' ', t('startBegin')),
    h('span', { class: 'begin-sub' }, t(`subject_${card.subject}`)));
}

// Inside a subject: a labelled way back to the overview, and the streak.
function subjectHeader(app) {
  const t = app.t;
  const s = app.state;
  const streak = isStreakAlive(s.streak, app.today()) ? s.streak.count : 0;
  return h('header', { class: 'top' },
    h('button', { class: 'back-btn', onclick: () => app.setSubject('start') }, ico('chevron-left'), h('span', {}, t('overview'))),
    subjectTitle(t, s, app.subject),
    h('div', { class: `streak${streak ? ' on' : ''}`, title: t('streak', streak) },
      ico('flame'), h('b', {}, streak), h('span', { class: 'streak-label' }, t('streak', streak)),
      s.freezes ? h('span', { class: 'freezes', title: t('freezesTitle') }, ico('snowflake'), ` ${s.freezes}`) : null));
}

export function renderHome(app, _params, root) {
  const t = app.t;
  const s = app.state;
  const today = app.today();
  // Gentle, once a day: the streak broke, but the total never resets. And,
  // on the start screen, the one-time flair line. Decided before drawing.
  const once = homeNotices(s, today, { broke: app.broke, onStart: app.subject === 'start' });
  const { showBreak, note } = once;
  if (once.state !== s) app.setState(once.state);

  if (app.subject === 'start') { renderStart(app, root, showBreak, note); return; }
  // A course subject: its own home under the same header and bar.
  if (app.subject !== 'speak') {
    root.append(subjectHeader(app), subjectBar(app), courseHome(app, app.subject), navBar(app, 'home'));
    return;
  }
  // Speaking: four bands, Vandaag first.
  root.append(
    subjectHeader(app),
    subjectBar(app),
    h('main', { class: 'screen home speak-home' },
      h('h1', { class: 'sr' }, t('subject_speak')),
      breakCard(app, showBreak),
      ...speakBands(app),
      navigator.onLine ? null : h('p', { class: 'note' }, t('offline'))),
    navBar(app, 'home'),
  );
}

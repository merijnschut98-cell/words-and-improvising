import { weakestDrill } from '../core/lesson.js';
import { weekFocus } from '../core/weekly.js';
import { masteryOf, ownedDrills } from '../core/mastery.js';
import { todayPick, startCards, MORE_GROUPS } from '../core/today.js';
import { programmeWeek, PROGRAMME, startProgramme, stopProgramme, baselineDue } from '../core/programme.js';
import { challengePrompt } from '../core/share.js';
import { MODULES } from '../content/courses/index.js';
import TIPS from '../content/tips.js';
import { upcoming, needsReflection, unusedSkill } from '../core/realweek.js';
import { EVENT_ICON, fmtDay, startRehearsal } from './realweek.js';
import { h, DRILL_ICON, enableOnFail } from './dom.js';
import { ico } from './icons.js';
import { levelFromXp, isStreakAlive, DRILLS, daysPractised } from '../core/progress.js';
import { currentQuests } from '../core/quests.js';
import { bossAvailable } from '../core/boss.js';
import { makePrompt } from '../core/lesson.js';
import { subjectBar, SUBJECT_TABS } from './subjectbar.js';
import { courseHome, COURSE_ICON, openPick } from './coursehome.js';

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

function questCard(app) {
  const t = app.t;
  const items = currentQuests(app.state, app.today());
  const done = items.filter((q) => q.done).length;
  return h('section', { class: 'card quest-card' },
    h('div', { class: 'level-row' },
      h('h2', { class: 'card-title' }, t('questsTitle')),
      h('span', { class: 'muted small quest-reward' }, ico('snowflake'), ' ', done === items.length ? t('questsAllDone') : `${done}/${items.length} · ${t('questsReward')}`)),
    items.map((q) => h('div', { class: `quest${q.done ? ' done' : ''}` },
      h('span', { class: 'quest-check', 'aria-hidden': 'true' }, q.done ? ico('check') : ''),
      h('span', {}, t(`quest_${q.id}`)),
      h('span', { class: 'muted small' }, '+15'))));
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
      h('p', {}, finished ? t('progDone') : t('progIntro')),
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

// Everything that is not the one next thing, behind one labelled disclosure.
export function morePractice(app) {
  const t = app.t;
  const s = app.state;
  const dueCount = app.dueReviews().length;
  const ITEMS = {
    quick: () => h('button', { class: 'btn btn-ghost quick-btn', onclick: () => app.startQuick() }, ico('timer'), ' ', t('quickRound')),
    drills: () => h('div', { class: 'drill-grid' }, DRILLS.map((d) => h('button', {
      class: `drill drill-${d}`, onclick: () => app.startDrill(d),
    },
    h('span', { class: 'drill-icon' }, ico(DRILL_ICON[d])),
    h('span', { class: 'drill-name' }, t(`drill_${d}`)),
    masteryBadge(t, masteryOf(s.history, d)),
    h('span', { class: 'pips', 'aria-label': `${t('level')} ${s.drillLevels[d]}` },
      [1, 2, 3, 4, 5].map((n) => h('i', { class: n <= s.drillLevels[d] ? 'on' : '' })))))),
    reviews: () => (dueCount ? h('button', { class: 'btn review-card', onclick: () => app.startReviews() },
      h('span', { class: 'hero-title' }, ico('repeat'), ' ', t('reviewTitle')),
      h('span', { class: 'hero-sub' }, t('reviewSub', Math.min(3, dueCount)))) : null),
    boss: () => (bossAvailable(s, new Date()) ? h('button', {
      class: 'btn boss-card',
      onclick: () => { app.session = null; app.go('round', { prompt: makePrompt('boss', app.content, Math.random, s.seen) }); },
    }, h('span', { class: 'hero-title' }, ico('crown'), ' ', t('bossTitle')), h('span', { class: 'hero-sub' }, t('bossSub'))) : null),
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
    conversation: () => h('button', {
      class: 'drill convo-card',
      onclick: () => app.go(s.settings.apiKey ? 'conversation' : 'settings'),
    },
    h('span', { class: 'drill-icon' }, ico('message-circle')),
    h('span', { class: 'drill-name' }, t('convoTitle')),
    h('span', { class: 'muted small' }, s.settings.apiKey ? t('convoSub') : t('convoNeedsKey'))),
    realweek: () => realWeekCard(app),
    finder: () => situationFinder(app),
    quests: () => questCard(app),
    programme: () => programmeCard(app),
  };
  const groups = MORE_GROUPS.map((g) => {
    const items = g.items.map((id) => ITEMS[id]()).filter(Boolean);
    return items.length ? h('div', { class: `more-group more-${g.id}` }, h('h2', { class: 'more-title' }, t(`more_${g.id}`)), items) : null;
  });
  return h('details', {
    class: 'more', open: !!(s.ui || {}).moreOpen,
    ontoggle: (e) => { app.setState({ ...app.state, ui: { ...(app.state.ui || {}), moreOpen: e.currentTarget.open } }); },
  },
  h('summary', {}, h('span', { class: 'more-label' }, t('moreTitle')), h('span', { class: 'muted small more-sub' }, t('moreSub'))),
  groups);
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
    why = modTitle && card.lessonId ? `${t(`courseWhy_${card.reason}`)} · ${modTitle}` : t(`courseWhy_${card.reason}`);
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
    h('span', { class: 'start-subject' }, ico(icon), ' ', t(`subject_${card.subject}`)),
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

// The start screen: under the Vantage Point name, one today card per subject,
// and the streak and level in one quiet line.
function renderStart(app, root, showBreak) {
  const t = app.t;
  const s = app.state;
  const today = app.today();
  const streak = isStreakAlive(s.streak, today) ? s.streak.count : 0;
  const lv = levelFromXp(s.xp);
  const cards = startCards(s, today, app.content, app.lang);
  root.append(
    h('header', { class: 'top' }, brandLockup()),
    h('main', { class: 'screen home start' },
      breakCard(app, showBreak),
      h('h1', { class: 'start-title' }, t('startTitle')),
      h('p', { class: 'start-meta muted small' },
        ico('flame'), ` ${streak} ${t('streak', streak)} · ${t('level')} ${lv.level} · ${lv.into}/${lv.needed} XP`,
        s.freezes ? ` · ${t('freezesShort', s.freezes)}` : ''),
      beginButton(app, cards.find((c) => c.suggested) || cards[0]),
      h('p', { class: 'start-or muted small' }, t('startOr')),
      h('div', { class: 'start-cards' }, cards.map((c) => startCard(app, c))),
      navigator.onLine ? null : h('p', { class: 'note' }, t('offline'))),
    navBar(app, 'home'));
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
    h('div', { class: `streak${streak ? ' on' : ''}`, title: t('streak', streak) },
      ico('flame'), h('b', {}, streak), h('span', { class: 'streak-label' }, t('streak', streak)),
      s.freezes ? h('span', { class: 'freezes', title: t('freezesTitle') }, ico('snowflake'), ` ${s.freezes}`) : null));
}

export function renderHome(app, _params, root) {
  const t = app.t;
  const s = app.state;
  const today = app.today();
  const doneToday = (s.days[today] || 0) >= 3;
  const weak = weekFocus(s, new Date()) || weakestDrill(s.history, ownedDrills(s.history));
  // Gentle, once a day: the streak broke, but the total never resets.
  const showBreak = app.broke && (s.ui || {}).seenBreak !== today && s.streak.count > 0;
  if (showBreak) app.setState({ ...s, ui: { ...(s.ui || {}), seenBreak: today } });

  if (app.subject === 'start') { renderStart(app, root, showBreak); return; }
  // A course subject: its own home under the same header and bar.
  if (app.subject !== 'speak') {
    root.append(subjectHeader(app), subjectBar(app), courseHome(app, app.subject), navBar(app, 'home'));
    return;
  }
  // Speaking: the Today card, the daily lesson, then "More practice".
  root.append(
    subjectHeader(app),
    subjectBar(app),
    h('main', { class: 'screen home' },
      h('h1', { class: 'sr' }, t('subject_speak')),
      breakCard(app, showBreak),
      todayCard(app),
      h('button', { class: 'btn btn-hero', onclick: () => app.startLesson() },
        h('span', { class: 'hero-title' }, ico('layers'), ' ', doneToday ? t('lessonDone') : t('todayLesson')),
        h('span', { class: 'hero-sub' }, weak ? `${t('lessonSub')} · ${t('lessonFocus', t(`drill_${weak}`))}` : t('lessonSub'))),
      morePractice(app),
      navigator.onLine ? null : h('p', { class: 'note' }, t('offline'))),
    navBar(app, 'home'),
  );
}

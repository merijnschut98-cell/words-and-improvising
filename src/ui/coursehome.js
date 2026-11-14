// Course home: one next thing, the due questions, and the module map.
import { h, enableOnFail } from './dom.js';
import { ico } from './icons.js';
import { masteryBadge, realWeekEntry, progressBar } from './home.js';
import { MODULES, TRACKS, topicsOf, placeOf } from '../content/courses/index.js';
import { courseTodayPick, moduleMastery, nextLesson, levelsDone } from '../core/course.js';
import { pathModel, topicPath } from './pathmap.js';
import { medalSeal, metaSeal, moduleEndModel, checkEntry, goalLeftLine } from './flairui.js';
import { dueCount } from '../core/coursereview.js';
import { FROM_MODULE } from '../core/moduleexit.js';
import { moduleTier, trackProgress, openTrack } from '../core/layout.js';

export const COURSE_ICON = { apply: 'pen-line', prep: 'calendar', due: 'repeat', lesson: 'book-open', situation: 'drama', sayIt: 'mic', maintain: 'wrench', done: 'circle-check' };

// The reason line for a course pick: a lesson for an event says so; prep names the event.
export const courseWhy = (t, pick) => t(`courseWhy_${pick.why || pick.reason}`, pick.eventText || '');

// "Draaien · Gevorderd" for a lesson in a topic module; '' otherwise.
export function placeLabel(t, lang, lessonId, modules = MODULES) {
  const p = placeOf(lessonId, modules);
  return p ? t('topicLevel', p.topic.title[lang] || p.topic.title.en, t(`level_${p.level}`)) : '';
}

// The why line of a course pick: a topic lesson names its topic and level, a
// lesson elsewhere its module.
export function pickWhy(t, lang, pick, meta, modules = MODULES) {
  const place = pick.topicId && pick.lessonId ? placeLabel(t, lang, pick.lessonId, modules) : '';
  if (place) return `${courseWhy(t, pick)} · ${place}`;
  return meta && pick.lessonId ? `${courseWhy(t, pick)} · ${meta.title[lang] || meta.title.en}` : courseWhy(t, pick);
}

function modTitle(app, meta) { return meta.title[app.lang] || meta.title.en; }

// Opens what the Today card or a lesson row points at.
export function openPick(app, subject, pick) {
  if (pick.reason === 'apply') return app.go('apply', { subject, planId: pick.planId });
  if (pick.reason === 'prep') return app.go('due', { subject, questionIds: pick.questionIds, prep: pick.eventId });
  if (pick.reason === 'due') return app.go('due', { subject });
  if (pick.reason === 'maintain') return app.go('due', { subject, questionIds: [pick.questionId], maintenance: true });
  if (pick.reason === 'lesson') return app.go('lesson', { subject, moduleId: pick.moduleId, lessonId: pick.lessonId });
  if (pick.reason === 'situation') return app.go('situation', { subject, moduleId: pick.moduleId, lessonId: pick.lessonId });
  if (pick.reason === 'sayIt') return app.startSayIt(subject, pick.moduleId, pick.lessonId);
  return null;
}

function todayCard(app, subject, pick) {
  const t = app.t;
  const meta = pick.moduleId ? MODULES.find((m) => m.id === pick.moduleId) : null;
  const what = h('p', { class: 'today-what' }, ico(COURSE_ICON[pick.reason]), ' ',
    meta ? modTitle(app, meta) : t(`courseWhat_${pick.reason}`, pick.count || 0));
  // The lesson title lives in the module file: fill it in once it is loaded.
  if (pick.lessonId && meta) {
    app.openModule(subject, meta.id).then((mod) => {
      const l = mod.lessons.find((x) => x.id === pick.lessonId);
      if (l && what.isConnected) what.replaceChildren(ico(COURSE_ICON[pick.reason]), ' ', l.title);
    }).catch(() => {});
  }
  return h('section', { class: 'card today-card course-today' },
    h('p', { class: 'today-label' }, t('courseNext')),
    what,
    h('p', { class: 'muted small today-why' }, pickWhy(t, app.lang, pick, meta)),
    pick.reason === 'done' ? null : h('button', {
      class: 'btn btn-primary today-go',
      onclick: (e) => { const btn = e.currentTarget; btn.disabled = true; enableOnFail(btn, openPick(app, subject, pick)); },
    }, ico('play'), ' ', t('courseGo')));
}

// The meta line every module shares: difficulty (Instap / Verdieping /
// Specialist), mastery once it is more than "learn", and progress as a bar
// with its count.
export function moduleMeta(app, meta, count) {
  const t = app.t;
  const { done, total } = levelsDone(app.state, meta);
  const m = moduleMastery(app.state, meta, app.lang);
  return [
    h('span', { class: 'pill tier' }, t(`tier_${moduleTier(meta.level)}`)),
    m === 'learn' ? null : masteryBadge(t, m),
    metaSeal(t, app.state, meta),
    progressBar(total ? done / total : 0),
    h('span', { class: 'muted small module-count' }, count),
  ];
}

const topicTitle = (app, topic) => topic.title[app.lang] || topic.title.en;

// The module's title line and meta: one summary shared by the tappable row.
function modSummary(app, meta, tag, attrs, ...bits) {
  return h(tag, { class: 'module-row', ...attrs },
    h('span', { class: 'module-title' }, modTitle(app, meta),
      // In Dutch, the English name too: he needs both words at work.
      app.lang === 'nl' && meta.title.en && meta.title.en !== meta.title.nl ? h('span', { class: 'term-en module-en', lang: 'en' }, ` · ${meta.title.en}`) : null),
    h('span', { class: 'module-meta' }, ...bits));
}

const openLesson = (app, meta) => (lessonId) => app.go('lesson', { subject: meta.subject, moduleId: meta.id, lessonId, from: FROM_MODULE });

// A topic module's topics: one row per topic with its path of levels, from the
// index alone (no module load). A level shows once the one before it is passed
// (v16, topicRows); every stop shown opens its lesson. Shared by the module
// screen (v17), which is where a topic module lives now.
export function topicsSection(app, meta, model = pathModel(app.state, meta, app.lang)) {
  const t = app.t;
  const go = openLesson(app, meta);
  return h('section', { class: 'topics' }, model.topics.map((topic, i) => {
    const title = topicTitle(app, meta.topics[i]);
    return h('div', { class: 'topic-row' },
      h('div', { class: 'topic-head' },
        h('h3', { class: 'topic-title' }, title),
        h('span', { class: 'mono topic-count' }, t('topicCount', topic.passed))),
      topicPath(t, title, topic, go));
  }));
}

// The "continue" button to the module's next lesson, or null when none is left.
export function continueButton(app, meta, next, cls = 'btn btn-ghost small module-continue') {
  if (!next) return null;
  const t = app.t;
  const at = placeOf(next, [meta]);
  return h('button', { class: cls, onclick: () => openLesson(app, meta)(next) },
    ico('play'), ' ', at ? t('moduleContinueAt', placeLabel(t, app.lang, next, [meta])) : t('moduleContinue'));
}

// A topic module on the course home: a row with its title and progress that
// opens the module screen (v17); the topics and the intro live there.
function topicModuleRow(app, meta) {
  const { done, total } = levelsDone(app.state, meta);
  return h('div', { class: 'module topic-module' },
    modSummary(app, meta, 'button', {
      type: 'button',
      class: 'module-row module-link',
      onclick: () => app.go('module', { subject: meta.subject, moduleId: meta.id }),
    }, ...moduleMeta(app, meta, app.t('moduleLevels', done, total))));
}

// Under the last topic: the module's medal (an empty ring before bronze).
// The module check joins it once bronze is earned (v16 flair).
export function moduleEnd(app, meta) {
  const end = moduleEndModel(app.state, meta, app.today());
  return h('div', { class: 'path-end' }, medalSeal(app.t, end.tier, 24),
    checkEntry(app.t, end, () => app.go('check', { subject: meta.subject, moduleId: meta.id, from: FROM_MODULE })));
}

function moduleRow(app, meta) {
  if (topicsOf(meta)) return topicModuleRow(app, meta);
  const t = app.t;
  const lessons = ((app.state.courses || {})[meta.subject] || { lessons: {} }).lessons;
  const done = meta.lessons.filter((id) => lessons[id] && lessons[id].passed).length;
  const list = h('div', { class: 'lesson-list' });
  const fill = () => app.openModule(meta.subject, meta.id).then((mod) => {
    list.replaceChildren(...mod.lessons.map((l) => {
      const p = lessons[l.id] || {};
      return h('button', {
        class: `lesson-row${p.passed ? ' passed' : ''}`,
        onclick: () => app.go('lesson', { subject: meta.subject, moduleId: meta.id, lessonId: l.id }),
      }, ico(p.passed ? 'circle-check' : 'circle'), h('span', {}, l.title));
    }));
  }).catch(() => list.replaceChildren(h('p', { class: 'note' }, t('loadError'))));
  return h('details', { class: 'module', ontoggle: (e) => { if (e.currentTarget.open && !list.childElementCount) fill(); } },
    modSummary(app, meta, 'summary', {}, ...moduleMeta(app, meta, t('moduleLessons', done, meta.lessons.length))),
    h('p', { class: 'muted small module-blurb' }, meta.blurb[app.lang] || meta.blurb.en),
    list,
    nextLesson(app.state, meta) ? h('button', {
      class: 'btn btn-ghost small',
      onclick: () => app.go('lesson', { subject: meta.subject, moduleId: meta.id, lessonId: nextLesson(app.state, meta) }),
    }, ico('play'), ' ', t('moduleContinue')) : null);
}

// One track: a header with its progress; folds open. The track with the next
// step starts open, the others closed.
function trackSection(app, subject, track, open) {
  const t = app.t;
  const mods = MODULES.filter((m) => m.subject === subject && m.track === track);
  if (!mods.length) return null;
  const { done, total } = trackProgress(app.state, mods);
  return h('details', { class: `card track track-${track}`, open },
    h('summary', { class: 'track-head' },
      h('h2', { class: 'card-title' }, t(`track_${track}`)),
      h('span', { class: 'track-meta muted small' }, t('trackModules', mods.length), ' · ', t('trackDone', done, total)),
      progressBar(total ? done / total : 0)),
    mods.map((m) => moduleRow(app, m)));
}

export function courseHome(app, subject) {
  const t = app.t;
  const due = dueCount(app.state.courseReviews, app.today(), subject, app.lang);
  const pick = courseTodayPick(app.state, subject, app.lang, app.today());
  const first = openTrack(app.state, subject, pick);
  const tracks = TRACKS[subject].map((track) => trackSection(app, subject, track, track === first));
  return h('main', { class: `screen home course-home course-${subject}` },
    h('h1', { class: 'sr' }, t(`subject_${subject}`)),
    todayCard(app, subject, pick),
    goalLeftLine(app),
    // Begrippen and Mijn echte week: one compact row under the next step.
    h('div', { class: 'quick-row' },
      h('button', { class: 'btn btn-ghost small glossary-entry', onclick: () => app.go('glossary', { subject }) }, ico('library'), ' ', t('glossary')),
      realWeekEntry(app, true)),
    due ? h('button', { class: 'btn due-card', onclick: () => app.go('due', { subject }) },
      h('span', { class: 'hero-title' }, ico('repeat'), ' ', t('dueTitle')),
      h('span', { class: 'hero-sub' }, t('dueCard', due))) : null,
    ...tracks,
    tracks.some(Boolean) ? null : h('p', { class: 'note' }, t('courseEmpty')));
}

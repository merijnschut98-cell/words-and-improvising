// Course home: one next thing, the due questions, and the module map.
import { h, enableOnFail } from './dom.js';
import { ico } from './icons.js';
import { masteryBadge, realWeekEntry, progressBar } from './home.js';
import { MODULES, TRACKS, topicsOf, placeOf } from '../content/courses/index.js';
import { courseTodayPick, moduleMastery, nextLesson, topicRows, levelsDone } from '../core/course.js';
import { dueCount } from '../core/coursereview.js';
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

// One level chip of a topic: state as an icon (not colour alone), the level
// name, and a spoken label. The suggested chip is marked, never filled.
const CHIP_ICON = { todo: null, passed: 'circle-check', owned: 'check-check' };
export function chipModel(t, topicTitle, lv, isNext) {
  const label = t(`level_${lv.level}`);
  const aria = t('chipLabel', topicTitle, label, t(`chipState_${lv.state}`));
  return { cls: `level-chip s-${lv.state}${isNext ? ' next' : ''}`, label, aria: isNext ? `${aria} (${t('chipNext')})` : aria, icon: CHIP_ICON[lv.state] || null };
}

// The meta line every module shares: difficulty (Instap / Verdieping /
// Specialist), mastery once it is more than "learn", and progress as a bar
// with its count.
function moduleMeta(app, meta, count) {
  const t = app.t;
  const { done, total } = levelsDone(app.state, meta);
  const m = moduleMastery(app.state, meta, app.lang);
  return [
    h('span', { class: 'pill tier' }, t(`tier_${moduleTier(meta.level)}`)),
    m === 'learn' ? null : masteryBadge(t, m),
    progressBar(total ? done / total : 0),
    h('span', { class: 'muted small module-count' }, count),
  ];
}

const topicTitle = (app, topic) => topic.title[app.lang] || topic.title.en;

function modSummary(app, meta, ...bits) {
  return h('summary', { class: 'module-row' },
    h('span', { class: 'module-title' }, modTitle(app, meta),
      // In Dutch, the English name too: he needs both words at work.
      app.lang === 'nl' && meta.title.en && meta.title.en !== meta.title.nl ? h('span', { class: 'term-en module-en', lang: 'en' }, ` · ${meta.title.en}`) : null),
    h('span', { class: 'module-meta' }, ...bits));
}

// A topic module: one row per topic with its level chips, from the index
// alone (no module load). A level shows once the one before it is passed
// (v16); every chip shown opens its lesson.
function topicModuleRow(app, meta) {
  const t = app.t;
  const go = (lessonId) => app.go('lesson', { subject: meta.subject, moduleId: meta.id, lessonId });
  const next = nextLesson(app.state, meta);
  const at = next ? placeOf(next, [meta]) : null;
  const { done, total } = levelsDone(app.state, meta);
  const rows = topicRows(app.state, meta, app.lang).map((row, i) => {
    const title = topicTitle(app, meta.topics[i]);
    return h('div', { class: 'topic-row' },
      h('div', { class: 'topic-head' },
        h('h3', { class: 'topic-title' }, title),
        h('span', { class: 'mono topic-count' }, t('topicCount', row.passed))),
      h('div', { class: 'level-chips' }, row.levels.map((lv) => {
        const isNext = lv.lessonId === next;
        const m = chipModel(t, title, lv, isNext);
        return h('button', { class: m.cls, 'aria-label': m.aria, onclick: () => go(lv.lessonId) },
          m.icon ? ico(m.icon) : null,
          h('span', { class: 'chip-label' }, m.label),
          isNext ? h('span', { class: 'chip-next' }, t('chipNext')) : null);
      })));
  });
  return h('details', { class: 'module topic-module' },
    modSummary(app, meta, ...moduleMeta(app, meta, t('moduleLevels', done, total))),
    h('p', { class: 'muted small module-blurb' }, meta.blurb[app.lang] || meta.blurb.en),
    h('section', { class: 'topics' }, rows),
    next ? h('button', { class: 'btn btn-ghost small module-continue', onclick: () => go(next) },
      ico('play'), ' ', at ? t('moduleContinueAt', placeLabel(t, app.lang, next, [meta])) : t('moduleContinue')) : null);
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
    modSummary(app, meta, ...moduleMeta(app, meta, t('moduleLessons', done, meta.lessons.length))),
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

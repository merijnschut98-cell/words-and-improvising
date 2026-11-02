// Course home: one next thing, the due questions, and the module map.
import { h } from './dom.js';
import { ico } from './icons.js';
import { masteryBadge } from './home.js';
import { MODULES, TRACKS } from '../content/courses/index.js';
import { courseTodayPick, moduleMastery, nextLesson } from '../core/course.js';
import { dueCourseQuestions } from '../core/coursereview.js';

export const COURSE_ICON = { apply: 'pen-line', due: 'repeat', lesson: 'book-open', situation: 'drama', sayIt: 'mic', maintain: 'wrench', done: 'circle-check' };

function modTitle(app, meta) { return meta.title[app.lang] || meta.title.en; }

// Opens what the Today card or a lesson row points at.
export function openPick(app, subject, pick) {
  if (pick.reason === 'apply') return app.go('apply', { subject, planId: pick.planId });
  if (pick.reason === 'due') return app.go('due', { subject });
  if (pick.reason === 'maintain') return app.go('due', { subject, questionIds: [pick.questionId], maintenance: true });
  if (pick.reason === 'lesson') return app.go('lesson', { subject, moduleId: pick.moduleId, lessonId: pick.lessonId });
  if (pick.reason === 'situation') return app.go('situation', { subject, moduleId: pick.moduleId, lessonId: pick.lessonId });
  if (pick.reason === 'sayIt') return app.startSayIt(subject, pick.moduleId, pick.lessonId);
  return null;
}

function todayCard(app, subject) {
  const t = app.t;
  const pick = courseTodayPick(app.state, subject, app.lang, app.today());
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
    h('p', { class: 'muted small' }, meta && pick.lessonId
      ? `${t(`courseWhy_${pick.reason}`)} · ${modTitle(app, meta)}`
      : t(`courseWhy_${pick.reason}`)),
    pick.reason === 'done' ? null : h('button', {
      class: 'btn btn-primary today-go',
      onclick: (e) => { e.currentTarget.disabled = true; openPick(app, subject, pick); },
    }, ico('play'), ' ', t('courseGo')));
}

function moduleRow(app, meta) {
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
    h('summary', { class: 'module-row' },
      h('span', { class: 'module-title' }, modTitle(app, meta)),
      h('span', { class: 'module-meta' },
        h('span', { class: 'pill' }, t(`level_${meta.level}`)),
        masteryBadge(t, moduleMastery(app.state, meta, app.lang)),
        h('span', { class: 'muted small' }, t('moduleLessons', done, meta.lessons.length)))),
    h('p', { class: 'muted small module-blurb' }, meta.blurb[app.lang] || meta.blurb.en),
    list,
    nextLesson(app.state, meta) ? h('button', {
      class: 'btn btn-ghost small',
      onclick: () => app.go('lesson', { subject: meta.subject, moduleId: meta.id, lessonId: nextLesson(app.state, meta) }),
    }, ico('play'), ' ', t('moduleContinue')) : null);
}

export function courseHome(app, subject) {
  const t = app.t;
  const due = dueCourseQuestions(app.state.courseReviews, app.today(), subject, app.lang).length;
  const tracks = TRACKS[subject].map((track) => {
    const mods = MODULES.filter((m) => m.subject === subject && m.track === track);
    return mods.length ? h('section', { class: 'card track' },
      h('h2', { class: 'card-title' }, t(`track_${track}`)),
      mods.map((m) => moduleRow(app, m))) : null;
  });
  return h('main', { class: `screen home course-home course-${subject}` },
    h('h1', { class: 'sr' }, t(`subject_${subject}`)),
    todayCard(app, subject),
    due ? h('button', { class: 'btn due-card', onclick: () => app.go('due', { subject }) },
      h('span', { class: 'hero-title' }, ico('repeat'), ' ', t('dueTitle')),
      h('span', { class: 'hero-sub' }, t('dueCard', due))) : null,
    ...tracks,
    tracks.some(Boolean) ? null : h('p', { class: 'note' }, t('courseEmpty')),
    h('button', { class: 'btn btn-ghost', onclick: () => app.go('glossary', { subject }) }, ico('library'), ' ', t('glossary')));
}

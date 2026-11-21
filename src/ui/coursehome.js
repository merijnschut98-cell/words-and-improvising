// Course home: one next thing, the due questions, and the module map.
import { h, enableOnFail } from './dom.js';
import { ico } from './icons.js';
import { masteryBadge, realWeekEntry, progressBar } from './home.js';
import { MODULES, TRACKS, FIELDS, topicsOf, placeOf, moduleOf } from '../content/courses/index.js';
import { mapFor } from '../content/courses/maps/index.js';
import { subjectMap } from './subjectmap.js';
import { guideOn } from './guide.js';
import { filmButton } from './film.js';
import { courseTodayPick, moduleMastery, nextLesson, levelsDone, dueNow, dueWaiting, dueSkipped, skipDueToday } from '../core/course.js';
import { pathModel, topicPath } from './pathmap.js';
import { medalSeal, metaSeal, moduleEndModel, checkEntry, guideGreeting } from './flairui.js';
import { mapNextModule } from '../core/coursereview.js';
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
    // All done: Andon above already says the done sentence; with him off, the card says it.
    pick.reason === 'done' && guideOn(app.state) ? null : h('p', { class: 'muted small today-why' }, pickWhy(t, app.lang, pick, meta)),
    pick.reason === 'done' ? null : h('button', {
      class: 'btn btn-primary today-go',
      onclick: (e) => { const btn = e.currentTarget; btn.disabled = true; enableOnFail(btn, openPick(app, subject, pick)); },
    }, ico('play'), ' ', t('courseGo')),
    // Too many reviews today: skip them, no penalty; the lesson becomes the next step (v18 F3).
    pick.reason === 'due' ? h('button', {
      class: 'btn btn-ghost small today-skip',
      onclick: () => { app.setState(skipDueToday(app.state, subject, app.today())); app.go('home'); },
    }, t('dueSkipToday')) : null);
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
export function modSummary(app, meta, tag, attrs, ...bits) {
  // In Dutch, the English name sits small under the title (he needs both words
  // at work); aria-hidden so a screen reader says the Dutch title once.
  const en = app.lang === 'nl' && meta.title.en && meta.title.en !== meta.title.nl ? meta.title.en : null;
  return h(tag, { class: 'module-row', ...attrs },
    h('span', { class: 'module-title' }, modTitle(app, meta)),
    en ? h('span', { class: 'term-en module-en-line', lang: 'en', 'aria-hidden': 'true' }, en) : null,
    h('span', { class: 'module-meta' }, ...bits));
}

const openLesson = (app, meta) => (lessonId) => app.go('lesson', { subject: meta.subject, moduleId: meta.id, lessonId, from: FROM_MODULE });

// A topic module's topics: one row per topic with its path of levels, from the
// index alone (no module load). A level shows once the one before it is passed
// (v16, topicRows); every stop shown opens its lesson. Shared by the module
// screen (v17), which is where a topic module lives now.
export function topicsSection(app, meta, model = pathModel(app.state, meta, app.lang), onInfo = null) {
  const t = app.t;
  const go = openLesson(app, meta);
  return h('section', { class: 'topics' }, model.topics.map((topic, i) => {
    const title = topicTitle(app, meta.topics[i]);
    return h('div', { class: 'topic-row' },
      h('div', { class: 'topic-head' },
        h('h3', { class: 'topic-title' }, title),
        h('span', { class: 'mono topic-count' }, t('topicCount', topic.passed))),
      topicPath(t, title, topic, go, onInfo ? (level, btn) => onInfo(topic, level, btn) : null),
      onInfo ? h('div', { class: 'opener-slot', 'data-topic': topic.id }) : null);
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

// 15 Nov (Merijn): under a map the list groups the modules by the map's zones (the fields), in the map's order and
// with its names, not by the old tracks. null without a map: the tracks stay.
export function zoneGroups(subject, map, fields = FIELDS, modules = MODULES) {
  if (!map) return null;
  return map.zones.map((z) => {
    const field = fields.find((f) => f.id === z.field);
    return { field, label: z.label, modules: field.modules.map((id) => modules.find((m) => m.id === id)) };
  });
}

// One zone of the map: the same fold as a track, titled with the zone's name.
function zoneSection(app, group, open) {
  const t = app.t;
  const { done, total } = trackProgress(app.state, group.modules);
  const slug = group.field.id.split('.').pop();
  return h('details', { class: `card track track-zone zone-${slug}`, open },
    h('summary', { class: 'track-head' },
      h('h2', { class: 'card-title' }, group.label[app.lang] || group.label.en),
      h('span', { class: 'track-meta muted small' }, t('trackModules', group.modules.length), ' · ', t('trackDone', done, total)),
      progressBar(total ? done / total : 0)),
    group.modules.map((m) => moduleRow(app, m)));
}

// The blocks of a subject home, top to bottom. A subject with a map shows it
// first (v17), then the next step, and a row of field films before the tracks.
// The XP left for the daily goal is Andon's line in the greeting above these.
export const homeOrder = (subject, hasMap) => (hasMap
  ? ['map', 'next', 'quick', 'due', 'fields', 'tracks']
  : ['next', 'quick', 'due', 'tracks']);

// The subject's fields that have a film of their own, in the order of FIELDS.
export const fieldFilms = (subject, fields = FIELDS) => fields.filter((f) => f.subject === subject && f.film);

// The drawn map in a card; every place opens its module screen. The place of
// "Your next step" is marked. The map shows no progress.
function mapCard(app, subject, map, pick) {
  const t = app.t;
  return h('section', { class: 'card map-card' },
    h('h2', { class: 'card-title' }, t('mapHeading')),
    h('p', { class: 'muted small map-hint' }, t('mapHint')),
    subjectMap(app, map, {
      lang: app.lang,
      next: mapNextModule(pick, app.state.courseReviews, app.today(), subject, app.lang, moduleOf),
      onPlace: (moduleId) => app.go('module', { subject, moduleId }),
    }));
}

// One compact entry per field film: the field's title, then the film button.
// It opens the rendered video in place, as the module intro does; the HTML film
// only when there is no video, the field's blurb when neither loads.
function fieldsRow(app, subject) {
  const films = fieldFilms(subject);
  if (!films.length) return null;
  return h('section', { class: 'field-films' }, films.map((f) => h('div', { class: 'field-film' },
    h('span', { class: 'field-film-title' }, f.title[app.lang] || f.title.en),
    filmButton(app, f.film, null, { video: true, text: () => h('p', { class: 'muted small' }, f.blurb[app.lang] || f.blurb.en) }))));
}

// The due card (v18 F3): skipped today it turns quiet with a way back in; with the
// daily limit it says how many wait for tomorrow; at the limit it is a quiet line.
function dueCard(app, subject, { due, waiting, skipped }) {
  const t = app.t;
  if (skipped && waiting) {
    return h('section', { class: 'card due-quiet' },
      h('p', { class: 'muted small due-quiet-note' }, ico('repeat'), ' ', t('dueSkippedNote', waiting)),
      due ? h('button', { class: 'btn btn-ghost small due-redo', onclick: () => app.go('due', { subject }) }, t('dueSkippedDo')) : null);
  }
  if (!due) return waiting ? h('section', { class: 'card due-quiet' }, h('p', { class: 'muted small due-quiet-note' }, ico('repeat'), ' ', t('dueLimitHit', waiting))) : null;
  return h('div', { class: 'due-wrap' },
    h('button', { class: 'btn due-card', onclick: () => app.go('due', { subject }) },
      h('span', { class: 'hero-title' }, ico('repeat'), ' ', t('dueTitle')),
      h('span', { class: 'hero-sub' }, t('dueCard', due))),
    waiting > due ? h('p', { class: 'muted small due-more' }, t('dueMoreWait', waiting - due)) : null,
    h('button', { class: 'btn btn-ghost small due-skip', onclick: () => { app.setState(skipDueToday(app.state, subject, app.today())); app.go('home'); } }, t('dueSkipToday')));
}

export function courseHome(app, subject) {
  const t = app.t;
  const map = mapFor(subject);
  const due = dueNow(app.state, subject, app.lang, app.today());
  const waiting = dueWaiting(app.state, subject, app.lang, app.today());
  const skipped = dueSkipped(app.state, subject, app.today());
  const pick = courseTodayPick(app.state, subject, app.lang, app.today());
  // With a map the tracks stay closed: the map is the way in.
  const first = map ? null : openTrack(app.state, subject, pick);
  const zones = zoneGroups(subject, map);
  const tracks = zones ? zones.map((g) => zoneSection(app, g, false)) : TRACKS[subject].map((track) => trackSection(app, subject, track, track === first));
  const blocks = {
    map: () => mapCard(app, subject, map, pick),
    next: () => todayCard(app, subject, pick),
    // Begrippen and Mijn echte week: one compact row under the next step.
    quick: () => h('div', { class: 'quick-row' },
      h('button', { class: 'btn btn-ghost small glossary-entry', onclick: () => app.go('glossary', { subject }) }, ico('library'), ' ', t('glossary')),
      realWeekEntry(app, true)),
    due: () => dueCard(app, subject, { due, waiting, skipped }),
    fields: () => fieldsRow(app, subject),
    tracks: () => [...tracks, tracks.some(Boolean) ? null : h('p', { class: 'note' }, t('courseEmpty'))],
  };
  return h('main', { class: `screen home course-home course-${subject}` },
    h('h1', { class: 'sr' }, t(`subject_${subject}`)),
    guideGreeting(app, { subject, goal: true, pick: { subject, ...pick } }),
    ...homeOrder(subject, Boolean(map)).flatMap((k) => blocks[k]()));
}

// The module screen (v17): the home of one module. The big picture first (the
// intro film, or the blurb when there is none), then the topics with their
// level paths, the medal and module check, and one button that continues.
import { h } from './dom.js';
import { ico } from './icons.js';
import { metaOf, fieldOf } from '../content/courses/index.js';
import { introSeen, markIntroSeen } from '../core/course.js';
import { pathModel } from './pathmap.js';
import { filmStep, introFilm } from './film.js';
import { topicsSection, moduleEnd, continueButton } from './coursehome.js';

// The module of an id, or null (a deep link or a restored session may point at
// one that no longer exists).
export const moduleFor = (moduleId) => metaOf(moduleId) || null;

// What the screen shows, from the state and the index alone. Pure.
export function moduleModel(state, meta, lang) {
  const l = lang === 'en' ? 'en' : 'nl';
  const path = pathModel(state, meta, l);
  const en = meta.title.en;
  return {
    title: meta.title[l] || meta.title.en,
    // In Dutch, the English name too: he needs both words at work.
    titleEn: l === 'nl' && en && en !== meta.title.nl ? en : null,
    blurb: meta.blurb[l] || meta.blurb.en,
    field: fieldOf(meta.id),
    hasIntro: !!introFilm(meta),
    introSeen: introSeen(state, meta.id),
    topics: path.topics,
    next: path.next,
  };
}

export function renderModule(app, { subject, moduleId } = {}, root) {
  const meta = moduleFor(moduleId);
  if (!meta) { app.go('home'); return; }
  const t = app.t;
  const model = moduleModel(app.state, meta, app.lang);
  const blurb = () => h('p', { class: 'module-blurb-text' }, model.blurb);

  const intro = model.hasIntro
    ? h('section', { class: 'module-intro' },
      h('h2', { class: 'topic-title module-intro-title' }, t('moduleIntro')),
      filmStep(app, { film: meta.intro }, null, {
        text: blurb,
        onSeen: () => app.setState(markIntroSeen(app.state, meta.id)),
      }))
    : h('section', { class: 'module-intro module-intro-text' }, blurb());

  root.append(h('main', { class: 'screen module-screen' },
    h('button', { class: 'btn btn-ghost small lesson-back', onclick: () => app.setSubject(subject || meta.subject) },
      ico('chevron-left'), ' ', t('backToCourse')),
    h('header', { class: 'module-head' },
      h('h1', { class: 'module-screen-title' }, model.title),
      model.titleEn ? h('p', { class: 'term-en module-en-line', lang: 'en' }, model.titleEn) : null,
      model.field ? h('p', { class: 'module-field muted small' }, model.field.title[app.lang] || model.field.title.en) : null),
    // v17 Task 8: Andon presents the intro here, beside the film, with one line.
    intro,
    topicsSection(app, meta, { next: model.next, topics: model.topics }),
    moduleEnd(app, meta),
    continueButton(app, meta, model.next, 'btn btn-primary module-continue')));
}

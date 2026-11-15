// The module screen (v17): the home of one module. The big picture first (the
// intro film, or the blurb when there is none), then the topics with their
// level paths, the medal and module check, and one button that continues.
import { h } from './dom.js';
import { ico } from './icons.js';
import { metaOf, fieldOf, SUBJECTS } from '../content/courses/index.js';
import { introSeen, markIntroSeen, openerText } from '../core/course.js';
import { loadOpeners } from '../content/courses/index.js';
import { openerInline } from './opener.js';
import { pathModel } from './pathmap.js';
import { filmStep, introFilm, closeFilms } from './film.js';
import { guideIntro, guideIntroSeen } from './flairui.js';
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
  // A module that no longer exists: the course home of the subject he came
  // from, or home when that is unknown too.
  if (!meta) { if (SUBJECTS.includes(subject)) app.setSubject(subject); else app.go('home'); return; }
  const t = app.t;
  const model = moduleModel(app.state, meta, app.lang);
  const blurb = () => h('p', { class: 'module-blurb-text' }, model.blurb);

  // Andon stands beside the heading with one line; the video's end lights his
  // top segment in place. With the guide off the heading stands alone.
  const heading = h('h2', { class: 'topic-title module-intro-title' }, t('moduleIntro'));
  const andon = model.hasIntro ? guideIntro(app, meta, heading) : null;
  const intro = model.hasIntro
    ? h('section', { class: 'module-intro' },
      andon || heading,
      filmStep(app, { film: meta.intro }, null, {
        text: blurb,
        onSeen: () => { app.setState(markIntroSeen(app.state, meta.id)); guideIntroSeen(andon); },
      }))
    : h('section', { class: 'module-intro module-intro-text' }, blurb());

  // The info button on a level of the path reads that level's opener again,
  // inline under the topic's path. It never changes what is seen. A second tap
  // on the same button (or Close) puts it away and the focus back on the button.
  const topicsEl = topicsSection(app, meta, { next: model.next, topics: model.topics }, (topic, level, btn) => {
    const slot = topicsEl.querySelector(`.opener-slot[data-topic="${topic.id}"]`);
    if (!slot) return;
    // Only this topic's buttons: another topic's card may stay open.
    const close = () => {
      slot.replaceChildren();
      slot.parentNode.querySelectorAll('.path-info').forEach((b) => b.setAttribute('aria-expanded', 'false'));
      if (typeof btn.focus === 'function') btn.focus();
    };
    if (btn.getAttribute('aria-expanded') === 'true') { close(); return; }
    loadOpeners(meta.subject).then((openers) => {
      const text = openerText(openers, `${meta.id}/${topic.id}`, level, app.lang);
      if (!text) return;
      const card = openerInline(t, { level, text, onClose: close });
      slot.replaceChildren(card.el);
      slot.parentNode.querySelectorAll('.path-info').forEach((b) => b.setAttribute('aria-expanded', b === btn ? 'true' : 'false'));
      if (typeof card.title.focus === 'function') card.title.focus({ preventScroll: true });
    }, () => {});
  });
  root.append(h('main', { class: 'screen module-screen' },
    h('button', { class: 'btn btn-ghost small lesson-back', onclick: () => app.setSubject(meta.subject) },
      ico('chevron-left'), ' ', t('backToCourse')),
    h('header', { class: 'module-head' },
      h('h1', { class: 'module-screen-title' }, model.title),
      model.titleEn ? h('p', { class: 'term-en module-en-line', lang: 'en' }, model.titleEn) : null,
      model.field ? h('p', { class: 'module-field muted small' }, model.field.title[app.lang] || model.field.title.en) : null),
    intro,
    topicsEl,
    moduleEnd(app, meta),
    continueButton(app, meta, model.next, 'btn btn-primary module-continue')));
  // Leaving the screen closes an open film, as in a lesson.
  return () => closeFilms();
}

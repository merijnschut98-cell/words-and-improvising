// The tour page ("What's inside"): for a visitor, or anyone who wants the whole
// picture. The purpose in one line, the three subjects with live counts, a
// preview of each map, one featured film and a way into a module of each
// subject. Nothing here starts a round, so nothing asks for the microphone.
import { h } from './dom.js';
import { ico } from './icons.js';
import { brandLockup, navBar } from './home.js';
import { SUBJECT_TABS } from './subjectbar.js';
import { mapFor } from '../content/courses/maps/index.js';
import { metaOf, FIELDS } from '../content/courses/index.js';
import { mapSvg, PHONE_BELOW } from './subjectmap.js';
import { filmStep, loadManifest } from './film.js';
import { tourModel, FEATURED_FILM } from '../core/tour.js';

const SUBJECT_ICON = Object.fromEntries(SUBJECT_TABS);

// The counts of a subject as one quiet line; a film count that is still unknown is left out.
export function countLine(t, s) {
  const bits = s.id === 'speak'
    ? [t('tourDrills', s.drills)]
    : [t('tourModules', s.modules), t('tourLessons', s.lessons), s.films ? t('tourFilms', s.films) : null];
  return bits.filter(Boolean).join(' · ');
}

// A read-only crop of the map's top: the look of the subject, not all of it. The
// phone drawing on a narrow screen, as in the subject home. Hidden from screen
// readers (the buttons below name the same thing); a tap opens the subject.
function mapPreview(app, subject, open) {
  const map = mapFor(subject);
  if (!map) return null;
  const narrow = typeof window !== 'undefined' && window.innerWidth < PHONE_BELOW + 60;
  const box = h('div', { class: 'tour-map', 'aria-hidden': 'true', onclick: open });
  box.innerHTML = mapSvg(map, { lang: app.lang, layout: narrow ? 'phone' : null });
  return box;
}

function subjectCard(app, s, open) {
  const t = app.t;
  const name = t(`subject_${s.id}`);
  const meta = s.firstModule ? metaOf(s.firstModule) : null;
  const counts = h('p', { class: 'tour-counts', 'data-subject': s.id }, countLine(t, s));
  return {
    counts,
    el: h('section', { class: `card tour-card tour-${s.id}`, 'aria-labelledby': `tour-h-${s.id}` },
      h('h2', { class: 'tour-subject', id: `tour-h-${s.id}` }, ico(SUBJECT_ICON[s.id]), ' ', name),
      h('p', { class: 'tour-line' }, t(`welcomeSubject_${s.id}`)),
      counts,
      s.id === 'speak' ? h('p', { class: 'muted small' }, t('tourSpeakNote')) : null,
      mapPreview(app, s.id, open),
      h('div', { class: 'tour-actions' },
        h('button', { class: 'btn btn-primary', onclick: open }, t('tourOpen', name), ' ', ico('chevron-right')),
        meta ? h('button', {
          class: 'btn btn-ghost',
          onclick: () => app.go('module', { subject: s.id, moduleId: meta.id }),
        }, ico('book-open'), ' ', t('tourTry', meta.title[app.lang] || meta.title.en)) : null)),
  };
}

export function renderTour(app, _params, root) {
  const t = app.t;
  const model = tourModel(null);
  const cards = model.map((s) => subjectCard(app, s, () => app.setSubject(s.id)));
  const field = FIELDS.find((f) => f.id === FEATURED_FILM);
  const titleId = 'tour-featured-title';

  root.append(
    h('header', { class: 'top' },
      h('button', { class: 'back-btn', onclick: () => app.setSubject('start') }, ico('chevron-left'), h('span', {}, t('overview'))),
      brandLockup()),
    h('main', { class: 'screen tour' },
      h('h1', { class: 'tour-title' }, t('tourTitle')),
      h('p', { class: 'tour-intro' }, t('tourIntro')),
      ...cards.map((c) => c.el),
      h('section', { class: 'card tour-card tour-film', 'aria-labelledby': titleId },
        h('p', { class: 'today-label' }, t('tourFeatured')),
        h('h2', { class: 'tour-subject', id: titleId }, field ? field.title[app.lang] || field.title.en : ''),
        filmStep(app, { film: FEATURED_FILM }, null, {
          text: () => h('p', { class: 'muted small' }, field ? field.blurb[app.lang] || field.blurb.en : ''),
        }),
        h('p', { class: 'muted small tour-caption' }, t('tourFeaturedCaption')))),
    navBar(app, 'home'));

  // The film counts come from the manifest of rendered films; until it loads the
  // line shows the rest, and it never shows a wrong number.
  loadManifest().then((manifest) => {
    if (!manifest || !root.isConnected) return;
    tourModel(manifest).forEach((s, i) => { cards[i].counts.textContent = countLine(t, s); });
  });
}

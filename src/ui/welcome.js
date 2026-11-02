import { h } from './dom.js';
import { ico } from './icons.js';
import { finishWelcome } from '../core/storage.js';
import { brandLockup } from './home.js';
import { SUBJECT_TABS } from './subjectbar.js';

// First run: three short screens (the three subjects, how a day works, where
// Settings and the key live). Skippable from every screen.
export function renderWelcome(app, _params, root) {
  let i = 0;
  const main = h('main', { class: 'screen welcome' });
  root.append(main);

  const done = () => {
    app.setState(finishWelcome(app.state));
    app.go('home');
  };

  function show() {
    const t = app.t;
    const subjects = () => h('ul', { class: 'welcome-list' }, SUBJECT_TABS.map(([id, icon]) => h('li', {},
      h('span', { class: 'welcome-list-icon' }, ico(icon)),
      h('span', {}, h('b', {}, t(`subject_${id}`)), h('span', { class: 'muted' }, ` ${t(`welcomeSubject_${id}`)}`)))));
    const slides = [
      { icon: null, title: t('welcome1Title'), body: t('welcome1Body'), extra: subjects },
      { icon: 'play', title: t('welcome2Title'), body: t('welcome2Body') },
      { icon: 'settings', title: t('welcome3Title'), body: t('welcome3Body') },
    ];
    const s = slides[i];
    const last = i === slides.length - 1;
    main.replaceChildren(
      h('div', { class: 'welcome-top' },
        i === 0
          ? h('div', { class: 'segmented small-seg' },
            [['nl', 'NL'], ['en', 'EN']].map(([v, label]) => h('button', {
              class: app.lang === v ? 'on' : '',
              'aria-pressed': String(app.lang === v),
              onclick: () => { app.updateSettings({ lang: v }); show(); },
            }, label)))
          : h('span', {}),
        h('button', { class: 'btn btn-ghost small welcome-skip', onclick: done }, t('skip'))),
      h('section', { class: 'welcome-slide' },
        // The first slide shows the Vantage mark; the others a quiet icon.
        s.icon ? h('div', { class: 'welcome-icon' }, ico(s.icon)) : brandLockup(),
        h('p', { class: 'today-label welcome-count' }, t('welcomeCount', i + 1, slides.length)),
        h('h1', {}, s.title),
        h('p', {}, s.body),
        s.extra ? s.extra() : null),
      h('div', { class: 'welcome-dots', 'aria-hidden': 'true' }, slides.map((_, k) => h('i', { class: k === i ? 'on' : '' }))),
      h('button', {
        class: 'btn btn-primary btn-big',
        onclick: () => { if (last) done(); else { i += 1; show(); } },
      }, last ? t('welcomeStart') : t('next')),
    );
  }
  show();
}

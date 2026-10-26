import { h } from './dom.js';

// First-run explainer: three short slides, skippable.
export function renderWelcome(app, _params, root) {
  let i = 0;
  const main = h('main', { class: 'screen welcome' });
  root.append(main);

  const done = () => {
    app.setState({ ...app.state, onboarded: true });
    app.go('home');
  };

  function show() {
    const t = app.t;
    const slides = [
      { icon: '💬', title: t('welcome1Title'), body: t('welcome1Body') },
      { icon: '🎙', title: t('welcome2Title'), body: t('welcome2Body') },
      { icon: '📲', title: t('welcome3Title'), body: t('welcome3Body') },
    ];
    const s = slides[i];
    const last = i === slides.length - 1;
    main.replaceChildren(
      h('div', { class: 'welcome-top' },
        i === 0
          ? h('div', { class: 'segmented small-seg' },
            [['nl', '🇳🇱 NL'], ['en', '🇬🇧 EN']].map(([v, label]) => h('button', {
              class: app.lang === v ? 'on' : '',
              onclick: () => { app.updateSettings({ lang: v }); show(); },
            }, label)))
          : h('span', {}),
        h('button', { class: 'icon-btn small', onclick: done }, t('skip'))),
      h('section', { class: 'welcome-slide' },
        h('div', { class: 'welcome-icon', 'aria-hidden': 'true' }, s.icon),
        h('h1', {}, s.title),
        h('p', {}, s.body)),
      h('div', { class: 'welcome-dots', 'aria-hidden': 'true' }, slides.map((_, k) => h('i', { class: k === i ? 'on' : '' }))),
      h('button', {
        class: 'btn btn-primary btn-big',
        onclick: () => { if (last) done(); else { i += 1; show(); } },
      }, last ? t('welcomeStart') : t('next')),
    );
  }
  show();
}

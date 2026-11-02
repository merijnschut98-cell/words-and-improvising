// Every term of a course, searchable, grouped by module.
import { h } from './dom.js';
import { ico } from './icons.js';
import { glossary } from '../core/course.js';
import { MODULES } from '../content/courses/index.js';

export function renderGlossary(app, { subject }, root) {
  const t = app.t;
  const seq = app.navSeq;
  const list = h('div', { class: 'glossary-list' }, h('p', { class: 'muted loading' }, '…'));
  const search = h('input', { type: 'search', class: 'text-input', placeholder: t('glossarySearch'), 'aria-label': t('glossarySearch') });
  root.append(
    h('header', { class: 'top round-top' },
      h('button', { class: 'icon-btn', 'aria-label': t('close'), onclick: () => app.go('home') }, ico('x')),
      h('div', { class: 'round-title' }, ico('library'), ' ', t('glossary')), h('div', {})),
    h('main', { class: 'screen glossary' }, search, list));

  const metas = MODULES.filter((m) => m.subject === subject);
  Promise.all(metas.map((m) => app.openModule(subject, m.id).then((mod) => ({ id: m.id, lessons: mod.lessons }), () => null)))
    .then((loaded) => {
      if (seq !== app.navSeq) return;
      const terms = glossary(loaded.filter(Boolean));
      const missing = loaded.filter((x) => !x).length;
      const titleOf = (id) => { const m = metas.find((x) => x.id === id); return m ? (m.title[app.lang] || m.title.en) : id; };
      const draw = () => {
        const q = search.value.trim().toLowerCase();
        const hits = terms.filter((x) => !q || x.term.toLowerCase().includes(q) || x.def.toLowerCase().includes(q));
        const groups = metas.map((m) => [m.id, hits.filter((x) => x.moduleId === m.id)]).filter(([, l]) => l.length);
        list.replaceChildren(...[
          ...groups.map(([id, l]) => h('section', { class: 'card glossary-group' },
            h('h2', { class: 'card-title' }, titleOf(id)),
            l.map((x) => h('div', { class: 'term' }, h('b', {}, x.term), h('p', { class: 'muted small' }, x.def))))),
          groups.length ? null : h('p', { class: 'note' }, t('glossaryNone')),
          missing ? h('p', { class: 'note' }, t('glossaryMissing')) : null,
        ].filter(Boolean));
      };
      search.addEventListener('input', draw);
      draw();
    });
}

import { h } from './dom.js';
import { EVENT_TYPES, addEvent, upcoming, needsReflection, reflect, rehearsalPrompts, setShare, runHardQuestion } from '../core/realweek.js';

export const EVENT_ICON = { client: '🤝', presentation: '📊', teamtalk: '🏟️', networking: '🥂', other: '📌' };

// Short local date, e.g. "do 29 okt".
export function fmtDay(app, day) {
  const [y, m, d] = day.split('-').map(Number);
  return new Intl.DateTimeFormat(app.lang === 'nl' ? 'nl-NL' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(y, m - 1, d));
}

export async function startRehearsal(app, shown) {
  // Use the saved event, not the copy captured when the screen was drawn
  // (the share switch may have changed since).
  const event = (app.state.events || []).find((x) => x.id === shown.id) || shown;
  const prompts = rehearsalPrompts(event, app.lang);
  const { apiKey, model } = app.state.settings;
  // Opt-in: the coach writes the hard question; the local one stays on any error.
  if (apiKey && event.shareWithCoach) {
    const seq = app.navSeq;
    app.toast(`✍️ ${app.t('rwCoachWriting')}`);
    const res = await Promise.race([
      runHardQuestion(apiKey, { event, lang: app.lang, model }),
      new Promise((r) => { setTimeout(() => r({ ok: false, error: 'timeout' }), 8000); }),
    ]);
    if (app.navSeq !== seq) return; // he navigated away meanwhile
    if (res.ok) prompts[1] = { ...prompts[1], body: res.question };
  }
  app.session = { prompts, index: 0, xp: 0, levelUp: false };
  app.go('round', { prompt: prompts[0], modifier: null });
}

function reflectCard(app, e) {
  const t = app.t;
  let rating = null;
  const btns = [1, 2, 3, 4, 5].map((n) => h('button', {
    class: 'rate-btn',
    onclick: () => { rating = n; btns.forEach((b, i) => b.classList.toggle('on', i + 1 === n)); save.disabled = false; },
  }, h('b', {}, n)));
  const note = h('input', { type: 'text', maxlength: 160, placeholder: t('rwNextPh'), class: 'text-input' });
  const save = h('button', {
    class: 'btn btn-primary', disabled: true,
    onclick: () => {
      app.setState({ ...app.state, events: reflect(app.state.events, e.id, { rating, next: note.value }) });
      app.toast(`✓ ${t('rwSaved')}`);
      app.go('realweek');
    },
  }, t('rwSave'));
  const drop = h('button', {
    class: 'icon-btn', 'aria-label': t('rwDelete'),
    onclick: () => { app.setState({ ...app.state, events: app.state.events.filter((x) => x.id !== e.id) }); app.go('realweek'); },
  }, '🗑');
  return h('section', { class: 'card rw-reflect' },
    h('div', { class: 'rw-event' }, h('p', { class: 'muted small' }, `${EVENT_ICON[e.type]} ${fmtDay(app, e.date)}`), drop),
    h('p', { class: 'rw-text' }, e.text),
    h('p', {}, h('b', {}, t('rwHowWent'))),
    h('div', { class: 'rate-row' }, btns),
    h('label', { class: 'field-label' }, t('rwNext')), note, save);
}

export function renderRealweek(app, _params, root) {
  const t = app.t;
  const today = app.today();
  const events = app.state.events || [];
  const typeSel = h('select', {}, EVENT_TYPES.map((ty) => h('option', { value: ty }, `${EVENT_ICON[ty]} ${t(`rwType_${ty}`)}`)));
  const dateIn = h('input', { type: 'date', value: today, min: today });
  const textIn = h('input', { type: 'text', maxlength: 120, placeholder: t('rwTextPh'), class: 'text-input' });
  const add = h('button', {
    class: 'btn btn-primary',
    onclick: () => {
      const next = addEvent(events, { type: typeSel.value, date: dateIn.value, text: textIn.value }, `e${Date.now().toString(36)}`);
      if (next === events) { app.toast(t('rwMissing')); return; }
      app.setState({ ...app.state, events: next });
      app.go('realweek');
    },
  }, `＋ ${t('rwAdd')}`);
  const ups = upcoming(events, today);
  const due = needsReflection(events, today);
  root.append(
    h('header', { class: 'top round-top' },
      h('button', { class: 'icon-btn', 'aria-label': t('close'), onclick: () => app.go('home') }, '✕'),
      h('div', { class: 'round-title' }, `📅 ${t('rwTitle')}`), h('div', {})),
    h('main', { class: 'screen realweek' },
      h('p', { class: 'muted' }, t('rwIntro')),
      due.map((e) => reflectCard(app, e)),
      ups.length ? h('section', { class: 'card' },
        h('h2', { class: 'card-title' }, t('rwComing')),
        ups.map((e) => h('div', { class: 'rw-event' },
          h('div', {}, h('p', { class: 'muted small' }, `${EVENT_ICON[e.type]} ${fmtDay(app, e.date)}`), h('p', { class: 'rw-text' }, e.text),
            app.state.settings.apiKey ? h('label', { class: 'toggle small rw-share' },
              h('input', {
                type: 'checkbox', checked: !!e.shareWithCoach,
                onchange: (ev) => app.setState({ ...app.state, events: setShare(app.state.events, e.id, ev.target.checked) }),
              }),
              h('span', {}, t('rwShare'))) : null),
          h('div', { class: 'rw-actions' },
            h('button', { class: 'btn btn-primary small', onclick: () => startRehearsal(app, e) }, `🎙 ${t('rwRehearse')}`),
            h('button', {
              class: 'icon-btn', 'aria-label': t('rwDelete'),
              onclick: () => { app.setState({ ...app.state, events: events.filter((x) => x.id !== e.id) }); app.go('realweek'); },
            }, '🗑'))))) : null,
      h('section', { class: 'card' },
        h('h2', { class: 'card-title' }, t('rwNew')),
        h('label', { class: 'field-label' }, t('rwType')), typeSel,
        h('label', { class: 'field-label' }, t('rwDate')), dateIn,
        h('label', { class: 'field-label' }, t('rwWhat')), textIn,
        h('p', { class: 'muted small' }, t('rwPrivacy')),
        add)));
}

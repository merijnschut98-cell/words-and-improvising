import { h } from './dom.js';
import { ico } from './icons.js';
import { EVENT_TYPES, SKILLS, addEvent, upcoming, needsReflection, reflect, rehearsalPrompts, setShare, runHardQuestion } from '../core/realweek.js';
import { MODULES, SUBJECTS as COURSE_SUBJECTS, metaOf } from '../content/courses/index.js';
import { prepQuestions } from '../core/course.js';

// Event type -> icon name in icons.js.
export const EVENT_ICON = { client: 'handshake', presentation: 'presentation', teamtalk: 'users', networking: 'message-circle', other: 'pin' };

// Short local date, e.g. "do 29 okt".
export function fmtDay(app, day) {
  const [y, m, d] = day.split('-').map(Number);
  return new Intl.DateTimeFormat(app.lang === 'nl' ? 'nl-NL' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(y, m - 1, d));
}

let starting = false; // a second tap while the coach writes must not start twice

export async function startRehearsal(app, shown) {
  if (starting) return;
  starting = true;
  try {
    await startRehearsalOnce(app, shown);
  } finally {
    starting = false;
  }
}

async function startRehearsalOnce(app, shown) {
  // Use the saved event, not the copy captured when the screen was drawn
  // (the share switch may have changed since).
  const event = (app.state.events || []).find((x) => x.id === shown.id) || shown;
  const prompts = rehearsalPrompts(event, app.lang);
  const { apiKey, model } = app.state.settings;
  // Opt-in: the coach writes the hard question; the local one stays on any error.
  if (apiKey && event.shareWithCoach) {
    const seq = app.navSeq;
    app.toast(app.t('rwCoachWriting'));
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

function reflectCard(app, e, primary) {
  const t = app.t;
  let rating = null;
  const btns = [1, 2, 3, 4, 5].map((n) => h('button', {
    class: 'rate-btn',
    onclick: () => { rating = n; btns.forEach((b, i) => b.classList.toggle('on', i + 1 === n)); save.disabled = false; },
  }, h('b', {}, n)));
  const note = h('input', { type: 'text', maxlength: 160, placeholder: t('rwNextPh'), class: 'text-input' });
  // Optional: which skill he used in the real moment (any number of chips).
  const skills = new Set();
  const skillChips = SKILLS.map((sk) => h('button', {
    class: 'btn btn-ghost small skill-chip', 'aria-pressed': 'false',
    onclick: (ev) => {
      if (skills.has(sk)) skills.delete(sk); else skills.add(sk);
      ev.currentTarget.classList.toggle('on', skills.has(sk));
      ev.currentTarget.setAttribute('aria-pressed', String(skills.has(sk)));
    },
  }, t(`skill_${sk}`)));
  const save = h('button', {
    class: `btn ${primary()}`, disabled: true,
    onclick: () => {
      app.setState({ ...app.state, events: reflect(app.state.events, e.id, { rating, next: note.value, skills: [...skills] }) });
      app.toast(t('rwSaved'));
      app.go('realweek');
    },
  }, t('rwSave'));
  const drop = h('button', {
    class: 'icon-btn', 'aria-label': t('rwDelete'),
    onclick: () => { app.setState({ ...app.state, events: app.state.events.filter((x) => x.id !== e.id) }); app.go('realweek'); },
  }, ico('trash-2'));
  return h('section', { class: 'card rw-reflect' },
    h('div', { class: 'rw-event' }, h('p', { class: 'muted small' }, ico(EVENT_ICON[e.type]), ` ${fmtDay(app, e.date)}`), drop),
    h('p', { class: 'rw-text' }, e.text),
    h('p', {}, h('b', {}, t('rwHowWent'))),
    h('div', { class: 'rate-row' }, btns),
    h('p', { class: 'field-label' }, t('rwSkillsQ')),
    h('div', { class: 'skill-chips' }, skillChips),
    h('label', { class: 'field-label' }, t('rwNext')), note, save);
}

export function renderRealweek(app, _params, root) {
  const t = app.t;
  const today = app.today();
  const events = app.state.events || [];
  const typeSel = h('select', {}, EVENT_TYPES.map((ty) => h('option', { value: ty }, t(`rwType_${ty}`))));
  const dateIn = h('input', { type: 'date', value: today, min: today });
  const textIn = h('input', { type: 'text', maxlength: 120, placeholder: t('rwTextPh'), class: 'text-input' });
  // Optional: a course topic to refresh just before the moment. Built when the
  // disclosure opens, so the closed form stays as simple as before.
  let topicSel = null;
  const makeTopicSel = () => h('select', { class: 'rw-topic-select', 'aria-label': t('rwTopic') },
    h('option', { value: '' }, t('rwTopicNone')),
    COURSE_SUBJECTS.map((sub) => h('optgroup', { label: t(`subject_${sub}`) },
      MODULES.filter((m) => m.subject === sub).map((m) => h('option', { value: m.id }, m.title[app.lang] || m.title.en)))));
  // Exactly one filled button: the first action on the screen gets it.
  let filled = false;
  const primary = () => (filled ? 'btn-ghost' : ((filled = true), 'btn-primary'));
  const reflectCards = needsReflection(events, today).map((e) => reflectCard(app, e, primary));
  const ups = upcoming(events, today);
  const modTitle = (id) => { const m = metaOf(id); return m ? (m.title[app.lang] || m.title.en) : id; };
  const refreshBtn = (e) => {
    const topic = (e.topics || [])[0];
    if (!topic) return null;
    const ids = prepQuestions(app.state, { ...e, topics: [topic] }, app.lang, today);
    if (!ids.length) return null;
    return h('button', {
      class: 'btn btn-ghost small rw-refresh',
      onclick: () => app.go('due', { subject: metaOf(topic).subject, questionIds: ids, prep: e.id }),
    }, ico('repeat'), ' ', t('rwRefresh', modTitle(topic)));
  };
  const rehearseCls = ups.map(() => primary());
  const add = h('button', {
    class: `btn ${primary()}`,
    onclick: () => {
      const next = addEvent(events, { type: typeSel.value, date: dateIn.value, text: textIn.value, topics: topicSel && topicSel.value ? [topicSel.value] : [] }, `e${Date.now().toString(36)}`);
      if (next === events) { app.toast(t('rwMissing')); return; }
      app.setState({ ...app.state, events: next });
      app.go('realweek');
    },
  }, t('rwAdd'));
  root.append(
    h('header', { class: 'top round-top' },
      h('button', { class: 'icon-btn', 'aria-label': t('close'), onclick: () => app.go('home') }, ico('x')),
      h('div', { class: 'round-title' }, ico('calendar'), ' ', t('rwTitle')), h('div', {})),
    h('main', { class: 'screen realweek' },
      h('p', { class: 'muted' }, t('rwIntro')),
      reflectCards,
      ups.length ? h('section', { class: 'card' },
        h('h2', { class: 'card-title' }, t('rwComing')),
        ups.map((e, i) => h('div', { class: 'rw-event' },
          h('div', {}, h('p', { class: 'muted small' }, ico(EVENT_ICON[e.type]), ` ${fmtDay(app, e.date)}`), h('p', { class: 'rw-text' }, e.text),
            (e.topics || [])[0] && metaOf(e.topics[0]) ? h('p', { class: 'muted small rw-topic-line' }, ico('book-open'), ` ${t('rwTopicShown', modTitle(e.topics[0]))}`) : null,
            app.state.settings.apiKey ? h('label', { class: 'toggle small rw-share' },
              h('input', {
                type: 'checkbox', checked: !!e.shareWithCoach,
                onchange: (ev) => app.setState({ ...app.state, events: setShare(app.state.events, e.id, ev.target.checked) }),
              }),
              h('span', {}, t('rwShare'))) : null,
            refreshBtn(e)),
          h('div', { class: 'rw-actions' },
            h('button', { class: `btn ${rehearseCls[i]} small`, onclick: (ev) => { ev.currentTarget.disabled = true; startRehearsal(app, e); } }, ico('mic'), ' ', t('rwRehearse')),
            h('button', {
              class: 'icon-btn', 'aria-label': t('rwDelete'),
              onclick: () => { app.setState({ ...app.state, events: events.filter((x) => x.id !== e.id) }); app.go('realweek'); },
            }, ico('trash-2')))))) : null,
      h('section', { class: 'card' },
        h('h2', { class: 'card-title' }, t('rwNew')),
        h('label', { class: 'field-label' }, t('rwType')), typeSel,
        h('label', { class: 'field-label' }, t('rwDate')), dateIn,
        h('label', { class: 'field-label' }, t('rwWhat')), textIn,
        h('details', {
          class: 'rw-topic',
          ontoggle: (ev) => {
            if (!ev.currentTarget.open || topicSel) return;
            topicSel = makeTopicSel();
            ev.currentTarget.append(h('label', { class: 'field-label' }, t('rwTopic')), topicSel);
          },
        }, h('summary', {}, t('rwTopicLink'))),
        h('p', { class: 'muted small' }, t('rwPrivacy')),
        add)));
}

import { h, aiErrorText } from './dom.js';
import { makePrompt } from '../core/lesson.js';
import { runPartner, MAX_USER_TURNS } from '../core/partner.js';
import { createRecognizer, speechSupported } from '../core/speech.js';
import { say, hush } from '../core/voice.js';
import { tokenize } from '../core/metrics.js';

export function renderConversation(app, _params, root) {
  const t = app.t;
  const lang = app.lang;
  const prompt = makePrompt('smalltalk', app.content, Math.random, app.state.seen);
  const turns = [];
  const st = { mode: speechSupported ? app.state.settings.mode : 'type', speakS: 0, busy: false, ended: false };
  let alive = true;
  let recognizer = null;

  const chat = h('div', { class: 'chat', 'aria-live': 'polite' });
  const controls = h('div', { class: 'chat-controls' });
  const main = h('main', { class: 'screen convo' });
  root.append(
    h('header', { class: 'top round-top' },
      h('button', { class: 'icon-btn', 'aria-label': t('close'), onclick: () => app.go('home') }, '✕'),
      h('div', { class: 'round-title' }, '🗣 ', t('convoTitle')),
      h('div', { class: 'muted small' }, '')),
    main,
  );

  const userTurns = () => turns.filter((x) => x.role === 'user').length;

  function bubble(role, text) {
    const el = h('div', { class: `msg msg-${role}` }, text);
    chat.append(el);
    el.scrollIntoView({ block: 'end', behavior: 'smooth' });
    return el;
  }

  async function finish() {
    if (st.finishing) return;
    st.finishing = true;
    hush();
    // Tapped Finish while still recording: keep that last answer.
    if (recognizer) {
      const r = recognizer;
      recognizer = null;
      const last = (await r.stop() || '').trim();
      if (!alive) return;
      if (tokenize(last).length > 0) {
        turns.push({ role: 'user', text: last });
        st.speakS += (performance.now() - st.recStart) / 1000;
      }
    }
    const mine = turns.filter((x) => x.role === 'user').map((x) => x.text);
    app.session = null;
    app.go('feedback', {
      prompt: { ...prompt, extra: { ...prompt.extra, dialogue: turns.slice() } },
      transcript: mine.join('\n'),
      durationS: Math.max(1, st.speakS),
      targetS: 60,
      audio: null,
      mode: st.mode,
    });
  }

  const finishBtn = () => (userTurns() > 0
    ? h('button', { class: 'btn btn-ghost', onclick: finish }, t('finishConvo'))
    : null);

  function showIntro() {
    const toggle = h('div', { class: 'segmented', role: 'radiogroup' },
      ['speak', 'type'].map((m) => h('button', {
        class: st.mode === m ? 'on' : '',
        role: 'radio',
        'aria-checked': String(st.mode === m),
        disabled: m === 'speak' && !speechSupported,
        onclick: () => { st.mode = m; showIntro(); },
      }, m === 'speak' ? `🎙 ${t('speak')}` : `⌨️ ${t('type')}`)));
    main.replaceChildren(
      h('section', { class: 'card intro-card' },
        h('div', { class: 'intro-icon', 'aria-hidden': 'true' }, '🗣'),
        h('h1', {}, t('convoTitle')),
        h('p', {}, t('convoHow')),
        h('p', { class: 'muted small' }, `${t('situation')}: ${prompt.extra.setting}`)),
      toggle,
      h('button', { class: 'btn btn-primary btn-big', onclick: start }, t('start')),
    );
  }

  async function start() {
    main.replaceChildren(
      h('p', { class: 'muted small center' }, `${t('situation')}: ${prompt.extra.setting}`),
      chat,
      controls,
    );
    await partnerSays(prompt.body, false);
  }

  async function partnerSays(text, end) {
    turns.push({ role: 'partner', text });
    bubble('partner', text);
    controls.replaceChildren();
    await say(text, lang);
    if (!alive) return;
    if (end || userTurns() >= MAX_USER_TURNS) {
      st.ended = true;
      controls.replaceChildren(h('button', { class: 'btn btn-primary btn-big', onclick: finish }, t('finishConvo')));
    } else {
      showInput();
    }
  }

  function showInput(note) {
    const noteEl = note ? h('p', { class: 'note' }, note) : null;
    if (st.mode === 'type') {
      const ta = h('textarea', { class: 'type-input', rows: 3, placeholder: t('typeHere') });
      const startedAt = performance.now();
      controls.replaceChildren(noteEl || '', ta,
        h('button', {
          class: 'btn btn-primary btn-big',
          onclick: () => submit(ta.value, (performance.now() - startedAt) / 1000),
        }, t('send')),
        finishBtn() || '');
      ta.focus();
      return;
    }
    const live = h('div', { class: 'live small-live' });
    const mic = h('button', { class: 'btn btn-primary btn-big mic' }, `🎙 ${t('tapToTalk')}`);
    let startedAt = 0;
    let text = '';
    mic.onclick = async () => {
      if (!recognizer) {
        hush();
        text = '';
        startedAt = performance.now();
        st.recStart = startedAt;
        const rec = createRecognizer({
          lang,
          onText: (full, interim) => { text = full; live.textContent = `${full} ${interim}`.trim(); },
          onError: (code) => {
            // Ignore late errors from an engine we already stopped or while waiting on the partner.
            if (!alive || st.busy || st.finishing || recognizer !== rec) return;
            recognizer = null;
            st.mode = 'type';
            showInput(code === 'not-allowed' || code === 'service-not-allowed' ? t('micDenied') : t('speechFailed'));
          },
        });
        recognizer = rec;
        rec.start();
        mic.textContent = `✓ ${t('send')}`;
        mic.classList.add('recording');
      } else {
        mic.disabled = true;
        const r = recognizer;
        recognizer = null;
        const full = await r.stop();
        if (!alive) return;
        submit(full || text, (performance.now() - startedAt) / 1000);
      }
    };
    controls.replaceChildren(noteEl || '', live, mic, finishBtn() || '');
  }

  async function submit(raw, seconds) {
    const text = (raw || '').trim();
    if (tokenize(text).length < 1) return showInput(t('nothingHeard'));
    turns.push({ role: 'user', text });
    st.speakS += seconds;
    bubble('user', text);
    await askPartner();
  }

  async function askPartner() {
    st.busy = true;
    const typing = bubble('partner typing', t('partnerTyping'));
    controls.replaceChildren();
    const res = await runPartner(app.state.settings.apiKey, {
      setting: prompt.extra.setting, opener: prompt.body, turns, lang, model: app.state.settings.model,
    });
    if (!alive) return;
    typing.remove();
    if (res.ok) {
      await partnerSays(res.reply, res.end);
      st.busy = false;
    } else {
      st.busy = false;
      controls.replaceChildren(
        h('p', { class: 'note' }, `${t('partnerErr')} ${aiErrorText(t, res)}`),
        h('button', { class: 'btn btn-ghost', onclick: askPartner }, t('coachRetry')),
        finishBtn() || '',
      );
    }
  }

  showIntro();

  return () => {
    alive = false;
    if (recognizer) recognizer.stop();
    hush();
  };
}

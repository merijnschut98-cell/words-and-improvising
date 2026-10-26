import { h, DRILL_ICON, fmtTime } from './dom.js';
import { drillTiming, twistEvery, debateSide } from '../core/progress.js';
import { createRecognizer, speechSupported } from '../core/speech.js';
import { createRecorder } from '../core/recorder.js';
import { tokenize, analyze } from '../core/metrics.js';
import { countPauses } from '../core/pauses.js';

const RING_R = 52;
const RING_C = 2 * Math.PI * RING_R;

function ring() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 120 120');
  svg.setAttribute('class', 'ring');
  svg.innerHTML = `<circle class="ring-bg" cx="60" cy="60" r="${RING_R}"/>`
    + `<circle class="ring-fg" cx="60" cy="60" r="${RING_R}" stroke-dasharray="${RING_C}" stroke-dashoffset="0"/>`;
  const fg = svg.querySelector('.ring-fg');
  const label = h('div', { class: 'ring-label' });
  const wrap = h('div', { class: 'ring-wrap' }, svg, label);
  return {
    el: wrap,
    set(fraction, text) {
      fg.setAttribute('stroke-dashoffset', String(RING_C * (1 - Math.max(0, Math.min(1, fraction)))));
      label.textContent = text;
    },
  };
}

// Word Bridge: is a target word (or phrase) present in the transcript?
function hasWord(text, word) {
  const toks = tokenize(text);
  const target = tokenize(word);
  return toks.some((_, i) => target.every((w, k) => (toks[i + k] || '').startsWith(w)));
}

function promptCard(app, prompt, state) {
  const t = app.t;
  const x = prompt.extra || {};
  const card = h('section', { class: `card prompt-card prompt-${prompt.drill}` });
  switch (prompt.drill) {
    case 'explain':
      card.append(h('p', { class: 'prompt-main' }, prompt.body),
        h('p', { class: 'prompt-sub' }, `${t('for')}: `, h('b', {}, x.audience)));
      break;
    case 'prep':
      card.append(h('p', { class: 'prompt-main' }, prompt.body),
        h('div', { class: 'scaffold' }, t('prepScaffold').map((s, i) => h('span', { class: 'chip' }, `${i + 1}. ${s}`))));
      break;
    case 'bridge':
      state.wordChips = x.words.map((w) => h('span', { class: 'chip word' }, w));
      card.append(h('p', { class: 'prompt-main' }, prompt.body),
        h('p', { class: 'prompt-sub' }, t('words')), h('div', { class: 'scaffold' }, state.wordChips));
      break;
    case 'smalltalk':
      card.append(h('p', { class: 'prompt-sub' }, `${t('situation')}: ${x.setting}`),
        h('p', { class: 'bubble' }, `“${prompt.body}”`));
      break;
    case 'debate':
      state.sideEl = h('div', { class: 'side-banner' }, `👍 ${app.t('sideFor')}`);
      state.side = 'for';
      card.append(h('p', { class: 'prompt-main' }, prompt.body), state.sideEl);
      break;
    case 'pause':
      state.pauseEl = h('b', {}, '0');
      state.fillerEl = h('b', {}, '0');
      card.append(h('p', { class: 'prompt-main' }, prompt.body),
        h('div', { class: 'pause-counters' },
          h('div', { class: 'counter good' }, h('span', {}, `🤫 ${app.t('pausesLabel')}`), state.pauseEl),
          h('div', { class: 'counter' }, h('span', {}, `🚫 ${app.t('fillersLabel')}`), state.fillerEl)));
      break;
    case 'story':
      state.twistChip = h('div', { class: 'twist', hidden: true });
      card.append(h('p', { class: 'prompt-main story-start' }, prompt.body), state.twistChip);
      break;
    case 'rapid':
      state.rapidQ = h('p', { class: 'prompt-main' }, x.questions[0]);
      state.rapidDots = x.questions.map((_, i) => h('i', { class: i === 0 ? 'on' : '' }));
      card.append(h('div', { class: 'rapid-dots' }, state.rapidDots), state.rapidQ);
      break;
    default:
      card.append(h('p', { class: 'prompt-main' }, prompt.body));
  }
  return card;
}

export function renderRound(app, { prompt, notice = '', previous = null }, root) {
  const t = app.t;
  const settings = app.state.settings;
  const timing = drillTiming(prompt.drill, app.state.drillLevels[prompt.drill]);
  const totalS = timing.answerS * timing.questions;
  const st = {
    mode: speechSupported ? settings.mode : 'type',
    notice: [notice, speechSupported || settings.mode !== 'speak' ? '' : t('noSpeech')].filter(Boolean).join(' '),
    phase: 'intro',
    timer: null,
    transcript: '',
    twistsShown: [],
    growth: [],
    lastLive: '',
  };
  let recognizer = null;
  let recorder = null;
  let finished = false;
  let disposed = false; // set when the screen is left

  const sess = app.session;
  const quit = h('button', { class: 'icon-btn', 'aria-label': 'Close', onclick: () => app.go('home') }, '✕');
  const header = h('header', { class: 'top round-top' }, quit,
    h('div', { class: 'round-title' }, h('span', { 'aria-hidden': 'true' }, DRILL_ICON[prompt.drill]), ' ', t(`drill_${prompt.drill}`)),
    h('div', { class: 'muted small' }, sess ? t('roundOf', sess.index + 1, sess.prompts.length) : ''));
  const main = h('main', { class: 'screen round' });
  root.append(header, main);

  // replaceChildren() would render null as the text "null"
  const fill = (...nodes) => main.replaceChildren(...nodes.filter(Boolean));

  function clearTimer() {
    if (st.timer) clearInterval(st.timer);
    st.timer = null;
  }

  function countdown(seconds, onTick, onDone) {
    const start = performance.now();
    clearTimer();
    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      onTick(elapsed);
      if (elapsed >= seconds) { clearTimer(); onDone(elapsed); }
    };
    st.timer = setInterval(tick, 100);
    tick();
    return start;
  }

  function showIntro() {
    const toggle = h('div', { class: 'segmented', role: 'radiogroup' },
      ['speak', 'type'].map((m) => h('button', {
        class: st.mode === m ? 'on' : '',
        role: 'radio',
        'aria-checked': String(st.mode === m),
        disabled: m === 'speak' && !speechSupported,
        onclick: () => { st.mode = m; showIntro(); },
      }, m === 'speak' ? `🎙 ${t('speak')}` : `⌨️ ${t('type')}`)));
    fill(
      h('section', { class: 'card intro-card' },
        h('div', { class: 'intro-icon', 'aria-hidden': 'true' }, DRILL_ICON[prompt.drill]),
        h('h1', {}, t(`drill_${prompt.drill}`)),
        h('p', {}, t(`how_${prompt.drill}`)),
        prompt.focus ? h('p', { class: 'focus' }, `🎯 ${prompt.focus}`) : null,
        h('p', { class: 'muted small' }, `${timing.prepS ? `${timing.prepS}s ⏳ · ` : ''}${fmtTime(totalS)}s 🎙`)),
      toggle,
      st.notice ? h('p', { class: 'note' }, st.notice) : null,
      h('button', { class: 'btn btn-primary btn-big', onclick: (e) => { e.currentTarget.disabled = true; begin(); } }, t('start')),
    );
  }

  async function begin() {
    if (st.mode === 'speak' && settings.record) {
      recorder = createRecorder();
      await recorder.start();
      if (disposed) { recorder.stop(); return; }
    }
    st.prepStart = performance.now();
    if (timing.prepS > 0) showPrep();
    else showAnswer();
  }

  function showPrep() {
    st.phase = 'prep';
    const r = ring();
    fill(
      promptCard(app, prompt, st),
      h('div', { class: 'phase-label' }, t('prepTime')),
      r.el,
      h('button', { class: 'btn btn-primary btn-big', onclick: () => { clearTimer(); showAnswer(); } }, t('goNow')),
    );
    countdown(timing.prepS, (el) => r.set(1 - el / timing.prepS, fmtTime(timing.prepS - el)), () => showAnswer());
  }

  function updateLive(text, interim = '') {
    st.transcript = text;
    // Any change in the recognized text means he is speaking; long gaps are pauses.
    const live = `${text} ${interim}`.trim();
    if (st.mode === 'speak' && live && live !== st.lastLive) {
      st.growth.push(performance.now());
      st.lastLive = live;
    }
    if (st.pauseEl) {
      const fillers = analyze(`${text} ${interim}`, 1, app.lang).fillerCount;
      if (String(fillers) !== st.fillerEl.textContent) {
        st.fillerEl.textContent = String(fillers);
        st.fillerEl.parentElement.classList.toggle('bad', fillers > 0);
        if (fillers > 0 && navigator.vibrate) navigator.vibrate(30);
      }
      st.pauseEl.textContent = String(countPauses(st.growth));
    }
    if (st.live) {
      st.live.replaceChildren(text, interim ? h('span', { class: 'interim' }, ` ${interim}`) : '');
      st.live.scrollTop = st.live.scrollHeight;
    }
    if (st.wordChips) {
      const all = `${text} ${interim}`;
      st.wordChips.forEach((chip) => chip.classList.toggle('hit', hasWord(all, chip.textContent)));
    }
  }

  function showAnswer() {
    st.prepUsedS = (performance.now() - (st.prepStart || performance.now())) / 1000;
    st.phase = 'answer';
    const r = ring();
    const card = promptCard(app, prompt, st);
    let input;
    if (st.mode === 'speak') {
      st.live = h('div', { class: 'live', 'aria-live': 'polite' }, h('span', { class: 'muted' }, t('listening')));
      input = st.live;
      recognizer = createRecognizer({
        lang: app.lang,
        onText: (full, interim) => updateLive(full, interim),
        onError: (code) => {
          if (finished) return;
          st.mode = 'type';
          st.notice = code === 'not-allowed' || code === 'service-not-allowed' ? t('micDenied') : t('speechFailed');
          switchToTyping();
        },
      });
      recognizer.start();
    } else {
      input = typingArea();
    }
    st.inputSlot = h('div', { class: 'input-slot' }, input);
    fill(
      card,
      h('div', { class: 'answer-row' }, r.el, h('div', { class: 'phase-label go' }, st.mode === 'speak' ? t('speakNow') : t('typeNow'))),
      st.notice ? h('p', { class: 'note' }, st.notice) : null,
      st.inputSlot,
      h('button', { class: 'btn btn-primary btn-big', onclick: () => finish() }, t('done')),
    );
    if (st.textarea) st.textarea.focus();
    st.answerStart = countdown(totalS, (el) => {
      r.set(1 - el / totalS, fmtTime(totalS - el));
      if (prompt.drill === 'debate' && st.sideEl) {
        const side = debateSide(el, totalS);
        if (side !== st.side) {
          st.side = side;
          st.sideEl.textContent = `👎 ${t('sideAgainst')}`;
          st.sideEl.classList.add('against', 'pop');
          if (navigator.vibrate) navigator.vibrate([80, 60, 80]);
        }
      }
      if (prompt.drill === 'story') {
        const every = twistEvery(app.state.drillLevels.story);
        const n = Math.min(prompt.extra.twists.length, Math.floor(el / every));
        if (n > st.twistsShown.length && st.twistChip) {
          const twist = prompt.extra.twists[n - 1];
          st.twistsShown.push(twist);
          st.twistChip.hidden = false;
          st.twistChip.replaceChildren(h('small', {}, `⚡ ${t('twist')} ${n}`), h('b', {}, twist));
          st.twistChip.classList.remove('pop');
          void st.twistChip.offsetWidth; // restart the animation
          st.twistChip.classList.add('pop');
          if (navigator.vibrate) navigator.vibrate(60);
        }
      }
      if (prompt.drill === 'rapid') {
        const qi = Math.min(timing.questions - 1, Math.floor(el / timing.answerS));
        if (st.rapidQ && st.rapidQ.textContent !== prompt.extra.questions[qi]) {
          st.rapidQ.textContent = prompt.extra.questions[qi];
          st.rapidDots.forEach((d, i) => d.classList.toggle('on', i <= qi));
          if (navigator.vibrate) navigator.vibrate(40);
        }
      }
    }, (el) => finish(el));
  }

  function typingArea() {
    st.textarea = h('textarea', {
      class: 'type-input',
      placeholder: t('typeHere'),
      rows: 6,
      oninput: (e) => updateLive(e.target.value),
    });
    return st.textarea;
  }

  function switchToTyping() {
    if (recognizer) { recognizer.stop(); recognizer = null; }
    st.live = null;
    const ta = typingArea();
    ta.value = st.transcript;
    if (st.inputSlot) st.inputSlot.replaceChildren(h('p', { class: 'note' }, st.notice), ta);
    ta.focus();
  }

  async function finish(elapsed) {
    if (finished) return;
    finished = true;
    clearTimer();
    const durationS = elapsed ?? (performance.now() - st.answerStart) / 1000;
    main.querySelectorAll('button').forEach((b) => { b.disabled = true; });
    quit.disabled = true;
    let transcript = st.transcript;
    if (recognizer) transcript = await recognizer.stop();
    if (st.textarea) transcript = st.textarea.value;
    const audio = recorder ? await recorder.stop() : null;
    if (disposed) return;
    const shown = prompt.drill === 'story' ? { ...prompt, extra: { ...prompt.extra, twistsShown: st.twistsShown } } : prompt;
    app.go('feedback', {
      pauses: st.mode === 'speak' ? countPauses(st.growth) : null,
      prepS: Math.round(st.prepUsedS || 0),
      prompt: shown, transcript, durationS: Math.min(durationS, totalS), targetS: totalS, audio, mode: st.mode, previous,
    });
  }

  showIntro();

  return () => {
    disposed = true;
    finished = true;
    clearTimer();
    if (recognizer) recognizer.stop();
    if (recorder) recorder.stop();
  };
}

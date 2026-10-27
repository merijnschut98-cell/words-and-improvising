import { h, DRILL_ICON, fmtTime } from './dom.js';
import { drillTiming, twistEvery, debateSide, CUED_DRILLS } from '../core/progress.js';
import { createRecognizer, speechSupported, joinText } from '../core/speech.js';
import { say, hush, voiceSupported, speakCapMs } from '../core/voice.js';
import { prepSecondsUsed } from '../core/quests.js';
import { play } from '../core/sound.js';
import { createRecorder } from '../core/recorder.js';
import { tokenize, analyze, cleanRun } from '../core/metrics.js';
import { countPauses } from '../core/pauses.js';
import { pickModifier, applyModifierTiming } from '../core/modifiers.js';

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
    case 'boss':
      state.sideEl = h('div', { class: 'side-banner' }, `👍 ${app.t('sideFor')}`);
      state.side = 'for';
      state.wordChips = x.words.map((w) => h('span', { class: 'chip word' }, w));
      state.twistChip = h('div', { class: 'twist', hidden: true });
      card.append(h('p', { class: 'prompt-main' }, prompt.body),
        h('div', { class: 'scaffold' }, state.wordChips), state.sideEl, state.twistChip);
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
    case 'real':
      card.append(h('p', { class: 'prompt-sub' }, x.kind === 'captain' ? `🏟️ ${t('realCaptain')}` : `💼 ${t('realWork')}`),
        h('p', { class: 'prompt-main real-text' }, prompt.body));
      if (x.constraint === 'sbi') card.append(h('div', { class: 'scaffold' }, t('con_sbi').map((s, i) => h('span', { class: 'chip' }, `${i + 1}. ${s}`))));
      else if (x.constraint) card.append(h('p', { class: 'cue-hint' }, t(`con_${x.constraint}`)));
      break;
    case 'frame': {
      card.append(h('p', { class: 'prompt-main' }, prompt.body));
      const name = (f) => t(`frameName_${f}`);
      const level = app.state.drillLevels.frame || 1;
      if (level >= 3 && !state.framePick) {
        // He chooses the frame first; picking reveals the right one and its steps.
        card.append(h('p', { class: 'cue-hint' }, t('framePick')),
          h('div', { class: 'frame-pick' }, x.options.map((f) => h('button', {
            class: 'btn btn-ghost small',
            onclick: () => {
              state.framePick = f;
              if (state.onFramePick) state.onFramePick();
              else card.replaceWith(promptCard(app, prompt, state));
            },
          }, name(f)))));
      } else {
        if (state.framePick) card.append(h('p', { class: state.framePick === x.frame ? 'good-text' : 'note' },
          state.framePick === x.frame ? t('frameRight') : t('frameWrong', name(state.framePick))));
        card.append(h('p', { class: 'frame-name' }, `🧭 ${name(x.frame)}`),
          h('div', { class: 'scaffold' }, t(`frameSteps_${x.frame}`).map((s, i) => h('span', { class: 'chip' }, `${i + 1}. ${s}`))));
      }
      break;
    }
    case 'yesAnd':
    case 'expert':
    case 'followUp':
      if (prompt.drill === 'expert') card.append(h('p', { class: 'prompt-sub' }, t('expertOn', prompt.body)));
      state.cueDots = x.cues.map((_, i) => h('i', { class: i === 0 ? 'on' : '' }));
      state.cueEl = h('p', { class: 'prompt-main cue-text' }, '…');
      card.append(h('div', { class: 'rapid-dots' }, state.cueDots), state.cueEl);
      if (prompt.drill === 'yesAnd') card.append(h('p', { class: 'cue-hint' }, t('yesAndStart')));
      if (prompt.drill === 'followUp') card.append(h('p', { class: 'cue-hint' }, t('followUpHint')));
      break;
    case 'listen':
      state.statementEl = h('p', { class: 'prompt-sub listen-statement', hidden: true }, x.statement);
      state.cueEl = h('p', { class: 'prompt-main cue-text' }, '👂 …');
      card.append(state.statementEl, state.cueEl, h('p', { class: 'cue-hint' }, t('listenHint')));
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

export function renderRound(app, { prompt, notice = '', previous = null, timing: timingOverride = null, modifier = undefined }, root) {
  const t = app.t;
  const settings = app.state.settings;
  const timing = timingOverride || prompt.timing || drillTiming(prompt.drill, app.state.drillLevels[prompt.drill]);
  const totalS = timing.answerS * timing.questions;
  const st = {
    mode: speechSupported ? settings.mode : 'type',
    notice: [notice, speechSupported || settings.mode !== 'speak' ? '' : t('noSpeech')].filter(Boolean).join(' '),
    phase: 'intro',
    timer: null,
    transcript: '',
    twistsShown: [],
    growth: [],
    timeline: [], // [ms, words] samples for pace over time
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

  // Varied conditions: sometimes added automatically, or on demand.
  if (st.modifier === undefined) {
    st.modifier = modifier !== undefined ? modifier : pickModifier(Math.random, app.state.drillLevels[prompt.drill] || 1);
  }
  const prepFor = () => applyModifierTiming(timing, st.modifier).prepS;

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
        (app.state.ui || {}).nextFix ? h('p', { class: 'fix-chip' }, `🔧 ${t('yourFix')}: ${app.state.ui.nextFix.text}`) : null,
        prompt.reason && prompt.reason !== 'random' ? h('p', { class: 'reason-chip' }, t(`reason_${prompt.reason}`)) : null,
        st.modifier ? h('div', { class: 'modifier-chip' },
          h('b', {}, `💪 ${t('harderOnPurpose')}: ${t(`mod_${st.modifier}`)}`),
          h('span', {}, t(`modHow_${st.modifier}`))) : null,
        h('p', { class: 'muted small' }, `${prepFor() ? `${prepFor()}s ⏳ · ` : ''}${fmtTime(totalS)}s 🎙`)),
      toggle,
      h('button', {
        class: `btn btn-ghost small harder${st.modifier ? ' on' : ''}`,
        onclick: () => { st.modifier = st.modifier ? null : pickModifier(Math.random, 5, true); showIntro(); },
      }, st.modifier ? `↩ ${t('harderOff')}` : `💪 ${t('harderOn')}`),
      st.notice ? h('p', { class: 'note' }, st.notice) : null,
      h('button', { class: 'btn btn-primary btn-big', onclick: (e) => { e.currentTarget.disabled = true; begin(); } }, t('start')),
    );
  }

  async function begin() {
    // Spoken-cue drills would record the app's own voice: no recording there.
    if (st.mode === 'speak' && settings.record && !cued) {
      recorder = createRecorder();
      await recorder.start();
      if (disposed) { recorder.stop(); return; }
    }
    // Frames drill from level 3: he picks the frame first, off the clock.
    if (prompt.drill === 'frame' && (app.state.drillLevels.frame || 1) >= 3 && !st.framePick) {
      st.phase = 'pick';
      st.onFramePick = () => { st.onFramePick = null; startTimed(); };
      fill(promptCard(app, prompt, st));
      return;
    }
    startTimed();
  }

  function startTimed() {
    st.prepStart = performance.now();
    if (prepFor() > 0) showPrep();
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
    const prepS = prepFor();
    countdown(prepS, (el) => r.set(1 - el / prepS, fmtTime(prepS - el)), () => showAnswer());
  }

  function updateLive(text, interim = '') {
    st.transcript = text;
    // Any change in the recognized text means he is speaking; long gaps are pauses.
    const live = `${text} ${interim}`.trim();
    const n = tokenize(live).length;
    if (n > (st.timeline.length ? st.timeline[st.timeline.length - 1][1] : 0)) st.timeline.push([performance.now(), n]);
    if (st.mode === 'speak' && live && live !== st.lastLive) {
      st.growth.push(performance.now());
      st.lastLive = live;
    }
    if (st.cleanEl) {
      const cr = cleanRun(tokenize(live), app.lang);
      st.cleanEl.textContent = `🧼 ${t('cleanRun')}: ${cr.current} · ${t('best')} ${cr.max}`;
      if (cr.max > (st.cleanBest || 0) && cr.max >= 10 && cr.max === cr.current) {
        st.cleanEl.classList.remove('pop');
        void st.cleanEl.offsetWidth;
        st.cleanEl.classList.add('pop');
      }
      st.cleanBest = cr.max;
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

  const cued = CUED_DRILLS.includes(prompt.drill);
  const sleep = (ms) => new Promise((r) => { setTimeout(r, ms); });

  // Spoken-cue drills restart recognition per item; st.base holds earlier items.
  function startListening() {
    recognizer = createRecognizer({
      lang: app.lang,
      onText: (full, interim) => updateLive(joinText(st.base || '', full), interim),
      onError: (code) => {
        if (finished) return;
        st.mode = 'type';
        st.notice = code === 'not-allowed' || code === 'service-not-allowed' ? t('micDenied') : t('speechFailed');
        switchToTyping();
      },
    });
    recognizer.start();
  }

  // One item of a cued drill: stop listening, speak (or show) the cue, then
  // listen and time this item. The mic is off while the app talks.
  async function runCue(i, r) {
    const x = prompt.extra;
    const cue = x.cues[i];
    st.phase = 'cue';
    st.label.textContent = voiceSupported ? `🔊 ${t('cueListening')}` : `👀 ${t('cueRead')}`;
    st.label.classList.remove('go');
    r.set(1, fmtTime(timing.answerS));
    if (st.cueDots) st.cueDots.forEach((d, k) => d.classList.toggle('on', k <= i));
    if (recognizer) {
      const rec = recognizer;
      recognizer = null;
      st.base = joinText(st.base || '', await rec.stop());
    }
    if (finished) return;
    if (prompt.drill === 'listen') {
      if (!voiceSupported) st.statementEl.hidden = false;
      st.cueEl.textContent = voiceSupported ? '👂 …' : x.question;
    } else {
      st.cueEl.textContent = cue;
    }
    const heard = voiceSupported ? await Promise.race([say(cue, app.lang), sleep(speakCapMs(cue)).then(() => 'spoken')]) : 'failed';
    hush();
    if (finished) return;
    if (heard === 'failed') {
      // No speech (unsupported, or no voice for this language): show the text long enough to read.
      if (prompt.drill === 'listen') {
        st.statementEl.hidden = false;
        st.cueEl.textContent = x.question;
      }
      st.label.textContent = `👀 ${t('cueRead')}`;
      await sleep(prompt.drill === 'listen' ? Math.max(3000, cue.split(/\s+/).length * 300) : 3000);
    }
    if (finished) return;
    if (prompt.drill === 'listen') {
      st.statementEl.hidden = true;
      st.cueEl.textContent = x.question;
    }
    st.phase = 'answer';
    st.label.textContent = st.mode === 'speak' ? t('speakNow') : t('typeNow');
    st.label.classList.add('go');
    if (st.mode === 'speak') startListening();
    const done = st.answeredS;
    const start = countdown(timing.answerS, (el) => r.set(1 - el / timing.answerS, fmtTime(timing.answerS - el)), () => {
      st.answeredS += timing.answerS;
      if (i + 1 < timing.questions) runCue(i + 1, r);
      else finish(st.answeredS);
    });
    st.answerStart = start - done * 1000;
  }

  function showAnswer() {
    st.prepUsedS = (performance.now() - (st.prepStart || performance.now())) / 1000;
    st.phase = 'answer';
    const r = ring();
    const card = promptCard(app, prompt, st);
    let input;
    if (st.mode === 'speak') {
      st.live = h('div', { class: 'live', 'aria-live': 'polite' }, h('span', { class: 'muted' }, t('listening')));
      st.cleanEl = h('div', { class: 'clean-chip' }, `🧼 ${t('cleanRun')}: 0`);
      input = h('div', {}, st.cleanEl, st.live);
      if (!cued) startListening();
    } else {
      input = typingArea();
    }
    st.inputSlot = h('div', { class: 'input-slot' }, input);
    st.label = h('div', { class: 'phase-label go' }, st.mode === 'speak' ? t('speakNow') : t('typeNow'));
    fill(
      card,
      h('div', { class: 'answer-row' }, r.el, st.label),
      st.notice ? h('p', { class: 'note' }, st.notice) : null,
      st.inputSlot,
      h('button', { class: 'btn btn-primary btn-big', onclick: () => finish() }, t('done')),
    );
    if (st.textarea) st.textarea.focus();
    st.answerStart = performance.now();
    if (cued) {
      st.answeredS = 0;
      runCue(0, r);
      return;
    }
    st.answerStart = countdown(totalS, (el) => {
      r.set(1 - el / totalS, fmtTime(totalS - el));
      if (prompt.drill === 'boss' && st.twistChip && el >= 30 && !st.twistsShown.length) {
        const twist = prompt.extra.twists[0];
        st.twistsShown.push(twist);
        st.twistChip.hidden = false;
        st.twistChip.replaceChildren(h('small', {}, `⚡ ${t('twist')}`), h('b', {}, twist));
        st.twistChip.classList.add('pop');
        play('twist', settings);
        if (navigator.vibrate) navigator.vibrate(60);
      }
      if ((prompt.drill === 'debate' || prompt.drill === 'boss') && st.sideEl) {
        const side = debateSide(el, totalS);
        if (side !== st.side) {
          st.side = side;
          st.sideEl.textContent = `👎 ${t('sideAgainst')}`;
          st.sideEl.classList.add('against', 'pop');
          play('switch', settings);
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
          play('twist', settings);
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
    st.cleanEl = null;
    const ta = typingArea();
    ta.value = st.transcript;
    if (st.inputSlot) st.inputSlot.replaceChildren(h('p', { class: 'note' }, st.notice), ta);
    ta.focus();
  }

  async function finish(elapsed) {
    if (finished) return;
    finished = true;
    clearTimer();
    hush();
    const durationS = elapsed ?? (cued && st.phase === 'cue' ? st.answeredS : (performance.now() - st.answerStart) / 1000);
    main.querySelectorAll('button').forEach((b) => { b.disabled = true; });
    quit.disabled = true;
    let transcript = st.transcript;
    if (recognizer) transcript = joinText(st.base || '', await recognizer.stop());
    if (st.textarea) transcript = st.textarea.value;
    const audio = recorder ? await recorder.stop() : null;
    if (disposed) return;
    const shown = prompt.drill === 'story' || prompt.drill === 'boss' ? { ...prompt, extra: { ...prompt.extra, twistsShown: st.twistsShown } }
      : prompt.drill === 'frame' ? { ...prompt, extra: { ...prompt.extra, framePick: st.framePick || null } } : prompt;
    app.go('feedback', {
      pauses: st.mode === 'speak' && !cued ? countPauses(st.growth) : null,
      pace: cued || st.mode !== 'speak' ? null : { timeline: st.timeline, start: st.answerStart },
      fixUsed: !!(app.state.ui || {}).nextFix,
      prepS: prepSecondsUsed(st.prepUsedS),
      modifier: st.modifier || null,
      prompt: shown, transcript, durationS: Math.min(durationS, totalS), targetS: totalS, audio, mode: st.mode, previous,
    });
  }

  showIntro();

  return () => {
    disposed = true;
    finished = true;
    clearTimer();
    hush();
    if (recognizer) recognizer.stop();
    if (recorder) recorder.stop();
  };
}

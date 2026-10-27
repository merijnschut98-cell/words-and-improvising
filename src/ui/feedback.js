import { h, aiErrorText, bestLabel } from './dom.js';
import { updateBests } from '../core/bests.js';
import { analyze, highlightFillers, cleanRun, tokenize, paceSeries, paceTrend } from '../core/metrics.js';
import { pauseRatio } from '../core/pauses.js';
import { loudnessStats } from '../core/loudness.js';
import { compareAttempts } from '../core/compare.js';
import { modifierCheck } from '../core/modifiers.js';
import { applyRound } from '../core/round.js';
import { runCoach } from '../core/coach.js';
import { play } from '../core/sound.js';
import { checkFollowUp } from '../core/followup.js';
import { pressureChecks } from '../core/pressure.js';
import { challengeLink, challengePrompt, shareText } from '../core/share.js';

function speak(text, lang) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === 'nl' ? 'nl-NL' : 'en-US';
  u.rate = 1;
  window.speechSynthesis.speak(u);
}

function chip(value, label, tone = '') {
  return h('div', { class: `stat ${tone}` }, h('b', {}, value), h('span', {}, label));
}

export function renderFeedback(app, params, root) {
  const t = app.t;
  const { prompt, transcript, durationS, targetS, audio, mode, previous, prepS = null, modifier = null } = params;
  const lang = app.lang;
  const metrics = analyze(transcript, durationS, lang);
  if (params.pauses != null) metrics.pauses = params.pauses;
  const clean = cleanRun(tokenize(transcript), lang).max;
  const st = { rating: null, coach: null, applied: false };

  let audioUrl = null;

  const main = h('main', { class: 'screen feedback' });
  // append() would render null as the text "null"
  const add = (...nodes) => main.append(...nodes.filter(Boolean));
  root.append(h('header', { class: 'top' },
    h('div', { class: 'round-title' }, t(`drill_${prompt.drill}`)),
    h('div', { class: 'muted small' }, app.session ? t('roundOf', app.session.index + 1, app.session.prompts.length) : '')), main);

  if (metrics.words < 5) {
    add(
      h('section', { class: 'card center' }, h('div', { class: 'big-emoji', 'aria-hidden': 'true' }, '🤔'), h('p', {}, t('tooShort'))),
      h('button', { class: 'btn btn-primary btn-big', onclick: () => app.go('round', { prompt, modifier }) }, t('retry')),
      h('button', { class: 'btn btn-ghost', onclick: () => app.nextAfterRound() }, t('skip')),
    );
    return undefined;
  }

  function commit() {
    if (st.applied) return st.result;
    st.applied = true;
    // The fix he chose last time has now been practised: clear it, unless he
    // already picked a new one on this screen.
    if (params.fixUsed && !st.fixChosen && (app.state.ui || {}).nextFix) app.setState({ ...app.state, ui: { ...app.state.ui, nextFix: null } });
    const { state, xp, levelUp, completedQuests = [], newBests = [], newMilestones = [] } = applyRound(app.state, {
      prompt, transcript, durationS, targetS, metrics, lang, mode,
      rating: st.rating, coach: st.coach, prepS, retry: !!previous, cleanRun: clean, modifier,
    }, app.today(), Date.now());
    app.setState(state);
    if (newBests.length) play('best', app.state.settings);
    else if (completedQuests.length) play('quest', app.state.settings);
    completedQuests.forEach((id, i) => setTimeout(() => app.toast(`✓ ${t('questDone')}: ${t(`quest_${id}`)} +15 XP`), i * 900));
    if (newMilestones.length) {
      const msg = newMilestones.length === 1 ? t('milestoneToast', t(`ms_${newMilestones[0]}`)) : t('milestonesToast', newMilestones.length);
      setTimeout(() => app.toast(msg), completedQuests.length * 900);
    }
    st.result = { xp, levelUp, newBests, newMilestones };
    return st.result;
  }

  // Preview personal bests before the round is saved (it saves on Next).
  const firstEver = !Object.keys(app.state.bests || {}).length;
  const preview = updateBests(app.state.bests || {}, { ts: 0, drill: prompt.drill, durationS, metrics, cleanRun: clean }).newBests
    .filter((b) => !b.drill || !firstEver);
  const pbCard = preview.length ? h('section', { class: 'card pb-card' },
    firstEver ? h('p', {}, `🏆 ${t('pbFirst')}`)
      : preview.slice(0, 3).map((b) => h('p', {}, `🏆 ${t('pbNew')}: ${bestLabel(t, b)}`))) : null;

  const fillerTone = metrics.fillerRate < 3 ? 'good' : metrics.fillerRate < 6 ? 'ok' : 'bad';
  const topFillers = Object.entries(metrics.fillers).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Pace over time: words per minute per 10 s, and whether he sped up.
  const series = params.pace ? paceSeries(params.pace.timeline, params.pace.start, durationS) : [];
  const trend = paceTrend(series);
  const top = Math.max(...series, 1);
  const paceCard = series.length >= 2 ? h('section', { class: 'card pace-card' },
    h('h2', { class: 'card-title' }, t('paceOverTime')),
    h('div', { class: 'pace-bars', role: 'img', 'aria-label': series.join(', ') },
      series.map((v) => h('div', { class: 'pace-bar' }, h('i', { style: { height: `${Math.max(4, (v / top) * 100)}%` } }), h('small', {}, v)))),
    // With fewer than 3 buckets there is no trend to judge, so no verdict line.
    series.length >= 3 ? h('p', { class: trend ? 'note' : 'good-text' }, t(trend === 'faster' ? 'paceFaster' : trend === 'slower' ? 'paceSlower' : 'paceSteady')) : null) : null;

  // Voice variety (optional, settings.voiceStats): loudness samples from the round.
  const voice = loudnessStats(params.loudness);
  const voiceCard = voice ? h('section', { class: 'card voice-card' },
    h('h2', { class: 'card-title' }, t('voiceTitle')),
    h('p', { class: voice.variety === 'flat' ? 'note' : voice.variety === 'lively' ? 'good-text' : '' },
      t(voice.variety === 'flat' ? 'voiceFlat' : voice.variety === 'lively' ? 'voiceLively' : 'voiceOk')),
    voice.trailingOff ? h('p', { class: 'note' }, t('voiceTrailing')) : null) : null;

  // One fix for next time: becomes the goal on the next round's intro.
  const fixOptions = [
    topFillers[0] ? t('fixFiller', topFillers[0][0]) : null,
    trend === 'faster' ? t('fixPace') : null,
    t('fixPoint'),
  ].filter(Boolean);
  const fixInput = h('input', { type: 'text', maxlength: 100, class: 'text-input', placeholder: t('fixOwn') });
  const setFix = (text, btn) => {
    const clean = String(text || '').trim().slice(0, 100);
    if (!clean) return;
    st.fixChosen = true;
    app.setState({ ...app.state, ui: { ...(app.state.ui || {}), nextFix: { text: clean } } });
    fixCard.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === btn));
    app.toast(`🔧 ${t('fixSaved')}`);
  };
  const fixCard = h('section', { class: 'card fix-card' },
    h('h2', { class: 'card-title' }, t('fixTitle')),
    h('div', { class: 'fix-options' }, fixOptions.map((o) => h('button', { class: 'btn btn-ghost small', onclick: (e) => setFix(o, e.currentTarget) }, o))),
    h('div', { class: 'fix-own' }, fixInput, h('button', { class: 'btn btn-ghost small', onclick: (e) => setFix(fixInput.value, e.currentTarget) }, '✓')));

  // Transcript with fillers marked
  const transcriptEl = h('p', { class: 'transcript' },
    highlightFillers(transcript, lang).map((s) => (s.filler ? h('mark', {}, s.text) : s.text)));

  // Self rating
  const nextBtn = h('button', { class: 'btn btn-primary btn-big', onclick: onNext },
    app.session && app.session.index + 1 >= app.session.prompts.length ? t('finish') : t('next'));
  const rateButtons = t('rate').map((label, i) => h('button', {
    class: 'rate-btn',
    'aria-pressed': 'false',
    onclick: () => {
      st.rating = i + 1;
      rateButtons.forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-pressed', String(k === i)); });
    },
  }, h('b', {}, i + 1), h('span', {}, label)));

  // Coach card
  const coachCard = h('section', { class: 'card coach-card' });
  function renderCoach(state) {
    const head = h('h2', { class: 'card-title' }, '🧑‍🏫 ', t('coach'));
    if (state === 'nokey') {
      coachCard.replaceChildren(head, h('p', { class: 'muted' }, t('coachNoKey')),
        h('button', {
          class: 'btn btn-ghost small',
          onclick: () => { commit(); app.session = null; app.go('settings'); },
        }, t('nav_settings')));
    } else if (state === 'loading') {
      coachCard.replaceChildren(head, h('div', { class: 'shimmer' }), h('p', { class: 'muted small' }, t('coachLoading')));
    } else if (state && state.ok === false) {
      coachCard.replaceChildren(head, h('p', { class: 'note' }, aiErrorText(t, state)),
        h('button', { class: 'btn btn-ghost small', onclick: askCoach }, t('coachRetry')));
    } else if (state && state.ok) {
      const d = state.data;
      coachCard.replaceChildren(head,
        h('div', { class: 'scores' }, ['clarity', 'structure', 'fluency', 'vocabulary'].map((k) => h('div', { class: 'score' },
          h('span', {}, t(`sc_${k}`)),
          h('span', { class: 'pips' }, [1, 2, 3, 4, 5].map((n) => h('i', { class: n <= d.scores[k] ? 'on' : '' })))))),
        h('div', { class: 'coach-line good' }, h('b', {}, `${t('strength')}: `), d.strength),
        h('div', { class: 'coach-line work' }, h('b', {}, `${t('improvement')}: `), d.improvement),
        h('details', { class: 'stronger', open: true },
          h('summary', {}, t('stronger')),
          h('p', {}, d.stronger_version),
          h('div', { class: 'row' },
            window.speechSynthesis ? h('button', { class: 'btn btn-ghost small', onclick: () => speak(d.stronger_version, lang) }, `🔊 ${t('hearIt')}`) : null,
            h('button', { class: 'btn btn-ghost small', onclick: sayAgain }, `🔁 ${t('sayItAgain')}`))));
    }
  }

  let alive = true;
  async function askCoach() {
    renderCoach('loading');
    const res = await runCoach(app.state.settings.apiKey, {
      drill: prompt.drill, prompt, transcript, lang, durationS, metrics, model: app.state.settings.model, modifier,
    });
    if (!alive) return;
    if (res.ok) st.coach = res.data;
    renderCoach(res);
  }

  function sayAgain() {
    app.addToSession(commit());
    app.go('round', { prompt, previous: { metrics, durationS }, modifier });
  }

  // Before -> now, when this round is a retry of the same prompt.
  const LABEL = { fillerRate: 'm_fillers', wpm: 'm_wpm', words: 'm_words', pauses: 'pausesLabel' };
  // A spaced re-attempt compares with the last time he did this prompt.
  const earlier = previous || app.state.history.find((e) => e.promptId === prompt.id && e.drill === prompt.drill && e.lang === app.lang) || null;
  const rows = compareAttempts(earlier, { metrics });
  const compareCard = rows.length ? h('section', { class: 'card compare-card' },
    h('h2', { class: 'card-title' }, previous ? t('beforeNow') : t('earlierNow')),
    rows.map((r) => h('div', { class: 'week-row' },
      h('span', {}, t(LABEL[r.key])),
      h('b', { class: r.better === true ? 'good' : r.better === false ? 'bad' : '' },
        `${r.before} → ${r.now} ${r.better === true ? '✓' : ''}`)))) : null;

  function onNext() {
    app.nextAfterRound(commit());
  }

  if (audio) audioUrl = URL.createObjectURL(audio);

  add(
    h('section', { class: 'stats' },
      chip(metrics.words, t('m_words')),
      chip(metrics.wpm, t('m_wpm')),
      chip(metrics.fillerRate, t('m_fillers'), fillerTone),
      chip(Math.round(durationS), t('m_time'))),
    prompt.drill === 'pause' && metrics.pauses != null
      ? h('section', { class: 'stats two' },
        chip(metrics.pauses, t('pausesLabel'), metrics.pauses >= 3 ? 'good' : 'ok'),
        chip(pauseRatio(metrics.pauses, metrics.fillerCount) ?? '–', t('pauseRatio'),
          (pauseRatio(metrics.pauses, metrics.fillerCount) ?? 0) >= 0.75 ? 'good' : 'ok'))
      : null,
    compareCard,
    pbCard,
    modifier ? (() => {
      const c = modifierCheck(modifier, metrics, transcript, lang, app.state.drillLevels[prompt.drill] || 1);
      return h('p', { class: `note${c.checked && c.ok ? ' good-note' : ''}` },
        `💪 ${t(`mod_${modifier}`)}: ${c.checked ? (c.ok ? t('modMet') : t('modMissed')) : t('modHonest')} · +5 XP`);
    })() : null,
    prompt.drill === 'pressure' ? (() => {
      const x = prompt.extra;
      if (!x.interrupted) return h('section', { class: 'card pressure-card' }, h('p', { class: 'note' }, t('pressureEarly')));
      const c = pressureChecks(x.reply, app.lang);
      const line = (ok, yes, no) => h('p', { class: ok ? 'good-text' : 'note' }, `${ok ? '✓' : '✗'} ${ok ? yes : no}`);
      return h('section', { class: 'card pressure-card' },
        h('h2', { class: 'card-title' }, t('pressureTitle')),
        h('p', { class: 'muted small' }, `🔥 “${x.interrupt}”`),
        line(c.acknowledged, t('pcAck'), t('pcNoAck')),
        line(c.short, t('pcShort'), t('pcLong')),
        line(c.checkedBack, t('pcBack'), t('pcNoBack')));
    })() : null,
    prompt.drill === 'followUp' ? (() => {
      const f = checkFollowUp(transcript, prompt.extra.detail, app.lang);
      const line = (ok, yes, no) => h('p', { class: ok ? 'good-text' : 'note' }, `${ok ? '✓' : '✗'} ${ok ? yes : no}`);
      return h('section', { class: 'card followup-card' },
        h('h2', { class: 'card-title' }, t('followUpCheck')),
        line(f.asked, t('fuAsked'), t('fuNotAsked')),
        line(f.usedDetail, t('fuDetail'), t('fuNoDetail', prompt.extra.detail.map((d) => (prompt.body.match(new RegExp(d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')) || [d])[0]).join(', '))));
    })() : null,
    h('section', { class: 'card' },
      h('h2', { class: 'card-title' }, t('topFillers')),
      topFillers.length
        ? h('div', { class: 'scaffold' }, topFillers.map(([w, n]) => h('span', { class: 'chip filler' }, `${w} ×${n}`)))
        : h('p', { class: 'good-text' }, t('noFillers')),
      h('h2', { class: 'card-title' }, t('yourAnswer')),
      transcriptEl,
      audioUrl ? h('div', {}, h('p', { class: 'muted small' }, t('playback')), h('audio', { controls: true, src: audioUrl })) : null),
    paceCard,
    voiceCard,
    h('section', { class: 'card' },
      h('h2', { class: 'card-title' }, t('rateYourself')),
      h('div', { class: 'rate-row' }, rateButtons)),
    coachCard,
    fixCard,
    h('button', { class: 'btn btn-ghost', onclick: sayAgain }, `🔁 ${t('sayItAgain')}`),
    challengeBtn(),
    nextBtn,
  );

  // Only prompts that a link can rebuild (not live or coach-written ones).
  function challengeBtn() {
    if (!prompt.id || !challengePrompt({ drill: prompt.drill, promptId: prompt.id }, app.content)) return null;
    const reply = app.challengeId === prompt.id;
    return h('button', {
      class: 'btn btn-ghost',
      onclick: async () => {
        const text = t('challengeText', t(`drill_${prompt.drill}`), metrics.words, metrics.fillerRate);
        const url = challengeLink(prompt, app.lang, location.href);
        const r = await shareText(text, url);
        if (r === 'copied') app.toast(`📋 ${t('linkCopied')}`);
        else if (r === 'failed') app.toast(url);
      },
    }, reply ? `📨 ${t('challengeReply')}` : `📨 ${t('challengeSend')}`);
  }

  if (app.state.settings.apiKey) askCoach();
  else renderCoach('nokey');

  return () => {
    alive = false;
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  };
}

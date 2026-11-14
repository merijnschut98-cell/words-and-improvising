// Terugluisteren: the kept recordings grouped by exercise, and the listen-back
// exercise (checklist, rating after listening, one point for the next round,
// before/after on the same prompt). Recordings stay on this device.
import { h, DRILL_ICON } from './dom.js';
import { ico } from './icons.js';
import {
  recordings, groupByDrill, beforeAfter, compareRecordings, listenGap, CHECKS, fixOptions, markTranscript,
} from '../core/recordings.js';
import { analyze } from '../core/metrics.js';
import { FIX_MODIFIER, queueModifier } from '../core/modifiers.js';
import { isAndroid, deviceTrackInput } from '../core/micshare.js';

export const SPEEDS = [1, 1.25];

function when(app, ts) {
  return new Intl.DateTimeFormat(app.lang === 'nl' ? 'nl-NL' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(ts));
}

// An audio player with a 1× / 1.25× switch. urls collects object URLs to revoke.
function player(app, blob, urls, { autoplay = false, onPlay = null } = {}) {
  const t = app.t;
  const url = URL.createObjectURL(blob);
  urls.push(url);
  const audio = h('audio', { controls: true, src: url, preload: 'metadata', class: 'lb-audio' });
  if (onPlay) audio.addEventListener('play', onPlay, { once: true });
  let rate = 1;
  const seg = h('div', { class: 'segmented lb-speed', role: 'radiogroup', 'aria-label': t('lbSpeed') },
    SPEEDS.map((s) => h('button', {
      class: s === rate ? 'on' : '',
      role: 'radio',
      'aria-checked': String(s === rate),
      onclick: (e) => {
        rate = s;
        audio.playbackRate = s;
        audio.defaultPlaybackRate = s;
        seg.querySelectorAll('button').forEach((b) => { const on = b === e.currentTarget; b.classList.toggle('on', on); b.setAttribute('aria-checked', String(on)); });
      },
    }, `${String(s).replace('.', app.lang === 'nl' ? ',' : '.')}×`)));
  if (autoplay) audio.play().catch(() => {});
  return h('div', { class: 'lb-player' }, audio, seg);
}

const scoreText = (t, r) => [r.score != null ? t('lbScore', r.score) : null, r.coachScore != null ? t('lbCoach', r.coachScore) : null].filter(Boolean).join(' · ');

function transcriptBlock(r) {
  return h('p', { class: 'transcript lb-transcript' }, markTranscript(r.transcript, r.lang).map((s) => (s.filler ? h('mark', {}, s.text) : s.text)));
}

export function renderListenback(app, params, root) {
  const t = app.t;
  const seq = app.navSeq;
  const urls = [];
  const store = recordings();
  const main = h('main', { class: 'screen listenback' }, h('p', { class: 'muted loading' }, '…'));
  const back = () => (params.id ? app.go('listenback') : app.go('home'));
  root.append(
    h('header', { class: 'top round-top' },
      h('button', { class: 'icon-btn', 'aria-label': params.id ? t('lessonBack') : t('close'), onclick: back }, ico(params.id ? 'chevron-left' : 'x')),
      h('h1', { class: 'round-title' }, ico('headphones'), ' ', t('lbTitle')), h('div', {})),
    main);
  const fill = (...nodes) => main.replaceChildren(...nodes.flat(Infinity).filter(Boolean));

  store.list().then((list) => {
    if (seq !== app.navSeq) return;
    const r = params.id != null ? list.find((x) => x.id === params.id) : null;
    if (r) exercise(r, list);
    else overview(list);
  });

  function overview(list) {
    const recordOn = !!app.state.settings.record;
    const newest = list.find((x) => !x.listen) || list[0];
    const primary = list.length
      ? h('button', { class: 'btn btn-primary btn-big lb-start', onclick: () => app.go('listenback', { id: newest.id }) }, ico('headphones'), ' ', newest.listen ? t('lbStartAgain') : t('lbStart'))
      : (!recordOn ? h('button', { class: 'btn btn-primary btn-big', onclick: () => { app.updateSettings({ record: true }); app.go('listenback'); } }, ico('mic'), ' ', t('lbTurnOn')) : null);
    // Android whose Chrome failed the shared-track test: say plainly why nothing is kept here.
    const androidBlocked = isAndroid(navigator) && deviceTrackInput(localStorage, navigator) === false;
    fill(
      h('p', { class: 'muted lb-intro' }, t('lbIntro')),
      androidBlocked ? h('p', { class: 'note lb-android' }, t('lbAndroidNote')) : null,
      !recordOn ? h('section', { class: 'card lb-off' },
        h('p', {}, t('lbOff')),
        h('p', { class: 'muted small' }, t('recordHelp')),
        list.length ? h('button', { class: 'btn btn-ghost small', onclick: () => { app.updateSettings({ record: true }); app.go('listenback'); } }, ico('mic'), ' ', t('lbTurnOn')) : null) : null,
      list.length ? null : h('p', { class: 'note lb-empty' }, recordOn ? t('lbEmptyOn') : t('lbEmpty')),
      primary,
      groupByDrill(list).map((g) => h('section', { class: 'card lb-group' },
        h('h2', { class: 'card-title' }, ico(DRILL_ICON[g.drill] || 'mic'), ' ', t(`drill_${g.drill}`)),
        g.items.map((x) => item(x)))),
      list.length ? h('p', { class: 'muted small lb-local' }, t('lbLocal', list.length)) : null,
    );
  }

  function item(x) {
    const slot = h('div', { class: 'lb-slot' });
    const row = h('div', { class: 'lb-item' },
      h('div', { class: 'lb-item-head' },
        h('div', {},
          h('span', { class: 'small' }, when(app, x.ts)), ' ',
          h('span', { class: 'muted small' }, [`${x.durationS}s`, scoreText(t, x), x.listen ? t('lbDone') : null].filter(Boolean).join(' · '))),
        h('button', {
          class: 'icon-btn lb-delete',
          'aria-label': t('lbDelete'),
          onclick: async () => {
            if (!window.confirm(t('lbDeleteConfirm'))) return;
            await store.remove(x.id);
            if (seq === app.navSeq) app.go('listenback');
          },
        }, ico('trash-2'))),
      h('p', { class: 'lb-body' }, x.body),
      h('div', { class: 'row lb-actions' },
        h('button', {
          class: 'btn btn-ghost small lb-play',
          onclick: async (e) => {
            const btn = e.currentTarget;
            btn.disabled = true;
            const blob = await store.audio(x.id);
            if (!blob) { slot.replaceChildren(h('p', { class: 'note' }, t('lbNoAudio'))); return; }
            slot.replaceChildren(player(app, blob, urls, { autoplay: true }));
          },
        }, ico('play'), ' ', t('lbPlay')),
        h('button', { class: 'btn btn-ghost small lb-open', onclick: () => app.go('listenback', { id: x.id }) }, ico('ear'), ' ', t('lbExercise'))),
      slot);
    return row;
  }

  async function exercise(r, list) {
    const blob = await store.audio(r.id);
    if (seq !== app.navSeq) return;
    const st = { before: r.score, after: null, checks: {}, fix: null, listened: false };
    const m = analyze(r.transcript, r.durationS, r.lang);
    const saveBtn = h('button', { class: 'btn btn-primary btn-big lb-save', disabled: true, onclick: save }, t('lbSave'));

    const rateRow = (pick, cls) => {
      const btns = t('rate').map((label, i) => h('button', {
        class: 'rate-btn',
        'aria-pressed': 'false',
        onclick: () => {
          btns.forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-pressed', String(k === i)); });
          pick(i + 1);
        },
      }, h('b', {}, i + 1), h('span', {}, label)));
      return h('div', { class: `rate-row ${cls}` }, btns);
    };

    // Before: the rating he gave right after the round, or one now from memory.
    const beforeCard = st.before == null ? h('section', { class: 'card lb-before' },
      h('h2', { class: 'card-title' }, t('lbBeforeQ')),
      rateRow((n) => { st.before = n; reveal(); }, 'lb-before-rate')) : null;

    const hints = { fillers: t('lbHintFillers', m.fillerCount), pace: t('lbHintPace', m.wpm) };
    const checkCard = h('section', { class: 'card lb-checks' },
      h('h2', { class: 'card-title' }, t('lbChecksTitle')),
      h('p', { class: 'muted small' }, t('lbChecksHelp')),
      CHECKS.map((c) => h('label', { class: 'lb-check' },
        h('input', { type: 'checkbox', onchange: (e) => { st.checks[c] = e.target.checked; drawFix(); } }),
        h('span', {}, h('b', {}, t(`lbCheck_${c}`)), hints[c] ? h('small', { class: 'muted' }, ` · ${hints[c]}`) : null))));

    const gapLine = h('p', { class: 'lb-gap', 'aria-live': 'polite' });
    const afterCard = h('section', { class: 'card lb-after', hidden: true },
      h('h2', { class: 'card-title' }, t('lbAfterQ')),
      rateRow((n) => {
        st.after = n;
        const g = listenGap(st.before, n);
        gapLine.className = `lb-gap ${g && g.verdict === 'fair' ? 'good-text' : 'note'}`;
        gapLine.textContent = g ? t(`lbGap_${g.verdict}`, g.before, g.after, Math.abs(g.gap)) : '';
        saveBtn.disabled = false;
      }, 'lb-after-rate'),
      gapLine);

    const fixSlot = h('div', { class: 'fix-options lb-fix-options' });
    const fixCard = h('section', { class: 'card lb-fix' },
      h('h2', { class: 'card-title' }, t('lbFixTitle')),
      h('p', { class: 'muted small' }, t('lbFixHelp')),
      fixSlot);
    function drawFix() {
      const opts = fixOptions(st.checks);
      const shown = opts.length ? opts : CHECKS;
      if (!shown.includes(st.fix)) st.fix = opts[0] || null;
      fixSlot.replaceChildren(...shown.map((c) => h('button', {
        class: `btn btn-ghost small${st.fix === c ? ' on' : ''}`,
        'aria-pressed': String(st.fix === c),
        onclick: () => { st.fix = c; drawFix(); },
      }, t(`lbCheck_${c}`))));
    }
    drawFix();

    function reveal() {
      if (st.before == null) return;
      if (st.listened) afterCard.hidden = false;
    }
    const onPlay = () => { st.listened = true; reveal(); };

    const pair = beforeAfter(list, r);
    const compareCard = pair ? (() => {
      const rows = compareRecordings(pair[0], pair[1]);
      const LABEL = { fillerRate: 'm_fillers', wpm: 'm_wpm', words: 'm_words' };
      const col = (x, label) => h('div', { class: 'lb-col' },
        h('p', { class: 'lb-col-head' }, h('b', {}, label), h('span', { class: 'muted small' }, ` · ${when(app, x.ts)}`)),
        h('button', {
          class: 'btn btn-ghost small lb-col-play',
          onclick: async (e) => {
            const b = await store.audio(x.id);
            if (b) e.currentTarget.replaceWith(player(app, b, urls, { autoplay: true }));
          },
        }, ico('play'), ' ', t('lbPlay')),
        transcriptBlock(x));
      return h('section', { class: 'card lb-compare' },
        h('h2', { class: 'card-title' }, t('lbCompareTitle')),
        rows.filter((x) => LABEL[x.key]).map((x) => h('div', { class: 'week-row' },
          h('span', {}, t(LABEL[x.key])),
          h('b', { class: x.better === true ? 'good' : x.better === false ? 'bad' : '' }, `${x.before} → ${x.now} `, x.better === true ? ico('check') : null))),
        h('div', { class: 'lb-cols' }, col(pair[0], t('lbOld')), col(pair[1], t('lbNew'))),
        h('p', { class: 'muted small' }, h('mark', {}, t('lbFillerLegend'))));
    })() : null;

    async function save() {
      saveBtn.disabled = true;
      const listen = { before: st.before, after: st.after, checks: st.checks, fix: st.fix, ts: Date.now() };
      await store.update(r.id, { listen });
      // Only the two ratings go into the (synced) history: they feed the calibration.
      let next = { ...app.state, history: app.state.history.map((e) => (e.ts === r.ts ? { ...e, listen: { before: st.before, after: st.after } } : e)) };
      if (st.fix) next = queueModifier(next, FIX_MODIFIER[st.fix]);
      app.setState(next);
      app.toast(st.fix ? t('lbSavedFix', t(`mod_${FIX_MODIFIER[st.fix]}`)) : t('lbSaved'));
      if (seq === app.navSeq) app.go('listenback');
    }

    fill(
      h('section', { class: 'card lb-prompt' },
        h('p', { class: 'muted small' }, ico(DRILL_ICON[r.drill] || 'mic'), ` ${t(`drill_${r.drill}`)} · ${when(app, r.ts)} · ${r.durationS}s`),
        h('p', { class: 'lb-body' }, r.body),
        r.score != null ? h('p', { class: 'muted small' }, t('lbBeforeWas', r.score)) : null),
      beforeCard,
      h('section', { class: 'card lb-listen' },
        h('h2', { class: 'card-title' }, t('lbListenTitle')),
        blob ? player(app, blob, urls, { onPlay }) : h('p', { class: 'note' }, t('lbNoAudio'))),
      checkCard,
      afterCard,
      fixCard,
      compareCard,
      saveBtn,
    );
    // Without audio there is nothing to wait for.
    if (!blob) onPlay();
  }

  return () => { urls.forEach((u) => URL.revokeObjectURL(u)); };
}

// A compact way in from the Spreken home; the count fills in once the store answers.
export function listenEntry(app) {
  const t = app.t;
  const sub = h('span', { class: 'muted small' }, app.state.settings.record ? t('lbEntryOn') : t('lbEntryOff'));
  recordings().list().then((list) => { if (list.length && sub.isConnected) sub.textContent = t('lbEntryCount', list.length); });
  return h('button', { class: 'btn btn-ghost rw-entry lb-entry', onclick: () => app.go('listenback') },
    h('span', { class: 'rw-entry-title' }, ico('headphones'), ' ', t('lbTitle')), sub);
}

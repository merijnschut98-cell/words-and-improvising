import { h } from './dom.js';
import { translator } from '../i18n.js';
import { answerLink, LINE_MAX } from '../core/friend.js';
import { shareText } from '../core/share.js';

// The friend's page, opened from a ?r= link. No account, history or
// onboarding: it shows the prompt, takes three scores and one line, and hands
// back an ?rr= link. Everything the link carries is rendered as text.
export function renderFriendRate(app, params, root) {
  const { ask, prompt } = params;
  const t = translator(ask ? ask.lang : app.lang);
  const main = h('main', { class: 'screen friendrate' });
  root.append(h('header', { class: 'top' }, h('div', { class: 'round-title' }, `🧑‍🤝‍🧑 ${t('friendTitle')}`)), main);
  const tryBtn = h('button', { class: 'btn btn-ghost', onclick: () => app.go('home') }, t('friendTryApp'));

  if (!ask || !prompt) {
    main.append(h('section', { class: 'card' }, h('p', {}, t('friendBadLink'))), tryBtn);
    return undefined;
  }

  const scores = { clear: null, structured: null, confident: null };
  const labels = { clear: t('friendClear'), structured: t('friendStructured'), confident: t('friendConfident') };
  const rows = Object.keys(scores).map((key) => {
    const btns = [1, 2, 3, 4, 5].map((n) => h('button', {
      class: 'rate-btn',
      'aria-pressed': 'false',
      'aria-label': t('friendScore', labels[key], n),
      onclick: () => {
        scores[key] = n;
        btns.forEach((b, k) => { b.classList.toggle('on', k + 1 === n); b.setAttribute('aria-pressed', String(k + 1 === n)); });
      },
    }, h('b', {}, n)));
    return h('div', { class: 'friend-row', 'data-key': key },
      h('h3', { class: 'field-label' }, labels[key]),
      h('div', { class: 'rate-row' }, btns));
  });
  const lineIn = h('input', { type: 'text', id: 'friend-line', maxlength: LINE_MAX, class: 'text-input' });
  const status = h('div', { class: 'friend-status', 'aria-live': 'polite' });

  async function send() {
    if (Object.values(scores).some((v) => v == null)) {
      status.replaceChildren(h('p', { class: 'note' }, t('friendPick')));
      return;
    }
    const url = answerLink(location.href, { nonce: ask.nonce, ...scores, line: lineIn.value });
    status.replaceChildren(h('p', { class: 'good-text' }, t('friendSent')),
      h('p', { class: 'small friend-link' }, url), tryBtn);
    const r = await shareText(t('friendSendText'), url);
    if (r === 'copied') app.toast(`📋 ${t('linkCopied')}`);
  }

  main.append(
    h('section', { class: 'card' },
      h('p', { class: 'muted small' }, t('friendIntro')),
      h('h2', { class: 'card-title' }, t('friendPromptLabel')),
      h('p', { class: 'prompt-main' }, prompt.body)),
    h('section', { class: 'card' },
      rows,
      h('label', { class: 'field-label', for: 'friend-line' }, t('friendLine')),
      lineIn),
    h('button', { class: 'btn btn-primary btn-big', onclick: send }, t('friendSend')),
    status,
  );
  return undefined;
}

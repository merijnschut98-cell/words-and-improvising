// The bodies of the v18 question kinds (select all, fill in the word, put in
// order, match pairs) for the quiz. Each returns { el, applyHint(hint), value() }:
// el goes under the question, applyHint acts on a hint that was just taken (the
// first item placed, one pair fixed, the first letter shown). The answer goes
// out through submit(value). Tap-based, 44 px targets, aria-pressed and a live
// status line, so a keyboard and a screen reader can do all of it.
import { h } from './dom.js';
import { ico } from './icons.js';
import {
  shuffled, toggleOption, orderPlace, orderTake, orderLockFirst, matchStart, matchTap, matchLockPair, asPairs,
} from '../core/questionkinds.js';

const checkBtn = (t, onclick) => h('button', { type: 'button', class: 'btn btn-primary quiz-check', onclick }, t('quizCheck'));
const setDisabled = (b, off) => { b.disabled = off; b.setAttribute('aria-disabled', off ? 'true' : 'false'); };
const focusKey = (root, key) => {
  const el = root.querySelector(`[data-key="${CSS.escape(key)}"]`);
  if (el && !el.disabled) el.focus();
  return !!el;
};

// Select all that apply.
function allBody(q, { t, prev, submit }) {
  let picked = Array.isArray(prev) ? prev.filter((o) => q.options.includes(o)) : [];
  const check = checkBtn(t, () => { if (picked.length) submit(picked); });
  const sync = () => setDisabled(check, picked.length === 0);
  const btns = q.options.map((o) => {
    const on = () => picked.includes(o);
    const b = h('button', { type: 'button', class: `opt opt-tick${on() ? ' chosen' : ''}`, 'aria-pressed': String(on()) },
      h('span', { class: 'tick', 'aria-hidden': 'true' }, ico('check')), h('span', { class: 'opt-text' }, o));
    b.addEventListener('click', () => {
      picked = toggleOption(q.options, picked, o);
      b.classList.toggle('chosen', on());
      b.setAttribute('aria-pressed', String(on()));
      sync();
    });
    return b;
  });
  sync();
  const group = h('div', { class: 'quiz-opts', role: 'group', 'aria-label': t('kindAll') }, btns);
  return { el: h('div', { class: 'kind-all' }, group, h('div', { class: 'quiz-actions' }, check)), applyHint() {} };
}

// Fill in the word: an inline input, or chips from a word bank.
function gapBody(q, { t, prev, submit }) {
  const [before, after] = q.text.split('___');
  let input = null;
  let chosen = typeof prev === 'string' ? prev : null;
  let slot = null;
  const check = checkBtn(t, () => { const v = input ? input.value.trim() : chosen; if (v) submit(v); });
  const sync = () => setDisabled(check, !(input ? input.value.trim() : chosen));
  let bank = null;
  if (q.choices) {
    slot = h('span', { class: 'gap-slot' }, chosen || '…');
    bank = h('div', { class: 'quiz-opts gap-bank', role: 'group', 'aria-label': t('gapBank') }, q.choices.map((w) => {
      const b = h('button', { type: 'button', class: `opt gap-chip${w === chosen ? ' chosen' : ''}`, 'aria-pressed': String(w === chosen) }, w);
      b.addEventListener('click', () => {
        chosen = w;
        slot.textContent = w;
        for (const x of bank.children) { const on = x === b; x.classList.toggle('chosen', on); x.setAttribute('aria-pressed', String(on)); }
        sync();
      });
      return b;
    }));
  } else {
    input = h('input', { type: 'text', class: 'text-input gap-input', autocomplete: 'off', autocapitalize: 'none', spellcheck: 'false', 'aria-label': t('gapPh') });
    if (typeof prev === 'string') input.value = prev;
    input.addEventListener('input', sync);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && input.value.trim()) submit(input.value.trim()); });
    setTimeout(() => input.focus(), 0);
  }
  sync();
  return {
    el: h('div', { class: 'kind-gap' },
      h('p', { class: 'gap-text' }, before, input || slot, after),
      bank,
      h('div', { class: 'quiz-actions' }, check)),
    applyHint(hint) { if (hint && hint.kind === 'letter' && input) input.placeholder = `${hint.letter}…`; },
  };
}

// Put in order: tap an item to place it in the next slot, tap a slot to take it back.
function orderBody(q, { t, prev, submit }) {
  const total = q.items.length;
  const pool0 = shuffled(q.items, q.id || q.q);
  let placed = Array.isArray(prev) ? prev.filter((x) => q.items.includes(x)) : [];
  let locked = 0;
  const slots = h('ol', { class: 'order-slots' });
  const pool = h('div', { class: 'order-pool', role: 'group', 'aria-label': t('orderPool') });
  const status = h('p', { class: 'sr-only', role: 'status', 'aria-live': 'polite' });
  const check = checkBtn(t, () => { if (placed.length === total) submit(placed); });
  const root = h('div', { class: 'kind-order' }, slots, pool, status, h('div', { class: 'quiz-actions' }, check));

  function draw(focus) {
    slots.replaceChildren(...q.items.map((_, i) => {
      const item = placed[i];
      if (item == null) return h('li', { class: 'order-slot empty', 'aria-label': t('orderSlot', i + 1, null) }, h('span', { class: 'n', 'aria-hidden': 'true' }, `${i + 1}`));
      const lock = i < locked;
      return h('li', {}, h('button', {
        type: 'button', class: `order-slot filled${lock ? ' locked' : ''}`, 'data-key': `s:${item}`, disabled: lock,
        'aria-label': lock ? `${t('orderSlot', i + 1, item)} (${t('orderLocked')})` : t('orderSlot', i + 1, item),
        onclick: () => { placed = orderTake(placed, i, locked); status.textContent = ''; draw(`p:${item}`); },
      }, h('span', { class: 'n', 'aria-hidden': 'true' }, `${i + 1}`), h('span', { class: 'item' }, item)));
    }));
    pool.replaceChildren(...pool0.filter((x) => !placed.includes(x)).map((x) => h('button', {
      type: 'button', class: 'opt order-item', 'data-key': `p:${x}`,
      onclick: () => {
        const at = placed.length;
        placed = orderPlace(placed, x, total);
        status.textContent = t('orderSlot', at + 1, x);
        draw(placed.length === total ? 'check' : null);
      },
    }, x)));
    setDisabled(check, placed.length !== total);
    if (focus === 'check') check.focus();
    else if (focus && focusKey(root, focus)) { /* focused */ } else if (focus === null) { const first = pool.querySelector('button'); if (first) first.focus(); }
  }
  draw(undefined);
  return {
    el: root,
    applyHint(hint) {
      if (!hint || hint.kind !== 'first') return;
      placed = orderLockFirst(placed, hint.item);
      locked = 1;
      draw(undefined);
    },
  };
}

// Match pairs: tap an item on the left, then its partner on the right.
function matchBody(q, { t, prev, submit }) {
  const total = q.pairs.length;
  const lefts = q.pairs.map((p) => p[0]);
  const rights = shuffled(q.pairs.map((p) => p[1]), q.id || q.q);
  let s = matchStart();
  if (prev != null) for (const [l, r] of asPairs(prev)) s = matchTap(matchTap(s, 'left', l), 'right', r);
  const cols = h('div', { class: 'match-cols' });
  const status = h('p', { class: 'sr-only', role: 'status', 'aria-live': 'polite' });
  const check = checkBtn(t, () => { if (s.pairs.length === total) submit(s.pairs); });
  const root = h('div', { class: 'kind-match' }, cols, status, h('div', { class: 'quiz-actions' }, check));

  function draw(focus) {
    const num = (side, v) => { const i = s.pairs.findIndex((p) => p[side === 'left' ? 0 : 1] === v); return i < 0 ? null : i; };
    const item = (side, v) => {
      const i = num(side, v);
      const paired = i != null;
      const lock = paired && i < s.locked;
      const partner = paired ? s.pairs[i][side === 'left' ? 1 : 0] : null;
      const [l, r] = side === 'left' ? [v, partner] : [partner, v];
      return h('button', {
        type: 'button', 'data-key': `${side[0]}:${v}`, disabled: lock,
        class: `opt match-item${paired ? ` paired pair-${i % 5}` : ''}${side === 'left' && s.left === v ? ' chosen' : ''}${lock ? ' locked' : ''}`,
        'aria-pressed': side === 'left' && !paired ? String(s.left === v) : null,
        'aria-label': paired ? `${t('matchPaired', i + 1, l, r)}${lock ? ` (${t('matchLocked')})` : ''}` : null,
        onclick: () => {
          const before = s;
          s = matchTap(s, side, v);
          status.textContent = s.left != null && s.left !== before.left ? t('matchPickRight', s.left) : (s.pairs.length > before.pairs.length ? t('matchPaired', s.pairs.length, ...s.pairs[s.pairs.length - 1]) : '');
          draw(`${side[0]}:${v}`);
        },
      }, paired ? h('span', { class: 'n', 'aria-hidden': 'true' }, `${i + 1}`) : null, h('span', { class: 'item' }, v));
    };
    cols.replaceChildren(
      h('div', { class: 'match-col', role: 'group', 'aria-label': t('matchLeft') }, lefts.map((v) => item('left', v))),
      h('div', { class: 'match-col', role: 'group', 'aria-label': t('matchRight') }, rights.map((v) => item('right', v))));
    setDisabled(check, s.pairs.length !== total);
    if (focus) focusKey(root, focus);
  }
  draw(undefined);
  return {
    el: root,
    applyHint(hint) {
      if (!hint || hint.kind !== 'pair') return;
      s = matchLockPair(s, hint.left, hint.right);
      draw(undefined);
    },
  };
}

const BODIES = { all: allBody, gap: gapBody, order: orderBody, match: matchBody };
export const hasBody = (kind) => kind in BODIES;
export const kindBody = (kind, q, ctx) => BODIES[kind](q, ctx);

// v16 flair, the shared pieces: the medal seal, the title tag, the daily
// goal ring and the celebration. Tiers are told apart by form and always by
// their word, never by colour alone (gold is retired; petrol is the accent).
import { h } from './dom.js';
import { storedMedal, medalFor } from '../core/flair.js';
import { checkOf } from '../core/modulecheck.js';

const CHECK_PATH = '<path class="seal-check" d="M7.5 12.5 10.5 15.5 16.5 9" />';

// The seal's SVG: bronze a hairline ring, silver a double ring, gold a solid
// disc with a check; no medal yet an empty ring in the track colour.
function sealSvg(tier, draw) {
  const d = draw ? ' draw' : '';
  const body = tier === 'gold'
    ? `<circle class="seal-fill${d}" cx="12" cy="12" r="10.5" pathLength="100" />${CHECK_PATH}`
    : tier === 'silver'
      ? `<circle class="seal-ring thin${d}" cx="12" cy="12" r="10.5" pathLength="100" /><circle class="seal-ring thick${d}" cx="12" cy="12" r="7" pathLength="100" />`
      : tier === 'bronze'
        ? `<circle class="seal-ring${d}" cx="12" cy="12" r="10" pathLength="100" />`
        : '<circle class="seal-none" cx="12" cy="12" r="10" />';
  return `<svg class="seal" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
}

export function medalSeal(t, tier, size = 24, { draw = false } = {}) {
  return h('span', { class: `medal medal-${tier || 'none'} medal-${size}` },
    h('span', { class: 'seal-wrap', html: sealSvg(tier, draw) }),
    h('span', { class: 'medal-word' }, tier ? t(`medal_${tier}`) : t('medalNone')));
}

export function titleTag(t, rank) {
  if (!rank) return null;
  return h('span', { class: 'title-tag' }, t(`title_${rank}`));
}

// The end of a module's path: its medal (stored, or what the rules give
// now) and the module check: open, tried today ('tomorrow'), or null before bronze.
export function moduleEndModel(state, meta, today) {
  const stored = storedMedal(state, meta.subject, meta.id);
  const tier = stored || medalFor(state, meta);
  if (!tier) return { tier: null, check: null };
  const c = checkOf(state, meta.subject, meta.id);
  return { tier, check: c && c.last === today ? 'tomorrow' : 'open' };
}

// On a module row's meta line: the stored medal, small; nothing without one.
export function metaSeal(t, state, meta) {
  const tier = storedMedal(state, meta.subject, meta.id);
  return tier ? medalSeal(t, tier, 24) : null;
}

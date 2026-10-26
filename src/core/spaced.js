// Spaced re-attempts (Leitner boxes): a prompt comes back after 1, 3, 7 and
// 21 days. Doing better moves it up a box; not doing better sends it back to
// box 1; doing better in box 4 retires it. Pure.
import { dayKey } from './progress.js';
import { challengePrompt, isRebuildableId } from './share.js';

export const INTERVALS = [1, 3, 7, 21];

function addDays(day, n) {
  const [y, m, d] = day.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + n));
}

// Better than the earlier attempt: fewer fillers/min, or a higher rating.
export function wasImproved(prev, cur) {
  if (!prev || !prev.metrics || !cur || !cur.metrics) return false;
  return cur.metrics.fillerRate < prev.metrics.fillerRate || (cur.rating ?? 0) > (prev.rating ?? 0);
}

// Reviews are keyed "lang|promptId": the same id exists in both languages.
const keyOf = (lang, promptId) => `${lang}|${promptId}`;
const idOf = (key) => (key.includes('|') ? key.slice(key.indexOf('|') + 1) : key);

export function scheduleReview(reviews, { promptId, drill, lang }, today, improved) {
  // Boss rounds are weekend-only; coach-written and live prompts can't be rebuilt.
  if (!isRebuildableId(promptId) || drill === 'boss') return reviews;
  const key = keyOf(lang, promptId);
  const next = { ...reviews };
  const legacy = next[promptId] && next[promptId].lang === lang ? next[promptId] : null;
  if (legacy) delete next[promptId];
  const cur = next[key] || legacy;
  const box = cur && improved ? cur.box + 1 : 1;
  if (box > INTERVALS.length) {
    delete next[key];
    return next;
  }
  next[key] = { box, due: addDays(today, INTERVALS[box - 1]), drill, lang };
  return next;
}

// Prompts due today in this language, oldest due first, rebuilt from content.
// Reviews overdue for more than this many days quietly lapse, so the
// "Again, but better" card reflects what is fresh, not an endless backlog.
export const LAPSE_DAYS = 14;

export function dueReviews(reviews, today, content, lang) {
  const oldest = addDays(today, -LAPSE_DAYS);
  return Object.entries(reviews || {})
    .filter(([, r]) => r.lang === lang && r.due <= today && r.due >= oldest)
    .sort(([, a], [, b]) => (a.due < b.due ? -1 : a.due > b.due ? 1 : 0))
    .map(([key, r]) => challengePrompt({ drill: r.drill, promptId: idOf(key) }, content))
    .filter(Boolean);
}

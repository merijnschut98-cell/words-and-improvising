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

export function scheduleReview(reviews, { promptId, drill, lang }, today, improved) {
  if (!isRebuildableId(promptId)) return reviews;
  const cur = reviews[promptId];
  const box = cur && improved ? cur.box + 1 : 1;
  const next = { ...reviews };
  if (box > INTERVALS.length) {
    delete next[promptId];
    return next;
  }
  next[promptId] = { box, due: addDays(today, INTERVALS[box - 1]), drill, lang };
  return next;
}

// Prompts due today in this language, oldest due first, rebuilt from content.
export function dueReviews(reviews, today, content, lang) {
  return Object.entries(reviews || {})
    .filter(([, r]) => r.lang === lang && r.due <= today)
    .sort(([, a], [, b]) => (a.due < b.due ? -1 : a.due > b.due ? 1 : 0))
    .map(([promptId, r]) => challengePrompt({ drill: r.drill, promptId }, content))
    .filter(Boolean);
}

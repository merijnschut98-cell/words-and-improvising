// Before/after comparison for "Say it again". Pure.

// Pace is shown but not judged: faster is not better.
const ROWS = [
  { key: 'fillerRate', lowerIsBetter: true },
  { key: 'wpm', neutral: true },
  { key: 'words' },
  { key: 'pauses' },
];

export function compareAttempts(prev, cur) {
  if (!prev || !prev.metrics || !cur || !cur.metrics) return [];
  return ROWS
    .filter(({ key }) => prev.metrics[key] != null && cur.metrics[key] != null)
    .map(({ key, lowerIsBetter, neutral }) => {
      const before = prev.metrics[key];
      const now = cur.metrics[key];
      // Ignore noise: changes under 5% (or 0 -> 0) don't count.
      const small = Math.abs(now - before) <= Math.abs(before) * 0.05;
      const better = neutral || small ? null : (lowerIsBetter ? now < before : now > before);
      return { key, before, now, better };
    });
}

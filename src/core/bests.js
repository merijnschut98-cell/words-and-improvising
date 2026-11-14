// Personal bests: beat yourself, not others. Pure.

const MIN_RATE_WORDS = 30; // fillers/min on a handful of words is luck, not a record

const RECORDS = [
  { key: 'fillerRate', get: (e) => (e.metrics.words >= MIN_RATE_WORDS ? e.metrics.fillerRate : null), lower: true },
  { key: 'words', get: (e) => e.metrics.words },
  { key: 'cleanRun', get: (e) => e.cleanRun },
  { key: 'pauses', get: (e) => e.metrics.pauses },
];

const beats = (value, prev, lower) => prev == null || (lower ? value < prev.value : value > prev.value);

export function updateBests(bests, entry) {
  const newBests = [];
  if (!entry || !entry.metrics || entry.durationS < 5 || entry.metrics.words < 5) return { bests, newBests };
  const next = { ...bests, byDrill: { ...(bests.byDrill || {}) } };
  for (const { key, get, lower } of RECORDS) {
    const value = get(entry);
    if (value == null) continue;
    if (beats(value, bests[key], lower)) {
      next[key] = { value, ts: entry.ts, drill: entry.drill };
      newBests.push({ key, value });
    }
  }
  const rate = RECORDS[0].get(entry);
  const drillBest = (next.byDrill[entry.drill] || {}).fillerRate;
  if (rate != null && beats(rate, drillBest, true)) {
    next.byDrill[entry.drill] = { ...(next.byDrill[entry.drill] || {}), fillerRate: { value: rate, ts: entry.ts } };
    newBests.push({ key: 'fillerRate', value: rate, drill: entry.drill });
  }
  return newBests.length ? { bests: next, newBests } : { bests, newBests };
}

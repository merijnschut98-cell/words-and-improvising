// Friday boss round: once a week (Fri–Sun) a 2-minute mix of everything. Pure.

// Monday-based week key, e.g. '2026-W44'.
export function isoWeekKey(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

export function bossAvailable(state, now = new Date()) {
  const dow = now.getDay(); // 0 Sun … 5 Fri, 6 Sat
  if (![5, 6, 0].includes(dow)) return false;
  const week = isoWeekKey(now);
  return !state.history.some((e) => e.drill === 'boss' && isoWeekKey(new Date(e.ts)) === week);
}

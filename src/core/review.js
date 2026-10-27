// Weekly review: this week vs last week, plus one focus for next week. Pure.

const WEEK = 7 * 86400000;
const avg = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const round1 = (x) => (x == null ? null : Math.round(x * 10) / 10);

function summarize(entries) {
  const fr = avg(entries.map((e) => e.metrics.fillerRate));
  const wpm = avg(entries.map((e) => e.metrics.wpm));
  return {
    rounds: entries.length,
    minutes: Math.round(entries.reduce((a, e) => a + (e.durationS || 0), 0) / 60),
    fillerRate: round1(fr),
    wpm: wpm == null ? null : Math.round(wpm),
  };
}

const ratingOf = (e) => e.rating ?? (e.coach && e.coach.overall) ?? null;

function drillAverages(entries) {
  const by = {};
  for (const e of entries) {
    const r = ratingOf(e);
    if (r == null) continue;
    (by[e.drill] = by[e.drill] || []).push(r);
  }
  return Object.entries(by)
    .filter(([, rs]) => rs.length >= 2)
    .map(([drill, rs]) => ({ drill, avg: round1(avg(rs)) }));
}

export function weeklyReview(all, now = Date.now()) {
  // Skip odd entries (e.g. from a hand-edited backup): no metrics, no timestamp.
  const history = (all || []).filter((e) => e && typeof e.ts === 'number' && e.metrics);
  const thisWeek = history.filter((e) => now - e.ts < WEEK);
  const lastWeek = history.filter((e) => now - e.ts >= WEEK && now - e.ts < 2 * WEEK);

  const counts = {};
  for (const e of thisWeek) {
    for (const [w, n] of Object.entries(e.metrics.fillers || {})) counts[w] = (counts[w] || 0) + n;
  }
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const topFiller = top ? { word: top[0], count: top[1] } : null;

  const drills = drillAverages(thisWeek).sort((a, b) => b.avg - a.avg);
  const best = drills[0] || null;
  const worst = drills.length ? drills[drills.length - 1] : null;

  const tw = summarize(thisWeek);
  let focus;
  if (tw.fillerRate != null && tw.fillerRate >= 4 && topFiller) focus = { kind: 'filler', value: topFiller.word };
  else if (worst && worst.avg < 3.5) focus = { kind: 'drill', value: worst.drill };
  else if (tw.rounds < 5) focus = { kind: 'rounds', value: 5 };
  else focus = { kind: 'stretch', value: null };

  const bossEntry = thisWeek.find((e) => e.drill === 'boss');
  const boss = bossEntry ? { fillerRate: bossEntry.metrics.fillerRate, words: bossEntry.metrics.words } : null;
  return { thisWeek: tw, lastWeek: summarize(lastWeek), topFiller, best, worst, focus, boss };
}

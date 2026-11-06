// Self-assessment calibration and a 4-axis skill profile. Pure.
const round1 = (x) => Math.round(x * 10) / 10;
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const clamp = (x) => Math.min(5, Math.max(1, x));

// Self-rating vs coach overall over the last 10 rounds that have both.
export function calibration(history) {
  const pairs = history.filter((e) => e.rating != null && e.coach && e.coach.overall != null).slice(0, 10);
  if (pairs.length < 3) return null;
  const meanGap = round1(mean(pairs.map((e) => e.rating - e.coach.overall)));
  const verdict = meanGap < -0.5 ? 'harsh' : meanGap > 0.5 ? 'generous' : 'fair';
  return { n: pairs.length, meanGap, verdict };
}

// Without a coach: does the self-rating move with the filler trend?
// Last 5 rated rounds vs the 5 before them.
export function localCalibration(history) {
  const rated = history.filter((e) => e.rating != null && e.metrics && e.metrics.words >= 5).slice(0, 10);
  if (rated.length < 6) return null;
  const recent = rated.slice(0, 5);
  const older = rated.slice(5);
  const ratingDelta = round1(mean(recent.map((e) => e.rating)) - mean(older.map((e) => e.rating)));
  const fillerDelta = round1(mean(recent.map((e) => e.metrics.fillerRate)) - mean(older.map((e) => e.metrics.fillerRate)));
  const verdict = fillerDelta < -0.3 && ratingDelta <= 0 ? 'harsh'
    : fillerDelta > 0.3 && ratingDelta > 0 ? 'generous' : 'fair';
  return { n: rated.length, ratingDelta, fillerDelta, verdict };
}

const AXES = ['clarity', 'structure', 'fluency', 'vocabulary'];

// 0–5 per axis from the last 10 rounds. Coach scores when any exist;
// otherwise local proxies (clarity/structure from self-rating only).
export function skillRadar(history) {
  const recent = history.filter((e) => e.metrics && e.metrics.words >= 5).slice(0, 10);
  if (!recent.length) return null;
  const coached = recent.filter((e) => e.coach && e.coach.scores);
  if (coached.length) {
    const out = Object.fromEntries(AXES.map((a) => [a, round1(mean(coached.map((e) => e.coach.scores[a] || 0)))]));
    return { ...out, source: 'coach' };
  }
  const ratings = recent.map((e) => e.rating).filter((r) => r != null);
  const self = ratings.length ? round1(mean(ratings)) : 3;
  const fillerRate = mean(recent.map((e) => e.metrics.fillerRate || 0));
  const unique = mean(recent.map((e) => e.metrics.uniqueRatio || 0));
  return {
    clarity: self,
    structure: self,
    fluency: round1(clamp(5 - fillerRate / 2)),
    vocabulary: round1(clamp(1 + (unique - 0.4) * 10)),
    source: 'local',
  };
}

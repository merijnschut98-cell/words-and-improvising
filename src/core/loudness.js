// Voice variety from loudness samples (pure, no DOM).
// samples: RMS loudness values (0..1), one every 100 ms during the answer.
//
// Thresholds (rough, tuned for a phone mic at speaking distance):
// - SILENCE: samples below 0.02 are pauses or background, ignored.
// - MIN_VOICED: 50 voiced samples (about 5 s of speech) before we judge.
// - variety from the coefficient of variation (stdev / mean) of voiced
//   samples: below 0.18 is flat (monotone volume), above 0.45 is lively.
// - trailingOff: mean of the last third of voiced samples is below 0.6x the
//   mean of the first third.
export const SILENCE = 0.02;
export const MIN_VOICED = 50;
export const FLAT_CV = 0.18;
export const LIVELY_CV = 0.45;
export const TRAIL_RATIO = 0.6;

const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

export function loudnessStats(samples) {
  if (!Array.isArray(samples)) return null;
  const voiced = samples.filter((v) => typeof v === 'number' && Number.isFinite(v) && v >= SILENCE);
  if (voiced.length < MIN_VOICED) return null;
  const m = mean(voiced);
  const sd = Math.sqrt(mean(voiced.map((v) => (v - m) ** 2)));
  const cv = m > 0 ? sd / m : 0;
  const variety = cv < FLAT_CV ? 'flat' : cv > LIVELY_CV ? 'lively' : 'ok';
  const third = Math.floor(voiced.length / 3);
  const first = mean(voiced.slice(0, third));
  const last = mean(voiced.slice(voiced.length - third));
  return { variety, trailingOff: last < TRAIL_RATIO * first };
}

// When speech recognition fails while the meter is running (and not because
// the mic was denied), the second mic stream is the likely cause: switch off.
export const meterShouldTurnOff = (code, meterActive) => !!meterActive && code !== 'not-allowed' && code !== 'service-not-allowed';

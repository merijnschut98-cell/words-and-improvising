// Transcript analysis: word count, pace, filler words. Pure functions.

export const FILLERS = {
  en: ['um', 'uh', 'uhm', 'erm', 'er', 'like', 'you know', 'basically', 'actually',
    'so', 'i mean', 'kind of', 'sort of', 'literally', 'right'],
  nl: ['eh', 'euh', 'ehm', 'uhm', 'uh', 'um', 'dus', 'eigenlijk', 'zeg maar', 'gewoon',
    'nou', 'ofzo', 'weet je', 'als het ware', 'echt', 'toch'],
};

export function tokenize(text) {
  return (text || '').toLowerCase().match(/[\p{L}\p{N}'’-]+/gu) || [];
}

// Longest phrases first so "you know" wins over a single-word match.
function phraseList(lang) {
  return (FILLERS[lang] || FILLERS.en)
    .map((f) => f.split(' '))
    .sort((a, b) => b.length - a.length);
}

export function findFillers(tokens, lang) {
  const phrases = phraseList(lang);
  const fillers = {};
  const positions = [];
  for (let i = 0; i < tokens.length; ) {
    const hit = phrases.find((p) => p.every((w, k) => tokens[i + k] === w));
    if (hit) {
      const key = hit.join(' ');
      fillers[key] = (fillers[key] || 0) + 1;
      positions.push([i, hit.length]);
      i += hit.length;
    } else {
      i += 1;
    }
  }
  return { fillers, positions };
}

export function analyze(text, durationS, lang = 'en') {
  const tokens = tokenize(text);
  const words = tokens.length;
  const { fillers } = findFillers(tokens, lang);
  const fillerCount = Object.values(fillers).reduce((a, b) => a + b, 0);
  const minutes = durationS > 0 ? durationS / 60 : 0;
  const perMin = (n) => (minutes > 0 ? Math.round((n / minutes) * 10) / 10 : 0);
  return {
    words,
    wpm: Math.round(perMin(words)),
    fillers,
    fillerCount,
    fillerRate: perMin(fillerCount),
    uniqueRatio: words ? Math.round((new Set(tokens).size / words) * 100) / 100 : 0,
  };
}

// For display: split the original text into [{text, filler}] segments.
export function highlightFillers(text, lang = 'en') {
  if (!text) return [];
  const alts = phraseList(lang).map((p) => p.join('\\s+')).join('|');
  const re = new RegExp(`(?<![\\p{L}\\p{N}'’-])(?:${alts})(?![\\p{L}\\p{N}'’-])`, 'giu');
  const segs = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) segs.push({ text: text.slice(last, m.index), filler: false });
    segs.push({ text: m[0], filler: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) segs.push({ text: text.slice(last), filler: false });
  return segs;
}

// Longest stretch of words without a filler (a multi-word filler is one break),
// and the stretch running at the end.
export function cleanRun(tokens, lang = 'en') {
  const { positions } = findFillers(tokens, lang);
  let max = 0;
  let start = 0;
  for (const [i, len] of positions) {
    max = Math.max(max, i - start);
    start = i + len;
  }
  const current = tokens.length - start;
  return { max: Math.max(max, current), current };
}

// Words per minute per `bucketS` seconds, from a timeline of [ms, wordCount]
// samples. Rounds under one bucket give []; tail buckets under 3 s are dropped.
export function paceSeries(timeline, startMs, durationS, bucketS = 10) {
  if (!timeline || durationS < bucketS) return [];
  const wordsAt = (ms) => {
    let w = 0;
    for (const [t, n] of timeline) if (t <= ms) w = n;
    return w;
  };
  const out = [];
  for (let from = 0; from < durationS; from += bucketS) {
    const to = Math.min(from + bucketS, durationS);
    if (to - from < 3) break;
    const words = wordsAt(startMs + to * 1000) - wordsAt(startMs + from * 1000);
    out.push(Math.round((Math.max(0, words) * 60) / (to - from)));
  }
  return out;
}

// 'faster' or 'slower' when the last third differs from the first third by
// more than 20 %; null otherwise or with fewer than 3 buckets.
export function paceTrend(series) {
  if (!series || series.length < 3) return null;
  const k = Math.max(1, Math.floor(series.length / 3));
  const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const first = mean(series.slice(0, k));
  const last = mean(series.slice(-k));
  if (!first) return null;
  const r = last / first;
  return r > 1.2 ? 'faster' : r < 0.8 ? 'slower' : null;
}

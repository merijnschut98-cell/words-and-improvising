// Transcript analysis: word count, pace, filler words. Pure functions.

export const FILLERS = {
  en: ['um', 'uh', 'uhm', 'erm', 'er', 'like', 'you know', 'basically', 'actually',
    'so', 'i mean', 'kind of', 'sort of', 'literally', 'right'],
  nl: ['eh', 'euh', 'ehm', 'uhm', 'uh', 'dus', 'eigenlijk', 'zeg maar', 'gewoon',
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

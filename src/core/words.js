// Word-level feedback: which fillers are moving, vague words, and words he
// leans on. Speech-to-text drops some fillers, so treat filler numbers as a
// lower bound. Pure.
import { tokenize } from './metrics.js';

const DAY = 86400000;
const round1 = (x) => Math.round(x * 10) / 10;

export const VAGUE = {
  en: ['thing', 'things', 'stuff', 'kind of', 'sort of', 'basically', 'really', 'very'],
  nl: ['ding', 'dingen', 'eigenlijk', 'gewoon', 'soort van', 'best wel', 'heel', 'echt'],
};

const STOP = {
  en: new Set(['that', 'this', 'with', 'have', 'from', 'they', 'what', 'there', 'their', 'would', 'about', 'which', 'just', 'like', 'your', 'been', 'were', 'will', 'when', 'then', 'them', 'also', 'into', 'more', 'some', 'very', 'really', 'thing', 'things']),
  nl: new Set(['want', 'moet', 'maar', 'voor', 'niet', 'zijn', 'heeft', 'wordt', 'omdat', 'deze', 'door', 'naar', 'over', 'veel', 'meer', 'heel', 'echt', 'gewoon', 'eigenlijk', 'dingen', 'kunnen', 'worden', 'hebben', 'wordt', 'gaat', 'doen', 'als', 'ook', 'nog', 'wel', 'dan', 'dat', 'die', 'het', 'een']),
};

// Count each vague word or phrase (multi-word phrases matched on tokens).
export function vagueWords(text, lang) {
  const toks = tokenize(text);
  const out = {};
  for (const phrase of VAGUE[lang] || []) {
    const p = phrase.split(' ');
    let n = 0;
    for (let i = 0; i + p.length <= toks.length; i++) if (p.every((w, k) => toks[i + k] === w)) n += 1;
    if (n) out[phrase] = n;
  }
  return out;
}

// Content words (4+ letters, not stop words) he used 3+ times, top 3.
export function repeatedWords(text, lang) {
  const stop = STOP[lang] || STOP.en;
  const counts = {};
  for (const w of tokenize(text)) if (w.length >= 4 && !stop.has(w)) counts[w] = (counts[w] || 0) + 1;
  return Object.entries(counts).filter(([, n]) => n >= 3)
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, 3);
}

// Per-filler rate per 100 words: last 14 days vs the 14 before, this language.
export function fillerTrend(history, now, lang) {
  const span = (from, to) => (history || []).filter((e) => e && e.metrics && e.lang === lang && now - e.ts >= from * DAY && now - e.ts < to * DAY);
  const rate = (entries) => {
    const words = entries.reduce((a, e) => a + (e.metrics.words || 0), 0);
    const per = {};
    for (const e of entries) for (const [w, n] of Object.entries(e.metrics.fillers || {})) per[w] = (per[w] || 0) + n;
    return { words, per };
  };
  const a = rate(span(0, 14));
  const b = rate(span(14, 28));
  const words = new Set([...Object.keys(a.per), ...Object.keys(b.per)]);
  return [...words].map((word) => {
    const nowR = a.words ? round1(((a.per[word] || 0) / a.words) * 100) : 0;
    const before = b.words ? round1(((b.per[word] || 0) / b.words) * 100) : 0;
    return { word, now: nowR, before, change: round1(nowR - before) };
  }).sort((x, y) => Math.abs(y.change) - Math.abs(x.change));
}

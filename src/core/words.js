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

// One concrete swap per vague word (shown on Progress).
export const SWAPS = {
  en: {
    thing: 'name the thing: “the planning board”', things: 'name them: “the three delays”', stuff: 'say what it is: “the spare parts”',
    'kind of': 'just drop it', 'sort of': 'just drop it', basically: 'just drop it',
    really: 'pick a stronger word: “crucial”', very: 'pick a stronger word: “urgent”',
  },
  nl: {
    ding: 'noem het ding: “het planbord”', dingen: 'noem ze: “de drie vertragingen”', eigenlijk: 'laat het weg', gewoon: 'laat het weg',
    'soort van': 'laat het weg', 'best wel': 'zeg hoeveel: “flink”', heel: 'kies een sterker woord: “cruciaal”', echt: 'kies een sterker woord: “dringend”',
  },
};

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Split the plain parts of highlightFillers() segments further: vague words
// of this language get {vague: true}. Filler segments stay as they are.
export function markVague(segs, lang) {
  const list = [...(VAGUE[lang] || [])].sort((a, b) => b.length - a.length);
  if (!list.length) return segs || [];
  const alts = list.map((p) => p.split(' ').map(esc).join('\\s+')).join('|');
  const re = new RegExp(`(?<![\\p{L}\\p{N}'’-])(?:${alts})(?![\\p{L}\\p{N}'’-])`, 'giu');
  const out = [];
  for (const s of segs || []) {
    if (s.filler) { out.push(s); continue; }
    let last = 0;
    for (const m of s.text.matchAll(re)) {
      if (m.index > last) out.push({ text: s.text.slice(last, m.index), filler: false });
      out.push({ text: m[0], filler: false, vague: true });
      last = m.index + m[0].length;
    }
    if (last < s.text.length) out.push({ text: s.text.slice(last), filler: false });
  }
  return out;
}

// For the Progress card: up to three filler movers (or current rates when
// there is no earlier fortnight) and the most-used vague word in the last
// 14 days, this language only. null when there is nothing to show.
export function wordsSummary(history, now, lang) {
  const inSpan = (e, from, to) => e && e.lang === lang && now - e.ts >= from * DAY && now - e.ts < to * DAY;
  const hasBefore = (history || []).some((e) => inSpan(e, 14, 28) && e.metrics && e.metrics.words > 0);
  const trend = fillerTrend(history, now, lang);
  const movers = hasBefore
    ? trend.filter((m) => m.change !== 0).slice(0, 3)
    : trend.filter((m) => m.now > 0).sort((a, b) => b.now - a.now).slice(0, 3);
  const counts = {};
  for (const e of (history || []).filter((x) => inSpan(x, 0, 14))) {
    for (const [w, n] of Object.entries(vagueWords(e.transcript, lang))) counts[w] = (counts[w] || 0) + n;
  }
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0];
  const vague = top ? { word: top[0], count: top[1] } : null;
  if (!movers.length && !vague) return null;
  return { movers, hasBefore, vague };
}

// Follow-up question check for the follow-up drill. Speech-to-text gives no
// question marks, so a question is a question word anywhere, a question-style
// verb as the first word, or a typed "?". Pure.
import { tokenize } from './metrics.js';

const QWORDS = {
  en: ['what', 'how', 'why', 'when', 'who', 'which', 'where', 'whats', 'hows'],
  nl: ['wat', 'hoe', 'waarom', 'wanneer', 'wie', 'welke', 'welk', 'waar', 'hoezo', 'waarheen'],
};
const LEAD_VERBS = {
  en: ['did', 'do', 'does', 'was', 'were', 'is', 'are', 'have', 'has', 'can', 'could', 'would', 'will'],
  nl: ['heb', 'hebben', 'heeft', 'ben', 'bent', 'zijn', 'was', 'waren', 'is', 'kun', 'kan', 'kunnen', 'ga', 'gaan', 'gaat', 'vond', 'vonden', 'vind', 'doe', 'doen', 'deed', 'deden', 'wil', 'wilde', 'moet', 'moest', 'zou'],
};

// "grotten" also matches "grot": compare on a stem of the detail word.
const stem = (w) => w.slice(0, Math.max(4, w.length - 2));

export function checkFollowUp(transcript, detail, lang) {
  const text = String(transcript || '');
  const toks = tokenize(text);
  const L = lang === 'nl' ? 'nl' : 'en';
  const asked = text.includes('?') || toks.some((w) => QWORDS[L].includes(w)) || LEAD_VERBS[L].includes(toks[0]);
  const usedDetail = (detail || []).some((d) => toks.some((w) => w.startsWith(stem(d.toLowerCase())) || d.toLowerCase().startsWith(w) && w.length >= 4));
  return { asked, usedDetail };
}

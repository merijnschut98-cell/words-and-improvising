// One hint for a quiz question, shown when he asks for it. Multiple choice:
// one clearly wrong option struck, plus the definition of a lesson term the
// question uses. Number: the first step of the working and the unit, never the
// answer. A question's own `hint` (from the content) wins. Pure.
import { linkTerms } from './course.js';

const wordsOf = (s) => new Set(String(s).toLowerCase().match(/[\p{L}\p{N}]+/gu) || []);
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function hash(s) {
  let x = 7;
  for (const c of String(s)) x = (x * 31 + c.codePointAt(0)) >>> 0;
  return x;
}

// How alike two options are: shared words over all words (0 to 1).
function overlap(a, b) {
  const A = wordsOf(a);
  const B = wordsOf(b);
  if (!A.size || !B.size) return 0;
  let n = 0;
  for (const w of A) if (B.has(w)) n += 1;
  return n / (A.size + B.size - n);
}

// Every number written in a text, read as both 1.234,5 and 1,234.5 (and a
// percentage as a fraction too), so neither style can slip the answer through.
function numbersIn(text) {
  const out = [];
  const re = /\d{1,3}(?:[   ]\d{3})+(?:[.,]\d+)?|\d+(?:[.,]\d+)*/g;
  for (const m of String(text).matchAll(re)) {
    const tok = m[0].replace(/[   ]/g, '');
    const dot = Number(tok.replace(/,/g, ''));
    const comma = Number(tok.replace(/\./g, '').replace(',', '.'));
    for (const v of [dot, comma]) {
      if (!Number.isFinite(v)) continue;
      out.push(v);
      if (String(text).slice(m.index + m[0].length).trimStart().startsWith('%')) out.push(v / 100);
    }
  }
  return out;
}

// Whether a text gives the answer away: the option's text, or the number
// within the question's tolerance.
export function containsAnswer(question, text) {
  if (!question || text == null) return false;
  if ('number' in question) {
    const tol = Math.max(question.tolerance || 0, 1e-9);
    return numbersIn(text).some((v) => Math.abs(v - question.number) <= tol + 1e-9);
  }
  const ans = String(question.answer || '').trim();
  if (!ans) return false;
  return new RegExp(`(?<![\\p{L}\\p{N}])${escapeRe(ans)}(?![\\p{L}\\p{N}])`, 'iu').test(String(text));
}

// The first step of the working, from the explanation: the first clause with a
// number or a sum in it. A chain of sums, or one that ends in the answer, is
// cut back to its formula: everything up to the first part with a number or an
// operator in it, then "= ?".
function firstStep(question) {
  const clauses = String(question.why || '').split(/;\s+|[.!?]\s+|\n+/).map((s) => s.trim().replace(/[.;:]$/, '')).filter(Boolean);
  const step = clauses.find((c) => /\d|=/.test(c));
  if (!step) return null;
  const parts = step.split('=').map((s) => s.trim());
  if (parts.length <= 2 && !containsAnswer(question, step)) return step;
  if (parts.length > 1) {
    const k = parts.findIndex((p) => /[\d×·*+−\-/÷]/.test(p));
    const keep = k < 0 || k >= parts.length - 1 ? parts.length - 1 : k + 1;
    const sum = `${parts.slice(0, keep).join(' = ')} = ?`;
    if (keep > 0 && /[\p{L}\p{N}]/u.test(sum) && !containsAnswer(question, sum)) return sum;
  }
  return null;
}

// The lesson term the question is about, if its definition doesn't name the answer.
function termFor(question, terms) {
  const hit = linkTerms(question.q, terms || []).find((x) => x.term);
  if (!hit || containsAnswer(question, hit.def) || containsAnswer(question, hit.term)) return null;
  return { term: hit.term, def: hit.def };
}

export function questionHint(question, terms = []) {
  if (!question) return null;
  if (typeof question.hint === 'string' && question.hint.trim()) return { kind: 'own', text: question.hint.trim() };
  if ('number' in question) {
    const step = firstStep(question);
    return { kind: 'number', step, unit: question.unit ? question.unit : null, term: step ? null : termFor(question, terms) };
  }
  const wrong = (question.options || []).filter((o) => o !== question.answer);
  if (!wrong.length) return null;
  const seed = question.id || question.q;
  const strike = wrong
    .map((o) => ({ o, sim: overlap(o, question.answer), tie: hash(`${seed}|${o}`) }))
    .sort((a, b) => a.sim - b.sim || a.tie - b.tie)[0].o;
  return { kind: 'choice', strike, term: termFor(question, terms) };
}

// The question kinds (v18): what a question is, how an answer to it is judged
// and how it reads in a review. mc and num are the original two; best has the
// shape of mc; all, gap, order and match are new. A question without `kind` is
// mc, or num when it has `number`. Pure.

export const KINDS = ['mc', 'num', 'best', 'all', 'gap', 'order', 'match'];

// Decision Q10 (open with Merijn): how a select-all answer counts for
// progress. 'full' = only a fully right answer counts (the review still shows
// how many were right); 'partial' = one wrong tick or one missing still counts.
// One line to change.
export const SELECT_ALL_PROGRESS = 'full';

// A typo (edit distance 1) is accepted in a gap answer of this many letters or more.
export const TYPO_MIN_LETTERS = 6;

export function kindOf(q) {
  if (!q) return 'mc';
  if (typeof q.kind === 'string') return q.kind;
  return 'number' in q ? 'num' : 'mc';
}

// A kind that is a choice between four options with one key.
export const isChoice = (q) => ['mc', 'best'].includes(kindOf(q));

// lower case, diacritics folded, ligatures split (the Dutch ĳ is ij),
// punctuation dropped, spaces collapsed
export function normalizeWord(s) {
  return String(s ?? '')
    .normalize('NFKD').replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function editDistance(a, b) {
  const A = [...a];
  const B = [...b];
  let prev = Array.from({ length: B.length + 1 }, (_, j) => j);
  for (let i = 1; i <= A.length; i++) {
    const cur = [i];
    for (let j = 1; j <= B.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (A[i - 1] === B[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[B.length];
}

// The key a gap answer is compared on: normalised, without spaces, so
// "kritieke-pad", "kritieke pad" and "kritiekepad" are the same answer. A space
// between two digits stays: "1,5" is not "15".
export const gapKey = (s) => normalizeWord(s).replace(/(?<!\p{N}) | (?!\p{N})/gu, '');

// One typo (edit distance 1) is accepted from TYPO_MIN_LETTERS letters on, and
// never in a word with a digit: 100000 and 100001 are different answers.
export function typoOk(accepted, said) {
  if (/\p{N}/u.test(accepted) || /\p{N}/u.test(said)) return false;
  return [...accepted].filter((c) => /\p{L}/u.test(c)).length >= TYPO_MIN_LETTERS && editDistance(accepted, said) <= 1;
}

function hash(s) {
  let x = 7;
  for (const c of String(s)) x = (x * 31 + c.codePointAt(0)) >>> 0;
  return x;
}

// A stable shuffle (same seed, same order), never the input order itself when
// there is more than one item, so a puzzle is never shown already solved.
export function shuffled(items, seed = '') {
  const list = items.map((v, i) => ({ v, i, k: hash(`${seed}|${i}|${v}`) })).sort((a, b) => a.k - b.k || a.i - b.i);
  const out = list.map((x) => x.v);
  if (out.length > 1 && out.every((v, i) => v === items[i])) out.push(out.shift());
  return out;
}

export const asPairs = (v) => {
  if (Array.isArray(v)) return new Map(v.filter((p) => Array.isArray(p)).map(([l, r]) => [l, r]));
  if (v && typeof v === 'object') return new Map(Object.entries(v));
  return new Map();
};

// The detail of one answer. Always has ok (does it count for progress).
//  all:   right (ticked and correct), wrong (ticked, not correct), missed, total
//  gap:   spelled (the accepted word he matched), typo (true when spelled differently)
//  order: wrongAt (positions that hold the wrong item)
//  match: wrongLeft (left items paired wrongly or not at all)
export function grade(q, answer) {
  const kind = kindOf(q);
  if (!q) return { kind, ok: false };
  if (kind === 'num') {
    const s = String(answer ?? '').trim().replace(',', '.');
    const n = Number(s);
    return { kind, ok: !!s && Number.isFinite(n) && Math.abs(n - q.number) <= q.tolerance + 1e-9 };
  }
  if (kind === 'all') {
    const picked = new Set(Array.isArray(answer) ? answer : []);
    const keys = new Set(q.answers || []);
    const right = [...picked].filter((o) => keys.has(o)).length;
    const wrong = picked.size - right;
    const missed = keys.size - right;
    const exact = wrong === 0 && missed === 0;
    const ok = SELECT_ALL_PROGRESS === 'partial' ? right > 0 && wrong + missed <= 1 : exact;
    return { kind, ok, exact, right, wrong, missed, total: keys.size };
  }
  if (kind === 'gap') {
    const said = gapKey(answer);
    const accept = q.accept || [];
    if (!said) return { kind, ok: false, typo: false, spelled: null };
    const exact = accept.find((a) => gapKey(a) === said);
    if (exact) return { kind, ok: true, typo: false, spelled: exact };
    // A word bank is picked, not typed: no typo allowance, or a near
    // distractor (variatie / variantie) would count as right.
    const near = q.choices ? null : accept.find((a) => typoOk(gapKey(a), said));
    return near ? { kind, ok: true, typo: true, spelled: near } : { kind, ok: false, typo: false, spelled: null };
  }
  if (kind === 'order') {
    const v = Array.isArray(answer) ? answer : [];
    const wrongAt = q.items.map((it, i) => (v[i] === it ? -1 : i)).filter((i) => i >= 0);
    return { kind, ok: wrongAt.length === 0 && v.length === q.items.length, wrongAt };
  }
  if (kind === 'match') {
    const m = asPairs(answer);
    const wrongLeft = q.pairs.filter(([l, r]) => m.get(l) !== r).map(([l]) => l);
    return { kind, ok: wrongLeft.length === 0, wrongLeft };
  }
  return { kind, ok: answer === q.answer };
}

export const judge = (q, answer) => grade(q, answer).ok;

// The right answer as one line of text, for a review.
export function answerText(q) {
  switch (kindOf(q)) {
    case 'num': return `${String(q.number)}${q.unit ? ` ${q.unit}` : ''}`;
    case 'all': return (q.answers || []).join(' · ');
    case 'gap': return q.text.replace('___', q.accept[0]);
    case 'order': return q.items.map((x, i) => `${i + 1}. ${x}`).join(' ');
    case 'match': return q.pairs.map(([l, r]) => `${l} → ${r}`).join(' · ');
    default: return q.answer;
  }
}

// What he answered, as one line of text. null when there is nothing to show.
export function valueText(q, v) {
  if (v == null) return null;
  switch (kindOf(q)) {
    case 'num': return `${v}${q.unit ? ` ${q.unit}` : ''}`;
    case 'all': return Array.isArray(v) && v.length ? v.join(' · ') : '—';
    case 'gap': return String(v);
    case 'order': return Array.isArray(v) ? v.map((x, i) => `${i + 1}. ${x}`).join(' ') : null;
    case 'match': return [...asPairs(v)].map(([l, r]) => `${l} → ${r}`).join(' · ');
    default: return String(v);
  }
}

// ---- The pure parts of the renderers (src/ui/quiz.js draws them) ----

// Select all: tick or untick one option; the answer keeps the question's option order.
export function toggleOption(options, picked, option) {
  const on = new Set(picked);
  if (on.has(option)) on.delete(option);
  else on.add(option);
  return options.filter((o) => on.has(o));
}

// Put in order, tap to place. placed is the list of items in the slots so far;
// `locked` slots at the start (the hint's) cannot be taken back.
export function orderPlace(placed, item, total) {
  if (placed.includes(item) || placed.length >= total) return placed;
  return [...placed, item];
}
export function orderTake(placed, index, locked = 0) {
  if (index < locked || index >= placed.length) return placed;
  return placed.filter((_, i) => i !== index);
}
export function orderLockFirst(placed, first) {
  return [first, ...placed.filter((x) => x !== first)];
}

// Match pairs, tap left then right. state = { pairs: [[l, r]...], left: null | string, locked: number }
// where the first `locked` pairs are the hint's. A tap on a paired item undoes
// that pair (unless locked); a tap on a left item selects it; a tap on a free
// right item with a left one selected makes the pair.
export const matchStart = () => ({ pairs: [], left: null, locked: 0 });
export function matchTap(state, side, value) {
  const at = state.pairs.findIndex((p) => p[side === 'left' ? 0 : 1] === value);
  if (at >= 0) {
    if (at < state.locked) return state;
    return { ...state, pairs: state.pairs.filter((_, i) => i !== at), left: null };
  }
  if (side === 'left') return { ...state, left: state.left === value ? null : value };
  if (state.left == null) return state;
  return { ...state, pairs: [...state.pairs, [state.left, value]], left: null };
}
export function matchLockPair(state, left, right) {
  const rest = state.pairs.slice(state.locked).filter((p) => p[0] !== left && p[1] !== right);
  return { pairs: [[left, right], ...state.pairs.slice(0, state.locked).filter((p) => p[0] !== left), ...rest], left: null, locked: state.locked + 1 };
}

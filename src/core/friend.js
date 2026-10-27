// Friend rating without a backend: a link carries only the prompt id and a
// nonce; the friend's answer link carries only the nonce, three 1–5 scores and
// one short line. No recording or transcript ever leaves the phone.
import { parseChallenge } from './share.js';

const NONCE_RE = /^[a-z0-9]{6,10}$/;
const SCORE_RE = /^[1-5]$/;
const B64_RE = /^[A-Za-z0-9_-]*$/;
export const LINE_MAX = 140;
const B64_MAX = Math.ceil((LINE_MAX * 4 * 4) / 3); // 140 characters of up to 4 UTF-8 bytes each
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

export function newNonce(rand = Math.random) {
  let s = '';
  for (let i = 0; i < 8; i += 1) s += ALPHABET[Math.floor(rand() * ALPHABET.length) % ALPHABET.length];
  return s;
}

function cleanUrl(base, key, value) {
  const url = new URL(base);
  url.search = '';
  url.hash = '';
  url.searchParams.set(key, value);
  return url.toString();
}

export function rateLink(prompt, lang, base, nonce) {
  if (!NONCE_RE.test(nonce)) throw new Error('bad nonce');
  return cleanUrl(base, 'r', `${prompt.drill}.${prompt.id}.${lang}.${nonce}`);
}

export function parseRateLink(search) {
  const raw = new URLSearchParams(search || '').get('r');
  if (!raw) return null;
  const parts = raw.split('.');
  if (parts.length !== 4 || !NONCE_RE.test(parts[3])) return null;
  // Same drill / prompt id / language rules as a challenge link.
  const ch = parseChallenge(`?${new URLSearchParams({ c: parts.slice(0, 3).join('.') })}`);
  return ch && { ...ch, nonce: parts[3] };
}

// One line, no control characters, at most LINE_MAX characters (code points).
export function cleanLine(line) {
  const one = String(line ?? '').replace(/[\u0000-\u001f\u007f\s]+/g, ' ').trim();
  return Array.from(one).slice(0, LINE_MAX).join('').trim();
}

function toB64url(text) {
  let bin = '';
  for (const b of new TextEncoder().encode(text)) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(s) {
  if (!B64_RE.test(s) || s.length > B64_MAX || s.length % 4 === 1) return null;
  try {
    const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

const validScore = (n) => Number.isInteger(n) && n >= 1 && n <= 5;

export function answerLink(base, { nonce, clear, structured, confident, line = '' }) {
  if (!NONCE_RE.test(nonce)) throw new Error('bad nonce');
  if (![clear, structured, confident].every(validScore)) throw new Error('bad score');
  return cleanUrl(base, 'rr', `${nonce}.${clear}.${structured}.${confident}.${toB64url(cleanLine(line))}`);
}

export function parseAnswer(search) {
  const raw = new URLSearchParams(search || '').get('rr');
  if (!raw) return null;
  const parts = raw.split('.');
  if (parts.length !== 5) return null;
  const [nonce, c, s, f, enc] = parts;
  if (!NONCE_RE.test(nonce) || ![c, s, f].every((x) => SCORE_RE.test(x))) return null;
  const decoded = fromB64url(enc);
  if (decoded == null || Array.from(decoded).length > LINE_MAX) return null;
  return { nonce, clear: Number(c), structured: Number(s), confident: Number(f), line: cleanLine(decoded) };
}

const own = (o, k) => o !== null && typeof o === 'object' && Object.hasOwn(o, k);

// Remembers that this phone asked a friend about this prompt.
export function askFriend(state, prompt, nonce, ts) {
  return { ...state, friendAsks: { ...(state.friendAsks || {}), [nonce]: { promptId: prompt.id, drill: prompt.drill, ts } } };
}

// Stores a friend's answer; an answer to a request this phone never made is ignored (same state back).
export function addFriendRating(state, answer, ts) {
  if (!answer || !own(state.friendAsks, answer.nonce)) return state;
  const { clear, structured, confident, line } = answer;
  return { ...state, friendRatings: { ...(state.friendRatings || {}), [answer.nonce]: { clear, structured, confident, line, ts } } };
}

const round1 = (x) => Math.round(x * 10) / 10;

export function friendAverages(state) {
  const all = Object.values((state && state.friendRatings) || {})
    .filter((r) => r && validScore(r.clear) && validScore(r.structured) && validScore(r.confident));
  if (!all.length) return null;
  const mean = (k) => round1(all.reduce((a, r) => a + r[k], 0) / all.length);
  return { n: all.length, clear: mean('clear'), structured: mean('structured'), confident: mean('confident') };
}

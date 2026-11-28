import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rateLink, parseRateLink, answerLink, parseAnswer, askFriend, addFriendRating, friendAverages, newNonce } from '../src/core/friend.js';
import { defaultState } from '../src/core/storage.js';

const BASE = 'https://example.org/app/?c=old#x';
const search = (url) => new URL(url).search;

test('rate link round-trips drill, prompt id, language and nonce', () => {
  const url = rateLink({ drill: 'prep', id: 'opinion:o07' }, 'nl', BASE, 'abc123');
  assert.ok(url.startsWith('https://example.org/app/?r='));
  assert.ok(!url.includes('c=old') && !url.includes('#'));
  assert.deepEqual(parseRateLink(search(url)), { drill: 'prep', promptId: 'opinion:o07', lang: 'nl', nonce: 'abc123' });
});

test('malformed rate links are rejected', () => {
  for (const q of ['', '?x=1', '?r=', '?r=prep.opinion:o07.nl', '?r=nope.opinion:o07.nl.abc123', '?r=prep.opinion:o07.fr.abc123',
    '?r=prep.<script>.nl.abc123', '?r=prep.opinion:o07.nl.abc', '?r=prep.opinion:o07.nl.abcdefghijk', '?r=prep.opinion:o07.nl.ABC123',
    '?r=prep.opinion:o07.nl.abc-12', '?r=prep.opinion:o07.nl.abc123.x', '?c=prep.opinion:o07.nl']) {
    assert.equal(parseRateLink(q), null, q);
  }
});

test('newNonce gives 8 chars of [a-z0-9]', () => {
  assert.match(newNonce(), /^[a-z0-9]{8}$/);
  assert.equal(newNonce(() => 0), 'aaaaaaaa');
});

test('answer link round-trips scores and a UTF-8 line', () => {
  const line = 'Duidelijk! Maar “ehm” × 3 — 😅 <b>ok</b>';
  const url = answerLink(BASE, { nonce: 'abc123', clear: 4, structured: 2, confident: 5, line });
  assert.ok(url.startsWith('https://example.org/app/?rr='));
  assert.match(new URL(url).searchParams.get('rr'), /^abc123\.4\.2\.5\.[A-Za-z0-9_-]+$/);
  assert.deepEqual(parseAnswer(search(url)), { nonce: 'abc123', clear: 4, structured: 2, confident: 5, line });
});

test('answer line is trimmed, one line and capped at 140 characters', () => {
  const long = `  ${'é'.repeat(200)}  `;
  const p = parseAnswer(search(answerLink(BASE, { nonce: 'abc123', clear: 1, structured: 1, confident: 1, line: long })));
  assert.equal(p.line, 'é'.repeat(140));
  const multi = parseAnswer(search(answerLink(BASE, { nonce: 'abc123', clear: 3, structured: 3, confident: 3, line: ' a\nb\t c ' })));
  assert.equal(multi.line, 'a b c');
  const empty = parseAnswer(search(answerLink(BASE, { nonce: 'abc123', clear: 3, structured: 3, confident: 3 })));
  assert.equal(empty.line, '');
});

test('answerLink refuses out-of-range scores or a bad nonce', () => {
  assert.throws(() => answerLink(BASE, { nonce: 'abc123', clear: 6, structured: 1, confident: 1 }));
  assert.throws(() => answerLink(BASE, { nonce: 'abc123', clear: 1.5, structured: 1, confident: 1 }));
  assert.throws(() => answerLink(BASE, { nonce: 'x', clear: 1, structured: 1, confident: 1 }));
});

test('an answer with an empty line parses', () => {
  assert.deepEqual(parseAnswer('?rr=abc123.4.2.5.'), { nonce: 'abc123', clear: 4, structured: 2, confident: 5, line: '' });
});

test('malformed or out-of-range answers are rejected', () => {
  const b64 = (s) => Buffer.from(s, 'utf8').toString('base64url');
  for (const q of ['', '?rr=', '?rr=abc123.4.2.5', '?rr=abc123.4.2.5.x.y', '?rr=abc123.0.2.5.', '?rr=abc123.6.2.5.',
    '?rr=abc123.4.2.5a.', '?rr=abc123.4.2.05.', '?rr=abc123.4.-2.5.', '?rr=ab.4.2.5.', '?rr=ABC123.4.2.5.',
    '?rr=abc123.4.2.5.%3Cscript%3E', '?rr=abc123.4.2.5.a+b', '?rr=abc123.4.2.5.////', '?rr=abc123.4.2.5.a',
    `?rr=abc123.4.2.5.${b64('x'.repeat(141))}`, `?rr=abc123.4.2.5.${Buffer.from([0xff, 0xfe]).toString('base64url')}`,
    `?rr=abc123.4.2.5.${b64('a')}=`, `?rr=abc123.4.2.5.${'A'.repeat(5000)}`]) {
    assert.equal(parseAnswer(q), null, q);
  }
});

test('a rating is stored only for a nonce this phone asked for', () => {
  let s = askFriend(defaultState(), { drill: 'prep', id: 'opinion:o07' }, 'abc123', 1000);
  assert.deepEqual(s.friendAsks.abc123, { promptId: 'opinion:o07', drill: 'prep', ts: 1000 });
  const ans = { nonce: 'abc123', clear: 4, structured: 2, confident: 5, line: 'nice' };
  const unknown = addFriendRating(s, { ...ans, nonce: 'zzz999' }, 2000);
  assert.equal(unknown, s);
  s = addFriendRating(s, ans, 2000);
  assert.deepEqual(s.friendRatings.abc123, { clear: 4, structured: 2, confident: 5, line: 'nice', ts: 2000 });
});

test('friendAverages: null without ratings, else one-decimal means', () => {
  assert.equal(friendAverages(defaultState()), null);
  assert.equal(friendAverages({}), null);
  let s = askFriend(defaultState(), { drill: 'prep', id: 'opinion:o07' }, 'aaa111', 1);
  s = askFriend(s, { drill: 'minute', id: 'topic:t01' }, 'bbb222', 2);
  s = addFriendRating(s, { nonce: 'aaa111', clear: 4, structured: 2, confident: 5, line: '' }, 3);
  s = addFriendRating(s, { nonce: 'bbb222', clear: 5, structured: 3, confident: 4, line: '' }, 4);
  assert.deepEqual(friendAverages(s), { n: 2, clear: 4.5, structured: 2.5, confident: 4.5 });
});

test('asking a friend prunes asks older than 30 days', () => {
  const DAY = 86400000, now = 100 * DAY;
  const s = { ...defaultState(), friendAsks: { old: { promptId: 'x', drill: 'minute', ts: now - 31 * DAY }, fresh: { promptId: 'y', drill: 'minute', ts: now - 2 * DAY } } };
  const next = askFriend(s, { id: 'z', drill: 'minute' }, 'new', now);
  assert.deepEqual(Object.keys(next.friendAsks).sort(), ['fresh', 'new']);
});

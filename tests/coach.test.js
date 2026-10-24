import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCoachRequest, parseCoachResponse, runCoach, COACH_SCHEMA } from '../src/core/coach.js';

const args = {
  drill: 'explain',
  prompt: { body: 'Takt time', extra: { audience: 'a 10-year-old' } },
  transcript: 'Um so takt time is basically the rhythm of the customer.',
  lang: 'en',
  durationS: 42,
  metrics: { words: 11, wpm: 16, fillerCount: 2, fillerRate: 2.9, fillers: { um: 1, so: 1 } },
};

const good = {
  scores: { clarity: 4, structure: 3, fluency: 3, vocabulary: 4 },
  overall: 4,
  strength: 'Clear analogy.',
  improvement: 'Start with the point.',
  stronger_version: 'Takt time is the heartbeat of the customer...',
};

test('request carries model, fallbacks, schema and transcript', () => {
  const r = buildCoachRequest({ ...args, model: 'claude-opus-5-5' });
  assert.equal(r.model, 'claude-opus-5-5');
  assert.deepEqual(r.betas, ['server-side-fallback-2026-07-01']);
  assert.equal(r.fallbacks, 'default');
  assert.equal(r.output_config.effort, 'low');
  assert.deepEqual(r.output_config.format, { type: 'json_schema', schema: COACH_SCHEMA });
  const user = r.messages[0].content;
  assert.match(user, /rhythm of the customer/);
  assert.match(user, /a 10-year-old/);
  assert.match(r.system, /English/);
});

test('haiku gets no fallbacks (unsupported)', () => {
  const r = buildCoachRequest({ ...args, model: 'claude-haiku-5-5' });
  assert.equal(r.fallbacks, undefined);
  assert.equal(r.betas, undefined);
});

test('dutch request asks for Dutch feedback', () => {
  assert.match(buildCoachRequest({ ...args, lang: 'nl', model: 'claude-opus-5-5' }).system, /Dutch/);
});

test('schema forbids extra properties everywhere', () => {
  assert.equal(COACH_SCHEMA.additionalProperties, false);
  assert.equal(COACH_SCHEMA.properties.scores.additionalProperties, false);
  assert.deepEqual([...COACH_SCHEMA.required].sort(), Object.keys(COACH_SCHEMA.properties).sort());
});

test('parse valid response (last text block wins)', () => {
  const msg = { stop_reason: 'end_turn', content: [{ type: 'thinking', thinking: '' }, { type: 'text', text: JSON.stringify(good) }] };
  assert.deepEqual(parseCoachResponse(msg), { ok: true, data: good });
});

test('parse refusal', () => {
  const r = parseCoachResponse({ stop_reason: 'refusal', content: [] });
  assert.equal(r.ok, false);
});

test('parse garbage', () => {
  assert.equal(parseCoachResponse({ stop_reason: 'end_turn', content: [{ type: 'text', text: 'nope' }] }).ok, false);
  assert.equal(parseCoachResponse({ stop_reason: 'end_turn', content: [] }).ok, false);
});

function fakeSdk(behaviour) {
  class APIError extends Error {}
  class AuthenticationError extends APIError {}
  class RateLimitError extends APIError {}
  class APIConnectionError extends APIError {}
  class Anthropic {
    constructor(opts) { this.opts = opts; this.beta = { messages: { create: behaviour } }; }
  }
  Object.assign(Anthropic, { APIError, AuthenticationError, RateLimitError, APIConnectionError });
  return { default: Anthropic };
}

test('runCoach success', async () => {
  const sdk = fakeSdk(async () => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(good) }] }));
  const r = await runCoach('sk-test', { ...args, model: 'claude-opus-5-5' }, async () => sdk);
  assert.deepEqual(r, { ok: true, data: good });
});

test('runCoach maps auth error to key message', async () => {
  let sdk;
  sdk = fakeSdk(async () => { throw new sdk.default.AuthenticationError('401'); });
  const r = await runCoach('bad', { ...args, model: 'claude-opus-5-5' }, async () => sdk);
  assert.equal(r.ok, false);
  assert.equal(r.error, 'key');
});

test('runCoach without key', async () => {
  const r = await runCoach('', args, async () => { throw new Error('should not load'); });
  assert.deepEqual(r, { ok: false, error: 'nokey' });
});

test('runCoach when sdk cannot load', async () => {
  const r = await runCoach('sk', args, async () => { throw new TypeError('Failed to fetch'); });
  assert.deepEqual(r, { ok: false, error: 'offline' });
});

test('parse truncated response', () => {
  assert.equal(parseCoachResponse({ stop_reason: 'max_tokens', content: [{ type: 'text', text: '{"scores":' }] }).ok, false);
});

test('live conversation: coach sees the full dialogue', () => {
  const r = buildCoachRequest({
    ...args,
    drill: 'smalltalk',
    model: 'claude-opus-5-5',
    prompt: { body: 'Busy week?', extra: { setting: 'Coffee machine', dialogue: [
      { role: 'partner', text: 'Busy week?' },
      { role: 'user', text: 'Yes, workshops.' },
      { role: 'partner', text: 'What kind?' },
    ] } },
  });
  const user = r.messages[0].content;
  assert.match(user, /Them: Busy week\?/);
  assert.match(user, /Him: Yes, workshops\./);
  assert.match(user, /Them: What kind\?/);
  assert.match(user, /listen/i);
});

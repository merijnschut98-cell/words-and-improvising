import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCoachRequest, parseCoachResponse, runCoach, COACH_SCHEMA, suspectNumbers } from '../src/core/coach.js';

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
  misheard: [],
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

test('spoken-cue drills give the coach their brief and the spoken lines', () => {
  const base = { transcript: 'yes and we', lang: 'en', durationS: 30, metrics: { words: 3 }, model: 'm' };
  const ya = JSON.stringify(buildCoachRequest({ ...base, drill: 'yesAnd', prompt: { body: 'A', extra: { cues: ['A', 'B', 'C'] } } }));
  assert.match(ya, /Yes, and/);
  assert.match(ya, /3\. C/);
  const li = JSON.stringify(buildCoachRequest({ ...base, drill: 'listen', prompt: { body: 'Q?', extra: { statement: 'S.', question: 'Q?' } } }));
  assert.match(li, /Statement heard: S\./);
  const ex = JSON.stringify(buildCoachRequest({ ...base, drill: 'expert', prompt: { body: 'sock logistics', extra: { cues: ['Why?'] } } }));
  assert.match(ex, /sock logistics/);
  assert.match(ex, /1\. Why\?/);
});

test('frame drill tells the coach which frame to judge', () => {
  const req = JSON.stringify(buildCoachRequest({ transcript: 'x', lang: 'en', durationS: 30, metrics: { words: 3 }, model: 'm', drill: 'frame', prompt: { body: 'Tell about a time…', extra: { frame: 'star' } } }));
  assert.match(req, /Frame to follow: STAR \(Situation, Task, Action, Result\)/);
});

test('coach scores are anchored to a rubric at 1, 3 and 5 for every axis', () => {
  const req = JSON.stringify(buildCoachRequest({ transcript: 'x', lang: 'nl', durationS: 30, metrics: { words: 3 }, model: 'm', drill: 'minute', prompt: { body: 'X', extra: {} } }));
  for (const axis of ['Clarity', 'Structure', 'Fluency', 'Vocabulary']) {
    for (const n of [1, 3, 5]) assert.match(req, new RegExp(`${axis} ${n} =`), `${axis} ${n}`);
  }
});

test('captain scenarios tell the coach the constraint', () => {
  const req = JSON.stringify(buildCoachRequest({ transcript: 'x', lang: 'en', durationS: 30, metrics: { words: 3 }, model: 'm', drill: 'real', prompt: { body: 'Your striker…', extra: { kind: 'captain', constraint: 'sbi' } } }));
  assert.match(req, /Situation, Behaviour, Impact/);
  assert.match(req, /assertive/);
});

test('rehearsal rounds never send his event text to the coach', () => {
  const req = JSON.stringify(buildCoachRequest({ transcript: 'x', lang: 'en', durationS: 30, metrics: { words: 3 }, model: 'm', drill: 'minute',
    prompt: { body: 'Your 60-second version: SECRET kick-off with Philips', eventId: 'e1', focus: 'The 60-second version: what is it about and what do you want?', extra: {} } }));
  assert.ok(!req.includes('SECRET'));
  assert.match(req, /60-second version/);
});

test('story3 frame is described to the coach', () => {
  const req = JSON.stringify(buildCoachRequest({ transcript: 'x', lang: 'en', durationS: 30, metrics: { words: 3 }, model: 'm', drill: 'frame', prompt: { body: 'How was your weekend?', extra: { frame: 'story3' } } }));
  assert.match(req, /Hook, Detail, Question back/);
});

test('a course say-it round tells the coach the lesson terms', () => {
  const prompt = { id: 'course:eng.flow.oee', drill: 'explain', body: 'Explain OEE to a new operator.', extra: { course: { subject: 'eng', lessonId: 'eng.flow.oee', terms: ['OEE', 'Micro-stop'] } }, seenIds: [] };
  const r = buildCoachRequest({ drill: 'explain', prompt, transcript: 'OEE is ...', lang: 'nl', durationS: 50, metrics: { words: 100, wpm: 120, fillerCount: 1, fillerRate: 1 }, model: 'claude-opus-5-5' });
  const user = r.messages[0].content;
  assert.match(user, /OEE, Micro-stop/);
  assert.match(user, /Explain OEE to a new operator\./);
});

// The API refuses numeric and length bounds in structured-output schemas
// ("For 'integer' type, properties maximum, minimum are not supported").
const UNSUPPORTED = ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum', 'multipleOf', 'minLength', 'maxLength', 'minItems', 'maxItems'];
const walk = (node, hits = []) => {
  if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) { if (UNSUPPORTED.includes(k)) hits.push(k); walk(v, hits); }
  return hits;
};

test('the coach schema uses no bounds the API refuses', () => {
  assert.deepEqual(walk(COACH_SCHEMA), []);
});

test('coach scores outside 1–5 are clamped and rounded after parsing', () => {
  const msg = { content: [{ type: 'text', text: JSON.stringify({ scores: { clarity: 7, structure: 0, fluency: 3.6, vocabulary: 4 }, overall: 9, strength: 's', improvement: 'i', stronger_version: 'v' }) }] };
  const r = parseCoachResponse(msg);
  assert.equal(r.ok, true);
  assert.deepEqual(r.data.scores, { clarity: 5, structure: 1, fluency: 4, vocabulary: 4 });
  assert.equal(r.data.overall, 5);
});

// Speech recognition mishears: the coach must judge what he most likely said.
test('the coach is told the transcript is speech recognition that can mishear words, numbers and names', () => {
  const r = buildCoachRequest({ ...args, model: 'm' });
  assert.match(r.system, /automatic speech.recognition/i);
  assert.match(r.system, /misheard/i);
  assert.match(r.system, /numbers/i);
  assert.match(r.system, /names/i);
  assert.match(r.system, /do not penali[sz]e/i);
  assert.match(r.system, /most likely said/i);
  assert.match(r.system, /misheard.*best guess|best guess.*misheard/i);
});

test('the schema asks for misheard fragments as heard/likely pairs, required, no bounds', () => {
  const m = COACH_SCHEMA.properties.misheard;
  assert.equal(m.type, 'array');
  assert.equal(m.items.type, 'object');
  assert.equal(m.items.additionalProperties, false);
  assert.deepEqual([...m.items.required].sort(), ['heard', 'likely']);
  assert.equal(m.items.properties.heard.type, 'string');
  assert.equal(m.items.properties.likely.type, 'string');
  assert.ok(COACH_SCHEMA.required.includes('misheard'));
  assert.deepEqual(walk(m), []);
});

test('missing or invalid misheard parses to an empty list; valid pairs are kept and cleaned', () => {
  const base = { scores: good.scores, overall: 4, strength: 's', improvement: 'i', stronger_version: 'v' };
  const parse = (extra) => parseCoachResponse({ content: [{ type: 'text', text: JSON.stringify({ ...base, ...extra }) }] }).data.misheard;
  assert.deepEqual(parse({}), []);
  assert.deepEqual(parse({ misheard: 'nope' }), []);
  assert.deepEqual(parse({ misheard: null }), []);
  assert.deepEqual(parse({ misheard: [null, 3, { heard: 'x' }, { heard: '', likely: 'y' }, { heard: ' 81 ', likely: ' Eén ' }, { heard: 'a', likely: 'a' }] }), [{ heard: '81', likely: 'Eén' }]);
  const many = Array.from({ length: 12 }, (_, i) => ({ heard: `h${i}`, likely: `l${i}` }));
  assert.equal(parse({ misheard: many }).length, 8);
});

test('a transcript the user corrected by hand is marked as such for the coach', () => {
  const r = buildCoachRequest({ ...args, model: 'm', corrected: true });
  assert.match(r.messages[0].content, /corrected the transcript by hand/i);
  assert.doesNotMatch(buildCoachRequest({ ...args, model: 'm' }).messages[0].content, /corrected the transcript by hand/i);
});

test('numbers in the transcript that the task never mentions are flagged as likely mishearings', () => {
  assert.deepEqual(suspectNumbers('ik denk 81 dat het goed is', 'Leg takt tijd uit'), ['81']);
  assert.deepEqual(suspectNumbers('de OEE was 61%', 'De OEE staat op 61%'), []);
  assert.deepEqual(suspectNumbers('geen getallen hier', 'Prompt'), []);
  assert.deepEqual(suspectNumbers('81 en nog eens 81 en 3', 'x'), ['81', '3']);
  const r = buildCoachRequest({ ...args, transcript: 'takt time is 81 the rhythm', model: 'm' });
  assert.match(r.messages[0].content, /Numbers in the transcript that the task does not mention.*81/);
  assert.doesNotMatch(buildCoachRequest({ ...args, model: 'm' }).messages[0].content, /Numbers in the transcript/);
  // A hand-corrected transcript is trusted: no number hint.
  assert.doesNotMatch(buildCoachRequest({ ...args, transcript: 'takt time is 81 the rhythm', model: 'm', corrected: true }).messages[0].content, /Numbers in the transcript/);
});

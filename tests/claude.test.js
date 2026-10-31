import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkKey, callClaude } from '../src/core/claude.js';

function fakeSdk({ retrieve, create }) {
  class APIError extends Error {}
  class Anthropic {
    constructor(opts) { this.opts = opts; this.models = { retrieve }; this.beta = { messages: { create } }; }
  }
  Object.assign(Anthropic, {
    APIError,
    AuthenticationError: class extends APIError {},
    PermissionDeniedError: class extends APIError {},
    NotFoundError: class extends APIError {},
    RateLimitError: class extends APIError {},
    BadRequestError: class extends APIError {},
    APIConnectionError: class extends APIError {},
  });
  return { default: Anthropic };
}

test('checkKey ok retrieves the configured model', async () => {
  let asked;
  const sdk = fakeSdk({ retrieve: async (m) => { asked = m; return { id: m }; } });
  assert.deepEqual(await checkKey('sk', 'claude-haiku-5-5', async () => sdk), { ok: true });
  assert.equal(asked, 'claude-haiku-5-5');
});

test('checkKey maps errors', async () => {
  let sdk;
  const run = async (Err) => {
    sdk = fakeSdk({ retrieve: async () => { throw new sdk.default[Err]('boom'); } });
    return (await checkKey('sk', 'm', async () => sdk)).error;
  };
  assert.equal(await run('AuthenticationError'), 'key');
  assert.equal(await run('PermissionDeniedError'), 'permission');
  assert.equal(await run('NotFoundError'), 'model');
});

test('bad request keeps the API message as detail (e.g. low credit)', async () => {
  let sdk;
  sdk = fakeSdk({ create: async () => { throw new sdk.default.BadRequestError('Your credit balance is too low'); } });
  const r = await callClaude('sk', { model: 'm' }, async () => sdk);
  assert.equal(r.error, 'request');
  assert.match(r.detail, /credit balance/);
});

test('checkKey without key', async () => {
  assert.deepEqual(await checkKey('', 'm'), { ok: false, error: 'nokey' });
});

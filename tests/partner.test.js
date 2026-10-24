import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPartnerRequest, parsePartnerReply, runPartner, PARTNER_SCHEMA, MAX_USER_TURNS } from '../src/core/partner.js';

const base = {
  setting: 'At the coffee machine with a colleague you barely know',
  opener: 'Busy week so far?',
  lang: 'en',
  model: 'claude-opus-5-5',
};

test('request: opener in system prompt, turns become alternating messages starting with user', () => {
  const r = buildPartnerRequest({ ...base, turns: [
    { role: 'partner', text: 'Busy week so far?' },
    { role: 'user', text: 'Quite busy, we had a workshop.' },
    { role: 'partner', text: 'Oh nice, what about?' },
    { role: 'user', text: 'Value stream mapping.' },
  ] });
  assert.match(r.system, /coffee machine/);
  assert.match(r.system, /Busy week so far\?/);
  assert.deepEqual(r.messages, [
    { role: 'user', content: 'Quite busy, we had a workshop.' },
    { role: 'assistant', content: '{"reply":"Oh nice, what about?","end_conversation":false}' },
    { role: 'user', content: 'Value stream mapping.' },
  ]);
  assert.deepEqual(r.output_config.format, { type: 'json_schema', schema: PARTNER_SCHEMA });
  assert.equal(r.fallbacks, 'default');
});

test('request asks to wrap up on the last user turn', () => {
  const turns = [];
  for (let i = 0; i < MAX_USER_TURNS; i++) turns.push({ role: 'partner', text: `p${i}` }, { role: 'user', text: `u${i}` });
  const r = buildPartnerRequest({ ...base, turns });
  assert.match(r.messages[r.messages.length - 1].content, /wrap up/i);
});

test('dutch request speaks Dutch', () => {
  const r = buildPartnerRequest({ ...base, lang: 'nl', turns: [{ role: 'partner', text: 'x' }, { role: 'user', text: 'y' }] });
  assert.match(r.system, /Dutch/);
});

test('parse reply', () => {
  const msg = { stop_reason: 'end_turn', content: [{ type: 'text', text: '{"reply":"Ha, nice.","end_conversation":true}' }] };
  assert.deepEqual(parsePartnerReply(msg), { ok: true, reply: 'Ha, nice.', end: true });
});

test('parse rejects empty reply and refusals', () => {
  assert.equal(parsePartnerReply({ stop_reason: 'end_turn', content: [{ type: 'text', text: '{"reply":"","end_conversation":false}' }] }).ok, false);
  assert.equal(parsePartnerReply({ stop_reason: 'refusal', content: [] }).ok, false);
});

test('runPartner without key', async () => {
  assert.deepEqual(await runPartner('', { ...base, turns: [] }), { ok: false, error: 'nokey' });
});

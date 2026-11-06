// AI conversation partner for the Live Conversation drill. Plays the other
// person in a small-talk scenario, one short reply per turn.
import { callClaude, withFallbacks, lastJson } from './claude.js';

export const MAX_USER_TURNS = 4;

export const PARTNER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['reply', 'end_conversation'],
  properties: {
    reply: { type: 'string' },
    end_conversation: { type: 'boolean' },
  },
};

function systemPrompt({ setting, opener, lang }) {
  const language = lang === 'nl' ? 'Dutch' : 'English';
  return [
    `You are role-playing the other person in a small-talk situation: ${setting}.`,
    `You opened the conversation with: "${opener}"`,
    'The person you talk to is practising small talk and improvising. Be a natural, friendly conversation partner:',
    'reply in 1-2 short spoken sentences, react to what he actually said, sometimes share something about yourself,',
    'and often (not always) ask a question back so he has to keep going. Never coach or comment on his speaking.',
    'His words come from speech-to-text, so ignore odd transcription errors.',
    `Speak ${language}, casually, like a real person in this situation. No emoji, no stage directions.`,
    'Set end_conversation to true only when the conversation has naturally wrapped up.',
  ].join(' ');
}

const asReply = (text, end = false) => JSON.stringify({ reply: text, end_conversation: end });

export function buildPartnerRequest({ setting, opener, turns, lang, model }) {
  // The opener lives in the system prompt; messages start at his first reply.
  const firstUser = turns.findIndex((t) => t.role === 'user');
  const messages = (firstUser < 0 ? [] : turns.slice(firstUser)).map((t) => (t.role === 'user'
    ? { role: 'user', content: t.text }
    : { role: 'assistant', content: asReply(t.text) }));
  const userTurns = turns.filter((t) => t.role === 'user').length;
  const last = messages[messages.length - 1];
  if (last && last.role === 'user' && userTurns >= MAX_USER_TURNS) {
    messages[messages.length - 1] = {
      ...last,
      content: `${last.content}\n\n(Out of character note: this is his last turn. Reply briefly and wrap up the conversation naturally.)`,
    };
  }
  return withFallbacks({
    model,
    max_tokens: 2000,
    system: systemPrompt({ setting, opener, lang }),
    messages,
    output_config: { effort: 'low', format: { type: 'json_schema', schema: PARTNER_SCHEMA } },
  });
}

export function parsePartnerReply(message) {
  const res = lastJson(message);
  if (!res.ok) return res;
  const reply = typeof res.data.reply === 'string' ? res.data.reply.trim() : '';
  if (!reply) return { ok: false, error: 'parse' };
  return { ok: true, reply, end: !!res.data.end_conversation };
}

export async function runPartner(apiKey, args, loadSdk) {
  const res = await callClaude(apiKey, buildPartnerRequest(args), loadSdk);
  return res.ok ? parsePartnerReply(res.message) : res;
}

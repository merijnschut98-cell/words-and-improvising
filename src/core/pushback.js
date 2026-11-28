// "They push back": two turns of holding his ground after a situation. Offline
// the objections come from the lesson; with a key the coach plays the other
// person. He always writes his own replies: the coach never drafts them.
// Only the fields named here are sent, and only after he taps. Pure apart from
// the run* calls, which never throw.
import { callClaude, withFallbacks, lastJson } from './claude.js';
import { parseGrade } from './coursecoach.js';

const REPLY_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['reply', 'end'],
  properties: { reply: { type: 'string' }, end: { type: 'boolean' } },
};
const GRADE_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['points', 'missed'],
  properties: { points: { type: 'array', items: { type: 'integer' } }, missed: { type: 'string' } },
};
const language = (lang) => (lang === 'en' ? 'English' : 'Dutch');
const isStr = (v) => typeof v === 'string' && v.trim().length > 0;

// The two offline objections, or [] when the lesson has none.
export function pushbackTurns(situation) {
  const lines = situation && situation.pushback && situation.pushback.lines;
  return Array.isArray(lines) && lines.length === 2 && lines.every(isStr) ? [...lines] : [];
}

// turns: [{ who: 'me' | 'them', text }], his situation answer first.
function transcript(turns) {
  return (Array.isArray(turns) ? turns : [])
    .filter((x) => x && isStr(x.text))
    .map((x) => `${x.who === 'them' ? 'Them' : 'Him'}: """${String(x.text).slice(0, 1200)}"""`)
    .join('\n');
}

export function buildPushbackRequest({ lesson, turns, lang, model, context }) {
  const s = lesson.situation;
  const ctx = String(context || '').trim().slice(0, 400);
  return withFallbacks({
    model,
    max_tokens: 300,
    system: `You play the other person in a short work scene with a junior consultant. Stay in role and push back on what he just said, the way a real, reasonable senior colleague or client would: one or two sentences, specific, not hostile, not a caricature. Never coach him, never give tips or feedback, and never write his reply for him or suggest what he should say. Set end to true only if his last reply fully settles your concern. Write in ${language(lang)}.`,
    messages: [{ role: 'user', content: [
      `Scene: ${s.scene}`,
      `What he was asked: ${s.ask}`,
      ...(ctx ? [`His work context: "${ctx}"`] : []),
      `The conversation so far:\n${transcript(turns)}`,
    ].join('\n\n') }],
    output_config: { effort: 'low', format: { type: 'json_schema', schema: REPLY_SCHEMA } },
  });
}

export function parsePushback(message) {
  const res = lastJson(message);
  if (!res.ok) return res;
  const reply = String((res.data && res.data.reply) || '').replace(/\s+/g, ' ').trim().slice(0, 240);
  if (!reply) return { ok: false, error: 'parse' };
  return { ok: true, reply, end: !!(res.data && res.data.end === true) };
}

export function buildPushbackGrade({ lesson, turns, lang, model }) {
  const s = lesson.situation;
  const r = s.pushback.rubric;
  return withFallbacks({
    model,
    max_tokens: 600,
    system: `You grade how a junior consultant held his ground when someone pushed back, against a 3-point rubric. Judge only his replies to the objections. For each rubric line give 1 if his replies clearly meet it, else 0. Then one sentence on the most important thing he missed (or what was strong, if nothing was missed). Be fair and specific. Write the sentence in ${language(lang)}.`,
    messages: [{ role: 'user', content: [
      `Scene: ${s.scene}`,
      `Rubric:\n1. ${r[0]}\n2. ${r[1]}\n3. ${r[2]}`,
      `The conversation:\n${transcript(turns)}`,
    ].join('\n\n') }],
    output_config: { effort: 'low', format: { type: 'json_schema', schema: GRADE_SCHEMA } },
  });
}

export const parsePushbackGrade = parseGrade;

async function safely(apiKey, build, parse, args, loadSdk) {
  try {
    const res = await callClaude(apiKey, build(args), loadSdk);
    return res.ok ? parse(res.message) : res;
  } catch {
    return { ok: false, error: 'unknown' };
  }
}

export const runPushback = (apiKey, args, loadSdk) => safely(apiKey, buildPushbackRequest, parsePushback, args, loadSdk);
export const runPushbackGrade = (apiKey, args, loadSdk) => safely(apiKey, buildPushbackGrade, parsePushbackGrade, args, loadSdk);

// Saves the pushback points. 0 XP, not a round, no session: practice only.
export function applyPushback(state, { subject, lessonId, pts }, now) {
  const courses = state.courses || {};
  const c = courses[subject] || { lessons: {}, sessions: [] };
  const before = (c.lessons || {})[lessonId] || {};
  return {
    ...state,
    courses: { ...courses, [subject]: { ...c, lessons: { ...c.lessons, [lessonId]: { ...before, pushback: { pts, ts: now } } } } },
  };
}

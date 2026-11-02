// Course coach calls (key only; the app always has a local fallback):
// grading a situation answer against its rubric, and explaining a lesson in
// his own context. Only the lesson fields named here are sent, and only on a tap.
import { callClaude, withFallbacks, lastJson } from './claude.js';

const GRADE_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['points', 'missed'],
  properties: { points: { type: 'array', items: { type: 'integer' } }, missed: { type: 'string' } },
};
const EXPLAIN_SCHEMA = { type: 'object', additionalProperties: false, required: ['text'], properties: { text: { type: 'string' } } };
const language = (lang) => (lang === 'en' ? 'English' : 'Dutch');

export function buildGradeRequest({ lesson, answer, lang, model }) {
  const s = lesson.situation;
  return withFallbacks({
    model,
    max_tokens: 600,
    system: `You grade a short answer from a junior consultant against a 3-point rubric. For each rubric line give 1 if his answer clearly meets it, else 0. Then one sentence on the most important thing he missed (or what was strong, if nothing was missed). Be fair and specific. Write the sentence in ${language(lang)}.`,
    messages: [{ role: 'user', content: [
      `Scene: ${s.scene}`,
      `Question: ${s.ask}`,
      `Rubric:\n1. ${s.rubric[0]}\n2. ${s.rubric[1]}\n3. ${s.rubric[2]}`,
      `His answer:\n"""${String(answer || '').slice(0, 1200)}"""`,
    ].join('\n\n') }],
    output_config: { effort: 'low', format: { type: 'json_schema', schema: GRADE_SCHEMA } },
  });
}

export function parseGrade(message) {
  const res = lastJson(message);
  if (!res.ok) return res;
  const p = res.data && res.data.points;
  if (!Array.isArray(p) || p.length !== 3) return { ok: false, error: 'parse' };
  const missed = String((res.data && res.data.missed) || '').replace(/\s+/g, ' ').trim().slice(0, 240);
  return { ok: true, points: p.map((x) => (Number(x) >= 1 ? 1 : 0)), missed };
}

export async function runGrade(apiKey, args, loadSdk) {
  const res = await callClaude(apiKey, buildGradeRequest(args), loadSdk);
  return res.ok ? parseGrade(res.message) : res;
}

export function buildExplainRequest({ lesson, context, lang, model }) {
  return withFallbacks({
    model,
    max_tokens: 500,
    system: `You explain one concept to a junior consultant in his own work context, in at most 120 words, concrete, with one example from his context. Write in ${language(lang)}.`,
    messages: [{ role: 'user', content: [
      `Concept: ${lesson.title}`,
      `Key terms: ${(lesson.terms || []).map((x) => x.term).join(', ')}`,
      `His context: "${String(context || '').slice(0, 200)}"`,
    ].join('\n') }],
    output_config: { effort: 'low', format: { type: 'json_schema', schema: EXPLAIN_SCHEMA } },
  });
}

export function parseExplain(message) {
  const res = lastJson(message);
  if (!res.ok) return res;
  const text = String((res.data && res.data.text) || '').trim().slice(0, 600);
  return text ? { ok: true, text } : { ok: false, error: 'parse' };
}

export async function runExplain(apiKey, args, loadSdk) {
  const res = await callClaude(apiKey, buildExplainRequest(args), loadSdk);
  return res.ok ? parseExplain(res.message) : res;
}

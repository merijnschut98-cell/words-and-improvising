// Course coach calls (key only; the app always has a local fallback):
// grading a situation answer against its rubric, and explaining a lesson in
// his own context, fresh scenes from his work, and grading his explain-back.
// Only the lesson fields named here are sent, and only on a tap.
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

// A fresh scene in his own setting that tests the same concept. Sent: the
// lesson title, its terms, the situation's ask and rubric as a template, and
// his context only when he wrote one. Never the teach blocks.
const SCENE_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['scene', 'ask', 'model', 'rubric'],
  properties: { scene: { type: 'string' }, ask: { type: 'string' }, model: { type: 'string' }, rubric: { type: 'array', items: { type: 'string' } } },
};

export function buildSceneRequest({ lesson, context, lang, model }) {
  const s = lesson.situation;
  const ctx = String(context || '').trim().slice(0, 400);
  return withFallbacks({
    model,
    max_tokens: 700,
    system: `You write one new practice scene for a junior consultant, set in his own work, that tests the same concept as the template. Keep it realistic and specific: a named role, a concrete moment, numbers where they help. Scene at most 80 words, then the question he must answer, a strong model answer of at most 90 words, and exactly 3 short rubric lines in the same spirit as the template. Plain text only, no markup. Write in ${language(lang)}.`,
    messages: [{ role: 'user', content: [
      `Concept: ${lesson.title}`,
      `Key terms: ${(lesson.terms || []).map((x) => x.term).join(', ')}`,
      `Template question: ${s.ask}`,
      `Template rubric:\n1. ${s.rubric[0]}\n2. ${s.rubric[1]}\n3. ${s.rubric[2]}`,
      ...(ctx ? [`His work context: "${ctx}"`] : []),
    ].join('\n\n') }],
    output_config: { effort: 'low', format: { type: 'json_schema', schema: SCENE_SCHEMA } },
  });
}

const line = (v, max) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max);

export function parseScene(message) {
  const res = lastJson(message);
  if (!res.ok) return res;
  const d = res.data || {};
  if (!Array.isArray(d.rubric) || d.rubric.length !== 3) return { ok: false, error: 'parse' };
  const situation = { scene: line(d.scene, 600), ask: line(d.ask, 200), model: line(d.model, 700), rubric: d.rubric.map((x) => line(x, 160)) };
  if (![situation.scene, situation.ask, situation.model, ...situation.rubric].every(Boolean)) return { ok: false, error: 'parse' };
  return { ok: true, situation };
}

// Explain-back: he explains the lesson in his own words; the coach grades three
// points and names one missing idea as a question, never as the answer.
const EXPLAIN_BACK_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['points', 'question'],
  properties: { points: { type: 'array', items: { type: 'integer' } }, question: { type: 'string' } },
};

export function buildExplainBackRequest({ lesson, text, lang, model }) {
  return withFallbacks({
    model,
    max_tokens: 500,
    system: `A junior consultant explains a concept in his own words. Grade 3 points, 1 or 0 each: (1) it is correct, (2) it is complete enough for a colleague to use, (3) it is in his own words rather than textbook phrasing. Then name the one most important missing idea as a short question that makes him think (for example "What happens to OEE if …?"). Never give the answer or a model explanation. If nothing is missing, ask a question that takes it one step further. Write the question in ${language(lang)}.`,
    messages: [{ role: 'user', content: [
      `Concept: ${lesson.title}`,
      `Key terms: ${(lesson.terms || []).map((x) => x.term).join(', ')}`,
      `How practitioners put it: ${lesson.said || ''}`,
      `His explanation:\n"""${String(text || '').slice(0, 1500)}"""`,
    ].join('\n\n') }],
    output_config: { effort: 'low', format: { type: 'json_schema', schema: EXPLAIN_BACK_SCHEMA } },
  });
}

export function parseExplainBack(message) {
  const res = lastJson(message);
  if (!res.ok) return res;
  const p = res.data && res.data.points;
  if (!Array.isArray(p) || p.length !== 3) return { ok: false, error: 'parse' };
  return { ok: true, points: p.map((x) => (Number(x) >= 1 ? 1 : 0)), question: line(res.data.question, 200) };
}

async function safely(apiKey, build, parse, args, loadSdk) {
  try {
    const res = await callClaude(apiKey, build(args), loadSdk);
    return res.ok ? parse(res.message) : res;
  } catch {
    return { ok: false, error: 'unknown' };
  }
}

export const runScene = (apiKey, args, loadSdk) => safely(apiKey, buildSceneRequest, parseScene, args, loadSdk);
export const runExplainBack = (apiKey, args, loadSdk) => safely(apiKey, buildExplainBackRequest, parseExplainBack, args, loadSdk);

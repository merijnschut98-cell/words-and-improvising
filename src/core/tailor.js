// Targeted practice: one exercise aimed at the current weak spot. Claude writes
// it when there is a key; otherwise fallbackPick() uses the weekly review.
import { callClaude, withFallbacks, lastJson } from './claude.js';
import { makePrompt } from './lesson.js';

export const TAILOR_DRILLS = ['minute', 'explain', 'prep', 'bridge', 'smalltalk', 'pause'];

export const TAILOR_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['drill', 'focus', 'body', 'audience', 'words', 'setting'],
  properties: {
    drill: { type: 'string', enum: TAILOR_DRILLS },
    focus: { type: 'string' },
    body: { type: 'string' },
    audience: { type: 'string' },
    words: { type: 'array', items: { type: 'string' } },
    setting: { type: 'string' },
  },
};

function describeReview(review, improvements) {
  const w = review.thisWeek || {};
  const lines = [
    `This week: ${w.rounds ?? 0} rounds, fillers/min ${w.fillerRate ?? 'n/a'}, words/min ${w.wpm ?? 'n/a'}.`,
    review.topFiller ? `Most used filler: "${review.topFiller.word}" ×${review.topFiller.count}.` : 'No filler data yet.',
    review.worst ? `Weakest drill by rating: ${review.worst.drill} (avg ${review.worst.avg}/5).` : 'No weakest drill yet.',
    review.focus ? `Current focus rule says: ${review.focus.kind}${review.focus.value ? ` (${review.focus.value})` : ''}.` : '',
  ];
  if (improvements.length) lines.push(`Recent coach notes ("work on"):\n- ${improvements.join('\n- ')}`);
  return lines.filter(Boolean).join('\n');
}

export function buildTailorRequest({ review, improvements = [], lang, model }) {
  const language = lang === 'nl' ? 'Dutch' : 'English';
  const system = [
    'You design one short speaking exercise for a 28-year-old Lean consultant who is training to improvise:',
    'put thoughts into clear words on the spot, and do small talk. Pick the drill that best targets his weakest point right now,',
    'and write a fresh, concrete prompt that fits his world (consulting, factories, his sports team where he is captain, daily life).',
    'Drills: minute = talk non-stop about a topic; explain = explain a concept to an audience (fill audience);',
    'prep = give an opinion with Point-Reason-Example-Point (body is a question); bridge = talk about a topic using exactly 3 given words (fill words);',
    'smalltalk = respond to an opener (body is what the other person says, fill setting); pause = talk about a topic replacing fillers with silent pauses.',
    'Unused fields must be empty ("" or []). focus is one short sentence telling him what to pay attention to in this round.',
    `Write everything in ${language}.`,
  ].join(' ');
  return withFallbacks({
    model,
    max_tokens: 2000,
    system,
    messages: [{ role: 'user', content: describeReview(review, improvements) }],
    output_config: { effort: 'low', format: { type: 'json_schema', schema: TAILOR_SCHEMA } },
  });
}

export function parseTailor(message, now = Date.now()) {
  const res = lastJson(message);
  if (!res.ok) return res;
  const d = res.data;
  const bad = { ok: false, error: 'parse' };
  if (!d || !TAILOR_DRILLS.includes(d.drill) || !String(d.body || '').trim()) return bad;
  let extra = {};
  if (d.drill === 'explain') {
    if (!String(d.audience || '').trim()) return bad;
    extra = { audience: d.audience.trim() };
  } else if (d.drill === 'bridge') {
    const words = (d.words || []).map((x) => String(x).trim()).filter(Boolean);
    if (words.length !== 3) return bad;
    extra = { words };
  } else if (d.drill === 'smalltalk') {
    if (!String(d.setting || '').trim()) return bad;
    extra = { setting: d.setting.trim() };
  }
  return {
    ok: true,
    prompt: { id: `ai:${now}`, drill: d.drill, body: d.body.trim(), extra, seenIds: [], focus: String(d.focus || '').trim() },
  };
}

export function fallbackPick(review, content, rng, seen) {
  const f = review.focus || {};
  let drill;
  if (f.kind === 'drill' && TAILOR_DRILLS.includes(f.value)) drill = f.value;
  else if (f.kind === 'filler') drill = 'pause';
  else if (review.worst && TAILOR_DRILLS.includes(review.worst.drill)) drill = review.worst.drill;
  else drill = TAILOR_DRILLS[Math.floor(rng() * TAILOR_DRILLS.length)];
  return makePrompt(drill, content, rng, seen);
}

export async function runTailor(apiKey, args, loadSdk) {
  const res = await callClaude(apiKey, buildTailorRequest(args), loadSdk);
  return res.ok ? parseTailor(res.message) : res;
}

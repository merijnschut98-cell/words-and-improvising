// AI speaking coach via the Anthropic SDK, called straight from the browser with
// the user's own key. The SDK is lazy-loaded so the app (and tests) work without it.

export const SDK_URL = 'https://esm.sh/@anthropic-ai/sdk@0.133.0';
const FALLBACK_BETA = 'server-side-fallback-2026-07-01';
// Server-side refusal fallbacks are not available for Haiku.
const supportsFallbacks = (model) => !/haiku/.test(model);

const score = { type: 'integer', minimum: 1, maximum: 5 };

export const COACH_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['scores', 'overall', 'strength', 'improvement', 'stronger_version'],
  properties: {
    scores: {
      type: 'object',
      additionalProperties: false,
      required: ['clarity', 'structure', 'fluency', 'vocabulary'],
      properties: { clarity: score, structure: score, fluency: score, vocabulary: score },
    },
    overall: score,
    strength: { type: 'string' },
    improvement: { type: 'string' },
    stronger_version: { type: 'string' },
  },
};

const DRILL_BRIEF = {
  minute: 'Just a Minute: keep talking fluently about a random topic for the full time.',
  explain: 'Explain It: explain a concept clearly to the given audience, at their level.',
  prep: 'PREP: give an opinion structured as Point, Reason, Example, Point.',
  bridge: 'Word Bridge: talk about the topic and naturally weave in the three given words.',
  smalltalk: 'Small Talk: respond naturally to the opener and keep the conversation going, ideally with a follow-up question.',
  rapid: 'Rapid Fire: answer five quick questions, ten seconds each, starting immediately.',
};

function systemPrompt(lang) {
  const language = lang === 'nl' ? 'Dutch' : 'English';
  return [
    'You are a speaking coach helping a 28-year-old Lean consultant get better at improvising:',
    'putting thoughts into clear, articulate words on the spot, and at small talk.',
    'He knows the words; the skill is retrieving and structuring them quickly.',
    'You receive a speech-to-text transcript of an improvised answer. Expect transcription noise and missing punctuation; do not judge spelling.',
    'Judge it as spoken language under time pressure, not as an essay.',
    'Be warm and direct. No flattery, no padding. Name one concrete strength and the single most valuable improvement.',
    `The stronger_version rewrites his answer as he could have said it, in his voice, about the same length, in ${language}.`,
    `Write all feedback in ${language}.`,
    'Scores are 1-5 where 3 is a decent, ordinary answer and 5 is genuinely impressive.',
  ].join(' ');
}

function describePrompt(drill, prompt) {
  const x = prompt.extra || {};
  if (drill === 'explain') return `Concept: ${prompt.body}\nAudience: ${x.audience}`;
  if (drill === 'bridge') return `Topic: ${prompt.body}\nWords to include: ${(x.words || []).join(', ')}`;
  if (drill === 'smalltalk') return `Situation: ${x.setting}\nThey say: "${prompt.body}"`;
  if (drill === 'rapid') return `Questions:\n${(x.questions || []).map((q, i) => `${i + 1}. ${q}`).join('\n')}`;
  return `Prompt: ${prompt.body}`;
}

export function buildCoachRequest({ drill, prompt, transcript, lang, durationS, metrics, model }) {
  const m = metrics || {};
  const user = [
    `Drill: ${DRILL_BRIEF[drill] || drill}`,
    describePrompt(drill, prompt),
    `Spoke for ${Math.round(durationS)}s, ${m.words} words, ${m.wpm} wpm, ${m.fillerCount} filler words (${m.fillerRate}/min).`,
    'Transcript:',
    `"""${transcript}"""`,
  ].join('\n\n');
  const req = {
    model,
    max_tokens: 4000,
    system: systemPrompt(lang),
    messages: [{ role: 'user', content: user }],
    output_config: { effort: 'low', format: { type: 'json_schema', schema: COACH_SCHEMA } },
  };
  if (supportsFallbacks(model)) {
    req.betas = [FALLBACK_BETA];
    req.fallbacks = 'default';
  }
  return req;
}

export function parseCoachResponse(message) {
  if (!message || message.stop_reason === 'refusal') return { ok: false, error: 'refusal' };
  const texts = (message.content || []).filter((b) => b.type === 'text');
  const last = texts[texts.length - 1];
  if (!last) return { ok: false, error: 'parse' };
  try {
    const data = JSON.parse(last.text);
    if (!data || !data.scores || typeof data.stronger_version !== 'string') throw new Error('shape');
    return { ok: true, data };
  } catch {
    return { ok: false, error: 'parse' };
  }
}

const defaultLoadSdk = () => import(/* @vite-ignore */ SDK_URL);

export async function runCoach(apiKey, args, loadSdk = defaultLoadSdk) {
  if (!apiKey) return { ok: false, error: 'nokey' };
  let Anthropic;
  try {
    Anthropic = (await loadSdk()).default;
  } catch {
    return { ok: false, error: 'offline' };
  }
  try {
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true, maxRetries: 1 });
    const message = await client.beta.messages.create(buildCoachRequest(args));
    return parseCoachResponse(message);
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) return { ok: false, error: 'key' };
    if (err instanceof Anthropic.RateLimitError) return { ok: false, error: 'rate' };
    if (err instanceof Anthropic.APIConnectionError) return { ok: false, error: 'offline' };
    return { ok: false, error: 'unknown', detail: String(err && err.message) };
  }
}

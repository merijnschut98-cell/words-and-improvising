// AI speaking coach: scores an improvised answer and writes a stronger version.
import { callClaude, withFallbacks, lastJson } from './claude.js';

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

const MODIFIER_TEXT = {
  cold: 'no preparation time at all',
  whisper: 'speak in a whisper',
  slow: 'speak slowly, under 110 words per minute',
  noI: 'never use first person (I, me, my)',
  standing: 'stand up while speaking',
  eyesClosed: 'speak with eyes closed',
  endQuestion: 'end with a question to the listener',
};

const DRILL_BRIEF = {
  minute: 'Just a Minute: keep talking fluently about a random topic for the full time.',
  explain: 'Explain It: explain a concept clearly to the given audience, at their level.',
  prep: 'PREP: give an opinion structured as Point, Reason, Example, Point.',
  bridge: 'Word Bridge: talk about the topic and naturally weave in the three given words.',
  smalltalk: 'Small Talk: respond naturally to the opener and keep the conversation going, ideally with a follow-up question.',
  rapid: 'Rapid Fire: answer five quick questions, ten seconds each, starting immediately.',
  pause: "Pause, don't fill: talk about the topic and replace every filler word with a short silent pause. Judge filler use strictly.",
  debate: 'Debate: argue FOR the statement in the first half, then switch at the signal and argue AGAINST it in the second half. Judge the strength of both sides and how cleanly he switched.',
  story: 'Story Chain: keep telling one story and weave in each surprise twist the moment it appears, without stopping.',
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
  if (drill === 'smalltalk' && x.dialogue) {
    const lines = x.dialogue.map((t) => `${t.role === 'user' ? 'Him' : 'Them'}: ${t.text}`).join('\n');
    return `Live conversation with an AI partner. Situation: ${x.setting}\n${lines}\n\n`
      + 'Judge especially whether he listens and builds on what the other person says, shares something, and keeps the conversation going. '
      + 'The transcript below is his turns only; the stronger version should be his turns rewritten, one line per turn.';
  }
  if (drill === 'smalltalk') return `Situation: ${x.setting}\nThey say: "${prompt.body}"`;
  if (drill === 'story') return `Story opening: ${prompt.body}\nTwists that appeared, in order: ${(x.twistsShown || []).join(' | ') || '(none)'}`;
  if (drill === 'rapid') return `Questions:\n${(x.questions || []).map((q, i) => `${i + 1}. ${q}`).join('\n')}`;
  return `Prompt: ${prompt.body}`;
}

export function buildCoachRequest({ drill, prompt, transcript, lang, durationS, metrics, model, modifier }) {
  const m = metrics || {};
  const user = [
    `Drill: ${DRILL_BRIEF[drill] || drill}`,
    describePrompt(drill, prompt),
    modifier ? `Extra condition he chose for this round: ${MODIFIER_TEXT[modifier] || modifier}.` : '',
    `Spoke for ${Math.round(durationS)}s, ${m.words} words, ${m.wpm} wpm, ${m.fillerCount} filler words (${m.fillerRate}/min).`,
    'Transcript:',
    `"""${transcript}"""`,
  ].join('\n\n');
  const req = {
    model,
    max_tokens: 8000,
    system: systemPrompt(lang),
    messages: [{ role: 'user', content: user }],
    output_config: { effort: 'low', format: { type: 'json_schema', schema: COACH_SCHEMA } },
  };
  return withFallbacks(req);
}

export function parseCoachResponse(message) {
  const res = lastJson(message);
  if (!res.ok) return res;
  const d = res.data;
  if (!d || !d.scores || typeof d.stronger_version !== 'string') return { ok: false, error: 'parse' };
  return { ok: true, data: d };
}

export async function runCoach(apiKey, args, loadSdk) {
  const res = await callClaude(apiKey, buildCoachRequest(args), loadSdk);
  return res.ok ? parseCoachResponse(res.message) : res;
}

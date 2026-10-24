// Shared Anthropic SDK call for browser use with the user's own key.
// The SDK is lazy-loaded so the app (and tests) work without it.

export const SDK_URL = 'https://esm.sh/@anthropic-ai/sdk@0.133.0';

const defaultLoadSdk = () => import(/* @vite-ignore */ SDK_URL);

// -> {ok:true, message} | {ok:false, error:'nokey'|'offline'|'key'|'rate'|'unknown'}
export async function callClaude(apiKey, params, loadSdk = defaultLoadSdk) {
  if (!apiKey) return { ok: false, error: 'nokey' };
  let Anthropic;
  try {
    Anthropic = (await loadSdk()).default;
  } catch {
    return { ok: false, error: 'offline' };
  }
  try {
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true, maxRetries: 1 });
    return { ok: true, message: await client.beta.messages.create(params) };
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) return { ok: false, error: 'key' };
    if (err instanceof Anthropic.RateLimitError) return { ok: false, error: 'rate' };
    if (err instanceof Anthropic.APIConnectionError) return { ok: false, error: 'offline' };
    return { ok: false, error: 'unknown', detail: String(err && err.message) };
  }
}

const FALLBACK_BETA = 'server-side-fallback-2026-07-01';

// Server-side refusal fallbacks are not available for Haiku.
export function withFallbacks(params) {
  if (/haiku/.test(params.model)) return params;
  return { ...params, betas: [FALLBACK_BETA], fallbacks: 'default' };
}

// Last text block (thinking and fallback blocks are skipped) parsed as JSON.
export function lastJson(message) {
  if (!message || message.stop_reason === 'refusal') return { ok: false, error: 'refusal' };
  if (message.stop_reason === 'max_tokens') return { ok: false, error: 'parse' };
  const texts = (message.content || []).filter((b) => b.type === 'text');
  const last = texts[texts.length - 1];
  if (!last) return { ok: false, error: 'parse' };
  try {
    return { ok: true, data: JSON.parse(last.text) };
  } catch {
    return { ok: false, error: 'parse' };
  }
}

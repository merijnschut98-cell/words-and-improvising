// Shared Anthropic SDK call for browser use with the user's own key.
// The SDK is lazy-loaded so the app (and tests) work without it.

export const SDK_URL = 'https://esm.sh/@anthropic-ai/sdk@0.133.0';

const defaultLoadSdk = () => import(/* @vite-ignore */ SDK_URL);

function mapError(Anthropic, err) {
  const detail = String((err && err.message) || '');
  const is = (name) => typeof Anthropic[name] === 'function' && err instanceof Anthropic[name];
  if (is('AuthenticationError')) return { ok: false, error: 'key' };
  if (is('PermissionDeniedError')) return { ok: false, error: 'permission', detail };
  if (is('NotFoundError')) return { ok: false, error: 'model' };
  if (is('RateLimitError')) return { ok: false, error: 'rate' };
  if (is('BadRequestError')) return { ok: false, error: 'request', detail };
  if (is('APIConnectionError')) return { ok: false, error: 'offline' };
  return { ok: false, error: 'unknown', detail };
}

// Runs fn(client) -> {ok:true, value} | {ok:false, error, detail?}
async function withClient(apiKey, fn, loadSdk = defaultLoadSdk) {
  if (!apiKey) return { ok: false, error: 'nokey' };
  let Anthropic;
  try {
    Anthropic = (await loadSdk()).default;
  } catch {
    return { ok: false, error: 'offline' };
  }
  try {
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true, maxRetries: 1 });
    return { ok: true, value: await fn(client) };
  } catch (err) {
    return mapError(Anthropic, err);
  }
}

// -> {ok:true, message} | {ok:false, error, detail?}
export async function callClaude(apiKey, params, loadSdk) {
  const res = await withClient(apiKey, (c) => c.beta.messages.create(params), loadSdk);
  return res.ok ? { ok: true, message: res.value } : res;
}

// Free check (no tokens): the key works and the chosen model is available.
export async function checkKey(apiKey, model, loadSdk) {
  const res = await withClient(apiKey, (c) => c.models.retrieve(model), loadSdk);
  return res.ok ? { ok: true } : res;
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

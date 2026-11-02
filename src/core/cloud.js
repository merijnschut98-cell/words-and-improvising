// Sync store: one row per user in Supabase (row-level security: only your own
// row). The client library loads on demand, only when sync is used. Every call
// returns { ok, ... } and never throws, so the app keeps working offline.
import { syncable } from './sync.js';

export const SUPABASE_URL = 'https://ysybqtdzcutmyabfwijl.supabase.co';
// Publishable key: safe in the page; row-level security guards the data.
export const SUPABASE_KEY = 'sb_publishable_lODBviZTqHwCMv1SMTVwXQ_kOJ3koNj';
const SDK_URL = 'https://esm.sh/@supabase/supabase-js@2.45.4';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createCloud({ load = (attempt) => import(`${SDK_URL}${attempt ? `?retry=${attempt}` : ''}`), url = SUPABASE_URL, key = SUPABASE_KEY, redirect } = {}) {
  let client = null;
  let attempt = 0;
  const get = async () => {
    // A browser remembers a failed import; a retry asks for a fresh URL.
    if (!client) {
      let mod;
      try { mod = await load(attempt); } catch (e) { attempt += 1; throw e; }
      client = mod.createClient(url, key, { auth: { persistSession: true, detectSessionInUrl: true, flowType: 'implicit' } });
    }
    return client;
  };
  const user = async (c) => ((await c.auth.getSession()).data.session || {}).user || null;
  const safely = async (fn) => {
    try { return await fn(); } catch (e) { return { ok: false, error: 'network', detail: String(e && e.message) }; }
  };

  return {
    signIn: (email) => safely(async () => {
      const addr = String(email || '').trim().toLowerCase();
      if (!EMAIL_RE.test(addr)) return { ok: false, error: 'email' };
      const c = await get();
      const { error } = await c.auth.signInWithOtp({ email: addr, options: { emailRedirectTo: redirect } });
      if (!error) return { ok: true };
      // The mail service allows only a few login emails per hour.
      const rate = error.status === 429 || /rate limit/i.test(error.message || '') || error.code === 'over_email_send_rate_limit';
      return { ok: false, error: rate ? 'rate' : 'send', detail: error.message };
    }),
    // The signed-in email, or null.
    who: () => safely(async () => {
      const u = await user(await get());
      return { ok: true, email: u ? u.email : null };
    }),
    pull: () => safely(async () => {
      const c = await get();
      const u = await user(c);
      if (!u) return { ok: false, error: 'auth' };
      const { data, error } = await c.from('progress').select('state, updated_at').eq('user_id', u.id).maybeSingle();
      if (error) return { ok: false, error: 'pull', detail: error.message };
      return { ok: true, state: data ? data.state : null };
    }),
    push: (state) => safely(async () => {
      const c = await get();
      const u = await user(c);
      if (!u) return { ok: false, error: 'auth' };
      const { error } = await c.from('progress').upsert({ user_id: u.id, state: syncable(state) });
      return error ? { ok: false, error: 'push', detail: error.message } : { ok: true };
    }),
    signOut: () => safely(async () => {
      const c = await get();
      await c.auth.signOut({ scope: 'local' }); // other devices stay signed in
      return { ok: true };
    }),
  };
}

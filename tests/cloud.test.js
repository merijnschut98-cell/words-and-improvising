import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCloud } from '../src/core/cloud.js';

// A tiny stand-in for the Supabase client: one user, one row.
function fakeSupabase({ user = { id: 'u1', email: 'm@example.com' }, row = null, fail = false } = {}) {
  const calls = [];
  const db = { row };
  return {
    calls,
    db,
    auth: {
      getSession: async () => ({ data: { session: user ? { user } : null } }),
      signInWithOtp: async (args) => { calls.push(['otp', args]); return fail ? { error: { message: 'rate limit' } } : { error: null }; },
      signOut: async () => { calls.push(['signOut']); return { error: null }; },
    },
    from: (table) => ({
      select: () => ({ eq: (_c, id) => ({ maybeSingle: async () => (fail ? { data: null, error: { message: 'down' } } : { data: db.row && db.row.user_id === id ? db.row : null, error: null }) }) }),
      upsert: async (rowIn) => { calls.push(['upsert', table, rowIn]); if (fail) return { error: { message: 'down' } }; db.row = rowIn; return { error: null }; },
    }),
  };
}

const cloudWith = (fake) => createCloud({ load: async () => ({ createClient: () => fake }), url: 'https://x.supabase.co', key: 'pk', redirect: 'https://app/' });

test('sign-in sends a magic link back to the app', async () => {
  const fake = fakeSupabase({ user: null });
  const res = await cloudWith(fake).signIn('  M@Example.com ');
  assert.equal(res.ok, true);
  assert.deepEqual(fake.calls[0], ['otp', { email: 'm@example.com', options: { emailRedirectTo: 'https://app/' } }]);
});

test('push stores only the syncable part of the state, under the signed-in user', async () => {
  const fake = fakeSupabase();
  const res = await cloudWith(fake).push({ xp: 5, settings: { apiKey: 'sk-secret' }, ui: { a: 1 } });
  assert.equal(res.ok, true);
  const [, table, row] = fake.calls.find((c) => c[0] === 'upsert');
  assert.equal(table, 'progress');
  assert.equal(row.user_id, 'u1');
  assert.deepEqual(row.state, { xp: 5 });
  assert.ok(!JSON.stringify(row).includes('sk-secret'));
});

test('pull returns the stored state, or null when there is none yet', async () => {
  assert.deepEqual((await cloudWith(fakeSupabase({ row: { user_id: 'u1', state: { xp: 9 } } })).pull()).state, { xp: 9 });
  assert.equal((await cloudWith(fakeSupabase()).pull()).state, null);
});

test('without a session nothing is sent; errors come back as ok:false, never throw', async () => {
  const signedOut = cloudWith(fakeSupabase({ user: null }));
  assert.equal((await signedOut.push({ xp: 1 })).ok, false);
  assert.equal((await signedOut.pull()).ok, false);
  const down = cloudWith(fakeSupabase({ fail: true }));
  assert.equal((await down.push({ xp: 1 })).ok, false);
  assert.equal((await down.pull()).ok, false);
  assert.equal((await down.signIn('a@b.nl')).ok, false);
  const broken = createCloud({ load: async () => { throw new Error('offline'); }, url: 'u', key: 'k', redirect: 'r' });
  assert.equal((await broken.pull()).ok, false);
});

test('an invalid email is refused before any request', async () => {
  const fake = fakeSupabase({ user: null });
  assert.equal((await cloudWith(fake).signIn('not-an-email')).ok, false);
  assert.equal(fake.calls.length, 0);
});

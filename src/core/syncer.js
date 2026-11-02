// Keeps this device and the cloud in step: pull, merge (never overwrite),
// push. Changes push once, a few seconds after the last one. Never throws.
import { mergeStates } from './sync.js';

const PUSH_DELAY = 3000;

export function createSyncer({ cloud, getState, setState, now = Date.now, schedule = setTimeout, cancel = clearTimeout, onAuthLost = () => {} }) {
  let running = null;
  let timer = null;
  const st = { lastSync: null, error: null };

  async function run() {
    const pulled = await cloud.pull();
    if (!pulled.ok) { st.error = pulled.error; if (pulled.error === 'auth') onAuthLost(); return pulled; }
    const merged = mergeStates(getState(), pulled.state);
    if (merged !== getState()) setState(merged);
    const pushed = await cloud.push(merged);
    if (!pushed.ok) { st.error = pushed.error; return pushed; }
    st.lastSync = now();
    st.error = null;
    return { ok: true };
  }

  return {
    // One sync at a time; a second call waits for the running one.
    syncNow() {
      if (!running) running = run().finally(() => { running = null; });
      return running;
    },
    // Something changed locally: sync soon. Always pull and merge first, so
    // a device that was away never rolls the cloud back.
    changed() {
      if (timer) cancel(timer);
      timer = schedule(async () => {
        timer = null;
        await this.syncNow();
      }, PUSH_DELAY);
    },
    status: () => ({ ...st }),
  };
}

// What the page URL says after a login link: a session token, an error (an
// expired or used link), or nothing to do with sign-in.
export function authReturn(hash) {
  const h = String(hash || '');
  if (/(^|[#&])access_token=/.test(h)) return 'token';
  if (/(^|[#&])error(_code)?=/.test(h)) return 'error';
  return null;
}

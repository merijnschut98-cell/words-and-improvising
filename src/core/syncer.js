// Keeps this device and the cloud in step: pull, merge (never overwrite),
// push. Changes push once, a few seconds after the last one. Never throws.
import { mergeStates } from './sync.js';

const PUSH_DELAY = 3000;

export function createSyncer({ cloud, getState, setState, now = Date.now, schedule = setTimeout, cancel = clearTimeout }) {
  let running = null;
  let timer = null;
  const st = { lastSync: null, error: null };

  async function run() {
    const pulled = await cloud.pull();
    if (!pulled.ok) { st.error = pulled.error; return pulled; }
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
    // Something changed locally: push it soon.
    changed() {
      if (timer) cancel(timer);
      timer = schedule(async () => {
        timer = null;
        const res = await cloud.push(getState());
        if (res.ok) { st.lastSync = now(); st.error = null; } else st.error = res.error;
      }, PUSH_DELAY);
    },
    status: () => ({ ...st }),
  };
}

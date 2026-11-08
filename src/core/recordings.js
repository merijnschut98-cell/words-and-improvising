// Recordings to listen back to: the last 20 rounds, on this device only.
// Never synced (size and privacy): they live in IndexedDB, not in the app
// state. Pure helpers, plus a store over a small adapter (IndexedDB in the
// app, a Map in the tests).
import { analyze, highlightFillers } from './metrics.js';
import { compareAttempts } from './compare.js';

export const KEEP = 20;

// The listen-back checklist, in the order he hears them.
export const CHECKS = ['opening', 'fillers', 'pace', 'ending', 'voice'];

// What is stored next to the audio. The audio itself is never part of it.
export function recordingMeta({ ts, prompt, lang, durationS, rating = null, coach = null, transcript }) {
  return {
    id: ts,
    ts,
    drill: prompt.drill,
    promptId: prompt.id || null,
    body: String(prompt.body || ''),
    lang,
    durationS: Math.round(durationS || 0),
    score: rating ?? null,
    coachScore: (coach && coach.overall) ?? null,
    transcript: String(transcript || '').trim(),
    listen: null,
  };
}

const newestFirst = (a, b) => (b.ts || 0) - (a.ts || 0);

// The newest KEEP stay; the ids of the rest are to be deleted.
export function retain(list, keep = KEEP) {
  const sorted = [...list].sort(newestFirst);
  return { keep: sorted.slice(0, keep), drop: sorted.slice(keep).map((r) => r.id) };
}

// [{ drill, items }]: the group with the most recent recording first.
export function groupByDrill(list) {
  const groups = new Map();
  for (const r of [...list].sort(newestFirst)) {
    if (!groups.has(r.drill)) groups.set(r.drill, []);
    groups.get(r.drill).push(r);
  }
  return [...groups].map(([drill, items]) => ({ drill, items }));
}

const samePrompt = (a, b) => a.promptId != null && a.promptId === b.promptId && a.drill === b.drill && a.lang === b.lang;

// [old, new] for the same prompt: the oldest earlier attempt against this
// one, or, from the oldest, this one against the newest. Null when alone.
export function beforeAfter(list, r) {
  if (!r || r.promptId == null) return null;
  const same = list.filter((x) => x.id !== r.id && samePrompt(x, r)).sort((a, b) => a.ts - b.ts);
  if (!same.length) return null;
  const older = same.filter((x) => x.ts < r.ts);
  return older.length ? [older[0], r] : [r, same[same.length - 1]];
}

const metricsOf = (r) => analyze(r.transcript, r.durationS, r.lang);

// The same rows as "say it again": fillers per minute (lower is better), pace (not judged), words.
export function compareRecordings(old, now) {
  return compareAttempts({ metrics: metricsOf(old) }, { metrics: metricsOf(now) });
}

export const markTranscript = (text, lang) => highlightFillers(text, lang);

// Rating before listening minus rating after. Positive: he was too generous.
export function listenGap(before, after) {
  if (before == null || after == null) return null;
  const gap = before - after;
  return { before, after, gap, verdict: gap >= 1 ? 'generous' : gap <= -1 ? 'harsh' : 'fair' };
}

// Unticked points: the candidates for the one thing to improve.
export const fixOptions = (checks = {}) => CHECKS.filter((c) => !checks[c]);

// The store. Every call resolves; a broken or missing database reads as empty.
// Calls run one after another, so a list right after a save sees that save.
export function createRecordings(adapter) {
  let queue = Promise.resolve();
  const safe = (fn, fallback) => (...args) => {
    if (!adapter) return Promise.resolve(fallback);
    const run = queue.then(() => fn(...args)).catch(() => fallback);
    queue = run;
    return run;
  };
  const store = {
    available: !!adapter,
    list: safe(async () => (await adapter.allMeta()).sort(newestFirst), []),
    get: safe((id) => adapter.getMeta(id), null),
    audio: safe(async (id) => (await adapter.getAudio(id)) || null, null),
    // Meta and audio, then trim to the newest KEEP.
    save: safe(async (meta, blob) => {
      if (!blob) return false;
      await adapter.putAudio(meta.id, blob);
      await adapter.putMeta(meta);
      const { drop } = retain(await adapter.allMeta());
      for (const id of drop) await adapter.del(id);
      return true;
    }, false),
    update: safe(async (id, patch) => {
      const cur = await adapter.getMeta(id);
      if (!cur) return false;
      await adapter.putMeta({ ...cur, ...patch, id });
      return true;
    }, false),
    remove: safe(async (id) => { await adapter.del(id); return true; }, false),
    clear: safe(async () => { await adapter.clear(); return true; }, false),
  };
  return store;
}

// In memory: for the tests, and as the shape an adapter must have.
export function memoryAdapter() {
  const meta = new Map();
  const audio = new Map();
  return {
    allMeta: async () => [...meta.values()],
    getMeta: async (id) => meta.get(id) || null,
    putMeta: async (m) => { meta.set(m.id, m); },
    putAudio: async (id, blob) => { audio.set(id, blob); },
    getAudio: async (id) => audio.get(id) || null,
    del: async (id) => { meta.delete(id); audio.delete(id); },
    clear: async () => { meta.clear(); audio.clear(); },
    audioCount: () => audio.size,
  };
}

// IndexedDB: one store for the small meta records, one for the audio blobs,
// so listing never loads the audio.
export function idbAdapter(idb, name = 'vantage-recordings') {
  if (!idb) return null;
  let opened = null;
  const open = () => {
    if (!opened) {
      opened = new Promise((resolve, reject) => {
        const req = idb.open(name, 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'id' });
          if (!db.objectStoreNames.contains('audio')) db.createObjectStore('audio');
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => { opened = null; reject(req.error); };
      });
    }
    return opened;
  };
  const run = async (stores, mode, fn) => {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(stores, mode);
      let out;
      const req = fn(tx);
      if (req) req.onsuccess = () => { out = req.result; };
      tx.oncomplete = () => resolve(out);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  };
  return {
    allMeta: async () => (await run(['meta'], 'readonly', (tx) => tx.objectStore('meta').getAll())) || [],
    getMeta: async (id) => (await run(['meta'], 'readonly', (tx) => tx.objectStore('meta').get(id))) || null,
    putMeta: (m) => run(['meta'], 'readwrite', (tx) => tx.objectStore('meta').put(m)),
    putAudio: (id, blob) => run(['audio'], 'readwrite', (tx) => tx.objectStore('audio').put(blob, id)),
    getAudio: async (id) => (await run(['audio'], 'readonly', (tx) => tx.objectStore('audio').get(id))) || null,
    del: (id) => run(['meta', 'audio'], 'readwrite', (tx) => { tx.objectStore('meta').delete(id); tx.objectStore('audio').delete(id); }),
    clear: () => run(['meta', 'audio'], 'readwrite', (tx) => { tx.objectStore('meta').clear(); tx.objectStore('audio').clear(); }),
  };
}

let shared = null;
// The app's one store (IndexedDB when the browser has it).
export function recordings() {
  if (!shared) shared = createRecordings(typeof indexedDB !== 'undefined' ? idbAdapter(indexedDB) : null);
  return shared;
}

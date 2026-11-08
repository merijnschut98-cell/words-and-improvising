// An explainer film: a standalone page in a sandboxed frame, opened from a
// secondary button in the lesson. The film cannot speak reliably from its
// opaque-origin frame, so it asks this page to speak through the app's voice
// (src/core/voice.js) and is told when each line is done.
//
// The page goes in as srcdoc, not src: a sandboxed frame without
// allow-same-origin navigates past the service worker, so a src would be an
// empty frame offline. This page fetches it (the worker answers from its
// cache) and the parameters travel in the frame's name (searchOf in
// films/_kit/timeline.mjs).
import { h } from './dom.js';
import { ico } from './icons.js';
import { figureTheme, figureAvailable } from './figure.js';
import { say, hush } from '../core/voice.js';

const REF = /^([a-z]+(?:\.[a-z0-9]+)+)(?:#([1-9]))?$/;

// 'eng.machining.turning#3' → { id, scene: 3 }; anything else → null.
export function parseFilmRef(ref) {
  const m = typeof ref === 'string' ? REF.exec(ref) : null;
  return m ? { id: m[1], scene: m[2] ? Number(m[2]) : null } : null;
}

export const filmSrc = (id, theme, lang, { level = null, scene = null, muted = false } = {}) =>
  `src/content/courses/films/${id}.html?theme=${theme}&lang=${lang === 'en' ? 'en' : 'nl'}`
  + ([1, 2, 3, 4].includes(level) ? `&level=${level}` : '')
  + (Number.isInteger(scene) && scene >= 1 ? `&scene=${scene}` : '')
  + (muted ? '&muted=1' : '');

const OPS = new Set(['hello', 'say', 'cancel', 'mute', 'size']);
const MAX_TEXT = 900;
const MAX_ID = 40;

// A message from the film, checked: only from its own frame, only known
// operations, only sane values. Returns the clean message or null.
export function filmMessage(event, frameWindow) {
  if (!event || event.source !== frameWindow || !frameWindow) return null;
  const d = event.data;
  if (!d || typeof d !== 'object' || d.type !== 'vp-film' || !OPS.has(d.op)) return null;
  if (d.op === 'say') {
    if (typeof d.text !== 'string' || !d.text.trim() || d.text.length > MAX_TEXT) return null;
    // the id goes back to the film in 'said': keep it small
    if (!(Number.isFinite(d.id) || (typeof d.id === 'string' && d.id.length <= MAX_ID))) return null;
    const rate = d.rate === 1.25 ? 1.25 : 1;
    return { op: 'say', id: d.id, text: d.text, lang: d.lang === 'en' ? 'en' : 'nl', rate };
  }
  if (d.op === 'mute') return { op: 'mute', muted: d.muted === true };
  if (d.op === 'size') return typeof d.h === 'number' && Number.isFinite(d.h) ? { op: 'size', h: Math.round(d.h) } : null;
  return { op: d.op };
}

// Hands the page to the frame. Resolves false when it cannot be had.
export async function loadFilm(frame, url, fetchFn = globalThis.fetch) {
  try {
    const res = await fetchFn(url);
    if (!res || !res.ok) return false;
    frame.srcdoc = await res.text();
    return true;
  } catch {
    return false;
  }
}

// The muted choice, remembered on this device. Storage may be blocked.
const MUTE_KEY = 'vp:filmMuted';
export const mutedPref = {
  read(store = globalThis.localStorage) {
    try { return store.getItem(MUTE_KEY) === '1'; } catch { return false; }
  },
  write(muted, store = globalThis.localStorage) {
    try { store.setItem(MUTE_KEY, muted ? '1' : '0'); } catch { /* private mode */ }
  },
};

// Listens for one frame. Returns a stop function. A frame that has left the
// page stops its own bridge and silences speech.
export function filmBridge(frame, { win = globalThis.window, say: speak = say, hush: quiet = hush, remember = (m) => mutedPref.write(m) } = {}) {
  let stopped = false;
  const post = (msg) => { try { frame.contentWindow.postMessage({ type: 'vp-film', ...msg }, '*'); } catch { /* frame gone */ } };
  const stop = () => {
    if (stopped) return;
    stopped = true;
    win.removeEventListener('message', onMessage);
    quiet();
  };
  function onMessage(event) {
    if (!frame.isConnected) { stop(); return; }
    const m = filmMessage(event, frame.contentWindow);
    if (!m) return;
    if (m.op === 'hello') post({ op: 'ready', voice: true });
    else if (m.op === 'say') Promise.resolve(speak(m.text, m.lang, m.rate)).catch(() => 'failed').then((result) => { if (!stopped) post({ op: 'said', id: m.id, result }); });
    else if (m.op === 'cancel') quiet();
    else if (m.op === 'mute') { remember(m.muted); if (m.muted) quiet(); }
    else if (m.op === 'size') frame.style.height = `${Math.min(900, Math.max(240, m.h))}px`;
  }
  win.addEventListener('message', onMessage);
  return stop;
}

// The lesson's one open film; leaving the step or the lesson closes it.
let current = null;
export function closeFilms() {
  if (current) { current(); current = null; }
}

// The sandboxed frame of an HTML film, with its narration bridge; it becomes
// the lesson's one open film. The page itself goes in as srcdoc (loadFilm).
function filmFrame(app, url) {
  closeFilms();
  const frame = h('iframe', { class: 'film-frame', sandbox: 'allow-scripts', name: url.slice(url.indexOf('?')), title: app.t('filmTitle') });
  const stop = filmBridge(frame);
  current = () => { stop(); };
  return frame;
}

// "Bekijk de film": a quiet button that opens the film inline under it. Hidden
// until the page answers, like a figure.
export function filmButton(app, ref, level) {
  const t = app.t;
  const film = parseFilmRef(ref);
  const wrap = h('div', { class: 'film-wrap', hidden: true });
  if (!film) return wrap;
  const theme = () => figureTheme(app.state.settings.theme, typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches);
  const src = () => filmSrc(film.id, theme(), app.lang, { level, scene: film.scene, muted: mutedPref.read() });
  const label = h('span', {}, t('filmWatch'));
  const btn = h('button', { type: 'button', class: 'btn btn-ghost film-btn', 'aria-expanded': 'false' }, ico('play'), ' ', label);
  let box = null;
  const close = () => {
    if (current) closeFilms();
    if (box) { box.remove(); box = null; }
    btn.setAttribute('aria-expanded', 'false');
    label.textContent = t('filmWatch');
  };
  btn.onclick = () => {
    if (box) { close(); return; }
    closeFilms();
    const url = src();
    const frame = filmFrame(app, url);
    box = h('figure', { class: 'figure-wrap film-box' }, frame);
    wrap.append(box);
    const mine = box;
    loadFilm(frame, url.slice(0, url.indexOf('?'))).then((ok) => { if (!ok && box === mine) close(); });
    btn.setAttribute('aria-expanded', 'true');
    label.textContent = t('filmClose');
  };
  wrap.append(btn);
  figureAvailable(src()).then((ok) => { if (ok) wrap.hidden = false; else wrap.remove(); });
  return wrap;
}

// ------------------------------------------------------------ v14b: the Film step
// In a lesson with a film the Film step replaces the reading. It plays the
// rendered video (MP4 from the public Supabase bucket, listed in the committed
// manifest) with captions and a poster, and "Lees mee" (the spoken script)
// under it. When the video cannot load (offline and not cached, or not
// uploaded yet) the HTML film plays in its sandboxed frame instead; when that
// is missing too, the lesson's own text, so the learner is never stuck.

export const MANIFEST_URL = 'src/content/courses/films/manifest.json';
const BASE = /^https:\/\/[a-z0-9]+\.supabase\.co\/storage\/v1\/object\/public\/films$/;

// The video of film `id` in the app language, opened at a start scene (1-based).
export function videoOf(manifest, id, lang, scene = null) {
  const film = manifest && manifest.films && manifest.films[id];
  const l = lang === 'en' ? 'en' : 'nl';
  const v = film && film[l];
  if (!v || typeof manifest.base !== 'string' || !BASE.test(manifest.base)) return null;
  const starts = Array.isArray(v.scenes) && v.scenes.length ? v.scenes : [0];
  const start = Number.isInteger(scene) && scene >= 1 ? starts[Math.min(scene, starts.length) - 1] || 0 : 0;
  return { url: `${manifest.base}/${id}/${l}.mp4`, vtt: v.vtt, poster: film.poster, dur: v.dur, start };
}

// The film page's data block (as readFilmData in films/_kit/assert.mjs), or null.
export function filmDataOf(html) {
  const m = typeof html === 'string' ? /<script type="application\/json" id="film-data">([\s\S]*?)<\/script>/.exec(html) : null;
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}

// The narration script per scene: { n, title, paras: [segments] }, segments as
// in the captions (strings and { t, en? } terms; the English word only in Dutch).
export function readAlong(data, lang) {
  const l = lang === 'en' ? 'en' : 'nl';
  const out = [];
  ((data && data.scenes) || []).forEach((s, i) => {
    const paras = (s.beats || []).map((b) => b.say && b.say[l]).filter(Array.isArray)
      .map((seg) => seg.map((p) => (typeof p === 'string' ? p : { t: p.t, ...(l === 'nl' && p.en ? { en: p.en } : {}) })));
    if (paras.length) out.push({ n: i + 1, title: (s.title && s.title[l]) || '', paras });
  });
  return out;
}

// After a first full view: the whole file into the films cache, from where the
// service worker serves it in byte ranges (sw.js). Best effort.
export const FILMS_CACHE = 'vantage-films';
export async function cacheFilm(url, { cachesApi = globalThis.caches, fetchFn = globalThis.fetch } = {}) {
  try {
    if (!cachesApi) return false;
    const cache = await cachesApi.open(FILMS_CACHE);
    if (await cache.match(url)) return true;
    const res = await fetchFn(url, { mode: 'cors' });
    if (!res || res.status !== 200) return false;
    await cache.put(url, res);
    return true;
  } catch {
    return false;
  }
}

let manifestPromise = null;
function loadManifest(fetchFn = globalThis.fetch) {
  if (!manifestPromise) {
    manifestPromise = Promise.resolve().then(() => fetchFn(MANIFEST_URL)).then((r) => (r && r.ok ? r.json() : null)).catch(() => null);
    manifestPromise.then((m) => { if (!m) manifestPromise = null; });
  }
  return manifestPromise;
}
async function loadText(url, fetchFn = globalThis.fetch) {
  try { const r = await fetchFn(url); return r && r.ok ? await r.text() : null; } catch { return null; }
}

const segNodes = (seg) => seg.map((p) => (typeof p === 'string' ? p
  : [h('b', { class: 'term-in' }, p.t), p.en ? h('span', { class: 'term-en', lang: 'en' }, ` (${p.en})`) : null]));

// The Film step's body. text(): the lesson's own text, the last fallback.
export function filmStep(app, lesson, level, { text } = {}) {
  const t = app.t;
  const lang = app.lang === 'en' ? 'en' : 'nl';
  const film = parseFilmRef(lesson.film);
  const stage = h('div', { class: 'film-stage' }, h('p', { class: 'muted loading' }, '…'));
  const note = h('p', { class: 'muted small film-note', hidden: true, 'aria-live': 'polite' });
  const read = h('details', { class: 'read-along', hidden: true });
  const box = h('div', { class: 'film-step' }, stage, note, read);
  const asText = () => {
    stage.replaceChildren(text ? text() : '');
    note.textContent = t('filmTextFallback');
    note.hidden = false;
    box.dataset.mode = 'text';
  };
  if (!film) { asText(); return box; }
  const theme = figureTheme(app.state.settings.theme, typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches);
  const src = filmSrc(film.id, theme, lang, { level, scene: film.scene, muted: mutedPref.read() });
  Promise.all([loadManifest(), loadText(src.slice(0, src.indexOf('?')))]).then(([manifest, html]) => {
    const data = filmDataOf(html);
    const script = readAlong(data, lang);
    if (script.length) {
      read.replaceChildren(h('summary', {}, t('filmReadAlong')),
        ...script.map((s) => h('section', { class: 'read-scene' },
          h('h3', { class: 'read-title' }, `${s.n}. ${s.title}`),
          s.paras.map((seg) => h('p', {}, segNodes(seg))))));
      read.hidden = false;
    }
    const asFrame = () => {
      if (!data) { asText(); return; }
      const frame = filmFrame(app, src);
      frame.srcdoc = html;
      stage.replaceChildren(h('figure', { class: 'figure-wrap film-box' }, frame));
      box.dataset.mode = 'frame';
    };
    const vid = videoOf(manifest, film.id, lang, film.scene);
    if (!vid) { asFrame(); return; }
    const video = h('video', {
      class: 'film-video', controls: true, playsinline: true, preload: 'metadata', poster: vid.poster, 'aria-label': t('filmVideo'),
    }, h('track', { kind: 'captions', srclang: lang, label: t('filmCaptions'), src: vid.vtt }));
    let failed = false;
    video.addEventListener('error', () => {
      if (failed || !video.isConnected) return;
      failed = true;
      note.textContent = t('filmFallback');
      note.hidden = false;
      asFrame();
    });
    video.addEventListener('loadedmetadata', () => { if (vid.start > 0) video.currentTime = vid.start; });
    // "Bewaar offline": keep this film now; a first full view keeps it anyway
    const keep = h('button', { type: 'button', class: 'btn btn-ghost small film-keep' }, ico('download'), ' ', t('filmKeep'));
    const kept = () => { keep.disabled = true; keep.replaceChildren(ico('check'), ' ', t('filmKept')); };
    keep.onclick = () => {
      keep.disabled = true;
      cacheFilm(vid.url).then((ok) => { if (ok) kept(); else { keep.disabled = false; keep.replaceChildren(ico('download'), ' ', t('filmKeepFailed')); } });
    };
    Promise.resolve().then(() => globalThis.caches && globalThis.caches.open(FILMS_CACHE)).then((c) => c && c.match(vid.url)).then((hit) => { if (hit) kept(); }).catch(() => {});
    video.addEventListener('ended', () => { cacheFilm(vid.url).then((ok) => { if (ok) kept(); }); });
    video.src = vid.url;
    stage.replaceChildren(h('figure', { class: 'film-video-wrap' }, video), keep);
    box.dataset.mode = 'video';
  });
  return box;
}

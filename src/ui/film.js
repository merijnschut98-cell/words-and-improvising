// An explainer film: a standalone page in a sandboxed frame, opened from a
// secondary button in the lesson. The film cannot speak reliably from its
// opaque-origin frame, so it asks this page to speak through the app's voice
// (src/core/voice.js) and is told when each line is done.
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

// A message from the film, checked: only from its own frame, only known
// operations, only sane values. Returns the clean message or null.
export function filmMessage(event, frameWindow) {
  if (!event || event.source !== frameWindow || !frameWindow) return null;
  const d = event.data;
  if (!d || typeof d !== 'object' || d.type !== 'vp-film' || !OPS.has(d.op)) return null;
  if (d.op === 'say') {
    if (typeof d.text !== 'string' || !d.text.trim() || d.text.length > MAX_TEXT) return null;
    if (!(typeof d.id === 'number' || typeof d.id === 'string')) return null;
    const rate = d.rate === 1.25 ? 1.25 : 1;
    return { op: 'say', id: d.id, text: d.text, lang: d.lang === 'en' ? 'en' : 'nl', rate };
  }
  if (d.op === 'mute') return { op: 'mute', muted: d.muted === true };
  if (d.op === 'size') return typeof d.h === 'number' && Number.isFinite(d.h) ? { op: 'size', h: Math.round(d.h) } : null;
  return { op: d.op };
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
    const frame = h('iframe', { class: 'film-frame', src: src(), sandbox: 'allow-scripts', title: t('filmTitle'), allow: 'autoplay' });
    box = h('figure', { class: 'figure-wrap film-box' }, frame);
    wrap.append(box);
    const stop = filmBridge(frame);
    current = () => { stop(); };
    btn.setAttribute('aria-expanded', 'true');
    label.textContent = t('filmClose');
  };
  wrap.append(btn);
  figureAvailable(src()).then((ok) => { if (ok) wrap.hidden = false; else wrap.remove(); });
  return wrap;
}

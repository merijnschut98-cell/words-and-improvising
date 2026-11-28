// An interactive lesson figure: a standalone page in a sandboxed frame, in the
// app's theme and language. If it fails to load, the lesson simply goes on.
//
// The page goes in as srcdoc with its parameters in the frame name, as the
// films do: a sandboxed frame without allow-same-origin has an opaque origin,
// so its own navigation skips the service worker and would show blank offline.
// On a phone the page asks for its height and for full screen by postMessage.
import { h } from './dom.js';
import { ico } from './icons.js';

// The app's theme setting, resolved to what the figure page understands.
export function figureTheme(setting, prefersDark) {
  if (setting === 'light' || setting === 'dark') return setting;
  return prefersDark ? 'dark' : 'light';
}

// A topic lesson passes its level (1–4), so the page can open in a fitting state.
export const figureSrc = (id, theme, lang, level) => `src/content/courses/figures/${id}.html?theme=${theme}&lang=${lang === 'en' ? 'en' : 'nl'}${[1, 2, 3, 4].includes(level) ? `&level=${level}` : ''}`;

// An iframe fires no error on a 404, so ask first. Offline, the service worker
// answers the HEAD request from its cache.
export async function figureAvailable(src, fetchFn = globalThis.fetch) {
  try {
    const res = await fetchFn(src, { method: 'HEAD' });
    return !!(res && res.ok);
  } catch {
    return false;
  }
}

// The page itself, fetched through the service worker, handed to the frame.
// The query string goes in the frame name (the page reads it with searchOf);
// call this before the frame goes into the document, as a frame takes its
// name when it is created.
export async function loadFigure(frame, src, fetchFn = globalThis.fetch) {
  const q = src.indexOf('?');
  try {
    const res = await fetchFn(q < 0 ? src : src.slice(0, q));
    if (!res || !res.ok) return false;
    const html = await res.text();
    frame.name = q < 0 ? '' : src.slice(q);
    frame.srcdoc = html;
    return true;
  } catch {
    return false;
  }
}

// A message from this figure's own frame: { type: 'vp-figure', op, ... }.
export function figureMessage(event, frameWindow) {
  const d = event && event.data;
  if (!event || event.source !== frameWindow || !d || d.type !== 'vp-figure') return null;
  if (d.op === 'size' && Number.isFinite(d.height)) return { op: 'size', height: d.height };
  if (d.op === 'full') return { op: 'full', on: !!d.on };
  return null;
}

// The height a phone figure asked for, kept between a strip and the screen.
export const figureHeight = (asked, viewport) => Math.round(Math.max(220, Math.min(asked, Math.max(260, viewport * 0.86))));

// Listens for one frame: its height on a phone, and full screen. Returns a stop
// function; a frame that has left the page stops its own bridge.
export function figureBridge(frame, wrap, { win = globalThis.window, doc = globalThis.document, label = 'Close' } = {}) {
  let full = false;
  let stopped = false;
  const post = (msg) => { try { frame.contentWindow.postMessage({ type: 'vp-figure', ...msg }, '*'); } catch { /* frame gone */ } };
  const close = h('button', { type: 'button', class: 'btn btn-ghost figure-close', 'aria-label': label, hidden: true }, ico('x'));
  wrap.append(close);
  const setFull = (on) => {
    if (on === full) return;
    full = on;
    wrap.classList.toggle('figure-full', on);
    close.hidden = !on;
    doc.documentElement.classList.toggle('figure-full-open', on);
    if (on) {
      // best effort: the system's full screen, landscape where the phone allows it
      try { const r = wrap.requestFullscreen && wrap.requestFullscreen(); if (r && r.then) r.then(() => { const o = win.screen && win.screen.orientation; if (o && o.lock) o.lock('landscape').catch(() => {}); }, () => {}); } catch { /* not allowed */ }
    } else if (doc.fullscreenElement === wrap) {
      try { doc.exitFullscreen().catch(() => {}); } catch { /* gone */ }
    }
    post({ op: 'full', on });
  };
  close.onclick = () => setFull(false);
  const onKey = (e) => { if (full && e.key === 'Escape') setFull(false); };
  const onFs = () => { if (full && doc.fullscreenElement !== wrap && !doc.fullscreenElement) setFull(false); };
  function onMessage(event) {
    if (!frame.isConnected) { stop(); return; }
    const m = figureMessage(event, frame.contentWindow);
    if (!m) return;
    if (m.op === 'size') { if (!full) frame.style.height = `${figureHeight(m.height, win.innerHeight || 640)}px`; }
    else if (m.op === 'full') setFull(m.on);
  }
  function stop() {
    if (stopped) return;
    stopped = true;
    if (full) setFull(false);
    win.removeEventListener('message', onMessage);
    win.removeEventListener('keydown', onKey);
    doc.removeEventListener('fullscreenchange', onFs);
  }
  win.addEventListener('message', onMessage);
  win.addEventListener('keydown', onKey);
  doc.addEventListener('fullscreenchange', onFs);
  return stop;
}

// Returns the wrapper at once; the frame goes in only when the page is there.
export function figureFrame(app, id, level) {
  const t = app.t;
  const dark = typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;
  const src = figureSrc(id, figureTheme(app.state.settings.theme, dark), app.lang, level);
  const wrap = h('figure', { class: 'figure-wrap', hidden: true });
  const frame = h('iframe', {
    class: 'figure-frame',
    sandbox: 'allow-scripts',
    title: t('figureTitle'),
  });
  loadFigure(frame, src).then((ok) => {
    if (!ok) { wrap.remove(); return; }
    wrap.prepend(frame);
    wrap.append(h('figcaption', { class: 'muted small' }, t('figureHint')));
    figureBridge(frame, wrap, { label: t('figureClose') });
    wrap.hidden = false;
  });
  return wrap;
}

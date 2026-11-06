// An interactive lesson figure: a standalone page in a sandboxed frame, in the
// app's theme and language. If it fails to load, the lesson simply goes on.
import { h } from './dom.js';

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

// Returns the wrapper at once; the frame goes in only when the page is there.
export function figureFrame(app, id, level) {
  const t = app.t;
  const dark = typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;
  const src = figureSrc(id, figureTheme(app.state.settings.theme, dark), app.lang, level);
  const wrap = h('figure', { class: 'figure-wrap', hidden: true });
  figureAvailable(src).then((ok) => {
    if (!ok) { wrap.remove(); return; }
    const frame = h('iframe', {
      class: 'figure-frame',
      src,
      sandbox: 'allow-scripts',
      loading: 'lazy',
      title: t('figureTitle'),
    });
    frame.addEventListener('error', () => wrap.remove());
    wrap.append(frame, h('figcaption', { class: 'muted small' }, t('figureHint')));
    wrap.hidden = false;
  });
  return wrap;
}

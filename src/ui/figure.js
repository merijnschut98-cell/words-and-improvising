// An interactive lesson figure: a standalone page in a sandboxed frame, in the
// app's theme and language. If it fails to load, the lesson simply goes on.
import { h } from './dom.js';

// The app's theme setting, resolved to what the figure page understands.
export function figureTheme(setting, prefersDark) {
  if (setting === 'light' || setting === 'dark') return setting;
  return prefersDark ? 'dark' : 'light';
}

export const figureSrc = (id, theme, lang) => `src/content/courses/figures/${id}.html?theme=${theme}&lang=${lang === 'en' ? 'en' : 'nl'}`;

export function figureFrame(app, id) {
  const t = app.t;
  const dark = typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;
  const frame = h('iframe', {
    class: 'figure-frame',
    src: figureSrc(id, figureTheme(app.state.settings.theme, dark), app.lang),
    sandbox: 'allow-scripts',
    loading: 'lazy',
    title: t('figureTitle'),
  });
  const wrap = h('figure', { class: 'figure-wrap' }, frame, h('figcaption', { class: 'muted small' }, t('figureHint')));
  frame.addEventListener('error', () => wrap.remove());
  return wrap;
}

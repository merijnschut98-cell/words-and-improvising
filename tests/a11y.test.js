import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

const lum = (hex) => {
  const c = hex.replace('#', '');
  const v = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
};
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
// Tokens of one CSS block, e.g. the first `:root {` or `:root[data-theme="night"] {`.
function tokens(selectorStart) {
  const i = css.indexOf(selectorStart);
  assert.ok(i >= 0, selectorStart);
  const block = css.slice(i, css.indexOf('}', i));
  return Object.fromEntries([...block.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]));
}

const light = tokens(':root {');
const dark = { ...light, ...tokens('@media (prefers-color-scheme: dark) {\n  :root {') };
const themes = {
  light,
  dark,
  ocean: { ...light, ...tokens(':root[data-theme="ocean"]') },
  forest: { ...light, ...tokens(':root[data-theme="forest"]') },
  night: { ...light, ...tokens(':root[data-theme="night"]') },
};

test('muted text meets WCAG AA (4.5:1) on cards and background in every theme', () => {
  for (const [name, t] of Object.entries(themes)) {
    assert.ok(contrast(t.muted, t.card) >= 4.5, `${name} muted/card ${contrast(t.muted, t.card).toFixed(2)}`);
    assert.ok(contrast(t.muted, t.bg) >= 4.5, `${name} muted/bg ${contrast(t.muted, t.bg).toFixed(2)}`);
  }
});

test('white button text meets AA for large bold text (3:1) on primary and dark accent', () => {
  for (const [name, t] of Object.entries(themes)) {
    assert.ok(contrast('#ffffff', t.primary) >= 3, `${name} white/primary ${contrast('#ffffff', t.primary).toFixed(2)}`);
    assert.ok(contrast('#ffffff', t['accent-dark']) >= 3, `${name} white/accent-dark`);
  }
});

test('no hard-coded English aria-labels in the UI (all come from i18n)', () => {
  const dir = new URL('../src/ui/', import.meta.url);
  for (const f of fs.readdirSync(dir)) {
    const src = fs.readFileSync(new URL(f, dir), 'utf8');
    const hits = [...src.matchAll(/'aria-label':\s*'([^']+)'/g)].map((m) => m[1]);
    assert.deepEqual(hits, [], f);
  }
});

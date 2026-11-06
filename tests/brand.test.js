import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { load, KEY, defaultState } from '../src/core/storage.js';

const read = (f) => fs.readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
const css = read('styles.css');
const tokensCss = read('brand/tokens.css');

// ---- Contrast, WCAG 2 relative luminance ----
const lum = ([r, g, b]) => {
  const v = [r, g, b].map((x) => x / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
};
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// ---- Token resolution: styles.css maps its variables onto brand/tokens.css ----
// Declarations of one CSS block (up to its first closing brace).
function block(src, start) {
  const i = src.indexOf(start);
  assert.ok(i >= 0, start);
  const body = src.slice(i + start.length, src.indexOf('}', i));
  return Object.fromEntries([...body.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
}
// Every token, ignoring the reduced-motion override.
const tokens = Object.fromEntries([...tokensCss.replace(/@media[^{]*\{[\s\S]*?\}\s*\}/g, '')
  .matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));

const hex = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1).slice(i, i + 2), 16));
// Resolves a value to [r, g, b]: hex, var() chains and two-colour srgb color-mix().
function rgb(value, scope, depth = 0) {
  assert.ok(depth < 20, `cycle at ${value}`);
  const v = value.trim();
  if (/^#[0-9a-f]{6}$/i.test(v)) return hex(v);
  const ref = v.match(/^var\(--([a-z0-9-]+)\)$/);
  if (ref) {
    // The theme's own variables first (they may override a token), then the tokens.
    const next = scope[ref[1]] ?? tokens[ref[1]];
    assert.ok(next, `unknown --${ref[1]}`);
    return rgb(next, scope, depth + 1);
  }
  const mix = v.match(/^color-mix\(in srgb,\s*(.+?)\s+(\d+)%,\s*(.+)\)$/);
  if (mix) {
    const a = rgb(mix[1], scope, depth + 1);
    const b = rgb(mix[3], scope, depth + 1);
    const p = Number(mix[2]) / 100;
    return a.map((x, i) => Math.round(x * p + b[i] * (1 - p)));
  }
  throw new Error(`cannot resolve ${v}`);
}

const light = block(css, ':root {');
const darkAuto = block(css, '@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {');
const darkForced = block(css, ':root[data-theme="dark"] {');
const themes = { light, dark: { ...light, ...darkForced } };
const color = (theme, name) => rgb(`var(--${name})`, themes[theme]);

test('the system dark theme and the forced dark theme are the same', () => {
  assert.deepEqual(darkAuto, darkForced);
});

test('canvas, card and text use the Vantage values in both themes', () => {
  assert.deepEqual(color('light', 'bg'), hex('#E8DFCA'));
  assert.deepEqual(color('light', 'card'), hex('#F4EFE3'));
  assert.deepEqual(color('light', 'heading'), hex('#0B291B'));
  assert.deepEqual(color('light', 'ink'), hex('#1E3328'));
  assert.deepEqual(color('dark', 'bg'), hex('#0B291B'));
  assert.deepEqual(color('dark', 'card'), hex('#0D252B'));
  assert.deepEqual(color('dark', 'ink'), hex('#F0E9DA'));
});

test('muted text meets AA (4.5:1) on cards and on the canvas in both themes', () => {
  for (const name of Object.keys(themes)) {
    const m = color(name, 'muted');
    assert.ok(contrast(m, color(name, 'card')) >= 4.5, `${name} muted/card ${contrast(m, color(name, 'card')).toFixed(2)}`);
    assert.ok(contrast(m, color(name, 'bg')) >= 4.5, `${name} muted/bg ${contrast(m, color(name, 'bg')).toFixed(2)}`);
  }
});

test('body text meets AAA (7:1) on the canvas in both themes', () => {
  for (const name of Object.keys(themes)) {
    assert.ok(contrast(color(name, 'ink'), color(name, 'bg')) >= 7, `${name} ink/bg ${contrast(color(name, 'ink'), color(name, 'bg')).toFixed(2)}`);
    assert.ok(contrast(color(name, 'heading'), color(name, 'card')) >= 7, `${name} heading/card`);
  }
});

test('button and status text meet AA (4.5:1) in both themes', () => {
  for (const name of Object.keys(themes)) {
    const pairs = [
      ['on-primary', 'primary'], ['bone', 'accent-fill'], ['bone', 'secondary-fill'],
      ['accent-dark', 'card'], ['accent-dark', 'bg'], ['good', 'card'], ['bad', 'card'], ['ok-text', 'card'], ['bg', 'heading'],
    ];
    for (const [fg, bg] of pairs) {
      const c = contrast(color(name, fg), color(name, bg));
      assert.ok(c >= 4.5, `${name} ${fg}/${bg} ${c.toFixed(2)}`);
    }
  }
});

test('no gradients, no pills, no retired colours in the stylesheet', () => {
  assert.ok(!/gradient\(/.test(css), 'gradient');
  assert.ok(!/border-radius:[^;]*\b(999|[1-9]\d)px/.test(css), 'radius above 10px');
  assert.ok(!/@keyframes (pop|confetti)\b/.test(css), 'pop or confetti keyframes');
  assert.ok(!/#d8b45c|#e08472/i.test(css), 'gold or coral');
  assert.ok(!/border-left:\s*\d+px solid/.test(css), 'coloured left-border card');
});

// ---- No emoji anywhere in the app's own source ----
test('no emoji in src (course content excepted)', () => {
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true })
    .flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));
  const files = walk('src').filter((f) => f.endsWith('.js') && !f.split(path.sep).join('/').startsWith('src/content/courses/'));
  assert.ok(files.length > 40);
  for (const f of files) {
    const hits = [...fs.readFileSync(f, 'utf8').matchAll(/\p{Extended_Pictographic}/gu)].map((m) => m[0]);
    assert.deepEqual(hits, [], f);
  }
});

test('no emoji or exclamation marks in the en and nl strings', async () => {
  const { STRINGS } = await import('../src/i18n.js');
  const flat = (v) => (typeof v === 'function' ? [v(1, 2, 3, 4)] : Array.isArray(v) ? v : v && typeof v === 'object' ? Object.values(v).flatMap(flat) : [v]);
  for (const lang of ['en', 'nl']) {
    for (const [k, v] of Object.entries(STRINGS[lang])) {
      for (const s of flat(v)) {
        assert.ok(!/\p{Extended_Pictographic}/u.test(String(s)), `${lang}.${k}`);
        assert.ok(!/!/.test(String(s)), `${lang}.${k}: ${s}`);
        assert.ok(!/Spraakwater/.test(String(s)), `${lang}.${k}: old name`);
      }
    }
  }
});

// ---- Name, manifest and offline shell ----
test('the app is called Vantage Point', () => {
  const manifest = JSON.parse(read('manifest.webmanifest'));
  assert.equal(manifest.name, 'Vantage Point');
  assert.equal(manifest.short_name, 'Vantage Point');
  assert.equal(manifest.background_color, '#E8DFCA');
  assert.equal(manifest.theme_color, '#0B291B');
  assert.match(read('index.html'), /<title>Vantage Point<\/title>/);
});

test('brand files, fonts and tokens are linked and precached', () => {
  const html = read('index.html');
  assert.ok(html.indexOf('brand/tokens.css') > 0 && html.indexOf('brand/tokens.css') < html.indexOf('styles.css'), 'tokens before styles.css');
  const sw = read('sw.js');
  assert.match(sw, /const CACHE = 'vantage-point-v\d+';/);
  for (const f of ['brand/tokens.css', 'brand/mark.svg', 'brand/mark-on-dark.svg', ...fs.readdirSync('fonts').map((x) => `fonts/${x}`)]) {
    assert.ok(fs.existsSync(f), f);
    assert.ok(sw.includes(`'${f}'`), `${f} missing from sw.js`);
  }
  assert.equal(fs.readdirSync('fonts').filter((f) => f.endsWith('.woff2')).length, 6);
  for (const m of tokensCss.matchAll(/url\('([^']+)'\)/g)) assert.ok(fs.existsSync(path.join('brand', m[1])), m[1]);
  // A stray */ inside a comment once swallowed the roman Fraunces face: every face must be live CSS.
  const live = tokensCss.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.ok(!live.includes('*/'), 'unbalanced comment in tokens.css');
  assert.equal((live.match(/@font-face/g) || []).length, 6);
});

// ---- Themes ----
test('retired colour themes load as auto, and the storage key never changes', () => {
  assert.equal(KEY, 'spraakwater:v1');
  const backend = (theme) => ({ getItem: () => JSON.stringify({ ...defaultState(), settings: { ...defaultState().settings, theme } }), setItem() {} });
  for (const old of ['default', 'ocean', 'forest', 'night']) assert.equal(load(backend(old)).settings.theme, 'auto');
  assert.equal(load(backend('dark')).settings.theme, 'dark');
});

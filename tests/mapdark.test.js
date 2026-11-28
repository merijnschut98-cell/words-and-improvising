// Review of the map (14 Nov): in dark mode a lit place (the focus glow of a film,
// the marked next module in the app) put a light label on light blue. Lit labels
// now carry a halo in the card colour, set by --map-halo in both dark blocks of
// styles.css (the system path and the Dark setting) and not at all in light.
// The films carry the same variable (films/_kit/mapscene.mjs, dark default, none
// in light).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { mapStyles } from '../films/_kit/mapscene.mjs';

const CSS = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

test('lit map labels have a halo in both dark paths and none in light', () => {
  const sys = CSS.match(/@media \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme="light"\]\) \{[^}]*\}/)[0];
  const set = CSS.match(/:root\[data-theme="dark"\] \{[^}]*\}/)[0];
  assert.match(sys, /--map-halo: var\(--card\)/);
  assert.match(set, /--map-halo: var\(--card\)/);
  assert.doesNotMatch(CSS.match(/:root \{[^}]*\}/)[0], /--map-halo/);
  assert.match(CSS, /\.subject-map \.map-place\.is-lit \.map-label, \.subject-map \.map-place\.is-next \.map-label \{[^}]*stroke: var\(--map-halo, none\)/);
});

test('the films: halo on in the dark default, none in light', () => {
  const css = mapStyles();
  assert.match(css, /\.subject-map\{[^}]*--map-halo:var\(--anatomy-face\)/);
  assert.match(css, /\.iso\[data-theme="light"\] \.subject-map\{[^}]*--map-halo:none/);
});

test('label on its halo is at least 4.5:1 in the dark theme of the app and of the films', () => {
  const tokens = fs.readFileSync(new URL('../brand/tokens.css', import.meta.url), 'utf8');
  const hex = (name) => {
    let v = new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6}|var\\(--[\\w-]+\\))`).exec(tokens)[1];
    while (v.startsWith('var(')) v = new RegExp(`${v.slice(4, -1)}:\\s*(#[0-9a-fA-F]{6}|var\\(--[\\w-]+\\))`).exec(tokens)[1];
    return v;
  };
  assert.ok(ratio(hex('text-heading-inverse'), hex('surface-paper-inverse')) >= 4.5, 'app, dark');
  // the film palette's dark block (the first in player.mjs): anatomy-strong on anatomy-face (11.52 today)
  const player = fs.readFileSync(new URL('../films/_kit/player.mjs', import.meta.url), 'utf8');
  const film = (name) => new RegExp(`--anatomy-${name}:(#[0-9a-fA-F]{6})`).exec(player)[1];
  assert.ok(ratio(film('strong'), film('face')) >= 4.5, 'films, dark');
});

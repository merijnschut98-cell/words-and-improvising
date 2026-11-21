import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const MARK = '@media (min-width: 1024px) {';
const at = css.indexOf(MARK);
const desktop = css.slice(at);
const phone = css.slice(0, at);

test('desktop layout: one min-width 1024 block, last in the stylesheet, and no other tablet/desktop breakpoint', () => {
  assert.ok(at > 0, 'desktop block exists');
  assert.equal(css.split(MARK).length, 2, 'exactly one desktop block');
  assert.ok(css.trimEnd().endsWith('}'), 'block closes the file');
  assert.ok(!/min-width:\s*([6-9]\d\d|1\d{3})px/.test(phone), 'nothing above 600 px widens the phone layout');
});

test('phone layout is untouched: the column stays 560 px and the navbar stays full width outside the block', () => {
  assert.match(phone, /\.app \{ max-width: 560px;/);
  assert.match(phone, /\.navbar \{\s*position: fixed; bottom: 0; left: 0; right: 0;/);
  assert.match(phone, /\.subject-bar \{[^}]*max-width: 560px/);
});

test('desktop layout: 1080 px column, readable 720 px reading screens, columns where cards are independent', () => {
  assert.match(desktop, /\.app \{ max-width: 1080px; \}/);
  assert.match(desktop, /\.screen \{[^}]*max-width: 720px/);
  assert.match(desktop, /\.screen\.course-home \{ display: grid; grid-template-columns: minmax\(0, 6fr\) minmax\(0, 5fr\)/);
  assert.match(desktop, /\.screen\.speak-home \.bands \{ display: block; column-count: 2/);
  assert.match(desktop, /\.screen\.tour \{ display: grid; grid-template-columns: repeat\(3/);
  assert.match(desktop, /\.start-cards \{ display: grid; grid-template-columns: repeat\(3/);
});

test('desktop layout adds no colours and no gradients', () => {
  assert.ok(!/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|gradient\(/.test(desktop));
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Every shipped module must be in the service worker shell, or the app breaks offline.
test('service worker precaches every source file', () => {
  const sw = fs.readFileSync('sw.js', 'utf8');
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true })
    .flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));
  for (const file of walk('src')) assert.ok(sw.includes(`'${file}'`), `${file} missing from sw.js`);
  for (const file of fs.readdirSync('icons').filter((f) => !f.startsWith('maskable.svg'))) {
    assert.ok(sw.includes(`'icons/${file}'`), `icons/${file} missing from sw.js`);
  }
});

// The Pages deploy copies an explicit list; anything the app loads must be on it.
test('the deploy copies every top-level path the service worker precaches', () => {
  const sw = fs.readFileSync('sw.js', 'utf8');
  const wf = fs.readFileSync('.github/workflows/pages.yml', 'utf8');
  const cp = (wf.match(/cp -r ([^\n]+) _site\//) || [])[1] || '';
  const copied = new Set(cp.trim().split(/\s+/));
  const shell = [...sw.matchAll(/'([^']+)'/g)].map((m) => m[1]).filter((p) => /^[\w.-]+(\/|$)/.test(p) && !p.startsWith('http'));
  for (const p of shell) {
    if (p === './') continue;
    const top = p.split('/')[0];
    if (!/\./.test(top) && !p.includes('/')) continue;
    assert.ok(copied.has(top), `${p}: '${top}' is not copied by the deploy`);
  }
});

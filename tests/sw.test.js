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

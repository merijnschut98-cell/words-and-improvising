import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// The install handler maps SHELL to Requests and hands them to cache.addAll. A
// hole in the array (a doubled comma, left by a merge) becomes `undefined`,
// addAll rejects and the new service worker never installs.
test('the service-worker SHELL list has no holes and no duplicates', () => {
  const sw = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
  const body = sw.split('const SHELL')[1].split('];')[0].split('[').slice(1).join('[');
  assert.ok(!/'\s*,\s*,/.test(body), 'no doubled comma in SHELL');
  const items = [...body.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  assert.equal(new Set(items).size, items.length, 'no duplicate SHELL entry');
});

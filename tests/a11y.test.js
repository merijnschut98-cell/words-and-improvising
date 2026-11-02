import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Colour contrast for both themes lives in brand.test.js (it resolves the Vantage tokens).

test('no hard-coded English aria-labels in the UI (all come from i18n)', () => {
  const dir = new URL('../src/ui/', import.meta.url);
  for (const f of fs.readdirSync(dir)) {
    const src = fs.readFileSync(new URL(f, dir), 'utf8');
    const hits = [...src.matchAll(/'aria-label':\s*'([^']+)'/g)].map((m) => m[1]);
    assert.deepEqual(hits, [], f);
  }
});

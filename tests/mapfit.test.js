// The drawn subject map must stay inside its card. The browser check is
// e2e/mapfit.mjs (bounding boxes at 320..1280 px); this guards the rule that
// broke it: a negative margin on the map wrapper bleeds past the card's padding.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const CSS = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

test('the map wrapper never has a negative margin or an overflow bleed', () => {
  const rules = CSS.match(/[^{}]*\.subject-map-wrap[^{}]*\{[^}]*\}/g) || [];
  assert.ok(rules.length > 0, 'the .subject-map-wrap rule exists');
  for (const r of rules) {
    assert.doesNotMatch(r, /margin[^;]*-\d/, `negative margin pulls the map out of its card: ${r.trim()}`);
    assert.doesNotMatch(r, /(?:^|[;{\s])width:\s*(?:100vw|calc\([^)]*vw)/, `viewport-wide map: ${r.trim()}`);
  }
});

// 21 Nov (Merijn chose "hercoderen en snoeien" for the Supabase storage limit): films are encoded at
// CRF 34 with 64 kbit/s mono audio, about half the size of CRF 26 / 96k with no visible loss on the
// drawn text (checked on eng.field.run). A render must not fall back to the old, larger settings.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('the render kit encodes films at CRF 34 and 64k mono audio', () => {
  const src = fs.readFileSync('films/_kit/render.mjs', 'utf8');
  assert.match(src, /'-crf', '34'/);
  assert.match(src, /'-b:a', '64k'/);
  assert.doesNotMatch(src, /'-crf', '26'|'-b:a', '96k'/);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installFakeDom } from './fixtures/fakedom.js';
import { translator } from '../src/i18n.js';

installFakeDom();
const { guideSvg, guide, guideLine, guideOn } = await import('../src/ui/guide.js');
const segs = (svg, cls) => [...svg.matchAll(/<g class="([^"]*\bg-seg\b[^"]*)"/g)].map((m) => m[1]).find((c) => c.includes(cls));

test('guide renders three segments; state right lights the top, wrong the middle, celebrate all', () => {
  const idle = guideSvg('idle');
  for (const c of ['g-top', 'g-mid', 'g-low']) assert.ok(segs(idle, c), c);
  assert.ok(!/\b(on|warn)\b/.test(['g-top', 'g-mid', 'g-low'].map((c) => segs(idle, c)).join(' ')));
  const right = guideSvg('right');
  assert.match(segs(right, 'g-top'), /\bon\b/);
  assert.doesNotMatch(segs(right, 'g-mid'), /\b(on|warn)\b/);
  const wrong = guideSvg('wrong');
  assert.match(segs(wrong, 'g-mid'), /\bwarn\b/);
  assert.doesNotMatch(segs(wrong, 'g-top'), /\bon\b/);
  const all = guideSvg('celebrate');
  for (const c of ['g-top', 'g-mid', 'g-low']) assert.match(segs(all, c), /\bon\b/, c);
});

test('guide SVG is aria-hidden and uses no hex colours (fills come from CSS classes)', () => {
  for (const st of ['idle', 'right', 'wrong', 'celebrate']) {
    const svg = guideSvg(st);
    assert.match(svg, /aria-hidden="true"/);
    assert.doesNotMatch(svg, /#[0-9a-f]{3,6}\b/i);
    assert.doesNotMatch(svg, /\b(fill|stroke)="(?!none)/, 'no inline paint');
    assert.doesNotMatch(svg, /rgb\(/);
  }
  // Isometric solids: a dozen or so, each with a lit top and two side tones.
  const svg = guideSvg('idle');
  assert.ok((svg.match(/class="t-top/g) || []).length >= 10);
  assert.ok((svg.match(/class="t-left/g) || []).length >= 10);
});

test('guideLine picks from the pool seeded by day and never repeats the last line', () => {
  const t = translator('nl');
  const pool = t('guideWrong');
  const a = guideLine(t, 'guideWrong', '2026-11-02');
  assert.ok(pool.includes(a));
  assert.equal(guideLine(t, 'guideWrong', '2026-11-02'), a, 'same day, same line');
  for (let i = 0; i < 10; i++) {
    const day = `2026-11-${String(i + 1).padStart(2, '0')}`;
    const first = guideLine(t, 'guideWrong', day);
    assert.notEqual(guideLine(t, 'guideWrong', day, first), first);
  }
  const days = new Set(Array.from({ length: 12 }, (_, i) => guideLine(t, 'guideDone', `2026-12-${String(i + 1).padStart(2, '0')}`)));
  assert.ok(days.size > 1, 'rotates across days');
});

test('guide is not rendered when settings.guide is false', () => {
  assert.equal(guideOn({ settings: { guide: false } }), false);
  assert.equal(guideOn({ settings: {} }), true);
  assert.equal(guide({ settings: { guide: false } }, { mood: 'right' }), null);
  const el = guide({ settings: { guide: true } }, { mood: 'wrong', size: 32 });
  assert.equal(el.getAttribute('aria-hidden'), 'true');
  assert.ok(el.classList.contains('guide'));
  assert.ok(el.classList.contains('guide-32'));
  assert.match(el.innerHTML, /g-mid[^"]*warn/);
});

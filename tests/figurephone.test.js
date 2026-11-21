// The figures' phone layout: the pure helpers inlined into every figure page,
// the build step that adds them, and the app side (srcdoc loading, messages).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  PHONE_MAX, MIN_TEXT, isPhone, searchOf, levelOf, unionBox, intersectBox, cropBox, levelCrop, textFix, phoneHeight, zoomBox,
} from '../figures/_kit/phone-core.mjs';
import { finishFigure, SEARCH, phoneScript } from '../figures/_kit/phone.mjs';
import { loadFigure, figureMessage, figureHeight } from '../src/ui/figure.js';

test('isPhone: below 480 px only', () => {
  assert.equal(PHONE_MAX, 480);
  assert.equal(isPhone(326), true);
  assert.equal(isPhone(479), true);
  assert.equal(isPhone(480), false);
  assert.equal(isPhone(0), false);
});

test('searchOf: the URL first, then a frame name that is a query string', () => {
  assert.equal(searchOf('?level=2', '?level=3'), '?level=2');
  assert.equal(searchOf('', '?theme=dark&level=3'), '?theme=dark&level=3');
  assert.equal(searchOf('?', '?level=3'), '?level=3');
  assert.equal(searchOf('', 'some-frame'), '');
  assert.equal(searchOf('', undefined), '');
});

test('levelOf: 1–4, anything else is 0', () => {
  assert.equal(levelOf('?theme=dark&level=3'), 3);
  assert.equal(levelOf('?level=7'), 0);
  assert.equal(levelOf(''), 0);
});

test('boxes: union skips empty ones; intersection may be nothing', () => {
  assert.deepEqual(unionBox([[0, 0, 10, 10], null, [5, -5, 10, 5], [1, 1, 0, 4]]), [0, -5, 15, 15]);
  assert.equal(unionBox([]), null);
  assert.deepEqual(intersectBox([0, 0, 10, 10], [5, 5, 10, 10]), [5, 5, 5, 5]);
  assert.equal(intersectBox([0, 0, 1, 1], [5, 5, 1, 1]), null);
  assert.deepEqual(intersectBox(null, [1, 2, 3, 4]), [1, 2, 3, 4]);
});

test('cropBox: the drawn part with air, inside the viewBox, never a sliver', () => {
  const vb = [0, 0, 600, 400];
  assert.deepEqual(cropBox([100, 100, 200, 100], vb, { pad: 0 }), [100, 100, 200, 100]);
  // 4 % air on each side
  assert.deepEqual(cropBox([100, 100, 200, 100], vb), [92, 96, 216, 108]);
  // never past the viewBox
  assert.deepEqual(cropBox([-50, -50, 800, 600], vb), vb);
  // a tall narrow crop is widened around its centre
  const c = cropBox([290, 0, 20, 400], vb, { pad: 0 });
  assert.equal(c[3], 400);
  assert.equal(c[2], 300);
  assert.equal(c[0] + c[2] / 2, 300);
  // nothing drawn: the viewBox stays
  assert.deepEqual(cropBox(null, vb), vb);
});

test('levelCrop: the level first, then "all"; a malformed crop is none', () => {
  const crops = { 2: [1, 2, 3, 4], all: [0, 0, 10, 10] };
  assert.deepEqual(levelCrop(crops, 2), [1, 2, 3, 4]);
  assert.deepEqual(levelCrop(crops, 3), [0, 0, 10, 10]);
  assert.equal(levelCrop({ 1: [0, 0, 0, 5] }, 1), null);
  assert.equal(levelCrop(null, 1), null);
});

test('textFix: keep from 11 px, grow a little, hide what would have to grow too much', () => {
  assert.equal(MIN_TEXT, 11);
  assert.deepEqual(textFix(11), { op: 'keep' });
  assert.deepEqual(textFix(14), { op: 'keep' });
  assert.deepEqual(textFix(9.5), { op: 'grow', factor: 1.158 });
  assert.deepEqual(textFix(5), { op: 'hide' });
  assert.deepEqual(textFix(0), { op: 'keep' });
});

test('phoneHeight: the drawing in its proportions plus the rows, within limits', () => {
  assert.equal(phoneHeight(300, [0, 0, 400, 300], 120), 345);
  // a strip-like crop still gets 42 % of the width
  assert.equal(phoneHeight(300, [0, 0, 600, 100], 100), 226);
  // a tall crop is held at 1.3 × the width
  assert.equal(phoneHeight(300, [0, 0, 100, 600], 100), 490);
  assert.equal(phoneHeight(300, [0, 0, 100, 600], 100, { max: 400 }), 400);
  assert.equal(phoneHeight(300, null, 0), 225);
});

test('zoomBox: zoom about a point, stay inside the home box, 1 × is home', () => {
  const home = [0, 0, 400, 200];
  assert.deepEqual(zoomBox(home, 1, 50, 50), home);
  assert.deepEqual(zoomBox(home, 2, 200, 100), [100, 50, 200, 100]);
  assert.deepEqual(zoomBox(home, 2, 0, 0), [0, 0, 200, 100]);
  assert.deepEqual(zoomBox(home, 4, 400, 200), [300, 150, 100, 50]);
});

test('finishFigure: parameters from URL or frame name, phone CSS and script once', () => {
  const page = '<!doctype html><html><head><title>x</title><script>var q=new URLSearchParams(location.search)</script></head><body><main></main><script type="module">const p=new URLSearchParams(location.search)</script></body></html>';
  const out = finishFigure(page, { crop: { 1: [0, 0, 10, 10] } });
  assert.equal(out.includes('URLSearchParams(location.search)'), false);
  assert.equal(out.split(SEARCH).length - 1, 2);
  assert.match(out, /<style id="vp-phone-css">[\s\S]*<\/style><\/head>/);
  assert.match(out, /<script type="application\/json" id="vp-phone-config">\{"crop":\{"1":\[0,0,10,10\]\}\}<\/script><script type="module" id="vp-phone">[\s\S]*<\/script><\/body><\/html>$/);
  assert.throws(() => finishFigure(out), /already/);
  assert.throws(() => finishFigure('<p>half</p>'), /whole page/);
  assert.equal(finishFigure(page).includes('id="vp-phone-config"'), false);
  // a figure's own phone rules and script
  const own = finishFigure(page, { css: 'html.vp-phone .x{color:red}', script: 'window.__own=1' });
  assert.match(own, /html\.vp-phone \.x\{color:red\}<\/style><\/head>/);
  assert.match(own, /window\.__own=1<\/script><\/body>/);
  // the inlined script is plain code: no exports, no closing script tag
  assert.equal(/^export /m.test(phoneScript()), false);
  // the SEARCH expression behaves like searchOf
  const run = (search, name) => new Function('location', 'window', `return ${SEARCH};`)({ search }, { name });
  for (const [s, n] of [['?level=2', '?level=3'], ['', '?level=3'], ['', 'frame'], ['?', '?a=1']]) assert.equal(run(s, n), searchOf(s, n));
});

test('every shipped figure page carries the phone layout and reads its parameters offline-safe', () => {
  const dir = 'src/content/courses/figures';
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.html'));
  assert.ok(files.length >= 40);
  for (const f of files) {
    const html = fs.readFileSync(`${dir}/${f}`, 'utf8');
    assert.equal((html.match(/id="vp-phone"/g) || []).length, 1, `${f}: phone script`);
    assert.ok(html.includes('id="vp-phone-css"'), `${f}: phone css`);
    // the figure's own code (the phone script reads it through searchOf)
    const own = html.slice(0, html.indexOf('id="vp-phone"')).replaceAll(SEARCH, '');
    assert.equal(own.includes('location.search'), false, `${f}: a bare location.search read`);
  }
});

test('loadFigure: fetched without the query (the service worker answers offline), srcdoc plus frame name', async () => {
  const frame = {};
  const asked = [];
  const ok = await loadFigure(frame, 'src/content/courses/figures/a.b.html?theme=dark&lang=en&level=2', async (u) => { asked.push(u); return { ok: true, text: async () => '<p>fig</p>' }; });
  assert.equal(ok, true);
  assert.deepEqual(asked, ['src/content/courses/figures/a.b.html']);
  assert.equal(frame.srcdoc, '<p>fig</p>');
  assert.equal(frame.name, '?theme=dark&lang=en&level=2');
  const missing = {};
  assert.equal(await loadFigure(missing, 'a.html?x=1', async () => ({ ok: false, text: async () => '' })), false);
  assert.equal('srcdoc' in missing, false);
  const offline = {};
  assert.equal(await loadFigure(offline, 'a.html', async () => { throw new TypeError('Failed to fetch'); }), false);
  assert.equal('srcdoc' in offline, false);
});

test('figureMessage: only well-formed messages from its own frame', () => {
  const own = {};
  const ok = (data, source = own) => figureMessage({ source, data }, own);
  assert.deepEqual(ok({ type: 'vp-figure', op: 'size', height: 412 }), { op: 'size', height: 412 });
  assert.deepEqual(ok({ type: 'vp-figure', op: 'full', on: 1 }), { op: 'full', on: true });
  assert.equal(ok({ type: 'vp-figure', op: 'size', height: 412 }, {}), null);
  assert.equal(ok({ type: 'vp-figure', op: 'size', height: 'tall' }), null);
  assert.equal(ok({ type: 'vp-film', op: 'full' }), null);
  assert.equal(ok({ type: 'vp-figure', op: 'navigate' }), null);
  assert.equal(ok(null), null);
});

test('figureHeight: what the figure asked, kept between a strip and the screen', () => {
  assert.equal(figureHeight(412, 844), 412);
  assert.equal(figureHeight(100, 844), 220);
  assert.equal(figureHeight(2000, 640), 550);
  assert.equal(figureHeight(400, 200), 260);
});

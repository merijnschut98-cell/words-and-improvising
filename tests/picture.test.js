// v18 G1: the picture kit and the lesson `pictures` field.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { pictureSvg, pictureLabels, KINDS, PIC_W, PIC_FONT, wrap } from '../src/ui/picture.js';
import { checkPictures, checkPictureData, checkModulePictures, checkPictureLabels, MAX_ALT_WORDS } from '../src/content/courses/validate.js';
import { MODULES, loadModule, loadPictures } from '../src/content/courses/index.js';
import { filmAtEnd, picturesAfter, lessonPhases } from '../src/core/course.js';

const L = (en, nl) => ({ en, nl });
const SAMPLES = {
  table: { kind: 'table', head: [L('Family', 'Familie'), L('Methods', 'Methoden')], rows: [[L('Agile', 'Agile'), [L('Scrum', 'Scrum'), L('Kanban', 'Kanban')]]] },
  grid: { kind: 'grid', cols: [L('Low', 'Laag'), L('High', 'Hoog')], rows: [L('High', 'Hoog'), L('Low', 'Laag')], cells: [[L('Keep informed', 'Informeren'), L('Manage closely', 'Nauw betrekken')], [L('Monitor', 'Volgen'), L('Keep satisfied', 'Tevreden houden')]], tone: [[1, 3], [0, 2]], xTitle: L('Influence', 'Invloed'), yTitle: L('Interest', 'Belang') },
  cycle: { kind: 'cycle', steps: [L('Plan', 'Plan'), L('Do', 'Doe'), L('Check', 'Check'), L('Act', 'Act')], center: L('PDCA', 'PDCA') },
  flow: { kind: 'flow', steps: [L('Define', 'Definiëren'), { label: L('Measure', 'Meten'), note: L('Baseline', 'Nulmeting') }, L('Control', 'Borgen')] },
  tree: { kind: 'tree', root: { label: L('Project', 'Project'), children: [{ label: L('Phase one', 'Fase een'), children: [{ label: L('Task', 'Taak') }] }, { label: L('Phase two', 'Fase twee') }] } },
  timeline: { kind: 'timeline', events: [{ at: L('Week 1', 'Week 1'), label: L('Kick-off', 'Aftrap') }, { at: L('Week 12', 'Week 12'), label: L('Handover', 'Overdracht') }] },
};

test('every kind draws an accessible inline svg in both languages', () => {
  assert.deepEqual(Object.keys(SAMPLES).sort(), [...KINDS].sort());
  for (const [kind, pic] of Object.entries(SAMPLES)) {
    for (const lang of ['nl', 'en']) {
      const svg = pictureSvg(pic, lang, 'Alt "text" <b>');
      assert.match(svg, /^<svg [^>]*role="img"/, kind);
      assert.ok(svg.includes('aria-label="Alt &quot;text&quot; &lt;b&gt;"'), `${kind} alt is escaped`);
      assert.ok(!/<iframe|<script|<image|<foreignObject|href=/i.test(svg), `${kind} is plain svg`);
      assert.ok(!/#[0-9a-f]{3,6}\b|rgb\(|fill="|stroke="/i.test(svg), `${kind}: colours come from CSS classes`);
      for (const label of pictureLabels(pic, lang)) for (const w of label.split(' ')) assert.ok(svg.includes(w), `${kind} ${lang} shows "${label}"`); // a long label wraps over lines
      const vb = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
      assert.equal(Number(vb[1]), PIC_W);
      // legible at 390 px: the card is about 326 px wide, so 1 unit is at least 0.9 px
      assert.ok(PIC_FONT * (326 / PIC_W) >= 13, 'text stays at 13 px or more on a phone');
    }
  }
  assert.equal(pictureSvg({ kind: 'nope' }, 'en'), '');
});

test('text stays inside the picture: wrapped lines never run past their box', () => {
  assert.deepEqual(wrap('one two three four', 9), ['one two', 'three', 'four']);
  const svg = pictureSvg(SAMPLES.table, 'en', 'x');
  for (const m of svg.matchAll(/<text[^>]* x="([\d.]+)"[^>]*>([^<]*)</g)) assert.ok(Number(m[1]) + m[2].length * PIC_FONT * 0.5 <= PIC_W + 1, m[2]);
});

test('review fixes: a far too wide word is broken, tone is also a bar count, cycle nodes do not overlap', () => {
  assert.ok(wrap('Onwaarschijnlijkheidsverdeling', 10).length > 1);
  assert.deepEqual(wrap('Waarschijnlijk', 12), ['Waarschijnlijk']);
  const svg = pictureSvg(SAMPLES.grid, 'en', 'x');
  assert.equal((svg.match(/class="pic-bar"/g) || []).length, 1 + 3 + 0 + 2, 'bars = sum of the tones');
  const eight = { kind: 'cycle', steps: Array.from({ length: 8 }, (_, i) => L(`S${i}`, `S${i}`)) };
  const xs = [...pictureSvg(eight, 'en', 'x').matchAll(/<rect class="pic-box pic-node"[^>]* x="([\d.-]+)" y="([\d.-]+)" width="([\d.]+)"/g)].map((m) => [Number(m[1]), Number(m[2]), Number(m[3])]);
  assert.equal(xs.length, 8);
  for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) assert.ok(Math.abs(xs[i][0] - xs[j][0]) >= xs[i][2] || Math.abs(xs[i][1] - xs[j][1]) >= 33, `nodes ${i} and ${j} overlap`);
});

test('the styles carry every picture class, with tokens only', () => {
  const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  for (const c of ['pic-svg', 'pic-box', 'pic-head', 'pic-rowhead', 'pic-node', 'pic-t0', 'pic-t3', 'pic-text', 'pic-bold', 'pic-onhead', 'pic-line', 'pic-arrow', 'pic-dot', 'pic-bar', 'film-end']) assert.ok(css.includes(`.${c}`), c);
  const block = css.slice(css.indexOf('v18 G1: lesson pictures'));
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(block), 'no hard-coded colour in the picture styles');
});

const lesson = (over = {}) => ({ id: 'pm.approach.x', teach: ['a', 'b', 'c'], pictures: [{ id: 'pm.approach.x.map', after: 1, alt: 'A table of things.' }], ...over });
const check = (l, pics = { 'pm.approach.x.map': SAMPLES.table }) => { const e = []; checkPictures([l], pics, 'pm.approach', 'en', e); return e; };

test('the pictures field validates id, after, alt, count and existence', () => {
  assert.deepEqual(check(lesson()), []);
  assert.deepEqual(check(lesson({ pictures: [{ id: 'pm.approach.x.map', after: 'example', alt: 'ok' }] })), []);
  assert.match(check(lesson({ pictures: [{ id: 'pm.other.x', after: 0, alt: 'ok' }] })).join(), /id must be like pm\.approach/);
  assert.match(check(lesson({ pictures: [{ id: 'pm.approach.X!', after: 0, alt: 'ok' }] })).join(), /id must be like/);
  assert.match(check(lesson({ pictures: [{ id: 'pm.approach.x.map', after: 3, alt: 'ok' }] })).join(), /after must be/);
  assert.match(check(lesson({ pictures: [{ id: 'pm.approach.x.map', after: -1, alt: 'ok' }] })).join(), /after must be/);
  assert.match(check(lesson({ pictures: [{ id: 'pm.approach.x.map', after: 'end', alt: 'ok' }] })).join(), /after must be/);
  assert.match(check(lesson({ pictures: [{ id: 'pm.approach.x.map', after: 0 }] })).join(), /alt text missing/);
  assert.match(check(lesson({ pictures: [{ id: 'pm.approach.x.map', after: 0, alt: Array(MAX_ALT_WORDS + 1).fill('w').join(' ') }] })).join(), /alt has 31 words/);
  assert.match(check(lesson(), {}).join(), /not in pictures\/pm\.approach\.js/);
  assert.match(check(lesson(), null).join(), /not in pictures/);
  const three = ['a', 'b', 'c'].map((n) => ({ id: `pm.approach.x.${n}`, after: 0, alt: 'ok' }));
  assert.match(check(lesson({ pictures: three })).join(), /1 to 2 entries/);
  assert.match(check(lesson({ pictures: [] })).join(), /1 to 2 entries/);
  assert.deepEqual(check({ id: 'pm.approach.y', teach: [] }), [], 'a lesson without the field is untouched');
});

test('picture data checks: kind, both languages, shape', () => {
  const e = (pic) => { const errs = []; checkPictureData(pic, 'p', errs); return errs.join(); };
  for (const pic of Object.values(SAMPLES)) assert.equal(e(pic), '');
  assert.match(e({ kind: 'pie' }), /kind must be/);
  assert.match(e({ kind: 'table', head: [{ en: 'only en' }], rows: [] }), /nl and en/);
  assert.match(e({ ...SAMPLES.cycle, steps: [L('a', 'a'), L('b', 'b')] }), /3 to 8 steps/);
  assert.match(e({ ...SAMPLES.grid, cells: [] }), /one row of cells/);
});

test('the labels of a picture must occur in the lesson text, in the same language', () => {
  const l = { id: 'pm.approach.x', pictures: [{ id: 'p' }], teach: ['Agile has Scrum and Kanban.'], example: { text: 'x' }, terms: [{ term: 'Family', def: 'A group of methods' }] };
  const en = []; checkPictureLabels(l, { p: SAMPLES.table }, 'en', en);
  assert.deepEqual(en, []);
  const nl = []; checkPictureLabels(l, { p: SAMPLES.table }, 'nl', nl);
  assert.match(nl.join(), /Familie/);
  const miss = []; checkPictureLabels({ ...l, teach: ['Agile has Scrum.'] }, { p: SAMPLES.table }, 'en', miss);
  assert.match(miss.join(), /"Kanban"/);
});

test('every picture file in the course content is valid and supported by its lesson text', async () => {
  let found = 0;
  for (const m of MODULES) {
    if (!existsSync(new URL(`../src/content/courses/pictures/${m.id}.js`, import.meta.url))) continue;
    found += 1;
    const pics = await loadPictures(m.id);
    const [en, nl] = [await loadModule(m.subject, m.id, 'en'), await loadModule(m.subject, m.id, 'nl')];
    assert.deepEqual(checkModulePictures(en, nl, pics, m.id), [], m.id);
    for (const [id, pic] of Object.entries(pics)) for (const lang of ['nl', 'en']) assert.ok(pictureSvg(pic, lang, 'x').length > 100, `${id} ${lang}`);
  }
  assert.ok(found >= 1);
});

test('pm.approach.families has the families table, nl and en', async () => {
  const pics = await loadPictures('pm.approach');
  const pic = pics['pm.approach.families.map'];
  assert.equal(pic.kind, 'table');
  for (const lang of ['en', 'nl']) {
    const les = (await loadModule('pm', 'pm.approach', lang)).lessons.find((x) => x.id === 'pm.approach.families');
    assert.equal(les.pictures.length, 1);
    assert.equal(les.pictures[0].id, 'pm.approach.families.map');
    assert.equal(les.pictures[0].after, 3, 'after the DMAIC block, when every family has been named');
    assert.equal(picturesAfter(les, 3).length, 1);
    const labels = pictureLabels(pic, lang);
    assert.equal(pic.rows.length, 5, 'four families and the mix');
    assert.equal(pic.rows.slice(0, 4).flatMap((r) => r[1]).length, 14, 'fourteen methods');
    assert.ok(labels.length > 14);
  }
});

test('a lesson with pictures and a text-first film moves the film to the end link', () => {
  const pics = [{ id: 'pm.run.x', after: 0, alt: 'a' }];
  assert.equal(filmAtEnd({ film: 'pm.run.escalation', pictures: pics }), true);
  assert.equal(filmAtEnd({ film: 'pm.run.escalation' }), false, 'no pictures: the button stays on the first block');
  assert.equal(filmAtEnd({ film: 'pm.run.escalation', pictures: [] }), false);
  assert.equal(filmAtEnd({ film: 'eng.machining.turning', pictures: pics }), false, 'a main film is never replaced');
  assert.equal(filmAtEnd({ pictures: pics }), false, 'no film, no link');
  assert.deepEqual(lessonPhases({ film: 'pm.run.escalation', pictures: pics }), ['teach', 'example', 'quiz']);
  assert.deepEqual(lessonPhases({ film: 'eng.machining.turning', pictures: pics }), ['film', 'quiz']);
});

test('the service worker caches the picture kit and its data', () => {
  const sw = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
  assert.ok(sw.includes("'src/ui/picture.js'"));
  assert.ok(sw.includes("'src/content/courses/pictures/pm.approach.js'"));
});

// Films against the lessons they serve. Every shipped film page embeds its data
// as JSON; these tests re-run the build's term, number, coverage and language
// checks on that JSON against the current lesson text. A lesson edit that
// removes a number or renames a term fails here until the film is rebuilt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULES, loadModule, placeOf } from '../src/content/courses/index.js';
import { validateModule } from '../src/content/courses/validate.js';
import { readFilmData, checkFilm, lessonTextOf, MAX_BYTES } from '../films/_kit/assert.mjs';

const DIR = 'src/content/courses/films';
const films = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5)) : [];

const q = (n) => ({ q: `Question ${n}?`, options: ['a', 'b', 'c', 'd'], answer: 'b', why: 'Because b.' });
const lesson = (id, extra = {}) => ({
  id, title: 'A title', pre: [q(0)], teach: ['Block one.', 'Block two.', 'Block three.'],
  example: { kind: 'worked', text: 'A worked example.' }, said: 'What engineers say.', recall: [q(1), q(2), q(3)],
  situation: { scene: 'A scene.', ask: 'Ask?', model: 'A model answer.', rubric: ['one', 'two', 'three'] },
  sayIt: 'Explain it.', terms: [{ term: 'Takt', def: 'Pace.' }, { term: 'WIP', def: 'Work.' }], ...extra,
});
const meta = { id: 'eng.fx', subject: 'eng', track: 'basics', level: 1, lessons: ['eng.fx.a', 'eng.fx.b'], questions: { 'eng.fx.a': 3, 'eng.fx.b': 3 } };
const nl = { lessons: [lesson('eng.fx.a'), lesson('eng.fx.b')] };

test('validateModule: a film is an id with an optional start scene #1–#9', () => {
  for (const film of ['eng.machining.turning', 'eng.machining.turning#3', 'eng.fx.x1#9']) {
    assert.deepEqual(validateModule({ lessons: [lesson('eng.fx.a', { film }), lesson('eng.fx.b')] }, nl, meta), [], film);
  }
  for (const film of ['../evil', 'eng.x#0', 'eng.x#10', 'Eng.x', 'eng', 7, 'eng.x#']) {
    assert.match(validateModule({ lessons: [lesson('eng.fx.a', { film }), lesson('eng.fx.b')] }, nl, meta).join('\n'), /film/, String(film));
  }
});

// A lesson with every occurrence of a number's text removed, also where a
// recall gives its answer as a number (lessonTextOf reads it as text).
function withoutNumber(l, value) {
  const strip = (s) => (typeof s === 'string' ? s.split(value).join('#') : s);
  const asText = (v) => (typeof v === 'number' && String(v).includes(value) ? String(v) : v);
  return JSON.parse(JSON.stringify(l), (k, v) => strip(asText(v)));
}

test('withoutNumber also removes a recall answer given as a number', () => {
  const l = lesson('eng.fx.a', { teach: ['Three, two and one: 3 + 2 + 1 = 6.'], recall: [{ q: 'How many?', number: 6, tolerance: 0.5, unit: '', why: 'Six.' }] });
  assert.ok(lessonTextOf(l).includes('6'));
  assert.ok(!lessonTextOf(withoutNumber(l, '6')).includes('6'));
});

// All lessons, both languages, by id.
async function allLessons() {
  const out = { nl: new Map(), en: new Map() };
  for (const m of MODULES) {
    for (const lang of ['nl', 'en']) for (const l of (await loadModule(m.subject, m.id, lang)).lessons) out[lang].set(l.id, l);
  }
  return out;
}

test('every film a lesson wires exists, is in the shell, and lists that lesson', async () => {
  const lessons = await allLessons();
  const sw = fs.readFileSync('sw.js', 'utf8');
  for (const lang of ['nl', 'en']) {
    for (const l of lessons[lang].values()) {
      if (!l.film) continue;
      const id = l.film.split('#')[0];
      const file = `${DIR}/${id}.html`;
      assert.ok(fs.existsSync(file), `${l.id}: ${file} missing`);
      assert.ok(sw.includes(`'${file}'`), `${file} missing from sw.js`);
      assert.ok(readFilmData(fs.readFileSync(file, 'utf8')).lessons.includes(l.id), `${id} does not list ${l.id}`);
      assert.equal(l.film, lessons[lang === 'nl' ? 'en' : 'nl'].get(l.id).film, `${l.id}: film differs between nl and en`);
    }
  }
});

test('every shipped film: its terms, numbers, coverage, language and length still match the lessons', async () => {
  assert.ok(films.length >= 1, 'no films shipped');
  const lessons = await allLessons();
  for (const id of films) {
    const html = fs.readFileSync(`${DIR}/${id}.html`, 'utf8');
    const data = readFilmData(html);
    assert.equal(data.id, id);
    const wiredBy = [...lessons.nl.values()].filter((l) => l.film && l.film.split('#')[0] === id).map((l) => l.id);
    const errs = checkFilm(data, { lessons, levelOf: (lid) => (placeOf(lid) || {}).level || 1, wiredBy });
    assert.deepEqual(errs, [], `${id}:\n${errs.join('\n')}`);
    assert.ok(Buffer.byteLength(html) <= MAX_BYTES, `${id}: ${Buffer.byteLength(html)} bytes, over the cap`);
  }
});

test('the sync check catches a renamed term, a removed number and a Dutch word in English', async () => {
  const lessons = await allLessons();
  for (const id of films) {
    const data = readFilmData(fs.readFileSync(`${DIR}/${id}.html`, 'utf8'));
    const ctx = { lessons, levelOf: (lid) => (placeOf(lid) || {}).level || 1, wiredBy: data.lessons };
    // a lesson whose first term was renamed
    const t = data.scenes.flatMap((s) => s.terms)[0];
    const renamed = { nl: new Map(lessons.nl), en: lessons.en };
    const l = lessons.nl.get(t.lesson);
    renamed.nl.set(t.lesson, { ...l, terms: l.terms.map((x, i) => (i === t.index ? { ...x, term: `${x.term}x` } : x)) });
    assert.match(checkFilm(data, { ...ctx, lessons: renamed }).join('\n'), /is no longer term \d+ of/);
    // a lesson that no longer has the number
    const n = data.numbers[0];
    const gone = { nl: new Map(lessons.nl), en: lessons.en };
    const ln = lessons.nl.get(n.lesson);
    gone.nl.set(n.lesson, withoutNumber(ln, n.value));
    assert.ok(!lessonTextOf(gone.nl.get(n.lesson)).includes(n.value));
    assert.ok(checkFilm(data, { ...ctx, lessons: gone }).some((e) => e.endsWith(`no longer in ${n.lesson}`)), `${id}: removed number ${n.value} not reported`);
    // a Dutch term in the English caption
    const dutch = data.scenes.flatMap((s) => s.terms).find((x) => x.nl.toLowerCase() !== x.en.toLowerCase());
    const bad = JSON.parse(JSON.stringify(data));
    bad.scenes[0].beats[0].text.en += ` ${dutch.nl}`;
    assert.match(checkFilm(bad, ctx).join('\n'), /Dutch term ".*" in the English caption/);
    // a caption that would run past 3 lines in the lesson's film frame
    const long = JSON.parse(JSON.stringify(data));
    const beat = long.scenes[0].beats[0];
    const pad = ' en nog wat meer woorden'.repeat(6);
    beat.seg.nl = [...beat.seg.nl, pad];
    beat.text.nl += pad;
    assert.match(checkFilm(long, ctx).join('\n'), /nl caption has \d+ characters \(max \d+\)/);
  }
});

// v14b: the narration script is held to the lessons like the captions
test('every narrated film: each beat has a script in both languages, and the sync check catches drift in it', async () => {
  const lessons = await allLessons();
  const narrated = films.map((id) => readFilmData(fs.readFileSync(`${DIR}/${id}.html`, 'utf8'))).filter((d) => d.scenes.some((s) => s.beats.some((b) => b.say)));
  assert.ok(narrated.length >= 1, 'no narrated film');
  for (const data of narrated) {
    const ctx = { lessons, levelOf: (lid) => (placeOf(lid) || {}).level || 1, wiredBy: data.lessons };
    for (const s of data.scenes) for (const b of s.beats) for (const lang of ['nl', 'en']) assert.ok(b.say[lang].length && b.voice[lang].trim(), `${data.id} ${s.id}: ${lang} narration`);
    // a beat without a script
    const gap = JSON.parse(JSON.stringify(data));
    delete gap.scenes[0].beats[0].say;
    assert.match(checkFilm(gap, ctx).join('\n'), /narration: 1 beats have no script/);
    // a Dutch term in the English narration
    const dutch = data.scenes.flatMap((s) => s.terms).find((x) => x.nl.toLowerCase() !== x.en.toLowerCase());
    const bad = JSON.parse(JSON.stringify(data));
    bad.scenes[0].beats[0].say.en.push(` ${dutch.nl}`);
    assert.match(checkFilm(bad, ctx).join('\n'), /Dutch term ".*" in the English narration/);
    // a narration term whose lesson term was renamed
    const piece = data.scenes.flatMap((s) => s.beats.flatMap((b) => b.say.nl)).find((p) => typeof p !== 'string');
    const [lid, ix] = piece.k.split('#');
    const renamed = { nl: new Map(lessons.nl), en: lessons.en };
    const ln = lessons.nl.get(lid);
    renamed.nl.set(lid, { ...ln, terms: ln.terms.map((x, i) => (i === Number(ix) ? { ...x, term: `Zzz${x.term}` } : x)) });
    assert.match(checkFilm(data, { ...ctx, lessons: renamed }).join('\n'), /narration term ".*" no longer reads as/);
    // the English narration never carries a gloss; the Dutch one glosses a term once
    const gloss = JSON.parse(JSON.stringify(data));
    gloss.scenes[0].beats[0].say.en.push({ t: 'x', k: piece.k, en: 'y' });
    assert.match(checkFilm(gloss, ctx).join('\n'), /English narration carries a gloss/);
    // far too short a script
    const short = JSON.parse(JSON.stringify(data));
    for (const s of short.scenes) for (const b of s.beats) b.voice = { nl: 'Kort.', en: 'Short.' };
    assert.match(checkFilm(short, ctx).join('\n'), /narration nl would take about \d+ s/);
  }
});

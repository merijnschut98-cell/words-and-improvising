// Films against the lessons they serve. Every shipped film page embeds its data
// as JSON; these tests re-run the build's term, number, coverage and language
// checks on that JSON against the current lesson text. A lesson edit that
// removes a number or renames a term fails here until the film is rebuilt.
// A module intro film (v17, data.module) is held to its module instead: the
// module's title, blurb, topic titles and lesson texts, and its map (every
// topic named and shown); a renamed or added topic fails here too.
// A field film (v17, data.field) is held to its field: the field's and its
// modules' text, and its road (every module a station, named in a caption of its
// own scene, in the order of the road); a renamed module, a module moved to
// another field or a module missing from the captions fails here too.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULES, FIELDS, loadModule, placeOf } from '../src/content/courses/index.js';
import { validateModule } from '../src/content/courses/validate.js';
import { readFilmData, checkFilm, lessonTextOf, moduleTextOf, fieldTextOf, MAX_BYTES } from '../films/_kit/assert.mjs';

const DIR = 'src/content/courses/films';
// Films whose terms all carry the same name in both languages (pm.agile.scrum:
// the Scrum Guide's names), so no Dutch term can leak into their English; the
// Dutch-in-English probes skip only these, and fail for any other film that
// would have no term to probe with.
const SAME_NAMED = new Set(['pm.agile.scrum']);
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

// What a film is checked with: its lessons, and for an intro film its module's
// index entry and the page's stage (the drawing and scripts where a card's words
// stand, without the film data, whose captions and topic titles would always match).
const stageOf = (html) => html.replace(/<script type="application\/json" id="film-data">[\s\S]*?<\/script>/, '');
const ctxOf = (data, html, lessons, wiredBy = data.module || data.field ? [] : data.lessons) => ({
  lessons, levelOf: (lid) => (placeOf(lid) || {}).level || 1, wiredBy,
  ...(data.module ? { module: MODULES.find((m) => m.id === data.module), stageText: stageOf(html) } : {}),
  ...(data.field ? { field: FIELDS.find((f) => f.id === data.field), modules: MODULES, stageText: stageOf(html) } : {}),
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
    if (data.module) assert.equal((MODULES.find((m) => m.id === data.module) || {}).intro, id, `${id}: module ${data.module} does not name it as its intro`);
    if (data.field) assert.equal((FIELDS.find((f) => f.id === data.field) || {}).film, id, `${id}: field ${data.field} does not name it as its film`);
    const errs = checkFilm(data, ctxOf(data, html, lessons, wiredBy));
    assert.deepEqual(errs, [], `${id}:\n${errs.join('\n')}`);
    assert.ok(Buffer.byteLength(html) <= MAX_BYTES, `${id}: ${Buffer.byteLength(html)} bytes, over the cap`);
  }
});

// v16: every sentence lights the part it explains. The reference film opts in
// with strictFocus; any film that does must pass the focus check on its page.
test('films with strictFocus: every beat has a focus (or null) that names a part of its drawing', async () => {
  const { checkFocus, cueKeysOf } = await import('../films/_kit/assert.mjs');
  const strict = films.map((id) => [id, fs.readFileSync(`${DIR}/${id}.html`, 'utf8')]).filter(([, html]) => readFilmData(html).strictFocus);
  assert.ok(strict.some(([id]) => id === 'eng.switchgear.protection'), 'the reference film eng.switchgear.protection is strict');
  for (const [id, html] of strict) {
    const data = readFilmData(html);
    const r = checkFocus(data, cueKeysOf(html));
    assert.deepEqual(r.errors, [], `${id}:\n${r.errors.join('\n')}`);
    for (const s of data.scenes) s.beats.forEach((b, i) => assert.ok('focus' in b, `${id} ${s.id} beat ${i + 1}`));
    // most sentences point at something; an overview is the exception
    const all = data.scenes.flatMap((s) => s.beats);
    assert.ok(all.filter((b) => b.focus === null).length <= all.length / 4, `${id}: too many overview beats`);
  }
});

test('the sync check catches a renamed term, a removed number and a Dutch word in English', async () => {
  const lessons = await allLessons();
  for (const id of films) {
    const html = fs.readFileSync(`${DIR}/${id}.html`, 'utf8');
    const data = readFilmData(html);
    const ctx = ctxOf(data, html, lessons);
    // a lesson whose first term was renamed
    const t = data.scenes.flatMap((s) => s.terms)[0];
    const renamed = { nl: new Map(lessons.nl), en: lessons.en };
    const l = lessons.nl.get(t.lesson);
    renamed.nl.set(t.lesson, { ...l, terms: l.terms.map((x, i) => (i === t.index ? { ...x, term: `${x.term}x` } : x)) });
    assert.match(checkFilm(data, { ...ctx, lessons: renamed }).join('\n'), /is no longer term \d+ of/);
    // a lesson that no longer has the number (an intro film: none of its module's text has it)
    const n = data.numbers[0];
    // a film without a number (the people field film) has none to remove
    if (n) {
      const gone = { nl: new Map(lessons.nl), en: lessons.en };
      if (data.field) {
        const mods = ctx.field.modules.map((mid) => withoutNumber(MODULES.find((m) => m.id === mid), n.value));
        for (const m of mods) for (const lid of m.lessons) gone.nl.set(lid, withoutNumber(lessons.nl.get(lid), n.value));
        const fld = withoutNumber(ctx.field, n.value);
        assert.ok(!fieldTextOf(fld, mods, gone, 'nl').includes(n.value));
        const others = MODULES.filter((m) => !fld.modules.includes(m.id));
        assert.ok(checkFilm(data, { ...ctx, field: fld, modules: [...others, ...mods], lessons: gone }).some((e) => e.endsWith(`no longer in the text of field ${fld.id}`)), `${id}: removed number ${n.value} not reported`);
      } else if (data.module) {
        for (const lid of ctx.module.lessons) gone.nl.set(lid, withoutNumber(lessons.nl.get(lid), n.value));
        const mod = withoutNumber(ctx.module, n.value);
        assert.ok(!moduleTextOf(mod, gone, 'nl').includes(n.value));
        assert.ok(checkFilm(data, { ...ctx, module: mod, lessons: gone }).some((e) => e.endsWith(`no longer in the text of module ${mod.id}`)), `${id}: removed number ${n.value} not reported`);
      } else {
        const ln = lessons.nl.get(n.lesson);
        gone.nl.set(n.lesson, withoutNumber(ln, n.value));
        assert.ok(!lessonTextOf(gone.nl.get(n.lesson)).includes(n.value));
        assert.ok(checkFilm(data, { ...ctx, lessons: gone }).some((e) => e.endsWith(`no longer in ${n.lesson}`)), `${id}: removed number ${n.value} not reported`);
      }
    }
    // a Dutch term in the English caption (a film whose terms all carry the
    // same name in both languages, as pm.agile.scrum's Scrum Guide names, has none)
    const dutch = data.scenes.flatMap((s) => s.terms).find((x) => x.nl.toLowerCase() !== x.en.toLowerCase());
    assert.ok(Boolean(dutch) !== SAME_NAMED.has(id), `${id}: ${dutch ? 'has a Dutch-named term but is listed in SAME_NAMED' : 'has no Dutch-named term to probe with'}`);
    if (dutch) {
      const bad = JSON.parse(JSON.stringify(data));
      bad.scenes[0].beats[0].text.en += ` ${dutch.nl}`;
      assert.match(checkFilm(bad, ctx).join('\n'), /Dutch term ".*" in the English caption/);
    }
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
    const ctx = ctxOf(data, fs.readFileSync(`${DIR}/${data.id}.html`, 'utf8'), lessons);
    for (const s of data.scenes) for (const b of s.beats) for (const lang of ['nl', 'en']) assert.ok(b.say[lang].length && b.voice[lang].trim(), `${data.id} ${s.id}: ${lang} narration`);
    // a beat without a script
    const gap = JSON.parse(JSON.stringify(data));
    delete gap.scenes[0].beats[0].say;
    assert.match(checkFilm(gap, ctx).join('\n'), /narration: 1 beats have no script/);
    // a Dutch term in the English narration (none in a film whose terms are named alike in both languages)
    const dutch = data.scenes.flatMap((s) => s.terms).find((x) => x.nl.toLowerCase() !== x.en.toLowerCase());
    assert.ok(Boolean(dutch) !== SAME_NAMED.has(data.id), `${data.id}: ${dutch ? 'has a Dutch-named term but is listed in SAME_NAMED' : 'has no Dutch-named term to probe with'}`);
    if (dutch) {
      const bad = JSON.parse(JSON.stringify(data));
      bad.scenes[0].beats[0].say.en.push(` ${dutch.nl}`);
      assert.match(checkFilm(bad, ctx).join('\n'), /Dutch term ".*" in the English narration/);
    }
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

// v17: a module intro film is held to its module's map. Every module that names
// an intro ships it (tests/intro.test.js); here each shipped intro page is
// rechecked, and every topic is mutated in turn: a topic renamed or added in the
// index, a title that the captions of its own scene do not carry, a scene with
// one beat, a scene that lights no part of it, fails until the film is rebuilt.
// The narration guard and the drawn labels are rechecked on the page too.
const esc = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const clone = (x) => JSON.parse(JSON.stringify(x));
test('every shipped intro film: each topic of its module is still on its map, named, explained and shown', async () => {
  const lessons = await allLessons();
  const intros = films.map((id) => [id, fs.readFileSync(`${DIR}/${id}.html`, 'utf8')]).filter(([, html]) => readFilmData(html).module);
  assert.ok(intros.length >= 1, 'no intro film shipped');
  for (const [id, html] of intros) {
    const data = readFilmData(html);
    assert.equal(id, `${data.module}.intro`, `${id}: an intro film is named <module>.intro`);
    const ctx = ctxOf(data, html, lessons);
    assert.ok(ctx.module, `${id}: module ${data.module} is not in the index`);
    assert.deepEqual(data.lessons, ctx.module.lessons, `${id}: serves all of ${data.module}'s lessons`);
    assert.deepEqual(data.topics.map((t) => t.id), ctx.module.topics.map((t) => t.id), `${id}: one map entry per topic`);
    assert.deepEqual(checkFilm(data, ctx), [], `${id}: the shipped page passes its own checks`);
    // a topic added to the module
    const grown = clone(ctx.module);
    grown.topics.push({ id: 'zz', title: { nl: 'Zz', en: 'Zz' }, levels: [] });
    assert.match(checkFilm(data, { ...ctx, module: grown }).join('\n'), /topic zz of .* is not on the film's map/);
    // every topic in turn, not only the first
    for (const [ti, t] of ctx.module.topics.entries()) {
      const at = `${id}: topic ${t.id}`;
      const ft = data.topics.find((x) => x.id === t.id);
      // renamed in the index
      const renamed = clone(ctx.module);
      renamed.topics[ti].title.en += ' x';
      assert.match(checkFilm(data, { ...ctx, module: renamed }).join('\n'), new RegExp(`topic ${t.id}: title ".*" \\(en\\) is now ".* x"`), at);
      // its title in no caption of its own scene (the other scenes, and any card, keep it)
      for (const lang of ['nl', 'en']) {
        const mute = clone(data);
        const sc = mute.scenes.find((s) => s.id === ft.scene);
        for (const b of sc.beats) { b.text[lang] = b.text[lang].replace(new RegExp(esc(t.title[lang]), 'gi'), '…'); b.seg[lang] = [b.text[lang]]; }
        assert.match(checkFilm(mute, ctx).join('\n'), new RegExp(`topic ${t.id}: ".*" \\(${lang}\\) is in no caption of its scene ${ft.scene}`), `${at} (${lang})`);
      }
      // its scene explains it in one beat only
      const thin = clone(data);
      thin.scenes.find((s) => s.id === ft.scene).beats.length = 1;
      assert.match(checkFilm(thin, ctx).join('\n'), new RegExp(`topic ${t.id}: scene ${ft.scene} has 1 beat, needs at least 2`), at);
      // its scene lights no part of it
      const dark = clone(data);
      for (const b of dark.scenes.find((s) => s.id === ft.scene).beats) { b.cues = (b.cues || []).filter((c) => c !== ft.cue); if (b.focus) b.focus = b.focus.filter((c) => c !== ft.cue); }
      assert.match(checkFilm(dark, ctx).join('\n'), /no beat of scene .* lights its part/, at);
    }
    // the narration guard on the shipped page: a colon, a symbol, a third comma, a misread word
    for (const [bad, what] of [['Zo: dit.', /symbol the voice reads aloud, or a colon/], ['Dat is 5 + 3.', /symbol the voice reads aloud/], ['Een, twee, drie, vier.', /more than two commas/], ['Het deliverable komt.', /Dutch voice misreads/]]) {
      const loud = clone(data);
      loud.scenes[0].beats[0].say.nl = [bad];
      assert.match(checkFilm(loud, ctx).join('\n'), what, bad);
    }
    // a drawn label too long for the panel; a topic title that does not wrap into a tile
    assert.match(checkFilm(data, { ...ctx, stageText: `${ctx.stageText}\ntr('Een veel te lange tekst voor het paneel', 'Short')` }).join('\n'), /units wide, the panel is 284/);
    const wide = clone(data);
    wide.topics[0].title.nl = 'Onderhandelingstechnieken';
    assert.match(checkFilm(wide, ctx).join('\n'), /a tile is 128/);
  }
});

// v17: a field film is held to its field's road. Every field that names a film
// ships it, precached; each shipped field page is rechecked against the current
// FIELDS and module text, and every module of its field is mutated in turn: a
// module renamed in the index, moved to another field, or missing from the
// captions of its own scene, fails until the film is rebuilt.
test('every field film in the index is built and in the SHELL', () => {
  const sw = fs.readFileSync('sw.js', 'utf8');
  const named = FIELDS.filter((f) => f.film);
  assert.ok(named.some((f) => f.id === 'pm.field.lifecycle'), 'pm.field.lifecycle names its film');
  for (const f of named) {
    const file = `${DIR}/${f.film}.html`;
    assert.ok(fs.existsSync(file), `${f.id}: ${file} is built`);
    assert.ok(sw.includes(`'${file}'`), `${f.id}: ${file} is in the SHELL`);
    assert.equal(readFilmData(fs.readFileSync(file, 'utf8')).field, f.id, `${file} is the film of ${f.id}`);
  }
});

const word = (title) => new RegExp(`(?<![\\p{L}\\d])${esc(title)}(?![\\p{L}\\d])`, 'giu');
test('every shipped field film: each module of its field is still a station, named, explained, in order, and it ends on the map', async () => {
  const lessons = await allLessons();
  const fieldFilms = films.map((id) => [id, fs.readFileSync(`${DIR}/${id}.html`, 'utf8')]).filter(([, html]) => readFilmData(html).field);
  assert.ok(fieldFilms.length >= 1, 'no field film shipped');
  for (const [id, html] of fieldFilms) {
    const data = readFilmData(html);
    assert.equal(id, data.field, `${id}: a field film is named after its field`);
    const ctx = ctxOf(data, html, lessons);
    assert.ok(ctx.field, `${id}: field ${data.field} is not in the index`);
    const mods = ctx.field.modules.map((mid) => MODULES.find((m) => m.id === mid));
    assert.deepEqual(data.lessons, mods.flatMap((m) => m.lessons), `${id}: serves all lessons of its field's modules`);
    assert.deepEqual(data.stations.map((s) => s.id), ctx.field.modules, `${id}: one station per module, in the order of the road`);
    assert.deepEqual(checkFilm(data, ctx), [], `${id}: the shipped page passes its own checks`);
    // a module added to the field
    const grown = { ...ctx.field, modules: [...ctx.field.modules, 'pm.zz'] };
    assert.match(checkFilm(data, { ...ctx, field: grown }).join('\n'), /module pm\.zz of .* is not on the film's road/);
    for (const mid of ctx.field.modules) {
      const at = `${id}: station ${mid}`;
      const st = data.stations.find((x) => x.id === mid);
      // renamed in the index
      const renamed = MODULES.map((m) => (m.id === mid ? { ...m, title: { ...m.title, en: `${m.title.en} x` } } : m));
      assert.match(checkFilm(data, { ...ctx, modules: renamed }).join('\n'), new RegExp(`station ${esc(mid)}: title ".*" \\(en\\) is now ".* x"`), at);
      // moved to another field
      const moved = { ...ctx.field, modules: ctx.field.modules.filter((x) => x !== mid) };
      assert.match(checkFilm(data, { ...ctx, field: moved }).join('\n'), new RegExp(`station ${esc(mid)} is no longer a module of ${esc(ctx.field.id)}`), at);
      // missing from the captions of its own scene (the map scene and the stage keep it)
      for (const lang of ['nl', 'en']) {
        const mute = clone(data);
        const sc = mute.scenes.find((s) => s.id === st.scene);
        for (const b of sc.beats) { b.text[lang] = b.text[lang].replace(word(st.title[lang]), '…'); b.seg[lang] = [b.text[lang]]; }
        assert.match(checkFilm(mute, ctx).join('\n'), new RegExp(`station ${esc(mid)}: ".*" \\(${lang}\\) is in no caption of its scene ${st.scene}`), `${at} (${lang})`);
      }
      // explained in one beat only; lit by no beat
      const thin = clone(data);
      thin.scenes.find((s) => s.id === st.scene).beats.length = 1;
      assert.match(checkFilm(thin, ctx).join('\n'), new RegExp(`station ${esc(mid)}: scene ${st.scene} has 1 beat, needs at least 2`), at);
      const dark = clone(data);
      for (const b of dark.scenes.find((s) => s.id === st.scene).beats) { b.cues = (b.cues || []).filter((c) => c !== st.cue); if (b.focus) b.focus = b.focus.filter((c) => c !== st.cue); }
      assert.match(checkFilm(dark, ctx).join('\n'), /no beat of scene .* lights its part/, at);
    }
    // the map at the end: a place it no longer lights
    const last = ctx.field.modules[ctx.field.modules.length - 1];
    assert.match(checkFilm(data, { ...ctx, stageText: ctx.stageText.replace(` is-lit" data-module="${last}"`, `" data-module="${last}"`) }).join('\n'), new RegExp(`the map does not light ${esc(last)}`));
    // the narration guard and the drawn labels on the shipped page
    for (const [bad, what] of [['Zo: dit.', /symbol the voice reads aloud, or a colon/], ['Een, twee, drie, vier.', /more than two commas/], ['Het deliverable komt.', /Dutch voice misreads/]]) {
      const loud = clone(data);
      loud.scenes[0].beats[0].say.nl = [bad];
      assert.match(checkFilm(loud, ctx).join('\n'), what, bad);
    }
    assert.match(checkFilm(data, { ...ctx, stageText: `${ctx.stageText}\ntr('Een veel te lange tekst voor het paneel', 'Short')` }).join('\n'), /units wide, the panel is 284/);
  }
});

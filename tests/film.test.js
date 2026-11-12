// The pure parts of the explainer films: the player kit's timeline (films/_kit)
// and the app side of the film frame (src/ui/film.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  wordsOf, minSceneDur, parseMarked, formatNumber, speakOf, plainOf, timelineOf, sceneIndexAt,
  clampScene, beatStarts, beatIndexAt, holdLimit, parseParams, fmtClock, ease, span, searchOf,
} from '../films/_kit/timeline.mjs';
import { parseFilmRef, filmSrc, filmMessage, filmBridge, mutedPref, loadFilm } from '../src/ui/film.js';

test('reading pace: a scene lasts at least words / 2.5 + 2 seconds', () => {
  assert.equal(wordsOf('  De snijsnelheid is  hoe snel '), 5);
  assert.equal(wordsOf(''), 0);
  assert.equal(minSceneDur(10), 6);
  assert.equal(minSceneDur(25), 12);
});

test('marked captions: terms, terms with shown text, numbers', () => {
  assert.deepEqual(parseMarked('De {t:Snijsnelheid} is {n:220} m/min.'), [
    { text: 'De ' }, { term: 'Snijsnelheid', shown: 'Snijsnelheid' }, { text: ' is ' }, { num: '220' }, { text: ' m/min.' },
  ]);
  assert.deepEqual(parseMarked('{t:Toerental|toeren}'), [{ term: 'Toerental', shown: 'toeren' }]);
  assert.throws(() => parseMarked('a {x:b} c'), /marker/);
  assert.throws(() => parseMarked('a {t:b c'), /marker/);
});

test('numbers per language: Dutch 1.167 and 0,3; English 1,167 and 0.3; decimals kept', () => {
  assert.equal(formatNumber('1167', 'nl'), '1.167');
  assert.equal(formatNumber('1167', 'en'), '1,167');
  assert.equal(formatNumber('0.3', 'nl'), '0,3');
  assert.equal(formatNumber('0.3', 'en'), '0.3');
  assert.equal(formatNumber('8.67', 'nl'), '8,67');
  assert.equal(formatNumber('6.0', 'nl'), '6,0');
  assert.equal(formatNumber('200000', 'nl'), '200.000');
  assert.equal(formatNumber('350', 'en'), '350');
  assert.throws(() => formatNumber('1,2', 'nl'), /number/);
});

test('speak variant: the English words in parentheses are not spoken', () => {
  const seg = ['De ', { t: 'snijsnelheid', en: 'cutting speed', c: 'vc' }, ' is hoog.'];
  assert.equal(plainOf(seg), 'De snijsnelheid (cutting speed) is hoog.');
  assert.equal(speakOf(seg), 'De snijsnelheid is hoog.');
  assert.equal(speakOf(['Ø60 at ', { t: 'cutting speed', c: 'vc' }]), 'Ø60 at cutting speed');
});

// A voice reads "omw/min" as letters and a slash, and skips Ø and µ: with a
// language, the speak variant says units and signs as words.
test('speak variant: units and signs are said as words, per language', () => {
  const nl = (s) => speakOf([s], 'nl');
  const en = (s) => speakOf([s], 'en');
  assert.equal(nl('bij Ø60 en 220 m/min draait de spil 1.167 omw/min.'), 'bij diameter 60 en 220 meter per minuut draait de spil 11honderd 67 omwentelingen per minuut.');
  assert.equal(en('at Ø60 and 220 m/min the spindle turns at 1,167 rpm.'), 'at diameter 60 and 220 metres per minute the spindle turns at 1,167 revolutions per minute.');
  assert.equal(nl('0,3 × 1.167 = 350 mm/min'), '0,3 maal 11honderd 67 is 350 millimeter per minuut');
  assert.equal(en('0.3 × 1,167 = 350 mm/min'), '0.3 times 1,167 is 350 millimetres per minute');
  assert.equal(nl('160 / 20 = 8 × D.'), '160 gedeeld door 20 is 8 maal D.');
  assert.equal(en('Above 6 × D'), 'Above 6 times D');
  assert.equal(nl('Ra 0,77 µm, zes gaten op 60°.'), 'R a 0,77 micrometer, zes gaten op 60 graden.');
  assert.equal(en('Ra 0.77 µm, six holes at 60°.'), 'R a 0.77 micrometres, six holes at 60 degrees.');
  // words that merely contain the letters stay as they are
  assert.equal(nl('Rand en rpmx en Radius'), 'Rand en rpmx en Radius');
});

test('timeline: scene starts, total, the scene at a time', () => {
  const tl = timelineOf([{ dur: 10 }, { dur: 5 }, { dur: 20 }]);
  assert.deepEqual(tl.starts, [0, 10, 15]);
  assert.equal(tl.total, 35);
  assert.equal(sceneIndexAt(0, tl), 0);
  assert.equal(sceneIndexAt(9.99, tl), 0);
  assert.equal(sceneIndexAt(10, tl), 1);
  assert.equal(sceneIndexAt(34, tl), 2);
  assert.equal(sceneIndexAt(99, tl), 2);
  assert.equal(sceneIndexAt(-3, tl), 0);
});

test('?scene clamps to the film: 1-based in, 0-based out, junk opens scene 1', () => {
  assert.equal(clampScene('3', 8), 2);
  assert.equal(clampScene(1, 8), 0);
  assert.equal(clampScene('12', 8), 7);
  assert.equal(clampScene('0', 8), 0);
  assert.equal(clampScene('-2', 8), 0);
  assert.equal(clampScene('abc', 8), 0);
  assert.equal(clampScene(null, 8), 0);
});

test('beats split a scene by their share of the words; the clock never passes a boundary while speech runs', () => {
  const scene = { dur: 20, beats: [{ text: { nl: 'een twee drie vier' } }, { text: { nl: 'vijf zes drie vier' } }] };
  assert.deepEqual(beatStarts(scene, 'nl'), [0, 10]);
  assert.equal(beatIndexAt(scene, 'nl', 9.9), 0);
  assert.equal(beatIndexAt(scene, 'nl', 10), 1);
  assert.deepEqual(beatStarts({ dur: 12, beats: [{ text: { nl: 'a' } }] }, 'nl'), [0]);
  // speaking beat 0 of scene 1 (starts 30): hold at 40, the start of beat 1
  const tl = timelineOf([{ dur: 30, beats: [{ text: { nl: 'x' } }] }, scene]);
  assert.equal(holdLimit(tl, [{ dur: 30, beats: [{ text: { nl: 'x' } }] }, scene], 'nl', 1, 0), 40);
  // the last beat holds at the end of its scene
  assert.equal(holdLimit(tl, [{ dur: 30, beats: [{ text: { nl: 'x' } }] }, scene], 'nl', 1, 1), 50);
});

test('page parameters: theme, lang, scene, motion, muted', () => {
  assert.deepEqual(parseParams('?theme=dark&lang=en&scene=3&motion=reduce&muted=1&level=2'), { theme: 'dark', lang: 'en', scene: '3', reduce: true, muted: true, level: 2, render: false });
  assert.deepEqual(parseParams(''), { theme: null, lang: 'nl', scene: null, reduce: false, muted: false, level: null, render: false });
  assert.equal(parseParams('?theme=pink').theme, null);
  assert.equal(parseParams('?lang=de').lang, 'nl');
  assert.equal(parseParams('?level=9').level, null);
});

// In the app the page arrives as srcdoc (so it plays offline: a sandboxed
// frame's own navigation never goes through the service worker); its
// parameters then come in the frame's name.
test('page parameters come from the URL, or from the frame name when the page is srcdoc', () => {
  assert.equal(searchOf('?theme=dark&lang=en', '?theme=light'), '?theme=dark&lang=en');
  assert.equal(searchOf('', '?theme=dark&lang=en&level=3'), '?theme=dark&lang=en&level=3');
  assert.equal(searchOf('', 'some-other-name'), '');
  assert.equal(searchOf('', ''), '');
  assert.equal(searchOf(undefined, undefined), '');
  assert.equal(parseParams(searchOf('', '?lang=en&muted=1')).lang, 'en');
});

test('clock text and easing', () => {
  assert.equal(fmtClock(0), '0:00');
  assert.equal(fmtClock(65.4), '1:05');
  assert.equal(fmtClock(140), '2:20');
  assert.equal(ease(0), 0);
  assert.equal(ease(1), 1);
  assert.equal(ease(0.5), 0.5);
  assert.equal(span(0.25, 0.5, 1), 0);
  assert.equal(span(1, 0.5, 1), 1);
  assert.equal(span(0.75, 0.5, 1), 0.5);
});

// ------------------------------------------------------------ app side
test('film ref: an id with an optional start scene', () => {
  assert.deepEqual(parseFilmRef('eng.machining.turning'), { id: 'eng.machining.turning', scene: null });
  assert.deepEqual(parseFilmRef('eng.machining.turning#3'), { id: 'eng.machining.turning', scene: 3 });
  assert.equal(parseFilmRef('../evil'), null);
  assert.equal(parseFilmRef('eng.x#0'), null);
  assert.equal(parseFilmRef(42), null);
});

test('filmSrc: theme, language, level, scene and the remembered mute', () => {
  assert.equal(filmSrc('eng.machining.turning', 'dark', 'en'), 'src/content/courses/films/eng.machining.turning.html?theme=dark&lang=en');
  assert.equal(filmSrc('x.y', 'light', 'nl', { level: 3, scene: 5, muted: true }), 'src/content/courses/films/x.y.html?theme=light&lang=nl&level=3&scene=5&muted=1');
  assert.equal(filmSrc('x.y', 'light', 'fr', { level: 9, scene: null }), 'src/content/courses/films/x.y.html?theme=light&lang=nl');
});

test('loadFilm: the page is fetched (the service worker answers offline) and handed to the frame as srcdoc', async () => {
  const frame = {};
  const asked = [];
  const ok = await loadFilm(frame, 'src/content/courses/films/x.y.html', async (u) => { asked.push(u); return { ok: true, text: async () => '<p>film</p>' }; });
  assert.equal(ok, true);
  assert.deepEqual(asked, ['src/content/courses/films/x.y.html']);
  assert.equal(frame.srcdoc, '<p>film</p>');
  const missing = {};
  assert.equal(await loadFilm(missing, 'a', async () => ({ ok: false, text: async () => 'Not found' })), false);
  assert.equal('srcdoc' in missing, false);
  const offline = {};
  assert.equal(await loadFilm(offline, 'a', async () => { throw new TypeError('Failed to fetch'); }), false);
  assert.equal('srcdoc' in offline, false);
});

test('the bridge accepts only well-formed messages from its own frame', () => {
  const own = {};
  const other = {};
  const ok = (data, source = own) => filmMessage({ source, data }, own);
  assert.deepEqual(ok({ type: 'vp-film', op: 'say', id: 4, text: 'Hallo', lang: 'nl' }), { op: 'say', id: 4, text: 'Hallo', lang: 'nl', rate: 1 });
  assert.equal(ok({ type: 'vp-film', op: 'say', id: 4, text: 'Hallo', lang: 'nl' }, other), null);
  assert.equal(ok({ type: 'other', op: 'say', id: 1, text: 'x' }), null);
  assert.equal(ok({ type: 'vp-film', op: 'format-disk' }), null);
  assert.equal(ok({ type: 'vp-film', op: 'say', id: 1, text: 'x'.repeat(901) }), null);
  assert.equal(ok({ type: 'vp-film', op: 'say', id: 1, text: '' }), null);
  assert.equal(ok('a string'), null);
  assert.equal(ok({ type: 'vp-film', op: 'say', id: 1, text: 'x', lang: 'de' }).lang, 'nl');
  assert.equal(ok({ type: 'vp-film', op: 'say', id: 1, text: 'x', lang: 'en', rate: 1.25 }).rate, 1.25);
  assert.equal(ok({ type: 'vp-film', op: 'say', id: 1, text: 'x', rate: 9 }).rate, 1);
  assert.deepEqual(ok({ type: 'vp-film', op: 'cancel' }), { op: 'cancel' });
  assert.deepEqual(ok({ type: 'vp-film', op: 'mute', muted: true }), { op: 'mute', muted: true });
  assert.deepEqual(ok({ type: 'vp-film', op: 'size', h: 412.4 }), { op: 'size', h: 412 });
  assert.equal(ok({ type: 'vp-film', op: 'size', h: 'tall' }), null);
  assert.deepEqual(ok({ type: 'vp-film', op: 'hello' }), { op: 'hello' });
  // the line id is echoed back to the film: a small finite number or a short string only
  assert.equal(ok({ type: 'vp-film', op: 'say', id: 'x'.repeat(41), text: 'x' }), null);
  assert.equal(ok({ type: 'vp-film', op: 'say', id: Infinity, text: 'x' }), null);
  assert.equal(ok({ type: 'vp-film', op: 'say', id: NaN, text: 'x' }), null);
  assert.equal(ok({ type: 'vp-film', op: 'say', id: 'line-3', text: 'x' }).id, 'line-3');
});

test('the bridge speaks through the app voice and answers said; it ignores other frames', async () => {
  const listeners = [];
  const win = { addEventListener: (_, fn) => listeners.push(fn), removeEventListener: (_, fn) => listeners.splice(listeners.indexOf(fn), 1) };
  const posted = [];
  const frame = { isConnected: true, style: {}, contentWindow: { postMessage: (m) => posted.push(m) } };
  const spoken = [];
  let hushed = 0;
  const stored = [];
  const stop = filmBridge(frame, {
    win,
    say: async (text, lang, rate) => { spoken.push([text, lang, rate]); return 'spoken'; },
    hush: () => { hushed += 1; },
    remember: (m) => stored.push(m),
  });
  const send = async (data, source = frame.contentWindow) => { listeners.forEach((fn) => fn({ source, data })); await new Promise((r) => setTimeout(r, 0)); };
  await send({ type: 'vp-film', op: 'hello' });
  assert.deepEqual(posted.shift(), { type: 'vp-film', op: 'ready', voice: true });
  await send({ type: 'vp-film', op: 'say', id: 7, text: 'De voeding', lang: 'nl' });
  assert.deepEqual(spoken, [['De voeding', 'nl', 1]]);
  assert.deepEqual(posted.shift(), { type: 'vp-film', op: 'said', id: 7, result: 'spoken' });
  await send({ type: 'vp-film', op: 'say', id: 8, text: 'Evil', lang: 'nl' }, {});
  assert.equal(spoken.length, 1);
  await send({ type: 'vp-film', op: 'cancel' });
  assert.equal(hushed, 1);
  await send({ type: 'vp-film', op: 'mute', muted: true });
  assert.deepEqual(stored, [true]);
  assert.equal(hushed, 2); // muting stops the line being spoken
  await send({ type: 'vp-film', op: 'size', h: 400 });
  assert.equal(frame.style.height, '400px');
  await send({ type: 'vp-film', op: 'size', h: 5000 });
  assert.equal(frame.style.height, '900px');
  stop();
  assert.equal(listeners.length, 0);
  assert.equal(hushed, 3); // stopping the bridge silences the film
});

test('a frame that left the page stops its bridge and silences speech', async () => {
  const listeners = [];
  const win = { addEventListener: (_, fn) => listeners.push(fn), removeEventListener: (_, fn) => listeners.splice(listeners.indexOf(fn), 1) };
  const frame = { isConnected: false, style: {}, contentWindow: { postMessage() {} } };
  let hushed = 0;
  let spoke = 0;
  filmBridge(frame, { win, say: async () => { spoke += 1; return 'spoken'; }, hush: () => { hushed += 1; }, remember() {} });
  listeners.forEach((fn) => fn({ source: frame.contentWindow, data: { type: 'vp-film', op: 'say', id: 1, text: 'x', lang: 'nl' } }));
  assert.equal(spoke, 0);
  assert.equal(hushed, 1);
  assert.equal(listeners.length, 0);
});

test('the remembered mute: off unless saved, and storage errors are harmless', () => {
  const store = new Map();
  const ls = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  assert.equal(mutedPref.read(ls), false);
  mutedPref.write(true, ls);
  assert.equal(mutedPref.read(ls), true);
  mutedPref.write(false, ls);
  assert.equal(mutedPref.read(ls), false);
  const broken = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  assert.equal(mutedPref.read(broken), false);
  assert.doesNotThrow(() => mutedPref.write(true, broken));
});

// ------------------------------------------------------------ the build's resolver
test('resolveFilm: terms come from the served lessons, the English word by position, glossed once in Dutch', async () => {
  const { resolveFilm } = await import('../films/_kit/build-film.mjs');
  const l = (lang) => ({ id: 'eng.fx.a', terms: lang === 'nl' ? [{ term: 'Voeding' }, { term: 'Bril' }] : [{ term: 'Feed' }, { term: 'Steady rest' }], teach: ['Voeding 0,3 mm en 1.167 omw/min.'] });
  const lessons = { nl: new Map([['eng.fx.a', l('nl')]]), en: new Map([['eng.fx.a', l('en')]]) };
  const scene = (beats) => ({ id: 's1', level: 1, dur: 10, still: 0.5, title: { nl: 'a', en: 'a' }, beats });
  const spec = (beats) => ({ id: 'x.y', title: { nl: 'a', en: 'a' }, lessons: ['eng.fx.a'], scenes: [scene(beats)] });
  const data = resolveFilm(spec([
    { nl: 'De {t:Voeding|voeding} is {n:0.3} mm.', en: 'The {t:Feed|feed} is {n:0.3} mm.', cue: { Voeding: 'feed' } },
    { nl: 'Weer {t:Voeding|voeding}.', en: 'Again {t:Feed|feed}.', cue: { Voeding: 'feed' } },
    { nl: 'Dan {n:1167} omw/min.', en: 'Then {n:1167} rpm.' },
  ]), lessons);
  const [b1, b2, b3] = data.scenes[0].beats;
  assert.deepEqual(b3.speak, { nl: 'Dan 11honderd 67 omwentelingen per minuut.', en: 'Then 1,167 revolutions per minute.' });
  assert.equal(b1.text.nl, 'De voeding (feed) is 0,3 mm.');
  assert.equal(b1.speak.nl, 'De voeding is 0,3 millimeter.');
  assert.equal(b1.text.en, 'The feed is 0.3 mm.');
  assert.equal(b2.text.nl, 'Weer voeding.');
  assert.deepEqual(data.scenes[0].terms, [{ lesson: 'eng.fx.a', index: 0, nl: 'Voeding', en: 'Feed', cue: 'feed' }]);
  assert.deepEqual(data.numbers, [{ lesson: 'eng.fx.a', value: '0,3', scene: 's1' }, { lesson: 'eng.fx.a', value: '1.167', scene: 's1' }]);
  assert.throws(() => resolveFilm(spec([{ nl: '{t:Snijsnelheid}', en: '{t:Cutting speed}', cue: { Snijsnelheid: 'x' } }]), lessons), /none of the served/);
  assert.throws(() => resolveFilm(spec([{ nl: '{t:Voeding}', en: '{t:Steady rest}', cue: { Voeding: 'x' } }]), lessons), /different terms/);
  assert.throws(() => resolveFilm(spec([{ nl: '{t:Voeding}', en: '{t:Feed}' }]), lessons), /no cue/);
  assert.throws(() => resolveFilm(spec([{ nl: '{n:7}', en: '{n:7}' }]), lessons), /number 7/);
  assert.throws(() => resolveFilm(spec([{ nl: '{n:0.3}', en: '{n:0.4}' }]), lessons), /different numbers/);
});

// v14b: the narration script (say) beside the caption, checked the same way
test('resolveFilm: the narration names lesson terms and numbers, glosses in Dutch once, and nl and en must agree', async () => {
  const { resolveFilm } = await import('../films/_kit/build-film.mjs');
  const l = (lang) => ({ id: 'eng.fx.a', terms: lang === 'nl' ? [{ term: 'Voeding' }, { term: 'Bril' }] : [{ term: 'Feed' }, { term: 'Steady rest' }], teach: ['Voeding 0,3 mm en 1.167 omw/min, 6,0 min.'] });
  const lessons = { nl: new Map([['eng.fx.a', l('nl')]]), en: new Map([['eng.fx.a', l('en')]]) };
  const spec = (beats) => ({ id: 'x.y', title: { nl: 'a', en: 'a' }, lessons: ['eng.fx.a'], scenes: [{ id: 's1', level: 1, dur: 10, still: 0.5, title: { nl: 'a', en: 'a' }, beats }] });
  const cap = { nl: 'De {t:Voeding|voeding}.', en: 'The {t:Feed|feed}.', cue: { Voeding: 'feed' } };
  const data = resolveFilm(spec([
    { ...cap, say: { nl: 'De {t:Voeding|voeding} is hoe ver hij opschuift: {n:0.3} mm per omwenteling.', en: 'The {t:Feed|feed} is how far it moves on: {n:0.3} mm per revolution.' } },
    { ...cap, say: { nl: 'Weer de {t:Voeding|voeding}, en een {t:Bril|bril}, in {n:6.0} min.', en: 'The {t:Feed|feed} again, and a {t:Steady rest|steady rest}, in {n:6.0} min.' } },
  ]), lessons);
  const [b1, b2] = data.scenes[0].beats;
  assert.deepEqual(b1.say.nl, ['De ', { t: 'voeding', k: 'eng.fx.a#0', en: 'feed' }, ' is hoe ver hij opschuift: ', '0,3', ' mm per omwenteling.']);
  assert.deepEqual(b1.say.en[1], { t: 'feed', k: 'eng.fx.a#0' });
  assert.equal(b1.voice.nl, 'De voeding is hoe ver hij opschuift: 0,3 millimeter per omwenteling.');
  assert.equal(b2.voice.en, 'The feed again, and a steady rest, in 6 minutes.');
  // the gloss once per term in the narration, separately from the captions
  assert.ok(!b2.say.nl.some((p) => p.k === 'eng.fx.a#0' && p.en));
  assert.ok(b2.say.nl.some((p) => p.k === 'eng.fx.a#1' && p.en === 'steady rest'));
  // narration numbers are checked against the lesson too
  assert.ok(data.numbers.some((n) => n.value === '6,0'));
  assert.throws(() => resolveFilm(spec([{ ...cap, say: { nl: '{t:Voeding}', en: '{t:Steady rest}' } }]), lessons), /narration name different terms/);
  assert.throws(() => resolveFilm(spec([{ ...cap, say: { nl: '{n:0.3}', en: '{n:0.4}' } }]), lessons), /narration carry different numbers/);
  assert.throws(() => resolveFilm(spec([{ ...cap, say: { nl: '{n:42}', en: '{n:42}' } }]), lessons), /number 42/);
  assert.throws(() => resolveFilm(spec([{ ...cap, say: { nl: '{t:Snijsnelheid}', en: '{t:Cutting speed}' } }]), lessons), /none of the served/);
});

// The spoken-text transforms (SAY, sayable, speakOf) run at build time: the
// page's film data already carries each beat's voice and speak strings. So the
// page script inlines only the runtime part of the timeline, and does not grow
// as each film adds SAY rules.
test('a film page inlines the runtime timeline, not the build-time SAY table', async () => {
  const { readFileSync, readdirSync } = await import('node:fs');
  const vm = await import('node:vm');
  const { pageHtml, runtimeTimeline } = await import('../films/_kit/player.mjs');
  const { audioTimeline } = await import('../films/_kit/timeline.mjs');
  const SAY_RULE = 'omwentelingen per minuut'; // a Dutch SAY rule (rpm, omw/min)
  assert.ok(readFileSync(new URL('../films/_kit/timeline.mjs', import.meta.url), 'utf8').includes(SAY_RULE));
  const rt = runtimeTimeline();
  for (const gone of [SAY_RULE, 'const SAY', 'sayable', 'speakOf', 'parseMarked', 'export ']) assert.ok(!rt.includes(gone), gone);
  // what the player needs still runs, and agrees with the module
  const ctx = vm.createContext({});
  vm.runInContext(`${rt};this.out=JSON.stringify({tl:timelineOf([{dur:3},{dur:5}]),at:sceneIndexAt(4,timelineOf([{dur:3},{dur:5}])),clock:fmtClock(65),atl:audioTimeline([[1,2],[3]]),w:wordsOf('a b c'),b:beatStarts({dur:6,beats:[{text:{nl:'a b'}},{text:{nl:'c'}}]},'nl'),q:searchOf('?scene=2','')})`, ctx);
  assert.deepEqual(JSON.parse(ctx.out), {
    tl: timelineOf([{ dur: 3 }, { dur: 5 }]), at: 1, clock: fmtClock(65), atl: audioTimeline([[1, 2], [3]]), w: 3,
    b: beatStarts({ dur: 6, beats: [{ text: { nl: 'a b' } }, { text: { nl: 'c' } }] }, 'nl'), q: searchOf('?scene=2', ''),
  });
  // a page built now, and every built film page: no SAY table, and a script that parses
  const page = pageHtml({ title: { nl: 'T', en: 'T' }, scenes: [] }, { svg: '<svg></svg>', script: 'const STAGE={};', label: { nl: 'l', en: 'l' } });
  const dir = new URL('../src/content/courses/films/', import.meta.url);
  const pages = [['built now', page], ...readdirSync(dir).filter((f) => f.endsWith('.html')).map((f) => [f, readFileSync(new URL(f, dir), 'utf8')])];
  for (const [name, html] of pages) {
    const script = html.match(/<script type="module">([\s\S]*)<\/script><\/body>/)[1];
    assert.ok(!script.includes(SAY_RULE) && !/\bsayable\b/.test(script), `${name} inlines the SAY table`);
    assert.doesNotThrow(() => new vm.Script(script), `${name} script does not parse`);
  }
});

// Task 17, step K: every lesson point of a lesson wired to a film is in that
// film. A lesson point is a teach chunk (a teach block split on blank lines) or
// a chunk of the worked example (its text, its question, its answer). A beat
// names the points it carries (points: ['cut#t1.2']); the build writes them to
// the page with a fingerprint of the chunk's text, so a lesson edit fails the
// content test until the film is rebuilt, as a renamed term does. A point may be
// left to reading only as a pointer to another lesson or level, or as a word for
// word duplicate of a point of another lesson the film carries (Merijn, D4).
// Also here: checkScope (the lesson-film narration guard and the label fit on
// what a builder adds to a legacy film), the raised limits (12 scenes, 360 s,
// 360 s of narration), the page size for pages with points and the rollout gate.
// The tests run the kit on small made-up lessons; tests/filmcontent.test.js
// rechecks the shipped pages.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveFilm } from '../films/_kit/build-film.mjs';
import {
  checkFilm, checkPoints, checkScope, checkPointsGate, checkPageSize, pointsOf, fingerprint, stageFnSource,
  pointsByteLimit, TARGET_BYTES, MAX_SCENES, MAX_TOTAL, NARRATION_MAX, pointGap,
} from '../films/_kit/assert.mjs';

const FILM = 'eng.fx.film';
const CUT = {
  id: 'eng.fx.cut', title: 'Snijden', pre: [], recall: [], terms: [], film: FILM,
  teach: [
    'Snijsnelheid is de snelheid aan de snijkant, in meter per minuut.\n\nBij staal kies je 180 meter per minuut met hardmetaal.',
    'Voeding per omwenteling bepaalt de spaandikte.',
  ],
  example: { kind: 'worked', text: 'Een as van 40 mm draait op 1.432 toeren.\n  \nDe voeding is 0,25 mm per omwenteling.', ask: 'Hoe groot is de snijsnelheid?', reveal: 'Omtrek maal toerental geeft 180 meter per minuut.' },
};
const FEED = {
  id: 'eng.fx.feed', title: 'Voeding', pre: [], recall: [], terms: [], film: FILM,
  teach: ['Voeding per tand bepaalt de spaandikte bij het frezen.'],
  example: { kind: 'worked', text: 'Een frees met vier tanden neemt 0,1 mm per tand.', ask: 'Wat is de voeding per omwenteling?', reveal: 'Vier maal 0,1 is 0,4 mm per omwenteling.' },
};
const lessonsOf = (...ls) => ({ nl: new Map(ls.map((l) => [l.id, l])), en: new Map(ls.map((l) => [l.id, l])) });
const LESSONS = lessonsOf(CUT, FEED);
const clone = (x) => JSON.parse(JSON.stringify(x));
const b = (nl, points, extra = {}) => ({ nl, en: nl, focus: null, ...(points ? { points } : {}), ...extra });
const spec = () => ({
  id: FILM,
  title: { nl: 'Een as', en: 'A shaft' },
  lessons: ['eng.fx.cut', 'eng.fx.feed'],
  strictFocus: true,
  scenes: [
    { id: 's1', level: 1, dur: 20, still: 0.5, title: { nl: 'Snelheid', en: 'Speed' }, beats: [
      b('Snijsnelheid: de snelheid aan de snijkant, in meter per minuut.', ['cut#t1.1']),
      b('Staal met hardmetaal: {n:180} meter per minuut.', ['cut#t1.2']),
      b('Voeding per omwenteling bepaalt de spaandikte.', ['cut#t2.1']),
    ] },
    { id: 's2', level: 1, dur: 20, still: 0.5, title: { nl: 'Voorbeeld', en: 'Example' }, beats: [
      b('Een as van {n:40} mm op {n:1432} toeren, voeding {n:0.25} mm.', ['cut#ex.text.1', 'cut#ex.text.2']),
      b('Hoe groot is de snijsnelheid? Omtrek maal toerental: {n:180} meter per minuut.', ['cut#ex.ask', 'cut#ex.reveal.1']),
    ] },
    { id: 's3', level: 2, dur: 20, still: 0.5, title: { nl: 'Frezen', en: 'Milling' }, beats: [
      b('Voeding per tand bepaalt de spaandikte bij frezen.', ['feed#t1.1']),
      b('Een frees, vier tanden, {n:0.1} mm per tand.', ['feed#ex.text.1']),
      b('De voeding per omwenteling? {n:0.1} maal vier is {n:0.4} mm.', ['feed#ex.ask', 'feed#ex.reveal.1']),
    ] },
  ],
});
const levelOf = (id) => (id === 'eng.fx.feed' ? 2 : 1);
const ctx = (extra = {}) => ({ lessons: LESSONS, levelOf, wiredBy: ['eng.fx.cut', 'eng.fx.feed'], stageText: '', ...extra });
const errsOf = (data, extra) => checkFilm(data, ctx(extra)).join('\n');
const fpOf = (l, id) => fingerprint(pointsOf(l).find((p) => p.id === id).text);

test('pointsOf: teach blocks split on blank lines, then the example text, question and answer, with stable ids', () => {
  assert.deepEqual(pointsOf(CUT).map((p) => [p.id, p.kind]), [
    ['t1.1', 'teach'], ['t1.2', 'teach'], ['t2.1', 'teach'],
    ['ex.text.1', 'example'], ['ex.text.2', 'example'], ['ex.ask', 'example'], ['ex.reveal.1', 'example'],
  ]);
  assert.equal(pointsOf(CUT)[1].text, 'Bij staal kies je 180 meter per minuut met hardmetaal.');
  // a blank line with spaces in it splits too; the chunk is trimmed
  assert.equal(pointsOf(CUT)[4].text, 'De voeding is 0,25 mm per omwenteling.');
  // a lesson without an example question has no ex.ask
  assert.deepEqual(pointsOf({ teach: ['A.'], example: { text: 'B.', reveal: 'C.\n\nD.' } }).map((p) => p.id), ['t1.1', 'ex.text.1', 'ex.reveal.1', 'ex.reveal.2']);
});

test('fingerprint: 8 hex of the chunk text, blind to spacing, changed by any word', () => {
  const f = fingerprint('Bij staal kies je 180 meter per minuut.');
  assert.match(f, /^[0-9a-f]{8}$/);
  assert.equal(fingerprint('Bij staal  kies je\n180 meter per minuut. '), f);
  assert.notEqual(fingerprint('Bij staal kies je 200 meter per minuut.'), f);
});

test('resolveFilm writes the claims as page data: full key, fingerprint and the beats that carry it', () => {
  const data = resolveFilm(spec(), LESSONS);
  assert.deepEqual(data.points[0], { key: 'eng.fx.cut#t1.1', fp: fpOf(CUT, 't1.1'), beats: ['s1.1'] });
  assert.deepEqual(data.points.find((p) => p.key === 'eng.fx.cut#ex.ask').beats, ['s2.2']);
  // in lesson order, then point order
  assert.deepEqual(data.points.map((p) => p.key.split('#')[1]).slice(0, 7), pointsOf(CUT).map((p) => p.id));
  assert.equal(data.points.length, 11);
  // no reading list and no scope when the film gives none
  assert.ok(!('reading' in data) && !('checkScope' in data));
});

test('resolveFilm: a film without claims has no points in its data (every shipped page is unchanged)', () => {
  const s = spec();
  for (const sc of s.scenes) for (const x of sc.beats) delete x.points;
  const data = resolveFilm(s, LESSONS);
  assert.ok(!('points' in data));
});

test('resolveFilm: a claim names a real point of a served lesson; a one-lesson film may leave out the lesson', () => {
  const bad = spec();
  bad.scenes[0].beats[0].points = ['cut#t9.1'];
  assert.throws(() => resolveFilm(bad, LESSONS), /point cut#t9\.1: eng\.fx\.cut has no point t9\.1/);
  const other = spec();
  other.scenes[0].beats[0].points = ['nope#t1.1'];
  assert.throws(() => resolveFilm(other, LESSONS), /point nope#t1\.1: no served lesson/);
  const bare = spec();
  bare.scenes[0].beats[0].points = ['t1.1'];
  assert.throws(() => resolveFilm(bare, LESSONS), /point t1\.1: name its lesson/);
  const one = spec();
  one.lessons = ['eng.fx.cut'];
  one.scenes.length = 2;
  one.scenes[0].beats[0].points = ['t1.1'];
  assert.equal(resolveFilm(one, LESSONS).points[0].key, 'eng.fx.cut#t1.1');
  // the full lesson id works as well
  const full = spec();
  full.scenes[0].beats[0].points = ['eng.fx.cut#t1.1'];
  assert.equal(resolveFilm(full, LESSONS).points[0].key, 'eng.fx.cut#t1.1');
});

test('checkPoints: a film whose beats claim every point passes; one unclaimed point fails with its key', () => {
  const data = resolveFilm(spec(), LESSONS);
  assert.deepEqual(checkFilm(data, ctx()), []);
  const s = spec();
  delete s.scenes[0].beats[2].points;
  assert.match(errsOf(resolveFilm(s, LESSONS)), /points: eng\.fx\.cut#t2\.1 is in no beat and not left to reading/);
  // only lessons that wire the film: a served lesson wired elsewhere need not be complete here
  assert.deepEqual(checkPoints(resolveFilm(s, LESSONS), { lessons: LESSONS, wiredBy: ['eng.fx.feed'] }), []);
});

test('checkPoints: a reading entry with an allowed reason passes; without a reason, or another reason, it fails', () => {
  const s = spec();
  delete s.scenes[0].beats[2].points;
  s.reading = [{ point: 'cut#t2.1', reason: 'pointer', note: 'het volgende niveau legt de voeding uit' }];
  const data = resolveFilm(s, LESSONS);
  assert.deepEqual(data.reading, [{ key: 'eng.fx.cut#t2.1', fp: fpOf(CUT, 't2.1'), reason: 'pointer', note: 'het volgende niveau legt de voeding uit' }]);
  assert.deepEqual(checkFilm(data, ctx()), []);
  const empty = clone(data);
  empty.reading[0].note = '  ';
  assert.match(errsOf(empty), /reading eng\.fx\.cut#t2\.1: a pointer needs a note/);
  const minor = clone(data);
  minor.reading[0].reason = 'minor';
  assert.match(errsOf(minor), /reading eng\.fx\.cut#t2\.1: the reason must be pointer or duplicate, not minor/);
  const none = clone(data);
  delete none.reading[0].reason;
  assert.match(errsOf(none), /reading eng\.fx\.cut#t2\.1: the reason must be pointer or duplicate/);
  // claimed and left to reading at once
  const both = resolveFilm(spec(), LESSONS);
  both.reading = clone(data.reading);
  assert.match(errsOf(both), /eng\.fx\.cut#t2\.1 is claimed by a beat and left to reading/);
});

test('checkPoints: a duplicate is word for word the same as a point of another lesson that the film claims', () => {
  const feed = { ...FEED, teach: [`${FEED.teach[0]}\n\nVoeding per omwenteling bepaalt de spaandikte.`] };
  const lessons = lessonsOf(CUT, feed);
  const s = spec();
  s.reading = [{ point: 'feed#t1.2', reason: 'duplicate', of: 'eng.fx.cut#t2.1' }];
  const data = resolveFilm(s, lessons);
  assert.deepEqual(data.reading, [{ key: 'eng.fx.feed#t1.2', fp: fpOf(feed, 't1.2'), reason: 'duplicate', of: 'eng.fx.cut#t2.1' }]);
  assert.deepEqual(checkFilm(data, ctx({ lessons })), []);
  // not the same words
  const near = clone(data);
  near.reading[0].of = 'eng.fx.cut#t1.1';
  assert.match(errsOf(near, { lessons }), /reading eng\.fx\.feed#t1\.2: not word for word the same as eng\.fx\.cut#t1\.1/);
  // the twin must be in the film
  const gone = clone(data);
  gone.points = gone.points.filter((p) => p.key !== 'eng.fx.cut#t2.1');
  assert.match(errsOf(gone, { lessons }), /reading eng\.fx\.feed#t1\.2: its twin eng\.fx\.cut#t2\.1 is in no beat/);
  // and of another lesson
  const self = clone(data);
  self.reading[0].of = 'eng.fx.feed#t1.1';
  assert.match(errsOf(self, { lessons }), /reading eng\.fx\.feed#t1\.2: a duplicate names a point of another lesson/);
});

test('checkPoints: a changed chunk fails with "rebuild"; so does a point that is gone', () => {
  const data = resolveFilm(spec(), LESSONS);
  const edited = lessonsOf({ ...CUT, teach: ['Snijsnelheid is de snelheid aan de snijkant, in meter per minuut.\n\nBij staal kies je 200 meter per minuut met hardmetaal.', CUT.teach[1]] }, FEED);
  assert.match(errsOf(data, { lessons: edited }), /point eng\.fx\.cut#t1\.2 changed in the lesson; rebuild the film/);
  const shorter = lessonsOf({ ...CUT, teach: [CUT.teach[0]] }, FEED);
  assert.match(errsOf(data, { lessons: shorter }), /point eng\.fx\.cut#t2\.1 is no longer in the lesson; rebuild the film/);
  // a new chunk in the lesson is unclaimed
  const longer = lessonsOf({ ...CUT, teach: [...CUT.teach, 'Een nieuw blok over koelvloeistof en spanen.'] }, FEED);
  assert.match(errsOf(data, { lessons: longer }), /points: eng\.fx\.cut#t3\.1 is in no beat and not left to reading/);
});

test('checkPoints: a claim of a beat that does not exist fails, and so does one before its lesson\'s start scene', () => {
  const data = resolveFilm(spec(), LESSONS);
  const ghost = clone(data);
  ghost.points[0].beats = ['s9.1'];
  assert.match(errsOf(ghost), /point eng\.fx\.cut#t1\.1: beat s9\.1 does not exist/);
  const past = clone(data);
  past.points[0].beats = ['s1.7'];
  assert.match(errsOf(past), /point eng\.fx\.cut#t1\.1: beat s1\.7 does not exist/);
  // eng.fx.feed starts the film at scene 3: its points must be claimed in scene 3 or later
  const lessons = lessonsOf(CUT, { ...FEED, film: `${FILM}#3` });
  assert.deepEqual(checkFilm(data, ctx({ lessons })), []);
  const early = clone(data);
  early.points.find((p) => p.key === 'eng.fx.feed#t1.1').beats = ['s1.3'];
  assert.match(errsOf(early, { lessons }), /point eng\.fx\.feed#t1\.1: beat s1\.3 comes before scene 3, where eng\.fx\.feed starts the film/);
});

test('checkPoints: a claim on a beat without the point\'s numbers or words fails', () => {
  // t1.2 says 180: beat s1.1 does not
  const nums = spec();
  nums.scenes[0].beats[0].points = ['cut#t1.1', 'cut#t1.2'];
  delete nums.scenes[0].beats[1].points;
  assert.match(errsOf(resolveFilm(nums, LESSONS)), /point eng\.fx\.cut#t1\.2: beat s1\.1 does not carry it \(numbers 180 not said or shown\)/);
  // ex.ask asks for the cutting speed: a beat about the milling cutter shares none of its words
  const words = spec();
  words.scenes[2].beats[1].points = ['feed#ex.text.1', 'cut#ex.ask'];
  words.scenes[1].beats[1].points = ['cut#ex.reveal.1'];
  assert.match(errsOf(resolveFilm(words, LESSONS)), /point eng\.fx\.cut#ex\.ask: beat s3\.2 does not carry it \(0 of its words, needs 1\)/);
  // the narration counts as well as the caption
  const said = spec();
  said.scenes[0].beats[0] = b('Eerst de snelheid.', ['cut#t1.1'], { say: { nl: 'Snijsnelheid is de snelheid aan de snijkant.', en: 'Cutting speed is the speed at the edge.' } });
  assert.doesNotMatch(errsOf(resolveFilm(said, LESSONS)), /eng\.fx\.cut#t1\.1/);
});

test('pointGap: a long point needs a fifth of its words, so a beat that only mentions two of them does not carry it', () => {
  // five sentences, 16 content words: a fifth is 4
  const point = 'Een draaifreescentrum combineert draaien en frezen in één opspanning. De tegenspil neemt het werkstuk over. '
    + 'Daardoor bewerkt de machine ook de achterkant zonder handwerk. Een staafaanvoer duwt materiaal door. '
    + 'Zo draait de cel onbemand door de nachtploeg.';
  const beat = (nl) => ({ text: { nl }, say: { nl: [nl] } });
  assert.match(pointGap(point, [beat('Het deel valt er klaar af, met compleetbewerking op het draaifreescentrum en de tegenspil.')]), /2 of its words, needs 4/);
  assert.equal(pointGap(point, [beat('Het draaifreescentrum draait en freest in één opspanning; de tegenspil pakt de achterkant.'), beat('Een staafaanvoer houdt de cel in de nachtploeg onbemand aan het werk.')]), '');
  // a short point still needs two words, a one-sentence one one
  assert.equal(pointGap('Voeding per tand bepaalt de spaandikte.', [beat('De spaandikte hangt af van de voeding.')]), '');
  // codes and acronyms are words, whatever their length
  assert.equal(pointGap('G49 en G40 zetten ze weer uit.', [beat('Met G49 en G40 gaan de correcties uit.')]), '');
  assert.match(pointGap('G49 en G40 zetten ze weer uit.', [beat('Daarna gaan de correcties uit.')]), /0 of its words, needs 1/);
});

test('checkPoints: data checked alone carries no key twice and no key of a lesson the film does not serve', () => {
  const data = resolveFilm(spec(), LESSONS);
  const twice = clone(data);
  twice.points.push(clone(twice.points[0]));
  assert.match(errsOf(twice), /point eng\.fx\.cut#t1\.1 is claimed twice in the data/);
  const stranger = clone(data);
  stranger.points.push({ key: 'eng.other.x#t1.1', fp: '00000000', beats: ['s1.1'] });
  assert.match(errsOf(stranger), /point eng\.other\.x#t1\.1: eng\.other\.x is no lesson of the film/);
});

test('the rollout gate: a lesson film neither claimed nor pending fails; a pending film with claims fails', () => {
  const claimed = { lessons: ['a'], points: [] };
  const bare = { lessons: ['a'] };
  const intro = { module: 'eng.x', lessons: [] };
  const field = { field: 'eng.field.x', lessons: [] };
  const inventory = ['f.claimed', 'f.bare', 'f.gone'];
  const pages = new Map([['f.claimed', claimed], ['f.bare', bare], ['f.intro', intro], ['f.field', field]]);
  assert.deepEqual(checkPointsGate(pages, ['f.bare'], inventory), []);
  assert.match(checkPointsGate(pages, [], inventory).join('\n'), /f\.bare: a lesson film without points; claim its lesson points/);
  assert.match(checkPointsGate(pages, ['f.bare', 'f.claimed'], inventory).join('\n'), /f\.claimed has points now: remove it from tests\/fixtures\/points-pending\.json/);
  assert.match(checkPointsGate(pages, ['f.bare', 'f.gone'], inventory).join('\n'), /f\.gone is no shipped lesson film: remove it from/);
  // the list only shrinks: a film outside the Task 17 inventory cannot be added
  const more = new Map([...pages, ['f.new', bare]]);
  assert.match(checkPointsGate(more, ['f.bare', 'f.new'], inventory).join('\n'), /f\.new is not one of the lesson films of the Task 17 inventory/);
  assert.match(checkPointsGate(pages, ['f.bare', 'f.bare'], inventory).join('\n'), /f\.bare is listed twice/);
});

// checkScope: what a builder adds to a legacy lesson film is held to the rules of new films, the rest is not
const SAY = (nl) => ({ say: { nl, en: 'Fine.' } });
const scoped = (scope, mutate = () => {}) => {
  const s = spec();
  s.scenes.forEach((sc) => sc.beats.forEach((x) => Object.assign(x, SAY('Een oude zin: met een dubbele punt.'))));
  s.scenes[2].beats.forEach((x) => Object.assign(x, SAY('Een nieuwe zin met 25% minder.')));
  s.checkScope = scope;
  mutate(s);
  return resolveFilm(s, LESSONS);
};
const STAGE = `const STAGE = (() => {
  const tr = (nl, en) => (NL ? nl : en);
  const label = (x, y, t) => \`<text x="\${x}" y="\${y}" font-size="22">\${t}</text>\`;
  function legacy() { return label(10, 20, 'Oude tekst zonder tr'); }
  function extraFeed() { return label(10, 40, tr('Voeding per tand', 'Feed per tooth', 260)) + label(10, 80, '0,1', 22, 'start'); }
  const extraCut = (u) => label(10, 60, tr('Snijkant', 'Cutting edge'));
  return { legacy, extraFeed, extraCut };
})();`;

test('checkScope: an added beat with a colon fails, one with % passes; the rest of a legacy film is not checked', () => {
  const data = scoped({ scenes: ['s3'] });
  assert.deepEqual(data.checkScope, { scenes: ['s3'] });
  assert.deepEqual(checkScope(data, STAGE), []);
  // narration elsewhere breaks the guard, and the build of the whole film stays green apart from the scope
  assert.doesNotMatch(errsOf(data, { stageText: STAGE }), /narration: a symbol/);
  const colon = clone(data);
  colon.scenes[2].beats[1].say.nl = ['Een nieuwe zin: met een dubbele punt.'];
  assert.match(checkScope(colon, STAGE).join('\n'), /narration: a colon, parentheses, quotes or a symbol the voice reads aloud in "Een nieuwe zin: met/);
  for (const bad of ['Twee (tussen haakjes).', 'Hij zei “ja”.', 'Een, twee, drie, vier.', 'Het deliverable komt.']) {
    const x = clone(data);
    x.scenes[2].beats[0].say.nl = [bad];
    assert.ok(checkScope(x, STAGE).length, bad);
  }
  for (const ok of ['Dat is 25% van 1.432 mm.', 'Snelheid 180 m/min, toerental 1.432 omw/min.', '72 ÷ 9 = 8 teams.']) {
    const x = clone(data);
    x.scenes[2].beats[0].say.nl = [ok];
    assert.deepEqual(checkScope(x, STAGE), [], ok);
  }
  // a single added beat in an old scene
  const one = scoped({ beats: ['s1.2'] });
  assert.match(checkScope(one, STAGE).join('\n'), /scene s1 beat 2/);
  assert.doesNotMatch(checkScope(one, STAGE).join('\n'), /scene s1 beat 1/);
  // the whole check runs in checkFilm too
  assert.match(errsOf(colon, { stageText: STAGE }), /narration: a colon/);
});

test('checkScope: an added beat needs a focus field; the scope names real scenes, beats and stage functions', () => {
  const data = scoped({ scenes: ['s3'] });
  const blind = clone(data);
  delete blind.scenes[2].beats[0].focus;
  assert.match(checkScope(blind, STAGE).join('\n'), /scene s3 beat 1: an added beat names its focus/);
  assert.throws(() => scoped({ scenes: ['s9'] }), /checkScope: no scene s9/);
  assert.throws(() => scoped({ beats: ['s1.9'] }), /checkScope: no beat s1\.9/);
  assert.throws(() => scoped({ stagefns: ['x'] }), /checkScope: unknown field stagefns/);
  assert.match(checkScope(scoped({ stageFns: ['extraGone'] }), STAGE).join('\n'), /checkScope: stage function extraGone is not in the stage script/);
});

test('checkScope: an added stage label without tr() fails, a tr() label too wide fails; legacy functions are not checked', () => {
  assert.deepEqual(checkScope(scoped({ stageFns: ['extraFeed', 'extraCut'] }), STAGE), []);
  assert.match(checkScope(scoped({ stageFns: ['legacy'] }), STAGE).join('\n'), /stage function legacy: the label 'Oude tekst zonder tr' is not written as tr\('nl', 'en'\)/);
  const wide = STAGE.replace("tr('Snijkant', 'Cutting edge')", "tr('Een veel te lange tekst voor het paneel', 'Cutting edge')");
  assert.match(checkScope(scoped({ stageFns: ['extraCut'] }), wide).join('\n'), /stage function extraCut: label "Een veel te lange tekst voor het paneel" \(nl\) is \d+ units wide, the panel is 284/);
  const branch = STAGE.replace("tr('Snijkant', 'Cutting edge')", "LANG === 'nl' ? 'Snijkant' : 'Cutting edge'");
  assert.match(checkScope(scoped({ stageFns: ['extraCut'] }), branch).join('\n'), /stage function extraCut: the label 'Snijkant' is not written as tr/);
  const drawn = STAGE.replace("label(10, 60, tr('Snijkant', 'Cutting edge'))", '`<text x="1" y="2">Snijkant</text>`');
  assert.match(checkScope(scoped({ stageFns: ['extraCut'] }), drawn).join('\n'), /stage function extraCut: the label 'Snijkant' is not written as tr/);
  // units and acronyms read the same in both languages: no tr() pair needed (seen on the legacy stages)
  const units = STAGE.replace("label(10, 60, tr('Snijkant', 'Cutting edge'))", "label(10, 60, '0 bar') + label(10, 80, 'MES → ERP') + `<text x=\"1\" y=\"2\">kg</text>`");
  assert.deepEqual(checkScope(scoped({ stageFns: ['extraCut'] }), units), []);
  // checkFilm needs the stage for it
  assert.match(errsOf(scoped({ stageFns: ['extraCut'] }), { stageText: '' }), /checkScope: stage function extraCut is not in the stage script/);
});

test('checkScope: a legacy-sized stage (300 functions, about 300 KB) is scanned once, not once per function', () => {
  const fns = Array.from({ length: 300 }, (_, i) => `  // helper ${i}\n  function f${i}(x) { return label(${i}, 2, tr('Tekst ${i}', 'Text ${i}')) + '${'x'.repeat(900)}'; }`).join('\n');
  const big = STAGE.replace('  return { legacy', `${fns}\n  return { legacy`);
  assert.ok(big.length > 280000);
  const t = Date.now();
  assert.deepEqual(checkScope(scoped({ stageFns: ['extraFeed', 'extraCut', 'f150'] }), big), []);
  assert.ok(Date.now() - t < 3000, `${Date.now() - t} ms`);
});

test('stageFnSource: a function declaration or an arrow, up to its end', () => {
  assert.match(stageFnSource(STAGE, 'extraFeed'), /^function extraFeed\(\) \{[\s\S]*'start'\); \}$/);
  assert.equal(stageFnSource(STAGE, 'extraCut'), "const extraCut = (u) => label(10, 60, tr('Snijkant', 'Cutting edge'))");
  assert.equal(stageFnSource(STAGE, 'nothing'), null);
  // a comment that reads like a declaration is no declaration
  assert.match(stageFnSource(`// a pure function extraFeed (scene, u), see below\n${STAGE}`, 'extraFeed'), /^function extraFeed\(\) \{/);
  assert.equal(stageFnSource('/* const nothing = () => 1; */', 'nothing'), null);
});

// the limits (step K): 12 scenes, 360 s designed, 360 s of narration (900 words at 2.5 a second)
const longFilm = (scenes, dur, words) => {
  const s = spec();
  s.lessons = ['eng.fx.cut'];
  s.scenes = Array.from({ length: scenes }, (_, i) => ({ id: `s${i + 1}`, level: 1, dur, still: 0.5, title: { nl: 'S', en: 'S' }, beats: [b('Een zin.', null)] }));
  const data = resolveFilm(s, lessonsOf(CUT));
  const per = Math.floor(words / scenes);
  data.scenes.forEach((sc, i) => sc.beats.forEach((x) => {
    const n = per + (i < words - per * scenes ? 1 : 0);
    const nl = `${Array(n).fill('woord').join(' ')}.`;
    x.say = { nl: [nl], en: [nl] };
    x.voice = { nl, en: nl };
  }));
  return data;
};
const limitErrs = (data) => checkFilm(data, { lessons: lessonsOf(CUT), levelOf, wiredBy: [] }).join('\n');
test('the limits: 330 s designed, 12 scenes and 880 words pass; 13 scenes or 361 s fail', () => {
  assert.equal(MAX_SCENES, 12);
  assert.equal(MAX_TOTAL, 360);
  assert.equal(NARRATION_MAX, 360);
  assert.equal(limitErrs(longFilm(12, 27.5, 880)), '');
  assert.match(limitErrs(longFilm(13, 25, 880)), /needs 2–12 scenes, has 13/);
  const over = longFilm(12, 30, 880);
  over.scenes[0].dur = 31;
  assert.match(limitErrs(over), /film is 361 s, must be 25–360/);
  assert.match(limitErrs(longFilm(12, 27.5, 905)), /narration nl would take about 362 s, must be 25–360/);
});

test('page size: a page with points stays under the 300 KB target; an extended film near or over it grows at most 25 KB', () => {
  assert.equal(pointsByteLimit('eng.fx.film'), TARGET_BYTES);
  // 296 KB before: 25 KB of growth, not the 4 KB the target would leave
  assert.equal(pointsByteLimit('eng.machining.turning'), 295984 + 25 * 1024);
  assert.equal(pointsByteLimit('eng.moulding.cycle'), TARGET_BYTES); // split in pilot B (17 Nov): no allowance
  assert.equal(pointsByteLimit('eng.machining.overview'), 353316 + 25 * 1024);
  assert.equal(pointsByteLimit('eng.machining.milling'), 324274 + 25 * 1024);
  // a split film keeps no allowance, even when it keeps the old id
  assert.equal(pointsByteLimit('eng.machining.cnc'), TARGET_BYTES);
  const data = { id: 'eng.fx.film', points: [] };
  assert.deepEqual(checkPageSize(data, TARGET_BYTES), []);
  assert.match(checkPageSize(data, TARGET_BYTES + 1).join('\n'), /eng\.fx\.film is 307201 bytes; a page with points stays at or under 307200/);
  // without points the target is a warning, as before; the hard cap holds for every page
  assert.deepEqual(checkPageSize({ id: 'eng.fx.film' }, TARGET_BYTES + 1), []);
  assert.match(checkPageSize({ id: 'eng.fx.film' }, 450 * 1024 + 1).join('\n'), /over the 460800 cap/);
});

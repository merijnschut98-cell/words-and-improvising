// v14b, real video: the pure parts of the narration and render pipeline
// (films/_kit), the app side of the Film step (src/ui/film.js, src/core/course.js)
// and the service worker's byte-range helper (src/core/filmrange.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { audioTimeline, timedAt, speakOf, saidOf, parseParams, PAUSES, AUDIO_GAPS } from '../films/_kit/timeline.mjs';
import { wavInfo, wavFile, joinTrack, cueChunks, vttTime, vttOf, cuesOf, manifestWith, filmUrl, MANIFEST_BASE, phrasesOf, beatLayout, beatLength, cuesOfLines, spokenOf, SUB_MAX } from '../films/_kit/narration.mjs';
import { applyLexicon } from '../films/_kit/lexicon.mjs';
import { glossCase } from '../films/_kit/build-film.mjs';
import { videoOf, readAlong, filmDataOf } from '../src/ui/film.js';
import { lessonPhases, lessonSteps, lessonBack } from '../src/core/course.js';

// ------------------------------------------------------------ the audio timeline
test('audio timeline: lines follow each other with a breath, scenes open with a look and hold after the last line', () => {
  const g = { lead: 1, look: 0.5, gap: 0.25, hold: 1, tail: 2 };
  const atl = audioTimeline([[3, 2], [4]], g);
  assert.deepEqual(atl.scenes[0], { start: 0, dur: 1 + 3 + 0.25 + 2 + 1, beats: [{ start: 1, dur: 3 }, { start: 4.25, dur: 2 }] });
  assert.deepEqual(atl.scenes[1], { start: 7.25, dur: 0.5 + 4 + 2, beats: [{ start: 7.75, dur: 4 }] });
  assert.equal(atl.total, 13.75);
  // the scene is as long as its narration needs: a longer line, a longer scene
  assert.ok(audioTimeline([[9, 2], [4]], g).scenes[0].dur > atl.scenes[0].dur);
  assert.throws(() => audioTimeline([[3, 0]], g), /no audio/);
});

test('audio timeline: the scene, beat and progress at a time', () => {
  const atl = audioTimeline([[3, 2], [4]], { lead: 1, look: 0.5, gap: 0.25, hold: 1, tail: 2 });
  assert.deepEqual(timedAt(0, atl), { si: 0, bi: 0, u: 0 });
  assert.equal(timedAt(4.2, atl).bi, 0);
  assert.equal(timedAt(4.25, atl).bi, 1);
  assert.equal(timedAt(7.25, atl).si, 1);
  assert.equal(timedAt(99, atl).u, 1);
  assert.equal(timedAt(7.25 + 6.5 / 2, atl).u, 0.5);
});

test('render mode is a page parameter', () => {
  assert.equal(parseParams('?render=1&lang=en').render, true);
  assert.equal(parseParams('?lang=en').render, false);
});

// ------------------------------------------------------------ the spoken text
test('spoken text: units, signs, money and whole decimals as words; the gloss is not spoken', () => {
  assert.equal(speakOf(['in ', { t: 'zes minuten', c: 'x' }, ': 4,0 + 3,0 = 6,0 min'], 'nl'), 'in zes minuten: 4 + 3 is 6 minuten');
  assert.equal(speakOf(['€8,67 per stuk'], 'nl'), '8,67 euro per stuk');
  assert.equal(speakOf(['€8.67 a part, 6.0 min'], 'en'), '8.67 euros a part, 6 minutes');
  assert.equal(speakOf(['f 0,3 mm, 20% sneller'], 'nl'), 'f 0,3 millimeter, 20 procent sneller');
  assert.equal(speakOf(['zo’n 3 meter'], 'nl'), "zo'n 3 meter");
  // Dutch says 1.167 as elfhonderd zevenenzestig; round thousands and bigger numbers stay
  assert.equal(speakOf(['1.167 toeren, 1.200 mm/min, 2.000 stuks, 21.167 en 220.000'], 'nl'), '11honderd 67 toeren, 12honderd millimeter per minuut, 2.000 stuks, 21.167 en 220.000');
  assert.equal(speakOf(['De ', { t: 'voeding', en: 'feed', c: 'f' }, ' is 0,3 mm.'], 'nl'), 'De voeding is 0,3 millimeter.');
  // the subtitles keep what is written, without the gloss
  assert.equal(saidOf(['De ', { t: 'voeding', en: 'feed', c: 'f' }, ' is 0,3 mm.']), 'De voeding is 0,3 mm.');
  // MIG, MAG and TIG on their own as letters in Dutch (espeak-ng reads MAG as the verb), MAG-lassen as it is
  assert.equal(speakOf(['Dit is MIG/MAG-lassen. Bij MAG, voor staal, bij TIG 0,6. Het product mag eruit.'], 'nl'), 'Dit is M I G MAG-lassen. Bij M A G, voor staal, bij T I G 0,6. Het product mag eruit.');
});

// ------------------------------------------------------------ WAV files
const pcm = (n, v = 0) => Buffer.alloc(n * 2, v);
test('wav: header written and read back; tracks joined with silence at the timeline positions', () => {
  const a = wavFile(pcm(22050, 1), 22050);
  assert.deepEqual(wavInfo(a), { rate: 22050, channels: 1, bits: 16, dataOffset: 44, dataBytes: 44100, dur: 1 });
  assert.throws(() => wavInfo(Buffer.from('nope')), /WAV/);
  const b = wavFile(pcm(11025, 2), 22050);
  // a at 0.5 s, b at 2 s, 3 s in all
  const track = joinTrack([{ at: 0.5, wav: a }, { at: 2, wav: b }], 3);
  const info = wavInfo(track);
  assert.equal(info.dur, 3);
  const data = track.subarray(info.dataOffset);
  assert.equal(data[0], 0); // silence before a
  assert.equal(data[Math.round(0.5 * 22050) * 2], 1); // a starts at 0.5 s
  assert.equal(data[Math.round(2 * 22050) * 2], 2); // b starts at 2 s
  assert.throws(() => joinTrack([{ at: 0, wav: a }, { at: 0.5, wav: b }], 3), /overlap/);
});

// ------------------------------------------------------------ captions (WebVTT)
test('caption chunks: sentences, long ones split at a comma, none longer than the limit when it can be helped', () => {
  assert.deepEqual(cueChunks('Een zin. Nog een zin! En een vraag?'), ['Een zin.', 'Nog een zin!', 'En een vraag?']);
  const long = 'Dit is een heel lange zin met veel woorden, die op een komma gesplitst moet worden omdat hij anders te lang is voor het scherm.';
  const parts = cueChunks(long, 80);
  assert.equal(parts.join(' '), long);
  assert.ok(parts.length >= 2 && parts.every((p) => p.length <= 80), parts.join(' | '));
  assert.deepEqual(cueChunks('  '), []);
});

test('WebVTT: timestamps, cues per beat timed by length, the file format', () => {
  assert.equal(vttTime(0), '00:00:00.000');
  assert.equal(vttTime(83.2567), '00:01:23.257');
  assert.equal(vttTime(3725), '01:02:05.000');
  const data = { scenes: [{ beats: [{ say: { nl: ['Kort. ', { t: 'Langer', c: 'x', en: 'longer' }, ' en nog langer.'] } }] }] };
  const atl = { scenes: [{ start: 0, dur: 5, beats: [{ start: 1, dur: 3 }] }], total: 5 };
  const cues = cuesOf(data, atl, 'nl');
  assert.equal(cues.length, 2);
  assert.deepEqual(cues.map((c) => c.text), ['Kort.', 'Langer en nog langer.']);
  assert.equal(cues[0].start, 1);
  assert.equal(cues[1].end, 4);
  assert.ok(cues[0].end === cues[1].start && cues[0].end > 1.3 && cues[0].end < 2, String(cues[0].end));
  const vtt = vttOf(cues);
  assert.match(vtt, /^WEBVTT\n\n1\n00:00:01\.000 --> 00:00:0\d\.\d{3}\nKort\.\n\n2\n/);
  assert.ok(vtt.endsWith('Langer en nog langer.\n'));
  // a cue text never carries markup
  assert.equal(vttOf([{ start: 0, end: 1, text: 'a <b> & c' }]).split('\n')[4], 'a &lt;b&gt; &amp; c');
});

test('gloss case: an ordinary word is lowered, a proper noun and an acronym keep their capitals', () => {
  const corpus = 'Use the Taylor equation. A turn-mill centre turns and mills. Cutting speed matters; the cutting speed is set.';
  assert.equal(glossCase('Cutting speed', corpus), 'cutting speed');
  assert.equal(glossCase('Turn-mill centre', corpus), 'turn-mill centre');
  assert.equal(glossCase('Taylor equation', corpus), 'Taylor equation');
  assert.equal(glossCase('HSS', corpus), 'HSS');
  assert.equal(glossCase('C-axis', corpus), 'C-axis');
  // a word the corpus never writes mid-sentence is treated as ordinary
  assert.equal(glossCase('Cemented carbide', corpus), 'cemented carbide');
});

test('glossed subtitles: a Dutch term shows its English word once, in parentheses; the voice text is untouched', () => {
  const seg = ['Een ', { t: 'wisselplaat', en: 'carbide insert' }, ' snijdt, en de ', { t: 'snijsnelheid', en: 'cutting speed' }, ' telt. Ook ', { t: 'H7', en: 'H7' }, '.'];
  assert.deepEqual(phrasesOf(seg), [['Een wisselplaat snijdt,', 'en de snijsnelheid telt.'], ['Ook H7.']]);
  // a gloss equal to the term as shown (H7, CAM) is left out
  assert.deepEqual(phrasesOf(seg, { gloss: true }), [['Een wisselplaat (carbide insert) snijdt,', 'en de snijsnelheid (cutting speed) telt.'], ['Ook H7.']]);
  // English scripts carry no gloss: unchanged
  assert.deepEqual(phrasesOf(['A ', { t: 'carbide insert' }, ' cuts.'], { gloss: true }), [['A carbide insert cuts.']]);
  // a glossed phrase too long for one cue is cut after the gloss
  assert.deepEqual(cueChunks('Daarom bewaart de gereedschapscorrectie (tool offset) van elk gereedschap de lengte en de radius.', 84),
    ['Daarom bewaart de gereedschapscorrectie (tool offset)', 'van elk gereedschap de lengte en de radius.']);
});

test('exact subtitles: one clip per phrase, cues at the measured clip times, the pauses from one place', () => {
  assert.ok(PAUSES.sentence >= 0.5 && PAUSES.sentence <= 0.6 && PAUSES.comma >= 0.15 && PAUSES.comma <= 0.25 && PAUSES.beat >= 0.8);
  assert.equal(AUDIO_GAPS.gap, PAUSES.beat);
  const seg = ['De ', { t: 'Voeding', k: 'x#0', en: 'feed' }, ' is 0,3 mm. Hoe dunner de as wordt, hoe sneller hij draait. Zo ver.'];
  assert.deepEqual(phrasesOf(seg), [['De Voeding is 0,3 mm.'], ['Hoe dunner de as wordt,', 'hoe sneller hij draait.'], ['Zo ver.']]);
  // a decimal comma is no phrase break; a short phrase rides with the next one
  assert.deepEqual(phrasesOf(['Hier, bij 1.167 toeren, is f 0,3 mm.']), [['Hier, bij 1.167 toeren,', 'is f 0,3 mm.']]);
  const lay = beatLayout(2, [[1.5], [2, 1], [0.5]]);
  const p = PAUSES;
  assert.deepEqual(lay.flat().map((c) => c.start), [2, 2 + 1.5 + p.sentence, 2 + 3.5 + p.sentence + p.comma, 2 + 4.5 + 2 * p.sentence + p.comma]);
  assert.equal(beatLength([[1.5], [2, 1], [0.5]]), Math.round((5 + 2 * p.sentence + p.comma) * 1000) / 1000);
  const cues = cuesOfLines([
    [{ start: 1, dur: 2, text: 'Kort.' }],
    [{ start: 3.5, dur: 2.5, text: 'Dit is een lange zin met heel veel woorden erin,' }, { start: 6.2, dur: 3, text: 'die na de komma nog een flink eind doorgaat.' }],
  ]);
  assert.deepEqual(cues[0], { start: 1, end: 3, text: 'Kort.' });
  assert.deepEqual(cues.slice(1).map((c) => [c.start, c.end]), [[3.5, 6], [6.2, 9.2]], 'a long sentence is cut between its phrases, at their real times');
  assert.ok(cues.every((c) => c.text.length <= SUB_MAX));
  assert.equal(cuesOfLines([[{ start: 0, dur: 2, text: 'Een korte zin,' }, { start: 2.2, dur: 1, text: 'die kort blijft.' }]]).length, 1);
});

test('lexicon: the voice gets the phonemes, the subtitles keep the spelling', () => {
  const lex = { toerental: 'tˈurəntˌɑl', omwentelingen: 'ˈɔmʋˌɛntəlɪŋən' };
  assert.equal(applyLexicon('Het Toerental, in omwentelingen per minuut.', lex), 'Het [[tˈurəntˌɑl]], in [[ˈɔmʋˌɛntəlɪŋən]] per minuut.');
  assert.equal(applyLexicon('toerentallen', lex), 'toerentallen', 'whole words only');
  assert.equal(applyLexicon('CNC-toerental', lex), 'CNC-[[tˈurəntˌɑl]]');
  // the voice: units as words, then the lexicon; the subtitle: as written
  const seg = ['Het ', { t: 'toerental', k: 'x#0' }, ' is 1.167 omw/min.'];
  const [[phrase]] = phrasesOf(seg);
  assert.equal(phrase, 'Het toerental is 1.167 omw/min.');
  assert.equal(spokenOf(phrase, 'nl', lex), 'Het [[tˈurəntˌɑl]] is 11honderd 67 [[ˈɔmʋˌɛntəlɪŋən]] per minuut.');
  const cue = cuesOfLines([[{ start: 0, dur: 3, text: phrase }]])[0];
  assert.equal(cue.text, 'Het toerental is 1.167 omw/min.');
  // the subtitle of a Dutch phrase carries the English word of a term (first use);
  // the voice's phrases skip it, and both are cut into the same phrases
  // (a short phrase rides with the next one by its spoken words, gloss or not)
  const glossed = [{ t: 'Smeltbad', en: 'weld pool', k: 'a#1' }, ', zegt hij, is heet. Een ', { t: 'WBZ', en: 'HAZ', k: 'a#2' }, ' volgt.'];
  assert.deepEqual(phrasesOf(glossed), [['Smeltbad, zegt hij,', 'is heet.'], ['Een WBZ volgt.']]);
  assert.deepEqual(phrasesOf(glossed, { gloss: true }), [['Smeltbad (weld pool), zegt hij,', 'is heet.'], ['Een WBZ (HAZ) volgt.']]);
  assert.deepEqual(phrasesOf(seg, { gloss: true }), phrasesOf(seg));
  // the committed lexicons: phonemes with a main stress, keys in lower case; the
  // compounds Merijn heard wrong take their stress on the first part
  for (const lang of ['nl', 'en']) {
    const l = JSON.parse(fs.readFileSync(`films/_kit/lexicon.${lang}.json`, 'utf8'));
    for (const [w, ipa] of Object.entries(l)) {
      assert.equal(w, w.toLowerCase());
      assert.ok(ipa.includes('ˈ') && !/[[\]]/.test(ipa), `${lang} ${w}: ${ipa}`);
    }
  }
  const nl = JSON.parse(fs.readFileSync('films/_kit/lexicon.nl.json', 'utf8'));
  for (const w of ['toerental', 'spaanafvoer', 'klauwplaat', 'wisselplaat']) assert.ok(/^[^aeiouɑɛɪɔʊəœøʏʌ]*ˈ/.test(nl[w]), `${w}: ${nl[w]}`);
  // omwenteling is no first-part compound: its main stress is on WEN (omWENteling)
  for (const w of ['omwenteling', 'omwentelingen']) assert.ok(nl[w].includes('ʋˈɛn'), `${w}: ${nl[w]}`);
  assert.ok(!('overleg' in nl), 'overLEG keeps espeak-ng’s own stress');
});

test('render mode shows no caption band: the video subtitles come from its WebVTT track only', () => {
  const src = fs.readFileSync('films/_kit/player.mjs', 'utf8');
  assert.ok(src.includes('.fp[data-render="1"]:not([data-poster="1"]) .fp-cap{display:none}'));
});

// ------------------------------------------------------------ the manifest
test('manifest: the public URL pattern and an entry per film and language', () => {
  assert.equal(MANIFEST_BASE, 'https://ysybqtdzcutmyabfwijl.supabase.co/storage/v1/object/public/films');
  assert.equal(filmUrl(MANIFEST_BASE, 'eng.machining.turning', 'en'), `${MANIFEST_BASE}/eng.machining.turning/en.mp4`);
  const m1 = manifestWith(null, 'eng.x.y', 'nl', { dur: 181.26, bytes: 9000000, scenes: [0, 20.5] });
  assert.equal(m1.base, MANIFEST_BASE);
  assert.equal(m1.pattern, '{base}/{id}/{lang}.mp4');
  assert.deepEqual(m1.films['eng.x.y'].nl, { dur: 181.3, bytes: 9000000, scenes: [0, 20.5], vtt: 'src/content/courses/films/eng.x.y.nl.vtt' });
  assert.equal(m1.films['eng.x.y'].poster, 'src/content/courses/films/eng.x.y.jpg');
  const m2 = manifestWith(m1, 'eng.x.y', 'en', { dur: 170, bytes: 8000000, scenes: [0, 19] });
  assert.ok(m2.films['eng.x.y'].nl && m2.films['eng.x.y'].en);
  assert.ok(!m1.films['eng.x.y'].en, 'the old manifest is not changed');
  assert.throws(() => manifestWith(null, '../x', 'nl', { dur: 1, bytes: 1, scenes: [0] }), /id/);
  assert.throws(() => manifestWith(null, 'eng.x.y', 'de', { dur: 1, bytes: 1, scenes: [0] }), /lang/);
});

// Merijn's rules for the shipped subtitles: they are exactly the spoken words;
// in Dutch a term's English word is shown once, in parentheses, and never
// spoken; English has no glosses. Checked for every film's committed VTT
// against the narration script in its film page.
const vttText = (vtt) => vtt.replace(/\r/g, '').split(/\n\n+/).slice(1)
  .map((block) => block.split('\n').filter((l) => l && !/^\d+$/.test(l) && !l.includes('-->')).join(' '))
  .join(' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
test('shipped subtitles: the spoken words exactly, a Dutch term’s English word once in parentheses, never spoken; no glosses in English', () => {
  const m = JSON.parse(fs.readFileSync('src/content/courses/films/manifest.json', 'utf8'));
  const ids = Object.keys(m.films);
  assert.ok(ids.length >= 5);
  for (const id of ids) {
    const data = filmDataOf(fs.readFileSync(`src/content/courses/films/${id}.html`, 'utf8'));
    assert.ok(data, `${id}: film data`);
    const beats = data.scenes.flatMap((s) => s.beats).filter((b) => b.say);
    for (const lang of ['nl', 'en']) {
      const segs = beats.map((b) => b.say[lang]);
      const terms = segs.flat().filter((p) => typeof p !== 'string');
      const glossed = terms.filter((p) => p.en && p.en.toLowerCase() !== p.t.toLowerCase());
      if (lang === 'en') assert.equal(terms.filter((p) => p.en).length, 0, `${id} en: a gloss in the English script`);
      // the voice: the phrases as said, the same words as the script, no gloss
      const said = segs.map((seg) => saidOf(seg)).join(' ');
      assert.equal(segs.map((seg) => phrasesOf(seg).flat().join(' ')).join(' '), said, `${id} ${lang}: the clips say the script`);
      for (const b of beats) assert.equal(b.voice[lang], speakOf(b.say[lang], lang), `${id} ${lang}: voice`);
      for (const p of glossed) assert.ok(!said.includes(`(${p.en})`) && !beats.some((b) => b.voice[lang].includes(`(${p.en})`)), `${id} ${lang}: "${p.en}" is spoken`);
      // the subtitles: the glossed phrases, cue by cue
      const sub = vttText(fs.readFileSync(m.films[id][lang].vtt, 'utf8'));
      assert.equal(sub, segs.map((seg) => phrasesOf(seg, { gloss: true }).flat().join(' ')).join(' '), `${id} ${lang}: subtitles = script with glosses`);
      // with each gloss taken out, they are the spoken words exactly
      let plain = sub;
      for (const p of glossed) {
        const at = plain.indexOf(`${p.t} (${p.en})`);
        assert.ok(at >= 0, `${id} ${lang}: no "${p.t} (${p.en})" in the subtitles`);
        plain = plain.slice(0, at) + p.t + plain.slice(at + p.t.length + p.en.length + 3);
      }
      assert.equal(plain, said, `${id} ${lang}: subtitles without glosses = the spoken words`);
      // each term's English word once
      const keys = glossed.map((p) => p.k);
      assert.equal(new Set(keys).size, keys.length, `${id} ${lang}: a term glossed twice`);
    }
  }
});

test('the committed manifest: every film has nl and en, an https URL on the films bucket, sizes and durations', () => {
  const m = JSON.parse(fs.readFileSync('src/content/courses/films/manifest.json', 'utf8'));
  assert.equal(m.base, MANIFEST_BASE);
  assert.ok(Object.keys(m.films).length >= 1);
  for (const [id, f] of Object.entries(m.films)) {
    assert.ok(fs.existsSync(`src/content/courses/films/${id}.html`), `${id}: no HTML film to fall back on`);
    assert.ok(fs.existsSync(f.poster), `${id}: poster ${f.poster} missing`);
    for (const lang of ['nl', 'en']) {
      const v = f[lang];
      assert.ok(v, `${id}: no ${lang} video`);
      assert.ok(v.dur >= 60 && v.dur <= 360, `${id} ${lang}: ${v.dur} s`);
      assert.ok(v.bytes > 100000 && v.bytes < 60e6, `${id} ${lang}: ${v.bytes} bytes`);
      assert.ok(fs.existsSync(v.vtt) && fs.readFileSync(v.vtt, 'utf8').startsWith('WEBVTT'), `${id} ${lang}: captions ${v.vtt}`);
      assert.ok(v.scenes[0] === 0 && v.scenes.every((s, i) => i === 0 || s > v.scenes[i - 1]) && v.scenes.at(-1) < v.dur, `${id} ${lang}: scene starts`);
      assert.match(videoOf(m, id, lang).url, /^https:\/\/[a-z]+\.supabase\.co\/storage\/v1\/object\/public\/films\/[a-z0-9.]+\/(nl|en)\.mp4\?v=\d+$/);
    }
  }
});

// ------------------------------------------------------------ the app: which video
test('videoOf: the video in the app language, with captions, poster and a start scene; null when there is none', () => {
  const m = manifestWith(manifestWith(null, 'eng.x.y', 'nl', { dur: 100, bytes: 5e6, scenes: [0, 20, 50] }), 'eng.x.y', 'en', { dur: 90, bytes: 4e6, scenes: [0, 18, 45] });
  assert.deepEqual(videoOf(m, 'eng.x.y', 'en'), {
    url: `${MANIFEST_BASE}/eng.x.y/en.mp4?v=4000000`, vtt: 'src/content/courses/films/eng.x.y.en.vtt', poster: 'src/content/courses/films/eng.x.y.jpg', dur: 90, start: 0,
  });
  assert.equal(videoOf(m, 'eng.x.y', 'nl', 3).start, 50);
  assert.equal(videoOf(m, 'eng.x.y', 'nl', 9).start, 50);
  assert.equal(videoOf(m, 'eng.x.y', 'fr').url, `${MANIFEST_BASE}/eng.x.y/nl.mp4?v=5000000`);
  // a re-rendered film is a new URL (its size is the version), so no browser or
  // film cache can play the old video under the new captions
  const again = manifestWith(m, 'eng.x.y', 'nl', { dur: 100, bytes: 5000001, scenes: [0, 20, 50] });
  assert.notEqual(videoOf(again, 'eng.x.y', 'nl').url, videoOf(m, 'eng.x.y', 'nl').url);
  assert.equal(videoOf(m, 'eng.other', 'nl'), null);
  assert.equal(videoOf(null, 'eng.x.y', 'nl'), null);
  assert.equal(videoOf({ films: { 'eng.x.y': { nl: { dur: 1 } } } }, 'eng.x.y', 'nl'), null, 'no base, no URL');
  // only a public https URL on Supabase storage
  assert.equal(videoOf({ ...m, base: 'javascript:alert(1)//' }, 'eng.x.y', 'nl'), null);
});

// ------------------------------------------------------------ the app: read along
test('read along: the narration script per scene in the app language, terms marked, English words only in Dutch', () => {
  const data = {
    scenes: [
      { title: { nl: 'De snede', en: 'The cut' }, beats: [{ say: { nl: ['Een ', { t: 'wisselplaat', en: 'carbide insert', c: 'i' }, ' snijdt.'], en: ['A ', { t: 'carbide insert', c: 'i' }, ' cuts.'] } }, { say: { nl: ['Tweede zin.'], en: ['Second line.'] } }] },
      { title: { nl: 'Leeg', en: 'Empty' }, beats: [{}] },
    ],
  };
  assert.deepEqual(readAlong(data, 'nl'), [{ n: 1, title: 'De snede', paras: [['Een ', { t: 'wisselplaat', en: 'carbide insert' }, ' snijdt.'], ['Tweede zin.']] }]);
  assert.deepEqual(readAlong(data, 'en')[0].paras[0], ['A ', { t: 'carbide insert' }, ' cuts.']);
  assert.deepEqual(readAlong({ scenes: [] }, 'nl'), []);
  assert.deepEqual(readAlong(null, 'nl'), []);
});

test('filmDataOf: the data block of a film page, or null', () => {
  assert.deepEqual(filmDataOf('<script type="application/json" id="film-data">{"id":"x"}</script>'), { id: 'x' });
  assert.equal(filmDataOf('<p>nothing</p>'), null);
  assert.equal(filmDataOf('<script type="application/json" id="film-data">{bad</script>'), null);
  assert.equal(filmDataOf(null), null);
});

// ------------------------------------------------------------ the app: the steps
test('a lesson with a film: Raden · Film · Voorbeeld · Check; without one it keeps Lezen', () => {
  const withFilm = { pre: [{}], teach: ['a', 'b'], film: 'eng.machining.turning' };
  assert.deepEqual(lessonPhases(withFilm), ['pre', 'film', 'example', 'quiz']);
  assert.deepEqual(lessonSteps(lessonPhases(withFilm), 'film').map((s) => `${s.id}:${s.state}`), ['guess:done', 'film:current', 'example:todo', 'check:todo']);
  assert.deepEqual(lessonPhases({ pre: [{}], teach: ['a'] }), ['pre', 'teach', 'example', 'quiz']);
  assert.deepEqual(lessonPhases({ teach: ['a'], film: 'eng.x.y' }), ['film', 'example', 'quiz']);
  // back from the example goes to the film; back from the film to the last guess
  const phases = lessonPhases(withFilm);
  assert.deepEqual(lessonBack({ p: 2, block: 0, pre: 0 }, phases, withFilm), { p: 1, block: 0, pre: 0 });
  assert.deepEqual(lessonBack({ p: 1, block: 0, pre: 0 }, phases, { ...withFilm, pre: [{}, {}] }), { p: 0, block: 0, pre: 1 });
});

// ------------------------------------------------------------ the service worker: byte ranges
function rangeLib() {
  const ctx = { URL };
  vm.runInNewContext(fs.readFileSync('src/core/filmrange.js', 'utf8'), ctx);
  return ctx;
}

test('byte ranges: parsed against the size, open-ended and suffix ranges, junk refused', () => {
  const { parseRange } = rangeLib();
  const r = (h, n) => JSON.parse(JSON.stringify(parseRange(h, n)));
  assert.deepEqual(r('bytes=0-99', 1000), { start: 0, end: 99 });
  assert.deepEqual(r('bytes=500-', 1000), { start: 500, end: 999 });
  assert.deepEqual(r('bytes=-100', 1000), { start: 900, end: 999 });
  assert.deepEqual(r('bytes=900-5000', 1000), { start: 900, end: 999 });
  assert.equal(parseRange(null, 1000), null); // no range: the whole file
  assert.equal(parseRange('', 1000), null);
  assert.equal(r('bytes=1000-', 1000).unsatisfiable, true);
  assert.equal(r('bytes=50-10', 1000).unsatisfiable, true);
  assert.equal(r('items=0-1', 1000).unsatisfiable, true);
  assert.equal(r('bytes=0-1,5-9', 1000).unsatisfiable, true); // one range only
});

test('byte ranges: the response parts (206 with Content-Range, 200 for no range, 416 when it cannot be met)', () => {
  const { rangeParts } = rangeLib();
  const p = (h, n) => JSON.parse(JSON.stringify(rangeParts(h, n, 'video/mp4')));
  assert.deepEqual(p('bytes=0-1', 10), { status: 206, start: 0, end: 2, headers: { 'Content-Type': 'video/mp4', 'Content-Length': '2', 'Content-Range': 'bytes 0-1/10', 'Accept-Ranges': 'bytes' } });
  assert.deepEqual(p(null, 10), { status: 200, start: 0, end: 10, headers: { 'Content-Type': 'video/mp4', 'Content-Length': '10', 'Accept-Ranges': 'bytes' } });
  assert.deepEqual(p('bytes=20-', 10), { status: 416, start: 0, end: 0, headers: { 'Content-Range': 'bytes */10', 'Accept-Ranges': 'bytes' } });
});

test('the film URL test: only the public films bucket', () => {
  const { isFilmUrl } = rangeLib();
  assert.equal(isFilmUrl('https://ysybqtdzcutmyabfwijl.supabase.co/storage/v1/object/public/films/eng.machining.turning/nl.mp4'), true);
  assert.equal(isFilmUrl('https://ysybqtdzcutmyabfwijl.supabase.co/storage/v1/object/public/other/x.mp4'), false);
  assert.equal(isFilmUrl('https://evil.example/storage/v1/object/public/films/x/nl.mp4'), false);
  assert.equal(isFilmUrl('not a url'), false);
});

test('the service worker routes films through the range helper and keeps the films cache', () => {
  const sw = fs.readFileSync('sw.js', 'utf8');
  assert.match(sw, /importScripts\('src\/core\/filmrange\.js'\)/);
  assert.match(sw, /const FILMS = 'vantage-films'/);
  assert.match(sw, /k !== CACHE && k !== META && k !== FILMS/);
  assert.ok(!/\.mp4'/.test(sw.split('const SHELL')[1].split('];')[0]), 'no video in the shell precache');
  // films are cached per version (?v=), so the worker looks up the whole URL
  assert.match(sw, /c\.match\(e\.request\.url\)/);
});

test('cacheFilm: the whole file into the films cache once; false when it cannot', async () => {
  const { cacheFilm, FILMS_CACHE } = await import('../src/ui/film.js');
  const store = new Map();
  const opened = [];
  const cachesApi = { open: async (name) => { opened.push(name); return { match: async (u) => store.get(u), put: async (u, r) => { store.set(u, r); } }; } };
  let fetched = 0;
  const ok = async () => { fetched += 1; return { status: 200 }; };
  assert.equal(await cacheFilm('https://x/films/a/nl.mp4', { cachesApi, fetchFn: ok }), true);
  assert.equal(opened[0], FILMS_CACHE);
  assert.ok(store.has('https://x/films/a/nl.mp4'));
  assert.equal(await cacheFilm('https://x/films/a/nl.mp4', { cachesApi, fetchFn: ok }), true);
  assert.equal(fetched, 1, 'a cached film is not fetched again');
  // a partial or failed answer is never stored
  assert.equal(await cacheFilm('https://x/films/b/nl.mp4', { cachesApi, fetchFn: async () => ({ status: 206 }) }), false);
  assert.equal(await cacheFilm('https://x/films/c/nl.mp4', { cachesApi, fetchFn: async () => { throw new Error('offline'); } }), false);
  assert.equal(await cacheFilm('https://x/films/d/nl.mp4', { cachesApi: null, fetchFn: ok }), false);
  assert.ok(!store.has('https://x/films/b/nl.mp4') && !store.has('https://x/films/c/nl.mp4'));
  // a new version of a film replaces the old one in the cache
  const keyed = new Map([['https://x/films/e/nl.mp4?v=1', 1], ['https://x/films/e/en.mp4?v=1', 1]]);
  const api2 = { open: async () => ({ match: async (u) => keyed.get(u), put: async (u, r) => { keyed.set(u, r); }, keys: async () => [...keyed.keys()].map((url) => ({ url })), delete: async (k) => keyed.delete(typeof k === 'string' ? k : k.url) }) };
  assert.equal(await cacheFilm('https://x/films/e/nl.mp4?v=2', { cachesApi: api2, fetchFn: ok }), true);
  assert.deepEqual([...keyed.keys()].sort(), ['https://x/films/e/en.mp4?v=1', 'https://x/films/e/nl.mp4?v=2']);
});

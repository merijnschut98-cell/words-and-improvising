// Dev tool, not shipped. v14b: turns a film's narration script into speech
// with Piper TTS (free, local, neural), one WAV per beat and language, and
// from their lengths the audio timeline that drives the video.
//
//   node films/_kit/narrate.mjs eng.machining.turning [--lang nl,en]
//
// Reads the built page (src/content/courses/films/<id>.html; build it first)
// and writes, per language:
//   films-out/<id>/<lang>.wav          the whole narration track, lines at their times
//   films-out/<id>/<lang>.timing.json  the audio timeline (films/_kit/timeline.mjs, audioTimeline)
//   films-out/<id>/<lang>.vtt          captions: the spoken script, sentence by sentence, each
//                                      sentence recorded as its own clip so its cue is exact
//   src/content/courses/films/<id>.<lang>.vtt   the same captions, committed (same origin, offline)
// films-out/ is git-ignored. Lines are cached by text and voice in films-out/_cache.
//
// Needs: pip install piper-tts. The voices download on first use from
// huggingface.co/rhasspy/piper-voices into films-out/_voices (or $PIPER_VOICES).
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './build-film.mjs';
import { readFilmData } from './assert.mjs';
import { audioTimeline } from './timeline.mjs';
import { wavInfo, joinTrack, vttOf, phrasesOf, beatLayout, beatLength, cuesOfLines, spokenOf } from './narration.mjs';

// The voices, chosen on 2026-11-07 by comparing candidates on the pilot's first
// scenes (Whisper round trip for intelligibility, pitch spread for liveliness,
// and the accent the learner hears at work):
// - nl: nl_NL-ronnie (Netherlands Dutch, male). Fewest recognition errors of
//   the Dutch voices (11–14 % against 16–44 % for nathalie, rdh and mls
//   speakers), the liveliest intonation (pitch spread 5.4 semitones against
//   1.4–3.9) and a Netherlands accent; rdh and nathalie are Flemish. Slightly
//   slow at 1.0 (1.9 words a second), so 0.82.
// - en: en_GB-alan (British English, male). Near-perfect recognition (2 %),
//   natural intonation (3.4 st), reads numbers right (northern_english_male
//   turned "220" into "2 inches 20"), and British spelling and terms match the
//   app's English ("metres", "tailstock"). lessac is American; jenny_dioco is
//   flatter (2.5 st).
export const VOICES = {
  nl: { model: 'nl_NL-ronnie-medium', path: 'nl/nl_NL/ronnie/medium', length: 0.82 },
  en: { model: 'en_GB-alan-medium', path: 'en/en_GB/alan/medium', length: 0.92 },
};
const HF = 'https://huggingface.co/rhasspy/piper-voices/resolve/main';

const OUT = join(ROOT, 'films-out');
const VOICE_DIR = process.env.PIPER_VOICES || join(OUT, '_voices');
const CACHE = join(OUT, '_cache');

function run(cmd, args, input) {
  const r = spawnSync(cmd, args, { input, maxBuffer: 1 << 28 });
  if (r.error) throw new Error(`${cmd}: ${r.error.message}`);
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed:\n${String(r.stderr).slice(-2000)}`);
  return r;
}

function voiceModel(lang) {
  const v = VOICES[lang];
  const file = join(VOICE_DIR, `${v.model}.onnx`);
  mkdirSync(VOICE_DIR, { recursive: true });
  for (const ext of ['.onnx', '.onnx.json']) {
    if (existsSync(file.replace(/\.onnx$/, ext))) continue;
    console.log(`downloading ${v.model}${ext}`);
    run('curl', ['-sSfL', '-o', file.replace(/\.onnx$/, ext), `${HF}/${v.path}/${v.model}${ext}`]);
  }
  return file;
}

// One phrase of speech, cached by voice, speed and text (phonemes included).
// No silence of Piper's own: the pauses are laid out by PAUSES (timeline.mjs).
function speak(text, lang) {
  const v = VOICES[lang];
  const key = createHash('sha1').update(`${v.model}|${v.length}|${text}`).digest('hex').slice(0, 16);
  const file = join(CACHE, `${lang}-${key}.wav`);
  if (!existsSync(file)) {
    mkdirSync(CACHE, { recursive: true });
    run('piper', ['-m', voiceModel(lang), '--length-scale', String(v.length), '--sentence-silence', '0', '-f', file], text);
  }
  return readFileSync(file);
}

export function narrate(id, langs = ['nl', 'en']) {
  const page = join(ROOT, 'src/content/courses/films', `${id}.html`);
  const data = readFilmData(readFileSync(page, 'utf8'));
  if (!data.scenes.every((s) => s.beats.every((b) => b.voice))) throw new Error(`${id}: not every beat has a narration script (say)`);
  const dir = join(OUT, id);
  mkdirSync(dir, { recursive: true });
  const result = {};
  for (const lang of langs) {
    // one clip per phrase: the subtitles follow the measured length of each
    const lexFile = join(ROOT, 'films/_kit', `lexicon.${lang}.json`);
    const lex = existsSync(lexFile) ? JSON.parse(readFileSync(lexFile, 'utf8')) : {};
    const clips = data.scenes.map((s) => s.beats.map((b) => phrasesOf(b.say[lang]).map((ph) => ph.map((text) => {
      const wav = speak(spokenOf(text, lang, lex), lang);
      return { text, wav, dur: wavInfo(wav).dur };
    }))));
    const atl = audioTimeline(clips.map((beats) => beats.map((sents) => beatLength(sents.map((ph) => ph.map((c) => c.dur))))));
    const parts = [];
    const lines = [];
    clips.forEach((beats, si) => beats.forEach((sents, bi) => {
      beatLayout(atl.scenes[si].beats[bi].start, sents.map((ph) => ph.map((c) => c.dur))).forEach((ph, k) => {
        lines.push(ph.map((at, j) => {
          parts.push({ at: at.start, wav: sents[k][j].wav });
          return { ...at, text: sents[k][j].text };
        }));
      });
    }));
    writeFileSync(join(dir, `${lang}.wav`), joinTrack(parts, atl.total));
    writeFileSync(join(dir, `${lang}.timing.json`), JSON.stringify({ id, lang, voice: VOICES[lang], atl, sentences: lines }, null, 1));
    const vtt = vttOf(cuesOfLines(lines));
    writeFileSync(join(dir, `${lang}.vtt`), vtt);
    writeFileSync(join(ROOT, 'src/content/courses/films', `${id}.${lang}.vtt`), vtt);
    console.log(`${id} ${lang}: ${atl.total.toFixed(1)} s narration (${VOICES[lang].model}), ${data.scenes.length} scenes`);
    result[lang] = atl;
  }
  return result;
}

if (process.argv[1] && process.argv[1].endsWith('narrate.mjs')) {
  const id = process.argv[2];
  if (!id) { console.error('usage: node films/_kit/narrate.mjs <film id> [--lang nl,en]'); process.exit(2); }
  const li = process.argv.indexOf('--lang');
  narrate(id, li > 0 ? process.argv[li + 1].split(',') : ['nl', 'en']);
}

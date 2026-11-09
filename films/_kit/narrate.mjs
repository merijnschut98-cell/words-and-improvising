// Dev tool, not shipped. v14b: turns a film's narration script into speech
// with Piper TTS (free, local, neural), and from the measured clips the audio
// timeline that drives the video.
//
//   node films/_kit/narrate.mjs eng.machining.turning [--lang nl,en] [--local] [--voice nl_NL-pim-medium:0.82]
//
// Reads the built page (src/content/courses/films/<id>.html; build it first)
// and writes, per language:
//   films-out/<id>/<lang>.wav          the whole narration track, sentences at their times
//   films-out/<id>/<lang>.timing.json  the audio timeline (timeline.mjs audioTimeline), and per
//                                      sentence its span, text and word timing (for the listen guard)
//   films-out/<id>/<lang>.vtt          captions: the spoken script, cut at word boundaries measured
//                                      in each sentence clip; in Dutch a term shows its English
//                                      word once, in parentheses (never spoken)
//   src/content/courses/films/<id>.<lang>.vtt   the same captions, committed (same origin, offline);
//                                      not with --local (a trial render that ships nothing)
// films-out/ is git-ignored. Beats are cached by text, voice and lexicon in films-out/_cache.
//
// The voice rework of 2026-11-09 (films/_kit/voice-ab): one Piper call per
// sentence, commas inside (films/_kit/speak.py); Piper's edge silence trimmed
// to 40 ms; the pauses from timeline.mjs (PAUSES); one loudness gain per beat;
// the lexicon swapped into the whole sentence's phonemes; cue times from
// Piper's phoneme alignments (Whisper word timestamps as a fallback).
//
// The voice and speed per language: films/_kit/voices.json (no code change to
// switch). --voice overrides one language's voice for a trial (with --local).
//
// Needs: pip install piper-tts onnx (onnx for the alignments; faster-whisper
// for the fallback). The voices download on first use from
// huggingface.co/rhasspy/piper-voices into films-out/_voices (or $PIPER_VOICES).
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './build-film.mjs';
import { readFilmData } from './assert.mjs';
import { audioTimeline, PAUSES } from './timeline.mjs';
import { wavInfo, joinTrack, vttOf, beatLayout, beatLength, cuesOfLines, sentenceClips, saidWordSpans, forceAlign, timedPhrases, voiceOf } from './narration.mjs';

const KIT = join(ROOT, 'films/_kit');
const HF = 'https://huggingface.co/rhasspy/piper-voices/resolve/main';
const OUT = join(ROOT, 'films-out');
const VOICE_DIR = process.env.PIPER_VOICES || join(OUT, '_voices');
const CACHE = join(OUT, '_cache');
// bump when speak.py changes what it writes, so cached beats are redone
const SYNTH_VERSION = 'sentence-1';
// the Whisper model for the cue-timing fallback (only used when a voice gives no alignments)
const FALLBACK_WHISPER = process.env.FILM_ALIGN_WHISPER || 'small';

function run(cmd, args, input) {
  const r = spawnSync(cmd, args, { input, maxBuffer: 1 << 28 });
  if (r.error) throw new Error(`${cmd}: ${r.error.message}`);
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed:\n${String(r.stderr).slice(-2000)}`);
  return r;
}

export const voicesConfig = () => JSON.parse(readFileSync(join(KIT, 'voices.json'), 'utf8'));

function voiceModel(v) {
  const file = join(VOICE_DIR, `${v.model}.onnx`);
  mkdirSync(VOICE_DIR, { recursive: true });
  for (const ext of ['.onnx', '.onnx.json']) {
    if (existsSync(file.replace(/\.onnx$/, ext))) continue;
    console.log(`downloading ${v.model}${ext}`);
    run('curl', ['-sSfL', '-o', file.replace(/\.onnx$/, ext), `${HF}/${v.path}/${v.model}${ext}`]);
  }
  return file;
}

// Each beat's sentence clips, from the cache or made by speak.py (one call per
// language for all beats not cached yet): per beat { rate, sentences: [{ wav, dur, words | heard, source }] }.
function speakBeats(beats, lang, voice, lex) {
  const keyOf = (sents) => createHash('sha1').update(JSON.stringify([SYNTH_VERSION, voice.model, voice.length, lex, sents])).digest('hex').slice(0, 16);
  const dirs = beats.map((sents) => join(CACHE, `${lang}-${keyOf(sents)}`));
  const todo = beats.map((sents, i) => ({ dir: dirs[i], sentences: sents })).filter((b) => !existsSync(join(b.dir, 'meta.json')));
  if (todo.length) {
    console.log(`${lang}: synthesizing ${todo.length} of ${beats.length} beats with ${voice.model} at ${voice.length}`);
    const job = { model: voiceModel(voice), length: voice.length, lang, lexicon: lex, whisper: FALLBACK_WHISPER, align: true, beats: todo };
    const r = spawnSync('python3', ['-I', join(KIT, 'speak.py')], { input: JSON.stringify(job), maxBuffer: 1 << 26, stdio: ['pipe', 'pipe', 'inherit'] });
    if (r.status !== 0) throw new Error(`speak.py failed (${r.status})`);
  }
  return dirs.map((dir) => {
    const meta = JSON.parse(readFileSync(join(dir, 'meta.json'), 'utf8'));
    for (const s of meta.sentences) for (const w of s.warn || []) console.warn(`${lang}: ${w}`);
    return { ...meta, sentences: meta.sentences.map((s) => ({ ...s, wav: readFileSync(join(dir, s.file)) })) };
  });
}

// The measured span of each spoken word of a clip (seconds from the clip's start).
function spokenSpans(s) {
  const toks = s.text.split(/\s+/);
  if (s.source === 'piper') return s.words.map((w) => ({ start: w.start, end: w.end }));
  if (s.source === 'whisper') return forceAlign(toks, s.heard);
  // no timing at all: share the clip out by letters (the guard then checks the cues against it)
  const all = toks.reduce((a, t) => a + t.length + 1, 0);
  let at = 0;
  return toks.map((t) => {
    const span = { start: (s.dur * at) / all, end: (s.dur * (at + t.length)) / all };
    at += t.length + 1;
    return span;
  });
}

export function narrate(id, langs = ['nl', 'en'], { local = false, voice: override = null } = {}) {
  const page = join(ROOT, 'src/content/courses/films', `${id}.html`);
  const data = readFilmData(readFileSync(page, 'utf8'));
  if (!data.scenes.every((s) => s.beats.every((b) => b.voice))) throw new Error(`${id}: not every beat has a narration script (say)`);
  const dir = join(OUT, id);
  mkdirSync(dir, { recursive: true });
  const config = voicesConfig();
  const result = {};
  for (const lang of langs) {
    const voice = voiceOf(lang, config, override && override.startsWith(lang) ? override : null);
    const lexFile = join(KIT, `lexicon.${lang}.json`);
    const lex = existsSync(lexFile) ? JSON.parse(readFileSync(lexFile, 'utf8')) : {};
    const flat = data.scenes.flatMap((s, si) => s.beats.map((b, bi) => ({ si, bi, sents: sentenceClips(b.say[lang], lang) })));
    const spoken = speakBeats(flat.map((b) => b.sents.map((c) => c.spoken)), lang, voice, lex);
    const durs = data.scenes.map((s, si) => s.beats.map((_, bi) => {
      const k = flat.findIndex((b) => b.si === si && b.bi === bi);
      return beatLength(spoken[k].sentences.map((c) => wavInfo(c.wav).dur));
    }));
    const atl = audioTimeline(durs);
    const parts = [];
    const lines = [];
    const sentences = [];
    flat.forEach((b, k) => {
      const clips = spoken[k].sentences;
      beatLayout(atl.scenes[b.si].beats[b.bi].start, clips.map((c) => wavInfo(c.wav).dur)).forEach((at, j) => {
        const clip = clips[j];
        const sent = b.sents[j];
        if (clip.text !== sent.spoken) throw new Error(`cache mismatch: "${clip.text}" vs "${sent.spoken}"`);
        parts.push({ at: at.start, wav: clip.wav });
        const sp = spokenSpans(clip).map((w) => ({ start: at.start + w.start, end: at.start + w.end }));
        const words = saidWordSpans(sent.said, lang, sp);
        lines.push(timedPhrases(sent, words));
        const r3 = (x) => Math.round(x * 1000) / 1000;
        sentences.push({
          scene: b.si + 1, beat: `${b.si + 1}.${b.bi + 1}`, start: r3(at.start), end: r3(at.start + at.dur), said: sent.said, spoken: sent.spoken, source: clip.source,
          words: sp.map((w, i) => ({ w: clip.text.split(/\s+/)[i], start: r3(w.start), end: r3(w.end) })),
        });
      });
    });
    writeFileSync(join(dir, `${lang}.wav`), joinTrack(parts, atl.total));
    const cues = cuesOfLines(lines);
    const vtt = vttOf(cues);
    writeFileSync(join(dir, `${lang}.timing.json`), JSON.stringify({ id, lang, voice, pauses: PAUSES, atl, sentences, cues }, null, 1));
    writeFileSync(join(dir, `${lang}.vtt`), vtt);
    if (!local) writeFileSync(join(ROOT, 'src/content/courses/films', `${id}.${lang}.vtt`), vtt);
    const sources = [...new Set(sentences.map((s) => s.source))].join(', ');
    console.log(`${id} ${lang}: ${atl.total.toFixed(1)} s narration (${voice.model} at ${voice.length}), ${data.scenes.length} scenes, ${sentences.length} sentences, cue timing from ${sources}${local ? ' (local: nothing committed written)' : ''}`);
    result[lang] = atl;
  }
  return result;
}

if (process.argv[1] && process.argv[1].endsWith('narrate.mjs')) {
  const id = process.argv[2];
  if (!id) { console.error('usage: node films/_kit/narrate.mjs <film id> [--lang nl,en] [--local] [--voice <model>:<length>]'); process.exit(2); }
  const arg = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
  narrate(id, arg('--lang') ? arg('--lang').split(',') : ['nl', 'en'], { local: process.argv.includes('--local'), voice: arg('--voice') });
}

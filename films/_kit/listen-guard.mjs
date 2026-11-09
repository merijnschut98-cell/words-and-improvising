// Dev tool, not shipped. The listen guard: objective checks on a rendered
// narration track, so a voice regression like the one of 2026-11-08 (a second
// of silence at every comma, cues 0.6 s early, broken stress) cannot ship
// unheard again. films/_kit/render.mjs runs it on every full render and
// refuses to finish when it fails.
//
//   node films/_kit/listen-guard.mjs <film id> [--lang nl] [--audio file.mp4|.wav] [--wer small|large-v3-turbo|off]
//
// Reads films-out/<id>/<lang>.timing.json (the sentence clips and their word
// timing, from narrate.mjs), films-out/<id>/<lang>.vtt and the audio (the MP4
// when there is one, else the WAV), and checks:
// - no silence longer than GUARD.inside inside a sentence (its span from the
//   synthesis timing);
// - every pause at a full stop (between two sentences of one line) within
//   GUARD.stop;
// - every subtitle cue's text, its English gloss taken out, is exactly the
//   words spoken in its span, and the cue starts with its first word;
// - with faster-whisper installed: the word error rate of a Whisper
//   transcript against the script (films/_kit/wer.py), at most 15 % for
//   large-v3-turbo and 20 % for small.
// Exit code 1 when a check fails.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spokenOf } from './narration.mjs';

const KIT = dirname(fileURLToPath(import.meta.url));
const ROOT = join(KIT, '../..');
export const GUARD = { inside: 0.4, stop: [0.4, 0.9], frame: 0.02, floor: 0.01, cueSlack: 0.15, tol: 0.02 };
export const werLimit = (model) => (/large/.test(String(model)) ? 0.15 : 0.2);

const unglossed = (text) => text.replace(/\s*\([^()]*\)/g, '').replace(/\s+/g, ' ').trim();
const f2 = (x) => x.toFixed(2);

// Per frame of GUARD.frame: is there sound (RMS above GUARD.floor of the loud speech level)?
function soundFrames(samples, rate) {
  const n = Math.max(1, Math.round(GUARD.frame * rate));
  const k = Math.floor(samples.length / n);
  const rms = new Float32Array(k);
  for (let f = 0; f < k; f++) {
    let s = 0;
    for (let i = f * n; i < (f + 1) * n; i++) s += samples[i] * samples[i];
    rms[f] = Math.sqrt(s / n);
  }
  const voiced = [...rms].filter((r) => r > 1e-4).sort((a, b) => a - b);
  const ref = voiced.length ? voiced[Math.floor(voiced.length * 0.95)] : 1;
  return Array.from(rms, (r) => r > ref * GUARD.floor);
}

// Runs of silent frames in [t0, t1) as { start, len } seconds; edge says whether it touches t0 or t1.
function silences(sound, t0, t1) {
  const f0 = Math.max(0, Math.round(t0 / GUARD.frame));
  const f1 = Math.min(sound.length, Math.round(t1 / GUARD.frame));
  const out = [];
  let run = null;
  for (let f = f0; f <= f1; f++) {
    const silent = f < f1 && !sound[f];
    if (silent && run === null) run = f;
    if (!silent && run !== null) {
      out.push({ start: run * GUARD.frame, len: (f - run) * GUARD.frame, edge: run === f0 || f === f1 });
      run = null;
    }
  }
  return out;
}

// samples: mono float; sentences: [{ beat, start, end, said, words: [{ w, start, end }] }];
// cues: [{ start, end, text }]; wer: { model, wer } when Whisper ran.
export function listenGuard({ samples, rate, sentences, cues, lang, wer = null }) {
  const errors = [];
  const sound = soundFrames(samples, rate);
  let maxInside = 0;
  sentences.forEach((s, i) => {
    for (const r of silences(sound, s.start, s.end)) {
      if (r.edge) continue;
      maxInside = Math.max(maxInside, r.len);
      if (r.len > GUARD.inside + 1e-9) errors.push(`sentence ${i + 1} ("${s.said}"): silence of ${f2(r.len)} s inside, at ${f2(r.start)} s`);
    }
  });
  const stops = [];
  sentences.forEach((s, i) => {
    const b = sentences[i + 1];
    if (!b || b.beat !== s.beat) return;
    const mid = (s.end + b.start) / 2;
    const r = silences(sound, s.end - 0.5, b.start + 0.5).find((x) => x.start <= mid + 1e-9 && x.start + x.len >= mid - 1e-9);
    if (!r) { errors.push(`sentence ${i + 1}: no pause at its full stop (${f2(s.end)} s)`); return; }
    stops.push(r.len);
    if (r.len < GUARD.stop[0] - 1e-9 || r.len > GUARD.stop[1] + 1e-9) errors.push(`sentence ${i + 1}: full-stop pause of ${f2(r.len)} s at ${f2(s.end)} s (want ${GUARD.stop[0]}–${GUARD.stop[1]} s)`);
  });
  const owner = cues.map((c) => sentences.findIndex((s) => (c.start + c.end) / 2 >= s.start - GUARD.tol && (c.start + c.end) / 2 <= s.end + GUARD.tol));
  cues.forEach((c, k) => {
    if (owner[k] < 0) { errors.push(`cue ${k + 1} ("${c.text}") at ${f2(c.start)} s lies in no sentence`); return; }
    const want = spokenOf(unglossed(c.text), lang).split(' ');
    const ws = sentences[owner[k]].words.filter((w) => (w.start + w.end) / 2 >= c.start - GUARD.tol && (w.start + w.end) / 2 <= c.end + GUARD.tol);
    const got = ws.map((w) => w.w);
    if (got.join(' ') !== want.join(' ')) errors.push(`cue ${k + 1}: text "${c.text}" but spoken in its span: "${got.join(' ')}"`);
    else if (Math.abs(c.start - ws[0].start) > GUARD.cueSlack) errors.push(`cue ${k + 1} starts ${f2(Math.abs(c.start - ws[0].start))} s ${c.start < ws[0].start ? 'before' : 'after'} its first word`);
  });
  sentences.forEach((s, i) => {
    const text = cues.filter((_, k) => owner[k] === i).map((c) => unglossed(c.text)).join(' ');
    if (text !== s.said) errors.push(`sentence ${i + 1}: subtitles "${text}" are not the words spoken "${s.said}"`);
  });
  if (wer && wer.wer > werLimit(wer.model)) errors.push(`word error rate ${Math.round(wer.wer * 100)} % (${wer.model}) above ${Math.round(werLimit(wer.model) * 100)} %`);
  const sorted = [...stops].sort((a, b) => a - b);
  return {
    ok: errors.length === 0,
    errors,
    stats: {
      sentences: sentences.length,
      cues: cues.length,
      maxInside: Math.round(maxInside * 100) / 100,
      stops: { n: stops.length, min: sorted[0] ?? null, max: sorted[sorted.length - 1] ?? null, median: sorted.length ? sorted[Math.floor(sorted.length / 2)] : null },
      wer,
    },
  };
}

export function parseVtt(vtt) {
  const sec = (t) => { const [h, m, s] = t.split(':'); return Number(h) * 3600 + Number(m) * 60 + Number(s); };
  return vtt.replace(/\r/g, '').split(/\n\n+/).slice(1).map((block) => {
    const lines = block.split('\n').filter(Boolean);
    const at = lines.findIndex((l) => l.includes('-->'));
    if (at < 0) return null;
    const [a, b] = lines[at].split('-->').map((x) => sec(x.trim().split(' ')[0]));
    const text = lines.slice(at + 1).join(' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    return { start: a, end: b, text };
  }).filter(Boolean);
}

function decode(file, rate = 16000) {
  const r = spawnSync(process.env.FFMPEG || 'ffmpeg', ['-v', 'error', '-i', file, '-ac', '1', '-ar', String(rate), '-f', 'f32le', '-'], { maxBuffer: 1 << 30 });
  if (r.status !== 0) throw new Error(`ffmpeg could not decode ${file}: ${String(r.stderr).slice(-500)}`);
  const buf = r.stdout;
  return new Float32Array(buf.buffer, buf.byteOffset, Math.floor(buf.length / 4));
}

// The guard on a film's rendered track. wer: a faster-whisper model name, or 'off'.
export function runGuard(id, lang, { audio = null, wer = process.env.FILM_GUARD_WER || 'small', log = console.log } = {}) {
  const dir = join(ROOT, 'films-out', id);
  const timing = JSON.parse(readFileSync(join(dir, `${lang}.timing.json`), 'utf8'));
  if (!timing.sentences || !timing.sentences[0] || !timing.sentences[0].words) throw new Error(`${id} ${lang}: timing without word timing: narrate it again`);
  const cues = parseVtt(readFileSync(join(dir, `${lang}.vtt`), 'utf8'));
  const file = audio || (existsSync(join(dir, `${lang}.mp4`)) ? join(dir, `${lang}.mp4`) : join(dir, `${lang}.wav`));
  const rate = 16000;
  const samples = decode(file, rate);
  let w = null;
  if (wer && wer !== 'off') {
    const tmp = mkdtempSync(join(tmpdir(), 'guard-'));
    const ref = join(tmp, 'ref.txt');
    writeFileSync(ref, timing.sentences.map((s) => s.spoken).join('\n'));
    const r = spawnSync('python3', ['-I', join(KIT, 'wer.py'), file, ref, lang, wer], { maxBuffer: 1 << 26, env: { ...process.env, HF_HUB_OFFLINE: process.env.HF_HUB_OFFLINE || '1' } });
    if (r.status === 0) w = { model: wer, ...JSON.parse(String(r.stdout).trim().split('\n').pop()) };
    else log(`listen guard: no word error rate (${String(r.stderr).trim().split('\n').pop()})`);
  }
  const res = listenGuard({ samples, rate, sentences: timing.sentences, cues, lang, wer: w ? { model: w.model, wer: w.wer } : null });
  const st = res.stats;
  log(`listen guard ${id} ${lang} (${file.split('/').pop()}): ${st.sentences} sentences, ${st.cues} cues; longest silence inside a sentence ${st.maxInside} s; `
    + `full-stop pauses ${st.stops.n} (${st.stops.min?.toFixed(2)}–${st.stops.max?.toFixed(2)} s, median ${st.stops.median?.toFixed(2)} s)`
    + `${w ? `; WER ${(w.wer * 100).toFixed(1)} % (${w.model}, ${w.ref_words} words)` : ''} → ${res.ok ? 'PASS' : 'FAIL'}`);
  for (const e of res.errors) log(`  ${e}`);
  return { ...res, hyp: w && w.hyp };
}

if (process.argv[1] && process.argv[1].endsWith('listen-guard.mjs')) {
  const id = process.argv[2];
  const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
  if (!id) { console.error('usage: node films/_kit/listen-guard.mjs <film id> [--lang nl] [--audio file] [--wer small|large-v3-turbo|off]'); process.exit(2); }
  let ok = true;
  for (const lang of arg('--lang', 'nl').split(',')) ok = runGuard(id, lang, { audio: arg('--audio', null), wer: arg('--wer', process.env.FILM_GUARD_WER || 'small') }).ok && ok;
  process.exit(ok ? 0 : 1);
}

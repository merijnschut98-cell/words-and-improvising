// v14b, real video: the pure parts of the narration and render pipeline. No
// imports from Node and no browser: films/_kit/narrate.mjs and render.mjs use
// them, and tests/filmvideo.test.js imports them as they are.
//
// - WAV: read a header, write one, join recorded lines into one track with
//   silence at their places on the timeline (films/_kit/timeline.mjs, audioTimeline).
// - The voice: one Piper clip per sentence (commas inside), laid out with the
//   pauses of timeline.mjs; the voice and speed per language from
//   films/_kit/voices.json.
// - Captions: the narration as WebVTT cues, cut at word boundaries measured in
//   each sentence clip (Piper's phoneme alignments, or Whisper as a fallback).
// - The manifest: per film and language the duration, size and scene starts of
//   the video, which the app reads to play it (src/content/courses/films/manifest.json).
import { saidOf, sayable, PAUSES } from './timeline.mjs';

// ---------------------------------------------------------------- WAV (PCM, 16 bit)
export function wavInfo(buf) {
  if (!buf || buf.length < 44 || buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WAVE') throw new Error('not a WAV file');
  let off = 12;
  let fmt = null;
  while (off + 8 <= buf.length) {
    const id = buf.toString('ascii', off, off + 4);
    const size = buf.readUInt32LE(off + 4);
    if (id === 'fmt ') fmt = { channels: buf.readUInt16LE(off + 10), rate: buf.readUInt32LE(off + 12), bits: buf.readUInt16LE(off + 22) };
    if (id === 'data') {
      if (!fmt) throw new Error('WAV without a fmt chunk');
      const dataBytes = Math.min(size, buf.length - off - 8);
      return { rate: fmt.rate, channels: fmt.channels, bits: fmt.bits, dataOffset: off + 8, dataBytes, dur: dataBytes / (fmt.rate * fmt.channels * (fmt.bits / 8)) };
    }
    off += 8 + size + (size % 2);
  }
  throw new Error('WAV without a data chunk');
}

export function wavFile(pcm, rate, channels = 1, bits = 16) {
  const h = Buffer.alloc(44);
  h.write('RIFF', 0, 'ascii');
  h.writeUInt32LE(36 + pcm.length, 4);
  h.write('WAVE', 8, 'ascii');
  h.write('fmt ', 12, 'ascii');
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(channels, 22);
  h.writeUInt32LE(rate, 24);
  h.writeUInt32LE(rate * channels * (bits / 8), 28);
  h.writeUInt16LE(channels * (bits / 8), 32);
  h.writeUInt16LE(bits, 34);
  h.write('data', 36, 'ascii');
  h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

// parts: [{ at: seconds, wav: Buffer }], all mono 16 bit at one rate. Returns
// one WAV of `total` seconds with each line at its place and silence between.
export function joinTrack(parts, total) {
  if (!parts.length) throw new Error('no lines to join');
  const infos = parts.map((p) => wavInfo(p.wav));
  const { rate } = infos[0];
  for (const i of infos) if (i.rate !== rate || i.channels !== 1 || i.bits !== 16) throw new Error('lines must be mono 16 bit at one rate');
  const out = Buffer.alloc(Math.round(total * rate) * 2);
  let end = 0;
  parts.forEach((p, k) => {
    const from = Math.round(p.at * rate) * 2;
    if (from < end) throw new Error(`line ${k + 1} would overlap the line before it`);
    const data = p.wav.subarray(infos[k].dataOffset, infos[k].dataOffset + infos[k].dataBytes);
    if (from + data.length > out.length) throw new Error(`line ${k + 1} runs past the end of the track`);
    data.copy(out, from);
    end = from + data.length;
  });
  return wavFile(out, rate);
}

// ---------------------------------------------------------------- captions
// Sentences; a sentence longer than max is split at the comma (or colon,
// semicolon, then after an English gloss's closing parenthesis, then space)
// nearest its middle, until every piece fits.
export function cueChunks(text, max = 90) {
  const out = [];
  const split = (s) => {
    if (s.length <= max) { out.push(s); return; }
    const mid = s.length / 2;
    let best = -1;
    for (const re of [/[,;:] /g, /\) /g, / /g]) {
      for (const m of s.matchAll(re)) if (best < 0 || Math.abs(m.index - mid) < Math.abs(best - mid)) best = m.index;
      if (best > 0) break;
    }
    if (best <= 0) { out.push(s); return; }
    const cut = s[best] === ' ' ? best : best + 1;
    split(s.slice(0, cut).trim());
    split(s.slice(cut).trim());
  };
  for (const s of String(text || '').trim().split(/(?<=[.!?])\s+/)) if (s.trim()) split(s.trim());
  return out;
}

const pad = (n, w = 2) => String(n).padStart(w, '0');
export function vttTime(sec) {
  const ms = Math.round(sec * 1000);
  return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)}.${pad(ms % 1000, 3)}`;
}

// The cues of one language: each beat's spoken script, cut into chunks that
// share the beat's line by their length.
export function cuesOf(data, atl, lang) {
  const cues = [];
  data.scenes.forEach((s, si) => s.beats.forEach((b, bi) => {
    const seg = b.say && b.say[lang];
    if (!seg) return;
    const at = atl.scenes[si].beats[bi];
    const chunks = cueChunks(saidOf(seg));
    const all = chunks.reduce((a, c) => a + c.length, 0);
    let t = at.start;
    chunks.forEach((c, k) => {
      const end = k + 1 === chunks.length ? at.start + at.dur : t + (at.dur * c.length) / all;
      cues.push({ start: Math.round(t * 1000) / 1000, end: Math.round(end * 1000) / 1000, text: c });
      t = end;
    });
  }));
  return cues;
}

// What the voice gets: units and signs as words (timeline.mjs SAY). The
// subtitle keeps the text as written. Pronunciation fixes (films/_kit/
// lexicon.<lang>.json) are swapped into espeak-ng's phonemes of the whole
// sentence by films/_kit/speak.py, never cut into the text as [[ ]] pieces.
export const spokenOf = (text, lang) => sayable(text, lang).replace(/\s+/g, ' ').trim();
const tokensOf = (s) => String(s).trim().split(/\s+/).filter(Boolean);

export const SUB_MAX = 84; // about 2 lines of video subtitles on a phone
const MIN_PHRASE_WORDS = 3; // shorter phrases ride with the next one

// The sentences of one resolved script (said text), each as its phrases:
// [['De voeding is 0,3 mm.'], ['Hoe dunner,', 'hoe sneller.']].
// With { gloss: true }, the same phrases as subtitled: a Dutch term carries its
// English word in parentheses on its first use ("De voeding (feed) is 0,3 mm."),
// which the voice skips. The gloss rides inside its term's word while the
// phrases are cut, so both forms always have the same sentences and phrases.
const GLOSS = { open: '\u0002', close: '\u0003', space: '\u0001' };
// A gloss equal to the term as shown (CAM, H7) is left out.
const glossOf = (p) => (p.en && p.en.toLowerCase() !== String(p.t).toLowerCase() ? GLOSS.open + p.en.replace(/\s+/g, GLOSS.space) + GLOSS.close : '');
const glossedOf = (seg) => seg.map((p) => (typeof p === 'string' ? p : p.t + glossOf(p))).join('').replace(/\s+/g, ' ').trim();
const unmark = (s) => s.split(GLOSS.open).join(' (').split(GLOSS.close).join(')').split(GLOSS.space).join(' ');
export function phrasesOf(seg, { gloss = false } = {}) {
  const out = phrasesIn(gloss ? glossedOf(seg) : String(saidOf(seg)));
  return gloss ? out.map((ph) => ph.map(unmark)) : out;
}
function phrasesIn(text) {
  return text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean).map((s) => {
    const out = [];
    let carry = '';
    for (const p of s.split(/(?<=,)\s+/)) {
      const piece = carry ? `${carry} ${p}` : p;
      if (piece.split(/\s+/).length < MIN_PHRASE_WORDS && piece !== s && !/[.!?]$/.test(piece)) { carry = piece; continue; }
      out.push(piece);
      carry = '';
    }
    if (carry) { if (out.length) out[out.length - 1] += ` ${carry}`; else out.push(carry); }
    return out;
  });
}

// The sentences of one beat's script (a resolved segment list), each one Piper
// clip: what is said (the subtitle without gloss), what the voice gets, and
// its phrases (cut at commas, as phrasesOf) plain and as subtitled.
export function sentenceClips(seg, lang) {
  const glossed = phrasesOf(seg, { gloss: true });
  return phrasesOf(seg).map((phrases, i) => {
    const said = phrases.join(' ');
    return { said, spoken: spokenOf(said, lang), phrases, glossed: glossed[i] };
  });
}

// The sentence clips of one beat from its start, by measured length, with the
// full-stop pause in between: [{ start, dur }].
export function beatLayout(start, durs, pauses = PAUSES) {
  let t = start;
  return durs.map((d) => {
    const c = { start: round3(t), dur: round3(d) };
    t += d + pauses.sentence;
    return c;
  });
}
// The length of one beat made of these sentence clips.
export function beatLength(durs, pauses = PAUSES) {
  const lay = beatLayout(0, durs, pauses);
  return lay.length ? round3(lay[lay.length - 1].start + lay[lay.length - 1].dur) : 0;
}

// spans: the measured { start, end } of each spoken word of a sentence (its
// spokenOf form, split at spaces). Returns the span of each written word: a
// written word the voice says as several ("1.167" as "11honderd 67") spans
// them all. Mapped by prefixes, so a unit that spans two words stays whole.
export function saidWordSpans(said, lang, spans) {
  const toks = tokensOf(said);
  const total = tokensOf(spokenOf(said, lang)).length;
  if (spans.length !== total) throw new Error(`${spans.length} timed spoken words for ${total} spoken words: ${said}`);
  let prev = 0;
  return toks.map((_, i) => {
    const c = i + 1 === toks.length ? total : Math.min(total, Math.max(prev, tokensOf(spokenOf(toks.slice(0, i + 1).join(' '), lang)).length));
    const at = prev < total ? spans[prev].start : spans[total - 1].end;
    const span = c > prev ? { start: spans[prev].start, end: spans[c - 1].end } : { start: at, end: at };
    prev = c;
    return span;
  });
}

// The fallback when Piper gives no alignments: Whisper's word timestamps
// (heard: [{ word, start, end }]) forced onto the known script's words. The
// letters of both are aligned (edit distance), so a word Whisper splits or
// glues still gets its time; a word it missed sits between its neighbours.
export function forceAlign(tokens, heard) {
  const norm = (w) => String(w).toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}]/gu, '');
  const a = [];
  tokens.forEach((t, i) => { for (const ch of norm(t)) a.push({ ch, i }); });
  const b = [];
  for (const h of heard) {
    const chars = [...norm(h.word)];
    chars.forEach((ch, k) => b.push({ ch, t0: h.start + ((h.end - h.start) * k) / chars.length, t1: h.start + ((h.end - h.start) * (k + 1)) / chars.length }));
  }
  const n = a.length;
  const m = b.length;
  const d = Array.from({ length: n + 1 }, (_, i) => Int32Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) d[i][j] = Math.min(d[i - 1][j - 1] + (a[i - 1].ch === b[j - 1].ch ? 0 : 1), d[i - 1][j] + 1, d[i][j - 1] + 1);
  }
  const spans = tokens.map(() => null);
  for (let i = n, j = m; i > 0 && j > 0;) {
    if (d[i][j] === d[i - 1][j - 1] + (a[i - 1].ch === b[j - 1].ch ? 0 : 1)) {
      const s = spans[a[i - 1].i];
      const { t0, t1 } = b[j - 1];
      spans[a[i - 1].i] = s ? { start: Math.min(s.start, t0), end: Math.max(s.end, t1) } : { start: t0, end: t1 };
      i--; j--;
    } else if (d[i][j] === d[i - 1][j] + 1) i--;
    else j--;
  }
  // in order, and the words nobody heard shared out over the gap they sit in
  const end0 = heard.length ? heard[0].start : 0;
  const endN = heard.length ? heard[heard.length - 1].end : 0;
  let last = end0;
  for (let i = 0; i < spans.length; i++) {
    if (spans[i]) {
      spans[i] = { start: Math.max(spans[i].start, last), end: Math.max(spans[i].end, last) };
      last = spans[i].end;
      continue;
    }
    let k = i;
    while (k < spans.length && !spans[k]) k++;
    const to = k < spans.length ? Math.max(last, spans[k].start) : Math.max(last, endN);
    const step = (to - last) / (k - i);
    for (let q = i; q < k; q++) spans[q] = { start: last + step * (q - i), end: last + step * (q - i + 1) };
    last = to;
    i = k - 1;
  }
  return spans.map((s) => ({ start: round3(s.start), end: round3(s.end) }));
}

// A sentence clip's phrases timed by its written words' spans (absolute
// seconds): each phrase from its first word's start to its last word's end,
// with the subtitle text (glossed) and the spans of its words, for cuesOfLines.
export function timedPhrases(sentence, words) {
  const counts = sentence.phrases.map((p) => tokensOf(p).length);
  if (counts.reduce((x, y) => x + y, 0) !== words.length) throw new Error(`${words.length} timed words for "${sentence.phrases.join(' ')}"`);
  let i = 0;
  return sentence.phrases.map((_, k) => {
    const ws = words.slice(i, i + counts[k]);
    i += counts[k];
    return { start: round3(ws[0].start), dur: round3(ws[ws.length - 1].end - ws[0].start), text: sentence.glossed[k], words: ws };
  });
}

// The voice of a language from films/_kit/voices.json ({ nl: { model, length } }),
// with its download path on huggingface.co/rhasspy/piper-voices. override
// ("nl_NL-pim-medium:0.9", from narrate.mjs --voice) is for a one-off A/B listen.
export function voiceOf(lang, config, override = null) {
  const v = config && config[lang];
  if (!v || !v.model) throw new Error(`no voice for "${lang}" in films/_kit/voices.json`);
  let { model, length } = v;
  if (override) {
    const [m, l] = String(override).split(':');
    if (m) model = m;
    if (l) length = Number(l);
  }
  const p = /^([a-z]{2,3})_([A-Z]{2})-(.+)-(x_low|low|medium|high)$/.exec(model);
  if (!p || !(length > 0)) throw new Error(`bad voice ${model} ${length}`);
  return { model, path: `${p[1]}/${p[1]}_${p[2]}/${p[3]}/${p[4]}`, length };
}

// sentences: [[{ start, dur, text, words? }]], the timed phrases of each sentence.
// A sentence that fits in SUB_MAX is one cue from its first word to its last;
// a longer one is cut between phrases (greedy, each cue as long as fits), and a
// phrase longer than SUB_MAX is cut at a space: at its words' measured times
// when the phrase carries them (one span per written word, the gloss not
// counted), else by length.
export function cuesOfLines(sentences, max = SUB_MAX) {
  const cues = [];
  const push = (group) => cues.push({ start: group[0].start, end: round3(group[group.length - 1].start + group[group.length - 1].dur), text: group.map((p) => p.text).join(' ') });
  for (const ph of sentences) {
    let group = [];
    for (const p of ph) {
      if (p.text.length > max) {
        if (group.length) { push(group); group = []; }
        const chunks = cueChunks(p.text, max);
        const counts = chunks.map((c) => tokensOf(c.replace(/\s*\([^()]*\)/g, '')).length);
        if (p.words && counts.reduce((a, c) => a + c, 0) === p.words.length) {
          let i = 0;
          chunks.forEach((c, k) => {
            const ws = p.words.slice(i, i + counts[k]);
            i += counts[k];
            cues.push({ start: round3(ws[0].start), end: round3(ws[ws.length - 1].end), text: c });
          });
          continue;
        }
        const all = chunks.reduce((a, c) => a + c.length, 0);
        let t = p.start;
        chunks.forEach((c, k) => {
          const end = k + 1 === chunks.length ? p.start + p.dur : t + (p.dur * c.length) / all;
          cues.push({ start: round3(t), end: round3(end), text: c });
          t = end;
        });
        continue;
      }
      if (group.length && [...group, p].map((x) => x.text).join(' ').length > max) { push(group); group = []; }
      group.push(p);
    }
    if (group.length) push(group);
  }
  return cues;
}
const round3 = (x) => Math.round(x * 1000) / 1000;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const vttOf = (cues) => `WEBVTT\n\n${cues.map((c, i) => `${i + 1}\n${vttTime(c.start)} --> ${vttTime(c.end)}\n${esc(c.text)}\n`).join('\n')}`;

// ---------------------------------------------------------------- the manifest
// Public bucket `films` in the app's Supabase project (src/core/cloud.js).
export const MANIFEST_BASE = 'https://ysybqtdzcutmyabfwijl.supabase.co/storage/v1/object/public/films';
export const filmUrl = (base, id, lang) => `${base}/${id}/${lang}.mp4`;
const ID = /^[a-z]+(\.[a-z0-9]+)+$/;

// A new manifest with this film's video in this language recorded.
export function manifestWith(prev, id, lang, { dur, bytes, scenes }) {
  if (!ID.test(id)) throw new Error(`bad film id ${id}`);
  if (lang !== 'nl' && lang !== 'en') throw new Error(`bad lang ${lang}`);
  const m = prev ? JSON.parse(JSON.stringify(prev)) : {};
  m.base = MANIFEST_BASE;
  m.pattern = '{base}/{id}/{lang}.mp4';
  m.films = m.films || {};
  const f = m.films[id] || {};
  f.poster = `src/content/courses/films/${id}.jpg`;
  f[lang] = {
    dur: Math.round(dur * 10) / 10,
    bytes,
    scenes: scenes.map((s) => Math.round(s * 100) / 100),
    vtt: `src/content/courses/films/${id}.${lang}.vtt`,
  };
  m.films[id] = f;
  return m;
}

// v14b, real video: the pure parts of the narration and render pipeline. No
// imports from Node and no browser: films/_kit/narrate.mjs and render.mjs use
// them, and tests/filmvideo.test.js imports them as they are.
//
// - WAV: read a header, write one, join recorded lines into one track with
//   silence at their places on the timeline (films/_kit/timeline.mjs, audioTimeline).
// - Captions: the narration as WebVTT cues, sentence by sentence, each beat's
//   cues spread over its line by length.
// - The manifest: per film and language the duration, size and scene starts of
//   the video, which the app reads to play it (src/content/courses/films/manifest.json).
import { saidOf, sayable, PAUSES } from './timeline.mjs';
import { applyLexicon } from './lexicon.mjs';

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
// semicolon, then space) nearest its middle, until every piece fits.
export function cueChunks(text, max = 90) {
  const out = [];
  const split = (s) => {
    if (s.length <= max) { out.push(s); return; }
    const mid = s.length / 2;
    let best = -1;
    for (const re of [/[,;:] /g, / /g]) {
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

// Exact timing: each phrase of a beat's script (a sentence, or the part of one
// up to a comma) is recorded as its own clip, so the subtitle is exactly what
// is being said, and the pauses after a comma and a full stop are ours
// (PAUSES in timeline.mjs). The clip text keeps its comma, so the voice still
// reads it as a clause that goes on.
// What the voice gets for one phrase: units and signs as words, then the
// lexicon's phonemes for the words espeak-ng would say wrong. The subtitle keeps
// the phrase as written.
export const spokenOf = (text, lang, lex) => applyLexicon(sayable(text, lang).replace(/\s+/g, ' ').trim(), lex);

export const SUB_MAX = 84; // about 2 lines of video subtitles on a phone
const MIN_PHRASE_WORDS = 3; // shorter phrases ride with the next one

// The sentences of one resolved script (said text, as subtitled), each as its
// phrases: [['De voeding is 0,3 mm.'], ['Hoe dunner,', 'hoe sneller.']].
export function phrasesOf(seg) {
  return String(saidOf(seg)).split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean).map((s) => {
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

// The clips of one beat from its start, by measured length: durs is per
// sentence a list of phrase lengths. Returns per sentence [{ start, dur }].
export function beatLayout(start, durs, pauses = PAUSES) {
  let t = start;
  return durs.map((ph, si) => ph.map((d, pi) => {
    const c = { start: round3(t), dur: round3(d) };
    t += d + (pi + 1 < ph.length ? pauses.comma : si + 1 < durs.length ? pauses.sentence : 0);
    return c;
  }));
}
// The length of one beat made of these clips.
export function beatLength(durs, pauses = PAUSES) {
  const lay = beatLayout(0, durs, pauses).flat();
  return lay.length ? round3(lay[lay.length - 1].start + lay[lay.length - 1].dur) : 0;
}

// sentences: [[{ start, dur, text }]], the recorded phrases of each sentence.
// A sentence that fits in SUB_MAX is one cue from its first word to its last;
// a longer one is cut between phrases (greedy, each cue as long as fits), and a
// phrase longer than SUB_MAX is cut at a space, timed by its length.
export function cuesOfLines(sentences, max = SUB_MAX) {
  const cues = [];
  const push = (group) => cues.push({ start: group[0].start, end: round3(group[group.length - 1].start + group[group.length - 1].dur), text: group.map((p) => p.text).join(' ') });
  for (const ph of sentences) {
    let group = [];
    for (const p of ph) {
      if (p.text.length > max) {
        if (group.length) { push(group); group = []; }
        const chunks = cueChunks(p.text, max);
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

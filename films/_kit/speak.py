#!/usr/bin/env python3
"""Dev tool, not shipped. The narration voice: Piper TTS, one call per sentence.

    python3 -I films/_kit/speak.py < job.json

films/_kit/narrate.mjs writes the job and reads the result. The job:

    {"model": "<voice>.onnx", "length": 0.82, "lang": "nl", "lexicon": {word: ipa},
     "whisper": "small" | null, "align": true,
     "beats": [{"dir": "<cache dir>", "sentences": ["<spoken sentence>", ...]}]}

Per beat this writes <dir>/s<k>.wav (mono 16 bit) and <dir>/meta.json:

    {"rate": 22050, "gain": 1.7, "sentences": [{"file": "s0.wav", "dur": 3.1,
      "source": "piper" | "whisper" | "none", "words": [{"w", "start", "end"}] | null,
      "heard": [{"word", "start", "end"}] | null, "lexicon": [...], "warn": [...]}]}

What it does, after the voice A/B of 2026-11-09 (films/_kit/voice-ab):
- One Piper call per sentence, commas inside, so the voice keeps the sentence
  melody and its own comma pause (the kit made one clip per phrase before,
  which laid about a second of silence at every comma).
- Piper's own silence at the clip's edges (about 0.62 s before, 0.19 s after)
  is measured and trimmed to KEEP, so the pauses of timeline.mjs are the
  pauses heard.
- Loudness: Piper's per-clip peak normalisation is off; each beat gets one
  gain (speech level to TARGET_DB, peak at most PEAK), so the sentences of a
  line keep their natural relative level.
- The lexicon (films/_kit/lexicon.<lang>.json, a few hand-checked words) is
  swapped into espeak-ng's phonemes of the whole sentence, which Piper then gets
  as one raw block: piper-tts 1.8 cuts a text at every [[ ]] piece and phonemizes
  each piece alone, which broke the stress and the sentence-final fall. The
  628-entry seeded lexicon (films/_kit/lexicon/seed.py) was retired on
  2026-11-09; it is in git history (c077f96) only.
- Word timing for the subtitles: Piper's phoneme alignments (the voice model
  patched in memory, pip install onnx), grouped into words and mapped to the
  spoken words by espeak-ng's reading of each prefix of the sentence. When a
  voice gives no alignments, faster-whisper's word timestamps (with the
  sentence as its prompt) are returned instead, and narrate.mjs forces them
  onto the script (narration.mjs forceAlign).
"""
import json
import re
import sys
import wave
from pathlib import Path

import numpy as np
from piper import PiperVoice, SynthesisConfig
from piper.phonemize_espeak import EspeakPhonemizer

KEEP = 0.04  # s of Piper's edge silence kept before the first and after the last sound
FLOOR = 0.01  # silence: below -40 dB of the clip's peak
FRAME = 0.02
TARGET_DB = -20.0  # speech level of a beat (dBFS, RMS of the frames with sound)
PEAK = 0.95
PUNCT = set(',.:;!?¡¿…"\'')
_ESPEAK = None


def espeak(voice, text):
    """espeak-ng's phonemes of text, as Piper makes them: one string per sentence."""
    global _ESPEAK
    if _ESPEAK is None:
        _ESPEAK = EspeakPhonemizer(voice.espeak_data_dir)
    return [''.join(s) for s in _ESPEAK.phonemize(voice.config.espeak_voice, text, vowel_clusters=voice.config.vowel_clusters)]


def word_groups(phonemes):
    """The words of a phoneme string: groups between spaces, punctuation alone left out."""
    return [g for g in phonemes.split(' ') if g and not set(g) <= PUNCT]


def sentence_phonemes(voice, text, lex):
    """What Piper gets for one sentence, and the lexicon words swapped in.

    Plain text when espeak-ng reads it as one sentence and no lexicon word is in
    it. Otherwise espeak-ng phonemizes the whole sentence, only the listed words'
    phonemes are swapped in place, and Piper gets it as one raw block
    (punctuation included, so the sentence still falls at its end).
    """
    words = [w for w in re.findall(r"\w[\w']*", text) if w.lower() in lex]
    sents = espeak(voice, text)
    if not words and len(sents) == 1:
        return text, [], []
    ph = ' '.join(s.strip() for s in sents)
    if words:
        alone = {w.lower(): espeak(voice, w)[0].strip().rstrip('.,') for w in words}
        ph, used, warn = swap_lexicon(ph, text.split(), token_groups(voice, text), lex, alone)
    else:
        used, warn = [], []
    return f'[[{ph}]]', used, warn


def swap_lexicon(ph, toks, counts, lex, alone):
    """The lexicon words' phonemes swapped into the sentence's phonemes ph, each
    at the place of its own word: toks is the text split at spaces, counts the
    phoneme words up to and including each token (token_groups), alone the
    espeak-ng form of each lexicon word read alone. A word is only looked for
    in its own phoneme words (or, glued onto the word before it, in that one),
    so "project" is never swapped into an earlier "projecten". When counts do
    not fit ph, a match must be whole phoneme words. Returns (ph, used, warn).
    """
    spans, pos = [], 0
    for g in ph.split(' '):
        if g and not set(g) <= PUNCT:
            spans.append((pos, pos + len(g)))
        pos += len(g) + 1
    fits = bool(spans) and len(counts) == len(toks) and counts[-1] == len(spans)
    if fits:  # as word_spans: no count may exceed a later one
        counts = list(counts)
        for i in range(len(counts) - 2, -1, -1):
            counts[i] = min(counts[i], counts[i + 1])
    tail = '(?=[' + re.escape(''.join(sorted(PUNCT))) + ']*(?: |$))'
    reps, used, warn, cursor = [], [], [], 0
    for i, tok in enumerate(toks):
        for w in re.findall(r"\w[\w']*", tok):
            key = w.lower()
            if key not in lex:
                continue
            a = alone[key]
            if fits:
                lo, hi = (counts[i - 1] if i else 0), counts[i]
                if hi <= lo:  # glued onto the word before it
                    lo, hi = max(lo - 1, 0), max(lo, 1)
                k = ph.find(a, max(spans[lo][0], cursor), spans[hi - 1][1])
            else:
                m = re.compile('(?:^|(?<= ))' + re.escape(a) + tail).search(ph, cursor)
                k = m.start() if m else -1
            if k < 0:
                warn.append(f'lexicon: espeak form of "{w}" ({a}) not found in the sentence; left as espeak reads it')
                continue
            reps.append((k, k + len(a), lex[key]))
            used.append(key)
            cursor = k + len(a)
    for k, e, new in reversed(reps):
        ph = ph[:k] + new + ph[e:]
    return ph, used, warn


def token_groups(voice, text):
    """Per spoken word (text split at spaces), how many phoneme words espeak-ng
    makes of the sentence up to and including it."""
    toks = text.split()
    return [len(word_groups(' '.join(espeak(voice, ' '.join(toks[:i + 1]))))) for i in range(len(toks))]


def aligned_groups(chunk):
    """Phoneme words of one Piper chunk with their sample spans, from the alignments."""
    if not chunk.phoneme_alignments:
        return None
    t, cur, out = 0, None, []
    for a in chunk.phoneme_alignments:
        p, n = a.phoneme, int(a.num_samples)
        if p in ('^', '$', '_') or p == ' ':
            cur = None
        elif p not in PUNCT:
            if cur is None:
                cur = [t, t + n]
                out.append(cur)
            else:
                cur[1] = t + n
        t += n
    return out


def word_spans(counts, groups):
    """Per spoken word, the sample span of its phoneme words: counts from
    token_groups, groups from aligned_groups (counts[-1] == len(groups)).

    A prefix can read as more phoneme words than the whole sentence: espeak-ng
    reads "... as it" as two words but glues "as it is." into one (ˌæzɪtˈɪz).
    So no count may exceed a later one; the words glued on take no time.
    """
    counts = list(counts)
    for i in range(len(counts) - 2, -1, -1):
        counts[i] = min(counts[i], counts[i + 1])
    spans, prev = [], 0
    for c in counts:
        if c > prev:
            spans.append([groups[prev][0], groups[c - 1][1]])
        else:  # espeak-ng glued this word to the one before it
            g = groups[prev - 1][1] if prev else 0
            spans.append([g, g])
        prev = c
    return spans


def edges(a, rate):
    """First and last sample to keep: the measured sound, plus KEEP either side."""
    env = np.abs(a)
    idx = np.nonzero(env > env.max() * FLOOR)[0] if len(a) else []
    if not len(idx):
        return 0, len(a)
    k = int(KEEP * rate)
    return max(0, int(idx[0]) - k), min(len(a), int(idx[-1]) + k + 1)


def beat_gain(clips, rate):
    allc = np.concatenate(clips)
    peak = float(np.abs(allc).max()) if len(allc) else 0
    if peak < 1e-6:
        return 1.0
    n = int(FRAME * rate)
    k = len(allc) // n
    rms = np.sqrt((allc[:k * n].reshape(k, n) ** 2).mean(axis=1))
    loud = rms[rms > peak * FLOOR]
    level = float(np.sqrt((loud ** 2).mean())) if len(loud) else peak
    return min(10 ** (TARGET_DB / 20) / level, PEAK / peak)


_ASR = None


def whisper_words(model, lang, a, rate, prompt):
    global _ASR
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        return None
    if _ASR is None:
        _ASR = WhisperModel(model, device='cpu', compute_type='int8')
    x = np.interp(np.arange(0, len(a) / rate, 1 / 16000), np.arange(len(a)) / rate, a).astype(np.float32)
    segs, _ = _ASR.transcribe(x, language=lang, beam_size=5, word_timestamps=True, initial_prompt=prompt, condition_on_previous_text=False)
    return [{'word': w.word, 'start': round(w.start, 3), 'end': round(w.end, 3)} for s in segs for w in (s.words or [])]


def save(path, a, rate):
    pcm = np.clip(a * 32767, -32767, 32767).astype(np.int16)
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(pcm.tobytes())


def main():
    job = json.load(sys.stdin)
    align = job.get('align', True)
    voice = PiperVoice.load(job['model'], include_alignments=align)
    rate = voice.config.sample_rate
    cfg = SynthesisConfig(length_scale=float(job['length']), normalize_audio=False)
    lex = {k.lower(): v for k, v in (job.get('lexicon') or {}).items()}
    for beat in job['beats']:
        out = Path(beat['dir'])
        out.mkdir(parents=True, exist_ok=True)
        clips, metas = [], []
        for text in beat['sentences']:
            said, used, warn = sentence_phonemes(voice, text, lex)
            chunks = list(voice.synthesize(said, cfg, include_alignments=align))
            if len(chunks) != 1:
                raise SystemExit(f'one Piper chunk expected, got {len(chunks)}: {text}')
            a = chunks[0].audio_float_array.astype(np.float32)
            s, e = edges(a, rate)
            clip = a[s:e]
            dur = len(clip) / rate
            meta = {'text': text, 'dur': round(dur, 4), 'source': 'none', 'words': None, 'heard': None, 'lexicon': used, 'warn': warn}
            groups = aligned_groups(chunks[0]) if align else None
            counts = token_groups(voice, text)
            if groups is not None and counts and counts[-1] == len(groups):
                words = [{'w': tok, 'start': round(min(max(0, (g0 - s) / rate), dur), 4), 'end': round(min(max(0, (g1 - s) / rate), dur), 4)}
                         for tok, (g0, g1) in zip(text.split(), word_spans(counts, groups))]
                meta['words'], meta['source'] = words, 'piper'
            else:
                if groups is not None:
                    meta['warn'].append(f'alignment: {len(groups)} phoneme words for {counts[-1] if counts else 0} expected')
                heard = whisper_words(job['whisper'], job.get('lang', 'nl'), clip, rate, text) if job.get('whisper') else None
                if heard:
                    meta['heard'], meta['source'] = heard, 'whisper'
            clips.append(clip)
            metas.append(meta)
        gain = beat_gain(clips, rate)
        for k, (clip, meta) in enumerate(zip(clips, metas)):
            meta['file'] = f's{k}.wav'
            save(out / meta['file'], clip * gain, rate)
        json.dump({'rate': rate, 'gain': round(gain, 4), 'sentences': metas}, open(out / 'meta.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print(json.dumps({'dir': str(out), 'sentences': len(metas), 'sources': sorted({m['source'] for m in metas})}), flush=True)


if __name__ == '__main__':
    main()

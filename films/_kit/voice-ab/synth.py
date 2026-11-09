"""Voice A/B (2026-11-09), dev tool: render one variant of plan.json to a WAV.

    python3 -I films/_kit/voice-ab/synth.py plan.json A voice.onnx 0.82 out.wav [--trim] [--lex lexicon-small.json]

Each clip is one Piper call (the same PiperVoice.synthesize the piper CLI
uses, so the sound matches the kit's). Writes out.wav and out.json with the
time span of every sentence piece, which measure.py uses to find silences
inside a sentence. --trim cuts Piper's own silence at a clip's edges (kept to
40 ms), so the laid pause is the pause heard.
"""
import json
import sys
import wave
from pathlib import Path

import numpy as np
from piper import PiperVoice, SynthesisConfig

sys.path.insert(0, str(Path(__file__).resolve().parent))
from inject import sentence_phonemes  # noqa: E402

plan_file, variant, model, length, out = sys.argv[1:6]
trim = '--trim' in sys.argv
lex = json.load(open(sys.argv[sys.argv.index('--lex') + 1], encoding='utf-8')) if '--lex' in sys.argv else {}
plan = json.load(open(plan_file, encoding='utf-8'))
clips = plan['variants'][variant]
voice = PiperVoice.load(model)
rate = voice.config.sample_rate
cfg = SynthesisConfig(length_scale=float(length))


def edges(a, keep=0.04):
    """Indexes of the first and last sample above -40 dB of the peak."""
    env = np.abs(a.astype(np.float32))
    thr = env.max() * 0.01
    idx = np.nonzero(env > thr)[0]
    if not len(idx):
        return 0, len(a)
    k = int(keep * rate)
    return max(0, idx[0] - k), min(len(a), idx[-1] + k)


track = []
pieces = []
t = 0
for c in clips:
    if 'lead' in c:
        track.append(np.zeros(int(c['lead'] * rate), np.int16))
        t += int(c['lead'] * rate)
        continue
    text = sentence_phonemes(voice, c['text'], lex) if c.get('lex') else c['text']
    chunks = [np.frombuffer(ch.audio_int16_bytes, np.int16) for ch in voice.synthesize(text, cfg)]
    gap = int(c.get('sentenceSilence', 0) * rate)
    for i, a in enumerate(chunks):
        if i > 0 and gap:
            track.append(np.zeros(gap, np.int16))
            t += gap
        if trim:
            s, e = edges(a)
            a = a[s:e]
        # a multi-sentence call (variant A): Piper's chunks are the sentences
        sid = c['sentence'] + (i if c.get('multi') else 0)
        pieces.append({'sentence': sid, 'start': t / rate, 'end': (t + len(a)) / rate, 'text': c['text'] if not c.get('multi') else None})
        track.append(a)
        t += len(a)
    sil = int(c['sil'] * rate)
    track.append(np.zeros(sil, np.int16))
    t += sil

pcm = np.concatenate(track)
with wave.open(out, 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(rate)
    w.writeframes(pcm.tobytes())
json.dump({'variant': variant, 'model': model, 'length': float(length), 'rate': rate, 'dur': len(pcm) / rate, 'pieces': pieces},
          open(out.rsplit('.', 1)[0] + '.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'{variant}: {len(pcm) / rate:.1f} s, {len(pieces)} pieces -> {out}')

"""Voice A/B (2026-11-09): how much silence Piper puts at the edges of a clip.

    python3 -I films/_kit/voice-ab/edges.py X.wav   (with X.json from synth.py, untrimmed)

timeline.mjs assumes "Piper adds no silence of its own"; this measures the
lead-in and tail of every clip (frames of 10 ms under -40 dB of the clip's peak).
"""
import json
import sys
import wave

import numpy as np

path = sys.argv[1]
with wave.open(path) as w:
    rate = w.getframerate()
    a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32)
meta = json.load(open(path.rsplit('.', 1)[0] + '.json', encoding='utf-8'))
leads, tails = [], []
for p in meta['pieces']:
    seg = np.abs(a[int(p['start'] * rate):int(p['end'] * rate)])
    n = int(0.01 * rate)
    k = len(seg) // n
    env = seg[:k * n].reshape(k, n).max(axis=1)
    loud = np.nonzero(env > env.max() * 0.01)[0]
    leads.append(loud[0] * 0.01)
    tails.append((k - 1 - loud[-1]) * 0.01)
print(f'{len(leads)} clips: lead-in mean {np.mean(leads):.2f} s (max {max(leads):.2f}), tail mean {np.mean(tails):.2f} s (max {max(tails):.2f})')

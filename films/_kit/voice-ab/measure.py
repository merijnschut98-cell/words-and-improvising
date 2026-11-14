"""Voice A/B (2026-11-09), dev tool: objective checks on rendered narration.

    python3 -I films/_kit/voice-ab/measure.py plan.json X.wav [Y.wav ...] [--model small]

Per WAV (with the X.json synth.py wrote beside it):
- dur: total length;
- speech: the time with sound (frames of 20 ms above -40 dB of the loudest);
- in-sentence silences > 0.4 s, from the waveform, inside each sentence's span
  (its first sound to its last), with the longest one;
- the mean pause at a full stop (between two sentences of one beat);
- WER: faster-whisper (local, CPU) transcript against the script, after
  lower-casing, dropping punctuation and writing numbers as the voice says them.
"""
import json
import re
import subprocess
import sys
import unicodedata
import wave

import numpy as np

args = [a for a in sys.argv[1:] if not a.startswith('--')]
model_name = sys.argv[sys.argv.index('--model') + 1] if '--model' in sys.argv else 'small'
if '--model' in sys.argv:
    args.remove(model_name)
plan = json.load(open(args[0], encoding='utf-8'))
FRAME = 0.02
GAP = 0.4


def load(path):
    with wave.open(path) as w:
        rate = w.getframerate()
        a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32)
    return a, rate


def silences(a, rate, t0, t1):
    """Runs of silent 20 ms frames between t0 and t1, as (start, length)."""
    n = int(FRAME * rate)
    seg = a[int(t0 * rate):int(t1 * rate)]
    k = len(seg) // n
    if k == 0:
        return []
    rms = np.sqrt((seg[:k * n].reshape(k, n) ** 2).mean(axis=1))
    loud = rms > REF * 0.01  # -40 dB
    out, run = [], None
    for i, s in enumerate(~loud):
        if s and run is None:
            run = i
        if not s and run is not None:
            out.append((t0 + run * FRAME, (i - run) * FRAME))
            run = None
    if run is not None:
        out.append((t0 + run * FRAME, (k - run) * FRAME))
    return out


def norm(text):
    text = unicodedata.normalize('NFC', text.lower())
    text = text.replace('cnc', 'cnc ').replace('-', ' ')
    text = re.sub(r"[^\w\s']", ' ', text)
    return text.split()


NUM = {'150': 'honderdvijftig', '300': 'driehonderd', '60': 'zestig', '220': 'tweehonderdtwintig', '188': 'honderdachtentachtig',
       '5': 'vijf', '0': 'nul', '3': 'drie', '1167': 'elfhonderdzevenenzestig', '11honderd': 'elfhonderd', '67': 'zevenenzestig',
       '1': 'een', '167': 'honderdzevenenzestig'}


def words(text):
    out = []
    for w in norm(text):
        w = NUM.get(w, w)
        out.append(w)
    # glue spoken number parts so "elfhonderd zevenenzestig" = "elfhonderdzevenenzestig"
    joined = ' '.join(out)
    joined = re.sub(r'elfhonderd zevenenzestig|duizend honderd zevenenzestig|1 167', 'elfhonderdzevenenzestig', joined)
    joined = re.sub(r'honderd achtentachtig', 'honderdachtentachtig', joined)
    joined = joined.replace('komma', ' ')
    return [w for w in joined.split() if w]


def wer(ref, hyp):
    r, h = words(ref), words(hyp)
    d = np.zeros((len(r) + 1, len(h) + 1), int)
    d[:, 0] = range(len(r) + 1)
    d[0, :] = range(len(h) + 1)
    for i in range(1, len(r) + 1):
        for j in range(1, len(h) + 1):
            d[i, j] = min(d[i - 1, j] + 1, d[i, j - 1] + 1, d[i - 1, j - 1] + (r[i - 1] != h[j - 1]))
    return d[len(r), len(h)] / len(r), len(r)


asr = None
try:
    from faster_whisper import WhisperModel
    asr = WhisperModel(model_name, device='cpu', compute_type='int8')
except Exception as e:  # no ASR: report the waveform checks only
    print('no ASR:', e)

rows = []
for path in args[1:]:
    a, rate = load(path)
    REF = np.sqrt((a ** 2).mean()) * 4  # a robust "loud speech" level
    meta = json.load(open(path.rsplit('.', 1)[0] + '.json', encoding='utf-8'))
    spans = {}
    for p in meta['pieces']:
        s = spans.setdefault(p['sentence'], [p['start'], p['end']])
        s[0], s[1] = min(s[0], p['start']), max(s[1], p['end'])
    inside = []
    for sid, (t0, t1) in sorted(spans.items()):
        sil = silences(a, rate, t0, t1)
        # ignore the clip's own lead-in and tail: only gaps between two sounds
        sil = [x for x in sil if x[0] > t0 + 0.001 and x[0] + x[1] < t1 - 0.001]
        inside += [(sid, round(s0, 2), round(ln, 2)) for s0, ln in sil if ln > GAP]
    # pauses at full stops: the silence between the end of one sentence's sound and the next's start
    order = sorted(spans.items())
    stops = []
    for (s1, (_, e1)), (s2, (b2, _)) in zip(order, order[1:]):
        mid = (e1 + b2) / 2
        sil = [x for x in silences(a, rate, e1 - 1.0, b2 + 1.5) if x[0] <= mid <= x[0] + x[1]]
        if sil:
            stops.append(sil[0][1])
    n = int(FRAME * rate)
    k = len(a) // n
    rms = np.sqrt((a[:k * n].reshape(k, n) ** 2).mean(axis=1))
    speech = float((rms > REF * 0.01).sum() * FRAME)
    row = {'file': path.rsplit('/', 1)[-1], 'dur': round(len(a) / rate, 1), 'speech': round(speech, 1),
           'in_sentence_gaps_gt_0.4': len(inside), 'longest_in_sentence': max([x[2] for x in inside], default=0),
           'gaps': inside, 'stop_pause_median': round(float(np.median(stops)), 2) if stops else None}
    if asr:
        pcm16 = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'quiet', '-i', path, '-ar', '16000', '-ac', '1', '-f', 'f32le', '-'], capture_output=True, check=True).stdout, np.float32)
        segs, _ = asr.transcribe(pcm16, language='nl', beam_size=5, condition_on_previous_text=False, vad_filter=True)
        hyp = ' '.join(s.text for s in segs)
        row['wer'], row['ref_words'] = round(wer(plan['script'], hyp)[0] * 100, 1), wer(plan['script'], hyp)[1]
        row['hyp'] = hyp.strip()
    rows.append(row)
    print(json.dumps(row, ensure_ascii=False))

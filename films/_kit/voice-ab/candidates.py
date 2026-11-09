"""Voice A/B (2026-11-09): try spellings or phonemes for one word in its sentence.

    python3 -I films/_kit/voice-ab/candidates.py voice.onnx 0.82 whisper-model word "sentence" cand1 cand2 ...

A candidate in [[...]] is phonemes (swapped into espeak-ng's reading of the
whole sentence, inject.py); otherwise it is a spelling put in place of the
word. Prints, per candidate, how many of 5 renders Whisper hears as the word.
"""
import subprocess
import sys
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel
from piper import PiperVoice, SynthesisConfig

sys.path.insert(0, str(Path(__file__).resolve().parent))
from inject import sentence_phonemes  # noqa: E402

model, length, wmodel, word, sentence, *cands = sys.argv[1:]
voice = PiperVoice.load(model)
cfg = SynthesisConfig(length_scale=float(length))
asr = WhisperModel(wmodel, device='cpu', compute_type='int8')


def heard(pcm):
    raw = subprocess.run(['ffmpeg', '-v', 'quiet', '-f', 's16le', '-ar', str(voice.config.sample_rate), '-ac', '1', '-i', '-',
                          '-ar', '16000', '-f', 'f32le', '-'], input=pcm.tobytes(), capture_output=True, check=True).stdout
    segs, _ = asr.transcribe(np.frombuffer(raw, np.float32), language='nl', beam_size=5, vad_filter=True)
    return ' '.join(s.text for s in segs).strip()


for c in ['(espeak)'] + cands:
    if c == '(espeak)':
        text = sentence
    elif c.startswith('[['):
        text = sentence_phonemes(voice, sentence, {word: c[2:-2]})
    else:
        text = sentence.replace(word, c)
    hits, last = 0, ''
    for _ in range(5):
        pcm = np.concatenate([np.frombuffer(ch.audio_int16_bytes, np.int16) for ch in voice.synthesize(text, cfg)])
        last = heard(pcm)
        hits += word in last.lower().replace(' ', '')
    print(f'{c:24} {hits}/5  e.g. {last}', flush=True)

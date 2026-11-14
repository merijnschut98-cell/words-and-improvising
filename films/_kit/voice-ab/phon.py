"""Voice A/B (2026-11-09): print the phonemes Piper builds for each input line.

    python3 -I films/_kit/voice-ab/phon.py <voice.onnx> < lines.txt

Shows how piper-tts 1.8 cuts a line with [[raw phonemes]] into pieces that
espeak-ng phonemizes one by one.
"""
import sys

from piper import PiperVoice

voice = PiperVoice.load(sys.argv[1])
for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    print('IN :', line)
    for sentence in voice.phonemize(line):
        print('    ', ''.join(sentence))

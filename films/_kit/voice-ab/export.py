"""Voice A/B (2026-11-09): copy the listening samples (render 1) to MP3.

    python3 -I films/_kit/voice-ab/export.py <work/rep dir> <words dir> <out dir>
"""
import subprocess
import sys
from pathlib import Path

rep, words, out = (Path(a) for a in sys.argv[1:4])
out.mkdir(parents=True, exist_ok=True)
NAMES = {
    'A-1': 'A-oud-pilot', 'B-1': 'B-zinnen-zonder-lexicon', 'C-1': 'C-zinnen-klein-lexicon', 'D-1': 'D-huidige-kit',
    'E-alex-1': 'E1-zoals-C-stem-alex', 'E-pim-1': 'E2-zoals-C-stem-pim',
}
files = [(rep / f'{k}.wav', out / f'{v}.mp3') for k, v in NAMES.items()]
files.append((words / 'woordtest.wav', out / 'woordtest-los-zonder-en-met-lexicon.mp3'))
for src, dst in files:
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-codec:a', 'libmp3lame', '-q:a', '3', str(dst)], check=True)
    print(dst)

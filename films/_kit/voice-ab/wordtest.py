"""Voice A/B (2026-11-09): does a lexicon entry help? Each hard word of the
test paragraph, alone and in its sentence, without and with its entry.

    python3 -I films/_kit/voice-ab/wordtest.py voice.onnx 0.82 outdir [--model small]

Per word: espeak-ng's own phonemes, the lexicon's, and for 3 renders of each
form whether faster-whisper hears the word. Writes outdir/<word>-<form>.wav and
outdir/woordtest.wav (each word: without, then with its entry, alone).
"""
import json
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np
from piper import PiperVoice, SynthesisConfig

sys.path.insert(0, str(Path(__file__).resolve().parent))
from inject import _espeak, sentence_phonemes  # noqa: E402

model, length, out = sys.argv[1:4]
out = Path(out)
out.mkdir(parents=True, exist_ok=True)
LEX = json.load(open(Path(__file__).resolve().parent.parent / 'lexicon.nl.json', encoding='utf-8'))
if '--lex' in sys.argv:  # entries to try instead of the kit's (a fix, say)
    LEX.update(json.load(open(sys.argv[sys.argv.index('--lex') + 1], encoding='utf-8')))
TESTS = {
    'klauwplaat': 'De klauwplaat laat een stalen as draaien, de beitel staat stil.',
    'wisselplaat': 'Hij snijdt met een kleine wisselplaat van heel hard hardmetaal.',
    'hardmetaal': "Hardmetaal in staal draait zo'n 150 tot 300 meter per minuut.",
    'snijsnelheid': 'De snijsnelheid is hoe snel het materiaal langs de snijkant schuift, in meter per minuut.',
    'snijkant': 'De snijsnelheid is hoe snel het materiaal langs de snijkant schuift, in meter per minuut.',
    'minuut': 'Maar de spil draait in omwentelingen per minuut.',
    'omwentelingen': 'Maar de spil draait in omwentelingen per minuut.',
    'toerental': 'Dat toerental hangt af van de diameter.',
    'millimeter': "Een as van 60 millimeter heeft een omtrek van zo'n 188,5 millimeter.",
    'terwijl': 'Terwijl de as draait, schuift de beitel erlangs.',
    'omwenteling': 'De voeding is hoe ver hij per omwenteling opschuift: hier 0,3 millimeter.',
    # bolting film (2026-11-09 re-render): espeak-ng reads newton as "nɛʋtˈɔn"
    'newton': 'Tweehonderd newton op een sleutel van vijfentwintig centimeter lang.',
    'newtonmeter': 'Het ligt normaal dicht bij het ingestelde moment, hier vijftig newtonmeter.',
    'kilonewton': 'Rond zevenendertig kilonewton gaat hij vloeien.',
    'kilonewtons': 'Bij twee kilonewtons trekt de lijm los.',
    # hydraulics and maintenance films (2026-11-11): espeak-ng stresses oLIE, CIlinder (sˈilɪndər) and
    # MAnometer (mˈaːnoːmˌeːtər); right is Ó-lie, ci-LIN-der, ma-no-MÉ-ter
    'olie': 'Schoonmaken is inspecteren: onder het vuil lekt de pomp olie.',
    'cilinder': 'De olie duwt de zuiger van de cilinder naar buiten.',
    'cilinders': 'De pomp voedt twee cilinders tegelijk.',
    'manometer': 'Lees de druk af op de manometer, in bar.',
    'manometers': 'De twee manometers wijzen hetzelfde aan.',
    # compressed-air film (2026-11-12): espeak-ng stresses KOMpressor (kˈɔmprɛsˌɔr); right is com-PRES-sor.
    # compressoren it already reads right (kˌɔmprɛsˈoːrən), so it has no entry
    'compressor': 'Het begint bij de compressor: een motor drijft hem aan.',
}
TESTS = {w: t for w, t in TESTS.items() if w in LEX}  # the kit's lexicon is small now: try others with --lex
if '--only' in sys.argv:
    TESTS = {w: TESTS[w] for w in sys.argv[sys.argv.index('--only') + 1].split(',')}
voice = PiperVoice.load(model)
cfg = SynthesisConfig(length_scale=float(length))
rate = voice.config.sample_rate


def synth(text):
    return np.concatenate([np.frombuffer(c.audio_int16_bytes, np.int16) for c in voice.synthesize(text, cfg)])


def save(path, pcm):
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(pcm.tobytes())


from faster_whisper import WhisperModel  # noqa: E402
asr = WhisperModel(sys.argv[sys.argv.index('--model') + 1] if '--model' in sys.argv else 'small', device='cpu', compute_type='int8')


def heard(path):
    pcm = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'quiet', '-i', str(path), '-ar', '16000', '-ac', '1', '-f', 'f32le', '-'],
                                       capture_output=True, check=True).stdout, np.float32)
    segs, _ = asr.transcribe(pcm, language='nl', beam_size=5, vad_filter=True)
    return ' '.join(s.text for s in segs).strip()


sheet = []
gap = np.zeros(int(0.7 * rate), np.int16)
for word, sentence in TESTS.items():
    lex1 = {word: LEX[word]}
    forms = {
        'alone-espeak': word + '.',
        'alone-lexicon': f'[[{LEX[word]}.]]',
        'sentence-espeak': sentence,
        'sentence-lexicon-kit': ' '.join(f'[[{LEX[word]}]]' if t.strip('.,:').lower() == word else t for t in sentence.split()),
        'sentence-lexicon-whole': sentence_phonemes(voice, sentence, lex1),
    }
    res = {'word': word, 'espeak': _espeak(voice, word)[0].strip('. '), 'lexicon': LEX[word]}
    for name, text in forms.items():
        hits = []
        for k in range(3):
            pcm = synth(text)
            f = out / f'{word}-{name}-{k}.wav'
            save(f, pcm)
            h = heard(f)
            hits.append(word in h.lower().replace(' ', '').replace('-', ''))
            if k == 0:
                res[name + '_heard'] = h
                if name.startswith('alone'):
                    sheet += [pcm, gap]
        res[name] = f'{sum(hits)}/3'
    sheet.append(gap)
    print(json.dumps(res, ensure_ascii=False), flush=True)
save(out / 'woordtest.wav', np.concatenate(sheet))

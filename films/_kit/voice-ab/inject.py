"""Voice A/B (2026-11-09): lexicon injection that keeps the sentence whole.

piper-tts 1.8 cuts a line at every [[raw phonemes]] block and lets espeak-ng
phonemize each piece of text on its own: a piece is read as if it were a whole
utterance (a lone "in" gets a stress), and a sentence that ends on an injected
word loses its full stop (Piper's cue for the falling end). Instead, this
phonemizes the whole sentence with espeak-ng, swaps only the listed words'
phonemes in place, and hands Piper the sentence as one raw block, punctuation
included.

    sentence_phonemes(voice, text, lex) -> '[[ ... ]]' or the text itself
"""
import re

from piper.phonemize_espeak import EspeakPhonemizer

_PH = None


def _espeak(voice, text):
    global _PH
    if _PH is None:
        _PH = EspeakPhonemizer(voice.espeak_data_dir)
    return [''.join(s) for s in _PH.phonemize(voice.config.espeak_voice, text)]


def sentence_phonemes(voice, text, lex):
    words = [w for w in re.findall(r"\w[\w']*", text) if w.lower() in lex]
    if not words:
        return text
    sents = _espeak(voice, text)
    if len(sents) != 1:
        raise ValueError(f'one sentence expected: {text}')
    ph = sents[0]
    for w in words:
        alone = _espeak(voice, w)[0].strip()
        if alone not in ph:
            raise ValueError(f'{w}: espeak form {alone} not found in {ph}')
        ph = ph.replace(alone, lex[w.lower()], 1)
    return f'[[{ph}]]'

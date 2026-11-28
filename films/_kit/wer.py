#!/usr/bin/env python3
"""Dev tool, not shipped. Word error rate of a narration track against its script.

    python3 -I films/_kit/wer.py <audio> <reference.txt> <nl|en> <whisper model> [said.txt]

faster-whisper (local, CPU) transcribes the audio; both texts are lower-cased,
stripped of punctuation, numbers written out as words (and number words glued
together, so "1167", "elfhonderd zevenenzestig" and "11honderd 67" agree).
With said.txt (the script before the SAY rules, line for line), a word a SAY
rule respelled for the voice counts as heard when Whisper writes the real word.
Prints one JSON line: {"wer": 0.08, "ref_words": 512, "hyp": "..."}.
Used by films/_kit/listen-guard.mjs.
"""
import difflib
import json
import re
import subprocess
import sys
import unicodedata

import numpy as np

NL_UNITS = ['nul', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'elf', 'twaalf', 'dertien',
            'veertien', 'vijftien', 'zestien', 'zeventien', 'achttien', 'negentien']
NL_TENS = ['', '', 'twintig', 'dertig', 'veertig', 'vijftig', 'zestig', 'zeventig', 'tachtig', 'negentig']
EN_UNITS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen',
            'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
EN_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']


def nl_num(n):
    if n < 20:
        return NL_UNITS[n]
    if n < 100:
        t, u = divmod(n, 10)
        return NL_TENS[t] if u == 0 else NL_UNITS[u] + ('ën' if NL_UNITS[u].endswith('e') else 'en') + NL_TENS[t]
    if n < 1000:
        h, r = divmod(n, 100)
        return ('' if h == 1 else NL_UNITS[h]) + 'honderd' + (nl_num(r) if r else '')
    if 1100 <= n < 10000 and (n // 100) % 10:  # 1167: elfhonderdzevenenzestig
        h, r = divmod(n, 100)
        return nl_num(h) + 'honderd' + (nl_num(r) if r else '')
    if n < 1000000:
        k, r = divmod(n, 1000)
        return ('' if k == 1 else nl_num(k)) + 'duizend' + (nl_num(r) if r else '')
    m, r = divmod(n, 1000000)
    return nl_num(m) + 'miljoen' + (nl_num(r) if r else '')


def en_num(n):
    if n < 20:
        return EN_UNITS[n]
    if n < 100:
        t, u = divmod(n, 10)
        return EN_TENS[t] + (EN_UNITS[u] if u else '')
    if n < 1000:
        h, r = divmod(n, 100)
        return EN_UNITS[h] + 'hundred' + (en_num(r) if r else '')
    if n < 1000000:
        k, r = divmod(n, 1000)
        return en_num(k) + 'thousand' + (en_num(r) if r else '')
    m, r = divmod(n, 1000000)
    return en_num(m) + 'million' + (en_num(r) if r else '')


def words(text, lang):
    num = nl_num if lang == 'nl' else en_num
    point = 'komma' if lang == 'nl' else 'point'
    t = unicodedata.normalize('NFC', text.lower()).replace('’', "'")
    if lang == 'nl':
        t = re.sub(r'(\d)\.(\d{3})\b', r'\1\2', t)  # 1.167
        t = re.sub(r'(\d),(\d)', rf'\1 {point} \2', t)
    else:
        t = re.sub(r'(\d),(\d{3})\b', r'\1\2', t)
        t = re.sub(r'(\d)\.(\d)', rf'\1 {point} \2', t)
    t = re.sub(r'(\d)([^\W\d_])', r'\1 \2', t)  # 11honderd -> 11 honderd
    t = re.sub(r'\d+', lambda m: ' ' + num(int(m.group())) + ' ', t)
    t = t.replace('-', ' ')
    t = re.sub(r"[^\w\s']", ' ', t)
    out = []
    numeric = re.compile(r'^(' + '|'.join(sorted(set(NL_UNITS + NL_TENS[2:] + EN_UNITS + EN_TENS[2:] + ['honderd', 'duizend', 'hundred', 'thousand', 'and', 'en']), key=len, reverse=True)) + r')+$')
    for w in t.split():
        # glue number words: "elfhonderd zevenenzestig" = "elfhonderdzevenenzestig"
        if out and numeric.match(w) and numeric.match(out[-1]) and w not in ('en', 'and', 'een', 'one') and out[-1] not in ('en', 'and', 'een', 'one'):
            out[-1] += w
        else:
            out.append(w)
    return [UNITS.get(w, w) for w in out]


# units Whisper writes as symbols where the voice said the word
UNITS = {'mm': 'millimeter', 'cm': 'centimeter', 'µm': 'micrometer', 'um': 'micrometer'}


def glue(a, b):
    """Spacing is no word error: two words of a whose concatenation is a word of
    b become one ("snij snelheid" = "snijsnelheid", "middengaat" = "midden gaat")."""
    other = set(b)
    out = []
    for w in a:
        if out and out[-1] + w in other and out[-1] not in ('', ) and (out[-1] not in other or w not in other):
            out[-1] += w
        else:
            out.append(w)
    return out


def score(ref, hyp, lang, said=None):
    """WER of hyp against ref (texts), and the reference's word count.

    said: the same script before the SAY rules (one line per line of ref), the
    words a listener should hear. Where a SAY rule respelled a word for the voice
    ("Prodduct Ooner"), Whisper writing the real word ("product owner") is no
    error, and neither is the respelling as written: the errors are the fewest
    over both readings, line by line (never more than without said). The word
    count stays that of ref, and a script without respellings scores exactly as
    without said."""
    rw, hw = words(ref, lang), words(hyp, lang)
    hw = glue(hw, rw)
    rw = glue(rw, hw)
    if said is None or said == ref:
        return wer(rw, hw), len(words(ref, lang))
    errors = min(round(wer(rw, hw) * max(1, len(rw))), either_errors(ref, said, hyp, lang))
    return errors / max(1, len(rw)), len(words(ref, lang))


def either_errors(ref, said, hyp, lang):
    """Edit distance of hyp against the script where each stretch a SAY rule
    changed may be read either way (the said or the spoken words)."""
    lines, said_lines = ref.split('\n'), said.split('\n')
    if len(lines) != len(said_lines):
        raise ValueError(f'said text has {len(said_lines)} lines, the reference {len(lines)}')
    every = [w for t in (ref, said) for w in words(t, lang)]
    hw = glue(words(hyp, lang), every)
    segs = []  # each: the readings of one stretch, as word lists
    for sp, sa in zip(lines, said_lines):
        a, b = glue(words(sa, lang), hw), glue(words(sp, lang), hw)
        for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
            if op == 'equal':
                segs.extend([[w]] for w in a[i1:i2])
            else:
                segs.append([a[i1:i2], b[j1:j2]])
    row = list(range(len(hw) + 1))
    for readings in segs:
        best = None
        for reading in readings:
            r = row
            for w in reading:
                nxt = [r[0] + 1]
                for j, h in enumerate(hw, 1):
                    nxt.append(min(r[j] + 1, nxt[j - 1] + 1, r[j - 1] + (w != h)))
                r = nxt
            best = r if best is None else [min(x, y) for x, y in zip(best, r)]
        row = best
    return row[-1]


def wer(ref, hyp):
    r, h = ref, hyp
    d = np.zeros((len(r) + 1, len(h) + 1), int)
    d[:, 0] = range(len(r) + 1)
    d[0, :] = range(len(h) + 1)
    for i in range(1, len(r) + 1):
        for j in range(1, len(h) + 1):
            d[i, j] = min(d[i - 1, j] + 1, d[i, j - 1] + 1, d[i - 1, j - 1] + (r[i - 1] != h[j - 1]))
    return d[len(r), len(h)] / max(1, len(r))


def main():
    audio, ref_file, lang, model = sys.argv[1:5]
    said_file = sys.argv[5] if len(sys.argv) > 5 else None
    from faster_whisper import WhisperModel
    asr = WhisperModel(model, device='cpu', compute_type='int8')
    pcm = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'quiet', '-i', audio, '-ar', '16000', '-ac', '1', '-f', 'f32le', '-'],
                                       capture_output=True, check=True).stdout, np.float32)
    segs, _ = asr.transcribe(pcm, language=lang, beam_size=5, condition_on_previous_text=False, vad_filter=True)
    hyp = ' '.join(s.text for s in segs).strip()
    ref = open(ref_file, encoding='utf-8').read()
    said = open(said_file, encoding='utf-8').read() if said_file else None
    w, n = score(ref, hyp, lang, said)
    print(json.dumps({'wer': round(float(w), 4), 'ref_words': n, 'hyp': hyp}, ensure_ascii=False))


if __name__ == '__main__':
    main()

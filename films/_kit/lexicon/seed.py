#!/usr/bin/env python3
"""Dev tool, not shipped. Seeds the pronunciation lexicon films/_kit/lexicon.<lang>.json.

    node films/_kit/lexicon/corpus.mjs nl > /tmp/words.nl.tsv
    python3 -I films/_kit/lexicon/seed.py nl /tmp/words.nl.tsv [--review out.tsv]

Piper reads text through espeak-ng, which often puts the stress of a Dutch
compound on its last part (klauwplˈaat) and sometimes cuts it into the wrong
syllables (toerental as tˈur-ˌɛn-tɑl). A compound takes its stress on its
first part (KLAUWplaat, TOERental, OMwenteling).

For every word of the corpus this finds a split into a first part and a head,
both words of the corpus (or of HEADS below), with an optional linking s, e or
en. The new form is espeak-ng's own phonemes of the first part, with its main
stress, followed by those of the head with its stress lowered to a secondary
one. A word goes into the lexicon only when espeak-ng would stress another
syllable. SPLITS forces a split, KEEP leaves a word to espeak-ng.

The lexicon maps a word (lower case) to espeak-ng phonemes (IPA); narrate.mjs
hands them to Piper as [[ ... ]] in the spoken text only.
"""
import json
import re
import sys
from pathlib import Path

from piper.phonemize_espeak import EspeakPhonemizer

HERE = Path(__file__).resolve().parent
VOICE = {'nl': 'nl', 'en': 'en-gb-x-rp'}

# unstressed prefixes: a word starting with one is no compound of it (verSPAnen)
PREFIX = {
    'nl': {'be', 'ge', 'ver', 'ont', 'her', 'er', 'te', 'mis'},
    'en': {'re', 'de', 'un', 'pre', 'dis', 'mis', 'non', 'over', 'under', 'out'},
}
# heads that are words but rare as words of their own in the corpus
HEADS = {
    'nl': {'tal', 'plaat', 'kop', 'bank', 'baan', 'tijd', 'diepte', 'snelheid', 'breker', 'vlak', 'gat', 'boor', 'frees',
           'machine', 'centrum', 'radius', 'hoek', 'lengte', 'maat', 'stuk', 'werk', 'punt', 'as', 'kant', 'zitting', 'naad',
           'draad', 'druk', 'vorm', 'matrijs', 'schroef', 'cyclus', 'kosten', 'lijn', 'band', 'stap', 'wenteling', 'voer',
           'afvoer', 'toevoer', 'slede', 'houder', 'beitel', 'klem', 'tafel', 'spil', 'kast', 'motor', 'pen', 'gang'},
    'en': set(),
}
# forced splits ("first+head") and words left to espeak-ng
SPLITS = {
    'nl': {'toerental': 'toeren+tal', 'toerentallen': 'toeren+tallen', 'omwenteling': 'om+wenteling', 'omwentelingen': 'om+wentelingen',
           'spaanafvoer': 'spaan+afvoer', 'klauwplaat': 'klauw+plaat', 'wisselplaat': 'wissel+plaat', 'wisselplaten': 'wissel+platen',
           'datasheet': 'data+sheet', 'kanonboor': 'kanon+boor', 'kanonboren': 'kanon+boren', 'schachtfrees': 'schacht+frees',
           'schachtfrezen': 'schacht+frezen', 'kogelkopfrees': 'kogel+kopfrees', 'vijfassig': 'vijf+assig', 'vijfassige': 'vijf+assige',
           'vingerfrees': 'vinger+frees', 'vingerfrezen': 'vinger+frezen', 'kanteltafel': 'kantel+tafel'},
    'en': {'overhang': 'over+hang'},  # the noun: the OVERhang of a shaft
}
KEEP = {
    # reviewed by hand: not compounds, or compounds whose stress is not on the
    # first part (adverbs, adjectives, inseparable verbs, numbers)
    'nl': {'achteraan', 'bestaan', 'hebben', 'gekeken', 'harderij', 'spuiterij', 'remedie', 'remedies', 'halveer', 'halveert',
           'halveren', 'isoleert', 'isoleren', 'blokkeert', 'blokkeren', 'modelleert', 'allemaal', 'helemaal', 'eenvoudige',
           'meervoudige', 'eenmaal', 'evenveel', 'hoeveel', 'hoeveelheden', 'meteen', 'tenzij', 'termijn', 'vanochtend', 'vanuit',
           'vanzelf', 'zichzelf', 'tussendoor', 'dichtbij', 'dichterbij', 'eromheen', 'doorheen', 'overheen', 'doordat', 'doorboren',
           'voldoet', 'volstaat', 'volautomatisch', 'volelektrische', 'halfautomatisch', 'halfautomatische', 'overbelast',
           'overbelasting', 'overbruggen', 'overbruggingssleutel', 'oververhit', 'overvol', 'overhead', 'middelgroot', 'tekortschiet',
           'langslopen', 'productspecifieke', 'procesgerichte', 'scheurgevoelige', 'warmtegevoelige', 'momentgestuurde',
           'veiligheidskritisch', 'staalveilig', 'vrijwel', 'bekend'},
    'en': set(),
}
# words that are no compounds but that espeak-ng stresses wrong: phonemes by hand
MANUAL = {
    'nl': {'kotteren': 'kˈɔtərən', 'kottert': 'kˈɔtərt', 'kotterbaar': 'kˈɔtərbaːr'},
    'en': {},
}
# first parts that make adverbs or particles (daarmee, waardoor, hiermee)
NOT_FIRST = {'nl': {'daar', 'waar', 'hier', 'hoe', 'met', 'een', 'van', 'ten', 'ter', 'zich', 'erom', 'alle', 'hele'}, 'en': set()}
# heads that make adverbs, numbers or verb forms rather than compounds
NOT_HEAD = {'nl': {'heen', 'mee', 'voor', 'bij', 'boven', 'uit', 'zelf', 'veel', 'maal', 'dat', 'die', 'dies', 'eraan', 'erbij',
                   'tien', 'twintig', 'veertig', 'tegen', 'vandaan', 'omheen', 'door', 'heet'},
            'en': set()}
# the compound search is for Dutch; English one-word compounds already take
# their stress on the first part in espeak-ng, so English has only SPLITS
SEARCH = {'nl': True, 'en': False}

VOWELS = set('aeiouyɑɛɪɔʊəɵœøʏʌɐæɒɜɞɘɤɯʉɨ')
ph = EspeakPhonemizer()


def phon(lang, text):
    return ''.join(''.join(s) for s in ph.phonemize(VOICE[lang], text)).strip()


def stressed_syllable(ipa):
    """The index of the vowel group that carries the main stress, or -1."""
    n = -1
    prev_vowel = False
    mark = False
    for ch in ipa:
        if ch == 'ˈ':
            mark = True
            continue
        if ch in VOWELS:
            if not prev_vowel:
                n += 1
                if mark:
                    return n
            prev_vowel = True
        elif ch != 'ː' and not ('̀' <= ch <= 'ͯ'):
            prev_vowel = False
    return -1


def first(ipa):
    """Keep the main stress, drop secondary ones; stress the start if it has none."""
    ipa = ipa.replace('ˌ', '')
    return ipa if 'ˈ' in ipa else 'ˈ' + ipa


def head(ipa):
    """The head's main stress becomes a secondary one."""
    return ipa.replace('ˌ', '').replace('ˈ', 'ˌ')


def split_of(lang, word, known):
    if word in SPLITS[lang]:
        a, b = SPLITS[lang][word].split('+')
        return a, b
    if not SEARCH[lang]:
        return None
    best = None
    for i in range(3, len(word) - 2):
        b = word[i:]
        if (b not in known and b not in HEADS[lang]) or b in NOT_HEAD[lang]:
            continue
        for link in ('', 's', 'e', 'en'):
            if link and not word[:i].endswith(link):
                continue
            a = word[:i - len(link)] if link else word[:i]
            if len(a) < 3 or a in PREFIX[lang] or a in NOT_FIRST[lang] or a not in known:
                continue
            if best is None or len(b) > len(best[1]):
                best = (word[:i], b)
    return best


def main():
    lang = sys.argv[1]
    words = {}
    for line in Path(sys.argv[2]).read_text(encoding='utf-8').splitlines():
        w, n = line.split('\t')
        words[w] = int(n)
    known = {w for w in words if len(w) >= 3 and '-' not in w}
    review = []
    lex = {}
    for w in sorted(words):
        if (len(w) < 6 and w not in SPLITS[lang]) or '-' in w or "'" in w or '’' in w or w in KEEP[lang]:
            continue
        sp = split_of(lang, w, known)
        if not sp:
            continue
        a, b = sp
        old = phon(lang, w)
        new = first(phon(lang, a)) + head(phon(lang, b))
        if stressed_syllable(old) == stressed_syllable(new) and w not in SPLITS[lang]:
            continue
        lex[w] = new
        review.append(f'{w}\t{a}+{b}\t{old}\t{new}')
    for w, ipa in MANUAL[lang].items():
        lex[w] = ipa
        review.append(f'{w}\t(manual)\t{phon(lang, w)}\t{ipa}')
    out = HERE.parent / f'lexicon.{lang}.json'
    out.write_text(json.dumps(dict(sorted(lex.items())), ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    if '--review' in sys.argv:
        Path(sys.argv[sys.argv.index('--review') + 1]).write_text('\n'.join(review) + '\n', encoding='utf-8')
    print(f'{out}: {len(lex)} words')


if __name__ == '__main__':
    main()

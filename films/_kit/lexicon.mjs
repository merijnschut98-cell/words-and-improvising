// The pronunciation lexicon (films/_kit/lexicon.<lang>.json): a word, in lower
// case, mapped to the espeak-ng phonemes (IPA, with stress marks) Piper should
// say. Seeded by films/_kit/lexicon/seed.py, mostly Dutch compounds that
// espeak-ng stresses on the wrong part (klauwplˈaat for KLAUWplaat).
//
// Applied by films/_kit/narrate.mjs to the text the voice gets, never to the
// subtitles or the "Lees mee" script: a known word becomes a raw phoneme block
// [[ ... ]], which piper-tts (1.8) passes to the voice as it is. Pure: no
// imports, so tests import it as it is.

const WORD = /\p{L}[\p{L}'’]*/gu;

// text: what the voice says; lex: { word: phonemes }. Whole words only, any
// case; hyphenated parts (CNC-draaibank) are words of their own.
export function applyLexicon(text, lex) {
  if (!lex) return String(text);
  return String(text).replace(WORD, (w) => {
    const ipa = Object.prototype.hasOwnProperty.call(lex, w.toLowerCase()) ? lex[w.toLowerCase()] : null;
    return ipa ? `[[${ipa}]]` : w;
  });
}

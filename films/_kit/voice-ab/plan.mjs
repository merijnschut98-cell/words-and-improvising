// Voice A/B (2026-11-09), dev tool, not shipped. Writes the synthesis plan of
// each variant of the fixed Dutch test paragraph (eng.machining.turning, scene
// 1, scene 2 and the first line of scene 3) as JSON on stdout:
//
//   node films/_kit/voice-ab/plan.mjs > plan.json
//
// A plan is a list of clips, each one Piper call, with the silence laid after
// it and the sentence it belongs to. synth.py renders a plan to a WAV.
//
// A  the pilot pipeline (61b0590): one Piper call per beat, Piper's own
//    sentence split with --sentence-silence 0.15, no lexicon, AUDIO_GAPS of
//    that commit (0.35 s between beats).
// B  one Piper call per sentence, no lexicon, 0.6 s after a full stop, 0.9 s
//    between beats, no warp.
// C  as B, with only the tested entries of lexicon-small.json (synth.py --lex).
// D  the kit of c369342 to c077f96: one call per phrase (narration.mjs
//    phrasesOf), the whole seeded lexicon cut in as [[ ]] pieces, its pauses
//    (comma 0.2, sentence 0.55, beat 0.9), --sentence-silence 0. That kit was
//    replaced on 2026-11-09 (sentence clips, films/_kit/speak.py); D is kept
//    as it was. Its lexicon is in history only (films/_kit/lexicon.nl.json at
//    c077f96): pass that file as OLD_LEXICON=<file>, else D is left out.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFilmData } from '../assert.mjs';
import { phrasesOf } from '../narration.mjs';
import { AUDIO_GAPS, sayable, saidOf } from '../timeline.mjs';

const KIT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = join(KIT, '../..');
const data = readFilmData(readFileSync(join(ROOT, 'src/content/courses/films/eng.machining.turning.html'), 'utf8'));
// the test paragraph: scene 1 (2 beats), scene 2 (2 beats), scene 3 beat 1
const scenes = [data.scenes[0].beats, data.scenes[1].beats, [data.scenes[2].beats[0]]];
const lexFull = process.env.OLD_LEXICON && existsSync(process.env.OLD_LEXICON) ? JSON.parse(readFileSync(process.env.OLD_LEXICON, 'utf8')) : null;
// the old kit's pauses and its [[ ]] lexicon pieces (lexicon.mjs at c077f96)
const PAUSES = { comma: 0.2, sentence: 0.55, beat: 0.9 };
const spokenOf = (text, lang, lex) => sayable(text, lang).replace(/\s+/g, ' ').trim()
  .replace(/\p{L}[\p{L}'’]*/gu, (w) => (Object.prototype.hasOwnProperty.call(lex, w.toLowerCase()) ? `[[${lex[w.toLowerCase()]}]]` : w));

const PILOT_GAPS = { lead: 0.8, look: 0.4, gap: 0.35, hold: 0.8, tail: 1.6 }; // timeline.mjs at 61b0590
const sentencesOf = (text) => text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
const beatText = (b) => sayable(saidOf(b.say.nl), 'nl').replace(/\s+/g, ' ').trim();

// clips: { text, sil: silence after (s), sentence: running id, sentenceSilence?: Piper's own }
function plan(perBeat, gaps) {
  const clips = [];
  let sid = 0;
  scenes.forEach((beats, si) => {
    clips.push({ lead: si === 0 ? gaps.lead : gaps.look });
    beats.forEach((b, bi) => {
      const items = perBeat(b);
      items.forEach((it, k) => {
        const last = k + 1 === items.length;
        clips.push({ ...it, sentence: sid + it.s, sil: last ? (bi + 1 < beats.length ? gaps.gap : si + 1 < scenes.length ? gaps.hold : gaps.tail) : it.sil });
      });
      sid += Math.max(...items.map((it) => it.s + (it.span || 1) - 1)) + 1;
    });
  });
  return clips;
}

const variants = {
  A: plan((b) => [{ text: beatText(b), s: 0, span: sentencesOf(beatText(b)).length, sentenceSilence: 0.15, multi: true }], PILOT_GAPS),
  B: plan((b) => sentencesOf(beatText(b)).map((t, k) => ({ text: t, s: k, sil: 0.6 })), { ...AUDIO_GAPS, gap: 0.9 }),
  // C's few entries are swapped into espeak-ng's reading of the whole sentence by
  // synth.py --lex (inject.py), not cut in as [[ ]] pieces like the kit's
  C: plan((b) => sentencesOf(beatText(b)).map((t, k) => ({ text: t, s: k, sil: 0.6, lex: true })), { ...AUDIO_GAPS, gap: 0.9 }),
  // D: the kit's own phrases and [[ ]] pieces (narration.mjs spokenOf, lexicon.mjs)
  D: lexFull && plan((b) => {
    const out = [];
    phrasesOf(b.say.nl).forEach((ph, k) => ph.forEach((said, j) => {
      out.push({ text: spokenOf(said, 'nl', lexFull), s: k, sil: j + 1 < ph.length ? PAUSES.comma : PAUSES.sentence });
    }));
    return out;
  }, { ...AUDIO_GAPS, gap: PAUSES.beat, hold: 0.8 }),
};
if (!variants.D) delete variants.D;
// the script the listener should hear, for the word error rate
const script = scenes.flat().map(beatText).join(' ');
console.log(JSON.stringify({ script, variants }, null, 1));

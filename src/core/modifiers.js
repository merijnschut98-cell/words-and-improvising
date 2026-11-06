// Modifiers: varied practice conditions ("harder on purpose"). Varying the
// conditions costs a little in the moment and builds transfer. Pure.
import { tokenize } from './metrics.js';
import { CUED_DRILLS } from './progress.js';

// One word budget makes no sense across several short items or spoken cues.
const NO_BUDGET = ['rapid', ...CUED_DRILLS];

export const MODIFIERS = ['cold', 'whisper', 'slow', 'noI', 'standing', 'eyesClosed', 'endQuestion', 'budget'];

// Word budget: answer first, then stop. Tighter at higher drill levels.
export const wordBudget = (level) => ((level || 1) >= 5 ? 30 : (level || 1) >= 3 ? 45 : 60);
const CHANCE = 0.25;

export function pickModifier(rng, level, force = false, drill = null) {
  if (!force && (level < 2 || rng() >= CHANCE)) return null;
  const pool = MODIFIERS.filter((m) => !(m === 'budget' && NO_BUDGET.includes(drill)));
  return pool[Math.floor(rng() * pool.length)];
}

export function applyModifierTiming(timing, id) {
  return id === 'cold' ? { ...timing, prepS: 0 } : timing;
}

const FIRST_PERSON = {
  en: ['i', "i'm", 'me', 'my', 'mine', 'myself'],
  nl: ['ik', 'me', 'mij', 'mijn', 'mezelf', 'mijzelf'],
};

// Can we tell from the transcript whether the condition was met?
export function modifierCheck(id, metrics, transcript, lang, level = 1) {
  if (id === 'budget') {
    // Same word count as the metrics (tokenize); within the cap and at least 60 % of it.
    const n = tokenize(transcript).length;
    const cap = wordBudget(level);
    return { checked: true, ok: n <= cap && n >= Math.ceil(cap * 0.6) };
  }
  if (id === 'slow') return { checked: true, ok: metrics.wpm < 110 };
  if (id === 'noI') {
    const banned = new Set(FIRST_PERSON[lang] || FIRST_PERSON.en);
    return { checked: true, ok: !tokenize(transcript).some((w) => banned.has(w)) };
  }
  return { checked: false, ok: true };
}

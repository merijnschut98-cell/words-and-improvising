// Modifiers: varied practice conditions ("harder on purpose"). Varying the
// conditions costs a little in the moment and builds transfer. Pure.
import { tokenize } from './metrics.js';

export const MODIFIERS = ['cold', 'whisper', 'slow', 'noI', 'standing', 'eyesClosed', 'endQuestion'];
const CHANCE = 0.25;

export function pickModifier(rng, level, force = false) {
  if (!force && (level < 2 || rng() >= CHANCE)) return null;
  return MODIFIERS[Math.floor(rng() * MODIFIERS.length)];
}

export function applyModifierTiming(timing, id) {
  return id === 'cold' ? { ...timing, prepS: 0 } : timing;
}

const FIRST_PERSON = {
  en: ['i', "i'm", 'me', 'my', 'mine', 'myself'],
  nl: ['ik', 'me', 'mij', 'mijn', 'mezelf', 'mijzelf'],
};

// Can we tell from the transcript whether the condition was met?
export function modifierCheck(id, metrics, transcript, lang) {
  if (id === 'slow') return { checked: true, ok: metrics.wpm < 110 };
  if (id === 'noI') {
    const banned = new Set(FIRST_PERSON[lang] || FIRST_PERSON.en);
    return { checked: true, ok: !tokenize(transcript).some((w) => banned.has(w)) };
  }
  return { checked: false, ok: true };
}

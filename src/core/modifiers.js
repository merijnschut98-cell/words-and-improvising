// Modifiers: varied practice conditions ("harder on purpose"). Varying the
// conditions costs a little in the moment and builds transfer. Pure.
import { tokenize } from './metrics.js';
import { CUED_DRILLS } from './progress.js';

// One word budget makes no sense across several short items or spoken cues.
const NO_BUDGET = ['rapid', ...CUED_DRILLS];

export const MODIFIERS = ['cold', 'whisper', 'slow', 'noI', 'standing', 'eyesClosed', 'endQuestion', 'budget'];

// Listen-back: the one point to improve becomes the next round's modifier.
// The extra ids are only ever chosen this way, never drawn at random.
export const FIX_MODIFIER = { opening: 'oneLine', fillers: 'noFillers', pace: 'slow', ending: 'clearEnd', voice: 'vary' };
export const ALL_MODIFIERS = [...new Set([...MODIFIERS, ...Object.values(FIX_MODIFIER)])];

export function queueModifier(state, id) {
  return { ...state, ui: { ...(state.ui || {}), nextModifier: { id, from: 'listen' } } };
}

// The next round takes a queued modifier once.
export function takeQueuedModifier(state) {
  const q = (state.ui || {}).nextModifier;
  if (!q) return { modifier: null, from: null, state };
  const { nextModifier, ...ui } = state.ui;
  const ok = ALL_MODIFIERS.includes(q.id);
  return { modifier: ok ? q.id : null, from: ok ? q.from || null : null, state: { ...state, ui } };
}

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
  if (id === 'noFillers') return { checked: true, ok: metrics.fillerRate < 2 };
  if (id === 'slow') return { checked: true, ok: metrics.wpm < 110 };
  if (id === 'noI') {
    const banned = new Set(FIRST_PERSON[lang] || FIRST_PERSON.en);
    return { checked: true, ok: !tokenize(transcript).some((w) => banned.has(w)) };
  }
  return { checked: false, ok: true };
}

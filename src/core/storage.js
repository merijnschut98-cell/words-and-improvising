// Versioned persistence on a localStorage-like backend ({getItem, setItem}).
import { DRILLS } from './progress.js';

export const KEY = 'spraakwater:v1';
const HISTORY_CAP = 200;

export function defaultState() {
  return {
    version: 1,
    settings: { lang: 'nl', mode: 'speak', apiKey: '', model: 'claude-opus-5-5', record: false, remind: false, theme: 'default' },
    xp: 0,
    streak: { count: 0, lastDay: null },
    days: {}, // 'YYYY-MM-DD' -> rounds completed that day
    drillLevels: Object.fromEntries(DRILLS.map((d) => [d, 1])),
    history: [],
    seen: {},
    onboarded: false,
    quests: { day: null, items: [] },
    freezes: 0,
    freezeLog: [],
    ui: {},
    plan: { cue: '', hour: null },
    bests: {},
    milestones: [],
  };
}

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

export function load(backend) {
  const base = defaultState();
  let raw = null;
  try {
    raw = backend.getItem(KEY);
  } catch {
    return base;
  }
  if (raw == null) return base;
  let parsed;
  try {
    parsed = JSON.parse(raw);
    if (!isObject(parsed)) throw new Error('not an object');
  } catch {
    try {
      backend.setItem(`spraakwater:corrupt:${Date.now()}`, raw);
    } catch { /* nothing more we can do */ }
    return base;
  }
  const merged = { ...base, ...parsed };
  for (const k of ['settings', 'streak', 'drillLevels', 'days', 'seen', 'ui', 'plan']) {
    merged[k] = { ...base[k], ...(isObject(parsed[k]) ? parsed[k] : {}) };
  }
  if (!Array.isArray(merged.history)) merged.history = [];
  return merged;
}

export function save(backend, state) {
  try {
    backend.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function addHistory(state, entry) {
  return { ...state, history: [entry, ...state.history].slice(0, HISTORY_CAP) };
}

// First-run explainer: only for someone who has never practised.
export function needsWelcome(state) {
  return !state.onboarded && state.history.length === 0;
}

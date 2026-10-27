// Versioned persistence on a localStorage-like backend ({getItem, setItem}).
import { DRILLS } from './progress.js';

export const KEY = 'spraakwater:v1';
const HISTORY_CAP = 200;

export function defaultState() {
  return {
    version: 1,
    settings: { lang: 'nl', mode: 'speak', apiKey: '', model: 'claude-opus-5-5', record: false, remind: false, theme: 'default', voiceStats: false },
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
    reviews: {},
    events: [],
    weekly: { week: null, focus: null },
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
  if (!Array.isArray(merged.events)) merged.events = [];
  if (!isObject(merged.reviews)) merged.reviews = {};
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

// Checks an exported backup. Returns the state load() would make of it.
export function parseBackup(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: 'json' };
  }
  if (!isObject(parsed) || !Array.isArray(parsed.history) || typeof parsed.xp !== 'number' || !Number.isFinite(parsed.xp)) {
    return { ok: false, error: 'shape' };
  }
  const state = load({ getItem: () => text, setItem() {} });
  // Keep only rounds that look like rounds: an object with a timestamp and metrics.
  state.history = state.history.filter((e) => isObject(e) && typeof e.ts === 'number' && isObject(e.metrics));
  const days = Object.values(state.days).filter((n) => n > 0).length;
  return { ok: true, state, summary: { rounds: state.history.length, days, xp: state.xp } };
}

// Replaces the stored state with a backup, keeping the previous value aside.
export function importBackup(backend, text) {
  const res = parseBackup(text);
  if (!res.ok) return res;
  let prev = null;
  try { prev = backend.getItem(KEY); } catch { /* treat as nothing stored */ }
  if (prev != null) {
    try { backend.setItem(`${KEY}:backup`, prev); } catch { /* best effort */ }
  }
  save(backend, res.state);
  return res;
}

export function addHistory(state, entry) {
  return { ...state, history: [entry, ...state.history].slice(0, HISTORY_CAP) };
}

// First-run explainer: only for someone who has never practised.
export function needsWelcome(state) {
  if (state.onboarded) return false;
  // A fresh install that started with a challenge link still gets the welcome.
  return state.history.length === 0 || !!(state.ui && state.ui.pendingWelcome);
}

// Versioned persistence on a localStorage-like backend ({getItem, setItem}).
import { DRILLS } from './progress.js';

// The key keeps the app's old name on purpose: renaming it would lose everyone's progress.
export const KEY = 'spraakwater:v1';
export const THEMES = ['auto', 'light', 'dark'];
const HISTORY_CAP = 200;

export function defaultState() {
  return {
    version: 1,
    settings: { lang: 'nl', mode: 'speak', apiKey: '', model: 'claude-opus-5-5', record: false, remind: false, theme: 'auto', voiceStats: false },
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
    programme: null,
    friendAsks: {}, // nonce -> { promptId, drill, ts }: links sent to a friend
    friendRatings: {}, // nonce -> { clear, structured, confident, line, ts }
    courses: { eng: { lessons: {}, sessions: [] }, pm: { lessons: {}, sessions: [] } }, // per subject: lessonId -> progress, session log
    courseReviews: {}, // 'lang|questionId' -> { box, due, lesson, subject }: course relearning queue
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
  // Retired colour themes (default, ocean, forest, night) follow the system now.
  if (!THEMES.includes(merged.settings.theme)) merged.settings.theme = 'auto';
  if (!Array.isArray(merged.history)) merged.history = [];
  if (!Array.isArray(merged.events)) merged.events = [];
  if (!isObject(merged.reviews)) merged.reviews = {};
  if (!isObject(merged.friendAsks)) merged.friendAsks = {};
  if (!isObject(merged.friendRatings)) merged.friendRatings = {};
  const courses = isObject(parsed.courses) ? parsed.courses : {};
  merged.courses = Object.fromEntries(Object.keys(base.courses).map((k) => {
    const c = isObject(courses[k]) ? courses[k] : {};
    return [k, { ...c, lessons: isObject(c.lessons) ? c.lessons : {}, sessions: Array.isArray(c.sessions) ? c.sessions : [] }];
  }));
  if (!isObject(merged.courseReviews)) merged.courseReviews = {};
  if ('subject' in merged.ui && !['speak', 'eng', 'pm'].includes(merged.ui.subject)) delete merged.ui.subject;
  const pr = merged.programme;
  if (!(isObject(pr) && typeof pr.start === 'string' && isObject(pr.baseline) && typeof pr.baseline.promptId === 'string')) merged.programme = null;
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
  if (!save(backend, res.state)) return { ok: false, error: 'save' };
  return res;
}

export function addHistory(state, entry) {
  return { ...state, history: [entry, ...state.history].slice(0, HISTORY_CAP) };
}

// The welcome is done: never show it again, and drop the challenge-link flag.
export function finishWelcome(state) {
  const { pendingWelcome, ...ui } = state.ui || {};
  return { ...state, onboarded: true, ui };
}

// First-run explainer: only for someone who has never practised.
export function needsWelcome(state) {
  if (state.onboarded) return false;
  // A fresh install that started with a challenge link still gets the welcome.
  return state.history.length === 0 || !!(state.ui && state.ui.pendingWelcome);
}

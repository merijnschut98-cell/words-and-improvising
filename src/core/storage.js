// Versioned persistence on a localStorage-like backend ({getItem, setItem}).
import { DRILLS } from './progress.js';
import { cleanOpenGroups, cleanSpeakOpen } from './layout.js';

// The key keeps the app's old name on purpose: renaming it would lose everyone's progress.
export const KEY = 'spraakwater:v1';
export const THEMES = ['auto', 'light', 'dark'];
const HISTORY_CAP = 200;

export function defaultState() {
  return {
    version: 1,
    settings: { lang: 'nl', mode: 'speak', apiKey: '', model: 'claude-opus-5-5', record: false, remind: false, theme: 'auto', voiceStats: false, context: '', guide: true, cheer: false }, // guide: the Andon light (v16, device-only); cheer: a sound on a celebration, off by default (Q10) // context: his work, device-only, sent only on a coach tap
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
    courses: { eng: { lessons: {}, sessions: [], plans: [], prepped: [], medals: {}, checks: {}, seenIntros: [] }, pm: { lessons: {}, sessions: [], plans: [], prepped: [], medals: {}, checks: {}, seenIntros: [] } }, // per subject: lessonId -> progress, session log, plans to use a lesson, events refreshed for
    xpDays: {}, // v16: 'YYYY-MM-DD' -> XP earned that day (last 60 days)
    dailyGoal: { xp: 30, ts: 0 }, // v16: daily goal in XP (20, 30 or 50), synced, later ts wins
    titles: {}, // v16: subject -> { rank 1..4, ts }, never lowered
    speakMedals: {}, // v16: drill group -> { tier, ts }, never lowered
    courseReviews: {}, // 'lang|questionId' -> { box, due, lesson, subject }: course relearning queue
  };
}

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isDay = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);

// A lesson plan ("use it this week") as stored and synced; anything else is dropped.
export function validPlan(p) {
  if (!isObject(p) || typeof p.id !== 'string' || !p.id || typeof p.lessonId !== 'string' || typeof p.text !== 'string' || !p.text) return false;
  if (!isDay(p.day) || !isDay(p.due) || ![0, 1, 2].includes(p.asked)) return false;
  const o = p.outcome;
  return o === null || (isObject(o) && ['yes', 'partly', 'no'].includes(o.used) && typeof o.note === 'string' && typeof o.ts === 'number');
}
// v16 flair: well-formed entries only, so a broken value never shows.
export const MEDAL_TIERS = ['bronze', 'silver', 'gold'];
const GOAL_XP = [20, 30, 50];
const SPEAK_GROUPS = ['basics', 'structure', 'conversation', 'pressure'];
const isTs = (v) => typeof v === 'number' && Number.isFinite(v);
export const cleanXpDays = (v) => Object.fromEntries(Object.entries(isObject(v) ? v : {}).filter(([d, n]) => isDay(d) && typeof n === 'number' && Number.isFinite(n) && n >= 0));
export const cleanGoal = (v) => (isObject(v) && GOAL_XP.includes(v.xp) && isTs(v.ts) ? { xp: v.xp, ts: v.ts } : { xp: 30, ts: 0 });
const validMedal = (m) => isObject(m) && MEDAL_TIERS.includes(m.tier) && isTs(m.ts);
export const cleanMedals = (v, keys = null) => Object.fromEntries(Object.entries(isObject(v) ? v : {}).filter(([k, m]) => (!keys || keys.includes(k)) && validMedal(m)).map(([k, m]) => [k, { tier: m.tier, ts: m.ts }]));
export const cleanSpeakMedals = (v) => cleanMedals(v, SPEAK_GROUPS);
export const cleanTitles = (v) => Object.fromEntries(Object.entries(isObject(v) ? v : {}).filter(([k, t]) => ['eng', 'pm', 'speak'].includes(k) && isObject(t) && Number.isInteger(t.rank) && t.rank >= 1 && t.rank <= 4 && isTs(t.ts)).map(([k, t]) => [k, { rank: t.rank, ts: t.ts }]));
const validCheck = (c) => isObject(c) && isDay(c.last) && Number.isInteger(c.best) && c.best >= 0 && Number.isInteger(c.total) && c.total >= c.best && (c.perfect === null || c.perfect === undefined || isTs(c.perfect));
export const cleanChecks = (v) => Object.fromEntries(Object.entries(isObject(v) ? v : {}).filter(([, c]) => validCheck(c)).map(([k, c]) => [k, { last: c.last, best: c.best, total: c.total, perfect: c.perfect ?? null }]));

export const strings = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []);
export const cleanPlans = (v) => (Array.isArray(v) ? v.filter(validPlan) : []);

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
  merged.settings.context = typeof merged.settings.context === 'string' ? merged.settings.context.slice(0, 400) : '';
  if (!Array.isArray(merged.history)) merged.history = [];
  if (!Array.isArray(merged.events)) merged.events = [];
  // Course topics on an event (v9): a list of module ids; old events stay as they were.
  merged.events = merged.events.map((e) => (isObject(e) && 'topics' in e ? { ...e, topics: strings(e.topics) } : e));
  if (!isObject(merged.reviews)) merged.reviews = {};
  if (!isObject(merged.friendAsks)) merged.friendAsks = {};
  if (!isObject(merged.friendRatings)) merged.friendRatings = {};
  const courses = isObject(parsed.courses) ? parsed.courses : {};
  merged.courses = Object.fromEntries(Object.keys(base.courses).map((k) => {
    const c = isObject(courses[k]) ? courses[k] : {};
    return [k, { ...c, lessons: isObject(c.lessons) ? c.lessons : {}, sessions: Array.isArray(c.sessions) ? c.sessions : [], plans: cleanPlans(c.plans), prepped: strings(c.prepped), seenIntros: strings(c.seenIntros).slice(-200), medals: cleanMedals(c.medals), checks: cleanChecks(c.checks) }];
  }));
  merged.xpDays = cleanXpDays(parsed.xpDays);
  merged.dailyGoal = cleanGoal(parsed.dailyGoal);
  merged.titles = cleanTitles(parsed.titles);
  merged.speakMedals = cleanSpeakMedals(parsed.speakMedals);
  if (typeof merged.settings.guide !== 'boolean') merged.settings.guide = true;
  if (typeof merged.settings.cheer !== 'boolean') merged.settings.cheer = false;
  if (!isObject(merged.courseReviews)) merged.courseReviews = {};
  // Boxes run 1–6 since v9; a v8 queue (1–4) loads unchanged.
  for (const [k, r] of Object.entries(merged.courseReviews)) {
    if (!isObject(r)) continue;
    const box = Math.round(Number(r.box));
    const fixed = Number.isFinite(box) ? Math.min(6, Math.max(1, box)) : 1;
    if (fixed !== r.box) merged.courseReviews[k] = { ...r, box: fixed };
  }
  if ('subject' in merged.ui && !['start', 'speak', 'eng', 'pm'].includes(merged.ui.subject)) delete merged.ui.subject;
  if ('moreOpen' in merged.ui && typeof merged.ui.moreOpen !== 'boolean') delete merged.ui.moreOpen;
  // Which drill groups on the speaking home are open (device only).
  if ('drillGroups' in merged.ui) {
    const g = cleanOpenGroups(merged.ui.drillGroups);
    if (g) merged.ui.drillGroups = g; else delete merged.ui.drillGroups;
  }
  // Which folds on the speaking home are open: quests, practice (device only).
  if ('speakOpen' in merged.ui) {
    const o = cleanSpeakOpen(merged.ui.speakOpen);
    if (o) merged.ui.speakOpen = o; else delete merged.ui.speakOpen;
  }
  // A plan typed on the lesson-done card, not yet turned into a plan (device only).
  const pd = merged.ui.planDraft;
  if ('planDraft' in merged.ui && !(isObject(pd) && ['eng', 'pm'].includes(pd.subject) && typeof pd.lessonId === 'string' && typeof pd.text === 'string' && pd.text.trim())) delete merged.ui.planDraft;
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

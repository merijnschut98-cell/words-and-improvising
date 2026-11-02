// Merging progress from another device. Never an overwrite: anything done on
// either device survives. Device settings (API key, theme, language) and ui
// state never leave the device. Pure.
import { cleanPlans, strings } from './storage.js';

const HISTORY_CAP = 200;
const SESSIONS_CAP = 200;
const PREPPED_CAP = 50;
// Device-only: settings (API key, theme, language), ui state, and the reminder plan (cue and hour).
const LOCAL_ONLY = ['settings', 'ui', 'plan'];

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const arr = (v) => (Array.isArray(v) ? v : []);
const obj = (v) => (isObj(v) ? v : {});

export function syncable(state) {
  const out = { ...state };
  for (const k of LOCAL_ONLY) delete out[k];
  return out;
}

// Union of two lists keyed by fn, first occurrence wins, newest ts first.
function unionBy(a, b, key, cap) {
  const seen = new Map();
  for (const x of [...arr(a), ...arr(b)]) if (x && !seen.has(key(x))) seen.set(key(x), x);
  return [...seen.values()].sort((x, y) => (y.ts || 0) - (x.ts || 0)).slice(0, cap);
}

function perKey(a, b, pick) {
  const out = { ...obj(a) };
  for (const [k, v] of Object.entries(obj(b))) out[k] = k in out ? pick(out[k], v) : v;
  return out;
}

const laterDue = (x, y) => {
  if (!isObj(x)) return y;
  if (!isObj(y)) return x;
  if (x.due !== y.due) return (x.due || '') > (y.due || '') ? x : y;
  return (x.box || 0) >= (y.box || 0) ? x : y;
};

const minDefined = (x, y) => (x == null ? y : y == null ? x : Math.min(x, y));
const maxDefined = (x, y) => (x == null ? y : y == null ? x : Math.max(x, y));

function mergeLesson(x, y) {
  const a = obj(x);
  const b = obj(y);
  const out = { ...b, ...a };
  for (const k of ['read', 'passed']) { const v = minDefined(a[k], b[k]); if (v != null) out[k] = v; }
  const say = maxDefined(a.sayIt, b.sayIt);
  if (say != null) out.sayIt = say;
  const sa = isObj(a.situation) ? a.situation : null;
  const sb = isObj(b.situation) ? b.situation : null;
  if (sa || sb) out.situation = !sa ? sb : !sb ? sa : (sb.ts > sa.ts ? sb : sa);
  const pa = isObj(a.pushback) ? a.pushback : null;
  const pb = isObj(b.pushback) ? b.pushback : null;
  if (pa || pb) out.pushback = !pa ? pb : !pb ? pa : (pb.ts > pa.ts ? pb : pa);
  return out;
}

// Plans: union by id. An answered plan beats an open one; of two answers the
// later one wins; asked takes the maximum (with the due date that goes with it).
const PLANS_CAP = 50;
function mergePlan(x, y) {
  const ax = x.outcome ? x.outcome.ts : -1;
  const ay = y.outcome ? y.outcome.ts : -1;
  let win;
  if (ax !== ay) win = ax > ay ? x : y;
  else if (x.asked !== y.asked) win = x.asked > y.asked ? x : y;
  else win = x.due >= y.due ? x : y;
  return { ...win, asked: Math.max(x.asked, y.asked) };
}
function mergePlans(a, b) {
  const byId = new Map();
  for (const p of [...cleanPlans(a), ...cleanPlans(b)]) byId.set(p.id, byId.has(p.id) ? mergePlan(byId.get(p.id), p) : p);
  return [...byId.values()].sort((x, y) => (x.day !== y.day ? (x.day < y.day ? 1 : -1) : x.id < y.id ? 1 : x.id > y.id ? -1 : 0)).slice(0, PLANS_CAP);
}

function mergeCourses(a, b) {
  return perKey(a, b, (x, y) => {
    const cx = obj(x);
    const cy = obj(y);
    const out = {
      ...cy, ...cx,
      lessons: perKey(cx.lessons, cy.lessons, mergeLesson),
      sessions: unionBy(cx.sessions, cy.sessions, (s) => `${s.ts}|${s.kind}|${s.lessonId || ''}`, SESSIONS_CAP),
      plans: mergePlans(cx.plans, cy.plans),
      // Event ids grow with time: newest first, capped like on the device.
      prepped: [...new Set([...strings(cx.prepped), ...strings(cy.prepped)])].sort().reverse().slice(0, PREPPED_CAP),
    };
    const lm = [cx.lastMaintenance, cy.lastMaintenance].filter(Boolean).sort().pop();
    if (lm) out.lastMaintenance = lm;
    return out;
  });
}

function mergeBests(a, b) {
  const x = obj(a);
  const y = obj(b);
  const better = (p, q, lower) => {
    if (!isObj(p)) return q;
    if (!isObj(q)) return p;
    return lower ? (q.value < p.value ? q : p) : (q.value > p.value ? q : p);
  };
  const out = { ...y, ...x };
  for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) {
    if (k === 'byDrill') continue;
    out[k] = better(x[k], y[k], k === 'fillerRate');
  }
  out.byDrill = perKey(x.byDrill, y.byDrill, (p, q) => ({ ...q, ...p, fillerRate: better(obj(p).fillerRate, obj(q).fillerRate, true) }));
  return out;
}

function laterStreak(a, b) {
  if (!isObj(a) || !a.lastDay) return isObj(b) ? b : a;
  if (!isObj(b) || !b.lastDay) return a;
  if (a.lastDay !== b.lastDay) return a.lastDay > b.lastDay ? a : b;
  return (a.count || 0) >= (b.count || 0) ? a : b;
}

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
const validEntry = (e) => isObj(e) && typeof e.ts === 'number' && isObj(e.metrics);

// A remote row is outside this device's control: keep only well-formed parts.
function clean(r) {
  const out = { ...r };
  out.xp = num(r.xp);
  out.freezes = num(r.freezes);
  out.days = Object.fromEntries(Object.entries(obj(r.days)).filter(([, v]) => typeof v === 'number' && Number.isFinite(v)));
  out.streak = isObj(r.streak) && typeof r.streak.lastDay === 'string' ? { count: num(r.streak.count), lastDay: r.streak.lastDay } : null;
  out.history = arr(r.history).filter(validEntry);
  // Course review boxes run 1–6, as load() enforces locally.
  out.courseReviews = Object.fromEntries(Object.entries(obj(r.courseReviews)).filter(([, v]) => isObj(v)).map(([k, v]) => {
    const box = Math.round(Number(v.box));
    return [k, { ...v, box: Number.isFinite(box) ? Math.min(6, Math.max(1, box)) : 1 }];
  }));
  return out;
}

export function mergeStates(local, remote) {
  if (!isObj(remote)) return local;
  const l = local;
  const r = clean(remote);
  const m = { ...r, ...l };
  m.history = unionBy(l.history, r.history, (e) => e.ts, HISTORY_CAP);
  m.days = perKey(l.days, r.days, Math.max);
  m.xp = Math.max(l.xp || 0, r.xp || 0);
  m.streak = laterStreak(l.streak, r.streak);
  m.freezes = Math.max(l.freezes || 0, r.freezes || 0);
  m.freezeLog = [...new Set([...arr(l.freezeLog), ...arr(r.freezeLog)])].sort();
  m.reviews = perKey(l.reviews, r.reviews, laterDue);
  m.courseReviews = perKey(l.courseReviews, r.courseReviews, laterDue);
  m.courses = mergeCourses(l.courses, r.courses);
  m.events = (() => {
    const byId = new Map();
    for (const e of [...arr(l.events), ...arr(r.events)]) {
      if (!e || !e.id) continue;
      const prev = byId.get(e.id);
      if (!prev || (!prev.reflection && e.reflection)) byId.set(e.id, e);
    }
    return [...byId.values()];
  })();
  m.bests = mergeBests(l.bests, r.bests);
  m.milestones = [...new Set([...arr(l.milestones), ...arr(r.milestones)])];
  m.seen = perKey(l.seen, r.seen, Math.max);
  m.drillLevels = perKey(l.drillLevels, r.drillLevels, Math.max);
  m.friendAsks = { ...obj(r.friendAsks), ...obj(l.friendAsks) };
  m.friendRatings = { ...obj(r.friendRatings), ...obj(l.friendRatings) };
  m.onboarded = !!(l.onboarded || r.onboarded);
  const startOf = (p) => (isObj(p) && p.start) || '';
  m.programme = startOf(r.programme) > startOf(l.programme) ? r.programme : (l.programme ?? r.programme ?? null);
  const weekOf = (w) => (isObj(w) && w.week) || '';
  m.weekly = weekOf(r.weekly) > weekOf(l.weekly) ? r.weekly : l.weekly;
  const dayOf = (q) => (isObj(q) && q.day) || '';
  m.quests = dayOf(r.quests) > dayOf(l.quests) ? r.quests : l.quests;
  for (const k of LOCAL_ONLY) { if (k in l) m[k] = l[k]; else delete m[k]; }
  return m;
}

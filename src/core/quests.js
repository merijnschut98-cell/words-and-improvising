// Daily quests: three small goals per day, each pointing at a learning
// behaviour. Seeded by the date so they stay stable across reopenings. Pure.
import { seededRng } from './lesson.js';
import { dayKey } from './progress.js';
import { tokenize } from './metrics.js';

export const QUEST_XP = 15;

// Prep seconds actually used; tapping "I'm ready" within a second is a cold start.
export const prepSecondsUsed = (s) => (!s || s < 1 ? 0 : Math.round(s));
const MAX_FREEZES = 2;

const yesterdayOf = (day) => {
  const [y, m, d] = day.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d - 1));
};

// Language used least in recent history (the "other" language), or null.
function otherLang(history) {
  const recent = history.slice(0, 20);
  if (!recent.length) return null;
  const nl = recent.filter((e) => e.lang === 'nl').length;
  return nl >= recent.length - nl ? 'en' : 'nl';
}

function usedAllWords(transcript, words) {
  const toks = tokenize(transcript);
  return words.every((w) => {
    const target = tokenize(w);
    return toks.some((_, i) => target.every((t, k) => (toks[i + k] || '').startsWith(t)));
  });
}

export const QUEST_POOL = [
  { id: 'pauseClean', check: (r) => r.prompt.drill === 'pause' && r.metrics.fillerCount === 0 && r.metrics.words >= 20 },
  { id: 'beatYesterday', check: (r, c) => c.yesterdayBest != null && r.metrics.words >= 20 && r.metrics.fillerRate < c.yesterdayBest },
  { id: 'sayAgain', check: (r) => !!r.retry },
  { id: 'lesson', check: (r, c) => (c.state.days[c.today] || 0) >= 3 },
  { id: 'coldStart', check: (r) => r.prepS === 0 },
  { id: 'bridgeAll', check: (r) => r.prompt.drill === 'bridge' && usedAllWords(r.transcript || '', r.prompt.extra.words || []) },
  { id: 'liveConvo', needsKey: true, check: (r) => !!(r.prompt.extra && r.prompt.extra.dialogue) },
  { id: 'otherLang', check: (r, c) => c.otherLang != null && r.lang === c.otherLang },
];

function seedOf(day) {
  let h = 2166136261;
  for (const ch of day) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

export function questsForDay(day, hasKey, rng = seededRng(seedOf(day))) {
  const pool = QUEST_POOL.filter((q) => hasKey || !q.needsKey).map((q) => q.id);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 3).map((id) => ({ id, done: false }));
}

// Today's quests for display, without touching state.
export function currentQuests(state, today) {
  const q = state.quests;
  return q && q.day === today && q.items.length ? q.items : questsForDay(today, !!state.settings.apiKey);
}

// `state` is the state after the round was applied (days/history updated).
export function applyQuests(state, round, today) {
  const items = currentQuests(state, today).map((q) => ({ ...q }));
  const completed = [];
  if (round.metrics && round.metrics.words >= 5) {
    const yesterday = yesterdayOf(today);
    const yRates = state.history
      .filter((e) => e.ts && dayKey(new Date(e.ts)) === yesterday && e.metrics && e.metrics.words >= 20)
      .map((e) => e.metrics.fillerRate);
    const ctx = {
      state,
      today,
      yesterdayBest: yRates.length ? Math.min(...yRates) : null,
      // The current round may already be in history; judge "other" by the rest.
      otherLang: otherLang(state.history.filter((e) => e.transcript !== round.transcript || e.ts !== round.ts)),
    };
    for (const q of items) {
      if (q.done) continue;
      const def = QUEST_POOL.find((p) => p.id === q.id);
      if (def && def.check(round, ctx)) {
        q.done = true;
        completed.push(q.id);
      }
    }
  }
  const wasAllDone = currentQuests(state, today).every((q) => q.done);
  const allDone = items.every((q) => q.done);
  const next = {
    ...state,
    xp: state.xp + completed.length * QUEST_XP,
    quests: { day: today, items },
    freezes: !wasAllDone && allDone ? Math.min(MAX_FREEZES, (state.freezes || 0) + 1) : (state.freezes || 0),
  };
  return { state: next, completed };
}

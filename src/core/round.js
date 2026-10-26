// Applies a finished round to the app state. Pure: returns a new state.
import { updateStreak, xpForRound, levelFromXp, adjustDrillLevel } from './progress.js';
import { addHistory } from './storage.js';
import { applyQuests } from './quests.js';
import { updateBests } from './bests.js';

export function applyRound(state, round, today, now) {
  const { prompt, metrics, durationS, targetS, coach } = round;
  if (!metrics || metrics.words < 5) return { state, xp: 0, levelUp: false, completedQuests: [], newBests: [] };
  const rating = round.rating ?? (coach && coach.overall) ?? 3;
  const xp = xpForRound({ metrics, durationS, targetS, rating, drill: prompt.drill });
  const drill = prompt.drill;
  let next = {
    ...state,
    xp: state.xp + xp,
    streak: updateStreak(state.streak, today),
    days: { ...state.days, [today]: (state.days[today] || 0) + 1 },
    drillLevels: { ...state.drillLevels, [drill]: adjustDrillLevel(state.drillLevels[drill] || 1, rating) },
    seen: { ...state.seen, ...Object.fromEntries(prompt.seenIds.map((id) => [id, now])) },
  };
  next = addHistory(next, {
    ts: now,
    drill,
    promptId: prompt.id,
    body: prompt.body,
    extra: prompt.extra,
    lang: round.lang,
    mode: round.mode,
    durationS: Math.round(durationS),
    transcript: round.transcript,
    metrics,
    rating: round.rating ?? null,
    coach: coach || null,
    cleanRun: round.cleanRun ?? null,
    xp,
  });
  const b = updateBests(next.bests || {}, next.history[0]);
  next = { ...next, bests: b.bests };
  const q = applyQuests(next, { ...round, ts: now }, today);
  next = q.state;
  return {
    state: next,
    xp: next.xp - state.xp, // round XP plus any quest XP
    levelUp: levelFromXp(next.xp).level > levelFromXp(state.xp).level,
    completedQuests: q.completed,
    newBests: b.newBests,
  };
}

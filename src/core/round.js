// Applies a finished round to the app state. Pure: returns a new state.
import { updateStreak, xpForRound, levelFromXp, adjustDrillLevel, reconcileStreak } from './progress.js';
import { addHistory } from './storage.js';
import { applyQuests } from './quests.js';
import { updateBests } from './bests.js';
import { newMilestones } from './milestones.js';
import { scheduleReview, wasImproved } from './spaced.js';

export function applyRound(state, round, today, now) {
  const { prompt, metrics, durationS, targetS, coach } = round;
  if (!metrics || metrics.words < 5) return { state, xp: 0, levelUp: false, completedQuests: [], newBests: [], newMilestones: [] };
  // The app may have stayed open past midnight: cover missed days with freezes first.
  state = reconcileStreak(state, today).state;
  const rating = round.rating ?? (coach && coach.overall) ?? 3;
  const xp = xpForRound({ metrics, durationS, targetS, rating, drill: prompt.drill, modifier: round.modifier });
  const drill = prompt.drill;
  // Shadow rounds repeat a model answer: practice, but not his own record.
  const shadow = !!(prompt.extra && prompt.extra.shadow);
  // His own earlier attempt (shadow rounds repeat the model; they are not his record).
  const earlier = state.history.find((e) => !e.shadow && e.promptId === prompt.id && e.drill === prompt.drill && e.lang === round.lang);
  let next = {
    ...state,
    xp: state.xp + xp,
    streak: updateStreak(state.streak, today),
    days: { ...state.days, [today]: (state.days[today] || 0) + 1 },
    drillLevels: shadow ? state.drillLevels : { ...state.drillLevels, [drill]: adjustDrillLevel(state.drillLevels[drill] || 1, rating) },
    seen: { ...state.seen, ...Object.fromEntries(prompt.seenIds.map((id) => [id, now])) },
  };
  next = addHistory(next, {
    ts: now,
    drill,
    promptId: prompt.id,
    ...(prompt.extra && prompt.extra.shadow ? { shadow: true } : {}),
    ...(String(round.selfFix || '').trim() ? { selfFix: String(round.selfFix).trim().slice(0, 140) } : {}),
    body: prompt.body,
    extra: shadowExtra(prompt.extra),
    lang: round.lang,
    mode: round.mode,
    durationS: Math.round(durationS),
    transcript: round.transcript,
    metrics,
    rating: round.rating ?? null,
    coach: coach || null,
    cleanRun: round.cleanRun ?? null,
    modifier: round.modifier || null,
    xp,
  });
  // The programme baseline is re-taken in week 4, not reviewed in between.
  const baseline = state.programme && state.programme.baseline && state.programme.baseline.promptId === prompt.id;
  if (!shadow && !baseline) next = { ...next, reviews: scheduleReview(next.reviews || {}, { promptId: prompt.id, drill, lang: round.lang }, today, wasImproved(earlier, { metrics, rating: round.rating, coach })) };
  const b = shadow ? { bests: next.bests || {}, newBests: [] } : updateBests(next.bests || {}, next.history[0]);
  next = { ...next, bests: b.bests };
  const q = applyQuests(next, { ...round, ts: now }, today);
  next = q.state;
  const reached = newMilestones(next);
  if (reached.length) next = { ...next, milestones: [...(next.milestones || []), ...reached] };
  return {
    state: next,
    xp: next.xp - state.xp, // round XP plus any quest XP
    levelUp: levelFromXp(next.xp).level > levelFromXp(state.xp).level,
    completedQuests: q.completed,
    newBests: b.newBests,
    newMilestones: reached,
  };
}

// A shadow round keeps its model text but not the prompt it came from.
function shadowExtra(extra) {
  if (!extra || !extra.shadow) return extra;
  const { original, firstMetrics, firstDuration, ...rest } = extra;
  return rest;
}

// v16 flair: medals per module, titles per subject, the daily goal and the
// one big moment of a done screen. Pure. Earned by real learning only;
// nothing earned is ever taken away, and nothing here gates content.
// Spec: docs/superpowers/specs/2026-11-11-v16-flair-design.md.
import { MODULES } from '../content/courses/index.js';
import { masteryOf } from './mastery.js';
import { DRILL_GROUPS } from './layout.js';

export { creditXp, XP_DAYS_KEEP, GOALS, DEFAULT_GOAL, goalOf, goalProgress, goalJustReached, setGoal, isPerfect } from './xp.js';

// ---- Medals ----
// Merijn's answers (Q8): silver at a perfect quiz on 75% of the levels.
export const SILVER_SHARE = 0.75;
export const TIERS = ['bronze', 'silver', 'gold'];
const rankOf = (tier) => TIERS.indexOf(tier) + 1; // 0 for none

const courseOf = (state, subject) => ((state && state.courses) || {})[subject] || {};

// The tier the rules give a course module now, or null. Bronze: every level
// passed. Silver: bronze and a perfect quiz on ceil(75%) of the levels. Gold:
// silver and a perfect module check (a perfect check done earlier counts).
export function medalFor(state, meta) {
  const c = courseOf(state, meta.subject);
  const lessons = c.lessons || {};
  if (!meta.lessons.length || !meta.lessons.every((id) => lessons[id] && lessons[id].passed)) return null;
  const perfect = meta.lessons.filter((id) => lessons[id].perfect).length;
  if (perfect < Math.ceil(meta.lessons.length * SILVER_SHARE)) return 'bronze';
  const check = (c.checks || {})[meta.id];
  return check && check.perfect ? 'gold' : 'silver';
}

// The stored medal of a module (what the screens show), or null.
export const storedMedal = (state, subject, moduleId) => {
  const m = (courseOf(state, subject).medals || {})[moduleId];
  return m && TIERS.includes(m.tier) ? m.tier : null;
};

// Modules whose rules now give a higher tier than the stored one.
export function newMedals(state, subject, modules = MODULES) {
  return modules.filter((m) => m.subject === subject).flatMap((m) => {
    const tier = medalFor(state, m);
    return rankOf(tier) > rankOf(storedMedal(state, subject, m.id)) ? [{ moduleId: m.id, tier }] : [];
  });
}

// Speaking medals per drill group (Q4), in the same ladder. Bronze: every
// drill of the group practised (3 rounds or more). Silver: bronze and
// ceil(75%) of its drills owned. Gold: silver and a boss round (the
// speaking check) scored 4 or higher; one done earlier counts.
const score = (e) => e.rating ?? (e.coach && e.coach.overall) ?? 0;
export const BOSS_GOLD_SCORE = 4;

export function speakMedalFor(state, group, now) {
  const history = (state && state.history) || [];
  const m = group.drills.map((d) => masteryOf(history, d, now));
  if (!m.every((x) => x !== 'learn')) return null;
  if (m.filter((x) => x === 'own').length < Math.ceil(group.drills.length * SILVER_SHARE)) return 'bronze';
  return history.some((e) => e && e.drill === 'boss' && e.metrics && score(e) >= BOSS_GOLD_SCORE) ? 'gold' : 'silver';
}

export const storedSpeakMedal = (state, groupId) => {
  const m = ((state && state.speakMedals) || {})[groupId];
  return m && TIERS.includes(m.tier) ? m.tier : null;
};

export function newSpeakMedals(state, now, groups = DRILL_GROUPS) {
  return groups.flatMap((g) => {
    const tier = speakMedalFor(state, g, now);
    return rankOf(tier) > rankOf(storedSpeakMedal(state, g.id)) ? [{ groupId: g.id, tier }] : [];
  });
}

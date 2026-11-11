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

// ---- Titles ----
// Merijn's answers (Q2): Leerling, Gezel, Vakman, Meester (i18n title_1..4).
// Course subjects: a share of the subject's levels (so new content needs no
// new numbers) and medals. Speaking: drill mastery and boss rounds.
export const TITLE_RULES = {
  course: [
    { rank: 1, share: 0, medals: 0, tier: null },
    { rank: 2, share: 0.10, medals: 1, tier: 'bronze' },
    { rank: 3, share: 0.35, medals: 2, tier: 'silver' },
    { rank: 4, share: 0.70, medals: 3, tier: 'gold' },
  ],
  speak: [
    { rank: 1, rounds: 1 },
    { rank: 2, practised: 4, days: 7 },
    { rank: 3, owned: 4, bosses: 1 },
    { rank: 4, owned: 10, bosses: 3 },
  ],
};
export const SUBJECTS_TITLED = ['eng', 'pm', 'speak'];

// Levels passed and medals (stored or by the rules, whichever is higher).
function courseStanding(state, subject, modules) {
  const mods = modules.filter((m) => m.subject === subject);
  const lessons = courseOf(state, subject).lessons || {};
  const total = mods.reduce((a, m) => a + m.lessons.length, 0);
  const passed = mods.reduce((a, m) => a + m.lessons.filter((id) => lessons[id] && lessons[id].passed).length, 0);
  const tiers = mods.map((m) => Math.max(rankOf(storedMedal(state, subject, m.id)), rankOf(medalFor(state, m))));
  const atLeast = (tier) => tiers.filter((r) => r >= rankOf(tier)).length;
  return { total, passed, atLeast };
}

const needLevels = (rule, total) => Math.max(1, Math.ceil(total * rule.share));

function speakStanding(state, now) {
  const history = ((state && state.history) || []).filter((e) => e && e.metrics);
  const drills = DRILL_GROUPS.flatMap((g) => g.drills);
  const m = drills.map((d) => masteryOf(history, d, now));
  const day = (ts) => { const d = new Date(ts); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
  return {
    rounds: history.length,
    practised: m.filter((x) => x !== 'learn').length,
    owned: m.filter((x) => x === 'own').length,
    days: new Set(history.map((e) => day(e.ts))).size,
    bosses: history.filter((e) => e.drill === 'boss').length,
  };
}

const speakMeets = (r, s) => s.rounds >= (r.rounds || 0) && s.practised >= (r.practised || 0) && s.days >= (r.days || 0) && s.owned >= (r.owned || 0) && s.bosses >= (r.bosses || 0);

// The rank the rules give now (0 before the first lesson or round): the
// highest rank whose rule holds.
export function titleFor(state, subject, now, modules = MODULES) {
  if (subject === 'speak') {
    const s = speakStanding(state, now);
    return TITLE_RULES.speak.reduce((best, r) => (speakMeets(r, s) ? r.rank : best), 0);
  }
  const s = courseStanding(state, subject, modules);
  if (!s.total) return 0;
  return TITLE_RULES.course.reduce((best, r) => (s.passed >= needLevels(r, s.total) && (!r.tier || s.atLeast(r.tier) >= r.medals) ? r.rank : best), 0);
}

export const storedTitle = (state, subject) => {
  const t = ((state && state.titles) || {})[subject];
  return t && Number.isInteger(t.rank) && t.rank >= 1 && t.rank <= 4 ? t.rank : 0;
};

// Subjects whose rules now give a higher rank than the stored one.
export function newTitles(state, now, modules = MODULES) {
  return SUBJECTS_TITLED.flatMap((subject) => {
    const rank = titleFor(state, subject, now, modules);
    return rank > storedTitle(state, subject) ? [{ subject, rank }] : [];
  });
}

// What is still missing for the next rank of a course subject; null at
// Meester. Speaking returns the counts its next rule still needs.
export function titleNextNeeds(state, subject, now, modules = MODULES) {
  const cur = Math.max(storedTitle(state, subject), titleFor(state, subject, now, modules));
  if (cur >= 4) return null;
  if (subject === 'speak') {
    const r = TITLE_RULES.speak[cur];
    const s = speakStanding(state, now);
    const gap = (k) => Math.max(0, (r[k] || 0) - s[k]);
    return { rank: r.rank, rounds: gap('rounds'), practised: gap('practised'), days: gap('days'), owned: gap('owned'), bosses: gap('bosses') };
  }
  const r = TITLE_RULES.course[cur];
  const s = courseStanding(state, subject, modules);
  return {
    rank: r.rank,
    levels: Math.max(0, needLevels(r, s.total) - s.passed),
    medals: r.tier ? Math.max(0, r.medals - s.atLeast(r.tier)) : 0,
    tier: r.tier,
  };
}

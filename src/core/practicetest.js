// The practice test engine (v18 T2, design 3.2): the pool of a module, the
// composition of one attempt, its score and what a finished attempt changes in
// the state. Pure. Rules (ids, unlocks, the pick) are in testrules.js.
//
// Sources: the module's test bank (about 60 percent, all kinds) and the lessons'
// recall questions (about 40 percent). A module without a bank is tested on recall
// questions alone. Term questions are not used. Pre (guess) questions are not
// used either: they are made to be answered before the lesson, and have no stable id.
// Reviews (Q5 A): a recall answer is scheduled like a due answer; a bank answer never
// is, so tests do not grow the review pile.
import { countRound, recallQuestions } from './course.js';
import { scheduleCourseReview } from './coursereview.js';
import { seededRng } from './lesson.js';
import { kindOf } from './questionkinds.js';
import { awardFlair, goalJustReached } from './flair.js';
import { placeOf, lessonOf, bankQuestionId, isBankQuestion, topicsOf } from '../content/courses/index.js';
import { PASS_PCT, GOLD_PCT, parseTestId, testRecord } from './testrules.js';

export * from './testrules.js';

export const BANK_SHARE = 0.6;
export const TEST_XP = 20;
export const TEST_PASS_XP = 10;
const SESSIONS_CAP = 200;
const ITEMS_CAP = 20;

function seedOf(s) {
  let h = 2166136261;
  for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}
function shuffled(list, rng) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Every question a test of this module may draw on, each marked with its topic,
// level and source ('bank' or 'recall'). lessons: the module's lessons in the
// language; bank: loadBank's result, or null for a module without a bank.
export function testPool(meta, lessons, bank) {
  const out = [];
  for (const lesson of lessons || []) {
    const place = placeOf(lesson.id, [meta]);
    if (!place) continue;
    for (const q of recallQuestions(lesson)) out.push({ ...q, topic: place.topicId, level: place.level, src: 'recall' });
  }
  for (const item of (bank && bank.items) || []) {
    out.push({ ...item, id: bankQuestionId(item), src: 'bank' });
  }
  return out;
}

// How many of `size` items each level gets. A topic test weights the levels 1:2:3:4;
// a level test puts half of the items on level N and spreads the rest over the lower levels.
export function levelQuotas(spec) {
  const size = spec.size;
  const quotas = { 1: 0, 2: 0, 3: 0, 4: 0 };
  if (spec.type === 'topic') {
    const weights = [1, 2, 3, 4];
    const total = weights.reduce((a, b) => a + b, 0);
    const raw = weights.map((w) => (size * w) / total);
    raw.forEach((r, i) => { quotas[i + 1] = Math.floor(r); });
    let left = size - Object.values(quotas).reduce((a, b) => a + b, 0);
    const order = raw.map((r, i) => [r - Math.floor(r), i + 1]).sort((a, b) => b[0] - a[0] || b[1] - a[1]);
    for (const [, level] of order) { if (left <= 0) break; quotas[level] += 1; left--; }
    return quotas;
  }
  const n = spec.level;
  if (n === 1) { quotas[1] = size; return quotas; }
  const top = Math.ceil(size / 2);
  quotas[n] = top;
  const rest = size - top;
  const lower = n - 1;
  for (let i = 1; i <= lower; i++) quotas[i] = Math.floor(rest / lower);
  // The remainder goes to the higher of the lower levels.
  for (let i = 0; i < rest - Math.floor(rest / lower) * lower; i++) quotas[lower - i] += 1;
  return quotas;
}

// One attempt: spec.size items (fewer when the pool is smaller), no item of the
// last attempt while the pool allows it, 60 percent from the bank when there is
// one, kinds and topics spread. Seeded by test and attempt number: a restart of
// the same attempt asks the same set; the next attempt differs.
export function composeTest(spec, pool, { attempt = 0, lastIds = [] } = {}) {
  const rng = seededRng(seedOf(`${spec.id}|${attempt}`));
  const allowed = pool.filter((q) => (spec.type === 'topic' ? q.topic === spec.topicId : q.level <= spec.level));
  const order = new Map(shuffled(allowed, rng).map((q, i) => [q.id, i]));
  const last = new Set(lastIds);
  const chosen = [];
  const used = new Set();
  const kinds = {};
  const topics = {};
  const take = (q) => {
    chosen.push(q);
    used.add(q.id);
    kinds[kindOf(q)] = (kinds[kindOf(q)] || 0) + 1;
    topics[q.topic] = (topics[q.topic] || 0) + 1;
  };
  // The next slot wants a bank item 60 percent of the time (Bresenham spacing).
  const wantBank = () => Math.floor((chosen.length + 1) * BANK_SHARE) > Math.floor(chosen.length * BANK_SHARE);
  const pickFrom = (cands) => {
    if (!cands.length) return null;
    const bank = wantBank();
    const preferred = cands.filter((q) => (q.src === 'bank') === bank);
    const from = preferred.length ? preferred : cands;
    return [...from].sort((a, b) => (topics[a.topic] || 0) - (topics[b.topic] || 0)
      || (kinds[kindOf(a)] || 0) - (kinds[kindOf(b)] || 0) || order.get(a.id) - order.get(b.id))[0];
  };
  const fill = (levelOf, count, allowLast) => {
    for (let k = 0; k < count && chosen.length < spec.size; k++) {
      const q = pickFrom(allowed.filter((x) => !used.has(x.id) && (allowLast || !last.has(x.id)) && levelOf(x)));
      if (!q) break;
      take(q);
    }
  };
  const quotas = levelQuotas(spec);
  for (const level of [4, 3, 2, 1]) fill((x) => x.level === level, quotas[level], false);
  // Short of items at some level: the highest levels first, new items before repeats.
  for (const level of [4, 3, 2, 1]) fill((x) => x.level === level, spec.size, false);
  for (const level of [4, 3, 2, 1]) fill((x) => x.level === level, spec.size, true);
  return shuffled(chosen, rng);
}

// The score of an attempt: results maps a question id to right or wrong on the
// first try; an unanswered question counts as wrong. pct is rounded down, so 80
// and 90 percent mean exactly that or more.
export function scoreTest(questions, results) {
  const res = results || {};
  const byTopic = {};
  const byLevel = {};
  const missed = [];
  let correct = 0;
  for (const q of questions) {
    const ok = res[q.id] === true;
    if (ok) correct++; else missed.push(q.id);
    for (const [map, key] of [[byTopic, q.topic], [byLevel, q.level]]) {
      const e = map[key] || (map[key] = { correct: 0, total: 0 });
      e.total++;
      if (ok) e.correct++;
    }
  }
  const total = questions.length;
  const pct = total ? Math.floor((correct * 100) / total) : 0;
  return { correct, total, pct, passed: total > 0 && correct * 100 >= PASS_PCT * total, gold: total > 0 && correct * 100 >= GOLD_PCT * total, byTopic, byLevel, missed };
}

// The weakest topic of an attempt: the lowest share right, only among topics with a miss.
export function weakestTopic(byTopic) {
  const rows = Object.entries(byTopic || {}).filter(([, e]) => e.correct < e.total)
    .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total || (a[0] < b[0] ? -1 : 1));
  return rows.length ? rows[0][0] : null;
}

// A finished attempt: a round for the day (days, streak), 20 XP the first finish of
// this test and +10 the first time it is passed, recall answers scheduled like a
// due session (a right answer before its due date does not climb, a miss goes to
// box 1), bank answers not at all, the record, the session log and the medals.
export function applyTest(state, { subject, testId, questions, results, lang }, today, now) {
  const score = scoreTest(questions, results);
  const prev = testRecord(state, subject, testId);
  const xp = (prev ? 0 : TEST_XP) + (score.passed && !(prev && prev.best >= PASS_PCT) ? TEST_PASS_XP : 0);
  let next = countRound(state, today, xp);
  let reviews = next.courseReviews || {};
  for (const q of questions) {
    if (isBankQuestion(q.id)) continue;
    const ok = (results || {})[q.id] === true;
    const cur = reviews[`${lang}|${q.id}`];
    if (ok && cur && cur.due > today) continue;
    reviews = scheduleCourseReview(reviews, { questionId: q.id, lessonId: lessonOf(q.id), subject, lang }, today, ok, true);
  }
  next = { ...next, courseReviews: reviews };
  const record = {
    best: Math.max(prev ? prev.best : 0, score.pct),
    last: score.pct,
    attempts: (prev ? prev.attempts : 0) + 1,
    lastDay: today,
    byTopic: score.byTopic,
    items: questions.map((q) => q.id).slice(0, ITEMS_CAP),
  };
  const courses = next.courses || {};
  const c = courses[subject] || { lessons: {}, sessions: [] };
  const parsed = parseTestId(testId) || {};
  next = { ...next, courses: { ...courses, [subject]: {
    ...c,
    tests: { ...(c.tests || {}), [testId]: record },
    sessions: [{ day: today, kind: 'test', testId, moduleId: parsed.moduleId || null, correct: score.correct, total: score.total, ts: now }, ...(c.sessions || [])].slice(0, SESSIONS_CAP),
  } } };
  const won = awardFlair(next, now);
  return { state: won.state, xp, ...score, record, medals: won.medals, speakMedals: won.speakMedals, titles: won.titles, goalReached: goalJustReached(state, won.state, today) };
}

// For a topic title in the results: the topic's index title, from the meta.
export const topicTitleOf = (meta, topicId, lang) => {
  const t = (topicsOf(meta) || []).find((x) => x.id === topicId);
  return t ? (t.title[lang] || t.title.en) : topicId;
};

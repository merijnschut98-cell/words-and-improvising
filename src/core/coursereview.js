// Course relearning (successive relearning on Leitner boxes). The quiz is the
// first session: right there → box 2, wrong → box 1. Each later sure, correct
// recall moves a question up a box (due after 1, 3, 7, 21, 60, 120 days); a
// correct guess keeps the box; a miss sends it back to box 1. Box 4 means
// owned: three correct recalls in three spaced sessions. Questions overdue by
// more than 60 days come back as lapsed, a few per session.
// Keys are 'lang|questionId', separate from the speaking reviews. Pure.
import { dayKey } from './progress.js';
import { isoWeekKey } from './boss.js';
import { trackOf as indexTrackOf, moduleOf } from '../content/courses/index.js';

const LAPSE_DAYS = 60;
export const COURSE_INTERVALS = [1, 3, 7, 21, 60, 120];
export const OWNED_BOX = 4;
const MAX_BOX = COURSE_INTERVALS.length;
const LAPSED_PER_SESSION = 3;

function addDays(day, n) {
  const [y, m, d] = day.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + n));
}
const toDate = (day) => { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d); };

export const questionKey = (lang, questionId) => `${lang}|${questionId}`;
const idOf = (key) => key.slice(key.indexOf('|') + 1);

// sure = false: he said he was guessing. A correct guess is not retrieval, so
// it does not climb (a first one starts at box 1).
export function scheduleCourseReview(reviews, { questionId, lessonId, subject, lang }, today, correct, sure = true) {
  const key = questionKey(lang, questionId);
  const cur = (reviews || {})[key];
  let box = 1;
  if (correct && sure) box = Math.min(MAX_BOX, cur ? cur.box + 1 : 2);
  else if (correct) box = cur ? Math.min(MAX_BOX, Math.max(1, cur.box)) : 1;
  return { ...reviews, [key]: { box, due: addDays(today, COURSE_INTERVALS[box - 1]), lesson: lessonId, subject, lastSure: !!sure } };
}

export const isOwned = (reviews, lang, questionId) => ((reviews || {})[questionKey(lang, questionId)] || {}).box >= OWNED_BOX;

// Everything due, oldest first; due more than 60 days ago is marked lapsed.
export function dueCourseQuestions(reviews, today, subject, lang) {
  const oldest = addDays(today, -LAPSE_DAYS);
  return Object.entries(reviews || {})
    .filter(([key, r]) => key.startsWith(`${lang}|`) && r && r.subject === subject && r.due <= today)
    .map(([key, r]) => ({ questionId: idOf(key), lessonId: r.lesson, box: r.box, due: r.due, lapsed: r.due < oldest }))
    .sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : a.questionId < b.questionId ? -1 : 1));
}

// What a session can hold: the regular due ones plus at most three lapsed,
// so a return after a long break shows a normal-size session.
export function dueCount(reviews, today, subject, lang) {
  const due = dueCourseQuestions(reviews, today, subject, lang);
  const lapsed = due.filter((q) => q.lapsed).length;
  return due.length - lapsed + Math.min(LAPSED_PER_SESSION, lapsed);
}

function shuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// One session: the track with the most due questions (similar material
// interleaves well), its modules taken in turn, shuffled within a module.
export function dueSession(reviews, today, subject, lang, rng, { max = 10, trackOf = indexTrackOf } = {}) {
  const all = dueCourseQuestions(reviews, today, subject, lang);
  // Up to three lapsed questions (oldest first) go after the regular ones.
  const lapsed = all.filter((q) => q.lapsed).slice(0, Math.min(LAPSED_PER_SESSION, max)).map((q) => q.questionId);
  const due = all.filter((q) => !q.lapsed);
  if (!due.length) return lapsed;
  max -= lapsed.length;
  const byTrack = new Map();
  for (const q of due) {
    const mod = moduleOf(q.questionId);
    const track = trackOf(mod) || mod;
    if (!byTrack.has(track)) byTrack.set(track, new Map());
    const mods = byTrack.get(track);
    if (!mods.has(mod)) mods.set(mod, []);
    mods.get(mod).push(q.questionId);
  }
  const size = (mods) => [...mods.values()].reduce((n, l) => n + l.length, 0);
  const [, mods] = [...byTrack.entries()].sort((a, b) => size(b[1]) - size(a[1]) || (a[0] < b[0] ? -1 : 1))[0];
  // Biggest module first, so alternation lasts as long as possible.
  const queues = [...mods.entries()].sort((a, b) => b[1].length - a[1].length || (a[0] < b[0] ? -1 : 1)).map(([, l]) => shuffle(l, rng));
  const out = [];
  while (out.length < max && queues.some((q) => q.length)) {
    for (const q of queues) if (q.length && out.length < max) out.push(q.shift());
  }
  return [...out, ...lapsed];
}

// Owned questions come back once a week: the one waiting longest. lastWeek is
// the ISO week of the last maintenance question for this subject.
export function maintenanceQuestion(reviews, today, subject, lang, lastWeek) {
  if (lastWeek === isoWeekKey(toDate(today))) return null;
  const owned = Object.entries(reviews || {})
    .filter(([key, r]) => key.startsWith(`${lang}|`) && r && r.subject === subject && r.box >= OWNED_BOX)
    .sort(([ka, a], [kb, b]) => (a.due < b.due ? -1 : a.due > b.due ? 1 : ka < kb ? -1 : 1));
  return owned.length ? idOf(owned[0][0]) : null;
}

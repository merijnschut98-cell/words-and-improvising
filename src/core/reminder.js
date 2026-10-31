// Daily reminder text. Shared by the app and the service worker. Pure.
import { isStreakAlive } from './progress.js';

const TEXT = {
  en: {
    streak: (n) => `🔥 Keep your ${n}-day streak alive`,
    nudge: 'Time to talk 💬',
    body: 'One 5-minute lesson keeps the words flowing.',
  },
  nl: {
    streak: (n) => `🔥 Houd je reeks van ${n} dagen vast`,
    nudge: 'Tijd om te praten 💬',
    body: 'Eén les van 5 minuten houdt de woorden soepel.',
  },
};

export function reminderFor({ lastDay, streak }, today, lang) {
  if (lastDay === today) return null;
  const t = TEXT[lang] || TEXT.en;
  const atRisk = streak > 0 && isStreakAlive({ count: streak, lastDay }, today);
  return { title: atRisk ? t.streak(streak) : t.nudge, body: t.body };
}

function nextDay(day) {
  const [y, m, d] = day.split('-').map(Number);
  const n = new Date(Date.UTC(y, m - 1, d + 1));
  return n.toISOString().slice(0, 10);
}

// What the (classic, non-module) service worker needs: it only compares dates
// and picks one of these two precomputed messages.
export function reminderMeta(state) {
  const { lang, remind } = state.settings;
  const { lastDay, count } = state.streak;
  const plan = state.plan || {};
  const cue = planCueText(plan.cue, lang);
  const withCue = (m) => (m && cue ? { ...m, body: `${cue}: ${m.body}` } : m);
  return {
    remind: !!remind,
    lastDay,
    hour: Number.isInteger(plan.hour) ? plan.hour : null,
    atRisk: withCue(lastDay && count > 0 ? reminderFor({ lastDay, streak: count }, nextDay(lastDay), lang) : null),
    nudge: withCue(reminderFor({ lastDay: null, streak: 0 }, '', lang)),
  };
}

export const PLAN_CUES = ['coffee', 'commute', 'lunch', 'dinner', 'bed'];
const CUE_TEXT = {
  en: { coffee: 'After your morning coffee', commute: 'On your commute', lunch: 'After lunch', dinner: 'Before dinner', bed: 'Before bed' },
  nl: { coffee: 'Na je ochtendkoffie', commute: 'Onderweg naar je werk', lunch: 'Na de lunch', dinner: 'Voor het avondeten', bed: 'Voor het slapengaan' },
};

// Preset cue -> phrase; custom text is used as is.
export function planCueText(cue, lang) {
  if (!cue) return '';
  return (CUE_TEXT[lang] || CUE_TEXT.en)[cue] || cue;
}

// Only nudge near the planned time (periodic sync can't be scheduled exactly).
// Keep in sync with the copy in sw.js (classic worker, no imports).
export function shouldFireReminder(meta, now) {
  if (meta.hour == null) return true;
  const h = now.getHours() + now.getMinutes() / 60;
  const d = Math.abs(h - meta.hour);
  return Math.min(d, 24 - d) <= 3;
}

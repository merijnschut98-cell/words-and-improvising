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
  return {
    remind: !!remind,
    lastDay,
    atRisk: lastDay && count > 0 ? reminderFor({ lastDay, streak: count }, nextDay(lastDay), lang) : null,
    nudge: reminderFor({ lastDay: null, streak: 0 }, '', lang),
  };
}

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

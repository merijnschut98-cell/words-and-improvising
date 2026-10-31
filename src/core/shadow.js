// Shadowing: he repeats the coach's stronger version from memory. How much of
// the model's content did he get back? Pure.
import { tokenize, FILLERS } from './metrics.js';

function contentWords(text, lang) {
  const fillers = new Set((FILLERS[lang] || FILLERS.en).filter((f) => !f.includes(' ')));
  return new Set(tokenize(text).filter((w) => w.length >= 4 && !fillers.has(w)));
}

// Share (0..1, two decimals) of the model's content words that he said.
export function modelOverlap(model, transcript, lang) {
  const want = contentWords(model, lang);
  if (!want.size) return 0;
  const said = new Set(tokenize(transcript));
  let hit = 0;
  for (const w of want) if (said.has(w)) hit += 1;
  return Math.round((hit / want.size) * 100) / 100;
}

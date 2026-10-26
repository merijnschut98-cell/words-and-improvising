// Sharing without a backend: challenge links that rebuild the same prompt
// on any device, and a PNG share card drawn on a canvas.
import { DRILLS } from './progress.js';
import { makePrompt, seededRng } from './lesson.js';

const VALID_DRILLS = [...DRILLS, 'boss'];
const LANGS = ['en', 'nl'];
const ID_RE = /^[A-Za-z]+:[A-Za-z0-9]+$/;
// Prompt id prefix -> content pool.
const POOLS = {
  topic: 'topics', concept: 'concepts', opinion: 'opinions', scenario: 'scenarios', rapid: 'rapid',
  story: 'storyStarts', yesAnd: 'yesAnd', listen: 'listen', expert: 'experts',
};

export function challengeLink(prompt, lang, base) {
  const url = new URL(base);
  url.search = '';
  url.hash = '';
  url.searchParams.set('c', `${prompt.drill}.${prompt.id}.${lang}`);
  return url.toString();
}

export function parseChallenge(search) {
  const raw = new URLSearchParams(search || '').get('c');
  if (!raw) return null;
  const parts = raw.split('.');
  if (parts.length !== 3) return null;
  const [drill, promptId, lang] = parts;
  if (!VALID_DRILLS.includes(drill) || !LANGS.includes(lang) || !ID_RE.test(promptId)) return null;
  return { drill, promptId, lang };
}

function hash(s) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

// The same prompt for everyone who opens the link: the shared item is the
// only "unseen" one, and every random extra comes from a seed of its id.
export function challengePrompt({ drill, promptId }, content) {
  const [pool, itemId] = promptId.split(':');
  const items = content[POOLS[pool]];
  if (!items || !items.some((it) => it.id === itemId)) return null;
  const seen = Object.fromEntries(items.filter((it) => it.id !== itemId).map((it) => [`${pool}:${it.id}`, 1]));
  try {
    const p = makePrompt(drill, content, seededRng(hash(promptId)), seen);
    return p.id === promptId ? p : null;
  } catch {
    return null;
  }
}

// --- Browser-only helpers below (not used by tests) ---

function wrap(ctx, text, maxW) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > maxW && line) { lines.push(line); line = w; } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

// A 1080×1080 card: title, big stat rows, footer. Colours follow the theme.
export function drawShareCard({ title, rows, footer }) {
  const css = getComputedStyle(document.documentElement);
  const v = (name, fb) => css.getPropertyValue(name).trim() || fb;
  const c = document.createElement('canvas');
  c.width = 1080;
  c.height = 1080;
  const ctx = c.getContext('2d');
  ctx.fillStyle = v('--primary', '#ff6b3d');
  ctx.fillRect(0, 0, 1080, 1080);
  ctx.fillStyle = v('--card', '#ffffff');
  ctx.beginPath();
  ctx.roundRect(60, 60, 960, 960, 48);
  ctx.fill();
  const ink = v('--ink', '#1f2430');
  const font = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.fillStyle = ink;
  ctx.font = `800 64px ${font}`;
  let y = 180;
  for (const l of wrap(ctx, title, 840)) { ctx.fillText(l, 120, y); y += 76; }
  y += 30;
  for (const [label, value] of rows) {
    ctx.fillStyle = v('--accent', '#13b5a6');
    ctx.font = `800 88px ${font}`;
    ctx.fillText(String(value), 120, y + 70);
    ctx.fillStyle = v('--muted', '#6b7280');
    ctx.font = `600 38px ${font}`;
    for (const l of wrap(ctx, label, 840)) { ctx.fillText(l, 120, y + 120); y += 46; }
    y += 140;
    if (y > 860) break;
  }
  ctx.fillStyle = ink;
  ctx.font = `700 36px ${font}`;
  ctx.fillText(footer, 120, 970);
  return new Promise((resolve) => { c.toBlob((b) => resolve(b), 'image/png'); });
}

// Share a file via the system sheet, else download it. Returns 'shared' | 'downloaded' | 'cancelled'.
export async function shareFile(blob, name, text) {
  const file = new File([blob], name, { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
      return 'shared';
    } catch {
      return 'cancelled';
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  return 'downloaded';
}

// Share text + link via the system sheet, else copy to clipboard. Returns 'shared' | 'copied' | 'cancelled' | 'failed'.
export async function shareText(text, url) {
  if (navigator.share) {
    try {
      await navigator.share({ text, url });
      return 'shared';
    } catch (e) {
      if (e && e.name === 'AbortError') return 'cancelled';
    }
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url}`);
    return 'copied';
  } catch {
    return 'failed';
  }
}

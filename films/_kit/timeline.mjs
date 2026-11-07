// Pure parts of the film player: caption markers, number formats, the speak
// variant, the timeline, beats, the narration hold and the page parameters.
// No imports and no DOM: the build inlines this file into every film page (with
// its `export` words stripped), and tests/film.test.js imports it as it is.

export const wordsOf = (text) => String(text || '').trim().split(/\s+/).filter(Boolean).length;

// A scene lasts at least (caption words / 2.5) + 2 s, so it can be read.
export const minSceneDur = (words) => words / 2.5 + 2;

// "De {t:Snijsnelheid} is {n:220} m/min" → text, term and number pieces.
// {t:Term|shown} names lesson term Term but shows "shown" (another form).
export function parseMarked(src) {
  const out = [];
  const re = /\{([a-z]):([^{}]*)\}/g;
  let last = 0;
  let m;
  const plain = (s) => {
    if (/[{}]/.test(s)) throw new Error(`bad marker in "${src}"`);
    if (s) out.push({ text: s });
  };
  while ((m = re.exec(src))) {
    plain(src.slice(last, m.index));
    if (m[1] === 't') {
      const [term, shown] = m[2].split('|');
      out.push({ term: term.trim(), shown: (shown ?? term).trim() });
    } else if (m[1] === 'n') out.push({ num: m[2].trim() });
    else throw new Error(`bad marker {${m[1]}:} in "${src}"`);
    last = re.lastIndex;
  }
  plain(src.slice(last));
  return out;
}

// "1167" → 1.167 (nl) or 1,167 (en); "0.3" → 0,3 or 0.3. Decimals as written.
export function formatNumber(raw, lang) {
  const s = String(raw);
  if (!/^-?\d+(\.\d+)?$/.test(s)) throw new Error(`not a plain number: ${s}`);
  const [int, dec] = s.split('.');
  const group = lang === 'en' ? ',' : '.';
  const point = lang === 'en' ? '.' : ',';
  const body = int.replace(/^-/, '');
  const grouped = body.length >= 4 ? body.replace(/\B(?=(\d{3})+(?!\d))/g, group) : body;
  return (int.startsWith('-') ? '-' : '') + grouped + (dec !== undefined ? point + dec : '');
}

// A resolved caption is a list of strings and term pieces {t, en?, c}. In Dutch
// a term carries its English word (en) on first use only.
export const plainOf = (seg) => seg.map((p) => (typeof p === 'string' ? p : p.t + (p.en ? ` (${p.en})` : ''))).join('');
// Units and signs a voice would spell out or skip, said as words. Longest first.
const SAY = {
  nl: [[/omw\/min/g, 'omwentelingen per minuut'], [/\bmm\/min\b/g, 'millimeter per minuut'], [/\bm\/min\b/g, 'meter per minuut'], [/µm\b/g, 'micrometer'], [/\brpm\b/g, 'omwentelingen per minuut'],
    [/Ø\s*/g, 'diameter '], [/\s×\s/g, ' maal '], [/\s\/\s/g, ' gedeeld door '], [/\s=\s/g, ' is '], [/°/g, ' graden'], [/\bRa\b/g, 'R a']],
  en: [[/\brpm\b/g, 'revolutions per minute'], [/\bmm\/min\b/g, 'millimetres per minute'], [/\bm\/min\b/g, 'metres per minute'], [/µm\b/g, 'micrometres'],
    [/Ø\s*/g, 'diameter '], [/\s×\s/g, ' times '], [/\s\/\s/g, ' divided by '], [/\s=\s/g, ' is '], [/°/g, ' degrees'], [/\bRa\b/g, 'R a']],
};
export const sayable = (text, lang) => (SAY[lang] || []).reduce((s, [re, w]) => s.replace(re, w), text);
// The words the voice says: no English gloss, and with a language, units as words.
export const speakOf = (seg, lang) => sayable(seg.map((p) => (typeof p === 'string' ? p : p.t)).join(''), lang).replace(/\s+/g, ' ').trim();

export function timelineOf(scenes) {
  const starts = [];
  let t = 0;
  for (const s of scenes) { starts.push(t); t += s.dur; }
  return { starts, total: t };
}

export function sceneIndexAt(t, tl) {
  let i = 0;
  for (let k = 0; k < tl.starts.length; k++) if (t >= tl.starts[k]) i = k;
  return i;
}

// ?scene=n is 1-based; anything odd opens the first scene.
export function clampScene(param, count) {
  const n = parseInt(param, 10);
  if (!Number.isFinite(n) || n < 1) return 0;
  return Math.min(count, n) - 1;
}

// Beat starts within a scene (seconds), by each beat's share of the words.
export function beatStarts(scene, lang) {
  const counts = scene.beats.map((b) => Math.max(1, wordsOf(b.text[lang] ?? b.text.nl)));
  const all = counts.reduce((a, b) => a + b, 0);
  const out = [];
  let acc = 0;
  for (const c of counts) { out.push(Math.round((acc / all) * scene.dur * 100) / 100); acc += c; }
  return out;
}

export function beatIndexAt(scene, lang, local) {
  const starts = beatStarts(scene, lang);
  let i = 0;
  for (let k = 0; k < starts.length; k++) if (local >= starts[k]) i = k;
  return i;
}

// While a beat is being spoken the clock may run up to the next beat, or to the
// end of the scene for the last beat, and then holds there.
export function holdLimit(tl, scenes, lang, sceneIndex, beatIndex) {
  const scene = scenes[sceneIndex];
  const starts = beatStarts(scene, lang);
  const local = beatIndex + 1 < starts.length ? starts[beatIndex + 1] : scene.dur;
  return tl.starts[sceneIndex] + local;
}

// The page's parameters: from its URL when opened on its own, else from the
// frame's name. The app hands the page over as srcdoc (a sandboxed frame's own
// navigation skips the service worker, so a src would be blank offline) and
// puts "?theme=…&lang=…" in the iframe's name attribute.
export const searchOf = (search, name) => (search && search.length > 1 ? search
  : typeof name === 'string' && name.charAt(0) === '?' ? name : '');

export function parseParams(search) {
  const q = new URLSearchParams(search || '');
  const theme = q.get('theme');
  const level = parseInt(q.get('level'), 10);
  return {
    theme: theme === 'light' || theme === 'dark' ? theme : null,
    lang: q.get('lang') === 'en' ? 'en' : 'nl',
    scene: q.get('scene'),
    reduce: q.get('motion') === 'reduce',
    muted: q.get('muted') === '1',
    level: [1, 2, 3, 4].includes(level) ? level : null,
  };
}

export function fmtClock(sec) {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// Calm ease-in-out, and the eased progress of u through [a, b].
export const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const span = (u, a, b) => ease(Math.min(1, Math.max(0, (u - a) / (b - a))));

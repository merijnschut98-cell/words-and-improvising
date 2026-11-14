// Film checks against the lessons, shared by the build (films/_kit/build-film.mjs)
// and the content test (tests/filmcontent.test.js). Pure apart from readFilmData,
// which only parses a string.
import { wordsOf, minSceneDur, plainOf } from './timeline.mjs';

export const MAX_BYTES = 450 * 1024; // hard cap per page (plan 2.8)
export const TARGET_BYTES = 300 * 1024;
export const MIN_TOTAL = 60;
// v14b: no longer capped at 150 s; Basis 3–5 min, higher levels 2–4 min.
export const MAX_TOTAL = 300;
// The narration's spoken length, estimated from its words (Piper voices speak
// about 2.5 words a second); the real length comes from the audio.
export const NARRATION_WPS = 2.5;
export const NARRATION_MIN = 60;
export const NARRATION_MAX = 330;
export const narrationWords = (data, lang) => (data.scenes || []).reduce((a, s) => a + (s.beats || []).reduce((n, b) => n + (b.voice ? wordsOf(b.voice[lang]) : 0), 0), 0);
// 3 lines of 16 px text in the film's frame inside a lesson card on a 390 px
// screen (about 320 px wide; measured: 117 characters ran to 4 lines)
export const MAX_CAPTION_CHARS = 110;

export function readFilmData(html) {
  const m = /<script type="application\/json" id="film-data">([\s\S]*?)<\/script>/.exec(html);
  if (!m) throw new Error('no film-data block');
  return JSON.parse(m[1]);
}

// Every Dutch text of a lesson where a number may stand: pre, teach, example and recall.
export function lessonTextOf(l) {
  const parts = [];
  for (const q of [...(l.pre || []), ...(l.recall || [])]) parts.push(q.q, q.why, ...(q.options || []), q.answer ?? '', 'number' in q ? String(q.number) : '');
  parts.push(...(l.teach || []), l.example?.text, l.example?.ask, l.example?.reveal);
  return parts.filter(Boolean).join('\n');
}

// v17, a module intro film: the module's own text (title, blurb, topic titles)
// and then all of its lessons' texts, in one language. An intro film's numbers
// must stand in the Dutch one.
export function moduleMetaTextOf(meta, lang = 'nl') {
  return [meta.title?.[lang], meta.blurb?.[lang], ...(meta.topics || []).map((t) => t.title?.[lang])].filter(Boolean).join('\n');
}
export function moduleTextOf(meta, lessons, lang = 'nl') {
  return [moduleMetaTextOf(meta, lang), ...(meta.lessons || []).map((id) => lessons[lang].get(id)).filter(Boolean).map(lessonTextOf)].join('\n');
}

// "1.167" stands in the text as a number of its own, not inside 21.167 or 1.1675.
export function hasNumber(text, value) {
  const esc = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![\\d.,])${esc}(?![\\d]|[.,]\\d)`).test(text);
}

const lc = (s) => String(s).toLowerCase();
const wholeWord = (text, word) => new RegExp(`(?<![\\p{L}\\d-])${lc(word).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\d-])`, 'u').test(lc(text));

// data: the film JSON. lessons: { nl: Map, en: Map } of lesson objects by id.
// levelOf(lessonId) → 1–4. wiredBy: the lesson ids that wire this film.
// A module intro film (v17, data.module) also needs module, the module's index
// entry, and stageText, the stage's drawing and script (where a card's words
// stand); it is held to the module's text and its map instead of to per-term
// coverage (checkIntro below).
export function checkFilm(data, { lessons, levelOf, wiredBy = [], module: meta, stageText = '' }) {
  const errs = [];
  const served = new Set(data.lessons || []);
  const intro = data.module !== undefined;
  const mod = intro && meta && meta.id === data.module ? meta : null;
  if (intro && !mod) errs.push(`intro film of ${data.module}: module ${data.module} not given`);
  for (const id of served) if (!lessons.nl.has(id) || !lessons.en.has(id)) errs.push(`served lesson ${id} does not exist`);
  if (mod) for (const id of served) if (!(mod.lessons || []).includes(id)) errs.push(`served lesson ${id} is no longer in module ${mod.id}`);
  for (const id of wiredBy) if (!served.has(id)) errs.push(`${id} wires the film but is not in its lessons`);
  const scenes = data.scenes || [];
  if (scenes.length < 4 || scenes.length > 9) errs.push(`needs 4–9 scenes, has ${scenes.length}`);

  // terms: still the lesson's term at that position, in both languages
  const covered = new Map(); // "lesson#index" → lowest scene level with a cue
  for (const s of scenes) {
    for (const t of s.terms || []) {
      const l = lessons.nl.get(t.lesson);
      const e = lessons.en.get(t.lesson);
      if (!served.has(t.lesson)) errs.push(`scene ${s.id}: term ${t.nl} from ${t.lesson}, which the film does not serve`);
      if (!l || !e) continue;
      const tn = (l.terms || [])[t.index];
      const te = (e.terms || [])[t.index];
      if (!tn || tn.term !== t.nl) errs.push(`scene ${s.id}: term "${t.nl}" is no longer term ${t.index} of ${t.lesson} (now "${tn && tn.term}")`);
      if (!te || te.term !== t.en) errs.push(`scene ${s.id}: English term "${t.en}" is no longer term ${t.index} of ${t.lesson} (now "${te && te.term}")`);
      if (!t.cue) errs.push(`scene ${s.id}: term ${t.nl} has no visual cue`);
      const key = `${t.lesson}#${t.index}`;
      if (t.cue && (!covered.has(key) || covered.get(key) > s.level)) covered.set(key, s.level);
    }
  }

  // coverage: each term of each served lesson is shown at or below its level, or
  // skipped with a reason (an intro film: every topic of its module, below)
  if (mod) errs.push(...checkIntro(data, mod));
  // module and field films: the narration guard, and the drawn labels fit
  if (intro || data.field !== undefined) errs.push(...checkNarration(data));
  if (intro) errs.push(...checkLabels(data, stageText));
  if (!intro) for (const id of served) {
    const l = lessons.nl.get(id);
    if (!l) continue;
    const level = levelOf(id);
    (l.terms || []).forEach((x, i) => {
      const at = covered.get(`${id}#${i}`);
      if (at !== undefined && at <= level) return;
      const skip = (data.skip || []).find((k) => k.lesson === id && k.term === x.term);
      if (skip && String(skip.reason || '').trim()) return;
      errs.push(`coverage: term "${x.term}" of ${id} (level ${level}) is in no scene at or below level ${level} and not skipped`);
    });
  }

  // numbers: still in the Dutch lesson text (an intro film: anywhere in its module's Dutch text)
  const modText = mod ? moduleTextOf(mod, lessons, 'nl') : '';
  for (const n of data.numbers || []) {
    if (intro) {
      if (mod && !hasNumber(modText, n.value)) errs.push(`number ${n.value} (scene ${n.scene}) no longer in the text of module ${mod.id}`);
      continue;
    }
    const l = lessons.nl.get(n.lesson);
    if (!l) { errs.push(`number ${n.value}: lesson ${n.lesson} missing`); continue; }
    if (!hasNumber(lessonTextOf(l), n.value)) errs.push(`number ${n.value} (scene ${n.scene}) no longer in ${n.lesson}`);
  }

  // language: English never shows a Dutch term; Dutch names the English word on first use only
  const dutch = scenes.flatMap((s) => s.terms || []).filter((t) => lc(t.nl) !== lc(t.en)).map((t) => t.nl);
  const glossed = new Map();
  for (const s of scenes) {
    for (const b of s.beats || []) {
      const en = [b.text.en, b.read ? b.read.en : ''].join(' ');
      for (const w of dutch) if (wholeWord(en, w)) errs.push(`scene ${s.id}: Dutch term "${w}" in the English caption`);
      for (const p of b.seg.nl) if (typeof p !== 'string' && p.en) glossed.set(p.k, (glossed.get(p.k) || 0) + 1);
      for (const p of b.seg.en) if (typeof p !== 'string' && p.en) errs.push(`scene ${s.id}: English caption carries a gloss`);
      for (const lang of ['nl', 'en']) {
        if (plainOf(b.seg[lang]) !== b.text[lang]) errs.push(`scene ${s.id}: ${lang} text and segments differ`);
        if (b.text[lang].length > MAX_CAPTION_CHARS) errs.push(`scene ${s.id}: ${lang} caption has ${b.text[lang].length} characters (max ${MAX_CAPTION_CHARS})`);
      }
    }
  }
  for (const [k, n] of glossed) if (n !== 1) errs.push(`term ${k} carries its English word ${n} times in Dutch`);

  // narration (v14b): every beat or none has a script in both languages; its
  // terms are still the lessons' terms, English narration never says a Dutch
  // term, Dutch glosses a term once, and the spoken length is sensible
  const beats = scenes.flatMap((s) => (s.beats || []).map((b) => ({ s, b })));
  const narrated = beats.filter(({ b }) => b.say);
  if (narrated.length && narrated.length !== beats.length) errs.push(`narration: ${beats.length - narrated.length} beats have no script`);
  const sayDutch = new Set(dutch);
  const sayGloss = new Map();
  for (const { s, b } of narrated) {
    for (const lang of ['nl', 'en']) {
      if (!Array.isArray(b.say[lang]) || !b.voice || typeof b.voice[lang] !== 'string' || !b.voice[lang].trim()) { errs.push(`scene ${s.id}: narration ${lang} missing`); continue; }
      for (const p of b.say[lang]) {
        if (typeof p === 'string') continue;
        const [lid, ix] = String(p.k).split('#');
        const tn = ((lessons.nl.get(lid) || {}).terms || [])[Number(ix)];
        const te = ((lessons.en.get(lid) || {}).terms || [])[Number(ix)];
        if (!served.has(lid) || !tn || !te) { errs.push(`scene ${s.id}: narration term ${p.t} (${p.k}) is no longer a term of a served lesson`); continue; }
        if (lc(tn.term) !== lc(te.term)) sayDutch.add(tn.term);
        const named = lang === 'nl' ? tn.term : te.term;
        if (!lc(p.t).includes(lc(named).split(' ')[0].slice(0, 4))) errs.push(`scene ${s.id}: narration term "${p.t}" no longer reads as "${named}" (${p.k})`);
        if (lang === 'en' && p.en) errs.push(`scene ${s.id}: English narration carries a gloss`);
        if (lang === 'nl' && p.en) sayGloss.set(p.k, (sayGloss.get(p.k) || 0) + 1);
      }
    }
  }
  for (const { s, b } of narrated) {
    if (!Array.isArray(b.say.en)) continue;
    const en = [plainOf(b.say.en), b.voice.en].join(' ');
    for (const w of sayDutch) if (wholeWord(en, w)) errs.push(`scene ${s.id}: Dutch term "${w}" in the English narration`);
  }
  for (const [k, n] of sayGloss) if (n !== 1) errs.push(`term ${k} carries its English word ${n} times in the Dutch narration`);
  if (narrated.length) {
    for (const lang of ['nl', 'en']) {
      const sec = narrationWords(data, lang) / NARRATION_WPS;
      if (sec < NARRATION_MIN || sec > NARRATION_MAX) errs.push(`narration ${lang} would take about ${Math.round(sec)} s, must be ${NARRATION_MIN}–${NARRATION_MAX}`);
    }
  }
  for (const t of scenes.flatMap((s) => s.terms || [])) {
    const k = `${t.lesson}#${t.index}`;
    if (lc(t.nl) !== lc(t.en) && !glossed.has(k)) errs.push(`term ${t.nl}: the Dutch caption never names its English word`);
  }

  // length: each scene can be read; the film is 60–150 s
  let total = 0;
  for (const s of scenes) {
    total += s.dur;
    for (const lang of ['nl', 'en']) {
      const w = wordsOf(s.beats.map((b) => b.text[lang]).join(' '));
      if (s.dur + 1e-9 < minSceneDur(w)) errs.push(`scene ${s.id}: ${s.dur} s is too short for ${w} words (${lang}, needs ${minSceneDur(w).toFixed(1)})`);
    }
    if (!(s.still >= 0 && s.still <= 1)) errs.push(`scene ${s.id}: still must be in 0..1`);
    // a beat may carry its own still, so a reduced-motion viewer sees what that beat names
    s.beats.forEach((b, i) => { if (b.still !== undefined && !(b.still >= 0 && b.still <= 1)) errs.push(`scene ${s.id} beat ${i + 1}: still must be in 0..1`); });
    if (![1, 2, 3, 4].includes(s.level)) errs.push(`scene ${s.id}: level must be 1–4`);
  }
  if (total < MIN_TOTAL || total > MAX_TOTAL) errs.push(`film is ${total} s, must be ${MIN_TOTAL}–${MAX_TOTAL}`);
  return errs;
}

// The map of a module intro film (v17): every topic of the module is on it
// (data.topics, with the title it had at build time, the scene that explains it
// and the cue key of its part), still under that title, named in a caption of
// its OWN scene in both languages, explained in at least two beats, and shown:
// a beat of its scene lights its part. Captions only: the stage draws a topic's
// title from the page data at runtime, so a card never counted as a name.
export const MIN_TOPIC_BEATS = 2;
export function checkIntro(data, mod) {
  const errs = [];
  const scenes = data.scenes || [];
  const onMap = new Map((data.topics || []).map((t) => [t.id, t]));
  for (const t of mod.topics || []) {
    const ft = onMap.get(t.id);
    if (!ft) { errs.push(`topic ${t.id} of ${mod.id} is not on the film's map`); continue; }
    const sc = scenes.find((s) => s.id === ft.scene);
    for (const lang of ['nl', 'en']) {
      if ((ft.title || {})[lang] !== t.title[lang]) errs.push(`topic ${t.id}: title "${(ft.title || {})[lang]}" (${lang}) is now "${t.title[lang]}"`);
      const name = lc(t.title[lang]);
      if (sc && !(sc.beats || []).some((b) => lc(b.text[lang]).includes(name))) errs.push(`topic ${t.id}: "${t.title[lang]}" (${lang}) is in no caption of its scene ${ft.scene}`);
    }
    if (!sc) errs.push(`topic ${t.id}: no scene ${ft.scene}`);
    else {
      if (sc.beats.length < MIN_TOPIC_BEATS) errs.push(`topic ${t.id}: scene ${ft.scene} has ${sc.beats.length} beat${sc.beats.length === 1 ? '' : 's'}, needs at least ${MIN_TOPIC_BEATS}`);
      if (!ft.cue || !sc.beats.some((b) => [...(b.focus || []), ...(b.cues || [])].includes(ft.cue))) errs.push(`topic ${t.id}: no beat of scene ${ft.scene} lights its part ${ft.cue}`);
    }
  }
  for (const ft of data.topics || []) if (!(mod.topics || []).some((t) => t.id === ft.id)) errs.push(`topic ${ft.id} is no topic of ${mod.id}`);
  return errs;
}

// The narration guard (v17), for every module or field film: what the voice
// says has no symbol it would read aloud, no colon, nothing in parentheses or
// quotes, none of the Dutch words the voice misreads, and at most two commas in
// a sentence (the render guard caps a pause inside a sentence at 0.4 s). Reads
// the narration script (beat.say) in both languages.
export const NARRATION_SYMBOLS = /[/&×=+()“”"‘<>≈→~:;%]/;
export const NL_MISREAD = /\b(deliverable|definition of done|PMI|deadline)\b/i;
export const MAX_COMMAS = 2;
export function checkNarration(data) {
  const errs = [];
  for (const s of data.scenes || []) {
    (s.beats || []).forEach((b, i) => {
      if (!b.say) return;
      for (const lang of ['nl', 'en']) {
        // the English gloss of a Dutch term is shown, never spoken
        const plain = (b.say[lang] || []).map((p) => (typeof p === 'string' ? p : p.t)).join('');
        const where = `scene ${s.id} beat ${i + 1}`;
        if (NARRATION_SYMBOLS.test(plain)) errs.push(`narration: a symbol the voice reads aloud, or a colon, in "${plain.slice(0, 50)}" (${where}, ${lang})`);
        if (lang === 'nl' && NL_MISREAD.test(plain)) errs.push(`narration: a word the Dutch voice misreads in "${plain.slice(0, 50)}" (${where})`);
        for (const sentence of plain.split(/[.?!]\s+/)) if ((sentence.match(/,/g) || []).length > MAX_COMMAS) errs.push(`narration: more than two commas in "${sentence.slice(0, 50)}" (${where}, ${lang})`);
      }
    });
  }
  return errs;
}

// Drawn panel labels (v17). Stage text is 22 units; a character of it is about
// 10.5 units wide (measured on the pilot), so a box of w units fits
// floor(w / 10.5) characters. The panel is 284 units wide inside its margins.
// A topic title drawn in a tile is cut into lines of at most 12 characters (a
// 140-unit tile) and a tile holds 3 lines. Every tr('nl', 'en') label of the
// stage script is measured in both languages against the panel, or against the
// width named as its third argument: tr('Vloer klaar', 'Floor ready', 178).
export const LABEL_UNITS = 22;
export const CHAR_UNITS = 10.5;
export const PANEL_UNITS = 284;
export const TILE_CHARS = 12;
export const TILE_LINES = 3;
export const fitChars = (units) => Math.floor(units / CHAR_UNITS);
export function wrapLabel(text, n) {
  const out = [];
  let cur = '';
  for (const word of String(text).split(' ')) {
    if (cur && (cur + ' ' + word).length > n) { out.push(cur); cur = word; } else cur = cur ? `${cur} ${word}` : word;
  }
  if (cur) out.push(cur);
  return out;
}
export function checkLabels(data, stageText = '') {
  const errs = [];
  for (const t of data.topics || []) {
    for (const lang of ['nl', 'en']) {
      const title = (t.title || {})[lang] || '';
      const longest = Math.max(0, ...title.split(' ').map((w) => w.length));
      if (longest > TILE_CHARS) errs.push(`topic ${t.id}: "${title}" (${lang}) has a word of ${longest} characters, a tile fits ${TILE_CHARS}`);
      else {
        const lines = wrapLabel(title, TILE_CHARS).length;
        if (lines > TILE_LINES) errs.push(`topic ${t.id}: "${title}" (${lang}) wraps to ${lines} lines at ${TILE_CHARS} characters, a tile fits ${TILE_LINES}`);
      }
    }
  }
  const pairs = String(stageText).matchAll(/\btr\(\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*(?:,\s*(\d+)\s*)?\)/g);
  for (const [, nl, en, width] of pairs) {
    const units = width ? Number(width) : PANEL_UNITS;
    const room = fitChars(units);
    for (const [lang, text] of [['nl', nl], ['en', en]]) {
      if (text.length > room) errs.push(`label "${text}" (${lang}) is ${text.length} characters, ${width ? `${units} units fit ${room}` : `the panel fits ${room}`}`);
    }
  }
  return errs;
}

// The cue keys a stage offers: the data-cue groups of its drawing, and those its
// script draws per frame (data-cue="key" or cue('key', ...) written out).
export function cueKeysOf(src) {
  const text = String(src);
  return new Set([...text.matchAll(/data-cue="([^"$]+)"/g), ...text.matchAll(/\bcue\(\s*['"]([^'"]+)['"]/g)].map((m) => m[1]));
}

// Focus (v16): every beat lights the part(s) it explains, or says focus: null
// (an overview). For older films a beat whose cues light a part counts; the
// rest are counted as warnings (missing), as are cue keys that name no part of
// the drawing (unknown). A film with strictFocus must give every beat a focus
// field and name only real parts: then both are errors.
export function checkFocus(data, keys) {
  const out = { errors: [], missing: [], unknown: [] };
  const strict = !!data.strictFocus;
  for (const s of data.scenes || []) {
    (s.beats || []).forEach((b, i) => {
      const where = `${s.id} beat ${i + 1}`;
      const declared = 'focus' in b;
      if (!(declared || (!strict && (b.cues || []).length))) {
        out.missing.push(where);
        if (strict) out.errors.push(`${where}: no focus`);
      }
      for (const k of b.cues || []) {
        if (keys.has(k)) continue;
        out.unknown.push(`${where}: ${k}`);
        if (strict) out.errors.push(`${where}: focus "${k}" is no part of the drawing`);
      }
    });
  }
  return out;
}

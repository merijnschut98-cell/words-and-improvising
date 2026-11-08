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

// "1.167" stands in the text as a number of its own, not inside 21.167 or 1.1675.
export function hasNumber(text, value) {
  const esc = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![\\d.,])${esc}(?![\\d]|[.,]\\d)`).test(text);
}

const lc = (s) => String(s).toLowerCase();
const wholeWord = (text, word) => new RegExp(`(?<![\\p{L}\\d-])${lc(word).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\d-])`, 'u').test(lc(text));

// data: the film JSON. lessons: { nl: Map, en: Map } of lesson objects by id.
// levelOf(lessonId) → 1–4. wiredBy: the lesson ids that wire this film.
export function checkFilm(data, { lessons, levelOf, wiredBy = [] }) {
  const errs = [];
  const served = new Set(data.lessons || []);
  for (const id of served) if (!lessons.nl.has(id) || !lessons.en.has(id)) errs.push(`served lesson ${id} does not exist`);
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

  // coverage: each term of each served lesson is shown at or below its level, or skipped with a reason
  for (const id of served) {
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

  // numbers: still in the Dutch lesson text
  for (const n of data.numbers || []) {
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

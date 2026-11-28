// Film checks against the lessons, shared by the build (films/_kit/build-film.mjs)
// and the content test (tests/filmcontent.test.js). Pure apart from readFilmData,
// which only parses a string.
import { wordsOf, minSceneDur, plainOf } from './timeline.mjs';

export const MAX_BYTES = 450 * 1024; // hard cap per page (plan 2.8)
export const TARGET_BYTES = 300 * 1024;
// Task 4a (Merijn, 14 Nov): a film is as long as its content needs; 25 s, 2 scenes
// and 25 s of narration (about 60 words) are enough.
export const MIN_TOTAL = 25;
export const MIN_SCENES = 2;
// Task 17, step K (Merijn, D1): one extra scene per lesson with gaps, up to 12 scenes (was 9).
export const MAX_SCENES = 12;
// Task 17, step K: the designed length (MAX_TOTAL) and the narration
// (NARRATION_MAX) may reach the 360 s a rendered video may last per language
// (tests/filmvideo.test.js); were 300 and 330 s, set for the old "3 to 5
// minutes" rule. A film is still as long as its content needs: caps, not targets.
// Ten pm lesson films size their scenes against the old 300 s; they keep it as
// their own SIZE_TOTAL, so their pages did not change.
export const MAX_TOTAL = 360;
// The narration's spoken length, estimated from its words (Piper voices speak
// about 2.5 words a second); the real length comes from the audio.
export const NARRATION_WPS = 2.5;
export const NARRATION_MIN = 25;
export const NARRATION_MAX = 360;
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
// v17, a field film: the field's own title and blurb, then each of its modules'
// text (mods: the field's modules, index entries). Its numbers must stand in the Dutch one.
export function fieldTextOf(field, mods, lessons, lang = 'nl') {
  return [moduleMetaTextOf(field, lang), ...mods.map((m) => moduleTextOf(m, lessons, lang))].join('\n');
}

// The cue key of a lit place of the shared map (films/_kit/mapscene.mjs): pm.plan gives "map-plan".
export const mapCue = (moduleId) => `map-${String(moduleId).split('.').pop().replace(/[^a-z0-9]/g, '')}`;

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
// A field film (v17, data.field) needs field, the field's index entry (FIELDS),
// modules, the index's modules, and stageText: it is held to the field's road
// (checkStations below) and its source text is the field's and its modules'.
export function checkFilm(data, { lessons, levelOf, wiredBy = [], module: meta, field: fieldMeta, modules = [], stageText = '' }) {
  const errs = [];
  const served = new Set(data.lessons || []);
  const intro = data.module !== undefined;
  const mod = intro && meta && meta.id === data.module ? meta : null;
  if (intro && !mod) errs.push(`intro film of ${data.module}: module ${data.module} not given`);
  const fieldFilm = data.field !== undefined;
  const fld = fieldFilm && fieldMeta && fieldMeta.id === data.field ? fieldMeta : null;
  if (fieldFilm && !fld) errs.push(`field film of ${data.field}: field ${data.field} not given`);
  const fieldMods = fld ? (fld.modules || []).map((id) => modules.find((m) => m.id === id)).filter(Boolean) : [];
  for (const id of served) if (!lessons.nl.has(id) || !lessons.en.has(id)) errs.push(`served lesson ${id} does not exist`);
  if (mod) for (const id of served) if (!(mod.lessons || []).includes(id)) errs.push(`served lesson ${id} is no longer in module ${mod.id}`);
  if (fld) for (const id of served) if (!fieldMods.some((m) => (m.lessons || []).includes(id))) errs.push(`served lesson ${id} is no longer in a module of ${fld.id}`);
  for (const id of wiredBy) if (!served.has(id)) errs.push(`${id} wires the film but is not in its lessons`);
  const scenes = data.scenes || [];
  if (scenes.length < MIN_SCENES || scenes.length > MAX_SCENES) errs.push(`needs ${MIN_SCENES}–${MAX_SCENES} scenes, has ${scenes.length}`);

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
  if (fld) errs.push(...checkStations(data, fld, modules, stageText));
  // module and field films: the narration guard, and the drawn labels fit
  if (intro || fieldFilm) errs.push(...checkNarration(data));
  if (intro || fieldFilm) errs.push(...checkLabels(data, stageText));
  // Task 17, lesson films: every lesson point of a wired lesson is claimed by a
  // beat (a page with points; tests/fixtures/points-pending.json lists the rest),
  // and what a builder adds to a legacy film is held to the new-film rules
  if (intro || fieldFilm) {
    if (data.points !== undefined || data.reading !== undefined) errs.push('points: a module or field film carries no lesson points');
    if (data.checkScope !== undefined) errs.push('checkScope: only for a lesson film; a module or field film is checked whole');
  } else {
    if (data.points !== undefined || data.reading !== undefined) errs.push(...checkPoints(data, { lessons, wiredBy }));
    if (data.checkScope !== undefined) errs.push(...checkScope(data, stageText));
  }
  if (!intro && !fieldFilm) for (const id of served) {
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
  const fieldText = fld ? fieldTextOf(fld, fieldMods, lessons, 'nl') : '';
  for (const n of data.numbers || []) {
    if (intro) {
      if (mod && !hasNumber(modText, n.value)) errs.push(`number ${n.value} (scene ${n.scene}) no longer in the text of module ${mod.id}`);
      continue;
    }
    if (fieldFilm) {
      if (fld && !hasNumber(fieldText, n.value)) errs.push(`number ${n.value} (scene ${n.scene}) no longer in the text of field ${fld.id}`);
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

  // length: each scene can be read; the film is MIN_TOTAL–MAX_TOTAL s
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

// The road of a field film (v17): every module of the field is a station on it
// (data.stations, with the title it had at build time, the scene that explains
// it and the cue key of its part), in the order of the field, still under that
// title, named (a whole word) in a caption of its OWN scene in both languages,
// explained in at least two beats and shown: a beat of its scene lights its part.
// The scenes follow the road. And the film ends on the shared map: the drawing
// (stageText) lights exactly the field's places (mapScene's is-lit cue groups)
// and the last scene's beats light every one of them.
export const MIN_STATION_BEATS = 2;
// a station label's words are words of the title, in their order (case and punctuation aside)
const wordsIn = (t) => lc(String(t || '')).split(/[^\p{L}\d]+/u).filter(Boolean);
function shortens(label, title) {
  const want = wordsIn(label);
  let i = 0;
  for (const wd of wordsIn(title)) if (i < want.length && wd === want[i]) i++;
  return want.length > 0 && i === want.length;
}
export function checkStations(data, field, modules = [], stageText = '') {
  const errs = [];
  const scenes = data.scenes || [];
  const onRoad = new Map((data.stations || []).map((t) => [t.id, t]));
  const word = (text, name) => new RegExp(`(?<![\\p{L}\\d])${lc(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\d])`, 'u').test(lc(text));
  for (const id of field.modules || []) {
    const st = onRoad.get(id);
    if (!st) { errs.push(`module ${id} of ${field.id} is not on the film's road`); continue; }
    const m = modules.find((x) => x.id === id);
    const sc = scenes.find((s) => s.id === st.scene);
    for (const lang of ['nl', 'en']) {
      const was = (st.title || {})[lang];
      if (m && was !== m.title[lang]) errs.push(`station ${id}: title "${was}" (${lang}) is now "${m.title[lang]}"`);
      // a station with a label is named by the label (a shorter name for the road), else by its title
      const named = (st.label && st.label[lang]) || was;
      // a label only shortens the module's own title (its words, in their order), so it cannot name another module
      if (st.label && m && !shortens(st.label[lang], m.title[lang])) errs.push(`station ${id}: the label "${st.label[lang]}" (${lang}) is no shortening of the title "${m.title[lang]}"; keep words of the title, in their order`);
      if (sc && named && !(sc.beats || []).some((b) => word(b.text[lang], named))) errs.push(`station ${id}: "${named}" (${lang}) is in no caption of its scene ${st.scene}`);
    }
    if (!sc) { errs.push(`station ${id}: no scene ${st.scene}`); continue; }
    if (sc.beats.length < MIN_STATION_BEATS) errs.push(`station ${id}: scene ${st.scene} has ${sc.beats.length} beat${sc.beats.length === 1 ? '' : 's'}, needs at least ${MIN_STATION_BEATS}`);
    if (!st.cue || !sc.beats.some((b) => [...(b.focus || []), ...(b.cues || [])].includes(st.cue))) errs.push(`station ${id}: no beat of scene ${st.scene} lights its part ${st.cue}`);
  }
  for (const st of data.stations || []) if (!(field.modules || []).includes(st.id)) errs.push(`station ${st.id} is no longer a module of ${field.id}`);
  // the order of the road: each station's scene after the one before it
  const at = (data.stations || []).filter((st) => (field.modules || []).includes(st.id)).map((st) => ({ st, i: scenes.findIndex((s) => s.id === st.scene) }));
  for (let k = 1; k < at.length; k++) if (at[k].i >= 0 && at[k - 1].i >= 0 && at[k].i <= at[k - 1].i) errs.push(`station ${at[k].st.id} (scene ${at[k].st.scene}) comes before ${at[k - 1].st.id} (scene ${at[k - 1].st.scene}); the stations follow the road`);
  // it ends on the map, with exactly the field's places lit
  const lit = [...String(stageText).matchAll(/class="map-place[^"]*\bis-lit\b[^"]*" data-module="([^"]+)" data-cue="([^"]+)"/g)].map((x) => ({ id: x[1], cue: x[2] }));
  for (const id of field.modules || []) if (!lit.some((p) => p.id === id && p.cue === mapCue(id))) errs.push(`the map does not light ${id}: end the film on mapScene({ subject, highlight: the field's modules })`);
  for (const p of lit) if (!(field.modules || []).includes(p.id)) errs.push(`the map lights ${p.id}, which is no module of ${field.id}`);
  const last = scenes[scenes.length - 1];
  const shown = new Set(last ? last.beats.flatMap((b) => [...(b.focus || []), ...(b.cues || [])]) : []);
  for (const id of field.modules || []) if (!shown.has(mapCue(id))) errs.push(`the last scene lights no map place ${mapCue(id)}; the film ends on the map with the field's places lit`);
  return errs;
}

// The narration guard (v17), for every module or field film: what the voice
// says has no symbol it would read aloud, no colon, nothing in parentheses or
// quotes, none of the Dutch words the voice misreads, and at most two commas in
// a sentence (the render guard caps a pause inside a sentence at 0.4 s). Reads
// the narration script (beat.say) in both languages.
export const NARRATION_SYMBOLS = /[/&×=+()“”"‘<>≈→~:;%]/;
export const NL_MISREAD = /\b(deliverables?|definitions? of done|PMI|deadlines?)\b/i;
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

// Drawn panel labels (v17). Stage text is 22 units. Widths come from CHAR_W:
// the film font (Inter, --fp-sans) measured per character at 22 units, the wider
// of weights 600 and 700, in Chromium (review of the pilot, 14 Nov). A sum of
// characters ignores kerning, so it comes out a few percent over the real text,
// never under; a character not in the table counts as UNKNOWN_W. The first rule
// (a flat 10.5 units a character) let "Schedule and" (146 units) into a
// 128-unit tile and "Werkkennis" (128) into a 112-unit column.
// The panel is 284 units wide inside its margins. A topic title drawn in a tile
// (140 units, 6 of padding each side: 128) is wrapped by width (wrapUnits) into
// at most 3 lines. Every tr('nl', 'en') label of the stage script is measured in
// both languages against the panel, or against the width named as its third
// argument: tr('Vloer klaar', 'Floor ready', 160). A stage that wraps text must
// wrap it with wrapUnits and CHAR_W (pass both into the page; wrapUnits is
// self-contained, so its source text works as is), so the check and the drawing agree.
export const LABEL_UNITS = 22;
export const CHAR_W = {"0":14.9,"1":9.5,"2":13.9,"3":14.2,"4":14.9,"5":14.1,"6":14.3,"7":13.2,"8":14.4,"9":14.3," ":6.0,"a":12.8,"b":13.9,"c":13,"d":13.9,"e":13.1,"f":8,"g":13.9,"h":13.7,"i":6,"j":6,"k":12.8,"l":6,"m":20.1,"n":13.7,"o":13.5,"p":13.9,"q":13.9,"r":9.1,"s":12.4,"t":7.4,"u":13.7,"v":13.2,"w":18.7,"x":12.8,"y":13.3,"z":12.6,"A":16.8,"B":14.6,"C":16.3,"D":15.9,"E":13.4,"F":13,"G":16.6,"H":16.5,"I":6.2,"J":12.9,"K":15.9,"L":12.5,"M":20.5,"N":16.8,"O":17,"P":14.3,"Q":17.1,"R":14.5,"S":14.4,"T":14.7,"U":16.2,"V":16.8,"W":23.3,"X":16.3,"Y":16.1,"Z":14.7,".":7.4,",":7.4,":":7.4,";":7.6,"!":7.5,"?":12.4,"'":7.5,"’":6.9,"‘":6.9,"-":10.3,"–":11,"/":8.6,"(":8.3,")":8.3,"&":14.8,"+":15,"%":22.4,"é":13.1,"ë":13.1,"è":13.1,"ê":13.1,"ï":6,"ö":13.5,"ü":13.7,"á":12.8,"à":12.8,"ç":13,"É":13.4,"…":22.1,"“":11.9,"”":11.7,"\"":12.2};
export const UNKNOWN_W = 14;
export const PANEL_UNITS = 284;
export const TILE_UNITS = 128;
export const TILE_LINES = 3;
// A field film's station title (the index's module title, v17) stands in a row of
// the road: wrapped by width (wrapUnits) into at most STATION_LINES lines of
// STATION_UNITS, from the stop's number to the panel's edge (x 380 to 616 in the
// reference film), and no word wider than that. The longest Projects titles need
// two lines ("Negotiating and / holding your ground"); the stage wraps them with
// the kit's own function, as the tiles do.
export const STATION_UNITS = 236;
export const STATION_LINES = 2;
export const textUnits = (text) => [...String(text)].reduce((a, c) => a + (CHAR_W[c] ?? UNKNOWN_W), 0);
// Greedy word wrap of text into lines at most max units wide; a word wider than
// max stands on a line of its own. cw: the width table (CHAR_W).
export function wrapUnits(text, max, cw) {
  const width = (s) => [...s].reduce((a, c) => a + (cw[c] === undefined ? 14 : cw[c]), 0);
  const out = [];
  let cur = '';
  for (const word of String(text).split(' ')) {
    if (cur && width(`${cur} ${word}`) > max) { out.push(cur); cur = word; } else cur = cur ? `${cur} ${word}` : word;
  }
  if (cur) out.push(cur);
  return out;
}
export function checkLabels(data, stageText = '') {
  const errs = [];
  // a film whose index titles do not fit a 128-unit tile draws wider tiles and declares them (spec.tileUnits, in the
  // page data): between the default and the panel's width less its padding, so every other film is unchanged
  let tileUnits = TILE_UNITS;
  if (data.tileUnits !== undefined) {
    if (!(Number.isFinite(data.tileUnits) && data.tileUnits >= TILE_UNITS && data.tileUnits <= PANEL_UNITS - 12)) errs.push(`tileUnits must be between ${TILE_UNITS} and ${PANEL_UNITS - 12}, not ${data.tileUnits}`);
    else tileUnits = data.tileUnits;
  }
  for (const t of data.topics || []) {
    for (const lang of ['nl', 'en']) {
      const title = (t.title || {})[lang] || '';
      const widest = Math.max(0, ...title.split(' ').map(textUnits));
      if (widest > tileUnits) errs.push(`topic ${t.id}: "${title}" (${lang}) has a word of ${Math.ceil(widest)} units, a tile is ${tileUnits}`);
      else {
        const lines = wrapUnits(title, tileUnits, CHAR_W).length;
        if (lines > TILE_LINES) errs.push(`topic ${t.id}: "${title}" (${lang}) wraps to ${lines} lines in a tile of ${tileUnits} units, a tile holds ${TILE_LINES}`);
      }
    }
  }
  for (const st of data.stations || []) {
    for (const lang of ['nl', 'en']) {
      const title = ((st.label && st.label[lang]) || (st.title || {})[lang]) || '';
      for (const word of title.split(' ')) if (textUnits(word) > STATION_UNITS) errs.push(`station ${st.id}: the word "${word}" (${lang}) is ${Math.ceil(textUnits(word))} units wide, a station on the road holds ${STATION_UNITS}`);
      const lines = wrapUnits(title, STATION_UNITS, CHAR_W).length;
      if (lines > STATION_LINES) errs.push(`station ${st.id}: "${title}" (${lang}) wraps to ${lines} lines, a station on the road holds ${STATION_LINES} lines of ${STATION_UNITS} units`);
    }
  }
  // a label in double quotes or backticks would escape the measure below
  for (const [call] of String(stageText).matchAll(/\btr\(\s*(?:'(?:[^'\\]|\\.)*'\s*,\s*)?["`][^)]{0,60}/g)) errs.push(`label ${call.slice(0, 50)}…: write it as tr('nl', 'en') in single quotes, so its fit is measured`);
  const pairs = String(stageText).matchAll(/\btr\(\s*'((?:[^'\\]|\\.)*)'\s*,\s*'((?:[^'\\]|\\.)*)'\s*(?:,\s*(\d+)\s*)?\)/g);
  for (const [, nl, en, width] of pairs) {
    const units = width ? Number(width) : PANEL_UNITS;
    for (const [lang, text] of [['nl', nl], ['en', en]]) {
      const w = textUnits(text.replace(/\\(.)/g, '$1'));
      if (w > units) errs.push(`label "${text}" (${lang}) is ${Math.ceil(w)} units wide, ${width ? `its box is ${units}` : `the panel is ${units}`}`);
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

// ---------------------------------------------------------------- Task 17, step K: lesson points
// Plan: docs/superpowers/plans/2026-11-15-task17-complete-films.md, sections 1.1 and 3.
// A lesson film replaces the reading step (lessonPhases), so every lesson point of
// every lesson wired to it is in the film: a beat says it (voice) or shows it
// (caption), with its numbers. A lesson point is a teach chunk (teach[i-1] split on
// blank lines: t<i>.<j>), a chunk of the worked example's set-up (ex.text.<j>), its
// question (ex.ask) or a chunk of its answer (ex.reveal.<j>). Terms keep their own
// coverage rule above. A beat names what it carries (points: ['offsets#ex.reveal.2']
// in the film's build); the build writes page data points: [{ key, fp, beats }],
// key '<lesson id>#<point id>', fp the fingerprint of the chunk's text, beats
// '<scene id>.<beat number>'. A point may be left to reading (reading: [{ key, fp,
// reason, note | of }]) only as a pointer to another lesson or level (note: where it
// points) or as a word for word duplicate of a point of another lesson the film
// claims (of: that point's key): Merijn, D4.
const chunksOf = (text) => String(text || '').split(/\n\s*\n/).map((c) => c.trim()).filter(Boolean);
export function pointsOf(l) {
  const pts = [];
  (l.teach || []).forEach((t, i) => chunksOf(t).forEach((c, j) => pts.push({ id: `t${i + 1}.${j + 1}`, kind: 'teach', text: c })));
  const e = l.example || {};
  chunksOf(e.text).forEach((c, j) => pts.push({ id: `ex.text.${j + 1}`, kind: 'example', text: c }));
  if (String(e.ask || '').trim()) pts.push({ id: 'ex.ask', kind: 'example', text: String(e.ask).trim() });
  chunksOf(e.reveal).forEach((c, j) => pts.push({ id: `ex.reveal.${j + 1}`, kind: 'example', text: c }));
  return pts;
}
// FNV-1a (32 bit) of the chunk's UTF-8 text with its spacing collapsed, 8 hex: pins the point by value,
// as the term check pins a term by its name.
export function fingerprint(text) {
  let h = 0x811c9dc5;
  for (const byte of new TextEncoder().encode(String(text).replace(/\s+/g, ' ').trim())) h = Math.imul(h ^ byte, 0x01000193) >>> 0;
  return h.toString(16).padStart(8, '0');
}
// The scoring of the inventory (scratchpad task17/inventory.mjs), shared by checkPoints and
// films/_kit/points-draft.mjs: distinctive numbers (decimals and integers above 12; Dutch 12.000 and
// 0,42 read as 12000 and 0.42) and content stems (words of 5 or more letters outside a stoplist, the
// first 6 letters).
export const POINT_STOP = new Set(('alleen alles andere anders boven daarom daarna daarbij daarmee dames dezelfde doordat dus eerst eigen elke enkele erger even gaat geeft hebben heeft hierbij hoeveel hoewel iedere iemand ieder kunnen komen krijgt laten maakt maken meeste minder misschien moeten mogen nadat namelijk niets nodig omdat onder ongeveer staat steeds terwijl tegen tussen vaak veel verder vooral waarom wanneer welke wordt worden zelfs zonder zoals zullen zitten zeker eerste tweede derde vierde jouw jullie hebt hadden zouden zodat zowel zelf houdt staan gaan doet doen weten welk precies echte echt goede grote kleine nieuwe nieuw andere ander keer twee drie vier waar waarbij daar hier want maar niet ook nooit altijd vraag vragen antwoord').split(' '));
const pointWords = (s) => String(s).toLowerCase().match(/[\p{L}][\p{L}-]*/gu) || [];
// Codes and acronyms count as content words whatever their length (G49, C45, IP65, OEE, PLC, WIP): they
// are often the whole point of a short chunk ("G49 en G40 zetten ze weer uit.").
const pointCodes = (s) => (String(s).match(/(?<![\p{L}\d])(?:\p{Lu}{2,}\d*|\p{Lu}+\d+[\p{L}\d]*)(?![\p{L}\d])/gu) || []).map((w) => w.toLowerCase());
export const pointStems = (s) => [...new Set([...pointWords(s).filter((w) => w.length >= 5 && !POINT_STOP.has(w)).map((w) => w.replace(/-/g, '').slice(0, 6)), ...pointCodes(s)])];
export function pointNumbers(s) {
  const out = new Set();
  for (const m of String(s).matchAll(/(?<![\p{L}\d])(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d+))?/gu)) {
    const v = Number(m[1].replace(/\./g, '') + (m[2] ? `.${m[2]}` : ''));
    if (Number.isFinite(v) && !(Number.isInteger(v) && v <= 12)) out.add(String(v));
  }
  return [...out];
}
export const pointSentences = (chunk) => String(chunk).split(/(?<=[.?!])\s+(?=[A-Z0-9€“"'(])/u).map((x) => x.trim()).filter(Boolean);
// What a beat says or shows in Dutch: its caption, its readout and its narration as written.
export const beatTextNl = (b) => [b.text && b.text.nl, b.read && b.read.nl, b.say && Array.isArray(b.say.nl) ? b.say.nl.map((p) => (typeof p === 'string' ? p : p.t)).join('') : ''].filter(Boolean).join('\n');
// Why the beats do not plausibly carry the point ('' when they do): at least half of its distinctive
// numbers, and a fifth of its content stems, at least two (one for a one-sentence point). The review
// checks the meaning. Tuned in the step K review on the 2,998 points of the 96 lesson films: with a flat
// two stems a beat picked at random from the same film passed for 11 % of the points (27 % of the
// one-sentence points without numbers); with a fifth, 5 % (11 %), and every point the inventory found
// carried still passes on one or two of its film's beats as often as before (1,954 of 1,989).
export const POINT_STEM_SHARE = 0.2;
export function pointGap(text, beats) {
  const said = beats.map(beatTextNl).join('\n');
  const why = [];
  const nums = pointNumbers(text);
  const have = new Set(pointNumbers(said));
  const missing = nums.filter((n) => !have.has(n));
  if (nums.length && (nums.length - missing.length) * 2 < nums.length) why.push(`numbers ${missing.join(' ')} not said or shown`);
  const stems = pointStems(text);
  const heard = new Set(pointStems(said));
  const need = Math.min(stems.length, Math.max(pointSentences(text).length > 1 ? 2 : 1, Math.ceil(POINT_STEM_SHARE * stems.length)));
  const got = stems.filter((x) => heard.has(x)).length;
  if (got < need) why.push(`${got} of its words, needs ${need}`);
  return why.join('; ');
}

export const READING_REASONS = ['pointer', 'duplicate'];
// data: a lesson film's page data. lessons: { nl, en } maps. wiredBy: the lessons that wire the film
// (their points must all be claimed or left to reading). A lesson wired with a start scene (film:
// '<id>#5') starts the film there, so its points are claimed in scene 5 or later.
export function checkPoints(data, { lessons, wiredBy = [] }) {
  const errs = [];
  const served = new Set(data.lessons || []);
  const beatAt = new Map();
  (data.scenes || []).forEach((s, si) => (s.beats || []).forEach((b, bi) => beatAt.set(`${s.id}.${bi + 1}`, { si, b })));
  const pointAt = (key) => {
    const s = String(key || '');
    const i = s.lastIndexOf('#');
    const lid = s.slice(0, Math.max(i, 0));
    const l = i > 0 && served.has(lid) ? lessons.nl.get(lid) : undefined;
    if (!l) return { lid, err: `${lid || s} is no lesson of the film` };
    return { lid, p: pointsOf(l).find((x) => x.id === s.slice(i + 1)) };
  };
  const startOf = (lid) => {
    const [film, n] = String((lessons.nl.get(lid) || {}).film || '').split('#');
    return film === data.id && n ? Number(n) : 1;
  };
  const claimed = new Map();
  for (const c of data.points || []) {
    const where = `point ${c.key}`;
    if (claimed.has(c.key)) { errs.push(`${where} is claimed twice in the data`); continue; }
    claimed.set(c.key, c);
    const at = pointAt(c.key);
    if (at.err) { errs.push(`${where}: ${at.err}`); continue; }
    if (!at.p) { errs.push(`${where} is no longer in the lesson; rebuild the film`); continue; }
    if (fingerprint(at.p.text) !== c.fp) { errs.push(`${where} changed in the lesson; rebuild the film`); continue; }
    const refs = c.beats || [];
    if (!refs.length) { errs.push(`${where}: names no beat`); continue; }
    const start = startOf(at.lid);
    const found = [];
    for (const ref of refs) {
      const hit = beatAt.get(ref);
      if (!hit) { errs.push(`${where}: beat ${ref} does not exist`); continue; }
      if (hit.si + 1 < start) errs.push(`${where}: beat ${ref} comes before scene ${start}, where ${at.lid} starts the film`);
      found.push(hit.b);
    }
    if (found.length === refs.length) {
      const why = pointGap(at.p.text, found);
      if (why) errs.push(`${where}: beat${refs.length > 1 ? 's' : ''} ${refs.join(', ')} ${refs.length > 1 ? 'do' : 'does'} not carry it (${why})`);
    }
  }
  const read = new Map();
  for (const r of data.reading || []) {
    const where = `reading ${r.key}`;
    if (read.has(r.key)) { errs.push(`${where} is listed twice`); continue; }
    read.set(r.key, r);
    if (claimed.has(r.key)) errs.push(`point ${r.key} is claimed by a beat and left to reading`);
    const at = pointAt(r.key);
    if (at.err) { errs.push(`${where}: ${at.err}`); continue; }
    if (!at.p) { errs.push(`point ${r.key} is no longer in the lesson; rebuild the film`); continue; }
    if (fingerprint(at.p.text) !== r.fp) { errs.push(`point ${r.key} changed in the lesson; rebuild the film`); continue; }
    if (!READING_REASONS.includes(r.reason)) { errs.push(`${where}: the reason must be pointer or duplicate${r.reason ? `, not ${r.reason}` : ''} (D4: only pointers and word for word duplicates stay out of the film)`); continue; }
    if (r.reason === 'pointer') {
      if (!String(r.note || '').trim()) errs.push(`${where}: a pointer needs a note (the lesson or level it points to)`);
      continue;
    }
    if (!r.of) { errs.push(`${where}: a duplicate names its twin (of: '<lesson id>#<point id>')`); continue; }
    const twin = pointAt(r.of);
    if (twin.err) errs.push(`${where}: its twin ${r.of}: ${twin.err}`);
    else if (twin.lid === at.lid) errs.push(`${where}: a duplicate names a point of another lesson`);
    else if (!twin.p) errs.push(`${where}: its twin ${r.of} is no longer in the lesson`);
    else if (fingerprint(twin.p.text) !== fingerprint(at.p.text)) errs.push(`${where}: not word for word the same as ${r.of}`);
    else if (!claimed.has(r.of)) errs.push(`${where}: its twin ${r.of} is in no beat`);
  }
  for (const lid of wiredBy) {
    const l = served.has(lid) ? lessons.nl.get(lid) : undefined;
    if (!l) continue; // checkFilm reports a wired lesson the film does not serve
    for (const p of pointsOf(l)) {
      const key = `${lid}#${p.id}`;
      if (!claimed.has(key) && !read.has(key)) errs.push(`points: ${key} is in no beat and not left to reading`);
    }
  }
  return errs;
}

// Page size (Task 17): a page with points stays at or under the 300 KB target, so a split film stays under
// it. A film that is extended (or only gets its claims) may instead grow 25 KB from its size before Task 17
// (plan, table 2.2 and risk 4): BYTES_BEFORE pins that size for the 13 such films (inventory actions extend,
// extend+room, none) whose size before plus 25 KB passes the target; for every other one the target is the
// larger limit. A split film keeps no allowance, also where it keeps the old id (tests/filmcontent.test.js
// checks that no split film of the inventory is listed here).
export const BYTES_BEFORE = {
  'eng.gridbasics.path': 286111, 'eng.gridops.outage': 282058, 'eng.gridplanning.flex': 288954, 'eng.machining.milling': 324274,
  'eng.machining.overview': 353316, 'eng.machining.turning': 295984, 'eng.machining.workholding': 287099,
  'eng.ot.isa95': 282763, 'eng.power.drives': 289176, 'eng.safety.loto': 292774, 'pm.land.adoption': 290088, 'pm.run.rhythm': 282283,
};
export const POINTS_GROWTH = 25 * 1024;
export const pointsByteLimit = (id) => Math.max(TARGET_BYTES, (BYTES_BEFORE[id] || 0) + POINTS_GROWTH);
export function checkPageSize(data, bytes) {
  if (bytes > MAX_BYTES) return [`film ${data.id} is ${bytes} bytes, over the ${MAX_BYTES} cap`];
  const limit = pointsByteLimit(data.id);
  if (data.points !== undefined && bytes > limit) return [`film ${data.id} is ${bytes} bytes; a page with points stays at or under ${limit} (${limit > TARGET_BYTES ? 'its size before Task 17 plus 25 KB' : 'the 300 KB target'})`];
  return [];
}

// The rollout gate (Task 17): a lesson film page without points must be in the pending list
// (tests/fixtures/points-pending.json); the list only shrinks. pages: Map id → page data;
// inventory: the lesson films of the Task 17 inventory (docs/superpowers/reviews/2026-11-15-task17-films.json).
export const PENDING_FILE = 'tests/fixtures/points-pending.json';
export function checkPointsGate(pages, pending = [], inventory = []) {
  const errs = [];
  const seen = new Set();
  const lessonFilm = (d) => Boolean(d) && d.module === undefined && d.field === undefined;
  for (const id of pending) {
    if (seen.has(id)) { errs.push(`${id} is listed twice in ${PENDING_FILE}`); continue; }
    seen.add(id);
    const d = pages.get(id);
    if (!lessonFilm(d)) errs.push(`${id} is no shipped lesson film: remove it from ${PENDING_FILE}`);
    else if (d.points !== undefined) errs.push(`${id} has points now: remove it from ${PENDING_FILE}`);
    if (!inventory.includes(id)) errs.push(`${id} is not one of the lesson films of the Task 17 inventory; ${PENDING_FILE} only shrinks`);
  }
  for (const [id, d] of pages) if (lessonFilm(d) && d.points === undefined && !seen.has(id)) errs.push(`${id}: a lesson film without points; claim its lesson points (beat points:, Task 17); ${PENDING_FILE} only shrinks`);
  return errs;
}

// checkScope (Task 17): a builder who completes a legacy lesson film declares what it adds
// (defineFilm({ ..., checkScope: { scenes: ['s4b'], beats: ['s5.4'], stageFns: ['extraOffsets'] } })).
// Those beats get the lesson-film narration guard and must name their focus; those stage functions
// get the label fit (every drawn label a tr('nl', 'en'[, width]) pair, measured in both languages).
// The rest of the legacy film is not checked: run whole, all 96 lesson films fail both checks.
// The lesson-film guard: no colon, semicolon, parentheses or quotes, none of the symbols the voice
// reads aloud and spokenOf does not turn into words, at most two commas in a sentence (a comma inside
// a number does not count) and the Dutch misread list; digits, %, units and the signs × ÷ = + / stay
// allowed, because spokenOf says them as words.
export const LESSON_NARRATION_SYMBOLS = /[:;()“”"‘<>≈→~&]/;
export const SCOPE_FIELDS = ['scenes', 'beats', 'stageFns'];
export function checkScope(data, stageText = '') {
  const errs = [];
  const sc = data.checkScope || {};
  for (const k of Object.keys(sc)) if (!SCOPE_FIELDS.includes(k)) errs.push(`checkScope: unknown field ${k}`);
  const scenes = new Set(sc.scenes || []);
  const beats = new Set(sc.beats || []);
  const all = new Set((data.scenes || []).flatMap((s) => (s.beats || []).map((b, i) => `${s.id}.${i + 1}`)));
  for (const id of scenes) if (!(data.scenes || []).some((s) => s.id === id)) errs.push(`checkScope: no scene ${id}`);
  for (const ref of beats) if (!all.has(ref)) errs.push(`checkScope: no beat ${ref}`);
  for (const s of data.scenes || []) {
    (s.beats || []).forEach((b, i) => {
      if (!scenes.has(s.id) && !beats.has(`${s.id}.${i + 1}`)) return;
      const where = `scene ${s.id} beat ${i + 1}`;
      if (!('focus' in b)) errs.push(`${where}: an added beat names its focus (the part(s) it explains, or focus: null)`);
      if (!b.say) return;
      for (const lang of ['nl', 'en']) {
        const plain = (b.say[lang] || []).map((p) => (typeof p === 'string' ? p : p.t)).join('');
        if (LESSON_NARRATION_SYMBOLS.test(plain)) errs.push(`narration: a colon, parentheses, quotes or a symbol the voice reads aloud in "${plain.slice(0, 50)}" (${where}, ${lang})`);
        if (lang === 'nl' && NL_MISREAD.test(plain)) errs.push(`narration: a word the Dutch voice misreads in "${plain.slice(0, 50)}" (${where})`);
        for (const sentence of plain.split(/[.?!]\s+/)) if ((sentence.match(/(?<!\d),|,(?!\d)/g) || []).length > MAX_COMMAS) errs.push(`narration: more than two commas in "${sentence.slice(0, 50)}" (${where}, ${lang})`);
      }
    });
  }
  for (const name of sc.stageFns || []) {
    const src = stageFnSource(stageText, name);
    if (src === null) { errs.push(`checkScope: stage function ${name} is not in the stage script`); continue; }
    for (const e of checkLabels({}, src)) errs.push(`stage function ${name}: ${e}`);
    for (const lab of untranslatedLabels(src, stageText)) errs.push(`stage function ${name}: the label '${lab}' is not written as tr('nl', 'en'); draw every label of an added scene as tr('nl', 'en'[, width]), wrapped with wrapUnits, so its fit is measured in both languages`);
  }
  return errs;
}

// A small scanner for the stage script: skips strings, template literals (with ${} inside) and comments.
function skipQuoted(text, i) {
  const q = text[i];
  for (i++; i < text.length; i++) {
    const c = text[i];
    if (c === '\\') { i++; continue; }
    if (q === '`' && c === '$' && text[i + 1] === '{') { i = closeOf(text, i + 1) - 1; continue; }
    if (c === q) return i + 1;
  }
  return i;
}
function skipComment(text, i) {
  if (text[i] !== '/') return i;
  if (text[i + 1] === '/') { const e = text.indexOf('\n', i); return e < 0 ? text.length : e; }
  if (text[i + 1] === '*') { const e = text.indexOf('*/', i + 2); return e < 0 ? text.length : e + 2; }
  return i;
}
// text[i] is ( [ or {: the index after its closing bracket
function closeOf(text, i) {
  let depth = 0;
  while (i < text.length) {
    const c = text[i];
    if (c === '"' || c === "'" || c === '`') { i = skipQuoted(text, i); continue; }
    const k = skipComment(text, i);
    if (k !== i) { i = k; continue; }
    if ('([{'.includes(c)) depth++;
    else if (')]}'.includes(c) && --depth === 0) return i + 1;
    i++;
  }
  return i;
}
// The source of a named function of the stage script: a declaration (function name(...) {...}) or an
// arrow assigned to a const, let or var, with a block or an expression body. null when not found.
// The source with its comments blanked (same length), so a comment never reads as a declaration.
// One stage is scanned many times (once per named function and helper), so the last result is kept.
let uncommentedLast = { text: null, out: '' };
function uncommented(text) {
  if (uncommentedLast.text === text) return uncommentedLast.out;
  const out = [];
  let from = 0;
  for (let i = 0; i < text.length;) {
    const c = text[i];
    if (c === '"' || c === "'" || c === '`') { i = skipQuoted(text, i); continue; }
    const k = skipComment(text, i);
    if (k !== i) { out.push(text.slice(from, i), text.slice(i, k).replace(/[^\n]/g, ' ')); from = i = k; continue; }
    i++;
  }
  out.push(text.slice(from));
  uncommentedLast = { text, out: out.join('') };
  return uncommentedLast.out;
}
export function stageFnSource(src, name) {
  const text = String(src);
  const id = String(name).replace(/[$]/g, '\\$');
  const m = new RegExp(`\\bfunction\\s+${id}\\s*\\(|\\b(?:const|let|var)\\s+${id}\\s*=\\s*(?:async\\s*)?(?:\\([^()]*\\)|[\\w$]+)\\s*=>`).exec(uncommented(text));
  if (!m) return null;
  let i = m.index + m[0].length;
  if (m[0].startsWith('function')) {
    i = closeOf(text, i - 1);
    while (/\s/.test(text[i] || '')) i++;
    return text[i] === '{' ? text.slice(m.index, closeOf(text, i)) : null;
  }
  while (/\s/.test(text[i] || '')) i++;
  if (text[i] === '{') return text.slice(m.index, closeOf(text, i));
  // an expression body ends at a ; or , or closing bracket at its own depth, or at a line break that
  // does not continue it
  let j = i;
  while (j < text.length) {
    const c = text[j];
    if (c === '"' || c === "'" || c === '`') { j = skipQuoted(text, j); continue; }
    const k = skipComment(text, j);
    if (k !== j) { j = k; continue; }
    if ('([{'.includes(c)) { j = closeOf(text, j); continue; }
    if (';,)]}'.includes(c)) break;
    if (c === '\n') {
      const before = text.slice(i, j).trimEnd().slice(-1);
      const next = /\S/g;
      next.lastIndex = j;
      const after = (next.exec(text) || [''])[0];
      if (!/[+\-*/=?:,(&|.]/.test(before) && !/[+\-*/?:.&|]/.test(after)) break;
    }
    j++;
  }
  return text.slice(m.index, j).trimEnd();
}
// Literals that are no label: anchors, language codes and class lists (every word hyphenated).
const NO_LABEL = /^(?:start|middle|end|nl|en|[\w]+(?:-[\w]+)+(?:\s+[\w]+(?:-[\w]+)+)*)$/;
// A label whose every word is a unit or an acronym reads the same in both languages ('kg', '0 bar',
// 'MES → ERP'): it needs no tr() pair (the step K review found these on the legacy stages).
const UNITS = new Set('mm cm m km µm g kg t s ms min h u bar mbar pa kpa mpa n nm kn w kw mw kwh mwh v kv a ma hz khz rpm l ml m2 m3 mm2 eur'.split(' '));
const sameInBothLanguages = (s) => (s.match(/[\p{L}][\p{L}\d]*/gu) || []).every((w) => UNITS.has(w.toLowerCase()) || /^\p{Lu}[\p{Lu}\d]{1,5}$/u.test(w));
const labelLike = (s) => /\p{L}/u.test(s) && !NO_LABEL.test(s.trim()) && !sameInBothLanguages(s);
// The string literals (and the static parts of template literals) in a stretch of source.
function literalsIn(text) {
  const out = [];
  for (let i = 0; i < text.length;) {
    const c = text[i];
    if (c === '"' || c === "'" || c === '`') {
      const end = skipQuoted(text, i);
      let body = text.slice(i + 1, end - 1);
      if (c === '`') body = body.replace(/\$\{[\s\S]*?\}/g, ' ');
      out.push(body.replace(/\\(.)/g, '$1').trim());
      i = end;
      continue;
    }
    const k = skipComment(text, i);
    i = k !== i ? k : i + 1;
  }
  return out;
}
// The functions of a stage that draw a <text> (tr excepted), kept for the last stage asked.
let helpersLast = { src: null, out: [] };
function textHelpers(src) {
  if (helpersLast.src === src) return helpersLast.out;
  const names = new Set([...uncommented(src).matchAll(/\bfunction\s+([\w$]+)\s*\(|\b(?:const|let|var)\s+([\w$]+)\s*=\s*(?:async\s*)?(?:\([^()]*\)|[\w$]+)\s*=>/g)].map((m) => m[1] || m[2]));
  helpersLast = { src, out: [...names].filter((n) => n !== 'tr' && (stageFnSource(src, n) || '').includes('<text')) };
  return helpersLast.out;
}
// The drawn labels of a stage function that are not tr('nl', 'en') pairs: text written into a
// <text> element, and label-like literals passed to a function of the stage that draws a <text>.
export function untranslatedLabels(fnSrc, stageText = '') {
  const strip = (s) => {
    let out = '';
    let i = 0;
    for (const m of s.matchAll(/\btr\s*\(/g)) {
      if (m.index < i) continue;
      out += s.slice(i, m.index);
      i = closeOf(s, m.index + m[0].length - 1);
      out += 'tr()';
    }
    return out + s.slice(i);
  };
  const body = strip(String(fnSrc));
  const found = [];
  for (const m of body.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)) {
    const t = m[1].replace(/\$\{[^}]*\}/g, '').trim();
    if (/\p{L}/u.test(t) && !sameInBothLanguages(t)) found.push(t);
  }
  const helpers = textHelpers(String(stageText || fnSrc));
  for (const h of helpers) {
    for (const m of body.matchAll(new RegExp(`(?<![\\w$.])${h.replace(/[$]/g, '\\$')}\\s*\\(`, 'g'))) {
      if (/function\s*$/.test(body.slice(0, m.index))) continue;
      const open = m.index + m[0].length - 1;
      for (const lit of literalsIn(body.slice(open + 1, closeOf(body, open) - 1))) if (labelLike(lit)) found.push(lit);
    }
  }
  return [...new Set(found)];
}

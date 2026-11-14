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
export const MAX_SCENES = 9;
// v14b: no longer capped at 150 s; Basis 3–5 min, higher levels 2–4 min.
export const MAX_TOTAL = 300;
// The narration's spoken length, estimated from its words (Piper voices speak
// about 2.5 words a second); the real length comes from the audio.
export const NARRATION_WPS = 2.5;
export const NARRATION_MIN = 25;
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
      if (sc && was && !(sc.beats || []).some((b) => word(b.text[lang], was))) errs.push(`station ${id}: "${was}" (${lang}) is in no caption of its scene ${st.scene}`);
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
  for (const t of data.topics || []) {
    for (const lang of ['nl', 'en']) {
      const title = (t.title || {})[lang] || '';
      const widest = Math.max(0, ...title.split(' ').map(textUnits));
      if (widest > TILE_UNITS) errs.push(`topic ${t.id}: "${title}" (${lang}) has a word of ${Math.ceil(widest)} units, a tile is ${TILE_UNITS}`);
      else {
        const lines = wrapUnits(title, TILE_UNITS, CHAR_W).length;
        if (lines > TILE_LINES) errs.push(`topic ${t.id}: "${title}" (${lang}) wraps to ${lines} lines in a tile of ${TILE_UNITS} units, a tile holds ${TILE_LINES}`);
      }
    }
  }
  for (const st of data.stations || []) {
    for (const lang of ['nl', 'en']) {
      const title = (st.title || {})[lang] || '';
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

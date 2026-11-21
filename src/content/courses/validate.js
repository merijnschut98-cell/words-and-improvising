// Checks one course module (both languages) against the lesson schema. Used by
// the content tests and by whoever writes content. Returns a list of problems;
// an empty list means the module is valid. Pure.
import { containsAnswer } from '../../core/hint.js';
import { KINDS, kindOf, gapKey } from '../../core/questionkinds.js';
import { KINDS as PICTURE_KINDS, pictureLabels } from '../../ui/picture.js';

const MAX_BLOCK_WORDS = 90;
const MAX_HINT_WORDS = 25;
const words = (s) => String(s).trim().split(/\s+/).filter(Boolean).length;
const str = (v) => typeof v === 'string' && v.trim().length > 0;

// Every string anywhere in the lesson, for the markup check.
function strings(v, out = []) {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, out));
  return out;
}

// A question's shape by kind (v18, design 2.3). No `kind` = mc, or num when it
// has `number`. lang ('en'|'nl') only sharpens the best-answer stem check.
const BEST_STEM = { nl: /\bbeste\b/i, en: /\bbest\b/i };
const distinct = (a) => new Set(a).size === a.length;
const list = (a, lo, hi) => Array.isArray(a) && a.length >= lo && a.length <= hi && a.every(str);

export function checkQuestion(qn, where, errs, lang = null) {
  if (!str(qn.q)) errs.push(`${where}: question text missing`);
  if (!str(qn.why)) errs.push(`${where}: why missing`);
  if ('kind' in qn && !KINDS.includes(qn.kind)) { errs.push(`${where}: unknown kind ${JSON.stringify(qn.kind)}`); return; }
  const kind = kindOf(qn);
  // the screens and the hint take a question with `number` as numeric, whatever its kind
  if (kind !== 'num' && 'number' in qn) errs.push(`${where}: a ${kind} question may not have a number field (only numeric questions do)`);
  if (kind === 'num') {
    if (typeof qn.number !== 'number' || !Number.isFinite(qn.number)) errs.push(`${where}: number must be a number`);
    if (!(typeof qn.tolerance === 'number' && qn.tolerance > 0)) errs.push(`${where}: numeric question needs a tolerance > 0`);
    if (typeof qn.unit !== 'string') errs.push(`${where}: numeric question needs a unit (may be empty)`);
  } else if (kind === 'mc' || kind === 'best') {
    if (!Array.isArray(qn.options) || qn.options.length !== 4 || !qn.options.every(str)) errs.push(`${where}: needs 4 options`);
    else if (new Set(qn.options).size !== 4) errs.push(`${where}: options must be distinct`);
    if (!Array.isArray(qn.options) || !qn.options.includes(qn.answer)) errs.push(`${where}: answer not in options`);
    if (kind === 'best') {
      if (!Array.isArray(qn.options) || !qn.options.includes(qn.close)) errs.push(`${where}: best answer needs close (the runner-up) among the options`);
      else if (qn.close === qn.answer) errs.push(`${where}: close must differ from answer`);
      const stem = lang ? BEST_STEM[lang] : /\b(beste|best)\b/i;
      if (str(qn.q) && !stem.test(qn.q)) errs.push(`${where}: a best-answer stem must say "${lang === 'nl' ? 'beste' : lang === 'en' ? 'best' : 'beste/best'}"`);
    }
  } else if (kind === 'all') {
    if (!list(qn.options, 4, 6)) errs.push(`${where}: select-all needs 4–6 options`);
    else if (!distinct(qn.options)) errs.push(`${where}: options must be distinct`);
    else if (!Array.isArray(qn.answers) || !qn.answers.length || qn.answers.length >= qn.options.length || !distinct(qn.answers) || !qn.answers.every((a) => qn.options.includes(a))) {
      errs.push(`${where}: answers must be 1 to ${qn.options.length - 1} distinct options`);
    }
  } else if (kind === 'gap') {
    if (!str(qn.text) || qn.text.split('___').length !== 2) errs.push(`${where}: gap text needs exactly one ___`);
    if (!list(qn.accept, 1, 4)) errs.push(`${where}: gap needs 1–4 accepted words`);
    else if (!qn.accept.every((a) => gapKey(a))) errs.push(`${where}: every accepted word needs a letter or a digit`);
    if ('choices' in qn && qn.choices !== null) {
      if (!list(qn.choices, 4, 6) || !distinct(qn.choices)) errs.push(`${where}: choices must be 4–6 distinct words`);
      else if (Array.isArray(qn.accept) && !qn.choices.includes(qn.accept[0])) errs.push(`${where}: choices must include the first accepted word`);
      else if (Array.isArray(qn.accept)) {
        // a distractor that reads as an accepted word would be judged right
        const keys = new Set(qn.accept.map(gapKey));
        const same = qn.choices.filter((c) => !qn.accept.includes(c) && keys.has(gapKey(c)));
        if (same.length) errs.push(`${where}: choice ${JSON.stringify(same[0])} reads the same as an accepted word; make it a different word or put it in accept`);
      }
    }
  } else if (kind === 'order') {
    if (!list(qn.items, 3, 6) || !distinct(qn.items)) errs.push(`${where}: order needs 3–6 distinct items`);
  } else if (kind === 'match') {
    const pairs = qn.pairs;
    if (!Array.isArray(pairs) || pairs.length < 3 || pairs.length > 5 || !pairs.every((p) => Array.isArray(p) && p.length === 2 && p.every(str))) errs.push(`${where}: match needs 3–5 pairs of two texts`);
    else if (!distinct(pairs.map((p) => p[0])) || !distinct(pairs.map((p) => p[1]))) errs.push(`${where}: match sides must each be distinct`);
  }
  // Optional: the question's own hint, shown instead of the generated one.
  if ('hint' in qn) {
    if (!str(qn.hint)) errs.push(`${where}: hint must be text`);
    else if (words(qn.hint) > MAX_HINT_WORDS) errs.push(`${where}: hint has ${words(qn.hint)} words (max ${MAX_HINT_WORDS})`);
    else if (containsAnswer(qn, qn.hint)) errs.push(`${where}: hint gives the answer`);
  }
}

// "They push back": two objections in the other person's voice, a calm firm
// reply and a 3-line rubric. Required on project lessons, optional elsewhere.
function checkPushback(p, at, errs) {
  if (!p || typeof p !== 'object') { errs.push(`${at}: situation needs a pushback`); return; }
  if (!Array.isArray(p.lines) || p.lines.length !== 2 || !p.lines.every(str)) errs.push(`${at}: pushback needs exactly 2 lines`);
  else p.lines.forEach((x, i) => { if (words(x) > 40) errs.push(`${at}: pushback line ${i} has ${words(x)} words (max 40)`); });
  if (!str(p.model)) errs.push(`${at}: pushback model missing`);
  else if (words(p.model) > 70) errs.push(`${at}: pushback model has ${words(p.model)} words (max 70)`);
  if (!Array.isArray(p.rubric) || p.rubric.length !== 3 || !p.rubric.every(str)) errs.push(`${at}: pushback rubric needs exactly 3 lines`);
}

// tier: the lesson's level, from its place in a topic, else the module level.
function checkLesson(l, meta, lang, errs, tier = meta.level) {
  const at = `${lang} ${l.id}`;
  if (!str(l.title)) errs.push(`${at}: title missing`);
  const pre = l.pre || [];
  if (pre.length < 1 || pre.length > 2) errs.push(`${at}: needs 1–2 pre questions`);
  pre.forEach((qn, i) => {
    checkQuestion(qn, `${at} pre ${i}`, errs, lang);
    // the pre card is a single tap or a number; the puzzle kinds belong in recall and the banks
    if (qn && !['mc', 'num', 'best'].includes(kindOf(qn))) errs.push(`${at} pre ${i}: kind ${kindOf(qn)} is not supported in a pre question`);
  });
  const teach = l.teach || [];
  if (teach.length < 3 || teach.length > 5) errs.push(`${at}: needs 3–5 teach blocks`);
  teach.forEach((b, i) => {
    if (!str(b)) errs.push(`${at}: teach ${i} empty`);
    else if (words(b) > MAX_BLOCK_WORDS) errs.push(`${at}: teach ${i} has ${words(b)} words (max ${MAX_BLOCK_WORDS})`);
  });
  const ex = l.example || {};
  if (!['worked', 'faded'].includes(ex.kind)) errs.push(`${at}: example kind must be worked or faded`);
  if (ex.kind === 'faded' && tier < 3) errs.push(`${at}: faded example only at level 3–4`);
  if (ex.kind === 'worked' && tier >= 3) errs.push(`${at}: level 3–4 uses a faded example`);
  if (!str(ex.text)) errs.push(`${at}: example text missing`);
  if (ex.kind === 'faded' && !(str(ex.ask) && str(ex.reveal))) errs.push(`${at}: faded example needs ask and reveal`);
  if (!str(l.said)) errs.push(`${at}: said missing`);
  // the kernzin (17 Nov): optional during the rollout (tests/gist.test.js), one sentence of at most 25 words
  if ('gist' in l && !(str(l.gist) && words(l.gist) <= 25 && /[.!?]$/.test(l.gist.trim()))) errs.push(`${at}: gist must be one sentence of at most 25 words`);
  const recall = l.recall || [];
  if (recall.length < 3 || recall.length > 5) errs.push(`${at}: needs 3–5 recall questions`);
  recall.forEach((qn, i) => checkQuestion(qn, `${at} recall ${i}`, errs, lang));
  if (meta.questions && meta.questions[l.id] !== recall.length) errs.push(`${at}: recall count ${recall.length} differs from the index count ${meta.questions[l.id]}`);
  const s = l.situation || {};
  if (!(str(s.scene) && str(s.ask) && str(s.model))) errs.push(`${at}: situation needs scene, ask and model`);
  if (!Array.isArray(s.rubric) || s.rubric.length !== 3 || !s.rubric.every(str)) errs.push(`${at}: situation rubric needs exactly 3 lines`);
  if ('pushback' in s || meta.subject === 'pm') checkPushback(s.pushback, at, errs);
  if (!str(l.sayIt)) errs.push(`${at}: sayIt missing`);
  const terms = l.terms || [];
  if (terms.length < 2 || terms.length > 6 || !terms.every((x) => x && str(x.term) && str(x.def))) errs.push(`${at}: needs 2–6 terms with term and def`);
  if (strings(l).some((x) => /[<>]/.test(x))) errs.push(`${at}: no < or > allowed in text`);
  if ('figure' in l && !(typeof l.figure === 'string' && /^[a-z]+(\.[a-z0-9]+)+$/.test(l.figure))) errs.push(`${at}: figure must be an id like eng.flow.line`);
  // An explainer film, optionally opened at a start scene: eng.machining.turning#3.
  if ('film' in l && !(typeof l.film === 'string' && /^[a-z]+(\.[a-z0-9]+)+(#[1-9])?$/.test(l.film))) errs.push(`${at}: film must be an id like eng.machining.turning, optionally #1–#9`);
}

const TOPIC_ID = /^[a-z0-9]+$/;

// v17: a module's intro film, played at the top of the module before its
// topics. Named after the module, and always from the start.
export function checkIntro(meta) {
  if (!meta || !('intro' in meta)) return [];
  return meta.intro === `${meta.id}.intro` ? [] : [`${meta && meta.id}: intro must be '${meta && meta.id}.intro'`];
}

// v17: the fields of the course index. Each is `<subject>.field.<slug>` with a
// title and blurb in both languages and modules of its own subject; a module sits
// in one field only; a subject that has fields has all its modules in them; a
// field's film, when set, is its own id. Pure.
export function checkFields(fields, modules) {
  const errs = [];
  const seen = new Map();
  const bySubject = new Set();
  for (const f of Array.isArray(fields) ? fields : []) {
    const at = `field ${f && f.id}`;
    if (!f || typeof f.id !== 'string' || !new RegExp(`^${f.subject}\\.field\\.[a-z0-9]+$`).test(f.id)) { errs.push(`${at}: id must be <subject>.field.<slug>`); continue; }
    bySubject.add(f.subject);
    for (const key of ['title', 'blurb']) {
      if (!f[key] || !str(f[key].en) || !str(f[key].nl)) errs.push(`${at}: ${key} needs en and nl`);
    }
    if ('film' in f && f.film !== f.id) errs.push(`${at}: film must be the field's own id`);
    for (const id of Array.isArray(f.modules) ? f.modules : []) {
      const m = modules.find((x) => x.id === id);
      if (!m) { errs.push(`${at}: unknown module ${id}`); continue; }
      if (m.subject !== f.subject) errs.push(`${at}: ${id} is not in subject ${f.subject}`);
      if (seen.has(id)) errs.push(`${at}: ${id} is in two fields (${seen.get(id)} and ${f.id})`);
      else seen.set(id, f.id);
    }
  }
  for (const subject of bySubject) {
    for (const m of modules.filter((x) => x.subject === subject)) {
      if (!seen.has(m.id)) errs.push(`${subject}: module ${m.id} has no field`);
    }
  }
  return errs;
}

// The bounding box [x0, y0, x1, y1] of an absolute SVG path (M L H V Q C A Z),
// or null when it has no points. Control points count: zones are drawn with
// plain rounded corners, so the box is the zone's extent.
export function pathBox(d) {
  const tokens = String(d || '').match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  const xs = [];
  const ys = [];
  const pairs = { M: 1, L: 1, T: 1, Q: 2, C: 3 };
  let cmd = '';
  let i = 0;
  while (i < tokens.length) {
    if (/[A-Za-z]/.test(tokens[i])) { cmd = tokens[i++]; continue; }
    if (cmd === 'H') xs.push(+tokens[i++]);
    else if (cmd === 'V') ys.push(+tokens[i++]);
    else if (cmd === 'A') { xs.push(+tokens[i + 5]); ys.push(+tokens[i + 6]); i += 7; }
    else if (pairs[cmd]) {
      for (let k = 0; k < pairs[cmd]; k++) { xs.push(+tokens[i++]); ys.push(+tokens[i++]); }
    } else i++;
  }
  return xs.length && ys.length ? [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] : null;
}

// v17: a subject map. Every module of the subject is exactly one place, no
// place names an unknown module, each place sits inside the zone of its
// module's field, is at least 44 px wide and high on a 390 px screen, and no
// two places overlap. Pure.
export function checkMap(map, modules, fields) {
  const errs = [];
  const view = (map && map.view) || {};
  const places = Array.isArray(map && map.places) ? map.places : [];
  const zones = Array.isArray(map && map.zones) ? map.zones : [];
  const mine = modules.filter((m) => m.subject === map.subject);
  const seen = new Set();
  for (const p of places) {
    const at = `map ${map.subject}: place ${p.module}`;
    if (!mine.some((m) => m.id === p.module)) { errs.push(`${at}: not a module of ${map.subject}`); continue; }
    if (seen.has(p.module)) errs.push(`${at}: placed twice`);
    seen.add(p.module);
    if (p.w * 390 / view.w < 44 || p.h * 390 / view.w < 44) errs.push(`${at}: under 44 px at 390 px wide`);
    const field = (fields || []).find((f) => f.modules.includes(p.module));
    const zone = field && zones.find((z) => z.field === field.id);
    const box = zone && pathBox(zone.path);
    if (!field) errs.push(`${at}: module has no field`);
    else if (!box) errs.push(`${at}: no zone for ${field.id}`);
    else if (p.x < box[0] || p.y < box[1] || p.x + p.w > box[2] || p.y + p.h > box[3]) errs.push(`${at}: outside the zone of ${field.id}`);
  }
  for (const m of mine) if (!seen.has(m.id)) errs.push(`map ${map.subject}: module ${m.id} has no place`);
  for (let a = 0; a < places.length; a++) {
    for (let b = a + 1; b < places.length; b++) {
      const p = places[a];
      const q = places[b];
      if (p.x < q.x + q.w && q.x < p.x + p.w && p.y < q.y + q.h && q.y < p.y + p.h) errs.push(`map ${map.subject}: ${p.module} overlaps ${q.module}`);
    }
  }
  return errs;
}

// The topic table of a topic module: 2–8 topics, each a slug id unique in the
// module, a title in both languages and exactly 4 distinct lessons as levels
// 1–4; every lesson in exactly one topic; lessons in topic order.
export function checkTopics(meta) {
  const errs = [];
  const topics = meta && meta.topics;
  if (!Array.isArray(topics) || topics.length < 2 || topics.length > 8) {
    errs.push(`${meta && meta.id}: needs 2–8 topics`);
    if (!Array.isArray(topics)) return errs;
  }
  const lessons = (meta && meta.lessons) || [];
  const seen = new Set();
  const where = new Map();
  for (const t of topics) {
    const id = t && t.id;
    if (typeof id !== 'string' || !TOPIC_ID.test(id)) errs.push(`${meta.id}: topic id ${id} must match [a-z0-9]+`);
    else if (seen.has(id)) errs.push(`${meta.id}: duplicate topic id ${id}`);
    seen.add(id);
    if (!(t && t.title && str(t.title.en) && str(t.title.nl))) errs.push(`${meta.id}: topic ${id} needs a title in en and nl`);
    const levels = (t && t.levels) || [];
    if (!Array.isArray(levels) || levels.length !== 4 || new Set(levels).size !== 4) errs.push(`${meta.id}: topic ${id} needs exactly 4 levels`);
    for (const lid of Array.isArray(levels) ? levels : []) {
      if (!lessons.includes(lid)) errs.push(`${meta.id}: level ${lid} of topic ${id} is not in lessons`);
      where.set(lid, [...(where.get(lid) || []), id]);
    }
  }
  for (const lid of lessons) {
    const n = (where.get(lid) || []).length;
    if (n === 0) errs.push(`${meta.id}: lesson ${lid} is in no topic`);
    else if (n > 1) errs.push(`${meta.id}: lesson ${lid} is in more than one topic`);
  }
  if (lessons.join() !== topics.flatMap((t) => (t && Array.isArray(t.levels) ? t.levels : [])).join()) errs.push(`${meta.id}: lessons must follow topic order`);
  return errs;
}

// Lesson id -> its level in its topic (topic modules only).
function tiersOf(meta) {
  const tiers = new Map();
  for (const t of Array.isArray(meta.topics) ? meta.topics : []) ((t && t.levels) || []).forEach((id, i) => { if (!tiers.has(id)) tiers.set(id, i + 1); });
  return tiers;
}

// en/nl parity of the v18 kinds: the same kind per slot; best has the key and
// the runner-up at the same positions; all has the same key positions; order
// the same item count; match the same pair count. gap accept lists are free.
export function checkKindParity(qa, qb, where, errs) {
  if (!qa || !qb) return;
  if (kindOf(qa) !== kindOf(qb)) { errs.push(`${where}: kind differs between en and nl (${kindOf(qa)} / ${kindOf(qb)})`); return; }
  const kind = kindOf(qa);
  const at = (q, k) => (Array.isArray(q.options) ? q.options.indexOf(q[k]) : -1);
  if (kind === 'best' && at(qa, 'close') !== at(qb, 'close')) errs.push(`${where}: runner-up position differs between en and nl`);
  if (kind === 'all') {
    const keys = (q) => (Array.isArray(q.options) && Array.isArray(q.answers) ? q.options.map((o, i) => (q.answers.includes(o) ? i : -1)).filter((i) => i >= 0).join() : '');
    if ((qa.options || []).length !== (qb.options || []).length) errs.push(`${where}: option counts differ between en and nl`);
    else if (keys(qa) !== keys(qb)) errs.push(`${where}: answer positions differ between en and nl`);
  }
  if (kind === 'order' && (qa.items || []).length !== (qb.items || []).length) errs.push(`${where}: item counts differ between en and nl`);
  if (kind === 'match' && (qa.pairs || []).length !== (qb.pairs || []).length) errs.push(`${where}: pair counts differ between en and nl`);
  if (kind === 'gap' && !!(qa.choices) !== !!(qb.choices)) errs.push(`${where}: word bank in one language only`);
}

// Across a module the select-all items may not all have the same number of
// keys, or "always two" becomes a tell.
export function checkSelectAllSpread(lessons, lang, errs) {
  const counts = [];
  for (const l of lessons) for (const qn of [...(l.pre || []), ...(l.recall || [])]) if (qn && kindOf(qn) === 'all' && Array.isArray(qn.answers)) counts.push(qn.answers.length);
  if (counts.length >= 2 && new Set(counts).size === 1) errs.push(`${lang}: every select-all question has ${counts[0]} correct answers; vary the number`);
}

export function validateModule(en, nl, meta) {
  const errs = [];
  const topical = Array.isArray(meta.topics);
  if (topical) errs.push(...checkTopics(meta));
  errs.push(...checkIntro(meta));
  const tiers = tiersOf(meta);
  const byLang = { en, nl };
  for (const lang of ['en', 'nl']) {
    const lessons = (byLang[lang] && byLang[lang].lessons) || [];
    const ids = lessons.map((l) => l && l.id);
    for (const id of meta.lessons) if (!ids.includes(id)) errs.push(`${lang}: lesson ${id} missing`);
    for (const id of ids) if (!meta.lessons.includes(id)) errs.push(`${lang}: lesson ${id} not in the index`);
    if (ids.join() !== meta.lessons.filter((id) => ids.includes(id)).join()) errs.push(`${lang}: lessons out of index order`);
    for (const l of lessons) if (l && meta.lessons.includes(l.id)) checkLesson(l, meta, lang, errs, tiers.get(l.id) ?? meta.level);
    checkSelectAllSpread(lessons.filter(Boolean), lang, errs);
    // A topic module defines each term once (in the lowest level that uses it);
    // the lesson screen makes every term of the module tappable.
    if (topical) {
      const first = new Map();
      for (const l of lessons) {
        if (!l || !meta.lessons.includes(l.id)) continue;
        for (const x of l.terms || []) {
          const key = x && typeof x.term === 'string' ? x.term.trim().toLowerCase() : '';
          if (!key) continue;
          if (first.has(key)) errs.push(`${lang}: term "${key}" defined in ${first.get(key)} and ${l.id}`);
          else first.set(key, l.id);
        }
      }
    }
  }
  // Same shape in both languages: question counts and numeric answers match.
  for (const id of meta.lessons) {
    const a = ((en && en.lessons) || []).find((l) => l.id === id);
    const b = ((nl && nl.lessons) || []).find((l) => l.id === id);
    if (!a || !b) continue;
    if ((a.recall || []).length !== (b.recall || []).length) errs.push(`${id}: recall counts differ between en and nl`);
    if ((a.pre || []).length !== (b.pre || []).length) errs.push(`${id}: pre counts differ between en and nl`);
    // The Dutch screen pairs terms with their English word by position.
    if ((a.terms || []).length !== (b.terms || []).length) errs.push(`${id}: terms counts differ between en and nl`);
    (a.pre || []).forEach((qa, i) => {
      const qb = (b.pre || [])[i];
      checkKindParity(qa, qb, `${id} pre ${i}`, errs);
      // best has its key at the same position in both languages, in pre as in recall (design 2.3)
      if (qb && kindOf(qa) === 'best' && kindOf(qb) === 'best' && qa.options && qb.options && qa.options.indexOf(qa.answer) !== qb.options.indexOf(qb.answer)) errs.push(`${id} pre ${i}: answer position differs between en and nl`);
    });
    (a.recall || []).forEach((qa, i) => {
      const qb = (b.recall || [])[i];
      if (qb && ('number' in qa) !== ('number' in qb)) errs.push(`${id} recall ${i}: numeric in one language only`);
      if (qb && 'number' in qa && qa.number !== qb.number) errs.push(`${id} recall ${i}: numbers differ between en and nl`);
      if (qb && qa.options && qb.options && qa.options.indexOf(qa.answer) !== qb.options.indexOf(qb.answer)) errs.push(`${id} recall ${i}: answer position differs between en and nl`);
      checkKindParity(qa, qb, `${id} recall ${i}`, errs);
    });
  }
  return errs;
}

// v17 Task 19: level openers. `openers` is { [topicKey]: { 2|3|4: { nl, en } } }
// with topicKey '<moduleId>/<topicId>'. Every topic needs an opener for each
// level 2 to 4 that has a lesson, in both languages: two to four sentences,
// no colons, at most OPENER_MAX_CHARS, the level named in the app's words, the
// same number of sentences in nl and en, and nothing for level 1. Pure.
export const OPENER_MAX_CHARS = 320;
export const OPENER_LEVEL_WORDS = {
  2: { nl: 'Werkkennis', en: 'Working knowledge' },
  3: { nl: 'Gevorderd', en: 'Advanced' },
  4: { nl: 'Expert', en: 'Expert' },
};
export const openerKey = (moduleId, topicId) => `${moduleId}/${topicId}`;
export const openerSentences = (text) => String(text).trim().split(/(?<=[.!?])\s+/).filter(Boolean);

export function checkOpeners(modules, openers) {
  const errs = [];
  const data = openers || {};
  const expected = new Set();
  for (const m of modules) {
    for (const t of Array.isArray(m.topics) ? m.topics : []) {
      const key = openerKey(m.id, t.id);
      expected.add(key);
      const entry = data[key];
      if (!entry) { errs.push(`opener ${key}: missing`); continue; }
      if ('1' in entry) errs.push(`opener ${key}: level 1 has no opener (Basis has the module intro)`);
      for (const level of [2, 3, 4]) {
        const has = Array.isArray(t.levels) && t.levels[level - 1];
        const o = entry[level];
        if (!has) { if (o) errs.push(`opener ${key} level ${level}: no lesson at this level`); continue; }
        if (!o) { errs.push(`opener ${key} level ${level}: missing`); continue; }
        const counts = {};
        for (const lang of ['nl', 'en']) {
          const at = `opener ${key} level ${level} ${lang}`;
          const text = o[lang];
          if (!str(text)) { errs.push(`${at}: text missing`); continue; }
          const n = openerSentences(text).length;
          counts[lang] = n;
          if (n < 2 || n > 4) errs.push(`${at}: ${n} sentences (needs 2 to 4)`);
          if (text.length > OPENER_MAX_CHARS) errs.push(`${at}: ${text.length} characters (max ${OPENER_MAX_CHARS})`);
          if (text.includes(':')) errs.push(`${at}: contains a colon`);
          if (!text.includes(OPENER_LEVEL_WORDS[level][lang])) errs.push(`${at}: does not name the level "${OPENER_LEVEL_WORDS[level][lang]}"`);
          if (/\b(?:les|lesson|level|niveau)\s+\d/i.test(text) || /\b(?:eng|pm)\.[a-z0-9]+\.[a-z0-9]+/.test(text)) errs.push(`${at}: names a lesson number or id`);
        }
        if (counts.nl && counts.en && counts.nl !== counts.en) errs.push(`opener ${key} level ${level}: ${counts.nl} sentences in nl but ${counts.en} in en`);
      }
    }
  }
  for (const key of Object.keys(data)) if (!expected.has(key)) errs.push(`opener ${key}: no such topic`);
  return errs;
}

// v18 G1: lesson pictures. `lesson.pictures` is [{ id, after, alt }]: after is a
// teach block index or 'example', at most two, alt at most 30 words (per language
// file). `pictures` is the module's picture file (pictures/<moduleId>.js) or null
// when it has none. Small and self-contained on purpose.
export const MAX_PICTURES = 2;
export const MAX_ALT_WORDS = 30;
const PICTURE_NAME = /^[a-z0-9]+(\.[a-z0-9]+)*$/;
const isL = (l) => l && typeof l === 'object' && str(l.nl) && str(l.en);
const labelOk = (l) => (Array.isArray(l) ? l.length > 0 && l.every(isL) : isL(l));

// The shape of one picture: its kind, and that every label has both languages.
export function checkPictureData(pic, at, errs) {
  if (!pic || !PICTURE_KINDS.includes(pic.kind)) { errs.push(`${at}: picture kind must be one of ${PICTURE_KINDS.join(', ')}`); return; }
  const bad = [];
  const add = (l) => { if (l != null && !labelOk(l)) bad.push(JSON.stringify(l)); };
  const node = (n) => { add(n.label); (n.children || []).forEach(node); };
  if (pic.kind === 'table') { (pic.head || []).forEach(add); (pic.rows || []).forEach((r) => r.forEach(add)); }
  else if (pic.kind === 'grid') { (pic.cols || []).forEach(add); (pic.rows || []).forEach(add); (pic.cells || []).forEach((r) => r.forEach(add)); add(pic.xTitle); add(pic.yTitle); }
  else if (pic.kind === 'cycle') { (pic.steps || []).forEach(add); add(pic.center); }
  else if (pic.kind === 'flow') (pic.steps || []).forEach((s) => (s && s.label ? (add(s.label), add(s.note)) : add(s)));
  else if (pic.kind === 'tree') { if (pic.root) node(pic.root); else bad.push('no root'); }
  else if (pic.kind === 'timeline') (pic.events || []).forEach((e) => { add(e.at); add(e.label); });
  if (bad.length) errs.push(`${at}: labels need nl and en text: ${bad.slice(0, 3).join(' ')}`);
  if (!pictureLabels(pic, 'nl').length) errs.push(`${at}: picture has no labels`);
  if (pic.kind === 'grid' && !((pic.cells || []).length && pic.cells.length === (pic.rows || []).length)) errs.push(`${at}: grid needs one row of cells per row label`);
  if (pic.kind === 'cycle' && !((pic.steps || []).length >= 3 && pic.steps.length <= 8)) errs.push(`${at}: a cycle has 3 to 8 steps`);
}

// The lessons of one language file against the module's picture file.
export function checkPictures(lessons, pictures, moduleId, lang, errs) {
  for (const l of lessons) {
    if (!l || !('pictures' in l)) continue;
    const at = `${lang} ${l.id}`;
    const ps = l.pictures;
    if (!Array.isArray(ps) || ps.length < 1 || ps.length > MAX_PICTURES) { errs.push(`${at}: pictures needs 1 to ${MAX_PICTURES} entries`); continue; }
    const teach = (l.teach || []).length;
    ps.forEach((p, i) => {
      const w = `${at} picture ${i}`;
      if (!p || typeof p.id !== 'string' || !p.id.startsWith(`${moduleId}.`) || !PICTURE_NAME.test(p.id)) errs.push(`${w}: id must be like ${moduleId}.<name>`);
      if (!(p && (p.after === 'example' || (Number.isInteger(p.after) && p.after >= 0 && p.after < teach)))) errs.push(`${w}: after must be a teach block 0 to ${teach - 1} or 'example'`);
      if (!(p && str(p.alt))) errs.push(`${w}: alt text missing`);
      else if (words(p.alt) > MAX_ALT_WORDS) errs.push(`${w}: alt has ${words(p.alt)} words (max ${MAX_ALT_WORDS})`);
      if (p && typeof p.id === 'string' && !(pictures && pictures[p.id])) errs.push(`${w}: picture ${p.id} is not in pictures/${moduleId}.js`);
    });
    if (new Set(ps.map((p) => p && p.id)).size !== ps.length) errs.push(`${at}: the same picture twice`);
  }
}

// en and nl show the same pictures in the same places.
export function checkPicturesParity(en, nl, errs) {
  for (const a of en) {
    const b = nl.find((x) => x && x.id === a.id);
    if (!b) continue;
    const key = (l) => JSON.stringify((l.pictures || []).map((p) => [p.id, p.after]));
    if (key(a) !== key(b)) errs.push(`${a.id}: pictures differ between en and nl (id and after must match)`);
  }
}

// The text of a lesson that supports its pictures: teach, example and terms.
export function lessonText(l) {
  const ex = l.example || {};
  return [...(l.teach || []), ex.text, ex.ask, ex.reveal, ...(l.terms || []).flatMap((x) => [x.term, x.def])].filter(Boolean).join('\n').toLowerCase();
}
// Every label of a lesson's pictures occurs in that lesson's text, in the same language.
export function checkPictureLabels(lesson, pictures, lang, errs) {
  const text = lessonText(lesson);
  for (const p of lesson.pictures || []) {
    const pic = pictures && pictures[p.id];
    if (!pic) continue;
    for (const label of pictureLabels(pic, lang)) if (!text.includes(label.toLowerCase())) errs.push(`${lang} ${lesson.id}: picture label "${label}" does not occur in the lesson text`);
  }
}

// All the picture checks of one module in both languages (validateModule and runAll call this).
export function checkModulePictures(en, nl, pictures, moduleId) {
  const errs = [];
  const files = { en: (en && en.lessons) || [], nl: (nl && nl.lessons) || [] };
  for (const lang of ['en', 'nl']) {
    checkPictures(files[lang], pictures, moduleId, lang, errs);
    for (const l of files[lang]) if (l && l.pictures) checkPictureLabels(l, pictures, lang, errs);
  }
  checkPicturesParity(files.en, files.nl, errs);
  for (const [id, pic] of Object.entries(pictures || {})) checkPictureData(pic, `picture ${id}`, errs);
  return errs;
}

// `node src/content/courses/validate.js` is the content validator the integrator
// runs before every push. It runs every check in this file, not only the
// openers: each module in both languages (validateModule), its intro and
// topics, the fields, the subject maps (wide and phone layout), the figure
// files, and the level openers. It prints every problem and exits 1 on any.
// Before Task 19 the file had no command-line part: running it did nothing.
export async function runAll() {
  const fs = await import('node:fs');
  const { MODULES, SUBJECTS, FIELDS, loadModule, loadPictures } = await import('./index.js');
  const { mapFor } = await import('./maps/index.js');
  const root = new URL('../../../', import.meta.url);
  const problems = [];
  const report = (label, errs) => {
    errs.forEach((e) => problems.push(`${label}: ${e}`));
    console.log(`${label}: ${errs.length} problems`);
  };
  report('fields', checkFields(FIELDS, MODULES));
  for (const subject of SUBJECTS) {
    const map = mapFor(subject);
    if (!map) continue;
    report(`map ${subject}`, checkMap(map, MODULES, FIELDS));
    if (map.phone) report(`map ${subject} phone`, checkMap({ subject: map.subject, ...map.phone }, MODULES, FIELDS));
  }
  for (const m of MODULES) {
    const [en, nl] = [await loadModule(m.subject, m.id, 'en'), await loadModule(m.subject, m.id, 'nl')];
    const errs = [...checkIntro(m), ...validateModule(en, nl, m)]; // validateModule includes checkTopics
    errs.push(...checkModulePictures(en, nl, fs.existsSync(new URL(`src/content/courses/pictures/${m.id}.js`, root)) ? await loadPictures(m.id) : null, m.id)); // v18 G1
    for (const lang of [en, nl]) {
      for (const l of lang.lessons.filter((x) => x.figure)) {
        if (!fs.existsSync(new URL(`src/content/courses/figures/${l.figure}.html`, root))) errs.push(`${l.id}: figure ${l.figure} missing`);
      }
    }
    errs.push(...await (await import('./validatebank.js')).bankProblems(m)); // a module without a bank passes
    report(`module ${m.id}`, errs);
  }
  for (const subject of SUBJECTS) {
    const openers = (await import(`./openers.${subject}.js`)).default;
    report(`openers ${subject} (${Object.keys(openers).length} topics)`, checkOpeners(MODULES.filter((m) => m.subject === subject), openers));
  }
  console.log(problems.length ? `\n${problems.length} problems in total:\n${problems.join('\n')}` : '\nvalidate: all content checks passed');
  return problems.length;
}

// The browser also loads this file (src/ui/subjectmap.js), so nothing Node-only
// is imported until we know we are the program being run.
if (typeof process !== 'undefined' && process.argv && process.argv[1]) {
  // Not a top-level await: runAll loads validatebank.js, which imports this file, and a
  // module that is still awaiting at the top level would wait on itself.
  import('node:url').then(({ pathToFileURL }) => {
    if (import.meta.url === pathToFileURL(process.argv[1]).href) return runAll().then((n) => { process.exitCode = n ? 1 : 0; });
  });
}

// Checks one course module (both languages) against the lesson schema. Used by
// the content tests and by whoever writes content. Returns a list of problems;
// an empty list means the module is valid. Pure.
import { containsAnswer } from '../../core/hint.js';

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

function checkQuestion(qn, where, errs) {
  if (!str(qn.q)) errs.push(`${where}: question text missing`);
  if (!str(qn.why)) errs.push(`${where}: why missing`);
  if ('number' in qn) {
    if (typeof qn.number !== 'number' || !Number.isFinite(qn.number)) errs.push(`${where}: number must be a number`);
    if (!(typeof qn.tolerance === 'number' && qn.tolerance > 0)) errs.push(`${where}: numeric question needs a tolerance > 0`);
    if (typeof qn.unit !== 'string') errs.push(`${where}: numeric question needs a unit (may be empty)`);
  } else {
    if (!Array.isArray(qn.options) || qn.options.length !== 4 || !qn.options.every(str)) errs.push(`${where}: needs 4 options`);
    else if (new Set(qn.options).size !== 4) errs.push(`${where}: options must be distinct`);
    if (!Array.isArray(qn.options) || !qn.options.includes(qn.answer)) errs.push(`${where}: answer not in options`);
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
  pre.forEach((qn, i) => checkQuestion(qn, `${at} pre ${i}`, errs));
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
  const recall = l.recall || [];
  if (recall.length < 3 || recall.length > 5) errs.push(`${at}: needs 3–5 recall questions`);
  recall.forEach((qn, i) => checkQuestion(qn, `${at} recall ${i}`, errs));
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
    (a.recall || []).forEach((qa, i) => {
      const qb = (b.recall || [])[i];
      if (qb && ('number' in qa) !== ('number' in qb)) errs.push(`${id} recall ${i}: numeric in one language only`);
      if (qb && 'number' in qa && qa.number !== qb.number) errs.push(`${id} recall ${i}: numbers differ between en and nl`);
      if (qb && qa.options && qb.options && qa.options.indexOf(qa.answer) !== qb.options.indexOf(qb.answer)) errs.push(`${id} recall ${i}: answer position differs between en and nl`);
    });
  }
  return errs;
}

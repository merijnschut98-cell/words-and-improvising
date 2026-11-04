// Checks one course module (both languages) against the lesson schema. Used by
// the content tests and by whoever writes content. Returns a list of problems;
// an empty list means the module is valid. Pure.

const MAX_BLOCK_WORDS = 90;
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

function checkLesson(l, meta, lang, errs) {
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
  // In a topic module the example kind follows the lesson's level in its topic
  // (a complete topic has 4 levels; a partly written one falls back to meta.level).
  const topic = (meta.topics || []).find((t) => (t.levels || []).length === 4 && t.levels.includes(l.id));
  const level = topic ? topic.levels.indexOf(l.id) + 1 : meta.level;
  if (ex.kind === 'faded' && level < 3) errs.push(`${at}: faded example only at level 3–4`);
  if (ex.kind === 'worked' && level >= 3) errs.push(`${at}: level 3–4 uses a faded example`);
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
}

export function validateModule(en, nl, meta) {
  const errs = [];
  const byLang = { en, nl };
  for (const lang of ['en', 'nl']) {
    const lessons = (byLang[lang] && byLang[lang].lessons) || [];
    const ids = lessons.map((l) => l && l.id);
    for (const id of meta.lessons) if (!ids.includes(id)) errs.push(`${lang}: lesson ${id} missing`);
    for (const id of ids) if (!meta.lessons.includes(id)) errs.push(`${lang}: lesson ${id} not in the index`);
    if (ids.join() !== meta.lessons.filter((id) => ids.includes(id)).join()) errs.push(`${lang}: lessons out of index order`);
    for (const l of lessons) if (l && meta.lessons.includes(l.id)) checkLesson(l, meta, lang, errs);
  }
  // Same shape in both languages: question counts and numeric answers match.
  for (const id of meta.lessons) {
    const a = ((en && en.lessons) || []).find((l) => l.id === id);
    const b = ((nl && nl.lessons) || []).find((l) => l.id === id);
    if (!a || !b) continue;
    if ((a.recall || []).length !== (b.recall || []).length) errs.push(`${id}: recall counts differ between en and nl`);
    if ((a.pre || []).length !== (b.pre || []).length) errs.push(`${id}: pre counts differ between en and nl`);
    (a.recall || []).forEach((qa, i) => {
      const qb = (b.recall || [])[i];
      if (qb && ('number' in qa) !== ('number' in qb)) errs.push(`${id} recall ${i}: numeric in one language only`);
      if (qb && 'number' in qa && qa.number !== qb.number) errs.push(`${id} recall ${i}: numbers differ between en and nl`);
      if (qb && qa.options && qb.options && qa.options.indexOf(qa.answer) !== qb.options.indexOf(qb.answer)) errs.push(`${id} recall ${i}: answer position differs between en and nl`);
    });
  }
  return errs;
}

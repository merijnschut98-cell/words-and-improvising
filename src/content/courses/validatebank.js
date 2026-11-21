// Validator for the practice-test banks and blueprints (v18 T1, design 3.2).
// A bank is one file per module and language, banks/<moduleId>.<lang>.js:
//   export default { items: [ { id: 'b1', topic, level, source: { lesson, quote }, ...question } ], retired: ['b9'] }
// A blueprint is one file per module, banks/<moduleId>.blueprint.js:
//   export default { module, topics: { <topicId>: { 1|2|3|4: { aims: { nl: [..], en: [..] }, traps: { nl: [..], en: [..] } } } } }
// The validator returns { errors, warnings }. Errors break the build; warnings
// are size shortfalls, reported until the banks exist. Pure, so the browser
// can load it too (the AI test generator checks its items with the same rules).
import { KINDS, kindOf } from '../../core/questionkinds.js';
import { checkQuestion, checkKindParity, checkSelectAllSpread } from './validate.js';

// Test sizes of the design (3.2) and the share of a test that comes from the bank.
export const TEST_SIZES = { topic: 12, level: 16, mix: 20 };
export const BANK_SHARE = 0.6;
export const MIN_PER_TOPIC_LEVEL = 2;
export const MIN_PER_TOPIC = Math.ceil(TEST_SIZES.topic * BANK_SHARE); // 8
export const MIN_KINDS_PER_TOPIC = 3;
export const MIN_LEVEL_POOL = Math.ceil(TEST_SIZES.level * BANK_SHARE); // 10 items at levels <= N
export const MIN_LEVEL_TOP = Math.ceil(MIN_LEVEL_POOL / 2); // 5 of them at level N
export const MIN_QUOTE_WORDS = 4;
export const AIMS = [1, 2];
export const TRAPS = [3, 6];
export const ITEM_ID = /^b[1-9]\d*$/;

const str = (v) => typeof v === 'string' && v.trim().length > 0;
const wordCount = (s) => String(s).trim().split(/\s+/).filter(Boolean).length;

// Whitespace and quote style do not matter when a source is looked up: curly
// and straight quotes, the dash family and runs of spaces are one thing.
export function normText(s) {
  return String(s ?? '')
    .normalize('NFKC')
    .replace(/[‘’‚′`´]/g, "'")
    .replace(/[“”„″«»]/g, '"')
    .replace(/[‐‑‒–—−]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

// The text a source may quote, per block (a quote may not straddle two blocks):
// title, teach blocks, the example, and the terms with their definitions.
export function lessonBlocks(lesson) {
  if (!lesson) return [];
  const ex = lesson.example || {};
  const terms = (lesson.terms || []).flatMap((t) => (t ? [t.term, t.def] : []));
  return [lesson.title, ...(lesson.teach || []), ex.text, ex.ask, ex.reveal, ...terms].filter(str).map(normText);
}

export const quoteOccurs = (lesson, quote) => {
  const q = normText(quote);
  return q.length > 0 && lessonBlocks(lesson).some((b) => b.includes(q));
};

// One bank, one language. lessons: the module's lessons in that language.
function checkItems(bank, meta, lessons, lang, errs) {
  const items = bank && Array.isArray(bank.items) ? bank.items : null;
  if (!items) { errs.push(`${lang}: bank needs an items array`); return []; }
  const topics = new Map((meta.topics || []).map((t) => [t.id, t]));
  const byId = new Map((lessons || []).map((l) => [l.id, l]));
  const retired = new Set(Array.isArray(bank.retired) ? bank.retired : []);
  const seen = new Set();
  for (const [n, it] of items.entries()) {
    const at = `${lang} bank ${it && it.id ? it.id : `item ${n}`}`;
    if (!it || typeof it !== 'object') { errs.push(`${at}: not an object`); continue; }
    if (typeof it.id !== 'string' || !ITEM_ID.test(it.id)) errs.push(`${at}: id must look like b1, b2 (stable, never reused)`);
    else if (seen.has(it.id)) errs.push(`${at}: duplicate id`);
    else if (retired.has(it.id)) errs.push(`${at}: id was retired and may not be reused`);
    seen.add(it.id);
    checkQuestion(it, at, errs, lang);
    if (/[<>]/.test(JSON.stringify(it))) errs.push(`${at}: no < or > allowed in text`);
    const t = topics.get(it.topic);
    if (!t) errs.push(`${at}: topic ${JSON.stringify(it.topic)} is not a topic of ${meta.id}`);
    if (!Number.isInteger(it.level) || it.level < 1 || it.level > 4) errs.push(`${at}: level must be 1, 2, 3 or 4`);
    const s = it.source;
    if (!s || typeof s !== 'object' || !str(s.lesson) || !str(s.quote)) { errs.push(`${at}: source needs { lesson, quote }`); continue; }
    const lesson = byId.get(s.lesson);
    if (!lesson) { errs.push(`${at}: source lesson ${s.lesson} is not in the module`); continue; }
    if (t && Number.isInteger(it.level) && (t.levels || [])[it.level - 1] !== s.lesson) errs.push(`${at}: source lesson ${s.lesson} is not the level ${it.level} lesson of topic ${it.topic}`);
    if (wordCount(s.quote) < MIN_QUOTE_WORDS) errs.push(`${at}: source quote is under ${MIN_QUOTE_WORDS} words; quote a whole sentence`);
    else if (!quoteOccurs(lesson, s.quote)) errs.push(`${at}: source quote does not occur in the text of ${s.lesson} (${lang})`);
  }
  const objs = items.filter((x) => x && typeof x === 'object');
  checkSelectAllSpread([{ recall: objs }], `${lang} bank`, errs);
  return objs;
}

// nl and en carry the same items: same ids, topic, level, source lesson, kind,
// key positions and counts. The wording of a gap's accepted words is free.
function checkParity(en, nl, errs) {
  const a = new Map(en.map((x) => [x.id, x]));
  const b = new Map(nl.map((x) => [x.id, x]));
  for (const id of a.keys()) if (!b.has(id)) errs.push(`bank ${id}: missing in nl`);
  for (const id of b.keys()) if (!a.has(id)) errs.push(`bank ${id}: missing in en`);
  for (const [id, qa] of a) {
    const qb = b.get(id);
    if (!qb) continue;
    const at = `bank ${id}`;
    for (const k of ['topic', 'level']) if (qa[k] !== qb[k]) errs.push(`${at}: ${k} differs between en and nl`);
    if ((qa.source || {}).lesson !== (qb.source || {}).lesson) errs.push(`${at}: source lesson differs between en and nl`);
    checkKindParity(qa, qb, at, errs);
    if (kindOf(qa) !== kindOf(qb)) continue;
    if (kindOf(qa) === 'num' && qa.number !== qb.number) errs.push(`${at}: numbers differ between en and nl`);
    if (qa.options && qb.options && qa.answer !== undefined && qa.options.indexOf(qa.answer) !== qb.options.indexOf(qb.answer)) errs.push(`${at}: answer position differs between en and nl`);
  }
}

// How many items the tests will need. Warnings only: the banks arrive in the module passes.
function checkSizes(items, meta, warns) {
  const count = (f) => items.filter(f).length;
  for (const k of KINDS) if (!count((x) => kindOf(x) === k)) warns.push(`no ${k} item in the bank`);
  for (const t of meta.topics || []) {
    const mine = items.filter((x) => x.topic === t.id);
    if (mine.length < MIN_PER_TOPIC) warns.push(`topic ${t.id}: ${mine.length} items, the topic test needs ${MIN_PER_TOPIC}`);
    const kinds = new Set(mine.map(kindOf));
    if (kinds.size < MIN_KINDS_PER_TOPIC) warns.push(`topic ${t.id}: ${kinds.size} kinds, needs at least ${MIN_KINDS_PER_TOPIC}`);
    for (const level of [1, 2, 3, 4]) {
      const n = mine.filter((x) => x.level === level).length;
      if (n < MIN_PER_TOPIC_LEVEL) warns.push(`topic ${t.id} level ${level}: ${n} items, needs ${MIN_PER_TOPIC_LEVEL}`);
    }
  }
  for (const level of [1, 2, 3, 4]) {
    const pool = count((x) => x.level <= level);
    const top = count((x) => x.level === level);
    if (pool < MIN_LEVEL_POOL) warns.push(`level test ${level}: ${pool} items up to level ${level}, needs ${MIN_LEVEL_POOL}`);
    if (top < MIN_LEVEL_TOP) warns.push(`level test ${level}: ${top} items at level ${level}, needs ${MIN_LEVEL_TOP}`);
  }
}

// The blueprint: per topic and level 1–2 aims and 3–6 traps, in nl and en.
export function checkBlueprint(bp, meta) {
  const errs = [];
  if (!bp || typeof bp !== 'object') return [`blueprint ${meta.id}: missing`];
  if (bp.module !== meta.id) errs.push(`blueprint ${meta.id}: module must be '${meta.id}'`);
  const topics = bp.topics && typeof bp.topics === 'object' ? bp.topics : {};
  const ids = (meta.topics || []).map((t) => t.id);
  for (const id of Object.keys(topics)) if (!ids.includes(id)) errs.push(`blueprint ${meta.id}: unknown topic ${id}`);
  for (const id of ids) {
    if (!topics[id]) { errs.push(`blueprint ${meta.id}: topic ${id} missing`); continue; }
    for (const key of Object.keys(topics[id])) if (!['1', '2', '3', '4'].includes(key)) errs.push(`blueprint ${meta.id} ${id}: unknown level ${key}`);
    for (const level of [1, 2, 3, 4]) {
      const at = `blueprint ${meta.id} ${id} level ${level}`;
      const e = topics[id][level];
      if (!e || typeof e !== 'object') { errs.push(`${at}: missing`); continue; }
      for (const [field, [lo, hi]] of [['aims', AIMS], ['traps', TRAPS]]) {
        const v = e[field];
        if (!v || typeof v !== 'object') { errs.push(`${at}: ${field} needs nl and en`); continue; }
        for (const lang of ['nl', 'en']) {
          if (!Array.isArray(v[lang]) || v[lang].length < lo || v[lang].length > hi || !v[lang].every(str)) errs.push(`${at}: ${field} ${lang} needs ${lo}–${hi} texts`);
          else if (new Set(v[lang]).size !== v[lang].length) errs.push(`${at}: ${field} ${lang} has a duplicate`);
        }
        if (Array.isArray(v.nl) && Array.isArray(v.en) && v.nl.length !== v.en.length) errs.push(`${at}: ${field} count differs between nl and en`);
      }
    }
  }
  return errs;
}

// bankEn, bankNl: the bank files' default exports. blueprint: its default export.
// lessons: { en: [lesson], nl: [lesson] } (the module's lessons).
export function checkBank(bankEn, bankNl, blueprint, meta, lessons) {
  const errors = [];
  const warnings = [];
  if (!Array.isArray(meta.topics)) return { errors: [`${meta.id}: a bank needs a module with topics`], warnings };
  const en = checkItems(bankEn, meta, lessons.en, 'en', errors);
  const nl = checkItems(bankNl, meta, lessons.nl, 'nl', errors);
  checkParity(en, nl, errors);
  errors.push(...checkBlueprint(blueprint, meta));
  checkSizes(en, meta, warnings);
  return { errors, warnings };
}

// One module of the real course. A module without a bank passes; a module with
// some of the three files, but not all, does not.
// load: async ('en' | 'nl' | 'blueprint') => default export, or null when there is no such file.
// lessonsOf: async (lang) => the module's lessons in that language.
export async function checkModuleBank(meta, load, lessonsOf) {
  const [en, nl, bp] = [await load('en'), await load('nl'), await load('blueprint')];
  if (!en && !nl && !bp) return { errors: [], warnings: [], present: false };
  const errors = [];
  if (!en) errors.push(`${meta.id}: bank file for en missing`);
  if (!nl) errors.push(`${meta.id}: bank file for nl missing`);
  if (!bp) errors.push(`${meta.id}: blueprint file missing`);
  if (errors.length) return { errors, warnings: [], present: true };
  const r = checkBank(en, nl, bp, meta, { en: await lessonsOf('en'), nl: await lessonsOf('nl') });
  return { ...r, present: true };
}

// The line runAll adds per module (node only, so the browser never loads fs):
// loads the module's bank files from disk, prints warnings and returns the errors.
export async function bankProblems(meta) {
  const fs = await import('node:fs');
  const { loadModule } = await import('./index.js');
  const dir = new URL('./banks/', import.meta.url);
  const load = async (which) => {
    const file = new URL(`${meta.id}.${which}.js`, dir);
    return fs.existsSync(file) ? (await import(file.href)).default : null;
  };
  const r = await checkModuleBank(meta, load, async (lang) => (await loadModule(meta.subject, meta.id, lang)).lessons);
  if (r.present) {
    r.warnings.forEach((w) => console.log(`  bank warning ${meta.id}: ${w}`));
    console.log(`bank ${meta.id}: ${r.errors.length} problems, ${r.warnings.length} warnings`);
  }
  return r.errors;
}

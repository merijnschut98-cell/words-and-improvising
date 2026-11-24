// AI-generated extra tests (v18 T3, design 3.3). On a topic that has a test bank, a tap asks the model for ten
// more items in the bank's shape, from the lesson text only, then checks them before they are shown:
//   1. schema: the same checkQuestion and kind rules as the validator (checkBankItem);
//   2. local quality: the question lint must report zero, the source sentence must occur in the lesson text,
//      the stem may not be a near-duplicate of a bank item, a lesson question or another item of the set;
//   3. an independent blind check (Q8 A): a second call gets the items without their keys plus the lesson text and
//      answers each; an item is kept only if that answer equals the key, it is unambiguous and no option is nonsense.
// Fewer than six survivors: the set is topped up from the bank ("aangevuld met vaste vragen").
// Sent to the API: lesson titles, gists, teach blocks, terms and examples, the blueprint's aims and traps, three
// bank items as exemplars and the level mix. Nothing personal: no work context, no progress, no settings. The key
// goes to the SDK constructor (callClaude) and nowhere else: not into a request body, a result, the cache or the log.
// Generated items never join the recurring reviews (Q7 A); a miss on one makes that lesson's recall questions due today.
// The last five sets per topic are cached on the device (localStorage, never synced) for use offline.
import { callClaude, withFallbacks, lastJson } from './claude.js';
import { grade, kindOf, shuffled } from './questionkinds.js';
import { checkBankItem, normText } from '../content/courses/validatebank.js';
import { lintQuestion } from './questionlint.js';
import { levelQuotas } from './practicetest.js';
import { recallQuestions, countRound } from './course.js';
import { bankQuestionId, lessonOf, topicsOf } from '../content/courses/index.js';

export const EXTRA_SIZE = 10;
export const MIN_SURVIVORS = 6;
export const CACHE_SETS = 5;
export const MAX_FLAGS = 100;
const SETS_KEY = 'vp:testgen:v1';
const FLAGS_KEY = 'vp:testgen:flags:v1';
const SESSIONS_CAP = 200;
const DUP_RATIO = 0.8;
const KEEP_FIELDS = ['kind', 'q', 'why', 'options', 'answer', 'answers', 'close', 'number', 'tolerance', 'unit', 'text', 'accept', 'choices', 'items', 'pairs'];
const language = (lang) => (lang === 'en' ? 'English' : 'Dutch');
const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

// The button needs a key and a bank. Without them the bank tests work as normal.
export const extraAvailable = (settings, moduleId, hasBank) => !!(settings && String(settings.apiKey || '').trim()) && !!hasBank(moduleId);

// The lessons of a topic with their level: [{ level, lesson }] for the lessons found in `lessons`.
export function topicLessons(meta, topicId, lessons) {
  const topic = (topicsOf(meta) || []).find((t) => t.id === topicId);
  if (!topic) return [];
  return (topic.levels || []).map((id, i) => ({ level: i + 1, lesson: (lessons || []).find((l) => l && l.id === id) })).filter((x) => x.lesson);
}

const lessonText = (l) => [l.title, ...(l.teach || []), l.example && l.example.text, ...(l.terms || []).flatMap((t) => [t.term, t.def])].filter(Boolean).join(' ');

// ---- the request ----
const STR = { type: 'string' };
const STRS = { type: 'array', items: STR };
const ITEM_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['kind', 'level', 'q', 'why', 'source'],
  properties: {
    kind: { type: 'string', enum: ['mc', 'best', 'all', 'gap', 'num', 'order', 'match'] },
    level: { type: 'integer' },
    q: STR,
    why: STR,
    source: { type: 'object', additionalProperties: false, required: ['lesson', 'quote'], properties: { lesson: STR, quote: STR } },
    options: STRS, answer: STR, answers: STRS, close: STR,
    number: { type: 'number' }, tolerance: { type: 'number' }, unit: STR,
    text: STR, accept: STRS, choices: STRS,
    items: STRS, pairs: { type: 'array', items: STRS },
  },
};
const GEN_SCHEMA = { type: 'object', additionalProperties: false, required: ['items'], properties: { items: { type: 'array', items: ITEM_SCHEMA } } };

// Three bank items of the topic as exemplars: different kinds, the higher levels first.
function exemplarsOf(bank, topicId) {
  const mine = ((bank && bank.items) || []).filter((b) => b && b.topic === topicId);
  const byLevel = [...mine].sort((a, b) => b.level - a.level);
  const out = [];
  const kinds = new Set();
  for (const it of byLevel) { if (out.length < 3 && !kinds.has(kindOf(it))) { kinds.add(kindOf(it)); out.push(it); } }
  for (const it of byLevel) { if (out.length < 3 && !out.includes(it)) out.push(it); }
  return out.map(({ id, ...rest }) => rest); // the bank id is not needed and not sent
}

export function buildGenRequest({ meta, topicId, lessons, blueprint, bank, lang, model, count = EXTRA_SIZE }) {
  const rows = topicLessons(meta, topicId, lessons);
  const bp = (((blueprint || {}).topics || {})[topicId]) || {};
  const l2 = lang === 'en' ? 'en' : 'nl';
  const plan = {};
  for (const { level } of rows) {
    const e = bp[level] || {};
    plan[level] = { aims: ((e.aims || {})[l2]) || [], traps: ((e.traps || {})[l2]) || [] };
  }
  const body = {
    topic: topicId,
    count,
    levelMix: levelQuotas({ type: 'topic', size: count }),
    lessons: rows.map(({ level, lesson }) => ({
      id: lesson.id, level, title: lesson.title, gist: lesson.gist || '', teach: lesson.teach || [], terms: lesson.terms || [],
      example: lesson.example ? { text: lesson.example.text, ask: lesson.example.ask, reveal: lesson.example.reveal } : undefined,
    })),
    blueprint: plan,
    exemplars: exemplarsOf(bank, topicId),
  };
  return withFallbacks({
    model,
    max_tokens: 6000,
    system: [
      `You write extra practice-test questions for one topic of a course for junior consultants. Write exactly ${count} questions in ${language(lang)}.`,
      'Test only what the lesson text says: every question must rest on one sentence of the lesson of its level. Copy that sentence word for word into source.quote (at least six words, one sentence, from the teach blocks, gist, example or terms), and put the id of that lesson in source.lesson. A question of level N uses the lesson of level N.',
      'Follow levelMix (how many questions per level). Use at least three different kinds. Kinds: mc and best (4 options, one answer; best also needs close, the runner-up, and the stem must contain the word "best"/"beste"), all (4 to 6 options, answers is a proper subset), gap (text with exactly one ___, accept 1 to 4 words, optional choices of 4 to 6 words including the first accepted word), num (number, tolerance above 0, unit), order (3 to 6 items in the right order), match (3 to 5 pairs).',
      'Match the exemplars in difficulty and style. Higher levels use a concrete scenario with a decision, not a definition. Wrong options come from the blueprint traps: things a real colleague might believe. No option that nobody would choose, no "none of the above", no absolute words (always, never, only, all) in wrong options only, options of similar length.',
      'Every question has a why: one or two sentences saying why the answer is right, from the lesson. No markup, no < or >. Do not repeat a question of the exemplars or of the lesson.',
    ].join('\n'),
    messages: [{ role: 'user', content: JSON.stringify(body) }],
    output_config: { effort: 'low', format: { type: 'json_schema', schema: GEN_SCHEMA } },
  });
}

// ---- parsing ----
// The text as JSON; tolerates a code fence and prose around it. undefined when it is not JSON.
function parseLoose(text) {
  const s = String(text || '').trim();
  const tryParse = (x) => { try { return JSON.parse(x); } catch { return undefined; } };
  let v = tryParse(s);
  if (v !== undefined) return v;
  const fenced = s.replace(/^```[a-zA-Z]*\s*/, '').replace(/\s*```$/, '');
  v = tryParse(fenced);
  if (v !== undefined) return v;
  for (const [open, close] of [['{', '}'], ['[', ']']]) {
    const a = s.indexOf(open);
    const b = s.lastIndexOf(close);
    if (a >= 0 && b > a) { v = tryParse(s.slice(a, b + 1)); if (v !== undefined) return v; }
  }
  return undefined;
}

function lastText(message) {
  if (!message || message.stop_reason === 'refusal') return { error: 'refusal' };
  if (message.stop_reason === 'max_tokens') return { error: 'parse' };
  const texts = (message.content || []).filter((b) => b && b.type === 'text');
  const last = texts[texts.length - 1];
  return last ? { text: last.text } : { error: 'parse' };
}

// One model item reduced to the known fields: no id, no lintOk, no hint; nulls dropped; the topic is the requested one.
export function normalizeItem(raw, topicId) {
  const out = {};
  for (const k of KEEP_FIELDS) if (raw[k] !== undefined && raw[k] !== null) out[k] = typeof raw[k] === 'string' ? raw[k].trim() : raw[k];
  const lvl = Number(raw.level);
  out.level = Number.isInteger(lvl) ? lvl : raw.level;
  out.topic = topicId || raw.topic;
  if (isObj(raw.source)) out.source = { lesson: String(raw.source.lesson ?? '').trim(), quote: String(raw.source.quote ?? '').trim() };
  return out;
}

// -> { ok, items } | { ok:false, error:'refusal'|'parse' }
export function parseGenerated(message, topicId) {
  const t = lastText(message);
  if (t.error) return { ok: false, error: t.error };
  const v = parseLoose(t.text);
  const list = Array.isArray(v) ? v : v && Array.isArray(v.items) ? v.items : null;
  const items = (list || []).filter(isObj).map((x) => normalizeItem(x, topicId));
  return items.length ? { ok: true, items } : { ok: false, error: 'parse' };
}

// ---- local checks ----
const words = (s) => normText(s).toLowerCase().replace(/[^\p{L}\p{N}\s]+/gu, ' ').split(/\s+/).filter(Boolean);

// What a stem is made of: the question, and for the kinds whose q is generic ("Fill in the missing word") the text,
// the items or the pairs.
export function stemOf(it) {
  return [it.q, it.text, ...(Array.isArray(it.items) ? it.items : []), ...(Array.isArray(it.pairs) ? it.pairs.flat() : [])].filter((x) => typeof x === 'string').join(' ');
}

export function nearDuplicate(a, b) {
  const wa = words(a);
  const wb = words(b);
  if (!wa.length || !wb.length) return false;
  if (wa.join(' ') === wb.join(' ')) return true;
  const A = new Set(wa);
  const B = new Set(wb);
  const shared = [...A].filter((w) => B.has(w)).length;
  const union = new Set([...A, ...B]).size;
  return shared / union >= DUP_RATIO;
}

// The reasons an item is not good enough, [] when it passes stages 1 and 2.
// ctx: { meta, lessons (module lessons in lang), bank, lang, topicId?, accepted?: stems of items already kept }
export function checkLocal(item, ctx) {
  const lang = ctx.lang === 'en' ? 'en' : 'nl';
  const schema = checkBankItem(item, ctx.meta, ctx.lessons, lang, 'item').map((e) => `schema: ${e.replace(/^item: /, '')}`);
  if (ctx.topicId && item && item.topic !== ctx.topicId) schema.push(`schema: topic must be ${ctx.topicId}`);
  if (schema.length) return schema;
  const reasons = [];
  const lesson = (ctx.lessons || []).find((l) => l.id === item.source.lesson) || {};
  const { lintOk, ...plain } = item; // lintOk is for the course content; a model may not switch the lint off
  const topicText = [lesson.title, ...(lesson.teach || []), lesson.example && lesson.example.text, lesson.said, ...(lesson.terms || []).flatMap((t) => [t.term, t.def])].filter(Boolean).join(' ');
  for (const f of lintQuestion(plain, { lang, tier: item.level, kind: 'recall', topicText })) reasons.push(`lint ${f.rule}: ${f.detail}`);
  const stem = stemOf(item);
  const bankHit = ((ctx.bank && ctx.bank.items) || []).find((b) => nearDuplicate(stem, stemOf(b)));
  if (bankHit) reasons.push(`duplicate of bank item ${bankHit.id}`);
  for (const l of ctx.lessons || []) {
    const hit = [...recallQuestions(l), ...(l.pre || [])].find((q) => nearDuplicate(stem, stemOf(q)));
    if (hit) { reasons.push(`duplicate of a lesson question (${l.id})`); break; }
  }
  if ((ctx.accepted || []).some((s) => nearDuplicate(stem, s))) reasons.push('duplicate of another item in the set');
  return reasons;
}

// -> { kept: [item], rejected: [{ item, reasons }] }. Entries that are not objects are ignored.
export function localFilter(rawItems, ctx) {
  const kept = [];
  const rejected = [];
  const accepted = [];
  for (const raw of rawItems || []) {
    if (!isObj(raw)) continue;
    const item = normalizeItem(raw, ctx.topicId);
    const reasons = checkLocal(item, { ...ctx, accepted });
    if (reasons.length) { rejected.push({ item, reasons }); continue; }
    kept.push(item);
    accepted.push(stemOf(item));
  }
  return { kept, rejected };
}

// ---- the independent check ----
const VERDICT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['verdicts'],
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['n', 'unambiguous', 'nonsenseOption'],
        properties: {
          n: { type: 'integer' }, pick: STR, picks: STRS, text: STR, number: { type: 'number' }, order: STRS, pairs: { type: 'array', items: STRS },
          unambiguous: { type: 'boolean' }, nonsenseOption: { type: 'boolean' },
        },
      },
    },
  },
};

// An item as the checker sees it: the question and what is needed to answer it, never the key.
function blind(it, n) {
  const seed = `${it.q}|${n}`;
  switch (kindOf(it)) {
    case 'num': return { n, kind: 'num', q: it.q, unit: it.unit || '' };
    case 'gap': return { n, kind: 'gap', q: it.q, text: it.text, ...(Array.isArray(it.choices) ? { choices: shuffled(it.choices, seed) } : {}) };
    case 'order': return { n, kind: 'order', q: it.q, items: shuffled(it.items, seed) };
    case 'match': return { n, kind: 'match', q: it.q, left: it.pairs.map((p) => p[0]), right: shuffled(it.pairs.map((p) => p[1]), seed) };
    case 'all': return { n, kind: 'all', q: it.q, options: shuffled(it.options, seed) };
    case 'best': return { n, kind: 'best', q: it.q, options: shuffled(it.options, seed) };
    default: return { n, kind: 'mc', q: it.q, options: shuffled(it.options, seed) };
  }
}

export function buildVerifyRequest({ items, meta, topicId, lessons, lang, model }) {
  const cited = new Set(items.map((it) => it.source && it.source.lesson));
  const rows = topicLessons(meta, topicId, lessons).filter((r) => cited.has(r.lesson.id));
  const body = {
    lessons: rows.map(({ lesson }) => ({ id: lesson.id, title: lesson.title, gist: lesson.gist || '', teach: lesson.teach || [], terms: lesson.terms || [], example: lesson.example ? { text: lesson.example.text, ask: lesson.example.ask, reveal: lesson.example.reveal } : undefined })),
    items: items.map((it, n) => blind(it, n)),
  };
  return withFallbacks({
    model,
    max_tokens: 3000,
    system: [
      `You check practice questions blind: you do not know the intended answers. Answer each item using only the lesson text, as a careful student would. Text is in ${language(lang)}.`,
      'Per item give n and your answer: mc and best: pick (the option text, exactly as written); all: picks (every option you tick); gap: text (the word); num: number; order: order (all items in your order, exactly as written); match: pairs (each left item with its right item, [left, right]).',
      'Also judge two things. unambiguous: true only if exactly one answer (or one set, or one order, or one pairing) can be defended from the lesson text. nonsenseOption: true if any option, word or item is one that no one would ever choose, or is wrong in a way no careful reader could confuse with the answer.',
    ].join('\n'),
    messages: [{ role: 'user', content: JSON.stringify(body) }],
    output_config: { effort: 'low', format: { type: 'json_schema', schema: VERDICT_SCHEMA } },
  });
}

// -> { ok, verdicts } | { ok:false, error }
export function parseVerdicts(message) {
  const t = lastText(message);
  if (t.error) return { ok: false, error: t.error };
  const v = parseLoose(t.text);
  const list = Array.isArray(v) ? v : v && Array.isArray(v.verdicts) ? v.verdicts : null;
  const verdicts = (list || []).filter((x) => isObj(x) && Number.isInteger(x.n));
  return verdicts.length ? { ok: true, verdicts } : { ok: false, error: 'parse' };
}

function answerOf(it, v) {
  switch (kindOf(it)) {
    case 'all': return v.picks;
    case 'gap': return v.text;
    case 'num': return v.number;
    case 'order': return v.order;
    case 'match': return v.pairs;
    default: return v.pick;
  }
}

// Stage 3: keep an item only if the checker's answer equals the key, it is unambiguous and no option is nonsense.
// -> { kept: [item], rejected: [{ item, reasons }] }
export function mergeVerdicts(items, verdicts) {
  const byN = new Map((Array.isArray(verdicts) ? verdicts : []).filter((v) => isObj(v)).map((v) => [v.n, v]));
  const kept = [];
  const rejected = [];
  items.forEach((item, n) => {
    const v = byN.get(n);
    const reasons = [];
    if (!v) reasons.push('no verdict from the checker');
    else {
      const given = answerOf(item, v);
      if (given === undefined || given === null || !grade(item, given).ok) reasons.push('the checker\'s answer differs from the key');
      if (v.unambiguous !== true) reasons.push('ambiguous: more than one answer can be defended');
      if (v.nonsenseOption !== false) reasons.push('nonsense option');
    }
    if (reasons.length) rejected.push({ item, reasons }); else kept.push(item);
  });
  return { kept, rejected };
}

// ---- the set ----
// Survivors become the set (at most `size`); fewer than `min` of them: topped up from the bank to `size`.
// Generated items get ids <lesson>#g<n>: not a bank id, not a recall id, so they never reach the review pile.
// -> { items, toppedUp }
export function assembleSet({ kept, meta, topicId, bank, size = EXTRA_SIZE, min = MIN_SURVIVORS, seed = 'extra' }) {
  const ai = (kept || []).slice(0, size).map((it, i) => ({ ...it, topic: it.topic || topicId, id: `${it.source.lesson}#g${i + 1}`, src: 'ai' }));
  if (ai.length >= min) return { items: ai, toppedUp: 0 };
  const quotas = levelQuotas({ type: 'topic', size });
  for (const q of ai) if (quotas[q.level] > 0) quotas[q.level] -= 1;
  const stems = ai.map(stemOf);
  const pool = shuffled(((bank && bank.items) || []).filter((b) => b && b.topic === topicId && !stems.some((s) => nearDuplicate(s, stemOf(b)))), seed);
  const out = [...ai];
  while (out.length < size && pool.length) {
    // the level with the most places left first, ties in the shuffled order
    let best = 0;
    pool.forEach((b, i) => { if ((quotas[b.level] || 0) > (quotas[pool[best].level] || 0)) best = i; });
    const [b] = pool.splice(best, 1);
    if (quotas[b.level] > 0) quotas[b.level] -= 1;
    out.push({ ...b, id: bankQuestionId(b), src: 'bank', topic: b.topic });
  }
  return { items: out, toppedUp: out.length - ai.length };
}

// The whole run: generate, check, verify, assemble. args: { apiKey, meta, topicId, lessons, blueprint, bank, lang, model, now? }
// -> { ok:true, id, ts, items, toppedUp, stats:{ generated, local, verified } } | { ok:false, error, detail? }
export async function generateExtra(args, loadSdk) {
  const { apiKey, meta, topicId, lessons, bank, lang } = args;
  if (!apiKey || !String(apiKey).trim()) return { ok: false, error: 'nokey' };
  const ts = args.now || Date.now();
  let first;
  try { first = await callClaude(apiKey, buildGenRequest(args), loadSdk); } catch { return { ok: false, error: 'unknown' }; }
  if (!first.ok) return first;
  const parsed = parseGenerated(first.message, topicId);
  if (!parsed.ok) return parsed;
  const ctx = { meta, lessons, bank, lang, topicId };
  const local = localFilter(parsed.items, ctx);
  let kept = [];
  if (local.kept.length) {
    // An item that was not checked independently is not shown: a failed check tops up from the bank.
    try {
      const second = await callClaude(apiKey, buildVerifyRequest({ items: local.kept, meta, topicId, lessons, lang, model: args.model }), loadSdk);
      const verdicts = second.ok ? parseVerdicts(second.message) : null;
      if (verdicts && verdicts.ok) kept = mergeVerdicts(local.kept, verdicts.verdicts).kept;
    } catch { kept = []; }
  }
  const set = assembleSet({ kept, meta, topicId, bank, seed: String(ts) });
  return { ok: true, id: `g${ts.toString(36)}`, ts, items: set.items, toppedUp: set.toppedUp, stats: { generated: parsed.items.length, local: local.kept.length, verified: kept.length } };
}

// ---- the offline cache: the last five sets per topic and language, on this device only ----
export const setKey = (lang, moduleId, topicId) => `${lang === 'en' ? 'en' : 'nl'}|${moduleId}|${topicId}`;

function readJson(storage, key, fallback) {
  try {
    const raw = storage && storage.getItem(key);
    if (!raw) return fallback;
    const v = JSON.parse(raw);
    return v == null ? fallback : v;
  } catch { return fallback; }
}
function writeJson(storage, key, value) {
  try { if (storage) storage.setItem(key, JSON.stringify(value)); } catch { /* full or blocked: the cache is a convenience */ }
}

const validSet = (s) => isObj(s) && typeof s.id === 'string' && typeof s.ts === 'number' && Array.isArray(s.items) && s.items.every(isObj);

export function readSets(storage, key) {
  const all = readJson(storage, SETS_KEY, {});
  const list = isObj(all) ? all[key] : null;
  return Array.isArray(list) ? list.filter(validSet) : [];
}

// Newest first, five kept; the same set id twice is one set.
export function saveSet(storage, key, set) {
  const all = readJson(storage, SETS_KEY, {});
  const base = isObj(all) ? all : {};
  const rest = (Array.isArray(base[key]) ? base[key] : []).filter((s) => validSet(s) && s.id !== set.id);
  writeJson(storage, SETS_KEY, { ...base, [key]: [{ id: set.id, ts: set.ts, items: set.items, toppedUp: set.toppedUp || 0 }, ...rest].slice(0, CACHE_SETS) });
}

// ---- "Klopt niet": flagged questions, kept locally with their text ----
function hashOf(s) {
  let h = 2166136261;
  for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (h >>> 0).toString(36);
}
export const flagKey = (f) => `${f.lang}|${f.moduleId}|${hashOf(JSON.stringify([f.item.q, f.item.text, f.item.options, f.item.items, f.item.pairs]))}`;

const validFlag = (f) => isObj(f) && isObj(f.item) && typeof f.item.q === 'string' && typeof f.moduleId === 'string';

// Newest first.
export function readFlags(storage) {
  const list = readJson(storage, FLAGS_KEY, []);
  return Array.isArray(list) ? list.filter(validFlag) : [];
}

export function addFlag(storage, { item, moduleId, topicId, lang, ts }) {
  const entry = { moduleId, topicId, lang, ts, item: { ...Object.fromEntries(KEEP_FIELDS.filter((k) => item[k] !== undefined).map((k) => [k, item[k]])), id: item.id, level: item.level, topic: item.topic, source: item.source, src: item.src } };
  const list = readFlags(storage);
  if (list.some((f) => flagKey(f) === flagKey(entry))) return;
  writeJson(storage, FLAGS_KEY, [entry, ...list].slice(0, MAX_FLAGS));
}

// One flagged question as plain text, to read in Settings or to copy and pass on for review.
export function flagText(f) {
  const it = f.item;
  const lines = [`${f.moduleId} · ${f.topicId || it.topic} · ${f.lang} · level ${it.level}`, it.q];
  if (it.text) lines.push(it.text);
  const key = (o) => ((it.answer === o || (it.answers || []).includes(o)) ? '* ' : '- ');
  if (Array.isArray(it.options)) for (const o of it.options) lines.push(`${key(o)}${o}`);
  if (Array.isArray(it.items)) it.items.forEach((x, i) => lines.push(`${i + 1}. ${x}`));
  if (Array.isArray(it.pairs)) for (const [l, r] of it.pairs) lines.push(`${l} -> ${r}`);
  if (Array.isArray(it.accept)) lines.push(`accept: ${it.accept.join(' / ')}`);
  if ('number' in it) lines.push(`answer: ${it.number} ${it.unit || ''}`.trim());
  if (it.why) lines.push(`why: ${it.why}`);
  if (it.source && it.source.quote) lines.push(`source (${it.source.lesson}): ${it.source.quote}`);
  return lines.join('\n');
}

export function removeFlag(storage, key) {
  writeJson(storage, FLAGS_KEY, readFlags(storage).filter((f) => flagKey(f) !== key));
}

export function clearFlags(storage) {
  try { if (storage) storage.removeItem(FLAGS_KEY); } catch { /* nothing to clear */ }
}

// ---- scoring and what a finished extra test changes ----
// A flagged question is dropped from the score; an unanswered one counts as wrong.
export function extraScore(questions, results, flagged) {
  const out = (flagged instanceof Set ? flagged : new Set(flagged || []));
  const res = results || {};
  const counted = questions.filter((q) => !out.has(q.id));
  const missed = counted.filter((q) => res[q.id] !== true).map((q) => q.id);
  const correct = counted.length - missed.length;
  return { correct, total: counted.length, pct: counted.length ? Math.floor((correct * 100) / counted.length) : 0, missed, flagged: questions.length - counted.length };
}

// Q7 A: no review entry is made for a generated (or bank) question. A miss on a generated one makes the recall
// questions of its lesson due today: an existing entry keeps its box and moves its due date up to today, a lesson
// without reviews yet gets its recall questions in box 1, due today. A practised day, a session; no test record.
export function applyExtra(state, { subject, moduleId = null, topicId = null, questions, results, flagged = [], lang, lessons }, today, now) {
  const score = extraScore(questions, results, new Set(flagged));
  const byId = new Map(questions.map((q) => [q.id, q]));
  const lessonIds = [...new Set(score.missed.filter((id) => (byId.get(id) || {}).src === 'ai').map(lessonOf))];
  let next = countRound(state, today, 0);
  let reviews = next.courseReviews || {};
  for (const lessonId of lessonIds) {
    const lesson = (lessons || []).find((l) => l.id === lessonId);
    if (!lesson) continue;
    for (const q of recallQuestions(lesson)) {
      const key = `${lang}|${q.id}`;
      const cur = reviews[key];
      if (!cur) reviews = { ...reviews, [key]: { box: 1, due: today, lesson: lessonId, subject, lastSure: false } };
      else if (cur.due > today) reviews = { ...reviews, [key]: { ...cur, due: today } };
    }
  }
  next = { ...next, courseReviews: reviews };
  const courses = next.courses || {};
  const c = courses[subject] || { lessons: {}, sessions: [] };
  const session = { day: today, kind: 'extratest', moduleId, topicId, correct: score.correct, total: score.total, ts: now };
  next = { ...next, courses: { ...courses, [subject]: { ...c, sessions: [session, ...(c.sessions || [])].slice(0, SESSIONS_CAP) } } };
  return { state: next, ...score };
}

// Question lint (v18 F2). A dev tool, not loaded by the app (so it lives in scripts/, outside the SHELL rule): it flags the
// machine-checkable patterns of docs/superpowers/content/question-standard.md.
// Findings are warnings, not validator errors: a word list cannot judge a
// question. A question may carry `lintOk: 'reason'` to be skipped.
// Pure apart from the command line at the bottom.

export const RULES = ['absolute', 'length', 'offtopic', 'duplicate', 'echo', 'definition', 'shortstem', 'nobody'];

const ABSOLUTE = {
  nl: ['altijd', 'nooit', 'alle', 'alles', 'alleen', 'precies', 'elke', 'elk', 'steeds', 'uitsluitend', 'enkel', 'verdere', 'geen enkele'],
  en: ['always', 'never', 'all', 'every', 'each', 'only', 'exactly', 'solely', 'none', 'further', 'no single'],
};
const DEFINITION = {
  nl: /^(wat\s+(is|zijn|betekent|betekenen|laat|laten|doet|doen|meet|meten|houdt)\b|waar\s+staat|wat\s+bedoelen)/i,
  en: /^(what\s+(is|are|does|do|means|mean|shows|show|measures|measure)\b|what\s+does\s+.*\s+stand\s+for)/i,
};
// Options a professional would never give ("nobody does this"), per the design's small phrase list.
const NOBODY = {
  // anchored at the start of the option: "negeert" or "geen verschil" inside a real option is common
  nl: /^((er is )?geen verschil|negeer|negeren|(niets|niks) doen|doe (niets|niks)|aantal (slides|pagina)|hoeveel (slides|pagina))/i,
  en: /^((there is )?no difference|ignore|ignoring|do nothing|number of (slides|pages)|how many (slides|pages))/i,
};
// "Wat is de eerste stap" is a decision question, not a definition question.
const DECISION_STEM = /^(wat\s+is\s+(de|het|je|uw)\s+(eerste|beste|juiste|volgende|slimste|verstandigste|belangrijkste|grootste|eerste)\b|what\s+is\s+the\s+(first|best|right|next|smartest|most|biggest|main)\b)/i;
const NEGATION = /\b(niet|geen|nooit|not|no|never|without|zonder)\b/g;
const STOP = new Set(('de het een en of van in op te voor met door naar bij als dat die dit deze er je jij ze zij wij we ik is zijn was waren wordt worden kan kunnen moet moeten niet geen wel maar om uit aan over ook nog dan wat wie hoe waar waarom welke ' +
  'the a an and or of in on to for with by at as that this these those it you we they i is are was were be been can could must not no but from about also then what who how where why which ' +
  'meer minder alle alleen altijd nooit elke dient wordt heeft hebben hebt jouw uw hun haar onze').split(/\s+/));

const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const tokens = (s) => norm(s).replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
const content = (s, min = 4) => tokens(s).filter((w) => w.length >= min && !STOP.has(w) && !/^\d+$/.test(w));
const stem = (w) => (w.length > 5 ? w.replace(/(en|s|e|n)$/, '') : w); // crude: foutsoort ~ foutsoorten, schaal ~ schalen
const stems = (s, min = 4) => new Set(content(s, min).map(stem));
const wordCount = (s) => tokens(s).length;

export function hasAbsolute(text, lang = 'nl') {
  const t = ` ${tokens(text).join(' ')} `;
  return ABSOLUTE[lang].some((w) => t.includes(` ${norm(w)} `));
}

const finding = (rule, detail) => ({ rule, detail });

// qn: a multiple-choice question. ctx: { lang, tier, kind: 'pre'|'recall', topicText }
export function lintQuestion(qn, ctx = {}) {
  const lang = ctx.lang === 'en' ? 'en' : 'nl';
  const out = [];
  if (!qn || !Array.isArray(qn.options) || 'lintOk' in qn) return out;
  const opts = qn.options;
  const wrong = opts.filter((o) => o !== qn.answer);
  const key = qn.answer;

  // 1. absolute words in the distractors only
  if (!hasAbsolute(key, lang) && wrong.some((o) => hasAbsolute(o, lang))) {
    const n = wrong.filter((o) => hasAbsolute(o, lang)).length;
    out.push(finding('absolute', `${n} wrong option(s) carry an absolute word, the key does not`));
  }

  // 2. one option far longer or shorter than the rest
  const len = opts.map((o) => String(o).length);
  const sorted = [...len].sort((a, b) => b - a);
  if (sorted[0] >= 30 && sorted[0] > 1.8 * sorted[1]) out.push(finding('length', `longest option is ${(sorted[0] / sorted[1]).toFixed(1)}x the next`));
  else if (sorted[3] * 2.5 < sorted[2] && sorted[2] >= 20) out.push(finding('length', `shortest option is ${(sorted[2] / Math.max(1, sorted[3])).toFixed(1)}x shorter than the next`));

  // 3. an option with no content word that occurs in the lesson topic (likely off-topic)
  if (ctx.topicText) {
    const topic = stems(`${ctx.topicText} ${qn.q}`, 3);
    const off = wrong.filter((o) => {
      const cw = content(o, 4);
      return cw.length >= 2 && !cw.some((w) => topic.has(stem(w)));
    });
    if (off.length) out.push(finding('offtopic', `shares no content word with the topic: "${off[0]}"`));
  }

  // 4. duplicate or near-duplicate options
  dup: for (let i = 0; i < opts.length; i++) {
    for (let j = i + 1; j < opts.length; j++) {
      // same words in the same order and the same numbers; reorderings and number variants are legitimate distractors
      const oa = content(opts[i], 3).map(stem);
      const ob = content(opts[j], 3).map(stem);
      const a = new Set(oa);
      const b = new Set(ob);
      const shared = [...a].filter((w) => b.has(w)).length;
      const union = new Set([...a, ...b]).size;
      const digits = (o) => [...(String(o).match(/\d+(?:[.,]\d+)?/g) || []), ...(String(o).toLowerCase().match(/\b(één|twee|drie|vier|vijf|zes|zeven|acht|negen|tien|elf|twaalf|twintig|honderd|duizend|half|one|two|three|four|five|six|seven|eight|nine|ten|twenty|hundred|thousand)\b/g) || [])].join(',');
      const negs = (o) => (norm(o).match(NEGATION) || []).length;
      const sameOrder = oa.filter((w) => b.has(w)).join() === ob.filter((w) => a.has(w)).join();
      if (union >= 3 && shared / union >= 0.8 && sameOrder && digits(opts[i]) === digits(opts[j]) && negs(opts[i]) === negs(opts[j])) { out.push(finding('duplicate', `"${opts[i]}" ~ "${opts[j]}"`)); break dup; }
    }
  }

  // 5. the key repeats distinctive words of the question, the distractors do not
  const sq = stems(qn.q, 5);
  const overlap = (o) => [...stems(o, 5)].filter((w) => sq.has(w)).length;
  const longHit = [...stems(key, 5)].some((w) => sq.has(w) && w.length >= 7);
  if (sq.size && (overlap(key) >= 2 || longHit) && wrong.every((o) => overlap(o) === 0)) out.push(finding('echo', 'only the key repeats words of the question'));

  // 6. an option nobody would say
  const nb = wrong.find((o) => NOBODY[lang].test(String(o).trim()));
  if (nb !== undefined) out.push(finding('nobody', `"${nb}"`));

  // 7 and 8: level 3-4 recall questions
  if (ctx.kind === 'recall' && ctx.tier >= 3) {
    if (DEFINITION[lang].test(String(qn.q).trim()) && !DECISION_STEM.test(String(qn.q).trim())) out.push(finding('definition', 'definition-style question at level 3-4'));
    if (wordCount(qn.q) <= 10) out.push(finding('shortstem', `question text of ${wordCount(qn.q)} words at level 3-4`));
  }
  return out;
}

function tiersOf(meta) {
  const tiers = new Map();
  for (const t of Array.isArray(meta.topics) ? meta.topics : []) ((t && t.levels) || []).forEach((id, i) => { if (!tiers.has(id)) tiers.set(id, i + 1); });
  return tiers;
}

// One module in one language -> findings [{ module, lesson, id, lang, level, rule, q, detail }]
export function lintModule(moduleContent, meta, lang) {
  const tiers = tiersOf(meta);
  const out = [];
  for (const l of (moduleContent && moduleContent.lessons) || []) {
    const tier = tiers.get(l.id) ?? meta.level;
    const topicText = [l.title, ...(l.teach || []), l.example && l.example.text, l.said, ...(l.terms || []).flatMap((t) => [t.term, t.def])].filter(Boolean).join(' ');
    const groups = [['pre', 'p', l.pre || []], ['recall', 'r', l.recall || []]];
    for (const [kind, tag, list] of groups) {
      list.forEach((qn, i) => {
        for (const f of lintQuestion(qn, { lang, tier, kind, topicText })) out.push({ module: meta.id, lesson: l.id, id: `${l.id}#${tag}${i}`, lang, level: tier, q: qn.q, ...f });
      });
    }
  }
  return out;
}

// v18 T1: a test bank in one language, linted like recall questions at the item's own level.
// bank: the bank file's default export; lessons: the module's lessons in that language.
// Finding ids are the full question ids, <lessonId>#b<n>.
export function lintBank(bank, meta, lang, lessons = []) {
  const out = [];
  for (const it of (bank && bank.items) || []) {
    const l = lessons.find((x) => x.id === (it.source && it.source.lesson)) || {};
    const topicText = [l.title, ...(l.teach || []), l.example && l.example.text, l.said, ...(l.terms || []).flatMap((t) => [t.term, t.def])].filter(Boolean).join(' ');
    for (const f of lintQuestion(it, { lang, tier: it.level, kind: 'recall', topicText })) out.push({ module: meta.id, lesson: l.id, id: `${l.id}#${it.id}`, lang, level: it.level, q: it.q, ...f });
  }
  return out;
}

export async function lintAll(modules, loadModule, langs = ['nl', 'en']) {
  const out = [];
  for (const m of modules) for (const lang of langs) out.push(...lintModule(await loadModule(m.subject, m.id, lang), m, lang));
  return out;
}

// { [moduleId]: { [rule]: count } }, zero counts left out
export function countsOf(findings) {
  const c = {};
  for (const f of findings) { c[f.module] ??= {}; c[f.module][f.rule] = (c[f.module][f.rule] || 0) + 1; }
  return c;
}

export async function main(argv = []) {
  const { MODULES, loadModule } = await import('../src/content/courses/index.js');
  const findings = await lintAll(MODULES, loadModule);
  // test banks, for the modules that have one (v18 T1)
  const { loadBank } = await import('../src/content/courses/index.js');
  for (const m of MODULES) {
    for (const lang of ['nl', 'en']) {
      const bank = await loadBank(m.id, lang);
      if (bank) findings.push(...lintBank(bank, m, lang, (await loadModule(m.subject, m.id, lang)).lessons));
    }
  }
  const counts = countsOf(findings);
  if (argv.includes('--json')) { console.log(JSON.stringify(counts, null, 2)); return; }
  if (argv.includes('--list')) { for (const f of findings) console.log(`${f.id} [${f.lang}] ${f.rule}: ${f.detail} | ${f.q}`); return; }
  const perRule = Object.fromEntries(RULES.map((r) => [r, findings.filter((f) => f.rule === r).length]));
  console.log('findings per rule (nl + en):');
  for (const r of RULES) console.log(`  ${r.padEnd(11)} ${perRule[r]}`);
  console.log(`  total       ${findings.length}`);
  console.log('\nfindings per module:');
  const rows = Object.entries(counts).map(([m, rs]) => [m, Object.values(rs).reduce((a, b) => a + b, 0), rs]).sort((a, b) => b[1] - a[1]);
  for (const [m, n, rs] of rows) console.log(`  ${m.padEnd(22)} ${String(n).padStart(4)}  ${Object.entries(rs).map(([r, c]) => `${r}:${c}`).join(' ')}`);
}

if (typeof process !== 'undefined' && process.argv && process.argv[1]) {
  const { pathToFileURL } = await import('node:url');
  if (import.meta.url === pathToFileURL(process.argv[1]).href) await main(process.argv.slice(2));
}

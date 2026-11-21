// Task 14: the Projects module pm.approach ("Aanpak en gereedschap"). Structure and place in the app,
// the content guard that turns Merijn's rules on tools and companies into a check, and the spread of
// the answers (no giveaway by position or length).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MODULES, FIELDS, loadModule, topicsOf } from '../src/content/courses/index.js';
import { validateModule, checkTopics, checkOpeners, checkMap } from '../src/content/courses/validate.js';
import pmMap from '../src/content/courses/maps/pm.js';
import openers from '../src/content/courses/openers.pm.js';

const meta = MODULES.find((m) => m.id === 'pm.approach');
const TOPICS = ['route', 'method', 'tools', 'enterprise'];
const load = async (lang) => loadModule('pm', 'pm.approach', lang);

test('pm.approach: a Projects module of level 1 on the project track with four topics of four distinct lessons', () => {
  assert.ok(meta, 'pm.approach is in the index');
  assert.deepEqual([meta.subject, meta.track, meta.level], ['pm', 'project', 1]);
  assert.deepEqual(meta.title, { en: 'Approach and tools', nl: 'Aanpak en gereedschap' });
  assert.deepEqual(topicsOf(meta).map((t) => t.id), TOPICS);
  assert.deepEqual(checkTopics(meta), []);
  assert.equal(new Set(meta.lessons).size, 16);
  for (const t of meta.topics) assert.equal(t.levels.length, 4);
  assert.equal(meta.intro, 'pm.approach.intro', 'the module intro film is wired (films/pm.approach.intro, in the SHELL)');
  for (const id of meta.lessons) assert.equal(meta.questions[id], 4, id);
});

test('pm.approach: both languages validate, lessons follow the plan, no film or figure yet', async () => {
  const [en, nl] = [await load('en'), await load('nl')];
  assert.deepEqual(validateModule(en, nl, meta), []);
  assert.deepEqual(meta.lessons, [
    'pm.approach.route', 'pm.approach.takeover', 'pm.approach.tailor', 'pm.approach.clientroute',
    'pm.approach.families', 'pm.approach.dmaic', 'pm.approach.choose', 'pm.approach.translate',
    'pm.approach.toolfamilies', 'pm.approach.board', 'pm.approach.toolchoice', 'pm.approach.toolcost',
    'pm.approach.systems', 'pm.approach.guest', 'pm.approach.recordof', 'pm.approach.landscape',
  ]);
  for (const l of [...en.lessons, ...nl.lessons]) assert.ok(!('film' in l) && !('figure' in l), l.id);
});

test('pm.approach: the first station of "A project from start to finish", with a place on the wide and the phone map and openers for every topic', () => {
  const field = FIELDS.find((f) => f.id === 'pm.field.lifecycle');
  assert.equal(field.modules[0], 'pm.approach');
  assert.equal(pmMap.places[0] && pmMap.places.some((p) => p.module === 'pm.approach'), true);
  assert.ok(pmMap.phone.places.some((p) => p.module === 'pm.approach'));
  assert.deepEqual(checkMap(pmMap, MODULES, FIELDS), []);
  assert.deepEqual(checkMap({ subject: 'pm', ...pmMap.phone }, MODULES, FIELDS), []);
  assert.ok(pmMap.routes.some(([a, b]) => a === 'pm.approach' && b === 'pm.intake'));
  const mine = Object.fromEntries(Object.entries(openers).filter(([k]) => k.startsWith('pm.approach/')));
  assert.deepEqual(checkOpeners([meta], mine), []);
  for (const t of TOPICS) assert.ok(openers[`pm.approach/${t}`], t);
});

// ---- the content guard (Merijn, 15 Nov: MC7 and MC8)
const textOf = (lesson) => {
  const out = [];
  const walk = (v) => { if (typeof v === 'string') out.push(v); else if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
  walk(lesson);
  return out;
};
const sentences = (s) => s.split(/(?<=[.!?])\s+/);

const COMPANIES = ['ASML', 'Enexis', 'Alliander', 'TenneT', 'Stedin', 'Philips', 'Shell', 'Unilever', 'Heineken', 'VDL', 'DAF', 'Tata Steel', 'Vattenfall', 'Nexperia', 'Fokker', 'Thales', 'Siemens Energy'];
const ALLOWED = { ASML: ['Teamcenter', 'NX'], Enexis: ['SAP S/4HANA', 'ServiceNow', 'Mendix'] };
const TOOLS = ['Teamcenter', 'NX', 'SAP', 'ServiceNow', 'Mendix', 'Jira', 'Planner', 'Trello', 'Smartsheet', 'Primavera', 'Clarity', 'Polarion', 'Power BI', 'Miro', 'Mural', 'Confluence', 'SharePoint', 'Loop'];

test('content guard: no prices, licences, version numbers, editions or click paths in pm.approach (en and nl)', async () => {
  const bad = [];
  const rules = [
    [/[€$£]/, 'currency sign'],
    [/\b(?:per (?:user|gebruiker) per (?:month|maand)|\d+\s*(?:euro|usd|dollars?)\s*(?:per|\/)\s*(?:user|gebruiker|month|maand))/i, 'price'],
    [/\b(?:licen[cs]e|licentie)s?\b/i, 'licence'],
    [/\b(?:version|versie)\s*\d|\bv\d+(?:\.\d+)?\b|\b\d+\.\d+\.\d+\b|\b(?:Excel|Office|Windows|Jira|Planner|Project|Teams|Power BI|Miro)\s+\d{4}\b/i, 'version number'],
    [/\bPMBOK(?: Guide)?\s*(?:\d|th|nd|rd|st|seven|eight|zeven|acht)|\b(?:\d+(?:st|nd|rd|th)|zevende|achtste|seventh|eighth)\s+(?:edition|editie)/i, 'edition number'],
    [/\b(?:klik|click)\s+(?:op|on|\w+\s+(?:op|on))\b|\b(?:menu|tab)\s*(?:>|→)|>\s*[A-Z]\w+\s*>/i, 'click path'],
  ];
  for (const lang of ['en', 'nl']) {
    for (const l of (await load(lang)).lessons) {
      for (const text of textOf(l)) {
        for (const [re, what] of rules) if (re.test(text)) bad.push(`${l.id} [${lang}] ${what}: ${text.slice(0, 80)}`);
        for (const s of sentences(text)) {
          for (const c of COMPANIES) {
            if (!new RegExp(`\\b${c}\\b`).test(s)) continue;
            const ok = (ALLOWED[c] || []).some((t) => s.includes(t));
            if (!ok) bad.push(`${l.id} [${lang}] company ${c} without an allowed tool: ${s.slice(0, 80)}`);
            // a company is never tied to a tool outside its allowed list
            for (const t of TOOLS) if (s.includes(t) && !(ALLOWED[c] || []).some((a) => a.includes(t) || t.includes(a))) bad.push(`${l.id} [${lang}] ${c} with ${t}: ${s.slice(0, 80)}`);
          }
        }
      }
    }
  }
  assert.deepEqual(bad, []);
});

test('content guard: company names only where a source shows it, in the lesson about the large client’s systems', async () => {
  for (const lang of ['en', 'nl']) {
    for (const l of (await load(lang)).lessons) {
      const named = COMPANIES.filter((c) => textOf(l).some((s) => new RegExp(`\\b${c}\\b`).test(s)));
      if (l.id === 'pm.approach.systems') assert.ok(named.includes('ASML') && named.includes('Enexis'), `${lang} systems names ASML and Enexis`);
      else assert.deepEqual(named, [], `${l.id} [${lang}] names a company`);
    }
  }
});

test('content guard: the PMBOK Guide is named without an edition', async () => {
  let seen = 0;
  for (const lang of ['en', 'nl']) for (const l of (await load(lang)).lessons) for (const s of textOf(l)) {
    for (const m of s.matchAll(/PMBOK Guide([^.]{0,12})/g)) { seen++; assert.ok(!/^\s*(?:\d|\w+\s+edition)/i.test(m[1]), `${l.id}: ${m[0]}`); }
  }
  assert.ok(seen >= 3, 'the PMBOK Guide is named');
});

// ---- no giveaway
const mcOf = (mod) => mod.lessons.flatMap((l) => [...l.pre, ...l.recall]).filter((q) => q.options);

test('answers: the position of the right answer is balanced and identical in en and nl; every numeric question has a usable hint', async () => {
  const [en, nl] = [await load('en'), await load('nl')];
  for (const [lang, mod] of [['en', en], ['nl', nl]]) {
    const pos = [0, 0, 0, 0];
    for (const q of mcOf(mod)) pos[q.options.indexOf(q.answer)] += 1;
    const n = pos.reduce((a, b) => a + b, 0);
    assert.ok(Math.max(...pos) - Math.min(...pos) <= 3, `${lang} positions ${pos}`);
    assert.ok(n >= 60, `${lang} has ${n} choice questions`);
    for (const l of mod.lessons) for (const q of l.recall.filter((x) => 'number' in x)) {
      assert.ok(typeof q.hint === 'string' && q.hint.length > 10, `${l.id}: a numeric question needs a hint`);
    }
  }
  const at = (mod) => mcOf(mod).map((q) => q.options.indexOf(q.answer));
  assert.deepEqual(at(en), at(nl));
});

test('answers: the right answer is not mostly the longest option, nor systematically at one length rank', async () => {
  for (const lang of ['en', 'nl']) {
    const qs = mcOf(await load(lang));
    const rank = [0, 0, 0, 0];
    let uniqueLongest = 0;
    for (const q of qs) {
      const lens = q.options.map((o) => o.length);
      const a = lens[q.options.indexOf(q.answer)];
      const sorted = [...lens].sort((x, y) => y - x);
      rank[sorted.indexOf(a)] += 1;
      if (a === sorted[0] && sorted[0] > sorted[1]) uniqueLongest += 1;
    }
    assert.ok(uniqueLongest / qs.length <= 0.3, `${lang}: the answer is the unique longest in ${uniqueLongest} of ${qs.length}`);
    assert.ok(Math.max(...rank) / qs.length <= 0.35, `${lang}: length ranks ${rank}`);
    assert.ok(Math.min(...rank) / qs.length >= 0.15, `${lang}: length ranks ${rank}`);
  }
});

// ---- v18 F4: the method families lesson names every family, at least eight methods, and DMAIC is a project
// structure for any improvement, not Six Sigma only (Merijn, 21 Nov).
const lessonOf = async (lang, id) => (await load(lang)).lessons.find((l) => l.id === id);
const FAMILIES = {
  nl: ['voorspellend', 'agile', 'Lean-verbeteren', 'DMAIC', 'hybride'],
  en: ['predictive', 'agile', 'Lean improvement', 'DMAIC', 'hybrid'],
};
const METHODS = ['waterfall', 'PRINCE2', 'stage-gate', 'Scrum', 'Kanban', 'SAFe', 'PDCA', 'A3', 'DMAIC', '8D', 'DMADV'];

test('v18 F4: the first block of the method families lesson names all four families and the mix, in a list that reads', async () => {
  for (const lang of ['nl', 'en']) {
    const l = await lessonOf(lang, 'pm.approach.families');
    const first = l.teach[0];
    for (const f of FAMILIES[lang]) assert.ok(first.toLowerCase().includes(f.toLowerCase()), `${lang}: block 1 names ${f}`);
    assert.ok(first.split('\n\n').length >= 2, `${lang}: block 1 is not one run-on paragraph`);
    assert.ok(sentences(first.replace(/\n\n/g, ' ')).every((s) => s.split(/\s+/).length <= 30), `${lang}: no sentence of 30 words or more in block 1`);
  }
});

test('v18 F4: at least eight methods are named, each placed in a family', async () => {
  for (const lang of ['nl', 'en']) {
    const l = await lessonOf(lang, 'pm.approach.families');
    const body = l.teach.join('\n\n');
    const named = METHODS.filter((m) => body.toLowerCase().includes(m.toLowerCase()));
    assert.ok(named.length >= 8, `${lang}: ${named.length} methods named (${named.join(', ')})`);
    for (const m of ['waterfall', 'PRINCE2', 'Scrum', 'PDCA', 'DMAIC']) assert.ok(body.toLowerCase().includes(m.toLowerCase()), `${lang}: ${m}`);
  }
});

test('v18 F4: DMAIC is a project structure for any improvement, in the teach blocks, the term, the recall question and the example', async () => {
  const STRUCT = { nl: /projectstructuur/i, en: /project structure/i };
  const NOT_ONLY = { nl: /niet alleen (?:voor )?Six Sigma/i, en: /not only (?:for )?Six Sigma/i };
  for (const lang of ['nl', 'en']) {
    const fam = await lessonOf(lang, 'pm.approach.families');
    const dm = await lessonOf(lang, 'pm.approach.dmaic');
    assert.match(fam.teach.join('\n\n'), STRUCT[lang], `${lang}: families teach`);
    assert.match(fam.teach.join('\n\n'), NOT_ONLY[lang], `${lang}: families teach says not only Six Sigma`);
    assert.match(dm.teach.join('\n\n'), STRUCT[lang], `${lang}: dmaic teach`);
    assert.match(dm.gist, STRUCT[lang], `${lang}: dmaic gist`);
    const term = fam.terms.find((t) => t.term === 'DMAIC');
    assert.ok(term && !/^(?:De vijf stappen van|The five steps of) Six Sigma/.test(term.def), `${lang}: term not Six Sigma only`);
    assert.match(term.def, /Lean/, `${lang}: term mentions Lean`);
    const rec = fam.recall.filter((q) => q.options).map((q) => [q.q, q.answer, ...q.options].join(' '));
    assert.ok(!rec.some((t) => /Six Sigma (?:met|with) DMAIC/.test(t)), `${lang}: no recall slot teaches DMAIC as Six Sigma only`);
    assert.ok(rec.some((t) => /DMAIC/.test(t)), `${lang}: a recall question asks about DMAIC`);
    assert.ok(!dm.recall.some((q) => q.options && q.options.some((o) => /Six Sigma (?:altijd|always)/.test(o))), `${lang}: dmaic recall`);
    for (const f of FAMILIES[lang]) assert.ok(fam.example.text.toLowerCase().includes(f.toLowerCase()), `${lang}: the example compares ${f}`);
  }
});

test('v18 F4: the families lesson keeps its four recall slots (kind and answer position)', async () => {
  const [en, nl] = [await lessonOf('en', 'pm.approach.families'), await lessonOf('nl', 'pm.approach.families')];
  for (const l of [en, nl]) assert.deepEqual(l.recall.map((q) => ('number' in q ? 'num' : q.options.indexOf(q.answer))), [2, 3, 0, 'num']);
  assert.equal(nl.pre[0].options.indexOf(nl.pre[0].answer), 2);
});

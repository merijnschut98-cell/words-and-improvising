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
  assert.ok(!('intro' in meta), 'the intro film comes with the films step');
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

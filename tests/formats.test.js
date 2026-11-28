// Task 14: the Projects module pm.formats ("Werkvormen en overleggen"). Structure and place in the app
// (a station on the road between Plan and Run), the content guard that turns Merijn's rules on tools,
// companies and click paths into a check, and the spread of the answers (no giveaway by position or length).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MODULES, FIELDS, loadModule, topicsOf } from '../src/content/courses/index.js';
import { validateModule, checkTopics, checkOpeners, checkMap } from '../src/content/courses/validate.js';
import pmMap from '../src/content/courses/maps/pm.js';
import openers from '../src/content/courses/openers.pm.js';

const meta = MODULES.find((m) => m.id === 'pm.formats');
const TOPICS = ['meetings', 'workshop', 'ideas', 'floor'];
const LESSONS = [
  'pm.formats.catalogue', 'pm.formats.kickoff', 'pm.formats.system', 'pm.formats.governance',
  'pm.formats.workshop', 'pm.formats.brownpaper', 'pm.formats.design', 'pm.formats.facilitation',
  'pm.formats.diverge', 'pm.formats.session', 'pm.formats.decide', 'pm.formats.legitimacy',
  'pm.formats.floor', 'pm.formats.interviews', 'pm.formats.demo', 'pm.formats.kaizenevent',
];
const load = async (lang) => loadModule('pm', 'pm.formats', lang);

test('pm.formats: a Projects module of level 2 on the project track with four topics of four distinct lessons', () => {
  assert.ok(meta, 'pm.formats is in the index');
  assert.deepEqual([meta.subject, meta.track, meta.level], ['pm', 'project', 2]);
  assert.deepEqual(meta.title, { en: 'Formats and meetings', nl: 'Werkvormen en overleggen' });
  assert.deepEqual(topicsOf(meta).map((t) => t.id), TOPICS);
  assert.deepEqual(checkTopics(meta), []);
  assert.equal(new Set(meta.lessons).size, 16);
  for (const t of meta.topics) assert.equal(t.levels.length, 4);
  assert.equal(meta.intro, 'pm.formats.intro', 'the module intro film is wired (films/pm.formats.intro, in the SHELL)');
  for (const id of meta.lessons) assert.equal(meta.questions[id], 4, id);
});

test('pm.formats: both languages validate, lessons follow the plan, no film or figure yet', async () => {
  const [en, nl] = [await load('en'), await load('nl')];
  assert.deepEqual(validateModule(en, nl, meta), []);
  assert.deepEqual(meta.lessons, LESSONS);
  for (const l of [...en.lessons, ...nl.lessons]) assert.ok(!('film' in l) && !('figure' in l), l.id);
});

test('pm.formats: a station on the road between Plan and Run, on the wide and the phone map, with openers for every topic', () => {
  const field = FIELDS.find((f) => f.id === 'pm.field.lifecycle');
  const at = field.modules.indexOf('pm.formats');
  assert.equal(field.modules[at - 1], 'pm.plan');
  assert.equal(field.modules[at + 1], 'pm.run');
  const place = pmMap.places.find((p) => p.module === 'pm.formats');
  assert.equal(place.draw, 'whiteboard');
  assert.ok(pmMap.phone.places.some((p) => p.module === 'pm.formats'));
  assert.deepEqual(checkMap(pmMap, MODULES, FIELDS), []);
  assert.deepEqual(checkMap({ subject: 'pm', ...pmMap.phone }, MODULES, FIELDS), []);
  const road = (routes) => routes.filter(([a, b]) => [a, b].includes('pm.formats')).map((r) => r.join('>'));
  assert.deepEqual(road(pmMap.routes), ['pm.plan>pm.formats', 'pm.formats>pm.run']);
  assert.deepEqual(road(pmMap.phone.routes), ['pm.formats>pm.run']);
  const lifecycle = pmMap.places.filter((p) => field.modules.includes(p.module));
  assert.deepEqual(lifecycle.map((p) => p.module), field.modules, 'left to right in field order');
  const mine = Object.fromEntries(Object.entries(openers).filter(([k]) => k.startsWith('pm.formats/')));
  assert.deepEqual(checkOpeners([meta], mine), []);
  for (const t of TOPICS) assert.ok(openers[`pm.formats/${t}`], t);
});

// ---- the content guard (Merijn, 15 Nov: MC7 and MC8)
const textOf = ({ id, ...lesson }) => {
  const out = [];
  const walk = (v) => { if (typeof v === 'string') out.push(v); else if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
  walk(lesson);
  return out;
};

const COMPANIES = ['ASML', 'Enexis', 'Alliander', 'TenneT', 'Stedin', 'Philips', 'Shell', 'Unilever', 'Heineken', 'VDL', 'DAF', 'Tata Steel', 'Vattenfall', 'Nexperia', 'Fokker', 'Thales', 'Siemens Energy'];

test('content guard: no prices, licences, version numbers, editions or click paths in pm.formats (en and nl)', async () => {
  const bad = [];
  const rules = [
    [/[€$£]/, 'currency sign'],
    [/\b(?:per (?:user|gebruiker) per (?:month|maand)|\d+\s*(?:euro|usd|dollars?)\s*(?:per|\/)\s*(?:user|gebruiker|month|maand))/i, 'price'],
    [/\b(?:licen[cs]e|licentie)s?\b/i, 'licence'],
    [/\b(?:version|versie)\s*\d|\bv\d+(?:\.\d+)?\b|\b\d+\.\d+\.\d+\b|\b(?:Excel|Office|Windows|Jira|Planner|Project|Teams|Power BI|Miro|Mural)\s+\d{4}\b/i, 'version number'],
    [/\b(?:klik|click)\s+(?:op|on|\w+\s+(?:op|on))\b|\b(?:menu|tab)\s*(?:>|→)|>\s*[A-Z]\w+\s*>/i, 'click path'],
  ];
  for (const lang of ['en', 'nl']) {
    for (const l of (await load(lang)).lessons) {
      for (const text of textOf(l)) for (const [re, what] of rules) if (re.test(text)) bad.push(`${l.id} [${lang}] ${what}: ${text.slice(0, 80)}`);
    }
  }
  assert.deepEqual(bad, []);
});

test('content guard: no client or company names in pm.formats (the examples are anonymous)', async () => {
  for (const lang of ['en', 'nl']) {
    for (const l of (await load(lang)).lessons) {
      const named = COMPANIES.filter((c) => textOf(l).some((s) => new RegExp(`\\b${c}\\b`).test(s)));
      assert.deepEqual(named, [], `${l.id} [${lang}] names a company`);
    }
  }
});

test('content guard: Engineering lessons are named in the text, never hard-linked, and the Miro-style run does not read as a manual', async () => {
  for (const lang of ['en', 'nl']) {
    for (const l of (await load(lang)).lessons) {
      for (const s of textOf(l)) assert.ok(!/\b(?:eng|pm)\.[a-z0-9]+\.[a-z0-9]+\b/.test(s), `${l.id} [${lang}] shows a lesson id: ${s.slice(0, 60)}`);
    }
  }
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

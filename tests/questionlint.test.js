import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { lintQuestion, lintModule, lintAll, countsOf, hasAbsolute, RULES } from '../src/content/courses/lintquestions.js';
import { MODULES, loadModule } from '../src/content/courses/index.js';

const mc = (q, options, answer, extra = {}) => ({ q, options, answer, why: 'x', ...extra });
const rules = (qn, ctx = {}) => lintQuestion(qn, { lang: 'nl', tier: 1, kind: 'recall', ...ctx }).map((f) => f.rule);

test('absolute: only in wrong options is flagged, shared absolutes are not', () => {
  const bad = mc('Wanneer ga je door met de aanpak?', ['Als de data het ondersteunt', 'Nooit zonder akkoord', 'Alleen als de sponsor het wil', 'Pas na het eindrapport'], 'Als de data het ondersteunt');
  assert.ok(rules(bad).includes('absolute'));
  const ok = mc('Wanneer ga je door met de aanpak?', ['Altijd als de data het ondersteunt', 'Nooit zonder akkoord', 'Als de sponsor het wil', 'Pas na het eindrapport'], 'Altijd als de data het ondersteunt');
  assert.ok(!rules(ok).includes('absolute'));
  assert.ok(hasAbsolute('Dat is alleen zo bij storing', 'nl'));
  assert.ok(hasAbsolute('It is only true if', 'en'));
  assert.ok(!hasAbsolute('Het alleenrecht blijft', 'nl'), 'whole words only');
});

test('length: an option far longer or shorter than the others', () => {
  const long = mc('Wat doe je met de planning?', ['Je past de planning aan op basis van de nieuwe schatting van het team en meldt dat aan de sponsor', 'Je wacht', 'Je stopt', 'Je belt'], 'Je wacht');
  assert.ok(rules(long).includes('length'));
  const even = mc('Wat doe je met de planning?', ['Je past de planning aan', 'Je wacht op de sponsor', 'Je stopt het werk nu', 'Je belt het hele team'], 'Je wacht op de sponsor');
  assert.ok(!rules(even).includes('length'));
});

test('offtopic: a distractor sharing no content word with the topic', () => {
  const topicText = 'Een regelkaart toont het procesgemiddelde en de regelgrenzen van een proces over de tijd.';
  const qn = mc('Wat laat een regelkaart zien?', ['Het procesgemiddelde over tijd', 'De regelgrenzen van het proces', 'Het aantal slides in rapport', 'De tijd van het proces'], 'Het procesgemiddelde over tijd');
  const found = lintQuestion(qn, { lang: 'nl', tier: 1, kind: 'recall', topicText });
  assert.ok(found.some((f) => f.rule === 'offtopic' && /slides/.test(f.detail)));
  assert.ok(!lintQuestion(qn, { lang: 'nl', tier: 1, kind: 'recall' }).some((f) => f.rule === 'offtopic'), 'no topic text, no check');
});

test('duplicate: near-identical options, but reorderings and number variants are fine', () => {
  const dup = mc('Wat is een goede stap?', ['Je vraagt om bewijs van de claim', 'Je vraagt om het bewijs van deze claim', 'Je escaleert direct', 'Je wacht af'], 'Je escaleert direct');
  assert.ok(rules(dup).includes('duplicate'));
  const order = mc('Wat is de volgorde?', ['Oorzaak, feiten, afspraak', 'Feiten, oorzaak, afspraak', 'Afspraak, feiten, oorzaak', 'Feiten, afspraak, oorzaak'], 'Feiten, oorzaak, afspraak');
  assert.ok(!rules(order).includes('duplicate'));
  const nums = mc('Hoeveel weken heeft de netbeheerder?', ['Binnen 18 weken na de aanvraag', 'Binnen 26 weken na de aanvraag', 'Binnen 8 weken na de aanvraag', 'Binnen 4 weken na de aanvraag'], 'Binnen 18 weken na de aanvraag');
  assert.ok(!rules(nums).includes('duplicate'));
});

test('echo: only the key repeats words of the question', () => {
  const bad = mc('Waarom knip je een groot probleem op voordat je oorzaken zoekt?', ['Omdat een kleiner probleem meetbare oorzaken heeft', 'Omdat het sneller gaat', 'Omdat de baas dat wil', 'Omdat het rapport dan korter is'], 'Omdat een kleiner probleem meetbare oorzaken heeft');
  assert.ok(rules(bad).includes('echo'));
  const ok = mc('Waarom knip je een groot probleem op voordat je oorzaken zoekt?', ['Omdat een kleiner probleem meetbare oorzaken heeft', 'Omdat grote problemen minder oorzaken hebben', 'Omdat het sneller gaat', 'Omdat de baas dat wil'], 'Omdat een kleiner probleem meetbare oorzaken heeft');
  assert.ok(!rules(ok).includes('echo'));
});

test('definition and shortstem: only recall questions at level 3-4', () => {
  const qn = mc('Wat is technische schuld?', ['Werk dat blijft liggen en later extra kost', 'Een lening bij een bank', 'Een fout in de factuur', 'Een boete van de klant'], 'Werk dat blijft liggen en later extra kost');
  const lvl = (tier, kind = 'recall') => rules(qn, { tier, kind });
  assert.ok(lvl(3).includes('definition') && lvl(3).includes('shortstem'));
  assert.ok(lvl(4).includes('definition'));
  assert.ok(!lvl(2).includes('definition') && !lvl(2).includes('shortstem'));
  assert.ok(!lvl(3, 'pre').includes('definition'));
  const en = lintQuestion(mc('What is technical debt?', ['Work left undone that costs later', 'A bank loan', 'An invoice error', 'A client fine'], 'Work left undone that costs later'), { lang: 'en', tier: 4, kind: 'recall' }).map((f) => f.rule);
  assert.ok(en.includes('definition'));
  const long = mc('Een sponsor wil in week 6 een extra functie zonder extra budget terwijl het team al vol zit. Wat zeg je?', ['Je laat de impact zien en vraagt om een keuze', 'Je zegt ja en werkt over', 'Je zegt nee en stopt het gesprek', 'Je vraagt een ander team'], 'Je laat de impact zien en vraagt om een keuze');
  assert.ok(!rules(long, { tier: 4 }).includes('shortstem'));
});

test('lintOk skips a question; numeric questions have no findings', () => {
  const bad = mc('Wat is X?', ['Altijd dit hier', 'Nooit dat daar', 'Alleen zo wel', 'Het correcte antwoord'], 'Het correcte antwoord', { lintOk: 'bewust' });
  assert.deepEqual(rules(bad, { tier: 4 }), []);
  assert.deepEqual(lintQuestion({ q: 'Hoeveel?', number: 3, tolerance: 1, unit: '', why: 'x' }, { tier: 4, kind: 'recall' }), []);
});

test('lintModule names lesson id, question and rule', () => {
  const l = { id: 'm.x.a', title: 'T', teach: ['regelkaart'], pre: [], recall: [mc('Wat is X?', ['Altijd a', 'Nooit b', 'Alleen c', 'Het juiste'], 'Het juiste')] };
  const out = lintModule({ lessons: [l] }, { id: 'm.x', level: 3 }, 'nl');
  const f = out.find((x) => x.rule === 'absolute');
  assert.equal(f.lesson, 'm.x.a');
  assert.equal(f.id, 'm.x.a#r0');
  assert.equal(f.q, 'Wat is X?');
  assert.deepEqual(countsOf(out)['m.x'].shortstem, 1);
});

// The ratchet: the baseline only shrinks. A count that rises is a regression; a
// count that falls must be written into the baseline in the same commit.
test('ratchet: lint counts per module and rule equal the baseline', async () => {
  const baseline = JSON.parse(fs.readFileSync(new URL('./fixtures/v18-lint-baseline.json', import.meta.url), 'utf8'));
  const now = countsOf(await lintAll(MODULES, loadModule));
  const worse = [];
  const better = [];
  for (const m of new Set([...Object.keys(baseline), ...Object.keys(now)])) {
    for (const r of RULES) {
      const [a, b] = [(now[m] || {})[r] || 0, (baseline[m] || {})[r] || 0];
      if (a > b) worse.push(`${m} ${r}: ${b} -> ${a}`);
      if (a < b) better.push(`${m} ${r}: ${b} -> ${a}`);
    }
  }
  assert.deepEqual(worse, [], 'new lint findings: fix the questions (or add lintOk: reason)');
  assert.deepEqual(better, [], 'fewer findings: lower tests/fixtures/v18-lint-baseline.json (node src/content/courses/lintquestions.js --json)');
});

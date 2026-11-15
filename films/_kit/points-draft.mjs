// Dev tool, not shipped, not trusted (Task 17, plan docs/superpowers/plans/2026-11-15-task17-complete-films.md,
// section 3). Drafts the `points:` of a lesson film's beats: for every lesson point of every lesson the film
// serves, the beat whose Dutch caption, readout and narration match it best, scored as the inventory scored
// it (the point's distinctive numbers, and its content words weighted by how rare they are across all lesson
// text). The builder confirms or corrects each line; the build's checks (checkPoints) and the review decide.
//
//   node films/_kit/points-draft.mjs <film id>          a draft points map per beat, then the points no beat carries
//   node films/_kit/points-draft.mjs <film id> --json   the same as JSON (point, best beat, score, gap)
//
// Reads the shipped page (src/content/courses/films/<id>.html), so build the film first.
import fs from 'node:fs';
import { join } from 'node:path';
import { ROOT, allLessons } from './build-film.mjs';
import { readFilmData, pointsOf, pointStems, pointNumbers, pointSentences, pointGap, beatTextNl } from './assert.mjs';

const [id, flag] = process.argv.slice(2);
if (!id) {
  console.error('usage: node films/_kit/points-draft.mjs <film id> [--json]');
  process.exit(2);
}
const file = join(ROOT, 'src/content/courses/films', `${id}.html`);
if (!fs.existsSync(file)) {
  console.error(`no page ${file}; build the film first`);
  process.exit(2);
}
const data = readFilmData(fs.readFileSync(file, 'utf8'));
if (data.module || data.field) {
  console.error(`${id} is a module or field film; lesson points are for lesson films`);
  process.exit(2);
}
const lessons = await allLessons();

// rarity of a content stem across every sentence of every lesson point
const df = new Map();
let n = 0;
for (const l of lessons.nl.values()) {
  for (const p of pointsOf(l)) {
    for (const s of pointSentences(p.text)) {
      n++;
      for (const w of pointStems(s)) df.set(w, (df.get(w) || 0) + 1);
    }
  }
}
const idf = (w) => Math.log((n + 1) / ((df.get(w) || 0) + 1));

const beats = data.scenes.flatMap((s, si) => s.beats.map((b, bi) => ({ ref: `${s.id}.${bi + 1}`, si, b, stems: new Set(pointStems(beatTextNl(b))), nums: new Set(pointNumbers(beatTextNl(b))) })));
// a point's share of rare words and of numbers found in a beat (0..1 each)
function score(p, bt) {
  const stems = pointStems(p.text);
  const all = stems.reduce((a, w) => a + idf(w), 0);
  const got = stems.filter((w) => bt.stems.has(w)).reduce((a, w) => a + idf(w), 0);
  const nums = pointNumbers(p.text);
  const words = all ? got / all : 0;
  const numbers = nums.length ? nums.filter((x) => bt.nums.has(x)).length / nums.length : 1;
  return words * (0.5 + 0.5 * numbers);
}
const startOf = (lid) => {
  const [film, at] = String(lessons.nl.get(lid).film || '').split('#');
  return film === id && at ? Number(at) : 1;
};
const short = (lid) => {
  if (data.lessons.length === 1) return '';
  const last = lid.split('.').pop();
  return `${data.lessons.filter((x) => x.split('.').pop() === last).length === 1 ? last : lid}#`;
};

const rows = [];
for (const lid of data.lessons) {
  const l = lessons.nl.get(lid);
  if (!l) continue;
  const start = startOf(lid);
  for (const p of pointsOf(l)) {
    let best = null;
    for (const bt of beats) {
      if (bt.si + 1 < start) continue;
      const sc = score(p, bt);
      if (!best || sc > best.sc) best = { bt, sc };
    }
    const gap = best ? pointGap(p.text, [best.bt.b]) : 'no beat';
    rows.push({ point: `${short(lid)}${p.id}`, key: `${lid}#${p.id}`, beat: best ? best.bt.ref : null, score: best ? Number(best.sc.toFixed(2)) : 0, gap, text: p.text });
  }
}

if (flag === '--json') {
  console.log(JSON.stringify(rows, null, 1));
} else {
  const claimed = new Map((data.points || []).map((c) => [c.key, c.beats]));
  // a beat claims the points it matches best where the checks would accept the claim; a weak match (score
  // under WEAK: less than half of the point's rare words) is drafted but marked, for the builder to read
  const WEAK = 0.5;
  console.log(`// ${id}: draft points per beat (confirm or correct each; ${rows.length} points of ${data.lessons.length} lesson${data.lessons.length === 1 ? '' : 's'})`);
  for (const bt of beats) {
    const mine = rows.filter((r) => r.beat === bt.ref && !r.gap);
    if (!mine.length) continue;
    const weak = mine.filter((r) => r.score < WEAK);
    console.log(`// ${bt.ref}  ${bt.b.text.nl.slice(0, 90)}${weak.length ? `  (weak: ${weak.map((r) => `${r.point} ${r.score}`).join(', ')}; is the claim really said?)` : ''}`);
    console.log(`points: [${mine.map((r) => `'${r.point}'`).join(', ')}],`);
  }
  const open = rows.filter((r) => r.gap);
  console.log(`\n// ${open.length} points no beat carries (best beat, score, why): add a beat, or the lesson's extra scene; leave one to reading only as a pointer or a word for word duplicate (D4):`);
  for (const r of open) console.log(`//   ${r.point}  best ${r.beat || '-'} ${r.score}${r.gap ? ` (${r.gap})` : ''}  "${r.text.replace(/\s+/g, ' ').slice(0, 110)}"`);
  if (claimed.size) {
    const differ = rows.filter((r) => claimed.has(r.key) && !claimed.get(r.key).includes(r.beat));
    console.log(`\n// the page already claims ${claimed.size} points; ${differ.length} claimed elsewhere than the draft's best beat:`);
    for (const r of differ) console.log(`//   ${r.point}: page ${claimed.get(r.key).join(', ')}, draft ${r.beat}`);
  }
}

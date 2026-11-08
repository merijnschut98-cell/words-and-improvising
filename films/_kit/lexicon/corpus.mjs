// Dev tool, not shipped. Prints the word list the pronunciation lexicon is
// seeded from: every word (with its count) of the modules the films serve, in
// one language, plus the spoken narration of every built film.
//
//   node films/_kit/lexicon/corpus.mjs nl > words.nl.tsv
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from '../build-film.mjs';
import { readFilmData } from '../assert.mjs';

export const MODULES = ['machining', 'joining', 'moulding', 'lines'];
const lang = process.argv[2] === 'en' ? 'en' : 'nl';
const texts = [];
const walk = (v) => {
  if (typeof v === 'string') texts.push(v);
  else if (Array.isArray(v)) v.forEach(walk);
  else if (v && typeof v === 'object') Object.values(v).forEach(walk);
};
for (const m of MODULES) walk((await import(pathToFileURL(join(ROOT, `src/content/courses/eng/${m}.${lang}.js`)).href)).default);
const films = join(ROOT, 'src/content/courses/films');
for (const f of readdirSync(films).filter((x) => x.endsWith('.html'))) {
  const data = readFilmData(readFileSync(join(films, f), 'utf8'));
  for (const s of data.scenes) for (const b of s.beats) texts.push((b.voice || b.speak)[lang]);
}
const count = new Map();
for (const t of texts) for (const w of t.toLowerCase().match(/\p{L}[\p{L}'’-]*\p{L}|\p{L}/gu) || []) count.set(w, (count.get(w) || 0) + 1);
for (const [w, n] of [...count].sort()) console.log(`${w}\t${n}`);

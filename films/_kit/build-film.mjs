// defineFilm(): turns a film's source (scenes with marked captions, a stage
// drawing and its script) into one standalone page with the player inlined.
//
// - Terms: {t:Snijsnelheid} is looked up in the served lessons; its English word
//   comes from the English lesson at the same position. The build fails when a
//   term is not found, or when the nl and en captions name different terms.
// - Numbers: {n:1167} is formatted per language and must appear in the Dutch
//   text of a served lesson. The film's model asserts it computes them.
// - Then the shared checks (coverage, language, pacing; films/_kit/assert.mjs)
//   and the size cap. Any problem throws, so a broken film is never written.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MODULES, loadModule, placeOf } from '../../src/content/courses/index.js';
import { parseMarked, formatNumber, plainOf, speakOf } from './timeline.mjs';
import { checkFilm, lessonTextOf, hasNumber, narrationWords, NARRATION_WPS, MAX_BYTES, TARGET_BYTES } from './assert.mjs';
import { pageHtml } from './player.mjs';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export async function allLessons() {
  const out = { nl: new Map(), en: new Map() };
  for (const m of MODULES) for (const lang of ['nl', 'en']) for (const l of (await loadModule(m.subject, m.id, lang)).lessons) out[lang].set(l.id, l);
  return out;
}

// "Turn-mill centre" → "turn-mill centre"; "C-axis" and "HSS" stay, and so does
// a proper noun ("Taylor equation"): with the English lesson text as corpus, a
// first word that it writes capitalised in mid-sentence and never in lower case
// keeps its capital.
export function glossCase(en, corpus) {
  if (!/^[A-Z][a-z]/.test(en)) return en;
  // a title with a later capitalised word ("Machinery Regulation") is a proper name
  if (/\s[A-Z][a-z]/.test(en)) return en;
  const first = en.split(/[\s-]/)[0];
  const low = first[0].toLowerCase() + first.slice(1);
  const esc = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const proper = corpus !== undefined
    && new RegExp(`[a-z,] +${esc(first)}(?![A-Za-z])`).test(corpus)
    && !new RegExp(`(^|[^A-Za-z])${esc(low)}(?![A-Za-z])`).test(corpus);
  return proper ? en : en[0].toLowerCase() + en.slice(1);
}
// All English lesson text, with the term names and definitions.
export function englishCorpus(lessons) {
  const parts = [];
  for (const l of lessons.en.values()) parts.push(lessonTextOf(l), ...(l.terms || []).map((t) => `${t.term}\n${t.def}`));
  return parts.join('\n');
}

function findTerm(name, lang, served, lessons) {
  const key = name.toLowerCase();
  for (const id of served) {
    const i = (lessons[lang].get(id).terms || []).findIndex((x) => x.term.toLowerCase() === key);
    if (i >= 0) return { lesson: id, index: i };
  }
  throw new Error(`term "${name}" (${lang}) is in none of the served lessons`);
}

// prefer: the lesson a scene belongs to, searched first.
function findNumber(value, served, lessons, prefer) {
  for (const id of prefer && served.includes(prefer) ? [prefer, ...served] : served) if (hasNumber(lessonTextOf(lessons.nl.get(id)), value)) return id;
  throw new Error(`number ${value} is in none of the served Dutch lessons`);
}

// Resolves one film source into the data block (plan 2.4, with beats).
export function resolveFilm(spec, lessons) {
  const served = spec.lessons;
  for (const id of served) if (!lessons.nl.has(id)) throw new Error(`unknown lesson ${id}`);
  const glossed = new Set();
  const sayGlossed = new Set();
  const corpus = englishCorpus(lessons);
  const glossOf = (en) => glossCase(en, corpus);
  const numbers = [];
  const scenes = spec.scenes.map((s, si) => {
    const sceneTerms = [];
    const beats = s.beats.map((b, bi) => {
      const where = `scene ${si + 1} beat ${bi + 1}`;
      const P = { nl: parseMarked(b.nl), en: parseMarked(b.en) };
      const tn = P.nl.filter((p) => p.term).map((p) => findTerm(p.term, 'nl', served, lessons));
      const te = P.en.filter((p) => p.term).map((p) => findTerm(p.term, 'en', served, lessons));
      if (JSON.stringify(tn) !== JSON.stringify(te)) throw new Error(`${where}: nl and en name different terms`);
      const nn = P.nl.filter((p) => p.num).map((p) => p.num);
      const ne = P.en.filter((p) => p.num).map((p) => p.num);
      if (nn.join() !== ne.join()) throw new Error(`${where}: nl and en carry different numbers`);
      const readP = b.read ? { nl: parseMarked(b.read.nl), en: parseMarked(b.read.en) } : null;
      if (readP && readP.nl.filter((p) => p.num).map((p) => p.num).join() !== readP.en.filter((p) => p.num).map((p) => p.num).join()) throw new Error(`${where}: readout numbers differ`);
      for (const raw of [...nn, ...(readP ? readP.nl.filter((p) => p.num).map((p) => p.num) : [])]) {
        const value = formatNumber(raw, 'nl');
        if (!numbers.some((n) => n.value === value)) numbers.push({ lesson: findNumber(value, served, lessons, s.lesson), value, scene: s.id });
      }
      const seg = {};
      const cues = new Set(b.cues || []);
      for (const lang of ['nl', 'en']) {
        let k = 0;
        seg[lang] = P[lang].map((p) => {
          if (p.text !== undefined) return p.text;
          if (p.num !== undefined) return formatNumber(p.num, lang);
          const ref = tn[k++];
          const key = `${ref.lesson}#${ref.index}`;
          const cue = (b.cue || {})[lessons.nl.get(ref.lesson).terms[ref.index].term];
          if (!cue) throw new Error(`${where}: term ${p.term} has no cue`);
          cues.add(cue);
          const piece = { t: p.shown, c: cue, k: key };
          if (lang === 'nl') {
            const en = lessons.en.get(ref.lesson).terms[ref.index].term;
            if (!glossed.has(key) && en.toLowerCase() !== p.term.toLowerCase()) { piece.en = glossOf(en); glossed.add(key); }
            if (!sceneTerms.some((x) => x.lesson === ref.lesson && x.index === ref.index)) {
              sceneTerms.push({ lesson: ref.lesson, index: ref.index, nl: lessons.nl.get(ref.lesson).terms[ref.index].term, en, cue });
            }
          }
          return piece;
        });
      }
      const fmtRead = (lang) => readP[lang].map((p) => (p.text !== undefined ? p.text : p.num !== undefined ? formatNumber(p.num, lang) : p.shown)).join('');
      // v14b: the narration script, a fuller spoken explanation than the
      // caption. Same markers; its terms and numbers are checked like the
      // caption's, and in Dutch a term carries its English word on its first
      // use in the narration (shown in "Lees mee", never spoken).
      let narration = {};
      if (b.say) {
        const S = { nl: parseMarked(b.say.nl), en: parseMarked(b.say.en) };
        const sn = S.nl.filter((p) => p.term).map((p) => findTerm(p.term, 'nl', served, lessons));
        const se = S.en.filter((p) => p.term).map((p) => findTerm(p.term, 'en', served, lessons));
        if (JSON.stringify(sn) !== JSON.stringify(se)) throw new Error(`${where}: the nl and en narration name different terms`);
        const nums = { nl: S.nl.filter((p) => p.num).map((p) => p.num), en: S.en.filter((p) => p.num).map((p) => p.num) };
        if (nums.nl.join() !== nums.en.join()) throw new Error(`${where}: the nl and en narration carry different numbers`);
        for (const raw of nums.nl) {
          const value = formatNumber(raw, 'nl');
          if (!numbers.some((n) => n.value === value)) numbers.push({ lesson: findNumber(value, served, lessons, s.lesson), value, scene: s.id });
        }
        const say = {};
        for (const lang of ['nl', 'en']) {
          let k = 0;
          say[lang] = S[lang].map((p) => {
            if (p.text !== undefined) return p.text;
            if (p.num !== undefined) return formatNumber(p.num, lang);
            const ref = sn[k++];
            const key = `${ref.lesson}#${ref.index}`;
            const piece = { t: p.shown, k: key };
            const en = lessons.en.get(ref.lesson).terms[ref.index].term;
            if (lang === 'nl' && !sayGlossed.has(key) && en.toLowerCase() !== p.term.toLowerCase()) { piece.en = glossOf(en); sayGlossed.add(key); }
            return piece;
          });
        }
        narration = { say, voice: { nl: speakOf(say.nl, 'nl'), en: speakOf(say.en, 'en') } };
      }
      return {
        seg,
        text: { nl: plainOf(seg.nl), en: plainOf(seg.en) },
        speak: { nl: speakOf(seg.nl, 'nl'), en: speakOf(seg.en, 'en') },
        cues: [...cues],
        ...(readP ? { read: { nl: fmtRead('nl'), en: fmtRead('en') } } : {}),
        ...(b.still !== undefined ? { still: b.still } : {}),
        ...narration,
      };
    });
    return { id: s.id, n: si + 1, level: s.level, dur: s.dur, still: s.still, title: s.title, beats, terms: sceneTerms };
  });
  return { id: spec.id, title: spec.title, lessons: served, scenes, skip: spec.skip || [], numbers };
}

// Builds and writes the page; returns { data, bytes, out }.
export async function defineFilm(spec, stage) {
  const lessons = await allLessons();
  const data = resolveFilm(spec, lessons);
  const errs = checkFilm(data, { lessons, levelOf: (id) => (placeOf(id) || {}).level || 1, wiredBy: spec.lessons });
  if (errs.length) throw new Error(`film ${spec.id} fails its checks:\n  ${errs.join('\n  ')}`);
  const html = pageHtml(data, stage);
  const bytes = Buffer.byteLength(html);
  if (bytes > MAX_BYTES) throw new Error(`film ${spec.id} is ${bytes} bytes, over the ${MAX_BYTES} cap`);
  const out = join(ROOT, 'src/content/courses/films', `${spec.id}.html`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  const total = data.scenes.reduce((a, s) => a + s.dur, 0);
  console.log(`wrote ${out} · ${(bytes / 1024).toFixed(1)} KB${bytes > TARGET_BYTES ? ' (over the 300 KB target)' : ''} · ${data.scenes.length} scenes · ${total} s`);
  return { data, bytes, out };
}

// --audit: durations, reading pace and the term coverage, per scene.
export function auditReport(data) {
  const lines = [];
  let t = 0;
  for (const s of data.scenes) {
    const w = (lang) => s.beats.map((b) => b.text[lang]).join(' ').trim().split(/\s+/).length;
    const sw = (lang) => s.beats.map((b) => (b.voice ? b.voice[lang] : '')).join(' ').trim().split(/\s+/).filter(Boolean).length;
    lines.push(`${String(s.n).padStart(2)} L${s.level} ${String(s.dur).padStart(3)} s @${String(t).padStart(3)}  words nl ${w('nl')} en ${w('en')}  pace ${(w('nl') / s.dur).toFixed(2)} w/s  narration nl ${sw('nl')} en ${sw('en')} words  terms: ${s.terms.map((x) => `${x.nl}→${x.cue}`).join(', ') || '-'}`);
    t += s.dur;
  }
  const est = (lang) => Math.round(narrationWords(data, lang) / NARRATION_WPS);
  lines.push(`total ${t} s · narration about ${est('nl')} s nl, ${est('en')} s en · numbers: ${data.numbers.map((n) => `${n.value} (${n.lesson.split('.').pop()})`).join(', ')}`);
  lines.push(`skipped: ${data.skip.length ? data.skip.map((k) => `${k.term}: ${k.reason}`).join('; ') : 'none'}`);
  return lines.join('\n');
}

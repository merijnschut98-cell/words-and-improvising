// Dev tool, not shipped. v14b: renders a film to video, per language.
//
//   node films/_kit/render.mjs eng.machining.turning [--lang nl,en] [--seconds 12] [--stills] [--poster] [--theme dark]
//
// Run films/_kit/narrate.mjs first: the narration's audio timeline drives the
// picture. The HTML film opens in render mode (?render=1: no wall clock, no
// controls, no speech); this script sets the time of every frame through
// window.__film, captures it at 30 fps and 1280 × 720 in headless Chromium
// (Playwright), and pipes the frames and the narration track into ffmpeg:
// H.264 (yuv420p, crf 26, faststart) and AAC in an MP4.
//
// Writes films-out/<id>/<lang>.mp4 (git-ignored; uploaded to the public
// Supabase bucket `films` as <id>/<lang>.mp4), the poster
// src/content/courses/films/<id>.jpg, a 390 px phone check
// films-out/<id>/<lang>.phone.jpg, and records duration, size and scene starts
// in src/content/courses/films/manifest.json. --seconds renders only the start
// (a quick look) and leaves the manifest alone; --poster only redoes the poster.
import { spawn, spawnSync, execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from './build-film.mjs';
import { manifestWith } from './narration.mjs';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require(`${execSync('npm root -g').toString().trim()}/playwright`); }

export const FPS = 30;
export const SIZE = { width: 1280, height: 720 };
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const MANIFEST = join(ROOT, 'src/content/courses/films/manifest.json');

const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : dflt; };

async function openFilm(browser, id, lang, theme, viewport = SIZE) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  const url = `${pathToFileURL(join(ROOT, 'src/content/courses/films', `${id}.html`)).href}?render=1&lang=${lang}&theme=${theme}`;
  await page.goto(url);
  await page.waitForFunction(() => !!window.__film, null, { timeout: 10000 });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  if (errors.length) throw new Error(`${id} ${lang}: page errors: ${errors.join('; ')}`);
  return page;
}

function ffprobeDur(file) {
  const r = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]);
  return Number(String(r.stdout).trim());
}

// The poster: scene 1 at its designed still, the title of both languages in
// the caption band (one poster serves both videos).
async function poster(page, id, atl, dir) {
  const s1 = atl.scenes[0];
  await page.evaluate((t) => {
    window.__film.seek(t);
    const { title } = JSON.parse(document.getElementById('film-data').textContent);
    document.querySelector('.fp').dataset.poster = '1'; // the band is shown for the poster only
    const cap = document.querySelector('.fp-cap');
    const line = document.createElement('span');
    const nl = document.createElement('b');
    nl.className = 'fp-term';
    nl.textContent = title.nl;
    const en = document.createElement('span');
    en.className = 'fp-en';
    en.textContent = ` · ${title.en}`;
    line.append(nl, en);
    cap.replaceChildren(line);
  }, s1.start + s1.dur * 0.8);
  const big = join(dir, 'poster.jpg');
  writeFileSync(big, await page.screenshot({ type: 'jpeg', quality: 92 }));
  await page.evaluate(() => { delete document.querySelector('.fp').dataset.poster; });
  spawnSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', big, '-vf', 'scale=640:-2', '-q:v', '4', join(ROOT, 'src/content/courses/films', `${id}.jpg`)]);
}

export async function render(id, { langs = ['nl', 'en'], seconds = null, theme = 'dark', stills = false, posterOnly = false } = {}) {
  const dir = join(ROOT, 'films-out', id);
  const browser = await playwright.chromium.launch();
  let manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : null;
  try {
    for (const lang of langs) {
      const timingFile = join(dir, `${lang}.timing.json`);
      if (!existsSync(timingFile)) throw new Error(`${timingFile} missing: run films/_kit/narrate.mjs ${id} first`);
      const { atl } = JSON.parse(readFileSync(timingFile, 'utf8'));
      const total = seconds ? Math.min(seconds, atl.total) : atl.total;
      const frames = Math.ceil(total * FPS);
      const page = await openFilm(browser, id, lang, theme);
      await page.evaluate((a) => window.__film.setTiming(a), atl);
      if (posterOnly) {
        if (lang === langs[0]) await poster(page, id, atl, dir);
        await page.close();
        continue;
      }
      if (stills) {
        // one frame per beat, for a quick look at the whole film
        for (const [si, s] of atl.scenes.entries()) {
          for (const [bi, b] of s.beats.entries()) {
            await page.evaluate((t) => window.__film.seek(t), b.start + b.dur * 0.6);
            writeFileSync(join(dir, `${lang}.s${si + 1}b${bi + 1}.jpg`), await page.screenshot({ type: 'jpeg', quality: 85 }));
          }
        }
        await page.close();
        continue;
      }
      const out = join(dir, seconds ? `${lang}.preview.mp4` : `${lang}.mp4`);
      const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error',
        '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
        '-i', join(dir, `${lang}.wav`),
        '-map', '0:v', '-map', '1:a', '-t', String(frames / FPS),
        '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-crf', '26', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-g', String(FPS * 4),
        '-c:a', 'aac', '-b:a', '96k', '-ac', '1',
        '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
      const done = new Promise((res, rej) => ff.on('close', (code) => (code === 0 ? res() : rej(new Error(`ffmpeg exited ${code}`)))));
      const t0 = Date.now();
      for (let f = 0; f < frames; f++) {
        await page.evaluate((t) => window.__film.seek(t), f / FPS);
        const jpg = await page.screenshot({ type: 'jpeg', quality: 94 });
        if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once('drain', r));
        if (f % (FPS * 20) === 0) process.stdout.write(`\r${id} ${lang}: ${(f / FPS).toFixed(0)} / ${total.toFixed(0)} s`);
      }
      ff.stdin.end();
      await done;
      const bytes = statSync(out).size;
      const dur = ffprobeDur(out);
      console.log(`\r${id} ${lang}: ${out} · ${(bytes / 1e6).toFixed(1)} MB · ${dur.toFixed(1)} s · rendered in ${((Date.now() - t0) / 1000).toFixed(0)} s`);

      // the 390 px phone check: scene 3 at its first line, scaled down as a phone shows it
      const s3 = atl.scenes[Math.min(2, atl.scenes.length - 1)];
      await page.evaluate((t) => window.__film.seek(t), s3.beats[0].start + 1);
      const shot = join(dir, `${lang}.frame.jpg`);
      writeFileSync(shot, await page.screenshot({ type: 'jpeg', quality: 92 }));
      spawnSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', shot, '-vf', 'scale=390:-2', join(dir, `${lang}.phone.jpg`)]);

      if (!seconds) {
        if (lang === langs[0]) await poster(page, id, atl, dir);
        manifest = manifestWith(manifest, id, lang, { dur, bytes, scenes: atl.scenes.map((s) => s.start) });
        writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

if (process.argv[1] && process.argv[1].endsWith('render.mjs')) {
  const id = process.argv[2];
  if (!id) { console.error('usage: node films/_kit/render.mjs <film id> [--lang nl,en] [--seconds n] [--theme dark|light]'); process.exit(2); }
  const s = arg('--seconds', null);
  await render(id, { langs: arg('--lang', 'nl,en').split(','), seconds: s ? Number(s) : null, theme: arg('--theme', 'dark'), stills: process.argv.includes('--stills'), posterOnly: process.argv.includes('--poster') });
}

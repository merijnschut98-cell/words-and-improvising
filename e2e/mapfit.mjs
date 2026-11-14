// The subject map must sit inside its card's content box, with the card's own
// inset on both sides, at every width, theme and language.
// Run: node e2e/mapfit.mjs [outDir]   (serves the repo on :8124)
import { spawn, execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require(`${execSync('npm root -g').toString().trim()}/playwright`); }
const { chromium } = playwright;
const out = process.argv[2] || 'e2e/out-mapfit';
fs.mkdirSync(out, { recursive: true });
const PORT = process.env.E2E_PORT || '8124';
const server = spawn('python3', ['-m', 'http.server', PORT], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const BASE = `http://localhost:${PORT}/`;
const browser = await chromium.launch();
const problems = [];
const report = [];
try {
  for (const lang of ['nl', 'en']) for (const scheme of ['light', 'dark']) for (const subject of ['pm', 'eng']) {
    for (const width of [320, 360, 390, 430, 1280]) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, serviceWorkers: 'block' });
      await ctx.addInitScript(([l, s]) => {
        localStorage.setItem('spraakwater:v1', JSON.stringify({ onboarded: true, xp: 40, settings: { lang: l }, ui: { subject: s } }));
      }, [lang, subject]);
      const page = await ctx.newPage();
      await page.goto(BASE);
      const has = await page.locator('.map-card .subject-map').first().waitFor({ timeout: 4000 }).then(() => true, () => false);
      if (!has) { await ctx.close(); if (subject === 'pm') problems.push(`${subject} ${lang} ${scheme} ${width}: no map`); continue; }
      const m = await page.evaluate(() => {
        const card = document.querySelector('.map-card');
        const cs = getComputedStyle(card);
        const r = card.getBoundingClientRect();
        const cl = r.left + parseFloat(cs.borderLeftWidth) + parseFloat(cs.paddingLeft);
        const cr = r.right - parseFloat(cs.borderRightWidth) - parseFloat(cs.paddingRight);
        const el = card.querySelector('.subject-map');
        const svg = el.getBoundingClientRect();
        const kids = [...card.querySelectorAll('.subject-map .map-zone-area, .subject-map .map-place')].map((e) => e.getBoundingClientRect());
        const left = Math.min(...kids.map((k) => k.left));
        const right = Math.max(...kids.map((k) => k.right));
        const lab = parseFloat(getComputedStyle(card.querySelector('.map-label')).fontSize) * (svg.width / el.viewBox.baseVal.width);
        const place = Math.min(...[...card.querySelectorAll('.map-hit')].map((e) => e.getBoundingClientRect().width));
        return { cl, cr, svgL: svg.left, svgR: svg.right, left, right, lab, place, over: document.documentElement.scrollWidth - innerWidth };
      });
      const tag = `${subject} ${lang} ${scheme} ${width}`;
      const eps = 0.6;
      const fits = m.svgL >= m.cl - eps && m.svgR <= m.cr + eps && m.left >= m.cl - eps && m.right <= m.cr + eps;
      if (!fits) problems.push(`${tag}: map ${m.left.toFixed(1)}..${m.right.toFixed(1)} outside content box ${m.cl.toFixed(1)}..${m.cr.toFixed(1)}`);
      if (m.over > 0) report.push(`NOTE ${tag}: page scrolls sideways by ${m.over}px (the subject tab bar, not the map)`);
      if (lang === 'nl' && scheme === 'light') report.push(`${tag}: label ${m.lab.toFixed(1)}px, smallest place ${m.place.toFixed(1)}px, map ${m.svgL.toFixed(0)}..${m.svgR.toFixed(0)} in ${m.cl.toFixed(0)}..${m.cr.toFixed(0)}`);
      if ([390, 320, 1280].includes(width) && (scheme === 'dark' || lang === 'nl')) {
        await page.locator('.map-card').scrollIntoViewIfNeeded();
        await page.locator('.map-card').screenshot({ path: `${out}/${subject}-${lang}-${scheme}-${width}.png` });
      }
      await ctx.close();
    }
  }
} finally { await browser.close(); server.kill(); }
console.log(report.join('\n'));
if (problems.length) { console.log(`\nFAIL (${problems.length}):\n${problems.join('\n')}`); process.exit(1); }
console.log('\nmapfit ok');

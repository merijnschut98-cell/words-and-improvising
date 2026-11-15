// The subject maps (Projects and Engineering) must sit inside its card's content box, with the card's own
// inset on both sides, at every width, theme and language.
// Run: node e2e/mapfit.mjs [outDir]   (free port, see e2e/serve.mjs; E2E_PORT overrides)
import { startServer } from './serve.mjs';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require(`${execSync('npm root -g').toString().trim()}/playwright`); }
const { chromium } = playwright;
const out = process.argv[2] || 'e2e/out-mapfit';
fs.mkdirSync(out, { recursive: true });
const server = await startServer();
const BASE = server.base;
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
      // window errors (a ResizeObserver loop shows up here) and the live ResizeObservers, to see the map's one let go
      await ctx.addInitScript(() => {
        window.__errs = [];
        window.addEventListener('error', (e) => window.__errs.push(String(e.message)));
        const RO = window.ResizeObserver;
        if (!RO) return;
        window.__ro = { live: 0 };
        window.ResizeObserver = class extends RO {
          observe(...a) { if (!this.__on) { this.__on = true; window.__ro.live++; } return super.observe(...a); }
          disconnect() { if (this.__on) { this.__on = false; window.__ro.live--; } return super.disconnect(); }
        };
      });
      // MAPFIT_WIDE=1: no ResizeObserver, so the app keeps the wide map (the "before" pictures); the layout check is skipped
      if (process.env.MAPFIT_WIDE) await ctx.addInitScript(() => { window.ResizeObserver = undefined; });
      const page = await ctx.newPage();
      await page.goto(BASE);
      const has = await page.locator('.map-card .subject-map').first().waitFor({ timeout: 4000 }).then(() => true, () => false);
      if (!has) { await ctx.close(); problems.push(`${subject} ${lang} ${scheme} ${width}: no map`); continue; }
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
        const hits = [...card.querySelectorAll('.map-hit')].map((e) => e.getBoundingClientRect());
        const place = Math.min(...hits.map((e) => e.width));
        const placeH = Math.min(...hits.map((e) => e.height));
        // every label (and zone label) inside its place / zone, in view units
        const fontPx = (sel) => Math.min(...[...card.querySelectorAll(sel)].map((e) => parseFloat(getComputedStyle(e).fontSize) * (svg.width / el.viewBox.baseVal.width)));
        const zoneLab = fontPx('.subject-map .map-zone-label');
        let spill = 0;
        const lines = [];
        for (const g of card.querySelectorAll('.map-place')) {
          const hit = g.querySelector('.map-hit');
          const hx = +hit.getAttribute('x');
          const hy = +hit.getAttribute('y');
          const b = g.querySelector('.map-label').getBBox();
          lines.push(g.querySelectorAll('.map-label tspan').length);
          if (b.x < hx - 1 || b.x + b.width > hx + +hit.getAttribute('width') + 1 || b.y + b.height > hy + +hit.getAttribute('height') + 0.5) spill++;
        }
        const buttons = [...card.querySelectorAll('.map-place')].filter((g) => g.getAttribute('role') === 'button' && g.getAttribute('tabindex') === '0' && g.getAttribute('aria-label')).length;
        return { cl, cr, svgL: svg.left, svgR: svg.right, left, right, lab, place, placeH, zoneLab, spill, maxLines: Math.max(...lines), buttons, places: card.querySelectorAll('.map-place').length,
          zones: card.querySelectorAll('.map-zone').length, phone: el.classList.contains('subject-map-phone'), cardW: cr - cl, h: svg.height, next: card.querySelectorAll('.map-place.is-next').length, over: document.documentElement.scrollWidth - innerWidth };
      });
      const tag = `${subject} ${lang} ${scheme} ${width}`;
      const eps = 0.6;
      const fits = m.svgL >= m.cl - eps && m.svgR <= m.cr + eps && m.left >= m.cl - eps && m.right <= m.cr + eps;
      if (!fits) problems.push(`${tag}: map ${m.left.toFixed(1)}..${m.right.toFixed(1)} outside content box ${m.cl.toFixed(1)}..${m.cr.toFixed(1)}`);
      {
        // the phone layout below 460 px of card, the wide map above; labels big enough; every place a 44 px button
        if (!process.env.MAPFIT_WIDE && m.phone !== (m.cardW < 460)) problems.push(`${tag}: ${m.phone ? 'phone' : 'wide'} layout in a ${m.cardW.toFixed(0)} px card`);
        const need = width >= 390 ? 11 : width >= 360 ? 10 : 9;
        if (m.lab < need - 0.05) problems.push(`${tag}: place labels ${m.lab.toFixed(1)}px, need ${need}`);
        if (m.phone && m.zoneLab < need - 0.05) problems.push(`${tag}: zone labels ${m.zoneLab.toFixed(1)}px, need ${need}`);
        if (m.place < 43.5 || m.placeH < 43.5) problems.push(`${tag}: a place is ${m.place.toFixed(1)} x ${m.placeH.toFixed(1)}px, under 44`);
        if (m.spill) problems.push(`${tag}: ${m.spill} labels leave their place`);
        if (m.phone && m.maxLines > 3) problems.push(`${tag}: a label has ${m.maxLines} lines`);
        const count = subject === 'eng' ? 26 : 16;
        if (m.places !== count || m.buttons !== count || m.next > 1) problems.push(`${tag}: ${m.places} places, ${m.buttons} buttons, ${m.next} next`);
        // Engineering: four zones, and the first step of a new learner is marked once
        if (subject === 'eng' && (m.zones !== 4 || m.next !== 1)) problems.push(`${tag}: ${m.zones} zones, ${m.next} next marks`);
      }
      if (m.over > 0) report.push(`NOTE ${tag}: page scrolls sideways by ${m.over}px (the subject tab bar, not the map)`);
      if (lang === 'nl' && scheme === 'light') report.push(`${tag}: ${m.phone ? 'phone' : 'wide'}, card ${m.cardW.toFixed(0)}px, map ${m.h.toFixed(0)}px high, label ${m.lab.toFixed(1)}px, zone label ${m.zoneLab.toFixed(1)}px, smallest place ${m.place.toFixed(1)} x ${m.placeH.toFixed(1)}px, map ${m.place.toFixed(1)}px, map ${m.svgL.toFixed(0)}..${m.svgR.toFixed(0)} in ${m.cl.toFixed(0)}..${m.cr.toFixed(0)}`);
      if ([390, 320, 1280].includes(width) && (scheme === 'dark' || lang === 'nl')) {
        await page.locator('.map-card').scrollIntoViewIfNeeded();
        await page.locator('.map-card').screenshot({ path: `${out}/${subject}-${lang}-${scheme}-${width}.png` });
      }
      // tap and keyboard open the module screen in the phone layout too
      if (scheme === 'light' && width === 390) {
        const [enter, tap, name] = subject === 'eng' ? ['eng.machining', 'eng.flow', lang === 'nl' ? 'Verspanen' : 'Machining'] : ['pm.run', 'pm.plan', ''];
        await page.locator(`.map-place[data-module="${enter}"]`).focus();
        await page.keyboard.press('Enter');
        await page.locator('.module-screen').waitFor({ timeout: 4000 }).catch(() => problems.push(`${tag}: Enter on a place did not open the module`));
        if (name && !(await page.locator('.module-screen', { hasText: name }).count())) problems.push(`${tag}: Enter opened another module than ${enter}`);
        await page.locator('.module-screen .lesson-back').click().catch(() => {});
        await page.locator(`.map-card .map-place[data-module="${tap}"]`).click();
        await page.locator('.module-screen').waitFor({ timeout: 4000 }).catch(() => problems.push(`${tag}: a tap on a place did not open the module`));
        report.push(`${tag}: tap and Enter open the module screen`);
        // the home screen is gone: the map's ResizeObserver is disconnected, not left watching a detached map
        await page.waitForTimeout(300);
        const live = await page.evaluate(() => window.__ro && window.__ro.live);
        if (live) problems.push(`${tag}: ${live} ResizeObserver(s) still observing after leaving the home screen`);
      }
      const errs = await page.evaluate(() => window.__errs);
      if (errs.length) problems.push(`${tag}: window errors: ${[...new Set(errs)].join(' | ')}`);
      await ctx.close();
    }
  }
} finally { await browser.close(); server.stop(); }
console.log(report.join('\n'));
if (problems.length) { console.log(`\nFAIL (${problems.length}):\n${problems.join('\n')}`); process.exit(1); }
console.log('\nmapfit ok');

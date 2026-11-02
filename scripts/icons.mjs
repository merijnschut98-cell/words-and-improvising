// Dev only: renders the home-screen icons from the Vantage mark (brand/mark.svg)
// on the beige canvas. Run: node scripts/icons.mjs
// Writes icons/icon-192.png, icons/icon-512.png and icons/maskable-512.png.
// The maskable icon keeps the mark inside the central safe zone (80% circle).
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch {
  playwright = require(`${execSync('npm root -g').toString().trim()}/playwright`);
}
const { chromium } = playwright;

const BEIGE = '#E8DFCA';
const mark = fs.readFileSync(new URL('../brand/mark.svg', import.meta.url), 'utf8');

// The mark's drawing sits slightly above centre in its 100×100 box; nudge it down.
const page = (size, scale) => `<!doctype html><html><body style="margin:0">
  <div style="width:${size}px;height:${size}px;background:${BEIGE};display:grid;place-items:center">
    <div style="width:${Math.round(size * scale)}px;height:${Math.round(size * scale)}px;transform:translateY(${Math.round(size * 0.015)}px)">
      ${mark.replace('<svg ', '<svg width="100%" height="100%" ')}
    </div>
  </div></body></html>`;

const targets = [
  ['icons/icon-192.png', 192, 0.78],
  ['icons/icon-512.png', 512, 0.78],
  ['icons/maskable-512.png', 512, 0.56],
];

const browser = await chromium.launch();
const p = await browser.newPage({ deviceScaleFactor: 1 });
for (const [file, size, scale] of targets) {
  await p.setViewportSize({ width: size, height: size });
  await p.setContent(page(size, scale));
  await p.screenshot({ path: new URL(`../${file}`, import.meta.url).pathname, clip: { x: 0, y: 0, width: size, height: size } });
  console.log('wrote', file);
}
await browser.close();

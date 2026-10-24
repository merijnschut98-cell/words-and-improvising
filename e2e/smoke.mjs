// End-to-end smoke test: fake speech + fake coach SDK, mobile viewport.
// Run: node e2e/smoke.mjs [outDir]   (serves the repo on :8123)
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch {
  playwright = require(`${execSync('npm root -g').toString().trim()}/playwright`);
}
const { chromium } = playwright;
const out = process.argv[2] || 'e2e/out';
fs.mkdirSync(out, { recursive: true });

const server = spawn('python3', ['-m', 'http.server', '8123'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const BASE = 'http://localhost:8123/';

const FAKE_SPEECH = `
  window.__speechMode = 'ok';
  class FakeRec {
    start() {
      if (window.__speechMode === 'deny' || window.__speechMode === 'network') {
        window.__recStarts = (window.__recStarts || 0) + 1;
        const error = window.__speechMode === 'deny' ? 'not-allowed' : 'network';
        setTimeout(() => this.onerror && this.onerror({ error }), 50); setTimeout(() => this.onend && this.onend(), 80); return;
      }
      const lines = ['Um so I think', 'Um so I think this is like a really good', 'Um so I think this is like a really good point about the bridge and the river'];
      let i = 0;
      this._t = setInterval(() => {
        if (i >= lines.length) { clearInterval(this._t); this.onend && this.onend(); return; }
        const res = lines.slice(0, i + 1).map((l, k) => Object.assign([{ transcript: l }], { isFinal: k < i || i === lines.length - 1 }));
        this.onresult && this.onresult({ results: res });
        i++;
      }, 300);
    }
    stop() { clearInterval(this._t); setTimeout(() => this.onend && this.onend(), 30); }
  }
  window.SpeechRecognition = FakeRec;
`;

const FAKE_SDK = `
  class APIError extends Error {}
  export default class Anthropic {
    static AuthenticationError = class extends APIError {};
    static RateLimitError = class extends APIError {};
    static APIConnectionError = class extends APIError {};
    constructor(o) { window.__coachOpts = o; this.beta = { messages: { create: async (req) => {
      await new Promise((r) => setTimeout(r, 200));
      if (req.output_config.format.schema.properties.reply) {
        window.__partnerReqs = (window.__partnerReqs || 0) + 1;
        return { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify({ reply: 'Leuk! En hoe was dat?', end_conversation: false }) }] };
      }
      window.__coachReq = req;
      return { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify({
        scores: { clarity: 4, structure: 3, fluency: 4, vocabulary: 3 }, overall: 4,
        strength: 'Je begon meteen.', improvement: 'Begin met je punt.', stronger_version: 'Mijn punt is helder: de brug verbindt.' }) }] };
    } } }; }
  }
`;

const errors = [];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await ctx.addInitScript(FAKE_SPEECH);
await ctx.route('https://esm.sh/**', (route) => route.fulfill({ contentType: 'application/javascript', body: FAKE_SDK }));
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

const step = async (name, fn) => {
  try { await fn(); console.log('ok  ', name); } catch (e) { console.log('FAIL', name, e.message); errors.push(`${name}: ${e.message}`); }
};
const shot = async (n) => {
  const text = await page.evaluate(() => document.body.innerText);
  if (/\b(null|undefined|NaN)\b/.test(text)) errors.push(`${n}: stray null/undefined/NaN on screen`);
  await page.screenshot({ path: `${out}/${n}.png`, fullPage: true });
};

await page.goto(BASE);
await page.evaluate(() => localStorage.setItem('spraakwater:v1', JSON.stringify({ settings: { apiKey: 'sk-test' } })));
await page.reload();
await step('home renders', async () => { await page.getByText('Les van vandaag').waitFor(); await shot('01-home'); });

await step('lesson: 3 rounds', async () => {
  await page.getByText('Les van vandaag').click();
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'Start' }).click();
    const ready = page.getByRole('button', { name: 'Ik ben er klaar voor' });
    if (await ready.isVisible().catch(() => false)) { if (i === 0) await shot('02-prep'); await ready.click(); }
    await page.waitForTimeout(1300);
    if (i === 0) await shot('03-answer');
    await page.getByRole('button', { name: 'Klaar' }).click();
    await page.locator('.stats').waitFor();
    await page.locator('.coach-card .scores').waitFor({ timeout: 5000 });
    await page.locator('.rate-btn').nth(3).click();
    if (i === 0) await shot('04-feedback');
    await page.getByRole('button', { name: /Volgende|Afronden/ }).click();
  }
  await page.getByText('Les voltooid').waitFor();
  await shot('05-done');
});

await step('coach request is well-formed', async () => {
  const req = await page.evaluate(() => window.__coachReq);
  const opts = await page.evaluate(() => window.__coachOpts);
  if (req.model !== 'claude-opus-5-5' || req.fallbacks !== 'default' || !opts.dangerouslyAllowBrowser) throw new Error(JSON.stringify(req).slice(0, 200));
  if (!/Um so I think/.test(req.messages[0].content)) throw new Error('transcript missing');
});

await step('state persisted after reload', async () => {
  await page.getByRole('button', { name: 'Terug naar home' }).click();
  await page.reload();
  const st = await page.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')));
  if (st.history.length !== 3) throw new Error(`history ${st.history.length}`);
  if (st.streak.count !== 1) throw new Error('streak');
  if (!(st.xp > 0)) throw new Error('xp');
  if (st.history.some((h) => /(\bUm so I think\b.*){2}/.test(h.transcript))) throw new Error('duplicated transcript: ' + st.history[0].transcript);
  await shot('06-home-after');
});

await step('mic denied falls back to typing', async () => {
  await page.evaluate(() => { window.__speechMode = 'deny'; });
  await page.locator('.drill-minute').click();
  await page.getByRole('button', { name: 'Start' }).click();
  const ready = page.getByRole('button', { name: 'Ik ben er klaar voor' });
  if (await ready.isVisible().catch(() => false)) await ready.click();
  await page.locator('textarea').waitFor({ timeout: 3000 });
  await page.locator('textarea').fill('Dit is een getypt antwoord over het onderwerp met genoeg woorden erin');
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.locator('.stats').waitFor();
  await page.evaluate(() => { window.__speechMode = 'ok'; });
});

await step('network speech error falls back to typing without restart loop', async () => {
  await page.goto(BASE);
  await page.evaluate(() => { window.__speechMode = 'network'; window.__recStarts = 0; });
  await page.locator('.drill-prep').click();
  await page.getByRole('button', { name: 'Start' }).click();
  const ready = page.getByRole('button', { name: 'Ik ben er klaar voor' });
  if (await ready.isVisible().catch(() => false)) await ready.click();
  await page.locator('textarea').waitFor({ timeout: 3000 });
  await page.waitForTimeout(600);
  const starts = await page.evaluate(() => window.__recStarts);
  if (starts !== 1) throw new Error(`recognizer started ${starts} times`);
  await page.evaluate(() => { window.__speechMode = 'ok'; });
});

await step('quitting mid-round stays home', async () => {
  await page.goto(BASE);
  await page.locator('.drill-minute').click();
  await page.getByRole('button', { name: 'Start' }).click();
  const ready = page.getByRole('button', { name: 'Ik ben er klaar voor' });
  if (await ready.isVisible().catch(() => false)) await ready.click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Close' }).click();
  await page.waitForTimeout(2000);
  const screen = await page.evaluate(() => document.getElementById('app').dataset.screen);
  if (screen !== 'home') throw new Error(`ended on ${screen}`);
});

await step('live conversation: 4 turns then feedback with dialogue', async () => {
  await page.goto(BASE);
  await page.locator('.convo-card').click();
  await page.getByRole('button', { name: 'Start' }).click();
  for (let i = 0; i < 4; i++) {
    const mic = page.getByRole('button', { name: /Tik en praat/ });
    await mic.waitFor({ timeout: 15000 });
    await mic.click();
    await page.waitForTimeout(1100);
    if (i === 0) await shot('10-convo');
    await page.getByRole('button', { name: /Verstuur/ }).click();
  }
  await page.locator('.chat-controls .btn-primary', { hasText: 'Afronden' }).waitFor({ timeout: 15000 });
  await shot('11-convo-end');
  await page.locator('.chat-controls .btn-primary', { hasText: 'Afronden' }).click();
  await page.locator('.coach-card .scores').waitFor({ timeout: 5000 });
  const req = await page.evaluate(() => window.__coachReq);
  if (!/Them: /.test(req.messages[0].content) || !/Him: /.test(req.messages[0].content)) throw new Error('dialogue missing in coach request');
  const n = await page.evaluate(() => window.__partnerReqs);
  if (n !== 4) throw new Error(`partner called ${n} times`);
});

await step('story chain shows a twist and passes it to the coach', async () => {
  await page.goto(BASE);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    st.drillLevels.story = 5;
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.reload();
  await page.locator('.drill-story').click();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.locator('.twist:not([hidden])').waitFor({ timeout: 12000 });
  await shot('12-story');
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.locator('.coach-card .scores').waitFor({ timeout: 5000 });
  const req = await page.evaluate(() => window.__coachReq);
  if (!/Twists that appeared, in order: (?!\(none\))/.test(req.messages[0].content)) throw new Error('twists missing in coach request');
});

await step('too-short answer offers retry', async () => {
  await page.goto(BASE);
  await page.locator('.drill-rapid').click();
  await page.getByRole('radio', { name: /Typen/ }).click();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.locator('textarea').fill('ja');
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.getByRole('button', { name: 'Opnieuw' }).waitFor();
  await shot('07-too-short');
});

await step('english + progress + settings', async () => {
  await page.goto(BASE);
  await page.getByRole('button', { name: /Instellingen/ }).click();
  await page.getByRole('button', { name: /English/ }).click();
  await page.getByText('Settings', { exact: false }).first().waitFor();
  await shot('08-settings');
  await page.getByRole('button', { name: /Progress/ }).click();
  await page.locator('.spark').first().waitFor();
  await shot('09-progress');
});

await step('offline after first load', async () => {
  await page.goto(BASE);
  await page.waitForFunction(() => navigator.serviceWorker.controller || navigator.serviceWorker.ready, null, { timeout: 5000 });
  await page.waitForTimeout(800);
  await ctx.setOffline(true);
  await page.reload();
  await page.locator('.btn-hero').waitFor({ timeout: 5000 });
  await ctx.setOffline(false);
});

await browser.close();
server.kill();
if (errors.length) { console.log('\nERRORS:\n' + errors.join('\n')); process.exit(1); }
console.log('\nall good');

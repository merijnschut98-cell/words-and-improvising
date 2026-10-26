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
    constructor(o) { window.__coachOpts = o; this.models = { retrieve: async (m) => ({ id: m }) }; this.beta = { messages: { create: async (req) => {
      await new Promise((r) => setTimeout(r, 200));
      if (req.output_config.format.schema.properties.drill) {
        return { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify({ drill: 'bridge', focus: 'Minder eh, meer pauze', body: 'Je laatste teamuitje', audience: '', words: ['anker', 'fiets', 'storm'], setting: '' }) }] };
      }
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
await step('first run shows the welcome slides', async () => {
  await page.getByRole('heading', { name: 'Snel denken, helder praten' }).waitFor({ timeout: 5000 });
  await shot('00-welcome');
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Volgende' }).click();
  await page.getByRole('button', { name: 'Na je ochtendkoffie' }).click();
  await page.locator('select').selectOption('8');
  await shot('00b-plan');
  await page.getByRole('button', { name: 'Aan de slag' }).click();
  await page.locator('.btn-hero').waitFor();
  await page.locator('.plan-line', { hasText: 'Na je ochtendkoffie · ~08:00' }).waitFor();
});
await page.evaluate(() => localStorage.setItem('spraakwater:v1', JSON.stringify({ onboarded: true, settings: { apiKey: 'sk-test' } })));
await page.reload();
await step('home renders', async () => { await page.locator('.btn-hero').waitFor(); await shot('01-home'); });

await step('lesson: 3 rounds', async () => {
  await page.locator('.btn-hero').click();
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'Start' }).click();
    const ready = page.getByRole('button', { name: 'Ik ben er klaar voor' });
    if (await ready.isVisible().catch(() => false)) { if (i === 0) await shot('02-prep'); await ready.click(); }
    // Spoken-cue drills talk first; wait until it is his turn.
    await page.locator('.phase-label.go').waitFor({ timeout: 20000 });
    await page.waitForTimeout(1300);
    if (i === 0) {
      await page.locator('.clean-chip', { hasText: 'schone reeks' }).waitFor();
      await shot('03-answer');
    }
    await page.getByRole('button', { name: 'Klaar' }).click();
    await page.locator('.stats').first().waitFor();
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
  await page.locator('.stats').first().waitFor();
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
  await page.locator('.convo-card:not(.target-card)').click();
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

await step('pause drill shows live counters and pause stats', async () => {
  await page.goto(BASE);
  await page.locator('.drill-pause').click();
  await page.getByRole('button', { name: 'Start' }).click();
  const ready = page.getByRole('button', { name: 'Ik ben er klaar voor' });
  if (await ready.isVisible().catch(() => false)) await ready.click();
  await page.locator('.pause-counters .counter.bad').waitFor({ timeout: 5000 });
  await shot('13-pause');
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.locator('.stats.two').waitFor({ timeout: 5000 });
  await shot('14-pause-feedback');
});

await step('test my key reports success', async () => {
  await page.goto(BASE);
  await page.getByRole('button', { name: /Instellingen/ }).click();
  await page.getByRole('button', { name: /Test mijn sleutel/ }).click();
  await page.getByText('Sleutel werkt', { exact: false }).waitFor({ timeout: 5000 });
  await shot('15-testkey');
});

await step('targeted practice: AI exercise with focus line', async () => {
  await page.goto(BASE);
  await page.locator('.target-card').click();
  await page.getByText('🎯 Minder eh, meer pauze').waitFor({ timeout: 5000 });
  await page.getByRole('heading', { name: 'Woordbrug' }).waitFor();
  await shot('16-targeted');
});

await step('targeted practice without key falls back to the weekly focus', async () => {
  await page.goto(BASE);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    st.settings.apiKey = '';
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.reload();
  await page.locator('.target-card').click();
  await page.locator('.intro-card').waitFor({ timeout: 5000 });
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    st.settings.apiKey = 'sk-test';
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
});

await step('finish while recording keeps the last answer', async () => {
  await page.goto(BASE);
  await page.locator('.convo-card:not(.target-card)').click();
  await page.getByRole('button', { name: 'Start' }).click();
  const mic = page.getByRole('button', { name: /Tik en praat/ });
  await mic.waitFor({ timeout: 15000 });
  await mic.click(); await page.waitForTimeout(1100);
  await page.getByRole('button', { name: /Verstuur/ }).click();
  await mic.waitFor({ timeout: 15000 });
  await mic.click(); await page.waitForTimeout(1100);
  await page.locator('.chat-controls .btn-ghost', { hasText: 'Afronden' }).click();
  await page.locator('.coach-card .scores').waitFor({ timeout: 8000 });
  const req = await page.evaluate(() => window.__coachReq);
  const hims = (req.messages[0].content.match(/^Him: /gm) || []).length;
  if (hims !== 2) throw new Error(`expected 2 user turns, got ${hims}`);
});

await step('leaving home while targeted practice loads stays where you went', async () => {
  await page.goto(BASE);
  await page.locator('.target-card').click();
  await page.getByRole('button', { name: /Voortgang/ }).click();
  await page.waitForTimeout(1200);
  const screen = await page.evaluate(() => document.getElementById('app').dataset.screen);
  if (screen !== 'progress') throw new Error(`ended on ${screen}`);
});

await step('say it again shows a before/after comparison', async () => {
  await page.goto(BASE);
  await page.locator('.drill-minute').click();
  for (let i = 0; i < 2; i++) {
    await page.getByRole('button', { name: 'Start' }).click();
    const ready = page.getByRole('button', { name: 'Ik ben er klaar voor' });
    if (await ready.isVisible().catch(() => false)) await ready.click();
    await page.waitForTimeout(1300);
    await page.getByRole('button', { name: 'Klaar' }).click();
    await page.locator('.stats').first().waitFor();
    if (i === 0) await page.locator('main > .btn-ghost', { hasText: 'Zeg het nog eens' }).click();
  }
  await page.locator('.compare-card').waitFor({ timeout: 3000 });
  await shot('17-compare');
});

await step('debate flips sides at half time', async () => {
  await page.goto(BASE);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    st.drillLevels.debate = 1; // 30 s answer: flips at 15 s
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.reload();
  await page.locator('.drill-debate').click();
  await page.getByRole('button', { name: 'Start' }).click();
  const ready = page.getByRole('button', { name: 'Ik ben er klaar voor' });
  if (await ready.isVisible().catch(() => false)) await ready.click();
  await page.locator('.side-banner:not(.against)').waitFor({ timeout: 3000 });
  await page.locator('.side-banner.against').waitFor({ timeout: 20000 });
  await shot('18-debate');
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.locator('.stats').first().waitFor();
});

await step('daily quests: cold start completes a quest with a toast', async () => {
  await page.goto(BASE);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    const d = new Date(); const p = (n) => String(n).padStart(2, '0');
    const today = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
    st.quests = { day: today, items: [{ id: 'coldStart', done: false }, { id: 'sayAgain', done: false }, { id: 'bridgeAll', done: false }] };
    st.drillLevels.minute = 1;
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.reload();
  await page.locator('.quest-card .quest').first().waitFor();
  await shot('19-quests');
  await page.locator('.drill-minute').click();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Ik ben er klaar voor' }).click();
  await page.waitForTimeout(1300);
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.locator('.stats').first().waitFor();
  await page.getByRole('button', { name: /Volgende|Afronden/ }).click();
  await page.locator('.toast', { hasText: 'Opdracht' }).waitFor({ timeout: 3000 });
  await page.locator('.quest.done').first().waitFor({ timeout: 3000 });
});

const dayAgo = (n) => page.evaluate((n) => {
  const d = new Date(); d.setDate(d.getDate() - n); const p = (x) => String(x).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}, n);
const patchState = (patch) => page.evaluate((patch) => {
  const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
  localStorage.setItem('spraakwater:v1', JSON.stringify({ ...st, ...patch }));
}, patch);

await step('streak freeze covers one missed day', async () => {
  await page.goto(BASE);
  await patchState({ streak: { count: 5, lastDay: await dayAgo(2) }, freezes: 1, freezeLog: [] });
  await page.reload();
  await page.locator('.toast', { hasText: 'bevriezer' }).waitFor({ timeout: 3000 });
  await page.locator('.day.frozen').waitFor();
  const head = await page.locator('.top .streak b').textContent();
  if (head !== '5') throw new Error(`streak shows ${head}`);
  await shot('20-freeze');
});

await step('broken streak shows a gentle banner once', async () => {
  await patchState({ streak: { count: 5, lastDay: await dayAgo(4) }, freezes: 0, ui: {} });
  await page.reload();
  await page.locator('.break-card').waitFor({ timeout: 3000 });
  await page.reload();
  await page.waitForTimeout(300);
  if (await page.locator('.break-card').count()) throw new Error('banner shown twice');
});

await step('quick round is a 60 second minute round', async () => {
  await page.goto(BASE);
  await page.locator('.quick-btn').click();
  await page.locator('.intro-card', { hasText: '1:00' }).waitFor({ timeout: 3000 });
});

await step('personal best card on a real-length round', async () => {
  await page.goto(BASE);
  await page.locator('.drill-minute').click();
  await page.getByRole('radio', { name: /Typen/ }).click();
  await page.getByRole('button', { name: 'Start' }).click();
  const ready = page.getByRole('button', { name: 'Ik ben er klaar voor' });
  if (await ready.isVisible().catch(() => false)) await ready.click();
  await page.locator('textarea').fill(Array.from({ length: 40 }, (_, i) => `woord${i}`).join(' '));
  await page.waitForTimeout(5500);
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.locator('.pb-card').waitFor({ timeout: 3000 });
  await shot('21-pb');
});

await step('make it harder adds a modifier with a feedback note', async () => {
  await page.goto(BASE);
  await page.locator('.drill-explain').click();
  const harder = page.getByRole('button', { name: /moeilijker|Normale ronde/ });
  if (!(await page.locator('.modifier-chip').count())) await harder.click();
  await page.locator('.modifier-chip').waitFor();
  await shot('22-modifier');
  await page.getByRole('button', { name: 'Start' }).click();
  const ready = page.getByRole('button', { name: 'Ik ben er klaar voor' });
  if (await ready.isVisible().catch(() => false)) await ready.click();
  await page.waitForTimeout(1300);
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.locator('.note', { hasText: '+5 XP' }).waitFor({ timeout: 3000 });
});

await step('boss card shows on a Friday', async () => {
  // Own context: Playwright's clock is context-wide and would leak into later steps.
  const c2 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await c2.addInitScript(() => {
    if (!localStorage.getItem('spraakwater:v1')) localStorage.setItem('spraakwater:v1', JSON.stringify({ onboarded: true }));
  });
  const p2 = await c2.newPage();
  await p2.clock.setFixedTime(new Date(2026, 9, 30, 10, 0));
  await p2.goto(BASE);
  await p2.locator('.boss-card').waitFor({ timeout: 5000 });
  await p2.screenshot({ path: `${out}/23-boss-home.png`, fullPage: true });
  await c2.close();
});

await step('boss round combines words, sides and double XP framing', async () => {
  await page.goto(BASE);
  await page.evaluate(async () => {
    const { makePrompt } = await import('./src/core/lesson.js');
    const { default: nl } = await import('./src/content/prompts.nl.js');
    window.__app.go('round', { prompt: makePrompt('boss', nl, Math.random, {}), modifier: null });
  });
  await page.locator('.intro-card', { hasText: 'Dubbele XP' }).waitFor();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Ik ben er klaar voor' }).click();
  await page.locator('.side-banner:not(.against)').waitFor();
  if ((await page.locator('.chip.word').count()) !== 3) throw new Error('expected 3 word chips');
  await page.waitForTimeout(1300);
  await shot('24-boss');
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.locator('.stats').first().waitFor();
});

await step('progress shows skill radar and calibration', async () => {
  await page.goto(BASE);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    const base = st.history[0];
    const fake = [3, 2, 3, 2].map((rating, i) => ({ ...base, ts: Date.now() - i * 60000, rating,
      coach: { overall: 4, scores: { clarity: 4, structure: 3, fluency: 4 - (i % 2), vocabulary: 3 }, strength: 's', improvement: 'i', stronger_version: 'v' } }));
    st.history = [...fake, ...st.history];
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.reload();
  await page.getByRole('button', { name: /Voortgang/ }).click();
  await page.locator('.skill-card .radar-shape').waitFor();
  await page.locator('.calib-card', { hasText: 'strenger' }).waitFor();
  await page.locator('.skill-card').scrollIntoViewIfNeeded();
  await shot('25-radar');
});

await step('journey path and an unlocked theme', async () => {
  await page.goto(BASE);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    st.milestones = ['firstWords', 'threeDays', 'weekOne'];
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.reload();
  await page.getByRole('button', { name: /Voortgang/ }).click();
  await page.locator('.journey-card .ms.next').waitFor();
  if ((await page.locator('.journey-card .ms.reached').count()) !== 3) throw new Error('expected 3 reached milestones');
  await page.locator('.journey-card').scrollIntoViewIfNeeded();
  await shot('26-journey');
  await page.getByRole('button', { name: /Instellingen/ }).click();
  await page.locator('.theme-swatch', { hasText: 'Oceaan' }).click();
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'ocean');
  if (!(await page.locator('.theme-swatch', { hasText: 'Nacht' }).isDisabled())) throw new Error('night should be locked');
  await page.locator('.theme-row').scrollIntoViewIfNeeded();
  await shot('27-theme');
  await page.locator('.theme-swatch', { hasText: 'Zonsondergang' }).click();
  await page.waitForFunction(() => !document.documentElement.dataset.theme);
});

await step('yes-and speaks a line, then listens per item', async () => {
  await page.goto(BASE);
  await page.locator('.drill-yesAnd').click();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.locator('.phase-label.go').waitFor({ timeout: 12000 });
  const line = await page.locator('.cue-text').textContent();
  if (!line || line === '…') throw new Error('cue line not shown');
  await page.waitForTimeout(1300);
  await shot('28-yesand');
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.locator('.stats').first().waitFor();
});

await step('listen & respond hides the statement and shows the question', async () => {
  await page.goto(BASE);
  await page.locator('.drill-listen').click();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.locator('.phase-label.go').waitFor({ timeout: 12000 });
  if (await page.locator('.listen-statement').isVisible()) throw new Error('statement should be hidden');
  const q = await page.locator('.cue-text').textContent();
  if (!q.trim().endsWith('?')) throw new Error(`expected a question, got ${q}`);
  await page.waitForTimeout(1300);
  await shot('29-listen');
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.locator('.stats').first().waitFor();
});

await step('expert interview runs all five items and finishes by itself', async () => {
  await page.goto(BASE);
  await page.evaluate(async () => {
    const { makePrompt } = await import('./src/core/lesson.js');
    const { default: nl } = await import('./src/content/prompts.nl.js');
    window.__app.go('round', { prompt: makePrompt('expert', nl, Math.random, {}), modifier: null, timing: { prepS: 0, answerS: 2, questions: 5 } });
  });
  await page.getByRole('button', { name: 'Start' }).click();
  await page.locator('.rapid-dots i.on').nth(4).waitFor({ timeout: 45000 });
  await page.locator('.stats').first().waitFor({ timeout: 20000 });
  await shot('30-expert-feedback');
});

await step('challenge link opens the same prompt and offers a reply', async () => {
  await page.goto(`${BASE}?c=prep.opinion:o07.nl`);
  await page.locator('.note', { hasText: 'daagt je uit' }).waitFor();
  if (page.url().includes('?c=')) throw new Error('challenge query should be cleared');
  await page.getByRole('button', { name: 'Start' }).click();
  const go = page.getByRole('button', { name: 'Ik ben er klaar voor' });
  if (await go.isVisible().catch(() => false)) await go.click();
  await page.locator('.live').waitFor();
  await page.waitForTimeout(1300);
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.locator('.stats').first().waitFor();
  await page.getByRole('button', { name: /Antwoord met jouw resultaat/ }).click();
  await page.locator('.toast').first().waitFor({ timeout: 3000 });
  await shot('31-challenge-reply');
});

await step('share card renders as a PNG', async () => {
  const data = await page.evaluate(async () => {
    const { drawShareCard } = await import('./src/core/share.js');
    const blob = await drawShareCard({ title: 'Les klaar 🎉', rows: [['verdiend deze les', '+45 XP'], ['dagen reeks', '🔥 4'], ['Langste schone reeks: 54 woorden', '🏆']], footer: 'Spraakwater' });
    const buf = new Uint8Array(await blob.arrayBuffer());
    let bin = '';
    for (const b of buf) bin += String.fromCharCode(b);
    return btoa(bin);
  });
  const { writeFileSync } = await import('node:fs');
  writeFileSync(`${out}/32-share-card.png`, Buffer.from(data, 'base64'));
});

await step('spaced re-attempt: due prompt on home, compared with last time', async () => {
  await page.goto(BASE);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    const d = new Date(Date.now() - 86400000);
    const yesterday = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    st.reviews = { 'opinion:o07': { box: 1, due: yesterday, drill: 'prep', lang: 'nl' } };
    const base = st.history[0];
    st.history.push({ ...base, ts: Date.now() - 2 * 86400000, drill: 'prep', promptId: 'opinion:o07', metrics: { ...base.metrics, fillerRate: 9.9, words: 40 } });
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.reload();
  await page.locator('.review-card').waitFor();
  await page.locator('.review-card').scrollIntoViewIfNeeded();
  await shot('33-review-home');
  await page.locator('.review-card').click();
  await page.getByRole('button', { name: 'Start' }).click();
  const ready = page.getByRole('button', { name: 'Ik ben er klaar voor' });
  if (await ready.isVisible().catch(() => false)) await ready.click();
  await page.locator('.phase-label.go').waitFor({ timeout: 20000 });
  await page.waitForTimeout(1300);
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.locator('.compare-card', { hasText: 'Vorige keer' }).waitFor();
  await page.locator('.compare-card').scrollIntoViewIfNeeded();
  await shot('34-review-compare');
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

await step('reminder meta is written for the service worker', async () => {
  const meta = await page.evaluate(async () => {
    const r = await (await caches.open('spraakwater-meta')).match('./__meta');
    return r ? r.json() : null;
  });
  if (!meta || !meta.lastDay || !meta.nudge || !meta.nudge.title) throw new Error(JSON.stringify(meta));
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

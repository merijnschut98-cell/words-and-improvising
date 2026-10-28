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
      // An automatic restart after a natural end (Android behaviour, no stop()
      // in between) stays silent: real speech would not replay the sentence.
      if (window.__autoRestart) return;
      const lines = ['Um so I think', 'Um so I think this is like a really good', 'Um so I think this is like a really good point about the bridge and the river'];
      let i = 0;
      this._t = setInterval(() => {
        if (i >= lines.length) { clearInterval(this._t); window.__autoRestart = true; this.onend && this.onend(); return; }
        const res = lines.slice(0, i + 1).map((l, k) => Object.assign([{ transcript: l }], { isFinal: k < i || i === lines.length - 1 }));
        this.onresult && this.onresult({ results: res });
        i++;
      }, 300);
    }
    stop() { window.__autoRestart = false; clearInterval(this._t); setTimeout(() => this.onend && this.onend(), 30); }
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
      if (req.output_config.format.schema.properties.question) {
        window.__hqReq = req;
        window.__hqCount = (window.__hqCount || 0) + 1;
        return { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify({ question: 'En wat als de plantmanager zegt dat er geen tijd voor is?' }) }] };
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
// Most steps click drills on home directly: keep the "Choose myself" grid open on every load.
await ctx.addInitScript(() => {
  try {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1') || 'null');
    if (st) localStorage.setItem('spraakwater:v1', JSON.stringify({ ...st, ui: { ...(st.ui || {}), gridOpen: true } }));
  } catch { /* first run */ }
});
await ctx.route('https://esm.sh/**', (route) => route.fulfill({ contentType: 'application/javascript', body: FAKE_SDK }));
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

const step = async (name, fn) => {
  try { await fn(); console.log('ok  ', name); } catch (e) { console.log('FAIL', name, e.message); errors.push(`${name}: ${e.message}`); }
};
const shot = async (n) => {
  const text = await page.evaluate(() => document.body.innerText);
  // No word boundary on the right: "nullnull" must be caught too.
  if (/(?<![A-Za-z])(null|undefined|NaN)/.test(text)) errors.push(`${n}: stray null/undefined/NaN on screen`);
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
await page.evaluate(async () => {
  // Mark this week's focus as answered so seeded older rounds don't open the weekly screen.
  const { isoWeekKey } = await import('./src/core/boss.js');
  localStorage.setItem('spraakwater:v1', JSON.stringify({ onboarded: true, settings: { apiKey: 'sk-test' }, weekly: { week: isoWeekKey(new Date()), focus: null }, ui: { gridOpen: true } }));
});
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
  const dup = st.history.find((h) => /(\bUm so I think\b.*){2}/.test(h.transcript));
  if (dup) throw new Error(`duplicated transcript in ${dup.drill} (${dup.durationS}s): ${dup.transcript}`);
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
  await page.getByRole('button', { name: 'Sluiten' }).click();
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
  await page.waitForTimeout(1000); // let the fake mic finish its sentence (under 5 words = too short)
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

await step('adaptive lesson leads with the weakest drill', async () => {
  await page.goto(BASE);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    const base = st.history[0];
    st.history = [1, 2, 1].map((rating, i) => ({ ...base, ts: Date.now() - i * 1000, drill: 'debate', rating }))
      .concat(st.history.map((e) => ({ ...e, rating: 5 })));
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.reload();
  await page.locator('.btn-hero', { hasText: 'focus: Debat' }).waitFor();
  await page.locator('.btn-hero').click();
  await page.locator('.reason-chip', { hasText: 'zwakste' }).waitFor();
  await shot('35-adaptive-intro');
  await page.getByRole('button', { name: 'Sluiten' }).click();
});

await step('frames drill: pick a frame at level 3, then see its steps', async () => {
  await page.goto(BASE);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    st.drillLevels.frame = 3;
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.reload();
  await page.locator('.drill-frame').click();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.locator('.frame-pick button').first().waitFor();
  if (await page.locator('.ring-wrap').count()) throw new Error('timer must not run while picking a frame');
  await shot('36-frame-pick');
  await page.locator('.frame-pick button').first().click();
  await page.locator('.frame-name').waitFor();
  if ((await page.locator('.prompt-card .scaffold .chip').count()) < 3) throw new Error('frame steps missing');
  await shot('37-frame-steps');
  // Level-3 prep is only 6 s; the full-page screenshot can use most of it.
  const ready3 = page.getByRole('button', { name: 'Ik ben er klaar voor' });
  if (await ready3.isVisible().catch(() => false)) await ready3.click().catch(() => {});
  await page.locator('.phase-label.go').waitFor({ timeout: 20000 });
  await page.waitForTimeout(1300);
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.locator('.stats').first().waitFor();
});

await step('real-life drill shows a captain or work situation', async () => {
  await page.goto(BASE);
  await page.locator('.drill-real').click();
  await page.getByRole('button', { name: 'Start' }).click();
  const ready = page.getByRole('button', { name: 'Ik ben er klaar voor' });
  await page.locator('.real-text').waitFor();
  await page.locator('.prompt-card .prompt-sub', { hasText: /Als aanvoerder|Op het werk/ }).waitFor();
  await shot('38-real');
  if (await ready.isVisible().catch(() => false)) await ready.click();
  await page.locator('.phase-label.go').waitFor({ timeout: 20000 });
  await page.waitForTimeout(1300);
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.locator('.stats').first().waitFor();
});

await step('follow-up drill speaks a line and checks question + detail', async () => {
  await page.goto(BASE);
  await page.locator('.drill-followUp').click();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.locator('.phase-label.go').waitFor({ timeout: 20000 });
  await page.waitForTimeout(1300);
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.locator('.followup-card').waitFor();
  await page.locator('.followup-card').scrollIntoViewIfNeeded();
  await shot('39-followup');
});

await step('my real week: add, rehearse, reflect (text stays text)', async () => {
  await page.goto(BASE);
  await page.locator('.rw-invite').click();
  await page.locator('.realweek select').selectOption('presentation');
  await page.locator('.realweek .text-input').fill('<b>A3</b> review met de plantmanager');
  await page.getByRole('button', { name: /Toevoegen/ }).click();
  await page.locator('.rw-event .rw-text', { hasText: '<b>A3</b> review' }).waitFor();
  if (await page.locator('.rw-event .rw-text b').count()) throw new Error('event text was interpreted as HTML');
  await shot('40-realweek');
  await page.getByRole('button', { name: /Oefenen/ }).first().click();
  await page.locator('.intro-card .focus', { hasText: '60' }).waitFor();
  await page.getByRole('button', { name: 'Sluiten' }).click();
  await page.locator('.rw-home').waitFor();
  await page.locator('.rw-home').scrollIntoViewIfNeeded();
  await shot('41-realweek-home');
  // A past event asks for a two-tap reflection, which shows up on Progress.
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    st.events = [{ id: 'old', type: 'teamtalk', date: '2026-01-05', text: 'Praatje voor de wedstrijd', reflection: null }];
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.reload();
  await page.locator('.rw-card').click();
  await page.locator('.rw-reflect .rate-btn').nth(3).click();
  await page.locator('.rw-reflect .text-input').fill('eerst mijn punt, dan de uitleg');
  await page.getByRole('button', { name: 'Opslaan' }).click();
  await page.getByRole('button', { name: /Voortgang/ }).click().catch(async () => { await page.goto(BASE); await page.getByRole('button', { name: /Voortgang/ }).click(); });
  await page.locator('.rw-learned', { hasText: 'eerst mijn punt' }).waitFor();
});

await step('pace over time and one fix carried to the next round', async () => {
  await page.goto(BASE);
  const open = () => page.evaluate(async () => {
    const { makePrompt } = await import('./src/core/lesson.js');
    const { default: nl } = await import('./src/content/prompts.nl.js');
    window.__app.session = null;
    window.__app.go('round', { prompt: makePrompt('minute', nl, Math.random, {}), modifier: null, timing: { prepS: 0, answerS: 22, questions: 1 } });
  });
  await open();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.locator('.stats').first().waitFor({ timeout: 40000 });
  await page.locator('.pace-card .pace-bar').nth(1).waitFor();
  await page.locator('.fix-options button').first().click();
  await page.locator('.pace-card').scrollIntoViewIfNeeded();
  await shot('42-pace');
  await page.locator('.fix-card').scrollIntoViewIfNeeded();
  await shot('43-fix');
  await open();
  await page.locator('.intro-card .fix-chip').waitFor();
  await shot('44-fix-intro');
});

await step('too-short retry keeps the modifier and the chosen fix', async () => {
  await page.goto(BASE);
  await page.evaluate(async () => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    st.ui = { ...(st.ui || {}), nextFix: { text: 'Noem mijn punt eerst' } };
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.reload();
  await page.evaluate(async () => {
    const { makePrompt } = await import('./src/core/lesson.js');
    const { default: nl } = await import('./src/content/prompts.nl.js');
    window.__app.session = null;
    window.__app.go('round', { prompt: makePrompt('minute', nl, Math.random, {}), modifier: 'slow', timing: { prepS: 0, answerS: 30, questions: 1 } });
  });
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.getByRole('button', { name: 'Opnieuw', exact: true }).click();
  await page.locator('.intro-card .fix-chip').waitFor();
  await page.locator('.intro-card .modifier-chip').waitFor();
});

await step('a past event can be deleted instead of reflected on', async () => {
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    st.events = [{ id: 'gone', type: 'client', date: '2026-01-06', text: 'Geannuleerd overleg', reflection: null }];
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.goto(BASE);
  await page.locator('.rw-card').click();
  await page.locator('.rw-reflect .icon-btn').click();
  await page.locator('.realweek').waitFor();
  if (await page.locator('.rw-reflect').count()) throw new Error('past event should be gone');
});

await step('a fresh install opened from a challenge gets the welcome afterwards', async () => {
  const c3 = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await c3.addInitScript(FAKE_SPEECH);
  const p3 = await c3.newPage();
  await p3.goto(`${BASE}?c=minute.topic:t01.nl`);
  await p3.getByRole('button', { name: 'Start' }).click();
  const ready = p3.getByRole('button', { name: 'Ik ben er klaar voor' });
  if (await ready.isVisible().catch(() => false)) await ready.click();
  await p3.locator('.phase-label.go').waitFor({ timeout: 20000 });
  await p3.waitForTimeout(1300);
  await p3.getByRole('button', { name: 'Klaar' }).click();
  await p3.locator('.stats').first().waitFor();
  await p3.getByRole('button', { name: /Volgende|Afronden/ }).click();
  await p3.locator('.screen.welcome').waitFor();
  await c3.close();
});

await step('accessibility: focus moves to the screen heading, close button is labelled', async () => {
  await page.goto(BASE);
  await page.getByRole('button', { name: /Voortgang/ }).click();
  const tag = await page.evaluate(() => document.activeElement && document.activeElement.className);
  if (!/round-title/.test(tag)) throw new Error(`focus is on "${tag}", expected the screen heading`);
  await page.locator('.drill-minute').click().catch(async () => { await page.goto(BASE); await page.locator('.drill-minute').click(); });
  await page.getByRole('button', { name: 'Sluiten' }).waitFor();
  await page.getByRole('button', { name: 'Sluiten' }).click();
});

await step('coach writes the hard question only after he shares the event line', async () => {
  await page.goto(BASE);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    st.settings = { ...st.settings, apiKey: 'sk-test' };
    st.events = [{ id: 'hq', type: 'presentation', date: '2099-01-01', text: 'A3 over omsteltijden', reflection: null }];
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.goto(BASE);
  await page.locator('.rw-home .btn-ghost').click();
  await page.locator('.rw-share input').check();
  await shot('45-rw-share');
  await page.getByRole('button', { name: /Oefenen/ }).first().click();
  await page.locator('.intro-card').waitFor();
  const hard = await page.evaluate(() => window.__app.session.prompts[1].body);
  if (!/geen tijd/.test(hard)) throw new Error(`hard question not from coach: ${hard}`);
  const sent = await page.evaluate(() => JSON.stringify(window.__hqReq));
  if (!sent.includes('A3 over omsteltijden')) throw new Error('shared line missing from request');
  await page.getByRole('button', { name: 'Sluiten' }).click();
});

await step('import a backup: confirm replaces progress and keeps the old value', async () => {
  await page.goto(BASE);
  const exported = await page.evaluate(() => localStorage.getItem('spraakwater:v1'));
  const st = JSON.parse(exported);
  st.xp = 4321;
  await page.getByRole('button', { name: /Instellingen/ }).click();
  await page.locator('input[type=file]').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from('{oops') });
  await page.locator('.toast').filter({ hasText: 'Spraakwater' }).first().waitFor();
  if (await page.locator('.import-confirm').count()) throw new Error('bad file should not offer a confirm');
  await page.locator('input[type=file]').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(st)) });
  await page.locator('.import-confirm').getByText('4321 XP').waitFor();
  await shot('07b-import-confirm');
  await page.getByRole('button', { name: 'Vervang mijn voortgang' }).click();
  await page.locator('.btn-hero').waitFor();
  const after = await page.evaluate(() => ({ xp: JSON.parse(localStorage.getItem('spraakwater:v1')).xp, backup: localStorage.getItem('spraakwater:v1:backup') }));
  if (after.xp !== 4321) throw new Error(`xp after import: ${after.xp}`);
  if (after.backup !== exported) throw new Error('previous value not kept under spraakwater:v1:backup');
});

await step('weekly reset: new week asks for a focus, which then leads the lesson', async () => {
  await page.goto(BASE);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    st.weekly = { week: '2000-W01', focus: null };
    st.history.push({ ...st.history[0], ts: Date.now() - 9 * 86400000 });
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.goto(BASE);
  await page.locator('.screen.weekly .week-option').first().waitFor();
  await shot('46-weekly');
  await page.locator('.week-option', { hasText: 'Spreekstructuren' }).click();
  await page.locator('.btn-hero', { hasText: 'focus: Spreekstructuren' }).waitFor();
  await page.locator('.btn-hero').click();
  await page.locator('.reason-chip', { hasText: 'focus deze week' }).waitFor();
  await page.getByRole('button', { name: 'Sluiten' }).click();
  await page.locator('.btn-hero').waitFor();
});

await step('voice variety card after a spoken round (optional toggle)', async () => {
  await page.goto(BASE);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    st.settings = { ...st.settings, voiceStats: true };
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.reload();
  await page.evaluate(async () => {
    // Fake mic + analyser: loud/soft alternation, fading in the last part.
    window.__meter = { gum: 0, stopped: 0, closed: 0, n: 0 };
    const track = { stop: () => { window.__meter.stopped += 1; } };
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: {
      getUserMedia: async () => { window.__meter.gum += 1; return { getTracks: () => [track] }; },
    } });
    class FakeAC {
      createAnalyser() {
        return {
          fftSize: 2048,
          getFloatTimeDomainData(buf) {
            const k = window.__meter.n++;
            const amp = (k % 2 ? 0.1 : 0.4) * (k > 150 ? 0.3 : 1);
            for (let i = 0; i < buf.length; i++) buf[i] = i % 2 ? amp : -amp;
          },
        };
      }
      createMediaStreamSource() { return { connect() {} }; }
      close() { window.__meter.closed += 1; return Promise.resolve(); }
    }
    window.AudioContext = FakeAC;
    const { makePrompt } = await import('./src/core/lesson.js');
    const { default: nl } = await import('./src/content/prompts.nl.js');
    window.__app.session = null;
    window.__app.go('round', { prompt: makePrompt('minute', nl, Math.random, {}), modifier: null, timing: { prepS: 0, answerS: 22, questions: 1 } });
  });
  await page.getByRole('button', { name: 'Start' }).click();
  await page.locator('.stats').first().waitFor({ timeout: 40000 });
  await page.locator('.voice-card').waitFor({ timeout: 3000 });
  await page.locator('.voice-card', { hasText: 'Levendige stem' }).waitFor({ timeout: 1000 });
  await page.locator('.voice-card', { hasText: 'zakte aan het eind weg' }).waitFor({ timeout: 1000 });
  const m = await page.evaluate(() => window.__meter);
  if (m.gum !== 1 || m.stopped !== 1 || m.closed !== 1) throw new Error(`meter not cleaned up: ${JSON.stringify(m)}`);
  await page.locator('.voice-card').scrollIntoViewIfNeeded();
  await shot('45-voice');
  await page.evaluate(() => window.__app.updateSettings({ voiceStats: false }));
  const off = await page.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')).settings.voiceStats);
  if (off !== false) throw new Error('voiceStats not switched back off');
});

await step('word budget counter turns red over the cap', async () => {
  await page.goto(BASE);
  await page.evaluate(async () => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    st.drillLevels.minute = 3; // 45-word budget
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.goto(BASE);
  await page.evaluate(async () => {
    const { makePrompt } = await import('./src/core/lesson.js');
    const { default: nl } = await import('./src/content/prompts.nl.js');
    window.__app.session = null;
    window.__app.go('round', { prompt: makePrompt('minute', nl, Math.random, {}), modifier: 'budget', timing: { prepS: 0, answerS: 60, questions: 1 } });
  });
  await page.getByRole('radio', { name: /Typen/ }).click();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.locator('.budget-chip', { hasText: '0 / 45' }).waitFor();
  await page.locator('textarea').fill(Array.from({ length: 50 }, (_, i) => `woord${i}`).join(' '));
  await page.locator('.budget-chip.over', { hasText: '50 / 45' }).waitFor();
  await shot('47-budget');
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.locator('.modifier-note, .stats').first().waitFor();
});

await step('voice variety switches itself off when recognition breaks', async () => {
  await page.goto(BASE);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    st.settings = { ...st.settings, voiceStats: true };
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.reload();
  await page.evaluate(async () => {
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia: async () => ({ getTracks: () => [{ stop() {} }] }) } });
    window.AudioContext = class { createAnalyser() { return { fftSize: 2048, getFloatTimeDomainData() {} }; } createMediaStreamSource() { return { connect() {} }; } close() { return Promise.resolve(); } };
    window.__speechMode = 'network';
    const { makePrompt } = await import('./src/core/lesson.js');
    const { default: nl } = await import('./src/content/prompts.nl.js');
    window.__app.session = null;
    window.__app.go('round', { prompt: makePrompt('minute', nl, Math.random, {}), modifier: null, timing: { prepS: 0, answerS: 30, questions: 1 } });
  });
  await page.getByRole('button', { name: 'Start' }).click();
  await page.locator('.note', { hasText: 'Stemvariatie staat nu uit' }).waitFor({ timeout: 5000 });
  const on = await page.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')).settings.voiceStats);
  await page.evaluate(() => { window.__speechMode = 'ok'; });
  if (on !== false) throw new Error('voiceStats should have switched itself off');
  await page.getByRole('button', { name: 'Sluiten' }).click();
});

await step('a double tap on rehearse starts the rehearsal once', async () => {
  await page.goto(BASE);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    st.settings = { ...st.settings, apiKey: 'sk-test' };
    st.events = [{ id: 'dt', type: 'client', date: '2099-01-02', text: 'Dubbel getikt', reflection: null, shareWithCoach: true }];
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.goto(BASE);
  const rounds = await page.evaluate(async () => {
    const { startRehearsal } = await import('./src/ui/realweek.js');
    let n = 0;
    const go = window.__app.go.bind(window.__app);
    window.__app.go = (screen, params) => { if (screen === 'round') n += 1; return go(screen, params); };
    const ev = window.__app.state.events[0];
    const before = window.__hqCount || 0;
    await Promise.all([startRehearsal(window.__app, ev), startRehearsal(window.__app, ev)]);
    window.__app.go = go;
    return { n, requests: (window.__hqCount || 0) - before };
  });
  if (rounds.n !== 1 || rounds.requests !== 1) throw new Error(`rehearsal: ${JSON.stringify(rounds)}`);
  await page.getByRole('button', { name: 'Sluiten' }).click();
});

await step('story frame shows Hook, Detail, Question back', async () => {
  await page.goto(BASE);
  await page.evaluate(async () => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    st.drillLevels.frame = 1;
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.goto(BASE);
  await page.evaluate(async () => {
    const { challengePrompt } = await import('./src/core/share.js');
    const { default: nl } = await import('./src/content/prompts.nl.js');
    window.__app.session = null;
    window.__app.go('round', { prompt: challengePrompt({ drill: 'frame', promptId: 'frame:f37' }, nl), modifier: null });
  });
  await page.getByRole('button', { name: 'Start' }).click();
  await page.locator('.prompt-card .chip', { hasText: 'Vraag terug' }).waitFor();
  await page.getByRole('button', { name: 'Sluiten' }).click();
});

await step('under pressure: interruption, then a checklist on the reply', async () => {
  await page.goto(BASE);
  await page.evaluate(async () => {
    const { makePrompt } = await import('./src/core/lesson.js');
    const { default: nl } = await import('./src/content/prompts.nl.js');
    const p = makePrompt('pressure', nl, Math.random, {});
    p.extra.itemS = [3, 4];
    window.__app.session = null;
    window.__app.go('round', { prompt: p, modifier: null });
  });
  await page.getByRole('button', { name: 'Start' }).click();
  await page.locator('.cue-text.interrupt').waitFor({ timeout: 20000 });
  await shot('48-pressure');
  await page.locator('.pressure-card').waitFor({ timeout: 30000 });
  if ((await page.locator('.pressure-card p').count()) < 4) throw new Error('checklist missing');
  await page.locator('.pressure-card').scrollIntoViewIfNeeded();
  await shot('49-pressure-feedback');
});

await step('shadow the stronger version, then say it in your own words', async () => {
  await page.goto(BASE);
  await page.evaluate(async () => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    st.settings = { ...st.settings, apiKey: 'sk-test' };
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.goto(BASE);
  await page.evaluate(async () => {
    const { makePrompt } = await import('./src/core/lesson.js');
    const { default: nl } = await import('./src/content/prompts.nl.js');
    window.__app.session = null;
    window.__app.go('round', { prompt: makePrompt('minute', nl, Math.random, {}), modifier: null, timing: { prepS: 0, answerS: 30, questions: 1 } });
  });
  await page.getByRole('button', { name: 'Start' }).click();
  await page.waitForTimeout(1300);
  await page.getByRole('button', { name: 'Klaar' }).click();
  // First his own fix, then the stronger version opens.
  await page.locator('.self-q input').fill('begin met mijn punt');
  await shot('51-self-fix');
  await page.getByRole('button', { name: 'Toon de sterkere versie' }).click();
  await page.locator('.self-fix', { hasText: 'begin met mijn punt' }).waitFor();
  await page.getByRole('button', { name: /Naspreken/ }).click();
  const fix = await page.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')).history[0].selfFix);
  if (fix !== 'begin met mijn punt') throw new Error(`selfFix not stored: ${fix}`);
  await page.getByRole('button', { name: 'Start' }).click();
  await page.locator('.shadow-model').waitFor();
  await page.locator('.phase-label.go').waitFor({ timeout: 20000 });
  if (await page.locator('.shadow-model').isVisible()) throw new Error('model should be hidden while he repeats it');
  await page.waitForTimeout(1300);
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.locator('.shadow-card').waitFor();
  if (await page.locator('.coach-card').count()) throw new Error('shadow rounds should not call the coach');
  await shot('50-shadow');
  await page.getByRole('button', { name: /Nu in je eigen woorden/ }).click();
  await page.getByRole('button', { name: 'Start' }).click();
  const readyOwn = page.getByRole('button', { name: 'Ik ben er klaar voor' });
  if (await readyOwn.isVisible().catch(() => false)) await readyOwn.click();
  await page.locator('.phase-label.go').waitFor({ timeout: 20000 });
  await page.waitForTimeout(1300);
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.locator('.compare-card', { hasText: 'Vorige → nu' }).waitFor();
});

await step('friend rates a round through links and it shows on Progress', async () => {
  // The friend: a fresh phone, no stored state, no onboarding.
  const c3 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p3 = await c3.newPage();
  p3.on('console', (m) => m.type() === 'error' && errors.push(`friend page: ${m.text()}`));
  await p3.goto(`${BASE}?r=prep.opinion:o07.nl.abc123`);
  await p3.locator('main.screen.friendrate').waitFor({ timeout: 5000 });
  if (p3.url().includes('?r=')) throw new Error('rate query should be cleared');
  const body = (await p3.locator('.friendrate .prompt-main').textContent()).trim();
  if (!body) throw new Error('friend page shows no prompt');
  if ((await p3.locator('.friend-row').count()) !== 3) throw new Error('expected three score rows');
  await p3.getByRole('button', { name: 'Duidelijk: 4 van 5' }).click();
  await p3.getByRole('button', { name: 'Gestructureerd: 3 van 5' }).click();
  await p3.getByRole('button', { name: 'Zelfverzekerd: 5 van 5' }).click();
  const line = '<img src=x onerror=alert(1)> Sterk begin — “top” 😅';
  await p3.getByLabel('Eén zin voor hem of haar (optioneel)').fill(line);
  await p3.getByRole('button', { name: 'Verstuur mijn beoordeling' }).click();
  const link = (await p3.locator('.friend-link').textContent()).trim();
  if (!link.includes('?rr=abc123.4.3.5.')) throw new Error(`answer link: ${link}`);
  const friendText = await p3.evaluate(() => document.body.innerText);
  if (/\b(null|undefined|NaN)\b/.test(friendText)) throw new Error('stray null/undefined/NaN on the friend page');
  const friendStored = await p3.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1') || '{}').onboarded === true);
  if (friendStored) throw new Error('the friend must not be marked onboarded');
  await p3.screenshot({ path: `${out}/48-friend-rate.png`, fullPage: true });
  await c3.close();

  // Back on his phone: a link that doesn't match a request is refused.
  await page.goto(`${BASE}?rr=zzz999.4.3.5.`);
  await page.locator('.toast', { hasText: 'hoort niet bij een verzoek' }).waitFor({ timeout: 3000 });
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    st.friendAsks = { abc123: { promptId: 'opinion:o07', drill: 'prep', ts: Date.now() } };
    st.friendRatings = {};
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.goto(link);
  await page.locator('.toast', { hasText: 'Een vriend heeft je ronde beoordeeld' }).waitFor({ timeout: 3000 });
  if (page.url().includes('?rr=')) throw new Error('answer query should be cleared');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')).friendRatings.abc123);
  if (!stored || stored.line !== line || stored.clear !== 4) throw new Error(`stored: ${JSON.stringify(stored)}`);
  if ((await page.locator('img[src="x"]').count()) !== 0) throw new Error('friend line must never become HTML');
  await page.getByRole('button', { name: /Voortgang/ }).click();
  await page.locator('.calib-card', { hasText: 'Vrienden (1): duidelijk 4 · structuur 3 · zelfverzekerd 5' }).waitFor();
  // The friend's line is shown, as literal text: the <img> must not become an element.
  await page.locator('.friend-line', { hasText: '<img src=x onerror=alert(1)> Sterk begin' }).waitFor();
  if ((await page.locator('.calib-card img').count()) !== 0) throw new Error('friend line rendered as HTML');
  await page.locator('.calib-card').scrollIntoViewIfNeeded();
  await shot('49-friend-calib');
});

await step('mastery: three good rounds on different days show "Beheerst"', async () => {
  await page.goto(BASE);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    const base = st.history[0];
    const good = [1, 2, 3].map((d) => ({ ...base, ts: Date.now() - d * 86400000, drill: 'explain', rating: 5, promptId: `concept:c0${d}` }));
    st.history = [...good, ...st.history];
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.goto(BASE);
  await page.locator('.drill-explain .mastery.m-own', { hasText: 'Beheerst' }).waitFor();
  await page.locator('.drill-explain').scrollIntoViewIfNeeded();
  await shot('52-mastery');
});

await step('today card recommends one round; the drill grid folds away and remembers it', async () => {
  await page.goto(BASE);
  await page.locator('.today-card .today-what').waitFor();
  await shot('53-today');
  await page.locator('details.choose > summary').click();
  // The toggle event fires just after the click: wait for the saved state.
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('spraakwater:v1')).ui.gridOpen === false, null, { timeout: 3000 });
  await page.locator('details.choose > summary').click();
  await page.locator('.today-go').click();
  await page.locator('.intro-card').waitFor();
  await page.getByRole('button', { name: 'Sluiten' }).click();
});

await step('your words: filler movers and a vague-word swap on Progress, vague words marked in feedback', async () => {
  await page.goto(BASE);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    const base = st.history[0];
    const w = (n) => Array(n).fill('woord').join(' ');
    const mk = (days, transcript, fillers, lang = 'nl') => ({ ...base, ts: Date.now() - days * 86400000, lang, transcript,
      metrics: { ...base.metrics, words: transcript.split(' ').length, fillers } });
    st.history = [
      mk(1, `${w(96)} ding ding dingen heel`, { eh: 2, dus: 4, nou: 1 }),
      mk(20, w(100), { eh: 6, dus: 4, nou: 3 }),
      mk(2, 'the thing thing thing stuff', { um: 9 }, 'en'),
      ...st.history,
    ];
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.goto(BASE);
  await page.getByRole('button', { name: /Voortgang/ }).click();
  const card = page.locator('.words-card');
  await card.waitFor();
  await card.locator('.week-row', { hasText: '“eh”' }).filter({ hasText: '▼' }).waitFor();
  await card.locator('.words-vague', { hasText: '“ding”' }).waitFor();
  await card.getByText('noem het ding').waitFor();
  await card.getByText('Spraakherkenning mist soms stopwoorden').waitFor();
  if (await card.getByText('thing').count()) throw new Error('English vague word shown on the Dutch card');
  await card.scrollIntoViewIfNeeded();
  await shot('53-your-words');
  // A typed round with vague and repeated words.
  await page.goto(BASE);
  await page.locator('.drill-minute').click();
  await page.getByRole('radio', { name: /Typen/ }).click();
  await page.getByRole('button', { name: 'Start' }).click();
  const ready = page.getByRole('button', { name: 'Ik ben er klaar voor' });
  if (await ready.isVisible().catch(() => false)) await ready.click();
  await page.locator('textarea').fill('Het proces is een <b>ding</b>. Het proces moet sneller, eh, en het proces wordt dan sneller. Dat ding is best wel sneller, gewoon. Dingetje.');
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.locator('.transcript').first().waitFor();
  const vague = await page.locator('.transcript .vague').allInnerTexts();
  if (vague.join('|') !== 'ding|ding|best wel') throw new Error(`vague marks: ${vague.join('|')}`);
  const marks = await page.locator('.transcript mark').allInnerTexts();
  if (marks.join('|') !== 'eh|gewoon') throw new Error(`filler marks: ${marks.join('|')}`);
  if (await page.locator('.transcript b').count()) throw new Error('transcript was interpreted as HTML');
  await page.locator('.leaning', { hasText: 'Je leunt op: proces ×3, sneller ×3' }).waitFor();
  await page.locator('.transcript').first().scrollIntoViewIfNeeded();
  await shot('54-vague-feedback');
});

await step('skills used in real life: chips on the reflection, counts on the weekly reset', async () => {
  await page.goto(BASE);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    const d = new Date(Date.now() - 86400000);
    const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    st.events = [{ id: 'sk1', type: 'client', date: day, text: 'Klantgesprek over de 5S-audit', reflection: null }];
    st.history = [{ ...st.history[0], drill: 'frame', ts: Date.now() - 3600000 }, ...st.history];
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.goto(BASE);
  await page.locator('.rw-card').click();
  await page.locator('.rw-reflect .rate-btn').nth(3).click();
  await page.locator('.skill-chip', { hasText: 'Spreekstructuren' }).click();
  await page.locator('.skill-chip', { hasText: 'Doorvragen' }).click();
  await page.locator('.skill-chip', { hasText: 'Doorvragen' }).click(); // tap again: off
  await page.locator('.skill-chip', { hasText: 'Iets anders' }).click();
  if (await page.locator('.skill-chip[aria-pressed="true"]').count() !== 2) throw new Error('chip toggle state');
  await shot('55-reflect-skills');
  await page.getByRole('button', { name: 'Opslaan' }).click();
  const skills = await page.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')).events.find((e) => e.id === 'sk1').reflection.skills);
  if (skills.join(',') !== 'frame,other') throw new Error(`stored skills: ${skills}`);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    st.weekly = { week: '2000-W01', focus: null };
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.goto(BASE);
  const card = page.locator('.screen.weekly .skill-use');
  await card.waitFor();
  await card.locator('.skill-use-line', { hasText: /Spreekstructuren: \d+× geoefend, 1× echt gebruikt/ }).waitFor();
  await card.locator('.skill-use-line', { hasText: 'Iets anders: 1× echt gebruikt' }).waitFor();
  if (await card.locator('.skill-use-line').count() > 3) throw new Error('more than three lines');
  await shot('56-weekly-skills');
  await page.getByRole('button', { name: /Laat het meebewegen/ }).click();
  await page.locator('.btn-hero').waitFor();
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
  // Every screen works offline (all modules come from the service worker cache).
  for (const screen of ['progress', 'settings', 'realweek', 'weekly']) {
    await page.evaluate((sc) => window.__app.go(sc), screen);
    await page.locator(`main.screen.${screen}`).waitFor({ timeout: 5000 });
  }
  await page.evaluate(() => window.__app.go('home'));
  await page.locator('.drill-frame').click();
  await page.locator('.intro-card').waitFor({ timeout: 5000 });
  await ctx.setOffline(false);
});

await browser.close();
server.kill();
if (errors.length) { console.log('\nERRORS:\n' + errors.join('\n')); process.exit(1); }
console.log('\nall good');

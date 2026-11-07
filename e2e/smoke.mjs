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

const PORT = process.env.E2E_PORT || '8123';
const server = spawn('python3', ['-m', 'http.server', PORT], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const BASE = `http://localhost:${PORT}/`;

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
      if (req.output_config.format.schema.properties.scene) {
        window.__sceneReq = req;
        const rubric = window.__sceneMode === 'bad' ? ['Alleen twee', 'regels'] : ['Vraagt naar de verliesverdeling', 'Vraagt welke ploeg het meest verliest', 'Noemt een concrete volgende stap'];
        return { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify({ scene: 'In het Enexis-depot staat de <i>OEE</i> van de montagecel op 61%. De teamleider wil een extra ploeg.', ask: 'Wat vraag je eerst?', model: 'Waar gaan de 39 punten heen, per verliessoort?', rubric }) }] };
      }
      if (req.output_config.format.schema.properties.end) {
        window.__pbReqs = [...(window.__pbReqs || []), req];
        return { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify({ reply: 'Mooi plan, maar <b>wie</b> gaat dat betalen?', end: false }) }] };
      }
      if (req.output_config.format.schema.properties.points && window.__fakeGrade) {
        window.__gradeReqs = [...(window.__gradeReqs || []), req];
        return { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify({ points: [1, 1, 0], missed: 'Je noemde geen concrete volgende stap.' }) }] };
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
// Most steps click drills on the speaking home directly: on every load, open on
// speaking (not the start screen) with "More practice" open. The start screen
// itself is checked in its own context and by tapping Home.
await ctx.addInitScript(() => {
  try {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1') || 'null');
    const ui = (st && st.ui) || {};
    const subject = ui.subject && ui.subject !== 'start' ? ui.subject : 'speak';
    if (st) localStorage.setItem('spraakwater:v1', JSON.stringify({ ...st, ui: { ...ui, moreOpen: true, subject } }));
  } catch { /* first run */ }
});
await ctx.route('https://esm.sh/**', (route) => route.fulfill({ contentType: 'application/javascript', body: FAKE_SDK }));
const page = await ctx.newPage();
let currentStep = 'setup';
// Playwright's serviceWorkers: 'block' patches navigator.serviceWorker in every
// frame; in a sandboxed figure frame that read throws. The app's own frame is
// never sandboxed, so this exact message is the harness, not the app.
const HARNESS_SW = /Failed to read the 'serviceWorker' property from 'Navigator': Service worker is disabled because the context is sandboxed/;
function onPageError(e) { if (!HARNESS_SW.test(e.message)) errors.push(`[${currentStep}] ${e.message}`); }
page.on('pageerror', onPageError);
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

const step = async (name, fn) => {
  currentStep = name;
  try { await fn(); console.log('ok  ', name); } catch (e) {
    console.log('FAIL', name, e.message); errors.push(`${name}: ${e.message}`);
    // What the screen showed when it failed.
    await page.screenshot({ path: `${out}/FAIL-${name.slice(0, 40).replace(/[^a-z0-9]+/gi, '-')}.png`, fullPage: true }).catch(() => {});
  }
};
const shot = async (n) => {
  const text = await page.evaluate(() => document.body.innerText);
  // No word boundary on the right: "nullnull" must be caught too.
  if (/(?<![A-Za-z])(null|undefined|NaN)/.test(text)) errors.push(`${n}: stray null/undefined/NaN on screen`);
  await page.screenshot({ path: `${out}/${n}.png`, fullPage: true, animations: 'disabled' });
};

await page.goto(BASE);
await step('first run: three short screens (subjects, a day, settings), then the start screen', async () => {
  await page.getByRole('heading', { name: 'Drie vakken, één app' }).waitFor({ timeout: 5000 });
  for (const s of ['Spreken', 'Engineering', 'Projecten']) await page.locator('.welcome-list li', { hasText: s }).waitFor();
  await shot('00-welcome');
  await page.getByRole('button', { name: 'Volgende' }).click();
  await page.getByRole('heading', { name: 'Eén volgende stap per vak' }).waitFor();
  await shot('00b-welcome-day');
  await page.getByRole('button', { name: 'Volgende' }).click();
  await page.getByRole('heading', { name: 'Instellingen en je sleutel' }).waitFor();
  await shot('00c-welcome-settings');
  await page.getByRole('button', { name: 'Aan de slag' }).click();
  await page.locator('.start-cards .start-card').nth(2).waitFor();
});
await page.evaluate(async () => {
  // Mark this week's focus as answered so seeded older rounds don't open the weekly screen.
  const { isoWeekKey } = await import('./src/core/boss.js');
  localStorage.setItem('spraakwater:v1', JSON.stringify({ onboarded: true, settings: { apiKey: 'sk-test' }, weekly: { week: isoWeekKey(new Date()), focus: null }, ui: { moreOpen: true, subject: 'speak' } }));
});
await page.reload();
await step('home renders', async () => { await page.locator('.btn-hero').waitFor(); await shot('01-home'); });

// Exactly one filled button in view on a screen (the one next thing).
const onePrimary = async (pg, where) => {
  const n = await pg.locator('.btn-primary:visible').count();
  if (n !== 1) throw new Error(`${where}: ${n} visible .btn-primary, expected 1`);
};

await step('start screen: one card per subject with its reason, streak and level in one line; cards open each home', async () => {
  const c5 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p5 = await c5.newPage();
  p5.on('pageerror', onPageError);
  await c5.addInitScript(() => { if (!localStorage.getItem('spraakwater:v1')) localStorage.setItem('spraakwater:v1', JSON.stringify({ onboarded: true, xp: 40, streak: { count: 0, lastDay: null } })); });
  const shot5 = async (n) => {
    const text = await p5.evaluate(() => document.body.innerText);
    if (/(?<![A-Za-z])(null|undefined|NaN)/.test(text)) errors.push(`${n}: stray null/undefined/NaN on screen`);
    await p5.screenshot({ path: `${out}/${n}.png`, fullPage: true, animations: 'disabled' });
  };
  await p5.goto(BASE);
  // ui.subject absent: the app opens on the start screen.
  await p5.locator('.start-card').nth(2).waitFor({ timeout: 5000 });
  const subjects = await p5.locator('.start-subject').allInnerTexts();
  if (subjects.map((x) => x.trim()).join('|') !== 'SPREKEN|ENGINEERING|PROJECTEN' && subjects.map((x) => x.trim().toUpperCase()).join('|') !== 'SPREKEN|ENGINEERING|PROJECTEN') throw new Error(`cards: ${subjects}`);
  for (const i of [0, 1, 2]) if (!(await p5.locator('.start-card').nth(i).locator('.start-why').innerText()).trim()) throw new Error(`card ${i} has no reason`);
  await p5.locator('.start-card.start-eng .start-what', { hasText: 'Takt' }).waitFor();
  await p5.locator('.start-meta', { hasText: 'Level 1 · 40/100 XP' }).waitFor();
  await onePrimary(p5, 'start');
  // Every card readable at 390 px: nothing wider than the viewport.
  const wide = await p5.evaluate(() => [...document.querySelectorAll('.start-card')].some((c) => c.scrollWidth > c.clientWidth || c.getBoundingClientRect().right > 390));
  if (wide) throw new Error('a start card overflows at 390 px');
  await shot5('80-start');
  await p5.locator('.start-card.start-eng').click();
  await p5.locator('.course-home.course-eng').waitFor();
  if ((await p5.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')).ui.subject)) !== 'eng') throw new Error('subject not stored');
  await p5.getByRole('button', { name: 'Overzicht' }).click();
  await p5.locator('.start-card.start-speak').click();
  await p5.locator('.today-card .today-go').waitFor();
  if (await p5.locator('details.more').getAttribute('open') !== null) throw new Error('More practice should start closed');
  await p5.locator('details.more > summary').click();
  await p5.waitForFunction(() => JSON.parse(localStorage.getItem('spraakwater:v1')).ui.moreOpen === true, null, { timeout: 3000 });
  for (const g of ['Kies een oefening', 'Herhalen en uitdagen', 'Je echte week', 'Opdrachten en programma']) await p5.locator('.more-title', { hasText: g }).waitFor();
  await onePrimary(p5, 'speaking home with More open');
  await shot5('82-more-practice');
  await p5.reload();
  await p5.locator('details.more[open]').waitFor();
  // Home in the bottom bar always returns to the overview, which stays the default after a reload.
  await p5.getByRole('button', { name: /Home/ }).click();
  await p5.locator('.start-card').first().waitFor();
  await p5.reload();
  await p5.locator('.start-card').first().waitFor();
  await p5.evaluate(() => window.__app.updateSettings({ theme: 'dark' }));
  await p5.evaluate(() => window.__app.go('home'));
  await p5.locator('.start-card').first().waitFor();
  await shot5('81-start-dark');
  // One tap: "Begin vandaag" starts the recommended round directly.
  await p5.locator('.begin-btn').click();
  await p5.locator('.intro-card').waitFor({ timeout: 5000 });
  await c5.close();
});

await step('one filled button per screen: speaking home, course home, every lesson step, due and situation', async () => {
  await page.goto(BASE);
  // Later steps expect untouched course progress: put it back afterwards.
  const saved = await page.evaluate(() => localStorage.getItem('spraakwater:v1'));
  await page.locator('.btn-hero').waitFor();
  await onePrimary(page, 'speaking home');
  await page.locator('.subject-tab', { hasText: 'Engineering' }).click();
  await page.locator('.course-today .today-go').waitFor();
  await onePrimary(page, 'course home');
  await page.evaluate(() => window.__app.go('lesson', { subject: 'eng', moduleId: 'eng.flow', lessonId: 'eng.flow.oee' }));
  await page.locator('.steps [aria-current="step"]', { hasText: 'Raden' }).waitFor();
  const labels = (await page.locator('.steps .step').allInnerTexts()).map((x) => x.trim().toUpperCase());
  if (labels.join('|') !== 'RADEN|LEZEN|VOORBEELD|CHECK') throw new Error(`steps: ${labels}`);
  const oee = await page.evaluate(async () => (await import('/src/content/courses/eng/flow.nl.js')).default.lessons.find((l) => l.id === 'eng.flow.oee'));
  const recallOf = async () => { const q = (await page.locator('.quiz-card .quiz-q').innerText().catch(() => '')).trim(); return oee.recall.find((r) => r.q.trim() === q); };
  // Walk the lesson: each step that has a button has exactly one filled one.
  for (let guard = 0; guard < 40; guard++) {
    if (await page.locator('.lesson-done').count()) { await onePrimary(page, 'lesson done'); break; }
    const opts = page.locator('.screen.lesson .opt:visible');
    const step = (await page.locator('.steps [aria-current="step"]').innerText().catch(() => '')).trim();
    if (await opts.count()) {
      // A choice step: the options are the action; no competing filled button.
      if (await page.locator('.btn-primary:visible').count()) throw new Error(`${step}: filled button next to the options`);
      const r = await recallOf();
      await (r ? page.locator('.quiz-opts').getByRole('button', { name: r.answer, exact: true }).first() : opts.first()).click();
      continue;
    }
    const num = page.locator('.screen.lesson .quiz-num:visible');
    if (await num.count()) { const r = await recallOf(); await num.fill(r ? String(r.number) : '1'); }
    await onePrimary(page, `lesson step ${step}`);
    await page.locator('.btn-primary:visible').click();
    await page.waitForTimeout(80);
  }
  await page.locator('.lesson-done').waitFor();
  await page.locator('.steps .step-done').nth(3).waitFor();
  await page.evaluate(() => window.__app.go('situation', { subject: 'eng', moduleId: 'eng.flow', lessonId: 'eng.flow.oee' }));
  await page.locator('.screen.situation .btn-primary').first().waitFor();
  await onePrimary(page, 'situation');
  await page.evaluate(() => {
    const st = window.__app.state;
    const y = window.__app.today();
    window.__app.setState({ ...st, courseReviews: { ...st.courseReviews, 'nl|eng.flow.oee#r0': { box: 2, due: y, lesson: 'eng.flow.oee', subject: 'eng' } } });
    window.__app.go('due', { subject: 'eng', questionIds: ['eng.flow.oee#r0'] });
  });
  await page.locator('.screen.due .quiz-card').waitFor();
  if (await page.locator('.screen.due .opt').count()) {
    if (await page.locator('.btn-primary:visible').count()) throw new Error('due: filled button next to the options');
    await page.locator('.screen.due .opt').first().click();
  } else {
    await onePrimary(page, 'due');
    await page.locator('.screen.due .quiz-num').fill('1');
    await page.locator('.screen.due .btn-primary').click();
  }
  await page.locator('.screen.due .quiz-review').waitFor();
  await onePrimary(page, 'due review');
  await page.evaluate((v) => localStorage.setItem('spraakwater:v1', v), saved);
  await page.goto(BASE);
  await page.locator('.btn-hero').waitFor();
});

await step('subject bar switches to Engineering and Projects and back; speaking home unchanged', async () => {
  await page.locator('.subject-bar .subject-tab[aria-pressed="true"]', { hasText: 'Spreken' }).waitFor();
  await page.locator('.subject-tab', { hasText: 'Engineering' }).click();
  await page.locator('.course-home .track').first().waitFor();
  await page.locator('.course-today .today-what', { hasText: 'Takt' }).waitFor();
  await shot('60-course-home');
  await page.locator('.module-row', { hasText: 'Capaciteit en flow' }).click();
  await page.locator('.lesson-row').nth(5).waitFor();
  await shot('60b-module-open');
  await page.locator('.subject-tab', { hasText: 'Projecten' }).click();
  await page.locator('.course-pm .track').waitFor();
  await page.reload();
  await page.locator('.course-pm').waitFor();
  await page.locator('.subject-tab', { hasText: 'Spreken' }).click();
  await page.locator('.btn-hero').waitFor();
});

// Answers a lesson's quiz from the module file; the first question wrong on purpose.
async function playLesson(pg, subject, slug, lessonId, { missFirst = true, reviewShot = null } = {}) {
  const lesson = await pg.evaluate(async ([sub, sl, id]) => (await import(`/src/content/courses/${sub}/${sl}.nl.js`)).default.lessons.find((l) => l.id === id), [subject, slug, lessonId]);
  for (const q of lesson.pre) {
    if ('number' in q) { await pg.locator('.pre-card .quiz-num').fill('1'); await pg.locator('.lesson > .pre-next').click(); }
    else await pg.locator('.pre-card .opt').first().click();
    await pg.locator('.lesson > .pre-next', { hasText: 'Verder' }).click();
  }
  // Always a way back: from the first read block to the last guess, which shows the guess kept, not a new question.
  await pg.locator('.teach-card').waitFor();
  // A term in the text explains itself on a tap, and closes again.
  if (lessonId === 'eng.flow.takt') {
    const term = pg.locator('.teach-card .term').first();
    await term.click();
    await pg.locator('.teach-card .term-def:not([hidden])', { hasText: 'Takttijd' }).waitFor();
    if (await term.getAttribute('aria-expanded') !== 'true') throw new Error('term not marked open');
    // In Dutch the English word is shown next to the term, and in its definition.
    if (!(await pg.locator('.teach-card .term-en[lang="en"]').count())) throw new Error('no English word next to the Dutch term');
    if (!(await pg.locator('.teach-card .term-def .term-en', { hasText: 'EN:' }).count())) throw new Error('no English word in the definition');
    await pg.screenshot({ path: `${out}/105-term-open.png` });
    await term.click();
    if (await pg.locator('.teach-card .term-def:not([hidden])').count()) throw new Error('term definition did not close');
  }
  await pg.locator('.lesson > .lesson-back').click();
  await pg.locator('.pre-card').waitFor();
  if (await pg.locator('.pre-card .opt').count()) throw new Error('going back asked the guess again');
  await pg.locator('.lesson > .pre-next', { hasText: 'Verder' }).click();
  await pg.locator('.teach-card').waitFor();
  for (let i = 0; i < lesson.teach.length; i++) await pg.locator('.lesson > .btn-primary', { hasText: 'Verder' }).click();
  if (lesson.example.kind === 'faded') { await pg.locator('.reveal-btn').click(); await pg.locator('.example-card .btn-primary').click(); }
  else await pg.locator('.lesson > .btn-primary', { hasText: 'Verder' }).click();
  const answer = async (q, wrong) => {
    if ('number' in q) {
      await pg.locator('.quiz-card .quiz-num').fill(String(wrong ? q.number + 1000 : q.number).replace('.', ','));
      await pg.locator('.quiz-card .btn-primary').click();
    } else {
      const pick = wrong ? q.options.find((o) => o !== q.answer) : q.answer;
      await pg.locator('.quiz-card .opt', { hasText: pick }).first().click();
    }
  };
  for (let i = 0; i < lesson.recall.length; i++) {
    if (i === 1 && i < lesson.recall.length - 1) {
      // An accidental wrong tap, taken back with 'Vorige vraag': it never counts as a miss.
      await answer(lesson.recall[1], true);
      await pg.locator('.quiz-card .quiz-back').click();
      const prog = (await pg.locator('.quiz-card .quiz-progress').innerText()).trim();
      if (!prog.startsWith('2/')) throw new Error(`back did not return to question 2: ${prog}`);
      if (await pg.locator('.quiz-card .btn-primary, .quiz-card .opt').count() < 1) throw new Error('no answer controls after back');
    }
    await answer(lesson.recall[i], missFirst && i === 0);
  }
  await pg.locator('.quiz-review').waitFor();
  if (reviewShot) await shot(reviewShot);
  if (missFirst) {
    if (await pg.locator('.review-row.miss').count() !== 1) throw new Error('expected one miss in review');
    await pg.locator('.quiz-review .btn-primary').click();
    await answer(lesson.recall[0], false);
    await pg.locator('.quiz-review').waitFor();
  }
  await pg.locator('.quiz-review .btn-primary').click();
  await pg.locator('.lesson-done').waitFor();
  if (!(await pg.locator('.guess-review .review-row').count())) throw new Error('no feedback on the guesses');
  return lesson;
}

await step('a full lesson: guess, read, example, quiz with one miss, review, pass', async () => {
  await page.locator('.subject-tab', { hasText: 'Engineering' }).click();
  await page.locator('.course-today .today-go').click();
  await page.locator('.pre-card').waitFor();
  await shot('61a-lesson-pre');
  const lesson = await playLesson(page, 'eng', 'flow', 'eng.flow.takt', { reviewShot: '61r-quiz-review' });
  if (!(await page.locator('.lesson-done').textContent()).includes('+20')) throw new Error('no +20 XP');
  await shot('61-lesson-done');
  const st = await page.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')));
  if (!st.courses.eng.lessons['eng.flow.takt'].passed) throw new Error('lesson not passed');
  if (st.courseReviews['nl|eng.flow.takt#r0'].box !== 1 || st.courseReviews['nl|eng.flow.takt#r1'].box !== 2) throw new Error('queue boxes wrong');
  if (lesson.recall.length !== Object.keys(st.courseReviews).length) throw new Error('not every question scheduled');
  await page.locator('.lesson-done ~ .btn', { hasText: 'Terug naar de cursus' }).click();
  await page.locator('.course-today .today-what', { hasText: 'De bottleneck' }).waitFor();
  await page.locator('.subject-tab', { hasText: 'Spreken' }).click();
  await page.locator('.btn-hero').waitFor();
});

await step('due session: 4 due questions, answered, XP and boxes move', async () => {
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    const d = new Date(Date.now() - 86400000);
    const y = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    st.courseReviews = Object.fromEntries([0, 1, 2, 3].map((i) => [`nl|eng.flow.takt#r${i}`, { box: 2, due: y, lesson: 'eng.flow.takt', subject: 'eng' }]));
    st.ui = { ...(st.ui || {}), subject: 'eng' };
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.reload();
  await page.locator('.due-card', { hasText: '4' }).click();
  const lesson = await page.evaluate(async () => (await import('/src/content/courses/eng/flow.nl.js')).default.lessons[0]);
  for (let i = 0; i < 4; i++) {
    const text = await page.locator('.quiz-card .quiz-q').textContent();
    const q = lesson.recall.find((x) => x.q === text);
    if ('number' in q) { await page.locator('.quiz-card .quiz-num').fill(String(q.number)); await page.locator('.quiz-card .btn-primary').click(); }
    else await page.locator('.quiz-card .opt', { hasText: q.answer }).first().click();
  }
  await page.locator('.quiz-review .btn-primary').click();
  await page.locator('.due-done').waitFor();
  await shot('62-due-done');
  const st = await page.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')));
  if (![0, 1, 2, 3].every((i) => st.courseReviews[`nl|eng.flow.takt#r${i}`].box === 3)) throw new Error('boxes did not move to 3');
});

await step('situation without a key: answer, self-rate 2 of 3, 10 XP once; glossary search; course progress', async () => {
  await page.evaluate(() => window.__app.go('situation', { subject: 'eng', moduleId: 'eng.flow', lessonId: 'eng.flow.takt' }));
  await page.locator('.sit-answer').fill('Welke takt rekenen we, en hoeveel netto beschikbare tijd zit er per dienst in?');
  await page.locator('.situation > .btn-primary').click();
  await page.locator('.rubric-line input').nth(0).check();
  await page.locator('.rubric-line input').nth(2).check();
  await page.locator('.situation > .btn-primary').click();
  await page.locator('.sit-result', { hasText: '2 van 3' }).waitFor();
  if (!(await page.locator('.sit-result').textContent()).includes('+10 XP')) throw new Error('no situation XP');
  await shot('63-situation');
  await page.evaluate(() => window.__app.go('glossary', { subject: 'eng' }));
  await page.locator('.glossary .term').first().waitFor();
  await page.locator('.glossary input[type=search]').fill('takt');
  await page.locator('.glossary .term', { hasText: /takt/i }).first().waitFor();
  await shot('65-glossary');
  await page.evaluate(() => window.__app.go('progress'));
  await page.locator('.course-progress .strip i.on').first().waitFor();
  await shot('64-progress-course');
  await page.locator('.subject-tab', { hasText: 'Spreken' }).click();
  await page.locator('.screen.progress .stats').waitFor();
  await page.evaluate(() => window.__app.go('home'));
  await page.locator('.btn-hero').waitFor();
});

// Puts back a saved blob through the app too: the page writes its own state on the way out.
const restoreState = async (saved) => {
  await page.evaluate((v) => { window.__app.setState(JSON.parse(v)); localStorage.setItem('spraakwater:v1', v); }, saved);
  await page.goto(BASE);
  await page.locator('.btn-hero').waitFor();
};

await step('pushback without a key: two objections from the lesson, self-rate 2, the model reply; 0 XP', async () => {
  const saved = await page.evaluate(() => localStorage.getItem('spraakwater:v1'));
  await page.evaluate(() => window.__app.updateSettings({ apiKey: '' }));
  const lesson = await page.evaluate(async () => (await import('/src/content/courses/pm/intake.nl.js')).default.lessons.find((l) => l.id === 'pm.intake.ask'));
  await page.evaluate(() => window.__app.go('situation', { subject: 'pm', moduleId: 'pm.intake', lessonId: 'pm.intake.ask' }));
  await page.locator('.sit-answer').fill('Waar gaan die 42 punten nu naartoe, en welke perslijn raakt jullie leveringen het meest?');
  await page.locator('.situation > .btn-primary').click();
  await page.locator('.rubric-line input').nth(1).check();
  await page.locator('.situation > .btn-primary').click();
  await page.locator('.sit-result').waitFor();
  await onePrimary(page, 'situation result with pushback');
  const xp0 = await page.evaluate(() => window.__app.state.xp);
  await page.locator('.situation .pb-open').click();
  await page.locator('.pb-they', { hasText: lesson.situation.pushback.lines[0] }).waitFor();
  await onePrimary(page, 'pushback turn 1');
  await shot('96-pushback-turn');
  await page.evaluate(() => window.__app.updateSettings({ theme: 'dark' }));
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  await shot('96-pushback-turn-dark');
  await page.evaluate(() => window.__app.updateSettings({ theme: 'auto' }));
  // An empty reply is not sent.
  await page.locator('.situation > .btn-primary', { hasText: 'Antwoorden' }).click();
  await page.locator('.pb-they', { hasText: lesson.situation.pushback.lines[0] }).waitFor();
  await page.locator('.pb-answer').fill('Klopt, jij kent de persen beter. Laat me deze week de verliesverdeling zien.');
  await page.locator('.situation > .btn-primary', { hasText: 'Antwoorden' }).click();
  await page.locator('.pb-they', { hasText: lesson.situation.pushback.lines[1] }).waitFor();
  await onePrimary(page, 'pushback turn 2');
  await page.locator('.pb-answer').fill('Eén week kijken, maandag zet ik het team op het grootste verlies.');
  await page.locator('.situation > .btn-primary').click();
  await page.locator('.pb-card .rubric-line', { hasText: lesson.situation.pushback.rubric[0] }).waitFor();
  await onePrimary(page, 'pushback self-rating');
  await shot('97-pushback-grade');
  await page.locator('.pb-card .rubric-line input').nth(0).check();
  await page.locator('.pb-card .rubric-line input').nth(2).check();
  await page.locator('.situation > .btn-primary').click();
  await page.locator('.pb-result', { hasText: '2 van 3' }).waitFor();
  await page.locator('.pb-result .said', { hasText: lesson.situation.pushback.model.slice(0, 40) }).waitFor();
  await onePrimary(page, 'pushback result');
  await shot('97b-pushback-model');
  const st = await page.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')));
  const pb = st.courses.pm.lessons['pm.intake.ask'].pushback;
  if (!pb || pb.pts !== 2 || typeof pb.ts !== 'number') throw new Error(`pushback not saved: ${JSON.stringify(pb)}`);
  if (st.xp !== xp0) throw new Error('pushback gave XP');
  if (st.courses.pm.sessions.some((x) => x.kind !== 'situation')) throw new Error('pushback logged a session');
  await page.locator('.situation > .btn-primary', { hasText: 'Klaar' }).click();
  await restoreState(saved);
});

await step('pushback with a stubbed coach: the coach plays the other person, its text shows as text, then grades', async () => {
  const saved = await page.evaluate(() => localStorage.getItem('spraakwater:v1'));
  await page.evaluate(() => { window.__fakeGrade = true; window.__pbReqs = []; window.__app.updateSettings({ apiKey: 'sk-test' }); });
  await page.evaluate(() => window.__app.go('situation', { subject: 'pm', moduleId: 'pm.intake', lessonId: 'pm.intake.ask' }));
  await page.locator('.sit-answer').fill('Waar zit het verlies per perslijn?');
  await page.locator('.situation > .btn-primary').click();
  await page.locator('.sit-result').waitFor();
  await page.locator('.situation .pb-open').click();
  const they = page.locator('.pb-they', { hasText: 'wie' });
  await they.waitFor();
  if (await page.locator('.pb-they b').count()) throw new Error('coach reply rendered as html');
  if (!(await they.textContent()).includes('<b>wie</b>')) throw new Error('coach reply not shown as text');
  await onePrimary(page, 'pushback turn with coach');
  await page.locator('.pb-answer').fill('Dat betalen we uit de besparing op stilstand.');
  await page.locator('.situation > .btn-primary').click();
  await page.locator('.pb-they', { hasText: 'wie' }).waitFor();
  await page.locator('.pb-answer').fill('Twee weken proef op één lijn, dan beslis jij.');
  await page.locator('.situation > .btn-primary').click();
  await page.locator('.pb-result', { hasText: '2 van 3' }).waitFor();
  await page.locator('.pb-result .note', { hasText: 'concrete volgende stap' }).waitFor();
  await onePrimary(page, 'pushback coach result');
  const reqs = await page.evaluate(() => window.__pbReqs.map((r) => JSON.stringify(r)));
  if (reqs.length !== 2) throw new Error(`expected 2 pushback requests, got ${reqs.length}`);
  if (!reqs[1].includes('Waar zit het verlies per perslijn?') || !reqs[1].includes('Dat betalen we uit de besparing')) throw new Error('request lacks his answers');
  if (/work context/i.test(reqs[0])) throw new Error('empty context was sent');
  await page.evaluate(() => { window.__fakeGrade = false; });
  await restoreState(saved);
});

await step('coach context: saved in Settings, a fresh scene from a stubbed coach shows as text; a malformed one keeps the lesson scene', async () => {
  const saved = await page.evaluate(() => localStorage.getItem('spraakwater:v1'));
  await page.evaluate(() => { window.__app.updateSettings({ apiKey: 'sk-test' }); window.__app.go('settings'); });
  const ctx = page.locator('.ctx-input');
  await ctx.fill('Ik plan MS-werk bij een netbeheerder en help maakbedrijven met hun OEE.');
  await ctx.blur();
  await page.waitForFunction(() => (window.__app.state.settings.context || '').startsWith('Ik plan MS-werk'));
  await ctx.scrollIntoViewIfNeeded();
  await shot('98-settings-context');
  const oee = await page.evaluate(async () => (await import('/src/content/courses/eng/flow.nl.js')).default.lessons.find((l) => l.id === 'eng.flow.oee'));
  await page.evaluate(() => { window.__sceneMode = 'good'; window.__app.go('situation', { subject: 'eng', moduleId: 'eng.flow', lessonId: 'eng.flow.oee' }); });
  await page.locator('.scene-new').waitFor();
  await onePrimary(page, 'situation with a fresh-scene button');
  await page.locator('.scene-new').click();
  const scene = page.locator('.sit-scene', { hasText: 'Enexis-depot' });
  await scene.waitFor();
  if (await page.locator('.sit-scene i').count()) throw new Error('fresh scene rendered as html');
  if (!(await scene.textContent()).includes('<i>OEE</i>')) throw new Error('fresh scene not shown as text');
  await onePrimary(page, 'fresh scene');
  const req = await page.evaluate(() => JSON.stringify(window.__sceneReq));
  if (!req.includes('Ik plan MS-werk')) throw new Error('scene request lacks his context');
  if (oee.teach.some((b) => req.includes(b.slice(0, 40)))) throw new Error('scene request carries teach text');
  await shot('99-fresh-scene');
  await page.evaluate(() => window.__app.updateSettings({ theme: 'dark' }));
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  await shot('99-fresh-scene-dark');
  await page.evaluate(() => window.__app.updateSettings({ theme: 'auto' }));
  await page.locator('.sit-answer').fill('Waar gaan de 39 punten heen, per verliessoort?');
  await page.locator('.situation > .btn-primary').click();
  await page.locator('.rubric-line', { hasText: 'Vraagt naar de verliesverdeling' }).locator('input').check();
  await page.locator('.situation > .btn-primary').click();
  await page.locator('.sit-result', { hasText: '1 van 3' }).waitFor();
  if (await page.locator('.pb-open').count()) throw new Error('pushback offered on a generated scene');
  const st = await page.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')));
  if (st.courses.eng.lessons['eng.flow.oee'].situation.pts !== 1) throw new Error('fresh scene points not saved under the lesson');
  await page.evaluate(() => { window.__sceneMode = 'bad'; window.__app.go('situation', { subject: 'eng', moduleId: 'eng.flow', lessonId: 'eng.flow.oee' }); });
  await page.locator('.scene-new').click();
  await page.locator('.scene-note').waitFor();
  if ((await page.locator('.sit-scene').textContent()).replace(/\s+/g, '') !== oee.situation.scene.replace(/\s+/g, '')) throw new Error('malformed scene did not keep the lesson scene');
  await onePrimary(page, 'scene note');
  await restoreState(saved);
});

await step('explain it back: one filled button on the last reading step with a key; without a key, a self-check of the terms on the done card', async () => {
  const saved = await page.evaluate(() => localStorage.getItem('spraakwater:v1'));
  await page.evaluate(() => window.__app.updateSettings({ apiKey: 'sk-test', context: 'Ik plan MS-werk' }));
  const lesson = await page.evaluate(async () => (await import('/src/content/courses/eng/flow.nl.js')).default.lessons.find((l) => l.id === 'eng.flow.oee'));
  await page.evaluate(() => window.__app.go('lesson', { subject: 'eng', moduleId: 'eng.flow', lessonId: 'eng.flow.oee' }));
  for (const q of lesson.pre) {
    if ('number' in q) { await page.locator('.pre-card .quiz-num').fill('1'); await page.locator('.lesson > .pre-next').click(); }
    else await page.locator('.pre-card .opt').first().click();
    await page.locator('.lesson > .pre-next').click();
  }
  for (let i = 0; i < lesson.teach.length - 1; i++) await page.locator('.lesson > .btn-primary').click();
  await page.locator('.explain .btn-ghost', { hasText: 'Leg dit uit voor mijn situatie' }).click();
  await page.locator('.explain-ask input').waitFor();
  if ((await page.locator('.explain-ask input').inputValue()) !== 'Ik plan MS-werk') throw new Error('explain box not prefilled from his context');
  await onePrimary(page, 'last teach card with the explain box open');
  await page.evaluate(() => window.__app.updateSettings({ apiKey: '' }));
  await page.evaluate(() => window.__app.go('lesson', { subject: 'eng', moduleId: 'eng.flow', lessonId: 'eng.flow.oee' }));
  await page.locator('.pre-card').waitFor();
  await playLesson(page, 'eng', 'flow', 'eng.flow.oee', { missFirst: false });
  const xp0 = await page.evaluate(() => window.__app.state.xp);
  if (await page.locator('details.explain-back[open]').count()) throw new Error('explain-back open by default');
  await page.locator('details.explain-back > summary').click();
  await page.locator('.eb-text').fill('OEE is beschikbaarheid maal prestatie maal kwaliteit; zo zie je waar de tijd van een lijn heen gaat.');
  await page.locator('.explain-back .rubric-line input').nth(0).check();
  await page.locator('.explain-back .rubric-line input').nth(1).check();
  await page.locator('.eb-count', { hasText: `2 van ${lesson.terms.length}` }).waitFor();
  await onePrimary(page, 'lesson done with explain-back open');
  await page.locator('details.explain-back').scrollIntoViewIfNeeded();
  await shot('100-explain-back');
  if ((await page.evaluate(() => window.__app.state.xp)) !== xp0) throw new Error('explain-back gave XP');
  await restoreState(saved);
});

await step('a lesson with a figure shows it under the last reading block', async () => {
  await page.evaluate(() => window.__app.go('lesson', { subject: 'eng', moduleId: 'eng.flow', lessonId: 'eng.flow.bottleneck' }));
  const lesson = await page.evaluate(async () => (await import('/src/content/courses/eng/flow.nl.js')).default.lessons.find((l) => l.id === 'eng.flow.bottleneck'));
  for (const q of lesson.pre) {
    if ('number' in q) { await page.locator('.pre-card .quiz-num').fill('1'); await page.locator('.lesson > .pre-next').click(); }
    else await page.locator('.pre-card .opt').first().click();
    await page.locator('.lesson > .pre-next').click();
  }
  for (let i = 0; i < lesson.teach.length - 1; i++) await page.locator('.lesson > .btn-primary').click();
  const frame = page.locator('.figure-wrap iframe.figure-frame');
  await frame.waitFor();
  if (!(await frame.getAttribute('src')).startsWith('src/content/courses/figures/eng.flow.line.html?theme=')) throw new Error('figure src');
  await page.frameLocator('.figure-frame').locator('svg').first().waitFor({ timeout: 10000 });
  await page.waitForTimeout(800);
  await shot('67-figure');
  await page.evaluate(() => window.__app.go('home'));
});

// The turning lesson's explainer film: a quiet button under the first reading
// block opens it in a sandboxed frame; it speaks through the app's voice.
await step('films: the turning lesson opens its film in a sandboxed frame; narration speaks through the app', async () => {
  await page.evaluate(() => {
    window.__spoken = [];
    const synth = window.speechSynthesis;
    synth.speak = (u) => { window.__spoken.push({ text: u.text, lang: u.lang, rate: u.rate }); setTimeout(() => u.onend && u.onend(), 600); };
    window.__cancels = 0; synth.cancel = () => { window.__cancels += 1; };
    try { localStorage.removeItem('vp:filmMuted'); } catch {}
  });
  await page.evaluate(() => window.__app.go('lesson', { subject: 'eng', moduleId: 'eng.machining', lessonId: 'eng.machining.cutting' }));
  const lesson = await page.evaluate(async () => (await import('/src/content/courses/eng/machining.nl.js')).default.lessons.find((l) => l.id === 'eng.machining.cutting'));
  for (const q of lesson.pre) {
    if ('number' in q) { await page.locator('.pre-card .quiz-num').fill('1'); await page.locator('.lesson > .pre-next').click(); }
    else await page.locator('.pre-card .opt').first().click();
    await page.locator('.lesson > .pre-next').click();
  }
  // under the first reading block, a quiet button (never the primary)
  const btn = page.locator('.teach-card .film-btn');
  await btn.waitFor({ timeout: 5000 });
  if ((await btn.innerText()).trim() !== 'Bekijk de film') throw new Error(`button: ${await btn.innerText()}`);
  if (await page.locator('.film-btn.btn-primary').count()) throw new Error('film button is a primary');
  if ((await page.locator('.lesson .btn-primary').count()) !== 1) throw new Error('more than one primary with the film button');
  await btn.click();
  const frame = page.locator('.film-wrap iframe.film-frame');
  await frame.waitFor();
  if ((await frame.getAttribute('sandbox')) !== 'allow-scripts') throw new Error('frame not sandboxed to allow-scripts');
  // the page goes in as srcdoc (so it plays offline); its parameters ride in the frame name
  const name = await frame.getAttribute('name');
  if (!/^\?theme=(light|dark)&lang=nl&level=2$/.test(name)) throw new Error(`film params ${name}`);
  if (await frame.getAttribute('src')) throw new Error('film frame has a src: offline it would be empty');
  const film = page.frameLocator('.film-frame');
  await film.locator('#film-data').waitFor({ state: 'attached', timeout: 10000 });
  await film.locator('.fp-poster-go').click();
  // the film asks the app to speak; the app answers when the line is done
  await page.waitForFunction(() => window.__spoken.length >= 1, null, { timeout: 8000 });
  const first = await page.evaluate(() => window.__spoken[0]);
  if (first.text !== 'Een hardmetalen wisselplaat snijdt de draaiende as.' || first.lang !== 'nl-NL') throw new Error(`spoken: ${JSON.stringify(first)}`);
  await film.locator('html[data-narration="bridge"]').waitFor({ state: 'attached', timeout: 3000 });
  await film.locator('html:not([data-said="0"])').waitFor({ state: 'attached', timeout: 8000 });
  const cap = (await film.locator('.fp-cap').innerText()).trim();
  if (!cap) throw new Error('caption empty after play');
  // the frame grows to fit the film (the film reports its height)
  const hgt = await frame.evaluate((f) => f.getBoundingClientRect().height);
  if (hgt < 300 || hgt > 700) throw new Error(`frame height ${hgt}`);
  await page.waitForTimeout(1200);
  await shot('118-lesson-film');
  // mute is remembered by the app; the next film opens muted
  await film.locator('[data-act="mute"]').click();
  await page.waitForFunction(() => localStorage.getItem('vp:filmMuted') === '1', null, { timeout: 3000 });
  await film.locator('[data-act="mute"]').click();
  await page.waitForFunction(() => localStorage.getItem('vp:filmMuted') === '0', null, { timeout: 3000 });
  // closing the film removes the frame
  await btn.click();
  if (await page.locator('.film-frame').count()) throw new Error('film not closed');
  // leaving the reading block while the film speaks removes it and silences the voice
  await btn.click();
  await page.frameLocator('.film-frame').locator('.fp-poster-go').click();
  await page.waitForFunction(() => window.__spoken.length >= 2, null, { timeout: 8000 });
  // voice.say() cancels too before each line: count only cancels beyond new lines
  const before = await page.evaluate(() => [window.__cancels, window.__spoken.length]);
  await page.locator('.lesson > .btn-primary').click();
  if (await page.locator('.film-frame').count()) throw new Error('film still open on the next reading block');
  const after = await page.evaluate(() => [window.__cancels, window.__spoken.length]);
  if (after[0] - before[0] <= after[1] - before[1]) throw new Error('speech not cancelled when the reading block changed');
  await page.evaluate(() => window.__app.go('home'));
});

await step('sync: send a login link; a signed-in device merges the cloud state without losing local rounds', async () => {
  const FAKE_SUPABASE = `
    const store = JSON.parse(localStorage.getItem('__fakeCloud') || 'null') || { row: null };
    const save = () => localStorage.setItem('__fakeCloud', JSON.stringify(store));
    const user = { id: 'u1', email: 'merijn@example.com' };
    export function createClient() {
      return {
        auth: {
          getSession: async () => ({ data: { session: { user } } }),
          signInWithOtp: async ({ email }) => { localStorage.setItem('__otp', email); return { error: null }; },
          signOut: async () => ({ error: null }),
        },
        from: () => ({
          select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: store.row, error: null }) }) }),
          upsert: async (row) => { store.row = row; save(); return { error: null }; },
        }),
      };
    }`;
  const saved = await page.evaluate(() => localStorage.getItem('spraakwater:v1'));
  await page.route('**/@supabase/supabase-js@*', (r) => r.fulfill({ contentType: 'application/javascript', body: FAKE_SUPABASE }));
  await page.evaluate(() => window.__app.go('settings'));
  await page.locator('.sync-card input[type=email]').fill('merijn@example.com');
  await page.locator('.sync-card .btn', { hasText: 'Stuur inloglink' }).click();
  await page.locator('.sync-note', { hasText: 'Inloglink gestuurd' }).waitFor();
  if (await page.evaluate(() => localStorage.getItem('__otp')) !== 'merijn@example.com') throw new Error('no login request');
  await shot('68-sync-send');
  // The other device already uploaded a round this one never saw.
  const localTs = await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    const remote = { ...st, settings: undefined, ui: undefined, xp: st.xp + 500, history: [{ ts: 42, drill: 'minute', promptId: 'topic:t01', lang: 'nl', mode: 'type', durationS: 40, transcript: 'x', metrics: { words: 60, wpm: 90, fillerCount: 1, fillerRate: 1.5, fillers: {} }, rating: 3, xp: 20 }] };
    localStorage.setItem('__fakeCloud', JSON.stringify({ row: { user_id: 'u1', state: remote } }));
    localStorage.setItem('spraakwater:v1', JSON.stringify({ ...st, settings: { ...st.settings, syncOn: true } }));
    return st.history.map((e) => e.ts);
  });
  await page.reload();
  await page.waitForFunction(() => window.__app.syncer && window.__app.syncer.status().lastSync);
  const st = await page.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')));
  if (!st.history.some((e) => e.ts === 42)) throw new Error('remote round not merged');
  if (!localTs.every((ts) => st.history.some((e) => e.ts === ts))) throw new Error('a local round was lost');
  const cloud = await page.evaluate(() => JSON.parse(localStorage.getItem('__fakeCloud')).row.state);
  if ('settings' in cloud) throw new Error('settings were uploaded');
  await page.evaluate(() => window.__app.go('settings'));
  await page.locator('.sync-card', { hasText: 'Synchroniseren staat aan' }).waitFor();
  await shot('69-sync-on');
  await page.locator('.sync-card .btn', { hasText: 'Synchroniseren uitzetten' }).click();
  await page.locator('.sync-card input[type=email]').waitFor();
  await page.unroute('**/@supabase/supabase-js@*');
  // Leave the state as later steps expect it: no merged round, sync off.
  await page.evaluate((st) => { localStorage.removeItem('__fakeCloud'); localStorage.removeItem('__otp'); localStorage.setItem('spraakwater:v1', st); }, saved);
  await page.reload();
  await page.locator('.btn-hero').waitFor();
});

await step('changing a setting keeps the scroll position', async () => {
  await page.evaluate(() => window.__app.go('settings'));
  await page.locator('.screen.settings').waitFor();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(200);
  const before = await page.evaluate(() => window.scrollY);
  if (before < 200) throw new Error(`settings page too short to test (${before})`);
  await page.evaluate(() => window.__app.updateSettings({ sound: false }));
  await page.evaluate(() => window.__app.go('settings'));
  await page.waitForTimeout(200);
  const after = await page.evaluate(() => window.scrollY);
  if (Math.abs(after - before) > 40) throw new Error(`scroll jumped from ${before} to ${after}`);
  await page.evaluate(() => { window.__app.updateSettings({ sound: true }); window.__app.go('home'); });
});

await step('a lesson whose module fails to load shows a retry, then loads', async () => {
  const c4 = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  await c4.addInitScript(() => localStorage.setItem('spraakwater:v1', JSON.stringify({ onboarded: true, ui: { subject: 'pm' } })));
  const p4 = await c4.newPage();
  let block = true;
  await c4.route(/courses\/pm\/intake\.nl\.js/, (r) => (block ? r.fulfill({ status: 404, body: '' }) : r.continue()));
  await p4.goto(BASE);
  await p4.locator('.course-pm').waitFor();
  await p4.evaluate(() => window.__app.go('lesson', { subject: 'pm', moduleId: 'pm.intake', lessonId: 'pm.intake.ask' }));
  await p4.locator('.load-error').waitFor();
  await p4.screenshot({ path: `${out}/61b-load-error.png` });
  block = false;
  await p4.locator('.load-error .btn-primary').click();
  await p4.locator('.pre-card').waitFor();
  await c4.close();
});

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
  await page.locator('.focus', { hasText: 'Minder eh, meer pauze' }).waitFor({ timeout: 5000 });
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
    if (!localStorage.getItem('spraakwater:v1')) localStorage.setItem('spraakwater:v1', JSON.stringify({ onboarded: true, ui: { subject: 'speak', moreOpen: true } }));
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
  await page.waitForFunction(() => window.__app); // the app module may still be loading
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

await step('4-week programme: start plays the baseline, Today shows the week, stop clears it', async () => {
  await page.goto(BASE);
  await page.locator('details.more[open] .programme-card').scrollIntoViewIfNeeded();
  await shot('25b-programme-off');
  await page.getByRole('button', { name: 'Start het programma' }).click();
  await page.getByText('Nulmeting: doe het gewoon', { exact: false }).waitFor();
  const prog = await page.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')).programme);
  if (!prog || !prog.baseline || !prog.baseline.promptId) throw new Error('baseline not stored');
  await page.goto(BASE);
  await page.locator('.today-label', { hasText: 'Week 1 van 4' }).waitFor();
  await page.locator('.programme-card', { hasText: 'helderheid en structuur' }).scrollIntoViewIfNeeded();
  await shot('25c-programme-on');
  await page.getByRole('button', { name: 'Stop het programma' }).click();
  await page.getByRole('button', { name: 'Start het programma' }).waitFor();
});

await step('journey path and the theme setting', async () => {
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
  await page.getByRole('button', { name: 'Licht', exact: true }).click();
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
  await page.getByRole('button', { name: 'Donker', exact: true }).click();
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  if (bg !== 'rgb(11, 41, 27)') throw new Error(`dark canvas is ${bg}`);
  await page.getByRole('button', { name: 'Donker', exact: true }).scrollIntoViewIfNeeded();
  await shot('27-theme-dark');
  await page.getByRole('button', { name: 'Automatisch', exact: true }).click();
  await page.waitForFunction(() => !document.documentElement.dataset.theme);
  const st = await page.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')).settings.theme);
  if (st !== 'auto') throw new Error(`stored theme ${st}`);
});

await step('dark theme: home, course home and a lesson', async () => {
  await page.goto(BASE);
  await page.getByRole('button', { name: /Instellingen/ }).click();
  await page.getByRole('button', { name: 'Donker', exact: true }).click();
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  await page.getByRole('button', { name: /Home/ }).click();
  await page.locator('.start-card').first().waitFor();
  if (!(await page.locator('.brand .mark-dark').isVisible()) || (await page.locator('.brand .mark-light').isVisible())) throw new Error('wrong mark for dark');
  await page.locator('.start-card.start-speak').click();
  await page.locator('.btn-hero').waitFor();
  await shot('70-dark-home');
  await page.locator('.subject-tab', { hasText: 'Engineering' }).click();
  await page.locator('.course-home .track').first().waitFor();
  await shot('71-dark-course');
  await page.evaluate(() => window.__app.go('lesson', { subject: 'eng', moduleId: 'eng.flow', lessonId: 'eng.flow.oee' }));
  await page.locator('.pre-card').waitFor();
  await shot('72-dark-lesson');
  await page.evaluate(() => { window.__app.setSubject('speak'); window.__app.go('progress'); });
  await page.locator('.week-card').waitFor();
  await shot('73-dark-progress');
  await page.evaluate(() => window.__app.go('settings'));
  await page.getByRole('button', { name: 'Automatisch', exact: true }).click();
  await page.waitForFunction(() => !document.documentElement.dataset.theme);
  await page.evaluate(() => { window.__app.setSubject('speak'); });
  await page.locator('.btn-hero').waitFor();
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
    const blob = await drawShareCard({ title: 'Les klaar', rows: [['verdiend deze les', '+45 XP'], ['dagen op rij', 4], ['Langste schone reeks: 54 woorden zonder stopwoord', 54]], footer: 'Vantage Point' });
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
  await page.locator('.rw-home').getByRole('button', { name: 'Alles' }).click();
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
  await page.locator('.toast').filter({ hasText: 'Vantage Point' }).first().waitFor();
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
  await shot('45b-voice');
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
  await shot('49b-friend-calib');
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

await step('today card recommends one round; "More practice" folds away and remembers it', async () => {
  await page.goto(BASE);
  await page.locator('.today-card .today-what').waitFor();
  await page.locator('details.more > summary').click();
  // The toggle event fires just after the click: wait for the saved state.
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('spraakwater:v1')).ui.moreOpen === false, null, { timeout: 3000 });
  if (await page.locator('.drill-minute').isVisible()) throw new Error('drills still visible with More practice closed');
  await shot('53-today');
  await page.locator('details.more > summary').click();
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
  await shot('53b-your-words');
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
    // Only one skill-mapped round this week, so the card's top 3 does not depend on earlier steps.
    st.history = [{ ...st.history[0], drill: 'frame', ts: Date.now() - 3600000 }, ...st.history.filter((e) => !['frame', 'followUp', 'pressure', 'pause'].includes(e.drill))];
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

await step('today card nudges toward a real-life skill not used lately', async () => {
  await page.goto(BASE);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    const day = (n) => { const d = new Date(Date.now() - n * 86400000); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const ev = (id, n, skills) => ({ id, type: 'team', date: day(n), text: 'x', reflection: { rating: 4, next: '', skills } });
    st.events = [ev('n1', 1, ['frame']), ev('n2', 3, ['pressure', 'pause'])];
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.goto(BASE);
  await page.locator('.today-nudge', { hasText: 'Doorvragen' }).waitFor();
  await shot('57-today-nudge');
});

await step('situation finder and a first-time tip on the intro', async () => {
  await page.goto(BASE);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    st.ui = { ...(st.ui || {}), tipsSeen: {} };
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.goto(BASE);
  await page.locator('details.finder > summary').click();
  await page.locator('.finder-row', { hasText: 'Klant gaat tegen je idee in' }).waitFor();
  await shot('57-finder');
  await page.locator('.finder-row', { hasText: 'Klant gaat tegen je idee in' }).getByRole('button', { name: /PREP/ }).click();
  await page.locator('details.tip[open]').waitFor();
  await page.getByRole('radio', { name: /Typen/ }).click();
  await page.locator('details.tip[open]').waitFor(); // stays open after the redraw
  await shot('58-tip');
  await page.getByRole('button', { name: 'Sluiten' }).click();
  await page.locator('.drill-prep').click();
  if (await page.locator('details.tip[open]').count()) throw new Error('tip should be folded the second time');
  await page.getByRole('button', { name: 'Sluiten' }).click();
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

// v9: a separate context per feature, seeded from scratch, so the steps above keep their state.
async function v9Context(seed = {}) {
  const c = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p = await c.newPage();
  p.on('pageerror', onPageError);
  p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await p.goto(BASE);
  await p.evaluate(async (s) => {
    const { isoWeekKey } = await import('./src/core/boss.js');
    localStorage.setItem('spraakwater:v1', JSON.stringify({ onboarded: true, weekly: { week: isoWeekKey(new Date()), focus: null }, ui: { subject: 'eng' }, ...s }));
  }, seed);
  await p.reload();
  const shotP = async (n) => {
    const text = await p.evaluate(() => document.body.innerText);
    if (/(?<![A-Za-z])(null|undefined|NaN)/.test(text)) errors.push(`${n}: stray null/undefined/NaN on screen`);
    await p.screenshot({ path: `${out}/${n}.png`, fullPage: true, animations: 'disabled' });
  };
  const dark = async (n, redraw) => {
    await p.evaluate(() => window.__app.updateSettings({ theme: 'dark' }));
    await redraw();
    await shotP(n);
    await p.evaluate(() => window.__app.updateSettings({ theme: 'light' }));
  };
  return { c, p, shotP, dark };
}
const yesterdayKey = () => { const d = new Date(Date.now() - 86400000); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
// Answers the visible quiz question correctly from the lesson file.
async function answerRight(pg, lesson, scope = '.quiz-card') {
  const text = (await pg.locator(`${scope} .quiz-q`).innerText()).trim();
  const q = lesson.recall.find((x) => x.q.trim() === text);
  if (!q) throw new Error(`question not in lesson: ${text}`);
  if ('number' in q) { await pg.locator(`${scope} .quiz-num`).fill(String(q.number).replace('.', ',')); await pg.locator(`${scope} .btn-primary`).click(); }
  else await pg.locator(`${scope} .opt`, { hasText: q.answer }).first().click();
  return q;
}

await step('use it this week: plan at lesson end, check back two days later', async () => {
  // A speaking round today, so the start screen suggests Engineering.
  const round = await page.evaluate(() => ((JSON.parse(localStorage.getItem('spraakwater:v1')) || {}).history || [])[0]);
  const r0 = round || { ts: Date.now(), drill: 'minute', promptId: 'topic:t1', metrics: { words: 50, fillerRate: 2 } };
  const { c, p, shotP, dark } = await v9Context();
  await p.locator('.course-today .today-go').waitFor();
  await p.evaluate(() => window.__app.go('lesson', { subject: 'eng', moduleId: 'eng.flow', lessonId: 'eng.flow.takt' }));
  await p.locator('.pre-card').waitFor();
  const lesson = await playLesson(p, 'eng', 'flow', 'eng.flow.takt');
  await onePrimary(p, 'lesson done with the plan field');
  await p.locator('.plan-card .plan-input').fill('Als de planner maandag de takt noemt, dan vraag ik hoe die berekend is.');
  await shotP('90-plan-field');
  await p.locator('.lesson-done ~ .btn', { hasText: 'Terug naar de cursus' }).click();
  await p.locator('.course-home').waitFor();
  let st = await p.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')));
  if (!st.courses.eng.plans[0] || !st.courses.eng.plans[0].text.startsWith('Als de planner')) throw new Error('plan not saved');
  if (st.xp !== 20) throw new Error(`a plan gave XP: ${st.xp}`);
  // Four days later: the plan is due.
  await p.evaluate(([r, y]) => {
    const s = JSON.parse(localStorage.getItem('spraakwater:v1'));
    s.courses.eng.plans[0].due = y;
    s.courses.eng.sessions = s.courses.eng.sessions.map((x) => ({ ...x, day: y }));
    s.history = [{ ...r, ts: Date.now() }];
    s.ui = { ...s.ui, subject: 'start' };
    localStorage.setItem('spraakwater:v1', JSON.stringify(s));
  }, [r0, yesterdayKey()]);
  await p.reload();
  await p.locator('.start-card.start-eng.suggested', { hasText: 'Je wilde dit gebruiken' }).waitFor();
  await p.locator('.begin-btn').click();
  await p.locator('.screen.apply .plan-text', { hasText: 'Als de planner' }).waitFor();
  if (await p.locator('.btn-primary:visible').count()) throw new Error('apply: filled button next to the choices');
  await shotP('91-apply');
  await dark('91-apply-dark', async () => {
    await p.evaluate(() => { const s = window.__app.state; window.__app.go('apply', { subject: 'eng', planId: s.courses.eng.plans[0].id }); });
    await p.locator('.screen.apply .plan-text').waitFor();
  });
  // Leaving the check-back without an answer counts as "ask me later", so it can't come back daily.
  const asked = await p.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')).courses.eng.plans[0].asked || 0);
  if (asked < 1) throw new Error('leaving the check-back unanswered did not count as asked');
  await p.locator('.screen.apply .opt', { hasText: 'Deels' }).click();
  await p.locator('.screen.apply .opt[aria-pressed="true"]', { hasText: 'Deels' }).waitFor();
  await onePrimary(p, 'apply after the choice');
  await p.locator('.apply-note').fill('Gevraagd, bleek bruto tijd.');
  await p.locator('.apply-save').click();
  await p.locator('.screen.apply .quiz-card').waitFor();
  if (await p.locator('.screen.apply .opt').count()) {
    if (await p.locator('.btn-primary:visible').count()) throw new Error('apply quiz: filled button next to the options');
  } else await onePrimary(p, 'apply quiz');
  await answerRight(p, lesson, '.screen.apply .quiz-card');
  await p.locator('.screen.apply .quiz-review').waitFor();
  await onePrimary(p, 'apply review');
  await p.locator('.screen.apply .quiz-review .btn-primary').click();
  await p.locator('.apply-done').waitFor();
  await onePrimary(p, 'apply done');
  await p.locator('.screen.apply .btn-primary').click();
  st = await p.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')));
  const plan = st.courses.eng.plans[0];
  if (!plan.outcome || plan.outcome.used !== 'partly' || plan.outcome.note !== 'Gevraagd, bleek bruto tijd.') throw new Error(`outcome: ${JSON.stringify(plan.outcome)}`);
  if (st.xp !== 20) throw new Error(`the check-back gave XP: ${st.xp}`);
  await p.evaluate(() => window.__app.setSubject('eng'));
  await p.locator('.course-today').waitFor();
  if ((await p.locator('.course-today').innerText()).includes('Je wilde dit gebruiken')) throw new Error('Today is still the plan');
  await c.close();
});

await step('before the meeting: event with a topic offers a refresh', async () => {
  const later = new Date(Date.now() + 9 * 86400000);
  const laterKey = `${later.getFullYear()}-${String(later.getMonth() + 1).padStart(2, '0')}-${String(later.getDate()).padStart(2, '0')}`;
  const lid = 'eng.gridbasics.basics';
  const { c, p, shotP, dark } = await v9Context({
    xp: 20,
    courses: { eng: { lessons: { [lid]: { read: 1, passed: 1 } }, sessions: [] }, pm: { lessons: {}, sessions: [] } },
    courseReviews: Object.fromEntries([0, 1, 2, 3].map((i) => [`nl|${lid}#r${i}`, { box: 2, due: laterKey, lesson: lid, subject: 'eng' }])),
  });
  const lesson = await p.evaluate(async (id) => (await import('/src/content/courses/eng/gridbasics.nl.js')).default.lessons.find((l) => l.id === id), lid);
  await p.locator('.course-today').waitFor();
  await p.evaluate(() => window.__app.go('realweek'));
  await p.locator('.realweek .text-input').waitFor();
  await onePrimary(p, 'real week form');
  const tomorrow = new Date(Date.now() + 86400000);
  await p.locator('.realweek input[type="date"]').fill(`${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`);
  await p.locator('.realweek .text-input').fill('Netcongestie-overleg bij Enexis');
  await p.locator('details.rw-topic > summary').click();
  await p.locator('.rw-topic-select').selectOption('eng.gridbasics');
  await onePrimary(p, 'real week form with the topic open');
  await shotP('92-event-topic');
  await p.getByRole('button', { name: /Toevoegen/ }).click();
  await p.locator('.rw-refresh', { hasText: 'Het elektriciteitsnet' }).waitFor();
  await onePrimary(p, 'real week with an event');
  const st0 = await p.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')));
  if (JSON.stringify(st0.events[0].topics) !== '["eng.gridbasics"]') throw new Error(`topics: ${JSON.stringify(st0.events[0].topics)}`);
  await p.evaluate(() => window.__app.go('home'));
  await p.locator('.course-today', { hasText: 'Voor Netcongestie-overleg bij Enexis' }).waitFor();
  await shotP('93-prep-today');
  await dark('93-prep-today-dark', async () => {
    await p.evaluate(() => window.__app.go('home'));
    await p.locator('.course-today', { hasText: 'Voor Netcongestie' }).waitFor();
  });
  await p.locator('.course-today .today-go').click();
  await p.locator('.screen.due .quiz-card').waitFor();
  for (let i = 0; i < 4; i++) {
    await p.locator('.screen.due .quiz-card').waitFor();
    if (!(await p.locator('.screen.due .opt').count())) await onePrimary(p, 'prep due screen');
    else if (await p.locator('.btn-primary:visible').count()) throw new Error('prep: filled button next to the options');
    await answerRight(p, lesson, '.screen.due .quiz-card');
  }
  await p.locator('.screen.due .quiz-review .btn-primary').click();
  await p.locator('.due-done').waitFor();
  await onePrimary(p, 'prep done');
  const st = await p.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')));
  if (JSON.stringify(st.courses.eng.prepped) !== JSON.stringify([st.events[0].id])) throw new Error(`prepped: ${JSON.stringify(st.courses.eng.prepped)}`);
  if (Object.values(st.days).reduce((a, b) => a + b, 0) !== 1) throw new Error('a prep session counts once');
  await p.locator('.due-done ~ .btn-primary').click();
  await p.locator('.course-today').waitFor();
  if ((await p.locator('.course-today').innerText()).includes('Voor Netcongestie')) throw new Error('Today still offers the refresh');
  await c.close();
});

await step('guessing: a correct guess does not climb; a sure miss is marked', async () => {
  const lid = 'eng.flow.changeover';
  const { c, p, shotP, dark } = await v9Context();
  const lesson = await p.evaluate(async (id) => (await import('/src/content/courses/eng/flow.nl.js')).default.lessons.find((l) => l.id === id), lid);
  await p.locator('.course-today').waitFor();
  await p.evaluate((id) => window.__app.go('lesson', { subject: 'eng', moduleId: 'eng.flow', lessonId: id }), lid);
  for (const q of lesson.pre) {
    if ('number' in q) { await p.locator('.pre-card .quiz-num').fill('1'); await p.locator('.lesson > .pre-next').click(); }
    else await p.locator('.pre-card .opt').first().click();
    await p.locator('.lesson > .pre-next').click();
  }
  for (let i = 0; i < lesson.teach.length; i++) await p.locator('.lesson > .btn-primary').click();
  await p.locator('.example-card').waitFor();
  await p.locator('.lesson > .btn-primary').click();
  // Q1 (a choice): two plain options, "Ik weet het" selected; say "Ik gok", then answer it right.
  await p.locator('.quiz-card .guess-sure[aria-pressed="true"]', { hasText: 'Ik weet het' }).waitFor();
  await p.locator('.quiz-card .guess-toggle[aria-pressed="false"]', { hasText: 'Ik gok' }).click();
  await p.locator('.quiz-card .guess-sure[aria-pressed="false"]').waitFor();
  await p.locator('.quiz-card .guess-toggle[aria-pressed="true"]').waitFor();
  if (await p.locator('.btn-primary:visible').count()) throw new Error('quiz: filled button next to the options and the toggle');
  await shotP('94-guess-toggle');
  await answerRight(p, lesson);
  // Q2 (a number): the toggle is back to sure; one filled button; answer wrong while sure.
  await p.locator('.quiz-card .quiz-progress', { hasText: '2/' }).waitFor();
  await p.locator('.quiz-card .guess-toggle[aria-pressed="false"]').waitFor();
  await p.locator('.quiz-card .guess-sure[aria-pressed="true"]').waitFor();
  await onePrimary(p, 'quiz card with the toggle');
  const q2 = lesson.recall[1];
  await p.locator('.quiz-card .quiz-num').fill(String(q2.number + 1000));
  await p.locator('.quiz-card .btn-primary').click();
  for (let i = 2; i < lesson.recall.length; i++) await answerRight(p, lesson);
  await p.locator('.quiz-review').waitFor();
  if (await p.locator('.review-row.sure-miss').count() !== 1) throw new Error('expected one sure miss');
  await p.locator('.review-row.sure-miss .sure-mark', { hasText: 'Niet als gok aangegeven' }).waitFor();
  await onePrimary(p, 'quiz review with a sure miss');
  await shotP('95-sure-miss-review');
  await dark('95-sure-miss-review-dark', async () => { await p.locator('.quiz-review').waitFor(); });
  await p.locator('.quiz-review .btn-primary').click();
  await answerRight(p, lesson);
  await p.locator('.quiz-review .btn-primary').click();
  await p.locator('.lesson-done').waitFor();
  let st = await p.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')));
  const box = (i) => st.courseReviews[`nl|${lid}#r${i}`].box;
  if (box(0) !== 1 || box(1) !== 1 || box(2) !== 2) throw new Error(`boxes: ${[0, 1, 2, 3].map(box)}`);
  // Back after a long break: a question due 90 days ago is still in the queue.
  const old = new Date(Date.now() - 90 * 86400000);
  const oldKey = `${old.getFullYear()}-${String(old.getMonth() + 1).padStart(2, '0')}-${String(old.getDate()).padStart(2, '0')}`;
  await p.evaluate(([k, d]) => {
    const s = JSON.parse(localStorage.getItem('spraakwater:v1'));
    s.courseReviews = { [k]: { box: 3, due: d, lesson: 'eng.flow.takt', subject: 'eng' } };
    localStorage.setItem('spraakwater:v1', JSON.stringify(s));
  }, ['nl|eng.flow.takt#r1', oldKey]);
  await p.reload();
  await p.locator('.due-card', { hasText: '1' }).click();
  const takt = await p.evaluate(async () => (await import('/src/content/courses/eng/flow.nl.js')).default.lessons.find((l) => l.id === 'eng.flow.takt'));
  await p.locator('.screen.due .quiz-q', { hasText: takt.recall[1].q.trim().slice(0, 30) }).waitFor();
  await c.close();
});

await step('polish: the real week from the start screen and course homes; welcome text; settings order; page language', async () => {
  const { c, p, shotP, dark } = await v9Context({ ui: { subject: 'start' } });
  if (await p.evaluate(() => document.documentElement.lang) !== 'nl') throw new Error('html lang is not nl');
  await p.locator('.start-cards .start-card').nth(2).waitFor();
  await p.locator('.start .rw-entry', { hasText: 'Mijn echte week' }).waitFor();
  await onePrimary(p, 'start with the real-week entry');
  await shotP('96-start-realweek-entry');
  await dark('96-start-realweek-entry-dark', async () => { await p.evaluate(() => window.__app.go('home')); await p.locator('.start .rw-entry').waitFor(); });
  await p.locator('.start .rw-entry').click();
  await p.locator('main.screen.realweek').waitFor();
  for (const sub of ['eng', 'pm']) {
    await p.evaluate((x) => window.__app.setSubject(x), sub);
    await p.locator(`.course-${sub} .rw-entry`).waitFor();
    await onePrimary(p, `course home ${sub} with the real-week entry`);
  }
  await p.locator('.course-pm .rw-entry').scrollIntoViewIfNeeded();
  await shotP('97-course-realweek-entry');
  await dark('97-course-realweek-entry-dark', async () => { await p.evaluate(() => window.__app.go('home')); await p.locator('.course-pm .rw-entry').waitFor(); });
  await p.locator('.course-pm .rw-entry').click();
  await p.locator('main.screen.realweek').waitFor();
  // Settings: sync above the coach and the key.
  await p.evaluate(() => window.__app.go('settings'));
  await p.locator('.settings-group').first().waitFor();
  const order = await p.locator('[data-section]').evaluateAll((els) => els.map((e) => e.dataset.section));
  if (order.indexOf('sync') < 0 || order.indexOf('sync') > order.indexOf('coach')) throw new Error(`settings order: ${order}`);
  await shotP('98a-settings-sync-first');
  await p.evaluate(() => window.__app.updateSettings({ lang: 'en' }));
  if (await p.evaluate(() => document.documentElement.lang) !== 'en') throw new Error('html lang did not follow the language');
  await p.evaluate(() => window.__app.updateSettings({ lang: 'nl' }));
  // Welcome: plain subject list, extras per subject, sync mentioned.
  await p.evaluate(() => window.__app.go('welcome'));
  await p.locator('.welcome-list li').first().waitFor();
  const look = await p.locator('.welcome-list li').first().evaluate((el) => { const cs = getComputedStyle(el); return `${cs.borderTopWidth}|${cs.backgroundColor}`; });
  if (!look.startsWith('0px|') || !/rgba\(0, 0, 0, 0\)|transparent/.test(look)) throw new Error(`welcome subjects still look like cards: ${look}`);
  await shotP('98-welcome-subjects');
  await dark('98-welcome-subjects-dark', async () => { await p.evaluate(() => window.__app.go('welcome')); await p.locator('.welcome-list li').first().waitFor(); });
  await p.evaluate(() => window.__app.go('welcome'));
  await p.getByRole('button', { name: 'Volgende' }).click();
  await p.locator('.welcome-slide', { hasText: 'Extra oefeningen staan per vak' }).waitFor();
  await p.getByRole('button', { name: 'Volgende' }).click();
  await p.locator('.welcome-slide', { hasText: 'synchroniseren tussen apparaten' }).waitFor();
  await c.close();
});

await step('polish: quiz back shows the earlier answer; Raden and Lezen buttons alike; spacing; plan saved under the done card', async () => {
  const lid = 'eng.flow.takt';
  const { c, p, shotP, dark } = await v9Context();
  const lesson = await p.evaluate(async (id) => (await import('/src/content/courses/eng/flow.nl.js')).default.lessons.find((l) => l.id === id), lid);
  await p.locator('.course-today').waitFor();
  await p.evaluate((id) => window.__app.go('lesson', { subject: 'eng', moduleId: 'eng.flow', lessonId: id }), lid);
  await p.locator('.pre-card').waitFor();
  const width = async (sel) => (await p.locator(sel).first().boundingBox()).width;
  for (const q of lesson.pre) {
    if ('number' in q) { await p.locator('.pre-card .quiz-num').fill('1'); await p.locator('.lesson > .pre-next').click(); }
    else await p.locator('.pre-card .opt').first().click();
    const w = await width('.lesson > .pre-next');
    if (w < 340) throw new Error(`Raden: Verder is not full width (${w})`);
    await shotP('104-pre-next-full-width');
    await p.locator('.lesson > .pre-next').click();
  }
  await p.locator('.teach-card').waitFor();
  const wRead = await width('.lesson > .btn-primary');
  if (wRead < 340) throw new Error(`Lezen: Verder is not full width (${wRead})`);
  for (let i = 0; i < lesson.teach.length; i++) await p.locator('.lesson > .btn-primary').click();
  if (lesson.example.kind === 'faded') { await p.locator('.reveal-btn').click(); await p.locator('.example-card .btn-primary').click(); }
  else await p.locator('.lesson > .btn-primary').click();
  await p.locator('.quiz-card').waitFor();
  // The first question: the back button sits apart from the answer controls.
  const backBox = await p.locator('.quiz-card .lesson-back').boundingBox();
  const above = await p.locator('.quiz-card .btn-primary, .quiz-card .opt').last().boundingBox();
  if (backBox.y - (above.y + above.height) < 8) throw new Error('first question: back touches the answer controls');
  await shotP('99-quiz-first-spacing');
  await dark('99-quiz-first-spacing-dark', async () => { await p.locator('.quiz-card').waitFor(); });
  // Answer the first question (a guess, wrong), then go back: the pick and the guess are shown again.
  const q1 = lesson.recall[0];
  await p.locator('.quiz-card .guess-toggle').click();
  let mine;
  if ('number' in q1) { mine = String(q1.number + 7); await p.locator('.quiz-card .quiz-num').fill(mine); await p.locator('.quiz-card .btn-primary').click(); }
  else { mine = q1.options.find((o) => o !== q1.answer); await p.locator('.quiz-card .opt', { hasText: mine }).first().click(); }
  await p.locator('.quiz-card .quiz-progress', { hasText: '2/' }).waitFor();
  await p.locator('.quiz-card .quiz-back').click();
  await p.locator('.quiz-card .quiz-picked', { hasText: 'Je koos:' }).waitFor();
  await p.locator('.quiz-card .guess-toggle[aria-pressed="true"]').waitFor();
  if ('number' in q1) {
    if ((await p.locator('.quiz-card .quiz-num').inputValue()) !== mine) throw new Error('numeric answer not prefilled');
    await onePrimary(p, 'quiz back with the earlier answer');
  } else {
    await p.locator('.quiz-card .opt.chosen[aria-pressed="true"]', { hasText: mine }).waitFor();
    if (await p.locator('.btn-primary:visible').count()) throw new Error('quiz back: filled button next to the options');
  }
  await shotP('100-quiz-back-picked');
  await dark('100-quiz-back-picked-dark', async () => { await p.locator('.quiz-card .quiz-picked').waitFor(); });
  for (let i = 0; i < lesson.recall.length; i++) {
    await p.locator('.quiz-card').waitFor();
    await answerRight(p, lesson);
  }
  await p.locator('.quiz-review .btn-primary').click();
  await p.locator('.lesson-done').waitFor();
  // The plan field directly under the done card; a quiet "Bewaard" after typing.
  if (!(await p.locator('.lesson-done + .plan-card').count())) throw new Error('plan field is not right under the done card');
  await p.locator('.plan-card .plan-input').fill('Als de planner de takt noemt, vraag ik hoe die berekend is.');
  await p.locator('.plan-card .plan-saved[aria-live="polite"]', { hasText: 'Bewaard' }).waitFor({ timeout: 3000 });
  const draft = await p.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')).ui.planDraft);
  if (!draft || !draft.text.startsWith('Als de planner')) throw new Error(`draft not kept: ${JSON.stringify(draft)}`);
  await onePrimary(p, 'lesson done with the plan saved');
  await shotP('101-plan-saved');
  await p.evaluate(() => window.__app.updateSettings({ theme: 'dark' }));
  await shotP('101-plan-saved-dark');
  await p.evaluate(() => window.__app.updateSettings({ theme: 'light' }));
  // Closing the app on this screen: the next start turns the draft into the plan, once.
  await p.reload();
  await p.locator('.course-today').waitFor();
  const st = await p.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')));
  if ('planDraft' in st.ui || !st.courses.eng.plans || st.courses.eng.plans.length !== 1) throw new Error(`draft not committed once: ${JSON.stringify(st.courses.eng.plans)}`);
  await c.close();
});

await step('polish: speaking intro shows Start without scrolling, labelled timing; the real week shows the linked topic', async () => {
  const { c, p, shotP, dark } = await v9Context({ ui: { subject: 'speak' } });
  await p.locator('.btn-hero').waitFor();
  await p.evaluate(() => window.__app.startDrill('explain'));
  await p.locator('.intro-card .tip[open]').waitFor();
  await p.locator('.intro-card .timing-line', { hasText: 'Spreektijd' }).waitFor();
  const box = await p.getByRole('button', { name: 'Start' }).boundingBox();
  if (!box || box.y + box.height > 844) throw new Error(`Start is below the fold: ${JSON.stringify(box)}`);
  await onePrimary(p, 'speaking intro');
  await p.screenshot({ path: `${out}/102-intro-start-visible.png`, animations: 'disabled' });
  await p.evaluate(() => window.__app.updateSettings({ theme: 'dark' }));
  await p.screenshot({ path: `${out}/102-intro-start-visible-dark.png`, animations: 'disabled' });
  await p.evaluate(() => window.__app.updateSettings({ theme: 'light' }));
  await shotP('102b-intro-full');
  // A saved event with a topic shows the module title.
  const tomorrow = new Date(Date.now() + 86400000);
  const tk = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  await p.evaluate((d) => { const s = window.__app.state; window.__app.setState({ ...s, events: [{ id: 'e1', type: 'client', date: d, text: 'Overleg met de netbeheerder', topics: ['eng.gridbasics'] }] }); window.__app.go('realweek'); }, tk);
  await p.locator('.rw-event .rw-topic-line', { hasText: 'Onderwerp: Het elektriciteitsnet' }).waitFor();
  await onePrimary(p, 'real week with a topic line');
  await shotP('103-realweek-topic');
  await dark('103-realweek-topic-dark', async () => { await p.evaluate(() => window.__app.go('realweek')); await p.locator('.rw-topic-line').waitFor(); });
  await c.close();
});

// v10: topic modules. Until real topic content lands, the index is served with
// the eng.machining entry replaced by a fixture: one topic (Draaien) whose four
// levels are lessons that exist today. Reusable: pass another entry text.
const MACHINING_TOPIC_FIXTURE = `{ id: 'eng.machining', subject: 'eng', track: 'discrete', level: 1, title: { en: 'Machining', nl: 'Verspanen' }, blurb: { en: 'Turning, milling, drilling and CNC.', nl: 'Draaien, frezen, boren en CNC.' },
    topics: [{ id: 'turning', title: { en: 'Turning', nl: 'Draaien' }, levels: ['eng.machining.processes', 'eng.machining.cutting', 'eng.machining.tools', 'eng.machining.quality'] }],
    lessons: ['eng.machining.processes', 'eng.machining.cutting', 'eng.machining.tools', 'eng.machining.quality'],
    questions: { 'eng.machining.processes': 4, 'eng.machining.cutting': 4, 'eng.machining.tools': 4, 'eng.machining.quality': 4 } },`;
async function routeModuleEntry(c, moduleId, entry) {
  await c.route(/\/src\/content\/courses\/index\.js(\?.*)?$/, async (route) => {
    const res = await route.fetch();
    const text = await res.text();
    const start = text.indexOf(`{ id: '${moduleId}',`);
    if (start < 0) throw new Error(`${moduleId} not in the index`);
    // The next module entry (two-space indent), not a topic inside this one.
    const after = text.slice(start + 1).search(/\n  \{ id: '|\n\];/);
    const end = start + 1 + after;
    await route.fulfill({ response: res, body: `${text.slice(0, start)}${entry}${text.slice(end)}` });
  });
}
// A context without the service worker (it would answer before the route) and
// with the fixture index; seeded like v9Context.
async function topicContext(seed = {}) {
  const c = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, serviceWorkers: 'block' });
  await routeModuleEntry(c, 'eng.machining', MACHINING_TOPIC_FIXTURE);
  const p = await c.newPage();
  p.on('pageerror', onPageError);
  p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await p.goto(BASE);
  await p.evaluate(async (s) => {
    const { isoWeekKey } = await import('./src/core/boss.js');
    localStorage.setItem('spraakwater:v1', JSON.stringify({ onboarded: true, weekly: { week: isoWeekKey(new Date()), focus: null }, ui: { subject: 'eng' }, ...s }));
  }, seed);
  await p.reload();
  const shotP = async (n, opts = {}) => {
    const text = await p.evaluate(() => document.body.innerText);
    if (/(?<![A-Za-z])(null|undefined|NaN)/.test(text)) errors.push(`${n}: stray null/undefined/NaN on screen`);
    await p.screenshot({ path: `${out}/${n}.png`, fullPage: true, animations: 'disabled', ...opts });
  };
  return { c, p, shotP };
}
// v9-style progress on the fixture topic: Basis passed, Werkkennis owned.
const topicSeed = () => {
  const lessons = { 'eng.machining.processes': { read: 1000, passed: 1000 }, 'eng.machining.cutting': { read: 2000, passed: 2000 } };
  const courseReviews = Object.fromEntries([0, 1, 2, 3].map((i) => [`nl|eng.machining.cutting#r${i}`, { box: 4, due: '2099-01-01', lesson: 'eng.machining.cutting', subject: 'eng' }]));
  return { courses: { eng: { lessons, sessions: [] } }, courseReviews };
};
const openTopicModule = async (p) => {
  await p.locator('.course-home').waitFor();
  const mod = p.locator('details.topic-module', { hasText: 'Verspanen' });
  if (!(await mod.evaluate((d) => d.open))) await mod.locator('summary').click();
  await mod.locator('.level-chip').first().waitFor();
  return mod;
};

await step('topics: level chips in a module (fixture)', async () => {
  const { c, p, shotP } = await topicContext(topicSeed());
  const mod = await openTopicModule(p);
  const chips = mod.locator('.topic-row').first().locator('.level-chip');
  if (await chips.count() !== 4) throw new Error(`expected 4 chips, got ${await chips.count()}`);
  const cls = await chips.evaluateAll((els) => els.map((e) => e.className));
  if (!cls[0].includes('s-passed') || !cls[1].includes('s-owned') || !cls[2].includes('next') || cls[3].includes('next')) throw new Error(`chip states: ${cls.join(' | ')}`);
  if (!(await chips.nth(0).locator('.ico-circle-check').count()) || !(await chips.nth(1).locator('.ico-check-check').count())) throw new Error('chip state icons missing');
  if ((await chips.nth(2).locator('.chip-next').innerText()).trim() !== 'Volgende') throw new Error('next chip not labelled Volgende');
  if (await chips.nth(1).getAttribute('aria-label') !== 'Draaien, Werkkennis: beheerst') throw new Error(`aria: ${await chips.nth(1).getAttribute('aria-label')}`);
  if (await mod.locator('.level-chip.btn-primary').count()) throw new Error('a chip is a primary button');
  if (!(await mod.locator('.module-meta', { hasText: '2/4 niveaus' }).count())) throw new Error('no levels count in the summary');
  if (!(await mod.locator('.topic-count', { hasText: '2/4' }).count())) throw new Error('no topic count');
  if (!(await mod.locator('.module-continue', { hasText: 'Verder: Draaien · Gevorderd' }).count())) throw new Error('continue does not name the level');
  await onePrimary(p, 'course home with a topic module open');
  // No chip label is cut off: every label fits its chip.
  const clipped = await mod.locator('.chip-label').evaluateAll((els) => els.filter((e) => e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1).map((e) => e.textContent));
  if (clipped.length) throw new Error(`clipped chip labels: ${clipped.join(', ')}`);
  // A one-word label is never broken inside the word.
  const broken = await mod.locator('.chip-label').evaluateAll((els) => els.filter((e) => {
    if (/\s/.test(e.textContent.trim())) return false;
    const r = document.createRange(); r.selectNodeContents(e);
    return r.getClientRects().length > 1;
  }).map((e) => e.textContent));
  if (broken.length) throw new Error(`chip label broken mid-word: ${broken.join(', ')}`);
  await mod.scrollIntoViewIfNeeded();
  await shotP('110-topic-chips');
  await mod.screenshot({ path: `${out}/111-topic-chips-390.png`, animations: 'disabled' });
  await p.evaluate(() => window.__app.updateSettings({ theme: 'dark' }));
  await p.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  await openTopicModule(p);
  await shotP('110-topic-chips-dark');
  await mod.screenshot({ path: `${out}/111-topic-chips-390-dark.png`, animations: 'disabled' });
  await p.evaluate(() => window.__app.updateSettings({ theme: 'light' }));
  // Free access: Expert opens although Gevorderd is not passed.
  const title = await p.evaluate(async () => (await import('/src/content/courses/eng/machining.nl.js')).default.lessons.find((l) => l.id === 'eng.machining.quality').title);
  await chips.nth(3).click();
  await p.locator('.lesson .pre-card, .lesson .teach-card').first().waitFor();
  if ((await p.locator('.round-title').innerText()).trim() !== title) throw new Error('Expert chip did not open eng.machining.quality');
  await p.locator('.round-top .icon-btn').first().click();
  await openTopicModule(p);
  await c.close();
});

await step('topics: where you are (fixture)', async () => {
  const { c, p, shotP } = await topicContext(topicSeed());
  const mod = await openTopicModule(p);
  // Chip 3 is Gevorderd: eng.machining.tools in the fixture.
  await mod.locator('.topic-row').first().locator('.level-chip').nth(2).click();
  await p.locator('.lesson-place', { hasText: 'Draaien · Gevorderd' }).waitFor();
  await shotP('112-lesson-place');
  await playLesson(p, 'eng', 'machining', 'eng.machining.tools');
  const nextBtn = p.locator('.next-level');
  if ((await nextBtn.innerText()).trim() !== 'Volgende: Draaien · Expert') throw new Error(`next level: ${await nextBtn.innerText()}`);
  if (await p.locator('.next-level.btn-primary').count()) throw new Error('next level is a primary button');
  await onePrimary(p, 'lesson done with a next level');
  await shotP('113-done-next-level');
  // Dark through the system setting (theme Auto), so the done card stays.
  await p.emulateMedia({ colorScheme: 'dark' });
  await shotP('113-done-next-level-dark');
  await p.emulateMedia({ colorScheme: 'light' });
  await p.getByRole('button', { name: 'Terug naar de cursus' }).click();
  await p.locator('.course-today .today-why', { hasText: 'Draaien · Expert' }).waitFor();
  await onePrimary(p, 'course home after a topic lesson');
  await shotP('114-today-topic');
  await p.getByRole('button', { name: 'Overzicht' }).click();
  await p.locator('.start-eng .start-why', { hasText: 'Draaien · Expert' }).waitFor();
  // The figure of a topic lesson gets its level: cutting is Werkkennis (2).
  await p.evaluate(() => window.__app.go('lesson', { subject: 'eng', moduleId: 'eng.machining', lessonId: 'eng.machining.cutting' }));
  const lesson = await p.evaluate(async () => (await import('/src/content/courses/eng/machining.nl.js')).default.lessons.find((l) => l.id === 'eng.machining.cutting'));
  for (const q of lesson.pre) {
    if ('number' in q) { await p.locator('.pre-card .quiz-num').fill('1'); await p.locator('.lesson > .pre-next').click(); }
    else await p.locator('.pre-card .opt').first().click();
    await p.locator('.lesson > .pre-next').click();
  }
  for (let i = 1; i < lesson.teach.length; i++) await p.locator('.lesson > .btn-primary').click();
  const src = await p.locator('.figure-frame').getAttribute('src', { timeout: 5000 });
  if (!/[?&]level=2(&|$)/.test(src)) throw new Error(`figure src without level=2: ${src}`);
  await c.close();
});

await step('reminder meta is written for the service worker', async () => {
  const meta = await page.evaluate(async () => {
    const r = await (await caches.open('spraakwater-meta')).match('./__meta');
    return r ? r.json() : null;
  });
  if (!meta || !meta.lastDay || !meta.nudge || !meta.nudge.title) throw new Error(JSON.stringify(meta));
});

// Every lesson figure loads clean in the app's sandboxed frame: no console
// errors (an invalid SVG d attribute, a script error) at any level or theme.
await step('figures: every figure loads without console errors', async () => {
  const cf = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pf = await cf.newPage();
  const bad = [];
  pf.on('console', (m) => { if (m.type() === 'error' && !/favicon/.test(m.text())) bad.push(m.text()); });
  pf.on('pageerror', (e) => bad.push(e.message));
  await pf.goto(BASE);
  const ids = fs.readdirSync('src/content/courses/figures').filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5));
  for (const id of ids) {
    for (const [lv, theme, lang] of [[1, 'light', 'nl'], [2, 'dark', 'en'], [3, 'light', 'nl'], [4, 'dark', 'nl']]) {
      const before = bad.length;
      await pf.evaluate((src) => { document.body.innerHTML = `<iframe sandbox="allow-scripts" width="390" height="600" src="${src}"></iframe>`; }, `src/content/courses/figures/${id}.html?theme=${theme}&lang=${lang}&level=${lv}`);
      await pf.waitForTimeout(700);
      if (bad.length > before) bad.splice(before, bad.length - before, `${id} L${lv} ${theme} ${lang}: ${bad.slice(before).join(' | ').slice(0, 200)}`);
    }
  }
  await cf.close();
  if (bad.length) throw new Error(bad.join('\n'));
});

// Every film page loads clean in a sandboxed frame, in both themes and languages
// and with reduced motion; English captions carry no Dutch term.
await step('films: every film loads without console errors (light/dark, nl/en, reduced motion)', async () => {
  const cf = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pf = await cf.newPage();
  const bad = [];
  pf.on('console', (m) => { if (m.type() === 'error' && !/favicon/.test(m.text())) bad.push(m.text()); });
  pf.on('pageerror', (e) => bad.push(e.message));
  await pf.goto(BASE);
  const ids = fs.readdirSync('src/content/courses/films').filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5));
  for (const id of ids) {
    for (const [theme, lang, extra] of [['light', 'nl', '&level=2&muted=1'], ['dark', 'en', '&level=3'], ['dark', 'nl', '&motion=reduce'], ['light', 'en', '&motion=reduce&scene=5']]) {
      const before = bad.length;
      const where = `${id} ${theme} ${lang}${extra}`;
      await pf.evaluate((src) => { document.body.innerHTML = `<iframe sandbox="allow-scripts" width="390" height="700" src="${src}"></iframe>`; }, `src/content/courses/films/${id}.html?theme=${theme}&lang=${lang}${extra}`);
      const fr = pf.frameLocator('iframe');
      await fr.locator('.fp-poster-go').click({ timeout: 5000 });
      await pf.waitForTimeout(400);
      const data = JSON.parse(await fr.locator('#film-data').textContent());
      const caption = async () => (await fr.locator('.fp-cap').innerText()).trim();
      if (!(await caption())) bad.push(`${where}: caption empty after play`);
      // the last scene, then the end and replay
      await fr.locator('[data-act="scenes"]').click();
      await fr.locator('.fp-item').last().click();
      await pf.waitForTimeout(300);
      const n = await fr.locator('html').getAttribute('data-scene');
      if (n !== String(data.scenes.length)) bad.push(`${where}: last scene shows ${n}`);
      if (!(await caption())) bad.push(`${where}: caption empty in the last scene`);
      if (lang === 'en') {
        const dutch = data.scenes.flatMap((s) => s.terms).filter((t) => t.nl.toLowerCase() !== t.en.toLowerCase()).map((t) => t.nl.toLowerCase());
        for (let i = 0; i < data.scenes.length; i++) {
          await fr.locator('[data-act="scenes"]').click();
          await fr.locator('.fp-item').nth(i).click();
          await pf.waitForTimeout(120);
          const text = (await caption()).toLowerCase();
          const hit = dutch.find((w) => new RegExp(`(^|[^\\p{L}-])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^\\p{L}-])`, 'u').test(text));
          if (hit) bad.push(`${where}: Dutch "${hit}" in the English caption of scene ${i + 1}`);
        }
      }
      if (extra.includes('muted')) {
        // muted, the clock runs freely: to the end, the end card, replay
        await fr.locator('.fp-range').evaluate((r) => { r.value = r.max; r.dispatchEvent(new Event('input')); });
        const ds = await fr.locator('.fp').evaluate((m) => ({ ...m.dataset }));
        if (ds.ended !== '1' && ds.playing !== '1') await fr.locator('[data-act="play"]').click();
        await fr.locator('.fp[data-ended="1"]').waitFor({ state: 'attached', timeout: 3000 });
        await fr.locator('.fp-again').click();
        await pf.waitForTimeout(300);
        if ((await fr.locator('html').getAttribute('data-scene')) !== '1') bad.push(`${where}: replay did not start at scene 1`);
      } else if (extra.includes('reduce') && !(await fr.locator('[data-act="next"]').isVisible())) bad.push(`${where}: reduced motion has no Next button`);
      if (bad.length > before) bad.splice(before, bad.length - before, `${where}: ${bad.slice(before).join(' | ').slice(0, 300)}`);
    }
  }
  await cf.close();
  if (bad.length) throw new Error(bad.join('\n'));
});

await step('listen back: ask once, rounds kept, Terugluisteren plays at 1.25x, checklist, rating, one point for the next round', async () => {
  await page.goto(BASE);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('spraakwater:v1'));
    window.name = JSON.stringify({ lbLang: st.settings.lang }); // put back at the end
    st.settings = { ...st.settings, record: false, mode: 'speak', lang: 'nl' };
    st.ui = { ...st.ui, recordAsked: false, nextModifier: null };
    localStorage.setItem('spraakwater:v1', JSON.stringify(st));
  });
  await page.reload();
  await page.evaluate(async () => {
    await new Promise((res) => { const r = indexedDB.deleteDatabase('vantage-recordings'); r.onsuccess = r.onerror = r.onblocked = () => res(); });
    // Fake mic and MediaRecorder: each recording is one second of real (silent) WAV, so it plays.
    const wav = () => {
      const rate = 8000; const n = rate; const buf = new ArrayBuffer(44 + n * 2); const v = new DataView(buf);
      const str = (o, x) => { for (let i = 0; i < x.length; i++) v.setUint8(o + i, x.charCodeAt(i)); };
      str(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); str(8, 'WAVE'); str(12, 'fmt '); v.setUint32(16, 16, true);
      v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true);
      v.setUint16(32, 2, true); v.setUint16(34, 16, true); str(36, 'data'); v.setUint32(40, n * 2, true);
      return new Blob([buf], { type: 'audio/wav' });
    };
    window.__mr = { starts: 0, stops: 0 };
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia: async () => ({ getTracks: () => [{ stop() {} }] }) } });
    window.MediaRecorder = class {
      constructor() { this.state = 'inactive'; this.mimeType = 'audio/wav'; }
      start() { this.state = 'recording'; window.__mr.starts += 1; }
      stop() {
        this.state = 'inactive'; window.__mr.stops += 1;
        setTimeout(() => { if (this.ondataavailable) this.ondataavailable({ data: wav() }); if (this.onstop) this.onstop(); }, 20);
      }
    };
  });
  const round = async (rate) => {
    await page.evaluate(async () => {
      const { makePrompt } = await import('./src/core/lesson.js');
      const { default: nl } = await import('./src/content/prompts.nl.js');
      window.__lbPrompt = window.__lbPrompt || makePrompt('minute', nl, Math.random, {});
      window.__app.session = null;
      window.__app.go('round', { prompt: window.__lbPrompt, modifier: null, timing: { prepS: 0, answerS: 22, questions: 1 } });
    });
    await page.getByRole('button', { name: 'Start' }).click();
    await page.waitForTimeout(1300);
    await page.getByRole('button', { name: 'Klaar' }).click();
    await page.locator('.stats').first().waitFor({ timeout: 8000 });
    if (rate) await page.locator('.rate-btn').nth(rate - 1).click();
  };
  // 1. Recording is off: the feedback asks once, with the Android caveat.
  await round(4);
  await page.locator('.record-ask', { hasText: 'Android' }).waitFor({ timeout: 3000 });
  await page.locator('.record-ask').scrollIntoViewIfNeeded();
  await shot('80-listen-ask');
  await page.getByRole('button', { name: 'Ja, opnemen' }).click();
  await page.locator('.record-ask', { hasText: 'Opnemen staat aan' }).waitFor();
  await page.getByRole('button', { name: 'Volgende' }).click();
  // 2. Two recorded rounds on the same prompt; no second question.
  for (const r of [4, 4]) {
    await round(r);
    if (await page.locator('.record-ask').count()) throw new Error('asked twice');
    await page.locator('audio').waitFor({ state: 'attached', timeout: 3000 });
    await page.getByRole('button', { name: 'Volgende' }).click();
    await page.locator('.btn-hero').waitFor();
  }
  const mr = await page.evaluate(() => window.__mr);
  if (mr.starts !== 2 || mr.stops !== 2) throw new Error(`recorder ${JSON.stringify(mr)}`);
  // 3. Terugluisteren from the Spreken home: grouped by exercise, newest first.
  await page.locator('.lb-entry', { hasText: '2 opnames' }).waitFor({ timeout: 3000 });
  await page.locator('.lb-entry').click();
  await page.locator('.lb-group .lb-item').nth(1).waitFor({ timeout: 3000 });
  if ((await page.locator('.lb-group').count()) !== 1) throw new Error('expected one exercise group');
  if ((await page.locator('main .btn-primary').count()) !== 1) throw new Error('one primary on the list');
  await page.locator('.lb-item .lb-play').first().click();
  await page.locator('.lb-item .lb-speed button', { hasText: '1,25×' }).click();
  await page.waitForFunction(() => { const a = document.querySelector('.lb-item audio'); return a && a.currentTime > 0 && a.playbackRate === 1.25; }, null, { timeout: 4000 });
  await shot('81-listen-list');
  // 4. The exercise: listen, the checklist, rate after listening, one point.
  await page.locator('.lb-start').click();
  await page.locator('.lb-checks').waitFor();
  if (!(await page.locator('.lb-after').isHidden())) throw new Error('rating after listening shown before listening');
  if ((await page.locator('.lb-check').count()) !== 5) throw new Error('checklist needs five points');
  await page.locator('.lb-listen .lb-speed button', { hasText: '1,25×' }).click();
  await page.locator('.lb-listen audio').evaluate((a) => a.play());
  await page.locator('.lb-after').waitFor({ state: 'visible', timeout: 4000 });
  await page.locator('.lb-check', { hasText: 'Opening in één zin' }).locator('input').check();
  await page.locator('.lb-check', { hasText: 'Rustig tempo' }).locator('input').check();
  await page.locator('.lb-after .rate-btn').nth(2).click();
  await page.locator('.lb-gap', { hasText: 'te hoog' }).waitFor();
  await page.locator('.lb-fix button.on', { hasText: 'Weinig stopwoorden' }).waitFor();
  await page.locator('.lb-compare .lb-col').nth(1).waitFor();
  if (!(await page.locator('.lb-compare mark').count())) throw new Error('fillers not marked in the transcripts');
  if ((await page.locator('main .btn-primary').count()) !== 1) throw new Error('one primary in the exercise');
  await page.locator('.toast').waitFor({ state: 'detached', timeout: 6000 }).catch(() => {});
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot('82-listen-exercise');
  await page.locator('.lb-compare').scrollIntoViewIfNeeded();
  await shot('83-listen-compare');
  await page.evaluate(() => { window.__app.updateSettings({ theme: 'dark' }); window.scrollTo(0, 0); });
  await shot('84-listen-exercise-dark');
  await page.locator('.lb-save').click();
  await page.locator('.lb-item', { hasText: 'teruggeluisterd' }).waitFor({ timeout: 3000 });
  await page.locator('.toast').waitFor({ state: 'detached', timeout: 6000 }).catch(() => {});
  await shot('85-listen-list-dark');
  await page.evaluate(() => { window.__app.updateSettings({ theme: 'auto' }); });
  const st = await page.evaluate(() => JSON.parse(localStorage.getItem('spraakwater:v1')));
  const listened = st.history.find((e) => e.listen);
  if (!listened || listened.listen.before !== 4 || listened.listen.after !== 3) throw new Error(`listen not in history: ${JSON.stringify(listened && listened.listen)}`);
  if (!st.ui.nextModifier || st.ui.nextModifier.id !== 'noFillers') throw new Error(`next modifier ${JSON.stringify(st.ui.nextModifier)}`);
  // 5. The point becomes the next round's modifier, once; the gap shows on Progress.
  await page.evaluate(() => window.__app.startDrill('minute'));
  await page.locator('.modifier-chip', { hasText: 'Geen stopwoorden' }).waitFor({ timeout: 3000 });
  await page.locator('.modifier-chip .mod-from').waitFor();
  await page.evaluate(() => window.__app.go('progress'));
  await page.locator('.listen-calib', { hasText: 'Na het terugluisteren' }).waitFor({ timeout: 3000 });
  // 6. Delete all from Settings.
  await page.evaluate(() => window.__app.go('settings'));
  page.once('dialog', (d) => d.accept());
  await page.locator('.rec-clear', { hasText: '(2)' }).click();
  await page.locator('.rec-clear').waitFor({ state: 'detached', timeout: 3000 });
  const left = await page.evaluate(async () => (await (await import('./src/core/recordings.js')).recordings().list()).length);
  if (left !== 0) throw new Error(`${left} recordings left`);
  await page.evaluate(() => {
    window.__app.setState({ ...window.__app.state, ui: { ...window.__app.state.ui, nextModifier: null } });
    let lang = 'nl';
    try { lang = JSON.parse(window.name).lbLang || 'nl'; } catch { /* default */ }
    window.name = '';
    window.__app.updateSettings({ record: false, lang });
  });
});

await step('offline after first load', async () => {
  await page.goto(BASE);
  await page.waitForFunction(() => navigator.serviceWorker.controller || navigator.serviceWorker.ready, null, { timeout: 5000 });
  await page.waitForTimeout(800);
  await ctx.setOffline(true);
  await page.reload();
  await page.locator('.btn-hero').waitFor({ timeout: 5000 });
  // Every screen works offline (all modules come from the service worker cache).
  for (const screen of ['progress', 'settings', 'realweek', 'weekly', 'glossary']) {
    await page.evaluate((sc) => window.__app.go(sc), screen);
    await page.locator(`main.screen.${screen}`).waitFor({ timeout: 5000 });
  }
  await page.evaluate(() => window.__app.go('lesson', { subject: 'eng', moduleId: 'eng.flow', lessonId: 'eng.flow.oee' }));
  await page.locator('.pre-card').waitFor({ timeout: 5000 });
  // The explainer film plays offline too. A sandboxed frame's own navigation
  // skips the service worker, so the button must not lead to an empty frame.
  await page.evaluate(() => window.__app.go('lesson', { subject: 'eng', moduleId: 'eng.machining', lessonId: 'eng.machining.cutting' }));
  await page.locator('.pre-card .opt').first().click();
  await page.locator('.lesson > .pre-next').click();
  await page.locator('.teach-card .film-btn').click({ timeout: 5000 });
  await page.frameLocator('.film-frame').locator('.fp-poster-go').waitFor({ timeout: 5000 });
  await page.evaluate(() => window.__app.go('home'));
  await page.locator('.drill-frame').click();
  await page.locator('.intro-card').waitFor({ timeout: 5000 });
  await ctx.setOffline(false);
});

await browser.close();
server.kill();
if (errors.length) { console.log('\nERRORS:\n' + errors.join('\n')); process.exit(1); }
console.log('\nall good');

# Spraakwater v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** An installable PWA where Merijn practises improvised speaking in daily 3-round lessons, with local metrics and an optional Claude coach.

**Architecture:** A static site of vanilla ES modules with no build step. Pure logic lives in `src/core/*`, tested with `node --test`. The DOM screens live in `src/ui/*`. The Anthropic SDK is lazy-loaded in the browser from esm.sh, so node tests never touch it.

**Tech Stack:** HTML/CSS/JS (ES2022 modules), Web Speech API, MediaRecorder, `@anthropic-ai/sdk@0.133.0` via `https://esm.sh/@anthropic-ai/sdk@0.133.0`, Node 22 test runner, Playwright (Chromium at `/opt/pw-browsers`) for manual end-to-end checks.

**Spec:** `docs/superpowers/specs/2026-10-23-improv-trainer-design.md`

## Global Constraints

- No build step. `index.html` must work served from any static host, including a sub-path (GitHub Pages `/words-and-improvising/`), so all paths are relative.
- Languages: `en` and `nl`. Every prompt and UI string exists in both.
- Storage key `spraakwater:v1`. Corrupt data is backed up to `spraakwater:corrupt:<ts>`. History is capped at 200.
- Drill ids: `minute`, `explain`, `prep`, `bridge`, `smalltalk`, `rapid`.
- Drill level 1–5. Prep seconds by level: `[15,10,6,3,0]`. Answer seconds by level: `[30,45,60,75,90]`. `rapid` uses 5 questions × 10s at every level, with prep `0`.
- Coach model default `claude-opus-5-5`, `output_config.effort: "low"`, `fallbacks: "default"` with beta `server-side-fallback-2026-07-01`, and JSON schema output. A Haiku 5.5 option lives in settings.
- Audio recording is off by default.

## Review Focus

1. Empty or near-empty transcript (silence, mic blocked) → metrics return zeros with no NaN, no XP awarded, and a retry offered. → Task 2 test `empty transcript`.
2. Android speech restarts duplicating text → final segments are stitched once, and interim results are never committed. → Task 7 `stitchResults` test.
3. Multi-word fillers ("zeg maar", "you know") and case/punctuation → they count correctly and are not double-counted with "you". → Task 2 tests.
4. Streak across days, local time, skipped days → it continues on consecutive local days, resets after a gap, and is idempotent on the same day. → Task 3 tests.
5. Corrupt or old localStorage → the app still boots with defaults and backs up the bad blob. → Task 5 test.

---

### Task 1: Scaffold

**Files:** Create `package.json` (`"type":"module"`, script `"test": "node --test tests/"`), `.gitignore` (`node_modules`, `.DS_Store`), `README.md` (what it is, how to run, how to install on Android).

- [ ] `npm test` runs (no tests yet → passes). Commit.

### Task 2: metrics.js

**Files:** `src/core/metrics.js`, `tests/metrics.test.js`

**Produces:** `analyze(text: string, durationS: number, lang: 'en'|'nl') -> {words:number, wpm:number, fillers:{[word]:count}, fillerCount:number, fillerRate:number /*per minute*/, uniqueRatio:number}` and `FILLERS: {en:string[], nl:string[]}`.

Fillers: en `um, uh, uhm, erm, er, like, you know, basically, actually, so, i mean, kind of, sort of, literally, right`; nl `eh, euh, ehm, uhm, uh, dus, eigenlijk, zeg maar, gewoon, nou, ofzo, weet je, als het ware, echt, toch`. Matching is case-insensitive on word boundaries, and multi-word phrases are counted first and removed before single words.

- [ ] Tests: `"Um so I think, you know, it's like fine"` (en) → fillers `{um:1, so:1, 'you know':1, like:1}`, words 9. `'' , 30` → all zeros, `wpm 0`, `fillerRate 0`. `durationS 0` → `wpm 0` (no Infinity). `"Zeg maar, eh, dat is gewoon zo"` (nl) → `{'zeg maar':1, eh:1, gewoon:1}`. 120 words in 60s → `wpm 120`.
- [ ] Fail → implement → pass → commit.

### Task 3: progress.js

**Files:** `src/core/progress.js`, `tests/progress.test.js`

**Produces:**
- `dayKey(date: Date) -> 'YYYY-MM-DD'` in local time
- `updateStreak(streak:{count,lastDay}, today:string) -> {count,lastDay}`
- `xpForRound({metrics, durationS, targetS, rating}) -> number`
- `levelFromXp(xp) -> {level, into, needed}`
- `adjustDrillLevel(level, rating) -> number`
- `drillTiming(drill, level) -> {prepS, answerS, questions}`

XP: base 10 + `min(10, round(10*durationS/targetS))` + 5 if fillerRate < 3 + 5 if rating ≥ 4. If `metrics.words < 5`, the round earns 0. Level n needs `100*n` XP to reach n+1, and the level starts at 1. Drill level goes +1 if rating ≥ 4, −1 if rating ≤ 2, clamped to [1,5].

- [ ] Tests: streak same day → unchanged. Next day → +1. Gap of 2 → reset to 1. From `{0,null}` → 1. xp with `words:3` → 0. Full marks → 30. `levelFromXp(0)` → `{level:1,into:0,needed:100}`. `levelFromXp(250)` → `{level:2,into:150,needed:200}`. Adjust clamps at 1 and 5. `drillTiming('rapid',3)` → `{prepS:0,answerS:10,questions:5}`.
- [ ] Fail → implement → pass → commit.

### Task 4: content + lesson.js

**Files:** `src/content/prompts.en.js`, `src/content/prompts.nl.js`, `src/core/lesson.js`, `tests/lesson.test.js`

Content shape (each file `export default`):
`{topics:[{id,text}], concepts:[{id,text}], audiences:[{id,text}], opinions:[{id,text}], scenarios:[{id,setting,opener}], words:[string], rapid:[{id,text}]}`. Each list has ≥ 25 items (words ≥ 80). Mix everyday, work/Lean, and team-captain contexts.

**Produces:** `makePrompt(drill, content, rng, seen) -> {id, drill, title, body, extra?}` and `buildLesson(content, drillLevels, rng, seen, n=3) -> Prompt[]`. The lesson has n distinct drills. Prompts prefer ids not in `seen` (oldest seen first when everything has been used). `rng` is a `() => number` for determinism. `explain` combines a concept and an audience. `bridge` = topic + 3 distinct words in `extra.words`. `rapid` = 5 distinct questions in `extra.questions`.

- [ ] Tests (with a seeded rng): the lesson has 3 distinct drills. `bridge` has 3 distinct words. `rapid` has 5 distinct questions. Unseen is preferred: when every id but one is in `seen`, that one is picked. Both language files have the same keys and ≥ 25 items per list.
- [ ] Fail → implement → pass → commit.

### Task 5: storage.js

**Files:** `src/core/storage.js`, `tests/storage.test.js`

**Produces:** `defaultState() -> State`, `load(backend) -> State`, `save(backend, state)`, `addHistory(state, entry) -> State` (capped at 200, newest first). `backend` is `{getItem,setItem}` (localStorage or a fake). Default settings: `{lang:'nl', mode:'speak', apiKey:'', model:'claude-opus-5-5', record:false}`.

- [ ] Tests: missing → defaults. Invalid JSON → defaults, and the original is copied to a key starting `spraakwater:corrupt:`. Partial state → merged with defaults (new settings keys appear). 205 adds → length 200, newest first.
- [ ] Fail → implement → pass → commit.

### Task 6: coach.js

**Files:** `src/core/coach.js`, `tests/coach.test.js`

**Produces:**
- `COACH_SCHEMA` (JSON schema: `scores{clarity,structure,fluency,vocabulary}` integers 1–5, `strength`, `improvement`, `stronger_version`, `overall` 1–5. Every object has `additionalProperties:false` and all keys required.)
- `buildCoachRequest({prompt, transcript, lang, drill, durationS, metrics, model}) -> params`
- `parseCoachResponse(message) -> {ok:true, data} | {ok:false, error}`
- `runCoach(apiKey, args, loadSdk = defaultLoadSdk) -> Promise<result>`

The request uses `client.beta.messages.create` with `betas:['server-side-fallback-2026-07-01']`, `fallbacks:'default'`, `output_config:{effort:'low', format:{type:'json_schema', schema:COACH_SCHEMA}}`, and `max_tokens: 4000`. The system prompt: a warm, direct speaking coach, feedback in `lang`, judging the transcript as improvised speech (speech-to-text noise expected), with the stronger version kept to roughly the same length. The parser handles `stop_reason:'refusal'` → an error, a missing text block → an error, and bad JSON → an error. Errors map 401 → "API key invalid", 429 → "rate limited", network → "offline".

- [ ] Tests: the request has the model, betas, schema, and transcript in the user content. Parse valid → `ok`. Refusal → `ok:false`. Garbage text → `ok:false`. `runCoach` with a fake SDK whose create throws `{status:401}` → the error message mentions the key.
- [ ] Fail → implement → pass → commit.

### Task 7: speech.js + recorder.js

**Files:** `src/core/speech.js`, `src/core/recorder.js`, `tests/speech.test.js`

**Produces:**
- `stitchResults(committed:string, event) -> {committed, interim}`: the pure helper. Final results are appended once per `resultIndex`, interim results are returned separately.
- `createRecognizer({lang, onText(full, interim), onError(code)}) -> {start(), stop(), supported:boolean}`. It auto-restarts on `onend` while active. Lang `nl-NL` or `en-US`.
- `createRecorder() -> {start(stream?), stop() -> Promise<Blob|null>, supported}`.

- [ ] Test: two result events with overlapping indices → committed text has no duplicates. An interim-only event leaves committed unchanged.
- [ ] Fail → implement → pass → commit.

### Task 8: UI

**Files:** `index.html`, `styles.css`, `src/app.js`, `src/i18n.js`, `src/ui/home.js`, `src/ui/round.js`, `src/ui/feedback.js`, `src/ui/progress.js`, `src/ui/settings.js`, `src/ui/dom.js` (tiny `h(tag, attrs, ...children)` helper)

- `app.js`: holds state, `go(screen, params)`, persists after each change.
- Home: streak flame + 7-day strip, XP bar and level, a big "Start today's lesson" button, a drill grid for free practice, and a speak/type toggle.
- Round: prompt card, prep countdown (skippable), answer countdown with progress ring, live transcript (or a textarea), and a "Done" button to finish early. Rapid steps through its questions.
- Feedback: metrics chips (words, wpm, fillers/min, top fillers), the transcript with fillers highlighted, audio player when recorded, a 1–5 self-rating, a coach card (loading/error/result), and Next.
- Progress: totals, a fillers/min sparkline (inline SVG) over the last 20 rounds, per-drill levels, and history.
- Settings: language, default mode, API key (password field, stored locally), model select, record toggle, and export/reset data.
- [ ] Manual end-to-end in Playwright with a fake `SpeechRecognition` injected: complete a lesson of 3 rounds, check the XP/streak update, and check the settings persist after reload. Commit.

### Task 9: PWA + deploy

**Files:** `manifest.webmanifest`, `sw.js`, `icons/icon.svg`, `icons/icon-192.png`, `icons/icon-512.png`, `icons/maskable-512.png`, `.github/workflows/pages.yml`

- The service worker precaches the app shell list (versioned `CACHE = 'spraakwater-v1'`), serves cache-first for same-origin requests, and passes everything else to the network.
- The workflow deploys the repo root to GitHub Pages on push to `main`, plus `workflow_dispatch`. Tests run first.
- [ ] Lighthouse-style check: the manifest loads, the service worker registers, and the app works offline in Playwright. Commit, push, open the PR.

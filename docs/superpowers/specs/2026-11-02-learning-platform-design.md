# Learning platform: engineering and project courses — design

Agreed 2026-11-02 with Merijn. Spraakwater grows from a speaking trainer into a learning platform with three subjects: **Spreken** (as is), **Engineering** and **Projecten**. The speaking subject keeps working exactly as today; the two courses are new.

## Name and brand (added 2026-11-02)

The platform is renamed **Vantage Point** and adopts Merijn's Vantage design system (`anthropic-skills:vantage-design`) in full:

- Tokens, fonts (Fraunces, Inter, JetBrains Mono; self-hosted woff2) and the Vantage mark, copied into the repo, never redrawn. Header shows the mark plus a Fraunces wordmark; title, manifest name and short name are "Vantage Point"; home-screen icons are rendered from the mark.
- Two themes: light (beige canvas `#E8DFCA`) and dark (deep green `#0B291B` canvas, bone text), plus Auto following the system. Existing colour themes are retired and map to Auto. No third background colour.
- No emoji anywhere (UI, strings, toasts). Icons: a fine-lined set (Lucide, ISC licence), self-hosted as inline SVG, flagged as a substitution because the design system defines none. No magnifier, lightbulb or up-and-right arrow icons.
- Flat and fine-lined: radii 3–10 px, hairline borders, subtle shadows, no gradients, no coloured left-border cards. Accent petrol `#276F81`; semantics success `#265C40`, warning `#A87433` (text `#6E4A1C`), danger `#7E3128`. Gold and coral never used.
- Motion decelerates into place (motion tokens); no confetti, bounces or springs; all zeroed under reduced motion.
- Copy: sentence case, calm, no exclamation marks, no buzzwords. XP and streak stay as quiet mono labels.
- The storage key stays `spraakwater:v1` so nobody loses progress; the service-worker cache name changes to `vantage-point-v*` and the old caches are deleted on activate.
- Interactive figures use the Vantage palette in both themes.

## Minimal, instantly clear UX (added 2026-11-02, binding)

The app must be easy to navigate and understood at first sight, by Merijn and by anyone he shows it to.

- **One primary action per screen.** Each screen has exactly one filled (primary) button; everything else is secondary or behind a disclosure.
- **Home answers one question: "what do I do now?"** Above the fold: the subject bar, the Today card (one next thing, with its reason), and at most one secondary card. Everything else (all drills, quick round, reviews, boss, targeted practice, conversation, real week, quests, situation finder, programme) moves behind a single "More practice" disclosure, grouped and labelled.
- **Course home:** Today card, the due card only when something is due, then the module list (collapsed), glossary at the bottom. Nothing else.
- **Lessons show where you are:** a step indicator (Guess · Read · Example · Check) at the top, one button per step, always a visible way out.
- **Settings grouped** into Language, Coach and API key, Practice, Appearance, Data. Rarely used options sit below the fold.
- **Plain labels over clever ones;** no icon without a text label, except close and back.
- **First run:** three short screens (what the three subjects are, how a day works, where Settings and the key live), skippable.
- **Verification:** a fresh "first-time user" subagent looks only at the screenshots and must find how to (1) start today’s practice, (2) open an engineering lesson, (3) see progress, (4) add the API key, (5) switch language, each in one or two taps; any miss is a finding to fix.

## Purpose

- **Engineering** (manufacturing, process engineering, and the electricity grid): understand what engineering teams talk about, follow a gemba walk, ask a real question at the machine. Fundamentals to expert.
- **Projecten** (project management plus consulting and leadership craft): Merijn's own job. Methods, what to focus on, and the people side: handling resistance, influencing without authority, difficult conversations, and what to do when you don't know what to do. Fundamentals to expert. **Not** Lean, Kata or A3: he has other platforms for those.

Success: in a few weeks he follows an engineering meeting without losing the thread, and he has a repertoire he can name when a project gets stuck.

## Constraints (unchanged)

Vanilla ES modules, no build step, no backend. Everything works without an API key. Dutch and English in parity. One localStorage blob `spraakwater:v1`, merged with `defaultState()`; new keys need defaults, coercion in `load()` and a storage test. `sw.js` stays a classic script; bump `CACHE` and list every new `src/` file in `SHELL`. No `null`/`undefined`/`NaN` rendered. No straight apostrophes inside single-quoted strings. Free text as text nodes only. Mobile-first, same look and feel. No new reward layers: courses feed the existing XP and streak, nothing else. Branch `claude/improvisation-practice-game-voon91` only; never merge PR #1.

## How he learns (the three modes)

- **A. Read, then recall**: short lessons with recall questions that come back on a schedule. The spine for fundamentals.
- **B. Situations first**: a scene from his work, he answers, then the concept is taught against his answer. Unlocked per lesson once it is passed.
- **C. Talk it out**: a 60-second speaking round that explains the concept. Reuses the round engine. Unlocked with B.

## Content model

Tree: **subject → track → module → lesson**. Ids are stable, identical in en and nl; progress hangs on them.

- **Engineering tracks**: `basics` (capacity and flow, quality, maintenance, safety, reading drawings and P&IDs, process control), `discrete` (machining, welding and joining, injection moulding, assembly and lines, tooling and fixtures, automation and robots), `grid` (grid structure, transformers, cables and connections, switchgear and protection, outages and switching, asset management, energy transition workload).
- **Projecten track** `project`, around the life of a project: `intake`, `plan`, `run`, `land`, `close`, plus `stuck` (when you don't know what to do). Each module carries both method and people skills for that phase.

Module fields: `id`, `track`, `level` (1 fundamentals, 2 working knowledge, 3 advanced, 4 expert), `title`, `blurb`, `lessons[]`. Modules of a higher level are *recommended* after the lower level in the same track is owned; never hard-locked.

Lesson fields (per language file; `figure` is optional and shared by both languages):

```js
{
  id: 'eng.basics.oee',           // subject.module.slug, stable
  title: 'OEE: one number, three losses',
  pre: [ { q, options[4], answer, why } ],      // 1–2 prequestions, asked before reading
  teach: [ 'block', 'block', ... ],             // 3–5 plain-text blocks, ≤ 90 words each
  example: { kind: 'worked' | 'faded', text, ask?: 'what next?' prompt for faded, reveal },
  said: 'What engineers say: "…"',             // one line, how it sounds in the room
  recall: [ { q, options[4], answer, why } ],   // 3–5, multiple choice or numeric with tolerance { q, number, tolerance, unit, why }
  situation: { scene, ask, model, rubric: [3 strings] },
  sayIt: 'Explain OEE to a new operator in 60 seconds.',
  terms: [ { term, def } ],                      // 2–4
  figure: 'eng.flow.oee',                        // optional: id of a figure page
}
```

Levels 1–2 use `example.kind: 'worked'`; levels 3–4 use `'faded'` (he answers "what next?" before the reveal). Files live in `src/content/courses/<subject>/<module>.<lang>.js`, one module per file, loaded with dynamic `import()` when a module is opened or its questions are due; the service worker precaches them all. A small index `src/content/courses/index.js` lists subjects, tracks, modules (id, track, level, title keys, lesson ids) without lesson bodies, so the course home renders without loading content.

## Figures (visual learning)

Added 2026-11-02 at Merijn's request. Key lessons get an interactive isometric figure built with the anatomy skill: a recognisable machine whose moving parts are the concept, with a live readout driven by a small true model (e.g. a line whose bottleneck station sets the output; an OEE gauge fed by three loss dials; a transformer with turns ratio and load; a protection relay that trips on a fault current).

- Each figure is a standalone HTML page at `src/content/courses/figures/<figureId>.html` (kit and live script inlined, no network), built during development by `figures/<figureId>/build.mjs` (not shipped). Both themes: the page reads `?theme=light|dark`.
- The lesson screen shows it under the teach blocks in a sandboxed `iframe` (`sandbox="allow-scripts"`, `loading="lazy"`, fixed aspect ratio, title from i18n), with a caption from the lesson. If the page fails to load, the lesson works without it.
- Launch: one figure per engineering module, on its key concept. Projecten modules get a figure only when a physical metaphor truly teaches; never boxes and arrows.
- The validator checks that a referenced figure file exists and is in the service worker shell.

## Learning engine (evidence-based decisions)

1. **Pretest first.** 1–2 specific prequestions open every lesson, before the teach blocks. Guessing wrong is expected (specific prequestions: g ≈ 0.54, 2024 meta-analysis).
2. **Worked examples that fade.** Full worked example at levels 1–2; at 3–4 the example asks "what would you do next?" before the reveal (expertise reversal).
3. **Quiz: each question until correct once; misses return at the end.** A lesson is *read* when he reaches the end of the teach blocks and *passed* when every recall question has been answered correctly once in that quiz.
4. **Feedback at the end of the quiz.** He answers all questions, then reviews each with answer and explanation, then re-answers the misses until clean. Delayed within the session, minutes, never days.
5. **Successive relearning.** Every recall question he has seen enters a Leitner queue (boxes 1, 3, 7, 21 days). Correct → up a box; miss → box 1. A question is *owned* after three correct recalls in three separate spaced sessions (reaching box 4). Keys are `lang|questionId`, separate from the speaking queue (`courseReviews` in state).
6. **Interleave within a track.** Due sessions mix questions across modules of the same track; never across subjects. Order within a session is seeded by day.
7. **Mastery per module**: `learn` (not all lessons passed) → `practise` (all passed) → `own` (all questions owned). Owned modules shrink to one maintenance question a week and recommend the next level.
8. **Situation and say-it** unlock when the lesson is passed. Situation: typed or spoken answer, then self-rating against the 3-point rubric (0–3) and the model answer; with a key, the coach grades (JSON: points per rubric line, one sentence of what was missed). Say-it: a normal round with the drill `explain` and the lesson's `sayIt` prompt; the coach brief adds the lesson's terms.
9. **XP and streak are shared.** Lesson passed = 20 XP; due session = 10 XP plus 1 per correct answer, capped at 20; situation = 10; say-it as a normal round. A lesson passed or a due session counts as a round for the day (streak, quests "rounds today").
10. **Today card per course**, in order: ≥ 5 due questions → next unpassed lesson in the recommended module → an unlocked situation not yet done → an unlocked say-it not yet done → a maintenance question. Deterministic per day.

Progress state (`courses` in the blob):

```js
courses: {
  eng: { lessons: { [lessonId]: { read: ts, passed: ts, situation: { pts, ts } | null, sayIt: ts | null } },
         sessions: [ { day, kind: 'lesson'|'due'|'situation', correct, total, ts } ] },   // capped at 200
  pm:  { ... same ... },
},
courseReviews: { ['lang|questionId']: { box, due: 'YYYY-MM-DD', lesson, subject } },
ui.subject: 'speak' | 'eng' | 'pm',   // last chosen subject bar tab
```

Backups include these keys; `load()` coerces them like the other maps.

## Screens

- **Home**: a subject bar at the top (🎙 Spreken · ⚙️ Engineering · 📋 Projecten), remembered in `ui.subject`. Under *Spreken* the home is unchanged. Under a course: Today card (one next thing, with the reason), Due card ("6 questions · 2 min"), module map grouped by track with level and mastery badge, glossary link.
- **Lesson** (`lesson` screen): pretest → teach blocks one per card with Next → example (worked or faded) → quiz → end-of-quiz review → done card (XP, streak, buttons for the unlocked situation and say-it).
- **Due session** (`due` screen): up to 10 questions, review at the end, done card.
- **Situation** (`situation` screen): scene, ask, textarea or mic (speech-to-text reused from the round), then rubric self-rating or coach grade, model answer, done.
- **Say-it**: the existing `round` screen with the lesson prompt; feedback unchanged.
- **Glossary** (`glossary` screen): all terms of the subject's loaded modules, searchable, grouped by module.
- **Progress**: a subject tab; per course: modules owned / total per track, questions due, 14-day strip of sessions, recent situations with points.
- **Settings**: unchanged. Export/import carry the new keys.

Bottom nav stays Home · Progress · Settings. All new icon-only buttons get aria-labels from i18n. Focus moves to the screen heading on navigation, as now.

## Coach (key present; local fallback always)

- **Explain in my situation**: on a lesson, one sentence of context from him (text node only, sent only when he taps) plus the lesson's terms → a short explanation. Fallback: the teach blocks.
- **Grade my situation answer**: scene, ask, rubric and his answer → `{ points: [0|1,0|1,0|1], missed: '…' }`. Fallback: self-rating.
- **Say-it feedback**: the existing coach, brief extended with the lesson terms.

Nothing from the course text is sent except the lesson's own fields, and only on an explicit tap. The key never leaves the device.

## Content pipeline

Launch volume: engineering 12 modules (basics 4 at level 1–2, discrete 4 at level 1–3, grid 4 at level 1–3), projecten 6 modules (level 1–3), 6 lessons each, both languages. Later levels (3–4 everywhere) ship in later runs with the same pipeline.

Steps per module: (1) a module brief (lesson slugs, one line each) reviewed by Merijn for the first two modules per subject, then trusted; (2) a content subagent writes `<module>.en.js` and `<module>.nl.js` from the brief and the lesson schema; (3) validation tests run: same ids in both languages, every `answer` within `options`, numeric questions have a tolerance, block lengths, 2–4 terms, 1–2 pre, 3–5 recall, rubric has 3 lines, no `<` or `>` in text, no straight apostrophes inside single-quoted strings; (4) the module is added to the index and the SHELL; (5) e2e opens one lesson from the new module.

Natural spoken Dutch, not translated English. Terms engineers actually use (OEE, takt, CpK, FMEA, P&ID, MV/LV, protection relay, switching plan). Projecten content reflects a consultant leading improvement projects at clients, not textbook PM.

## Review focus (for the final review)

1. The speaking subject behaves exactly as before: e2e stays green with no selector changes outside the subject bar.
2. Course state survives language switches (ids shared), backups, and a module that is missing or fails to load (course home still renders; lesson shows a retry).
3. No content text is ever rendered as HTML; numeric answers never compare floats exactly.
4. Due sessions never mix subjects; a question is owned only after three spaced correct recalls.
5. Shared XP/streak: a lesson or due session counts as a round for the day, and never double-counts.

## Out of scope

Lean/Kata/A3 content, leaderboards or badges, server sync, static images, audio narration.

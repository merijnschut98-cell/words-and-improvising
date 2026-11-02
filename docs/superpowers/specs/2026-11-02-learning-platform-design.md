# Learning platform: engineering and project courses — design

Agreed 2026-11-02 with Merijn. Spraakwater grows from a speaking trainer into a learning platform with three subjects: **Spreken** (as is), **Engineering** and **Projecten**. The speaking subject keeps working exactly as today; the two courses are new.

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

Lesson fields (per language file):

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
}
```

Levels 1–2 use `example.kind: 'worked'`; levels 3–4 use `'faded'` (he answers "what next?" before the reveal). Files live in `src/content/courses/<subject>/<module>.<lang>.js`, one module per file, loaded with dynamic `import()` when a module is opened or its questions are due; the service worker precaches them all. A small index `src/content/courses/index.js` lists subjects, tracks, modules (id, track, level, title keys, lesson ids) without lesson bodies, so the course home renders without loading content.

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

Lean/Kata/A3 content, leaderboards or badges, server sync, images or diagrams in lessons (text only for now), audio narration.

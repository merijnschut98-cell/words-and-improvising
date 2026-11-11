# v16 Flair: medals, titles, celebration, guide, daily goal and the path map

Date: 2026-11-11. Status: design, waiting for Merijn's answers to the open questions at the end.
Plan: `docs/superpowers/plans/2026-11-11-v16-flair.md`.

## 1. Why, and the one rule

Merijn ticked six Duolingo-like options: medals per module, titles per subject, a celebration moment, a guide character, XP per day with a daily goal ring, and the learning path drawn as a map. He did not tick the streak flame, sound/haptics as a separate feature, weekly review or leagues.

The one rule for everything below: **flair without clutter**. Vantage is calm, precise, earned confidence. So:

- Every piece of flair is *earned* by real learning (a passed level, a perfect quiz, recall without mistakes). Nothing is bought or given for opening the app.
- At most **one big moment per screen**. When several things happen at once, the biggest one is shown large and the rest are listed as quiet lines (priority: title, then medal, then daily goal reached, then lesson passed).
- Petrol is still the only accent. No gold, no confetti, no bounce, no gradients, no exclamation marks, no emoji (all enforced by `tests/brand.test.js` already, and we keep it that way).
- Nothing is ever taken away. A medal or title once earned stays, even if content grows or a skill gets rusty.
- Nothing is gated behind flair. Medals and titles reward; they never lock content (the only gating is the v16 "next level appears after the previous one" rule, owned by another agent; the map follows it).

## 2. What already exists and is reused

| Existing | Where | Reused for |
|---|---|---|
| Global XP and `levelFromXp` | `src/core/progress.js` | XP stays one number; the daily ring is a view on it. The level badge (`.level-badge`, "Gestegen: Level n") stays on the speaking done screen. |
| XP sites: `countRound` / `applySituation` (`course.js`), `applyRound` (`round.js`), `applyQuests` (`quests.js`) | core | One new helper `creditXp` is called in these four places, so per-day XP is counted where XP is earned. |
| `days` (rounds per day), streak, freezes | `progress.js`, `storage.js` | Unchanged. The flame is not extended (not ticked). See open question Q1. |
| Module mastery learn / practise / own, level states todo / passed / owned | `course.js` `moduleMastery`, `levelState`, `topicRows` | Stop states on the map; "own" stays a separate badge, it is not a medal. |
| Drill mastery `masteryOf` and the Friday boss round | `mastery.js`, `boss.js` | Speaking titles. |
| Journey milestones (`newMilestones`) | `milestones.js` | The pattern: pure "what is newly reached" function, stored list, returned in the apply result. Medals and titles copy it. |
| Quiz engine `startQuiz` / `answerQuiz` / `continueQuiz`, `renderQuiz` | `course.js`, `ui/quiz.js` | The module check (gold medal) reuses it with a one-pass, no-hint mode. |
| WebAudio cues and `settings.sound` | `sound.js`, settings toggle | Two new cues; the existing toggle governs them. No separate sound feature. |
| Motion tokens and `vp-rise` / `vp-fade` | `brand/tokens.css`, `styles.css` | All new motion uses them; reduced motion already zeroes durations. |
| Lucide icons inline | `ui/icons.js` | Add `medal`, `flag`, `map-pin` only if needed (prefer existing `award`, `milestone`, `circle-check`). |

## 3. Feature by feature

### 3.1 Medals per module (Brons / Zilver / Goud)

A medal is a mark on a course module (eng and pm). It is a ladder: each tier needs the one before.

| Tier | nl / en | Rule (concrete) |
|---|---|---|
| Bronze | Brons / Bronze | Every level of the module passed (today: 16 of 16). Same moment the module mastery leaves "learn". |
| Silver | Zilver / Silver | Bronze, and a **perfect quiz** on at least 75% of the module's levels (rounded up: 12 of 16). A perfect quiz = every question right on the first pass, without a hint. A retake of a passed level counts (retakes give no XP but can record a perfect). |
| Gold | Goud / Gold | Silver, and the **module check** done without a mistake (see below). A perfect check done before silver is remembered; gold is awarded the moment silver arrives. |

**The module check** (Merijn's "boss round without mistakes"; working name *Modulecheck* / *Module check*, see Q3):

- Opens once the module has bronze. Shown as the last stop on the module's path (a flag) and as a quiet button under the module.
- 10 recall questions drawn from all levels of the module (seeded by day and module, so a reopen the same day gives the same set), at most 1 question per level before any level gets a second.
- One pass only: no hints, no back, no "ask again until right". The review screen at the end shows the answers, as in a lesson.
- One attempt per module per day ("Morgen kan het weer" after an attempt). This keeps it a real recall test, not a memory game.
- Counts as a round (days, streak, like a due session): 20 XP the first time it is finished, +10 XP when it is perfect for the first time; 0 XP after that. Answers feed the spaced-review boxes exactly like a due session (`scheduleCourseReview`, right-before-due never climbs).
- Needs the module file. Offline it works when the module was opened before (the service worker caches fetched module files; precached ones always work). Without the file the button says the module must load first (existing `loadError` text).

**Look.** Gold is retired, so tiers are not told apart by colour. One mark, a small round seal (24 px in a row, 56 px in a moment), told apart by *form* and always by *text*:

- Brons: hairline ring (1.5 px, `--accent`), empty centre.
- Zilver: double ring (outer hairline, inner 2 px ring).
- Goud: solid disc in `--accent-fill` with a bone check (the existing `check` icon).

The tier word is always next to the seal (mono label, uppercase, like `.level-badge`), so colour-blind and screen-reader users get the same information.

**Where it shows.** On the module row in the course home (in the meta line, after the tier pill; nothing when no medal), at the end of the module's path, on the lesson-done card in the moment it is earned, and on Progress per subject ("Medailles: 3 brons · 1 zilver · 0 goud").

Speaking has no modules and gets no medals in v16 (its titles carry the progress). See Q4.

### 3.2 Titles that grow with you, per subject

One title per subject: Engineering, Projecten, Spreken. Four ranks.

**Names.** Merijn's example is Leerling, Vakman, Specialist, Meester. "Specialist" is already a module tier label (`tier_specialist`: Instap / Verdieping / Specialist), which would confuse. Recommended ladder, the old guild ladder that fits a craft-and-Lean app:

| Rank | nl | en |
|---|---|---|
| 1 | Leerling | Apprentice |
| 2 | Gezel | Journeyman |
| 3 | Vakman | Craftsman |
| 4 | Meester | Master |

(Alternative keeping his words: Leerling, Vakman, Kenner, Meester; en Apprentice, Practitioner, Expert, Master. See Q2.)

**Rules for eng and pm** (shares of the subject's levels, so new content does not need new numbers; counts below are for today's 448 eng and 240 pm levels):

| Rank | Rule | eng today | pm today |
|---|---|---|---|
| Leerling | 1 level passed in the subject | 1 | 1 |
| Gezel | 10% of levels passed and 1 bronze medal | 45 levels | 24 levels |
| Vakman | 35% of levels passed and 2 silver medals | 157 levels | 84 levels |
| Meester | 70% of levels passed and 3 gold medals | 314 levels | 168 levels |

**Rules for speaking** (drill mastery and the boss round; the 16 drills):

| Rank | Rule |
|---|---|
| Leerling | 1 counted round |
| Gezel | 4 drills at "Oefenen" or higher, and 7 days practised |
| Vakman | 4 drills owned ("Beheerst") and 1 boss round finished |
| Meester | 10 drills owned and 3 boss rounds finished |

"Owned" uses the existing 14-day window, so it can fade; the title does not (stored once earned).

**Where it shows.** On each start-screen subject card, after the subject name ("Engineering · Gezel"); in the subject header next to the back button (small, mono); on Progress per subject with one line to the next rank ("Nog 12 niveaus en 1 zilveren medaille tot Vakman"); and as the big moment on the done card when a new rank is reached. No title before the first lesson or round.

### 3.3 XP per day and the daily goal ring

**XP per day.** Every place that adds XP also adds it to `xpDays[today]` (via `creditXp`). Quest XP counts on the day the quest finished. Retakes with 0 XP add nothing.

**Daily goal.** A goal in XP, chosen in Settings, Practice section:

| Option | nl / en | XP | Roughly |
|---|---|---|---|
| Light | Licht / Light | 20 | one lesson, or two short speaking rounds |
| Steady (default) | Normaal / Steady | 30 | a lesson and a review |
| Strong | Stevig / Strong | 50 | two lessons and a review |

**The ring.** A thin ring (40 px, 3 px stroke, `--line` track and `--accent` arc, butt line caps, fine-lined), with "18/30" in mono beside it. When the goal is reached the arc closes and a small check sits in the middle; the number reads "30/30" (no surplus number game, but XP above the goal still counts in the total).

**Where it shows.**

- Start screen: next to the "Vandaag" title, replacing the XP part of the quiet meta line (`start-meta` keeps the streak and level; see Q1 on the flame).
- Lesson-done card, due-done card and the speaking done screen: the ring fills by the XP just earned (the celebration, below).
- Progress: one row of seven small rings for the last seven days (filled, part, empty), each with an accessible label. No weekly review is added (not ticked); this row is information only.

No reminder, no penalty, no streak tied to the goal. Missing it shows nothing.

### 3.4 Celebration moment

When: a lesson (level) passed for the first time, a module check finished, the daily goal reached, a topic finished (its last visible level), a medal, a title. A retake passes quietly (no animation, the existing `lessonRetake` text "Goede opfrisser. De XP kreeg je de eerste keer.").

**What it looks like** (one composed move, at most `--motion-scene` 1400 ms, all decelerating, nothing bounces):

1. The guide (3.5) lights its three segments bottom to top, `--motion-stagger` 90 ms apart, then settles with the top segment lit (replaces the graduation-cap `.done-mark` on the lesson-done card).
2. "+20 XP" rises into place (the brand's *metrics rise* pattern, `vp-rise`, `--motion-slow`).
3. The daily ring's arc grows from the old to the new value (`stroke-dashoffset`, `--motion-slow`, `--ease-entrance`). If this closes the goal: the check fades in at the end, and one quiet line "Dagdoel gehaald" appears.
4. For a medal: the seal draws its ring (`stroke-dashoffset`, `--motion-scene`), the tier word fades in. For a title: the title card uses *title hands off* (heading fades up, the rank name follows 90 ms later).

Only the biggest moment of the screen animates (priority title > medal > goal > lesson); the others are static lines in the same card.

**Sound (optional).** Follows the existing Settings toggle "Geluid" (`settings.sound`, default on). Two new WebAudio cues in `sound.js`, no audio files:

- `lesson`: two soft notes rising (523 Hz 0.10 s, 784 Hz 0.18 s). Lesson passed, check finished, goal reached.
- `medal`: reuse the existing `best` arpeggio. Medal or title.

At most one cue per screen. No haptics (not ticked).

**Reduced motion.** `prefers-reduced-motion: reduce` already zeroes every duration in `tokens.css` and kills animations in `styles.css`. The celebration then shows its *end state* at once (segments lit, ring at the new value, seal drawn). JS must not wait on `animationend` (use the end state as the rendered default and animate *from* the old value with CSS, so no animation means the right picture). Sound is not motion and still follows the sound toggle.

**Brand checks.** New keyframes are named `vp-draw` (stroke) and `vp-light` (segment opacity); never `pop` or `confetti`. No new colours.

### 3.5 The guide (mascot)

A small character that encourages and reacts to right and wrong. Three concepts, one recommended.

**Option A (recommended): "Andon", the stack light.** A small signal tower like on every production line: a base, a short pole and three stacked round segments. In Lean, the andon is the signal to stop and ask for help when something goes wrong, so "a mistake lights the andon, and that is how we learn" is the guide's whole personality, and it is exactly Merijn's world.

- Idle: segments unlit (`--line`), housing in `--heading` hairline.
- Right: the top segment lights petrol (`--accent`) for a moment, then stays softly lit.
- Wrong: the middle segment lights ochre (`--ok`, the brand warning, never brick red: a miss is not an alarm), with one line such as "Andon aan: even stilstaan, dan verder."
- Celebrate: all three light bottom to top, then settle (3.4).
- No face, no limbs: personality lives in light and in short lines. That keeps it calm and on-brand while still reading as "a character".
- Drawing: one inline SVG (no asset file), 32 px inline beside a line, 64 px on the done card. Style: see 3.5.1.

**Option B: "Peil", the dial gauge.** A small round dial gauge (meetklok) with one needle. Right: the needle eases into a petrol band. Wrong: the needle stops short in the ochre band. Celebrate: needle sweeps full scale and settles. Ties to measuring and engineering; reads clearly; a little more "instrument" than "character", and less obvious for the projects and speaking subjects.

**Option C: "Kai", a small engineer.** A minimal line-drawn figure with a safety helmet (name from kaizen) that nods on right and scratches its helmet on wrong. The most Duolingo-like and the most expressive, but a person with gestures pulls the app towards cartoon, needs several poses (more drawing and more motion), and is the hardest to keep within "calm, precise". Not recommended.

**Why A.** It is meaningful (andon is Lean), it works the same for all three subjects, its states are pure light changes (cheap, calm, easy with reduced motion: just the end colour), and colour is never the only signal because each state also sits in a different position (top, middle, all).

#### 3.5.1 Drawing style

The course figures are already isometric (anatomy skill, at Merijn's request), so the guide should look like it belongs to them: recommend a **small isometric andon** drawn with the anatomy skill's rules (three visible faces, four-tone shading from the beige and green tints, correct painter's order, fine strokes), simplified to about a dozen solids so it stays legible at 32 px. The lit segment is the only petrol. The brand says "no 3D" for interface chrome; the figures are the accepted exception, and the guide is an illustration, not chrome. If Merijn prefers the interface flatter, a flat front-view variant (same three segments, hairline outline) is the fallback (Q5). Either way: one SVG with the segments as separate shapes whose fill comes from CSS classes (`.g-top.on`, `.g-mid.warn`), so dark and light theme come for free.

#### 3.5.2 Where it appears, and when it speaks

The guide speaks little. **At most one line per screen**, never during reading.

| Place | Guide state | Line (example) |
|---|---|---|
| Quiz review after a pass, all right | top lit | none (right answers need no praise every time) |
| Quiz review after a pass, misses | middle ochre | one wrong-line, once per quiz |
| Lesson-done card | celebrate | one done-line, or the goal line when the goal was just reached |
| Module check intro | idle | "Tien vragen, geen hints. Rustig aan." |
| Course home, goal not reached, after the first lesson of the day | idle | "Nog 12 XP tot je dagdoel." (only on the course home, under the Today card, small) |

The quiz shows right and wrong only at the review after each pass (current `renderQuiz` design), so the guide reacts there, not per tap. Lines rotate from a small pool, seeded by day, so they do not repeat in a row.

A Settings toggle "Gids tonen" / "Show guide" (default on, device-only like theme) hides the guide everywhere; the celebration then keeps the existing mark.

### 3.6 Learning path as a map

Each topic module already shows topics with four level chips. v16 turns that into a path: **levels are stops on a line**; the path runs through the topics.

**Layout (recommended): one short horizontal path per topic**, inside the open module, top to bottom by topic. It keeps the 4-level structure readable on a phone (four 44 px stops fit 320 px), changes the course home the least, and fits the depth-first order (`nextLesson` finishes one topic first).

```
Takt en lijnbalans         2/4
  (v)━━━━(v)━━━━( o )┄┄┄ +1
  Basis  Werkkennis  Gevorderd
                    Volgende
```

Stop states:

| State | Look | Tap |
|---|---|---|
| passed | solid petrol disc (`--accent`), bone `check` | opens the level (retake) |
| owned | solid disc, `check-check` | opens the level |
| next (the one open stop) | petrol ring (2 px) on the card colour, label "Volgende" under it | opens the level |
| hidden (not yet visible under the v16 rule) | not drawn as a stop | none |

Lines: between passed stops `--accent` 2 px; from the next stop on, `--line` 2 px.

**Hidden levels (the other agent's rule: a level appears only after the previous one is finished).** Recommendation: after the open stop, draw a **faint dashed stub** (`--line`, dashed) ending in a small mono count "+2" ("nog 2 niveaus"), no names, not tappable. It shows distance without showing content, so the screen stays minimal and he still knows the topic is not finished. The alternative (Q6) is to draw nothing after the open stop. When a topic is complete, the stub is replaced by a small `flag` with a check.

Topics that have not started: their first level is the open stop (if the gating agent keeps every topic's level 1 visible), else the topic row shows only its title with the stub. The map reads the visibility from the gating agent's function (contract in 3.6.1), so both changes stay consistent.

**Module end.** Under the last topic, one stop for the module: the medal seal (empty ring when no medal yet, labelled "Medaille: nog niet"), and once bronze is earned, the module check flag next to it ("Modulecheck").

**Everything else stays.** Module rows, track folding, the Today card, the continue button. The `.level-chip` buttons are replaced by `.path-stop` buttons; the e2e checks that use `.level-chip` move to `.path-stop` (see plan).

#### 3.6.1 Contract with the "visible levels" change

The map needs, per topic, a list of `{ lessonId, level, state }` where state is `passed | owned | next | hidden`. Proposed: the gating agent's `topicRows` (or a new `visibleTopicRows`) returns exactly that; if it returns only the visible levels, the map counts the hidden ones as `topic.levels.length - visible.length`. The plan's map task starts by reading what was merged and adapts; it does not re-implement gating.

## 4. Motion rules (all features)

- Durations only from tokens: `--motion-fast` hover and focus, `--motion-base` state changes (guide segment on or off), `--motion-slow` ring arc and XP rise, `--motion-scene` medal seal and the whole celebration cap.
- Easing `--ease-entrance` for everything arriving; nothing uses spring, overshoot or bounce.
- Stagger `--motion-stagger` (90 ms) for the guide's segments and for stops lighting along a finished topic.
- No looping animation anywhere (no pulsing "next" stop, no idle blinking guide).
- Reduced motion: end state at once, as in 3.4; the CSS sets the final state as the default and animates *from* the start value, so with motion off nothing is lost.
- One big moment per screen (section 1).

## 5. Accessibility

- Colour is never alone: medal tier = seal form + word; stop state = icon (check, check-check, ring) + label; guide state = segment position + line; ring = number next to it.
- Ring: `role="img"` with `aria-label` "Dagdoel: 18 van 30 XP" / "Daily goal: 18 of 30 XP". The seven-day row: one label per day.
- Stops: real `<button>`s, 44 px targets, `aria-label` from i18n: "Takt en lijnbalans, Werkkennis: behaald" (reuses `chipLabel` / `chipState_*`). The stub: `aria-label` "Nog 2 niveaus, ze verschijnen als je verder gaat"; not focusable.
- The guide SVG is `aria-hidden`; its line is plain text in the card. The celebration's summary ("Les voltooid, +20 XP, dagdoel gehaald") goes to the existing polite live region once; quiz review already says right and wrong, so guide lines there are not live.
- Contrast: graphic marks (ring arc, stop discs, seal, lit segment) at least 3:1 against card and canvas in both themes (new brand test); text stays at the existing AA rules.
- All new labels come from i18n (the `a11y.test.js` rule).

## 6. Dark and light

Only the existing CSS variables are used, so both themes follow automatically: `--accent` (petrol-500 light, petrol-300 dark) for arcs, discs and the lit segment; `--accent-fill` with `--on-primary` for the gold seal; `--line` for tracks, unlit segments and the stub; `--ok` for the guide's wrong state; `--heading` for the guide's hairline housing. No hex values in new CSS. The dark and the forced-dark blocks stay identical (existing test).

## 7. Offline

All rules are pure functions on local state; the guide is inline SVG; sounds are synthesized; nothing needs the network. The module check needs the module file, which is in the service-worker cache once fetched (or precached). New source files are added to `SHELL` in `sw.js` and `CACHE` is bumped (the existing `sw.test.js` enforces precaching every source file).

## 8. Data model (in the existing progress store)

All in the one state object of `src/core/storage.js` (key `spraakwater:v1`, unchanged), defaults in `defaultState()`, cleaned in `load()`:

| Field | Shape | Notes |
|---|---|---|
| `xpDays` | `{ 'YYYY-MM-DD': number }` | XP earned per day. Pruned to the last 60 days in `creditXp`. `load()` drops non-numbers. |
| `dailyGoal` | `{ xp: 20 or 30 or 50, ts: number }` | Synced (he wants the same goal on phone and laptop). Default `{ xp: 30, ts: 0 }`. Anything else loads as the default. |
| `courses[s].lessons[id].perfect` | `number` (ts) | First perfect quiz of that level. Set in `applyLesson` when every `firstTry` is true and every `sure` is true (no hint). |
| `courses[s].checks` | `{ [moduleId]: { last: day, best: n, total: n, perfect: ts or null } }` | Module check results. |
| `courses[s].medals` | `{ [moduleId]: { tier: 'bronze' or 'silver' or 'gold', ts } }` | Stored once earned; never lowered. |
| `titles` | `{ eng?: { rank: 1..4, ts }, pm?: ..., speak?: ... }` | Stored once earned; never lowered. |
| `settings.guide` | `boolean` (default true) | Device-only (settings never sync). |

Pure functions (new `src/core/flair.js` unless noted):

- `creditXp(state, xp, today)`: adds to `xp` *and* `xpDays[today]`, prunes old days. Used by the four XP sites instead of `xp: state.xp + n`.
- `goalProgress(state, today)` returns `{ xp, goal, done }`; `goalJustReached(before, after, today)`.
- `isPerfect(firstTry, sure)`.
- `medalFor(state, meta)` returns the tier the rules give now (or null); `newMedals(state, subject)` returns `[{ moduleId, tier }]` higher than stored.
- `titleFor(state, subject)` returns the rank now; `newTitles(state)`.
- `awardFlair(state, now)` returns `{ state, medals, titles }`: stores what is new. Called at the end of `applyLesson`, `applyCheck` and `applyRound`; their results gain `medals`, `titles` and `goalReached`, like `newMilestones` today.
- `src/core/modulecheck.js`: `checkOpen(state, meta, today)`, `checkQuestions(mod, meta, day, n = 10)`, `applyCheck(state, { subject, moduleId, results, lang }, today, now)`.

**Backfill on first load.** Perfect quizzes before v16 are not known for sure (hints were not logged per session). `load()` does not guess; `awardFlair` on the first run gives bronze where all levels are passed and the titles the data supports, *without* a celebration (a one-time quiet line on the start screen "Je hebt 2 medailles en de titel Gezel verdiend" instead of a cascade of moments). See Q7.

## 9. Sync implications

`src/core/sync.js` `mergeStates` is never an overwrite; each new field gets an explicit merge, plus tests:

| Field | Merge |
|---|---|
| `xpDays` | per day maximum (as `days`). Two devices on the same day under-count, never over-count; accepted and the same as today's day counts. |
| `dailyGoal` | the one with the later `ts`. |
| `lessons[id].perfect` | earliest defined (added to `mergeLesson`, like `passed`). |
| `checks[moduleId]` | `best` max (with its `total`), `perfect` earliest defined, `last` latest. |
| `medals[moduleId]` | the higher tier; on equal tier the earlier `ts`. |
| `titles[subject]` | the higher rank; on equal rank the earlier `ts`. |
| `settings.guide` | never synced (settings are local-only already). |

After a merge the app runs `awardFlair` quietly (no celebration for things earned on another device, just the stored marks), so a medal earned on the phone shows on the laptop. `clean()` for a remote row drops malformed medal and title entries (unknown tier, rank outside 1–4). Older app versions that do not know these keys keep them: `mergeStates` and `mergeCourses` spread the other side first, so nothing is lost when an old device syncs.

## 10. i18n strings (nl and en)

No exclamation marks, no emoji (brand test). Function strings take numbers. Keys are added to both languages (`i18n.test.js`).

| Key | nl | en |
|---|---|---|
| `medal_bronze` / `_silver` / `_gold` | Brons / Zilver / Goud | Bronze / Silver / Gold |
| `medalLabel(tier)` | `Medaille: ${tier}` | `Medal: ${tier}` |
| `medalNone` | Medaille: nog niet | Medal: not yet |
| `medalEarned(tier, module)` | `${tier} voor ${module}` | `${tier} for ${module}` |
| `medalHow_bronze` | Alle niveaus van de module gehaald | Every level of the module passed |
| `medalHow_silver(n)` | `Een foutloze quiz op ${n} niveaus` | `A perfect quiz on ${n} levels` |
| `medalHow_gold` | De modulecheck zonder fouten | The module check without a mistake |
| `medalsTitle` | Medailles | Medals |
| `medalsCount(b, s, g)` | `${b} brons · ${s} zilver · ${g} goud` | `${b} bronze · ${s} silver · ${g} gold` |
| `checkTitle` | Modulecheck | Module check |
| `checkIntro` | Tien vragen uit de hele module. Eén ronde, geen hints. | Ten questions from the whole module. One pass, no hints. |
| `checkStart` | Start de check | Start the check |
| `checkTomorrow` | Vandaag gedaan. Morgen kan het weer. | Done for today. You can try again tomorrow. |
| `checkScore(n, total)` | `${n} van ${total} goed` | `${n} of ${total} right` |
| `checkPerfect` | Foutloos | Without a mistake |
| `title_1` … `title_4` | Leerling, Gezel, Vakman, Meester | Apprentice, Journeyman, Craftsman, Master |
| `titleNew(title)` | `Nieuwe titel: ${title}` | `New title: ${title}` |
| `titleNext(levels, medals, title)` | `Nog ${levels} niveaus en ${medals} tot ${title}` | `${levels} more levels and ${medals} to ${title}` |
| `titleSoFar(n, title)` | `Je hebt ${n} medailles en de titel ${title} verdiend` | `You have earned ${n} medals and the title ${title}` |
| `goalTitle` | Dagdoel | Daily goal |
| `goalRing(x, goal)` | `Dagdoel: ${x} van ${goal} XP` | `Daily goal: ${x} of ${goal} XP` |
| `goalReached` | Dagdoel gehaald | Daily goal reached |
| `goal_20` / `_30` / `_50` | Licht (20 XP) / Normaal (30 XP) / Stevig (50 XP) | Light (20 XP) / Steady (30 XP) / Strong (50 XP) |
| `goalHelp` | Hoeveel XP je per dag wilt halen. Missen kost niets. | How much XP you want per day. Missing it costs nothing. |
| `goalWeek` | Laatste 7 dagen | Last 7 days |
| `goalLeft(n)` | `Nog ${n} XP tot je dagdoel.` | `${n} XP to your daily goal.` |
| `pathNext` | (reuse `chipNext`: Volgende) | (Next) |
| `pathMore(n)` | `Nog ${n} niveaus, ze verschijnen als je verder gaat` | `${n} more levels, they appear as you go` |
| `pathMoreShort(n)` | `+${n}` | `+${n}` |
| `pathTopicDone` | Onderwerp af | Topic done |
| `guideShow` | Gids tonen | Show guide |
| `guideHelp` | Een klein andonlicht dat meekijkt en reageert op goed en fout. | A small andon light that reacts to right and wrong. |
| `guideRight` (pool) | Klopt. · Precies. · Goed gezien. | Right. · Exactly. · Well spotted. |
| `guideWrong` (pool) | Andon aan: even stilstaan, dan verder. · Bijna. Lees de uitleg, dan blijft het hangen. · Hier leer je het meest van. | Andon on: pause, then carry on. · Close. Read the explanation and it sticks. · This is where you learn most. |
| `guideDone` (pool) | Les binnen. Mooi werk. · Weer een stap verder. · Dat zit erin. | Lesson in. Good work. · One step further. · That one is in. |
| `guideCheck` | Tien vragen, geen hints. Rustig aan. | Ten questions, no hints. Take your time. |

## 11. Out of scope

Streak flame changes, leagues, weekly review, haptics, a separate sound feature, medals for speaking, any paid or bought items, notifications about the goal.

## 12. Open questions for Merijn

1. **The flame.** You did not tick the streak flame. It already exists (start screen line, subject header, done screen). Keep it as is next to the new ring, or let the ring replace it on the start screen and keep the streak only on Progress?
2. **Title names.** Leerling, Gezel, Vakman, Meester (recommended; "Specialist" is already a module tier label), or your Leerling, Vakman, Specialist, Meester with the tier renamed? English: Apprentice, Journeyman, Craftsman, Master, or a gender-neutral set (Apprentice, Practitioner, Expert, Master)?
3. **Module check name.** "Modulecheck" (calm), "Eindbaas" (the speaking boss round's name, playful), or "Meesterproef"?
4. **Speaking medals.** Speaking has no modules. Leave it without medals (titles only), or medals per drill group (Basis, Structuur, Gesprek, Onder druk)?
5. **Guide style.** Small isometric andon matching the course figures (recommended), or a flat front-view one? And the name: "Andon", or a Dutch name?
6. **Hidden levels on the map.** Faint dashed stub with "+2" after the open stop (recommended), or nothing after the open stop?
7. **Existing progress.** On the first v16 start, award bronze medals and titles for what you already did, quietly with one summary line (recommended), or start everyone at zero?
8. **Silver strictness.** A perfect quiz on 75% of levels (12 of 16), or on every level?
9. **Default goal.** 30 XP a day (a lesson and a review)?
10. **Celebration sound.** On by default via the existing "Geluid" toggle, or off until you turn it on?

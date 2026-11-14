# v17 Big Picture First Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every subject a drawn map as its home, a few field films, an intro film per module on a module screen of its own, and a visible Andon, with Projects first.

**Architecture:** The course index gains a `FIELDS` table (groups of modules with a field film) next to the existing `intro` field. One shared map model per subject (`src/content/courses/maps/<subject>.js`, plain data: places and their coordinates) feeds both the app's inline SVG map and the film kit's closing scene, so the film and the app show one drawing. A new `module` screen becomes the home of a module; the course home leads with the map.

**Tech Stack:** Vanilla ES modules, node:test, Playwright (pre-installed), the film kit in `films/_kit`, the anatomy skill for isometric drawing.

**Spec:** `docs/superpowers/specs/2026-11-13-v17-big-picture-design.md`

## Global Constraints

- The integrator works in `/home/user/words-and-improvising` on branch `claude/improvisation-practice-game-voon91`; agents work in their own worktrees and never push.
- TDD: a failing test first for every code change.
- Every film or content piece gets a review agent before merge; a reviewed film is rendered right after its review.
- Bump `CACHE` in `sw.js` once per push; every new page, VTT and poster is in the `SHELL` list; `tests/swshell.test.js` stays green.
- Checks before every push: `npm test`, `node src/content/courses/validate.js`, `bash scripts/shellcheck.sh` (commit first: it checks HEAD).
- At most three agents at once.
- Never merge PR #1. No model names in commit message bodies. Commit trailers as given in the session.
- Films: 16:9, simple figures are fine, stage text at least 22 units, `strictFocus: true`, narration with few colons or comma-lists (in-sentence pause at most 0.4 s), at most 360 s per language.
- An intro or field film is the map, not a lesson: no calculations, numbers only where they make the picture concrete, it ends on the map.
- Andon: at most one line per screen, no face, hidden everywhere when `settings.guide === false`.
- Phone first: 390 px wide, tap targets at least 44 px, both themes, nl and en.
- No new deep-dive lesson films until the Projects and Engineering intros are done, except the two named in Task 9.

## Review Focus

- A module without an intro film (most of them, for two weeks): the module screen shows the blurb where the film would be, and Andon says nothing about a film.
- A map place whose module id no longer exists in the index, or a module missing from the map: the build fails in a test, not silently on the phone.
- Offline with the video not cached: the module screen falls back to the HTML film, then the blurb (existing `filmStep` chain), and the map still draws (inline SVG, no fetch).
- The guide turned off in Settings: no Andon on the home screen or the module screen, and no empty gap where he stood.
- A deep link or a restored session to `module` with an unknown `moduleId`: the app goes to the course home instead of a blank screen.

---

## File structure

| File | Responsibility |
|---|---|
| `src/content/courses/index.js` | `FIELDS` table; `intro` on modules (exists) |
| `src/content/courses/validate.js` | `checkFields(fields, modules)`, `checkMap(map, modules, fields)` |
| `src/content/courses/maps/pm.js`, `maps/eng.js` | Map model per subject: plain data |
| `src/ui/subjectmap.js` | Draws a map model as inline SVG with tappable places |
| `src/ui/modulescreen.js` | The module screen |
| `src/ui/coursehome.js` | Map on top; list rows link to the module screen |
| `src/ui/guide.js`, `src/ui/flairui.js` | Andon at 96 px with a line; `introSeen` light |
| `src/core/course.js` | `introSeen(state, moduleId)`, `markIntroSeen(state, moduleId)` |
| `src/core/sync.js` | Merge `seenIntros` |
| `films/_kit/build-film.mjs`, `films/_kit/assert.mjs` | Module and field films; shared map scene |
| `films/<id>/` | One folder per film |

---

### Task 1: Land the pilot module intro (pm.plan.intro)

The pilot agent was stopped mid-build. Its worktree `/home/user/words-and-improvising/.claude/worktrees/agent-a519aa50959f1214e` (branch based on 847f4a2) holds uncommitted work: `films/_kit/assert.mjs`, `films/_kit/build-film.mjs`, `tests/filmcontent.test.js`, `tests/introfilm.test.js`, `films/pm.plan.intro/`.

**Files:** as listed above, plus `src/content/courses/index.js` (add `intro: 'pm.plan.intro'`), `sw.js`, `docs/superpowers/plans/2026-11-11-v16-notes.md` (section "Module intro films (v17)").

**Interfaces:**
- Produces: `defineFilm({ module: '<module id>', ... })` in `films/_kit/build-film.mjs`, a film whose source text is the module's title, blurb, topic titles and lesson texts, and whose coverage rule is "every topic title appears in a caption or card in both languages". Produces the reusable build brief in the v16 notes.

- [ ] **Step 1:** Resume the stopped agent with SendMessage (same brief). Tell it to merge `origin/claude/improvisation-practice-game-voon91` first, and that the closing scene will later be replaced by the shared map scene of Task 3, so it should keep that scene in one function.
- [ ] **Step 2:** On its report, launch a review agent (standard film review brief, plus: check the film against the anti-goal "a deep dive in disguise"; check every existing film page rebuilds byte-identical).
- [ ] **Step 3:** Merge, bump CACHE, run the three checks, push. Expected: `npm test` all pass, including `tests/intro.test.js` now exercising a real intro.
- [ ] **Step 4:** Render (standard render brief), merge, upload, verify every manifest entry with a range GET, push.

### Task 2: Field table in the index

**Files:**
- Modify: `src/content/courses/index.js`, `src/content/courses/validate.js`
- Test: `tests/fields.test.js`

**Interfaces:**
- Produces: `export const FIELDS` in `index.js`, an array of `{ id, subject, title: { en, nl }, blurb: { en, nl }, modules: string[], film?: string }`. `id` is `<subject>.field.<slug>`; `film`, when present, equals `id`.
- Produces: `export function checkFields(fields, modules): string[]` in `validate.js`; `export const fieldOf = (moduleId, fields = FIELDS) => field | null` in `index.js`.

The Projects fields, exactly:

| id | modules |
|---|---|
| `pm.field.lifecycle` | pm.intake, pm.plan, pm.run, pm.land, pm.close |
| `pm.field.people` | pm.stuck, pm.lead, pm.negotiate, pm.outside, pm.perform |
| `pm.field.portfolio` | pm.portfolio, pm.consult |
| `pm.field.it` | pm.agile, pm.scaled, pm.devops, pm.itproject |

Titles (nl / en): "Een project van begin tot eind" / "A project from start to finish"; "Mensen en invloed" / "People and influence"; "Portfolio en advies" / "Portfolio and consulting"; "IT en agile" / "IT and agile". Engineering gets no fields yet.

- [ ] **Step 1: Write the failing tests** in `tests/fields.test.js`:

```js
test('checkFields: every pm module is in exactly one field', () => {
  assert.deepEqual(checkFields(FIELDS, MODULES), []);
  const pm = MODULES.filter((m) => m.subject === 'pm').map((m) => m.id).sort();
  assert.deepEqual(FIELDS.filter((f) => f.subject === 'pm').flatMap((f) => f.modules).sort(), pm);
});
test('checkFields: rejects an unknown module, a module in two fields, a wrong id and a film that is not the id', () => {
  const f = (extra) => [{ id: 'pm.field.x', subject: 'pm', title: { en: 'X', nl: 'X' }, blurb: { en: 'b', nl: 'b' }, modules: ['pm.plan'], ...extra }];
  assert.equal(checkFields(f({ modules: ['pm.nope'] }), MODULES).length, 1);
  assert.equal(checkFields([...f(), ...f({ id: 'pm.field.y' })], MODULES).length, 1);
  assert.equal(checkFields(f({ id: 'pm.x' }), MODULES).length, 1);
  assert.equal(checkFields(f({ film: 'pm.field.other' }), MODULES).length, 1);
});
test('fieldOf finds the field of a module, or null', () => {
  assert.equal(fieldOf('pm.plan').id, 'pm.field.lifecycle');
  assert.equal(fieldOf('eng.flow'), null);
});
```

A subject with at least one field must have all its modules covered; a subject with none is fine.

- [ ] **Step 2:** Run `node --test tests/fields.test.js`. Expected: FAIL, `FIELDS` not exported.
- [ ] **Step 3:** Add `FIELDS`, `fieldOf` and `checkFields`; call `checkFields(FIELDS, MODULES)` from the validator's main run.
- [ ] **Step 4:** Run `npm test` and `node src/content/courses/validate.js`. Expected: all pass, exit 0.
- [ ] **Step 5:** Commit.

### Task 3: The Projects map model and the shared drawing

**Files:**
- Create: `src/content/courses/maps/pm.js`, `src/ui/subjectmap.js`
- Modify: `src/content/courses/validate.js`, `styles.css`, `sw.js`
- Test: `tests/subjectmap.test.js`

**Interfaces:**
- Produces: `export default { subject: 'pm', view: { w: 640, h: 520 }, zones: [{ field, label: {en,nl}, path }], places: [{ module, x, y, w, h, draw }], routes: [[fromModule, toModule]] }` in `maps/pm.js`. `draw` names a small set of isometric objects the drawer knows (for example `'desk'`, `'board'`, `'gate'`, `'server'`). Coordinates are in view units.
- Produces: `export function checkMap(map, modules, fields): string[]` in `validate.js`.
- Produces: `export function mapSvg(map, { lang, next = null, theme }): string` (pure, testable, used by the film kit too) and `export function subjectMap(app, map, { onPlace }): HTMLElement` in `src/ui/subjectmap.js`.

Design decisions for the drawing: one isometric scene, the project as a road from left to right with five stations (the lifecycle field); the people field as the team room beside the road; portfolio and consulting as the office above it; IT and agile as the workshop below. Each place is a labelled object with a hit area of at least 44 px at 390 px width. Every fill comes from a CSS class so both themes work. No progress colouring (ideas list).

- [ ] **Step 1: Write the failing tests:**

```js
test('checkMap: every pm module is one place inside its field zone, and nothing else', () => {
  assert.deepEqual(checkMap(pmMap, MODULES, FIELDS), []);
});
test('checkMap: rejects a missing module, an unknown module, a place under 44 px at 390 wide, and overlapping places', () => { /* four fixtures, one error each */ });
test('mapSvg: one <g class="map-place" data-module="..."> per place, with the title in the asked language; next marks one place', () => {
  const svg = mapSvg(pmMap, { lang: 'nl', next: 'pm.plan' });
  assert.equal((svg.match(/class="map-place/g) || []).length, 16);
  assert.match(svg, /data-module="pm\.plan"[^>]*class="[^"]*is-next|class="[^"]*is-next[^"]*"[^>]*data-module="pm\.plan"/);
  assert.match(svg, /Planning/);
});
```

Minimum hit size rule: `place.w * 390 / view.w >= 44` and the same for `h`.

- [ ] **Step 2:** Run the test file. Expected: FAIL, modules not found.
- [ ] **Step 3:** Build the map model and `mapSvg` (use the anatomy skill's isometric rules as `src/ui/guide.js` does; keep the object set small). `subjectMap` wraps the SVG, wires a click and keyboard handler per place to `onPlace(moduleId)`, and gives each place `role="button"` and an `aria-label` with the module title.
- [ ] **Step 4:** Playwright at 390 px, both themes, both languages: screenshot the map alone; look at it; every label legible, no overlap. Fix and repeat.
- [ ] **Step 5:** Run `npm test`. Expected: all pass. Commit.

### Task 4: Field film 1 and the shared closing scene

**Files:**
- Modify: `films/_kit/build-film.mjs`, `films/_kit/assert.mjs`, `tests/filmcontent.test.js`
- Create: `films/pm.field.lifecycle/build.mjs`, `films/pm.field.lifecycle/stage.js`, `src/content/courses/films/pm.field.lifecycle.html`
- Test: `tests/introfilm.test.js` (extend)

**Interfaces:**
- Consumes: `mapSvg` (Task 3), `FIELDS` (Task 2), `defineFilm({ module })` (Task 1).
- Produces: `defineFilm({ field: '<field id>', ... })`: source text is the field's title and blurb plus the title, blurb and topic titles of each of its modules; coverage rule: every module title of the field appears in a caption or card in both languages. Produces `mapScene({ subject, highlight: string[] })` in the kit: a closing scene that shows `mapSvg` for the subject with the given places lit. `pm.plan.intro` switches its closing scene to `mapScene({ subject: 'pm', highlight: ['pm.plan'] })` followed by its topic grid.

- [ ] **Step 1:** Write the failing kit tests: a field film whose captions omit one module title fails the coverage check; `mapScene` output contains one lit place per highlighted module.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Agent brief (one build agent): add the kit support, then build `pm.field.lifecycle`. Story: one manufacturing improvement project (reuse the pilot's project so the two films agree) walks the road intake, plan, run, land, close; at each station one sentence on what happens there and what goes wrong without it; the film ends on the map with the five stations lit. As long as the content needs (about 2 to 3 minutes for a field film, shorter is fine), 5 to 8 scenes. Set `film: 'pm.field.lifecycle'` on the field in `FIELDS`. Standard film rules and checks.
- [ ] **Step 4:** Review agent, merge, checks, push; render, merge, upload, verify, push.

### Task 4a: Short films in the kit (after the improved pilot is merged)

Merijn, 14 Nov: a video of a minute or even half a minute is enough when the content says so. The kit refuses that today: `MIN_TOTAL` is 60 s, a film needs 4 to 9 scenes and `NARRATION_MIN` is 60 words (`films/_kit/assert.mjs`, `films/_kit/build-film.mjs`).

- [ ] **Step 1:** Failing tests first (`tests/filmcontent.test.js`, `tests/introfilm.test.js`): a film of 30 s with 2 scenes and about 60 narration words passes the build checks; the beat, readability and guard rules still apply (4 s per beat, 22-unit text, in-sentence pause at most 0.4 s); the shipped pages are unchanged.
- [ ] **Step 2:** Lower the limits to what a 30 s film needs (proposal: `MIN_TOTAL` 25 s, 2 to 9 scenes, `NARRATION_MIN` 25 words), keep every other check, rebuild all films and confirm no page changes. The listen guard's pause and WER limits are unchanged.
- [ ] **Step 3:** Note it in the "Module intro films (v17)" brief: the film is as long as its content needs; give no length target to fill.
- Agent: `sonnet`, one task, own worktree. Do not run it while another agent is changing `films/_kit/`.

### Task 5: Checkpoint with Merijn

- [ ] **Step 1:** Tell Merijn both films are live as video: the Planning intro (open Projects, Planning) and field film 1. Ask, as multiple choice: pattern approved; approved with changes (which); not this. **No further film build starts before his answer.** Tasks 6 to 9 may run meanwhile.
- [ ] **Step 2:** Record his answer and any changes as rulings in `docs/superpowers/plans/2026-11-11-v16-notes.md`, and update the reusable brief.

### Task 5 result (14 Nov)

Merijn approved the pattern ("De films zien er goed uit. Verder goed!") with one change: intro and field films name the terms and tools of each topic or station briefly, without explaining them (see "Checkpoint" in the v16 notes). The two existing films are updated and re-rendered; Tasks 10 and 11 build with this rule.

### Task 6: The module screen

**Files:**
- Create: `src/ui/modulescreen.js`
- Modify: `src/app.js` (add `module: renderModule` to `SCREENS`), `src/ui/coursehome.js`, `src/core/course.js`, `src/core/sync.js`, `src/i18n.js`, `styles.css`, `e2e/smoke.mjs`
- Test: `tests/modulescreen.test.js`, `tests/sync.test.js` (extend)

**Interfaces:**
- Consumes: `introFilm(meta)`, `filmStep` (exist), `pathModel`, `topicPath` (exist), `fieldOf` (Task 2).
- Produces: `export function renderModule(app, { subject, moduleId }, root)`; `export const introSeen = (state, moduleId) => boolean` and `export function markIntroSeen(state, moduleId): state` in `course.js`, stored as `state.courses[subject].seenIntros: string[]` (module ids, capped at 200, merged in `sync.js` as a union).
- Produces: `export function moduleModel(state, meta, lang): { title, blurb, field, hasIntro, introSeen, topics, next }` in `modulescreen.js` (pure; the render uses only this).

Screen, top to bottom: a back link to the subject; the module title with the English name small under it; the field name as a quiet label; the intro block (Task 8 adds Andon; here: the heading `moduleIntro` and `filmStep`, or the blurb when there is no intro); the topics with their level paths (moved from `topicModuleRow`); the medal and module check; one filled button "continue" to the next lesson. The list rows on the course home keep their summary line and open the module screen on tap instead of unfolding.

- [ ] **Step 1: Write the failing tests:**

```js
test('moduleModel: a module with an intro reports it and whether it was seen', () => { /* hasIntro true; introSeen false, then true after markIntroSeen */ });
test('moduleModel: a module without an intro has hasIntro false and still lists its topics', () => {});
test('markIntroSeen is idempotent and keeps other course state', () => {});
test('sync: seenIntros of two devices merge as a union', () => {});
```

- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. `renderModule` with an unknown `moduleId` calls `app.go('home')`. `markIntroSeen` is called when the intro video fires `ended`, or when the HTML film reports its last scene (extend `filmStep` with an `onSeen` option; default no-op).
- [ ] **Step 4:** e2e: add a step "module screen: open Planning from the list, intro on top, topics below, continue opens the next lesson", with screenshots in both themes. Update steps that unfold a module row.
- [ ] **Step 5:** `npm test`, validator, e2e step green. Commit.

### Task 6b: Back to the module screen after a lesson (Merijn, 14 Nov)

A lesson, check or situation opened from the module screen returns to that module screen when it ends (today they return to the course home with `go('home')`). Opened from anywhere else, they return where they came from as now.

- [ ] Tests first: the done card's back and continue actions route to `module` with the lesson's module id when the lesson was opened from the module screen; to the course home otherwise. Build `sonnet`, review `opus` (navigation is shared code).

### Task 17: Complete the films that drop lesson points (Merijn, 14 Nov)

The film length review (`docs/superpowers/reviews/2026-11-14-film-length-review.md`) found no padded films but many dense films that leave lesson points out; since a film replaces the reading step, the learner never sees those points. Merijn chose to complete the films, not to show the lesson text under them.

- [ ] **Step 1 (design, `opus`):** per film, from the review files, decide: extend (the missing points fit within the length rules) or split (one film per lesson, when a film serves three or four lessons and misses more than about 15 points). Record the list, worst first, and any kit limit that blocks it (today `MAX_TOTAL` 300 s and the guard's 360 s per language).
- [ ] **Step 2:** per film or split: build (`sonnet`), review (`sonnet`; it checks that every lesson point is now in the film or on a card that stays at least 4 s), render (`sonnet`), merge, upload, verify, push. Two at a time, worst first: eng.machining.cnc, eng.joining.arc, eng.joining.defects, eng.machining.drilling, eng.joining.spot, then the rest of the over-15 list, then the smaller ones.
- Order: after the Projects intros (Task 11), unless Merijn moves it.

### Task 18: Trim the four trimmable films (Merijn, 14 Nov)

eng.switchgear.devices, eng.power.air, eng.ot.orderflow and eng.maintenance.tpm: remove the restatements, recaps and extras listed in the review files; eng.maintenance.tpm also gets its missing people point (Teach 4). Build `sonnet`, review `sonnet`, render `sonnet`.

### Task 7: The map on the subject home

**Files:**
- Modify: `src/ui/coursehome.js`, `styles.css`, `e2e/smoke.mjs`
- Test: `tests/coursehome.test.js` (new, pure parts only)

**Interfaces:**
- Consumes: `subjectMap` (Task 3), `renderModule` route (Task 6), `FIELDS`.
- Produces: `export const homeOrder = (subject, hasMap) => string[]` in `coursehome.js`, returning `['map', 'next', 'goal', 'quick', 'due', 'fields', 'tracks']` with `'map'` and `'fields'` left out when the subject has no map.

Order for a subject with a map: the map; "Your next step"; goal line; glossary and real-week row; due card; a row of field film buttons (one per field that has a film, each opening the film in place with `filmButton`); the track list, all tracks closed. The next module is marked on the map (`next` option). A subject without a map (Engineering, for now) keeps today's layout.

- [ ] **Step 1:** Failing test for `homeOrder('pm', true)` and `homeOrder('eng', false)`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement; tapping a place calls `app.go('module', { subject, moduleId })`.
- [ ] **Step 4:** e2e step "Projects home: the map is the first thing, tapping Planning opens its module screen"; screenshots at 390 px, both themes. Look at them.
- [ ] **Step 5:** Checks, commit, bump CACHE, push.

### Task 8: Andon visible

**Files:**
- Modify: `src/ui/guide.js`, `src/ui/flairui.js`, `src/ui/home.js`, `src/ui/coursehome.js`, `src/ui/modulescreen.js`, `src/i18n.js`, `styles.css`
- Test: `tests/guide.test.js` (extend)

**Interfaces:**
- Consumes: `introSeen` (Task 6), `guide(state, { mood, size })` (exists).
- Produces: `export function guideGreeting(app, { subject }): HTMLElement | null` in `flairui.js` (Andon at 96 px with one line, null when the guide is off); `export function guideIntro(app, meta): HTMLElement | null` (Andon at 72 px beside the intro heading; mood `'right'` when `introSeen`, else `'idle'`).

Lines (pools seeded by day, like `guideLine`): home, nl "Vandaag: één stap. Die hieronder." / en "Today: one step. The one below."; module intro, not seen, nl "Eerst het grote plaatje, dan de details." / en "The big picture first, then the details."; seen: no line. A module without an intro: no Andon.

- [ ] **Step 1:** Failing tests: `guideGreeting` returns null with `settings.guide === false`; `guideIntro` mood follows `introSeen`; the i18n keys exist in both languages.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. Home: `guideGreeting` sits above the first card on the start screen and each subject home; the small goal line under the Today card keeps its 32 px Andon. Module screen: `guideIntro` replaces the plain heading.
- [ ] **Step 4:** Playwright screenshots at 390 px, both themes: home and module screen with the guide on and off. Look at them: no gap when off.
- [ ] **Step 5:** Checks, commit, push.

### Task 9: Finish the two pending deep-dive films

- [ ] **Step 1:** pm.itproject.migration: relaunch the render (standard render brief; the stopped agent's worktree `agent-aabc4f8823c1702ab` had not rendered anything). Merge, upload, verify, push.
- [ ] **Step 2:** pm.agile.forecast (commit b636ff0, branch `film-forecast`): relaunch the review (brief as before), merge, push, render, merge, upload, verify, push.

### Task 10: Field films 2 to 4 (after the checkpoint)

- [ ] **Step 1:** One build agent per film, two at a time, with the brief from the v16 notes as updated in Task 5: `pm.field.people`, `pm.field.portfolio`, `pm.field.it`. Each ends on `mapScene` with its field lit and sets `film` on its field.
- [ ] **Step 2:** Per film: review, merge, push, render, merge, upload, verify, push.

### Task 11: The other 15 Projects module intros (after the checkpoint)

Order, lowest level first: pm.intake; pm.run, pm.land, pm.close, pm.agile, pm.devops; pm.stuck, pm.lead, pm.perform, pm.negotiate, pm.outside, pm.scaled, pm.itproject; pm.portfolio, pm.consult.

- [ ] **Step 1:** Two build agents at a time with the reusable brief; each film is `<module>.intro`, defined with `defineFilm({ module })`, ends on `mapScene` with its place lit, then its topic grid; sets `intro` in the index.
- [ ] **Step 2:** Per film: review, merge, push; render in batches of two or three per render agent; merge, upload, verify, push.
- [ ] **Step 3:** After the last one: a test in `tests/intro.test.js` that every pm module has an intro.

### Task 12: Two small screen fixes

**Files:** `src/ui/home.js`, `src/ui/coursehome.js`, `src/ui/modulescreen.js`, `styles.css`, `e2e/smoke.mjs`; tests in `tests/layout.test.js`.

- [ ] **Step 1:** Speaking home: failing test that the band order starts with the next round and that quests and the practice groups are collapsed by default (state `ui.speakOpen` remembers what he opened). Implement; e2e screenshot; look at it.
- [ ] **Step 2:** Titles: the English name moves to its own small line under the Dutch title in module rows and on the module screen (`modSummary`). Screenshot at 390 px: no title row wraps for any module. Checks, commit, push.

### Task 13: Start Engineering

- [ ] **Step 1:** `src/content/courses/maps/eng.js`: an overview with four zones (basics, discrete, it, grid), each zone a place that opens a zone map with its modules. Extend the map model with `zones[].map` and `subjectMap` with a zoomed state and a back control; tests as in Task 3 for each zone map.
- [ ] **Step 2:** Engineering `FIELDS`: one per track; split basics in two if one film cannot place 12 modules in about 3 minutes (decide when writing the storyboard, record the ruling).
- [ ] **Step 3:** First Engineering field film (the discrete track, which already has the machining overview as its model), review, render.
- [ ] **Step 4:** Ask Merijn to look at the Engineering overview map before the remaining Engineering films are built.

---

### Task 14: Two new Projects modules (after the Task 5 checkpoint, parallel to Task 11)

Decided 14 Nov, see the addendum of the design. Not started before Merijn's checkpoint.

- [ ] **Step 1:** Research agent (`sonnet`, sources required): the coverage review against PMBOK, PRINCE2, IPMA ICB, Lean and Six Sigma practice, change management and facilitation, plus the tool landscape (Microsoft world, Azure DevOps and other families, organised by when each fits). Output: a ranked gap list and a proposed topic list for two modules, **with one line per topic and level on what each of the four levels teaches** (Basis, Werkkennis, Gevorderd, Expert, as defined in the design's third addendum), saved under `docs/superpowers/content/briefs/`.
- [ ] **Step 2:** Bring the proposal to Merijn as multiple-choice decisions (names, topics, field and map place). Record his answers in the design addendum.
- [ ] **Step 3:** Per module: content brief, content agent (`sonnet`) in nl and en with the usual content rules (4 topics of 4 levels, terms, recall questions, situation and say-it items, term-link test), review agent (`opus` for the first module, `sonnet` for the second; it checks level separation explicitly), merge, push.
- [ ] **Step 4:** Add both modules to `FIELDS` (the validator requires every module of a subject with fields to be in one) and to the map (`maps/pm.js`, new places, `checkMap` stays green), update field film 1 and re-render it, and build their module intros (Task 11 pattern).

### Task 15: Performance management module (after Task 14)

Decided 14 Nov, see the second addendum of the design. Not started before Task 14 is done.

- [ ] **Step 1:** Research agent (`sonnet`, sources required): proven and best methods and practices of performance management (hard: goals and targets, KPIs, leading and lagging indicators, dashboards and data, variation and decisions; soft: conversations, behaviour and incentives, feedback, motivation, culture), including the seeds in the addendum, and an inventory of the performance-related lessons already in `pm.perform` and in other modules. Output: a ranked list, a proposed topic structure with **what each of the four levels teaches, per topic**, and a mapping of every existing `pm.perform` lesson id to its new place and level, saved under `docs/superpowers/content/briefs/`.
- [ ] **Step 2:** Bring the proposal to Merijn as multiple-choice decisions (name, topics, what stays in other modules). Record his answers in the addendum.
- [ ] **Step 3:** Migration first (`sonnet`, tests first): restructure `pm.perform` under the same module id; a test proves that no lesson id is lost, every lesson sits in exactly one topic at one level, and an old saved state (progress, medals, review boxes) still loads and maps correctly. Then the new lessons per topic (content agent `sonnet`, review agent `sonnet`; `opus` for the review that touches the restructuring), merge, push.
- [ ] **Step 4:** Update the intro film of `pm.perform` (Task 11 pattern) and the map label.

### Task 16: Strategic module (later, no date)

Low priority (Merijn, 14 Nov): what a senior looks at strategically, part of the project and process management area. Only after Tasks 14 and 15. Same pipeline: research pass with sources, a proposal that lists what each of the four levels teaches per topic, multiple-choice decisions, content and review, a new place on the map, a field assignment and an intro film.

## Not in this plan

Explain it back, knowledge on the map, and the rest of the ideas list in the spec: each gets its own design when it is picked up. The speaking formats stay parked.

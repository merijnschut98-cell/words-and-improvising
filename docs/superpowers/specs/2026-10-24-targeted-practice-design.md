# Targeted practice: design

**Why:** Random prompts train breadth. Improvement comes from deliberate practice on the weak spot, the "one obstacle at a time" principle from Toyota Kata.

**What:** a "🎯 Targeted practice" card on home.
- **With a key:** Claude gets the weekly review (filler rate, top filler, weakest drill, focus) and the last 3 coach "work on" notes. It returns one exercise: a drill (`minute|explain|prep|bridge|smalltalk|pause`), a one-line focus explaining why, and the drill-specific fields. The round intro shows the focus line.
- **Without a key, or if the call fails:** `fallbackPick` uses the weekly focus:
  - focus drill → that drill
  - filler focus → the `pause` drill
  - otherwise → the worst drill, or a random drill if there isn't one

  The prompt comes from the normal content.

**Units:** `core/tailor.js`:
- `buildTailorRequest({review, improvements, lang, model})`: JSON-schema output with every field required. Fields that don't apply to the drill come back as `''` or `[]`.
- `parseTailor(message, now)` → `{ok, prompt}`. Validates the drill-specific fields: explain needs an audience, bridge needs exactly 3 words, smalltalk needs a setting.
- `fallbackPick(review, content, rng, seen)` → a prompt.

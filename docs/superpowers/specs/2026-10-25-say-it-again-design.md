# Say it again (before/after): design

**Why:** The fastest learning loop is to repeat the same prompt straight away, now with the feedback in mind, and see the difference. Right now "say it again" only exists inside the coach card, so it needs a key.

**What:**
- Every feedback screen gets a "🔁 Say it again" button, with or without a key.
- It records the current round first (as before), then starts the same prompt with `previous = {metrics, durationS}`.
- The next feedback screen shows a **Before → Now** card: fillers/min (lower is better), words/min, words, and pauses when both attempts have them. Each row is marked better, worse or same.
- Retries can chain: each retry compares against the attempt right before it.

**Unit:** `core/compare.js`: `compareAttempts(prev, cur)` → `[{key, before, now, better: true|false|null}]`. Pure and tested. Rows with missing data are left out.

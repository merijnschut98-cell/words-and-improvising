# Weekly review: design

**Why:** Streaks show that he's doing the work, not whether it's working. A short weekly check (actual vs. last week, plus one focus point) turns the practice into a PDCA loop instead of just reps.

**What:** a "This week" card at the top of the Progress screen:
- Rounds and minutes spoken in the last 7 days, compared with the 7 days before.
- Average fillers/min and words/min, this week vs. last week, with an arrow and a good/bad colour (fewer fillers is better).
- His most-used filler word this week.
- His strongest and weakest drill this week, by average rating (self-rating, or the coach's overall score when there's no self-rating). Shown only when a drill has at least 2 rounds.
- **One focus for next week**, picked by a rule:
  1. If fillers/min is 4 or more, name the top filler word.
  2. Otherwise, if the weakest drill averages below 3.5, name that drill.
  3. Otherwise, if fewer than 5 rounds, aim for 5 rounds.
  4. Otherwise, try a higher level or the live conversation.

**Unit:** `core/review.js`: `weeklyReview(history, now) -> {thisWeek, lastWeek, topFiller, best, worst, focus:{kind, value}}`. Pure and tested. Each week is `{rounds, minutes, fillerRate, wpm}`; a week with no rounds has `fillerRate`/`wpm` set to null.

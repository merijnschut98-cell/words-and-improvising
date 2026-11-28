# v12 (later, not now): motivation and mini-games

Merijn (2026-11-04): later in the plan, add things that are proven to raise motivation ("dopamine") so he keeps playing and, more importantly, keeps learning; keep the app minimal. Also small mini-games that use the learning concepts. Not for now.

## Tension to settle first
The v9 Global Constraints say "no new reward layers" (now revisited for competence-based titles, see below) (no badges, leaderboards, celebratory screens) because extrinsic rewards can shift attention from learning to points (overjustification). v12 deliberately revisits that rule with one test: a mechanism ships only if it raises learning behaviour (retrieval practice done, spaced reviews kept, lessons completed), not just time in the app.

## Decided (Merijn, 2026-11-04): titles and badges for real mastery
Revisit the v9 "no badges" rule for **competence-based** recognition only. Achievements, badges and titles ("Werkkennis Draaien", "Expert in Spuitgieten", "Meester Verspanen") are earned by evidence of learning, never by taps or time alone:
- **Level achieved** in a topic (passed / owned per level chip).
- **Retention**: questions that came back via spaced repetition and were still answered correctly N times (e.g. owned questions held over 30 / 60 / 120 days).
- **Time spent** on a subject counts only together with progress (minutes of practice that produced passed lessons or kept reviews), so it cannot be gamed by leaving the app open.
- Titles per topic and per module (e.g. topic: Basis → Werkkennis → Gevorderd → Expert; module: all topics at Expert with retention → "Meester"), shown quietly on the module view and in Progress; a small, calm moment when one is earned (no confetti, Vantage style).
Why this passes the test: informational rewards that confirm competence tend to support intrinsic motivation, while rewards for mere participation tend to undermine it (Deci, Koestner & Ryan 1999; self-determination theory). Design check in research: avoid badge inflation; keep each title rare enough to mean something.

## Research first (one research agent, sources required)
- Variable reward schedules and reward prediction error (Schultz; Berridge on wanting vs liking) — what transfers to learning apps without hurting intrinsic motivation (Deci, Koestner & Ryan 1999 meta-analysis; Hanus & Fox 2015).
- Goal-gradient effect (Kivetz et al. 2006), progress visibility, "almost there" mastery bars.
- Streak design: loss aversion vs burnout; streak freezes (already built) and gentle recovery.
- Retrieval practice made game-like: testing effect under time pressure — when it helps, when it hurts.
- Evidence on educational mini-games (Wouters et al. 2013 meta-analysis; Clark et al. 2016).

## Candidate ideas (to evaluate, not decided)
- Occasional surprise reward for a hard question answered right (variable, tied to effort).
- Mastery growth per topic made tangible (level chips already exist).
- Short daily challenge with a clear goal and a quiet finish.
- Mini-games on real concepts: find the bottleneck on an animated line; P&ID tag sprint; balance a line to takt; match the Dutch term to the English word; spot the defect (moulding, welding); set a PI loop to stop oscillation (reuse figure models).

## Constraints that stay
Minimal UX, one primary button per screen, Vantage tokens, no emoji, en/nl parity, works offline and without an API key, every game feeds the spaced-repetition queue or is clearly practice.

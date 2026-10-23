# Spraakwater

Daily improvised-speaking practice. Short timed rounds train the gap between *knowing* the words and *saying* them quickly and clearly.

## Drills

| Drill | Trains |
|---|---|
| ⏱ Just a Minute | Keep talking about a random topic, no stalling |
| 💡 Explain It | Explain a concept (lots of Lean) to a given audience |
| 🧱 PREP | Opinion as Point → Reason → Example → Point |
| 🌉 Word Bridge | Weave 3 random words into a talk (they light up when you say them) |
| ☕ Small Talk | Answer an opener, share something, ask a question back |
| ⚡ Rapid Fire | 5 questions × 10 s, no prep |

A **daily lesson** is 3 random drills. Each drill levels up (less prep time, longer answers) when you rate a round 4–5, and down when you rate it 1–2.
After every round you get your word count, words per minute, filler words per minute (fillers are highlighted in your transcript) and a self-rating.
If you add an **Anthropic API key** in Settings, an AI coach scores clarity, structure, fluency and vocabulary. It gives one strength, one thing to work on, and a *stronger version* of your answer that you can listen to and then say again.

Everything is stored locally on your device. The API key never leaves your phone except in calls to Anthropic.

## Install on Android

Open the app URL in Chrome, then use the ⋮ menu → **Add to Home screen** (or the *Install app* button on the home screen). Allow the microphone the first time you speak.

## Develop

No build step. Plain ES modules.

```bash
npm test                 # unit tests (node --test)
npm run serve            # http://localhost:8080
node e2e/smoke.mjs       # Playwright end-to-end smoke test (fake mic + fake coach)
```

When you ship changes to cached files, bump `CACHE` in `sw.js`. Every file under `src/` must be listed in the `SHELL` array in `sw.js` (a test enforces this).

Design and plan: `docs/superpowers/`.

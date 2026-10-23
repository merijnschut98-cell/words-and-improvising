# Improv Trainer: design

## Intent

**What Merijn said:** his weak point is *improvising with words*: explaining what he
thinks quickly and articulately, and small talk. He knows the words; retrieving and
structuring them under time pressure is the gap. He wants a game (Duolingo-like or
otherwise) to practise this. It should be quick to start with and then grow. It runs in the
browser and installs on his phone (Android, Chrome).

**His answers:**
- He picks per round whether to speak or type.
- He uses Android with Chrome.
- He wants Dutch and English, switchable.
- He wants AI feedback, using his own Anthropic API key stored on the device.

**Assumptions (mine):**
- The short daily habit is what moves the skill, so the core loop is one 5-minute
  session a day, with streaks and XP to keep it going.
- He is on holiday and can't give feedback, so v1 must work fully on its own. The
  AI coach makes it better but is never required.
- Privacy: everything stays on the device (localStorage). There is no backend.

**Success criteria:**
1. He can open a URL on his phone, install it to the home screen, and start a round
   within 10 seconds.
2. A round = prompt → short prep → timed answer (speech or text) → feedback.
3. Without a key, feedback shows word count, words per minute, filler words, a
   self-rating, and audio playback where it is supported.
4. With a key, feedback adds a coach's assessment and a "stronger version" of his answer.
5. Progress is visible: streak, XP, level, and fillers per minute trending down.

## The game

**Name:** *Spraakwater*: Dutch for "gift of the gab", a little playful.

**Daily lesson:** 3 rounds from different drills. Finishing one gives XP and keeps the
streak. **Free practice:** pick any drill.

**Drills** (each trains one sub-skill of improvising):

| Drill | Trains | Mechanic |
|---|---|---|
| Just a Minute | fluency, not stalling | Random topic, keep talking for the whole time |
| Explain It | articulating thinking | Explain a concept to a given audience (child, CEO, operator) |
| PREP | structure under pressure | Give an opinion as Point–Reason–Example–Point, with a scaffold shown |
| Word Bridge | word retrieval | Talk about a topic and work in 3 random words |
| Small Talk | social improvising | A scenario plus an opener: respond and ask a follow-up question |
| Rapid Fire | starting fast | 5 quick questions, 10 seconds each, no prep |

**Difficulty:** each drill has a level (1–5) that sets prep time (15s → 0s) and answer
time (30s → 90s). Good rounds (self-rating ≥ 4 or coach score ≥ 4) raise the drill's level.
Poor rounds lower it, never below 1.

**Gamification:** XP per round (base + a bonus for length and for a low filler
rate), overall level from XP, a daily streak with a 7-day calendar strip, and a
history list.

## Architecture

A static PWA in vanilla JS ES modules, with no build step and no framework. Pure
logic sits in small modules that are tested with `node --test`. Browser-API
wrappers (speech, recorder, coach) are thin and get verified by hand in Chromium.

```
index.html, manifest.webmanifest, sw.js, icons/
src/
  app.js          screen router and rendering (DOM)
  ui/             one module per screen (home, round, feedback, progress, settings)
  core/
    metrics.js    transcript → {words, wpm, fillers, fillerRate}   (pure, tested)
    progress.js   XP, levels, streaks, drill-level adjustment      (pure, tested)
    lesson.js     build daily lesson / pick prompts, no repeats    (pure, tested)
    storage.js    versioned localStorage wrapper                   (tested with a fake)
    coach.js      Claude API call + response parsing               (parsing tested)
    speech.js     Web Speech API wrapper w/ Android restart logic
    recorder.js   MediaRecorder wrapper
    i18n.js       UI strings nl/en
  content/
    prompts.en.js, prompts.nl.js   topics, concepts, opinions, scenarios, words
tests/            node --test
```

**Data flow:** home → lesson.js picks the drill and prompt → round screen (prep
countdown → answer countdown, speech.js gives a live transcript, or a textarea) →
metrics.js → feedback screen (self-rating, plus coach.js if there is a key) →
progress.js updates state → storage.js persists it.

**Storage schema (v1):** `{version, settings:{lang, mode, apiKey, model, record}, xp,
streak:{count,lastDay}, drillLevels:{id:n}, history:[{ts, drill, promptId, lang, mode,
durationS, transcript, metrics, selfRating, coach}], seenPrompts:{id:ts}}`. History is
capped at 200 entries.

**Speech on Android Chrome:** set `continuous=true` and `interimResults=true`. Android
ends the session after silences, so the wrapper restarts on `onend` while the round
runs and stitches the final results together. If SpeechRecognition is missing, the
round falls back to typing automatically. Recording audio at the same time as speech
recognition can fight over the microphone on Android, so audio recording is a setting
that is **off by default**.

**AI coach:** a direct browser call to the Anthropic Messages API with the
`anthropic-dangerous-direct-browser-access` header. The key comes from settings.
The coach returns JSON: scores (clarity, structure, fluency, vocabulary: 1–5), one
strength, one improvement, a "stronger version" in the same language, and a level-up
flag. The coach's tone is warm and direct, and it never pads. If the call fails, the
error shows inline and local feedback still works.

**Hosting:** a static site on GitHub Pages, deployed from `main` by a GitHub Actions
workflow, or on Vercel if Pages isn't available. A service worker caches the app
shell so it works offline (except speech, which needs a connection, and the coach).

## Error handling

- Microphone permission denied → explain it and switch to typing.
- No speech heard → treat the round as empty and offer a retry with no XP penalty.
- Coach API errors (401/429/network) → show a readable message and keep the local
  feedback.
- Corrupt storage → back it up under a separate key and start fresh.

## Testing

Unit tests (`node --test`) cover metrics, progress, lesson and storage, plus coach
response parsing. I test the UI by hand in Playwright Chromium, using a fake
SpeechRecognition to drive the flow end to end.

## Evolving after v1 (backlog, not in v1)

- Multi-turn AI conversation partner for Small Talk, with text-to-speech.
- Coach-generated prompts tailored to weak spots.
- A "Story chain" drill.
- Weekly review screen.

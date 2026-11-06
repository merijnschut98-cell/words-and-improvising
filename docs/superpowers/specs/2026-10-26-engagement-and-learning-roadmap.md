# Engagement & learning roadmap (v2): design

Planned 2026-10-26 after a research pass. Decisions here are final unless Merijn says otherwise; the implementation plan is `docs/superpowers/plans/2026-10-26-engagement-roadmap.md`.

## What the research says (and what we do with it)

| Finding | Source quality | Decision |
|---|---|---|
| Streaks drive daily actives, but only when the rule is simple ("one lesson a day"). Copy like "commit to my goal" beat "continue". | Duolingo PM accounts (practitioner) | Keep the streak simple. Add **streak freezes** (earned, max 2) and a **minimum-viable session** (one 60 s round keeps the day), so the streak is for consistency, not perfection. |
| Streak anxiety and "streak creep" burn people out; purchases to repair streaks and guilt notifications are what people complain about. | Essays, review mining | **Never**: paid repair, hearts/lives, guilt copy, gating practice. Reminders are warm and optional. Missing a day is spoken of as normal ("one miss doesn't break a habit", which is also what Lally's data shows). |
| In learning meta-analyses, **levels** carry the effect; points, badges and leaderboards alone don't improve learning. Narrative beats PBL. Leaderboards demotivate everyone outside the top third. | Meta-analyses | No public leaderboard. Keep per-drill levels central. Replace "badges" with **personal bests** (beat yourself) and a light **journey** of named milestones. |
| Daily quests are the single most copied retention mechanic (small, varied, finishable today). | Practitioner | Add **3 daily quests**, seeded by date, that nudge toward learning behaviours (not just "do 3 rounds"). |
| Desirable difficulties: spacing, interleaving, **varied practice conditions**, retrieval. They hurt in-session performance and feel worse, so they need framing. | Peer-reviewed (Bjork) | Lessons already interleave. Add **modifiers** (varied conditions) with explicit "harder on purpose" framing and bonus XP. Occasional **cold-start** rounds (0 s prep) at any level. |
| Habits form over ~66 days (18–254); a single missed day barely matters; **implementation intentions** ("after X, I do Y") roughly double follow-through. | Peer-reviewed (Lally; Gollwitzer via summaries) | Add a **practice plan**: one cue + time, set once, shown on home and used by the reminder. Show "days practised" as a growing total next to the streak, so a miss never zeroes the visible progress. |
| Feedback: specific, tied to a goal, corrective → positive works at least as well as the sandwich; learners anchor on praise. Performance *during* practice misleads people about learning. | Peer-reviewed, small studies | Keep the coach format (one strength, one improvement). Add **self-rating vs coach calibration** so he learns to judge himself. Show week-over-week trends, not just today's numbers. |
| Self-determination theory: autonomy, competence, relatedness. | Theory + reviews | Autonomy: pick today's focus. Competence: skill radar + mastery. Relatedness: **share card** and **challenge a friend** (same seeded prompt, compare), fitting his Brotherhood value. |
| Public-speaking apps (Yoodli, Orai, Speeko) compete on filler/pace analytics and roleplay. None do a Duolingo-style habit loop with improv drills. | Vendor pages | Our edge is the habit loop + improv variety + coach. Don't chase webcam/eye-contact analytics. |

Sources are listed at the end.

## Principles

1. Reward **showing up and trying harder**, not being good. XP for effort and difficulty, personal bests for outcomes.
2. Every reward points back at a learning behaviour (pause instead of filler, switch sides cleanly, start cold).
3. Loss framing is soft. Nothing is ever taken away except an unprotected streak, and even that is forgiving.
4. Everything works without an API key. The key makes things richer, never possible.
5. One user, so no social ranking. "Relatedness" is sharing and challenging friends, not competing with strangers.

## Features

### Tier 1: habit loop (biggest effect per hour)

**F1. Daily quests.** Three quests per local day, seeded from the date so they are stable across reopenings. Drawn from a pool that mixes behaviours:
- "Do a 🤫 Pause round with 0 fillers"
- "Beat yesterday's fillers/min in any round"
- "Say one answer again, better" (use the retry loop)
- "Complete today's lesson"
- "Do a round with 0 s prep" (cold start)
- "Use all 3 Word Bridge words"
- "Finish a Live conversation" (only offered with a key)
- "Do a round in your other language"
Each quest gives 15 XP; completing all three gives a **streak freeze** (cap 2). Progress is shown on home under the lesson button; a quest completes the moment a round qualifies, with a small toast.

**F2. Streak freezes + minimum session.** A missed day uses a freeze automatically (shown as "🧊 freeze used" on the week strip). A single 60 s **Quick round** (new button on home: "Only 1 minute? Quick round") counts for the day. Copy on a broken streak: "Streak reset. You've practised N days in total; that doesn't reset."

**F3. Practice plan (implementation intention).** In the welcome flow and in Settings: "When will you practise?" → a cue ("after my morning coffee", "on the train", "before dinner", custom) + a time. Home shows "Your plan: after morning coffee". The reminder fires near that time when supported (periodic sync can't be precise; we store the preferred hour and skip firing more than 3 h away from it).

**F4. Lesson summary with highlights and personal bests.** The Done screen becomes a summary: XP, quests ticked, and up to two highlights: "Longest clean run: 54 words without a filler" and "New personal best: fewest fillers/min in Just a Minute". Personal bests are tracked per metric (fillers/min low, words high, clean run high, pauses high) and per drill for fillers/min.

**F5. In-round clean-run counter.** During any spoken round, a small live counter of consecutive words without a filler, with a "best this round" marker. Immediate, honest dopamine tied to the target behaviour.

### Tier 2: variety and challenge

**F6. Modifiers (varied conditions).** Occasionally (about 1 in 4 rounds at drill level ≥ 2, or on demand from a "Harder" toggle on the intro screen), a modifier is added: *Cold start* (0 s prep), *Whisper*, *Slow down* (target < 110 wpm), *No "I"* (don't use first person), *Standing up*, *Eyes closed*, *End with a question*. +5 XP. Framed as "Harder on purpose: variety builds transfer."

**F7. Friday boss round.** Once a week (Friday onwards until done), a 2-minute mixed round: a topic, with a twist at 30 s, three words to work in, and a side-switch at 60 s. Double XP, its own personal best, and a special highlight in the weekly review.

**F8. Calibration insight.** With coach scores available: a Progress card showing self-rating vs coach overall for the last 10 rounds ("You rate yourself 0.8 lower than the coach: you're harder on yourself than you need to be"). Without a key: compare self-rating with filler rate trend instead.

**F9. Skill radar.** On Progress: a 4-axis radar (clarity, structure, fluency, vocabulary) from coach scores, with local proxies when there's no key (fluency ← fillers/min and pauses; vocabulary ← unique-word ratio; structure and clarity ← self-rating only, shown dimmer).

**F10. Two TTS drills that need no key.**
- *Yes, and…*: the app speaks a line ("Our team should train at 6 a.m."); he must start his reply with "Yes, and" and build on it. Three lines per round.
- *Listen & respond*: a 2-sentence statement is spoken, then a question about it. Trains listening before talking (the small-talk weak spot). Scripted content, 30+ items per language.

**F11. Expert interview.** He is "the world's leading expert on" a random absurd topic (sock logistics, cloud farming). Five quick TTS questions, 12 s each. Pure fluency and confidence.

### Tier 3: identity and sharing

**F12. Journey milestones.** A single vertical path of named milestones based on totals (rounds, days practised, drills at level 3+, personal bests): "First words", "Week one", "Clean minute", "Captain's voice", "Table-topics ready"… Each unlocks a cosmetic: a colour theme or an alternate app accent. No gating of features, ever.

**F13. Share card.** On the Done and weekly-review screens: "Share" renders a PNG (canvas) with the week's numbers or the lesson's highlight, for WhatsApp/Signal. No account, no server.

**F14. Challenge a friend.** "Send this prompt": a link with a seed (`?c=<drill>.<promptId>.<lang>`) that opens the same prompt for anyone with the app. The result screen shows "You: 2.1 fillers/min · 118 words" and a button to reply with your own link. Comparison is by screenshot or message; no backend.

**F15. Sound and haptics.** Optional short sounds for twist, side switch, quest complete and personal best, with a mute toggle. Haptics already exist.

## Not doing

Hearts/lives, paid anything, public leaderboards, guilt notifications, gating drills behind unlocks, webcam analysis, accounts or a backend.

## Data model additions (all in the existing `spraakwater:v1` blob, merged with defaults on load)

- `quests: { day: 'YYYY-MM-DD', items: [{id, done}] }`
- `freezes: n` (0–2), `freezeLog: ['YYYY-MM-DD']`
- `daysPractised: n` (total days with ≥ 1 counted round)
- `plan: { cue: string, hour: number|null }`
- `bests: { fillerRate: {value, ts, drill}, words: {...}, cleanRun: {...}, pauses: {...}, byDrill: { [drill]: fillerRate } }`
- `milestones: ['id', …]`, `theme: 'default'|…`
- History entries gain `cleanRun` (max consecutive non-filler words) and `modifier` (id or null).

## Success criteria for v2

- He can see, within 5 seconds of opening the app, what to do today (lesson + quests) and that it's small.
- A missed day never zeroes anything visible except the streak count, and a freeze catches the first miss.
- Each lesson ends with at least one specific, true positive (highlight or PB) and the quest progress.
- Every new behaviour (pauses, cold start, retries, modifiers, listening) has a quest or bonus pointing at it.
- No key is needed for anything in Tier 1 and Tier 2 except F8's coach version.

## Sources

Duolingo retention: [uxdesign.cc analysis](https://uxdesign.cc/duolingo-analyzing-all-engagement-and-retention-techniques-3e73b79120cf), [Lenny's Newsletter: Duolingo streaks](https://lennysnewsletter.com/p/behind-the-product-duolingo-streaks), [Strivecloud](https://www.strivecloud.io/blog/blog-gamification-examples-boost-user-retention-duolingo). Streak criticism: [The Decision Lab: Streak creep](https://thedecisionlab.com/insights/consumer-insights/streak-creep-the-perils-of-too-much-gamification), [uxdesign.cc: the good, the bad and the ugly](https://uxdesign.cc/the-good-the-bad-and-the-ugly-of-duolingo-gamification-3a12f0e80dc7). Gamification meta-analyses: [PMC8037535](https://pmc.ncbi.nlm.nih.gov/articles/PMC8037535), [ISCTE programming-education meta-analysis](https://repositorio.iscte-iul.pt/bitstream/10071/29213/1/article_95533.pdf), [2024 e-learning meta-analysis](https://opus4.kobv.de/opus4-ohm/frontdoor/index/index/year/2024/docId/2476). Desirable difficulties: [Psychological Science Observer](https://www.psychologicalscience.org/observer/desirable-difficulties), [Harvard Macy](https://harvardmacy.org/blog/using-learning-sciences). Habits: [BPS Research Digest on Lally et al.](https://bps.org.uk/research-digest/how-form-habit), [James Clear on implementation intentions](https://jamesclear.com/master-one-thing). Feedback: [Henley & DiGennaro Reed 2015](https://foxylearning.com/wp-content/uploads/2021/11/HenleyDiGennaroReed2015.pdf), [NBME: why aren't students acting on feedback](https://www.nbme.org/research/innovations-in-assessment/why-arent-students-acting-on-feedback/). Improv/table topics: [Toastmasters: Understanding improv](https://toastmasters.org/magazine/magazine-issues/2024/feb/understanding-improv), [Improwiki exercises](https://improwiki.com/en/category/improv-exercises). Competitor apps: [Yoodli: Orai vs Speeko](https://yoodli.ai/blog/orai-vs-speeko-what-to-know), [Orai App Store](https://apps.apple.com/us/app/-/id1203178170).

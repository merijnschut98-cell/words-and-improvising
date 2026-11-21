# "Pause, don't fill" drill: design

**Why:** Filler words are the brain buying time out loud. The fix isn't "talk faster". It's to allow a short silence instead. A pause reads as confident, a filler as unsure. This drill trains that swap directly.

**Mechanic:** He gets a topic and talks for the normal level time. Two live counters are shown: **pauses** (silences of at least 1.5 s after he has started talking) and **fillers** (counted live from the transcript; turns red on each new one). Goal: at least 3 pauses and 0 fillers. Feedback shows both counts plus a pause ratio, pauses / (pauses + fillers).

**Pause detection:** we record a timestamp each time the live transcript grows. A gap of at least 1.5 s between two consecutive growth events counts as a pause. The time before the first word doesn't count. This is approximate (speech recognition sends results in bursts), but good enough to train on. Pauses are only measured in speak mode; in type mode the counter is hidden.

**Units:** `core/pauses.js`: `countPauses(times, minGapMs = 1500)`. Round: records the times and shows the live counters for the `pause` drill. Feedback: a pauses chip whenever `metrics.pauses` is set. XP: +5 bonus in this drill for at least 3 pauses with fillerRate under 1.

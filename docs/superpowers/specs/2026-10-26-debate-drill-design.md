# Debate drill: design

**Why:** Being able to argue a position you don't hold, and switch on demand, is the core of thinking on your feet. It also stops him rehearsing one answer.

**Mechanic:** He gets an opinion question from the `opinions` pool. For the first half of the answer time he argues **FOR** it. At the halfway mark a banner switches to **AGAINST**, with a vibration, and he argues the other side straight away, without stopping. Answer time follows the normal levels, and the switch is always at exactly half. The drill is part of the normal rotation and needs no key.

**Units:**
- `debateSide(elapsedS, totalS)` in `progress.js` returns `'for'` or `'against'`.
- `makePrompt('debate')` uses the opinions pool with seen key `opinion`.
- The round screen shows a side banner.
- The coach brief judges the strength of both sides and how cleanly he switched.

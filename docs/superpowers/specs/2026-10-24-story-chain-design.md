# Story Chain drill: design

**Why:** The core of improvising is folding something unexpected into what you're already saying, without stopping. Word Bridge does this with words you see in advance; Story Chain does it under surprise.

**Mechanic:** He gets a story opening and keeps telling the story. Every N seconds a **twist** appears on screen (with a short vibration), and he has to work it into the story straight away. N goes down with the level: 20, 16, 13, 11, 9 seconds. Answer time comes from the normal level timing. The drill is part of the normal drill rotation and lessons, and needs no key.

**Units:**
- Content: `storyStarts` (at least 25) and `twists` (at least 30) in both languages.
- `makePrompt('story')`: `body` is the opening, `extra.twists` is 8 distinct shuffled twists.
- `twistEvery(level)` in `progress.js`.
- Round screen: shows the current twist chip, switching every N seconds, and counts how many appeared (`extra.twistsShown` is passed to feedback so the coach knows which ones appeared).
- Coach: a brief for the drill, plus the opening and the twists that were shown.

# Live Conversation (AI small-talk partner): design

**Why:** Small Talk v1 trains only the first reply. Real small talk is the *second and third* turn: listening, building on what the other person said, keeping it going. This drill adds that.

**What:** A "Live conversation" card on home (needs an API key). The app picks a Small Talk scenario. The partner's opener is spoken aloud (speechSynthesis). Merijn answers by voice (or typing). The partner, played by Claude, replies in character in 1–2 short sentences, spoken aloud. This repeats for up to 4 of his turns, or until the partner wraps up. Then the regular feedback screen runs over his turns combined. The coach sees the whole dialogue and judges listening and building on the other person, not just fluency.

**Units:**
- `core/claude.js`: `callClaude(apiKey, params, loadSdk)` → `{ok, message} | {ok:false, error}`. This is the SDK loading and error mapping pulled out of `coach.js`.
- `core/partner.js` (pure + tested):
  - `buildPartnerRequest({scenario, opener, turns, lang, model})`. Turns are `[{role:'user'|'partner', text}]`, with the opener given in the system prompt.
  - `parsePartnerReply(message)` → `{ok, reply, end}`. Uses structured output `{reply, end_conversation}`.
  - `runPartner(apiKey, args, loadSdk)`.
- `core/voice.js`: `say(text, lang)`, a Promise wrapper around speechSynthesis with a timeout.
- `ui/conversation.js`: chat screen with bubbles. Per turn: mic (tap to talk, tap to send) or a textarea. On finish it hands over to `feedback` with `prompt = {drill:'smalltalk', ..., extra:{setting, dialogue}}`, the transcript of his turns, the summed speaking time and `targetS = 60`.
- `coach.js`: when `extra.dialogue` exists, describe the full dialogue and add a note to judge listening and building on the partner.

**Errors:** a partner call error shows inline with a retry. The conversation is never lost: he can still finish and get feedback.

**Not now:** voice selection, an interrupt (barge-in), and adding live conversation to the daily lesson (it needs a key, and lessons must work without one).

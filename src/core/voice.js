// Text-to-speech via speechSynthesis. say() resolves when speaking ends,
// or after a length-based timeout because some engines never fire onend.

export const voiceSupported = typeof window !== 'undefined' && !!window.speechSynthesis;

function pickVoice(lang) {
  const code = lang === 'nl' ? 'nl' : 'en';
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang.toLowerCase().startsWith(code) && v.localService)
    || voices.find((v) => v.lang.toLowerCase().startsWith(code));
}

// Longest we wait for a line before moving on: at least 6 s, longer for long lines.
export const speakCapMs = (text) => Math.max(6000, 2000 + String(text || '').length * 90);

// Resolves 'spoken', or 'failed' when the engine errors or ends at once (no voice).
export function say(text, lang) {
  if (!voiceSupported || !text) return Promise.resolve('failed');
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'nl' ? 'nl-NL' : 'en-US';
    const voice = pickVoice(lang);
    if (voice) u.voice = voice;
    let done = false;
    const started = Date.now();
    const finish = (result) => { if (!done) { done = true; resolve(result); } };
    u.onend = () => finish(Date.now() - started < 300 ? 'failed' : 'spoken');
    u.onerror = () => finish('failed');
    setTimeout(() => finish('spoken'), speakCapMs(text));
    synth.speak(u);
  });
}

export function hush() {
  if (voiceSupported) window.speechSynthesis.cancel();
}

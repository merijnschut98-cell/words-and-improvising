// Text-to-speech via speechSynthesis. say() resolves when speaking ends,
// or after a length-based timeout because some engines never fire onend.

export const voiceSupported = typeof window !== 'undefined' && !!window.speechSynthesis;

function pickVoice(lang) {
  const code = lang === 'nl' ? 'nl' : 'en';
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang.toLowerCase().startsWith(code) && v.localService)
    || voices.find((v) => v.lang.toLowerCase().startsWith(code));
}

export function say(text, lang) {
  if (!voiceSupported || !text) return Promise.resolve();
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'nl' ? 'nl-NL' : 'en-US';
    const voice = pickVoice(lang);
    if (voice) u.voice = voice;
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    u.onend = finish;
    u.onerror = finish;
    setTimeout(finish, 2000 + text.length * 90);
    synth.speak(u);
  });
}

export function hush() {
  if (voiceSupported) window.speechSynthesis.cancel();
}

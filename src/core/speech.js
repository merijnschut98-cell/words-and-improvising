// Web Speech API wrapper. Android Chrome ends sessions on silence and sometimes
// reports cumulative finals, so we restart while active and dedupe per session.

export function joinText(...parts) {
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

// results: SpeechRecognitionResultList-like (array of [{transcript}] with isFinal)
export function sessionText(results) {
  let final = '';
  let interim = '';
  for (let i = 0; i < results.length; i++) {
    const text = joinText(results[i][0].transcript);
    if (!text) continue;
    if (!results[i].isFinal) interim = joinText(interim, text);
    else if (final && text.toLowerCase().startsWith(final.toLowerCase())) final = text;
    else final = joinText(final, text);
  }
  return { final, interim };
}

const Recognition = typeof window !== 'undefined'
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : undefined;

export const speechSupported = !!Recognition;

export function createRecognizer({ lang, onText, onError }) {
  let rec = null;
  let active = false;
  let committed = '';
  let session = { final: '', interim: '' };

  const emit = () => onText(joinText(committed, session.final), session.interim);

  function spawn() {
    rec = new Recognition();
    rec.lang = lang === 'nl' ? 'nl-NL' : 'en-US';
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      session = sessionText(e.results);
      emit();
    };
    rec.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return;
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') active = false;
      onError && onError(e.error);
    };
    rec.onend = () => {
      committed = joinText(committed, session.final);
      session = { final: '', interim: '' };
      if (active) {
        try { spawn(); } catch (err) { onError && onError('restart'); }
      } else {
        emit();
      }
    };
    rec.start();
  }

  return {
    supported: speechSupported,
    start() {
      if (!Recognition) return false;
      active = true;
      committed = '';
      session = { final: '', interim: '' };
      spawn();
      return true;
    },
    // Resolves with the full transcript once the engine has flushed.
    stop() {
      active = false;
      return new Promise((resolve) => {
        if (!rec) return resolve(committed);
        const done = () => resolve(joinText(committed, session.final, session.interim));
        const prev = rec.onend;
        rec.onend = () => { prev(); done(); };
        try { rec.stop(); } catch { done(); }
        setTimeout(done, 1500); // some engines never fire onend
      });
    },
  };
}

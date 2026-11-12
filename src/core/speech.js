// Web Speech API wrapper. Android Chrome ends sessions on silence and sometimes
// reports cumulative finals, so we restart while active and dedupe per session.
import { trackProbeVerdict } from './micshare.js';

export function joinText(...parts) {
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

// Android sometimes repeats earlier finals inside a later one ("I think" ->
// "I think that"). Only treat it as cumulative on a word boundary.
function isCumulative(prev, next) {
  const a = prev.toLowerCase();
  const b = next.toLowerCase();
  return b === a || b.startsWith(`${a} `);
}

const FATAL = new Set(['not-allowed', 'service-not-allowed', 'network', 'audio-capture', 'language-not-supported']);
export const isFatalSpeechError = (code) => FATAL.has(code);

// results: SpeechRecognitionResultList-like (array of [{transcript}] with isFinal)
export function sessionText(results) {
  let final = '';
  let interim = '';
  for (let i = 0; i < results.length; i++) {
    const text = joinText(results[i][0].transcript);
    if (!text) continue;
    if (!results[i].isFinal) interim = joinText(interim, text);
    else if (final && isCumulative(final, text)) final = text;
    else final = joinText(final, text);
  }
  return { final, interim };
}

const Recognition = typeof window !== 'undefined'
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : undefined;

export const speechSupported = !!Recognition;

// Does this engine take a MediaStreamTrack (start(audioTrack))? Calls start()
// with an ended clone of the track: a supporting engine throws InvalidStateError
// and starts nothing; an older one ignores the argument and starts on the mic,
// so that session is aborted at once. Needs a track that can be cloned.
export function probeTrackInput(track) {
  if (!Recognition || !track || typeof track.clone !== 'function') return false;
  let dead;
  try { dead = track.clone(); dead.stop(); } catch { return false; }
  const rec = new Recognition();
  try {
    rec.start(dead);
  } catch (err) {
    return trackProbeVerdict(err);
  }
  try { if (typeof rec.abort === 'function') rec.abort(); else rec.stop(); } catch { /* ignore */ }
  return false;
}

// track: optional MediaStreamTrack the page already holds. Every (re)start
// listens to that same track, so no second mic stream is opened. If the engine
// refuses it, the recogniser falls back to its own mic.
export function createRecognizer({ lang, onText, onError, track = null }) {
  let rec = null;
  let useTrack = !!track;
  let active = false;
  let committed = '';
  let session = { final: '', interim: '' };
  let restarts = [];

  const emit = () => onText(joinText(committed, session.final), session.interim);

  function spawn() {
    rec = new Recognition();
    rec.lang = lang === 'nl' ? 'nl-NL' : 'en-US';
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      restarts = [];
      session = sessionText(e.results);
      emit();
    };
    rec.onerror = (e) => {
      if (!isFatalSpeechError(e.error)) return;
      active = false;
      onError && onError(e.error);
    };
    rec.onend = () => {
      committed = joinText(committed, session.final);
      session = { final: '', interim: '' };
      if (active) {
        // Guard against a restart loop when the engine keeps ending immediately.
        const now = Date.now();
        restarts = restarts.filter((t) => now - t < 2000).concat(now);
        if (restarts.length > 3) {
          active = false;
          onError && onError('restart');
          return;
        }
        try { spawn(); } catch { active = false; onError && onError('restart'); }
      } else {
        emit();
      }
    };
    if (useTrack) {
      try { rec.start(track); return; } catch { useTrack = false; }
    }
    rec.start();
  }

  return {
    supported: speechSupported,
    trackInUse: () => useTrack,
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

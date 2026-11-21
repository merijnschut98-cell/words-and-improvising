// Optional audio capture for playback. Off by default: on Android a second mic
// stream competes with speech recognition, unless both share one track (round.js).

export const recorderSupported = typeof window !== 'undefined'
  && !!(window.MediaRecorder && navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

export function createRecorder() {
  let media = null;
  let stream = null;
  let chunks = [];
  let stopping = null;
  let own = true; // we opened the stream, so we close it
  return {
    supported: recorderSupported,
    // shared: a stream the round already holds (one mic for recogniser, recorder
    // and meter); it is left open on stop, its owner closes it.
    async start(shared = null) {
      if (!recorderSupported) return false;
      try {
        own = !shared;
        stream = shared || await navigator.mediaDevices.getUserMedia({ audio: true });
        // stop() was called while the permission prompt was open: release the mic.
        if (stopping) {
          if (own) stream.getTracks().forEach((t) => t.stop());
          return false;
        }
        media = new MediaRecorder(stream);
        chunks = [];
        media.ondataavailable = (e) => e.data.size && chunks.push(e.data);
        media.start();
        return true;
      } catch {
        return false;
      }
    },
    // Idempotent: a second call gets the same blob.
    stop() {
      if (stopping) return stopping;
      stopping = new Promise((resolve) => {
        if (!media || media.state === 'inactive') return resolve(null);
        media.onstop = () => {
          if (own) stream.getTracks().forEach((t) => t.stop());
          resolve(chunks.length ? new Blob(chunks, { type: media.mimeType }) : null);
        };
        media.stop();
      });
      return stopping;
    },
  };
}

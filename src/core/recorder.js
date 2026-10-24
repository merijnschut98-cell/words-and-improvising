// Optional audio capture for playback. Off by default: on Android it can compete
// with speech recognition for the microphone.

export const recorderSupported = typeof window !== 'undefined'
  && !!(window.MediaRecorder && navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

export function createRecorder() {
  let media = null;
  let stream = null;
  let chunks = [];
  let stopping = null;
  return {
    supported: recorderSupported,
    async start() {
      if (!recorderSupported) return false;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // stop() was called while the permission prompt was open: release the mic.
        if (stopping) {
          stream.getTracks().forEach((t) => t.stop());
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
          stream.getTracks().forEach((t) => t.stop());
          resolve(chunks.length ? new Blob(chunks, { type: media.mimeType }) : null);
        };
        media.stop();
      });
      return stopping;
    },
  };
}

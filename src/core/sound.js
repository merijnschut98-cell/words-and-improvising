// Short synthesized cues (WebAudio, no assets). Muted by settings.sound === false.
export const CUES = {
  twist: [[660, 0.08], [880, 0.12]], // quick rise: something new
  switch: [[784, 0.1], [523, 0.16]], // fall: change sides
  quest: [[523, 0.08], [659, 0.08], [784, 0.14]], // small arpeggio
  best: [[523, 0.1], [784, 0.1], [1047, 0.22]], // bigger arpeggio
  lesson: [[523, 0.1], [784, 0.18]], // two soft notes rising: lesson, check or daily goal (v16)
};
CUES.medal = CUES.best; // a medal or a title reuses the bigger arpeggio (v16)

// The celebration sound (v16) is off until he turns it on (Q10), and the
// main sound setting still mutes it.
export const cheerOn = (settings) => soundOn(settings) && !!settings && settings.cheer === true;

// The one cue of a celebration: medal for a title or medal, lesson otherwise.
export function cueFor(celebration) {
  const big = celebration && celebration.big;
  if (!big) return null;
  return big.kind === 'title' || big.kind === 'medal' ? 'medal' : 'lesson';
}

export const soundOn = (settings) => !settings || settings.sound !== false;

let ctx = null;

export function play(name, settings) {
  const notes = CUES[name];
  if (!notes || !soundOn(settings)) return;
  const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
  if (!AC) return;
  try {
    ctx = ctx || new AC();
    if (ctx.state === 'suspended') Promise.resolve(ctx.resume()).catch(() => {});
    let t = ctx.currentTime + 0.01;
    for (const [freq, dur] of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
      t += dur;
    }
  } catch { /* audio is a nicety; never break a round over it */ }
}

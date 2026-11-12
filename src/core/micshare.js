// Sharing the microphone with speech recognition (pure, no DOM).
//
// On Android Chrome a second microphone user (the recorder for listen-back, or
// the loudness meter for voice variety) can leave the Web Speech API without
// audio: no error, just no results. These helpers spot that afterwards and
// decide up front whether the extra streams may run at all.
import { SILENCE } from './loudness.js';

// Fewer recognised words than this and the round is not scored (feedback.js, round.js).
export const MIN_SCORED_WORDS = 5;
// About a second of voiced 100 ms samples means he was really talking.
export const MIN_SOUND_SAMPLES = 10;

// samples: RMS values (0..1). null when there is nothing to judge.
export function soundHeard(samples) {
  if (!Array.isArray(samples) || !samples.length) return null;
  return samples.filter((v) => typeof v === 'number' && v >= SILENCE).length >= MIN_SOUND_SAMPLES;
}

// Combine several soundHeard() answers: any true wins; unknown only if all are unknown.
export function anyHeard(...vals) {
  if (vals.includes(true)) return true;
  if (vals.includes(false)) return false;
  return null;
}

// RMS per window of one decoded audio channel.
export function rmsWindows(channel, size) {
  const out = [];
  for (let i = 0; i + size <= channel.length; i += size) {
    let sum = 0;
    for (let k = i; k < i + size; k += 1) sum += channel[k] * channel[k];
    out.push(Math.sqrt(sum / size));
  }
  return out;
}

// The settings to switch off when recognition stayed (nearly) empty while
// another mic user ran and there was sound (or we could not tell). null: no clash.
export function micConflict({ transcriptWords, recorderOn, meterOn, heardSound = null }) {
  if (transcriptWords >= MIN_SCORED_WORDS) return null;
  if (!recorderOn && !meterOn) return null;
  if (heardSound === false) return null; // he was just quiet
  return [recorderOn && 'record', meterOn && 'voiceStats'].filter(Boolean);
}

// The i18n key of the notice for the settings micConflict() switched off.
export function clashNotice(keys) {
  if (keys.includes('record') && keys.includes('voiceStats')) return 'micClashBoth';
  return keys.includes('record') ? 'micClashRecord' : 'micClashVoice';
}

export function isAndroid(nav) {
  if (!nav) return false;
  if (nav.userAgentData && nav.userAgentData.platform === 'Android') return true;
  return /Android/i.test(nav.userAgent || '');
}

// Desktop browsers handle several mic streams fine; Android does not.
export const canShareMic = (nav) => !isAndroid(nav);

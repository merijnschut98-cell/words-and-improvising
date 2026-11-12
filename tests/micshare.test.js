import { test } from 'node:test';
import assert from 'node:assert/strict';
import { micConflict, soundHeard, anyHeard, isAndroid, canShareMic, rmsWindows } from '../src/core/micshare.js';

const loud = (n) => Array.from({ length: n }, () => 0.2);
const quiet = (n) => Array.from({ length: n }, () => 0.005);

test('no conflict when enough words were recognised', () => {
  assert.equal(micConflict({ transcriptWords: 5, recorderOn: true, meterOn: true, heardSound: true }), null);
  assert.equal(micConflict({ transcriptWords: 40, recorderOn: true, meterOn: false, heardSound: null }), null);
});

test('no conflict when nothing else was using the mic', () => {
  assert.equal(micConflict({ transcriptWords: 0, recorderOn: false, meterOn: false, heardSound: true }), null);
});

test('no conflict when the other stream shows he was silent', () => {
  assert.equal(micConflict({ transcriptWords: 0, recorderOn: true, meterOn: true, heardSound: false }), null);
});

test('empty transcript while the recorder ran and there was sound: turn recording off', () => {
  assert.deepEqual(micConflict({ transcriptWords: 0, recorderOn: true, meterOn: false, heardSound: true }), ['record']);
});

test('empty transcript while the meter ran: turn voice variety off', () => {
  assert.deepEqual(micConflict({ transcriptWords: 2, recorderOn: false, meterOn: true, heardSound: true }), ['voiceStats']);
});

test('both ran: both go off', () => {
  assert.deepEqual(micConflict({ transcriptWords: 0, recorderOn: true, meterOn: true, heardSound: true }), ['record', 'voiceStats']);
});

test('unknown sound level still counts as a clash (the recogniser heard nothing at all)', () => {
  assert.deepEqual(micConflict({ transcriptWords: 0, recorderOn: true, meterOn: false, heardSound: null }), ['record']);
  assert.deepEqual(micConflict({ transcriptWords: 0, recorderOn: true, meterOn: false }), ['record']);
});

test('soundHeard: about a second of voiced samples counts as sound', () => {
  assert.equal(soundHeard(null), null);
  assert.equal(soundHeard([]), null);
  assert.equal(soundHeard(quiet(300)), false);
  assert.equal(soundHeard([...quiet(200), ...loud(9)]), false);
  assert.equal(soundHeard([...quiet(200), ...loud(10)]), true);
});

test('anyHeard: true wins, then false, unknown only when all are unknown', () => {
  assert.equal(anyHeard(null, true), true);
  assert.equal(anyHeard(false, true), true);
  assert.equal(anyHeard(false, null), false);
  assert.equal(anyHeard(null, null), null);
  assert.equal(anyHeard(), null);
});

test('rmsWindows: RMS per window of a channel', () => {
  const ch = Float32Array.from([0.5, -0.5, 0.5, -0.5, 0, 0, 0, 0]);
  assert.deepEqual(rmsWindows(ch, 4), [0.5, 0]);
  assert.deepEqual(rmsWindows(new Float32Array(0), 4), []);
});

test('isAndroid: user agent or client hints', () => {
  assert.equal(isAndroid({ userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) Chrome/130 Mobile' }), true);
  assert.equal(isAndroid({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/130', userAgentData: { platform: 'Android' } }), true);
  assert.equal(isAndroid({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130' }), false);
  assert.equal(isAndroid({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605' }), false);
  assert.equal(isAndroid(undefined), false);
  assert.equal(isAndroid({}), false);
});

test('clashNotice: which notice fits, and it exists in both languages', async () => {
  const { clashNotice } = await import('../src/core/micshare.js');
  const { STRINGS } = await import('../src/i18n.js');
  assert.equal(clashNotice(['record']), 'micClashRecord');
  assert.equal(clashNotice(['voiceStats']), 'micClashVoice');
  assert.equal(clashNotice(['record', 'voiceStats']), 'micClashBoth');
  for (const key of ['micClashRecord', 'micClashVoice', 'micClashBoth', 'micShareAndroid']) {
    assert.equal(typeof STRINGS.nl[key], 'string', key);
    assert.equal(typeof STRINGS.en[key], 'string', key);
  }
  assert.match(STRINGS.nl.micClashRecord, /Opnemen staat nu uit; probeer het nog een keer/);
});

test('canShareMic: not on Android, unchanged elsewhere', () => {
  assert.equal(canShareMic({ userAgent: 'Linux; Android 13' }), false);
  assert.equal(canShareMic({ userAgent: 'Windows NT 10.0' }), true);
});

// v189: one mic stream shared through SpeechRecognition.start(track).
const ANDROID = { userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) Chrome/142 Mobile' };
const DESKTOP = { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/142' };

test('canShareMic: Android only when the recogniser takes a track', () => {
  assert.equal(canShareMic(DESKTOP), true);
  assert.equal(canShareMic(ANDROID), false);
  assert.equal(canShareMic(ANDROID, false), false);
  assert.equal(canShareMic(ANDROID, undefined), false);
  assert.equal(canShareMic(ANDROID, true), true);
  assert.equal(canShareMic(DESKTOP, false), true);
});

test('micRoute: which way the mic goes, given what the browser can do', async () => {
  const { micRoute } = await import('../src/core/micshare.js');
  // Nothing besides the recogniser wants the mic: it opens its own, as before.
  assert.equal(micRoute({ android: true, trackInput: false, extras: false }), 'mic');
  assert.equal(micRoute({ android: false, trackInput: undefined, extras: false }), 'mic');
  // Track input works: one stream for the recogniser, the recorder and the meter.
  assert.equal(micRoute({ android: true, trackInput: true, extras: true }), 'track');
  assert.equal(micRoute({ android: false, trackInput: true, extras: true }), 'track');
  // Not known yet on this browser: open the mic once and test.
  assert.equal(micRoute({ android: true, trackInput: undefined, extras: true }), 'probe');
  assert.equal(micRoute({ android: false, trackInput: undefined, extras: true }), 'probe');
  // No track input: desktop copes with a second stream, Android keeps the guard.
  assert.equal(micRoute({ android: false, trackInput: false, extras: true }), 'separate');
  assert.equal(micRoute({ android: true, trackInput: false, extras: true }), 'speech-only');
});

test('trackProbeVerdict: only the spec’s InvalidStateError for an ended track proves track input', async () => {
  const { trackProbeVerdict } = await import('../src/core/micshare.js');
  assert.equal(trackProbeVerdict({ name: 'InvalidStateError' }), true);
  // An older engine ignores the argument and starts on the mic: no throw.
  assert.equal(trackProbeVerdict(null), false);
  assert.equal(trackProbeVerdict(undefined), false);
  assert.equal(trackProbeVerdict(new TypeError('x')), false);
  assert.equal(trackProbeVerdict({ name: 'NotSupportedError' }), false);
});

test('storedTrackInput: the verdict counts only for the browser version that gave it', async () => {
  const { storedTrackInput, trackInputRecord } = await import('../src/core/micshare.js');
  const ua = ANDROID.userAgent;
  assert.equal(storedTrackInput(null, ua), undefined);
  assert.equal(storedTrackInput('not json', ua), undefined);
  assert.equal(storedTrackInput(trackInputRecord(false, ua), ua), false);
  assert.equal(storedTrackInput(trackInputRecord(true, ua), ua), true);
  // Chrome updated: test again.
  assert.equal(storedTrackInput(trackInputRecord(false, ua), ua.replace('142', '150')), undefined);
});

test('the fallback notes exist in both languages', async () => {
  const { STRINGS } = await import('../src/i18n.js');
  for (const key of ['micShareAndroid', 'micShareAndroidTest', 'lbAndroidNote']) {
    assert.equal(typeof STRINGS.nl[key], 'string', key);
    assert.equal(typeof STRINGS.en[key], 'string', key);
  }
});

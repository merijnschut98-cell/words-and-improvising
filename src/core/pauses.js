// Pause detection for the "Pause, don't fill" drill. `times` are the moments
// (ms) the live transcript grew; a long gap between two of them is a pause.

export function countPauses(times, minGapMs = 1500) {
  let n = 0;
  for (let i = 1; i < times.length; i++) if (times[i] - times[i - 1] >= minGapMs) n++;
  return n;
}

export function pauseRatio(pauses, fillers) {
  return pauses + fillers ? Math.round((pauses / (pauses + fillers)) * 100) / 100 : null;
}

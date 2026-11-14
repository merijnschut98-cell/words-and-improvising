// v14b: keeps a film's stage in step with its narration in the video.
// A stage is drawn as STAGE.render(scene, u), its moves placed at fractions of
// the scene that match the caption beats of the HTML film (beatStarts, by the
// caption's words). In the video (?render=1) the beats are timed by the
// recorded narration instead, which is longer and spread differently. This
// maps the narration time back: while beat k is being spoken (from its start to
// the next beat's), the stage runs from caption beat k's fraction to beat k+1's.
// The HTML film (no timing handed over) gets no warp here; it sets
// STAGE.nlBeats, so the player (stageU in films/_kit/timeline.mjs) runs the
// stage on the Dutch beats while the English captions follow English timing.
//
// Plain browser script: a film's build appends it after its stage script.
/* global STAGE, beatStarts */
(() => {
  const D = JSON.parse(document.getElementById('film-data').textContent);
  let atl = null;
  let film;
  // the render script hands the audio timeline to window.__film.setTiming
  Object.defineProperty(window, '__film', {
    configurable: true,
    get: () => film,
    set(v) {
      film = v;
      if (v && typeof v.setTiming === 'function') {
        const set = v.setTiming;
        v.setTiming = (a) => { atl = a; return set.call(v, a); };
      }
    },
  });
  STAGE.nlBeats = true; // this stage places its moves at the Dutch caption beats
  const inner = STAGE.render.bind(STAGE);
  STAGE.render = (si, u) => {
    const s = atl && atl.scenes[si];
    const sc = D.scenes[si];
    if (!s || !sc || !s.beats.length) return inner(si, u);
    const fr = beatStarts(sc, 'nl').map((x) => x / sc.dur);
    const t = s.start + u * s.dur;
    let k = 0;
    for (let i = 0; i < s.beats.length; i++) if (t >= s.beats[i].start) k = i;
    const a0 = k === 0 ? s.start : s.beats[k].start;
    const a1 = k + 1 < s.beats.length ? s.beats[k + 1].start : s.start + s.dur;
    const f0 = fr[k] ?? 0;
    const f1 = k + 1 < fr.length ? fr[k + 1] : 1;
    const p = Math.min(1, Math.max(0, (t - a0) / Math.max(1e-6, a1 - a0)));
    return inner(si, f0 + p * (f1 - f0));
  };
})();

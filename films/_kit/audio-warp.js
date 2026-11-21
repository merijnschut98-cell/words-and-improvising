// v14b helpers for a film's stage, inlined by a film's build.mjs before its
// stage.js (after the timeline and the kit, so span and ease are in scope).
//
// 1. The audio warp. A stage is a function of (scene, u) and times its moves to
//    the beats as the captions place them (each beat's share of the words). In
//    a video render the narration's audio timeline sets when each beat starts
//    instead, and a spoken line is often much longer than its caption. warpU
//    maps the audio's progress through a scene onto the progress the stage was
//    drawn for, beat by beat, so a move still lands on the line that names it.
//    Outside a render (the HTML film) nothing changes.
// 2. The intro: a "how it works" scene that tours the film's own world. The
//    camera holds a framing per beat and glides to the next one as that beat
//    starts.
/* global span */
const AUDIO = { atl: null };
(() => {
  // films/_kit/render.mjs hands the audio timeline to window.__film.setTiming;
  // keep a copy for the warp. The player sets window.__film after this runs.
  let film;
  try {
    Object.defineProperty(window, '__film', {
      configurable: true,
      enumerable: true,
      get() { return film; },
      set(v) {
        film = v;
        if (v && typeof v.setTiming === 'function' && !v.__warp) {
          const setTiming = v.setTiming.bind(v);
          v.setTiming = (a) => { AUDIO.atl = a; return setTiming(a); };
          v.__warp = true;
        }
      },
    });
  } catch { /* no warp: the film still plays on its caption timing */ }
})();

// designed: the beat starts (0..1) the stage was drawn for in scene si
function warpU(si, u, designed) {
  const atl = AUDIO.atl;
  const s = atl && atl.scenes && atl.scenes[si];
  if (!s || !s.beats || !s.beats.length || !(s.dur > 0)) return u;
  const xs = [0];
  const ys = [0];
  s.beats.forEach((b, k) => {
    xs.push(Math.min(1, Math.max(xs[xs.length - 1], (b.start - s.start) / s.dur)));
    ys.push(Math.min(1, Math.max(ys[ys.length - 1], designed[k] ?? ys[ys.length - 1])));
  });
  xs.push(1);
  ys.push(1);
  for (let k = 1; k < xs.length; k++) {
    if (u <= xs[k]) {
      const w = xs[k] - xs[k - 1];
      return w > 0 ? ys[k - 1] + ((ys[k] - ys[k - 1]) * (u - xs[k - 1])) / w : ys[k];
    }
  }
  return 1;
}

// Which intro beat u falls in (by the designed starts d), and how far through it.
function introBeat(u, d) {
  let k = 0;
  for (let i = 0; i < d.length; i++) if (u >= d[i]) k = i;
  const end = k + 1 < d.length ? d[k + 1] : 1;
  return { k, p: end > d[k] ? Math.min(1, Math.max(0, (u - d[k]) / (end - d[k]))) : 1 };
}

// keys[k] = [cx, cy, w], the framing of beat k; the camera glides there over
// the first `glide` of the beat. Writes the world's transform like the stages do.
function introCamera(world, keys, d, u, W, H, glide = 0.25) {
  const { k, p } = introBeat(u, d);
  const from = keys[Math.max(0, k - 1)];
  const to = keys[k];
  const e = span(p, 0, glide);
  const cx = from[0] + (to[0] - from[0]) * e;
  const cy = from[1] + (to[1] - from[1]) * e;
  const w = from[2] + (to[2] - from[2]) * e;
  const s = W / w;
  const f = (v) => (Math.round(v * 10) / 10).toString();
  const t = `translate(${f(W / 2)} ${f(H / 2)}) scale(${s.toFixed(4)}) translate(${f(-cx)} ${f(-cy)})`;
  if (world.__t !== t) { world.setAttribute('transform', t); world.__t = t; }
  return { k, p, cx, cy, s, w };
}

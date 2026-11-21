// The stage of the film "Omstellen en varianten / Changeovers and variants": a
// pure function of (scene, u). Inlined into the page after the anatomy kit
// (iso-kit functions in scope) and a preamble from build.mjs that defines P
// (projection), C (world constants, the model, the cameras, the scene lengths
// and the caption beat starts), W and H. Moves are placed per caption beat, so
// the video's narration timing (films/_kit/beatwarp.js) keeps them in step.
//
// The line is indexed: every takt all carriers move one station (the first 40 %
// of the takt) and then dwell while the stations work. c counts the takts
// gone by; carrier i stands at station k when c − i = k.
/* global P, C, W, H, solidSvg, slabOf, cylinder, dotsSvg, lineSvg, sideSeam, translateAlong, span, beatStarts, iso */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const D = JSON.parse(document.getElementById('film-data').textContent);
  const EN = document.documentElement.getAttribute('lang') === 'en';
  const tx = (nl, en) => (EN ? en : nl);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const attr = (e, name, v) => { if (e['__' + name] !== v) { e.setAttribute(name, v); e['__' + name] = v; } };
  const move = (e, by) => attr(e, 'transform', translateAlong(P, by));
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const num = (v, d = 0) => { const s = v.toFixed(d); return EN ? s : s.replace('.', ','); };
  const box = (plan, z0, z1, style = {}) => solidSvg(slabOf({ r: 0.4, ...plan }, z0, z1 - z0, P, 2, 0.2), { tone: 'mid', ...style });
  // stage-space card pieces (640 × 400; text 20 units or more, so at least 12 px on a 390 px phone)
  const T = (x, y, t, size = 20, anchor = 'start', cls = 'vr-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const panel = (x, y, w, h) => `<rect class="vr-panel" x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/>`;
  const R = (x, y, w, h, cls, rx = 3, extra = '') => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${rx}"${extra}/>`;
  const line = (x0, y0, x1, y1, cls = 'vr-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const EXAMPLE = () => tx('voorbeeld', 'example');
  const VIS = { S: 'S', M: 'M', L: 'L', A: 'S', B: 'M', C: 'L' };

  // the beat on screen and its progress
  function beatOf(si, u) {
    const sc = D.scenes[si];
    const fr = beatStarts(sc, 'nl').map((x) => x / sc.dur);
    let b = 0;
    for (let i = 0; i < fr.length; i++) if (u >= fr[i] - 1e-9) b = i;
    const a1 = b + 1 < fr.length ? fr[b + 1] : 1;
    return { b, p: clamp((u - fr[b]) / Math.max(1e-6, a1 - fr[b]), 0, 1), fr };
  }
  function camera(si, u) {
    const c = C.CAM[si];
    const e = span(u, c.a ?? 0, c.b ?? 1);
    const cx = lerp(c.from[0], c.to[0], e);
    const cy = lerp(c.from[1], c.to[1], e);
    const w = lerp(c.from[2], c.to[2], e);
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${(W / w).toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    attr(E.world, 'transform', t);
  }

  // ------------------------------------------------------------ carriers and fingers
  const TP = 2.6; // seconds per takt in the film (a sped-up line)
  const pos = (c) => { const n = Math.floor(c); return n + ease(clamp((c - n) / 0.4, 0, 1)); };
  const topOf = (v) => C.PAL.z0 + C.PAL.h + C.PROD[v].h;
  const carrierCache = {};
  function carrierSvg(v) {
    if (carrierCache[v]) return carrierCache[v];
    const h = C.PAL.half;
    const p = C.PROD[v];
    const pal = { x: -h, y: -h, w: 2 * h, d: 2 * h, r: 0.6 };
    const pr = { x: -p.w / 2, y: -p.w / 2, w: p.w, d: p.w, r: 0.8 };
    const n = v === 'S' ? 1 : v === 'M' ? 2 : 3;
    const s = box(pal, C.PAL.z0, C.PAL.z0 + C.PAL.h, { tone: 'lo', crease: 'lo' })
      + dotsSvg(Array.from({ length: n }, (_, i) => iso([-2 + i * 2, h, C.PAL.z0 + 1], P)), { size: 0.35, tone: 'hi' })
      + box(pr, C.PAL.z0 + C.PAL.h, topOf(v), { tone: 'hi', crease: 'lo', inner: lineSvg(sideSeam(pr, topOf(v) - 1.6, P, 2), { tone: 'faint' }) })
      + lineSvg(sideSeam(pr, C.PAL.z0 + C.PAL.h + 1.4, P, 2), { tone: 'faint' });
    carrierCache[v] = s;
    return s;
  }
  // carriers on the line: [{ x, v, a }] at takt position c, sequence seq (null = empty carrier slot)
  function carriers(c, seq) {
    const s = pos(c);
    const outL = [];
    for (let i = 0; i < seq.length; i++) {
      if (!seq[i]) continue;
      const x = C.X_IN + C.PITCH * (s - i);
      if (x < -118 || x > 116) continue;
      const a = clamp((x + 118) / 10, 0, 1) * clamp((116 - x) / 8, 0, 1);
      outL.push({ x, v: VIS[seq[i]], i, a });
    }
    return outL.sort((p, q) => p.x - q.x);
  }
  const carSvg = (list) => list.map((q) => `<g transform="${translateAlong(P, [q.x, 0, 0])}"${q.a < 0.999 ? ` opacity="${q.a.toFixed(2)}"` : ''}>${carrierSvg(q.v)}</g>`).join('');
  // the product at station k (1–5) at c, or null, and how far through its dwell
  function atStation(c, seq, k) {
    const n = Math.floor(c);
    const i = n - k;
    const f = c - n;
    return i >= 0 && i < seq.length && seq[i] ? { v: VIS[seq[i]], f } : null;
  }
  const fingCache = {};
  // servo: a fixed rail as wide as the widest opening, with the servo motor at its
  // downstream end, so the fingers visibly travel to the width the recipe sets
  function fingSvg(gap, side, servo) {
    const key = `${gap.toFixed(1)}${side}${servo ? 's' : ''}`;
    if (fingCache[key]) return fingCache[key];
    const F = C.FING;
    const z1 = C.SLIDE_Z;
    const rail = servo ? WIDE : gap;
    let s;
    if (side === 'B') s = box({ x: -gap / 2 - F.t, y: -F.half, w: F.t, d: 2 * F.half, r: 0.2 }, z1 - F.len, z1, { tone: 'hi', crease: 'lo' });
    else {
      s = box({ x: gap / 2, y: -F.half, w: F.t, d: 2 * F.half, r: 0.2 }, z1 - F.len, z1, { tone: 'hi', crease: 'lo' })
        + box({ x: -rail / 2 - 2, y: -4, w: rail + 4, d: 8, r: 0.4 }, z1, z1 + 1.1, {})
        + (servo ? box({ x: rail / 2 + 2, y: -3, w: 4.4, d: 6, r: 0.6 }, z1 - 1.4, z1 + 3.4, { tone: 'hi', crease: 'lo' })
          + dotsSvg([iso([rail / 2 + 6.4, 0, z1 + 1], P)], { size: 0.45, tone: 'hi' }) : '')
        + solidSvg(cylinder(0, 0, 1, z1 + 1.1, 9.5, P, 12, 0), { tone: 'mid', crease: 'none' })
        + dotsSvg([iso([-gap / 2 - 1, 4, z1 + 0.55], P), iso([gap / 2 + 1, 4, z1 + 0.55], P)], { size: 0.3 });
    }
    fingCache[key] = s;
    return s;
  }
  // st[k] = { gap, dz, a } per station
  function renderFingers(st) {
    let b = '';
    let f = '';
    st.forEach((q, k) => {
      if (q.a <= 0.01) return;
      const g = (side) => `<g transform="${translateAlong(P, [C.STN[k], 0, q.dz])}"${q.a < 0.999 ? ` opacity="${q.a.toFixed(2)}"` : ''}>${fingSvg(Math.round(q.gap * 2) / 2, side, q.servo)}</g>`;
      b += g('B');
      f += g('F');
    });
    set(E.fingB, b);
    set(E.fingF, f);
  }
  // the station works while a product dwells under it: the fingers come down onto it
  function workDip(here, gap) {
    if (!here) return 0;
    const drop = Math.max(0, C.SLIDE_Z - C.FING.len - (topOf(here.v) - 2));
    return gap >= C.PROD[here.v].w ? -drop * Math.sin(Math.PI * clamp((here.f - 0.45) / 0.5, 0, 1)) : 0;
  }
  // a change of finger sets: down and out, then the new set up and in (h 0..1)
  const swapDz = (h) => (h < 0.325 ? -8 * span(h, 0.05, 0.3) : -8 * (1 - span(h, 0.35, 0.6)));
  const swapA = (h) => (h < 0.325 ? 1 - span(h, 0.05, 0.3) : span(h, 0.35, 0.6));

  // the operator's lag at station 5, after each product of seq
  function lagsOf(seq, work, takt) { let lag = 0; return seq.map((v) => (v ? (lag = Math.max(0, lag + work[v] - takt)) : lag)); }
  function lagNow(c, seq, lags) {
    const n = Math.floor(c);
    const j = n - 5;
    if (j < 0) return { lag: 0, j: -1 };
    const prev = j > 0 ? lags[Math.min(j - 1, lags.length - 1)] : 0;
    const cur = lags[Math.min(j, lags.length - 1)];
    return { lag: prev + (cur - prev) * span(c - n, 0.4, 1), j };
  }
  const SPAN = (C.RULER.x1 - C.RULER.x0) / C.RULER.max;
  function lagMarker(lag) {
    const x = C.RULER.x0 + clamp(lag, 0, C.RULER.max) * SPAN;
    return box({ x: x - 0.7, y: C.RULER.y - 0.8, w: 1.4, d: C.RULER.d + 1.6, r: 0.2 }, 0.4, 2.4, { tone: 'hi', crease: 'lo' })
      + dotsSvg([iso([x, C.RULER.y + C.RULER.d + 0.8, 2.4], P)], { size: 0.45, tone: 'hi' });
  }

  // ------------------------------------------------------------ cards
  // s2: one shift of 420 min with n changeovers of 20 min
  function shiftCard(n, prog) {
    const x0 = 24;
    const x1 = 616;
    const k = (x1 - x0) / C.SHIFT;
    const run = (C.SHIFT - n * C.CO) / n;
    let co = '';
    let rn = '';
    let x = x0;
    const upto = x0 + (x1 - x0) * prog;
    for (let i = 0; i < n; i++) {
      const w = Math.min(run * k, Math.max(0, upto - x));
      rn += R(x, 288, w, 34, 'fp-meter', 2);
      if (w > 90) rn += T(x + w / 2, 312, tx(`serie ${i + 1}`, `batch ${i + 1}`), 20, 'middle', 'vr-inv');
      x += run * k;
      const wg = Math.min(C.CO * k, Math.max(0, upto - x));
      co += R(x, 288, wg, 34, 'vr-gap', 2);
      x += C.CO * k;
    }
    const outN = C.SHIFT - n * C.CO;
    set(E.shiftBg, panel(8, 250, 624, 144));
    const text = T(24, 278, tx(`dienst ${C.SHIFT} min`, `shift ${C.SHIFT} min`), 20, 'start', 'vr-mute') + T(616, 278, EXAMPLE(), 20, 'end', 'vr-tag')
      + T(24, 356, tx(`${n} × omstellen · ${n * C.CO} min stil`, `${n} changeovers · ${n * C.CO} min stopped`), 20, 'start', 'vr-txt')
      + T(616, 360, tx(`${outN} stuks`, `${outN} products`), 26, 'end', 'vr-big')
      + T(616, 386, n === 4 ? tx('i.p.v. 420', 'instead of 420') : tx('meer voorraad', 'more stock'), 20, 'end', 'vr-mute');
    set(E.shiftTx, text);
    set(E.shiftCo, co);
    set(E.shiftRun, rn);
  }
  // s3: the recipe on the panel
  function recipeCard(v, scanned) {
    const rows = [[tx('snelheden', 'speeds'), 0.7], [tx('posities', 'positions'), 0.5], [tx('robotprogramma', 'robot program'), 0.85], [tx('camerachecks', 'camera checks'), 0.6]];
    let s = panel(372, 18, 260, 220) + T(388, 50, tx(`Recept · ${v}`, `Recipe · ${v}`), 24, 'start', 'vr-big') + T(616, 50, EXAMPLE(), 20, 'end', 'vr-tag');
    rows.forEach(([name, w], i) => {
      const y = 86 + i * 30;
      s += T(388, y, name, 20, 'start', 'vr-mute') + R(560, y - 13, 56, 12, 'fp-meter2', 2) + R(560, y - 13, 56 * w, 12, 'fp-meter', 2);
    });
    if (scanned > 0.01) s += `<g opacity="${scanned.toFixed(2)}">${T(388, 222, tx('order gescand', 'order scanned'), 20, 'start', 'vr-txt')}<path class="vr-curve" d="M580 212l8 8l16 -18"/></g>`;
    return s;
  }
  // s4: the changeover filmed and split; rows grow in as their beats come
  const KM = 6.4;
  const STOP = 256;
  function smedCard(rows, split, slide) {
    const base = panel(8, 250, 624, 144)
      + R(24, 263, 18, 16, 'fp-meter3', 2) + T(48, 278, tx('zoeken', 'search'), 20, 'start', 'vr-mute')
      + R(130, 263, 18, 16, 'fp-meter', 2) + T(154, 278, tx('wisselen', 'swap'), 20, 'start', 'vr-mute')
      + R(250, 263, 18, 16, 'fp-meter2', 2) + T(274, 278, tx('bijstellen', 'adjust'), 20, 'start', 'vr-mute')
      + T(616, 278, EXAMPLE(), 20, 'end', 'vr-tag');
    const labels = [tx('nu', 'now'), tx('stap 1', 'step 1'), tx('stap 2', 'step 2')];
    let ext = '';
    let int = '';
    let tot = '';
    let stop = '';
    rows.forEach((g, r) => {
      if (g <= 0.01) return;
      const y = 290 + r * 28;
      const [srch, swap, adj] = C.SMED[r === 0 ? 0 : r];
      tot += T(24, y + 17, labels[r], 20, 'start', 'vr-mute');
      let x = STOP;
      if (r === 0) { int += R(x, y, 15 * KM * g, 22, 'fp-meter3', 2); x += 15 * KM; }
      else {
        // searching slides from inside the stop to before it
        const sx = r === 1 ? lerp(STOP, STOP - 15 * KM, slide) : STOP - 15 * KM;
        ext += R(sx, y, 15 * KM * g, 22, 'fp-meter3', 2);
        if (r === 1) x = lerp(STOP + 15 * KM, STOP, slide);
      }
      int += R(x, y, swap * KM * g, 22, 'fp-meter', 2);
      x += swap * KM;
      int += R(x, y, adj * KM * g, 22, 'fp-meter2', 2);
      x += adj * KM;
      const total = r === 0 ? 50 : r === 1 ? Math.round(lerp(50, 35, slide)) : srch + swap + adj;
      if (g > 0.9) tot += T(x * g + STOP * (1 - g) + 8, y + 18, String(total), 22, 'start', 'vr-big');
    });
    if (split > 0.01) {
      stop = `<g opacity="${split.toFixed(2)}">${line(STOP, 286, STOP, 372, 'vr-lim')}</g>`;
      ext = `<g opacity="${split.toFixed(2)}">${T(STOP - 8, 390, tx('extern', 'external'), 20, 'end', 'vr-txt')}</g>` + ext;
      int = `<g opacity="${split.toFixed(2)}">${T(STOP + 8, 390, tx('intern', 'internal'), 20, 'start', 'vr-txt')}</g>` + int;
    }
    set(E.smedBase, base + tot + stop);
    set(E.smedExt, ext);
    set(E.smedInt, int);
  }
  // s5: work content at station 5 against the takt
  function workCard(g, mix) {
    const x0 = 80;
    const kx = 2.6;
    const xs = (s) => x0 + s * kx;
    let s = panel(8, 250, 624, 144) + T(xs(C.TAKT), 276, `takt ${C.TAKT}`, 20, 'middle', 'vr-txt') + T(616, 276, EXAMPLE(), 20, 'end', 'vr-tag');
    ['S', 'M', 'L'].forEach((v, i) => {
      const y = 288 + i * 32;
      s += T(40, y + 19, v, 22, 'middle', 'vr-big') + R(x0, y, C.WORK[v] * kx * g, 24, 'fp-meter', 2);
    });
    s += line(xs(C.TAKT), 282, xs(C.TAKT), 386, 'vr-lim');
    if (g > 0.9) ['S', 'M', 'L'].forEach((v, i) => { s += T(xs(C.WORK[v]) + 8, 288 + i * 32 + 19, `${C.WORK[v]} s${mix > 0.5 ? ` · ${Math.round(C.MIX[v] * 100)}%` : ''}`, 20, 'start', 'vr-txt vr-halo'); });
    if (mix > 0.01) s += `<g opacity="${mix.toFixed(2)}">${line(xs(118), 380, xs(118), 392, 'vr-curve')}${T(xs(118) - 6, 390, tx('gem. 118', 'mean 118'), 20, 'end', 'vr-txt')}</g>`;
    return s;
  }
  // s5, s6: the lag after each product at station 5 (seq from index from)
  function lagCard(seq, from, lags, upto, head) {
    let s = panel(8, 250, 624, 144) + T(616, 276, EXAMPLE(), 20, 'end', 'vr-tag');
    const y60 = 386 - 60 * 0.7;
    // the operator calls for help past 60 s (a drawing threshold, not a lesson number)
    s += line(80, y60, 560, y60, 'vr-lim') + T(616, y60 + 7, tx('hulp', 'help'), 20, 'end', 'vr-mute') + line(80, 386, 600, 386, 'vr-axis');
    for (let n = 0; n < 10; n++) {
      const i = from + n;
      const x = 88 + n * 52;
      const on = i <= upto;
      s += R(x, 282, 44, 28, 'vr-tile', 4, on && i === upto ? ' data-h=""' : '') + T(x + 22, 304, seq[i], 22, 'middle', 'vr-big');
      if (on && lags[i] > 0) {
        const h = lags[i] * 0.7;
        s += R(x + 8, 386 - h, 28, h, 'fp-meter', 2) + T(x + 22, 382 - h, String(Math.round(lags[i])), 20, 'middle', 'vr-txt vr-halo');
      }
    }
    return { base: s, head: T(24, 276, head, 20, 'start', 'vr-mute') };
  }
  // s7: the pattern and the welder's lag over a day: blocks against the pattern
  function dayCard(tiles, numbers, curve) {
    // the numbers are the lesson's worked example: a welding station for e-bike frames
    let s = panel(8, 250, 624, 144) + T(24, 276, tx('lasstation e-bikes', 'e-bike welding station'), 20, 'start', 'vr-mute');
    const P6 = C.HJ.pattern;
    for (let i = 0; i < 6; i++) {
      const a = clamp(tiles * 6 - i, 0, 1);
      if (a <= 0.01) continue;
      s += `<g opacity="${a.toFixed(2)}">${R(24 + i * 40, 284, 34, 34, 'vr-tile', 4, P6[i] === 'C' ? ' data-h=""' : '')}${T(41 + i * 40, 308, P6[i], 22, 'middle', 'vr-big')}</g>`;
    }
    if (tiles > 0.9) s += T(24, 348, tx('60 × per dag', '60 × a day'), 20, 'start', 'vr-txt');
    if (numbers > 0.01) s += `<g opacity="${numbers.toFixed(2)}">${T(24, 380, tx('takt 70 s · 3 : 2 : 1', 'takt 70 s · 3 : 2 : 1'), 20, 'start', 'vr-mute')}</g>`;
    if (curve > 0.01) {
      const cx = (n) => 300 + (n / 360) * 300;
      const cy = (min) => 370 - (min / 30) * 76;
      let g = T(300, 276, tx('achterstand, min', 'lag, min'), 20, 'start', 'vr-mute') + T(616, 276, EXAMPLE(), 20, 'end', 'vr-tag');
      g += line(300, 290, 300, 370, 'vr-axis') + line(300, 370, 604, 370, 'vr-axis');
      const upto = 360 * curve;
      const pts = [[cx(0), cy(0)], [cx(Math.min(upto, 300)), cy(0)]];
      if (upto > 300) pts.push([cx(upto), cy(((upto - 300) * 30) / 60)]);
      g += `<path class="vr-lim" d="M${pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L')}"/>`;
      g += `<path class="vr-curve" d="M${f1(cx(0))} ${f1(cy(0.4))}L${f1(cx(upto))} ${f1(cy(0.4))}"/>`;
      if (curve > 0.95) g += T(540, 304, tx('blokken: 30 min', 'blocks: 30 min'), 20, 'end', 'vr-txt') + T(312, 360, tx('patroon: hooguit 30 s', 'pattern: 30 s at most'), 20, 'start', 'vr-txt');
      s += `<g opacity="${clamp(curve * 8, 0, 1).toFixed(2)}">${g}</g>`;
    }
    return s;
  }
  // s8: the build order coming to the line, the last six frozen; a rush order bounces off
  function queueCard(t, rush, cross) {
    const P6 = C.HJ.pattern;
    const step = 46;
    const shift = (t * 0.6) % 1;
    let s = panel(8, 250, 624, 144) + T(24, 278, tx('planning', 'planning'), 20, 'start', 'vr-mute') + T(616, 278, tx('lijn →', 'line →'), 20, 'end', 'vr-txt');
    const n0 = Math.floor(t * 0.6);
    for (let i = -1; i < 12; i++) {
      const x = 40 + (i + shift) * step;
      if (x < 20 || x > 570) continue;
      const a = clamp((x - 20) / 20, 0, 1) * clamp((570 - x) / 20, 0, 1);
      const letter = P6[(((11 - i - n0) % 6) + 600) % 6];
      s += `<g opacity="${a.toFixed(2)}">${R(x, 306, 38, 34, 'vr-tile', 4)}${T(x + 19, 330, letter, 22, 'middle', 'vr-big')}</g>`;
    }
    // the frozen stretch: the six tiles nearest the line
    const fx0 = 40 + 6 * step - 4;
    const fx1 = 40 + 12 * step - 8;
    s += `<path class="vr-curve" d="M${fx0} 300L${fx0} 292L${fx1} 292L${fx1} 300"/>` + T((fx0 + fx1) / 2, 284, tx('bevroren', 'frozen'), 20, 'middle', 'vr-txt');
    s += T(24, 382, EXAMPLE(), 20, 'start', 'vr-tag');
    if (rush > 0.01) {
      const y = lerp(250, 346, rush);
      s += `<g opacity="${clamp(rush * 3, 0, 1).toFixed(2)}">${R(420, y, 76, 34, 'vr-tile', 4, ' data-h=""')}${T(458, y + 24, tx('spoed', 'rush'), 20, 'middle', 'vr-big')}</g>`;
      if (cross > 0.01) s += `<g opacity="${cross.toFixed(2)}"><path class="vr-x" d="M508 ${f1(y + 4)}l26 26M534 ${f1(y + 4)}l-26 26"/></g>`;
    }
    return s;
  }

  // ------------------------------------------------------------ the scenes
  const MIXED = ['S', 'M', 'L', 'M', 'S', 'S', 'L', 'M', 'S', 'M', 'L', 'S', 'M', 'S', 'L', 'M', 'S', 'S', 'M', 'L', 'S', 'M', 'L', 'S', 'M', 'S'];
  const SEQ2 = [...Array(6).fill('S'), ...Array(5).fill(null), ...Array(16).fill('M')];
  const SEQ5 = ['M', 'S', ...C.GROUPS, 'S', 'M', 'S', 'S', 'M', 'S'];
  const LAG5 = lagsOf(SEQ5, C.WORK, C.TAKT);
  const SEQ6 = ['S', 'M', ...C.RULE, ...C.RULE];
  const LAG6 = lagsOf(SEQ6, C.WORK, C.TAKT);
  const SEQ7 = ['A', 'B', ...Array.from({ length: 5 }, () => C.HJ.pattern).flat()];
  const HUDS = ['shift', 'recipe', 'smedc', 'workc', 'lagc', 'dayc', 'queue'];
  const WIDE = 14; // fingers that take every variant (mixed scenes)

  function render(si, u) {
    camera(si, u);
    const { b, p, fr } = beatOf(si, u);
    const dur = C.dur[si];
    const t = u * dur;
    const vis = {};
    let c = 0;
    let seq = [];
    let hi = null; // carriers to light: a function of the carrier
    const st = C.STN.map(() => ({ gap: WIDE, dz: 0, a: 1, servo: false }));
    let cartX = C.CART.from;
    let floatX = null;
    let lag = null;
    let lamp = false;
    let cards = 0;

    if (si === 0) {
      seq = MIXED;
      c = 6 + t / TP;
      if (b === 1) {
        // light the nearest carrier of each variant
        const seen = {};
        hi = (q) => { if (seen[q.v] || q.x > 100 || q.x < -90) return false; seen[q.v] = true; return true; };
      }
    } else if (si === 1) {
      // a batch of S runs out, the line stands empty, the fingers change to M, the M batch runs in
      seq = SEQ2;
      const c0 = 9;
      const ta = (11 - c0) * TP;
      let tb = fr[1] * dur;
      if (tb < ta + 3) tb = ta + 3;
      c = c0 + (Math.min(t, ta) + Math.max(0, t - tb)) / TP;
      const h = clamp((t - ta) / (tb - ta), 0, 1);
      st.forEach((q) => { q.gap = h < 0.325 ? C.PROD.S.w : C.PROD.M.w; q.dz = swapDz(h); q.a = swapA(h); });
      vis.shift = span(u, 0, 0.04);
      shiftCard(b === 3 ? 2 : 4, b === 0 ? span(p, 0.1, 0.9) : b === 3 ? span(p, 0, 0.4) : 1);
    } else if (si === 2) {
      // the M batch runs; the recipe; then the line stops and the fingers change to L; the cart rolls in
      seq = Array(30).fill('M');
      const tStop = fr[2] * dur;
      c = 6 + Math.min(t, tStop) / TP;
      const h = b === 2 ? span(p, 0.1, 0.9) : b === 3 ? 1 : 0;
      st.forEach((q) => { q.gap = h < 0.325 ? C.PROD.M.w : C.PROD.L.w; q.dz = h > 0 && h < 1 ? swapDz(h) : 0; q.a = h > 0 && h < 1 ? swapA(h) : 1; });
      vis.recipe = span(u, 0, 0.04) * (b === 3 ? 1 - span(p, 0.9, 1) : 1);
      if (vis.recipe > 0.01) set(E.recipe, recipeCard(b === 0 ? 'M' : 'L', b >= 1 ? span(b === 1 ? p : 1, 0.3, 0.6) : 0));
      cartX = b === 3 ? lerp(C.CART.from, C.CART.to, span(p, 0.05, 0.6)) : C.CART.from;
    } else if (si === 3) {
      // the line stopped and empty; the changeover on the card; the cart comes before the stop; a quick swap
      seq = [];
      st.forEach((q) => { q.gap = C.PROD.L.w; });
      if (b === 3) { const h = span(p, 0.15, 0.75); st.forEach((q, k) => { const hk = clamp(h * 1.6 - k * 0.12, 0, 1); q.gap = hk < 0.325 ? C.PROD.L.w : C.PROD.M.w; q.dz = swapDz(hk); q.a = swapA(hk); }); }
      vis.smedc = span(u, 0, 0.04);
      cartX = b < 2 ? C.CART.from : b === 2 ? lerp(C.CART.from, C.CART.to, span(p, 0.1, 0.6)) : C.CART.to;
      smedCard([b === 0 ? span(p, 0.1, 0.8) : 1, b >= 2 ? (b === 2 ? span(p, 0, 0.25) : 1) : 0, b === 3 ? span(p, 0.05, 0.4) : 0], b >= 1 ? (b === 1 ? span(p, 0, 0.3) : 1) : 0, b === 2 ? span(p, 0.3, 0.8) : b > 2 ? 1 : 0);
    } else if (si === 4) {
      seq = SEQ5;
      const t3 = fr[2] * dur;
      c = 9 + (t - t3) / TP;
      const L5 = lagNow(c, SEQ5, LAG5);
      lag = L5.lag;
      lamp = lag >= 60;
      vis.workc = b < 2 ? span(u, 0, 0.04) : 0;
      if (vis.workc > 0.01) set(E.workc, workCard(b === 0 ? span(p, 0.15, 0.6) : 1, b === 1 ? span(p, 0.2, 0.5) : 0));
      vis.lagc = b >= 2 ? (b === 2 ? span(p, 0, 0.1) : 1) : 0;
      if (vis.lagc > 0.01) {
        const lc = lagCard(SEQ5, 2, LAG5, L5.j, tx('achterstand station 5, s', 'lag at station 5, s'));
        set(E.lagIn, lc.base + lc.head);
        set(E.ruleIn, '');
      }
    } else if (si === 5) {
      seq = SEQ6;
      c = 7 + t / TP;
      const L6 = lagNow(c, SEQ6, LAG6);
      lag = L6.lag;
      lamp = lag >= 60;
      vis.lagc = b === 0 ? span(p, 0, 0.1) : b === 1 ? 1 - span(p, 0, 0.3) : 0;
      if (vis.lagc > 0.01) {
        const lc = lagCard(SEQ6, 2, LAG6, L6.j, tx('na elke L minstens twee S', 'after every L at least two S'));
        set(E.lagIn, lc.base);
        set(E.ruleIn, lc.head);
      }
      floatX = b === 0 ? null : b === 1 ? lerp(C.FLOAT.from, C.FLOAT.x, span(p, 0.05, 0.6)) : C.FLOAT.x;
    } else if (si === 6) {
      seq = SEQ7;
      c = 6 + t / TP;
      vis.dayc = span(u, 0, 0.04);
      set(E.dayIn, dayCard(b === 0 ? span(p, 0.1, 0.7) : 1, b >= 1 ? (b === 1 ? span(p, 0.2, 0.5) : 1) : 0, b === 3 ? span(p, 0.1, 0.7) : 0));
      cards = b < 2 ? 0 : b === 2 ? span(p, 0.1, 0.9) * 6 : 6;
    } else if (si === 7) {
      seq = SEQ7;
      c = 4 + t / TP;
      vis.queue = b < 2 ? span(u, 0, 0.04) * (b === 1 ? 1 - span(p, 0.85, 1) : 1) : 0;
      if (vis.queue > 0.01) set(E.queueIn, queueCard(t, b === 1 ? span(p, 0.1, 0.45) : 0, b === 1 ? span(p, 0.5, 0.65) : 0));
      // flexible automation: the fingers close on every variant, set by the recipe's servo axis
      // open wide on the way down, close onto this product's width at the bottom, open again to lift
      if (b >= 2) {
        st.forEach((q, k) => {
          const here = atStation(c, seq, k + 1);
          q.servo = true;
          q.gap = here ? lerp(WIDE, C.PROD[here.v].w, span(here.f, 0.55, 0.72) * (1 - span(here.f, 0.84, 0.94))) : WIDE;
        });
      }
      cards = 6;
    }

    // carriers, the lit ones apart
    const list = carriers(c, seq);
    const lit = hi ? list.slice().reverse().filter(hi) : [];
    set(E.car, carSvg(list.filter((q) => !lit.includes(q))));
    set(E.carHi, carSvg(lit));
    set(E.carB, '');
    // the stations work on the product under them
    st.forEach((q, k) => { if (q.a >= 0.999 && q.dz === 0) q.dz = workDip(atStation(c, seq, k + 1), q.gap); });
    renderFingers(st);
    move(E.cartg, [cartX - C.CART.from, 0, 0]);
    show(E.floater, floatX !== null);
    if (floatX !== null) move(E.floater, [floatX - C.FLOAT.x, 0, 0]);
    set(E.lagm, lag === null ? '' : lagMarker(lag));
    if (E.lamp.__lit !== lamp) { E.lamp.toggleAttribute('data-lamp', lamp); E.lamp.__lit = lamp; }
    // heijunka cards in the box's slots: 1–3 dots for A, B, C
    let cs = '';
    for (let n = 0; n < Math.floor(cards + 1e-6); n++) {
      const sx = C.HBOX.x + 1.4 + n * 3.6;
      const dots = { A: 1, B: 2, C: 3 }[C.HJ.pattern[n]];
      cs += box({ x: sx + 0.2, y: C.HBOX.y + 0.8, w: 2.4, d: 0.5, r: 0.1 }, C.HBOX.z1 - 3, C.HBOX.z1 + 3, { tone: 'hi', crease: 'none' })
        + dotsSvg(Array.from({ length: dots }, (_, i) => iso([sx + 1.4, C.HBOX.y + 1.3, C.HBOX.z1 + 2.2 - i * 1.1], P)), { size: 0.3, tone: 'lo' });
    }
    set(E.cards, cs);
    for (const h of HUDS) { const a = vis[h] || 0; show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();

// The shared stage of the two Procestechniek films (eng.process.plant and
// eng.process.measure): a pure function of (scene, u). Inlined into each page
// after the anatomy kit (iso-kit functions in scope) and a preamble from
// world.mjs that defines P (projection), C (world constants plus the film's
// own: SCENES, the scene names; HUDS, its card groups; dur), CAM (one camera
// move per scene), W and H. Each film's own stage.js is put in at the
// SCENES marker below: it draws that film's cards and fills SCN[name] with
// one function per scene. Moves are placed per caption beat (beatStarts), so
// the video's narration timing (films/_kit/beatwarp.js) keeps them in step.
/* global P, C, CAM, W, H, iso, solidSvg, cylinder, span, beatStarts */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const at = (p) => iso(p, P);
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const LED = {};
  svg.querySelectorAll('[data-led]').forEach((el) => { LED[el.getAttribute('data-led')] = el; });
  // the filling valves round the carousel, drawn once at load (back ones behind the column, front ones after the bowl)
  {
    const vbody = ([x, y]) => solidSvg(cylinder(x, y, 1.8, 65, 17, P, 10), { tone: 'hi', crease: 'lo' }) + solidSvg(cylinder(x, y, 2.6, 82, 4, P, 10, 0.3), { tone: 'mid' });
    E.valvesB.innerHTML = C.VALVES_B.map(vbody).join('');
    E.valvesF.innerHTML = C.VALVES_F.map(vbody).join('');
  }
  const D = JSON.parse(document.getElementById('film-data').textContent);
  const NL = document.documentElement.getAttribute('lang') !== 'en';
  const tr = (nl, en) => (NL ? nl : en);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const f2 = (v) => v.toFixed(2);
  const fmt = (pts) => (pts.length ? 'M' + pts.map(([x, y]) => f2(x) + ' ' + f2(y)).join('L') : '');
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const flag = (e, name, on) => { if (e.hasAttribute(name) !== !!on) e.toggleAttribute(name, !!on); };
  const txt = (x, y, t, size = 21, anchor = 'start', cls = 'pl-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'pl-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const path = (pts, cls) => `<path class="${cls}" d="${fmt(pts)}"/>`;
  const circ = (x, y, r, cls) => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;
  const arrow = (pts, cls = 'pl-accl', head = 8) => {
    const [x1, y1] = pts[pts.length - 1];
    const [x0, y0] = pts[pts.length - 2];
    const a = Math.atan2(y1 - y0, x1 - x0);
    const h = (s) => [x1 - head * Math.cos(a + s), y1 - head * Math.sin(a + s)];
    return path(pts, cls) + path([h(0.5), [x1, y1], h(-0.5)], cls);
  };
  const EX = tr('voorbeeld', 'example');
  // a number as each language writes it: 1.250 and 2,5 in Dutch, 1,250 and 2.5 in English
  const num = (s) => (NL ? s : s.replace(/[.,]/g, (c) => (c === '.' ? ',' : '.')));

  // the beat on screen and its progress, from the caption beats of the scene
  function beatOf(si, u) {
    const sc = D.scenes[si];
    const fr = beatStarts(sc, 'nl').map((x) => x / sc.dur);
    let b = 0;
    for (let i = 0; i < fr.length; i++) if (u >= fr[i] - 1e-9) b = i;
    const a0 = fr[b];
    const a1 = b + 1 < fr.length ? fr[b + 1] : 1;
    return { b, p: clamp((u - a0) / Math.max(1e-6, a1 - a0), 0, 1) };
  }

  let view = { cx: 0, cy: 0, s: 1 };
  function camera(si, u) {
    const c = CAM[si];
    const k = span(u, c.a ?? 0, c.b ?? 1);
    const cx = lerp(c.from[0], c.to[0], k);
    const cy = lerp(c.from[1], c.to[1], k);
    const s = W / lerp(c.from[2], c.to[2], k);
    view = { cx, cy, s };
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
  }
  const toStage = (p) => { const [x, y] = at(p); return [(x - view.cx) * view.s + W / 2, (y - view.cy) * view.s + H / 2]; };

  // ------------------------------------------------------------ drawn parts
  // the product in the sight glass, filled to fraction f of the glass
  function levelSvg(f, mark) {
    const [nx, ny] = C.SGC;
    const t = [-ny, nx];
    const R = C.VAT.R + 0.6;
    const c = [C.VAT.c[0] + R * nx, C.VAT.c[1] + R * ny];
    const w = C.SG.w - 0.5;
    const z0 = C.SG.z0 + 0.5;
    const quad = (za, zb) => [[c[0] - w * t[0], c[1] - w * t[1], za], [c[0] + w * t[0], c[1] + w * t[1], za], [c[0] + w * t[0], c[1] + w * t[1], zb], [c[0] - w * t[0], c[1] - w * t[1], zb]].map(at);
    let out = '';
    if (f > 0.005) out += `<path class="pl-prod" d="${fmt(quad(z0, lerp(z0, C.SG.z1 - 0.5, f)))}Z"/>`;
    if (mark !== undefined) { const zm = lerp(z0, C.SG.z1 - 0.5, mark); out += `<path class="pl-accl" style="stroke-width:1.6px;stroke-dasharray:2 1.2" d="${fmt([[c[0] - (w + 3) * t[0], c[1] - (w + 3) * t[1], zm], [c[0] + (w + 3) * t[0], c[1] + (w + 3) * t[1], zm]].map(at))}"/>`; }
    return out;
  }
  // the gauge's needle: v from 0 (zero) to 1 (full scale, 4 bar)
  function needleSvg(v) {
    const a = ((-135 + 270 * v) * Math.PI) / 180;
    const [gx, gy, gz] = C.GAUGE;
    const y = gy + 0.1;
    const c = at([gx, y, gz]);
    const tip = at([gx + 4.4 * Math.sin(a), y, gz + 4.4 * Math.cos(a)]);
    const tail = at([gx - 1.2 * Math.sin(a), y, gz - 1.2 * Math.cos(a)]);
    return `<path class="pl-needle" d="${fmt([tail, tip])}"/><circle class="pl-acc" cx="${f2(c[0])}" cy="${f2(c[1])}" r="1"/>`;
  }
  // a point at fraction q along a polyline of world points
  function along(pts, q) {
    const seg = [];
    let total = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]); seg.push(l); total += l; }
    let d = clamp(q, 0, 1) * total;
    for (let i = 0; i < seg.length; i++) {
      if (d <= seg[i] || i === seg.length - 1) { const t = seg[i] ? d / seg[i] : 0; return [0, 1, 2].map((j) => lerp(pts[i][j], pts[i + 1][j], clamp(t, 0, 1))); }
      d -= seg[i];
    }
    return pts[pts.length - 1];
  }
  // a drop of juice in the holding tube at fraction q
  function dropSvg(q, ghost) {
    let out = '';
    if (ghost !== undefined) { const [x, y] = at(along(C.TUBE, ghost)); out += `<circle class="pl-acc" style="opacity:.45" cx="${f2(x)}" cy="${f2(y)}" r="1.8"/>`; }
    const [x, y] = at(along(C.TUBE, q));
    return out + `<circle class="pl-drop" cx="${f2(x)}" cy="${f2(y)}" r="2.4"/>`;
  }
  // bottles on the conveyor, moved along by s (in world units); they fade in and out at the belt's ends
  function bottlesSvg(s) {
    const b = C.BELT;
    const off = ((s % b.gap) + b.gap) % b.gap;
    let out = '';
    for (let x = b.x0 + 4 + off - b.gap; x < b.x1 - 3; x += b.gap) {
      if (x < b.x0 + 3) continue;
      const a = Math.min(1, (x - b.x0 - 3) / 8, (b.x1 - 3 - x) / 8);
      if (a <= 0.02) continue;
      const y = b.y;
      const parts = solidSvg(cylinder(x, y, 3, b.z, 13, P, 14), { tone: 'hi', crease: 'lo' })
        + solidSvg(cylinder(x, y, 3, b.z + 13, 3, P, 14, 1.6), { tone: 'hi', crease: 'lo' })
        + solidSvg(cylinder(x, y, 1.3, b.z + 16, 4, P, 10), { tone: 'mid' })
        + solidSvg(cylinder(x, y, 1.6, b.z + 20, 2, P, 10), { tone: 'lo' });
      out += a < 0.999 ? `<g opacity="${a.toFixed(2)}">${parts}</g>` : parts;
    }
    return out;
  }
  // name pills pinned to points of the drawing: [{ p: world point, t: text, n: badge text, hot }]
  function pillsSvg(items) {
    let out = '';
    for (const it of items) {
      const [x, y] = toStage(it.p);
      const w = it.t.length * 10.6 + 18;
      const left = it.left ? x - 8 - (w + 10) : x + 8;
      out += rect(left, y - 15, w + 10, 30, 'pl-panel', 15);
      out += circ(x, y, 14, 'pl-badge') + txt(x, y + 7, it.n, 20, 'middle', 'pl-badgeT');
      out += txt(it.left ? left + 8 : x + 22, y + 7, it.t, 20, 'start', it.hot ? 'pl-on' : 'pl-txt');
    }
    return out;
  }

  // ------------------------------------------------------------ the film's own scenes and cards
  const SCN = {};
  /*@SCENES@*/

  const FLOWS = ['fI', 'fA', 'fB', 'fC', 'fH', 'fR'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    const st = { flow: { fA: 1, fB: 1, fC: 1, fH: 0.7, fR: 0.7 }, level: 0.62, mark: undefined, mix: false, pump: true, gauge: 0.5, belt: clockS * 7, drop: null };
    SCN[C.SCENES[si]]({ b, p, u, clockS, st, vis });

    // ---- the drawing
    set(E.level, levelSvg(st.level, st.mark));
    set(E.needle, needleSvg(st.pump ? st.gauge : 0));
    flag(LED.mix, 'data-on', st.mix);
    flag(LED.pump, 'data-on', st.pump);
    for (const key of FLOWS) {
      const d = st.flow[key] || 0;
      fade(E[key], Math.min(1, d));
      if (d > 0.01) { const off = f1(-clockS * 9 * d); if (E[key].__o !== off) { E[key].style.strokeDashoffset = off; E[key].__o = off; } }
    }
    set(E.drop, st.drop ? dropSvg(st.drop.q, st.drop.ghost) : '');
    set(E.bottles, bottlesSvg(st.belt));
    for (const h of C.HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();

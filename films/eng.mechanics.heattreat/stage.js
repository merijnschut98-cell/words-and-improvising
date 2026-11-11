// The stage of the film "Harden, ontlaten, inzetharden / Hardening, tempering,
// case hardening": a pure function of (scene, u). Inlined into the page after
// the anatomy kit (iso-kit functions in scope) and a preamble from build.mjs
// that defines P (projection), C (world constants and the model's data), CAM
// (one camera move per scene), W and H. Moves are placed per caption beat
// (beatStarts), so the video's narration timing (films/_kit/beatwarp.js) keeps
// them in step.
/* global P, C, CAM, W, H, iso, span, beatStarts, cylinder, slabOf, solidSvg, extrude, circleRing */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const D = JSON.parse(document.getElementById('film-data').textContent);
  const NL = document.documentElement.getAttribute('lang') !== 'en';
  const tr = (nl, en) => (NL ? nl : en);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();
  const f2 = (v) => v.toFixed(2);
  const at = (p) => iso(p, P);
  const fmt = (pts) => (pts.length ? 'M' + pts.map(([x, y]) => f1(x) + ' ' + f1(y)).join('L') : '');
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const txt = (x, y, t, size = 22, anchor = 'start', cls = 'mt-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'mt-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'mt-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const dot = (x, y, r = 5, cls = 'mt-dot') => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  const op = (a, body) => (a <= 0.01 ? '' : a >= 0.999 ? body : `<g style="opacity:${a.toFixed(2)}">${body}</g>`);
  const EX = tr('voorbeeld', 'example');
  const exTag = (x = 620, y = 40, extra = '') => txt(x, y, EX + extra, 22, 'end', 'mt-mute');
  const PANEL = () => rect(204, 12, 428, 376);
  const meter = (x, y, w, v, top) => `<rect class="fp-meter" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="16" rx="3" style="opacity:.3"/><rect class="fp-meter"${top ? ' data-top=""' : ''} x="${f1(x)}" y="${f1(y)}" width="${f1(w * clamp(v, 0, 1))}" height="16" rx="3"/>`;
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

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

  function camera(si, u) {
    const c = CAM[si];
    const k = span(u, c.a ?? 0, c.b ?? 1);
    const cx = lerp(c.from[0], c.to[0], k);
    const cy = lerp(c.from[1], c.to[1], k);
    const s = W / lerp(c.from[2], c.to[2], k);
    const t = `translate(${f1(W / 2)} ${f1(H / 2)}) scale(${s.toFixed(4)}) translate(${f1(-cx)} ${f1(-cy)})`;
    if (E.world.__t !== t) { E.world.setAttribute('transform', t); E.world.__t = t; }
  }

  // ------------------------------------------------------------ the shop: hoist, work, lids, indenter
  const O = at([0, 0, 0]);
  const VX = at([1, 0, 0]).map((v, i) => v - O[i]);
  const VY = at([0, 1, 0]).map((v, i) => v - O[i]);
  const VZ = at([0, 0, 1]).map((v, i) => v - O[i]);
  const shift = (dx, dy, dz) => `translate(${f2(VX[0] * dx + VY[0] * dy + VZ[0] * dz)} ${f2(VX[1] * dx + VY[1] * dy + VZ[1] * dz)})`;
  const move = (e, t) => { if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const HXS = { HF: C.HF.x, QT: C.QT.cx, TF: C.TF.x };
  const TRAVEL = 74;
  const IN = { HF: 8, QT: 6, TF: 9 };
  const EYE = C.WORK.segs[C.WORK.segs.length - 1][1] + C.WORK.eye;
  const HOOK = EYE + C.WORK.eye + 0.6; // the hook's bearing point above the shaft's bottom
  // the rim below the work hides what is inside a furnace or the tank
  const clipAt = (x) => (Math.abs(x - C.HF.x) < 3 ? C.HF.top : Math.abs(x - C.QT.cx) < 3 ? C.QT.rim : Math.abs(x - C.TF.x) < 3 ? C.TF.top : -1e9);
  function workSvg(x, wz, clip, crack) {
    let out = '';
    for (const [a, b, r] of C.WORK.segs) {
      const z0 = Math.max(wz + a, clip);
      const z1 = wz + b;
      if (z1 <= z0 + 0.05) continue;
      out += solidSvg(cylinder(x, 0, r, z0, z1 - z0, P, 24), { tone: 'hi' });
    }
    const ez = wz + EYE;
    if (ez - C.WORK.eye > clip) {
      const pts = [];
      for (let i = 0; i <= 24; i++) { const a = (i / 24) * Math.PI * 2; pts.push(at([x + C.WORK.eye * Math.cos(a), 0, ez + C.WORK.eye * Math.sin(a)])); }
      out += `<path class="mt-eye" d="${fmt(pts)}"/>`;
    }
    if (crack > 0.01 && wz + 22 > clip) {
      const z = wz + 22;
      const pts = [[0, 0], [0.6, 1.2], [0.2, 2.2], [0.9, 3.4], [0.5, 4.6]].slice(0, 1 + Math.round(4 * crack)).map(([dx, dz]) => at([x + 1 + dx, 4.4, z - 0.2 + dz]));
      out += `<path class="mt-accl" d="${fmt(pts)}"/>`;
    }
    return out;
  }
  function hookSvg(x, hz, clip) {
    let out = '';
    // the chain: links alternating face-on and edge-on, from the hoist body down to the hook block
    const top = C.HOIST_Z;
    const bot = hz + 5;
    const from = Math.max(bot, clip);
    if (top > from) {
      let d = '';
      let i = 0;
      for (let z = top - 0.7; z > from + 0.4; z -= 1.3, i++) {
        const c = at([x, 0, z]);
        const hz2 = 0.7 * VZ[1];
        const hw = (i % 2 ? 0.25 : 0.6) * Math.hypot(VX[0], VX[1]);
        d += `M${f1(c[0] - hw)} ${f1(c[1])}a${f1(hw)} ${f1(-hz2)} 0 1 0 ${f1(2 * hw)} 0a${f1(hw)} ${f1(-hz2)} 0 1 0 ${f1(-2 * hw)} 0`;
      }
      out += `<path class="mt-chain" d="${d}"/>`;
    }
    if (hz + 2 > clip) {
      out += solidSvg(slabOf({ x: x - 2, y: -1.4, w: 4, d: 2.8, r: 0.6 }, hz + 2, 3.4, P, 3, 0.2), { tone: 'mid' });
      const pts = [[0, hz + 2], [0, hz + 0.6], [-0.2, hz - 0.6], [-1.2, hz - 1.4], [-2.2, hz - 0.8], [-2.2, hz + 0.2]].map(([dx, z]) => at([x + dx, 0, z]));
      out += `<path class="mt-hook" d="${fmt(pts)}"/>`;
    }
    return out;
  }
  // heat shimmer beside a hot part, and bubbles and wisps on the oil while quenching
  function heatSvg(x, z0, z1, ph, a) {
    if (a <= 0.01) return '';
    let d = '';
    for (const [dx, k] of [[-6, 0], [6, 1.7], [0, 3.1]]) {
      const pts = [];
      for (let z = z0; z <= z1; z += 1.2) pts.push(at([x + dx + 0.9 * Math.sin(z * 0.45 + ph * 3 + k), 2, z]));
      d += fmt(pts);
    }
    return op(a, `<path class="mt-heat" d="${d}"/>`);
  }
  function quenchSvg(ph, a) {
    if (a <= 0.01) return '';
    let out = '';
    for (let i = 0; i < 14; i++) {
      const life = (ph * 0.9 + rnd(i)) % 1;
      const ang = rnd(i + 20) * Math.PI * 2;
      const r = 5 + 9 * rnd(i + 40) * life;
      const p = at([C.QT.cx + r * Math.cos(ang), r * Math.sin(ang) * 0.9, C.QT.oil]);
      out += `<circle class="mt-bub" cx="${f1(p[0])}" cy="${f1(p[1])}" r="${f1(0.5 + 0.9 * (1 - life))}"/>`;
    }
    let d = '';
    for (const [dx, k] of [[-4, 0], [3, 2], [8, 4]]) {
      const pts = [];
      for (let z = C.QT.oil + 1; z < C.QT.oil + 16; z += 1.2) pts.push(at([C.QT.cx + dx + 1.2 * Math.sin(z * 0.5 + ph * 5 + k), 0, z]));
      d += fmt(pts);
    }
    return op(a, out + `<path class="mt-heat" d="${d}"/>`);
  }

  // the shop's state for one frame: where the hoist and the work are, the lids,
  // the heat, the oil, the indenter and the sample
  const BASE = { hx: HXS.HF, wz: TRAVEL, hz: TRAVEL + HOOK, lidH: 0, lidT: 0, hot: 0, oil: 0, crack: 0, press: 0, gear: false, heatH: 0, ph: 0 };
  // into a furnace and shut: lid opens, the work goes down, the hook lets go and rises, the lid closes
  function load(st, key, lidKey, p) {
    st.hx = HXS[key];
    st[lidKey] = span(p, 0, 0.18) * (1 - span(p, 0.84, 1));
    const down = span(p, 0.2, 0.62);
    st.wz = lerp(TRAVEL, IN[key], down);
    st.hz = p < 0.66 ? st.wz + HOOK : lerp(IN[key] + HOOK - 1.6, TRAVEL + HOOK, span(p, 0.64, 0.82));
  }
  function shop(si, b, p, u, dur) {
    const st = { ...BASE, ph: u * dur };
    if (si === 0) {
      st.press = b === 0 ? span(p, 0.3, 0.6) * (1 - span(p, 0.8, 0.98)) : b === 3 ? span(p, 0.1, 0.4) * (1 - span(p, 0.7, 0.9)) : 0;
    } else if (si === 1) {
      if (b === 0) load(st, 'HF', 'lidH', p);
      else if (b === 1) { st.wz = IN.HF; st.hz = TRAVEL + HOOK; }
      else if (b === 2) {
        st.lidH = span(p, 0, 0.1);
        const hook = span(p, 0.1, 0.18);
        const up = span(p, 0.2, 0.38);
        const go = span(p, 0.4, 0.56);
        const dn = span(p, 0.58, 0.7);
        st.hx = lerp(HXS.HF, HXS.QT, go);
        st.wz = p < 0.4 ? lerp(IN.HF, TRAVEL, up) : lerp(TRAVEL, IN.QT, dn);
        st.hz = p < 0.19 ? lerp(TRAVEL + HOOK, IN.HF + HOOK, hook) : st.wz + HOOK;
        st.hot = p > 0.19 ? 1 - span(p, 0.66, 0.74) : 0;
        st.heatH = st.lidH * (1 - span(p, 0.3, 0.5));
        st.oil = span(p, 0.66, 0.72);
      } else { st.hx = HXS.QT; st.wz = IN.QT; st.hz = IN.QT + HOOK; st.oil = 1 - span(p, 0.3, 0.9); }
    } else if (si === 2) {
      st.hx = HXS.QT;
      st.wz = lerp(IN.QT, TRAVEL, b === 0 ? span(p, 0.05, 0.45) : 1);
      st.hz = st.wz + HOOK;
      st.crack = b === 1 ? span(p, 0.25, 0.6) : b > 1 ? 1 : 0;
    } else if (si === 3) {
      st.crack = 1;
      if (b === 0) {
        const go = span(p, 0, 0.28);
        if (p < 0.3) { st.hx = lerp(HXS.QT, HXS.TF, go); st.wz = TRAVEL; st.hz = TRAVEL + HOOK; } else load(st, 'TF', 'lidT', (p - 0.3) / 0.7);
      } else { st.hx = HXS.TF; st.wz = IN.TF; st.hz = TRAVEL + HOOK; }
    } else {
      st.hx = HXS.TF; st.wz = IN.TF; st.hz = TRAVEL + HOOK; st.crack = 1;
      if (si === 6) { st.gear = true; st.press = b === 1 ? span(p, 0.15, 0.45) * (1 - span(p, 0.75, 0.95)) : 0; }
    }
    return st;
  }
  function drawShop(st) {
    move(E.hoist, shift(st.hx, 0, 0));
    const key = [st.hx, st.wz, st.hz, st.crack].map((v) => v.toFixed(3)).join();
    if (E.work.__key !== key) {
      const clip = clipAt(st.hx);
      E.work.innerHTML = workSvg(st.hx, st.wz, clip, st.crack) + hookSvg(st.hx, st.hz, clip);
      E.work.__key = key;
    }
    const lid = (F, a) => shift(0, -(F.R + F.lid * 0.6) * span(a, 0.25, 1), 7 * span(a, 0, 0.3));
    move(E.lidH, lid(C.HF, st.lidH));
    move(E.lidT, lid(C.TF, st.lidT));
    const wTop = st.wz + EYE;
    set(E.fx, heatSvg(st.hx, Math.max(st.wz, clipAt(st.hx)) + 2, wTop + 2, st.ph, st.hot)
      + heatSvg(C.HF.x, C.HF.top + 1, C.HF.top + 22, st.ph, st.heatH)
      + quenchSvg(st.ph * 0.4, st.oil));
    move(E.ind, shift(0, 0, -(C.IND.z0 - (C.ANVIL_Z + (st.gear ? 4.6 : 4.6))) * st.press));
    show(E.blk, !st.gear);
    show(E.smp, st.gear);
  }

  // the gears, built once at load: a stack of two on the bench, a slice on the anvil
  {
    const ring = (cx, cy, R, n) => {
      const out = [];
      for (let i = 0; i < n; i++) {
        const st = (Math.PI * 2) / n;
        for (const [f, r] of [[0, R - 1.2], [0.18, R - 1.2], [0.3, R], [0.55, R], [0.67, R - 1.2], [1, R - 1.2]]) out.push([cx + r * Math.cos(i * st + f * st), cy + r * Math.sin(i * st + f * st)]);
      }
      return out;
    };
    const flat = (cx, cy, r, z, n) => fmt(circleRing(cx, cy, r, n).map(([x, y]) => at([x, y, z]))) + 'Z';
    const gear = (cx, cy, R, n, z0, h, tone) => solidSvg(extrude(ring(cx, cy, R, n), z0, h, P, { convex: false }), { tone, crease: 'none' })
      + `<path class="mt-well" d="${flat(cx, cy, R * 0.28, z0 + h, 20)}"/><path class="iso-line" data-tone="lo" d="${flat(cx, cy, R * 0.28, z0 + h, 20)}"/>`
      + `<path class="iso-line" data-tone="faint" d="${flat(cx, cy, R * 0.62, z0 + h, 28)}"/>`;
    const G0 = C.GEAR;
    set(E.gearS, gear(G0.x, G0.y, G0.R, G0.teeth, C.BENCH_TOP, 3.4, 'mid') + gear(G0.x, G0.y, G0.R, G0.teeth, C.BENCH_TOP + 3.4, 3.4, 'hi'));
    set(E.smpS, gear(C.AXIS[0], C.AXIS[1], 4.6, 12, C.ANVIL_Z + 2, 2.6, 'hi'));
  }

  // ------------------------------------------------------------ the card: three indenters and their scales
  const COLS = [282, 418, 554];
  const SURF = 214;
  function indenter(i, cx, d) {
    // d: how deep the tip sits below the surface (negative: above)
    if (i === 0) {
      const r = 26;
      return rect(cx - 9, 70, 18, SURF - 2 * r - 70 + 6 + d, 'mt-tile', 3) + `<circle class="mt-solid" cx="${cx}" cy="${f1(SURF - r + d)}" r="${r}"/>`;
    }
    if (i === 1) {
      const top = SURF - 44 + d;
      return rect(cx - 9, 70, 18, top - 70 + 2, 'mt-tile', 3) + `<path class="mt-solid" d="M${cx - 25} ${f1(top)}H${cx + 25}L${cx} ${f1(SURF + d)}Z"/><path class="mt-hatch" d="M${cx} ${f1(top)}V${f1(SURF + d - 6)}"/>`;
    }
    const top = SURF - 30 + d;
    return rect(cx - 9, 70, 18, top - 70 + 2, 'mt-tile', 3) + `<path class="mt-solid" d="M${cx - 24} ${f1(top)}H${cx + 24}L${cx + 2.5} ${f1(SURF + d - 1.2)}Q${cx} ${f1(SURF + d + 0.6)} ${cx - 2.5} ${f1(SURF + d - 1.2)}Z"/>`;
  }
  function dent(i, cx, dd) {
    if (dd <= 0.2) return '';
    if (i === 0) { const r = 26; const w = Math.sqrt(Math.max(0, r * r - (r - dd) ** 2)); return `<path class="mt-panel" d="M${f1(cx - w)} ${SURF}A${r} ${r} 0 0 0 ${f1(cx + w)} ${SURF}Z"/>`; }
    if (i === 1) { const w = dd * 25 / 44; return `<path class="mt-panel" d="M${f1(cx - w)} ${SURF}L${cx} ${f1(SURF + dd)}L${f1(cx + w)} ${SURF}Z"/>`; }
    const w = dd * 24 / 30 * 1.0;
    return `<path class="mt-panel" d="M${f1(cx - w)} ${SURF}L${cx} ${f1(SURF + dd)}L${f1(cx + w)} ${SURF}Z"/>`;
  }
  function scalesSvg(press, measure, chips) {
    let out = PANEL() + exTag(620, 40);
    out += rect(214, SURF, 408, 40, 'mt-tile', 3);
    const parts = ['', '', ''];
    const DD = [13, 16, 14];
    COLS.forEach((cx, i) => {
      const dd = DD[i] * Math.min(1, press * 1.0001 + measure);
      const lifted = measure > 0 ? -28 * measure : 0;
      let s = dent(i, cx, dd);
      s += indenter(i, cx, measure > 0 ? lifted : -24 + (24 + DD[i]) * press);
      if (measure > 0.01) {
        const w = i === 0 ? Math.sqrt(26 * 26 - (26 - DD[0]) ** 2) : i === 1 ? DD[1] * 25 / 44 : DD[2] * 0.8;
        s += op(measure, i < 2 ? `<path class="mt-accl" d="M${f1(cx - w)} ${SURF - 8}H${f1(cx + w)}M${f1(cx - w)} ${SURF - 13}V${SURF - 3}M${f1(cx + w)} ${SURF - 13}V${SURF - 3}"/>`
          : `<path class="mt-accl" d="M${cx + 16} ${SURF}V${SURF + DD[2]}M${cx + 11} ${SURF}H${cx + 21}M${cx + 11} ${SURF + DD[2]}H${cx + 21}"/>`);
      }
      s += txt(cx, 288, ['HB', 'HV', 'HRC'][i], 28, 'middle', 'mt-big');
      s += op(1 - chips, txt(cx, 322, [tr('kogel', 'ball'), tr('piramide', 'pyramid'), tr('kegel', 'cone')][i], 22, 'middle', 'mt-txt')
        + txt(cx, 352, [tr('breedte', 'width'), tr('diagonaal', 'diagonal'), tr('diepte', 'depth')][i], 22, 'middle', 'mt-mute'));
      parts[i] = s;
    });
    if (chips > 0.01) {
      const chip = (x, big, word) => rect(x, 302, 196, 74, 'mt-tile', 6) + txt(x + 98, 334, big, 26, 'middle', 'mt-big') + txt(x + 98, 364, word, 22, 'middle', 'mt-txt');
      parts.push(op(chips, chip(216, `${C.HB_MILD} HB`, tr('constructiestaal', 'mild steel')) + chip(424, `${C.HRC_TOOL} HRC`, tr('gereedschap', 'tool steel'))));
    }
    return { base: out, cols: parts };
  }

  // ------------------------------------------------------------ the card: temperature against time, and the steel inside
  const OX = 258;
  const OY = 300;
  const XR = 470;
  const YT = 64;
  const ex = (t) => OX + (XR - OX) * t;
  const sy = (T) => OY - (OY - YT) * T / 1000;
  function ptBase(ticks, bands) {
    let out = PANEL() + exTag(620, 40, tr(' · niet op schaal', ' · not to scale'));
    for (const [a, b, on] of bands) out += `<rect class="${on ? 'mt-accf' : 'mt-band'}" x="${OX}" y="${f1(sy(b))}" width="${XR - OX}" height="${f1(sy(a) - sy(b))}"${on ? ' style="stroke:none"' : ''}/>`;
    out += line(OX, YT - 10, OX, OY) + line(OX, OY, XR, OY);
    out += txt(OX - 8, YT - 14, '°C', 22, 'end', 'mt-mute');
    out += txt(XR, OY + 30, tr('tijd →', 'time →'), 22, 'end', 'mt-mute');
    for (const T of ticks) out += txt(OX - 8, sy(T) + 8, String(T), 22, 'end', 'mt-mute');
    return out;
  }
  // the path drawn up to time t, and its point
  function pathTo(pts, t) {
    const out = [[ex(pts[0][0]), sy(pts[0][1])]];
    let cur = pts[0];
    for (let i = 1; i < pts.length; i++) {
      const [ta, Ta] = pts[i - 1];
      const [tb, Tb] = pts[i];
      if (t >= tb) { out.push([ex(tb), sy(Tb)]); cur = pts[i]; continue; }
      if (t > ta) { const k = (t - ta) / (tb - ta); cur = [t, lerp(Ta, Tb, k)]; out.push([ex(cur[0]), sy(cur[1])]); }
      break;
    }
    return { d: fmt(out), p: [ex(cur[0]), sy(cur[1])], T: cur[1] };
  }
  const pathEnd = (pts) => pts[pts.length - 1][0];
  // the grains: a fixed tiling cut from a circle, built once at load
  const GC = [552, 122];
  const GR = 56;
  const GRAINS = (() => {
    const seeds = [];
    for (let i = 0; i < 26; i++) {
      const a = i * 2.39996;
      const r = GR * 1.05 * Math.sqrt((i + 0.5) / 26);
      seeds.push([GC[0] + r * Math.cos(a) + (rnd(i) - 0.5) * 6, GC[1] + r * Math.sin(a) + (rnd(i + 9) - 0.5) * 6]);
    }
    const circle = [];
    for (let i = 0; i < 40; i++) { const a = (i / 40) * Math.PI * 2; circle.push([GC[0] + GR * Math.cos(a), GC[1] + GR * Math.sin(a)]); }
    const cut = (poly, [nx, ny], c) => {
      const out = [];
      for (let i = 0; i < poly.length; i++) {
        const A = poly[i];
        const B = poly[(i + 1) % poly.length];
        const da = A[0] * nx + A[1] * ny - c;
        const db = B[0] * nx + B[1] * ny - c;
        if (da <= 0) out.push(A);
        if (da * db < 0) { const k = da / (da - db); out.push([lerp(A[0], B[0], k), lerp(A[1], B[1], k)]); }
      }
      return out;
    };
    return seeds.map((s, i) => {
      let poly = circle;
      seeds.forEach((q, j) => {
        if (i === j) return;
        const n = [q[0] - s[0], q[1] - s[1]];
        poly = cut(poly, n, (n[0] * (q[0] + s[0]) + n[1] * (q[1] + s[1])) / 2);
      });
      return { poly, c: s };
    }).filter((g) => g.poly.length > 2);
  })();
  // a line through a convex cell: the chord along direction a through point q
  function chord(poly, q, a) {
    const d = [Math.cos(a), Math.sin(a)];
    let lo = -1e9;
    let hi = 1e9;
    for (let i = 0; i < poly.length; i++) {
      const A = poly[i];
      const B = poly[(i + 1) % poly.length];
      const e = [B[0] - A[0], B[1] - A[1]];
      const n = [e[1], -e[0]];
      const den = n[0] * d[0] + n[1] * d[1];
      const num = n[0] * (A[0] - q[0]) + n[1] * (A[1] - q[1]);
      const area = (poly[1][0] - poly[0][0]) * (poly[2][1] - poly[0][1]) - (poly[1][1] - poly[0][1]) * (poly[2][0] - poly[0][0]);
      const sgn = area > 0 ? -1 : 1;
      if (Math.abs(den) < 1e-9) continue;
      const t = num / den;
      if (sgn * den > 0) lo = Math.max(lo, t); else hi = Math.min(hi, t);
    }
    if (hi - lo < 1) return '';
    const m = 1.5;
    return `M${f1(q[0] + d[0] * (lo + m))} ${f1(q[1] + d[1] * (lo + m))}L${f1(q[0] + d[0] * (hi - m))} ${f1(q[1] + d[1] * (hi - m))}`;
  }
  const GRAIN_SVG = {};
  function grainSvg(kind) {
    if (GRAIN_SVG[kind]) return GRAIN_SVG[kind];
    let cells = '';
    let marks = '';
    let dots = '';
    GRAINS.forEach((g, i) => {
      cells += fmt(g.poly) + 'Z';
      const a0 = rnd(i + 3) * Math.PI;
      if (kind === 'pearlite' && i % 3 === 0) for (let k = -3; k <= 3; k++) marks += chord(g.poly, [g.c[0] + Math.cos(a0 + Math.PI / 2) * k * 3.4, g.c[1] + Math.sin(a0 + Math.PI / 2) * k * 3.4], a0);
      if (kind === 'austenite' && i % 5 === 1) for (const k of [-2, 2]) marks += chord(g.poly, [g.c[0] + Math.cos(a0 + Math.PI / 2) * k, g.c[1] + Math.sin(a0 + Math.PI / 2) * k], a0);
      if (kind === 'martensite' || kind === 'tempered') {
        for (let k = 0; k < 4; k++) {
          const a = a0 + (k % 2 ? Math.PI / 3 : -Math.PI / 4) + (rnd(i * 7 + k) - 0.5) * 0.3;
          marks += chord(g.poly, [g.c[0] + (rnd(i * 5 + k) - 0.5) * 8, g.c[1] + (rnd(i * 3 + k) - 0.5) * 8], a);
        }
        if (kind === 'tempered') for (let k = 0; k < 4; k++) dots += dot(g.c[0] + (rnd(i * 11 + k) - 0.5) * 10, g.c[1] + (rnd(i * 13 + k) - 0.5) * 10, 1.4);
      }
    });
    const ring = `<circle class="mt-solid" cx="${GC[0]}" cy="${GC[1]}" r="${GR}" style="fill:none;stroke-width:2"/>`;
    GRAIN_SVG[kind] = `<path class="mt-grain" d="${cells}"/>` + (marks ? `<path class="${kind === 'tempered' ? 'mt-ghost' : 'mt-thin'}" d="${marks}"/>` : '') + dots + ring;
    return GRAIN_SVG[kind];
  }
  const GRAIN_NAME = { pearlite: ['perliet', 'pearlite'], austenite: ['austeniet', 'austenite'], martensite: ['martensiet', 'martensite'], tempered: ['ontlaten', 'tempered'], soft: ['zacht', 'soft'] };
  // from: a kind, to: a kind, k: 0..1 crossfade, name: an override label
  function grainsAt(from, to, k, name) {
    const lab = name || GRAIN_NAME[k < 0.5 ? from : to];
    const g = (kind) => grainSvg(kind === 'soft' ? 'pearlite' : kind);
    const pic = k <= 0.01 ? g(from) : k >= 0.99 ? g(to) : op(1 - k, g(from)) + op(k, g(to));
    return pic + txt(GC[0], GC[1] + GR + 30, tr(lab[0], lab[1]), 22, 'middle', 'mt-txt');
  }
  function meters(hard, tough, a) {
    if (a <= 0.01) return '';
    return op(a, txt(484, 262, tr('hardheid', 'hardness'), 22, 'start', 'mt-txt') + meter(484, 270, 136, hard, true)
      + txt(484, 318, tr('taaiheid', 'toughness'), 22, 'start', 'mt-txt') + meter(484, 326, 136, tough, false));
  }

  // ------------------------------------------------------------ the card: distortion, a quench crack, the quenchants
  function warpSvg(bow, crack, round, media) {
    let out = PANEL() + exTag(620, 40);
    const yC = 130;
    const off = (x) => bow * 16 * Math.sin(Math.PI * (x - 230) / 380);
    const prof = [[230, 22], [440, 22], [440, 36], [520, 36], [520, 16], [610, 16]];
    const topE = [];
    const botE = [];
    const R = 10 * round;
    for (let x = 230; x <= 610; x += 5) {
      let r = x < 440 ? 22 : x < 520 ? 36 : 16;
      if (R > 0.5 && x < 440 && x > 440 - R) r = 22 + (R - Math.sqrt(Math.max(0, R * R - (x - 440 + R) ** 2)));
      topE.push([x, yC - r - off(x)]);
      botE.push([x, yC + r - off(x)]);
    }
    void prof;
    out += `<path class="mt-solid" d="${fmt([...topE, ...botE.reverse()])}Z"/>`;
    out += `<path class="mt-hatch" d="M230 ${f1(yC - off(230))}${[...Array(38)].map((_, i) => `L${235 + i * 10} ${f1(yC - off(235 + i * 10))}`).join('')}" style="stroke-dasharray:8 5"/>`;
    if (bow > 0.01) out += op(Math.min(1, bow * 2), `<path class="mt-lim" d="M226 ${yC - 22}H444"/>` + txt(230, 246, tr('vervorming (overdreven)', 'distortion (exaggerated)'), 22, 'start', 'mt-txt'));
    if (crack > 0.01 && round < 0.5) {
      const pts = [[440, yC + 22], [446, yC + 28], [443, yC + 33], [452, yC + 40], [449, yC + 46]].slice(0, 1 + Math.round(4 * crack)).map(([x, y]) => [x, y - off(x)]);
      out += `<path class="mt-accl" d="${fmt(pts)}"/>` + op(crack, txt(458, 214, tr('hardingsscheur', 'quench crack'), 22, 'start', 'mt-on'));
    }
    if (round > 0.01) out += op(round, `<circle class="mt-accl" cx="434" cy="${f1(yC + 28 - off(434))}" r="13" style="fill:none"/>` + txt(458, 214, tr('afronding', 'radius'), 22, 'start', 'mt-on'));
    if (media > 0.01) {
      const tile = (x, name, v, top) => rect(x, 292, 128, 84, 'mt-tile', 6) + txt(x + 64, 326, name, 22, 'middle', 'mt-big') + meter(x + 14, 344, 100, v, top);
      out += op(media, tile(216, tr('water', 'water'), 1, true) + tile(352, tr('polymeer', 'polymer'), 0.62, false) + tile(488, tr('olie', 'oil'), 0.38, false)
        + txt(418, 276, tr('hoe snel het koelt', 'how fast it cools'), 22, 'middle', 'mt-mute'));
    }
    return out;
  }

  // ------------------------------------------------------------ the card: a welded part that warps after machining
  function frameSvg(cut, bow, relieved, steps) {
    let out = PANEL() + exTag(620, 40);
    const yb = 250;
    const off = (x) => bow * 14 * (1 - ((x - 420) / 180) ** 2);
    const band = (x0, x1, y0, y1) => { const top = []; const bot = []; for (let x = x0; x <= x1; x += 10) { top.push([x, y0 - off(x)]); bot.push([x, y1 - off(x)]); } return `<path class="mt-solid" d="${fmt([...top, ...bot.reverse()])}Z"/>`; };
    out += band(240, 600, yb - 18, yb);
    for (const x of [270, 420, 570]) {
      out += `<path class="mt-solid" d="M${x - 7} ${f1(yb - 18 - off(x))}V${f1(160 - off(x))}H${x + 7}V${f1(yb - 18 - off(x))}Z"/>`;
      for (const s of [-1, 1]) out += `<path class="mt-accf" d="M${x + s * 7} ${f1(yb - 18 - off(x))}l${s * 9} 0l${-s * 9} -9Z" style="stroke-width:1"/>`;
    }
    const topH = 16 - 6 * cut;
    out += band(240, 600, 160 - topH, 160);
    if (cut > 0.01 && cut < 0.99) {
      const cx = 240 + 360 * cut;
      out += `<circle class="mt-tile" cx="${f1(cx)}" cy="${f1(160 - topH - 26 - off(cx))}" r="22"/><path class="mt-hatch" d="M${f1(cx)} ${f1(160 - topH - 26 - off(cx))}m-14 0h28m-14 -14v28"/>`;
    }
    if (bow > 0.01) out += op(Math.min(1, bow * 2), `<path class="mt-lim" d="M232 ${yb}H608"/>` + txt(240, 296, tr('trekt krom (overdreven)', 'warps (exaggerated)'), 22, 'start', 'mt-txt'));
    if (relieved > 0.01) out += op(relieved, rect(222, 84, 210, 40, 'mt-accf', 6) + txt(327, 112, tr('spanningsarm', 'stress relieved'), 22, 'middle', 'mt-on'));
    if (steps > 0.01) out += op(steps, txt(420, 352, tr('lassen · gloeien · verspanen', 'weld · relieve · machine'), 22, 'middle', 'mt-big'));
    return out;
  }

  // ------------------------------------------------------------ the card: a gear tooth with its case
  const TOOTH = (() => {
    const pts = [[214, 236]];
    for (const cx of [292, 418, 544]) pts.push([cx - 48, 236], [cx - 34, 176], [cx - 20, 96], [cx + 20, 96], [cx + 34, 176], [cx + 48, 236]);
    pts.push([622, 236]);
    return pts;
  })();
  function caseSvg(caseA, method, prog, ph) {
    let out = PANEL() + exTag(620, 40);
    const prof = fmt(TOOTH);
    const body = `${prof}L622 268L214 268Z`;
    out += `<clipPath id="htTooth"><path d="${body}"/></clipPath>`;
    out += `<path class="mt-solid" d="${body}"/>`;
    out += `<path class="mt-hatch" style="opacity:.5" d="M232 268l12 -12M282 268l12 -12M332 268l12 -12M382 268l12 -12M432 268l12 -12M482 268l12 -12M532 268l12 -12M582 268l12 -12"/>`;
    if (caseA > 0.01) out += op(caseA, `<path d="${prof}" clip-path="url(#htTooth)" style="fill:none;stroke:var(--fp-accent);stroke-opacity:.55;stroke-width:${f1(20 * Math.max(0.15, prog))};stroke-linejoin:round"/>`
      + (method ? '' : txt(418, 70, tr('harde huid', 'hard case'), 22, 'middle', 'mt-on')) + txt(418, 262, tr('taaie kern', 'tough core'), 22, 'middle', 'mt-big'));
    // what goes in: carbon (C) or nitrogen (N) dots drifting into the surface, or a coil above the teeth
    if (method === 1 || method === 2) {
      let d = '';
      for (let i = 0; i < 9; i++) {
        const life = (ph * 0.3 + i * 0.37) % 1;
        const x = [292, 418, 544][i % 3] + (Math.floor(i / 3) - 1) * 20;
        const a = Math.min(1, life * 4, (1 - life) * 4);
        d += op(a, txt(x, 58 + 30 * life, method === 1 ? 'C' : 'N', 22, 'middle', 'mt-mute'));
      }
      out += d;
    }
    if (method === 3) {
      let d = '';
      for (const cx of [292, 418, 544]) d += `M${cx - 40} 82Q${cx} 60 ${cx + 40} 82`;
      out += `<path class="mt-accl" d="${d}"/>`;
    }
    const tile = (x, name, val, on) => rect(x, 290, 132, 86, on ? 'mt-accf' : 'mt-tile', 6) + txt(x + 66, 322, name, 22, 'middle', on ? 'mt-on' : 'mt-big') + txt(x + 66, 356, val, 22, 'middle', 'mt-txt');
    out += tile(214, tr('inzetten', 'carburise'), `≈ ${C.CARB} °C`, method === 1) + tile(352, tr('nitreren', 'nitride'), `≈ ${C.NITR} °C`, method === 2) + tile(490, tr('inductie', 'induction'), tr('spoel', 'coil'), method === 3);
    return out;
  }

  // ------------------------------------------------------------ the card: the hardness profile of the worked example
  const QX = 262;
  const QY = 262;
  const QR = 604;
  const QT0 = 76;
  const dx = (d) => QX + (QR - QX) * d / 2;
  const hy = (h) => QY - (QY - QT0) * (h - 20) / 46;
  const specCurve = (d) => (d < 0.6 ? 61 : 61 - 26 * Math.min(1, (d - 0.6) / 1.1) ** 1.3);
  const measCurve = (d) => C.MEAS - 13 * Math.min(1, d / 0.7) ** 1.2;
  function profSvg(spec, meas, prog, ask) {
    let out = PANEL() + exTag(620, 40);
    out += `<rect class="mt-band" x="${f1(dx(C.SPEC.case[0]))}" y="${QT0}" width="${f1(dx(C.SPEC.case[1]) - dx(C.SPEC.case[0]))}" height="${QY - QT0}"/>`;
    out += line(QX, QT0 - 10, QX, QY) + line(QX, QY, QR, QY);
    out += txt(QX + 8, QT0 - 18, tr('hardheid', 'hardness'), 22, 'start', 'mt-mute');
    for (const d of [0, 1, 2]) out += txt(dx(d), QY + 28, String(d), 22, 'middle', 'mt-mute');
    out += txt(QX, QY + 58, tr('diepte (mm) →', 'depth (mm) →'), 22, 'start', 'mt-mute');
    const fmtNum = (v) => (NL ? String(v).replace('.', ',') : String(v));
    out += txt(dx(1), QT0 - 18, `${fmtNum(C.SPEC.case[0])}–${fmtNum(C.SPEC.case[1])} mm`, 22, 'middle', 'mt-txt');
    if (spec > 0.01) {
      const pts = [];
      for (let d = 0; d <= 2.001; d += 0.05) pts.push([dx(d), hy(specCurve(d))]);
      out += op(spec, `<rect class="mt-accf" x="${QX}" y="${f1(hy(C.SPEC.hrc[1]))}" width="${f1(dx(0.6) - QX)}" height="${f1(hy(C.SPEC.hrc[0]) - hy(C.SPEC.hrc[1]))}" style="stroke:none"/><path class="mt-ghost" d="${fmt(pts)}"/>`
        + txt(dx(0.62) + 8, hy(C.SPEC.hrc[1]) + 8, `${tr('eis', 'spec')} ${C.SPEC.hrc[0]}–${C.SPEC.hrc[1]} HRC`, 22, 'start', 'mt-txt'));
    }
    if (meas > 0.01) {
      const pts = [];
      const end = 2 * prog;
      for (let d = 0; d <= end + 1e-9; d += 0.05) pts.push([dx(d), hy(measCurve(d))]);
      out += op(meas, (pts.length > 1 ? `<path class="mt-accl" d="${fmt(pts)}"/>` : '') + dot(dx(0), hy(C.MEAS), 6.5, 'mt-acc')
        + txt(dx(0) + 14, hy(C.MEAS) - 14, `${tr('gemeten', 'measured')} ${C.MEAS} HRC`, 22, 'start', 'mt-on'));
    }
    if (ask > 0.01) out += op(ask, rect(222, 332, 392, 46, 'mt-accf', 6) + txt(418, 363, tr('vraag de ovenregistratie', 'ask for the furnace record'), 22, 'middle', 'mt-on'));
    return out;
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['scales', 'path', 'warp', 'frame', 'case', 'prof'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const dur = D.scenes[si].dur;
    drawShop(shop(si, b, p, u, dur));
    const vis = {};
    const ph = u * dur;
    if (si === 0) {
      vis.scales = b >= 1 ? (b === 1 ? span(p, 0, 0.12) : 1) : 0;
      if (vis.scales > 0.01) {
        const press = b === 1 ? span(p, 0.15, 0.55) : 1;
        const measure = b === 1 ? span(p, 0.65, 0.9) : 1;
        const chips = b >= 2 ? (b === 2 ? span(p, 0.05, 0.3) : 1) : 0;
        const sc = scalesSvg(press, measure, chips);
        set(E.scIn, sc.base + (sc.cols[3] || ''));
        set(E.scBall, sc.cols[0]);
        set(E.scPyr, sc.cols[1]);
        set(E.scCone, sc.cols[2]);
        set(E.scChips, '');
      }
    } else if (si === 1 || si === 3 || si === 4) {
      vis.path = si === 4 ? (b <= 1 ? 1 : 1 - span(p, 0, 0.12) * (b === 2 ? 1 : 1)) : span(u, 0, 0.05);
      if (si === 4 && b >= 2) vis.path = 0;
      vis.frame = si === 4 && b >= 2 ? (b === 2 ? span(p, 0, 0.12) : 1) : 0;
      let ticks = [];
      let bands = [];
      let l1 = '';
      let l2 = '';
      let grain = '';
      let met = '';
      if (si === 1) {
        // the path follows the shop: up while the furnace heats, the drop at the quench
        const hEnd = C.PATH.harden;
        const t = b === 0 ? 0.05 * span(p, 0.2, 1) : b === 1 ? lerp(0.05, 0.42, span(p, 0.05, 0.95)) : b === 2 ? lerp(0.42, 0.47, span(p, 0.62, 0.74)) : lerp(0.47, pathEnd(hEnd), span(p, 0, 0.4));
        const pt = pathTo(hEnd, t);
        ticks = b >= 1 ? C.HARDEN : [];
        bands = [[C.HARDEN[0], C.HARDEN[1], b >= 1]];
        l1 = `<path class="mt-line" d="${pt.d}"/>` + dot(pt.p[0], pt.p[1], 5.5);
        if (b <= 1) {
          const k = b === 0 ? 0 : clamp((pt.T - 720) / 100, 0, 1);
          grain = grainsAt('pearlite', 'austenite', k);
        } else grain = grainsAt('austenite', 'martensite', b === 2 ? span(p, 0.7, 0.8) : 1);
        const q = b === 3 ? 1 : b === 2 ? span(p, 0.7, 0.8) : 0;
        met = meters(lerp(0.3, 0.95, q), lerp(0.75, 0.12, q), b >= 2 ? 1 : b === 1 ? span(p, 0.6, 0.9) : 0);
      } else if (si === 3) {
        const hard = C.PATH.harden;
        const temperT = b === 2 ? (p < 0.5 ? 200 : 600) : 600;
        const tp = C.PATH.temper.map(([tt, T], i) => [tt, i === 1 || i === 2 ? temperT : T]);
        const t = b === 0 ? lerp(0.52, 0.66, span(p, 0.45, 1)) : b === 1 ? lerp(0.66, 0.82, span(p, 0, 0.9)) : b === 2 ? 0.82 : lerp(0.82, 1, span(p, 0, 0.5));
        const pt = pathTo(tp, t);
        ticks = C.TEMPER;
        bands = [[C.HARDEN[0], C.HARDEN[1], false], [C.TEMPER[0], C.TEMPER[1], true]];
        l1 = `<path class="mt-ghost" d="${pathTo(hard, 1).d}"/><path class="mt-line" d="${pt.d}"/>` + dot(pt.p[0], pt.p[1], 5.5);
        if (b === 2) {
          const low = p < 0.5;
          grain = grainsAt('tempered', 'tempered', 0, low ? ['gereedschap', 'tools'] : ['assen', 'shafts']);
          const k = span(p, 0.45, 0.6);
          met = meters(lerp(0.88, 0.55, k), lerp(0.35, 0.8, k), 1);
        } else {
          const k = b === 0 ? span(p, 0.7, 1) : 1;
          grain = grainsAt('martensite', 'tempered', k);
          met = meters(lerp(0.95, 0.62, k), lerp(0.12, 0.7, k), 1);
        }
      } else {
        const t1 = b === 0 ? span(p, 0.1, 0.95) : 1;
        const t2 = b === 1 ? span(p, 0.15, 0.9) : b > 1 ? 1 : 0;
        ticks = b === 0 ? C.HARDEN : C.RELIEF;
        bands = b === 0 ? [[C.HARDEN[0], C.HARDEN[1], false]] : [[C.RELIEF[0], C.RELIEF[1], true]];
        const a = pathTo(C.PATH.anneal, t1);
        l1 = `<path class="mt-line" d="${a.d}"/>` + (b === 0 ? dot(a.p[0], a.p[1], 5.5) : '') + op(t1 > 0.6 ? 1 : 0, txt(ex(0.62), sy(240), tr('langzaam', 'slowly'), 22, 'end', 'mt-txt'));
        if (t2 > 0.01) { const r = pathTo(C.PATH.relief, t2); l2 = `<path class="mt-line" d="${r.d}" style="stroke-dasharray:7 5"/>` + dot(r.p[0], r.p[1], 5.5); }
        grain = grainsAt('soft', 'soft', 0);
      }
      set(E.ptBase, ptBase(ticks, []));
      set(E.ptBands, bands.map(([a, bb, on]) => `<rect class="${on ? 'mt-accf' : 'mt-band'}" x="${OX + 1}" y="${f1(sy(bb))}" width="${XR - OX - 1}" height="${f1(sy(a) - sy(bb))}" style="stroke:none"/>`).join(''));
      set(E.ptLine, l1);
      set(E.ptLine2, l2);
      set(E.ptGrain, grain);
      set(E.ptMeter, met);
      if (vis.frame > 0.01) {
        const cut = b === 2 ? span(p, 0.15, 0.55) : span(p, 0.3, 0.7);
        const bow = b === 2 ? span(p, 0.6, 0.85) : 0;
        set(E.frIn, frameSvg(cut, bow, b === 3 ? span(p, 0, 0.2) : 0, b === 3 ? span(p, 0.6, 0.85) : 0));
      }
    } else if (si === 2) {
      vis.warp = span(u, 0, 0.05);
      const bow = b === 0 ? span(p, 0.4, 0.8) : b < 3 ? 1 : 1 - span(p, 0, 0.3);
      const crack = b === 1 ? span(p, 0.25, 0.6) : b === 2 ? 1 : b === 3 ? 1 - span(p, 0, 0.2) : 0;
      set(E.wpIn, warpSvg(bow, crack, b === 3 ? span(p, 0.15, 0.4) : 0, b >= 2 ? (b === 2 ? span(p, 0.05, 0.3) : 1 - span(p, 0, 0.15)) : 0));
    } else if (si === 5) {
      vis.case = span(u, 0, 0.05);
      const method = b === 0 ? 0 : b;
      const prog = b === 0 ? span(p, 0.3, 0.8) : b === 1 ? 0.2 + 0.8 * span(p, 0.2, 0.9) : b === 2 ? 0.45 : 0.2 + 0.8 * span(p, 0.3, 0.8);
      set(E.csTooth, caseSvg(b === 0 ? span(p, 0.2, 0.5) : 1, method, prog, ph));
      set(E.csTiles, '');
    } else if (si === 6) {
      vis.prof = span(u, 0, 0.05);
      set(E.pfIn, profSvg(1, b >= 1 ? (b === 1 ? span(p, 0.4, 0.6) : 1) : 0, b === 2 ? span(p, 0.2, 0.9) : b > 2 ? 1 : 0, b === 3 ? span(p, 0.2, 0.45) : 0));
    }
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();

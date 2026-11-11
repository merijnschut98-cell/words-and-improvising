// The stage of the film "Een proceslijn lezen / Reading a process line": a pure
// function of (scene, u). Inlined into the page after the anatomy kit (iso-kit
// functions in scope) and a preamble from build.mjs that defines P
// (projection), C (world constants), CAM (one camera move per scene), W and H.
// Moves are placed per caption beat (beatStarts), so the video's narration
// timing (films/_kit/beatwarp.js) keeps them in step.
/* global P, C, CAM, W, H, iso, solidSvg, cylinder, translateAlong, depthOf, span, beatStarts */
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

  // ------------------------------------------------------------ HUD panels
  const STEPS = NL ? ['mengen', 'pompen', 'verhitten', 'heethouden', 'koelen'] : ['mixing', 'pumping', 'heating', 'holding', 'cooling'];
  const SPOTS = [[-160, 0, 196], [-90, 0, 100], [32, 0, 116], [100, 12, 96], [232, 0, 104]];
  // the title card: what the numbered steps are, and what comes after them
  function stepsSvg() {
    let out = rect(392, 12, 236, 84);
    out += txt(408, 44, 'unit operations', 21, 'start', 'pl-big');
    out += txt(408, 78, tr('daarna: afvullen', 'then: filling'), 20, 'start', 'pl-mute');
    return out;
  }
  // a numbered badge at each unit operation, with its name on a pill; the one being named is lit
  function badgesSvg(n, hot) {
    let out = '';
    SPOTS.forEach((p, i) => {
      if (i >= n) return;
      const [x, y] = toStage(p);
      const w = STEPS[i].length * 11 + 18;
      out += rect(x + 8, y - 15, w + 10, 30, 'pl-panel', 15);
      out += circ(x, y, 14, 'pl-badge') + txt(x, y + 7, String(i + 1), 20, 'middle', 'pl-badgeT');
      out += txt(x + 22, y + 7, STEPS[i], 20, 'start', i === hot ? 'pl-on' : 'pl-txt');
    });
    return out;
  }
  function sepSvg(n) {
    const rows = NL ? ['filtreren', 'centrifugeren', 'destilleren', 'indampen'] : ['filtering', 'centrifuging', 'distilling', 'evaporating'];
    const top = 262;
    let out = rect(12, top, 292, 126);
    out += txt(28, top + 32, tr('ook scheiden:', 'separating too:'), 20, 'start', 'pl-mute');
    rows.forEach((r, i) => { if (i < n) out += txt(28 + (i % 2) * 124, top + 66 + Math.floor(i / 2) * 38, r, 20, 'start', 'pl-txt'); });
    return out;
  }
  // the batch: four phases in time; only mixing makes product, the rest is fill, empty, clean
  function batchSvg(step, q) {
    let out = rect(12, 12, 312, 292);
    out += txt(28, 44, tr('batch 0412', 'batch 0412'), 21, 'start', 'pl-big') + txt(296, 44, EX, 20, 'end', 'pl-mute');
    const ph = NL ? ['vullen', 'mengen', 'legen', 'reinigen'] : ['fill', 'mix', 'empty', 'clean'];
    ph.forEach((name, i) => {
      const done = clamp(q * 4 - i, 0, 1);
      const y = 62 + i * 36;
      out += txt(28, y + 20, name, 20, 'start', done > 0.01 ? 'pl-txt' : 'pl-mute');
      out += rect(132, y + 2, 164, 24, 'pl-dim', 4);
      if (done > 0.01) out += `<rect class="fp-meter"${i === 1 ? ' data-top=""' : ''} x="132" y="${y + 2}" width="${f1(164 * done)}" height="24" rx="4"/>`;
    });
    if (step >= 1) out += txt(28, 230, tr('één partij, één batchnummer', 'one lot, one batch number'), 20, 'start', 'pl-txt');
    if (step >= 2) out += txt(28, 262, tr('vullen, legen, reinigen:', 'fill, empty, clean:'), 20, 'start', 'pl-txt') + txt(28, 290, tr('levert niks op', 'produce nothing'), 20, 'start', 'pl-on');
    return out;
  }
  // steady state: temperature, pressure and flow climb at start-up, then stay flat
  function trendSvg(step, q) {
    const ox = 316;
    let out = rect(ox + 12, 12, 300, 200);
    out += txt(ox + 28, 42, tr('trend', 'trend'), 20, 'start', 'pl-mute') + txt(ox + 296, 42, EX, 20, 'end', 'pl-mute');
    const x0 = ox + 36;
    const x1 = ox + 292;
    const y0 = 176;
    out += path([[x0, 56], [x0, y0], [x1, y0]], 'pl-dim');
    const xs = x0 + 66;
    if (step >= 2) out += `<rect class="pl-liq" x="${x0 + 2}" y="58" width="${xs - x0 - 2}" height="${y0 - 60}"/>` + txt(x0 + 8, 76, 'off-spec', 20, 'start', 'pl-on');
    const xe = lerp(x0, x1, q);
    [[150, 80], [150, 112], [150, 144]].forEach(([s, lvl], i) => {
      const pts = [];
      for (let x = x0; x <= xe; x += 4) { const t = clamp((x - x0) / (xs - x0), 0, 1); pts.push([x, lerp(s + 20, lvl, t * t * (3 - 2 * t))]); }
      if (pts.length > 1) out += path(pts, i === 0 ? 'pl-accl' : 'pl-line');
    });
    out += txt(x1, 202, tr('tijd', 'time'), 20, 'end', 'pl-mute');
    if (q > 0.5) out += txt(x1, 102, 'T', 20, 'end', 'pl-big') + txt(x1, 134, 'p', 20, 'end', 'pl-big') + txt(x1, 166, 'Q', 20, 'end', 'pl-big');
    return out;
  }
  // the residence-time sum, with a clock of the drop in the tube
  function calcSvg(step, secs) {
    let out = rect(12, 12, 300, 252);
    out += txt(28, 44, tr('verblijftijd', 'residence time'), 20, 'start', 'pl-mute') + txt(296, 44, EX, 20, 'end', 'pl-mute');
    out += txt(28, 80, tr('volume / debiet', 'volume / flow'), 21, 'start', 'pl-txt');
    out += txt(28, 116, tr('0,1 m³ / 12 m³/h', '0.1 m³ / 12 m³/h'), 20, 'start', 'pl-mono');
    out += txt(28, 150, '= 30 s', 24, 'start', 'pl-big');
    if (secs !== undefined) out += txt(296, 150, `${Math.floor(secs)} s`, 24, 'end', 'pl-on');
    if (step >= 2) {
      out += txt(28, 192, tr('18 m³/h: 20 s', '18 m³/h: 20 s'), 20, 'start', 'pl-mono');
      out += txt(28, 226, tr('minimum: 20 s', 'minimum: 20 s'), 20, 'start', 'pl-on');
      out += txt(28, 252, tr('geen marge', 'no margin'), 20, 'start', 'pl-mute');
    }
    return out;
  }
  // the velocity profile in the tube: fastest in the centre
  function profSvg() {
    let out = rect(12, 276, 300, 112);
    out += txt(28, 302, tr('snelheid in de buis', 'speed in the tube'), 20, 'start', 'pl-mute');
    out += path([[28, 318], [296, 318]], 'pl-line') + path([[28, 378], [296, 378]], 'pl-line');
    for (let i = 0; i <= 6; i++) {
      const y = 324 + i * 8;
      const r = (i - 3) / 3.4;
      const len = 30 + 130 * (1 - r * r);
      out += arrow([[48, y], [48 + len, y]], i === 3 ? 'pl-accl' : 'pl-dim', 6);
    }
    out += txt(296, 352, tr('snelst', 'fastest'), 20, 'end', 'pl-on');
    return out;
  }
  // gauge pressure against absolute pressure: two scales side by side
  function presSvg(step) {
    let out = rect(12, 12, 300, 376);
    out += txt(28, 44, tr('druk', 'pressure'), 20, 'start', 'pl-mute');
    const yOf = (barA) => 322 - barA * 70;
    const xa = 80;
    const xg = 236;
    out += path([[xg, yOf(0)], [xg, yOf(3.25)]], 'pl-line') + txt(xg, 80, 'bar(g)', 20, 'middle', 'pl-big');
    for (let v = 0; v <= 3; v++) out += path([[xg - 6, yOf(v)], [xg + 6, yOf(v)]], 'pl-line') + txt(xg + 14, yOf(v) + 7, String(v - 1), 20, 'start', 'pl-mono');
    const xl = step >= 2 ? xa + 6 : xg - 96;
    if (step >= 2) {
      out += path([[xa, yOf(0)], [xa, yOf(3.25)]], 'pl-line') + txt(xa, 80, 'bar(a)', 20, 'middle', 'pl-big');
      for (let v = 0; v <= 3; v++) out += path([[xa - 6, yOf(v)], [xa + 6, yOf(v)]], 'pl-line') + txt(xa - 14, yOf(v) + 7, String(v), 20, 'end', 'pl-mono');
      out += txt(xa + 12, yOf(0) + 32, tr('vacuüm', 'vacuum'), 20, 'start', 'pl-mute');
    }
    out += path([[xl, yOf(1)], [xg - 6, yOf(1)]], 'pl-dim') + txt((xl + xg) / 2, yOf(1) + 26, tr('buitenlucht', 'outside air'), 20, 'middle', 'pl-mute');
    out += path([[xl, yOf(3)], [xg - 6, yOf(3)]], 'pl-accl') + txt((xl + xg) / 2, yOf(3) + 26, tr('manometer', 'gauge'), 20, 'middle', 'pl-on');
    return out;
  }
  // mass flow = volume flow × density, and a vibrating tube that twists
  function massSvg(step, clockS) {
    let out = rect(12, 12, 300, step >= 1 ? 300 : 170);
    out += txt(28, 44, tr('massadebiet', 'mass flow'), 20, 'start', 'pl-mute');
    const wob = 6 * Math.sin(clockS * 9);
    const tw = 3 * Math.sin(clockS * 9 + 0.9);
    out += path([[40, 80], [120, 80], [120 + wob - tw, 130], [200 + wob + tw, 130], [200, 80], [280, 80]], 'pl-line');
    out += txt(160, 160, tr('trilt, en verdraait', 'vibrates, and twists'), 20, 'middle', 'pl-mute');
    if (step >= 1) {
      out += txt(28, 210, tr('volumedebiet × dichtheid', 'volume flow × density'), 20, 'start', 'pl-txt');
      out += txt(28, 248, tr('1 m³/h water', '1 m³/h of water'), 20, 'start', 'pl-mono');
      out += txt(28, 282, tr('≈ 1.000 kg/h', '≈ 1,000 kg/h'), 22, 'start', 'pl-big');
    }
    return out;
  }
  // the temperature loop as on a P&ID (ISA-5.1): TT, TIC (in the DCS), TV on the hot water
  function loopSvg(step, q) {
    let out = rect(12, 12, 300, 376);
    out += txt(28, 44, 'P&amp;ID', 20, 'start', 'pl-mute') + txt(296, 44, EX, 20, 'end', 'pl-mute');
    // the product line through the heater, and the hot water into it
    out += path([[28, 300], [296, 300]], 'pl-line') + txt(28, 332, tr('sap', 'juice'), 20, 'start', 'pl-mute');
    out += circ(120, 300, 22, 'pl-bub') + path([[102, 290], [112, 310], [122, 290], [132, 310], [140, 296]], 'pl-line');
    out += path([[28, 220], [64, 220], [120, 220], [120, 278]], 'pl-line') + txt(28, 248, tr('heet water', 'hot water'), 20, 'start', 'pl-mute');
    // the control valve: a bowtie with a dome actuator
    out += `<g data-cue="loopv">${path([[50, 210], [50, 230], [78, 210], [78, 230], [50, 210]], 'pl-line')}${path([[64, 220], [64, 196]], 'pl-line')}<path class="pl-line" d="M52 196A12 12 0 0 1 76 196Z"/></g>`;
    out += txt(84, 202, 'TV', 20, 'start', 'pl-big');
    // the transmitter after the heater, the controller in the DCS
    out += path([[230, 300], [230, 264]], 'pl-line') + circ(230, 240, 24, 'pl-bub') + txt(230, 247, 'TT', 20, 'middle', 'pl-big');
    out += rect(204, 94, 52, 52, 'pl-bub', 0) + circ(230, 120, 24, 'pl-bub') + txt(230, 127, 'TIC', 20, 'middle', 'pl-big');
    out += path([[230, 216], [230, 146]], 'pl-sig') + path([[204, 120], [64, 120], [64, 168]], 'pl-sig');
    if (step >= 3) {
      const sig = [[230, 218], [230, 142], [230, 120], [64, 120], [64, 168]];
      const pos = (k) => { const segs = [[0, 1], [1, 2], [2, 3], [3, 4]]; const L = [76, 22, 166, 48]; let d = k * 312; for (let i = 0; i < 4; i++) { if (d <= L[i]) { const [a, b] = segs[i]; const t = d / L[i]; return [lerp(sig[a][0], sig[b][0], t), lerp(sig[a][1], sig[b][1], t)]; } d -= L[i]; } return sig[4]; };
      const [x, y] = pos(q);
      out += circ(x, y, 6, 'pl-acc');
      out += txt(160, 368, tr('meten, vergelijken, bijsturen', 'measure, compare, adjust'), 20, 'middle', 'pl-on');
    } else out += txt(160, 368, tr('- - - elektrisch signaal', '- - - electric signal'), 20, 'middle', 'pl-mute');
    return out;
  }
  // the syrup level: real 2,0 m, shown 2,5 m
  function lvlSvg(step) {
    let out = rect(12, 12, 300, 376);
    out += txt(28, 44, tr('niveau op druk', 'level by pressure'), 20, 'start', 'pl-mute') + txt(296, 44, EX, 20, 'end', 'pl-mute');
    const bot = 230;
    const mPer = 54;
    out += rect(44, bot - 3.3 * mPer, 80, 3.3 * mPer, 'pl-wall', 4);
    out += rect(46, bot - 2 * mPer, 76, 2 * mPer - 2, 'pl-liq', 2);
    out += path([[44, bot - 2 * mPer], [124, bot - 2 * mPer]], 'pl-line') + txt(134, bot - 2 * mPer + 6, tr('echt 2,0 m', 'real 2.0 m'), 20, 'start', 'pl-txt');
    out += circ(84, bot - 4, 5, 'pl-acc');
    if (step >= 1) out += txt(134, bot + 2, '24.525 Pa'.replace('.', NL ? '.' : ','), 20, 'start', 'pl-mono');
    if (step >= 2) out += path([[40, bot - 2.5 * mPer], [128, bot - 2.5 * mPer]], 'pl-accl') + txt(134, bot - 2.5 * mPer + 6, tr('scherm 2,5 m', 'screen 2.5 m'), 20, 'start', 'pl-on');
    out += txt(28, 270, tr('siroop 1.250 kg/m³', 'syrup 1,250 kg/m³'), 20, 'start', 'pl-mono');
    if (step >= 1) out += txt(28, 300, tr('1.250 × 9,81 × 2,0', '1,250 × 9.81 × 2.0'), 20, 'start', 'pl-mono');
    if (step >= 2) out += txt(28, 330, tr('÷ 1.000 ÷ 9,81 = 2,5 m', '÷ 1,000 ÷ 9.81 = 2.5 m'), 20, 'start', 'pl-mono');
    if (step >= 3) out += txt(28, 366, tr('de massa klopt wel', 'the mass is still right'), 20, 'start', 'pl-on');
    return out;
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['steps', 'badges', 'sep', 'batch', 'trend', 'calc', 'prof', 'pres', 'mass', 'loop', 'lvl'];
  const FLOWS = ['fA', 'fB', 'fC', 'fH', 'fR'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    const st = { flow: { fA: 1, fB: 1, fC: 1, fH: 0.7, fR: 0.7 }, level: 0.62, mark: undefined, mix: false, pump: true, gauge: 0.5, belt: clockS * 7, drop: null };

    if (si === 0) {
      st.mix = true;
      const n = b === 1 ? 1 + Math.floor(span(p, 0.05, 0.75) * 4.99) : 5;
      vis.badges = b >= 1 ? (b === 1 ? span(p, 0, 0.1) : 1) : 0;
      if (vis.badges > 0.01) set(E.badges, badgesSvg(n, b === 1 ? n - 1 : -1));
      vis.steps = b >= 1 ? (b === 1 ? span(p, 0, 0.1) : 1) : 0;
      if (vis.steps > 0.01) set(E.steps, stepsSvg());
      vis.sep = b === 2 ? span(p, 0, 0.1) : 0;
      if (vis.sep > 0.01) set(E.sep, sepSvg(1 + Math.floor(span(p, 0.1, 0.8) * 3.99)));
    } else if (si === 1) {
      // fill, mix, empty, clean over the scene
      const q = clamp(u * 1.05, 0, 1);
      const fill = span(q, 0.02, 0.25);
      const empty = span(q, 0.5, 0.74);
      st.level = 0.8 * fill * (1 - empty);
      st.mix = q > 0.25 && q < 0.5;
      st.pump = q > 0.5 && q < 0.74;
      st.flow = { fA: st.pump ? 1 : 0 };
      st.belt = 0;
      vis.batch = 1;
      set(E.batch, batchSvg(b, q));
    } else if (si === 2) {
      st.mix = true;
      vis.trend = b === 1 || b === 2 ? span(p, 0, 0.1) : 0;
      if (vis.trend > 0.01) set(E.trend, trendSvg(b, b === 1 ? span(p, 0.05, 0.9) : 1));
    } else if (si === 3) {
      st.flow = { fA: 0.4, fB: 0.6, fC: 0.4, fH: 0.4, fR: 0.4 };
      vis.calc = b >= 1 ? (b === 1 ? span(p, 0, 0.1) : 1) : 0;
      if (b === 1) { const q = span(p, 0.1, 0.92); st.drop = { q }; if (vis.calc > 0.01) set(E.calc, calcSvg(b, q * C.T1)); } else if (b === 2) {
        const q = span(p, 0.08, 0.7); st.drop = { q }; set(E.calc, calcSvg(b, q * C.T2));
      } else if (b === 3) { const q = span(p, 0.05, 0.6); st.drop = { q, ghost: q * 0.5 }; set(E.calc, calcSvg(2)); }
      vis.prof = b === 3 ? span(p, 0, 0.1) : 0;
      if (vis.prof > 0.01) set(E.prof, profSvg());
    } else if (si === 4) {
      vis.pres = b === 1 || b === 2 ? span(p, 0, 0.1) : 0;
      if (vis.pres > 0.01) set(E.pres, presSvg(b));
      vis.mass = b >= 3 ? (b === 3 ? span(p, 0, 0.1) : 1) : 0;
      if (vis.mass > 0.01) set(E.mass, massSvg(b - 3, clockS));
    } else if (si === 5) {
      st.flow = { fA: 1, fB: 1, fC: 1, fH: b === 3 ? 0.4 + 0.6 * span(p, 0.4, 0.8) : 0.6, fR: 0.6 };
      vis.loop = b >= 2 ? (b === 2 ? span(p, 0, 0.1) : 1) : 0;
      if (vis.loop > 0.01) set(E.loop, loopSvg(b, b === 3 ? span(p, 0.05, 0.75) : 0));
    } else if (si === 6) {
      st.flow = {};
      st.pump = false;
      st.belt = 0;
      st.level = 2.0 / 3.3;
      st.mark = b >= 2 ? 2.5 / 3.3 : undefined;
      vis.lvl = 1;
      set(E.lvl, lvlSvg(b));
    }

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
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();

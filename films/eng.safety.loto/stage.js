// The stage of the film "Vergrendelen en labelen / Lockout-tagout": a pure
// function of (scene, u). Inlined into the page after the anatomy kit (iso-kit
// functions in scope, the lathe module as G) and a preamble from build.mjs that
// defines P (projection), C (world constants), CAM (one camera move per
// scene), W and H. Moves are placed per caption beat (beatStarts), so the
// video's narration timing (films/_kit/beatwarp.js) keeps them in step.
/* global G, P, C, CAM, W, H, iso, solidSvg, lineSvg, slabOf, cylinder, haloOf, segment, translateAlong, span, beatStarts */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const at = (p) => iso(p, P);
  const S = (paths, style = {}) => solidSvg(paths, { tone: 'mid', ...style });
  // ------------------------------------------------------------ the sliding guard, drawn once at load
  // A mesh guard in front of the die space that slides to the right on a top
  // rail (carried by the right upright and an outrigger post). Static, but its
  // mesh is many lines: drawing it here keeps the page small.
  {
    const box = (plan, z0, z1, style = {}, bevel = 0.3, steps = 1) => S(slabOf({ r: 0.4, ...plan }, z0, z1 - z0, P, steps, bevel), style);
    const G0 = C.GATE;
    const y = G0.y;
    let rail = box({ x: -54, y: y + 2, w: 214, d: 3, r: 0.3 }, G0.z1 + 4, G0.z1 + 8, {}, 0.2)
      + box({ x: 154, y: y - 1, w: 5, d: 5, r: 0.3 }, 0, G0.z1 + 4, {}, 0.2) + box({ x: 151, y: y - 4, w: 11, d: 11, r: 0.8 }, 0, 2, { tone: 'lo' }, 0.2)
      + box({ x: 66, y: y - 1, w: 5, d: 3, r: 0.3 }, G0.z1 + 4, G0.z1 + 12, { tone: 'lo' }, 0.1);
    svg.querySelector('[data-k="rail"]').innerHTML = rail;
    const x0 = -52;
    const x1 = 52;
    const mesh = [];
    for (let x = x0 + 6; x < x1 - 2; x += 6) mesh.push(segment([x, y, G0.z0 + 4], [x, y, G0.z1 - 4], P));
    for (let z = G0.z0 + 10; z < G0.z1 - 4; z += 8) mesh.push(segment([x0 + 2, y, z], [x1 - 2, y, z], P));
    const gate = lineSvg(mesh.join(''), { tone: 'faint' })
      + box({ x: x0, y: y - 0.8, w: x1 - x0, d: 1.6 }, G0.z0, G0.z0 + 4) + box({ x: x0, y: y - 0.8, w: x1 - x0, d: 1.6 }, G0.z1 - 4, G0.z1)
      + box({ x: x0, y: y - 0.8, w: 3, d: 1.6 }, G0.z0 + 4, G0.z1 - 4) + box({ x: x1 - 3, y: y - 0.8, w: 3, d: 1.6 }, G0.z0 + 4, G0.z1 - 4)
      + box({ x: x1 - 9, y: y + 0.8, w: 4, d: 2, r: 0.3 }, 96, 112, { tone: 'hi', crease: 'lo' }, 0.1)
      + box({ x: x0 + 8, y: y - 0.8, w: 4, d: 3.4, r: 0.4 }, G0.z1, G0.z1 + 5, { tone: 'lo' }, 0.1) + box({ x: x1 - 12, y: y - 0.8, w: 4, d: 3.4, r: 0.4 }, G0.z1, G0.z1 + 5, { tone: 'lo' }, 0.1);
    svg.querySelector('[data-k="gate"]').innerHTML = gate;
    // A simple standing figure facing the viewer: shoes, legs, a jacket with
    // its zip, arms, a neck, a head and a helmet with its brim.
    const post = (cx, cy, r, z0, z1, style = {}, steps = 16, bevel = 0) => S(cylinder(cx, cy, r, z0, z1 - z0, P, steps, bevel), style);
    const person = (cx, cy, jacket, helmet) => {
      let out = `<path class="iso-halo" d="${haloOf({ x: cx - 11, y: cy - 7, w: 22, d: 14, r: 6 }, 0, 2, P)}"/>`;
      for (const dx of [-5, 5]) {
        out += box({ x: cx + dx - 3.6, y: cy - 3.4, w: 7.2, d: 10, r: 1.6 }, 0, 4, { tone: 'lo' }, 0.4, 2);
        out += box({ x: cx + dx - 3.4, y: cy - 3.4, w: 6.8, d: 6.8, r: 2 }, 4, 82, { tone: 'lo' }, 0.4, 2);
      }
      out += box({ x: cx - 15, y: cy - 4, w: 4.6, d: 7, r: 2 }, 92, 138, { tone: jacket }, 0.3, 2);
      out += box({ x: cx - 11, y: cy - 6, w: 22, d: 12, r: 3.6 }, 80, 144, { tone: jacket, inner: lineSvg(segment([cx, cy + 6, 84], [cx, cy + 6, 140], P), { tone: 'lo' }) }, 0.6, 3);
      out += box({ x: cx + 10.4, y: cy - 4, w: 4.6, d: 7, r: 2 }, 92, 138, { tone: jacket }, 0.3, 2);
      out += post(cx, cy, 3.2, 144, 149, { tone: 'lo' }, 12);
      out += S(G.sphereOf([cx, cy, 156], 7.4, P, { steps: 28 }), { tone: 'mid' });
      out += post(cx, cy, 9, 158.6, 159.8, { tone: helmet, crease: 'lo' }, 20);
      out += S(cylinder(cx, cy, 7.6, 159.8, 4.4, P, 20, 3), { tone: helmet, crease: 'lo' });
      return out;
    };
    svg.querySelector('[data-k="op1"]').innerHTML = person(C.OPS[0][0], C.OPS[0][1], 'lo', 'mid');
    svg.querySelector('[data-k="op2"]').innerHTML = person(C.OPS[1][0], C.OPS[1][1], 'lo', 'mid');
    svg.querySelector('[data-k="fitterBody"]').innerHTML = person(C.FIT0[0], C.FIT0[1], 'mid', 'hi');
  }
  const E = {};
  svg.querySelectorAll('[data-k]').forEach((el) => { E[el.getAttribute('data-k')] = el; });
  const LED = {};
  svg.querySelectorAll('[data-led]').forEach((el) => { LED[el.getAttribute('data-led')] = el; });
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
  const move = (e, by) => { const t = translateAlong(P, by); if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const flag = (e, name, on) => { if (e.hasAttribute(name) !== !!on) e.toggleAttribute(name, !!on); };
  const txt = (x, y, t, size = 21, anchor = 'start', cls = 'lt-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'lt-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'lt-axis') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const EXAMPLE = tr('voorbeeld', 'example');

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
  // a world point on the stage (for a marker in the HUD)
  const toStage = (p) => { const [x, y] = at(p); return [(x - view.cx) * view.s + W / 2, (y - view.cy) * view.s + H / 2]; };

  // ------------------------------------------------------------ parts that turn
  // a handle on a face of constant y, turned by th from straight up (0) toward +x
  function handleSvg(hub, th, len, wide, tone) {
    const u = [Math.cos(th), 0, -Math.sin(th)];
    const v = [Math.sin(th), 0, Math.cos(th)];
    const F = G.frameOf(hub, [0, 1, 0], u, v);
    const hubF = G.frameOf(hub, [0, 1, 0], [1, 0, 0], [0, 0, 1]);
    return S(G.disc(0, 1.6, wide * 1.5, hubF, P, { steps: 18 }), { tone: 'mid' })
      + S(G.prismOf(F, [[-wide / 2, -wide], [wide / 2, -wide], [wide / 2, len], [-wide / 2, len]], 1.2, 3, P), { tone, crease: 'lo' });
  }
  // the gauge's needle: v from 0 (zero) to 1 (full scale)
  function needleSvg(v) {
    const a = ((-135 + 270 * v) * Math.PI) / 180;
    const y = C.GAUGE[1] + 1.7;
    const c = at([C.GAUGE[0], y, C.GAUGE[2]]);
    const tip = at([C.GAUGE[0] + 4.4 * Math.sin(a), y, C.GAUGE[2] + 4.4 * Math.cos(a)]);
    const tail = at([C.GAUGE[0] - 1.2 * Math.sin(a), y, C.GAUGE[2] - 1.2 * Math.cos(a)]);
    return `<path class="lt-needle" d="${fmt([tail, tip])}"/>` + `<circle class="lt-key" cx="${f2(c[0])}" cy="${f2(c[1])}" r="${f2(0.9 * G.scaleOf(P))}"/>`;
  }

  // ------------------------------------------------------------ HUD panels
  // the four energy sources, numbered on the drawing, with a legend
  function tagsSvg(n) {
    const spots = [[C.SW[0], C.SW[1] + 2, C.SW[2] + 16], [C.VALVE[0], C.VALVE[1] + 2, C.VALVE[2] + 16], [C.ACC[0], C.ACC[1], 104], [0, 28, C.RAM0 + C.RAM_H + 12]];
    let out = rect(12, 10, 616, 46);
    out += txt(28, 41, tr('1 stroom · 2 perslucht · 3 oliedruk · 4 stoter', '1 electricity · 2 air · 3 oil pressure · 4 ram'), 21, 'start', 'lt-txt');
    spots.forEach((p, i) => {
      if (i >= n) return;
      const [x, y] = toStage(p);
      out += `<circle class="lt-badge" cx="${f1(x)}" cy="${f1(y)}" r="15"/>` + txt(x, y + 7.5, String(i + 1), 21, 'middle', 'lt-badgeT');
    });
    return out;
  }
  // the LOTO procedure of this press: one page, a photo per isolation point
  function sheetSvg(rows, mark) {
    const items = NL ? ['hoofdschakelaar', 'persluchtkraan', 'blok onder stoter', 'accumulator 0 bar', 'startpoging'] : ['main switch', 'air valve', 'block under ram', 'accumulator 0 bar', 'start attempt'];
    let out = rect(326, 12, 306, 312);
    out += txt(342, 46, tr('LOTO-procedure', 'LOTO procedure'), 22, 'start', 'lt-big') + txt(342, 74, `${tr('pers', 'press')} · ${EXAMPLE}`, 21, 'start', 'lt-mute');
    items.forEach((t, i) => {
      if (i >= rows) return;
      const y = 92 + i * 44;
      if (mark === i) out += rect(334, y - 4, 290, 42, 'lt-row', 6);
      out += rect(342, y, 38, 32, 'lt-card', 3) + line(348, y + 26, 360, y + 14, 'lt-dim') + line(360, y + 14, 374, y + 26, 'lt-dim') + `<circle class="lt-dimc" cx="371" cy="${y + 9}" r="3.4"/>`;
      out += txt(392, y + 24, t, 21, 'start', 'lt-txt');
    });
    return out;
  }
  // step badges 1 and 2: the block, then the accumulator
  function badgesSvg(n) {
    const spots = [[C.BLOCK.x - 8, 8, 110], [C.ACC[0], C.ACC[1], 106]];
    let out = '';
    spots.forEach((p, i) => {
      if (i >= n) return;
      const [x, y] = toStage(p);
      out += `<circle class="lt-badge" cx="${f1(x)}" cy="${f1(y)}" r="16"/>` + txt(x, y + 7.5, String(i + 1), 22, 'middle', 'lt-badgeT');
    });
    return out;
  }
  // the accumulator's gauge, large: the needle falls to 0 bar
  function gaugeSvg(v) {
    const cx = 128;
    const cy = 262;
    const r = 84;
    let out = rect(12, 118, 232, 274);
    out += txt(28, 150, tr('manometer', 'gauge'), 21, 'start', 'lt-mute');
    out += `<circle class="lt-dial" cx="${cx}" cy="${cy}" r="${r}"/>`;
    for (let i = 0; i <= 20; i++) {
      const a = ((-135 + i * 13.5) * Math.PI) / 180;
      const r1 = i % 5 ? r - 10 : r - 18;
      out += `<path class="${i % 5 ? 'lt-dim' : 'lt-line'}" d="M${f1(cx + (r - 4) * Math.sin(a))} ${f1(cy - (r - 4) * Math.cos(a))}L${f1(cx + r1 * Math.sin(a))} ${f1(cy - r1 * Math.cos(a))}"/>`;
    }
    const a0 = (-135 * Math.PI) / 180;
    out += txt(cx + (r + 12) * Math.sin(a0) - 6, cy - (r + 12) * Math.cos(a0) + 10, '0', 22, 'middle', 'lt-big');
    const a = ((-135 + 270 * v) * Math.PI) / 180;
    out += `<path class="lt-accl" d="M${f1(cx - 12 * Math.sin(a))} ${f1(cy + 12 * Math.cos(a))}L${f1(cx + (r - 16) * Math.sin(a))} ${f1(cy - (r - 16) * Math.cos(a))}"/>`;
    out += `<circle class="lt-acc" cx="${cx}" cy="${cy}" r="6"/>`;
    out += txt(cx + 30, cy + r + 32, v < 0.005 ? '0 bar' : 'bar', 24, 'middle', 'lt-big');
    return out;
  }
  // a checklist panel: rows ticked one by one, one row marked
  function listSvg(title, rows, ticked, mark, x0 = 12) {
    const h = 56 + rows.length * 40;
    const top = 392 - h;
    const dx = x0 - 12;
    let out = `<g transform="translate(${dx} 0)">` + rect(12, top, 330, h);
    out += txt(28, top + 34, title, 21, 'start', 'lt-mute');
    rows.forEach((t, i) => {
      const y = top + 50 + i * 40;
      if (mark === i) out += rect(18, y - 2, 318, 38, 'lt-row', 6);
      const on = i < ticked;
      out += `<path class="${on ? 'lt-accl' : 'lt-dim'}" d="M30 ${y + 18}L37 ${y + 25}L50 ${y + 10}"/>`;
      out += txt(64, y + 26, t, 21, 'start', on ? 'lt-txt' : 'lt-mute');
    });
    return out + '</g>';
  }
  function rulesSvg() {
    const rows = NL
      ? ['vrijschakelen', 'beveiligen tegen herinschakelen', 'spanningsloosheid vaststellen', 'aarden en kortsluiten', 'naastgelegen delen afschermen']
      : ['disconnect', 'secure against reconnection', 'verify absence of voltage', 'earth and short-circuit', 'protect against adjacent live parts'];
    let out = rect(12, 176, 616, 216);
    out += txt(28, 208, tr('vijf veiligheidsregels', 'five safety rules'), 21, 'start', 'lt-mute');
    rows.forEach((t, i) => {
      const y = 222 + i * 34;
      if (i === 1) out += rect(18, y - 2, 604, 32, 'lt-row', 6);
      out += txt(30, y + 22, `${i + 1}`, 21, 'start', 'lt-big') + txt(58, y + 22, t, 21, 'start', 'lt-txt');
    });
    return out;
  }

  // ------------------------------------------------------------ people
  // The fitter's spot per beat, [x, y] on the floor; between two spots he walks
  // along the front aisle (y 100) so he never passes behind the console.
  const HOME = C.FIT0;
  const AISLE = 100;
  function walk(from, to, t) {
    if (t <= 0) return from;
    if (t >= 1) return to;
    const legs = [from, [from[0], AISLE], [to[0], AISLE], to];
    const lens = legs.slice(1).map((p, i) => Math.hypot(p[0] - legs[i][0], p[1] - legs[i][1]));
    const total = lens.reduce((a, b) => a + b, 0) || 1;
    let left = t * total;
    for (let i = 0; i < lens.length; i++) {
      if (left <= lens[i] || i === lens.length - 1) { const k = lens[i] ? clamp(left / lens[i], 0, 1) : 1; return [lerp(legs[i][0], legs[i + 1][0], k), lerp(legs[i][1], legs[i + 1][1], k)]; }
      left -= lens[i];
    }
    return to;
  }
  const SPOT = {
    home: HOME, ops: [20, 100], cab: [-176, 22], air: [80, 40], box: [-185, 4], press: [70, 50], acc: [160, 6], con: [-118, 96],
  };

  // ------------------------------------------------------------ the scenes
  const HUDS = ['tags', 'sheet', 'badges', 'gaugeBig', 'proof', 'restart', 'rules'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    // the state of the floor: running, stopped, isolated, locked, blocked, bled
    const st = {
      on: true, air: true, run: false, ram: 0, settle: 0, block: 0, gate: 0, press: 0, gaugeV: 0.72,
      lockSw: false, lockValve: false, keys: false, boxLocks: 0, fitter: SPOT.home, fitterTo: null, walkT: 0, ops: true, estop: 0,
    };
    const stroke = (t) => { const c = t % 6; return span(c, 0.6, 2.2) - span(c, 3, 4.6); };
    const isolated = () => { st.on = false; st.air = false; st.lockSw = true; st.lockValve = true; };
    const blocked = () => { st.block = 1; st.gate = 1; };
    const bled = () => { st.gaugeV = 0; st.settle = 1; };

    if (si === 0) {
      st.run = true;
      st.ram = stroke(clockS);
      vis.tags = b >= 1 && b <= 2 ? span(p, 0, 0.1) + (b === 2 ? 1 : 0) : 0;
      if (vis.tags > 0.01) set(E.tags, tagsSvg(b === 1 ? 1 + Math.floor(span(p, 0.1, 0.8) * 3.99) : 4));
      st.estop = b === 3 ? span(p, 0.2, 0.32) - span(p, 0.7, 0.82) : 0;
      if (b === 3 && p > 0.3 && p < 0.75) { st.run = false; st.ram = 0; }
    } else if (si === 1) {
      st.run = b <= 2;
      st.ram = b <= 2 ? stroke(clockS) : stroke(clockS) * (1 - span(p, 0, 0.3));
      if (b === 3 && p > 0.3) { st.run = false; st.ram = 0; }
      vis.sheet = b <= 1 ? span(u, 0, 0.03) : 1 - span(p, 0, 0.1);
      if (vis.sheet > 0.01) set(E.sheet, sheetSvg(b === 0 ? Math.floor(span(p, 0.2, 0.9) * 5.99) : 5, -1));
      st.fitter = SPOT.home; st.fitterTo = SPOT.ops; st.walkT = b >= 2 ? (b === 2 ? span(p, 0, 0.3) : 1) : 0;
      flag(E.btnStop, 'data-lit', b === 3 && p > 0.15 && p < 0.35);
    } else if (si === 2) {
      st.ops = false;
      st.on = !(b > 0 || p > 0.45);
      st.air = !(b > 1 || (b === 1 && p > 0.45));
      st.lockSw = b >= 2 && (b > 2 || p > 0.25);
      st.lockValve = b >= 2 && (b > 2 || p > 0.55);
      if (b === 0) { st.fitter = SPOT.ops; st.fitterTo = SPOT.cab; st.walkT = span(p, 0, 0.35); } else { st.fitter = SPOT.cab; st.fitterTo = SPOT.air; st.walkT = b === 1 ? span(p, 0, 0.4) : 1; }
      st.swTh = b === 0 ? span(p, 0.4, 0.55) : 1;
      st.vTh = b === 0 ? 0 : b === 1 ? span(p, 0.42, 0.58) : 1;
    } else if (si === 3) {
      isolated();
      st.ops = 'box';
      st.fitter = SPOT.box;
      st.keys = b >= 0 && (b > 0 || p > 0.35);
      st.boxLocks = b === 0 ? 0 : b === 1 ? Math.floor(span(p, 0.1, 0.8) * 3.99) : 3 - Math.floor(span(p, 0.1, 0.75) * 3.99);
      if (b === 2 && st.boxLocks === 0) st.keysFree = true;
    } else if (si === 4) {
      isolated();
      st.ops = false;
      st.gate = b === 0 ? span(p, 0.05, 0.25) : 1;
      st.block = b === 0 ? span(p, 0.3, 0.9) : 1;
      st.fitter = b === 0 ? SPOT.home : SPOT.press;
      if (b === 0) { st.fitterTo = SPOT.press; st.walkT = span(p, 0, 0.25); }
      if (b >= 1) { st.fitter = SPOT.press; st.fitterTo = SPOT.acc; st.walkT = b === 1 ? span(p, 0.05, 0.6) : 1; }
      st.gaugeV = b <= 1 ? 0.72 : b === 2 ? 0.72 * (1 - span(p, 0.15, 0.75)) : 0;
      st.settle = b === 2 ? span(p, 0.6, 0.85) : b === 3 ? 1 : 0;
      vis.badges = b <= 1 ? (b === 0 ? span(p, 0.6, 0.72) : 1) : 1 - span(p, 0, 0.1);
      if (vis.badges > 0.01) set(E.badges, badgesSvg(b === 0 ? 1 : 2));
      vis.gaugeBig = b >= 2 ? (b === 2 ? span(p, 0, 0.1) : 1) : 0;
      if (vis.gaugeBig > 0.01) set(E.gaugeBig, gaugeSvg(st.gaugeV));
    } else if (si === 5) {
      isolated(); blocked(); bled();
      st.ops = false;
      st.fitter = SPOT.con;
      if (b === 0) { st.fitter = SPOT.acc; st.fitterTo = SPOT.con; st.walkT = span(p, 0, 0.45); }
      flag(E.btnStart, 'data-lit', b === 0 && p > 0.55 && p < 0.8);
      if (b >= 2) { st.fitter = SPOT.con; st.fitterTo = SPOT.press; st.walkT = b === 2 ? span(p, 0.4, 0.9) : 1; }
      vis.proof = b === 1 ? span(p, 0, 0.1) : 0;
      if (vis.proof > 0.01) set(E.proof, listSvg(tr('energieloos?', 'zero energy?'), NL ? ['startpoging: niks', 'manometer: 0 bar', 'stoter op het blok'] : ['start: nothing', 'gauge: 0 bar', 'ram on the block'], 1 + Math.floor(span(p, 0.15, 0.7) * 2.99), -1, 298));
    } else if (si === 6) {
      bled();
      st.block = 1;
      st.on = false; st.air = false;
      st.lockSw = b <= 0 || (b === 1 && p < 0.6);
      st.lockValve = b <= 0 || (b === 1 && p < 0.75);
      st.gate = b === 0 ? 1 - span(p, 0.4, 0.7) : 0;
      st.ops = b >= 1 && (b > 1 || p > 0.75);
      st.fitter = b === 0 ? SPOT.press : SPOT.home;
      if (b === 0) { st.fitterTo = SPOT.home; st.walkT = span(p, 0.05, 0.35); }
      vis.restart = b <= 2 ? span(u, 0, 0.03) : 1 - span(p, 0, 0.1);
      if (vis.restart > 0.01) {
        if (b <= 1) set(E.restart, listSvg(tr('weer starten', 'restarting'), NL ? ['gereedschap eruit', 'afschermingen dicht', 'iedereen vrij', 'eigen sloten eraf'] : ['tools out', 'guards closed', 'everyone clear', 'own locks off'], b === 0 ? 1 + Math.floor(span(p, 0.1, 0.8) * 2.99) : 3 + (p > 0.6 ? 1 : 0), b === 1 ? 3 : -1));
        else set(E.restart, listSvg(tr('slot van een afwezige', 'a lock left on'), NL ? ['persoon proberen te bereiken', 'machine veilig?', 'leidinggevende beslist'] : ['try to reach the person', 'check the machine is safe', 'a manager decides'], 1 + Math.floor(span(p, 0.1, 0.8) * 2.99), -1));
      }
      vis.rules = b === 3 ? span(p, 0.05, 0.2) : 0;
      if (vis.rules > 0.01) set(E.rules, rulesSvg());
    }

    // ---- the drawing
    const ramDz = -C.STROKE * st.ram - C.SETTLE * st.settle;
    move(E.ram, [0, 0, ramDz]);
    // the block: from the floor in front of the press, up and in under the ram
    const bp = C.BLOCK_PARK;
    const lift = span(st.block, 0, 0.45);
    const slide = span(st.block, 0.45, 1);
    move(E.block, [bp[0] * (1 - slide), bp[1] * (1 - slide), bp[2] * (1 - lift)]);
    move(E.gate, [104 * st.gate, 0, 0]);
    // block outside the guard is drawn in front of it; inside, in its slot behind the ram
    const inside = slide > 0.55;
    show(E.block, inside);
    show(E.blockOut, !inside);
    if (!inside) move(E.blockOut, [bp[0] * (1 - slide), bp[1] * (1 - slide), bp[2] * (1 - lift)]);
    set(E.swHandle, handleSvg([C.SW[0], C.SW[1] + 1, C.SW[2]], (Math.PI / 2) * (st.swTh ?? (st.on ? 0 : 1)), 9, 3.2, 'hi'));
    set(E.vLever, handleSvg([C.VALVE[0], C.VALVE[1], C.VALVE[2]], (Math.PI / 2) * (st.vTh ?? (st.air ? 0 : 1)), 11, 2.2, 'hi'));
    set(E.needle, needleSvg(st.gaugeV));
    show(E.lockSw, st.lockSw);
    show(E.lockValve, st.lockValve);
    show(E.boxKeys, st.keys && !st.keysFree);
    for (let i = 0; i < 4; i++) show(E['boxLock' + i], i < st.boxLocks);
    flag(LED.power, 'data-on', st.on);
    flag(LED.motor, 'data-on', st.on && si <= 1);
    flag(LED.y1, 'data-on', st.air && st.run && st.ram > 0.05);
    move(E.estopHead, [0, 0, -1.4 * st.estop]);
    // people
    let f = st.fitter;
    if (st.fitterTo) f = walk(st.fitter, st.fitterTo, st.walkT);
    const bob = st.fitterTo && st.walkT > 0 && st.walkT < 1 ? 0.8 * Math.abs(Math.sin(clockS * 6)) : 0;
    move(E.fitter, [f[0] - HOME[0], f[1] - HOME[1], bob]);
    if (st.ops === 'box') {
      move(E.op1, [-322 - C.OPS[0][0], -14 - C.OPS[0][1], 0]);
      move(E.op2, [-300 - C.OPS[1][0], 0 - C.OPS[1][1], 0]);
    } else { move(E.op1, [0, 0, 0]); move(E.op2, [0, 0, 0]); }
    show(E.op1, !!st.ops);
    show(E.op2, !!st.ops);
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();

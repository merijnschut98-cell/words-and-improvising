// The stage of the film "Perslucht: de dure utility / Compressed air": a pure
// function of (scene, u). Inlined into the page after the anatomy kit (iso-kit
// functions in scope) and a preamble from build.mjs that defines P
// (projection), C (world constants), CAM (one camera move per scene), W and H.
// Moves are placed per caption beat (beatStarts), so the video's narration
// timing (films/_kit/beatwarp.js) keeps them in step. The gauge, flow, list and
// kWh helpers follow eng.power.hydraulics and eng.power.motor.
/* global P, C, CAM, W, H, iso, translateAlong, span, beatStarts */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
  const at = (p) => iso(p, P);
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
  const txt = (x, y, t, size = 21, anchor = 'start', cls = 'pa-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'pa-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const path = (pts, cls) => `<path class="${cls}" d="${fmt(pts)}"/>`;
  const arrow = (pts, cls = 'pa-accl', head = 8) => {
    const [x1, y1] = pts[pts.length - 1];
    const [x0, y0] = pts[pts.length - 2];
    const a = Math.atan2(y1 - y0, x1 - x0);
    const h = (s) => [x1 - head * Math.cos(a + s), y1 - head * Math.sin(a + s)];
    return path(pts, cls) + path([h(0.5), [x1, y1], h(-0.5)], cls);
  };
  const EX = tr('voorbeeld', 'example');
  const SCH = tr('schema', 'schematic');
  const n = (nl, en) => tr(nl, en);

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
  // a needle in the plane y = c[1]: v from 0 (zero) to 1 (full scale)
  function needleSvg(c, r, v) {
    const a = ((-135 + 270 * v) * Math.PI) / 180;
    const y = c[1] + 0.1;
    const o = at([c[0], y, c[2]]);
    const tip = at([c[0] + r * Math.sin(a), y, c[2] + r * Math.cos(a)]);
    const tail = at([c[0] - r * 0.25 * Math.sin(a), y, c[2] - r * 0.25 * Math.cos(a)]);
    return `<path class="pa-needle" d="${fmt([tail, tip])}"/><circle class="pa-acc" cx="${f2(o[0])}" cy="${f2(o[1])}" r="0.9"/>`;
  }
  // the aftercooler fan's blades, turned by phase
  function fanPath(ph) {
    let d = '';
    for (let i = 0; i < 4; i++) {
      const a = ph + (i * Math.PI) / 2;
      const p0 = at([-132 + 1.6 * Math.cos(a), -18.5 + 1.6 * Math.sin(a), 62.3]);
      const p1 = at([-132 + 6.6 * Math.cos(a + 0.25), -18.5 + 6.6 * Math.sin(a + 0.25), 62.3]);
      d += `M${f2(p0[0])} ${f2(p0[1])}L${f2(p1[0])} ${f2(p1[1])}`;
    }
    return d;
  }
  // the hiss of a leak: three short arcs that ripple out from the coupling
  function hissSvg(p, amp, clockS, dir) {
    const [x, y] = at(p);
    let out = '';
    for (let i = 0; i < 3; i++) {
      const k = ((clockS * 1.4 + i / 3) % 1);
      const r = (2 + 9 * k) * amp * Math.max(1, 1.8 / view.s);
      const a0 = dir - 0.7;
      const a1 = dir + 0.7;
      const pts = Array.from({ length: 7 }, (_, j) => { const a = lerp(a0, a1, j / 6); return [x + r * Math.cos(a), y + r * Math.sin(a)]; });
      out += `<path class="pa-hiss" style="opacity:${f2(1 - k)}" d="${fmt(pts)}"/>`;
    }
    return out;
  }
  // the blow gun's blast: dashed air lines fanning out from the nozzle
  function blastSvg(a, clockS) {
    const g = C.GUN;
    const o = [g[0] - 6, g[1], g[2] + 1.6];
    let out = '';
    for (let i = -2; i <= 2; i++) {
      const end = [o[0] - 13 * a, o[1] + i * 3 * a, o[2] + i * 1.2 * a];
      const pts = [o, end].map(at);
      out += `<path class="pa-air" style="stroke-dashoffset:${f1(clockS * 14)}" d="${fmt(pts)}"/>`;
    }
    return out;
  }
  // water drops: in a bowl (FRL filter) or falling from a drain
  function dropsSvg(p, count, clockS, fall = 6) {
    let out = '';
    for (let i = 0; i < count; i++) {
      const k = (clockS * 0.7 + i / count) % 1;
      const [x, y] = at([p[0] + (i % 2 ? 0.6 : -0.6), p[1], p[2] - fall * k]);
      out += `<circle class="pa-drop" style="opacity:${f2(1 - k * 0.8)}" cx="${f2(x)}" cy="${f2(y)}" r="0.7"/>`;
    }
    return out;
  }
  // the panel's screen: "in last" (loaded) or "nullast" (unloaded), as two bars
  function screenSvg(loaded) {
    const y = 36.02;
    const bar = (z, w, cls) => `<path class="${cls}" d="${fmt([[-168, y, z], [-168 + w, y, z], [-168 + w, y, z + 1.2], [-168, y, z + 1.2]].map(at))}Z"/>`;
    return bar(40, loaded ? 8 : 2.4, loaded ? 'pa-acc' : 'pa-bar') + bar(37, 5, 'pa-bar');
  }

  // ------------------------------------------------------------ HUD cards
  // where the energy goes: a schema; input 100 %, useful about 10 %, the rest heat and losses
  function energySvg(step) {
    const x0 = 12;
    let out = rect(x0, 12, 300, 376);
    out += txt(x0 + 14, 42, tr('waar de stroom blijft', 'where it goes'), 20, 'start', 'pa-mute') + txt(x0 + 288, 42, SCH, 20, 'end', 'pa-mute');
    const bx = x0 + 18;
    const full = 264;
    out += txt(bx, 82, tr('stroom erin', 'electricity in'), 20) + rect(bx, 92, full, 22, 'pa-bar', 3) + txt(bx + full, 82, '100%', 20, 'end', 'pa-mono');
    const useful = full * C.USEFUL;
    out += txt(bx, 150, tr('warmte', 'heat'), 20) + rect(bx, 160, full * 0.72, 22, 'pa-bar', 3);
    if (step >= 1) out += txt(bx, 214, tr('lekken, drukverlies', 'leaks, pressure drop'), 20) + rect(bx, 224, full * 0.18, 22, 'pa-bar', 3);
    out += txt(bx, 278, tr('nuttig werk', 'useful work'), 20, 'start', 'pa-on') + rect(bx, 288, useful, 22, 'pa-acc', 3) + txt(bx + useful + 10, 306, n('zo’n 10%', 'about 10%'), 20, 'start', 'pa-big');
    if (step >= 2) out += arrow([[bx + full * 0.72 + 8, 171], [bx + full * 0.72 + 34, 171], [bx + full * 0.72 + 34, 340], [bx + 20, 340]], 'pa-accl', 7) + txt(bx + 30, 372, tr('terugwinnen: warm water', 'recover: hot water'), 20, 'start', 'pa-on');
    return out;
  }
  // the receiver's gauge, large (as eng.power.hydraulics)
  function gaugeSvg(v, label, bar) {
    const cx = 108;
    const cy = 138;
    const r = 66;
    let out = rect(12, 12, 196, 250);
    out += txt(26, 42, label, 21, 'start', 'pa-mute');
    out += `<circle class="pa-dial" cx="${cx}" cy="${cy}" r="${r}"/>`;
    for (let i = 0; i <= 20; i++) {
      const a = ((-135 + i * 13.5) * Math.PI) / 180;
      const r1 = i % 2 ? r - 10 : r - 18;
      out += `<path class="${i % 2 ? 'pa-dim' : 'pa-line'}" d="M${f1(cx + (r - 4) * Math.sin(a))} ${f1(cy - (r - 4) * Math.cos(a))}L${f1(cx + r1 * Math.sin(a))} ${f1(cy - r1 * Math.cos(a))}"/>`;
    }
    const a0 = (-135 * Math.PI) / 180;
    out += txt(cx + (r + 12) * Math.sin(a0) - 6, cy - (r + 12) * Math.cos(a0) + 10, '0', 22, 'middle', 'pa-big');
    const a = ((-135 + 270 * v) * Math.PI) / 180;
    out += `<path class="pa-accl" d="M${f1(cx - 12 * Math.sin(a))} ${f1(cy + 12 * Math.cos(a))}L${f1(cx + (r - 16) * Math.sin(a))} ${f1(cy - (r - 16) * Math.cos(a))}"/>`;
    out += `<circle class="pa-acc" cx="${cx}" cy="${cy}" r="6"/>`;
    out += txt(cx, cy + r + 40, bar, 24, 'middle', 'pa-big');
    return out;
  }
  // ISO 8573-1: three classes, an example code
  function isoSvg(q) {
    const x0 = 328;
    let out = rect(x0, 112, 300, 276);
    out += txt(x0 + 14, 146, 'ISO 8573-1', 22, 'start', 'pa-big') + txt(x0 + 288, 146, EX, 20, 'end', 'pa-mute');
    const rows = NL ? [['deeltjes', '2'], ['water', '4'], ['olie', '2']] : [['particles', '2'], ['water', '4'], ['oil', '2']];
    rows.forEach(([name, cls], i) => {
      const y = 190 + i * 40;
      const on = q > i / 3;
      out += txt(x0 + 18, y, name, 21, 'start', on ? 'pa-txt' : 'pa-mute') + txt(x0 + 200, y, tr('klasse', 'class'), 20, 'end', 'pa-mute') + txt(x0 + 236, y, on ? cls : '·', 24, 'middle', 'pa-big');
    });
    out += txt(x0 + 18, 334, '[2:4:2]', 28, 'start', 'pa-big');
    out += txt(x0 + 18, 370, tr('lager getal = schoner', 'lower number = cleaner'), 20, 'start', 'pa-on');
    return out;
  }
  // the FRL in section: filter bowl with water, regulator with its spring and gauge, lubricator with oil drops
  function frlSvg(focus, clockS) {
    const x0 = 328;
    let out = rect(x0, 12, 300, 376);
    out += txt(x0 + 14, 42, tr('verzorgingseenheid', 'FRL unit'), 20, 'start', 'pa-mute');
    const cols = [x0 + 56, x0 + 150, x0 + 244];
    const names = NL ? ['filter', 'regelaar', 'olienevelaar'] : ['filter', 'regulator', 'lubricator'];
    // the air line through all three
    out += rect(x0 + 16, 98, 268, 14, 'pa-fill', 2) + arrow([[x0 + 20, 105], [x0 + 284, 105]], 'pa-dim', 7);
    cols.forEach((cx, i) => {
      const on = focus === i || focus < 0;
      out += rect(cx - 30, 80, 60, 50, on ? 'pa-steel' : 'pa-wall', 4);
      const lx = [x0 + 14, cols[1] + 18, x0 + 290][i]; out += txt(lx, i === 1 ? 74 : 372, names[i], 20, ['start', 'start', 'end'][i], on ? 'pa-on' : 'pa-mute');
    });
    // filter: the bowl, a water layer, falling drops
    out += rect(cols[0] - 22, 130, 44, 120, focus === 0 ? 'pa-steel' : 'pa-wall', 12) + rect(cols[0] - 18, 214, 36, 30, 'pa-fill', 8);
    for (let i = 0; i < 3; i++) { const k = (clockS * 0.6 + i / 3) % 1; out += `<circle class="pa-acc" cx="${f1(cols[0] - 8 + i * 8)}" cy="${f1(140 + 70 * k)}" r="3"/>`; }
    // regulator: the knob, the spring, the gauge
    out += rect(cols[1] - 12, 56, 24, 24, 'pa-wall', 4);
    out += path(Array.from({ length: 9 }, (_, i) => [cols[1] + (i % 2 ? 8 : -8), 134 + i * 9]), focus === 1 ? 'pa-accl' : 'pa-dim');
    out += `<circle class="pa-dial" cx="${cols[1]}" cy="${f1(270)}" r="34"/>`;
    const a = ((-135 + 270 * (C.REST / 10)) * Math.PI) / 180;
    out += `<path class="pa-accl" d="M${cols[1]} 270L${f1(cols[1] + 26 * Math.sin(a))} ${f1(270 - 26 * Math.cos(a))}"/>` + txt(cols[1], 336, '6 bar', 22, 'middle', 'pa-big');
    // lubricator: the bowl of oil, a mist of drops into the air line
    out += rect(cols[2] - 22, 130, 44, 120, focus === 2 ? 'pa-steel' : 'pa-wall', 12) + rect(cols[2] - 18, 190, 36, 54, 'pa-fill', 8);
    if (focus === 2) for (let i = 0; i < 5; i++) { const k = (clockS * 0.9 + i / 5) % 1; out += `<circle class="pa-acc" cx="${f1(cols[2] + 10 + 40 * k)}" cy="${f1(108 + 4 * Math.sin(i * 2.1))}" r="2"/>`; }
    if (focus === 2) out += txt(x0 + 290, 300, tr('vaak zonder', 'often without'), 20, 'end', 'pa-mute');
    return out;
  }
  // pressure costs energy: a ladder of bars per bar of pressure, then the local fix
  function pressSvg(step) {
    const x0 = 12;
    let out = rect(x0, 12, 300, 376);
    out += txt(x0 + 14, 42, tr('netdruk en energie', 'pressure, energy'), 20, 'start', 'pa-mute') + txt(x0 + 288, 42, SCH, 20, 'end', 'pa-mute');
    const rows = [6, 7, 8];
    rows.forEach((bar, i) => {
      const y = 76 + i * 46;
      const w = 160 * (1 + C.PER_BAR * (bar - 6));
      const lit = step >= 2 && bar === 8;
      out += txt(x0 + 18, y + 18, `${bar} bar`, 21, 'start', 'pa-mono') + rect(x0 + 92, y, w, 24, lit ? 'pa-acc' : 'pa-bar', 3);
      if (i) out += txt(x0 + 98 + w, y + 18, `+${i * 7}%`, 20, 'start', 'pa-big');
    });
    out += txt(x0 + 18, 228, tr('≈ 7% per bar (6 tot 8%)', '≈ 7% per bar (6 to 8%)'), 20, 'start', 'pa-on');
    if (step >= 3) {
      out += txt(x0 + 18, 272, tr('net 8 → 6 bar', 'network 8 → 6 bar'), 21, 'start', 'pa-txt');
      out += txt(x0 + 18, 306, tr('1 machine 7,5 bar:', '1 machine 7.5 bar:'), 21, 'start', 'pa-txt');
      out += txt(x0 + 18, 340, tr('booster, dikkere leiding,', 'booster, bigger pipe,'), 20, 'start', 'pa-on');
      out += txt(x0 + 18, 370, tr('eigen buffervat', 'its own tank'), 20, 'start', 'pa-on');
    } else if (step >= 1) {
      out += txt(x0 + 18, 290, tr('hogere druk: groter lek', 'higher pressure: bigger leak'), 20, 'start', 'pa-txt');
      out += txt(x0 + 18, 324, tr('drukverlies: dunne leiding,', 'pressure drop: thin pipe,'), 20, 'start', 'pa-txt');
      out += txt(x0 + 18, 352, tr('vuil filter', 'dirty filter'), 20, 'start', 'pa-txt');
    }
    return out;
  }
  // the weekend load strip: loaded and unloaded over ten minutes, 40 % loaded
  const LOAD = [[0, 1.2], [2.5, 3.6], [5, 6.2], [7.5, 8.6]]; // loaded spans (min) of 10: 4 × 1,0–1,2… ≈ 40 %
  const loadedAt = (m) => { const t = m % 2.5; return t < 1; };
  function loadSvg(cursor) {
    const x0 = 12;
    let out = rect(x0, 12, 300, 210);
    out += txt(x0 + 14, 42, tr('zaterdag, productie stil', 'Saturday, production stopped'), 20, 'start', 'pa-mute');
    const sx = x0 + 18;
    const wpx = 264;
    const ytop = 72;
    out += txt(sx, ytop + 4, tr('in last', 'loaded'), 20, 'start', 'pa-on') + txt(sx, ytop + 76, tr('nullast', 'unloaded'), 20, 'start', 'pa-mute');
    const pts = [];
    for (let i = 0; i <= 200; i++) { const m = (i / 200) * 10; if (m > cursor) break; pts.push([sx + (m / 10) * wpx, loadedAt(m) ? ytop + 20 : ytop + 50]); }
    if (pts.length > 1) out += path(pts, 'pa-accl');
    out += path([[sx, ytop + 60], [sx + wpx, ytop + 60]], 'pa-dim');
    out += txt(sx, ytop + 104, '0', 20, 'start', 'pa-mono') + txt(sx + wpx, ytop + 104, '10 min', 20, 'end', 'pa-mono');
    if (cursor >= 10) out += txt(sx, ytop + 136, tr('40% van de tijd in last', '40% of the time loaded'), 21, 'start', 'pa-on');
    return out;
  }
  function calcSvg(step) {
    const x0 = 12;
    let out = rect(x0, 232, 300, 156);
    out += txt(x0 + 14, 262, EX, 20, 'start', 'pa-mute');
    out += txt(x0 + 14, 296, n('75 kW, 10 m³/min in last', '75 kW, 10 m³/min loaded'), 20, 'start', 'pa-txt');
    if (step >= 1) out += txt(x0 + 14, 332, n('40% × 10 = 4 m³/min', '40% × 10 = 4 m³/min'), 22, 'start', 'pa-big');
    if (step >= 1) out += txt(x0 + 14, 368, tr('lekt weg, dag en nacht', 'leaking, day and night'), 20, 'start', 'pa-on');
    return out;
  }
  // the year's leak bill: a kWh counter tile (as eng.power.motor) and the euros
  function kwhSvg(a, euros) {
    const x0 = 12;
    let out = rect(x0, 12, 300, 230);
    out += txt(x0 + 14, 42, tr('lekken, een jaar', 'leaks, one year'), 20, 'start', 'pa-mute') + txt(x0 + 288, 42, EX, 20, 'end', 'pa-mute');
    out += txt(x0 + 14, 76, n('75 kW × 40% × 8.760 uur', '75 kW × 40% × 8,760 h'), 20, 'start', 'pa-mono');
    const v = Math.round((C.KWH * a) / 1000) * 1000;
    const s = NL ? v.toLocaleString('nl-NL') : v.toLocaleString('en-GB');
    out += rect(x0 + 14, 92, 272, 56, 'pa-wall', 6) + txt(x0 + 270, 132, `${a >= 0.999 ? '≈ ' : ''}${a >= 0.999 ? (NL ? '263.000' : '263,000') : s} kWh`, 26, 'end', 'pa-big');
    if (euros > 0.01) {
      out += txt(x0 + 14, 182, n('× €0,15 per kWh', '× €0.15 per kWh'), 20, 'start', 'pa-mono');
      out += txt(x0 + 14, 224, n('≈ €39.000 per jaar', '≈ €39,000 a year'), 24, 'start', 'pa-big');
    }
    return out;
  }
  // a checklist panel: rows ticked (or crossed, mark 'x') one by one (as eng.power.hydraulics)
  function listSvg(title, rows, ticked, x0 = 12, w = 300, marks = []) {
    const h = 56 + rows.length * 40;
    const top = 392 - h;
    let out = `<g transform="translate(${x0 - 12} 0)">` + rect(12, top, w, h);
    out += txt(28, top + 34, title, 21, 'start', 'pa-mute');
    rows.forEach((t, i) => {
      const y = top + 50 + i * 40;
      const on = i < ticked;
      out += marks[i] === 'x'
        ? `<path class="${on ? 'pa-accl' : 'pa-dim'}" d="M31 ${y + 9}L47 ${y + 25}M47 ${y + 9}L31 ${y + 25}"/>`
        : `<path class="${on ? 'pa-accl' : 'pa-dim'}" d="M30 ${y + 18}L37 ${y + 25}L50 ${y + 10}"/>`;
      out += txt(64, y + 26, t, 21, 'start', on ? 'pa-txt' : 'pa-mute');
    });
    return out + '</g>';
  }
  // compressed air against a blower: energy for the same job, a schema
  function cmpSvg(a) {
    const x0 = 12;
    let out = rect(x0, 12, 300, 200);
    out += txt(x0 + 14, 42, tr('zelfde werk, energie', 'same job'), 20, 'start', 'pa-mute') + txt(x0 + 288, 42, SCH, 20, 'end', 'pa-mute');
    out += txt(x0 + 18, 84, tr('perslucht', 'compressed air'), 21) + rect(x0 + 18, 94, 260 * a, 24, 'pa-bar', 3);
    out += txt(x0 + 18, 152, tr('blower, ventilator', 'blower, fan'), 21, 'start', 'pa-on') + rect(x0 + 18, 162, 260 * 0.18 * a, 24, 'pa-acc', 3);
    out += txt(x0 + 80, 182, tr('een fractie', 'a fraction'), 20, 'start', 'pa-big');
    return out;
  }
  function warnSvg() {
    const x0 = 12;
    let out = rect(x0, 236, 300, 152);
    out += path([[x0 + 46, 262], [x0 + 72, 308], [x0 + 20, 308], [x0 + 46, 262]], 'pa-accl') + txt(x0 + 46, 302, '!', 22, 'middle', 'pa-big');
    out += txt(x0 + 90, 278, tr('nooit op je huid', 'never at your skin'), 21, 'start', 'pa-txt');
    out += txt(x0 + 90, 308, tr('of kleding', 'or clothes'), 21, 'start', 'pa-txt');
    out += txt(x0 + 20, 350, tr('lucht onder de huid,', 'air under the skin,'), 20, 'start', 'pa-mute');
    out += txt(x0 + 20, 376, tr('vuil in je ogen', 'dirt in your eyes'), 20, 'start', 'pa-mute');
    return out;
  }
  function askSvg(a) {
    const x0 = 12;
    let out = rect(x0, 180, 300, 208);
    out += txt(x0 + 14, 212, tr('bij elke rondgang', 'on every walk'), 20, 'start', 'pa-mute');
    out += txt(x0 + 18, 252, tr('Waarvoor is deze lucht?', 'What is this air for?'), 23, 'start', 'pa-on');
    if (a > 0.5) out += txt(x0 + 18, 290, tr('Kan het zonder perslucht?', 'Could it do without?'), 21, 'start', 'pa-txt');
    out += txt(x0 + 18, 326, tr('Minder vraag is meestal', 'Less demand is usually'), 20, 'start', 'pa-mute');
    out += txt(x0 + 18, 352, tr('goedkoper dan een', 'cheaper than a more'), 20, 'start', 'pa-mute');
    out += txt(x0 + 18, 378, tr('zuiniger compressor', 'efficient compressor'), 20, 'start', 'pa-mute');
    return out;
  }
  // the ultrasonic detector and the tag on the FRL inlet leak, in stage space at the leak
  function tagSvg(det, tag) {
    const [x, y] = toStage(C.LEAKS[1]);
    let out = '';
    if (det > 0.01) {
      const dx = x + 70 - 40 * det;
      const dy = y + 70 - 30 * det;
      out += rect(dx, dy, 52, 30, 'pa-steel', 6) + path([[dx, dy + 8], [dx - 18, dy - 2], [dx - 18, dy + 22], [dx, dy + 22]], 'pa-line');
      out += rect(dx + 8, dy + 7, 26, 9, 'pa-acc', 2);
      out += rect(dx + 18, dy + 30, 14, 34, 'pa-wall', 4);
    }
    if (tag > 0.01) {
      out += path([[x, y], [x - 6, y + 16 * tag]], 'pa-dim');
      out += rect(x - 26, y + 16 * tag, 40, 24, 'pa-badge', 4) + txt(x - 6, y + 16 * tag + 18, tr('lek', 'leak'), 20, 'middle', 'pa-badgeT');
    }
    return out;
  }

  // ------------------------------------------------------------ air flow
  const AIRF = ['fdis', 'frcv', 'fdry', 'frise', 'fhdr', 'fout', 'fcyl', 'fgun'];
  function flow(st, clockS) {
    for (const key of [...AIRF, 'fhot', 'fcold']) {
      const d = st.flow[key] || 0;
      const a = Math.min(1, Math.abs(d));
      fade(E[key], a);
      if (a > 0.01) { const off = f1(-clockS * 8 * Math.sign(d)); if (E[key].__o !== off) { E[key].style.strokeDashoffset = off; E[key].__o = off; } }
    }
  }
  const allAir = (k = 1) => { const f = {}; AIRF.forEach((key) => { if (key !== 'fgun') f[key] = k; }); return f; };
  // the machine cycle: out, hold, back, rest (period 5 s)
  function cycle(t) {
    const c = t % 5;
    return { rod: span(c, 0.3, 1.4) - span(c, 2.6, 3.7), valve: c > 0.3 && c < 2.6 };
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['energy', 'gaugeBig', 'iso', 'frlC', 'press', 'load', 'calc', 'kwh', 'list', 'cmp', 'warn', 'ask', 'tag'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    const st = { run: true, loaded: true, rod: 0, valve: false, flow: allAir(0.7), gauge: 0.7, gauge2: 0.6, leak: 0, hissAmp: 1, blast: 0, bowl: 0, drain: 0, water: 0, tag: 0, det: 0 };
    const cyc = cycle(clockS);
    st.rod = cyc.rod; st.valve = cyc.valve;

    if (si === 0) {
      st.flow = allAir(b === 0 ? span(p, 0.3, 0.7) : 1);
      vis.gaugeBig = b === 2 ? span(p, 0, 0.12) : 0;
      if (vis.gaugeBig > 0.01) set(E.gaugeBig, gaugeSvg(0.7, tr('buffervat', 'receiver'), n('≈ 7 bar', '≈ 7 bar')));
      st.gauge = b === 2 ? 0.7 : 0.7;
    } else if (si === 1) {
      vis.energy = b === 2 ? 0 : 1;
      if (vis.energy) set(E.energy, energySvg(b === 3 ? 2 : b));
      st.flow.fhot = b >= 2 ? 1 : 0; st.flow.fcold = b >= 2 ? 1 : 0;
    } else if (si === 2) {
      st.water = b === 0 ? 1 : 0;
      st.drain = b >= 2 ? 1 : 0;
      vis.iso = b === 3 ? span(p, 0, 0.1) : 0;
      if (vis.iso > 0.01) set(E.iso, isoSvg(span(p, 0.1, 0.7)));
    } else if (si === 3) {
      vis.frlC = b >= 0 ? span(u, 0.02, 0.08) : 0;
      if (vis.frlC > 0.01) set(E.frlC, frlSvg(b === 0 ? -1 : b - 1, clockS));
      st.bowl = b === 1 ? 1 : 0.4;
      st.gauge2 = 0.6;
    } else if (si === 4) {
      vis.press = 1;
      set(E.press, pressSvg(b));
      st.leak = b === 1 ? 1 : 0;
      st.hissAmp = b === 1 ? 1 + 0.6 * span(p, 0.1, 0.6) : 1;
      st.gauge = b === 2 ? 0.8 : b === 3 ? lerp(0.8, 0.6, span(p, 0.4, 0.9)) : 0.7;
    } else if (si === 5) {
      // the weekend: the machine stopped, no flow to the tools, only leaks
      st.rod = 0; st.valve = false;
      st.flow = allAir(0.5); st.flow.fcyl = 0; st.flow.fout = 0.3;
      st.leak = 1;
      if (b >= 1) {
        const m = b === 1 ? 10 * span(p, 0.1, 0.95) : 10;
        vis.load = b === 1 ? span(p, 0, 0.08) : 1;
        set(E.load, loadSvg(m));
        st.loaded = loadedAt(b === 1 ? m : clockS / 3);
      }
      vis.calc = b >= 2 ? (b === 2 ? span(p, 0, 0.1) : 1) : 0;
      if (vis.calc > 0.01) set(E.calc, calcSvg(b - 2));
    } else if (si === 6) {
      st.rod = 0; st.valve = false; st.flow = allAir(0.5); st.flow.fcyl = 0;
      st.leak = b === 3 ? 0 : 1;
      vis.kwh = b <= 1 ? 1 : 0;
      if (vis.kwh) set(E.kwh, kwhSvg(b === 0 ? span(p, 0.15, 0.85) : 1, b === 1 ? span(p, 0.05, 0.2) : 0));
      if (b === 2) { st.det = span(p, 0.05, 0.4); st.tag = span(p, 0.55, 0.8); }
      if (b === 3) { st.det = 0; st.tag = 1; }
      vis.tag = b >= 2 ? 1 : 0;
      if (vis.tag) set(E.tag, tagSvg(st.det, st.tag));
      vis.list = b === 3 ? span(p, 0, 0.08) : 0;
      if (vis.list > 0.01) {
        set(E.list, listSvg(tr('lekronde', 'leak round'), NL ? ['zoeken met ultrasoon', 'label op elk lek', 'repareren', '1 bar lager: ≈ −7%'] : ['find by ultrasound', 'tag every leak', 'repair', '1 bar lower: ≈ −7%'], 1 + Math.floor(span(p, 0.08, 0.8) * 3.99)));
      }
      st.gauge = b === 3 ? lerp(0.7, 0.6, span(p, 0.6, 0.9)) : 0.7;
    } else if (si === 7) {
      st.rod = 0;
      st.blast = b === 0 || b === 1 ? span(p, 0.05, 0.25) : b === 2 ? 1 - span(p, 0, 0.2) : 0;
      st.flow.fgun = st.blast;
      vis.cmp = b === 1 ? span(p, 0, 0.1) : 0;
      if (vis.cmp > 0.01) set(E.cmp, cmpSvg(span(p, 0.1, 0.6)));
      vis.warn = b === 2 ? span(p, 0, 0.1) : 0;
      if (vis.warn > 0.01) set(E.warn, warnSvg());
      vis.ask = b === 3 ? span(p, 0, 0.08) : 0;
      if (vis.ask > 0.01) set(E.ask, askSvg(span(p, 0.4, 0.6)));
      if (b === 0) {
        vis.list = span(p, 0.3, 0.4);
        if (vis.list > 0.01) set(E.list, listSvg(tr('oneigenlijk gebruik', 'inappropriate use'), NL ? ['open blaaspijpje', 'koelen met lucht', 'vacuüm met perslucht'] : ['open blow-off', 'cooling with air', 'vacuum from air'], 1 + Math.floor(span(p, 0.4, 0.9) * 2.99), 12, 300, ['x', 'x', 'x']));
      }
    }

    // ---- the drawing
    set(E.fan, '');
    E.fan.setAttribute('d', st.run ? fanPath(clockS * 3) : fanPath(0));
    set(E.scr, screenSvg(st.loaded));
    flag(LED.motor, 'data-on', st.run);
    flag(LED.load, 'data-on', st.loaded);
    flag(LED.dry, 'data-on', true);
    flag(LED.valve, 'data-on', st.valve);
    set(E.needle, needleSvg(C.GAUGE, 3.8, st.gauge));
    set(E.needle2, needleSvg([C.FRL.x[1] + 4, C.FRL.y + 7, C.FRL.z - 1], 2.8, st.gauge2));
    move(E.rod, [C.CYL.stroke * st.rod, 0, 0]);
    flow(st, clockS);
    let hiss = '';
    if (st.leak > 0.01) C.LEAKS.forEach((lp, i) => { hiss += hissSvg(lp, st.hissAmp, clockS + i * 0.37, [-1.9, -2.4, 2.6][i]); });
    set(E.hiss, hiss);
    set(E.blast, st.blast > 0.01 ? blastSvg(st.blast, clockS) : '');
    const fx = C.FRL.x[0] + 4;
    set(E.bowlF, st.bowl > 0.01 ? dropsSvg([fx, C.FRL.y + 3.4, C.FRL.z - 6], 2, clockS, 8) : '');
    set(E.bowlL, '');
    if (st.drain > 0.01 || st.water > 0.01) {
      let w = st.drain ? dropsSvg([44, 0, 23.5], 3, clockS, 20) + dropsSvg([24.5, 17, 2], 2, clockS, 2) : '';
      if (st.water) for (let i = 0; i < 6; i++) { const k = (clockS * 0.25 + i / 6) % 1; const [x, y] = at([lerp(-112, -42, k), 12, 50]); w += `<circle class="pa-drop" cx="${f2(x)}" cy="${f2(y)}" r="0.8"/>`; }
      set(E.bowlL, w);
    }
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();

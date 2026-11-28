// The stage of the film "Van sensor tot ERP / From sensor to ERP": a pure
// function of (scene, u). Inlined into the page after the anatomy kit (iso-kit
// functions in scope) and a preamble from build.mjs that defines P
// (projection), C (world constants), CAM (one camera move per scene), W and H.
// Moves are placed per caption beat (beatStarts), so the video's narration
// timing (films/_kit/beatwarp.js) keeps them in step.
/* global P, C, CAM, W, H, iso, translateAlong, span, beatStarts */
const STAGE = (() => {
  const svg = document.querySelector('.fp-stage svg');
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
  const at = (p) => iso(p, P);
  const fmt = (pts) => (pts.length ? 'M' + pts.map(([x, y]) => f2(x) + ' ' + f2(y)).join('L') : '');
  const show = (e, on) => { const want = on ? '' : 'none'; if (e.style.display !== want) e.style.display = want; };
  const set = (e, html) => { if (e.__h !== html) { e.innerHTML = html; e.__h = html; } };
  const move = (e, by) => { const t = translateAlong(P, by); if (e.__t !== t) { e.setAttribute('transform', t); e.__t = t; } };
  const fade = (e, a) => { const v = a >= 0.999 ? '' : Math.max(0, a).toFixed(3); if (e.style.opacity !== v) e.style.opacity = v; };
  const flag = (e, name, on) => { if (e.hasAttribute(name) !== !!on) e.toggleAttribute(name, !!on); };
  const num = (v) => (NL ? String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  const txt = (x, y, t, size = 21, anchor = 'start', cls = 'ia-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'ia-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'ia-dim') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  const EXAMPLE = tr('voorbeeld', 'example');
  const O = C.ORDER;

  // the boundary between levels 3 and 4: a dashed band round the ledge top (drawn once)
  {
    const t = C.TIER.td;
    const pts = [[C.X0 + 4, t.y0 + 3, t.z], [C.X0 + C.XW - 4, t.y0 + 3, t.z], [C.X0 + C.XW - 4, t.y1 - 3, t.z], [C.X0 + 4, t.y1 - 3, t.z]].map(at);
    E.b34.innerHTML = `<path class="ia-band" d="${fmt(pts)}Z"/>`;
  }

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

  // ------------------------------------------------------------ screens on the faces (lines in the face plane)
  // rows: [[fraction of width, lit]] drawn top-down on a face of constant y
  function faceRows(y, x0, x1, z0, z1, rows) {
    let out = '';
    const n = rows.length;
    rows.forEach(([w, lit], i) => {
      const z = z1 - ((i + 1) * (z1 - z0)) / (n + 1);
      out += `<path class="${lit ? 'ia-scra' : 'ia-scr'}" d="${fmt([at([x0, y, z]), at([x0 + (x1 - x0) * w, y, z])])}"/>`;
    });
    return out;
  }
  // a trend line on a face: values 0..1 across the width
  function faceTrend(y, x0, x1, z0, z1, vals, lit) {
    return `<path class="${lit ? 'ia-scra' : 'ia-scr'}" d="${fmt(vals.map((v, i) => at([x0 + ((x1 - x0) * i) / (vals.length - 1), y, z0 + (z1 - z0) * v])))}"/>`;
  }

  // ------------------------------------------------------------ the level tags (stage space)
  function tagsSvg(purdue, dmz, hl) {
    const T = C.TIER;
    const xr = C.X0 + C.XW - 18;
    const list = [
      ['0', [C.BIN.x - 10, C.BIN.y + C.BIN.d, 14]],
      ['1', [C.SENS[0], C.SENS[1], 96]],
      ['2', [xr, (T.t2.y0 + T.t2.y1) / 2, T.t2.z + 14]],
      ['3', [xr, (T.t3.y0 + T.t3.y1) / 2, T.t3.z + 14]],
      ['4', [xr, (T.t4.y0 + T.t4.y1) / 2, T.t4.z + 14]],
    ];
    if (dmz) list.push(['3.5', [xr, (T.td.y0 + T.td.y1) / 2, T.td.z + 10]]);
    if (purdue) list.push(['5', [xr, (T.t5.y0 + T.t5.y1) / 2, T.t5.z + 14]]);
    let out = '';
    for (const [t, p] of list) {
      const [x, y] = toStage(p);
      if (x < -20 || x > W + 20 || y < -20 || y > H + 20) continue;
      const w = t.length > 1 ? 50 : 32;
      const on = hl && hl.includes(t);
      out += rect(x - w / 2, y - 16, w, 32, on ? 'ia-row' : 'ia-pill', 16) + txt(x, y + 7.5, t, 21, 'middle', 'ia-big');
    }
    return out;
  }

  // ------------------------------------------------------------ panels
  function titleSvg() {
    return rect(12, 12, 280, 84) + txt(26, 46, 'ISA-95', 28, 'start', 'ia-big') + txt(26, 80, tr('IEC 62264 · deel 1 in 2000', 'IEC 62264 · part 1 in 2000'), 21, 'start', 'ia-mute');
  }
  function timeSvg(stage) {
    // stage 0: the timescale per level; 1: down for an hour; 2: OEE from SAP?
    let out = rect(12, 12, 360, 196);
    if (stage === 0) {
      out += txt(28, 46, tr('tijdschaal', 'timescale'), 22, 'start', 'ia-big');
      const rows = NL ? [['4', 'maanden · weken · dagen'], ['3', 'dagen … seconden'], ['1–2', 'seconden en sneller']] : [['4', 'months · weeks · days'], ['3', 'days … seconds'], ['1–2', 'seconds and faster']];
      rows.forEach(([l, t], i) => { const y = 88 + i * 42; out += txt(28, y, l, 21, 'start', 'ia-big') + txt(82, y, t, 21, 'start', 'ia-txt'); });
    } else if (stage === 1) {
      out += txt(28, 46, tr('een uur uit?', 'down for an hour?'), 22, 'start', 'ia-big');
      out += txt(28, 96, tr('PLC uit:', 'PLC down:'), 21, 'start', 'ia-big') + txt(28, 126, tr('de machine staat stil', 'the machine stops'), 21, 'start', 'ia-txt');
      out += txt(28, 164, tr('ERP uit:', 'ERP down:'), 21, 'start', 'ia-big') + txt(28, 194, tr('de lijn draait meestal door', 'the line usually runs on'), 21, 'start', 'ia-txt');
    } else {
      out += txt(28, 46, tr('“OEE uit SAP”?', '“OEE from SAP”?'), 22, 'start', 'ia-big');
      out += txt(28, 96, tr('ERP: wat geboekt is', 'ERP: what was booked'), 21, 'start', 'ia-txt');
      out += txt(28, 132, tr('PLC: wat de machine', 'PLC: what the machine'), 21, 'start', 'ia-txt') + txt(28, 160, tr('per minuut deed', 'did minute by minute'), 21, 'start', 'ia-txt');
      out += `<circle class="ia-acc" cx="34" cy="190" r="4"/>` + txt(46, 197, tr('op welk niveau ontstaat het?', 'at which level does it arise?'), 20, 'start', 'ia-txt');
    }
    return out;
  }
  function orderHead() {
    return rect(12, 12, 316, 106) + txt(28, 46, tr('productieorder', 'production order'), 22, 'start', 'ia-big') + txt(312, 106, EXAMPLE, 20, 'end', 'ia-mute')
      + txt(28, 78, tr(`${num(O.qty)} doppen · type A`, `${num(O.qty)} caps · type A`), 21, 'start', 'ia-txt') + txt(28, 106, tr('klaar: donderdag', 'ready: Thursday'), 21, 'start', 'ia-txt');
  }
  function orderBom(prog) {
    const kg = (O.qty * O.gram) / 1000;
    return rect(12, 126, 316, 96) + txt(28, 158, tr('stuklijst', 'bill of materials'), 21, 'start', 'ia-big')
      + txt(28, 190, tr(`${O.gram} g granulaat per dop`, `${O.gram} g granulate per cap`), 21, 'start', 'ia-txt')
      + txt(28, 214, `${num(O.qty)} × ${O.gram} g = `, 20, 'start', 'ia-mute') + (prog > 0.5 ? txt(312, 214, `${kg} kg`, 22, 'end', 'ia-big') : '');
  }
  function orderRoute() {
    return rect(12, 230, 316, 96) + txt(28, 262, 'routing', 21, 'start', 'ia-big')
      + txt(28, 292, tr(`spuitgieten · machine ${O.machine}`, `moulding · machine ${O.machine}`), 21, 'start', 'ia-txt') + txt(28, 318, tr(`${O.cycle} s per cyclus`, `${O.cycle} s per cycle`), 21, 'start', 'ia-txt');
  }
  function stamSvg(cmp) {
    let out = rect(12, 12, 340, cmp > 0.01 ? 196 : 112);
    out += txt(28, 46, tr('stamdata', 'master data'), 22, 'start', 'ia-big');
    out += txt(28, 80, tr('vast in het ERP,', 'fixed in the ERP,'), 21, 'start', 'ia-txt') + txt(28, 104, tr('kopie naar het MES', 'copied to the MES'), 21, 'start', 'ia-txt');
    if (cmp > 0.01) {
      const full = 160;
      const w10 = (full * O.master) / O.cycle;
      out += `<g style="opacity:${cmp.toFixed(2)}">`;
      out += txt(28, 146, tr('norm', 'norm'), 20, 'start', 'ia-mute') + `<rect class="fp-meter" x="122" y="130" width="${f1(w10)}" height="20" rx="2"/>` + txt(130 + w10, 147, `${O.master} s`, 21, 'start', 'ia-big');
      out += txt(28, 186, tr('machine', 'machine'), 20, 'start', 'ia-mute') + `<rect class="fp-meter" data-top="" x="122" y="170" width="${f1(full * cmp)}" height="20" rx="2"/>` + txt(130 + full * cmp, 187, `${O.cycle} s`, 21, 'start', 'ia-big');
      out += '</g>';
    }
    return out;
  }
  function planSvg() {
    return rect(12, 12, 340, 76) + txt(28, 46, 'MES', 22, 'start', 'ia-big') + txt(336, 44, EXAMPLE, 20, 'end', 'ia-mute')
      + txt(28, 76, tr(`di · vroege dienst · machine ${O.machine}`, `Tue · early shift · machine ${O.machine}`), 21, 'start', 'ia-txt');
  }
  function reportSvg() {
    return rect(12, 12, 316, 76) + txt(28, 46, tr('terugmelding', 'report back'), 22, 'start', 'ia-big') + txt(312, 44, 'MES → ERP', 20, 'end', 'ia-mute')
      + txt(28, 76, tr(`${num(O.good)} goed · ${O.scrap} afkeur`, `${num(O.good)} good · ${O.scrap} scrap`), 21, 'start', 'ia-txt');
  }
  function imapSvg(hl, ox = 0, oy = 0) {
    const rows = NL ? [['4', 'ERP'], ['3', 'MES'], ['2', 'PLC, SCADA'], ['1', 'sensoren'], ['0', 'proces']] : [['4', 'ERP'], ['3', 'MES'], ['2', 'PLC, SCADA'], ['1', 'sensors'], ['0', 'process']];
    let out = rect(12, 12, 196, 262) + txt(26, 44, 'ISA-95', 22, 'start', 'ia-big') + txt(26, 70, tr('taken', 'tasks'), 20, 'start', 'ia-mute');
    rows.forEach(([l, t], i) => { const y = 108 + i * 38; if (hl === i) out += rect(18, y - 26, 184, 36, 'ia-row', 6); out += txt(26, y, l, 21, 'start', 'ia-big') + txt(52, y, t, 21, 'start', 'ia-txt'); });
    return `<g transform="translate(${ox} ${oy})">${out}</g>`;
  }
  function pmapSvg(dmz, hl, ox = 0, oy = 0) {
    const rows = NL ? [['5', 'bedrijfsnet'], ['4', 'kantoornet'], ['3.5', 'DMZ'], ['0–3', 'fabriek']] : [['5', 'enterprise'], ['4', 'office net'], ['3.5', 'DMZ'], ['0–3', 'plant']];
    let out = rect(216, 12, 200, 262) + txt(230, 44, 'Purdue', 22, 'start', 'ia-big') + txt(230, 70, tr('netwerk', 'network'), 20, 'start', 'ia-mute');
    rows.forEach(([l, t], i) => {
      if (i === 2 && dmz <= 0.01) return;
      const y = 108 + (i === 3 && dmz <= 0.01 ? 2 : i) * 42;
      const g = `${hl === i ? rect(222, y - 27, 188, 38, 'ia-row', 6) : ''}${txt(230, y, l, 21, 'start', 'ia-big')}${txt(280, y, t, 21, 'start', 'ia-txt')}`;
      out += i === 2 ? `<g style="opacity:${dmz.toFixed(2)}">${g}</g>` : g;
    });
    return `<g transform="translate(${ox} ${oy})">${out}</g>`;
  }

  // ------------------------------------------------------------ packets on the cable (stage space)
  const R = C.ROUTE;
  // the point at fraction f of the polyline from stop a to stop b (either direction)
  function along(a, b, f) {
    const idx = [];
    if (a <= b) for (let i = a; i <= b; i++) idx.push(i); else for (let i = a; i >= b; i--) idx.push(i);
    const pts = idx.map((i) => R[i]);
    const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1], p[2] - pts[i][2]));
    let left = clamp(f, 0, 1) * lens.reduce((x, y) => x + y, 0);
    for (let i = 0; i < lens.length; i++) {
      if (left <= lens[i] || i === lens.length - 1) { const t = lens[i] ? clamp(left / lens[i], 0, 1) : 0; return pts[i].map((v, j) => v + (pts[i + 1][j] - v) * t); }
      left -= lens[i];
    }
    return pts[pts.length - 1];
  }
  function packet(p, kind) {
    const [x, y] = toStage(p);
    if (kind === 'order') return `<rect class="ia-acc" x="${f1(x - 11)}" y="${f1(y - 14)}" width="22" height="28" rx="3"/><path class="ia-scr" style="stroke:var(--fp-on-accent);stroke-width:1.6" d="M${f1(x - 6)} ${f1(y - 6)}L${f1(x + 6)} ${f1(y - 6)}M${f1(x - 6)} ${f1(y)}L${f1(x + 6)} ${f1(y)}M${f1(x - 6)} ${f1(y + 6)}L${f1(x + 2)} ${f1(y + 6)}"/>`;
    return `<circle class="ia-acc" cx="${f1(x)}" cy="${f1(y)}" r="7"/>`;
  }
  // the outbound connection in the cloud-MES example: connector → relay → cloud, drawn up to prog
  function linkSvg(prog) {
    const pts = [[C.CONN.x + C.CONN.w / 2, C.CONN.y, 86], [C.CONN.x + C.CONN.w / 2, C.TIER.td.y1, 100], [C.RELAY.x + C.RELAY.w, C.RELAY.y + 5, 104], [C.RELAY.x + C.RELAY.w + 6, C.TIER.t4.y1, 130], [C.CLOUD.x + C.CLOUD.w / 2, C.TIER.t5.y1, 172], [C.CLOUD.x + C.CLOUD.w / 2, C.CLOUD.y + C.CLOUD.d, 172]].map(toStage);
    const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
    let left = prog * lens.reduce((a, b) => a + b, 0);
    const shown = [pts[0]];
    for (let i = 0; i < lens.length && left > 0; i++) {
      const t = Math.min(1, left / lens[i]);
      shown.push([lerp(pts[i][0], pts[i + 1][0], t), lerp(pts[i][1], pts[i + 1][1], t)]);
      left -= lens[i];
    }
    const end = shown[shown.length - 1];
    return `<path class="ia-accl" style="stroke-dasharray:7 6" d="${fmt(shown)}"/><circle class="ia-acc" cx="${f1(end[0])}" cy="${f1(end[1])}" r="5"/>`;
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['title', 'time', 'order', 'stam', 'plan', 'report', 'maps', 'cloudTag', 'packets'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = { tags: 1, packets: 1 };
    let packets = '';
    let running = true; // the machine cycles
    let plcDown = false;
    let erpDown = false;
    let lvl5 = 0;
    let dmz = 0;
    let tagHl = null;
    let hmi = 0; // the machine screen: 0 running count, 1 start order
    let kioskLit = false;
    let dim = 1;
    let erpLit = false;

    if (si === 0) {
      vis.title = b === 0 ? 1 : 1 - span(p, 0, 0.12);
      if (vis.title > 0.01) set(E.title, titleSvg());
      tagHl = b === 1 ? ['0', '1', '2', '3', '4'].slice(0, 1 + Math.floor(span(p, 0.05, 0.8) * 5)) : null;
    } else if (si === 1) {
      tagHl = [['0'], ['1'], ['2'], ['2']][b];
    } else if (si === 2) {
      tagHl = [['3'], ['3'], ['4'], ['3', '4']][b];
      kioskLit = b === 0;
      erpLit = b === 2;
    } else if (si === 3) {
      vis.time = 1;
      set(E.time, timeSvg(b <= 1 ? 0 : b === 2 ? 1 : 2));
      if (b === 2) { plcDown = p < 0.5; erpDown = p >= 0.5; running = !plcDown; }
    } else if (si === 4) {
      vis.order = 1;
      set(E.orderHead, orderHead());
      set(E.orderBom, b >= 1 ? orderBom(b === 1 ? span(p, 0.45, 0.8) : 1) : '');
      set(E.orderRoute, b >= 2 ? orderRoute() : '');
      erpLit = true;
    } else if (si === 5) {
      if (b <= 1) { vis.stam = 1; set(E.stam, stamSvg(b === 1 ? span(p, 0.1, 0.45) : 0)); }
      // the order travels down: ERP → MES during the plan beat, MES → machine during the HMI beat
      if (b === 2) { vis.plan = span(p, 0, 0.08); set(E.plan, planSvg()); packets += packet(along(C.STOP.erp, C.STOP.mes, span(p, 0, 0.45)), 'order'); kioskLit = p > 0.45; }
      if (b === 3) { packets += packet(along(C.STOP.mes, C.STOP.machine, span(p, 0, 0.45)), 'order'); hmi = p > 0.45 ? 1 : 0; kioskLit = true; }
      running = b === 3 && p > 0.6;
      if (b <= 1) erpLit = true;
    } else if (si === 6) {
      // counts flow up the cable; at the end the report goes from MES to ERP
      for (let i = 0; i < 3; i++) {
        const f = ((clockS * 0.18) + i / 3) % 1;
        if (b === 0) packets += packet(along(C.STOP.machine, C.STOP.mes, f), 'data');
      }
      if (b === 1) { vis.report = span(p, 0, 0.08); set(E.report, reportSvg()); packets += packet(along(C.STOP.mes, C.STOP.erp, span(p, 0, 0.45)), 'order'); erpLit = p > 0.45; }
      kioskLit = true;
    } else if (si === 7) {
      // the two maps over a dimmed plant, then the plant with its new top floor
      lvl5 = span(u, 0, 0.08);
      vis.maps = b <= 1 ? 1 : b === 2 ? 1 - span(p, 0, 0.1) : 0;
      dim = b <= 1 ? 0.25 : b === 2 ? lerp(0.25, 1, span(p, 0, 0.1)) : 1;
      set(E.imap, imapSvg(b === 1 ? -2 : -1, 100, 50));
      set(E.pmap, pmapSvg(0, b === 0 ? -2 : -1, 100, 50));
      if (b === 2) for (let i = 0; i < 2; i++) packets += packet(along(C.STOP.erp, C.STOP.mes, ((clockS * 0.25) + i / 2) % 1), 'order');
      tagHl = b === 3 ? ['5'] : null;
      vis.tags = b <= 1 ? 0 : b === 2 ? span(p, 0, 0.1) : 1;
    } else if (si === 8) {
      lvl5 = 1;
      dmz = span(u, 0, 0.06);
      tagHl = b === 0 ? ['3.5'] : b === 1 ? ['3'] : null;
      vis.cloudTag = b >= 2 ? 1 : 0;
      if (b >= 2) {
        const [x, y] = toStage([C.CLOUD.x + C.CLOUD.w / 2, C.CLOUD.y, 196]);
        set(E.cloudTag, rect(x - 64, y - 46, 128, 34, 'ia-row', 17) + txt(x, y - 22, tr('cloud-MES', 'cloud MES'), 21, 'middle', 'ia-txt') + (b === 3 ? linkSvg(span(p, 0.3, 0.8)) : b === 4 ? linkSvg(1) : ''));
      }
    }

    // the moulding machine: a 6 s cycle (close, inject, cool, open), frozen when the PLC is down
    const c = running ? clockS % 6 : 0;
    const open = running ? 1 - span(c, 0.4, 1.2) + span(c, 4.4, 5.2) : 1;
    move(E.moving, [-C.MOULD_OPEN * open, 0, 0]);
    [0, 1, 2].forEach((i) => flag(E['seg' + i], 'data-lit', plcDown ? i === 2 : i === 0));
    flag(LED.run, 'data-on', !plcDown);
    flag(LED.err, 'data-on', plcDown);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) flag(LED[`io${i}${j}`], 'data-on', running && ((i + j + Math.floor(c * 2)) % 3 === 0));
    for (let i = 0; i < 6; i++) flag(LED[`r${i}`], 'data-on', (i + Math.floor(clockS * 1.5)) % 4 !== 0);
    flag(LED.conn, 'data-on', si === 8 && b >= 3);
    flag(LED.relay, 'data-on', si === 8 && b >= 3);
    // screens
    const H0 = 61;
    set(E.hmiTxt, hmi === 1
      ? faceRows(H0 + 0.05, -39, -21, 52.5, 64, [[0.9, true], [0.6, false], [0.7, false]])
      : faceRows(H0 + 0.05, -39, -21, 52.5, 64, [[0.5, false], [running ? 0.3 + 0.6 * ((clockS / 40) % 1) : 0.3, running], [0.7, false]]));
    const tz = C.TIER.t2.z;
    const trend = (ph) => Array.from({ length: 12 }, (_, i) => 0.5 + 0.3 * Math.sin(i * 0.9 + ph));
    set(E.scadaTxt, [0, 1, 2].map((i) => {
      const x = C.DESK.x + 6 + i * 23.4;
      return faceTrend(C.DESK.y + 6.45, x + 2, x + 16, tz + 30.5, tz + 37.5, trend(i + (running ? clockS * 0.6 : 0)), si === 6 && b === 0 && i === 1);
    }).join(''));
    set(E.wallTxt, faceRows(-54.95, C.DESK.x + 8, C.DESK.x + C.DESK.w - 8, tz + 42, tz + 60, [[0.8, false], [0.5, plcDown], [0.65, false]]));
    const kz = C.TIER.t3.z;
    set(E.kioskTxt, faceRows(C.KIOSK[1] + 4.05, C.KIOSK[0] - 10, C.KIOSK[0] + 10, kz + 24, kz + 38, [[0.85, kioskLit], [0.6, false], [0.7, false], [0.4, false]]));
    const lz = C.TIER.t4.z;
    set(E.erpTxt, erpDown ? '' : faceRows(C.ODESK.y + 10.45, C.ODESK.x + 22, C.ODESK.x + 40, lz + 26, lz + 36.5, [[0.8, erpLit], [0.55, false], [0.7, false]]));
    // levels 5 and 3.5 appear in the Purdue scenes
    show(E.lvl5, lvl5 > 0.01);
    fade(E.lvl5, lvl5);
    show(E.dmzKit, dmz > 0.01);
    fade(E.dmzKit, dmz);
    for (let i = 0; i < 4; i++) flag(LED[`fw-70${i}`], 'data-on', dmz > 0.5 && (i + Math.floor(clockS)) % 2 === 0);
    for (let i = 0; i < 4; i++) flag(LED[`fw36${i}`], 'data-on', dmz > 0.5 && (i + Math.floor(clockS)) % 2 === 1);
    fade(E.world, dim);
    show(E.b34, si === 2 && b === 3);
    show(E.tags, vis.tags > 0.01);
    fade(E.tags, vis.tags);
    set(E.tags, tagsSvg(lvl5 > 0.5, dmz > 0.5, tagHl));
    set(E.packets, packets);
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();

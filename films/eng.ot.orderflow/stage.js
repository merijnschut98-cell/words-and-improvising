// The stage of the film "Orders omlaag, terugmeldingen omhoog / Orders down,
// confirmations up": a pure function of (scene, u). Inlined into the page after
// the anatomy kit (iso-kit functions in scope) and a preamble from build.mjs
// that defines P (projection), C (world constants), CAM (one camera move per
// scene), W and H. The world is the stepped building of eng.ot.isa95. Moves are
// placed per caption beat (beatStarts), so the video's narration timing
// (films/_kit/beatwarp.js) keeps them in step.
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
  const dec = (v) => (NL ? String(v).replace('.', ',') : String(v));
  const txt = (x, y, t, size = 21, anchor = 'start', cls = 'ia-txt') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}">${t}</text>`;
  const rect = (x, y, w, h, cls = 'ia-panel', r = 8) => `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(0, w))}" height="${f1(Math.max(0, h))}" rx="${r}"/>`;
  const line = (x0, y0, x1, y1, cls = 'ia-dim') => `<path class="${cls}" d="M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}"/>`;
  // a small arrow, up or down, its tip at (x, y)
  const arrow = (x, y, up, cls = 'ia-accl') => {
    const d = up ? 1 : -1;
    return `<path class="${cls}" d="M${f1(x)} ${f1(y + d * 18)}L${f1(x)} ${f1(y)}M${f1(x - 6)} ${f1(y + d * 7)}L${f1(x)} ${f1(y)}L${f1(x + 6)} ${f1(y + d * 7)}"/>`;
  };
  const EXAMPLE = tr('voorbeeld', 'example');
  const X = C.EX;
  const S = C.STOCK;

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
  function faceRows(y, x0, x1, z0, z1, rows) {
    let out = '';
    const n = rows.length;
    rows.forEach(([w, lit], i) => {
      const z = z1 - ((i + 1) * (z1 - z0)) / (n + 1);
      out += `<path class="${lit ? 'ia-scra' : 'ia-scr'}" d="${fmt([at([x0, y, z]), at([x0 + (x1 - x0) * w, y, z])])}"/>`;
    });
    return out;
  }
  function faceTrend(y, x0, x1, z0, z1, vals) {
    return `<path class="ia-scr" d="${fmt(vals.map((v, i) => at([x0 + ((x1 - x0) * i) / (vals.length - 1), y, z0 + (z1 - z0) * v])))}"/>`;
  }

  // ------------------------------------------------------------ the level tags 3 and 4 by the ledge (stage space)
  function tagsSvg() {
    const T = C.TIER;
    const xr = C.X0 + C.XW - 18;
    let out = '';
    for (const [t, p] of [['3', [xr, (T.t3.y0 + T.t3.y1) / 2, T.t3.z + 14]], ['4', [xr, (T.t4.y0 + T.t4.y1) / 2, T.t4.z + 14]]]) {
      const [x, y] = toStage(p);
      if (x < -20 || x > W + 20 || y < -20 || y > H + 20) continue;
      out += rect(x - 16, y - 16, 32, 32, 'ia-row', 16) + txt(x, y + 7.5, t, 21, 'middle', 'ia-big');
    }
    return out;
  }

  // ------------------------------------------------------------ panels
  // s1: the flows between levels 4 and 3; rows appear per beat
  function flowsSvg(b) {
    const rows = [
      [false, tr('productieplanning', 'production schedule'), 1],
      [true, tr('productieprestaties', 'production performance'), 1],
      [false, tr('stamdata', 'master data'), 2],
      [true, tr('capaciteit (soms)', 'capacity (sometimes)'), 2],
    ];
    let out = rect(12, 12, 336, b >= 2 ? 236 : b >= 1 ? 168 : 92);
    out += txt(28, 46, 'ERP ⇄ MES', 22, 'start', 'ia-big') + txt(28, 76, tr('niveau 4 ⇄ niveau 3', 'level 4 ⇄ level 3'), 20, 'start', 'ia-mute');
    rows.forEach(([up, t, from], i) => {
      if (b < from) return;
      const y = 118 + i * 34;
      out += arrow(36, up ? y - 16 : y + 2, up, b === from ? 'ia-accl' : 'ia-dim') + txt(56, y, t, 21, 'start', 'ia-txt');
    });
    return out;
  }
  // s2: the production order from the ERP
  function poSvg() {
    return rect(12, 12, 336, 116) + txt(28, 46, tr('productieorder', 'production order'), 22, 'start', 'ia-big') + txt(332, 46, 'ERP', 20, 'end', 'ia-mute')
      + txt(28, 80, tr(`${num(X.qty)} doppen · type A wit`, `${num(X.qty)} caps · type A white`), 21, 'start', 'ia-txt')
      + txt(28, 110, tr(`stuklijst: ${X.gram} g per dop`, `BOM: ${X.gram} g per cap`), 21, 'start', 'ia-txt');
  }
  // s2: the work orders of machine 4 in the early shift, in sequence (hl: lit rows)
  function woSvg(hl) {
    const rows = NL ? [['type A wit', X.qty], ['type A grijs', 800], ['type A zwart', 1200]] : [['type A white', X.qty], ['type A grey', 800], ['type A black', 1200]];
    let out = rect(12, 12, 336, 240) + txt(28, 46, tr('werkorders', 'work orders'), 22, 'start', 'ia-big') + txt(332, 46, 'MES', 20, 'end', 'ia-mute')
      + txt(28, 78, tr('machine 4 · vroege dienst', 'machine 4 · early shift'), 21, 'start', 'ia-txt');
    rows.forEach(([t, n], i) => {
      const y = 124 + i * 40;
      if (hl[i]) out += rect(20, y - 27, 320, 38, 'ia-row', 6);
      out += txt(30, y, String(i + 1), 21, 'start', 'ia-big') + txt(58, y, t, 21, 'start', 'ia-txt') + txt(330, y, num(n), 21, 'end', 'ia-txt');
    });
    return out + txt(332, 240, EXAMPLE, 20, 'end', 'ia-mute');
  }
  // s3: the recipe for type A white
  function recipeSvg() {
    const rows = NL ? [['matrijs', '40 °C'], ['cilinder', '230 °C'], ['inspuiten', '80 mm/s'], ['koeltijd', '6 s']] : [['mould', '40 °C'], ['barrel', '230 °C'], ['injection', '80 mm/s'], ['cooling', '6 s']];
    let out = rect(12, 12, 316, 232) + txt(28, 46, tr('recept', 'recipe'), 22, 'start', 'ia-big') + txt(312, 46, tr('type A wit', 'type A white'), 20, 'end', 'ia-mute');
    rows.forEach(([a, v], i) => { const y = 88 + i * 34; out += txt(28, y, a, 21, 'start', 'ia-txt') + txt(312, y, v, 21, 'end', 'ia-big'); });
    return out + txt(312, 230, EXAMPLE, 20, 'end', 'ia-mute');
  }
  // s4: what the MES collects while the order runs (prog 0..1)
  function countSvg(prog) {
    const good = Math.round(X.good * prog);
    const scrap = Math.round(X.scrap * prog);
    let out = rect(12, 12, 316, 180) + txt(28, 46, tr('MES verzamelt', 'MES collects'), 22, 'start', 'ia-big');
    const rows = [[tr('goed', 'good'), num(good)], [tr('afkeur', 'scrap'), num(scrap)], [tr('stilstand', 'downtime'), `${Math.round(20 * prog)} min`]];
    rows.forEach(([a, v], i) => { const y = 86 + i * 32; out += txt(28, y, a, 21, 'start', 'ia-txt') + txt(312, y, v, 21, 'end', 'ia-big'); });
    return out + txt(312, 180, EXAMPLE, 20, 'end', 'ia-mute');
  }
  // s4: the confirmation, MES → ERP
  function confSvg() {
    return rect(12, 12, 336, 150) + txt(28, 46, tr('terugmelding', 'confirmation'), 22, 'start', 'ia-big') + txt(332, 46, 'MES → ERP', 20, 'end', 'ia-mute')
      + txt(28, 82, tr(`${num(X.good)} goed · ${X.scrap} afkeur`, `${num(X.good)} good · ${X.scrap} scrap`), 21, 'start', 'ia-txt')
      + txt(28, 114, tr(`tijd: ${dec(3.3)} uur`, `time: ${dec(3.3)} hours`), 21, 'start', 'ia-txt') + txt(332, 148, EXAMPLE, 20, 'end', 'ia-mute');
  }
  // s5: the ERP stock: caps in (101), granulate out (261)
  function stockSvg(capsN, kg, codes) {
    let out = rect(12, 12, 356, 186) + txt(28, 46, tr('ERP-voorraad', 'ERP stock'), 22, 'start', 'ia-big');
    const row = (y, a, v, code, up) => {
      let s = txt(28, y, a, 21, 'start', 'ia-txt') + txt(256, y, v, 21, 'end', 'ia-big');
      if (codes) s += rect(270, y - 24, 86, 32, 'ia-row', 16) + arrow(290, up ? y - 19 : y + 1, up, 'ia-accl') + txt(304, y, String(code), 20, 'start', 'ia-big');
      return s;
    };
    out += row(92, tr('doppen A', 'caps A'), num(capsN), X.gr, true);
    out += row(140, tr('granulaat', 'granulate'), `${kg} kg`, X.gi, false);
    return out + txt(352, 186, EXAMPLE, 20, 'end', 'ia-mute');
  }
  // s6: how backflush computes (stage 0 the sum, 1 no scanning, 2 the standard)
  function bfSvg(stage) {
    let out = rect(12, 12, 356, 196) + txt(28, 46, 'backflush', 22, 'start', 'ia-big') + txt(352, 46, 'ERP', 20, 'end', 'ia-mute');
    out += txt(28, 84, tr('stuklijst × teruggemeld', 'BOM × confirmed'), 21, 'start', 'ia-txt');
    out += txt(28, 116, `${X.gram} g × ${num(X.good)} = ${(X.gram * X.good) / 1000} kg`, 21, 'start', 'ia-big');
    if (stage >= 1) {
      // a scanner, crossed out
      out += rect(30, 140, 26, 18, 'ia-pill', 3) + line(36, 149, 50, 149, 'ia-dim') + line(26, 162, 60, 136, 'ia-accl');
      out += txt(72, 157, tr('geen scan per zak', 'no scan per bag'), 21, 'start', 'ia-txt');
    }
    if (stage >= 2) out += rect(20, 166, 340, 36, 'ia-row', 6) + txt(30, 192, tr('rekent met de norm', 'calculates with the standard'), 21, 'start', 'ia-txt');
    return out;
  }
  // s7: booked out versus really used, then the gap, then the fix
  function meterSvg(stage, grow, fix) {
    const full = 200;
    const wErp = (full * (fix > 0 ? lerp(24, 25, fix) : 24)) / 25;
    let out = rect(12, 12, 380, stage >= 2 ? 236 : 176) + txt(28, 46, tr('granulaat · deze order', 'granulate · this order'), 22, 'start', 'ia-big');
    out += txt(28, 88, tr('ERP boekt af', 'ERP books out'), 20, 'start', 'ia-mute');
    out += `<rect class="fp-meter" x="28" y="96" width="${f1(wErp)}" height="20" rx="2"/>` + txt(240, 113, `${fix > 0.98 ? 25 : 24} kg`, 21, 'start', 'ia-big');
    if (stage >= 1) {
      out += txt(28, 148, tr('echt verbruikt', 'really used'), 20, 'start', 'ia-mute');
      out += `<rect class="fp-meter" data-top="" x="28" y="156" width="${f1(full * grow)}" height="20" rx="2"/>` + (grow > 0.98 ? txt(240, 173, '25 kg', 21, 'start', 'ia-big') : '');
    }
    if (stage >= 2) {
      out += fix > 0.98
        ? txt(28, 222, tr('klopt: goed + afkeur', 'right: good + scrap'), 21, 'start', 'ia-on')
        : txt(28, 222, tr('ERP: 1 kg te veel', 'ERP: 1 kg too much'), 21, 'start', 'ia-on');
    }
    return out;
  }
  // s7: months later, the ERP still sees three bags on an empty pallet
  function laterSvg() {
    return rect(12, 260, 380, 92) + txt(28, 292, tr('maanden later', 'months later'), 20, 'start', 'ia-mute')
      + txt(28, 326, tr(`SAP: nog 3 zakken (${3 * S.bag} kg)`, `SAP: 3 bags left (${3 * S.bag} kg)`), 21, 'start', 'ia-big') + txt(376, 292, EXAMPLE, 20, 'end', 'ia-mute');
  }
  // s8: the complaint, the causes, the frequency
  function quoteSvg() {
    return rect(12, 12, 380, 92) + txt(28, 50, tr('‘De voorraad in SAP', '‘Stock in SAP'), 22, 'start', 'ia-big') + txt(28, 84, tr('klopt nooit.’', 'is never right.’'), 22, 'start', 'ia-big');
  }
  function causesSvg(n) {
    const rows = NL ? ['te laat', 'verkeerde eenheid', 'afkeur gaat niet mee'] : ['too late', 'wrong unit', 'scrap left out'];
    let out = rect(12, 116, 380, 150) + txt(28, 148, tr('de terugmelding …', 'the confirmation …'), 20, 'start', 'ia-mute');
    rows.forEach((t, i) => {
      if (i >= n) return;
      const y = 184 + i * 32;
      out += `<circle class="ia-acc" cx="36" cy="${y - 7}" r="5"/>` + txt(52, y, t, 21, 'start', 'ia-txt');
    });
    return out;
  }
  function freqSvg(stage) {
    const ticks = NL ? ['stuk', 'dienst', 'order', 'week'] : ['part', 'shift', 'order', 'week'];
    const x = (i) => 64 + i * 100;
    let out = rect(12, 12, 400, stage >= 1 ? 240 : 150) + txt(28, 46, tr('terugmelden per …', 'confirm per …'), 22, 'start', 'ia-big');
    if (stage >= 1) out += rect(x(1) - 44, 66, 188, 82, 'ia-row', 8);
    out += line(x(0), 96, x(3), 96, 'ia-dim');
    ticks.forEach((t, i) => { out += `<circle class="${stage >= 1 && (i === 1 || i === 2) ? 'ia-acc' : 'ia-pill'}" cx="${x(i)}" cy="96" r="7"/>` + txt(x(i), 136, t, 21, 'middle', 'ia-txt'); });
    if (stage >= 1) {
      out += txt(28, 192, tr('stuk: te veel voor het ERP', 'part: too much for the ERP'), 21, 'start', 'ia-txt');
      out += txt(28, 226, tr('week: te weinig voor de planner', 'week: too little for the planner'), 21, 'start', 'ia-txt');
    }
    return out;
  }

  // ------------------------------------------------------------ packets on the cable (stage space)
  const R = C.ROUTE;
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
    // the recipe: a card with three setting dots
    if (kind === 'recipe') return `<rect class="ia-acc" x="${f1(x - 13)}" y="${f1(y - 11)}" width="26" height="22" rx="4"/>${[-6, 0, 6].map((d) => `<circle style="fill:var(--fp-on-accent)" cx="${f1(x + d)}" cy="${f1(y)}" r="2.2"/>`).join('')}`;
    return `<circle class="ia-acc" cx="${f1(x)}" cy="${f1(y)}" r="7"/>`;
  }

  // ------------------------------------------------------------ the scenes
  const HUDS = ['flows', 'po', 'wo', 'recipe', 'count', 'conf', 'stock', 'bfp', 'meter', 'quote', 'causes', 'freq'];
  function render(si, u) {
    camera(si, u);
    const { b, p } = beatOf(si, u);
    const clockS = u * C.dur[si];
    const vis = {};
    let packets = '';
    let running = si >= 3; // the machine cycles once the recipe is loaded
    let hmi = 0; // the machine screen: 0 running count, 1 recipe loaded
    let kioskLit = false;
    let erpLit = false;
    let tags = 0;
    let boxes = si >= 5 ? 3 : 0; // boxes of good caps on the shelf
    let topBag = si < 3 ? 1 : 0; // the bag that feeds this order
    let bagsLeft = 1; // the rest of the pallet
    let scrapIn = si >= 3 ? 1 : 0;
    let meterHtml = '';

    if (si === 0) {
      // the two flows across the 4/3 boundary
      tags = 1;
      erpLit = b === 0;
      kioskLit = b === 0;
      vis.flows = b === 0 ? 0 : 1;
      set(E.flows, flowsSvg(b));
      if (b >= 1) {
        for (let i = 0; i < 2; i++) {
          packets += packet(along(C.STOP.erp, C.STOP.mes, ((clockS * 0.16) + i / 2) % 1), 'order');
          packets += packet(along(C.STOP.mes, C.STOP.erp, ((clockS * 0.16) + i / 2 + 0.25) % 1), 'data');
        }
      }
      running = false;
    } else if (si === 1) {
      // the production order goes down; the MES makes work orders
      if (b === 0) {
        vis.po = span(p, 0, 0.1);
        set(E.po, poSvg());
        packets += packet(along(C.STOP.erp, C.STOP.mes, span(p, 0.2, 0.75)), 'order');
        erpLit = p < 0.75;
        kioskLit = p >= 0.75;
      } else {
        vis.wo = 1;
        set(E.wo, woSvg(b === 1 ? [true, false, false] : [0, 1, 2].map((i) => span(p, 0.15, 0.75) * 3 > i)));
        kioskLit = true;
      }
      running = false;
    } else if (si === 2) {
      // the recipe goes from the MES to the PLC, the HMI shows it loaded
      vis.recipe = b === 0 ? span(p, 0, 0.12) : 1;
      set(E.recipe, recipeSvg());
      if (b === 0) packets += packet(along(C.STOP.mes, C.STOP.plc, span(p, 0.2, 0.8)), 'recipe');
      kioskLit = b === 0 && p < 0.5;
      hmi = b === 0 ? (p > 0.8 ? 1 : 0) : 1;
      running = b === 2 && p > 0.5;
    } else if (si === 3) {
      // counts go up, the bag feeds the hopper, scrap lands in its bin
      topBag = b === 0 ? 1 - span(p, 0.1, 0.4) : 0;
      scrapIn = b === 0 ? span(p, 0.5, 0.6) : 1;
      if (b === 0) {
        vis.count = 1;
        set(E.count, countSvg(span(p, 0.05, 0.95)));
        for (let i = 0; i < 3; i++) packets += packet(along(C.STOP.machine, C.STOP.mes, ((clockS * 0.2) + i / 3) % 1), 'data');
      } else {
        vis.conf = span(p, 0, 0.1);
        set(E.conf, confSvg());
        packets += packet(along(C.STOP.mes, C.STOP.erp, span(p, 0.15, 0.6)), 'order');
        erpLit = p > 0.6;
        running = p < 0.15;
      }
      kioskLit = true;
    } else if (si === 4) {
      // goods receipt: the boxes arrive, the stock panel counts
      vis.stock = 1;
      const g = b === 0 ? span(p, 0.2, 0.7) : 1;
      boxes = Math.floor(g * 3 + 1e-6);
      set(E.stock, stockSvg(Math.round(X.good * g), b === 0 ? S.kg : S.kg - (X.good * X.gram) / 1000, b >= 1));
      erpLit = true;
      running = false;
    } else if (si === 5) {
      vis.bfp = 1;
      set(E.bfp, bfSvg(b));
      running = false;
    } else if (si === 6) {
      vis.meter = 1;
      const grow = b === 0 ? 0 : b === 1 ? span(p, 0.25, 0.7) : 1;
      const fix = b === 3 ? span(p, 0.2, 0.7) : 0;
      meterHtml = meterSvg(b === 0 ? 0 : b === 1 ? 1 : 2, grow, fix);
      set(E.meter, meterHtml);
      // months later: the pallet is empty, SAP still sees three bags
      const later = b === 2 ? span(p, 0.4, 0.5) : 0;
      vis.quote = later;
      if (later > 0.01) set(E.quote, laterSvg());
      bagsLeft = 1 - later;
      running = false;
    } else if (si === 7) {
      vis.quote = b <= 1 ? 1 : 0;
      set(E.quote, quoteSvg());
      vis.causes = b === 1 ? 1 : 0;
      set(E.causes, causesSvg(b === 1 ? 1 + Math.floor(span(p, 0.05, 0.75) * 2.999) : 0));
      vis.freq = b >= 2 ? 1 : 0;
      set(E.freq, freqSvg(b === 3 ? 1 : 0));
      erpLit = b === 0;
      running = false;
    }

    // the moulding machine: a 6 s cycle (close, inject, cool, open)
    const c = running ? clockS % 6 : 0;
    const open = running ? 1 - span(c, 0.4, 1.2) + span(c, 4.4, 5.2) : 1;
    move(E.moving, [-C.MOULD_OPEN * open, 0, 0]);
    [0, 1, 2].forEach((i) => flag(E['seg' + i], 'data-lit', running ? i === 0 : i === 1));
    flag(LED.run, 'data-on', true);
    flag(LED.err, 'data-on', false);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) flag(LED[`io${i}${j}`], 'data-on', running && ((i + j + Math.floor(c * 2)) % 3 === 0));
    for (let i = 0; i < 6; i++) flag(LED[`r${i}`], 'data-on', (i + Math.floor(clockS * 1.5)) % 4 !== 0);
    // screens
    const H0 = 61;
    set(E.hmiTxt, hmi === 1 && !running
      ? faceRows(H0 + 0.05, -39, -21, 52.5, 64, [[0.9, true], [0.6, true], [0.7, true]])
      : faceRows(H0 + 0.05, -39, -21, 52.5, 64, [[0.5, false], [running ? 0.3 + 0.6 * ((clockS / 40) % 1) : 0.3, running], [0.7, false]]));
    const tz = C.TIER.t2.z;
    const trend = (ph) => Array.from({ length: 12 }, (_, i) => 0.5 + 0.3 * Math.sin(i * 0.9 + ph));
    set(E.scadaTxt, [0, 1, 2].map((i) => {
      const x = C.DESK.x + 6 + i * 23.4;
      return faceTrend(C.DESK.y + 6.45, x + 2, x + 16, tz + 30.5, tz + 37.5, trend(i + (running ? clockS * 0.6 : 0)));
    }).join(''));
    set(E.wallTxt, faceRows(-54.95, C.DESK.x + 8, C.DESK.x + C.DESK.w - 8, tz + 42, tz + 60, [[0.8, false], [0.5, false], [0.65, false]]));
    const kz = C.TIER.t3.z;
    set(E.kioskTxt, faceRows(C.KIOSK[1] + 4.05, C.KIOSK[0] - 10, C.KIOSK[0] + 10, kz + 24, kz + 38, [[0.85, kioskLit], [0.6, false], [0.7, false], [0.4, false]]));
    const lz = C.TIER.t4.z;
    set(E.erpTxt, faceRows(C.ODESK.y + 10.45, C.ODESK.x + 22, C.ODESK.x + 40, lz + 26, lz + 36.5, [[0.8, erpLit], [0.55, false], [0.7, false]]));
    // stock on the ground
    for (let i = 0; i < 3; i++) show(E['fg' + i], boxes > i);
    show(E.bagTop, topBag * bagsLeft > 0.01);
    fade(E.bagTop, topBag * bagsLeft);
    for (let i = 0; i < 4; i++) { show(E['bag' + i], bagsLeft > 0.01); fade(E['bag' + i], bagsLeft); }
    show(E.scrapIn, scrapIn > 0.01);
    fade(E.scrapIn, scrapIn);
    show(E.b34, si === 0 && b === 0);
    show(E.tags, tags > 0);
    set(E.tags, tags ? tagsSvg() : '');
    set(E.packets, packets);
    for (const h of HUDS) { const a = Math.min(1, vis[h] || 0); show(E[h], a > 0.01); fade(E[h], a); }
  }

  return { render };
})();

// The figures' phone layout, run in every figure page after the figure's own
// script (both are modules, so they run in order). Inlined by phone.mjs after
// phone-core.mjs, whose helpers it uses.
//
// Below PHONE_MAX px the plate is rearranged, never redrawn:
//   head     Fig n · title, one line
//   stage    the drawing at full width, its camera cropped to what is drawn
//            (or to the build's crop for this level)
//   readout  1–2 key lines; "meer / more" opens the rest as a sheet
//   controls one compact row (scrolls sideways when it must), 44 px targets
// Text under MIN_TEXT px grows to it, or (SVG text that would have to grow too
// much) hides until full screen. A corner button asks the app for full screen;
// there, two fingers zoom the drawing.
//
// The app sizes the frame from the 'size' message; full screen is 'full'.
/* global PHONE_MAX, isPhone, searchOf, levelOf, unionBox, cropBox, levelCrop, textFix, phoneHeight, zoomBox */
(function () {
  const plate = document.querySelector('.iso-plate');
  if (!plate) return;
  const doc = document.documentElement;
  const SEARCH = searchOf(location.search, window.name);
  const EN = new URLSearchParams(SEARCH).get('lang') === 'en';
  const LEVEL = levelOf(SEARCH);
  const cfgEl = document.getElementById('vp-phone-config');
  const CFG = cfgEl ? JSON.parse(cfgEl.textContent) : {};
  const T = EN ? { more: 'more', less: 'less', full: 'Full screen', exit: 'Leave full screen' }
    : { more: 'meer', less: 'minder', full: 'Volledig scherm', exit: 'Volledig scherm sluiten' };
  const inFrame = window.parent !== window;
  const post = (msg) => { try { window.parent.postMessage({ type: 'vp-figure', ...msg }, '*'); } catch { /* no host */ } };

  // ------------------------------------------------ the parts of the plate
  const svgs = [...plate.querySelectorAll('svg.iso-svg')];
  const svg = svgs.sort((a, b) => area(b) - area(a))[0] || null;
  function area(el) { const r = el.getBoundingClientRect(); return r.width * r.height; }
  const corners = plate.querySelector('.iso-plate-corners');
  const corner = (n) => plate.querySelector('.iso-plate-corner[data-corner="' + n + '"]');
  const fig = corner('fig'), title = corner('title'), hint = corner('hint'), readout = corner('readout');
  // the element of the plate that holds the drawing, and the one that holds the buttons
  const topOf = (el) => { while (el && el.parentElement !== plate) el = el.parentElement; return el; };
  const stage = svg ? topOf(svg) : null;
  let controls = plate.querySelector('[class$="-controls"]');
  if (controls && (controls === stage || !controls.querySelector('button,input,select'))) controls = null;

  // ------------------------------------------------ the phone rows
  const head = el('div', 'vp-head');
  const read = el('div', 'vp-read');
  const sheet = el('div', 'vp-sheet');
  read.append(sheet);
  const moreBtn = el('button', 'vp-more');
  moreBtn.type = 'button';
  moreBtn.setAttribute('aria-expanded', 'false');
  moreBtn.textContent = T.more;
  const fullBtn = el('button', 'vp-full');
  fullBtn.type = 'button';
  fullBtn.setAttribute('aria-label', T.full);
  // Lucide maximize / minimize (ISC licence, as in src/ui/icons.js)
  fullBtn.innerHTML = '<svg class="vp-ico-max" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg><svg class="vp-ico-min" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>';
  function el(tag, cls) { const e = document.createElement(tag); e.className = cls; return e; }
  // where each moved node came from, to put it back above PHONE_MAX
  const home = [];
  const move = (node, parent) => { if (!node) return; home.push([node, node.parentNode, node.nextSibling]); parent.append(node); };

  let phone = false, full = false;
  function enter() {
    if (phone) return;
    phone = true;
    doc.classList.add('vp-phone');
    // the title and the hint wait in the sheet: the lesson around the frame
    // already says what the figure is, and the drawing needs the height
    move(fig, head); move(title, head);
    sheet.append(head);
    move(hint, sheet); move(readout, sheet);
    // other notes pinned on the plate (a model line, a legend) would land on
    // the rows: they wait in the sheet too
    for (const n of [...plate.children]) {
      if (n === stage || n === corners || n === controls || n === read || n.hidden) continue;
      const cs = getComputedStyle(n);
      if ((cs.position !== 'absolute' && cs.position !== 'fixed') || n.matches('[aria-live]') || n.getBoundingClientRect().width <= 2 || !n.textContent.trim()) continue;
      n.classList.add('vp-extra');
      move(n, sheet);
    }
    read.append(moreBtn);
    if (stage) stage.classList.add('vp-stage');
    stage && stage.after(read);
    if (!stage) plate.append(read);
    if (controls) { controls.classList.add('vp-controls'); move(controls, plate); groups(); }
    plate.append(fullBtn);
    camera(true);
  }
  function leave() {
    if (!phone) return;
    phone = false;
    doc.classList.remove('vp-phone');
    setMore(false);
    for (let i = home.length - 1; i >= 0; i--) { const [n, p, s] = home[i]; p.insertBefore(n, s && s.parentNode === p ? s : null); }
    home.length = 0;
    head.remove(); read.remove(); moreBtn.remove(); fullBtn.remove();
    if (stage) stage.classList.remove('vp-stage');
    if (controls) controls.classList.remove('vp-controls');
    camera(false);
    unfixText();
  }

  // a small gap between button groups once the rows run together
  function groups() {
    controls.querySelectorAll('.vp-gap').forEach((n) => n.classList.remove('vp-gap'));
    const rows = [...controls.children].filter((r) => !r.hidden && r.children.length && !r.matches('button,input,select,label'));
    rows.slice(1).forEach((r) => { const b = r.querySelector('button,input,select'); if (b) b.classList.add('vp-gap'); });
    controls.classList.toggle('vp-scroll', controls.scrollWidth > controls.clientWidth + 1);
  }

  // ------------------------------------------------ "meer": the rest of the readout
  function setMore(on) {
    // the row keeps its place; the sheet opens upwards over the drawing
    read.style.minHeight = on ? read.offsetHeight + 'px' : '';
    sheet.style.maxHeight = on ? Math.max(80, read.offsetTop - 4) + 'px' : '';
    doc.toggleAttribute('data-vp-more', on);
    moreBtn.setAttribute('aria-expanded', String(on));
    moreBtn.textContent = on ? T.less : T.more;
  }
  moreBtn.addEventListener('click', () => setMore(!doc.hasAttribute('data-vp-more')));
  // only offered when there is more than the key lines
  function needMore() {
    if (!phone || !readout) return;
    if (doc.hasAttribute('data-vp-more')) { read.classList.add('vp-has-more'); return; }
    const over = readout.scrollHeight > readout.clientHeight + 2 || [...readout.children].some((c) => c.scrollWidth > c.clientWidth + 1) || (hint && hint.textContent.trim()) || sheet.querySelector('.vp-extra');
    read.classList.toggle('vp-has-more', !!over);
  }

  // ------------------------------------------------ the camera
  let homeView = null, cropView = null;
  function contentBox() {
    const inv = svg.getScreenCTM();
    if (!inv) return null;
    const toUser = inv.inverse();
    const boxes = [];
    for (const n of svg.querySelectorAll('path,polygon,polyline,rect,circle,ellipse,line,text,use,image')) {
      if (n.closest('defs,clipPath,mask,symbol,marker,pattern')) continue;
      if (n.checkVisibility && !n.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
      const cs = getComputedStyle(n);
      const paints = (cs.fill !== 'none' && cs.fill !== 'transparent' && parseFloat(cs.fillOpacity) > 0) || (cs.stroke !== 'none' && cs.stroke !== 'transparent' && parseFloat(cs.strokeOpacity) > 0);
      if (!paints || parseFloat(cs.opacity) === 0) continue;
      let b; try { b = n.getBBox(); } catch { continue; }
      if (!(b.width > 0 || b.height > 0)) continue;
      const m = toUser.multiply(n.getScreenCTM());
      const pts = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]]
        .map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
      boxes.push([Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs) || 0.01, Math.max(...ys) - Math.min(...ys) || 0.01]);
    }
    return unionBox(boxes);
  }
  const vbOf = (s) => s.getAttribute('viewBox').trim().split(/[\s,]+/).map(Number);
  const setView = (box) => { svg.setAttribute('viewBox', box.map((v) => Math.round(v * 100) / 100).join(' ')); dispatchEvent(new Event('resize')); };
  let seen = null;
  function camera(on) {
    if (!svg || !svg.getAttribute('viewBox')) return;
    if (!on) { if (homeView) { setView(homeView); homeView = null; cropView = null; seen = null; } return; }
    if (!homeView) homeView = vbOf(svg);
    const fixed = levelCrop(CFG.crop, LEVEL);
    if (fixed) cropView = cropBox(fixed, homeView, { pad: 0 });
    else {
      // what is drawn now, widened by what was drawn before (moving parts)
      const cur = withView(homeView, contentBox);
      seen = unionBox([seen, cur]);
      cropView = cropBox(seen, homeView, CFG.pad != null ? { pad: CFG.pad } : undefined);
    }
    if (!zoomed) setView(cropView);
  }
  // measure in the page's own camera, so a crop never feeds on itself
  function withView(box, fn) {
    const was = svg.getAttribute('viewBox');
    svg.setAttribute('viewBox', box.join(' '));
    try { return fn(); } finally { svg.setAttribute('viewBox', was); }
  }

  // ------------------------------------------------ text at least MIN_TEXT
  // Figures rebuild their labels as they run, so a fix is kept as a CSS rule
  // per tag and class where it can be (a rebuilt label gets it at once), and
  // on the element otherwise.
  const fixSheet = document.createElement('style');
  fixSheet.id = 'vp-text-fix';
  document.head.append(fixSheet);
  const grown = new Set();
  const esc = (c) => CSS.escape(c);
  const keyOf = (n) => {
    const c = (n.getAttribute('class') || '').split(/\s+/).filter((x) => x && !x.startsWith('vp-'));
    return c.length ? n.localName + c.map((x) => '.' + esc(x)).join('') : '';
  };
  const hasText = (n) => [...n.childNodes].some((c) => c.nodeType === 3 && c.nodeValue.trim());
  function fixText() {
    if (!phone) return;
    unfixText();
    const rules = [];
    // HTML text in the plate: up to MIN_TEXT
    const keys = new Set();
    for (const n of plate.querySelectorAll('*')) {
      if (n instanceof SVGElement || !hasText(n)) continue;
      if (parseFloat(getComputedStyle(n).fontSize) >= MIN_TEXT - 0.05) continue;
      // a label without a class of its own goes by its parent's
      const k = keyOf(n) || (n.parentElement && keyOf(n.parentElement) ? keyOf(n.parentElement) + '>' + n.localName : '');
      if (k) keys.add(k);
      else { n.style.fontSize = MIN_TEXT + 'px'; grown.add(n); }
    }
    for (const k of keys) rules.push('html.vp-phone .iso-plate ' + k + '{font-size:' + MIN_TEXT + 'px!important}');
    // SVG text in the drawing: grow a little, or hide until full screen
    if (svg) {
      const groups = new Map();
      for (const t of svg.querySelectorAll('text')) {
        const m = t.getScreenCTM();
        if (!m || !hasText(t)) continue;
        const fs = parseFloat(getComputedStyle(t).fontSize);
        const k = keyOf(t) || t;
        const g = groups.get(k) || { fs: new Set(), px: Infinity, els: [] };
        g.fs.add(fs);
        g.px = Math.min(g.px, fs * Math.hypot(m.a, m.b));
        g.els.push(t);
        groups.set(k, g);
      }
      for (const [k, g] of groups) {
        const fix = textFix(g.px);
        if (fix.op === 'keep') continue;
        const one = g.fs.size === 1 ? [...g.fs][0] : 0;
        if (typeof k === 'string' && (fix.op === 'hide' || one)) {
          rules.push('html.vp-phone svg ' + k + (fix.op === 'hide' ? '{visibility:hidden!important}' : '{font-size:' + (one * fix.factor).toFixed(2) + 'px!important}'));
          continue;
        }
        for (const t of g.els) {
          if (fix.op === 'hide') t.classList.add('vp-tiny');
          else t.style.fontSize = (parseFloat(getComputedStyle(t).fontSize) * fix.factor).toFixed(2) + 'px';
          grown.add(t);
        }
      }
    }
    fixSheet.textContent = rules.join('\n');
  }
  function unfixText() {
    fixSheet.textContent = '';
    for (const n of grown) { n.style.fontSize = ''; n.classList.remove('vp-tiny'); }
    grown.clear();
  }

  // ------------------------------------------------ the frame height the app should give
  let lastAsk = 0;
  function ask() {
    if (!phone || full || !inFrame || doc.hasAttribute('data-vp-more')) return;
    if (!stage) return;
    // everything that is not the drawing, as laid out now
    const chrome = plate.clientHeight - (svg ? svg.getBoundingClientRect().height : stage.clientHeight);
    const hgt = phoneHeight(plate.clientWidth - 8, cropView, chrome);
    if (Math.abs(hgt - lastAsk) > 2) { lastAsk = hgt; post({ op: 'size', height: hgt }); }
  }

  // ------------------------------------------------ full screen
  function setFull(on) {
    full = on;
    doc.toggleAttribute('data-vp-full', on);
    fullBtn.setAttribute('aria-label', on ? T.exit : T.full);
    fullBtn.classList.toggle('vp-on', on);
    if (!on) unzoom();
  }
  fullBtn.addEventListener('click', () => {
    const want = !full;
    if (inFrame) { post({ op: 'full', on: want }); return; }
    // a page on its own: the browser's full screen
    if (want) { const r = doc.requestFullscreen && doc.requestFullscreen(); if (r && r.catch) r.catch(() => {}); }
    else if (document.exitFullscreen && document.fullscreenElement) document.exitFullscreen().catch(() => {});
  });
  document.addEventListener('fullscreenchange', () => setFull(!!document.fullscreenElement));
  addEventListener('message', (event) => {
    const m = event.data;
    if (event.source !== window.parent || !m || m.type !== 'vp-figure') return;
    if (m.op === 'full') { setFull(!!m.on); lastAsk = 0; }
  });

  // two fingers zoom the drawing in full screen; a pinch back out restores it
  let zoomed = false;
  const touches = new Map();
  let pinch = null;
  function unzoom() { if (zoomed && cropView) { zoomed = false; setView(cropView); fixText(); } zoomed = false; }
  function userPoint(x, y) { const m = svg.getScreenCTM().inverse(); return [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]; }
  if (svg && stage) {
    const opt = { capture: true };
    stage.addEventListener('pointerdown', (e) => {
      if (!full || e.pointerType !== 'touch') return;
      touches.set(e.pointerId, [e.clientX, e.clientY]);
      if (touches.size === 2) {
        const [a, b] = [...touches.values()];
        const base = zoomed ? vbOf(svg) : cropView || vbOf(svg);
        pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]) || 1, k0: cropView ? cropView[2] / base[2] : 1, mid: userPoint((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) };
        e.stopImmediatePropagation();
      }
    }, opt);
    stage.addEventListener('pointermove', (e) => {
      if (!touches.has(e.pointerId)) return;
      touches.set(e.pointerId, [e.clientX, e.clientY]);
      if (!pinch || touches.size < 2) return;
      e.stopImmediatePropagation();
      const [a, b] = [...touches.values()];
      const k = pinch.k0 * Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch.d;
      const home = cropView || homeView || vbOf(svg);
      zoomed = k > 1.02;
      setView(zoomBox(home, Math.min(k, 6), pinch.mid[0], pinch.mid[1]));
    }, opt);
    const end = (e) => {
      if (!touches.delete(e.pointerId)) return;
      if (pinch) { e.stopImmediatePropagation(); if (touches.size < 2) { pinch = null; if (!zoomed) unzoom(); fixText(); } }
    };
    stage.addEventListener('pointerup', end, opt);
    stage.addEventListener('pointercancel', end, opt);
  }

  // ------------------------------------------------ keep it in step
  let queued = 0;
  function refresh() {
    queued = 0;
    const want = isPhone(innerWidth);
    if (want) enter(); else leave();
    if (!phone) return;
    if (controls) groups();
    fixText();
    needMore();
    ask();
  }
  const soon = () => { if (!queued) queued = requestAnimationFrame(refresh); };
  addEventListener('resize', soon);
  new ResizeObserver(soon).observe(document.documentElement);
  // readouts and buttons change as the figure runs: check now and then, not every frame
  let last = 0, trail = 0;
  new MutationObserver(() => {
    if (trail) return;
    trail = setTimeout(() => { trail = 0; last = performance.now(); soon(); }, Math.max(50, 400 - (performance.now() - last)));
  })
    .observe(plate, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  refresh();
  // moving parts: widen the crop with what the first seconds draw
  if (svg && !levelCrop(CFG.crop, LEVEL)) [400, 1200, 2600].forEach((t) => setTimeout(() => { if (phone && !zoomed) { camera(true); refresh(); } }, t));
  doc.setAttribute('data-vp-ready', '');
})();

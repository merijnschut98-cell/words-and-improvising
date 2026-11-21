// v18 G1: lesson pictures. A picture is data (src/content/courses/pictures/
// <moduleId>.js), drawn here as inline SVG, like the subject map. Pure strings,
// no DOM, so the tests and the validator use the same code the app does. Every
// fill, stroke and text colour comes from a CSS class (.pic-* in styles.css),
// so light and dark come for free. The SVG is role="img" with the lesson's alt
// text; the words on it are in the lesson's own text, which carries the lesson.
//
// Kinds (every label L is { nl, en }; a table cell may also be a list of labels):
//   table     { head: [L], rows: [[L | [L]]] }            first column is the row head
//   grid      { cols: [L], rows: [L], cells: [[L]], tone?: [[0-3]], xTitle?: L, yTitle?: L }
//   cycle     { steps: [L], center?: L }                  3 to 8 steps in a loop
//   flow      { steps: [L | { label: L, note?: L }] }     steps with arrows
//   tree      { root: { label: L, children?: [node] } }   an outline tree
//   timeline  { events: [{ at: L, label: L }] }
export const KINDS = ['table', 'grid', 'cycle', 'flow', 'tree', 'timeline'];
export const PIC_W = 340; // view width; the picture scales to the card, so 14 here is about 13 px on a 390 px phone
export const PIC_FONT = 14;
const LH = 19; // line height
const GLYPH = 0.58 * PIC_FONT; // average glyph width, generous so a line never leaves its box

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const f = (n) => Math.round(n * 10) / 10;
const say = (l, lang) => (l && typeof l === 'object' ? l[lang] ?? '' : String(l ?? ''));

// Words wrapped to at most `chars` characters a line (a longer word keeps its own line).
export function wrap(s, chars) {
  const out = [];
  let cur = '';
  for (const w of String(s).split(/\s+/).filter(Boolean)) {
    if (cur && (cur + ' ' + w).length > chars) { out.push(cur); cur = w; } else cur = cur ? `${cur} ${w}` : w;
  }
  if (cur) out.push(cur);
  return out.length ? out : [''];
}
const fit = (width, pad = 8) => Math.max(4, Math.floor((width - 2 * pad) / GLYPH));

// Text lines from (x, y) down; returns SVG.
function lines(ls, x, y, cls, anchor = 'start') {
  return ls.map((l, i) => `<text class="pic-text ${cls}" x="${f(x)}" y="${f(y + i * LH + PIC_FONT)}" text-anchor="${anchor}">${esc(l)}</text>`).join('');
}

// Every label of a picture in one language, in reading order (tests and the validator).
export function pictureLabels(pic, lang) {
  const out = [];
  const add = (l) => { if (Array.isArray(l)) l.forEach(add); else if (l != null) out.push(say(l, lang)); };
  const node = (n) => { add(n.label); (n.children || []).forEach(node); };
  switch (pic && pic.kind) {
    case 'table': add(pic.head || []); (pic.rows || []).forEach((r) => r.forEach(add)); break;
    case 'grid': add(pic.cols || []); add(pic.rows || []); (pic.cells || []).forEach((r) => r.forEach(add)); add(pic.xTitle); add(pic.yTitle); break;
    case 'cycle': add(pic.steps || []); add(pic.center); break;
    case 'flow': (pic.steps || []).forEach((s) => { if (s && s.label) { add(s.label); add(s.note); } else add(s); }); break;
    case 'tree': if (pic.root) node(pic.root); break;
    case 'timeline': (pic.events || []).forEach((e) => { add(e.at); add(e.label); }); break;
    default: break;
  }
  return out.filter((s) => s !== '');
}

function table(pic, lang) {
  const cols = pic.head.length;
  const first = cols === 1 ? PIC_W : Math.round(PIC_W * 0.36);
  const rest = cols > 1 ? (PIC_W - first) / (cols - 1) : 0;
  const xs = Array.from({ length: cols }, (_, i) => (i === 0 ? 0 : first + (i - 1) * rest));
  const ws = Array.from({ length: cols }, (_, i) => (i === 0 ? first : rest));
  let out = '';
  let y = 0;
  const row = (cells, kind) => {
    const cl = cells.map((c, i) => (Array.isArray(c) ? c : [c]).flatMap((it) => wrap(say(it, lang), fit(ws[i]))));
    const h = Math.max(...cl.map((ls) => ls.length)) * LH + 14;
    cells.forEach((_, i) => {
      out += `<rect class="pic-box pic-${kind}${i === 0 && kind === 'cell' ? ' pic-rowhead' : ''}" x="${f(xs[i])}" y="${f(y)}" width="${f(ws[i])}" height="${h}"/>`;
      out += lines(cl[i], xs[i] + 8, y + 7, kind === 'head' ? 'pic-onhead pic-bold' : i === 0 ? 'pic-bold' : '');
    });
    y += h;
  };
  row(pic.head, 'head');
  pic.rows.forEach((r) => row(r, 'cell'));
  return { w: PIC_W, h: y, body: out };
}

function grid(pic, lang) {
  const nc = pic.cols.length;
  const nr = pic.rows.length;
  const lw = nr > 2 ? 84 : 96; // row labels
  const cw = (PIC_W - lw) / nc;
  let out = '';
  let y = 0;
  if (pic.xTitle || pic.yTitle) {
    const yl = pic.yTitle ? wrap(say(pic.yTitle, lang), fit(lw, 2)) : [''];
    if (pic.xTitle) out += lines([say(pic.xTitle, lang)], lw + 4, y + 2, 'pic-muted pic-bold');
    if (pic.yTitle) out += lines(yl, 2, y + 2, 'pic-muted pic-bold');
    y += Math.max(1, yl.length) * LH + 6;
  }
  const hh = Math.max(...pic.cols.map((c) => wrap(say(c, lang), fit(cw, 3)).length)) * LH + 10;
  pic.cols.forEach((c, j) => {
    out += `<rect class="pic-box pic-head" x="${f(lw + j * cw)}" y="${f(y)}" width="${f(cw)}" height="${hh}"/>`;
    out += lines(wrap(say(c, lang), fit(cw, 3)), lw + j * cw + cw / 2, y + 5, 'pic-onhead pic-bold', 'middle');
  });
  y += hh;
  pic.rows.forEach((r, i) => {
    const cl = pic.cells[i].map((c) => wrap(say(c, lang), fit(cw, 3)));
    const rl = wrap(say(r, lang), fit(lw, 4));
    const h = Math.max(nc > 3 ? 40 : 56, Math.max(rl.length, ...cl.map((x) => x.length)) * LH + 12);
    out += `<rect class="pic-box pic-rowhead" x="0" y="${f(y)}" width="${lw}" height="${h}"/>`;
    out += lines(rl, 4, y + (h - rl.length * LH) / 2, 'pic-bold');
    pic.cells[i].forEach((_, j) => {
      const tone = pic.tone ? pic.tone[i][j] : 0;
      out += `<rect class="pic-box pic-cell pic-t${tone}" x="${f(lw + j * cw)}" y="${f(y)}" width="${f(cw)}" height="${h}"/>`;
      out += lines(cl[j], lw + j * cw + cw / 2, y + (h - cl[j].length * LH) / 2, '', 'middle');
    });
    y += h;
  });
  return { w: PIC_W, h: y, body: out };
}

function cycle(pic, lang) {
  const n = pic.steps.length;
  const R = n <= 4 ? 100 : 108;
  const nodeW = n <= 4 ? 112 : 104;
  const cx = PIC_W / 2;
  const nodes = pic.steps.map((s, i) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return { x: cx + R * Math.cos(a), y: 0, a, ls: wrap(say(s, lang), fit(nodeW, 6)) };
  });
  const maxH = Math.max(...nodes.map((nd) => nd.ls.length)) * LH + 14;
  const cy = R + maxH / 2 + 4;
  nodes.forEach((nd) => { nd.y = cy + R * Math.sin(nd.a); });
  let out = `<circle class="pic-ring" cx="${cx}" cy="${f(cy)}" r="${R}"/>`;
  // an arrowhead on the ring between each step and the next, pointing the way round
  nodes.forEach((nd) => {
    const a = nd.a + Math.PI / n;
    const px = cx + R * Math.cos(a);
    const py = cy + R * Math.sin(a);
    const d = a + Math.PI / 2; // clockwise tangent
    const p = (along, out2) => `${f(px + along * Math.cos(d) + out2 * Math.cos(a))},${f(py + along * Math.sin(d) + out2 * Math.sin(a))}`;
    out += `<polygon class="pic-arrow" points="${p(8, 0)} ${p(-6, 6)} ${p(-6, -6)}"/>`;
  });
  nodes.forEach((nd) => {
    const h = nd.ls.length * LH + 14;
    out += `<rect class="pic-box pic-node" rx="8" x="${f(nd.x - nodeW / 2)}" y="${f(nd.y - h / 2)}" width="${nodeW}" height="${h}"/>`;
    out += lines(nd.ls, nd.x, nd.y - (nd.ls.length * LH) / 2, 'pic-bold', 'middle');
  });
  if (pic.center) {
    const ls = wrap(say(pic.center, lang), 12);
    out += lines(ls, cx, cy - (ls.length * LH) / 2, 'pic-muted pic-bold', 'middle');
  }
  return { w: PIC_W, h: cy + R + maxH / 2 + 4, body: out };
}

function flow(pic, lang) {
  const bw = PIC_W - 24;
  const gap = 22;
  let y = 0;
  let out = '';
  pic.steps.forEach((s, i) => {
    const label = s && s.label ? s.label : s;
    const note = s && s.label ? s.note : null;
    const ls = wrap(say(label, lang), fit(bw, 10));
    const ns = note ? wrap(say(note, lang), fit(bw, 10)) : [];
    const h = (ls.length + ns.length) * LH + 16;
    out += `<rect class="pic-box pic-node" rx="8" x="12" y="${f(y)}" width="${bw}" height="${h}"/>`;
    out += lines(ls, 22, y + 8, 'pic-bold');
    out += lines(ns, 22, y + 8 + ls.length * LH, '');
    y += h;
    if (i < pic.steps.length - 1) {
      const x = PIC_W / 2;
      out += `<line class="pic-line" x1="${x}" y1="${f(y)}" x2="${x}" y2="${f(y + gap - 6)}"/><polygon class="pic-arrow" points="${x},${f(y + gap)} ${x - 6},${f(y + gap - 9)} ${x + 6},${f(y + gap - 9)}"/>`;
      y += gap;
    }
  });
  return { w: PIC_W, h: y, body: out };
}

function tree(pic, lang) {
  let y = 4;
  let out = '';
  const IND = 22;
  const place = (n, depth) => {
    const x = 8 + depth * IND;
    const ls = wrap(say(n.label, lang), fit(PIC_W - x - 14, 0));
    const top = y;
    y += ls.length * LH + 8;
    const mine = { x: x + 4, y: top + 4 + PIC_FONT / 2 + 2 };
    out += `<circle class="pic-dot" cx="${mine.x}" cy="${f(mine.y)}" r="4"/>`;
    out += lines(ls, x + 14, top + 4, depth === 0 ? 'pic-bold' : '');
    let last = null;
    for (const c of n.children || []) {
      const at = place(c, depth + 1);
      out += `<line class="pic-line" x1="${mine.x}" y1="${f(at.y)}" x2="${f(at.x)}" y2="${f(at.y)}"/>`;
      last = at;
    }
    if (last) out += `<line class="pic-line" x1="${mine.x}" y1="${f(mine.y + 4)}" x2="${mine.x}" y2="${f(last.y)}"/>`;
    return mine;
  };
  place(pic.root, 0);
  return { w: PIC_W, h: y + 4, body: out };
}

function timeline(pic, lang) {
  let y = 4;
  let out = '';
  const x0 = 14;
  let firstY = 0;
  let lastY = 0;
  pic.events.forEach((e, i) => {
    const ls = wrap(say(e.label, lang), fit(PIC_W - 36, 0));
    lastY = y + 2 + PIC_FONT / 2 + 2;
    if (i === 0) firstY = lastY;
    out += `<circle class="pic-dot" cx="${x0}" cy="${f(lastY)}" r="5"/>`;
    out += lines([say(e.at, lang)], 32, y + 2, 'pic-bold');
    out += lines(ls, 32, y + 2 + LH, '');
    y += (ls.length + 1) * LH + 14;
  });
  out = `<line class="pic-line" x1="${x0}" y1="${f(firstY)}" x2="${x0}" y2="${f(lastY)}"/>${out}`;
  return { w: PIC_W, h: y, body: out };
}

const DRAW = { table, grid, cycle, flow, tree, timeline };

// The picture as one <svg> string. `alt` is the lesson's alt text for this picture.
export function pictureSvg(pic, lang, alt = '') {
  const draw = DRAW[pic && pic.kind];
  if (!draw) return '';
  const { w, h, body } = draw(pic, lang === 'nl' ? 'nl' : 'en');
  return `<svg class="pic-svg pic-${pic.kind}" role="img" aria-label="${esc(alt)}" viewBox="0 0 ${w} ${Math.ceil(h) + 2}" preserveAspectRatio="xMidYMin meet" xmlns="http://www.w3.org/2000/svg"><title>${esc(alt)}</title>${body}</svg>`;
}

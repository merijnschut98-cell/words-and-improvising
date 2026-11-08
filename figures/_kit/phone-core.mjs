// Pure helpers for the figures' phone layout. No DOM: unit-tested in node, and
// inlined into every figure page (with "export " stripped) by phone.mjs.

// Below this frame width a figure switches to its phone layout.
export const PHONE_MAX = 480;
// Smallest text a reader gets on a phone, in CSS px.
export const MIN_TEXT = 11;
// SVG text may grow this much to reach MIN_TEXT; smaller text is hidden on the
// phone frame and comes back in full screen or when zoomed in.
export const MAX_GROW = 1.6;

export const isPhone = (width) => width > 0 && width < PHONE_MAX;

// The page's parameters: the URL, or the frame name when the app hands the page
// over as srcdoc (a srcdoc page has no query string of its own).
export const searchOf = (search, name) => (search && search.length > 1 ? search
  : typeof name === 'string' && name.charAt(0) === '?' ? name : '');

export function levelOf(search) {
  const n = parseInt(new URLSearchParams(search || '').get('level'), 10);
  return n >= 1 && n <= 4 ? n : 0;
}

// Boxes are [x, y, w, h] in the drawing's user units.
export function unionBox(boxes) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const b of boxes) {
    if (!b || !(b[2] > 0) || !(b[3] > 0)) continue;
    x0 = Math.min(x0, b[0]); y0 = Math.min(y0, b[1]);
    x1 = Math.max(x1, b[0] + b[2]); y1 = Math.max(y1, b[1] + b[3]);
  }
  return x1 > x0 ? [x0, y0, x1 - x0, y1 - y0] : null;
}

export function intersectBox(a, b) {
  if (!a || !b) return a || b || null;
  const x0 = Math.max(a[0], b[0]), y0 = Math.max(a[1], b[1]);
  const x1 = Math.min(a[0] + a[2], b[0] + b[2]), y1 = Math.min(a[1] + a[3], b[1] + b[3]);
  return x1 > x0 && y1 > y0 ? [x0, y0, x1 - x0, y1 - y0] : null;
}

// The phone camera: the drawn content (or the build's crop for this level),
// inside the page's own viewBox, with a little air around it. A crop that is
// too narrow for the frame is widened around its centre, never past the viewBox.
export function cropBox(content, viewBox, { pad = 0.04, minAspect = 0.75 } = {}) {
  let box = intersectBox(content, viewBox);
  if (!box) return viewBox;
  const px = box[2] * pad, py = box[3] * pad;
  box = [box[0] - px, box[1] - py, box[2] + 2 * px, box[3] + 2 * py];
  if (box[2] / box[3] < minAspect) {
    const w = box[3] * minAspect;
    box = [box[0] - (w - box[2]) / 2, box[1], w, box[3]];
  }
  const out = intersectBox(box, viewBox) || viewBox;
  return out.map((v) => Math.round(v * 100) / 100);
}

// The build's crop for a level: { 1: [x,y,w,h], ..., all: [...] }.
export function levelCrop(crops, level) {
  if (!crops) return null;
  const c = crops[level] || crops.all;
  return Array.isArray(c) && c.length === 4 && c[2] > 0 && c[3] > 0 ? c : null;
}

// What to do with text of a given rendered size: leave it, grow it by a
// factor, or hide it (too small to save without breaking the drawing).
export function textFix(px, min = MIN_TEXT, maxGrow = MAX_GROW) {
  if (!(px > 0) || px >= min - 0.05) return { op: 'keep' };
  const grow = min / px;
  return grow <= maxGrow ? { op: 'grow', factor: Math.round(grow * 1000) / 1000 } : { op: 'hide' };
}

// The frame height the phone layout asks the app for: the drawing at full
// width in its crop's proportions, plus the rows around it. Never so wide that
// the drawing is a strip, never taller than the screen allows.
export function phoneHeight(width, crop, chrome, { minRatio = 0.42, maxRatio = 1.3, max = Infinity } = {}) {
  const ratio = crop && crop[2] > 0 ? crop[3] / crop[2] : 0.75;
  const draw = width * Math.min(maxRatio, Math.max(minRatio, ratio));
  return Math.round(Math.min(max, draw + chrome));
}

// Pinch zoom in full screen: the viewBox scaled by k around a point in user
// units, kept inside the home box; k <= 1 gives the home box back.
export function zoomBox(home, k, cx, cy) {
  if (!(k > 1)) return home.slice();
  const w = home[2] / k, h = home[3] / k;
  let x = cx - (cx - home[0]) / k, y = cy - (cy - home[1]) / k;
  x = Math.min(Math.max(x, home[0]), home[0] + home[2] - w);
  y = Math.min(Math.max(y, home[1]), home[1] + home[3] - h);
  return [x, y, w, h];
}
